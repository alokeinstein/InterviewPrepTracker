import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/auth/authService';
import { setAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const userAgent = req.headers.get('user-agent') || undefined;
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined;

    const result = await AuthService.login(email, password, userAgent, ipAddress);

    const res = NextResponse.json({
      success: true,
      user: result.user,
      profile: result.profile,
    });

    setAuthCookie(res, result.sessionToken);
    return res;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Login failed.' }, { status: 401 });
  }
}
