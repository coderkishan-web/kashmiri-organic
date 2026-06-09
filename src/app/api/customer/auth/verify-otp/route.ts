import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, User } from '@/lib/db';
import { validateEnvConfig, getJwtSecret } from '@/lib/env';
import {
  checkVerifyRateLimit,
  recordFailedVerification,
  clearVerifyRecord,
} from '@/lib/rate-limit';
import jwt from 'jsonwebtoken';

// ---------------------------------------------------------------------------
// Input validation helpers
// ---------------------------------------------------------------------------

const isValidOtp = (otp: string): boolean => /^\d{6}$/.test(otp);

// Constant-time string comparison to prevent timing-based OTP enumeration attacks
const safeCompare = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
};

// ---------------------------------------------------------------------------
// POST /api/customer/auth/verify-otp
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    // Validate environment config on every request
    validateEnvConfig();

    // ------ Parse & validate input ------
    const body = await req.json().catch(() => ({}));
    const rawInput = ((body.identifier || body.phone || body.email || '') as string).trim();
    const rawOtp = ((body.otp || '') as string).trim();

    if (!rawInput) {
      return NextResponse.json(
        { error: 'Mobile number or email address is required.' },
        { status: 400 }
      );
    }

    if (!rawOtp) {
      return NextResponse.json(
        { error: 'Verification code is required.' },
        { status: 400 }
      );
    }

    if (!isValidOtp(rawOtp)) {
      return NextResponse.json(
        { error: 'Verification code must be exactly 6 digits.' },
        { status: 400 }
      );
    }

    const isEmail = rawInput.includes('@');
    const cleanIdentifier = isEmail
      ? rawInput.toLowerCase()
      : rawInput.replace(/\D/g, '');

    // ------ Verify attempt rate limit (max 5 attempts, 15-min lockout) ------
    const verifyLimit = checkVerifyRateLimit(cleanIdentifier);
    if (!verifyLimit.allowed) {
      const lockedUntilDate = new Date(verifyLimit.lockedUntilMs);
      const minutesRemaining = Math.ceil(
        (verifyLimit.lockedUntilMs - Date.now()) / 60000
      );
      console.warn(
        `[verify-otp] Identifier "${cleanIdentifier}" is locked until ${lockedUntilDate.toISOString()}`
      );
      return NextResponse.json(
        {
          error: `Too many failed attempts. Please try again in ${minutesRemaining} minute${minutesRemaining === 1 ? '' : 's'}.`,
          lockedUntil: lockedUntilDate.toISOString(),
        },
        { status: 429 }
      );
    }

    // ------ Fetch user from DB ------
    const sql = isEmail
      ? 'SELECT * FROM users WHERE email = ? LIMIT 1'
      : 'SELECT * FROM users WHERE phone = ? LIMIT 1';

    const users = await executeQuery<User[]>(sql, [cleanIdentifier]);
    const user = users?.[0];

    if (!user || !user.otp || !user.otp_expiry) {
      return NextResponse.json(
        { error: 'No active verification request found. Please request a new code.' },
        { status: 400 }
      );
    }

    // ------ Verify OTP expiry ------
    const expiryTime = new Date(user.otp_expiry).getTime();
    if (expiryTime < Date.now()) {
      return NextResponse.json(
        { error: 'Verification code has expired. Please request a new one.' },
        { status: 410 }
      );
    }

    // ------ Verify OTP value (constant-time comparison) ------
    if (!safeCompare(user.otp, rawOtp)) {
      // Record failed attempt — may trigger lockout
      const failResult = recordFailedVerification(cleanIdentifier);

      if (failResult.locked) {
        const minutesRemaining = Math.ceil(
          (failResult.lockedUntilMs - Date.now()) / 60000
        );
        console.warn(
          `[verify-otp] Identifier "${cleanIdentifier}" locked after ${5} failed attempts.`
        );
        return NextResponse.json(
          {
            error: `Too many failed attempts. Account locked for ${minutesRemaining} minute${minutesRemaining === 1 ? '' : 's'}.`,
            lockedUntil: new Date(failResult.lockedUntilMs).toISOString(),
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error: 'Invalid verification code.',
          attemptsRemaining: failResult.attemptsRemaining,
        },
        { status: 401 }
      );
    }

    // ------ Verification success — clear OTP data from DB ------
    const clearSql =
      'UPDATE users SET otp = ?, otp_expiry = ?, otp_attempts = 0 WHERE id = ?';
    await executeQuery(clearSql, [null, null, user.id]);

    // Clear in-memory rate limit record
    clearVerifyRecord(cleanIdentifier);

    // ------ Generate JWT session ------
    const JWT_SECRET = getJwtSecret();
    const token = jwt.sign(
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

    // ------ Build response ------
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
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('[verify-otp] Unhandled exception:', error?.message ?? error);
    return NextResponse.json(
      { error: 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}
