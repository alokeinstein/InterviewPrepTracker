'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Layers, Hash, ArrowLeftRight, Maximize2, Binary, Link as LinkIcon, 
  Boxes, Calendar, Flame, GitCommit, GitBranch, Compass, Grid, 
  Network, Share2, TrendingUp, Zap, FileText, Cpu, MapPin, 
  CheckCircle, Search, Settings, Trophy, ArrowRight, CheckCircle2,
  Clock, Sparkles, Filter, X
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export interface LevelInfo {
  levelNumber: number;
  title: string;
  topic: string;
  description?: string;
  concepts?: string[];
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
  1: <Layers className="w-5 h-5 text-indigo-400" />,
  2: <Hash className="w-5 h-5 text-emerald-400" />,
  3: <ArrowLeftRight className="w-5 h-5 text-cyan-400" />,
  4: <Maximize2 className="w-5 h-5 text-amber-400" />,
  5: <Binary className="w-5 h-5 text-purple-400" />,
  6: <LinkIcon className="w-5 h-5 text-blue-400" />,
  7: <Boxes className="w-5 h-5 text-rose-400" />,
  8: <Calendar className="w-5 h-5 text-orange-400" />,
  9: <Flame className="w-5 h-5 text-red-400" />,
  10: <GitCommit className="w-5 h-5 text-emerald-400" />,
  11: <GitBranch className="w-5 h-5 text-teal-400" />,
  12: <Compass className="w-5 h-5 text-fuchsia-400" />,
  13: <Grid className="w-5 h-5 text-sky-400" />,
  14: <Network className="w-5 h-5 text-violet-400" />,
  15: <Share2 className="w-5 h-5 text-lime-400" />,
  16: <TrendingUp className="w-5 h-5 text-yellow-400" />,
  17: <Zap className="w-5 h-5 text-amber-400" />,
  18: <FileText className="w-5 h-5 text-blue-400" />,
  19: <Cpu className="w-5 h-5 text-pink-400" />,
  20: <MapPin className="w-5 h-5 text-indigo-400" />,
  21: <CheckCircle className="w-5 h-5 text-green-400" />,
  22: <Search className="w-5 h-5 text-cyan-400" />,
  23: <Settings className="w-5 h-5 text-slate-400" />,
};

