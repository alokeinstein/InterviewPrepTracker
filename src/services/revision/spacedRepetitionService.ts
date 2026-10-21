import { prisma } from '@/lib/prisma';
import { ItemType } from '@prisma/client';

export interface SM2Result {
  repetitionNumber: number;
  intervalDays: number;
  easeFactor: number;
  nextReviewDate: Date;
}

export class SpacedRepetitionService {
  /**
   * Calculates new SM-2 spaced repetition parameters based on recall performance.
   * @param quality 0-5 (0: total blackout, 5: perfect instant recall)
   * @param repetitions Current repetition count
   * @param prevInterval Current interval in days
   * @param prevEaseFactor Current ease factor (default 2.5)
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
      // Failed recall: reset intervals back to immediate review
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
          select: { id: true, title: true, slug: true, difficulty: true, topic: true, optimalTimeComplexity: true },
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
}
