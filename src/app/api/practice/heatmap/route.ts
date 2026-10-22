import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PracticeService } from '@/services/practice/practiceService';

export async function GET(req: NextRequest) {
  try {
    const auth = await getRequestAuth(req);
    if (!auth) {
      return NextResponse.json(
        { error: 'Authentication required to access practice heatmap analytics.' },
        { status: 401, headers: { 'Cache-Control': 'private, no-store' } }
      );
    }
    const userId = auth.user.id;

    const { searchParams } = new URL(req.url);
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()), 10);

    const activityData = await PracticeService.getYearActivityMap(userId, year);

    return NextResponse.json({
      year,
      activityData,
    });
  } catch (error: any) {
    console.error('Failed to query heatmap analytics:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
