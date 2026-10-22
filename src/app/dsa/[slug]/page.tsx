import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProblemWorkspace } from '@/features/dsa/ProblemWorkspace';

export const revalidate = 0;

export default async function ProblemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const problem = await prisma.dsaProblem.findUnique({
    where: { slug },
    include: {
      testCases: true,
      pattern: true,
    },
  });

  if (!problem) {
    notFound();
  }

  const user = await prisma.user.findFirst();
  const lastAccepted = user
    ? await prisma.dsaSubmission.findFirst({
        where: {
          userId: user.id,
          problemId: problem.id,
          status: 'ACCEPTED',
        },
        orderBy: { createdAt: 'desc' },
      })
    : null;

  const serverSolveInfo = {
    isSolved: !!lastAccepted,
    lastSolvedAt: lastAccepted?.createdAt ? lastAccepted.createdAt.toISOString() : null,
    durationSec: lastAccepted?.runtimeMs ? Math.round(lastAccepted.runtimeMs / 1000) : null,
  };

  return (
    <div className="py-2">
      <ProblemWorkspace
        problem={problem as any}
        serverSolveInfo={serverSolveInfo}
      />
    </div>
  );
}
