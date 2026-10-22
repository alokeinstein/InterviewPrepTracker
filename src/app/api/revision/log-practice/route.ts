import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SpacedRepetitionService } from '@/services/revision/spacedRepetitionService';
import { PracticeMode } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { problemId, mode, struggled, notes, qualityScore, durationSec, optimalityScore } = body;

    if (!problemId) {
      return NextResponse.json({ error: 'problemId is required' }, { status: 400 });
    }

    const validModes: PracticeMode[] = ['CODE', 'HAND', 'MENTAL'];
    const practiceMode: PracticeMode = validModes.includes(mode) ? mode : 'CODE';

    const user = await prisma.user.findFirst();
    const userId = user?.id || 'user-default-1';

    const result = await SpacedRepetitionService.recordPractice({
      userId,
      problemId,
      mode: practiceMode,
      struggled: Boolean(struggled),
      notes,
      qualityScore,
      durationSec,
      optimalityScore,
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Failed to log practice:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
