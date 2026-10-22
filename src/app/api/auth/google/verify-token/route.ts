import { NextRequest, NextResponse } from 'next/server';
import { GoogleAuthService } from '@/services/auth/googleAuthService';
import { setAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { credential, idToken } = await req.json();
    const token = credential || idToken;

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const payload = await GoogleAuthService.verifyIdTokenOrPayload(token);
    const result = await GoogleAuthService.processVerifiedGoogleUser(payload);

    if (result.status === 'REQUIRES_PASSWORD_LINK') {
      return NextResponse.json({
        status: 'REQUIRES_PASSWORD_LINK',
        email: result.email,
        linkToken: result.linkToken,
      });
    }

    const res = NextResponse.json({
      success: true,
      status: 'AUTHENTICATED',
      user: result.user,
    });

    setAuthCookie(res, result.sessionToken);
    return res;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Verification failed' }, { status: 401 });
  }
}
