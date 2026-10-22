import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  RevisionEngine,
  DEFAULT_REVISION_CONFIG,
  QuestionRevisionRecord,
} from '../src/services/revision/revisionEngine';

describe('RevisionEngine (Adaptive DSA Spaced Repetition)', () => {
  const baseDate = new Date(2026, 9, 22, 10, 0, 0); // Oct 22, 2026

  it('schedules initial reviews according to configurable defaults', () => {
    // 1. Again -> 1 day
    const againRes = RevisionEngine.evaluateReview({
      questionId: 'prob-1',
      method: 'IDE',
      rating: 'AGAIN',
      durationSec: 120,
      solutionRevealed: false,
      now: baseDate,
    });
    assert.strictEqual(againRes.nextRecord.intervalDays, 1);
    assert.strictEqual(againRes.derivedState, 'LEARNING');

    // 2. Difficult -> 2 days
    const diffRes = RevisionEngine.evaluateReview({
      questionId: 'prob-1',
      method: 'HAND',
      rating: 'DIFFICULT',
      durationSec: 300,
      solutionRevealed: false,
      now: baseDate,
    });
    assert.strictEqual(diffRes.nextRecord.intervalDays, 2);

    // 3. Good -> 4 days
    const goodRes = RevisionEngine.evaluateReview({
      questionId: 'prob-1',
      method: 'IDE',
      rating: 'GOOD',
      durationSec: 400,
      solutionRevealed: false,
      now: baseDate,
    });
    assert.strictEqual(goodRes.nextRecord.intervalDays, 4);

    // 4. Easy -> 7 days
    const easyRes = RevisionEngine.evaluateReview({
      questionId: 'prob-1',
      method: 'MENTAL',
      rating: 'EASY',
      durationSec: 90,
      solutionRevealed: false,
      now: baseDate,
    });
    assert.strictEqual(easyRes.nextRecord.intervalDays, 7);
  });

  it('penalizes solution exposure and does not grant independent mastery credit', () => {
    const revealedRes = RevisionEngine.evaluateReview({
      questionId: 'prob-2',
      method: 'IDE',
      rating: 'EASY',
      durationSec: 300,
      solutionRevealed: true, // User viewed Hint 5 reference solution!
      now: baseDate,
    });

    // Initial interval capped due to solution reveal
    assert.ok(revealedRes.nextRecord.intervalDays <= 2);
    assert.strictEqual(revealedRes.event.solutionRevealed, true);
    assert.strictEqual(revealedRes.event.qualifiesForMastery, false);
  });

  it('resets interval and streak on failed recall (AGAIN)', () => {
    // Simulate question with prior successful reviews and 14 day interval
    const mockPrior: Partial<QuestionRevisionRecord> = {
      repetitionCount: 3,
      consecutiveSuccessCount: 3,
      intervalDays: 14,
      easeFactor: 2.5,
      lastReviewDate: new Date(2026, 9, 8),
      nextReviewDate: baseDate,
      isMastered: false,
      hasPassedLongInterval: false,
      history: [],
    };

    const failRes = RevisionEngine.evaluateReview({
      questionId: 'prob-3',
      method: 'IDE',
      rating: 'AGAIN',
      durationSec: 250,
      solutionRevealed: false,
      currentRecord: mockPrior,
      now: baseDate,
    });

    assert.strictEqual(failRes.nextRecord.intervalDays, 1);
    assert.strictEqual(failRes.nextRecord.consecutiveSuccessCount, 0);
    assert.strictEqual(failRes.nextRecord.repetitionCount, 4);
    assert.ok(failRes.nextRecord.easeFactor < 2.5);
  });

  it('progresses to MASTERED only after 5 qualifying reviews and at least one long interval', () => {
    let currentRecord: QuestionRevisionRecord | undefined;
    let currentDate = new Date(baseDate);

    // Run 4 successful reviews with expanding intervals
    const ratings = ['GOOD', 'GOOD', 'EASY', 'GOOD'] as const;
    for (let i = 0; i < ratings.length; i++) {
      const res = RevisionEngine.evaluateReview({
        questionId: 'prob-mastery',
        method: i % 2 === 0 ? 'IDE' : 'MENTAL',
        rating: ratings[i],
        durationSec: 300,
        solutionRevealed: false,
        currentRecord,
        now: currentDate,
      });
      currentRecord = res.nextRecord;
      currentDate = new Date(currentRecord.nextReviewDate);
    }

    // 4 reviews: should NOT be mastered yet
    assert.strictEqual(currentRecord!.isMastered, false);
    assert.strictEqual(currentRecord!.repetitionCount, 4);

    // Make sure interval has grown to >= 14 days
    assert.ok(currentRecord!.intervalDays >= 14);

    // 5th review: qualifies for mastery!
    const finalRes = RevisionEngine.evaluateReview({
      questionId: 'prob-mastery',
      method: 'HAND',
      rating: 'GOOD',
      durationSec: 200,
      solutionRevealed: false,
      currentRecord,
      now: currentDate,
    });

    assert.strictEqual(finalRes.nextRecord.isMastered, true);
    assert.strictEqual(finalRes.derivedState, 'MASTERED');
    assert.ok(finalRes.nextRecord.masteredAt !== null);
  });

  it('correctly derives states: DUE, OVERDUE, LEARNING, REVIEWING', () => {
    const today = new Date(2026, 9, 22);

    // Overdue by 2 days
    const overdueState = RevisionEngine.computeState(
      {
        lastReviewDate: new Date(2026, 9, 15),
        nextReviewDate: new Date(2026, 9, 20),
        consecutiveSuccessCount: 3,
        isMastered: false,
      },
      today
    );
    assert.strictEqual(overdueState, 'OVERDUE');

    // Due today
    const dueState = RevisionEngine.computeState(
      {
        lastReviewDate: new Date(2026, 9, 18),
        nextReviewDate: today,
        consecutiveSuccessCount: 2,
        isMastered: false,
      },
      today
    );
    assert.strictEqual(dueState, 'DUE');

    // Future date with 1 success: LEARNING
    const learningState = RevisionEngine.computeState(
      {
        lastReviewDate: today,
        nextReviewDate: new Date(2026, 9, 24),
        consecutiveSuccessCount: 1,
        isMastered: false,
      },
      today
    );
    assert.strictEqual(learningState, 'LEARNING');

    // Future date with 3 successes: REVIEWING
    const reviewingState = RevisionEngine.computeState(
      {
        lastReviewDate: today,
        nextReviewDate: new Date(2026, 9, 28),
        consecutiveSuccessCount: 3,
        isMastered: false,
      },
      today
    );
    assert.strictEqual(reviewingState, 'REVIEWING');
  });
});
