import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, Coupon, Product } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    // 1. Fetch active popup coupon
    const coupons = await executeQuery<Coupon[]>('SELECT * FROM coupons WHERE is_popup = 1 LIMIT 1');
    const coupon = coupons?.[0];

    if (!coupon) {
      return NextResponse.json({ coupon: null });
    }

    // 2. Validate expiration conditions
    const now = new Date();
    if (coupon.condition_type === 'period') {
      if (coupon.start_date && new Date(coupon.start_date) > now) {
        return NextResponse.json({ coupon: null });
      }
      if (coupon.end_date && new Date(coupon.end_date) < now) {
        return NextResponse.json({ coupon: null });
      }
    } else if (coupon.condition_type === 'two_days') {
      const createdAtTime = new Date(coupon.created_at).getTime();
      const twoDaysMs = 2 * 24 * 60 * 60 * 1000;
      if (Date.now() - createdAtTime > twoDaysMs) {
        return NextResponse.json({ coupon: null });
      }
    }

    // 3. Hydrate associated product details if coupon matches a product
    let product = null;
    if (coupon.product_id) {
      const products = await executeQuery<Product[]>('SELECT * FROM products WHERE id = ? LIMIT 1', [coupon.product_id]);
      if (products && products.length > 0) {
        product = {
          id: products[0].id,
          name: products[0].name,
          slug: products[0].slug,
          image_url: products[0].image_url,
          price: products[0].price,
          discount_price: products[0].discount_price
        };
      }
    }

    return NextResponse.json({
      coupon,
      product
    });
  } catch (err: any) {
    console.error('Error fetching customer popup coupon:', err);
    return NextResponse.json({ error: 'Failed to retrieve active coupon.' }, { status: 500 });
  }
}
