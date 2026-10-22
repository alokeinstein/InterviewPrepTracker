import { LevelPayload, GeneratedProblem } from './types';
import { createProblem } from './problemBuilder';

export function getLevel22Payload(): LevelPayload {
  const problems: GeneratedProblem[] = [
    // 451. Minimize Maximum of Array
    createProblem({
      num: 451,
      title: "Minimize Maximum of Array",
      slug: "minimize-maximum-of-array",
      level: 22,
      difficulty: "MEDIUM",
      topic: "Binary Search / Prefix Sums",
      patternSlug: "advanced-binary-search-trie",
      estimatedTimeMin: 25,
      statement: "You are given a 0-indexed integer array `nums` of length `n`.\n\nIn one operation, you can:\n- Choose an integer `i` such that `1 <= i < n` and `nums[i] > 0`.\n- Decrease `nums[i]` by 1.\n- Increase `nums[i - 1]` by 1.\n\nReturn the minimum possible value of the maximum integer of `nums` after performing any number of operations.",
      functionName: "minimizeArrayValue",
      parameters: [
        { name: "nums", type: "number[]", description: "Array of non-negative integers" }
      ],
      returnType: "number",
      constraints: ["n == nums.length", "2 <= n <= 10^5", "0 <= nums[i] <= 10^9"],
      examples: [
        { input: "nums = [3,7,1,6]", output: "5", explanation: "One sequence of operations: decrease nums[1] and increase nums[0] twice: [5,5,1,6]. Then decrease nums[3] and increase nums[2]: [5,5,2,5]. Max element is 5." },
        { input: "nums = [10,1]", output: "10", explanation: "No operation can decrease nums[0], so the maximum remains 10." },
        { input: "nums = [5,5,5,5]", output: "5", explanation: "Array is already uniform with maximum 5." },
        { input: "nums = [13,10,35,24,76]", output: "32", explanation: "Prefix averages ceiling values give 32 as minimum maximum." }
      ],
      optimalSolution: `function minimizeArrayValue(nums) {\n  let prefixSum = 0;\n  let maxVal = 0;\n  for (let i = 0; i < nums.length; i++) {\n    prefixSum += nums[i];\n    const ceilAvg = Math.ceil(prefixSum / (i + 1));\n    if (ceilAvg > maxVal) maxVal = ceilAvg;\n  }\n  return maxVal;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function minimizeArrayValue(nums) {\n  let low = 0, high = Math.max(...nums);\n  const check = (limit) => {\n    let extra = 0;\n    for (let i = nums.length - 1; i >= 1; i--) {\n      extra = Math.max(0, extra + nums[i] - limit);\n    }\n    return nums[0] + extra <= limit;\n  };\n  while (low < high) {\n    const mid = Math.floor((low + high) / 2);\n    if (check(mid)) high = mid;\n    else low = mid + 1;\n  }\n  return low;\n}`,
      suboptimalTimeComplexity: "O(N log(max(nums)))",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: [
        "Failing to recognize that values can only flow leftwards from index i to i-1, meaning prefix sums bound the prefix average.",
        "Using integer division instead of ceiling division for average calculation."
      ],
      hints: [
        "Notice that operations can only move values to the left, never to the right.",
        "For any prefix nums[0..i], the sum cannot be reduced. The average sum / (i + 1) rounded up is a lower bound on the maximum.",
        "Compute the running maximum of Math.ceil(prefixSum / (i + 1))."
      ],
      oracleFn: (nums: number[]) => {
        let prefixSum = 0;
        let maxVal = 0;
        for (let i = 0; i < nums.length; i++) {
          prefixSum += nums[i];
          const ceilAvg = Math.ceil(prefixSum / (i + 1));
          if (ceilAvg > maxVal) maxVal = ceilAvg;
        }
        return maxVal;
      },
      testCases: {
        functional: [
          [[3, 7, 1, 6]],
          [[10, 1]],
          [[5, 5, 5, 5]],
          [[13, 10, 35, 24, 76]]
        ],
        boundary: [
          [[0, 0]],
          [[1, 0]],
          [[0, 1000]]
        ],
        adversarial: [
          [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
          [[10, 9, 8, 7, 6, 5, 4, 3, 2, 1]],
          [[100, 0, 0, 0, 100]]
        ],
        stress: [
          [Array.from({ length: 80 }, (_, i) => (i * 37) % 1000)],
          [Array.from({ length: 100 }, (_, i) => 1000 - i)]
        ]
      }
    }),

    // 452. Maximum Value at a Given Index in a Bounded Array
    createProblem({
      num: 452,
      title: "Maximum Value at a Given Index in a Bounded Array",
      slug: "maximum-value-at-a-given-index-in-a-bounded-array",
      level: 22,
      difficulty: "MEDIUM",
      topic: "Binary Search / Math",
      patternSlug: "advanced-binary-search-trie",
      estimatedTimeMin: 30,
      statement: "You are given three positive integers: `n`, `index`, and `maxSum`. You want to construct an array `nums` (0-indexed) that satisfies the following conditions:\n- `nums.length == n`\n- `nums[i]` is a positive integer where `0 <= i < n`.\n- `abs(nums[i] - nums[i+1]) <= 1` where `0 <= i < n - 1`.\n- The sum of all the elements of `nums` does not exceed `maxSum`.\n- `nums[index]` is maximized.\n\nReturn `nums[index]` of the constructed array.",
      functionName: "maxValue",
      parameters: [
        { name: "n", type: "number", description: "Array size" },
        { name: "index", type: "number", description: "Target index" },
        { name: "maxSum", type: "number", description: "Maximum allowed array sum" }
      ],
      returnType: "number",
      constraints: ["1 <= n <= maxSum <= 10^9", "0 <= index < n"],
      examples: [
        { input: "n = 4, index = 2, maxSum = 6", output: "2", explanation: "Array [1, 1, 2, 1] has sum 5 <= 6 and satisfies all conditions. nums[2] is 2." },
        { input: "n = 6, index = 1, maxSum = 10", output: "3", explanation: "Array [2, 3, 2, 1, 1, 1] has sum 10 <= 10. nums[1] is 3." },
        { input: "n = 3, index = 0, maxSum = 8150938", output: "2716980", explanation: "Peak at index 0 descending across 3 elements." }
      ],
      optimalSolution: `function maxValue(n, index, maxSum) {\n  const calcSum = (count, peak) => {\n    if (count <= 0) return 0;\n    if (peak >= count) {\n      return ((peak + peak - count + 1) * count) / 2;\n    } else {\n      return ((peak + 1) * peak) / 2 + (count - peak);\n    }\n  };\n  let low = 1, high = maxSum;\n  let res = 1;\n  while (low <= high) {\n    const mid = Math.floor((low + high) / 2);\n    const leftSum = calcSum(index, mid - 1);\n    const rightSum = calcSum(n - 1 - index, mid - 1);\n    const total = mid + leftSum + rightSum;\n    if (total <= maxSum) {\n      res = mid;\n      low = mid + 1;\n    } else {\n      high = mid - 1;\n    }\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(log(maxSum))",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function maxValue(n, index, maxSum) {\n  let cur = 1;\n  while (true) {\n    const nextMid = cur + 1;\n    const calc = (cnt, pk) => cnt <= 0 ? 0 : (pk >= cnt ? ((pk + pk - cnt + 1) * cnt) / 2 : ((pk + 1) * pk) / 2 + (cnt - pk));\n    if (nextMid + calc(index, nextMid - 1) + calc(n - 1 - index, nextMid - 1) <= maxSum) {\n      cur = nextMid;\n    } else {\n      break;\n    }\n  }\n  return cur;\n}`,
      suboptimalTimeComplexity: "O(maxSum / n)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: [
        "Handling arithmetic series when peak < count, where the remaining values flatten out to 1.",
        "Integer overflow if multiplying without proper numeric range handling."
      ],
      hints: [
        "To minimize the sum for a given peak value at `index`, each adjacent number should decrease by 1 until hitting 1.",
        "Binary search for the optimal peak value in the range [1, maxSum].",
        "Calculate the arithmetic series sum for both the left and right wings."
      ],
      oracleFn: (n: number, index: number, maxSum: number) => {
        const calcSum = (count: number, peak: number) => {
          if (count <= 0) return 0;
          if (peak >= count) {
            return ((peak + peak - count + 1) * count) / 2;
          } else {
            return ((peak + 1) * peak) / 2 + (count - peak);
          }
        };
        let low = 1, high = maxSum;
        let res = 1;
        while (low <= high) {
          const mid = Math.floor((low + high) / 2);
          const leftSum = calcSum(index, mid - 1);
          const rightSum = calcSum(n - 1 - index, mid - 1);
          const total = mid + leftSum + rightSum;
          if (total <= maxSum) {
            res = mid;
            low = mid + 1;
          } else {
            high = mid - 1;
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [4, 2, 6],
          [6, 1, 10],
          [3, 0, 8150938],
          [4, 0, 4]
        ],
        boundary: [
          [1, 0, 1],
          [1, 0, 100],
          [3, 1, 3]
        ],
        adversarial: [
          [9, 4, 100],
          [10, 0, 100],
          [10, 9, 100]
        ],
        stress: [
          [100, 50, 10000],
          [500, 250, 50000]
        ]
      }
    }),

    // 453. Minimum Speed to Arrive on Time
    createProblem({
      num: 453,
      title: "Minimum Speed to Arrive on Time",
      slug: "minimum-speed-to-arrive-on-time",
      level: 22,
      difficulty: "MEDIUM",
      topic: "Binary Search",
      patternSlug: "advanced-binary-search-trie",
      estimatedTimeMin: 25,
      statement: "You are given a floating-point number `hour`, representing the amount of time you have to reach the office. To commute to the office, you must take `n` trains in sequential order. You are also given an integer array `dist` of length `n`, where `dist[i]` describes the distance (in kilometers) of the `i-th` train ride.\n\nEach train can only depart at an integer hour, so you may need to wait in between each train ride except the last one.\n- For example, if the 1st train ride takes `1.5` hours, you must wait for an additional `0.5` hours before taking the second train at hour 2.\n- The last train ride does not require waiting for an integer hour.\n\nReturn the minimum positive integer speed (in km/h) that all trains must travel at for you to reach the office on time, or `-1` if it is impossible to be on time.",
      functionName: "minSpeedOnTime",
      parameters: [
        { name: "dist", type: "number[]", description: "Distance of each train ride" },
        { name: "hour", type: "number", description: "Total available hours" }
      ],
      returnType: "number",
      constraints: ["n == dist.length", "1 <= n <= 10^5", "1 <= dist[i] <= 10^5", "1 <= hour <= 10^9", "hour has at most two digits after decimal point"],
      examples: [
        { input: "dist = [1,3,2], hour = 6", output: "1", explanation: "At speed 1: 1st train 1h (depart hr 1), 2nd train 3h (total 4h, depart hr 4), 3rd train 2h (total 6h <= 6)." },
        { input: "dist = [1,3,2], hour = 2.7", output: "3", explanation: "At speed 3: 1st train 1/3h wait to 1h, 2nd train 3/3h wait to 2h, 3rd train 2/3 = 0.67h. Total 2.67h <= 2.7." },
        { input: "dist = [1,3,2], hour = 1.9", output: "-1", explanation: "First two trains require at least 2 full hours waiting, so impossible to finish in 1.9 hours." }
      ],
      optimalSolution: `function minSpeedOnTime(dist, hour) {\n  const n = dist.length;\n  if (hour <= n - 1) return -1;\n  let low = 1, high = 1e7;\n  let ans = -1;\n  while (low <= high) {\n    const mid = Math.floor((low + high) / 2);\n    let time = 0;\n    for (let i = 0; i < n - 1; i++) {\n      time += Math.ceil(dist[i] / mid);\n    }\n    time += dist[n - 1] / mid;\n    if (time <= hour) {\n      ans = mid;\n      high = mid - 1;\n    } else {\n      low = mid + 1;\n    }\n  }\n  return ans;\n}`,
      optimalTimeComplexity: "O(N log(10^7))",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function minSpeedOnTime(dist, hour) {\n  const n = dist.length;\n  if (hour <= n - 1) return -1;\n  for (let speed = 1; speed <= 1e7; speed++) {\n    let time = 0;\n    for (let i = 0; i < n - 1; i++) time += Math.ceil(dist[i] / speed);\n    time += dist[n - 1] / speed;\n    if (time <= hour) return speed;\n  }\n  return -1;\n}`,
      suboptimalTimeComplexity: "O(N * maxSpeed)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: [
        "Applying Math.ceil to the last train ride (the last ride does not require waiting for an integer hour).",
        "Setting the binary search upper bound too low (since dist[n-1] can be 10^5 and decimal part can be 0.01, speed can be up to 10^7)."
      ],
      hints: [
        "Since each of the first n-1 trains takes at least 1 hour, if hour <= n - 1 it is impossible; return -1.",
        "The time taken is monotonically decreasing with respect to speed, making binary search applicable.",
        "Range of speed: [1, 10^7]."
      ],
      oracleFn: (dist: number[], hour: number) => {
        const n = dist.length;
        if (hour <= n - 1) return -1;
        let low = 1, high = 1e7;
        let ans = -1;
        while (low <= high) {
          const mid = Math.floor((low + high) / 2);
          let time = 0;
          for (let i = 0; i < n - 1; i++) {
            time += Math.ceil(dist[i] / mid);
          }
          time += dist[n - 1] / mid;
          if (time <= hour) {
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
          [[1, 3, 2], 6],
          [[1, 3, 2], 2.7],
          [[1, 3, 2], 1.9],
          [[1, 1], 1.0]
        ],
        boundary: [
          [[5], 1],
          [[5], 0.5],
          [[1, 1, 1], 3]
        ],
        adversarial: [
          [[1, 1, 100000], 2.01],
          [[100, 200, 300], 3.5],
          [[10, 20, 30, 40], 4.2]
        ],
        stress: [
          [Array.from({ length: 60 }, () => 100), 75],
          [Array.from({ length: 80 }, (_, i) => (i % 10) + 1), 90.5]
        ]
      }
    }),

    // 454. Find K Closest Elements
    createProblem({
      num: 454,
      title: "Find K Closest Elements",
      slug: "find-k-closest-elements",
      level: 22,
      difficulty: "MEDIUM",
      topic: "Binary Search / Sliding Window",
      patternSlug: "advanced-binary-search-trie",
      estimatedTimeMin: 25,
      statement: "Given a sorted integer array `arr`, two integers `k` and `x`, return the `k` closest integers to `x` in the array. The result should also be sorted in ascending order.\n\nAn integer `a` is closer to `x` than an integer `b` if:\n- `|a - x| < |b - x|`, or\n- `|a - x| == |b - x|` and `a < b`.",
      functionName: "findClosestElements",
      parameters: [
        { name: "arr", type: "number[]", description: "Sorted integer array" },
        { name: "k", type: "number", description: "Number of elements to return" },
        { name: "x", type: "number", description: "Target value" }
      ],
      returnType: "number[]",
      constraints: ["1 <= k <= arr.length", "1 <= arr.length <= 10^4", "arr is sorted in ascending order", "-10^4 <= arr[i], x <= 10^4"],
      examples: [
        { input: "arr = [1,2,3,4,5], k = 4, x = 3", output: "[1,2,3,4]", explanation: "Elements 1, 2, 3, 4 are closest to 3." },
        { input: "arr = [1,2,3,4,5], k = 4, x = -1", output: "[1,2,3,4]", explanation: "Elements 1, 2, 3, 4 are closest to -1." },
        { input: "arr = [1,1,1,10,10,10], k = 1, x = 9", output: "[10]", explanation: "Element 10 has distance 1 from 9." }
      ],
      optimalSolution: `function findClosestElements(arr, k, x) {\n  let low = 0, high = arr.length - k;\n  while (low < high) {\n    const mid = Math.floor((low + high) / 2);\n    if (x - arr[mid] > arr[mid + k] - x) {\n      low = mid + 1;\n    } else {\n      high = mid;\n    }\n  }\n  return arr.slice(low, low + k);\n}`,
      optimalTimeComplexity: "O(log(N - K) + K)",
      optimalSpaceComplexity: "O(1) extra space",
      suboptimalSolution: `function findClosestElements(arr, k, x) {\n  const sorted = [...arr].sort((a, b) => {\n    const diffA = Math.abs(a - x);\n    const diffB = Math.abs(b - x);\n    if (diffA !== diffB) return diffA - diffB;\n    return a - b;\n  });\n  return sorted.slice(0, k).sort((a, b) => a - b);\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Expanding around a single closest element with two pointers without correctly handling tie-breakers where a < b.",
        "Sorting the entire array instead of binary searching the window starting position."
      ],
      hints: [
        "Since the array is sorted, the answer is always a contiguous subarray of length k.",
        "Binary search for the starting index `left` in range [0, arr.length - k].",
        "Compare distance from x to arr[mid] versus arr[mid + k]."
      ],
      oracleFn: (arr: number[], k: number, x: number) => {
        let low = 0, high = arr.length - k;
        while (low < high) {
          const mid = Math.floor((low + high) / 2);
          if (x - arr[mid] > arr[mid + k] - x) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        return arr.slice(low, low + k);
      },
      testCases: {
        functional: [
          [[1, 2, 3, 4, 5], 4, 3],
          [[1, 2, 3, 4, 5], 4, -1],
          [[1, 1, 1, 10, 10, 10], 1, 9],
          [[0, 0, 1, 2, 3, 3, 4, 7, 7, 8], 3, 5]
        ],
        boundary: [
          [[1], 1, 1],
          [[1, 2], 1, 1],
          [[1, 2], 2, 10]
        ],
        adversarial: [
          [[-10, -5, 0, 5, 10], 3, 0],
          [[1, 2, 3, 4, 5], 5, 3],
          [[1, 3, 5, 7, 9], 2, 4]
        ],
        stress: [
          [Array.from({ length: 80 }, (_, i) => i * 2), 10, 55],
          [Array.from({ length: 100 }, (_, i) => i), 20, 95]
        ]
      }
    }),

    // 455. Time Based Key-Value Store (DESIGN)
    createProblem({
      num: 455,
      title: "Time Based Key-Value Store",
      slug: "time-based-key-value-store",
      level: 22,
      difficulty: "MEDIUM",
      topic: "Design / Binary Search",
      patternSlug: "advanced-binary-search-trie",
      estimatedTimeMin: 25,
      statement: "Design a time-based key-value data structure that can store multiple values for the same key at different time stamps and retrieve the key's value at a certain timestamp.\n\nImplement the `TimeMap` class:\n- `TimeMap()` Initializes the object of the data structure.\n- `void set(String key, String value, int timestamp)` Stores the key `key` with the value `value` at the given time `timestamp`.\n- `String get(String key, int timestamp)` Returns a value such that `set` was called previously, with `timestamp_prev <= timestamp`. If there are multiple such values, it returns the value associated with the largest `timestamp_prev`. If there are no values, it returns `\"\"`.",
      executionModel: "DESIGN",
      functionName: "TimeMap",
      parameters: [
        { name: "commands", type: "string[]", description: "Array of operations: ['TimeMap', 'set', 'get']" },
        { name: "args", type: "any[]", description: "Arguments for each operation" }
      ],
      returnType: "any[]",
      starterTemplates: {
        javascript: `class TimeMap {\n  constructor() {\n    // Initialize data structure\n  }\n  /**\n   * @param {string} key\n   * @param {string} value\n   * @param {number} timestamp\n   * @return {void}\n   */\n  set(key, value, timestamp) {}\n  /**\n   * @param {string} key\n   * @param {number} timestamp\n   * @return {string}\n   */\n  get(key, timestamp) {}\n}\n`,
        typescript: `class TimeMap {\n  constructor() {}\n  set(key: string, value: string, timestamp: number): void {}\n  get(key: string, timestamp: number): string { throw new Error("Not implemented"); }\n}\n`,
        python: `class TimeMap:\n    def __init__(self):\n        pass\n    def set(self, key: str, value: str, timestamp: int) -> None:\n        pass\n    def get(self, key: str, timestamp: int) -> str:\n        pass\n`
      },
      constraints: ["1 <= key.length, value.length <= 100", "key and value consist of lowercase English letters and digits", "1 <= timestamp <= 10^7", "All the timestamps timestamp of set are strictly increasing", "At most 2 * 10^5 calls will be made to set and get"],
      examples: [
        {
          input: 'commands = ["TimeMap","set","get","get","set","get","get"]\nargs = [[],["foo","bar",1],["foo",1],["foo",3],["foo","bar2",4],["foo",4],["foo",5]]',
          output: '[null,null,"bar","bar",null,"bar2","bar2"]',
          explanation: "TimeMap timeMap = new TimeMap();\ntimeMap.set('foo', 'bar', 1);\ntimeMap.get('foo', 1); // returns 'bar'\ntimeMap.get('foo', 3); // returns 'bar'\ntimeMap.set('foo', 'bar2', 4);\ntimeMap.get('foo', 4); // returns 'bar2'\ntimeMap.get('foo', 5); // returns 'bar2'"
        },
        {
          input: 'commands = ["TimeMap","set","get"]\nargs = [[],["k","v",10],["k",5]]',
          output: '[null,null,""]',
          explanation: "Querying timestamp 5 before any entry returns empty string."
        }
      ],
      optimalSolution: `class TimeMap {\n  constructor() {\n    this.map = new Map();\n  }\n  set(key, value, timestamp) {\n    if (!this.map.has(key)) this.map.set(key, []);\n    this.map.get(key).push([timestamp, value]);\n  }\n  get(key, timestamp) {\n    const list = this.map.get(key);\n    if (!list || list.length === 0) return "";\n    let l = 0, r = list.length - 1;\n    let res = "";\n    while (l <= r) {\n      const mid = (l + r) >> 1;\n      if (list[mid][0] <= timestamp) {\n        res = list[mid][1];\n        l = mid + 1;\n      } else {\n        r = mid - 1;\n      }\n    }\n    return res;\n  }\n}`,
      optimalTimeComplexity: "O(1) for set, O(log N) for get",
      optimalSpaceComplexity: "O(Total items stored)",
      suboptimalSolution: `class TimeMap {\n  constructor() {\n    this.data = [];\n  }\n  set(key, value, timestamp) {\n    this.data.push({ key, value, timestamp });\n  }\n  get(key, timestamp) {\n    let res = "";\n    let maxTs = -1;\n    for (const item of this.data) {\n      if (item.key === key && item.timestamp <= timestamp && item.timestamp > maxTs) {\n        maxTs = item.timestamp;\n        res = item.value;\n      }\n    }\n    return res;\n  }\n}`,
      suboptimalTimeComplexity: "O(1) for set, O(N) for get",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Returning empty string when timestamp equals the stored timestamp exactly.",
        "Failing to utilize the guarantee that set timestamps are strictly increasing, which allows direct binary search without sorting."
      ],
      hints: [
        "Store values for each key in an array of pairs: [timestamp, value].",
        "Since timestamps arrive strictly increasing, the list is already sorted by timestamp.",
        "Use binary search (upper bound) to find the largest timestamp <= requested timestamp."
      ],
      oracleFn: (commands: string[], args: any[]) => {
        class RefTimeMap {
          map = new Map<string, [number, string][]>();
          set(key: string, value: string, timestamp: number) {
            if (!this.map.has(key)) this.map.set(key, []);
            this.map.get(key)!.push([timestamp, value]);
          }
          get(key: string, timestamp: number): string {
            const list = this.map.get(key);
            if (!list || list.length === 0) return "";
            let l = 0, r = list.length - 1;
            let res = "";
            while (l <= r) {
              const mid = (l + r) >> 1;
              if (list[mid][0] <= timestamp) {
                res = list[mid][1];
                l = mid + 1;
              } else {
                r = mid - 1;
              }
            }
            return res;
          }
        }
        let tm: RefTimeMap | null = null;
        const res: any[] = [];
        for (let i = 0; i < commands.length; i++) {
          const cmd = commands[i];
          if (cmd === 'TimeMap') {
            tm = new RefTimeMap();
            res.push(null);
          } else if (cmd === 'set') {
            tm!.set(args[i][0], args[i][1], args[i][2]);
            res.push(null);
          } else if (cmd === 'get') {
            res.push(tm!.get(args[i][0], args[i][1]));
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [
            ["TimeMap", "set", "get", "get", "set", "get", "get"],
            [[], ["foo", "bar", 1], ["foo", 1], ["foo", 3], ["foo", "bar2", 4], ["foo", 4], ["foo", 5]]
          ],
          [
            ["TimeMap", "set", "get"],
            [[], ["k", "v", 10], ["k", 5]]
          ],
          [
            ["TimeMap", "set", "set", "get", "get"],
            [[], ["a", "apple", 10], ["a", "apricot", 20], ["a", 15], ["a", 25]]
          ],
          [
            ["TimeMap", "set", "set", "get", "get"],
            [[], ["user", "alice", 100], ["user", "bob", 200], ["user", 150], ["user", 250]]
          ]
        ],
        boundary: [
          [
            ["TimeMap", "get"],
            [[], ["nonexistent", 1]]
          ],
          [
            ["TimeMap", "set", "get"],
            [[], ["a", "b", 1], ["a", 1]]
          ],
          [
            ["TimeMap", "set", "get", "get"],
            [[], ["single", "val", 5], ["single", 4], ["single", 5]]
          ]
        ],
        adversarial: [
          [
            ["TimeMap", "set", "set", "set", "get", "get", "get"],
            [[], ["x", "1", 10], ["x", "2", 20], ["x", "3", 30], ["x", 5], ["x", 20], ["x", 100]]
          ],
          [
            ["TimeMap", "set", "get", "set", "get"],
            [[], ["alpha", "v1", 10], ["beta", 10], ["beta", "v2", 20], ["alpha", 20]]
          ]
        ],
        stress: [
          [
            ["TimeMap", ...Array.from({ length: 30 }, () => "set"), ...Array.from({ length: 30 }, () => "get")],
            [[], ...Array.from({ length: 30 }, (_, i) => ["key", `val${i}`, i * 10 + 1]), ...Array.from({ length: 30 }, (_, i) => ["key", i * 10 + 5])]
          ],
          [
            ["TimeMap", ...Array.from({ length: 40 }, () => "set"), ...Array.from({ length: 40 }, () => "get")],
            [[], ...Array.from({ length: 40 }, (_, i) => [`k${i % 4}`, `v${i}`, i * 5 + 1]), ...Array.from({ length: 40 }, (_, i) => [`k${i % 4}`, i * 5])]
          ]
        ]
      }
    }),

    // 456. Random Pick with Weight
    createProblem({
      num: 456,
      title: "Random Pick with Weight",
      slug: "random-pick-with-weight",
      level: 22,
      difficulty: "MEDIUM",
      topic: "Binary Search / Prefix Sums",
      patternSlug: "advanced-binary-search-trie",
      estimatedTimeMin: 20,
      statement: "You are given a 0-indexed array of positive integers `w` where `w[i]` describes the weight of the `i-th` index, and a cumulative target value `target` where `0 <= target < sum(w)`.\n\nImplement the function `pickIndexByWeight(w, target)` that returns the 0-based index `i` such that `target` falls into index `i`'s weight interval `[prefixSum[i - 1], prefixSum[i])` (assuming prefixSum[-1] = 0).\n\nThis deterministic formulation evaluates the core binary search over prefix sums used in weighted reservoir sampling.",
      functionName: "pickIndexByWeight",
      parameters: [
        { name: "w", type: "number[]", description: "Array of positive integer weights" },
        { name: "target", type: "number", description: "Target cumulative weight to look up" }
      ],
      returnType: "number",
      constraints: ["1 <= w.length <= 10^4", "1 <= w[i] <= 10^5", "0 <= target < sum(w)"],
      examples: [
        { input: "w = [1, 3], target = 0", output: "0", explanation: "Prefix intervals are [0, 1) -> 0 and [1, 4) -> 1. Target 0 is in index 0." },
        { input: "w = [1, 3], target = 2", output: "1", explanation: "Target 2 is in [1, 4) -> index 1." },
        { input: "w = [3, 14, 1, 7], target = 18", output: "1", explanation: "Prefix bounds: 0: [0,3), 1: [3,17), 2: [17,18), 3: [18,25). Target 18 is at index 3." }
      ],
      optimalSolution: `function pickIndexByWeight(w, target) {\n  const prefix = [];\n  let sum = 0;\n  for (const weight of w) {\n    sum += weight;\n    prefix.push(sum);\n  }\n  let low = 0, high = prefix.length - 1;\n  while (low < high) {\n    const mid = Math.floor((low + high) / 2);\n    if (target < prefix[mid]) {\n      high = mid;\n    } else {\n      low = mid + 1;\n    }\n  }\n  return low;\n}`,
      optimalTimeComplexity: "O(N) prefix sum construction + O(log N) binary search",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function pickIndexByWeight(w, target) {\n  let sum = 0;\n  for (let i = 0; i < w.length; i++) {\n    sum += w[i];\n    if (target < sum) return i;\n  }\n  return w.length - 1;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: [
        "Confusing strictly less than versus less-than-or-equal when mapping 0-indexed target against prefix sums.",
        "Off-by-one errors when target hits the boundary of two intervals."
      ],
      hints: [
        "Compute the prefix sum array: prefix[i] is the sum of w[0..i].",
        "Target is in index i if (prefix[i-1] || 0) <= target < prefix[i].",
        "Binary search for the first index where prefix[mid] > target."
      ],
      oracleFn: (w: number[], target: number) => {
        let sum = 0;
        const prefix: number[] = [];
        for (const x of w) {
          sum += x;
          prefix.push(sum);
        }
        let low = 0, high = prefix.length - 1;
        while (low < high) {
          const mid = Math.floor((low + high) / 2);
          if (target < prefix[mid]) {
            high = mid;
          } else {
            low = mid + 1;
          }
        }
        return low;
      },
      testCases: {
        functional: [
          [[1, 3], 0],
          [[1, 3], 1],
          [[1, 3], 2],
          [[3, 14, 1, 7], 18]
        ],
        boundary: [
          [[10], 0],
          [[10], 9],
          [[1, 1, 1], 0]
        ],
        adversarial: [
          [[5, 1, 1, 1, 5], 6],
          [[10, 100, 1000], 50],
          [[100, 10, 1], 105]
        ],
        stress: [
          [Array.from({ length: 80 }, () => 10), 350],
          [Array.from({ length: 100 }, (_, i) => i + 1), 2000]
        ]
      }
    }),

    // 457. Random Pick Index
    createProblem({
      num: 457,
      title: "Random Pick Index",
      slug: "random-pick-index",
      level: 22,
      difficulty: "MEDIUM",
      topic: "Array / Hash Table",
      patternSlug: "advanced-binary-search-trie",
      estimatedTimeMin: 15,
      statement: "Given an integer array `nums` with possible duplicates and a `target` number, return all 0-based indices where `nums[i] == target`, in ascending order.\n\nThis deterministic formulation inspects the exact index distribution used by reservoir sampling algorithms.",
      functionName: "pickIndices",
      parameters: [
        { name: "nums", type: "number[]", description: "Array of integers" },
        { name: "target", type: "number", description: "Target value to locate" }
      ],
      returnType: "number[]",
      constraints: ["1 <= nums.length <= 2 * 10^4", "-2^31 <= nums[i] <= 2^31 - 1", "target is guaranteed to exist in nums"],
      examples: [
        { input: "nums = [1,2,3,3,3], target = 3", output: "[2,3,4]", explanation: "Indices 2, 3, and 4 all contain value 3." },
        { input: "nums = [1,2,3,3,3], target = 1", output: "[0]", explanation: "Index 0 contains value 1." },
        { input: "nums = [5,5,5,5,5], target = 5", output: "[0,1,2,3,4]", explanation: "All indices contain 5." }
      ],
      optimalSolution: `function pickIndices(nums, target) {\n  const res = [];\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] === target) res.push(i);\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(K) where K is occurrences of target",
      suboptimalSolution: `function pickIndices(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    if (!map.has(nums[i])) map.set(nums[i], []);\n    map.get(nums[i]).push(i);\n  }\n  return map.get(target) || [];\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Returning 1-based indices instead of 0-based indices.",
        "Not preserving ascending order."
      ],
      hints: [
        "Iterate through the array and collect each index where nums[i] equals target.",
        "In online/streaming scenarios, Reservoir Sampling can pick an index in O(1) space with 1/count probability."
      ],
      oracleFn: (nums: number[], target: number) => {
        const res: number[] = [];
        for (let i = 0; i < nums.length; i++) {
          if (nums[i] === target) res.push(i);
        }
        return res;
      },
      testCases: {
        functional: [
          [[1, 2, 3, 3, 3], 3],
          [[1, 2, 3, 3, 3], 1],
          [[5, 5, 5, 5, 5], 5],
          [[4, 2, 8, 2, 1, 2], 2]
        ],
        boundary: [
          [[1], 1],
          [[1, 2], 2],
          [[2, 1], 2]
        ],
        adversarial: [
          [[-1, -1, 0, 1, 1], -1],
          [[10, 20, 30, 40, 50], 30],
          [[7, 7, 8, 7, 8, 7], 8]
        ],
        stress: [
          [Array.from({ length: 80 }, (_, i) => i % 5), 3],
          [Array.from({ length: 100 }, (_, i) => (i % 2 === 0 ? 99 : 0)), 99]
        ]
      }
    }),

    // 458. Snapshot Array (DESIGN)
    createProblem({
      num: 458,
      title: "Snapshot Array",
      slug: "snapshot-array",
      level: 22,
      difficulty: "MEDIUM",
      topic: "Design / Binary Search",
      patternSlug: "advanced-binary-search-trie",
      estimatedTimeMin: 30,
      statement: "Implement a `SnapshotArray` that supports the following interface:\n- `SnapshotArray(int length)` initializes an array-like data structure with the given length. Initially, each element equals 0.\n- `void set(index, val)` sets the element at the given `index` to be equal to `val`.\n- `int snap()` takes a snapshot of the array and returns the `snap_id`: the total number of times we called `snap()` minus 1.\n- `int get(index, snap_id)` returns the value at the given `index`, at the time we took the snapshot with the given `snap_id`.",
      executionModel: "DESIGN",
      functionName: "SnapshotArray",
      parameters: [
        { name: "commands", type: "string[]", description: "Array of operations: ['SnapshotArray', 'set', 'snap', 'get']" },
        { name: "args", type: "any[]", description: "Arguments for each operation" }
      ],
      returnType: "any[]",
      starterTemplates: {
        javascript: `class SnapshotArray {\n  /**\n   * @param {number} length\n   */\n  constructor(length) {\n    // Initialize data structure\n  }\n  /**\n   * @param {number} index\n   * @param {number} val\n   * @return {void}\n   */\n  set(index, val) {}\n  /**\n   * @return {number}\n   */\n  snap() {}\n  /**\n   * @param {number} index\n   * @param {number} snap_id\n   * @return {number}\n   */\n  get(index, snap_id) {}\n}\n`,
        typescript: `class SnapshotArray {\n  constructor(length: number) {}\n  set(index: number, val: number): void {}\n  snap(): number { throw new Error("Not implemented"); }\n  get(index: number, snap_id: number): number { throw new Error("Not implemented"); }\n}\n`,
        python: `class SnapshotArray:\n    def __init__(self, length: int):\n        pass\n    def set(self, index: int, val: int) -> None:\n        pass\n    def snap(self) -> int:\n        pass\n    def get(self, index: int, snap_id: int) -> int:\n        pass\n`
      },
      constraints: ["1 <= length <= 50000", "0 <= index < length", "0 <= val <= 10^9", "0 <= snap_id < (number of times we called snap())", "At most 50000 calls will be made to set, snap, and get"],
      examples: [
        {
          input: 'commands = ["SnapshotArray","set","snap","set","get"]\nargs = [[3],[0,5],[],[0,6],[0,0]]',
          output: '[null,null,0,null,5]',
          explanation: "SnapshotArray snapshotArr = new SnapshotArray(3);\nsnapshotArr.set(0, 5);\nsnapshotArr.snap(); // returns 0\nsnapshotArr.set(0, 6);\nsnapshotArr.get(0, 0); // returns 5"
        },
        {
          input: 'commands = ["SnapshotArray","snap","get"]\nargs = [[1],[],[0,0]]',
          output: '[null,0,0]',
          explanation: "Initially all elements are 0."
        }
      ],
      optimalSolution: `class SnapshotArray {\n  constructor(length) {\n    this.snapId = 0;\n    this.history = Array.from({ length }, () => [[0, 0]]);\n  }\n  set(index, val) {\n    const snaps = this.history[index];\n    if (snaps[snaps.length - 1][0] === this.snapId) {\n      snaps[snaps.length - 1][1] = val;\n    } else {\n      snaps.push([this.snapId, val]);\n    }\n  }\n  snap() {\n    return this.snapId++;\n  }\n  get(index, snap_id) {\n    const snaps = this.history[index];\n    let l = 0, r = snaps.length - 1;\n    let ans = 0;\n    while (l <= r) {\n      const mid = (l + r) >> 1;\n      if (snaps[mid][0] <= snap_id) {\n        ans = snaps[mid][1];\n        l = mid + 1;\n      } else {\n        r = mid - 1;\n      }\n    }\n    return ans;\n  }\n}`,
      optimalTimeComplexity: "O(1) for set and snap, O(log S) for get where S is number of snaps at index",
      optimalSpaceComplexity: "O(length + number of set calls)",
      suboptimalSolution: `class SnapshotArray {\n  constructor(length) {\n    this.cur = new Array(length).fill(0);\n    this.snapshots = [];\n  }\n  set(index, val) {\n    this.cur[index] = val;\n  }\n  snap() {\n    this.snapshots.push([...this.cur]);\n    return this.snapshots.length - 1;\n  }\n  get(index, snap_id) {\n    return this.snapshots[snap_id][index];\n  }\n}`,
      suboptimalTimeComplexity: "O(length) per snap causing Memory Limit Exceeded",
      suboptimalSpaceComplexity: "O(length * snaps)",
      commonMistakes: [
        "Cloning the entire array on every snap() call, which will cause Out Of Memory.",
        "Overwriting previous snap records instead of appending or updating only within current snapId."
      ],
      hints: [
        "Instead of copying the whole array on snap(), only record the changes for each index.",
        "For each index, maintain an array of (snap_id, val) pairs.",
        "In get(index, snap_id), binary search for the latest entry with snap_id <= requested snap_id."
      ],
      oracleFn: (commands: string[], args: any[]) => {
        class RefSnapshotArray {
          snapId = 0;
          history: [number, number][][];
          constructor(length: number) {
            this.history = Array.from({ length }, () => [[0, 0]]);
          }
          set(index: number, val: number) {
            const snaps = this.history[index];
            if (snaps[snaps.length - 1][0] === this.snapId) {
              snaps[snaps.length - 1][1] = val;
            } else {
              snaps.push([this.snapId, val]);
            }
          }
          snap(): number {
            return this.snapId++;
          }
          get(index: number, snap_id: number): number {
            const snaps = this.history[index];
            let l = 0, r = snaps.length - 1;
            let ans = 0;
            while (l <= r) {
              const mid = (l + r) >> 1;
              if (snaps[mid][0] <= snap_id) {
                ans = snaps[mid][1];
                l = mid + 1;
              } else {
                r = mid - 1;
              }
            }
            return ans;
          }
        }
        let sa: RefSnapshotArray | null = null;
        const res: any[] = [];
        for (let i = 0; i < commands.length; i++) {
          const cmd = commands[i];
          if (cmd === 'SnapshotArray') {
            sa = new RefSnapshotArray(args[i][0]);
            res.push(null);
          } else if (cmd === 'set') {
            sa!.set(args[i][0], args[i][1]);
            res.push(null);
          } else if (cmd === 'snap') {
            res.push(sa!.snap());
          } else if (cmd === 'get') {
            res.push(sa!.get(args[i][0], args[i][1]));
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [
            ["SnapshotArray", "set", "snap", "set", "get"],
            [[3], [0, 5], [], [0, 6], [0, 0]]
          ],
          [
            ["SnapshotArray", "snap", "get"],
            [[1], [], [0, 0]]
          ],
          [
            ["SnapshotArray", "set", "snap", "set", "snap", "get", "get"],
            [[2], [1, 10], [], [1, 20], [], [1, 0], [1, 1]]
          ],
          [
            ["SnapshotArray", "set", "set", "snap", "get", "get"],
            [[3], [0, 1], [2, 9], [], [0, 0], [2, 0]]
          ]
        ],
        boundary: [
          [
            ["SnapshotArray", "set", "set", "snap", "get"],
            [[1], [0, 3], [0, 7], [], [0, 0]]
          ],
          [
            ["SnapshotArray", "snap", "snap", "get"],
            [[2], [], [], [1, 1]]
          ],
          [
            ["SnapshotArray", "set", "snap", "get"],
            [[1], [0, 100], [], [0, 0]]
          ]
        ],
        adversarial: [
          [
            ["SnapshotArray", "snap", "snap", "snap", "get", "get"],
            [[5], [], [], [], [2, 0], [2, 2]]
          ],
          [
            ["SnapshotArray", "set", "snap", "set", "snap", "get", "get"],
            [[4], [0, 10], [], [0, 20], [], [0, 0], [0, 1]]
          ]
        ],
        stress: [
          [
            ["SnapshotArray", ...Array.from({ length: 20 }, () => "snap"), ...Array.from({ length: 20 }, (_, i) => "get")],
            [[10], ...Array.from({ length: 20 }, () => []), ...Array.from({ length: 20 }, (_, i) => [0, i])]
          ],
          [
            ["SnapshotArray", ...Array.from({ length: 15 }, (_, i) => "set"), ...Array.from({ length: 15 }, () => "snap"), ...Array.from({ length: 15 }, (_, i) => "get")],
            [[5], ...Array.from({ length: 15 }, (_, i) => [i % 5, i * 10]), ...Array.from({ length: 15 }, () => []), ...Array.from({ length: 15 }, (_, i) => [i % 5, i])]
          ]
        ]
      }
    }),

    // 459. Implement Trie (Prefix Tree) (DESIGN)
    createProblem({
      num: 459,
      title: "Implement Trie (Prefix Tree)",
      slug: "implement-trie-prefix-tree",
      level: 22,
      difficulty: "MEDIUM",
      topic: "Trie / Design",
      patternSlug: "advanced-binary-search-trie",
      estimatedTimeMin: 25,
      statement: "A trie (pronounced as 'try') or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. There are various applications of this data structure, such as autocomplete and spellchecker.\n\nImplement the `Trie` class:\n- `Trie()` Initializes the trie object.\n- `void insert(String word)` Inserts the string `word` into the trie.\n- `boolean search(String word)` Returns `true` if the string `word` is in the trie (i.e., was inserted before), and `false` otherwise.\n- `boolean startsWith(String prefix)` Returns `true` if there is a previously inserted string `word` that has the prefix `prefix`, and `false` otherwise.",
      executionModel: "DESIGN",
      functionName: "Trie",
      parameters: [
        { name: "commands", type: "string[]", description: "Array of operations: ['Trie', 'insert', 'search', 'startsWith']" },
        { name: "args", type: "any[]", description: "Arguments for each operation" }
      ],
      returnType: "any[]",
      starterTemplates: {
        javascript: `class Trie {\n  constructor() {\n    // Initialize data structure\n  }\n  /**\n   * @param {string} word\n   * @return {void}\n   */\n  insert(word) {}\n  /**\n   * @param {string} word\n   * @return {boolean}\n   */\n  search(word) {}\n  /**\n   * @param {string} prefix\n   * @return {boolean}\n   */\n  startsWith(prefix) {}\n}\n`,
        typescript: `class Trie {\n  constructor() {}\n  insert(word: string): void {}\n  search(word: string): boolean { throw new Error("Not implemented"); }\n  startsWith(prefix: string): boolean { throw new Error("Not implemented"); }\n}\n`,
        python: `class Trie:\n    def __init__(self):\n        pass\n    def insert(self, word: str) -> None:\n        pass\n    def search(self, word: str) -> bool:\n        pass\n    def startsWith(self, prefix: str) -> bool:\n        pass\n`
      },
      constraints: ["1 <= word.length, prefix.length <= 2000", "word and prefix consist only of lowercase English letters", "At most 3 * 10^4 calls in total will be made to insert, search, and startsWith"],
      examples: [
        {
          input: 'commands = ["Trie","insert","search","search","startsWith","insert","search"]\nargs = [[],["apple"],["apple"],["app"],["app"],["app"],["app"]]',
          output: '[null,null,true,false,true,null,true]',
          explanation: "Trie trie = new Trie();\ntrie.insert('apple');\ntrie.search('apple');   // return true\ntrie.search('app');     // return false\ntrie.startsWith('app'); // return true\ntrie.insert('app');\ntrie.search('app');     // return true"
        }
      ],
      optimalSolution: `class TrieNode {\n  constructor() {\n    this.children = {};\n    this.isEnd = false;\n  }\n}\nclass Trie {\n  constructor() {\n    this.root = new TrieNode();\n  }\n  insert(word) {\n    let node = this.root;\n    for (const ch of word) {\n      if (!node.children[ch]) node.children[ch] = new TrieNode();\n      node = node.children[ch];\n    }\n    node.isEnd = true;\n  }\n  search(word) {\n    let node = this.root;\n    for (const ch of word) {\n      if (!node.children[ch]) return false;\n      node = node.children[ch];\n    }\n    return !!node.isEnd;\n  }\n  startsWith(prefix) {\n    let node = this.root;\n    for (const ch of prefix) {\n      if (!node.children[ch]) return false;\n      node = node.children[ch];\n    }\n    return true;\n  }\n}`,
      optimalTimeComplexity: "O(L) for insert, search, startsWith where L is word length",
      optimalSpaceComplexity: "O(Total characters inserted)",
      suboptimalSolution: `class Trie {\n  constructor() {\n    this.words = new Set();\n  }\n  insert(word) {\n    this.words.add(word);\n  }\n  search(word) {\n    return this.words.has(word);\n  }\n  startsWith(prefix) {\n    for (const w of this.words) {\n      if (w.startsWith(prefix)) return true;\n    }\n    return false;\n  }\n}`,
      suboptimalTimeComplexity: "O(N * L) for startsWith where N is number of words",
      suboptimalSpaceComplexity: "O(N * L)",
      commonMistakes: [
        "Confusing search(word) (must have isEnd = true) with startsWith(prefix) (only needs valid path).",
        "Using array indexing without converting char codes properly."
      ],
      hints: [
        "Each TrieNode can store child nodes indexed by character or an object/map, plus a boolean isEnd flag.",
        "Traverse character by character: create new node if missing on insert; return false if missing on search/startsWith."
      ],
      oracleFn: (commands: string[], args: any[]) => {
        class RefTrieNode {
          children: Record<string, RefTrieNode> = {};
          isEnd = false;
        }
        class RefTrie {
          root = new RefTrieNode();
          insert(word: string) {
            let node = this.root;
            for (const ch of word) {
              if (!node.children[ch]) node.children[ch] = new RefTrieNode();
              node = node.children[ch];
            }
            node.isEnd = true;
          }
          search(word: string): boolean {
            let node = this.root;
            for (const ch of word) {
              if (!node.children[ch]) return false;
              node = node.children[ch];
            }
            return node.isEnd;
          }
          startsWith(prefix: string): boolean {
            let node = this.root;
            for (const ch of prefix) {
              if (!node.children[ch]) return false;
              node = node.children[ch];
            }
            return true;
          }
        }
        let t: RefTrie | null = null;
        const res: any[] = [];
        for (let i = 0; i < commands.length; i++) {
          const cmd = commands[i];
          if (cmd === 'Trie') {
            t = new RefTrie();
            res.push(null);
          } else if (cmd === 'insert') {
            t!.insert(args[i][0]);
            res.push(null);
          } else if (cmd === 'search') {
            res.push(t!.search(args[i][0]));
          } else if (cmd === 'startsWith') {
            res.push(t!.startsWith(args[i][0]));
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [
            ["Trie", "insert", "search", "search", "startsWith", "insert", "search"],
            [[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]
          ],
          [
            ["Trie", "insert", "search", "startsWith"],
            [[], ["banana"], ["ban"], ["ban"]]
          ],
          [
            ["Trie", "insert", "insert", "search", "search"],
            [[], ["hot"], ["hotel"], ["hot"], ["hotel"]]
          ],
          [
            ["Trie", "insert", "startsWith", "search"],
            [[], ["programmer"], ["pro"], ["prog"]]
          ]
        ],
        boundary: [
          [
            ["Trie", "search", "startsWith"],
            [[], ["a"], ["a"]]
          ],
          [
            ["Trie", "insert", "search"],
            [[], ["z"], ["z"]]
          ],
          [
            ["Trie", "insert", "startsWith"],
            [[], ["a"], ["a"]]
          ]
        ],
        adversarial: [
          [
            ["Trie", "insert", "insert", "search", "startsWith", "search"],
            [[], ["car"], ["card"], ["car"], ["care"], ["card"]]
          ],
          [
            ["Trie", "insert", "search", "startsWith"],
            [[], ["abc"], ["ab"], ["abcde"]]
          ]
        ],
        stress: [
          [
            ["Trie", ...Array.from({ length: 30 }, (_, i) => "insert"), ...Array.from({ length: 30 }, (_, i) => "search")],
            [[], ...Array.from({ length: 30 }, (_, i) => [`prefix${i}`]), ...Array.from({ length: 30 }, (_, i) => [`prefix${i}`])]
          ],
          [
            ["Trie", ...Array.from({ length: 40 }, (_, i) => "insert"), ...Array.from({ length: 40 }, (_, i) => "startsWith")],
            [[], ...Array.from({ length: 40 }, (_, i) => [`word${i}`]), ...Array.from({ length: 40 }, () => ["wor"])]
          ]
        ]
      }
    }),

    // 460. Implement Trie II (Prefix Tree) (DESIGN)
    createProblem({
      num: 460,
      title: "Implement Trie II (Prefix Tree)",
      slug: "implement-trie-ii-prefix-tree",
      level: 22,
      difficulty: "MEDIUM",
      topic: "Trie / Design",
      patternSlug: "advanced-binary-search-trie",
      estimatedTimeMin: 25,
      statement: "A trie (pronounced as 'try') or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings.\n\nImplement the `Trie` class:\n- `Trie()` Initializes the trie object.\n- `void insert(String word)` Inserts the string `word` into the trie.\n- `int countWordsEqualTo(String word)` Returns the number of instances of the string `word` in the trie.\n- `int countWordsStartingWith(String prefix)` Returns the number of strings in the trie that have the string `prefix` as a prefix.\n- `void erase(String word)` Erases one instance of the string `word` from the trie. (It is guaranteed that `word` exists in the trie).",
      executionModel: "DESIGN",
      functionName: "Trie",
      parameters: [
        { name: "commands", type: "string[]", description: "Array of operations: ['Trie', 'insert', 'countWordsEqualTo', 'countWordsStartingWith', 'erase']" },
        { name: "args", type: "any[]", description: "Arguments for each operation" }
      ],
      returnType: "any[]",
      starterTemplates: {
        javascript: `class Trie {\n  constructor() {\n    // Initialize data structures\n  }\n  /**\n   * @param {string} word\n   * @return {void}\n   */\n  insert(word) {}\n  /**\n   * @param {string} word\n   * @return {number}\n   */\n  countWordsEqualTo(word) {}\n  /**\n   * @param {string} prefix\n   * @return {number}\n   */\n  countWordsStartingWith(prefix) {}\n  /**\n   * @param {string} word\n   * @return {void}\n   */\n  erase(word) {}\n}\n`,
        typescript: `class Trie {\n  constructor() {}\n  insert(word: string): void {}\n  countWordsEqualTo(word: string): number { throw new Error("Not implemented"); }\n  countWordsStartingWith(prefix: string): number { throw new Error("Not implemented"); }\n  erase(word: string): void {}\n}\n`,
        python: `class Trie:\n    def __init__(self):\n        pass\n    def insert(self, word: str) -> None:\n        pass\n    def countWordsEqualTo(self, word: str) -> int:\n        pass\n    def countWordsStartingWith(self, prefix: str) -> int:\n        pass\n    def erase(self, word: str) -> None:\n        pass\n`
      },
      constraints: ["1 <= word.length, prefix.length <= 2000", "word and prefix consist only of lowercase English letters", "At most 3 * 10^4 calls in total to insert, countWordsEqualTo, countWordsStartingWith, erase", "word is guaranteed to exist when erase is called"],
      examples: [
        {
          input: 'commands = ["Trie","insert","insert","countWordsEqualTo","countWordsStartingWith","erase","countWordsEqualTo","countWordsStartingWith","erase","countWordsStartingWith"]\nargs = [[],["apple"],["apple"],["apple"],["app"],["apple"],["apple"],["app"],["apple"],["app"]]',
          output: '[null,null,null,2,2,null,1,1,null,0]',
          explanation: "Two 'apple' inserted -> countWordsEqualTo('apple') = 2, countWordsStartingWith('app') = 2. Erasing one leaves 1. Erasing the other leaves 0."
        }
      ],
      optimalSolution: `class TrieNodeII {\n  constructor() {\n    this.children = {};\n    this.countEnd = 0;\n    this.countPrefix = 0;\n  }\n}\nclass Trie {\n  constructor() {\n    this.root = new TrieNodeII();\n  }\n  insert(word) {\n    let node = this.root;\n    for (const ch of word) {\n      if (!node.children[ch]) node.children[ch] = new TrieNodeII();\n      node = node.children[ch];\n      node.countPrefix++;\n    }\n    node.countEnd++;\n  }\n  countWordsEqualTo(word) {\n    let node = this.root;\n    for (const ch of word) {\n      if (!node.children[ch]) return 0;\n      node = node.children[ch];\n    }\n    return node.countEnd;\n  }\n  countWordsStartingWith(prefix) {\n    let node = this.root;\n    for (const ch of prefix) {\n      if (!node.children[ch]) return 0;\n      node = node.children[ch];\n    }\n    return node.countPrefix;\n  }\n  erase(word) {\n    let node = this.root;\n    for (const ch of word) {\n      const nextNode = node.children[ch];\n      nextNode.countPrefix--;\n      node = nextNode;\n    }\n    node.countEnd--;\n  }\n}`,
      optimalTimeComplexity: "O(L) for each operation where L is string length",
      optimalSpaceComplexity: "O(Total characters inserted)",
      suboptimalSolution: `class Trie {\n  constructor() {\n    this.list = [];\n  }\n  insert(word) {\n    this.list.push(word);\n  }\n  countWordsEqualTo(word) {\n    return this.list.filter(w => w === word).length;\n  }\n  countWordsStartingWith(prefix) {\n    return this.list.filter(w => w.startsWith(prefix)).length;\n  }\n  erase(word) {\n    const idx = this.list.indexOf(word);\n    if (idx !== -1) this.list.splice(idx, 1);\n  }\n}`,
      suboptimalTimeComplexity: "O(N * L) for each count/erase call",
      suboptimalSpaceComplexity: "O(N * L)",
      commonMistakes: [
        "Decrementing countPrefix on the root node instead of only traversing child nodes.",
        "Not properly updating countEnd when duplicate words are inserted."
      ],
      hints: [
        "Maintain two integer counters on every TrieNode: `countEnd` (words ending here) and `countPrefix` (words passing through here).",
        "When inserting, increment countPrefix on each visited child node and countEnd on the final node.",
        "When erasing, decrement countPrefix along the path and countEnd on the final node."
      ],
      oracleFn: (commands: string[], args: any[]) => {
        class RefTrieNodeII {
          children: Record<string, RefTrieNodeII> = {};
          countEnd = 0;
          countPrefix = 0;
        }
        class RefTrieII {
          root = new RefTrieNodeII();
          insert(word: string) {
            let node = this.root;
            for (const ch of word) {
              if (!node.children[ch]) node.children[ch] = new RefTrieNodeII();
              node = node.children[ch];
              node.countPrefix++;
            }
            node.countEnd++;
          }
          countWordsEqualTo(word: string): number {
            let node = this.root;
            for (const ch of word) {
              if (!node.children[ch]) return 0;
              node = node.children[ch];
            }
            return node.countEnd;
          }
          countWordsStartingWith(prefix: string): number {
            let node = this.root;
            for (const ch of prefix) {
              if (!node.children[ch]) return 0;
              node = node.children[ch];
            }
            return node.countPrefix;
          }
          erase(word: string) {
            let node = this.root;
            for (const ch of word) {
              const nextNode = node.children[ch];
              nextNode.countPrefix--;
              node = nextNode;
            }
            node.countEnd--;
          }
        }
        let t: RefTrieII | null = null;
        const res: any[] = [];
        for (let i = 0; i < commands.length; i++) {
          const cmd = commands[i];
          if (cmd === 'Trie') {
            t = new RefTrieII();
            res.push(null);
          } else if (cmd === 'insert') {
            t!.insert(args[i][0]);
            res.push(null);
          } else if (cmd === 'countWordsEqualTo') {
            res.push(t!.countWordsEqualTo(args[i][0]));
          } else if (cmd === 'countWordsStartingWith') {
            res.push(t!.countWordsStartingWith(args[i][0]));
          } else if (cmd === 'erase') {
            t!.erase(args[i][0]);
            res.push(null);
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [
            ["Trie", "insert", "insert", "countWordsEqualTo", "countWordsStartingWith", "erase", "countWordsEqualTo", "countWordsStartingWith", "erase", "countWordsStartingWith"],
            [[], ["apple"], ["apple"], ["apple"], ["app"], ["apple"], ["apple"], ["app"], ["apple"], ["app"]]
          ],
          [
            ["Trie", "insert", "countWordsStartingWith", "countWordsEqualTo"],
            [[], ["code"], ["c"], ["code"]]
          ],
          [
            ["Trie", "insert", "insert", "countWordsStartingWith"],
            [[], ["cat"], ["car"], ["ca"]]
          ],
          [
            ["Trie", "insert", "erase", "countWordsEqualTo"],
            [[], ["item"], ["item"], ["item"]]
          ]
        ],
        boundary: [
          [
            ["Trie", "countWordsEqualTo", "countWordsStartingWith"],
            [[], ["ghost"], ["gh"]]
          ],
          [
            ["Trie", "insert", "countWordsEqualTo"],
            [[], ["a"], ["a"]]
          ],
          [
            ["Trie", "insert", "erase", "countWordsStartingWith"],
            [[], ["z"], ["z"], ["z"]]
          ]
        ],
        adversarial: [
          [
            ["Trie", "insert", "insert", "insert", "erase", "countWordsEqualTo", "countWordsStartingWith"],
            [[], ["cat"], ["car"], ["card"], ["car"], ["car"], ["ca"]]
          ],
          [
            ["Trie", "insert", "insert", "erase", "countWordsEqualTo"],
            [[], ["hello"], ["hello"], ["hello"], ["hello"]]
          ]
        ],
        stress: [
          [
            ["Trie", ...Array.from({ length: 25 }, () => "insert"), ...Array.from({ length: 25 }, () => "countWordsStartingWith")],
            [[], ...Array.from({ length: 25 }, (_, i) => [`prefix${i % 5}`]), ...Array.from({ length: 25 }, (_, i) => [`prefix${i % 5}`])]
          ],
          [
            ["Trie", ...Array.from({ length: 30 }, (_, i) => "insert"), ...Array.from({ length: 15 }, (_, i) => "erase"), ...Array.from({ length: 15 }, (_, i) => "countWordsEqualTo")],
            [[], ...Array.from({ length: 30 }, (_, i) => [`w${i % 10}`]), ...Array.from({ length: 15 }, (_, i) => [`w${i % 10}`]), ...Array.from({ length: 15 }, (_, i) => [`w${i % 10}`])]
          ]
        ]
      }
    }),

    // 461. Replace Words
    createProblem({
      num: 461,
      title: "Replace Words",
      slug: "replace-words",
      level: 22,
      difficulty: "MEDIUM",
      topic: "Trie / Hash Table",
      patternSlug: "advanced-binary-search-trie",
      estimatedTimeMin: 20,
      statement: "In English, we have what we call a root. If a word is formed by a root followed by other letters, we say the word has that root. For example, when the root `\"an\"` is followed by `\"other\"`, the word becomes `\"another\"`.\n\nGiven a `dictionary` consisting of many roots and a `sentence` consisting of words separated by spaces, replace all the words in the sentence with the shortest root that forms them. If a word cannot be replaced by a root, leave it as is.\n\nReturn the `sentence` after the replacement.",
      functionName: "replaceWords",
      parameters: [
        { name: "dictionary", type: "string[]", description: "List of root strings" },
        { name: "sentence", type: "string", description: "Input sentence separated by single spaces" }
      ],
      returnType: "string",
      constraints: ["1 <= dictionary.length <= 1000", "1 <= dictionary[i].length <= 100", "dictionary[i] consists of only lower-case letters", "1 <= sentence.length <= 10^6", "sentence consists of lowercase letters and spaces"],
      examples: [
        { input: "dictionary = [\"cat\",\"bat\",\"rat\"], sentence = \"the cattle was rattled by the battery\"", output: "\"the cat was rat by the bat\"", explanation: "cattle -> cat, rattled -> rat, battery -> bat." },
        { input: "dictionary = [\"a\",\"b\",\"c\"], sentence = \"aadsfasf absbs bbab cadsfafs\"", output: "\"a a b c\"", explanation: "Replaced with single character roots." },
        { input: "dictionary = [\"catt\",\"cat\"], sentence = \"cattle\"", output: "\"cat\"", explanation: "Shortest root 'cat' is preferred over 'catt'." }
      ],
      optimalSolution: `function replaceWords(dictionary, sentence) {\n  const root = {};\n  for (const dictWord of dictionary) {\n    let node = root;\n    for (const ch of dictWord) {\n      if (!node[ch]) node[ch] = {};\n      node = node[ch];\n    }\n    node['#'] = dictWord;\n  }\n  const words = sentence.split(' ');\n  for (let i = 0; i < words.length; i++) {\n    let node = root;\n    for (const ch of words[i]) {\n      if (!node[ch] || node['#']) break;\n      node = node[ch];\n    }\n    if (node['#']) words[i] = node['#'];\n  }\n  return words.join(' ');\n}`,
      optimalTimeComplexity: "O(D * L + S) where D is dictionary size, S is sentence length",
      optimalSpaceComplexity: "O(D * L)",
      suboptimalSolution: `function replaceWords(dictionary, sentence) {\n  dictionary.sort((a, b) => a.length - b.length);\n  const words = sentence.split(' ');\n  for (let i = 0; i < words.length; i++) {\n    for (const root of dictionary) {\n      if (words[i].startsWith(root)) {\n        words[i] = root;\n        break;\n      }\n    }\n  }\n  return words.join(' ');\n}`,
      suboptimalTimeComplexity: "O(W * D * L) where W is words in sentence",
      suboptimalSpaceComplexity: "O(D * L)",
      commonMistakes: [
        "Not picking the shortest root if multiple roots match (e.g., 'cat' vs 'catt').",
        "Rebuilding strings repeatedly instead of replacing in array."
      ],
      hints: [
        "Insert all roots into a Trie. Store the root word at the end marker node.",
        "For each word in the sentence, traverse down the Trie until hitting the end marker '#' (shortest root) or a missing branch.",
        "If an end marker is reached, replace the word with the root."
      ],
      oracleFn: (dictionary: string[], sentence: string) => {
        const root: any = {};
        for (const dictWord of dictionary) {
          let node = root;
          for (const ch of dictWord) {
            if (!node[ch]) node[ch] = {};
            node = node[ch];
          }
          if (!node['#']) node['#'] = dictWord;
        }
        const words = sentence.split(' ');
        for (let i = 0; i < words.length; i++) {
          let node = root;
          for (const ch of words[i]) {
            if (!node[ch] || node['#']) break;
            node = node[ch];
          }
          if (node['#']) words[i] = node['#'];
        }
        return words.join(' ');
      },
      testCases: {
        functional: [
          [["cat", "bat", "rat"], "the cattle was rattled by the battery"],
          [["a", "b", "c"], "aadsfasf absbs bbab cadsfafs"],
          [["catt", "cat"], "cattle"],
          [["quick"], "the quick brown fox"]
        ],
        boundary: [
          [["root"], "root"],
          [["non"], "match"],
          [["a"], "a b c"]
        ],
        adversarial: [
          [["short", "shorter", "shortest"], "shortest sentence ever"],
          [["x", "xx", "xxx"], "xxxx x xx"]
        ],
        stress: [
          [Array.from({ length: 50 }, (_, i) => `w${i}`), Array.from({ length: 50 }, (_, i) => `w${i}xyz`).join(' ')],
          [["prefix"], Array.from({ length: 80 }, () => "prefixword").join(' ')]
        ]
      }
    }),

    // 462. Search Suggestions System
    createProblem({
      num: 462,
      title: "Search Suggestions System",
      slug: "search-suggestions-system",
      level: 22,
      difficulty: "MEDIUM",
      topic: "Trie / Binary Search / Two Pointers",
      patternSlug: "advanced-binary-search-trie",
      estimatedTimeMin: 25,
      statement: "You are given an array of strings `products` and a string `searchWord`. We want to design a system that suggests at most three product names from `products` after each character of `searchWord` is typed. Suggested products should have common prefix with `searchWord`. If there are more than three products with a common prefix, return the three lexicographically minimum products.\n\nReturn a list of lists of the suggested products after each character of `searchWord` is typed.",
      functionName: "suggestedProducts",
      parameters: [
        { name: "products", type: "string[]", description: "Array of product names" },
        { name: "searchWord", type: "string", description: "Search query being typed" }
      ],
      returnType: "string[][]",
      constraints: ["1 <= products.length <= 1000", "1 <= products[i].length <= 20000", "1 <= searchWord.length <= 1000", "All characters of products[i] and searchWord are lowercase English letters."],
      examples: [
        { input: "products = [\"mobile\",\"mouse\",\"moneypot\",\"monitor\",\"mousepad\"], searchWord = \"mouse\"", output: "[[\"mobile\",\"moneypot\",\"monitor\"],[\"mobile\",\"moneypot\",\"monitor\"],[\"mouse\",\"mousepad\"],[\"mouse\",\"mousepad\"],[\"mouse\",\"mousepad\"]]", explanation: "Typing 'm', 'mo', 'mou', 'mous', 'mouse' returns the up to 3 lexicographically smallest matching products." },
        { input: "products = [\"havana\"], searchWord = \"havana\"", output: "[[\"havana\"],[\"havana\"],[\"havana\"],[\"havana\"],[\"havana\"],[\"havana\"]]", explanation: "Single product matches all prefixes." }
      ],
      optimalSolution: `function suggestedProducts(products, searchWord) {\n  products.sort();\n  const res = [];\n  let left = 0, right = products.length - 1;\n  for (let i = 0; i < searchWord.length; i++) {\n    const ch = searchWord[i];\n    while (left <= right && (products[left].length <= i || products[left][i] !== ch)) left++;\n    while (left <= right && (products[right].length <= i || products[right][i] !== ch)) right--;\n    const suggestions = [];\n    for (let j = left; j <= Math.min(right, left + 2); j++) {\n      suggestions.push(products[j]);\n    }\n    res.push(suggestions);\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(P log P + L * P) or O(P log P + L) with two pointers",
      optimalSpaceComplexity: "O(1) extra space (excluding output)",
      suboptimalSolution: `function suggestedProducts(products, searchWord) {\n  products.sort();\n  const res = [];\n  let prefix = '';\n  for (const ch of searchWord) {\n    prefix += ch;\n    const matched = products.filter(p => p.startsWith(prefix)).slice(0, 3);\n    res.push(matched);\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(L * P * maxLen)",
      suboptimalSpaceComplexity: "O(L * 3)",
      commonMistakes: [
        "Not sorting products lexicographically before filtering.",
        "Filtering the whole array on every character instead of narrowing the window with two pointers or binary search."
      ],
      hints: [
        "Sort the products array lexicographically.",
        "As you type each character of searchWord, maintain two pointers [left, right] delimiting the products that match the current prefix.",
        "Advance `left` and shrink `right` until their i-th character matches searchWord[i].",
        "Take up to 3 elements starting from `left`."
      ],
      oracleFn: (products: string[], searchWord: string) => {
        const sorted = [...products].sort();
        const res: string[][] = [];
        let left = 0, right = sorted.length - 1;
        for (let i = 0; i < searchWord.length; i++) {
          const ch = searchWord[i];
          while (left <= right && (sorted[left].length <= i || sorted[left][i] !== ch)) left++;
          while (left <= right && (sorted[right].length <= i || sorted[right][i] !== ch)) right--;
          const suggestions: string[] = [];
          for (let j = left; j <= Math.min(right, left + 2); j++) {
            suggestions.push(sorted[j]);
          }
          res.push(suggestions);
        }
        return res;
      },
      testCases: {
        functional: [
          [["mobile", "mouse", "moneypot", "monitor", "mousepad"], "mouse"],
          [["havana"], "havana"],
          [["bags", "baggage", "banner", "box", "cloths"], "bags"]
        ],
        boundary: [
          [["a"], "a"],
          [["a"], "b"],
          [["code"], "c"]
        ],
        adversarial: [
          [["alpha", "alpine", "algo", "alps", "altitude"], "alps"],
          [["test", "testing", "tester"], "test"]
        ],
        stress: [
          [Array.from({ length: 50 }, (_, i) => `prod${i.toString().padStart(3, '0')}`), "prod025"],
          [Array.from({ length: 60 }, (_, i) => `item${i}`), "item"]
        ]
      }
    }),

    // 463. Word Search II
    createProblem({
      num: 463,
      title: "Word Search II",
      slug: "word-search-ii",
      level: 22,
      difficulty: "HARD",
      topic: "Trie / Backtracking",
      patternSlug: "advanced-binary-search-trie",
      estimatedTimeMin: 35,
      statement: "Given an `m x n` `board` of characters and a list of strings `words`, return all words on the board.\n\nEach word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.",
      functionName: "findWords",
      parameters: [
        { name: "board", type: "string[][]", description: "2D grid of characters" },
        { name: "words", type: "string[]", description: "List of words to search for" }
      ],
      returnType: "string[]",
      constraints: ["m == board.length", "n == board[i].length", "1 <= m, n <= 12", "board[i][j] is a lowercase English letter", "1 <= words.length <= 3 * 10^4", "1 <= words[i].length <= 10", "words[i] consists of lowercase English letters", "All words[i] are unique"],
      examples: [
        { input: "board = [[\"o\",\"a\",\"a\",\"n\"],[\"e\",\"t\",\"a\",\"e\"],[\"i\",\"h\",\"k\",\"r\"],[\"i\",\"f\",\"l\",\"v\"]], words = [\"oath\",\"pea\",\"eat\",\"rain\"]", output: "[\"eat\",\"oath\"]", explanation: "'eat' and 'oath' can be formed following adjacent cells." },
        { input: "board = [[\"a\",\"b\"],[\"c\",\"d\"]], words = [\"abcb\"]", output: "[]", explanation: "The letter 'b' cannot be reused." }
      ],
      optimalSolution: `function findWords(board, words) {\n  const root = {};\n  for (const word of words) {\n    let node = root;\n    for (const ch of word) {\n      if (!node[ch]) node[ch] = {};\n      node = node[ch];\n    }\n    node.word = word;\n  }\n  const m = board.length, n = board[0].length;\n  const res = [];\n  const dfs = (r, c, parent) => {\n    const ch = board[r][c];\n    const curr = parent[ch];\n    if (!curr) return;\n    if (curr.word) {\n      res.push(curr.word);\n      curr.word = null;\n    }\n    board[r][c] = '#';\n    const dirs = [[0,1],[1,0],[0,-1],[-1,0]];\n    for (const [dr, dc] of dirs) {\n      const nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nr < m && nc >= 0 && nc < n && board[nr][nc] !== '#') {\n        dfs(nr, nc, curr);\n      }\n    }\n    board[r][c] = ch;\n  };\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (root[board[r][c]]) dfs(r, c, root);\n    }\n  }\n  return res.sort();\n}`,
      optimalTimeComplexity: "O(M * N * 4^(maxLen))",
      optimalSpaceComplexity: "O(Total characters in words)",
      suboptimalSolution: `function findWords(board, words) {\n  const res = [];\n  for (const word of words) {\n    let found = false;\n    for (let r = 0; r < board.length && !found; r++) {\n      for (let c = 0; c < board[0].length && !found; c++) {\n        const check = (idx, cr, cc) => {\n          if (idx === word.length) return true;\n          if (cr < 0 || cr >= board.length || cc < 0 || cc >= board[0].length || board[cr][cc] !== word[idx]) return false;\n          const tmp = board[cr][cc];\n          board[cr][cc] = '#';\n          const ok = check(idx + 1, cr + 1, cc) || check(idx + 1, cr - 1, cc) || check(idx + 1, cr, cc + 1) || check(idx + 1, cr, cc - 1);\n          board[cr][cc] = tmp;\n          return ok;\n        };\n        if (check(0, r, c)) found = true;\n      }\n    }\n    if (found) res.push(word);\n  }\n  return res.sort();\n}`,
      suboptimalTimeComplexity: "O(W * M * N * 4^L)",
      suboptimalSpaceComplexity: "O(L)",
      commonMistakes: [
        "Running standard DFS for every word independently (Tle on large dictionary).",
        "Not clearing curr.word = null after finding it, leading to duplicates in output.",
        "Not restoring board[r][c] on backtracking."
      ],
      hints: [
        "Build a Trie of all words to allow simultaneous searching for multiple words in a single DFS traversal.",
        "Store the complete word at the leaf node so you can immediately add it to the result.",
        "Clear curr.word = null once found to prevent duplicate matches."
      ],
      oracleFn: (board: string[][], words: string[]) => {
        const root: any = {};
        for (const word of words) {
          let node = root;
          for (const ch of word) {
            if (!node[ch]) node[ch] = {};
            node = node[ch];
          }
          node.word = word;
        }
        const m = board.length, n = board[0].length;
        const res: string[] = [];
        const dfs = (r: number, c: number, parent: any) => {
          const ch = board[r][c];
          const curr = parent[ch];
          if (!curr) return;
          if (curr.word) {
            res.push(curr.word);
            curr.word = null;
          }
          board[r][c] = '#';
          const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
          for (const [dr, dc] of dirs) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < m && nc >= 0 && nc < n && board[nr][nc] !== '#') {
              dfs(nr, nc, curr);
            }
          }
          board[r][c] = ch;
        };
        for (let r = 0; r < m; r++) {
          for (let c = 0; c < n; c++) {
            if (root[board[r][c]]) dfs(r, c, root);
          }
        }
        return res.sort();
      },
      testCases: {
        functional: [
          [
            [["o", "a", "a", "n"], ["e", "t", "a", "e"], ["i", "h", "k", "r"], ["i", "f", "l", "v"]],
            ["oath", "pea", "eat", "rain"]
          ],
          [
            [["a", "b"], ["c", "d"]],
            ["abcb"]
          ],
          [
            [["a", "b"], ["c", "d"]],
            ["ab", "cb", "ad"]
          ],
          [
            [["a", "b"], ["c", "d"]],
            ["a", "b", "c", "d", "ac", "bd"]
          ]
        ],
        boundary: [
          [[["a"]], ["a"]],
          [[["a"]], ["b"]],
          [[["a", "b"]], ["ab", "ba"]],
          [[["x"]], ["x", "y"]]
        ],
        adversarial: [
          [
            [["a", "a"], ["a", "a"]],
            ["aaaa", "aaaaa", "aaa"]
          ],
          [
            [["a", "b", "c"], ["d", "e", "f"]],
            ["fed", "cba", "cf", "ad", "xyz"]
          ]
        ],
        stress: [
          [
            [["a", "b", "c"], ["d", "e", "f"], ["g", "h", "i"]],
            ["abed", "beh", "cfi", "adg", "fed", "xyz"]
          ]
        ]
      }
    }),

    // 464. Longest Common Prefix
    createProblem({
      num: 464,
      title: "Longest Common Prefix",
      slug: "longest-common-prefix",
      level: 22,
      difficulty: "EASY",
      topic: "Strings / Trie",
      patternSlug: "advanced-binary-search-trie",
      estimatedTimeMin: 15,
      statement: "Write a function to find the longest common prefix string amongst an array of strings.\n\nIf there is no common prefix, return an empty string `\"\"`.",
      functionName: "longestCommonPrefix",
      parameters: [
        { name: "strs", type: "string[]", description: "Array of strings" }
      ],
      returnType: "string",
      constraints: ["1 <= strs.length <= 200", "0 <= strs[i].length <= 200", "strs[i] consists of only lowercase English letters."],
      examples: [
        { input: "strs = [\"flower\",\"flow\",\"flight\"]", output: "\"fl\"", explanation: "Common prefix of flower, flow, flight is 'fl'." },
        { input: "strs = [\"dog\",\"racecar\",\"car\"]", output: "\"\"", explanation: "No common prefix exists." },
        { input: "strs = [\"interstellar\",\"interstate\",\"internet\"]", output: "\"inter\"", explanation: "Common prefix is 'inter'." }
      ],
      optimalSolution: `function longestCommonPrefix(strs) {\n  if (!strs || strs.length === 0) return "";\n  let prefix = strs[0];\n  for (let i = 1; i < strs.length; i++) {\n    while (strs[i].indexOf(prefix) !== 0) {\n      prefix = prefix.substring(0, prefix.length - 1);\n      if (prefix === "") return "";\n    }\n  }\n  return prefix;\n}`,
      optimalTimeComplexity: "O(S) where S is sum of characters across all strings",
      optimalSpaceComplexity: "O(1) extra space",
      suboptimalSolution: `function longestCommonPrefix(strs) {\n  if (!strs.length) return "";\n  strs.sort();\n  const first = strs[0], last = strs[strs.length - 1];\n  let i = 0;\n  while (i < first.length && first[i] === last[i]) i++;\n  return first.substring(0, i);\n}`,
      suboptimalTimeComplexity: "O(N * L log N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: [
        "Failing when array has only 1 element (prefix is the string itself).",
        "Failing when one string is empty (prefix must be empty)."
      ],
      hints: [
        "Start with the first word as prefix.",
        "Shorten prefix until each subsequent word starts with it.",
        "Alternatively, compare character by character vertically."
      ],
      oracleFn: (strs: string[]) => {
        if (!strs || strs.length === 0) return "";
        let prefix = strs[0];
        for (let i = 1; i < strs.length; i++) {
          while (strs[i].indexOf(prefix) !== 0) {
            prefix = prefix.substring(0, prefix.length - 1);
            if (prefix === "") return "";
          }
        }
        return prefix;
      },
      testCases: {
        functional: [
          [["flower", "flow", "flight"]],
          [["dog", "racecar", "car"]],
          [["interstellar", "interstate", "internet"]],
          [["throne", "throne"]]
        ],
        boundary: [
          [["single"]],
          [["", "b"]],
          [["a", "a", "a"]]
        ],
        adversarial: [
          [["ab", "a"]],
          [["aa", "ab"]],
          [["cir", "car"]]
        ],
        stress: [
          [Array.from({ length: 60 }, () => "prefixCommonEverywhere")],
          [Array.from({ length: 80 }, (_, i) => `pref${i}`)]
        ]
      }
    }),

    // 465. Add and Search Word - Data structure design (DESIGN)
    createProblem({
      num: 465,
      title: "Add and Search Word - Data structure design",
      slug: "add-and-search-word-data-structure-design",
      level: 22,
      difficulty: "MEDIUM",
      topic: "Trie / Design / Backtracking",
      patternSlug: "advanced-binary-search-trie",
      estimatedTimeMin: 25,
      statement: "Design a data structure that supports adding new words and finding if a string matches any previously added string.\n\nImplement the `WordDictionary` class:\n- `WordDictionary()` Initializes the object.\n- `void addWord(word)` Adds `word` to the data structure, it can be matched later.\n- `bool search(word)` Returns `true` if there is any string in the data structure that matches `word` or `false` otherwise. `word` may contain dots `'.'` where dots can be matched with any letter.",
      executionModel: "DESIGN",
      functionName: "WordDictionary",
      parameters: [
        { name: "commands", type: "string[]", description: "Array of operations: ['WordDictionary', 'addWord', 'search']" },
        { name: "args", type: "any[]", description: "Arguments for each operation" }
      ],
      returnType: "any[]",
      starterTemplates: {
        javascript: `class WordDictionary {\n  constructor() {\n    // Initialize data structure\n  }\n  /**\n   * @param {string} word\n   * @return {void}\n   */\n  addWord(word) {}\n  /**\n   * @param {string} word\n   * @return {boolean}\n   */\n  search(word) {}\n}\n`,
        typescript: `class WordDictionary {\n  constructor() {}\n  addWord(word: string): void {}\n  search(word: string): boolean { throw new Error("Not implemented"); }\n}\n`,
        python: `class WordDictionary:\n    def __init__(self):\n        pass\n    def addWord(self, word: str) -> None:\n        pass\n    def search(self, word: str) -> bool:\n        pass\n`
      },
      constraints: ["1 <= word.length <= 25", "word in addWord consists of lowercase English letters", "word in search consist of '.' or lowercase English letters", "There will be at most 2 dots in word for search queries", "At most 10^4 calls will be made to addWord and search"],
      examples: [
        {
          input: 'commands = ["WordDictionary","addWord","addWord","addWord","search","search","search","search"]\nargs = [[],["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]]',
          output: '[null,null,null,null,false,true,true,true]',
          explanation: "WordDictionary wordDictionary = new WordDictionary();\nwordDictionary.addWord('bad');\nwordDictionary.addWord('dad');\nwordDictionary.addWord('mad');\nwordDictionary.search('pad'); // return False\nwordDictionary.search('bad'); // return True\nwordDictionary.search('.ad'); // return True\nwordDictionary.search('b..'); // return True"
        }
      ],
      optimalSolution: `class WordDictNode {\n  constructor() {\n    this.children = {};\n    this.isEnd = false;\n  }\n}\nclass WordDictionary {\n  constructor() {\n    this.root = new WordDictNode();\n  }\n  addWord(word) {\n    let node = this.root;\n    for (const ch of word) {\n      if (!node.children[ch]) node.children[ch] = new WordDictNode();\n      node = node.children[ch];\n    }\n    node.isEnd = true;\n  }\n  search(word) {\n    const dfs = (idx, node) => {\n      if (!node) return false;\n      if (idx === word.length) return !!node.isEnd;\n      const ch = word[idx];\n      if (ch === '.') {\n        for (const key in node.children) {\n          if (dfs(idx + 1, node.children[key])) return true;\n        }\n        return false;\n      } else {\n        if (!node.children[ch]) return false;\n        return dfs(idx + 1, node.children[ch]);\n      }\n    };\n    return dfs(0, this.root);\n  }\n}`,
      optimalTimeComplexity: "O(L) for addWord; O(26^D * L) where D is number of dots in search",
      optimalSpaceComplexity: "O(Total characters stored in Trie)",
      suboptimalSolution: `class WordDictionary {\n  constructor() {\n    this.words = [];\n  }\n  addWord(word) {\n    this.words.push(word);\n  }\n  search(word) {\n    const reg = new RegExp('^' + word + '$');\n    return this.words.some(w => reg.test(w));\n  }\n}`,
      suboptimalTimeComplexity: "O(N * L) with regex testing",
      suboptimalSpaceComplexity: "O(N * L)",
      commonMistakes: [
        "Returning true on dot wildcard before verifying that the node has reached isEnd when idx == word.length.",
        "Using regular expressions on every search causing high memory overhead and timeouts."
      ],
      hints: [
        "Store words in a standard Trie.",
        "For normal characters, advance to the corresponding child TrieNode.",
        "When encountering '.', branch into all existing child nodes recursively via DFS."
      ],
      oracleFn: (commands: string[], args: any[]) => {
        class RefWordDictNode {
          children: Record<string, RefWordDictNode> = {};
          isEnd = false;
        }
        class RefWordDictionary {
          root = new RefWordDictNode();
          addWord(word: string) {
            let node = this.root;
            for (const ch of word) {
              if (!node.children[ch]) node.children[ch] = new RefWordDictNode();
              node = node.children[ch];
            }
            node.isEnd = true;
          }
          search(word: string): boolean {
            const dfs = (idx: number, node: RefWordDictNode | undefined): boolean => {
              if (!node) return false;
              if (idx === word.length) return node.isEnd;
              const ch = word[idx];
              if (ch === '.') {
                for (const key in node.children) {
                  if (dfs(idx + 1, node.children[key])) return true;
                }
                return false;
              } else {
                return dfs(idx + 1, node.children[ch]);
              }
            };
            return dfs(0, this.root);
          }
        }
        let wd: RefWordDictionary | null = null;
        const res: any[] = [];
        for (let i = 0; i < commands.length; i++) {
          const cmd = commands[i];
          if (cmd === 'WordDictionary') {
            wd = new RefWordDictionary();
            res.push(null);
          } else if (cmd === 'addWord') {
            wd!.addWord(args[i][0]);
            res.push(null);
          } else if (cmd === 'search') {
            res.push(wd!.search(args[i][0]));
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [
            ["WordDictionary", "addWord", "addWord", "addWord", "search", "search", "search", "search"],
            [[], ["bad"], ["dad"], ["mad"], ["pad"], ["bad"], [".ad"], ["b.."]]
          ],
          [
            ["WordDictionary", "addWord", "search", "search"],
            [[], ["apple"], ["app.."], ["apple"]]
          ],
          [
            ["WordDictionary", "addWord", "addWord", "search"],
            [[], ["bat"], ["cat"], [".at"]]
          ],
          [
            ["WordDictionary", "addWord", "search", "search"],
            [[], ["ran"], ["r.n"], ["..n"]]
          ]
        ],
        boundary: [
          [
            ["WordDictionary", "search"],
            [[], ["a"]]
          ],
          [
            ["WordDictionary", "addWord", "search"],
            [[], ["a"], ["."]]
          ],
          [
            ["WordDictionary", "addWord", "search"],
            [[], ["ab"], [".."]]
          ]
        ],
        adversarial: [
          [
            ["WordDictionary", "addWord", "addWord", "search", "search"],
            [[], ["at"], ["and"], ["a."], [".nd"]]
          ],
          [
            ["WordDictionary", "addWord", "addWord", "search"],
            [[], ["a"], ["aa"], ["."]]
          ]
        ],
        stress: [
          [
            ["WordDictionary", ...Array.from({ length: 20 }, (_, i) => "addWord"), ...Array.from({ length: 20 }, (_, i) => "search")],
            [[], ...Array.from({ length: 20 }, (_, i) => [`word${i}`]), ...Array.from({ length: 20 }, (_, i) => [`word.${i % 10}`])]
          ],
          [
            ["WordDictionary", ...Array.from({ length: 25 }, (_, i) => "addWord"), ...Array.from({ length: 25 }, (_, i) => "search")],
            [[], ...Array.from({ length: 25 }, (_, i) => [`test${i}`]), ...Array.from({ length: 25 }, (_, i) => [`t..t${i}`])]
          ]
        ]
      }
    }),

    // 466. Palindrome Pairs
    createProblem({
      num: 466,
      title: "Palindrome Pairs",
      slug: "palindrome-pairs",
      level: 22,
      difficulty: "HARD",
      topic: "Trie / Hash Table / String",
      patternSlug: "advanced-binary-search-trie",
      estimatedTimeMin: 35,
      statement: "Given a 0-indexed list of unique words `words`, return all the palindrome pairs `[i, j]` such that `i != j` and the concatenation of the two words, `words[i] + words[j]`, is a palindrome.",
      functionName: "palindromePairs",
      parameters: [
        { name: "words", type: "string[]", description: "Array of unique strings" }
      ],
      returnType: "number[][]",
      constraints: ["1 <= words.length <= 5000", "0 <= words[i].length <= 300", "words[i] consists of lowercase English letters."],
      examples: [
        { input: "words = [\"abcd\",\"dcba\",\"lls\",\"s\",\"sssll\"]", output: "[[0,1],[1,0],[3,2],[2,4]]", explanation: "The palindromes are [\"abcddcba\",\"dcbaabcd\",\"slls\",\"llssssll\"]." },
        { input: "words = [\"bat\",\"tab\",\"cat\"]", output: "[[0,1],[1,0]]", explanation: "The palindromes are [\"battab\",\"tabbat\"]." },
        { input: "words = [\"a\",\"\"]", output: "[[0,1],[1,0]]", explanation: "Empty string paired with any palindrome string forms a palindrome." }
      ],
      optimalSolution: `function palindromePairs(words) {\n  const isPal = (s, l, r) => {\n    while (l < r) {\n      if (s[l++] !== s[r--]) return false;\n    }\n    return true;\n  };\n  const wordMap = new Map();\n  for (let i = 0; i < words.length; i++) wordMap.set(words[i], i);\n  const res = [];\n  for (let i = 0; i < words.length; i++) {\n    const w = words[i];\n    const m = w.length;\n    for (let j = 0; j <= m; j++) {\n      if (isPal(w, j, m - 1)) {\n        const revPrefix = w.substring(0, j).split('').reverse().join('');\n        const k = wordMap.get(revPrefix);\n        if (k !== undefined && k !== i) res.push([i, k]);\n      }\n      if (j > 0 && isPal(w, 0, j - 1)) {\n        const revSuffix = w.substring(j).split('').reverse().join('');\n        const k = wordMap.get(revSuffix);\n        if (k !== undefined && k !== i) res.push([k, i]);\n      }\n    }\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(N * L^2) where N is words count, L is maximum word length",
      optimalSpaceComplexity: "O(N * L)",
      suboptimalSolution: `function palindromePairs(words) {\n  const res = [];\n  const isPal = (s) => {\n    let l = 0, r = s.length - 1;\n    while (l < r) if (s[l++] !== s[r--]) return false;\n    return true;\n  };\n  for (let i = 0; i < words.length; i++) {\n    for (let j = 0; j < words.length; j++) {\n      if (i !== j && isPal(words[i] + words[j])) res.push([i, j]);\n    }\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N^2 * L)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: [
        "Duplicate pairs when empty string is present if j = 0 and j = length boundary checks are not distinguished.",
        "Missing self-matching constraint i !== j."
      ],
      hints: [
        "Store all reversed words in a Hash Map (or Trie).",
        "For each word, split into prefix and suffix at position j.",
        "If prefix is palindrome, look for reverse(suffix) in the map.",
        "If suffix is palindrome, look for reverse(prefix) in the map."
      ],
      oracleFn: (words: string[]) => {
        const isPal = (s: string, l: number, r: number) => {
          while (l < r) {
            if (s[l++] !== s[r--]) return false;
          }
          return true;
        };
        const wordMap = new Map<string, number>();
        for (let i = 0; i < words.length; i++) wordMap.set(words[i], i);
        const res: number[][] = [];
        for (let i = 0; i < words.length; i++) {
          const w = words[i];
          const m = w.length;
          for (let j = 0; j <= m; j++) {
            if (isPal(w, j, m - 1)) {
              const revPrefix = w.substring(0, j).split('').reverse().join('');
              const k = wordMap.get(revPrefix);
              if (k !== undefined && k !== i) res.push([i, k]);
            }
            if (j > 0 && isPal(w, 0, j - 1)) {
              const revSuffix = w.substring(j).split('').reverse().join('');
              const k = wordMap.get(revSuffix);
              if (k !== undefined && k !== i) res.push([k, i]);
            }
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [["abcd", "dcba", "lls", "s", "sssll"]],
          [["bat", "tab", "cat"]],
          [["a", ""]],
          [["race", "car"]]
        ],
        boundary: [
          [["a", "b"]],
          [["abc", "cba"]],
          [["aba", ""]]
        ],
        adversarial: [
          [["a", "aa", "aaa"]],
          [["ab", "ba", "abc", "cba"]]
        ],
        stress: [
          [["abcde", "edcba", "fghij", "jihgf", "klmno", "onmlk", "pqrst", "tsrqp"]],
          [Array.from({ length: 40 }, (_, i) => `x${i}`)]
        ]
      }
    }),

    // 467. Concatenated Words
    createProblem({
      num: 467,
      title: "Concatenated Words",
      slug: "concatenated-words",
      level: 22,
      difficulty: "HARD",
      topic: "Trie / Dynamic Programming",
      patternSlug: "advanced-binary-search-trie",
      estimatedTimeMin: 35,
      statement: "Given an array of strings `words` (without duplicates), return all concatenated words in the given list of words.\n\nA concatenated word is defined as a string that is comprised entirely of at least two shorter words in the given array.",
      functionName: "findAllConcatenatedWordsInADict",
      parameters: [
        { name: "words", type: "string[]", description: "Array of distinct words" }
      ],
      returnType: "string[]",
      constraints: ["1 <= words.length <= 10^4", "1 <= words[i].length <= 30", "words[i] consists of only lowercase English letters", "All strings in words are unique."],
      examples: [
        { input: "words = [\"cat\",\"cats\",\"catsdogcats\",\"dog\",\"dogcatsdog\",\"hippopotamuses\",\"rat\",\"ratcatdogcat\"]", output: "[\"catsdogcats\",\"dogcatsdog\",\"ratcatdogcat\"]", explanation: "'catsdogcats' = 'cats' + 'dog' + 'cats', 'dogcatsdog' = 'dog' + 'cats' + 'dog', 'ratcatdogcat' = 'rat' + 'cat' + 'dog' + 'cat'." },
        { input: "words = [\"cat\",\"dog\",\"catdog\"]", output: "[\"catdog\"]", explanation: "'catdog' is concatenated from 'cat' and 'dog'." }
      ],
      optimalSolution: `function findAllConcatenatedWordsInADict(words) {\n  words.sort((a, b) => a.length - b.length);\n  const wordSet = new Set();\n  const res = [];\n  const canForm = (word) => {\n    if (wordSet.size === 0) return false;\n    const dp = new Array(word.length + 1).fill(false);\n    dp[0] = true;\n    for (let i = 1; i <= word.length; i++) {\n      for (let j = 0; j < i; j++) {\n        if (dp[j] && wordSet.has(word.substring(j, i))) {\n          dp[i] = true;\n          break;\n        }\n      }\n    }\n    return dp[word.length];\n  };\n  for (const w of words) {\n    if (w.length > 0 && canForm(w)) {\n      res.push(w);\n    }\n    wordSet.add(w);\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(N log N + N * L^2) where L is max word length",
      optimalSpaceComplexity: "O(N * L)",
      suboptimalSolution: `function findAllConcatenatedWordsInADict(words) {\n  const wordSet = new Set(words);\n  const res = [];\n  const dfs = (word, count) => {\n    if (word === '' && count >= 2) return true;\n    for (let i = 1; i <= word.length; i++) {\n      const prefix = word.substring(0, i);\n      if (wordSet.has(prefix) && dfs(word.substring(i), count + 1)) return true;\n    }\n    return false;\n  };\n  for (const w of words) {\n    if (dfs(w, 0)) res.push(w);\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N * 2^L) without memoization",
      suboptimalSpaceComplexity: "O(N * L)",
      commonMistakes: [
        "Allowing a word to be formed by itself (must be formed by AT LEAST TWO words, which is handled cleanly by sorting by length and checking against previous smaller words).",
        "Infinite loops on empty strings."
      ],
      hints: [
        "Sort words by length ascending.",
        "A word can only be formed by shorter words that appear earlier in the sorted list.",
        "Use Word Break DP: dp[i] is true if word[0..i-1] can be segmented using words in the dictionary so far."
      ],
      oracleFn: (words: string[]) => {
        const sorted = [...words].sort((a, b) => a.length - b.length);
        const wordSet = new Set<string>();
        const res: string[] = [];
        const canForm = (word: string) => {
          if (wordSet.size === 0) return false;
          const dp = new Array(word.length + 1).fill(false);
          dp[0] = true;
          for (let i = 1; i <= word.length; i++) {
            for (let j = 0; j < i; j++) {
              if (dp[j] && wordSet.has(word.substring(j, i))) {
                dp[i] = true;
                break;
              }
            }
          }
          return dp[word.length];
        };
        for (const w of sorted) {
          if (w.length > 0 && canForm(w)) {
            res.push(w);
          }
          wordSet.add(w);
        }
        return res;
      },
      testCases: {
        functional: [
          [["cat", "cats", "catsdogcats", "dog", "dogcatsdog", "hippopotamuses", "rat", "ratcatdogcat"]],
          [["cat", "dog", "catdog"]],
          [["a", "b", "ab", "abc"]]
        ],
        boundary: [
          [["a"]],
          [["a", "b"]],
          [["a", "aa"]]
        ],
        adversarial: [
          [["a", "b", "ab", "ba", "aba", "bab"]],
          [["prefix", "suffix", "prefixsuffix", "word"]]
        ],
        stress: [
          [["a", "b", "c", "ab", "bc", "ca", "abc", "bca", "cab", "aabbcc", "xyz"]],
          [Array.from({ length: 30 }, (_, i) => `w${i}`)]
        ]
      }
    }),

    // 468. Word Squares
    createProblem({
      num: 468,
      title: "Word Squares",
      slug: "word-squares",
      level: 22,
      difficulty: "HARD",
      topic: "Trie / Backtracking",
      patternSlug: "advanced-binary-search-trie",
      estimatedTimeMin: 35,
      statement: "Given an array of unique strings `words`, return all word squares you can build from them. The same word from `words` can be used multiple times. You can return the answer in any order.\n\nA sequence of strings forms a valid word square if the `k-th` row and column read the exact same string, where `0 <= k < max(numRows, numColumns)`.\n\nFor example, the word sequence `[\"ball\",\"area\",\"lead\",\"lady\"]` forms a word square because each word reads the same horizontally and vertically.",
      functionName: "wordSquares",
      parameters: [
        { name: "words", type: "string[]", description: "Array of unique words of equal length" }
      ],
      returnType: "string[][]",
      constraints: ["1 <= words.length <= 1000", "1 <= words[i].length <= 5", "All words[i] have the same length.", "words[i] consists of only lowercase English letters.", "All words[i] are unique."],
      examples: [
        { input: "words = [\"area\",\"lead\",\"wall\",\"lady\",\"ball\"]", output: "[[\"ball\",\"area\",\"lead\",\"lady\"],[\"wall\",\"area\",\"lead\",\"lady\"]]", explanation: "Both matrices have row k == col k." },
        { input: "words = [\"abat\",\"baba\",\"atan\",\"atal\"]", output: "[[\"baba\",\"abat\",\"baba\",\"atan\"],[\"baba\",\"abat\",\"baba\",\"atal\"]]", explanation: "Valid symmetrical 4x4 squares." }
      ],
      optimalSolution: `function wordSquares(words) {\n  const n = words[0].length;\n  const prefixMap = new Map();\n  for (const w of words) {\n    for (let i = 0; i <= n; i++) {\n      const p = w.substring(0, i);\n      if (!prefixMap.has(p)) prefixMap.set(p, []);\n      prefixMap.get(p).push(w);\n    }\n  }\n  const res = [];\n  const square = [];\n  const backtrack = (step) => {\n    if (step === n) {\n      res.push([...square]);\n      return;\n    }\n    let prefix = '';\n    for (let i = 0; i < step; i++) {\n      prefix += square[i][step];\n    }\n    const candidates = prefixMap.get(prefix) || [];\n    for (const cand of candidates) {\n      square.push(cand);\n      backtrack(step + 1);\n      square.pop();\n    }\n  };\n  for (const w of words) {\n    square.push(w);\n    backtrack(1);\n    square.pop();\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(N * 26^L)",
      optimalSpaceComplexity: "O(N * L)",
      suboptimalSolution: `function wordSquares(words) {\n  const n = words[0].length;\n  const res = [];\n  const square = [];\n  const isValid = () => {\n    for (let r = 0; r < square.length; r++) {\n      for (let c = 0; c < square.length; c++) {\n        if (square[r][c] !== square[c][r]) return false;\n      }\n    }\n    return true;\n  };\n  const dfs = (step) => {\n    if (step === n) {\n      if (isValid()) res.push([...square]);\n      return;\n    }\n    for (const w of words) {\n      square.push(w);\n      let ok = true;\n      for (let i = 0; i < step; i++) {\n        if (square[i][step] !== w[i]) { ok = false; break; }\n      }\n      if (ok) dfs(step + 1);\n      square.pop();\n    }\n  };\n  dfs(0);\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N^L)",
      suboptimalSpaceComplexity: "O(L)",
      commonMistakes: [
        "Failing to prune by column prefix before recursing.",
        "Assuming each word can only be used once (words can be reused)."
      ],
      hints: [
        "To place the k-th word, its prefix of length k must match the k-th column formed by the previously chosen words.",
        "Precompute a prefix-to-words Trie or Hash Map for instant candidate lookup.",
        "Backtrack row by row until length N is reached."
      ],
      oracleFn: (words: string[]) => {
        const n = words[0].length;
        const prefixMap = new Map<string, string[]>();
        for (const w of words) {
          for (let i = 0; i <= n; i++) {
            const p = w.substring(0, i);
            if (!prefixMap.has(p)) prefixMap.set(p, []);
            prefixMap.get(p)!.push(w);
          }
        }
        const res: string[][] = [];
        const square: string[] = [];
        const backtrack = (step: number) => {
          if (step === n) {
            res.push([...square]);
            return;
          }
          let prefix = '';
          for (let i = 0; i < step; i++) {
            prefix += square[i][step];
          }
          const candidates = prefixMap.get(prefix) || [];
          for (const cand of candidates) {
            square.push(cand);
            backtrack(step + 1);
            square.pop();
          }
        };
        for (const w of words) {
          square.push(w);
          backtrack(1);
          square.pop();
        }
        return res;
      },
      testCases: {
        functional: [
          [["area", "lead", "wall", "lady", "ball"]],
          [["abat", "baba", "atan", "atal"]],
          [["lady", "area", "dear", "yard"]],
          [["a"]]
        ],
        boundary: [
          [["ab", "ba"]],
          [["ab", "bc", "ca"]],
          [["cat", "ate", "tea"]]
        ],
        adversarial: [
          [["abc", "bcd", "cde"]],
          [["noon", "otto", "toto", "onon"]],
          [["base", "area", "seal", "earn"]]
        ],
        stress: [
          [["card", "area", "read", "dada", "dare", "dear"]]
        ]
      }
    }),

    // 469. Minimum Window Subsequence
    createProblem({
      num: 469,
      title: "Minimum Window Subsequence",
      slug: "minimum-window-subsequence",
      level: 22,
      difficulty: "HARD",
      topic: "Dynamic Programming / Two Pointers",
      patternSlug: "advanced-binary-search-trie",
      estimatedTimeMin: 35,
      statement: "Given strings `s1` and `s2`, return the minimum contiguous substring of `s1` which contains `s2` as a subsequence.\n\nIf there is no such substring of `s1` that contains all characters of `s2`, return the empty string `\"\"`. If there are multiple such minimum-length windows, return the one with the leftmost starting index.",
      functionName: "minWindow",
      parameters: [
        { name: "s1", type: "string", description: "Main source string" },
        { name: "s2", type: "string", description: "Target subsequence pattern" }
      ],
      returnType: "string",
      constraints: ["1 <= s1.length <= 2 * 10^4", "1 <= s2.length <= 100", "s1 and s2 consist of lowercase English letters."],
      examples: [
        { input: "s1 = \"abcdebdde\", s2 = \"bde\"", output: "\"bcde\"", explanation: "'bcde' contains 'bde' as subsequence and has length 4, which is smaller than 'bdde' (also 4, but 'bcde' starts at index 1 vs 5)." },
        { input: "s1 = \"jmeqforejwnaknvymkrstpwtmsstywhoptvqusqiahvlquwichjhmirdbektxafmwqhxllyqเข\", s2 = \"u\"", output: "\"u\"", explanation: "Single character match." },
        { input: "s1 = \"fgrqsqsnodwmxzkzxwqegkndaa\", s2 = \"knd\"", output: "\"knd\"", explanation: "Exact substring is minimal window." }
      ],
      optimalSolution: `function minWindow(s1, s2) {\n  let minLen = Infinity;\n  let startIdx = -1;\n  let i = 0, j = 0;\n  while (i < s1.length) {\n    if (s1[i] === s2[j]) {\n      j++;\n      if (j === s2.length) {\n        let right = i;\n        j--;\n        while (j >= 0) {\n          if (s1[i] === s2[j]) j--;\n          i--;\n        }\n        i++;\n        j = 0;\n        const curLen = right - i + 1;\n        if (curLen < minLen) {\n          minLen = curLen;\n          startIdx = i;\n        }\n      }\n    }\n    i++;\n  }\n  return startIdx === -1 ? \"\" : s1.substring(startIdx, startIdx + minLen);\n}`,
      optimalTimeComplexity: "O(S1 * S2)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function minWindow(s1, s2) {\n  let ans = \"\";\n  for (let len = s2.length; len <= s1.length; len++) {\n    for (let i = 0; i + len <= s1.length; i++) {\n      const sub = s1.substring(i, i + len);\n      let p2 = 0;\n      for (let p1 = 0; p1 < sub.length && p2 < s2.length; p1++) {\n        if (sub[p1] === s2[p2]) p2++;\n      }\n      if (p2 === s2.length) return sub;\n    }\n  }\n  return \"\";\n}`,
      suboptimalTimeComplexity: "O(S1^3)",
      suboptimalSpaceComplexity: "O(S1)",
      commonMistakes: [
        "Confusing substring (contiguous) with subsequence (can skip characters).",
        "Not scanning backward to find the tightest left starting boundary."
      ],
      hints: [
        "Advance pointer `i` in s1 forward to match s2 character by character.",
        "Once all characters of s2 are matched, reverse scan backward to find the optimal tight left boundary.",
        "Update the global minimum window and continue scanning forward."
      ],
      oracleFn: (s1: string, s2: string) => {
        let minLen = Infinity;
        let startIdx = -1;
        let i = 0, j = 0;
        while (i < s1.length) {
          if (s1[i] === s2[j]) {
            j++;
            if (j === s2.length) {
              const right = i;
              j--;
              while (j >= 0) {
                if (s1[i] === s2[j]) j--;
                i--;
              }
              i++;
              j = 0;
              const curLen = right - i + 1;
              if (curLen < minLen) {
                minLen = curLen;
                startIdx = i;
              }
            }
          }
          i++;
        }
        return startIdx === -1 ? "" : s1.substring(startIdx, startIdx + minLen);
      },
      testCases: {
        functional: [
          ["abcdebdde", "bde"],
          ["fgrqsqsnodwmxzkzxwqegkndaa", "knd"],
          ["abc", "d"],
          ["abracadabra", "raca"]
        ],
        boundary: [
          ["a", "a"],
          ["a", "b"],
          ["bb", "b"]
        ],
        adversarial: [
          ["cnhczmccqouqadqtmjjzl", "mm"],
          ["bbbbbbbb", "bbb"]
        ],
        stress: [
          ["a".repeat(100) + "b" + "c".repeat(100), "abc"]
        ]
      }
    }),

    // 470. Shortest Palindrome
    createProblem({
      num: 470,
      title: "Shortest Palindrome",
      slug: "shortest-palindrome",
      level: 22,
      difficulty: "HARD",
      topic: "KMP / String Matching",
      patternSlug: "advanced-binary-search-trie",
      estimatedTimeMin: 30,
      statement: "You are given a string `s`. You can convert it to a palindrome by adding characters in front of it.\n\nReturn the shortest palindrome you can find by performing this transformation.",
      functionName: "shortestPalindrome",
      parameters: [
        { name: "s", type: "string", description: "Input string" }
      ],
      returnType: "string",
      constraints: ["0 <= s.length <= 5 * 10^4", "s consists of lowercase English letters only."],
      examples: [
        { input: "s = \"aacecaaa\"", output: "\"aaacecaaa\"", explanation: "Add 'a' to the front." },
        { input: "s = \"abcd\"", output: "\"dcbabcd\"", explanation: "Add 'dcb' to the front." },
        { input: "s = \"\"", output: "\"\"", explanation: "Empty string is already a palindrome." }
      ],
      optimalSolution: `function shortestPalindrome(s) {\n  if (!s || s.length <= 1) return s;\n  const rev = s.split('').reverse().join('');\n  const temp = s + '#' + rev;\n  const pi = new Array(temp.length).fill(0);\n  for (let i = 1; i < temp.length; i++) {\n    let j = pi[i - 1];\n    while (j > 0 && temp[i] !== temp[j]) j = pi[j - 1];\n    if (temp[i] === temp[j]) j++;\n    pi[i] = j;\n  }\n  const maxPrefix = pi[temp.length - 1];\n  const nonPal = s.substring(maxPrefix);\n  return nonPal.split('').reverse().join('') + s;\n}`,
      optimalTimeComplexity: "O(N) using KMP prefix function",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function shortestPalindrome(s) {\n  const isPal = (str) => {\n    let l = 0, r = str.length - 1;\n    while (l < r) if (str[l++] !== str[r--]) return false;\n    return true;\n  };\n  for (let i = s.length; i >= 0; i--) {\n    if (isPal(s.substring(0, i))) {\n      const rem = s.substring(i);\n      return rem.split('').reverse().join('') + s;\n    }\n  }\n  return s;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Concatenating `s + rev` without a separator like `#`, causing characters across boundary to falsely match.",
        "Reversing the whole string when only the suffix needs to be reversed."
      ],
      hints: [
        "The problem is equivalent to finding the longest palindrome prefix of `s`.",
        "Build the combined string `s + '#' + reverse(s)`.",
        "Compute the KMP prefix table (`pi`). The last value `pi[pi.length - 1]` gives the length of the longest palindromic prefix.",
        "Reverse the remaining suffix and prepend it to `s`."
      ],
      oracleFn: (s: string) => {
        if (!s || s.length <= 1) return s;
        const rev = s.split('').reverse().join('');
        const temp = s + '#' + rev;
        const pi = new Array(temp.length).fill(0);
        for (let i = 1; i < temp.length; i++) {
          let j = pi[i - 1];
          while (j > 0 && temp[i] !== temp[j]) j = pi[j - 1];
          if (temp[i] === temp[j]) j++;
          pi[i] = j;
        }
        const maxPrefix = pi[temp.length - 1];
        const nonPal = s.substring(maxPrefix);
        return nonPal.split('').reverse().join('') + s;
      },
      testCases: {
        functional: [
          ["aacecaaa"],
          ["abcd"],
          [""],
          ["racecar"]
        ],
        boundary: [
          ["a"],
          ["ab"],
          ["aa"]
        ],
        adversarial: [
          ["abbacd"],
          ["ananab"],
          ["babbb"]
        ],
        stress: [
          ["a".repeat(80) + "b"],
          [Array.from({ length: 60 }, (_, i) => String.fromCharCode(97 + (i % 3))).join('')]
        ]
      }
    }),

    // 471. Longest Duplicate Substring
    createProblem({
      num: 471,
      title: "Longest Duplicate Substring",
      slug: "longest-duplicate-substring",
      level: 22,
      difficulty: "HARD",
      topic: "Binary Search / Rolling Hash",
      patternSlug: "advanced-binary-search-trie",
      estimatedTimeMin: 35,
      statement: "Given a string `s`, consider all duplicated substrings: contiguous substrings of `s` that occur 2 or more times. The occurrences may overlap.\n\nReturn any duplicated substring that has the longest possible length. If `s` does not have a duplicated substring, the answer is `\"\"`.",
      functionName: "longestDupSubstring",
      parameters: [
        { name: "s", type: "string", description: "Input string" }
      ],
      returnType: "string",
      constraints: ["2 <= s.length <= 3 * 10^4", "s consists of lowercase English letters."],
      examples: [
        { input: "s = \"banana\"", output: "\"ana\"", explanation: "'ana' appears at index 1 and index 3." },
        { input: "s = \"abcd\"", output: "\"\"", explanation: "No repeated substrings exist." },
        { input: "s = \"aa\"", output: "\"a\"", explanation: "'a' repeats twice." }
      ],
      optimalSolution: `function longestDupSubstring(s) {\n  let low = 1, high = s.length - 1;\n  let res = \"\";\n  const findDuplicate = (len) => {\n    const seen = new Set();\n    for (let i = 0; i <= s.length - len; i++) {\n      const sub = s.substring(i, i + len);\n      if (seen.has(sub)) return sub;\n      seen.add(sub);\n    }\n    return null;\n  };\n  while (low <= high) {\n    const mid = Math.floor((low + high) / 2);\n    const dup = findDuplicate(mid);\n    if (dup !== null) {\n      res = dup;\n      low = mid + 1;\n    } else {\n      high = mid - 1;\n    }\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(N log N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function longestDupSubstring(s) {\n  for (let len = s.length - 1; len >= 1; len--) {\n    const seen = new Set();\n    for (let i = 0; i + len <= s.length; i++) {\n      const sub = s.substring(i, i + len);\n      if (seen.has(sub)) return sub;\n      seen.add(sub);\n    }\n  }\n  return \"\";\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Linear search for length instead of binary search.",
        "Overlooking overlapping occurrences (occurrences are allowed to overlap)."
      ],
      hints: [
        "If there exists a duplicated substring of length L, there must exist duplicated substrings of length L - 1.",
        "Binary search on the length of the duplicated substring in range [1, s.length - 1].",
        "For a fixed length L, use Rabin-Karp or Hash Set of substrings to check for duplicates."
      ],
      oracleFn: (s: string) => {
        let low = 1, high = s.length - 1;
        let res = "";
        const findDuplicate = (len: number) => {
          const seen = new Set<string>();
          for (let i = 0; i <= s.length - len; i++) {
            const sub = s.substring(i, i + len);
            if (seen.has(sub)) return sub;
            seen.add(sub);
          }
          return null;
        };
        while (low <= high) {
          const mid = Math.floor((low + high) / 2);
          const dup = findDuplicate(mid);
          if (dup !== null) {
            res = dup;
            low = mid + 1;
          } else {
            high = mid - 1;
          }
        }
        return res;
      },
      testCases: {
        functional: [
          ["banana"],
          ["abcd"],
          ["aa"],
          ["mississippi"]
        ],
        boundary: [
          ["ab"],
          ["aaa"],
          ["aba"]
        ],
        adversarial: [
          ["zxcvbnmzxcvbnm"],
          ["abcdefghijabcdefghij"]
        ],
        stress: [
          ["a".repeat(80)],
          [Array.from({ length: 60 }, (_, i) => String.fromCharCode(97 + (i % 4))).join('')]
        ]
      }
    }),

    // 472. Repeated DNA Sequences
    createProblem({
      num: 472,
      title: "Repeated DNA Sequences",
      slug: "repeated-dna-sequences",
      level: 22,
      difficulty: "MEDIUM",
      topic: "Hash Table / Rolling Hash",
      patternSlug: "advanced-binary-search-trie",
      estimatedTimeMin: 20,
      statement: "The DNA sequence is composed of a series of nucleotides abbreviated as `'A'`, `'C'`, `'G'`, and `'T'`.\n\nFor example, `\"ACGAATTCCG\"` is a DNA sequence.\n\nWhen studying DNA, it is useful to identify repeated sequences within the DNA.\n\nGiven a string `s` that represents a DNA sequence, return all the 10-letter-long sequences (substrings) that occur more than once in a DNA molecule. You may return the answer in any order.",
      functionName: "findRepeatedDnaSequences",
      parameters: [
        { name: "s", type: "string", description: "DNA sequence string" }
      ],
      returnType: "string[]",
      constraints: ["1 <= s.length <= 10^5", "s[i] is either 'A', 'C', 'G', or 'T'."],
      examples: [
        { input: "s = \"AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT\"", output: "[\"AAAAACCCCC\",\"CCCCCAAAAA\"]", explanation: "'AAAAACCCCC' and 'CCCCCAAAAA' both occur multiple times." },
        { input: "s = \"AAAAAAAAAAAAA\"", output: "[\"AAAAAAAAAA\"]", explanation: "10 consecutive 'A's repeat." }
      ],
      optimalSolution: `function findRepeatedDnaSequences(s) {\n  const seen = new Set();\n  const repeated = new Set();\n  for (let i = 0; i <= s.length - 10; i++) {\n    const sub = s.substring(i, i + 10);\n    if (seen.has(sub)) {\n      repeated.add(sub);\n    } else {\n      seen.add(sub);\n    }\n  }\n  return Array.from(repeated).sort();\n}`,
      optimalTimeComplexity: "O(N * 10)",
      optimalSpaceComplexity: "O(N * 10)",
      suboptimalSolution: `function findRepeatedDnaSequences(s) {\n  const map = new Map();\n  for (let i = 0; i <= s.length - 10; i++) {\n    const sub = s.substring(i, i + 10);\n    map.set(sub, (map.get(sub) || 0) + 1);\n  }\n  const res = [];\n  for (const [k, v] of map.entries()) {\n    if (v > 1) res.push(k);\n  }\n  return res.sort();\n}`,
      suboptimalTimeComplexity: "O(N * 10)",
      suboptimalSpaceComplexity: "O(N * 10)",
      commonMistakes: [
        "Adding duplicates to output without deduplicating via Set.",
        "Loop boundary off-by-one (must check up to s.length - 10)."
      ],
      hints: [
        "Use a sliding window of fixed length 10 across the string.",
        "Store visited 10-mers in a Hash Set `seen`.",
        "When a duplicate is encountered, insert it into a second Hash Set `repeated` to avoid multiple duplicates."
      ],
      oracleFn: (s: string) => {
        const seen = new Set<string>();
        const repeated = new Set<string>();
        for (let i = 0; i <= s.length - 10; i++) {
          const sub = s.substring(i, i + 10);
          if (seen.has(sub)) {
            repeated.add(sub);
          } else {
            seen.add(sub);
          }
        }
        return Array.from(repeated).sort();
      },
      testCases: {
        functional: [
          ["AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT"],
          ["AAAAAAAAAAAAA"],
          ["ACGTACGTACGTACGTACGT"],
          ["AAAAAAAAAA"]
        ],
        boundary: [
          ["A"],
          ["AAAAAAAAA"],
          ["ACGTACGTAC"]
        ],
        adversarial: [
          ["GAGAGAGAGAGAGAGAGAGA"],
          ["TACGTACGTACGTACGTACG"]
        ],
        stress: [
          [Array.from({ length: 60 }, (_, i) => "ACGT"[i % 4]).join('')],
          ["A".repeat(40) + "C".repeat(40)]
        ]
      }
    }),

    // 473. String to Integer (atoi)
    createProblem({
      num: 473,
      title: "String to Integer (atoi)",
      slug: "string-to-integer-atoi",
      level: 22,
      difficulty: "MEDIUM",
      topic: "Strings / Parsing",
      patternSlug: "advanced-binary-search-trie",
      estimatedTimeMin: 20,
      statement: "Implement the `myAtoi(string s)` function, which converts a string to a 32-bit signed integer.\n\nThe algorithm for `myAtoi(string s)` is as follows:\n1. **Whitespace**: Ignore any leading whitespace (`\" \"`).\n2. **Signedness**: Determine the sign by checking if the next character is `'-'` or `'+'`, assuming positivity if neither present.\n3. **Conversion**: Read the integer by skipping leading zeros until a non-digit character is encountered or the end of the string is reached. If no digits were read, then the result is `0`.\n4. **Rounding**: If the integer is out of the 32-bit signed integer range `[-2^31, 2^31 - 1]`, clamp the integer so that it remains in the range.",
      functionName: "myAtoi",
      parameters: [
        { name: "s", type: "string", description: "Input string" }
      ],
      returnType: "number",
      constraints: ["0 <= s.length <= 200", "s consists of English letters, digits, ' ', '+', '-', and '.'."],
      examples: [
        { input: "s = \"42\"", output: "42", explanation: "Parsed integer 42." },
        { input: "s = \"   -042\"", output: "-42", explanation: "Leading whitespace ignored, sign is negative, leading zero skipped." },
        { input: "s = \"1337c0d3\"", output: "1337", explanation: "Stops reading at 'c'." },
        { input: "s = \"0-1\"", output: "0", explanation: "Reads 0, then '-' is not a digit so parsing stops." },
        { input: "s = \"words and 987\"", output: "0", explanation: "No digits found before letters, returns 0." }
      ],
      optimalSolution: `function myAtoi(s) {\n  let i = 0;\n  while (i < s.length && s[i] === ' ') i++;\n  if (i === s.length) return 0;\n  let sign = 1;\n  if (s[i] === '+' || s[i] === '-') {\n    if (s[i] === '-') sign = -1;\n    i++;\n  }\n  let num = 0;\n  const INT_MAX = 2147483647;\n  const INT_MIN = -2147483648;\n  while (i < s.length && s[i] >= '0' && s[i] <= '9') {\n    const digit = s.charCodeAt(i) - 48;\n    num = num * 10 + digit;\n    if (sign === 1 && num > INT_MAX) return INT_MAX;\n    if (sign === -1 && -num < INT_MIN) return INT_MIN;\n    i++;\n  }\n  num = num * sign;\n  if (num > INT_MAX) return INT_MAX;\n  if (num < INT_MIN) return INT_MIN;\n  return num;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function myAtoi(s) {\n  const trimmed = s.trim();\n  const match = trimmed.match(/^([+-]?\\d+)/);\n  if (!match) return 0;\n  let n = Number(match[1]);\n  if (isNaN(n)) return 0;\n  const INT_MAX = 2147483647, INT_MIN = -2147483648;\n  if (n > INT_MAX) return INT_MAX;\n  if (n < INT_MIN) return INT_MIN;\n  return n;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Failing to handle empty or all-whitespace strings.",
        "Incorrectly reading signs in the middle of digits (e.g., '0-1').",
        "Overflow when parsing huge number strings before clamping."
      ],
      hints: [
        "Skip whitespace with a pointer.",
        "Check for optional '+' or '-' sign.",
        "Accumulate digits and clamp at 2147483647 or -2147483648 immediately upon overflow."
      ],
      oracleFn: (s: string) => {
        let i = 0;
        while (i < s.length && s[i] === ' ') i++;
        if (i === s.length) return 0;
        let sign = 1;
        if (s[i] === '+' || s[i] === '-') {
          if (s[i] === '-') sign = -1;
          i++;
        }
        let num = 0;
        const INT_MAX = 2147483647;
        const INT_MIN = -2147483648;
        while (i < s.length && s[i] >= '0' && s[i] <= '9') {
          const digit = s.charCodeAt(i) - 48;
          num = num * 10 + digit;
          if (sign === 1 && num > INT_MAX) return INT_MAX;
          if (sign === -1 && -num < INT_MIN) return INT_MIN;
          i++;
        }
        num = num * sign;
        if (num > INT_MAX) return INT_MAX;
        if (num < INT_MIN) return INT_MIN;
        return num;
      },
      testCases: {
        functional: [
          ["42"],
          ["   -042"],
          ["1337c0d3"],
          ["0-1"],
          ["words and 987"]
        ],
        boundary: [
          [""],
          ["   "],
          ["+1"],
          ["-1"]
        ],
        adversarial: [
          ["-91283472332"],
          ["2147483648"],
          ["-2147483649"],
          ["+-12"]
        ],
        stress: [
          ["  +00000000000000000000000000000012345678"],
          ["-0000000000000000000000000000000000000000000000000001"]
        ]
      }
    }),

    // 474. Multiply Strings
    createProblem({
      num: 474,
      title: "Multiply Strings",
      slug: "multiply-strings",
      level: 22,
      difficulty: "MEDIUM",
      topic: "Math / Strings",
      patternSlug: "advanced-binary-search-trie",
      estimatedTimeMin: 25,
      statement: "Given two non-negative integers `num1` and `num2` represented as strings, return the product of `num1` and `num2`, also represented as a string.\n\nNote: You must not use any built-in BigInteger library or convert the inputs to integer directly.",
      functionName: "multiply",
      parameters: [
        { name: "num1", type: "string", description: "First non-negative integer string" },
        { name: "num2", type: "string", description: "Second non-negative integer string" }
      ],
      returnType: "string",
      constraints: ["1 <= num1.length, num2.length <= 200", "num1 and num2 consist of digits only.", "Neither num1 nor num2 contains any leading zero, except the number 0 itself."],
      examples: [
        { input: "num1 = \"2\", num2 = \"3\"", output: "\"6\"", explanation: "2 * 3 = 6." },
        { input: "num1 = \"123\", num2 = \"456\"", output: "\"56088\"", explanation: "123 * 456 = 56088." },
        { input: "num1 = \"0\", num2 = \"52\"", output: "\"0\"", explanation: "Any number multiplied by 0 is 0." }
      ],
      optimalSolution: `function multiply(num1, num2) {\n  if (num1 === '0' || num2 === '0') return '0';\n  const m = num1.length, n = num2.length;\n  const pos = new Array(m + n).fill(0);\n  for (let i = m - 1; i >= 0; i--) {\n    for (let j = n - 1; j >= 0; j--) {\n      const mul = (num1.charCodeAt(i) - 48) * (num2.charCodeAt(j) - 48);\n      const p1 = i + j, p2 = i + j + 1;\n      const sum = mul + pos[p2];\n      pos[p2] = sum % 10;\n      pos[p1] += Math.floor(sum / 10);\n    }\n  }\n  while (pos.length > 1 && pos[0] === 0) pos.shift();\n  return pos.join('');\n}`,
      optimalTimeComplexity: "O(M * N)",
      optimalSpaceComplexity: "O(M + N)",
      suboptimalSolution: `function multiply(num1, num2) {\n  if (num1 === '0' || num2 === '0') return '0';\n  return (BigInt(num1) * BigInt(num2)).toString();\n}`,
      suboptimalTimeComplexity: "O(M * N)",
      suboptimalSpaceComplexity: "O(M + N)",
      commonMistakes: [
        "Failing to handle '0' inputs properly resulting in '0000'.",
        "Incorrect indexing when adding carry to pos[p1]."
      ],
      hints: [
        "The product of an M-digit and N-digit number has at most M + N digits.",
        "num1[i] * num2[j] contributes to positions [i + j, i + j + 1].",
        "Iterate backwards and accumulate product with carries in an array of size M + N."
      ],
      oracleFn: (num1: string, num2: string) => {
        if (num1 === '0' || num2 === '0') return '0';
        const m = num1.length, n = num2.length;
        const pos = new Array(m + n).fill(0);
        for (let i = m - 1; i >= 0; i--) {
          for (let j = n - 1; j >= 0; j--) {
            const mul = (num1.charCodeAt(i) - 48) * (num2.charCodeAt(j) - 48);
            const p1 = i + j, p2 = i + j + 1;
            const sum = mul + pos[p2];
            pos[p2] = sum % 10;
            pos[p1] += Math.floor(sum / 10);
          }
        }
        while (pos.length > 1 && pos[0] === 0) pos.shift();
        return pos.join('');
      },
      testCases: {
        functional: [
          ["2", "3"],
          ["123", "456"],
          ["0", "52"],
          ["999", "999"]
        ],
        boundary: [
          ["1", "1"],
          ["0", "0"],
          ["10", "10"]
        ],
        adversarial: [
          ["987654321", "123456789"],
          ["1000000", "1000000"]
        ],
        stress: [
          ["9".repeat(40), "9".repeat(40)],
          ["12345678901234567890", "98765432109876543210"]
        ]
      }
    })
  ];

  return {
    level: 22,
    levelTitle: "Level 22 — Advanced Binary Search, Prefix Trie & Multi-String Algorithms",
    topic: "Binary Search On Solution Space, Trie Prefix Traversal, Wildcard Trie Search, and KMP String Matching",
    problems
  };
}
