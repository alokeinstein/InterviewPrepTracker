import { getNextCalendarDate, getPreviousCalendarDate, getTodayInTimezone } from './timezone';

export interface StreakResult {
  currentStreak: number;
  longestStreak: number;
  isActiveToday: boolean;
  lastActiveDate: string | null;
}

/**
 * Calculates current and longest practice streak based on unique active calendar dates.
 * A practice day is defined as a calendar day on which the user completed >= 1 unique practice session.
 *
 * Consecutive rules:
 * - If active today: streak = 1 + consecutive preceding days.
 * - If inactive today but active yesterday: streak = 1 + consecutive days ending yesterday (streak is preserved until end of today).
 * - If inactive today and yesterday: streak = 0 (gap of >= 1 full elapsed day breaks streak).
 * - Future dates (> referenceDate) are disregarded.
 */
export function calculateStreak(
  activeDates: Iterable<string>,
  referenceDate: string = getTodayInTimezone('UTC')
): StreakResult {
  // Disregard future dates and empty entries
  const validDates = Array.from(activeDates)
    .filter((d) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d) && d <= referenceDate);

  const dateSet = new Set(validDates);

  if (dateSet.size === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      isActiveToday: false,
      lastActiveDate: null,
    };
  }

  const sortedDates = Array.from(dateSet).sort();
  const lastActiveDate = sortedDates[sortedDates.length - 1];

  const todayStr = referenceDate;
  const yesterdayStr = getPreviousCalendarDate(todayStr);

  const isActiveToday = dateSet.has(todayStr);
  const isActiveYesterday = dateSet.has(yesterdayStr);

  let currentStreak = 0;
  if (isActiveToday) {
    currentStreak = 1;
    let checkDate = getPreviousCalendarDate(todayStr);
    while (dateSet.has(checkDate)) {
      currentStreak++;
      checkDate = getPreviousCalendarDate(checkDate);
    }
  } else if (isActiveYesterday) {
    currentStreak = 1;
    let checkDate = getPreviousCalendarDate(yesterdayStr);
    while (dateSet.has(checkDate)) {
      currentStreak++;
      checkDate = getPreviousCalendarDate(checkDate);
    }
  } else {
    currentStreak = 0;
  }

  // Calculate longest historical streak
  let longestStreak = 0;
  let runningStreak = 0;
  let prevDate: string | null = null;

  for (const d of sortedDates) {
    if (!prevDate) {
      runningStreak = 1;
    } else {
      const expectedNext = getNextCalendarDate(prevDate);
      if (d === expectedNext) {
        runningStreak++;
      } else {
        runningStreak = 1;
      }
    }

    if (runningStreak > longestStreak) {
      longestStreak = runningStreak;
    }
    prevDate = d;
  }

  return {
    currentStreak,
    longestStreak,
    isActiveToday,
    lastActiveDate,
  };
}
