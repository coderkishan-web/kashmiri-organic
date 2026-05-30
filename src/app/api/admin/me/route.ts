import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'kashmiri-organic-valley-secret-key-2026';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Session cookie not found.' }, { status: 401 });
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      return NextResponse.json({
        authenticated: true,
        user: {
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
          role: decoded.role,
        },
      });
    } catch (err) {
      // Clear invalid cookie
      const response = NextResponse.json({ error: 'Session expired.' }, { status: 401 });
      response.cookies.delete('admin_token');
      return response;
    }
  } catch (error: any) {
    return NextResponse.json({ error: 'Auth check exception.' }, { status: 500 });
  }
}
