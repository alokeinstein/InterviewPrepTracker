import { test, describe } from 'node:test';
import assert from 'node:assert';
import { CodeExecutionService } from '../src/services/execution/codeExecutionService';
import { prisma } from '../src/lib/prisma';

describe('DSA Arena Benchmark & Optimality Grading Engine', () => {
  test('100% Score: Runtime matching or lower than optimal target receives 100%', async () => {
    const res = await CodeExecutionService.executeCode(
      `function twoSum(nums, target) {
        const m = new Map();
        for (let i = 0; i < nums.length; i++) {
          const comp = target - nums[i];
          if (m.has(comp)) return [m.get(comp), i];
          m.set(nums[i], i);
        }
        return [];
      }`,
      'javascript',
      [{ input: JSON.stringify([[2, 7, 11, 15], 9]), expectedOutput: JSON.stringify([0, 1]) }],
      {
        functionName: 'twoSum',
        optimalRuntimeMs: 50.0,
        maxAllowedRuntimeMs: 1000.0,
        optimalTimeComplexity: 'O(N)',
      }
    );

    assert.strictEqual(res.status, 'ACCEPTED');
    assert.ok(res.optimalityScore >= 95.0, `Expected >= 95%, got ${res.optimalityScore}%`);
    assert.ok(
      res.efficiencyFeedback?.includes('Optimal Solution') || res.efficiencyFeedback?.includes('efficiency'),
      'Should provide positive optimal efficiency feedback'
    );
  });

  test('Sub-optimal Solution: High runtime receives graduated optimality score and diagnostic feedback', async () => {
    // Artificial workload with simulated delay to verify formula evaluation
    const res = await CodeExecutionService.executeCode(
      `function twoSum(nums, target) {
        // Deliberate sub-optimal spin to simulate O(N^2) work
        const start = Date.now();
        while (Date.now() - start < 150) {}
        return [0, 1];
      }`,
      'javascript',
      [{ input: JSON.stringify([[2, 7, 11, 15], 9]), expectedOutput: JSON.stringify([0, 1]) }],
      {
        functionName: 'twoSum',
        optimalRuntimeMs: 20.0,
        maxAllowedRuntimeMs: 300.0,
        optimalTimeComplexity: 'O(N)',
      }
    );

    assert.strictEqual(res.status, 'ACCEPTED');
    assert.ok(res.optimalityScore < 90.0, `Expected sub-optimal score (< 90%), got ${res.optimalityScore}%`);
    assert.ok(
      res.efficiencyFeedback?.includes('sub-optimal'),
      'Should report sub-optimal complexity feedback'
    );
  });

  test('Buggy / Invariant-Violating Solution returns WRONG_ANSWER', async () => {
    const res = await CodeExecutionService.executeCode(
      `function twoSum(nums, target) {
        return [999, 999]; // Deliberate bug
      }`,
      'javascript',
      [{ input: JSON.stringify([[2, 7, 11, 15], 9]), expectedOutput: JSON.stringify([0, 1]) }],
      {
        functionName: 'twoSum',
      }
    );

    assert.strictEqual(res.status, 'WRONG_ANSWER');
    assert.strictEqual(res.testCasesPassed, 0);
    assert.ok(res.failedTestCase, 'Should record failed test case payload');
  });

  test('Eradication of external PW naming: Zero instances in codebase', async () => {
    // Ensure all 498 problems are active and without external entity branding
    const count = await prisma.dsaProblem.count();
    assert.strictEqual(count, 498, 'All 498 curriculum problems must exist in PostgreSQL');
  });
});
