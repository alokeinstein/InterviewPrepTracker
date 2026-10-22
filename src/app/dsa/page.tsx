import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getServerAuth } from '@/lib/auth';
import { Badge } from '@/components/ui/Badge';
import { LevelCardGrid, LevelInfo } from '@/components/dsa/LevelCardGrid';
import { LEVEL_METADATA } from '@/lib/dsa/levelMetadata';
import { redirect } from 'next/navigation';
import { Layers, CheckCircle2, Flame, Award } from 'lucide-react';

export const revalidate = 0;

export default async function DsaArenaPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string }>;
}) {
  const params = await searchParams;
  if (params.level) {
    redirect(`/levels/${params.level}`);
  }

  // Determine authenticated user session
  const auth = await getServerAuth();
  const userId = auth?.user?.id;

  // Fetch catalog aggregate stats and user progress in parallel
  const [totalCatalogCount, levelGroups, acceptedSubmissions] = await Promise.all([
    prisma.dsaProblem.count(),
    prisma.dsaProblem.groupBy({
      by: ['level'],
      _count: { id: true },
      orderBy: { level: 'asc' },
    }),
    userId
      ? prisma.dsaSubmission.findMany({
          where: { userId, status: 'ACCEPTED' },
          select: { problemId: true, problem: { select: { level: true } } },
        })
      : Promise.resolve([]),
  ]);

  // Aggregate user progress metrics
  const solvedProblemIdSet = new Set(acceptedSubmissions.map((s) => s.problemId));
  const totalSolvedCount = solvedProblemIdSet.size;

  const levelSolvedCounts: Record<number, Set<string>> = {};
  for (const sub of acceptedSubmissions) {
    if (sub.problem?.level) {
      if (!levelSolvedCounts[sub.problem.level]) {
        levelSolvedCounts[sub.problem.level] = new Set();
      }
      levelSolvedCounts[sub.problem.level].add(sub.problemId);
    }
  }

  // Build enhanced Level Info cards with descriptions and concepts
  const levelsInfo: LevelInfo[] = levelGroups.map((g) => {
    const meta = LEVEL_METADATA[g.level] || {
      title: `Level ${g.level}`,
      topic: 'Algorithms & Problem Solving',
      description: 'Systematic algorithmic progression and pattern mastery.',
      concepts: [],
    };
    const solvedSet = levelSolvedCounts[g.level] || new Set();
    return {
      levelNumber: g.level,
      title: meta.title,
      topic: meta.topic,
      description: meta.description,
      concepts: meta.concepts,
      totalProblems: g._count.id,
      solvedCount: solvedSet.size,
    };
  });

  const completionPct = totalCatalogCount > 0
    ? Math.round((totalSolvedCount / totalCatalogCount) * 100)
    : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Platform Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="outline" className="font-mono text-xs">
              {totalCatalogCount} CURRICULUM PROBLEMS
            </Badge>
            <Badge variant="secondary" className="font-mono text-xs">
              23 Dependency Levels
            </Badge>
            <Badge variant="success" className="font-mono text-xs">
              {totalSolvedCount} / {totalCatalogCount} Solved ({completionPct}%)
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            DSA Arena
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            Enterprise-scale algorithmic curriculum: Select any dependency level below to open its dedicated problem workspace with customizable card views and spaced repetition telemetry.
          </p>
        </div>

        {/* Quick Stat Pill Highlights */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-xl border border-border bg-card/60 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-muted-foreground block">Solved</span>
              <span className="text-sm font-bold font-mono text-foreground">
                {totalSolvedCount} / {totalCatalogCount}
              </span>
            </div>
          </div>

          <div className="px-4 py-2.5 rounded-xl border border-border bg-card/60 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-muted-foreground block">Roadmap</span>
              <span className="text-sm font-bold font-mono text-foreground">
                23 Levels
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 23 Gamified Level Cards Navigation Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>Curriculum Progression Roadmap</span>
            <span className="text-xs font-mono text-muted-foreground font-normal hidden sm:inline">
              — Click any card to enter the dedicated level problem suite
            </span>
          </h2>
        </div>

        <LevelCardGrid
          levels={levelsInfo}
          totalSolved={totalSolvedCount}
          totalProblems={totalCatalogCount}
        />
      </section>
    </div>
  );
}
