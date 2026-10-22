import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { prisma } from '../src/lib/prisma';
import { PracticeService } from '../src/services/practice/practiceService';
import { calculateStreak } from '../src/lib/streak';
import { getCalendarDateForTimezone, getPreviousCalendarDate, getNextCalendarDate } from '../src/lib/timezone';

describe('Production Practice Sessions, Attempt Deduplication & Analytics Invariants', () => {
  const testUserId = `test-user-${Date.now()}`;
  let problemAId: string;
  let problemBId: string;
  let problemCId: string;

  before(async () => {
    // Ensure test user exists
    await prisma.user.create({
      data: {
        id: testUserId,
        email: `${testUserId}@gmail.com`,
        normalizedEmail: `${testUserId}@gmail.com`,
        name: 'Test Coder',
        username: testUserId,
        normalizedUsername: testUserId.toLowerCase(),
        timezone: 'UTC',
      },
    });

    // Fetch three existing problems
    const problems = await prisma.dsaProblem.findMany({ take: 3 });
    problemAId = problems[0].id;
    problemBId = problems[1].id;
    problemCId = problems[2].id;
  });

  after(async () => {
    // Cleanup
    await prisma.practiceAttempt.deleteMany({ where: { userId: testUserId } });
    await prisma.practiceSession.deleteMany({ where: { userId: testUserId } });
    await prisma.profile.deleteMany({ where: { userId: testUserId } });
    await prisma.user.deleteMany({ where: { id: testUserId } });
  });

  // 1. Core Requirement: Question vs Attempt vs Practice Session
  it('first attempt creates exactly one attempt and one unique practice session', async () => {
    const timestamp = new Date('2026-10-20T10:00:00Z');
    const { session, attempt } = await PracticeService.recordAttempt({
      userId: testUserId,
      problemId: problemAId,
      timestamp,
      attemptType: 'IDE_SUBMISSION',
      method: 'IDE',
      status: 'ACCEPTED',
      runtimeMs: 50,
      userTimezone: 'UTC',
    });

    assert.ok(session);
    assert.ok(attempt);
    assert.strictEqual(session.activityDate, '2026-10-20');
    assert.strictEqual(session.attemptCount, 1);

    const sessionCount = await prisma.practiceSession.count({
      where: { userId: testUserId, problemId: problemAId, activityDate: '2026-10-20' },
    });
    assert.strictEqual(sessionCount, 1);
  });

  it('repeated attempts of the same problem on the same day increment attempt count but do NOT create new sessions', async () => {
    // 4 additional attempts on 2026-10-20
    for (let i = 1; i <= 4; i++) {
      await PracticeService.recordAttempt({
        userId: testUserId,
        problemId: problemAId,
        timestamp: new Date(`2026-10-20T1${i}:00:00Z`),
        attemptType: 'IDE_SUBMISSION',
        method: 'IDE',
        status: 'ACCEPTED',
        runtimeMs: 40 + i,
        userTimezone: 'UTC',
      });
    }

    const session = await prisma.practiceSession.findUnique({
      where: {
        userId_problemId_activityDate: {
          userId: testUserId,
          problemId: problemAId,
          activityDate: '2026-10-20',
        },
      },
    });

    assert.ok(session);
    assert.strictEqual(session.attemptCount, 5); // 1 initial + 4 additional = 5 attempts

    // Total sessions for that problem on that day MUST be 1
    const totalSessions = await prisma.practiceSession.count({
      where: { userId: testUserId, problemId: problemAId, activityDate: '2026-10-20' },
    });
    assert.strictEqual(totalSessions, 1);

    // Total granular attempts for that problem on that day MUST be 5
    const totalAttempts = await prisma.practiceAttempt.count({
      where: { userId: testUserId, problemId: problemAId, activityDate: '2026-10-20' },
    });
    assert.strictEqual(totalAttempts, 5);
  });

  it('same problem practiced on three distinct days creates exactly three unique sessions', async () => {
    // Problem A on Oct 21
    await PracticeService.recordAttempt({
      userId: testUserId,
      problemId: problemAId,
      timestamp: new Date('2026-10-21T09:00:00Z'),
      status: 'ACCEPTED',
      userTimezone: 'UTC',
    });

    // Problem A on Oct 22
    await PracticeService.recordAttempt({
      userId: testUserId,
      problemId: problemAId,
      timestamp: new Date('2026-10-22T08:00:00Z'),
      status: 'ACCEPTED',
      userTimezone: 'UTC',
    });

    const sessions = await prisma.practiceSession.findMany({
      where: { userId: testUserId, problemId: problemAId },
      orderBy: { activityDate: 'asc' },
    });

    assert.strictEqual(sessions.length, 3);
    assert.strictEqual(sessions[0].activityDate, '2026-10-20');
    assert.strictEqual(sessions[1].activityDate, '2026-10-21');
    assert.strictEqual(sessions[2].activityDate, '2026-10-22');
  });

  it('multiple distinct problems on the same day create multiple distinct sessions', async () => {
    // Problem B on Oct 22
    await PracticeService.recordAttempt({
      userId: testUserId,
      problemId: problemBId,
      timestamp: new Date('2026-10-22T10:00:00Z'),
      status: 'ACCEPTED',
      userTimezone: 'UTC',
    });

    // Problem C on Oct 22
    await PracticeService.recordAttempt({
      userId: testUserId,
      problemId: problemCId,
      timestamp: new Date('2026-10-22T11:00:00Z'),
      status: 'ACCEPTED',
      userTimezone: 'UTC',
    });

    // On Oct 22, we now have Problem A, Problem B, and Problem C
    const oct22Sessions = await prisma.practiceSession.findMany({
      where: { userId: testUserId, activityDate: '2026-10-22' },
    });

    assert.strictEqual(oct22Sessions.length, 3);
    const problemIdsOnOct22 = new Set(oct22Sessions.map((s) => s.problemId));
    assert.ok(problemIdsOnOct22.has(problemAId));
    assert.ok(problemIdsOnOct22.has(problemBId));
    assert.ok(problemIdsOnOct22.has(problemCId));
  });

  it('concurrent duplicate requests cannot violate session uniqueness (atomic upsert)', async () => {
    // Fire 10 concurrent attempts simultaneously for Problem C on Oct 23
    const concurrentAttempts = Array.from({ length: 10 }, (_, idx) =>
      PracticeService.recordAttempt({
        userId: testUserId,
        problemId: problemCId,
        timestamp: new Date('2026-10-23T14:00:00Z'),
        status: 'ACCEPTED',
        userTimezone: 'UTC',
        notes: `Concurrent call ${idx}`,
      })
    );

    const results = await Promise.all(concurrentAttempts);
    assert.strictEqual(results.length, 10);

    const oct23Sessions = await prisma.practiceSession.findMany({
      where: { userId: testUserId, problemId: problemCId, activityDate: '2026-10-23' },
    });

    assert.strictEqual(oct23Sessions.length, 1);
    assert.strictEqual(oct23Sessions[0].attemptCount, 10);
  });

  // 2. Practice Activity History Invariants
  it('activity history returns exactly ONE row per unique problem for the user', async () => {
    const history = await PracticeService.getLatestActivityHistory({
      userId: testUserId,
      page: 1,
      pageSize: 20,
    });

    assert.strictEqual(history.total, 3); // Problem A, B, C
    assert.strictEqual(history.items.length, 3);

    const problemIdsInHistory = history.items.map((i) => i.problemId);
    const uniqueIds = new Set(problemIdsInHistory);
    assert.strictEqual(uniqueIds.size, 3); // No duplicates!
  });

  it('re-attempting an old problem immediately brings it to the top of the history list', async () => {
    // Problem C was attempted on Oct 23 at 14:00
    // Let's re-attempt Problem A on Oct 24 at 15:00
    const reattemptTimestamp = new Date('2026-10-24T15:00:00Z');
    await PracticeService.recordAttempt({
      userId: testUserId,
      problemId: problemAId,
      timestamp: reattemptTimestamp,
      method: 'HAND',
      status: 'ACCEPTED',
      userTimezone: 'UTC',
    });

    const history = await PracticeService.getLatestActivityHistory({
      userId: testUserId,
      page: 1,
      pageSize: 20,
    });

    // Problem A MUST now be at the very top (index 0)
    assert.strictEqual(history.items[0].problemId, problemAId);
    assert.strictEqual(history.items[0].method, 'HAND');
    assert.strictEqual(history.items[0].timestamp, reattemptTimestamp.toISOString());

    // Still only 3 unique rows total
    assert.strictEqual(history.total, 3);
  });

  // 3. Heatmap and Daily Aggregation Invariants
  it('daily heatmap aggregation counts unique practice sessions, NOT raw attempts', async () => {
    const activityMap = await PracticeService.getYearActivityMap(testUserId, 2026);

    // Oct 20: 5 attempts of Problem A -> 1 unique session
    assert.strictEqual(activityMap['2026-10-20']?.sessions, 1);

    // Oct 21: 1 attempt of Problem A -> 1 unique session
    assert.strictEqual(activityMap['2026-10-21']?.sessions, 1);

    // Oct 22: Problem A + Problem B + Problem C -> 3 unique sessions
    assert.strictEqual(activityMap['2026-10-22']?.sessions, 3);

    // Oct 23: Problem C (10 attempts) -> 1 unique session
    assert.strictEqual(activityMap['2026-10-23']?.sessions, 1);

    // Oct 24: Problem A -> 1 unique session
    assert.strictEqual(activityMap['2026-10-24']?.sessions, 1);
  });

  // 4. Streak Calculation Unit Invariants
  it('calculates streak across consecutive days and gaps correctly', () => {
    // Active Oct 18, 19, 20, 21, 22. Reference date Oct 22 -> 5 days
    const dates1 = ['2026-10-18', '2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22'];
    const r1 = calculateStreak(dates1, '2026-10-22');
    assert.strictEqual(r1.currentStreak, 5);
    assert.strictEqual(r1.longestStreak, 5);
    assert.strictEqual(r1.isActiveToday, true);

    // Active Oct 18, 19, [gap 20], 21, 22. Reference Oct 22 -> 2 days
    const dates2 = ['2026-10-18', '2026-10-19', '2026-10-21', '2026-10-22'];
    const r2 = calculateStreak(dates2, '2026-10-22');
    assert.strictEqual(r2.currentStreak, 2);
    assert.strictEqual(r2.longestStreak, 2);

    // Active yesterday Oct 21, inactive today Oct 22. Reference Oct 22 -> streak preserved (1 day)
    const dates3 = ['2026-10-21'];
    const r3 = calculateStreak(dates3, '2026-10-22');
    assert.strictEqual(r3.currentStreak, 1);
    assert.strictEqual(r3.isActiveToday, false);

    // Inactive yesterday AND today. Reference Oct 22 -> streak broken (0)
    const dates4 = ['2026-10-20'];
    const r4 = calculateStreak(dates4, '2026-10-22');
    assert.strictEqual(r4.currentStreak, 0);
    assert.strictEqual(r4.longestStreak, 1);

    // Year boundary crossing: 2025-12-31 to 2026-01-01
    const datesYear = ['2025-12-31', '2026-01-01'];
    const rYear = calculateStreak(datesYear, '2026-01-01');
    assert.strictEqual(rYear.currentStreak, 2);

    // Leap year boundary: 2024-02-28, 2024-02-29, 2024-03-01
    const datesLeap = ['2024-02-28', '2024-02-29', '2024-03-01'];
    const rLeap = calculateStreak(datesLeap, '2024-03-01');
    assert.strictEqual(rLeap.currentStreak, 3);
  });

  // 5. Timezone calendar date derivation
  it('correctly maps timestamps near midnight to user local calendar date', () => {
    // 2026-10-22 23:30:00 UTC
    const lateUtc = new Date('2026-10-22T23:30:00Z');

    // In UTC, it is Oct 22
    assert.strictEqual(getCalendarDateForTimezone(lateUtc, 'UTC'), '2026-10-22');

    // In Asia/Kolkata (+5:30), 23:30 + 5:30 is 05:00 AM on Oct 23!
    assert.strictEqual(getCalendarDateForTimezone(lateUtc, 'Asia/Kolkata'), '2026-10-23');

    // In America/New_York (-4:00 EDT), 23:30 - 4:00 is 19:30 on Oct 22
    assert.strictEqual(getCalendarDateForTimezone(lateUtc, 'America/New_York'), '2026-10-22');
  });
});
