import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, Inquiry } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'kashmiri-organic-valley-secret-key-2026';

// Helper to verify admin
async function verifyAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== 'admin' && decoded.role !== 'super_admin') return null;
    return decoded;
  } catch (e) {
    return null;
  }
}

// GET all inquiries
export async function GET(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Administrative clearance required.' }, { status: 401 });
  }

  try {
    // Select all inquiries, sorted by newest first
    const inquiries = await executeQuery<Inquiry[]>('SELECT * FROM inquiries ORDER BY created_at DESC');
    return NextResponse.json({ inquiries });
  } catch (err: any) {
    return NextResponse.json({ error: 'Query execution failed.' }, { status: 500 });
  }
}

// PUT edit status of inquiry
export async function PUT(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Administrative clearance required.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Inquiry ID and target status are required.' }, { status: 400 });
    }

    const sql = 'UPDATE inquiries SET status = ? WHERE id = ?';
    await executeQuery(sql, [status, Number(id)]);

    return NextResponse.json({ success: true, message: 'Inquiry status updated successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: 'SQL query update failed.' }, { status: 500 });
  }
}

// DELETE delete inquiry record
export async function DELETE(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Administrative clearance required.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Inquiry target ID is required.' }, { status: 400 });
    }

    const sql = 'DELETE FROM inquiries WHERE id = ?';
    await executeQuery(sql, [Number(id)]);

    return NextResponse.json({ success: true, message: 'Inquiry record removed from database.' });
  } catch (err: any) {
    return NextResponse.json({ error: 'SQL query deletion failed.' }, { status: 500 });
  }
}
