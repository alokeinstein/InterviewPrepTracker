import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Severity, ItemType } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const { problemId, category, violatedInvariant, userNotes, correctiveAction, severity } =
      await req.json();

    const user = await prisma.user.findFirst();
    if (!user || !problemId) {
      return NextResponse.json({ error: 'User or problemId missing' }, { status: 400 });
    }

    const mistake = await prisma.mistakeEntry.create({
      data: {
        userId: user.id,
        problemId,
        category: category || 'Algorithm Invariant Violation',
        violatedInvariant: violatedInvariant || 'Invariant condition not maintained',
        userNotes: userNotes || '',
        correctiveAction: correctiveAction || 'Enforce boundary checks before incrementing',
        severity: (severity as Severity) || Severity.MEDIUM,
      },
    });

    // Schedule immediate day 1 spaced retrieval for this mistake
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    await prisma.revisionItem.create({
      data: {
        userId: user.id,
        itemType: ItemType.MISTAKE_INVARIANT,
        mistakeId: mistake.id,
        repetitionNumber: 0,
        intervalDays: 1,
        easeFactor: 2.3,
        nextReviewDate: tomorrow,
      },
    });

    return NextResponse.json({ success: true, mistake });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
