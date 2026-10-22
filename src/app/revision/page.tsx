import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Repeat, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Sparkles, 
  Code2, 
  PenTool, 
  Brain, 
  AlertTriangle,
  History,
  Filter,
  ArrowRight,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { PracticeMode } from '@prisma/client';

export const revalidate = 0;

export default async function RevisionPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    mode?: string; 
    stage?: string; 
    level?: string; 
    tab?: string;
  }>;
}) {
  const params = await searchParams;
  const filterMode = params.mode as PracticeMode | undefined;
  const filterStage = params.stage ? parseInt(params.stage) : undefined;
  const filterLevel = params.level ? parseInt(params.level) : undefined;
  const activeTab = params.tab || 'queue'; // 'queue' | 'history'

  const user = await prisma.user.findFirst();
  const userId = user?.id || 'user-default-1';

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  // 1. Build where clause for Revision Items
  const itemWhere: any = { userId };
  if (filterStage !== undefined) {
    if (filterStage === 3) {
      itemWhere.currentStage = { gte: 3 };
    } else {
      itemWhere.currentStage = filterStage;
    }
  }
  if (filterMode) {
    itemWhere.recommendedMode = filterMode;
  }
  if (filterLevel) {
    itemWhere.dsaProblem = { level: filterLevel };
  }

  // 2. Fetch Due & Overdue Items
  const [allUserItems, historyAttempts] = await Promise.all([
    prisma.revisionItem.findMany({
      where: itemWhere,
      include: {
        dsaProblem: {
          select: { 
            id: true, 
            leetcodeId: true, 
            title: true, 
            slug: true, 
            difficulty: true, 
            topic: true, 
            level: true, 
            optimalTimeComplexity: true 
          },
        },
        concept: {
          select: { id: true, name: true, slug: true, summary: true, whyItMatters: true, sourceRef: true },
        },
        mistake: {
          select: { id: true, violatedInvariant: true, category: true, correctiveAction: true },
        },
      },
      orderBy: { nextReviewDate: 'asc' },
    }),

    // Chronological practice history
    prisma.revisionAttempt.findMany({
      where: {
        revisionItem: { userId },
        ...(filterMode ? { mode: filterMode } : {}),
      },
      include: {
        revisionItem: {
          include: {
            dsaProblem: {
              select: { id: true, leetcodeId: true, title: true, slug: true, level: true, difficulty: true },
            },
            concept: { select: { name: true, slug: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 60,
    }),
  ]);

  // Separate Overdue, Due Today, and Upcoming
  const overdueItems = allUserItems.filter((item) => new Date(item.nextReviewDate) < startOfToday);
  const dueTodayItems = allUserItems.filter((item) => {
    const d = new Date(item.nextReviewDate);
    return d >= startOfToday && d <= endOfToday;
  });
  const upcomingItems = allUserItems.filter((item) => new Date(item.nextReviewDate) > endOfToday);

  // Calculate high-level summary telemetry
  const totalTracked = allUserItems.length;
  const totalOverdue = overdueItems.length;
  const totalDueToday = dueTodayItems.length;
  const stage3Mastered = allUserItems.filter((i) => i.currentStage >= 3).length;

  const totalPracticesLogged = historyAttempts.length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="font-mono text-xs">
              MULTI-MODAL REVISION ENGINE
            </Badge>
            <Badge variant="secondary" className="font-mono text-xs">
              Spaced Repetition & Pattern Invariants
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Revision & Retrieval Engine
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Progressive 3-stage cadence: Code in IDE (Stage 1) → Dry-run by Hand (Stage 2) → Mental Pattern Recall (Stage 3+).
          </p>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-2 p-1 bg-muted/30 rounded-xl border border-border">
          <Link
            href={`/revision?tab=queue${filterMode ? `&mode=${filterMode}` : ''}${filterStage !== undefined ? `&stage=${filterStage}` : ''}`}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === 'queue'
                ? 'bg-primary text-primary-foreground shadow'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Review Queue ({totalDueToday + totalOverdue})
          </Link>
          <Link
            href={`/revision?tab=history${filterMode ? `&mode=${filterMode}` : ''}`}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition ${
              activeTab === 'history'
                ? 'bg-primary text-primary-foreground shadow'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Practice Log ({totalPracticesLogged})</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-rose-500/30 bg-rose-500/5 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-rose-400">
            <span>OVERDUE</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400">{totalOverdue}</div>
          <p className="text-[11px] text-muted-foreground">Needs immediate active retrieval</p>
        </Card>

        <Card className="p-4 border-amber-500/30 bg-amber-500/5 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-amber-400">
            <span>DUE TODAY</span>
            <Flame className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">{totalDueToday}</div>
          <p className="text-[11px] text-muted-foreground">Scheduled for today's workout</p>
        </Card>

        <Card className="p-4 border-purple-500/30 bg-purple-500/5 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-purple-400">
            <span>STAGE 3+ MASTERED</span>
            <Brain className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-400">{stage3Mastered}</div>
          <p className="text-[11px] text-muted-foreground">Candidate for fast mental solve</p>
        </Card>

        <Card className="p-4 border-cyan-500/30 bg-cyan-500/5 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
            <span>TOTAL PRACTICES</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">{totalPracticesLogged}</div>
          <p className="text-[11px] text-muted-foreground">Multi-modal revisions completed</p>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3.5 rounded-xl border border-border bg-card/60 flex flex-col md:flex-row md:items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <Filter className="w-3.5 h-3.5 text-primary" />
          <span>Filters:</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Practice Mode Filter */}
          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border text-[11px] font-mono">
            <span className="text-muted-foreground px-1.5">Mode:</span>
            <Link href={`/revision?tab=${activeTab}${filterStage !== undefined ? `&stage=${filterStage}` : ''}`}>
              <Badge variant={!filterMode ? 'default' : 'outline'} className="text-[10px] cursor-pointer">
                All
              </Badge>
            </Link>
            <Link href={`/revision?tab=${activeTab}&mode=CODE${filterStage !== undefined ? `&stage=${filterStage}` : ''}`}>
              <Badge variant={filterMode === 'CODE' ? 'default' : 'outline'} className="text-[10px] cursor-pointer text-cyan-400">
                IDE
              </Badge>
            </Link>
            <Link href={`/revision?tab=${activeTab}&mode=HAND${filterStage !== undefined ? `&stage=${filterStage}` : ''}`}>
              <Badge variant={filterMode === 'HAND' ? 'warning' : 'outline'} className="text-[10px] cursor-pointer text-amber-400">
                By Hand
              </Badge>
            </Link>
            <Link href={`/revision?tab=${activeTab}&mode=MENTAL${filterStage !== undefined ? `&stage=${filterStage}` : ''}`}>
              <Badge variant={filterMode === 'MENTAL' ? 'secondary' : 'outline'} className="text-[10px] cursor-pointer text-purple-400">
                In Mind
              </Badge>
            </Link>
          </div>

          {/* Stage Filter */}
          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border text-[11px] font-mono">
            <span className="text-muted-foreground px-1.5">Stage:</span>
            <Link href={`/revision?tab=${activeTab}${filterMode ? `&mode=${filterMode}` : ''}`}>
              <Badge variant={filterStage === undefined ? 'default' : 'outline'} className="text-[10px] cursor-pointer">
                All
              </Badge>
            </Link>
            <Link href={`/revision?tab=${activeTab}&stage=1${filterMode ? `&mode=${filterMode}` : ''}`}>
              <Badge variant={filterStage === 1 ? 'default' : 'outline'} className="text-[10px] cursor-pointer">
                Stage 1 (1st)
              </Badge>
            </Link>
            <Link href={`/revision?tab=${activeTab}&stage=2${filterMode ? `&mode=${filterMode}` : ''}`}>
              <Badge variant={filterStage === 2 ? 'warning' : 'outline'} className="text-[10px] cursor-pointer">
                Stage 2 (Hand)
              </Badge>
            </Link>
            <Link href={`/revision?tab=${activeTab}&stage=3${filterMode ? `&mode=${filterMode}` : ''}`}>
              <Badge variant={filterStage === 3 ? 'secondary' : 'outline'} className="text-[10px] cursor-pointer">
                Stage 3+ (Mental)
              </Badge>
            </Link>
          </div>

          {(filterMode || filterStage !== undefined || filterLevel) && (
            <Link
              href="/revision"
              className="text-xs text-primary hover:underline font-mono px-2"
            >
              Reset
            </Link>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'queue' ? (
        <div className="space-y-8">
          {/* Overdue Queue */}
          {overdueItems.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold font-mono uppercase text-rose-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Overdue Items ({overdueItems.length})</span>
                </h2>
                <span className="text-xs text-muted-foreground font-mono">
                  Calculated intervals past due
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {overdueItems.map((item) => (
                  <RevisionItemQueueCard key={item.id} item={item} status="OVERDUE" />
                ))}
              </div>
            </div>
          )}

          {/* Due Today Queue */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold font-mono uppercase text-amber-400 flex items-center gap-2">
                <Flame className="w-4 h-4" />
                <span>Due Today ({dueTodayItems.length})</span>
              </h2>
              <span className="text-xs text-muted-foreground font-mono">
                Active retrieval scheduled for today
              </span>
            </div>

            {dueTodayItems.length === 0 && overdueItems.length === 0 ? (
              <Card className="p-12 text-center space-y-3 bg-card/40">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-foreground">Zero Revisions Overdue!</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  You are completely caught up on your spaced retrieval queue. Head to the DSA Arena to explore a new level or practice your dry-run whiteboard workflow.
                </p>
                <Link
                  href="/dsa"
                  className="inline-block px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition shadow"
                >
                  Explore DSA Arena
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {dueTodayItems.map((item) => (
                  <RevisionItemQueueCard key={item.id} item={item} status="DUE_TODAY" />
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Schedule Preview */}
          {upcomingItems.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold uppercase text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Upcoming Scheduled Reviews ({upcomingItems.length})</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {upcomingItems.slice(0, 9).map((item) => (
                  <RevisionItemQueueCard key={item.id} item={item} status="UPCOMING" />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Chronological Practice History Log */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-mono uppercase text-foreground flex items-center gap-2">
              <History className="w-4 h-4 text-primary" />
              <span>Chronological Practice History ({historyAttempts.length})</span>
            </h2>
          </div>

          {historyAttempts.length === 0 ? (
            <Card className="p-12 text-center text-muted-foreground text-xs font-mono bg-card/40">
              No practice attempts logged yet. Solve a problem in the DSA Arena or use the Quick-Log buttons to record practice!
            </Card>
          ) : (
            <Card className="p-0 overflow-hidden border-border bg-card">
              <div className="divide-y divide-border/60">
                {historyAttempts.map((att) => {
                  const prob = att.revisionItem.dsaProblem;
                  const modeBadge = {
                    CODE: { label: 'IDE Solve', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
                    HAND: { label: 'Solved by Hand', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
                    MENTAL: { label: 'Solved in Mind', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
                  }[att.mode] || { label: att.mode, color: 'bg-muted text-foreground' };

                  return (
                    <div
                      key={att.id}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono border font-medium ${modeBadge.color}`}>
                          {modeBadge.label}
                        </span>

                        <div>
                          {prob ? (
                            <Link
                              href={`/dsa/${prob.slug}`}
                              className="font-semibold text-xs text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                            >
                              <span>#{prob.leetcodeId ? String(prob.leetcodeId).padStart(3, '0') : '—'}</span>
                              <span>{prob.title}</span>
                              <span className="text-[10px] font-mono text-muted-foreground">(Level {prob.level})</span>
                            </Link>
                          ) : (
                            <span className="font-semibold text-xs text-foreground">
                              {att.revisionItem.concept?.name || 'Concept Review'}
                            </span>
                          )}

                          {att.notes && (
                            <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                              Note: {att.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-[11px] font-mono text-muted-foreground">
                        {att.struggled && (
                          <span className="text-rose-400 font-semibold px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-[10px]">
                            Struggled
                          </span>
                        )}
                        <span>{Math.round(att.durationSec / 60)}m duration</span>
                        <span>{new Date(att.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

function RevisionItemQueueCard({
  item,
  status,
}: {
  item: any;
  status: 'OVERDUE' | 'DUE_TODAY' | 'UPCOMING';
}) {
  const prob = item.dsaProblem;
  const isProblem = Boolean(prob);

  const modeBadge = {
    CODE: { label: '1st: Code in IDE', icon: <Code2 className="w-3 h-3 text-cyan-400" /> },
    HAND: { label: '2nd: Solve by Hand', icon: <PenTool className="w-3 h-3 text-amber-400" /> },
    MENTAL: { label: '3rd+: In Mind', icon: <Brain className="w-3 h-3 text-purple-400" /> },
  }[item.recommendedMode as PracticeMode] || { label: 'Review', icon: <Repeat className="w-3 h-3" /> };

  const reviewDate = new Date(item.nextReviewDate);
  const now = new Date();
  const diffDays = Math.ceil((reviewDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className={`p-4 flex flex-col justify-between transition-all duration-200 border-border/70 hover:border-primary/50 bg-card/80 hover:bg-card ${
      status === 'OVERDUE' ? 'border-rose-500/30' : status === 'DUE_TODAY' ? 'border-amber-500/30' : ''
    }`}>
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5">
            {isProblem && (
              <span className="text-xs font-mono font-bold text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                L{prob.level}
              </span>
            )}
            <Badge
              variant={
                prob?.difficulty === 'EASY'
                  ? 'success'
                  : prob?.difficulty === 'MEDIUM'
                  ? 'warning'
                  : 'destructive'
              }
              className="text-[10px] font-mono px-1.5 py-0"
            >
              {prob?.difficulty || 'CONCEPT'}
            </Badge>
          </div>

          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
            status === 'OVERDUE'
              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              : status === 'DUE_TODAY'
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              : 'bg-muted/40 text-muted-foreground'
          }`}>
            {status === 'OVERDUE' ? `Overdue by ${Math.abs(diffDays)}d` : status === 'DUE_TODAY' ? 'Due Today' : `In ${diffDays}d`}
          </span>
        </div>

        {/* Title & Topic */}
        <div>
          <Link
            href={isProblem ? `/dsa/${prob.slug}` : `/system-design`}
            className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-1"
          >
            {prob?.title || item.concept?.name}
          </Link>
          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
            Topic: {prob?.topic || item.concept?.summary}
          </p>
        </div>

        {/* Telemetry Breakdown */}
        <div className="p-2 rounded-lg bg-muted/30 border border-border/40 text-[11px] space-y-1.5 font-mono">
          <div className="flex justify-between items-center text-muted-foreground">
            <span>Stage {item.currentStage}</span>
            <div className="flex items-center gap-1 text-[10px]">
              <span className="text-cyan-400">IDE: {item.codePracticeCount}</span>
              <span>•</span>
              <span className="text-amber-400">Hand: {item.handPracticeCount}</span>
              <span>•</span>
              <span className="text-purple-400">Mind: {item.mentalPracticeCount}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-border/30">
            <span className="text-[10px] text-muted-foreground">Recommended:</span>
            <span className="text-[10px] text-foreground font-semibold flex items-center gap-1">
              {modeBadge.icon}
              {modeBadge.label}
            </span>
          </div>
        </div>
      </div>

      {/* Card Action Link */}
      <div className="pt-3 mt-3 border-t border-border flex items-center justify-between text-xs">
        <Link
          href={isProblem ? `/levels/${prob.level}` : '/system-design'}
          className="text-[11px] font-mono text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <Layers className="w-3 h-3" />
          <span>Level {prob?.level || 'SD'}</span>
        </Link>

        <Link
          href={isProblem ? `/dsa/${prob.slug}` : '/system-design'}
          className="font-semibold text-xs text-primary hover:text-primary/80 flex items-center gap-1"
        >
          Solve Problem <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </Card>
  );
}
