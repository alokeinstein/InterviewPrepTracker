import { NextRequest, NextResponse } from 'next/server';
import { GoogleAuthService } from '@/services/auth/googleAuthService';
import { setAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password, linkToken } = await req.json();

    if (!email || !password || !linkToken) {
      return NextResponse.json(
        { error: 'Email, password, and linkToken are required.' },
        { status: 400 }
      );
    }

    const result = await GoogleAuthService.linkExistingAccountWithPassword({
      email,
      password,
      linkToken,
    });

    const res = NextResponse.json({
      success: true,
      message: 'Google identity securely linked to your account.',
      user: result.user,
    });

    setAuthCookie(res, result.sessionToken);
    return res;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Account linking failed.' },
      { status: 400 }
    );
  }
}
