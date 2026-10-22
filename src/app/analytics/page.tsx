import React from 'react';
import { prisma } from '@/lib/prisma';
import { MasteryService } from '@/services/learning/masteryService';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ContributionHeatmap, DayActivityData } from '@/components/analytics/ContributionHeatmap';
import { MonthlyActivityChart } from '@/components/analytics/MonthlyActivityChart';
import { ProblemsOverviewCard } from '@/components/analytics/ProblemsOverviewCard';
import { ActivityHistoryList } from '@/components/analytics/ActivityHistoryList';
import { AlertTriangle } from 'lucide-react';

export const revalidate = 0;

export default async function AnalyticsPage() {
  const user = await prisma.user.findFirst();
  const userId = user?.id || 'user-default-1';

  const [readiness, submissions, revisionAttempts, allProblems] = await Promise.all([
    MasteryService.getReadinessReport(userId),
    prisma.dsaSubmission.findMany({
      where: { userId },
      include: {
        problem: {
          select: { id: true, title: true, slug: true, level: true, difficulty: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.revisionAttempt.findMany({
      where: {
        revisionItem: { userId },
      },
      include: {
        revisionItem: {
          include: {
            dsaProblem: {
              select: { id: true, title: true, slug: true, level: true, difficulty: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.dsaProblem.findMany({
      select: { id: true, difficulty: true },
    }),
  ]);

  // Aggregate distinct solved problems by difficulty
  const acceptedSubmissions = submissions.filter((s) => s.status === 'ACCEPTED');
  const uniqueSolvedProblemIds = new Set(acceptedSubmissions.map((s) => s.problemId));

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

  // Aggregate calendar daily activity
  const activityData: Record<string, DayActivityData> = {};

  const ensureDay = (dateStr: string) => {
    if (!activityData[dateStr]) {
      activityData[dateStr] = {
        date: dateStr,
        sessions: 0,
        uniqueSolved: 0,
        revisions: 0,
        submissions: 0,
      };
    }
    return activityData[dateStr];
  };

  const solvedSeen = new Set<string>();

  submissions.forEach((sub) => {
    const dStr = sub.createdAt.toISOString().slice(0, 10);
    const day = ensureDay(dStr);
    day.sessions += 1;
    day.submissions += 1;
    if (sub.status === 'ACCEPTED') {
      const key = `${sub.problemId}`;
      if (!solvedSeen.has(key)) {
        solvedSeen.add(key);
        day.uniqueSolved += 1;
      }
    }
  });

  revisionAttempts.forEach((att) => {
    const dStr = att.createdAt.toISOString().slice(0, 10);
    const day = ensureDay(dStr);
    day.sessions += 1;
    day.revisions += 1;
  });

  // Build unified chronological activity items
  const activityList = [
    ...acceptedSubmissions.map((s) => ({
      id: `sub_${s.id}`,
      problemId: s.problemId,
      problemTitle: s.problem.title,
      slug: s.problem.slug,
      level: s.problem.level,
      difficulty: s.problem.difficulty,
      eventType: 'SOLVED',
      method: 'IDE',
      rating: s.optimalityScore ? `${Math.round(s.optimalityScore)}% Optimal` : undefined,
      durationSec: s.runtimeMs ? Math.round(s.runtimeMs / 1000) : 0,
      timestamp: s.createdAt,
    })),
    ...revisionAttempts.map((att) => {
      const prob = att.revisionItem.dsaProblem;
      const method = att.mode === 'CODE' ? 'IDE' : att.mode === 'HAND' ? 'HAND' : 'MENTAL';
      return {
        id: `att_${att.id}`,
        problemId: prob?.id || att.revisionItemId,
        problemTitle: prob?.title || 'Concept Revision',
        slug: prob?.slug,
        level: prob?.level || 1,
        difficulty: prob?.difficulty || 'MEDIUM',
        eventType: 'REVISED',
        method,
        rating: att.struggled ? 'Struggled' : 'Good Recall',
        durationSec: att.durationSec || 60,
        timestamp: att.createdAt,
      };
    }),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Count 5-review mastered questions
  const masteredCount = await prisma.revisionItem.count({
    where: {
      userId,
      repetitionNumber: { gte: 5 },
      intervalDays: { gte: 14 },
    },
  });

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

      {/* 1. Problems Overview Card & Stats (Matching Reference Image 2) */}
      <ProblemsOverviewCard
        totalSolved={totalSolved}
        easySolved={easySolved}
        mediumSolved={mediumSolved}
        hardSolved={hardSolved}
        codingScore={codingScore}
        streak={user?.streak || 4}
        masteredCount={masteredCount}
      />

      {/* 2. Yearly Contribution Heatmap (Matching Reference Image 1) */}
      <ContributionHeatmap
        activityData={activityData}
        currentYear={2026}
      />

      {/* 3. Monthly Activity Bar Chart */}
      <MonthlyActivityChart
        activityData={activityData}
      />

      {/* 4. Chronological Activity History List */}
      <ActivityHistoryList
        initialActivities={activityList}
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
