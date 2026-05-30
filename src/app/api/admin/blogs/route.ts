import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, Blog } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'kashmiri-organic-valley-secret-key-2026';

// Helper to verify admin
async function verifyAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== 'admin') return null;
    return decoded;
  } catch (e) {
    return null;
  }
}

// GET all blogs
export async function GET(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Administrative clearance required.' }, { status: 401 });
  }

  try {
    const blogs = await executeQuery<Blog[]>('SELECT * FROM blogs');
    return NextResponse.json({ blogs });
  } catch (err: any) {
    return NextResponse.json({ error: 'Query execution failed.' }, { status: 500 });
  }
}

// POST create blog
export async function POST(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Administrative clearance required.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title,
      slug,
      content,
      author,
      category,
      tags,
      status,
      seo_title,
      seo_description,
      featured_image,
      related_products,
      related_materials,
      publish_date
    } = body;

    if (!title || !slug || !content || !author || !category) {
      return NextResponse.json({ error: 'Core fields title, slug, content, author, and category are required.' }, { status: 400 });
    }

    const sql = `
      INSERT INTO blogs (title, slug, content, author, category, tags, status, seo_title, seo_description, featured_image, related_products, related_materials, publish_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      title.trim(),
      slug.trim().toLowerCase(),
      content.trim(),
      author.trim(),
      category.trim(),
      tags || 'harvest,organic',
      status || 'published',
      seo_title || title,
      seo_description || 'Harvest diary log from Kashmir Organic.',
      featured_image || 'https://images.unsplash.com/photo-1508747703725-719ae2c98295?auto=format&fit=crop&w=800&q=80',
      related_products || JSON.stringify([]),
      related_materials || JSON.stringify([]),
      publish_date || new Date().toISOString().split('T')[0]
    ];

    const result = await executeQuery<any>(sql, params);
    return NextResponse.json({ success: true, insertId: result.insertId }, { status: 201 });
  } catch (err: any) {
    console.error('Blogs insertion error:', err);
    return NextResponse.json({ error: 'SQL query failed.' }, { status: 500 });
  }
}

// PUT edit blog
export async function PUT(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Administrative clearance required.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      id,
      title,
      slug,
      content,
      author,
      category,
      tags,
      status,
      seo_title,
      seo_description,
      featured_image,
      related_products,
      related_materials,
      publish_date
    } = body;

    if (!id || !title || !slug) {
      return NextResponse.json({ error: 'Entity ID, title, and slug are required to perform update.' }, { status: 400 });
    }

    const sql = `
      UPDATE blogs 
      SET title = ?, slug = ?, content = ?, author = ?, category = ?, tags = ?, status = ?, seo_title = ?, seo_description = ?, featured_image = ?, related_products = ?, related_materials = ?, publish_date = ?
      WHERE id = ?
    `;
    const params = [
      title.trim(),
      slug.trim().toLowerCase(),
      content.trim(),
      author.trim(),
      category.trim(),
      tags,
      status,
      seo_title,
      seo_description,
      featured_image,
      related_products,
      related_materials,
      publish_date,
      Number(id)
    ];

    await executeQuery(sql, params);
    return NextResponse.json({ success: true, message: 'Blog updated successfully.' });
  } catch (err: any) {
    console.error('Blogs update error:', err);
    return NextResponse.json({ error: 'SQL query update failed.' }, { status: 500 });
  }
}

// DELETE delete blog
export async function DELETE(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Administrative clearance required.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Blog target ID is required.' }, { status: 400 });
    }

    const sql = 'DELETE FROM blogs WHERE id = ?';
    await executeQuery(sql, [Number(id)]);

    return NextResponse.json({ success: true, message: 'Blog deleted successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: 'SQL query deletion failed.' }, { status: 500 });
  }
}
