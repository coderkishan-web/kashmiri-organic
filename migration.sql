-- ============================================================
-- Kashmiri Organic — Database Migration
-- Run this on your MySQL database before deploying to production.
-- Safe to run multiple times (uses IF NOT EXISTS / IF EXISTS).
-- ============================================================


-- ============================================================
-- 1. USERS TABLE — Add OTP tracking fields
-- ============================================================

ALTER TABLE `users`
  ADD COLUMN IF NOT EXISTS `otp_attempts` INT DEFAULT 0 AFTER `otp_expiry`,
  ADD COLUMN IF NOT EXISTS `last_otp_request_at` VARCHAR(100) NULL AFTER `otp_attempts`;


-- ============================================================
-- 2. ORDERS TABLE — Add Stripe payment reconciliation fields
--    and coupon/discount fields
-- ============================================================

ALTER TABLE `orders`
  ADD COLUMN IF NOT EXISTS `stripe_session_id` VARCHAR(255) NULL AFTER `payment_method`,
  ADD COLUMN IF NOT EXISTS `stripe_payment_intent_id` VARCHAR(255) NULL AFTER `stripe_session_id`,
  ADD COLUMN IF NOT EXISTS `payment_confirmed_at` VARCHAR(100) NULL AFTER `stripe_payment_intent_id`,
  ADD COLUMN IF NOT EXISTS `coupon_code` VARCHAR(100) NULL AFTER `payment_confirmed_at`,
  ADD COLUMN IF NOT EXISTS `discount_amount` DECIMAL(10,2) DEFAULT 0.00 AFTER `coupon_code`;


-- ============================================================
-- 3. ORDERS TABLE — Ensure all required status values are
--    valid. The status column already supports these values
--    via VARCHAR(50), but document them here for reference:
--
--    pending    → order created, payment not yet confirmed
--    paid       → payment confirmed (by webhook or mock)
--    processing → admin has acknowledged the order
--    shipped    → order dispatched with tracking
--    delivered  → customer confirmed delivery
--    cancelled  → order cancelled (before or after payment)
-- ============================================================


-- ============================================================
-- 4. CREATE ORDERS TABLE (if not exists — for fresh installs)
-- ============================================================

CREATE TABLE IF NOT EXISTS `orders` (
  `id` VARCHAR(100) PRIMARY KEY,
  `user_phone` VARCHAR(100) NOT NULL,
  `user_name` VARCHAR(255) NOT NULL,
  `user_email` VARCHAR(255) NULL,
  `items` LONGTEXT NOT NULL,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `status` VARCHAR(50) DEFAULT 'pending',
  `shipping_address` TEXT NOT NULL,
  `payment_method` VARCHAR(100) NOT NULL,
  `stripe_session_id` VARCHAR(255) NULL,
  `stripe_payment_intent_id` VARCHAR(255) NULL,
  `payment_confirmed_at` VARCHAR(100) NULL,
  `coupon_code` VARCHAR(100) NULL,
  `discount_amount` DECIMAL(10,2) DEFAULT 0.00,
  `created_at` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 5. Indexes for common query patterns
-- ============================================================

-- Speed up webhook lookup by stripe_session_id
CREATE INDEX IF NOT EXISTS `idx_orders_stripe_session`
  ON `orders` (`stripe_session_id`);

-- Speed up customer order history lookup
CREATE INDEX IF NOT EXISTS `idx_orders_user_phone`
  ON `orders` (`user_phone`);

-- Speed up payment intent lookup (for refunds/disputes)
CREATE INDEX IF NOT EXISTS `idx_orders_payment_intent`
  ON `orders` (`stripe_payment_intent_id`);
