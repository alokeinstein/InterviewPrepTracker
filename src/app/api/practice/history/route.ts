import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PracticeService } from '@/services/practice/practiceService';

export async function GET(req: NextRequest) {
  try {
    const auth = await getRequestAuth(req);
    if (!auth) {
      return NextResponse.json(
        { error: 'Authentication required to access private practice history.' },
        { status: 401, headers: { 'Cache-Control': 'private, no-store' } }
      );
    }
    const userId = auth.user.id;

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10)));
    const method = searchParams.get('method') || 'ALL';
    const difficulty = searchParams.get('difficulty') || 'ALL';
    const searchQuery = searchParams.get('search') || '';

    const history = await PracticeService.getLatestActivityHistory({
      userId,
      page,
      pageSize,
      method,
      difficulty,
      searchQuery,
    });

    return NextResponse.json(history);
  } catch (error: any) {
    console.error('Failed to query practice history:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
