import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  Play,
  Clock,
  Sparkles,
  Server,
  Code2,
  Repeat,
  Bot,
  Flame,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const revalidate = 0;

export default async function DashboardPage() {
  const user = await prisma.user.findFirst();
  const userId = user?.id || 'user-default-1';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [dailyPlan, dueRevisionsCount, totalDsaCount, totalConceptsCount] = await Promise.all([
    prisma.dailyPlan.findFirst({
      where: { userId },
      orderBy: { date: 'desc' },
    }),
    prisma.revisionItem.count({
      where: {
        userId,
        nextReviewDate: { lte: new Date() },
      },
    }),
    prisma.dsaProblem.count(),
    prisma.concept.count(),
  ]);

  const priorityActions = (dailyPlan?.priorityActions as any[]) || [
    {
      id: 'act-1',
      type: 'SYSTEM_DESIGN_LESSON',
      title: 'DDIA Ch 5: Replication Lag Anomalies',
      durationMin: 12,
      slug: 'replication-lag-anomalies',
      reason: 'Next core lesson in Distributed Data progression.',
    },
    {
      id: 'act-2',
      type: 'DSA_PRACTICE',
      title: 'DSA: Two Sum Variations',
      durationMin: 10,
      slug: 'two-sum',
      reason: 'Daily algorithm drill; Level 1 core invariant reinforcement.',
    },
    {
      id: 'act-3',
      type: 'REVISION_DRILL',
      title: 'Active Invariant Recall: Sliding Window Left Pointer',
      durationMin: 5,
      slug: 'longest-substring-without-repeating-characters',
      reason: 'Past mistake flagged for spaced retrieval today.',
    },
    {
      id: 'act-4',
      type: 'INTERVIEW_DRILL',
      title: '60-Second System Design Pitch: Quorum Consistency',
      durationMin: 3,
      slug: 'dynamo-quorums-version-vectors',
      reason: 'Verbal communication practice for senior/staff interviews.',
    },
  ];

  // Calculate days since last active for Procrastination Recovery
  const daysInactive = user?.lastActiveAt
    ? Math.floor((Date.now() - new Date(user.lastActiveAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const isRecoveryMode = daysInactive >= 3;

  const topAction = priorityActions[0];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Procrastination Recovery Banner (if inactive for 3+ days) */}
      {isRecoveryMode && (
        <Card className="border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase text-amber-500">
                🌱 Procrastination Recovery Mode
              </span>
              <h3 className="text-lg font-bold text-foreground">Welcome back, {user?.name || 'Engineer'}.</h3>
              <p className="text-xs text-muted-foreground max-w-xl">
                No guilt, no broken streak shame. Skip the overdue backlog today—let's do an easy 7-minute
                warmup session to get your momentum back.
              </p>
            </div>
            <Link href="/revision?mode=quick10">
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white shrink-0">
                Start 7-Min Recovery Win
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Hero: "What Should I Do Right Now?" */}
      <div className="rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-card p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-xs font-mono">
                TODAY'S MISSION
              </Badge>
              <span className="text-xs font-mono text-muted-foreground">
                Estimated Time: ~30 min remaining
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              Your Next Best Action
            </h1>
            <p className="text-sm text-foreground/80 leading-relaxed">
              ▶ <strong>{topAction.title}</strong> (~{topAction.durationMin} min). {topAction.reason}
            </p>
          </div>

          <div className="shrink-0 flex flex-col gap-2">
            <Link
              href={
                topAction.type === 'SYSTEM_DESIGN_LESSON'
                  ? `/system-design/${topAction.slug}`
                  : `/dsa/${topAction.slug}`
              }
            >
              <Button size="lg" className="w-full md:w-auto h-14 px-8 text-base font-bold gap-3 shadow-lg hover:scale-[1.02] transition-transform">
                <Play className="h-5 w-5 fill-current" />
                <span>START TRAINING</span>
              </Button>
            </Link>

            <span className="text-[11px] text-center text-muted-foreground font-mono">
              Press <kbd className="bg-muted px-1.5 py-0.5 rounded border border-border">F</kbd> for Focus Mode
            </span>
          </div>
        </div>

        {/* Time Budget Session Selector */}
        <div className="mt-8 pt-6 border-t border-border/80 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-semibold text-muted-foreground">Or choose your time budget:</span>
          <div className="flex items-center gap-2 flex-wrap">
            {[10, 20, 30, 45, 60].map((mins) => (
              <Link key={mins} href={`/revision?budget=${mins}`}>
                <Button variant="outline" size="sm" className="h-8 text-xs font-mono">
                  {mins} min
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Priority Training Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-foreground">Today's Priority Training Queue</h2>
          <span className="text-xs font-mono text-muted-foreground">4 Automated Steps</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {priorityActions.map((act: any, idx: number) => {
            const isSystemDesign = act.type === 'SYSTEM_DESIGN_LESSON';
            const isDsa = act.type === 'DSA_PRACTICE';
            const isRevision = act.type === 'REVISION_DRILL';
            const Icon = isSystemDesign ? Server : isDsa ? Code2 : isRevision ? Repeat : Bot;

            return (
              <Card key={act.id} className="hover:border-primary/50 transition-all p-5 flex flex-col justify-between bg-card/60">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <Icon className="h-4 w-4" />
                      </div>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        Step {idx + 1}
                      </Badge>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {act.durationMin} min
                    </span>
                  </div>

                  <div>
                    <h3 className="font-semibold text-base text-foreground leading-snug">{act.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{act.reason}</p>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-border flex items-center justify-end">
                  <Link
                    href={
                      isSystemDesign
                        ? `/system-design/${act.slug}`
                        : isDsa
                        ? `/dsa/${act.slug}`
                        : isRevision
                        ? `/revision`
                        : `/interview`
                    }
                  >
                    <Button variant="ghost" size="sm" className="text-xs gap-1 text-primary">
                      <span>Begin Step</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Snapshot Vitals */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card/50">
          <p className="text-[11px] font-mono uppercase text-muted-foreground">Learning Streak</p>
          <div className="flex items-center gap-2 mt-1">
            <Flame className="h-5 w-5 text-amber-500 fill-amber-500" />
            <span className="text-2xl font-bold font-mono text-foreground">{user?.streak || 4} days</span>
          </div>
        </Card>

        <Card className="p-4 bg-card/50">
          <p className="text-[11px] font-mono uppercase text-muted-foreground">Due Revisions</p>
          <div className="flex items-center gap-2 mt-1">
            <Repeat className="h-5 w-5 text-primary" />
            <span className="text-2xl font-bold font-mono text-foreground">{dueRevisionsCount}</span>
          </div>
        </Card>

        <Card className="p-4 bg-card/50">
          <p className="text-[11px] font-mono uppercase text-muted-foreground">DSA Curriculum</p>
          <div className="flex items-center gap-2 mt-1">
            <Code2 className="h-5 w-5 text-emerald-500" />
            <span className="text-2xl font-bold font-mono text-foreground">{totalDsaCount} Problems</span>
          </div>
        </Card>

        <Card className="p-4 bg-card/50">
          <p className="text-[11px] font-mono uppercase text-muted-foreground">Interview Readiness</p>
          <div className="flex items-center gap-2 mt-1">
            <ShieldCheck className="h-5 w-5 text-blue-500" />
            <span className="text-2xl font-bold font-mono text-foreground">
              {user?.overallReadiness || 65.5}%
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
