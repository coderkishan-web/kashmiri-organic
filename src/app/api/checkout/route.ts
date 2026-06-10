import { NextRequest, NextResponse } from 'next/server';
import {
  validateEnvConfig,
  getPaymentMode,
  getStripeSecretKey,
  getAppUrl,
  getJwtSecret,
} from '@/lib/env';
import { executeQuery } from '@/lib/db';
import jwt from 'jsonwebtoken';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CartItem {
  id: number;
  quantity: number;
}

interface ShippingAddress {
  name: string;
  email: string;
  address: string;
  pinCode: string;
  city: string;
  country: string;
}

interface ProductRecord {
  id: number;
  name: string;
  image_url: string;
  price: number | null;
  discount_price: number | null;
  stock: number;
}

// ---------------------------------------------------------------------------
// Helper: generate a unique order ID
// ---------------------------------------------------------------------------

function generateOrderId(): string {
  return `KO-ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

// ---------------------------------------------------------------------------
// Helper: get authenticated customer from cookie
// ---------------------------------------------------------------------------

function getCustomerFromCookie(req: NextRequest): { id: number; phone: string; name: string; email: string } | null {
  try {
    const token = req.cookies.get('customer_token')?.value;
    if (!token) return null;
    const JWT_SECRET = getJwtSecret();
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return { id: decoded.id, phone: decoded.phone, name: decoded.name, email: decoded.email };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Helper: save order to JSON fallback DB or MySQL via executeQuery
// ---------------------------------------------------------------------------

async function createOrderRecord(orderData: Record<string, unknown>): Promise<void> {
  // executeQuery handles both MySQL and JSON fallback based on env
  const sql = `
    INSERT INTO orders 
    (id, user_phone, user_name, user_email, items, total_amount, status, shipping_address,
     payment_method, stripe_session_id, stripe_payment_intent_id, coupon_code, discount_amount, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  await executeQuery(sql, [
    orderData.id,
    orderData.user_phone,
    orderData.user_name,
    orderData.user_email,
    JSON.stringify(orderData.items),
    orderData.total_amount,
    orderData.status,
    JSON.stringify(orderData.shipping_address),
    orderData.payment_method,
    orderData.stripe_session_id ?? null,
    orderData.stripe_payment_intent_id ?? null,
    orderData.coupon_code ?? null,
    orderData.discount_amount ?? 0,
    orderData.created_at,
  ]);
}

// ---------------------------------------------------------------------------
// POST /api/checkout
//
// PAYMENT_MODE=mock  → creates order as 'paid', returns { success, order }
// PAYMENT_MODE=stripe → creates order as 'pending', returns { id, url } for redirect
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    // Validate env config — throws in misconfigured production
    validateEnvConfig();

    const paymentMode = getPaymentMode();

    // ------ Authenticate customer ------
    const customer = getCustomerFromCookie(req);
    if (!customer || (!customer.phone && !customer.email)) {
      return NextResponse.json(
        { error: 'You must be logged in to place an order.' },
        { status: 401 }
      );
    }

    // ------ Parse request body ------
    const body = await req.json().catch(() => ({}));
    const { items, shippingDetails, coupon_code, discount_amount } = body as {
      items: CartItem[];
      shippingDetails: ShippingAddress;
      coupon_code?: string;
      discount_amount?: number;
    };

    // ------ Basic input validation ------
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
    }

    if (!shippingDetails?.name || !shippingDetails?.address) {
      return NextResponse.json(
        { error: 'Shipping details are incomplete.' },
        { status: 400 }
      );
    }

    // ------ SERVER-SIDE PRICE VALIDATION ------
    // Fetch product records from DB by the IDs supplied by the client.
    // We NEVER trust the prices sent by the frontend.
    const productIds = items.map((i) => i.id);
    const placeholders = productIds.map(() => '?').join(', ');
    const productsSql = `SELECT id, name, image_url, price, discount_price, stock FROM products WHERE id IN (${placeholders})`;
    const dbProducts = await executeQuery<ProductRecord[]>(productsSql, productIds);

    // Build a lookup map
    const productMap = new Map<number, ProductRecord>(
      dbProducts.map((p) => [p.id, p])
    );

    // Validate every requested item and compute server-authoritative line items
    const validatedLineItems: Array<{
      id: number;
      name: string;
      image_url: string;
      unitPrice: number;
      quantity: number;
      lineTotal: number;
    }> = [];

    for (const item of items) {
      const product = productMap.get(item.id);
      if (!product) {
        return NextResponse.json(
          { error: `Product with ID ${item.id} not found.` },
          { status: 400 }
        );
      }
      if (!product.price && !product.discount_price) {
        return NextResponse.json(
          { error: `Product "${product.name}" does not have a price configured.` },
          { status: 400 }
        );
      }
      const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
      const unitPrice = Number(product.discount_price ?? product.price ?? 0);
      validatedLineItems.push({
        id: product.id,
        name: product.name,
        image_url: product.image_url,
        unitPrice,
        quantity: qty,
        lineTotal: unitPrice * qty,
      });
    }

    // Server-computed subtotal
    const subtotal = validatedLineItems.reduce((sum, li) => sum + li.lineTotal, 0);
    const SHIPPING_FEE = 350;
    const validatedDiscount = Math.min(Number(discount_amount ?? 0), subtotal);
    const serverTotal = Math.max(0, subtotal - validatedDiscount + SHIPPING_FEE);

    // ------ Generate order ID ------
    const orderId = generateOrderId();
    const now = new Date().toISOString();

    // ------ Shared order base record ------
    const orderBase = {
      id: orderId,
      user_phone: customer.phone || customer.email || 'N/A',
      user_name: customer.name || shippingDetails.name || 'Customer',
      user_email: customer.email || shippingDetails.email || '',
      items: validatedLineItems,
      total_amount: serverTotal,
      shipping_address: shippingDetails,
      payment_method: paymentMode === 'stripe' ? 'stripe_card' : 'mock',
      coupon_code: coupon_code ?? null,
      discount_amount: validatedDiscount,
      created_at: now,
    };

    // =========================================================
    // PAYMENT_MODE=mock — create order as 'paid' immediately
    // =========================================================
    if (paymentMode === 'mock') {
      const order = { ...orderBase, status: 'paid', stripe_session_id: null, stripe_payment_intent_id: null };

      await createOrderRecord(order);

      console.log(`[MOCK PAYMENT] Order ${orderId} created and marked as paid.`);

      // Send Order Confirmation Email
      if (order.user_email) {
        try {
          const { sendOrderConfirmationEmail } = await import('@/lib/email');
          await sendOrderConfirmationEmail(order.user_email, order);
        } catch (emailErr) {
          console.error('[MOCK PAYMENT] Failed to send order confirmation email:', emailErr);
        }
      }

      return NextResponse.json({ success: true, order });
    }

    // =========================================================
    // PAYMENT_MODE=stripe — create pending order + Stripe PaymentIntent
    // =========================================================
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(getStripeSecretKey(), {
      apiVersion: '2026-05-27.dahlia' as any,
    });

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(serverTotal * 100), // Stripe expects paise (INR)
      currency: 'inr',
      metadata: {
        orderId,
        userId: String(customer.id),
      },
      receipt_email: customer.email || shippingDetails.email || undefined,
    });

    // Persist pending order with Stripe PaymentIntent ID
    const pendingOrder = {
      ...orderBase,
      status: 'pending',
      stripe_payment_intent_id: paymentIntent.id,
      stripe_session_id: null,
    };
    await createOrderRecord(pendingOrder);

    console.log(`[STRIPE] PaymentIntent ${paymentIntent.id} created for order ${orderId}.`);

    return NextResponse.json({ clientSecret: paymentIntent.client_secret, orderId });
  } catch (error: any) {
    console.error('[checkout] Unhandled exception:', error?.message ?? error);
    return NextResponse.json(
      { error: 'Failed to process checkout. Please try again.' },
      { status: 500 }
    );
  }
}
