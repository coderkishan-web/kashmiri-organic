import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, Coupon } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'kashmiri-organic-valley-secret-key-2026';

// Helper to verify admin authority
async function verifyAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== 'admin' && decoded.role !== 'super_admin') return null;
    return decoded;
  } catch (e) {
    return null;
  }
}

// GET all coupons
export async function GET(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Administrative clearance required.' }, { status: 401 });
  }

  try {
    const coupons = await executeQuery<Coupon[]>('SELECT * FROM coupons');
    return NextResponse.json({ coupons });
  } catch (err: any) {
    console.error('Fetch coupons error:', err);
    return NextResponse.json({ error: 'Query execution failed.' }, { status: 500 });
  }
}

// POST create coupon
export async function POST(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Administrative clearance required.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      code,
      discount_type,
      discount_value,
      product_id,
      condition_type,
      start_date,
      end_date
    } = body;

    if (!code || !discount_type || discount_value === undefined || !condition_type) {
      return NextResponse.json({ error: 'Required fields: code, discount_type, discount_value, condition_type.' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    // Check if coupon code already exists
    const existing = await executeQuery<Coupon[]>('SELECT * FROM coupons WHERE code = ?', [cleanCode]);
    if (existing && existing.length > 0) {
      return NextResponse.json({ error: `Coupon code '${cleanCode}' already exists.` }, { status: 400 });
    }

    const sql = `
      INSERT INTO coupons (code, discount_type, discount_value, product_id, condition_type, start_date, end_date, is_popup)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0)
    `;
    const params = [
      cleanCode,
      discount_type,
      Number(discount_value),
      product_id ? Number(product_id) : null,
      condition_type,
      start_date || null,
      end_date || null
    ];

    const result = await executeQuery<any>(sql, params);
    return NextResponse.json({ success: true, insertId: result.insertId }, { status: 201 });
  } catch (err: any) {
    console.error('Coupon creation error:', err);
    return NextResponse.json({ error: 'SQL query failed.' }, { status: 500 });
  }
}

// PUT edit coupon or toggle popup status
export async function PUT(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Administrative clearance required.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      id,
      toggle_popup,
      is_popup,
      code,
      discount_type,
      discount_value,
      product_id,
      condition_type,
      start_date,
      end_date
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Entity ID is required to perform update.' }, { status: 400 });
    }

    // Toggle popup handling
    if (toggle_popup) {
      const targetIsPopup = Number(is_popup);
      if (targetIsPopup === 1) {
        // Clear all other coupons' popup status first
        await executeQuery('UPDATE coupons SET is_popup = 0');
      }
      await executeQuery('UPDATE coupons SET is_popup = ? WHERE id = ?', [targetIsPopup, Number(id)]);
      return NextResponse.json({ success: true, message: 'Popup status updated successfully.' });
    }

    // Normal editing validation
    if (!code || !discount_type || discount_value === undefined || !condition_type) {
      return NextResponse.json({ error: 'Required fields: code, discount_type, discount_value, condition_type.' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    // Check code collision with other coupons
    const existing = await executeQuery<Coupon[]>('SELECT * FROM coupons WHERE code = ? AND id != ?', [cleanCode, Number(id)]);
    if (existing && existing.length > 0) {
      return NextResponse.json({ error: `Coupon code '${cleanCode}' is already used by another coupon.` }, { status: 400 });
    }

    const sql = `
      UPDATE coupons 
      SET code = ?, discount_type = ?, discount_value = ?, product_id = ?, condition_type = ?, start_date = ?, end_date = ?
      WHERE id = ?
    `;
    const params = [
      cleanCode,
      discount_type,
      Number(discount_value),
      product_id ? Number(product_id) : null,
      condition_type,
      start_date || null,
      end_date || null,
      Number(id)
    ];

    await executeQuery(sql, params);
    return NextResponse.json({ success: true, message: 'Coupon updated successfully.' });
  } catch (err: any) {
    console.error('Coupon update error:', err);
    return NextResponse.json({ error: 'SQL query update failed.' }, { status: 500 });
  }
}

// DELETE delete coupon
export async function DELETE(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Administrative clearance required.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Coupon target ID is required.' }, { status: 400 });
    }

    await executeQuery('DELETE FROM coupons WHERE id = ?', [Number(id)]);
    return NextResponse.json({ success: true, message: 'Coupon deleted successfully.' });
  } catch (err: any) {
    console.error('Coupon deletion error:', err);
    return NextResponse.json({ error: 'SQL query deletion failed.' }, { status: 500 });
  }
}
