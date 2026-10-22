import { LevelPayload, GeneratedProblem } from './types';
import { createProblem } from './problemBuilder';

export function getLevel17Payload(): LevelPayload {
  const problems: GeneratedProblem[] = [
    // 356. Climbing Stairs
    createProblem({
      num: 356,
      title: "Climbing Stairs",
      slug: "climbing-stairs",
      level: 17,
      difficulty: "EASY",
      topic: "1D Dynamic Programming",
      patternSlug: "dp-1d",
      estimatedTimeMin: 15,
      statement: "You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?",
      functionName: "climbStairs",
      parameters: [{ name: "n", type: "number", description: "Number of steps to the top" }],
      returnType: "number",
      constraints: ["1 <= n <= 45"],
      examples: [
        { input: "n = 2", output: "2", explanation: "There are two ways: (1 step + 1 step) or (2 steps)." },
        { input: "n = 3", output: "3", explanation: "Three ways: (1 + 1 + 1), (1 + 2), or (2 + 1)." },
        { input: "n = 4", output: "5", explanation: "Ways: 1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2." },
        { input: "n = 1", output: "1", explanation: "Only one way to climb 1 step." }
      ],
      optimalSolution: `function climbStairs(n) {\n  if (n <= 2) return n;\n  let prev2 = 1, prev1 = 2;\n  for (let i = 3; i <= n; i++) {\n    const curr = prev1 + prev2;\n    prev2 = prev1;\n    prev1 = curr;\n  }\n  return prev1;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function climbStairs(n) {\n  const dp = new Array(n + 1).fill(0);\n  dp[0] = 1;\n  dp[1] = 1;\n  for (let i = 2; i <= n; i++) {\n    dp[i] = dp[i - 1] + dp[i - 2];\n  }\n  return dp[n];\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Using raw recursion without memoization leading to O(2^N) time limit exceeded.", "Off-by-one indexing on base cases."],
      hints: [
        "To reach step n, you must arrive from either step n - 1 or step n - 2.",
        "dp[n] = dp[n - 1] + dp[n - 2], which is the Fibonacci sequence."
      ],
      oracleFn: (n: number) => {
        if (n <= 2) return n;
        let a = 1, b = 2;
        for (let i = 3; i <= n; i++) {
          const c = a + b;
          a = b;
          b = c;
        }
        return b;
      },
      testCases: {
        functional: [
          [2],
          [3],
          [5],
          [6]
        ],
        boundary: [
          [1],
          [4],
          [7]
        ],
        adversarial: [
          [8],
          [10],
          [12]
        ],
        stress: [
          [30],
          [40],
          [45]
        ]
      }
    }),

    // 357. Min Cost Climbing Stairs
    createProblem({
      num: 357,
      title: "Min Cost Climbing Stairs",
      slug: "min-cost-climbing-stairs",
      level: 17,
      difficulty: "EASY",
      topic: "1D Dynamic Programming",
      patternSlug: "dp-1d",
      estimatedTimeMin: 15,
      statement: "You are given an integer array `cost` where `cost[i]` is the cost of `i-th` step on a staircase. Once you pay the cost, you can either climb one or two steps.\n\nYou can either start from the step with index `0`, or the step with index `1`.\n\nReturn the minimum cost to reach the top of the floor.",
      functionName: "minCostClimbingStairs",
      parameters: [{ name: "cost", type: "number[]", description: "Array of costs for each step" }],
      returnType: "number",
      constraints: ["2 <= cost.length <= 1000", "0 <= cost[i] <= 999"],
      examples: [
        { input: "cost = [10,15,20]", output: "15", explanation: "Start at index 1, pay 15 and climb 2 steps to reach the top." },
        { input: "cost = [1,100,1,1,1,100,1,1,100,1]", output: "6", explanation: "Take path stepping only on 1s: index 0 -> 2 -> 4 -> 6 -> 7 -> 9 -> top, total cost 6." },
        { input: "cost = [0,0,0,0]", output: "0", explanation: "All steps cost 0, minimum cost is 0." },
        { input: "cost = [10,20]", output: "10", explanation: "Start at index 0 (pay 10) or index 1 (pay 20). Min is 10." }
      ],
      optimalSolution: `function minCostClimbingStairs(cost) {\n  let prev2 = 0, prev1 = 0;\n  for (let i = 2; i <= cost.length; i++) {\n    const curr = Math.min(prev1 + cost[i - 1], prev2 + cost[i - 2]);\n    prev2 = prev1;\n    prev1 = curr;\n  }\n  return prev1;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function minCostClimbingStairs(cost) {\n  const n = cost.length;\n  const dp = new Array(n + 1).fill(0);\n  for (let i = 2; i <= n; i++) {\n    dp[i] = Math.min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2]);\n  }\n  return dp[n];\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Forgetting that you can start at either index 0 or index 1.", "Reaching step n - 1 instead of top of the floor at index n."],
      hints: [
        "Let dp[i] be the minimum cost to reach step i.",
        "dp[i] = min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2]).",
        "Notice dp[i] only depends on the previous two values, so O(1) space is sufficient."
      ],
      oracleFn: (cost: number[]) => {
        let p2 = 0, p1 = 0;
        for (let i = 2; i <= cost.length; i++) {
          const c = Math.min(p1 + cost[i - 1], p2 + cost[i - 2]);
          p2 = p1;
          p1 = c;
        }
        return p1;
      },
      testCases: {
        functional: [
          [[10, 15, 20]],
          [[1, 100, 1, 1, 1, 100, 1, 1, 100, 1]],
          [[10, 20]],
          [[5, 10, 15, 20]]
        ],
        boundary: [
          [[0, 0]],
          [[0, 0, 0, 0]],
          [[100, 1]]
        ],
        adversarial: [
          [[1, 2, 3, 4, 5, 6, 7, 8]],
          [[50, 1, 50, 1, 50, 1]],
          [[100, 100, 1, 100, 100]]
        ],
        stress: [
          [Array.from({ length: 50 }, (_, i) => (i % 3 === 0 ? 1 : 100))],
          [Array.from({ length: 100 }, (_, i) => i % 5)]
        ]
      }
    }),

    // 358. House Robber
    createProblem({
      num: 358,
      title: "House Robber",
      slug: "house-robber",
      level: 17,
      difficulty: "MEDIUM",
      topic: "1D Dynamic Programming",
      patternSlug: "dp-1d",
      estimatedTimeMin: 20,
      statement: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.\n\nGiven an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.",
      functionName: "rob",
      parameters: [{ name: "nums", type: "number[]", description: "Array of money in each house" }],
      returnType: "number",
      constraints: ["1 <= nums.length <= 100", "0 <= nums[i] <= 400"],
      examples: [
        { input: "nums = [1,2,3,1]", output: "4", explanation: "Rob house 1 (money = 1) and then rob house 3 (money = 3). Total = 1 + 3 = 4." },
        { input: "nums = [2,7,9,3,1]", output: "12", explanation: "Rob house 1 (2), house 3 (9), house 5 (1). Total = 2 + 9 + 1 = 12." },
        { input: "nums = [0]", output: "0", explanation: "Single house with 0 money." },
        { input: "nums = [2,1,1,2]", output: "4", explanation: "Rob house 0 (2) and house 3 (2). Total = 4." }
      ],
      optimalSolution: `function rob(nums) {\n  let robPrev = 0, notRobPrev = 0;\n  for (const num of nums) {\n    const newRob = notRobPrev + num;\n    const newNotRob = Math.max(robPrev, notRobPrev);\n    robPrev = newRob;\n    notRobPrev = newNotRob;\n  }\n  return Math.max(robPrev, notRobPrev);\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function rob(nums) {\n  if (nums.length === 0) return 0;\n  if (nums.length === 1) return nums[0];\n  const dp = new Array(nums.length);\n  dp[0] = nums[0];\n  dp[1] = Math.max(nums[0], nums[1]);\n  for (let i = 2; i < nums.length; i++) {\n    dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);\n  }\n  return dp[nums.length - 1];\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Assuming robbing alternating odd or even houses always gives the optimal sum (e.g. [2, 1, 1, 2] skips two in the middle)."],
      hints: [
        "At each house, you have two choices: rob it (which means you couldn't have robbed house i - 1), or skip it.",
        "dp[i] = max(dp[i - 1], dp[i - 2] + nums[i])."
      ],
      oracleFn: (nums: number[]) => {
        let r = 0, nr = 0;
        for (const x of nums) {
          const nextR = nr + x;
          const nextNr = Math.max(r, nr);
          r = nextR;
          nr = nextNr;
        }
        return Math.max(r, nr);
      },
      testCases: {
        functional: [
          [[1, 2, 3, 1]],
          [[2, 7, 9, 3, 1]],
          [[2, 1, 1, 2]],
          [[5, 1, 2, 10, 6, 2]]
        ],
        boundary: [
          [[0]],
          [[100]],
          [[0, 0, 0, 0]]
        ],
        adversarial: [
          [[10, 1, 1, 10]],
          [[1, 100, 1, 100, 1]],
          [[5, 3, 4, 11, 2]]
        ],
        stress: [
          [Array.from({ length: 50 }, (_, i) => (i % 2 === 0 ? 10 : 1))],
          [Array.from({ length: 80 }, (_, i) => (i * 7) % 50)]
        ]
      }
    }),

    // 359. House Robber II
    createProblem({
      num: 359,
      title: "House Robber II",
      slug: "house-robber-ii",
      level: 17,
      difficulty: "MEDIUM",
      topic: "1D Dynamic Programming",
      patternSlug: "dp-1d",
      estimatedTimeMin: 25,
      statement: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses at this place are arranged in a circle. That means the first house is the neighbor of the last one.\n\nMeanwhile, adjacent houses have a security system connected, and it will automatically contact the police if two adjacent houses were broken into on the same night.\n\nGiven an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.",
      functionName: "rob",
      parameters: [{ name: "nums", type: "number[]", description: "Array of money in circular houses" }],
      returnType: "number",
      constraints: ["1 <= nums.length <= 100", "0 <= nums[i] <= 1000"],
      examples: [
        { input: "nums = [2,3,2]", output: "3", explanation: "You cannot rob house 1 (2) and house 3 (2) because they are adjacent in a circle." },
        { input: "nums = [1,2,3,1]", output: "4", explanation: "Rob house 1 (1) and house 3 (3), total 4." },
        { input: "nums = [1,2,3]", output: "3", explanation: "Max money is house 3 alone." },
        { input: "nums = [5]", output: "5", explanation: "Only one house, rob it directly." }
      ],
      optimalSolution: `function rob(nums) {\n  if (nums.length === 1) return nums[0];\n  function robRange(start, end) {\n    let p2 = 0, p1 = 0;\n    for (let i = start; i <= end; i++) {\n      const c = Math.max(p1, p2 + nums[i]);\n      p2 = p1;\n      p1 = c;\n    }\n    return p1;\n  }\n  return Math.max(robRange(0, nums.length - 2), robRange(1, nums.length - 1));\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function rob(nums) {\n  if (nums.length === 1) return nums[0];\n  const n = nums.length;\n  const dp1 = new Array(n).fill(0);\n  dp1[0] = nums[0];\n  dp1[1] = Math.max(nums[0], nums[1]);\n  for (let i = 2; i < n - 1; i++) dp1[i] = Math.max(dp1[i - 1], dp1[i - 2] + nums[i]);\n  const dp2 = new Array(n).fill(0);\n  dp2[1] = nums[1];\n  dp2[2] = Math.max(nums[1], nums[2]);\n  for (let i = 3; i < n; i++) dp2[i] = Math.max(dp2[i - 1], dp2[i - 2] + nums[i]);\n  return Math.max(dp1[n - 2], dp2[n - 1]);\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Failing to handle nums.length === 1 separately.", "Robbing both index 0 and index n - 1."],
      hints: [
        "Since house 0 and house n - 1 are adjacent, you cannot rob both.",
        "Break into two independent linear subproblems: rob(0 ... n - 2) and rob(1 ... n - 1)."
      ],
      oracleFn: (nums: number[]) => {
        if (nums.length === 1) return nums[0];
        const robRange = (start: number, end: number) => {
          let p2 = 0, p1 = 0;
          for (let i = start; i <= end; i++) {
            const c = Math.max(p1, p2 + nums[i]);
            p2 = p1;
            p1 = c;
          }
          return p1;
        };
        return Math.max(robRange(0, nums.length - 2), robRange(1, nums.length - 1));
      },
      testCases: {
        functional: [
          [[2, 3, 2]],
          [[1, 2, 3, 1]],
          [[1, 2, 3]],
          [[1, 3, 1, 3, 100]]
        ],
        boundary: [
          [[5]],
          [[1, 2]],
          [[0, 0, 0]]
        ],
        adversarial: [
          [[200, 3, 140, 20, 10]],
          [[1, 1, 1, 1, 1, 1]],
          [[10, 1, 1, 10]]
        ],
        stress: [
          [Array.from({ length: 60 }, (_, i) => (i % 2 === 0 ? 50 : 5))],
          [Array.from({ length: 100 }, (_, i) => i * 3)]
        ]
      }
    }),

    // 360. Delete and Earn
    createProblem({
      num: 360,
      title: "Delete and Earn",
      slug: "delete-and-earn",
      level: 17,
      difficulty: "MEDIUM",
      topic: "1D Dynamic Programming",
      patternSlug: "dp-1d",
      estimatedTimeMin: 20,
      statement: "You are given an integer array `nums`. You want to maximize the number of points you get by performing the following operation any number of times:\n\nPick any `nums[i]` and delete it to earn `nums[i]` points. Afterwards, you must delete every element equal to `nums[i] - 1` and every element equal to `nums[i] + 1`.\n\nReturn the maximum number of points you can earn.",
      functionName: "deleteAndEarn",
      parameters: [{ name: "nums", type: "number[]", description: "Array of integers" }],
      returnType: "number",
      constraints: ["1 <= nums.length <= 2 * 10^4", "1 <= nums[i] <= 10^4"],
      examples: [
        { input: "nums = [3,4,2]", output: "6", explanation: "Delete 4 to earn 4 points (3 is deleted). Then delete 2 to earn 2 points. Total 6." },
        { input: "nums = [2,2,3,3,3,4]", output: "9", explanation: "Delete 3 to earn 3*3 = 9 points (deleting all 2s and 4s). Total 9." },
        { input: "nums = [1]", output: "1", explanation: "Earn 1 point directly." },
        { input: "nums = [1,1,1,2,4,5,5,5,6]", output: "18", explanation: "Delete 1s (3), 5s (15), total 18 points." }
      ],
      optimalSolution: `function deleteAndEarn(nums) {\n  let maxVal = 0;\n  for (const x of nums) if (x > maxVal) maxVal = x;\n  const sums = new Array(maxVal + 1).fill(0);\n  for (const x of nums) sums[x] += x;\n  let p2 = 0, p1 = 0;\n  for (let i = 0; i <= maxVal; i++) {\n    const curr = Math.max(p1, p2 + sums[i]);\n    p2 = p1;\n    p1 = curr;\n  }\n  return p1;\n}`,
      optimalTimeComplexity: "O(N + max(nums))",
      optimalSpaceComplexity: "O(max(nums))",
      suboptimalSolution: `function deleteAndEarn(nums) {\n  const count = new Map();\n  for (const x of nums) count.set(x, (count.get(x) || 0) + 1);\n  const unique = Array.from(count.keys()).sort((a, b) => a - b);\n  const dp = new Array(unique.length).fill(0);\n  dp[0] = unique[0] * count.get(unique[0]);\n  for (let i = 1; i < unique.length; i++) {\n    const val = unique[i] * count.get(unique[i]);\n    if (unique[i] === unique[i - 1] + 1) {\n      dp[i] = Math.max(dp[i - 1], (i >= 2 ? dp[i - 2] : 0) + val);\n    } else {\n      dp[i] = dp[i - 1] + val;\n    }\n  }\n  return dp[dp.length - 1];\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Not noticing that picking a number lets you take all instances of that number without additional penalty.", "Missing the mapping to House Robber."],
      hints: [
        "If you decide to take value x, you can take ALL copies of x for a total of x * count[x].",
        "Taking x prohibits taking x - 1 and x + 1. This is exactly House Robber on the value frequency array!"
      ],
      oracleFn: (nums: number[]) => {
        let maxVal = 0;
        for (const x of nums) if (x > maxVal) maxVal = x;
        const sums = new Array(maxVal + 1).fill(0);
        for (const x of nums) sums[x] += x;
        let p2 = 0, p1 = 0;
        for (let i = 0; i <= maxVal; i++) {
          const curr = Math.max(p1, p2 + sums[i]);
          p2 = p1;
          p1 = curr;
        }
        return p1;
      },
      testCases: {
        functional: [
          [[3, 4, 2]],
          [[2, 2, 3, 3, 3, 4]],
          [[1, 1, 1, 2, 4, 5, 5, 5, 6]],
          [[8, 10, 4, 9, 1, 3, 5, 9, 4, 10]]
        ],
        boundary: [
          [[1]],
          [[1000, 1000]],
          [[2, 3]]
        ],
        adversarial: [
          [[1, 2, 3, 4, 5, 6, 7]],
          [[10, 10, 9, 9, 8, 8]],
          [[3, 1]]
        ],
        stress: [
          [Array.from({ length: 200 }, (_, i) => (i % 20) + 1)],
          [Array.from({ length: 300 }, (_, i) => (i * 3) % 50 + 1)]
        ]
      }
    }),

    // 361. Decode Ways
    createProblem({
      num: 361,
      title: "Decode Ways",
      slug: "decode-ways",
      level: 17,
      difficulty: "MEDIUM",
      topic: "1D Dynamic Programming",
      patternSlug: "dp-1d",
      estimatedTimeMin: 25,
      statement: "A message containing letters from A-Z can be encoded into numbers using the following mapping:\n'A' -> \"1\", 'B' -> \"2\", ... 'Z' -> \"26\"\n\nTo decode an encoded message, all the digits must be grouped then mapped back into letters using the reverse of the mapping above (there may be multiple ways).\n\nFor example, \"11106\" can be mapped into \"AAJF\" with the grouping (1 1 10 6) or \"KJF\" with the grouping (11 10 6). Note that the grouping (1 11 06) is invalid because \"06\" cannot be mapped into 'F' since \"6\" is different from \"06\".\n\nGiven a string `s` containing only digits, return the number of ways to decode it.",
      functionName: "numDecodings",
      parameters: [{ name: "s", type: "string", description: "Digit string to decode" }],
      returnType: "number",
      constraints: ["1 <= s.length <= 100", "s contains only digits and may contain leading zero(s)."],
      examples: [
        { input: "s = \"12\"", output: "2", explanation: "\"12\" could be decoded as \"AB\" (1 2) or \"L\" (12)." },
        { input: "s = \"226\"", output: "3", explanation: "\"226\" could be decoded as \"BZ\" (2 26), \"VF\" (22 6), or \"BBF\" (2 2 6)." },
        { input: "s = \"06\"", output: "0", explanation: "\"06\" cannot be mapped to 'F' because of the leading zero." },
        { input: "s = \"10\"", output: "1", explanation: "\"10\" maps uniquely to \"J\"." }
      ],
      optimalSolution: `function numDecodings(s) {\n  if (!s || s[0] === '0') return 0;\n  let prev2 = 1, prev1 = 1;\n  for (let i = 1; i < s.length; i++) {\n    let curr = 0;\n    const oneDigit = Number(s[i]);\n    const twoDigits = Number(s.slice(i - 1, i + 1));\n    if (oneDigit >= 1) curr += prev1;\n    if (twoDigits >= 10 && twoDigits <= 26) curr += prev2;\n    prev2 = prev1;\n    prev1 = curr;\n  }\n  return prev1;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function numDecodings(s) {\n  if (!s || s[0] === '0') return 0;\n  const dp = new Array(s.length + 1).fill(0);\n  dp[0] = 1;\n  dp[1] = 1;\n  for (let i = 2; i <= s.length; i++) {\n    const one = parseInt(s.substring(i - 1, i), 10);\n    const two = parseInt(s.substring(i - 2, i), 10);\n    if (one >= 1) dp[i] += dp[i - 1];\n    if (two >= 10 && two <= 26) dp[i] += dp[i - 2];\n  }\n  return dp[s.length];\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Failing to handle '0' characters (e.g. '06' -> 0, '10' -> 1, '30' -> 0).", "Index alignment when reading single digit vs two digits."],
      hints: [
        "A single digit is valid if it is between '1' and '9'.",
        "A two-digit substring is valid if it is between '10' and '26'.",
        "If s[i] is '0', it cannot form a single digit character; it must pair with s[i-1]."
      ],
      oracleFn: (s: string) => {
        if (!s || s[0] === '0') return 0;
        let p2 = 1, p1 = 1;
        for (let i = 1; i < s.length; i++) {
          let curr = 0;
          const one = Number(s[i]);
          const two = Number(s.slice(i - 1, i + 1));
          if (one >= 1) curr += p1;
          if (two >= 10 && two <= 26) curr += p2;
          p2 = p1;
          p1 = curr;
        }
        return p1;
      },
      testCases: {
        functional: [
          ["12"],
          ["226"],
          ["10"],
          ["2101"]
        ],
        boundary: [
          ["0"],
          ["06"],
          ["7"],
          ["27"]
        ],
        adversarial: [
          ["10011"],
          ["301"],
          ["2611055"],
          ["111111"]
        ],
        stress: [
          ["11111111111111111111"],
          ["2626262626262626"]
        ]
      }
    }),

    // 362. Coin Change
    createProblem({
      num: 362,
      title: "Coin Change",
      slug: "coin-change",
      level: 17,
      difficulty: "MEDIUM",
      topic: "1D Dynamic Programming",
      patternSlug: "dp-1d",
      estimatedTimeMin: 25,
      statement: "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.\n\nYou may assume that you have an infinite number of each kind of coin.",
      functionName: "coinChange",
      parameters: [
        { name: "coins", type: "number[]", description: "Coin denominations" },
        { name: "amount", type: "number", description: "Target total amount" }
      ],
      returnType: "number",
      constraints: ["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"],
      examples: [
        { input: "coins = [1,2,5], amount = 11", output: "3", explanation: "11 = 5 + 5 + 1 (3 coins)." },
        { input: "coins = [2], amount = 3", output: "-1", explanation: "Amount 3 cannot be made with only 2-cent coins." },
        { input: "coins = [1], amount = 0", output: "0", explanation: "0 coins needed to make 0 amount." },
        { input: "coins = [2,5,10,1], amount = 27", output: "4", explanation: "27 = 10 + 10 + 5 + 2 (4 coins)." }
      ],
      optimalSolution: `function coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++) {\n    for (const c of coins) {\n      if (i - c >= 0 && dp[i - c] !== Infinity) {\n        dp[i] = Math.min(dp[i], dp[i - c] + 1);\n      }\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}`,
      optimalTimeComplexity: "O(amount * coins.length)",
      optimalSpaceComplexity: "O(amount)",
      suboptimalSolution: `function coinChange(coins, amount) {\n  const memo = new Map();\n  function dfs(rem) {\n    if (rem === 0) return 0;\n    if (rem < 0) return -1;\n    if (memo.has(rem)) return memo.get(rem);\n    let minCoins = Infinity;\n    for (const c of coins) {\n      const res = dfs(rem - c);\n      if (res >= 0) minCoins = Math.min(minCoins, res + 1);\n    }\n    const ans = minCoins === Infinity ? -1 : minCoins;\n    memo.set(rem, ans);\n    return ans;\n  }\n  return dfs(amount);\n}`,
      suboptimalTimeComplexity: "O(amount * coins.length)",
      suboptimalSpaceComplexity: "O(amount)",
      commonMistakes: ["Using a greedy approach (taking the largest coin first doesn't work, e.g. coins [1, 3, 4] for amount 6: greedy gives 4+1+1=3, optimal is 3+3=2)."],
      hints: [
        "Greedy fails on canonical counterexamples like coins=[1,3,4] with amount=6.",
        "Bottom-up DP: dp[i] = min(dp[i - c] + 1) for each coin c <= i."
      ],
      oracleFn: (coins: number[], amount: number) => {
        const dp = new Array(amount + 1).fill(Infinity);
        dp[0] = 0;
        for (let i = 1; i <= amount; i++) {
          for (const c of coins) {
            if (i - c >= 0 && dp[i - c] !== Infinity) {
              dp[i] = Math.min(dp[i], dp[i - c] + 1);
            }
          }
        }
        return dp[amount] === Infinity ? -1 : dp[amount];
      },
      testCases: {
        functional: [
          [[1, 2, 5], 11],
          [[2], 3],
          [[1], 0],
          [[1, 3, 4], 6]
        ],
        boundary: [
          [[1], 1],
          [[1], 2],
          [[2, 5], 1]
        ],
        adversarial: [
          [[186, 419, 83, 408], 6249],
          [[2, 4, 6, 8], 15],
          [[3, 7], 11]
        ],
        stress: [
          [[1, 2, 5, 10, 20, 50], 1000],
          [[7, 11, 13, 17], 500]
        ]
      }
    }),

    // 363. Coin Change II
    createProblem({
      num: 363,
      title: "Coin Change II",
      slug: "coin-change-ii",
      level: 17,
      difficulty: "MEDIUM",
      topic: "1D Dynamic Programming",
      patternSlug: "dp-1d",
      estimatedTimeMin: 25,
      statement: "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the number of combinations that make up that amount. If that amount of money cannot be made up by any combination of the coins, return `0`.\n\nYou may assume that you have an infinite number of each kind of coin.\n\nThe answer is guaranteed to fit into a signed 32-bit integer.",
      functionName: "change",
      parameters: [
        { name: "amount", type: "number", description: "Target total amount" },
        { name: "coins", type: "number[]", description: "Coin denominations" }
      ],
      returnType: "number",
      constraints: ["1 <= coins.length <= 300", "1 <= coins[i] <= 5000", "All values of coins are unique", "0 <= amount <= 5000"],
      examples: [
        { input: "amount = 5, coins = [1,2,5]", output: "4", explanation: "Four combinations: 5=5, 5=2+2+1, 5=2+1+1+1, 5=1+1+1+1+1." },
        { input: "amount = 3, coins = [2]", output: "0", explanation: "Amount 3 cannot be made with 2-cent coins." },
        { input: "amount = 10, coins = [10]", output: "1", explanation: "Only one way: 10." },
        { input: "amount = 0, coins = [7]", output: "1", explanation: "Only one combination (choose no coins) to make 0." }
      ],
      optimalSolution: `function change(amount, coins) {\n  const dp = new Array(amount + 1).fill(0);\n  dp[0] = 1;\n  for (const c of coins) {\n    for (let i = c; i <= amount; i++) {\n      dp[i] += dp[i - c];\n    }\n  }\n  return dp[amount];\n}`,
      optimalTimeComplexity: "O(amount * coins.length)",
      optimalSpaceComplexity: "O(amount)",
      suboptimalSolution: `function change(amount, coins) {\n  const n = coins.length;\n  const dp = Array.from({ length: n + 1 }, () => new Array(amount + 1).fill(0));\n  for (let i = 0; i <= n; i++) dp[i][0] = 1;\n  for (let i = 1; i <= n; i++) {\n    for (let j = 1; j <= amount; j++) {\n      dp[i][j] = dp[i - 1][j];\n      if (j >= coins[i - 1]) dp[i][j] += dp[i][j - coins[i - 1]];\n    }\n  }\n  return dp[n][amount];\n}`,
      suboptimalTimeComplexity: "O(amount * coins.length)",
      suboptimalSpaceComplexity: "O(amount * coins.length)",
      commonMistakes: ["Looping over amount in outer loop and coins in inner loop (this counts permutations instead of combinations)."],
      hints: [
        "Order matters! To count combinations (not permutations), iterate through coins in the OUTER loop and amount in the INNER loop.",
        "dp[i] represents the number of ways to form amount i using coins processed so far."
      ],
      oracleFn: (amount: number, coins: number[]) => {
        const dp = new Array(amount + 1).fill(0);
        dp[0] = 1;
        for (const c of coins) {
          for (let i = c; i <= amount; i++) {
            dp[i] += dp[i - c];
          }
        }
        return dp[amount];
      },
      testCases: {
        functional: [
          [5, [1, 2, 5]],
          [3, [2]],
          [10, [10]],
          [0, [7]]
        ],
        boundary: [
          [1, [1]],
          [2, [1, 2]],
          [4, [5]]
        ],
        adversarial: [
          [100, [1, 2, 5]],
          [50, [2, 3, 5]],
          [7, [2, 4]]
        ],
        stress: [
          [500, [1, 5, 10, 25]],
          [1000, [1, 2, 5]]
        ]
      }
    }),

    // 364. Perfect Squares
    createProblem({
      num: 364,
      title: "Perfect Squares",
      slug: "perfect-squares",
      level: 17,
      difficulty: "MEDIUM",
      topic: "1D Dynamic Programming",
      patternSlug: "dp-1d",
      estimatedTimeMin: 20,
      statement: "Given an integer `n`, return the least number of perfect square numbers that sum to `n`.\n\nA perfect square is an integer that is the square of an integer; in other words, it is the product of some integer with itself. For example, 1, 4, 9, and 16 are perfect squares while 3 and 11 are not.",
      functionName: "numSquares",
      parameters: [{ name: "n", type: "number", description: "Target integer" }],
      returnType: "number",
      constraints: ["1 <= n <= 10^4"],
      examples: [
        { input: "n = 12", output: "3", explanation: "12 = 4 + 4 + 4 (3 squares)." },
        { input: "n = 13", output: "2", explanation: "13 = 4 + 9 (2 squares)." },
        { input: "n = 1", output: "1", explanation: "1 = 1^2." },
        { input: "n = 16", output: "1", explanation: "16 is itself a perfect square." }
      ],
      optimalSolution: `function numSquares(n) {\n  const dp = new Array(n + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= n; i++) {\n    for (let j = 1; j * j <= i; j++) {\n      dp[i] = Math.min(dp[i], dp[i - j * j] + 1);\n    }\n  }\n  return dp[n];\n}`,
      optimalTimeComplexity: "O(N * sqrt(N))",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function numSquares(n) {\n  const queue = [n];\n  const visited = new Set([n]);\n  let level = 0;\n  while (queue.length > 0) {\n    level++;\n    const size = queue.length;\n    for (let k = 0; k < size; k++) {\n      const curr = queue.shift();\n      for (let j = 1; j * j <= curr; j++) {\n        const next = curr - j * j;\n        if (next === 0) return level;\n        if (!visited.has(next)) {\n          visited.add(next);\n          queue.push(next);\n        }\n      }\n    }\n  }\n  return level;\n}`,
      suboptimalTimeComplexity: "O(N * sqrt(N))",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Trying greedy by always subtracting the largest possible square (fails e.g. 12: 9+1+1+1 = 4, but 4+4+4 = 3)."],
      hints: [
        "Lagrange's Four-Square Theorem proves the answer is always at most 4.",
        "Use dynamic programming: dp[i] = min(dp[i - j*j] + 1) for all j*j <= i."
      ],
      oracleFn: (n: number) => {
        const dp = new Array(n + 1).fill(Infinity);
        dp[0] = 0;
        for (let i = 1; i <= n; i++) {
          for (let j = 1; j * j <= i; j++) {
            dp[i] = Math.min(dp[i], dp[i - j * j] + 1);
          }
        }
        return dp[n];
      },
      testCases: {
        functional: [
          [12],
          [13],
          [1],
          [16]
        ],
        boundary: [
          [2],
          [3],
          [4]
        ],
        adversarial: [
          [43],
          [71],
          [99]
        ],
        stress: [
          [768],
          [1000],
          [5000]
        ]
      }
    }),

    // 365. Word Break
    createProblem({
      num: 365,
      title: "Word Break",
      slug: "word-break",
      level: 17,
      difficulty: "MEDIUM",
      topic: "1D Dynamic Programming",
      patternSlug: "dp-1d",
      estimatedTimeMin: 20,
      statement: "Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.\n\nNote that the same word in the dictionary may be reused multiple times in the segmentation.",
      functionName: "wordBreak",
      parameters: [
        { name: "s", type: "string", description: "Target string" },
        { name: "wordDict", type: "string[]", description: "Dictionary of permitted words" }
      ],
      returnType: "boolean",
      constraints: ["1 <= s.length <= 300", "1 <= wordDict.length <= 1000", "1 <= wordDict[i].length <= 20", "s and wordDict[i] consist of only lowercase English letters.", "All the strings of wordDict are unique."],
      examples: [
        { input: "s = \"leetcode\", wordDict = [\"leet\",\"code\"]", output: "true", explanation: "Return true because \"leetcode\" can be segmented as \"leet code\"." },
        { input: "s = \"applepenapple\", wordDict = [\"apple\",\"pen\"]", output: "true", explanation: "Return true because \"applepenapple\" can be segmented as \"apple pen apple\"." },
        { input: "s = \"catsandog\", wordDict = [\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]", output: "false", explanation: "No valid segmentation exists." },
        { input: "s = \"a\", wordDict = [\"b\"]", output: "false", explanation: "\"a\" is not in wordDict." }
      ],
      optimalSolution: `function wordBreak(s, wordDict) {\n  const wordSet = new Set(wordDict);\n  const dp = new Array(s.length + 1).fill(false);\n  dp[0] = true;\n  for (let i = 1; i <= s.length; i++) {\n    for (let j = 0; j < i; j++) {\n      if (dp[j] && wordSet.has(s.substring(j, i))) {\n        dp[i] = true;\n        break;\n      }\n    }\n  }\n  return dp[s.length];\n}`,
      optimalTimeComplexity: "O(N^2 * L) where L is max word length",
      optimalSpaceComplexity: "O(N + total wordDict size)",
      suboptimalSolution: `function wordBreak(s, wordDict) {\n  const wordSet = new Set(wordDict);\n  const memo = new Map();\n  function dfs(idx) {\n    if (idx === s.length) return true;\n    if (memo.has(idx)) return memo.get(idx);\n    for (let end = idx + 1; end <= s.length; end++) {\n      if (wordSet.has(s.slice(idx, end)) && dfs(end)) {\n        memo.set(idx, true);\n        return true;\n      }\n    }\n    memo.set(idx, false);\n    return false;\n  }\n  return dfs(0);\n}`,
      suboptimalTimeComplexity: "O(N^2 * L)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Naive recursion without memoization leading to exponential O(2^N) time.", "Re-checking long substring slices when max dictionary word length is small."],
      hints: [
        "Let dp[i] be true if s[0...i-1] can be segmented.",
        "dp[i] = true if there exists some j < i such that dp[j] is true and s[j...i-1] is in wordDict."
      ],
      oracleFn: (s: string, wordDict: string[]) => {
        const wordSet = new Set(wordDict);
        const dp = new Array(s.length + 1).fill(false);
        dp[0] = true;
        for (let i = 1; i <= s.length; i++) {
          for (let j = 0; j < i; j++) {
            if (dp[j] && wordSet.has(s.substring(j, i))) {
              dp[i] = true;
              break;
            }
          }
        }
        return dp[s.length];
      },
      testCases: {
        functional: [
          ["leetcode", ["leet", "code"]],
          ["applepenapple", ["apple", "pen"]],
          ["catsandog", ["cats", "dog", "sand", "and", "cat"]],
          ["cars", ["car", "ca", "rs"]]
        ],
        boundary: [
          ["a", ["a"]],
          ["a", ["b"]],
          ["ab", ["a", "b"]]
        ],
        adversarial: [
          ["aaaaaaa", ["aaaa", "aaa"]],
          ["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab", ["a", "aa", "aaa", "aaaa", "aaaaa", "aaaaaa", "aaaaaaa", "aaaaaaaa", "aaaaaaaaa", "aaaaaaaaaa"]],
          ["goalspecial", ["go", "goal", "goals", "special"]]
        ],
        stress: [
          ["abcdeabcdeabcde", ["abc", "de", "abcde"]],
          ["programmerslife", ["program", "mer", "life", "programmers"]]
        ]
      }
    }),

    // 366. Partition Equal Subset Sum
    createProblem({
      num: 366,
      title: "Partition Equal Subset Sum",
      slug: "partition-equal-subset-sum",
      level: 17,
      difficulty: "MEDIUM",
      topic: "1D Dynamic Programming",
      patternSlug: "dp-1d",
      estimatedTimeMin: 25,
      statement: "Given an integer array `nums`, return `true` if you can partition the array into two subsets such that the sum of the elements in both subsets is equal or `false` otherwise.",
      functionName: "canPartition",
      parameters: [{ name: "nums", type: "number[]", description: "Array of positive integers" }],
      returnType: "boolean",
      constraints: ["1 <= nums.length <= 200", "1 <= nums[i] <= 100"],
      examples: [
        { input: "nums = [1,5,11,5]", output: "true", explanation: "The array can be partitioned as [1, 5, 5] and [11]." },
        { input: "nums = [1,2,3,5]", output: "false", explanation: "The array cannot be partitioned into equal sum subsets." },
        { input: "nums = [2,2]", output: "true", explanation: "Both subsets are [2] and [2]." },
        { input: "nums = [1,2,5]", output: "false", explanation: "Sum is 8, but no subset sums to 4." }
      ],
      optimalSolution: `function canPartition(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  if (total % 2 !== 0) return false;\n  const target = total / 2;\n  const dp = new Array(target + 1).fill(false);\n  dp[0] = true;\n  for (const num of nums) {\n    for (let j = target; j >= num; j--) {\n      dp[j] = dp[j] || dp[j - num];\n    }\n  }\n  return dp[target];\n}`,
      optimalTimeComplexity: "O(N * target)",
      optimalSpaceComplexity: "O(target)",
      suboptimalSolution: `function canPartition(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  if (total % 2 !== 0) return false;\n  const target = total / 2;\n  const memo = new Map();\n  function dfs(i, sum) {\n    if (sum === target) return true;\n    if (sum > target || i === nums.length) return false;\n    const key = i + ',' + sum;\n    if (memo.has(key)) return memo.get(key);\n    const res = dfs(i + 1, sum + nums[i]) || dfs(i + 1, sum);\n    memo.set(key, res);\n    return res;\n  }\n  return dfs(0, 0);\n}`,
      suboptimalTimeComplexity: "O(N * target)",
      suboptimalSpaceComplexity: "O(N * target)",
      commonMistakes: ["Iterating forward in the 1D DP table, which accidentally reuses the same element multiple times (unbounded knapsack).", "Forgetting that odd sums can never be partitioned."],
      hints: [
        "If total sum is odd, equal partition is impossible.",
        "This reduces to the 0/1 Knapsack problem: can we find a subset with sum equal to sum / 2?",
        "Iterate backwards from target down to num to maintain 0/1 semantics in 1D array."
      ],
      oracleFn: (nums: number[]) => {
        const total = nums.reduce((a, b) => a + b, 0);
        if (total % 2 !== 0) return false;
        const target = total / 2;
        const dp = new Array(target + 1).fill(false);
        dp[0] = true;
        for (const num of nums) {
          for (let j = target; j >= num; j--) {
            dp[j] = dp[j] || dp[j - num];
          }
        }
        return dp[target];
      },
      testCases: {
        functional: [
          [[1, 5, 11, 5]],
          [[1, 2, 3, 5]],
          [[2, 2]],
          [[1, 2, 5]]
        ],
        boundary: [
          [[1]],
          [[1, 1]],
          [[1, 2]]
        ],
        adversarial: [
          [[1, 2, 3, 4, 5, 6, 7]],
          [[100, 100, 100, 100]],
          [[1, 1, 1, 1, 1, 1, 1, 1, 1, 9]]
        ],
        stress: [
          [Array.from({ length: 40 }, () => 2)],
          [Array.from({ length: 50 }, (_, i) => (i % 5) + 1)]
        ]
      }
    }),

    // 367. Target Sum
    createProblem({
      num: 367,
      title: "Target Sum",
      slug: "target-sum",
      level: 17,
      difficulty: "MEDIUM",
      topic: "1D Dynamic Programming",
      patternSlug: "dp-1d",
      estimatedTimeMin: 25,
      statement: "You are given an integer array `nums` and an integer `target`.\n\nYou want to build an expression out of nums by adding one of the symbols '+' and '-' before each integer in nums and then concatenate all the integers.\n\nFor example, if nums = [2, 1], you can add a '+' before 2 and a '-' before 1 and concatenate them to build the expression \"+2-1\" = 1.\n\nReturn the number of different expressions that you can build, which evaluates to `target`.",
      functionName: "findTargetSumWays",
      parameters: [
        { name: "nums", type: "number[]", description: "Array of integers" },
        { name: "target", type: "number", description: "Target expression value" }
      ],
      returnType: "number",
      constraints: ["1 <= nums.length <= 20", "0 <= nums[i] <= 1000", "0 <= sum(nums[i]) <= 1000", "-1000 <= target <= 1000"],
      examples: [
        { input: "nums = [1,1,1,1,1], target = 3", output: "5", explanation: "Five ways: -1+1+1+1+1=3, +1-1+1+1+1=3, +1+1-1+1+1=3, +1+1+1-1+1=3, +1+1+1+1-1=3." },
        { input: "nums = [1], target = 1", output: "1", explanation: "+1 = 1." },
        { input: "nums = [1], target = 2", output: "0", explanation: "Impossible to form 2 with single 1." },
        { input: "nums = [0,0,0,0,0,0,0,0,1], target = 1", output: "256", explanation: "Each of the 8 zeros can be either +0 or -0 (2^8 = 256 ways)." }
      ],
      optimalSolution: `function findTargetSumWays(nums, target) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  if ((total + target) % 2 !== 0 || Math.abs(target) > total) return 0;\n  const s1 = (total + target) / 2;\n  const dp = new Array(s1 + 1).fill(0);\n  dp[0] = 1;\n  for (const num of nums) {\n    for (let j = s1; j >= num; j--) {\n      dp[j] += dp[j - num];\n    }\n  }\n  return dp[s1];\n}`,
      optimalTimeComplexity: "O(N * sum)",
      optimalSpaceComplexity: "O(sum)",
      suboptimalSolution: `function findTargetSumWays(nums, target) {\n  let count = 0;\n  function backtrack(idx, currentSum) {\n    if (idx === nums.length) {\n      if (currentSum === target) count++;\n      return;\n    }\n    backtrack(idx + 1, currentSum + nums[idx]);\n    backtrack(idx + 1, currentSum - nums[idx]);\n  }\n  backtrack(0, 0);\n  return count;\n}`,
      suboptimalTimeComplexity: "O(2^N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Forgetting that nums can contain 0s which produce 2^k multiplier.", "Failing when Math.abs(target) > total sum."],
      hints: [
        "Let P be the subset of numbers with '+' and N be the subset with '-'.",
        "sum(P) - sum(N) = target and sum(P) + sum(N) = total.",
        "Adding gives 2 * sum(P) = target + total => sum(P) = (target + total) / 2.",
        "The problem reduces to subset sum: count subsets summing to (target + total) / 2."
      ],
      oracleFn: (nums: number[], target: number) => {
        const total = nums.reduce((a, b) => a + b, 0);
        if ((total + target) % 2 !== 0 || Math.abs(target) > total) return 0;
        const s1 = (total + target) / 2;
        const dp = new Array(s1 + 1).fill(0);
        dp[0] = 1;
        for (const num of nums) {
          for (let j = s1; j >= num; j--) {
            dp[j] += dp[j - num];
          }
        }
        return dp[s1];
      },
      testCases: {
        functional: [
          [[1, 1, 1, 1, 1], 3],
          [[1], 1],
          [[1], 2],
          [[1, 2, 3], 0]
        ],
        boundary: [
          [[0, 0, 0, 0, 0, 0, 0, 0, 1], 1],
          [[100], -100],
          [[0], 0]
        ],
        adversarial: [
          [[1, 2, 7, 9, 981], 10000],
          [[2, 107, 109, 113, 127], 2],
          [[1, 0], 1]
        ],
        stress: [
          [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 0],
          [[1, 2, 1, 2, 1, 2, 1, 2, 1, 2], 5]
        ]
      }
    }),

    // 368. Longest Increasing Subsequence
    createProblem({
      num: 368,
      title: "Longest Increasing Subsequence",
      slug: "longest-increasing-subsequence",
      level: 17,
      difficulty: "MEDIUM",
      topic: "1D Dynamic Programming",
      patternSlug: "dp-1d",
      estimatedTimeMin: 25,
      statement: "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.\n\nA subsequence is an array that can be derived from another array by deleting some or no elements without changing the order of the remaining elements.",
      functionName: "lengthOfLIS",
      parameters: [{ name: "nums", type: "number[]", description: "Integer array" }],
      returnType: "number",
      constraints: ["1 <= nums.length <= 2500", "-10^4 <= nums[i] <= 10^4"],
      examples: [
        { input: "nums = [10,9,2,5,3,7,101,18]", output: "4", explanation: "The longest increasing subsequence is [2, 3, 7, 101], length 4." },
        { input: "nums = [0,1,0,3,2,3]", output: "4", explanation: "One longest increasing subsequence is [0, 1, 2, 3], length 4." },
        { input: "nums = [7,7,7,7,7,7,7]", output: "1", explanation: "All elements are equal, longest strictly increasing subsequence has length 1." },
        { input: "nums = [1,3,6,7,9,4,10,5,6]", output: "6", explanation: "Increasing subsequence [1,3,6,7,9,10] has length 6." }
      ],
      optimalSolution: `function lengthOfLIS(nums) {\n  const tails = [];\n  for (const x of nums) {\n    let left = 0, right = tails.length;\n    while (left < right) {\n      const mid = Math.floor((left + right) / 2);\n      if (tails[mid] < x) left = mid + 1;\n      else right = mid;\n    }\n    if (left === tails.length) tails.push(x);\n    else tails[left] = x;\n  }\n  return tails.length;\n}`,
      optimalTimeComplexity: "O(N log N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function lengthOfLIS(nums) {\n  const dp = new Array(nums.length).fill(1);\n  let maxLen = 1;\n  for (let i = 1; i < nums.length; i++) {\n    for (let j = 0; j < i; j++) {\n      if (nums[j] < nums[i]) {\n        dp[i] = Math.max(dp[i], dp[j] + 1);\n      }\n    }\n    maxLen = Math.max(maxLen, dp[i]);\n  }\n  return maxLen;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Confusing strictly increasing (<) with non-decreasing (<=).", "Assuming tails array itself is the final subsequence (tails stores minimal tail elements)."],
      hints: [
        "O(N^2) dynamic programming is straightforward: dp[i] = max(dp[j] + 1) for all j < i with nums[j] < nums[i].",
        "To achieve O(N log N), maintain array `tails` where tails[k] is the smallest tail of an increasing subsequence of length k+1, updating via binary search (Patience Sorting)."
      ],
      oracleFn: (nums: number[]) => {
        const tails: number[] = [];
        for (const x of nums) {
          let left = 0, right = tails.length;
          while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (tails[mid] < x) left = mid + 1;
            else right = mid;
          }
          if (left === tails.length) tails.push(x);
          else tails[left] = x;
        }
        return tails.length;
      },
      testCases: {
        functional: [
          [[10, 9, 2, 5, 3, 7, 101, 18]],
          [[0, 1, 0, 3, 2, 3]],
          [[7, 7, 7, 7, 7, 7, 7]],
          [[1, 3, 6, 7, 9, 4, 10, 5, 6]]
        ],
        boundary: [
          [[5]],
          [[1, 2]],
          [[2, 1]]
        ],
        adversarial: [
          [[5, 4, 3, 2, 1]],
          [[1, 2, 3, 4, 5]],
          [[4, 10, 4, 3, 8, 9]]
        ],
        stress: [
          [Array.from({ length: 100 }, (_, i) => (i * 37) % 100)],
          [Array.from({ length: 150 }, (_, i) => i)]
        ]
      }
    }),

    // 369. Number of Longest Increasing Subsequence
    createProblem({
      num: 369,
      title: "Number of Longest Increasing Subsequence",
      slug: "number-of-longest-increasing-subsequence",
      level: 17,
      difficulty: "MEDIUM",
      topic: "1D Dynamic Programming",
      patternSlug: "dp-1d",
      estimatedTimeMin: 25,
      statement: "Given an integer array `nums`, return the number of longest increasing subsequences.\n\nNotice that the sequence has to be strictly increasing.",
      functionName: "findNumberOfLIS",
      parameters: [{ name: "nums", type: "number[]", description: "Array of integers" }],
      returnType: "number",
      constraints: ["1 <= nums.length <= 2000", "-10^6 <= nums[i] <= 10^6"],
      examples: [
        { input: "nums = [1,3,5,4,7]", output: "2", explanation: "Two longest increasing subsequences of length 4: [1, 3, 4, 7] and [1, 3, 5, 7]." },
        { input: "nums = [2,2,2,2,2]", output: "5", explanation: "The length of longest increasing subsequence is 1, and there are 5 such subsequences." },
        { input: "nums = [1,2,4,3,5,4,7,2]", output: "3", explanation: "Three LIS of length 5: [1,2,4,5,7], [1,2,3,5,7], [1,2,3,4,7]." },
        { input: "nums = [1]", output: "1", explanation: "Single element has exactly 1 LIS." }
      ],
      optimalSolution: `function findNumberOfLIS(nums) {\n  const n = nums.length;\n  if (n <= 1) return n;\n  const lengths = new Array(n).fill(1);\n  const counts = new Array(n).fill(1);\n  let maxLen = 1;\n  for (let i = 1; i < n; i++) {\n    for (let j = 0; j < i; j++) {\n      if (nums[j] < nums[i]) {\n        if (lengths[j] + 1 > lengths[i]) {\n          lengths[i] = lengths[j] + 1;\n          counts[i] = counts[j];\n        } else if (lengths[j] + 1 === lengths[i]) {\n          counts[i] += counts[j];\n        }\n      }\n    }\n    maxLen = Math.max(maxLen, lengths[i]);\n  }\n  let res = 0;\n  for (let i = 0; i < n; i++) {\n    if (lengths[i] === maxLen) res += counts[i];\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(N^2)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function findNumberOfLIS(nums) {\n  const n = nums.length;\n  const len = new Array(n).fill(1);\n  const cnt = new Array(n).fill(1);\n  for (let i = 0; i < n; i++) {\n    for (let j = 0; j < i; j++) {\n      if (nums[i] > nums[j]) {\n        if (len[j] + 1 > len[i]) {\n          len[i] = len[j] + 1;\n          cnt[i] = cnt[j];\n        } else if (len[j] + 1 === len[i]) {\n          cnt[i] += cnt[j];\n        }\n      }\n    }\n  }\n  const max = Math.max(...len);\n  return cnt.reduce((acc, c, idx) => len[idx] === max ? acc + c : acc, 0);\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Resetting counts[i] to 1 when lengths[j] + 1 === lengths[i] instead of accumulating counts[j].", "Only counting the single longest ending at the last index."],
      hints: [
        "Maintain two DP arrays: lengths[i] storing LIS length ending at i, and counts[i] storing the number of such subsequences.",
        "When lengths[j] + 1 > lengths[i], reset counts[i] = counts[j].",
        "When lengths[j] + 1 == lengths[i], accumulate counts[i] += counts[j]."
      ],
      oracleFn: (nums: number[]) => {
        const n = nums.length;
        if (n <= 1) return n;
        const lengths = new Array(n).fill(1);
        const counts = new Array(n).fill(1);
        let maxLen = 1;
        for (let i = 1; i < n; i++) {
          for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
              if (lengths[j] + 1 > lengths[i]) {
                lengths[i] = lengths[j] + 1;
                counts[i] = counts[j];
              } else if (lengths[j] + 1 === lengths[i]) {
                counts[i] += counts[j];
              }
            }
          }
          maxLen = Math.max(maxLen, lengths[i]);
        }
        let res = 0;
        for (let i = 0; i < n; i++) {
          if (lengths[i] === maxLen) res += counts[i];
        }
        return res;
      },
      testCases: {
        functional: [
          [[1, 3, 5, 4, 7]],
          [[2, 2, 2, 2, 2]],
          [[1, 2, 4, 3, 5, 4, 7, 2]],
          [[1]]
        ],
        boundary: [
          [[1, 2]],
          [[2, 1]],
          [[1, 3, 2]]
        ],
        adversarial: [
          [[1, 2, 3, 1, 2, 3, 1, 2, 3]],
          [[3, 1, 2]],
          [[1, 1, 1, 2, 2, 2, 3, 3, 3]]
        ],
        stress: [
          [Array.from({ length: 60 }, (_, i) => i % 5)],
          [Array.from({ length: 80 }, (_, i) => (i % 2 === 0 ? i : i - 1))]
        ]
      }
    }),

    // 370. Integer Break
    createProblem({
      num: 370,
      title: "Integer Break",
      slug: "integer-break",
      level: 17,
      difficulty: "MEDIUM",
      topic: "1D Dynamic Programming",
      patternSlug: "dp-1d",
      estimatedTimeMin: 15,
      statement: "Given an integer `n`, break it into the sum of `k` positive integers, where `k >= 2`, and maximize the product of those integers.\n\nReturn the maximum product you can get.",
      functionName: "integerBreak",
      parameters: [{ name: "n", type: "number", description: "Target integer" }],
      returnType: "number",
      constraints: ["2 <= n <= 58"],
      examples: [
        { input: "n = 2", output: "1", explanation: "2 = 1 + 1, 1 * 1 = 1." },
        { input: "n = 10", output: "36", explanation: "10 = 3 + 3 + 4, 3 * 3 * 4 = 36." },
        { input: "n = 3", output: "2", explanation: "3 = 1 + 2, 1 * 2 = 2." },
        { input: "n = 4", output: "4", explanation: "4 = 2 + 2, 2 * 2 = 4." }
      ],
      optimalSolution: `function integerBreak(n) {\n  if (n <= 3) return n - 1;\n  let product = 1;\n  while (n > 4) {\n    product *= 3;\n    n -= 3;\n  }\n  return product * n;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function integerBreak(n) {\n  const dp = new Array(n + 1).fill(0);\n  dp[1] = 1;\n  for (let i = 2; i <= n; i++) {\n    for (let j = 1; j < i; j++) {\n      dp[i] = Math.max(dp[i], Math.max(j * (i - j), j * dp[i - j]));\n    }\n  }\n  return dp[n];\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Forgetting the constraint k >= 2 (for n = 2 and n = 3, we must break them even though their unbroken value is higher)."],
      hints: [
        "By calculus, factor e ≈ 2.718 maximizes product, so factors of 3 (and occasionally 2) yield the maximal product.",
        "Break n into as many 3s as possible. If remainder is 4, use 2 * 2 rather than 3 * 1."
      ],
      oracleFn: (n: number) => {
        if (n <= 3) return n - 1;
        let product = 1;
        while (n > 4) {
          product *= 3;
          n -= 3;
        }
        return product * n;
      },
      testCases: {
        functional: [
          [2],
          [10],
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
          [9],
          [11]
        ],
        stress: [
          [45],
          [55],
          [58]
        ]
      }
    }),

    // 371. Paint House
    createProblem({
      num: 371,
      title: "Paint House",
      slug: "paint-house",
      level: 17,
      difficulty: "MEDIUM",
      topic: "1D Dynamic Programming",
      patternSlug: "dp-1d",
      estimatedTimeMin: 20,
      statement: "There is a row of `n` houses, where each house can be painted one of three colors: red, blue, or green. The cost of painting each house with a certain color is different. You have to paint all the houses such that no two adjacent houses have the same color.\n\nThe cost of painting each house with a certain color is represented by an `n x 3` cost matrix `costs`.\n\nFor example, `costs[0][0]` is the cost of painting house 0 with color red; `costs[1][2]` is the cost of painting house 1 with color green, and so on.\n\nReturn the minimum cost to paint all houses.",
      functionName: "minCost",
      parameters: [{ name: "costs", type: "number[][]", description: "n x 3 matrix of painting costs" }],
      returnType: "number",
      constraints: ["costs.length == n", "costs[i].length == 3", "1 <= n <= 100", "1 <= costs[i][j] <= 20"],
      examples: [
        { input: "costs = [[17,2,17],[16,16,5],[14,3,19]]", output: "10", explanation: "Paint house 0 blue (cost 2), house 1 green (cost 5), house 2 blue (cost 3). Total = 10." },
        { input: "costs = [[7,6,2]]", output: "2", explanation: "Paint house 0 green with min cost 2." },
        { input: "costs = [[1,2,3],[3,2,1]]", output: "3", explanation: "House 0 red (1) + House 1 green (1) = 2, wait: adjacent colors are red(0) and green(2) which is cost 1 + 1 = 2 or 1 + 2 = 3 depending on indices. Min is 2." },
        { input: "costs = [[5,8,6],[19,14,13],[7,5,12],[14,15,17]]", output: "43", explanation: "Paint optimal alternating color choices to yield 43." }
      ],
      optimalSolution: `function minCost(costs) {\n  if (!costs || costs.length === 0) return 0;\n  let r = costs[0][0], b = costs[0][1], g = costs[0][2];\n  for (let i = 1; i < costs.length; i++) {\n    const nextR = costs[i][0] + Math.min(b, g);\n    const nextB = costs[i][1] + Math.min(r, g);\n    const nextG = costs[i][2] + Math.min(r, b);\n    r = nextR;\n    b = nextB;\n    g = nextG;\n  }\n  return Math.min(r, b, g);\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function minCost(costs) {\n  if (!costs || costs.length === 0) return 0;\n  const n = costs.length;\n  const dp = Array.from({ length: n }, () => new Array(3).fill(0));\n  dp[0] = [...costs[0]];\n  for (let i = 1; i < n; i++) {\n    dp[i][0] = costs[i][0] + Math.min(dp[i - 1][1], dp[i - 1][2]);\n    dp[i][1] = costs[i][1] + Math.min(dp[i - 1][0], dp[i - 1][2]);\n    dp[i][2] = costs[i][2] + Math.min(dp[i - 1][0], dp[i - 1][1]);\n  }\n  return Math.min(dp[n - 1][0], dp[n - 1][1], dp[n - 1][2]);\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Greedily picking the minimum for each house independently, ignoring color collision on future houses."],
      hints: [
        "Let r, b, g be the min cost to paint up to the previous house ending in red, blue, or green.",
        "The new red cost is current red cost + min(previous blue, previous green)."
      ],
      oracleFn: (costs: number[][]) => {
        if (!costs || costs.length === 0) return 0;
        let r = costs[0][0], b = costs[0][1], g = costs[0][2];
        for (let i = 1; i < costs.length; i++) {
          const nextR = costs[i][0] + Math.min(b, g);
          const nextB = costs[i][1] + Math.min(r, g);
          const nextG = costs[i][2] + Math.min(r, b);
          r = nextR;
          b = nextB;
          g = nextG;
        }
        return Math.min(r, b, g);
      },
      testCases: {
        functional: [
          [[[17, 2, 17], [16, 16, 5], [14, 3, 19]]],
          [[[7, 6, 2]]],
          [[[1, 2, 3], [3, 2, 1]]],
          [[[5, 8, 6], [19, 14, 13], [7, 5, 12], [14, 15, 17]]]
        ],
        boundary: [
          [[[1, 1, 1]]],
          [[[10, 20, 30], [30, 20, 10]]],
          [[[5, 5, 5], [5, 5, 5], [5, 5, 5]]]
        ],
        adversarial: [
          [[[1, 100, 100], [1, 100, 100], [1, 100, 100]]],
          [[[10, 1, 10], [1, 10, 10], [10, 1, 10], [1, 10, 10]]],
          [[[10, 20, 15], [5, 25, 20], [15, 10, 5]]]
        ],
        stress: [
          [Array.from({ length: 50 }, (_, i) => [i % 5 + 1, (i + 1) % 5 + 1, (i + 2) % 5 + 1])],
          [Array.from({ length: 80 }, (_, i) => [(i * 2) % 20 + 1, (i * 3) % 20 + 1, (i * 5) % 20 + 1])]
        ]
      }
    }),

    // 372. Paint Fence
    createProblem({
      num: 372,
      title: "Paint Fence",
      slug: "paint-fence",
      level: 17,
      difficulty: "MEDIUM",
      topic: "1D Dynamic Programming",
      patternSlug: "dp-1d",
      estimatedTimeMin: 20,
      statement: "You have a fence of `n` posts, each post can be painted with one of the `k` colors. You have to paint all the posts such that no more than two adjacent fence posts have the same color.\n\nGiven the two integers `n` and `k`, return the number of ways to paint the fence.",
      functionName: "numWays",
      parameters: [
        { name: "n", type: "number", description: "Number of fence posts" },
        { name: "k", type: "number", description: "Number of color choices" }
      ],
      returnType: "number",
      constraints: ["1 <= n <= 50", "1 <= k <= 10^5", "The answer is guaranteed to fit in a 32-bit integer for n <= 50."],
      examples: [
        { input: "n = 3, k = 2", output: "6", explanation: "All 6 valid colorings with colors 0 and 1: 001, 010, 011, 100, 101, 110." },
        { input: "n = 1, k = 1", output: "1", explanation: "Only 1 post and 1 color gives 1 way." },
        { input: "n = 7, k = 2", output: "42", explanation: "Total 42 valid ways." },
        { input: "n = 2, k = 4", output: "16", explanation: "Every pair of colors is valid for n = 2 posts: 4 * 4 = 16." }
      ],
      optimalSolution: `function numWays(n, k) {\n  if (n === 0) return 0;\n  if (n === 1) return k;\n  let same = k, diff = k * (k - 1);\n  for (let i = 3; i <= n; i++) {\n    const prevDiff = diff;\n    diff = (same + diff) * (k - 1);\n    same = prevDiff;\n  }\n  return same + diff;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function numWays(n, k) {\n  if (n === 0) return 0;\n  if (n === 1) return k;\n  const dp = new Array(n + 1).fill(0);\n  dp[1] = k;\n  dp[2] = k * k;\n  for (let i = 3; i <= n; i++) {\n    dp[i] = (dp[i - 1] + dp[i - 2]) * (k - 1);\n  }\n  return dp[n];\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Allowing three consecutive posts of the same color.", "Base cases for n = 1 or n = 2."],
      hints: [
        "For post i, it can either have the SAME color as post i-1 or a DIFFERENT color.",
        "same[i] = diff[i-1] (since we cannot have 3 consecutive same colors).",
        "diff[i] = (same[i-1] + diff[i-1]) * (k - 1)."
      ],
      oracleFn: (n: number, k: number) => {
        if (n === 0) return 0;
        if (n === 1) return k;
        let same = k, diff = k * (k - 1);
        for (let i = 3; i <= n; i++) {
          const prevDiff = diff;
          diff = (same + diff) * (k - 1);
          same = prevDiff;
        }
        return same + diff;
      },
      testCases: {
        functional: [
          [3, 2],
          [1, 1],
          [7, 2],
          [2, 4]
        ],
        boundary: [
          [1, 5],
          [2, 1],
          [3, 1]
        ],
        adversarial: [
          [4, 2],
          [5, 3],
          [6, 4]
        ],
        stress: [
          [15, 3],
          [20, 2],
          [30, 2]
        ]
      }
    }),

    // 373. Minimum Cost For Tickets
    createProblem({
      num: 373,
      title: "Minimum Cost For Tickets",
      slug: "minimum-cost-for-tickets",
      level: 17,
      difficulty: "MEDIUM",
      topic: "1D Dynamic Programming",
      patternSlug: "dp-1d",
      estimatedTimeMin: 20,
      statement: "You have planned some train traveling one year in advance. The days of the year in which you will travel are given as an integer array `days`. Each day is an integer from 1 to 365.\n\nTrain tickets are sold in three different ways:\n- a 1-day pass is sold for `costs[0]` dollars,\n- a 7-day pass is sold for `costs[1]` dollars, and\n- a 30-day pass is sold for `costs[2]` dollars.\n\nThe passes allow that many days of consecutive travel.\n\nReturn the minimum number of dollars you need to travel every day in the given list of days.",
      functionName: "mincostTickets",
      parameters: [
        { name: "days", type: "number[]", description: "Array of travel days" },
        { name: "costs", type: "number[]", description: "Cost of 1-day, 7-day, and 30-day passes" }
      ],
      returnType: "number",
      constraints: ["1 <= days.length <= 365", "1 <= days[i] <= 365", "days is strictly increasing", "costs.length == 3", "1 <= costs[i] <= 1000"],
      examples: [
        { input: "days = [1,4,6,7,8,20], costs = [2,7,15]", output: "11", explanation: "Buy 7-day pass on day 1 for $7 (covering 1-7). Buy 1-day pass on day 8 for $2. Buy 1-day pass on day 20 for $2. Total 11." },
        { input: "days = [1,2,3,4,5,6,7,8,9,10,30,31], costs = [2,7,15]", output: "17", explanation: "Buy 30-day pass on day 1 for $15 (covers 1-30). Buy 1-day pass on day 31 for $2. Total 17." },
        { input: "days = [1], costs = [5,10,20]", output: "5", explanation: "Single day trip, buy 1-day pass for $5." },
        { input: "days = [1,100], costs = [2,7,15]", output: "4", explanation: "Two separate days, two 1-day passes = $4." }
      ],
      optimalSolution: `function mincostTickets(days, costs) {\n  const lastDay = days[days.length - 1];\n  const isTravel = new Set(days);\n  const dp = new Array(lastDay + 1).fill(0);\n  for (let i = 1; i <= lastDay; i++) {\n    if (!isTravel.has(i)) {\n      dp[i] = dp[i - 1];\n    } else {\n      const c1 = dp[i - 1] + costs[0];\n      const c7 = dp[Math.max(0, i - 7)] + costs[1];\n      const c30 = dp[Math.max(0, i - 30)] + costs[2];\n      dp[i] = Math.min(c1, c7, c30);\n    }\n  }\n  return dp[lastDay];\n}`,
      optimalTimeComplexity: "O(lastDay)",
      optimalSpaceComplexity: "O(lastDay)",
      suboptimalSolution: `function mincostTickets(days, costs) {\n  const memo = new Map();\n  function dfs(idx) {\n    if (idx >= days.length) return 0;\n    if (memo.has(idx)) return memo.get(idx);\n    const c1 = costs[0] + dfs(idx + 1);\n    let i7 = idx;\n    while (i7 < days.length && days[i7] < days[idx] + 7) i7++;\n    const c7 = costs[1] + dfs(i7);\n    let i30 = idx;\n    while (i30 < days.length && days[i30] < days[idx] + 30) i30++;\n    const c30 = costs[2] + dfs(i30);\n    const res = Math.min(c1, c7, c30);\n    memo.set(idx, res);\n    return res;\n  }\n  return dfs(0);\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Incrementing days linearly without checking if the day is an actual travel day."],
      hints: [
        "If day i is not a travel day, dp[i] = dp[i - 1].",
        "If day i is a travel day, dp[i] = min(dp[i - 1] + cost[0], dp[i - 7] + cost[1], dp[i - 30] + cost[2])."
      ],
      oracleFn: (days: number[], costs: number[]) => {
        const lastDay = days[days.length - 1];
        const isTravel = new Set(days);
        const dp = new Array(lastDay + 1).fill(0);
        for (let i = 1; i <= lastDay; i++) {
          if (!isTravel.has(i)) {
            dp[i] = dp[i - 1];
          } else {
            const c1 = dp[i - 1] + costs[0];
            const c7 = dp[Math.max(0, i - 7)] + costs[1];
            const c30 = dp[Math.max(0, i - 30)] + costs[2];
            dp[i] = Math.min(c1, c7, c30);
          }
        }
        return dp[lastDay];
      },
      testCases: {
        functional: [
          [[1, 4, 6, 7, 8, 20], [2, 7, 15]],
          [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 30, 31], [2, 7, 15]],
          [[1], [5, 10, 20]],
          [[1, 100], [2, 7, 15]]
        ],
        boundary: [
          [[1, 2, 3], [10, 10, 10]],
          [[365], [1, 2, 3]],
          [[1, 30, 31], [2, 7, 15]]
        ],
        adversarial: [
          [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [5, 2, 1]],
          [[1, 7, 14, 21, 28], [2, 7, 15]],
          [[1, 2, 4, 8, 16, 32, 64], [3, 8, 20]]
        ],
        stress: [
          [Array.from({ length: 50 }, (_, i) => i * 7 + 1), [2, 7, 15]],
          [Array.from({ length: 100 }, (_, i) => i * 3 + 1), [3, 10, 25]]
        ]
      }
    }),

    // 374. Triangle
    createProblem({
      num: 374,
      title: "Triangle",
      slug: "triangle",
      level: 17,
      difficulty: "MEDIUM",
      topic: "1D Dynamic Programming",
      patternSlug: "dp-1d",
      estimatedTimeMin: 20,
      statement: "Given a `triangle` array, return the minimum path sum from top to bottom.\n\nFor each step, you may move to an adjacent number of the row below. More formally, if you are on index `i` on the current row, you may move to either index `i` or index `i + 1` on the next row.",
      functionName: "minimumTotal",
      parameters: [{ name: "triangle", type: "number[][]", description: "Triangle represented as 2D array" }],
      returnType: "number",
      constraints: ["1 <= triangle.length <= 200", "triangle[0].length == 1", "triangle[i].length == triangle[i - 1].length + 1", "-10^4 <= triangle[i][j] <= 10^4"],
      examples: [
        { input: "triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]", output: "11", explanation: "Minimum path sum from top to bottom is 2 + 3 + 5 + 1 = 11." },
        { input: "triangle = [[-10]]", output: "-10", explanation: "Only one element: -10." },
        { input: "triangle = [[-1],[2,3],[1,-1,-3]]", output: "-1", explanation: "Path -1 -> 3 -> -3 = -1." },
        { input: "triangle = [[1],[2,3]]", output: "3", explanation: "1 + 2 = 3." }
      ],
      optimalSolution: `function minimumTotal(triangle) {\n  const dp = [...triangle[triangle.length - 1]];\n  for (let r = triangle.length - 2; r >= 0; r--) {\n    for (let c = 0; c <= r; c++) {\n      dp[c] = triangle[r][c] + Math.min(dp[c], dp[c + 1]);\n    }\n  }\n  return dp[0];\n}`,
      optimalTimeComplexity: "O(N^2)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function minimumTotal(triangle) {\n  const n = triangle.length;\n  const memo = Array.from({ length: n }, () => new Map());\n  function dfs(r, c) {\n    if (r === n - 1) return triangle[r][c];\n    if (memo[r].has(c)) return memo[r].get(c);\n    const res = triangle[r][c] + Math.min(dfs(r + 1, c), dfs(r + 1, c + 1));\n    memo[r].set(c, res);\n    return res;\n  }\n  return dfs(0, 0);\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N^2)",
      commonMistakes: ["Top-down approach requiring complex boundary checking instead of bottom-up which converges cleanly to dp[0]."],
      hints: [
        "Work bottom-up: starting from the second to last row, each cell's optimal path sum is its value plus min(dp[c], dp[c+1]).",
        "Requires only O(N) auxiliary space using a single 1D row."
      ],
      oracleFn: (triangle: number[][]) => {
        const dp = [...triangle[triangle.length - 1]];
        for (let r = triangle.length - 2; r >= 0; r--) {
          for (let c = 0; c <= r; c++) {
            dp[c] = triangle[r][c] + Math.min(dp[c], dp[c + 1]);
          }
        }
        return dp[0];
      },
      testCases: {
        functional: [
          [[[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]]],
          [[[-10]]],
          [[[-1], [2, 3], [1, -1, -3]]],
          [[[1], [2, 3]]]
        ],
        boundary: [
          [[[0]]],
          [[[1], [-1, 2]]],
          [[[-1], [-2, -3]]]
        ],
        adversarial: [
          [[[2], [3, 4], [6, 5, 9], [4, 4, 8, 0]]],
          [[[7], [3, 8], [8, 1, 0], [2, 7, 4, 4], [4, 5, 2, 6, 5]]]
        ],
        stress: [
          [Array.from({ length: 40 }, (_, r) => Array.from({ length: r + 1 }, (_, c) => (r * 3 + c) % 17 - 8))],
          [Array.from({ length: 60 }, (_, r) => Array.from({ length: r + 1 }, () => 1))]
        ]
      }
    }),

    // 375. Fibonacci Number
    createProblem({
      num: 375,
      title: "Fibonacci Number",
      slug: "fibonacci-number",
      level: 17,
      difficulty: "EASY",
      topic: "1D Dynamic Programming",
      patternSlug: "dp-1d",
      estimatedTimeMin: 10,
      statement: "The Fibonacci numbers, commonly denoted `F(n)` form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. That is:\nF(0) = 0, F(1) = 1\nF(n) = F(n - 1) + F(n - 2), for n > 1.\n\nGiven `n`, calculate `F(n)`.",
      functionName: "fib",
      parameters: [{ name: "n", type: "number", description: "Fibonacci index" }],
      returnType: "number",
      constraints: ["0 <= n <= 30"],
      examples: [
        { input: "n = 2", output: "1", explanation: "F(2) = F(1) + F(0) = 1 + 0 = 1." },
        { input: "n = 3", output: "2", explanation: "F(3) = F(2) + F(1) = 1 + 1 = 2." },
        { input: "n = 4", output: "3", explanation: "F(4) = F(3) + F(2) = 2 + 1 = 3." },
        { input: "n = 0", output: "0", explanation: "F(0) = 0." }
      ],
      optimalSolution: `function fib(n) {\n  if (n <= 1) return n;\n  let a = 0, b = 1;\n  for (let i = 2; i <= n; i++) {\n    const c = a + b;\n    a = b;\n    b = c;\n  }\n  return b;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function fib(n) {\n  if (n <= 1) return n;\n  const dp = new Array(n + 1);\n  dp[0] = 0;\n  dp[1] = 1;\n  for (let i = 2; i <= n; i++) {\n    dp[i] = dp[i - 1] + dp[i - 2];\n  }\n  return dp[n];\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Naive exponential recursion O(2^N) instead of linear dynamic programming."],
      hints: [
        "F(n) = F(n-1) + F(n-2) with base cases F(0)=0 and F(1)=1.",
        "Store the last two calculated values for O(1) space."
      ],
      oracleFn: (n: number) => {
        if (n <= 1) return n;
        let a = 0, b = 1;
        for (let i = 2; i <= n; i++) {
          const c = a + b;
          a = b;
          b = c;
        }
        return b;
      },
      testCases: {
        functional: [
          [2],
          [3],
          [4],
          [5]
        ],
        boundary: [
          [0],
          [1],
          [6]
        ],
        adversarial: [
          [7],
          [10],
          [15]
        ],
        stress: [
          [20],
          [25],
          [30]
        ]
      }
    })
  ];

  return {
    level: 17,
    levelTitle: "Level 17 — Dynamic Programming I: 1D",
    topic: "Fibonacci Sequence, House Robber Variations, Unbounded & 0/1 Knapsack, and LIS Optimization",
    problems
  };
}
