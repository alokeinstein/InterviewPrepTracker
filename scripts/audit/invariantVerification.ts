import * as path from 'path';
import { LevelPayload, GeneratedProblem } from '../generators/types';

interface InvariantIssue {
  num: number;
  title: string;
  level: number;
  invariantName: string;
  details: string;
}

export function runInvariantChecks() {
  console.log('=== RUNNING INDEPENDENT MATHEMATICAL & ALGORITHMIC INVARIANT VERIFICATION ===\n');
  const issues: InvariantIssue[] = [];

  for (let lvl = 1; lvl <= 23; lvl++) {
    const file = path.resolve(`scripts/generators/level${lvl}.ts`);
    const mod = require(file);
    const payload: LevelPayload = mod[`getLevel${lvl}Payload`]();

    for (const prob of payload.problems) {
      // 1. Two Sum (#1): 0-indexed, Two Sum II (#50): 1-indexed
      if (prob.slug === 'two-sum') {
        for (const tc of prob.testCases) {
          const [nums, target] = JSON.parse(tc.input);
          const [i, j] = JSON.parse(tc.expectedOutput);
          if (nums[i] + nums[j] !== target) {
            issues.push({
              num: prob.num,
              title: prob.title,
              level: lvl,
              invariantName: 'Two Sum Invariant',
              details: `Expected indices [${i}, ${j}] sum to ${nums[i] + nums[j]}, expected target ${target}`,
            });
          }
        }
      } else if (prob.slug === 'two-sum-ii-input-array-is-sorted') {
        for (const tc of prob.testCases) {
          const [nums, target] = JSON.parse(tc.input);
          const [i, j] = JSON.parse(tc.expectedOutput);
          if (nums[i - 1] + nums[j - 1] !== target) {
            issues.push({
              num: prob.num,
              title: prob.title,
              level: lvl,
              invariantName: 'Two Sum II (1-based) Invariant',
              details: `Expected 1-based indices [${i}, ${j}] (values ${nums[i - 1]}, ${nums[j - 1]}) sum to ${nums[i - 1] + nums[j - 1]}, expected target ${target}`,
            });
          }
        }
      }

      // 2. BST Validation (#229 Validate Binary Search Tree):
      if (prob.slug === 'validate-binary-search-tree') {
        for (const tc of prob.testCases) {
          const [treeArr] = JSON.parse(tc.input);
          const expected = JSON.parse(tc.expectedOutput);
          // Check if treeArr has inorder sorted without duplicates
          // Let's do an independent check
          function checkBst(arr: (number | null)[]): boolean {
            if (!arr || arr.length === 0 || arr[0] === null) return true;
            // Build tree
            interface Node { val: number; left?: Node; right?: Node }
            const root: Node = { val: arr[0]! };
            const q: Node[] = [root];
            let i = 1;
            while (q.length > 0 && i < arr.length) {
              const curr = q.shift()!;
              if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
                curr.left = { val: arr[i]! };
                q.push(curr.left);
              }
              i++;
              if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
                curr.right = { val: arr[i]! };
                q.push(curr.right);
              }
              i++;
            }
            const inOrder: number[] = [];
            function inorder(n?: Node) {
              if (!n) return;
              inorder(n.left);
              inOrder.push(n.val);
              inorder(n.right);
            }
            inorder(root);
            for (let k = 0; k < inOrder.length - 1; k++) {
              if (inOrder[k] >= inOrder[k + 1]) return false;
            }
            return true;
          }
          const actualBst = checkBst(treeArr);
          if (actualBst !== expected) {
            issues.push({
              num: prob.num,
              title: prob.title,
              level: lvl,
              invariantName: 'BST Invariant',
              details: `Independent BST check is ${actualBst}, expected ${expected} for input ${tc.input}`,
            });
          }
        }
      }

      // 3. Maximum Subarray (#347): check against O(N^2) brute force on small test cases
      if (prob.slug === 'maximum-subarray') {
        for (const tc of prob.testCases) {
          const [nums] = JSON.parse(tc.input);
          if (nums.length <= 100) {
            let maxSub = -Infinity;
            for (let i = 0; i < nums.length; i++) {
              let cur = 0;
              for (let j = i; j < nums.length; j++) {
                cur += nums[j];
                if (cur > maxSub) maxSub = cur;
              }
            }
            const expected = JSON.parse(tc.expectedOutput);
            if (maxSub !== expected) {
              issues.push({
                num: prob.num,
                title: prob.title,
                level: lvl,
                invariantName: 'Max Subarray Brute Force',
                details: `Brute force sum is ${maxSub}, expectedOutput is ${expected}`,
              });
            }
          }
        }
      }

      // 4. Merge Intervals (#168): output intervals must be mutually disjoint and sorted
      if (prob.slug === 'merge-intervals') {
        for (const tc of prob.testCases) {
          const expected: [number, number][] = JSON.parse(tc.expectedOutput);
          for (let k = 0; k < expected.length - 1; k++) {
            if (expected[k][1] >= expected[k + 1][0]) {
              issues.push({
                num: prob.num,
                title: prob.title,
                level: lvl,
                invariantName: 'Interval Disjoint Invariant',
                details: `Merged intervals [${expected[k]}] and [${expected[k + 1]}] overlap or are not merged`,
              });
            }
          }
        }
      }

      // 5. Climbing Stairs (#356): independent DP recurrence f(n) = f(n-1) + f(n-2)
      if (prob.slug === 'climbing-stairs') {
        for (const tc of prob.testCases) {
          const [n] = JSON.parse(tc.input);
          let a = 1, b = 1;
          for (let step = 2; step <= n; step++) {
            const next = a + b;
            a = b;
            b = next;
          }
          const expected = JSON.parse(tc.expectedOutput);
          if (b !== expected) {
            issues.push({
              num: prob.num,
              title: prob.title,
              level: lvl,
              invariantName: 'Fibonacci Recurrence Invariant',
              details: `Expected ${b}, got ${expected} for n=${n}`,
            });
          }
        }
      }
    }
  }

  console.log(`Invariant Checks Complete! Issues Found: ${issues.length}`);
  if (issues.length > 0) {
    issues.forEach(i => console.log(`  ❌ [${i.invariantName}] #${i.num} ${i.title}: ${i.details}`));
  } else {
    console.log('✅ ALL TESTED MATHEMATICAL & ALGORITHMIC INVARIANTS HOLD 100% ACROSS THE PROBLEM BANK!');
  }

  return issues;
}

if (require.main === module || process.argv[1]?.includes('invariantVerification')) {
  runInvariantChecks();
}
