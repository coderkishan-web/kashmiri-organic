import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, Category } from '@/lib/db';
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

// GET all categories
export async function GET(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Administrative clearance required.' }, { status: 401 });
  }

  try {
    const categories = await executeQuery<Category[]>('SELECT * FROM categories');
    return NextResponse.json({ categories });
  } catch (err: any) {
    console.error('Categories retrieval error:', err);
    return NextResponse.json({ error: 'Query execution failed.' }, { status: 500 });
  }
}

// POST create category
export async function POST(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Administrative clearance required.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, slug, description, image_url } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required parameters.' }, { status: 400 });
    }

    const sql = `
      INSERT INTO categories (name, slug, description, image_url)
      VALUES (?, ?, ?, ?)
    `;
    const params = [
      name.trim(),
      slug.trim().toLowerCase(),
      description ? description.trim() : '',
      image_url || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80'
    ];

    const result = await executeQuery<any>(sql, params);
    return NextResponse.json({ success: true, insertId: result.insertId }, { status: 201 });
  } catch (err: any) {
    console.error('Categories insertion error:', err);
    return NextResponse.json({ error: 'SQL query failed.' }, { status: 500 });
  }
}

// PUT edit category
export async function PUT(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Administrative clearance required.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, name, slug, description, image_url } = body;

    if (!id || !name || !slug) {
      return NextResponse.json({ error: 'Entity ID, name and slug are required to perform update.' }, { status: 400 });
    }

    const sql = `
      UPDATE categories 
      SET name = ?, slug = ?, description = ?, image_url = ?
      WHERE id = ?
    `;
    const params = [
      name.trim(),
      slug.trim().toLowerCase(),
      description ? description.trim() : '',
      image_url,
      Number(id)
    ];

    await executeQuery(sql, params);
    return NextResponse.json({ success: true, message: 'Category updated successfully.' });
  } catch (err: any) {
    console.error('Categories update error:', err);
    return NextResponse.json({ error: 'SQL query update failed.' }, { status: 500 });
  }
}

// DELETE category
export async function DELETE(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Administrative clearance required.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing ID parameter.' }, { status: 400 });
    }

    await executeQuery('DELETE FROM categories WHERE id = ?', [Number(id)]);
    return NextResponse.json({ success: true, message: 'Category removed successfully.' });
  } catch (err: any) {
    console.error('Categories delete error:', err);
    return NextResponse.json({ error: 'Failed to delete category.' }, { status: 500 });
  }
}
