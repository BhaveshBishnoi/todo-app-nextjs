import { cookies } from 'next/headers';

// Set the JWT token in a cookie
export function setAuthCookie(token: string) {
  cookies().set({
    name: 'token',
    value: token,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

// Remove the JWT token cookie
export function removeAuthCookie() {
  cookies().delete('token');
}

// Get the JWT token from the cookie
export function getAuthCookie() {
  return cookies().get('token')?.value;
}
