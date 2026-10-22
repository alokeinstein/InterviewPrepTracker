import { prisma } from '@/lib/prisma';
import { ItemType, PracticeMode, Difficulty } from '@prisma/client';
import { RevisionEngine, RecallRating } from './revisionEngine';

export interface SM2Result {
  repetitionNumber: number;
  intervalDays: number;
  easeFactor: number;
  nextReviewDate: Date;
}

export interface ProgressiveCadenceResult {
  currentStage: number;
  intervalDays: number;
  nextReviewDate: Date;
  recommendedMode: PracticeMode;
}

export interface PracticeLogInput {
  userId: string;
  problemId: string;
  mode: PracticeMode;
  struggled?: boolean;
  notes?: string;
  qualityScore?: number;
  durationSec?: number;
  optimalityScore?: number;
}

export class SpacedRepetitionService {
  /**
   * Calculates new SM-2 spaced repetition parameters based on recall performance.
   */
  static calculateSM2(
    quality: number,
    repetitions: number,
    prevInterval: number,
    prevEaseFactor: number
  ): SM2Result {
    let newEaseFactor =
      prevEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (newEaseFactor < 1.3) newEaseFactor = 1.3;

    let newRepetitions: number;
    let newInterval: number;

    if (quality < 3) {
      newRepetitions = 0;
      newInterval = 1;
    } else {
      newRepetitions = repetitions + 1;
      if (newRepetitions === 1) {
        newInterval = 1;
      } else if (newRepetitions === 2) {
        newInterval = quality === 5 ? 6 : 3;
      } else {
        newInterval = Math.round(prevInterval * newEaseFactor);
      }
    }

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);
    nextReviewDate.setHours(0, 0, 0, 0);

