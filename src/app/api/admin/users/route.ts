import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, User } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'kashmiri-organic-valley-secret-key-2026';

// Helper to verify admin credentials
async function getAdminUser(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== 'admin') return null;
    return decoded;
  } catch (err) {
    return null;
  }
}

// GET: Retrieve all users in the system
export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminUser(req);
    if (!admin) {
      return NextResponse.json({ error: 'Administrative clearance required.' }, { status: 401 });
    }

    const sql = 'SELECT * FROM users ORDER BY id DESC';
    const rawUsers = await executeQuery<User[]>(sql);

    // Sanitize user data
    const users = (rawUsers || []).map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      created_at: user.created_at
    }));

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error('Admin users GET exception:', error);
    return NextResponse.json({ error: 'Failed to retrieve user register.' }, { status: 500 });
  }
}

// DELETE: Remove a user
export async function DELETE(req: NextRequest) {
  try {
    const admin = await getAdminUser(req);
    if (!admin) {
      return NextResponse.json({ error: 'Administrative clearance required.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userIdStr = searchParams.get('id');

    if (!userIdStr) {
      return NextResponse.json({ error: 'Target user ID is required.' }, { status: 400 });
    }

    const userId = Number(userIdStr);

    // Prevent self-deletion
    if (userId === admin.id) {
      return NextResponse.json({ error: 'Self-deletion of active administrative account is blocked.' }, { status: 403 });
    }

    const sql = 'DELETE FROM users WHERE id = ?';
    await executeQuery(sql, [userId]);

    return NextResponse.json({ success: true, message: 'User record removed from registry.' });
  } catch (error: any) {
    console.error('Admin users DELETE exception:', error);
    return NextResponse.json({ error: 'Failed to delete user record.' }, { status: 500 });
  }
}
