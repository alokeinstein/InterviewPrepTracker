import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getServerAuth } from '@/lib/auth';
import { SpacedRepetitionService } from '@/services/revision/spacedRepetitionService';
import { ProblemTelemetry } from '@/components/dsa/ProblemCard';
import { LevelProblemGrid, LevelProblemItem, ViewMode } from '@/components/dsa/LevelProblemGrid';
import { LEVEL_METADATA } from '@/lib/dsa/levelMetadata';
import { Badge } from '@/components/ui/Badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  CheckCircle2, 
  Flame, 
  ArrowLeft
} from 'lucide-react';

export const revalidate = 0;

export default async function DedicatedLevelPage({
  params,
  searchParams,
}: {
  params: Promise<{ levelId: string }>;
  searchParams: Promise<{ difficulty?: string; q?: string; status?: string; view?: string }>;
}) {
  const { levelId } = await params;
  const levelNum = parseInt(levelId);

  if (isNaN(levelNum) || levelNum < 1 || levelNum > 23) {
    notFound();
  }

  const { difficulty, q: searchQuery, status: statusFilter, view: viewParam } = await searchParams;

  // 1. Fetch user for telemetry from authenticated session
  const auth = await getServerAuth();
  const userId = auth?.user?.id;
  const isAuthenticated = Boolean(userId);

  // 2. Fetch all problems in this level
  const problems = await prisma.dsaProblem.findMany({
    where: { level: levelNum },
    orderBy: { leetcodeId: 'asc' },
    include: { pattern: true },
  });

  const problemIds = problems.map((p) => p.id);

  // 3. Fetch submissions & telemetry in parallel (empty for unauthenticated guests)
  const [submissions, telemetryMap] = await Promise.all([
    userId
      ? prisma.dsaSubmission.findMany({
          where: {
            userId,
            problemId: { in: problemIds },
          },
          orderBy: { createdAt: 'desc' },
          select: {
            problemId: true,
            status: true,
            optimalityScore: true,
          },
        })
      : Promise.resolve([]),
    userId
      ? SpacedRepetitionService.getBatchTelemetry(userId, problemIds)
      : Promise.resolve(new Map()),
  ]);

  // Aggregate user solve statuses & highest optimality scores
  const solvedMap = new Map<string, { isSolved: boolean; highestOptimality: number }>();
  for (const sub of submissions) {
    const existing = solvedMap.get(sub.problemId) || { isSolved: false, highestOptimality: 0 };
    if (sub.status === 'ACCEPTED') {
      existing.isSolved = true;
      if (sub.optimalityScore > existing.highestOptimality) {
        existing.highestOptimality = sub.optimalityScore;
      }
    }
    solvedMap.set(sub.problemId, existing);
  }

  // Calculate Level completion stats
  const totalInLevel = problems.length;
  let solvedInLevelCount = 0;
  for (const p of problems) {
    if (solvedMap.get(p.id)?.isSolved) {
      solvedInLevelCount++;
    }
  }
  const levelPercentage = totalInLevel > 0 ? Math.round((solvedInLevelCount / totalInLevel) * 100) : 0;

  // Filter problems according to search, difficulty, and revision status
  const filteredProblems = problems.filter((p) => {
    // Difficulty filter
    if (difficulty && p.difficulty !== difficulty) return false;

    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchTopic = p.topic.toLowerCase().includes(q);
      const matchNum = p.leetcodeId?.toString().includes(q);
      if (!matchTitle && !matchTopic && !matchNum) return false;
    }

    // Status filter
    if (statusFilter) {
      const isSolved = solvedMap.get(p.id)?.isSolved ?? false;
      const telem = telemetryMap.get(p.id);

      if (statusFilter === 'SOLVED' && !isSolved) return false;
      if (statusFilter === 'UNSOLVED' && isSolved) return false;
      if (statusFilter === 'DUE' && !(telem?.isDue || telem?.isOverdue)) return false;
    }

    return true;
  });

  const levelMeta = LEVEL_METADATA[levelNum] || {
    title: `Level ${levelNum}`,
    topic: 'Algorithmic Mastery',
    description: 'Systematic pattern progression and test suite validation.',
    concepts: [],
  };

  const prevLevel = levelNum > 1 ? levelNum - 1 : null;
  const nextLevel = levelNum < 23 ? levelNum + 1 : null;

  // Transform filtered problems for LevelProblemGrid
  const problemItems: LevelProblemItem[] = filteredProblems.map((prob) => {
    const solveStatus = solvedMap.get(prob.id);
    const telem = telemetryMap.get(prob.id);

    const initialTelemetry: ProblemTelemetry = telem
      ? {
          totalPracticed: telem.totalPracticed,
          codeCount: telem.codeCount,
          handCount: telem.handCount,
          mentalCount: telem.mentalCount,
          lastPracticedAt: telem.lastPracticedAt ? telem.lastPracticedAt.toISOString() : null,
          nextReviewDate: telem.nextReviewDate ? telem.nextReviewDate.toISOString() : null,
          isDue: telem.isDue,
          isOverdue: telem.isOverdue,
          dueStatusText: telem.dueStatusText,
          currentStage: telem.currentStage,
          recommendedMode: telem.recommendedMode,
        }
      : {
          totalPracticed: solveStatus?.isSolved ? 1 : 0,
          codeCount: solveStatus?.isSolved ? 1 : 0,
          handCount: 0,
          mentalCount: 0,
          lastPracticedAt: null,
          nextReviewDate: null,
          isDue: false,
          isOverdue: false,
          dueStatusText: 'Unscheduled',
          currentStage: solveStatus?.isSolved ? 1 : 0,
          recommendedMode: solveStatus?.isSolved ? 'HAND' : 'CODE',
        };

    return {
      id: prob.id,
      leetcodeId: prob.leetcodeId,
      title: prob.title,
      slug: prob.slug,
      level: prob.level,
      difficulty: prob.difficulty,
      topic: prob.topic,
      subtopic: prob.subtopic,
      patternName: prob.pattern?.name,
      estimatedTimeMin: prob.estimatedTimeMin,
      optimalTimeComplexity: prob.optimalTimeComplexity,
      optimalSpaceComplexity: prob.optimalSpaceComplexity,
      isSolved: solveStatus?.isSolved ?? false,
      optimalityScore: solveStatus?.highestOptimality ?? null,
      telemetry: initialTelemetry,
    };
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Breadcrumb & Switcher Navigation */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2 text-xs font-mono">
          <Link
            href="/dsa"
            className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>DSA Arena</span>
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-primary font-bold">Level {levelNum}</span>
        </div>

        {/* Level Quick Nav */}
        <div className="flex items-center gap-2">
          {prevLevel ? (
            <Link
              href={`/levels/${prevLevel}`}
              className="px-2.5 py-1 text-xs rounded-lg border border-border bg-card hover:bg-muted text-foreground flex items-center gap-1 transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Level {prevLevel}</span>
            </Link>
          ) : (
            <span className="px-2.5 py-1 text-xs rounded-lg border border-border/40 text-muted-foreground/40 flex items-center gap-1 cursor-not-allowed">
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </span>
          )}

          <span className="text-xs font-mono font-bold text-muted-foreground px-2">
            {levelNum} of 23
          </span>

          {nextLevel ? (
            <Link
              href={`/levels/${nextLevel}`}
              className="px-2.5 py-1 text-xs rounded-lg border border-border bg-card hover:bg-muted text-foreground flex items-center gap-1 transition"
            >
              <span>Level {nextLevel}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <span className="px-2.5 py-1 text-xs rounded-lg border border-border/40 text-muted-foreground/40 flex items-center gap-1 cursor-not-allowed">
              Next <ChevronRight className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>

      {/* Level Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-card via-card/90 to-card border border-border shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="default" className="font-mono text-xs">
                LEVEL {levelNum}
              </Badge>
              <Badge variant="outline" className="font-mono text-xs">
                {levelMeta.topic}
              </Badge>
              <Badge
                variant={levelPercentage === 100 ? 'success' : 'secondary'}
                className="font-mono text-xs"
              >
                {solvedInLevelCount} / {totalInLevel} Solved
              </Badge>
              {!isAuthenticated && (
                <Badge variant="outline" className="font-mono text-xs text-amber-500 border-amber-500/30 bg-amber-500/10">
                  Guest Mode
                </Badge>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              {levelMeta.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
              {levelMeta.description}
            </p>
          </div>

          {/* Level Progress Gauge */}
          <div className="p-4 rounded-xl border border-border bg-muted/20 min-w-[200px] text-right space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-muted-foreground">Level Completion</span>
              <span className={levelPercentage === 100 ? 'text-emerald-400 font-bold' : 'text-primary font-bold'}>
                {levelPercentage}%
              </span>
            </div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  levelPercentage === 100 ? 'bg-emerald-500' : 'bg-primary'
                }`}
                style={{ width: `${levelPercentage}%` }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground font-mono">
              {totalInLevel - solvedInLevelCount} questions remaining
            </p>
          </div>
        </div>

        {/* Filter and Search Controls */}
        <div className="pt-4 border-t border-border flex flex-col md:flex-row md:items-center justify-between gap-3 flex-wrap">
          {/* Search Box */}
          <form method="GET" action={`/levels/${levelNum}`} className="flex items-center gap-2">
            {difficulty && <input type="hidden" name="difficulty" value={difficulty} />}
            {statusFilter && <input type="hidden" name="status" value={statusFilter} />}
            <div className="relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
              <input
                type="text"
                name="q"
                defaultValue={searchQuery || ''}
                placeholder={`Search Level ${levelNum} questions...`}
                className="pl-9 pr-3 py-1.5 text-xs bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-52 sm:w-64"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition shadow"
            >
              Filter
            </button>
            {(searchQuery || difficulty || statusFilter) && (
              <Link
                href={`/levels/${levelNum}`}
                className="text-xs text-muted-foreground hover:text-foreground underline ml-1 font-mono"
              >
                Clear
              </Link>
            )}
          </form>

          {/* Quick Filter Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Difficulty Filter */}
            <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border">
              <Link href={`/levels/${levelNum}${searchQuery ? `?q=${searchQuery}` : ''}`}>
                <Badge
                  variant={!difficulty ? 'default' : 'outline'}
                  className="text-[10px] cursor-pointer"
                >
                  All
                </Badge>
              </Link>
              <Link href={`/levels/${levelNum}?difficulty=EASY${searchQuery ? `&q=${searchQuery}` : ''}`}>
                <Badge
                  variant={difficulty === 'EASY' ? 'success' : 'outline'}
                  className="text-[10px] cursor-pointer text-emerald-400"
                >
                  Easy
                </Badge>
              </Link>
              <Link href={`/levels/${levelNum}?difficulty=MEDIUM${searchQuery ? `&q=${searchQuery}` : ''}`}>
                <Badge
                  variant={difficulty === 'MEDIUM' ? 'warning' : 'outline'}
                  className="text-[10px] cursor-pointer text-amber-400"
                >
                  Med
                </Badge>
              </Link>
              <Link href={`/levels/${levelNum}?difficulty=HARD${searchQuery ? `&q=${searchQuery}` : ''}`}>
                <Badge
                  variant={difficulty === 'HARD' ? 'destructive' : 'outline'}
                  className="text-[10px] cursor-pointer text-rose-400"
                >
                  Hard
                </Badge>
              </Link>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border">
              <Link href={`/levels/${levelNum}?status=DUE${difficulty ? `&difficulty=${difficulty}` : ''}`}>
                <Badge
                  variant={statusFilter === 'DUE' ? 'warning' : 'outline'}
                  className="text-[10px] cursor-pointer flex items-center gap-1 text-amber-400"
                >
                  <Flame className="w-2.5 h-2.5" /> Due / Overdue
                </Badge>
              </Link>
              <Link href={`/levels/${levelNum}?status=SOLVED${difficulty ? `&difficulty=${difficulty}` : ''}`}>
                <Badge
                  variant={statusFilter === 'SOLVED' ? 'success' : 'outline'}
                  className="text-[10px] cursor-pointer flex items-center gap-1 text-emerald-400"
                >
                  <CheckCircle2 className="w-2.5 h-2.5" /> Solved
                </Badge>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Problems Grid with View Mode Switcher (Simplistic vs Detailed Telemetry) */}
      <LevelProblemGrid
        levelNum={levelNum}
        problems={problemItems}
        totalInLevel={totalInLevel}
        defaultViewMode={(viewParam === 'detailed' ? 'detailed' : 'simplistic') as ViewMode}
      />
    </div>
  );
}
