import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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

const verifySuperAdmin = (req: NextRequest) => {
  const token = req.cookies.get('admin_token')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== 'super_admin') return null;
    return decoded;
  } catch (err) {
    return null;
  }
};

export async function GET(req: NextRequest) {
  const superAdmin = verifySuperAdmin(req);
  if (!superAdmin) return NextResponse.json({ error: 'Unauthorized. Super Admin only.' }, { status: 401 });

  const db = getDb();
  if (!db) return NextResponse.json({ error: 'DB Error' }, { status: 500 });

  const admins = db.users.filter((u: any) => u.role === 'admin' || u.role === 'super_admin').map((u: any) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    created_at: u.created_at
  }));

  return NextResponse.json({ 
    admins, 
    activities: db.admin_activities || [] 
  });
}

export async function POST(req: NextRequest) {
  const superAdmin = verifySuperAdmin(req);
  if (!superAdmin) return NextResponse.json({ error: 'Unauthorized. Super Admin only.' }, { status: 401 });

  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const db = getDb();
    if (!db) return NextResponse.json({ error: 'DB Error' }, { status: 500 });

    const existingUser = db.users.find((u: any) => u.email === email);
    if (existingUser) return NextResponse.json({ error: 'User already exists' }, { status: 400 });

    const newAdmin = {
      id: Math.max(...db.users.map((u: any) => u.id), 0) + 1,
      name,
      email,
      password_hash: await bcrypt.hash(password, 10),
      role: 'admin',
      created_at: new Date().toISOString(),
      phone: null,
      otp: null,
      otp_expiry: null
    };

    db.users.push(newAdmin);

    if (!db.admin_activities) db.admin_activities = [];
    db.admin_activities.unshift({
      id: Date.now(),
      admin_id: superAdmin.id,
      admin_name: superAdmin.name,
      action: 'CREATE_ADMIN',
      details: `Created new admin: ${name} (${email})`,
      created_at: new Date().toISOString()
    });

    saveDb(db);

    return NextResponse.json({ success: true, admin: { id: newAdmin.id, name: newAdmin.name, email: newAdmin.email } });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
