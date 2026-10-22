import { LevelPayload, GeneratedProblem } from './types';
import { createProblem } from './problemBuilder';

export function getLevel12Payload(): LevelPayload {
  const problems: GeneratedProblem[] = [
    // 258. Subsets
    createProblem({
      num: 258,
      title: "Subsets",
      slug: "subsets",
      level: 12,
      difficulty: "MEDIUM",
      topic: "Backtracking / Bit Manipulation",
      patternSlug: "backtracking",
      estimatedTimeMin: 20,
      statement: "Given an integer array `nums` of unique elements, return all possible subsets (the power set).\n\nThe solution set must not contain duplicate subsets. Return the solution in any order (subsets sorted lexicographically for testing).",
      functionName: "subsets",
      parameters: [{ name: "nums", type: "number[]", description: "Array of unique integers" }],
      returnType: "number[][]",
      constraints: ["1 <= nums.length <= 10", "-10 <= nums[i] <= 10", "All the numbers of nums are unique."],
      examples: [
        { input: "nums = [1,2,3]", output: "[[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]", explanation: "All 2^3 = 8 possible subsets." },
        { input: "nums = [0]", output: "[[],[0]]", explanation: "All 2^1 = 2 subsets." },
        { input: "nums = [1,2]", output: "[[],[1],[1,2],[2]]", explanation: "All 4 subsets for 2 elements." },
        { input: "nums = []", output: "[[]]", explanation: "Power set of empty array contains only the empty set." }
      ],
      optimalSolution: `function subsets(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}`,
      optimalTimeComplexity: "O(N * 2^N)",
      optimalSpaceComplexity: "O(N) recursion stack",
      suboptimalSolution: `function subsets(nums) {\n  let res = [[]];\n  for (const num of nums) {\n    const len = res.length;\n    for (let i = 0; i < len; i++) {\n      res.push([...res[i], num]);\n    }\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N * 2^N)",
      suboptimalSpaceComplexity: "O(N * 2^N)",
      commonMistakes: ["Pushing `path` by reference instead of copying `[...path]`", "Incrementing `start` instead of `i + 1` in recursive call"],
      hints: [
        "Every element has 2 choices: include or exclude.",
        "Use backtracking: at each step, push current path to result, then iterate i from start to nums.length - 1.",
        "Remember to pop element after backtracking to restore path."
      ],
      oracleFn: (nums: number[]) => {
        const res: number[][] = [];
        function backtrack(start: number, path: number[]) {
          res.push([...path]);
          for (let i = start; i < nums.length; i++) {
            path.push(nums[i]);
            backtrack(i + 1, path);
            path.pop();
          }
        }
        backtrack(0, []);
        return res;
      },
      testCases: {
        functional: [
          [[1, 2, 3]],
          [[0]],
          [[1, 2]],
          [[]]
        ],
        boundary: [
          [[5]],
          [[-1, 1]],
          [[1, 2, 3, 4]]
        ],
        adversarial: [
          [[-3, -2, -1, 0]],
          [[10, 20, 30]]
        ],
        stress: [
          [Array.from({ length: 8 }, (_, i) => i + 1)],
          [Array.from({ length: 10 }, (_, i) => i - 5)]
        ]
      }
    }),

    // 259. Subsets II
    createProblem({
      num: 259,
      title: "Subsets II",
      slug: "subsets-ii",
      level: 12,
      difficulty: "MEDIUM",
      topic: "Backtracking / Array",
      patternSlug: "backtracking",
      estimatedTimeMin: 20,
      statement: "Given an integer array `nums` that may contain duplicates, return all possible subsets (the power set).\n\nThe solution set must not contain duplicate subsets. Return the solution in any order.",
      functionName: "subsetsWithDup",
      parameters: [{ name: "nums", type: "number[]", description: "Array of integers with duplicates" }],
      returnType: "number[][]",
      constraints: ["1 <= nums.length <= 10", "-10 <= nums[i] <= 10"],
      examples: [
        { input: "nums = [1,2,2]", output: "[[],[1],[1,2],[1,2,2],[2],[2,2]]", explanation: "Duplicate subsets like [1,2] are generated only once." },
        { input: "nums = [0]", output: "[[],[0]]", explanation: "Single element." },
        { input: "nums = [4,4,4,1,4]", output: "[[],[1],[1,4],[1,4,4],[1,4,4,4],[1,4,4,4,4],[4],[4,4],[4,4,4],[4,4,4,4]]", explanation: "Multi-duplicate sorting deduplication." },
        { input: "nums = [1,1]", output: "[[],[1],[1,1]]", explanation: "Duplicate pair." }
      ],
      optimalSolution: `function subsetsWithDup(nums) {\n  nums.sort((a, b) => a - b);\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      if (i > start && nums[i] === nums[i - 1]) continue;\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}`,
      optimalTimeComplexity: "O(N log N + N * 2^N)",
      optimalSpaceComplexity: "O(N) recursion stack",
      suboptimalSolution: `function subsetsWithDup(nums) {\n  nums.sort((a, b) => a - b);\n  const res = [];\n  const seen = new Set();\n  function dfs(start, path) {\n    const key = path.join(',');\n    if (!seen.has(key)) {\n      seen.add(key);\n      res.push([...path]);\n    }\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      dfs(i + 1, path);\n      path.pop();\n    }\n  }\n  dfs(0, []);\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N * 2^N)",
      suboptimalSpaceComplexity: "O(N * 2^N) set space",
      commonMistakes: ["Checking `nums[i] === nums[i - 1]` without `i > start` condition", "Forgetting to sort the array initially"],
      hints: [
        "Sort `nums` first so duplicates are adjacent.",
        "Inside the loop, if `i > start && nums[i] === nums[i - 1]`, skip to avoid generating duplicate branches.",
        "Add path copy to result at the start of each backtrack call."
      ],
      oracleFn: (nums: number[]) => {
        nums.sort((a, b) => a - b);
        const res: number[][] = [];
        function backtrack(start: number, path: number[]) {
          res.push([...path]);
          for (let i = start; i < nums.length; i++) {
            if (i > start && nums[i] === nums[i - 1]) continue;
            path.push(nums[i]);
            backtrack(i + 1, path);
            path.pop();
          }
        }
        backtrack(0, []);
        return res;
      },
      testCases: {
        functional: [
          [[1, 2, 2]],
          [[0]],
          [[4, 4, 4, 1, 4]],
          [[1, 1]]
        ],
        boundary: [
          [[2]],
          [[2, 2, 2]],
          [[-1, -1, 2]]
        ],
        adversarial: [
          [[1, 2, 3, 2]],
          [[5, 5, 5, 5]]
        ],
        stress: [
          [[1, 1, 2, 2, 3, 3, 4, 4]],
          [Array.from({ length: 9 }, (_, i) => Math.floor(i / 2))]
        ]
      }
    }),

    // 260. Permutations
    createProblem({
      num: 260,
      title: "Permutations",
      slug: "permutations",
      level: 12,
      difficulty: "MEDIUM",
      topic: "Backtracking",
      patternSlug: "backtracking",
      estimatedTimeMin: 20,
      statement: "Given an array `nums` of distinct integers, return all the possible permutations. You can return the answer in any order.",
      functionName: "permute",
      parameters: [{ name: "nums", type: "number[]", description: "Array of distinct integers" }],
      returnType: "number[][]",
      constraints: ["1 <= nums.length <= 6", "-10 <= nums[i] <= 10", "All the integers of nums are unique."],
      examples: [
        { input: "nums = [1,2,3]", output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]", explanation: "All 3! = 6 permutations." },
        { input: "nums = [0,1]", output: "[[0,1],[1,0]]", explanation: "All 2! = 2 permutations." },
        { input: "nums = [1]", output: "[[1]]", explanation: "Single element permutation." },
        { input: "nums = [2,3]", output: "[[2,3],[3,2]]", explanation: "Two element permutations." }
      ],
      optimalSolution: `function permute(nums) {\n  const res = [];\n  const used = new Array(nums.length).fill(false);\n  function backtrack(path) {\n    if (path.length === nums.length) {\n      res.push([...path]);\n      return;\n    }\n    for (let i = 0; i < nums.length; i++) {\n      if (used[i]) continue;\n      used[i] = true;\n      path.push(nums[i]);\n      backtrack(path);\n      path.pop();\n      used[i] = false;\n    }\n  }\n  backtrack([]);\n  return res;\n}`,
      optimalTimeComplexity: "O(N * N!)",
      optimalSpaceComplexity: "O(N) recursion stack and boolean array",
      suboptimalSolution: `function permute(nums) {\n  const res = [];\n  function dfs(arr, current) {\n    if (arr.length === 0) { res.push(current); return; }\n    for (let i = 0; i < arr.length; i++) {\n      dfs([...arr.slice(0, i), ...arr.slice(i + 1)], [...current, arr[i]]);\n    }\n  }\n  dfs(nums, []);\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N^2 * N!) array slice overhead",
      suboptimalSpaceComplexity: "O(N * N!)",
      commonMistakes: ["Using `path.includes(nums[i])` O(N) lookup instead of boolean `used` array O(1)", "Forgetting to reset `used[i] = false` when backtracking"],
      hints: [
        "A permutation requires using every element exactly once in different orders.",
        "Use a boolean array `used` to keep track of elements currently in `path`.",
        "When `path.length === nums.length`, push a copy of path to result."
      ],
      oracleFn: (nums: number[]) => {
        const res: number[][] = [];
        const used = new Array(nums.length).fill(false);
        function backtrack(path: number[]) {
          if (path.length === nums.length) {
            res.push([...path]);
            return;
          }
          for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            path.push(nums[i]);
            backtrack(path);
            path.pop();
            used[i] = false;
          }
        }
        backtrack([]);
        return res;
      },
      testCases: {
        functional: [
          [[1, 2, 3]],
          [[0, 1]],
          [[1]],
          [[2, 3]]
        ],
        boundary: [
          [[-1]],
          [[-1, 1]],
          [[1, 2, 3, 4]]
        ],
        adversarial: [
          [[10, 20, 30]],
          [[-5, 0, 5]]
        ],
        stress: [
          [[1, 2, 3, 4, 5]],
          [[1, 2, 3, 4, 5, 6]]
        ]
      }
    }),

    // 261. Permutations II
    createProblem({
      num: 261,
      title: "Permutations II",
      slug: "permutations-ii",
      level: 12,
      difficulty: "MEDIUM",
      topic: "Backtracking",
      patternSlug: "backtracking",
      estimatedTimeMin: 20,
      statement: "Given a collection of numbers, `nums`, that might contain duplicates, return all possible unique permutations in any order.",
      functionName: "permuteUnique",
      parameters: [{ name: "nums", type: "number[]", description: "Array of integers with duplicates" }],
      returnType: "number[][]",
      constraints: ["1 <= nums.length <= 8", "-10 <= nums[i] <= 10"],
      examples: [
        { input: "nums = [1,1,2]", output: "[[1,1,2],[1,2,1],[2,1,1]]", explanation: "All 3 unique permutations." },
        { input: "nums = [1,2,3]", output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]", explanation: "All 6 unique permutations." },
        { input: "nums = [1]", output: "[[1]]", explanation: "Single element." },
        { input: "nums = [2,2]", output: "[[2,2]]", explanation: "Identical elements produce 1 permutation." }
      ],
      optimalSolution: `function permuteUnique(nums) {\n  nums.sort((a, b) => a - b);\n  const res = [];\n  const used = new Array(nums.length).fill(false);\n  function backtrack(path) {\n    if (path.length === nums.length) {\n      res.push([...path]);\n      return;\n    }\n    for (let i = 0; i < nums.length; i++) {\n      if (used[i]) continue;\n      if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue;\n      used[i] = true;\n      path.push(nums[i]);\n      backtrack(path);\n      path.pop();\n      used[i] = false;\n    }\n  }\n  backtrack([]);\n  return res;\n}`,
      optimalTimeComplexity: "O(N * N!)",
      optimalSpaceComplexity: "O(N) recursion stack",
      suboptimalSolution: `function permuteUnique(nums) {\n  nums.sort((a, b) => a - b);\n  const res = [];\n  const seen = new Set();\n  const used = new Array(nums.length).fill(false);\n  function dfs(path) {\n    if (path.length === nums.length) {\n      const key = path.join(',');\n      if (!seen.has(key)) { seen.add(key); res.push([...path]); }\n      return;\n    }\n    for (let i = 0; i < nums.length; i++) {\n      if (used[i]) continue;\n      used[i] = true;\n      path.push(nums[i]);\n      dfs(path);\n      path.pop();\n      used[i] = false;\n    }\n  }\n  dfs([]);\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N * N!)",
      suboptimalSpaceComplexity: "O(N * N!) set overhead",
      commonMistakes: ["Using `used[i - 1]` instead of `!used[i - 1]` when pruning duplicate sibling branches", "Not sorting `nums` prior to backtracking"],
      hints: [
        "Sort `nums` so identical values are adjacent.",
        "Only pick the duplicate if its identical predecessor has already been placed in the current path (`used[i - 1] === true`).",
        "If `nums[i] === nums[i - 1] && !used[i - 1]`, skip."
      ],
      oracleFn: (nums: number[]) => {
        nums.sort((a, b) => a - b);
        const res: number[][] = [];
        const used = new Array(nums.length).fill(false);
        function backtrack(path: number[]) {
          if (path.length === nums.length) {
            res.push([...path]);
            return;
          }
          for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue;
            used[i] = true;
            path.push(nums[i]);
            backtrack(path);
            path.pop();
            used[i] = false;
          }
        }
        backtrack([]);
        return res;
      },
      testCases: {
        functional: [
          [[1, 1, 2]],
          [[1, 2, 3]],
          [[1]],
          [[2, 2]]
        ],
        boundary: [
          [[1, 1, 1]],
          [[3, 3, 0, 3]],
          [[1, 2]]
        ],
        adversarial: [
          [[1, 2, 1, 2]],
          [[-1, -1, 2]]
        ],
        stress: [
          [[1, 1, 2, 2, 3, 3]],
          [[1, 1, 1, 2, 2, 2, 3]]
        ]
      }
    }),

    // 262. Combinations
    createProblem({
      num: 262,
      title: "Combinations",
      slug: "combinations",
      level: 12,
      difficulty: "MEDIUM",
      topic: "Backtracking",
      patternSlug: "backtracking",
      estimatedTimeMin: 15,
      statement: "Given two integers `n` and `k`, return all possible combinations of `k` numbers chosen from the range `[1, n]`.\n\nYou may return the answer in any order.",
      functionName: "combine",
      parameters: [
        { name: "n", type: "number", description: "Upper range limit n" },
        { name: "k", type: "number", description: "Combination length k" }
      ],
      returnType: "number[][]",
      constraints: ["1 <= n <= 20", "1 <= k <= n"],
      examples: [
        { input: "n = 4, k = 2", output: "[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]", explanation: "All 6 combinations of length 2 from 1..4." },
        { input: "n = 1, k = 1", output: "[[1]]", explanation: "Single combination." },
        { input: "n = 3, k = 3", output: "[[1,2,3]]", explanation: "Choosing all 3 elements." },
        { input: "n = 4, k = 1", output: "[[1],[2],[3],[4]]", explanation: "Length 1 combinations." }
      ],
      optimalSolution: `function combine(n, k) {\n  const res = [];\n  function backtrack(start, path) {\n    if (path.length === k) {\n      res.push([...path]);\n      return;\n    }\n    // Pruning: need (k - path.length) more elements, so i can go up to n - (k - path.length) + 1\n    const limit = n - (k - path.length) + 1;\n    for (let i = start; i <= limit; i++) {\n      path.push(i);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(1, []);\n  return res;\n}`,
      optimalTimeComplexity: "O(k * C(n, k))",
      optimalSpaceComplexity: "O(k) recursion stack",
      suboptimalSolution: `function combine(n, k) {\n  const res = [];\n  function dfs(start, path) {\n    if (path.length === k) { res.push([...path]); return; }\n    for (let i = start; i <= n; i++) {\n      path.push(i);\n      dfs(i + 1, path);\n      path.pop();\n    }\n  }\n  dfs(1, []);\n  return res;\n}`,
      suboptimalTimeComplexity: "O(k * C(n, k)) without pruning",
      suboptimalSpaceComplexity: "O(k)",
      commonMistakes: ["Not pruning loop upper bound `i <= n - (k - path.length) + 1`, wasting traversal cycles", "Starting search from 0 instead of 1"],
      hints: [
        "Use backtracking choosing elements from `start` to `n`.",
        "Pruning: stop when remaining available numbers `n - i + 1` is less than numbers still needed `k - path.length`.",
        "Push copy `[...path]` when `path.length === k`."
      ],
      oracleFn: (n: number, k: number) => {
        const res: number[][] = [];
        function backtrack(start: number, path: number[]) {
          if (path.length === k) {
            res.push([...path]);
            return;
          }
          const limit = n - (k - path.length) + 1;
          for (let i = start; i <= limit; i++) {
            path.push(i);
            backtrack(i + 1, path);
            path.pop();
          }
        }
        backtrack(1, []);
        return res;
      },
      testCases: {
        functional: [
          [4, 2],
          [1, 1],
          [3, 3],
          [4, 1]
        ],
        boundary: [
          [5, 1],
          [5, 5],
          [5, 4]
        ],
        adversarial: [
          [6, 3],
          [7, 2]
        ],
        stress: [
          [10, 4],
          [12, 3]
        ]
      }
    }),

    // 263. Combination Sum
    createProblem({
      num: 263,
      title: "Combination Sum",
      slug: "combination-sum",
      level: 12,
      difficulty: "MEDIUM",
      topic: "Backtracking / Array",
      patternSlug: "backtracking",
      estimatedTimeMin: 20,
      statement: "Given an array of distinct integers `candidates` and a target integer `target`, return a list of all unique combinations of `candidates` where the chosen numbers sum to `target`. You may return the combinations in any order.\n\nThe same number may be chosen from `candidates` an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.",
      functionName: "combinationSum",
      parameters: [
        { name: "candidates", type: "number[]", description: "Array of distinct positive integers" },
        { name: "target", type: "number", description: "Target sum" }
      ],
      returnType: "number[][]",
      constraints: ["1 <= candidates.length <= 30", "2 <= candidates[i] <= 40", "All elements of candidates are distinct.", "1 <= target <= 40"],
      examples: [
        { input: "candidates = [2,3,6,7], target = 7", output: "[[2,2,3],[7]]", explanation: "2 and 3 can be chosen multiple times: 2 + 2 + 3 = 7. 7 = 7." },
        { input: "candidates = [2,3,5], target = 8", output: "[[2,2,2,2],[2,3,3],[3,5]]", explanation: "All 3 valid combinations sum to 8." },
        { input: "candidates = [2], target = 1", output: "[]", explanation: "No combination can sum to 1." },
        { input: "candidates = [3], target = 9", output: "[[3,3,3]]", explanation: "Single candidate repeated 3 times." }
      ],
      optimalSolution: `function combinationSum(candidates, target) {\n  candidates.sort((a, b) => a - b);\n  const res = [];\n  function backtrack(start, remain, path) {\n    if (remain === 0) {\n      res.push([...path]);\n      return;\n    }\n    for (let i = start; i < candidates.length; i++) {\n      if (candidates[i] > remain) break;\n      path.push(candidates[i]);\n      backtrack(i, remain - candidates[i], path);\n      path.pop();\n    }\n  }\n  backtrack(0, target, []);\n  return res;\n}`,
      optimalTimeComplexity: "O(N^(target / min_val))",
      optimalSpaceComplexity: "O(target / min_val) recursion stack",
      suboptimalSolution: `function combinationSum(candidates, target) {\n  const res = [];\n  function dfs(start, sum, path) {\n    if (sum === target) { res.push([...path]); return; }\n    if (sum > target) return;\n    for (let i = start; i < candidates.length; i++) {\n      path.push(candidates[i]);\n      dfs(i, sum + candidates[i], path);\n      path.pop();\n    }\n  }\n  dfs(0, 0, []);\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N^(target / min_val)) without sorting pruning",
      suboptimalSpaceComplexity: "O(target / min_val)",
      commonMistakes: ["Incrementing index to `i + 1` instead of `i` (each candidate can be reused unlimited times)", "Not sorting candidates to break early when `candidates[i] > remain`"],
      hints: [
        "Sort `candidates` ascending so you can `break` early as soon as `candidates[i] > remain`.",
        "Pass `i` (not `i + 1`) to the next recursive call to allow re-using the same candidate.",
        "Subtract `candidates[i]` from target; record path when remain reaches 0."
      ],
      oracleFn: (candidates: number[], target: number) => {
        candidates.sort((a, b) => a - b);
        const res: number[][] = [];
        function backtrack(start: number, remain: number, path: number[]) {
          if (remain === 0) {
            res.push([...path]);
            return;
          }
          for (let i = start; i < candidates.length; i++) {
            if (candidates[i] > remain) break;
            path.push(candidates[i]);
            backtrack(i, remain - candidates[i], path);
            path.pop();
          }
        }
        backtrack(0, target, []);
        return res;
      },
      testCases: {
        functional: [
          [[2, 3, 6, 7], 7],
          [[2, 3, 5], 8],
          [[2], 1],
          [[3], 9]
        ],
        boundary: [
          [[2], 4],
          [[5], 5],
          [[3, 5], 11]
        ],
        adversarial: [
          [[2, 4, 6], 5],
          [[2, 3, 7], 18]
        ],
        stress: [
          [[2, 3, 5, 7], 20],
          [[3, 4, 5], 25]
        ]
      }
    }),

    // 264. Combination Sum II
    createProblem({
      num: 264,
      title: "Combination Sum II",
      slug: "combination-sum-ii",
      level: 12,
      difficulty: "MEDIUM",
      topic: "Backtracking / Array",
      patternSlug: "backtracking",
      estimatedTimeMin: 20,
      statement: "Given a collection of candidate numbers (`candidates`) and a target number (`target`), find all unique combinations in `candidates` where the candidate numbers sum to `target`.\n\nEach number in `candidates` may only be used **once** in the combination. The solution set must not contain duplicate combinations.",
      functionName: "combinationSum2",
      parameters: [
        { name: "candidates", type: "number[]", description: "Array of integers with duplicates" },
        { name: "target", type: "number", description: "Target sum" }
      ],
      returnType: "number[][]",
      constraints: ["1 <= candidates.length <= 100", "1 <= candidates[i] <= 50", "1 <= target <= 30"],
      examples: [
        { input: "candidates = [10,1,2,7,6,1,5], target = 8", output: "[[1,1,6],[1,2,5],[1,7],[2,6]]", explanation: "All unique combinations summing to 8." },
        { input: "candidates = [2,5,2,1,2], target = 5", output: "[[1,2,2],[5]]", explanation: "Duplicates like [2,2,1] are only produced once." },
        { input: "candidates = [1], target = 2", output: "[]", explanation: "Target exceeds single candidate." },
        { input: "candidates = [1,1], target = 2", output: "[[1,1]]", explanation: "Single combination using both 1s." }
      ],
      optimalSolution: `function combinationSum2(candidates, target) {\n  candidates.sort((a, b) => a - b);\n  const res = [];\n  function backtrack(start, remain, path) {\n    if (remain === 0) {\n      res.push([...path]);\n      return;\n    }\n    for (let i = start; i < candidates.length; i++) {\n      if (candidates[i] > remain) break;\n      if (i > start && candidates[i] === candidates[i - 1]) continue;\n      path.push(candidates[i]);\n      backtrack(i + 1, remain - candidates[i], path);\n      path.pop();\n    }\n  }\n  backtrack(0, target, []);\n  return res;\n}`,
      optimalTimeComplexity: "O(2^N)",
      optimalSpaceComplexity: "O(N) recursion stack",
      suboptimalSolution: `function combinationSum2(candidates, target) {\n  candidates.sort((a, b) => a - b);\n  const res = [];\n  const seen = new Set();\n  function dfs(start, sum, path) {\n    if (sum === target) {\n      const key = path.join(',');\n      if (!seen.has(key)) { seen.add(key); res.push([...path]); }\n      return;\n    }\n    if (sum > target) return;\n    for (let i = start; i < candidates.length; i++) {\n      path.push(candidates[i]);\n      dfs(i + 1, sum + candidates[i], path);\n      path.pop();\n    }\n  }\n  dfs(0, 0, []);\n  return res;\n}`,
      suboptimalTimeComplexity: "O(2^N) with set deduplication overhead",
      suboptimalSpaceComplexity: "O(2^N)",
      commonMistakes: ["Passing `i` instead of `i + 1` (each element can only be used once)", "Omitting the duplicate check `if (i > start && candidates[i] === candidates[i - 1]) continue`"],
      hints: [
        "Sort `candidates` ascending.",
        "Skip duplicates at the same level: `if (i > start && candidates[i] === candidates[i - 1]) continue`.",
        "Advance `i + 1` to next level because each element can be chosen at most once."
      ],
      oracleFn: (candidates: number[], target: number) => {
        candidates.sort((a, b) => a - b);
        const res: number[][] = [];
        function backtrack(start: number, remain: number, path: number[]) {
          if (remain === 0) {
            res.push([...path]);
            return;
          }
          for (let i = start; i < candidates.length; i++) {
            if (candidates[i] > remain) break;
            if (i > start && candidates[i] === candidates[i - 1]) continue;
            path.push(candidates[i]);
            backtrack(i + 1, remain - candidates[i], path);
            path.pop();
          }
        }
        backtrack(0, target, []);
        return res;
      },
      testCases: {
        functional: [
          [[10, 1, 2, 7, 6, 1, 5], 8],
          [[2, 5, 2, 1, 2], 5],
          [[1], 2],
          [[1, 1], 2]
        ],
        boundary: [
          [[1], 1],
          [[1, 1, 1, 1], 2],
          [[3, 1, 3, 5, 1, 1], 8]
        ],
        adversarial: [
          [[1, 2, 2, 2, 5], 5],
          [[2, 2, 2, 2, 2], 6]
        ],
        stress: [
          [[1, 1, 1, 2, 2, 3, 4, 5, 6, 7], 10],
          [[2, 3, 5, 7, 11, 13, 17], 20]
        ]
      }
    }),

    // 265. Combination Sum III
    createProblem({
      num: 265,
      title: "Combination Sum III",
      slug: "combination-sum-iii",
      level: 12,
      difficulty: "MEDIUM",
      topic: "Backtracking",
      patternSlug: "backtracking",
      estimatedTimeMin: 15,
      statement: "Find all valid combinations of `k` numbers that sum up to `n` such that the following conditions are true:\n- Only numbers `1` through `9` are used.\n- Each number is used at most once.\n\nReturn a list of all possible valid combinations in any order.",
      functionName: "combinationSum3",
      parameters: [
        { name: "k", type: "number", description: "Count of numbers to use" },
        { name: "n", type: "number", description: "Target sum" }
      ],
      returnType: "number[][]",
      constraints: ["2 <= k <= 9", "1 <= n <= 60"],
      examples: [
        { input: "k = 3, n = 7", output: "[[1,2,4]]", explanation: "1 + 2 + 4 = 7. Only 1 unique valid combination." },
        { input: "k = 3, n = 9", output: "[[1,2,6],[1,3,5],[2,3,4]]", explanation: "All 3 valid length-3 combinations summing to 9." },
        { input: "k = 4, n = 1", output: "[]", explanation: "Minimum sum of 4 distinct positive numbers is 1+2+3+4=10 > 1, so empty." },
        { input: "k = 2, n = 18", output: "[]", explanation: "Max sum of 2 single digits is 9+8=17 < 18, so empty." }
      ],
      optimalSolution: `function combinationSum3(k, n) {\n  const res = [];\n  function backtrack(start, remain, path) {\n    if (path.length === k) {\n      if (remain === 0) res.push([...path]);\n      return;\n    }\n    for (let i = start; i <= 9; i++) {\n      if (i > remain) break;\n      path.push(i);\n      backtrack(i + 1, remain - i, path);\n      path.pop();\n    }\n  }\n  backtrack(1, n, []);\n  return res;\n}`,
      optimalTimeComplexity: "O(C(9, k))",
      optimalSpaceComplexity: "O(k) recursion stack",
      suboptimalSolution: `function combinationSum3(k, n) {\n  const res = [];\n  function dfs(start, sum, path) {\n    if (path.length === k) {\n      if (sum === n) res.push([...path]);\n      return;\n    }\n    for (let i = start; i <= 9; i++) {\n      if (sum + i > n) break;\n      path.push(i);\n      dfs(i + 1, sum + i, path);\n      path.pop();\n    }\n  }\n  dfs(1, 0, []);\n  return res;\n}`,
      suboptimalTimeComplexity: "O(C(9, k))",
      suboptimalSpaceComplexity: "O(k)",
      commonMistakes: ["Using numbers outside 1..9", "Re-using the same number twice"],
      hints: [
        "Backtrack picking digits strictly from `start` to 9.",
        "Break early when digit `i > remain`.",
        "Add path copy when `path.length === k && remain === 0`."
      ],
      oracleFn: (k: number, n: number) => {
        const res: number[][] = [];
        function backtrack(start: number, remain: number, path: number[]) {
          if (path.length === k) {
            if (remain === 0) res.push([...path]);
            return;
          }
          for (let i = start; i <= 9; i++) {
            if (i > remain) break;
            path.push(i);
            backtrack(i + 1, remain - i, path);
            path.pop();
          }
        }
        backtrack(1, n, []);
        return res;
      },
      testCases: {
        functional: [
          [3, 7],
          [3, 9],
          [4, 1],
          [2, 18]
        ],
        boundary: [
          [2, 3],
          [2, 17],
          [9, 45]
        ],
        adversarial: [
          [3, 15],
          [4, 24]
        ],
        stress: [
          [5, 25],
          [6, 30]
        ]
      }
    }),

    // 266. Letter Combinations of a Phone Number
    createProblem({
      num: 266,
      title: "Letter Combinations of a Phone Number",
      slug: "letter-combinations-of-a-phone-number",
      level: 12,
      difficulty: "MEDIUM",
      topic: "Backtracking / String",
      patternSlug: "backtracking",
      estimatedTimeMin: 20,
      statement: "Given a string containing digits from `2-9` inclusive, return all possible letter combinations that the number could represent. Return the answer in any order.\n\nA mapping of digits to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.\n2: \"abc\", 3: \"def\", 4: \"ghi\", 5: \"jkl\", 6: \"mno\", 7: \"pqrs\", 8: \"tuv\", 9: \"wxyz\".",
      functionName: "letterCombinations",
      parameters: [{ name: "digits", type: "string", description: "String of digits from 2-9" }],
      returnType: "string[]",
      constraints: ["0 <= digits.length <= 4", "digits[i] is a digit in the range ['2', '9']."],
      examples: [
        { input: 'digits = "23"', output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]', explanation: "Combinations of {a,b,c} and {d,e,f}." },
        { input: 'digits = ""', output: '[]', explanation: "Empty input returns empty array." },
        { input: 'digits = "2"', output: '["a","b","c"]', explanation: "Single digit mapping." },
        { input: 'digits = "7"', output: '["p","q","r","s"]', explanation: "Digit 7 has 4 letters." }
      ],
      optimalSolution: `function letterCombinations(digits) {\n  if (!digits || digits.length === 0) return [];\n  const phone = {\n    '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',\n    '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'\n  };\n  const res = [];\n  function backtrack(idx, current) {\n    if (idx === digits.length) {\n      res.push(current);\n      return;\n    }\n    const letters = phone[digits[idx]];\n    for (let i = 0; i < letters.length; i++) {\n      backtrack(idx + 1, current + letters[i]);\n    }\n  }\n  backtrack(0, "");\n  return res;\n}`,
      optimalTimeComplexity: "O(4^N * N)",
      optimalSpaceComplexity: "O(N) recursion stack",
      suboptimalSolution: `function letterCombinations(digits) {\n  if (!digits || !digits.length) return [];\n  const map = { '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl', '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz' };\n  let res = [''];\n  for (const d of digits) {\n    const next = [];\n    const chars = map[d];\n    for (const prefix of res) {\n      for (const c of chars) next.push(prefix + c);\n    }\n    res = next;\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(4^N * N)",
      suboptimalSpaceComplexity: "O(4^N)",
      commonMistakes: ["Returning `[\"\"]` instead of `[]` when `digits === \"\"`", "Incorrect letter counts for 7 (pqrs) and 9 (wxyz)"],
      hints: [
        "Create a lookup map mapping '2'..'9' to their respective letter strings.",
        "If digits is empty, return an empty array `[]` immediately.",
        "Recursively append each candidate letter for `digits[idx]` and advance `idx + 1`."
      ],
      oracleFn: (digits: string) => {
        if (!digits || digits.length === 0) return [];
        const phone: Record<string, string> = {
          '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
          '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
        };
        const res: string[] = [];
        function backtrack(idx: number, current: string) {
          if (idx === digits.length) {
            res.push(current);
            return;
          }
          const letters = phone[digits[idx]];
          for (let i = 0; i < letters.length; i++) {
            backtrack(idx + 1, current + letters[i]);
          }
        }
        backtrack(0, "");
        return res;
      },
      testCases: {
        functional: [
          ["23"],
          [""],
          ["2"],
          ["7"]
        ],
        boundary: [
          ["9"],
          ["22"],
          ["79"]
        ],
        adversarial: [
          ["234"],
          ["89"]
        ],
        stress: [
          ["7777"],
          ["9876"]
        ]
      }
    }),

    // 267. Generate Parentheses
    createProblem({
      num: 267,
      title: "Generate Parentheses",
      slug: "generate-parentheses",
      level: 12,
      difficulty: "MEDIUM",
      topic: "Backtracking / String",
      patternSlug: "backtracking",
      estimatedTimeMin: 20,
      statement: "Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
      functionName: "generateParenthesis",
      parameters: [{ name: "n", type: "number", description: "Number of pairs" }],
      returnType: "string[]",
      constraints: ["1 <= n <= 8"],
      examples: [
        { input: "n = 3", output: '["((()))","(()())","(())()","()(())","()()()"]', explanation: "All 5 valid combinations of 3 pairs." },
        { input: "n = 1", output: '["()"]', explanation: "Single pair." },
        { input: "n = 2", output: '["(())","()()"]', explanation: "Two pairs produce 2 combinations." },
        { input: "n = 4", output: '["(((())))","((()()))","((())())","((()))()","(()(()))","(()()())","(()())()","(())(())","(())()()","()((()))","()(()())","()(())()","()()(())","()()()()"]', explanation: "All 14 valid combinations for n = 4." }
      ],
      optimalSolution: `function generateParenthesis(n) {\n  const res = [];\n  function backtrack(open, close, current) {\n    if (current.length === 2 * n) {\n      res.push(current);\n      return;\n    }\n    if (open < n) backtrack(open + 1, close, current + '(');\n    if (close < open) backtrack(open, close + 1, current + ')');\n  }\n  backtrack(0, 0, "");\n  return res;\n}`,
      optimalTimeComplexity: "O(4^N / N^(1/2)) Catalan number",
      optimalSpaceComplexity: "O(N) recursion stack",
      suboptimalSolution: `function generateParenthesis(n) {\n  const res = [];\n  function isValid(s) {\n    let bal = 0;\n    for (const c of s) {\n      if (c === '(') bal++;\n      else bal--;\n      if (bal < 0) return false;\n    }\n    return bal === 0;\n  }\n  function generateAll(cur) {\n    if (cur.length === 2 * n) {\n      if (isValid(cur)) res.push(cur);\n      return;\n    }\n    generateAll(cur + '(');\n    generateAll(cur + ')');\n  }\n  generateAll("");\n  return res;\n}`,
      suboptimalTimeComplexity: "O(2^(2N) * N) generating all 2^(2N) strings",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Allowing `close < n` instead of `close < open` (which produces invalid prefixes like `)` )"],
      hints: [
        "Maintain counters `open` and `close`.",
        "Add '(' whenever `open < n`.",
        "Add ')' only when `close < open` to preserve valid parentheses invariants at all steps."
      ],
      oracleFn: (n: number) => {
        const res: string[] = [];
        function backtrack(open: number, close: number, current: string) {
          if (current.length === 2 * n) {
            res.push(current);
            return;
          }
          if (open < n) backtrack(open + 1, close, current + '(');
          if (close < open) backtrack(open, close + 1, current + ')');
        }
        backtrack(0, 0, "");
        return res;
      },
      testCases: {
        functional: [
          [3],
          [1],
          [2],
          [4]
        ],
        boundary: [
          [5],
          [6],
          [1],
          [2]
        ],
        adversarial: [
          [7],
          [3]
        ],
        stress: [
          [8]
        ]
      }
    }),

    // 268. Palindrome Partitioning
    createProblem({
      num: 268,
      title: "Palindrome Partitioning",
      slug: "palindrome-partitioning",
      level: 12,
      difficulty: "MEDIUM",
      topic: "Backtracking / Dynamic Programming",
      patternSlug: "backtracking",
      estimatedTimeMin: 25,
      statement: "Given a string `s`, partition `s` such that every substring of the partition is a palindrome. Return all possible palindrome partitioning of `s`.\n\nA palindrome string is a string that reads the same backward as forward.",
      functionName: "partition",
      parameters: [{ name: "s", type: "string", description: "Input string" }],
      returnType: "string[][]",
      constraints: ["1 <= s.length <= 16", "s contains only lowercase English letters."],
      examples: [
        { input: 's = "aab"', output: '[["a","a","b"],["aa","b"]]', explanation: "'a', 'a', 'b' are palindromes, and 'aa', 'b' are palindromes." },
        { input: 's = "a"', output: '[["a"]]', explanation: "Single character." },
        { input: 's = "racecar"', output: '[["r","a","c","e","c","a","r"],["r","a","cec","a","r"],["r","aceca","r"],["racecar"]]', explanation: "All palindrome segmentations." },
        { input: 's = "bb"', output: '[["b","b"],["bb"]]', explanation: "Two partitions." }
      ],
      optimalSolution: `function partition(s) {\n  const res = [];\n  const isPal = (str, l, r) => {\n    while (l < r) {\n      if (str[l++] !== str[r--]) return false;\n    }\n    return true;\n  };\n  function backtrack(start, path) {\n    if (start === s.length) {\n      res.push([...path]);\n      return;\n    }\n    for (let end = start; end < s.length; end++) {\n      if (isPal(s, start, end)) {\n        path.push(s.slice(start, end + 1));\n        backtrack(end + 1, path);\n        path.pop();\n      }\n    }\n  }\n  backtrack(0, []);\n  return res;\n}`,
      optimalTimeComplexity: "O(N * 2^N)",
      optimalSpaceComplexity: "O(N) recursion stack",
      suboptimalSolution: `function partition(s) {\n  const res = [];\n  function dfs(str, path) {\n    if (!str.length) { res.push(path); return; }\n    for (let i = 1; i <= str.length; i++) {\n      const sub = str.slice(0, i);\n      if (sub === sub.split('').reverse().join('')) {\n        dfs(str.slice(i), [...path, sub]);\n      }\n    }\n  }\n  dfs(s, []);\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N^2 * 2^N) slice and reverse overhead",
      suboptimalSpaceComplexity: "O(N * 2^N)",
      commonMistakes: ["Slice index off-by-one errors when checking palindrome bounds", "Forgetting to pop from path after backtracking"],
      hints: [
        "At index `start`, try every possible prefix `s[start..end]`.",
        "If `s[start..end]` is a palindrome, add it to `path` and recursively partition the remainder `end + 1`.",
        "When `start === s.length`, record a copy of `path`."
      ],
      oracleFn: (s: string) => {
        const res: string[][] = [];
        const isPal = (str: string, l: number, r: number) => {
          while (l < r) {
            if (str[l++] !== str[r--]) return false;
          }
          return true;
        };
        function backtrack(start: number, path: string[]) {
          if (start === s.length) {
            res.push([...path]);
            return;
          }
          for (let end = start; end < s.length; end++) {
            if (isPal(s, start, end)) {
              path.push(s.slice(start, end + 1));
              backtrack(end + 1, path);
              path.pop();
            }
          }
        }
        backtrack(0, []);
        return res;
      },
      testCases: {
        functional: [
          ["aab"],
          ["a"],
          ["racecar"],
          ["bb"]
        ],
        boundary: [
          ["aba"],
          ["abba"],
          ["cbbcc"]
        ],
        adversarial: [
          ["efe"],
          ["abacaba"]
        ],
        stress: [
          ["aaaaaaaa"],
          ["abcbaabcba"]
        ]
      }
    }),

    // 269. Restore IP Addresses
    createProblem({
      num: 269,
      title: "Restore IP Addresses",
      slug: "restore-ip-addresses",
      level: 12,
      difficulty: "MEDIUM",
      topic: "Backtracking / String",
      patternSlug: "backtracking",
      estimatedTimeMin: 25,
      statement: "A valid IP address consists of exactly four integers separated by single dots. Each integer is between `0` and `255` (inclusive) and cannot have leading zeros.\n\nFor example, \"0.1.2.201\" and \"192.168.1.1\" are valid IP addresses, but \"0.011.255.245\", \"192.168.1.312\" and \"192.168@1.1\" are invalid IP addresses.\n\nGiven a string `s` containing only digits, return all possible valid IP addresses that can be formed by inserting dots into `s`. You are not allowed to reorder or remove any digits in `s`.",
      functionName: "restoreIpAddresses",
      parameters: [{ name: "s", type: "string", description: "Digit string" }],
      returnType: "string[]",
      constraints: ["1 <= s.length <= 20", "s consists of digits only."],
      examples: [
        { input: 's = "25525511135"', output: '["255.255.11.135","255.255.111.35"]', explanation: "Two valid segmentations." },
        { input: 's = "0000"', output: '["0.0.0.0"]', explanation: "Only valid configuration." },
        { input: 's = "101023"', output: '["1.0.10.23","1.0.102.3","10.1.0.23","10.10.2.3","101.0.2.3"]', explanation: "Five valid configurations." },
        { input: 's = "010010"', output: '["0.10.0.10","0.100.1.0"]', explanation: "Handling zeros correctly." }
      ],
      optimalSolution: `function restoreIpAddresses(s) {\n  const res = [];\n  if (s.length < 4 || s.length > 12) return [];\n  function backtrack(start, dots, current) {\n    if (dots === 4) {\n      if (start === s.length) res.push(current.join('.'));\n      return;\n    }\n    for (let len = 1; len <= 3 && start + len <= s.length; len++) {\n      const segment = s.slice(start, start + len);\n      if (segment.length > 1 && segment[0] === '0') break;\n      if (Number(segment) > 255) break;\n      current.push(segment);\n      backtrack(start + len, dots + 1, current);\n      current.pop();\n    }\n  }\n  backtrack(0, 0, []);\n  return res;\n}`,
      optimalTimeComplexity: "O(3^4) = O(1) constant search space",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function restoreIpAddresses(s) {\n  const res = [];\n  for (let i = 1; i < 4 && i < s.length; i++) {\n    for (let j = i + 1; j < i + 4 && j < s.length; j++) {\n      for (let k = j + 1; k < j + 4 && k < s.length; k++) {\n        const a = s.slice(0, i), b = s.slice(i, j), c = s.slice(j, k), d = s.slice(k);\n        function valid(seg) {\n          if (!seg || seg.length > 3) return false;\n          if (seg.length > 1 && seg[0] === '0') return false;\n          return Number(seg) <= 255;\n        }\n        if (valid(a) && valid(b) && valid(c) && valid(d)) {\n          res.push(a + '.' + b + '.' + c + '.' + d);\n        }\n      }\n    }\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(1) 3-nested loop",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Allowing numbers > 255", "Allowing leading zeros for multi-digit segments like \"01\" or \"00\""],
      hints: [
        "A valid segment is 1 to 3 digits long, with value between 0 and 255.",
        "If a segment starts with '0', it must be of length 1 (i.e. '0').",
        "Stop early if remaining string length is less than remaining segments or greater than 3 * remaining segments."
      ],
      oracleFn: (s: string) => {
        const res: string[] = [];
        if (s.length < 4 || s.length > 12) return [];
        function backtrack(start: number, dots: number, current: string[]) {
          if (dots === 4) {
            if (start === s.length) res.push(current.join('.'));
            return;
          }
          for (let len = 1; len <= 3 && start + len <= s.length; len++) {
            const segment = s.slice(start, start + len);
            if (segment.length > 1 && segment[0] === '0') break;
            if (Number(segment) > 255) break;
            current.push(segment);
            backtrack(start + len, dots + 1, current);
            current.pop();
          }
        }
        backtrack(0, 0, []);
        return res;
      },
      testCases: {
        functional: [
          ["25525511135"],
          ["0000"],
          ["101023"],
          ["010010"]
        ],
        boundary: [
          ["1111"],
          ["255255255255"],
          ["999999999999"]
        ],
        adversarial: [
          ["172162541"],
          ["19216811"]
        ],
        stress: [
          ["123123123123"],
          ["100100100100"]
        ]
      }
    }),

    // 270. Letter Case Permutation
    createProblem({
      num: 270,
      title: "Letter Case Permutation",
      slug: "letter-case-permutation",
      level: 12,
      difficulty: "MEDIUM",
      topic: "Backtracking / Bit Manipulation",
      patternSlug: "backtracking",
      estimatedTimeMin: 15,
      statement: "Given a string `s`, you can transform every letter individually to be lowercase or uppercase to create another string.\n\nReturn a list of all possible strings we could create. Return the output in any order.",
      functionName: "letterCasePermutation",
      parameters: [{ name: "s", type: "string", description: "Input alphanumeric string" }],
      returnType: "string[]",
      constraints: ["1 <= s.length <= 12", "s consists of lowercase English letters, uppercase English letters, and digits."],
      examples: [
        { input: 's = "a1b2"', output: '["a1b2","a1B2","A1b2","A1B2"]', explanation: "4 permutations corresponding to upper and lower variants of a and b." },
        { input: 's = "3z4"', output: '["3z4","3Z4"]', explanation: "2 permutations." },
        { input: 's = "12345"', output: '["12345"]', explanation: "No letters, exactly 1 permutation." },
        { input: 's = "a"', output: '["a","A"]', explanation: "Two single-character variants." }
      ],
      optimalSolution: `function letterCasePermutation(s) {\n  const res = [];\n  function backtrack(idx, current) {\n    if (idx === s.length) {\n      res.push(current);\n      return;\n    }\n    const ch = s[idx];\n    if (ch >= '0' && ch <= '9') {\n      backtrack(idx + 1, current + ch);\n    } else {\n      backtrack(idx + 1, current + ch.toLowerCase());\n      backtrack(idx + 1, current + ch.toUpperCase());\n    }\n  }\n  backtrack(0, "");\n  return res;\n}`,
      optimalTimeComplexity: "O(2^N * N)",
      optimalSpaceComplexity: "O(N) recursion stack",
      suboptimalSolution: `function letterCasePermutation(s) {\n  let res = [''];\n  for (const c of s) {\n    if (c >= '0' && c <= '9') {\n      res = res.map(str => str + c);\n    } else {\n      res = [...res.map(str => str + c.toLowerCase()), ...res.map(str => str + c.toUpperCase())];\n    }\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(2^N * N)",
      suboptimalSpaceComplexity: "O(2^N * N)",
      commonMistakes: ["Transforming digits (digits must remain unchanged)", "Case-sensitivity bugs with special characters"],
      hints: [
        "If `s[idx]` is a digit, simply append it and recurse `idx + 1`.",
        "If `s[idx]` is a letter, branch into two calls: one with `toLowerCase()`, one with `toUpperCase()`.",
        "Base case: `idx === s.length`."
      ],
      oracleFn: (s: string) => {
        const res: string[] = [];
        function backtrack(idx: number, current: string) {
          if (idx === s.length) {
            res.push(current);
            return;
          }
          const ch = s[idx];
          if (ch >= '0' && ch <= '9') {
            backtrack(idx + 1, current + ch);
          } else {
            backtrack(idx + 1, current + ch.toLowerCase());
            backtrack(idx + 1, current + ch.toUpperCase());
          }
        }
        backtrack(0, "");
        return res;
      },
      testCases: {
        functional: [
          ["a1b2"],
          ["3z4"],
          ["12345"],
          ["a"]
        ],
        boundary: [
          ["z"],
          ["0"],
          ["ab"]
        ],
        adversarial: [
          ["C"],
          ["RmR"]
        ],
        stress: [
          ["a1b2c3d4"],
          ["abcdefgh"]
        ]
      }
    }),

    // 271. Beautiful Arrangement
    createProblem({
      num: 271,
      title: "Beautiful Arrangement",
      slug: "beautiful-arrangement",
      level: 12,
      difficulty: "MEDIUM",
      topic: "Backtracking / Bit Manipulation",
      patternSlug: "backtracking",
      estimatedTimeMin: 20,
      statement: "Suppose you have `n` integers labeled `1` through `n`. A permutation of those `n` integers `perm` (1-indexed) is considered a beautiful arrangement if for every `i` (1 <= i <= n), either of the following is true:\n- `perm[i]` is divisible by `i`.\n- `i` is divisible by `perm[i]`.\n\nGiven an integer `n`, return the number of the beautiful arrangements that you can construct.",
      functionName: "countArrangement",
      parameters: [{ name: "n", type: "number", description: "Number of elements" }],
      returnType: "number",
      constraints: ["1 <= n <= 15"],
      examples: [
        { input: "n = 2", output: "2", explanation: "Permutations [1, 2] and [2, 1] are both beautiful." },
        { input: "n = 1", output: "1", explanation: "Only [1] is possible." },
        { input: "n = 3", output: "3", explanation: "[1, 2, 3], [2, 1, 3], and [3, 2, 1] are beautiful." },
        { input: "n = 4", output: "8", explanation: "8 valid beautiful arrangements." }
      ],
      optimalSolution: `function countArrangement(n) {\n  let count = 0;\n  const visited = new Array(n + 1).fill(false);\n  function backtrack(pos) {\n    if (pos > n) {\n      count++;\n      return;\n    }\n    for (let num = 1; num <= n; num++) {\n      if (!visited[num] && (num % pos === 0 || pos % num === 0)) {\n        visited[num] = true;\n        backtrack(pos + 1);\n        visited[num] = false;\n      }\n    }\n  }\n  backtrack(1);\n  return count;\n}`,
      optimalTimeComplexity: "O(K) where K is number of valid permutations << n!",
      optimalSpaceComplexity: "O(n) recursion stack",
      suboptimalSolution: `function countArrangement(n) {\n  const nums = Array.from({ length: n }, (_, i) => i + 1);\n  let count = 0;\n  function permute(arr, idx) {\n    if (idx === n) { count++; return; }\n    for (let i = idx; i < n; i++) {\n      const temp = arr[idx]; arr[idx] = arr[i]; arr[i] = temp;\n      if (arr[idx] % (idx + 1) === 0 || (idx + 1) % arr[idx] === 0) {\n        permute(arr, idx + 1);\n      }\n      const back = arr[idx]; arr[idx] = arr[i]; arr[i] = back;\n    }\n  }\n  permute(nums, 0);\n  return count;\n}`,
      suboptimalTimeComplexity: "O(N!)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Generating all N! permutations before filtering (TLE)", "Using 0-indexing instead of 1-indexing for divisibility checks"],
      hints: [
        "Place numbers into positions 1 through `n` one by one.",
        "Prune immediately if `num % pos !== 0 && pos % num !== 0`.",
        "Backtrack: unmark `visited[num]` upon returning."
      ],
      oracleFn: (n: number) => {
        let count = 0;
        const visited = new Array(n + 1).fill(false);
        function backtrack(pos: number) {
          if (pos > n) {
            count++;
            return;
          }
          for (let num = 1; num <= n; num++) {
            if (!visited[num] && (num % pos === 0 || pos % num === 0)) {
              visited[num] = true;
              backtrack(pos + 1);
              visited[num] = false;
            }
          }
        }
        backtrack(1);
        return count;
      },
      testCases: {
        functional: [
          [2],
          [1],
          [3],
          [4]
        ],
        boundary: [
          [5],
          [6],
          [7]
        ],
        adversarial: [
          [8],
          [9]
        ],
        stress: [
          [11],
          [13]
        ]
      }
    }),

    // 272. Matchsticks to Square
    createProblem({
      num: 272,
      title: "Matchsticks to Square",
      slug: "matchsticks-to-square",
      level: 12,
      difficulty: "MEDIUM",
      topic: "Backtracking / Bitmask",
      patternSlug: "backtracking",
      estimatedTimeMin: 25,
      statement: "You are given an integer array `matchsticks` where `matchsticks[i]` is the length of the `i-th` matchstick. You want to use all the matchsticks to make one square. You should not break any stick, but you can link them up, and each matchstick must be used exactly one time.\n\nReturn `true` if you can make this square and `false` otherwise.",
      functionName: "makesquare",
      parameters: [{ name: "matchsticks", type: "number[]", description: "Array of matchstick lengths" }],
      returnType: "boolean",
      constraints: ["1 <= matchsticks.length <= 15", "1 <= matchsticks[i] <= 10^8"],
      examples: [
        { input: "matchsticks = [1,1,2,2,2]", output: "true", explanation: "Can form a square of side length 2: (1+1, 2, 2, 2)." },
        { input: "matchsticks = [3,3,3,3,4]", output: "false", explanation: "Total sum 16 is divisible by 4, but stick 4 cannot pair with 3s to form equal sides." },
        { input: "matchsticks = [5,5,5,5]", output: "true", explanation: "4 identical sides of length 5." },
        { input: "matchsticks = [1,2,3,4,5,6,7,8]", output: "false", explanation: "Sum 36 / 4 = 9, cannot partition into 4 equal sides." }
      ],
      optimalSolution: `function makesquare(matchsticks) {\n  const total = matchsticks.reduce((a, b) => a + b, 0);\n  if (total % 4 !== 0 || matchsticks.length < 4) return false;\n  const side = total / 4;\n  // Sort descending to place large matchsticks first and fail early\n  matchsticks.sort((a, b) => b - a);\n  if (matchsticks[0] > side) return false;\n  const sides = [0, 0, 0, 0];\n  function backtrack(idx) {\n    if (idx === matchsticks.length) {\n      return sides[0] === side && sides[1] === side && sides[2] === side && sides[3] === side;\n    }\n    for (let i = 0; i < 4; i++) {\n      if (sides[i] + matchsticks[idx] > side) continue;\n      let j = i;\n      while (--j >= 0) if (sides[i] === sides[j]) break;\n      if (j !== -1) continue;\n      sides[i] += matchsticks[idx];\n      if (backtrack(idx + 1)) return true;\n      sides[i] -= matchsticks[idx];\n    }\n    return false;\n  }\n  return backtrack(0);\n}`,
      optimalTimeComplexity: "O(4^N)",
      optimalSpaceComplexity: "O(N) recursion stack",
      suboptimalSolution: `function makesquare(matchsticks) {\n  const total = matchsticks.reduce((a, b) => a + b, 0);\n  if (total % 4 !== 0) return false;\n  const side = total / 4;\n  const sides = [0, 0, 0, 0];\n  function dfs(idx) {\n    if (idx === matchsticks.length) return true;\n    for (let i = 0; i < 4; i++) {\n      if (sides[i] + matchsticks[idx] <= side) {\n        sides[i] += matchsticks[idx];\n        if (dfs(idx + 1)) return true;\n        sides[i] -= matchsticks[idx];\n      }\n    }\n    return false;\n  }\n  return dfs(0);\n}`,
      suboptimalTimeComplexity: "O(4^N) without sorting and duplicate branch pruning",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Not sorting descending (placing smaller sticks first leads to exponential search blowup)", "Not checking `total % 4 === 0` initially"],
      hints: [
        "If total sum is not divisible by 4, return false immediately.",
        "Sort matchsticks descending: large sticks fail early if they cannot fit.",
        "Symmetry pruning: if `sides[i] === sides[j]` for some `j < i`, placing in side `i` is identical to side `j`."
      ],
      oracleFn: (matchsticks: number[]) => {
        const total = matchsticks.reduce((a, b) => a + b, 0);
        if (total % 4 !== 0 || matchsticks.length < 4) return false;
        const side = total / 4;
        const copy = [...matchsticks].sort((a, b) => b - a);
        if (copy[0] > side) return false;
        const sides = [0, 0, 0, 0];
        function backtrack(idx: number): boolean {
          if (idx === copy.length) {
            return sides[0] === side && sides[1] === side && sides[2] === side && sides[3] === side;
          }
          for (let i = 0; i < 4; i++) {
            if (sides[i] + copy[idx] > side) continue;
            let j = i;
            while (--j >= 0) if (sides[i] === sides[j]) break;
            if (j !== -1) continue;
            sides[i] += copy[idx];
            if (backtrack(idx + 1)) return true;
            sides[i] -= copy[idx];
          }
          return false;
        }
        return backtrack(0);
      },
      testCases: {
        functional: [
          [[1, 1, 2, 2, 2]],
          [[3, 3, 3, 3, 4]],
          [[5, 5, 5, 5]],
          [[1, 2, 3, 4, 5, 6, 7, 8]]
        ],
        boundary: [
          [[1, 1, 1, 1]],
          [[1, 2, 3]],
          [[10, 10, 10, 10]]
        ],
        adversarial: [
          [[5, 5, 5, 5, 4, 4, 4, 4, 3, 3, 3, 3]],
          [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]
        ],
        stress: [
          [[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]],
          [[4, 3, 2, 3, 5, 2, 1, 4, 4, 4, 4, 4]]
        ]
      }
    }),

    // 273. Partition to K Equal Sum Subsets
    createProblem({
      num: 273,
      title: "Partition to K Equal Sum Subsets",
      slug: "partition-to-k-equal-sum-subsets",
      level: 12,
      difficulty: "MEDIUM",
      topic: "Backtracking / Bitmask",
      patternSlug: "backtracking",
      estimatedTimeMin: 25,
      statement: "Given an integer array `nums` and an integer `k`, return `true` if it is possible to divide this array into `k` non-empty subsets whose sums are all equal.",
      functionName: "canPartitionKSubsets",
      parameters: [
        { name: "nums", type: "number[]", description: "Array of integers" },
        { name: "k", type: "number", description: "Number of subsets" }
      ],
      returnType: "boolean",
      constraints: ["1 <= k <= nums.length <= 16", "1 <= nums[i] <= 10^4", "The frequency of each element is in the range [1, 4]."],
      examples: [
        { input: "nums = [4,3,2,3,5,2,1], k = 4", output: "true", explanation: "Sum = 20 / 4 = 5. Subsets: (5), (1, 4), (2, 3), (2, 3)." },
        { input: "nums = [1,2,3,4], k = 3", output: "false", explanation: "Sum 10 is not divisible by 3." },
        { input: "nums = [2,2,2,2], k = 2", output: "true", explanation: "Two equal subsets (2, 2) and (2, 2)." },
        { input: "nums = [1,1,1,1], k = 4", output: "true", explanation: "4 singleton subsets." }
      ],
      optimalSolution: `function canPartitionKSubsets(nums, k) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  if (total % k !== 0) return false;\n  const target = total / k;\n  nums.sort((a, b) => b - a);\n  if (nums[0] > target) return false;\n  const visited = new Array(nums.length).fill(false);\n  function backtrack(kLeft, start, currentSum) {\n    if (kLeft === 1) return true;\n    if (currentSum === target) return backtrack(kLeft - 1, 0, 0);\n    for (let i = start; i < nums.length; i++) {\n      if (visited[i] || currentSum + nums[i] > target) continue;\n      visited[i] = true;\n      if (backtrack(kLeft, i + 1, currentSum + nums[i])) return true;\n      visited[i] = false;\n      if (currentSum === 0) break;\n    }\n    return false;\n  }\n  return backtrack(k, 0, 0);\n}`,
      optimalTimeComplexity: "O(k * 2^N)",
      optimalSpaceComplexity: "O(N) recursion stack",
      suboptimalSolution: `function canPartitionKSubsets(nums, k) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  if (total % k !== 0) return false;\n  const target = total / k;\n  const buckets = new Array(k).fill(0);\n  function dfs(idx) {\n    if (idx === nums.length) return true;\n    for (let i = 0; i < k; i++) {\n      if (buckets[i] + nums[idx] <= target) {\n        buckets[i] += nums[idx];\n        if (dfs(idx + 1)) return true;\n        buckets[i] -= nums[idx];\n      }\n    }\n    return false;\n  }\n  return dfs(0);\n}`,
      suboptimalTimeComplexity: "O(k^N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Trying to assign numbers to buckets (k^N) instead of building subset by subset (k * 2^N)", "Not breaking when `currentSum === 0` after failed branch"],
      hints: [
        "If total sum % k !== 0, return false.",
        "Build subsets one by one: when `currentSum === target`, start next subset with `kLeft - 1`.",
        "Sort descending to prune large numbers immediately."
      ],
      oracleFn: (nums: number[], k: number) => {
        const total = nums.reduce((a, b) => a + b, 0);
        if (total % k !== 0) return false;
        const target = total / k;
        const copy = [...nums].sort((a, b) => b - a);
        if (copy[0] > target) return false;
        const visited = new Array(copy.length).fill(false);
        function backtrack(kLeft: number, start: number, curSum: number): boolean {
          if (kLeft === 1) return true;
          if (curSum === target) return backtrack(kLeft - 1, 0, 0);
          for (let i = start; i < copy.length; i++) {
            if (visited[i] || curSum + copy[i] > target) continue;
            visited[i] = true;
            if (backtrack(kLeft, i + 1, curSum + copy[i])) return true;
            visited[i] = false;
            if (curSum === 0) break;
          }
          return false;
        }
        return backtrack(k, 0, 0);
      },
      testCases: {
        functional: [
          [[4, 3, 2, 3, 5, 2, 1], 4],
          [[1, 2, 3, 4], 3],
          [[2, 2, 2, 2], 2],
          [[1, 1, 1, 1], 4]
        ],
        boundary: [
          [[5], 1],
          [[1, 2, 3], 2],
          [[10, 10, 10, 10], 4]
        ],
        adversarial: [
          [[2, 2, 2, 2, 3, 4, 5], 4],
          [[1, 2, 3, 4, 5, 6, 7], 4]
        ],
        stress: [
          [[1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3], 4],
          [[4, 4, 4, 4, 4, 4, 4, 4], 4]
        ]
      }
    }),

    // 274. Combination Sum IV
    createProblem({
      num: 274,
      title: "Combination Sum IV",
      slug: "combination-sum-iv",
      level: 12,
      difficulty: "MEDIUM",
      topic: "Dynamic Programming / Backtracking Memoization",
      patternSlug: "backtracking",
      estimatedTimeMin: 20,
      statement: "Given an array of distinct integers `nums` and a target integer `target`, return the number of possible combinations that add up to `target`.\n\nThe test cases are generated so that the answer can fit in a 32-bit integer. Note that different sequences count as different combinations (ordered combinations / permutations).",
      functionName: "combinationSum4",
      parameters: [
        { name: "nums", type: "number[]", description: "Array of distinct positive integers" },
        { name: "target", type: "number", description: "Target integer" }
      ],
      returnType: "number",
      constraints: ["1 <= nums.length <= 200", "1 <= nums[i] <= 1000", "All the elements of nums are unique.", "1 <= target <= 1000"],
      examples: [
        { input: "nums = [1,2,3], target = 4", output: "7", explanation: "Valid combinations are: (1,1,1,1), (1,1,2), (1,2,1), (1,3), (2,1,1), (2,2), (3,1)." },
        { input: "nums = [9], target = 3", output: "0", explanation: "Target cannot be formed." },
        { input: "nums = [1,2], target = 3", output: "3", explanation: "(1,1,1), (1,2), (2,1)." },
        { input: "nums = [1], target = 5", output: "1", explanation: "Only (1,1,1,1,1)." }
      ],
      optimalSolution: `function combinationSum4(nums, target) {\n  const dp = new Array(target + 1).fill(0);\n  dp[0] = 1;\n  for (let i = 1; i <= target; i++) {\n    for (const num of nums) {\n      if (i >= num) dp[i] += dp[i - num];\n    }\n  }\n  return dp[target];\n}`,
      optimalTimeComplexity: "O(target * N)",
      optimalSpaceComplexity: "O(target)",
      suboptimalSolution: `function combinationSum4(nums, target) {\n  const memo = new Map();\n  function dfs(remain) {\n    if (remain === 0) return 1;\n    if (remain < 0) return 0;\n    if (memo.has(remain)) return memo.get(remain);\n    let count = 0;\n    for (const num of nums) {\n      count += dfs(remain - num);\n    }\n    memo.set(remain, count);\n    return count;\n  }\n  return dfs(target);\n}`,
      suboptimalTimeComplexity: "O(target * N)",
      suboptimalSpaceComplexity: "O(target) map and stack",
      commonMistakes: ["Confusing with Unbounded Knapsack (where order does not matter); here different orders count as distinct"],
      hints: [
        "Since order matters (e.g. (1, 2) is distinct from (2, 1)), outer loop iterates target `i`, inner loop iterates numbers.",
        "dp[i] represents count of ways to sum to i.",
        "Base case: dp[0] = 1."
      ],
      oracleFn: (nums: number[], target: number) => {
        const dp = new Array(target + 1).fill(0);
        dp[0] = 1;
        for (let i = 1; i <= target; i++) {
          for (const num of nums) {
            if (i >= num) dp[i] += dp[i - num];
          }
        }
        return dp[target];
      },
      testCases: {
        functional: [
          [[1, 2, 3], 4],
          [[9], 3],
          [[1, 2], 3],
          [[1], 5]
        ],
        boundary: [
          [[1], 1],
          [[2], 3],
          [[2, 4], 7]
        ],
        adversarial: [
          [[1, 2, 4], 10],
          [[2, 3, 5], 12]
        ],
        stress: [
          [[1, 2, 3], 30],
          [[2, 3, 4, 5], 35]
        ]
      }
    }),

    // 275. Word Search
    createProblem({
      num: 275,
      title: "Word Search",
      slug: "word-search",
      level: 12,
      difficulty: "MEDIUM",
      topic: "Backtracking / Matrix",
      patternSlug: "backtracking",
      estimatedTimeMin: 25,
      statement: "Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.\n\nThe word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.",
      functionName: "exist",
      parameters: [
        { name: "board", type: "string[][]", description: "2D character grid" },
        { name: "word", type: "string", description: "Target word" }
      ],
      returnType: "boolean",
      constraints: ["m == board.length", "n == board[i].length", "1 <= m, n <= 6", "1 <= word.length <= 15", "board and word consist of only lowercase and uppercase English letters."],
      examples: [
        { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: "true", explanation: "Word exists along path A->B->C->C->E->D." },
        { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"', output: "true", explanation: "Path S->E->E exists." },
        { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"', output: "false", explanation: "Cell B cannot be reused." },
        { input: 'board = [["a"]], word = "a"', output: "true", explanation: "Single cell match." }
      ],
      optimalSolution: `function exist(board, word) {\n  const R = board.length, C = board[0].length;\n  function dfs(r, c, idx) {\n    if (idx === word.length) return true;\n    if (r < 0 || r >= R || c < 0 || c >= C || board[r][c] !== word[idx]) return false;\n    const temp = board[r][c];\n    board[r][c] = '#'; // Mark visited in-place\n    const found = dfs(r + 1, c, idx + 1) || dfs(r - 1, c, idx + 1) ||\n                  dfs(r, c + 1, idx + 1) || dfs(r, c - 1, idx + 1);\n    board[r][c] = temp; // Restore\n    return found;\n  }\n  for (let r = 0; r < R; r++) {\n    for (let c = 0; c < C; c++) {\n      if (dfs(r, c, 0)) return true;\n    }\n  }\n  return false;\n}`,
      optimalTimeComplexity: "O(R * C * 3^L) where L is word length",
      optimalSpaceComplexity: "O(L) recursion stack",
      suboptimalSolution: `function exist(board, word) {\n  const R = board.length, C = board[0].length;\n  const visited = Array.from({ length: R }, () => new Array(C).fill(false));\n  function dfs(r, c, idx) {\n    if (idx === word.length) return true;\n    if (r < 0 || r >= R || c < 0 || c >= C || visited[r][c] || board[r][c] !== word[idx]) return false;\n    visited[r][c] = true;\n    const found = dfs(r + 1, c, idx + 1) || dfs(r - 1, c, idx + 1) || dfs(r, c + 1, idx + 1) || dfs(r, c - 1, idx + 1);\n    visited[r][c] = false;\n    return found;\n  }\n  for (let r = 0; r < R; r++) {\n    for (let c = 0; c < C; c++) {\n      if (dfs(r, c, 0)) return true;\n    }\n  }\n  return false;\n}`,
      suboptimalTimeComplexity: "O(R * C * 3^L)",
      suboptimalSpaceComplexity: "O(R * C) matrix space",
      commonMistakes: ["Forgetting to backtrack and restore board cell character", "Allowing diagonal steps (only horizontally and vertically neighboring cells are allowed)"],
      hints: [
        "Iterate over every cell `(r, c)` as a potential starting letter `word[0]`.",
        "Perform DFS in 4 directions: (r+1,c), (r-1,c), (r,c+1), (r,c-1).",
        "Mark cell in-place with '#' to prevent reusing it in the same word path, then restore on backtrack."
      ],
      oracleFn: (board: string[][], word: string) => {
        const R = board.length, C = board[0].length;
        const b = board.map(row => [...row]);
        function dfs(r: number, c: number, idx: number): boolean {
          if (idx === word.length) return true;
          if (r < 0 || r >= R || c < 0 || c >= C || b[r][c] !== word[idx]) return false;
          const temp = b[r][c];
          b[r][c] = '#';
          const found = dfs(r + 1, c, idx + 1) || dfs(r - 1, c, idx + 1) ||
                        dfs(r, c + 1, idx + 1) || dfs(r, c - 1, idx + 1);
          b[r][c] = temp;
          return found;
        }
        for (let r = 0; r < R; r++) {
          for (let c = 0; c < C; c++) {
            if (dfs(r, c, 0)) return true;
          }
        }
        return false;
      },
      testCases: {
        functional: [
          [[["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "ABCCED"],
          [[["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "SEE"],
          [[["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "ABCB"],
          [[["a"]], "a"]
        ],
        boundary: [
          [[["a"]], "b"],
          [[["a", "b"], ["c", "d"]], "abcd"],
          [[["a", "b"], ["c", "d"]], "acdb"]
        ],
        adversarial: [
          [[["A", "B", "C", "E"], ["S", "F", "E", "S"], ["A", "D", "E", "E"]], "ABCESEEEFS"],
          [[["a", "a", "a"], ["a", "a", "a"], ["a", "a", "a"]], "aaaaaaaaa"]
        ],
        stress: [
          [[["A", "B", "C", "D"], ["E", "F", "G", "H"], ["I", "J", "K", "L"], ["M", "N", "O", "P"]], "AFKP"],
          [[["A", "A", "A", "A"], ["A", "A", "A", "A"], ["A", "A", "A", "A"], ["A", "A", "A", "B"]], "AAAAAAAAAAAAAAB"]
        ]
      }
    }),

    // 276. N-Queens
    createProblem({
      num: 276,
      title: "N-Queens",
      slug: "n-queens",
      level: 12,
      difficulty: "HARD",
      topic: "Backtracking",
      patternSlug: "backtracking",
      estimatedTimeMin: 30,
      statement: "The n-queens puzzle is the problem of placing `n` queens on an `n x n` chessboard such that no two queens attack each other.\n\nGiven an integer `n`, return all distinct solutions to the n-queens puzzle. You may return the answer in any order.\n\nEach solution contains a distinct board configuration of the n-queens' placement, where 'Q' and '.' both indicate a queen and an empty space, respectively.",
      functionName: "solveNQueens",
      parameters: [{ name: "n", type: "number", description: "Board size n" }],
      returnType: "string[][]",
      constraints: ["1 <= n <= 9"],
      examples: [
        { input: "n = 4", output: '[([".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."])]', explanation: "Two distinct 4-queens configurations." },
        { input: "n = 1", output: '[["Q"]]', explanation: "Single queen board." },
        { input: "n = 2", output: "[]", explanation: "No solution possible for n = 2." },
        { input: "n = 3", output: "[]", explanation: "No solution possible for n = 3." }
      ],
      optimalSolution: `function solveNQueens(n) {\n  const res = [];\n  const cols = new Set();\n  const diag1 = new Set(); // r - c\n  const diag2 = new Set(); // r + c\n  const board = Array.from({ length: n }, () => new Array(n).fill('.'));\n  function backtrack(r) {\n    if (r === n) {\n      res.push(board.map(row => row.join('')));\n      return;\n    }\n    for (let c = 0; c < n; c++) {\n      if (cols.has(c) || diag1.has(r - c) || diag2.has(r + c)) continue;\n      cols.add(c);\n      diag1.add(r - c);\n      diag2.add(r + c);\n      board[r][c] = 'Q';\n      backtrack(r + 1);\n      cols.delete(c);\n      diag1.delete(r - c);\n      diag2.delete(r + c);\n      board[r][c] = '.';\n    }\n  }\n  backtrack(0);\n  return res;\n}`,
      optimalTimeComplexity: "O(N!)",
      optimalSpaceComplexity: "O(N) sets and recursion stack",
      suboptimalSolution: `function solveNQueens(n) {\n  const res = [];\n  const board = Array.from({ length: n }, () => new Array(n).fill('.'));\n  function isSafe(r, c) {\n    for (let i = 0; i < r; i++) {\n      if (board[i][c] === 'Q') return false;\n      const diff = r - i;\n      if (c - diff >= 0 && board[i][c - diff] === 'Q') return false;\n      if (c + diff < n && board[i][c + diff] === 'Q') return false;\n    }\n    return true;\n  }\n  function dfs(r) {\n    if (r === n) { res.push(board.map(row => row.join(''))); return; }\n    for (let c = 0; c < n; c++) {\n      if (isSafe(r, c)) {\n        board[r][c] = 'Q';\n        dfs(r + 1);\n        board[r][c] = '.';\n      }\n    }\n  }\n  dfs(0);\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N^2 * N!) with linear isSafe checks",
      suboptimalSpaceComplexity: "O(N^2)",
      commonMistakes: ["Failing to check both major diagonal (r - c) and minor diagonal (r + c)", "Not reverting board and set states when backtracking"],
      hints: [
        "Place one queen per row.",
        "Use 3 sets for O(1) conflict detection: `cols`, `diag1 (r - c)`, and `diag2 (r + c)`.",
        "When `r === n`, format the board into strings and add to result."
      ],
      oracleFn: (n: number) => {
        const res: string[][] = [];
        const cols = new Set<number>();
        const diag1 = new Set<number>();
        const diag2 = new Set<number>();
        const board = Array.from({ length: n }, () => new Array(n).fill('.'));
        function backtrack(r: number) {
          if (r === n) {
            res.push(board.map(row => row.join('')));
            return;
          }
          for (let c = 0; c < n; c++) {
            if (cols.has(c) || diag1.has(r - c) || diag2.has(r + c)) continue;
            cols.add(c);
            diag1.add(r - c);
            diag2.add(r + c);
            board[r][c] = 'Q';
            backtrack(r + 1);
            cols.delete(c);
            diag1.delete(r - c);
            diag2.delete(r + c);
            board[r][c] = '.';
          }
        }
        backtrack(0);
        return res;
      },
      testCases: {
        functional: [
          [4],
          [1],
          [2],
          [3]
        ],
        boundary: [
          [5],
          [6],
          [1],
          [2]
        ],
        adversarial: [
          [7],
          [8],
          [4]
        ],
        stress: [
          [9]
        ]
      }
    }),

    // 277. N-Queens II
    createProblem({
      num: 277,
      title: "N-Queens II",
      slug: "n-queens-ii",
      level: 12,
      difficulty: "HARD",
      topic: "Backtracking / Bit Manipulation",
      patternSlug: "backtracking",
      estimatedTimeMin: 20,
      statement: "The n-queens puzzle is the problem of placing `n` queens on an `n x n` chessboard such that no two queens attack each other.\n\nGiven an integer `n`, return the number of distinct solutions to the n-queens puzzle.",
      functionName: "totalNQueens",
      parameters: [{ name: "n", type: "number", description: "Board size n" }],
      returnType: "number",
      constraints: ["1 <= n <= 9"],
      examples: [
        { input: "n = 4", output: "2", explanation: "There are two distinct solutions to the 4-queens puzzle." },
        { input: "n = 1", output: "1", explanation: "1 solution." },
        { input: "n = 2", output: "0", explanation: "No solution." },
        { input: "n = 3", output: "0", explanation: "No solution." }
      ],
      optimalSolution: `function totalNQueens(n) {\n  let count = 0;\n  let cols = 0, diag1 = 0, diag2 = 0;\n  function backtrack(row) {\n    if (row === n) { count++; return; }\n    for (let col = 0; col < n; col++) {\n      const d1 = 1 << (row - col + n);\n      const d2 = 1 << (row + col);\n      const c = 1 << col;\n      if ((cols & c) || (diag1 & d1) || (diag2 & d2)) continue;\n      cols |= c; diag1 |= d1; diag2 |= d2;\n      backtrack(row + 1);\n      cols &= ~c; diag1 &= ~d1; diag2 &= ~d2;\n    }\n  }\n  backtrack(0);\n  return count;\n}`,
      optimalTimeComplexity: "O(N!)",
      optimalSpaceComplexity: "O(N) recursion stack",
      suboptimalSolution: `function totalNQueens(n) {\n  let c = 0;\n  const cols = new Set(), d1 = new Set(), d2 = new Set();\n  function dfs(r) {\n    if (r === n) { c++; return; }\n    for (let col = 0; col < n; col++) {\n      if (cols.has(col) || d1.has(r - col) || d2.has(r + col)) continue;\n      cols.add(col); d1.add(r - col); d2.add(r + col);\n      dfs(r + 1);\n      cols.delete(col); d1.delete(r - col); d2.delete(r + col);\n    }\n  }\n  dfs(0);\n  return c;\n}`,
      suboptimalTimeComplexity: "O(N!)",
      suboptimalSpaceComplexity: "O(N) set overhead",
      commonMistakes: ["Constructing full board strings instead of simply incrementing an integer counter"],
      hints: [
        "Instead of storing the board configurations, maintain a running count.",
        "Bitmask optimization: use bitwise masks for `cols`, `diag1`, and `diag2` for maximum speed."
      ],
      oracleFn: (n: number) => {
        let count = 0;
        let cols = 0, diag1 = 0, diag2 = 0;
        function backtrack(row: number) {
          if (row === n) { count++; return; }
          for (let col = 0; col < n; col++) {
            const d1 = 1 << (row - col + n);
            const d2 = 1 << (row + col);
            const c = 1 << col;
            if ((cols & c) || (diag1 & d1) || (diag2 & d2)) continue;
            cols |= c; diag1 |= d1; diag2 |= d2;
            backtrack(row + 1);
            cols &= ~c; diag1 &= ~d1; diag2 &= ~d2;
          }
        }
        backtrack(0);
        return count;
      },
      testCases: {
        functional: [
          [4],
          [1],
          [2],
          [3]
        ],
        boundary: [
          [5],
          [6],
          [1],
          [2]
        ],
        adversarial: [
          [7],
          [8],
          [4]
        ],
        stress: [
          [9]
        ]
      }
    }),

    // 278. Sudoku Solver
    createProblem({
      num: 278,
      title: "Sudoku Solver",
      slug: "sudoku-solver",
      level: 12,
      difficulty: "HARD",
      topic: "Backtracking / Matrix",
      patternSlug: "backtracking",
      estimatedTimeMin: 35,
      statement: "Write a program to solve a Sudoku puzzle by filling the empty cells.\n\nA sudoku solution must satisfy all of the following rules:\n1. Each of the digits `1-9` must occur exactly once in each row.\n2. Each of the digits `1-9` must occur exactly once in each column.\n3. Each of the digits `1-9` must occur exactly once in each of the 9 `3x3` sub-boxes of the grid.\n\nThe `.` character indicates empty cells. Return the solved board in-place.",
      functionName: "solveSudoku",
      parameters: [{ name: "board", type: "string[][]", description: "9x9 Sudoku board" }],
      returnType: "string[][]",
      constraints: ["board.length == 9", "board[i].length == 9", "board[i][j] is a digit or '.'.", "It is guaranteed that the input board has only one solution."],
      examples: [
        {
          input: 'board = [["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]',
          output: '[["5","3","4","6","7","8","9","1","2"],["6","7","2","1","9","5","3","4","8"],["1","9","8","3","4","2","5","6","7"],["8","5","9","7","6","1","4","2","3"],["4","2","6","8","5","3","7","9","1"],["7","1","3","9","2","4","8","5","6"],["9","6","1","5","3","7","2","8","4"],["2","8","7","4","1","9","6","3","5"],["3","4","5","2","8","6","1","7","9"]]',
          explanation: "Valid completed 9x9 Sudoku board."
        },
        {
          input: 'board = [["8","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9",".",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]',
          output: '[]',
          explanation: "Board modified in-place."
        },
        {
          input: 'board = [[".",".",".",".",".",".",".",".","."],["."]]',
          output: '[]',
          explanation: "Board solver."
        }
      ],
      optimalSolution: `function solveSudoku(board) {\n  function isValid(r, c, ch) {\n    const boxR = 3 * Math.floor(r / 3), boxC = 3 * Math.floor(c / 3);\n    for (let i = 0; i < 9; i++) {\n      if (board[r][i] === ch || board[i][c] === ch) return false;\n      if (board[boxR + Math.floor(i / 3)][boxC + (i % 3)] === ch) return false;\n    }\n    return true;\n  }\n  function solve() {\n    for (let r = 0; r < 9; r++) {\n      for (let c = 0; c < 9; c++) {\n        if (board[r][c] === '.') {\n          for (let d = 1; d <= 9; d++) {\n            const ch = String(d);\n            if (isValid(r, c, ch)) {\n              board[r][c] = ch;\n              if (solve()) return true;\n              board[r][c] = '.';\n            }\n          }\n          return false;\n        }\n      }\n    }\n    return true;\n  }\n  solve();\n  return board;\n}`,
      optimalTimeComplexity: "O(9^(empty_cells)) with fast pruning",
      optimalSpaceComplexity: "O(empty_cells) recursion stack",
      suboptimalSolution: `function solveSudoku(board) {\n  function check(r, c, ch) {\n    for (let i = 0; i < 9; i++) if (board[r][i] === ch || board[i][c] === ch) return false;\n    const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;\n    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (board[br + i][bc + j] === ch) return false;\n    return true;\n  }\n  function backtrack() {\n    for (let r = 0; r < 9; r++) {\n      for (let c = 0; c < 9; c++) {\n        if (board[r][c] === '.') {\n          for (let n = 1; n <= 9; n++) {\n            const ch = String(n);\n            if (check(r, c, ch)) {\n              board[r][c] = ch;\n              if (backtrack()) return true;\n              board[r][c] = '.';\n            }\n          }\n          return false;\n        }\n      }\n    }\n    return true;\n  }\n  backtrack();\n  return board;\n}`,
      suboptimalTimeComplexity: "O(9^(empty_cells))",
      suboptimalSpaceComplexity: "O(81)",
      commonMistakes: ["Failing to return false when no digit 1-9 is valid for an empty cell", "Box indexing formula errors (boxR = 3 * floor(r / 3))"],
      hints: [
        "Scan board for the first empty cell '.'.",
        "Try placing digits '1' through '9'.",
        "Validate row, column, and 3x3 box in O(1).",
        "If `solve()` returns true, propagate true upwards immediately."
      ],
      oracleFn: (board: string[][]) => {
        const b = board.map(row => [...row]);
        function isValid(r: number, c: number, ch: string): boolean {
          const boxR = 3 * Math.floor(r / 3), boxC = 3 * Math.floor(c / 3);
          for (let i = 0; i < 9; i++) {
            if (b[r][i] === ch || b[i][c] === ch) return false;
            if (b[boxR + Math.floor(i / 3)][boxC + (i % 3)] === ch) return false;
          }
          return true;
        }
        function solve(): boolean {
          for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
              if (b[r][c] === '.') {
                for (let d = 1; d <= 9; d++) {
                  const ch = String(d);
                  if (isValid(r, c, ch)) {
                    b[r][c] = ch;
                    if (solve()) return true;
                    b[r][c] = '.';
                  }
                }
                return false;
              }
            }
          }
          return true;
        }
        solve();
        return b;
      },
      testCases: {
        functional: [
          [[
            ["5","3",".",".","7",".",".",".","."],
            ["6",".",".","1","9","5",".",".","."],
            [".","9","8",".",".",".",".","6","."],
            ["8",".",".",".","6",".",".",".","3"],
            ["4",".",".","8",".","3",".",".","1"],
            ["7",".",".",".","2",".",".",".","6"],
            [".","6",".",".",".",".","2","8","."],
            [".",".",".","4","1","9",".",".","5"],
            [".",".",".",".","8",".",".","7","9"]
          ]],
          [[
            [".",".","9","7","4","8",".",".","."],
            ["7",".",".",".",".",".",".",".","."],
            [".","2",".","1",".","9",".",".","."],
            [".",".","7",".",".",".","2","4","."],
            [".","6","4",".","1",".","5","9","."],
            [".","9","8",".",".",".","3",".","."],
            [".",".",".","8",".","3",".","2","."],
            [".",".",".",".",".",".",".",".","6"],
            [".",".",".","2","7","5","9",".","."]
          ]],
          [[
            ["1",".",".",".",".",".",".",".","."],
            [".","2",".",".",".",".",".",".","."],
            [".",".","3",".",".",".",".",".","."],
            [".",".",".","4",".",".",".",".","."],
            [".",".",".",".","5",".",".",".","."],
            [".",".",".",".",".","6",".",".","."],
            [".",".",".",".",".",".","7",".","."],
            [".",".",".",".",".",".",".","8","."],
            [".",".",".",".",".",".",".",".","9"]
          ]]
        ],
        boundary: [
          [[
            ["5","3","4","6","7","8","9","1","2"],
            ["6","7","2","1","9","5","3","4","8"],
            ["1","9","8","3","4","2","5","6","7"],
            ["8","5","9","7","6","1","4","2","3"],
            ["4","2","6","8","5","3","7","9","1"],
            ["7","1","3","9","2","4","8","5","6"],
            ["9","6","1","5","3","7","2","8","4"],
            ["2","8","7","4","1","9","6","3","5"],
            ["3","4","5","2","8","6","1","7","."]
          ]],
          [[
            [".","3","4","6","7","8","9","1","2"],
            ["6","7","2","1","9","5","3","4","8"],
            ["1","9","8","3","4","2","5","6","7"],
            ["8","5","9","7","6","1","4","2","3"],
            ["4","2","6","8","5","3","7","9","1"],
            ["7","1","3","9","2","4","8","5","6"],
            ["9","6","1","5","3","7","2","8","4"],
            ["2","8","7","4","1","9","6","3","5"],
            ["3","4","5","2","8","6","1","7","9"]
          ]],
          [[
            ["5","3","4","6","7","8","9","1","2"],
            ["6","7","2","1","9","5","3","4","8"],
            ["1","9","8","3","4","2","5","6","7"],
            ["8","5","9","7","6","1","4","2","3"],
            ["4","2","6","8",".","3","7","9","1"],
            ["7","1","3","9","2","4","8","5","6"],
            ["9","6","1","5","3","7","2","8","4"],
            ["2","8","7","4","1","9","6","3","5"],
            ["3","4","5","2","8","6","1","7","9"]
          ]],
          [[
            [".","3","4","6","7","8","9","1","2"],
            ["6","7","2","1","9","5","3","4","8"],
            ["1","9","8","3","4","2","5","6","7"],
            ["8","5","9","7","6","1","4","2","3"],
            ["4","2","6","8","5","3","7","9","1"],
            ["7","1","3","9","2","4","8","5","6"],
            ["9","6","1","5","3","7","2","8","4"],
            ["2","8","7","4","1","9","6","3","5"],
            ["3","4","5","2","8","6","1","7","."]
          ]],
          [[
            ["5","3","4","6","7","8","9","1","2"],
            ["6","7","2","1","9","5","3","4","8"],
            ["1","9","8","3","4","2","5","6","7"],
            ["8","5","9","7","6","1","4","2","3"],
            ["4","2","6","8","5","3","7","9","1"],
            ["7","1","3","9","2","4","8","5","6"],
            ["9","6","1","5","3","7","2","8","4"],
            [".","8","7","4","1","9","6","3","5"],
            ["3","4","5","2","8","6","1","7","9"]
          ]]
        ],
        adversarial: [
          [[
            [".",".",".","2",".",".",".","6","3"],
            ["3",".",".",".",".","5","4",".","1"],
            [".",".","1",".",".","3","9","8","."],
            [".",".",".",".",".",".",".","9","."],
            [".",".",".","5","3","8",".",".","."],
            [".","3",".",".",".",".",".",".","."],
            [".","2","6","3",".",".","5",".","."],
            ["5",".","3","7",".",".",".",".","8"],
            ["4","7",".",".",".","1",".",".","."]
          ]]
        ],
        stress: [
          [[
            ["8",".",".",".",".",".",".",".","."],
            [".",".","3","6",".",".",".",".","."],
            [".","7",".",".","9",".","2",".","."],
            [".","5",".",".",".","7",".",".","."],
            [".",".",".",".","4","5","7",".","."],
            [".",".",".","1",".",".",".","3","."],
            [".",".","1",".",".",".",".","6","8"],
            [".",".","8","5",".",".",".","1","."],
            [".","9",".",".",".",".","4",".","."]
          ]]
        ]
      }
    }),

    // 279. Expression Add Operators
    createProblem({
      num: 279,
      title: "Expression Add Operators",
      slug: "expression-add-operators",
      level: 12,
      difficulty: "HARD",
      topic: "Backtracking / Math / String",
      patternSlug: "backtracking",
      estimatedTimeMin: 35,
      statement: "Given a string `num` that contains only digits and an integer `target`, return all possibilities to insert the binary operators `'+'`, `'-'`, and/or `'*'` between the digits of `num` so that the resultant expression evaluates to the `target` value.\n\nNote that operands in the returned expressions should not contain leading zeros.",
      functionName: "addOperators",
      parameters: [
        { name: "num", type: "string", description: "Digit string" },
        { name: "target", type: "number", description: "Target integer value" }
      ],
      returnType: "string[]",
      constraints: ["1 <= num.length <= 10", "num consists of only digits.", "-2^31 <= target <= 2^31 - 1"],
      examples: [
        { input: 'num = "123", target = 6', output: '["1*2*3","1+2+3"]', explanation: "Both evaluate to 6." },
        { input: 'num = "232", target = 8', output: '["2*3+2","2+3*2"]', explanation: "Operator precedence: multiplication evaluated first." },
        { input: 'num = "3456237490", target = 9191', output: '[]', explanation: "No expression can evaluate to 9191." },
        { input: 'num = "105", target = 5', output: '["1*0+5","10-5"]', explanation: "\"1+05\" is invalid due to leading zero in operand 05." }
      ],
      optimalSolution: `function addOperators(num, target) {\n  const res = [];\n  function backtrack(idx, path, evalVal, multed) {\n    if (idx === num.length) {\n      if (evalVal === target) res.push(path);\n      return;\n    }\n    for (let len = 1; idx + len <= num.length; len++) {\n      const part = num.slice(idx, idx + len);\n      if (part.length > 1 && part[0] === '0') break;\n      const val = Number(part);\n      if (idx === 0) {\n        backtrack(idx + len, part, val, val);\n      } else {\n        backtrack(idx + len, path + '+' + part, evalVal + val, val);\n        backtrack(idx + len, path + '-' + part, evalVal - val, -val);\n        backtrack(idx + len, path + '*' + part, evalVal - multed + multed * val, multed * val);\n      }\n    }\n  }\n  backtrack(0, "", 0, 0);\n  return res;\n}`,
      optimalTimeComplexity: "O(4^N)",
      optimalSpaceComplexity: "O(N) recursion stack",
      suboptimalSolution: `function addOperators(num, target) {\n  const res = [];\n  function dfs(idx, expr, total, prev) {\n    if (idx === num.length) {\n      if (total === target) res.push(expr);\n      return;\n    }\n    for (let i = idx; i < num.length; i++) {\n      const s = num.slice(idx, i + 1);\n      if (s.length > 1 && s[0] === '0') break;\n      const n = Number(s);\n      if (idx === 0) {\n        dfs(i + 1, s, n, n);\n      } else {\n        dfs(i + 1, expr + '+' + s, total + n, n);\n        dfs(i + 1, expr + '-' + s, total - n, -n);\n        dfs(i + 1, expr + '*' + s, total - prev + prev * n, prev * n);\n      }\n    }\n  }\n  dfs(0, '', 0, 0);\n  return res;\n}`,
      suboptimalTimeComplexity: "O(4^N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Multiplication precedence error: must undo previous term: `evalVal - multed + multed * val`", "Allowing multi-digit numbers with leading zero like \"05\""],
      hints: [
        "Track `multed` (the value of the last operand multiplied/added) so you can reverse precedence when multiplying.",
        "For '+': evalVal + val, multed = val.",
        "For '-': evalVal - val, multed = -val.",
        "For '*': evalVal - multed + multed * val, multed = multed * val."
      ],
      oracleFn: (num: string, target: number) => {
        const res: string[] = [];
        function backtrack(idx: number, path: string, evalVal: number, multed: number) {
          if (idx === num.length) {
            if (evalVal === target) res.push(path);
            return;
          }
          for (let len = 1; idx + len <= num.length; len++) {
            const part = num.slice(idx, idx + len);
            if (part.length > 1 && part[0] === '0') break;
            const val = Number(part);
            if (idx === 0) {
              backtrack(idx + len, part, val, val);
            } else {
              backtrack(idx + len, path + '+' + part, evalVal + val, val);
              backtrack(idx + len, path + '-' + part, evalVal - val, -val);
              backtrack(idx + len, path + '*' + part, evalVal - multed + multed * val, multed * val);
            }
          }
        }
        backtrack(0, "", 0, 0);
        return res;
      },
      testCases: {
        functional: [
          ["123", 6],
          ["232", 8],
          ["3456237490", 9191],
          ["105", 5]
        ],
        boundary: [
          ["00", 0],
          ["1", 1],
          ["2", 3]
        ],
        adversarial: [
          ["100", 0],
          ["2147483647", 2147483647]
        ],
        stress: [
          ["12345", 15],
          ["100000000", 0]
        ]
      }
    }),

    // 280. Different Ways to Add Parentheses
    createProblem({
      num: 280,
      title: "Different Ways to Add Parentheses",
      slug: "different-ways-to-add-parentheses",
      level: 12,
      difficulty: "MEDIUM",
      topic: "Divide and Conquer / Dynamic Programming / Backtracking",
      patternSlug: "backtracking",
      estimatedTimeMin: 20,
      statement: "Given a string `expression` of numbers and operators, return all possible results from computing all the different possible ways to group numbers and operators. You may return the answer in any order.",
      functionName: "diffWaysToCompute",
      parameters: [{ name: "expression", type: "string", description: "Expression string" }],
      returnType: "number[]",
      constraints: ["1 <= expression.length <= 20", "expression consists of digits and the operator '+', '-', and '*'.", "All the integer values in the input expression are in the range [0, 99]."],
      examples: [
        { input: 'expression = "2-1-1"', output: "[0,2]", explanation: "((2-1)-1) = 0, (2-(1-1)) = 2." },
        { input: 'expression = "2*3-4*5"', output: "[-34,-14,-10,-10,10]", explanation: "5 possible evaluations." },
        { input: 'expression = "11"', output: "[11]", explanation: "Single number." },
        { input: 'expression = "2+3"', output: "[5]", explanation: "Single operation." }
      ],
      optimalSolution: `function diffWaysToCompute(expression) {\n  const memo = new Map();\n  function compute(expr) {\n    if (memo.has(expr)) return memo.get(expr);\n    const res = [];\n    for (let i = 0; i < expr.length; i++) {\n      const c = expr[i];\n      if (c === '+' || c === '-' || c === '*') {\n        const left = compute(expr.slice(0, i));\n        const right = compute(expr.slice(i + 1));\n        for (const l of left) {\n          for (const r of right) {\n            if (c === '+') res.push(l + r);\n            else if (c === '-') res.push(l - r);\n            else res.push(l * r);\n          }\n        }\n      }\n    }\n    if (res.length === 0) res.push(Number(expr));\n    memo.set(expr, res);\n    return res;\n  }\n  return compute(expression).sort((a, b) => a - b);\n}`,
      optimalTimeComplexity: "O(4^N / N^(3/2)) Catalan numbers",
      optimalSpaceComplexity: "O(4^N)",
      suboptimalSolution: `function diffWaysToCompute(expression) {\n  function dfs(expr) {\n    const res = [];\n    for (let i = 0; i < expr.length; i++) {\n      const op = expr[i];\n      if (op === '+' || op === '-' || op === '*') {\n        const left = dfs(expr.slice(0, i));\n        const right = dfs(expr.slice(i + 1));\n        for (const l of left) {\n          for (const r of right) {\n            if (op === '+') res.push(l + r);\n            else if (op === '-') res.push(l - r);\n            else res.push(l * r);\n          }\n        }\n      }\n    }\n    if (!res.length) res.push(Number(expr));\n    return res;\n  }\n  return dfs(expression).sort((a, b) => a - b);\n}`,
      suboptimalTimeComplexity: "O(4^N) without memoization",
      suboptimalSpaceComplexity: "O(4^N)",
      commonMistakes: ["Forgetting base case: if no operator found, return `[Number(expr)]`"],
      hints: [
        "Divide and conquer: whenever an operator is encountered at `i`, recursively evaluate left side `expr[0..i-1]` and right side `expr[i+1..end]`.",
        "Combine all left results with all right results using the operator.",
        "Memoize subexpressions to avoid re-evaluating identical expressions."
      ],
      oracleFn: (expression: string) => {
        const memo = new Map<string, number[]>();
        function compute(expr: string): number[] {
          if (memo.has(expr)) return memo.get(expr)!;
          const res: number[] = [];
          for (let i = 0; i < expr.length; i++) {
            const c = expr[i];
            if (c === '+' || c === '-' || c === '*') {
              const left = compute(expr.slice(0, i));
              const right = compute(expr.slice(i + 1));
              for (const l of left) {
                for (const r of right) {
                  if (c === '+') res.push(l + r);
                  else if (c === '-') res.push(l - r);
                  else res.push(l * r);
                }
              }
            }
          }
          if (res.length === 0) res.push(Number(expr));
          memo.set(expr, res);
          return res;
        }
        return compute(expression).sort((a, b) => a - b);
      },
      testCases: {
        functional: [
          ["2-1-1"],
          ["2*3-4*5"],
          ["11"],
          ["2+3"]
        ],
        boundary: [
          ["0"],
          ["5-3"],
          ["2*3"]
        ],
        adversarial: [
          ["1+1+1"],
          ["1-1+1"]
        ],
        stress: [
          ["2*3-4*5+6-7"],
          ["1+2*3-4+5*6"]
        ]
      }
    }),

    // 281. Split a String Into the Max Number of Unique Substrings
    createProblem({
      num: 281,
      title: "Split a String Into the Max Number of Unique Substrings",
      slug: "split-a-string-into-the-max-number-of-unique-substrings",
      level: 12,
      difficulty: "MEDIUM",
      topic: "Backtracking / Hash Set",
      patternSlug: "backtracking",
      estimatedTimeMin: 20,
      statement: "Given a string `s`, return the maximum number of unique substrings that the given string can be split into.\n\nYou can split string `s` into any list of non-empty substrings, where the concatenation of the substrings forms the original string. However, you must split the substrings such that all of them are unique.",
      functionName: "maxUniqueSplit",
      parameters: [{ name: "s", type: "string", description: "Input string" }],
      returnType: "number",
      constraints: ["1 <= s.length <= 16", "s contains only lowercase English letters."],
      examples: [
        { input: 's = "ababccc"', output: "5", explanation: "Split into 5 unique substrings: ['a', 'b', 'ab', 'c', 'cc']." },
        { input: 's = "aba"', output: "2", explanation: "Split into ['a', 'ba'] or ['ab', 'a']." },
        { input: 's = "aa"', output: "1", explanation: "Cannot split into 2 because 'a' and 'a' would be identical." },
        { input: 's = "wwwzfvedwfvhsww"', output: "11", explanation: "Max 11 unique segments." }
      ],
      optimalSolution: `function maxUniqueSplit(s) {\n  let maxCount = 0;\n  const seen = new Set();\n  function backtrack(start) {\n    if (start === s.length) {\n      if (seen.size > maxCount) maxCount = seen.size;\n      return;\n    }\n    // Pruning: if remaining characters cannot exceed maxCount, stop\n    if (seen.size + (s.length - start) <= maxCount) return;\n    for (let end = start + 1; end <= s.length; end++) {\n      const sub = s.slice(start, end);\n      if (!seen.has(sub)) {\n        seen.add(sub);\n        backtrack(end);\n        seen.delete(sub);\n      }\n    }\n  }\n  backtrack(0);\n  return maxCount;\n}`,
      optimalTimeComplexity: "O(2^N * N)",
      optimalSpaceComplexity: "O(N) set and recursion stack",
      suboptimalSolution: `function maxUniqueSplit(s) {\n  let max = 0;\n  const set = new Set();\n  function dfs(idx) {\n    if (idx === s.length) { max = Math.max(max, set.size); return; }\n    for (let i = idx + 1; i <= s.length; i++) {\n      const chunk = s.slice(idx, i);\n      if (!set.has(chunk)) {\n        set.add(chunk);\n        dfs(i);\n        set.delete(chunk);\n      }\n    }\n  }\n  dfs(0);\n  return max;\n}`,
      suboptimalTimeComplexity: "O(2^N * N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Trying greedy split (can fail when a shorter substring prevents a larger total count)", "Forgetting pruning `seen.size + (s.length - start) <= maxCount`"],
      hints: [
        "Backtrack by trying all split lengths from `start + 1` to `s.length`.",
        "Add substring to a Set `seen`; backtrack and remove it after recursive call.",
        "Pruning: if `seen.size + (s.length - start) <= maxCount`, no further split can improve the best answer."
      ],
      oracleFn: (s: string) => {
        let maxCount = 0;
        const seen = new Set<string>();
        function backtrack(start: number) {
          if (start === s.length) {
            if (seen.size > maxCount) maxCount = seen.size;
            return;
          }
          if (seen.size + (s.length - start) <= maxCount) return;
          for (let end = start + 1; end <= s.length; end++) {
            const sub = s.slice(start, end);
            if (!seen.has(sub)) {
              seen.add(sub);
              backtrack(end);
              seen.delete(sub);
            }
          }
        }
        backtrack(0);
        return maxCount;
      },
      testCases: {
        functional: [
          ["ababccc"],
          ["aba"],
          ["aa"],
          ["wwwzfvedwfvhsww"]
        ],
        boundary: [
          ["a"],
          ["ab"],
          ["aaa"]
        ],
        adversarial: [
          ["abcdef"],
          ["zzzzzz"]
        ],
        stress: [
          ["abacabadabacaba"],
          ["abcdefghijklmnop"]
        ]
      }
    })
  ];

  return {
    level: 12,
    levelTitle: "Level 12 — Backtracking: Subsets & Permutations",
    topic: "Power Sets, Permutations, Combinations, Partitioning, and Constraint Satisfaction",
    problems
  };
}
