import { LevelPayload, GeneratedProblem } from './types';
import { createProblem } from './problemBuilder';

export function getLevel1Payload(): LevelPayload {
  const problems: GeneratedProblem[] = [
    // 001. Two Sum
    createProblem({
      num: 1,
      title: "Two Sum",
      slug: "two-sum",
      level: 1,
      difficulty: "EASY",
      topic: "Array",
      patternSlug: "fundamentals-arrays",
      estimatedTimeMin: 15,
      statement: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
      functionName: "twoSum",
      parameters: [
        { name: "nums", type: "number[]", description: "Array of integers" },
        { name: "target", type: "number", description: "Target integer sum" }
      ],
      returnType: "number[]",
      constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9", "Only one valid answer exists."],
      examples: [
        { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] == 9." },
        { input: "nums = [3,2,4], target = 6", output: "[1,2]", explanation: "nums[1] + nums[2] == 6." },
        { input: "nums = [3,3], target = 6", output: "[0,1]", explanation: "nums[0] + nums[1] == 6." }
      ],
      optimalSolution: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function twoSum(nums, target) {\n  for (let i = 0; i < nums.length; i++) {\n    for (let j = i + 1; j < nums.length; j++) {\n      if (nums[i] + nums[j] === target) return [i, j];\n    }\n  }\n  return [];\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Reusing the same element twice (e.g. nums[i] * 2 === target at index i)", "Sorting array without preserving original indices"],
      hints: [
        "Can you search for the complement (target - nums[i]) in O(1) time?",
        "A Hash Map allows constant-time lookup for previously seen numbers.",
        "Store the index of each number as you iterate through the array.",
        "Check if target - nums[i] is already in the map before inserting nums[i]."
      ],
      oracleFn: (nums: number[], target: number) => {
        const map = new Map<number, number>();
        for (let i = 0; i < nums.length; i++) {
          const comp = target - nums[i];
          if (map.has(comp)) return [map.get(comp)!, i];
          map.set(nums[i], i);
        }
        return [];
      },
      testCases: {
        functional: [
          [[2, 7, 11, 15], 9],
          [[3, 2, 4], 6],
          [[3, 3], 6]
        ],
        boundary: [
          [[-1, -2, -3, -4, -5], -8],
          [[0, 4, 3, 0], 0],
          [[-3, 4, 3, 90], 0],
          [[1000000000, 500, 1000000000], 2000000000]
        ],
        adversarial: [
          [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 19],
          [[10, 9, 8, 7, 6, 5, 4, 3, 2, 1], 3],
          [[5, 75, 25], 100],
          [[1, 5, 1, 5, 1, 5, 1, 5, 10, 20], 30]
        ],
        stress: [
          [Array.from({ length: 2000 }, (_, i) => i * 2).concat([99999, 1]), 100000],
          [Array.from({ length: 3000 }, (_, i) => i + 10).concat([5, 15]), 20]
        ]
      }
    }),

    // 002. Contains Duplicate
    createProblem({
      num: 2,
      title: "Contains Duplicate",
      slug: "contains-duplicate",
      level: 1,
      difficulty: "EASY",
      topic: "Array",
      patternSlug: "fundamentals-arrays",
      estimatedTimeMin: 10,
      statement: "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
      functionName: "containsDuplicate",
      parameters: [{ name: "nums", type: "number[]", description: "Array of integers" }],
      returnType: "boolean",
      constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
      examples: [
        { input: "nums = [1,2,3,1]", output: "true", explanation: "1 appears twice." },
        { input: "nums = [1,2,3,4]", output: "false", explanation: "All distinct." },
        { input: "nums = [1,1,1,3,3,4,3,2,4,2]", output: "true", explanation: "Multiple duplicates." }
      ],
      optimalSolution: `function containsDuplicate(nums) {\n  const seen = new Set();\n  for (const n of nums) {\n    if (seen.has(n)) return true;\n    seen.add(n);\n  }\n  return false;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function containsDuplicate(nums) {\n  nums.sort((a, b) => a - b);\n  for (let i = 1; i < nums.length; i++) {\n    if (nums[i] === nums[i - 1]) return true;\n  }\n  return false;\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Double loop O(N^2) causing Time Limit Exceeded"],
      hints: [
        "A Set stores only unique values.",
        "If you check set.has(x) before inserting x, you detect duplicates immediately.",
        "Early exit on the first duplicate found."
      ],
      oracleFn: (nums: number[]) => {
        const seen = new Set<number>();
        for (const n of nums) {
          if (seen.has(n)) return true;
          seen.add(n);
        }
        return false;
      },
      testCases: {
        functional: [
          [[1, 2, 3, 1]],
          [[1, 2, 3, 4]],
          [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]]
        ],
        boundary: [
          [[1]],
          [[0, 0]],
          [[-1, -1]],
          [[1000000000, -1000000000]]
        ],
        adversarial: [
          [[1, 2, 3, 4, 5, 6, 7, 8, 9, 1]],
          [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]]
        ],
        stress: [
          [Array.from({ length: 3000 }, (_, i) => i)],
          [Array.from({ length: 3000 }, (_, i) => i === 2999 ? 0 : i)]
        ]
      }
    }),

    // 003. Valid Anagram
    createProblem({
      num: 3,
      title: "Valid Anagram",
      slug: "valid-anagram",
      level: 1,
      difficulty: "EASY",
      topic: "String",
      patternSlug: "fundamentals-arrays",
      estimatedTimeMin: 10,
      statement: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
      functionName: "isAnagram",
      parameters: [
        { name: "s", type: "string", description: "First string" },
        { name: "t", type: "string", description: "Second string" }
      ],
      returnType: "boolean",
      constraints: ["1 <= s.length, t.length <= 5 * 10^4", "s and t consist of lowercase English letters."],
      examples: [
        { input: 's = "anagram", t = "nagaram"', output: "true", explanation: "Identical letter frequencies." },
        { input: 's = "rat", t = "car"', output: "false", explanation: "Different letters." }
      ],
      optimalSolution: `function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const count = new Array(26).fill(0);\n  for (let i = 0; i < s.length; i++) {\n    count[s.charCodeAt(i) - 97]++;\n    count[t.charCodeAt(i) - 97]--;\n  }\n  for (let i = 0; i < 26; i++) if (count[i] !== 0) return false;\n  return true;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function isAnagram(s, t) {\n  return s.split('').sort().join('') === t.split('').sort().join('');\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Sorting strings which adds O(N log N) overhead"],
      hints: [
        "If s.length !== t.length, they cannot be anagrams.",
        "Use a frequency array of size 26 for English lowercase letters.",
        "Increment count for chars in s, decrement for chars in t."
      ],
      oracleFn: (s: string, t: string) => {
        if (s.length !== t.length) return false;
        const count = new Array(26).fill(0);
        for (let i = 0; i < s.length; i++) {
          count[s.charCodeAt(i) - 97]++;
          count[t.charCodeAt(i) - 97]--;
        }
        for (let i = 0; i < 26; i++) if (count[i] !== 0) return false;
        return true;
      },
      testCases: {
        functional: [
          ["anagram", "nagaram"],
          ["rat", "car"],
          ["a", "a"]
        ],
        boundary: [
          ["a", "b"],
          ["ab", "a"],
          ["aa", "a"],
          ["zzzz", "zzzz"]
        ],
        adversarial: [
          ["listen", "silent"],
          ["triangle", "integral"],
          ["abcde", "edcba"]
        ],
        stress: [
          ["a".repeat(2000), "a".repeat(2000)],
          ["a".repeat(2000) + "b", "a".repeat(2000) + "c"]
        ]
      }
    }),

    // 004. Concatenation of Array
    createProblem({
      num: 4,
      title: "Concatenation of Array",
      slug: "concatenation-of-array",
      level: 1,
      difficulty: "EASY",
      topic: "Array",
      patternSlug: "fundamentals-arrays",
      estimatedTimeMin: 10,
      statement: "Given an integer array `nums` of length `n`, you want to create an array `ans` of length `2n` where `ans[i] == nums[i]` and `ans[i + n] == nums[i]` for `0 <= i < n` (0-indexed).\n\nSpecifically, `ans` is the concatenation of two `nums` arrays.\n\nReturn the array `ans`.",
      functionName: "getConcatenation",
      parameters: [{ name: "nums", type: "number[]", description: "Source array" }],
      returnType: "number[]",
      constraints: ["n == nums.length", "1 <= n <= 1000", "1 <= nums[i] <= 1000"],
      examples: [
        { input: "nums = [1,2,1]", output: "[1,2,1,1,2,1]", explanation: "ans = [nums[0],nums[1],nums[2],nums[0],nums[1],nums[2]]." },
        { input: "nums = [1,3,2,1]", output: "[1,3,2,1,1,3,2,1]", explanation: "Concatenated array." }
      ],
      optimalSolution: `function getConcatenation(nums) {\n  const n = nums.length;\n  const ans = new Array(2 * n);\n  for (let i = 0; i < n; i++) {\n    ans[i] = nums[i];\n    ans[i + n] = nums[i];\n  }\n  return ans;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function getConcatenation(nums) {\n  return nums.concat(nums);\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Dynamic re-allocations vs preallocating 2n array"],
      hints: [
        "Create an array of size 2 * n.",
        "Set ans[i] and ans[i + n] to nums[i] in a single loop."
      ],
      oracleFn: (nums: number[]) => {
        const n = nums.length;
        const ans = new Array(2 * n);
        for (let i = 0; i < n; i++) {
          ans[i] = nums[i];
          ans[i + n] = nums[i];
        }
        return ans;
      },
      testCases: {
        functional: [
          [[1, 2, 1]],
          [[1, 3, 2, 1]],
          [[1]]
        ],
        boundary: [
          [[1000]],
          [[1, 2]],
          [[0, 0, 0]],
          [[1, 1, 1, 1]]
        ],
        adversarial: [
          [[5, 4, 3, 2, 1]],
          [[10, 20, 30, 40]]
        ],
        stress: [
          [Array.from({ length: 500 }, (_, i) => i + 1)],
          [Array.from({ length: 1000 }, () => 7)]
        ]
      }
    }),

    // 005. Build Array from Permutation
    createProblem({
      num: 5,
      title: "Build Array from Permutation",
      slug: "build-array-from-permutation",
      level: 1,
      difficulty: "EASY",
      topic: "Array",
      patternSlug: "fundamentals-arrays",
      estimatedTimeMin: 10,
      statement: "Given a zero-based permutation `nums` (0-indexed), build an array `ans` of the same length where `ans[i] = nums[nums[i]]` for each `0 <= i < nums.length` and return it.\n\nA zero-based permutation `nums` is an array of distinct integers from `0` to `nums.length - 1` (inclusive).\n\nCan you do it in `O(1)` extra space (in-place)?",
      functionName: "buildArray",
      parameters: [{ name: "nums", type: "number[]", description: "Zero-based permutation array" }],
      returnType: "number[]",
      constraints: ["1 <= nums.length <= 1000", "0 <= nums[i] < nums.length", "The elements in nums are distinct."],
      examples: [
        { input: "nums = [0,2,1,5,3,4]", output: "[0,1,2,4,5,3]", explanation: "ans = [nums[0], nums[2], nums[1], nums[5], nums[3], nums[4]]." },
        { input: "nums = [5,0,1,2,3,4]", output: "[4,5,0,1,2,3]", explanation: "Built array." }
      ],
      optimalSolution: `function buildArray(nums) {\n  const n = nums.length;\n  for (let i = 0; i < n; i++) {\n    nums[i] = nums[i] + n * (nums[nums[i]] % n);\n  }\n  for (let i = 0; i < n; i++) {\n    nums[i] = Math.floor(nums[i] / n);\n  }\n  return nums;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1) in-place encoding",
      suboptimalSolution: `function buildArray(nums) {\n  return nums.map(i => nums[i]);\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Overwriting nums[i] in-place without modulo encoding, corrupting subsequent lookups"],
      hints: [
        "In-place trick: store both old and new value in nums[i] using nums[i] + n * (nums[nums[i]] % n).",
        "Then decode by dividing by n."
      ],
      oracleFn: (nums: number[]) => {
        const n = nums.length;
        for (let i = 0; i < n; i++) {
          nums[i] = nums[i] + n * (nums[nums[i]] % n);
        }
        for (let i = 0; i < n; i++) {
          nums[i] = Math.floor(nums[i] / n);
        }
        return nums;
      },
      testCases: {
        functional: [
          [[0, 2, 1, 5, 3, 4]],
          [[5, 0, 1, 2, 3, 4]],
          [[0]]
        ],
        boundary: [
          [[0, 1]],
          [[1, 0]],
          [[0, 1, 2, 3]],
          [[3, 2, 1, 0]]
        ],
        adversarial: [
          [[2, 0, 1]],
          [[1, 2, 3, 0]]
        ],
        stress: [
          [Array.from({ length: 500 }, (_, i) => (i + 1) % 500)],
          [Array.from({ length: 1000 }, (_, i) => 999 - i)]
        ]
      }
    }),

    // 006. Running Sum of 1d Array
    createProblem({
      num: 6,
      title: "Running Sum of 1d Array",
      slug: "running-sum-of-1d-array",
      level: 1,
      difficulty: "EASY",
      topic: "Array",
      patternSlug: "fundamentals-arrays",
      estimatedTimeMin: 10,
      statement: "Given an array `nums`. We define a running sum of an array as `runningSum[i] = sum(nums[0]...nums[i])`.\n\nReturn the running sum of `nums`.",
      functionName: "runningSum",
      parameters: [{ name: "nums", type: "number[]", description: "Array of integers" }],
      returnType: "number[]",
      constraints: ["1 <= nums.length <= 1000", "-10^6 <= nums[i] <= 10^6"],
      examples: [
        { input: "nums = [1,2,3,4]", output: "[1,3,6,10]", explanation: "Running sum is [1, 1+2, 1+2+3, 1+2+3+4]." },
        { input: "nums = [1,1,1,1,1]", output: "[1,2,3,4,5]", explanation: "Running sum." }
      ],
      optimalSolution: `function runningSum(nums) {\n  for (let i = 1; i < nums.length; i++) nums[i] += nums[i - 1];\n  return nums;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function runningSum(nums) {\n  const res = [];\n  for (let i = 0; i < nums.length; i++) {\n    let s = 0;\n    for (let j = 0; j <= i; j++) s += nums[j];\n    res.push(s);\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Recalculating prefix sum with nested loops O(N^2)"],
      hints: [
        "nums[i] += nums[i - 1] updates each position in O(1).",
        "Single pass from index 1 to end."
      ],
      oracleFn: (nums: number[]) => {
        const res = [...nums];
        for (let i = 1; i < res.length; i++) res[i] += res[i - 1];
        return res;
      },
      testCases: {
        functional: [
          [[1, 2, 3, 4]],
          [[1, 1, 1, 1, 1]],
          [[3, 1, 2, 10, 1]]
        ],
        boundary: [
          [[0]],
          [[100]],
          [[-5, 5]],
          [[-1, -2, -3]]
        ],
        adversarial: [
          [[1000000, -1000000, 1000000]],
          [[1, -1, 1, -1, 1]]
        ],
        stress: [
          [Array.from({ length: 500 }, () => 1)],
          [Array.from({ length: 1000 }, (_, i) => i - 500)]
        ]
      }
    }),

    // 007. Richest Customer Wealth
    createProblem({
      num: 7,
      title: "Richest Customer Wealth",
      slug: "richest-customer-wealth",
      level: 1,
      difficulty: "EASY",
      topic: "Array",
      patternSlug: "fundamentals-arrays",
      estimatedTimeMin: 10,
      statement: "You are given an `m x n` integer grid `accounts` where `accounts[i][j]` is the amount of money the `i`th customer has in the `j`th bank. Return the wealth that the richest customer has.\n\nA customer's wealth is the amount of money they have in all their bank accounts. The richest customer is the customer that has the maximum wealth.",
      functionName: "maximumWealth",
      parameters: [{ name: "accounts", type: "number[][]", description: "2D grid of accounts" }],
      returnType: "number",
      constraints: ["m == accounts.length", "n == accounts[i].length", "1 <= m, n <= 50", "1 <= accounts[i][j] <= 100"],
      examples: [
        { input: "accounts = [[1,2,3],[3,2,1]]", output: "6", explanation: "Both customers have wealth 6." },
        { input: "accounts = [[1,5],[7,3],[3,5]]", output: "10", explanation: "2nd customer has wealth 10." }
      ],
      optimalSolution: `function maximumWealth(accounts) {\n  let maxW = 0;\n  for (const customer of accounts) {\n    let sum = 0;\n    for (const money of customer) sum += money;\n    if (sum > maxW) maxW = sum;\n  }\n  return maxW;\n}`,
      optimalTimeComplexity: "O(M * N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function maximumWealth(accounts) {\n  return Math.max(...accounts.map(row => row.reduce((a, b) => a + b, 0)));\n}`,
      suboptimalTimeComplexity: "O(M * N)",
      suboptimalSpaceComplexity: "O(M)",
      commonMistakes: ["Summing columns instead of rows"],
      hints: [
        "Iterate over each row (customer).",
        "Sum the bank values in each row.",
        "Track the maximum sum seen."
      ],
      oracleFn: (accounts: number[][]) => {
        let maxW = 0;
        for (const customer of accounts) {
          let sum = 0;
          for (const money of customer) sum += money;
          if (sum > maxW) maxW = sum;
        }
        return maxW;
      },
      testCases: {
        functional: [
          [[[1, 2, 3], [3, 2, 1]]],
          [[[1, 5], [7, 3], [3, 5]]],
          [[[2, 8, 7], [7, 1, 3], [1, 9, 5]]]
        ],
        boundary: [
          [[[100]]],
          [[[1, 1], [1, 1]]],
          [[[100, 100, 100]]],
          [[[1], [2], [3]]]
        ],
        adversarial: [
          [[[50, 50], [99, 0], [0, 100]]],
          [[[10, 20, 30], [5, 5, 5]]]
        ],
        stress: [
          [Array.from({ length: 50 }, () => Array.from({ length: 50 }, () => 100))],
          [Array.from({ length: 50 }, (_, i) => Array.from({ length: 50 }, (_, j) => i + j))]
        ]
      }
    }),

    // 008. Find Pivot Index
    createProblem({
      num: 8,
      title: "Find Pivot Index",
      slug: "find-pivot-index",
      level: 1,
      difficulty: "EASY",
      topic: "Array",
      patternSlug: "fundamentals-arrays",
      estimatedTimeMin: 15,
      statement: "Given an array of integers `nums`, calculate the pivot index of this array.\n\nThe pivot index is the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the index's right.\n\nIf the index is on the left edge of the array, then the left sum is 0 because there are no elements to the left. This also applies to the right edge of the array.\n\nReturn the leftmost pivot index. If no such index exists, return `-1`.",
      functionName: "pivotIndex",
      parameters: [{ name: "nums", type: "number[]", description: "Array of integers" }],
      returnType: "number",
      constraints: ["1 <= nums.length <= 10^4", "-1000 <= nums[i] <= 1000"],
      examples: [
        { input: "nums = [1,7,3,6,5,6]", output: "3", explanation: "Left sum = 1+7+3 = 11, Right sum = 5+6 = 11." },
        { input: "nums = [1,2,3]", output: "-1", explanation: "No pivot exists." },
        { input: "nums = [2,1,-1]", output: "0", explanation: "Left sum = 0, Right sum = 1 + -1 = 0." }
      ],
      optimalSolution: `function pivotIndex(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function pivotIndex(nums) {\n  for (let i = 0; i < nums.length; i++) {\n    let l = 0, r = 0;\n    for (let j = 0; j < i; j++) l += nums[j];\n    for (let j = i + 1; j < nums.length; j++) r += nums[j];\n    if (l === r) return i;\n  }\n  return -1;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Recalculating left and right sums in nested loops O(N^2)"],
      hints: [
        "First compute total sum of the array in O(N).",
        "As you iterate, rightSum = total - leftSum - nums[i].",
        "If leftSum === rightSum, return current index."
      ],
      oracleFn: (nums: number[]) => {
        const total = nums.reduce((a, b) => a + b, 0);
        let leftSum = 0;
        for (let i = 0; i < nums.length; i++) {
          if (leftSum === total - leftSum - nums[i]) return i;
          leftSum += nums[i];
        }
        return -1;
      },
      testCases: {
        functional: [
          [[1, 7, 3, 6, 5, 6]],
          [[1, 2, 3]],
          [[2, 1, -1]]
        ],
        boundary: [
          [[1]],
          [[0, 0]],
          [[0]],
          [[-1, -1, -1, -1, -1, 0]]
        ],
        adversarial: [
          [[-1, -1, 0, 1, 1, 0]],
          [[1, -1, 2]]
        ],
        stress: [
          [Array.from({ length: 3000 }, () => 0)],
          [Array.from({ length: 4000 }, (_, i) => i === 2000 ? 50 : 0)]
        ]
      }
    }),

    // 009. Plus One
    createProblem({
      num: 9,
      title: "Plus One",
      slug: "plus-one",
      level: 1,
      difficulty: "EASY",
      topic: "Array",
      patternSlug: "fundamentals-arrays",
      estimatedTimeMin: 10,
      statement: "You are given a large integer represented as an integer array `digits`, where each `digits[i]` is the `i`th digit of the integer. The digits are ordered from most significant to least significant in left-to-right order. The large integer does not contain any leading `0`'s.\n\nIncrement the large integer by one and return the resulting array of digits.",
      functionName: "plusOne",
      parameters: [{ name: "digits", type: "number[]", description: "Array of digits" }],
      returnType: "number[]",
      constraints: ["1 <= digits.length <= 100", "0 <= digits[i] <= 9", "digits does not contain any leading 0's."],
      examples: [
        { input: "digits = [1,2,3]", output: "[1,2,4]", explanation: "123 + 1 = 124." },
        { input: "digits = [4,3,2,1]", output: "[4,3,2,2]", explanation: "4321 + 1 = 4322." },
        { input: "digits = [9]", output: "[1,0]", explanation: "9 + 1 = 10." }
      ],
      optimalSolution: `function plusOne(digits) {\n  for (let i = digits.length - 1; i >= 0; i--) {\n    if (digits[i] < 9) {\n      digits[i]++;\n      return digits;\n    }\n    digits[i] = 0;\n  }\n  digits.unshift(1);\n  return digits;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function plusOne(digits) {\n  return (BigInt(digits.join('')) + 1n).toString().split('').map(Number);\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Converting to native Number (overflows for > 16 digits)"],
      hints: [
        "Iterate backwards from last digit.",
        "If digit < 9, increment and return.",
        "If digit === 9, set to 0 and continue.",
        "If all digits were 9, prepend 1 to the array."
      ],
      oracleFn: (digits: number[]) => {
        const res = [...digits];
        for (let i = res.length - 1; i >= 0; i--) {
          if (res[i] < 9) {
            res[i]++;
            return res;
          }
          res[i] = 0;
        }
        res.unshift(1);
        return res;
      },
      testCases: {
        functional: [
          [[1, 2, 3]],
          [[4, 3, 2, 1]],
          [[9]]
        ],
        boundary: [
          [[0]],
          [[9, 9]],
          [[9, 9, 9]],
          [[1, 9, 9]]
        ],
        adversarial: [
          [[8, 9, 9, 9]],
          [[9, 0, 9]]
        ],
        stress: [
          [Array.from({ length: 99 }, () => 9)],
          [Array.from({ length: 100 }, (_, i) => i === 0 ? 1 : 0)]
        ]
      }
    }),

    // 010. Remove Element
    createProblem({
      num: 10,
      title: "Remove Element",
      slug: "remove-element",
      level: 1,
      difficulty: "EASY",
      topic: "Array",
      patternSlug: "fundamentals-arrays",
      estimatedTimeMin: 10,
      statement: "Given an integer array `nums` and an integer `val`, remove all occurrences of `val` in `nums` in-place. The order of the elements may be changed. Then return the number of elements in `nums` which are not equal to `val`.\n\nConsider the number of elements in `nums` which are not equal to `val` be `k`. To get accepted, you need to:\n- Change the array `nums` such that the first `k` elements of `nums` contain the elements which are not equal to `val`.\n- Return `k`.",
      functionName: "removeElement",
      parameters: [
        { name: "nums", type: "number[]", description: "Array of integers modified in-place" },
        { name: "val", type: "number", description: "Value to remove" }
      ],
      returnType: "number",
      constraints: ["0 <= nums.length <= 100", "0 <= nums[i] <= 50", "0 <= val <= 100"],
      examples: [
        { input: "nums = [3,2,2,3], val = 3", output: "2", explanation: "First 2 elements are [2, 2]." },
        { input: "nums = [0,1,2,2,3,0,4,2], val = 2", output: "5", explanation: "First 5 elements contain remaining values." }
      ],
      optimalSolution: `function removeElement(nums, val) {\n  let k = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] !== val) {\n      nums[k++] = nums[i];\n    }\n  }\n  return k;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function removeElement(nums, val) {\n  let i = 0;\n  while (i < nums.length) {\n    if (nums[i] === val) nums.splice(i, 1);\n    else i++;\n  }\n  return nums.length;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Using splice inside loop causing O(N^2) shifting"],
      hints: [
        "Maintain write pointer k.",
        "Whenever nums[i] !== val, copy to nums[k] and increment k."
      ],
      oracleFn: (nums: number[], val: number) => {
        let k = 0;
        for (let i = 0; i < nums.length; i++) {
          if (nums[i] !== val) nums[k++] = nums[i];
        }
        return k;
      },
      testCases: {
        functional: [
          [[3, 2, 2, 3], 3],
          [[0, 1, 2, 2, 3, 0, 4, 2], 2],
          [[], 0]
        ],
        boundary: [
          [[1], 1],
          [[1], 2],
          [[2, 2, 2], 2],
          [[1, 2, 3], 4]
        ],
        adversarial: [
          [[4, 5], 5],
          [[5, 5, 5, 5, 1], 5]
        ],
        stress: [
          [Array.from({ length: 100 }, () => 3), 3],
          [Array.from({ length: 100 }, (_, i) => i % 5), 2]
        ]
      }
    }),

    // 011. Remove Duplicates from Sorted Array
    createProblem({
      num: 11,
      title: "Remove Duplicates from Sorted Array",
      slug: "remove-duplicates-from-sorted-array",
      level: 1,
      difficulty: "EASY",
      topic: "Array",
      patternSlug: "fundamentals-arrays",
      estimatedTimeMin: 15,
      statement: "Given an integer array `nums` sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same. Then return the number of unique elements in `nums`.",
      functionName: "removeDuplicates",
      parameters: [{ name: "nums", type: "number[]", description: "Sorted array modified in-place" }],
      returnType: "number",
      constraints: ["1 <= nums.length <= 3 * 10^4", "-100 <= nums[i] <= 100", "nums is sorted in non-decreasing order."],
      examples: [
        { input: "nums = [1,1,2]", output: "2", explanation: "Unique elements are [1, 2]." },
        { input: "nums = [0,0,1,1,1,2,2,3,3,4]", output: "5", explanation: "Unique elements [0, 1, 2, 3, 4]." }
      ],
      optimalSolution: `function removeDuplicates(nums) {\n  if (nums.length === 0) return 0;\n  let write = 1;\n  for (let i = 1; i < nums.length; i++) {\n    if (nums[i] !== nums[i - 1]) nums[write++] = nums[i];\n  }\n  return write;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function removeDuplicates(nums) {\n  const unique = Array.from(new Set(nums));\n  for (let i = 0; i < unique.length; i++) nums[i] = unique[i];\n  return unique.length;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Failing to modify nums in-place"],
      hints: [
        "Since nums is sorted, duplicates are adjacent.",
        "Compare nums[i] with nums[i - 1].",
        "Copy new unique elements into nums[write++]."
      ],
      oracleFn: (nums: number[]) => {
        if (nums.length === 0) return 0;
        let write = 1;
        for (let i = 1; i < nums.length; i++) {
          if (nums[i] !== nums[i - 1]) nums[write++] = nums[i];
        }
        return write;
      },
      testCases: {
        functional: [
          [[1, 1, 2]],
          [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]],
          [[1]]
        ],
        boundary: [
          [[1, 1]],
          [[1, 2]],
          [[1, 1, 1, 1]],
          [[-100, -100, 100]]
        ],
        adversarial: [
          [[1, 2, 3, 4, 5]],
          [[-1, 0, 0, 0, 3, 3]]
        ],
        stress: [
          [Array.from({ length: 3000 }, (_, i) => Math.floor(i / 10))],
          [Array.from({ length: 4000 }, () => 1)]
        ]
      }
    }),

    // 012. Merge Sorted Array
    createProblem({
      num: 12,
      title: "Merge Sorted Array",
      slug: "merge-sorted-array",
      level: 1,
      difficulty: "EASY",
      topic: "Array",
      patternSlug: "fundamentals-arrays",
      estimatedTimeMin: 15,
      statement: "You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n`, representing the number of elements in `nums1` and `nums2` respectively.\n\nMerge `nums1` and `nums2` into a single array sorted in non-decreasing order in-place inside `nums1`.",
      functionName: "merge",
      parameters: [
        { name: "nums1", type: "number[]", description: "Array with capacity m + n" },
        { name: "m", type: "number", description: "Active elements in nums1" },
        { name: "nums2", type: "number[]", description: "Second array" },
        { name: "n", type: "number", description: "Active elements in nums2" }
      ],
      returnType: "number[]",
      constraints: ["nums1.length == m + n", "nums2.length == n", "0 <= m, n <= 200", "1 <= m + n <= 200", "-10^9 <= nums1[i], nums2[j] <= 10^9"],
      examples: [
        { input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3", output: "[1,2,2,3,5,6]", explanation: "Merged in-place." },
        { input: "nums1 = [1], m = 1, nums2 = [], n = 0", output: "[1]", explanation: "Single element." },
        { input: "nums1 = [0], m = 0, nums2 = [1], n = 1", output: "[1]", explanation: "Single element from nums2." }
      ],
      optimalSolution: `function merge(nums1, m, nums2, n) {\n  let p1 = m - 1, p2 = n - 1, p = m + n - 1;\n  while (p2 >= 0) {\n    if (p1 >= 0 && nums1[p1] > nums2[p2]) nums1[p--] = nums1[p1--];\n    else nums1[p--] = nums2[p2--];\n  }\n  return nums1;\n}`,
      optimalTimeComplexity: "O(M + N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function merge(nums1, m, nums2, n) {\n  for (let i = 0; i < n; i++) nums1[m + i] = nums2[i];\n  nums1.sort((a, b) => a - b);\n  return nums1;\n}`,
      suboptimalTimeComplexity: "O((M + N) log(M + N))",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Merging from front (which overwrites unread elements in nums1)"],
      hints: [
        "Merge backwards from the end (p = m + n - 1).",
        "Compare nums1[p1] and nums2[p2], place largest at nums1[p].",
        "In-place O(1) space."
      ],
      oracleFn: (nums1: number[], m: number, nums2: number[], n: number) => {
        let p1 = m - 1, p2 = n - 1, p = m + n - 1;
        while (p2 >= 0) {
          if (p1 >= 0 && nums1[p1] > nums2[p2]) nums1[p--] = nums1[p1--];
          else nums1[p--] = nums2[p2--];
        }
        return nums1;
      },
      testCases: {
        functional: [
          [[1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3],
          [[1], 1, [], 0],
          [[0], 0, [1], 1]
        ],
        boundary: [
          [[2, 0], 1, [1], 1],
          [[4, 5, 6, 0, 0, 0], 3, [1, 2, 3], 3],
          [[-1, 0, 0, 3, 3, 3, 0, 0, 0], 6, [1, 2, 2], 3],
          [[1, 2, 4, 5, 6, 0], 5, [3], 1]
        ],
        adversarial: [
          [[0, 0], 0, [1, 2], 2],
          [[1, 0], 1, [2], 1]
        ],
        stress: [
          [[...Array.from({ length: 100 }, (_, i) => i * 2), ...Array.from({ length: 100 }, () => 0)], 100, Array.from({ length: 100 }, (_, i) => i * 2 + 1), 100],
          [[...Array.from({ length: 100 }, () => 5), ...Array.from({ length: 100 }, () => 0)], 100, Array.from({ length: 100 }, () => 5), 100]
        ]
      }
    }),

    // 013. Move Zeroes
    createProblem({
      num: 13,
      title: "Move Zeroes",
      slug: "move-zeroes",
      level: 1,
      difficulty: "EASY",
      topic: "Array",
      patternSlug: "fundamentals-arrays",
      estimatedTimeMin: 15,
      statement: "Given an integer array `nums`, move all `0`'s to the end of it while maintaining the relative order of the non-zero elements.\n\nNote that you must do this in-place without making a copy of the array.",
      functionName: "moveZeroes",
      parameters: [{ name: "nums", type: "number[]", description: "Array modified in place" }],
      returnType: "number[]",
      constraints: ["1 <= nums.length <= 10^4", "-2^31 <= nums[i] <= 2^31 - 1"],
      examples: [
        { input: "nums = [0,1,0,3,12]", output: "[1,3,12,0,0]", explanation: "Zeroes moved to end." },
        { input: "nums = [0]", output: "[0]", explanation: "Single zero." }
      ],
      optimalSolution: `function moveZeroes(nums) {\n  let write = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] !== 0) {\n      if (write !== i) {\n        nums[write] = nums[i];\n        nums[i] = 0;\n      }\n      write++;\n    }\n  }\n  return nums;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function moveZeroes(nums) {\n  const nonZeros = nums.filter(x => x !== 0);\n  const zeros = nums.filter(x => x === 0);\n  const res = nonZeros.concat(zeros);\n  for (let i = 0; i < nums.length; i++) nums[i] = res[i];\n  return nums;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Using auxiliary arrays (violates in-place constraint)"],
      hints: [
        "Maintain write pointer for the next non-zero position.",
        "Swap nums[i] and nums[write] whenever nums[i] !== 0."
      ],
      oracleFn: (nums: number[]) => {
        let write = 0;
        for (let i = 0; i < nums.length; i++) {
          if (nums[i] !== 0) {
            if (write !== i) {
              nums[write] = nums[i];
              nums[i] = 0;
            }
            write++;
          }
        }
        return nums;
      },
      testCases: {
        functional: [
          [[0, 1, 0, 3, 12]],
          [[0]],
          [[1, 2, 3]]
        ],
        boundary: [
          [[0, 0, 0]],
          [[1, 0]],
          [[0, 1]],
          [[2, 1]]
        ],
        adversarial: [
          [[0, 0, 1]],
          [[1, 0, 1]]
        ],
        stress: [
          [Array.from({ length: 3000 }, (_, i) => i % 2 === 0 ? 0 : i)],
          [Array.from({ length: 4000 }, () => 0)]
        ]
      }
    }),

    // 014. Best Time to Buy and Sell Stock
    createProblem({
      num: 14,
      title: "Best Time to Buy and Sell Stock",
      slug: "best-time-to-buy-and-sell-stock",
      level: 1,
      difficulty: "EASY",
      topic: "Array",
      patternSlug: "fundamentals-arrays",
      estimatedTimeMin: 15,
      statement: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.",
      functionName: "maxProfit",
      parameters: [{ name: "prices", type: "number[]", description: "Array of daily prices" }],
      returnType: "number",
      constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
      examples: [
        { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5." },
        { input: "prices = [7,6,4,3,1]", output: "0", explanation: "No profitable transaction." }
      ],
      optimalSolution: `function maxProfit(prices) {\n  let minPrice = Infinity, maxProfit = 0;\n  for (const p of prices) {\n    if (p < minPrice) minPrice = p;\n    else if (p - minPrice > maxProfit) maxProfit = p - minPrice;\n  }\n  return maxProfit;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function maxProfit(prices) {\n  let maxP = 0;\n  for (let i = 0; i < prices.length; i++) {\n    for (let j = i + 1; j < prices.length; j++) {\n      if (prices[j] - prices[i] > maxP) maxP = prices[j] - prices[i];\n    }\n  }\n  return maxP;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Trying to sell before buying (nested loop or sorting error)"],
      hints: [
        "Track the minimum price seen so far as you iterate.",
        "At each price, potential profit is price - minPrice.",
        "Update maxProfit if higher."
      ],
      oracleFn: (prices: number[]) => {
        let minPrice = Infinity, maxProfit = 0;
        for (const p of prices) {
          if (p < minPrice) minPrice = p;
          else if (p - minPrice > maxProfit) maxProfit = p - minPrice;
        }
        return maxProfit;
      },
      testCases: {
        functional: [
          [[7, 1, 5, 3, 6, 4]],
          [[7, 6, 4, 3, 1]],
          [[1, 2]]
        ],
        boundary: [
          [[1]],
          [[2, 4, 1]],
          [[3, 2, 6, 5, 0, 3]],
          [[1, 1, 1, 1]]
        ],
        adversarial: [
          [[1, 2, 3, 4, 5]],
          [[5, 4, 3, 2, 1, 10]]
        ],
        stress: [
          [Array.from({ length: 3000 }, (_, i) => i + 1)],
          [Array.from({ length: 4000 }, (_, i) => 4000 - i)]
        ]
      }
    }),

    // 015. Majority Element
    createProblem({
      num: 15,
      title: "Majority Element",
      slug: "majority-element",
      level: 1,
      difficulty: "EASY",
      topic: "Array",
      patternSlug: "fundamentals-arrays",
      estimatedTimeMin: 15,
      statement: "Given an array `nums` of size `n`, return the majority element.\n\nThe majority element is the element that appears more than `floor(n / 2)` times. You may assume that the majority element always exists in the array.",
      functionName: "majorityElement",
      parameters: [{ name: "nums", type: "number[]", description: "Array of integers" }],
      returnType: "number",
      constraints: ["n == nums.length", "1 <= n <= 5 * 10^4", "-10^9 <= nums[i] <= 10^9"],
      examples: [
        { input: "nums = [3,2,3]", output: "3", explanation: "3 appears 2 times > 3/2." },
        { input: "nums = [2,2,1,1,1,2,2]", output: "2", explanation: "2 appears 4 times > 7/2." }
      ],
      optimalSolution: `function majorityElement(nums) {\n  let candidate = nums[0], count = 0;\n  for (const n of nums) {\n    if (count === 0) candidate = n;\n    count += (n === candidate ? 1 : -1);\n  }\n  return candidate;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function majorityElement(nums) {\n  nums.sort((a, b) => a - b);\n  return nums[Math.floor(nums.length / 2)];\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Using Hash Map with O(N) space when Boyer-Moore Voting achieves O(1) space"],
      hints: [
        "Boyer-Moore Voting Algorithm:",
        "Maintain candidate and count.",
        "Increment count if n === candidate, decrement otherwise. If count becomes 0, pick current n as new candidate."
      ],
      oracleFn: (nums: number[]) => {
        let candidate = nums[0], count = 0;
        for (const n of nums) {
          if (count === 0) candidate = n;
          count += (n === candidate ? 1 : -1);
        }
        return candidate;
      },
      testCases: {
        functional: [
          [[3, 2, 3]],
          [[2, 2, 1, 1, 1, 2, 2]],
          [[1]]
        ],
        boundary: [
          [[6, 5, 5]],
          [[1, 1, 1, 2]],
          [[-1, -1, 2]],
          [[1000000000]]
        ],
        adversarial: [
          [[1, 2, 1, 2, 1]],
          [[3, 3, 4]]
        ],
        stress: [
          [Array.from({ length: 3000 }, (_, i) => i % 2 === 0 ? 99 : i)],
          [Array.from({ length: 4000 }, () => 42)]
        ]
      }
    }),

    // 016. Missing Number
    createProblem({
      num: 16,
      title: "Missing Number",
      slug: "missing-number",
      level: 1,
      difficulty: "EASY",
      topic: "Array",
      patternSlug: "fundamentals-arrays",
      estimatedTimeMin: 15,
      statement: "Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.",
      functionName: "missingNumber",
      parameters: [{ name: "nums", type: "number[]", description: "Array of distinct numbers" }],
      returnType: "number",
      constraints: ["n == nums.length", "1 <= n <= 10^4", "0 <= nums[i] <= n", "All the numbers of nums are unique."],
      examples: [
        { input: "nums = [3,0,1]", output: "2", explanation: "2 is missing." },
        { input: "nums = [0,1]", output: "2", explanation: "2 is missing." },
        { input: "nums = [9,6,4,2,3,5,7,0,1]", output: "8", explanation: "8 is missing." }
      ],
      optimalSolution: `function missingNumber(nums) {\n  const n = nums.length;\n  const expectedSum = (n * (n + 1)) / 2;\n  const actualSum = nums.reduce((a, b) => a + b, 0);\n  return expectedSum - actualSum;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function missingNumber(nums) {\n  nums.sort((a, b) => a - b);\n  for (let i = 0; i < nums.length; i++) if (nums[i] !== i) return i;\n  return nums.length;\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Sorting array O(N log N) instead of Gauss sum formula O(N)"],
      hints: [
        "Expected sum of numbers from 0 to n is n * (n + 1) / 2.",
        "Missing number is expectedSum - sum(nums).",
        "Or use XOR."
      ],
      oracleFn: (nums: number[]) => {
        const n = nums.length;
        const expectedSum = (n * (n + 1)) / 2;
        const actualSum = nums.reduce((a, b) => a + b, 0);
        return expectedSum - actualSum;
      },
      testCases: {
        functional: [
          [[3, 0, 1]],
          [[0, 1]],
          [[9, 6, 4, 2, 3, 5, 7, 0, 1]]
        ],
        boundary: [
          [[0]],
          [[1]],
          [[1, 0]],
          [[0, 2]]
        ],
        adversarial: [
          [[1, 2, 3]],
          [[0, 1, 2, 3, 4, 6]]
        ],
        stress: [
          [Array.from({ length: 3000 }, (_, i) => i === 1500 ? 3000 : i)],
          [Array.from({ length: 4000 }, (_, i) => i + 1)]
        ]
      }
    }),

    // 017. Single Number
    createProblem({
      num: 17,
      title: "Single Number",
      slug: "single-number",
      level: 1,
      difficulty: "EASY",
      topic: "Array",
      patternSlug: "fundamentals-arrays",
      estimatedTimeMin: 15,
      statement: "Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one.\n\nYou must implement a solution with a linear runtime complexity and use only constant extra space.",
      functionName: "singleNumber",
      parameters: [{ name: "nums", type: "number[]", description: "Array of integers" }],
      returnType: "number",
      constraints: ["1 <= nums.length <= 3 * 10^4", "-3 * 10^4 <= nums[i] <= 3 * 10^4", "Each element in the array appears twice except for one element which appears only once."],
      examples: [
        { input: "nums = [2,2,1]", output: "1", explanation: "1 appears once." },
        { input: "nums = [4,1,2,1,2]", output: "4", explanation: "4 appears once." },
        { input: "nums = [1]", output: "1", explanation: "1." }
      ],
      optimalSolution: `function singleNumber(nums) {\n  let xor = 0;\n  for (const n of nums) xor ^= n;\n  return xor;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function singleNumber(nums) {\n  const set = new Set();\n  for (const n of nums) {\n    if (set.has(n)) set.delete(n);\n    else set.add(n);\n  }\n  return set.values().next().value;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Using Hash Set with O(N) space when XOR achieves O(1) space"],
      hints: [
        "XOR properties: a ^ a = 0 and a ^ 0 = a.",
        "XOR is associative and commutative.",
        "XOR-ing all elements cancels duplicates leaving the unique element."
      ],
      oracleFn: (nums: number[]) => {
        let xor = 0;
        for (const n of nums) xor ^= n;
        return xor;
      },
      testCases: {
        functional: [
          [[2, 2, 1]],
          [[4, 1, 2, 1, 2]],
          [[1]]
        ],
        boundary: [
          [[-1]],
          [[-1, -1, -2]],
          [[0, 1, 0]],
          [[100, 200, 100]]
        ],
        adversarial: [
          [[1, 3, 1, -1, 3]],
          [[30000, -30000, 30000]]
        ],
        stress: [
          [Array.from({ length: 3001 }, (_, i) => i === 3000 ? 999999 : Math.floor(i / 2))],
          [Array.from({ length: 4001 }, (_, i) => i === 0 ? 0 : Math.floor((i + 1) / 2))]
        ]
      }
    }),

    // 018. Intersection of Two Arrays
    createProblem({
      num: 18,
      title: "Intersection of Two Arrays",
      slug: "intersection-of-two-arrays",
      level: 1,
      difficulty: "EASY",
      topic: "Array",
      patternSlug: "fundamentals-arrays",
      estimatedTimeMin: 15,
      statement: "Given two integer arrays `nums1` and `nums2`, return an array of their intersection. Each element in the result must be unique and you may return the result in any order.",
      functionName: "intersection",
      parameters: [
        { name: "nums1", type: "number[]", description: "First array" },
        { name: "nums2", type: "number[]", description: "Second array" }
      ],
      returnType: "number[]",
      constraints: ["1 <= nums1.length, nums2.length <= 1000", "0 <= nums1[i], nums2[i] <= 1000"],
      examples: [
        { input: "nums1 = [1,2,2,1], nums2 = [2,2]", output: "[2]", explanation: "2 is in both." },
        { input: "nums1 = [4,9,5], nums2 = [9,4,9,8,4]", output: "[4,9]", explanation: "4 and 9 are in both." }
      ],
      optimalSolution: `function intersection(nums1, nums2) {\n  const set1 = new Set(nums1);\n  const res = new Set();\n  for (const n of nums2) {\n    if (set1.has(n)) res.add(n);\n  }\n  return Array.from(res).sort((a, b) => a - b);\n}`,
      optimalTimeComplexity: "O(N + M)",
      optimalSpaceComplexity: "O(N + M)",
      suboptimalSolution: `function intersection(nums1, nums2) {\n  return Array.from(new Set(nums1.filter(n => nums2.includes(n)))).sort((a, b) => a - b);\n}`,
      suboptimalTimeComplexity: "O(N * M)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Returning duplicate elements (problem specifies unique elements)"],
      hints: [
        "Insert all elements of nums1 into a Hash Set.",
        "Iterate through nums2 and add matching elements to a result Set."
      ],
      oracleFn: (nums1: number[], nums2: number[]) => {
        const s1 = new Set(nums1);
        const res = new Set<number>();
        for (const n of nums2) if (s1.has(n)) res.add(n);
        return Array.from(res).sort((a, b) => a - b);
      },
      testCases: {
        functional: [
          [[1, 2, 2, 1], [2, 2]],
          [[4, 9, 5], [9, 4, 9, 8, 4]],
          [[1], [1]]
        ],
        boundary: [
          [[1], [2]],
          [[1, 2, 3], [4, 5, 6]],
          [[0, 0, 0], [0]],
          [[1000], [1000]]
        ],
        adversarial: [
          [[1, 2, 2, 1], [1, 1]],
          [[3, 1, 2], [1, 1]]
        ],
        stress: [
          [Array.from({ length: 500 }, (_, i) => i), Array.from({ length: 500 }, (_, i) => i + 250)],
          [Array.from({ length: 1000 }, () => 5), Array.from({ length: 1000 }, () => 5)]
        ]
      }
    }),

    // 019. Intersection of Two Arrays II
    createProblem({
      num: 19,
      title: "Intersection of Two Arrays II",
      slug: "intersection-of-two-arrays-ii",
      level: 1,
      difficulty: "EASY",
      topic: "Array",
      patternSlug: "fundamentals-arrays",
      estimatedTimeMin: 15,
      statement: "Given two integer arrays `nums1` and `nums2`, return an array of their intersection. Each element in the result must appear as many times as it shows in both arrays and you may return the result in any order.",
      functionName: "intersect",
      parameters: [
        { name: "nums1", type: "number[]", description: "First array" },
        { name: "nums2", type: "number[]", description: "Second array" }
      ],
      returnType: "number[]",
      constraints: ["1 <= nums1.length, nums2.length <= 1000", "0 <= nums1[i], nums2[i] <= 1000"],
      examples: [
        { input: "nums1 = [1,2,2,1], nums2 = [2,2]", output: "[2,2]", explanation: "2 appears twice in both." },
        { input: "nums1 = [4,9,5], nums2 = [9,4,9,8,4]", output: "[4,9]", explanation: "4 appears once, 9 appears once." }
      ],
      optimalSolution: `function intersect(nums1, nums2) {\n  const map = new Map();\n  for (const n of nums1) map.set(n, (map.get(n) || 0) + 1);\n  const res = [];\n  for (const n of nums2) {\n    if (map.get(n) > 0) {\n      res.push(n);\n      map.set(n, map.get(n) - 1);\n    }\n  }\n  return res.sort((a, b) => a - b);\n}`,
      optimalTimeComplexity: "O(N + M)",
      optimalSpaceComplexity: "O(min(N, M))",
      suboptimalSolution: `function intersect(nums1, nums2) {\n  nums1.sort((a, b) => a - b);\n  nums2.sort((a, b) => a - b);\n  let i = 0, j = 0, res = [];\n  while (i < nums1.length && j < nums2.length) {\n    if (nums1[i] === nums2[j]) { res.push(nums1[i]); i++; j++; }\n    else if (nums1[i] < nums2[j]) i++;\n    else j++;\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N log N + M log M)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Deduplicating elements (unlike Problem 18, duplicates MUST be preserved)"],
      hints: [
        "Store frequency counts of nums1 in a Hash Map.",
        "Iterate through nums2, decrementing counts and adding to result if count > 0."
      ],
      oracleFn: (nums1: number[], nums2: number[]) => {
        const map = new Map<number, number>();
        for (const n of nums1) map.set(n, (map.get(n) || 0) + 1);
        const res: number[] = [];
        for (const n of nums2) {
          if (map.get(n)! > 0) {
            res.push(n);
            map.set(n, map.get(n)! - 1);
          }
        }
        return res.sort((a, b) => a - b);
      },
      testCases: {
        functional: [
          [[1, 2, 2, 1], [2, 2]],
          [[4, 9, 5], [9, 4, 9, 8, 4]],
          [[1], [1]]
        ],
        boundary: [
          [[1], [2]],
          [[1, 2, 3], [4, 5, 6]],
          [[1, 1, 1], [1, 1]],
          [[0, 0], [0, 0, 0]]
        ],
        adversarial: [
          [[3, 1, 2], [1, 1]],
          [[2, 1], [1, 2]]
        ],
        stress: [
          [Array.from({ length: 500 }, (_, i) => i % 10), Array.from({ length: 500 }, (_, i) => i % 10)],
          [Array.from({ length: 1000 }, () => 1), Array.from({ length: 500 }, () => 1)]
        ]
      }
    }),

    // 020. Find All Numbers Disappeared in an Array
    createProblem({
      num: 20,
      title: "Find All Numbers Disappeared in an Array",
      slug: "find-all-numbers-disappeared-in-an-array",
      level: 1,
      difficulty: "EASY",
      topic: "Array",
      patternSlug: "fundamentals-arrays",
      estimatedTimeMin: 15,
      statement: "Given an array `nums` of `n` integers where `nums[i]` is in the range `[1, n]`, return an array of all the integers in the range `[1, n]` that do not appear in `nums`.\n\nCould you do it without extra space and in `O(n)` runtime? You may assume the returned list does not count as extra space.",
      functionName: "findDisappearedNumbers",
      parameters: [{ name: "nums", type: "number[]", description: "Array of integers in [1, n]" }],
      returnType: "number[]",
      constraints: ["n == nums.length", "1 <= n <= 10^5", "1 <= nums[i] <= n"],
      examples: [
        { input: "nums = [4,3,2,7,8,2,3,1]", output: "[5,6]", explanation: "5 and 6 do not appear." },
        { input: "nums = [1,1]", output: "[2]", explanation: "2 does not appear." }
      ],
      optimalSolution: `function findDisappearedNumbers(nums) {\n  for (let i = 0; i < nums.length; i++) {\n    const idx = Math.abs(nums[i]) - 1;\n    if (nums[idx] > 0) nums[idx] = -nums[idx];\n  }\n  const res = [];\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] > 0) res.push(i + 1);\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1) in-place sign marking",
      suboptimalSolution: `function findDisappearedNumbers(nums) {\n  const set = new Set(nums);\n  const res = [];\n  for (let i = 1; i <= nums.length; i++) if (!set.has(i)) res.push(i);\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Using Hash Set which uses O(N) auxiliary space instead of in-place negation"],
      hints: [
        "Each value v corresponds to index v - 1.",
        "Negate nums[abs(nums[i]) - 1] to mark that the number appeared.",
        "Any index i with nums[i] > 0 was never visited, so i + 1 is missing."
      ],
      oracleFn: (nums: number[]) => {
        const copy = [...nums];
        for (let i = 0; i < copy.length; i++) {
          const idx = Math.abs(copy[i]) - 1;
          if (copy[idx] > 0) copy[idx] = -copy[idx];
        }
        const res: number[] = [];
        for (let i = 0; i < copy.length; i++) {
          if (copy[i] > 0) res.push(i + 1);
        }
        return res;
      },
      testCases: {
        functional: [
          [[4, 3, 2, 7, 8, 2, 3, 1]],
          [[1, 1]],
          [[1]]
        ],
        boundary: [
          [[2, 2]],
          [[1, 2]],
          [[1, 1, 1, 1]],
          [[2, 3, 4, 5, 1]]
        ],
        adversarial: [
          [[10, 2, 5, 10, 9, 1, 1, 4, 3, 7]],
          [[1, 2, 2, 4]]
        ],
        stress: [
          [Array.from({ length: 3000 }, () => 1)],
          [Array.from({ length: 4000 }, (_, i) => i === 0 ? 2 : i + 1)]
        ]
      }
    }),

    // 021. Find Common Characters
    createProblem({
      num: 21,
      title: "Find Common Characters",
      slug: "find-common-characters",
      level: 1,
      difficulty: "EASY",
      topic: "Array",
      patternSlug: "fundamentals-arrays",
      estimatedTimeMin: 15,
      statement: "Given a string array `words`, return an array of all characters that show up in all strings within the `words` (including duplicates). You may return the answer in any order.",
      functionName: "commonChars",
      parameters: [{ name: "words", type: "string[]", description: "Array of words" }],
      returnType: "string[]",
      constraints: ["1 <= words.length <= 100", "1 <= words[i].length <= 100", "words[i] consists of lowercase English letters."],
      examples: [
        { input: 'words = ["bella","label","roller"]', output: '["e","l","l"]', explanation: "'e', 'l', 'l' appear in all words." },
        { input: 'words = ["cool","lock","cook"]', output: '["c","o"]', explanation: "'c', 'o' appear in all words." }
      ],
      optimalSolution: `function commonChars(words) {\n  const minFreq = new Array(26).fill(Infinity);\n  for (const w of words) {\n    const freq = new Array(26).fill(0);\n    for (let i = 0; i < w.length; i++) freq[w.charCodeAt(i) - 97]++;\n    for (let i = 0; i < 26; i++) minFreq[i] = Math.min(minFreq[i], freq[i]);\n  }\n  const res = [];\n  for (let i = 0; i < 26; i++) {\n    while (minFreq[i] > 0) {\n      res.push(String.fromCharCode(97 + i));\n      minFreq[i]--;\n    }\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(N * L)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function commonChars(words) {\n  let common = words[0].split('');\n  for (let i = 1; i < words.length; i++) {\n    const w = words[i].split('');\n    common = common.filter(c => {\n      const idx = w.indexOf(c);\n      if (idx !== -1) { w.splice(idx, 1); return true; }\n      return false;\n    });\n  }\n  return common;\n}`,
      suboptimalTimeComplexity: "O(N * L^2)",
      suboptimalSpaceComplexity: "O(L)",
      commonMistakes: ["Failing to account for character duplicates across words"],
      hints: [
        "Track minimum frequency of each of the 26 characters across all words.",
        "Take min(minFreq[c], currentWordFreq[c])."
      ],
      oracleFn: (words: string[]) => {
        const minFreq = new Array(26).fill(Infinity);
        for (const w of words) {
          const freq = new Array(26).fill(0);
          for (let i = 0; i < w.length; i++) freq[w.charCodeAt(i) - 97]++;
          for (let i = 0; i < 26; i++) minFreq[i] = Math.min(minFreq[i], freq[i]);
        }
        const res: string[] = [];
        for (let i = 0; i < 26; i++) {
          while (minFreq[i] > 0) {
            res.push(String.fromCharCode(97 + i));
            minFreq[i]--;
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [["bella", "label", "roller"]],
          [["cool", "lock", "cook"]],
          [["a"]]
        ],
        boundary: [
          [["a", "b", "c"]],
          [["aa", "aa", "aa"]],
          [["abc", "def"]],
          [["z", "z"]]
        ],
        adversarial: [
          [["acabcdefg", "abcfg", "abcz", "abch"]],
          [["bbdd", "bbcc", "bb"]]
        ],
        stress: [
          [Array.from({ length: 100 }, () => "abcdefghijklmnopqrstuvwxyz")],
          [Array.from({ length: 100 }, () => "aaaaa")]
        ]
      }
    }),

    // 022. Valid Palindrome
    createProblem({
      num: 22,
      title: "Valid Palindrome",
      slug: "valid-palindrome",
      level: 1,
      difficulty: "EASY",
      topic: "String",
      patternSlug: "fundamentals-arrays",
      estimatedTimeMin: 15,
      statement: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.",
      functionName: "isPalindrome",
      parameters: [{ name: "s", type: "string", description: "Input phrase" }],
      returnType: "boolean",
      constraints: ["1 <= s.length <= 2 * 10^5", "s consists only of printable ASCII characters."],
      examples: [
        { input: 's = "A man, a plan, a canal: Panama"', output: "true", explanation: '"amanaplanacanalpanama" is a palindrome.' },
        { input: 's = "race a car"', output: "false", explanation: '"raceacar" is not a palindrome.' },
        { input: 's = " "', output: "true", explanation: 'Empty string after removing non-alphanumeric is a palindrome.' }
      ],
      optimalSolution: `function isPalindrome(s) {\n  let l = 0, r = s.length - 1;\n  function isAlphaNum(code) {\n    return (code >= 48 && code <= 57) || (code >= 97 && code <= 122);\n  }\n  while (l < r) {\n    let cL = s[l].toLowerCase().charCodeAt(0);\n    while (l < r && !isAlphaNum(cL)) {\n      l++;\n      cL = s[l] ? s[l].toLowerCase().charCodeAt(0) : 0;\n    }\n    let cR = s[r].toLowerCase().charCodeAt(0);\n    while (l < r && !isAlphaNum(cR)) {\n      r--;\n      cR = s[r] ? s[r].toLowerCase().charCodeAt(0) : 0;\n    }\n    if (cL !== cR) return false;\n    l++; r--;\n  }\n  return true;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function isPalindrome(s) {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return clean === clean.split('').reverse().join('');\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Creating intermediate cleaned string which violates O(1) space"],
      hints: [
        "Use two pointers (left and right) moving toward each other.",
        "Skip non-alphanumeric characters.",
        "Compare lowercase character codes."
      ],
      oracleFn: (s: string) => {
        const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
        return clean === clean.split('').reverse().join('');
      },
      testCases: {
        functional: [
          ["A man, a plan, a canal: Panama"],
          ["race a car"],
          [" "]
        ],
        boundary: [
          ["a"],
          ["a."],
          ["0P"],
          [",."]
        ],
        adversarial: [
          ["ab_a"],
          ["Live on time, emit no evil"],
          ["No 'x' in Nixon"]
        ],
        stress: [
          ["a".repeat(2000)],
          ["ab".repeat(1500)]
        ]
      }
    }),

    // 023. Reverse String
    createProblem({
      num: 23,
      title: "Reverse String",
      slug: "reverse-string",
      level: 1,
      difficulty: "EASY",
      topic: "String",
      patternSlug: "fundamentals-arrays",
      estimatedTimeMin: 10,
      statement: "Write a function that reverses a string. The input string is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with `O(1)` extra memory.",
      functionName: "reverseString",
      parameters: [{ name: "s", type: "string[]", description: "Array of characters modified in-place" }],
      returnType: "string[]",
      constraints: ["1 <= s.length <= 10^5", "s[i] is a printable ascii character."],
      examples: [
        { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]', explanation: "Reversed characters." },
        { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]', explanation: "Reversed." }
      ],
      optimalSolution: `function reverseString(s) {\n  let l = 0, r = s.length - 1;\n  while (l < r) {\n    const temp = s[l];\n    s[l] = s[r];\n    s[r] = temp;\n    l++; r--;\n  }\n  return s;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function reverseString(s) {\n  return s.reverse();\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Allocating new array instead of in-place swapping"],
      hints: [
        "Two pointers: left at start, right at end.",
        "Swap s[left] and s[right], then advance towards center."
      ],
      oracleFn: (s: string[]) => {
        let l = 0, r = s.length - 1;
        while (l < r) {
          const temp = s[l];
          s[l] = s[r];
          s[r] = temp;
          l++; r--;
        }
        return s;
      },
      testCases: {
        functional: [
          [["h", "e", "l", "l", "o"]],
          [["H", "a", "n", "n", "a", "h"]],
          [["a"]]
        ],
        boundary: [
          [["a", "b"]],
          [["a", "b", "c"]],
          [["1", "2", "3", "4"]],
          [[" "]]
        ],
        adversarial: [
          [["A", " ", "B"]],
          [["!", "@", "#", "$"]]
        ],
        stress: [
          [Array.from({ length: 3000 }, (_, i) => String.fromCharCode(97 + (i % 26)))],
          [Array.from({ length: 4000 }, () => "z")]
        ]
      }
    }),

    // 024. Reverse String II
    createProblem({
      num: 24,
      title: "Reverse String II",
      slug: "reverse-string-ii",
      level: 1,
      difficulty: "EASY",
      topic: "String",
      patternSlug: "fundamentals-arrays",
      estimatedTimeMin: 15,
      statement: "Given a string `s` and an integer `k`, reverse the first `k` characters for every `2k` characters counting from the start of the string.\n\nIf there are fewer than `k` characters left, reverse all of them. If there are less than `2k` but greater than or equal to `k` characters, then reverse the first `k` characters and leave the other as original.",
      functionName: "reverseStr",
      parameters: [
        { name: "s", type: "string", description: "Input string" },
        { name: "k", type: "number", description: "Chunk size" }
      ],
      returnType: "string",
      constraints: ["1 <= s.length <= 10^4", "s consists of only lowercase English letters.", "1 <= k <= 10^4"],
      examples: [
        { input: 's = "abcdefg", k = 2', output: '"bacdfeg"', explanation: "Reverse [0..1] -> 'ba', keep [2..3] -> 'cd', reverse [4..5] -> 'fe', keep 'g'." },
        { input: 's = "abcd", k = 2', output: '"bacd"', explanation: "Reverse [0..1] -> 'ba', keep 'cd'." }
      ],
      optimalSolution: `function reverseStr(s, k) {\n  const a = s.split('');\n  for (let start = 0; start < a.length; start += 2 * k) {\n    let l = start, r = Math.min(start + k - 1, a.length - 1);\n    while (l < r) {\n      const temp = a[l];\n      a[l] = a[r];\n      a[r] = temp;\n      l++; r--;\n    }\n  }\n  return a.join('');\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function reverseStr(s, k) {\n  let res = '';\n  for (let i = 0; i < s.length; i += 2 * k) {\n    res += s.slice(i, i + k).split('').reverse().join('') + s.slice(i + k, i + 2 * k);\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Off-by-one when remaining characters are fewer than k"],
      hints: [
        "Iterate with step size 2 * k.",
        "For each chunk, reverse the segment from start to min(start + k - 1, length - 1)."
      ],
      oracleFn: (s: string, k: number) => {
        const a = s.split('');
        for (let start = 0; start < a.length; start += 2 * k) {
          let l = start, r = Math.min(start + k - 1, a.length - 1);
          while (l < r) {
            const temp = a[l];
            a[l] = a[r];
            a[r] = temp;
            l++; r--;
          }
        }
        return a.join('');
      },
      testCases: {
        functional: [
          ["abcdefg", 2],
          ["abcd", 2],
          ["a", 2]
        ],
        boundary: [
          ["a", 1],
          ["ab", 1],
          ["ab", 2],
          ["abcdef", 3]
        ],
        adversarial: [
          ["hyzqyljrnigxvdtneasepfahmtyhlohwxmkqcdfehybknvdmfrfvtbsovjbdhevlfxpdaovjgunjqlimjkfnqcqnajmebeddqsgl", 39],
          ["abcdefg", 8]
        ],
        stress: [
          ["a".repeat(2000), 50],
          [Array.from({ length: 3000 }, (_, i) => String.fromCharCode(97 + (i % 26))).join(''), 10]
        ]
      }
    }),

    // 025. First Unique Character in a String
    createProblem({
      num: 25,
      title: "First Unique Character in a String",
      slug: "first-unique-character-in-a-string",
      level: 1,
      difficulty: "EASY",
      topic: "String",
      patternSlug: "fundamentals-arrays",
      estimatedTimeMin: 15,
      statement: "Given a string `s`, find the first non-repeating character in it and return its index. If it does not exist, return `-1`.",
      functionName: "firstUniqChar",
      parameters: [{ name: "s", type: "string", description: "Input string" }],
      returnType: "number",
      constraints: ["1 <= s.length <= 10^5", "s consists of only lowercase English letters."],
      examples: [
        { input: 's = "leetcode"', output: "0", explanation: "'l' is the first unique character at index 0." },
        { input: 's = "loveleetcode"', output: "2", explanation: "'v' is the first unique character at index 2." },
        { input: 's = "aabb"', output: "-1", explanation: "No unique characters." }
      ],
      optimalSolution: `function firstUniqChar(s) {\n  const count = new Array(26).fill(0);\n  for (let i = 0; i < s.length; i++) count[s.charCodeAt(i) - 97]++;\n  for (let i = 0; i < s.length; i++) if (count[s.charCodeAt(i) - 97] === 1) return i;\n  return -1;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function firstUniqChar(s) {\n  for (let i = 0; i < s.length; i++) {\n    if (s.indexOf(s[i]) === s.lastIndexOf(s[i])) return i;\n  }\n  return -1;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Using indexOf and lastIndexOf inside loop causing O(N^2) TLE"],
      hints: [
        "Pass 1: Count frequency of each character in an array of size 26.",
        "Pass 2: Traverse string again; return the index of the first character with frequency 1."
      ],
      oracleFn: (s: string) => {
        const count = new Array(26).fill(0);
        for (let i = 0; i < s.length; i++) count[s.charCodeAt(i) - 97]++;
        for (let i = 0; i < s.length; i++) if (count[s.charCodeAt(i) - 97] === 1) return i;
        return -1;
      },
      testCases: {
        functional: [
          ["leetcode"],
          ["loveleetcode"],
          ["aabb"]
        ],
        boundary: [
          ["z"],
          ["aadadaad"],
          ["ab"],
          ["ba"]
        ],
        adversarial: [
          ["dddccdbba"],
          ["abcdefghijklmnopqrstuvwxyz"]
        ],
        stress: [
          ["a".repeat(3000) + "b"],
          ["a".repeat(4000)]
        ]
      }
    })
  ];

  return {
    level: 1,
    levelTitle: "Level 1 — Fundamentals & Easy Arrays",
    topic: "Array Traversal, Simulation & In-place Manipulation",
    problems
  };
}
