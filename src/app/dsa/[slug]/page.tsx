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

  return (
    <div className="py-2">
      <ProblemWorkspace problem={problem as any} />
    </div>
  );
}
