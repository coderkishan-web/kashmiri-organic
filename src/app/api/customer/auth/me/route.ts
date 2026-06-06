import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'kashmiri-organic-valley-secret-key-2026';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('customer_token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      return NextResponse.json({
        authenticated: true,
        user: {
          id: decoded.id,
          phone: decoded.phone,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role,
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
