import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/auth/authService';
import { setAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, signupToken, password, username, timezone } = await req.json();

    if (!email || !signupToken || !password || !username) {
      return NextResponse.json({ error: 'Missing required signup fields.' }, { status: 400 });
    }

    const result = await AuthService.completeSignup({
      email,
      signupToken,
      password,
      username,
      timezone,
    });

    const res = NextResponse.json({
      success: true,
      user: result.user,
      profile: result.profile,
    });

    setAuthCookie(res, result.sessionToken);
    return res;
  } catch (error: any) {
    const status = error.message?.includes('already taken') ? 409 : 400;
    return NextResponse.json({ error: error.message || 'Account creation failed.' }, { status });
  }
}