    return {
      repetitionNumber: newRepetitions,
      intervalDays: newInterval,
      easeFactor: Number(newEaseFactor.toFixed(2)),
      nextReviewDate,
    };
  }

  /**
   * Spaced-Repetition State Machine Cadence:
   * Stage 0 (Unseen): Initial solve in IDE.
   * Stage 1 (1st Solve Completed): Schedule Revision 1 after +1 to 3 days. Recommended Mode = Solve by Hand.
   * Stage 2 (2nd Practice Completed - By Hand / Code): Schedule Revision 2 after +7 days (1 week). Recommended Mode = By Hand (Med/Hard) or Mental Solve (Easy).
   * Stage 3 (3rd+ Practice Completed - Mental Solve): Expanding intervals (+14 days, +30 days). Recommended Mode = Look & Solve in Mind.
   * Difficulty / Struggle Override: If marked "Struggled" or needed Hint 5, reset interval to +1 day and force mode back to Code in IDE or Solve by Hand.
   */
  static calculateProgressiveCadence(
    currentStage: number,
    difficulty: Difficulty = 'MEDIUM',
    struggled: boolean = false,
    optimalityScore: number = 100
  ): ProgressiveCadenceResult {
    const now = new Date();

    if (struggled) {
      // Struggle override: Reset to +1 day, recommend Code or Hand solve
      const nextReviewDate = new Date(now);
      nextReviewDate.setDate(nextReviewDate.getDate() + 1);
      nextReviewDate.setHours(0, 0, 0, 0);

      return {
        currentStage: Math.max(1, currentStage),
        intervalDays: 1,
        nextReviewDate,
        recommendedMode: currentStage === 0 ? 'CODE' : 'HAND',
      };
    }

    let nextStage = currentStage + 1;
    let intervalDays = 1;
    let recommendedMode: PracticeMode = 'CODE';

    if (nextStage === 1) {
      // 1st solve completed -> Stage 1
      // Easy = 3 days, Medium = 2 days, Hard = 1 day (or sub-optimal < 75% = 1 day)
      if (difficulty === 'EASY' && optimalityScore >= 75) {
        intervalDays = 3;
      } else if (difficulty === 'MEDIUM' && optimalityScore >= 75) {
        intervalDays = 2;
      } else {
        intervalDays = 1;
      }
      recommendedMode = 'HAND'; // Next: Solve by Hand
    } else if (nextStage === 2) {
      // 2nd practice completed -> Stage 2
      intervalDays = 7; // 1 week
      recommendedMode = difficulty === 'EASY' ? 'MENTAL' : 'HAND';
    } else if (nextStage === 3) {
      // 3rd practice completed -> Stage 3
      intervalDays = 14; // 2 weeks
      recommendedMode = 'MENTAL';
    } else {
      // 4th+ practice completed -> Stage 4+
      intervalDays = 30; // 1 month
      recommendedMode = 'MENTAL';
    }

    const nextReviewDate = new Date(now);
    nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays);
    nextReviewDate.setHours(0, 0, 0, 0);

    return {
      currentStage: nextStage,
      intervalDays,
      nextReviewDate,
      recommendedMode,
    };
  }

  /**
   * Records a multi-modal practice attempt (IDE, Hand, Mental) and persists telemetry.
   */
  static async recordPractice(input: PracticeLogInput) {
    const { userId, problemId, mode, struggled = false, notes, durationSec = 60, optimalityScore = 100 } = input;

    // 1. Fetch problem metadata
    const problem = await prisma.dsaProblem.findUnique({
      where: { id: problemId },
      select: { id: true, difficulty: true, level: true, title: true },
    });
    if (!problem) throw new Error(`Problem with ID ${problemId} not found.`);

    // 2. Find or create existing RevisionItem for this problem
    let revisionItem = await prisma.revisionItem.findFirst({
      where: {
        userId,
        dsaProblemId: problem.id,
      },
    });

    const currentStage = revisionItem?.currentStage ?? 0;
    const cadence = this.calculateProgressiveCadence(
      currentStage,
      problem.difficulty,
      struggled,
      optimalityScore
    );

    const qualityScore = input.qualityScore ?? (struggled ? 2 : 4);
    const mappedRating: RecallRating =
      qualityScore <= 1 ? 'AGAIN' : qualityScore <= 2 ? 'DIFFICULT' : qualityScore <= 4 ? 'GOOD' : 'EASY';

    const revEval = RevisionEngine.evaluateReview({
      questionId: problem.id,
      method: mode === 'CODE' ? 'IDE' : mode === 'HAND' ? 'HAND' : 'MENTAL',
      rating: mappedRating,
      durationSec,
      solutionRevealed: Boolean(struggled && optimalityScore < 80),
      notes,
      currentRecord: revisionItem
        ? {
            questionId: problem.id,
            repetitionCount: revisionItem.repetitionNumber,
            consecutiveSuccessCount: revisionItem.repetitionNumber,
            intervalDays: revisionItem.intervalDays,
            easeFactor: revisionItem.easeFactor,
            lastReviewDate: revisionItem.lastReviewDate,
            nextReviewDate: revisionItem.nextReviewDate,
            isMastered: revisionItem.repetitionNumber >= 5 && revisionItem.intervalDays >= 14,
            masteredAt: null,
            hasPassedLongInterval: revisionItem.intervalDays >= 14,
            history: [],
          }
        : null,
    });

    const finalInterval = revEval.nextRecord.intervalDays;
    const finalNextReview = revEval.nextRecord.nextReviewDate;
    const finalEase = revEval.nextRecord.easeFactor;

    if (!revisionItem) {
      revisionItem = await prisma.revisionItem.create({
        data: {
          userId,
          itemType: ItemType.DSA_PROBLEM,
          dsaProblemId: problem.id,
          repetitionNumber: 1,
          intervalDays: finalInterval,
          easeFactor: finalEase,
          nextReviewDate: finalNextReview,
          lastReviewDate: new Date(),
          stabilityScore: Number((finalInterval / 30).toFixed(2)),
          codePracticeCount: mode === 'CODE' ? 1 : 0,
          handPracticeCount: mode === 'HAND' ? 1 : 0,
          mentalPracticeCount: mode === 'MENTAL' ? 1 : 0,
          recommendedMode: cadence.recommendedMode,
          currentStage: cadence.currentStage,
        },
      });
    } else {
      revisionItem = await prisma.revisionItem.update({
        where: { id: revisionItem.id },
        data: {
          repetitionNumber: revisionItem.repetitionNumber + 1,
          intervalDays: finalInterval,
          easeFactor: finalEase,
          nextReviewDate: finalNextReview,
          lastReviewDate: new Date(),
          stabilityScore: Number((finalInterval / 30).toFixed(2)),
          codePracticeCount: mode === 'CODE' ? revisionItem.codePracticeCount + 1 : revisionItem.codePracticeCount,
          handPracticeCount: mode === 'HAND' ? revisionItem.handPracticeCount + 1 : revisionItem.handPracticeCount,
          mentalPracticeCount: mode === 'MENTAL' ? revisionItem.mentalPracticeCount + 1 : revisionItem.mentalPracticeCount,
          recommendedMode: cadence.recommendedMode,
          currentStage: cadence.currentStage,
        },
      });
    }

    // 3. Log RevisionAttempt
    const attempt = await prisma.revisionAttempt.create({
      data: {
        revisionItemId: revisionItem.id,
        qualityScore,
        mode,
        struggled,
        notes: notes || null,
        recalledInvariants: !struggled,
        durationSec,
      },
    });

    return {
      revisionItem,
      attempt,
      cadence,
    };
  }

  /**
   * Records a user's revision attempt and updates the item's schedule.
   */
  static async recordAttempt(
    revisionItemId: string,
    qualityScore: number,
    durationSec: number = 60,
    recalledInvariants: boolean = true
  ) {
    const item = await prisma.revisionItem.findUnique({
      where: { id: revisionItemId },
    });
    if (!item) throw new Error('Revision item not found');

    const nextSM2 = this.calculateSM2(
      qualityScore,
      item.repetitionNumber,
      item.intervalDays,
      item.easeFactor
    );

    return await prisma.$transaction([
      prisma.revisionAttempt.create({
        data: {
          revisionItemId: item.id,
          qualityScore,
          durationSec,
          recalledInvariants,
        },
      }),
      prisma.revisionItem.update({
        where: { id: item.id },
        data: {
          repetitionNumber: nextSM2.repetitionNumber,
          intervalDays: nextSM2.intervalDays,
          easeFactor: nextSM2.easeFactor,
          nextReviewDate: nextSM2.nextReviewDate,
          lastReviewDate: new Date(),
          stabilityScore: Number((nextSM2.intervalDays / 30).toFixed(2)),
        },
      }),
    ]);
  }

  /**
   * Retrieves all items due for revision on or before today for a given user.
   */
  static async getDueRevisions(userId: string) {
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    return await prisma.revisionItem.findMany({
      where: {
        userId,
        nextReviewDate: { lte: endOfToday },
      },
      include: {
        dsaProblem: {
          select: { id: true, title: true, slug: true, difficulty: true, topic: true, level: true, optimalTimeComplexity: true },
        },
        concept: {
          select: { id: true, name: true, slug: true, summary: true, whyItMatters: true, sourceRef: true },
        },
        mistake: {
          select: { id: true, violatedInvariant: true, category: true, correctiveAction: true },
        },
      },
      orderBy: { nextReviewDate: 'asc' },
    });
  }

  /**
   * Fetches practice telemetry for multiple problem IDs for a user.
   */
  static async getBatchTelemetry(userId: string, problemIds: string[]) {
    const items = await prisma.revisionItem.findMany({
      where: {
        userId,
        dsaProblemId: { in: problemIds },
      },
      include: {
        attempts: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const map = new Map<string, {
      totalPracticed: number;
      codeCount: number;
      handCount: number;
      mentalCount: number;
      lastPracticedAt: Date | null;
      nextReviewDate: Date | null;
      isDue: boolean;
      isOverdue: boolean;
      dueStatusText: string;
      currentStage: number;
      recommendedMode: PracticeMode;
    }>();

    for (const item of items) {
      if (!item.dsaProblemId) continue;
      const total = item.codePracticeCount + item.handPracticeCount + item.mentalPracticeCount;
      const reviewDate = new Date(item.nextReviewDate);
      reviewDate.setHours(0, 0, 0, 0);

      const diffTime = reviewDate.getTime() - startOfToday.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let dueStatusText = '';
      let isDue = false;
      let isOverdue = false;

      if (diffDays < 0) {
        isOverdue = true;
        dueStatusText = `Overdue by ${Math.abs(diffDays)}d`;
      } else if (diffDays === 0) {
        isDue = true;
        dueStatusText = 'Due Today';
      } else {
        dueStatusText = `Next: in ${diffDays}d`;
      }

      map.set(item.dsaProblemId, {
        totalPracticed: total,
        codeCount: item.codePracticeCount,
        handCount: item.handPracticeCount,
        mentalCount: item.mentalPracticeCount,
        lastPracticedAt: item.lastReviewDate,
        nextReviewDate: item.nextReviewDate,
        isDue,
        isOverdue,
        dueStatusText,
        currentStage: item.currentStage,
        recommendedMode: item.recommendedMode,
      });
    }

    return map;
  }
}
