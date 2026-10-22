import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/auth/authService';

export const AUTH_COOKIE_NAME = 'interview_os_session';
export const AUTH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

/**
 * Retrieves the authenticated user context in Server Components and Route Handlers.
 */
export async function getServerAuth() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  return await AuthService.validateSession(sessionToken);
}

/**
 * Extracts authenticated user context from a NextRequest.
 */
export async function getRequestAuth(req: NextRequest) {
  // Check cookie first
  let token = req.cookies.get(AUTH_COOKIE_NAME)?.value;

  // Or check Bearer token in Authorization header
  if (!token) {
    const authHeader = req.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) return null;

  return await AuthService.validateSession(token);
}

/**
 * Sets the secure session cookie on a NextResponse.
 */
export function setAuthCookie(res: NextResponse, sessionToken: string): void {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookies.set(AUTH_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: AUTH_COOKIE_MAX_AGE,
  });
}

/**
 * Clears the session cookie on a NextResponse.
 */
export function clearAuthCookie(res: NextResponse): void {
  res.cookies.set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
