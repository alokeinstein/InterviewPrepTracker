/**
 * Adaptive DSA Revision Engine
 * Pure, deterministic spaced repetition scheduler supporting SM-2 + progressive intervals,
 * multi-modal practice tracking (IDE, By Hand, In Mind), solution exposure penalties,
 * independent partial credit, snooze/skip handling, and 5-review mastery policy.
 */

export type RecallRating = 'AGAIN' | 'DIFFICULT' | 'GOOD' | 'EASY';
export type PracticeMethod = 'IDE' | 'HAND' | 'MENTAL';
export type RevisionState = 'NEW' | 'LEARNING' | 'REVIEWING' | 'MASTERED' | 'DUE' | 'OVERDUE';

export interface RevisionConfig {
  initialIntervals: Record<RecallRating, number>; // in days: AGAIN=1, DIFFICULT=2, GOOD=4, EASY=7
  minEaseFactor: number; // default 1.3
  defaultEaseFactor: number; // default 2.5
  difficultMultiplier: number; // default 1.2
  easyMultiplier: number; // default 1.3
  longIntervalThresholdDays: number; // default 14
  requiredMasteryReviews: number; // default 5
  maxIntervalDays: number; // default 180
  partialCreditMultiplier: number; // default 1.25 for independent follow-up after exposure
}

export const DEFAULT_REVISION_CONFIG: RevisionConfig = {
  initialIntervals: {
    AGAIN: 1,
    DIFFICULT: 2,
    GOOD: 4,
    EASY: 7,
  },
  minEaseFactor: 1.3,
  defaultEaseFactor: 2.5,
  difficultMultiplier: 1.2,
  easyMultiplier: 1.3,
  longIntervalThresholdDays: 14,
  requiredMasteryReviews: 5,
  maxIntervalDays: 180,
  partialCreditMultiplier: 1.25,
};

export interface QuestionRevisionRecord {
  questionId: string;
  repetitionCount: number; // Total completed review sessions
  consecutiveSuccessCount: number; // Streak of Good/Easy reviews without Again
  intervalDays: number;
  easeFactor: number;
  lastReviewDate: Date | null;
  nextReviewDate: Date;
  isMastered: boolean;
  masteredAt: Date | null;
  hasPassedLongInterval: boolean;
  history: RevisionEventRecord[];
}

export interface RevisionEventRecord {
  id: string;
  questionId: string;
  timestamp: Date;
  method: PracticeMethod;
  rating: RecallRating;
  intervalDays: number;
  solutionRevealed: boolean;
  hintsUsedCount: number;
  passedVerification: boolean; // IDE passed tests, or Hand/Mental self-verified
  durationSec: number;
  notes?: string;
  qualifiesForMastery: boolean;
  isPostAssistedFollowUp?: boolean;
}

export interface EvaluateReviewInput {
  questionId: string;
  method: PracticeMethod;
  rating: RecallRating;
  durationSec: number;
  solutionRevealed: boolean;
  hintsUsedCount?: number;
  passedVerification?: boolean;
  notes?: string;
  currentRecord?: Partial<QuestionRevisionRecord> | null;
  now?: Date;
  config?: RevisionConfig;
}

export interface EvaluateReviewResult {
  nextRecord: QuestionRevisionRecord;
  event: RevisionEventRecord;
  derivedState: RevisionState;
  cadenceDescription: string;
}

