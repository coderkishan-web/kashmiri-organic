import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'kashmiri-organic-valley-secret-key-2026';
const DATA_DIR = path.join(process.cwd(), 'data');
const JSON_DB_PATH = path.join(DATA_DIR, 'db.json');

const getDb = () => {
  if (fs.existsSync(JSON_DB_PATH)) {
    const data = fs.readFileSync(JSON_DB_PATH, 'utf-8');
    return JSON.parse(data);
  }
  return null;
};

const saveDb = (data: any) => {
  fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
};

const verifyAdmin = (req: NextRequest) => {
  const token = req.cookies.get('admin_token')?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (err) {
    return null;
  }
};

export async function GET(req: NextRequest) {
  const admin = verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  if (!db) return NextResponse.json({ orders: [] });

  return NextResponse.json({ orders: db.orders || [] });
}

export async function PATCH(req: NextRequest) {
  const admin = verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id, status } = await req.json();
    const db = getDb();
    if (!db || !db.orders) return NextResponse.json({ error: 'DB Error' }, { status: 500 });

    const orderIndex = db.orders.findIndex((o: any) => o.id === id);
    if (orderIndex === -1) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    db.orders[orderIndex].status = status;

    // Log admin activity
    if (!db.admin_activities) db.admin_activities = [];
    db.admin_activities.unshift({
      id: Date.now(),
      admin_id: admin.id,
      admin_name: admin.name,
      action: 'UPDATE_ORDER_STATUS',
      details: `Updated status of order ${id} to ${status}`,
      created_at: new Date().toISOString()
    });

    saveDb(db);

    return NextResponse.json({ success: true, order: db.orders[orderIndex] });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
