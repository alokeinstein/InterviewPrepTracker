import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/auth/authService';
import { setAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, resetToken, newPassword } = await req.json();

    if (!email || !resetToken || !newPassword) {
      return NextResponse.json({ error: 'Missing required password reset fields.' }, { status: 400 });
    }

    const result = await AuthService.resetPassword(email, resetToken, newPassword);

    const res = NextResponse.json({
      success: true,
      message: 'Password reset successfully. You are now logged in.',
    });

    setAuthCookie(res, result.sessionToken);
    return res;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Password reset failed.' }, { status: 400 });
  }
}
