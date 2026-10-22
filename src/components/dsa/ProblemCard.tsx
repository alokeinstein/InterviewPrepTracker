'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Code2, 
  PenTool, 
  Brain, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Flame, 
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Zap,
  Check,
  Award
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export interface ProblemTelemetry {
  totalPracticed: number;
  codeCount: number;
  handCount: number;
  mentalCount: number;
  lastPracticedAt: string | null;
  nextReviewDate: string | null;
  isDue: boolean;
  isOverdue: boolean;
  dueStatusText: string;
  currentStage: number;
  recommendedMode: 'CODE' | 'HAND' | 'MENTAL';
}

export interface ProblemCardProps {
  problem: {
    id: string;
    leetcodeId: number | null;
    title: string;
    slug: string;
    level: number;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    topic: string;
    subtopic?: string | null;
    patternName?: string;
    estimatedTimeMin: number;
    optimalTimeComplexity?: string | null;
    optimalSpaceComplexity?: string | null;
  };
  isSolved: boolean;
  optimalityScore?: number | null;
  initialTelemetry?: ProblemTelemetry | null;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  isSolved,
  optimalityScore,
  initialTelemetry,
}) => {
  const [telemetry, setTelemetry] = useState<ProblemTelemetry>(
    initialTelemetry || {
      totalPracticed: isSolved ? 1 : 0,
      codeCount: isSolved ? 1 : 0,
      handCount: 0,
      mentalCount: 0,
      lastPracticedAt: null,
      nextReviewDate: null,
      isDue: false,
      isOverdue: false,
      dueStatusText: 'Unscheduled',
      currentStage: isSolved ? 1 : 0,
      recommendedMode: isSolved ? 'HAND' : 'CODE',
    }
  );

  const [isLogging, setIsLogging] = useState(false);
  const [struggled, setStruggled] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const formatRelativeTime = (isoDate: string | null) => {
    if (!isoDate) return 'Never practiced';
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    if (diffDays === 0) return `Today — ${formattedDate}`;
    if (diffDays === 1) return `1 day ago — ${formattedDate}`;
    return `${diffDays} days ago — ${formattedDate}`;
  };

  const getRecommendedBadge = (mode: 'CODE' | 'HAND' | 'MENTAL', stage: number) => {
    if (stage === 0) {
      return {
        label: '1st Time: Code in IDE',
        variant: 'default' as const,
        icon: <Code2 className="w-3 h-3 text-cyan-400" />,
        color: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
      };
    }
    if (mode === 'HAND') {
      return {
        label: `${stage === 1 ? '2nd Time: ' : ''}Solve by Hand`,
        variant: 'warning' as const,
        icon: <PenTool className="w-3 h-3 text-amber-400" />,
        color: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
      };
    }
    return {
      label: '3rd+ Time: Mental Review',
      variant: 'secondary' as const,
      icon: <Brain className="w-3 h-3 text-purple-400" />,
      color: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
    };
  };

  const handleQuickLog = async (mode: 'CODE' | 'HAND' | 'MENTAL') => {
    setIsLogging(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch('/api/revision/log-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: problem.id,
          mode,
          struggled,
          durationSec: mode === 'CODE' ? 300 : mode === 'HAND' ? 180 : 60,
          qualityScore: struggled ? 2 : 4,
          optimalityScore: optimalityScore || 100,
        }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        const rev = data.result.revisionItem;
        const cad = data.result.cadence;
        const total = (rev.codePracticeCount || 0) + (rev.handPracticeCount || 0) + (rev.mentalPracticeCount || 0);

        setTelemetry({
          totalPracticed: total,
          codeCount: rev.codePracticeCount,
          handCount: rev.handPracticeCount,
          mentalCount: rev.mentalPracticeCount,
          lastPracticedAt: new Date().toISOString(),
          nextReviewDate: rev.nextReviewDate ? new Date(rev.nextReviewDate).toISOString() : null,
          isDue: false,
          isOverdue: false,
          dueStatusText: `Next: in ${cad.intervalDays}d`,
          currentStage: rev.currentStage,
          recommendedMode: rev.recommendedMode,
        });

        const modeLabels = { CODE: 'IDE', HAND: 'By Hand', MENTAL: 'In Mind' };
        setFeedbackMsg(`Logged ${modeLabels[mode]} (+${cad.intervalDays}d next review)`);
        setStruggled(false);

        setTimeout(() => setFeedbackMsg(null), 4000);
      }
    } catch (err) {
      console.error('Failed to quick log revision:', err);
    } finally {
      setIsLogging(false);
    }
  };

  const recBadge = getRecommendedBadge(telemetry.recommendedMode, telemetry.currentStage);

  return (
    <Card className={`h-full flex flex-col justify-between transition-all duration-200 border-border/80 bg-card/80 hover:bg-card hover:border-primary/50 hover:shadow-lg ${
      isSolved ? 'border-emerald-500/30' : ''
    }`}>
      <div className="p-4 space-y-3.5">
        {/* Header: ID, Title, Difficulty, Optimality */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-mono font-bold text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                #{problem.leetcodeId ? String(problem.leetcodeId).padStart(3, '0') : '—'}
              </span>
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

              {/* Optimality Score Badge */}
              {isSolved && (
                <Badge
                  variant={optimalityScore && optimalityScore >= 90 ? 'outline' : 'warning'}
                  className={`text-[10px] font-mono px-2 py-0.5 flex items-center gap-1 ${
                    optimalityScore && optimalityScore >= 90
                      ? 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10'
                      : 'border-amber-500/40 text-amber-400 bg-amber-500/10'
                  }`}
                >
                  <Zap className="w-2.5 h-2.5" />
                  {optimalityScore ? `${Math.round(optimalityScore)}% Optimal` : '100% Optimal'}
                </Badge>
              )}
            </div>

            {/* Next Scheduled Due Status */}
            {telemetry.isOverdue ? (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {telemetry.dueStatusText}
              </span>
            ) : telemetry.isDue ? (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <Flame className="w-3 h-3" /> Due Today
              </span>
            ) : (
              <span className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.5 rounded bg-muted/40">
                {telemetry.dueStatusText}
              </span>
            )}
          </div>

          <Link href={`/dsa/${problem.slug}`} className="group block focus:outline-none">
            <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {problem.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
            <span>Pattern: {problem.patternName || problem.topic}</span>
            {problem.optimalTimeComplexity && (
              <>
                <span>•</span>
                <span className="font-mono text-primary/80">{problem.optimalTimeComplexity}</span>
              </>
            )}
          </div>
        </div>

        {/* Practice & Revision Telemetry Section */}
        <div className="p-2.5 rounded-lg bg-muted/30 border border-border/60 space-y-2 text-xs">
          {/* Practice Count & Mode Breakdown */}
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <RotateCcw className="w-3.5 h-3.5 text-primary" />
              <span>Practiced: <strong className="font-mono text-primary">{telemetry.totalPracticed}</strong> {telemetry.totalPracticed === 1 ? 'time' : 'times'}</span>
            </div>

            <div className="flex items-center gap-1 font-mono text-[10px]">
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" title="Code IDE Solves">
                IDE: {telemetry.codeCount}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20" title="Solved by Hand">
                Hand: {telemetry.handCount}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20" title="Solved in Mind">
                Mind: {telemetry.mentalCount}
              </span>
            </div>
          </div>

          {/* Last Practiced Timestamp */}
          <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-muted-foreground" /> Last practiced:
            </span>
            <span className="text-foreground/90 font-medium">
              {formatRelativeTime(telemetry.lastPracticedAt)}
            </span>
          </div>

          {/* Recommended Mode Badge */}
          <div className="pt-1.5 border-t border-border/40 flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground uppercase font-mono">Recommended Next:</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border flex items-center gap-1 font-medium ${recBadge.color}`}>
              {recBadge.icon}
              {recBadge.label}
            </span>
          </div>
        </div>

        {/* Feedback Message */}
        {feedbackMsg && (
          <div className="px-2.5 py-1 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono flex items-center gap-1.5 animate-fadeIn">
            <Check className="w-3.5 h-3.5" />
            <span>{feedbackMsg}</span>
          </div>
        )}
      </div>

      {/* Card Footer: Quick-Log Actions & Solve Link */}
      <div className="p-3 bg-muted/20 border-t border-border flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-muted-foreground font-semibold uppercase">
            Quick-Log Revision:
          </span>

          <label className="flex items-center gap-1 text-[10px] text-muted-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={struggled}
              onChange={(e) => setStruggled(e.target.checked)}
              className="w-3 h-3 rounded border-border text-primary focus:ring-0 cursor-pointer"
            />
            <span className={struggled ? 'text-rose-400 font-semibold' : ''}>Struggled?</span>
          </label>
        </div>

        {/* 3 Mode Buttons */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            disabled={isLogging}
            onClick={() => handleQuickLog('CODE')}
            className="px-2 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[11px] font-medium flex items-center justify-center gap-1 transition disabled:opacity-50"
            title="Log Full Code Solve in IDE"
          >
            <Code2 className="w-3 h-3" />
            <span>IDE</span>
          </button>

          <button
            type="button"
            disabled={isLogging}
            onClick={() => handleQuickLog('HAND')}
            className="px-2 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[11px] font-medium flex items-center justify-center gap-1 transition disabled:opacity-50"
            title="Log Solved by Hand (Dry Run / Paper)"
          >
            <PenTool className="w-3 h-3" />
            <span>By Hand</span>
          </button>

          <button
            type="button"
            disabled={isLogging}
            onClick={() => handleQuickLog('MENTAL')}
            className="px-2 py-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-[11px] font-medium flex items-center justify-center gap-1 transition disabled:opacity-50"
            title="Log Mental Solve (Look & Recall In Mind)"
          >
            <Brain className="w-3 h-3" />
            <span>In Mind</span>
          </button>
        </div>

        {/* Solve Link */}
        <div className="pt-1 flex items-center justify-between text-xs">
          <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
            <Clock className="w-3 h-3" /> ~{problem.estimatedTimeMin}m
          </span>
          <Link
            href={`/dsa/${problem.slug}`}
            className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
          >
            Solve Problem <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </Card>
  );
};
