import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import { executeQuery, User } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'kashmiri-organic-valley-secret-key-2026';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('customer_token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      const sql = 'SELECT * FROM users WHERE id = ? LIMIT 1';
      const users = await executeQuery<User[]>(sql, [decoded.id]);
      const user = users?.[0];

      if (!user) {
         return NextResponse.json({ authenticated: false, error: 'User not found.' }, { status: 404 });
      }

      return NextResponse.json({
        authenticated: true,
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          email: user.email,
          role: user.role,
          address: user.address,
          city: user.city,
          pinCode: user.pinCode,
          country: user.country || 'India'
        },
      });
    } catch (err) {
      // Session expired or corrupted, delete the cookie
      const response = NextResponse.json({ authenticated: false, error: 'Session expired.' }, { status: 401 });
      response.cookies.delete('customer_token');
      return response;
    }
  } catch (error: any) {
    return NextResponse.json({ error: 'Auth check exception.' }, { status: 500 });
  }
}
