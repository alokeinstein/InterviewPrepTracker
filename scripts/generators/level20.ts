import { LevelPayload, GeneratedProblem } from './types';
import { createProblem } from './problemBuilder';

export function getLevel20Payload(): LevelPayload {
  const problems: GeneratedProblem[] = [
    // 408. Network Delay Time
    createProblem({
      num: 408,
      title: "Network Delay Time",
      slug: "network-delay-time",
      level: 20,
      difficulty: "MEDIUM",
      topic: "Shortest Paths & Advanced Graphs",
      patternSlug: "advanced-graphs",
      estimatedTimeMin: 25,
      statement: "You are given a network of `n` nodes, labeled from `1` to `n`. You are also given `times`, a list of travel times as directed edges `times[i] = (ui, vi, wi)`, where `ui` is the source node, `vi` is the target node, and `wi` is the time it takes for a signal to travel from source to target.\n\nWe will send a signal from a given node `k`. Return the minimum time it takes for all the `n` nodes to receive the signal. If it is impossible for all the `n` nodes to receive the signal, return `-1`.",
      functionName: "networkDelayTime",
      parameters: [
        { name: "times", type: "number[][]", description: "List of directed edges [u, v, w]" },
        { name: "n", type: "number", description: "Total number of nodes (1-indexed)" },
        { name: "k", type: "number", description: "Starting node" }
      ],
      returnType: "number",
      constraints: ["1 <= k <= n <= 100", "1 <= times.length <= 6000", "times[i].length == 3", "1 <= ui, vi <= n", "ui != vi", "0 <= wi <= 100", "All pairs (ui, vi) are unique."],
      examples: [
        { input: "times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2", output: "2", explanation: "Signal sends from node 2: reaches node 1 and 3 in time 1, then reaches node 4 in time 2. Total time 2." },
        { input: "times = [[1,2,1]], n = 2, k = 1", output: "1", explanation: "Signal reaches node 2 in time 1." },
        { input: "times = [[1,2,1]], n = 2, k = 2", output: "-1", explanation: "Node 1 is unreachable from node 2." },
        { input: "times = [[1,2,1],[2,3,2],[1,3,4]], n = 3, k = 1", output: "3", explanation: "Path 1 -> 2 -> 3 has time 3, shorter than 1 -> 3 (4)." }
      ],
      optimalSolution: `function networkDelayTime(times, n, k) {\n  const dist = new Array(n + 1).fill(Infinity);\n  dist[k] = 0;\n  for (let i = 1; i < n; i++) {\n    let updated = false;\n    for (const [u, v, w] of times) {\n      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {\n        dist[v] = dist[u] + w;\n        updated = true;\n      }\n    }\n    if (!updated) break;\n  }\n  let maxTime = 0;\n  for (let i = 1; i <= n; i++) {\n    if (dist[i] === Infinity) return -1;\n    if (dist[i] > maxTime) maxTime = dist[i];\n  }\n  return maxTime;\n}`,
      optimalTimeComplexity: "O(V * E) with Bellman-Ford or O(E + V log V) with Dijkstra",
      optimalSpaceComplexity: "O(V + E)",
      suboptimalSolution: `function networkDelayTime(times, n, k) {\n  const adj = Array.from({ length: n + 1 }, () => []);\n  for (const [u, v, w] of times) adj[u].push([v, w]);\n  const dist = new Array(n + 1).fill(Infinity);\n  dist[k] = 0;\n  const queue = [[k, 0]];\n  while (queue.length > 0) {\n    queue.sort((a, b) => a[1] - b[1]);\n    const [curr, d] = queue.shift();\n    if (d > dist[curr]) continue;\n    for (const [nxt, w] of adj[curr]) {\n      if (dist[curr] + w < dist[nxt]) {\n        dist[nxt] = dist[curr] + w;\n        queue.push([nxt, dist[nxt]]);\n      }\n    }\n  }\n  const max = Math.max(...dist.slice(1));\n  return max === Infinity ? -1 : max;\n}`,
      suboptimalTimeComplexity: "O(E * V log V)",
      suboptimalSpaceComplexity: "O(V + E)",
      commonMistakes: ["Using simple BFS without accounting for non-uniform positive edge weights.", "1-based vs 0-based node indexing."],
      hints: [
        "This is the single-source shortest path problem on a directed graph with positive edge weights.",
        "Dijkstra's algorithm or Bellman-Ford finds the shortest time to all nodes; return the maximum of these shortest times."
      ],
      oracleFn: (times: number[][], n: number, k: number) => {
        const dist = new Array(n + 1).fill(Infinity);
        dist[k] = 0;
        for (let i = 1; i < n; i++) {
          let updated = false;
          for (const [u, v, w] of times) {
            if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
              dist[v] = dist[u] + w;
              updated = true;
            }
          }
          if (!updated) break;
        }
        let maxTime = 0;
        for (let i = 1; i <= n; i++) {
          if (dist[i] === Infinity) return -1;
          if (dist[i] > maxTime) maxTime = dist[i];
        }
        return maxTime;
      },
      testCases: {
        functional: [
          [[[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2],
          [[[1, 2, 1]], 2, 1],
          [[[1, 2, 1]], 2, 2],
          [[[1, 2, 1], [2, 3, 2], [1, 3, 4]], 3, 1]
        ],
        boundary: [
          [[[1, 2, 10]], 2, 1],
          [[[1, 2, 0], [2, 3, 0]], 3, 1],
          [[[2, 3, 1]], 3, 1]
        ],
        adversarial: [
          [[[1, 2, 1], [2, 1, 1], [2, 3, 2], [3, 4, 1]], 4, 1],
          [[[1, 2, 1], [2, 3, 7], [1, 3, 3], [3, 4, 2], [1, 4, 10]], 4, 1],
          [[[3, 1, 5], [3, 2, 2], [2, 1, 1]], 3, 3]
        ],
        stress: [
          [Array.from({ length: 20 }, (_, i) => [i + 1, i + 2, (i * 3) % 10 + 1]), 21, 1],
          [Array.from({ length: 30 }, (_, i) => [1, i + 2, i + 1]), 31, 1]
        ]
      }
    }),

    // 409. Cheapest Flights Within K Stops
    createProblem({
      num: 409,
      title: "Cheapest Flights Within K Stops",
      slug: "cheapest-flights-within-k-stops",
      level: 20,
      difficulty: "MEDIUM",
      topic: "Shortest Paths & Advanced Graphs",
      patternSlug: "advanced-graphs",
      estimatedTimeMin: 25,
      statement: "There are `n` cities connected by some number of flights. You are given an array `flights` where `flights[i] = [fromi, toi, pricei]` indicates that there is a flight from city `fromi` to city `toi` with cost `pricei`.\n\nYou are also given three integers `src`, `dst`, and `k`, return the cheapest price from `src` to `dst` with at most `k` stops. If there is no such route, return `-1`.",
      functionName: "findCheapestPrice",
      parameters: [
        { name: "n", type: "number", description: "Number of cities (0 to n - 1)" },
        { name: "flights", type: "number[][]", description: "Array of flights [from, to, price]" },
        { name: "src", type: "number", description: "Source city" },
        { name: "dst", type: "number", description: "Destination city" },
        { name: "k", type: "number", description: "Maximum stops permitted" }
      ],
      returnType: "number",
      constraints: ["1 <= n <= 100", "0 <= flights.length <= (n * (n - 1) / 2)", "flights[i].length == 3", "0 <= fromi, toi < n", "fromi != toi", "1 <= pricei <= 10^4", "0 <= src, dst, k < n", "src != dst"],
      examples: [
        { input: "n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src = 0, dst = 3, k = 1", output: "700", explanation: "Path 0 -> 1 -> 3 has 1 stop with cost 100 + 600 = 700. (Path 0 -> 1 -> 2 -> 3 has 2 stops)." },
        { input: "n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 1", output: "200", explanation: "Path 0 -> 1 -> 2 has 1 stop with cost 200." },
        { input: "n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 0", output: "500", explanation: "Direct flight 0 -> 2 with 0 stops costs 500." },
        { input: "n = 2, flights = [[0,1,100]], src = 0, dst = 1, k = 0", output: "100", explanation: "Direct flight costs 100." }
      ],
      optimalSolution: `function findCheapestPrice(n, flights, src, dst, k) {\n  let prices = new Array(n).fill(Infinity);\n  prices[src] = 0;\n  for (let i = 0; i <= k; i++) {\n    const temp = [...prices];\n    for (const [u, v, p] of flights) {\n      if (prices[u] === Infinity) continue;\n      if (prices[u] + p < temp[v]) {\n        temp[v] = prices[u] + p;\n      }\n    }\n    prices = temp;\n  }\n  return prices[dst] === Infinity ? -1 : prices[dst];\n}`,
      optimalTimeComplexity: "O(K * E)",
      optimalSpaceComplexity: "O(V)",
      suboptimalSolution: `function findCheapestPrice(n, flights, src, dst, k) {\n  const adj = Array.from({ length: n }, () => []);\n  for (const [u, v, p] of flights) adj[u].push([v, p]);\n  const queue = [[src, 0, 0]];\n  const minCost = new Array(n).fill(Infinity);\n  minCost[src] = 0;\n  while (queue.length > 0) {\n    const [node, cost, stops] = queue.shift();\n    if (stops > k) continue;\n    for (const [nxt, price] of adj[node]) {\n      if (cost + price < minCost[nxt]) {\n        minCost[nxt] = cost + price;\n        queue.push([nxt, cost + price, stops + 1]);\n      }\n    }\n  }\n  return minCost[dst] === Infinity ? -1 : minCost[dst];\n}`,
      suboptimalTimeComplexity: "O(E * K)",
      suboptimalSpaceComplexity: "O(V * K)",
      commonMistakes: ["Updating prices in-place during the same iteration, allowing paths with more than 1 flight per iteration (breaking the k-stop constraint)."],
      hints: [
        "Run Bellman-Ford for exactly k + 1 iterations.",
        "Always read from a copy of the previous iteration's distances to ensure at most 1 edge is traversed per step."
      ],
      oracleFn: (n: number, flights: number[][], src: number, dst: number, k: number) => {
        let prices = new Array(n).fill(Infinity);
        prices[src] = 0;
        for (let i = 0; i <= k; i++) {
          const temp = [...prices];
          for (const [u, v, p] of flights) {
            if (prices[u] === Infinity) continue;
            if (prices[u] + p < temp[v]) {
              temp[v] = prices[u] + p;
            }
          }
          prices = temp;
        }
        return prices[dst] === Infinity ? -1 : prices[dst];
      },
      testCases: {
        functional: [
          [4, [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]], 0, 3, 1],
          [3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 1],
          [3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 0],
          [2, [[0, 1, 100]], 0, 1, 0]
        ],
        boundary: [
          [2, [], 0, 1, 1],
          [3, [[0, 1, 50]], 0, 2, 2],
          [4, [[0, 1, 10], [1, 2, 10], [2, 3, 10]], 0, 3, 1]
        ],
        adversarial: [
          [5, [[0, 1, 100], [1, 2, 100], [2, 3, 100], [3, 4, 100], [0, 4, 1000]], 0, 4, 2],
          [4, [[0, 1, 1], [0, 2, 5], [1, 2, 1], [2, 3, 1]], 0, 3, 1],
          [3, [[0, 1, 100], [1, 2, 200]], 0, 2, 0]
        ],
        stress: [
          [20, Array.from({ length: 19 }, (_, i) => [i, i + 1, 10]), 0, 19, 10],
          [25, Array.from({ length: 24 }, (_, i) => [i, i + 1, 5]), 0, 24, 25]
        ]
      }
    }),

    // 410. Path With Minimum Effort
    createProblem({
      num: 410,
      title: "Path With Minimum Effort",
      slug: "path-with-minimum-effort",
      level: 20,
      difficulty: "MEDIUM",
      topic: "Shortest Paths & Advanced Graphs",
      patternSlug: "advanced-graphs",
      estimatedTimeMin: 25,
      statement: "You are a hiker preparing for an upcoming hike. You are given `heights`, a 2D array of size `rows x columns`, where `heights[row][col]` represents the height of cell `(row, col)`. You are situated in the top-left cell, `(0, 0)`, and you hope to travel to the bottom-right cell, `(rows-1, columns-1)` (i.e., 0-indexed). You can move up, down, left, or right, and you wish to find a route that requires the minimum effort.\n\nA route's effort is the maximum absolute difference in heights between two consecutive cells of the route.\n\nReturn the minimum effort required to travel from the top-left cell to the bottom-right cell.",
      functionName: "minimumEffortPath",
      parameters: [{ name: "heights", type: "number[][]", description: "rows x columns grid of heights" }],
      returnType: "number",
      constraints: ["rows == heights.length", "columns == heights[i].length", "1 <= rows, columns <= 100", "1 <= heights[i][j] <= 10^6"],
      examples: [
        { input: "heights = [[1,2,2],[3,8,2],[5,3,5]]", output: "2", explanation: "Route [1,2,2,2,5] has maximum absolute difference 2 in consecutive cells." },
        { input: "heights = [[1,2,3],[3,8,4],[5,3,5]]", output: "1", explanation: "Route [1,2,3,4,5] has maximum absolute difference 1." },
        { input: "heights = [[1,2,1,1,1],[1,2,1,2,1],[1,2,1,2,1],[1,2,1,2,1],[1,1,1,2,1]]", output: "0", explanation: "Route through the 1s has absolute difference 0." },
        { input: "heights = [[3]]", output: "0", explanation: "Already at the destination." }
      ],
      optimalSolution: `function minimumEffortPath(heights) {\n  const R = heights.length, C = heights[0].length;\n  const dist = Array.from({ length: R }, () => new Array(C).fill(Infinity));\n  dist[0][0] = 0;\n  const queue = [[0, 0, 0]];\n  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];\n  while (queue.length > 0) {\n    queue.sort((a, b) => a[0] - b[0]);\n    const [effort, r, c] = queue.shift();\n    if (r === R - 1 && c === C - 1) return effort;\n    if (effort > dist[r][c]) continue;\n    for (const [dr, dc] of dirs) {\n      const nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nr < R && nc >= 0 && nc < C) {\n        const nextEffort = Math.max(effort, Math.abs(heights[nr][nc] - heights[r][c]));\n        if (nextEffort < dist[nr][nc]) {\n          dist[nr][nc] = nextEffort;\n          queue.push([nextEffort, nr, nc]);\n        }\n      }\n    }\n  }\n  return dist[R - 1][C - 1];\n}`,
      optimalTimeComplexity: "O(R * C log(R * C))",
      optimalSpaceComplexity: "O(R * C)",
      suboptimalSolution: `function minimumEffortPath(heights) {\n  const R = heights.length, C = heights[0].length;\n  let low = 0, high = 1000000, ans = 0;\n  function canReach(maxDiff) {\n    const visited = Array.from({ length: R }, () => new Array(C).fill(false));\n    const q = [[0, 0]];\n    visited[0][0] = true;\n    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];\n    while (q.length > 0) {\n      const [r, c] = q.shift();\n      if (r === R - 1 && c === C - 1) return true;\n      for (const [dr, dc] of dirs) {\n        const nr = r + dr, nc = c + dc;\n        if (nr >= 0 && nr < R && nc >= 0 && nc < C && !visited[nr][nc]) {\n          if (Math.abs(heights[nr][nc] - heights[r][c]) <= maxDiff) {\n            visited[nr][nc] = true;\n            q.push([nr, nc]);\n          }\n        }\n      }\n    }\n    return false;\n  }\n  while (low <= high) {\n    const mid = Math.floor((low + high) / 2);\n    if (canReach(mid)) {\n      ans = mid;\n      high = mid - 1;\n    } else {\n      low = mid + 1;\n    }\n  }\n  return ans;\n}`,
      suboptimalTimeComplexity: "O(R * C * log(maxHeight))",
      suboptimalSpaceComplexity: "O(R * C)",
      commonMistakes: ["Summing the differences along the route instead of finding the maximum difference along the route."],
      hints: [
        "This is a modified Dijkstra where edge weights represent max(effort, abs(h2 - h1)).",
        "Binary search on the answer + BFS is also an optimal alternative."
      ],
      oracleFn: (heights: number[][]) => {
        const R = heights.length, C = heights[0].length;
        const dist = Array.from({ length: R }, () => new Array(C).fill(Infinity));
        dist[0][0] = 0;
        const queue: [number, number, number][] = [[0, 0, 0]];
        const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        while (queue.length > 0) {
          queue.sort((a, b) => a[0] - b[0]);
          const [effort, r, c] = queue.shift()!;
          if (r === R - 1 && c === C - 1) return effort;
          if (effort > dist[r][c]) continue;
          for (const [dr, dc] of dirs) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < R && nc >= 0 && nc < C) {
              const nextEffort = Math.max(effort, Math.abs(heights[nr][nc] - heights[r][c]));
              if (nextEffort < dist[nr][nc]) {
                dist[nr][nc] = nextEffort;
                queue.push([nextEffort, nr, nc]);
              }
            }
          }
        }
        return dist[R - 1][C - 1];
      },
      testCases: {
        functional: [
          [[[1, 2, 2], [3, 8, 2], [5, 3, 5]]],
          [[[1, 2, 3], [3, 8, 4], [5, 3, 5]]],
          [[[1, 2, 1, 1, 1], [1, 2, 1, 2, 1], [1, 2, 1, 2, 1], [1, 2, 1, 2, 1], [1, 1, 1, 2, 1]]],
          [[[3]]]
        ],
        boundary: [
          [[[1, 1], [1, 1]]],
          [[[1, 1000000]]],
          [[[1], [5], [10]]]
        ],
        adversarial: [
          [[[7, 7, 7], [7, 1, 7], [7, 7, 7]]],
          [[[1, 10, 1], [1, 10, 1], [1, 1, 1]]],
          [[[4, 3, 2], [5, 4, 3], [6, 5, 4]]]
        ],
        stress: [
          [Array.from({ length: 30 }, (_, r) => Array.from({ length: 30 }, (_, c) => (r * c) % 50))],
          [Array.from({ length: 35 }, () => Array.from({ length: 35 }, () => 10))]
        ]
      }
    }),

    // 411. Minimum Cost to Make at Least One Valid Path in a Grid
    createProblem({
      num: 411,
      title: "Minimum Cost to Make at Least One Valid Path in a Grid",
      slug: "minimum-cost-to-make-at-least-one-valid-path-in-a-grid",
      level: 20,
      difficulty: "HARD",
      topic: "Shortest Paths & Advanced Graphs",
      patternSlug: "advanced-graphs",
      estimatedTimeMin: 30,
      statement: "Given an `m x n` grid. Each cell of the grid has a sign pointing to the next cell you should visit if you are currently in this cell. The sign of `grid[i][j]` can be:\n- 1 which means go to the cell to the right. (i.e go from grid[i][j] to grid[i][j + 1])\n- 2 which means go to the cell to the left. (i.e go from grid[i][j] to grid[i][j - 1])\n- 3 which means go to the lower cell. (i.e go from grid[i][j] to grid[i + 1][j])\n- 4 which means go to the upper cell. (i.e go from grid[i][j] to grid[i - 1][j])\n\nNotice that there could be some signs on the cells pointing to outside the grid.\n\nYou will initially start at the upper left cell `(0, 0)`. A valid path in the grid is a path which starts from the upper left cell and ends at the bottom-right cell `(m - 1, n - 1)` following the signs on the cells. The valid path does not have to be the shortest.\n\nYou can modify the sign on a cell with `cost = 1`. You can modify the sign on a cell one time only.\n\nReturn the minimum cost to make at least one valid path in the grid.",
      functionName: "minCost",
      parameters: [{ name: "grid", type: "number[][]", description: "m x n grid with direction signs 1, 2, 3, 4" }],
      returnType: "number",
      constraints: ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 100", "1 <= grid[i][j] <= 4"],
      examples: [
        { input: "grid = [[1,1,1,1],[2,2,2,2],[1,1,1,1],[2,2,2,2]]", output: "3", explanation: "Changing signs at (0,3), (1,0), (2,3) gives a valid path with cost 3." },
        { input: "grid = [[1,1,3],[3,2,2],[1,1,4]]", output: "0", explanation: "You can follow the arrows without changing any sign, cost 0." },
        { input: "grid = [[1,2],[4,3]]", output: "1", explanation: "Change grid[0][0] from 1 to 3, cost 1." },
        { input: "grid = [[2,2,2],[2,2,2],[2,2,2]]", output: "4", explanation: "4 turns needed to traverse downward to bottom right." }
      ],
      optimalSolution: `function minCost(grid) {\n  const m = grid.length, n = grid[0].length;\n  const dist = Array.from({ length: m }, () => new Array(n).fill(Infinity));\n  dist[0][0] = 0;\n  const deque = [[0, 0]];\n  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];\n  while (deque.length > 0) {\n    const [r, c] = deque.shift();\n    const d = dist[r][c];\n    if (r === m - 1 && c === n - 1) return d;\n    for (let i = 0; i < 4; i++) {\n      const [dr, dc] = dirs[i];\n      const nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nr < m && nc >= 0 && nc < n) {\n        const cost = grid[r][c] === i + 1 ? 0 : 1;\n        if (d + cost < dist[nr][nc]) {\n          dist[nr][nc] = d + cost;\n          if (cost === 0) deque.unshift([nr, nc]);\n          else deque.push([nr, nc]);\n        }\n      }\n    }\n  }\n  return dist[m - 1][n - 1];\n}`,
      optimalTimeComplexity: "O(m * n) with 0-1 BFS",
      optimalSpaceComplexity: "O(m * n)",
      suboptimalSolution: `function minCost(grid) {\n  const m = grid.length, n = grid[0].length;\n  const dist = Array.from({ length: m }, () => new Array(n).fill(Infinity));\n  dist[0][0] = 0;\n  const pq = [[0, 0, 0]];\n  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];\n  while (pq.length > 0) {\n    pq.sort((a, b) => a[0] - b[0]);\n    const [cost, r, c] = pq.shift();\n    if (cost > dist[r][c]) continue;\n    for (let i = 0; i < 4; i++) {\n      const [dr, dc] = dirs[i];\n      const nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nr < m && nc >= 0 && nc < n) {\n        const edgeCost = grid[r][c] === i + 1 ? 0 : 1;\n        if (cost + edgeCost < dist[nr][nc]) {\n          dist[nr][nc] = cost + edgeCost;\n          pq.push([dist[nr][nc], nr, nc]);\n        }\n      }\n    }\n  }\n  return dist[m - 1][n - 1];\n}`,
      suboptimalTimeComplexity: "O(m * n log(m * n))",
      suboptimalSpaceComplexity: "O(m * n)",
      commonMistakes: ["Using standard FIFO queue instead of 0-1 BFS deque or priority queue."],
      hints: [
        "Every edge has weight 0 (if moving in existing arrow direction) or 1 (if modifying arrow).",
        "0-1 BFS with unshift for weight 0 and push for weight 1 solves this in linear O(m * n) time."
      ],
      oracleFn: (grid: number[][]) => {
        const m = grid.length, n = grid[0].length;
        const dist = Array.from({ length: m }, () => new Array(n).fill(Infinity));
        dist[0][0] = 0;
        const deque: [number, number][] = [[0, 0]];
        const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        while (deque.length > 0) {
          const [r, c] = deque.shift()!;
          const d = dist[r][c];
          if (r === m - 1 && c === n - 1) return d;
          for (let i = 0; i < 4; i++) {
            const [dr, dc] = dirs[i];
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
              const cost = grid[r][c] === i + 1 ? 0 : 1;
              if (d + cost < dist[nr][nc]) {
                dist[nr][nc] = d + cost;
                if (cost === 0) deque.unshift([nr, nc]);
                else deque.push([nr, nc]);
              }
            }
          }
        }
        return dist[m - 1][n - 1];
      },
      testCases: {
        functional: [
          [[[1, 1, 1, 1], [2, 2, 2, 2], [1, 1, 1, 1], [2, 2, 2, 2]]],
          [[[1, 1, 3], [3, 2, 2], [1, 1, 4]]],
          [[[1, 2], [4, 3]]],
          [[[2, 2, 2], [2, 2, 2], [2, 2, 2]]]
        ],
        boundary: [
          [[[1]]],
          [[[1, 1]]],
          [[[3], [3]]]
        ],
        adversarial: [
          [[[4, 4, 4], [4, 4, 4], [4, 4, 4]]],
          [[[1, 3], [2, 2]]],
          [[[1, 1, 1], [3, 3, 3], [2, 2, 2]]]
        ],
        stress: [
          [Array.from({ length: 30 }, () => Array.from({ length: 30 }, () => 1))],
          [Array.from({ length: 35 }, (_, r) => Array.from({ length: 35 }, (_, c) => ((r + c) % 4) + 1))]
        ]
      }
    }),

    // 412. Reconstruct Itinerary
    createProblem({
      num: 412,
      title: "Reconstruct Itinerary",
      slug: "reconstruct-itinerary",
      level: 20,
      difficulty: "HARD",
      topic: "Shortest Paths & Advanced Graphs",
      patternSlug: "advanced-graphs",
      estimatedTimeMin: 30,
      statement: "You are given a list of airline `tickets` where `tickets[i] = [fromi, toi]` represent the departure and the arrival airports of one flight. Reconstruct the itinerary in order and return it.\n\nAll of the tickets belong to a man who departs from `\"JFK\"`, thus, the itinerary must begin with `\"JFK\"`. If there are multiple valid itineraries, you should return the itinerary that has the smallest lexical order when read as a single string.\n- For example, the itinerary [\"JFK\", \"LGA\"] has a smaller lexical order than [\"JFK\", \"LGB\"].\n\nYou may assume all tickets form at least one valid itinerary. You must use all the tickets once and only once.",
      functionName: "findItinerary",
      parameters: [{ name: "tickets", type: "string[][]", description: "Array of [from, to] flight tickets" }],
      returnType: "string[]",
      constraints: ["1 <= tickets.length <= 300", "tickets[i].length == 2", "fromi.length == 3", "toi.length == 3", "fromi and toi consist of uppercase English letters.", "fromi != toi"],
      examples: [
        { input: "tickets = [[\"MUC\",\"LHR\"],[\"JFK\",\"MUC\"],[\"SFO\",\"SJC\"],[\"LHR\",\"SFO\"]]", output: "[\"JFK\",\"MUC\",\"LHR\",\"SFO\",\"SJC\"]", explanation: "All tickets used sequentially in valid order." },
        { input: "tickets = [[\"JFK\",\"SFO\"],[\"JFK\",\"ATL\"],[\"SFO\",\"ATL\"],[\"ATL\",\"JFK\"],[\"ATL\",\"SFO\"]]", output: "[\"JFK\",\"ATL\",\"JFK\",\"SFO\",\"ATL\",\"SFO\"]", explanation: "Another possible reconstruction is [\"JFK\",\"SFO\",\"ATL\",\"JFK\",\"ATL\",\"SFO\"], but it is larger lexically." },
        { input: "tickets = [[\"JFK\",\"KUL\"],[\"JFK\",\"NRT\"],[\"NRT\",\"JFK\"]]", output: "[\"JFK\",\"NRT\",\"JFK\",\"KUL\"]", explanation: "Visiting NRT first prevents getting stuck at KUL early." },
        { input: "tickets = [[\"JFK\",\"AAA\"],[\"AAA\",\"JFK\"]]", output: "[\"JFK\",\"AAA\",\"JFK\"]", explanation: "Simple cycle." }
      ],
      optimalSolution: `function findItinerary(tickets) {\n  const adj = new Map();\n  for (const [from, to] of tickets) {\n    if (!adj.has(from)) adj.set(from, []);\n    adj.get(from).push(to);\n  }\n  for (const list of adj.values()) {\n    list.sort();\n  }\n  const route = [];\n  function dfs(airport) {\n    const dests = adj.get(airport);\n    while (dests && dests.length > 0) {\n      const nxt = dests.shift();\n      dfs(nxt);\n    }\n    route.push(airport);\n  }\n  dfs("JFK");\n  return route.reverse();\n}`,
      optimalTimeComplexity: "O(E log E) with Hierholzer's Algorithm",
      optimalSpaceComplexity: "O(V + E)",
      suboptimalSolution: `function findItinerary(tickets) {\n  tickets.sort((a, b) => a[1].localeCompare(b[1]));\n  const used = new Array(tickets.length).fill(false);\n  let res = null;\n  function backtrack(curr, path) {\n    if (path.length === tickets.length + 1) {\n      res = [...path];\n      return true;\n    }\n    for (let i = 0; i < tickets.length; i++) {\n      if (!used[i] && tickets[i][0] === curr) {\n        used[i] = true;\n        path.push(tickets[i][1]);\n        if (backtrack(tickets[i][1], path)) return true;\n        path.pop();\n        used[i] = false;\n      }\n    }\n    return false;\n  }\n  backtrack("JFK", ["JFK"]);\n  return res;\n}`,
      suboptimalTimeComplexity: "O(E!)",
      suboptimalSpaceComplexity: "O(E)",
      commonMistakes: ["Greedy DFS without post-order insertion (gets stuck in a dead-end before visiting sub-cycles)."],
      hints: [
        "This is finding an Eulerian path on a directed graph.",
        "Sort neighbor lists lexically, and use Hierholzer's post-order DFS to collect nodes, then reverse the result."
      ],
      oracleFn: (tickets: string[][]) => {
        const adj = new Map<string, string[]>();
        for (const [from, to] of tickets) {
          if (!adj.has(from)) adj.set(from, []);
          adj.get(from)!.push(to);
        }
        for (const list of adj.values()) {
          list.sort();
        }
        const route: string[] = [];
        const dfs = (airport: string) => {
          const dests = adj.get(airport);
          while (dests && dests.length > 0) {
            const nxt = dests.shift()!;
            dfs(nxt);
          }
          route.push(airport);
        };
        dfs("JFK");
        return route.reverse();
      },
      testCases: {
        functional: [
          [[["MUC", "LHR"], ["JFK", "MUC"], ["SFO", "SJC"], ["LHR", "SFO"]]],
          [[["JFK", "SFO"], ["JFK", "ATL"], ["SFO", "ATL"], ["ATL", "JFK"], ["ATL", "SFO"]]],
          [[["JFK", "KUL"], ["JFK", "NRT"], ["NRT", "JFK"]]],
          [[["JFK", "AAA"], ["AAA", "JFK"]]]
        ],
        boundary: [
          [[["JFK", "ORD"]]],
          [[["JFK", "A"], ["A", "B"], ["B", "JFK"]]],
          [[["JFK", "B"], ["B", "JFK"], ["JFK", "A"], ["A", "JFK"]]]
        ],
        adversarial: [
          [[["JFK", "ANU"], ["ANU", "JFK"], ["JFK", "EZE"]]],
          [[["JFK", "A"], ["A", "B"], ["B", "C"], ["C", "A"], ["A", "D"], ["D", "JFK"]]],
          [[["JFK", "KUL"], ["JFK", "NRT"], ["NRT", "JFK"], ["KUL", "BKK"], ["BKK", "JFK"]]]
        ],
        stress: [
          [[["JFK", "A"], ["A", "JFK"], ["JFK", "B"], ["B", "JFK"], ["JFK", "C"], ["C", "JFK"], ["JFK", "D"], ["D", "JFK"]]],
          [[["JFK", "Z"], ["Z", "Y"], ["Y", "X"], ["X", "W"], ["W", "V"], ["V", "U"]]]
        ]
      }
    }),

    // 413. Critical Connections in a Network
    createProblem({
      num: 413,
      title: "Critical Connections in a Network",
      slug: "critical-connections-in-a-network",
      level: 20,
      difficulty: "HARD",
      topic: "Shortest Paths & Advanced Graphs",
      patternSlug: "advanced-graphs",
      estimatedTimeMin: 35,
      statement: "There are `n` servers numbered from `0` to `n - 1` connected by undirected server-to-server `connections` forming a network where `connections[i] = [ai, bi]` represents a connection between servers `ai` and `bi`. Any server can reach other servers directly or indirectly through the network.\n\nA critical connection is a connection that, if removed, will make some servers unable to reach some other server.\n\nReturn all critical connections in the network in any order.",
      functionName: "criticalConnections",
      parameters: [
        { name: "n", type: "number", description: "Number of servers" },
        { name: "connections", type: "number[][]", description: "List of undirected connections [a, b]" }
      ],
      returnType: "number[][]",
      constraints: ["2 <= n <= 10^5", "n - 1 <= connections.length <= 10^5", "0 <= ai, bi <= n - 1", "ai != bi", "There are no repeated connections."],
      examples: [
        { input: "n = 4, connections = [[0,1],[1,2],[2,0],[1,3]]", output: "[[1,3]]", explanation: "[[3,1]] is also accepted. Removing [1,3] disconnects server 3." },
        { input: "n = 2, connections = [[0,1]]", output: "[[0,1]]", explanation: "Single connection is critical." },
        { input: "n = 3, connections = [[0,1],[1,2],[2,0]]", output: "[]", explanation: "Simple 3-cycle contains no bridges." },
        { input: "n = 5, connections = [[0,1],[1,2],[2,0],[1,3],[3,4]]", output: "[[1,3],[3,4]]", explanation: "Connections [1,3] and [3,4] are bridges." }
      ],
      optimalSolution: `function criticalConnections(n, connections) {\n  const adj = Array.from({ length: n }, () => []);\n  for (const [u, v] of connections) {\n    adj[u].push(v);\n    adj[v].push(u);\n  }\n  const tin = new Array(n).fill(-1);\n  const low = new Array(n).fill(-1);\n  let timer = 0;\n  const bridges = [];\n  function dfs(v, p) {\n    tin[v] = low[v] = timer++;\n    for (const to of adj[v]) {\n      if (to === p) continue;\n      if (tin[to] !== -1) {\n        low[v] = Math.min(low[v], tin[to]);\n      } else {\n        dfs(to, v);\n        low[v] = Math.min(low[v], low[to]);\n        if (low[to] > tin[v]) {\n          bridges.push(v < to ? [v, to] : [to, v]);\n        }\n      }\n    }\n  }\n  dfs(0, -1);\n  return bridges.sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]);\n}`,
      optimalTimeComplexity: "O(V + E) using Tarjan's Bridge-Finding Algorithm",
      optimalSpaceComplexity: "O(V + E)",
      suboptimalSolution: `function criticalConnections(n, connections) {\n  const adj = Array.from({ length: n }, () => []);\n  for (const [u, v] of connections) {\n    adj[u].push(v);\n    adj[v].push(u);\n  }\n  const tin = new Array(n).fill(-1);\n  const low = new Array(n).fill(-1);\n  let timer = 0;\n  const bridges = [];\n  function dfs(v, p) {\n    tin[v] = low[v] = timer++;\n    for (const to of adj[v]) {\n      if (to === p) continue;\n      if (tin[to] !== -1) {\n        low[v] = Math.min(low[v], tin[to]);\n      } else {\n        dfs(to, v);\n        low[v] = Math.min(low[v], low[to]);\n        if (low[to] > tin[v]) {\n          bridges.push(v < to ? [v, to] : [to, v]);\n        }\n      }\n    }\n  }\n  dfs(0, -1);\n  return bridges.sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]);\n}`,
      suboptimalTimeComplexity: "O(V + E)",
      suboptimalSpaceComplexity: "O(V + E)",
      commonMistakes: ["Trying O(E * (V + E)) by removing one edge at a time and running BFS (times out on 10^5 edges)."],
      hints: [
        "A critical connection is a bridge in an undirected graph.",
        "Use Tarjan's DFS algorithm tracking discovery time `tin[u]` and lowest reachable time `low[u]`.",
        "Edge (u, v) is a bridge if low[v] > tin[u]."
      ],
      oracleFn: (n: number, connections: number[][]) => {
        const adj = Array.from({ length: n }, () => [] as number[]);
        for (const [u, v] of connections) {
          adj[u].push(v);
          adj[v].push(u);
        }
        const tin = new Array(n).fill(-1);
        const low = new Array(n).fill(-1);
        let timer = 0;
        const bridges: number[][] = [];
        const dfs = (v: number, p: number) => {
          tin[v] = low[v] = timer++;
          for (const to of adj[v]) {
            if (to === p) continue;
            if (tin[to] !== -1) {
              low[v] = Math.min(low[v], tin[to]);
            } else {
              dfs(to, v);
              low[v] = Math.min(low[v], low[to]);
              if (low[to] > tin[v]) {
                bridges.push(v < to ? [v, to] : [to, v]);
              }
            }
          }
        };
        dfs(0, -1);
        return bridges.sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]);
      },
      testCases: {
        functional: [
          [4, [[0, 1], [1, 2], [2, 0], [1, 3]]],
          [2, [[0, 1]]],
          [3, [[0, 1], [1, 2], [2, 0]]],
          [5, [[0, 1], [1, 2], [2, 0], [1, 3], [3, 4]]]
        ],
        boundary: [
          [3, [[0, 1], [1, 2]]],
          [4, [[0, 1], [1, 2], [2, 3]]],
          [4, [[0, 1], [1, 2], [2, 3], [3, 0]]]
        ],
        adversarial: [
          [6, [[0, 1], [1, 2], [2, 0], [1, 3], [3, 4], [4, 5], [5, 3]]],
          [5, [[0, 1], [1, 2], [2, 3], [3, 4], [4, 2]]],
          [4, [[0, 1], [2, 3], [1, 2]]]
        ],
        stress: [
          [30, Array.from({ length: 29 }, (_, i) => [i, i + 1])],
          [50, [...Array.from({ length: 48 }, (_, i) => [i, i + 1]), [48, 0], [48, 49]]]
        ]
      }
    }),

    // 414. Path With Maximum Probability
    createProblem({
      num: 414,
      title: "Path With Maximum Probability",
      slug: "path-with-maximum-probability",
      level: 20,
      difficulty: "MEDIUM",
      topic: "Shortest Paths & Advanced Graphs",
      patternSlug: "advanced-graphs",
      estimatedTimeMin: 25,
      statement: "You are given an undirected weighted graph of `n` nodes (0-indexed), represented by an edge list where `edges[i] = [a, b]` is an undirected edge connecting the nodes `a` and `b` with a probability of success of traversing that edge `succProb[i]`.\n\nGiven two nodes `start_node` and `end_node`, find the path with the maximum probability of success to go from `start_node` to `end_node`.\n\nIf there is no path from `start_node` to `end_node`, return 0. Your answer will be accepted if it has an absolute error that does not exceed 1e-5.",
      functionName: "maxProbability",
      parameters: [
        { name: "n", type: "number", description: "Number of nodes" },
        { name: "edges", type: "number[][]", description: "List of undirected edges [a, b]" },
        { name: "succProb", type: "number[]", description: "Edge success probabilities" },
        { name: "start_node", type: "number", description: "Start node index" },
        { name: "end_node", type: "number", description: "End node index" }
      ],
      returnType: "number",
      constraints: ["2 <= n <= 10^4", "0 <= edges.length == succProb.length <= 2 * 10^4", "0 <= succProb[i] <= 1", "0 <= a, b < n", "0 <= start_node, end_node < n"],
      examples: [
        { input: "n = 3, edges = [[0,1],[1,2],[0,2]], succProb = [0.5,0.5,0.2], start_node = 0, end_node = 2", output: "0.25", explanation: "Path 0 -> 1 -> 2 has probability 0.5 * 0.5 = 0.25, which is greater than direct 0 -> 2 (0.2)." },
        { input: "n = 3, edges = [[0,1],[1,2],[0,2]], succProb = [0.5,0.5,0.3], start_node = 0, end_node = 2", output: "0.3", explanation: "Direct edge has probability 0.3." },
        { input: "n = 3, edges = [[0,1]], succProb = [0.5], start_node = 0, end_node = 2", output: "0", explanation: "Node 2 is unreachable." },
        { input: "n = 2, edges = [[0,1]], succProb = [1.0], start_node = 0, end_node = 1", output: "1", explanation: "Certain connection, probability 1.0." }
      ],
      optimalSolution: `function maxProbability(n, edges, succProb, start_node, end_node) {\n  const probs = new Array(n).fill(0);\n  probs[start_node] = 1.0;\n  for (let round = 0; round < n - 1; round++) {\n    let updated = false;\n    for (let i = 0; i < edges.length; i++) {\n      const [u, v] = edges[i];\n      const p = succProb[i];\n      if (probs[u] * p > probs[v]) {\n        probs[v] = probs[u] * p;\n        updated = true;\n      }\n      if (probs[v] * p > probs[u]) {\n        probs[u] = probs[v] * p;\n        updated = true;\n      }\n    }\n    if (!updated) break;\n  }\n  return probs[end_node];\n}`,
      optimalTimeComplexity: "O(E * V) with SPFA/Bellman-Ford or O(E log V) with Dijkstra",
      optimalSpaceComplexity: "O(V + E)",
      suboptimalSolution: `function maxProbability(n, edges, succProb, start_node, end_node) {\n  const adj = Array.from({ length: n }, () => []);\n  for (let i = 0; i < edges.length; i++) {\n    const [u, v] = edges[i];\n    adj[u].push([v, succProb[i]]);\n    adj[v].push([u, succProb[i]]);\n  }\n  const prob = new Array(n).fill(0);\n  prob[start_node] = 1;\n  const queue = [[start_node, 1]];\n  while (queue.length > 0) {\n    queue.sort((a, b) => b[1] - a[1]);\n    const [curr, p] = queue.shift();\n    if (p < prob[curr]) continue;\n    for (const [nxt, weight] of adj[curr]) {\n      if (prob[curr] * weight > prob[nxt]) {\n        prob[nxt] = prob[curr] * weight;\n        queue.push([nxt, prob[nxt]]);\n      }\n    }\n  }\n  return prob[end_node];\n}`,
      suboptimalTimeComplexity: "O(E log V)",
      suboptimalSpaceComplexity: "O(V + E)",
      commonMistakes: ["Trying to take sum of probabilities instead of multiplying them."],
      hints: [
        "Multiplying probabilities in [0, 1] is equivalent to minimizing -log(p).",
        "Use Dijkstra or Bellman-Ford updating prob[v] = max(prob[v], prob[u] * edge_prob)."
      ],
      oracleFn: (n: number, edges: number[][], succProb: number[], start_node: number, end_node: number) => {
        const probs = new Array(n).fill(0);
        probs[start_node] = 1.0;
        for (let round = 0; round < n - 1; round++) {
          let updated = false;
          for (let i = 0; i < edges.length; i++) {
            const [u, v] = edges[i];
            const p = succProb[i];
            if (probs[u] * p > probs[v]) {
              probs[v] = probs[u] * p;
              updated = true;
            }
            if (probs[v] * p > probs[u]) {
              probs[u] = probs[v] * p;
              updated = true;
            }
          }
          if (!updated) break;
        }
        return probs[end_node];
      },
      testCases: {
        functional: [
          [3, [[0, 1], [1, 2], [0, 2]], [0.5, 0.5, 0.2], 0, 2],
          [3, [[0, 1], [1, 2], [0, 2]], [0.5, 0.5, 0.3], 0, 2],
          [3, [[0, 1]], [0.5], 0, 2],
          [2, [[0, 1]], [1.0], 0, 1]
        ],
        boundary: [
          [2, [], [], 0, 1],
          [4, [[0, 1], [1, 2], [2, 3]], [0.1, 0.1, 0.1], 0, 3],
          [3, [[0, 1], [1, 2]], [0.8, 0.8], 0, 2]
        ],
        adversarial: [
          [5, [[1, 4], [2, 4], [0, 4], [0, 3], [0, 2], [2, 3]], [0.37, 0.17, 0.93, 0.23, 0.39, 0.04], 3, 4],
          [4, [[0, 1], [1, 2], [2, 3], [0, 3]], [0.9, 0.9, 0.9, 0.7], 0, 3],
          [3, [[0, 1], [0, 2]], [0.0, 0.0], 0, 2]
        ],
        stress: [
          [20, Array.from({ length: 19 }, (_, i) => [i, i + 1]), Array.from({ length: 19 }, () => 0.95), 0, 19],
          [25, Array.from({ length: 24 }, (_, i) => [i, i + 1]), Array.from({ length: 24 }, () => 1.0), 0, 24]
        ]
      }
    }),

    // 415. Find the City With the Smallest Number of Neighbors at a Threshold Distance
    createProblem({
      num: 415,
      title: "Find the City With the Smallest Number of Neighbors at a Threshold Distance",
      slug: "find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance",
      level: 20,
      difficulty: "MEDIUM",
      topic: "Shortest Paths & Advanced Graphs",
      patternSlug: "advanced-graphs",
      estimatedTimeMin: 25,
      statement: "There are `n` cities numbered from `0` to `n-1`. Given the array `edges` where `edges[i] = [fromi, toi, weighti]` represents a bidirectional and weighted edge between cities `fromi` and `toi`, and given the integer `distanceThreshold`.\n\nReturn the city with the smallest number of cities that are reachable through some path and whose distance is at most `distanceThreshold`, If there are multiple such cities, return the city with the greatest number.",
      functionName: "findTheCity",
      parameters: [
        { name: "n", type: "number", description: "Total number of cities" },
        { name: "edges", type: "number[][]", description: "Array of bidirectional edges [from, to, weight]" },
        { name: "distanceThreshold", type: "number", description: "Maximum travel distance threshold" }
      ],
      returnType: "number",
      constraints: ["2 <= n <= 100", "1 <= edges.length <= n * (n - 1) / 2", "edges[i].length == 3", "0 <= fromi < toi < n", "1 <= weighti, distanceThreshold <= 10^4", "All pairs (fromi, toi) are distinct."],
      examples: [
        { input: "n = 4, edges = [[0,1,3],[1,2,1],[1,3,4],[2,3,1]], distanceThreshold = 4", output: "3", explanation: "Cities reachable: city 0 -> {1,2}, city 1 -> {0,2,3}, city 2 -> {0,1,3}, city 3 -> {1,2}. Cities 0 and 3 have 2 reachable cities. Return 3 because it has greatest index." },
        { input: "n = 5, edges = [[0,1,2],[0,4,8],[1,2,3],[1,4,2],[2,3,1],[3,4,1]], distanceThreshold = 2", output: "0", explanation: "City 0 has 1 neighbor (1) within distance 2." },
        { input: "n = 2, edges = [[0,1,5]], distanceThreshold = 4", output: "1", explanation: "Distance 5 > threshold 4. Both have 0 reachable cities; greatest index is 1." },
        { input: "n = 3, edges = [[0,1,1],[1,2,1]], distanceThreshold = 2", output: "2", explanation: "All cities can reach each other, city 2 is max index." }
      ],
      optimalSolution: `function findTheCity(n, edges, distanceThreshold) {\n  const dist = Array.from({ length: n }, () => new Array(n).fill(Infinity));\n  for (let i = 0; i < n; i++) dist[i][i] = 0;\n  for (const [u, v, w] of edges) {\n    dist[u][v] = w;\n    dist[v][u] = w;\n  }\n  for (let k = 0; k < n; k++) {\n    for (let i = 0; i < n; i++) {\n      for (let j = 0; j < n; j++) {\n        if (dist[i][k] + dist[k][j] < dist[i][j]) {\n          dist[i][j] = dist[i][k] + dist[k][j];\n        }\n      }\n    }\n  }\n  let minCount = Infinity, bestCity = -1;\n  for (let i = 0; i < n; i++) {\n    let count = 0;\n    for (let j = 0; j < n; j++) {\n      if (i !== j && dist[i][j] <= distanceThreshold) count++;\n    }\n    if (count <= minCount) {\n      minCount = count;\n      bestCity = i;\n    }\n  }\n  return bestCity;\n}`,
      optimalTimeComplexity: "O(N^3) with Floyd-Warshall",
      optimalSpaceComplexity: "O(N^2)",
      suboptimalSolution: `function findTheCity(n, edges, distanceThreshold) {\n  const adj = Array.from({ length: n }, () => []);\n  for (const [u, v, w] of edges) {\n    adj[u].push([v, w]);\n    adj[v].push([u, w]);\n  }\n  let minCount = Infinity, res = -1;\n  for (let i = 0; i < n; i++) {\n    const dist = new Array(n).fill(Infinity);\n    dist[i] = 0;\n    const q = [[i, 0]];\n    while (q.length > 0) {\n      q.sort((a, b) => a[1] - b[1]);\n      const [u, d] = q.shift();\n      if (d > dist[u]) continue;\n      for (const [v, w] of adj[u]) {\n        if (dist[u] + w < dist[v]) {\n          dist[v] = dist[u] + w;\n          q.push([v, dist[v]]);\n        }\n      }\n    }\n    const reachable = dist.filter((d, idx) => idx !== i && d <= distanceThreshold).length;\n    if (reachable <= minCount) {\n      minCount = reachable;\n      res = i;\n    }\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N * E log V)",
      suboptimalSpaceComplexity: "O(V + E)",
      commonMistakes: ["When counts are equal, returning the smaller index instead of the greatest number."],
      hints: [
        "All-pairs shortest paths using Floyd-Warshall runs in O(N^3) where N <= 100.",
        "Count how many cities j have dist[i][j] <= distanceThreshold; break ties by picking larger i."
      ],
      oracleFn: (n: number, edges: number[][], distanceThreshold: number) => {
        const dist = Array.from({ length: n }, () => new Array(n).fill(Infinity));
        for (let i = 0; i < n; i++) dist[i][i] = 0;
        for (const [u, v, w] of edges) {
          dist[u][v] = w;
          dist[v][u] = w;
        }
        for (let k = 0; k < n; k++) {
          for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
              if (dist[i][k] + dist[k][j] < dist[i][j]) {
                dist[i][j] = dist[i][k] + dist[k][j];
              }
            }
          }
        }
        let minCount = Infinity, bestCity = -1;
        for (let i = 0; i < n; i++) {
          let count = 0;
          for (let j = 0; j < n; j++) {
            if (i !== j && dist[i][j] <= distanceThreshold) count++;
          }
          if (count <= minCount) {
            minCount = count;
            bestCity = i;
          }
        }
        return bestCity;
      },
      testCases: {
        functional: [
          [4, [[0, 1, 3], [1, 2, 1], [1, 3, 4], [2, 3, 1]], 4],
          [5, [[0, 1, 2], [0, 4, 8], [1, 2, 3], [1, 4, 2], [2, 3, 1], [3, 4, 1]], 2],
          [2, [[0, 1, 5]], 4],
          [3, [[0, 1, 1], [1, 2, 1]], 2]
        ],
        boundary: [
          [2, [[0, 1, 1]], 1],
          [3, [[0, 1, 10], [1, 2, 10]], 5],
          [4, [], 10]
        ],
        adversarial: [
          [6, [[0, 1, 10], [1, 2, 10], [2, 3, 10], [3, 4, 10], [4, 5, 10]], 20],
          [4, [[0, 1, 1], [1, 2, 1], [2, 3, 1], [3, 0, 1]], 2],
          [5, [[0, 1, 1], [2, 3, 1]], 1]
        ],
        stress: [
          [20, Array.from({ length: 19 }, (_, i) => [i, i + 1, (i * 2) % 5 + 1]), 10],
          [25, Array.from({ length: 24 }, (_, i) => [i, i + 1, 1]), 5]
        ]
      }
    }),

    // 416. Number of Ways to Arrive at Destination
    createProblem({
      num: 416,
      title: "Number of Ways to Arrive at Destination",
      slug: "number-of-ways-to-arrive-at-destination",
      level: 20,
      difficulty: "MEDIUM",
      topic: "Shortest Paths & Advanced Graphs",
      patternSlug: "advanced-graphs",
      estimatedTimeMin: 25,
      statement: "You are in a city that consists of `n` intersections numbered from `0` to `n - 1` with bi-directional roads between some intersections. The inputs are generated such that you can reach any intersection from any other intersection in that city and there is at most one road between any two intersections.\n\nYou are given an integer `n` and a 2D integer array `roads` where `roads[i] = [ui, vi, timei]` means that there is a bidirectional road between intersections `ui` and `vi` that takes `timei` minutes to travel.\n\nReturn the number of ways you can arrive at your destination `n - 1` in the shortest amount of time. Since the answer may be large, return it modulo `10^9 + 7`.",
      functionName: "countPaths",
      parameters: [
        { name: "n", type: "number", description: "Number of intersections" },
        { name: "roads", type: "number[][]", description: "Bidirectional roads [u, v, time]" }
      ],
      returnType: "number",
      constraints: ["1 <= n <= 200", "n - 1 <= roads.length <= n * (n - 1) / 2", "roads[i].length == 3", "0 <= ui, vi <= n - 1", "1 <= timei <= 10^9", "ui != vi"],
      examples: [
        { input: "n = 7, roads = [[0,6,7],[0,1,2],[1,2,3],[1,3,3],[6,3,3],[3,5,1],[6,5,1],[2,5,1],[0,4,5],[4,6,2]]", output: "4", explanation: "Shortest time to node 6 is 7 minutes. 4 paths take 7 minutes: 0->6, 0->4->6, 0->1->2->5->6, 0->1->3->5->6." },
        { input: "n = 2, roads = [[1,0,10]]", output: "1", explanation: "Only one direct road, 1 way." },
        { input: "n = 3, roads = [[0,1,1],[1,2,1],[0,2,2]]", output: "2", explanation: "Two shortest paths of time 2: 0->2 and 0->1->2." },
        { input: "n = 4, roads = [[0,1,1],[1,3,1],[0,2,1],[2,3,1]]", output: "2", explanation: "Two symmetric paths of time 2." }
      ],
      optimalSolution: `function countPaths(n, roads) {\n  const MOD = 1000000007;\n  const adj = Array.from({ length: n }, () => []);\n  for (const [u, v, t] of roads) {\n    adj[u].push([v, t]);\n    adj[v].push([u, t]);\n  }\n  const dist = new Array(n).fill(Infinity);\n  const ways = new Array(n).fill(0);\n  dist[0] = 0;\n  ways[0] = 1;\n  const queue = [[0, 0]];\n  while (queue.length > 0) {\n    queue.sort((a, b) => a[1] - b[1]);\n    const [curr, d] = queue.shift();\n    if (d > dist[curr]) continue;\n    for (const [nxt, t] of adj[curr]) {\n      if (d + t < dist[nxt]) {\n        dist[nxt] = d + t;\n        ways[nxt] = ways[curr];\n        queue.push([nxt, dist[nxt]]);\n      } else if (d + t === dist[nxt]) {\n        ways[nxt] = (ways[nxt] + ways[curr]) % MOD;\n      }\n    }\n  }\n  return ways[n - 1];\n}`,
      optimalTimeComplexity: "O(E log V)",
      optimalSpaceComplexity: "O(V + E)",
      suboptimalSolution: `function countPaths(n, roads) {\n  const MOD = 1e9 + 7;\n  const adj = Array.from({ length: n }, () => []);\n  for (const [u, v, t] of roads) {\n    adj[u].push([v, t]);\n    adj[v].push([u, t]);\n  }\n  const dist = new Array(n).fill(Infinity);\n  const ways = new Array(n).fill(0);\n  dist[0] = 0;\n  ways[0] = 1;\n  const visited = new Set();\n  for (let i = 0; i < n; i++) {\n    let u = -1;\n    for (let j = 0; j < n; j++) {\n      if (!visited.has(j) && (u === -1 || dist[j] < dist[u])) u = j;\n    }\n    if (dist[u] === Infinity) break;\n    visited.add(u);\n    for (const [v, t] of adj[u]) {\n      if (dist[u] + t < dist[v]) {\n        dist[v] = dist[u] + t;\n        ways[v] = ways[u];\n      } else if (dist[u] + t === dist[v]) {\n        ways[v] = (ways[v] + ways[u]) % MOD;\n      }\n    }\n  }\n  return ways[n - 1];\n}`,
      suboptimalTimeComplexity: "O(V^2)",
      suboptimalSpaceComplexity: "O(V + E)",
      commonMistakes: ["Resetting ways[nxt] = 1 instead of ways[nxt] = ways[curr] when a strictly shorter distance is found."],
      hints: [
        "Augment Dijkstra: maintain both dist[u] (shortest time) and ways[u] (number of shortest paths).",
        "If dist[u] + t < dist[nxt]: update dist[nxt] and set ways[nxt] = ways[curr].",
        "If dist[u] + t == dist[nxt]: accumulate ways[nxt] = (ways[nxt] + ways[curr]) % MOD."
      ],
      oracleFn: (n: number, roads: number[][]) => {
        const MOD = 1000000007;
        const adj = Array.from({ length: n }, () => [] as [number, number][]);
        for (const [u, v, t] of roads) {
          adj[u].push([v, t]);
          adj[v].push([u, t]);
        }
        const dist = new Array(n).fill(Infinity);
        const ways = new Array(n).fill(0);
        dist[0] = 0;
        ways[0] = 1;
        const queue: [number, number][] = [[0, 0]];
        while (queue.length > 0) {
          queue.sort((a, b) => a[1] - b[1]);
          const [curr, d] = queue.shift()!;
          if (d > dist[curr]) continue;
          for (const [nxt, t] of adj[curr]) {
            if (d + t < dist[nxt]) {
              dist[nxt] = d + t;
              ways[nxt] = ways[curr];
              queue.push([nxt, dist[nxt]]);
            } else if (d + t === dist[nxt]) {
              ways[nxt] = (ways[nxt] + ways[curr]) % MOD;
            }
          }
        }
        return ways[n - 1];
      },
      testCases: {
        functional: [
          [7, [[0, 6, 7], [0, 1, 2], [1, 2, 3], [1, 3, 3], [6, 3, 3], [3, 5, 1], [6, 5, 1], [2, 5, 1], [0, 4, 5], [4, 6, 2]]],
          [2, [[1, 0, 10]]],
          [3, [[0, 1, 1], [1, 2, 1], [0, 2, 2]]],
          [4, [[0, 1, 1], [1, 3, 1], [0, 2, 1], [2, 3, 1]]]
        ],
        boundary: [
          [1, []],
          [3, [[0, 1, 5], [1, 2, 5]]],
          [4, [[0, 1, 2], [1, 2, 2], [2, 3, 2], [0, 3, 6]]]
        ],
        adversarial: [
          [5, [[0, 1, 1], [1, 2, 1], [2, 3, 1], [3, 4, 1], [0, 2, 2], [1, 3, 2], [2, 4, 2]]],
          [4, [[0, 1, 100], [1, 2, 100], [2, 3, 100], [0, 3, 300]]],
          [5, [[0, 1, 1], [0, 2, 1], [0, 3, 1], [1, 4, 2], [2, 4, 2], [3, 4, 2]]]
        ],
        stress: [
          [20, Array.from({ length: 19 }, (_, i) => [i, i + 1, 1])],
          [30, [...Array.from({ length: 29 }, (_, i) => [i, i + 1, 1]), [0, 29, 29]]]
        ]
      }
    }),

    // 417. Second Minimum Time to Reach Destination
    createProblem({
      num: 417,
      title: "Second Minimum Time to Reach Destination",
      slug: "second-minimum-time-to-reach-destination",
      level: 20,
      difficulty: "HARD",
      topic: "Shortest Paths & Advanced Graphs",
      patternSlug: "advanced-graphs",
      estimatedTimeMin: 35,
      statement: "A city is represented as a bi-directional connected graph with `n` vertices where each vertex is labeled from `1` to `n` (1-indexed). The edges in the graph are represented as a 2D integer array `edges`, where each `edges[i] = [ui, vi]` denotes a bi-directional edge between vertex `ui` and vertex `vi`. Every vertex pair is connected by at most one edge, and no vertex has an edge to itself. The time taken to traverse any edge is `time` minutes.\n\nEach vertex has a traffic signal which changes its color from green to red and vice versa every `change` minutes. All signals change at the same time. You can enter a vertex at any time, but can leave a vertex only when the signal is green. You cannot wait at a vertex if the signal is green.\n\nThe second minimum value is defined as the smallest value strictly larger than the minimum value.\n\nReturn the second minimum time it takes to go from vertex 1 to vertex n.",
      functionName: "secondMinimum",
      parameters: [
        { name: "n", type: "number", description: "Number of vertices (1-indexed)" },
        { name: "edges", type: "number[][]", description: "List of undirected edges [u, v]" },
        { name: "time", type: "number", description: "Traverse time across any edge" },
        { name: "change", type: "number", description: "Traffic signal cycle duration" }
      ],
      returnType: "number",
      constraints: ["2 <= n <= 10^4", "n - 1 <= edges.length <= min(2 * 10^4, n * (n - 1) / 2)", "edges[i].length == 2", "1 <= ui, vi <= n", "ui != vi", "1 <= time, change <= 1000"],
      examples: [
        { input: "n = 5, edges = [[1,2],[1,3],[1,4],[3,4],[4,5]], time = 3, change = 5", output: "13", explanation: "Shortest path 1 -> 4 -> 5 takes 2 steps (time 11). Second shortest path 1 -> 3 -> 4 -> 5 takes 3 steps (time 13)." },
        { input: "n = 2, edges = [[1,2]], time = 3, change = 2", output: "11", explanation: "Shortest path is 1 -> 2 (1 step). Second shortest path traverses 1 -> 2 -> 1 -> 2 (3 steps), taking 11 minutes accounting for red lights." },
        { input: "n = 3, edges = [[1,2],[2,3],[1,3]], time = 2, change = 3", output: "8", explanation: "Shortest path takes 1 step (2 min), second takes 2 steps (8 min)." },
        { input: "n = 4, edges = [[1,2],[2,4],[1,3],[3,4]], time = 1, change = 2", output: "5", explanation: "Second shortest path takes 5 minutes." }
      ],
      optimalSolution: `function secondMinimum(n, edges, time, change) {\n  const adj = Array.from({ length: n + 1 }, () => []);\n  for (const [u, v] of edges) {\n    adj[u].push(v);\n    adj[v].push(u);\n  }\n  const dist1 = new Array(n + 1).fill(Infinity);\n  const dist2 = new Array(n + 1).fill(Infinity);\n  dist1[1] = 0;\n  const queue = [[1, 0]];\n  while (queue.length > 0) {\n    const [u, d] = queue.shift();\n    let curTime = d;\n    const cycle = Math.floor(curTime / change);\n    if (cycle % 2 === 1) {\n      curTime = (cycle + 1) * change;\n    }\n    const nextTime = curTime + time;\n    for (const v of adj[u]) {\n      if (nextTime < dist1[v]) {\n        dist2[v] = dist1[v];\n        dist1[v] = nextTime;\n        queue.push([v, nextTime]);\n      } else if (nextTime > dist1[v] && nextTime < dist2[v]) {\n        dist2[v] = nextTime;\n        queue.push([v, nextTime]);\n      }\n    }\n  }\n  return dist2[n];\n}`,
      optimalTimeComplexity: "O(V + E) using BFS tracking first and second shortest arrival times",
      optimalSpaceComplexity: "O(V + E)",
      suboptimalSolution: `function secondMinimum(n, edges, time, change) {\n  const adj = Array.from({ length: n + 1 }, () => []);\n  for (const [u, v] of edges) {\n    adj[u].push(v);\n    adj[v].push(u);\n  }\n  const dist1 = new Array(n + 1).fill(Infinity);\n  const dist2 = new Array(n + 1).fill(Infinity);\n  dist1[1] = 0;\n  const q = [[1, 0]];\n  while (q.length > 0) {\n    const [u, d] = q.shift();\n    let t = d;\n    if (Math.floor(t / change) % 2 === 1) t = (Math.floor(t / change) + 1) * change;\n    t += time;\n    for (const v of adj[u]) {\n      if (t < dist1[v]) {\n        dist2[v] = dist1[v];\n        dist1[v] = t;\n        q.push([v, t]);\n      } else if (t > dist1[v] && t < dist2[v]) {\n        dist2[v] = t;\n        q.push([v, t]);\n      }\n    }\n  }\n  return dist2[n];\n}`,
      suboptimalTimeComplexity: "O(V + E)",
      suboptimalSpaceComplexity: "O(V + E)",
      commonMistakes: ["Forgetting that an edge can be traversed back and forth to add 2 steps (e.g. 1 -> 2 -> 1 -> 2).", "Calculating red light wait improperly: cycle = floor(curTime / change); if cycle % 2 == 1, wait until (cycle + 1) * change."],
      hints: [
        "Track two shortest arrival times dist1[u] and dist2[u] for each vertex.",
        "When arriving at u at time d: if (d // change) % 2 == 1 (red light), wait until (d // change + 1) * change before departing."
      ],
      oracleFn: (n: number, edges: number[][], time: number, change: number) => {
        const adj = Array.from({ length: n + 1 }, () => [] as number[]);
        for (const [u, v] of edges) {
          adj[u].push(v);
          adj[v].push(u);
        }
        const dist1 = new Array(n + 1).fill(Infinity);
        const dist2 = new Array(n + 1).fill(Infinity);
        dist1[1] = 0;
        const queue: [number, number][] = [[1, 0]];
        while (queue.length > 0) {
          const [u, d] = queue.shift()!;
          let curTime = d;
          const cycle = Math.floor(curTime / change);
          if (cycle % 2 === 1) {
            curTime = (cycle + 1) * change;
          }
          const nextTime = curTime + time;
          for (const v of adj[u]) {
            if (nextTime < dist1[v]) {
              dist2[v] = dist1[v];
              dist1[v] = nextTime;
              queue.push([v, nextTime]);
            } else if (nextTime > dist1[v] && nextTime < dist2[v]) {
              dist2[v] = nextTime;
              queue.push([v, nextTime]);
            }
          }
        }
        return dist2[n];
      },
      testCases: {
        functional: [
          [5, [[1, 2], [1, 3], [1, 4], [3, 4], [4, 5]], 3, 5],
          [2, [[1, 2]], 3, 2],
          [3, [[1, 2], [2, 3], [1, 3]], 2, 3],
          [4, [[1, 2], [2, 4], [1, 3], [3, 4]], 1, 2]
        ],
        boundary: [
          [2, [[1, 2]], 1, 1],
          [3, [[1, 2], [2, 3]], 1, 2],
          [4, [[1, 2], [2, 3], [3, 4]], 2, 3]
        ],
        adversarial: [
          [5, [[1, 2], [2, 3], [3, 5], [1, 4], [4, 5]], 5, 5],
          [6, [[1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [1, 6]], 3, 4],
          [3, [[1, 2], [2, 3], [3, 1]], 5, 2]
        ],
        stress: [
          [20, Array.from({ length: 19 }, (_, i) => [i + 1, i + 2]), 2, 3],
          [30, [...Array.from({ length: 29 }, (_, i) => [i + 1, i + 2]), [1, 30]], 4, 5]
        ]
      }
    }),

    // 418. Shortest Path Visiting All Nodes
    createProblem({
      num: 418,
      title: "Shortest Path Visiting All Nodes",
      slug: "shortest-path-visiting-all-nodes",
      level: 20,
      difficulty: "HARD",
      topic: "Shortest Paths & Advanced Graphs",
      patternSlug: "advanced-graphs",
      estimatedTimeMin: 30,
      statement: "You have an undirected, connected graph of `n` nodes labeled from `0` to `n - 1`. You are given an array `graph` where `graph[i]` is a list of all the nodes connected with node `i` by an edge.\n\nReturn the length of the shortest path that visits every node. You may start and stop at any node, you may revisit nodes multiple times, and you may reuse edges.",
      functionName: "shortestPathLength",
      parameters: [{ name: "graph", type: "number[][]", description: "Adjacency list of the graph" }],
      returnType: "number",
      constraints: ["n == graph.length", "1 <= n <= 12", "0 <= graph[i].length < n", "graph[i] does not contain i", "graph[i] contains distinct nodes."],
      examples: [
        { input: "graph = [[1,2,3],[0],[0],[0]]", output: "4", explanation: "One possible path is [1,0,2,0,3], length 4." },
        { input: "graph = [[1],[0,2,4],[1,3,4],[2],[1,2]]", output: "4", explanation: "One possible path is [0,1,4,2,3], length 4." },
        { input: "graph = [[]]", output: "0", explanation: "Single node path has length 0." },
        { input: "graph = [[1],[0]]", output: "1", explanation: "Single edge [0, 1] visits both nodes in 1 step." }
      ],
      optimalSolution: `function shortestPathLength(graph) {\n  const n = graph.length;\n  if (n <= 1) return 0;\n  const targetMask = (1 << n) - 1;\n  const queue = [];\n  const visited = Array.from({ length: n }, () => new Array(1 << n).fill(false));\n  for (let i = 0; i < n; i++) {\n    queue.push([i, 1 << i, 0]);\n    visited[i][1 << i] = true;\n  }\n  while (queue.length > 0) {\n    const [node, mask, dist] = queue.shift();\n    if (mask === targetMask) return dist;\n    for (const neighbor of graph[node]) {\n      const nextMask = mask | (1 << neighbor);\n      if (!visited[neighbor][nextMask]) {\n        visited[neighbor][nextMask] = true;\n        queue.push([neighbor, nextMask, dist + 1]);\n      }\n    }\n  }\n  return -1;\n}`,
      optimalTimeComplexity: "O(N^2 * 2^N) with Multi-Source BFS on (node, mask)",
      optimalSpaceComplexity: "O(N * 2^N)",
      suboptimalSolution: `function shortestPathLength(graph) {\n  const n = graph.length;\n  if (n <= 1) return 0;\n  const target = (1 << n) - 1;\n  const q = [];\n  const seen = new Set();\n  for (let i = 0; i < n; i++) {\n    q.push([i, 1 << i, 0]);\n    seen.add(i + ',' + (1 << i));\n  }\n  while (q.length > 0) {\n    const [u, mask, steps] = q.shift();\n    if (mask === target) return steps;\n    for (const v of graph[u]) {\n      const nxtMask = mask | (1 << v);\n      const key = v + ',' + nxtMask;\n      if (!seen.has(key)) {\n        seen.add(key);\n        q.push([v, nxtMask, steps + 1]);\n      }\n    }\n  }\n  return 0;\n}`,
      suboptimalTimeComplexity: "O(N^2 * 2^N)",
      suboptimalSpaceComplexity: "O(N * 2^N)",
      commonMistakes: ["Starting BFS from node 0 only instead of multi-source BFS starting from all nodes simultaneously."],
      hints: [
        "State representation: (current_node, visited_nodes_mask).",
        "Multi-source BFS from every node with mask (1 << node) guarantees the shortest path is found first."
      ],
      oracleFn: (graph: number[][]) => {
        const n = graph.length;
        if (n <= 1) return 0;
        const targetMask = (1 << n) - 1;
        const queue: [number, number, number][] = [];
        const visited = Array.from({ length: n }, () => new Array(1 << n).fill(false));
        for (let i = 0; i < n; i++) {
          queue.push([i, 1 << i, 0]);
          visited[i][1 << i] = true;
        }
        while (queue.length > 0) {
          const [node, mask, dist] = queue.shift()!;
          if (mask === targetMask) return dist;
          for (const neighbor of graph[node]) {
            const nextMask = mask | (1 << neighbor);
            if (!visited[neighbor][nextMask]) {
              visited[neighbor][nextMask] = true;
              queue.push([neighbor, nextMask, dist + 1]);
            }
          }
        }
        return -1;
      },
      testCases: {
        functional: [
          [[[1, 2, 3], [0], [0], [0]]],
          [[[1], [0, 2, 4], [1, 3, 4], [2], [1, 2]]],
          [[[]]],
          [[[1], [0]]]
        ],
        boundary: [
          [[[1, 2], [0, 2], [0, 1]]],
          [[[1], [0, 2], [1]]],
          [[[1, 3], [0, 2], [1, 3], [0, 2]]]
        ],
        adversarial: [
          [[[2, 3], [2], [0, 1], [0, 4], [3]]],
          [[[1, 4], [0, 2], [1, 3], [2, 4], [0, 3]]],
          [[[1, 2, 3, 4], [0], [0], [0], [0]]]
        ],
        stress: [
          [[[1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 7], [6, 8], [7, 9], [8]]],
          [[[1, 9], [0, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 7], [6, 8], [7, 9], [8, 0]]]
        ]
      }
    }),

    // 419. Bus Routes
    createProblem({
      num: 419,
      title: "Bus Routes",
      slug: "bus-routes",
      level: 20,
      difficulty: "HARD",
      topic: "Shortest Paths & Advanced Graphs",
      patternSlug: "advanced-graphs",
      estimatedTimeMin: 30,
      statement: "You are given an array `routes` representing bus routes where `routes[i]` is a bus route that the `i-th` bus repeats forever.\n\nFor example, if `routes[0] = [1, 5, 7]`, this means that the 0th bus travels in the sequence 1 -> 5 -> 7 -> 1 -> 5 -> 7 -> 1 -> ... forever.\n\nYou will start at the bus stop `source` (You are not on any bus initially), and you want to go to the bus stop `target`. You can travel between bus stops by buses only.\n\nReturn the least number of buses you must take to travel from `source` to `target`. Return `-1` if it is not possible.",
      functionName: "numBusesToDestination",
      parameters: [
        { name: "routes", type: "number[][]", description: "Array of circular bus routes" },
        { name: "source", type: "number", description: "Starting bus stop" },
        { name: "target", type: "number", description: "Destination bus stop" }
      ],
      returnType: "number",
      constraints: ["1 <= routes.length <= 500", "1 <= routes[i].length <= 10^5", "All values of routes[i] are unique.", "sum(routes[i].length) <= 10^5", "0 <= routes[i][j] < 10^6", "0 <= source, target < 10^6"],
      examples: [
        { input: "routes = [[1,2,7],[3,6,7]], source = 1, target = 6", output: "2", explanation: "Take bus 0 from stop 1 to 7, then take bus 1 from stop 7 to 6. Total 2 buses." },
        { input: "routes = [[7,12],[4,5,15],[6],[15,19],[9,12,13]], source = 15, target = 12", output: "-1", explanation: "Target stop 12 is unreachable from stop 15." },
        { input: "routes = [[1,2,3]], source = 1, target = 1", output: "0", explanation: "Already at destination, 0 buses needed." },
        { input: "routes = [[1,2,3],[3,4,5]], source = 1, target = 5", output: "2", explanation: "Bus 0 then bus 1." }
      ],
      optimalSolution: `function numBusesToDestination(routes, source, target) {\n  if (source === target) return 0;\n  const stopToRoutes = new Map();\n  for (let r = 0; r < routes.length; r++) {\n    for (const stop of routes[r]) {\n      if (!stopToRoutes.has(stop)) stopToRoutes.set(stop, []);\n      stopToRoutes.get(stop).push(r);\n    }\n  }\n  if (!stopToRoutes.has(source) || !stopToRoutes.has(target)) return -1;\n  const visitedRoutes = new Set();\n  const visitedStops = new Set([source]);\n  const queue = [[source, 0]];\n  while (queue.length > 0) {\n    const [stop, buses] = queue.shift();\n    if (stop === target) return buses;\n    const routeList = stopToRoutes.get(stop) || [];\n    for (const r of routeList) {\n      if (visitedRoutes.has(r)) continue;\n      visitedRoutes.add(r);\n      for (const nextStop of routes[r]) {\n        if (!visitedStops.has(nextStop)) {\n          visitedStops.add(nextStop);\n          queue.push([nextStop, buses + 1]);\n        }\n      }\n    }\n  }\n  return -1;\n}`,
      optimalTimeComplexity: "O(sum(routes[i].length))",
      optimalSpaceComplexity: "O(sum(routes[i].length))",
      suboptimalSolution: `function numBusesToDestination(routes, source, target) {\n  if (source === target) return 0;\n  const n = routes.length;\n  const adj = Array.from({ length: n }, () => []);\n  const routeSets = routes.map(r => new Set(r));\n  for (let i = 0; i < n; i++) {\n    for (let j = i + 1; j < n; j++) {\n      for (const stop of routes[i]) {\n        if (routeSets[j].has(stop)) { adj[i].push(j); adj[j].push(i); break; }\n      }\n    }\n  }\n  const queue = [];\n  const visited = new Set();\n  for (let i = 0; i < n; i++) {\n    if (routeSets[i].has(source)) { queue.push([i, 1]); visited.add(i); }\n  }\n  while (queue.length > 0) {\n    const [r, cnt] = queue.shift();\n    if (routeSets[r].has(target)) return cnt;\n    for (const nextR of adj[r]) {\n      if (!visited.has(nextR)) {\n        visited.add(nextR);\n        queue.push([nextR, cnt + 1]);\n      }\n    }\n  }\n  return -1;\n}`,
      suboptimalTimeComplexity: "O(N^2 * L)",
      suboptimalSpaceComplexity: "O(N^2)",
      commonMistakes: ["Re-visiting all stops along a previously explored bus route, causing exponential slowdown.", "Not returning 0 immediately when source === target."],
      hints: [
        "Map each stop to the list of bus routes that pass through it.",
        "Perform BFS on the routes: when a route is visited once, mark it visited so its stops are never re-enqueued."
      ],
      oracleFn: (routes: number[][], source: number, target: number) => {
        if (source === target) return 0;
        const stopToRoutes = new Map<number, number[]>();
        for (let r = 0; r < routes.length; r++) {
          for (const stop of routes[r]) {
            if (!stopToRoutes.has(stop)) stopToRoutes.set(stop, []);
            stopToRoutes.get(stop)!.push(r);
          }
        }
        if (!stopToRoutes.has(source) || !stopToRoutes.has(target)) return -1;
        const visitedRoutes = new Set<number>();
        const visitedStops = new Set<number>([source]);
        const queue: [number, number][] = [[source, 0]];
        while (queue.length > 0) {
          const [stop, buses] = queue.shift()!;
          if (stop === target) return buses;
          const routeList = stopToRoutes.get(stop) || [];
          for (const r of routeList) {
            if (visitedRoutes.has(r)) continue;
            visitedRoutes.add(r);
            for (const nextStop of routes[r]) {
              if (!visitedStops.has(nextStop)) {
                visitedStops.add(nextStop);
                queue.push([nextStop, buses + 1]);
              }
            }
          }
        }
        return -1;
      },
      testCases: {
        functional: [
          [[[1, 2, 7], [3, 6, 7]], 1, 6],
          [[[7, 12], [4, 5, 15], [6], [15, 19], [9, 12, 13]], 15, 12],
          [[[1, 2, 3]], 1, 1],
          [[[1, 2, 3], [3, 4, 5]], 1, 5]
        ],
        boundary: [
          [[[1, 2]], 1, 2],
          [[[1, 2]], 1, 3],
          [[[1, 2], [3, 4]], 1, 4]
        ],
        adversarial: [
          [[[1, 9, 12, 20, 23, 24, 35, 38], [10, 21, 24, 31, 32, 34, 37, 38, 43], [10, 19, 40], [1, 3, 4, 8, 17, 18]], 1, 43],
          [[[1, 7], [3, 5]], 1, 3],
          [[[1, 2], [2, 3], [3, 4], [4, 5], [5, 6]], 1, 6]
        ],
        stress: [
          [Array.from({ length: 40 }, (_, i) => [i, i + 1]), 0, 40],
          [Array.from({ length: 50 }, (_, i) => [i, 100]), 0, 49]
        ]
      }
    }),

    // 420. Course Schedule III
    createProblem({
      num: 420,
      title: "Course Schedule III",
      slug: "course-schedule-iii",
      level: 20,
      difficulty: "HARD",
      topic: "Shortest Paths & Advanced Graphs",
      patternSlug: "advanced-graphs",
      estimatedTimeMin: 25,
      statement: "There are `n` different online courses numbered from `1` to `n`. You are given an array `courses` where `courses[i] = [durationi, lastDayi]` indicate that the `i-th` course should be taken continuously for `durationi` days and must be finished before or on `lastDayi`.\n\nYou will start on the `1st` day and you cannot take two or more courses simultaneously.\n\nReturn the maximum number of courses that you can take.",
      functionName: "scheduleCourse",
      parameters: [{ name: "courses", type: "number[][]", description: "Array of [duration, lastDay] pairs" }],
      returnType: "number",
      constraints: ["1 <= courses.length <= 10^4", "1 <= durationi, lastDayi <= 10^4"],
      examples: [
        { input: "courses = [[100,200],[200,1300],[1000,1250],[2000,3200]]", output: "3", explanation: "Take course 0 (days 1-100), course 2 (days 101-1100), and course 1 (days 1101-1300). Cannot take course 3. Total 3 courses." },
        { input: "courses = [[1,2]]", output: "1", explanation: "Take the only course." },
        { input: "courses = [[3,2],[4,3]]", output: "0", explanation: "Both durations exceed lastDay." },
        { input: "courses = [[100,2],[3,15]]", output: "1", explanation: "Only course 1 fits." }
      ],
      optimalSolution: `function scheduleCourse(courses) {\n  courses.sort((a, b) => a[1] - b[1]);\n  const maxHeap = [];\n  let time = 0;\n  for (const [dur, last] of courses) {\n    if (time + dur <= last) {\n      time += dur;\n      maxHeap.push(dur);\n      maxHeap.sort((a, b) => a - b);\n    } else if (maxHeap.length > 0 && maxHeap[maxHeap.length - 1] > dur) {\n      time += dur - maxHeap.pop();\n      maxHeap.push(dur);\n      maxHeap.sort((a, b) => a - b);\n    }\n  }\n  return maxHeap.length;\n}`,
      optimalTimeComplexity: "O(N log N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function scheduleCourse(courses) {\n  courses.sort((a, b) => a[1] - b[1]);\n  const taken = [];\n  let time = 0;\n  for (const [dur, last] of courses) {\n    taken.push(dur);\n    time += dur;\n    if (time > last) {\n      let maxIdx = 0;\n      for (let i = 1; i < taken.length; i++) {\n        if (taken[i] > taken[maxIdx]) maxIdx = i;\n      }\n      time -= taken[maxIdx];\n      taken.splice(maxIdx, 1);\n    }\n  }\n  return taken.length;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Sorting by duration first instead of sorting by deadline (lastDay) first."],
      hints: [
        "Sort courses by deadline lastDay in ascending order.",
        "Greedily add courses: if total time exceeds deadline, drop the course with the largest duration so far to maximize available time!"
      ],
      oracleFn: (courses: number[][]) => {
        courses.sort((a, b) => a[1] - b[1]);
        const maxHeap: number[] = [];
        let time = 0;
        for (const [dur, last] of courses) {
          if (time + dur <= last) {
            time += dur;
            maxHeap.push(dur);
            maxHeap.sort((a, b) => a - b);
          } else if (maxHeap.length > 0 && maxHeap[maxHeap.length - 1] > dur) {
            time += dur - maxHeap.pop()!;
            maxHeap.push(dur);
            maxHeap.sort((a, b) => a - b);
          }
        }
        return maxHeap.length;
      },
      testCases: {
        functional: [
          [[[100, 200], [200, 1300], [1000, 1250], [2000, 3200]]],
          [[[1, 2]]],
          [[[3, 2], [4, 3]]],
          [[[100, 2], [3, 15]]]
        ],
        boundary: [
          [[[5, 5]]],
          [[[1, 1], [1, 2], [1, 3]]],
          [[[10, 5]]]
        ],
        adversarial: [
          [[[5, 15], [3, 19], [6, 7], [2, 10], [5, 16], [8, 14], [10, 11], [2, 19]]],
          [[[7, 17], [3, 12], [10, 20], [9, 10], [5, 20], [10, 19], [4, 18]]],
          [[[9, 14], [7, 12], [1, 11], [4, 7]]]
        ],
        stress: [
          [Array.from({ length: 60 }, (_, i) => [i + 1, (i + 1) * 2])],
          [Array.from({ length: 80 }, (_, i) => [1, i + 1])]
        ]
      }
    }),

    // 421. Maximum Employees to Be Invited to a Meeting
    createProblem({
      num: 421,
      title: "Maximum Employees to Be Invited to a Meeting",
      slug: "maximum-employees-to-be-invited-to-a-meeting",
      level: 20,
      difficulty: "HARD",
      topic: "Shortest Paths & Advanced Graphs",
      patternSlug: "advanced-graphs",
      estimatedTimeMin: 35,
      statement: "A company is organizing a meeting and has a list of `n` employees, waiting to be invited. They have arranged for a large circular table, capable of seating any number of employees.\n\nThe employees are numbered from `0` to `n - 1`. Each employee has a favorite person and they will attend the meeting only if they can sit next to their favorite person at the table. The favorite person of an employee is not themself.\n\nGiven a 0-indexed integer array `favorite`, where `favorite[i]` denotes the favorite person of the `i-th` employee, return the maximum number of employees that can be invited to the meeting.",
      functionName: "maximumInvitations",
      parameters: [{ name: "favorite", type: "number[]", description: "Array of each employee's favorite person" }],
      returnType: "number",
      constraints: ["n == favorite.length", "2 <= n <= 10^5", "0 <= favorite[i] <= n - 1", "favorite[i] != i"],
      examples: [
        { input: "favorite = [2,2,1,2]", output: "3", explanation: "Employees 0, 1, 2 can sit around circular table: 0 next to 2, 1 next to 2, 2 next to 1." },
        { input: "favorite = [1,2,0]", output: "3", explanation: "Cycle 0 -> 1 -> 2 -> 0 seated together." },
        { input: "favorite = [3,0,1,4,1]", output: "4", explanation: "Employees 0, 1, 3, 4 can be seated." },
        { input: "favorite = [1,0]", output: "2", explanation: "Pair mutually favors each other." }
      ],
      optimalSolution: `function maximumInvitations(favorite) {\n  const n = favorite.length;\n  const inDegree = new Array(n).fill(0);\n  for (const f of favorite) inDegree[f]++;\n  const queue = [];\n  for (let i = 0; i < n; i++) if (inDegree[i] === 0) queue.push(i);\n  const depth = new Array(n).fill(1);\n  while (queue.length > 0) {\n    const curr = queue.shift();\n    const next = favorite[curr];\n    depth[next] = Math.max(depth[next], depth[curr] + 1);\n    inDegree[next]--;\n    if (inDegree[next] === 0) queue.push(next);\n  }\n  let maxCycle = 0, pairChains = 0;\n  for (let i = 0; i < n; i++) {\n    if (inDegree[i] > 0) {\n      let cycleLen = 0, curr = i;\n      while (inDegree[curr] > 0) {\n        inDegree[curr] = 0;\n        cycleLen++;\n        curr = favorite[curr];\n      }\n      if (cycleLen === 2) {\n        pairChains += depth[i] + depth[favorite[i]];\n      } else {\n        maxCycle = Math.max(maxCycle, cycleLen);\n      }\n    }\n  }\n  return Math.max(maxCycle, pairChains);\n}`,
      optimalTimeComplexity: "O(N) topological sort and cycle detection",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function maximumInvitations(favorite) {\n  const n = favorite.length;\n  const inDeg = new Array(n).fill(0);\n  for (const x of favorite) inDeg[x]++;\n  const q = [];\n  for (let i = 0; i < n; i++) if (inDeg[i] === 0) q.push(i);\n  const maxPath = new Array(n).fill(1);\n  while (q.length > 0) {\n    const u = q.shift();\n    const v = favorite[u];\n    maxPath[v] = Math.max(maxPath[v], maxPath[u] + 1);\n    if (--inDeg[v] === 0) q.push(v);\n  }\n  let maxC = 0, sumPairs = 0;\n  for (let i = 0; i < n; i++) {\n    if (inDeg[i] > 0) {\n      let len = 0, cur = i;\n      while (inDeg[cur] > 0) { inDeg[cur] = 0; len++; cur = favorite[cur]; }\n      if (len === 2) sumPairs += maxPath[i] + maxPath[favorite[i]];\n      else maxC = Math.max(maxC, len);\n    }\n  }\n  return Math.max(maxC, sumPairs);\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Failing to realize that multiple mutual 2-cycles with their longest chain arms can all sit at the same table together, while a 3+ cycle must stand alone."],
      hints: [
        "Case 1: A single cycle of size >= 3 can seat its members (nobody else can be added).",
        "Case 2: Cycles of size 2 can have linear chains extending from both nodes, and ALL 2-cycles can be combined at the same table!",
        "Answer is max(max_cycle_len, sum_of_all_2_cycles_with_arms)."
      ],
      oracleFn: (favorite: number[]) => {
        const n = favorite.length;
        const inDegree = new Array(n).fill(0);
        for (const f of favorite) inDegree[f]++;
        const queue: number[] = [];
        for (let i = 0; i < n; i++) if (inDegree[i] === 0) queue.push(i);
        const depth = new Array(n).fill(1);
        while (queue.length > 0) {
          const curr = queue.shift()!;
          const next = favorite[curr];
          depth[next] = Math.max(depth[next], depth[curr] + 1);
          inDegree[next]--;
          if (inDegree[next] === 0) queue.push(next);
        }
        let maxCycle = 0, pairChains = 0;
        for (let i = 0; i < n; i++) {
          if (inDegree[i] > 0) {
            let cycleLen = 0, curr = i;
            while (inDegree[curr] > 0) {
              inDegree[curr] = 0;
              cycleLen++;
              curr = favorite[curr];
            }
            if (cycleLen === 2) {
              pairChains += depth[i] + depth[favorite[i]];
            } else {
              maxCycle = Math.max(maxCycle, cycleLen);
            }
          }
        }
        return Math.max(maxCycle, pairChains);
      },
      testCases: {
        functional: [
          [[2, 2, 1, 2]],
          [[1, 2, 0]],
          [[3, 0, 1, 4, 1]],
          [[1, 0]]
        ],
        boundary: [
          [[1, 0, 1]],
          [[1, 2, 3, 0]],
          [[1, 0, 3, 2]]
        ],
        adversarial: [
          [[1, 0, 0, 2, 1, 4, 7, 8, 9, 6]],
          [[1, 2, 3, 4, 5, 0]],
          [[3, 0, 1, 2]]
        ],
        stress: [
          [Array.from({ length: 40 }, (_, i) => (i % 2 === 0 ? i + 1 : i - 1))],
          [Array.from({ length: 50 }, (_, i) => (i + 1) % 50)]
        ]
      }
    }),

    // 422. Reachable Nodes In Subdivided Graph
    createProblem({
      num: 422,
      title: "Reachable Nodes In Subdivided Graph",
      slug: "reachable-nodes-in-subdivided-graph",
      level: 20,
      difficulty: "HARD",
      topic: "Shortest Paths & Advanced Graphs",
      patternSlug: "advanced-graphs",
      estimatedTimeMin: 35,
      statement: "You are given an undirected graph of `n` nodes (0-indexed) with `edges` where `edges[i] = [ui, vi, cnti]` indicates that there is an edge between nodes `ui` and `vi` with `cnti` new nodes inserted on the edge.\n\nYou start at node `0` and have `maxMoves` moves. In one move, you can walk to an adjacent node on an edge (either original or inserted).\n\nReturn the number of nodes that are reachable from node `0` in at most `maxMoves` moves.",
      functionName: "reachableNodes",
      parameters: [
        { name: "edges", type: "number[][]", description: "Array of [u, v, cnt] edges" },
        { name: "maxMoves", type: "number", description: "Maximum moves available" },
        { name: "n", type: "number", description: "Number of original nodes" }
      ],
      returnType: "number",
      constraints: ["0 <= edges.length <= min(n * (n - 1) / 2, 10^4)", "edges[i].length == 3", "0 <= ui < vi < n", "0 <= cnti <= 10^4", "0 <= maxMoves <= 10^9", "1 <= n <= 3000"],
      examples: [
        { input: "edges = [[0,1,10],[0,2,1],[1,2,2]], maxMoves = 6, n = 3", output: "13", explanation: "All 3 original nodes and 10 subdivided nodes can be reached, total 13." },
        { input: "edges = [[0,1,4],[1,2,6],[0,2,8],[1,3,1]], maxMoves = 10, n = 4", output: "23", explanation: "Reaches all 4 nodes and 19 intermediate nodes = 23." },
        { input: "edges = [[1,2,4],[0,2,0]], maxMoves = 0, n = 3", output: "1", explanation: "With 0 moves, only start node 0 is reachable." },
        { input: "edges = [[0,1,1]], maxMoves = 1, n = 2", output: "2", explanation: "Reaches node 0 and 1 intermediate node." }
      ],
      optimalSolution: `function reachableNodes(edges, maxMoves, n) {\n  const adj = Array.from({ length: n }, () => []);\n  for (const [u, v, cnt] of edges) {\n    adj[u].push([v, cnt]);\n    adj[v].push([u, cnt]);\n  }\n  const dist = new Array(n).fill(Infinity);\n  dist[0] = 0;\n  const queue = [[0, 0]];\n  while (queue.length > 0) {\n    queue.sort((a, b) => a[1] - b[1]);\n    const [u, d] = queue.shift();\n    if (d > dist[u]) continue;\n    for (const [v, cnt] of adj[u]) {\n      const w = cnt + 1;\n      if (d + w < dist[v] && d + w <= maxMoves) {\n        dist[v] = d + w;\n        queue.push([v, dist[v]]);\n      }\n    }\n  }\n  let ans = 0;\n  for (let i = 0; i < n; i++) {\n    if (dist[i] <= maxMoves) ans++;\n  }\n  for (const [u, v, cnt] of edges) {\n    const a = dist[u] <= maxMoves ? maxMoves - dist[u] : 0;\n    const b = dist[v] <= maxMoves ? maxMoves - dist[v] : 0;\n    ans += Math.min(cnt, a + b);\n  }\n  return ans;\n}`,
      optimalTimeComplexity: "O(E log V) with Dijkstra",
      optimalSpaceComplexity: "O(V + E)",
      suboptimalSolution: `function reachableNodes(edges, maxMoves, n) {\n  const adj = Array.from({ length: n }, () => []);\n  for (const [u, v, cnt] of edges) {\n    adj[u].push([v, cnt + 1]);\n    adj[v].push([u, cnt + 1]);\n  }\n  const dist = new Array(n).fill(Infinity);\n  dist[0] = 0;\n  const pq = [[0, 0]];\n  while (pq.length > 0) {\n    pq.sort((a, b) => a[1] - b[1]);\n    const [curr, d] = pq.shift();\n    if (d > dist[curr]) continue;\n    for (const [nxt, w] of adj[curr]) {\n      if (d + w < dist[nxt] && d + w <= maxMoves) {\n        dist[nxt] = d + w;\n        pq.push([nxt, dist[nxt]]);\n      }\n    }\n  }\n  let total = dist.filter(d => d <= maxMoves).length;\n  for (const [u, v, cnt] of edges) {\n    const reachU = dist[u] <= maxMoves ? maxMoves - dist[u] : 0;\n    const reachV = dist[v] <= maxMoves ? maxMoves - dist[v] : 0;\n    total += Math.min(cnt, reachU + reachV);\n  }\n  return total;\n}`,
      suboptimalTimeComplexity: "O(E log V)",
      suboptimalSpaceComplexity: "O(V + E)",
      commonMistakes: ["Double counting subdivided nodes when reach from u + reach from v > cnt."],
      hints: [
        "Treat each subdivided edge as a single weighted edge of length cnt + 1.",
        "Run Dijkstra from node 0 to find the shortest distance to all original nodes.",
        "On edge (u, v, cnt), the number of reachable inserted nodes is min(cnt, maxMoves - dist[u] + maxMoves - dist[v])."
      ],
      oracleFn: (edges: number[][], maxMoves: number, n: number) => {
        const adj = Array.from({ length: n }, () => [] as [number, number][]);
        for (const [u, v, cnt] of edges) {
          adj[u].push([v, cnt]);
          adj[v].push([u, cnt]);
        }
        const dist = new Array(n).fill(Infinity);
        dist[0] = 0;
        const queue: [number, number][] = [[0, 0]];
        while (queue.length > 0) {
          queue.sort((a, b) => a[1] - b[1]);
          const [u, d] = queue.shift()!;
          if (d > dist[u]) continue;
          for (const [v, cnt] of adj[u]) {
            const w = cnt + 1;
            if (d + w < dist[v] && d + w <= maxMoves) {
              dist[v] = d + w;
              queue.push([v, dist[v]]);
            }
          }
        }
        let ans = 0;
        for (let i = 0; i < n; i++) {
          if (dist[i] <= maxMoves) ans++;
        }
        for (const [u, v, cnt] of edges) {
          const a = dist[u] <= maxMoves ? maxMoves - dist[u] : 0;
          const b = dist[v] <= maxMoves ? maxMoves - dist[v] : 0;
          ans += Math.min(cnt, a + b);
        }
        return ans;
      },
      testCases: {
        functional: [
          [[[0, 1, 10], [0, 2, 1], [1, 2, 2]], 6, 3],
          [[[0, 1, 4], [1, 2, 6], [0, 2, 8], [1, 3, 1]], 10, 4],
          [[[1, 2, 4], [0, 2, 0]], 0, 3],
          [[[0, 1, 1]], 1, 2]
        ],
        boundary: [
          [[], 5, 1],
          [[[0, 1, 0]], 1, 2],
          [[[0, 1, 5]], 2, 2]
        ],
        adversarial: [
          [[[0, 1, 10], [1, 2, 10], [0, 2, 15]], 8, 3],
          [[[0, 1, 2], [1, 2, 3], [0, 2, 1]], 4, 3],
          [[[0, 1, 100]], 50, 2]
        ],
        stress: [
          [Array.from({ length: 20 }, (_, i) => [i, i + 1, 5]), 25, 21],
          [Array.from({ length: 30 }, (_, i) => [0, i + 1, 10]), 15, 31]
        ]
      }
    }),

    // 423. Modify Graph Edge Weights
    createProblem({
      num: 423,
      title: "Modify Graph Edge Weights",
      slug: "modify-graph-edge-weights",
      level: 20,
      difficulty: "HARD",
      topic: "Shortest Paths & Advanced Graphs",
      patternSlug: "advanced-graphs",
      estimatedTimeMin: 40,
      statement: "You are given an undirected weighted connected graph containing `n` nodes labeled from `0` to `n - 1`, and an integer array `edges` where `edges[i] = [ai, bi, wi]` indicates that there is an edge between nodes `ai` and `bi` with weight `wi`.\n\nSome edges have a weight of `-1` (wi = -1), while others have a positive weight (wi >= 1).\n\nYour task is to modify all edges with a weight of `-1` by assigning them positive integer weights in the range `[1, 2 * 10^9]` such that the shortest distance between `source` and `destination` becomes equal to an integer `target`.\n\nReturn an array containing all edges (even unmodified ones) in any order if it is possible, or an empty array if it is impossible.",
      functionName: "modifiedGraphEdges",
      parameters: [
        { name: "n", type: "number", description: "Number of nodes" },
        { name: "edges", type: "number[][]", description: "Array of [u, v, w] edges" },
        { name: "source", type: "number", description: "Source node" },
        { name: "destination", type: "number", description: "Destination node" },
        { name: "target", type: "number", description: "Target shortest path distance" }
      ],
      returnType: "number[][]",
      constraints: ["1 <= n <= 100", "1 <= edges.length <= n * (n - 1) / 2", "edges[i].length == 3", "0 <= ai, bi < n", "wi = -1 or 1 <= wi <= 10^7", "0 <= source, destination < n", "source != destination", "1 <= target <= 10^9"],
      examples: [
        { input: "n = 5, edges = [[4,1,-1],[2,0,-1],[0,3,-1],[4,3,-1]], source = 0, destination = 1, target = 5", output: "[[4,1,1],[2,0,1],[0,3,3],[4,3,1]]", explanation: "Setting edges correctly gives shortest path 0 -> 3 -> 4 -> 1 of length 3 + 1 + 1 = 5." },
        { input: "n = 3, edges = [[0,1,-1],[0,2,5]], source = 0, destination = 2, target = 6", output: "[]", explanation: "Direct edge 0 -> 2 already has distance 5 < 6, impossible to make shortest path 6." },
        { input: "n = 4, edges = [[1,0,4],[1,2,3],[2,3,5],[0,3,-1]], source = 0, destination = 2, target = 6", output: "[[1,0,4],[1,2,3],[2,3,5],[0,3,1]]", explanation: "Shortest path 0 -> 1 -> 2 is 7, wait, 4 + 3 = 7. Setting [0,3] to 1 gives 0 -> 3 -> 2 = 1 + 5 = 6." },
        { input: "n = 2, edges = [[0,1,-1]], source = 0, destination = 1, target = 10", output: "[[0,1,10]]", explanation: "Set single edge to 10." }
      ],
      optimalSolution: `function modifiedGraphEdges(n, edges, source, destination, target) {\n  function dijkstra(edgesList) {\n    const adj = Array.from({ length: n }, () => []);\n    for (const [u, v, w] of edgesList) {\n      if (w !== -1) {\n        adj[u].push([v, w]);\n        adj[v].push([u, w]);\n      }\n    }\n    const dist = new Array(n).fill(Infinity);\n    dist[source] = 0;\n    const q = [[source, 0]];\n    while (q.length > 0) {\n      q.sort((a, b) => a[1] - b[1]);\n      const [u, d] = q.shift();\n      if (d > dist[u]) continue;\n      for (const [v, w] of adj[u]) {\n        if (d + w < dist[v]) {\n          dist[v] = d + w;\n          q.push([v, dist[v]]);\n        }\n      }\n    }\n    return dist[destination];\n  }\n  let curDist = dijkstra(edges);\n  if (curDist < target) return [];\n  let matched = curDist === target;\n  for (const edge of edges) {\n    if (edge[2] !== -1) continue;\n    if (matched) {\n      edge[2] = 2e9;\n      continue;\n    }\n    edge[2] = 1;\n    const d = dijkstra(edges);\n    if (d <= target) {\n      matched = true;\n      edge[2] += target - d;\n    }\n  }\n  return matched ? edges : [];\n}`,
      optimalTimeComplexity: "O(E * (E log V))",
      optimalSpaceComplexity: "O(V + E)",
      suboptimalSolution: `function modifiedGraphEdges(n, edges, source, destination, target) {\n  const dijkstra = (list) => {\n    const adj = Array.from({ length: n }, () => []);\n    for (const [u, v, w] of list) {\n      if (w !== -1) { adj[u].push([v, w]); adj[v].push([u, w]); }\n    }\n    const dist = new Array(n).fill(Infinity);\n    dist[source] = 0;\n    const q = [[source, 0]];\n    while (q.length > 0) {\n      q.sort((a, b) => a[1] - b[1]);\n      const [u, d] = q.shift();\n      if (d > dist[u]) continue;\n      for (const [v, w] of adj[u]) {\n        if (d + w < dist[v]) { dist[v] = d + w; q.push([v, dist[v]]); }\n      }\n    }\n    return dist[destination];\n  };\n  let d = dijkstra(edges);\n  if (d < target) return [];\n  let match = d === target;\n  for (const e of edges) {\n    if (e[2] !== -1) continue;\n    if (match) { e[2] = 2e9; continue; }\n    e[2] = 1;\n    const newD = dijkstra(edges);\n    if (newD <= target) {\n      match = true;\n      e[2] += target - newD;\n    }\n  }\n  return match ? edges : [];\n}`,
      suboptimalTimeComplexity: "O(E^2 log V)",
      suboptimalSpaceComplexity: "O(V + E)",
      commonMistakes: ["Assigning random weights to -1 edges rather than incrementally adjusting with Dijkstra."],
      hints: [
        "First check if shortest path on existing fixed edges is strictly less than target (if so, return []).",
        "Set -1 edges to 1 one by one. Once shortest distance <= target, increase the current edge weight to make shortest path exactly equal target, and set remaining -1 edges to 2e9."
      ],
      oracleFn: (n: number, edges: number[][], source: number, destination: number, target: number) => {
        const copy = edges.map(e => [...e]);
        const dijkstra = (edgesList: number[][]) => {
          const adj = Array.from({ length: n }, () => [] as [number, number][]);
          for (const [u, v, w] of edgesList) {
            if (w !== -1) {
              adj[u].push([v, w]);
              adj[v].push([u, w]);
            }
          }
          const dist = new Array(n).fill(Infinity);
          dist[source] = 0;
          const q: [number, number][] = [[source, 0]];
          while (q.length > 0) {
            q.sort((a, b) => a[1] - b[1]);
            const [u, d] = q.shift()!;
            if (d > dist[u]) continue;
            for (const [v, w] of adj[u]) {
              if (d + w < dist[v]) {
                dist[v] = d + w;
                q.push([v, dist[v]]);
              }
            }
          }
          return dist[destination];
        };
        let curDist = dijkstra(copy);
        if (curDist < target) return [];
        let matched = curDist === target;
        for (const edge of copy) {
          if (edge[2] !== -1) continue;
          if (matched) {
            edge[2] = 2000000000;
            continue;
          }
          edge[2] = 1;
          const d = dijkstra(copy);
          if (d <= target) {
            matched = true;
            edge[2] += target - d;
          }
        }
        return matched ? copy : [];
      },
      testCases: {
        functional: [
          [5, [[4, 1, -1], [2, 0, -1], [0, 3, -1], [4, 3, -1]], 0, 1, 5],
          [3, [[0, 1, -1], [0, 2, 5]], 0, 2, 6],
          [4, [[1, 0, 4], [1, 2, 3], [2, 3, 5], [0, 3, -1]], 0, 2, 6],
          [2, [[0, 1, -1]], 0, 1, 10]
        ],
        boundary: [
          [2, [[0, 1, 5]], 0, 1, 5],
          [2, [[0, 1, 5]], 0, 1, 4],
          [3, [[0, 1, -1], [1, 2, -1]], 0, 2, 2]
        ],
        adversarial: [
          [4, [[0, 1, -1], [1, 2, -1], [3, 1, -1], [3, 0, 2], [0, 2, 5]], 2, 3, 8],
          [3, [[0, 1, 1], [1, 2, -1], [0, 2, 10]], 0, 2, 5],
          [4, [[0, 1, -1], [2, 3, -1]], 0, 3, 5]
        ],
        stress: [
          [10, Array.from({ length: 9 }, (_, i) => [i, i + 1, -1]), 0, 9, 20],
          [15, Array.from({ length: 14 }, (_, i) => [i, i + 1, (i % 2 === 0 ? -1 : 2)]), 0, 14, 30]
        ]
      }
    }),

    // 424. Minimum Obstacle Removal to Reach Corner
    createProblem({
      num: 424,
      title: "Minimum Obstacle Removal to Reach Corner",
      slug: "minimum-obstacle-removal-to-reach-corner",
      level: 20,
      difficulty: "HARD",
      topic: "Shortest Paths & Advanced Graphs",
      patternSlug: "advanced-graphs",
      estimatedTimeMin: 25,
      statement: "You are given a 0-indexed 2D integer array `grid` of size `m x n`. Each cell has one of two values:\n- `0` represents an empty cell,\n- `1` represents an obstacle that may be removed.\n\nYou can move up, down, left, or right from and to an empty cell.\n\nReturn the minimum number of obstacles to remove so you can move from the upper left corner `(0, 0)` to the lower right corner `(m - 1, n - 1)`.",
      functionName: "minimumObstacles",
      parameters: [{ name: "grid", type: "number[][]", description: "m x n grid with 0 (empty) and 1 (obstacle)" }],
      returnType: "number",
      constraints: ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 10^5", "2 <= m * n <= 10^5", "grid[i][j] is either 0 or 1", "grid[0][0] == grid[m - 1][n - 1] == 0"],
      examples: [
        { input: "grid = [[0,1,1],[1,1,0],[1,1,0]]", output: "2", explanation: "Remove obstacles at (0,1) and (0,2) or (1,2) to reach (2,2) with 2 removals." },
        { input: "grid = [[0,1,0,0,0],[0,1,0,1,0],[0,0,0,1,0]]", output: "0", explanation: "Path through 0s exists without removing any obstacle." },
        { input: "grid = [[0,0],[0,0]]", output: "0", explanation: "All empty cells." },
        { input: "grid = [[0,1],[1,0]]", output: "1", explanation: "Remove 1 obstacle." }
      ],
      optimalSolution: `function minimumObstacles(grid) {\n  const m = grid.length, n = grid[0].length;\n  const dist = Array.from({ length: m }, () => new Array(n).fill(Infinity));\n  dist[0][0] = 0;\n  const deque = [[0, 0]];\n  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];\n  while (deque.length > 0) {\n    const [r, c] = deque.shift();\n    const d = dist[r][c];\n    if (r === m - 1 && c === n - 1) return d;\n    for (const [dr, dc] of dirs) {\n      const nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nr < m && nc >= 0 && nc < n) {\n        const cost = grid[nr][nc];\n        if (d + cost < dist[nr][nc]) {\n          dist[nr][nc] = d + cost;\n          if (cost === 0) deque.unshift([nr, nc]);\n          else deque.push([nr, nc]);\n        }\n      }\n    }\n  }\n  return dist[m - 1][n - 1];\n}`,
      optimalTimeComplexity: "O(m * n) with 0-1 BFS",
      optimalSpaceComplexity: "O(m * n)",
      suboptimalSolution: `function minimumObstacles(grid) {\n  const m = grid.length, n = grid[0].length;\n  const dist = Array.from({ length: m }, () => new Array(n).fill(Infinity));\n  dist[0][0] = 0;\n  const pq = [[0, 0, 0]];\n  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];\n  while (pq.length > 0) {\n    pq.sort((a, b) => a[0] - b[0]);\n    const [d, r, c] = pq.shift();\n    if (d > dist[r][c]) continue;\n    if (r === m - 1 && c === n - 1) return d;\n    for (const [dr, dc] of dirs) {\n      const nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nr < m && nc >= 0 && nc < n) {\n        const cost = grid[nr][nc];\n        if (d + cost < dist[nr][nc]) {\n          dist[nr][nc] = d + cost;\n          pq.push([dist[nr][nc], nr, nc]);\n        }\n      }\n    }\n  }\n  return dist[m - 1][n - 1];\n}`,
      suboptimalTimeComplexity: "O(m * n log(m * n))",
      suboptimalSpaceComplexity: "O(m * n)",
      commonMistakes: ["Using standard priority queue when 0-1 BFS with a deque runs in pure O(V + E) time."],
      hints: [
        "Moving into an empty cell costs 0, moving into an obstacle costs 1.",
        "0-1 BFS finds the shortest path in linear O(m * n) time."
      ],
      oracleFn: (grid: number[][]) => {
        const m = grid.length, n = grid[0].length;
        const dist = Array.from({ length: m }, () => new Array(n).fill(Infinity));
        dist[0][0] = 0;
        const deque: [number, number][] = [[0, 0]];
        const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        while (deque.length > 0) {
          const [r, c] = deque.shift()!;
          const d = dist[r][c];
          if (r === m - 1 && c === n - 1) return d;
          for (const [dr, dc] of dirs) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
              const cost = grid[nr][nc];
              if (d + cost < dist[nr][nc]) {
                dist[nr][nc] = d + cost;
                if (cost === 0) deque.unshift([nr, nc]);
                else deque.push([nr, nc]);
              }
            }
          }
        }
        return dist[m - 1][n - 1];
      },
      testCases: {
        functional: [
          [[[0, 1, 1], [1, 1, 0], [1, 1, 0]]],
          [[[0, 1, 0, 0, 0], [0, 1, 0, 1, 0], [0, 0, 0, 1, 0]]],
          [[[0, 0], [0, 0]]],
          [[[0, 1], [1, 0]]]
        ],
        boundary: [
          [[[0, 1, 0]]],
          [[[0], [1], [0]]],
          [[[0, 1], [0, 0]]]
        ],
        adversarial: [
          [[[0, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 0]]],
          [[[0, 1, 1, 1, 1], [1, 1, 1, 1, 1], [0, 0, 0, 0, 0]]],
          [[[0, 0, 1], [1, 1, 1], [1, 0, 0]]]
        ],
        stress: [
          [Array.from({ length: 30 }, () => Array.from({ length: 30 }, () => 1)).map((row) => { row[0] = 0; row[row.length - 1] = 0; return row; })],
          [Array.from({ length: 40 }, (_, r) => {
            const row = Array.from({ length: 40 }, (_, c) => ((r + c) % 3 === 0 ? 1 : 0));
            row[0] = 0;
            row[row.length - 1] = 0;
            return row;
          })]
        ]
      }
    }),

    // 425. Minimum Number of Visited Cells in a Grid
    createProblem({
      num: 425,
      title: "Minimum Number of Visited Cells in a Grid",
      slug: "minimum-number-of-visited-cells-in-a-grid",
      level: 20,
      difficulty: "HARD",
      topic: "Shortest Paths & Advanced Graphs",
      patternSlug: "advanced-graphs",
      estimatedTimeMin: 35,
      statement: "You are given a 0-indexed `m x n` integer matrix `grid`. Your initial position is at the top-left cell `(0, 0)`.\n\nStarting from the cell `(i, j)`, you can move to one of the following cells:\n- Cells `(i, k)` with `j < k <= min(j + grid[i][j], n - 1)` (i.e. rightward movement)\n- Cells `(k, j)` with `i < k <= min(i + grid[i][j], m - 1)` (i.e. downward movement)\n\nReturn the minimum number of cells you need to visit to reach the bottom-right cell `(m - 1, n - 1)`. If there is no valid path, return `-1`.",
      functionName: "minimumVisitedCells",
      parameters: [{ name: "grid", type: "number[][]", description: "m x n grid of jump ranges" }],
      returnType: "number",
      constraints: ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 10^5", "1 <= m * n <= 10^5", "0 <= grid[i][j] < m * n", "grid[m - 1][n - 1] == 0"],
      examples: [
        { input: "grid = [[3,4,2,1],[4,2,3,1],[2,1,0,0],[2,4,0,0]]", output: "4", explanation: "Path (0,0) -> (0,1) -> (1,1) -> (3,3) visits 4 cells." },
        { input: "grid = [[3,4,2,1],[4,2,1,1],[2,1,1,0],[3,4,1,0]]", output: "3", explanation: "Path (0,0) -> (3,0) -> (3,3) visits 3 cells." },
        { input: "grid = [[2,1,0],[1,0,0]]", output: "-1", explanation: "Cannot reach (1,2)." },
        { input: "grid = [[0]]", output: "1", explanation: "Already at the destination, 1 cell visited." }
      ],
      optimalSolution: `function minimumVisitedCells(grid) {\n  const m = grid.length, n = grid[0].length;\n  if (m === 1 && n === 1) return 1;\n  const dist = Array.from({ length: m }, () => new Array(n).fill(-1));\n  dist[0][0] = 1;\n  const rowNext = Array.from({ length: m }, () => Array.from({ length: n + 1 }, (_, i) => i));\n  const colNext = Array.from({ length: n }, () => Array.from({ length: m + 1 }, (_, i) => i));\n  function findRow(r, c) {\n    if (rowNext[r][c] === c) return c;\n    return rowNext[r][c] = findRow(r, rowNext[r][c]);\n  }\n  function findCol(c, r) {\n    if (colNext[c][r] === r) return r;\n    return colNext[c][r] = findCol(c, colNext[c][r]);\n  }\n  const queue = [[0, 0]];\n  rowNext[0][0] = 1;\n  colNext[0][0] = 1;\n  while (queue.length > 0) {\n    const [r, c] = queue.shift();\n    const d = dist[r][c];\n    const maxC = Math.min(n - 1, c + grid[r][c]);\n    for (let nc = findRow(r, c + 1); nc <= maxC; nc = findRow(r, nc + 1)) {\n      if (dist[r][nc] === -1) {\n        dist[r][nc] = d + 1;\n        if (r === m - 1 && nc === n - 1) return d + 1;\n        queue.push([r, nc]);\n      }\n      rowNext[r][nc] = nc + 1;\n    }\n    const maxR = Math.min(m - 1, r + grid[r][c]);\n    for (let nr = findCol(c, r + 1); nr <= maxR; nr = findCol(c, nr + 1)) {\n      if (dist[nr][c] === -1) {\n        dist[nr][c] = d + 1;\n        if (nr === m - 1 && c === n - 1) return d + 1;\n        queue.push([nr, c]);\n      }\n      colNext[c][nr] = nr + 1;\n    }\n  }\n  return dist[m - 1][n - 1];\n}`,
      optimalTimeComplexity: "O(m * n * alpha(m * n)) with Disjoint-Set union-find skip list",
      optimalSpaceComplexity: "O(m * n)",
      suboptimalSolution: `function minimumVisitedCells(grid) {\n  const m = grid.length, n = grid[0].length;\n  if (m === 1 && n === 1) return 1;\n  const dist = Array.from({ length: m }, () => new Array(n).fill(-1));\n  dist[0][0] = 1;\n  const q = [[0, 0]];\n  while (q.length > 0) {\n    const [r, c] = q.shift();\n    const d = dist[r][c];\n    const maxC = Math.min(n - 1, c + grid[r][c]);\n    for (let nc = c + 1; nc <= maxC; nc++) {\n      if (dist[r][nc] === -1) {\n        dist[r][nc] = d + 1;\n        if (r === m - 1 && nc === n - 1) return d + 1;\n        q.push([r, nc]);\n      }\n    }\n    const maxR = Math.min(m - 1, r + grid[r][c]);\n    for (let nr = r + 1; nr <= maxR; nr++) {\n      if (dist[nr][c] === -1) {\n        dist[nr][c] = d + 1;\n        if (nr === m - 1 && c === n - 1) return d + 1;\n        q.push([nr, c]);\n      }\n    }\n  }\n  return dist[m - 1][n - 1];\n}`,
      suboptimalTimeComplexity: "O(m * n * (m + n))",
      suboptimalSpaceComplexity: "O(m * n)",
      commonMistakes: ["Re-scanning visited cells on row and column sweeps leading to O(m*n*(m+n)) TLE."],
      hints: [
        "Use Disjoint Set Union (DSU) along each row and column to jump over already visited cells in amortized O(alpha(N)) time."
      ],
      oracleFn: (grid: number[][]) => {
        const m = grid.length, n = grid[0].length;
        if (m === 1 && n === 1) return 1;
        const dist = Array.from({ length: m }, () => new Array(n).fill(-1));
        dist[0][0] = 1;
        const rowNext = Array.from({ length: m }, () => Array.from({ length: n + 1 }, (_, i) => i));
        const colNext = Array.from({ length: n }, () => Array.from({ length: m + 1 }, (_, i) => i));
        const findRow = (r: number, c: number): number => {
          if (rowNext[r][c] === c) return c;
          return rowNext[r][c] = findRow(r, rowNext[r][c]);
        };
        const findCol = (c: number, r: number): number => {
          if (colNext[c][r] === r) return r;
          return colNext[c][r] = findCol(c, colNext[c][r]);
        };
        const queue: [number, number][] = [[0, 0]];
        rowNext[0][0] = 1;
        colNext[0][0] = 1;
        while (queue.length > 0) {
          const [r, c] = queue.shift()!;
          const d = dist[r][c];
          const maxC = Math.min(n - 1, c + grid[r][c]);
          for (let nc = findRow(r, c + 1); nc <= maxC; nc = findRow(r, nc + 1)) {
            if (dist[r][nc] === -1) {
              dist[r][nc] = d + 1;
              if (r === m - 1 && nc === n - 1) return d + 1;
              queue.push([r, nc]);
            }
            rowNext[r][nc] = nc + 1;
          }
          const maxR = Math.min(m - 1, r + grid[r][c]);
          for (let nr = findCol(c, r + 1); nr <= maxR; nr = findCol(c, nr + 1)) {
            if (dist[nr][c] === -1) {
              dist[nr][c] = d + 1;
              if (nr === m - 1 && c === n - 1) return d + 1;
              queue.push([nr, c]);
            }
            colNext[c][nr] = nr + 1;
          }
        }
        return dist[m - 1][n - 1];
      },
      testCases: {
        functional: [
          [[[3, 4, 2, 1], [4, 2, 3, 1], [2, 1, 0, 0], [2, 4, 0, 0]]],
          [[[3, 4, 2, 1], [4, 2, 1, 1], [2, 1, 1, 0], [3, 4, 1, 0]]],
          [[[2, 1, 0], [1, 0, 0]]],
          [[[0]]]
        ],
        boundary: [
          [[[1, 0]]],
          [[[1], [0]]],
          [[[0, 0], [0, 0]]]
        ],
        adversarial: [
          [[[2, 0, 0], [0, 0, 0], [0, 0, 0]]],
          [[[1, 1, 1], [1, 1, 1], [1, 1, 0]]],
          [[[5, 4, 3, 2, 1, 0]]]
        ],
        stress: [
          [Array.from({ length: 30 }, () => Array.from({ length: 30 }, () => 2)).map((row) => { row[row.length - 1] = 0; return row; })],
          [Array.from({ length: 40 }, (_, r) => {
            const row = Array.from({ length: 40 }, (_, c) => ((r + c) % 4) + 1);
            row[row.length - 1] = 0;
            return row;
          })]
        ]
      }
    })
  ];

  return {
    level: 20,
    levelTitle: "Level 20 — Advanced Graphs & Shortest Paths",
    topic: "Dijkstra's Algorithm, Bellman-Ford, Tarjan Bridges, Eulerian Hierholzer Paths, 0-1 BFS, and Multi-State BFS",
    problems
  };
}
