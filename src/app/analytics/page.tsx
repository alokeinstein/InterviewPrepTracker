import React from 'react';
import { prisma } from '@/lib/prisma';
import { getServerAuth } from '@/lib/auth';
import { MasteryService } from '@/services/learning/masteryService';
import { PracticeService } from '@/services/practice/practiceService';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ContributionHeatmap } from '@/components/analytics/ContributionHeatmap';
import { MonthlyActivityChart } from '@/components/analytics/MonthlyActivityChart';
import { ProblemsOverviewCard } from '@/components/analytics/ProblemsOverviewCard';
import { ActivityHistoryList } from '@/components/analytics/ActivityHistoryList';
import { AlertTriangle, Activity } from 'lucide-react';

export const revalidate = 0;

export default async function AnalyticsPage() {
  const auth = await getServerAuth();
  if (!auth?.user) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
          <Activity className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Developer Practice Analytics
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Sign in to access your activity heatmap, midnight streak calculation, one-row-per-question practice history, and algorithmic readiness index.
          </p>
        </div>
        <div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs shadow-md hover:bg-primary/90 transition"
          >
            Sign In with Google / Gmail
          </Link>
        </div>
      </div>
    );
  }

  const user = auth.user;
  const userId = user.id;
  const timezone = user.timezone || 'UTC';

  const currentYear = new Date().getFullYear();

  const [
    readiness,
    allProblems,
    masteredCount,
    streakResult,
    activityData,
    historyResponse,
    solvedSessions,
  ] = await Promise.all([
    MasteryService.getReadinessReport(userId),
    prisma.dsaProblem.findMany({
      select: { id: true, difficulty: true },
    }),
    prisma.revisionItem.count({
      where: {
        userId,
        repetitionNumber: { gte: 5 },
        intervalDays: { gte: 14 },
      },
    }),
    PracticeService.refreshUserStreak(userId, timezone),
    PracticeService.getYearActivityMap(userId, currentYear),
    PracticeService.getLatestActivityHistory({ userId, page: 1, pageSize: 15 }),
    prisma.practiceSession.findMany({
      where: {
        userId,
        solved: true,
      },
      select: { problemId: true },
      distinct: ['problemId'],
    }),
  ]);

  // Aggregate distinct solved problems by difficulty
  const uniqueSolvedProblemIds = new Set(solvedSessions.map((s) => s.problemId));
  const problemMap = new Map(allProblems.map((p) => [p.id, p.difficulty]));

  let easySolved = 0;
  let mediumSolved = 0;
  let hardSolved = 0;

  uniqueSolvedProblemIds.forEach((pId) => {
    const diff = problemMap.get(pId);
    if (diff === 'EASY') easySolved++;
    else if (diff === 'MEDIUM') mediumSolved++;
    else if (diff === 'HARD') hardSolved++;
  });

  const totalSolved = uniqueSolvedProblemIds.size;
  const codingScore = totalSolved * 2 + Math.round(readiness.overallScore);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="font-mono text-xs">
              EVIDENCE-BASED METRICS
            </Badge>
            <Badge variant="secondary" className="font-mono text-xs">
              Verified Submission Telemetry
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Interview Readiness &amp; Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Real performance tracking from verified test suite executions, stopwatch solve durations,
            and SM-2 multi-modal revision sessions.
          </p>
        </div>
      </div>

      {/* 1. Problems Overview Card & Stats */}
      <ProblemsOverviewCard
        totalSolved={totalSolved}
        easySolved={easySolved}
        mediumSolved={mediumSolved}
        hardSolved={hardSolved}
        codingScore={codingScore}
        streak={streakResult.currentStreak}
        masteredCount={masteredCount}
      />

      {/* 2. Yearly Contribution Heatmap (Server-derived unique sessions) */}
      <ContributionHeatmap
        activityData={activityData}
        currentYear={currentYear}
      />

      {/* 3. Monthly Activity Bar Chart (Unique sessions count per day) */}
      <MonthlyActivityChart
        activityData={activityData}
      />

      {/* 4. Chronological Activity History List (One row per unique problem, latest attempt at top) */}
      <ActivityHistoryList
        initialActivities={historyResponse.items}
        initialTotal={historyResponse.total}
      />

      {/* 5. Priority Algorithmic Weaknesses */}
      <Card className="p-6 space-y-4 bg-card/60 border border-border/80">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2 uppercase tracking-tight">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span>Priority Weakness Areas</span>
          </h3>
          <Badge variant="warning" className="text-[10px] font-mono">
            Remediation Queue
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {readiness.weakestPatterns.map((w) => (
            <div key={w.name} className="p-3 rounded-lg border border-border/60 bg-background/50 space-y-1">
              <div className="flex justify-between text-xs font-semibold text-foreground">
                <span>{w.name}</span>
                <span className="font-mono text-amber-500">{w.score}% Mastery</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Priority algorithmic pattern needing active recall practice.
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
