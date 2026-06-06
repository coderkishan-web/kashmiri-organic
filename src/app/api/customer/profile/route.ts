import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, User } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'kashmiri-organic-valley-secret-key-2026';

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get('customer_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized profile update.' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'Session expired.' }, { status: 401 });
    }

    const { name, email } = await req.json();

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'A valid name is required.' }, { status: 400 });
    }

    const cleanName = name.trim();
    const cleanEmail = (email || '').trim().toLowerCase();

    // Update user in database
    const updateSql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    await executeQuery(updateSql, [cleanName, cleanEmail, decoded.id]);

    // Retrieve updated user details
    const selectSql = 'SELECT * FROM users WHERE id = ? LIMIT 1';
    const users = await executeQuery<User[]>(selectSql, [decoded.id]);
    const user = users?.[0];

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // Sign updated JWT
    const updatedToken = jwt.sign(
      {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set({
      name: 'customer_token',
      value: updatedToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Profile update API error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('customer_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized profile access.' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'Session expired.' }, { status: 401 });
    }

    // Retrieve user details
    const selectSql = 'SELECT id, name, email, phone, role, created_at FROM users WHERE id = ? LIMIT 1';
    const users = await executeQuery<User[]>(selectSql, [decoded.id]);
    const user = users?.[0];

    if (!user) {
      return NextResponse.json({ error: 'User coordinates not found.' }, { status: 404 });
    }

    // Query actual sourcing orders for this customer (inquiry_type = 'order' matching phone number)
    const ordersSql = 'SELECT id, created_at, message, status, product_id FROM inquiries WHERE phone = ? AND inquiry_type = \'order\' ORDER BY created_at DESC';
    const rawOrders = await executeQuery<any[]>(ordersSql, [user.phone]);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      orders: rawOrders,
    });
  } catch (error: any) {
    console.error('Profile query API error:', error);
    return NextResponse.json({ error: 'Failed to query profile coordinates.' }, { status: 500 });
  }
}
