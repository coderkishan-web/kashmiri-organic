import { NextRequest, NextResponse } from 'next/server';
import { getStripeSecretKey, getStripeWebhookSecret } from '@/lib/env';
import { executeQuery } from '@/lib/db';

// ---------------------------------------------------------------------------
// IMPORTANT: Next.js App Router reads the body as a stream.
// We must read it as raw text for Stripe webhook signature verification.
// Do NOT use req.json() here — it will break signature validation.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Disable automatic body parsing — required for Stripe webhook verification
// ---------------------------------------------------------------------------
export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// POST /api/webhooks/stripe
//
// Receives Stripe events, verifies the signature, and processes:
//   - checkout.session.completed → update order status to 'paid'
//
// IDEMPOTENT: if the order is already 'paid', the webhook is a no-op.
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  let event: import('stripe').Stripe.Event;

  // ------ Read raw body for signature verification ------
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    console.error('[webhook/stripe] Missing stripe-signature header.');
    return NextResponse.json(
      { error: 'Missing stripe-signature header.' },
      { status: 400 }
    );
  }

  // ------ Verify webhook signature ------
  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(getStripeSecretKey(), {
      apiVersion: '2026-05-27.dahlia' as any,
    });

    const webhookSecret = getStripeWebhookSecret();
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    // Signature verification failed — likely a spoofed or tampered request
    console.error('[webhook/stripe] Signature verification failed:', err?.message ?? err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed.' },
      { status: 400 }
    );
  }

  // ------ Route events ------
  switch (event.type) {
    case 'checkout.session.completed': {
      await handleCheckoutSessionCompleted(
        event.data.object as import('stripe').Stripe.Checkout.Session
      );
      break;
    }

    case 'payment_intent.succeeded': {
      await handlePaymentIntentSucceeded(
        event.data.object as import('stripe').Stripe.PaymentIntent
      );
      break;
    }

    case 'payment_intent.payment_failed': {
      const intent = event.data.object as import('stripe').Stripe.PaymentIntent;
      console.warn(`[webhook/stripe] Payment failed for PaymentIntent ${intent.id}`);
      // Optionally update order status to 'payment_failed' here
      break;
    }

    default:
      // Silently acknowledge events we don't handle
      console.log(`[webhook/stripe] Received unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

// ---------------------------------------------------------------------------
// Handler: payment_intent.succeeded
// ---------------------------------------------------------------------------
async function handlePaymentIntentSucceeded(
  paymentIntent: import('stripe').Stripe.PaymentIntent
): Promise<void> {
  const orderId = paymentIntent.metadata?.orderId;

  if (!orderId) {
    console.error(
      `[webhook/stripe] payment_intent.succeeded event is missing orderId metadata. PaymentIntent ID: ${paymentIntent.id}`
    );
    return;
  }

  // ------ Fetch current order state ------
  const orders = await executeQuery<{ id: string; status: string }[]>(
    'SELECT id, status FROM orders WHERE id = ? LIMIT 1',
    [orderId]
  );

  const order = orders?.[0];

  if (!order) {
    console.error(
      `[webhook/stripe] Order "${orderId}" not found in database. PaymentIntent: ${paymentIntent.id}`
    );
    return;
  }

  // ------ IDEMPOTENCY CHECK ------
  if (order.status === 'paid') {
    console.log(
      `[webhook/stripe] Order "${orderId}" is already marked as paid. Skipping duplicate event.`
    );
    return;
  }

  const paymentConfirmedAt = new Date().toISOString();

  // ------ Update order to 'paid' with payment reconciliation fields ------
  await executeQuery(
    `UPDATE orders 
     SET status = ?,
         stripe_payment_intent_id = ?,
         payment_confirmed_at = ?
     WHERE id = ?`,
    ['paid', paymentIntent.id, paymentConfirmedAt, orderId]
  );

  console.log(
    `[webhook/stripe] ✓ Order "${orderId}" marked as PAID via PaymentIntent succeeded.\n` +
    `  PaymentIntent:   ${paymentIntent.id}\n` +
    `  ConfirmedAt:     ${paymentConfirmedAt}`
  );
}

// ---------------------------------------------------------------------------
// Handler: checkout.session.completed
// ---------------------------------------------------------------------------

async function handleCheckoutSessionCompleted(
  session: import('stripe').Stripe.Checkout.Session
): Promise<void> {
  const orderId = session.metadata?.orderId;

  if (!orderId) {
    console.error(
      `[webhook/stripe] checkout.session.completed event is missing orderId metadata. Session ID: ${session.id}`
    );
    return;
  }

  // ------ Fetch current order state ------
  const orders = await executeQuery<{ id: string; status: string }[]>(
    'SELECT id, status FROM orders WHERE id = ? LIMIT 1',
    [orderId]
  );

  const order = orders?.[0];

  if (!order) {
    console.error(
      `[webhook/stripe] Order "${orderId}" not found in database. Session: ${session.id}`
    );
    return;
  }

  // ------ IDEMPOTENCY CHECK ------
  // If the order is already paid, do nothing. This handles duplicate webhook delivery.
  if (order.status === 'paid') {
    console.log(
      `[webhook/stripe] Order "${orderId}" is already marked as paid. Skipping duplicate event.`
    );
    return;
  }

  // ------ Extract payment details from session ------
  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : (session.payment_intent?.id ?? null);

  const paymentConfirmedAt = new Date().toISOString();

  // ------ Update order to 'paid' with payment reconciliation fields ------
  await executeQuery(
    `UPDATE orders 
     SET status = ?,
         stripe_payment_intent_id = ?,
         payment_confirmed_at = ?
     WHERE id = ?`,
    ['paid', paymentIntentId, paymentConfirmedAt, orderId]
  );

  console.log(
    `[webhook/stripe] ✓ Order "${orderId}" marked as PAID.\n` +
    `  Session:         ${session.id}\n` +
    `  PaymentIntent:   ${paymentIntentId ?? 'n/a'}\n` +
    `  ConfirmedAt:     ${paymentConfirmedAt}`
  );
}
