import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getServerAuth } from '@/lib/auth';
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

  // Determine authenticated context securely from session cookie
  const auth = await getServerAuth();
  const isAuthenticated = Boolean(auth && auth.user);

  let lastAccepted = null;
  if (isAuthenticated && auth?.user) {
    lastAccepted = await prisma.dsaSubmission.findFirst({
      where: {
        userId: auth.user.id,
        problemId: problem.id,
        status: 'ACCEPTED',
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  const serverSolveInfo = {
    isSolved: !!lastAccepted,
    lastSolvedAt: lastAccepted?.createdAt ? lastAccepted.createdAt.toISOString() : null,
    durationSec: lastAccepted?.runtimeMs ? Math.round(lastAccepted.runtimeMs / 1000) : null,
  };

  // Secure Problem Props: Strip optimalSolution and private solution details for unauthenticated guests
  const sanitizedProblem = {
    ...problem,
    optimalSolution: isAuthenticated ? problem.optimalSolution : null,
    suboptimalSolution: isAuthenticated ? problem.suboptimalSolution : null,
  };

  return (
    <div className="py-2">
      <ProblemWorkspace
        problem={sanitizedProblem as any}
        serverSolveInfo={serverSolveInfo}
        isAuthenticated={isAuthenticated}
        currentUser={auth?.user ?? null}
      />
    </div>
  );
}
