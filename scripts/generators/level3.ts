import { LevelPayload, GeneratedProblem } from './types';
import { createProblem } from './problemBuilder';

export function getLevel3Payload(): LevelPayload {
  const problems: GeneratedProblem[] = [
    // 50. Two Sum II - Input Array Is Sorted
    createProblem({
      num: 50,
      title: "Two Sum II - Input Array Is Sorted",
      slug: "two-sum-ii-input-array-is-sorted",
      level: 3,
      difficulty: "MEDIUM",
      topic: "Two Pointers",
      patternSlug: "two-pointers",
      estimatedTimeMin: 15,
      statement: "Given a 1-indexed array of integers `numbers` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific `target` number.\n\nReturn the indices of the two numbers, `index1` and `index2`, added by one as an integer array `[index1, index2]` of length 2.\n\nYou may not use the same element twice. Your solution must use only constant extra space.",
      functionName: "twoSum",
      parameters: [
        { name: "numbers", type: "number[]", description: "Sorted 1-indexed array" },
        { name: "target", type: "number", description: "Target sum" }
      ],
      returnType: "number[]",
      constraints: ["2 <= numbers.length <= 3 * 10^4", "-1000 <= numbers[i] <= 1000", "numbers is sorted in non-decreasing order.", "Exactly one solution exists."],
      examples: [
        { input: "numbers = [2,7,11,15], target = 9", output: "[1,2]", explanation: "2 + 7 = 9. 1-indexed indices are [1, 2]." },
        { input: "numbers = [2,3,4], target = 6", output: "[1,3]", explanation: "2 + 4 = 6." },
        { input: "numbers = [-1,0], target = -1", output: "[1,2]", explanation: "-1 + 0 = -1." }
      ],
      optimalSolution: `function twoSum(numbers, target) {\n  let left = 0, right = numbers.length - 1;\n  while (left < right) {\n    const sum = numbers[left] + numbers[right];\n    if (sum === target) return [left + 1, right + 1];\n    if (sum < target) left++;\n    else right--;\n  }\n  return [];\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function twoSum(numbers, target) {\n  for (let i = 0; i < numbers.length; i++) {\n    for (let j = i + 1; j < numbers.length; j++) {\n      if (numbers[i] + numbers[j] === target) return [i + 1, j + 1];\n    }\n  }\n  return [];\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Using 0-indexing instead of 1-indexing in return value", "Using O(N) Hash Map space when problem requires O(1) space"],
      hints: [
        "Since the array is sorted, can you use two converging pointers?",
        "If numbers[left] + numbers[right] < target, increment left to increase sum.",
        "If sum > target, decrement right to decrease sum.",
        "Remember to return 1-based indices [left + 1, right + 1]."
      ],
      oracleFn: (numbers: number[], target: number) => {
        let left = 0, right = numbers.length - 1;
        while (left < right) {
          const sum = numbers[left] + numbers[right];
          if (sum === target) return [left + 1, right + 1];
          if (sum < target) left++;
          else right--;
        }
        return [];
      },
      testCases: {
        functional: [
          [[2, 7, 11, 15], 9],
          [[2, 3, 4], 6],
          [[-1, 0], -1]
        ],
        boundary: [
          [[0, 0], 0],
          [[-1000, 1000], 0],
          [[1, 2], 3],
          [[-5, -3, -1], -4]
        ],
        adversarial: [
          [[1, 2, 3, 4, 4, 9, 56, 90], 8],
          [[-10, -5, 0, 3, 7], -5],
          [[1, 3, 5, 7, 9, 11, 13, 15], 28]
        ],
        stress: [
          [Array.from({ length: 3000 }, (_, i) => i * 2), 5998],
          [Array.from({ length: 5000 }, (_, i) => i - 2500), 2499]
        ]
      }
    }),

    // 51. 3Sum
    createProblem({
      num: 51,
      title: "3Sum",
      slug: "3sum",
      level: 3,
      difficulty: "MEDIUM",
      topic: "Two Pointers",
      patternSlug: "two-pointers",
      estimatedTimeMin: 25,
      statement: "Given an integer array nums, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.",
      functionName: "threeSum",
      parameters: [{ name: "nums", type: "number[]", description: "Array of integers" }],
      returnType: "number[][]",
      constraints: ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
      examples: [
        { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]", explanation: "Two distinct triplets sum to 0." },
        { input: "nums = [0,1,1]", output: "[]", explanation: "No triplet sums to 0." },
        { input: "nums = [0,0,0]", output: "[[0,0,0]]", explanation: "Single unique triplet." }
      ],
      optimalSolution: `function threeSum(nums) {\n  nums.sort((a, b) => a - b);\n  const res = [];\n  for (let i = 0; i < nums.length - 2; i++) {\n    if (nums[i] > 0) break;\n    if (i > 0 && nums[i] === nums[i - 1]) continue;\n    let l = i + 1, r = nums.length - 1;\n    while (l < r) {\n      const s = nums[i] + nums[l] + nums[r];\n      if (s === 0) {\n        res.push([nums[i], nums[l], nums[r]]);\n        while (l < r && nums[l] === nums[l + 1]) l++;\n        while (l < r && nums[r] === nums[r - 1]) r--;\n        l++; r--;\n      } else if (s < 0) l++;\n      else r--;\n    }\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(N^2)",
      optimalSpaceComplexity: "O(1) extra space (excluding output)",
      suboptimalSolution: `function threeSum(nums) {\n  const res = [];\n  const seen = new Set();\n  nums.sort((a, b) => a - b);\n  for (let i = 0; i < nums.length; i++)\n    for (let j = i + 1; j < nums.length; j++)\n      for (let k = j + 1; k < nums.length; k++)\n        if (nums[i] + nums[j] + nums[k] === 0) {\n          const key = \`\${nums[i]},\${nums[j]},\${nums[k]}\`;\n          if (!seen.has(key)) { seen.add(key); res.push([nums[i], nums[j], nums[k]]); }\n        }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N^3)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Failing to skip duplicate numbers for i, l, and r, creating duplicate triplets", "Not sorting array first"],
      hints: [
        "Sort the array first so you can use two pointers.",
        "Fix the first number nums[i], then use two pointers on the remainder to find pairs summing to -nums[i].",
        "Skip identical consecutive elements to avoid duplicate triplets."
      ],
      oracleFn: (nums: number[]) => {
        nums.sort((a, b) => a - b);
        const res: number[][] = [];
        for (let i = 0; i < nums.length - 2; i++) {
          if (nums[i] > 0) break;
          if (i > 0 && nums[i] === nums[i - 1]) continue;
          let l = i + 1, r = nums.length - 1;
          while (l < r) {
            const s = nums[i] + nums[l] + nums[r];
            if (s === 0) {
              res.push([nums[i], nums[l], nums[r]]);
              while (l < r && nums[l] === nums[l + 1]) l++;
              while (l < r && nums[r] === nums[r - 1]) r--;
              l++; r--;
            } else if (s < 0) l++;
            else r--;
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [[-1, 0, 1, 2, -1, -4]],
          [[0, 1, 1]],
          [[0, 0, 0]]
        ],
        boundary: [
          [[0, 0, 0, 0]],
          [[-2, 0, 1, 1, 2]],
          [[-1, -1, 2]],
          [[1, 2, 3]]
        ],
        adversarial: [
          [[-4, -2, -2, -2, 0, 1, 2, 2, 2, 3, 3, 4, 4, 6, 6]],
          [[-1, 0, 1, 0]],
          [[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]]
        ],
        stress: [
          [Array.from({ length: 300 }, (_, i) => i - 150)],
          [Array.from({ length: 400 }, () => 0)]
        ]
      }
    }),

    // 52. 3Sum Closest
    createProblem({
      num: 52,
      title: "3Sum Closest",
      slug: "3sum-closest",
      level: 3,
      difficulty: "MEDIUM",
      topic: "Two Pointers",
      patternSlug: "two-pointers",
      estimatedTimeMin: 20,
      statement: "Given an integer array `nums` of length `n` and an integer `target`, find three integers in `nums` such that the sum is closest to `target`.\n\nReturn the sum of the three integers.\n\nYou may assume that each input would have exactly one solution.",
      functionName: "threeSumClosest",
      parameters: [
        { name: "nums", type: "number[]", description: "Array of integers" },
        { name: "target", type: "number", description: "Target sum" }
      ],
      returnType: "number",
      constraints: ["3 <= nums.length <= 500", "-1000 <= nums[i] <= 1000", "-10^4 <= target <= 10^4"],
      examples: [
        { input: "nums = [-1,2,1,-4], target = 1", output: "2", explanation: "-1 + 2 + 1 = 2 (closest to 1)." },
        { input: "nums = [0,0,0], target = 1", output: "0", explanation: "0 is closest to 1." }
      ],
      optimalSolution: `function threeSumClosest(nums, target) {\n  nums.sort((a, b) => a - b);\n  let closest = nums[0] + nums[1] + nums[2];\n  for (let i = 0; i < nums.length - 2; i++) {\n    let l = i + 1, r = nums.length - 1;\n    while (l < r) {\n      const s = nums[i] + nums[l] + nums[r];\n      if (Math.abs(s - target) < Math.abs(closest - target)) closest = s;\n      if (s === target) return target;\n      if (s < target) l++;\n      else r--;\n    }\n  }\n  return closest;\n}`,
      optimalTimeComplexity: "O(N^2)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function threeSumClosest(nums, target) {\n  let closest = Infinity;\n  for (let i = 0; i < nums.length; i++)\n    for (let j = i + 1; j < nums.length; j++)\n      for (let k = j + 1; k < nums.length; k++) {\n        const s = nums[i] + nums[j] + nums[k];\n        if (Math.abs(s - target) < Math.abs(closest - target)) closest = s;\n      }\n  return closest;\n}`,
      suboptimalTimeComplexity: "O(N^3)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Returning the absolute difference instead of the actual sum"],
      hints: [
        "Sort the array and fix the first element nums[i].",
        "Use two pointers (l, r) to find the closest pair sum.",
        "Track the minimum difference |sum - target|."
      ],
      oracleFn: (nums: number[], target: number) => {
        nums.sort((a, b) => a - b);
        let closest = nums[0] + nums[1] + nums[2];
        for (let i = 0; i < nums.length - 2; i++) {
          let l = i + 1, r = nums.length - 1;
          while (l < r) {
            const s = nums[i] + nums[l] + nums[r];
            if (Math.abs(s - target) < Math.abs(closest - target)) closest = s;
            if (s === target) return target;
            if (s < target) l++;
            else r--;
          }
        }
        return closest;
      },
      testCases: {
        functional: [
          [[-1, 2, 1, -4], 1],
          [[0, 0, 0], 1],
          [[1, 1, 1, 0], -100]
        ],
        boundary: [
          [[1, 1, 1], 3],
          [[-1000, -1000, -1000], -3000],
          [[1000, 1000, 1000], 3000],
          [[0, 1, 2], 0]
        ],
        adversarial: [
          [[1, 2, 4, 8, 16, 32, 64, 128], 82],
          [[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5], 11],
          [[4, 0, 5, -5, 3, 3, 0, -4, -5], -2]
        ],
        stress: [
          [Array.from({ length: 400 }, (_, i) => i - 200), 50],
          [Array.from({ length: 500 }, () => 1), 5]
        ]
      }
    }),

    // 53. 4Sum
    createProblem({
      num: 53,
      title: "4Sum",
      slug: "4sum",
      level: 3,
      difficulty: "MEDIUM",
      topic: "Two Pointers",
      patternSlug: "two-pointers",
      estimatedTimeMin: 25,
      statement: "Given an array `nums` of `n` integers, return an array of all the unique quadruplets `[nums[a], nums[b], nums[c], nums[d]]` such that:\n- `0 <= a, b, c, d < n`\n- `a, b, c, and d` are distinct\n- `nums[a] + nums[b] + nums[c] + nums[d] == target`",
      functionName: "fourSum",
      parameters: [
        { name: "nums", type: "number[]", description: "Array of integers" },
        { name: "target", type: "number", description: "Target quadruplet sum" }
      ],
      returnType: "number[][]",
      constraints: ["1 <= nums.length <= 200", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9"],
      examples: [
        { input: "nums = [1,0,-1,0,-2,2], target = 0", output: "[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]", explanation: "Three unique quadruplets sum to 0." },
        { input: "nums = [2,2,2,2,2], target = 8", output: "[[2,2,2,2]]", explanation: "One unique quadruplet." }
      ],
      optimalSolution: `function fourSum(nums, target) {\n  nums.sort((a, b) => a - b);\n  const res = [];\n  const n = nums.length;\n  for (let i = 0; i < n - 3; i++) {\n    if (i > 0 && nums[i] === nums[i - 1]) continue;\n    for (let j = i + 1; j < n - 2; j++) {\n      if (j > i + 1 && nums[j] === nums[j - 1]) continue;\n      let l = j + 1, r = n - 1;\n      while (l < r) {\n        const s = nums[i] + nums[j] + nums[l] + nums[r];\n        if (s === target) {\n          res.push([nums[i], nums[j], nums[l], nums[r]]);\n          while (l < r && nums[l] === nums[l + 1]) l++;\n          while (l < r && nums[r] === nums[r - 1]) r--;\n          l++; r--;\n        } else if (s < target) l++;\n        else r--;\n      }\n    }\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(N^3)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function fourSum(nums, target) {\n  nums.sort((a, b) => a - b);\n  const res = [], seen = new Set();\n  for (let a = 0; a < nums.length; a++)\n    for (let b = a + 1; b < nums.length; b++)\n      for (let c = b + 1; c < nums.length; c++)\n        for (let d = c + 1; d < nums.length; d++)\n          if (nums[a] + nums[b] + nums[c] + nums[d] === target) {\n            const key = \`\${nums[a]},\${nums[b]},\${nums[c]},\${nums[d]}\`;\n            if (!seen.has(key)) { seen.add(key); res.push([nums[a], nums[b], nums[c], nums[d]]); }\n          }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N^4)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["32-bit integer overflow when adding 4 large 10^9 numbers in languages without 64-bit default", "Duplicate quadruplets"],
      hints: [
        "Sort nums first.",
        "Fix the first two numbers (i, j), then use two pointers (l, r) for the remaining two.",
        "Skip duplicates at all 4 levels."
      ],
      oracleFn: (nums: number[], target: number) => {
        nums.sort((a, b) => a - b);
        const res: number[][] = [];
        const n = nums.length;
        for (let i = 0; i < n - 3; i++) {
          if (i > 0 && nums[i] === nums[i - 1]) continue;
          for (let j = i + 1; j < n - 2; j++) {
            if (j > i + 1 && nums[j] === nums[j - 1]) continue;
            let l = j + 1, r = n - 1;
            while (l < r) {
              const s = nums[i] + nums[j] + nums[l] + nums[r];
              if (s === target) {
                res.push([nums[i], nums[j], nums[l], nums[r]]);
                while (l < r && nums[l] === nums[l + 1]) l++;
                while (l < r && nums[r] === nums[r - 1]) r--;
                l++; r--;
              } else if (s < target) l++;
              else r--;
            }
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [[1, 0, -1, 0, -2, 2], 0],
          [[2, 2, 2, 2, 2], 8],
          [[0, 0, 0, 0], 0]
        ],
        boundary: [
          [[1, 2, 3], 6],
          [[1, -2, -5, -4, -3, 3, 3, 5], -11],
          [[-3, -2, -1, 0, 0, 1, 2, 3], 0],
          [[-1000000000, -1000000000, 1000000000, 1000000000], 0]
        ],
        adversarial: [
          [[0, 0, 0, 1000000000, 1000000000, 1000000000, 1000000000], 1000000000],
          [[-5, 5, 4, -3, 0, 0, 4, -2], 4]
        ],
        stress: [
          [Array.from({ length: 60 }, (_, i) => i - 30), 0],
          [Array.from({ length: 80 }, () => 2), 8]
        ]
      }
    }),

    // 54. Container With Most Water
    createProblem({
      num: 54,
      title: "Container With Most Water",
      slug: "container-with-most-water",
      level: 3,
      difficulty: "MEDIUM",
      topic: "Two Pointers",
      patternSlug: "two-pointers",
      estimatedTimeMin: 20,
      statement: "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i`th line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.\n\nNotice that you may not slant the container.",
      functionName: "maxArea",
      parameters: [{ name: "height", type: "number[]", description: "Array of line heights" }],
      returnType: "number",
      constraints: ["n == height.length", "2 <= n <= 10^5", "0 <= height[i] <= 10^4"],
      examples: [
        { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49", explanation: "Lines at index 1 and 8 have heights 8 and 7, width 7 -> 7 * 7 = 49." },
        { input: "height = [1,1]", output: "1", explanation: "Width 1 * min(1, 1) = 1." }
      ],
      optimalSolution: `function maxArea(height) {\n  let left = 0, right = height.length - 1, max = 0;\n  while (left < right) {\n    const h = Math.min(height[left], height[right]);\n    max = Math.max(max, h * (right - left));\n    if (height[left] < height[right]) left++;\n    else right--;\n  }\n  return max;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function maxArea(height) {\n  let max = 0;\n  for (let i = 0; i < height.length; i++)\n    for (let j = i + 1; j < height.length; j++)\n      max = Math.max(max, Math.min(height[i], height[j]) * (j - i));\n  return max;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Moving the pointer with larger height (which can never increase the area since width shrinks and height is bottlenecked by the shorter bar)"],
      hints: [
        "Start with pointers at both ends (maximum possible width).",
        "The area is bounded by min(height[left], height[right]) * (right - left).",
        "To potentially find a larger area with smaller width, you MUST move the pointer pointing to the shorter vertical bar."
      ],
      oracleFn: (height: number[]) => {
        let left = 0, right = height.length - 1, max = 0;
        while (left < right) {
          const h = Math.min(height[left], height[right]);
          max = Math.max(max, h * (right - left));
          if (height[left] < height[right]) left++;
          else right--;
        }
        return max;
      },
      testCases: {
        functional: [
          [[1, 8, 6, 2, 5, 4, 8, 3, 7]],
          [[1, 1]],
          [[4, 3, 2, 1, 4]]
        ],
        boundary: [
          [[1, 2, 1]],
          [[0, 2]],
          [[10000, 10000]],
          [[1, 1, 1, 1, 1]]
        ],
        adversarial: [
          [[1, 2, 4, 3]],
          [[1, 8, 100, 2, 100, 4, 8, 3, 7]],
          [[10, 9, 8, 7, 6, 5, 4, 3, 2, 1]]
        ],
        stress: [
          [Array.from({ length: 3000 }, (_, i) => i)],
          [Array.from({ length: 5000 }, (_, i) => i % 2 === 0 ? 1000 : 10)]
        ]
      }
    }),

    // 55. Trapping Rain Water
    createProblem({
      num: 55,
      title: "Trapping Rain Water",
      slug: "trapping-rain-water",
      level: 3,
      difficulty: "HARD",
      topic: "Two Pointers",
      patternSlug: "two-pointers",
      estimatedTimeMin: 25,
      statement: "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
      functionName: "trap",
      parameters: [{ name: "height", type: "number[]", description: "Elevation map heights" }],
      returnType: "number",
      constraints: ["n == height.length", "1 <= n <= 2 * 10^4", "0 <= height[i] <= 10^5"],
      examples: [
        { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6", explanation: "Traps 6 units of water." },
        { input: "height = [4,2,0,3,2,5]", output: "9", explanation: "Traps 9 units of water." }
      ],
      optimalSolution: `function trap(height) {\n  let left = 0, right = height.length - 1;\n  let leftMax = 0, rightMax = 0, water = 0;\n  while (left < right) {\n    if (height[left] < height[right]) {\n      if (height[left] >= leftMax) leftMax = height[left];\n      else water += leftMax - height[left];\n      left++;\n    } else {\n      if (height[right] >= rightMax) rightMax = height[right];\n      else water += rightMax - height[right];\n      right--;\n    }\n  }\n  return water;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function trap(height) {\n  const n = height.length;\n  if (n === 0) return 0;\n  const leftMax = new Array(n), rightMax = new Array(n);\n  leftMax[0] = height[0];\n  for (let i = 1; i < n; i++) leftMax[i] = Math.max(leftMax[i - 1], height[i]);\n  rightMax[n - 1] = height[n - 1];\n  for (let i = n - 2; i >= 0; i--) rightMax[i] = Math.max(rightMax[i + 1], height[i]);\n  let water = 0;\n  for (let i = 0; i < n; i++) water += Math.min(leftMax[i], rightMax[i]) - height[i];\n  return water;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Failing to recognize that water trapped at i depends on min(maxLeft, maxRight) - height[i]"],
      hints: [
        "Water at any bar is determined by min(max_left, max_right) - height[i].",
        "Use two pointers from left and right maintaining leftMax and rightMax.",
        "Always advance the pointer corresponding to the smaller maximum height."
      ],
      oracleFn: (height: number[]) => {
        let left = 0, right = height.length - 1;
        let leftMax = 0, rightMax = 0, water = 0;
        while (left < right) {
          if (height[left] < height[right]) {
            if (height[left] >= leftMax) leftMax = height[left];
            else water += leftMax - height[left];
            left++;
          } else {
            if (height[right] >= rightMax) rightMax = height[right];
            else water += rightMax - height[right];
            right--;
          }
        }
        return water;
      },
      testCases: {
        functional: [
          [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]],
          [[4, 2, 0, 3, 2, 5]],
          [[3, 0, 2, 0, 4]]
        ],
        boundary: [
          [[]],
          [[1]],
          [[2, 1]],
          [[1, 2, 3, 4, 5]],
          [[5, 4, 3, 2, 1]]
        ],
        adversarial: [
          [[5, 0, 5]],
          [[0, 0, 0, 0]],
          [[5, 2, 1, 2, 1, 5]]
        ],
        stress: [
          [Array.from({ length: 2000 }, (_, i) => i % 2 === 0 ? 10 : 0)],
          [Array.from({ length: 3000 }, (_, i) => Math.sin(i) > 0 ? 5 : 1)]
        ]
      }
    }),

    // 56. Remove Duplicates from Sorted Array II
    createProblem({
      num: 56,
      title: "Remove Duplicates from Sorted Array II",
      slug: "remove-duplicates-from-sorted-array-ii",
      level: 3,
      difficulty: "MEDIUM",
      topic: "Two Pointers",
      patternSlug: "two-pointers",
      estimatedTimeMin: 15,
      statement: "Given an integer array `nums` sorted in non-decreasing order, remove some duplicates in-place such that each unique element appears at most twice. The relative order of the elements should be kept the same.\n\nReturn `k` after placing the final result in the first `k` slots of `nums`.",
      functionName: "removeDuplicates",
      parameters: [{ name: "nums", type: "number[]", description: "Sorted array modified in-place" }],
      returnType: "number",
      constraints: ["1 <= nums.length <= 3 * 10^4", "-10^4 <= nums[i] <= 10^4", "nums is sorted in non-decreasing order."],
      examples: [
        { input: "nums = [1,1,1,2,2,3]", output: "5", explanation: "First 5 elements are [1, 1, 2, 2, 3]." },
        { input: "nums = [0,0,1,1,1,1,2,3,3]", output: "7", explanation: "First 7 elements are [0, 0, 1, 1, 2, 3, 3]." }
      ],
      optimalSolution: `function removeDuplicates(nums) {\n  if (nums.length <= 2) return nums.length;\n  let write = 2;\n  for (let i = 2; i < nums.length; i++) {\n    if (nums[i] !== nums[write - 2]) {\n      nums[write++] = nums[i];\n    }\n  }\n  return write;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function removeDuplicates(nums) {\n  let i = 0;\n  for (const n of nums) {\n    if (i < 2 || n > nums[i - 2]) nums[i++] = n;\n  }\n  return i;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Comparing nums[i] with nums[i-2] instead of nums[write-2]"],
      hints: [
        "Generalize to at most K duplicates: allow nums[i] if nums[i] !== nums[write - K].",
        "Here K = 2.",
        "Advance write pointer only when a valid element is placed."
      ],
      oracleFn: (nums: number[]) => {
        if (nums.length <= 2) return nums.length;
        let write = 2;
        for (let i = 2; i < nums.length; i++) {
          if (nums[i] !== nums[write - 2]) nums[write++] = nums[i];
        }
        return write;
      },
      testCases: {
        functional: [
          [[1, 1, 1, 2, 2, 3]],
          [[0, 0, 1, 1, 1, 1, 2, 3, 3]],
          [[1, 2, 3]]
        ],
        boundary: [
          [[1]],
          [[1, 1]],
          [[1, 1, 1]],
          [[1, 1, 1, 1]]
        ],
        adversarial: [
          [[-3, -1, -1, 0, 0, 0, 0, 0, 2]],
          [[1, 1, 1, 2, 2, 2, 3, 3, 3]]
        ],
        stress: [
          [Array.from({ length: 2000 }, () => 5)],
          [Array.from({ length: 3000 }, (_, i) => Math.floor(i / 3))]
        ]
      }
    }),

    // 57. Squares of a Sorted Array
    createProblem({
      num: 57,
      title: "Squares of a Sorted Array",
      slug: "squares-of-a-sorted-array",
      level: 3,
      difficulty: "EASY",
      topic: "Two Pointers",
      patternSlug: "two-pointers",
      estimatedTimeMin: 15,
      statement: "Given an integer array `nums` sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order.",
      functionName: "sortedSquares",
      parameters: [{ name: "nums", type: "number[]", description: "Sorted array" }],
      returnType: "number[]",
      constraints: ["1 <= nums.length <= 10^4", "-10^4 <= nums[i] <= 10^4", "nums is sorted in non-decreasing order."],
      examples: [
        { input: "nums = [-4,-1,0,3,10]", output: "[0,1,9,16,100]", explanation: "Squares: 16, 1, 0, 9, 100 -> sorted [0, 1, 9, 16, 100]" },
        { input: "nums = [-7,-3,2,3,11]", output: "[4,9,9,49,121]", explanation: "Sorted squares." }
      ],
      optimalSolution: `function sortedSquares(nums) {\n  const n = nums.length;\n  const res = new Array(n);\n  let left = 0, right = n - 1, write = n - 1;\n  while (left <= right) {\n    const sqL = nums[left] * nums[left];\n    const sqR = nums[right] * nums[right];\n    if (sqL > sqR) {\n      res[write--] = sqL;\n      left++;\n    } else {\n      res[write--] = sqR;\n      right--;\n    }\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1) extra space",
      suboptimalSolution: `function sortedSquares(nums) {\n  return nums.map(x => x * x).sort((a, b) => a - b);\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Squaring each element and sorting O(N log N) instead of two pointers O(N)"],
      hints: [
        "The largest square must be either at the far left (most negative) or far right (most positive).",
        "Place two pointers at ends and fill the result array from right to left."
      ],
      oracleFn: (nums: number[]) => {
        const n = nums.length;
        const res = new Array(n);
        let left = 0, right = n - 1, write = n - 1;
        while (left <= right) {
          const sqL = nums[left] * nums[left];
          const sqR = nums[right] * nums[right];
          if (sqL > sqR) {
            res[write--] = sqL;
            left++;
          } else {
            res[write--] = sqR;
            right--;
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [[-4, -1, 0, 3, 10]],
          [[-7, -3, 2, 3, 11]],
          [[-1]]
        ],
        boundary: [
          [[0]],
          [[-5, -4, -3, -2, -1]],
          [[1, 2, 3, 4, 5]],
          [[-2, 0, 2]]
        ],
        adversarial: [
          [[-10000, 10000]],
          [[-1, 2, 2]],
          [[-3, -3, -2, 1]]
        ],
        stress: [
          [Array.from({ length: 3000 }, (_, i) => i - 1500)],
          [Array.from({ length: 4000 }, (_, i) => i)]
        ]
      }
    }),

    // 58. Sort Colors (Dutch National Flag)
    createProblem({
      num: 58,
      title: "Sort Colors",
      slug: "sort-colors",
      level: 3,
      difficulty: "MEDIUM",
      topic: "Two Pointers / 3-Way Partition",
      patternSlug: "two-pointers",
      estimatedTimeMin: 20,
      statement: "Given an array `nums` with `n` objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue.\n\nWe will use the integers `0`, `1`, and `2` to represent the color red, white, and blue, respectively.\n\nYou must solve this problem without using the library's sort function in one pass and using only constant extra space.",
      functionName: "sortColors",
      parameters: [{ name: "nums", type: "number[]", description: "Array of 0, 1, 2 modified in-place" }],
      returnType: "number[]",
      constraints: ["n == nums.length", "1 <= n <= 300", "nums[i] is either 0, 1, or 2."],
      examples: [
        { input: "nums = [2,0,2,1,1,0]", output: "[0,0,1,1,2,2]", explanation: "Sorted 0s, 1s, 2s." },
        { input: "nums = [2,0,1]", output: "[0,1,2]", explanation: "Sorted." }
      ],
      optimalSolution: `function sortColors(nums) {\n  let low = 0, mid = 0, high = nums.length - 1;\n  while (mid <= high) {\n    if (nums[mid] === 0) {\n      [nums[low], nums[mid]] = [nums[mid], nums[low]];\n      low++; mid++;\n    } else if (nums[mid] === 1) {\n      mid++;\n    } else {\n      [nums[mid], nums[high]] = [nums[high], nums[mid]];\n      high--;\n    }\n  }\n  return nums;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function sortColors(nums) {\n  let c0 = 0, c1 = 0, c2 = 0;\n  for (const n of nums) {\n    if (n === 0) c0++; else if (n === 1) c1++; else c2++;\n  }\n  let idx = 0;\n  while (c0-- > 0) nums[idx++] = 0;\n  while (c1-- > 0) nums[idx++] = 1;\n  while (c2-- > 0) nums[idx++] = 2;\n  return nums;\n}`,
      suboptimalTimeComplexity: "O(N) 2 passes",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Advancing mid pointer after swapping with high (element swapped from high is unexamined)"],
      hints: [
        "Use the Dutch National Flag 3-way partitioning algorithm.",
        "Maintain three pointers: low, mid, and high.",
        "When swapping with high, do NOT increment mid because the newly swapped value has not been evaluated."
      ],
      oracleFn: (nums: number[]) => {
        let low = 0, mid = 0, high = nums.length - 1;
        while (mid <= high) {
          if (nums[mid] === 0) {
            [nums[low], nums[mid]] = [nums[mid], nums[low]];
            low++; mid++;
          } else if (nums[mid] === 1) {
            mid++;
          } else {
            [nums[mid], nums[high]] = [nums[high], nums[mid]];
            high--;
          }
        }
        return nums;
      },
      testCases: {
        functional: [
          [[2, 0, 2, 1, 1, 0]],
          [[2, 0, 1]],
          [[0]]
        ],
        boundary: [
          [[1]],
          [[2]],
          [[0, 0, 0]],
          [[1, 1, 1]],
          [[2, 2, 2]]
        ],
        adversarial: [
          [[2, 2, 0, 0, 1, 1]],
          [[1, 2, 0]],
          [[2, 1, 0, 2, 1, 0]]
        ],
        stress: [
          [Array.from({ length: 300 }, (_, i) => i % 3)],
          [Array.from({ length: 300 }, () => 2)]
        ]
      }
    }),

    // 59. Reverse Vowels of a String
    createProblem({
      num: 59,
      title: "Reverse Vowels of a String",
      slug: "reverse-vowels-of-a-string",
      level: 3,
      difficulty: "EASY",
      topic: "Two Pointers",
      patternSlug: "two-pointers",
      estimatedTimeMin: 15,
      statement: "Given a string `s`, reverse only all the vowels in the string and return it.\n\nThe vowels are 'a', 'e', 'i', 'o', and 'u', and they can appear in both lower and upper cases, more than once.",
      functionName: "reverseVowels",
      parameters: [{ name: "s", type: "string", description: "Input string" }],
      returnType: "string",
      constraints: ["1 <= s.length <= 3 * 10^5", "s consist of printable ASCII characters."],
      examples: [
        { input: 's = "IceCreAm"', output: '"AceCreIm"', explanation: "Vowels 'I', 'e', 'e', 'A' reversed to 'A', 'e', 'e', 'I'." },
        { input: 's = "leetcode"', output: '"leotcede"', explanation: "Vowels 'e', 'e', 'o', 'e' reversed." }
      ],
      optimalSolution: `function reverseVowels(s) {\n  const vowels = new Set(['a','e','i','o','u','A','E','I','O','U']);\n  const arr = s.split('');\n  let l = 0, r = arr.length - 1;\n  while (l < r) {\n    while (l < r && !vowels.has(arr[l])) l++;\n    while (l < r && !vowels.has(arr[r])) r--;\n    if (l < r) {\n      [arr[l], arr[r]] = [arr[r], arr[l]];\n      l++; r--;\n    }\n  }\n  return arr.join('');\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function reverseVowels(s) {\n  const vowels = new Set(['a','e','i','o','u','A','E','I','O','U']);\n  const v = [];\n  for (const c of s) if (vowels.has(c)) v.push(c);\n  let res = '';\n  for (const c of s) {\n    if (vowels.has(c)) res += v.pop();\n    else res += c;\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Missing uppercase vowels ('A', 'E', 'I', 'O', 'U')"],
      hints: [
        "Include both lowercase and uppercase vowels.",
        "Use two pointers from left and right converging towards the center.",
        "Swap vowels when both pointers land on vowels."
      ],
      oracleFn: (s: string) => {
        const vowels = new Set(['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']);
        const arr = s.split('');
        let l = 0, r = arr.length - 1;
        while (l < r) {
          while (l < r && !vowels.has(arr[l])) l++;
          while (l < r && !vowels.has(arr[r])) r--;
          if (l < r) {
            [arr[l], arr[r]] = [arr[r], arr[l]];
            l++; r--;
          }
        }
        return arr.join('');
      },
      testCases: {
        functional: [
          ["IceCreAm"],
          ["leetcode"],
          ["hello"]
        ],
        boundary: [
          ["a"],
          ["b"],
          ["aeiou"],
          ["AEIOU"]
        ],
        adversarial: [
          [".,"],
          ["aA"],
          ["race car"]
        ],
        stress: [
          ["a".repeat(2000) + "b".repeat(1000)],
          [Array.from({ length: 3000 }, (_, i) => i % 2 === 0 ? 'a' : 'z').join('')]
        ]
      }
    }),

    // 60. Backspace String Compare
    createProblem({
      num: 60,
      title: "Backspace String Compare",
      slug: "backspace-string-compare",
      level: 3,
      difficulty: "EASY",
      topic: "Two Pointers",
      patternSlug: "two-pointers",
      estimatedTimeMin: 15,
      statement: "Given two strings `s` and `t`, return `true` if they are equal when both are typed into empty text editors. `'#'` means a backspace character.\n\nNote that after backspacing an empty text, the text will continue to be empty.\n\nCan you solve it in `O(N)` time and `O(1)` space?",
      functionName: "backspaceCompare",
      parameters: [
        { name: "s", type: "string", description: "First typed string" },
        { name: "t", type: "string", description: "Second typed string" }
      ],
      returnType: "boolean",
      constraints: ["1 <= s.length, t.length <= 200", "s and t only contain lowercase letters and '#' characters."],
      examples: [
        { input: 's = "ab#c", t = "ad#c"', output: "true", explanation: "Both become 'ac'." },
        { input: 's = "ab##", t = "c#d#"', output: "true", explanation: "Both become ''." },
        { input: 's = "a#c", t = "b"', output: "false", explanation: "'c' vs 'b'." }
      ],
      optimalSolution: `function backspaceCompare(s, t) {\n  let i = s.length - 1, j = t.length - 1;\n  let skipS = 0, skipT = 0;\n  while (i >= 0 || j >= 0) {\n    while (i >= 0) {\n      if (s[i] === '#') { skipS++; i--; }\n      else if (skipS > 0) { skipS--; i--; }\n      else break;\n    }\n    while (j >= 0) {\n      if (t[j] === '#') { skipT++; j--; }\n      else if (skipT > 0) { skipT--; j--; }\n      else break;\n    }\n    if (i >= 0 && j >= 0 && s[i] !== t[j]) return false;\n    if ((i >= 0) !== (j >= 0)) return false;\n    i--; j--;\n  }\n  return true;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function backspaceCompare(s, t) {\n  function build(str) {\n    const stack = [];\n    for (const c of str) {\n      if (c === '#') stack.pop(); else stack.push(c);\n    }\n    return stack.join('');\n  }\n  return build(s) === build(t);\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Simulating forwards which requires stack (O(N) space) instead of backwards O(1) space"],
      hints: [
        "Iterate backwards from the end of both strings.",
        "Count '#' characters to know how many upcoming letters to skip.",
        "Compare characters when both strings have an active, non-backspaced character."
      ],
      oracleFn: (s: string, t: string) => {
        let i = s.length - 1, j = t.length - 1;
        let skipS = 0, skipT = 0;
        while (i >= 0 || j >= 0) {
          while (i >= 0) {
            if (s[i] === '#') { skipS++; i--; }
            else if (skipS > 0) { skipS--; i--; }
            else break;
          }
          while (j >= 0) {
            if (t[j] === '#') { skipT++; j--; }
            else if (skipT > 0) { skipT--; j--; }
            else break;
          }
          if (i >= 0 && j >= 0 && s[i] !== t[j]) return false;
          if ((i >= 0) !== (j >= 0)) return false;
          i--; j--;
        }
        return true;
      },
      testCases: {
        functional: [
          ["ab#c", "ad#c"],
          ["ab##", "c#d#"],
          ["a#c", "b"]
        ],
        boundary: [
          ["#", "#"],
          ["###", ""],
          ["a", "a"],
          ["a", "b"]
        ],
        adversarial: [
          ["bxj##tw", "bxj###tw"],
          ["bbbextm", "bbb#extm"],
          ["nzp#o#g", "b#nzp#o#g"]
        ],
        stress: [
          ["a#".repeat(100), "b#".repeat(100)],
          ["a".repeat(100) + "#".repeat(50), "a".repeat(50)]
        ]
      }
    }),

    // 61. Is Subsequence
    createProblem({
      num: 61,
      title: "Is Subsequence",
      slug: "is-subsequence",
      level: 3,
      difficulty: "EASY",
      topic: "Two Pointers",
      patternSlug: "two-pointers",
      estimatedTimeMin: 15,
      statement: "Given two strings `s` and `t`, return `true` if `s` is a subsequence of `t`, or `false` otherwise.\n\nA subsequence of a string is a new string that is formed from the original string by deleting some (can be none) of the characters without disturbing the relative positions of the remaining characters.",
      functionName: "isSubsequence",
      parameters: [
        { name: "s", type: "string", description: "Subsequence candidate" },
        { name: "t", type: "string", description: "Target string" }
      ],
      returnType: "boolean",
      constraints: ["0 <= s.length <= 100", "0 <= t.length <= 10^4", "s and t consist only of lowercase English letters."],
      examples: [
        { input: 's = "abc", t = "ahbgdc"', output: "true", explanation: "'a', 'b', 'c' appear in order." },
        { input: 's = "axc", t = "ahbgdc"', output: "false", explanation: "'x' does not appear." }
      ],
      optimalSolution: `function isSubsequence(s, t) {\n  let i = 0, j = 0;\n  while (i < s.length && j < t.length) {\n    if (s[i] === t[j]) i++;\n    j++;\n  }\n  return i === s.length;\n}`,
      optimalTimeComplexity: "O(T)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function isSubsequence(s, t) {\n  let last = -1;\n  for (const c of s) {\n    last = t.indexOf(c, last + 1);\n    if (last === -1) return false;\n  }\n  return true;\n}`,
      suboptimalTimeComplexity: "O(S * T)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Empty string s edge case (empty string is always a subsequence)"],
      hints: [
        "Maintain a pointer i for s and pointer j for t.",
        "Advance i whenever s[i] matches t[j]. Always advance j.",
        "If i reaches s.length, all characters were found in order."
      ],
      oracleFn: (s: string, t: string) => {
        let i = 0, j = 0;
        while (i < s.length && j < t.length) {
          if (s[i] === t[j]) i++;
          j++;
        }
        return i === s.length;
      },
      testCases: {
        functional: [
          ["abc", "ahbgdc"],
          ["axc", "ahbgdc"],
          ["", "ahbgdc"]
        ],
        boundary: [
          ["", ""],
          ["b", "c"],
          ["a", "a"],
          ["aaaaaa", "bbaaaa"]
        ],
        adversarial: [
          ["ace", "abcde"],
          ["aec", "abcde"],
          ["leeeeetcode", "yyyyy"]
        ],
        stress: [
          ["abc", "a".repeat(1000) + "b".repeat(1000) + "c".repeat(1000)],
          ["z".repeat(100), "z".repeat(99)]
        ]
      }
    }),

    // 62. Two Sum Less Than K
    createProblem({
      num: 62,
      title: "Two Sum Less Than K",
      slug: "two-sum-less-than-k",
      level: 3,
      difficulty: "EASY",
      topic: "Two Pointers",
      patternSlug: "two-pointers",
      estimatedTimeMin: 15,
      statement: "Given an array `nums` of integers and integer `k`, return the maximum sum `nums[i] + nums[j]` such that `i < j` and `nums[i] + nums[j] < k`. If no such `i, j` exist, return `-1`.",
      functionName: "twoSumLessThanK",
      parameters: [
        { name: "nums", type: "number[]", description: "Array of integers" },
        { name: "k", type: "number", description: "Strict upper bound" }
      ],
      returnType: "number",
      constraints: ["1 <= nums.length <= 100", "1 <= nums[i] <= 1000", "1 <= k <= 2000"],
      examples: [
        { input: "nums = [34,23,1,24,75,33,54,8], k = 60", output: "58", explanation: "34 + 24 = 58 < 60." },
        { input: "nums = [10,20,30], k = 15", output: "-1", explanation: "No pair sum < 15." }
      ],
      optimalSolution: `function twoSumLessThanK(nums, k) {\n  nums.sort((a, b) => a - b);\n  let left = 0, right = nums.length - 1, max = -1;\n  while (left < right) {\n    const sum = nums[left] + nums[right];\n    if (sum < k) {\n      max = Math.max(max, sum);\n      left++;\n    } else {\n      right--;\n    }\n  }\n  return max;\n}`,
      optimalTimeComplexity: "O(N log N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function twoSumLessThanK(nums, k) {\n  let max = -1;\n  for (let i = 0; i < nums.length; i++)\n    for (let j = i + 1; j < nums.length; j++) {\n      const s = nums[i] + nums[j];\n      if (s < k && s > max) max = s;\n    }\n  return max;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Allowing sum === k (problem states strictly less than k)"],
      hints: [
        "Sort nums in ascending order.",
        "Use two pointers at opposite ends.",
        "If sum < k, record it and increment left; otherwise decrement right."
      ],
      oracleFn: (nums: number[], k: number) => {
        nums.sort((a, b) => a - b);
        let left = 0, right = nums.length - 1, max = -1;
        while (left < right) {
          const sum = nums[left] + nums[right];
          if (sum < k) {
            max = Math.max(max, sum);
            left++;
          } else {
            right--;
          }
        }
        return max;
      },
      testCases: {
        functional: [
          [[34, 23, 1, 24, 75, 33, 54, 8], 60],
          [[10, 20, 30], 15],
          [[1, 2], 4]
        ],
        boundary: [
          [[1], 10],
          [[5, 5], 10],
          [[5, 5], 11],
          [[100, 100], 200]
        ],
        adversarial: [
          [[34, 23, 1, 24, 75, 33, 54, 8], 2],
          [[1, 2, 3, 4, 5, 6, 7], 14]
        ],
        stress: [
          [Array.from({ length: 100 }, (_, i) => i + 1), 100],
          [Array.from({ length: 100 }, () => 10), 20]
        ]
      }
    }),

    // 63. Boats to Save People
    createProblem({
      num: 63,
      title: "Boats to Save People",
      slug: "boats-to-save-people",
      level: 3,
      difficulty: "MEDIUM",
      topic: "Two Pointers / Greedy",
      patternSlug: "two-pointers",
      estimatedTimeMin: 20,
      statement: "You are given an array `people` where `people[i]` is the weight of the `i`th person, and an infinite number of boats where each boat can carry a maximum weight of `limit`.\n\nEach boat carries at most two people at the same time, provided the sum of the weight of those people is at most `limit`.\n\nReturn the minimum number of boats to carry every given person.",
      functionName: "numRescueBoats",
      parameters: [
        { name: "people", type: "number[]", description: "Array of weights" },
        { name: "limit", type: "number", description: "Boat weight limit" }
      ],
      returnType: "number",
      constraints: ["1 <= people.length <= 5 * 10^4", "1 <= people[i] <= limit <= 3 * 10^4"],
      examples: [
        { input: "people = [1,2], limit = 3", output: "1", explanation: "1 boat (1, 2)." },
        { input: "people = [3,2,2,1], limit = 3", output: "3", explanation: "3 boats (1, 2), (2), (3)." },
        { input: "people = [3,5,3,4], limit = 5", output: "4", explanation: "4 boats (3), (3), (4), (5)." }
      ],
      optimalSolution: `function numRescueBoats(people, limit) {\n  people.sort((a, b) => a - b);\n  let left = 0, right = people.length - 1, boats = 0;\n  while (left <= right) {\n    if (people[left] + people[right] <= limit) left++;\n    right--;\n    boats++;\n  }\n  return boats;\n}`,
      optimalTimeComplexity: "O(N log N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function numRescueBoats(people, limit) {\n  people.sort((a, b) => a - b);\n  let left = 0, right = people.length - 1, boats = 0;\n  while (left <= right) {\n    if (left === right) { boats++; break; }\n    if (people[left] + people[right] <= limit) { left++; right--; }\n    else right--;\n    boats++;\n  }\n  return boats;\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Trying to put more than 2 people in one boat (limit is at most 2 people)"],
      hints: [
        "Sort people by weight.",
        "Greedily pair the heaviest person with the lightest person if their combined weight <= limit.",
        "The heaviest person always takes a boat."
      ],
      oracleFn: (people: number[], limit: number) => {
        people.sort((a, b) => a - b);
        let left = 0, right = people.length - 1, boats = 0;
        while (left <= right) {
          if (people[left] + people[right] <= limit) left++;
          right--;
          boats++;
        }
        return boats;
      },
      testCases: {
        functional: [
          [[1, 2], 3],
          [[3, 2, 2, 1], 3],
          [[3, 5, 3, 4], 5]
        ],
        boundary: [
          [[3], 3],
          [[3, 3], 3],
          [[1, 1, 1], 2],
          [[5, 5, 5], 5]
        ],
        adversarial: [
          [[2, 49, 10, 7, 11, 41, 47, 2, 22, 6], 50],
          [[5, 1, 4, 2], 6],
          [[3, 8, 7, 1, 4], 9]
        ],
        stress: [
          [Array.from({ length: 2000 }, () => 1), 2],
          [Array.from({ length: 3000 }, (_, i) => (i % 50) + 1), 60]
        ]
      }
    }),

    // 64. Interval List Intersections
    createProblem({
      num: 64,
      title: "Interval List Intersections",
      slug: "interval-list-intersections",
      level: 3,
      difficulty: "MEDIUM",
      topic: "Two Pointers",
      patternSlug: "two-pointers",
      estimatedTimeMin: 20,
      statement: "You are given two lists of closed intervals, `firstList` and `secondList`, where `firstList[i] = [starti, endi]` and `secondList[j] = [startj, endj]`.\n\nReturn the intersection of these two interval lists.\n\nA closed interval `[a, b]` (with `a <= b`) denotes the set of real numbers `x` with `a <= x <= b`.",
      functionName: "intervalIntersection",
      parameters: [
        { name: "firstList", type: "number[][]", description: "First interval list" },
        { name: "secondList", type: "number[][]", description: "Second interval list" }
      ],
      returnType: "number[][]",
      constraints: ["0 <= firstList.length, secondList.length <= 1000", "firstList[i].length == 2", "secondList[j].length == 2", "starti <= endi", "startj <= endj"],
      examples: [
        { input: "firstList = [[0,2],[5,10],[13,23],[24,25]], secondList = [[1,5],[8,12],[15,24],[25,26]]", output: "[[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]", explanation: "Intersections of overlapping ranges." },
        { input: "firstList = [[1,3],[5,9]], secondList = []", output: "[]", explanation: "No overlap with empty list." }
      ],
      optimalSolution: `function intervalIntersection(firstList, secondList) {\n  let i = 0, j = 0;\n  const res = [];\n  while (i < firstList.length && j < secondList.length) {\n    const low = Math.max(firstList[i][0], secondList[j][0]);\n    const high = Math.min(firstList[i][1], secondList[j][1]);\n    if (low <= high) res.push([low, high]);\n    if (firstList[i][1] < secondList[j][1]) i++;\n    else j++;\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(M + N)",
      optimalSpaceComplexity: "O(1) extra space",
      suboptimalSolution: `function intervalIntersection(firstList, secondList) {\n  const res = [];\n  for (const [s1, e1] of firstList)\n    for (const [s2, e2] of secondList) {\n      const l = Math.max(s1, s2), r = Math.min(e1, e2);\n      if (l <= r) res.push([l, r]);\n    }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(M * N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Advancing the interval with smaller start instead of smaller END"],
      hints: [
        "Overlap between [s1, e1] and [s2, e2] is [max(s1, s2), min(e1, e2)] if max <= min.",
        "Discard the interval that finishes earlier (smaller end value) because it cannot intersect any future interval."
      ],
      oracleFn: (firstList: number[][], secondList: number[][]) => {
        let i = 0, j = 0;
        const res: number[][] = [];
        while (i < firstList.length && j < secondList.length) {
          const low = Math.max(firstList[i][0], secondList[j][0]);
          const high = Math.min(firstList[i][1], secondList[j][1]);
          if (low <= high) res.push([low, high]);
          if (firstList[i][1] < secondList[j][1]) i++;
          else j++;
        }
        return res;
      },
      testCases: {
        functional: [
          [[[0, 2], [5, 10], [13, 23], [24, 25]], [[1, 5], [8, 12], [15, 24], [25, 26]]],
          [[[1, 3], [5, 9]], []],
          [[], [[4, 8], [10, 12]]]
        ],
        boundary: [
          [[[1, 7]], [[3, 10]]],
          [[[1, 2]], [[3, 4]]],
          [[[5, 5]], [[5, 5]]],
          [[[1, 10]], [[2, 3], [4, 5], [6, 7]]]
        ],
        adversarial: [
          [[[14, 16]], [[7, 13], [16, 20]]],
          [[[3, 5], [8, 10]], [[4, 6], [7, 9]]]
        ],
        stress: [
          [Array.from({ length: 500 }, (_, i) => [i * 2, i * 2 + 1]), Array.from({ length: 500 }, (_, i) => [i * 2 + 1, i * 2 + 2])],
          [Array.from({ length: 500 }, (_, i) => [i * 3, i * 3 + 2]), Array.from({ length: 500 }, (_, i) => [i * 3 + 1, i * 3 + 3])]
        ]
      }
    }),

    // 65. Partition Labels
    createProblem({
      num: 65,
      title: "Partition Labels",
      slug: "partition-labels",
      level: 3,
      difficulty: "MEDIUM",
      topic: "Two Pointers / Greedy",
      patternSlug: "two-pointers",
      estimatedTimeMin: 20,
      statement: "You are given a string `s`. We want to partition the string into as many parts as possible so that each letter appears in at most one part.\n\nNote that the partition is done so that after concatenating all the parts in order, the resultant string should be `s`.\n\nReturn a list of integers representing the size of these parts.",
      functionName: "partitionLabels",
      parameters: [{ name: "s", type: "string", description: "Input string" }],
      returnType: "number[]",
      constraints: ["1 <= s.length <= 500", "s consists of lowercase English letters."],
      examples: [
        { input: 's = "ababcbacadefegdehijhklij"', output: "[9,7,8]", explanation: "'ababcbaca' (9), 'defegde' (7), 'hijhklij' (8)." },
        { input: 's = "eccbbbbdec"', output: "[10]", explanation: "'e' and 'c' span the entire string." }
      ],
      optimalSolution: `function partitionLabels(s) {\n  const last = new Map();\n  for (let i = 0; i < s.length; i++) last.set(s[i], i);\n  let start = 0, end = 0;\n  const res = [];\n  for (let i = 0; i < s.length; i++) {\n    end = Math.max(end, last.get(s[i]));\n    if (i === end) {\n      res.push(end - start + 1);\n      start = i + 1;\n    }\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function partitionLabels(s) {\n  const last = {};\n  for (let i = 0; i < s.length; i++) last[s[i]] = i;\n  const res = [];\n  let start = 0, end = 0;\n  for (let i = 0; i < s.length; i++) {\n    end = Math.max(end, last[s[i]]);\n    if (i === end) {\n      res.push(end - start + 1);\n      start = i + 1;\n    }\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Splitting partition before reaching the last occurrence of all letters inside it"],
      hints: [
        "Precompute the last index where each character appears.",
        "As you iterate, expand the current partition's end to max(end, last[s[i]]).",
        "When i reaches end, a valid partition boundary is found."
      ],
      oracleFn: (s: string) => {
        const last = new Map<string, number>();
        for (let i = 0; i < s.length; i++) last.set(s[i], i);
        let start = 0, end = 0;
        const res: number[] = [];
        for (let i = 0; i < s.length; i++) {
          end = Math.max(end, last.get(s[i])!);
          if (i === end) {
            res.push(end - start + 1);
            start = i + 1;
          }
        }
        return res;
      },
      testCases: {
        functional: [
          ["ababcbacadefegdehijhklij"],
          ["eccbbbbdec"],
          ["abcdefg"]
        ],
        boundary: [
          ["a"],
          ["aaaa"],
          ["ab"],
          ["aba"]
        ],
        adversarial: [
          ["caedbdedda"],
          ["qiejxqfnqcehyxz"],
          ["abcabczzz"]
        ],
        stress: [
          ["a".repeat(250) + "b".repeat(250)],
          [Array.from({ length: 500 }, (_, i) => String.fromCharCode(97 + (i % 26))).join('')]
        ]
      }
    }),

    // 66. String Compression
    createProblem({
      num: 66,
      title: "String Compression",
      slug: "string-compression",
      level: 3,
      difficulty: "MEDIUM",
      topic: "Two Pointers",
      patternSlug: "two-pointers",
      estimatedTimeMin: 20,
      statement: "Given an array of characters `chars`, compress it using the following algorithm:\n\nBegin with an empty string `s`. For each group of consecutive repeating characters in `chars`:\n- If group length is 1, append the character to `s`.\n- Otherwise, append the character followed by the group's length.\n\nReturn the new length of the array after in-place modification.",
      functionName: "compress",
      parameters: [{ name: "chars", type: "string[]", description: "Character array modified in-place" }],
      returnType: "number",
      constraints: ["1 <= chars.length <= 2000", "chars[i] is a lowercase English letter, uppercase letter, digit, or symbol."],
      examples: [
        { input: 'chars = ["a","a","b","b","c","c","c"]', output: "6", explanation: 'Modified to ["a","2","b","2","c","3"], length 6.' },
        { input: 'chars = ["a"]', output: "1", explanation: 'Length 1.' },
        { input: 'chars = ["a","b","b","b","b","b","b","b","b","b","b","b","b"]', output: "4", explanation: 'Modified to ["a","b","1","2"], length 4.' }
      ],
      optimalSolution: `function compress(chars) {\n  let write = 0, read = 0;\n  while (read < chars.length) {\n    const char = chars[read];\n    let count = 0;\n    while (read < chars.length && chars[read] === char) {\n      read++; count++;\n    }\n    chars[write++] = char;\n    if (count > 1) {\n      for (const digit of String(count)) chars[write++] = digit;\n    }\n  }\n  return write;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function compress(chars) {\n  let write = 0, i = 0;\n  while (i < chars.length) {\n    let j = i;\n    while (j < chars.length && chars[j] === chars[i]) j++;\n    chars[write++] = chars[i];\n    const len = j - i;\n    if (len > 1) {\n      for (const d of len.toString()) chars[write++] = d;\n    }\n    i = j;\n  }\n  return write;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Multi-digit counts: count 12 must be written as '1' and '2' across two slots"],
      hints: [
        "Use read and write pointers.",
        "Count length of each contiguous character block.",
        "If count > 1, convert to string and write each digit into chars[write++]."
      ],
      oracleFn: (chars: string[]) => {
        let write = 0, read = 0;
        while (read < chars.length) {
          const char = chars[read];
          let count = 0;
          while (read < chars.length && chars[read] === char) {
            read++; count++;
          }
          chars[write++] = char;
          if (count > 1) {
            for (const digit of String(count)) chars[write++] = digit;
          }
        }
        return write;
      },
      testCases: {
        functional: [
          [["a", "a", "b", "b", "c", "c", "c"]],
          [["a"]],
          [["a", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b"]]
        ],
        boundary: [
          [["z"]],
          [["a", "a"]],
          [["a", "b"]],
          [["a", "a", "a", "a", "a", "a", "a", "a", "a", "a"]]
        ],
        adversarial: [
          [["o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o"]],
          [["a", "b", "c", "d", "e"]],
          [["#", "#", "#", "$", "$"]]
        ],
        stress: [
          [Array.from({ length: 1500 }, () => "a")],
          [Array.from({ length: 2000 }, (_, i) => String.fromCharCode(97 + Math.floor(i / 100)))]
        ]
      }
    }),

    // 67. Next Permutation
    createProblem({
      num: 67,
      title: "Next Permutation",
      slug: "next-permutation",
      level: 3,
      difficulty: "MEDIUM",
      topic: "Two Pointers",
      patternSlug: "two-pointers",
      estimatedTimeMin: 25,
      statement: "A permutation of an array of integers is an arrangement of its members into a sequence or linear order.\n\nGiven an array of integers `nums`, find the next lexicographical permutation of its elements.\n\nIf such an arrangement is not possible, the array must be rearranged as the lowest possible order (i.e., sorted in ascending order).\n\nThe replacement must be in place and use only constant extra memory.",
      functionName: "nextPermutation",
      parameters: [{ name: "nums", type: "number[]", description: "Array modified in place" }],
      returnType: "number[]",
      constraints: ["1 <= nums.length <= 100", "0 <= nums[i] <= 100"],
      examples: [
        { input: "nums = [1,2,3]", output: "[1,3,2]", explanation: "Next permutation is [1, 3, 2]." },
        { input: "nums = [3,2,1]", output: "[1,2,3]", explanation: "Highest permutation wraps to lowest [1, 2, 3]." },
        { input: "nums = [1,1,5]", output: "[1,5,1]", explanation: "Next permutation is [1, 5, 1]." }
      ],
      optimalSolution: `function nextPermutation(nums) {\n  let i = nums.length - 2;\n  while (i >= 0 && nums[i] >= nums[i + 1]) i--;\n  if (i >= 0) {\n    let j = nums.length - 1;\n    while (nums[j] <= nums[i]) j--;\n    [nums[i], nums[j]] = [nums[j], nums[i]];\n  }\n  let l = i + 1, r = nums.length - 1;\n  while (l < r) {\n    [nums[l], nums[r]] = [nums[r], nums[l]];\n    l++; r--;\n  }\n  return nums;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function nextPermutation(nums) {\n  let i = nums.length - 2;\n  while (i >= 0 && nums[i] >= nums[i + 1]) i--;\n  if (i >= 0) {\n    let j = nums.length - 1;\n    while (nums[j] <= nums[i]) j--;\n    [nums[i], nums[j]] = [nums[j], nums[i]];\n  }\n  let tail = nums.slice(i + 1).sort((a, b) => a - b);\n  for (let k = 0; k < tail.length; k++) nums[i + 1 + k] = tail[k];\n  return nums;\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Failing to reverse the suffix after swapping (suffix is descending, so reversing it makes it ascending in O(N))"],
      hints: [
        "Find the first decreasing element nums[i] from right to left.",
        "Find the element nums[j] to the right of i that is strictly greater than nums[i].",
        "Swap nums[i] and nums[j], then reverse the suffix from i + 1 to the end."
      ],
      oracleFn: (nums: number[]) => {
        let i = nums.length - 2;
        while (i >= 0 && nums[i] >= nums[i + 1]) i--;
        if (i >= 0) {
          let j = nums.length - 1;
          while (nums[j] <= nums[i]) j--;
          [nums[i], nums[j]] = [nums[j], nums[i]];
        }
        let l = i + 1, r = nums.length - 1;
        while (l < r) {
          [nums[l], nums[r]] = [nums[r], nums[l]];
          l++; r--;
        }
        return nums;
      },
      testCases: {
        functional: [
          [[1, 2, 3]],
          [[3, 2, 1]],
          [[1, 1, 5]]
        ],
        boundary: [
          [[1]],
          [[1, 2]],
          [[2, 1]],
          [[1, 1, 1]]
        ],
        adversarial: [
          [[1, 3, 2]],
          [[2, 3, 1, 3, 3]],
          [[1, 5, 8, 4, 7, 6, 5, 3, 1]]
        ],
        stress: [
          [Array.from({ length: 100 }, (_, i) => 100 - i)],
          [Array.from({ length: 100 }, (_, i) => i)]
        ]
      }
    }),

    // 68. Shortest Unsorted Continuous Subarray
    createProblem({
      num: 68,
      title: "Shortest Unsorted Continuous Subarray",
      slug: "shortest-unsorted-continuous-subarray",
      level: 3,
      difficulty: "MEDIUM",
      topic: "Two Pointers",
      patternSlug: "two-pointers",
      estimatedTimeMin: 20,
      statement: "Given an integer array `nums`, you need to find one continuous subarray that if you only sort this subarray in ascending order, then the whole array will be sorted in ascending order.\n\nReturn the shortest such subarray and output its length.",
      functionName: "findUnsortedSubarray",
      parameters: [{ name: "nums", type: "number[]", description: "Array of integers" }],
      returnType: "number",
      constraints: ["1 <= nums.length <= 10^4", "-10^5 <= nums[i] <= 10^5"],
      examples: [
        { input: "nums = [2,6,4,8,10,9,15]", output: "5", explanation: "Sorting [6, 4, 8, 10, 9] yields fully sorted array." },
        { input: "nums = [1,2,3,4]", output: "0", explanation: "Already sorted." },
        { input: "nums = [1]", output: "0", explanation: "Single element." }
      ],
      optimalSolution: `function findUnsortedSubarray(nums) {\n  let n = nums.length;\n  let max = -Infinity, min = Infinity;\n  let end = -1, start = -1;\n  for (let i = 0; i < n; i++) {\n    max = Math.max(max, nums[i]);\n    if (nums[i] < max) end = i;\n    const j = n - 1 - i;\n    min = Math.min(min, nums[j]);\n    if (nums[j] > min) start = j;\n  }\n  return end === -1 ? 0 : end - start + 1;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function findUnsortedSubarray(nums) {\n  const sorted = [...nums].sort((a, b) => a - b);\n  let start = -1, end = -1;\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] !== sorted[i]) {\n      if (start === -1) start = i;\n      end = i;\n    }\n  }\n  return start === -1 ? 0 : end - start + 1;\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Sorting the array which takes O(N log N) time and O(N) space"],
      hints: [
        "The right boundary is the last element smaller than the running maximum from the left.",
        "The left boundary is the last element greater than the running minimum from the right.",
        "Both boundaries can be found simultaneously in a single pass."
      ],
      oracleFn: (nums: number[]) => {
        let n = nums.length;
        let max = -Infinity, min = Infinity;
        let end = -1, start = -1;
        for (let i = 0; i < n; i++) {
          max = Math.max(max, nums[i]);
          if (nums[i] < max) end = i;
          const j = n - 1 - i;
          min = Math.min(min, nums[j]);
          if (nums[j] > min) start = j;
        }
        return end === -1 ? 0 : end - start + 1;
      },
      testCases: {
        functional: [
          [[2, 6, 4, 8, 10, 9, 15]],
          [[1, 2, 3, 4]],
          [[1]]
        ],
        boundary: [
          [[2, 1]],
          [[1, 3, 2, 2, 2]],
          [[1, 2, 3, 3, 3]],
          [[5, 4, 3, 2, 1]]
        ],
        adversarial: [
          [[1, 3, 2, 4, 5]],
          [[2, 3, 3, 2, 4]],
          [[1, 2, 5, 3, 4]]
        ],
        stress: [
          [Array.from({ length: 3000 }, (_, i) => i === 1500 ? 0 : i)],
          [Array.from({ length: 4000 }, (_, i) => 4000 - i)]
        ]
      }
    }),

    // 69. Valid Triangle Number
    createProblem({
      num: 69,
      title: "Valid Triangle Number",
      slug: "valid-triangle-number",
      level: 3,
      difficulty: "MEDIUM",
      topic: "Two Pointers",
      patternSlug: "two-pointers",
      estimatedTimeMin: 20,
      statement: "Given an integer array `nums`, return the number of triplets chosen from the array that can make triangles if we take them as side lengths of a triangle.\n\nThree side lengths `a, b, c` form a valid triangle if `a + b > c`, `a + c > b`, and `b + c > a`.",
      functionName: "triangleNumber",
      parameters: [{ name: "nums", type: "number[]", description: "Array of integers" }],
      returnType: "number",
      constraints: ["1 <= nums.length <= 1000", "0 <= nums[i] <= 1000"],
      examples: [
        { input: "nums = [2,2,3,4]", output: "3", explanation: "Valid combinations: 2,3,4 (using 1st 2), 2,3,4 (using 2nd 2), 2,2,3." },
        { input: "nums = [4,2,3,4]", output: "4", explanation: "4 valid combinations." }
      ],
      optimalSolution: `function triangleNumber(nums) {\n  nums.sort((a, b) => a - b);\n  let count = 0;\n  for (let k = nums.length - 1; k >= 2; k--) {\n    let l = 0, r = k - 1;\n    while (l < r) {\n      if (nums[l] + nums[r] > nums[k]) {\n        count += r - l;\n        r--;\n      } else {\n        l++;\n      }\n    }\n  }\n  return count;\n}`,
      optimalTimeComplexity: "O(N^2)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function triangleNumber(nums) {\n  let count = 0;\n  nums.sort((a, b) => a - b);\n  for (let i = 0; i < nums.length; i++)\n    for (let j = i + 1; j < nums.length; j++)\n      for (let k = j + 1; k < nums.length; k++)\n        if (nums[i] + nums[j] > nums[k]) count++;\n  return count;\n}`,
      suboptimalTimeComplexity: "O(N^3)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Zero side lengths cannot form a triangle", "Missing the property that if sorted, nums[l] + nums[r] > nums[k] means all indices from l to r-1 also satisfy it with r"],
      hints: [
        "Sort the array ascending.",
        "Fix the longest side nums[k] starting from the end.",
        "If nums[l] + nums[r] > nums[k], then every index between l and r-1 will also satisfy the triangle inequality with nums[r], adding r - l pairs at once."
      ],
      oracleFn: (nums: number[]) => {
        nums.sort((a, b) => a - b);
        let count = 0;
        for (let k = nums.length - 1; k >= 2; k--) {
          let l = 0, r = k - 1;
          while (l < r) {
            if (nums[l] + nums[r] > nums[k]) {
              count += r - l;
              r--;
            } else {
              l++;
            }
          }
        }
        return count;
      },
      testCases: {
        functional: [
          [[2, 2, 3, 4]],
          [[4, 2, 3, 4]],
          [[0, 1, 0]]
        ],
        boundary: [
          [[0, 0, 0]],
          [[1, 1, 1]],
          [[1, 2, 3]],
          [[3, 4, 5]]
        ],
        adversarial: [
          [[7, 0, 0, 0]],
          [[24, 3, 82, 22, 35, 84, 19]],
          [[1, 1, 1, 1, 1]]
        ],
        stress: [
          [Array.from({ length: 300 }, (_, i) => i + 1)],
          [Array.from({ length: 400 }, () => 10)]
        ]
      }
    }),

    // 70. 3Sum With Multiplicity
    createProblem({
      num: 70,
      title: "3Sum With Multiplicity",
      slug: "3sum-with-multiplicity",
      level: 3,
      difficulty: "MEDIUM",
      topic: "Two Pointers / Hashing",
      patternSlug: "two-pointers",
      estimatedTimeMin: 20,
      statement: "Given an integer array `arr`, and an integer `target`, return the number of tuples `i, j, k` such that `i < j < k` and `arr[i] + arr[j] + arr[k] == target`.\n\nAs the answer can be very large, return it modulo `10^9 + 7`.",
      functionName: "threeSumMulti",
      parameters: [
        { name: "arr", type: "number[]", description: "Array of integers" },
        { name: "target", type: "number", description: "Target sum" }
      ],
      returnType: "number",
      constraints: ["3 <= arr.length <= 3000", "0 <= arr[i] <= 100", "0 <= target <= 300"],
      examples: [
        { input: "arr = [1,1,2,2,3,3,4,4,5,5], target = 8", output: "20", explanation: "20 distinct index combinations." },
        { input: "arr = [1,1,2,2,2,2], target = 5", output: "12", explanation: "12 combinations." }
      ],
      optimalSolution: `function threeSumMulti(arr, target) {\n  const MOD = 1e9 + 7;\n  const count = new Array(101).fill(0);\n  for (const x of arr) count[x]++;\n  let ans = 0;\n  for (let i = 0; i <= 100; i++) {\n    for (let j = i; j <= 100; j++) {\n      const k = target - i - j;\n      if (k < j || k > 100) continue;\n      if (count[i] === 0 || count[j] === 0 || count[k] === 0) continue;\n      if (i === j && j === k) {\n        ans = (ans + (count[i] * (count[i] - 1) * (count[i] - 2)) / 6) % MOD;\n      } else if (i === j && j !== k) {\n        ans = (ans + ((count[i] * (count[i] - 1)) / 2) * count[k]) % MOD;\n      } else if (i !== j && j === k) {\n        ans = (ans + count[i] * ((count[j] * (count[j] - 1)) / 2)) % MOD;\n      } else {\n        ans = (ans + count[i] * count[j] * count[k]) % MOD;\n      }\n    }\n  }\n  return ans;\n}`,
      optimalTimeComplexity: "O(N + W^2) where W=100",
      optimalSpaceComplexity: "O(W)",
      suboptimalSolution: `function threeSumMulti(arr, target) {\n  const MOD = 1e9 + 7;\n  let ans = 0;\n  for (let i = 0; i < arr.length; i++)\n    for (let j = i + 1; j < arr.length; j++)\n      for (let k = j + 1; k < arr.length; k++)\n        if (arr[i] + arr[j] + arr[k] === target) ans = (ans + 1) % MOD;\n  return ans;\n}`,
      suboptimalTimeComplexity: "O(N^3)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Combinatorics edge cases when all 3 numbers are equal vs 2 numbers equal"],
      hints: [
        "Notice the values in arr are bounded between 0 and 100.",
        "Count the frequency of each number from 0 to 100.",
        "Iterate over unique pairs (i, j) where i <= j and k = target - i - j >= j.",
        "Use combinations formulas nC3 and nC2."
      ],
      oracleFn: (arr: number[], target: number) => {
        const MOD = 1e9 + 7;
        const count = new Array(101).fill(0);
        for (const x of arr) count[x]++;
        let ans = 0;
        for (let i = 0; i <= 100; i++) {
          for (let j = i; j <= 100; j++) {
            const k = target - i - j;
            if (k < j || k > 100) continue;
            if (count[i] === 0 || count[j] === 0 || count[k] === 0) continue;
            if (i === j && j === k) {
              ans = (ans + (count[i] * (count[i] - 1) * (count[i] - 2)) / 6) % MOD;
            } else if (i === j && j !== k) {
              ans = (ans + ((count[i] * (count[i] - 1)) / 2) * count[k]) % MOD;
            } else if (i !== j && j === k) {
              ans = (ans + count[i] * ((count[j] * (count[j] - 1)) / 2)) % MOD;
            } else {
              ans = (ans + count[i] * count[j] * count[k]) % MOD;
            }
          }
        }
        return ans;
      },
      testCases: {
        functional: [
          [[1, 1, 2, 2, 3, 3, 4, 4, 5, 5], 8],
          [[1, 1, 2, 2, 2, 2], 5],
          [[0, 0, 0], 0]
        ],
        boundary: [
          [[0, 0, 0, 0], 0],
          [[100, 100, 100], 300],
          [[1, 2, 3], 6],
          [[1, 2, 3], 7]
        ],
        adversarial: [
          [[1, 1, 1, 1, 1], 3],
          [[2, 1, 3], 6]
        ],
        stress: [
          [Array.from({ length: 1500 }, (_, i) => i % 10), 15],
          [Array.from({ length: 2000 }, () => 0), 0]
        ]
      }
    })
  ];

  return {
    level: 3,
    levelTitle: "Level 3 — Two Pointers",
    topic: "Converging & Fast/Slow Pointers",
    problems
  };
}
