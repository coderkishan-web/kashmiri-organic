import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, Material } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'kashmiri-organic-valley-secret-key-2026';

// Helper to verify admin authority
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

// GET all materials
export async function GET(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Administrative clearance required.' }, { status: 401 });
  }

  try {
    const materials = await executeQuery<Material[]>('SELECT * FROM materials');
    return NextResponse.json({ materials });
  } catch (err: any) {
    console.error('Materials retrieval error:', err);
    return NextResponse.json({ error: 'Query execution failed.' }, { status: 500 });
  }
}

// POST create material
export async function POST(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Administrative clearance required.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, slug, overview, origin, manufacturing_process, sustainability, benefits, image_url, history, gallery_urls, extraction_story } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required parameters.' }, { status: 400 });
    }

    const sql = `
      INSERT INTO materials (name, slug, overview, origin, manufacturing_process, sustainability, benefits, image_url, history, gallery_urls, extraction_story)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      name.trim(),
      slug.trim().toLowerCase(),
      overview ? overview.trim() : '',
      origin ? origin.trim() : '',
      manufacturing_process ? manufacturing_process.trim() : '',
      sustainability ? sustainability.trim() : '',
      benefits ? benefits.trim() : '',
      image_url || 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
      history ? history.trim() : '',
      gallery_urls || JSON.stringify([]),
      extraction_story ? extraction_story.trim() : ''
    ];

    const result = await executeQuery<any>(sql, params);
    return NextResponse.json({ success: true, insertId: result.insertId }, { status: 201 });
  } catch (err: any) {
    console.error('Materials insertion error:', err);
    return NextResponse.json({ error: 'SQL query failed.' }, { status: 500 });
  }
}

// PUT edit material
export async function PUT(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Administrative clearance required.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, name, slug, overview, origin, manufacturing_process, sustainability, benefits, image_url, history, gallery_urls, extraction_story } = body;

    if (!id || !name || !slug) {
      return NextResponse.json({ error: 'Entity ID, name and slug are required to perform update.' }, { status: 400 });
    }

    const sql = `
      UPDATE materials 
      SET name = ?, slug = ?, overview = ?, origin = ?, manufacturing_process = ?, sustainability = ?, benefits = ?, image_url = ?, history = ?, gallery_urls = ?, extraction_story = ?
      WHERE id = ?
    `;
    const params = [
      name.trim(),
      slug.trim().toLowerCase(),
      overview ? overview.trim() : '',
      origin ? origin.trim() : '',
      manufacturing_process ? manufacturing_process.trim() : '',
      sustainability ? sustainability.trim() : '',
      benefits ? benefits.trim() : '',
      image_url,
      history ? history.trim() : '',
      gallery_urls || JSON.stringify([]),
      extraction_story ? extraction_story.trim() : '',
      Number(id)
    ];

    await executeQuery(sql, params);
    return NextResponse.json({ success: true, message: 'Material updated successfully.' });
  } catch (err: any) {
    console.error('Materials update error:', err);
    return NextResponse.json({ error: 'SQL query update failed.' }, { status: 500 });
  }
}

// DELETE material
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

    await executeQuery('DELETE FROM materials WHERE id = ?', [Number(id)]);
    return NextResponse.json({ success: true, message: 'Material removed successfully.' });
  } catch (err: any) {
    console.error('Materials delete error:', err);
    return NextResponse.json({ error: 'Failed to delete material.' }, { status: 500 });
  }
}
