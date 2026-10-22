import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PracticeService } from '@/services/practice/practiceService';

export async function POST(req: NextRequest) {
  try {
    const auth = await getRequestAuth(req);
    if (!auth) {
      return NextResponse.json(
        { error: 'Authentication required to import guest progress.' },
        { status: 401 }
      );
    }

    const { guestRecords } = await req.json();
    if (!Array.isArray(guestRecords) || guestRecords.length === 0) {
      return NextResponse.json({ success: true, importedCount: 0 });
    }

    const userId = auth.user.id;
    let importedCount = 0;

    for (const record of guestRecords) {
      if (!record.problemId) continue;

      // Verify problem exists
      const problem = await prisma.dsaProblem.findUnique({
        where: { id: record.problemId },
        select: { id: true },
      });
      if (!problem) continue;

      // If problem was marked as completed locally, record practice attempt idempotently
      if (record.isSolved) {
        // Check if user already solved it on the server or imported it
        const existingSolve = await prisma.dsaSubmission.findFirst({
          where: { userId, problemId: record.problemId, status: 'ACCEPTED' },
        });

        const existingAttempt = await prisma.practiceAttempt.findFirst({
          where: { userId, problemId: record.problemId, status: 'ACCEPTED' },
        });

        if (!existingSolve && !existingAttempt) {
          await PracticeService.recordAttempt({
            userId,
            problemId: record.problemId,
            attemptType: 'GUEST_IMPORT',
            method: 'IDE',
            status: 'ACCEPTED',
            durationSec: record.durationSec || 60,
            code: record.draftCode || undefined,
            userTimezone: auth.user.timezone,
          });
          importedCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      importedCount,
      message: `Successfully imported ${importedCount} guest progress record(s).`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to import guest progress.' },
      { status: 500 }
    );
  }
}
