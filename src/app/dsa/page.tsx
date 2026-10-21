import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LevelCardGrid, LevelInfo } from '@/components/dsa/LevelCardGrid';
import { Code2, ArrowRight, Clock, CheckCircle2, Search, Filter, ChevronLeft, ChevronRight, Check } from 'lucide-react';

export const revalidate = 0;

const LEVEL_TITLES: Record<number, { title: string; topic: string }> = {
  1: { title: "Fundamentals & Easy Arrays", topic: "Array Manipulation" },
  2: { title: "Hashing, Prefix Sum & Frequency", topic: "Hash Maps & Invariant Sums" },
  3: { title: "Two Pointers", topic: "Opposite & Fast/Slow Convergence" },
  4: { title: "Sliding Window", topic: "Dynamic Subarrays" },
  5: { title: "Binary Search Basics", topic: "Monotonic Predicates" },
  6: { title: "Linked List Fundamentals", topic: "Pointers & Cycles" },
  7: { title: "Stack, Queue & Monotonic Stack", topic: "LIFO & Next Greater Element" },
  8: { title: "Intervals & Greedy", topic: "Interval Merging & Scheduling" },
  9: { title: "Heap / Priority Queue / Top K", topic: "Top-K & Stream Medians" },
  10: { title: "Trees: DFS/BFS Foundations", topic: "Recursion & LCA" },
  11: { title: "Trees: Advanced", topic: "Tree DP & Serialization" },
  12: { title: "Backtracking: Subsets & Permutations", topic: "State Space Pruning" },
  13: { title: "Matrix & Grid Traversal", topic: "Flood Fill & 2D Graphs" },
  14: { title: "Graph BFS/DFS", topic: "Cycles & Bipartite Graphs" },
  15: { title: "Topological Sort & Union Find", topic: "DAGs & Disjoint Sets" },
  16: { title: "Greedy & Advanced Array Patterns", topic: "Kadane's & Stock States" },
  17: { title: "Dynamic Programming I: 1D", topic: "Linear Recurrence & Tabulation" },
  18: { title: "Dynamic Programming II: 2D & Strings", topic: "LCS & Edit Distance" },
  19: { title: "Advanced DP & State Machines", topic: "Game Theory & Bitmasks" },
  20: { title: "Advanced Graphs & Shortest Paths", topic: "Dijkstra & Bridges" },
  21: { title: "Advanced Arrays & Graph Extensions", topic: "Boyer-Moore & Range Search" },
  22: { title: "Advanced Binary Search, Trie & String", topic: "Prefix Trees & Continuous BS" },
  23: { title: "Advanced String, Design & Intervals", topic: "System Design Data Structures" },
};

