import { getLevel5Payload } from '../generators/level5';
import { getLevel7Payload } from '../generators/level7';
import { getLevel10Payload } from '../generators/level10';
import { getLevel11Payload } from '../generators/level11';
import { getLevel12Payload } from '../generators/level12';
import { getLevel14Payload } from '../generators/level14';
import { getLevel15Payload } from '../generators/level15';
import { getLevel18Payload } from '../generators/level18';
import { getLevel21Payload } from '../generators/level21';
import { getLevel22Payload } from '../generators/level22';
import { getLevel23Payload } from '../generators/level23';
import { CodeExecutionService } from '../../src/services/execution/codeExecutionService';

async function testAllCandidateFixes() {
  console.log('Testing All Candidate Fixes...\n');

  // Fix 7: #258 Subsets
  const p258 = getLevel12Payload().problems.find(p => p.num === 258)!;
  const p258SuboptFix = `function subsets(nums) {\n  const res = [];\n  function dfs(start, path) {\n    res.push(path);\n    for (let i = start; i < nums.length; i++) {\n      dfs(i + 1, [...path, nums[i]]);\n    }\n  }\n  dfs(0, []);\n  return res;\n}`;
  const res258 = await CodeExecutionService.executeCode(
    p258SuboptFix, 'javascript',
    p258.testCases.map(tc => ({ input: tc.input, expectedOutput: tc.expectedOutput })),
    { functionName: p258.functionName }
  );
  console.log(`#258 Fix Result: ${res258.status} (${res258.testCasesPassed}/${res258.totalTestCases} passed)`);

  // Fix 8: #270 Letter Case Permutation
  const p270 = getLevel12Payload().problems.find(p => p.num === 270)!;
  const p270SuboptFix = `function letterCasePermutation(s) {\n  const res = [];\n  function dfs(idx, cur) {\n    if (idx === s.length) {\n      res.push(cur);\n      return;\n    }\n    const c = s[idx];\n    if (c >= '0' && c <= '9') {\n      dfs(idx + 1, cur + c);\n    } else {\n      dfs(idx + 1, cur + c.toLowerCase());\n      dfs(idx + 1, cur + c.toUpperCase());\n    }\n  }\n  dfs(0, "");\n  return res;\n}`;
  const res270 = await CodeExecutionService.executeCode(
    p270SuboptFix, 'javascript',
    p270.testCases.map(tc => ({ input: tc.input, expectedOutput: tc.expectedOutput })),
    { functionName: p270.functionName }
  );
  console.log(`#270 Fix Result: ${res270.status} (${res270.testCasesPassed}/${res270.totalTestCases} passed)`);

  // Fix 9: #310 Redundant Connection
  const p310 = getLevel14Payload().problems.find(p => p.num === 310)!;
  const p310SuboptFix = `function findRedundantConnection(edges) {\n  let maxNode = 0;\n  for (const [u, v] of edges) maxNode = Math.max(maxNode, u, v);\n  const adj = Array.from({ length: maxNode + 1 }, () => []);\n  function hasPath(src, dest, visited) {\n    if (src === dest) return true;\n    visited.add(src);\n    for (const neighbor of adj[src]) {\n      if (!visited.has(neighbor) && hasPath(neighbor, dest, visited)) return true;\n    }\n    return false;\n  }\n  for (const [u, v] of edges) {\n    const visited = new Set();\n    if (adj[u].length > 0 && adj[v].length > 0 && hasPath(u, v, visited)) {\n      return [u, v];\n    }\n    adj[u].push(v);\n    adj[v].push(u);\n  }\n  return [];\n}`;
  const res310 = await CodeExecutionService.executeCode(
    p310SuboptFix, 'javascript',
    p310.testCases.map(tc => ({ input: tc.input, expectedOutput: tc.expectedOutput })),
    { functionName: p310.functionName }
  );
  console.log(`#310 Fix Result: ${res310.status} (${res310.testCasesPassed}/${res310.totalTestCases} passed)`);

  // Fix 10: #315 Minimum Genetic Mutation
  const p315 = getLevel14Payload().problems.find(p => p.num === 315)!;
  const p315SuboptFix = `function minMutation(startGene, endGene, bank) {\n  if (startGene === endGene) return 0;\n  const bankSet = new Set(bank);\n  if (!bankSet.has(endGene)) return -1;\n  let queue = [startGene];\n  let steps = 0;\n  while (queue.length > 0) {\n    const nextQ = [];\n    for (const gene of queue) {\n      if (gene === endGene) return steps;\n      for (const valid of bankSet) {\n        let diff = 0;\n        for (let i = 0; i < 8; i++) if (gene[i] !== valid[i]) diff++;\n        if (diff === 1) {\n          nextQ.push(valid);\n          bankSet.delete(valid);\n        }\n      }\n    }\n    queue = nextQ;\n    steps++;\n  }\n  return -1;\n}`;
  const res315 = await CodeExecutionService.executeCode(
    p315SuboptFix, 'javascript',
    p315.testCases.map(tc => ({ input: tc.input, expectedOutput: tc.expectedOutput })),
    { functionName: p315.functionName }
  );
  console.log(`#315 Fix Result: ${res315.status} (${res315.testCasesPassed}/${res315.totalTestCases} passed)`);

  // Fix 11: #322 Alien Dictionary
  const p322 = getLevel15Payload().problems.find(p => p.num === 322)!;
  const p322SuboptFix = `function alienOrder(words) {\n  const adj = new Map();\n  const inDegree = new Map();\n  for (const w of words) {\n    for (const c of w) {\n      if (!adj.has(c)) adj.set(c, new Set());\n      if (!inDegree.has(c)) inDegree.set(c, 0);\n    }\n  }\n  for (let i = 0; i < words.length - 1; i++) {\n    const w1 = words[i], w2 = words[i + 1];\n    if (w1.length > w2.length && w1.startsWith(w2)) return "";\n    const minLen = Math.min(w1.length, w2.length);\n    for (let j = 0; j < minLen; j++) {\n      if (w1[j] !== w2[j]) {\n        if (!adj.get(w1[j]).has(w2[j])) {\n          adj.get(w1[j]).add(w2[j]);\n          inDegree.set(w2[j], inDegree.get(w2[j]) + 1);\n        }\n        break;\n      }\n    }\n  }\n  const queue = [];\n  for (const [char, deg] of inDegree.entries()) {\n    if (deg === 0) queue.push(char);\n  }\n  queue.sort();\n  let res = "";\n  while (queue.length > 0) {\n    const curr = queue.shift();\n    res += curr;\n    const neighbors = Array.from(adj.get(curr)).sort();\n    for (const next of neighbors) {\n      inDegree.set(next, inDegree.get(next) - 1);\n      if (inDegree.get(next) === 0) queue.push(next);\n    }\n  }\n  return res.length === inDegree.size ? res : "";\n}`;
  const res322 = await CodeExecutionService.executeCode(
    p322SuboptFix, 'javascript',
    p322.testCases.map(tc => ({ input: tc.input, expectedOutput: tc.expectedOutput })),
    { functionName: p322.functionName }
  );
  console.log(`#322 Fix Result: ${res322.status} (${res322.testCasesPassed}/${res322.totalTestCases} passed)`);

  // Fix 12: #389 Longest Palindromic Substring
  const p389 = getLevel18Payload().problems.find(p => p.num === 389)!;
  const p389SuboptFix = `function longestPalindrome(s) {\n  const n = s.length;\n  if (n <= 1) return s;\n  const dp = Array.from({ length: n }, () => new Array(n).fill(false));\n  let start = 0, maxLen = 1;\n  for (let i = 0; i < n; i++) dp[i][i] = true;\n  for (let len = 2; len <= n; len++) {\n    for (let i = 0; i <= n - len; i++) {\n      const j = i + len - 1;\n      if (s[i] === s[j] && (len === 2 || dp[i + 1][j - 1])) {\n        dp[i][j] = true;\n        if (len > maxLen) {\n          start = i;\n          maxLen = len;\n        }\n      }\n    }\n  }\n  return s.substring(start, start + maxLen);\n}`;
  const res389 = await CodeExecutionService.executeCode(
    p389SuboptFix, 'javascript',
    p389.testCases.map(tc => ({ input: tc.input, expectedOutput: tc.expectedOutput })),
    { functionName: p389.functionName }
  );
  console.log(`#389 Fix Result: ${res389.status} (${res389.testCasesPassed}/${res389.totalTestCases} passed)`);

  // Fix 13: #448 Magnetic Force Between Two Balls
  const p448 = getLevel21Payload().problems.find(p => p.num === 448)!;
  const p448SuboptFix = `function maxDistance(position, m) {\n  position.sort((a, b) => a - b);\n  let low = 1, high = position[position.length - 1] - position[0];\n  let best = 1;\n  while (low <= high) {\n    const d = Math.floor(low + (high - low) / 2);\n    let count = 1, last = position[0];\n    for (let i = 1; i < position.length; i++) {\n      if (position[i] - last >= d) { count++; last = position[i]; }\n    }\n    if (count >= m) {\n      best = d;\n      low = d + 1;\n    } else {\n      high = d - 1;\n    }\n  }\n  return best;\n}`;
  const res448 = await CodeExecutionService.executeCode(
    p448SuboptFix, 'javascript',
    p448.testCases.map(tc => ({ input: tc.input, expectedOutput: tc.expectedOutput })),
    { functionName: p448.functionName }
  );
  console.log(`#448 Fix Result: ${res448.status} (${res448.testCasesPassed}/${res448.totalTestCases} passed)`);

  // Fix 14: #466 Palindrome Pairs
  const p466 = getLevel22Payload().problems.find(p => p.num === 466)!;
  const p466SuboptFix = `function palindromePairs(words) {\n  const res = [];\n  const isPal = (s) => {\n    let l = 0, r = s.length - 1;\n    while (l < r) if (s[l++] !== s[r--]) return false;\n    return true;\n  };\n  for (let i = 0; i < words.length; i++) {\n    for (let j = 0; j < words.length; j++) {\n      if (i !== j && isPal(words[i] + words[j])) res.push([i, j]);\n    }\n  }\n  return res;\n}`;
  // Wait, let's see what optimalSolution for 466 returns:
  const optRes466 = await CodeExecutionService.executeCode(
    p466.optimalSolution, 'javascript',
    p466.testCases.map(tc => ({ input: tc.input, expectedOutput: tc.expectedOutput })),
    { functionName: p466.functionName }
  );
  console.log(`#466 Optimal Result: ${optRes466.status} (${optRes466.testCasesPassed}/${optRes466.totalTestCases} passed)`);
  // What does suboptimal produce compared to expected?
  const suboptRes466 = await CodeExecutionService.executeCode(
    p466SuboptFix, 'javascript',
    p466.testCases.map(tc => ({ input: tc.input, expectedOutput: tc.expectedOutput })),
    { functionName: p466.functionName }
  );
  console.log(`#466 Subopt Result: ${suboptRes466.status} (${suboptRes466.testCasesPassed}/${suboptRes466.totalTestCases} passed)`);
  console.log(`  Failed test case 466:`, suboptRes466.failedTestCase);

  // Fix 15: #467 Concatenated Words
  const p467 = getLevel22Payload().problems.find(p => p.num === 467)!;
  const p467SuboptFix = `function findAllConcatenatedWordsInADict(words) {\n  words.sort((a, b) => a.length - b.length);\n  const wordSet = new Set();\n  const res = [];\n  const dfs = (word) => {\n    if (wordSet.has(word)) return true;\n    for (let i = 1; i < word.length; i++) {\n      const prefix = word.substring(0, i);\n      if (wordSet.has(prefix) && dfs(word.substring(i))) return true;\n    }\n    return false;\n  };\n  for (const w of words) {\n    if (w.length > 0 && dfs(w)) res.push(w);\n    wordSet.add(w);\n  }\n  return res;\n}`;
  const res467 = await CodeExecutionService.executeCode(
    p467SuboptFix, 'javascript',
    p467.testCases.map(tc => ({ input: tc.input, expectedOutput: tc.expectedOutput })),
    { functionName: p467.functionName }
  );
  console.log(`#467 Fix Result: ${res467.status} (${res467.testCasesPassed}/${res467.totalTestCases} passed)`);

  // Fix 16: #483 Decode Ways II
  const p483 = getLevel23Payload().problems.find(p => p.num === 483)!;
  const p483SuboptFix = `function numDecodings(s) {\n  const MOD = 1000000007n;\n  const n = s.length;\n  const dp = new Array(n + 1).fill(0n);\n  dp[0] = 1n;\n  dp[1] = s[0] === '*' ? 9n : s[0] === '0' ? 0n : 1n;\n  for (let i = 2; i <= n; i++) {\n    const c1 = s[i - 2], c2 = s[i - 1];\n    if (c2 === '*') dp[i] = (dp[i] + 9n * dp[i - 1]) % MOD;\n    else if (c2 !== '0') dp[i] = (dp[i] + dp[i - 1]) % MOD;\n    if (c1 === '*' && c2 === '*') dp[i] = (dp[i] + 15n * dp[i - 2]) % MOD;\n    else if (c1 === '*') {\n      if (c2 >= '0' && c2 <= '6') dp[i] = (dp[i] + 2n * dp[i - 2]) % MOD;\n      else dp[i] = (dp[i] + dp[i - 2]) % MOD;\n    } else if (c2 === '*') {\n      if (c1 === '1') dp[i] = (dp[i] + 9n * dp[i - 2]) % MOD;\n      else if (c1 === '2') dp[i] = (dp[i] + 6n * dp[i - 2]) % MOD;\n    } else {\n      const val = parseInt(c1 + c2, 10);\n      if (val >= 10 && val <= 26) dp[i] = (dp[i] + dp[i - 2]) % MOD;\n    }\n  }\n  return Number(dp[n]);\n}`;
  const res483 = await CodeExecutionService.executeCode(
    p483SuboptFix, 'javascript',
    p483.testCases.map(tc => ({ input: tc.input, expectedOutput: tc.expectedOutput })),
    { functionName: p483.functionName }
  );
  console.log(`#483 Fix Result: ${res483.status} (${res483.testCasesPassed}/${res483.totalTestCases} passed)`);

  // Fix 17: #491 Range Module
  const p491 = getLevel23Payload().problems.find(p => p.num === 491)!;
  const p491SuboptFix = `class RangeModule {\n  constructor() {\n    this.intervals = [];\n  }\n  addRange(left, right) {\n    const next = [];\n    let inserted = false;\n    for (const [l, r] of this.intervals) {\n      if (right < l) {\n        if (!inserted) { next.push([left, right]); inserted = true; }\n        next.push([l, r]);\n      } else if (left > r) {\n        next.push([l, r]);\n      } else {\n        left = Math.min(left, l);\n        right = Math.max(right, r);\n      }\n    }\n    if (!inserted) next.push([left, right]);\n    this.intervals = next;\n  }\n  queryRange(left, right) {\n    for (const [l, r] of this.intervals) {\n      if (l <= left && right <= r) return true;\n    }\n    return false;\n  }\n  removeRange(left, right) {\n    const next = [];\n    for (const [l, r] of this.intervals) {\n      if (right <= l || left >= r) {\n        next.push([l, r]);\n      } else {\n        if (l < left) next.push([l, left]);\n        if (right < r) next.push([right, r]);\n      }\n    }\n    this.intervals = next;\n  }\n}`;
  const res491 = await CodeExecutionService.executeCode(
    p491SuboptFix, 'javascript',
    p491.testCases.map(tc => ({ input: tc.input, expectedOutput: tc.expectedOutput })),
    { functionName: p491.functionName, executionModel: 'DESIGN' }
  );
  console.log(`#491 Fix Result: ${res491.status} (${res491.testCasesPassed}/${res491.totalTestCases} passed)`);
}

testAllCandidateFixes().catch(console.error);