export class RevisionEngine {
  /**
   * Evaluates a review attempt and computes the new deterministic schedule state.
   */
  static evaluateReview(input: EvaluateReviewInput): EvaluateReviewResult {
    const config = input.config || DEFAULT_REVISION_CONFIG;
    const now = input.now ? new Date(input.now) : new Date();
    const hintsCount = input.hintsUsedCount || 0;
    
    // Method-specific verification:
    // IDE requires an actual attempt and passing tests (passedVerification === true)
    // By Hand & In Mind allow user-reported verification (passedVerification !== false)
    const passed = input.passedVerification !== false;

    const prevRepetition = input.currentRecord?.repetitionCount ?? 0;
    const prevStreak = input.currentRecord?.consecutiveSuccessCount ?? 0;
    const prevInterval = input.currentRecord?.intervalDays ?? 0;
    const prevEase = input.currentRecord?.easeFactor ?? config.defaultEaseFactor;
    const prevMastered = Boolean(input.currentRecord?.isMastered);
    const prevPassedLongInterval = Boolean(input.currentRecord?.hasPassedLongInterval);
    const prevHistory = input.currentRecord?.history ? [...input.currentRecord.history] : [];

    // Check if the previous session was assisted (solution viewed)
    const lastSession = prevHistory.length > 0 ? prevHistory[prevHistory.length - 1] : null;
    const wasPriorAssisted = lastSession ? lastSession.solutionRevealed : false;
    const isIndependentFollowUp = wasPriorAssisted && !input.solutionRevealed && passed;

    // Check if this review qualifies toward mastery:
    // 1. Rating must be GOOD or EASY
    // 2. No solution revealed on this review session (must be independent recall)
    // 3. Must satisfy method verification criteria (e.g. IDE code ran and passed, Hand/Mental reported correct)
    // 4. Must not be immediately following a solution-assisted attempt without completing an unassisted interval
    const isSuccess = input.rating === 'GOOD' || input.rating === 'EASY';
    const qualifiesForMastery = isSuccess && !input.solutionRevealed && passed && !isIndependentFollowUp;

    let newStreak = isSuccess ? prevStreak + 1 : 0;
    let newRepetition = prevRepetition + 1;
    let newEase = prevEase;
    let newInterval: number;

    if (input.rating === 'AGAIN') {
      newEase = Math.max(config.minEaseFactor, prevEase - 0.2);
      newInterval = config.initialIntervals.AGAIN; // Reset to ~1 day without deleting history
    } else if (prevStreak === 0 || prevInterval === 0) {
      // First review or immediately after a reset
      newInterval = config.initialIntervals[input.rating];
      if (input.solutionRevealed) {
        // Solution exposure penalty: cap initial interval at 1 or 2 days
        newInterval = Math.min(newInterval, 2);
      }
    } else if (isIndependentFollowUp) {
      // Rule 10: Subsequent independent solve after solution exposure earns partial credit
      newInterval = Math.max(2, Math.round(prevInterval * config.partialCreditMultiplier));
    } else {
      // Subsequent progressive reviews
      if (input.rating === 'DIFFICULT') {
        newEase = Math.max(config.minEaseFactor, prevEase - 0.15);
        newInterval = Math.max(
          config.initialIntervals.DIFFICULT,
          Math.round(prevInterval * config.difficultMultiplier)
        );
      } else if (input.rating === 'GOOD') {
        newInterval = Math.round(prevInterval * prevEase);
      } else {
        // EASY
        newEase = Math.min(3.5, prevEase + 0.15);
        newInterval = Math.round(prevInterval * prevEase * config.easyMultiplier);
      }

      // Penalty if solution was viewed in this session
      if (input.solutionRevealed) {
        newInterval = Math.min(newInterval, Math.max(2, Math.round(prevInterval * 0.75)));
      }
    }

    // Cap interval
    newInterval = Math.min(config.maxIntervalDays, Math.max(1, newInterval));

    // Rule 15: Safe date calculation aligned to local midnight (00:00:00)
    const nextReviewDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + newInterval,
      0,
      0,
      0,
      0
    );

    // Track if a review successfully occurred after long interval (>= 14 days)
    const hadLongInterval = prevInterval >= config.longIntervalThresholdDays;
    const hasPassedLongInterval =
      prevPassedLongInterval ||
      (hadLongInterval && isSuccess && !input.solutionRevealed && !isIndependentFollowUp);

    // Mastery policy check (Rule 6, 7, 11):
    // 5 qualifying successful reviews (Good/Easy), at least 1 after long interval, not solution-assisted
    const totalQualifyingReviews =
      prevHistory.filter((h) => h.qualifiesForMastery).length + (qualifiesForMastery ? 1 : 0);
    const meetsMastery =
      totalQualifyingReviews >= config.requiredMasteryReviews &&
      hasPassedLongInterval &&
      !input.solutionRevealed &&
      isSuccess &&
      !isIndependentFollowUp;

    let isMastered = prevMastered;
    let masteredAt = input.currentRecord?.masteredAt || null;

    if (meetsMastery && !prevMastered) {
      isMastered = true;
      masteredAt = now;
    } else if (input.rating === 'AGAIN' && prevMastered) {
      // Rule 12: A later failed review can return a mastered question to active review without deleting its history
      isMastered = false;
    }

