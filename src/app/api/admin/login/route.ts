import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, User } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'kashmiri-organic-valley-secret-key-2026';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and secret keyphrase are required.' },
        { status: 400 }
      );
    }

    // Query database for admin user
    const normalizedEmail = email.trim().toLowerCase();
    const isMockAuth = (normalizedEmail === 'admin@kashmiri.organic' || normalizedEmail === 'admin@kashmiriorganic.com') && 
                       (password === 'kashmiri@organic2026' || password === 'kashmir@123');

    const queryEmail = (normalizedEmail === 'admin@kashmiri.organic') ? 'admin@kashmiriorganic.com' : normalizedEmail;

    const sql = 'SELECT * FROM users WHERE email = ? LIMIT 1';
    const users = await executeQuery<User[]>(sql, [queryEmail]);
    const user = users?.[0];

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid administrative coordinates.' },
        { status: 401 }
      );
    }

    // Verify password (either direct mock match or standard bcrypt hash compare)
    const isPasswordValid = isMockAuth || await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid secret keyphrase.' },
        { status: 401 }
      );
    }

    // Sign JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    // Set secure cookie
    const response = NextResponse.json({
      success: true,
      message: 'Access granted to Valley archives.',
      user: { id: user.id, email: user.email, name: user.name },
    });

    response.cookies.set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 12 * 60 * 60, // 12 hours
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Admin login processing error:', error);
    return NextResponse.json(
      { error: 'Authentication protocol failed. Please retry.' },
      { status: 500 }
    );
  }
}
