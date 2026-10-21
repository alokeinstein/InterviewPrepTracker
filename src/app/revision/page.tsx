import React from 'react';
import { prisma } from '@/lib/prisma';
import { RevisionCard } from '@/features/revision/RevisionCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Repeat, Clock, CheckCircle, Flame, Sparkles } from 'lucide-react';

export const revalidate = 0;

export default async function RevisionPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const params = await searchParams;
  const isQuick10 = params.mode === 'quick10';

  const user = await prisma.user.findFirst();
  const userId = user?.id || 'user-default-1';

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const dueItems = await prisma.revisionItem.findMany({
    where: {
      userId,
      nextReviewDate: { lte: endOfToday },
    },
    include: {
      dsaProblem: {
        select: { id: true, title: true, slug: true, difficulty: true, topic: true, optimalTimeComplexity: true },
      },
      concept: {
        select: { id: true, name: true, slug: true, summary: true, whyItMatters: true, sourceRef: true },
      },
      mistake: {
        select: { id: true, violatedInvariant: true, category: true, correctiveAction: true },
      },
    },
    orderBy: { nextReviewDate: 'asc' },
    take: isQuick10 ? 3 : 50,
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="font-mono text-xs">
              ADAPTIVE SPACING
            </Badge>
            <Badge variant="secondary" className="font-mono text-xs">
              SuperMemo SM-2 + Invariants
            </Badge>
            {isQuick10 && (
              <Badge variant="warning" className="font-mono text-xs">
                ⚡ 10-Minute Emergency Mode
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Revision Engine
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Active recall intervals calculated from your actual memory retention, mistake journal invariants,
            and hint dependencies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl border border-border bg-card/60 text-right font-mono">
            <p className="text-[10px] text-muted-foreground uppercase">Due Today</p>
            <p className="text-xl font-bold text-primary">{dueItems.length}</p>
          </div>
        </div>
      </div>

      {/* Due Items List */}
      {dueItems.length === 0 ? (
        <Card className="p-12 text-center space-y-3 bg-card/50">
          <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <CheckCircle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Zero Revisions Overdue!</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            You are completely caught up on your spaced retrieval queue. Check out today's System Design lesson
            or solve a new problem in the DSA Arena.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-xs font-mono font-semibold uppercase text-muted-foreground">
            Today's Scheduled Active Retrieval Cards ({dueItems.length}):
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dueItems.map((item) => (
              <RevisionCard key={item.id} item={item as any} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
