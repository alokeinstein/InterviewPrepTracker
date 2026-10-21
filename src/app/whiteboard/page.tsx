import React from 'react';
import { prisma } from '@/lib/prisma';
import { WhiteboardCanvas } from '@/features/whiteboard/WhiteboardCanvas';

export const revalidate = 0;

export default async function WhiteboardPage() {
  const user = await prisma.user.findFirst();
  const userId = user?.id || 'user-default-1';

  const design = await prisma.architectureDesign.findFirst({
    where: { userId },
    include: {
      versions: {
        orderBy: { versionNumber: 'desc' },
      },
    },
  });

  return (
    <div className="py-2">
      <WhiteboardCanvas initialDesign={design as any} />
    </div>
  );
}
