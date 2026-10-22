import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/auth/authService';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!AuthService.isValidGmail(email)) {
      return NextResponse.json(
        { error: 'Only Gmail addresses (@gmail.com) are supported.' },
        { status: 400 }
      );
    }

    const { exists, hasPassword } = await AuthService.checkAccountExists(email);

    return NextResponse.json({
      exists,
      hasPassword,
      normalizedEmail: AuthService.normalizeEmail(email),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
