import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { MockInterviewSession } from '@/features/interview/MockInterviewSession';

export const revalidate = 0;

export default async function MockInterviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const interview = await prisma.mockInterview.findUnique({
    where: { id },
    include: {
      messages: { orderBy: { timestamp: 'asc' } },
      evaluation: true,
    },
  });

  if (!interview) {
    notFound();
  }

  return (
    <div className="py-2">
      <MockInterviewSession interview={interview as any} />
    </div>
  );
}