export const LevelCardGrid: React.FC<LevelCardGridProps> = ({
  levels,
  selectedLevel,
  totalSolved,
  totalProblems,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'IN_PROGRESS' | 'COMPLETED' | 'UNSTARTED'>('ALL');

  const overallPercentage = totalProblems > 0 
    ? Math.round((totalSolved / totalProblems) * 100) 
    : 0;

  // Filter levels based on search and status
  const filteredLevels = useMemo(() => {
    return levels.filter((lvl) => {
      // Status filter
      const isCompleted = lvl.totalProblems > 0 && lvl.solvedCount === lvl.totalProblems;
      const isInProgress = lvl.solvedCount > 0 && lvl.solvedCount < lvl.totalProblems;
      const isUnstarted = lvl.solvedCount === 0;

      if (statusFilter === 'COMPLETED' && !isCompleted) return false;
      if (statusFilter === 'IN_PROGRESS' && !isInProgress) return false;
      if (statusFilter === 'UNSTARTED' && !isUnstarted) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = lvl.title.toLowerCase().includes(q);
        const matchesTopic = lvl.topic.toLowerCase().includes(q);
        const matchesDesc = lvl.description?.toLowerCase().includes(q) ?? false;
        const matchesNum = `level ${lvl.levelNumber}`.includes(q) || `l${lvl.levelNumber}`.includes(q);
        const matchesConcepts = lvl.concepts?.some((c) => c.toLowerCase().includes(q)) ?? false;
        return matchesTitle || matchesTopic || matchesDesc || matchesNum || matchesConcepts;
      }

      return true;
    });
  }, [levels, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Overall Progress & Quick Level Search Controls */}
      <div className="p-5 rounded-2xl bg-card/80 border border-border/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground">Curriculum Mastery Track</h3>
              <Badge variant="outline" className="font-mono text-[10px]">
                23 Sequential Levels
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {totalSolved} of {totalProblems} problems solved across enterprise patterns
            </p>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="flex items-center gap-4 min-w-[260px]">
          <div className="w-full space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-muted-foreground">Mastery Progress</span>
              <span className="text-primary font-bold">{overallPercentage}%</span>
            </div>
            <div className="w-full bg-muted/60 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-primary to-indigo-500 h-full transition-all duration-700 rounded-full"
                style={{ width: `${overallPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Level Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search levels (e.g. Two Pointers, Dynamic Programming, Graph...)"
            className="w-full pl-10 pr-9 py-2 text-xs bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Badges */}
        <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-xl border border-border self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${
              statusFilter === 'ALL'
                ? 'bg-background text-foreground shadow-sm font-semibold border border-border/60'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All (23)
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('IN_PROGRESS')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${
              statusFilter === 'IN_PROGRESS'
                ? 'bg-background text-foreground shadow-sm font-semibold border border-border/60 text-cyan-400'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            In Progress
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('COMPLETED')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${
              statusFilter === 'COMPLETED'
                ? 'bg-background text-foreground shadow-sm font-semibold border border-border/60 text-emerald-400'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Completed
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('UNSTARTED')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${
              statusFilter === 'UNSTARTED'
                ? 'bg-background text-foreground shadow-sm font-semibold border border-border/60'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Not Started
          </button>
        </div>
      </div>

      {/* 23 Enlarged & Clean Level Cards Grid */}
      {filteredLevels.length === 0 ? (
        <Card className="p-12 text-center space-y-3 bg-card/40">
          <Layers className="w-10 h-10 text-muted-foreground mx-auto" />
          <h3 className="text-base font-bold text-foreground">No levels match your search</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search query or reset the filter to view all 23 curriculum levels.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('ALL');
            }}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition shadow"
          >
            Reset Search
          </button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLevels.map((lvl) => {
            const isSelected = selectedLevel === lvl.levelNumber;
            const pct = lvl.totalProblems > 0 
              ? Math.round((lvl.solvedCount / lvl.totalProblems) * 100) 
              : 0;
            const isCompleted = pct === 100 && lvl.totalProblems > 0;
            const isInProgress = lvl.solvedCount > 0 && !isCompleted;

            return (
              <Link
                key={lvl.levelNumber}
                href={`/levels/${lvl.levelNumber}`}
                className="group block focus:outline-none"
              >
                <Card
                  className={`h-full p-6 flex flex-col justify-between transition-all duration-300 rounded-2xl border ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10 ring-2 ring-primary'
                      : isCompleted
                      ? 'border-emerald-500/30 bg-card/90 hover:border-emerald-500/60 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1'
                      : 'border-border/80 bg-card/75 hover:bg-card hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top Row: Icon, Level Badge, and Status Pill */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-muted/60 border border-border/80 flex items-center justify-center group-hover:scale-105 group-hover:border-primary/40 transition-transform">
                          {LEVEL_ICONS[lvl.levelNumber] || <Layers className="w-5 h-5 text-muted-foreground" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-foreground">
                              LEVEL {String(lvl.levelNumber).padStart(2, '0')}
                            </span>
                            <Badge variant="secondary" className="text-[10px] font-mono px-2 py-0">
                              {lvl.totalProblems} Qs
                            </Badge>
                          </div>
                          <span className="text-[11px] font-medium text-muted-foreground block line-clamp-1">
                            {lvl.topic}
                          </span>
                        </div>
                      </div>

                      {/* Status Indicator Badge */}
                      {isCompleted ? (
                        <Badge variant="success" className="text-[10px] font-mono font-semibold px-2 py-0.5 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Mastered
                        </Badge>
                      ) : isInProgress ? (
                        <Badge variant="outline" className="text-[10px] font-mono text-cyan-400 border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5">
                          {pct}% Done
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground px-2 py-0.5">
                          Unstarted
                        </Badge>
                      )}
                    </div>

                    {/* Level Title */}
                    <div>
                      <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        {lvl.title.replace(/^Level \d+ — /, '')}
                      </h4>
                      {lvl.description && (
                        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                          {lvl.description}
                        </p>
                      )}
                    </div>

                    {/* Concepts Pills */}
                    {lvl.concepts && lvl.concepts.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {lvl.concepts.slice(0, 3).map((concept) => (
                          <span
                            key={concept}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted/50 border border-border/60 text-muted-foreground"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Progress Section & Enter CTA */}
                  <div className="mt-5 pt-4 border-t border-border/60 space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-muted-foreground text-[11px]">
                          {lvl.solvedCount} of {lvl.totalProblems} Solved
                        </span>
                        <span className={isCompleted ? 'text-emerald-400 font-bold' : 'text-primary font-bold'}>
                          {pct}%
                        </span>
                      </div>
                      <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted ? 'bg-emerald-500' : 'bg-primary'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Link Footer */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {lvl.totalProblems - lvl.solvedCount} remaining
                      </span>
                      <span className="text-primary font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
                        Open Level <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
