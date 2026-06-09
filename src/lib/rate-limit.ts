/**
 * rate-limit.ts — In-memory OTP rate limiter
 *
 * DESIGN: The Map-based implementation is used for development and single-instance
 * deployments. The interface is kept intentionally thin so that a Redis adapter
 * can be swapped in later without modifying any route handler.
 *
 * LIMITS:
 *   - OTP send:   max 1 request per identifier per 60 seconds
 *   - OTP verify: max 5 failed attempts per identifier, then locked for 15 minutes
 *
 * NOTE: This in-memory store does NOT persist across server restarts.
 * For multi-instance production deployments, replace this module with a
 * Redis-backed equivalent that exposes the same interface.
 */

// ---------------------------------------------------------------------------
// Types — match this interface for a Redis replacement
// ---------------------------------------------------------------------------

interface OtpSendRecord {
  lastSentAt: number; // Unix timestamp in ms
}

interface OtpVerifyRecord {
  failedAttempts: number;
  lockedUntil: number | null; // Unix timestamp in ms, null = not locked
}

// ---------------------------------------------------------------------------
// In-Memory Stores
// ---------------------------------------------------------------------------

const sendStore = new Map<string, OtpSendRecord>();
const verifyStore = new Map<string, OtpVerifyRecord>();

// ---------------------------------------------------------------------------
// Configuration constants
// ---------------------------------------------------------------------------

const OTP_SEND_COOLDOWN_MS = 60 * 1000;        // 60 seconds between sends
const OTP_MAX_FAILED_ATTEMPTS = 5;              // max failed verifications
const OTP_LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15-minute lockout

// ---------------------------------------------------------------------------
// OTP Send Rate Limiter
// ---------------------------------------------------------------------------

/**
 * Checks whether the identifier is allowed to request a new OTP.
 * @returns { allowed: true } or { allowed: false, retryAfterSeconds: number }
 */
export function checkSendRateLimit(
  identifier: string
): { allowed: boolean; retryAfterSeconds: number } {
  const record = sendStore.get(identifier);

  if (!record) {
    return { allowed: true, retryAfterSeconds: 0 };
  }

  const elapsed = Date.now() - record.lastSentAt;
  if (elapsed < OTP_SEND_COOLDOWN_MS) {
    const remaining = Math.ceil((OTP_SEND_COOLDOWN_MS - elapsed) / 1000);
    return { allowed: false, retryAfterSeconds: remaining };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

/**
 * Records a successful OTP send for the given identifier.
 * Call this immediately after the OTP is stored in the database.
 */
export function recordOtpSend(identifier: string): void {
  sendStore.set(identifier, { lastSentAt: Date.now() });
}

// ---------------------------------------------------------------------------
// OTP Verification Attempt Limiter
// ---------------------------------------------------------------------------

/**
 * Checks whether the identifier is allowed to attempt OTP verification.
 * @returns { allowed: true } or { allowed: false, lockedUntilMs: number }
 */
export function checkVerifyRateLimit(
  identifier: string
): { allowed: boolean; lockedUntilMs: number } {
  const record = verifyStore.get(identifier);

  if (!record) {
    return { allowed: true, lockedUntilMs: 0 };
  }

  // Check if currently locked
  if (record.lockedUntil !== null && Date.now() < record.lockedUntil) {
    return { allowed: false, lockedUntilMs: record.lockedUntil };
  }

  // Lock has expired — reset the record automatically
  if (record.lockedUntil !== null && Date.now() >= record.lockedUntil) {
    verifyStore.delete(identifier);
    return { allowed: true, lockedUntilMs: 0 };
  }

  return { allowed: true, lockedUntilMs: 0 };
}

/**
 * Records a failed OTP verification attempt.
 * Automatically locks the identifier after OTP_MAX_FAILED_ATTEMPTS.
 * @returns { locked: true, lockedUntilMs } if the account just became locked,
 *          { locked: false, attemptsRemaining } otherwise.
 */
export function recordFailedVerification(
  identifier: string
): { locked: boolean; lockedUntilMs: number; attemptsRemaining: number } {
  const existing = verifyStore.get(identifier) ?? {
    failedAttempts: 0,
    lockedUntil: null,
  };

  const updated: OtpVerifyRecord = {
    failedAttempts: existing.failedAttempts + 1,
    lockedUntil: existing.lockedUntil,
  };

  if (updated.failedAttempts >= OTP_MAX_FAILED_ATTEMPTS) {
    updated.lockedUntil = Date.now() + OTP_LOCKOUT_DURATION_MS;
    verifyStore.set(identifier, updated);
    return { locked: true, lockedUntilMs: updated.lockedUntil, attemptsRemaining: 0 };
  }

  verifyStore.set(identifier, updated);
  return {
    locked: false,
    lockedUntilMs: 0,
    attemptsRemaining: OTP_MAX_FAILED_ATTEMPTS - updated.failedAttempts,
  };
}

/**
 * Clears all rate-limit state for an identifier after successful verification.
 */
export function clearVerifyRecord(identifier: string): void {
  verifyStore.delete(identifier);
}
