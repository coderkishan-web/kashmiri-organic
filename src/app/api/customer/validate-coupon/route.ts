import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, Coupon } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code')?.trim().toUpperCase();

    if (!code) {
      return NextResponse.json({ error: 'Promo code is required.' }, { status: 400 });
    }

    // In the local JSON database simulation, executing code matches will find records
    const coupons = await executeQuery<Coupon[]>('SELECT * FROM coupons WHERE code = ? LIMIT 1', [code]);
    const coupon = coupons?.[0];

    if (!coupon) {
      return NextResponse.json({ error: 'Invalid or expired promo code.' }, { status: 404 });
    }

    // Validate expiration dates
    const now = new Date();
    if (coupon.condition_type === 'period') {
      if (coupon.start_date && new Date(coupon.start_date) > now) {
        return NextResponse.json({ error: 'This promo code is not active yet.' }, { status: 400 });
      }
      if (coupon.end_date && new Date(coupon.end_date) < now) {
        return NextResponse.json({ error: 'This promo code has expired.' }, { status: 400 });
      }
    } else if (coupon.condition_type === 'two_days') {
      const createdAtTime = new Date(coupon.created_at).getTime();
      const twoDaysMs = 2 * 24 * 60 * 60 * 1000;
      if (Date.now() - createdAtTime > twoDaysMs) {
        return NextResponse.json({ error: 'This promo code has expired.' }, { status: 400 });
      }
    }

    return NextResponse.json({
      success: true,
      coupon
    });
  } catch (err: any) {
    console.error('Error validating coupon:', err);
    return NextResponse.json({ error: 'Internal server validation error.' }, { status: 500 });
  }
}
