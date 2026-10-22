import { NextRequest, NextResponse } from 'next/server';
import { GoogleAuthService } from '@/services/auth/googleAuthService';
import { setAuthCookie } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const { searchParams } = new URL(req.url);

  const errorParam = searchParams.get('error');
  if (errorParam) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorParam)}`);
  }

  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code || !state) {
    return NextResponse.redirect(`${origin}/login?error=missing_oauth_parameters`);
  }

  // 1. Validate state parameter (CSRF protection)
  const stateCheck = GoogleAuthService.validateState(state);
  if (!stateCheck.valid) {
    return NextResponse.redirect(`${origin}/login?error=invalid_or_expired_state`);
  }

  try {
    // 2. Exchange code for user identity token / payload
    const profile = await GoogleAuthService.exchangeCodeForProfile(code, origin);

    // 3. Process verified Google identity
    const result = await GoogleAuthService.processVerifiedGoogleUser(profile);

    // 4. Handle Account Linking Requirement
    if (result.status === 'REQUIRES_PASSWORD_LINK') {
      const linkRedirectUrl = new URL(`${origin}/login`);
      linkRedirectUrl.searchParams.set('requiresLink', 'true');
      linkRedirectUrl.searchParams.set('email', result.email);
      linkRedirectUrl.searchParams.set('linkToken', result.linkToken);

      const res = NextResponse.redirect(linkRedirectUrl.toString());
      res.cookies.delete('google_oauth_state');
      return res;
    }

    // 5. Successful Authentication
    const destination = stateCheck.returnTo || '/analytics';
    const redirectUrl = new URL(destination.startsWith('/') ? `${origin}${destination}` : `${origin}/analytics`);
    
    const res = NextResponse.redirect(redirectUrl.toString());
    setAuthCookie(res, result.sessionToken);
    res.cookies.delete('google_oauth_state');

    return res;
  } catch (err: any) {
    console.error('Google OAuth callback failed:', err);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(err.message || 'OAuth authentication failed')}`);
  }
}
