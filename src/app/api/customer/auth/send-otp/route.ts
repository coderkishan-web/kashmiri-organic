import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, User } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = (body.identifier || body.phone || body.email || '').trim();

    if (!input) {
      return NextResponse.json(
        { error: 'Please enter a valid email address or mobile number.' },
        { status: 400 }
      );
    }

    const isEmail = input.includes('@');
    let cleanPhone = '';
    let cleanEmail = '';

    if (isEmail) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input)) {
        return NextResponse.json(
          { error: 'Please enter a valid email address.' },
          { status: 400 }
        );
      }
      cleanEmail = input.toLowerCase();
    } else {
      // Validate phone format
      cleanPhone = input.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        return NextResponse.json(
          { error: 'Please enter a valid 10-digit mobile number.' },
          { status: 400 }
        );
      }
    }

    // 1. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes validity

    // 2. Check if user already exists
    const checkSql = isEmail
      ? 'SELECT * FROM users WHERE email = ? LIMIT 1'
      : 'SELECT * FROM users WHERE phone = ? LIMIT 1';
    
    const users = await executeQuery<User[]>(checkSql, [isEmail ? cleanEmail : cleanPhone]);
    const user = users?.[0];

    if (user) {
      // Update OTP and Expiry for existing user
      const updateSql = 'UPDATE users SET otp = ?, otp_expiry = ? WHERE id = ?';
      await executeQuery(updateSql, [otp, otpExpiry, user.id]);
      console.log(`\n[OTP Service] Verified Customer Send Request:\nIdentifier: ${isEmail ? cleanEmail : cleanPhone}\nOTP Code: ${otp}\n`);
    } else {
      // Create a new customer profile and save OTP details
      const insertSql = 'INSERT INTO users (name, email, password_hash, phone, otp, otp_expiry, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      await executeQuery(insertSql, [
        '', // name
        isEmail ? cleanEmail : '', // email
        '', // password_hash
        isEmail ? null : cleanPhone, // phone
        otp,
        otpExpiry,
        'customer', // role
        new Date().toISOString()
      ]);
      console.log(`\n[OTP Service] Registered New Customer Profile:\nIdentifier: ${isEmail ? cleanEmail : cleanPhone}\nOTP Code: ${otp}\n`);
    }

    // Return OTP directly in response for simulated testing convenience
    return NextResponse.json({
      success: true,
      message: 'Secure OTP generated.',
      otp, // Exposed for easy browser testing
    });

  } catch (error: any) {
    console.error('OTP Send API exception:', error);
    return NextResponse.json(
      { error: 'System failed to transmit verification token. Please try again.' },
      { status: 500 }
    );
  }
}
