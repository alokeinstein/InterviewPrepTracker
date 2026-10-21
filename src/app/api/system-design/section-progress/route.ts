import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { sectionId, isCompleted, notes } = await req.json();

    if (!sectionId) {
      return NextResponse.json({ error: 'Section ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findFirst();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
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
