export interface LevelMetaItem {
  title: string;
  topic: string;
  description: string;
  concepts?: string[];
}

export const LEVEL_METADATA: Record<number, LevelMetaItem> = {
  1: { 
    title: "Fundamentals & Easy Arrays", 
    topic: "Array Manipulation & In-Place Traversal",
    description: "Master two-pointer passes, prefix running accumulators, frequency tables, and linear scans.",
    concepts: ["Two Pointers", "Prefix Sums", "In-Place Traversal", "Hash Counting"]
  },
  2: { 
    title: "Hashing, Prefix Sum & Frequency", 
    topic: "Hash Maps & Invariant Running Sums",
    description: "Harness O(1) hash tables, remainder divisibility invariants, and prefix difference subarrays.",
    concepts: ["Hash Tables", "Prefix Modulo", "Subarray Invariants", "Frequency Arrays"]
  },
  3: { 
    title: "Two Pointers", 
    topic: "Opposite & Fast/Slow Convergence",
    description: "Converging inward pointers on sorted sequences, container water bounds, and partitioning.",
    concepts: ["Inward Convergence", "Fast & Slow", "Sorted Scanning", "Dutch National Flag"]
  },
  4: { 
    title: "Sliding Window", 
    topic: "Dynamic & Fixed Subarrays",
    description: "Maintain window contraction invariants and frequency state constraints in O(N).",
    concepts: ["Dynamic Expansion", "Shrink Condition", "Character Frequency", "At Most K"]
  },
  5: { 
    title: "Binary Search Basics", 
    topic: "Monotonic Predicates & Answer Space",
    description: "Discover exact bounds, rotated array pivot discovery, and monotonic boolean predicates.",
    concepts: ["Exact Match", "Lower / Upper Bound", "Rotated Arrays", "Predicate Function"]
  },
  6: { 
    title: "Linked List Fundamentals", 
    topic: "Pointers Reversal & Cycle Detection",
    description: "Manipulate node pointers in-place, apply Floyd's tortoise/hare cycle algorithms, and merge lists.",
    concepts: ["Pointer Inversion", "Floyd's Tortoise/Hare", "Sentinel Nodes", "List Merging"]
  },
  7: { 
    title: "Stack, Queue & Monotonic Stack", 
    topic: "LIFO Ordering & Next Greater Element",
    description: "Next Greater Element queries, parenthetical validation, and monotonic boundary spans.",
    concepts: ["Monotonic Stack", "Next Greater Element", "Parenthesis Matching", "Histogram Spans"]
  },
  8: { 
    title: "Intervals & Greedy", 
    topic: "Interval Scheduling & Merging",
    description: "Sort by boundary timestamps, identify overlap intersections, and make optimal local choices.",
    concepts: ["Interval Merging", "Non-overlapping Intervals", "Greedy Scheduling", "Timeline Sweeps"]
  },
  9: { 
    title: "Heap / Priority Queue / Top K", 
    topic: "Top-K Elements & Stream Medians",
    description: "Min/Max heap maintenance, multi-way stream merges, and running continuous median tracking.",
    concepts: ["Min / Max Heaps", "K-way Merge", "Running Medians", "Top K Frequent"]
  },
  10: { 
    title: "Trees: DFS/BFS Foundations", 
    topic: "Tree Recursion & Level Traversals",
    description: "Binary tree recursive induction, lowest common ancestors, and queue-based BFS layer walks.",
    concepts: ["Depth-First Search", "Breadth-First Search", "Lowest Common Ancestor", "Tree Height & Diameter"]
  },
  11: { 
    title: "Trees: Advanced", 
    topic: "Tree DP & Serialization",
    description: "Diameter propagation, path sum dynamic programming, and preorder/inorder tree reconstruction.",
    concepts: ["Tree DP", "Preorder / Inorder Reconstruction", "Tree Serialization", "BST Validation"]
  },
  12: { 
    title: "Backtracking: Subsets & Permutations", 
    topic: "State Space Exploration & Pruning",
    description: "Systematic branch enumeration, decision state backtracking, and combinatorial constraint pruning.",
    concepts: ["Subsets & Combinations", "Permutations", "Pruning Conditions", "N-Queens & Sudoku"]
  },
  13: { 
    title: "Matrix & Grid Traversal", 
    topic: "2D Flood Fill & Grid BFS",
    description: "Island component connectivity, matrix in-place rotation, and multi-source grid BFS.",
    concepts: ["Flood Fill", "Island Counting", "Multi-Source BFS", "Matrix Transformations"]
  },
  14: { 
    title: "Graph BFS/DFS", 
    topic: "Adjacency Graphs & Bipartite Verification",
    description: "Unweighted shortest paths, cycle detection in directed graphs, and graph coloring.",
    concepts: ["Shortest Paths (BFS)", "Cycle Detection", "Bipartite Coloring", "Connected Components"]
  },
  15: { 
    title: "Topological Sort & Union Find", 
    topic: "DAG Dependency Resolution & DSU",
    description: "Kahn's in-degree topological order, cycle detection in DAGs, and Disjoint Set Union with rank.",
    concepts: ["Kahn's Algorithm", "In-Degree Tracking", "Union-Find with Path Compression", "Redundant Connections"]
  },
  16: { 
    title: "Greedy & Advanced Array Patterns", 
    topic: "Kadane's & Stock State Machines",
    description: "Maximum contiguous subarray sums, cyclic array index positioning, and greedy peak jumping.",
    concepts: ["Kadane's Algorithm", "Stock State Machines", "Greedy Jump Sequences", "Circular Subarrays"]
  },
  17: { 
    title: "Dynamic Programming I: 1D", 
    topic: "Linear Recurrence & State Tabulation",
    description: "Identify subproblems, formulate transition equations, and optimize space from O(N) to O(1).",
    concepts: ["Linear Recurrence", "House Robber Transitions", "Coin Change / Unbounded Knapsack", "O(1) Rolling States"]
  },
  18: { 
    title: "Dynamic Programming II: 2D & Strings", 
    topic: "LCS, Edit Distance & Grid DP",
    description: "Matrix grid paths, longest common subsequences, and Levenshtein edit distance transitions.",
    concepts: ["Longest Common Subsequence", "Edit Distance", "Grid Path Optimization", "Substring Tabulation"]
  },
  19: { 
    title: "Advanced DP & State Machines", 
    topic: "Game Theory Minimax & Bitmask DP",
    description: "Optimal play decision trees, bitmask subset representations, and multi-state trading automata.",
    concepts: ["Bitmask Dynamic Programming", "Minimax / Game Theory", "Cool-down State Automata", "Traveling Salesman"]
  },
  20: { 
    title: "Advanced Graphs & Shortest Paths", 
    topic: "Dijkstra, Bellman-Ford & Bridges",
    description: "Weighted single-source shortest paths, negative cycle detection, and Tarjan's bridge discovery.",
    concepts: ["Dijkstra's Algorithm", "Bellman-Ford", "Tarjan's Bridges & Articulation Points", "Network Delay Time"]
  },
  21: { 
    title: "Advanced Arrays & Graph Extensions", 
    topic: "Boyer-Moore Voting & Range Queries",
    description: "Majority element linear voting, sweep-line coordinate geometry, and multi-dimensional queries.",
    concepts: ["Boyer-Moore Voting", "Sweep-Line Geometry", "Sparse Tables", "Coordinate Compression"]
  },
  22: { 
    title: "Advanced Binary Search, Trie & String", 
    topic: "Prefix Trees & Continuous Predicates",
    description: "Trie prefix structures, search suggestion engines, and binary search on continuous answers.",
    concepts: ["Trie Insertion & Search", "Prefix Autocomplete", "Continuous Binary Search", "KMP String Matching"]
  },
  23: { 
    title: "Advanced String, Design & Intervals", 
    topic: "Enterprise System Data Structures",
    description: "LRU/LFU caching structures, circular ring buffers, and flight booking timeline difference arrays.",
    concepts: ["LRU / LFU Cache Design", "Difference Arrays", "Circular Queues & Ring Buffers", "Custom Data Structures"]
  },
};
