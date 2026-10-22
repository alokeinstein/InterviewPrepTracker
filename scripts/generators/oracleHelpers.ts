import { GeneratedTestCase } from './types';

export function makeTestCase(
  inputArgs: any[],
  oracleFn: (...args: any[]) => any,
  tier: 'FUNCTIONAL' | 'BOUNDARY' | 'ADVERSARIAL' | 'STRESS',
  isHidden: boolean = false,
  explanation?: string,
  scaleN?: number
): GeneratedTestCase {
  // Deep clone input args to prevent mutations
  const cloned = JSON.parse(JSON.stringify(inputArgs));
  const expected = oracleFn(...cloned);
  return {
    input: JSON.stringify(inputArgs),
    expectedOutput: JSON.stringify(expected),
    isHidden,
    tier,
    explanation,
    scaleN,
  };
}

export function buildStandardTestSuite(
  oracleFn: (...args: any[]) => any,
  cases: {
    functional: any[][];
    boundary: any[][];
    adversarial: any[][];
    stress: any[][];
  }
): GeneratedTestCase[] {
  const result: GeneratedTestCase[] = [];

  // 1. Functional (Public)
  for (let i = 0; i < cases.functional.length; i++) {
    result.push(
      makeTestCase(cases.functional[i], oracleFn, 'FUNCTIONAL', false, `Standard functional test case ${i + 1}`)
    );
  }

  // 2. Boundary & Edge cases
  for (let i = 0; i < cases.boundary.length; i++) {
    result.push(
      makeTestCase(cases.boundary[i], oracleFn, 'BOUNDARY', true, `Boundary/edge condition ${i + 1}`)
    );
  }

  // 3. Adversarial / Trick cases
  for (let i = 0; i < cases.adversarial.length; i++) {
    result.push(
      makeTestCase(cases.adversarial[i], oracleFn, 'ADVERSARIAL', true, `Adversarial / counter-example test ${i + 1}`)
    );
  }

  // 4. Large-scale Stress cases
  for (let i = 0; i < cases.stress.length; i++) {
    const input = cases.stress[i];
    const n = Array.isArray(input[0]) ? input[0].length : typeof input[0] === 'string' ? input[0].length : 1000;
    result.push(
      makeTestCase(input, oracleFn, 'STRESS', true, `Stress test scale N=${n} for complexity verification`, n)
    );
  }

  return result;
}
