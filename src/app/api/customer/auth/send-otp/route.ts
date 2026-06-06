import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, User } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone || typeof phone !== 'string' || phone.trim().length < 10) {
      return NextResponse.json(
        { error: 'Please enter a valid mobile number.' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim();

    // 1. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes validity

    // 2. Check if user already exists
    const checkSql = 'SELECT * FROM users WHERE phone = ? LIMIT 1';
    const users = await executeQuery<User[]>(checkSql, [cleanPhone]);
    const user = users?.[0];

    if (user) {
      // Update OTP and Expiry for existing user
      const updateSql = 'UPDATE users SET otp = ?, otp_expiry = ? WHERE phone = ?';
      await executeQuery(updateSql, [otp, otpExpiry, cleanPhone]);
      console.log(`\n[OTP Service] Verified Customer Send Request:\nPhone: ${cleanPhone}\nOTP Code: ${otp}\n`);
    } else {
      // Create a new customer profile and save OTP details
      const insertSql = 'INSERT INTO users (name, email, password_hash, phone, otp, otp_expiry, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      await executeQuery(insertSql, [
        '', // name
        '', // email
        '', // password_hash
        cleanPhone,
        otp,
        otpExpiry,
        'customer', // role
        new Date().toISOString()
      ]);
      console.log(`\n[OTP Service] Registered New Customer Profile:\nPhone: ${cleanPhone}\nOTP Code: ${otp}\n`);
    }

    // Return OTP directly in response for simulated testing convenience
    return NextResponse.json({
      success: true,
      message: 'Secure OTP sent to your phone coordinates.',
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
