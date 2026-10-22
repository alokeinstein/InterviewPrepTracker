import React from 'react';
import { prisma } from '@/lib/prisma';
import { getServerAuth } from '@/lib/auth';
import { WhiteboardCanvas } from '@/features/whiteboard/WhiteboardCanvas';

export const revalidate = 0;

export default async function WhiteboardPage() {
  const auth = await getServerAuth();
  const userId = auth?.user?.id;

  const design = userId
    ? await prisma.architectureDesign.findFirst({
        where: { userId },
        include: {
          versions: {
            orderBy: { versionNumber: 'desc' },
          },
        },
      })
    : null;

  return (
    <div className="py-2">
      <WhiteboardCanvas initialDesign={design as any} />
    </div>
  );
}
