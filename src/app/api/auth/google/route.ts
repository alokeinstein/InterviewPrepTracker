import { NextRequest, NextResponse } from 'next/server';
import { GoogleAuthService } from '@/services/auth/googleAuthService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const returnTo = searchParams.get('returnTo') || '/analytics';
    const origin = req.nextUrl.origin;

    const { url, state } = GoogleAuthService.generateAuthUrl(origin, returnTo);

    // If client requested JSON (e.g. AJAX call), return JSON payload
    if (req.headers.get('accept')?.includes('application/json')) {
      return NextResponse.json({ url, state });
    }

    // Direct browser navigation redirects to Google consent screen
    const res = NextResponse.redirect(url);
    res.cookies.set('google_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 600, // 10 minutes
    });

    return res;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to initiate Google OAuth' }, { status: 500 });
  }
}
