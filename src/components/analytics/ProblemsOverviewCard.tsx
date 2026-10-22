'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Code2, Award, Flame, CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';

interface ProblemsOverviewCardProps {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  codingScore: number;
  streak: number;
  masteredCount: number;
}

export function ProblemsOverviewCard({
  totalSolved = 0,
  easySolved = 0,
  mediumSolved = 0,
  hardSolved = 0,
  codingScore = 0,
  streak = 4,
  masteredCount = 0,
}: ProblemsOverviewCardProps) {
  // SVG Donut calculations
  const size = 160;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const total = Math.max(totalSolved, 1);
  const easyRatio = easySolved / total;
  const mediumRatio = mediumSolved / total;
  const hardRatio = hardSolved / total;

  const easyStroke = easyRatio * circumference;
  const mediumStroke = mediumRatio * circumference;
  const hardStroke = hardRatio * circumference;

  const easyOffset = 0;
  const mediumOffset = -easyStroke;
  const hardOffset = -(easyStroke + mediumStroke);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Problems Overview Donut Card (matching reference image) */}
      <Card className="p-6 bg-card/60 border border-border/80 backdrop-blur-md flex flex-col justify-between">
        <h3 className="font-bold text-sm tracking-tight text-foreground uppercase mb-4">
          Problems Overview
        </h3>

        <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
          {/* Donut Chart */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#1f2937"
                strokeWidth={strokeWidth}
              />
              {/* Easy slice (Emerald) */}
              {easySolved > 0 && (
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${easyStroke} ${circumference}`}
                  strokeDashoffset={easyOffset}
                  className="transition-all duration-700"
                />
              )}
              {/* Medium slice (Amber) */}
              {mediumSolved > 0 && (
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${mediumStroke} ${circumference}`}
                  strokeDashoffset={mediumOffset}
                  className="transition-all duration-700"
                />
              )}
              {/* Hard slice (Rose) */}
              {hardSolved > 0 && (
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${hardStroke} ${circumference}`}
                  strokeDashoffset={hardOffset}
                  className="transition-all duration-700"
                />
              )}
            </svg>

            {/* Center Text */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold font-mono text-foreground tracking-tight leading-none">
                {totalSolved}
              </span>
              <span className="text-[11px] text-muted-foreground font-medium mt-1">
                Problems Solved
              </span>
            </div>
          </div>

          {/* Breakdown Legend List */}
          <div className="space-y-2 text-xs font-medium w-full sm:w-auto">
            <div className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-2 text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
                Easy
              </span>
              <span className="font-mono font-bold text-foreground">({easySolved})</span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-2 text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" />
                Medium
              </span>
              <span className="font-mono font-bold text-foreground">({mediumSolved})</span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-2 text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-sm bg-rose-500" />
                Hard
              </span>
              <span className="font-mono font-bold text-foreground">({hardSolved})</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Right Stats Cards (matching reference image) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Coding Score */}
        <div className="p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Coding Score</p>
              <p className="text-xl font-black font-mono text-foreground mt-0.5">{codingScore}</p>
            </div>
          </div>
        </div>

        {/* Problems Solved */}
        <div className="p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Problems Solved</p>
              <p className="text-xl font-black font-mono text-foreground mt-0.5">{totalSolved}</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Mastered Questions */}
        <div className="p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">5-Review Mastered</p>
              <p className="text-xl font-black font-mono text-purple-400 mt-0.5">{masteredCount}</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Current Active Streak */}
        <div className="p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Flame className="h-5 w-5 fill-current" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Current Streak</p>
              <p className="text-xl font-black font-mono text-amber-500 mt-0.5">{streak} Days</p>
            </div>
          </div>
          <Badge variant="success" className="text-[10px] font-mono">
            Active
          </Badge>
        </div>
      </div>
    </div>
  );
}
