import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { verifyJwtToken } from './lib/jwt';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  const isPublicPath = path === '/login' || path === '/register' || path === '/';
  
  // Get token from cookies
  const token = request.cookies.get('token')?.value || '';
  
  // If path is public and user has token, redirect to todos page
  if (isPublicPath && token) {
    const decoded = verifyJwtToken(token);
    if (decoded) {
      return NextResponse.redirect(new URL('/todos', request.url));
    }
  }
  
  // If path requires auth and user has no token, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

// Add paths that need to be checked for authentication
export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/todos/:path*',
    '/api/todos/:path*',
  ],
};
