'use client';

import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/Badge';
import { HelpCircle, ChevronDown, Calendar } from 'lucide-react';

export interface DayActivityData {
  date: string; // YYYY-MM-DD
  sessions: number;
  uniqueSolved: number;
  revisions: number;
  submissions: number;
}

interface ContributionHeatmapProps {
  activityData?: Record<string, DayActivityData>;
  currentYear?: number;
}

export function ContributionHeatmap({
  activityData = {},
  currentYear = 2026,
}: ContributionHeatmapProps) {
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMetric, setSelectedMetric] = useState<
    'sessions' | 'uniqueSolved' | 'revisions' | 'submissions'
  >('sessions');
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    data: DayActivityData;
    x: number;
    y: number;
  } | null>(null);

  // Dynamically derive available years without hardcoded restrictions
  const years = useMemo(() => {
    const yearSet = new Set<number>([currentYear]);
    for (let i = 0; i < 5; i++) {
      yearSet.add(currentYear - i);
    }
    Object.keys(activityData).forEach((dateStr) => {
      const yr = parseInt(dateStr.slice(0, 4), 10);
      if (!isNaN(yr)) yearSet.add(yr);
    });
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [currentYear, activityData]);

  // Generate 52 weeks (365/366 days) for the selected year
  const calendarWeeks = useMemo(() => {
    const weeks: { date: Date; dateStr: string; dayOfWeek: number }[][] = [];
    const startDate = new Date(selectedYear, 0, 1); // Jan 1
    const endDate = new Date(selectedYear, 11, 31); // Dec 31

    // Adjust start to preceding Sunday/Monday to align grid
    const current = new Date(startDate);
    const dayOffset = current.getDay(); // 0 is Sunday
    current.setDate(current.getDate() - dayOffset);

    let currentWeek: { date: Date; dateStr: string; dayOfWeek: number }[] = [];

    while (current <= endDate || currentWeek.length > 0) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const day = String(current.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      currentWeek.push({
        date: new Date(current),
        dateStr,
        dayOfWeek: current.getDay(),
      });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
        if (current > endDate) break;
      }

      current.setDate(current.getDate() + 1);
    }

    return weeks;
  }, [selectedYear]);

  // Calculate total contributions for the selected metric
  const totalContributions = useMemo(() => {
    let sum = 0;
    Object.entries(activityData).forEach(([dateStr, data]) => {
      if (dateStr.startsWith(`${selectedYear}-`)) {
        sum += data[selectedMetric] || 0;
      }
    });
    return sum;
  }, [activityData, selectedYear, selectedMetric]);

  // Color intensity levels based on count (0 to 4)
  const getIntensityColor = (count: number) => {
    if (count === 0) return 'bg-[#161b22] border-border/20'; // GitHub dark empty
    if (count === 1) return 'bg-[#0e4429] border-emerald-900/40'; // Light green
    if (count === 2) return 'bg-[#006d32] border-emerald-800/40'; // Medium green
    if (count <= 4) return 'bg-[#26a641] border-emerald-600/40'; // Bright green
    return 'bg-[#39d353] border-emerald-400/40'; // Max green
  };

  const metricLabels = {
    sessions: 'practice sessions',
    uniqueSolved: 'unique problems solved',
    revisions: 'revisions completed',
    submissions: 'accepted submissions',
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="p-5 rounded-xl border border-border/80 bg-card/60 backdrop-blur-md space-y-4">
      {/* Header with Title and Year Selector Pills */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-base font-bold text-foreground">
            {totalContributions} {metricLabels[selectedMetric]} in {selectedYear}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">Metric:</span>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as any)}
              className="px-2 py-0.5 rounded bg-muted/60 border border-border text-xs text-foreground font-medium focus:outline-none"
            >
              <option value="sessions">Practice Sessions</option>
              <option value="uniqueSolved">Unique Problems Solved</option>
              <option value="revisions">Revisions Completed</option>
              <option value="submissions">Accepted Submissions</option>
            </select>
          </div>
        </div>

        {/* Year Pills on the Right (matching reference image) */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {years.map((yr) => (
            <button
              key={yr}
              type="button"
              onClick={() => setSelectedYear(yr)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                selectedYear === yr
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {yr}
            </button>
          ))}
        </div>
      </div>

      {/* Contribution Calendar Grid */}
      <div className="relative overflow-x-auto pb-2">
        <div className="min-w-[760px]">
          {/* Months Header Labels */}
          <div className="flex text-[11px] text-muted-foreground pl-8 mb-1.5">
            {months.map((m, idx) => (
              <span key={idx} className="flex-1 text-left">
                {m}
              </span>
            ))}
          </div>

          <div className="flex gap-1.5">
            {/* Weekday Labels on Left (Mon, Wed, Fri) */}
            <div className="flex flex-col justify-between text-[10px] text-muted-foreground font-mono pr-2 py-1 select-none">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Weeks Columns */}
            <div className="flex gap-1 flex-1">
              {calendarWeeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1">
                  {week.map((dayItem, dIdx) => {
                    const data = activityData[dayItem.dateStr] || {
                      date: dayItem.dateStr,
                      sessions: 0,
                      uniqueSolved: 0,
                      revisions: 0,
                      submissions: 0,
                    };
                    const count = data[selectedMetric] || 0;
                    const isCurrentYear = dayItem.dateStr.startsWith(`${selectedYear}-`);

                    return (
                      <div
                        key={dIdx}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoveredDay({
                            date: dayItem.dateStr,
                            data,
                            x: rect.left + rect.width / 2,
                            y: rect.top,
                          });
                        }}
                        onMouseLeave={() => setHoveredDay(null)}
                        className={`h-3 w-3 rounded-[2.5px] border transition-transform hover:scale-125 cursor-pointer ${
                          !isCurrentYear
                            ? 'opacity-20 bg-muted/20 border-transparent'
                            : getIntensityColor(count)
                        }`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Tooltip */}
      {hoveredDay && (
        <div
          style={{
            position: 'fixed',
            left: `${hoveredDay.x}px`,
            top: `${hoveredDay.y - 80}px`,
            transform: 'translateX(-50%)',
          }}
          className="z-50 pointer-events-none p-2 rounded-lg bg-black/90 border border-border text-[11px] font-sans text-white shadow-xl space-y-1 min-w-[160px]"
        >
          <div className="font-semibold text-primary">
            {new Date(hoveredDay.date + 'T00:00:00').toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
          <div className="text-muted-foreground space-y-0.5">
            <div>
              Sessions: <strong className="text-white">{hoveredDay.data.sessions}</strong>
            </div>
            <div>
              Unique Solved: <strong className="text-emerald-400">{hoveredDay.data.uniqueSolved}</strong>
            </div>
            <div>
              Revisions: <strong className="text-amber-400">{hoveredDay.data.revisions}</strong>
            </div>
            <div>
              Submissions: <strong className="text-sky-400">{hoveredDay.data.submissions}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Footer: Intensity Legend & Info Link */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
        <span className="text-[11px] flex items-center gap-1">
          <HelpCircle className="h-3 w-3" />
          <span>Qualifying practice events, submissions, and active revisions.</span>
        </span>

        <div className="flex items-center gap-1.5 text-[11px]">
          <span>Less</span>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-[2.5px] bg-[#161b22] border border-border/20" />
            <span className="h-3 w-3 rounded-[2.5px] bg-[#0e4429] border border-emerald-900/40" />
            <span className="h-3 w-3 rounded-[2.5px] bg-[#006d32] border border-emerald-800/40" />
            <span className="h-3 w-3 rounded-[2.5px] bg-[#26a641] border border-emerald-600/40" />
            <span className="h-3 w-3 rounded-[2.5px] bg-[#39d353] border border-emerald-400/40" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
