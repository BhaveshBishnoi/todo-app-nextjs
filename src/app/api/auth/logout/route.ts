import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create a response
    const response = NextResponse.json({
      message: 'Logout successful',
      success: true,
    });
    
    // Clear the token cookie
    response.cookies.set({
      name: 'token',
      value: '',
      httpOnly: true,
      path: '/',
      expires: new Date(0), // Expire immediately
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    
    return response;
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
