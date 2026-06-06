import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, User } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'kashmiri-organic-valley-secret-key-2026';

export async function POST(req: NextRequest) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { error: 'Mobile number and verification code are required.' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim();
    const cleanOtp = otp.trim();

    // 1. Fetch user by phone
    const sql = 'SELECT * FROM users WHERE phone = ? LIMIT 1';
    const users = await executeQuery<User[]>(sql, [cleanPhone]);
    const user = users?.[0];

    if (!user || !user.otp || !user.otp_expiry) {
      return NextResponse.json(
        { error: 'No verification request active for this number.' },
        { status: 400 }
      );
    }

    // 2. Verify OTP code
    if (user.otp !== cleanOtp) {
      return NextResponse.json(
        { error: 'Invalid verification code.' },
        { status: 401 }
      );
    }

    // 3. Verify OTP expiry
    const expiryTime = new Date(user.otp_expiry).getTime();
    if (expiryTime < Date.now()) {
      return NextResponse.json(
        { error: 'Verification code expired. Please request a new one.' },
        { status: 410 }
      );
    }

    // 4. Success: Clear OTP credentials
    const clearSql = 'UPDATE users SET otp = ?, otp_expiry = ? WHERE phone = ?';
    await executeQuery(clearSql, [null, null, cleanPhone]);

    // 5. Generate Customer JWT Session
    const token = jwt.sign(
      {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' } // Customers stay logged in for 7 days
    );

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful.',
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // Set JWT in HTTP-Only cookie
    response.cookies.set({
      name: 'customer_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;

  } catch (error: any) {
    console.error('OTP Verify API exception:', error);
    return NextResponse.json(
      { error: 'Verification protocol failed. Please request a new code.' },
      { status: 500 }
    );
  }
}
