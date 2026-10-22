/**
 * Timezone-aware date utilities for practice tracking and session analytics.
 * Enforces calendar date invariants across sessions, heatmaps, and streak calculations.
 */

export function isValidTimezone(tz?: string | null): boolean {
  if (!tz) return false;
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export function normalizeTimezone(tz?: string | null): string {
  if (tz && isValidTimezone(tz)) {
    return tz;
  }
  return 'UTC';
}

/**
 * Converts a Date or timestamp into a YYYY-MM-DD string in the target timezone.
 * Uses en-CA locale to guarantee standard ISO calendar formatting (YYYY-MM-DD).
 */
export function getCalendarDateForTimezone(
  date: Date | number | string = new Date(),
  timezone: string = 'UTC'
): string {
  const safeTz = normalizeTimezone(timezone);
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }

  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: safeTz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(dateObj);
  } catch {
    return dateObj.toISOString().slice(0, 10);
  }
}

/**
 * Returns today's calendar date in the specified timezone.
 */
export function getTodayInTimezone(timezone: string = 'UTC'): string {
  return getCalendarDateForTimezone(new Date(), timezone);
}

/**
 * Returns the calendar date immediately preceding the given YYYY-MM-DD string.
 * Handles month boundaries, year boundaries, and leap years using UTC arithmetic.
 */
export function getPreviousCalendarDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

/**
 * Returns the calendar date immediately following the given YYYY-MM-DD string.
 */
export function getNextCalendarDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}
