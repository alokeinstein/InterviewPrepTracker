'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutGrid, SlidersHorizontal, BookOpen, Layers, Check } from 'lucide-react';
import { SimplisticProblemCard } from './SimplisticProblemCard';
import { ProblemCard, ProblemTelemetry } from './ProblemCard';
import { Card } from '@/components/ui/Card';

export type ViewMode = 'simplistic' | 'detailed';

export interface LevelProblemItem {
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
  isSolved: boolean;
  optimalityScore: number | null;
  telemetry: ProblemTelemetry;
}

interface LevelProblemGridProps {
  levelNum: number;
  problems: LevelProblemItem[];
  totalInLevel: number;
  defaultViewMode?: ViewMode;
}

const STORAGE_KEY = 'dsa_level_card_view_mode';

export const LevelProblemGrid: React.FC<LevelProblemGridProps> = ({
  levelNum,
  problems,
  totalInLevel,
  defaultViewMode = 'simplistic',
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultViewMode);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'simplistic' || saved === 'detailed') {
        setViewMode(saved);
      }
    } catch {
      // ignore storage access errors in private mode
    }
  }, []);

  const handleModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-4">
      {/* View Mode Switcher & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-card/60 border border-border/80 text-xs">
        <div className="flex items-center gap-2 font-mono text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{problems.length}</strong> of{' '}
            <strong className="text-foreground">{totalInLevel}</strong> problems in Level {levelNum}
          </span>
        </div>

        {/* View Mode Toggle Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] font-mono text-muted-foreground hidden md:inline">
            Card Layout:
          </span>

          <div className="inline-flex items-center p-1 rounded-lg bg-muted/60 border border-border">
            <button
              type="button"
              onClick={() => handleModeChange('simplistic')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'simplistic'
                  ? 'bg-background text-foreground shadow-sm font-semibold border border-border/60'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
              }`}
              title="Clean, uncluttered problem cards"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-primary" />
              <span>Simplistic</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange('detailed')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'detailed'
                  ? 'bg-background text-foreground shadow-sm font-semibold border border-border/60'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
              }`}
              title="Detailed view with revision telemetry & quick-log buttons"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Detailed Telemetry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {problems.length === 0 ? (
        <Card className="p-12 text-center space-y-3 bg-card/40">
          <BookOpen className="w-10 h-10 text-muted-foreground mx-auto" />
          <h3 className="text-base font-bold text-foreground">No questions match your filter</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search query or reset the difficulty filters to see all Level {levelNum} problems.
          </p>
          <Link
            href={`/levels/${levelNum}`}
            className="inline-block px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition shadow"
          >
            Reset Filters
          </Link>
        </Card>
      ) : viewMode === 'simplistic' ? (
        /* Simplistic Card Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {problems.map((prob) => (
            <SimplisticProblemCard
              key={prob.id}
              problem={{
                id: prob.id,
                leetcodeId: prob.leetcodeId,
                title: prob.title,
                slug: prob.slug,
                level: prob.level,
                difficulty: prob.difficulty,
                topic: prob.topic,
                patternName: prob.patternName,
                estimatedTimeMin: prob.estimatedTimeMin,
              }}
              isSolved={prob.isSolved}
              optimalityScore={prob.optimalityScore}
            />
          ))}
        </div>
      ) : (
        /* Detailed Card Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {problems.map((prob) => (
            <ProblemCard
              key={prob.id}
              problem={{
                id: prob.id,
                leetcodeId: prob.leetcodeId,
                title: prob.title,
                slug: prob.slug,
                level: prob.level,
                difficulty: prob.difficulty,
                topic: prob.topic,
                subtopic: prob.subtopic,
                patternName: prob.patternName,
                estimatedTimeMin: prob.estimatedTimeMin,
                optimalTimeComplexity: prob.optimalTimeComplexity,
                optimalSpaceComplexity: prob.optimalSpaceComplexity,
              }}
              isSolved={prob.isSolved}
              optimalityScore={prob.optimalityScore}
              initialTelemetry={prob.telemetry}
            />
          ))}
        </div>
      )}
    </div>
  );
};
