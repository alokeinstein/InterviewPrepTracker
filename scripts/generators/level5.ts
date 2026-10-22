import { LevelPayload, GeneratedProblem } from './types';
import { createProblem } from './problemBuilder';

export function getLevel5Payload(): LevelPayload {
  const problems: GeneratedProblem[] = [
    // 96. Binary Search
    createProblem({
      num: 96,
      title: "Binary Search",
      slug: "binary-search",
      level: 5,
      difficulty: "EASY",
      topic: "Binary Search",
      patternSlug: "binary-search-basics",
      estimatedTimeMin: 15,
      statement: "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
      functionName: "search",
      parameters: [
        { name: "nums", type: "number[]", description: "Sorted array of integers" },
        { name: "target", type: "number", description: "Target integer" }
      ],
      returnType: "number",
      constraints: ["1 <= nums.length <= 10^4", "-10^4 < nums[i], target < 10^4", "All the integers in nums are unique.", "nums is sorted in ascending order."],
      examples: [
        { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4", explanation: "9 exists in nums and its index is 4." },
        { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1", explanation: "2 does not exist in nums." }
      ],
      optimalSolution: `function search(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor(left + (right - left) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}`,
      optimalTimeComplexity: "O(log N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function search(nums, target) {\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] === target) return i;\n  }\n  return -1;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Using (left + right) / 2 which can overflow 32-bit signed integer in other languages", "Using left < right instead of left <= right"],
      hints: [
        "Since the array is sorted, compare target against the midpoint.",
        "Calculate mid using left + Math.floor((right - left) / 2).",
        "If nums[mid] === target return mid; narrow bounds accordingly."
      ],
      oracleFn: (nums: number[], target: number) => {
        let left = 0, right = nums.length - 1;
        while (left <= right) {
          const mid = Math.floor(left + (right - left) / 2);
          if (nums[mid] === target) return mid;
          if (nums[mid] < target) left = mid + 1;
          else right = mid - 1;
        }
        return -1;
      },
      testCases: {
        functional: [
          [[-1, 0, 3, 5, 9, 12], 9],
          [[-1, 0, 3, 5, 9, 12], 2],
          [[5], 5]
        ],
        boundary: [
          [[5], -5],
          [[1, 3], 1],
          [[1, 3], 3],
          [[1, 3], 2]
        ],
        adversarial: [
          [[-100, -50, -20, -10, 0, 10, 20, 50, 100], 0],
          [[-100, -50, -20, -10, 0, 10, 20, 50, 100], -100],
          [[-100, -50, -20, -10, 0, 10, 20, 50, 100], 100]
        ],
        stress: [
          [Array.from({ length: 5000 }, (_, i) => i * 2), 4998],
          [Array.from({ length: 5000 }, (_, i) => i * 2), 4999]
        ]
      }
    }),

    // 97. Search Insert Position
    createProblem({
      num: 97,
      title: "Search Insert Position",
      slug: "search-insert-position",
      level: 5,
      difficulty: "EASY",
      topic: "Binary Search",
      patternSlug: "binary-search-basics",
      estimatedTimeMin: 15,
      statement: "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
      functionName: "searchInsert",
      parameters: [
        { name: "nums", type: "number[]", description: "Sorted array of distinct integers" },
        { name: "target", type: "number", description: "Target value" }
      ],
      returnType: "number",
      constraints: ["1 <= nums.length <= 10^4", "-10^4 <= nums[i], target <= 10^4", "nums contains distinct values sorted in ascending order."],
      examples: [
        { input: "nums = [1,3,5,6], target = 5", output: "2", explanation: "5 is at index 2." },
        { input: "nums = [1,3,5,6], target = 2", output: "1", explanation: "2 would be inserted at index 1." },
        { input: "nums = [1,3,5,6], target = 7", output: "4", explanation: "7 would be inserted at index 4." }
      ],
      optimalSolution: `function searchInsert(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor(left + (right - left) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return left;\n}`,
      optimalTimeComplexity: "O(log N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function searchInsert(nums, target) {\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] >= target) return i;\n  }\n  return nums.length;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Returning mid or right instead of left when target is not found"],
      hints: [
        "Binary search for the target.",
        "When the loop terminates (left > right), `left` is the exact lower bound index where target should be inserted."
      ],
      oracleFn: (nums: number[], target: number) => {
        let left = 0, right = nums.length - 1;
        while (left <= right) {
          const mid = Math.floor(left + (right - left) / 2);
          if (nums[mid] === target) return mid;
          if (nums[mid] < target) left = mid + 1;
          else right = mid - 1;
        }
        return left;
      },
      testCases: {
        functional: [
          [[1, 3, 5, 6], 5],
          [[1, 3, 5, 6], 2],
          [[1, 3, 5, 6], 7]
        ],
        boundary: [
          [[1, 3, 5, 6], 0],
          [[1], 0],
          [[1], 1],
          [[1], 2]
        ],
        adversarial: [
          [[1, 2, 4, 6, 7], 3],
          [[3, 5, 7, 9, 10], 8]
        ],
        stress: [
          [Array.from({ length: 4000 }, (_, i) => i * 2), 3999],
          [Array.from({ length: 5000 }, (_, i) => i * 2), 10001]
        ]
      }
    }),

    // 98. First Bad Version
    createProblem({
      num: 98,
      title: "First Bad Version",
      slug: "first-bad-version",
      level: 5,
      difficulty: "EASY",
      topic: "Binary Search",
      patternSlug: "binary-search-basics",
      estimatedTimeMin: 15,
      statement: "You are a product manager and currently leading a team to develop a new product. Unfortunately, the latest version of your product fails the quality check. Since each version is developed based on the previous version, all the versions after a bad version are also bad.\n\nSuppose you have `n` versions `[1, 2, ..., n]` and you want to find out the first bad one, which causes all the following ones to be bad.\n\nGiven `n` and an API `isBadVersion(version)` (or simulate by providing bad version `bad`), return the first bad version.",
      functionName: "firstBadVersion",
      parameters: [
        { name: "n", type: "number", description: "Total versions" },
        { name: "bad", type: "number", description: "First bad version index" }
      ],
      returnType: "number",
      constraints: ["1 <= bad <= n <= 2^31 - 1"],
      examples: [
        { input: "n = 5, bad = 4", output: "4", explanation: "Version 4 is the first bad version." },
        { input: "n = 1, bad = 1", output: "1", explanation: "Version 1 is the first bad version." }
      ],
      optimalSolution: `function firstBadVersion(n, bad) {\n  let left = 1, right = n;\n  while (left < right) {\n    const mid = Math.floor(left + (right - left) / 2);\n    if (mid >= bad) right = mid;\n    else left = mid + 1;\n  }\n  return left;\n}`,
      optimalTimeComplexity: "O(log N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function firstBadVersion(n, bad) {\n  for (let i = 1; i <= n; i++) {\n    if (i >= bad) return i;\n  }\n  return n;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Setting right = mid - 1 when mid is bad (mid itself could be the FIRST bad version)"],
      hints: [
        "If mid is bad, the first bad version must be at mid or to the left: right = mid.",
        "If mid is good, the first bad version must be strictly to the right: left = mid + 1.",
        "Terminate when left === right."
      ],
      oracleFn: (n: number, bad: number) => {
        let left = 1, right = n;
        while (left < right) {
          const mid = Math.floor(left + (right - left) / 2);
          if (mid >= bad) right = mid;
          else left = mid + 1;
        }
        return left;
      },
      testCases: {
        functional: [
          [5, 4],
          [1, 1],
          [3, 2]
        ],
        boundary: [
          [2, 1],
          [2, 2],
          [10, 1],
          [10, 10]
        ],
        adversarial: [
          [2126753390, 1702766719],
          [100, 50]
        ],
        stress: [
          [2147483647, 2147483647],
          [2147483647, 1]
        ]
      }
    }),

    // 99. Guess Number Higher or Lower
    createProblem({
      num: 99,
      title: "Guess Number Higher or Lower",
      slug: "guess-number-higher-or-lower",
      level: 5,
      difficulty: "EASY",
      topic: "Binary Search",
      patternSlug: "binary-search-basics",
      estimatedTimeMin: 15,
      statement: "We are playing the Guess Game. The game is as follows:\n\nI pick a number from `1` to `n`. You have to guess which number I picked.\n\nEvery time you guess wrong, I will tell you whether the number I picked is higher or lower than your guess.\n\nReturn the number that I picked.",
      functionName: "guessNumber",
      parameters: [
        { name: "n", type: "number", description: "Upper range" },
        { name: "pick", type: "number", description: "Target picked number" }
      ],
      returnType: "number",
      constraints: ["1 <= n <= 2^31 - 1", "1 <= pick <= n"],
      examples: [
        { input: "n = 10, pick = 6", output: "6", explanation: "6 is picked." },
        { input: "n = 1, pick = 1", output: "1", explanation: "1 is picked." },
        { input: "n = 2, pick = 1", output: "1", explanation: "1 is picked." }
      ],
      optimalSolution: `function guessNumber(n, pick) {\n  let left = 1, right = n;\n  while (left <= right) {\n    const mid = Math.floor(left + (right - left) / 2);\n    if (mid === pick) return mid;\n    if (mid < pick) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}`,
      optimalTimeComplexity: "O(log N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function guessNumber(n, pick) {\n  for (let i = 1; i <= n; i++) if (i === pick) return i;\n  return -1;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Integer overflow when calculating (left + right) / 2"],
      hints: [
        "Binary search between 1 and n.",
        "If mid < pick, search right half: left = mid + 1.",
        "If mid > pick, search left half: right = mid - 1."
      ],
      oracleFn: (n: number, pick: number) => {
        let left = 1, right = n;
        while (left <= right) {
          const mid = Math.floor(left + (right - left) / 2);
          if (mid === pick) return mid;
          if (mid < pick) left = mid + 1;
          else right = mid - 1;
        }
        return -1;
      },
      testCases: {
        functional: [
          [10, 6],
          [1, 1],
          [2, 1]
        ],
        boundary: [
          [2, 2],
          [100, 1],
          [100, 100],
          [1000, 500]
        ],
        adversarial: [
          [2126753390, 1702766719],
          [10, 3]
        ],
        stress: [
          [2147483647, 2147483647],
          [2147483647, 1000000]
        ]
      }
    }),

    // 100. Sqrt(x)
    createProblem({
      num: 100,
      title: "Sqrt(x)",
      slug: "sqrtx",
      level: 5,
      difficulty: "EASY",
      topic: "Binary Search",
      patternSlug: "binary-search-basics",
      estimatedTimeMin: 15,
      statement: "Given a non-negative integer `x`, return the square root of `x` rounded down to the nearest integer. The returned integer should be non-negative as well.\n\nYou must not use any built-in exponent function or operator, such as `pow(x, 0.5)` or `x ** 0.5`.",
      functionName: "mySqrt",
      parameters: [{ name: "x", type: "number", description: "Non-negative integer" }],
      returnType: "number",
      constraints: ["0 <= x <= 2^31 - 1"],
      examples: [
        { input: "x = 4", output: "2", explanation: "sqrt(4) = 2." },
        { input: "x = 8", output: "2", explanation: "sqrt(8) = 2.82842... rounded down is 2." }
      ],
      optimalSolution: `function mySqrt(x) {\n  if (x < 2) return x;\n  let left = 1, right = Math.floor(x / 2), ans = 1;\n  while (left <= right) {\n    const mid = Math.floor(left + (right - left) / 2);\n    if (mid * mid === x) return mid;\n    if (mid * mid < x) {\n      ans = mid;\n      left = mid + 1;\n    } else {\n      right = mid - 1;\n    }\n  }\n  return ans;\n}`,
      optimalTimeComplexity: "O(log X)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function mySqrt(x) {\n  let i = 0;\n  while ((i + 1) * (i + 1) <= x) i++;\n  return i;\n}`,
      suboptimalTimeComplexity: "O(sqrt(X))",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Using built-in Math.sqrt (disallowed)", "Overflow on mid * mid"],
      hints: [
        "Binary search in range [1, x / 2].",
        "If mid * mid <= x, record mid as potential answer and try larger values.",
        "Otherwise try smaller values."
      ],
      oracleFn: (x: number) => {
        if (x < 2) return x;
        let left = 1, right = Math.floor(x / 2), ans = 1;
        while (left <= right) {
          const mid = Math.floor(left + (right - left) / 2);
          if (mid * mid === x) return mid;
          if (mid * mid < x) {
            ans = mid;
            left = mid + 1;
          } else {
            right = mid - 1;
          }
        }
        return ans;
      },
      testCases: {
        functional: [
          [4],
          [8],
          [0]
        ],
        boundary: [
          [1],
          [2],
          [3],
          [9]
        ],
        adversarial: [
          [2147395599],
          [2147483647],
          [1000000]
        ],
        stress: [
          [2147483647],
          [1000000000]
        ]
      }
    }),

    // 101. Valid Perfect Square
    createProblem({
      num: 101,
      title: "Valid Perfect Square",
      slug: "valid-perfect-square",
      level: 5,
      difficulty: "EASY",
      topic: "Binary Search",
      patternSlug: "binary-search-basics",
      estimatedTimeMin: 15,
      statement: "Given a positive integer `num`, return `true` if `num` is a perfect square or `false` otherwise.\n\nA perfect square is an integer that is the square of an integer. In other words, it is the product of some integer with itself.\n\nYou must not use any built-in library function, such as `sqrt`.",
      functionName: "isPerfectSquare",
      parameters: [{ name: "num", type: "number", description: "Positive integer" }],
      returnType: "boolean",
      constraints: ["1 <= num <= 2^31 - 1"],
      examples: [
        { input: "num = 16", output: "true", explanation: "4 * 4 = 16." },
        { input: "num = 14", output: "false", explanation: "14 is not a square." }
      ],
      optimalSolution: `function isPerfectSquare(num) {\n  let left = 1, right = num;\n  while (left <= right) {\n    const mid = Math.floor(left + (right - left) / 2);\n    const sq = mid * mid;\n    if (sq === num) return true;\n    if (sq < num) left = mid + 1;\n    else right = mid - 1;\n  }\n  return false;\n}`,
      optimalTimeComplexity: "O(log N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function isPerfectSquare(num) {\n  let i = 1;\n  while (i * i < num) i++;\n  return i * i === num;\n}`,
      suboptimalTimeComplexity: "O(sqrt(N))",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Linear scanning causing TLE on 2^31 - 1"],
      hints: [
        "Binary search for integer x such that x * x == num.",
        "Search range [1, num]."
      ],
      oracleFn: (num: number) => {
        let left = 1, right = num;
        while (left <= right) {
          const mid = Math.floor(left + (right - left) / 2);
          const sq = mid * mid;
          if (sq === num) return true;
          if (sq < num) left = mid + 1;
          else right = mid - 1;
        }
        return false;
      },
      testCases: {
        functional: [
          [16],
          [14],
          [1]
        ],
        boundary: [
          [4],
          [9],
          [2],
          [5]
        ],
        adversarial: [
          [2147483647],
          [808201],
          [2000105819]
        ],
        stress: [
          [2147395600],
          [2147483646]
        ]
      }
    }),

    // 102. Find Smallest Letter Greater Than Target
    createProblem({
      num: 102,
      title: "Find Smallest Letter Greater Than Target",
      slug: "find-smallest-letter-greater-than-target",
      level: 5,
      difficulty: "EASY",
      topic: "Binary Search",
      patternSlug: "binary-search-basics",
      estimatedTimeMin: 15,
      statement: "You are given an array of characters `letters` that is sorted in non-decreasing order, and a character `target`. There are at least two different characters in `letters`.\n\nReturn the smallest character in `letters` that is lexicographically greater than `target`. If such a character does not exist, return the first character in `letters`.",
      functionName: "nextGreatestLetter",
      parameters: [
        { name: "letters", type: "string[]", description: "Sorted array of characters" },
        { name: "target", type: "string", description: "Target character" }
      ],
      returnType: "string",
      constraints: ["2 <= letters.length <= 10^4", "letters[i] is a lowercase English letter.", "letters is sorted in non-decreasing order.", "target is a lowercase English letter."],
      examples: [
        { input: 'letters = ["c","f","j"], target = "a"', output: '"c"', explanation: "'c' is smallest letter greater than 'a'." },
        { input: 'letters = ["c","f","j"], target = "c"', output: '"f"', explanation: "'f' is greater than 'c'." },
        { input: 'letters = ["x","x","y","y"], target = "z"', output: '"x"', explanation: "No letter > 'z', wrap around to 'x'." }
      ],
      optimalSolution: `function nextGreatestLetter(letters, target) {\n  let left = 0, right = letters.length - 1;\n  while (left <= right) {\n    const mid = Math.floor(left + (right - left) / 2);\n    if (letters[mid] <= target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return letters[left % letters.length];\n}`,
      optimalTimeComplexity: "O(log N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function nextGreatestLetter(letters, target) {\n  for (const c of letters) if (c > target) return c;\n  return letters[0];\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Failing to wrap around to letters[0] when target is >= all characters"],
      hints: [
        "Find the first letter strictly greater than target.",
        "If letters[mid] <= target, search right: left = mid + 1.",
        "Wrap around using left % letters.length."
      ],
      oracleFn: (letters: string[], target: string) => {
        let left = 0, right = letters.length - 1;
        while (left <= right) {
          const mid = Math.floor(left + (right - left) / 2);
          if (letters[mid] <= target) left = mid + 1;
          else right = mid - 1;
        }
        return letters[left % letters.length];
      },
      testCases: {
        functional: [
          [["c", "f", "j"], "a"],
          [["c", "f", "j"], "c"],
          [["x", "x", "y", "y"], "z"]
        ],
        boundary: [
          [["c", "f", "j"], "d"],
          [["c", "f", "j"], "g"],
          [["c", "f", "j"], "j"],
          [["a", "b"], "z"]
        ],
        adversarial: [
          [["e", "e", "e", "e", "e", "e", "n", "n", "n", "n"], "e"],
          [["e", "e", "g", "g"], "g"]
        ],
        stress: [
          [Array.from({ length: 3000 }, () => "a").concat(["z"]), "y"],
          [Array.from({ length: 4000 }, (_, i) => String.fromCharCode(97 + Math.floor(i / 200))), "z"]
        ]
      }
    }),

    // 103. Search a 2D Matrix
    createProblem({
      num: 103,
      title: "Search a 2D Matrix",
      slug: "search-a-2d-matrix",
      level: 5,
      difficulty: "MEDIUM",
      topic: "Binary Search",
      patternSlug: "binary-search-basics",
      estimatedTimeMin: 20,
      statement: "You are given an `m x n` integer matrix `matrix` with the following two properties:\n- Each row is sorted in non-decreasing order.\n- The first integer of each row is greater than the last integer of the previous row.\n\nGiven an integer `target`, return `true` if `target` is in `matrix` or `false` otherwise.\n\nYou must write a solution in `O(log(m * n))` time complexity.",
      functionName: "searchMatrix",
      parameters: [
        { name: "matrix", type: "number[][]", description: "Sorted 2D matrix" },
        { name: "target", type: "number", description: "Target value" }
      ],
      returnType: "boolean",
      constraints: ["m == matrix.length", "n == matrix[i].length", "1 <= m, n <= 100", "-10^4 <= matrix[i][j], target <= 10^4"],
      examples: [
        { input: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3", output: "true", explanation: "3 exists at [0][1]." },
        { input: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13", output: "false", explanation: "13 does not exist." }
      ],
      optimalSolution: `function searchMatrix(matrix, target) {\n  const m = matrix.length, n = matrix[0].length;\n  let left = 0, right = m * n - 1;\n  while (left <= right) {\n    const mid = Math.floor(left + (right - left) / 2);\n    const row = Math.floor(mid / n);\n    const col = mid % n;\n    const val = matrix[row][col];\n    if (val === target) return true;\n    if (val < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return false;\n}`,
      optimalTimeComplexity: "O(log(M * N))",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function searchMatrix(matrix, target) {\n  for (const row of matrix) {\n    if (row.includes(target)) return true;\n  }\n  return false;\n}`,
      suboptimalTimeComplexity: "O(M * N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Converting index to 2D coordinates: row = Math.floor(mid / n), col = mid % n (using m instead of n causes indexing errors)"],
      hints: [
        "The entire matrix behaves like a single sorted 1D array of length m * n.",
        "Perform binary search on virtual 1D array from 0 to m * n - 1.",
        "Map mid to (row, col) via row = Math.floor(mid / n), col = mid % n."
      ],
      oracleFn: (matrix: number[][], target: number) => {
        const m = matrix.length, n = matrix[0].length;
        let left = 0, right = m * n - 1;
        while (left <= right) {
          const mid = Math.floor(left + (right - left) / 2);
          const row = Math.floor(mid / n);
          const col = mid % n;
          const val = matrix[row][col];
          if (val === target) return true;
          if (val < target) left = mid + 1;
          else right = mid - 1;
        }
        return false;
      },
      testCases: {
        functional: [
          [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3],
          [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13],
          [[[1]], 1]
        ],
        boundary: [
          [[[1]], 0],
          [[[1]], 2],
          [[[1, 3]], 3],
          [[[1], [3]], 3]
        ],
        adversarial: [
          [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 50]], 11],
          [[[1, 3, 5]], 4]
        ],
        stress: [
          [Array.from({ length: 50 }, (_, r) => Array.from({ length: 50 }, (_, c) => r * 50 + c)), 2450],
          [Array.from({ length: 50 }, (_, r) => Array.from({ length: 50 }, (_, c) => r * 50 + c)), 9999]
        ]
      }
    }),

    // 104. Find First and Last Position of Element in Sorted Array
    createProblem({
      num: 104,
      title: "Find First and Last Position of Element in Sorted Array",
      slug: "find-first-and-last-position-of-element-in-sorted-array",
      level: 5,
      difficulty: "MEDIUM",
      topic: "Binary Search",
      patternSlug: "binary-search-basics",
      estimatedTimeMin: 20,
      statement: "Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value.\n\nIf `target` is not found in the array, return `[-1, -1]`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
      functionName: "searchRange",
      parameters: [
        { name: "nums", type: "number[]", description: "Sorted array" },
        { name: "target", type: "number", description: "Target value" }
      ],
      returnType: "number[]",
      constraints: ["0 <= nums.length <= 10^5", "-10^9 <= nums[i], target <= 10^9", "nums is sorted in non-decreasing order."],
      examples: [
        { input: "nums = [5,7,7,8,8,10], target = 8", output: "[3,4]", explanation: "8 spans from index 3 to 4." },
        { input: "nums = [5,7,7,8,8,10], target = 6", output: "[-1,-1]", explanation: "6 not found." },
        { input: "nums = [], target = 0", output: "[-1,-1]", explanation: "Empty array." }
      ],
      optimalSolution: `function searchRange(nums, target) {\n  function findBound(isFirst) {\n    let left = 0, right = nums.length - 1, bound = -1;\n    while (left <= right) {\n      const mid = Math.floor(left + (right - left) / 2);\n      if (nums[mid] === target) {\n        bound = mid;\n        if (isFirst) right = mid - 1;\n        else left = mid + 1;\n      } else if (nums[mid] < target) {\n        left = mid + 1;\n      } else {\n        right = mid - 1;\n      }\n    }\n    return bound;\n  }\n  return [findBound(true), findBound(false)];\n}`,
      optimalTimeComplexity: "O(log N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function searchRange(nums, target) {\n  const first = nums.indexOf(target);\n  const last = nums.lastIndexOf(target);\n  return [first, last];\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Finding target once and expanding linearly left and right O(N) when all elements are duplicates"],
      hints: [
        "Run two binary searches: one for the first occurrence, one for the last.",
        "To find the first occurrence, when nums[mid] === target, continue searching left: right = mid - 1.",
        "To find the last occurrence, when nums[mid] === target, continue searching right: left = mid + 1."
      ],
      oracleFn: (nums: number[], target: number) => {
        function findBound(isFirst: boolean) {
          let left = 0, right = nums.length - 1, bound = -1;
          while (left <= right) {
            const mid = Math.floor(left + (right - left) / 2);
            if (nums[mid] === target) {
              bound = mid;
              if (isFirst) right = mid - 1;
              else left = mid + 1;
            } else if (nums[mid] < target) {
              left = mid + 1;
            } else {
              right = mid - 1;
            }
          }
          return bound;
        }
        return [findBound(true), findBound(false)];
      },
      testCases: {
        functional: [
          [[5, 7, 7, 8, 8, 10], 8],
          [[5, 7, 7, 8, 8, 10], 6],
          [[], 0]
        ],
        boundary: [
          [[1], 1],
          [[1], 2],
          [[2, 2], 2],
          [[1, 3], 1]
        ],
        adversarial: [
          [[1, 2, 3, 3, 3, 3, 4, 5], 3],
          [[8, 8, 8, 8, 8, 8], 8],
          [[1, 2, 3], 2]
        ],
        stress: [
          [Array.from({ length: 4000 }, () => 7), 7],
          [Array.from({ length: 5000 }, (_, i) => i * 2), 2500]
        ]
      }
    }),

    // 105. Find Minimum in Rotated Sorted Array
    createProblem({
      num: 105,
      title: "Find Minimum in Rotated Sorted Array",
      slug: "find-minimum-in-rotated-sorted-array",
      level: 5,
      difficulty: "MEDIUM",
      topic: "Binary Search",
      patternSlug: "binary-search-basics",
      estimatedTimeMin: 20,
      statement: "Suppose an array of length `n` sorted in ascending order is rotated between 1 and `n` times.\n\nGiven the sorted rotated array `nums` of unique elements, return the minimum element of this array.\n\nYou must write an algorithm that runs in `O(log n)` time.",
      functionName: "findMin",
      parameters: [{ name: "nums", type: "number[]", description: "Rotated sorted array of unique elements" }],
      returnType: "number",
      constraints: ["n == nums.length", "1 <= n <= 5000", "-5000 <= nums[i] <= 5000", "All the integers of nums are unique."],
      examples: [
        { input: "nums = [3,4,5,1,2]", output: "1", explanation: "Original was [1,2,3,4,5] rotated 3 times." },
        { input: "nums = [4,5,6,7,0,1,2]", output: "0", explanation: "Min is 0." },
        { input: "nums = [11,13,15,17]", output: "11", explanation: "Rotated 4 times (identical to 0)." }
      ],
      optimalSolution: `function findMin(nums) {\n  let left = 0, right = nums.length - 1;\n  while (left < right) {\n    const mid = Math.floor(left + (right - left) / 2);\n    if (nums[mid] > nums[right]) left = mid + 1;\n    else right = mid;\n  }\n  return nums[left];\n}`,
      optimalTimeComplexity: "O(log N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function findMin(nums) {\n  let min = nums[0];\n  for (let i = 1; i < nums.length; i++) if (nums[i] < min) min = nums[i];\n  return min;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Comparing nums[mid] with nums[left] instead of nums[right]"],
      hints: [
        "Compare nums[mid] with nums[right].",
        "If nums[mid] > nums[right], the inflection point (minimum) must lie strictly to the right: left = mid + 1.",
        "If nums[mid] <= nums[right], the minimum is at mid or to the left: right = mid."
      ],
      oracleFn: (nums: number[]) => {
        let left = 0, right = nums.length - 1;
        while (left < right) {
          const mid = Math.floor(left + (right - left) / 2);
          if (nums[mid] > nums[right]) left = mid + 1;
          else right = mid;
        }
        return nums[left];
      },
      testCases: {
        functional: [
          [[3, 4, 5, 1, 2]],
          [[4, 5, 6, 7, 0, 1, 2]],
          [[11, 13, 15, 17]]
        ],
        boundary: [
          [[1]],
          [[2, 1]],
          [[1, 2]],
          [[3, 1, 2]]
        ],
        adversarial: [
          [[5, 1, 2, 3, 4]],
          [[2, 3, 4, 5, 1]],
          [[10, 20, 30, 40, -5, 0, 5]]
        ],
        stress: [
          [Array.from({ length: 3000 }, (_, i) => (i + 1500) % 3000)],
          [Array.from({ length: 4000 }, (_, i) => i)]
        ]
      }
    }),

    // 106. Search in Rotated Sorted Array
    createProblem({
      num: 106,
      title: "Search in Rotated Sorted Array",
      slug: "search-in-rotated-sorted-array",
      level: 5,
      difficulty: "MEDIUM",
      topic: "Binary Search",
      patternSlug: "binary-search-basics",
      estimatedTimeMin: 20,
      statement: "There is an integer array `nums` sorted in ascending order (with distinct values).\n\nPrior to being passed to your function, `nums` is possibly rotated at an unknown pivot index.\n\nGiven the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
      functionName: "search",
      parameters: [
        { name: "nums", type: "number[]", description: "Rotated sorted array" },
        { name: "target", type: "number", description: "Target value" }
      ],
      returnType: "number",
      constraints: ["1 <= nums.length <= 5000", "-10^4 <= nums[i], target <= 10^4", "All values of nums are unique.", "nums is an ascending array that is possibly rotated."],
      examples: [
        { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4", explanation: "0 is at index 4." },
        { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1", explanation: "3 not in nums." },
        { input: "nums = [1], target = 0", output: "-1", explanation: "Not found." }
      ],
      optimalSolution: `function search(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor(left + (right - left) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[left] <= nums[mid]) {\n      if (nums[left] <= target && target < nums[mid]) right = mid - 1;\n      else left = mid + 1;\n    } else {\n      if (nums[mid] < target && target <= nums[right]) left = mid + 1;\n      else right = mid - 1;\n    }\n  }\n  return -1;\n}`,
      optimalTimeComplexity: "O(log N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function search(nums, target) {\n  return nums.indexOf(target);\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Failing to determine which half is sorted before comparing target with bounds"],
      hints: [
        "At least one half of [left..right] is always normally sorted.",
        "If nums[left] <= nums[mid], the left half is sorted. Check if target lies within [nums[left], nums[mid]).",
        "Otherwise the right half is sorted. Check if target lies within (nums[mid], nums[right]]."
      ],
      oracleFn: (nums: number[], target: number) => {
        let left = 0, right = nums.length - 1;
        while (left <= right) {
          const mid = Math.floor(left + (right - left) / 2);
          if (nums[mid] === target) return mid;
          if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) right = mid - 1;
            else left = mid + 1;
          } else {
            if (nums[mid] < target && target <= nums[right]) left = mid + 1;
            else right = mid - 1;
          }
        }
        return -1;
      },
      testCases: {
        functional: [
          [[4, 5, 6, 7, 0, 1, 2], 0],
          [[4, 5, 6, 7, 0, 1, 2], 3],
          [[1], 0]
        ],
        boundary: [
          [[1], 1],
          [[3, 1], 1],
          [[3, 1], 3],
          [[5, 1, 3], 5]
        ],
        adversarial: [
          [[4, 5, 6, 7, 8, 1, 2, 3], 8],
          [[8, 1, 2, 3, 4, 5, 6, 7], 8],
          [[6, 7, 1, 2, 3, 4, 5], 6]
        ],
        stress: [
          [Array.from({ length: 3000 }, (_, i) => (i + 1200) % 3000), 1200],
          [Array.from({ length: 4000 }, (_, i) => (i + 2500) % 4000), 9999]
        ]
      }
    }),

    // 107. Search in Rotated Sorted Array II
    createProblem({
      num: 107,
      title: "Search in Rotated Sorted Array II",
      slug: "search-in-rotated-sorted-array-ii",
      level: 5,
      difficulty: "MEDIUM",
      topic: "Binary Search",
      patternSlug: "binary-search-basics",
      estimatedTimeMin: 20,
      statement: "There is an integer array `nums` sorted in non-decreasing order (not necessarily with distinct values).\n\nBefore being passed to your function, `nums` is rotated at an unknown pivot index.\n\nGiven the array `nums` after rotation and an integer `target`, return `true` if `target` is in `nums`, or `false` if it is not in `nums`.\n\nYou must decrease the overall operation steps as much as possible.",
      functionName: "search",
      parameters: [
        { name: "nums", type: "number[]", description: "Rotated sorted array with potential duplicates" },
        { name: "target", type: "number", description: "Target integer" }
      ],
      returnType: "boolean",
      constraints: ["1 <= nums.length <= 5000", "-10^4 <= nums[i], target <= 10^4", "nums is guaranteed to be rotated at some pivot."],
      examples: [
        { input: "nums = [2,5,6,0,0,1,2], target = 0", output: "true", explanation: "0 is in nums." },
        { input: "nums = [2,5,6,0,0,1,2], target = 3", output: "false", explanation: "3 not in nums." }
      ],
      optimalSolution: `function search(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor(left + (right - left) / 2);\n    if (nums[mid] === target) return true;\n    if (nums[left] === nums[mid] && nums[mid] === nums[right]) {\n      left++; right--;\n    } else if (nums[left] <= nums[mid]) {\n      if (nums[left] <= target && target < nums[mid]) right = mid - 1;\n      else left = mid + 1;\n    } else {\n      if (nums[mid] < target && target <= nums[right]) left = mid + 1;\n      else right = mid - 1;\n    }\n  }\n  return false;\n}`,
      optimalTimeComplexity: "O(log N) average, O(N) worst case with all duplicates",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function search(nums, target) {\n  return nums.includes(target);\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Infinite loop when nums[left] === nums[mid] === nums[right]"],
      hints: [
        "Duplicates introduce ambiguity: if nums[left] === nums[mid] === nums[right], we cannot deduce which half is sorted.",
        "In that case, simply increment left and decrement right.",
        "Otherwise proceed with standard rotated binary search."
      ],
      oracleFn: (nums: number[], target: number) => {
        let left = 0, right = nums.length - 1;
        while (left <= right) {
          const mid = Math.floor(left + (right - left) / 2);
          if (nums[mid] === target) return true;
          if (nums[left] === nums[mid] && nums[mid] === nums[right]) {
            left++; right--;
          } else if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) right = mid - 1;
            else left = mid + 1;
          } else {
            if (nums[mid] < target && target <= nums[right]) left = mid + 1;
            else right = mid - 1;
          }
        }
        return false;
      },
      testCases: {
        functional: [
          [[2, 5, 6, 0, 0, 1, 2], 0],
          [[2, 5, 6, 0, 0, 1, 2], 3],
          [[1, 0, 1, 1, 1], 0]
        ],
        boundary: [
          [[1], 1],
          [[1], 2],
          [[1, 1, 1, 1], 1],
          [[1, 1, 1, 1], 2]
        ],
        adversarial: [
          [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1], 2],
          [[1, 3, 1, 1, 1], 3],
          [[3, 1, 2, 2, 2], 1]
        ],
        stress: [
          [Array.from({ length: 3000 }, () => 1).concat([2]), 2],
          [Array.from({ length: 3000 }, () => 5), 3]
        ]
      }
    }),

    // 108. Find Peak Element
    createProblem({
      num: 108,
      title: "Find Peak Element",
      slug: "find-peak-element",
      level: 5,
      difficulty: "MEDIUM",
      topic: "Binary Search",
      patternSlug: "binary-search-basics",
      estimatedTimeMin: 20,
      statement: "A peak element is an element that is strictly greater than its neighbors.\n\nGiven a 0-indexed integer array `nums`, find a peak element, and return its index. If the array contains multiple peaks, return the index to any of the peaks.\n\nYou may imagine that `nums[-1] = nums[n] = -infinity`.\n\nYou must write an algorithm that runs in `O(log n)` time.",
      functionName: "findPeakElement",
      parameters: [{ name: "nums", type: "number[]", description: "Array of integers" }],
      returnType: "number",
      constraints: ["1 <= nums.length <= 1000", "-2^31 <= nums[i] <= 2^31 - 1", "nums[i] != nums[i + 1] for all valid i."],
      examples: [
        { input: "nums = [1,2,3,1]", output: "2", explanation: "3 is a peak element and its index is 2." },
        { input: "nums = [1,2,1,3,5,6,4]", output: "5", explanation: "Index 1 (value 2) or index 5 (value 6) are valid." }
      ],
      optimalSolution: `function findPeakElement(nums) {\n  let left = 0, right = nums.length - 1;\n  while (left < right) {\n    const mid = Math.floor(left + (right - left) / 2);\n    if (nums[mid] > nums[mid + 1]) right = mid;\n    else left = mid + 1;\n  }\n  return left;\n}`,
      optimalTimeComplexity: "O(log N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function findPeakElement(nums) {\n  for (let i = 0; i < nums.length - 1; i++) {\n    if (nums[i] > nums[i + 1]) return i;\n  }\n  return nums.length - 1;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Linear scanning O(N) instead of binary searching the slope O(log N)"],
      hints: [
        "If nums[mid] > nums[mid + 1], you are on a downward slope, so a peak must exist to the left (including mid): right = mid.",
        "If nums[mid] < nums[mid + 1], you are on an upward slope, so a peak must exist to the right: left = mid + 1."
      ],
      oracleFn: (nums: number[]) => {
        let left = 0, right = nums.length - 1;
        while (left < right) {
          const mid = Math.floor(left + (right - left) / 2);
          if (nums[mid] > nums[mid + 1]) right = mid;
          else left = mid + 1;
        }
        return left;
      },
      testCases: {
        functional: [
          [[1, 2, 3, 1]],
          [[1, 2, 1, 3, 5, 6, 4]],
          [[1]]
        ],
        boundary: [
          [[1, 2]],
          [[2, 1]],
          [[1, 2, 3, 4, 5]],
          [[5, 4, 3, 2, 1]]
        ],
        adversarial: [
          [[1, 3, 2, 1]],
          [[3, 4, 3, 2, 1]],
          [[1, 2, 1, 2, 1]]
        ],
        stress: [
          [Array.from({ length: 1000 }, (_, i) => i)],
          [Array.from({ length: 1000 }, (_, i) => i === 500 ? 99999 : i < 500 ? i : 1000 - i)]
        ]
      }
    }),

    // 109. Peak Index in a Mountain Array
    createProblem({
      num: 109,
      title: "Peak Index in a Mountain Array",
      slug: "peak-index-in-a-mountain-array",
      level: 5,
      difficulty: "MEDIUM",
      topic: "Binary Search",
      patternSlug: "binary-search-basics",
      estimatedTimeMin: 15,
      statement: "An array `arr` is a mountain if the following properties hold:\n- `arr.length >= 3`\n- There exists some `i` with `0 < i < arr.length - 1` such that:\n  - `arr[0] < arr[1] < ... < arr[i - 1] < arr[i]`\n  - `arr[i] > arr[i + 1] > ... > arr[arr.length - 1]`\n\nGiven a mountain array `arr`, return the index `i` such that `arr[0] < arr[1] < ... < arr[i - 1] < arr[i] > arr[i + 1] > ... > arr[arr.length - 1]`.\n\nYou must solve it in `O(log(arr.length))` time complexity.",
      functionName: "peakIndexInMountainArray",
      parameters: [{ name: "arr", type: "number[]", description: "Mountain array" }],
      returnType: "number",
      constraints: ["3 <= arr.length <= 10^5", "0 <= arr[i] <= 10^6", "arr is guaranteed to be a mountain array."],
      examples: [
        { input: "arr = [0,1,0]", output: "1", explanation: "Peak is at index 1." },
        { input: "arr = [0,2,1,0]", output: "1", explanation: "Peak is at index 1." },
        { input: "arr = [0,10,5,2]", output: "1", explanation: "Peak at index 1." }
      ],
      optimalSolution: `function peakIndexInMountainArray(arr) {\n  let left = 0, right = arr.length - 1;\n  while (left < right) {\n    const mid = Math.floor(left + (right - left) / 2);\n    if (arr[mid] < arr[mid + 1]) left = mid + 1;\n    else right = mid;\n  }\n  return left;\n}`,
      optimalTimeComplexity: "O(log N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function peakIndexInMountainArray(arr) {\n  let maxIdx = 0;\n  for (let i = 1; i < arr.length; i++) if (arr[i] > arr[maxIdx]) maxIdx = i;\n  return maxIdx;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Linear scanning O(N)"],
      hints: [
        "Binary search for the inflection where arr[mid] > arr[mid + 1].",
        "If arr[mid] < arr[mid + 1], peak is to the right: left = mid + 1.",
        "Otherwise peak is at mid or left: right = mid."
      ],
      oracleFn: (arr: number[]) => {
        let left = 0, right = arr.length - 1;
        while (left < right) {
          const mid = Math.floor(left + (right - left) / 2);
          if (arr[mid] < arr[mid + 1]) left = mid + 1;
          else right = mid;
        }
        return left;
      },
      testCases: {
        functional: [
          [[0, 1, 0]],
          [[0, 2, 1, 0]],
          [[0, 10, 5, 2]]
        ],
        boundary: [
          [[3, 4, 5, 1]],
          [[24, 69, 100, 99, 79, 78, 67, 36, 26, 19]],
          [[0, 1, 2, 3, 4, 5, 2]]
        ],
        adversarial: [
          [[0, 10, 20, 30, 40, 50, 49, 48]],
          [[1, 2, 3, 2, 1]]
        ],
        stress: [
          [Array.from({ length: 3000 }, (_, i) => i < 1500 ? i : 3000 - i)],
          [Array.from({ length: 4000 }, (_, i) => i < 3500 ? i : 7000 - i)]
        ]
      }
    }),

    // 110. Single Element in a Sorted Array
    createProblem({
      num: 110,
      title: "Single Element in a Sorted Array",
      slug: "single-element-in-a-sorted-array",
      level: 5,
      difficulty: "MEDIUM",
      topic: "Binary Search",
      patternSlug: "binary-search-basics",
      estimatedTimeMin: 20,
      statement: "You are given a sorted array consisting of only integers where every element appears exactly twice, except for one element which appears exactly once.\n\nReturn the single element that appears only once.\n\nYour solution must run in `O(log n)` time and `O(1)` space.",
      functionName: "singleNonDuplicate",
      parameters: [{ name: "nums", type: "number[]", description: "Sorted array of pairs and one single" }],
      returnType: "number",
      constraints: ["1 <= nums.length <= 10^5", "0 <= nums[i] <= 10^5"],
      examples: [
        { input: "nums = [1,1,2,3,3,4,4,8,8]", output: "2", explanation: "2 appears only once." },
        { input: "nums = [3,3,7,7,10,11,11]", output: "10", explanation: "10 appears only once." }
      ],
      optimalSolution: `function singleNonDuplicate(nums) {\n  let left = 0, right = nums.length - 1;\n  while (left < right) {\n    let mid = Math.floor(left + (right - left) / 2);\n    if (mid % 2 === 1) mid--;\n    if (nums[mid] === nums[mid + 1]) left = mid + 2;\n    else right = mid;\n  }\n  return nums[left];\n}`,
      optimalTimeComplexity: "O(log N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function singleNonDuplicate(nums) {\n  let xor = 0;\n  for (const n of nums) xor ^= n;\n  return xor;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Using XOR which runs in O(N) rather than the required O(log N)"],
      hints: [
        "Before the single element, pairs start on even indices (0, 2, 4, ...).",
        "After the single element, pairs start on odd indices.",
        "Ensure mid is even (if mid is odd, decrement by 1).",
        "If nums[mid] === nums[mid + 1], single is to the right: left = mid + 2; else right = mid."
      ],
      oracleFn: (nums: number[]) => {
        let left = 0, right = nums.length - 1;
        while (left < right) {
          let mid = Math.floor(left + (right - left) / 2);
          if (mid % 2 === 1) mid--;
          if (nums[mid] === nums[mid + 1]) left = mid + 2;
          else right = mid;
        }
        return nums[left];
      },
      testCases: {
        functional: [
          [[1, 1, 2, 3, 3, 4, 4, 8, 8]],
          [[3, 3, 7, 7, 10, 11, 11]],
          [[1]]
        ],
        boundary: [
          [[1, 1, 2]],
          [[1, 2, 2]],
          [[1, 1, 2, 2, 3]],
          [[1, 2, 2, 3, 3]]
        ],
        adversarial: [
          [[1, 1, 2, 2, 3, 3, 4, 8, 8]],
          [[3, 3, 7, 7, 10, 10, 11]]
        ],
        stress: [
          [Array.from({ length: 3001 }, (_, i) => i === 3000 ? 999999 : Math.floor(i / 2))],
          [Array.from({ length: 4001 }, (_, i) => i === 0 ? 0 : Math.floor((i + 1) / 2))]
        ]
      }
    }),

    // 111. Kth Missing Positive Number
    createProblem({
      num: 111,
      title: "Kth Missing Positive Number",
      slug: "kth-missing-positive-number",
      level: 5,
      difficulty: "EASY",
      topic: "Binary Search",
      patternSlug: "binary-search-basics",
      estimatedTimeMin: 15,
      statement: "Given an array `arr` of positive integers sorted in a strictly increasing order, and an integer `k`.\n\nReturn the `k`th positive integer that is missing from this array.",
      functionName: "findKthPositive",
      parameters: [
        { name: "arr", type: "number[]", description: "Strictly increasing positive integers" },
        { name: "k", type: "number", description: "Target missing index" }
      ],
      returnType: "number",
      constraints: ["1 <= arr.length <= 1000", "1 <= arr[i] <= 1000", "1 <= k <= 1000", "arr[i] < arr[j] for 1 <= i < j <= arr.length"],
      examples: [
        { input: "arr = [2,3,4,7,11], k = 5", output: "9", explanation: "Missing numbers are [1, 5, 6, 8, 9, 10, ...]. The 5th is 9." },
        { input: "arr = [1,2,3,4], k = 2", output: "6", explanation: "Missing numbers are [5, 6, 7, ...]. 2nd is 6." }
      ],
      optimalSolution: `function findKthPositive(arr, k) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor(left + (right - left) / 2);\n    const missing = arr[mid] - (mid + 1);\n    if (missing < k) left = mid + 1;\n    else right = mid - 1;\n  }\n  return left + k;\n}`,
      optimalTimeComplexity: "O(log N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function findKthPositive(arr, k) {\n  let cur = 1, idx = 0, miss = 0;\n  while (true) {\n    if (idx < arr.length && arr[idx] === cur) idx++;\n    else {\n      miss++;\n      if (miss === k) return cur;\n    }\n    cur++;\n  }\n}`,
      suboptimalTimeComplexity: "O(N + K)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Linear scanning O(N + K) when binary search yields O(log N)"],
      hints: [
        "At index mid, the number of missing positive integers before arr[mid] is arr[mid] - (mid + 1).",
        "Binary search for the first index where missing >= k.",
        "The answer is left + k."
      ],
      oracleFn: (arr: number[], k: number) => {
        let left = 0, right = arr.length - 1;
        while (left <= right) {
          const mid = Math.floor(left + (right - left) / 2);
          const missing = arr[mid] - (mid + 1);
          if (missing < k) left = mid + 1;
          else right = mid - 1;
        }
        return left + k;
      },
      testCases: {
        functional: [
          [[2, 3, 4, 7, 11], 5],
          [[1, 2, 3, 4], 2],
          [[1], 1]
        ],
        boundary: [
          [[5], 1],
          [[5], 5],
          [[2], 1],
          [[1000], 1000]
        ],
        adversarial: [
          [[1, 3, 5, 7, 9], 4],
          [[2, 4, 6, 8, 10], 5]
        ],
        stress: [
          [Array.from({ length: 1000 }, (_, i) => (i + 1) * 2), 500],
          [Array.from({ length: 1000 }, (_, i) => i + 1), 1000]
        ]
      }
    }),

    // 112. Arranging Coins
    createProblem({
      num: 112,
      title: "Arranging Coins",
      slug: "arranging-coins",
      level: 5,
      difficulty: "EASY",
      topic: "Binary Search",
      patternSlug: "binary-search-basics",
      estimatedTimeMin: 15,
      statement: "You have `n` coins and you want to build a staircase with these coins. The staircase consists of `k` rows where the `i`th row has exactly `i` coins. The last row of the staircase may be incomplete.\n\nGiven the integer `n`, return the number of complete rows of the staircase you will build.",
      functionName: "arrangeCoins",
      parameters: [{ name: "n", type: "number", description: "Total coins available" }],
      returnType: "number",
      constraints: ["1 <= n <= 2^31 - 1"],
      examples: [
        { input: "n = 5", output: "2", explanation: "Row 1 (1), Row 2 (2). Row 3 has 2 coins < 3, so 2 complete rows." },
        { input: "n = 8", output: "3", explanation: "Row 1 (1), Row 2 (2), Row 3 (3). Row 4 incomplete (2 < 4), so 3 complete rows." }
      ],
      optimalSolution: `function arrangeCoins(n) {\n  let left = 1, right = n, ans = 1;\n  while (left <= right) {\n    const mid = Math.floor(left + (right - left) / 2);\n    const coins = (mid * (mid + 1)) / 2;\n    if (coins === n) return mid;\n    if (coins < n) {\n      ans = mid;\n      left = mid + 1;\n    } else {\n      right = mid - 1;\n    }\n  }\n  return ans;\n}`,
      optimalTimeComplexity: "O(log N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function arrangeCoins(n) {\n  let rows = 0, cur = 1;\n  while (n >= cur) {\n    n -= cur;\n    cur++;\n    rows++;\n  }\n  return rows;\n}`,
      suboptimalTimeComplexity: "O(sqrt(N))",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Subtracting coins iteratively leading to TLE on 2^31 - 1"],
      hints: [
        "A staircase of k rows requires k * (k + 1) / 2 coins.",
        "Binary search for the maximum k such that k * (k + 1) / 2 <= n."
      ],
      oracleFn: (n: number) => {
        let left = 1, right = n, ans = 1;
        while (left <= right) {
          const mid = Math.floor(left + (right - left) / 2);
          const coins = (mid * (mid + 1)) / 2;
          if (coins === n) return mid;
          if (coins < n) {
            ans = mid;
            left = mid + 1;
          } else {
            right = mid - 1;
          }
        }
        return ans;
      },
      testCases: {
        functional: [
          [5],
          [8],
          [1]
        ],
        boundary: [
          [2],
          [3],
          [6],
          [10]
        ],
        adversarial: [
          [1804289383],
          [2147483647],
          [100000000]
        ],
        stress: [
          [2147483647],
          [2000000000]
        ]
      }
    }),

    // 113. Heaters
    createProblem({
      num: 113,
      title: "Heaters",
      slug: "heaters",
      level: 5,
      difficulty: "MEDIUM",
      topic: "Binary Search",
      patternSlug: "binary-search-basics",
      estimatedTimeMin: 20,
      statement: "Winter is coming! During the contest, your first job is to design a standard heater with a fixed warm radius to warm all the houses.\n\nEvery house can be warmed, as long as the house is within the heater's warm radius range.\n\nGiven the positions of `houses` and `heaters` on a horizontal line, return the minimum radius standard of heaters so that all houses could be covered by those heaters.",
      functionName: "findRadius",
      parameters: [
        { name: "houses", type: "number[]", description: "House positions" },
        { name: "heaters", type: "number[]", description: "Heater positions" }
      ],
      returnType: "number",
      constraints: ["1 <= houses.length, heaters.length <= 3 * 10^4", "1 <= houses[i], heaters[i] <= 10^9"],
      examples: [
        { input: "houses = [1,2,3], heaters = [2]", output: "1", explanation: "Heater at 2 covers 1 and 3 with radius 1." },
        { input: "houses = [1,2,3,4], heaters = [1,4]", output: "1", explanation: "Radius 1 covers all." },
        { input: "houses = [1,5], heaters = [2]", output: "3", explanation: "Heater at 2 needs radius 3 to reach 5." }
      ],
      optimalSolution: `function findRadius(houses, heaters) {\n  heaters.sort((a, b) => a - b);\n  let maxRad = 0;\n  for (const h of houses) {\n    let left = 0, right = heaters.length - 1;\n    while (left <= right) {\n      const mid = Math.floor(left + (right - left) / 2);\n      if (heaters[mid] < h) left = mid + 1;\n      else right = mid - 1;\n    }\n    const dist1 = left < heaters.length ? Math.abs(heaters[left] - h) : Infinity;\n    const dist2 = right >= 0 ? Math.abs(heaters[right] - h) : Infinity;\n    maxRad = Math.max(maxRad, Math.min(dist1, dist2));\n  }\n  return maxRad;\n}`,
      optimalTimeComplexity: "O(N log M + M log M)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function findRadius(houses, heaters) {\n  let maxRad = 0;\n  for (const h of houses) {\n    let minD = Infinity;\n    for (const ht of heaters) minD = Math.min(minD, Math.abs(h - ht));\n    maxRad = Math.max(maxRad, minD);\n  }\n  return maxRad;\n}`,
      suboptimalTimeComplexity: "O(N * M)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Checking only the closest heater to the right and forgetting the closest heater to the left"],
      hints: [
        "Sort heaters.",
        "For each house, binary search in heaters to find the closest heater to the left and closest heater to the right.",
        "The minimum distance to heat this house is min(distLeft, distRight).",
        "The answer is the maximum over all houses."
      ],
      oracleFn: (houses: number[], heaters: number[]) => {
        heaters.sort((a, b) => a - b);
        let maxRad = 0;
        for (const h of houses) {
          let left = 0, right = heaters.length - 1;
          while (left <= right) {
            const mid = Math.floor(left + (right - left) / 2);
            if (heaters[mid] < h) left = mid + 1;
            else right = mid - 1;
          }
          const dist1 = left < heaters.length ? Math.abs(heaters[left] - h) : Infinity;
          const dist2 = right >= 0 ? Math.abs(heaters[right] - h) : Infinity;
          maxRad = Math.max(maxRad, Math.min(dist1, dist2));
        }
        return maxRad;
      },
      testCases: {
        functional: [
          [[1, 2, 3], [2]],
          [[1, 2, 3, 4], [1, 4]],
          [[1, 5], [2]]
        ],
        boundary: [
          [[1], [1]],
          [[1], [10]],
          [[10], [1]],
          [[1, 1000000000], [500000000]]
        ],
        adversarial: [
          [[1, 2, 3, 5, 15], [2, 30]],
          [[4, 7, 10], [1, 2, 3]]
        ],
        stress: [
          [Array.from({ length: 3000 }, (_, i) => i * 3), Array.from({ length: 1000 }, (_, i) => i * 9)],
          [Array.from({ length: 4000 }, (_, i) => i * 2), [0, 8000]]
        ]
      }
    }),

    // 114. Successful Pairs of Spells and Potions
    createProblem({
      num: 114,
      title: "Successful Pairs of Spells and Potions",
      slug: "successful-pairs-of-spells-and-potions",
      level: 5,
      difficulty: "MEDIUM",
      topic: "Binary Search",
      patternSlug: "binary-search-basics",
      estimatedTimeMin: 20,
      statement: "You are given two positive integer arrays `spells` and `potions`, of length `n` and `m` respectively, where `spells[i]` represents the strength of the `i`th spell and `potions[j]` represents the strength of the `j`th potion.\n\nYou are also given an integer `success`. A spell and potion pair is considered successful if the product of their strengths is at least `success`.\n\nReturn an integer array `pairs` of length `n` where `pairs[i]` is the number of potions that will form a successful pair with the `i`th spell.",
      functionName: "successfulPairs",
      parameters: [
        { name: "spells", type: "number[]", description: "Array of spell strengths" },
        { name: "potions", type: "number[]", description: "Array of potion strengths" },
        { name: "success", type: "number", description: "Target success threshold" }
      ],
      returnType: "number[]",
      constraints: ["n == spells.length", "m == potions.length", "1 <= n, m <= 10^5", "1 <= spells[i], potions[i] <= 10^5", "1 <= success <= 10^10"],
      examples: [
        { input: "spells = [5,1,3], potions = [1,2,3,4,5], success = 7", output: "[4,0,3]", explanation: "Spell 5 needs >= 1.4 -> 4 potions. Spell 1 needs >= 7 -> 0. Spell 3 needs >= 2.33 -> 3 potions." },
        { input: "spells = [3,1,2], potions = [8,5,8], success = 16", output: "[2,0,2]", explanation: "Matching counts." }
      ],
      optimalSolution: `function successfulPairs(spells, potions, success) {\n  potions.sort((a, b) => a - b);\n  const m = potions.length;\n  const res = [];\n  for (const s of spells) {\n    const minPotion = Math.ceil(success / s);\n    let left = 0, right = m - 1;\n    while (left <= right) {\n      const mid = Math.floor(left + (right - left) / 2);\n      if (potions[mid] < minPotion) left = mid + 1;\n      else right = mid - 1;\n    }\n    res.push(m - left);\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(M log M + N log M)",
      optimalSpaceComplexity: "O(1) extra space",
      suboptimalSolution: `function successfulPairs(spells, potions, success) {\n  const res = [];\n  for (const s of spells) {\n    let count = 0;\n    for (const p of potions) if (s * p >= success) count++;\n    res.push(count);\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N * M)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Nested loops O(N * M) causing TLE", "Integer overflow when computing s * p in 32-bit environments"],
      hints: [
        "Sort potions array.",
        "For each spell, calculate minimum required potion strength = Math.ceil(success / spell).",
        "Use binary search (lower bound) in potions to find the first potion meeting the requirement."
      ],
      oracleFn: (spells: number[], potions: number[], success: number) => {
        potions.sort((a, b) => a - b);
        const m = potions.length;
        const res: number[] = [];
        for (const s of spells) {
          const minPotion = Math.ceil(success / s);
          let left = 0, right = m - 1;
          while (left <= right) {
            const mid = Math.floor(left + (right - left) / 2);
            if (potions[mid] < minPotion) left = mid + 1;
            else right = mid - 1;
          }
          res.push(m - left);
        }
        return res;
      },
      testCases: {
        functional: [
          [[5, 1, 3], [1, 2, 3, 4, 5], 7],
          [[3, 1, 2], [8, 5, 8], 16],
          [[10], [1, 2, 3], 25]
        ],
        boundary: [
          [[1], [1], 1],
          [[1], [1], 2],
          [[100000], [100000], 10000000000],
          [[1, 2, 3], [10], 5]
        ],
        adversarial: [
          [[15, 20, 25], [1, 2, 3, 4, 5], 50],
          [[2, 4], [1, 1, 1, 1], 5]
        ],
        stress: [
          [Array.from({ length: 2000 }, () => 10), Array.from({ length: 3000 }, (_, i) => i + 1), 5000],
          [Array.from({ length: 3000 }, (_, i) => (i % 50) + 1), Array.from({ length: 4000 }, (_, i) => i + 1), 10000]
        ]
      }
    }),

    // 115. Special Array With X Elements Greater Than or Equal X
    createProblem({
      num: 115,
      title: "Special Array With X Elements Greater Than or Equal X",
      slug: "special-array-with-x-elements-greater-than-or-equal-x",
      level: 5,
      difficulty: "EASY",
      topic: "Binary Search",
      patternSlug: "binary-search-basics",
      estimatedTimeMin: 15,
      statement: "You are given an array `nums` of non-negative integers. `nums` is considered special if there exists a number `x` such that there are exactly `x` numbers in `nums` that are greater than or equal to `x`.\n\nNotice that `x` does not have to be an element in `nums`.\n\nReturn `x` if the array is special, or `-1` otherwise. It can be proven that if `nums` is special, the value for `x` is unique.",
      functionName: "specialArray",
      parameters: [{ name: "nums", type: "number[]", description: "Array of non-negative integers" }],
      returnType: "number",
      constraints: ["1 <= nums.length <= 100", "0 <= nums[i] <= 1000"],
      examples: [
        { input: "nums = [3,5]", output: "2", explanation: "There are 2 values (3 and 5) that are >= 2." },
        { input: "nums = [0,0]", output: "-1", explanation: "No valid x." },
        { input: "nums = [0,4,3,0,4]", output: "3", explanation: "3 values (4, 3, 4) are >= 3." }
      ],
      optimalSolution: `function specialArray(nums) {\n  nums.sort((a, b) => a - b);\n  const n = nums.length;\n  for (let x = 1; x <= n; x++) {\n    let left = 0, right = n - 1;\n    while (left <= right) {\n      const mid = Math.floor(left + (right - left) / 2);\n      if (nums[mid] >= x) right = mid - 1;\n      else left = mid + 1;\n    }\n    const count = n - left;\n    if (count === x) return x;\n  }\n  return -1;\n}`,
      optimalTimeComplexity: "O(N log N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function specialArray(nums) {\n  for (let x = 0; x <= nums.length; x++) {\n    let count = 0;\n    for (const n of nums) if (n >= x) count++;\n    if (count === x) return x;\n  }\n  return -1;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Assuming x must exist inside nums array (it can be any integer from 1 to N)"],
      hints: [
        "x must be between 1 and nums.length.",
        "Sort nums and check candidate x values using binary search or counting."
      ],
      oracleFn: (nums: number[]) => {
        nums.sort((a, b) => a - b);
        const n = nums.length;
        for (let x = 1; x <= n; x++) {
          let left = 0, right = n - 1;
          while (left <= right) {
            const mid = Math.floor(left + (right - left) / 2);
            if (nums[mid] >= x) right = mid - 1;
            else left = mid + 1;
          }
          const count = n - left;
          if (count === x) return x;
        }
        return -1;
      },
      testCases: {
        functional: [
          [[3, 5]],
          [[0, 0]],
          [[0, 4, 3, 0, 4]]
        ],
        boundary: [
          [[1]],
          [[0]],
          [[1000]],
          [[3, 6, 7, 7, 0]]
        ],
        adversarial: [
          [[1, 2, 3, 4, 5]],
          [[0, 0, 3, 4, 4]]
        ],
        stress: [
          [Array.from({ length: 100 }, () => 100)],
          [Array.from({ length: 100 }, (_, i) => i)]
        ]
      }
    }),

    // 116. Find the Distance Value Between Two Arrays
    createProblem({
      num: 116,
      title: "Find the Distance Value Between Two Arrays",
      slug: "find-the-distance-value-between-two-arrays",
      level: 5,
      difficulty: "EASY",
      topic: "Binary Search",
      patternSlug: "binary-search-basics",
      estimatedTimeMin: 15,
      statement: "Given two integer arrays `arr1` and `arr2`, and the integer `d`, return the distance value between the two arrays.\n\nThe distance value is defined as the number of elements `arr1[i]` such that there is not any element `arr2[j]` where `|arr1[i] - arr2[j]| <= d`.",
      functionName: "findTheDistanceValue",
      parameters: [
        { name: "arr1", type: "number[]", description: "First array" },
        { name: "arr2", type: "number[]", description: "Second array" },
        { name: "d", type: "number", description: "Distance bound" }
      ],
      returnType: "number",
      constraints: ["1 <= arr1.length, arr2.length <= 500", "-1000 <= arr1[i], arr2[j] <= 1000", "0 <= d <= 100"],
      examples: [
        { input: "arr1 = [4,5,8], arr2 = [10,9,1,8], d = 2", output: "2", explanation: "4 and 5 have no element in arr2 with abs diff <= 2." },
        { input: "arr1 = [1,4,2,3], arr2 = [-4,-3,6,10,20,30], d = 3", output: "2", explanation: "2 elements qualify." }
      ],
      optimalSolution: `function findTheDistanceValue(arr1, arr2, d) {\n  arr2.sort((a, b) => a - b);\n  let count = 0;\n  for (const val of arr1) {\n    let left = 0, right = arr2.length - 1, found = false;\n    while (left <= right) {\n      const mid = Math.floor(left + (right - left) / 2);\n      if (Math.abs(arr2[mid] - val) <= d) { found = true; break; }\n      if (arr2[mid] < val) left = mid + 1;\n      else right = mid - 1;\n    }\n    if (!found) count++;\n  }\n  return count;\n}`,
      optimalTimeComplexity: "O(N log M + M log M)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function findTheDistanceValue(arr1, arr2, d) {\n  let count = 0;\n  for (const a of arr1) {\n    if (arr2.every(b => Math.abs(a - b) > d)) count++;\n  }\n  return count;\n}`,
      suboptimalTimeComplexity: "O(N * M)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Failing to break early when |arr2[mid] - val| <= d is satisfied"],
      hints: [
        "Sort arr2.",
        "For each element in arr1, binary search in arr2 for any element in [val - d, val + d].",
        "If none exists, increment result count."
      ],
      oracleFn: (arr1: number[], arr2: number[], d: number) => {
        arr2.sort((a, b) => a - b);
        let count = 0;
        for (const val of arr1) {
          let left = 0, right = arr2.length - 1, found = false;
          while (left <= right) {
            const mid = Math.floor(left + (right - left) / 2);
            if (Math.abs(arr2[mid] - val) <= d) { found = true; break; }
            if (arr2[mid] < val) left = mid + 1;
            else right = mid - 1;
          }
          if (!found) count++;
        }
        return count;
      },
      testCases: {
        functional: [
          [[4, 5, 8], [10, 9, 1, 8], 2],
          [[1, 4, 2, 3], [-4, -3, 6, 10, 20, 30], 3],
          [[2, 1, 100, 3], [-5, -2, 10, -3, 7], 6]
        ],
        boundary: [
          [[1], [1], 0],
          [[1], [2], 0],
          [[1], [2], 1],
          [[-1000], [1000], 100]
        ],
        adversarial: [
          [[10, 20, 30], [15, 25, 35], 4],
          [[10, 20, 30], [15, 25, 35], 5]
        ],
        stress: [
          [Array.from({ length: 500 }, (_, i) => i * 3), Array.from({ length: 500 }, (_, i) => i * 4), 2],
          [Array.from({ length: 500 }, () => 10), Array.from({ length: 500 }, () => 20), 5]
        ]
      }
    }),

    // 117. Capacity To Ship Packages Within D Days
    createProblem({
      num: 117,
      title: "Capacity To Ship Packages Within D Days",
      slug: "capacity-to-ship-packages-within-d-days",
      level: 5,
      difficulty: "MEDIUM",
      topic: "Binary Search on Answer",
      patternSlug: "binary-search-basics",
      estimatedTimeMin: 20,
      statement: "A conveyor belt has packages that must be shipped from one port to another within `days` days.\n\nThe `i`th package on the conveyor belt has a weight of `weights[i]`. Each day, we load the ship with packages on the conveyor belt (in the order given by `weights`). We may not load more weight than the maximum weight capacity of the ship.\n\nReturn the least weight capacity of the ship that will result in all the packages on the conveyor belt being shipped within `days` days.",
      functionName: "shipWithinDays",
      parameters: [
        { name: "weights", type: "number[]", description: "Array of package weights" },
        { name: "days", type: "number", description: "Allowed days" }
      ],
      returnType: "number",
      constraints: ["1 <= days <= weights.length <= 5 * 10^4", "1 <= weights[i] <= 500"],
      examples: [
        { input: "weights = [1,2,3,4,5,6,7,8,9,10], days = 5", output: "15", explanation: "Capacity 15 ships in 5 days: [1..5], [6,7], [8], [9], [10]." },
        { input: "weights = [3,2,2,4,1,4], days = 3", output: "6", explanation: "Capacity 6 ships in 3 days: [3,2], [2,4], [1,4]." },
        { input: "weights = [1,2,3,1,1], days = 4", output: "3", explanation: "Capacity 3." }
      ],
      optimalSolution: `function shipWithinDays(weights, days) {\n  let left = Math.max(...weights);\n  let right = weights.reduce((a, b) => a + b, 0);\n  function canShip(cap) {\n    let neededDays = 1, cur = 0;\n    for (const w of weights) {\n      if (cur + w > cap) {\n        neededDays++;\n        cur = 0;\n      }\n      cur += w;\n    }\n    return neededDays <= days;\n  }\n  while (left < right) {\n    const mid = Math.floor(left + (right - left) / 2);\n    if (canShip(mid)) right = mid;\n    else left = mid + 1;\n  }\n  return left;\n}`,
      optimalTimeComplexity: "O(N log(Sum - Max))",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function shipWithinDays(weights, days) {\n  let cap = Math.max(...weights);\n  while (true) {\n    let d = 1, cur = 0;\n    for (const w of weights) {\n      if (cur + w > cap) { d++; cur = 0; }\n      cur += w;\n    }\n    if (d <= days) return cap;\n    cap++;\n  }\n}`,
      suboptimalTimeComplexity: "O(N * (Sum - Max))",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Setting lower search bound to 1 instead of Math.max(...weights) (the ship must carry at least the heaviest single item)"],
      hints: [
        "Search on the answer: capacity must be in [max(weights), sum(weights)].",
        "Check if capacity C is feasible in O(N).",
        "If feasible, try smaller capacity: right = mid. Otherwise left = mid + 1."
      ],
      oracleFn: (weights: number[], days: number) => {
        let left = Math.max(...weights);
        let right = weights.reduce((a, b) => a + b, 0);
        function canShip(cap: number) {
          let neededDays = 1, cur = 0;
          for (const w of weights) {
            if (cur + w > cap) {
              neededDays++;
              cur = 0;
            }
            cur += w;
          }
          return neededDays <= days;
        }
        while (left < right) {
          const mid = Math.floor(left + (right - left) / 2);
          if (canShip(mid)) right = mid;
          else left = mid + 1;
        }
        return left;
      },
      testCases: {
        functional: [
          [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5],
          [[3, 2, 2, 4, 1, 4], 3],
          [[1, 2, 3, 1, 1], 4]
        ],
        boundary: [
          [[10], 1],
          [[1, 1, 1, 1], 4],
          [[1, 1, 1, 1], 1],
          [[500, 500], 2]
        ],
        adversarial: [
          [[10, 50, 100, 100, 50, 100, 100, 100], 5],
          [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1]
        ],
        stress: [
          [Array.from({ length: 3000 }, () => 10), 150],
          [Array.from({ length: 4000 }, (_, i) => (i % 20) + 1), 500]
        ]
      }
    }),

    // 118. Koko Eating Bananas
    createProblem({
      num: 118,
      title: "Koko Eating Bananas",
      slug: "koko-eating-bananas",
      level: 5,
      difficulty: "MEDIUM",
      topic: "Binary Search on Answer",
      patternSlug: "binary-search-basics",
      estimatedTimeMin: 20,
      statement: "Koko loves to eat bananas. There are `n` piles of bananas, the `i`th pile has `piles[i]` bananas. The guards have gone and will come back in `h` hours.\n\nKoko can decide her bananas-per-hour eating speed of `k`. Each hour, she chooses some pile of bananas and eats `k` bananas from that pile. If the pile has less than `k` bananas, she eats all of them instead and will not eat any more bananas during this hour.\n\nKoko likes to eat slowly but still wants to finish eating all the bananas before the guards return.\n\nReturn the minimum integer `k` such that she can eat all the bananas within `h` hours.",
      functionName: "minEatingSpeed",
      parameters: [
        { name: "piles", type: "number[]", description: "Array of pile sizes" },
        { name: "h", type: "number", description: "Total hours available" }
      ],
      returnType: "number",
      constraints: ["1 <= piles.length <= 10^4", "piles.length <= h <= 10^9", "1 <= piles[i] <= 10^9"],
      examples: [
        { input: "piles = [3,6,7,11], h = 8", output: "4", explanation: "At speed 4, Koko finishes in 1 + 2 + 2 + 3 = 8 hours." },
        { input: "piles = [30,11,23,4,20], h = 5", output: "30", explanation: "At speed 30, Koko finishes in 5 hours." },
        { input: "piles = [30,11,23,4,20], h = 6", output: "23", explanation: "At speed 23, Koko finishes in 6 hours." }
      ],
      optimalSolution: `function minEatingSpeed(piles, h) {\n  let left = 1, right = Math.max(...piles);\n  function hoursNeeded(speed) {\n    let hours = 0;\n    for (const p of piles) hours += Math.ceil(p / speed);\n    return hours;\n  }\n  while (left < right) {\n    const mid = Math.floor(left + (right - left) / 2);\n    if (hoursNeeded(mid) <= h) right = mid;\n    else left = mid + 1;\n  }\n  return left;\n}`,
      optimalTimeComplexity: "O(N log(MaxPile))",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function minEatingSpeed(piles, h) {\n  let speed = 1;\n  while (true) {\n    let hours = 0;\n    for (const p of piles) hours += Math.ceil(p / speed);\n    if (hours <= h) return speed;\n    speed++;\n  }\n}`,
      suboptimalTimeComplexity: "O(N * MaxPile)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Math.ceil precision issues with large floats in JavaScript (p / speed)"],
      hints: [
        "Binary search on speed k in range [1, max(piles)].",
        "Hours needed for pile p at speed k is Math.ceil(p / k) = Math.floor((p + k - 1) / k).",
        "If total hours <= h, k is feasible; try smaller: right = mid."
      ],
      oracleFn: (piles: number[], h: number) => {
        let left = 1, right = Math.max(...piles);
        function hoursNeeded(speed: number) {
          let hours = 0;
          for (const p of piles) hours += Math.ceil(p / speed);
          return hours;
        }
        while (left < right) {
          const mid = Math.floor(left + (right - left) / 2);
          if (hoursNeeded(mid) <= h) right = mid;
          else left = mid + 1;
        }
        return left;
      },
      testCases: {
        functional: [
          [[3, 6, 7, 11], 8],
          [[30, 11, 23, 4, 20], 5],
          [[30, 11, 23, 4, 20], 6]
        ],
        boundary: [
          [[312884470], 312884469],
          [[312884470], 968709470],
          [[1, 1, 1, 1], 4],
          [[1000000000], 2]
        ],
        adversarial: [
          [[3, 6, 7, 11], 1000],
          [[1000000000, 1000000000], 3]
        ],
        stress: [
          [Array.from({ length: 3000 }, () => 10000), 5000],
          [Array.from({ length: 4000 }, (_, i) => i + 1), 6000]
        ]
      }
    })
  ];

  return {
    level: 5,
    levelTitle: "Level 5 — Binary Search Basics",
    topic: "Binary Search & Search on Answer",
    problems
  };
}
