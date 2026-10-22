import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/auth/authService';
import { getRequestAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username query parameter is required.' }, { status: 400 });
    }

    if (!AuthService.isValidUsername(username)) {
      return NextResponse.json({
        available: false,
        reason: 'Username must be 3-30 characters (letters, numbers, underscores, hyphens).',
      });
    }

    const auth = await getRequestAuth(req);
    const isAvailable = await AuthService.isUsernameAvailable(username, auth?.user.id);

    return NextResponse.json({
      username,
      available: isAvailable,
      reason: isAvailable ? 'Username is available' : 'Username is already taken',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
