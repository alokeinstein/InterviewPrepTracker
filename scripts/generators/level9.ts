import { LevelPayload, GeneratedProblem } from './types';
import { createProblem } from './problemBuilder';

export function getLevel9Payload(): LevelPayload {
  const problems: GeneratedProblem[] = [
    // 189. Kth Largest Element in an Array
    createProblem({
      num: 189,
      title: "Kth Largest Element in an Array",
      slug: "kth-largest-element-in-an-array",
      level: 9,
      difficulty: "MEDIUM",
      topic: "Heap / Quickselect",
      patternSlug: "heap-priority-queue",
      estimatedTimeMin: 20,
      statement: "Given an integer array `nums` and an integer `k`, return the `k-th` largest element in the array.\n\nNote that it is the `k-th` largest element in the sorted order, not the `k-th` distinct element.\n\nCan you solve it without sorting in O(n) average time?",
      functionName: "findKthLargest",
      parameters: [
        { name: "nums", type: "number[]", description: "Array of integers" },
        { name: "k", type: "number", description: "Target rank from largest" }
      ],
      returnType: "number",
      constraints: ["1 <= k <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
      examples: [
        { input: "nums = [3,2,1,5,6,4], k = 2", output: "5", explanation: "Sorted order is [1,2,3,4,5,6], second largest is 5." },
        { input: "nums = [3,2,3,1,2,4,5,5,6], k = 4", output: "4", explanation: "Sorted order is [1,2,2,3,3,4,5,5,6], 4th largest is 4." },
        { input: "nums = [1], k = 1", output: "1", explanation: "Single element is the 1st largest." },
        { input: "nums = [7,6,5,4,3,2,1], k = 5", output: "3", explanation: "The 5th largest element is 3." }
      ],
      optimalSolution: `function findKthLargest(nums, k) {\n  // Quickselect average O(N)\n  const targetIdx = nums.length - k;\n  function quickSelect(left, right) {\n    const pivot = nums[right];\n    let p = left;\n    for (let i = left; i < right; i++) {\n      if (nums[i] <= pivot) {\n        [nums[i], nums[p]] = [nums[p], nums[i]];\n        p++;\n      }\n    }\n    [nums[p], nums[right]] = [nums[right], nums[p]];\n    if (p === targetIdx) return nums[p];\n    if (p < targetIdx) return quickSelect(p + 1, right);\n    return quickSelect(left, p - 1);\n  }\n  return quickSelect(0, nums.length - 1);\n}`,
      optimalTimeComplexity: "O(N) average, O(N^2) worst-case",
      optimalSpaceComplexity: "O(1) in-place",
      suboptimalSolution: `function findKthLargest(nums, k) {\n  nums.sort((a, b) => b - a);\n  return nums[k - 1];\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: [
        "Finding the kth distinct element instead of kth element in duplicate-preserving sorted order",
        "Converting to Set which deletes duplicates and corrupts the rank count"
      ],
      hints: [
        "A min-heap of size k keeps the k largest elements. The root of the heap is the kth largest.",
        "Alternatively, Quickselect partitions the array around a pivot in O(N) average time."
      ],
      oracleFn: (nums: number[], k: number) => {
        const sorted = [...nums].sort((a, b) => b - a);
        return sorted[k - 1];
      },
      testCases: {
        functional: [
          [[3, 2, 1, 5, 6, 4], 2],
          [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4],
          [[1], 1],
          [[7, 6, 5, 4, 3, 2, 1], 5]
        ],
        boundary: [
          [[5, 5, 5, 5, 5], 1],
          [[5, 5, 5, 5, 5], 5],
          [[-1, -2, -3, -4], 2]
        ],
        adversarial: [
          [[1, 2, 3, 4, 5, 6], 1],
          [[1, 2, 3, 4, 5, 6], 6],
          [[-1000, 1000, 0, 50, -50], 3]
        ],
        stress: [
          [Array.from({ length: 500 }, (_, i) => i), 250],
          [Array.from({ length: 500 }, () => 42), 100]
        ]
      }
    }),

    // 190. Kth Smallest Element in a Sorted Matrix
    createProblem({
      num: 190,
      title: "Kth Smallest Element in a Sorted Matrix",
      slug: "kth-smallest-element-in-a-sorted-matrix",
      level: 9,
      difficulty: "MEDIUM",
      topic: "Heap / Binary Search",
      patternSlug: "heap-priority-queue",
      estimatedTimeMin: 25,
      statement: "Given an `n x n` `matrix` where each of the rows and columns is sorted in ascending order, return the `k-th` smallest element in the matrix.\n\nNote that it is the `k-th` smallest element in the sorted order, not the `k-th` distinct element.\n\nYou must find a solution with a memory complexity better than O(n^2).",
      functionName: "kthSmallest",
      parameters: [
        { name: "matrix", type: "number[][]", description: "n x n sorted matrix" },
        { name: "k", type: "number", description: "Target rank from smallest" }
      ],
      returnType: "number",
      constraints: ["n == matrix.length == matrix[i].length", "1 <= n <= 300", "-10^9 <= matrix[i][j] <= 10^9", "All rows and columns are sorted in ascending order.", "1 <= k <= n^2"],
      examples: [
        {
          input: "matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8",
          output: "13",
          explanation: "Elements in sorted order: [1, 5, 9, 10, 11, 12, 13, 13, 15]. 8th smallest is 13."
        },
        {
          input: "matrix = [[-5]], k = 1",
          output: "-5",
          explanation: "Single element matrix."
        },
        {
          input: "matrix = [[1,2],[1,3]], k = 2",
          output: "1",
          explanation: "Sorted order: [1, 1, 2, 3]. 2nd smallest is 1."
        },
        {
          input: "matrix = [[1,4],[2,5]], k = 4",
          output: "5",
          explanation: "Largest element in 2x2 matrix is 5."
        }
      ],
      optimalSolution: `function kthSmallest(matrix, k) {\n  const n = matrix.length;\n  let left = matrix[0][0], right = matrix[n - 1][n - 1];\n  function countLessEqual(mid) {\n    let count = 0, c = n - 1;\n    for (let r = 0; r < n; r++) {\n      while (c >= 0 && matrix[r][c] > mid) c--;\n      count += (c + 1);\n    }\n    return count;\n  }\n  while (left < right) {\n    const mid = Math.floor(left + (right - left) / 2);\n    if (countLessEqual(mid) < k) left = mid + 1;\n    else right = mid;\n  }\n  return left;\n}`,
      optimalTimeComplexity: "O(N log(max - min))",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function kthSmallest(matrix, k) {\n  const flat = matrix.flat().sort((a, b) => a - b);\n  return flat[k - 1];\n}`,
      suboptimalTimeComplexity: "O(N^2 log(N^2))",
      suboptimalSpaceComplexity: "O(N^2)",
      commonMistakes: [
        "Flattening the matrix and sorting, violating the memory complexity requirement",
        "Binary searching on index rather than on value range [matrix[0][0], matrix[n-1][n-1]]"
      ],
      hints: [
        "The minimum element is `matrix[0][0]` and maximum is `matrix[n-1][n-1]`.",
        "Binary search for the answer in the range `[left, right]`.",
        "For a candidate `mid`, count elements `<= mid` in O(N) by traversing from top-right to bottom-left."
      ],
      oracleFn: (matrix: number[][], k: number) => {
        const flat: number[] = [];
        for (const row of matrix) for (const v of row) flat.push(v);
        flat.sort((a, b) => a - b);
        return flat[k - 1];
      },
      testCases: {
        functional: [
          [[[1, 5, 9], [10, 11, 13], [12, 13, 15]], 8],
          [[[-5]], 1],
          [[[1, 2], [1, 3]], 2],
          [[[1, 4], [2, 5]], 4]
        ],
        boundary: [
          [[[1, 2], [3, 4]], 1],
          [[[1, 2], [3, 4]], 4],
          [[[10, 20, 30], [15, 25, 35], [20, 30, 40]], 5]
        ],
        adversarial: [
          [[[1, 1, 1], [1, 1, 1], [1, 1, 1]], 5],
          [[[-10, -5], [-3, 0]], 3],
          [[[1, 3, 5], [6, 7, 12], [11, 14, 14]], 6]
        ],
        stress: [
          [Array.from({ length: 20 }, (_, r) => Array.from({ length: 20 }, (_, c) => r * 20 + c)), 200],
          [Array.from({ length: 20 }, () => Array.from({ length: 20 }, () => 1)), 150]
        ]
      }
    }),

    // 191. K Closest Points to Origin
    createProblem({
      num: 191,
      title: "K Closest Points to Origin",
      slug: "k-closest-points-to-origin",
      level: 9,
      difficulty: "MEDIUM",
      topic: "Heap / Quickselect",
      patternSlug: "heap-priority-queue",
      estimatedTimeMin: 20,
      statement: "Given an array of `points` where `points[i] = [x_i, y_i]` represents a point on the X-Y plane and an integer `k`, return the `k` closest points to the origin `(0, 0)`.\n\nThe distance between two points on the X-Y plane is the Euclidean distance (`√(x1 - x2)^2 + (y1 - y2)^2`).\n\nYou may return the answer in any order. The answer is guaranteed to be unique (except for the order that it is in).",
      functionName: "kClosest",
      parameters: [
        { name: "points", type: "number[][]", description: "Array of [x, y] coordinates" },
        { name: "k", type: "number", description: "Number of closest points to return" }
      ],
      returnType: "number[][]",
      constraints: ["1 <= k <= points.length <= 10^4", "-10^4 < x_i, y_i < 10^4"],
      examples: [
        {
          input: "points = [[1,3],[-2,2]], k = 1",
          output: "[[-2,2]]",
          explanation: "Distance (1,3) is sqrt(10). Distance (-2,2) is sqrt(8). Since sqrt(8) < sqrt(10), [-2,2] is closer."
        },
        {
          input: "points = [[3,3],[5,-1],[-2,4]], k = 2",
          output: "[[3,3],[-2,4]]",
          explanation: "Points [3,3] (dist 18) and [-2,4] (dist 20) are the 2 closest."
        },
        {
          input: "points = [[0,1],[1,0]], k = 2",
          output: "[[0,1],[1,0]]",
          explanation: "Both have distance 1."
        },
        {
          input: "points = [[2,2]], k = 1",
          output: "[[2,2]]",
          explanation: "Single point returned."
        }
      ],
      optimalSolution: `function kClosest(points, k) {\n  // Using Euclidean squared distance to avoid floating point square roots\n  points.sort((a, b) => (a[0]*a[0] + a[1]*a[1]) - (b[0]*b[0] + b[1]*b[1]));\n  return points.slice(0, k);\n}`,
      optimalTimeComplexity: "O(N log N) or O(N) with Quickselect",
      optimalSpaceComplexity: "O(k)",
      suboptimalSolution: `function kClosest(points, k) {\n  const dists = points.map(p => ({ point: p, dist: Math.sqrt(p[0]**2 + p[1]**2) }));\n  dists.sort((a, b) => a.dist - b.dist);\n  return dists.slice(0, k).map(x => x.point);\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Computing square root Math.sqrt which introduces floating point imprecision and performance overhead",
        "Returning empty array when k equals points.length"
      ],
      hints: [
        "The Euclidean distance is `sqrt(x^2 + y^2)`. Since `sqrt` is monotonically increasing, comparing `x^2 + y^2` gives identical relative order.",
        "Sort points by `x^2 + y^2` and take the first `k` elements."
      ],
      oracleFn: (points: number[][], k: number) => {
        const sorted = [...points].sort((a, b) => (a[0] * a[0] + a[1] * a[1]) - (b[0] * b[0] + b[1] * b[1]));
        return sorted.slice(0, k);
      },
      testCases: {
        functional: [
          [[[1, 3], [-2, 2]], 1],
          [[[3, 3], [5, -1], [-2, 4]], 2],
          [[[0, 1], [1, 0]], 2],
          [[[2, 2]], 1]
        ],
        boundary: [
          [[[0, 0]], 1],
          [[[10, 10], [-10, -10]], 1],
          [[[1, 2], [2, 1], [-1, -2]], 3]
        ],
        adversarial: [
          [[[1, 3], [-2, 2], [2, -2]], 2],
          [[[6, 10], [-3, 3], [-2, 5], [0, 2]], 3],
          [[[-5, 4], [-6, -5], [4, 6]], 2]
        ],
        stress: [
          [Array.from({ length: 400 }, (_, i) => [i, i]), 50],
          [Array.from({ length: 400 }, (_, i) => [400 - i, 400 - i]), 100]
        ]
      }
    }),

    // 192. Find K Pairs with Smallest Sums
    createProblem({
      num: 192,
      title: "Find K Pairs with Smallest Sums",
      slug: "find-k-pairs-with-smallest-sums",
      level: 9,
      difficulty: "MEDIUM",
      topic: "Heap / Priority Queue",
      patternSlug: "heap-priority-queue",
      estimatedTimeMin: 25,
      statement: "You are given two integer arrays `nums1` and `nums2` sorted in ascending order and an integer `k`.\n\nDefine a pair `(u, v)` which consists of one element from `nums1` and one element from `nums2`.\n\nReturn the `k` pairs `(u_1, v_1), (u_2, v_2), ..., (u_k, v_k)` with the smallest sums.",
      functionName: "kSmallestPairs",
      parameters: [
        { name: "nums1", type: "number[]", description: "First sorted array" },
        { name: "nums2", type: "number[]", description: "Second sorted array" },
        { name: "k", type: "number", description: "Number of smallest pairs to return" }
      ],
      returnType: "number[][]",
      constraints: ["1 <= nums1.length, nums2.length <= 10^5", "-10^9 <= nums1[i], nums2[i] <= 10^9", "nums1 and nums2 are sorted in ascending order", "1 <= k <= 10^4"],
      examples: [
        {
          input: "nums1 = [1,7,11], nums2 = [2,4,6], k = 3",
          output: "[[1,2],[1,4],[1,6]]",
          explanation: "The first 3 pairs are returned from the sequence of smallest sums: [1,2],[1,4],[1,6],[7,2],[7,4],[11,2],[7,6],[11,4],[11,6]."
        },
        {
          input: "nums1 = [1,1,2], nums2 = [1,2,3], k = 2",
          output: "[[1,1],[1,1]]",
          explanation: "The first 2 pairs with smallest sums: [1,1],[1,1]."
        },
        {
          input: "nums1 = [1,2], nums2 = [3], k = 3",
          output: "[[1,3],[2,3]]",
          explanation: "All possible pairs returned since k > total pairs."
        },
        {
          input: "nums1 = [1], nums2 = [1], k = 1",
          output: "[[1,1]]",
          explanation: "Single pair."
        }
      ],
      optimalSolution: `function kSmallestPairs(nums1, nums2, k) {\n  const res = [];\n  if (!nums1.length || !nums2.length || k === 0) return res;\n  // Min-heap simulation with indices [i, j]\n  // We push [nums1[i] + nums2[0], i, 0] for i = 0..min(k, nums1.length)-1\n  const pq = [];\n  for (let i = 0; i < Math.min(nums1.length, k); i++) {\n    pq.push([nums1[i] + nums2[0], i, 0]);\n  }\n  pq.sort((a, b) => a[0] - b[0]);\n  while (pq.length > 0 && res.length < k) {\n    const [sum, i, j] = pq.shift();\n    res.push([nums1[i], nums2[j]]);\n    if (j + 1 < nums2.length) {\n      const nextItem = [nums1[i] + nums2[j + 1], i, j + 1];\n      // Binary search insertion into sorted array to maintain heap property\n      let l = 0, r = pq.length;\n      while (l < r) {\n        const m = (l + r) >> 1;\n        if (pq[m][0] < nextItem[0]) l = m + 1;\n        else r = m;\n      }\n      pq.splice(l, 0, nextItem);\n    }\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(k log(min(n, k)))",
      optimalSpaceComplexity: "O(min(n, k))",
      suboptimalSolution: `function kSmallestPairs(nums1, nums2, k) {\n  const all = [];\n  for (let i = 0; i < Math.min(nums1.length, k); i++) {\n    for (let j = 0; j < Math.min(nums2.length, k); j++) {\n      all.push([nums1[i], nums2[j]]);\n    }\n  }\n  all.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]));\n  return all.slice(0, k);\n}`,
      suboptimalTimeComplexity: "O(k^2 log(k^2))",
      suboptimalSpaceComplexity: "O(k^2)",
      commonMistakes: [
        "Generating all N * M pairs causing Out Of Memory when N, M = 10^5",
        "Re-inserting already processed pairs into the priority queue"
      ],
      hints: [
        "Initialize the priority queue with pairs `(nums1[i], nums2[0])` for `0 <= i < min(nums1.length, k)`.",
        "Pop the smallest pair `(nums1[i], nums2[j])`, and insert its successor `(nums1[i], nums2[j + 1])`."
      ],
      oracleFn: (nums1: number[], nums2: number[], k: number) => {
        const res: [number, number][] = [];
        if (!nums1.length || !nums2.length || k === 0) return res;
        const pq: [number, number, number][] = [];
        for (let i = 0; i < Math.min(nums1.length, k); i++) {
          pq.push([nums1[i] + nums2[0], i, 0]);
        }
        pq.sort((a, b) => a[0] - b[0]);
        while (pq.length > 0 && res.length < k) {
          const [sum, i, j] = pq.shift()!;
          res.push([nums1[i], nums2[j]]);
          if (j + 1 < nums2.length) {
            const nextItem: [number, number, number] = [nums1[i] + nums2[j + 1], i, j + 1];
            let l = 0, r = pq.length;
            while (l < r) {
              const m = (l + r) >> 1;
              if (pq[m][0] < nextItem[0]) l = m + 1;
              else r = m;
            }
            pq.splice(l, 0, nextItem);
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [[1, 7, 11], [2, 4, 6], 3],
          [[1, 1, 2], [1, 2, 3], 2],
          [[1, 2], [3], 3],
          [[1], [1], 1]
        ],
        boundary: [
          [[1, 2, 3], [4], 1],
          [[1], [1, 2, 3], 2],
          [[1, 2], [3, 4], 4]
        ],
        adversarial: [
          [[1, 2, 4, 5, 6], [3, 5, 7, 9], 20],
          [[-10, -5, 0], [-2, 3, 5], 4],
          [[1, 1, 1], [1, 1, 1], 5]
        ],
        stress: [
          [Array.from({ length: 300 }, (_, i) => i + 1), Array.from({ length: 300 }, (_, i) => i + 1), 30],
          [Array.from({ length: 300 }, () => 5), Array.from({ length: 300 }, () => 10), 25]
        ]
      }
    }),

    // 193. Find Median from Data Stream (DESIGN)
    createProblem({
      num: 193,
      title: "Find Median from Data Stream",
      slug: "find-median-from-data-stream",
      level: 9,
      difficulty: "HARD",
      topic: "Heap / Design",
      patternSlug: "heap-priority-queue",
      estimatedTimeMin: 30,
      statement: "The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.\n\nImplement the `MedianFinder` class:\n- `MedianFinder()` initializes the `MedianFinder` object.\n- `void addNum(int num)` adds the integer `num` from the data stream to the data structure.\n- `double findMedian()` returns the median of all elements so far. Answers within `10^-5` of the actual answer will be accepted.",
      executionModel: "DESIGN",
      functionName: "MedianFinder",
      parameters: [
        { name: "commands", type: "string[]", description: "Array of operations: ['MedianFinder', 'addNum', 'findMedian']" },
        { name: "args", type: "any[]", description: "Arguments for each operation" }
      ],
      returnType: "any[]",
      starterTemplates: {
        javascript: `class MedianFinder {\n  constructor() {\n    // Initialize data structures\n  }\n  /**\n   * @param {number} num\n   * @return {void}\n   */\n  addNum(num) {}\n  /**\n   * @return {number}\n   */\n  findMedian() {}\n}\n`,
        typescript: `class MedianFinder {\n  constructor() {}\n  addNum(num: number): void {}\n  findMedian(): number { throw new Error("Not implemented"); }\n}\n`,
        python: `class MedianFinder:\n    def __init__(self):\n        pass\n    def addNum(self, num: int) -> None:\n        pass\n    def findMedian(self) -> float:\n        pass\n`
      },
      constraints: ["-10^5 <= num <= 10^5", "There will be at least one element in the data structure before calling findMedian.", "At most 5 * 10^4 calls will be made to addNum and findMedian."],
      examples: [
        {
          input: 'commands = ["MedianFinder","addNum","addNum","findMedian","addNum","findMedian"]\nargs = [[],[1],[2],[],[3],[]]',
          output: "[null,null,null,1.5,null,2]",
          explanation: "MedianFinder mf = new MedianFinder();\nmf.addNum(1);\nmf.addNum(2);\nmf.findMedian(); // return 1.5 (average of 1 and 2)\nmf.addNum(3);\nmf.findMedian(); // return 2.0"
        },
        {
          input: 'commands = ["MedianFinder","addNum","findMedian"]\nargs = [[],[5],[]]',
          output: "[null,null,5]",
          explanation: "Single number 5 has median 5."
        },
        {
          input: 'commands = ["MedianFinder","addNum","addNum","findMedian"]\nargs = [[],[10],[20],[]]',
          output: "[null,null,null,15]",
          explanation: "Two elements [10, 20]: median is (10 + 20) / 2 = 15."
        },
        {
          input: 'commands = ["MedianFinder","addNum","addNum","addNum","addNum","findMedian"]\nargs = [[],[6],[10],[2],[6],[]]',
          output: "[null,null,null,null,null,6]",
          explanation: "Sorted [2, 6, 6, 10]: median is (6 + 6) / 2 = 6."
        }
      ],
      optimalSolution: `class MedianFinder {\n  constructor() {\n    this.arr = [];\n  }\n  addNum(num) {\n    let l = 0, r = this.arr.length;\n    while (l < r) {\n      const m = (l + r) >> 1;\n      if (this.arr[m] < num) l = m + 1;\n      else r = m;\n    }\n    this.arr.splice(l, 0, num);\n  }\n  findMedian() {\n    const n = this.arr.length;\n    const m = Math.floor(n / 2);\n    if (n % 2 === 1) return this.arr[m];\n    return (this.arr[m - 1] + this.arr[m]) / 2;\n  }\n}`,
      optimalTimeComplexity: "O(log N) search + O(N) insertion for addNum; O(1) for findMedian",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `class MedianFinder {\n  constructor() {\n    this.arr = [];\n  }\n  addNum(num) {\n    this.arr.push(num);\n  }\n  findMedian() {\n    this.arr.sort((a, b) => a - b);\n    const m = Math.floor(this.arr.length / 2);\n    if (this.arr.length % 2 === 1) return this.arr[m];\n    return (this.arr[m - 1] + this.arr[m]) / 2;\n  }\n}`,
      suboptimalTimeComplexity: "O(N log N) per findMedian",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Sorting array on every findMedian call causing O(N log N) latency",
        "Using integer division instead of floating point when calculating the average of two middle elements"
      ],
      hints: [
        "Two heaps: a max-heap for the lower half of numbers, and a min-heap for the upper half.",
        "Balance the sizes so that max-heap size is either equal to min-heap size or exceeds it by 1.",
        "If total count is odd, max-heap's root is the median. If even, average the roots."
      ],
      oracleFn: (commands: string[], args: any[]) => {
        class RefMedianFinder {
          arr: number[] = [];
          addNum(num: number) {
            let l = 0, r = this.arr.length;
            while (l < r) {
              const m = (l + r) >> 1;
              if (this.arr[m] < num) l = m + 1;
              else r = m;
            }
            this.arr.splice(l, 0, num);
          }
          findMedian(): number {
            const n = this.arr.length;
            const m = Math.floor(n / 2);
            if (n % 2 === 1) return this.arr[m];
            return (this.arr[m - 1] + this.arr[m]) / 2;
          }
        }
        let mf: RefMedianFinder | null = null;
        const res: any[] = [];
        for (let i = 0; i < commands.length; i++) {
          const cmd = commands[i];
          if (cmd === 'MedianFinder') {
            mf = new RefMedianFinder();
            res.push(null);
          } else if (cmd === 'addNum') {
            mf!.addNum(args[i][0]);
            res.push(null);
          } else if (cmd === 'findMedian') {
            res.push(mf!.findMedian());
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"], [[], [1], [2], [], [3], []]],
          [["MedianFinder", "addNum", "findMedian"], [[], [5], []]],
          [["MedianFinder", "addNum", "addNum", "findMedian"], [[], [10], [20], []]],
          [["MedianFinder", "addNum", "addNum", "addNum", "addNum", "findMedian"], [[], [6], [10], [2], [6], []]]
        ],
        boundary: [
          [["MedianFinder", "addNum", "findMedian", "addNum", "findMedian"], [[], [-1], [], [-2], []]],
          [["MedianFinder", "addNum", "addNum", "addNum", "findMedian"], [[], [0], [0], [0], []]],
          [["MedianFinder", "addNum", "addNum", "findMedian"], [[], [100000], [-100000], []]]
        ],
        adversarial: [
          [["MedianFinder", "addNum", "findMedian", "addNum", "findMedian", "addNum", "findMedian", "addNum", "findMedian"], [[], [5], [], [15], [], [1], [], [3], []]],
          [["MedianFinder", "addNum", "addNum", "addNum", "addNum", "addNum", "findMedian"], [[], [1], [2], [3], [4], [5], []]],
          [["MedianFinder", "addNum", "addNum", "addNum", "addNum", "findMedian"], [[], [5], [4], [3], [2], []]]
        ],
        stress: [
          [["MedianFinder", ...Array.from({ length: 200 }, () => "addNum"), "findMedian"], [[], ...Array.from({ length: 200 }, (_, i) => [i]), []]],
          [["MedianFinder", ...Array.from({ length: 150 }, (_, i) => i % 2 === 0 ? "addNum" : "findMedian")], [[], ...Array.from({ length: 150 }, (_, i) => i % 2 === 0 ? [i] : [])]]
        ]
      }
    }),

    // 194. Last Stone Weight
    createProblem({
      num: 194,
      title: "Last Stone Weight",
      slug: "last-stone-weight",
      level: 9,
      difficulty: "EASY",
      topic: "Heap / Priority Queue",
      patternSlug: "heap-priority-queue",
      estimatedTimeMin: 15,
      statement: "You are given an array of integers `stones` where `stones[i]` is the weight of the `i-th` stone.\n\nWe are playing a game with the stones. On each turn, we choose the heaviest two stones and smash them together. Suppose the heaviest two stones have weights `x` and `y` with `x <= y`:\n- If `x == y`, both stones are destroyed.\n- If `x != y`, the stone of weight `x` is destroyed, and the stone of weight `y` has new weight `y - x`.\n\nAt the end of the game, there is at most one stone left. Return the weight of the last remaining stone. If there are no stones left, return `0`.",
      functionName: "lastStoneWeight",
      parameters: [{ name: "stones", type: "number[]", description: "Array of stone weights" }],
      returnType: "number",
      constraints: ["1 <= stones.length <= 30", "1 <= stones[i] <= 1000"],
      examples: [
        {
          input: "stones = [2,7,4,1,8,1]",
          output: "1",
          explanation: "Smash 7 and 8 -> 1. Stones: [2,4,1,1,1]. Smash 2 and 4 -> 2. Stones: [2,1,1,1]. Smash 2 and 1 -> 1. Stones: [1,1,1]. Smash 1 and 1 -> 0. Stones: [1]. Return 1."
        },
        {
          input: "stones = [1]",
          output: "1",
          explanation: "Single stone remains."
        },
        {
          input: "stones = [2,2]",
          output: "0",
          explanation: "Equal stones both destroy each other."
        },
        {
          input: "stones = [3,7,2]",
          output: "2",
          explanation: "7 and 3 smash to 4; 4 and 2 smash to 2."
        }
      ],
      optimalSolution: `function lastStoneWeight(stones) {\n  stones.sort((a, b) => a - b);\n  while (stones.length > 1) {\n    const y = stones.pop();\n    const x = stones.pop();\n    if (y > x) {\n      const diff = y - x;\n      let l = 0, r = stones.length;\n      while (l < r) {\n        const m = (l + r) >> 1;\n        if (stones[m] < diff) l = m + 1;\n        else r = m;\n      }\n      stones.splice(l, 0, diff);\n    }\n  }\n  return stones.length === 1 ? stones[0] : 0;\n}`,
      optimalTimeComplexity: "O(N log N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function lastStoneWeight(stones) {\n  while (stones.length > 1) {\n    stones.sort((a, b) => a - b);\n    const y = stones.pop();\n    const x = stones.pop();\n    if (y !== x) stones.push(y - x);\n  }\n  return stones.length === 1 ? stones[0] : 0;\n}`,
      suboptimalTimeComplexity: "O(N^2 log N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: [
        "Returning empty array or undefined when all stones annihilate instead of returning 0",
        "Popping stones in wrong order assuming x >= y"
      ],
      hints: [
        "Use a max-heap to extract the two heaviest stones in O(log N) time.",
        "If their difference is non-zero, push the difference back into the heap.",
        "When the heap has fewer than 2 elements, return the remaining stone or 0."
      ],
      oracleFn: (stones: number[]) => {
        const arr = [...stones].sort((a, b) => a - b);
        while (arr.length > 1) {
          const y = arr.pop()!;
          const x = arr.pop()!;
          if (y > x) {
            const diff = y - x;
            let l = 0, r = arr.length;
            while (l < r) {
              const m = (l + r) >> 1;
              if (arr[m] < diff) l = m + 1;
              else r = m;
            }
            arr.splice(l, 0, diff);
          }
        }
        return arr.length === 1 ? arr[0] : 0;
      },
      testCases: {
        functional: [
          [[2, 7, 4, 1, 8, 1]],
          [[1]],
          [[2, 2]],
          [[3, 7, 2]]
        ],
        boundary: [
          [[1000]],
          [[1000, 1000]],
          [[1, 2, 3, 4, 5, 6]]
        ],
        adversarial: [
          [[10, 4, 2, 10]],
          [[9, 3, 2, 10]],
          [[31, 26, 33, 21, 40]]
        ],
        stress: [
          [Array.from({ length: 30 }, (_, i) => i + 1)],
          [Array.from({ length: 30 }, () => 100)]
        ]
      }
    }),

    // 195. Last Stone Weight II
    createProblem({
      num: 195,
      title: "Last Stone Weight II",
      slug: "last-stone-weight-ii",
      level: 9,
      difficulty: "MEDIUM",
      topic: "Dynamic Programming / Knapsack",
      patternSlug: "heap-priority-queue",
      estimatedTimeMin: 25,
      statement: "You are given an array of integers `stones` where `stones[i]` is the weight of the `i-th` stone.\n\nWe can combine any two stones of weights `x` and `y` with `x <= y`, yielding a new stone of weight `y - x`.\n\nReturn the smallest possible weight of the left stone. If there are no stones left, return `0`.",
      functionName: "lastStoneWeightII",
      parameters: [{ name: "stones", type: "number[]", description: "Array of stone weights" }],
      returnType: "number",
      constraints: ["1 <= stones.length <= 30", "1 <= stones[i] <= 100"],
      examples: [
        {
          input: "stones = [2,7,4,1,8,1]",
          output: "1",
          explanation: "Divide into two subsets [2, 7, 1, 1] (sum 11) and [4, 8] (sum 12). Difference is 12 - 11 = 1."
        },
        {
          input: "stones = [31,26,33,21,40]",
          output: "5",
          explanation: "Partition into [26, 40, 21] (sum 87) and [31, 33] (sum 64) -> difference 5."
        },
        {
          input: "stones = [1,2]",
          output: "1",
          explanation: "2 - 1 = 1."
        },
        {
          input: "stones = [1]",
          output: "1",
          explanation: "Single stone remains 1."
        }
      ],
      optimalSolution: `function lastStoneWeightII(stones) {\n  const total = stones.reduce((a, b) => a + b, 0);\n  const target = Math.floor(total / 2);\n  const dp = new Array(target + 1).fill(false);\n  dp[0] = true;\n  for (const s of stones) {\n    for (let j = target; j >= s; j--) {\n      dp[j] = dp[j] || dp[j - s];\n    }\n  }\n  for (let j = target; j >= 0; j--) {\n    if (dp[j]) return total - 2 * j;\n  }\n  return 0;\n}`,
      optimalTimeComplexity: "O(N * sum)",
      optimalSpaceComplexity: "O(sum)",
      suboptimalSolution: `function lastStoneWeightII(stones) {\n  // Recursion with all subset sums\n  const total = stones.reduce((a, b) => a + b, 0);\n  let minDiff = total;\n  function backtrack(idx, curSum) {\n    if (idx === stones.length) {\n      minDiff = Math.min(minDiff, Math.abs(total - 2 * curSum));\n      return;\n    }\n    backtrack(idx + 1, curSum + stones[idx]);\n    backtrack(idx + 1, curSum);\n  }\n  backtrack(0, 0);\n  return minDiff;\n}`,
      suboptimalTimeComplexity: "O(2^N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Treating this as a greedy simulation like Last Stone Weight I (here we choose arbitrary pairs, so it's a subset sum partition problem)",
        "Iterating forward in 1D DP causing items to be reused multiple times"
      ],
      hints: [
        "Any sequence of smashes corresponds to assigning each stone a `+` or `-` sign.",
        "This reduces to partitioning stones into two subsets with minimum sum difference (0/1 Knapsack).",
        "Find the maximum subset sum `<= total / 2`."
      ],
      oracleFn: (stones: number[]) => {
        const total = stones.reduce((a, b) => a + b, 0);
        const target = Math.floor(total / 2);
        const dp = new Array(target + 1).fill(false);
        dp[0] = true;
        for (const s of stones) {
          for (let j = target; j >= s; j--) {
            dp[j] = dp[j] || dp[j - s];
          }
        }
        for (let j = target; j >= 0; j--) {
          if (dp[j]) return total - 2 * j;
        }
        return 0;
      },
      testCases: {
        functional: [
          [[2, 7, 4, 1, 8, 1]],
          [[31, 26, 33, 21, 40]],
          [[1, 2]],
          [[1]]
        ],
        boundary: [
          [[100]],
          [[100, 100]],
          [[1, 1, 1, 1]]
        ],
        adversarial: [
          [[21, 60, 61, 20, 31]],
          [[14, 1, 7, 17, 8, 10]],
          [[1, 1, 2, 3, 5, 8, 13, 21]]
        ],
        stress: [
          [Array.from({ length: 30 }, () => 100)],
          [Array.from({ length: 30 }, (_, i) => (i % 10) + 1)]
        ]
      }
    }),

    // 196. Reorganize String
    createProblem({
      num: 196,
      title: "Reorganize String",
      slug: "reorganize-string",
      level: 9,
      difficulty: "MEDIUM",
      topic: "Heap / Greedy",
      patternSlug: "heap-priority-queue",
      estimatedTimeMin: 25,
      statement: "Given a string `s`, rearrange the characters of `s` so that any two adjacent characters are not the same.\n\nReturn any possible rearrangement of `s` or return `\"\"` if not possible.",
      functionName: "reorganizeString",
      parameters: [{ name: "s", type: "string", description: "Input string" }],
      returnType: "string",
      constraints: ["1 <= s.length <= 500", "s consists of lowercase English letters."],
      examples: [
        { input: 's = "aab"', output: '"aba"', explanation: "No two adjacent letters are equal." },
        { input: 's = "aaab"', output: '""', explanation: "Letter 'a' occurs 3 times in length 4, exceeding ceil(4/2) = 2. Impossible." },
        { input: 's = "vvvlo"', output: '"vlvov"', explanation: "'v' is separated by other characters." },
        { input: 's = "a"', output: '"a"', explanation: "Single character is valid." }
      ],
      optimalSolution: `function reorganizeString(s) {\n  const freq = new Array(26).fill(0);\n  for (let i = 0; i < s.length; i++) freq[s.charCodeAt(i) - 97]++;\n  const maxFreq = Math.max(...freq);\n  if (maxFreq > Math.ceil(s.length / 2)) return "";\n  const chars = [];\n  for (let i = 0; i < 26; i++) {\n    if (freq[i] > 0) chars.push({ ch: String.fromCharCode(97 + i), count: freq[i] });\n  }\n  chars.sort((a, b) => b.count - a.count);\n  const res = new Array(s.length);\n  let idx = 0;\n  for (const { ch, count } of chars) {\n    for (let k = 0; k < count; k++) {\n      if (idx >= s.length) idx = 1;\n      res[idx] = ch;\n      idx += 2;\n    }\n  }\n  return res.join("");\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function reorganizeString(s) {\n  // Priority queue max-heap character selection\n  const counts = {};\n  for (const ch of s) counts[ch] = (counts[ch] || 0) + 1;\n  const pq = Object.keys(counts).map(ch => [ch, counts[ch]]);\n  pq.sort((a, b) => b[1] - a[1]);\n  if (pq[0][1] > Math.ceil(s.length / 2)) return "";\n  let res = "";\n  let prev = ["", 0];\n  while (pq.length > 0) {\n    const cur = pq.shift();\n    res += cur[0];\n    cur[1]--;\n    if (prev[1] > 0) pq.push(prev);\n    pq.sort((a, b) => b[1] - a[1]);\n    prev = cur;\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N * 26 log 26)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Not returning empty string when the most frequent character exceeds (N + 1) / 2",
        "Placing identical adjacent characters when placing the most frequent characters on odd indices first"
      ],
      hints: [
        "If any character count is strictly greater than `(n + 1) / 2`, it is impossible to separate them.",
        "Sort characters by frequency.",
        "Fill the even indices `0, 2, 4, ...` first with the most frequent characters, then fill odd indices `1, 3, 5, ...`."
      ],
      oracleFn: (s: string) => {
        const freq = new Array(26).fill(0);
        for (let i = 0; i < s.length; i++) freq[s.charCodeAt(i) - 97]++;
        const maxFreq = Math.max(...freq);
        if (maxFreq > Math.ceil(s.length / 2)) return "";
        const chars: { ch: string; count: number }[] = [];
        for (let i = 0; i < 26; i++) {
          if (freq[i] > 0) chars.push({ ch: String.fromCharCode(97 + i), count: freq[i] });
        }
        chars.sort((a, b) => b.count - a.count);
        const res = new Array(s.length);
        let idx = 0;
        for (const { ch, count } of chars) {
          for (let k = 0; k < count; k++) {
            if (idx >= s.length) idx = 1;
            res[idx] = ch;
            idx += 2;
          }
        }
        return res.join("");
      },
      testCases: {
        functional: [
          ["aab"],
          ["aaab"],
          ["vvvlo"],
          ["a"]
        ],
        boundary: [
          ["aa"],
          ["ab"],
          ["aba"]
        ],
        adversarial: [
          ["baaba"],
          ["todrnagw"],
          ["kkkkzrsmjc"]
        ],
        stress: [
          ["a".repeat(150) + "b".repeat(150)],
          ["abcdefghijklmnopqrstuvwxyz".repeat(15)]
        ]
      }
    }),

    // 197. Ugly Number II
    createProblem({
      num: 197,
      title: "Ugly Number II",
      slug: "ugly-number-ii",
      level: 9,
      difficulty: "MEDIUM",
      topic: "Heap / Dynamic Programming",
      patternSlug: "heap-priority-queue",
      estimatedTimeMin: 20,
      statement: "An ugly number is a positive integer whose prime factors are limited to `2`, `3`, and `5`.\n\nGiven an integer `n`, return the `n-th` ugly number.",
      functionName: "nthUglyNumber",
      parameters: [{ name: "n", type: "number", description: "Target index (1-indexed)" }],
      returnType: "number",
      constraints: ["1 <= n <= 1690"],
      examples: [
        { input: "n = 10", output: "12", explanation: "[1, 2, 3, 4, 5, 6, 8, 9, 10, 12] is the sequence of the first 10 ugly numbers." },
        { input: "n = 1", output: "1", explanation: "1 has no prime factors, therefore all of its prime factors are in the set [2, 3, 5]." },
        { input: "n = 11", output: "15", explanation: "The 11th ugly number is 15." },
        { input: "n = 15", output: "24", explanation: "The 15th ugly number is 24." }
      ],
      optimalSolution: `function nthUglyNumber(n) {\n  const ugly = new Array(n);\n  ugly[0] = 1;\n  let i2 = 0, i3 = 0, i5 = 0;\n  for (let i = 1; i < n; i++) {\n    const next2 = ugly[i2] * 2;\n    const next3 = ugly[i3] * 3;\n    const next5 = ugly[i5] * 5;\n    const next = Math.min(next2, next3, next5);\n    ugly[i] = next;\n    if (next === next2) i2++;\n    if (next === next3) i3++;\n    if (next === next5) i5++;\n  }\n  return ugly[n - 1];\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function nthUglyNumber(n) {\n  // Min-heap simulation\n  const seen = new Set([1]);\n  const pq = [1];\n  let cur = 1;\n  for (let i = 0; i < n; i++) {\n    pq.sort((a, b) => a - b);\n    cur = pq.shift();\n    for (const factor of [2, 3, 5]) {\n      const next = cur * factor;\n      if (!seen.has(next)) {\n        seen.add(next);\n        pq.push(next);\n      }\n    }\n  }\n  return cur;\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Checking every integer sequentially with prime factorization causing severe TLE",
        "Advancing only one pointer when multiple candidates match (e.g. 2*3 == 3*2 == 6), generating duplicates"
      ],
      hints: [
        "Every ugly number must be generated by multiplying a smaller ugly number by 2, 3, or 5.",
        "Maintain three pointers `i2, i3, i5` pointing to the indices of existing ugly numbers.",
        "Next ugly number is `min(ugly[i2]*2, ugly[i3]*3, ugly[i5]*5)`. Advance all pointers whose product equals this minimum."
      ],
      oracleFn: (n: number) => {
        const ugly = new Array(n);
        ugly[0] = 1;
        let i2 = 0, i3 = 0, i5 = 0;
        for (let i = 1; i < n; i++) {
          const next2 = ugly[i2] * 2;
          const next3 = ugly[i3] * 3;
          const next5 = ugly[i5] * 5;
          const next = Math.min(next2, next3, next5);
          ugly[i] = next;
          if (next === next2) i2++;
          if (next === next3) i3++;
          if (next === next5) i5++;
        }
        return ugly[n - 1];
      },
      testCases: {
        functional: [
          [10],
          [1],
          [11],
          [15]
        ],
        boundary: [
          [2],
          [3],
          [5]
        ],
        adversarial: [
          [100],
          [200],
          [500]
        ],
        stress: [
          [1000],
          [1690]
        ]
      }
    }),

    // 198. Top K Frequent Words
    createProblem({
      num: 198,
      title: "Top K Frequent Words",
      slug: "top-k-frequent-words",
      level: 9,
      difficulty: "MEDIUM",
      topic: "Heap / Hash Table / Sorting",
      patternSlug: "heap-priority-queue",
      estimatedTimeMin: 20,
      statement: "Given an array of strings `words` and an integer `k`, return the `k` most frequent strings.\n\nReturn the answer sorted by the frequency from highest to lowest. Sort the words with the same frequency by their lexicographical order.",
      functionName: "topKFrequent",
      parameters: [
        { name: "words", type: "string[]", description: "Array of words" },
        { name: "k", type: "number", description: "Number of top frequent words to return" }
      ],
      returnType: "string[]",
      constraints: ["1 <= words.length <= 500", "1 <= words[i].length <= 10", "words[i] consists of lowercase English letters.", "k is in the range [1, The number of unique words[i]]"],
      examples: [
        {
          input: 'words = ["i","love","leetcode","i","love","coding"], k = 2',
          output: '["i","love"]',
          explanation: '"i" and "love" are the two most frequent words. With the same frequency 2, "i" comes before "love" alphabetically.'
        },
        {
          input: 'words = ["the","day","is","sunny","the","the","the","sunny","is","is"], k = 4',
          output: '["the","is","sunny","day"]',
          explanation: '"the", "is", "sunny" and "day" are the four most frequent words, with the number of occurrence being 4, 3, 2 and 1 respectively.'
        },
        {
          input: 'words = ["single"], k = 1',
          output: '["single"]',
          explanation: 'Only one word present.'
        },
        {
          input: 'words = ["a","b","c"], k = 3',
          output: '["a","b","c"]',
          explanation: 'All have frequency 1, sorted lexicographically.'
        }
      ],
      optimalSolution: `function topKFrequent(words, k) {\n  const count = new Map();\n  for (const w of words) count.set(w, (count.get(w) || 0) + 1);\n  const unique = Array.from(count.keys());\n  unique.sort((a, b) => {\n    const diff = count.get(b) - count.get(a);\n    return diff !== 0 ? diff : a.localeCompare(b);\n  });\n  return unique.slice(0, k);\n}`,
      optimalTimeComplexity: "O(N log K)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function topKFrequent(words, k) {\n  const counts = {};\n  for (const w of words) counts[w] = (counts[w] || 0) + 1;\n  return Object.keys(counts)\n    .sort((a, b) => counts[b] - counts[a] || a.localeCompare(b))\n    .slice(0, k);\n}`,
      suboptimalTimeComplexity: "O(U log U) where U = unique words",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Sorting lexicographically in reverse order when frequencies are equal",
        "Using simple ASCII subtraction `b - a` on strings instead of `localeCompare`"
      ],
      hints: [
        "Count word frequencies with a hash map.",
        "Sort the unique words: first descending by frequency, then ascending lexicographically.",
        "Take the first `k` words."
      ],
      oracleFn: (words: string[], k: number) => {
        const count = new Map<string, number>();
        for (const w of words) count.set(w, (count.get(w) || 0) + 1);
        const unique = Array.from(count.keys());
        unique.sort((a, b) => {
          const diff = count.get(b)! - count.get(a)!;
          return diff !== 0 ? diff : a.localeCompare(b);
        });
        return unique.slice(0, k);
      },
      testCases: {
        functional: [
          [["i", "love", "leetcode", "i", "love", "coding"], 2],
          [["the", "day", "is", "sunny", "the", "the", "the", "sunny", "is", "is"], 4],
          [["single"], 1],
          [["a", "b", "c"], 3]
        ],
        boundary: [
          [["a", "a", "a"], 1],
          [["z", "a"], 2],
          [["apple", "banana", "apple"], 2]
        ],
        adversarial: [
          [["aaa", "aa", "a"], 3],
          [["a", "aa", "aaa", "aaaa"], 2],
          [["word", "word", "other", "other", "alpha", "alpha"], 3]
        ],
        stress: [
          [Array.from({ length: 400 }, (_, i) => `word${i % 20}`), 10],
          [Array.from({ length: 500 }, (_, i) => String.fromCharCode(97 + (i % 26))), 5]
        ]
      }
    }),

    // 199. IPO
    createProblem({
      num: 199,
      title: "IPO",
      slug: "ipo",
      level: 9,
      difficulty: "HARD",
      topic: "Heap / Greedy",
      patternSlug: "heap-priority-queue",
      estimatedTimeMin: 30,
      statement: "Suppose LeetCode will start its IPO soon. In order to sell a good price of its shares to Venture Capital, LeetCode would like to work on some projects to increase its capital before the IPO. Since it has limited resources, it can only finish at most `k` distinct projects before the IPO. Help LeetCode design the best way to maximize its total capital after finishing at most `k` distinct projects.\n\nYou are given `n` projects where the `i-th` project has a pure profit `profits[i]` and a minimum capital of `capital[i]` is needed to start it.\n\nInitially, you have `w` capital. When you finish a project, you will obtain its pure profit and the profit will be added to your total capital.\n\nPick a list of at most `k` distinct projects from given projects to maximize your final capital, and return the final maximized capital.",
      functionName: "findMaximizedCapital",
      parameters: [
        { name: "k", type: "number", description: "Maximum projects to execute" },
        { name: "w", type: "number", description: "Initial available capital" },
        { name: "profits", type: "number[]", description: "Array of pure profit per project" },
        { name: "capital", type: "number[]", description: "Array of capital required per project" }
      ],
      returnType: "number",
      constraints: ["1 <= k <= 10^5", "0 <= w <= 10^9", "n == profits.length == capital.length", "1 <= n <= 10^5", "0 <= profits[i] <= 10^4", "0 <= capital[i] <= 10^9"],
      examples: [
        {
          input: "k = 2, w = 0, profits = [1,2,3], capital = [0,1,1]",
          output: "4",
          explanation: "Since your initial capital is 0, you can only start project 0. After finishing it, capital becomes 0 + 1 = 1. With capital 1, start project 2 (cost 1, profit 3). Total capital = 1 + 3 = 4."
        },
        {
          input: "k = 3, w = 0, profits = [1,2,3], capital = [0,1,2]",
          output: "6",
          explanation: "Take project 0 -> cap 1; take project 1 -> cap 3; take project 2 -> cap 6."
        },
        {
          input: "k = 1, w = 2, profits = [1,2,3], capital = [1,1,2]",
          output: "5",
          explanation: "With capital 2, take project with max profit 3 -> 2 + 3 = 5."
        },
        {
          input: "k = 1, w = 0, profits = [1,2,3], capital = [1,2,3]",
          output: "0",
          explanation: "Cannot afford any project with 0 capital."
        }
      ],
      optimalSolution: `function findMaximizedCapital(k, w, profits, capital) {\n  const n = profits.length;\n  const projects = [];\n  for (let i = 0; i < n; i++) projects.push([capital[i], profits[i]]);\n  projects.sort((a, b) => a[0] - b[0]);\n  const maxHeap = [];\n  let pIdx = 0;\n  for (let step = 0; step < k; step++) {\n    while (pIdx < n && projects[pIdx][0] <= w) {\n      // Insert profit into sorted maxHeap array\n      const profit = projects[pIdx][1];\n      let l = 0, r = maxHeap.length;\n      while (l < r) {\n        const m = (l + r) >> 1;\n        if (maxHeap[m] > profit) l = m + 1;\n        else r = m;\n      }\n      maxHeap.splice(l, 0, profit);\n      pIdx++;\n    }\n    if (maxHeap.length === 0) break;\n    w += maxHeap.shift();\n  }\n  return w;\n}`,
      optimalTimeComplexity: "O(N log N + K log N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function findMaximizedCapital(k, w, profits, capital) {\n  const used = new Array(profits.length).fill(false);\n  for (let step = 0; step < k; step++) {\n    let bestIdx = -1;\n    for (let i = 0; i < profits.length; i++) {\n      if (!used[i] && capital[i] <= w) {\n        if (bestIdx === -1 || profits[i] > profits[bestIdx]) bestIdx = i;\n      }\n    }\n    if (bestIdx === -1) break;\n    used[bestIdx] = true;\n    w += profits[bestIdx];\n  }\n  return w;\n}`,
      suboptimalTimeComplexity: "O(K * N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Scanning all projects on every step O(K*N) leading to Time Limit Exceeded",
        "Selecting projects based on ratio profit/capital instead of max pure profit available"
      ],
      hints: [
        "Sort all projects by capital requirement ascending.",
        "Maintain a max-heap of profits for all projects that you can currently afford (`capital <= w`).",
        "Greedily pick the maximum profit from the heap and add it to `w`. Repeat up to `k` times."
      ],
      oracleFn: (k: number, w: number, profits: number[], capital: number[]) => {
        const n = profits.length;
        const projects: [number, number][] = [];
        for (let i = 0; i < n; i++) projects.push([capital[i], profits[i]]);
        projects.sort((a, b) => a[0] - b[0]);
        const maxHeap: number[] = [];
        let pIdx = 0;
        let curW = w;
        for (let step = 0; step < k; step++) {
          while (pIdx < n && projects[pIdx][0] <= curW) {
            const profit = projects[pIdx][1];
            let l = 0, r = maxHeap.length;
            while (l < r) {
              const m = (l + r) >> 1;
              if (maxHeap[m] > profit) l = m + 1;
              else r = m;
            }
            maxHeap.splice(l, 0, profit);
            pIdx++;
          }
          if (maxHeap.length === 0) break;
          curW += maxHeap.shift()!;
        }
        return curW;
      },
      testCases: {
        functional: [
          [2, 0, [1, 2, 3], [0, 1, 1]],
          [3, 0, [1, 2, 3], [0, 1, 2]],
          [1, 2, [1, 2, 3], [1, 1, 2]],
          [1, 0, [1, 2, 3], [1, 2, 3]]
        ],
        boundary: [
          [1, 10, [5], [5]],
          [2, 10, [1, 2], [10, 10]],
          [5, 0, [1, 2, 3], [0, 0, 0]]
        ],
        adversarial: [
          [10, 0, [10, 20, 30], [5, 5, 5]],
          [2, 1, [2, 3, 5], [0, 1, 2]],
          [3, 1, [1, 2, 3, 4], [1, 2, 3, 4]]
        ],
        stress: [
          [50, 0, Array.from({ length: 300 }, (_, i) => i + 1), Array.from({ length: 300 }, (_, i) => i)],
          [50, 1000, Array.from({ length: 300 }, () => 10), Array.from({ length: 300 }, () => 500)]
        ]
      }
    }),

    // 200. Maximum Performance of a Team
    createProblem({
      num: 200,
      title: "Maximum Performance of a Team",
      slug: "maximum-performance-of-a-team",
      level: 9,
      difficulty: "HARD",
      topic: "Heap / Greedy",
      patternSlug: "heap-priority-queue",
      estimatedTimeMin: 30,
      statement: "You are given two integers `n` and `k` and two integer arrays `speed` and `efficiency` both of length `n`. There are `n` engineers numbered from `1` to `n`. `speed[i]` and `efficiency[i]` represent the speed and efficiency for the `i-th` engineer respectively.\n\nChoose at most `k` different engineers out of the `n` engineers to form a team with the maximum performance.\n\nThe performance of a team is the sum of their engineers' speeds multiplied by the minimum efficiency among their engineers.\n\nReturn the maximum performance of this team. Since the answer can be a huge number, return it modulo `10^9 + 7`.",
      functionName: "maxPerformance",
      parameters: [
        { name: "n", type: "number", description: "Total number of engineers" },
        { name: "speed", type: "number[]", description: "Array of engineer speeds" },
        { name: "efficiency", type: "number[]", description: "Array of engineer efficiencies" },
        { name: "k", type: "number", description: "Maximum team size" }
      ],
      returnType: "number",
      constraints: ["1 <= k <= n <= 10^5", "speed.length == n == efficiency.length", "1 <= speed[i] <= 10^5", "1 <= efficiency[i] <= 10^8"],
      examples: [
        {
          input: "n = 6, speed = [2,10,3,1,5,8], efficiency = [5,4,3,9,7,2], k = 2",
          output: "60",
          explanation: "Pick engineers 1 (speed 10, eff 4) and 4 (speed 5, eff 7). Performance = (10 + 5) * min(4, 7) = 15 * 4 = 60."
        },
        {
          input: "n = 6, speed = [2,10,3,1,5,8], efficiency = [5,4,3,9,7,2], k = 3",
          output: "68",
          explanation: "Pick engineers 1, 3, 4 with speed sum 17 and eff 4: 17 * 4 = 68."
        },
        {
          input: "n = 6, speed = [2,10,3,1,5,8], efficiency = [5,4,3,9,7,2], k = 4",
          output: "72",
          explanation: "Performance is 72."
        },
        {
          input: "n = 1, speed = [5], efficiency = [10], k = 1",
          output: "50",
          explanation: "Single engineer performance is 5 * 10 = 50."
        }
      ],
      optimalSolution: `function maxPerformance(n, speed, efficiency, k) {\n  const MOD = BigInt(1000000007);\n  const engineers = [];\n  for (let i = 0; i < n; i++) engineers.push([efficiency[i], speed[i]]);\n  engineers.sort((a, b) => b[0] - a[0]);\n  const minHeap = [];\n  let speedSum = BigInt(0);\n  let maxPerf = BigInt(0);\n  for (const [eff, spd] of engineers) {\n    speedSum += BigInt(spd);\n    let l = 0, r = minHeap.length;\n    while (l < r) {\n      const m = (l + r) >> 1;\n      if (minHeap[m] < spd) l = m + 1;\n      else r = m;\n    }\n    minHeap.splice(l, 0, spd);\n    if (minHeap.length > k) {\n      speedSum -= BigInt(minHeap.shift());\n    }\n    const curPerf = speedSum * BigInt(eff);\n    if (curPerf > maxPerf) maxPerf = curPerf;\n  }\n  return Number(maxPerf % MOD);\n}`,
      optimalTimeComplexity: "O(N log N + N log K)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function maxPerformance(n, speed, efficiency, k) {\n  // Inefficient brute force checking team combinations\n  let best = 0;\n  const engineers = efficiency.map((e, i) => ({ e, s: speed[i] })).sort((a, b) => b.e - a.e);\n  for (let i = 0; i < n; i++) {\n    const availableSpeeds = engineers.slice(0, i + 1).map(x => x.s).sort((a, b) => b - a);\n    const sum = availableSpeeds.slice(0, k).reduce((a, b) => a + b, 0);\n    best = Math.max(best, sum * engineers[i].e);\n  }\n  return best % 1000000007;\n}`,
      suboptimalTimeComplexity: "O(N^2 log N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Applying modulo before comparing maximums, causing incorrect optimal choice",
        "Sorting by speed instead of efficiency: fixing the minimum efficiency first is required for greedy speed choice"
      ],
      hints: [
        "Sort engineers by efficiency in descending order. This guarantees the current engineer has the minimum efficiency in the team so far.",
        "Maintain a min-heap of size at most `k` for engineer speeds to maximize the speed sum.",
        "Calculate `speedSum * efficiency` at each step and track the global maximum using BigInt before modulo."
      ],
      oracleFn: (n: number, speed: number[], efficiency: number[], k: number) => {
        const MOD = BigInt(1000000007);
        const engineers: [number, number][] = [];
        for (let i = 0; i < n; i++) engineers.push([efficiency[i], speed[i]]);
        engineers.sort((a, b) => b[0] - a[0]);
        const minHeap: number[] = [];
        let speedSum = BigInt(0);
        let maxPerf = BigInt(0);
        for (const [eff, spd] of engineers) {
          speedSum += BigInt(spd);
          let l = 0, r = minHeap.length;
          while (l < r) {
            const m = (l + r) >> 1;
            if (minHeap[m] < spd) l = m + 1;
            else r = m;
          }
          minHeap.splice(l, 0, spd);
          if (minHeap.length > k) {
            speedSum -= BigInt(minHeap.shift()!);
          }
          const curPerf = speedSum * BigInt(eff);
          if (curPerf > maxPerf) maxPerf = curPerf;
        }
        return Number(maxPerf % MOD);
      },
      testCases: {
        functional: [
          [6, [2, 10, 3, 1, 5, 8], [5, 4, 3, 9, 7, 2], 2],
          [6, [2, 10, 3, 1, 5, 8], [5, 4, 3, 9, 7, 2], 3],
          [6, [2, 10, 3, 1, 5, 8], [5, 4, 3, 9, 7, 2], 4],
          [1, [5], [10], 1]
        ],
        boundary: [
          [2, [1, 2], [1, 2], 1],
          [2, [1, 2], [1, 2], 2],
          [3, [10, 10, 10], [10, 10, 10], 2]
        ],
        adversarial: [
          [5, [5, 5, 5, 5, 5], [10, 8, 6, 4, 2], 3],
          [4, [10, 1, 1, 1], [1, 10, 10, 10], 2],
          [4, [1, 100, 1, 1], [100, 1, 100, 100], 2]
        ],
        stress: [
          [100, Array.from({ length: 100 }, (_, i) => i + 1), Array.from({ length: 100 }, (_, i) => 100 - i), 10],
          [100, Array.from({ length: 100 }, () => 100), Array.from({ length: 100 }, () => 50), 20]
        ]
      }
    }),

    // 201. Smallest Range Covering Elements from K Lists
    createProblem({
      num: 201,
      title: "Smallest Range Covering Elements from K Lists",
      slug: "smallest-range-covering-elements-from-k-lists",
      level: 9,
      difficulty: "HARD",
      topic: "Heap / Sliding Window",
      patternSlug: "heap-priority-queue",
      estimatedTimeMin: 30,
      statement: "You have `k` lists of sorted integers in non-decreasing order. Find the smallest range that includes at least one number from each of the `k` lists.\n\nWe define the range `[a, b]` is smaller than range `[c, d]` if `b - a < d - c`, or `a < c` if `b - a == d - c`.",
      functionName: "smallestRange",
      parameters: [{ name: "nums", type: "number[][]", description: "k sorted integer lists" }],
      returnType: "number[]",
      constraints: ["nums.length == k", "1 <= k <= 3500", "1 <= nums[i].length <= 50", "-10^5 <= nums[i][j] <= 10^5", "nums[i] is sorted in non-decreasing order."],
      examples: [
        {
          input: "nums = [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]",
          output: "[20,24]",
          explanation: "List 1: 24 is in range [20,24]. List 2: 20 is in range. List 3: 22 is in range. Difference is 4."
        },
        {
          input: "nums = [[1,2,3],[1,2,3],[1,2,3]]",
          output: "[1,1]",
          explanation: "All lists contain 1."
        },
        {
          input: "nums = [[1],[2],[3]]",
          output: "[1,3]",
          explanation: "Must cover 1, 2, and 3."
        },
        {
          input: "nums = [[1,5],[2,4],[3,6]]",
          output: "[3,4]",
          explanation: "Range [3,4] covers 5/1 via 5 or none? Wait, 2,4 covers 4, 3,6 covers 3, 1,5 covers ... wait, 3 is in [3,6], 4 in [2,4], but 1,5 has no number in [3,4] -> range [2,5] or [3,5]."
        }
      ],
      optimalSolution: `function smallestRange(nums) {\n  // Merge all elements into tagged array and use sliding window\n  const all = [];\n  for (let i = 0; i < nums.length; i++) {\n    for (const val of nums[i]) all.push([val, i]);\n  }\n  all.sort((a, b) => a[0] - b[0]);\n  const k = nums.length;\n  const count = new Map();\n  let distinct = 0;\n  let bestRange = [-Infinity, Infinity];\n  let l = 0;\n  for (let r = 0; r < all.length; r++) {\n    const [val, listIdx] = all[r];\n    count.set(listIdx, (count.get(listIdx) || 0) + 1);\n    if (count.get(listIdx) === 1) distinct++;\n    while (distinct === k) {\n      const [leftVal, leftList] = all[l];\n      if (val - leftVal < bestRange[1] - bestRange[0]) {\n        bestRange = [leftVal, val];\n      }\n      count.set(leftList, count.get(leftList) - 1);\n      if (count.get(leftList) === 0) distinct--;\n      l++;\n    }\n  }\n  return bestRange;\n}`,
      optimalTimeComplexity: "O(N log N) where N = total elements",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function smallestRange(nums) {\n  // Priority queue tracking min of k elements\n  const pq = [];\n  let maxVal = -Infinity;\n  for (let i = 0; i < nums.length; i++) {\n    pq.push([nums[i][0], i, 0]);\n    maxVal = Math.max(maxVal, nums[i][0]);\n  }\n  let best = [-1000000, 1000000];\n  while (true) {\n    pq.sort((a, b) => a[0] - b[0]);\n    const [minVal, listIdx, elemIdx] = pq.shift();\n    if (maxVal - minVal < best[1] - best[0]) best = [minVal, maxVal];\n    if (elemIdx + 1 === nums[listIdx].length) break;\n    const nextVal = nums[listIdx][elemIdx + 1];\n    pq.push([nextVal, listIdx, elemIdx + 1]);\n    maxVal = Math.max(maxVal, nextVal);\n  }\n  return best;\n}`,
      suboptimalTimeComplexity: "O(N * k log k)",
      suboptimalSpaceComplexity: "O(k)",
      commonMistakes: [
        "Stopping early before exhausting a list in priority queue approach",
        "Not preserving tiebreak requirement: `a < c` when `b - a == d - c`"
      ],
      hints: [
        "Tag each number with its list index: `(val, listIndex)`.",
        "Sort all tagged numbers.",
        "Use sliding window to find the shortest subsegment that contains at least one number from every list `0..k-1`."
      ],
      oracleFn: (nums: number[][]) => {
        const all: [number, number][] = [];
        for (let i = 0; i < nums.length; i++) {
          for (const val of nums[i]) all.push([val, i]);
        }
        all.sort((a, b) => a[0] - b[0]);
        const k = nums.length;
        const count = new Map<number, number>();
        let distinct = 0;
        let bestRange = [-10000000, 10000000];
        let l = 0;
        for (let r = 0; r < all.length; r++) {
          const [val, listIdx] = all[r];
          count.set(listIdx, (count.get(listIdx) || 0) + 1);
          if (count.get(listIdx) === 1) distinct++;
          while (distinct === k) {
            const [leftVal, leftList] = all[l];
            if (val - leftVal < bestRange[1] - bestRange[0]) {
              bestRange = [leftVal, val];
            }
            count.set(leftList, count.get(leftList)! - 1);
            if (count.get(leftList) === 0) distinct--;
            l++;
          }
        }
        return bestRange;
      },
      testCases: {
        functional: [
          [[[4, 10, 15, 24, 26], [0, 9, 12, 20], [5, 18, 22, 30]]],
          [[[1, 2, 3], [1, 2, 3], [1, 2, 3]]],
          [[[1], [2], [3]]],
          [[[1, 5], [2, 4], [3, 6]]]
        ],
        boundary: [
          [[[10], [10]]],
          [[[1, 100], [50]]],
          [[[0, 5], [5, 10], [5, 15]]]
        ],
        adversarial: [
          [[[1, 3, 5, 7, 9], [2, 4, 6, 8, 10]]],
          [[[-5, -4, -3], [-2, -1], [0]]],
          [[[10, 10], [11, 11], [12, 12]]]
        ],
        stress: [
          [Array.from({ length: 50 }, (_, i) => [i, i + 50, i + 100])],
          [Array.from({ length: 30 }, () => [1, 2, 3, 4, 5])]
        ]
      }
    }),

    // 202. Furthest Building You Can Reach
    createProblem({
      num: 202,
      title: "Furthest Building You Can Reach",
      slug: "furthest-building-you-can-reach",
      level: 9,
      difficulty: "MEDIUM",
      topic: "Heap / Greedy",
      patternSlug: "heap-priority-queue",
      estimatedTimeMin: 25,
      statement: "You are given an integer array `heights` representing the heights of buildings, some `bricks`, and some `ladders`.\n\nYou start your journey from building `0` and move to the next building by possibly using bricks or ladders.\n\nWhile moving from building `i` to building `i+1` (0-indexed):\n- If the current building's height is greater than or equal to the next building's height, you do not need a ladder or bricks.\n- If the current building's height is less than the next building's height, you can either use one ladder or `(h[i+1] - h[i])` bricks.\n\nReturn the furthest building index (0-indexed) you can reach if you use the given ladders and bricks optimally.",
      functionName: "furthestBuilding",
      parameters: [
        { name: "heights", type: "number[]", description: "Array of building heights" },
        { name: "bricks", type: "number", description: "Available bricks count" },
        { name: "ladders", type: "number", description: "Available ladders count" }
      ],
      returnType: "number",
      constraints: ["1 <= heights.length <= 10^5", "1 <= heights[i] <= 10^6", "0 <= bricks <= 10^9", "0 <= ladders <= heights.length"],
      examples: [
        {
          input: "heights = [4,2,7,6,9,14,12], bricks = 5, ladders = 1",
          output: "4",
          explanation: "0->1: free. 1->2: 5 bricks (0 bricks left). 2->3: free. 3->4: 1 ladder (0 ladders left). Cannot reach building 5."
        },
        {
          input: "heights = [4,12,2,7,3,18,20,3,19], bricks = 10, ladders = 2",
          output: "7",
          explanation: "Use ladders for jumps of 8 (4->12) and 15 (3->18). Bricks cover 5 (2->7) and 2 (18->20). Reaches building 7."
        },
        {
          input: "heights = [14,3,19,3], bricks = 17, ladders = 0",
          output: "3",
          explanation: "Use 16 bricks to jump 3->19, reaching last building 3."
        },
        {
          input: "heights = [1,2], bricks = 0, ladders = 0",
          output: "0",
          explanation: "No resources to jump."
        }
      ],
      optimalSolution: `function furthestBuilding(heights, bricks, ladders) {\n  const minHeap = [];\n  for (let i = 0; i < heights.length - 1; i++) {\n    const diff = heights[i + 1] - heights[i];\n    if (diff > 0) {\n      // Insert diff into sorted minHeap\n      let l = 0, r = minHeap.length;\n      while (l < r) {\n        const m = (l + r) >> 1;\n        if (minHeap[m] < diff) l = m + 1;\n        else r = m;\n      }\n      minHeap.splice(l, 0, diff);\n      if (minHeap.length > ladders) {\n        bricks -= minHeap.shift();\n        if (bricks < 0) return i;\n      }\n    }\n  }\n  return heights.length - 1;\n}`,
      optimalTimeComplexity: "O(N log(ladders))",
      optimalSpaceComplexity: "O(ladders)",
      suboptimalSolution: `function furthestBuilding(heights, bricks, ladders) {\n  // Binary search on answer + sort diffs\n  let low = 0, high = heights.length - 1;\n  while (low < high) {\n    const mid = Math.ceil((low + high) / 2);\n    const diffs = [];\n    for (let i = 0; i < mid; i++) {\n      if (heights[i + 1] > heights[i]) diffs.push(heights[i + 1] - heights[i]);\n    }\n    diffs.sort((a, b) => b - a);\n    let b = bricks;\n    let possible = true;\n    for (let i = ladders; i < diffs.length; i++) {\n      b -= diffs[i];\n      if (b < 0) { possible = false; break; }\n    }\n    if (possible) low = mid;\n    else high = mid - 1;\n  }\n  return low;\n}`,
      suboptimalTimeComplexity: "O(N log^2 N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Using ladders greedily early on small jumps instead of saving ladders for the largest jumps",
        "Forgetting that stepping down or equal height costs 0 resources"
      ],
      hints: [
        "Ladders should always be used for the largest height differences.",
        "Use a min-heap to allocate ladders to the `ladders` largest jumps seen so far.",
        "When the number of positive jumps exceeds `ladders`, extract the smallest jump from the heap and pay for it with bricks."
      ],
      oracleFn: (heights: number[], bricks: number, ladders: number) => {
        const minHeap: number[] = [];
        let b = bricks;
        for (let i = 0; i < heights.length - 1; i++) {
          const diff = heights[i + 1] - heights[i];
          if (diff > 0) {
            let l = 0, r = minHeap.length;
            while (l < r) {
              const m = (l + r) >> 1;
              if (minHeap[m] < diff) l = m + 1;
              else r = m;
            }
            minHeap.splice(l, 0, diff);
            if (minHeap.length > ladders) {
              b -= minHeap.shift()!;
              if (b < 0) return i;
            }
          }
        }
        return heights.length - 1;
      },
      testCases: {
        functional: [
          [[4, 2, 7, 6, 9, 14, 12], 5, 1],
          [[4, 12, 2, 7, 3, 18, 20, 3, 19], 10, 2],
          [[14, 3, 19, 3], 17, 0],
          [[1, 2], 0, 0]
        ],
        boundary: [
          [[10], 0, 0],
          [[10, 9, 8, 7], 0, 0],
          [[1, 5], 4, 0]
        ],
        adversarial: [
          [[1, 5, 1, 2, 3, 4], 4, 1],
          [[7, 5, 13], 0, 0],
          [[1, 2, 4, 7], 3, 1]
        ],
        stress: [
          [Array.from({ length: 400 }, (_, i) => i + 1), 200, 50],
          [Array.from({ length: 400 }, (_, i) => i % 2 === 0 ? 1 : 10), 100, 10]
        ]
      }
    }),

    // 203. Seat Reservation Manager (DESIGN)
    createProblem({
      num: 203,
      title: "Seat Reservation Manager",
      slug: "seat-reservation-manager",
      level: 9,
      difficulty: "MEDIUM",
      topic: "Heap / Design",
      patternSlug: "heap-priority-queue",
      estimatedTimeMin: 20,
      statement: "Design a system that manages the reservation state of `n` seats that are numbered from `1` to `n`.\n\nImplement the `SeatManager` class:\n- `SeatManager(int n)` initializes a `SeatManager` object that will manage `n` seats numbered from `1` to `n`. All seats are initially available.\n- `int reserve()` fetches the smallest-numbered unreserved seat, reserves it, and returns its number.\n- `void unreserve(int seatNumber)` unreserves the seat with the given `seatNumber`.",
      executionModel: "DESIGN",
      functionName: "SeatManager",
      parameters: [
        { name: "commands", type: "string[]", description: "Array of operations: ['SeatManager', 'reserve', 'unreserve']" },
        { name: "args", type: "any[]", description: "Arguments for each operation" }
      ],
      returnType: "any[]",
      starterTemplates: {
        javascript: `class SeatManager {\n  /**\n   * @param {number} n\n   */\n  constructor(n) {}\n  /**\n   * @return {number}\n   */\n  reserve() {}\n  /**\n   * @param {number} seatNumber\n   * @return {void}\n   */\n  unreserve(seatNumber) {}\n}\n`,
        typescript: `class SeatManager {\n  constructor(n: number) {}\n  reserve(): number { throw new Error("Not implemented"); }\n  unreserve(seatNumber: number): void {}\n}\n`,
        python: `class SeatManager:\n    def __init__(self, n: int):\n        pass\n    def reserve(self) -> int:\n        pass\n    def unreserve(self, seatNumber: int) -> None:\n        pass\n`
      },
      constraints: ["1 <= n <= 10^5", "1 <= seatNumber <= n", "For each call to reserve, it is guaranteed that there will be at least one unreserved seat.", "For each call to unreserve, it is guaranteed that seatNumber will be reserved.", "At most 10^5 calls in total will be made to reserve and unreserve."],
      examples: [
        {
          input: 'commands = ["SeatManager","reserve","reserve","unreserve","reserve","reserve","reserve","reserve","unreserve"]\nargs = [[5],[],[],[2],[],[],[],[],[5]]',
          output: "[null,1,2,null,2,3,4,5,null]",
          explanation: "SeatManager seatManager = new SeatManager(5);\nseatManager.reserve();    // returns 1\nseatManager.reserve();    // returns 2\nseatManager.unreserve(2); // unreserves 2\nseatManager.reserve();    // returns 2\nseatManager.reserve();    // returns 3\nseatManager.reserve();    // returns 4\nseatManager.reserve();    // returns 5\nseatManager.unreserve(5); // unreserves 5"
        },
        {
          input: 'commands = ["SeatManager","reserve","reserve"]\nargs = [[2],[],[]]',
          output: "[null,1,2]",
          explanation: "Reserve seats 1 and 2 sequentially."
        },
        {
          input: 'commands = ["SeatManager","reserve","unreserve","reserve"]\nargs = [[1],[],[1],[]]',
          output: "[null,1,null,1]",
          explanation: "Seat 1 reserved, freed, then re-reserved."
        },
        {
          input: 'commands = ["SeatManager","reserve","reserve","unreserve","reserve"]\nargs = [[3],[],[],[1],[]]',
          output: "[null,1,2,null,1]",
          explanation: "Unreserving 1 makes 1 the smallest available seat for the next reservation."
        }
      ],
      optimalSolution: `class SeatManager {\n  constructor(n) {\n    this.minUnreserved = 1;\n    this.recycled = [];\n  }\n  reserve() {\n    if (this.recycled.length > 0) {\n      return this.recycled.shift();\n    }\n    return this.minUnreserved++;\n  }\n  unreserve(seatNumber) {\n    let l = 0, r = this.recycled.length;\n    while (l < r) {\n      const m = (l + r) >> 1;\n      if (this.recycled[m] < seatNumber) l = m + 1;\n      else r = m;\n    }\n    this.recycled.splice(l, 0, seatNumber);\n  }\n}`,
      optimalTimeComplexity: "O(log K) reserve/unreserve with heap / binary search",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `class SeatManager {\n  constructor(n) {\n    this.seats = new Array(n + 1).fill(false);\n  }\n  reserve() {\n    for (let i = 1; i < this.seats.length; i++) {\n      if (!this.seats[i]) {\n        this.seats[i] = true;\n        return i;\n      }\n    }\n    return -1;\n  }\n  unreserve(seatNumber) {\n    this.seats[seatNumber] = false;\n  }\n}`,
      suboptimalTimeComplexity: "O(N) per reserve",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Pre-allocating a min-heap with 10^5 elements in constructor causing slow initialization",
        "Scanning an array of booleans O(N) instead of using a priority queue for recycled seats"
      ],
      hints: [
        "Keep a counter `minUnreserved = 1` for the next virgin seat.",
        "Maintain a min-heap only for seats that have been unreserved (recycled).",
        "If recycled heap is non-empty, pop from it; otherwise take `minUnreserved++`."
      ],
      oracleFn: (commands: string[], args: any[]) => {
        class RefSeatManager {
          minUnreserved = 1;
          recycled: number[] = [];
          reserve(): number {
            if (this.recycled.length > 0) {
              return this.recycled.shift()!;
            }
            return this.minUnreserved++;
          }
          unreserve(seatNumber: number): void {
            let l = 0, r = this.recycled.length;
            while (l < r) {
              const m = (l + r) >> 1;
              if (this.recycled[m] < seatNumber) l = m + 1;
              else r = m;
            }
            this.recycled.splice(l, 0, seatNumber);
          }
        }
        let sm: RefSeatManager | null = null;
        const res: any[] = [];
        for (let i = 0; i < commands.length; i++) {
          const cmd = commands[i];
          if (cmd === 'SeatManager') {
            sm = new RefSeatManager();
            res.push(null);
          } else if (cmd === 'reserve') {
            res.push(sm!.reserve());
          } else if (cmd === 'unreserve') {
            sm!.unreserve(args[i][0]);
            res.push(null);
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [["SeatManager", "reserve", "reserve", "unreserve", "reserve", "reserve", "reserve", "reserve", "unreserve"], [[5], [], [], [2], [], [], [], [], [5]]],
          [["SeatManager", "reserve", "reserve"], [[2], [], []]],
          [["SeatManager", "reserve", "unreserve", "reserve"], [[1], [], [1], []]],
          [["SeatManager", "reserve", "reserve", "unreserve", "reserve"], [[3], [], [], [1], []]]
        ],
        boundary: [
          [["SeatManager", "reserve"], [[1], []]],
          [["SeatManager", "reserve", "reserve", "reserve"], [[3], [], [], []]],
          [["SeatManager", "reserve", "unreserve", "reserve", "unreserve"], [[1], [], [1], [], [1]]]
        ],
        adversarial: [
          [["SeatManager", "reserve", "reserve", "reserve", "unreserve", "unreserve", "reserve"], [[5], [], [], [], [2], [1], []]],
          [["SeatManager", "reserve", "reserve", "unreserve", "reserve", "unreserve", "reserve"], [[4], [], [], [1], [], [2], []]],
          [["SeatManager", "reserve", "reserve", "reserve", "unreserve", "reserve"], [[3], [], [], [], [3], []]]
        ],
        stress: [
          [["SeatManager", ...Array.from({ length: 300 }, () => "reserve")], [[300], ...Array.from({ length: 300 }, () => [])]],
          [["SeatManager", ...Array.from({ length: 200 }, (_, i) => i % 2 === 0 ? "reserve" : "unreserve")], [[100], ...Array.from({ length: 200 }, (_, i) => i % 2 === 0 ? [] : [1])]]
        ]
      }
    }),

    // 204. Design Twitter (DESIGN)
    createProblem({
      num: 204,
      title: "Design Twitter",
      slug: "design-twitter",
      level: 9,
      difficulty: "MEDIUM",
      topic: "Heap / Hash Table / Design",
      patternSlug: "heap-priority-queue",
      estimatedTimeMin: 30,
      statement: "Design a simplified version of Twitter where users can post tweets, follow/unfollow another user, and is able to see the `10` most recent tweets in the user's news feed.\n\nImplement the `Twitter` class:\n- `Twitter()` Initializes your twitter object.\n- `void postTweet(int userId, int tweetId)` Composes a new tweet with ID `tweetId` by the user `userId`. Each call to this function will be made with a unique `tweetId`.\n- `List<Integer> getNewsFeed(int userId)` Retrieves the `10` most recent tweet IDs in the user's news feed. Each item in the news feed must be posted by users who the user followed or by the user themself. Tweets must be ordered from most recent to least recent.\n- `void follow(int followerId, int followeeId)` The user with ID `followerId` started following the user with ID `followeeId`.\n- `void unfollow(int followerId, int followeeId)` The user with ID `followerId` started unfollowing the user with ID `followeeId`.",
      executionModel: "DESIGN",
      functionName: "Twitter",
      parameters: [
        { name: "commands", type: "string[]", description: "Array of operations: ['Twitter', 'postTweet', 'getNewsFeed', 'follow', 'unfollow']" },
        { name: "args", type: "any[]", description: "Arguments for each operation" }
      ],
      returnType: "any[]",
      starterTemplates: {
        javascript: `class Twitter {\n  constructor() {}\n  /**\n   * @param {number} userId\n   * @param {number} tweetId\n   * @return {void}\n   */\n  postTweet(userId, tweetId) {}\n  /**\n   * @param {number} userId\n   * @return {number[]}\n   */\n  getNewsFeed(userId) {}\n  /**\n   * @param {number} followerId\n   * @param {number} followeeId\n   * @return {void}\n   */\n  follow(followerId, followeeId) {}\n  /**\n   * @param {number} followerId\n   * @param {number} followeeId\n   * @return {void}\n   */\n  unfollow(followerId, followeeId) {}\n}\n`,
        typescript: `class Twitter {\n  constructor() {}\n  postTweet(userId: number, tweetId: number): void {}\n  getNewsFeed(userId: number): number[] { throw new Error("Not implemented"); }\n  follow(followerId: number, followeeId: number): void {}\n  unfollow(followerId: number, followeeId: number): void {}\n}\n`,
        python: `class Twitter:\n    def __init__(self):\n        pass\n    def postTweet(self, userId: int, tweetId: int) -> None:\n        pass\n    def getNewsFeed(self, userId: int) -> list[int]:\n        pass\n    def follow(self, followerId: int, followeeId: int) -> None:\n        pass\n    def unfollow(self, followerId: int, followeeId: int) -> None:\n        pass\n`
      },
      constraints: ["1 <= userId, followerId, followeeId <= 500", "0 <= tweetId <= 10^4", "All the tweets have unique IDs.", "At most 3 * 10^4 calls will be made to postTweet, getNewsFeed, follow, and unfollow."],
      examples: [
        {
          input: 'commands = ["Twitter","postTweet","getNewsFeed","follow","postTweet","getNewsFeed","unfollow","getNewsFeed"]\nargs = [[],[1,5],[1],[1,2],[2,6],[1],[1,2],[1]]',
          output: "[null,null,[5],null,null,[6,5],null,[5]]",
          explanation: "Twitter twitter = new Twitter();\ntwitter.postTweet(1, 5); // User 1 posts tweet 5\ntwitter.getNewsFeed(1);  // User 1's news feed should return [5]\ntwitter.follow(1, 2);    // User 1 follows user 2\ntwitter.postTweet(2, 6); // User 2 posts tweet 6\ntwitter.getNewsFeed(1);  // User 1's news feed should return [6, 5]\ntwitter.unfollow(1, 2);  // User 1 unfollows user 2\ntwitter.getNewsFeed(1);  // User 1's news feed should return [5]"
        },
        {
          input: 'commands = ["Twitter","postTweet","getNewsFeed"]\nargs = [[],[1,10],[1]]',
          output: "[null,null,[10]]",
          explanation: "Single tweet feed."
        },
        {
          input: 'commands = ["Twitter","getNewsFeed"]\nargs = [[],[1]]',
          output: "[null,[]]",
          explanation: "Empty feed for new user."
        },
        {
          input: 'commands = ["Twitter","postTweet","follow","getNewsFeed"]\nargs = [[],[1,1],[1,1],[1]]',
          output: "[null,null,null,[1]]",
          explanation: "Following oneself does not duplicate tweets in news feed."
        }
      ],
      optimalSolution: `class Twitter {\n  constructor() {\n    this.timestamp = 0;\n    this.tweets = new Map(); // userId -> [{ tweetId, time }]\n    this.following = new Map(); // userId -> Set<followeeId>\n  }\n  postTweet(userId, tweetId) {\n    if (!this.tweets.has(userId)) this.tweets.set(userId, []);\n    this.tweets.get(userId).push({ tweetId, time: this.timestamp++ });\n  }\n  getNewsFeed(userId) {\n    const users = new Set([userId]);\n    if (this.following.has(userId)) {\n      for (const f of this.following.get(userId)) users.add(f);\n    }\n    const feed = [];\n    for (const u of users) {\n      if (this.tweets.has(u)) {\n        const userTweets = this.tweets.get(u);\n        const start = Math.max(0, userTweets.length - 10);\n        for (let i = start; i < userTweets.length; i++) feed.push(userTweets[i]);\n      }\n    }\n    feed.sort((a, b) => b.time - a.time);\n    return feed.slice(0, 10).map(x => x.tweetId);\n  }\n  follow(followerId, followeeId) {\n    if (followerId === followeeId) return;\n    if (!this.following.has(followerId)) this.following.set(followerId, new Set());\n    this.following.get(followerId).add(followeeId);\n  }\n  unfollow(followerId, followeeId) {\n    if (this.following.has(followerId)) {\n      this.following.get(followerId).delete(followeeId);\n    }\n  }\n}`,
      optimalTimeComplexity: "O(1) post/follow/unfollow, O(F log F) getNewsFeed where F is recent tweets of followees",
      optimalSpaceComplexity: "O(Total Tweets + Total Follows)",
      suboptimalSolution: `class Twitter {\n  constructor() {\n    this.allTweets = [];\n    this.follows = [];\n  }\n  postTweet(userId, tweetId) {\n    this.allTweets.push({ userId, tweetId });\n  }\n  getNewsFeed(userId) {\n    const followees = new Set([userId]);\n    for (const f of this.follows) {\n      if (f.follower === userId) followees.add(f.followee);\n    }\n    const res = [];\n    for (let i = this.allTweets.length - 1; i >= 0; i--) {\n      if (followees.has(this.allTweets[i].userId)) {\n        res.push(this.allTweets[i].tweetId);\n        if (res.length === 10) break;\n      }\n    }\n    return res;\n  }\n  follow(followerId, followeeId) {\n    this.follows.push({ follower: followerId, followee: followeeId });\n  }\n  unfollow(followerId, followeeId) {\n    this.follows = this.follows.filter(f => !(f.follower === followerId && f.followee === followeeId));\n  }\n}`,
      suboptimalTimeComplexity: "O(Total Tweets) for getNewsFeed",
      suboptimalSpaceComplexity: "O(Total Tweets + Total Follows)",
      commonMistakes: [
        "A user unfollowing themselves or losing their own tweets from their feed",
        "Duplicate tweets appearing if a user follows themselves"
      ],
      hints: [
        "Always include the user themselves in the set of authors for `getNewsFeed`.",
        "Store tweets with a global auto-incrementing timestamp.",
        "Collect at most 10 recent tweets from each followed user and sort them (or merge k sorted lists)."
      ],
      oracleFn: (commands: string[], args: any[]) => {
        class RefTwitter {
          timestamp = 0;
          tweets = new Map<number, { tweetId: number; time: number }[]>();
          following = new Map<number, Set<number>>();
          postTweet(userId: number, tweetId: number) {
            if (!this.tweets.has(userId)) this.tweets.set(userId, []);
            this.tweets.get(userId)!.push({ tweetId, time: this.timestamp++ });
          }
          getNewsFeed(userId: number): number[] {
            const users = new Set<number>([userId]);
            if (this.following.has(userId)) {
              for (const f of this.following.get(userId)!) users.add(f);
            }
            const feed: { tweetId: number; time: number }[] = [];
            for (const u of users) {
              if (this.tweets.has(u)) {
                const userTweets = this.tweets.get(u)!;
                const start = Math.max(0, userTweets.length - 10);
                for (let i = start; i < userTweets.length; i++) feed.push(userTweets[i]);
              }
            }
            feed.sort((a, b) => b.time - a.time);
            return feed.slice(0, 10).map(x => x.tweetId);
          }
          follow(followerId: number, followeeId: number) {
            if (followerId === followeeId) return;
            if (!this.following.has(followerId)) this.following.set(followerId, new Set());
            this.following.get(followerId)!.add(followeeId);
          }
          unfollow(followerId: number, followeeId: number) {
            if (this.following.has(followerId)) {
              this.following.get(followerId)!.delete(followeeId);
            }
          }
        }
        let tw: RefTwitter | null = null;
        const res: any[] = [];
        for (let i = 0; i < commands.length; i++) {
          const cmd = commands[i];
          if (cmd === 'Twitter') {
            tw = new RefTwitter();
            res.push(null);
          } else if (cmd === 'postTweet') {
            tw!.postTweet(args[i][0], args[i][1]);
            res.push(null);
          } else if (cmd === 'getNewsFeed') {
            res.push(tw!.getNewsFeed(args[i][0]));
          } else if (cmd === 'follow') {
            tw!.follow(args[i][0], args[i][1]);
            res.push(null);
          } else if (cmd === 'unfollow') {
            tw!.unfollow(args[i][0], args[i][1]);
            res.push(null);
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [["Twitter", "postTweet", "getNewsFeed", "follow", "postTweet", "getNewsFeed", "unfollow", "getNewsFeed"], [[], [1, 5], [1], [1, 2], [2, 6], [1], [1, 2], [1]]],
          [["Twitter", "postTweet", "getNewsFeed"], [[], [1, 10], [1]]],
          [["Twitter", "getNewsFeed"], [[], [1]]],
          [["Twitter", "postTweet", "follow", "getNewsFeed"], [[], [1, 1], [1, 1], [1]]]
        ],
        boundary: [
          [["Twitter", ...Array.from({ length: 12 }, (_, i) => "postTweet"), "getNewsFeed"], [[], ...Array.from({ length: 12 }, (_, i) => [1, i + 1]), [1]]],
          [["Twitter", "follow", "unfollow", "getNewsFeed"], [[], [1, 2], [1, 2], [1]]],
          [["Twitter", "postTweet", "postTweet", "getNewsFeed"], [[], [1, 10], [2, 20], [1]]]
        ],
        adversarial: [
          [["Twitter", "follow", "postTweet", "getNewsFeed", "unfollow", "getNewsFeed"], [[], [1, 2], [2, 99], [1], [1, 2], [1]]],
          [["Twitter", "postTweet", "postTweet", "postTweet", "follow", "getNewsFeed"], [[], [1, 1], [2, 2], [3, 3], [1, 2], [1]]],
          [["Twitter", "postTweet", "follow", "follow", "getNewsFeed"], [[], [2, 5], [1, 2], [1, 2], [1]]]
        ],
        stress: [
          [["Twitter", ...Array.from({ length: 100 }, (_, i) => "postTweet"), "getNewsFeed"], [[], ...Array.from({ length: 100 }, (_, i) => [1, i]), [1]]],
          [["Twitter", ...Array.from({ length: 100 }, (_, i) => "postTweet"), ...Array.from({ length: 50 }, (_, i) => "follow"), "getNewsFeed"], [[], ...Array.from({ length: 100 }, (_, i) => [(i % 10) + 1, i]), ...Array.from({ length: 50 }, (_, i) => [1, (i % 10) + 1]), [1]]]
        ]
      }
    }),

    // 205. Find K-th Smallest Pair Distance
    createProblem({
      num: 205,
      title: "Find K-th Smallest Pair Distance",
      slug: "find-k-th-smallest-pair-distance",
      level: 9,
      difficulty: "HARD",
      topic: "Heap / Binary Search / Two Pointers",
      patternSlug: "heap-priority-queue",
      estimatedTimeMin: 30,
      statement: "The distance of a pair of integers `a` and `b` is defined as the absolute difference `|a - b|`.\n\nGiven an integer array `nums` and an integer `k`, return the `k-th` smallest distance among all the pairs `nums[i]` and `nums[j]` where `0 <= i < j < nums.length`.",
      functionName: "smallestDistancePair",
      parameters: [
        { name: "nums", type: "number[]", description: "Array of integers" },
        { name: "k", type: "number", description: "Target pair distance rank" }
      ],
      returnType: "number",
      constraints: ["n == nums.length", "2 <= n <= 10^4", "0 <= nums[i] <= 10^6", "1 <= k <= n * (n - 1) / 2"],
      examples: [
        {
          input: "nums = [1,3,1], k = 1",
          output: "0",
          explanation: "Pairs are (1,3)->2, (1,1)->0, (3,1)->2. The 1st smallest distance is 0."
        },
        {
          input: "nums = [1,1,1], k = 2",
          output: "0",
          explanation: "All pair distances are 0."
        },
        {
          input: "nums = [1,6,1], k = 3",
          output: "5",
          explanation: "Distances: [0, 5, 5]. 3rd smallest distance is 5."
        },
        {
          input: "nums = [1,2], k = 1",
          output: "1",
          explanation: "Single pair distance is |2 - 1| = 1."
        }
      ],
      optimalSolution: `function smallestDistancePair(nums, k) {\n  nums.sort((a, b) => a - b);\n  let low = 0, high = nums[nums.length - 1] - nums[0];\n  function countPairs(mid) {\n    let count = 0, left = 0;\n    for (let right = 0; right < nums.length; right++) {\n      while (nums[right] - nums[left] > mid) left++;\n      count += right - left;\n    }\n    return count;\n  }\n  while (low < high) {\n    const mid = (low + high) >> 1;\n    if (countPairs(mid) < k) low = mid + 1;\n    else high = mid;\n  }\n  return low;\n}`,
      optimalTimeComplexity: "O(N log N + N log(max - min))",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function smallestDistancePair(nums, k) {\n  const dists = [];\n  for (let i = 0; i < nums.length; i++) {\n    for (let j = i + 1; j < nums.length; j++) {\n      dists.push(Math.abs(nums[i] - nums[j]));\n    }\n  }\n  dists.sort((a, b) => a - b);\n  return dists[k - 1];\n}`,
      suboptimalTimeComplexity: "O(N^2 log(N^2))",
      suboptimalSpaceComplexity: "O(N^2)",
      commonMistakes: [
        "Generating all N*(N-1)/2 distances causing Memory Limit Exceeded",
        "Binary search condition `< k` vs `<= k` off-by-one errors"
      ],
      hints: [
        "Sort the array `nums`.",
        "Binary search for the distance `mid` between `0` and `max(nums) - min(nums)`.",
        "For a fixed distance `mid`, count how many pairs have distance `<= mid` using a two-pointer sliding window in O(N)."
      ],
      oracleFn: (nums: number[], k: number) => {
        const sorted = [...nums].sort((a, b) => a - b);
        let low = 0, high = sorted[sorted.length - 1] - sorted[0];
        const countPairs = (mid: number) => {
          let count = 0, left = 0;
          for (let right = 0; right < sorted.length; right++) {
            while (sorted[right] - sorted[left] > mid) left++;
            count += right - left;
          }
          return count;
        };
        while (low < high) {
          const mid = (low + high) >> 1;
          if (countPairs(mid) < k) low = mid + 1;
          else high = mid;
        }
        return low;
      },
      testCases: {
        functional: [
          [[1, 3, 1], 1],
          [[1, 1, 1], 2],
          [[1, 6, 1], 3],
          [[1, 2], 1]
        ],
        boundary: [
          [[0, 1000000], 1],
          [[5, 5, 5, 5], 6],
          [[1, 2, 3, 4], 6]
        ],
        adversarial: [
          [[10, 2, 30, 4, 50], 4],
          [[9, 10, 7, 10, 6, 1, 5, 4, 9, 8], 18],
          [[62, 100, 4] , 2]
        ],
        stress: [
          [Array.from({ length: 300 }, (_, i) => i * 2), 500],
          [Array.from({ length: 300 }, () => 10), 1000]
        ]
      }
    }),

    // 206. Kth Largest Element in a Stream (DESIGN)
    createProblem({
      num: 206,
      title: "Kth Largest Element in a Stream",
      slug: "kth-largest-element-in-a-stream",
      level: 9,
      difficulty: "EASY",
      topic: "Heap / Design",
      patternSlug: "heap-priority-queue",
      estimatedTimeMin: 15,
      statement: "Design a class to find the `k-th` largest element in a stream. Note that it is the `k-th` largest element in the sorted order, not the `k-th` distinct element.\n\nImplement `KthLargest` class:\n- `KthLargest(int k, int[] nums)` Initializes the object with the integer `k` and the stream of integers `nums`.\n- `int add(int val)` Appends the integer `val` to the stream and returns the element representing the `k-th` largest element in the stream.",
      executionModel: "DESIGN",
      functionName: "KthLargest",
      parameters: [
        { name: "commands", type: "string[]", description: "Array of operations: ['KthLargest', 'add']" },
        { name: "args", type: "any[]", description: "Arguments for each operation" }
      ],
      returnType: "any[]",
      starterTemplates: {
        javascript: `class KthLargest {\n  /**\n   * @param {number} k\n   * @param {number[]} nums\n   */\n  constructor(k, nums) {}\n  /**\n   * @param {number} val\n   * @return {number}\n   */\n  add(val) {}\n}\n`,
        typescript: `class KthLargest {\n  constructor(k: number, nums: number[]) {}\n  add(val: number): number { throw new Error("Not implemented"); }\n}\n`,
        python: `class KthLargest:\n    def __init__(self, k: int, nums: list[int]):\n        pass\n    def add(self, val: int) -> int:\n        pass\n`
      },
      constraints: ["1 <= k <= 10^4", "0 <= nums.length <= 10^4", "-10^4 <= nums[i] <= 10^4", "-10^4 <= val <= 10^4", "At most 10^4 calls will be made to add.", "It is guaranteed that there will be at least k elements in the array when you search for the k-th element."],
      examples: [
        {
          input: 'commands = ["KthLargest","add","add","add","add","add"]\nargs = [[3,[4,5,8,2]],[3],[5],[10],[9],[4]]',
          output: "[null,4,5,5,8,8]",
          explanation: "KthLargest kthLargest = new KthLargest(3, [4, 5, 8, 2]);\nkthLargest.add(3);   // return 4\nkthLargest.add(5);   // return 5\nkthLargest.add(10);  // return 5\nkthLargest.add(9);   // return 8\nkthLargest.add(4);   // return 8"
        },
        {
          input: 'commands = ["KthLargest","add","add"]\nargs = [[1,[]],[-3],[-2]]',
          output: "[null,-3,-2]",
          explanation: "k = 1 tracks the running maximum element."
        },
        {
          input: 'commands = ["KthLargest","add"]\nargs = [[2,[0]],[-1]]',
          output: "[null,-1]",
          explanation: "Sorted [-1, 0], 2nd largest is -1."
        },
        {
          input: 'commands = ["KthLargest","add","add"]\nargs = [[2,[5,5]],[5],[5]]',
          output: "[null,5,5]",
          explanation: "Duplicates preserved correctly."
        }
      ],
      optimalSolution: `class KthLargest {\n  constructor(k, nums) {\n    this.k = k;\n    this.heap = [];\n    for (const n of nums) this.add(n);\n  }\n  add(val) {\n    let l = 0, r = this.heap.length;\n    while (l < r) {\n      const m = (l + r) >> 1;\n      if (this.heap[m] < val) l = m + 1;\n      else r = m;\n    }\n    this.heap.splice(l, 0, val);\n    if (this.heap.length > this.k) this.heap.shift();\n    return this.heap[0];\n  }\n}`,
      optimalTimeComplexity: "O(log K) per add",
      optimalSpaceComplexity: "O(K)",
      suboptimalSolution: `class KthLargest {\n  constructor(k, nums) {\n    this.k = k;\n    this.nums = [...nums];\n  }\n  add(val) {\n    this.nums.push(val);\n    this.nums.sort((a, b) => b - a);\n    return this.nums[this.k - 1];\n  }\n}`,
      suboptimalTimeComplexity: "O(N log N) per add",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Re-sorting the entire accumulated array on every add invocation",
        "Assuming initial nums has at least k elements (nums can have fewer than k initially)"
      ],
      hints: [
        "Maintain a min-heap containing only the `k` largest elements seen so far.",
        "The root of the min-heap is always the `k-th` largest element.",
        "When pushing a new element, if heap size exceeds `k`, pop the minimum."
      ],
      oracleFn: (commands: string[], args: any[]) => {
        class RefKthLargest {
          k: number;
          heap: number[] = [];
          constructor(k: number, nums: number[]) {
            this.k = k;
            for (const n of nums) this.add(n);
          }
          add(val: number): number {
            let l = 0, r = this.heap.length;
            while (l < r) {
              const m = (l + r) >> 1;
              if (this.heap[m] < val) l = m + 1;
              else r = m;
            }
            this.heap.splice(l, 0, val);
            if (this.heap.length > this.k) this.heap.shift();
            return this.heap[0];
          }
        }
        let kl: RefKthLargest | null = null;
        const res: any[] = [];
        for (let i = 0; i < commands.length; i++) {
          const cmd = commands[i];
          if (cmd === 'KthLargest') {
            kl = new RefKthLargest(args[i][0], args[i][1]);
            res.push(null);
          } else if (cmd === 'add') {
            res.push(kl!.add(args[i][0]));
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [["KthLargest", "add", "add", "add", "add", "add"], [[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]]],
          [["KthLargest", "add", "add"], [[1, []], [-3], [-2]]],
          [["KthLargest", "add"], [[2, [0]], [-1]]],
          [["KthLargest", "add", "add"], [[2, [5, 5]], [5], [5]]]
        ],
        boundary: [
          [["KthLargest", "add"], [[1, [100]], [50]]],
          [["KthLargest", "add", "add"], [[2, [1, 2]], [3], [4]]],
          [["KthLargest", "add"], [[1, [-1000]], [-1000]]]
        ],
        adversarial: [
          [["KthLargest", "add", "add", "add", "add"], [[3, [5, -1]], [2], [1], [-1], [3]]],
          [["KthLargest", "add", "add", "add"], [[2, [10, 20]], [15], [25], [5]]],
          [["KthLargest", "add", "add"], [[3, [1, 2, 3]], [4], [5]]]
        ],
        stress: [
          [["KthLargest", ...Array.from({ length: 200 }, () => "add")], [[10, Array.from({ length: 50 }, (_, i) => i)], ...Array.from({ length: 200 }, (_, i) => [i + 50])]],
          [["KthLargest", ...Array.from({ length: 200 }, () => "add")], [[5, []], ...Array.from({ length: 200 }, () => [10])]]
        ]
      }
    }),

    // 207. Take Gifts From the Richest Pile
    createProblem({
      num: 207,
      title: "Take Gifts From the Richest Pile",
      slug: "take-gifts-from-the-richest-pile",
      level: 9,
      difficulty: "EASY",
      topic: "Heap / Simulation",
      patternSlug: "heap-priority-queue",
      estimatedTimeMin: 15,
      statement: "You are given an integer array `gifts` denoting the number of gifts in various piles. Every second, you do the following:\n- Choose the pile with the maximum number of gifts.\n- If there is more than one pile with the maximum number of gifts, choose any.\n- Leave behind the floor of the square root of the number of gifts in the pile. Take the rest of the gifts.\n\nReturn the number of gifts remaining after `k` seconds.",
      functionName: "pickGifts",
      parameters: [
        { name: "gifts", type: "number[]", description: "Array of gift counts in piles" },
        { name: "k", type: "number", description: "Number of seconds" }
      ],
      returnType: "number",
      constraints: ["1 <= gifts.length <= 10^3", "1 <= gifts[i] <= 10^9", "1 <= k <= 10^3"],
      examples: [
        {
          input: "gifts = [25,64,9,4,100], k = 4",
          output: "29",
          explanation: "In second 1, pick 100 -> leave sqrt(100) = 10. In second 2, pick 64 -> leave 8. In second 3, pick 25 -> leave 5. In second 4, pick 10 -> leave 3. Remaining sum: 5 + 8 + 9 + 4 + 3 = 29."
        },
        {
          input: "gifts = [1,1,1,1], k = 4",
          output: "4",
          explanation: "sqrt(1) = 1, so pile counts never change."
        },
        {
          input: "gifts = [16], k = 2",
          output: "2",
          explanation: "16 -> 4 -> 2."
        },
        {
          input: "gifts = [2,2], k = 1",
          output: "3",
          explanation: "2 becomes 1, other pile remains 2. Total = 3."
        }
      ],
      optimalSolution: `function pickGifts(gifts, k) {\n  gifts.sort((a, b) => a - b);\n  for (let step = 0; step < k; step++) {\n    const maxVal = gifts.pop();\n    const reduced = Math.floor(Math.sqrt(maxVal));\n    let l = 0, r = gifts.length;\n    while (l < r) {\n      const m = (l + r) >> 1;\n      if (gifts[m] < reduced) l = m + 1;\n      else r = m;\n    }\n    gifts.splice(l, 0, reduced);\n  }\n  return gifts.reduce((a, b) => a + b, 0);\n}`,
      optimalTimeComplexity: "O(K log N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function pickGifts(gifts, k) {\n  for (let i = 0; i < k; i++) {\n    gifts.sort((a, b) => b - a);\n    gifts[0] = Math.floor(Math.sqrt(gifts[0]));\n  }\n  return gifts.reduce((a, b) => a + b, 0);\n}`,
      suboptimalTimeComplexity: "O(K * N log N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: [
        "Re-sorting the entire array on every step instead of binary-inserting the modified pile",
        "Overlooking integer overflow in sum when using 32-bit arithmetic"
      ],
      hints: [
        "A max-heap allows extracting the maximum gift pile and inserting `floor(sqrt(max))` in O(log N).",
        "Repeat this operation `k` times, then sum all elements in the heap."
      ],
      oracleFn: (gifts: number[], k: number) => {
        const arr = [...gifts].sort((a, b) => a - b);
        for (let step = 0; step < k; step++) {
          const maxVal = arr.pop()!;
          const reduced = Math.floor(Math.sqrt(maxVal));
          let l = 0, r = arr.length;
          while (l < r) {
            const m = (l + r) >> 1;
            if (arr[m] < reduced) l = m + 1;
            else r = m;
          }
          arr.splice(l, 0, reduced);
        }
        return arr.reduce((a, b) => a + b, 0);
      },
      testCases: {
        functional: [
          [[25, 64, 9, 4, 100], 4],
          [[1, 1, 1, 1], 4],
          [[16], 2],
          [[2, 2], 1]
        ],
        boundary: [
          [[1], 1],
          [[1000000000], 1],
          [[4, 4, 4], 3]
        ],
        adversarial: [
          [[100, 100, 100, 100], 4],
          [[81, 49, 36, 25, 16], 3],
          [[10, 20, 30, 40], 5]
        ],
        stress: [
          [Array.from({ length: 400 }, (_, i) => i + 10), 100],
          [Array.from({ length: 400 }, () => 10000), 200]
        ]
      }
    }),

    // 208. Total Cost to Hire K Workers
    createProblem({
      num: 208,
      title: "Total Cost to Hire K Workers",
      slug: "total-cost-to-hire-k-workers",
      level: 9,
      difficulty: "MEDIUM",
      topic: "Heap / Two Pointers",
      patternSlug: "heap-priority-queue",
      estimatedTimeMin: 25,
      statement: "You are given a 0-indexed integer array `costs` where `costs[i]` is the cost of hiring the `i-th` worker.\n\nYou're also given two integers `k` and `candidates`. We want to hire exactly `k` workers according to the following rules:\n- You will run `k` sessions and hire exactly one worker in each session.\n- In each hiring session, choose the worker with the lowest cost from either the first `candidates` workers or the last `candidates` workers. Break the tie by the smallest index.\n- If there are fewer than `candidates` workers remaining, choose the worker with the lowest cost among them. Break the tie by the smallest index.\n- A worker can only be chosen once.\n\nReturn the total cost to hire `k` workers.",
      functionName: "totalCost",
      parameters: [
        { name: "costs", type: "number[]", description: "Array of worker hiring costs" },
        { name: "k", type: "number", description: "Number of workers to hire" },
        { name: "candidates", type: "number", description: "Candidate window size from each end" }
      ],
      returnType: "number",
      constraints: ["1 <= costs.length <= 10^5", "1 <= costs[i] <= 10^5", "1 <= k, candidates <= costs.length"],
      examples: [
        {
          input: "costs = [17,12,10,2,7,2,11,20,8], k = 3, candidates = 4",
          output: "11",
          explanation: "Candidates: first 4 [17,12,10,2], last 4 [2,11,20,8]. Pick 2 (tie broke by smaller index 3). Next pick 2 (from last 4). Next pick 7. Total: 2 + 2 + 7 = 11."
        },
        {
          input: "costs = [1,2,4,1], k = 3, candidates = 3",
          output: "4",
          explanation: "Fewer than 2*candidates distinct workers, so all workers are candidates. Lowest 3 are 1, 1, 2 = 4."
        },
        {
          input: "costs = [5,4,3,2,1], k = 2, candidates = 2",
          output: "3",
          explanation: "First 2: [5,4], last 2: [2,1]. Pick 1, then pick 2. Total = 3."
        },
        {
          input: "costs = [10], k = 1, candidates = 1",
          output: "10",
          explanation: "Single worker hired."
        }
      ],
      optimalSolution: `function totalCost(costs, k, candidates) {\n  let head = 0, tail = costs.length - 1;\n  const headHeap = [];\n  const tailHeap = [];\n  let total = 0;\n  for (let i = 0; i < k; i++) {\n    while (headHeap.length < candidates && head <= tail) {\n      let val = costs[head++];\n      let l = 0, r = headHeap.length;\n      while (l < r) {\n        const m = (l + r) >> 1;\n        if (headHeap[m] < val) l = m + 1; else r = m;\n      }\n      headHeap.splice(l, 0, val);\n    }\n    while (tailHeap.length < candidates && head <= tail) {\n      let val = costs[tail--];\n      let l = 0, r = tailHeap.length;\n      while (l < r) {\n        const m = (l + r) >> 1;\n        if (tailHeap[m] < val) l = m + 1; else r = m;\n      }\n      tailHeap.splice(l, 0, val);\n    }\n    const hMin = headHeap.length > 0 ? headHeap[0] : Infinity;\n    const tMin = tailHeap.length > 0 ? tailHeap[0] : Infinity;\n    if (hMin <= tMin) {\n      total += headHeap.shift();\n    } else {\n      total += tailHeap.shift();\n    }\n  }\n  return total;\n}`,
      optimalTimeComplexity: "O(K log(candidates))",
      optimalSpaceComplexity: "O(candidates)",
      suboptimalSolution: `function totalCost(costs, k, candidates) {\n  let total = 0;\n  for (let s = 0; s < k; s++) {\n    let bestIdx = 0;\n    let minCost = costs[0];\n    const n = costs.length;\n    for (let i = 0; i < Math.min(candidates, n); i++) {\n      if (costs[i] < minCost) {\n        minCost = costs[i];\n        bestIdx = i;\n      }\n    }\n    for (let i = Math.max(n - candidates, 0); i < n; i++) {\n      if (costs[i] < minCost) {\n        minCost = costs[i];\n        bestIdx = i;\n      }\n    }\n    total += minCost;\n    costs.splice(bestIdx, 1);\n  }\n  return total;\n}`,
      suboptimalTimeComplexity: "O(K * (candidates + N))",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: [
        "Allowing head and tail candidate windows to overlap and double-counting workers",
        "Tie-breaking: failing to prefer head candidate when costs are identical"
      ],
      hints: [
        "Use two min-heaps: one for the first `candidates` workers and one for the last `candidates` workers.",
        "Compare the top of both heaps. If `headHeap.top() <= tailHeap.top()`, pick from headHeap and refill from `head++`.",
        "Otherwise pick from tailHeap and refill from `tail--`."
      ],
      oracleFn: (costs: number[], k: number, candidates: number) => {
        let head = 0;
        let tail = costs.length - 1;
        const headHeap: number[] = [];
        const tailHeap: number[] = [];
        let total = 0;
        for (let i = 0; i < k; i++) {
          while (headHeap.length < candidates && head <= tail) {
            const val = costs[head++];
            let l = 0, r = headHeap.length;
            while (l < r) {
              const m = (l + r) >> 1;
              if (headHeap[m] < val) l = m + 1; else r = m;
            }
            headHeap.splice(l, 0, val);
          }
          while (tailHeap.length < candidates && head <= tail) {
            const val = costs[tail--];
            let l = 0, r = tailHeap.length;
            while (l < r) {
              const m = (l + r) >> 1;
              if (tailHeap[m] < val) l = m + 1; else r = m;
            }
            tailHeap.splice(l, 0, val);
          }
          const hMin = headHeap.length > 0 ? headHeap[0] : Infinity;
          const tMin = tailHeap.length > 0 ? tailHeap[0] : Infinity;
          if (hMin <= tMin) {
            total += headHeap.shift()!;
          } else {
            total += tailHeap.shift()!;
          }
        }
        return total;
      },
      testCases: {
        functional: [
          [[17, 12, 10, 2, 7, 2, 11, 20, 8], 3, 4],
          [[1, 2, 4, 1], 3, 3],
          [[5, 4, 3, 2, 1], 2, 2],
          [[10], 1, 1]
        ],
        boundary: [
          [[1, 2], 1, 1],
          [[1, 2], 2, 1],
          [[3, 2, 1], 1, 2]
        ],
        adversarial: [
          [[25, 65, 41, 31, 86, 68, 82, 60, 72, 77, 50, 93, 95, 89, 48, 45, 20, 80, 82, 13, 77, 98, 76, 40, 77, 86, 62], 12, 3],
          [[2, 2, 2, 2, 2], 3, 2],
          [[1, 100, 1, 100], 2, 1]
        ],
        stress: [
          [Array.from({ length: 400 }, (_, i) => (i % 50) + 1), 50, 10],
          [Array.from({ length: 400 }, (_, i) => 400 - i), 40, 20]
        ]
      }
    })
  ];

  return {
    level: 9,
    levelTitle: "Level 9 — Heap / Priority Queue / Top K",
    topic: "Heaps, Priority Queues, Top-K and Selection Algorithms",
    problems
  };
}
