import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getServerAuth } from '@/lib/auth';
import { ChapterReader } from '@/features/system-design/ChapterReader';

export const revalidate = 0;

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ chapterNumber: string }>;
}) {
  const { chapterNumber } = await params;
  const chNum = parseInt(chapterNumber, 10);

  if (isNaN(chNum)) {
    notFound();
  }

  const auth = await getServerAuth();
  const user = auth?.user;

  const chapter = await prisma.chapter.findUnique({
    where: { chapterNumber: chNum },
    include: {
      part: true,
      sections: {
        orderBy: { sectionNumber: 'asc' },
        include: {
          concepts: true,
          progress: user
            ? {
                where: { userId: user.id },
                select: { isCompleted: true },
              }
            : false,
        },
      },
    },
  });

  if (!chapter) {
    notFound();
  }

  const totalChapters = await prisma.chapter.count();

  return (
    <div className="py-2">
      <ChapterReader chapter={chapter as any} totalChapters={totalChapters} />
    </div>
  );
}
