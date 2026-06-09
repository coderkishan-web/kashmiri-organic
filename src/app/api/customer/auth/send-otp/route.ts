import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, User } from '@/lib/db';
import { validateEnvConfig, getOtpProvider } from '@/lib/env';
import { checkSendRateLimit, recordOtpSend } from '@/lib/rate-limit';
import { sendOtp } from '@/lib/sms';
import { sendVerificationEmail } from '@/lib/email';

// ---------------------------------------------------------------------------
// Input validation helpers
// ---------------------------------------------------------------------------

const isValidEmail = (input: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);

const isValidPhone = (input: string): boolean => {
  const digits = input.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 13;
};

// ---------------------------------------------------------------------------
// POST /api/customer/auth/send-otp
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    // Validate environment config on every request (throws in misconfigured production)
    validateEnvConfig();

    // ------ Parse & validate input ------
    const body = await req.json().catch(() => ({}));
    const rawInput = ((body.identifier || body.phone || body.email || '') as string).trim();

    if (!rawInput) {
      return NextResponse.json(
        { error: 'Please enter a valid mobile number or email address.' },
        { status: 400 }
      );
    }

    const isEmail = rawInput.includes('@');
    let cleanIdentifier = '';

    if (isEmail) {
      if (!isValidEmail(rawInput)) {
        return NextResponse.json(
          { error: 'Please enter a valid email address.' },
          { status: 400 }
        );
      }
      cleanIdentifier = rawInput.toLowerCase();
    } else {
      const digits = rawInput.replace(/\D/g, '');
      if (!isValidPhone(rawInput)) {
        return NextResponse.json(
          { error: 'Please enter a valid mobile number (at least 10 digits).' },
          { status: 400 }
        );
      }
      cleanIdentifier = digits;
    }

    // ------ Rate limiting (1 OTP per identifier per 60 seconds) ------
    const rateCheck = checkSendRateLimit(cleanIdentifier);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Please wait ${rateCheck.retryAfterSeconds} seconds before requesting another code.`,
          retryAfterSeconds: rateCheck.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    // ------ Generate OTP (6 digits) ------
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

    // ------ Upsert user in DB ------
    const checkSql = isEmail
      ? 'SELECT * FROM users WHERE email = ? LIMIT 1'
      : 'SELECT * FROM users WHERE phone = ? LIMIT 1';

    const users = await executeQuery<User[]>(checkSql, [cleanIdentifier]);
    const user = users?.[0];

    if (user) {
      // Existing user — update OTP + reset attempt counter
      const updateSql =
        'UPDATE users SET otp = ?, otp_expiry = ?, otp_attempts = 0, last_otp_request_at = ? WHERE id = ?';
      await executeQuery(updateSql, [otp, otpExpiry, new Date().toISOString(), user.id]);
    } else {
      // New customer — create minimal profile
      const insertSql =
        'INSERT INTO users (name, email, password_hash, phone, otp, otp_expiry, otp_attempts, last_otp_request_at, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      await executeQuery(insertSql, [
        '',                                              // name (filled later)
        isEmail ? cleanIdentifier : '',                  // email
        '',                                              // password_hash (not used for OTP auth)
        isEmail ? null : cleanIdentifier,                // phone
        otp,
        otpExpiry,
        0,                                               // otp_attempts
        new Date().toISOString(),                        // last_otp_request_at
        'customer',
        new Date().toISOString(),
      ]);
    }

    // ------ Record rate-limit send timestamp ------
    recordOtpSend(cleanIdentifier);

    // ------ Dispatch OTP / Email & Mobile Dispatch ------
    const otpProvider = getOtpProvider();

    if (isEmail) {
      const emailSuccess = await sendVerificationEmail(cleanIdentifier, otp);
      if (!emailSuccess) {
        return NextResponse.json(
          { error: 'Failed to send verification code email. Please try again.' },
          { status: 503 }
        );
      }
    } else {
      // Phone-based auth
      try {
        await sendOtp(cleanIdentifier, otp);
      } catch (smsError: any) {
        // Log the real error server-side — return a generic error to the client
        console.error('[send-otp] SMS dispatch failed:', smsError?.message ?? smsError);
        return NextResponse.json(
          { error: 'Failed to send verification code. Please try again.' },
          { status: 503 }
        );
      }
    }

    // ------ Build response ------
    const responsePayload: Record<string, unknown> = {
      success: true,
      message: isEmail
        ? 'Verification code sent to your email address.'
        : otpProvider === 'none'
        ? 'OTP generated. Check response/screen for code (development mode).'
        : 'Verification code sent successfully.',
    };

    // OTP is returned in the API response ONLY for phone-based logins when no SMS API is active.
    if (otpProvider === 'none' && !isEmail) {
      responsePayload.otp = otp;
    }

    return NextResponse.json(responsePayload);
  } catch (error: any) {
    console.error('[send-otp] Unhandled exception:', error?.message ?? error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
