import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/auth/authService';
import { AUTH_COOKIE_NAME, clearAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (sessionToken) {
      await AuthService.logout(sessionToken);
    }

    const res = NextResponse.json({ success: true, message: 'Logged out successfully.' });
    clearAuthCookie(res);
    return res;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Logout failed.' }, { status: 500 });
  }
}
