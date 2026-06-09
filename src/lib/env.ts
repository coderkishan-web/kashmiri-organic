/**
 * env.ts — Server-side environment variable validator & typed accessor
 *
 * USAGE: Import and call getEnvConfig() at the top of any server route
 * to validate critical variables exist before processing requests.
 * All exported getters throw descriptive errors if a required variable
 * is missing in production, so misconfigured deployments fail loudly.
 *
 * NEVER import this from client components — all exports are server-only.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PaymentMode = 'mock' | 'stripe';
export type OtpProvider = 'none' | 'msg91' | 'twilio';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined || value === '') {
    throw new Error(
      `[env] Missing required environment variable: "${key}". ` +
        `Please add it to your .env.local file. See .env.local.example for guidance.`
    );
  }
  return value;
};

const getEnvOptional = (key: string): string | undefined => {
  return process.env[key] || undefined;
};

// ---------------------------------------------------------------------------
// Mode helpers
// ---------------------------------------------------------------------------

/** Returns true when NODE_ENV is 'production'. */
export const isProduction = (): boolean => process.env.NODE_ENV === 'production';

/**
 * Returns the configured payment mode.
 * Defaults to 'mock' in development, requires explicit 'stripe' for production.
 *
 * SAFETY CHECK: throws a startup error if NODE_ENV=production and PAYMENT_MODE=mock.
 * This prevents accidentally running production without real payments.
 */
export const getPaymentMode = (): PaymentMode => {
  const raw = (process.env.PAYMENT_MODE || 'mock').toLowerCase();

  if (raw !== 'mock' && raw !== 'stripe') {
    throw new Error(
      `[env] PAYMENT_MODE must be either "mock" or "stripe". Got: "${raw}".`
    );
  }

  const mode = raw as PaymentMode;

  // Production safety guard
  if (isProduction() && mode === 'mock') {
    throw new Error(
      `[env] FATAL: PAYMENT_MODE=mock is not allowed in production (NODE_ENV=production). ` +
        `Set PAYMENT_MODE=stripe and configure Stripe credentials before deploying.`
    );
  }

  return mode;
};

/**
 * Returns the configured OTP provider.
 * Defaults to 'none' (OTP returned in response, no SMS sent).
 */
export const getOtpProvider = (): OtpProvider => {
  const raw = (process.env.OTP_PROVIDER || 'none').toLowerCase();

  if (raw !== 'none' && raw !== 'msg91' && raw !== 'twilio') {
    throw new Error(
      `[env] OTP_PROVIDER must be one of: "none", "msg91", "twilio". Got: "${raw}".`
    );
  }

  return raw as OtpProvider;
};

// ---------------------------------------------------------------------------
// Credential getters — throw if called without the required variable set
// ---------------------------------------------------------------------------

/** Returns JWT_SECRET. Has a development fallback to prevent crashes. */
export const getJwtSecret = (): string => {
  return (
    process.env.JWT_SECRET ||
    (isProduction()
      ? (() => {
          throw new Error(
            `[env] JWT_SECRET must be set in production. ` +
              `Generate a secure random string (e.g., openssl rand -base64 32).`
          );
        })()
      : 'kashmiri-organic-valley-secret-key-2026')
  );
};

/** Returns STRIPE_SECRET_KEY. Required when PAYMENT_MODE=stripe. */
export const getStripeSecretKey = (): string => {
  return getEnv('STRIPE_SECRET_KEY');
};

/** Returns STRIPE_WEBHOOK_SECRET. Required when PAYMENT_MODE=stripe. */
export const getStripeWebhookSecret = (): string => {
  return getEnv('STRIPE_WEBHOOK_SECRET');
};

/** Returns MSG91_AUTH_KEY. Required when OTP_PROVIDER=msg91. */
export const getMsg91AuthKey = (): string => {
  return getEnv('MSG91_AUTH_KEY');
};

/** Returns MSG91_TEMPLATE_ID. Required when OTP_PROVIDER=msg91. */
export const getMsg91TemplateId = (): string => {
  return getEnv('MSG91_TEMPLATE_ID');
};

/** Returns TWILIO_ACCOUNT_SID. Required when OTP_PROVIDER=twilio. */
export const getTwilioAccountSid = (): string => {
  return getEnv('TWILIO_ACCOUNT_SID');
};

/** Returns TWILIO_AUTH_TOKEN. Required when OTP_PROVIDER=twilio. */
export const getTwilioAuthToken = (): string => {
  return getEnv('TWILIO_AUTH_TOKEN');
};

/** Returns TWILIO_PHONE_NUMBER. Required when OTP_PROVIDER=twilio. */
export const getTwilioPhoneNumber = (): string => {
  return getEnv('TWILIO_PHONE_NUMBER');
};

/** Returns NEXT_PUBLIC_APP_URL for building Stripe redirect URLs. */
export const getAppUrl = (): string => {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};

// ---------------------------------------------------------------------------
// Startup validation — call once in server entry points for early failure
// ---------------------------------------------------------------------------

/**
 * Validates all required environment variables based on active modes.
 * Call this at the top of critical API routes.
 *
 * Throws a descriptive error if any required variable is missing,
 * preventing silent misconfiguration from reaching real users.
 */
export const validateEnvConfig = (): void => {
  // Always validate payment mode (triggers production safety check)
  const paymentMode = getPaymentMode();
  const otpProvider = getOtpProvider();

  if (paymentMode === 'stripe') {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error(
        '[env] PAYMENT_MODE=stripe requires STRIPE_SECRET_KEY to be set.'
      );
    }
    if (!process.env.STRIPE_WEBHOOK_SECRET && isProduction()) {
      throw new Error(
        '[env] PAYMENT_MODE=stripe in production requires STRIPE_WEBHOOK_SECRET to be set.'
      );
    }
  }

  if (otpProvider === 'msg91') {
    if (!process.env.MSG91_AUTH_KEY || !process.env.MSG91_TEMPLATE_ID) {
      throw new Error(
        '[env] OTP_PROVIDER=msg91 requires MSG91_AUTH_KEY and MSG91_TEMPLATE_ID to be set.'
      );
    }
  }

  if (otpProvider === 'twilio') {
    if (
      !process.env.TWILIO_ACCOUNT_SID ||
      !process.env.TWILIO_AUTH_TOKEN ||
      !process.env.TWILIO_PHONE_NUMBER
    ) {
      throw new Error(
        '[env] OTP_PROVIDER=twilio requires TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER to be set.'
      );
    }
  }

  // Validate SMTP config
  const emailProvider = (process.env.EMAIL_PROVIDER || 'none').toLowerCase();
  if (emailProvider === 'smtp') {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error(
        '[env] EMAIL_PROVIDER=smtp requires SMTP_HOST, SMTP_USER, and SMTP_PASS to be set.'
      );
    }
  }
};
