import { LevelPayload, GeneratedProblem } from './types';
import { createProblem } from './problemBuilder';

export function getLevel14Payload(): LevelPayload {
  const problems: GeneratedProblem[] = [
    // 305. Clone Graph
    createProblem({
      num: 305,
      title: "Clone Graph",
      slug: "clone-graph",
      level: 14,
      difficulty: "MEDIUM",
      topic: "Graph / BFS / DFS",
      patternSlug: "graph-bfs-dfs",
      estimatedTimeMin: 20,
      statement: "Given an undirected connected graph represented as an adjacency list `adjList`, where `adjList[i]` contains a list of 1-based node indices representing the neighbors of node `i + 1`, return a deep copy (clone) of the graph's adjacency list.\n\nYour cloning algorithm must traverse and copy the entire graph structure using DFS or BFS.",
      functionName: "cloneGraph",
      parameters: [{ name: "adjList", type: "number[][]", description: "1-indexed adjacency list of the graph" }],
      returnType: "number[][]",
      constraints: ["The number of nodes in the graph is in the range [0, 100].", "1 <= Node.val <= 100", "Node.val is unique for each node.", "There are no repeated edges and no self-loops in the graph.", "The Graph is connected and all nodes can be visited starting from the first node."],
      examples: [
        { input: "adjList = [[2,4],[1,3],[2,4],[1,3]]", output: "[[2,4],[1,3],[2,4],[1,3]]", explanation: "4-node cycle graph cloned." },
        { input: "adjList = [[]]", output: "[[]]", explanation: "Single node with no neighbors." },
        { input: "adjList = []", output: "[]", explanation: "Empty graph." },
        { input: "adjList = [[2],[1]]", output: "[[2],[1]]", explanation: "2 nodes connected by one undirected edge." }
      ],
      optimalSolution: `function cloneGraph(adjList) {\n  if (!adjList || adjList.length === 0) return [];\n  const n = adjList.length;\n  const cloned = Array.from({ length: n }, () => []);\n  const visited = new Set();\n  function dfs(nodeIdx) {\n    visited.add(nodeIdx);\n    for (const neighbor of adjList[nodeIdx]) {\n      cloned[nodeIdx].push(neighbor);\n      const nextIdx = neighbor - 1;\n      if (!visited.has(nextIdx)) {\n        dfs(nextIdx);\n      }\n    }\n  }\n  dfs(0);\n  return cloned;\n}`,
      optimalTimeComplexity: "O(V + E)",
      optimalSpaceComplexity: "O(V + E)",
      suboptimalSolution: `function cloneGraph(adjList) {\n  if (!adjList || adjList.length === 0) return [];\n  const cloned = [];\n  for (let i = 0; i < adjList.length; i++) {\n    cloned.push([...adjList[i]]);\n  }\n  return cloned;\n}`,
      suboptimalTimeComplexity: "O(V + E)",
      suboptimalSpaceComplexity: "O(V + E)",
      commonMistakes: ["Failing to handle empty graph `[]` or single node `[[]]` correctly.", "Infinite recursion in DFS when missing the visited set on cycles."],
      hints: [
        "Traverse each node starting from node index 0 using a visited set to avoid cycles.",
        "Deep copy neighbor lists for each visited node into the cloned adjacency list.",
        "Ensure 1-based indexing for neighbor values matches the original structure."
      ],
      oracleFn: (adjList: number[][]) => {
        if (!adjList || adjList.length === 0) return [];
        const n = adjList.length;
        const cloned: number[][] = Array.from({ length: n }, () => []);
        const visited = new Set<number>();
        function dfs(nodeIdx: number) {
          visited.add(nodeIdx);
          for (const neighbor of adjList[nodeIdx]) {
            cloned[nodeIdx].push(neighbor);
            const nextIdx = neighbor - 1;
            if (!visited.has(nextIdx)) {
              dfs(nextIdx);
            }
          }
        }
        dfs(0);
        return cloned;
      },
      testCases: {
        functional: [
          [[[2, 4], [1, 3], [2, 4], [1, 3]]],
          [[[]]],
          [[]],
          [[[2], [1]]]
        ],
        boundary: [
          [[[2, 3], [1, 3], [1, 2]]],
          [[[2], [1, 3], [2, 4], [3]]],
          [[[2, 3, 4], [1], [1], [1]]],
          [[[2], [1, 3], [2]]]
        ],
        adversarial: [
          [[[2, 5], [1, 3], [2, 4], [3, 5], [1, 4]]],
          [[[2], [1, 3], [2, 4], [3, 5], [4]]]
        ],
        stress: [
          [Array.from({ length: 20 }, (_, i) => [(i === 0 ? 20 : i), (i === 19 ? 1 : i + 2)])],
          [Array.from({ length: 30 }, (_, i) => i === 0 ? Array.from({ length: 29 }, (_, k) => k + 2) : [1])]
        ]
      }
    }),

    // 306. Course Schedule
    createProblem({
      num: 306,
      title: "Course Schedule",
      slug: "course-schedule",
      level: 14,
      difficulty: "MEDIUM",
      topic: "Graph / Topological Sort",
      patternSlug: "graph-bfs-dfs",
      estimatedTimeMin: 20,
      statement: "There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you must take course `bi` first if you want to take course `ai`.\n\nReturn `true` if you can finish all courses. Otherwise, return `false` (i.e. if there is a cycle).",
      functionName: "canFinish",
      parameters: [
        { name: "numCourses", type: "number", description: "Number of courses" },
        { name: "prerequisites", type: "number[][]", description: "Prerequisite pairs [ai, bi]" }
      ],
      returnType: "boolean",
      constraints: ["1 <= numCourses <= 2000", "0 <= prerequisites.length <= 5000", "prerequisites[i].length == 2", "0 <= ai, bi < numCourses", "All the pairs prerequisites[i] are unique."],
      examples: [
        { input: "numCourses = 2, prerequisites = [[1,0]]", output: "true", explanation: "Take course 0 then take course 1." },
        { input: "numCourses = 2, prerequisites = [[1,0],[0,1]]", output: "false", explanation: "Circular dependency between 0 and 1." },
        { input: "numCourses = 1, prerequisites = []", output: "true", explanation: "No prerequisites required." },
        { input: "numCourses = 3, prerequisites = [[0,1],[1,2],[2,0]]", output: "false", explanation: "3-course cycle prevents completion." }
      ],
      optimalSolution: `function canFinish(numCourses, prerequisites) {\n  const inDegree = new Array(numCourses).fill(0);\n  const adj = Array.from({ length: numCourses }, () => []);\n  for (const [course, pre] of prerequisites) {\n    adj[pre].push(course);\n    inDegree[course]++;\n  }\n  const queue = [];\n  for (let i = 0; i < numCourses; i++) {\n    if (inDegree[i] === 0) queue.push(i);\n  }\n  let taken = 0;\n  while (queue.length > 0) {\n    const curr = queue.shift();\n    taken++;\n    for (const next of adj[curr]) {\n      inDegree[next]--;\n      if (inDegree[next] === 0) queue.push(next);\n    }\n  }\n  return taken === numCourses;\n}`,
      optimalTimeComplexity: "O(V + E)",
      optimalSpaceComplexity: "O(V + E)",
      suboptimalSolution: `function canFinish(numCourses, prerequisites) {\n  const adj = Array.from({ length: numCourses }, () => []);\n  for (const [course, pre] of prerequisites) {\n    adj[pre].push(course);\n  }\n  // 0: unvisited, 1: visiting, 2: visited\n  const state = new Array(numCourses).fill(0);\n  function hasCycle(node) {\n    state[node] = 1;\n    for (const next of adj[node]) {\n      if (state[next] === 1) return true;\n      if (state[next] === 0 && hasCycle(next)) return true;\n    }\n    state[node] = 2;\n    return false;\n  }\n  for (let i = 0; i < numCourses; i++) {\n    if (state[i] === 0 && hasCycle(i)) return false;\n  }\n  return true;\n}`,
      suboptimalTimeComplexity: "O(V + E)",
      suboptimalSpaceComplexity: "O(V + E)",
      commonMistakes: ["Reversing edge directions (prereq -> course vs course -> prereq).", "Failing to distinguish between nodes currently on the recursion stack vs previously completed nodes in DFS."],
      hints: [
        "This is equivalent to detecting a directed cycle in a graph (DAG check).",
        "Kahn's Algorithm (BFS): calculate in-degrees, push in-degree 0 into queue.",
        "Decrement neighbor in-degrees as you pop; if total popped == numCourses, true."
      ],
      oracleFn: (numCourses: number, prerequisites: number[][]) => {
        const inDegree = new Array(numCourses).fill(0);
        const adj: number[][] = Array.from({ length: numCourses }, () => []);
        for (const [course, pre] of prerequisites) {
          adj[pre].push(course);
          inDegree[course]++;
        }
        const queue: number[] = [];
        for (let i = 0; i < numCourses; i++) {
          if (inDegree[i] === 0) queue.push(i);
        }
        let taken = 0;
        while (queue.length > 0) {
          const curr = queue.shift()!;
          taken++;
          for (const next of adj[curr]) {
            inDegree[next]--;
            if (inDegree[next] === 0) queue.push(next);
          }
        }
        return taken === numCourses;
      },
      testCases: {
        functional: [
          [2, [[1, 0]]],
          [2, [[1, 0], [0, 1]]],
          [1, []],
          [3, [[0, 1], [1, 2], [2, 0]]]
        ],
        boundary: [
          [4, [[1, 0], [2, 0], [3, 1], [3, 2]]],
          [3, [[1, 0], [2, 1]]],
          [5, []],
          [2, [[0, 1]]]
        ],
        adversarial: [
          [4, [[1, 0], [2, 1], [3, 2], [1, 3]]],
          [5, [[1, 0], [2, 0], [3, 1], [3, 2], [4, 3], [0, 4]]]
        ],
        stress: [
          [100, Array.from({ length: 99 }, (_, i) => [i + 1, i])],
          [100, [...Array.from({ length: 99 }, (_, i) => [i + 1, i]), [0, 99]]]
        ]
      }
    }),

    // 307. Course Schedule II
    createProblem({
      num: 307,
      title: "Course Schedule II",
      slug: "course-schedule-ii",
      level: 14,
      difficulty: "MEDIUM",
      topic: "Graph / Topological Sort",
      patternSlug: "graph-bfs-dfs",
      estimatedTimeMin: 20,
      statement: "There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you must take course `bi` first if you want to take course `ai`.\n\nReturn the ordering of courses you should take to finish all courses (using standard BFS Kahn's algorithm ordering). If it is impossible to finish all courses, return an empty array `[]`.",
      functionName: "findOrder",
      parameters: [
        { name: "numCourses", type: "number", description: "Number of courses" },
        { name: "prerequisites", type: "number[][]", description: "Prerequisites list [ai, bi]" }
      ],
      returnType: "number[]",
      constraints: ["1 <= numCourses <= 2000", "0 <= prerequisites.length <= numCourses * (numCourses - 1)", "prerequisites[i].length == 2", "0 <= ai, bi < numCourses", "ai != bi", "All the pairs [ai, bi] are distinct."],
      examples: [
        { input: "numCourses = 2, prerequisites = [[1,0]]", output: "[0,1]", explanation: "Course 0 must precede course 1." },
        { input: "numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]", output: "[0,1,2,3]", explanation: "0 first, then 1 and 2, finally 3." },
        { input: "numCourses = 1, prerequisites = []", output: "[0]", explanation: "Single course with no prereqs." },
        { input: "numCourses = 2, prerequisites = [[1,0],[0,1]]", output: "[]", explanation: "Cycle detected, impossible to complete." }
      ],
      optimalSolution: `function findOrder(numCourses, prerequisites) {\n  const inDegree = new Array(numCourses).fill(0);\n  const adj = Array.from({ length: numCourses }, () => []);\n  for (const [course, pre] of prerequisites) {\n    adj[pre].push(course);\n    inDegree[course]++;\n  }\n  for (let i = 0; i < numCourses; i++) adj[i].sort((a, b) => a - b);\n  const queue = [];\n  for (let i = 0; i < numCourses; i++) {\n    if (inDegree[i] === 0) queue.push(i);\n  }\n  const order = [];\n  while (queue.length > 0) {\n    const curr = queue.shift();\n    order.push(curr);\n    for (const next of adj[curr]) {\n      inDegree[next]--;\n      if (inDegree[next] === 0) queue.push(next);\n    }\n  }\n  return order.length === numCourses ? order : [];\n}`,
      optimalTimeComplexity: "O(V + E)",
      optimalSpaceComplexity: "O(V + E)",
      suboptimalSolution: `function findOrder(numCourses, prerequisites) {\n  const adj = Array.from({ length: numCourses }, () => []);\n  for (const [course, pre] of prerequisites) {\n    adj[pre].push(course);\n  }\n  const inDegree = new Array(numCourses).fill(0);\n  for (const [c] of prerequisites) inDegree[c]++;\n  const q = [];\n  for (let i = 0; i < numCourses; i++) if (inDegree[i] === 0) q.push(i);\n  const res = [];\n  while (q.length > 0) {\n    const u = q.shift();\n    res.push(u);\n    for (const v of adj[u]) {\n      if (--inDegree[v] === 0) q.push(v);\n    }\n  }\n  return res.length === numCourses ? res : [];\n}`,
      suboptimalTimeComplexity: "O(V + E)",
      suboptimalSpaceComplexity: "O(V + E)",
      commonMistakes: ["Returning a partial order when a cycle exists instead of returning empty array `[]`.", "Not handling isolated courses with inDegree = 0."],
      hints: [
        "Construct an adjacency list and in-degree array.",
        "Add all courses with in-degree 0 to the queue.",
        "Maintain an `order` array. As each course is popped, append it to `order`.",
        "If `order.length !== numCourses`, return `[]`."
      ],
      oracleFn: (numCourses: number, prerequisites: number[][]) => {
        const inDegree = new Array(numCourses).fill(0);
        const adj: number[][] = Array.from({ length: numCourses }, () => []);
        for (const [course, pre] of prerequisites) {
          adj[pre].push(course);
          inDegree[course]++;
        }
        for (let i = 0; i < numCourses; i++) adj[i].sort((a, b) => a - b);
        const queue: number[] = [];
        for (let i = 0; i < numCourses; i++) {
          if (inDegree[i] === 0) queue.push(i);
        }
        const order: number[] = [];
        while (queue.length > 0) {
          const curr = queue.shift()!;
          order.push(curr);
          for (const next of adj[curr]) {
            inDegree[next]--;
            if (inDegree[next] === 0) queue.push(next);
          }
        }
        return order.length === numCourses ? order : [];
      },
      testCases: {
        functional: [
          [2, [[1, 0]]],
          [4, [[1, 0], [2, 0], [3, 1], [3, 2]]],
          [1, []],
          [2, [[1, 0], [0, 1]]]
        ],
        boundary: [
          [3, [[1, 0], [2, 1]]],
          [3, []],
          [3, [[0, 1], [0, 2]]],
          [4, [[3, 0], [3, 1], [3, 2]]]
        ],
        adversarial: [
          [4, [[1, 0], [2, 1], [3, 2], [0, 3]]],
          [5, [[1, 0], [2, 1], [3, 2], [4, 3], [2, 4]]]
        ],
        stress: [
          [50, Array.from({ length: 49 }, (_, i) => [i + 1, i])],
          [50, [...Array.from({ length: 49 }, (_, i) => [i + 1, i]), [0, 49]]]
        ]
      }
    }),

    // 308. Graph Valid Tree
    createProblem({
      num: 308,
      title: "Graph Valid Tree",
      slug: "graph-valid-tree",
      level: 14,
      difficulty: "MEDIUM",
      topic: "Graph / Union Find / BFS",
      patternSlug: "graph-bfs-dfs",
      estimatedTimeMin: 20,
      statement: "You have a graph of `n` nodes labeled from `0` to `n - 1`. You are given an integer `n` and a list of `edges` where `edges[i] = [ai, bi]` indicates that there is an undirected edge between nodes `ai` and `bi` in the graph.\n\nReturn `true` if the edges of the given graph make up a valid tree, and `false` otherwise.",
      functionName: "validTree",
      parameters: [
        { name: "n", type: "number", description: "Number of nodes" },
        { name: "edges", type: "number[][]", description: "Undirected edges list" }
      ],
      returnType: "boolean",
      constraints: ["1 <= n <= 2000", "0 <= edges.length <= 5000", "edges[i].length == 2", "0 <= ai, bi < n", "ai != bi", "There are no self-loops or repeated edges."],
      examples: [
        { input: "n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]", output: "true", explanation: "Fully connected with no cycles and exactly 4 edges for 5 nodes." },
        { input: "n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]", output: "false", explanation: "Cycle exists between nodes 1, 2, and 3." },
        { input: "n = 1, edges = []", output: "true", explanation: "Single isolated node is a valid tree." },
        { input: "n = 4, edges = [[0,1],[2,3]]", output: "false", explanation: "Disconnected graph (forest, not tree)." }
      ],
      optimalSolution: `function validTree(n, edges) {\n  if (edges.length !== n - 1) return false;\n  const parent = Array.from({ length: n }, (_, i) => i);\n  function find(x) {\n    if (parent[x] !== x) parent[x] = find(parent[x]);\n    return parent[x];\n  }\n  for (const [u, v] of edges) {\n    const rootU = find(u), rootV = find(v);\n    if (rootU === rootV) return false;\n    parent[rootU] = rootV;\n  }\n  return true;\n}`,
      optimalTimeComplexity: "O(n * alpha(n))",
      optimalSpaceComplexity: "O(n)",
      suboptimalSolution: `function validTree(n, edges) {\n  if (edges.length !== n - 1) return false;\n  const adj = Array.from({ length: n }, () => []);\n  for (const [u, v] of edges) {\n    adj[u].push(v);\n    adj[v].push(u);\n  }\n  const visited = new Set();\n  const q = [0];\n  visited.add(0);\n  while (q.length > 0) {\n    const curr = q.shift();\n    for (const next of adj[curr]) {\n      if (!visited.has(next)) {\n        visited.add(next);\n        q.push(next);\n      }\n    }\n  }\n  return visited.size === n;\n}`,
      suboptimalTimeComplexity: "O(V + E)",
      suboptimalSpaceComplexity: "O(V + E)",
      commonMistakes: ["Checking only cycle detection without checking connectivity.", "Missing the essential mathematical property: a tree of n nodes MUST have exactly n - 1 edges."],
      hints: [
        "A valid tree with n nodes must have exactly n - 1 edges.",
        "If edges.length !== n - 1, immediately return false.",
        "Check that all n nodes belong to a single connected component using Union-Find or BFS."
      ],
      oracleFn: (n: number, edges: number[][]) => {
        if (edges.length !== n - 1) return false;
        const parent = Array.from({ length: n }, (_, i) => i);
        function find(x: number): number {
          if (parent[x] !== x) parent[x] = find(parent[x]);
          return parent[x];
        }
        for (const [u, v] of edges) {
          const rootU = find(u), rootV = find(v);
          if (rootU === rootV) return false;
          parent[rootU] = rootV;
        }
        return true;
      },
      testCases: {
        functional: [
          [5, [[0, 1], [0, 2], [0, 3], [1, 4]]],
          [5, [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]]],
          [1, []],
          [4, [[0, 1], [2, 3]]]
        ],
        boundary: [
          [2, [[0, 1]]],
          [2, []],
          [3, [[0, 1], [1, 2], [2, 0]]],
          [3, [[0, 1]]]
        ],
        adversarial: [
          [6, [[0, 1], [1, 2], [2, 0], [3, 4], [4, 5]]],
          [4, [[0, 1], [1, 2], [2, 3]]]
        ],
        stress: [
          [100, Array.from({ length: 99 }, (_, i) => [i, i + 1])],
          [100, Array.from({ length: 98 }, (_, i) => [i, i + 1])]
        ]
      }
    }),

    // 309. Number of Connected Components in an Undirected Graph
    createProblem({
      num: 309,
      title: "Number of Connected Components in an Undirected Graph",
      slug: "number-of-connected-components-in-an-undirected-graph",
      level: 14,
      difficulty: "MEDIUM",
      topic: "Graph / Union Find / BFS",
      patternSlug: "graph-bfs-dfs",
      estimatedTimeMin: 15,
      statement: "You have a graph of `n` nodes. You are given an integer `n` and an array `edges` where `edges[i] = [ai, bi]` indicates that there is an edge between `ai` and `bi` in the graph.\n\nReturn the number of connected components in the graph.",
      functionName: "countComponents",
      parameters: [
        { name: "n", type: "number", description: "Total number of nodes" },
        { name: "edges", type: "number[][]", description: "Array of undirected edges" }
      ],
      returnType: "number",
      constraints: ["1 <= n <= 2000", "0 <= edges.length <= 5000", "edges[i].length == 2", "0 <= ai <= bi < n", "ai != bi", "There are no repeated edges."],
      examples: [
        { input: "n = 5, edges = [[0,1],[1,2],[3,4]]", output: "2", explanation: "Components: {0,1,2} and {3,4}." },
        { input: "n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]", output: "1", explanation: "Single line component connecting all 5 nodes." },
        { input: "n = 3, edges = []", output: "3", explanation: "3 isolated nodes." },
        { input: "n = 4, edges = [[0,1],[2,3]]", output: "2", explanation: "Two separate edges." }
      ],
      optimalSolution: `function countComponents(n, edges) {\n  const parent = Array.from({ length: n }, (_, i) => i);\n  let components = n;\n  function find(x) {\n    if (parent[x] !== x) parent[x] = find(parent[x]);\n    return parent[x];\n  }\n  for (const [u, v] of edges) {\n    const rootU = find(u), rootV = find(v);\n    if (rootU !== rootV) {\n      parent[rootU] = rootV;\n      components--;\n    }\n  }\n  return components;\n}`,
      optimalTimeComplexity: "O(n + E * alpha(n))",
      optimalSpaceComplexity: "O(n)",
      suboptimalSolution: `function countComponents(n, edges) {\n  const adj = Array.from({ length: n }, () => []);\n  for (const [u, v] of edges) {\n    adj[u].push(v);\n    adj[v].push(u);\n  }\n  const visited = new Set();\n  let count = 0;\n  for (let i = 0; i < n; i++) {\n    if (!visited.has(i)) {\n      count++;\n      const q = [i];\n      visited.add(i);\n      while (q.length > 0) {\n        const curr = q.shift();\n        for (const next of adj[curr]) {\n          if (!visited.has(next)) {\n            visited.add(next);\n            q.push(next);\n          }\n        }\n      }\n    }\n  }\n  return count;\n}`,
      suboptimalTimeComplexity: "O(V + E)",
      suboptimalSpaceComplexity: "O(V + E)",
      commonMistakes: ["Forgetting to initialize components count to n.", "Not checking for isolated nodes without edges."],
      hints: [
        "Initialize components = n.",
        "For each edge [u, v], find their roots using Union-Find.",
        "If root(u) !== root(v), union them and decrement components by 1."
      ],
      oracleFn: (n: number, edges: number[][]) => {
        const parent = Array.from({ length: n }, (_, i) => i);
        let components = n;
        function find(x: number): number {
          if (parent[x] !== x) parent[x] = find(parent[x]);
          return parent[x];
        }
        for (const [u, v] of edges) {
          const rootU = find(u), rootV = find(v);
          if (rootU !== rootV) {
            parent[rootU] = rootV;
            components--;
          }
        }
        return components;
      },
      testCases: {
        functional: [
          [5, [[0, 1], [1, 2], [3, 4]]],
          [5, [[0, 1], [1, 2], [2, 3], [3, 4]]],
          [3, []],
          [4, [[0, 1], [2, 3]]]
        ],
        boundary: [
          [1, []],
          [2, [[0, 1]]],
          [2, []],
          [4, [[0, 1], [1, 2], [2, 0]]]
        ],
        adversarial: [
          [6, [[0, 1], [0, 2], [1, 2], [3, 4], [4, 5], [3, 5]]],
          [5, [[0, 1], [0, 2], [0, 3], [0, 4]]]
        ],
        stress: [
          [100, Array.from({ length: 50 }, (_, i) => [i * 2, i * 2 + 1])],
          [100, Array.from({ length: 99 }, (_, i) => [i, i + 1])]
        ]
      }
    }),

    // 310. Redundant Connection
    createProblem({
      num: 310,
      title: "Redundant Connection",
      slug: "redundant-connection",
      level: 14,
      difficulty: "MEDIUM",
      topic: "Graph / Union Find",
      patternSlug: "graph-bfs-dfs",
      estimatedTimeMin: 20,
      statement: "In this problem, a tree is an undirected graph that is connected and has no cycles.\n\nYou are given a graph that started as a tree with `n` nodes labeled from `1` to `n`, with one additional edge added. The added edge has two different vertices chosen from `1` to `n`, and was not an edge that already existed. The graph is represented as an array `edges` of length `n` where `edges[i] = [ai, bi]` indicates that there is an edge between nodes `ai` and `bi` in the graph.\n\nReturn an edge that can be removed so that the resulting graph is a tree of `n` nodes. If there are multiple answers, return the answer that occurs last in the input.",
      functionName: "findRedundantConnection",
      parameters: [{ name: "edges", type: "number[][]", description: "Array of edges" }],
      returnType: "number[]",
      constraints: ["n == edges.length", "3 <= n <= 1000", "edges[i].length == 2", "1 <= ai < bi <= edges.length", "ai != bi", "There are no repeated edges.", "The given graph is connected."],
      examples: [
        { input: "edges = [[1,2],[1,3],[2,3]]", output: "[2,3]", explanation: "[2,3] closes the cycle and is the last edge in the input." },
        { input: "edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]", output: "[1,4]", explanation: "[1,4] creates the cycle on vertices 1-2-3-4." },
        { input: "edges = [[1,2],[2,3],[1,3]]", output: "[1,3]", explanation: "Last edge closing cycle." },
        { input: "edges = [[1,3],[3,4],[1,4]]", output: "[1,4]", explanation: "Redundant edge." }
      ],
      optimalSolution: `function findRedundantConnection(edges) {\n  const n = edges.length;\n  const parent = Array.from({ length: n + 1 }, (_, i) => i);\n  function find(x) {\n    if (parent[x] !== x) parent[x] = find(parent[x]);\n    return parent[x];\n  }\n  for (const [u, v] of edges) {\n    const rootU = find(u), rootV = find(v);\n    if (rootU === rootV) return [u, v];\n    parent[rootU] = rootV;\n  }\n  return [];\n}`,
      optimalTimeComplexity: "O(n * alpha(n))",
      optimalSpaceComplexity: "O(n)",
      suboptimalSolution: `function findRedundantConnection(edges) {\n  const n = edges.length;\n  const adj = Array.from({ length: n + 1 }, () => []);\n  function hasPath(src, dest, visited) {\n    if (src === dest) return true;\n    visited.add(src);\n    for (const neighbor of adj[src]) {\n      if (!visited.has(neighbor) && hasPath(neighbor, dest, visited)) return true;\n    }\n    return false;\n  }\n  for (const [u, v] of edges) {\n    const visited = new Set();\n    if (adj[u].length > 0 && adj[v].length > 0 && hasPath(u, v, visited)) {\n      return [u, v];\n    }\n    adj[u].push(v);\n    adj[v].push(u);\n  }\n  return [];\n}`,
      suboptimalTimeComplexity: "O(n^2)",
      suboptimalSpaceComplexity: "O(n)",
      commonMistakes: ["Returning the first cycle edge encountered instead of the last edge in input order.", "1-based indexing off-by-one errors in parent array."],
      hints: [
        "Iterate through the edges one by one using Disjoint Set Union (DSU).",
        "If `find(u) === find(v)`, adding edge `[u, v]` creates a cycle and is the redundant edge.",
        "Otherwise, union the components `parent[find(u)] = find(v)`."
      ],
      oracleFn: (edges: number[][]) => {
        const n = edges.length;
        const parent = Array.from({ length: n + 1 }, (_, i) => i);
        function find(x: number): number {
          if (parent[x] !== x) parent[x] = find(parent[x]);
          return parent[x];
        }
        for (const [u, v] of edges) {
          const rootU = find(u), rootV = find(v);
          if (rootU === rootV) return [u, v];
          parent[rootU] = rootV;
        }
        return [];
      },
      testCases: {
        functional: [
          [[[1, 2], [1, 3], [2, 3]]],
          [[[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]],
          [[[1, 2], [2, 3], [1, 3]]],
          [[[1, 3], [3, 4], [1, 4]]]
        ],
        boundary: [
          [[[1, 2], [2, 3], [3, 1]]],
          [[[2, 3], [1, 2], [1, 3]]],
          [[[1, 2], [2, 3], [3, 4], [4, 5], [1, 5]]],
          [[[1, 4], [3, 4], [1, 3], [1, 2], [4, 5]]]
        ],
        adversarial: [
          [[[1, 2], [1, 3], [1, 4], [2, 3]]],
          [[[3, 4], [1, 2], [2, 4], [3, 5], [2, 5]]]
        ],
        stress: [
          [[...Array.from({ length: 49 }, (_, i) => [i + 1, i + 2]), [1, 50]]],
          [[...Array.from({ length: 60 }, (_, i) => [i + 1, i + 2]), [25, 55]]]
        ]
      }
    }),

    // 311. Keys and Rooms
    createProblem({
      num: 311,
      title: "Keys and Rooms",
      slug: "keys-and-rooms",
      level: 14,
      difficulty: "MEDIUM",
      topic: "Graph / BFS / DFS",
      patternSlug: "graph-bfs-dfs",
      estimatedTimeMin: 15,
      statement: "There are `n` rooms labeled from `0` to `n - 1` and all the rooms are locked, except for room `0`. Your goal is to visit all the rooms. However, you cannot enter a locked room without having its key.\n\nWhen you visit a room, you may find a set of distinct keys in it. Each key has a number on it, denoting which room it unlocks, and you can take all of them with you to unlock other rooms.\n\nGiven an array `rooms` where `rooms[i]` is the set of keys that you can obtain if you visited room `i`, return `true` if you can visit all the rooms, or `false` otherwise.",
      functionName: "canVisitAllRooms",
      parameters: [{ name: "rooms", type: "number[][]", description: "Array of keys found in each room" }],
      returnType: "boolean",
      constraints: ["n == rooms.length", "2 <= n <= 1000", "0 <= rooms[i].length <= 1000", "1 <= sum(rooms[i].length) <= 3000", "0 <= rooms[i][j] < n", "All the values of rooms[i] are unique."],
      examples: [
        { input: "rooms = [[1],[2],[3],[]]", output: "true", explanation: "Visit 0 -> key 1, visit 1 -> key 2, visit 2 -> key 3, visit 3. All 4 visited." },
        { input: "rooms = [[1,3],[3,0,1],[2],[0]]", output: "false", explanation: "Cannot reach room 2 because key 2 is inside room 2." },
        { input: "rooms = [[1],[]]", output: "true", explanation: "2 rooms visited." },
        { input: "rooms = [[],[1]]", output: "false", explanation: "No keys in room 0, room 1 unreachable." }
      ],
      optimalSolution: `function canVisitAllRooms(rooms) {\n  const n = rooms.length;\n  const visited = new Set([0]);\n  const queue = [0];\n  while (queue.length > 0) {\n    const curr = queue.shift();\n    for (const key of rooms[curr]) {\n      if (!visited.has(key)) {\n        visited.add(key);\n        queue.push(key);\n      }\n    }\n  }\n  return visited.size === n;\n}`,
      optimalTimeComplexity: "O(n + sum(keys))",
      optimalSpaceComplexity: "O(n)",
      suboptimalSolution: `function canVisitAllRooms(rooms) {\n  const visited = new Set();\n  function dfs(room) {\n    visited.add(room);\n    for (const key of rooms[room]) {\n      if (!visited.has(key)) dfs(key);\n    }\n  }\n  dfs(0);\n  return visited.size === rooms.length;\n}`,
      suboptimalTimeComplexity: "O(n + sum(keys))",
      suboptimalSpaceComplexity: "O(n) recursion stack",
      commonMistakes: ["Checking if all rooms have keys rather than if all rooms are reachable from room 0.", "Infinite loop when rooms have cyclic key references (e.g. room 1 has key 0, room 0 has key 1)."],
      hints: [
        "Room 0 is unlocked by default.",
        "Perform BFS or DFS starting at room 0.",
        "Add discovered keys to a queue/stack if the destination room has not been visited yet.",
        "Finally, check if `visited.size === rooms.length`."
      ],
      oracleFn: (rooms: number[][]) => {
        const n = rooms.length;
        const visited = new Set<number>([0]);
        const queue: number[] = [0];
        while (queue.length > 0) {
          const curr = queue.shift()!;
          for (const key of rooms[curr]) {
            if (!visited.has(key)) {
              visited.add(key);
              queue.push(key);
            }
          }
        }
        return visited.size === n;
      },
      testCases: {
        functional: [
          [[[1], [2], [3], []]],
          [[[1, 3], [3, 0, 1], [2], [0]]],
          [[[1], []]],
          [[[], [1]]]
        ],
        boundary: [
          [[[1, 2], [3], [], [0]]],
          [[[1], [0]]],
          [[[], [], []]],
          [[[1, 2, 3], [], [], []]]
        ],
        adversarial: [
          [[[2], [], [1]]],
          [[[1], [2], [0], [4], [3]]]
        ],
        stress: [
          [Array.from({ length: 50 }, (_, i) => (i < 49 ? [i + 1] : []))],
          [Array.from({ length: 50 }, (_, i) => (i === 25 ? [] : [i + 1]))]
        ]
      }
    }),

    // 312. Evaluate Division
    createProblem({
      num: 312,
      title: "Evaluate Division",
      slug: "evaluate-division",
      level: 14,
      difficulty: "MEDIUM",
      topic: "Graph / BFS / DFS",
      patternSlug: "graph-bfs-dfs",
      estimatedTimeMin: 25,
      statement: "You are given an array of variable pairs `equations` and an array of real numbers `values`, where `equations[i] = [Ai, Bi]` and `values[i]` represent the equation `Ai / Bi = values[i]`.\n\nYou are also given some `queries`, where `queries[j] = [Cj, Dj]` represents the `j-th` query where you must find the answer for `Cj / Dj = ?`.\n\nReturn the answers to all queries. If a single answer cannot be determined, return `-1.0`.",
      functionName: "calcEquation",
      parameters: [
        { name: "equations", type: "string[][]", description: "Variable pairs" },
        { name: "values", type: "number[]", description: "Values for equations" },
        { name: "queries", type: "string[][]", description: "Query pairs to evaluate" }
      ],
      returnType: "number[]",
      constraints: ["1 <= equations.length <= 20", "values.length == equations.length", "0.0 < values[i] <= 20.0", "1 <= queries.length <= 20", "equations[i].length == 2", "queries[i].length == 2", "Variable names consist of lower case English letters and have length 1 to 5."],
      examples: [
        { input: "equations = [[\"a\",\"b\"],[\"b\",\"c\"]], values = [2.0,3.0], queries = [[\"a\",\"c\"],[\"b\",\"a\"],[\"a\",\"e\"],[\"a\",\"a\"],[\"x\",\"x\"]]", output: "[6.0,0.5,-1.0,1.0,-1.0]", explanation: "a/c = 2*3 = 6. b/a = 1/2 = 0.5. a/e not found (-1). a/a = 1.0 (a exists). x/x = -1 (x unknown)." },
        { input: "equations = [[\"a\",\"b\"],[\"b\",\"c\"],[\"bc\",\"cd\"]], values = [1.5,2.5,5.0], queries = [[\"a\",\"c\"],[\"c\",\"b\"],[\"bc\",\"cd\"],[\"cd\",\"bc\"]]", output: "[3.75,0.4,5.0,0.2]", explanation: "Multiple chain evaluations." },
        { input: "equations = [[\"a\",\"b\"]], values = [0.5], queries = [[\"a\",\"b\"],[\"b\",\"a\"],[\"a\",\"c\"],[\"x\",\"y\"]]", output: "[0.5,2.0,-1.0,-1.0]", explanation: "Direct and inverse ratios." },
        { input: "equations = [[\"x\",\"y\"]], values = [3.0], queries = [[\"x\",\"x\"],[\"y\",\"y\"]]", output: "[1.0,1.0]", explanation: "Identity queries on existing variables." }
      ],
      optimalSolution: `function calcEquation(equations, values, queries) {\n  const graph = new Map();\n  for (let i = 0; i < equations.length; i++) {\n    const [u, v] = equations[i];\n    const val = values[i];\n    if (!graph.has(u)) graph.set(u, []);\n    if (!graph.has(v)) graph.set(v, []);\n    graph.get(u).push([v, val]);\n    graph.get(v).push([u, 1.0 / val]);\n  }\n  function bfs(start, end) {\n    if (!graph.has(start) || !graph.has(end)) return -1.0;\n    if (start === end) return 1.0;\n    const q = [[start, 1.0]];\n    const visited = new Set([start]);\n    while (q.length > 0) {\n      const [curr, currProd] = q.shift();\n      if (curr === end) return currProd;\n      for (const [next, weight] of graph.get(curr)) {\n        if (!visited.has(next)) {\n          visited.add(next);\n          q.push([next, currProd * weight]);\n        }\n      }\n    }\n    return -1.0;\n  }\n  return queries.map(([c, d]) => bfs(c, d));\n}`,
      optimalTimeComplexity: "O(Q * (V + E))",
      optimalSpaceComplexity: "O(V + E)",
      suboptimalSolution: `function calcEquation(equations, values, queries) {\n  const graph = new Map();\n  for (let i = 0; i < equations.length; i++) {\n    const [u, v] = equations[i];\n    const val = values[i];\n    if (!graph.has(u)) graph.set(u, []);\n    if (!graph.has(v)) graph.set(v, []);\n    graph.get(u).push([v, val]);\n    graph.get(v).push([u, 1.0 / val]);\n  }\n  function dfs(curr, target, visited) {\n    if (!graph.has(curr) || !graph.has(target)) return -1.0;\n    if (curr === target) return 1.0;\n    visited.add(curr);\n    for (const [next, w] of graph.get(curr)) {\n      if (!visited.has(next)) {\n        const sub = dfs(next, target, visited);\n        if (sub !== -1.0) return w * sub;\n      }\n    }\n    return -1.0;\n  }\n  return queries.map(([c, d]) => dfs(c, d, new Set()));\n}`,
      suboptimalTimeComplexity: "O(Q * (V + E))",
      suboptimalSpaceComplexity: "O(V + E)",
      commonMistakes: ["Returning 1.0 for unknown variables `['x', 'x']` when 'x' was never in equations.", "Forgetting the inverse edge `v -> u` with weight `1.0 / val`."],
      hints: [
        "Model this as a directed weighted graph: edge A -> B with weight val, edge B -> A with weight 1.0 / val.",
        "For query [C, D], find a path from C to D and multiply weights along the path.",
        "If C or D does not exist in graph, return -1.0 immediately."
      ],
      oracleFn: (equations: string[][], values: number[], queries: string[][]) => {
        const graph = new Map<string, [string, number][]>();
        for (let i = 0; i < equations.length; i++) {
          const [u, v] = equations[i];
          const val = values[i];
          if (!graph.has(u)) graph.set(u, []);
          if (!graph.has(v)) graph.set(v, []);
          graph.get(u)!.push([v, val]);
          graph.get(v)!.push([u, 1.0 / val]);
        }
        function bfs(start: string, end: string): number {
          if (!graph.has(start) || !graph.has(end)) return -1.0;
          if (start === end) return 1.0;
          const q: [string, number][] = [[start, 1.0]];
          const visited = new Set<string>([start]);
          while (q.length > 0) {
            const [curr, currProd] = q.shift()!;
            if (curr === end) return currProd;
            for (const [next, weight] of graph.get(curr)!) {
              if (!visited.has(next)) {
                visited.add(next);
                q.push([next, currProd * weight]);
              }
            }
          }
          return -1.0;
        }
        return queries.map(([c, d]) => bfs(c, d));
      },
      testCases: {
        functional: [
          [[["a", "b"], ["b", "c"]], [2.0, 3.0], [["a", "c"], ["b", "a"], ["a", "e"], ["a", "a"], ["x", "x"]]],
          [[["a", "b"], ["b", "c"], ["bc", "cd"]], [1.5, 2.5, 5.0], [["a", "c"], ["c", "b"], ["bc", "cd"], ["cd", "bc"]]],
          [[["a", "b"]], [0.5], [["a", "b"], ["b", "a"], ["a", "c"], ["x", "y"]]],
          [[["x", "y"]], [3.0], [["x", "x"], ["y", "y"]]]
        ],
        boundary: [
          [[["a", "b"]], [2.0], [["b", "b"], ["a", "a"]]],
          [[["a", "b"]], [4.0], [["z", "z"]]],
          [[["x1", "x2"], ["x2", "x3"], ["x3", "x4"]], [2.0, 3.0, 4.0], [["x1", "x4"], ["x4", "x1"]]],
          [[["a", "b"], ["c", "d"]], [1.0, 1.0], [["a", "d"]]]
        ],
        adversarial: [
          [[["a", "b"], ["b", "c"], ["c", "d"], ["d", "e"]], [2.0, 2.0, 2.0, 2.0], [["a", "e"], ["e", "a"]]],
          [[["m", "n"], ["p", "q"]], [5.0, 10.0], [["m", "q"], ["n", "p"]]]
        ],
        stress: [
          [[["a", "b"], ["b", "c"], ["c", "d"], ["d", "e"], ["e", "f"]], [2.0, 3.0, 4.0, 5.0, 6.0], [["a", "f"], ["f", "a"], ["b", "e"]]],
          [[["k1", "k2"], ["k2", "k3"], ["k3", "k4"]], [1.5, 2.0, 2.5], [["k1", "k3"], ["k2", "k4"]]]
        ]
      }
    }),

    // 313. Word Ladder
    createProblem({
      num: 313,
      title: "Word Ladder",
      slug: "word-ladder",
      level: 14,
      difficulty: "HARD",
      topic: "Graph / BFS",
      patternSlug: "graph-bfs-dfs",
      estimatedTimeMin: 25,
      statement: "A transformation sequence from word `beginWord` to word `endWord` using a dictionary `wordList` is a sequence of words `beginWord -> s1 -> s2 -> ... -> sk` such that:\n- Every adjacent pair of words differs by a single letter.\n- Every `si` for `1 <= i <= k` is in `wordList`. (Note that `beginWord` does not need to be in `wordList`.)\n- `sk == endWord`\n\nGiven two words, `beginWord` and `endWord`, and a dictionary `wordList`, return the number of words in the shortest transformation sequence from `beginWord` to `endWord`, or `0` if no such sequence exists.",
      functionName: "ladderLength",
      parameters: [
        { name: "beginWord", type: "string", description: "Starting word" },
        { name: "endWord", type: "string", description: "Target transformation word" },
        { name: "wordList", type: "string[]", description: "Dictionary of valid words" }
      ],
      returnType: "number",
      constraints: ["1 <= beginWord.length <= 10", "endWord.length == beginWord.length", "1 <= wordList.length <= 5000", "wordList[i].length == beginWord.length", "beginWord, endWord, and wordList[i] consist of lowercase English letters.", "beginWord != endWord", "All the words in wordList are unique."],
      examples: [
        { input: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]", output: "5", explanation: "\"hit\" -> \"hot\" -> \"dot\" -> \"dog\" -> \"cog\", sequence length 5." },
        { input: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]", output: "0", explanation: "\"cog\" is not in wordList, cannot transform." },
        { input: "beginWord = \"a\", endWord = \"c\", wordList = [\"a\",\"b\",\"c\"]", output: "2", explanation: "\"a\" -> \"c\"." },
        { input: "beginWord = \"hot\", endWord = \"dog\", wordList = [\"hot\",\"dog\"]", output: "0", explanation: "Differs by 2 letters, impossible." }
      ],
      optimalSolution: `function ladderLength(beginWord, endWord, wordList) {\n  const wordSet = new Set(wordList);\n  if (!wordSet.has(endWord)) return 0;\n  const queue = [[beginWord, 1]];\n  const visited = new Set([beginWord]);\n  while (queue.length > 0) {\n    const [word, level] = queue.shift();\n    if (word === endWord) return level;\n    for (let i = 0; i < word.length; i++) {\n      for (let c = 97; c <= 122; c++) {\n        const char = String.fromCharCode(c);\n        if (char === word[i]) continue;\n        const nextWord = word.slice(0, i) + char + word.slice(i + 1);\n        if (wordSet.has(nextWord) && !visited.has(nextWord)) {\n          visited.add(nextWord);\n          queue.push([nextWord, level + 1]);\n        }\n      }\n    }\n  }\n  return 0;\n}`,
      optimalTimeComplexity: "O(M^2 * N)",
      optimalSpaceComplexity: "O(M * N)",
      suboptimalSolution: `function ladderLength(beginWord, endWord, wordList) {\n  const wordSet = new Set(wordList);\n  if (!wordSet.has(endWord)) return 0;\n  let q = [beginWord];\n  let level = 1;\n  while (q.length > 0) {\n    const nextQ = [];\n    for (const w of q) {\n      if (w === endWord) return level;\n      for (const cand of wordSet) {\n        let diff = 0;\n        for (let i = 0; i < w.length; i++) {\n          if (w[i] !== cand[i]) diff++;\n        }\n        if (diff === 1) {\n          nextQ.push(cand);\n          wordSet.delete(cand);\n        }\n      }\n    }\n    q = nextQ;\n    level++;\n  }\n  return 0;\n}`,
      suboptimalTimeComplexity: "O(N^2 * M)",
      suboptimalSpaceComplexity: "O(M * N)",
      commonMistakes: ["Comparing all pairs in wordList (O(N^2 * M)), causing TLE for large N. Mutating each character (26 * M) is much faster."],
      hints: [
        "First verify endWord is in wordList; if not, return 0.",
        "Use BFS to find the shortest path in unweighted graph.",
        "To find neighbors, replace each character with 'a' through 'z' and check membership in wordSet."
      ],
      oracleFn: (beginWord: string, endWord: string, wordList: string[]) => {
        const wordSet = new Set<string>(wordList);
        if (!wordSet.has(endWord)) return 0;
        const queue: [string, number][] = [[beginWord, 1]];
        const visited = new Set<string>([beginWord]);
        while (queue.length > 0) {
          const [word, level] = queue.shift()!;
          if (word === endWord) return level;
          for (let i = 0; i < word.length; i++) {
            for (let c = 97; c <= 122; c++) {
              const char = String.fromCharCode(c);
              if (char === word[i]) continue;
              const nextWord = word.slice(0, i) + char + word.slice(i + 1);
              if (wordSet.has(nextWord) && !visited.has(nextWord)) {
                visited.add(nextWord);
                queue.push([nextWord, level + 1]);
              }
            }
          }
        }
        return 0;
      },
      testCases: {
        functional: [
          ["hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"]],
          ["hit", "cog", ["hot", "dot", "dog", "lot", "log"]],
          ["a", "c", ["a", "b", "c"]],
          ["hot", "dog", ["hot", "dog"]]
        ],
        boundary: [
          ["a", "b", ["b"]],
          ["ab", "cd", ["cb", "cd"]],
          ["abc", "xyz", ["abc", "xbc", "xyc", "xyz"]],
          ["lead", "gold", ["load", "goad", "gold"]]
        ],
        adversarial: [
          ["lost", "cost", ["most", "fist", "lost", "cost"]],
          ["talk", "tail", ["tank", "tint", "tait", "tail"]]
        ],
        stress: [
          ["aaaa", "cccc", ["baaa", "caaa", "cbaa", "ccaa", "ccba", "ccca", "cccc"]],
          ["test", "best", ["best", "rest", "nest", "pest", "west"]]
        ]
      }
    }),

    // 314. Open the Lock
    createProblem({
      num: 314,
      title: "Open the Lock",
      slug: "open-the-lock",
      level: 14,
      difficulty: "MEDIUM",
      topic: "Graph / BFS",
      patternSlug: "graph-bfs-dfs",
      estimatedTimeMin: 20,
      statement: "You have a lock in front of you with 4 circular wheels. Each wheel has 10 slots: `'0', '1', '2', '3', '4', '5', '6', '7', '8', '9'`. The wheels can rotate freely and wrap around: for example we can turn `'9'` to be `'0'`, or `'0'` to be `'9'`. Each move consists of turning one wheel one slot.\n\nThe lock initially starts at `'0000'`, a string representing the state of the 4 wheels.\n\nYou are given a list of `deadends` dead ends, meaning if the lock displays any of these codes, the wheels of the lock will stop turning and you will be unable to open it.\n\nGiven a `target` representing the value of the wheels that will unlock the lock, return the minimum total number of turns required to open the lock, or `-1` if it is impossible.",
      functionName: "openLock",
      parameters: [
        { name: "deadends", type: "string[]", description: "Dead end combination strings" },
        { name: "target", type: "string", description: "Target combination string" }
      ],
      returnType: "number",
      constraints: ["1 <= deadends.length <= 500", "deadends[i].length == 4", "target.length == 4", "target will not be in the list deadends.", "target and deadends[i] consist only of digits."],
      examples: [
        { input: "deadends = [\"0201\",\"0101\",\"0102\",\"1212\",\"2002\"], target = \"0202\"", output: "6", explanation: "Shortest sequence: \"0000\" -> \"1000\" -> \"1100\" -> \"1200\" -> \"1201\" -> \"1202\" -> \"0202\"." },
        { input: "deadends = [\"8888\"], target = \"0009\"", output: "1", explanation: "Turn the last wheel once: \"0000\" -> \"0009\"." },
        { input: "deadends = [\"8887\",\"8889\",\"8878\",\"8898\",\"8788\",\"8988\",\"7888\",\"9888\"], target = \"8888\"", output: "-1", explanation: "Target is completely blocked by deadends." },
        { input: "deadends = [\"0000\"], target = \"8888\"", output: "-1", explanation: "Initial combination is a dead end." }
      ],
      optimalSolution: `function openLock(deadends, target) {\n  const dead = new Set(deadends);\n  if (dead.has('0000')) return -1;\n  if (target === '0000') return 0;\n  const queue = [['0000', 0]];\n  const visited = new Set(['0000']);\n  let head = 0;\n  while (head < queue.length) {\n    const [curr, turns] = queue[head++];\n    if (curr === target) return turns;\n    for (let i = 0; i < 4; i++) {\n      const digit = Number(curr[i]);\n      const up = (digit + 1) % 10;\n      const down = (digit + 9) % 10;\n      const sUp = curr.slice(0, i) + up + curr.slice(i + 1);\n      const sDown = curr.slice(0, i) + down + curr.slice(i + 1);\n      if (!dead.has(sUp) && !visited.has(sUp)) {\n        visited.add(sUp);\n        queue.push([sUp, turns + 1]);\n      }\n      if (!dead.has(sDown) && !visited.has(sDown)) {\n        visited.add(sDown);\n        queue.push([sDown, turns + 1]);\n      }\n    }\n  }\n  return -1;\n}`,
      optimalTimeComplexity: "O(10^4)",
      optimalSpaceComplexity: "O(10^4)",
      suboptimalSolution: `function openLock(deadends, target) {\n  const dead = new Set(deadends);\n  if (dead.has('0000')) return -1;\n  const visited = new Set(['0000']);\n  const q = ['0000'];\n  let step = 0;\n  while (q.length > 0) {\n    const size = q.length;\n    for (let k = 0; k < size; k++) {\n      const curr = q.shift();\n      if (curr === target) return step;\n      for (let i = 0; i < 4; i++) {\n        const d = Number(curr[i]);\n        for (const diff of [-1, 1]) {\n          const nd = (d + diff + 10) % 10;\n          const next = curr.substring(0, i) + nd + curr.substring(i + 1);\n          if (!dead.has(next) && !visited.has(next)) {\n            visited.add(next);\n            q.push(next);\n          }\n        }\n      }\n    }\n    step++;\n  }\n  return -1;\n}`,
      suboptimalTimeComplexity: "O(10^4)",
      suboptimalSpaceComplexity: "O(10^4)",
      commonMistakes: ["Failing to check if '0000' itself is a dead end.", "Incorrect wrap-around logic for 0 - 1 (must be 9)."],
      hints: [
        "Each 4-digit code is a graph vertex with 8 neighbors (+1 and -1 on each of 4 wheels).",
        "Use BFS to find the shortest path from '0000' to target.",
        "Use a Set for O(1) deadend lookups."
      ],
      oracleFn: (deadends: string[], target: string) => {
        const dead = new Set<string>(deadends);
        if (dead.has('0000')) return -1;
        if (target === '0000') return 0;
        const queue: [string, number][] = [['0000', 0]];
        const visited = new Set<string>(['0000']);
        let head = 0;
        while (head < queue.length) {
          const [curr, turns] = queue[head++];
          if (curr === target) return turns;
          for (let i = 0; i < 4; i++) {
            const digit = Number(curr[i]);
            const up = (digit + 1) % 10;
            const down = (digit + 9) % 10;
            const sUp = curr.slice(0, i) + up + curr.slice(i + 1);
            const sDown = curr.slice(0, i) + down + curr.slice(i + 1);
            if (!dead.has(sUp) && !visited.has(sUp)) {
              visited.add(sUp);
              queue.push([sUp, turns + 1]);
            }
            if (!dead.has(sDown) && !visited.has(sDown)) {
              visited.add(sDown);
              queue.push([sDown, turns + 1]);
            }
          }
        }
        return -1;
      },
      testCases: {
        functional: [
          [["0201", "0101", "0102", "1212", "2002"], "0202"],
          [["8888"], "0009"],
          [["8887", "8889", "8878", "8898", "8788", "8988", "7888", "9888"], "8888"],
          [["0000"], "8888"]
        ],
        boundary: [
          [[], "0000"],
          [["0001"], "0009"],
          [["9999"], "0001"],
          [["1000"], "0001"]
        ],
        adversarial: [
          [["0002", "0020", "0200", "2000"], "0003"],
          [["0009", "0090", "0900", "9000"], "1111"]
        ],
        stress: [
          [["1111", "2222", "3333", "4444"], "5555"],
          [["0100", "1000", "0010", "0001"], "9999"]
        ]
      }
    }),

    // 315. Minimum Genetic Mutation
    createProblem({
      num: 315,
      title: "Minimum Genetic Mutation",
      slug: "minimum-genetic-mutation",
      level: 14,
      difficulty: "MEDIUM",
      topic: "Graph / BFS",
      patternSlug: "graph-bfs-dfs",
      estimatedTimeMin: 20,
      statement: "A gene string can be represented by an 8-character long string, with choices from `'A'`, `'C'`, `'G'`, and `'T'`.\n\nSuppose we need to investigate a mutation from a gene string `startGene` to a gene string `endGene` where one mutation is defined as one single character changed in the gene string.\n\nA gene mutation is only valid if the mutated gene string can be found in the gene bank `bank`.\n\nGiven the two gene strings `startGene` and `endGene` and the gene bank `bank`, return the minimum number of mutations needed to mutate from `startGene` to `endGene`. If there is no such a mutation, return `-1`.",
      functionName: "minMutation",
      parameters: [
        { name: "startGene", type: "string", description: "Starting gene sequence (8 chars)" },
        { name: "endGene", type: "string", description: "Target gene sequence (8 chars)" },
        { name: "bank", type: "string[]", description: "Valid gene bank" }
      ],
      returnType: "number",
      constraints: ["startGene.length == 8", "endGene.length == 8", "0 <= bank.length <= 10", "bank[i].length == 8", "startGene, endGene, and bank[i] consist of only ['A', 'C', 'G', 'T']."],
      examples: [
        { input: "startGene = \"AACCGGTT\", endGene = \"AACCGGTA\", bank = [\"AACCGGTA\"]", output: "1", explanation: "One mutation in the last character." },
        { input: "startGene = \"AACCGGTT\", endGene = \"AAACGGTA\", bank = [\"AACCGGTA\",\"AACCGCTA\",\"AAACGGTA\"]", output: "2", explanation: "\"AACCGGTT\" -> \"AACCGGTA\" -> \"AAACGGTA\"." },
        { input: "startGene = \"AAAAACCC\", endGene = \"AACCCCCC\", bank = []", output: "-1", explanation: "Bank is empty, impossible." },
        { input: "startGene = \"AACCGGTT\", endGene = \"AACCGGTT\", bank = []", output: "0", explanation: "Start equals end, 0 mutations." }
      ],
      optimalSolution: `function minMutation(startGene, endGene, bank) {\n  if (startGene === endGene) return 0;\n  const bankSet = new Set(bank);\n  if (!bankSet.has(endGene)) return -1;\n  const queue = [[startGene, 0]];\n  const visited = new Set([startGene]);\n  const chars = ['A', 'C', 'G', 'T'];\n  while (queue.length > 0) {\n    const [curr, mut] = queue.shift();\n    if (curr === endGene) return mut;\n    for (let i = 0; i < 8; i++) {\n      for (const ch of chars) {\n        if (ch === curr[i]) continue;\n        const next = curr.slice(0, i) + ch + curr.slice(i + 1);\n        if (bankSet.has(next) && !visited.has(next)) {\n          visited.add(next);\n          queue.push([next, mut + 1]);\n        }\n      }\n    }\n  }\n  return -1;\n}`,
      optimalTimeComplexity: "O(B)",
      optimalSpaceComplexity: "O(B)",
      suboptimalSolution: `function minMutation(startGene, endGene, bank) {\n  const bankSet = new Set(bank);\n  if (!bankSet.has(endGene)) return -1;\n  let queue = [startGene];\n  let steps = 0;\n  while (queue.length > 0) {\n    const nextQ = [];\n    for (const gene of queue) {\n      if (gene === endGene) return steps;\n      for (const valid of bankSet) {\n        let diff = 0;\n        for (let i = 0; i < 8; i++) if (gene[i] !== valid[i]) diff++;\n        if (diff === 1) {\n          nextQ.push(valid);\n          bankSet.delete(valid);\n        }\n      }\n    }\n    queue = nextQ;\n    steps++;\n  }\n  return -1;\n}`,
      suboptimalTimeComplexity: "O(B^2)",
      suboptimalSpaceComplexity: "O(B)",
      commonMistakes: ["Mutating into gene sequences not present in `bank`.", "Forgetting to return -1 when `endGene` is absent from `bank`."],
      hints: [
        "This is an unweighted shortest path problem solved via BFS.",
        "From each gene, test replacing all 8 positions with 'A', 'C', 'G', 'T'.",
        "If a mutated gene exists in `bank` and has not been visited, enqueue it."
      ],
      oracleFn: (startGene: string, endGene: string, bank: string[]) => {
        if (startGene === endGene) return 0;
        const bankSet = new Set<string>(bank);
        if (!bankSet.has(endGene)) return -1;
        const queue: [string, number][] = [[startGene, 0]];
        const visited = new Set<string>([startGene]);
        const chars = ['A', 'C', 'G', 'T'];
        while (queue.length > 0) {
          const [curr, mut] = queue.shift()!;
          if (curr === endGene) return mut;
          for (let i = 0; i < 8; i++) {
            for (const ch of chars) {
              if (ch === curr[i]) continue;
              const next = curr.slice(0, i) + ch + curr.slice(i + 1);
              if (bankSet.has(next) && !visited.has(next)) {
                visited.add(next);
                queue.push([next, mut + 1]);
              }
            }
          }
        }
        return -1;
      },
      testCases: {
        functional: [
          ["AACCGGTT", "AACCGGTA", ["AACCGGTA"]],
          ["AACCGGTT", "AAACGGTA", ["AACCGGTA", "AACCGCTA", "AAACGGTA"]],
          ["AAAAACCC", "AACCCCCC", []],
          ["AACCGGTT", "AACCGGTT", []]
        ],
        boundary: [
          ["AAAAAAAA", "CCCCCCCC", ["CAAAAAAA", "CCAAAAAA", "CCCAAAAA", "CCCCAAAA", "CCCCCAAA", "CCCCCCAA", "CCCCCCC", "CCCCCCCC"]],
          ["TTTTTTTT", "AAAAAAAA", ["TTTTTTTA"]],
          ["AACCGGTT", "AACCGGTA", ["AACCGGTT", "AACCGGTA"]],
          ["CCCCCCCC", "CCCCCCCC", ["CCCCCCCC"]]
        ],
        adversarial: [
          ["AAAACCCC", "CCCCAAAA", ["AAAACCCA", "AAAACCAA", "AAAACAAA", "AAAAAAAA", "CAAAAAAA", "CCAAAAAA", "CCCAAAAA", "CCCCAAAA"]],
          ["GATCGATC", "CTAGCTAG", ["GATCGATA", "GATCGAAA"]]
        ],
        stress: [
          ["AACCGGTT", "GGCCAAAT", ["AACCGGTA", "AACCGGAA", "AACCGAAA", "AACCATAA", "AACAAAAA", "AGCAAAAA", "GGCAAAAA", "GGCCAAAA", "GGCCAAAT"]],
          ["TTTTTTTT", "TTTTTTTA", ["TTTTTTTA"]]
        ]
      }
    }),

    // 316. All Paths From Source Lead to Destination
    createProblem({
      num: 316,
      title: "All Paths From Source Lead to Destination",
      slug: "all-paths-from-source-lead-to-destination",
      level: 14,
      difficulty: "MEDIUM",
      topic: "Graph / DFS / Cycle Detection",
      patternSlug: "graph-bfs-dfs",
      estimatedTimeMin: 20,
      statement: "Given the `edges` of a directed graph where `edges[i] = [ai, bi]` indicates there is an edge between node `ai` and node `bi`, and two nodes `source` and `destination` of this graph, determine whether or not all paths starting from `source` eventually, end at `destination`, that is:\n- At least one path exists from `source` to `destination`.\n- If a path exists from `source` to any node `u`, then all paths starting from `u` must be able to lead to `destination`.\n- Node `destination` has no outgoing edges.\n- There are no infinite paths (i.e. no cycles reachable from `source`).\n\nReturn `true` if and only if all paths from `source` lead to `destination`.",
      functionName: "leadsToDestination",
      parameters: [
        { name: "n", type: "number", description: "Number of nodes" },
        { name: "edges", type: "number[][]", description: "Directed edges list" },
        { name: "source", type: "number", description: "Start node" },
        { name: "destination", type: "number", description: "Target terminal node" }
      ],
      returnType: "boolean",
      constraints: ["1 <= n <= 10^4", "0 <= edges.length <= 10^4", "edges[i].length == 2", "0 <= ai, bi < n", "0 <= source, destination < n"],
      examples: [
        { input: "n = 3, edges = [[0,1],[0,2]], source = 0, destination = 2", output: "false", explanation: "Path 0 -> 1 terminates at node 1 which is not destination." },
        { input: "n = 4, edges = [[0,1],[0,3],[1,2],[2,1]], source = 0, destination = 3", output: "false", explanation: "Cycle exists between 1 and 2." },
        { input: "n = 4, edges = [[0,1],[0,2],[1,3],[2,3]], source = 0, destination = 3", output: "true", explanation: "All paths lead to 3." },
        { input: "n = 3, edges = [[0,1],[1,1],[1,2]], source = 0, destination = 2", output: "false", explanation: "Self loop at 1." }
      ],
      optimalSolution: `function leadsToDestination(n, edges, source, destination) {\n  const adj = Array.from({ length: n }, () => []);\n  for (const [u, v] of edges) {\n    adj[u].push(v);\n  }\n  // 0: unvisited, 1: visiting (in stack), 2: safe\n  const state = new Array(n).fill(0);\n  function dfs(curr) {\n    if (adj[curr].length === 0) return curr === destination;\n    state[curr] = 1;\n    for (const next of adj[curr]) {\n      if (state[next] === 1) return false; // Cycle detected\n      if (state[next] === 0 && !dfs(next)) return false;\n    }\n    state[curr] = 2;\n    return true;\n  }\n  return dfs(source);\n}`,
      optimalTimeComplexity: "O(V + E)",
      optimalSpaceComplexity: "O(V + E)",
      suboptimalSolution: `function leadsToDestination(n, edges, source, destination) {\n  const adj = Array.from({ length: n }, () => []);\n  for (const [u, v] of edges) adj[u].push(v);\n  if (adj[destination].length > 0) return false;\n  const visiting = new Set();\n  function dfs(u) {\n    if (visiting.has(u)) return false;\n    if (adj[u].length === 0) return u === destination;\n    visiting.add(u);\n    for (const v of adj[u]) {\n      if (!dfs(v)) return false;\n    }\n    visiting.delete(u);\n    return true;\n  }\n  return dfs(source);\n}`,
      suboptimalTimeComplexity: "O(V + E)",
      suboptimalSpaceComplexity: "O(V + E)",
      commonMistakes: ["Allowing outgoing edges from destination.", "Failing to memoize visited nodes resulting in TLE on DAGs with exponential paths."],
      hints: [
        "A leaf node must be equal to destination.",
        "Destination must have 0 outgoing edges (`adj[destination].length === 0`).",
        "Use 3-color DFS (WHITE=0, GRAY=1, BLACK=2) to detect cycles and verify all branches terminate at destination."
      ],
      oracleFn: (n: number, edges: number[][], source: number, destination: number) => {
        const adj: number[][] = Array.from({ length: n }, () => []);
        for (const [u, v] of edges) {
          adj[u].push(v);
        }
        const state = new Array(n).fill(0);
        function dfs(curr: number): boolean {
          if (adj[curr].length === 0) return curr === destination;
          state[curr] = 1;
          for (const next of adj[curr]) {
            if (state[next] === 1) return false;
            if (state[next] === 0 && !dfs(next)) return false;
          }
          state[curr] = 2;
          return true;
        }
        return dfs(source);
      },
      testCases: {
        functional: [
          [3, [[0, 1], [0, 2]], 0, 2],
          [4, [[0, 1], [0, 3], [1, 2], [2, 1]], 0, 3],
          [4, [[0, 1], [0, 2], [1, 3], [2, 3]], 0, 3],
          [3, [[0, 1], [1, 1], [1, 2]], 0, 2]
        ],
        boundary: [
          [1, [], 0, 0],
          [2, [[0, 1]], 0, 1],
          [2, [[0, 1], [1, 1]], 0, 1],
          [2, [[1, 0]], 0, 1]
        ],
        adversarial: [
          [5, [[0, 1], [1, 2], [2, 3], [3, 4], [4, 1]], 0, 4],
          [3, [[0, 1], [0, 2], [1, 2], [2, 0]], 0, 2]
        ],
        stress: [
          [100, Array.from({ length: 99 }, (_, i) => [i, i + 1]), 0, 99],
          [100, [...Array.from({ length: 99 }, (_, i) => [i, i + 1]), [50, 20]], 0, 99]
        ]
      }
    }),

    // 317. Find if Path Exists in Graph
    createProblem({
      num: 317,
      title: "Find if Path Exists in Graph",
      slug: "find-if-path-exists-in-graph",
      level: 14,
      difficulty: "EASY",
      topic: "Graph / BFS / DFS / Union Find",
      patternSlug: "graph-bfs-dfs",
      estimatedTimeMin: 10,
      statement: "There is a bi-directional graph with `n` vertices, where each vertex is labeled from `0` to `n - 1` (inclusive). The edges in the graph are represented as a 2D integer array `edges`, where each `edges[i] = [ui, vi]` denotes a bi-directional edge between vertex `ui` and vertex `vi`.\n\nYou want to determine if there is a valid path that exists from vertex `source` to vertex `destination`.\n\nGiven `edges` and the integers `n`, `source`, and `destination`, return `true` if there is a valid path from `source` to `destination`, or `false` otherwise.",
      functionName: "validPath",
      parameters: [
        { name: "n", type: "number", description: "Number of vertices" },
        { name: "edges", type: "number[][]", description: "Array of undirected edges" },
        { name: "source", type: "number", description: "Source vertex" },
        { name: "destination", type: "number", description: "Destination vertex" }
      ],
      returnType: "boolean",
      constraints: ["1 <= n <= 2 * 10^5", "0 <= edges.length <= 2 * 10^5", "edges[i].length == 2", "0 <= ui, vi <= n - 1", "ui != vi", "0 <= source, destination <= n - 1", "There are no duplicate edges.", "There are no self edges."],
      examples: [
        { input: "n = 3, edges = [[0,1],[1,2],[2,0]], source = 0, destination = 2", output: "true", explanation: "Path 0 -> 1 -> 2 exists." },
        { input: "n = 6, edges = [[0,1],[0,2],[3,5],[5,4],[4,3]], source = 0, destination = 5", output: "false", explanation: "Component {0,1,2} cannot reach {3,4,5}." },
        { input: "n = 1, edges = [], source = 0, destination = 0", output: "true", explanation: "Source is destination." },
        { input: "n = 2, edges = [[0,1]], source = 1, destination = 0", output: "true", explanation: "Bi-directional edge." }
      ],
      optimalSolution: `function validPath(n, edges, source, destination) {\n  if (source === destination) return true;\n  const parent = Array.from({ length: n }, (_, i) => i);\n  function find(x) {\n    if (parent[x] !== x) parent[x] = find(parent[x]);\n    return parent[x];\n  }\n  for (const [u, v] of edges) {\n    parent[find(u)] = find(v);\n    if (find(source) === find(destination)) return true;\n  }\n  return find(source) === find(destination);\n}`,
      optimalTimeComplexity: "O(n + E * alpha(n))",
      optimalSpaceComplexity: "O(n)",
      suboptimalSolution: `function validPath(n, edges, source, destination) {\n  if (source === destination) return true;\n  const adj = Array.from({ length: n }, () => []);\n  for (const [u, v] of edges) {\n    adj[u].push(v);\n    adj[v].push(u);\n  }\n  const visited = new Set([source]);\n  const q = [source];\n  while (q.length > 0) {\n    const curr = q.shift();\n    if (curr === destination) return true;\n    for (const next of adj[curr]) {\n      if (!visited.has(next)) {\n        visited.add(next);\n        q.push(next);\n      }\n    }\n  }\n  return false;\n}`,
      suboptimalTimeComplexity: "O(V + E)",
      suboptimalSpaceComplexity: "O(V + E)",
      commonMistakes: ["Early termination check missing for source === destination.", "BFS queue shift() timeout on 200,000 vertices (Union-Find is far faster)."],
      hints: [
        "If source === destination, return true immediately.",
        "Union-Find: union every edge [u, v].",
        "Finally check if find(source) === find(destination)."
      ],
      oracleFn: (n: number, edges: number[][], source: number, destination: number) => {
        if (source === destination) return true;
        const parent = Array.from({ length: n }, (_, i) => i);
        function find(x: number): number {
          if (parent[x] !== x) parent[x] = find(parent[x]);
          return parent[x];
        }
        for (const [u, v] of edges) {
          parent[find(u)] = find(v);
          if (find(source) === find(destination)) return true;
        }
        return find(source) === find(destination);
      },
      testCases: {
        functional: [
          [3, [[0, 1], [1, 2], [2, 0]], 0, 2],
          [6, [[0, 1], [0, 2], [3, 5], [5, 4], [4, 3]], 0, 5],
          [1, [], 0, 0],
          [2, [[0, 1]], 1, 0]
        ],
        boundary: [
          [2, [], 0, 1],
          [3, [[0, 1]], 0, 2],
          [4, [[0, 1], [1, 2], [2, 3]], 0, 3],
          [4, [[0, 1], [2, 3]], 0, 3]
        ],
        adversarial: [
          [5, [[0, 1], [1, 2], [3, 4]], 2, 3],
          [5, [[0, 1], [1, 2], [2, 3], [3, 4]], 4, 0]
        ],
        stress: [
          [100, Array.from({ length: 99 }, (_, i) => [i, i + 1]), 0, 99],
          [100, Array.from({ length: 98 }, (_, i) => [i, i + 1]), 0, 99]
        ]
      }
    }),

    // 318. Reorder Routes to Make All Paths Lead to the City Zero
    createProblem({
      num: 318,
      title: "Reorder Routes to Make All Paths Lead to the City Zero",
      slug: "reorder-routes-to-make-all-paths-lead-to-the-city-zero",
      level: 14,
      difficulty: "MEDIUM",
      topic: "Graph / BFS / DFS",
      patternSlug: "graph-bfs-dfs",
      estimatedTimeMin: 20,
      statement: "There are `n` cities numbered from `0` to `n - 1` and `n - 1` roads such that there is only one way to travel between two different cities (this network forms a tree). Last year, The ministry of transport decided to orient the roads in one direction because they are too narrow.\n\nRoads are represented by `connections` where `connections[i] = [a, b]` represents a directed road from city `a` to city `b`.\n\nThis year, there will be a big event in the capital (city `0`), and many people want to travel to this city.\n\nYour task consists of reorienting some roads such that each city can visit the city `0`. Return the minimum number of roads changed.",
      functionName: "minReorder",
      parameters: [
        { name: "n", type: "number", description: "Number of cities" },
        { name: "connections", type: "number[][]", description: "Directed roads [a, b]" }
      ],
      returnType: "number",
      constraints: ["2 <= n <= 5 * 10^4", "connections.length == n - 1", "connections[i].length == 2", "0 <= ai, bi <= n - 1", "ai != bi"],
      examples: [
        { input: "n = 6, connections = [[0,1],[1,3],[2,3],[4,0],[4,5]]", output: "3", explanation: "Change directions of roads [0,1], [1,3], and [4,5]." },
        { input: "n = 5, connections = [[1,0],[1,2],[3,2],[3,4]]", output: "2", explanation: "Change [1,2] and [3,4]." },
        { input: "n = 3, connections = [[1,0],[2,0]]", output: "0", explanation: "Both roads already point towards 0." },
        { input: "n = 2, connections = [[0,1]]", output: "1", explanation: "Change [0,1] to [1,0]." }
      ],
      optimalSolution: `function minReorder(n, connections) {\n  const adj = Array.from({ length: n }, () => []);\n  for (const [u, v] of connections) {\n    adj[u].push([v, 1]); // original direction (outward from 0 = needs flip)\n    adj[v].push([u, 0]); // inward toward 0 = no flip needed\n  }\n  let changes = 0;\n  const visited = new Set([0]);\n  const q = [0];\n  while (q.length > 0) {\n    const curr = q.shift();\n    for (const [neighbor, cost] of adj[curr]) {\n      if (!visited.has(neighbor)) {\n        visited.add(neighbor);\n        changes += cost;\n        q.push(neighbor);\n      }\n    }\n  }\n  return changes;\n}`,
      optimalTimeComplexity: "O(n)",
      optimalSpaceComplexity: "O(n)",
      suboptimalSolution: `function minReorder(n, connections) {\n  const adj = Array.from({ length: n }, () => []);\n  for (const [u, v] of connections) {\n    adj[u].push([v, 1]);\n    adj[v].push([u, 0]);\n  }\n  let changes = 0;\n  function dfs(curr, parent) {\n    for (const [next, cost] of adj[curr]) {\n      if (next !== parent) {\n        changes += cost;\n        dfs(next, curr);\n      }\n    }\n  }\n  dfs(0, -1);\n  return changes;\n}`,
      suboptimalTimeComplexity: "O(n)",
      suboptimalSpaceComplexity: "O(n) recursion stack",
      commonMistakes: ["Trying to simulate paths from each city towards 0 instead of propagating outward from 0.", "Double counting undirected edges."],
      hints: [
        "Invert the perspective: start at city 0 and traverse outwards to all other cities.",
        "Add bidirectional edges to adjacency list: mark original edge `u -> v` with cost 1 (away from 0), and artificial `v -> u` with cost 0.",
        "Sum the costs of edges traversed during BFS/DFS starting from 0."
      ],
      oracleFn: (n: number, connections: number[][]) => {
        const adj: [number, number][][] = Array.from({ length: n }, () => []);
        for (const [u, v] of connections) {
          adj[u].push([v, 1]);
          adj[v].push([u, 0]);
        }
        let changes = 0;
        const visited = new Set<number>([0]);
        const q: number[] = [0];
        while (q.length > 0) {
          const curr = q.shift()!;
          for (const [neighbor, cost] of adj[curr]) {
            if (!visited.has(neighbor)) {
              visited.add(neighbor);
              changes += cost;
              q.push(neighbor);
            }
          }
        }
        return changes;
      },
      testCases: {
        functional: [
          [6, [[0, 1], [1, 3], [2, 3], [4, 0], [4, 5]]],
          [5, [[1, 0], [1, 2], [3, 2], [3, 4]]],
          [3, [[1, 0], [2, 0]]],
          [2, [[0, 1]]]
        ],
        boundary: [
          [2, [[1, 0]]],
          [4, [[0, 1], [1, 2], [2, 3]]],
          [4, [[3, 2], [2, 1], [1, 0]]],
          [3, [[0, 1], [0, 2]]]
        ],
        adversarial: [
          [5, [[0, 1], [2, 1], [3, 2], [4, 3]]],
          [6, [[0, 1], [2, 0], [3, 2], [4, 3], [5, 4]]]
        ],
        stress: [
          [50, Array.from({ length: 49 }, (_, i) => [i, i + 1])],
          [50, Array.from({ length: 49 }, (_, i) => [i + 1, i])]
        ]
      }
    }),

    // 319. Snakes and Ladders
    createProblem({
      num: 319,
      title: "Snakes and Ladders",
      slug: "snakes-and-ladders",
      level: 14,
      difficulty: "MEDIUM",
      topic: "Graph / BFS",
      patternSlug: "graph-bfs-dfs",
      estimatedTimeMin: 25,
      statement: "You are given an `n x n` integer matrix `board` where the cells are labeled from `1` to `n^2` in a Boustrophedon style starting from the bottom-left of the board (i.e. `board[n - 1][0]`) and alternating direction each row.\n\nYou start on square `1` of the board. In each move, from square `curr`, you choose a destination square `next` with a label in the range `[curr + 1, min(curr + 6, n^2)]`. If `next` has a snake or ladder (i.e. `board[r][c] != -1`), you must move to the destination of that snake or ladder.\n\nReturn the least number of dice rolls required to reach square `n^2`. If it is not possible to reach the square, return `-1`.",
      functionName: "snakesAndLadders",
      parameters: [{ name: "board", type: "number[][]", description: "n x n Boustrophedon board" }],
      returnType: "number",
      constraints: ["n == board.length == board[i].length", "2 <= n <= 20", "board[i][j] is -1 or in the range [1, n^2].", "The squares labeled 1 and n^2 do not have any ladders or snakes."],
      examples: [
        { input: "board = [[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,35,-1,-1,13,-1],[-1,-1,-1,-1,-1,-1],[-1,15,-1,-1,-1,-1]]", output: "4", explanation: "Rolls: 1 -> 15 (ladder at 2), 15 -> 17, 17 -> 35 (ladder at 18), 35 -> 36." },
        { input: "board = [[-1,-1],[-1,3]]", output: "1", explanation: "Roll 1: step to 2, climb ladder to 3." },
        { input: "board = [[-1,-1],[-1,-1]]", output: "1", explanation: "Roll 3 directly lands on 4 (capped by n^2)." },
        { input: "board = [[-1,1,2,-1],[2,13,15,-1],[-1,10,-1,-1],[-1,6,2,8]]", output: "4", explanation: "BFS path with snakes and ladders." }
      ],
      optimalSolution: `function snakesAndLadders(board) {\n  const n = board.length;\n  function getCoordinates(square) {\n    const rowFromBottom = Math.floor((square - 1) / n);\n    const r = n - 1 - rowFromBottom;\n    let c = (square - 1) % n;\n    if (rowFromBottom % 2 === 1) c = n - 1 - c;\n    return [r, c];\n  }\n  const visited = new Set([1]);\n  const queue = [[1, 0]];\n  while (queue.length > 0) {\n    const [curr, moves] = queue.shift();\n    if (curr === n * n) return moves;\n    for (let i = 1; i <= 6; i++) {\n      let next = curr + i;\n      if (next > n * n) break;\n      const [r, c] = getCoordinates(next);\n      if (board[r][c] !== -1) next = board[r][c];\n      if (!visited.has(next)) {\n        visited.add(next);\n        queue.push([next, moves + 1]);\n      }\n    }\n  }\n  return -1;\n}`,
      optimalTimeComplexity: "O(n^2)",
      optimalSpaceComplexity: "O(n^2)",
      suboptimalSolution: `function snakesAndLadders(board) {\n  const n = board.length;\n  const dist = new Array(n * n + 1).fill(Infinity);\n  dist[1] = 0;\n  const q = [1];\n  function getPos(s) {\n    const r = n - 1 - Math.floor((s - 1) / n);\n    const rem = (s - 1) % n;\n    const c = (Math.floor((s - 1) / n) % 2 === 0) ? rem : n - 1 - rem;\n    return [r, c];\n  }\n  while (q.length > 0) {\n    const u = q.shift();\n    if (u === n * n) return dist[u];\n    for (let k = 1; k <= 6 && u + k <= n * n; k++) {\n      let v = u + k;\n      const [r, c] = getPos(v);\n      if (board[r][c] !== -1) v = board[r][c];\n      if (dist[v] > dist[u] + 1) {\n        dist[v] = dist[u] + 1;\n        q.push(v);\n      }\n    }\n  }\n  return -1;\n}`,
      suboptimalTimeComplexity: "O(n^2)",
      suboptimalSpaceComplexity: "O(n^2)",
      commonMistakes: ["Incorrect Boustrophedon coordinate conversion (alternating left-to-right and right-to-left rows).", "Chaining snakes/ladders consecutively (rule specifies taking at most ONE ladder/snake per roll)."],
      hints: [
        "Convert square label s (1 to n^2) to (row, col): rowFromBottom = (s - 1) / n, row = n - 1 - rowFromBottom. If rowFromBottom is odd, reverse column.",
        "Run BFS starting at square 1 with 0 moves.",
        "Only take the snake or ladder at the END of the roll (do not recursively jump)."
      ],
      oracleFn: (board: number[][]) => {
        const n = board.length;
        function getCoordinates(square: number): [number, number] {
          const rowFromBottom = Math.floor((square - 1) / n);
          const r = n - 1 - rowFromBottom;
          let c = (square - 1) % n;
          if (rowFromBottom % 2 === 1) c = n - 1 - c;
          return [r, c];
        }
        const visited = new Set<number>([1]);
        const queue: [number, number][] = [[1, 0]];
        while (queue.length > 0) {
          const [curr, moves] = queue.shift()!;
          if (curr === n * n) return moves;
          for (let i = 1; i <= 6; i++) {
            let next = curr + i;
            if (next > n * n) break;
            const [r, c] = getCoordinates(next);
            if (board[r][c] !== -1) next = board[r][c];
            if (!visited.has(next)) {
              visited.add(next);
              queue.push([next, moves + 1]);
            }
          }
        }
        return -1;
      },
      testCases: {
        functional: [
          [[[-1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1], [-1, 35, -1, -1, 13, -1], [-1, -1, -1, -1, -1, -1], [-1, 15, -1, -1, -1, -1]]],
          [[[-1, -1], [-1, 3]]],
          [[[-1, -1], [-1, -1]]],
          [[[-1, 1, 2, -1], [2, 13, 15, -1], [-1, 10, -1, -1], [-1, 6, 2, 8]]]
        ],
        boundary: [
          [[[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]]],
          [[[-1, 4], [-1, 3]]],
          [[[-1, -1, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1]]],
          [[[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]]]
        ],
        adversarial: [
          [[[-1, 7, -1], [-1, 6, 9], [-1, -1, 2]]],
          [[[-1, -1, 19, 10, -1], [11, -1, -1, 16, -1], [-1, -1, -1, -1, -1], [-1, -1, -1, -1, -1], [-1, -1, -1, -1, -1]]]
        ],
        stress: [
          [Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => -1))],
          [Array.from({ length: 12 }, (_, r) => Array.from({ length: 12 }, (_, c) => (r === 5 && c === 5 ? 100 : -1)))]
        ]
      }
    }),

    // 320. Minimum Knight Moves
    createProblem({
      num: 320,
      title: "Minimum Knight Moves",
      slug: "minimum-knight-moves",
      level: 14,
      difficulty: "MEDIUM",
      topic: "Graph / BFS",
      patternSlug: "graph-bfs-dfs",
      estimatedTimeMin: 20,
      statement: "In an infinite chess board, you have a knight at square `[0, 0]`.\n\nA knight has 8 possible moves it can make, as shown below. Each move is two squares in a cardinal direction, then one square in an orthogonal direction.\n\nReturn the minimum number of steps needed to move the knight to the square `[x, y]`. It is guaranteed the answer exists.",
      functionName: "minKnightMoves",
      parameters: [
        { name: "x", type: "number", description: "Target x coordinate" },
        { name: "y", type: "number", description: "Target y coordinate" }
      ],
      returnType: "number",
      constraints: ["-300 <= x, y <= 300", "0 <= |x| + |y| <= 300"],
      examples: [
        { input: "x = 2, y = 1", output: "1", explanation: "One direct knight move [0,0] -> [2,1]." },
        { input: "x = 5, y = 5", output: "4", explanation: "[0,0] -> [2,1] -> [4,2] -> [3,4] -> [5,5]." },
        { input: "x = 0, y = 0", output: "0", explanation: "Already at target." },
        { input: "x = 1, y = 1", output: "2", explanation: "[0,0] -> [2,1] -> [1,1] (via [2,-1] -> [1,1] or [0,0] -> [-1,2] -> [1,1])." }
      ],
      optimalSolution: `function minKnightMoves(x, y) {\n  x = Math.abs(x);\n  y = Math.abs(y);\n  const memo = new Map();\n  function dfs(cx, cy) {\n    if (cx + cy === 0) return 0;\n    if (cx + cy === 2) return 2;\n    const key = \`\${cx},\${cy}\`;\n    if (memo.has(key)) return memo.get(key);\n    const ans = Math.min(\n      dfs(Math.abs(cx - 1), Math.abs(cy - 2)),\n      dfs(Math.abs(cx - 2), Math.abs(cy - 1))\n    ) + 1;\n    memo.set(key, ans);\n    return ans;\n  }\n  return dfs(x, y);\n}`,
      optimalTimeComplexity: "O(|x| * |y|)",
      optimalSpaceComplexity: "O(|x| * |y|)",
      suboptimalSolution: `function minKnightMoves(x, y) {\n  x = Math.abs(x);\n  y = Math.abs(y);\n  const queue = [[0, 0, 0]];\n  const visited = new Set(['0,0']);\n  const dirs = [\n    [1, 2], [2, 1], [-1, 2], [-2, 1],\n    [1, -2], [2, -1], [-1, -2], [-2, -1]\n  ];\n  let head = 0;\n  while (head < queue.length) {\n    const [cx, cy, steps] = queue[head++];\n    if (cx === x && cy === y) return steps;\n    for (const [dx, dy] of dirs) {\n      const nx = cx + dx, ny = cy + dy;\n      if (nx >= -1 && ny >= -1 && nx <= x + 2 && ny <= y + 2) {\n        const key = \`\${nx},\${ny}\`;\n        if (!visited.has(key)) {\n          visited.add(key);\n          queue.push([nx, ny, steps + 1]);\n        }\n      }\n    }\n  }\n  return 0;\n}`,
      suboptimalTimeComplexity: "O(|x| * |y|)",
      suboptimalSpaceComplexity: "O(|x| * |y|)",
      commonMistakes: ["Ignoring quadrant symmetry (by symmetry, minKnightMoves(x, y) = minKnightMoves(|x|, |y|)).", "Restricting BFS strictly to x >= 0, y >= 0 without allowing small negative excursions (e.g. [1,1] requires stepping to -1)."],
      hints: [
        "Take absolute values: x = Math.abs(x), y = Math.abs(y).",
        "Base cases: (0,0) requires 0 steps; (1,1) requires 2 steps; (1,0) requires 3 steps.",
        "Top-down DP / memoized DFS: min(dfs(|x - 1|, |y - 2|), dfs(|x - 2|, |y - 1|)) + 1."
      ],
      oracleFn: (x: number, y: number) => {
        x = Math.abs(x);
        y = Math.abs(y);
        const memo = new Map<string, number>();
        function dfs(cx: number, cy: number): number {
          if (cx + cy === 0) return 0;
          if (cx + cy === 2) return 2;
          const key = `${cx},${cy}`;
          if (memo.has(key)) return memo.get(key)!;
          const ans = Math.min(
            dfs(Math.abs(cx - 1), Math.abs(cy - 2)),
            dfs(Math.abs(cx - 2), Math.abs(cy - 1))
          ) + 1;
          memo.set(key, ans);
          return ans;
        }
        return dfs(x, y);
      },
      testCases: {
        functional: [
          [2, 1],
          [5, 5],
          [0, 0],
          [1, 1]
        ],
        boundary: [
          [1, 0],
          [0, 1],
          [2, 0],
          [0, 2]
        ],
        adversarial: [
          [-2, 1],
          [-5, -5]
        ],
        stress: [
          [100, 100],
          [200, 150]
        ]
      }
    }),

    // 321. Is Graph Bipartite?
    createProblem({
      num: 321,
      title: "Is Graph Bipartite?",
      slug: "is-graph-bipartite",
      level: 14,
      difficulty: "MEDIUM",
      topic: "Graph / BFS / DFS / 2-Coloring",
      patternSlug: "graph-bfs-dfs",
      estimatedTimeMin: 15,
      statement: "There is an undirected graph with `n` nodes, where each node is numbered between `0` and `n - 1`. You are given a 2D array `graph`, where `graph[u]` is an array of nodes that node `u` is adjacent to.\n\nA graph is bipartite if the nodes can be partitioned into two independent sets `A` and `B` such that every edge in the graph connects a node in set `A` and a node in set `B`.\n\nReturn `true` if and only if it is bipartite.",
      functionName: "isBipartite",
      parameters: [{ name: "graph", type: "number[][]", description: "Adjacency list representation of undirected graph" }],
      returnType: "boolean",
      constraints: ["graph.length == n", "1 <= n <= 100", "0 <= graph[u].length < n", "0 <= graph[u][i] <= n - 1", "graph[u] does not contain u", "All the values of graph[u] are unique.", "If graph[u] contains v, then graph[v] contains u."],
      examples: [
        { input: "graph = [[1,2,3],[0,2],[0,1,3],[0,2]]", output: "false", explanation: "Nodes 0, 1, 2 form a triangle (odd cycle), cannot 2-color." },
        { input: "graph = [[1,3],[0,2],[1,3],[0,2]]", output: "true", explanation: "Nodes {0, 2} and {1, 3} form a 4-cycle bipartite partition." },
        { input: "graph = [[]]", output: "true", explanation: "Single node with no edges is bipartite." },
        { input: "graph = [[1],[0]]", output: "true", explanation: "Two connected nodes are bipartite." }
      ],
      optimalSolution: `function isBipartite(graph) {\n  const n = graph.length;\n  const color = new Array(n).fill(0); // 0: uncolored, 1: red, -1: blue\n  for (let i = 0; i < n; i++) {\n    if (color[i] !== 0) continue;\n    const queue = [i];\n    color[i] = 1;\n    while (queue.length > 0) {\n      const curr = queue.shift();\n      for (const neighbor of graph[curr]) {\n        if (color[neighbor] === 0) {\n          color[neighbor] = -color[curr];\n          queue.push(neighbor);\n        } else if (color[neighbor] === color[curr]) {\n          return false;\n        }\n      }\n    }\n  }\n  return true;\n}`,
      optimalTimeComplexity: "O(V + E)",
      optimalSpaceComplexity: "O(V)",
      suboptimalSolution: `function isBipartite(graph) {\n  const n = graph.length;\n  const color = new Array(n).fill(0);\n  function dfs(u, c) {\n    color[u] = c;\n    for (const v of graph[u]) {\n      if (color[v] === c) return false;\n      if (color[v] === 0 && !dfs(v, -c)) return false;\n    }\n    return true;\n  }\n  for (let i = 0; i < n; i++) {\n    if (color[i] === 0 && !dfs(i, 1)) return false;\n  }\n  return true;\n}`,
      suboptimalTimeComplexity: "O(V + E)",
      suboptimalSpaceComplexity: "O(V) recursion stack",
      commonMistakes: ["Forgetting that the graph may have multiple disconnected components, only checking from node 0.", "Allowing adjacent nodes to have the same color."],
      hints: [
        "A graph is bipartite if and only if it does NOT contain an odd-length cycle.",
        "Use 2-coloring via BFS or DFS.",
        "Color unvisited node with 1, color all its neighbors with -1.",
        "If any neighbor already has the same color as the current node, return false."
      ],
      oracleFn: (graph: number[][]) => {
        const n = graph.length;
        const color = new Array(n).fill(0);
        for (let i = 0; i < n; i++) {
          if (color[i] !== 0) continue;
          const queue = [i];
          color[i] = 1;
          while (queue.length > 0) {
            const curr = queue.shift()!;
            for (const neighbor of graph[curr]) {
              if (color[neighbor] === 0) {
                color[neighbor] = -color[curr];
                queue.push(neighbor);
              } else if (color[neighbor] === color[curr]) {
                return false;
              }
            }
          }
        }
        return true;
      },
      testCases: {
        functional: [
          [[[1, 2, 3], [0, 2], [0, 1, 3], [0, 2]]],
          [[[1, 3], [0, 2], [1, 3], [0, 2]]],
          [[[]]],
          [[[1], [0]]]
        ],
        boundary: [
          [[[1], [0, 2], [1]]],
          [[[], [], []]],
          [[[1, 2], [0, 2], [0, 1]]],
          [[[1], [0], [3], [2]]]
        ],
        adversarial: [
          [[[1, 4], [0, 2], [1, 3], [2, 4], [3, 0]]],
          [[[1, 5], [0, 2], [1, 3], [2, 4], [3, 5], [4, 0]]]
        ],
        stress: [
          [Array.from({ length: 40 }, (_, i) => (i % 2 === 0 ? [i + 1] : [i - 1]))],
          [Array.from({ length: 50 }, (_, i) => [(i + 1) % 50, (i + 49) % 50])]
        ]
      }
    })
  ];

  return {
    level: 14,
    levelTitle: "Level 14 — Graph BFS/DFS",
    topic: "Graph Breadth-First Search, Depth-First Search, Cycle Detection, and Shortest Paths",
    problems
  };
}
