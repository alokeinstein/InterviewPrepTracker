'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, Circle, Clock, Calendar, Trophy } from 'lucide-react';
import { ProblemSolveStatus } from '@/lib/storage/indexedDb';

interface ProblemSolvedBadgeProps {
  status: ProblemSolveStatus | null;
  serverSolved?: boolean;
  serverLastSolvedAt?: Date | string | null;
  serverSolveDurationSec?: number | null;
}

export function ProblemSolvedBadge({
  status,
  serverSolved = false,
  serverLastSolvedAt = null,
  serverSolveDurationSec = null,
}: ProblemSolvedBadgeProps) {
  const isSolved = status?.isSolved || serverSolved;
  const lastSolvedAt = status?.lastSolvedAt
    ? new Date(status.lastSolvedAt)
    : serverLastSolvedAt
    ? new Date(serverLastSolvedAt)
    : null;
  const durationSec = status?.lastDurationSec || serverSolveDurationSec;
  const bestDurationSec = status?.bestDurationSec;

  const formatDuration = (totalSec?: number | null) => {
    if (!totalSec || totalSec <= 0) return null;
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  const formatRelativeTime = (date: Date) => {
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (isSolved) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <Badge
          variant="success"
          className="gap-1.5 px-2.5 py-1 text-xs font-semibold bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          <span>Solved</span>
        </Badge>

        {lastSolvedAt && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-2.5 py-1 rounded-md border border-border/40">
            <Calendar className="h-3 w-3 text-primary/70" />
            <span>
              Last solved <strong className="text-foreground/90 font-medium">{formatRelativeTime(lastSolvedAt)}</strong>
            </span>
            {durationSec && (
              <>
                <span className="text-border mx-0.5">•</span>
                <Clock className="h-3 w-3 text-amber-400/80" />
                <span className="font-mono text-emerald-400 font-medium">
                  {formatDuration(durationSec)}
                </span>
              </>
            )}
            {bestDurationSec && bestDurationSec < (durationSec || Infinity) && (
              <>
                <span className="text-border mx-0.5">•</span>
                <Trophy className="h-3 w-3 text-amber-500" />
                <span className="text-[11px] font-mono text-muted-foreground" title="Best recorded solve time">
                  Best: {formatDuration(bestDurationSec)}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="outline"
        className="gap-1.5 px-2.5 py-1 text-xs text-muted-foreground border-border/80"
      >
        <Circle className="h-3 w-3 text-muted-foreground/60" />
        <span>Unsolved</span>
      </Badge>
    </div>
  );
}
