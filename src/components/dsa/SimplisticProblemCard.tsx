'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, Clock, ArrowRight } from 'lucide-react';

export interface SimplisticProblemCardProps {
  problem: {
    id: string;
    leetcodeId: number | null;
    title: string;
    slug: string;
    level: number;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    topic: string;
    patternName?: string;
    estimatedTimeMin: number;
  };
  isSolved: boolean;
  optimalityScore?: number | null;
}

export const SimplisticProblemCard: React.FC<SimplisticProblemCardProps> = ({
  problem,
  isSolved,
  optimalityScore,
}) => {
  return (
    <Link
      href={`/dsa/${problem.slug}`}
      className="group block focus:outline-none h-full"
    >
      <Card
        className={`h-full p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 bg-card/75 border border-border/80 hover:bg-card hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 rounded-xl ${
          isSolved ? 'border-emerald-500/40 bg-emerald-500/5' : ''
        }`}
      >
        <div>
          {/* Top Row: #LeetCodeID, Level Badge, and Difficulty Badge */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-muted-foreground">
                #{problem.leetcodeId ?? '—'}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted/80 text-muted-foreground">
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
              className="text-[10px] font-mono font-semibold px-2 py-0.5"
            >
              {problem.difficulty}
            </Badge>
          </div>

          {/* Problem Title */}
          <h3 className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {problem.title}
          </h3>

          {/* Pattern Subtitle */}
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
            Pattern: {problem.patternName || problem.topic}
          </p>
        </div>

        {/* Footer: Solve Status / Est Time & Practice CTA */}
        <div className="pt-3.5 mt-3.5 border-t border-border/70 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            {isSolved ? (
              <span className="text-emerald-500 font-semibold flex items-center gap-1.5 text-[11px] sm:text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Solved</span>
                {optimalityScore === 100 && (
                  <span className="text-[10px] px-1 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                    100% Opt
                  </span>
                )}
              </span>
            ) : (
              <span className="text-muted-foreground flex items-center gap-1.5 text-[11px] sm:text-xs">
                <Clock className="w-3.5 h-3.5" />
                <span>~{problem.estimatedTimeMin}m</span>
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
};
