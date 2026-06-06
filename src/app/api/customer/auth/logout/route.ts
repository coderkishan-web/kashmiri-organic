import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully.',
    });

    response.cookies.delete('customer_token');
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: 'Logout failed.' }, { status: 500 });
  }
}
