'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Layers, Hash, ArrowLeftRight, Maximize2, Binary, Link as LinkIcon, 
  Boxes, Calendar, Flame, GitCommit, GitBranch, Compass, Grid, 
  Network, Share2, TrendingUp, Zap, FileText, Cpu, MapPin, 
  CheckCircle, Search, Settings, Trophy, Filter, X
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export interface LevelInfo {
  levelNumber: number;
  title: string;
  topic: string;
  totalProblems: number;
  solvedCount: number;
}

interface LevelCardGridProps {
  levels: LevelInfo[];
  selectedLevel?: number;
  totalSolved: number;
  totalProblems: number;
}

const LEVEL_ICONS: Record<number, React.ReactNode> = {
  1: <Layers className="w-4 h-4 text-indigo-400" />,
  2: <Hash className="w-4 h-4 text-emerald-400" />,
  3: <ArrowLeftRight className="w-4 h-4 text-cyan-400" />,
  4: <Maximize2 className="w-4 h-4 text-amber-400" />,
  5: <Binary className="w-4 h-4 text-purple-400" />,
  6: <LinkIcon className="w-4 h-4 text-blue-400" />,
  7: <Boxes className="w-4 h-4 text-rose-400" />,
  8: <Calendar className="w-4 h-4 text-orange-400" />,
  9: <Flame className="w-4 h-4 text-red-400" />,
  10: <GitCommit className="w-4 h-4 text-emerald-400" />,
  11: <GitBranch className="w-4 h-4 text-teal-400" />,
  12: <Compass className="w-4 h-4 text-fuchsia-400" />,
  13: <Grid className="w-4 h-4 text-sky-400" />,
  14: <Network className="w-4 h-4 text-violet-400" />,
  15: <Share2 className="w-4 h-4 text-lime-400" />,
  16: <TrendingUp className="w-4 h-4 text-yellow-400" />,
  17: <Zap className="w-4 h-4 text-amber-400" />,
  18: <FileText className="w-4 h-4 text-blue-400" />,
  19: <Cpu className="w-4 h-4 text-pink-400" />,
  20: <MapPin className="w-4 h-4 text-indigo-400" />,
  21: <CheckCircle className="w-4 h-4 text-green-400" />,
  22: <Search className="w-4 h-4 text-cyan-400" />,
  23: <Settings className="w-4 h-4 text-slate-400" />,
};

export const LevelCardGrid: React.FC<LevelCardGridProps> = ({
  levels,
  selectedLevel,
  totalSolved,
  totalProblems,
}) => {
  const overallPercentage = totalProblems > 0 
    ? Math.round((totalSolved / totalProblems) * 100) 
    : 0;

  return (
    <div className="space-y-4">
      {/* Overall Progress & Quick Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Curriculum Progress</h3>
            <p className="text-xs text-muted-foreground">
              {totalSolved} of {totalProblems} questions mastered across 23 levels
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-lg font-bold font-mono text-primary">{overallPercentage}%</span>
            <span className="text-xs text-muted-foreground block">Completed</span>
          </div>
          <div className="w-28 sm:w-36 bg-muted h-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-500 rounded-full"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
          {selectedLevel && (
            <Link 
              href="/dsa"
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filter</span>
            </Link>
          )}
        </div>
      </div>

      {/* 23 Level Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {levels.map((lvl) => {
          const isSelected = selectedLevel === lvl.levelNumber;
          const pct = lvl.totalProblems > 0 
            ? Math.round((lvl.solvedCount / lvl.totalProblems) * 100) 
            : 0;

          return (
            <Link
              key={lvl.levelNumber}
              href={`/levels/${lvl.levelNumber}`}
              className="group block focus:outline-none"
            >
              <Card className={`h-full p-3.5 flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                isSelected 
                  ? 'border-primary bg-primary/10 shadow-md shadow-primary/5 ring-1 ring-primary' 
                  : 'hover:border-primary/50 hover:bg-card/90 hover:shadow-sm'
              }`}>
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <div className="flex items-center gap-1.5">
                      {LEVEL_ICONS[lvl.levelNumber] || <Layers className="w-4 h-4 text-muted-foreground" />}
                      <span className="text-xs font-mono font-bold text-foreground">
                        L{lvl.levelNumber}
                      </span>
                    </div>
                    <Badge variant={isSelected ? 'default' : 'secondary'} className="text-[10px] font-mono px-1.5 py-0">
                      {lvl.totalProblems} Qs
                    </Badge>
                  </div>

                  <h4 className="text-xs font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {lvl.title.replace(/^Level \d+ — /, '')}
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                    {lvl.topic}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-border/60 space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-muted-foreground">
                      {lvl.solvedCount}/{lvl.totalProblems} Solved
                    </span>
                    <span className={pct === 100 ? 'text-emerald-500 font-bold' : 'text-primary font-medium'}>
                      {pct}%
                    </span>
                  </div>
                  <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        pct === 100 ? 'bg-emerald-500' : 'bg-primary'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
