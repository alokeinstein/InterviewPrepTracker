import { test, describe } from 'node:test';
import assert from 'node:assert';
import { PrismaClient } from '@prisma/client';
import { CodeExecutionService } from '../src/services/execution/codeExecutionService';

const prisma = new PrismaClient();

describe('End-to-End Problem-Specific Execution Tests', () => {
  test('Two Sum (#1) executes with unique signature twoSum', async () => {
    const p = await prisma.dsaProblem.findUnique({
      where: { slug: 'two-sum' },
      include: { testCases: true },
    });
    assert.ok(p, 'Two sum must exist');
    assert.strictEqual(p.functionName, 'twoSum');

    const res = await CodeExecutionService.executeCode(
      p.optimalSolution || '',
      'javascript',
      p.testCases.map((tc) => ({ input: tc.input, expectedOutput: tc.expectedOutput })),
      { functionName: p.functionName, executionModel: p.executionModel as any }
    );
    assert.strictEqual(res.status, 'ACCEPTED');
    assert.strictEqual(res.testCasesPassed, p.testCases.length);
  });

  test('Valid Parentheses (#144) executes with unique signature isValid', async () => {
    const p = await prisma.dsaProblem.findUnique({
      where: { slug: 'valid-parentheses' },
      include: { testCases: true },
    });
    assert.ok(p, 'Valid parentheses must exist');
    assert.strictEqual(p.functionName, 'isValid');

    const res = await CodeExecutionService.executeCode(
      p.optimalSolution || '',
      'javascript',
      p.testCases.map((tc) => ({ input: tc.input, expectedOutput: tc.expectedOutput })),
      { functionName: p.functionName, executionModel: p.executionModel as any }
    );
    assert.strictEqual(res.status, 'ACCEPTED');
    assert.strictEqual(res.testCasesPassed, p.testCases.length);
  });

  test('Binary Search (#96) executes with unique signature search', async () => {
    const p = await prisma.dsaProblem.findUnique({
      where: { slug: 'binary-search' },
      include: { testCases: true },
    });
    assert.ok(p, 'Binary search must exist');
    assert.strictEqual(p.functionName, 'search');

    const res = await CodeExecutionService.executeCode(
      p.optimalSolution || '',
      'javascript',
      p.testCases.map((tc) => ({ input: tc.input, expectedOutput: tc.expectedOutput })),
      { functionName: p.functionName, executionModel: p.executionModel as any }
    );
    assert.strictEqual(res.status, 'ACCEPTED');
    assert.strictEqual(res.testCasesPassed, p.testCases.length);
  });

  test('Best Time to Buy and Sell Stock (#14) executes with unique signature maxProfit', async () => {
    const p = await prisma.dsaProblem.findUnique({
      where: { slug: 'best-time-to-buy-and-sell-stock' },
      include: { testCases: true },
    });
    assert.ok(p, 'Best time to buy and sell stock must exist');
    assert.strictEqual(p.functionName, 'maxProfit');

    const res = await CodeExecutionService.executeCode(
      p.optimalSolution || '',
      'javascript',
      p.testCases.map((tc) => ({ input: tc.input, expectedOutput: tc.expectedOutput })),
      { functionName: p.functionName, executionModel: p.executionModel as any }
    );
    assert.strictEqual(res.status, 'ACCEPTED');
    assert.strictEqual(res.testCasesPassed, p.testCases.length);
  });

  test('Climbing Stairs (#356) executes with unique signature climbStairs', async () => {
    const p = await prisma.dsaProblem.findUnique({
      where: { slug: 'climbing-stairs' },
      include: { testCases: true },
    });
    assert.ok(p, 'Climbing stairs must exist');
    assert.strictEqual(p.functionName, 'climbStairs');

    const res = await CodeExecutionService.executeCode(
      p.optimalSolution || '',
      'javascript',
      p.testCases.map((tc) => ({ input: tc.input, expectedOutput: tc.expectedOutput })),
      { functionName: p.functionName, executionModel: p.executionModel as any }
    );
    assert.strictEqual(res.status, 'ACCEPTED');
    assert.strictEqual(res.testCasesPassed, p.testCases.length);
  });

  test('Infinite loop terminates cleanly with TIME_LIMIT_EXCEEDED without freezing host process', async () => {
    const res = await CodeExecutionService.executeCode(
      'function twoSum(nums, target) { while (true) {} }',
      'javascript',
      [{ input: '[[2,7,11,15], 9]', expectedOutput: '[0,1]' }],
      { functionName: 'twoSum', timeoutMs: 1500 }
    );
    assert.strictEqual(res.status, 'TIME_LIMIT_EXCEEDED');
  });
});