    const eventId = `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const event: RevisionEventRecord = {
      id: eventId,
      questionId: input.questionId,
      timestamp: now,
      method: input.method,
      rating: input.rating,
      intervalDays: newInterval,
      solutionRevealed: input.solutionRevealed,
      hintsUsedCount: hintsCount,
      passedVerification: passed,
      durationSec: input.durationSec,
      notes: input.notes,
      qualifiesForMastery,
      isPostAssistedFollowUp: isIndependentFollowUp,
    };

    const nextRecord: QuestionRevisionRecord = {
      questionId: input.questionId,
      repetitionCount: newRepetition,
      consecutiveSuccessCount: newStreak,
      intervalDays: newInterval,
      easeFactor: Number(newEase.toFixed(2)),
      lastReviewDate: now,
      nextReviewDate,
      isMastered,
      masteredAt,
      hasPassedLongInterval,
      history: [...prevHistory, event],
    };

    const derivedState = this.computeState(nextRecord, now);

    const cadenceDescription = `Scheduled next review in ${newInterval} day${newInterval === 1 ? '' : 's'} (${nextReviewDate.toLocaleDateString()}). Ease factor: ${nextRecord.easeFactor}.`;

    return {
      nextRecord,
      event,
      derivedState,
      cadenceDescription,
    };
  }

  /**
   * Rule 8: Snoozes a question by postponing nextReviewDate without incrementing repetition count,
   * without incrementing consecutive successes, and without advancing mastery.
   */
  static snooze(
    currentRecord: QuestionRevisionRecord,
    days: number = 1,
    now: Date = new Date()
  ): QuestionRevisionRecord {
    const nextReviewDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + Math.max(1, days),
      0,
      0,
      0,
      0
    );

    return {
      ...currentRecord,
      nextReviewDate,
      // repetitionCount and consecutiveSuccessCount remain unchanged
    };
  }

  /**
   * Rule 8: Skips a question for now without changing review count, streak, or schedule.
   */
  static skip(currentRecord: QuestionRevisionRecord): QuestionRevisionRecord {
    return {
      ...currentRecord,
    };
  }

  /**
   * Rule 8: Simply opening a question does not count as a completed review.
   */
  static recordQuestionOpened(
    currentRecord: QuestionRevisionRecord | null | undefined
  ): { countsAsReview: false } {
    return { countsAsReview: false };
  }

  /**
   * Derives current operational state for a question based on its schedule and target date.
   */
  static computeState(record: Partial<QuestionRevisionRecord> | null, now: Date = new Date()): RevisionState {
    if (!record || !record.lastReviewDate) {
      return 'NEW';
    }

    if (record.isMastered) {
      return 'MASTERED';
    }

    const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const reviewDate = record.nextReviewDate ? new Date(record.nextReviewDate) : new Date();
    const reviewDateOnly = new Date(reviewDate.getFullYear(), reviewDate.getMonth(), reviewDate.getDate()).getTime();

    if (nowDateOnly > reviewDateOnly) {
      return 'OVERDUE';
    } else if (nowDateOnly === reviewDateOnly) {
      return 'DUE';
    } else if ((record.consecutiveSuccessCount ?? 0) < 2) {
      return 'LEARNING';
    } else {
      return 'REVIEWING';
    }
  }

  /**
   * Rule 13: Sorts questions in Revision Center:
   * 1. Overdue questions first (most overdue / oldest nextReviewDate first)
   * 2. Due today questions
   * 3. Prioritize lower streak or lower ease within comparable due status
   */
  static sortRevisionQueue<T extends { nextReviewDate: Date; consecutiveSuccessCount?: number; easeFactor?: number }>(
    items: T[],
    now: Date = new Date()
  ): T[] {
    const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    return [...items].sort((a, b) => {
      const aTime = new Date(a.nextReviewDate).getTime();
      const bTime = new Date(b.nextReviewDate).getTime();

      const aDueDiff = aTime - nowDateOnly;
      const bDueDiff = bTime - nowDateOnly;

      // Both overdue or both due: earlier date first
      if (aDueDiff !== bDueDiff) {
        return aDueDiff - bDueDiff;
      }

      // Tiebreaker: lower success count prioritized
      const aStreak = a.consecutiveSuccessCount ?? 0;
      const bStreak = b.consecutiveSuccessCount ?? 0;
      if (aStreak !== bStreak) {
        return aStreak - bStreak;
      }

      // Tiebreaker: lower ease factor
      const aEase = a.easeFactor ?? 2.5;
      const bEase = b.easeFactor ?? 2.5;
      return aEase - bEase;
    });
  }
}
