import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  RevisionEngine,
  QuestionRevisionRecord,
} from '../src/services/revision/revisionEngine';

describe('Revision Policy — Comprehensive 15-Rule Verification', () => {
  const baseDate = new Date(2026, 9, 22, 12, 0, 0); // Oct 22, 2026 12:00:00

  // Rule 1: Initial intervals
  it('Rule 1: Initial intervals match defaults: Again ~1d, Difficult 2d, Good 4d, Easy 7d', () => {
    const ratings = [
      { rating: 'AGAIN', expected: 1 },
      { rating: 'DIFFICULT', expected: 2 },
      { rating: 'GOOD', expected: 4 },
      { rating: 'EASY', expected: 7 },
    ] as const;

    for (const { rating, expected } of ratings) {
      const res = RevisionEngine.evaluateReview({
        questionId: `rule1-${rating}`,
        method: 'IDE',
        rating,
        durationSec: 100,
        solutionRevealed: false,
        now: baseDate,
      });
      assert.strictEqual(res.nextRecord.intervalDays, expected);
    }
  });

  // Rule 2: Failed review resets interval without deleting historical successes
  it('Rule 2: Failed review resets next interval to 1 day without deleting history', () => {
    const prior: Partial<QuestionRevisionRecord> = {
      repetitionCount: 4,
      consecutiveSuccessCount: 4,
      intervalDays: 28,
      easeFactor: 2.6,
      history: [
        {
          id: 'ev-1',
          questionId: 'q-fail',
          timestamp: new Date(2026, 8, 1),
          method: 'IDE',
          rating: 'GOOD',
          intervalDays: 4,
          solutionRevealed: false,
          hintsUsedCount: 0,
          passedVerification: true,
          durationSec: 200,
          qualifiesForMastery: true,
        },
      ],
    };

    const res = RevisionEngine.evaluateReview({
      questionId: 'q-fail',
      method: 'IDE',
      rating: 'AGAIN',
      durationSec: 300,
      solutionRevealed: false,
      currentRecord: prior,
      now: baseDate,
    });

    assert.strictEqual(res.nextRecord.intervalDays, 1);
    assert.strictEqual(res.nextRecord.consecutiveSuccessCount, 0);
    assert.strictEqual(res.nextRecord.repetitionCount, 5);
    // Historical events preserved
    assert.strictEqual(res.nextRecord.history.length, 2);
    assert.strictEqual(res.nextRecord.history[0].id, 'ev-1');
  });

  // Rule 3: All three practice methods contribute to one shared question-level schedule
  it('Rule 3: IDE, By Hand, and In Mind sequentially contribute to one shared schedule', () => {
    // 1. Solve in IDE
    const step1 = RevisionEngine.evaluateReview({
      questionId: 'shared-q',
      method: 'IDE',
      rating: 'GOOD',
      durationSec: 400,
      solutionRevealed: false,
      now: baseDate,
    });
    assert.strictEqual(step1.nextRecord.intervalDays, 4);

    // 2. Solve By Hand
    const step2 = RevisionEngine.evaluateReview({
      questionId: 'shared-q',
      method: 'HAND',
      rating: 'GOOD',
      durationSec: 250,
      solutionRevealed: false,
      currentRecord: step1.nextRecord,
      now: step1.nextRecord.nextReviewDate,
    });
    assert.ok(step2.nextRecord.intervalDays > 4);
    assert.strictEqual(step2.nextRecord.consecutiveSuccessCount, 2);

    // 3. Solve In Mind
    const step3 = RevisionEngine.evaluateReview({
      questionId: 'shared-q',
      method: 'MENTAL',
      rating: 'EASY',
      durationSec: 90,
      solutionRevealed: false,
      currentRecord: step2.nextRecord,
      now: step2.nextRecord.nextReviewDate,
    });
    assert.ok(step3.nextRecord.intervalDays > step2.nextRecord.intervalDays);
    assert.strictEqual(step3.nextRecord.consecutiveSuccessCount, 3);
    assert.strictEqual(step3.nextRecord.history.length, 3);
  });

  // Rule 4: IDE reviews require an actual attempt
  it('Rule 4: IDE reviews require passed verification to qualify for mastery', () => {
    const res = RevisionEngine.evaluateReview({
      questionId: 'ide-unattempted',
      method: 'IDE',
      rating: 'GOOD',
      durationSec: 10,
      solutionRevealed: false,
      passedVerification: false, // user did not pass tests
      now: baseDate,
    });

    assert.strictEqual(res.event.qualifiesForMastery, false);
  });

  // Rule 5: By Hand and In Mind allow appropriate self-reported outcomes
  it('Rule 5: By Hand and In Mind allow self-reported verification', () => {
    const handRes = RevisionEngine.evaluateReview({
      questionId: 'hand-self',
      method: 'HAND',
      rating: 'GOOD',
      durationSec: 180,
      solutionRevealed: false,
      passedVerification: true,
      now: baseDate,
    });
    assert.strictEqual(handRes.event.qualifiesForMastery, true);

    const mindRes = RevisionEngine.evaluateReview({
      questionId: 'mind-self',
      method: 'MENTAL',
      rating: 'EASY',
      durationSec: 60,
      solutionRevealed: false,
      passedVerification: true,
      now: baseDate,
    });
    assert.strictEqual(mindRes.event.qualifiesForMastery, true);
  });

  // Rule 6: Good and Easy count toward mastery only when method success criteria are met
  it('Rule 6: Difficult and Again never qualify for mastery, Good and Easy do when verified', () => {
    const diffRes = RevisionEngine.evaluateReview({
      questionId: 'diff-q',
      method: 'HAND',
      rating: 'DIFFICULT',
      durationSec: 200,
      solutionRevealed: false,
      now: baseDate,
    });
    assert.strictEqual(diffRes.event.qualifiesForMastery, false);

    const goodRes = RevisionEngine.evaluateReview({
      questionId: 'good-q',
      method: 'HAND',
      rating: 'GOOD',
      durationSec: 200,
      solutionRevealed: false,
      now: baseDate,
    });
    assert.strictEqual(goodRes.event.qualifiesForMastery, true);
  });

  // Rule 7: Mastery requires 5 qualifying successful reviews and >= 1 long interval review
  it('Rule 7: Mastery requires 5 qualifying reviews and >= 1 review after long interval (>=14d)', () => {
    let rec: QuestionRevisionRecord | undefined;
    let curr = new Date(baseDate);

    for (let i = 0; i < 4; i++) {
      const res = RevisionEngine.evaluateReview({
        questionId: 'q-mastery-strict',
        method: 'IDE',
        rating: 'GOOD',
        durationSec: 300,
        solutionRevealed: false,
        currentRecord: rec,
        now: curr,
      });
      rec = res.nextRecord;
      curr = new Date(rec.nextReviewDate);
    }
    // 4 reviews: not yet mastered
    assert.strictEqual(rec!.isMastered, false);

    // 5th review
    const res5 = RevisionEngine.evaluateReview({
      questionId: 'q-mastery-strict',
      method: 'IDE',
      rating: 'GOOD',
      durationSec: 300,
      solutionRevealed: false,
      currentRecord: rec,
      now: curr,
    });
    assert.strictEqual(res5.nextRecord.isMastered, true);
    assert.strictEqual(res5.derivedState, 'MASTERED');
  });

  // Rule 8: Snooze, skip, question opening, and solution viewing do not count as successful reviews
  it('Rule 8: Snooze, skip, and question opening do not increment review counts or advance mastery', () => {
    const record: QuestionRevisionRecord = {
      questionId: 'q-snooze',
      repetitionCount: 2,
      consecutiveSuccessCount: 2,
      intervalDays: 7,
      easeFactor: 2.5,
      lastReviewDate: baseDate,
      nextReviewDate: new Date(2026, 9, 29),
      isMastered: false,
      masteredAt: null,
      hasPassedLongInterval: false,
      history: [],
    };

    // Snooze
    const snoozed = RevisionEngine.snooze(record, 2, baseDate);
    assert.strictEqual(snoozed.repetitionCount, 2);
    assert.strictEqual(snoozed.consecutiveSuccessCount, 2);
    assert.strictEqual(snoozed.isMastered, false);
    assert.strictEqual(snoozed.nextReviewDate.getDate(), baseDate.getDate() + 2);

    // Skip
    const skipped = RevisionEngine.skip(record);
    assert.strictEqual(skipped.repetitionCount, 2);

    // Question Opened
    const opened = RevisionEngine.recordQuestionOpened(record);
    assert.strictEqual(opened.countsAsReview, false);
  });

  // Rule 9: Solution exposure is recorded independently from hint exposure
  it('Rule 9: Solution exposure is recorded independently and revokes mastery credit', () => {
    const withHintsOnly = RevisionEngine.evaluateReview({
      questionId: 'hints-only',
      method: 'IDE',
      rating: 'GOOD',
      durationSec: 300,
      solutionRevealed: false,
      hintsUsedCount: 3,
      now: baseDate,
    });
    assert.strictEqual(withHintsOnly.event.hintsUsedCount, 3);
    assert.strictEqual(withHintsOnly.event.solutionRevealed, false);
    assert.strictEqual(withHintsOnly.event.qualifiesForMastery, true);

    const withSolution = RevisionEngine.evaluateReview({
      questionId: 'solution-seen',
      method: 'IDE',
      rating: 'GOOD',
      durationSec: 300,
      solutionRevealed: true,
      hintsUsedCount: 5,
      now: baseDate,
    });
    assert.strictEqual(withSolution.event.solutionRevealed, true);
    assert.strictEqual(withSolution.event.qualifiesForMastery, false);
  });

  // Rule 10: Subsequent independent solve after solution exposure can earn agreed partial credit
  it('Rule 10: Subsequent independent solve after solution exposure earns partial credit', () => {
    // 1. Solution exposed session
    const step1 = RevisionEngine.evaluateReview({
      questionId: 'post-expose',
      method: 'IDE',
      rating: 'GOOD',
      durationSec: 300,
      solutionRevealed: true,
      now: baseDate,
    });
    assert.strictEqual(step1.nextRecord.intervalDays, 2);

    // 2. Subsequent independent solve
    const step2 = RevisionEngine.evaluateReview({
      questionId: 'post-expose',
      method: 'IDE',
      rating: 'GOOD',
      durationSec: 300,
      solutionRevealed: false, // Independent!
      currentRecord: step1.nextRecord,
      now: step1.nextRecord.nextReviewDate,
    });
    assert.strictEqual(step2.event.isPostAssistedFollowUp, true);
    assert.ok(step2.nextRecord.intervalDays >= 2);
    // Partial credit: does not prematurely advance to long interval mastery
    assert.strictEqual(step2.event.qualifiesForMastery, false);
  });

  // Rule 11: Submission acceptance alone does not grant mastery
  it('Rule 11: Single accepted submission alone does not grant mastery', () => {
    const res = RevisionEngine.evaluateReview({
      questionId: 'first-accepted',
      method: 'IDE',
      rating: 'EASY',
      durationSec: 150,
      solutionRevealed: false,
      passedVerification: true,
      now: baseDate,
    });
    assert.strictEqual(res.nextRecord.repetitionCount, 1);
    assert.strictEqual(res.nextRecord.isMastered, false);
  });

  // Rule 12: Later failed review returns mastered question to active review without deleting history
  it('Rule 12: Failed review moves mastered question back to active review preserving history', () => {
    const masteredRecord: Partial<QuestionRevisionRecord> = {
      repetitionCount: 6,
      consecutiveSuccessCount: 6,
      intervalDays: 45,
      isMastered: true,
      masteredAt: new Date(2026, 8, 1),
      history: [
        {
          id: 'ev-mastered',
          questionId: 'q-demaster',
          timestamp: new Date(2026, 8, 1),
          method: 'IDE',
          rating: 'GOOD',
          intervalDays: 45,
          solutionRevealed: false,
          hintsUsedCount: 0,
          passedVerification: true,
          durationSec: 200,
          qualifiesForMastery: true,
        },
      ],
    };

    const fail = RevisionEngine.evaluateReview({
      questionId: 'q-demaster',
      method: 'IDE',
      rating: 'AGAIN',
      durationSec: 300,
      solutionRevealed: false,
      currentRecord: masteredRecord,
      now: baseDate,
    });

    assert.strictEqual(fail.nextRecord.isMastered, false);
    assert.strictEqual(fail.nextRecord.intervalDays, 1);
    assert.strictEqual(fail.nextRecord.history.length, 2);
  });

  // Rule 13: Overdue questions appear before today's questions, upcoming are opt-in
  it('Rule 13: sortRevisionQueue orders overdue first, then due today, then by streak', () => {
    const items = [
      { id: 'due-today', nextReviewDate: baseDate, consecutiveSuccessCount: 2 },
      { id: 'overdue-3d', nextReviewDate: new Date(2026, 9, 19), consecutiveSuccessCount: 3 },
      { id: 'overdue-1d', nextReviewDate: new Date(2026, 9, 21), consecutiveSuccessCount: 1 },
      { id: 'upcoming', nextReviewDate: new Date(2026, 9, 25), consecutiveSuccessCount: 2 },
    ];

    const sorted = RevisionEngine.sortRevisionQueue(items, baseDate);
    assert.strictEqual(sorted[0].id, 'overdue-3d');
    assert.strictEqual(sorted[1].id, 'overdue-1d');
    assert.strictEqual(sorted[2].id, 'due-today');
    assert.strictEqual(sorted[3].id, 'upcoming');
  });

  // Rule 14: Daily targets do not hide other due questions
  it('Rule 14: Daily target represents a recommendation and queue retains all due items', () => {
    const allDueItems = Array.from({ length: 25 }, (_, i) => ({
      id: `due-${i}`,
      nextReviewDate: baseDate,
    }));
    const sorted = RevisionEngine.sortRevisionQueue(allDueItems, baseDate);
    assert.strictEqual(sorted.length, 25);
  });

  // Rule 15: Dates calculated correctly around local midnight and time-zone boundaries
  it('Rule 15: Next review dates are aligned to midnight (00:00:00.000)', () => {
    const res = RevisionEngine.evaluateReview({
      questionId: 'midnight-test',
      method: 'IDE',
      rating: 'GOOD',
      durationSec: 120,
      solutionRevealed: false,
      now: new Date(2026, 9, 22, 23, 59, 59), // 1 second before midnight
    });

    const nextDate = res.nextRecord.nextReviewDate;
    assert.strictEqual(nextDate.getHours(), 0);
    assert.strictEqual(nextDate.getMinutes(), 0);
    assert.strictEqual(nextDate.getSeconds(), 0);
    assert.strictEqual(nextDate.getMilliseconds(), 0);
    // Interval of 4 days added to Oct 22 gives Oct 26
    assert.strictEqual(nextDate.getDate(), 26);
  });
});
