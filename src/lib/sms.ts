/**
 * sms.ts — SMS provider abstraction layer
 *
 * Routes OTP delivery to the correct provider based on OTP_PROVIDER env var.
 * Route handlers call sendOtp() and never reference providers directly,
 * so switching providers requires only an env variable change.
 *
 * Supported providers:
 *   OTP_PROVIDER=none    → no SMS sent, OTP is returned in API response (dev)
 *   OTP_PROVIDER=msg91   → sends via MSG91 API (recommended for India)
 *   OTP_PROVIDER=twilio  → sends via Twilio SDK (international)
 */

import {
  getOtpProvider,
  getMsg91AuthKey,
  getMsg91TemplateId,
  getTwilioAccountSid,
  getTwilioAuthToken,
  getTwilioPhoneNumber,
} from './env';

// ---------------------------------------------------------------------------
// Result type
// ---------------------------------------------------------------------------

interface SmsSendResult {
  sent: boolean;   // true = SMS was dispatched
  simulated: boolean; // true = OTP_PROVIDER=none (dev mode)
}

// ---------------------------------------------------------------------------
// Provider implementations
// ---------------------------------------------------------------------------

async function sendViaMSG91(phone: string, otp: string): Promise<void> {
  const authKey = getMsg91AuthKey();
  const templateId = getMsg91TemplateId();

  // Normalize: MSG91 expects country code prefix, no '+'
  const cleanPhone = phone.replace(/\D/g, '');
  const recipient = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  const response = await fetch('https://api.msg91.com/api/v5/otp', {
    method: 'POST',
    headers: {
      'authkey': authKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      template_id: templateId,
      mobile: recipient,
      otp,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'unknown error');
    throw new Error(`MSG91 API error (${response.status}): ${errorBody}`);
  }
}

async function sendViaTwilio(phone: string, otp: string): Promise<void> {
  // Dynamic import to avoid crashes when the 'twilio' package is not installed
  const twilioModule = await import('twilio').catch(() => null);
  if (!twilioModule) {
    throw new Error(
      'Twilio SDK not installed. Run: npm install twilio'
    );
  }

  const accountSid = getTwilioAccountSid();
  const authToken = getTwilioAuthToken();
  const fromNumber = getTwilioPhoneNumber();

  const client = twilioModule.default(accountSid, authToken);

  // Normalize: Twilio requires E.164 format (+91XXXXXXXXXX)
  const cleanPhone = phone.replace(/\D/g, '');
  const to = cleanPhone.startsWith('+')
    ? cleanPhone
    : `+${cleanPhone.length === 10 ? '91' : ''}${cleanPhone}`;

  await client.messages.create({
    body: `Your Kashmiri Organic verification code is ${otp}. Valid for 5 minutes. Do not share this code.`,
    from: fromNumber,
    to,
  });
}

// ---------------------------------------------------------------------------
// Public dispatcher — the only function route handlers should call
// ---------------------------------------------------------------------------

/**
 * Dispatches an OTP to the given phone number using the configured provider.
 *
 * @param phone - Raw phone number string (digits only, with or without country code)
 * @param otp   - The 6-digit OTP to deliver
 * @returns SmsSendResult indicating whether SMS was sent or simulated
 * @throws Error if provider is configured but delivery fails
 */
export async function sendOtp(phone: string, otp: string): Promise<SmsSendResult> {
  const provider = getOtpProvider();

  switch (provider) {
    case 'msg91':
      await sendViaMSG91(phone, otp);
      return { sent: true, simulated: false };

    case 'twilio':
      await sendViaTwilio(phone, otp);
      return { sent: true, simulated: false };

    case 'none':
    default:
      // Development / test mode — OTP will be returned in the API response
      console.log(`\n[OTP Simulated | OTP_PROVIDER=none]\nPhone: ${phone}\nOTP:   ${otp}\n`);
      return { sent: false, simulated: true };
  }
}
