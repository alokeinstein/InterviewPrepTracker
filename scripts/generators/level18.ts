import { LevelPayload, GeneratedProblem } from './types';
import { createProblem } from './problemBuilder';

export function getLevel18Payload(): LevelPayload {
  const problems: GeneratedProblem[] = [
    // 376. Unique Paths
    createProblem({
      num: 376,
      title: "Unique Paths",
      slug: "unique-paths",
      level: 18,
      difficulty: "MEDIUM",
      topic: "2D Dynamic Programming",
      patternSlug: "dp-2d-strings",
      estimatedTimeMin: 15,
      statement: "There is a robot on an `m x n` grid. The robot is initially located at the top-left corner (i.e., `grid[0][0]`). The robot tries to move to the bottom-right corner (i.e., `grid[m - 1][n - 1]`). The robot can only move either down or right at any point in time.\n\nGiven the two integers `m` and `n`, return the number of possible unique paths that the robot can take to reach the bottom-right corner.",
      functionName: "uniquePaths",
      parameters: [
        { name: "m", type: "number", description: "Number of rows in the grid" },
        { name: "n", type: "number", description: "Number of columns in the grid" }
      ],
      returnType: "number",
      constraints: ["1 <= m, n <= 100"],
      examples: [
        { input: "m = 3, n = 7", output: "28", explanation: "From (0,0) to (2,6) requires 2 down and 6 right moves, C(8, 2) = 28." },
        { input: "m = 3, n = 2", output: "3", explanation: "Paths: Right->Down->Down, Down->Down->Right, Down->Right->Down." },
        { input: "m = 1, n = 1", output: "1", explanation: "Already at the destination." },
        { input: "m = 3, n = 3", output: "6", explanation: "6 distinct paths in a 3x3 grid." }
      ],
      optimalSolution: `function uniquePaths(m, n) {\n  const dp = new Array(n).fill(1);\n  for (let i = 1; i < m; i++) {\n    for (let j = 1; j < n; j++) {\n      dp[j] += dp[j - 1];\n    }\n  }\n  return dp[n - 1];\n}`,
      optimalTimeComplexity: "O(m * n)",
      optimalSpaceComplexity: "O(n)",
      suboptimalSolution: `function uniquePaths(m, n) {\n  const dp = Array.from({ length: m }, () => new Array(n).fill(1));\n  for (let i = 1; i < m; i++) {\n    for (let j = 1; j < n; j++) {\n      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];\n    }\n  }\n  return dp[m - 1][n - 1];\n}`,
      suboptimalTimeComplexity: "O(m * n)",
      suboptimalSpaceComplexity: "O(m * n)",
      commonMistakes: ["Using full m x n grid allocation when 1D array of size n suffices.", "Combinatorial formula overflow for large m and n."],
      hints: [
        "Each cell (i, j) can only be reached from (i - 1, j) and (i, j - 1).",
        "dp[j] = dp[j] + dp[j - 1] compresses space to a single row."
      ],
      oracleFn: (m: number, n: number) => {
        const dp = new Array(n).fill(1);
        for (let i = 1; i < m; i++) {
          for (let j = 1; j < n; j++) {
            dp[j] += dp[j - 1];
          }
        }
        return dp[n - 1];
      },
      testCases: {
        functional: [
          [3, 7],
          [3, 2],
          [1, 1],
          [3, 3]
        ],
        boundary: [
          [1, 10],
          [10, 1],
          [2, 2]
        ],
        adversarial: [
          [7, 3],
          [5, 5],
          [4, 8]
        ],
        stress: [
          [20, 20],
          [15, 30],
          [35, 10]
        ]
      }
    }),

    // 377. Unique Paths II
    createProblem({
      num: 377,
      title: "Unique Paths II",
      slug: "unique-paths-ii",
      level: 18,
      difficulty: "MEDIUM",
      topic: "2D Dynamic Programming",
      patternSlug: "dp-2d-strings",
      estimatedTimeMin: 20,
      statement: "You are given an `m x n` integer array `obstacleGrid`. There is a robot initially located at the top-left corner (i.e., `obstacleGrid[0][0]`). The robot tries to move to the bottom-right corner (i.e., `obstacleGrid[m - 1][n - 1]`). The robot can only move either down or right at any point in time.\n\nAn obstacle and space are marked as `1` or `0` respectively in `obstacleGrid`. A path that the robot takes cannot include any square that is an obstacle.\n\nReturn the number of possible unique paths that the robot can take to reach the bottom-right corner.",
      functionName: "uniquePathsWithObstacles",
      parameters: [{ name: "obstacleGrid", type: "number[][]", description: "m x n grid with 0 (empty) and 1 (obstacle)" }],
      returnType: "number",
      constraints: ["m == obstacleGrid.length", "n == obstacleGrid[i].length", "1 <= m, n <= 100", "obstacleGrid[i][j] is 0 or 1"],
      examples: [
        { input: "obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]", output: "2", explanation: "There is one obstacle in the middle of the 3x3 grid, resulting in 2 paths." },
        { input: "obstacleGrid = [[0,1],[0,0]]", output: "1", explanation: "Only 1 path: Down -> Right." },
        { input: "obstacleGrid = [[1]]", output: "0", explanation: "Start itself is blocked, 0 paths." },
        { input: "obstacleGrid = [[0,0],[0,1]]", output: "0", explanation: "Destination is blocked, 0 paths." }
      ],
      optimalSolution: `function uniquePathsWithObstacles(obstacleGrid) {\n  const m = obstacleGrid.length, n = obstacleGrid[0].length;\n  if (obstacleGrid[0][0] === 1 || obstacleGrid[m - 1][n - 1] === 1) return 0;\n  const dp = new Array(n).fill(0);\n  dp[0] = 1;\n  for (let i = 0; i < m; i++) {\n    for (let j = 0; j < n; j++) {\n      if (obstacleGrid[i][j] === 1) {\n        dp[j] = 0;\n      } else if (j > 0) {\n        dp[j] += dp[j - 1];\n      }\n    }\n  }\n  return dp[n - 1];\n}`,
      optimalTimeComplexity: "O(m * n)",
      optimalSpaceComplexity: "O(n)",
      suboptimalSolution: `function uniquePathsWithObstacles(obstacleGrid) {\n  const m = obstacleGrid.length, n = obstacleGrid[0].length;\n  if (obstacleGrid[0][0] === 1) return 0;\n  const dp = Array.from({ length: m }, () => new Array(n).fill(0));\n  dp[0][0] = 1;\n  for (let j = 1; j < n; j++) dp[0][j] = obstacleGrid[0][j] === 1 ? 0 : dp[0][j - 1];\n  for (let i = 1; i < m; i++) dp[i][0] = obstacleGrid[i][0] === 1 ? 0 : dp[i - 1][0];\n  for (let i = 1; i < m; i++) {\n    for (let j = 1; j < n; j++) {\n      if (obstacleGrid[i][j] === 0) dp[i][j] = dp[i - 1][j] + dp[i][j - 1];\n    }\n  }\n  return dp[m - 1][n - 1];\n}`,
      suboptimalTimeComplexity: "O(m * n)",
      suboptimalSpaceComplexity: "O(m * n)",
      commonMistakes: ["Forgetting to check if obstacleGrid[0][0] or destination is 1.", "Leaving stale values in 1D DP when encountering an obstacle."],
      hints: [
        "If a cell has an obstacle, dp[j] must be reset to 0.",
        "Otherwise, dp[j] = dp[j] + dp[j - 1]."
      ],
      oracleFn: (obstacleGrid: number[][]) => {
        const m = obstacleGrid.length, n = obstacleGrid[0].length;
        if (obstacleGrid[0][0] === 1 || obstacleGrid[m - 1][n - 1] === 1) return 0;
        const dp = new Array(n).fill(0);
        dp[0] = 1;
        for (let i = 0; i < m; i++) {
          for (let j = 0; j < n; j++) {
            if (obstacleGrid[i][j] === 1) {
              dp[j] = 0;
            } else if (j > 0) {
              dp[j] += dp[j - 1];
            }
          }
        }
        return dp[n - 1];
      },
      testCases: {
        functional: [
          [[[0, 0, 0], [0, 1, 0], [0, 0, 0]]],
          [[[0, 1], [0, 0]]],
          [[[1]]],
          [[[0, 0], [0, 1]]]
        ],
        boundary: [
          [[[0]]],
          [[[0, 0, 0]]],
          [[[0], [0], [0]]]
        ],
        adversarial: [
          [[[0, 0, 0], [1, 1, 0], [0, 0, 0]]],
          [[[0, 1, 0, 0], [0, 0, 0, 1], [1, 0, 0, 0]]],
          [[[0, 0], [1, 0]]]
        ],
        stress: [
          [Array.from({ length: 30 }, (_, r) => Array.from({ length: 30 }, (_, c) => (r === 15 && c === 15 ? 1 : 0)))],
          [Array.from({ length: 40 }, () => Array.from({ length: 40 }, () => 0))]
        ]
      }
    }),

    // 378. Minimum Path Sum
    createProblem({
      num: 378,
      title: "Minimum Path Sum",
      slug: "minimum-path-sum",
      level: 18,
      difficulty: "MEDIUM",
      topic: "2D Dynamic Programming",
      patternSlug: "dp-2d-strings",
      estimatedTimeMin: 20,
      statement: "Given an `m x n` `grid` filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path.\n\nNote: You can only move either down or right at any point in time.",
      functionName: "minPathSum",
      parameters: [{ name: "grid", type: "number[][]", description: "m x n grid of non-negative integers" }],
      returnType: "number",
      constraints: ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 200", "0 <= grid[i][j] <= 200"],
      examples: [
        { input: "grid = [[1,3,1],[1,5,1],[4,2,1]]", output: "7", explanation: "Path 1 -> 3 -> 1 -> 1 -> 1 minimizes sum = 7." },
        { input: "grid = [[1,2,3],[4,5,6]]", output: "12", explanation: "Path 1 -> 2 -> 3 -> 6 = 12." },
        { input: "grid = [[5]]", output: "5", explanation: "Only one cell = 5." },
        { input: "grid = [[1,2],[1,1]]", output: "3", explanation: "Path 1 -> 1 -> 1 = 3." }
      ],
      optimalSolution: `function minPathSum(grid) {\n  const m = grid.length, n = grid[0].length;\n  const dp = new Array(n).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 0; i < m; i++) {\n    dp[0] += grid[i][0];\n    for (let j = 1; j < n; j++) {\n      dp[j] = Math.min(dp[j], dp[j - 1]) + grid[i][j];\n    }\n  }\n  return dp[n - 1];\n}`,
      optimalTimeComplexity: "O(m * n)",
      optimalSpaceComplexity: "O(n)",
      suboptimalSolution: `function minPathSum(grid) {\n  const m = grid.length, n = grid[0].length;\n  const dp = Array.from({ length: m }, () => new Array(n).fill(0));\n  dp[0][0] = grid[0][0];\n  for (let j = 1; j < n; j++) dp[0][j] = dp[0][j - 1] + grid[0][j];\n  for (let i = 1; i < m; i++) dp[i][0] = dp[i - 1][0] + grid[i][0];\n  for (let i = 1; i < m; i++) {\n    for (let j = 1; j < n; j++) {\n      dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];\n    }\n  }\n  return dp[m - 1][n - 1];\n}`,
      suboptimalTimeComplexity: "O(m * n)",
      suboptimalSpaceComplexity: "O(m * n)",
      commonMistakes: ["Failing to initialize the first row and column properly with cumulative sums."],
      hints: [
        "dp[j] = min(dp[j], dp[j - 1]) + grid[i][j] for in-place 1D row transition."
      ],
      oracleFn: (grid: number[][]) => {
        const m = grid.length, n = grid[0].length;
        const dp = new Array(n).fill(Infinity);
        dp[0] = 0;
        for (let i = 0; i < m; i++) {
          dp[0] += grid[i][0];
          for (let j = 1; j < n; j++) {
            dp[j] = Math.min(dp[j], dp[j - 1]) + grid[i][j];
          }
        }
        return dp[n - 1];
      },
      testCases: {
        functional: [
          [[[1, 3, 1], [1, 5, 1], [4, 2, 1]]],
          [[[1, 2, 3], [4, 5, 6]]],
          [[[5]]],
          [[[1, 2], [1, 1]]]
        ],
        boundary: [
          [[[0, 0], [0, 0]]],
          [[[10]]],
          [[[1, 2, 3, 4]]]
        ],
        adversarial: [
          [[[9, 1, 4, 8], [9, 9, 1, 2], [1, 1, 1, 1]]],
          [[[1, 100, 100], [1, 1, 100], [100, 1, 1]]],
          [[[5, 4, 3], [2, 1, 0]]]
        ],
        stress: [
          [Array.from({ length: 40 }, (_, r) => Array.from({ length: 40 }, (_, c) => (r * 2 + c) % 10))],
          [Array.from({ length: 50 }, () => Array.from({ length: 50 }, () => 1))]
        ]
      }
    }),

    // 379. Minimum Falling Path Sum
    createProblem({
      num: 379,
      title: "Minimum Falling Path Sum",
      slug: "minimum-falling-path-sum",
      level: 18,
      difficulty: "MEDIUM",
      topic: "2D Dynamic Programming",
      patternSlug: "dp-2d-strings",
      estimatedTimeMin: 20,
      statement: "Given an `n x n` array of integers `matrix`, return the minimum sum of any falling path through `matrix`.\n\nA falling path starts at any element in the first row and chooses the element in the next row that is either directly below or diagonally left/right. Specifically, the next element from position `(row, col)` will be `(row + 1, col - 1)`, `(row + 1, col)`, or `(row + 1, col + 1)`.",
      functionName: "minFallingPathSum",
      parameters: [{ name: "matrix", type: "number[][]", description: "n x n square matrix" }],
      returnType: "number",
      constraints: ["n == matrix.length == matrix[i].length", "1 <= n <= 100", "-100 <= matrix[i][j] <= 100"],
      examples: [
        { input: "matrix = [[2,1,3],[6,5,4],[7,8,9]]", output: "13", explanation: "Falling paths: 1->5->7 = 13 or 1->4->8 = 13." },
        { input: "matrix = [[-19,57],[-40,-5]]", output: "-59", explanation: "Falling path: -19 -> -40 = -59." },
        { input: "matrix = [[7]]", output: "7", explanation: "Single element." },
        { input: "matrix = [[-48]]", output: "-48", explanation: "Single negative element." }
      ],
      optimalSolution: `function minFallingPathSum(matrix) {\n  const n = matrix.length;\n  let prev = [...matrix[0]];\n  for (let r = 1; r < n; r++) {\n    const curr = new Array(n);\n    for (let c = 0; c < n; c++) {\n      const left = c > 0 ? prev[c - 1] : Infinity;\n      const mid = prev[c];\n      const right = c < n - 1 ? prev[c + 1] : Infinity;\n      curr[c] = matrix[r][c] + Math.min(left, mid, right);\n    }\n    prev = curr;\n  }\n  return Math.min(...prev);\n}`,
      optimalTimeComplexity: "O(n^2)",
      optimalSpaceComplexity: "O(n)",
      suboptimalSolution: `function minFallingPathSum(matrix) {\n  const n = matrix.length;\n  const dp = Array.from({ length: n }, () => new Array(n).fill(0));\n  for (let c = 0; c < n; c++) dp[0][c] = matrix[0][c];\n  for (let r = 1; r < n; r++) {\n    for (let c = 0; c < n; c++) {\n      let minAbove = dp[r - 1][c];\n      if (c > 0) minAbove = Math.min(minAbove, dp[r - 1][c - 1]);\n      if (c < n - 1) minAbove = Math.min(minAbove, dp[r - 1][c + 1]);\n      dp[r][c] = matrix[r][c] + minAbove;\n    }\n  }\n  return Math.min(...dp[n - 1]);\n}`,
      suboptimalTimeComplexity: "O(n^2)",
      suboptimalSpaceComplexity: "O(n^2)",
      commonMistakes: ["Boundary out-of-bounds on col - 1 and col + 1."],
      hints: [
        "From (r, c), you could have arrived from (r-1, c-1), (r-1, c), or (r-1, c+1).",
        "Maintain the previous row dp array for O(N) space."
      ],
      oracleFn: (matrix: number[][]) => {
        const n = matrix.length;
        let prev = [...matrix[0]];
        for (let r = 1; r < n; r++) {
          const curr = new Array(n);
          for (let c = 0; c < n; c++) {
            const left = c > 0 ? prev[c - 1] : Infinity;
            const mid = prev[c];
            const right = c < n - 1 ? prev[c + 1] : Infinity;
            curr[c] = matrix[r][c] + Math.min(left, mid, right);
          }
          prev = curr;
        }
        return Math.min(...prev);
      },
      testCases: {
        functional: [
          [[[2, 1, 3], [6, 5, 4], [7, 8, 9]]],
          [[[-19, 57], [-40, -5]]],
          [[[7]]],
          [[[-48]]]
        ],
        boundary: [
          [[[1, 2], [3, 4]]],
          [[[0, 0, 0], [0, 0, 0], [0, 0, 0]]],
          [[[-10, -20], [-30, -40]]]
        ],
        adversarial: [
          [[[10, -2, 5], [4, 15, -1], [8, 3, 2]]],
          [[[100, 100, 1], [100, 1, 100], [1, 100, 100]]],
          [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]]
        ],
        stress: [
          [Array.from({ length: 40 }, (_, r) => Array.from({ length: 40 }, (_, c) => (r * 7 + c) % 50 - 25))],
          [Array.from({ length: 50 }, () => Array.from({ length: 50 }, () => -1))]
        ]
      }
    }),

    // 380. Longest Common Subsequence
    createProblem({
      num: 380,
      title: "Longest Common Subsequence",
      slug: "longest-common-subsequence",
      level: 18,
      difficulty: "MEDIUM",
      topic: "2D Dynamic Programming",
      patternSlug: "dp-2d-strings",
      estimatedTimeMin: 25,
      statement: "Given two strings `text1` and `text2`, return the length of their longest common subsequence. If there is no common subsequence, return `0`.\n\nA subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.\n\nA common subsequence of two strings is a subsequence that is common to both strings.",
      functionName: "longestCommonSubsequence",
      parameters: [
        { name: "text1", type: "string", description: "First string" },
        { name: "text2", type: "string", description: "Second string" }
      ],
      returnType: "number",
      constraints: ["1 <= text1.length, text2.length <= 1000", "text1 and text2 consist of only lowercase English characters."],
      examples: [
        { input: "text1 = \"abcde\", text2 = \"ace\"", output: "3", explanation: "The longest common subsequence is \"ace\" with length 3." },
        { input: "text1 = \"abc\", text2 = \"abc\"", output: "3", explanation: "Identical strings, LCS is \"abc\"." },
        { input: "text1 = \"abc\", text2 = \"def\"", output: "0", explanation: "No common characters, LCS is 0." },
        { input: "text1 = \"ezupkr\", text2 = \"ubmrapg\"", output: "2", explanation: "LCS is \"up\", length 2." }
      ],
      optimalSolution: `function longestCommonSubsequence(text1, text2) {\n  if (text1.length < text2.length) [text1, text2] = [text2, text1];\n  let prev = new Array(text2.length + 1).fill(0);\n  let curr = new Array(text2.length + 1).fill(0);\n  for (let i = 1; i <= text1.length; i++) {\n    for (let j = 1; j <= text2.length; j++) {\n      if (text1[i - 1] === text2[j - 1]) {\n        curr[j] = prev[j - 1] + 1;\n      } else {\n        curr[j] = Math.max(prev[j], curr[j - 1]);\n      }\n    }\n    [prev, curr] = [curr, prev];\n  }\n  return prev[text2.length];\n}`,
      optimalTimeComplexity: "O(M * N)",
      optimalSpaceComplexity: "O(min(M, N))",
      suboptimalSolution: `function longestCommonSubsequence(text1, text2) {\n  const m = text1.length, n = text2.length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (text1[i - 1] === text2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;\n      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n    }\n  }\n  return dp[m][n];\n}`,
      suboptimalTimeComplexity: "O(M * N)",
      suboptimalSpaceComplexity: "O(M * N)",
      commonMistakes: ["Confusing subsequence (order preserved, gap allowed) with substring (contiguous).", "Off-by-one indexing with 1-based DP table."],
      hints: [
        "If text1[i-1] == text2[j-1], dp[i][j] = 1 + dp[i-1][j-1].",
        "Otherwise, dp[i][j] = max(dp[i-1][j], dp[i][j-1])."
      ],
      oracleFn: (text1: string, text2: string) => {
        let prev = new Array(text2.length + 1).fill(0);
        let curr = new Array(text2.length + 1).fill(0);
        for (let i = 1; i <= text1.length; i++) {
          for (let j = 1; j <= text2.length; j++) {
            if (text1[i - 1] === text2[j - 1]) {
              curr[j] = prev[j - 1] + 1;
            } else {
              curr[j] = Math.max(prev[j], curr[j - 1]);
            }
          }
          [prev, curr] = [curr, prev];
        }
        return prev[text2.length];
      },
      testCases: {
        functional: [
          ["abcde", "ace"],
          ["abc", "abc"],
          ["abc", "def"],
          ["ezupkr", "ubmrapg"]
        ],
        boundary: [
          ["a", "a"],
          ["a", "b"],
          ["ab", "ba"]
        ],
        adversarial: [
          ["oxcpqrsvwf", "shmtulqrypy"],
          ["bsbininm", "jmjkbkjkv"],
          ["pmjghexybyrgzczy", "hafcdqbgncrcbihkd"]
        ],
        stress: [
          ["abcdefghijklmnopqrstuvwxyz".repeat(4), "zyxwvutsrqponmlkjihgfedcba".repeat(4)],
          ["a".repeat(100), "a".repeat(100)]
        ]
      }
    }),

    // 381. Longest Palindromic Subsequence
    createProblem({
      num: 381,
      title: "Longest Palindromic Subsequence",
      slug: "longest-palindromic-subsequence",
      level: 18,
      difficulty: "MEDIUM",
      topic: "2D Dynamic Programming",
      patternSlug: "dp-2d-strings",
      estimatedTimeMin: 20,
      statement: "Given a string `s`, find the longest palindromic subsequence's length in `s`.\n\nA subsequence is a sequence that can be derived from another sequence by deleting some or no elements without changing the order of the remaining elements.",
      functionName: "longestPalindromeSubseq",
      parameters: [{ name: "s", type: "string", description: "Input string" }],
      returnType: "number",
      constraints: ["1 <= s.length <= 1000", "s consists only of lowercase English letters."],
      examples: [
        { input: "s = \"bbbab\"", output: "4", explanation: "One possible longest palindromic subsequence is \"bbbb\"." },
        { input: "s = \"cbbd\"", output: "2", explanation: "One possible longest palindromic subsequence is \"bb\"." },
        { input: "s = \"a\"", output: "1", explanation: "Single character is a palindrome of length 1." },
        { input: "s = \"abcdef\"", output: "1", explanation: "No repeated characters, length 1." }
      ],
      optimalSolution: `function longestPalindromeSubseq(s) {\n  const n = s.length;\n  let dp = new Array(n).fill(1);\n  for (let i = n - 2; i >= 0; i--) {\n    let prevDiagonal = 0;\n    for (let j = i + 1; j < n; j++) {\n      const temp = dp[j];\n      if (s[i] === s[j]) {\n        dp[j] = prevDiagonal + 2;\n      } else {\n        dp[j] = Math.max(dp[j], dp[j - 1]);\n      }\n      prevDiagonal = temp;\n    }\n  }\n  return dp[n - 1];\n}`,
      optimalTimeComplexity: "O(N^2)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function longestPalindromeSubseq(s) {\n  const rev = s.split('').reverse().join('');\n  const n = s.length;\n  const dp = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));\n  for (let i = 1; i <= n; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (s[i - 1] === rev[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;\n      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n    }\n  }\n  return dp[n][n];\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N^2)",
      commonMistakes: ["Thinking this is identical to longest palindromic substring (subsequence allows deleting non-adjacent characters)."],
      hints: [
        "LPS is simply LCS(s, reverse(s)).",
        "Or interval DP: if s[i] == s[j], dp[i][j] = 2 + dp[i+1][j-1]; else dp[i][j] = max(dp[i+1][j], dp[i][j-1])."
      ],
      oracleFn: (s: string) => {
        const n = s.length;
        let dp = new Array(n).fill(1);
        for (let i = n - 2; i >= 0; i--) {
          let prevDiagonal = 0;
          for (let j = i + 1; j < n; j++) {
            const temp = dp[j];
            if (s[i] === s[j]) {
              dp[j] = prevDiagonal + 2;
            } else {
              dp[j] = Math.max(dp[j], dp[j - 1]);
            }
            prevDiagonal = temp;
          }
        }
        return dp[n - 1];
      },
      testCases: {
        functional: [
          ["bbbab"],
          ["cbbd"],
          ["a"],
          ["abcdef"]
        ],
        boundary: [
          ["aa"],
          ["ab"],
          ["aaa"]
        ],
        adversarial: [
          ["character"],
          ["turboventilator"],
          ["racecar"]
        ],
        stress: [
          ["a".repeat(80)],
          ["abacdfgdcaba".repeat(6)]
        ]
      }
    }),

    // 382. Edit Distance
    createProblem({
      num: 382,
      title: "Edit Distance",
      slug: "edit-distance",
      level: 18,
      difficulty: "MEDIUM",
      topic: "2D Dynamic Programming",
      patternSlug: "dp-2d-strings",
      estimatedTimeMin: 25,
      statement: "Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`.\n\nYou have the following three operations permitted on a word:\n- Insert a character\n- Delete a character\n- Replace a character",
      functionName: "minDistance",
      parameters: [
        { name: "word1", type: "string", description: "Source word" },
        { name: "word2", type: "string", description: "Target word" }
      ],
      returnType: "number",
      constraints: ["0 <= word1.length, word2.length <= 500", "word1 and word2 consist of lowercase English letters."],
      examples: [
        { input: "word1 = \"horse\", word2 = \"ros\"", output: "3", explanation: "horse -> rorse (replace 'h' with 'r') -> rose (remove 'r') -> ros (remove 'e')." },
        { input: "word1 = \"intention\", word2 = \"execution\"", output: "5", explanation: "intention -> inention -> enention -> exention -> exection -> execution." },
        { input: "word1 = \"\", word2 = \"a\"", output: "1", explanation: "Insert 'a'." },
        { input: "word1 = \"abc\", word2 = \"abc\"", output: "0", explanation: "Both words are identical." }
      ],
      optimalSolution: `function minDistance(word1, word2) {\n  const m = word1.length, n = word2.length;\n  let dp = Array.from({ length: n + 1 }, (_, i) => i);\n  for (let i = 1; i <= m; i++) {\n    let prevDiagonal = dp[0];\n    dp[0] = i;\n    for (let j = 1; j <= n; j++) {\n      const temp = dp[j];\n      if (word1[i - 1] === word2[j - 1]) {\n        dp[j] = prevDiagonal;\n      } else {\n        dp[j] = 1 + Math.min(prevDiagonal, dp[j], dp[j - 1]);\n      }\n      prevDiagonal = temp;\n    }\n  }\n  return dp[n];\n}`,
      optimalTimeComplexity: "O(m * n)",
      optimalSpaceComplexity: "O(n)",
      suboptimalSolution: `function minDistance(word1, word2) {\n  const m = word1.length, n = word2.length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n  for (let i = 0; i <= m; i++) dp[i][0] = i;\n  for (let j = 0; j <= n; j++) dp[0][j] = j;\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (word1[i - 1] === word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];\n      else dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);\n    }\n  }\n  return dp[m][n];\n}`,
      suboptimalTimeComplexity: "O(m * n)",
      suboptimalSpaceComplexity: "O(m * n)",
      commonMistakes: ["Failing to initialize base cases when one string is empty (converting \"\" to length n requires n inserts)."],
      hints: [
        "If word1[i-1] == word2[j-1], cost is 0 (prevDiagonal).",
        "Otherwise, 1 + min(replace: prevDiagonal, delete: dp[j], insert: dp[j-1])."
      ],
      oracleFn: (word1: string, word2: string) => {
        const m = word1.length, n = word2.length;
        let dp = Array.from({ length: n + 1 }, (_, i) => i);
        for (let i = 1; i <= m; i++) {
          let prevDiagonal = dp[0];
          dp[0] = i;
          for (let j = 1; j <= n; j++) {
            const temp = dp[j];
            if (word1[i - 1] === word2[j - 1]) {
              dp[j] = prevDiagonal;
            } else {
              dp[j] = 1 + Math.min(prevDiagonal, dp[j], dp[j - 1]);
            }
            prevDiagonal = temp;
          }
        }
        return dp[n];
      },
      testCases: {
        functional: [
          ["horse", "ros"],
          ["intention", "execution"],
          ["", "a"],
          ["abc", "abc"]
        ],
        boundary: [
          ["", ""],
          ["a", ""],
          ["ab", "a"]
        ],
        adversarial: [
          ["plasma", "altruism"],
          ["dinitrophenylhydrazine", "acetylphenylhydrazine"],
          ["zoologicoarchaeologist", "zoogeologist"]
        ],
        stress: [
          ["abcdefghijklmn", "nopqrstuvwxyz"],
          ["pneumonoultramicroscopicsilicovolcanoconiosis", "ultramicroscopic"]
        ]
      }
    }),

    // 383. Distinct Subsequences
    createProblem({
      num: 383,
      title: "Distinct Subsequences",
      slug: "distinct-subsequences",
      level: 18,
      difficulty: "HARD",
      topic: "2D Dynamic Programming",
      patternSlug: "dp-2d-strings",
      estimatedTimeMin: 25,
      statement: "Given two strings `s` and `t`, return the number of distinct subsequences of `s` which equals `t`.\n\nThe test cases are generated so that the answer fits on a 32-bit signed integer.",
      functionName: "numDistinct",
      parameters: [
        { name: "s", type: "string", description: "Source string" },
        { name: "t", type: "string", description: "Target string" }
      ],
      returnType: "number",
      constraints: ["1 <= s.length, t.length <= 1000", "s and t consist of English letters."],
      examples: [
        { input: "s = \"rabbbit\", t = \"rabbit\"", output: "3", explanation: "Three ways to get \"rabbit\" by deleting each of the three 'b's in s." },
        { input: "s = \"babgbag\", t = \"bag\"", output: "5", explanation: "Five distinct subsequences in \"babgbag\" equal \"bag\"." },
        { input: "s = \"a\", t = \"b\"", output: "0", explanation: "\"b\" cannot be formed from \"a\"." },
        { input: "s = \"aaa\", t = \"a\"", output: "3", explanation: "Each individual 'a' forms a valid subsequence." }
      ],
      optimalSolution: `function numDistinct(s, t) {\n  const m = s.length, n = t.length;\n  const dp = new Array(n + 1).fill(0);\n  dp[0] = 1;\n  for (let i = 1; i <= m; i++) {\n    for (let j = n; j >= 1; j--) {\n      if (s[i - 1] === t[j - 1]) {\n        dp[j] += dp[j - 1];\n      }\n    }\n  }\n  return dp[n];\n}`,
      optimalTimeComplexity: "O(m * n)",
      optimalSpaceComplexity: "O(n)",
      suboptimalSolution: `function numDistinct(s, t) {\n  const m = s.length, n = t.length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n  for (let i = 0; i <= m; i++) dp[i][0] = 1;\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      dp[i][j] = dp[i - 1][j];\n      if (s[i - 1] === t[j - 1]) dp[i][j] += dp[i - 1][j - 1];\n    }\n  }\n  return dp[m][n];\n}`,
      suboptimalTimeComplexity: "O(m * n)",
      suboptimalSpaceComplexity: "O(m * n)",
      commonMistakes: ["Traversing j forward in 1D array causing values from the current row to overwrite prior states."],
      hints: [
        "If s[i-1] == t[j-1], we can either use s[i-1] (giving dp[j-1] ways) or not use it (giving dp[j] ways).",
        "Iterate j backwards from n down to 1."
      ],
      oracleFn: (s: string, t: string) => {
        const m = s.length, n = t.length;
        const dp = new Array(n + 1).fill(0);
        dp[0] = 1;
        for (let i = 1; i <= m; i++) {
          for (let j = n; j >= 1; j--) {
            if (s[i - 1] === t[j - 1]) {
              dp[j] += dp[j - 1];
            }
          }
        }
        return dp[n];
      },
      testCases: {
        functional: [
          ["rabbbit", "rabbit"],
          ["babgbag", "bag"],
          ["a", "b"],
          ["aaa", "a"]
        ],
        boundary: [
          ["a", "a"],
          ["ab", "ab"],
          ["abc", "d"]
        ],
        adversarial: [
          ["aaaaaaaaaa", "aaaaa"],
          ["adbdadeecdeadeccfacddcebeddebfadedbbaaeecbeeeeefbbdedacfedccdababebacaeacaeacadddcbbsedebdbebedaeecfaebdceedecefedddfbedf", "bcddceeeebecbc"],
          ["ddd", "dd"]
        ],
        stress: [
          ["a".repeat(40), "a".repeat(10)],
          ["ab".repeat(25), "ab".repeat(5)]
        ]
      }
    }),

    // 384. Interleaving String
    createProblem({
      num: 384,
      title: "Interleaving String",
      slug: "interleaving-string",
      level: 18,
      difficulty: "MEDIUM",
      topic: "2D Dynamic Programming",
      patternSlug: "dp-2d-strings",
      estimatedTimeMin: 25,
      statement: "Given strings `s1`, `s2`, and `s3`, find whether `s3` is formed by an interleaving of `s1` and `s2`.\n\nAn interleaving of two strings `s` and `t` is a configuration where `s` and `t` are divided into `n` and `m` substrings respectively, such that:\n- s = s1 + s2 + ... + sn\n- t = t1 + t2 + ... + tm\n- |n - m| <= 1\n- The interleaving is s1 + t1 + s2 + t2 + ... or t1 + s1 + t2 + s2 + ...",
      functionName: "isInterleave",
      parameters: [
        { name: "s1", type: "string", description: "First source string" },
        { name: "s2", type: "string", description: "Second source string" },
        { name: "s3", type: "string", description: "Target interleaving string" }
      ],
      returnType: "boolean",
      constraints: ["0 <= s1.length, s2.length <= 100", "0 <= s3.length <= 200", "s1, s2, and s3 consist of lowercase English letters."],
      examples: [
        { input: "s1 = \"aabcc\", s2 = \"dbbca\", s3 = \"aadbbcbcac\"", output: "true", explanation: "\"aadbbcbcac\" interleaves s1 (\"aa\" + \"bc\" + \"c\") and s2 (\"dbbc\" + \"a\")." },
        { input: "s1 = \"aabcc\", s2 = \"dbbca\", s3 = \"aadbbbaccc\"", output: "false", explanation: "Cannot interleave to get \"aadbbbaccc\"." },
        { input: "s1 = \"\", s2 = \"\", s3 = \"\"", output: "true", explanation: "All empty strings." },
        { input: "s1 = \"a\", s2 = \"b\", s3 = \"ab\"", output: "true", explanation: "Alternating characters 'a' and 'b'." }
      ],
      optimalSolution: `function isInterleave(s1, s2, s3) {\n  if (s1.length + s2.length !== s3.length) return false;\n  const dp = new Array(s2.length + 1).fill(false);\n  dp[0] = true;\n  for (let j = 1; j <= s2.length; j++) {\n    dp[j] = dp[j - 1] && s2[j - 1] === s3[j - 1];\n  }\n  for (let i = 1; i <= s1.length; i++) {\n    dp[0] = dp[0] && s1[i - 1] === s3[i - 1];\n    for (let j = 1; j <= s2.length; j++) {\n      dp[j] = (dp[j] && s1[i - 1] === s3[i + j - 1]) || (dp[j - 1] && s2[j - 1] === s3[i + j - 1]);\n    }\n  }\n  return dp[s2.length];\n}`,
      optimalTimeComplexity: "O(s1.length * s2.length)",
      optimalSpaceComplexity: "O(s2.length)",
      suboptimalSolution: `function isInterleave(s1, s2, s3) {\n  if (s1.length + s2.length !== s3.length) return false;\n  const memo = new Map();\n  function dfs(i, j, k) {\n    if (k === s3.length) return true;\n    const key = i + ',' + j;\n    if (memo.has(key)) return memo.get(key);\n    let valid = false;\n    if (i < s1.length && s1[i] === s3[k]) valid = valid || dfs(i + 1, j, k + 1);\n    if (j < s2.length && s2[j] === s3[k]) valid = valid || dfs(i, j + 1, k + 1);\n    memo.set(key, valid);\n    return valid;\n  }\n  return dfs(0, 0, 0);\n}`,
      suboptimalTimeComplexity: "O(s1.length * s2.length)",
      suboptimalSpaceComplexity: "O(s1.length * s2.length)",
      commonMistakes: ["Greedily picking from s1 when both s1 and s2 match s3[k], causing dead ends."],
      hints: [
        "First check if s1.length + s2.length == s3.length.",
        "dp[j] indicates whether s3[0...i+j-1] is formed by s1[0...i-1] and s2[0...j-1]."
      ],
      oracleFn: (s1: string, s2: string, s3: string) => {
        if (s1.length + s2.length !== s3.length) return false;
        const dp = new Array(s2.length + 1).fill(false);
        dp[0] = true;
        for (let j = 1; j <= s2.length; j++) {
          dp[j] = dp[j - 1] && s2[j - 1] === s3[j - 1];
        }
        for (let i = 1; i <= s1.length; i++) {
          dp[0] = dp[0] && s1[i - 1] === s3[i - 1];
          for (let j = 1; j <= s2.length; j++) {
            dp[j] = (dp[j] && s1[i - 1] === s3[i + j - 1]) || (dp[j - 1] && s2[j - 1] === s3[i + j - 1]);
          }
        }
        return dp[s2.length];
      },
      testCases: {
        functional: [
          ["aabcc", "dbbca", "aadbbcbcac"],
          ["aabcc", "dbbca", "aadbbbaccc"],
          ["", "", ""],
          ["a", "b", "ab"]
        ],
        boundary: [
          ["a", "", "a"],
          ["", "b", "b"],
          ["a", "b", "ba"]
        ],
        adversarial: [
          ["aa", "ab", "aaba"],
          ["bbbbbabbbbabaababaa", "babaaaabbababbbabbb", "babbbabbbaaabbababbbbababbbabbabbbababbb"],
          ["ab", "bc", "babc"]
        ],
        stress: [
          ["a".repeat(30), "b".repeat(30), "ab".repeat(30)],
          ["a".repeat(40), "a".repeat(40), "a".repeat(80)]
        ]
      }
    }),

    // 385. Word Break II
    createProblem({
      num: 385,
      title: "Word Break II",
      slug: "word-break-ii",
      level: 18,
      difficulty: "HARD",
      topic: "2D Dynamic Programming",
      patternSlug: "dp-2d-strings",
      estimatedTimeMin: 25,
      statement: "Given a string `s` and a dictionary of strings `wordDict`, add spaces in `s` to construct a sentence where each word is a valid dictionary word. Return all such possible sentences in any order.\n\nNote that the same word in the dictionary may be reused multiple times in the segmentation.",
      functionName: "wordBreak",
      parameters: [
        { name: "s", type: "string", description: "Target string" },
        { name: "wordDict", type: "string[]", description: "Permitted words" }
      ],
      returnType: "string[]",
      constraints: ["1 <= s.length <= 20", "1 <= wordDict.length <= 1000", "1 <= wordDict[i].length <= 10", "s and wordDict[i] consist of only lowercase English letters."],
      examples: [
        { input: "s = \"catsanddog\", wordDict = [\"cat\",\"cats\",\"and\",\"sand\",\"dog\"]", output: "[\"cat sand dog\",\"cats and dog\"]", explanation: "Two valid sentences." },
        { input: "s = \"pineapplepenapple\", wordDict = [\"apple\",\"pen\",\"applepen\",\"pine\",\"pineapple\"]", output: "[\"pine apple pen apple\",\"pine applepen apple\",\"pineapple pen apple\"]", explanation: "Three valid sentences." },
        { input: "s = \"catsandog\", wordDict = [\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]", output: "[]", explanation: "No valid segmentation exists." },
        { input: "s = \"a\", wordDict = [\"a\"]", output: "[\"a\"]", explanation: "Single character match." }
      ],
      optimalSolution: `function wordBreak(s, wordDict) {\n  const wordSet = new Set(wordDict);\n  const memo = new Map();\n  function dfs(str) {\n    if (memo.has(str)) return memo.get(str);\n    if (str.length === 0) return [""];\n    const res = [];\n    for (let end = 1; end <= str.length; end++) {\n      const prefix = str.slice(0, end);\n      if (wordSet.has(prefix)) {\n        const rest = dfs(str.slice(end));\n        for (const sub of rest) {\n          res.push(sub.length > 0 ? prefix + " " + sub : prefix);\n        }\n      }\n    }\n    memo.set(str, res);\n    return res;\n  }\n  const result = dfs(s);\n  return result.sort();\n}`,
      optimalTimeComplexity: "O(2^N)",
      optimalSpaceComplexity: "O(2^N * N)",
      suboptimalSolution: `function wordBreak(s, wordDict) {\n  const wordSet = new Set(wordDict);\n  const res = [];\n  function backtrack(idx, path) {\n    if (idx === s.length) {\n      res.push(path.join(' '));\n      return;\n    }\n    for (let end = idx + 1; end <= s.length; end++) {\n      const w = s.slice(idx, end);\n      if (wordSet.has(w)) {\n        path.push(w);\n        backtrack(end, path);\n        path.pop();\n      }\n    }\n  }\n  backtrack(0, []);\n  return res.sort();\n}`,
      suboptimalTimeComplexity: "O(2^N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Not memoizing subproblem results on the same suffix string."],
      hints: [
        "Use memoized DFS from right to left or prefix to suffix.",
        "Sort result array for deterministic test verification."
      ],
      oracleFn: (s: string, wordDict: string[]) => {
        const wordSet = new Set(wordDict);
        const memo = new Map<string, string[]>();
        const dfs = (str: string): string[] => {
          if (memo.has(str)) return memo.get(str)!;
          if (str.length === 0) return [""];
          const res: string[] = [];
          for (let end = 1; end <= str.length; end++) {
            const prefix = str.slice(0, end);
            if (wordSet.has(prefix)) {
              const rest = dfs(str.slice(end));
              for (const sub of rest) {
                res.push(sub.length > 0 ? prefix + " " + sub : prefix);
              }
            }
          }
          memo.set(str, res);
          return res;
        };
        return dfs(s).sort();
      },
      testCases: {
        functional: [
          ["catsanddog", ["cat", "cats", "and", "sand", "dog"]],
          ["pineapplepenapple", ["apple", "pen", "applepen", "pine", "pineapple"]],
          ["catsandog", ["cats", "dog", "sand", "and", "cat"]],
          ["a", ["a"]]
        ],
        boundary: [
          ["a", ["b"]],
          ["ab", ["a", "b"]],
          ["aaaa", ["a", "aa"]]
        ],
        adversarial: [
          ["goalspecial", ["go", "goal", "goals", "special"]],
          ["cars", ["car", "ca", "rs"]],
          ["sandand", ["sand", "and"]]
        ],
        stress: [
          ["aaaaaaa", ["a", "aa", "aaa"]],
          ["bbbb", ["b", "bb"]]
        ]
      }
    }),

    // 386. Regular Expression Matching
    createProblem({
      num: 386,
      title: "Regular Expression Matching",
      slug: "regular-expression-matching",
      level: 18,
      difficulty: "HARD",
      topic: "2D Dynamic Programming",
      patternSlug: "dp-2d-strings",
      estimatedTimeMin: 30,
      statement: "Given an input string `s` and a pattern `p`, implement regular expression matching with support for `'.'` and `'*'` where:\n- `'.'` Matches any single character.\n- `'*'` Matches zero or more of the preceding element.\n\nThe matching should cover the entire input string (not partial).",
      functionName: "isMatch",
      parameters: [
        { name: "s", type: "string", description: "Input string" },
        { name: "p", type: "string", description: "Pattern string" }
      ],
      returnType: "boolean",
      constraints: ["1 <= s.length <= 20", "1 <= p.length <= 20", "s contains only lowercase English letters.", "p contains only lowercase English letters, '.', and '*'.", "It is guaranteed for each appearance of the character '*', there will be a previous valid character to match."],
      examples: [
        { input: "s = \"aa\", p = \"a\"", output: "false", explanation: "\"a\" does not match the entire string \"aa\"." },
        { input: "s = \"aa\", p = \"a*\"", output: "true", explanation: "'*' means zero or more of the preceding element, 'a'." },
        { input: "s = \"ab\", p = \".*\"", output: "true", explanation: "\".*\" means \"zero or more (*) of any character (.)\"." },
        { input: "s = \"aab\", p = \"c*a*b\"", output: "true", explanation: "c* matches zero 'c's, a* matches two 'a's, and b matches 'b'." }
      ],
      optimalSolution: `function isMatch(s, p) {\n  const m = s.length, n = p.length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));\n  dp[0][0] = true;\n  for (let j = 2; j <= n; j += 2) {\n    if (p[j - 1] === '*') dp[0][j] = dp[0][j - 2];\n  }\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (p[j - 1] === '*') {\n        dp[i][j] = dp[i][j - 2];\n        if (p[j - 2] === '.' || p[j - 2] === s[i - 1]) {\n          dp[i][j] = dp[i][j] || dp[i - 1][j];\n        }\n      } else if (p[j - 1] === '.' || p[j - 1] === s[i - 1]) {\n        dp[i][j] = dp[i - 1][j - 1];\n      }\n    }\n  }\n  return dp[m][n];\n}`,
      optimalTimeComplexity: "O(m * n)",
      optimalSpaceComplexity: "O(m * n)",
      suboptimalSolution: `function isMatch(s, p) {\n  const memo = new Map();\n  function dfs(i, j) {\n    if (j === p.length) return i === s.length;\n    const key = i + ',' + j;\n    if (memo.has(key)) return memo.get(key);\n    const firstMatch = i < s.length && (p[j] === s[i] || p[j] === '.');\n    let res = false;\n    if (j + 1 < p.length && p[j + 1] === '*') {\n      res = dfs(i, j + 2) || (firstMatch && dfs(i + 1, j));\n    } else {\n      res = firstMatch && dfs(i + 1, j + 1);\n    }\n    memo.set(key, res);\n    return res;\n  }\n  return dfs(0, 0);\n}`,
      suboptimalTimeComplexity: "O(m * n)",
      suboptimalSpaceComplexity: "O(m * n)",
      commonMistakes: ["Treating '*' as matching any characters independently like shell wildcard (in regex, '*' modifies the preceding token)."],
      hints: [
        "If p[j-1] == '*', check two possibilities: matching zero occurrences (dp[i][j-2]) or matching one more if preceding matches (dp[i-1][j])."
      ],
      oracleFn: (s: string, p: string) => {
        const m = s.length, n = p.length;
        const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
        dp[0][0] = true;
        for (let j = 2; j <= n; j += 2) {
          if (p[j - 1] === '*') dp[0][j] = dp[0][j - 2];
        }
        for (let i = 1; i <= m; i++) {
          for (let j = 1; j <= n; j++) {
            if (p[j - 1] === '*') {
              dp[i][j] = dp[i][j - 2];
              if (p[j - 2] === '.' || p[j - 2] === s[i - 1]) {
                dp[i][j] = dp[i][j] || dp[i - 1][j];
              }
            } else if (p[j - 1] === '.' || p[j - 1] === s[i - 1]) {
              dp[i][j] = dp[i - 1][j - 1];
            }
          }
        }
        return dp[m][n];
      },
      testCases: {
        functional: [
          ["aa", "a"],
          ["aa", "a*"],
          ["ab", ".*"],
          ["aab", "c*a*b"]
        ],
        boundary: [
          ["a", ".*..a*"],
          ["ab", ".*c"],
          ["mississippi", "mis*is*ip*."]
        ],
        adversarial: [
          ["aaa", "a*a"],
          ["aaa", "ab*a*c*a"],
          ["ab", ".*.."]
        ],
        stress: [
          ["aaaaaaaaaaaaab", "a*a*a*a*a*a*a*a*a*a*c"],
          ["aaaaaaaaaa", "a*"]
        ]
      }
    }),

    // 387. Wildcard Matching
    createProblem({
      num: 387,
      title: "Wildcard Matching",
      slug: "wildcard-matching",
      level: 18,
      difficulty: "HARD",
      topic: "2D Dynamic Programming",
      patternSlug: "dp-2d-strings",
      estimatedTimeMin: 25,
      statement: "Given an input string `s` and a pattern `p`, implement wildcard pattern matching with support for `'?'` and `'*'` where:\n- `'?'` Matches any single character.\n- `'*'` Matches any sequence of characters (including the empty sequence).\n\nThe matching should cover the entire input string (not partial).",
      functionName: "isMatch",
      parameters: [
        { name: "s", type: "string", description: "Input string" },
        { name: "p", type: "string", description: "Wildcard pattern" }
      ],
      returnType: "boolean",
      constraints: ["0 <= s.length, p.length <= 2000", "s contains only lowercase English letters.", "p contains only lowercase English letters, '?' or '*'."],
      examples: [
        { input: "s = \"aa\", p = \"a\"", output: "false", explanation: "\"a\" does not match the entire string \"aa\"." },
        { input: "s = \"aa\", p = \"*\"", output: "true", explanation: "'*' matches any sequence." },
        { input: "s = \"cb\", p = \"?a\"", output: "false", explanation: "'?' matches 'c', but second char 'a' does not match 'b'." },
        { input: "s = \"adceb\", p = \"*a*b\"", output: "true", explanation: "First '*' matches empty, second '*' matches \"dce\"." }
      ],
      optimalSolution: `function isMatch(s, p) {\n  let sIdx = 0, pIdx = 0, match = 0, starIdx = -1;\n  while (sIdx < s.length) {\n    if (pIdx < p.length && (p[pIdx] === '?' || p[pIdx] === s[sIdx])) {\n      sIdx++;\n      pIdx++;\n    } else if (pIdx < p.length && p[pIdx] === '*') {\n      starIdx = pIdx;\n      match = sIdx;\n      pIdx++;\n    } else if (starIdx !== -1) {\n      pIdx = starIdx + 1;\n      match++;\n      sIdx = match;\n    } else {\n      return false;\n    }\n  }\n  while (pIdx < p.length && p[pIdx] === '*') pIdx++;\n  return pIdx === p.length;\n}`,
      optimalTimeComplexity: "O(s * p) worst-case, O(s + p) average",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function isMatch(s, p) {\n  const m = s.length, n = p.length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));\n  dp[0][0] = true;\n  for (let j = 1; j <= n; j++) {\n    if (p[j - 1] === '*') dp[0][j] = dp[0][j - 1];\n  }\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (p[j - 1] === '*') {\n        dp[i][j] = dp[i][j - 1] || dp[i - 1][j];\n      } else if (p[j - 1] === '?' || p[j - 1] === s[i - 1]) {\n        dp[i][j] = dp[i - 1][j - 1];\n      }\n    }\n  }\n  return dp[m][n];\n}`,
      suboptimalTimeComplexity: "O(m * n)",
      suboptimalSpaceComplexity: "O(m * n)",
      commonMistakes: ["Confusing wildcard '*' (matches any sequence standalone) with regex '*' (modifies preceding token)."],
      hints: [
        "In wildcard matching, '*' stands alone to match 0 or more arbitrary characters.",
        "A two-pointer backtracking approach achieves O(1) space and linear average runtime."
      ],
      oracleFn: (s: string, p: string) => {
        let sIdx = 0, pIdx = 0, match = 0, starIdx = -1;
        while (sIdx < s.length) {
          if (pIdx < p.length && (p[pIdx] === '?' || p[pIdx] === s[sIdx])) {
            sIdx++;
            pIdx++;
          } else if (pIdx < p.length && p[pIdx] === '*') {
            starIdx = pIdx;
            match = sIdx;
            pIdx++;
          } else if (starIdx !== -1) {
            pIdx = starIdx + 1;
            match++;
            sIdx = match;
          } else {
            return false;
          }
        }
        while (pIdx < p.length && p[pIdx] === '*') pIdx++;
        return pIdx === p.length;
      },
      testCases: {
        functional: [
          ["aa", "a"],
          ["aa", "*"],
          ["cb", "?a"],
          ["adceb", "*a*b"]
        ],
        boundary: [
          ["", ""],
          ["", "*"],
          ["a", ""]
        ],
        adversarial: [
          ["acdcb", "a*c?b"],
          ["mississippi", "m??*ss*?i*pi"],
          ["abcabczzzde", "*abc???de*"]
        ],
        stress: [
          ["b".repeat(50), "*b*"],
          ["a".repeat(40) + "b", "*a*a*a*b*"]
        ]
      }
    }),

    // 388. Palindromic Substrings
    createProblem({
      num: 388,
      title: "Palindromic Substrings",
      slug: "palindromic-substrings",
      level: 18,
      difficulty: "MEDIUM",
      topic: "2D Dynamic Programming",
      patternSlug: "dp-2d-strings",
      estimatedTimeMin: 20,
      statement: "Given a string `s`, return the number of palindromic substrings in it.\n\nA string is a palindrome when it reads the same backward as forward.\n\nA substring is a contiguous sequence of characters within the string.",
      functionName: "countSubstrings",
      parameters: [{ name: "s", type: "string", description: "Target string" }],
      returnType: "number",
      constraints: ["1 <= s.length <= 1000", "s consists of lowercase English letters."],
      examples: [
        { input: "s = \"abc\"", output: "3", explanation: "Three palindromic substrings: \"a\", \"b\", \"c\"." },
        { input: "s = \"aaa\"", output: "6", explanation: "Six palindromic substrings: \"a\", \"a\", \"a\", \"aa\", \"aa\", \"aaa\"." },
        { input: "s = \"a\"", output: "1", explanation: "Single character is a palindrome." },
        { input: "s = \"aba\"", output: "4", explanation: "\"a\", \"b\", \"a\", \"aba\"." }
      ],
      optimalSolution: `function countSubstrings(s) {\n  let count = 0;\n  function expand(l, r) {\n    while (l >= 0 && r < s.length && s[l] === s[r]) {\n      count++;\n      l--;\n      r++;\n    }\n  }\n  for (let i = 0; i < s.length; i++) {\n    expand(i, i);\n    expand(i, i + 1);\n  }\n  return count;\n}`,
      optimalTimeComplexity: "O(N^2)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function countSubstrings(s) {\n  const n = s.length;\n  const dp = Array.from({ length: n }, () => new Array(n).fill(false));\n  let count = 0;\n  for (let i = n - 1; i >= 0; i--) {\n    for (let j = i; j < n; j++) {\n      if (s[i] === s[j] && (j - i <= 2 || dp[i + 1][j - 1])) {\n        dp[i][j] = true;\n        count++;\n      }\n    }\n  }\n  return count;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N^2)",
      commonMistakes: ["Missing even-length palindromes by only expanding around single centers (i, i)."],
      hints: [
        "There are 2N - 1 possible centers for palindromes in a string of length N.",
        "Expand outwards from each center (i, i) and (i, i + 1)."
      ],
      oracleFn: (s: string) => {
        let count = 0;
        const expand = (l: number, r: number) => {
          while (l >= 0 && r < s.length && s[l] === s[r]) {
            count++;
            l--;
            r++;
          }
        };
        for (let i = 0; i < s.length; i++) {
          expand(i, i);
          expand(i, i + 1);
        }
        return count;
      },
      testCases: {
        functional: [
          ["abc"],
          ["aaa"],
          ["a"],
          ["aba"]
        ],
        boundary: [
          ["aa"],
          ["ab"],
          ["aaaa"]
        ],
        adversarial: [
          ["fdsklf"],
          ["racecar"],
          ["kayak"]
        ],
        stress: [
          ["a".repeat(100)],
          ["ab".repeat(40)]
        ]
      }
    }),

    // 389. Longest Palindromic Substring
    createProblem({
      num: 389,
      title: "Longest Palindromic Substring",
      slug: "longest-palindromic-substring",
      level: 18,
      difficulty: "MEDIUM",
      topic: "2D Dynamic Programming",
      patternSlug: "dp-2d-strings",
      estimatedTimeMin: 25,
      statement: "Given a string `s`, return the longest palindromic substring in `s`.\n\nA substring is a contiguous non-empty sequence of characters within a string.",
      functionName: "longestPalindrome",
      parameters: [{ name: "s", type: "string", description: "Target string" }],
      returnType: "string",
      constraints: ["1 <= s.length <= 1000", "s consist of only digits and English letters."],
      examples: [
        { input: "s = \"babad\"", output: "\"bab\"", explanation: "\"aba\" is also a valid answer; standard left-to-right expansion produces \"bab\"." },
        { input: "s = \"cbbd\"", output: "\"bb\"", explanation: "\"bb\" is the longest palindrome." },
        { input: "s = \"a\"", output: "\"a\"", explanation: "Single character is a palindrome." },
        { input: "s = \"ac\"", output: "\"a\"", explanation: "Length 1 palindrome." }
      ],
      optimalSolution: `function longestPalindrome(s) {\n  if (!s || s.length <= 1) return s;\n  let start = 0, maxLen = 1;\n  function expand(l, r) {\n    while (l >= 0 && r < s.length && s[l] === s[r]) {\n      const len = r - l + 1;\n      if (len > maxLen) {\n        start = l;\n        maxLen = len;\n      }\n      l--;\n      r++;\n    }\n  }\n  for (let i = 0; i < s.length; i++) {\n    expand(i, i);\n    expand(i, i + 1);\n  }\n  return s.substring(start, start + maxLen);\n}`,
      optimalTimeComplexity: "O(N^2)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function longestPalindrome(s) {\n  const n = s.length;\n  if (n <= 1) return s;\n  const dp = Array.from({ length: n }, () => new Array(n).fill(false));\n  let start = 0, maxLen = 1;\n  for (let i = 0; i < n; i++) dp[i][i] = true;\n  for (let i = n - 1; i >= 0; i--) {\n    for (let j = i + 1; j < n; j++) {\n      if (s[i] === s[j]) {\n        if (j - i === 1 || dp[i + 1][j - 1]) {\n          dp[i][j] = true;\n          if (j - i + 1 > maxLen) {\n            start = i;\n            maxLen = j - i + 1;\n          }\n        }\n      }\n    }\n  }\n  return s.substring(start, start + maxLen);\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N^2)",
      commonMistakes: ["Expanding only odd lengths around i and forgetting even lengths around i and i+1."],
      hints: [
        "Expand around each of the 2N - 1 centers.",
        "Track start index and max length to return the exact substring in O(1) space."
      ],
      oracleFn: (s: string) => {
        if (!s || s.length <= 1) return s;
        let start = 0, maxLen = 1;
        const expand = (l: number, r: number) => {
          while (l >= 0 && r < s.length && s[l] === s[r]) {
            const len = r - l + 1;
            if (len > maxLen) {
              start = l;
              maxLen = len;
            }
            l--;
            r++;
          }
        };
        for (let i = 0; i < s.length; i++) {
          expand(i, i);
          expand(i, i + 1);
        }
        return s.substring(start, start + maxLen);
      },
      testCases: {
        functional: [
          ["babad"],
          ["cbbd"],
          ["a"],
          ["ac"]
        ],
        boundary: [
          ["aa"],
          ["aaa"],
          ["aaaa"]
        ],
        adversarial: [
          ["forgeeksskeegfor"],
          ["abacdfgdcaba"],
          ["noon"]
        ],
        stress: [
          ["a".repeat(80)],
          ["ab".repeat(30)]
        ]
      }
    }),

    // 390. Maximal Square
    createProblem({
      num: 390,
      title: "Maximal Square",
      slug: "maximal-square",
      level: 18,
      difficulty: "MEDIUM",
      topic: "2D Dynamic Programming",
      patternSlug: "dp-2d-strings",
      estimatedTimeMin: 25,
      statement: "Given an `m x n` binary `matrix` filled with `'0'`s and `'1'`s, find the largest square containing only `'1'`s and return its area.",
      functionName: "maximalSquare",
      parameters: [{ name: "matrix", type: "string[][]", description: "m x n binary matrix" }],
      returnType: "number",
      constraints: ["m == matrix.length", "n == matrix[i].length", "1 <= m, n <= 300", "matrix[i][j] is '0' or '1'"],
      examples: [
        { input: "matrix = [[\"1\",\"0\",\"1\",\"0\",\"0\"],[\"1\",\"0\",\"1\",\"1\",\"1\"],[\"1\",\"1\",\"1\",\"1\",\"1\"],[\"1\",\"0\",\"0\",\"1\",\"0\"]]", output: "4", explanation: "The maximal square is 2x2 with area 4." },
        { input: "matrix = [[\"0\",\"1\"],[\"1\",\"0\"]]", output: "1", explanation: "Maximal square is 1x1 with area 1." },
        { input: "matrix = [[\"0\"]]", output: "0", explanation: "Only zero present, area is 0." },
        { input: "matrix = [[\"1\"]]", output: "1", explanation: "Single cell square of area 1." }
      ],
      optimalSolution: `function maximalSquare(matrix) {\n  if (!matrix || matrix.length === 0) return 0;\n  const m = matrix.length, n = matrix[0].length;\n  const dp = new Array(n + 1).fill(0);\n  let maxSide = 0, prevDiagonal = 0;\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      const temp = dp[j];\n      const val = matrix[i - 1][j - 1];\n      if (val === '1' || val === 1) {\n        dp[j] = Math.min(dp[j - 1], dp[j], prevDiagonal) + 1;\n        maxSide = Math.max(maxSide, dp[j]);\n      } else {\n        dp[j] = 0;\n      }\n      prevDiagonal = temp;\n    }\n  }\n  return maxSide * maxSide;\n}`,
      optimalTimeComplexity: "O(m * n)",
      optimalSpaceComplexity: "O(n)",
      suboptimalSolution: `function maximalSquare(matrix) {\n  const m = matrix.length, n = matrix[0].length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n  let maxSide = 0;\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      const val = matrix[i - 1][j - 1];\n      if (val === '1' || val === 1) {\n        dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;\n        maxSide = Math.max(maxSide, dp[i][j]);\n      }\n    }\n  }\n  return maxSide * maxSide;\n}`,
      suboptimalTimeComplexity: "O(m * n)",
      suboptimalSpaceComplexity: "O(m * n)",
      commonMistakes: ["Returning side length instead of area (side * side).", "Forgetting to reset dp[j] to 0 when encountering '0'."],
      hints: [
        "Let dp[i][j] be the side length of the maximal square whose bottom-right corner is at (i, j).",
        "dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) when matrix[i-1][j-1] == '1'."
      ],
      oracleFn: (matrix: string[][]) => {
        if (!matrix || matrix.length === 0) return 0;
        const m = matrix.length, n = matrix[0].length;
        const dp = new Array(n + 1).fill(0);
        let maxSide = 0, prevDiagonal = 0;
        for (let i = 1; i <= m; i++) {
          for (let j = 1; j <= n; j++) {
            const temp = dp[j];
            const val = matrix[i - 1][j - 1];
            if (val === '1' || (val as any) === 1) {
              dp[j] = Math.min(dp[j - 1], dp[j], prevDiagonal) + 1;
              maxSide = Math.max(maxSide, dp[j]);
            } else {
              dp[j] = 0;
            }
            prevDiagonal = temp;
          }
        }
        return maxSide * maxSide;
      },
      testCases: {
        functional: [
          [[["1", "0", "1", "0", "0"], ["1", "0", "1", "1", "1"], ["1", "1", "1", "1", "1"], ["1", "0", "0", "1", "0"]]],
          [[["0", "1"], ["1", "0"]]],
          [[["0"]]],
          [[["1"]]]
        ],
        boundary: [
          [[["1", "1"], ["1", "1"]]],
          [[["0", "0"], ["0", "0"]]],
          [[["1", "0"]]]
        ],
        adversarial: [
          [[["1", "1", "1", "1"], ["1", "1", "1", "1"], ["1", "1", "1", "1"]]],
          [[["0", "1", "1"], ["1", "1", "1"], ["1", "1", "0"]]],
          [[["1", "0", "1"], ["0", "1", "0"], ["1", "0", "1"]]]
        ],
        stress: [
          [Array.from({ length: 30 }, () => Array.from({ length: 30 }, () => "1"))],
          [Array.from({ length: 40 }, (_, r) => Array.from({ length: 40 }, (_, c) => ((r + c) % 2 === 0 ? "1" : "0")))]
        ]
      }
    }),

    // 391. Dungeon Game
    createProblem({
      num: 391,
      title: "Dungeon Game",
      slug: "dungeon-game",
      level: 18,
      difficulty: "HARD",
      topic: "2D Dynamic Programming",
      patternSlug: "dp-2d-strings",
      estimatedTimeMin: 30,
      statement: "The demons had captured the princess and imprisoned her in the bottom-right corner of a `dungeon`. The dungeon consists of `m x n` rooms represented by a 2D grid. Our valiant knight was initially positioned in the top-left room and must fight his way through dungeon to rescue the princess.\n\nThe knight has an initial health point represented by a positive integer. If at any point his health point drops to `0` or below, he dies immediately.\n\nSome rooms are guarded by demons (represented by negative integers), so the knight loses health upon entering; other rooms contain magic orbs (represented by positive integers) that increase the knight's health.\n\nIn order to reach the princess as quickly as possible, the knight decides to move only rightward or downward in each step.\n\nReturn the knight's minimum initial health so that he is able to rescue the princess.",
      functionName: "calculateMinimumHP",
      parameters: [{ name: "dungeon", type: "number[][]", description: "m x n dungeon room health points" }],
      returnType: "number",
      constraints: ["m == dungeon.length", "n == dungeon[i].length", "1 <= m, n <= 200", "-1000 <= dungeon[i][j] <= 1000"],
      examples: [
        { input: "dungeon = [[-2,-3,3],[-5,-10,1],[10,30,-5]]", output: "7", explanation: "Initial health 7 follows path RIGHT -> RIGHT -> DOWN -> DOWN: 7 - 2 = 5 -> 5 - 3 = 2 -> 2 + 3 = 5 -> 5 + 1 = 6 -> 6 - 5 = 1." },
        { input: "dungeon = [[0]]", output: "1", explanation: "Zero damage room requires 1 HP to stay alive." },
        { input: "dungeon = [[100]]", output: "1", explanation: "Orb gives health, knight only needs 1 HP minimum initial." },
        { input: "dungeon = [[-3]]", output: "4", explanation: "Damage 3 requires 1 + 3 = 4 HP." }
      ],
      optimalSolution: `function calculateMinimumHP(dungeon) {\n  const m = dungeon.length, n = dungeon[0].length;\n  const dp = new Array(n + 1).fill(Infinity);\n  dp[n - 1] = 1;\n  for (let i = m - 1; i >= 0; i--) {\n    for (let j = n - 1; j >= 0; j--) {\n      const minNext = Math.min(dp[j], dp[j + 1]);\n      dp[j] = Math.max(1, minNext - dungeon[i][j]);\n    }\n    dp[n] = Infinity;\n  }\n  return dp[0];\n}`,
      optimalTimeComplexity: "O(m * n)",
      optimalSpaceComplexity: "O(n)",
      suboptimalSolution: `function calculateMinimumHP(dungeon) {\n  const m = dungeon.length, n = dungeon[0].length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(Infinity));\n  dp[m][n - 1] = 1;\n  dp[m - 1][n] = 1;\n  for (let i = m - 1; i >= 0; i--) {\n    for (let j = n - 1; j >= 0; j--) {\n      const need = Math.min(dp[i + 1][j], dp[i][j + 1]) - dungeon[i][j];\n      dp[i][j] = need <= 0 ? 1 : need;\n    }\n  }\n  return dp[0][0];\n}`,
      suboptimalTimeComplexity: "O(m * n)",
      suboptimalSpaceComplexity: "O(m * n)",
      commonMistakes: ["Solving top-down (greedy HP doesn't satisfy subproblem independence because future high damage can invalidate earlier accumulated HP)."],
      hints: [
        "Solve bottom-up from bottom-right (princess room) to top-left (start).",
        "Let dp[i][j] be the minimum HP needed before entering room (i, j).",
        "dp[i][j] = max(1, min(dp[i+1][j], dp[i][j+1]) - dungeon[i][j])."
      ],
      oracleFn: (dungeon: number[][]) => {
        const m = dungeon.length, n = dungeon[0].length;
        const dp = new Array(n + 1).fill(Infinity);
        dp[n - 1] = 1;
        for (let i = m - 1; i >= 0; i--) {
          for (let j = n - 1; j >= 0; j--) {
            const minNext = Math.min(dp[j], dp[j + 1]);
            dp[j] = Math.max(1, minNext - dungeon[i][j]);
          }
          dp[n] = Infinity;
        }
        return dp[0];
      },
      testCases: {
        functional: [
          [[[-2, -3, 3], [-5, -10, 1], [10, 30, -5]]],
          [[[0]]],
          [[[100]]],
          [[[-3]]]
        ],
        boundary: [
          [[[-10, 10]]],
          [[[10, -10]]],
          [[[1, -3, 3], [0, -2, 0], [-3, -3, -3]]]
        ],
        adversarial: [
          [[[-1, -2, -3], [-4, -5, -6], [-7, -8, -9]]],
          [[[10, 10, 10], [10, 10, 10]]],
          [[[-5, 5], [5, -5]]]
        ],
        stress: [
          [Array.from({ length: 30 }, (_, r) => Array.from({ length: 30 }, (_, c) => (r + c) % 5 - 3))],
          [Array.from({ length: 40 }, () => Array.from({ length: 40 }, () => -2))]
        ]
      }
    }),

    // 392. Ones and Zeroes
    createProblem({
      num: 392,
      title: "Ones and Zeroes",
      slug: "ones-and-zeroes",
      level: 18,
      difficulty: "MEDIUM",
      topic: "2D Dynamic Programming",
      patternSlug: "dp-2d-strings",
      estimatedTimeMin: 25,
      statement: "You are given an array of binary strings `strs` and two integers `m` and `n`.\n\nReturn the size of the largest subset of `strs` such that there are at most `m` `0`'s and `n` `1`'s in the subset.\n\nA set `x` is a subset of a set `y` if all elements of `x` are also elements of `y`.",
      functionName: "findMaxForm",
      parameters: [
        { name: "strs", type: "string[]", description: "Array of binary strings" },
        { name: "m", type: "number", description: "Max count of '0's allowed" },
        { name: "n", type: "number", description: "Max count of '1's allowed" }
      ],
      returnType: "number",
      constraints: ["1 <= strs.length <= 600", "1 <= strs[i].length <= 100", "strs[i] consists only of digits '0' and '1'.", "1 <= m, n <= 100"],
      examples: [
        { input: "strs = [\"10\",\"0001\",\"111001\",\"1\",\"0\"], m = 5, n = 3", output: "4", explanation: "The largest subset with at most 5 '0's and 3 '1's is {\"10\", \"0001\", \"1\", \"0\"}, size 4." },
        { input: "strs = [\"10\",\"0\",\"1\"], m = 1, n = 1", output: "2", explanation: "Subset {\"0\", \"1\"} has size 2." },
        { input: "strs = [\"111\",\"1000\",\"1000\"], m = 9, n = 3", output: "3", explanation: "All 3 strings fit." },
        { input: "strs = [\"0\"], m = 1, n = 0", output: "1", explanation: "Single \"0\" fits." }
      ],
      optimalSolution: `function findMaxForm(strs, m, n) {\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n  for (const s of strs) {\n    let zeros = 0, ones = 0;\n    for (const c of s) {\n      if (c === '0') zeros++;\n      else ones++;\n    }\n    for (let i = m; i >= zeros; i--) {\n      for (let j = n; j >= ones; j--) {\n        dp[i][j] = Math.max(dp[i][j], dp[i - zeros][j - ones] + 1);\n      }\n    }\n  }\n  return dp[m][n];\n}`,
      optimalTimeComplexity: "O(L * m * n) where L is strs.length",
      optimalSpaceComplexity: "O(m * n)",
      suboptimalSolution: `function findMaxForm(strs, m, n) {\n  const memo = new Map();\n  function dfs(idx, remM, remN) {\n    if (idx === strs.length) return 0;\n    const key = idx + ',' + remM + ',' + remN;\n    if (memo.has(key)) return memo.get(key);\n    let notTake = dfs(idx + 1, remM, remN);\n    let zeros = 0, ones = 0;\n    for (const c of strs[idx]) (c === '0') ? zeros++ : ones++;\n    let take = 0;\n    if (remM >= zeros && remN >= ones) {\n      take = 1 + dfs(idx + 1, remM - zeros, remN - ones);\n    }\n    const res = Math.max(take, notTake);\n    memo.set(key, res);\n    return res;\n  }\n  return dfs(0, m, n);\n}`,
      suboptimalTimeComplexity: "O(L * m * n)",
      suboptimalSpaceComplexity: "O(L * m * n)",
      commonMistakes: ["Iterating i and j forward in 2D array, which erroneously reuses the same string multiple times."],
      hints: [
        "This is a 2D Knapsack problem with two simultaneous weight dimensions (zeros and ones).",
        "Traverse i from m down to zeros and j from n down to ones."
      ],
      oracleFn: (strs: string[], m: number, n: number) => {
        const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
        for (const s of strs) {
          let zeros = 0, ones = 0;
          for (const c of s) {
            if (c === '0') zeros++;
            else ones++;
          }
          for (let i = m; i >= zeros; i--) {
            for (let j = n; j >= ones; j--) {
              dp[i][j] = Math.max(dp[i][j], dp[i - zeros][j - ones] + 1);
            }
          }
        }
        return dp[m][n];
      },
      testCases: {
        functional: [
          [["10", "0001", "111001", "1", "0"], 5, 3],
          [["10", "0", "1"], 1, 1],
          [["111", "1000", "1000"], 9, 3],
          [["0"], 1, 0]
        ],
        boundary: [
          [["1"], 0, 1],
          [["00", "11"], 1, 1],
          [["01"], 1, 1]
        ],
        adversarial: [
          [["10", "0001", "111001", "1", "0"], 4, 3],
          [["11", "11", "00", "00"], 2, 2],
          [["111", "000"], 2, 2]
        ],
        stress: [
          [Array.from({ length: 40 }, (_, i) => (i % 2 === 0 ? "10" : "01")), 15, 15],
          [Array.from({ length: 60 }, (_, i) => (i % 3 === 0 ? "00" : "11")), 20, 20]
        ]
      }
    }),

    // 393. Burst Balloons
    createProblem({
      num: 393,
      title: "Burst Balloons",
      slug: "burst-balloons",
      level: 18,
      difficulty: "HARD",
      topic: "2D Dynamic Programming",
      patternSlug: "dp-2d-strings",
      estimatedTimeMin: 30,
      statement: "You are given `n` balloons, indexed from `0` to `n - 1`. Each balloon is painted with a number on it represented by an array `nums`. You are asked to burst all the balloons.\n\nIf you burst the `i-th` balloon, you will get `nums[i - 1] * nums[i] * nums[i + 1]` coins. If `i - 1` or `i + 1` goes out of bounds of the array, then treat it as if there is a balloon with a `1` painted on it.\n\nReturn the maximum coins you can collect by bursting the balloons wisely.",
      functionName: "maxCoins",
      parameters: [{ name: "nums", type: "number[]", description: "Array of balloon numbers" }],
      returnType: "number",
      constraints: ["n == nums.length", "1 <= n <= 300", "0 <= nums[i] <= 100"],
      examples: [
        { input: "nums = [3,1,5,8]", output: "167", explanation: "Burst 1: 3*1*5 = 15. Burst 5: 3*5*8 = 120. Burst 3: 1*3*8 = 24. Burst 8: 1*8*1 = 8. Total = 167." },
        { input: "nums = [1,5]", output: "10", explanation: "Burst 1: 1*1*5 = 5. Burst 5: 1*5*1 = 5. Total 10." },
        { input: "nums = [7]", output: "7", explanation: "Only one balloon: 1 * 7 * 1 = 7." },
        { input: "nums = [9,76,64]", output: "44440", explanation: "Optimal bursting sequence collects 44440 coins." }
      ],
      optimalSolution: `function maxCoins(nums) {\n  const vals = [1, ...nums, 1];\n  const n = vals.length;\n  const dp = Array.from({ length: n }, () => new Array(n).fill(0));\n  for (let len = 2; len < n; len++) {\n    for (let left = 0; left < n - len; left++) {\n      const right = left + len;\n      for (let k = left + 1; k < right; k++) {\n        const coins = vals[left] * vals[k] * vals[right] + dp[left][k] + dp[k][right];\n        dp[left][right] = Math.max(dp[left][right], coins);\n      }\n    }\n  }\n  return dp[0][n - 1];\n}`,
      optimalTimeComplexity: "O(N^3)",
      optimalSpaceComplexity: "O(N^2)",
      suboptimalSolution: `function maxCoins(nums) {\n  const vals = [1, ...nums, 1];\n  const n = vals.length;\n  const memo = Array.from({ length: n }, () => new Array(n).fill(-1));\n  function dfs(left, right) {\n    if (left + 1 >= right) return 0;\n    if (memo[left][right] !== -1) return memo[left][right];\n    let maxGain = 0;\n    for (let k = left + 1; k < right; k++) {\n      const gain = vals[left] * vals[k] * vals[right] + dfs(left, k) + dfs(k, right);\n      if (gain > maxGain) maxGain = gain;\n    }\n    return memo[left][right] = maxGain;\n  }\n  return dfs(0, n - 1);\n}`,
      suboptimalTimeComplexity: "O(N^3)",
      suboptimalSpaceComplexity: "O(N^2)",
      commonMistakes: ["Thinking of which balloon to burst FIRST (which destroys independence of adjacent balloons) instead of which to burst LAST."],
      hints: [
        "Invert your thinking: instead of choosing which balloon bursts first, choose which balloon k bursts LAST in interval (left, right).",
        "When balloon k is the last to burst in (left, right), its adjacent balloons are fixed: vals[left] and vals[right]!"
      ],
      oracleFn: (nums: number[]) => {
        const vals = [1, ...nums, 1];
        const n = vals.length;
        const dp = Array.from({ length: n }, () => new Array(n).fill(0));
        for (let len = 2; len < n; len++) {
          for (let left = 0; left < n - len; left++) {
            const right = left + len;
            for (let k = left + 1; k < right; k++) {
              const coins = vals[left] * vals[k] * vals[right] + dp[left][k] + dp[k][right];
              dp[left][right] = Math.max(dp[left][right], coins);
            }
          }
        }
        return dp[0][n - 1];
      },
      testCases: {
        functional: [
          [[3, 1, 5, 8]],
          [[1, 5]],
          [[7]],
          [[9, 76, 64]]
        ],
        boundary: [
          [[0]],
          [[100]],
          [[1, 2, 3]]
        ],
        adversarial: [
          [[8, 2, 6, 8, 9, 8, 1, 4, 1, 5]],
          [[1, 1, 1, 1]],
          [[35, 16, 83, 87, 84]]
        ],
        stress: [
          [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]],
          [[10, 20, 30, 40, 50, 60, 70, 80]]
        ]
      }
    })
  ];

  return {
    level: 18,
    levelTitle: "Level 18 — Dynamic Programming II: 2D & Strings",
    topic: "Grid Paths, String Edit Distance, Regex & Wildcards, and Interval Dynamic Programming",
    problems
  };
}
