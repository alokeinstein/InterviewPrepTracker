import { test, describe } from 'node:test';
import assert from 'node:assert';
import { SpacedRepetitionService } from '../src/services/revision/spacedRepetitionService';
import { MasteryService } from '../src/services/learning/masteryService';
import { CodeExecutionService } from '../src/services/execution/codeExecutionService';
import { PrismaClient } from '@prisma/client';

describe('Spaced Repetition SM-2 Algorithm', () => {
  test('Quality 5 increases interval and repetition correctly', () => {
    const res = SpacedRepetitionService.calculateSM2(5, 0, 1, 2.5);
    assert.strictEqual(res.repetitionNumber, 1);
    assert.strictEqual(res.intervalDays, 1);
    assert.strictEqual(res.easeFactor, 2.6);

    const res2 = SpacedRepetitionService.calculateSM2(5, 1, 1, 2.6);
    assert.strictEqual(res2.repetitionNumber, 2);
    assert.strictEqual(res2.intervalDays, 6);
  });

  test('Quality < 3 resets interval to 1 and repetition to 0', () => {
    const res = SpacedRepetitionService.calculateSM2(2, 4, 14, 2.5);
    assert.strictEqual(res.repetitionNumber, 0);
    assert.strictEqual(res.intervalDays, 1);
  });
});

describe('Mastery Calculation', () => {
  test('Composite score applies correct dimension weights', () => {
    // 0.15*100 + 0.25*80 + 0.25*80 + 0.20*70 + 0.15*60 = 15 + 20 + 20 + 14 + 9 = 78
    const score = MasteryService.computeCompositeMastery({
      recognition: 100,
      understanding: 80,
      recall: 80,
      application: 70,
      interviewExplanation: 60,
    });
    assert.strictEqual(score, 78.0);
  });
});

describe('Code Execution Sandbox', () => {
  test('Valid Two Sum solution returns ACCEPTED', async () => {
    const code = `
      function solve(nums, target) {
        const map = new Map();
        for (let i = 0; i < nums.length; i++) {
          const diff = target - nums[i];
          if (map.has(diff)) return [map.get(diff), i];
          map.set(nums[i], i);
        }
        return [];
      }
    `;
    const testCases = [
      { input: '[2, 7, 11, 15], 9', expectedOutput: '[0, 1]' },
      { input: '[3, 2, 4], 6', expectedOutput: '[1, 2]' },
    ];
    const res = await CodeExecutionService.executeCode(code, 'javascript', testCases);
    assert.strictEqual(res.status, 'ACCEPTED');
    assert.strictEqual(res.testCasesPassed, 2);
  });

  test('Wrong answer returns WRONG_ANSWER and captures failure', async () => {
    const code = `
      function solve(nums, target) {
        return [0, 0];
      }
    `;
    const testCases = [{ input: '[2, 7, 11, 15], 9', expectedOutput: '[0, 1]' }];
    const res = await CodeExecutionService.executeCode(code, 'javascript', testCases);
    assert.strictEqual(res.status, 'WRONG_ANSWER');
    assert.strictEqual(res.testCasesPassed, 0);
    assert.ok(res.failedTestCase);
  });
});

describe('Database Grounding & Source Integrity', () => {
  const prisma = new PrismaClient();

  test('All 11 DDIA chapters are stored in PostgreSQL', async () => {
    const chapterCount = await prisma.chapter.count();
    assert.strictEqual(chapterCount, 11);
  });

  test('All 500 DSA problems are loaded in PostgreSQL', async () => {
    const problemCount = await prisma.dsaProblem.count();
    assert.strictEqual(problemCount, 500);
  });

  test('All 23 DSA Patterns are indexed in PostgreSQL', async () => {
    const patternCount = await prisma.dsaPattern.count();
    assert.strictEqual(patternCount, 23);
    await prisma.$disconnect();
  });
});
