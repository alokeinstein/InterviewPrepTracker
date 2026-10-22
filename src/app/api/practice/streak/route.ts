import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PracticeService } from '@/services/practice/practiceService';

export async function GET(req: NextRequest) {
  try {
    const auth = await getRequestAuth(req);
    if (!auth) {
      return NextResponse.json(
        { error: 'Authentication required to access streak analytics.' },
        { status: 401, headers: { 'Cache-Control': 'private, no-store' } }
      );
    }
    const userId = auth.user.id;
    const timezone = auth.user.timezone;

    const streakResult = await PracticeService.refreshUserStreak(userId, timezone);

    return NextResponse.json(streakResult);
  } catch (error: any) {
    console.error('Failed to calculate streak:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
