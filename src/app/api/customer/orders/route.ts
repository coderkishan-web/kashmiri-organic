import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const JSON_DB_PATH = path.join(DATA_DIR, 'db.json');

// Helper to get db
const getDb = () => {
  if (fs.existsSync(JSON_DB_PATH)) {
    const data = fs.readFileSync(JSON_DB_PATH, 'utf-8');
    return JSON.parse(data);
  }
  return null;
};

// Helper to save db
const saveDb = (data: any) => {
  fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, total_amount, shipping_address, payment_method, user } = body;

    if (!user || !user.phone) {
      return NextResponse.json({ error: 'User is not authenticated.' }, { status: 401 });
    }

    if (!items || !items.length) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
    }

    const db = getDb();
    if (!db) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Ensure orders array exists
    if (!db.orders) {
      db.orders = [];
    }

    // Generate Order ID
    const orderId = `KO-ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: orderId,
      user_phone: user.phone,
      user_name: user.name || shipping_address.name || 'Customer',
      user_email: user.email || shipping_address.email || '',
      items: JSON.stringify(items),
      total_amount,
      status: 'paid', // since we simulated successful payment
      shipping_address: JSON.stringify(shipping_address),
      payment_method: payment_method || 'card',
      created_at: new Date().toISOString()
    };

    db.orders.unshift(newOrder);

    // Save shipping details back to the user profile
    const userIndex = db.users?.findIndex((u: any) => u.phone === user.phone);
    if (userIndex !== undefined && userIndex !== -1) {
      if (!db.users[userIndex].name) db.users[userIndex].name = shipping_address.name;
      if (!db.users[userIndex].email && shipping_address.email) db.users[userIndex].email = shipping_address.email;
      db.users[userIndex].address = shipping_address.address;
      db.users[userIndex].city = shipping_address.city;
      db.users[userIndex].pinCode = shipping_address.pinCode;
      db.users[userIndex].country = shipping_address.country;
    }

    saveDb(db);

    // Simulate sending email / SMS confirmation
    console.log(`[SIMULATION] Sending Order Confirmation SMS to ${user.phone}`);
    console.log(`[SIMULATION] Order ${orderId} confirmed and paid via ${payment_method}.`);

    return NextResponse.json({ success: true, order: newOrder });

  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: 'Server error creating order' }, { status: 500 });
  }
}
