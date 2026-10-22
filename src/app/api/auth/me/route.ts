import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = await getRequestAuth(req);
    if (!auth) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: auth.user.id,
        email: auth.user.email,
        username: auth.user.username,
        name: auth.user.name,
        timezone: auth.user.timezone,
        streak: auth.user.streak,
        longestStreak: auth.user.longestStreak,
        role: auth.user.role,
        profile: auth.user.profile,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
