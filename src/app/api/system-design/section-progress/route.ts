import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const auth = await getRequestAuth(req);
    if (!auth) {
      return NextResponse.json(
        { error: 'Authentication required to save section progress.' },
        { status: 401, headers: { 'Cache-Control': 'private, no-store' } }
      );
    }
    const user = auth.user;

    const { sectionId, isCompleted, notes } = await req.json();

    if (!sectionId) {
      return NextResponse.json({ error: 'Section ID is required' }, { status: 400 });
    }

    const progress = await prisma.sectionProgress.upsert({
      where: {
        userId_sectionId: {
          userId: user.id,
          sectionId,
        },
      },
      update: {
        isCompleted: isCompleted ?? true,
        completedAt: isCompleted ? new Date() : null,
        notes: notes !== undefined ? notes : undefined,
      },
      create: {
        userId: user.id,
        sectionId,
        isCompleted: isCompleted ?? true,
        completedAt: isCompleted ? new Date() : null,
        notes: notes || null,
      },
    });

    return NextResponse.json({ success: true, progress });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
