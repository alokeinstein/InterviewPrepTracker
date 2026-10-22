'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Code2,
  PenTool,
  Brain,
  CheckCircle2,
  Clock,
  Repeat,
  ArrowUpRight,
  Filter,
  Search,
} from 'lucide-react';
import { ActivityEvent } from '@/lib/storage/indexedDb';

interface ActivityItem {
  id: string;
  problemId: string;
  problemTitle: string;
  slug?: string;
  level: number;
  difficulty: string;
  eventType: string; // 'SOLVED' | 'SUBMITTED' | 'REVISED' | 'PRACTICED'
  method: 'IDE' | 'HAND' | 'MENTAL' | string;
  rating?: string;
  durationSec: number;
  timestamp: number | string | Date;
}

interface ActivityHistoryListProps {
  initialActivities?: ActivityItem[];
}

export function ActivityHistoryList({ initialActivities = [] }: ActivityHistoryListProps) {
  const [filterMethod, setFilterMethod] = useState<string>('ALL');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const formatDuration = (totalSec?: number) => {
    if (!totalSec || totalSec <= 0) return '—';
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  const filtered = useMemo(() => {
    return initialActivities.filter((item) => {
      if (filterMethod !== 'ALL' && item.method !== filterMethod) return false;
      if (filterDifficulty !== 'ALL' && item.difficulty !== filterDifficulty) return false;
      if (
        searchQuery.trim() &&
        !item.problemTitle.toLowerCase().includes(searchQuery.toLowerCase().trim())
      ) {
        return false;
      }
      return true;
    });
  }, [initialActivities, filterMethod, filterDifficulty, searchQuery]);

  return (
    <div className="p-5 rounded-xl border border-border/80 bg-card/60 backdrop-blur-md space-y-4">
      {/* Header and Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-border/60">
        <div>
          <h3 className="font-bold text-sm text-foreground uppercase tracking-tight">
            Practice &amp; Revision Activity History
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Chronological log of verified problem solves, active recall revisions, and dry-run sessions.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Input */}
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search problem..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 rounded-md bg-muted/50 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary w-36 sm:w-44"
            />
          </div>

          {/* Method Filter */}
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="px-2.5 py-1 rounded-md bg-muted/60 border border-border text-xs text-foreground font-medium focus:outline-none"
          >
            <option value="ALL">All Methods</option>
            <option value="IDE">IDE Code</option>
            <option value="HAND">By Hand</option>
            <option value="MENTAL">In Mind</option>
          </select>

          {/* Difficulty Filter */}
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-2.5 py-1 rounded-md bg-muted/60 border border-border text-xs text-foreground font-medium focus:outline-none"
          >
            <option value="ALL">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
      </div>

      {/* List Entries */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center text-xs text-muted-foreground">
          No practice activity found matching the selected filters.
        </div>
      ) : (
        <div className="divide-y divide-border/40">
          {filtered.map((item) => {
            const dateObj = new Date(item.timestamp);
            const slug =
              item.slug ||
              item.problemTitle
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');

            return (
              <div
                key={item.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/20 px-2 rounded-lg transition-colors"
              >
                {/* Left: Problem details & Method Tag */}
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-muted/70 flex items-center justify-center shrink-0">
                    {item.method === 'IDE' ? (
                      <Code2 className="h-4 w-4 text-emerald-400" />
                    ) : item.method === 'HAND' ? (
                      <PenTool className="h-4 w-4 text-sky-400" />
                    ) : (
                      <Brain className="h-4 w-4 text-amber-400" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/dsa/${slug}`}
                        className="font-semibold text-xs text-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                      >
                        <span>{item.problemTitle}</span>
                        <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>

                      <Badge
                        variant={
                          item.difficulty === 'EASY'
                            ? 'success'
                            : item.difficulty === 'MEDIUM'
                            ? 'warning'
                            : 'destructive'
                        }
                        className="text-[10px] px-1.5 py-0 h-4"
                      >
                        {item.difficulty}
                      </Badge>

                      <span className="text-[11px] font-mono text-muted-foreground">
                        Lvl {item.level}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                      <span className="font-medium text-foreground/80">
                        {item.method === 'IDE'
                          ? 'Solved in IDE'
                          : item.method === 'HAND'
                          ? 'Solved By Hand'
                          : 'Solved In Mind'}
                      </span>
                      <span>•</span>
                      <span>{dateObj.toLocaleDateString()} {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Duration, Rating, and Link */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                  {item.durationSec > 0 && (
                    <div className="flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <Clock className="h-3 w-3" />
                      <span>{formatDuration(item.durationSec)}</span>
                    </div>
                  )}

                  {item.rating && (
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {item.rating}
                    </Badge>
                  )}

                  <Link href={`/dsa/${slug}`}>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      Reopen
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
