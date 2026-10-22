import { LevelPayload, GeneratedProblem } from './types';
import { createProblem } from './problemBuilder';

export function getLevel8Payload(): LevelPayload {
  const problems: GeneratedProblem[] = [
    // 168. Merge Intervals
    createProblem({
      num: 168,
      title: "Merge Intervals",
      slug: "merge-intervals",
      level: 8,
      difficulty: "MEDIUM",
      topic: "Intervals",
      patternSlug: "intervals-greedy",
      estimatedTimeMin: 25,
      statement: "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
      functionName: "merge",
      parameters: [{ name: "intervals", type: "number[][]", description: "Array of intervals [start, end]" }],
      returnType: "number[][]",
      constraints: ["1 <= intervals.length <= 10^4", "intervals[i].length == 2", "0 <= start_i <= end_i <= 10^4"],
      examples: [
        {
          input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
          output: "[[1,6],[8,10],[15,18]]",
          explanation: "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]."
        },
        {
          input: "intervals = [[1,4],[4,5]]",
          output: "[[1,5]]",
          explanation: "Intervals [1,4] and [4,5] touch at boundary 4 and are considered overlapping."
        },
        {
          input: "intervals = [[1,4],[0,4]]",
          output: "[[0,4]]",
          explanation: "Interval [0,4] completely encompasses [1,4]."
        },
        {
          input: "intervals = [[1,4],[2,3]]",
          output: "[[1,4]]",
          explanation: "[2,3] is strictly inside [1,4], so merged interval remains [1,4]."
        }
      ],
      optimalSolution: `function merge(intervals) {\n  if (intervals.length <= 1) return intervals;\n  intervals.sort((a, b) => a[0] - b[0]);\n  const merged = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const curr = intervals[i];\n    const last = merged[merged.length - 1];\n    if (curr[0] <= last[1]) {\n      last[1] = Math.max(last[1], curr[1]);\n    } else {\n      merged.push(curr);\n    }\n  }\n  return merged;\n}`,
      optimalTimeComplexity: "O(N log N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function merge(intervals) {\n  // Inefficient graph connected components or repeated pairwise merge\n  let changed = true;\n  let arr = intervals.map(x => [...x]);\n  while (changed) {\n    changed = false;\n    outer: for (let i = 0; i < arr.length; i++) {\n      for (let j = i + 1; j < arr.length; j++) {\n        if (Math.max(arr[i][0], arr[j][0]) <= Math.min(arr[i][1], arr[j][1])) {\n          const merged = [Math.min(arr[i][0], arr[j][0]), Math.max(arr[i][1], arr[j][1])];\n          arr.splice(j, 1);\n          arr[i] = merged;\n          changed = true;\n          break outer;\n        }\n      }\n    }\n  }\n  return arr.sort((a, b) => a[0] - b[0]);\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Failing to sort intervals by start time before merging",
        "Overlooking fully enclosed intervals where curr[1] < last[1]"
      ],
      hints: [
        "Sort intervals by their starting times.",
        "Iterate through sorted intervals: if current interval overlaps with previous merged one, extend previous merged interval's end.",
        "Otherwise, append current interval as a new disjoint interval."
      ],
      oracleFn: (intervals: number[][]) => {
        if (!intervals || intervals.length <= 1) return intervals || [];
        const sorted = [...intervals.map(iv => [...iv])].sort((a, b) => a[0] - b[0]);
        const res: number[][] = [sorted[0]];
        for (let i = 1; i < sorted.length; i++) {
          const last = res[res.length - 1];
          if (sorted[i][0] <= last[1]) {
            last[1] = Math.max(last[1], sorted[i][1]);
          } else {
            res.push(sorted[i]);
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [[[1, 3], [2, 6], [8, 10], [15, 18]]],
          [[[1, 4], [4, 5]]],
          [[[1, 4], [0, 4]]],
          [[[1, 4], [2, 3]]]
        ],
        boundary: [
          [[[1, 1]]],
          [[[1, 4], [0, 0]]],
          [[[2, 3], [4, 5], [6, 7], [8, 9]]]
        ],
        adversarial: [
          [[[2, 3], [2, 2], [3, 3], [1, 3], [5, 7], [2, 2], [4, 6]]],
          [[[1, 10], [2, 3], [4, 5], [6, 7], [8, 9]]],
          [[[1, 4], [0, 2], [3, 5]]]
        ],
        stress: [
          [Array.from({ length: 500 }, (_, i) => [i * 2, i * 2 + 1])],
          [Array.from({ length: 500 }, (_, i) => [i, i + 2])]
        ]
      }
    }),

    // 169. Insert Interval
    createProblem({
      num: 169,
      title: "Insert Interval",
      slug: "insert-interval",
      level: 8,
      difficulty: "MEDIUM",
      topic: "Intervals",
      patternSlug: "intervals-greedy",
      estimatedTimeMin: 20,
      statement: "You are given an array of non-overlapping intervals `intervals` where `intervals[i] = [start_i, end_i]` sorted in ascending order by `start_i`. You are also given an interval `newInterval = [start, end]`.\n\nInsert `newInterval` into `intervals` such that `intervals` is still sorted in ascending order and contains no overlapping intervals (merge overlapping intervals if necessary).",
      functionName: "insert",
      parameters: [
        { name: "intervals", type: "number[][]", description: "Sorted non-overlapping intervals" },
        { name: "newInterval", type: "number[]", description: "New interval to insert" }
      ],
      returnType: "number[][]",
      constraints: ["0 <= intervals.length <= 10^4", "intervals[i].length == 2", "0 <= start_i <= end_i <= 10^5", "newInterval.length == 2", "0 <= start <= end <= 10^5"],
      examples: [
        {
          input: "intervals = [[1,3],[6,9]], newInterval = [2,5]",
          output: "[[1,5],[6,9]]",
          explanation: "Because the new interval [2,5] overlaps with [1,3], merge them into [1,5]."
        },
        {
          input: "intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]",
          output: "[[1,2],[3,10],[12,16]]",
          explanation: "The new interval [4,8] overlaps with [3,5],[6,7],[8,10], merging into [3,10]."
        },
        {
          input: "intervals = [], newInterval = [5,7]",
          output: "[[5,7]]",
          explanation: "Inserting into empty list results in list containing just the new interval."
        },
        {
          input: "intervals = [[1,5]], newInterval = [6,8]",
          output: "[[1,5],[6,8]]",
          explanation: "New interval is strictly to the right without any overlap."
        }
      ],
      optimalSolution: `function insert(intervals, newInterval) {\n  const result = [];\n  let i = 0;\n  const n = intervals.length;\n  while (i < n && intervals[i][1] < newInterval[0]) {\n    result.push(intervals[i]);\n    i++;\n  }\n  while (i < n && intervals[i][0] <= newInterval[1]) {\n    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);\n    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);\n    i++;\n  }\n  result.push(newInterval);\n  while (i < n) {\n    result.push(intervals[i]);\n    i++;\n  }\n  return result;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function insert(intervals, newInterval) {\n  const all = [...intervals, newInterval].sort((a, b) => a[0] - b[0]);\n  const res = [all[0]];\n  for (let i = 1; i < all.length; i++) {\n    const last = res[res.length - 1];\n    if (all[i][0] <= last[1]) last[1] = Math.max(last[1], all[i][1]);\n    else res.push(all[i]);\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Not advancing the index properly across 3 stages (before, overlapping, after)",
        "Mutating input array in-place causing index shifting bugs"
      ],
      hints: [
        "Divide intervals into three stages: strictly before newInterval, overlapping with newInterval, and strictly after.",
        "Add all intervals ending before newInterval starts directly.",
        "Merge overlapping intervals into newInterval by updating min start and max end.",
        "Append the merged interval and all remaining intervals."
      ],
      oracleFn: (intervals: number[][], newInterval: number[]) => {
        const res: number[][] = [];
        let i = 0;
        const n = intervals.length;
        const cur = [...newInterval];
        while (i < n && intervals[i][1] < cur[0]) {
          res.push(intervals[i]);
          i++;
        }
        while (i < n && intervals[i][0] <= cur[1]) {
          cur[0] = Math.min(cur[0], intervals[i][0]);
          cur[1] = Math.max(cur[1], intervals[i][1]);
          i++;
        }
        res.push(cur);
        while (i < n) {
          res.push(intervals[i]);
          i++;
        }
        return res;
      },
      testCases: {
        functional: [
          [[[1, 3], [6, 9]], [2, 5]],
          [[[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]],
          [[], [5, 7]],
          [[[1, 5]], [2, 3]]
        ],
        boundary: [
          [[[1, 5]], [6, 8]],
          [[[1, 5]], [0, 0]],
          [[[1, 5]], [0, 6]]
        ],
        adversarial: [
          [[[3, 5], [12, 15]], [6, 6]],
          [[[1, 2], [3, 4], [5, 6], [7, 8]], [1, 8]],
          [[[2, 4], [5, 7], [8, 10], [11, 13]], [3, 6]]
        ],
        stress: [
          [Array.from({ length: 400 }, (_, i) => [i * 4, i * 4 + 2]), [100, 500]],
          [Array.from({ length: 400 }, (_, i) => [i * 3, i * 3 + 1]), [0, 2000]]
        ]
      }
    }),

    // 170. Non-overlapping Intervals
    createProblem({
      num: 170,
      title: "Non-overlapping Intervals",
      slug: "non-overlapping-intervals",
      level: 8,
      difficulty: "MEDIUM",
      topic: "Intervals / Greedy",
      patternSlug: "intervals-greedy",
      estimatedTimeMin: 20,
      statement: "Given an array of intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.\n\nNote that intervals which touch at a point are non-overlapping (e.g. `[1, 2]` and `[2, 3]` do not overlap).",
      functionName: "eraseOverlapIntervals",
      parameters: [{ name: "intervals", type: "number[][]", description: "Array of intervals" }],
      returnType: "number",
      constraints: ["1 <= intervals.length <= 10^5", "intervals[i].length == 2", "-5 * 10^4 <= start_i < end_i <= 5 * 10^4"],
      examples: [
        {
          input: "intervals = [[1,2],[2,3],[3,4],[1,3]]",
          output: "1",
          explanation: "[1,3] can be removed and the rest of the intervals are non-overlapping."
        },
        {
          input: "intervals = [[1,2],[1,2],[1,2]]",
          output: "2",
          explanation: "You need to remove two [1,2] to leave one [1,2]."
        },
        {
          input: "intervals = [[1,2],[2,3]]",
          output: "0",
          explanation: "You don't need to remove any of the intervals since they are already non-overlapping."
        },
        {
          input: "intervals = [[1,100],[11,22],[1,11],[2,12]]",
          output: "2",
          explanation: "Removing [1,100] and [2,12] leaves [1,11] and [11,22]."
        }
      ],
      optimalSolution: `function eraseOverlapIntervals(intervals) {\n  if (intervals.length <= 1) return 0;\n  intervals.sort((a, b) => a[1] - b[1]);\n  let count = 0;\n  let prevEnd = intervals[0][1];\n  for (let i = 1; i < intervals.length; i++) {\n    if (intervals[i][0] < prevEnd) {\n      count++;\n    } else {\n      prevEnd = intervals[i][1];\n    }\n  }\n  return count;\n}`,
      optimalTimeComplexity: "O(N log N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function eraseOverlapIntervals(intervals) {\n  // Sorting by start time and keeping the one with smaller end when overlap happens\n  intervals.sort((a, b) => a[0] - b[0]);\n  let count = 0;\n  let prev = intervals[0];\n  for (let i = 1; i < intervals.length; i++) {\n    if (intervals[i][0] < prev[1]) {\n      count++;\n      if (intervals[i][1] < prev[1]) prev = intervals[i];\n    } else {\n      prev = intervals[i];\n    }\n  }\n  return count;\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: [
        "Sorting by start time without handling end times greedily",
        "Treating touching endpoints (start === end) as an overlap when problem allows touching"
      ],
      hints: [
        "This is equivalent to finding the maximum number of mutually compatible intervals (Interval Scheduling).",
        "Greedily select intervals that finish earliest (sort by end time).",
        "The number of intervals to remove equals total intervals minus the maximum non-overlapping set."
      ],
      oracleFn: (intervals: number[][]) => {
        if (!intervals || intervals.length <= 1) return 0;
        const sorted = [...intervals].sort((a, b) => a[1] - b[1]);
        let count = 0;
        let prevEnd = sorted[0][1];
        for (let i = 1; i < sorted.length; i++) {
          if (sorted[i][0] < prevEnd) {
            count++;
          } else {
            prevEnd = sorted[i][1];
          }
        }
        return count;
      },
      testCases: {
        functional: [
          [[[1, 2], [2, 3], [3, 4], [1, 3]]],
          [[[1, 2], [1, 2], [1, 2]]],
          [[[1, 2], [2, 3]]],
          [[[1, 100], [11, 22], [1, 11], [2, 12]]]
        ],
        boundary: [
          [[[1, 2]]],
          [[[-50, -20], [-10, 0], [10, 20]]],
          [[[0, 1], [1, 2], [2, 3], [3, 4]]]
        ],
        adversarial: [
          [[[1, 4], [2, 3], [3, 5], [4, 6]]],
          [[[1, 10], [2, 4], [3, 6], [5, 8], [7, 9]]],
          [[[1, 5], [1, 5], [2, 3]]]
        ],
        stress: [
          [Array.from({ length: 500 }, (_, i) => [i, i + 3])],
          [Array.from({ length: 500 }, (_, i) => [0, i + 1])]
        ]
      }
    }),

    // 171. Meeting Rooms
    createProblem({
      num: 171,
      title: "Meeting Rooms",
      slug: "meeting-rooms",
      level: 8,
      difficulty: "EASY",
      topic: "Intervals",
      patternSlug: "intervals-greedy",
      estimatedTimeMin: 15,
      statement: "Given an array of meeting time intervals where `intervals[i] = [start_i, end_i]`, determine if a person could attend all meetings without overlapping.\n\nTouching meetings (e.g. one ends at 10 and next starts at 10) do not overlap.",
      functionName: "canAttendMeetings",
      parameters: [{ name: "intervals", type: "number[][]", description: "Array of meeting start and end times" }],
      returnType: "boolean",
      constraints: ["0 <= intervals.length <= 10^4", "intervals[i].length == 2", "0 <= start_i < end_i <= 10^6"],
      examples: [
        { input: "intervals = [[0,30],[5,10],[15,20]]", output: "false", explanation: "[0,30] conflicts with both [5,10] and [15,20]." },
        { input: "intervals = [[7,10],[2,4]]", output: "true", explanation: "Sorted: [2,4] and [7,10] do not overlap." },
        { input: "intervals = [[9,10],[4,9],[4,17]]", output: "false", explanation: "[4,9] and [4,17] overlap." },
        { input: "intervals = []", output: "true", explanation: "No meetings means no conflicts." }
      ],
      optimalSolution: `function canAttendMeetings(intervals) {\n  intervals.sort((a, b) => a[0] - b[0]);\n  for (let i = 1; i < intervals.length; i++) {\n    if (intervals[i][0] < intervals[i - 1][1]) return false;\n  }\n  return true;\n}`,
      optimalTimeComplexity: "O(N log N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function canAttendMeetings(intervals) {\n  for (let i = 0; i < intervals.length; i++) {\n    for (let j = i + 1; j < intervals.length; j++) {\n      if (Math.max(intervals[i][0], intervals[j][0]) < Math.min(intervals[i][1], intervals[j][1])) return false;\n    }\n  }\n  return true;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Using <= instead of < for overlap when touching is permitted", "Not sorting before checking adjacent intervals"],
      hints: [
        "Sort meetings by start time.",
        "Check whether any meeting starts before the prior meeting ends."
      ],
      oracleFn: (intervals: number[][]) => {
        const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
        for (let i = 1; i < sorted.length; i++) {
          if (sorted[i][0] < sorted[i - 1][1]) return false;
        }
        return true;
      },
      testCases: {
        functional: [
          [[[0, 30], [5, 10], [15, 20]]],
          [[[7, 10], [2, 4]]],
          [[[9, 10], [4, 9], [4, 17]]],
          [[]]
        ],
        boundary: [
          [[[1, 2]]],
          [[[1, 5], [5, 10], [10, 15]]],
          [[[0, 1], [0, 1]]]
        ],
        adversarial: [
          [[[13, 15], [1, 13]]],
          [[[5, 8], [6, 8]]],
          [[[1, 100], [2, 3], [4, 5]]]
        ],
        stress: [
          [Array.from({ length: 500 }, (_, i) => [i * 2, i * 2 + 1])],
          [Array.from({ length: 500 }, (_, i) => [i, i + 2])]
        ]
      }
    }),

    // 172. Meeting Rooms II
    createProblem({
      num: 172,
      title: "Meeting Rooms II",
      slug: "meeting-rooms-ii",
      level: 8,
      difficulty: "MEDIUM",
      topic: "Intervals",
      patternSlug: "intervals-greedy",
      estimatedTimeMin: 25,
      statement: "Given an array of meeting time intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the minimum number of conference rooms required.\n\nA room can be used immediately after a meeting ends if the next meeting starts at that exact same time.",
      functionName: "minMeetingRooms",
      parameters: [{ name: "intervals", type: "number[][]", description: "Array of meeting time intervals" }],
      returnType: "number",
      constraints: ["1 <= intervals.length <= 10^4", "0 <= start_i < end_i <= 10^6"],
      examples: [
        {
          input: "intervals = [[0,30],[5,10],[15,20]]",
          output: "2",
          explanation: "Room 1 hosts [0,30]. Room 2 can host [5,10] and [15,20] sequentially."
        },
        {
          input: "intervals = [[7,10],[2,4]]",
          output: "1",
          explanation: "Meetings do not overlap, so 1 room suffices."
        },
        {
          input: "intervals = [[1,4],[2,5],[7,9]]",
          output: "2",
          explanation: "[1,4] and [2,5] overlap, requiring 2 rooms. [7,9] can reuse one of them."
        },
        {
          input: "intervals = [[1,5],[5,10],[10,15]]",
          output: "1",
          explanation: "Endpoints touch consecutively without overlap, requiring only 1 room."
        }
      ],
      optimalSolution: `function minMeetingRooms(intervals) {\n  if (!intervals.length) return 0;\n  const starts = intervals.map(x => x[0]).sort((a, b) => a - b);\n  const ends = intervals.map(x => x[1]).sort((a, b) => a - b);\n  let rooms = 0, endIdx = 0;\n  for (let i = 0; i < starts.length; i++) {\n    if (starts[i] < ends[endIdx]) {\n      rooms++;\n    } else {\n      endIdx++;\n    }\n  }\n  return rooms;\n}`,
      optimalTimeComplexity: "O(N log N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function minMeetingRooms(intervals) {\n  // Brute force room allocation checking pairwise\n  intervals.sort((a, b) => a[0] - b[0]);\n  const rooms = [];\n  for (const [start, end] of intervals) {\n    let placed = false;\n    for (let r = 0; r < rooms.length; r++) {\n      if (rooms[r] <= start) {\n        rooms[r] = end;\n        placed = true;\n        break;\n      }\n    }\n    if (!placed) rooms.push(end);\n  }\n  return rooms.length;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Counting overlapping pairs rather than concurrent active intervals",
        "Not considering that meetings can be chained in the same room when start >= previous end"
      ],
      hints: [
        "Notice that a room is required whenever a meeting starts before the earliest ending meeting finishes.",
        "Sort start times and end times separately.",
        "Advance start pointer and increment rooms needed; when start >= earliest end, advance end pointer."
      ],
      oracleFn: (intervals: number[][]) => {
        if (!intervals.length) return 0;
        const starts = intervals.map(x => x[0]).sort((a, b) => a - b);
        const ends = intervals.map(x => x[1]).sort((a, b) => a - b);
        let rooms = 0;
        let endIdx = 0;
        for (let i = 0; i < starts.length; i++) {
          if (starts[i] < ends[endIdx]) {
            rooms++;
          } else {
            endIdx++;
          }
        }
        return rooms;
      },
      testCases: {
        functional: [
          [[[0, 30], [5, 10], [15, 20]]],
          [[[7, 10], [2, 4]]],
          [[[1, 4], [2, 5], [7, 9]]],
          [[[1, 5], [5, 10], [10, 15]]]
        ],
        boundary: [
          [[[1, 10]]],
          [[[1, 2], [2, 3], [3, 4], [4, 5]]],
          [[[1, 10], [1, 10], [1, 10]]]
        ],
        adversarial: [
          [[[1, 10], [2, 7], [3, 19], [8, 12], [10, 20], [11, 30]]],
          [[[9, 14], [5, 6], [3, 5], [12, 19]]],
          [[[1, 4], [2, 3], [3, 5], [4, 6]]]
        ],
        stress: [
          [Array.from({ length: 400 }, (_, i) => [i, i + 100])],
          [Array.from({ length: 400 }, (_, i) => [i * 2, i * 2 + 1])]
        ]
      }
    }),

    // 173. Minimum Number of Arrows to Burst Balloons
    createProblem({
      num: 173,
      title: "Minimum Number of Arrows to Burst Balloons",
      slug: "minimum-number-of-arrows-to-burst-balloons",
      level: 8,
      difficulty: "MEDIUM",
      topic: "Greedy / Intervals",
      patternSlug: "intervals-greedy",
      estimatedTimeMin: 20,
      statement: "There are spherical balloons taped to a flat wall represented by the XY-plane. For each balloon, you are given a 2D integer array `points` where `points[i] = [x_start, x_end]` represents a balloon whose horizontal diameter stretches between `x_start` and `x_end`.\n\nAn arrow can be shot up exactly vertically from different points along the x-axis. A balloon with `[x_start, x_end]` is burst by an arrow shot at `x` if `x_start <= x <= x_end`. Return the minimum number of arrows that must be shot to burst all balloons.",
      functionName: "findMinArrowShots",
      parameters: [{ name: "points", type: "number[][]", description: "Array of balloon boundaries [x_start, x_end]" }],
      returnType: "number",
      constraints: ["1 <= points.length <= 10^5", "points[i].length == 2", "-2^31 <= x_start < x_end <= 2^31 - 1"],
      examples: [
        {
          input: "points = [[10,16],[2,8],[1,6],[7,12]]",
          output: "2",
          explanation: "Shoot arrow at x = 6 (bursting [2,8] and [1,6]) and x = 11 (bursting [10,16] and [7,12])."
        },
        {
          input: "points = [[1,2],[3,4],[5,6],[7,8]]",
          output: "4",
          explanation: "No balloons overlap, so 4 separate arrows are required."
        },
        {
          input: "points = [[1,2],[2,3],[3,4],[4,5]]",
          output: "2",
          explanation: "Shoot at x = 2 (bursts [1,2],[2,3]) and x = 4 (bursts [3,4],[4,5])."
        },
        {
          input: "points = [[-2147483646,-2147483645],[2147483646,2147483647]]",
          output: "2",
          explanation: "Extreme 32-bit signed integers require 2 arrows."
        }
      ],
      optimalSolution: `function findMinArrowShots(points) {\n  if (points.length <= 1) return points.length;\n  points.sort((a, b) => a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0);\n  let arrows = 1;\n  let arrowPos = points[0][1];\n  for (let i = 1; i < points.length; i++) {\n    if (points[i][0] > arrowPos) {\n      arrows++;\n      arrowPos = points[i][1];\n    }\n  }\n  return arrows;\n}`,
      optimalTimeComplexity: "O(N log N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function findMinArrowShots(points) {\n  // Sorting by start and intersecting intervals\n  points.sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);\n  let arrows = 1;\n  let end = points[0][1];\n  for (let i = 1; i < points.length; i++) {\n    if (points[i][0] <= end) {\n      end = Math.min(end, points[i][1]);\n    } else {\n      arrows++;\n      end = points[i][1];\n    }\n  }\n  return arrows;\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: [
        "Integer overflow subtraction `a[1] - b[1]` when values are near 32-bit integer limits",
        "Shooting arrow at start coordinate instead of greedy end coordinate"
      ],
      hints: [
        "Sort the balloons by their end coordinate.",
        "Greedily shoot an arrow at the end coordinate of the first unburst balloon.",
        "Any subsequent balloon starting at or before this arrow position will be burst simultaneously."
      ],
      oracleFn: (points: number[][]) => {
        if (!points || points.length <= 1) return points ? points.length : 0;
        const sorted = [...points].sort((a, b) => (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0));
        let arrows = 1;
        let pos = sorted[0][1];
        for (let i = 1; i < sorted.length; i++) {
          if (sorted[i][0] > pos) {
            arrows++;
            pos = sorted[i][1];
          }
        }
        return arrows;
      },
      testCases: {
        functional: [
          [[[10, 16], [2, 8], [1, 6], [7, 12]]],
          [[[1, 2], [3, 4], [5, 6], [7, 8]]],
          [[[1, 2], [2, 3], [3, 4], [4, 5]]],
          [[[-2147483646, -2147483645], [2147483646, 2147483647]]]
        ],
        boundary: [
          [[[1, 5]]],
          [[[1, 10], [2, 9], [3, 8], [4, 7]]],
          [[[-10, -5], [-5, 0], [0, 5]]]
        ],
        adversarial: [
          [[[1, 5], [2, 3], [3, 4], [4, 5]]],
          [[[9, 12], [1, 10], [4, 11], [8, 12], [3, 9], [6, 9], [6, 7]]],
          [[[3, 9], [7, 12], [3, 8], [6, 8], [9, 10], [2, 9], [0, 9], [3, 9], [0, 6], [2, 8]]]
        ],
        stress: [
          [Array.from({ length: 400 }, (_, i) => [i, i + 5])],
          [Array.from({ length: 400 }, (_, i) => [i * 2, i * 2 + 1])]
        ]
      }
    }),

    // 174. Assign Cookies
    createProblem({
      num: 174,
      title: "Assign Cookies",
      slug: "assign-cookies",
      level: 8,
      difficulty: "EASY",
      topic: "Greedy",
      patternSlug: "intervals-greedy",
      estimatedTimeMin: 15,
      statement: "Assume you are an awesome parent and want to give your children some cookies. But, you should give each child at most one cookie.\n\nEach child `i` has a greed factor `g[i]`, which is the minimum size of a cookie that the child will be content with; and each cookie `j` has a size `s[j]`. If `s[j] >= g[i]`, we can assign the cookie `j` to the child `i`, and the child `i` will be content. Your goal is to maximize the number of your content children and output the maximum number.",
      functionName: "findContentChildren",
      parameters: [
        { name: "g", type: "number[]", description: "Greed factor of children" },
        { name: "s", type: "number[]", description: "Sizes of available cookies" }
      ],
      returnType: "number",
      constraints: ["1 <= g.length <= 3 * 10^4", "0 <= s.length <= 3 * 10^4", "1 <= g[i], s[j] <= 2^31 - 1"],
      examples: [
        { input: "g = [1,2,3], s = [1,1]", output: "1", explanation: "Only child 1 (greed 1) can be content with cookie size 1." },
        { input: "g = [1,2], s = [1,2,3]", output: "2", explanation: "Both children can be content." },
        { input: "g = [3,4,5], s = [1,2,2]", output: "0", explanation: "No cookie is large enough for any child." },
        { input: "g = [10,9,8,7], s = [5,6,7,8]", output: "2", explanation: "Cookies 7 and 8 satisfy children with greed 7 and 8." }
      ],
      optimalSolution: `function findContentChildren(g, s) {\n  g.sort((a, b) => a - b);\n  s.sort((a, b) => a - b);\n  let child = 0, cookie = 0;\n  while (child < g.length && cookie < s.length) {\n    if (s[cookie] >= g[child]) child++;\n    cookie++;\n  }\n  return child;\n}`,
      optimalTimeComplexity: "O(N log N + M log M)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function findContentChildren(g, s) {\n  g.sort((a, b) => a - b);\n  const used = new Array(s.length).fill(false);\n  let count = 0;\n  for (let i = 0; i < g.length; i++) {\n    for (let j = 0; j < s.length; j++) {\n      if (!used[j] && s[j] >= g[i]) {\n        used[j] = true;\n        count++;\n        break;\n      }\n    }\n  }\n  return count;\n}`,
      suboptimalTimeComplexity: "O(N * M)",
      suboptimalSpaceComplexity: "O(M)",
      commonMistakes: [
        "Assigning a large cookie to a child with tiny greed when a smaller cookie would satisfy them",
        "Not sorting both arrays before applying two pointers"
      ],
      hints: [
        "Greedily satisfy the least greedy children with the smallest possible sufficient cookie.",
        "Sort both `g` and `s` in ascending order.",
        "Advance cookie pointer on every step; advance child pointer only when satisfied."
      ],
      oracleFn: (g: number[], s: number[]) => {
        const sortedG = [...g].sort((a, b) => a - b);
        const sortedS = [...s].sort((a, b) => a - b);
        let child = 0;
        let cookie = 0;
        while (child < sortedG.length && cookie < sortedS.length) {
          if (sortedS[cookie] >= sortedG[child]) child++;
          cookie++;
        }
        return child;
      },
      testCases: {
        functional: [
          [[1, 2, 3], [1, 1]],
          [[1, 2], [1, 2, 3]],
          [[3, 4, 5], [1, 2, 2]],
          [[10, 9, 8, 7], [5, 6, 7, 8]]
        ],
        boundary: [
          [[1], []],
          [[1], [1]],
          [[5], [10]]
        ],
        adversarial: [
          [[1, 2, 3], [3]],
          [[2, 3, 4], [1, 1, 1, 1, 10]],
          [[1, 5, 10], [2, 4, 6, 8, 10]]
        ],
        stress: [
          [Array.from({ length: 500 }, (_, i) => i + 1), Array.from({ length: 500 }, (_, i) => i + 1)],
          [Array.from({ length: 500 }, () => 100), Array.from({ length: 500 }, () => 99)]
        ]
      }
    }),

    // 175. Lemonade Change
    createProblem({
      num: 175,
      title: "Lemonade Change",
      slug: "lemonade-change",
      level: 8,
      difficulty: "EASY",
      topic: "Greedy",
      patternSlug: "intervals-greedy",
      estimatedTimeMin: 15,
      statement: "At a lemonade stand, each lemonade costs `$5`. Customers are standing in a queue to buy from you and order one at a time. Each customer will only buy one lemonade and pay with either a `$5`, `$10`, or `$20` bill. You must provide the correct change to each customer so that the net transaction is that the customer pays `$5`.\n\nNote that you do not have any change in hand at first. Return `true` if you can provide every customer with the correct change, or `false` otherwise.",
      functionName: "lemonadeChange",
      parameters: [{ name: "bills", type: "number[]", description: "Sequence of bills paid by customers" }],
      returnType: "boolean",
      constraints: ["1 <= bills.length <= 10^5", "bills[i] is either 5, 10, or 20"],
      examples: [
        {
          input: "bills = [5,5,5,10,20]",
          output: "true",
          explanation: "Collect 3 $5 bills. Give $5 change for the $10 bill. Give $10 + $5 change for the $20 bill."
        },
        {
          input: "bills = [5,5,10,10,20]",
          output: "false",
          explanation: "For the two $10 bills we give two $5 bills. For the $20 bill we only have a $10 bill and no $5 bills left, so we cannot make $15 change."
        },
        {
          input: "bills = [5,5,5,20]",
          output: "true",
          explanation: "Give three $5 bills as change for the $20 bill."
        },
        {
          input: "bills = [10]",
          output: "false",
          explanation: "First customer pays $10 with zero change available."
        }
      ],
      optimalSolution: `function lemonadeChange(bills) {\n  let five = 0, ten = 0;\n  for (const b of bills) {\n    if (b === 5) {\n      five++;\n    } else if (b === 10) {\n      if (five === 0) return false;\n      five--;\n      ten++;\n    } else {\n      if (ten > 0 && five > 0) {\n        ten--;\n        five--;\n      } else if (five >= 3) {\n        five -= 3;\n      } else {\n        return false;\n      }\n    }\n  }\n  return true;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function lemonadeChange(bills) {\n  // Using an array to track bills\n  const cash = [];\n  for (const b of bills) {\n    if (b === 5) cash.push(5);\n    else if (b === 10) {\n      const idx = cash.indexOf(5);\n      if (idx === -1) return false;\n      cash.splice(idx, 1);\n      cash.push(10);\n    } else {\n      // 20\n      const tIdx = cash.indexOf(10);\n      const fIdx = cash.indexOf(5);\n      if (tIdx !== -1 && fIdx !== -1) {\n        cash.splice(Math.max(tIdx, fIdx), 1);\n        cash.splice(Math.min(tIdx, fIdx), 1);\n      } else {\n        let fives = cash.filter(x => x === 5).length;\n        if (fives < 3) return false;\n        for (let k = 0; k < 3; k++) cash.splice(cash.indexOf(5), 1);\n      }\n    }\n  }\n  return true;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Giving three $5 bills instead of one $10 and one $5 when giving change for $20 (keeping $5 bills is more versatile)",
        "Tracking $20 bills which can never be used as change"
      ],
      hints: [
        "Count only $5 and $10 bills because $20 bills can never be used as change.",
        "For a $10 bill, you must return a $5 bill.",
        "For a $20 bill, prefer giving $10 + $5 over three $5s, because $5 bills are strictly more flexible."
      ],
      oracleFn: (bills: number[]) => {
        let five = 0;
        let ten = 0;
        for (const b of bills) {
          if (b === 5) five++;
          else if (b === 10) {
            if (five === 0) return false;
            five--;
            ten++;
          } else {
            if (ten > 0 && five > 0) {
              ten--;
              five--;
            } else if (five >= 3) {
              five -= 3;
            } else {
              return false;
            }
          }
        }
        return true;
      },
      testCases: {
        functional: [
          [[5, 5, 5, 10, 20]],
          [[5, 5, 10, 10, 20]],
          [[5, 5, 5, 20]],
          [[10]]
        ],
        boundary: [
          [[5]],
          [[20]],
          [[5, 10]]
        ],
        adversarial: [
          [[5, 5, 10, 20, 5, 5, 5, 5, 5, 5, 5, 5, 5, 10, 5, 5, 20, 5, 20, 5]],
          [[5, 5, 5, 10, 5, 5, 10, 10, 20, 20]],
          [[5, 5, 5, 5, 20, 20, 5, 5, 20, 5]]
        ],
        stress: [
          [Array.from({ length: 1000 }, () => 5)],
          [Array.from({ length: 600 }, (_, i) => i % 2 === 0 ? 5 : 10)]
        ]
      }
    }),

    // 176. Jump Game
    createProblem({
      num: 176,
      title: "Jump Game",
      slug: "jump-game",
      level: 8,
      difficulty: "MEDIUM",
      topic: "Greedy",
      patternSlug: "intervals-greedy",
      estimatedTimeMin: 20,
      statement: "You are given an integer array `nums`. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.\n\nReturn `true` if you can reach the last index, or `false` otherwise.",
      functionName: "canJump",
      parameters: [{ name: "nums", type: "number[]", description: "Array of jump capacities" }],
      returnType: "boolean",
      constraints: ["1 <= nums.length <= 10^4", "0 <= nums[i] <= 10^5"],
      examples: [
        {
          input: "nums = [2,3,1,1,4]",
          output: "true",
          explanation: "Jump 1 step from index 0 to 1, then 3 steps to the last index."
        },
        {
          input: "nums = [3,2,1,0,4]",
          output: "false",
          explanation: "You will always arrive at index 3 no matter what. Its maximum jump length is 0, making reaching the end impossible."
        },
        {
          input: "nums = [0]",
          output: "true",
          explanation: "Already at the last index."
        },
        {
          input: "nums = [2,0,0]",
          output: "true",
          explanation: "Jump 2 steps directly to last index."
        }
      ],
      optimalSolution: `function canJump(nums) {\n  let maxReach = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (i > maxReach) return false;\n    maxReach = Math.max(maxReach, i + nums[i]);\n    if (maxReach >= nums.length - 1) return true;\n  }\n  return true;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function canJump(nums) {\n  // Top-down DP or BFS\n  const memo = new Array(nums.length).fill(null);\n  function dfs(pos) {\n    if (pos >= nums.length - 1) return true;\n    if (memo[pos] !== null) return memo[pos];\n    const furthest = Math.min(pos + nums[pos], nums.length - 1);\n    for (let next = furthest; next > pos; next--) {\n      if (dfs(next)) return (memo[pos] = true);\n    }\n    return (memo[pos] = false);\n  }\n  return dfs(0);\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Continuing loop past the point where current index exceeds max reachable index",
        "Overcomplicating with dynamic programming when a single greedy reach tracker is O(1) space"
      ],
      hints: [
        "Maintain the furthest index `maxReach` you can visit so far.",
        "If you reach an index `i` that is greater than `maxReach`, you are stuck.",
        "If `maxReach >= n - 1`, return true."
      ],
      oracleFn: (nums: number[]) => {
        let maxReach = 0;
        for (let i = 0; i < nums.length; i++) {
          if (i > maxReach) return false;
          maxReach = Math.max(maxReach, i + nums[i]);
          if (maxReach >= nums.length - 1) return true;
        }
        return true;
      },
      testCases: {
        functional: [
          [[2, 3, 1, 1, 4]],
          [[3, 2, 1, 0, 4]],
          [[0]],
          [[2, 0, 0]]
        ],
        boundary: [
          [[1]],
          [[0, 1]],
          [[2, 5, 0, 0]]
        ],
        adversarial: [
          [[1, 1, 2, 2, 0, 1, 1]],
          [[5, 9, 3, 2, 1, 0, 2, 3, 3, 1, 0, 0]],
          [[1, 0, 1, 0]]
        ],
        stress: [
          [Array.from({ length: 500 }, () => 1)],
          [[...Array.from({ length: 400 }, () => 2), 0, 1]]
        ]
      }
    }),

    // 177. Jump Game II
    createProblem({
      num: 177,
      title: "Jump Game II",
      slug: "jump-game-ii",
      level: 8,
      difficulty: "MEDIUM",
      topic: "Greedy",
      patternSlug: "intervals-greedy",
      estimatedTimeMin: 25,
      statement: "You are given a 0-indexed array of integers `nums` of length `n`. You are initially positioned at `nums[0]`.\n\nEach element `nums[i]` represents the maximum length of a forward jump from index `i`. Return the minimum number of jumps to reach `nums[n - 1]`. The test cases are generated such that you can always reach `nums[n - 1]`.",
      functionName: "jump",
      parameters: [{ name: "nums", type: "number[]", description: "Array of jump capacities" }],
      returnType: "number",
      constraints: ["1 <= nums.length <= 10^4", "0 <= nums[i] <= 1000"],
      examples: [
        {
          input: "nums = [2,3,1,1,4]",
          output: "2",
          explanation: "Jump 1 step from index 0 to 1, then 3 steps to the last index."
        },
        {
          input: "nums = [2,3,0,1,4]",
          output: "2",
          explanation: "Jump from index 0 to 1, then jump to last index."
        },
        {
          input: "nums = [1,2,3]",
          output: "2",
          explanation: "Jump from 0 to 1, then 1 to 2."
        },
        {
          input: "nums = [0]",
          output: "0",
          explanation: "Already at last index, 0 jumps needed."
        }
      ],
      optimalSolution: `function jump(nums) {\n  let jumps = 0, curEnd = 0, curFarthest = 0;\n  for (let i = 0; i < nums.length - 1; i++) {\n    curFarthest = Math.max(curFarthest, i + nums[i]);\n    if (i === curEnd) {\n      jumps++;\n      curEnd = curFarthest;\n      if (curEnd >= nums.length - 1) break;\n    }\n  }\n  return jumps;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function jump(nums) {\n  const dp = new Array(nums.length).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 0; i < nums.length; i++) {\n    for (let j = 1; j <= nums[i] && i + j < nums.length; j++) {\n      dp[i + j] = Math.min(dp[i + j], dp[i] + 1);\n    }\n  }\n  return dp[nums.length - 1];\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Iterating up to `nums.length - 1` inclusive when deciding to make a jump, which adds an unnecessary jump",
        "Using BFS / DP creating unnecessary O(N) space or O(N^2) time"
      ],
      hints: [
        "Think of this as BFS by levels where each level is the range of indices reachable with `k` jumps.",
        "Track `curEnd` (boundary of current jump) and `curFarthest` (furthest index reachable for next jump).",
        "When `i` reaches `curEnd`, you must take another jump, updating `curEnd = curFarthest`."
      ],
      oracleFn: (nums: number[]) => {
        let jumps = 0;
        let curEnd = 0;
        let curFarthest = 0;
        for (let i = 0; i < nums.length - 1; i++) {
          curFarthest = Math.max(curFarthest, i + nums[i]);
          if (i === curEnd) {
            jumps++;
            curEnd = curFarthest;
            if (curEnd >= nums.length - 1) break;
          }
        }
        return jumps;
      },
      testCases: {
        functional: [
          [[2, 3, 1, 1, 4]],
          [[2, 3, 0, 1, 4]],
          [[1, 2, 3]],
          [[0]]
        ],
        boundary: [
          [[1]],
          [[7, 0, 9, 6, 9, 6, 1, 7, 9, 0, 1, 2, 9, 0, 3]],
          [[1, 1, 1, 1]]
        ],
        adversarial: [
          [[10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 0]],
          [[2, 1, 1, 1, 1]],
          [[3, 4, 0, 1, 0, 0, 3, 0]]
        ],
        stress: [
          [Array.from({ length: 500 }, () => 1)],
          [Array.from({ length: 500 }, (_, i) => 500 - i)]
        ]
      }
    }),

    // 178. Gas Station
    createProblem({
      num: 178,
      title: "Gas Station",
      slug: "gas-station",
      level: 8,
      difficulty: "MEDIUM",
      topic: "Greedy",
      patternSlug: "intervals-greedy",
      estimatedTimeMin: 25,
      statement: "There are `n` gas stations along a circular route, where the amount of gas at the `i-th` station is `gas[i]`.\n\nYou have a car with an unlimited gas tank and it costs `cost[i]` of gas to travel from the `i-th` station to its next `(i + 1)-th` station. You begin the journey with an empty tank at one of the gas stations.\n\nGiven two integer arrays `gas` and `cost`, return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return `-1`. If there exists a solution, it is guaranteed to be unique.",
      functionName: "canCompleteCircuit",
      parameters: [
        { name: "gas", type: "number[]", description: "Gas available at each station" },
        { name: "cost", type: "number[]", description: "Cost to travel to next station" }
      ],
      returnType: "number",
      constraints: ["n == gas.length == cost.length", "1 <= n <= 10^5", "0 <= gas[i], cost[i] <= 10^4"],
      examples: [
        {
          input: "gas = [1,2,3,4,5], cost = [3,4,5,1,2]",
          output: "3",
          explanation: "Start at station 3 (index 3). Fill with 4 gas, cost 1 -> tank 3. At station 4, add 5, cost 2 -> tank 6. At 0, add 1, cost 3 -> tank 4. At 1, add 2, cost 4 -> tank 2. At 2, add 3, cost 5 -> tank 0. Back at station 3!"
        },
        {
          input: "gas = [2,3,4], cost = [3,4,3]",
          output: "-1",
          explanation: "Total gas 9 < total cost 10, impossible to complete circuit."
        },
        {
          input: "gas = [2], cost = [2]",
          output: "0",
          explanation: "Single station with gas equal to cost."
        },
        {
          input: "gas = [5,1,2,3,4], cost = [4,4,1,5,1]",
          output: "4",
          explanation: "Index 4 allows successfully completing the loop."
        }
      ],
      optimalSolution: `function canCompleteCircuit(gas, cost) {\n  let totalTank = 0, currTank = 0, startStation = 0;\n  for (let i = 0; i < gas.length; i++) {\n    const net = gas[i] - cost[i];\n    totalTank += net;\n    currTank += net;\n    if (currTank < 0) {\n      startStation = i + 1;\n      currTank = 0;\n    }\n  }\n  return totalTank >= 0 ? startStation : -1;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function canCompleteCircuit(gas, cost) {\n  const n = gas.length;\n  for (let start = 0; start < n; start++) {\n    let tank = 0;\n    let possible = true;\n    for (let step = 0; step < n; step++) {\n      const i = (start + step) % n;\n      tank += gas[i] - cost[i];\n      if (tank < 0) {\n        possible = false;\n        break;\n      }\n    }\n    if (possible) return start;\n  }\n  return -1;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: [
        "Simulating starting from every index O(N^2) resulting in TLE",
        "Not realizing that if sum(gas) < sum(cost), it is mathematically impossible to complete the loop"
      ],
      hints: [
        "If total gas is less than total cost, completing the circuit is impossible.",
        "If you run out of gas between station `A` and station `B`, then no station between `A` and `B` can be the starting station.",
        "Reset current tank and set `start = i + 1` whenever `currTank < 0`."
      ],
      oracleFn: (gas: number[], cost: number[]) => {
        let total = 0;
        let curr = 0;
        let start = 0;
        for (let i = 0; i < gas.length; i++) {
          const net = gas[i] - cost[i];
          total += net;
          curr += net;
          if (curr < 0) {
            start = i + 1;
            curr = 0;
          }
        }
        return total >= 0 ? start : -1;
      },
      testCases: {
        functional: [
          [[1, 2, 3, 4, 5], [3, 4, 5, 1, 2]],
          [[2, 3, 4], [3, 4, 3]],
          [[2], [2]],
          [[5, 1, 2, 3, 4], [4, 4, 1, 5, 1]]
        ],
        boundary: [
          [[5], [6]],
          [[6], [5]],
          [[0, 0, 0, 2], [0, 0, 1, 0]]
        ],
        adversarial: [
          [[3, 1, 1], [1, 2, 2]],
          [[1, 2, 3, 4, 5, 5, 70], [2, 3, 4, 3, 9, 6, 2]],
          [[4, 5, 2, 6, 5, 3], [3, 2, 7, 3, 2, 9]]
        ],
        stress: [
          [Array.from({ length: 500 }, () => 10), Array.from({ length: 500 }, () => 10)],
          [[...Array.from({ length: 499 }, () => 1), 500], Array.from({ length: 500 }, () => 2)]
        ]
      }
    }),

    // 179. Hand of Straights
    createProblem({
      num: 179,
      title: "Hand of Straights",
      slug: "hand-of-straights",
      level: 8,
      difficulty: "MEDIUM",
      topic: "Greedy / Hash Table",
      patternSlug: "intervals-greedy",
      estimatedTimeMin: 20,
      statement: "Alice has some number of cards and she wants to rearrange the cards into groups so that each group is of size `groupSize`, and consists of `groupSize` consecutive cards.\n\nGiven an integer array `hand` where `hand[i]` is the value written on the `i-th` card and an integer `groupSize`, return `true` if she can rearrange the cards, or `false` otherwise.",
      functionName: "isNStraightHand",
      parameters: [
        { name: "hand", type: "number[]", description: "Array of card values" },
        { name: "groupSize", type: "number", description: "Target group size" }
      ],
      returnType: "boolean",
      constraints: ["1 <= hand.length <= 10^4", "0 <= hand[i] <= 10^9", "1 <= groupSize <= hand.length"],
      examples: [
        {
          input: "hand = [1,2,3,6,2,3,4,7,8], groupSize = 3",
          output: "true",
          explanation: "Alice can rearrange the cards into [1,2,3], [2,3,4], [6,7,8]."
        },
        {
          input: "hand = [1,2,3,4,5], groupSize = 4",
          output: "false",
          explanation: "Alice cannot rearrange the cards into groups of 4."
        },
        {
          input: "hand = [8,10,12], groupSize = 3",
          output: "false",
          explanation: "Cards are not consecutive."
        },
        {
          input: "hand = [1], groupSize = 1",
          output: "true",
          explanation: "Group size of 1 is always trivially satisfied."
        }
      ],
      optimalSolution: `function isNStraightHand(hand, groupSize) {\n  if (hand.length % groupSize !== 0) return false;\n  if (groupSize === 1) return true;\n  const count = new Map();\n  for (const card of hand) count.set(card, (count.get(card) || 0) + 1);\n  hand.sort((a, b) => a - b);\n  for (const card of hand) {\n    const c = count.get(card);\n    if (c > 0) {\n      for (let i = 0; i < groupSize; i++) {\n        const needed = card + i;\n        const cur = count.get(needed) || 0;\n        if (cur < c) return false;\n        count.set(needed, cur - c);\n      }\n    }\n  }\n  return true;\n}`,
      optimalTimeComplexity: "O(N log N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function isNStraightHand(hand, groupSize) {\n  if (hand.length % groupSize !== 0) return false;\n  hand.sort((a, b) => a - b);\n  while (hand.length > 0) {\n    const first = hand[0];\n    for (let i = 0; i < groupSize; i++) {\n      const idx = hand.indexOf(first + i);\n      if (idx === -1) return false;\n      hand.splice(idx, 1);\n    }\n  }\n  return true;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: [
        "Forgetting early return `hand.length % groupSize !== 0`",
        "Decrementing count one card at a time rather than batching by `c` leading to slower executions"
      ],
      hints: [
        "If `hand.length % groupSize !== 0`, immediately return false.",
        "Count card frequencies with a hash map.",
        "Sort the unique cards. The smallest remaining card must be the start of a consecutive group of length `groupSize`."
      ],
      oracleFn: (hand: number[], groupSize: number) => {
        if (hand.length % groupSize !== 0) return false;
        if (groupSize === 1) return true;
        const count = new Map<number, number>();
        for (const card of hand) count.set(card, (count.get(card) || 0) + 1);
        const sorted = [...hand].sort((a, b) => a - b);
        for (const card of sorted) {
          const c = count.get(card) || 0;
          if (c > 0) {
            for (let i = 0; i < groupSize; i++) {
              const needed = card + i;
              const cur = count.get(needed) || 0;
              if (cur < c) return false;
              count.set(needed, cur - c);
            }
          }
        }
        return true;
      },
      testCases: {
        functional: [
          [[1, 2, 3, 6, 2, 3, 4, 7, 8], 3],
          [[1, 2, 3, 4, 5], 4],
          [[8, 10, 12], 3],
          [[1], 1]
        ],
        boundary: [
          [[1, 2, 3], 3],
          [[1, 2, 3, 4], 2],
          [[5, 5, 5], 3]
        ],
        adversarial: [
          [[1, 1, 2, 2, 3, 3], 3],
          [[1, 2, 3, 4, 5, 6, 7, 8], 2],
          [[0, 1], 2]
        ],
        stress: [
          [Array.from({ length: 600 }, (_, i) => Math.floor(i / 3) + 1), 3],
          [Array.from({ length: 500 }, (_, i) => i), 5]
        ]
      }
    }),

    // 180. Partitioning Into Minimum Number Of Deci-Binary Numbers
    createProblem({
      num: 180,
      title: "Partitioning Into Minimum Number Of Deci-Binary Numbers",
      slug: "partitioning-into-minimum-number-of-deci-binary-numbers",
      level: 8,
      difficulty: "MEDIUM",
      topic: "Greedy / Math",
      patternSlug: "intervals-greedy",
      estimatedTimeMin: 10,
      statement: "A decimal number is called deci-binary if each of its digits is either `0` or `1` without any leading zeros. For example, `101` and `1100` are deci-binary, while `112` and `3001` are not.\n\nGiven a string `n` that represents a positive decimal integer, return the minimum number of positive deci-binary numbers needed so that they sum up to `n`.",
      functionName: "minPartitions",
      parameters: [{ name: "n", type: "string", description: "Positive decimal integer as string" }],
      returnType: "number",
      constraints: ["1 <= n.length <= 10^5", "n consists only of digits", "n does not contain any leading zeros and represents a positive integer"],
      examples: [
        { input: 'n = "32"', output: "3", explanation: "10 + 11 + 11 = 32. Max digit is 3." },
        { input: 'n = "82734"', output: "8", explanation: "Max digit is 8, which requires at least 8 deci-binary numbers." },
        { input: 'n = "27346209830709182346"', output: "9", explanation: "Max digit is 9." },
        { input: 'n = "1"', output: "1", explanation: "1 is already deci-binary." }
      ],
      optimalSolution: `function minPartitions(n) {\n  let maxDigit = 0;\n  for (let i = 0; i < n.length; i++) {\n    const d = n.charCodeAt(i) - 48;\n    if (d > maxDigit) {\n      maxDigit = d;\n      if (maxDigit === 9) return 9;\n    }\n  }\n  return maxDigit;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function minPartitions(n) {\n  return Math.max(...n.split('').map(Number));\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Attempting arithmetic big-integer operations instead of inspecting individual digit maximums",
        "Converting very large strings into BigInt or Number causing precision errors"
      ],
      hints: [
        "Each deci-binary number contributes at most 1 to any given digit place.",
        "To form a digit `d` at any position, you need at least `d` deci-binary numbers.",
        "The answer is simply the maximum digit present in `n`."
      ],
      oracleFn: (n: string) => {
        let max = 0;
        for (let i = 0; i < n.length; i++) {
          const d = n.charCodeAt(i) - 48;
          if (d > max) max = d;
        }
        return max;
      },
      testCases: {
        functional: [
          ["32"],
          ["82734"],
          ["27346209830709182346"],
          ["1"]
        ],
        boundary: [
          ["0"],
          ["9"],
          ["11111"]
        ],
        adversarial: [
          ["1000000000"],
          ["102030405060708090"],
          ["7777777"]
        ],
        stress: [
          ["8".repeat(1000)],
          ["123456789".repeat(150)]
        ]
      }
    }),

    // 181. Maximum Units on a Truck
    createProblem({
      num: 181,
      title: "Maximum Units on a Truck",
      slug: "maximum-units-on-a-truck",
      level: 8,
      difficulty: "EASY",
      topic: "Greedy / Sorting",
      patternSlug: "intervals-greedy",
      estimatedTimeMin: 15,
      statement: "You are assigned to put some amount of boxes onto one truck. You are given a 2D array `boxTypes`, where `boxTypes[i] = [numberOfBoxes_i, numberOfUnitsPerBox_i]`:\n- `numberOfBoxes_i` is the number of boxes of type `i`.\n- `numberOfUnitsPerBox_i` is the number of units in each box of the type `i`.\n\nYou are also given an integer `truckSize`, which is the maximum number of boxes that can be put on the truck. You can choose any boxes to put on the truck as long as the number of boxes does not exceed `truckSize`.\n\nReturn the maximum total number of units that can be put on the truck.",
      functionName: "maximumUnits",
      parameters: [
        { name: "boxTypes", type: "number[][]", description: "Array of [numberOfBoxes, unitsPerBox]" },
        { name: "truckSize", type: "number", description: "Maximum capacity in number of boxes" }
      ],
      returnType: "number",
      constraints: ["1 <= boxTypes.length <= 1000", "1 <= numberOfBoxes_i, numberOfUnitsPerBox_i <= 1000", "1 <= truckSize <= 10^6"],
      examples: [
        {
          input: "boxTypes = [[1,3],[2,2],[3,1]], truckSize = 4",
          output: "8",
          explanation: "Take 1 box with 3 units, 2 boxes with 2 units, and 1 box with 1 unit: 1*3 + 2*2 + 1*1 = 8 units."
        },
        {
          input: "boxTypes = [[5,10],[2,5],[4,7],[3,9]], truckSize = 10",
          output: "91",
          explanation: "5*10 + 3*9 + 2*7 = 50 + 27 + 14 = 91 units."
        },
        {
          input: "boxTypes = [[1,1]], truckSize = 0",
          output: "0",
          explanation: "Truck cannot carry any boxes."
        },
        {
          input: "boxTypes = [[3,5]], truckSize = 10",
          output: "15",
          explanation: "All 3 boxes fit: 3 * 5 = 15 units."
        }
      ],
      optimalSolution: `function maximumUnits(boxTypes, truckSize) {\n  boxTypes.sort((a, b) => b[1] - a[1]);\n  let totalUnits = 0;\n  for (const [count, units] of boxTypes) {\n    const take = Math.min(truckSize, count);\n    totalUnits += take * units;\n    truckSize -= take;\n    if (truckSize === 0) break;\n  }\n  return totalUnits;\n}`,
      optimalTimeComplexity: "O(N log N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function maximumUnits(boxTypes, truckSize) {\n  const expanded = [];\n  for (const [count, units] of boxTypes) {\n    for (let i = 0; i < count; i++) expanded.push(units);\n  }\n  expanded.sort((a, b) => b - a);\n  return expanded.slice(0, truckSize).reduce((acc, v) => acc + v, 0);\n}`,
      suboptimalTimeComplexity: "O(M log M) where M = sum(boxes)",
      suboptimalSpaceComplexity: "O(M)",
      commonMistakes: [
        "Sorting by box count instead of units per box",
        "Expanding all boxes into an array causing Memory Limit Exceeded"
      ],
      hints: [
        "Sort boxes in descending order of units per box (Fractional Knapsack greedy choice).",
        "Pick as many boxes of the highest-yield type as fit into the remaining truck capacity."
      ],
      oracleFn: (boxTypes: number[][], truckSize: number) => {
        const sorted = [...boxTypes].sort((a, b) => b[1] - a[1]);
        let total = 0;
        let rem = truckSize;
        for (const [count, units] of sorted) {
          const take = Math.min(rem, count);
          total += take * units;
          rem -= take;
          if (rem === 0) break;
        }
        return total;
      },
      testCases: {
        functional: [
          [[[1, 3], [2, 2], [3, 1]], 4],
          [[[5, 10], [2, 5], [4, 7], [3, 9]], 10],
          [[[1, 1]], 0],
          [[[3, 5]], 10]
        ],
        boundary: [
          [[[1, 10]], 1],
          [[[10, 1]], 5],
          [[[1, 100], [1, 200]], 1]
        ],
        adversarial: [
          [[[100, 1], [1, 100]], 1],
          [[[5, 10], [5, 10], [5, 10]], 7],
          [[[10, 5], [20, 4], [30, 3], [40, 2], [50, 1]], 45]
        ],
        stress: [
          [Array.from({ length: 400 }, (_, i) => [10, (i % 50) + 1]), 1000],
          [Array.from({ length: 500 }, (_, i) => [i + 1, 10]), 5000]
        ]
      }
    }),

    // 182. Queue Reconstruction by Height
    createProblem({
      num: 182,
      title: "Queue Reconstruction by Height",
      slug: "queue-reconstruction-by-height",
      level: 8,
      difficulty: "MEDIUM",
      topic: "Greedy / Sorting",
      patternSlug: "intervals-greedy",
      estimatedTimeMin: 25,
      statement: "You are given an array of people, `people`, which are the attributes of some people in a queue (not necessarily in order). Each `people[i] = [h_i, k_i]` represents the `i-th` person of height `h_i` with exactly `k_i` other people in front who have a height greater than or equal to `h_i`.\n\nReconstruct and return the queue that is represented by the input array `people`. The returned queue should be formatted as an array `queue`, where `queue[j] = [h_j, k_j]` is the attributes of the `j-th` person in the queue (`queue[0]` is the person at the front of the queue).",
      functionName: "reconstructQueue",
      parameters: [{ name: "people", type: "number[][]", description: "Array of [height, k] attributes" }],
      returnType: "number[][]",
      constraints: ["1 <= people.length <= 2000", "0 <= h_i <= 10^6", "0 <= k_i < people.length", "It is guaranteed that the queue can be reconstructed."],
      examples: [
        {
          input: "people = [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]",
          output: "[[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]",
          explanation: "Person [5,0] has 0 people taller/equal in front. Person [7,0] has 0. Person [5,2] has [5,0] and [7,0] in front, etc."
        },
        {
          input: "people = [[6,0],[5,0],[4,0],[3,2],[2,2],[1,4]]",
          output: "[[4,0],[5,0],[2,2],[3,2],[1,4],[6,0]]",
          explanation: "Valid reconstruction matching each individual's k constraint."
        },
        {
          input: "people = [[2,0],[1,1]]",
          output: "[[2,0],[1,1]]",
          explanation: "Person [2,0] is in front, person [1,1] has 1 person taller in front."
        },
        {
          input: "people = [[1,0]]",
          output: "[[1,0]]",
          explanation: "Single person queue."
        }
      ],
      optimalSolution: `function reconstructQueue(people) {\n  people.sort((a, b) => a[0] === b[0] ? a[1] - b[1] : b[0] - a[0]);\n  const result = [];\n  for (const p of people) {\n    result.splice(p[1], 0, p);\n  }\n  return result;\n}`,
      optimalTimeComplexity: "O(N^2)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function reconstructQueue(people) {\n  // Brute force permutation search\n  people.sort((a, b) => a[0] === b[0] ? a[1] - b[1] : b[0] - a[0]);\n  const queue = [];\n  for (let i = 0; i < people.length; i++) {\n    queue.splice(people[i][1], 0, people[i]);\n  }\n  return queue;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Sorting ascending by height which makes subsequent insertions disrupt previous k counts",
        "Sorting identical heights with wrong tiebreaker (must sort ascending by k for same height)"
      ],
      hints: [
        "Sort people by height descending.",
        "For people of the same height, sort by `k` ascending.",
        "Insert each person into the output array at index `k`. Since all previously placed people are taller, inserting at index `k` precisely satisfies their requirement."
      ],
      oracleFn: (people: number[][]) => {
        const sorted = [...people].sort((a, b) => a[0] === b[0] ? a[1] - b[1] : b[0] - a[0]);
        const res: number[][] = [];
        for (const p of sorted) {
          res.splice(p[1], 0, p);
        }
        return res;
      },
      testCases: {
        functional: [
          [[[7, 0], [4, 4], [7, 1], [5, 0], [6, 1], [5, 2]]],
          [[[6, 0], [5, 0], [4, 0], [3, 2], [2, 2], [1, 4]]],
          [[[2, 0], [1, 1]]],
          [[[1, 0]]]
        ],
        boundary: [
          [[[1, 0], [2, 0], [3, 0]]],
          [[[5, 2], [5, 1], [5, 0]]],
          [[[10, 0], [9, 1]]]
        ],
        adversarial: [
          [[[8, 2], [4, 2], [4, 5], [2, 0], [7, 2], [1, 4], [9, 0], [3, 1], [9, 1], [1, 0]]],
          [[[7, 0], [7, 1], [7, 2], [6, 0]]],
          [[[3, 0], [2, 0], [1, 0]]]
        ],
        stress: [
          [Array.from({ length: 300 }, (_, i) => [i + 1, 0])],
          [Array.from({ length: 300 }, (_, i) => [300 - i, i === 0 ? 0 : 1])]
        ]
      }
    }),

    // 183. Task Scheduler
    createProblem({
      num: 183,
      title: "Task Scheduler",
      slug: "task-scheduler",
      level: 8,
      difficulty: "MEDIUM",
      topic: "Greedy / Hash Table",
      patternSlug: "intervals-greedy",
      estimatedTimeMin: 25,
      statement: "Given a characters array `tasks`, representing the tasks a CPU needs to do, where each letter represents a different task. Tasks could be done in any order. Each task is done in one unit of time. For each unit of time, the CPU could complete either one task or just be idle.\n\nHowever, there is a non-negative integer `n` that represents the cooldown period between two same tasks (the same letter in the array), that is that there must be at least `n` units of time between any two same tasks.\n\nReturn the least number of units of times that the CPU will take to finish all the given tasks.",
      functionName: "leastInterval",
      parameters: [
        { name: "tasks", type: "string[]", description: "Array of task characters" },
        { name: "n", type: "number", description: "Cooldown period between identical tasks" }
      ],
      returnType: "number",
      constraints: ["1 <= tasks.length <= 10^4", "tasks[i] is upper-case English letter", "0 <= n <= 100"],
      examples: [
        {
          input: 'tasks = ["A","A","A","B","B","B"], n = 2',
          output: "8",
          explanation: "A -> B -> idle -> A -> B -> idle -> A -> B. Total 8 units."
        },
        {
          input: 'tasks = ["A","A","A","B","B","B"], n = 0',
          output: "6",
          explanation: "With cooldown 0, no idle time is needed. Total 6 units."
        },
        {
          input: 'tasks = ["A","A","A","A","A","A","B","C","D","E","F","G"], n = 2',
          output: "16",
          explanation: "Task A dominates: A -> B -> C -> A -> D -> E -> A -> F -> G -> A -> idle -> idle -> A -> idle -> idle -> A."
        },
        {
          input: 'tasks = ["A"], n = 5',
          output: "1",
          explanation: "Single task takes 1 unit."
        }
      ],
      optimalSolution: `function leastInterval(tasks, n) {\n  const freq = new Array(26).fill(0);\n  for (const t of tasks) freq[t.charCodeAt(0) - 65]++;\n  const maxFreq = Math.max(...freq);\n  let maxCount = 0;\n  for (const f of freq) {\n    if (f === maxFreq) maxCount++;\n  }\n  const emptySlots = (maxFreq - 1) * (n - (maxCount - 1));\n  const availableTasks = tasks.length - maxFreq * maxCount;\n  const idles = Math.max(0, emptySlots - availableTasks);\n  return tasks.length + idles;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function leastInterval(tasks, n) {\n  // Simulation with priority queue / map tracking available time\n  const freq = new Array(26).fill(0);\n  for (const t of tasks) freq[t.charCodeAt(0) - 65]++;\n  const nextAvail = new Array(26).fill(0);\n  let time = 0;\n  let remaining = tasks.length;\n  while (remaining > 0) {\n    let best = -1;\n    let maxF = 0;\n    for (let i = 0; i < 26; i++) {\n      if (freq[i] > 0 && nextAvail[i] <= time && freq[i] > maxF) {\n        maxF = freq[i];\n        best = i;\n      }\n    }\n    if (best !== -1) {\n      freq[best]--;\n      nextAvail[best] = time + n + 1;\n      remaining--;\n    }\n    time++;\n  }\n  return time;\n}`,
      suboptimalTimeComplexity: "O(time * 26)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: [
        "Simulating unit-by-unit when mathematical slot calculation is O(1) space and O(N) time",
        "Ignoring that `tasks.length` is a lower bound when idle time is negative"
      ],
      hints: [
        "Find the maximum frequency `maxFreq` of any task.",
        "Count how many tasks share this maximum frequency `maxCount`.",
        "The minimal layout structure has `(maxFreq - 1)` chunks of size `(n + 1)` plus `maxCount` tasks in the final chunk.",
        "The answer is `max(tasks.length, (maxFreq - 1) * (n + 1) + maxCount)`."
      ],
      oracleFn: (tasks: string[], n: number) => {
        const freq = new Array(26).fill(0);
        for (const t of tasks) freq[t.charCodeAt(0) - 65]++;
        const maxFreq = Math.max(...freq);
        let maxCount = 0;
        for (const f of freq) if (f === maxFreq) maxCount++;
        return Math.max(tasks.length, (maxFreq - 1) * (n + 1) + maxCount);
      },
      testCases: {
        functional: [
          [["A", "A", "A", "B", "B", "B"], 2],
          [["A", "A", "A", "B", "B", "B"], 0],
          [["A", "A", "A", "A", "A", "A", "B", "C", "D", "E", "F", "G"], 2],
          [["A"], 5]
        ],
        boundary: [
          [["A", "B", "C", "D"], 2],
          [["A", "A", "A"], 1],
          [["A", "A", "A"], 3]
        ],
        adversarial: [
          [["A", "A", "A", "B", "B", "B", "C", "C", "C", "D", "D", "E"], 2],
          [["A", "B", "C", "D", "E", "A", "B", "C", "D", "E"], 4],
          [["A", "A", "B", "B", "C", "C", "D", "D"], 2]
        ],
        stress: [
          [Array.from({ length: 600 }, (_, i) => String.fromCharCode(65 + (i % 6))), 2],
          [[...Array.from({ length: 500 }, () => "A"), ...Array.from({ length: 500 }, () => "B")], 10]
        ]
      }
    }),

    // 184. Candy
    createProblem({
      num: 184,
      title: "Candy",
      slug: "candy",
      level: 8,
      difficulty: "HARD",
      topic: "Greedy",
      patternSlug: "intervals-greedy",
      estimatedTimeMin: 30,
      statement: "There are `n` children standing in a line. Each child is assigned a rating value given in the integer array `ratings`.\n\nYou are giving candies to these children subjected to the following requirements:\n1. Each child must have at least one candy.\n2. Children with a higher rating get more candies than their neighbors.\n\nReturn the minimum number of candies you need to have to distribute the candies to the children.",
      functionName: "candy",
      parameters: [{ name: "ratings", type: "number[]", description: "Array of child rating scores" }],
      returnType: "number",
      constraints: ["n == ratings.length", "1 <= n <= 2 * 10^4", "0 <= ratings[i] <= 2 * 10^4"],
      examples: [
        {
          input: "ratings = [1,0,2]",
          output: "5",
          explanation: "Distribute candies: [2,1,2]."
        },
        {
          input: "ratings = [1,2,2]",
          output: "4",
          explanation: "Distribute candies: [1,2,1]. The third child has rating 2, which is not strictly higher than rating 2 of neighbor."
        },
        {
          input: "ratings = [1,3,2,2,1]",
          output: "7",
          explanation: "Distribute candies: [1,2,1,2,1]."
        },
        {
          input: "ratings = [1]",
          output: "1",
          explanation: "Single child gets 1 candy."
        }
      ],
      optimalSolution: `function candy(ratings) {\n  const n = ratings.length;\n  const candies = new Array(n).fill(1);\n  for (let i = 1; i < n; i++) {\n    if (ratings[i] > ratings[i - 1]) candies[i] = candies[i - 1] + 1;\n  }\n  for (let i = n - 2; i >= 0; i--) {\n    if (ratings[i] > ratings[i + 1]) candies[i] = Math.max(candies[i], candies[i + 1] + 1);\n  }\n  return candies.reduce((acc, c) => acc + c, 0);\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function candy(ratings) {\n  // Inefficient iterative relaxation\n  const n = ratings.length;\n  const candies = new Array(n).fill(1);\n  let changed = true;\n  while (changed) {\n    changed = false;\n    for (let i = 0; i < n; i++) {\n      if (i > 0 && ratings[i] > ratings[i - 1] && candies[i] <= candies[i - 1]) {\n        candies[i] = candies[i - 1] + 1;\n        changed = true;\n      }\n      if (i < n - 1 && ratings[i] > ratings[i + 1] && candies[i] <= candies[i + 1]) {\n        candies[i] = candies[i + 1] + 1;\n        changed = true;\n      }\n    }\n  }\n  return candies.reduce((a, b) => a + b, 0);\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Doing only a single left-to-right pass, missing right-to-left downward slopes",
        "Giving more candies when neighbors have equal ratings (equal ratings don't require strictly more candies)"
      ],
      hints: [
        "Satisfy the two neighbor conditions separately using two passes.",
        "Left-to-right pass: if `ratings[i] > ratings[i-1]`, set `candies[i] = candies[i-1] + 1`.",
        "Right-to-left pass: if `ratings[i] > ratings[i+1]`, update `candies[i] = max(candies[i], candies[i+1] + 1)`."
      ],
      oracleFn: (ratings: number[]) => {
        const n = ratings.length;
        const candies = new Array(n).fill(1);
        for (let i = 1; i < n; i++) {
          if (ratings[i] > ratings[i - 1]) candies[i] = candies[i - 1] + 1;
        }
        for (let i = n - 2; i >= 0; i--) {
          if (ratings[i] > ratings[i + 1]) candies[i] = Math.max(candies[i], candies[i + 1] + 1);
        }
        return candies.reduce((acc, c) => acc + c, 0);
      },
      testCases: {
        functional: [
          [[1, 0, 2]],
          [[1, 2, 2]],
          [[1, 3, 2, 2, 1]],
          [[1]]
        ],
        boundary: [
          [[1, 2]],
          [[2, 1]],
          [[3, 3, 3, 3]]
        ],
        adversarial: [
          [[1, 2, 3, 4, 5]],
          [[5, 4, 3, 2, 1]],
          [[1, 6, 10, 8, 7, 3, 2]]
        ],
        stress: [
          [Array.from({ length: 500 }, (_, i) => i % 10)],
          [Array.from({ length: 500 }, (_, i) => Math.abs(250 - i))]
        ]
      }
    }),

    // 185. Video Stitching
    createProblem({
      num: 185,
      title: "Video Stitching",
      slug: "video-stitching",
      level: 8,
      difficulty: "MEDIUM",
      topic: "Greedy / Intervals",
      patternSlug: "intervals-greedy",
      estimatedTimeMin: 25,
      statement: "You are given a series of video clips from a sporting event that lasted `time` seconds. These video clips can be represented with an array of clips where `clips[i] = [start_i, end_i]`.\n\nWe can cut these clips into segments freely. Return the minimum number of clips needed so that we can cut the clips into a list of segments to cover the entire sporting event `[0, time]`. If the task is impossible, return `-1`.",
      functionName: "videoStitching",
      parameters: [
        { name: "clips", type: "number[][]", description: "Array of video clip intervals" },
        { name: "time", type: "number", description: "Total duration to cover from 0 to time" }
      ],
      returnType: "number",
      constraints: ["1 <= clips.length <= 100", "0 <= start_i <= end_i <= 100", "1 <= time <= 100"],
      examples: [
        {
          input: "clips = [[0,2],[4,6],[8,10],[1,9],[1,5],[5,9]], time = 10",
          output: "3",
          explanation: "Pick [0,2], [1,9], and [8,10] to cover [0,10]."
        },
        {
          input: "clips = [[0,1],[1,2]], time = 5",
          output: "-1",
          explanation: "Clips only cover up to time 2, cannot reach 5."
        },
        {
          input: "clips = [[0,1],[6,8],[0,2],[5,6],[0,4],[0,3],[6,7],[1,3],[4,7],[1,4],[2,5],[2,6],[3,4],[4,5],[5,7],[6,9]], time = 9",
          output: "3",
          explanation: "Pick [0,4], [4,7], and [6,9] to cover [0,9]."
        },
        {
          input: "clips = [[0,5]], time = 5",
          output: "1",
          explanation: "Single clip covers [0,5] completely."
        }
      ],
      optimalSolution: `function videoStitching(clips, time) {\n  const maxReach = new Array(time + 1).fill(0);\n  for (const [start, end] of clips) {\n    if (start <= time) maxReach[start] = Math.max(maxReach[start], end);\n  }\n  let count = 0, curEnd = 0, farthest = 0;\n  for (let i = 0; i < time; i++) {\n    farthest = Math.max(farthest, maxReach[i]);\n    if (i === curEnd) {\n      if (farthest <= i) return -1;\n      count++;\n      curEnd = farthest;\n      if (curEnd >= time) return count;\n    }\n  }\n  return curEnd >= time ? count : -1;\n}`,
      optimalTimeComplexity: "O(time + clips.length)",
      optimalSpaceComplexity: "O(time)",
      suboptimalSolution: `function videoStitching(clips, time) {\n  // DP formulation: dp[t] = min clips to cover [0, t]\n  const dp = new Array(time + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let t = 1; t <= time; t++) {\n    for (const [s, e] of clips) {\n      if (s <= t && t <= e) {\n        dp[t] = Math.min(dp[t], dp[s] + 1);\n      }\n    }\n  }\n  return dp[time] === Infinity ? -1 : dp[time];\n}`,
      suboptimalTimeComplexity: "O(time * clips.length)",
      suboptimalSpaceComplexity: "O(time)",
      commonMistakes: [
        "Not returning -1 when no clip starts at 0 or when a gap exists",
        "Allowing intervals that start after `curEnd` without properly triggering the next segment"
      ],
      hints: [
        "Transform this into Jump Game II: for each time `t`, what is the furthest reach of a clip starting at `t`?",
        "Greedily pick the clip that extends coverage the furthest while overlapping current covered range."
      ],
      oracleFn: (clips: number[][], time: number) => {
        const maxReach = new Array(time + 1).fill(0);
        for (const [start, end] of clips) {
          if (start <= time) maxReach[start] = Math.max(maxReach[start], end);
        }
        let count = 0;
        let curEnd = 0;
        let farthest = 0;
        for (let i = 0; i < time; i++) {
          farthest = Math.max(farthest, maxReach[i]);
          if (i === curEnd) {
            if (farthest <= i) return -1;
            count++;
            curEnd = farthest;
            if (curEnd >= time) return count;
          }
        }
        return curEnd >= time ? count : -1;
      },
      testCases: {
        functional: [
          [[[0, 2], [4, 6], [8, 10], [1, 9], [1, 5], [5, 9]], 10],
          [[[0, 1], [1, 2]], 5],
          [[[0, 1], [6, 8], [0, 2], [5, 6], [0, 4], [0, 3], [6, 7], [1, 3], [4, 7], [1, 4], [2, 5], [2, 6], [3, 4], [4, 5], [5, 7], [6, 9]], 9],
          [[[0, 5]], 5]
        ],
        boundary: [
          [[[0, 1]], 1],
          [[[1, 5]], 5],
          [[[0, 10]], 5]
        ],
        adversarial: [
          [[[0, 4], [2, 8]], 5],
          [[[0, 2], [1, 4], [3, 6], [5, 8], [7, 10]], 10],
          [[[0, 2], [2, 4], [4, 6]], 7]
        ],
        stress: [
          [Array.from({ length: 100 }, (_, i) => [i, i + 2]), 100],
          [Array.from({ length: 100 }, (_, i) => [0, i + 1]), 100]
        ]
      }
    }),

    // 186. Minimum Cost to Move Chips to The Same Position
    createProblem({
      num: 186,
      title: "Minimum Cost to Move Chips to The Same Position",
      slug: "minimum-cost-to-move-chips-to-the-same-position",
      level: 8,
      difficulty: "EASY",
      topic: "Greedy / Math",
      patternSlug: "intervals-greedy",
      estimatedTimeMin: 10,
      statement: "We have `n` chips. The position of the `i-th` chip is `position[i]`.\n\nWe want to move all the chips to the same position. In one step, we can change the position of the `i-th` chip from `position[i]` to:\n- `position[i] + 2` or `position[i] - 2` with cost = 0.\n- `position[i] + 1` or `position[i] - 1` with cost = 1.\n\nReturn the minimum cost needed to move all the chips to the same position.",
      functionName: "minCostToMoveChips",
      parameters: [{ name: "position", type: "number[]", description: "Array of chip positions" }],
      returnType: "number",
      constraints: ["1 <= position.length <= 100", "1 <= position[i] <= 10^9"],
      examples: [
        {
          input: "position = [1,2,3]",
          output: "1",
          explanation: "Move chip at pos 3 to pos 1 (cost 0). Move chip at pos 2 to pos 1 (cost 1). Total cost = 1."
        },
        {
          input: "position = [2,2,2,3,3]",
          output: "2",
          explanation: "Move two chips at 3 to pos 2 with cost 1 each. Total cost = 2."
        },
        {
          input: "position = [1,1000000000]",
          output: "1",
          explanation: "Odd position 1 to even position 10^9 costs 1."
        },
        {
          input: "position = [2,4,6,8]",
          output: "0",
          explanation: "All chips are at even positions, moving by steps of 2 costs 0."
        }
      ],
      optimalSolution: `function minCostToMoveChips(position) {\n  let even = 0, odd = 0;\n  for (const pos of position) {\n    if (pos % 2 === 0) even++;\n    else odd++;\n  }\n  return Math.min(even, odd);\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function minCostToMoveChips(position) {\n  let minCost = Infinity;\n  for (let target of new Set(position)) {\n    let cost = 0;\n    for (let pos of position) {\n      cost += Math.abs(pos - target) % 2;\n    }\n    minCost = Math.min(minCost, cost);\n  }\n  return minCost;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Simulating movements coordinate by coordinate",
        "Overlooking parity invariance: moving by 2 preserves parity for free; only changing parity costs 1"
      ],
      hints: [
        "Notice moving by 2 costs 0. That means all even numbers can be gathered at 0 for free, and all odd numbers can be gathered at 1 for free.",
        "Moving between an even position and an odd position costs 1.",
        "The answer is simply `min(evenCount, oddCount)`."
      ],
      oracleFn: (position: number[]) => {
        let even = 0;
        let odd = 0;
        for (const p of position) {
          if (p % 2 === 0) even++;
          else odd++;
        }
        return Math.min(even, odd);
      },
      testCases: {
        functional: [
          [[1, 2, 3]],
          [[2, 2, 2, 3, 3]],
          [[1, 1000000000]],
          [[2, 4, 6, 8]]
        ],
        boundary: [
          [[1]],
          [[2]],
          [[1, 2]]
        ],
        adversarial: [
          [[1, 3, 5, 7, 9]],
          [[2, 4, 6, 8, 10]],
          [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]]
        ],
        stress: [
          [Array.from({ length: 100 }, (_, i) => i + 1)],
          [Array.from({ length: 100 }, () => 1000000000)]
        ]
      }
    }),

    // 187. Wiggle Subsequence
    createProblem({
      num: 187,
      title: "Wiggle Subsequence",
      slug: "wiggle-subsequence",
      level: 8,
      difficulty: "MEDIUM",
      topic: "Greedy / Dynamic Programming",
      patternSlug: "intervals-greedy",
      estimatedTimeMin: 20,
      statement: "A wiggle sequence is a sequence where the differences between successive numbers strictly alternate between positive and negative. The first difference (if one exists) may be either positive or negative. A sequence with one element and a sequence with two non-equal elements are trivially wiggle sequences.\n\nGiven an integer array `nums`, return the length of the longest wiggle subsequence of `nums`.\n\nA subsequence is obtained by deleting some elements (possibly zero) from the original sequence, leaving the remaining elements in their original order.",
      functionName: "wiggleMaxLength",
      parameters: [{ name: "nums", type: "number[]", description: "Array of integers" }],
      returnType: "number",
      constraints: ["1 <= nums.length <= 1000", "0 <= nums[i] <= 1000"],
      examples: [
        {
          input: "nums = [1,7,4,9,2,5]",
          output: "6",
          explanation: "Differences: (6, -3, 5, -7, 3) alternate signs. Entire sequence is wiggle."
        },
        {
          input: "nums = [1,17,5,10,13,15,10,5,16,8]",
          output: "7",
          explanation: "Subsequence [1, 17, 10, 13, 10, 16, 8] achieves wiggle length 7."
        },
        {
          input: "nums = [1,2,3,4,5,6,7,8,9]",
          output: "2",
          explanation: "Any two distinct elements give length 2."
        },
        {
          input: "nums = [0,0]",
          output: "1",
          explanation: "Equal elements cannot alternate, longest wiggle is 1."
        }
      ],
      optimalSolution: `function wiggleMaxLength(nums) {\n  if (nums.length < 2) return nums.length;\n  let up = 1, down = 1;\n  for (let i = 1; i < nums.length; i++) {\n    if (nums[i] > nums[i - 1]) up = down + 1;\n    else if (nums[i] < nums[i - 1]) down = up + 1;\n  }\n  return Math.max(up, down);\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function wiggleMaxLength(nums) {\n  if (nums.length < 2) return nums.length;\n  const up = new Array(nums.length).fill(1);\n  const down = new Array(nums.length).fill(1);\n  for (let i = 1; i < nums.length; i++) {\n    for (let j = 0; j < i; j++) {\n      if (nums[i] > nums[j]) up[i] = Math.max(up[i], down[j] + 1);\n      else if (nums[i] < nums[j]) down[i] = Math.max(down[i], up[j] + 1);\n    }\n  }\n  return Math.max(Math.max(...up), Math.max(...down));\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Handling consecutive identical numbers as transitions",
        "Overcomplicating with O(N^2) DP when greedy peak/valley tracking is O(N) time and O(1) space"
      ],
      hints: [
        "Think of this geometrically as finding local extrema (peaks and valleys).",
        "Maintain `up` (length of wiggle ending with positive diff) and `down` (length of wiggle ending with negative diff).",
        "If `nums[i] > nums[i-1]`, `up = down + 1`. If `nums[i] < nums[i-1]`, `down = up + 1`."
      ],
      oracleFn: (nums: number[]) => {
        if (nums.length < 2) return nums.length;
        let up = 1;
        let down = 1;
        for (let i = 1; i < nums.length; i++) {
          if (nums[i] > nums[i - 1]) up = down + 1;
          else if (nums[i] < nums[i - 1]) down = up + 1;
        }
        return Math.max(up, down);
      },
      testCases: {
        functional: [
          [[1, 7, 4, 9, 2, 5]],
          [[1, 17, 5, 10, 13, 15, 10, 5, 16, 8]],
          [[1, 2, 3, 4, 5, 6, 7, 8, 9]],
          [[0, 0]]
        ],
        boundary: [
          [[1]],
          [[1, 1]],
          [[1, 2]]
        ],
        adversarial: [
          [[3, 3, 3, 2, 5]],
          [[1, 1, 1, 1, 1]],
          [[1, 2, 1, 2, 1, 2]]
        ],
        stress: [
          [Array.from({ length: 500 }, (_, i) => i % 2 === 0 ? 1 : 10)],
          [Array.from({ length: 500 }, (_, i) => i)]
        ]
      }
    }),

    // 188. Maximum Length of Pair Chain
    createProblem({
      num: 188,
      title: "Maximum Length of Pair Chain",
      slug: "maximum-length-of-pair-chain",
      level: 8,
      difficulty: "MEDIUM",
      topic: "Greedy / Intervals",
      patternSlug: "intervals-greedy",
      estimatedTimeMin: 20,
      statement: "You are given an array of `n` pairs `pairs` where `pairs[i] = [left_i, right_i]` and `left_i < right_i`.\n\nA pair `p2 = [c, d]` follows a pair `p1 = [a, b]` if `b < c`. A chain of pairs can be formed in this fashion.\n\nReturn the length longest chain which can be formed. You do not need to use up all the given intervals. You can select pairs in any order.",
      functionName: "findLongestChain",
      parameters: [{ name: "pairs", type: "number[][]", description: "Array of [left, right] pairs" }],
      returnType: "number",
      constraints: ["n == pairs.length", "1 <= n <= 1000", "-1000 <= left_i < right_i <= 1000"],
      examples: [
        {
          input: "pairs = [[1,2],[2,3],[3,4]]",
          output: "2",
          explanation: "Longest chain is [1,2] -> [3,4] of length 2."
        },
        {
          input: "pairs = [[1,2],[7,8],[4,5]]",
          output: "3",
          explanation: "Chain: [1,2] -> [4,5] -> [7,8] of length 3."
        },
        {
          input: "pairs = [[-6,9],[1,6],[8,10],[-1,4],[-6,-2],[-9,8],[-5,3],[0,3]]",
          output: "3",
          explanation: "[-6,-2] -> [0,3] -> [8,10] forms length 3."
        },
        {
          input: "pairs = [[1,10]]",
          output: "1",
          explanation: "Single pair chain has length 1."
        }
      ],
      optimalSolution: `function findLongestChain(pairs) {\n  pairs.sort((a, b) => a[1] - b[1]);\n  let chain = 0, curEnd = -Infinity;\n  for (const [left, right] of pairs) {\n    if (left > curEnd) {\n      chain++;\n      curEnd = right;\n    }\n  }\n  return chain;\n}`,
      optimalTimeComplexity: "O(N log N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function findLongestChain(pairs) {\n  // LIS dynamic programming O(N^2)\n  pairs.sort((a, b) => a[0] - b[0]);\n  const dp = new Array(pairs.length).fill(1);\n  for (let i = 1; i < pairs.length; i++) {\n    for (let j = 0; j < i; j++) {\n      if (pairs[j][1] < pairs[i][0]) dp[i] = Math.max(dp[i], dp[j] + 1);\n    }\n  }\n  return Math.max(...dp);\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Sorting by left endpoint instead of right endpoint for greedy selection",
        "Using >= instead of > for pair chain condition (problem requires `b < c`)"
      ],
      hints: [
        "This is identical to the interval scheduling problem.",
        "Sort pairs by their second coordinate (finish time).",
        "Greedily select the pair that finishes earliest to leave the maximum room for remaining pairs."
      ],
      oracleFn: (pairs: number[][]) => {
        const sorted = [...pairs].sort((a, b) => a[1] - b[1]);
        let chain = 0;
        let curEnd = -Infinity;
        for (const [left, right] of sorted) {
          if (left > curEnd) {
            chain++;
            curEnd = right;
          }
        }
        return chain;
      },
      testCases: {
        functional: [
          [[[1, 2], [2, 3], [3, 4]]],
          [[[1, 2], [7, 8], [4, 5]]],
          [[[-6, 9], [1, 6], [8, 10], [-1, 4], [-6, -2], [-9, 8], [-5, 3], [0, 3]]],
          [[[1, 10]]]
        ],
        boundary: [
          [[[1, 2]]],
          [[[-10, -5], [-4, 0], [1, 5]]],
          [[[1, 5], [2, 6], [3, 7]]]
        ],
        adversarial: [
          [[[1, 10], [2, 3], [4, 5], [6, 7], [8, 9]]],
          [[[1, 2], [1, 3], [1, 4], [2, 3]]],
          [[[-10, 10], [-5, 0], [1, 6], [7, 9]]]
        ],
        stress: [
          [Array.from({ length: 400 }, (_, i) => [i * 3, i * 3 + 2])],
          [Array.from({ length: 400 }, (_, i) => [i, i + 5])]
        ]
      }
    })
  ];

  return {
    level: 8,
    levelTitle: "Level 8 — Intervals & Greedy",
    topic: "Interval Scheduling, Merging, and Greedy Optimization",
    problems
  };
}
