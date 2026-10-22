import { LevelPayload, GeneratedProblem } from './types';
import { createProblem } from './problemBuilder';

export function getLevel15Payload(): LevelPayload {
  const problems: GeneratedProblem[] = [
    // 322. Alien Dictionary
    createProblem({
      num: 322,
      title: "Alien Dictionary",
      slug: "alien-dictionary",
      level: 15,
      difficulty: "HARD",
      topic: "Topological Sort",
      patternSlug: "topological-sort-union-find",
      estimatedTimeMin: 30,
      statement: "There is a new alien language that uses the English alphabet. However, the order among letters is unknown to you.\n\nYou are given a list of strings `words` from the alien language's dictionary, where the strings in `words` are sorted lexicographically by the rules of this new language.\n\nReturn a string of the unique letters in the new alien language sorted in lexicographically increasing order by the new language's rules. If there is no solution, return `\"\"`. If there are multiple solutions, return any of them (deterministic BFS order).",
      functionName: "alienOrder",
      parameters: [{ name: "words", type: "string[]", description: "Sorted words list in alien language" }],
      returnType: "string",
      constraints: ["1 <= words.length <= 100", "1 <= words[i].length <= 100", "words[i] consists of only lowercase English letters."],
      examples: [
        { input: "words = [\"wrt\",\"wrf\",\"er\",\"ett\",\"rftt\"]", output: "\"wertf\"", explanation: "Pairwise comparisons reveal order: w < e < r < t < f." },
        { input: "words = [\"z\",\"x\"]", output: "\"zx\"", explanation: "z comes before x." },
        { input: "words = [\"z\",\"x\",\"z\"]", output: "\"\"", explanation: "Cycle: z < x and x < z, invalid dictionary." },
        { input: "words = [\"abc\",\"ab\"]", output: "\"\"", explanation: "Prefix violation: \"abc\" appears before \"ab\", impossible." }
      ],
      optimalSolution: `function alienOrder(words) {\n  const adj = new Map();\n  const inDegree = new Map();\n  for (const w of words) {\n    for (const c of w) {\n      if (!adj.has(c)) adj.set(c, new Set());\n      if (!inDegree.has(c)) inDegree.set(c, 0);\n    }\n  }\n  for (let i = 0; i < words.length - 1; i++) {\n    const w1 = words[i], w2 = words[i + 1];\n    if (w1.length > w2.length && w1.startsWith(w2)) return "";\n    const minLen = Math.min(w1.length, w2.length);\n    for (let j = 0; j < minLen; j++) {\n      if (w1[j] !== w2[j]) {\n        if (!adj.get(w1[j]).has(w2[j])) {\n          adj.get(w1[j]).add(w2[j]);\n          inDegree.set(w2[j], inDegree.get(w2[j]) + 1);\n        }\n        break;\n      }\n    }\n  }\n  const queue = [];\n  for (const [char, deg] of inDegree.entries()) {\n    if (deg === 0) queue.push(char);\n  }\n  queue.sort();\n  let res = "";\n  while (queue.length > 0) {\n    const curr = queue.shift();\n    res += curr;\n    const neighbors = Array.from(adj.get(curr)).sort();\n    for (const next of neighbors) {\n      inDegree.set(next, inDegree.get(next) - 1);\n      if (inDegree.get(next) === 0) queue.push(next);\n    }\n  }\n  return res.length === inDegree.size ? res : "";\n}`,
      optimalTimeComplexity: "O(C) where C is total characters",
      optimalSpaceComplexity: "O(U + min(U^2, N)) where U is unique letters",
      suboptimalSolution: `function alienOrder(words) {\n  const adj = new Map();\n  const chars = new Set(words.join(''));\n  for (const c of chars) adj.set(c, []);\n  for (let i = 0; i < words.length - 1; i++) {\n    const w1 = words[i], w2 = words[i + 1];\n    if (w1.length > w2.length && w1.startsWith(w2)) return "";\n    for (let j = 0; j < Math.min(w1.length, w2.length); j++) {\n      if (w1[j] !== w2[j]) { adj.get(w1[j]).push(w2[j]); break; }\n    }\n  }\n  const visited = new Map();\n  const res = [];\n  function dfs(c) {\n    if (visited.get(c) === 1) return false;\n    if (visited.get(c) === 2) return true;\n    visited.set(c, 1);\n    for (const next of adj.get(c)) {\n      if (!dfs(next)) return false;\n    }\n    visited.set(c, 2);\n    res.push(c);\n    return true;\n  }\n  for (const c of chars) {\n    if (!visited.has(c) && !dfs(c)) return "";\n  }\n  return res.reverse().join('');\n}`,
      suboptimalTimeComplexity: "O(C)",
      suboptimalSpaceComplexity: "O(U)",
      commonMistakes: ["Failing to detect prefix invalidity (e.g. ['abc', 'ab']).", "Missing letters that appear in words but have no outgoing or incoming edges."],
      hints: [
        "First check if any word is a proper prefix of a previous word: return \"\" if so.",
        "Compare adjacent words word[i] and word[i+1]. The first differing character gives an edge u -> v.",
        "Perform topological sort using Kahn's algorithm or DFS cycle detection."
      ],
      oracleFn: (words: string[]) => {
        const adj = new Map<string, Set<string>>();
        const inDegree = new Map<string, number>();
        for (const w of words) {
          for (const c of w) {
            if (!adj.has(c)) adj.set(c, new Set());
            if (!inDegree.has(c)) inDegree.set(c, 0);
          }
        }
        for (let i = 0; i < words.length - 1; i++) {
          const w1 = words[i], w2 = words[i + 1];
          if (w1.length > w2.length && w1.startsWith(w2)) return "";
          const minLen = Math.min(w1.length, w2.length);
          for (let j = 0; j < minLen; j++) {
            if (w1[j] !== w2[j]) {
              if (!adj.get(w1[j])!.has(w2[j])) {
                adj.get(w1[j])!.add(w2[j]);
                inDegree.set(w2[j], inDegree.get(w2[j])! + 1);
              }
              break;
            }
          }
        }
        const queue: string[] = [];
        for (const [char, deg] of inDegree.entries()) {
          if (deg === 0) queue.push(char);
        }
        queue.sort();
        let res = "";
        while (queue.length > 0) {
          const curr = queue.shift()!;
          res += curr;
          const neighbors = Array.from(adj.get(curr)!).sort();
          for (const next of neighbors) {
            inDegree.set(next, inDegree.get(next)! - 1);
            if (inDegree.get(next) === 0) queue.push(next);
          }
        }
        return res.length === inDegree.size ? res : "";
      },
      testCases: {
        functional: [
          [["wrt", "wrf", "er", "ett", "rftt"]],
          [["z", "x"]],
          [["z", "x", "z"]],
          [["abc", "ab"]]
        ],
        boundary: [
          [["z"]],
          [["ab", "cd"]],
          [["a", "b", "c"]],
          [["c", "b", "a"]]
        ],
        adversarial: [
          [["zy", "zx"]],
          [["ri", "xz", "qxa", "iwt", "ia", "iq", "q", "t", "w", "ai", "pr", "n"]]
        ],
        stress: [
          [Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i))],
          [Array.from({ length: 25 }, (_, i) => String.fromCharCode(97 + i) + String.fromCharCode(98 + i))]
        ]
      }
    }),

    // 323. Parallel Courses
    createProblem({
      num: 323,
      title: "Parallel Courses",
      slug: "parallel-courses",
      level: 15,
      difficulty: "MEDIUM",
      topic: "Topological Sort",
      patternSlug: "topological-sort-union-find",
      estimatedTimeMin: 20,
      statement: "You are given an integer `n`, which indicates that there are `n` courses labeled from `1` to `n`. You are also given an array `relations` where `relations[i] = [prevCourse_i, nextCourse_i]`, representing a prerequisite relationship between course `prevCourse_i` and course `nextCourse_i`: course `prevCourse_i` has to be taken before course `nextCourse_i`.\n\nIn one semester, you can take any number of courses as long as you have taken all the prerequisites in the previous semester for the courses you are taking.\n\nReturn the minimum number of semesters needed to take all courses. If there is no way to take all the courses, return `-1`.",
      functionName: "minimumSemesters",
      parameters: [
        { name: "n", type: "number", description: "Number of courses" },
        { name: "relations", type: "number[][]", description: "Prerequisite relations [prev, next]" }
      ],
      returnType: "number",
      constraints: ["1 <= n <= 5000", "1 <= relations.length <= 5000", "relations[i].length == 2", "1 <= prevCourse_i, nextCourse_i <= n", "prevCourse_i != nextCourse_i", "All the pairs [prevCourse_i, nextCourse_i] are unique."],
      examples: [
        { input: "n = 3, relations = [[1,3],[2,3]]", output: "2", explanation: "Sem 1: courses 1 and 2. Sem 2: course 3." },
        { input: "n = 3, relations = [[1,2],[2,3],[3,1]]", output: "-1", explanation: "Cycle detected, impossible." },
        { input: "n = 1, relations = []", output: "1", explanation: "Single course taken in 1 semester." },
        { input: "n = 4, relations = [[1,2],[2,3],[3,4]]", output: "4", explanation: "Linear prerequisite chain." }
      ],
      optimalSolution: `function minimumSemesters(n, relations) {\n  const inDegree = new Array(n + 1).fill(0);\n  const adj = Array.from({ length: n + 1 }, () => []);\n  for (const [u, v] of relations) {\n    adj[u].push(v);\n    inDegree[v]++;\n  }\n  const queue = [];\n  for (let i = 1; i <= n; i++) {\n    if (inDegree[i] === 0) queue.push(i);\n  }\n  let semesters = 0;\n  let taken = 0;\n  while (queue.length > 0) {\n    const size = queue.length;\n    for (let i = 0; i < size; i++) {\n      const curr = queue.shift();\n      taken++;\n      for (const next of adj[curr]) {\n        inDegree[next]--;\n        if (inDegree[next] === 0) queue.push(next);\n      }\n    }\n    semesters++;\n  }\n  return taken === n ? semesters : -1;\n}`,
      optimalTimeComplexity: "O(V + E)",
      optimalSpaceComplexity: "O(V + E)",
      suboptimalSolution: `function minimumSemesters(n, relations) {\n  const adj = Array.from({ length: n + 1 }, () => []);\n  for (const [u, v] of relations) adj[u].push(v);\n  const memo = new Array(n + 1).fill(0);\n  const visiting = new Set();\n  function dfs(u) {\n    if (visiting.has(u)) return -1;\n    if (memo[u] > 0) return memo[u];\n    visiting.add(u);\n    let maxDepth = 0;\n    for (const v of adj[u]) {\n      const depth = dfs(v);\n      if (depth === -1) return -1;\n      maxDepth = Math.max(maxDepth, depth);\n    }\n    visiting.delete(u);\n    memo[u] = 1 + maxDepth;\n    return memo[u];\n  }\n  let maxSem = 0;\n  for (let i = 1; i <= n; i++) {\n    const depth = dfs(i);\n    if (depth === -1) return -1;\n    maxSem = Math.max(maxSem, depth);\n  }\n  return maxSem;\n}`,
      suboptimalTimeComplexity: "O(V + E)",
      suboptimalSpaceComplexity: "O(V + E)",
      commonMistakes: ["Incrementing semester count per course rather than per BFS layer.", "1-based vs 0-based indexing."],
      hints: [
        "In one semester, you can take all available courses whose prerequisites have already been satisfied.",
        "This is standard BFS level-by-level traversal using Kahn's algorithm.",
        "Each level of BFS corresponds to one semester."
      ],
      oracleFn: (n: number, relations: number[][]) => {
        const inDegree = new Array(n + 1).fill(0);
        const adj: number[][] = Array.from({ length: n + 1 }, () => []);
        for (const [u, v] of relations) {
          adj[u].push(v);
          inDegree[v]++;
        }
        const queue: number[] = [];
        for (let i = 1; i <= n; i++) {
          if (inDegree[i] === 0) queue.push(i);
        }
        let semesters = 0;
        let taken = 0;
        while (queue.length > 0) {
          const size = queue.length;
          for (let i = 0; i < size; i++) {
            const curr = queue.shift()!;
            taken++;
            for (const next of adj[curr]) {
              inDegree[next]--;
              if (inDegree[next] === 0) queue.push(next);
            }
          }
          semesters++;
        }
        return taken === n ? semesters : -1;
      },
      testCases: {
        functional: [
          [3, [[1, 3], [2, 3]]],
          [3, [[1, 2], [2, 3], [3, 1]]],
          [1, []],
          [4, [[1, 2], [2, 3], [3, 4]]]
        ],
        boundary: [
          [2, [[1, 2]]],
          [2, []],
          [5, []],
          [4, [[1, 4], [2, 4], [3, 4]]]
        ],
        adversarial: [
          [4, [[1, 2], [2, 3], [3, 1], [4, 1]]],
          [5, [[1, 2], [2, 3], [3, 4], [4, 5], [2, 4]]]
        ],
        stress: [
          [50, Array.from({ length: 49 }, (_, i) => [i + 1, i + 2])],
          [50, [...Array.from({ length: 49 }, (_, i) => [i + 1, i + 2]), [50, 1]]]
        ]
      }
    }),

    // 324. Parallel Courses III
    createProblem({
      num: 324,
      title: "Parallel Courses III",
      slug: "parallel-courses-iii",
      level: 15,
      difficulty: "HARD",
      topic: "Topological Sort / DP",
      patternSlug: "topological-sort-union-find",
      estimatedTimeMin: 25,
      statement: "You are given an integer `n`, which indicates that there are `n` courses labeled from `1` to `n`. You are also given a 2D integer array `relations` where `relations[j] = [prevCourse_j, nextCourse_j]` denotes that course `prevCourse_j` must be completed before course `nextCourse_j` can be started (a directed edge).\n\nIn addition, you are given a 0-indexed integer array `time` of length `n` where `time[i]` denotes how many months it takes to complete the `(i + 1)-th` course.\n\nYou may start taking a course at any time once the prerequisites are met. Any number of courses can be taken at the same time.\n\nReturn the minimum number of months needed to complete all the courses.",
      functionName: "minimumTime",
      parameters: [
        { name: "n", type: "number", description: "Number of courses" },
        { name: "relations", type: "number[][]", description: "Prerequisites relations [prev, next]" },
        { name: "time", type: "number[]", description: "0-indexed duration array for each course" }
      ],
      returnType: "number",
      constraints: ["1 <= n <= 5 * 10^4", "0 <= relations.length <= min(n * (n - 1) / 2, 5 * 10^4)", "relations[j].length == 2", "1 <= prevCourse_j, nextCourse_j <= n", "prevCourse_j != nextCourse_j", "time.length == n", "1 <= time[i] <= 10^4", "The prerequisites graph is a directed acyclic graph (DAG)."],
      examples: [
        { input: "n = 3, relations = [[1,3],[2,3]], time = [3,2,5]", output: "8", explanation: "Sem 1: 1 (takes 3) and 2 (takes 2). 3 starts at month 3 and finishes at 3 + 5 = 8." },
        { input: "n = 5, relations = [[1,5],[2,5],[3,5],[3,4],[4,5]], time = [1,2,3,4,5]", output: "12", explanation: "Path: 3 (3) -> 4 (4) -> 5 (5) = 12 months." },
        { input: "n = 1, relations = [], time = [7]", output: "7", explanation: "Single course duration." },
        { input: "n = 2, relations = [[1,2]], time = [4,6]", output: "10", explanation: "Sequential: 4 + 6 = 10." }
      ],
      optimalSolution: `function minimumTime(n, relations, time) {\n  const inDegree = new Array(n + 1).fill(0);\n  const adj = Array.from({ length: n + 1 }, () => []);\n  for (const [u, v] of relations) {\n    adj[u].push(v);\n    inDegree[v]++;\n  }\n  const maxTime = new Array(n + 1).fill(0);\n  const queue = [];\n  for (let i = 1; i <= n; i++) {\n    if (inDegree[i] === 0) {\n      queue.push(i);\n      maxTime[i] = time[i - 1];\n    }\n  }\n  while (queue.length > 0) {\n    const curr = queue.shift();\n    for (const next of adj[curr]) {\n      maxTime[next] = Math.max(maxTime[next], maxTime[curr] + time[next - 1]);\n      inDegree[next]--;\n      if (inDegree[next] === 0) queue.push(next);\n    }\n  }\n  return Math.max(...maxTime);\n}`,
      optimalTimeComplexity: "O(V + E)",
      optimalSpaceComplexity: "O(V + E)",
      suboptimalSolution: `function minimumTime(n, relations, time) {\n  const adj = Array.from({ length: n + 1 }, () => []);\n  for (const [u, v] of relations) adj[u].push(v);\n  const memo = new Array(n + 1).fill(0);\n  function dfs(u) {\n    if (memo[u] > 0) return memo[u];\n    let maxChild = 0;\n    for (const v of adj[u]) {\n      maxChild = Math.max(maxChild, dfs(v));\n    }\n    memo[u] = time[u - 1] + maxChild;\n    return memo[u];\n  }\n  let ans = 0;\n  for (let i = 1; i <= n; i++) ans = Math.max(ans, dfs(i));\n  return ans;\n}`,
      suboptimalTimeComplexity: "O(V + E)",
      suboptimalSpaceComplexity: "O(V + E)",
      commonMistakes: ["Mismatch between 1-indexed course labels and 0-indexed time array `time[u - 1]`.", "Summing up times instead of taking max prerequisite completion time."],
      hints: [
        "Dynamic programming on DAG: `maxTime[next] = max(maxTime[next], maxTime[curr] + time[next - 1])`.",
        "Initialize in-degree 0 courses with `maxTime[i] = time[i - 1]`.",
        "The overall minimum time is `Math.max(...maxTime)`."
      ],
      oracleFn: (n: number, relations: number[][], time: number[]) => {
        const inDegree = new Array(n + 1).fill(0);
        const adj: number[][] = Array.from({ length: n + 1 }, () => []);
        for (const [u, v] of relations) {
          adj[u].push(v);
          inDegree[v]++;
        }
        const maxTime = new Array(n + 1).fill(0);
        const queue: number[] = [];
        for (let i = 1; i <= n; i++) {
          if (inDegree[i] === 0) {
            queue.push(i);
            maxTime[i] = time[i - 1];
          }
        }
        while (queue.length > 0) {
          const curr = queue.shift()!;
          for (const next of adj[curr]) {
            maxTime[next] = Math.max(maxTime[next], maxTime[curr] + time[next - 1]);
            inDegree[next]--;
            if (inDegree[next] === 0) queue.push(next);
          }
        }
        return Math.max(...maxTime);
      },
      testCases: {
        functional: [
          [3, [[1, 3], [2, 3]], [3, 2, 5]],
          [5, [[1, 5], [2, 5], [3, 5], [3, 4], [4, 5]], [1, 2, 3, 4, 5]],
          [1, [], [7]],
          [2, [[1, 2]], [4, 6]]
        ],
        boundary: [
          [3, [], [5, 10, 15]],
          [4, [[1, 2], [2, 3], [3, 4]], [1, 1, 1, 1]],
          [4, [[1, 4], [2, 4], [3, 4]], [10, 20, 30, 5]],
          [2, [[2, 1]], [8, 3]]
        ],
        adversarial: [
          [6, [[1, 3], [2, 3], [3, 4], [4, 5], [4, 6]], [1, 2, 3, 4, 5, 6]],
          [5, [[1, 2], [1, 3], [2, 4], [3, 4], [4, 5]], [2, 4, 3, 5, 1]]
        ],
        stress: [
          [50, Array.from({ length: 49 }, (_, i) => [i + 1, i + 2]), Array.from({ length: 50 }, () => 2)],
          [40, [], Array.from({ length: 40 }, (_, i) => i + 1)]
        ]
      }
    }),

    // 325. Minimum Height Trees
    createProblem({
      num: 325,
      title: "Minimum Height Trees",
      slug: "minimum-height-trees",
      level: 15,
      difficulty: "MEDIUM",
      topic: "Graph / Topological Sort / BFS",
      patternSlug: "topological-sort-union-find",
      estimatedTimeMin: 20,
      statement: "A tree is an undirected graph in which any two vertices are connected by exactly one path. In other words, any connected graph without simple cycles is a tree.\n\nGiven a tree of `n` nodes labelled from `0` to `n - 1`, and an array of `n - 1` `edges` where `edges[i] = [ai, bi]` indicates that there is an undirected edge between the two nodes `ai` and `bi` in the tree, you can choose any node of the tree as the root. When you select a node `x` as the root, the result tree has height `h`.\n\nAmong all possible rooted trees, those with minimum height are called minimum height trees (MHTs). Return a list of all MHT root labels in ascending order.",
      functionName: "findMinHeightTrees",
      parameters: [
        { name: "n", type: "number", description: "Number of nodes" },
        { name: "edges", type: "number[][]", description: "Tree undirected edges" }
      ],
      returnType: "number[]",
      constraints: ["1 <= n <= 2 * 10^4", "edges.length == n - 1", "edges[i].length == 2", "0 <= ai, bi < n", "ai != bi", "All the pairs (ai, bi) are distinct.", "The given input is guaranteed to be a tree and there will be no repeated edges."],
      examples: [
        { input: "n = 4, edges = [[1,0],[1,2],[1,3]]", output: "[1]", explanation: "Root 1 yields height 1, minimum possible." },
        { input: "n = 6, edges = [[3,0],[3,1],[3,2],[3,4],[5,4]]", output: "[3,4]", explanation: "Roots 3 and 4 both yield minimum height 2." },
        { input: "n = 1, edges = []", output: "[0]", explanation: "Single node tree." },
        { input: "n = 2, edges = [[0,1]]", output: "[0,1]", explanation: "Both 0 and 1 yield height 1." }
      ],
      optimalSolution: `function findMinHeightTrees(n, edges) {\n  if (n <= 2) {\n    const res = [];\n    for (let i = 0; i < n; i++) res.push(i);\n    return res;\n  }\n  const adj = Array.from({ length: n }, () => new Set());\n  for (const [u, v] of edges) {\n    adj[u].add(v);\n    adj[v].add(u);\n  }\n  let leaves = [];\n  for (let i = 0; i < n; i++) {\n    if (adj[i].size === 1) leaves.push(i);\n  }\n  let remainingNodes = n;\n  while (remainingNodes > 2) {\n    remainingNodes -= leaves.length;\n    const newLeaves = [];\n    for (const leaf of leaves) {\n      const neighbor = adj[leaf].values().next().value;\n      adj[neighbor].delete(leaf);\n      if (adj[neighbor].size === 1) newLeaves.push(neighbor);\n    }\n    leaves = newLeaves;\n  }\n  return leaves.sort((a, b) => a - b);\n}`,
      optimalTimeComplexity: "O(V)",
      optimalSpaceComplexity: "O(V)",
      suboptimalSolution: `function findMinHeightTrees(n, edges) {\n  if (n === 1) return [0];\n  const adj = Array.from({ length: n }, () => []);\n  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }\n  function getHeight(root) {\n    const visited = new Set([root]);\n    const q = [root];\n    let h = 0;\n    while (q.length > 0) {\n      const sz = q.length;\n      for (let i = 0; i < sz; i++) {\n        const u = q.shift();\n        for (const v of adj[u]) {\n          if (!visited.has(v)) { visited.add(v); q.push(v); }\n        }\n      }\n      h++;\n    }\n    return h;\n  }\n  let minH = Infinity;\n  let roots = [];\n  for (let i = 0; i < n; i++) {\n    const h = getHeight(i);\n    if (h < minH) { minH = h; roots = [i]; }\n    else if (h === minH) roots.push(i);\n  }\n  return roots;\n}`,
      suboptimalTimeComplexity: "O(V^2)",
      suboptimalSpaceComplexity: "O(V)",
      commonMistakes: ["Calculating tree height from every node independently (O(V^2) TLE).", "Not handling n = 1 and n = 2 edge cases."],
      hints: [
        "A tree has at most 2 centroid nodes that minimize maximum path distance.",
        "Trimming leaves: repeatedly prune all nodes with degree 1 until <= 2 nodes remain.",
        "The remaining 1 or 2 nodes are the roots of the minimum height trees."
      ],
      oracleFn: (n: number, edges: number[][]) => {
        if (n <= 2) {
          const res: number[] = [];
          for (let i = 0; i < n; i++) res.push(i);
          return res;
        }
        const adj: Set<number>[] = Array.from({ length: n }, () => new Set());
        for (const [u, v] of edges) {
          adj[u].add(v);
          adj[v].add(u);
        }
        let leaves: number[] = [];
        for (let i = 0; i < n; i++) {
          if (adj[i].size === 1) leaves.push(i);
        }
        let remainingNodes = n;
        while (remainingNodes > 2) {
          remainingNodes -= leaves.length;
          const newLeaves: number[] = [];
          for (const leaf of leaves) {
            const neighbor = adj[leaf].values().next().value!;
            adj[neighbor].delete(leaf);
            if (adj[neighbor].size === 1) newLeaves.push(neighbor);
          }
          leaves = newLeaves;
        }
        return leaves.sort((a, b) => a - b);
      },
      testCases: {
        functional: [
          [4, [[1, 0], [1, 2], [1, 3]]],
          [6, [[3, 0], [3, 1], [3, 2], [3, 4], [5, 4]]],
          [1, []],
          [2, [[0, 1]]]
        ],
        boundary: [
          [3, [[0, 1], [1, 2]]],
          [5, [[0, 1], [1, 2], [2, 3], [3, 4]]],
          [4, [[0, 1], [1, 2], [2, 3]]],
          [6, [[0, 1], [1, 2], [2, 3], [2, 4], [4, 5]]]
        ],
        adversarial: [
          [7, [[0, 1], [1, 2], [1, 3], [2, 4], [3, 5], [5, 6]]],
          [6, [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5]]]
        ],
        stress: [
          [50, Array.from({ length: 49 }, (_, i) => [i, i + 1])],
          [50, Array.from({ length: 49 }, (_, i) => [0, i + 1])]
        ]
      }
    }),

    // 326. Sequence Reconstruction
    createProblem({
      num: 326,
      title: "Sequence Reconstruction",
      slug: "sequence-reconstruction",
      level: 15,
      difficulty: "MEDIUM",
      topic: "Topological Sort",
      patternSlug: "topological-sort-union-find",
      estimatedTimeMin: 20,
      statement: "You are given an integer array `nums` of length `n` where `nums` is a permutation of the integers in the range `[1, n]`. You are also given a 2D integer array `sequences` where each `sequences[i]` is a subsequence of the sequence.\n\nCheck if `nums` is the unique shortest supersequence of `sequences`.\n\nReturn `true` if `nums` is the unique shortest supersequence of `sequences`, or `false` otherwise.",
      functionName: "sequenceReconstruction",
      parameters: [
        { name: "nums", type: "number[]", description: "Target permutation [1..n]" },
        { name: "sequences", type: "number[][]", description: "Array of given subsequences" }
      ],
      returnType: "boolean",
      constraints: ["n == nums.length", "1 <= n <= 10^4", "nums is a permutation of all the integers in the range [1, n].", "1 <= sequences.length <= 10^4", "1 <= sequences[i].length <= 10^4", "1 <= sum(sequences[i].length) <= 10^5", "1 <= sequences[i][j] <= n", "All the arrays of sequences are unique."],
      examples: [
        { input: "nums = [1,2,3], sequences = [[1,2],[1,3]]", output: "false", explanation: "[1,3,2] is also a valid supersequence, so [1,2,3] is not unique." },
        { input: "nums = [1,2,3], sequences = [[1,2]]", output: "false", explanation: "Missing 3." },
        { input: "nums = [1,2,3], sequences = [[1,2],[2,3],[1,3]]", output: "true", explanation: "[1,2,3] is uniquely determined by 1->2 and 2->3." },
        { input: "nums = [1], sequences = [[1]]", output: "true", explanation: "Unique single element supersequence." }
      ],
      optimalSolution: `function sequenceReconstruction(nums, sequences) {\n  const n = nums.length;\n  const inDegree = new Array(n + 1).fill(0);\n  const adj = Array.from({ length: n + 1 }, () => new Set());\n  for (const seq of sequences) {\n    for (let i = 0; i < seq.length - 1; i++) {\n      const u = seq[i], v = seq[i + 1];\n      if (!adj[u].has(v)) {\n        adj[u].add(v);\n        inDegree[v]++;\n      }\n    }\n  }\n  const queue = [];\n  for (let i = 1; i <= n; i++) {\n    if (inDegree[i] === 0) queue.push(i);\n  }\n  let index = 0;\n  while (queue.length > 0) {\n    if (queue.length > 1) return false; // More than 1 choice = non-unique\n    const curr = queue.shift();\n    if (nums[index++] !== curr) return false;\n    for (const next of adj[curr]) {\n      inDegree[next]--;\n      if (inDegree[next] === 0) queue.push(next);\n    }\n  }\n  return index === n;\n}`,
      optimalTimeComplexity: "O(V + E)",
      optimalSpaceComplexity: "O(V + E)",
      suboptimalSolution: `function sequenceReconstruction(nums, sequences) {\n  const n = nums.length;\n  // Direct pair adjacency check: every adjacent pair in nums must appear as a contiguous transition\n  const pairs = new Set();\n  for (const seq of sequences) {\n    for (let i = 0; i < seq.length - 1; i++) {\n      pairs.add(\`\${seq[i]},\${seq[i + 1]}\`);\n    }\n  }\n  for (let i = 0; i < n - 1; i++) {\n    if (!pairs.has(\`\${nums[i]},\${nums[i + 1]}\`)) return false;\n  }\n  return true;\n}`,
      suboptimalTimeComplexity: "O(sum(seq.length))",
      suboptimalSpaceComplexity: "O(sum(seq.length))",
      commonMistakes: ["Failing to check if queue length is > 1 at any moment during topological sort.", "Not verifying that the popped elements match nums in exact order."],
      hints: [
        "Construct directed edges for every adjacent pair `seq[i] -> seq[i+1]`.",
        "Perform Kahn's algorithm: at each step, the queue of 0-in-degree nodes MUST have length exactly 1.",
        "If queue has size > 1, multiple valid topological sorts exist -> return false."
      ],
      oracleFn: (nums: number[], sequences: number[][]) => {
        const n = nums.length;
        const inDegree = new Array(n + 1).fill(0);
        const adj: Set<number>[] = Array.from({ length: n + 1 }, () => new Set());
        for (const seq of sequences) {
          for (let i = 0; i < seq.length - 1; i++) {
            const u = seq[i], v = seq[i + 1];
            if (!adj[u].has(v)) {
              adj[u].add(v);
              inDegree[v]++;
            }
          }
        }
        const queue: number[] = [];
        for (let i = 1; i <= n; i++) {
          if (inDegree[i] === 0) queue.push(i);
        }
        let index = 0;
        while (queue.length > 0) {
          if (queue.length > 1) return false;
          const curr = queue.shift()!;
          if (nums[index++] !== curr) return false;
          for (const next of adj[curr]) {
            inDegree[next]--;
            if (inDegree[next] === 0) queue.push(next);
          }
        }
        return index === n;
      },
      testCases: {
        functional: [
          [[1, 2, 3], [[1, 2], [1, 3]]],
          [[1, 2, 3], [[1, 2]]],
          [[1, 2, 3], [[1, 2], [2, 3], [1, 3]]],
          [[1], [[1]]]
        ],
        boundary: [
          [[1, 2], [[1, 2]]],
          [[1, 2], [[2, 1]]],
          [[1, 2, 3, 4], [[1, 2], [2, 3], [3, 4]]],
          [[1, 2, 3, 4], [[1, 2], [3, 4]]]
        ],
        adversarial: [
          [[1, 2, 3], [[1, 2], [2, 3], [3, 1]]],
          [[1, 2, 3, 4, 5], [[1, 2], [2, 3], [3, 4], [4, 5]]]
        ],
        stress: [
          [Array.from({ length: 50 }, (_, i) => i + 1), Array.from({ length: 49 }, (_, i) => [i + 1, i + 2])],
          [Array.from({ length: 50 }, (_, i) => i + 1), Array.from({ length: 48 }, (_, i) => [i + 1, i + 2])]
        ]
      }
    }),

    // 327. Find Eventual Safe States
    createProblem({
      num: 327,
      title: "Find Eventual Safe States",
      slug: "find-eventual-safe-states",
      level: 15,
      difficulty: "MEDIUM",
      topic: "Graph / Topological Sort / Cycle Detection",
      patternSlug: "topological-sort-union-find",
      estimatedTimeMin: 20,
      statement: "There is a directed graph of `n` nodes with each node labeled from `0` to `n - 1`. The graph is represented by a 0-indexed 2D integer array `graph` where `graph[i]` is an integer array of nodes adjacent to node `i`, meaning there is a directed edge from node `i` to each node in `graph[i]`.\n\nA node is a terminal node if there are no outgoing edges. A node is a safe node if every possible path starting from that node leads to a terminal node (or another safe node).\n\nReturn an array containing all the safe nodes of the graph. The answer should be sorted in ascending order.",
      functionName: "eventualSafeNodes",
      parameters: [{ name: "graph", type: "number[][]", description: "Directed adjacency list" }],
      returnType: "number[]",
      constraints: ["n == graph.length", "1 <= n <= 10^4", "0 <= graph[i].length <= n", "0 <= graph[i][j] <= n - 1", "graph[i] is sorted in a strictly increasing order.", "The graph may contain self-loops.", "The number of edges in the graph will be in the range [1, 4 * 10^4]."],
      examples: [
        { input: "graph = [[1,2],[2,3],[5],[0],[5],[],[]]", output: "[2,4,5,6]", explanation: "Nodes 5 and 6 are terminal nodes. 2 and 4 lead only to 5. 0, 1, 3 are part of or lead to cycles." },
        { input: "graph = [[1,2,3,4],[1,2],[3,4],[0,4],[]]", output: "[4]", explanation: "Node 4 is the only safe node." },
        { input: "graph = [[]]", output: "[0]", explanation: "Single node with no edges is terminal (safe)." },
        { input: "graph = [[0]]", output: "[]", explanation: "Self loop, never terminates." }
      ],
      optimalSolution: `function eventualSafeNodes(graph) {\n  const n = graph.length;\n  // 0: unvisited, 1: visiting (in stack), 2: safe\n  const state = new Array(n).fill(0);\n  function dfs(node) {\n    if (state[node] !== 0) return state[node] === 2;\n    state[node] = 1;\n    for (const next of graph[node]) {\n      if (!dfs(next)) return false;\n    }\n    state[node] = 2;\n    return true;\n  }\n  const res = [];\n  for (let i = 0; i < n; i++) {\n    if (dfs(i)) res.push(i);\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(V + E)",
      optimalSpaceComplexity: "O(V)",
      suboptimalSolution: `function eventualSafeNodes(graph) {\n  const n = graph.length;\n  const rev = Array.from({ length: n }, () => []);\n  const outDegree = new Array(n).fill(0);\n  for (let u = 0; u < n; u++) {\n    outDegree[u] = graph[u].length;\n    for (const v of graph[u]) rev[v].push(u);\n  }\n  const q = [];\n  for (let i = 0; i < n; i++) if (outDegree[i] === 0) q.push(i);\n  const safe = new Array(n).fill(false);\n  while (q.length > 0) {\n    const u = q.shift();\n    safe[u] = true;\n    for (const prev of rev[u]) {\n      outDegree[prev]--;\n      if (outDegree[prev] === 0) q.push(prev);\n    }\n  }\n  const res = [];\n  for (let i = 0; i < n; i++) if (safe[i]) res.push(i);\n  return res;\n}`,
      suboptimalTimeComplexity: "O(V + E)",
      suboptimalSpaceComplexity: "O(V + E)",
      commonMistakes: ["Failing to detect self loops `graph[u] = [u]`.", "Forgetting to sort the answer in ascending order."],
      hints: [
        "A node is safe if it does not lead to any cycle.",
        "Use 3-color DFS: 0=unvisited, 1=in current cycle, 2=safe.",
        "Alternatively: reverse all edges and run Kahn's algorithm starting from out-degree 0 nodes."
      ],
      oracleFn: (graph: number[][]) => {
        const n = graph.length;
        const state = new Array(n).fill(0);
        function dfs(node: number): boolean {
          if (state[node] !== 0) return state[node] === 2;
          state[node] = 1;
          for (const next of graph[node]) {
            if (!dfs(next)) return false;
          }
          state[node] = 2;
          return true;
        }
        const res: number[] = [];
        for (let i = 0; i < n; i++) {
          if (dfs(i)) res.push(i);
        }
        return res;
      },
      testCases: {
        functional: [
          [[[1, 2], [2, 3], [5], [0], [5], [], []]],
          [[[1, 2, 3, 4], [1, 2], [3, 4], [0, 4], []]],
          [[[]]],
          [[[0]]]
        ],
        boundary: [
          [[[], []]],
          [[[1], []]],
          [[[1], [0]]],
          [[[1], [2], []]]
        ],
        adversarial: [
          [[[1], [2], [3], [0]]],
          [[[1, 2], [2], [0, 1]]]
        ],
        stress: [
          [Array.from({ length: 50 }, (_, i) => (i < 49 ? [i + 1] : []))],
          [Array.from({ length: 50 }, (_, i) => [(i + 1) % 50])]
        ]
      }
    }),

    // 328. Redundant Connection II
    createProblem({
      num: 328,
      title: "Redundant Connection II",
      slug: "redundant-connection-ii",
      level: 15,
      difficulty: "HARD",
      topic: "Union Find / Graph",
      patternSlug: "topological-sort-union-find",
      estimatedTimeMin: 30,
      statement: "In this problem, a rooted tree is a directed graph such that, there is exactly one node (the root) for which all other nodes are descendants of this node, and every node has exactly one parent, except for the root node which has no parents.\n\nThe given input is a directed graph that started as a rooted tree with `n` nodes (labeled `1` to `n`), with one additional directed edge added. The added edge has two different vertices chosen from `1` to `n`, and was not an edge that already existed.\n\nReturn an edge that can be removed so that the resulting graph is a rooted tree of `n` nodes. If there are multiple answers, return the answer that occurs last in the input.",
      functionName: "findRedundantDirectedConnection",
      parameters: [{ name: "edges", type: "number[][]", description: "Directed edges list [u, v]" }],
      returnType: "number[]",
      constraints: ["n == edges.length", "3 <= n <= 1000", "edges[i].length == 2", "1 <= ui, vi <= n"],
      examples: [
        { input: "edges = [[1,2],[1,3],[2,3]]", output: "[2,3]", explanation: "Node 3 has two parents (1 and 2). Removing [2,3] restores valid tree." },
        { input: "edges = [[1,2],[2,3],[3,4],[4,1],[1,5]]", output: "[4,1]", explanation: "Cycle exists among 1->2->3->4->1, removing [4,1] breaks cycle." },
        { input: "edges = [[2,1],[3,1],[4,2],[1,4]]", output: "[2,1]", explanation: "Node 1 has two parents and a cycle." },
        { input: "edges = [[1,2],[2,3],[3,1]]", output: "[3,1]", explanation: "Directed cycle." }
      ],
      optimalSolution: `function findRedundantDirectedConnection(edges) {\n  const n = edges.length;\n  const parent = new Array(n + 1).fill(0);\n  let candidate1 = null, candidate2 = null;\n  for (const edge of edges) {\n    const [u, v] = edge;\n    if (parent[v] !== 0) {\n      candidate1 = [parent[v], v];\n      candidate2 = edge;\n      break;\n    }\n    parent[v] = u;\n  }\n  const dsu = Array.from({ length: n + 1 }, (_, i) => i);\n  function find(x) {\n    if (dsu[x] !== x) dsu[x] = find(dsu[x]);\n    return dsu[x];\n  }\n  for (const edge of edges) {\n    if (candidate2 && edge[0] === candidate2[0] && edge[1] === candidate2[1]) continue;\n    const [u, v] = edge;\n    const rootU = find(u), rootV = find(v);\n    if (rootU === rootV) {\n      if (candidate1) return candidate1;\n      return edge;\n    }\n    dsu[rootU] = rootV;\n  }\n  return candidate2;\n}`,
      optimalTimeComplexity: "O(n * alpha(n))",
      optimalSpaceComplexity: "O(n)",
      suboptimalSolution: `function findRedundantDirectedConnection(edges) {\n  const n = edges.length;\n  for (let i = n - 1; i >= 0; i--) {\n    const skipped = edges[i];\n    const inDeg = new Array(n + 1).fill(0);\n    const adj = Array.from({ length: n + 1 }, () => []);\n    for (let j = 0; j < n; j++) {\n      if (i === j) continue;\n      const [u, v] = edges[j];\n      adj[u].push(v);\n      inDeg[v]++;\n    }\n    let roots = 0;\n    let rootNode = -1;\n    for (let k = 1; k <= n; k++) {\n      if (inDeg[k] === 0) { roots++; rootNode = k; }\n    }\n    if (roots !== 1) continue;\n    const visited = new Set();\n    const q = [rootNode];\n    visited.add(rootNode);\n    while (q.length > 0) {\n      const curr = q.shift();\n      for (const next of adj[curr]) {\n        if (!visited.has(next)) { visited.add(next); q.push(next); }\n      }\n    }\n    if (visited.size === n) return skipped;\n  }\n  return [];\n}`,
      suboptimalTimeComplexity: "O(n^2)",
      suboptimalSpaceComplexity: "O(n)",
      commonMistakes: ["Failing to handle the 3 distinct cases: (1) node with two parents and no cycle, (2) cycle and no node with two parents, (3) node with two parents AND a cycle."],
      hints: [
        "Case 1: Exactly one node has 2 incoming edges (candidate1 and candidate2).",
        "Case 2: A cycle exists with no node having in-degree 2.",
        "Use Union-Find ignoring candidate2. If cycle still occurs, candidate1 is redundant; if no cycle, candidate2 is redundant."
      ],
      oracleFn: (edges: number[][]) => {
        const n = edges.length;
        const parent = new Array(n + 1).fill(0);
        let candidate1: number[] | null = null, candidate2: number[] | null = null;
        for (const edge of edges) {
          const [u, v] = edge;
          if (parent[v] !== 0) {
            candidate1 = [parent[v], v];
            candidate2 = edge;
            break;
          }
          parent[v] = u;
        }
        const dsu = Array.from({ length: n + 1 }, (_, i) => i);
        function find(x: number): number {
          if (dsu[x] !== x) dsu[x] = find(dsu[x]);
          return dsu[x];
        }
        for (const edge of edges) {
          if (candidate2 && edge[0] === candidate2[0] && edge[1] === candidate2[1]) continue;
          const [u, v] = edge;
          const rootU = find(u), rootV = find(v);
          if (rootU === rootV) {
            if (candidate1) return candidate1;
            return edge;
          }
          dsu[rootU] = rootV;
        }
        return candidate2!;
      },
      testCases: {
        functional: [
          [[[1, 2], [1, 3], [2, 3]]],
          [[[1, 2], [2, 3], [3, 4], [4, 1], [1, 5]]],
          [[[2, 1], [3, 1], [4, 2], [1, 4]]],
          [[[1, 2], [2, 3], [3, 1]]]
        ],
        boundary: [
          [[[1, 2], [2, 3], [3, 1]]],
          [[[4, 2], [1, 2], [2, 3], [3, 1]]],
          [[[1, 2], [2, 3], [3, 4], [4, 2], [1, 5]]],
          [[[5, 2], [5, 1], [3, 1], [3, 4], [3, 5]]]
        ],
        adversarial: [
          [[[1, 2], [2, 3], [3, 4], [4, 5], [5, 2]]],
          [[[1, 2], [1, 3], [3, 1], [3, 4]]]
        ],
        stress: [
          [[...Array.from({ length: 49 }, (_, i) => [i + 1, i + 2]), [50, 1]]],
          [[...Array.from({ length: 49 }, (_, i) => [i + 1, i + 2]), [25, 10]]]
        ]
      }
    }),

    // 329. Accounts Merge
    createProblem({
      num: 329,
      title: "Accounts Merge",
      slug: "accounts-merge",
      level: 15,
      difficulty: "MEDIUM",
      topic: "Union Find",
      patternSlug: "topological-sort-union-find",
      estimatedTimeMin: 25,
      statement: "Given a list of `accounts` where each element `accounts[i]` is a list of strings, where the first element `accounts[i][0]` is a name, and the rest of the elements are emails representing emails of the account.\n\nNow, we would like to merge these accounts. Two accounts definitely belong to the same person if there is some common email to both accounts. Note that even if two accounts have the same name, they may belong to different people as people could have the same name. A person can have any number of accounts initially, but all of their accounts definitely have the same name.\n\nAfter merging the accounts, return the accounts in the following format: the first element of each account is the name, and the rest of the elements are emails in sorted order.",
      functionName: "accountsMerge",
      parameters: [{ name: "accounts", type: "string[][]", description: "List of accounts [name, email1, email2, ...]" }],
      returnType: "string[][]",
      constraints: ["1 <= accounts.length <= 1000", "2 <= accounts[i].length <= 10", "1 <= accounts[i][j].length <= 30", "accounts[i][0] consists of English letters.", "accounts[i][j] (for j > 0) is a valid email."],
      examples: [
        { input: "accounts = [[\"John\",\"johnsmith@mail.com\",\"john_newyork@mail.com\"],[\"John\",\"johnsmith@mail.com\",\"john00@mail.com\"],[\"Mary\",\"mary@mail.com\"],[\"John\",\"johnnybravo@mail.com\"]]", output: "[[\"John\",\"john00@mail.com\",\"john_newyork@mail.com\",\"johnsmith@mail.com\"],[\"Mary\",\"mary@mail.com\"],[\"John\",\"johnnybravo@mail.com\"]]", explanation: "The first two John accounts share an email and are merged." },
        { input: "accounts = [[\"Gabe\",\"Gabe0@m.co\",\"Gabe3@m.co\",\"Gabe1@m.co\"],[\"Kevin\",\"Kevin3@m.co\",\"Kevin5@m.co\",\"Kevin0@m.co\"],[\"Ethan\",\"Ethan5@m.co\",\"Ethan4@m.co\",\"Ethan0@m.co\"],[\"Hanzo\",\"Hanzo3@m.co\",\"Hanzo1@m.co\",\"Hanzo0@m.co\"]]", output: "[[\"Ethan\",\"Ethan0@m.co\",\"Ethan4@m.co\",\"Ethan5@m.co\"],[\"Gabe\",\"Gabe0@m.co\",\"Gabe1@m.co\",\"Gabe3@m.co\"],[\"Hanzo\",\"Hanzo0@m.co\",\"Hanzo1@m.co\",\"Hanzo3@m.co\"],[\"Kevin\",\"Kevin0@m.co\",\"Kevin3@m.co\",\"Kevin5@m.co\"]]", explanation: "No accounts share emails." },
        { input: "accounts = [[\"Alex\",\"alex@mail.com\"]]", output: "[[\"Alex\",\"alex@mail.com\"]]", explanation: "Single account." },
        { input: "accounts = [[\"David\",\"d1@m.com\"],[\"David\",\"d2@m.com\"],[\"David\",\"d1@m.com\",\"d2@m.com\"]]", output: "[[\"David\",\"d1@m.com\",\"d2@m.com\"]]", explanation: "Transitive connection through third account." }
      ],
      optimalSolution: `function accountsMerge(accounts) {\n  const parent = new Map();\n  const emailToName = new Map();\n  function find(s) {\n    if (parent.get(s) !== s) parent.set(s, find(parent.get(s)));\n    return parent.get(s);\n  }\n  function union(a, b) {\n    parent.set(find(a), find(b));\n  }\n  for (const account of accounts) {\n    const name = account[0];\n    for (let i = 1; i < account.length; i++) {\n      const email = account[i];\n      if (!parent.has(email)) parent.set(email, email);\n      emailToName.set(email, name);\n      union(account[1], email);\n    }\n  }\n  const groups = new Map();\n  for (const email of parent.keys()) {\n    const root = find(email);\n    if (!groups.has(root)) groups.set(root, []);\n    groups.get(root).push(email);\n  }\n  const res = [];\n  for (const [root, emails] of groups.entries()) {\n    emails.sort();\n    res.push([emailToName.get(root), ...emails]);\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(A * log A) where A is total emails",
      optimalSpaceComplexity: "O(A)",
      suboptimalSolution: `function accountsMerge(accounts) {\n  const adj = new Map();\n  const emailToName = new Map();\n  for (const acc of accounts) {\n    const name = acc[0];\n    for (let i = 1; i < acc.length; i++) {\n      const e1 = acc[i];\n      emailToName.set(e1, name);\n      if (!adj.has(e1)) adj.set(e1, new Set());\n      if (i > 1) {\n        const e2 = acc[i - 1];\n        adj.get(e1).add(e2);\n        adj.get(e2).add(e1);\n      }\n    }\n  }\n  const visited = new Set();\n  const res = [];\n  for (const email of adj.keys()) {\n    if (!visited.has(email)) {\n      const group = [];\n      const q = [email];\n      visited.add(email);\n      while (q.length > 0) {\n        const curr = q.shift();\n        group.push(curr);\n        for (const next of adj.get(curr)) {\n          if (!visited.has(next)) { visited.add(next); q.push(next); }\n        }\n      }\n      group.sort();\n      res.push([emailToName.get(email), ...group]);\n    }\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(A * log A)",
      suboptimalSpaceComplexity: "O(A)",
      commonMistakes: ["Merging accounts solely by name (different people can share the same name).", "Forgetting to sort emails alphabetically in each merged account."],
      hints: [
        "Map each email to the account's person name.",
        "Union all emails within the same account with the account's first email.",
        "Group emails by their DSU root, sort each list of emails, and prepend the name."
      ],
      oracleFn: (accounts: string[][]) => {
        const parent = new Map<string, string>();
        const emailToName = new Map<string, string>();
        function find(s: string): string {
          if (parent.get(s) !== s) parent.set(s, find(parent.get(s)!));
          return parent.get(s)!;
        }
        function union(a: string, b: string) {
          parent.set(find(a), find(b));
        }
        for (const account of accounts) {
          const name = account[0];
          for (let i = 1; i < account.length; i++) {
            const email = account[i];
            if (!parent.has(email)) parent.set(email, email);
            emailToName.set(email, name);
            union(account[1], email);
          }
        }
        const groups = new Map<string, string[]>();
        for (const email of parent.keys()) {
          const root = find(email);
          if (!groups.has(root)) groups.set(root, []);
          groups.get(root)!.push(email);
        }
        const res: string[][] = [];
        for (const [root, emails] of groups.entries()) {
          emails.sort();
          res.push([emailToName.get(root)!, ...emails]);
        }
        return res;
      },
      testCases: {
        functional: [
          [[["John", "johnsmith@mail.com", "john_newyork@mail.com"], ["John", "johnsmith@mail.com", "john00@mail.com"], ["Mary", "mary@mail.com"], ["John", "johnnybravo@mail.com"]]],
          [[["Gabe", "Gabe0@m.co", "Gabe3@m.co", "Gabe1@m.co"], ["Kevin", "Kevin3@m.co", "Kevin5@m.co", "Kevin0@m.co"], ["Ethan", "Ethan5@m.co", "Ethan4@m.co", "Ethan0@m.co"], ["Hanzo", "Hanzo3@m.co", "Hanzo1@m.co", "Hanzo0@m.co"]]],
          [[["Alex", "alex@mail.com"]]],
          [[["David", "d1@m.com"], ["David", "d2@m.com"], ["David", "d1@m.com", "d2@m.com"]]]
        ],
        boundary: [
          [[["Alice", "a@m.com", "b@m.com"], ["Alice", "c@m.com", "d@m.com"], ["Alice", "b@m.com", "c@m.com"]]],
          [[["Bob", "bob@mail.com"], ["Bob", "bob@mail.com"]]],
          [[["User", "u1@m.com"], ["User", "u2@m.com"]]],
          [[["A", "1@m.com", "2@m.com"], ["B", "3@m.com"], ["A", "2@m.com", "4@m.com"]]]
        ],
        adversarial: [
          [[["A", "a1@m.com", "a2@m.com"], ["A", "a3@m.com", "a4@m.com"], ["A", "a2@m.com", "a3@m.com"], ["A", "a4@m.com", "a5@m.com"]]],
          [[["Z", "z1@m.com", "z2@m.com"], ["Z", "z2@m.com", "z3@m.com"], ["Z", "z3@m.com", "z4@m.com"]]]
        ],
        stress: [
          [Array.from({ length: 30 }, (_, i) => [`User${i}`, `email${i}@m.com`])],
          [Array.from({ length: 30 }, (_, i) => ["SharedUser", `mail${i}@m.com`, `mail${i + 1}@m.com`])]
        ]
      }
    }),

    // 330. Number of Provinces
    createProblem({
      num: 330,
      title: "Number of Provinces",
      slug: "number-of-provinces",
      level: 15,
      difficulty: "MEDIUM",
      topic: "Union Find",
      patternSlug: "topological-sort-union-find",
      estimatedTimeMin: 15,
      statement: "There are `n` cities. Some of them are connected, while some are not. If city `a` is connected directly with city `b`, and city `b` is connected directly with city `c`, then city `a` is connected indirectly with city `c`.\n\nA province is a group of directly or indirectly connected cities and no other cities outside of the group.\n\nYou are given an `n x n` matrix `isConnected` where `isConnected[i][j] = 1` if the `i-th` city and the `j-th` city are directly connected, and `isConnected[i][j] = 0` otherwise.\n\nReturn the total number of provinces.",
      functionName: "findCircleNum",
      parameters: [{ name: "isConnected", type: "number[][]", description: "n x n adjacency matrix" }],
      returnType: "number",
      constraints: ["1 <= n <= 200", "n == isConnected.length", "n == isConnected[i].length", "isConnected[i][j] is 1 or 0.", "isConnected[i][i] == 1", "isConnected[i][j] == isConnected[j][i]"],
      examples: [
        { input: "isConnected = [[1,1,0],[1,1,0],[0,0,1]]", output: "2", explanation: "Cities 0 and 1 form one province, city 2 forms another." },
        { input: "isConnected = [[1,0,0],[0,1,0],[0,0,1]]", output: "3", explanation: "Three isolated cities = 3 provinces." },
        { input: "isConnected = [[1]]", output: "1", explanation: "Single city." },
        { input: "isConnected = [[1,1],[1,1]]", output: "1", explanation: "Two fully connected cities." }
      ],
      optimalSolution: `function findCircleNum(isConnected) {\n  const n = isConnected.length;\n  const parent = Array.from({ length: n }, (_, i) => i);\n  let provinces = n;\n  function find(x) {\n    if (parent[x] !== x) parent[x] = find(parent[x]);\n    return parent[x];\n  }\n  for (let i = 0; i < n; i++) {\n    for (let j = i + 1; j < n; j++) {\n      if (isConnected[i][j] === 1) {\n        const rootI = find(i), rootJ = find(j);\n        if (rootI !== rootJ) {\n          parent[rootI] = rootJ;\n          provinces--;\n        }\n      }\n    }\n  }\n  return provinces;\n}`,
      optimalTimeComplexity: "O(n^2 * alpha(n))",
      optimalSpaceComplexity: "O(n)",
      suboptimalSolution: `function findCircleNum(isConnected) {\n  const n = isConnected.length;\n  const visited = new Set();\n  let count = 0;\n  for (let i = 0; i < n; i++) {\n    if (!visited.has(i)) {\n      count++;\n      const q = [i];\n      visited.add(i);\n      while (q.length > 0) {\n        const curr = q.shift();\n        for (let j = 0; j < n; j++) {\n          if (isConnected[curr][j] === 1 && !visited.has(j)) {\n            visited.add(j);\n            q.push(j);\n          }\n        }\n      }\n    }\n  }\n  return count;\n}`,
      suboptimalTimeComplexity: "O(n^2)",
      suboptimalSpaceComplexity: "O(n)",
      commonMistakes: ["Forgetting to initialize provinces count to n.", "Checking the entire row including `isConnected[i][i]`."],
      hints: [
        "Initialize provinces = n.",
        "Union city i and city j whenever `isConnected[i][j] === 1`.",
        "Decrement provinces each time a union of two previously separate sets succeeds."
      ],
      oracleFn: (isConnected: number[][]) => {
        const n = isConnected.length;
        const parent = Array.from({ length: n }, (_, i) => i);
        let provinces = n;
        function find(x: number): number {
          if (parent[x] !== x) parent[x] = find(parent[x]);
          return parent[x];
        }
        for (let i = 0; i < n; i++) {
          for (let j = i + 1; j < n; j++) {
            if (isConnected[i][j] === 1) {
              const rootI = find(i), rootJ = find(j);
              if (rootI !== rootJ) {
                parent[rootI] = rootJ;
                provinces--;
              }
            }
          }
        }
        return provinces;
      },
      testCases: {
        functional: [
          [[[1, 1, 0], [1, 1, 0], [0, 0, 1]]],
          [[[1, 0, 0], [0, 1, 0], [0, 0, 1]]],
          [[[1]]],
          [[[1, 1], [1, 1]]]
        ],
        boundary: [
          [[[1, 1, 1], [1, 1, 1], [1, 1, 1]]],
          [[[1, 0], [0, 1]]],
          [[[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]],
          [[[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 1, 1], [0, 0, 1, 1]]]
        ],
        adversarial: [
          [[[1, 1, 0, 0], [1, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 1]]],
          [[[1, 0, 0, 1], [0, 1, 1, 0], [0, 1, 1, 0], [1, 0, 0, 1]]]
        ],
        stress: [
          [Array.from({ length: 30 }, (_, r) => Array.from({ length: 30 }, (_, c) => (r === c ? 1 : 0)))],
          [Array.from({ length: 40 }, () => Array.from({ length: 40 }, () => 1))]
        ]
      }
    }),

    // 331. Regions Cut By Slashes
    createProblem({
      num: 331,
      title: "Regions Cut By Slashes",
      slug: "regions-cut-by-slashes",
      level: 15,
      difficulty: "MEDIUM",
      topic: "Union Find / Graph",
      patternSlug: "topological-sort-union-find",
      estimatedTimeMin: 25,
      statement: "An `n x n` grid is composed of `1 x 1` squares where each `1 x 1` square consists of a `'/'`, `'\\'`, or blank space `' '`. These characters divide the square into contiguous regions.\n\nGiven the grid `grid` represented as a string array, return the number of regions.\n\nNote that backslash characters are escaped, so a `'\\'` is represented as `'\\\\'` in code.",
      functionName: "regionsBySlashes",
      parameters: [{ name: "grid", type: "string[]", description: "Array of slash strings" }],
      returnType: "number",
      constraints: ["n == grid.length == grid[i].length", "1 <= n <= 30", "grid[i][j] is either '/', '\\', or ' '."],
      examples: [
        { input: "grid = [\" /\",\"/ \"]", output: "2", explanation: "Two contiguous regions." },
        { input: "grid = [\" /\",\"  \"]", output: "1", explanation: "One large region." },
        { input: "grid = [\"/\\\\\",\"\\\\/\"]", output: "5", explanation: "5 regions formed by crisscrossing slashes." },
        { input: "grid = [\" \"]", output: "1", explanation: "Single empty square is 1 region." }
      ],
      optimalSolution: `function regionsBySlashes(grid) {\n  const n = grid.length;\n  // Divide each cell into 4 triangles: 0: top, 1: right, 2: bottom, 3: left\n  const total = 4 * n * n;\n  const parent = Array.from({ length: total }, (_, i) => i);\n  let count = total;\n  function find(x) {\n    if (parent[x] !== x) parent[x] = find(parent[x]);\n    return parent[x];\n  }\n  function union(x, y) {\n    const rx = find(x), ry = find(y);\n    if (rx !== ry) {\n      parent[rx] = ry;\n      count--;\n    }\n  }\n  for (let r = 0; r < n; r++) {\n    for (let c = 0; c < n; c++) {\n      const idx = 4 * (r * n + c);\n      const char = grid[r][c];\n      if (char === '/') {\n        union(idx + 0, idx + 3);\n        union(idx + 1, idx + 2);\n      } else if (char === '\\\\') {\n        union(idx + 0, idx + 1);\n        union(idx + 2, idx + 3);\n      } else {\n        union(idx + 0, idx + 1);\n        union(idx + 1, idx + 2);\n        union(idx + 2, idx + 3);\n      }\n      if (r + 1 < n) union(idx + 2, 4 * ((r + 1) * n + c) + 0);\n      if (c + 1 < n) union(idx + 1, 4 * (r * n + (c + 1)) + 3);\n    }\n  }\n  return count;\n}`,
      optimalTimeComplexity: "O(n^2 * alpha(n))",
      optimalSpaceComplexity: "O(n^2)",
      suboptimalSolution: `function regionsBySlashes(grid) {\n  const n = grid.length;\n  const size = 3 * n;\n  const g = Array.from({ length: size }, () => Array(size).fill(0));\n  for (let r = 0; r < n; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '/') {\n        g[3 * r][3 * c + 2] = 1;\n        g[3 * r + 1][3 * c + 1] = 1;\n        g[3 * r + 2][3 * c] = 1;\n      } else if (grid[r][c] === '\\\\') {\n        g[3 * r][3 * c] = 1;\n        g[3 * r + 1][3 * c + 1] = 1;\n        g[3 * r + 2][3 * c + 2] = 1;\n      }\n    }\n  }\n  let regions = 0;\n  function dfs(r, c) {\n    if (r < 0 || r >= size || c < 0 || c >= size || g[r][c] !== 0) return;\n    g[r][c] = 1;\n    dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);\n  }\n  for (let r = 0; r < size; r++) {\n    for (let c = 0; c < size; c++) {\n      if (g[r][c] === 0) { regions++; dfs(r, c); }\n    }\n  }\n  return regions;\n}`,
      suboptimalTimeComplexity: "O(n^2)",
      suboptimalSpaceComplexity: "O(n^2)",
      commonMistakes: ["Subdividing cells into 2x2 instead of 3x3 (2x2 fails because diagonal slashes touch at a single point and cause false leaks).", "Forgetting to escape backslashes."],
      hints: [
        "Method 1: Subdivide each cell into 4 triangles (0: top, 1: right, 2: bottom, 3: left). Union based on slash direction and connect across cell boundaries.",
        "Method 2: Upscale each 1x1 cell to a 3x3 pixel grid. Fill slashes with 1s, then run Flood Fill / Number of Islands on 0s."
      ],
      oracleFn: (grid: string[]) => {
        const n = grid.length;
        const total = 4 * n * n;
        const parent = Array.from({ length: total }, (_, i) => i);
        let count = total;
        function find(x: number): number {
          if (parent[x] !== x) parent[x] = find(parent[x]);
          return parent[x];
        }
        function union(x: number, y: number) {
          const rx = find(x), ry = find(y);
          if (rx !== ry) {
            parent[rx] = ry;
            count--;
          }
        }
        for (let r = 0; r < n; r++) {
          for (let c = 0; c < n; c++) {
            const idx = 4 * (r * n + c);
            const char = grid[r][c];
            if (char === '/') {
              union(idx + 0, idx + 3);
              union(idx + 1, idx + 2);
            } else if (char === '\\') {
              union(idx + 0, idx + 1);
              union(idx + 2, idx + 3);
            } else {
              union(idx + 0, idx + 1);
              union(idx + 1, idx + 2);
              union(idx + 2, idx + 3);
            }
            if (r + 1 < n) union(idx + 2, 4 * ((r + 1) * n + c) + 0);
            if (c + 1 < n) union(idx + 1, 4 * (r * n + (c + 1)) + 3);
          }
        }
        return count;
      },
      testCases: {
        functional: [
          [[" /", "/ "]],
          [[" /", "  "]],
          [["/\\", "\\/"]],
          [[" "]]
        ],
        boundary: [
          [["/"]],
          [["\\"]],
          [["//", "//"]],
          [["\\\\", "\\\\"]]
        ],
        adversarial: [
          [["\\/", "/\\"]],
          [["/\\/", "\\/\\", "/\\/"]]
        ],
        stress: [
          [Array.from({ length: 20 }, (_, r) => Array.from({ length: 20 }, (_, c) => ((r + c) % 2 === 0 ? "/" : "\\")).join(""))],
          [Array.from({ length: 25 }, () => " ".repeat(25))]
        ]
      }
    }),

    // 332. Most Stones Removed with Same Row or Column
    createProblem({
      num: 332,
      title: "Most Stones Removed with Same Row or Column",
      slug: "most-stones-removed-with-same-row-or-column",
      level: 15,
      difficulty: "MEDIUM",
      topic: "Union Find",
      patternSlug: "topological-sort-union-find",
      estimatedTimeMin: 20,
      statement: "On a 2D plane, we place `n` stones at some integer coordinate points. Each coordinate point may have at most one stone.\n\nA stone can be removed if it shares either the same row or the same column as another stone that has not been removed.\n\nGiven an array `stones` of length `n` where `stones[i] = [xi, yi]` represents the location of the `i-th` stone, return the largest possible number of stones that can be removed.",
      functionName: "removeStones",
      parameters: [{ name: "stones", type: "number[][]", description: "Array of stone coordinates [xi, yi]" }],
      returnType: "number",
      constraints: ["1 <= stones.length <= 1000", "0 <= xi, yi <= 10^4", "No two stones are at the same coordinate point."],
      examples: [
        { input: "stones = [[0,0],[0,1],[1,0],[1,2],[2,1],[2,2]]", output: "5", explanation: "One stone can be left in the connected component, 5 removed." },
        { input: "stones = [[0,0],[0,2],[1,1],[2,0],[2,2]]", output: "3", explanation: "Leaves 2 stones across 2 components." },
        { input: "stones = [[0,0]]", output: "0", explanation: "Only one stone, cannot remove." },
        { input: "stones = [[0,1],[1,0]]", output: "0", explanation: "Different row and column, 0 removed." }
      ],
      optimalSolution: `function removeStones(stones) {\n  const parent = new Map();\n  let components = 0;\n  function find(x) {\n    if (!parent.has(x)) {\n      parent.set(x, x);\n      components++;\n    }\n    if (parent.get(x) !== x) {\n      parent.set(x, find(parent.get(x)));\n    }\n    return parent.get(x);\n  }\n  function union(x, y) {\n    const rx = find(x), ry = find(y);\n    if (rx !== ry) {\n      parent.set(rx, ry);\n      components--;\n    }\n  }\n  for (const [r, c] of stones) {\n    union(r, ~c); // bitwise NOT to differentiate row from column IDs\n  }\n  return stones.length - components;\n}`,
      optimalTimeComplexity: "O(n * alpha(n))",
      optimalSpaceComplexity: "O(n)",
      suboptimalSolution: `function removeStones(stones) {\n  const n = stones.length;\n  const adj = Array.from({ length: n }, () => []);\n  for (let i = 0; i < n; i++) {\n    for (let j = i + 1; j < n; j++) {\n      if (stones[i][0] === stones[j][0] || stones[i][1] === stones[j][1]) {\n        adj[i].push(j);\n        adj[j].push(i);\n      }\n    }\n  }\n  const visited = new Set();\n  let components = 0;\n  for (let i = 0; i < n; i++) {\n    if (!visited.has(i)) {\n      components++;\n      const q = [i];\n      visited.add(i);\n      while (q.length > 0) {\n        const u = q.shift();\n        for (const v of adj[u]) {\n          if (!visited.has(v)) { visited.add(v); q.push(v); }\n        }\n      }\n    }\n  }\n  return n - components;\n}`,
      suboptimalTimeComplexity: "O(n^2)",
      suboptimalSpaceComplexity: "O(n^2)",
      commonMistakes: ["Failing to separate row coordinate domain from column coordinate domain (e.g. row 0 and col 0 colliding).", "Assuming the answer is components instead of stones.length - components."],
      hints: [
        "In each connected component of stones (sharing rows or columns), all stones can be removed except one.",
        "Answer = total stones - number of connected components.",
        "Union row `r` with column `~c` (or `c + 10001`) to distinguish row IDs from col IDs."
      ],
      oracleFn: (stones: number[][]) => {
        const parent = new Map<number, number>();
        let components = 0;
        function find(x: number): number {
          if (!parent.has(x)) {
            parent.set(x, x);
            components++;
          }
          if (parent.get(x) !== x) {
            parent.set(x, find(parent.get(x)!));
          }
          return parent.get(x)!;
        }
        function union(x: number, y: number) {
          const rx = find(x), ry = find(y);
          if (rx !== ry) {
            parent.set(rx, ry);
            components--;
          }
        }
        for (const [r, c] of stones) {
          union(r, ~c);
        }
        return stones.length - components;
      },
      testCases: {
        functional: [
          [[[0, 0], [0, 1], [1, 0], [1, 2], [2, 1], [2, 2]]],
          [[[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]]],
          [[[0, 0]]],
          [[[0, 1], [1, 0]]]
        ],
        boundary: [
          [[[0, 0], [1, 1], [2, 2]]],
          [[[0, 0], [0, 1], [0, 2], [0, 3]]],
          [[[0, 0], [1, 0], [2, 0], [3, 0]]],
          [[[0, 0], [1, 1]]]
        ],
        adversarial: [
          [[[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]]],
          [[[1, 2], [2, 3], [3, 1], [4, 5]]]
        ],
        stress: [
          [Array.from({ length: 40 }, (_, i) => [i, i])],
          [Array.from({ length: 50 }, (_, i) => [Math.floor(i / 2), (i % 2) * 5])]
        ]
      }
    }),

    // 333. Satisfiability of Equality Equations
    createProblem({
      num: 333,
      title: "Satisfiability of Equality Equations",
      slug: "satisfiability-of-equality-equations",
      level: 15,
      difficulty: "MEDIUM",
      topic: "Union Find",
      patternSlug: "topological-sort-union-find",
      estimatedTimeMin: 15,
      statement: "You are given an array of strings `equations` that represent relationships between variables where each string `equations[i]` has length 4 and takes one of two different forms: `\"xi==yi\"` or `\"xi!=yi\"`. Here, `xi` and `yi` are lowercase letters that represent single-letter variable names.\n\nReturn `true` if it is possible to assign integers to variable names so as to satisfy all the given equations, or `false` otherwise.",
      functionName: "equationsPossible",
      parameters: [{ name: "equations", type: "string[]", description: "Array of 4-character equation strings" }],
      returnType: "boolean",
      constraints: ["1 <= equations.length <= 500", "equations[i].length == 4", "equations[i][0] and equations[i][3] are lowercase English letters.", "equations[i][1] is either '=' or '!'.", "equations[i][2] is '='."],
      examples: [
        { input: "equations = [\"a==b\",\"b!=a\"]", output: "false", explanation: "Contradiction: a cannot equal b and not equal b." },
        { input: "equations = [\"b==a\",\"a==b\"]", output: "true", explanation: "Consistent equations." },
        { input: "equations = [\"a==b\",\"b==c\",\"a==c\"]", output: "true", explanation: "Transitive equality satisfied." },
        { input: "equations = [\"a==b\",\"b!=c\",\"c==a\"]", output: "false", explanation: "a == b and a == c implies b == c, contradicting b != c." }
      ],
      optimalSolution: `function equationsPossible(equations) {\n  const parent = Array.from({ length: 26 }, (_, i) => i);\n  function find(x) {\n    if (parent[x] !== x) parent[x] = find(parent[x]);\n    return parent[x];\n  }\n  for (const eq of equations) {\n    if (eq[1] === '=') {\n      const u = eq.charCodeAt(0) - 97;\n      const v = eq.charCodeAt(3) - 97;\n      parent[find(u)] = find(v);\n    }\n  }\n  for (const eq of equations) {\n    if (eq[1] === '!') {\n      const u = eq.charCodeAt(0) - 97;\n      const v = eq.charCodeAt(3) - 97;\n      if (find(u) === find(v)) return false;\n    }\n  }\n  return true;\n}`,
      optimalTimeComplexity: "O(n)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function equationsPossible(equations) {\n  const adj = Array.from({ length: 26 }, () => []);\n  for (const eq of equations) {\n    if (eq[1] === '=') {\n      const u = eq.charCodeAt(0) - 97, v = eq.charCodeAt(3) - 97;\n      adj[u].push(v); adj[v].push(u);\n    }\n  }\n  function canReach(src, dst) {\n    const visited = new Set([src]);\n    const q = [src];\n    while (q.length > 0) {\n      const curr = q.shift();\n      if (curr === dst) return true;\n      for (const next of adj[curr]) {\n        if (!visited.has(next)) { visited.add(next); q.push(next); }\n      }\n    }\n    return false;\n  }\n  for (const eq of equations) {\n    if (eq[1] === '!') {\n      const u = eq.charCodeAt(0) - 97, v = eq.charCodeAt(3) - 97;\n      if (canReach(u, v)) return false;\n    }\n  }\n  return true;\n}`,
      suboptimalTimeComplexity: "O(n^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Processing '!=' before all '==' have been processed.", "Not checking self-contradiction `a!=a`."],
      hints: [
        "First pass: process all equality equations `\"x==y\"` by unioning x and y in a Disjoint Set.",
        "Second pass: process all inequality equations `\"x!=y\"`. If `find(x) === find(y)`, return false.",
        "If all inequality equations pass, return true."
      ],
      oracleFn: (equations: string[]) => {
        const parent = Array.from({ length: 26 }, (_, i) => i);
        function find(x: number): number {
          if (parent[x] !== x) parent[x] = find(parent[x]);
          return parent[x];
        }
        for (const eq of equations) {
          if (eq[1] === '=') {
            const u = eq.charCodeAt(0) - 97;
            const v = eq.charCodeAt(3) - 97;
            parent[find(u)] = find(v);
          }
        }
        for (const eq of equations) {
          if (eq[1] === '!') {
            const u = eq.charCodeAt(0) - 97;
            const v = eq.charCodeAt(3) - 97;
            if (find(u) === find(v)) return false;
          }
        }
        return true;
      },
      testCases: {
        functional: [
          [["a==b", "b!=a"]],
          [["b==a", "a==b"]],
          [["a==b", "b==c", "a==c"]],
          [["a==b", "b!=c", "c==a"]]
        ],
        boundary: [
          [["a!=a"]],
          [["a==a"]],
          [["c==c", "b==d", "x!=z"]],
          [["a==b", "c==d", "a==c", "b!=d"]]
        ],
        adversarial: [
          [["a==b", "e==c", "b==c", "a!=e"]],
          [["f==a", "a==b", "f!=e", "a==c", "b==e", "c==f"]]
        ],
        stress: [
          [Array.from({ length: 25 }, (_, i) => `${String.fromCharCode(97 + i)}==${String.fromCharCode(98 + i)}`)],
          [[...Array.from({ length: 25 }, (_, i) => `${String.fromCharCode(97 + i)}==${String.fromCharCode(98 + i)}`), "a!=z"]]
        ]
      }
    }),

    // 334. Checking Existence of Edge Length Limited Paths
    createProblem({
      num: 334,
      title: "Checking Existence of Edge Length Limited Paths",
      slug: "checking-existence-of-edge-length-limited-paths",
      level: 15,
      difficulty: "HARD",
      topic: "Union Find / Offline Queries",
      patternSlug: "topological-sort-union-find",
      estimatedTimeMin: 30,
      statement: "An undirected graph of `n` nodes is defined by `edgeList`, where `edgeList[i] = [ui, vi, dis_i]` denotes an edge between nodes `ui` and `vi` with distance `dis_i`. There may be multiple edges between two nodes.\n\nGiven an array `queries`, where `queries[j] = [pj, qj, limit_j]`, your task is to determine for each query whether there is a path between `pj` and `qj` such that each edge on the path has a distance strictly less than `limit_j`.\n\nReturn a boolean array `answer`, where `answer.length == queries.length` and the `j-th` value of `answer` is `true` if there is a path for `queries[j]` and `false` otherwise.",
      functionName: "distanceLimitedPathsExist",
      parameters: [
        { name: "n", type: "number", description: "Number of vertices" },
        { name: "edgeList", type: "number[][]", description: "List of edges [u, v, dist]" },
        { name: "queries", type: "number[][]", description: "List of queries [p, q, limit]" }
      ],
      returnType: "boolean[]",
      constraints: ["2 <= n <= 10^5", "1 <= edgeList.length, queries.length <= 10^5", "edgeList[i].length == 3", "queries[j].length == 3", "0 <= ui, vi, pj, qj <= n - 1", "ui != vi", "pj != qj", "1 <= dis_i, limit_j <= 10^9"],
      examples: [
        { input: "n = 3, edgeList = [[0,1,2],[1,2,4],[2,0,8],[1,0,16]], queries = [[0,1,2],[0,2,5]]", output: "[false,true]", explanation: "For query [0,1,2], limit 2 allows edges < 2 (none, direct edge is 2 so not strictly less). For [0,2,5], path 0-1-2 has edges 2 and 4 < 5 (true)." },
        { input: "n = 5, edgeList = [[0,1,10],[1,2,5],[2,3,9],[3,4,13]], queries = [[0,4,14],[1,4,13]]", output: "[true,false]", explanation: "For [0,4,14], max edge on path is 13 < 14 (true)." },
        { input: "n = 2, edgeList = [[0,1,1]], queries = [[0,1,2]]", output: "[true]", explanation: "Direct edge 1 < 2." },
        { input: "n = 2, edgeList = [[0,1,5]], queries = [[0,1,5]]", output: "[false]", explanation: "Strictly less than limit: 5 < 5 is false." }
      ],
      optimalSolution: `function distanceLimitedPathsExist(n, edgeList, queries) {\n  const m = queries.length;\n  const indexedQueries = queries.map((q, i) => [q[0], q[1], q[2], i]);\n  edgeList.sort((a, b) => a[2] - b[2]);\n  indexedQueries.sort((a, b) => a[2] - b[2]);\n  const parent = Array.from({ length: n }, (_, i) => i);\n  function find(x) {\n    if (parent[x] !== x) parent[x] = find(parent[x]);\n    return parent[x];\n  }\n  function union(x, y) {\n    parent[find(x)] = find(y);\n  }\n  const ans = new Array(m);\n  let edgeIdx = 0;\n  for (const [p, q, limit, originalIdx] of indexedQueries) {\n    while (edgeIdx < edgeList.length && edgeList[edgeIdx][2] < limit) {\n      union(edgeList[edgeIdx][0], edgeList[edgeIdx][1]);\n      edgeIdx++;\n    }\n    ans[originalIdx] = find(p) === find(q);\n  }\n  return ans;\n}`,
      optimalTimeComplexity: "O(E log E + Q log Q)",
      optimalSpaceComplexity: "O(V + Q)",
      suboptimalSolution: `function distanceLimitedPathsExist(n, edgeList, queries) {\n  return queries.map(([p, q, limit]) => {\n    const parent = Array.from({ length: n }, (_, i) => i);\n    function find(x) { if (parent[x] !== x) parent[x] = find(parent[x]); return parent[x]; }\n    for (const [u, v, d] of edgeList) {\n      if (d < limit) parent[find(u)] = find(v);\n    }\n    return find(p) === find(q);\n  });\n}`,
      suboptimalTimeComplexity: "O(Q * E)",
      suboptimalSpaceComplexity: "O(V)",
      commonMistakes: ["Rebuilding the Union-Find from scratch for each query (O(Q * E) TLE).", "Using <= instead of < for the distance check (problem specifies strictly less than limit)."],
      hints: [
        "Offline queries technique: Sort both edgeList and queries by weight/limit in ascending order.",
        "Iterate through sorted queries; add all edges with weight < query limit to the DSU.",
        "Check `find(p) === find(q)` and store result at the query's original index."
      ],
      oracleFn: (n: number, edgeList: number[][], queries: number[][]) => {
        const m = queries.length;
        const indexedQueries = queries.map((q, i) => [q[0], q[1], q[2], i]);
        edgeList.sort((a, b) => a[2] - b[2]);
        indexedQueries.sort((a, b) => a[2] - b[2]);
        const parent = Array.from({ length: n }, (_, i) => i);
        function find(x: number): number {
          if (parent[x] !== x) parent[x] = find(parent[x]);
          return parent[x];
        }
        function union(x: number, y: number) {
          parent[find(x)] = find(y);
        }
        const ans = new Array<boolean>(m);
        let edgeIdx = 0;
        for (const [p, q, limit, originalIdx] of indexedQueries) {
          while (edgeIdx < edgeList.length && edgeList[edgeIdx][2] < limit) {
            union(edgeList[edgeIdx][0], edgeList[edgeIdx][1]);
            edgeIdx++;
          }
          ans[originalIdx] = find(p) === find(q);
        }
        return ans;
      },
      testCases: {
        functional: [
          [3, [[0, 1, 2], [1, 2, 4], [2, 0, 8], [1, 0, 16]], [[0, 1, 2], [0, 2, 5]]],
          [5, [[0, 1, 10], [1, 2, 5], [2, 3, 9], [3, 4, 13]], [[0, 4, 14], [1, 4, 13]]],
          [2, [[0, 1, 1]], [[0, 1, 2]]],
          [2, [[0, 1, 5]], [[0, 1, 5]]]
        ],
        boundary: [
          [3, [], [[0, 1, 10]]],
          [4, [[0, 1, 1], [1, 2, 2], [2, 3, 3]], [[0, 3, 4], [0, 3, 3]]],
          [3, [[0, 1, 100]], [[0, 2, 200]]],
          [2, [[0, 1, 10]], [[0, 1, 11]]]
        ],
        adversarial: [
          [4, [[0, 1, 5], [1, 2, 5], [2, 3, 5]], [[0, 3, 5], [0, 3, 6]]],
          [5, [[0, 1, 2], [1, 2, 2], [2, 3, 2], [3, 4, 2]], [[0, 4, 3], [0, 4, 2]]]
        ],
        stress: [
          [50, Array.from({ length: 49 }, (_, i) => [i, i + 1, i + 1]), [[0, 49, 50], [0, 49, 40]]],
          [40, Array.from({ length: 39 }, (_, i) => [i, i + 1, 10]), [[0, 39, 11], [0, 39, 10]]]
        ]
      }
    }),

    // 335. Min Cost to Connect All Points
    createProblem({
      num: 335,
      title: "Min Cost to Connect All Points",
      slug: "min-cost-to-connect-all-points",
      level: 15,
      difficulty: "MEDIUM",
      topic: "MST / Union Find",
      patternSlug: "topological-sort-union-find",
      estimatedTimeMin: 25,
      statement: "You are given an array `points` representing integer coordinates of some points on a 2D-plane, where `points[i] = [xi, yi]`.\n\nThe cost of connecting two points `[xi, yi]` and `[xj, yj]` is the manhattan distance between them: `|xi - xj| + |yi - yj|`, where `|val|` denotes the absolute value of `val`.\n\nReturn the minimum cost to make all points connected. All points are connected if there is exactly one simple path between any two points.",
      functionName: "minCostConnectPoints",
      parameters: [{ name: "points", type: "number[][]", description: "Array of coordinates [xi, yi]" }],
      returnType: "number",
      constraints: ["1 <= points.length <= 1000", "-10^6 <= xi, yi <= 10^6", "All pairs (xi, yi) are distinct."],
      examples: [
        { input: "points = [[0,0],[2,2],[3,10],[5,2],[7,0]]", output: "20", explanation: "Connect: (0,0)-(2,2) cost 4, (2,2)-(5,2) cost 3, (5,2)-(7,0) cost 4, (2,2)-(3,10) cost 9. Total 20." },
        { input: "points = [[3,12],[-2,5],[-4,1]]", output: "18", explanation: "MST connects all 3 points with cost 18." },
        { input: "points = [[0,0]]", output: "0", explanation: "Single point requires 0 cost." },
        { input: "points = [[0,0],[1,1]]", output: "2", explanation: "|0-1| + |0-1| = 2." }
      ],
      optimalSolution: `function minCostConnectPoints(points) {\n  const n = points.length;\n  if (n <= 1) return 0;\n  const dist = new Array(n).fill(Infinity);\n  const visited = new Array(n).fill(false);\n  dist[0] = 0;\n  let totalCost = 0;\n  for (let step = 0; step < n; step++) {\n    let u = -1;\n    for (let i = 0; i < n; i++) {\n      if (!visited[i] && (u === -1 || dist[i] < dist[u])) u = i;\n    }\n    visited[u] = true;\n    totalCost += dist[u];\n    for (let v = 0; v < n; v++) {\n      if (!visited[v]) {\n        const cost = Math.abs(points[u][0] - points[v][0]) + Math.abs(points[u][1] - points[v][1]);\n        if (cost < dist[v]) dist[v] = cost;\n      }\n    }\n  }\n  return totalCost;\n}`,
      optimalTimeComplexity: "O(n^2)",
      optimalSpaceComplexity: "O(n)",
      suboptimalSolution: `function minCostConnectPoints(points) {\n  const n = points.length;\n  const edges = [];\n  for (let i = 0; i < n; i++) {\n    for (let j = i + 1; j < n; j++) {\n      const cost = Math.abs(points[i][0] - points[j][0]) + Math.abs(points[i][1] - points[j][1]);\n      edges.push([i, j, cost]);\n    }\n  }\n  edges.sort((a, b) => a[2] - b[2]);\n  const parent = Array.from({ length: n }, (_, i) => i);\n  function find(x) { if (parent[x] !== x) parent[x] = find(parent[x]); return parent[x]; }\n  let total = 0, count = 0;\n  for (const [u, v, cost] of edges) {\n    const ru = find(u), rv = find(v);\n    if (ru !== rv) {\n      parent[ru] = rv;\n      total += cost;\n      if (++count === n - 1) break;\n    }\n  }\n  return total;\n}`,
      suboptimalTimeComplexity: "O(n^2 log n)",
      suboptimalSpaceComplexity: "O(n^2)",
      commonMistakes: ["Using Euclidean distance instead of Manhattan distance |x1 - x2| + |y1 - y2|.", "Generating all O(N^2) edges in Kruskal's for large N causing memory overhead when Prim's algorithm in O(N^2) time and O(N) space is optimal for dense complete graphs."],
      hints: [
        "This is a Minimum Spanning Tree (MST) problem on a complete graph.",
        "Prim's algorithm with an array runs in O(V^2) time and O(V) space.",
        "Keep track of the minimum distance to connect each unvisited node to the MST."
      ],
      oracleFn: (points: number[][]) => {
        const n = points.length;
        if (n <= 1) return 0;
        const dist = new Array(n).fill(Infinity);
        const visited = new Array(n).fill(false);
        dist[0] = 0;
        let totalCost = 0;
        for (let step = 0; step < n; step++) {
          let u = -1;
          for (let i = 0; i < n; i++) {
            if (!visited[i] && (u === -1 || dist[i] < dist[u])) u = i;
          }
          visited[u] = true;
          totalCost += dist[u];
          for (let v = 0; v < n; v++) {
            if (!visited[v]) {
              const cost = Math.abs(points[u][0] - points[v][0]) + Math.abs(points[u][1] - points[v][1]);
              if (cost < dist[v]) dist[v] = cost;
            }
          }
        }
        return totalCost;
      },
      testCases: {
        functional: [
          [[[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]]],
          [[[3, 12], [-2, 5], [-4, 1]]],
          [[[0, 0]]],
          [[[0, 0], [1, 1]]]
        ],
        boundary: [
          [[[0, 0], [1, 0], [2, 0], [3, 0]]],
          [[[0, 0], [0, 1], [0, 2], [0, 3]]],
          [[[-10, -10], [10, 10]]],
          [[[0, 0], [1, 1], [2, 2]]]
        ],
        adversarial: [
          [[[0, 0], [1, 10], [2, 0], [3, 10]]],
          [[[-1, -1], [1, 1], [-2, -2], [2, 2]]]
        ],
        stress: [
          [Array.from({ length: 30 }, (_, i) => [i * 2, i * 3])],
          [Array.from({ length: 35 }, (_, i) => [i, (i % 5) * 10])]
        ]
      }
    }),

    // 336. Number of Operations to Make Network Connected
    createProblem({
      num: 336,
      title: "Number of Operations to Make Network Connected",
      slug: "number-of-operations-to-make-network-connected",
      level: 15,
      difficulty: "MEDIUM",
      topic: "Union Find",
      patternSlug: "topological-sort-union-find",
      estimatedTimeMin: 15,
      statement: "There are `n` computers numbered from `0` to `n - 1` connected by ethernet cables `connections` forming a network where `connections[i] = [ai, bi]` represents a connection between computers `ai` and `bi`. Any computer can reach any other computer directly or indirectly through the network.\n\nYou are given an initial computer network `connections`. You can extract certain cables between two directly connected computers, and place them between any pair of disconnected computers to make them directly connected.\n\nReturn the minimum number of times you need to do this in order to make all the computers connected. If it is not possible, return `-1`.",
      functionName: "makeConnected",
      parameters: [
        { name: "n", type: "number", description: "Number of computers" },
        { name: "connections", type: "number[][]", description: "Existing ethernet connections" }
      ],
      returnType: "number",
      constraints: ["1 <= n <= 10^5", "1 <= connections.length <= min(n * (n - 1) / 2, 10^5)", "connections[i].length == 2", "0 <= ai, bi < n", "ai != bi", "There are no repeated connections.", "No computer is connected to itself."],
      examples: [
        { input: "n = 4, connections = [[0,1],[0,2],[1,2]]", output: "1", explanation: "Remove redundant wire [1,2] and connect computer 3." },
        { input: "n = 6, connections = [[0,1],[0,2],[0,3],[1,2],[1,3]]", output: "2", explanation: "Two extra redundant cables can connect computers 4 and 5." },
        { input: "n = 6, connections = [[0,1],[0,2],[0,3],[1,2]]", output: "-1", explanation: "4 connections is not enough to connect 6 computers (needs >= 5)." },
        { input: "n = 1, connections = []", output: "0", explanation: "Already connected." }
      ],
      optimalSolution: `function makeConnected(n, connections) {\n  if (connections.length < n - 1) return -1;\n  const parent = Array.from({ length: n }, (_, i) => i);\n  let components = n;\n  function find(x) {\n    if (parent[x] !== x) parent[x] = find(parent[x]);\n    return parent[x];\n  }\n  for (const [u, v] of connections) {\n    const rootU = find(u), rootV = find(v);\n    if (rootU !== rootV) {\n      parent[rootU] = rootV;\n      components--;\n    }\n  }\n  return components - 1;\n}`,
      optimalTimeComplexity: "O(n + E * alpha(n))",
      optimalSpaceComplexity: "O(n)",
      suboptimalSolution: `function makeConnected(n, connections) {\n  if (connections.length < n - 1) return -1;\n  const adj = Array.from({ length: n }, () => []);\n  for (const [u, v] of connections) { adj[u].push(v); adj[v].push(u); }\n  const visited = new Set();\n  let components = 0;\n  for (let i = 0; i < n; i++) {\n    if (!visited.has(i)) {\n      components++;\n      const q = [i];\n      visited.add(i);\n      while (q.length > 0) {\n        const u = q.shift();\n        for (const v of adj[u]) {\n          if (!visited.has(v)) { visited.add(v); q.push(v); }\n        }\n      }\n    }\n  }\n  return components - 1;\n}`,
      suboptimalTimeComplexity: "O(V + E)",
      suboptimalSpaceComplexity: "O(V + E)",
      commonMistakes: ["Forgetting that connecting k components requires exactly k - 1 cables.", "Not checking `connections.length < n - 1` initially."],
      hints: [
        "To connect n computers, at least n - 1 cables are required.",
        "If `connections.length < n - 1`, return -1 immediately.",
        "Count the number of connected components c using Union-Find. We need `c - 1` operations."
      ],
      oracleFn: (n: number, connections: number[][]) => {
        if (connections.length < n - 1) return -1;
        const parent = Array.from({ length: n }, (_, i) => i);
        let components = n;
        function find(x: number): number {
          if (parent[x] !== x) parent[x] = find(parent[x]);
          return parent[x];
        }
        for (const [u, v] of connections) {
          const rootU = find(u), rootV = find(v);
          if (rootU !== rootV) {
            parent[rootU] = rootV;
            components--;
          }
        }
        return components - 1;
      },
      testCases: {
        functional: [
          [4, [[0, 1], [0, 2], [1, 2]]],
          [6, [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3]]],
          [6, [[0, 1], [0, 2], [0, 3], [1, 2]]],
          [1, []]
        ],
        boundary: [
          [2, [[0, 1]]],
          [2, []],
          [5, [[0, 1], [0, 2], [0, 3], [0, 4]]],
          [5, [[0, 1], [1, 2], [2, 0], [3, 4]]]
        ],
        adversarial: [
          [6, [[0, 1], [1, 2], [2, 0], [3, 4], [4, 5], [5, 3]]],
          [4, [[0, 1], [1, 2], [2, 3]]]
        ],
        stress: [
          [50, Array.from({ length: 49 }, (_, i) => [i, i + 1])],
          [50, Array.from({ length: 48 }, (_, i) => [i, i + 1])]
        ]
      }
    }),

    // 337. Swim in Rising Water
    createProblem({
      num: 337,
      title: "Swim in Rising Water",
      slug: "swim-in-rising-water",
      level: 15,
      difficulty: "HARD",
      topic: "Union Find / BFS / Binary Search",
      patternSlug: "topological-sort-union-find",
      estimatedTimeMin: 25,
      statement: "You are given an `n x n` integer matrix `grid` where each value `grid[i][j]` represents the elevation at that point `(i, j)`.\n\nThe rain starts to fall. At time `t`, the depth of the water everywhere is `t`. You can swim from a square to another 4-directionally adjacent square if and only if the elevation of both squares individually are at most `t`.\n\nYou start at the top left square `(0, 0)`. What is the least time until you can reach the bottom right square `(n - 1, n - 1)`?",
      functionName: "swimInWater",
      parameters: [{ name: "grid", type: "number[][]", description: "n x n elevation grid" }],
      returnType: "number",
      constraints: ["n == grid.length == grid[i].length", "1 <= n <= 50", "0 <= grid[i][j] < n^2", "Each value grid[i][j] is unique."],
      examples: [
        { input: "grid = [[0,2],[1,3]]", output: "3", explanation: "At t=3, water level is 3, can traverse (0,0)->(1,0)->(1,1)." },
        { input: "grid = [[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]", output: "16", explanation: "Path elevation max is 16." },
        { input: "grid = [[0]]", output: "0", explanation: "Already at destination at t=0." },
        { input: "grid = [[3,2],[0,1]]", output: "3", explanation: "Start elevation is 3, cannot swim before t=3." }
      ],
      optimalSolution: `function swimInWater(grid) {\n  const n = grid.length;\n  let low = Math.max(grid[0][0], grid[n - 1][n - 1]);\n  let high = n * n - 1;\n  function canReach(t) {\n    const visited = Array.from({ length: n }, () => Array(n).fill(false));\n    const q = [[0, 0]];\n    visited[0][0] = true;\n    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];\n    while (q.length > 0) {\n      const [r, c] = q.shift();\n      if (r === n - 1 && c === n - 1) return true;\n      for (const [dr, dc] of dirs) {\n        const nr = r + dr, nc = c + dc;\n        if (nr >= 0 && nr < n && nc >= 0 && nc < n && !visited[nr][nc] && grid[nr][nc] <= t) {\n          visited[nr][nc] = true;\n          q.push([nr, nc]);\n        }\n      }\n    }\n    return false;\n  }\n  while (low < high) {\n    const mid = Math.floor((low + high) / 2);\n    if (canReach(mid)) high = mid;\n    else low = mid + 1;\n  }\n  return low;\n}`,
      optimalTimeComplexity: "O(n^2 log(n^2))",
      optimalSpaceComplexity: "O(n^2)",
      suboptimalSolution: `function swimInWater(grid) {\n  const n = grid.length;\n  const dist = Array.from({ length: n }, () => Array(n).fill(Infinity));\n  dist[0][0] = grid[0][0];\n  const q = [[0, 0, grid[0][0]]];\n  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];\n  while (q.length > 0) {\n    q.sort((a, b) => a[2] - b[2]);\n    const [r, c, d] = q.shift();\n    if (r === n - 1 && c === n - 1) return d;\n    for (const [dr, dc] of dirs) {\n      const nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nr < n && nc >= 0 && nc < n) {\n        const nd = Math.max(d, grid[nr][nc]);\n        if (nd < dist[nr][nc]) {\n          dist[nr][nc] = nd;\n          q.push([nr, nc, nd]);\n        }\n      }\n    }\n  }\n  return dist[n - 1][n - 1];\n}`,
      suboptimalTimeComplexity: "O(n^2 log n)",
      suboptimalSpaceComplexity: "O(n^2)",
      commonMistakes: ["Starting binary search from 0 instead of `Math.max(grid[0][0], grid[n-1][n-1])`.", "Summing elevations instead of taking the maximum along the path."],
      hints: [
        "Binary search on the answer: range is [max(grid[0][0], grid[n-1][n-1]), n*n - 1].",
        "For a candidate time t, check if (0,0) can reach (n-1,n-1) via BFS using only cells with grid[r][c] <= t.",
        "Alternatively, use Dijkstra's algorithm or Kruskal's with Union-Find."
      ],
      oracleFn: (grid: number[][]) => {
        const n = grid.length;
        let low = Math.max(grid[0][0], grid[n - 1][n - 1]);
        let high = n * n - 1;
        function canReach(t: number): boolean {
          const visited = Array.from({ length: n }, () => Array(n).fill(false));
          const q: [number, number][] = [[0, 0]];
          visited[0][0] = true;
          const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
          while (q.length > 0) {
            const [r, c] = q.shift()!;
            if (r === n - 1 && c === n - 1) return true;
            for (const [dr, dc] of dirs) {
              const nr = r + dr, nc = c + dc;
              if (nr >= 0 && nr < n && nc >= 0 && nc < n && !visited[nr][nc] && grid[nr][nc] <= t) {
                visited[nr][nc] = true;
                q.push([nr, nc]);
              }
            }
          }
          return false;
        }
        while (low < high) {
          const mid = Math.floor((low + high) / 2);
          if (canReach(mid)) high = mid;
          else low = mid + 1;
        }
        return low;
      },
      testCases: {
        functional: [
          [[[0, 2], [1, 3]]],
          [[[0, 1, 2, 3, 4], [24, 23, 22, 21, 5], [12, 13, 14, 15, 16], [11, 17, 18, 19, 20], [10, 9, 8, 7, 6]]],
          [[[0]]],
          [[[3, 2], [0, 1]]]
        ],
        boundary: [
          [[[0, 1], [2, 3]]],
          [[[1, 0], [3, 2]]],
          [[[0, 3, 2], [1, 4, 5], [8, 7, 6]]],
          [[[0, 8, 2], [3, 4, 5], [1, 7, 6]]]
        ],
        adversarial: [
          [[[7, 6, 5], [8, 0, 4], [1, 2, 3]]],
          [[[0, 1, 2], [5, 4, 3], [6, 7, 8]]]
        ],
        stress: [
          [Array.from({ length: 15 }, (_, r) => Array.from({ length: 15 }, (_, c) => r * 15 + c))],
          [Array.from({ length: 20 }, (_, r) => Array.from({ length: 20 }, (_, c) => (r + c) * 2))]
        ]
      }
    }),

    // 338. Bricks Falling When Hit
    createProblem({
      num: 338,
      title: "Bricks Falling When Hit",
      slug: "bricks-falling-when-hit",
      level: 15,
      difficulty: "HARD",
      topic: "Union Find",
      patternSlug: "topological-sort-union-find",
      estimatedTimeMin: 35,
      statement: "You are given an `m x n` binary `grid`, where each `1` represents a brick and `0` represents an empty space. A brick is stable if:\n- It is directly connected to the top of the grid (`row 0`), or\n- At least one of its four adjacent neighboring cells is stable.\n\nYou are also given an array `hits`, which is a sequence of erasures we want to apply. Each time we want to erase the brick at the location `hits[i] = (row_i, col_i)`. If there is no brick at that location, no brick drops.\n\nReturn an array `result` where each `result[i]` is the number of bricks that fall after the `i-th` erasure is applied.",
      functionName: "hitBricks",
      parameters: [
        { name: "grid", type: "number[][]", description: "Binary bricks grid" },
        { name: "hits", type: "number[][]", description: "Sequence of hits [r, c]" }
      ],
      returnType: "number[]",
      constraints: ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 200", "grid[i][j] is 0 or 1", "1 <= hits.length <= 4 * 10^4", "hits[k].length == 2", "0 <= row_i < m", "0 <= col_i < n", "All hits[k] are unique."],
      examples: [
        { input: "grid = [[1,0,0,0],[1,1,1,0]], hits = [[1,0]]", output: "[2]", explanation: "Removing brick at (1,0) leaves bricks at (1,1) and (1,2) disconnected from roof, so 2 bricks fall." },
        { input: "grid = [[1,0,0,0],[1,1,0,0]], hits = [[1,1],[1,0]]", output: "[0,0]", explanation: "First hit removes an edge brick; second hit removes the root of the column, no other bricks drop." },
        { input: "grid = [[1]], hits = [[0,0]]", output: "[0]", explanation: "Single brick on roof removed, 0 others fall." },
        { input: "grid = [[0]], hits = [[0,0]]", output: "[0]", explanation: "No brick at (0,0)." }
      ],
      optimalSolution: `function hitBricks(grid, hits) {\n  const m = grid.length, n = grid[0].length;\n  const g = grid.map(row => [...row]);\n  for (const [r, c] of hits) {\n    if (g[r][c] === 1) g[r][c] = 2; // marked as hit brick\n  }\n  const total = m * n + 1;\n  const TOP = m * n;\n  const parent = Array.from({ length: total }, (_, i) => i);\n  const size = new Array(total).fill(1);\n  function find(x) {\n    if (parent[x] !== x) parent[x] = find(parent[x]);\n    return parent[x];\n  }\n  function union(x, y) {\n    const rx = find(x), ry = find(y);\n    if (rx !== ry) {\n      parent[rx] = ry;\n      size[ry] += size[rx];\n    }\n  }\n  for (let c = 0; c < n; c++) {\n    if (g[0][c] === 1) union(c, TOP);\n  }\n  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (g[r][c] === 1) {\n        const idx = r * n + c;\n        if (r > 0 && g[r - 1][c] === 1) union(idx, (r - 1) * n + c);\n        if (c > 0 && g[r][c - 1] === 1) union(idx, r * n + c - 1);\n      }\n    }\n  }\n  const res = new Array(hits.length).fill(0);\n  for (let i = hits.length - 1; i >= 0; i--) {\n    const [r, c] = hits[i];\n    if (grid[r][c] === 0) continue;\n    const prevSize = size[find(TOP)];\n    const idx = r * n + c;\n    if (r === 0) union(idx, TOP);\n    for (const [dr, dc] of dirs) {\n      const nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nr < m && nc >= 0 && nc < n && g[nr][nc] === 1) {\n        union(idx, nr * n + nc);\n      }\n    }\n    g[r][c] = 1;\n    const currSize = size[find(TOP)];\n    res[i] = Math.max(0, currSize - prevSize - 1);\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(m * n + H * alpha(m * n))",
      optimalSpaceComplexity: "O(m * n)",
      suboptimalSolution: `function hitBricks(grid, hits) {\n  const m = grid.length, n = grid[0].length;\n  const res = [];\n  const g = grid.map(row => [...row]);\n  function countStable() {\n    const visited = Array.from({ length: m }, () => Array(n).fill(false));\n    let count = 0;\n    const q = [];\n    for (let c = 0; c < n; c++) {\n      if (g[0][c] === 1) { visited[0][c] = true; q.push([0, c]); }\n    }\n    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];\n    while (q.length > 0) {\n      const [r, c] = q.shift();\n      count++;\n      for (const [dr, dc] of dirs) {\n        const nr = r + dr, nc = c + dc;\n        if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc] && g[nr][nc] === 1) {\n          visited[nr][nc] = true;\n          q.push([nr, nc]);\n        }\n      }\n    }\n    return count;\n  }\n  for (const [r, c] of hits) {\n    if (g[r][c] === 0) { res.push(0); continue; }\n    const before = countStable();\n    g[r][c] = 0;\n    const after = countStable();\n    res.push(Math.max(0, before - after - 1));\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(H * m * n)",
      suboptimalSpaceComplexity: "O(m * n)",
      commonMistakes: ["Applying hits forward (simulating drops forward is O(H * m * n) which TLEs).", "Forgetting to subtract 1 for the erased brick itself."],
      hints: [
        "Time-reversal trick: reverse the process by starting from the final grid after all hits are removed, and adding bricks back backwards.",
        "Use Union-Find with a virtual TOP node connected to all row 0 bricks.",
        "When restoring brick at (r, c), the change in TOP component size minus 1 is the number of dropped bricks."
      ],
      oracleFn: (grid: number[][], hits: number[][]) => {
        const m = grid.length, n = grid[0].length;
        const g = grid.map(row => [...row]);
        for (const [r, c] of hits) {
          if (g[r][c] === 1) g[r][c] = 2;
        }
        const total = m * n + 1;
        const TOP = m * n;
        const parent = Array.from({ length: total }, (_, i) => i);
        const size = new Array(total).fill(1);
        function find(x: number): number {
          if (parent[x] !== x) parent[x] = find(parent[x]);
          return parent[x];
        }
        function union(x: number, y: number) {
          const rx = find(x), ry = find(y);
          if (rx !== ry) {
            parent[rx] = ry;
            size[ry] += size[rx];
          }
        }
        for (let c = 0; c < n; c++) {
          if (g[0][c] === 1) union(c, TOP);
        }
        const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
        for (let r = 0; r < m; r++) {
          for (let c = 0; c < n; c++) {
            if (g[r][c] === 1) {
              const idx = r * n + c;
              if (r > 0 && g[r - 1][c] === 1) union(idx, (r - 1) * n + c);
              if (c > 0 && g[r][c - 1] === 1) union(idx, r * n + c - 1);
            }
          }
        }
        const res = new Array(hits.length).fill(0);
        for (let i = hits.length - 1; i >= 0; i--) {
          const [r, c] = hits[i];
          if (grid[r][c] === 0) continue;
          const prevSize = size[find(TOP)];
          const idx = r * n + c;
          if (r === 0) union(idx, TOP);
          for (const [dr, dc] of dirs) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < m && nc >= 0 && nc < n && g[nr][nc] === 1) {
              union(idx, nr * n + nc);
            }
          }
          g[r][c] = 1;
          const currSize = size[find(TOP)];
          res[i] = Math.max(0, currSize - prevSize - 1);
        }
        return res;
      },
      testCases: {
        functional: [
          [[[1, 0, 0, 0], [1, 1, 1, 0]], [[1, 0]]],
          [[[1, 0, 0, 0], [1, 1, 0, 0]], [[1, 1], [1, 0]]],
          [[[1]], [[0, 0]]],
          [[[0]], [[0, 0]]]
        ],
        boundary: [
          [[[1, 1, 1], [0, 1, 0]], [[0, 1]]],
          [[[1, 1, 1], [1, 1, 1]], [[0, 0], [0, 1]]],
          [[[1, 0], [1, 0], [1, 0]], [[1, 0]]],
          [[[1, 1], [1, 1]], [[1, 1]]]
        ],
        adversarial: [
          [[[1, 1, 1, 1], [0, 0, 1, 0], [0, 0, 1, 0]], [[0, 2]]],
          [[[1, 0, 1], [1, 1, 1], [0, 1, 0]], [[0, 0], [0, 2]]]
        ],
        stress: [
          [Array.from({ length: 15 }, () => Array.from({ length: 15 }, () => 1)), [[0, 5], [0, 6], [0, 7]]],
          [Array.from({ length: 20 }, (_, r) => Array.from({ length: 20 }, (_, c) => (r === 0 || c === 10 ? 1 : 0))), [[0, 10]]]
        ]
      }
    }),

    // 339. Sentence Similarity II
    createProblem({
      num: 339,
      title: "Sentence Similarity II",
      slug: "sentence-similarity-ii",
      level: 15,
      difficulty: "MEDIUM",
      topic: "Union Find",
      patternSlug: "topological-sort-union-find",
      estimatedTimeMin: 15,
      statement: "We can represent a sentence as an array of strings, for example, the sentence `\"I am happy with leetcode\"` can be represented as `sentence1 = [\"I\",\"am\",\"happy\",\"with\",\"leetcode\"]`.\n\nGiven two sentences `sentence1` and `sentence2` each represented as a string array and given an array of string pairs `similarPairs` where `similarPairs[i] = [xi, yi]` indicates that the two words `xi` and `yi` are similar.\n\nReturn `true` if `sentence1` and `sentence2` are similar, or `false` if they are not.\n\nTwo sentences are similar if:\n- They have the same length (i.e., the same number of words)\n- `sentence1[i]` and `sentence2[i]` are similar.\n\nNotice that similarity is transitive: if `a` and `b` are similar, and `b` and `c` are similar, then `a` and `c` are similar.",
      functionName: "areSentencesSimilarTwo",
      parameters: [
        { name: "sentence1", type: "string[]", description: "First sentence word array" },
        { name: "sentence2", type: "string[]", description: "Second sentence word array" },
        { name: "similarPairs", type: "string[][]", description: "Pairs of similar words" }
      ],
      returnType: "boolean",
      constraints: ["1 <= sentence1.length, sentence2.length <= 1000", "1 <= sentence1[i].length, sentence2[i].length <= 20", "sentence1[i] and sentence2[i] consist of lower-case and upper-case English letters.", "0 <= similarPairs.length <= 2000", "similarPairs[i].length == 2", "1 <= xi.length, yi.length <= 20", "xi and yi consist of lower-case and upper-case English letters."],
      examples: [
        { input: "sentence1 = [\"great\",\"acting\",\"skills\"], sentence2 = [\"fine\",\"drama\",\"talent\"], similarPairs = [[\"great\",\"good\"],[\"fine\",\"good\"],[\"acting\",\"drama\"],[\"skills\",\"talent\"]]", output: "true", explanation: "\"great\" is similar to \"fine\" through \"good\"." },
        { input: "sentence1 = [\"I\",\"love\",\"leetcode\"], sentence2 = [\"I\",\"love\",\"onepiece\"], similarPairs = [[\"manga\",\"hunterXhunter\"],[\"platform\",\"anime\"],[\"leetcode\",\"platform\"],[\"anime\",\"manga\"]]", output: "false", explanation: "\"leetcode\" and \"onepiece\" are not similar." },
        { input: "sentence1 = [\"a\"], sentence2 = [\"a\"], similarPairs = []", output: "true", explanation: "Identical single words are similar." },
        { input: "sentence1 = [\"a\",\"b\"], sentence2 = [\"a\"], similarPairs = []", output: "false", explanation: "Different lengths cannot be similar." }
      ],
      optimalSolution: `function areSentencesSimilarTwo(sentence1, sentence2, similarPairs) {\n  if (sentence1.length !== sentence2.length) return false;\n  const parent = new Map();\n  function find(x) {\n    if (!parent.has(x)) parent.set(x, x);\n    if (parent.get(x) !== x) parent.set(x, find(parent.get(x)));\n    return parent.get(x);\n  }\n  function union(x, y) {\n    parent.set(find(x), find(y));\n  }\n  for (const [u, v] of similarPairs) {\n    union(u, v);\n  }\n  for (let i = 0; i < sentence1.length; i++) {\n    const w1 = sentence1[i], w2 = sentence2[i];\n    if (w1 === w2) continue;\n    if (find(w1) !== find(w2)) return false;\n  }\n  return true;\n}`,
      optimalTimeComplexity: "O(P * alpha(N) + S * alpha(N))",
      optimalSpaceComplexity: "O(P)",
      suboptimalSolution: `function areSentencesSimilarTwo(sentence1, sentence2, similarPairs) {\n  if (sentence1.length !== sentence2.length) return false;\n  const adj = new Map();\n  for (const [u, v] of similarPairs) {\n    if (!adj.has(u)) adj.set(u, []);\n    if (!adj.has(v)) adj.set(v, []);\n    adj.get(u).push(v);\n    adj.get(v).push(u);\n  }\n  function areSimilar(w1, w2) {\n    if (w1 === w2) return true;\n    if (!adj.has(w1) || !adj.has(w2)) return false;\n    const visited = new Set([w1]);\n    const q = [w1];\n    while (q.length > 0) {\n      const curr = q.shift();\n      if (curr === w2) return true;\n      for (const next of adj.get(curr)) {\n        if (!visited.has(next)) { visited.add(next); q.push(next); }\n      }\n    }\n    return false;\n  }\n  for (let i = 0; i < sentence1.length; i++) {\n    if (!areSimilar(sentence1[i], sentence2[i])) return false;\n  }\n  return true;\n}`,
      suboptimalTimeComplexity: "O(S * (V + E))",
      suboptimalSpaceComplexity: "O(V + E)",
      commonMistakes: ["Failing to handle identical words that do not appear in `similarPairs`.", "Not checking sentence lengths upfront."],
      hints: [
        "First check if `sentence1.length !== sentence2.length`, return false if not equal.",
        "Build a Disjoint Set Union (DSU) where each similar pair [u, v] is unioned.",
        "For each position i, if sentence1[i] === sentence2[i] or find(sentence1[i]) === find(sentence2[i]), it's valid."
      ],
      oracleFn: (sentence1: string[], sentence2: string[], similarPairs: string[][]) => {
        if (sentence1.length !== sentence2.length) return false;
        const parent = new Map<string, string>();
        function find(x: string): string {
          if (!parent.has(x)) parent.set(x, x);
          if (parent.get(x) !== x) parent.set(x, find(parent.get(x)!));
          return parent.get(x)!;
        }
        function union(x: string, y: string) {
          parent.set(find(x), find(y));
        }
        for (const [u, v] of similarPairs) {
          union(u, v);
        }
        for (let i = 0; i < sentence1.length; i++) {
          const w1 = sentence1[i], w2 = sentence2[i];
          if (w1 === w2) continue;
          if (find(w1) !== find(w2)) return false;
        }
        return true;
      },
      testCases: {
        functional: [
          [["great", "acting", "skills"], ["fine", "drama", "talent"], [["great", "good"], ["fine", "good"], ["acting", "drama"], ["skills", "talent"]]],
          [["I", "love", "leetcode"], ["I", "love", "onepiece"], [["manga", "hunterXhunter"], ["platform", "anime"], ["leetcode", "platform"], ["anime", "manga"]]],
          [["a"], ["a"], []],
          [["a", "b"], ["a"], []]
        ],
        boundary: [
          [["w1"], ["w2"], [["w1", "w2"]]],
          [["w1"], ["w2"], []],
          [["a", "b", "c"], ["a", "b", "c"], []],
          [["x", "y"], ["y", "z"], [["x", "y"], ["y", "z"]]]
        ],
        adversarial: [
          [["a", "b", "c"], ["c", "b", "a"], [["a", "b"], ["b", "c"]]],
          [["food", "is", "good"], ["meal", "is", "fine"], [["food", "meal"], ["good", "fine"]]]
        ],
        stress: [
          [Array.from({ length: 30 }, (_, i) => `word${i}`), Array.from({ length: 30 }, (_, i) => `word${i}`), []],
          [Array.from({ length: 30 }, (_, i) => `a${i}`), Array.from({ length: 30 }, (_, i) => `b${i}`), Array.from({ length: 30 }, (_, i) => [`a${i}`, `b${i}`])]
        ]
      }
    }),

    // 340. Lexicographically Smallest Equivalent String
    createProblem({
      num: 340,
      title: "Lexicographically Smallest Equivalent String",
      slug: "lexicographically-smallest-equivalent-string",
      level: 15,
      difficulty: "MEDIUM",
      topic: "Union Find",
      patternSlug: "topological-sort-union-find",
      estimatedTimeMin: 15,
      statement: "You are given two strings of the same length `s1` and `s2` and a string `baseStr`.\n\nWe say `s1[i]` and `s2[i]` are equivalent characters. Equivalence is an equivalence relation (reflexive, symmetric, and transitive).\n\nReturn the lexicographically smallest equivalent string of `baseStr` by using the equivalency information from `s1` and `s2`.",
      functionName: "smallestEquivalentString",
      parameters: [
        { name: "s1", type: "string", description: "First equivalence string" },
        { name: "s2", type: "string", description: "Second equivalence string" },
        { name: "baseStr", type: "string", description: "Target string to convert" }
      ],
      returnType: "string",
      constraints: ["1 <= s1.length, s2.length, baseStr.length <= 1000", "s1.length == s2.length", "s1, s2, and baseStr consist of 'a'-'z'."],
      examples: [
        { input: "s1 = \"parker\", s2 = \"morris\", baseStr = \"parser\"", output: "\"makkek\"", explanation: "'p'='m', 'a'='o', 'r'='r', 'k'='r'='m', 'e'='i', 'r'='s'. Smallest equivalent for 'p' is 'm', 'a' is 'a' (or 'a' if 'a' < 'o'), 'r' is 'k' (or 'k' < 'm'/'r'/'s'), giving \"makkek\"." },
        { input: "s1 = \"hello\", s2 = \"world\", baseStr = \"hold\"", output: "\"hdld\"", explanation: "Equivalences: h=w, e=o, l=r, l=l, o=d. Output is \"hdld\"." },
        { input: "s1 = \"leetcode\", s2 = \"programs\", baseStr = \"sourcecode\"", output: "\"aauaaaaada\"", explanation: "All characters mapped to their smallest equivalent character in each group." },
        { input: "s1 = \"a\", s2 = \"b\", baseStr = \"b\"", output: "\"a\"", explanation: "'b' maps to 'a'." }
      ],
      optimalSolution: `function smallestEquivalentString(s1, s2, baseStr) {\n  const parent = Array.from({ length: 26 }, (_, i) => i);\n  function find(x) {\n    if (parent[x] !== x) parent[x] = find(parent[x]);\n    return parent[x];\n  }\n  function union(x, y) {\n    const rx = find(x), ry = find(y);\n    if (rx !== ry) {\n      if (rx < ry) parent[ry] = rx;\n      else parent[rx] = ry;\n    }\n  }\n  for (let i = 0; i < s1.length; i++) {\n    union(s1.charCodeAt(i) - 97, s2.charCodeAt(i) - 97);\n  }\n  let res = "";\n  for (let i = 0; i < baseStr.length; i++) {\n    const root = find(baseStr.charCodeAt(i) - 97);\n    res += String.fromCharCode(root + 97);\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O((N + M) * alpha(26))",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function smallestEquivalentString(s1, s2, baseStr) {\n  const adj = Array.from({ length: 26 }, () => []);\n  for (let i = 0; i < s1.length; i++) {\n    const u = s1.charCodeAt(i) - 97, v = s2.charCodeAt(i) - 97;\n    adj[u].push(v); adj[v].push(u);\n  }\n  function getMin(start) {\n    let minChar = start;\n    const visited = new Set([start]);\n    const q = [start];\n    while (q.length > 0) {\n      const curr = q.shift();\n      if (curr < minChar) minChar = curr;\n      for (const next of adj[curr]) {\n        if (!visited.has(next)) { visited.add(next); q.push(next); }\n      }\n    }\n    return minChar;\n  }\n  let res = "";\n  for (let i = 0; i < baseStr.length; i++) {\n    res += String.fromCharCode(getMin(baseStr.charCodeAt(i) - 97) + 97);\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(M * 26)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["When unioning two roots `rx` and `ry`, choosing the parent arbitrarily instead of strictly setting `parent[max(rx, ry)] = min(rx, ry)`."],
      hints: [
        "In Union-Find, maintain the invariant that the root of any component is always the lexicographically SMALLEST character in that component.",
        "When unioning rx and ry, if rx < ry, set parent[ry] = rx; otherwise parent[rx] = ry.",
        "For each character c in baseStr, replace with String.fromCharCode(find(c - 97) + 97)."
      ],
      oracleFn: (s1: string, s2: string, baseStr: string) => {
        const parent = Array.from({ length: 26 }, (_, i) => i);
        function find(x: number): number {
          if (parent[x] !== x) parent[x] = find(parent[x]);
          return parent[x];
        }
        function union(x: number, y: number) {
          const rx = find(x), ry = find(y);
          if (rx !== ry) {
            if (rx < ry) parent[ry] = rx;
            else parent[rx] = ry;
          }
        }
        for (let i = 0; i < s1.length; i++) {
          union(s1.charCodeAt(i) - 97, s2.charCodeAt(i) - 97);
        }
        let res = "";
        for (let i = 0; i < baseStr.length; i++) {
          const root = find(baseStr.charCodeAt(i) - 97);
          res += String.fromCharCode(root + 97);
        }
        return res;
      },
      testCases: {
        functional: [
          ["parker", "morris", "parser"],
          ["hello", "world", "hold"],
          ["leetcode", "programs", "sourcecode"],
          ["a", "b", "b"]
        ],
        boundary: [
          ["z", "y", "z"],
          ["a", "a", "a"],
          ["ab", "ba", "ab"],
          ["abc", "bcd", "cde"]
        ],
        adversarial: [
          ["cba", "fed", "fedcba"],
          ["xyz", "abc", "zyx"]
        ],
        stress: [
          [Array.from({ length: 25 }, (_, i) => String.fromCharCode(98 + i)).join(""), Array.from({ length: 25 }, (_, i) => String.fromCharCode(97 + i)).join(""), "zyxwvutsrqponmlkjihgfedcba"],
          ["abcdefghijklmnopqrstuvwxyz", "bcdefghijklmnopqrstuvwxyza", "antigravity"]
        ]
      }
    })
  ];

  return {
    level: 15,
    levelTitle: "Level 15 — Topological Sort & Union Find",
    topic: "Topological Sort, Kahn's Algorithm, Disjoint Set Union (DSU), and Minimum Spanning Trees",
    problems
  };
}