export default async function DsaArenaPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string; difficulty?: string; q?: string; page?: string; viewAll?: string }>;
}) {
  const params = await searchParams;
  const levelFilter = params.level ? parseInt(params.level) : undefined;
  const difficultyFilter = params.difficulty as any;
  const searchQuery = params.q?.trim();
  const page = Math.max(1, parseInt(params.page || '1'));
  const isViewAll = params.viewAll === 'true';
  const pageSize = levelFilter ? 100 : (isViewAll ? 500 : 48);

  const where: any = {};
  if (levelFilter) where.level = levelFilter;
  if (difficultyFilter) where.difficulty = difficultyFilter;
  if (searchQuery) where.title = { contains: searchQuery, mode: 'insensitive' };

  // Fetch data in parallel
  const [
    problems, 
    filteredCount, 
    totalCatalogCount, 
    levelGroups, 
    acceptedSubmissions
  ] = await Promise.all([
    prisma.dsaProblem.findMany({
      where,
      orderBy: { leetcodeId: 'asc' },
      skip: levelFilter || isViewAll ? 0 : (page - 1) * pageSize,
      take: pageSize,
      include: { pattern: true },
    }),
    prisma.dsaProblem.count({ where }),
    prisma.dsaProblem.count(),
    prisma.dsaProblem.groupBy({
      by: ['level'],
      _count: { id: true },
      orderBy: { level: 'asc' },
    }),
    prisma.dsaSubmission.findMany({
      where: { status: 'ACCEPTED' },
      select: { problemId: true, problem: { select: { level: true } } },
    }),
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

  // Build Level Info cards
  const levelsInfo: LevelInfo[] = levelGroups.map((g) => {
    const meta = LEVEL_TITLES[g.level] || { title: `Level ${g.level}`, topic: 'Algorithms' };
    const solvedSet = levelSolvedCounts[g.level] || new Set();
    return {
      levelNumber: g.level,
      title: meta.title,
      topic: meta.topic,
      totalProblems: g._count.id,
      solvedCount: solvedSet.size,
    };
  });

  const totalPages = Math.ceil(filteredCount / pageSize);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Platform Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="font-mono text-xs">
              {totalCatalogCount} CURRICULUM PROBLEMS
            </Badge>
            <Badge variant="secondary" className="font-mono text-xs">
              23 Dependency Levels
            </Badge>
            <Badge variant="success" className="font-mono text-xs">
              {totalSolvedCount} / {totalCatalogCount} Solved
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            DSA Arena
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Enterprise-scale algorithmic curriculum: Complete multi-tier test suites, runtime percentile benchmarking, and progressive 5-stage hint engines.
          </p>
        </div>

        {/* Global Search & Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <form method="GET" action="/dsa" className="flex items-center gap-2">
            {levelFilter && <input type="hidden" name="level" value={levelFilter} />}
            {difficultyFilter && <input type="hidden" name="difficulty" value={difficultyFilter} />}
            <div className="relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
              <input
                type="text"
                name="q"
                defaultValue={searchQuery || ''}
                placeholder="Search 500 problems..."
                className="pl-9 pr-3 py-1.5 text-xs bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-48 sm:w-60"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition shadow"
            >
              Search
            </button>
          </form>

          {/* Difficulty Filter Badges */}
          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border">
            <Link href={`/dsa${levelFilter ? `?level=${levelFilter}` : ''}`}>
              <Badge
                variant={!difficultyFilter ? 'default' : 'outline'}
                className="text-[10px] cursor-pointer"
              >
                All
              </Badge>
            </Link>
            <Link href={`/dsa?difficulty=EASY${levelFilter ? `&level=${levelFilter}` : ''}`}>
              <Badge
                variant={difficultyFilter === 'EASY' ? 'success' : 'outline'}
                className="text-[10px] cursor-pointer text-emerald-400"
              >
                Easy
              </Badge>
            </Link>
            <Link href={`/dsa?difficulty=MEDIUM${levelFilter ? `&level=${levelFilter}` : ''}`}>
              <Badge
                variant={difficultyFilter === 'MEDIUM' ? 'warning' : 'outline'}
                className="text-[10px] cursor-pointer text-amber-400"
              >
                Med
              </Badge>
            </Link>
            <Link href={`/dsa?difficulty=HARD${levelFilter ? `&level=${levelFilter}` : ''}`}>
              <Badge
                variant={difficultyFilter === 'HARD' ? 'destructive' : 'outline'}
                className="text-[10px] cursor-pointer text-rose-400"
              >
                Hard
              </Badge>
            </Link>
          </div>
        </div>
      </div>

      {/* 23 Gamified Level Cards Navigation Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>Curriculum Progression</span>
            <span className="text-xs font-mono text-muted-foreground font-normal">
              (Click a card to filter)
            </span>
          </h2>
          {levelFilter && (
            <Link
              href="/dsa"
              className="text-xs text-primary hover:underline font-medium"
            >
              Reset to all levels
            </Link>
          )}
        </div>
        <LevelCardGrid
          levels={levelsInfo}
          selectedLevel={levelFilter}
          totalSolved={totalSolvedCount}
          totalProblems={totalCatalogCount}
        />
      </section>

      {/* Problem Grid & Table Header */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-foreground">
              {levelFilter 
                ? `Level ${levelFilter}: ${LEVEL_TITLES[levelFilter]?.title || ''}` 
                : 'All Curriculum Problems'}
            </h3>
            <Badge variant="outline" className="font-mono text-xs">
              Showing {problems.length} of {filteredCount}
            </Badge>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-2 text-xs">
            {!levelFilter && (
              <Link
                href={isViewAll ? '/dsa' : '/dsa?viewAll=true'}
                className="text-muted-foreground hover:text-foreground transition underline font-mono text-xs"
              >
                {isViewAll ? 'Paginated View (48 / page)' : 'View All 498 Problems'}
              </Link>
            )}
          </div>
        </div>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {problems.map((problem) => {
            const isSolved = solvedProblemIdSet.has(problem.id);
            return (
              <Link key={problem.id} href={`/dsa/${problem.slug}`} className="group block focus:outline-none">
                <Card className={`h-full p-4 flex flex-col justify-between transition-all duration-200 bg-card/70 hover:bg-card hover:border-primary/50 ${
                  isSolved ? 'border-emerald-500/40 bg-emerald-500/5' : ''
                }`}>
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-muted-foreground">
                          #{problem.leetcodeId}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                          Level {problem.level}
                        </span>
                      </div>
                      <Badge
                        variant={
                          problem.difficulty === 'EASY'
                            ? 'success'
                            : problem.difficulty === 'MEDIUM'
                            ? 'warning'
                            : 'destructive'
                        }
                        className="text-[10px] font-mono px-2 py-0.5"
                      >
                        {problem.difficulty}
                      </Badge>
                    </div>

                    <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {problem.title}
                    </h3>
                    
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      Pattern: {problem.pattern?.name || problem.topic}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-border flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      {isSolved ? (
                        <span className="text-emerald-500 font-semibold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                        </span>
                      ) : (
                        <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                          <Clock className="w-3 h-3" /> ~{problem.estimatedTimeMin}m
                        </span>
                      )}
                    </div>

                    <span className="text-primary font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1 text-xs">
                      Practice <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Pagination when viewing all */}
        {!levelFilter && !isViewAll && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-6 border-t border-border">
            <Link
              href={`/dsa?page=${Math.max(1, page - 1)}${difficultyFilter ? `&difficulty=${difficultyFilter}` : ''}${searchQuery ? `&q=${searchQuery}` : ''}`}
              className={`p-2 rounded-lg border border-border text-xs flex items-center gap-1 transition ${
                page <= 1 ? 'pointer-events-none opacity-40' : 'hover:bg-muted'
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Link>

            <span className="text-xs font-mono text-muted-foreground">
              Page <strong className="text-foreground">{page}</strong> of <strong className="text-foreground">{totalPages}</strong>
            </span>

            <Link
              href={`/dsa?page=${Math.min(totalPages, page + 1)}${difficultyFilter ? `&difficulty=${difficultyFilter}` : ''}${searchQuery ? `&q=${searchQuery}` : ''}`}
              className={`p-2 rounded-lg border border-border text-xs flex items-center gap-1 transition ${
                page >= totalPages ? 'pointer-events-none opacity-40' : 'hover:bg-muted'
              }`}
            >
              Next <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
