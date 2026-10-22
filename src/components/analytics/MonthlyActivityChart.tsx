'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, BarChart2 } from 'lucide-react';
import { DayActivityData } from './ContributionHeatmap';

interface MonthlyActivityChartProps {
  activityData?: Record<string, DayActivityData>;
}

export function MonthlyActivityChart({ activityData = {} }: MonthlyActivityChartProps) {
  const [selectedMonth, setSelectedMonth] = useState(9); // 0-indexed: 9 = October
  const [selectedYear, setSelectedYear] = useState(2026);
  const [metric, setMetric] = useState<'sessions' | 'uniqueSolved' | 'revisions' | 'submissions'>('sessions');
  const [hoveredDay, setHoveredDay] = useState<{ day: number; count: number } | null>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = useMemo(() => {
    return new Date(selectedYear, selectedMonth + 1, 0).getDate();
  }, [selectedYear, selectedMonth]);

  const dailyValues = useMemo(() => {
    const list: { day: number; count: number; dateStr: string }[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const mStr = String(selectedMonth + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      const dateStr = `${selectedYear}-${mStr}-${dStr}`;
      const count = activityData[dateStr]?.[metric] || 0;
      list.push({ day: d, count, dateStr });
    }
    return list;
  }, [activityData, selectedYear, selectedMonth, daysInMonth, metric]);

  const maxVal = useMemo(() => {
    const max = Math.max(...dailyValues.map((v) => v.count), 5);
    return max;
  }, [dailyValues]);

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  return (
    <div className="p-5 rounded-xl border border-border/80 bg-card/60 backdrop-blur-md space-y-4">
      {/* Month Navigator Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-bold text-sm text-foreground min-w-[130px] text-center">
            {months[selectedMonth]} {selectedYear}
          </span>
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Metric Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Metric:</span>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value as any)}
            className="px-2 py-1 rounded bg-muted/60 border border-border text-xs text-foreground font-medium focus:outline-none"
          >
            <option value="sessions">Practice Sessions</option>
            <option value="uniqueSolved">Unique Problems Solved</option>
            <option value="revisions">Revisions Completed</option>
            <option value="submissions">Accepted Submissions</option>
          </select>
        </div>
      </div>

      {/* Bar Chart Canvas */}
      <div className="relative pt-6 pb-2">
        <div className="h-40 flex items-end gap-1 sm:gap-1.5 border-b border-border/70 px-2">
          {dailyValues.map(({ day, count }) => {
            const heightPercent = (count / maxVal) * 100;

            return (
              <div
                key={day}
                className="flex-1 flex flex-col items-center group relative h-full justify-end"
                onMouseEnter={() => setHoveredDay({ day, count })}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {/* Bar */}
                <div
                  style={{ height: `${Math.max(heightPercent, count > 0 ? 10 : 3)}%` }}
                  className={`w-full max-w-[14px] rounded-t transition-all ${
                    count > 0
                      ? 'bg-emerald-500 group-hover:bg-emerald-400'
                      : 'bg-muted/30 group-hover:bg-muted/50'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Day Number Labels under bars */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono px-2 pt-1.5 select-none">
          <span>Day 1</span>
          <span>Day 7</span>
          <span>Day 14</span>
          <span>Day 21</span>
          <span>Day {daysInMonth}</span>
        </div>

        {/* Active Hover Tooltip */}
        {hoveredDay && (
          <div className="absolute top-0 right-4 px-2.5 py-1 rounded-md bg-black/80 border border-border text-xs text-white">
            Day {hoveredDay.day}: <strong className="text-emerald-400">{hoveredDay.count}</strong> {metric}
          </div>
        )}
      </div>
    </div>
  );
}
