import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const JSON_DB_PATH = path.join(DATA_DIR, 'db.json');

const getDb = () => {
  if (fs.existsSync(JSON_DB_PATH)) {
    const data = fs.readFileSync(JSON_DB_PATH, 'utf-8');
    return JSON.parse(data);
  }
  return null;
};

export async function GET(req: NextRequest) {
  try {
    const phone = req.nextUrl.searchParams.get('phone');
    if (!phone) {
      return NextResponse.json({ error: 'Phone parameter required' }, { status: 400 });
    }

    const db = getDb();
    if (!db || !db.orders) {
      return NextResponse.json({ orders: [] });
    }

    const userOrders = db.orders.filter((o: any) => o.user_phone === phone);

    // sort descending by date
    userOrders.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ orders: userOrders });

  } catch (error) {
    console.error('Failed to fetch user orders:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
