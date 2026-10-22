import { prisma } from '@/lib/prisma';
import { getCalendarDateForTimezone, getTodayInTimezone, normalizeTimezone } from '@/lib/timezone';
import { calculateStreak, StreakResult } from '@/lib/streak';

export interface RecordPracticeParams {
  userId: string;
  problemId: string;
  timestamp?: Date;
  attemptType?: string; // 'IDE_SUBMISSION' | 'IDE_SOLVE' | 'REVISION_CODE' | 'REVISION_HAND' | 'REVISION_MENTAL'
  method?: 'IDE' | 'HAND' | 'MENTAL' | string;
  status?: string; // 'ACCEPTED' | 'FAILED' | 'ATTEMPTED'
  runtimeMs?: number;
  durationSec?: number;
  optimalityScore?: number;
  code?: string;
  notes?: string;
  userTimezone?: string;
}

export interface ActivityHistoryItem {
  id: string;
  problemId: string;
  problemTitle: string;
  slug: string;
  level: number;
  difficulty: string;
  eventType: string;
  method: string;
  status: string;
  rating?: string;
  durationSec: number;
  runtimeMs: number;
  timestamp: string; // ISO string
}

export interface HistoryListResponse {
  items: ActivityHistoryItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class PracticeService {
  /**
   * Atomically records an individual practice attempt and upserts the unique daily practice session.
   * Invariant: exactly one PracticeSession per (userId, problemId, activityDate).
   */
  static async recordAttempt(params: RecordPracticeParams) {
    const {
      userId,
      problemId,
      timestamp = new Date(),
      attemptType = 'IDE_SUBMISSION',
      method = 'IDE',
      status = 'ACCEPTED',
      runtimeMs = 0,
      durationSec = 0,
      optimalityScore,
      code,
      notes,
    } = params;

    // Get user timezone
    let timezone = params.userTimezone;
    if (!timezone) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { timezone: true },
      });
      timezone = user?.timezone || 'UTC';
    }
    const safeTimezone = normalizeTimezone(timezone);
    const activityDate = getCalendarDateForTimezone(timestamp, safeTimezone);
    const isAccepted = status === 'ACCEPTED';

    // Execute in transaction to ensure session and attempt consistency
    return await prisma.$transaction(async (tx) => {
      // 1. Atomic upsert of PracticeSession (database uniqueness: userId, problemId, activityDate)
      const session = await tx.practiceSession.upsert({
        where: {
          userId_problemId_activityDate: {
            userId,
            problemId,
            activityDate,
          },
        },
        create: {
          userId,
          problemId,
          activityDate,
          attemptCount: 1,
          lastAttemptAt: timestamp,
          firstAttemptAt: timestamp,
          solved: isAccepted,
        },
        update: {
          attemptCount: { increment: 1 },
          lastAttemptAt: timestamp,
          ...(isAccepted ? { solved: true } : {}),
        },
      });

      // 2. Record the granular attempt
      const attempt = await tx.practiceAttempt.create({
        data: {
          userId,
          problemId,
          sessionId: session.id,
          activityDate,
          attemptType,
          method,
          status,
          runtimeMs,
          durationSec,
          optimalityScore: optimalityScore ?? null,
          code: code ?? null,
          notes: notes ?? null,
          createdAt: timestamp,
        },
      });

      // 3. Update user lastActiveAt
      await tx.user.update({
        where: { id: userId },
        data: { lastActiveAt: timestamp },
      });

      return { session, attempt };
    });
  }

  /**
   * Returns one row per unique problem for the user, determined by the problem's latest attempt.
   * Sorted strictly by latest_attempt_at DESC with server-side pagination.
   */
  static async getLatestActivityHistory(params: {
    userId: string;
    page?: number;
    pageSize?: number;
    method?: string;
    difficulty?: string;
    searchQuery?: string;
  }): Promise<HistoryListResponse> {
    const {
      userId,
      page = 1,
      pageSize = 20,
      method = 'ALL',
      difficulty = 'ALL',
      searchQuery = '',
    } = params;

    const offset = Math.max(0, (page - 1) * pageSize);

    // Build dynamic SQL with safe parameter binding
    const whereConditions: string[] = ['pa."userId" = $1'];
    const countWhereConditions: string[] = ['pa."userId" = $1'];
    const queryParams: any[] = [userId];

    if (method !== 'ALL') {
      queryParams.push(method);
      const paramIndex = queryParams.length;
      whereConditions.push(`pa.method = $${paramIndex}`);
      countWhereConditions.push(`pa.method = $${paramIndex}`);
    }

    if (difficulty !== 'ALL') {
      queryParams.push(difficulty);
      const paramIndex = queryParams.length;
      whereConditions.push(`p.difficulty::text = $${paramIndex}`);
      countWhereConditions.push(`p.difficulty::text = $${paramIndex}`);
    }

    if (searchQuery.trim()) {
      queryParams.push(`%${searchQuery.trim()}%`);
      const paramIndex = queryParams.length;
      whereConditions.push(`p.title ILIKE $${paramIndex}`);
      countWhereConditions.push(`p.title ILIKE $${paramIndex}`);
    }

    const whereClause = whereConditions.join(' AND ');
    const countWhereClause = countWhereConditions.join(' AND ');

    // Total distinct problems matching criteria
    const countSql = `
      SELECT COUNT(DISTINCT pa."problemId")::int AS total
      FROM "PracticeAttempt" pa
      JOIN "DsaProblem" p ON p.id = pa."problemId"
      WHERE ${countWhereClause}
    `;

    // Distinct latest attempt per problem ordered by latest createdAt DESC
    const dataSql = `
      WITH RankedAttempts AS (
        SELECT DISTINCT ON (pa."problemId")
          pa.id AS "attemptId",
          pa."problemId",
          pa."attemptType",
          pa.method,
          pa.status,
          pa."runtimeMs",
          pa."durationSec",
          pa."optimalityScore",
          pa."createdAt" AS "latestAttemptAt",
          p.title AS "problemTitle",
          p.slug AS "slug",
          p.level AS "level",
          p.difficulty AS "difficulty"
        FROM "PracticeAttempt" pa
        JOIN "DsaProblem" p ON p.id = pa."problemId"
        WHERE ${whereClause}
        ORDER BY pa."problemId", pa."createdAt" DESC
      )
      SELECT * FROM RankedAttempts
      ORDER BY "latestAttemptAt" DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;

    const countResult: any[] = await prisma.$queryRawUnsafe(countSql, ...queryParams);
    const total = countResult[0]?.total ?? 0;

    const dataParams = [...queryParams, pageSize, offset];
    const rawItems: any[] = await prisma.$queryRawUnsafe(dataSql, ...dataParams);

    const items: ActivityHistoryItem[] = rawItems.map((r) => {
      let rating: string | undefined = undefined;
      if (r.optimalityScore !== null && r.optimalityScore !== undefined) {
        rating = `${Math.round(r.optimalityScore)}% Optimal`;
      } else if (r.status === 'ACCEPTED') {
        rating = 'Accepted';
      }

      return {
        id: r.attemptId,
        problemId: r.problemId,
        problemTitle: r.problemTitle,
        slug: r.slug,
        level: r.level,
        difficulty: r.difficulty,
        eventType: r.attemptType.startsWith('REVISION') ? 'REVISED' : 'SOLVED',
        method: r.method,
        status: r.status,
        rating,
        durationSec: r.durationSec || (r.runtimeMs ? Math.round(r.runtimeMs / 1000) : 0),
        runtimeMs: r.runtimeMs || 0,
        timestamp: new Date(r.latestAttemptAt).toISOString(),
      };
    });

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize) || 1,
    };
  }

  /**
   * Computes daily unique sessions, unique solved problems, and revision totals for a given year.
   * Adheres strictly to unique_session = unique(problem_id, activity_date, user_id).
   */
  static async getYearActivityMap(userId: string, year: number) {
    const yearPrefix = `${year}-`;

    // 1. Group sessions by activityDate: each record in PracticeSession is by definition 1 unique session
    const sessions = await prisma.practiceSession.findMany({
      where: {
        userId,
        activityDate: { startsWith: yearPrefix },
      },
      select: {
        activityDate: true,
        solved: true,
        attemptCount: true,
      },
    });

    // 2. Get attempts count for revisions vs submissions
    const attempts = await prisma.practiceAttempt.findMany({
      where: {
        userId,
        activityDate: { startsWith: yearPrefix },
      },
      select: {
        activityDate: true,
        attemptType: true,
        status: true,
      },
    });

    const map: Record<
      string,
      {
        date: string;
        sessions: number;
        uniqueSolved: number;
        revisions: number;
        submissions: number;
      }
    > = {};

    const ensureDay = (d: string) => {
      if (!map[d]) {
        map[d] = {
          date: d,
          sessions: 0,
          uniqueSolved: 0,
          revisions: 0,
          submissions: 0,
        };
      }
      return map[d];
    };

    // Aggregate sessions: 1 PracticeSession row = 1 session for that date!
    sessions.forEach((s) => {
      const day = ensureDay(s.activityDate);
      day.sessions += 1; // Exactly 1 unique problem per day
      if (s.solved) {
        day.uniqueSolved += 1;
      }
    });

    // Aggregate granular attempts for sub-metrics
    attempts.forEach((a) => {
      const day = ensureDay(a.activityDate);
      if (a.attemptType.startsWith('REVISION')) {
        day.revisions += 1;
      } else {
        if (a.status === 'ACCEPTED') {
          day.submissions += 1;
        }
      }
    });

    return map;
  }

  /**
   * Recalculates and updates the user's practice streak based on unique session activity dates.
   */
  static async refreshUserStreak(userId: string, timezone?: string): Promise<StreakResult> {
    let safeTz = timezone;
    if (!safeTz) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { timezone: true },
      });
      safeTz = user?.timezone || 'UTC';
    }
    safeTz = normalizeTimezone(safeTz);

    const todayStr = getTodayInTimezone(safeTz);

    // Fetch distinct active calendar dates
    const distinctDates = await prisma.practiceSession.findMany({
      where: { userId },
      select: { activityDate: true },
      distinct: ['activityDate'],
      orderBy: { activityDate: 'asc' },
    });

    const activeDateStrings = distinctDates.map((d) => d.activityDate);
    const result = calculateStreak(activeDateStrings, todayStr);

    // Update User record with streak
    await prisma.user.update({
      where: { id: userId },
      data: {
        streak: result.currentStreak,
        longestStreak: Math.max(result.longestStreak, result.currentStreak),
      },
    });

    return result;
  }
}
