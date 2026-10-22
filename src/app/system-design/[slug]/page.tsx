import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getServerAuth } from '@/lib/auth';
import { LessonRunner } from '@/features/system-design/LessonRunner';

export const revalidate = 0;

export default async function ConceptLessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const auth = await getServerAuth();
  const user = auth?.user;
  const concept = await prisma.concept.findUnique({
    where: { slug },
    include: {
      chapter: true,
      masteries: user ? { where: { userId: user.id } } : false,
      relationsFrom: {
        include: { toConcept: true },
      },
    },
  });

  if (!concept) {
    notFound();
  }

  return (
    <div className="py-2">
      <LessonRunner concept={concept} />
    </div>
  );
}
