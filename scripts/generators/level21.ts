import { LevelPayload, GeneratedProblem } from './types';
import { createProblem } from './problemBuilder';

export function getLevel21Payload(): LevelPayload {
  const problems: GeneratedProblem[] = [
    // 426. Find the Town Judge
    createProblem({
      num: 426,
      title: "Find the Town Judge",
      slug: "find-the-town-judge",
      level: 21,
      difficulty: "EASY",
      topic: "Graph / Array",
      patternSlug: "advanced-arrays-extensions",
      estimatedTimeMin: 15,
      statement: "In a town, there are `n` people labeled from `1` to `n`. There is a rumor that one of these people is secretly the town judge.\n\nIf the town judge exists, then:\n1. The town judge trusts nobody.\n2. Everybody (except for the town judge) trusts the town judge.\n3. There is exactly one person that satisfies properties 1 and 2.\n\nYou are given an array `trust` where `trust[i] = [ai, bi]` representing that the person labeled `ai` trusts the person labeled `bi`. If a trust relationship does not exist in `trust` array, then such a trust relationship does not exist.\n\nReturn the label of the town judge if the town judge exists and can be identified, or return `-1` otherwise.",
      functionName: "findJudge",
      parameters: [
        { name: "n", type: "number", description: "Number of people" },
        { name: "trust", type: "number[][]", description: "List of [a, b] trust pairs" }
      ],
      returnType: "number",
      constraints: ["1 <= n <= 1000", "0 <= trust.length <= 10^4", "trust[i].length == 2", "All pairs of trust are unique", "ai != bi", "1 <= ai, bi <= n"],
      examples: [
        { input: "n = 2, trust = [[1,2]]", output: "2", explanation: "Person 1 trusts person 2, person 2 trusts nobody. Person 2 is the judge." },
        { input: "n = 3, trust = [[1,3],[2,3]]", output: "3", explanation: "Both 1 and 2 trust 3, 3 trusts nobody. Judge is 3." },
        { input: "n = 3, trust = [[1,3],[2,3],[3,1]]", output: "-1", explanation: "Person 3 trusts person 1, so property 1 is violated." },
        { input: "n = 1, trust = []", output: "1", explanation: "Single person trusts nobody, vacuously trusted by all others." }
      ],
      optimalSolution: `function findJudge(n, trust) {\n  const delta = new Array(n + 1).fill(0);\n  for (const [a, b] of trust) {\n    delta[a]--;\n    delta[b]++;\n  }\n  for (let i = 1; i <= n; i++) {\n    if (delta[i] === n - 1) return i;\n  }\n  return -1;\n}`,
      optimalTimeComplexity: "O(N + T) where T is trust.length",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function findJudge(n, trust) {\n  const inDegree = new Array(n + 1).fill(0);\n  const outDegree = new Array(n + 1).fill(0);\n  for (const [a, b] of trust) {\n    outDegree[a]++;\n    inDegree[b]++;\n  }\n  for (let i = 1; i <= n; i++) {\n    if (inDegree[i] === n - 1 && outDegree[i] === 0) return i;\n  }\n  return -1;\n}`,
      suboptimalTimeComplexity: "O(N + T)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Failing to handle n = 1 with trust = [] where judge is 1."],
      hints: [
        "Think of trust as directed edges: person a -> person b.",
        "The judge must have in-degree = n - 1 and out-degree = 0.",
        "Track inDegree - outDegree in a single array: judge has score n - 1."
      ],
      oracleFn: (n: number, trust: number[][]) => {
        const delta = new Array(n + 1).fill(0);
        for (const [a, b] of trust) {
          delta[a]--;
          delta[b]++;
        }
        for (let i = 1; i <= n; i++) {
          if (delta[i] === n - 1) return i;
        }
        return -1;
      },
      testCases: {
        functional: [
          [2, [[1, 2]]],
          [3, [[1, 3], [2, 3]]],
          [3, [[1, 3], [2, 3], [3, 1]]],
          [1, []]
        ],
        boundary: [
          [2, []],
          [2, [[1, 2], [2, 1]]],
          [3, [[1, 2], [2, 3]]]
        ],
        adversarial: [
          [4, [[1, 3], [1, 4], [2, 3], [2, 4], [4, 3]]],
          [4, [[1, 4], [2, 4], [3, 4], [4, 1]]],
          [5, [[1, 5], [2, 5], [3, 5], [4, 5]]]
        ],
        stress: [
          [50, Array.from({ length: 49 }, (_, i) => [i + 1, 50])],
          [100, Array.from({ length: 99 }, (_, i) => [i + 1, 100])]
        ]
      }
    }),

    // 427. Find Center of Star Graph
    createProblem({
      num: 427,
      title: "Find Center of Star Graph",
      slug: "find-center-of-star-graph",
      level: 21,
      difficulty: "EASY",
      topic: "Graph / Star Topology",
      patternSlug: "advanced-arrays-extensions",
      estimatedTimeMin: 10,
      statement: "There is an undirected star graph consisting of `n` nodes labeled from `1` to `n`. A star graph is a graph where there is one center node and exactly `n - 1` edges that connect the center node with every other node.\n\nYou are given a 2D integer array `edges` where each `edges[i] = [ui, vi]` indicates that there is an edge between the nodes `ui` and `vi`. Return the center of the given star graph.",
      functionName: "findCenter",
      parameters: [{ name: "edges", type: "number[][]", description: "Array of edges" }],
      returnType: "number",
      constraints: ["3 <= n <= 10^5", "edges.length == n - 1", "edges[i].length == 2", "1 <= ui, vi <= n", "ui != vi", "The given edges represent a valid star graph."],
      examples: [
        { input: "edges = [[1,2],[2,3],[4,2]]", output: "2", explanation: "Node 2 is connected to every other node (1, 3, 4), so 2 is the center." },
        { input: "edges = [[1,2],[5,1],[1,3],[1,4]]", output: "1", explanation: "Node 1 is connected to 2, 5, 3, 4. Center is 1." },
        { input: "edges = [[1,3],[2,3]]", output: "3", explanation: "Node 3 is shared by both edges." },
        { input: "edges = [[4,5],[4,1],[4,2],[4,3]]", output: "4", explanation: "Node 4 connects to all others." }
      ],
      optimalSolution: `function findCenter(edges) {\n  const [u1, v1] = edges[0];\n  const [u2, v2] = edges[1];\n  return (u1 === u2 || u1 === v2) ? u1 : v1;\n}`,
      optimalTimeComplexity: "O(1)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function findCenter(edges) {\n  const count = new Map();\n  for (const [u, v] of edges) {\n    count.set(u, (count.get(u) || 0) + 1);\n    count.set(v, (count.get(v) || 0) + 1);\n  }\n  for (const [node, deg] of count.entries()) {\n    if (deg === edges.length) return node;\n  }\n  return -1;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Scanning all edges when inspecting just the first two edges reveals the shared center in O(1)."],
      hints: [
        "In a star graph, the center node MUST appear in every edge.",
        "Compare the first edge [u1, v1] and the second edge [u2, v2]. The common node is the center!"
      ],
      oracleFn: (edges: number[][]) => {
        const [u1, v1] = edges[0];
        const [u2, v2] = edges[1];
        return (u1 === u2 || u1 === v2) ? u1 : v1;
      },
      testCases: {
        functional: [
          [[[1, 2], [2, 3], [4, 2]]],
          [[[1, 2], [5, 1], [1, 3], [1, 4]]],
          [[[1, 3], [2, 3]]],
          [[[4, 5], [4, 1], [4, 2], [4, 3]]]
        ],
        boundary: [
          [[[1, 2], [3, 2]]],
          [[[2, 1], [1, 3]]],
          [[[3, 1], [3, 2]]]
        ],
        adversarial: [
          [[[1, 100], [2, 100], [3, 100], [4, 100]]],
          [[[10, 1], [10, 2], [10, 3]]],
          [[[7, 8], [7, 9], [7, 10]]]
        ],
        stress: [
          [Array.from({ length: 100 }, (_, i) => [i + 2, 1])],
          [Array.from({ length: 150 }, (_, i) => [50, i < 49 ? i + 1 : i + 2])]
        ]
      }
    }),

    // 428. Find the Celebrity
    createProblem({
      num: 428,
      title: "Find the Celebrity",
      slug: "find-the-celebrity",
      level: 21,
      difficulty: "MEDIUM",
      topic: "Graph / Elimination",
      patternSlug: "advanced-arrays-extensions",
      estimatedTimeMin: 20,
      statement: "Suppose you are at a party with `n` people labeled from `0` to `n - 1` and among them, there may exist one celebrity. The definition of a celebrity is that all other `n - 1` people know the celebrity, but the celebrity does not know any of them.\n\nYou are given an `n x n` binary matrix `graph` where `graph[i][j] == 1` means person `i` knows person `j`, and `graph[i][j] == 0` means person `i` does not know person `j`.\n\nReturn the celebrity's label if there is a celebrity at the party. If there is no celebrity, return `-1`.",
      functionName: "findCelebrity",
      parameters: [
        { name: "n", type: "number", description: "Number of people" },
        { name: "graph", type: "number[][]", description: "n x n acquaintance matrix" }
      ],
      returnType: "number",
      constraints: ["n == graph.length", "n == graph[i].length", "2 <= n <= 100", "graph[i][j] is 0 or 1", "graph[i][i] == 1"],
      examples: [
        { input: "n = 3, graph = [[1,1,0],[0,1,0],[1,1,1]]", output: "1", explanation: "Person 1 is known by 0 and 2, but knows nobody else (except self). Celebrity is 1." },
        { input: "n = 3, graph = [[1,0,1],[1,1,0],[0,1,1]]", output: "-1", explanation: "No celebrity exists." },
        { input: "n = 2, graph = [[1,1],[0,1]]", output: "1", explanation: "Person 1 is the celebrity." },
        { input: "n = 2, graph = [[1,0],[0,1]]", output: "-1", explanation: "Neither knows the other." }
      ],
      optimalSolution: `function findCelebrity(n, graph) {\n  let candidate = 0;\n  for (let i = 1; i < n; i++) {\n    if (graph[candidate][i] === 1) {\n      candidate = i;\n    }\n  }\n  for (let i = 0; i < n; i++) {\n    if (i === candidate) continue;\n    if (graph[candidate][i] === 1 || graph[i][candidate] === 0) {\n      return -1;\n    }\n  }\n  return candidate;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function findCelebrity(n, graph) {\n  for (let i = 0; i < n; i++) {\n    let isCeleb = true;\n    for (let j = 0; j < n; j++) {\n      if (i === j) continue;\n      if (graph[i][j] === 1 || graph[j][i] === 0) {\n        isCeleb = false;\n        break;\n      }\n    }\n    if (isCeleb) return i;\n  }\n  return -1;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Checking every pair naively in O(N^2) instead of the O(N) candidate elimination pass."],
      hints: [
        "If candidate knows i, candidate cannot be a celebrity (new candidate = i).",
        "If candidate does NOT know i, i cannot be a celebrity.",
        "One pass eliminates n - 1 people, leaving 1 candidate to verify in a second pass."
      ],
      oracleFn: (n: number, graph: number[][]) => {
        let candidate = 0;
        for (let i = 1; i < n; i++) {
          if (graph[candidate][i] === 1) {
            candidate = i;
          }
        }
        for (let i = 0; i < n; i++) {
          if (i === candidate) continue;
          if (graph[candidate][i] === 1 || graph[i][candidate] === 0) {
            return -1;
          }
        }
        return candidate;
      },
      testCases: {
        functional: [
          [3, [[1, 1, 0], [0, 1, 0], [1, 1, 1]]],
          [3, [[1, 0, 1], [1, 1, 0], [0, 1, 1]]],
          [2, [[1, 1], [0, 1]]],
          [2, [[1, 0], [0, 1]]]
        ],
        boundary: [
          [2, [[1, 1], [1, 1]]],
          [3, [[1, 0, 0], [0, 1, 0], [0, 0, 1]]],
          [3, [[1, 1, 1], [1, 1, 1], [1, 1, 1]]]
        ],
        adversarial: [
          [4, [[1, 0, 1, 0], [1, 1, 1, 0], [0, 0, 1, 0], [1, 0, 1, 1]]],
          [4, [[1, 1, 1, 1], [0, 1, 0, 0], [0, 1, 1, 0], [0, 1, 0, 1]]],
          [5, [[1, 0, 0, 1, 0], [1, 1, 0, 1, 0], [0, 0, 1, 1, 0], [0, 0, 0, 1, 0], [1, 1, 1, 1, 1]]]
        ],
        stress: [
          [20, Array.from({ length: 20 }, (_, r) => Array.from({ length: 20 }, (_, c) => (c === 7 || r === c ? 1 : 0)))],
          [30, Array.from({ length: 30 }, (_, r) => Array.from({ length: 30 }, (_, c) => (r === c ? 1 : 0)))]
        ]
      }
    }),

    // 429. Valid Mountain Array
    createProblem({
      num: 429,
      title: "Valid Mountain Array",
      slug: "valid-mountain-array",
      level: 21,
      difficulty: "EASY",
      topic: "Array / Two Pointers",
      patternSlug: "advanced-arrays-extensions",
      estimatedTimeMin: 15,
      statement: "Given an array of integers `arr`, return `true` if and only if it is a valid mountain array.\n\nRecall that `arr` is a mountain array if and only if:\n- `arr.length >= 3`\n- There exists some `i` with `0 < i < arr.length - 1` such that:\n  - `arr[0] < arr[1] < ... < arr[i - 1] < arr[i]`\n  - `arr[i] > arr[i + 1] > ... > arr[arr.length - 1]`",
      functionName: "validMountainArray",
      parameters: [{ name: "arr", type: "number[]", description: "Array of integers" }],
      returnType: "boolean",
      constraints: ["1 <= arr.length <= 10^4", "0 <= arr[i] <= 10^4"],
      examples: [
        { input: "arr = [2,1]", output: "false", explanation: "Length is less than 3." },
        { input: "arr = [3,5,5]", output: "false", explanation: "Strictly increasing condition is violated by 5 == 5." },
        { input: "arr = [0,3,2,1]", output: "true", explanation: "Peak at index 1: 0 < 3 and 3 > 2 > 1." },
        { input: "arr = [0,1,2,3,4,5,4,3,2,1,0]", output: "true", explanation: "Valid mountain with peak at 5." }
      ],
      optimalSolution: `function validMountainArray(arr) {\n  const n = arr.length;\n  if (n < 3) return false;\n  let i = 0;\n  while (i < n - 1 && arr[i] < arr[i + 1]) i++;\n  if (i === 0 || i === n - 1) return false;\n  while (i < n - 1 && arr[i] > arr[i + 1]) i++;\n  return i === n - 1;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function validMountainArray(arr) {\n  const n = arr.length;\n  if (n < 3) return false;\n  let left = 0, right = n - 1;\n  while (left < n - 1 && arr[left] < arr[left + 1]) left++;\n  while (right > 0 && arr[right] < arr[right - 1]) right--;\n  return left > 0 && right < n - 1 && left === right;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Allowing peak at index 0 or index n - 1 (monotonically decreasing or increasing is not a mountain).", "Treating plateaus (arr[i] == arr[i+1]) as valid."],
      hints: [
        "Walk up from the left while arr[i] < arr[i+1].",
        "The peak cannot be the first or last element.",
        "From the peak, walk down while arr[i] > arr[i+1]. You must reach the end."
      ],
      oracleFn: (arr: number[]) => {
        const n = arr.length;
        if (n < 3) return false;
        let i = 0;
        while (i < n - 1 && arr[i] < arr[i + 1]) i++;
        if (i === 0 || i === n - 1) return false;
        while (i < n - 1 && arr[i] > arr[i + 1]) i++;
        return i === n - 1;
      },
      testCases: {
        functional: [
          [[2, 1]],
          [[3, 5, 5]],
          [[0, 3, 2, 1]],
          [[0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0]]
        ],
        boundary: [
          [[1]],
          [[1, 2, 3]],
          [[3, 2, 1]]
        ],
        adversarial: [
          [[0, 1, 2, 1, 2]],
          [[1, 3, 2, 4, 2]],
          [[0, 2, 3, 3, 5, 2, 1, 0]]
        ],
        stress: [
          [[...Array.from({ length: 100 }, (_, i) => i), ...Array.from({ length: 100 }, (_, i) => 99 - i)]],
          [Array.from({ length: 200 }, () => 5)]
        ]
      }
    }),

    // 430. Third Maximum Number
    createProblem({
      num: 430,
      title: "Third Maximum Number",
      slug: "third-maximum-number",
      level: 21,
      difficulty: "EASY",
      topic: "Array",
      patternSlug: "advanced-arrays-extensions",
      estimatedTimeMin: 15,
      statement: "Given an integer array `nums`, return the third distinct maximum number in this array. If the third maximum does not exist, return the maximum number.",
      functionName: "thirdMax",
      parameters: [{ name: "nums", type: "number[]", description: "Array of integers" }],
      returnType: "number",
      constraints: ["1 <= nums.length <= 10^4", "-2^31 <= nums[i] <= 2^31 - 1"],
      examples: [
        { input: "nums = [3,2,1]", output: "1", explanation: "The distinct maximums are 3, 2, and 1. Third is 1." },
        { input: "nums = [1,2]", output: "2", explanation: "Third distinct maximum does not exist, so the maximum (2) is returned." },
        { input: "nums = [2,2,3,1]", output: "1", explanation: "Distinct maximums: 3, 2, 1. Third is 1." },
        { input: "nums = [5]", output: "5", explanation: "Single element returned." }
      ],
      optimalSolution: `function thirdMax(nums) {\n  let m1 = -Infinity, m2 = -Infinity, m3 = -Infinity;\n  for (const x of nums) {\n    if (x === m1 || x === m2 || x === m3) continue;\n    if (x > m1) {\n      m3 = m2;\n      m2 = m1;\n      m1 = x;\n    } else if (x > m2) {\n      m3 = m2;\n      m2 = x;\n    } else if (x > m3) {\n      m3 = x;\n    }\n  }\n  return m3 === -Infinity ? m1 : m3;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function thirdMax(nums) {\n  const unique = Array.from(new Set(nums)).sort((a, b) => b - a);\n  return unique.length >= 3 ? unique[2] : unique[0];\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Failing to handle distinctness (e.g. duplicates like [2, 2, 3, 1] must only count unique numbers).", "Numbers equal to -Infinity or Number.MIN_SAFE_INTEGER."],
      hints: [
        "Maintain three variables m1, m2, m3 representing the top 3 distinct values.",
        "If m3 is never updated, return m1."
      ],
      oracleFn: (nums: number[]) => {
        let m1 = -Infinity, m2 = -Infinity, m3 = -Infinity;
        for (const x of nums) {
          if (x === m1 || x === m2 || x === m3) continue;
          if (x > m1) {
            m3 = m2;
            m2 = m1;
            m1 = x;
          } else if (x > m2) {
            m3 = m2;
            m2 = x;
          } else if (x > m3) {
            m3 = x;
          }
        }
        return m3 === -Infinity ? m1 : m3;
      },
      testCases: {
        functional: [
          [[3, 2, 1]],
          [[1, 2]],
          [[2, 2, 3, 1]],
          [[5]]
        ],
        boundary: [
          [[1, 1, 1]],
          [[1, 2, -2147483648]],
          [[-1, -2, -3]]
        ],
        adversarial: [
          [[1, 2, 2, 5, 3, 5]],
          [[1, -2147483648, 2]],
          [[5, 2, 2]]
        ],
        stress: [
          [Array.from({ length: 100 }, (_, i) => i * 2)],
          [Array.from({ length: 150 }, (_, i) => (i % 2 === 0 ? 10 : 20))]
        ]
      }
    }),

    // 431. Find the Winner of the Circular Game
    createProblem({
      num: 431,
      title: "Find the Winner of the Circular Game",
      slug: "find-the-winner-of-the-circular-game",
      level: 21,
      difficulty: "MEDIUM",
      topic: "Array / Josephus Problem",
      patternSlug: "advanced-arrays-extensions",
      estimatedTimeMin: 20,
      statement: "There are `n` friends that are playing a game. The friends are sitting in a circle and are numbered from `1` to `n` in clockwise order. More formally, moving clockwise from the `i-th` friend brings you to the `(i+1)-th` friend for `1 <= i < n`, and moving clockwise from the `n-th` friend brings you to the `1st` friend.\n\nThe rules of the game are as follows:\n1. Start at the `1st` friend.\n2. Count the next `k` friends in the clockwise direction including the friend you started at. The counting wraps around the circle and may count some friends more than once.\n3. The last friend you counted leaves the circle and loses the game.\n4. If there is still more than one friend in the circle, go back to step 2 starting from the friend immediately clockwise of the friend who just lost and repeat.\n5. Else, the last friend in the circle wins the game.\n\nGiven the number of friends, `n`, and an integer `k`, return the winner of the game.",
      functionName: "findTheWinner",
      parameters: [
        { name: "n", type: "number", description: "Number of friends" },
        { name: "k", type: "number", description: "Step count to eliminate" }
      ],
      returnType: "number",
      constraints: ["1 <= k <= n <= 500"],
      examples: [
        { input: "n = 5, k = 2", output: "3", explanation: "Friends leave in order: 2, 4, 1, 5. Winner is 3." },
        { input: "n = 6, k = 5", output: "1", explanation: "Friends leave in order: 5, 4, 6, 2, 3. Winner is 1." },
        { input: "n = 1, k = 1", output: "1", explanation: "Single friend wins immediately." },
        { input: "n = 3, k = 1", output: "3", explanation: "Friends 1 and 2 eliminated in order, friend 3 wins." }
      ],
      optimalSolution: `function findTheWinner(n, k) {\n  let winner = 0;\n  for (let i = 2; i <= n; i++) {\n    winner = (winner + k) % i;\n  }\n  return winner + 1;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function findTheWinner(n, k) {\n  const circle = Array.from({ length: n }, (_, i) => i + 1);\n  let idx = 0;\n  while (circle.length > 1) {\n    idx = (idx + k - 1) % circle.length;\n    circle.splice(idx, 1);\n  }\n  return circle[0];\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Using O(N^2) array splicing when iterative Josephus recurrence runs in O(N) time and O(1) space."],
      hints: [
        "This is the classic Josephus problem.",
        "Recurrence: f(n, k) = (f(n - 1, k) + k) % n with f(1, k) = 0 (0-indexed).",
        "Add 1 to convert to 1-indexed."
      ],
      oracleFn: (n: number, k: number) => {
        let winner = 0;
        for (let i = 2; i <= n; i++) {
          winner = (winner + k) % i;
        }
        return winner + 1;
      },
      testCases: {
        functional: [
          [5, 2],
          [6, 5],
          [1, 1],
          [3, 1]
        ],
        boundary: [
          [2, 1],
          [2, 2],
          [4, 4]
        ],
        adversarial: [
          [10, 3],
          [7, 7],
          [15, 2]
        ],
        stress: [
          [300, 17],
          [500, 499]
        ]
      }
    }),

    // 432. Rotate Array
    createProblem({
      num: 432,
      title: "Rotate Array",
      slug: "rotate-array",
      level: 21,
      difficulty: "MEDIUM",
      topic: "Array / In-Place Reversal",
      patternSlug: "advanced-arrays-extensions",
      estimatedTimeMin: 20,
      statement: "Given an integer array `nums`, rotate the array to the right by `k` steps, where `k` is non-negative.\n\nModify `nums` in-place with O(1) extra space and return `nums`.",
      functionName: "rotate",
      parameters: [
        { name: "nums", type: "number[]", description: "Array to rotate" },
        { name: "k", type: "number", description: "Number of steps" }
      ],
      returnType: "number[]",
      constraints: ["1 <= nums.length <= 10^5", "-2^31 <= nums[i] <= 2^31 - 1", "0 <= k <= 10^5"],
      examples: [
        { input: "nums = [1,2,3,4,5,6,7], k = 3", output: "[5,6,7,1,2,3,4]", explanation: "rotate 1 steps: [7,1,2,3,4,5,6], rotate 2 steps: [6,7,1,2,3,4,5], rotate 3 steps: [5,6,7,1,2,3,4]." },
        { input: "nums = [-1,-100,3,99], k = 2", output: "[3,99,-1,-100]", explanation: "Rotate by 2 steps." },
        { input: "nums = [1], k = 0", output: "[1]", explanation: "No rotation." },
        { input: "nums = [1,2], k = 3", output: "[2,1]", explanation: "k = 3 % 2 = 1 rotation." }
      ],
      optimalSolution: `function rotate(nums, k) {\n  k = k % nums.length;\n  function reverse(l, r) {\n    while (l < r) {\n      const tmp = nums[l];\n      nums[l] = nums[r];\n      nums[r] = tmp;\n      l++;\n      r--;\n    }\n  }\n  reverse(0, nums.length - 1);\n  reverse(0, k - 1);\n  reverse(k, nums.length - 1);\n  return nums;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function rotate(nums, k) {\n  k = k % nums.length;\n  const copy = [...nums];\n  for (let i = 0; i < nums.length; i++) {\n    nums[(i + k) % nums.length] = copy[i];\n  }\n  return nums;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Forgetting k % nums.length when k > nums.length.", "O(N*k) repeated single-element shifts causing TLE."],
      hints: [
        "First take k = k % nums.length.",
        "Triple reversal algorithm: reverse whole array, reverse first k elements, reverse remaining n - k elements."
      ],
      oracleFn: (nums: number[], k: number) => {
        k = k % nums.length;
        const reverse = (l: number, r: number) => {
          while (l < r) {
            const tmp = nums[l];
            nums[l] = nums[r];
            nums[r] = tmp;
            l++;
            r--;
          }
        };
        reverse(0, nums.length - 1);
        reverse(0, k - 1);
        reverse(k, nums.length - 1);
        return nums;
      },
      testCases: {
        functional: [
          [[1, 2, 3, 4, 5, 6, 7], 3],
          [[-1, -100, 3, 99], 2],
          [[1], 0],
          [[1, 2], 3]
        ],
        boundary: [
          [[1, 2], 0],
          [[1, 2], 2],
          [[1, 2], 4]
        ],
        adversarial: [
          [[1, 2, 3, 4, 5, 6], 11],
          [[1, 2, 3], 200000],
          [[1, 2, 3, 4], 2]
        ],
        stress: [
          [Array.from({ length: 100 }, (_, i) => i), 47],
          [Array.from({ length: 200 }, (_, i) => i * 3), 99]
        ]
      }
    }),

    // 433. Array Partition
    createProblem({
      num: 433,
      title: "Array Partition",
      slug: "array-partition",
      level: 21,
      difficulty: "EASY",
      topic: "Array / Sorting / Greedy",
      patternSlug: "advanced-arrays-extensions",
      estimatedTimeMin: 15,
      statement: "Given an integer array `nums` of `2n` integers, group these integers into `n` pairs `(a1, b1), (a2, b2), ..., (an, bn)` such that the sum of `min(ai, bi)` for all `i` is maximized. Return the maximized sum.",
      functionName: "arrayPairSum",
      parameters: [{ name: "nums", type: "number[]", description: "Array of 2n integers" }],
      returnType: "number",
      constraints: ["1 <= n <= 10^4", "nums.length == 2 * n", "-10^4 <= nums[i] <= 10^4"],
      examples: [
        { input: "nums = [1,4,3,2]", output: "4", explanation: "Pairs: (1, 2), (3, 4). min(1, 2) + min(3, 4) = 1 + 3 = 4." },
        { input: "nums = [6,2,6,5,1,2]", output: "9", explanation: "Pairs: (1, 2), (2, 5), (6, 6). min(1, 2) + min(2, 5) + min(6, 6) = 1 + 2 + 6 = 9." },
        { input: "nums = [1,1]", output: "1", explanation: "Single pair (1, 1), min is 1." },
        { input: "nums = [-1,-2,-3,-4]", output: "-5", explanation: "(-4, -3), (-2, -1) -> -4 + -2 = -6, wait: (-4, -3) and (-2, -1) gives -4 + -2 = -6; sorted is [-4, -3, -2, -1], sum at even indices is -4 + -2 = -6." }
      ],
      optimalSolution: `function arrayPairSum(nums) {\n  nums.sort((a, b) => a - b);\n  let sum = 0;\n  for (let i = 0; i < nums.length; i += 2) {\n    sum += nums[i];\n  }\n  return sum;\n}`,
      optimalTimeComplexity: "O(N log N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function arrayPairSum(nums) {\n  const sorted = [...nums].sort((a, b) => a - b);\n  return sorted.reduce((acc, val, idx) => idx % 2 === 0 ? acc + val : acc, 0);\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Pairing distant elements which throws away large values."],
      hints: [
        "Sort the array ascending.",
        "Pair adjacent numbers (nums[2i], nums[2i+1]) so that the smaller element sacrfices as little value as possible.",
        "Sum elements at even indices."
      ],
      oracleFn: (nums: number[]) => {
        const sorted = [...nums].sort((a, b) => a - b);
        let sum = 0;
        for (let i = 0; i < sorted.length; i += 2) {
          sum += sorted[i];
        }
        return sum;
      },
      testCases: {
        functional: [
          [[1, 4, 3, 2]],
          [[6, 2, 6, 5, 1, 2]],
          [[1, 1]],
          [[-1, -2, -3, -4]]
        ],
        boundary: [
          [[0, 0]],
          [[10, -10]],
          [[5, 2]]
        ],
        adversarial: [
          [[1, 100, 2, 99]],
          [[-100, -50, 0, 50]],
          [[7, 3, 1, 0, 0, 6]]
        ],
        stress: [
          [Array.from({ length: 100 }, (_, i) => i - 50)],
          [Array.from({ length: 120 }, (_, i) => (i * 7) % 30)]
        ]
      }
    }),

    // 434. Maximum Product of Two Elements in an Array
    createProblem({
      num: 434,
      title: "Maximum Product of Two Elements in an Array",
      slug: "maximum-product-of-two-elements-in-an-array",
      level: 21,
      difficulty: "EASY",
      topic: "Array",
      patternSlug: "advanced-arrays-extensions",
      estimatedTimeMin: 10,
      statement: "Given the array of integers `nums`, you will choose two different indices `i` and `j` of that array. Return the maximum value of `(nums[i]-1)*(nums[j]-1)`.",
      functionName: "maxProduct",
      parameters: [{ name: "nums", type: "number[]", description: "Array of positive integers" }],
      returnType: "number",
      constraints: ["2 <= nums.length <= 500", "1 <= nums[i] <= 10^3"],
      examples: [
        { input: "nums = [3,4,5,2]", output: "12", explanation: "Choose indices 1 and 2: (4 - 1) * (5 - 1) = 3 * 4 = 12." },
        { input: "nums = [1,5,4,5]", output: "16", explanation: "Choose indices 1 and 3: (5 - 1) * (5 - 1) = 16." },
        { input: "nums = [3,7]", output: "12", explanation: "(3 - 1) * (7 - 1) = 2 * 6 = 12." },
        { input: "nums = [2,2]", output: "1", explanation: "(2 - 1) * (2 - 1) = 1." }
      ],
      optimalSolution: `function maxProduct(nums) {\n  let max1 = 0, max2 = 0;\n  for (const x of nums) {\n    if (x > max1) {\n      max2 = max1;\n      max1 = x;\n    } else if (x > max2) {\n      max2 = x;\n    }\n  }\n  return (max1 - 1) * (max2 - 1);\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function maxProduct(nums) {\n  nums.sort((a, b) => b - a);\n  return (nums[0] - 1) * (nums[1] - 1);\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Sorting in O(N log N) when a single O(N) pass finding the two largest numbers suffices."],
      hints: [
        "Since all numbers are positive, maximizing the product means choosing the two largest numbers in the array.",
        "Track max1 and max2 in a single pass."
      ],
      oracleFn: (nums: number[]) => {
        let max1 = 0, max2 = 0;
        for (const x of nums) {
          if (x > max1) {
            max2 = max1;
            max1 = x;
          } else if (x > max2) {
            max2 = x;
          }
        }
        return (max1 - 1) * (max2 - 1);
      },
      testCases: {
        functional: [
          [[3, 4, 5, 2]],
          [[1, 5, 4, 5]],
          [[3, 7]],
          [[2, 2]]
        ],
        boundary: [
          [[1, 1]],
          [[1, 2]],
          [[1000, 1000]]
        ],
        adversarial: [
          [[10, 2, 5, 2]],
          [[2, 9, 3, 8]],
          [[1, 1, 1, 1]]
        ],
        stress: [
          [Array.from({ length: 100 }, (_, i) => i + 1)],
          [Array.from({ length: 200 }, (_, i) => (i % 10) + 1)]
        ]
      }
    }),

    // 435. Maximum Subsequence Score
    createProblem({
      num: 435,
      title: "Maximum Subsequence Score",
      slug: "maximum-subsequence-score",
      level: 21,
      difficulty: "MEDIUM",
      topic: "Array / Priority Queue / Sorting",
      patternSlug: "advanced-arrays-extensions",
      estimatedTimeMin: 25,
      statement: "You are given two 0-indexed integer arrays `nums1` and `nums2` of equal length `n` and a positive integer `k`. You must choose a subsequence of indices from `nums1` of length `k`.\n\nFor chosen indices `i0, i1, ..., ik - 1`, your score is defined as:\n- The sum of the selected elements from `nums1` multiplied with the minimum of the selected elements from `nums2`.\n- It can be written as `(nums1[i0] + nums1[i1] + ... + nums1[ik - 1]) * min(nums2[i0], nums2[i1], ..., nums2[ik - 1])`.\n\nReturn the maximum possible score.",
      functionName: "maxScore",
      parameters: [
        { name: "nums1", type: "number[]", description: "First array" },
        { name: "nums2", type: "number[]", description: "Second array" },
        { name: "k", type: "number", description: "Subsequence size" }
      ],
      returnType: "number",
      constraints: ["n == nums1.length == nums2.length", "1 <= n <= 10^5", "0 <= nums1[i] <= 10^5", "1 <= nums2[i] <= 10^5", "1 <= k <= n"],
      examples: [
        { input: "nums1 = [1,3,3,2], nums2 = [2,1,3,4], k = 3", output: "12", explanation: "Choose indices 0, 2, 3: sum = 1 + 3 + 2 = 6, min(nums2) = min(2, 3, 4) = 2. Score = 6 * 2 = 12." },
        { input: "nums1 = [4,2,3,1,1], nums2 = [7,5,10,9,6], k = 1", output: "30", explanation: "Choose index 2: 3 * 10 = 30." },
        { input: "nums1 = [2,1], nums2 = [3,4], k = 2", output: "9", explanation: "(2 + 1) * 3 = 9." },
        { input: "nums1 = [5], nums2 = [10], k = 1", output: "50", explanation: "5 * 10 = 50." }
      ],
      optimalSolution: `function maxScore(nums1, nums2, k) {\n  const pairs = nums1.map((n1, i) => [nums2[i], n1]);\n  pairs.sort((a, b) => b[0] - a[0]);\n  const minHeap = [];\n  let sum = 0, maxTotal = 0;\n  for (const [n2, n1] of pairs) {\n    minHeap.push(n1);\n    sum += n1;\n    minHeap.sort((a, b) => a - b);\n    if (minHeap.length > k) {\n      sum -= minHeap.shift();\n    }\n    if (minHeap.length === k) {\n      maxTotal = Math.max(maxTotal, sum * n2);\n    }\n  }\n  return maxTotal;\n}`,
      optimalTimeComplexity: "O(N log N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function maxScore(nums1, nums2, k) {\n  const pairs = nums1.map((n1, i) => [nums2[i], n1]);\n  pairs.sort((a, b) => b[0] - a[0]);\n  let maxScore = 0;\n  for (let i = k - 1; i < pairs.length; i++) {\n    const pool = pairs.slice(0, i + 1).map(p => p[1]).sort((a, b) => b - a);\n    const sum = pool.slice(0, k).reduce((a, b) => a + b, 0);\n    maxScore = Math.max(maxScore, sum * pairs[i][0]);\n  }\n  return maxScore;\n}`,
      suboptimalTimeComplexity: "O(N^2 log N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Sorting by nums1 instead of sorting by nums2 descending."],
      hints: [
        "Sort pairs by nums2 descending so that every candidate pair visited defines the current minimum nums2 element.",
        "Maintain the k largest nums1 elements seen so far using a min-heap."
      ],
      oracleFn: (nums1: number[], nums2: number[], k: number) => {
        const pairs = nums1.map((n1, i) => [nums2[i], n1]);
        pairs.sort((a, b) => b[0] - a[0]);
        const minHeap: number[] = [];
        let sum = 0, maxTotal = 0;
        for (const [n2, n1] of pairs) {
          minHeap.push(n1);
          sum += n1;
          minHeap.sort((a, b) => a - b);
          if (minHeap.length > k) {
            sum -= minHeap.shift()!;
          }
          if (minHeap.length === k) {
            maxTotal = Math.max(maxTotal, sum * n2);
          }
        }
        return maxTotal;
      },
      testCases: {
        functional: [
          [[1, 3, 3, 2], [2, 1, 3, 4], 3],
          [[4, 2, 3, 1, 1], [7, 5, 10, 9, 6], 1],
          [[2, 1], [3, 4], 2],
          [[5], [10], 1]
        ],
        boundary: [
          [[1, 2], [1, 2], 1],
          [[1, 2], [1, 2], 2],
          [[10, 20, 30], [5, 5, 5], 2]
        ],
        adversarial: [
          [[10, 10, 10], [1, 2, 3], 2],
          [[1, 100, 1], [100, 1, 100], 2],
          [[5, 4, 3, 2, 1], [1, 2, 3, 4, 5], 3]
        ],
        stress: [
          [Array.from({ length: 50 }, (_, i) => i + 1), Array.from({ length: 50 }, (_, i) => 50 - i), 10],
          [Array.from({ length: 60 }, (_, i) => (i * 3) % 20), Array.from({ length: 60 }, (_, i) => (i * 7) % 30 + 1), 15]
        ]
      }
    }),

    // 436. Maximum Sum With Exactly K Elements
    createProblem({
      num: 436,
      title: "Maximum Sum With Exactly K Elements",
      slug: "maximum-sum-with-exactly-k-elements",
      level: 21,
      difficulty: "EASY",
      topic: "Array / Greedy / Math",
      patternSlug: "advanced-arrays-extensions",
      estimatedTimeMin: 10,
      statement: "You are given a 0-indexed integer array `nums` and an integer `k`. Your task is to perform the following operation exactly `k` times in order to maximize your score:\n1. Select an element `m` from `nums`.\n2. Remove the selected element `m` from the array.\n3. Add a new element with a value of `m + 1` to the array.\n4. Increase your score by `m`.\n\nReturn the maximum score you can achieve after performing the operation exactly `k` times.",
      functionName: "maximizeSum",
      parameters: [
        { name: "nums", type: "number[]", description: "Array of integers" },
        { name: "k", type: "number", description: "Number of operations" }
      ],
      returnType: "number",
      constraints: ["1 <= nums.length <= 100", "1 <= nums[i] <= 100", "1 <= k <= 100"],
      examples: [
        { input: "nums = [1,2,3,4,5], k = 3", output: "18", explanation: "Pick 5 (score 5, insert 6), pick 6 (score 6, insert 7), pick 7 (score 7). Total = 5 + 6 + 7 = 18." },
        { input: "nums = [5,5,5], k = 2", output: "11", explanation: "5 + 6 = 11." },
        { input: "nums = [1], k = 1", output: "1", explanation: "Single element operation." },
        { input: "nums = [1,2,3], k = 5", output: "25", explanation: "3 + 4 + 5 + 6 + 7 = 25." }
      ],
      optimalSolution: `function maximizeSum(nums, k) {\n  let maxVal = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    if (nums[i] > maxVal) maxVal = nums[i];\n  }\n  return maxVal * k + (k * (k - 1)) / 2;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function maximizeSum(nums, k) {\n  let maxVal = Math.max(...nums);\n  let score = 0;\n  for (let i = 0; i < k; i++) {\n    score += maxVal;\n    maxVal++;\n  }\n  return score;\n}`,
      suboptimalTimeComplexity: "O(N + K)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Selecting sub-optimal numbers instead of repeatedly incrementing the global maximum."],
      hints: [
        "Greedily select the maximum element M in the array every time.",
        "The score is M + (M + 1) + ... + (M + k - 1) = M * k + k * (k - 1) / 2."
      ],
      oracleFn: (nums: number[], k: number) => {
        let maxVal = nums[0];
        for (let i = 1; i < nums.length; i++) {
          if (nums[i] > maxVal) maxVal = nums[i];
        }
        return maxVal * k + (k * (k - 1)) / 2;
      },
      testCases: {
        functional: [
          [[1, 2, 3, 4, 5], 3],
          [[5, 5, 5], 2],
          [[1], 1],
          [[1, 2, 3], 5]
        ],
        boundary: [
          [[100], 1],
          [[1], 100],
          [[1, 100], 10]
        ],
        adversarial: [
          [[10, 20, 30], 10],
          [[99, 99, 99], 5],
          [[5, 4, 3, 2, 1], 4]
        ],
        stress: [
          [Array.from({ length: 80 }, (_, i) => i + 1), 50],
          [Array.from({ length: 100 }, () => 10), 100]
        ]
      }
    }),

    // 437. Minimum Average Difference
    createProblem({
      num: 437,
      title: "Minimum Average Difference",
      slug: "minimum-average-difference",
      level: 21,
      difficulty: "MEDIUM",
      topic: "Array / Prefix Sum",
      patternSlug: "advanced-arrays-extensions",
      estimatedTimeMin: 20,
      statement: "You are given a 0-indexed integer array `nums` of length `n`.\n\nThe average difference of the index `i` is the absolute difference between the average of the first `i + 1` elements of `nums` and the average of the last `n - i - 1` elements. Both averages should be rounded down to the nearest integer.\n\nReturn the index with the minimum average difference. If there are multiple such indices, return the smallest one.\n\nNote: The average of 0 elements is considered to be 0.",
      functionName: "minimumAverageDifference",
      parameters: [{ name: "nums", type: "number[]", description: "Array of integers" }],
      returnType: "number",
      constraints: ["1 <= nums.length <= 10^5", "0 <= nums[i] <= 10^5"],
      examples: [
        { input: "nums = [2,5,3,9,5,3]", output: "3", explanation: "At index 3: first 4 elements average = floor(19/4) = 4; last 2 elements average = floor(8/2) = 4. Diff = |4 - 4| = 0. Min diff index is 3." },
        { input: "nums = [0]", output: "0", explanation: "Single element index 0." },
        { input: "nums = [4,2,0]", output: "2", explanation: "At index 2: avg(4,2,0) = 2, avg(empty) = 0, diff = 2. Index 2 gives minimal diff." },
        { input: "nums = [1,1,1,1]", output: "0", explanation: "All indices have average difference 0; return smallest index 0." }
      ],
      optimalSolution: `function minimumAverageDifference(nums) {\n  const n = nums.length;\n  let totalSum = 0;\n  for (const x of nums) totalSum += x;\n  let leftSum = 0, minDiff = Infinity, bestIdx = 0;\n  for (let i = 0; i < n; i++) {\n    leftSum += nums[i];\n    const rightSum = totalSum - leftSum;\n    const leftAvg = Math.floor(leftSum / (i + 1));\n    const rightAvg = (n - i - 1 === 0) ? 0 : Math.floor(rightSum / (n - i - 1));\n    const diff = Math.abs(leftAvg - rightAvg);\n    if (diff < minDiff) {\n      minDiff = diff;\n      bestIdx = i;\n    }\n  }\n  return bestIdx;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function minimumAverageDifference(nums) {\n  const n = nums.length;\n  const prefix = new Array(n + 1).fill(0);\n  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];\n  let minDiff = Infinity, res = 0;\n  for (let i = 0; i < n; i++) {\n    const leftAvg = Math.floor(prefix[i + 1] / (i + 1));\n    const rightCount = n - i - 1;\n    const rightAvg = rightCount === 0 ? 0 : Math.floor((prefix[n] - prefix[i + 1]) / rightCount);\n    const diff = Math.abs(leftAvg - rightAvg);\n    if (diff < minDiff) { minDiff = diff; res = i; }\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Dividing by zero when i = n - 1 (the remaining elements count is 0, defined as 0 average)."],
      hints: [
        "Precompute total sum of nums.",
        "Iterate i from 0 to n - 1, keeping running sum of left prefix.",
        "Beware division by zero when i == n - 1: rightAvg = 0."
      ],
      oracleFn: (nums: number[]) => {
        const n = nums.length;
        let totalSum = 0;
        for (const x of nums) totalSum += x;
        let leftSum = 0, minDiff = Infinity, bestIdx = 0;
        for (let i = 0; i < n; i++) {
          leftSum += nums[i];
          const rightSum = totalSum - leftSum;
          const leftAvg = Math.floor(leftSum / (i + 1));
          const rightAvg = (n - i - 1 === 0) ? 0 : Math.floor(rightSum / (n - i - 1));
          const diff = Math.abs(leftAvg - rightAvg);
          if (diff < minDiff) {
            minDiff = diff;
            bestIdx = i;
          }
        }
        return bestIdx;
      },
      testCases: {
        functional: [
          [[2, 5, 3, 9, 5, 3]],
          [[0]],
          [[4, 2, 0]],
          [[1, 1, 1, 1]]
        ],
        boundary: [
          [[1, 2]],
          [[10, 0]],
          [[0, 10]]
        ],
        adversarial: [
          [[100000, 100000, 100000]],
          [[1, 2, 3, 4, 5]],
          [[5, 4, 3, 2, 1]]
        ],
        stress: [
          [Array.from({ length: 100 }, (_, i) => i * 10)],
          [Array.from({ length: 150 }, () => 7)]
        ]
      }
    }),

    // 438. Find the Difference of Two Arrays
    createProblem({
      num: 438,
      title: "Find the Difference of Two Arrays",
      slug: "find-the-difference-of-two-arrays",
      level: 21,
      difficulty: "EASY",
      topic: "Array / Hash Table",
      patternSlug: "advanced-arrays-extensions",
      estimatedTimeMin: 15,
      statement: "Given two 0-indexed integer arrays `nums1` and `nums2`, return a list `answer` of size 2 where:\n- `answer[0]` is a list of all distinct integers in `nums1` which are not present in `nums2`.\n- `answer[1]` is a list of all distinct integers in `nums2` which are not present in `nums1`.\n\nNote that the integers in the lists may be returned in any order (sort both sub-arrays for deterministic verification).",
      functionName: "findDifference",
      parameters: [
        { name: "nums1", type: "number[]", description: "First array" },
        { name: "nums2", type: "number[]", description: "Second array" }
      ],
      returnType: "number[][]",
      constraints: ["1 <= nums1.length, nums2.length <= 1000", "-1000 <= nums1[i], nums2[i] <= 1000"],
      examples: [
        { input: "nums1 = [1,2,3], nums2 = [2,4,6]", output: "[[1,3],[4,6]]", explanation: "1, 3 are in nums1 not nums2; 4, 6 are in nums2 not nums1." },
        { input: "nums1 = [1,2,3,3], nums2 = [1,1,2,2]", output: "[[3],[]]", explanation: "Only 3 is in nums1 not nums2; nums2 has no distinct element absent from nums1." },
        { input: "nums1 = [1], nums2 = [1]", output: "[[],[]]", explanation: "Both arrays have identical elements." },
        { input: "nums1 = [1], nums2 = [2]", output: "[[1],[2]]", explanation: "Disjoint elements." }
      ],
      optimalSolution: `function findDifference(nums1, nums2) {\n  const s1 = new Set(nums1);\n  const s2 = new Set(nums2);\n  const r1 = [];\n  for (const x of s1) if (!s2.has(x)) r1.push(x);\n  const r2 = [];\n  for (const x of s2) if (!s1.has(x)) r2.push(x);\n  return [r1.sort((a, b) => a - b), r2.sort((a, b) => a - b)];\n}`,
      optimalTimeComplexity: "O(N + M)",
      optimalSpaceComplexity: "O(N + M)",
      suboptimalSolution: `function findDifference(nums1, nums2) {\n  const r1 = Array.from(new Set(nums1.filter(x => !nums2.includes(x))));\n  const r2 = Array.from(new Set(nums2.filter(x => !nums1.includes(x))));\n  return [r1.sort((a, b) => a - b), r2.sort((a, b) => a - b)];\n}`,
      suboptimalTimeComplexity: "O(N * M)",
      suboptimalSpaceComplexity: "O(N + M)",
      commonMistakes: ["Failing to deduplicate elements in the output lists."],
      hints: [
        "Store elements of both arrays in Hash Sets.",
        "Filter each set for elements not contained in the other."
      ],
      oracleFn: (nums1: number[], nums2: number[]) => {
        const s1 = new Set(nums1);
        const s2 = new Set(nums2);
        const r1: number[] = [];
        for (const x of s1) if (!s2.has(x)) r1.push(x);
        const r2: number[] = [];
        for (const x of s2) if (!s1.has(x)) r2.push(x);
        return [r1.sort((a, b) => a - b), r2.sort((a, b) => a - b)];
      },
      testCases: {
        functional: [
          [[1, 2, 3], [2, 4, 6]],
          [[1, 2, 3, 3], [1, 1, 2, 2]],
          [[1], [1]],
          [[1], [2]]
        ],
        boundary: [
          [[-1000], [1000]],
          [[0, 0, 0], [0]],
          [[1, 2], [3, 4]]
        ],
        adversarial: [
          [[1, 2, 3, 4, 5], [5, 4, 3, 2, 1]],
          [[10, 20, 30], [20, 30, 40]],
          [[5, 5, 5], [1, 2, 3]]
        ],
        stress: [
          [Array.from({ length: 80 }, (_, i) => i), Array.from({ length: 80 }, (_, i) => i + 40)],
          [Array.from({ length: 100 }, (_, i) => i * 2), Array.from({ length: 100 }, (_, i) => i * 3)]
        ]
      }
    }),

    // 439. Intersection of Multiple Arrays
    createProblem({
      num: 439,
      title: "Intersection of Multiple Arrays",
      slug: "intersection-of-multiple-arrays",
      level: 21,
      difficulty: "EASY",
      topic: "Array / Hash Table",
      patternSlug: "advanced-arrays-extensions",
      estimatedTimeMin: 15,
      statement: "Given a 2D integer array `nums` where `nums[i]` is a non-empty array of distinct positive integers, return the list of integers that are present in each array of `nums` sorted in ascending order.",
      functionName: "intersection",
      parameters: [{ name: "nums", type: "number[][]", description: "2D array of distinct positive integers" }],
      returnType: "number[]",
      constraints: ["1 <= nums.length <= 1000", "1 <= sum(nums[i].length) <= 1000", "1 <= nums[i][j] <= 1000", "All the values of nums[i] are unique."],
      examples: [
        { input: "nums = [[3,1,2,4,5],[1,2,3,4],[3,4,5,6]]", output: "[3,4]", explanation: "Only 3 and 4 are present in each array." },
        { input: "nums = [[1,2,3],[4,5,6]]", output: "[]", explanation: "No common integers." },
        { input: "nums = [[7]]", output: "[7]", explanation: "Single 1-element array." },
        { input: "nums = [[1,2],[1,2],[1,2]]", output: "[1,2]", explanation: "All arrays identical." }
      ],
      optimalSolution: `function intersection(nums) {\n  const count = new Array(1001).fill(0);\n  for (const arr of nums) {\n    for (const x of arr) count[x]++;\n  }\n  const res = [];\n  for (let i = 1; i <= 1000; i++) {\n    if (count[i] === nums.length) res.push(i);\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(total elements + 1000)",
      optimalSpaceComplexity: "O(1000)",
      suboptimalSolution: `function intersection(nums) {\n  let common = new Set(nums[0]);\n  for (let i = 1; i < nums.length; i++) {\n    const curr = new Set(nums[i]);\n    common = new Set([...common].filter(x => curr.has(x)));\n  }\n  return Array.from(common).sort((a, b) => a - b);\n}`,
      suboptimalTimeComplexity: "O(N * M)",
      suboptimalSpaceComplexity: "O(M)",
      commonMistakes: ["Failing to sort the output in ascending order."],
      hints: [
        "Since each subarray contains distinct numbers, a number is present in all arrays if and only if its total frequency equals nums.length."
      ],
      oracleFn: (nums: number[][]) => {
        const count = new Array(1001).fill(0);
        for (const arr of nums) {
          for (const x of arr) count[x]++;
        }
        const res: number[] = [];
        for (let i = 1; i <= 1000; i++) {
          if (count[i] === nums.length) res.push(i);
        }
        return res;
      },
      testCases: {
        functional: [
          [[[3, 1, 2, 4, 5], [1, 2, 3, 4], [3, 4, 5, 6]]],
          [[[1, 2, 3], [4, 5, 6]]],
          [[[7]]],
          [[[1, 2], [1, 2], [1, 2]]]
        ],
        boundary: [
          [[[1]]],
          [[[1, 2]], [[2, 3]]],
          [[[1000], [1000]]]
        ],
        adversarial: [
          [[[1, 2, 3, 4, 5], [2, 3, 4, 5, 6], [3, 4, 5, 6, 7]]],
          [[[1, 3, 5], [2, 4, 6]]],
          [[[1, 2, 3], [1, 3], [1, 2, 3, 4]]]
        ],
        stress: [
          [Array.from({ length: 40 }, () => [1, 2, 3, 4, 5])],
          [Array.from({ length: 50 }, (_, i) => [i + 1, 100])]
        ]
      }
    }),

    // 440. Find the Middle Index in Array
    createProblem({
      num: 440,
      title: "Find the Middle Index in Array",
      slug: "find-the-middle-index-in-array",
      level: 21,
      difficulty: "EASY",
      topic: "Array / Prefix Sum",
      patternSlug: "advanced-arrays-extensions",
      estimatedTimeMin: 10,
      statement: "Given a 0-indexed integer array `nums`, find the leftmost `middleIndex` (i.e., the smallest amongst all possible ones).\n\nA `middleIndex` is an index where `nums[0] + nums[1] + ... + nums[middleIndex-1] == nums[middleIndex+1] + nums[middleIndex+2] + ... + nums[nums.length-1]`.\n\nIf `middleIndex == 0`, the left side sum is considered to be `0`. Similarly, if `middleIndex == nums.length - 1`, the right side sum is considered to be `0`.\n\nReturn the leftmost `middleIndex` that satisfies the condition, or `-1` if there is no such index.",
      functionName: "findMiddleIndex",
      parameters: [{ name: "nums", type: "number[]", description: "Array of integers" }],
      returnType: "number",
      constraints: ["1 <= nums.length <= 100", "-1000 <= nums[i] <= 1000"],
      examples: [
        { input: "nums = [2,3,-1,8,4]", output: "3", explanation: "Sum before index 3 = 2 + 3 + -1 = 4. Sum after index 3 = 4. Middle index is 3." },
        { input: "nums = [1,-1,4]", output: "2", explanation: "Sum before 2 = 1 + -1 = 0. Sum after 2 = 0." },
        { input: "nums = [2,5]", output: "-1", explanation: "No middle index exists." },
        { input: "nums = [1]", output: "0", explanation: "Single element index 0: left sum = 0, right sum = 0." }
      ],
      optimalSolution: `function findMiddleIndex(nums) {\n  let total = 0;\n  for (const x of nums) total += x;\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) {\n      return i;\n    }\n    leftSum += nums[i];\n  }\n  return -1;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function findMiddleIndex(nums) {\n  for (let i = 0; i < nums.length; i++) {\n    const left = nums.slice(0, i).reduce((a, b) => a + b, 0);\n    const right = nums.slice(i + 1).reduce((a, b) => a + b, 0);\n    if (left === right) return i;\n  }\n  return -1;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Failing to return the leftmost index when multiple exist."],
      hints: [
        "Compute total sum once.",
        "For each index i, leftSum == total - leftSum - nums[i] checks equality in O(1)."
      ],
      oracleFn: (nums: number[]) => {
        let total = 0;
        for (const x of nums) total += x;
        let leftSum = 0;
        for (let i = 0; i < nums.length; i++) {
          if (leftSum === total - leftSum - nums[i]) {
            return i;
          }
          leftSum += nums[i];
        }
        return -1;
      },
      testCases: {
        functional: [
          [[2, 3, -1, 8, 4]],
          [[1, -1, 4]],
          [[2, 5]],
          [[1]]
        ],
        boundary: [
          [[0, 0, 0]],
          [[1, 0]],
          [[0, 1]]
        ],
        adversarial: [
          [[1, 2, 3, 0, 6]],
          [[-1, -1, -1, -1, -1, 0]],
          [[10, -10, 10, -10]]
        ],
        stress: [
          [Array.from({ length: 60 }, () => 0)],
          [[...Array.from({ length: 40 }, () => 1), 0, ...Array.from({ length: 40 }, () => 1)]]
        ]
      }
    }),

    // 441. Check if One String Swap Can Make Strings Equal
    createProblem({
      num: 441,
      title: "Check if One String Swap Can Make Strings Equal",
      slug: "check-if-one-string-swap-can-make-strings-equal",
      level: 21,
      difficulty: "EASY",
      topic: "String / Counting",
      patternSlug: "advanced-arrays-extensions",
      estimatedTimeMin: 10,
      statement: "You are given two strings `s1` and `s2` of the same length. A string swap is an operation where you choose two indices in a string (not necessarily different) and swap the characters at these indices.\n\nReturn `true` if it is possible to make both strings equal by performing at most one string swap on exactly one of the strings. Otherwise, return `false`.",
      functionName: "areAlmostEqual",
      parameters: [
        { name: "s1", type: "string", description: "First string" },
        { name: "s2", type: "string", description: "Second string" }
      ],
      returnType: "boolean",
      constraints: ["1 <= s1.length, s2.length <= 100", "s1.length == s2.length", "s1 and s2 consist of only lowercase English letters."],
      examples: [
        { input: "s1 = \"bank\", s2 = \"kanb\"", output: "true", explanation: "Swap s2[0] ('k') with s2[2] ('n') -> \"bank\"." },
        { input: "s1 = \"attack\", s2 = \"defend\"", output: "false", explanation: "Impossible to make equal with one swap." },
        { input: "s1 = \"kelb\", s2 = \"kelb\"", output: "true", explanation: "Already equal (0 swaps)." },
        { input: "s1 = \"abcd\", s2 = \"dcba\"", output: "false", explanation: "Requires 2 swaps." }
      ],
      optimalSolution: `function areAlmostEqual(s1, s2) {\n  if (s1 === s2) return true;\n  const diff = [];\n  for (let i = 0; i < s1.length; i++) {\n    if (s1[i] !== s2[i]) diff.push(i);\n  }\n  if (diff.length !== 2) return false;\n  const [i, j] = diff;\n  return s1[i] === s2[j] && s1[j] === s2[i];\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function areAlmostEqual(s1, s2) {\n  if (s1 === s2) return true;\n  for (let i = 0; i < s1.length; i++) {\n    for (let j = i + 1; j < s1.length; j++) {\n      const arr = s1.split('');\n      const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;\n      if (arr.join('') === s2) return true;\n    }\n  }\n  return false;\n}`,
      suboptimalTimeComplexity: "O(N^3)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Allowing diff.length === 1 (cannot fix with one swap).", "Not checking cross-equality s1[i] === s2[j] && s1[j] === s2[i]."],
      hints: [
        "Find all indices where s1[k] !== s2[k].",
        "Valid if diff has length 0 (already equal) or length 2 where s1[i] == s2[j] and s1[j] == s2[i]."
      ],
      oracleFn: (s1: string, s2: string) => {
        if (s1 === s2) return true;
        const diff: number[] = [];
        for (let i = 0; i < s1.length; i++) {
          if (s1[i] !== s2[i]) diff.push(i);
        }
        if (diff.length !== 2) return false;
        const [i, j] = diff;
        return s1[i] === s2[j] && s1[j] === s2[i];
      },
      testCases: {
        functional: [
          ["bank", "kanb"],
          ["attack", "defend"],
          ["kelb", "kelb"],
          ["abcd", "dcba"]
        ],
        boundary: [
          ["a", "a"],
          ["a", "b"],
          ["ab", "ba"]
        ],
        adversarial: [
          ["aa", "bb"],
          ["caa", "aaz"],
          ["qgjh", "qgjh"]
        ],
        stress: [
          ["abcdefghijklmnopqrstuvwxyz", "zbcdefghijklmnopqrstuvwxya"],
          ["a".repeat(50) + "b", "b" + "a".repeat(50)]
        ]
      }
    }),

    // 442. Check If Two String Arrays are Equivalent
    createProblem({
      num: 442,
      title: "Check If Two String Arrays are Equivalent",
      slug: "check-if-two-string-arrays-are-equivalent",
      level: 21,
      difficulty: "EASY",
      topic: "String / Array",
      patternSlug: "advanced-arrays-extensions",
      estimatedTimeMin: 10,
      statement: "Given two string arrays `word1` and `word2`, return `true` if the two arrays represent the same string, and `false` otherwise.\n\nA string is represented by an array if the array elements concatenated in order forms the string.",
      functionName: "arrayStringsAreEqual",
      parameters: [
        { name: "word1", type: "string[]", description: "First string array" },
        { name: "word2", type: "string[]", description: "Second string array" }
      ],
      returnType: "boolean",
      constraints: ["1 <= word1.length, word2.length <= 10^3", "1 <= word1[i].length, word2[i].length <= 10^3", "1 <= sum(word1[i].length), sum(word2[i].length) <= 10^3", "word1[i] and word2[i] consist of lowercase letters."],
      examples: [
        { input: "word1 = [\"ab\", \"c\"], word2 = [\"a\", \"bc\"]", output: "true", explanation: "\"ab\" + \"c\" = \"abc\", \"a\" + \"bc\" = \"abc\"." },
        { input: "word1 = [\"a\", \"cb\"], word2 = [\"ab\", \"c\"]", output: "false", explanation: "\"acb\" != \"abc\"." },
        { input: "word1 = [\"abc\", \"d\", \"defg\"], word2 = [\"abcddefg\"]", output: "true", explanation: "Both concatenate to \"abcddefg\"." },
        { input: "word1 = [\"a\"], word2 = [\"a\"]", output: "true", explanation: "Identical single characters." }
      ],
      optimalSolution: `function arrayStringsAreEqual(word1, word2) {\n  let w1 = 0, c1 = 0, w2 = 0, c2 = 0;\n  while (w1 < word1.length && w2 < word2.length) {\n    if (word1[w1][c1] !== word2[w2][c2]) return false;\n    c1++;\n    if (c1 === word1[w1].length) { w1++; c1 = 0; }\n    c2++;\n    if (c2 === word2[w2].length) { w2++; c2 = 0; }\n  }\n  return w1 === word1.length && w2 === word2.length;\n}`,
      optimalTimeComplexity: "O(total characters)",
      optimalSpaceComplexity: "O(1) two pointers without string concatenation",
      suboptimalSolution: `function arrayStringsAreEqual(word1, word2) {\n  return word1.join('') === word2.join('');\n}`,
      suboptimalTimeComplexity: "O(N + M)",
      suboptimalSpaceComplexity: "O(N + M)",
      commonMistakes: ["Comparing array lengths instead of total concatenated string content."],
      hints: [
        "A two-pointer approach comparing character by character achieves O(1) extra space.",
        "Or simply compare word1.join('') === word2.join('')."
      ],
      oracleFn: (word1: string[], word2: string[]) => {
        return word1.join('') === word2.join('');
      },
      testCases: {
        functional: [
          [["ab", "c"], ["a", "bc"]],
          [["a", "cb"], ["ab", "c"]],
          [["abc", "d", "defg"], ["abcddefg"]],
          [["a"], ["a"]]
        ],
        boundary: [
          [["a", "b"], ["ab"]],
          [["ab"], ["a", "b"]],
          [["a"], ["b"]]
        ],
        adversarial: [
          [["abc", "d", "defg"], ["abcddef"]],
          [["a", "b", "c"], ["ab", "d"]],
          [["zzzz"], ["z", "z", "z", "z"]]
        ],
        stress: [
          [Array.from({ length: 50 }, () => "abc"), Array.from({ length: 30 }, () => "abcabc").slice(0, 25)],
          [Array.from({ length: 40 }, () => "x"), ["x".repeat(40)]]
        ]
      }
    }),

    // 443. Determine Color of a Chessboard Square
    createProblem({
      num: 443,
      title: "Determine Color of a Chessboard Square",
      slug: "determine-color-of-a-chessboard-square",
      level: 21,
      difficulty: "EASY",
      topic: "Math / String",
      patternSlug: "advanced-arrays-extensions",
      estimatedTimeMin: 10,
      statement: "You are given `coordinates`, a string that represents the coordinates of a square of the chessboard. Below is a chessboard for your reference.\n\nReturn `true` if the square is white, and `false` if the square is black.\n\nThe coordinate will always represent a valid chessboard square. The coordinate will always have the letter first, and the number second.",
      functionName: "squareIsWhite",
      parameters: [{ name: "coordinates", type: "string", description: "Chessboard coordinate (e.g. \"a1\")" }],
      returnType: "boolean",
      constraints: ["coordinates.length == 2", "'a' <= coordinates[0] <= 'h'", "'1' <= coordinates[1] <= '8'"],
      examples: [
        { input: "coordinates = \"a1\"", output: "false", explanation: "a1 is black." },
        { input: "coordinates = \"h3\"", output: "true", explanation: "h3 is white." },
        { input: "coordinates = \"c7\"", output: "false", explanation: "c7 is black." },
        { input: "coordinates = \"b2\"", output: "false", explanation: "b2 is black." }
      ],
      optimalSolution: `function squareIsWhite(coordinates) {\n  const col = coordinates.charCodeAt(0) - 97;\n  const row = Number(coordinates[1]) - 1;\n  return (col + row) % 2 === 1;\n}`,
      optimalTimeComplexity: "O(1)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function squareIsWhite(coordinates) {\n  const letters = "abcdefgh";\n  const x = letters.indexOf(coordinates[0]);\n  const y = parseInt(coordinates[1]) - 1;\n  return (x % 2 !== y % 2);\n}`,
      suboptimalTimeComplexity: "O(1)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Mixing up 0-based vs 1-based indexing for row and column."],
      hints: [
        "Convert column 'a'-'h' to 0-7, and row '1'-'8' to 0-7.",
        "Square (col, row) is white if (col + row) % 2 !== 0."
      ],
      oracleFn: (coordinates: string) => {
        const col = coordinates.charCodeAt(0) - 97;
        const row = Number(coordinates[1]) - 1;
        return (col + row) % 2 === 1;
      },
      testCases: {
        functional: [
          ["a1"],
          ["h3"],
          ["c7"],
          ["b2"]
        ],
        boundary: [
          ["a8"],
          ["h1"],
          ["h8"]
        ],
        adversarial: [
          ["d4"],
          ["e5"],
          ["f6"]
        ],
        stress: [
          ["b7"],
          ["g2"]
        ]
      }
    }),

    // 444. Determine Whether Matrix Can Be Obtained By Rotation
    createProblem({
      num: 444,
      title: "Determine Whether Matrix Can Be Obtained By Rotation",
      slug: "determine-whether-matrix-can-be-obtained-by-rotation",
      level: 21,
      difficulty: "EASY",
      topic: "Matrix / Array",
      patternSlug: "advanced-arrays-extensions",
      estimatedTimeMin: 15,
      statement: "Given two `n x n` binary matrices `mat` and `target`, return `true` if it is possible to make `mat` equal to `target` by rotating `mat` in 90-degree increments, or `false` otherwise.",
      functionName: "findRotation",
      parameters: [
        { name: "mat", type: "number[][]", description: "Source n x n binary matrix" },
        { name: "target", type: "number[][]", description: "Target n x n binary matrix" }
      ],
      returnType: "boolean",
      constraints: ["n == mat.length == target.length", "n == mat[i].length == target[i].length", "1 <= n <= 10", "mat[i][j] and target[i][j] are either 0 or 1."],
      examples: [
        { input: "mat = [[0,1],[1,0]], target = [[1,0],[0,1]]", output: "true", explanation: "Rotate 90 degrees clockwise -> match." },
        { input: "mat = [[0,1],[1,1]], target = [[1,0],[0,1]]", output: "false", explanation: "Cannot match by any 90-degree rotation." },
        { input: "mat = [[0,0,0],[0,1,0],[1,1,1]], target = [[1,1,1],[0,1,0],[0,0,0]]", output: "true", explanation: "Rotate 180 degrees -> match." },
        { input: "mat = [[1]], target = [[1]]", output: "true", explanation: "Already identical (0 degrees)." }
      ],
      optimalSolution: `function findRotation(mat, target) {\n  const n = mat.length;\n  let c0 = true, c90 = true, c180 = true, c270 = true;\n  for (let r = 0; r < n; r++) {\n    for (let c = 0; c < n; c++) {\n      if (mat[r][c] !== target[r][c]) c0 = false;\n      if (mat[r][c] !== target[c][n - 1 - r]) c90 = false;\n      if (mat[r][c] !== target[n - 1 - r][n - 1 - c]) c180 = false;\n      if (mat[r][c] !== target[n - 1 - c][r]) c270 = false;\n    }\n  }\n  return c0 || c90 || c180 || c270;\n}`,
      optimalTimeComplexity: "O(N^2)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function findRotation(mat, target) {\n  function rotate(m) {\n    const n = m.length;\n    const res = Array.from({ length: n }, () => new Array(n));\n    for (let r = 0; r < n; r++) {\n      for (let c = 0; c < n; c++) res[c][n - 1 - r] = m[r][c];\n    }\n    return res;\n  }\n  function equals(a, b) {\n    return JSON.stringify(a) === JSON.stringify(b);\n  }\n  let cur = mat;\n  for (let k = 0; k < 4; k++) {\n    if (equals(cur, target)) return true;\n    cur = rotate(cur);\n  }\n  return false;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N^2)",
      commonMistakes: ["Checking only 90 degrees and forgetting 0, 180, and 270 degrees."],
      hints: [
        "A matrix can be rotated at 0, 90, 180, or 270 degrees.",
        "Check index mappings in a single pass: (r, c) -> (c, n - 1 - r) for 90 deg, (n - 1 - r, n - 1 - c) for 180 deg, and (n - 1 - c, r) for 270 deg."
      ],
      oracleFn: (mat: number[][], target: number[][]) => {
        const n = mat.length;
        let c0 = true, c90 = true, c180 = true, c270 = true;
        for (let r = 0; r < n; r++) {
          for (let c = 0; c < n; c++) {
            if (mat[r][c] !== target[r][c]) c0 = false;
            if (mat[r][c] !== target[c][n - 1 - r]) c90 = false;
            if (mat[r][c] !== target[n - 1 - r][n - 1 - c]) c180 = false;
            if (mat[r][c] !== target[n - 1 - c][r]) c270 = false;
          }
        }
        return c0 || c90 || c180 || c270;
      },
      testCases: {
        functional: [
          [[[0, 1], [1, 0]], [[1, 0], [0, 1]]],
          [[[0, 1], [1, 1]], [[1, 0], [0, 1]]],
          [[[0, 0, 0], [0, 1, 0], [1, 1, 1]], [[1, 1, 1], [0, 1, 0], [0, 0, 0]]],
          [[[1]], [[1]]]
        ],
        boundary: [
          [[[0]], [[1]]],
          [[[1, 0], [0, 1]], [[1, 0], [0, 1]]],
          [[[0, 0], [0, 0]], [[0, 0], [0, 0]]]
        ],
        adversarial: [
          [[[1, 0, 0], [0, 1, 0], [0, 0, 1]], [[0, 0, 1], [0, 1, 0], [1, 0, 0]]],
          [[[1, 1, 0], [0, 1, 1], [0, 0, 0]], [[0, 0, 1], [0, 1, 1], [0, 1, 0]]],
          [[[1, 0], [0, 0]], [[0, 0], [1, 0]]]
        ],
        stress: [
          [Array.from({ length: 8 }, (_, r) => Array.from({ length: 8 }, (_, c) => (r + c) % 2)), Array.from({ length: 8 }, (_, r) => Array.from({ length: 8 }, (_, c) => (r + c) % 2))],
          [Array.from({ length: 10 }, (_, r) => Array.from({ length: 10 }, (_, c) => (r === 0 ? 1 : 0))), Array.from({ length: 10 }, (_, r) => Array.from({ length: 10 }, (_, c) => (c === 9 ? 1 : 0)))]
        ]
      }
    }),

    // 445. Find Nearest Point That Has the Same X or Y Coordinate
    createProblem({
      num: 445,
      title: "Find Nearest Point That Has the Same X or Y Coordinate",
      slug: "find-nearest-point-that-has-the-same-x-or-y-coordinate",
      level: 21,
      difficulty: "EASY",
      topic: "Array",
      patternSlug: "advanced-arrays-extensions",
      estimatedTimeMin: 15,
      statement: "You are given two integers, `x` and `y`, which represent your current location on a Cartesian grid: `(x, y)`. You are also given an array `points` where each `points[i] = [ai, bi]` represents that a point exists at `(ai, bi)`.\n\nA point is valid if it shares the same x-coordinate or the same y-coordinate as your location.\n\nReturn the index (0-indexed) of the valid point with the smallest Manhattan distance from your current location. If there are multiple, return the smallest index. If there are no valid points, return `-1`.\n\nThe Manhattan distance between two points `(x1, y1)` and `(x2, y2)` is `abs(x1 - x2) + abs(y1 - y2)`.",
      functionName: "nearestValidPoint",
      parameters: [
        { name: "x", type: "number", description: "Current X coordinate" },
        { name: "y", type: "number", description: "Current Y coordinate" },
        { name: "points", type: "number[][]", description: "List of points [a, b]" }
      ],
      returnType: "number",
      constraints: ["1 <= points.length <= 10^4", "points[i].length == 2", "1 <= x, y, ai, bi <= 10^4"],
      examples: [
        { input: "x = 3, y = 4, points = [[1,2],[3,1],[2,4],[2,3],[4,4]]", output: "2", explanation: "Valid points: [3,1] dist 3; [2,4] dist 1; [4,4] dist 1. Smallest index is 2." },
        { input: "x = 3, y = 4, points = [[3,4]]", output: "0", explanation: "Point is at current location, dist 0." },
        { input: "x = 3, y = 4, points = [[2,3]]", output: "-1", explanation: "No valid points share x or y." },
        { input: "x = 1, y = 1, points = [[1,1],[1,1]]", output: "0", explanation: "Smallest index is 0." }
      ],
      optimalSolution: `function nearestValidPoint(x, y, points) {\n  let minDistance = Infinity, bestIdx = -1;\n  for (let i = 0; i < points.length; i++) {\n    const [px, py] = points[i];\n    if (px === x || py === y) {\n      const dist = Math.abs(x - px) + Math.abs(y - py);\n      if (dist < minDistance) {\n        minDistance = dist;\n        bestIdx = i;\n      }\n    }\n  }\n  return bestIdx;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function nearestValidPoint(x, y, points) {\n  let valid = [];\n  for (let i = 0; i < points.length; i++) {\n    if (points[i][0] === x || points[i][1] === y) {\n      valid.push({ idx: i, d: Math.abs(x - points[i][0]) + Math.abs(y - points[i][1]) });\n    }\n  }\n  if (valid.length === 0) return -1;\n  valid.sort((a, b) => a.d === b.d ? a.idx - b.idx : a.d - b.d);\n  return valid[0].idx;\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Considering points that do not share either x or y."],
      hints: [
        "A point is valid only if px === x or py === y.",
        "Track minimum distance and update index only on strictly smaller distance."
      ],
      oracleFn: (x: number, y: number, points: number[][]) => {
        let minDistance = Infinity, bestIdx = -1;
        for (let i = 0; i < points.length; i++) {
          const [px, py] = points[i];
          if (px === x || py === y) {
            const dist = Math.abs(x - px) + Math.abs(y - py);
            if (dist < minDistance) {
              minDistance = dist;
              bestIdx = i;
            }
          }
        }
        return bestIdx;
      },
      testCases: {
        functional: [
          [3, 4, [[1, 2], [3, 1], [2, 4], [2, 3], [4, 4]]],
          [3, 4, [[3, 4]]],
          [3, 4, [[2, 3]]],
          [1, 1, [[1, 1], [1, 1]]]
        ],
        boundary: [
          [5, 5, [[5, 6]]],
          [5, 5, [[6, 5]]],
          [5, 5, [[6, 6]]]
        ],
        adversarial: [
          [2, 3, [[2, 5], [2, 1], [1, 3], [5, 3]]],
          [10, 10, [[1, 1], [2, 2], [3, 3]]],
          [1, 2, [[1, 5], [1, 3], [1, 4]]]
        ],
        stress: [
          [50, 50, Array.from({ length: 80 }, (_, i) => [i + 1, (i * 2) % 60 + 1])],
          [100, 100, Array.from({ length: 100 }, (_, i) => [100, i + 1])]
        ]
      }
    }),

    // 446. Count Items Matching a Rule
    createProblem({
      num: 446,
      title: "Count Items Matching a Rule",
      slug: "count-items-matching-a-rule",
      level: 21,
      difficulty: "EASY",
      topic: "Array / String",
      patternSlug: "advanced-arrays-extensions",
      estimatedTimeMin: 10,
      statement: "You are given an array `items`, where each `items[i] = [typei, colori, namei]` describes the type, color, and name of the `i-th` item. You are also given a rule represented by two strings, `ruleKey` and `ruleValue`.\n\nThe `i-th` item is said to match the rule if one of the following is true:\n- `ruleKey == \"type\"` and `ruleValue == typei`.\n- `ruleKey == \"color\"` and `ruleValue == colori`.\n- `ruleKey == \"name\"` and `ruleValue == namei`.\n\nReturn the number of items that match the given rule.",
      functionName: "countMatches",
      parameters: [
        { name: "items", type: "string[][]", description: "List of [type, color, name] items" },
        { name: "ruleKey", type: "string", description: "Rule key: 'type', 'color', or 'name'" },
        { name: "ruleValue", type: "string", description: "Target rule value" }
      ],
      returnType: "number",
      constraints: ["1 <= items.length <= 10^4", "1 <= typei.length, colori.length, namei.length, ruleValue.length <= 10", "ruleKey is equal to either \"type\", \"color\", or \"name\".", "All strings consist only of lowercase letters."],
      examples: [
        { input: "items = [[\"phone\",\"blue\",\"pixel\"],[\"computer\",\"silver\",\"lenovo\"],[\"phone\",\"gold\",\"iphone\"]], ruleKey = \"color\", ruleValue = \"silver\"", output: "1", explanation: "Only one item [\"computer\",\"silver\",\"lenovo\"] has color silver." },
        { input: "items = [[\"phone\",\"blue\",\"pixel\"],[\"computer\",\"silver\",\"phone\"],[\"phone\",\"gold\",\"iphone\"]], ruleKey = \"type\", ruleValue = \"phone\"", output: "2", explanation: "Two items have type phone." },
        { input: "items = [[\"a\",\"b\",\"c\"]], ruleKey = \"name\", ruleValue = \"c\"", output: "1", explanation: "Matches name c." },
        { input: "items = [[\"a\",\"b\",\"c\"]], ruleKey = \"type\", ruleValue = \"z\"", output: "0", explanation: "No match." }
      ],
      optimalSolution: `function countMatches(items, ruleKey, ruleValue) {\n  const keyIdx = ruleKey === 'type' ? 0 : ruleKey === 'color' ? 1 : 2;\n  let count = 0;\n  for (const item of items) {\n    if (item[keyIdx] === ruleValue) count++;\n  }\n  return count;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function countMatches(items, ruleKey, ruleValue) {\n  const map = { type: 0, color: 1, name: 2 };\n  return items.filter(it => it[map[ruleKey]] === ruleValue).length;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Re-checking ruleKey inside the loop for every item instead of mapping once outside."],
      hints: [
        "Map ruleKey to index: 'type' -> 0, 'color' -> 1, 'name' -> 2.",
        "Count items where item[idx] === ruleValue."
      ],
      oracleFn: (items: string[][], ruleKey: string, ruleValue: string) => {
        const keyIdx = ruleKey === 'type' ? 0 : ruleKey === 'color' ? 1 : 2;
        let count = 0;
        for (const item of items) {
          if (item[keyIdx] === ruleValue) count++;
        }
        return count;
      },
      testCases: {
        functional: [
          [[["phone", "blue", "pixel"], ["computer", "silver", "lenovo"], ["phone", "gold", "iphone"]], "color", "silver"],
          [[["phone", "blue", "pixel"], ["computer", "silver", "phone"], ["phone", "gold", "iphone"]], "type", "phone"],
          [[["a", "b", "c"]], "name", "c"],
          [[["a", "b", "c"]], "type", "z"]
        ],
        boundary: [
          [[["phone", "blue", "pixel"]], "type", "phone"],
          [[["phone", "blue", "pixel"]], "color", "blue"],
          [[["phone", "blue", "pixel"]], "name", "pixel"]
        ],
        adversarial: [
          [[["a", "a", "a"], ["a", "b", "a"], ["b", "a", "a"]], "name", "a"],
          [[["x", "y", "z"], ["x", "y", "z"], ["x", "y", "z"]], "color", "y"],
          [[["q", "w", "e"]], "color", "q"]
        ],
        stress: [
          [Array.from({ length: 60 }, (_, i) => [i % 2 === 0 ? "car" : "bike", "red", "v" + i]), "type", "car"],
          [Array.from({ length: 80 }, (_, i) => ["t", i % 3 === 0 ? "blue" : "black", "n"]), "color", "blue"]
        ]
      }
    }),

    // 447. Find the Kth Largest Integer in the Array
    createProblem({
      num: 447,
      title: "Find the Kth Largest Integer in the Array",
      slug: "find-the-kth-largest-integer-in-the-array",
      level: 21,
      difficulty: "MEDIUM",
      topic: "Array / String Sorting",
      patternSlug: "advanced-arrays-extensions",
      estimatedTimeMin: 20,
      statement: "You are given an array of strings `nums` and an integer `k`. Each string in `nums` represents an integer without leading zeros.\n\nReturn the string that represents the `k-th` largest integer in `nums`.\n\nNote: Duplicate numbers should be counted distinctly. For example, if nums is [\"1\",\"2\",\"2\"], \"2\" is the first largest integer, \"2\" is the second-largest integer, and \"1\" is the third-largest integer.",
      functionName: "kthLargestNumber",
      parameters: [
        { name: "nums", type: "string[]", description: "Array of numeric strings" },
        { name: "k", type: "number", description: "Rank k (1-indexed)" }
      ],
      returnType: "string",
      constraints: ["1 <= k <= nums.length <= 10^4", "1 <= nums[i].length <= 100", "nums[i] consists of only digits.", "nums[i] will not have any leading zeros."],
      examples: [
        { input: "nums = [\"3\",\"6\",\"7\",\"10\"], k = 4", output: "\"3\"", explanation: "Numbers in ascending order: [\"3\", \"6\", \"7\", \"10\"]. 4th largest is \"3\"." },
        { input: "nums = [\"2\",\"21\",\"12\",\"1\"], k = 3", output: "\"2\"", explanation: "Largest to smallest: \"21\", \"12\", \"2\", \"1\". 3rd largest is \"2\"." },
        { input: "nums = [\"0\",\"0\"], k = 2", output: "\"0\"", explanation: "\"0\" is 2nd largest." },
        { input: "nums = [\"100\",\"20\",\"3\"], k = 1", output: "\"100\"", explanation: "Largest is \"100\"." }
      ],
      optimalSolution: `function kthLargestNumber(nums, k) {\n  nums.sort((a, b) => {\n    if (a.length !== b.length) return b.length - a.length;\n    return a < b ? 1 : a > b ? -1 : 0;\n  });\n  return nums[k - 1];\n}`,
      optimalTimeComplexity: "O(N * L * log N) where L is max string length",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function kthLargestNumber(nums, k) {\n  return nums.map(BigInt).sort((a, b) => (b > a ? 1 : b < a ? -1 : 0))[k - 1].toString();\n}`,
      suboptimalTimeComplexity: "O(N * L * log N)",
      suboptimalSpaceComplexity: "O(N * L)",
      commonMistakes: ["Converting strings to Number, which overflows precision beyond 2^53 - 1."],
      hints: [
        "Each integer can have up to 100 digits, exceeding 64-bit integer limits.",
        "Compare two numeric strings: longer length is larger. If lengths equal, lexicographical comparison works!"
      ],
      oracleFn: (nums: string[], k: number) => {
        const sorted = [...nums].sort((a, b) => {
          if (a.length !== b.length) return b.length - a.length;
          return a < b ? 1 : a > b ? -1 : 0;
        });
        return sorted[k - 1];
      },
      testCases: {
        functional: [
          [["3", "6", "7", "10"], 4],
          [["2", "21", "12", "1"], 3],
          [["0", "0"], 2],
          [["100", "20", "3"], 1]
        ],
        boundary: [
          [["1"], 1],
          [["1", "2"], 1],
          [["2", "1"], 2]
        ],
        adversarial: [
          [["623986800", "3", "887298", "695", "794", "6888894705"], 2],
          [["99999999999999999999", "100000000000000000000"], 1],
          [["1", "1", "1", "1"], 3]
        ],
        stress: [
          [Array.from({ length: 60 }, (_, i) => String(i * 1000000000 + 7)), 10],
          [Array.from({ length: 80 }, (_, i) => "1" + "0".repeat(i + 1)), 25]
        ]
      }
    }),

    // 448. Magnetic Force Between Two Balls
    createProblem({
      num: 448,
      title: "Magnetic Force Between Two Balls",
      slug: "magnetic-force-between-two-balls",
      level: 21,
      difficulty: "MEDIUM",
      topic: "Array / Binary Search",
      patternSlug: "advanced-arrays-extensions",
      estimatedTimeMin: 25,
      statement: "In the universe of magnetic balls, you have `n` empty baskets, each located at a position `position[i]`. You are given `m` balls. You want to distribute the balls into the baskets such that the minimum magnetic force between any two balls is as large as possible.\n\nThe magnetic force between two balls at positions `x` and `y` is `|x - y|`.\n\nGiven the integer array `position` and the integer `m`, return the maximum minimum magnetic force to distribute all `m` balls.",
      functionName: "maxDistance",
      parameters: [
        { name: "position", type: "number[]", description: "Array of basket positions" },
        { name: "m", type: "number", description: "Number of balls" }
      ],
      returnType: "number",
      constraints: ["n == position.length", "2 <= n <= 10^5", "1 <= position[i] <= 10^9", "All integers in position are distinct.", "2 <= m <= position.length"],
      examples: [
        { input: "position = [1,2,3,4,7], m = 3", output: "3", explanation: "Distributing 3 balls at baskets 1, 4, 7 gives minimum force min(4 - 1, 7 - 4) = 3." },
        { input: "position = [5,4,3,2,1,1000000000], m = 2", output: "999999999", explanation: "Place at 1 and 1000000000." },
        { input: "position = [1,10], m = 2", output: "9", explanation: "Distance 10 - 1 = 9." },
        { input: "position = [1,2,3], m = 3", output: "1", explanation: "Adjacent placement has force 1." }
      ],
      optimalSolution: `function maxDistance(position, m) {\n  position.sort((a, b) => a - b);\n  let low = 1, high = position[position.length - 1] - position[0], ans = 1;\n  function canPlace(d) {\n    let count = 1, last = position[0];\n    for (let i = 1; i < position.length; i++) {\n      if (position[i] - last >= d) {\n        count++;\n        last = position[i];\n        if (count >= m) return true;\n      }\n    }\n    return false;\n  }\n  while (low <= high) {\n    const mid = Math.floor((low + high) / 2);\n    if (canPlace(mid)) {\n      ans = mid;\n      low = mid + 1;\n    } else {\n      high = mid - 1;\n    }\n  }\n  return ans;\n}`,
      optimalTimeComplexity: "O(N log(max_pos) + N log N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function maxDistance(position, m) {\n  position.sort((a, b) => a - b);\n  let low = 1, high = position[position.length - 1] - position[0];\n  let best = 1;\n  for (let d = low; d <= high; d++) {\n    let count = 1, last = position[0];\n    for (let i = 1; i < position.length; i++) {\n      if (position[i] - last >= d) { count++; last = position[i]; }\n    }\n    if (count >= m) best = d;\n    else break;\n  }\n  return best;\n}`,
      suboptimalTimeComplexity: "O(N * max_pos)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Trying linear search on distance (which times out since positions reach 10^9) instead of binary search."],
      hints: [
        "Sort positions first.",
        "Binary search on the minimum distance d in [1, max_pos - min_pos].",
        "Greedily place each ball as early as possible with gap >= d."
      ],
      oracleFn: (position: number[], m: number) => {
        const pos = [...position].sort((a, b) => a - b);
        let low = 1, high = pos[pos.length - 1] - pos[0], ans = 1;
        const canPlace = (d: number) => {
          let count = 1, last = pos[0];
          for (let i = 1; i < pos.length; i++) {
            if (pos[i] - last >= d) {
              count++;
              last = pos[i];
              if (count >= m) return true;
            }
          }
          return false;
        };
        while (low <= high) {
          const mid = Math.floor((low + high) / 2);
          if (canPlace(mid)) {
            ans = mid;
            low = mid + 1;
          } else {
            high = mid - 1;
          }
        }
        return ans;
      },
      testCases: {
        functional: [
          [[1, 2, 3, 4, 7], 3],
          [[5, 4, 3, 2, 1, 1000000000], 2],
          [[1, 10], 2],
          [[1, 2, 3], 3]
        ],
        boundary: [
          [[1, 2], 2],
          [[1, 100], 2],
          [[1, 3, 5], 3]
        ],
        adversarial: [
          [[79, 74, 57, 2], 3],
          [[1, 2, 4, 8, 16], 3],
          [[1, 5, 10, 15, 20], 4]
        ],
        stress: [
          [Array.from({ length: 60 }, (_, i) => (i + 1) * 10), 12],
          [Array.from({ length: 80 }, (_, i) => i * 35 + 1), 20]
        ]
      }
    }),

    // 449. Minimum Number of Days to Make m Bouquets
    createProblem({
      num: 449,
      title: "Minimum Number of Days to Make m Bouquets",
      slug: "minimum-number-of-days-to-make-m-bouquets",
      level: 21,
      difficulty: "MEDIUM",
      topic: "Array / Binary Search",
      patternSlug: "advanced-arrays-extensions",
      estimatedTimeMin: 25,
      statement: "You are given an integer array `bloomDay`, an integer `m` and an integer `k`.\n\nYou want to make `m` bouquets. To make a bouquet, you need to use `k` adjacent flowers from the garden.\n\nThe garden consists of `n` flowers, the `i-th` flower will bloom in the `bloomDay[i]` and then can be used in exactly one bouquet.\n\nReturn the minimum number of days you need to wait to be able to make `m` bouquets from the garden. If it is impossible to make `m` bouquets return `-1`.",
      functionName: "minDays",
      parameters: [
        { name: "bloomDay", type: "number[]", description: "Array of blooming days" },
        { name: "m", type: "number", description: "Number of bouquets needed" },
        { name: "k", type: "number", description: "Number of adjacent flowers per bouquet" }
      ],
      returnType: "number",
      constraints: ["bloomDay.length == n", "1 <= n <= 10^5", "1 <= bloomDay[i] <= 10^9", "1 <= m <= 10^6", "1 <= k <= n"],
      examples: [
        { input: "bloomDay = [1,10,3,10,2], m = 3, k = 1", output: "3", explanation: "On day 3, flowers bloom at [1, _, 3, _, 2]. We can pick 3 bouquets of 1 flower." },
        { input: "bloomDay = [1,10,3,10,2], m = 3, k = 2", output: "-1", explanation: "We need 3 * 2 = 6 flowers, but only 5 exist. Impossible." },
        { input: "bloomDay = [7,7,7,7,12,7,7], m = 2, k = 3", output: "12", explanation: "On day 12, all flowers bloomed, making 2 bouquets of 3 flowers." },
        { input: "bloomDay = [1000000000,1000000000], m = 1, k = 1", output: "1000000000", explanation: "Wait 10^9 days." }
      ],
      optimalSolution: `function minDays(bloomDay, m, k) {\n  if (m * k > bloomDay.length) return -1;\n  let low = 1, high = Math.max(...bloomDay), ans = -1;\n  function canMake(day) {\n    let bouquets = 0, flowers = 0;\n    for (const b of bloomDay) {\n      if (b <= day) {\n        flowers++;\n        if (flowers === k) {\n          bouquets++;\n          flowers = 0;\n        }\n      } else {\n        flowers = 0;\n      }\n    }\n    return bouquets >= m;\n  }\n  while (low <= high) {\n    const mid = Math.floor((low + high) / 2);\n    if (canMake(mid)) {\n      ans = mid;\n      high = mid - 1;\n    } else {\n      low = mid + 1;\n    }\n  }\n  return ans;\n}`,
      optimalTimeComplexity: "O(N log(max_day))",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function minDays(bloomDay, m, k) {\n  if (m * k > bloomDay.length) return -1;\n  const sortedDays = Array.from(new Set(bloomDay)).sort((a, b) => a - b);\n  for (const day of sortedDays) {\n    let b = 0, f = 0;\n    for (const d of bloomDay) {\n      if (d <= day) {\n        if (++f === k) { b++; f = 0; }\n      } else f = 0;\n    }\n    if (b >= m) return day;\n  }\n  return -1;\n}`,
      suboptimalTimeComplexity: "O(N * U) where U is unique days",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Integer overflow on m * k in 32-bit environments.", "Resetting consecutive flower counter to 0 upon encountering a non-bloomed flower."],
      hints: [
        "If m * k > bloomDay.length, it's impossible (return -1).",
        "Binary search on day between min(bloomDay) and max(bloomDay).",
        "Greedily count contiguous flowers <= mid; whenever count reaches k, increment bouquet count."
      ],
      oracleFn: (bloomDay: number[], m: number, k: number) => {
        if (m * k > bloomDay.length) return -1;
        let low = 1, high = Math.max(...bloomDay), ans = -1;
        const canMake = (day: number) => {
          let bouquets = 0, flowers = 0;
          for (const b of bloomDay) {
            if (b <= day) {
              flowers++;
              if (flowers === k) {
                bouquets++;
                flowers = 0;
              }
            } else {
              flowers = 0;
            }
          }
          return bouquets >= m;
        };
        while (low <= high) {
          const mid = Math.floor((low + high) / 2);
          if (canMake(mid)) {
            ans = mid;
            high = mid - 1;
          } else {
            low = mid + 1;
          }
        }
        return ans;
      },
      testCases: {
        functional: [
          [[1, 10, 3, 10, 2], 3, 1],
          [[1, 10, 3, 10, 2], 3, 2],
          [[7, 7, 7, 7, 12, 7, 7], 2, 3],
          [[1000000000, 1000000000], 1, 1]
        ],
        boundary: [
          [[1, 2], 1, 1],
          [[1, 2], 1, 2],
          [[1, 2], 2, 2]
        ],
        adversarial: [
          [[1, 10, 2, 9, 3, 8, 4, 7, 5, 6], 4, 2],
          [[5, 5, 5, 5], 2, 2],
          [[1, 2, 4, 9, 3, 4, 1], 2, 2]
        ],
        stress: [
          [Array.from({ length: 60 }, (_, i) => (i % 10) + 1), 5, 4],
          [Array.from({ length: 80 }, (_, i) => i * 15 + 1), 10, 3]
        ]
      }
    }),

    // 450. Split Array Largest Sum
    createProblem({
      num: 450,
      title: "Split Array Largest Sum",
      slug: "split-array-largest-sum",
      level: 21,
      difficulty: "HARD",
      topic: "Array / Binary Search / Dynamic Programming",
      patternSlug: "advanced-arrays-extensions",
      estimatedTimeMin: 30,
      statement: "Given an integer array `nums` and an integer `k`, split `nums` into `k` non-empty subarrays such that the largest sum of any subarray is minimized.\n\nReturn the minimized largest sum of the split.\n\nA subarray is a contiguous part of the array.",
      functionName: "splitArray",
      parameters: [
        { name: "nums", type: "number[]", description: "Array of non-negative integers" },
        { name: "k", type: "number", description: "Number of subarrays to split into" }
      ],
      returnType: "number",
      constraints: ["1 <= nums.length <= 1000", "0 <= nums[i] <= 10^6", "1 <= k <= min(50, nums.length)"],
      examples: [
        { input: "nums = [7,2,5,10,8], k = 2", output: "18", explanation: "Best split is [7,2,5] and [10,8], largest sum is 18." },
        { input: "nums = [1,2,3,4,5], k = 2", output: "9", explanation: "Split into [1,2,3] and [4,5], max sum 9." },
        { input: "nums = [1,4,4], k = 3", output: "4", explanation: "Each number in its own subarray: max is 4." },
        { input: "nums = [5], k = 1", output: "5", explanation: "Entire array is one subarray." }
      ],
      optimalSolution: `function splitArray(nums, k) {\n  let low = 0, high = 0;\n  for (const x of nums) {\n    if (x > low) low = x;\n    high += x;\n  }\n  function canSplit(maxSum) {\n    let pieces = 1, currentSum = 0;\n    for (const x of nums) {\n      if (currentSum + x > maxSum) {\n        pieces++;\n        currentSum = x;\n      } else {\n        currentSum += x;\n      }\n    }\n    return pieces <= k;\n  }\n  while (low < high) {\n    const mid = Math.floor((low + high) / 2);\n    if (canSplit(mid)) {\n      high = mid;\n    } else {\n      low = mid + 1;\n    }\n  }\n  return low;\n}`,
      optimalTimeComplexity: "O(N log(sum))",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function splitArray(nums, k) {\n  const n = nums.length;\n  const prefix = new Array(n + 1).fill(0);\n  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];\n  let dp = [...prefix.slice(1)];\n  for (let p = 2; p <= k; p++) {\n    const nextDp = new Array(n).fill(Infinity);\n    for (let i = p - 1; i < n; i++) {\n      for (let j = p - 2; j < i; j++) {\n        const val = Math.max(dp[j], prefix[i + 1] - prefix[j + 1]);\n        if (val < nextDp[i]) nextDp[i] = val;\n      }\n    }\n    dp = nextDp;\n  }\n  return dp[n - 1];\n}`,
      suboptimalTimeComplexity: "O(k * N^2)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Setting low = 0 instead of low = max(nums) (a single element cannot be split further)."],
      hints: [
        "Binary search on the answer: the range is [max(nums), sum(nums)].",
        "For a candidate max sum, greedily pack as many contiguous elements as possible before starting a new subarray."
      ],
      oracleFn: (nums: number[], k: number) => {
        let low = 0, high = 0;
        for (const x of nums) {
          if (x > low) low = x;
          high += x;
        }
        const canSplit = (maxSum: number) => {
          let pieces = 1, currentSum = 0;
          for (const x of nums) {
            if (currentSum + x > maxSum) {
              pieces++;
              currentSum = x;
            } else {
              currentSum += x;
            }
          }
          return pieces <= k;
        };
        while (low < high) {
          const mid = Math.floor((low + high) / 2);
          if (canSplit(mid)) {
            high = mid;
          } else {
            low = mid + 1;
          }
        }
        return low;
      },
      testCases: {
        functional: [
          [[7, 2, 5, 10, 8], 2],
          [[1, 2, 3, 4, 5], 2],
          [[1, 4, 4], 3],
          [[5], 1]
        ],
        boundary: [
          [[1, 2], 1],
          [[1, 2], 2],
          [[0, 0, 0], 2]
        ],
        adversarial: [
          [[10, 5, 13, 4, 8, 4, 5, 11, 14, 9, 16, 10, 20, 8], 8],
          [[1, 2, 3, 4, 5, 6, 7, 8, 9], 5],
          [[10, 20, 30, 40], 2]
        ],
        stress: [
          [Array.from({ length: 60 }, (_, i) => i * 10), 10],
          [Array.from({ length: 80 }, (_, i) => (i % 7) + 1), 15]
        ]
      }
    })
  ];

  return {
    level: 21,
    levelTitle: "Level 21 — Advanced Arrays, Search & Graph Extensions",
    topic: "Graph Degree / Celebrity, In-place Cyclic Rotations, Prefix Differences, and Binary Search Range Minimization",
    problems
  };
}
