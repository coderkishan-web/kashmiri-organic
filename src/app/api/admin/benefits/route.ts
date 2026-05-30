import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, Benefit } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'kashmiri-organic-valley-secret-key-2026';

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

// GET all benefits
export async function GET(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Administrative clearance required.' }, { status: 401 });
  }

  try {
    const benefits = await executeQuery<Benefit[]>('SELECT * FROM benefits');
    return NextResponse.json({ benefits });
  } catch (err: any) {
    console.error('Benefits retrieval error:', err);
    return NextResponse.json({ error: 'Query execution failed.' }, { status: 500 });
  }
}

// POST create benefit
export async function POST(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Administrative clearance required.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, description } = body;

    if (!name || !description) {
      return NextResponse.json({ error: 'Name and description are required.' }, { status: 400 });
    }

    const sql = `
      INSERT INTO benefits (name, description)
      VALUES (?, ?)
    `;
    const params = [
      name.trim(),
      description.trim()
    ];

    const result = await executeQuery<any>(sql, params);
    return NextResponse.json({ success: true, insertId: result.insertId }, { status: 201 });
  } catch (err: any) {
    console.error('Benefits insertion error:', err);
    return NextResponse.json({ error: 'SQL query failed.' }, { status: 500 });
  }
}

// PUT edit benefit
export async function PUT(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Administrative clearance required.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, name, description } = body;

    if (!id || !name || !description) {
      return NextResponse.json({ error: 'Entity ID, name and description are required to perform update.' }, { status: 400 });
    }

    const sql = `
      UPDATE benefits 
      SET name = ?, description = ?
      WHERE id = ?
    `;
    const params = [
      name.trim(),
      description.trim(),
      Number(id)
    ];

    await executeQuery(sql, params);
    return NextResponse.json({ success: true, message: 'Benefit updated successfully.' });
  } catch (err: any) {
    console.error('Benefits update error:', err);
    return NextResponse.json({ error: 'SQL query update failed.' }, { status: 500 });
  }
}

// DELETE benefit
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

    await executeQuery('DELETE FROM benefits WHERE id = ?', [Number(id)]);
    return NextResponse.json({ success: true, message: 'Benefit removed successfully.' });
  } catch (err: any) {
    console.error('Benefits delete error:', err);
    return NextResponse.json({ error: 'Failed to delete benefit.' }, { status: 500 });
  }
}
