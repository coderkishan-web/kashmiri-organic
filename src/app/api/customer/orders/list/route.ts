import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const phone = req.nextUrl.searchParams.get('phone');
    if (!phone) {
      return NextResponse.json({ error: 'Phone/Email parameter required' }, { status: 400 });
    }

    const sql = 'SELECT * FROM orders WHERE user_phone = ?';
    const orders = await executeQuery<any[]>(sql, [phone]);

    // Sort descending by created_at date
    if (orders && Array.isArray(orders)) {
      orders.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return NextResponse.json({ orders: orders || [] });

  } catch (error) {
    console.error('Failed to fetch user orders:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
