import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/auth/authService';

export async function POST(req: NextRequest) {
  try {
    const { email, otp, purpose = 'SIGNUP' } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP code are required.' }, { status: 400 });
    }

    if (purpose === 'PASSWORD_RESET') {
      const res = await AuthService.verifyForgotPasswordOtp(email, otp);
      return NextResponse.json(res);
    } else {
      const res = await AuthService.verifySignupOtp(email, otp);
      return NextResponse.json(res);
    }
  } catch (error: any) {
    const isAttemptsError = error.message?.includes('attempts') || error.message?.includes('Incorrect');
    return NextResponse.json({ error: error.message || 'OTP verification failed.' }, { status: isAttemptsError ? 401 : 400 });
  }
}
