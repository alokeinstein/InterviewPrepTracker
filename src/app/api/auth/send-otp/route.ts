import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/auth/authService';

export async function POST(req: NextRequest) {
  try {
    const { email, purpose = 'SIGNUP' } = await req.json();

    if (!email || !AuthService.isValidGmail(email)) {
      return NextResponse.json(
        { error: 'A valid @gmail.com address is required.' },
        { status: 400 }
      );
    }

    if (purpose === 'PASSWORD_RESET') {
      const res = await AuthService.sendForgotPasswordOtp(email);
      return NextResponse.json(res);
    } else {
      const res = await AuthService.sendSignupOtp(email);
      return NextResponse.json(res);
    }
  } catch (error: any) {
    const status = error.message?.includes('wait') || error.message?.includes('Too many') ? 429 : 400;
    return NextResponse.json({ error: error.message || 'Failed to send verification code.' }, { status });
  }
}
