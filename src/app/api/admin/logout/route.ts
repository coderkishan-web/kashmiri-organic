import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out from administrative archives.',
    });
    
    // Clear cookies
    response.cookies.delete('admin_token');
    
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: 'Logout failed.' }, { status: 500 });
  }
}
