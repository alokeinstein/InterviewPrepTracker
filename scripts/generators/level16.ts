import { LevelPayload, GeneratedProblem } from './types';
import { createProblem } from './problemBuilder';

export function getLevel16Payload(): LevelPayload {
  const problems: GeneratedProblem[] = [
    // 341. Best Time to Buy and Sell Stock II
    createProblem({
      num: 341,
      title: "Best Time to Buy and Sell Stock II",
      slug: "best-time-to-buy-and-sell-stock-ii",
      level: 16,
      difficulty: "MEDIUM",
      topic: "Greedy / Array",
      patternSlug: "advanced-greedy-arrays",
      estimatedTimeMin: 15,
      statement: "You are given an integer array `prices` where `prices[i]` is the price of a given stock on the `i-th` day.\n\nOn each day, you may decide to buy and/or sell the stock. You can only hold at most one share of the stock at any time. However, you can buy it then immediately sell it on the same day.\n\nFind and return the maximum profit you can achieve.",
      functionName: "maxProfit",
      parameters: [{ name: "prices", type: "number[]", description: "Array of daily stock prices" }],
      returnType: "number",
      constraints: ["1 <= prices.length <= 3 * 10^4", "0 <= prices[i] <= 10^4"],
      examples: [
        { input: "prices = [7,1,5,3,6,4]", output: "7", explanation: "Buy day 2 (1), sell day 3 (5), profit 4. Buy day 4 (3), sell day 5 (6), profit 3. Total 7." },
        { input: "prices = [1,2,3,4,5]", output: "4", explanation: "Buy day 1 (1) and sell day 5 (5), profit 4." },
        { input: "prices = [7,6,4,3,1]", output: "0", explanation: "Prices are strictly declining, no transaction done, profit 0." },
        { input: "prices = [2,4]", output: "2", explanation: "Buy at 2, sell at 4, profit 2." }
      ],
      optimalSolution: `function maxProfit(prices) {\n  let profit = 0;\n  for (let i = 1; i < prices.length; i++) {\n    if (prices[i] > prices[i - 1]) {\n      profit += prices[i] - prices[i - 1];\n    }\n  }\n  return profit;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function maxProfit(prices) {\n  // Peak-valley approach\n  let i = 0, profit = 0;\n  while (i < prices.length - 1) {\n    while (i < prices.length - 1 && prices[i] >= prices[i + 1]) i++;\n    const valley = prices[i];\n    while (i < prices.length - 1 && prices[i] <= prices[i + 1]) i++;\n    const peak = prices[i];\n    profit += peak - valley;\n  }\n  return profit;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Trying to find global min and global max instead of capturing every positive price delta."],
      hints: [
        "Greedy observation: any upward slope `prices[i] - prices[i - 1] > 0` can be captured as profit.",
        "Sum all positive daily increments `Math.max(0, prices[i] - prices[i - 1])`."
      ],
      oracleFn: (prices: number[]) => {
        let profit = 0;
        for (let i = 1; i < prices.length; i++) {
          if (prices[i] > prices[i - 1]) {
            profit += prices[i] - prices[i - 1];
          }
        }
        return profit;
      },
      testCases: {
        functional: [
          [[7, 1, 5, 3, 6, 4]],
          [[1, 2, 3, 4, 5]],
          [[7, 6, 4, 3, 1]],
          [[2, 4]]
        ],
        boundary: [
          [[10]],
          [[1, 1, 1, 1]],
          [[0, 10, 0, 10]],
          [[5, 4, 3, 2, 1, 10]]
        ],
        adversarial: [
          [[2, 1, 2, 0, 1]],
          [[3, 3, 5, 0, 0, 3, 1, 4]]
        ],
        stress: [
          [Array.from({ length: 1000 }, (_, i) => (i % 2 === 0 ? 10 : 20))],
          [Array.from({ length: 2000 }, (_, i) => i)]
        ]
      }
    }),

    // 342. Best Time to Buy and Sell Stock III
    createProblem({
      num: 342,
      title: "Best Time to Buy and Sell Stock III",
      slug: "best-time-to-buy-and-sell-stock-iii",
      level: 16,
      difficulty: "HARD",
      topic: "DP / State Machine",
      patternSlug: "advanced-greedy-arrays",
      estimatedTimeMin: 25,
      statement: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day.\n\nFind the maximum profit you can achieve. You may complete at most two transactions.\n\nNote: You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).",
      functionName: "maxProfit",
      parameters: [{ name: "prices", type: "number[]", description: "Array of stock prices" }],
      returnType: "number",
      constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^5"],
      examples: [
        { input: "prices = [3,3,5,0,0,3,1,4]", output: "6", explanation: "Buy day 4 (price 0) and sell day 6 (price 3), profit 3. Buy day 7 (price 1) and sell day 8 (price 4), profit 3. Total 6." },
        { input: "prices = [1,2,3,4,5]", output: "4", explanation: "Buy day 1 (price 1) and sell day 5 (price 5), profit 4." },
        { input: "prices = [7,6,4,3,1]", output: "0", explanation: "Prices declining, profit 0." },
        { input: "prices = [1]", output: "0", explanation: "Single day, no transaction possible." }
      ],
      optimalSolution: `function maxProfit(prices) {\n  let buy1 = -Infinity, sell1 = 0;\n  let buy2 = -Infinity, sell2 = 0;\n  for (const price of prices) {\n    buy1 = Math.max(buy1, -price);\n    sell1 = Math.max(sell1, buy1 + price);\n    buy2 = Math.max(buy2, sell1 - price);\n    sell2 = Math.max(sell2, buy2 + price);\n  }\n  return sell2;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function maxProfit(prices) {\n  const n = prices.length;\n  if (n <= 1) return 0;\n  const left = new Array(n).fill(0);\n  let minPrice = prices[0];\n  for (let i = 1; i < n; i++) {\n    minPrice = Math.min(minPrice, prices[i]);\n    left[i] = Math.max(left[i - 1], prices[i] - minPrice);\n  }\n  const right = new Array(n).fill(0);\n  let maxPrice = prices[n - 1];\n  for (let i = n - 2; i >= 0; i--) {\n    maxPrice = Math.max(maxPrice, prices[i]);\n    right[i] = Math.max(right[i + 1], maxPrice - prices[i]);\n  }\n  let maxP = 0;\n  for (let i = 0; i < n; i++) {\n    maxP = Math.max(maxP, left[i] + right[i]);\n  }\n  return maxP;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Using O(N^2) splitting loops instead of bidirectional DP or 4-state state machine."],
      hints: [
        "Track 4 states in a single pass: `buy1`, `sell1`, `buy2`, `sell2`.",
        "`buy1 = max(buy1, -price)`, `sell1 = max(sell1, buy1 + price)`.",
        "`buy2 = max(buy2, sell1 - price)`, `sell2 = max(sell2, buy2 + price)`.",
        "Return `sell2`."
      ],
      oracleFn: (prices: number[]) => {
        let buy1 = -Infinity, sell1 = 0;
        let buy2 = -Infinity, sell2 = 0;
        for (const price of prices) {
          buy1 = Math.max(buy1, -price);
          sell1 = Math.max(sell1, buy1 + price);
          buy2 = Math.max(buy2, sell1 - price);
          sell2 = Math.max(sell2, buy2 + price);
        }
        return sell2;
      },
      testCases: {
        functional: [
          [[3, 3, 5, 0, 0, 3, 1, 4]],
          [[1, 2, 3, 4, 5]],
          [[7, 6, 4, 3, 1]],
          [[1]]
        ],
        boundary: [
          [[1, 2]],
          [[2, 1]],
          [[2, 1, 2, 0, 1]],
          [[1, 2, 4, 2, 5, 7, 2, 4, 9, 0]]
        ],
        adversarial: [
          [[1, 4, 2, 7]],
          [[3, 2, 6, 5, 0, 3]]
        ],
        stress: [
          [Array.from({ length: 1000 }, (_, i) => (i % 4 === 0 ? 1 : i % 4 === 1 ? 5 : i % 4 === 2 ? 2 : 8))],
          [Array.from({ length: 1500 }, (_, i) => i)]
        ]
      }
    }),

    // 343. Best Time to Buy and Sell Stock IV
    createProblem({
      num: 343,
      title: "Best Time to Buy and Sell Stock IV",
      slug: "best-time-to-buy-and-sell-stock-iv",
      level: 16,
      difficulty: "HARD",
      topic: "DP / State Machine",
      patternSlug: "advanced-greedy-arrays",
      estimatedTimeMin: 25,
      statement: "You are given an integer array `prices` where `prices[i]` is the price of a given stock on the `i-th` day, and an integer `k`.\n\nFind the maximum profit you can achieve. You may complete at most `k` transactions: i.e. you may buy at most `k` times and sell at most `k` times.\n\nNote: You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).",
      functionName: "maxProfit",
      parameters: [
        { name: "k", type: "number", description: "Max transactions permitted" },
        { name: "prices", type: "number[]", description: "Array of stock prices" }
      ],
      returnType: "number",
      constraints: ["1 <= k <= 100", "1 <= prices.length <= 1000", "0 <= prices[i] <= 1000"],
      examples: [
        { input: "k = 2, prices = [2,4,1]", output: "2", explanation: "Buy day 1 (price 2) and sell day 2 (price 4), profit 2." },
        { input: "k = 2, prices = [3,2,6,5,0,3]", output: "7", explanation: "Buy at 2, sell at 6 (profit 4). Buy at 0, sell at 3 (profit 3). Total profit 7." },
        { input: "k = 1, prices = [1,2]", output: "1", explanation: "Single transaction profit 1." },
        { input: "k = 0, prices = [1,2,3]", output: "0", explanation: "0 transactions allowed, profit 0." }
      ],
      optimalSolution: `function maxProfit(k, prices) {\n  const n = prices.length;\n  if (n <= 1 || k === 0) return 0;\n  if (k >= Math.floor(n / 2)) {\n    let profit = 0;\n    for (let i = 1; i < n; i++) {\n      if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];\n    }\n    return profit;\n  }\n  const buy = new Array(k + 1).fill(-Infinity);\n  const sell = new Array(k + 1).fill(0);\n  for (const price of prices) {\n    for (let j = 1; j <= k; j++) {\n      buy[j] = Math.max(buy[j], sell[j - 1] - price);\n      sell[j] = Math.max(sell[j], buy[j] + price);\n    }\n  }\n  return sell[k];\n}`,
      optimalTimeComplexity: "O(k * N)",
      optimalSpaceComplexity: "O(k)",
      suboptimalSolution: `function maxProfit(k, prices) {\n  const n = prices.length;\n  if (n <= 1 || k === 0) return 0;\n  const dp = Array.from({ length: k + 1 }, () => new Array(n).fill(0));\n  for (let i = 1; i <= k; i++) {\n    let maxDiff = -prices[0];\n    for (let j = 1; j < n; j++) {\n      dp[i][j] = Math.max(dp[i][j - 1], prices[j] + maxDiff);\n      maxDiff = Math.max(maxDiff, dp[i - 1][j] - prices[j]);\n    }\n  }\n  return dp[k][n - 1];\n}`,
      suboptimalTimeComplexity: "O(k * N)",
      suboptimalSpaceComplexity: "O(k * N)",
      commonMistakes: ["Not optimizing for `k >= n / 2` (which reduces to Stock II infinite transactions and saves O(k*N) work)."],
      hints: [
        "If `k >= n / 2`, you can make as many transactions as you like (equivalent to Stock II).",
        "Maintain arrays `buy[j]` and `sell[j]` for `1 <= j <= k`.",
        "`buy[j] = max(buy[j], sell[j-1] - price)` and `sell[j] = max(sell[j], buy[j] + price)`."
      ],
      oracleFn: (k: number, prices: number[]) => {
        const n = prices.length;
        if (n <= 1 || k === 0) return 0;
        if (k >= Math.floor(n / 2)) {
          let profit = 0;
          for (let i = 1; i < n; i++) {
            if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];
          }
          return profit;
        }
        const buy = new Array(k + 1).fill(-Infinity);
        const sell = new Array(k + 1).fill(0);
        for (const price of prices) {
          for (let j = 1; j <= k; j++) {
            buy[j] = Math.max(buy[j], sell[j - 1] - price);
            sell[j] = Math.max(sell[j], buy[j] + price);
          }
        }
        return sell[k];
      },
      testCases: {
        functional: [
          [2, [2, 4, 1]],
          [2, [3, 2, 6, 5, 0, 3]],
          [1, [1, 2]],
          [0, [1, 2, 3]]
        ],
        boundary: [
          [2, [1]],
          [1, [7, 6, 4, 3, 1]],
          [100, [1, 2, 3, 4, 5]],
          [2, [1, 4, 2, 7]]
        ],
        adversarial: [
          [2, [1, 2, 4, 2, 5, 7, 2, 4, 9, 0]],
          [3, [2, 6, 8, 7, 8, 7, 9, 4, 1, 2, 4, 5, 8]]
        ],
        stress: [
          [10, Array.from({ length: 500 }, (_, i) => (i % 2 === 0 ? 10 : 20))],
          [50, Array.from({ length: 300 }, (_, i) => (i % 5) * 10)]
        ]
      }
    }),

    // 344. Best Time to Buy and Sell Stock with Cooldown
    createProblem({
      num: 344,
      title: "Best Time to Buy and Sell Stock with Cooldown",
      slug: "best-time-to-buy-and-sell-stock-with-cooldown",
      level: 16,
      difficulty: "MEDIUM",
      topic: "DP / State Machine",
      patternSlug: "advanced-greedy-arrays",
      estimatedTimeMin: 20,
      statement: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day.\n\nFind the maximum profit you can achieve. You may complete as many transactions as you like with the following restrictions:\n- After you sell your stock, you cannot buy stock on the next day (i.e., cooldown one day).\n\nNote: You may not engage in multiple transactions simultaneously.",
      functionName: "maxProfit",
      parameters: [{ name: "prices", type: "number[]", description: "Array of stock prices" }],
      returnType: "number",
      constraints: ["1 <= prices.length <= 5000", "0 <= prices[i] <= 1000"],
      examples: [
        { input: "prices = [1,2,3,0,2]", output: "3", explanation: "transactions = [buy, sell, cooldown, buy, sell], profit = (2-1) + (2-0) = 3." },
        { input: "prices = [1]", output: "0", explanation: "Single day, no profit." },
        { input: "prices = [1,2]", output: "1", explanation: "Buy at 1, sell at 2, profit 1." },
        { input: "prices = [2,1,4]", output: "3", explanation: "Buy at 1, sell at 4, profit 3." }
      ],
      optimalSolution: `function maxProfit(prices) {\n  let hold = -Infinity, sold = 0, rest = 0;\n  for (const price of prices) {\n    const prevHold = hold;\n    const prevSold = sold;\n    hold = Math.max(hold, rest - price);\n    sold = prevHold + price;\n    rest = Math.max(rest, prevSold);\n  }\n  return Math.max(sold, rest);\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function maxProfit(prices) {\n  const n = prices.length;\n  if (n <= 1) return 0;\n  const dp = Array.from({ length: n }, () => new Array(2).fill(0));\n  dp[0][0] = 0; dp[0][1] = -prices[0];\n  dp[1][0] = Math.max(0, prices[1] - prices[0]);\n  dp[1][1] = Math.max(-prices[0], -prices[1]);\n  for (let i = 2; i < n; i++) {\n    dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1] + prices[i]);\n    dp[i][1] = Math.max(dp[i - 1][1], dp[i - 2][0] - prices[i]);\n  }\n  return dp[n - 1][0];\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Buying on the cooldown day immediately following a sell.", "Not allowing `rest` state to transition from previous rest."],
      hints: [
        "Model 3 states: `hold` (holding a stock), `sold` (sold stock today, enters cooldown tomorrow), `rest` (idle, can buy today).",
        "`hold = max(prevHold, rest - price)`",
        "`sold = prevHold + price`",
        "`rest = max(rest, prevSold)`"
      ],
      oracleFn: (prices: number[]) => {
        let hold = -Infinity, sold = 0, rest = 0;
        for (const price of prices) {
          const prevHold = hold;
          const prevSold = sold;
          hold = Math.max(hold, rest - price);
          sold = prevHold + price;
          rest = Math.max(rest, prevSold);
        }
        return Math.max(sold, rest);
      },
      testCases: {
        functional: [
          [[1, 2, 3, 0, 2]],
          [[1]],
          [[1, 2]],
          [[2, 1, 4]]
        ],
        boundary: [
          [[7, 6, 4, 3, 1]],
          [[1, 4, 2]],
          [[1, 2, 4]],
          [[6, 1, 3, 2, 4, 7]]
        ],
        adversarial: [
          [[1, 2, 3, 4, 5]],
          [[2, 1, 4, 5, 2, 9, 7]]
        ],
        stress: [
          [Array.from({ length: 1000 }, (_, i) => (i % 3 === 0 ? 1 : i % 3 === 1 ? 4 : 2))],
          [Array.from({ length: 1200 }, (_, i) => i % 10)]
        ]
      }
    }),

    // 345. Best Time to Buy and Sell Stock with Transaction Fee
    createProblem({
      num: 345,
      title: "Best Time to Buy and Sell Stock with Transaction Fee",
      slug: "best-time-to-buy-and-sell-stock-with-transaction-fee",
      level: 16,
      difficulty: "MEDIUM",
      topic: "Greedy / DP",
      patternSlug: "advanced-greedy-arrays",
      estimatedTimeMin: 15,
      statement: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day, and an integer `fee` representing a transaction fee.\n\nFind the maximum profit you can achieve. You may complete as many transactions as you like, but you need to pay the transaction fee for each transaction.\n\nNote: You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).",
      functionName: "maxProfit",
      parameters: [
        { name: "prices", type: "number[]", description: "Array of stock prices" },
        { name: "fee", type: "number", description: "Transaction fee per sell" }
      ],
      returnType: "number",
      constraints: ["1 <= prices.length <= 5 * 10^4", "1 <= prices[i] < 5 * 10^4", "0 <= fee < 5 * 10^4"],
      examples: [
        { input: "prices = [1,3,2,8,4,9], fee = 2", output: "8", explanation: "Buy at 1, sell at 8, fee 2 = profit 5. Buy at 4, sell at 9, fee 2 = profit 3. Total 8." },
        { input: "prices = [1,3,7,5,10,3], fee = 3", output: "6", explanation: "Buy at 1, sell at 10, fee 3 = profit 6." },
        { input: "prices = [1], fee = 0", output: "0", explanation: "Single day, no transaction." },
        { input: "prices = [1,4], fee = 2", output: "1", explanation: "4 - 1 - 2 = 1." }
      ],
      optimalSolution: `function maxProfit(prices, fee) {\n  let cash = 0;\n  let hold = -prices[0];\n  for (let i = 1; i < prices.length; i++) {\n    cash = Math.max(cash, hold + prices[i] - fee);\n    hold = Math.max(hold, cash - prices[i]);\n  }\n  return cash;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function maxProfit(prices, fee) {\n  const n = prices.length;\n  const dp = Array.from({ length: n }, () => [0, 0]);\n  dp[0][0] = 0; dp[0][1] = -prices[0];\n  for (let i = 1; i < n; i++) {\n    dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1] + prices[i] - fee);\n    dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][0] - prices[i]);\n  }\n  return dp[n - 1][0];\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Deducting the transaction fee both on buy and sell instead of once per completed transaction."],
      hints: [
        "Maintain two states: `cash` (max profit not holding stock) and `hold` (max profit holding stock).",
        "`cash = max(cash, hold + prices[i] - fee)`",
        "`hold = max(hold, cash - prices[i])`."
      ],
      oracleFn: (prices: number[], fee: number) => {
        let cash = 0;
        let hold = -prices[0];
        for (let i = 1; i < prices.length; i++) {
          cash = Math.max(cash, hold + prices[i] - fee);
          hold = Math.max(hold, cash - prices[i]);
        }
        return cash;
      },
      testCases: {
        functional: [
          [[1, 3, 2, 8, 4, 9], 2],
          [[1, 3, 7, 5, 10, 3], 3],
          [[1], 0],
          [[1, 4], 2]
        ],
        boundary: [
          [[1, 4], 5],
          [[1, 5, 2, 8], 0],
          [[10, 9, 8, 7], 1],
          [[1, 2, 3, 4, 5], 1]
        ],
        adversarial: [
          [[4, 5, 2, 4, 3, 3, 1, 2, 5, 4], 1],
          [[9, 8, 7, 1, 2], 3]
        ],
        stress: [
          [Array.from({ length: 1000 }, (_, i) => (i % 2 === 0 ? 10 : 20)), 2],
          [Array.from({ length: 1500 }, (_, i) => i), 5]
        ]
      }
    }),

    // 346. Maximum Product Subarray
    createProblem({
      num: 346,
      title: "Maximum Product Subarray",
      slug: "maximum-product-subarray",
      level: 16,
      difficulty: "MEDIUM",
      topic: "DP / Array",
      patternSlug: "advanced-greedy-arrays",
      estimatedTimeMin: 20,
      statement: "Given an integer array `nums`, find a contiguous non-empty subarray within the array that has the largest product, and return the product.\n\nThe test cases are generated so that the answer will fit in a 32-bit integer.",
      functionName: "maxProduct",
      parameters: [{ name: "nums", type: "number[]", description: "Array of integers" }],
      returnType: "number",
      constraints: ["1 <= nums.length <= 2 * 10^4", "-10 <= nums[i] <= 10", "The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer."],
      examples: [
        { input: "nums = [2,3,-2,4]", output: "6", explanation: "[2,3] has the largest product 6." },
        { input: "nums = [-2,0,-1]", output: "0", explanation: "Max product is 0." },
        { input: "nums = [-2]", output: "-2", explanation: "Single negative element." },
        { input: "nums = [-2,3,-4]", output: "24", explanation: "Two negative numbers multiply to a positive 24." }
      ],
      optimalSolution: `function maxProduct(nums) {\n  let maxProd = nums[0];\n  let curMax = nums[0];\n  let curMin = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    const num = nums[i];\n    if (num < 0) {\n      const temp = curMax;\n      curMax = curMin;\n      curMin = temp;\n    }\n    curMax = Math.max(num, curMax * num);\n    curMin = Math.min(num, curMin * num);\n    if (curMax > maxProd) maxProd = curMax;\n  }\n  return maxProd;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function maxProduct(nums) {\n  let maxProd = -Infinity;\n  for (let i = 0; i < nums.length; i++) {\n    let p = 1;\n    for (let j = i; j < nums.length; j++) {\n      p *= nums[j];\n      if (p > maxProd) maxProd = p;\n    }\n  }\n  return maxProd;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Forgetting that multiplying a negative number by a previous negative minimum creates a positive maximum.", "Zero resets product to 0."],
      hints: [
        "Track both `curMax` and `curMin` at each step because multiplying by a negative flips min and max.",
        "When `nums[i] < 0`, swap `curMax` and `curMin`.",
        "Update `curMax = max(nums[i], curMax * nums[i])` and `curMin = min(nums[i], curMin * nums[i])`."
      ],
      oracleFn: (nums: number[]) => {
        let maxProd = nums[0];
        let curMax = nums[0];
        let curMin = nums[0];
        for (let i = 1; i < nums.length; i++) {
          const num = nums[i];
          if (num < 0) {
            const temp = curMax;
            curMax = curMin;
            curMin = temp;
          }
          curMax = Math.max(num, curMax * num);
          curMin = Math.min(num, curMin * num);
          if (curMax > maxProd) maxProd = curMax;
        }
        return maxProd;
      },
      testCases: {
        functional: [
          [[2, 3, -2, 4]],
          [[-2, 0, -1]],
          [[-2]],
          [[-2, 3, -4]]
        ],
        boundary: [
          [[0]],
          [[0, 2]],
          [[-2, -3, -4]],
          [[2, -5, -2, -4, 3]]
        ],
        adversarial: [
          [[-1, -2, -3, 0]],
          [[3, -1, 4]]
        ],
        stress: [
          [Array.from({ length: 100 }, (_, i) => (i % 2 === 0 ? 1 : -1))],
          [[...Array.from({ length: 50 }, () => 1), -2, ...Array.from({ length: 50 }, () => 1)]]
        ]
      }
    }),

    // 347. Maximum Subarray
    createProblem({
      num: 347,
      title: "Maximum Subarray",
      slug: "maximum-subarray",
      level: 16,
      difficulty: "MEDIUM",
      topic: "DP / Kadane's Algorithm",
      patternSlug: "advanced-greedy-arrays",
      estimatedTimeMin: 15,
      statement: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
      functionName: "maxSubArray",
      parameters: [{ name: "nums", type: "number[]", description: "Array of integers" }],
      returnType: "number",
      constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
      examples: [
        { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "Subarray [4,-1,2,1] has the largest sum 6." },
        { input: "nums = [1]", output: "1", explanation: "Single element subarray." },
        { input: "nums = [5,4,-1,7,8]", output: "23", explanation: "Subarray [5,4,-1,7,8] sum is 23." },
        { input: "nums = [-1]", output: "-1", explanation: "Single negative element." }
      ],
      optimalSolution: `function maxSubArray(nums) {\n  let curSum = nums[0];\n  let maxSum = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    curSum = Math.max(nums[i], curSum + nums[i]);\n    if (curSum > maxSum) maxSum = curSum;\n  }\n  return maxSum;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function maxSubArray(nums) {\n  let maxSum = -Infinity;\n  for (let i = 0; i < nums.length; i++) {\n    let s = 0;\n    for (let j = i; j < nums.length; j++) {\n      s += nums[j];\n      if (s > maxSum) maxSum = s;\n    }\n  }\n  return maxSum;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Initializing maxSum to 0 which fails when all numbers are negative."],
      hints: [
        "Kadane's algorithm: at each index, decide whether to add nums[i] to current sum or start fresh at nums[i].",
        "`curSum = max(nums[i], curSum + nums[i])`.",
        "`maxSum = max(maxSum, curSum)`."
      ],
      oracleFn: (nums: number[]) => {
        let curSum = nums[0];
        let maxSum = nums[0];
        for (let i = 1; i < nums.length; i++) {
          curSum = Math.max(nums[i], curSum + nums[i]);
          if (curSum > maxSum) maxSum = curSum;
        }
        return maxSum;
      },
      testCases: {
        functional: [
          [[-2, 1, -3, 4, -1, 2, 1, -5, 4]],
          [[1]],
          [[5, 4, -1, 7, 8]],
          [[-1]]
        ],
        boundary: [
          [[-5, -4, -3, -2, -1]],
          [[1, 2, 3, 4, 5]],
          [[0, 0, 0, 0]],
          [[-2, -1]]
        ],
        adversarial: [
          [[-2, 10, -5, 20, -100, 50]],
          [[100, -100, 100, -100, 100]]
        ],
        stress: [
          [Array.from({ length: 2000 }, (_, i) => (i % 2 === 0 ? 5 : -4))],
          [Array.from({ length: 2000 }, () => -1)]
        ]
      }
    }),

    // 348. Maximum Sum Circular Subarray
    createProblem({
      num: 348,
      title: "Maximum Sum Circular Subarray",
      slug: "maximum-sum-circular-subarray",
      level: 16,
      difficulty: "MEDIUM",
      topic: "DP / Kadane's Algorithm",
      patternSlug: "advanced-greedy-arrays",
      estimatedTimeMin: 20,
      statement: "Given a circular integer array `nums` of length `n`, return the maximum possible sum of a non-empty subarray of `nums`.\n\nA circular array means the end of the array connects to the beginning of the array. Formally, the next element of `nums[i]` is `nums[(i + 1) % n]` and the previous element of `nums[i]` is `nums[(i - 1 + n) % n]`.\n\nA subarray may only include each element of the fixed buffer `nums` at most once.",
      functionName: "maxSubarraySumCircular",
      parameters: [{ name: "nums", type: "number[]", description: "Circular array of integers" }],
      returnType: "number",
      constraints: ["n == nums.length", "1 <= n <= 3 * 10^4", "-3 * 10^4 <= nums[i] <= 3 * 10^4"],
      examples: [
        { input: "nums = [1,-2,3,-2]", output: "3", explanation: "Subarray [3] has maximum sum 3." },
        { input: "nums = [5,-3,5]", output: "10", explanation: "Subarray [5, 5] (wrapping around) has maximum sum 10." },
        { input: "nums = [-3,-2,-3]", output: "-2", explanation: "Subarray [-2] has maximum sum -2." },
        { input: "nums = [3,-1,2,-1]", output: "4", explanation: "Circular subarray [2, -1, 3] has sum 4." }
      ],
      optimalSolution: `function maxSubarraySumCircular(nums) {\n  let totalSum = 0;\n  let curMax = 0, maxSum = nums[0];\n  let curMin = 0, minSum = nums[0];\n  for (const n of nums) {\n    curMax = Math.max(n, curMax + n);\n    maxSum = Math.max(maxSum, curMax);\n    curMin = Math.min(n, curMin + n);\n    minSum = Math.min(minSum, curMin);\n    totalSum += n;\n  }\n  if (maxSum < 0) return maxSum; // All elements negative\n  return Math.max(maxSum, totalSum - minSum);\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function maxSubarraySumCircular(nums) {\n  const n = nums.length;\n  let maxS = -Infinity;\n  for (let i = 0; i < n; i++) {\n    let s = 0;\n    for (let count = 0; count < n; count++) {\n      s += nums[(i + count) % n];\n      if (s > maxS) maxS = s;\n    }\n  }\n  return maxS;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Failing to handle the case where all numbers are negative: totalSum - minSum yields 0 (empty set), which is invalid for non-empty subarray."],
      hints: [
        "A circular subarray with maximum sum is either a non-circular max subarray OR `totalSum - minSubarraySum`.",
        "Use Kadane's algorithm to compute both maximum subarray sum and minimum subarray sum.",
        "Special edge case: if `maxSum < 0`, all elements are negative, return `maxSum` directly."
      ],
      oracleFn: (nums: number[]) => {
        let totalSum = 0;
        let curMax = 0, maxSum = nums[0];
        let curMin = 0, minSum = nums[0];
        for (const n of nums) {
          curMax = Math.max(n, curMax + n);
          maxSum = Math.max(maxSum, curMax);
          curMin = Math.min(n, curMin + n);
          minSum = Math.min(minSum, curMin);
          totalSum += n;
        }
        if (maxSum < 0) return maxSum;
        return Math.max(maxSum, totalSum - minSum);
      },
      testCases: {
        functional: [
          [[1, -2, 3, -2]],
          [[5, -3, 5]],
          [[-3, -2, -3]],
          [[3, -1, 2, -1]]
        ],
        boundary: [
          [[3]],
          [[-5]],
          [[3, -2, 2, -3]],
          [[-2, -3, -1]]
        ],
        adversarial: [
          [[2, -2, 2, 7, 8, 0]],
          [[0, 5, 8, -9, 9, -7, 3, -2]]
        ],
        stress: [
          [Array.from({ length: 1000 }, (_, i) => (i % 2 === 0 ? 5 : -3))],
          [Array.from({ length: 1500 }, () => -5)]
        ]
      }
    }),

    // 349. First Missing Positive
    createProblem({
      num: 349,
      title: "First Missing Positive",
      slug: "first-missing-positive",
      level: 16,
      difficulty: "HARD",
      topic: "Array / In-place Hash",
      patternSlug: "advanced-greedy-arrays",
      estimatedTimeMin: 25,
      statement: "Given an unsorted integer array `nums`, return the smallest positive integer that is not present in `nums`.\n\nYou must implement an algorithm that runs in `O(n)` time and uses `O(1)` auxiliary space.",
      functionName: "firstMissingPositive",
      parameters: [{ name: "nums", type: "number[]", description: "Unsorted array of integers" }],
      returnType: "number",
      constraints: ["1 <= nums.length <= 10^5", "-2^31 <= nums[i] <= 2^31 - 1"],
      examples: [
        { input: "nums = [1,2,0]", output: "3", explanation: "Numbers 1 and 2 are present, 3 is the smallest missing positive." },
        { input: "nums = [3,4,-1,1]", output: "2", explanation: "1 is present, 2 is missing." },
        { input: "nums = [7,8,9,11,12]", output: "1", explanation: "Smallest positive 1 is missing." },
        { input: "nums = [1]", output: "2", explanation: "1 is present, smallest missing is 2." }
      ],
      optimalSolution: `function firstMissingPositive(nums) {\n  const n = nums.length;\n  for (let i = 0; i < n; i++) {\n    while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {\n      const targetIdx = nums[i] - 1;\n      const temp = nums[targetIdx];\n      nums[targetIdx] = nums[i];\n      nums[i] = temp;\n    }\n  }\n  for (let i = 0; i < n; i++) {\n    if (nums[i] !== i + 1) return i + 1;\n  }\n  return n + 1;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1) in-place cycle sort",
      suboptimalSolution: `function firstMissingPositive(nums) {\n  const set = new Set(nums);\n  let i = 1;\n  while (true) {\n    if (!set.has(i)) return i;\n    i++;\n  }\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N) Set space",
      commonMistakes: ["Using `nums.indexOf` in a loop resulting in O(N^2)", "Infinite while loop when duplicate elements exist (solved with `nums[nums[i] - 1] !== nums[i]`)."],
      hints: [
        "In-place bucket sort: place each positive integer x (where 1 <= x <= n) at index x - 1.",
        "Use while loop swapping nums[i] with nums[nums[i] - 1] until nums[i] is in correct spot or out of range.",
        "Scan from 0 to n-1: the first index where nums[i] !== i + 1 gives answer i + 1."
      ],
      oracleFn: (nums: number[]) => {
        const arr = [...nums];
        const n = arr.length;
        for (let i = 0; i < n; i++) {
          while (arr[i] > 0 && arr[i] <= n && arr[arr[i] - 1] !== arr[i]) {
            const target = arr[i] - 1;
            const temp = arr[target];
            arr[target] = arr[i];
            arr[i] = temp;
          }
        }
        for (let i = 0; i < n; i++) {
          if (arr[i] !== i + 1) return i + 1;
        }
        return n + 1;
      },
      testCases: {
        functional: [
          [[1, 2, 0]],
          [[3, 4, -1, 1]],
          [[7, 8, 9, 11, 12]],
          [[1]]
        ],
        boundary: [
          [[2]],
          [[1, 1]],
          [[0]],
          [[-5, -10]]
        ],
        adversarial: [
          [[1, 2, 3, 4, 5]],
          [[2, 3, 7, 6, 8, -1, -10, 15]]
        ],
        stress: [
          [Array.from({ length: 2000 }, (_, i) => (i === 1234 ? -1 : i + 1))],
          [Array.from({ length: 2500 }, (_, i) => i + 2)]
        ]
      }
    }),

    // 350. Find the Duplicate Number
    createProblem({
      num: 350,
      title: "Find the Duplicate Number",
      slug: "find-the-duplicate-number",
      level: 16,
      difficulty: "MEDIUM",
      topic: "Two Pointers / Fast & Slow",
      patternSlug: "advanced-greedy-arrays",
      estimatedTimeMin: 20,
      statement: "Given an array of integers `nums` containing `n + 1` integers where each integer is in the range `[1, n]` inclusive.\n\nThere is only one repeated number in `nums`, return this repeated number.\n\nYou must solve the problem without modifying the array `nums` and uses only constant extra space.",
      functionName: "findDuplicate",
      parameters: [{ name: "nums", type: "number[]", description: "Array of n+1 integers in range 1..n" }],
      returnType: "number",
      constraints: ["1 <= n <= 10^5", "nums.length == n + 1", "1 <= nums[i] <= n", "All the integers in nums appear only once except for precisely one integer which appears two or more times."],
      examples: [
        { input: "nums = [1,3,4,2,2]", output: "2", explanation: "2 is repeated." },
        { input: "nums = [3,1,3,4,2]", output: "3", explanation: "3 is repeated." },
        { input: "nums = [3,3,3,3,3]", output: "3", explanation: "3 is the only value repeated." },
        { input: "nums = [1,1]", output: "1", explanation: "1 is repeated." }
      ],
      optimalSolution: `function findDuplicate(nums) {\n  let slow = nums[0];\n  let fast = nums[0];\n  do {\n    slow = nums[slow];\n    fast = nums[nums[fast]];\n  }\n  while (slow !== fast);\n  slow = nums[0];\n  while (slow !== fast) {\n    slow = nums[slow];\n    fast = nums[fast];\n  }\n  return slow;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1) Floyd's Tortoise and Hare",
      suboptimalSolution: `function findDuplicate(nums) {\n  let low = 1, high = nums.length - 1;\n  while (low < high) {\n    const mid = Math.floor((low + high) / 2);\n    let count = 0;\n    for (const num of nums) {\n      if (num <= mid) count++;\n    }\n    if (count > mid) high = mid;\n    else low = mid + 1;\n  }\n  return low;\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Modifying array in-place or sorting when constraint forbids array modification.", "Using O(N) Set memory."],
      hints: [
        "Treat the array as a linked list where index i has pointer to nums[i].",
        "Because of duplicate value, multiple nodes point to the same node, creating a cycle.",
        "Floyd's Tortoise and Hare algorithm detects the cycle entrance in O(N) time and O(1) space."
      ],
      oracleFn: (nums: number[]) => {
        let slow = nums[0];
        let fast = nums[0];
        do {
          slow = nums[slow];
          fast = nums[nums[fast]];
        } while (slow !== fast);
        slow = nums[0];
        while (slow !== fast) {
          slow = nums[slow];
          fast = nums[fast];
        }
        return slow;
      },
      testCases: {
        functional: [
          [[1, 3, 4, 2, 2]],
          [[3, 1, 3, 4, 2]],
          [[3, 3, 3, 3, 3]],
          [[1, 1]]
        ],
        boundary: [
          [[1, 2, 2]],
          [[2, 1, 1]],
          [[1, 2, 3, 4, 4]],
          [[4, 3, 1, 4, 2]]
        ],
        adversarial: [
          [[2, 5, 9, 6, 9, 3, 8, 9, 7, 1]],
          [[1, 4, 6, 6, 6, 2, 3]]
        ],
        stress: [
          [[...Array.from({ length: 1500 }, (_, i) => i + 1), 777]],
          [[...Array.from({ length: 2000 }, (_, i) => (i < 1999 ? i + 1 : 1))]]
        ]
      }
    }),

    // 351. Find All Duplicates in an Array
    createProblem({
      num: 351,
      title: "Find All Duplicates in an Array",
      slug: "find-all-duplicates-in-an-array",
      level: 16,
      difficulty: "MEDIUM",
      topic: "Array / In-place Hash",
      patternSlug: "advanced-greedy-arrays",
      estimatedTimeMin: 15,
      statement: "Given an integer array `nums` of length `n` where all the integers of `nums` are in the range `[1, n]` and each integer appears once or twice, return an array of all the integers that appear twice.\n\nYou must write an algorithm that runs in `O(n)` time and uses only constant extra space (not counting the return array).",
      functionName: "findDuplicates",
      parameters: [{ name: "nums", type: "number[]", description: "Array of integers in range 1..n" }],
      returnType: "number[]",
      constraints: ["n == nums.length", "1 <= n <= 10^5", "1 <= nums[i] <= n", "Each element in nums appears once or twice."],
      examples: [
        { input: "nums = [4,3,2,7,8,2,3,1]", output: "[2,3]", explanation: "2 and 3 appear twice." },
        { input: "nums = [1,1,2]", output: "[1]", explanation: "1 appears twice." },
        { input: "nums = [1]", output: "[]", explanation: "No duplicates." },
        { input: "nums = [2,2]", output: "[2]", explanation: "2 appears twice." }
      ],
      optimalSolution: `function findDuplicates(nums) {\n  const res = [];\n  for (let i = 0; i < nums.length; i++) {\n    const val = Math.abs(nums[i]);\n    const idx = val - 1;\n    if (nums[idx] < 0) {\n      res.push(val);\n    } else {\n      nums[idx] = -nums[idx];\n    }\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1) in-place sign negation",
      suboptimalSolution: `function findDuplicates(nums) {\n  const seen = new Set();\n  const res = [];\n  for (const n of nums) {\n    if (seen.has(n)) res.push(n);\n    else seen.add(n);\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N) Set memory",
      commonMistakes: ["Using `Math.abs` incorrectly after already negating indices."],
      hints: [
        "Use the array indices as a hash map: value x maps to index `|x| - 1`.",
        "Negate the value at index `|x| - 1` to mark presence.",
        "If `nums[|x| - 1]` is already negative, x is a duplicate!"
      ],
      oracleFn: (nums: number[]) => {
        const arr = [...nums];
        const res: number[] = [];
        for (let i = 0; i < arr.length; i++) {
          const val = Math.abs(arr[i]);
          const idx = val - 1;
          if (arr[idx] < 0) {
            res.push(val);
          } else {
            arr[idx] = -arr[idx];
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [[4, 3, 2, 7, 8, 2, 3, 1]],
          [[1, 1, 2]],
          [[1]],
          [[2, 2]]
        ],
        boundary: [
          [[1, 2, 3, 4, 5]],
          [[1, 1]],
          [[2, 1, 2]],
          [[3, 3, 1]]
        ],
        adversarial: [
          [[10, 2, 5, 10, 9, 1, 1, 4, 3, 7]],
          [[4, 3, 2, 1, 4, 3, 2, 1]]
        ],
        stress: [
          [[...Array.from({ length: 1000 }, (_, i) => i + 1), 42, 999]],
          [Array.from({ length: 1500 }, (_, i) => (i % 2 === 0 ? i / 2 + 1 : Math.floor(i / 2) + 1))]
        ]
      }
    }),

    // 352. Set Mismatch
    createProblem({
      num: 352,
      title: "Set Mismatch",
      slug: "set-mismatch",
      level: 16,
      difficulty: "EASY",
      topic: "Array / Hash Map",
      patternSlug: "advanced-greedy-arrays",
      estimatedTimeMin: 15,
      statement: "You have a set of integers `s`, which originally contains all the numbers from `1` to `n`. Unfortunately, due to some error, one of the numbers in `s` got duplicated to another number in the set, which results in repetition of one number and loss of another number.\n\nYou are given an integer array `nums` representing the data status of this set after the error.\n\nFind the number that occurs twice and the number that is missing and return them in the form of an array `[duplicate, missing]`.",
      functionName: "findErrorNums",
      parameters: [{ name: "nums", type: "number[]", description: "Array of integers with one duplicated and one missing" }],
      returnType: "number[]",
      constraints: ["2 <= nums.length <= 10^4", "1 <= nums[i] <= 10^4"],
      examples: [
        { input: "nums = [1,2,2,4]", output: "[2,3]", explanation: "2 is duplicated, 3 is missing." },
        { input: "nums = [1,1]", output: "[1,2]", explanation: "1 is duplicated, 2 is missing." },
        { input: "nums = [2,2]", output: "[2,1]", explanation: "2 is duplicated, 1 is missing." },
        { input: "nums = [3,2,2]", output: "[2,1]", explanation: "2 is duplicate, 1 missing." }
      ],
      optimalSolution: `function findErrorNums(nums) {\n  let dup = -1, missing = -1;\n  for (let i = 0; i < nums.length; i++) {\n    const val = Math.abs(nums[i]);\n    const idx = val - 1;\n    if (nums[idx] < 0) dup = val;\n    else nums[idx] = -nums[idx];\n  }\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] > 0) {\n      missing = i + 1;\n      break;\n    }\n  }\n  return [dup, missing];\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function findErrorNums(nums) {\n  const count = new Array(nums.length + 1).fill(0);\n  for (const n of nums) count[n]++;\n  let dup = -1, missing = -1;\n  for (let i = 1; i <= nums.length; i++) {\n    if (count[i] === 2) dup = i;\n    if (count[i] === 0) missing = i;\n  }\n  return [dup, missing];\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Returning `[missing, dup]` instead of `[duplicate, missing]`."],
      hints: [
        "In-place sign negation: element x marks index `|x| - 1` as negative.",
        "If index `|x| - 1` is already negative, x is the duplicate.",
        "The index that remains positive at the end corresponds to the missing number."
      ],
      oracleFn: (nums: number[]) => {
        const arr = [...nums];
        let dup = -1, missing = -1;
        for (let i = 0; i < arr.length; i++) {
          const val = Math.abs(arr[i]);
          const idx = val - 1;
          if (arr[idx] < 0) dup = val;
          else arr[idx] = -arr[idx];
        }
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] > 0) {
            missing = i + 1;
            break;
          }
        }
        return [dup, missing];
      },
      testCases: {
        functional: [
          [[1, 2, 2, 4]],
          [[1, 1]],
          [[2, 2]],
          [[3, 2, 2]]
        ],
        boundary: [
          [[1, 2, 3, 3]],
          [[4, 2, 3, 2]],
          [[1, 5, 3, 2, 2]],
          [[3, 2, 3, 4, 5]]
        ],
        adversarial: [
          [[2, 3, 2]],
          [[1, 2, 4, 4, 5, 6]]
        ],
        stress: [
          [[...Array.from({ length: 1000 }, (_, i) => i + 1).slice(0, 500), 500, ...Array.from({ length: 1000 }, (_, i) => i + 1).slice(501)]],
          [[2, ...Array.from({ length: 1500 }, (_, i) => i + 2)]]
        ]
      }
    }),

    // 353. Maximum Points You Can Obtain from Cards
    createProblem({
      num: 353,
      title: "Maximum Points You Can Obtain from Cards",
      slug: "maximum-points-you-can-obtain-from-cards",
      level: 16,
      difficulty: "MEDIUM",
      topic: "Sliding Window / Prefix Sum",
      patternSlug: "advanced-greedy-arrays",
      estimatedTimeMin: 20,
      statement: "There are several cards arranged in a row, and each card has an associated number of points. The points are given in the integer array `cardPoints`.\n\nIn one step, you can take one card from the beginning or from the end of the row. You have to take exactly `k` cards.\n\nYour score is the sum of the points of the cards you have taken. Given the integer array `cardPoints` and the integer `k`, return the maximum score you can obtain.",
      functionName: "maxScore",
      parameters: [
        { name: "cardPoints", type: "number[]", description: "Array of card point values" },
        { name: "k", type: "number", description: "Number of cards to draw" }
      ],
      returnType: "number",
      constraints: ["1 <= cardPoints.length <= 10^5", "1 <= cardPoints[i] <= 10^4", "1 <= k <= cardPoints.length"],
      examples: [
        { input: "cardPoints = [1,2,3,4,5,6,1], k = 3", output: "12", explanation: "Take 1 from beginning and 6, 1 from end: 1 + 6 + 1 = 8? Optimal is taking 3 from end: 5 + 6 + 1 = 12." },
        { input: "cardPoints = [2,2,2], k = 2", output: "4", explanation: "Any 2 cards give score 4." },
        { input: "cardPoints = [9,7,7,9,7,7,9], k = 7", output: "55", explanation: "Take all cards, sum is 55." },
        { input: "cardPoints = [1,1000,1], k = 1", output: "1", explanation: "Take 1 from end or start." }
      ],
      optimalSolution: `function maxScore(cardPoints, k) {\n  const n = cardPoints.length;\n  const windowSize = n - k;\n  let totalSum = 0;\n  for (const p of cardPoints) totalSum += p;\n  if (windowSize === 0) return totalSum;\n  let curSum = 0;\n  for (let i = 0; i < windowSize; i++) curSum += cardPoints[i];\n  let minWindowSum = curSum;\n  for (let i = windowSize; i < n; i++) {\n    curSum += cardPoints[i] - cardPoints[i - windowSize];\n    if (curSum < minWindowSum) minWindowSum = curSum;\n  }\n  return totalSum - minWindowSum;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function maxScore(cardPoints, k) {\n  let cur = 0;\n  for (let i = 0; i < k; i++) cur += cardPoints[i];\n  let maxS = cur;\n  for (let i = 0; i < k; i++) {\n    cur = cur - cardPoints[k - 1 - i] + cardPoints[cardPoints.length - 1 - i];\n    if (cur > maxS) maxS = cur;\n  }\n  return maxS;\n}`,
      suboptimalTimeComplexity: "O(k)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Greedily picking the max of left and right at each step (fails on [1, 1000, 1])."],
      hints: [
        "Inverting the problem: taking k cards from ends is equivalent to leaving a contiguous subarray of size `n - k` with the MINIMUM sum.",
        "Total sum minus minimum subarray sum of size `n - k` gives maximum score.",
        "Use sliding window of size `n - k`."
      ],
      oracleFn: (cardPoints: number[], k: number) => {
        const n = cardPoints.length;
        const windowSize = n - k;
        let totalSum = 0;
        for (const p of cardPoints) totalSum += p;
        if (windowSize === 0) return totalSum;
        let curSum = 0;
        for (let i = 0; i < windowSize; i++) curSum += cardPoints[i];
        let minWindowSum = curSum;
        for (let i = windowSize; i < n; i++) {
          curSum += cardPoints[i] - cardPoints[i - windowSize];
          if (curSum < minWindowSum) minWindowSum = curSum;
        }
        return totalSum - minWindowSum;
      },
      testCases: {
        functional: [
          [[1, 2, 3, 4, 5, 6, 1], 3],
          [[2, 2, 2], 2],
          [[9, 7, 7, 9, 7, 7, 9], 7],
          [[1, 1000, 1], 1]
        ],
        boundary: [
          [[100], 1],
          [[1, 2], 1],
          [[1, 2], 2],
          [[1, 79, 80, 1, 1, 1, 200, 1], 3]
        ],
        adversarial: [
          [[100, 40, 17, 9, 73, 75], 3],
          [[10, 1, 10, 1, 10], 3]
        ],
        stress: [
          [Array.from({ length: 2000 }, (_, i) => i + 1), 500],
          [Array.from({ length: 2000 }, () => 7), 1000]
        ]
      }
    }),

    // 354. Maximum Length of Subarray With Positive Product
    createProblem({
      num: 354,
      title: "Maximum Length of Subarray With Positive Product",
      slug: "maximum-length-of-subarray-with-positive-product",
      level: 16,
      difficulty: "MEDIUM",
      topic: "Greedy / DP",
      patternSlug: "advanced-greedy-arrays",
      estimatedTimeMin: 20,
      statement: "Given an array of integers `nums`, find the maximum length of a subarray where the product of all its elements is positive.\n\nA subarray of an array is a consecutive sequence of zero or more values taken out of that array.\n\nReturn the maximum length of a subarray with positive product.",
      functionName: "getMaxLen",
      parameters: [{ name: "nums", type: "number[]", description: "Array of integers" }],
      returnType: "number",
      constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
      examples: [
        { input: "nums = [1,-2,-3,4]", output: "4", explanation: "The product of all 4 elements is positive (24), length 4." },
        { input: "nums = [0,1,-2,-3,-4]", output: "3", explanation: "Longest subarray is [1,-2,-3] with product 6, length 3." },
        { input: "nums = [-1,-2,-3,0,1]", output: "2", explanation: "[-1,-2] has product 2, length 2." },
        { input: "nums = [-1]", output: "0", explanation: "Single negative number product is negative, length 0." }
      ],
      optimalSolution: `function getMaxLen(nums) {\n  let pos = 0, neg = 0, maxLen = 0;\n  for (const num of nums) {\n    if (num === 0) {\n      pos = 0;\n      neg = 0;\n    } else if (num > 0) {\n      pos++;\n      neg = neg > 0 ? neg + 1 : 0;\n    } else {\n      const prevPos = pos;\n      pos = neg > 0 ? neg + 1 : 0;\n      neg = prevPos + 1;\n    }\n    if (pos > maxLen) maxLen = pos;\n  }\n  return maxLen;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function getMaxLen(nums) {\n  let maxLen = 0;\n  for (let i = 0; i < nums.length; i++) {\n    let negCount = 0;\n    for (let j = i; j < nums.length; j++) {\n      if (nums[j] === 0) break;\n      if (nums[j] < 0) negCount++;\n      if (negCount % 2 === 0) maxLen = Math.max(maxLen, j - i + 1);\n    }\n  }\n  return maxLen;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Resetting negative count on zero without resetting positive length.", "Setting neg = pos + 1 before using previous pos value."],
      hints: [
        "Track `pos` (length of longest subarray ending at i with positive product) and `neg` (with negative product).",
        "If `num > 0`: pos increases by 1, neg increases by 1 (if neg > 0).",
        "If `num < 0`: pos becomes `neg > 0 ? neg + 1 : 0`, neg becomes `prevPos + 1`.",
        "If `num === 0`: reset both pos and neg to 0."
      ],
      oracleFn: (nums: number[]) => {
        let pos = 0, neg = 0, maxLen = 0;
        for (const num of nums) {
          if (num === 0) {
            pos = 0;
            neg = 0;
          } else if (num > 0) {
            pos++;
            neg = neg > 0 ? neg + 1 : 0;
          } else {
            const prevPos = pos;
            pos = neg > 0 ? neg + 1 : 0;
            neg = prevPos + 1;
          }
          if (pos > maxLen) maxLen = pos;
        }
        return maxLen;
      },
      testCases: {
        functional: [
          [[1, -2, -3, 4]],
          [[0, 1, -2, -3, -4]],
          [[-1, -2, -3, 0, 1]],
          [[-1]]
        ],
        boundary: [
          [[0]],
          [[1]],
          [[-1, -2]],
          [[-1, 0, -1]]
        ],
        adversarial: [
          [[1, 2, 3, 5, -6, 4, 0, 10]],
          [[-1, 2, -3, 4, -5]]
        ],
        stress: [
          [Array.from({ length: 2000 }, (_, i) => (i % 2 === 0 ? 1 : -1))],
          [Array.from({ length: 2000 }, (_, i) => (i % 10 === 0 ? 0 : 5))]
        ]
      }
    }),

    // 355. Non-decreasing Subsequences
    createProblem({
      num: 355,
      title: "Non-decreasing Subsequences",
      slug: "non-decreasing-subsequences",
      level: 16,
      difficulty: "MEDIUM",
      topic: "Backtracking / Array",
      patternSlug: "advanced-greedy-arrays",
      estimatedTimeMin: 25,
      statement: "Given an integer array `nums`, return all the different possible non-decreasing subsequences of the given array with at least two elements. You may return the answer in any order (sorted lexicographically for deterministic testing).\n\nNotice that the given array may contain duplicates, and two equal elements are considered non-decreasing.",
      functionName: "findSubsequences",
      parameters: [{ name: "nums", type: "number[]", description: "Array of integers" }],
      returnType: "number[][]",
      constraints: ["1 <= nums.length <= 15", "-100 <= nums[i] <= 100"],
      examples: [
        { input: "nums = [4,6,7,7]", output: "[[4,6],[4,6,7],[4,6,7,7],[4,7],[4,7,7],[6,7],[6,7,7],[7,7]]", explanation: "All 8 valid non-decreasing subsequences of length >= 2." },
        { input: "nums = [4,4,3,2,1]", output: "[[4,4]]", explanation: "Only [4,4] has length >= 2 and is non-decreasing." },
        { input: "nums = [1,2,3]", output: "[[1,2],[1,2,3],[1,3],[2,3]]", explanation: "All 4 subsequences." },
        { input: "nums = [1]", output: "[]", explanation: "Subsequences must have at least two elements." }
      ],
      optimalSolution: `function findSubsequences(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    if (path.length >= 2) res.push([...path]);\n    const used = new Set();\n    for (let i = start; i < nums.length; i++) {\n      if (used.has(nums[i])) continue;\n      if (path.length === 0 || nums[i] >= path[path.length - 1]) {\n        used.add(nums[i]);\n        path.push(nums[i]);\n        backtrack(i + 1, path);\n        path.pop();\n      }\n    }\n  }\n  backtrack(0, []);\n  return res;\n}`,
      optimalTimeComplexity: "O(2^N * N)",
      optimalSpaceComplexity: "O(N) recursion stack",
      suboptimalSolution: `function findSubsequences(nums) {\n  const res = [];\n  const seen = new Set();\n  function dfs(idx, path) {\n    if (path.length >= 2) {\n      const key = path.join(',');\n      if (!seen.has(key)) {\n        seen.add(key);\n        res.push([...path]);\n      }\n    }\n    for (let i = idx; i < nums.length; i++) {\n      if (path.length === 0 || nums[i] >= path[path.length - 1]) {\n        path.push(nums[i]);\n        dfs(i + 1, path);\n        path.pop();\n      }\n    }\n  }\n  dfs(0, []);\n  return res;\n}`,
      suboptimalTimeComplexity: "O(2^N * N)",
      suboptimalSpaceComplexity: "O(2^N * N)",
      commonMistakes: ["Sorting the initial array (subsequence problems must preserve original ordering!).", "Duplicate duplicate sequences generated without level-level used set."],
      hints: [
        "DO NOT sort nums — subsequences must maintain original array order.",
        "Use backtracking. At each recursion level, maintain a `used` set of numbers to skip duplicate elements at the same tree depth.",
        "Add path to result whenever `path.length >= 2`."
      ],
      oracleFn: (nums: number[]) => {
        const res: number[][] = [];
        function backtrack(start: number, path: number[]) {
          if (path.length >= 2) res.push([...path]);
          const used = new Set<number>();
          for (let i = start; i < nums.length; i++) {
            if (used.has(nums[i])) continue;
            if (path.length === 0 || nums[i] >= path[path.length - 1]) {
              used.add(nums[i]);
              path.push(nums[i]);
              backtrack(i + 1, path);
              path.pop();
            }
          }
        }
        backtrack(0, []);
        return res;
      },
      testCases: {
        functional: [
          [[4, 6, 7, 7]],
          [[4, 4, 3, 2, 1]],
          [[1, 2, 3]],
          [[1]]
        ],
        boundary: [
          [[]],
          [[2, 1]],
          [[1, 1, 1]],
          [[5, 4, 3, 2]]
        ],
        adversarial: [
          [[1, 2, 1, 1]],
          [[1, 3, 5, 7]]
        ],
        stress: [
          [[1, 2, 3, 4, 5, 6, 7, 8]],
          [[10, 9, 8, 7, 6, 5, 4, 3]]
        ]
      }
    })
  ];

  return {
    level: 16,
    levelTitle: "Level 16 — Greedy & Advanced Array Patterns",
    topic: "Kadane's Algorithm, State-Machine Stock Trading, In-place Bucket Sort, and Sliding Window",
    problems
  };
}
