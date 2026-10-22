import { LevelPayload, GeneratedProblem } from './types';
import { createProblem } from './problemBuilder';

export function getLevel2Payload(): LevelPayload {
  const problems: GeneratedProblem[] = [
    // 26. Group Anagrams
    createProblem({
      num: 26,
      title: "Group Anagrams",
      slug: "group-anagrams",
      level: 2,
      difficulty: "MEDIUM",
      topic: "Hashing",
      patternSlug: "hashing-prefix-sum",
      estimatedTimeMin: 20,
      statement: "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
      functionName: "groupAnagrams",
      parameters: [{ name: "strs", type: "string[]", description: "Array of strings" }],
      returnType: "string[][]",
      constraints: ["1 <= strs.length <= 10^4", "0 <= strs[i].length <= 100", "strs[i] consists of lowercase English letters."],
      examples: [
        { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]', explanation: "Grouped by frequency signatures" },
        { input: 'strs = [""]', output: '[[""]]', explanation: "Empty string" },
        { input: 'strs = ["a"]', output: '[["a"]]', explanation: "Single char" }
      ],
      optimalSolution: `function groupAnagrams(strs) {\n  const map = new Map();\n  for (const s of strs) {\n    const count = new Array(26).fill(0);\n    for (let i = 0; i < s.length; i++) count[s.charCodeAt(i) - 97]++;\n    const key = count.join('#');\n    if (!map.has(key)) map.set(key, []);\n    map.get(key).push(s);\n  }\n  const result = Array.from(map.values());\n  for (const group of result) group.sort();\n  return result.sort((a, b) => a.length - b.length || (a[0] || '').localeCompare(b[0] || ''));\n}`,
      optimalTimeComplexity: "O(N * K)",
      optimalSpaceComplexity: "O(N * K)",
      suboptimalSolution: `function groupAnagrams(strs) {\n  const map = new Map();\n  for (const s of strs) {\n    const key = s.split('').sort().join('');\n    if (!map.has(key)) map.set(key, []);\n    map.get(key).push(s);\n  }\n  const result = Array.from(map.values());\n  for (const group of result) group.sort();\n  return result.sort((a, b) => a.length - b.length || (a[0] || '').localeCompare(b[0] || ''));\n}`,
      suboptimalTimeComplexity: "O(N * K log K)",
      suboptimalSpaceComplexity: "O(N * K)",
      commonMistakes: ["Sorting strings which adds O(K log K) overhead", "Delimiter collisions in frequency string without separators"],
      hints: [
        "Words are anagrams if their character counts are identical.",
        "Generate a 26-element character count tuple as the hash map key.",
        "Group words by key in a Hash Map.",
        "Sort each group to ensure deterministic testing."
      ],
      oracleFn: (strs: string[]) => {
        const map = new Map<string, string[]>();
        for (const s of strs) {
          const count = new Array(26).fill(0);
          for (let i = 0; i < s.length; i++) count[s.charCodeAt(i) - 97]++;
          const key = count.join('#');
          if (!map.has(key)) map.set(key, []);
          map.get(key)!.push(s);
        }
        const res = Array.from(map.values());
        for (const g of res) g.sort();
        return res.sort((a, b) => a.length - b.length || (a[0] || '').localeCompare(b[0] || ''));
      },
      testCases: {
        functional: [
          [["eat", "tea", "tan", "ate", "nat", "bat"]],
          [[""]],
          [["a"]]
        ],
        boundary: [
          [["a", "a", "a"]],
          [["ab", "ba", "abc", "cba", "bca"]],
          [["bdddddddddd", "bbbbbbbbbbc"]],
          [["z"]]
        ],
        adversarial: [
          [["cab", "tin", "pew", "duh", "may", "ill", "buy", "bar", "max", "doc"]],
          [["stop", "pots", "tops", "opts", "post", "spot"]],
          [["listen", "silent", "enlist", "google", "elgoog"]]
        ],
        stress: [
          [Array.from({ length: 1000 }, (_, i) => i % 2 === 0 ? "stop" : "pots")],
          [Array.from({ length: 2000 }, (_, i) => String.fromCharCode(97 + (i % 26)))]
        ]
      }
    }),

    // 27. Top K Frequent Elements
    createProblem({
      num: 27,
      title: "Top K Frequent Elements",
      slug: "top-k-frequent-elements",
      level: 2,
      difficulty: "MEDIUM",
      topic: "Hashing / Bucket Sort",
      patternSlug: "hashing-prefix-sum",
      estimatedTimeMin: 20,
      statement: "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order.",
      functionName: "topKFrequent",
      parameters: [
        { name: "nums", type: "number[]", description: "Array of integers" },
        { name: "k", type: "number", description: "Number of top elements to return" }
      ],
      returnType: "number[]",
      constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4", "k is in range [1, number of unique elements]", "The answer is guaranteed to be unique."],
      examples: [
        { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]", explanation: "1 appears 3 times, 2 appears 2 times." },
        { input: "nums = [1], k = 1", output: "[1]", explanation: "Single element" }
      ],
      optimalSolution: `function topKFrequent(nums, k) {\n  const freq = new Map();\n  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);\n  const buckets = Array.from({ length: nums.length + 1 }, () => []);\n  for (const [num, count] of freq) buckets[count].push(num);\n  const result = [];\n  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {\n    if (buckets[i].length > 0) result.push(...buckets[i]);\n  }\n  return result.slice(0, k).sort((a, b) => a - b);\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function topKFrequent(nums, k) {\n  const freq = new Map();\n  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);\n  const sorted = Array.from(freq.entries()).sort((a, b) => b[1] - a[1]);\n  return sorted.slice(0, k).map(e => e[0]).sort((a, b) => a - b);\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Using standard full sort O(N log N) instead of bucket sort O(N)", "Off-by-one in frequency buckets count up to N"],
      hints: [
        "First count frequencies with a Hash Map in O(N).",
        "Can you avoid sorting by using the maximum frequency N as bucket indices?",
        "Iterate backwards through frequency buckets from N down to 0."
      ],
      oracleFn: (nums: number[], k: number) => {
        const freq = new Map<number, number>();
        for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);
        const sorted = Array.from(freq.entries()).sort((a, b) => b[1] - a[1]);
        return sorted.slice(0, k).map(e => e[0]).sort((a, b) => a - b);
      },
      testCases: {
        functional: [
          [[1, 1, 1, 2, 2, 3], 2],
          [[1], 1],
          [[4, 1, -1, 2, -1, 2, 3], 2]
        ],
        boundary: [
          [[1, 2], 2],
          [[0, 0, 0, 0], 1],
          [[-5, -5, -5, -2, -2, 10], 1],
          [[1, 2, 3, 4, 5], 3]
        ],
        adversarial: [
          [[5, 3, 1, 1, 1, 3, 73, 1], 2],
          [[-1, -1, -2, -2, -2, 0], 2]
        ],
        stress: [
          [Array.from({ length: 3000 }, (_, i) => i % 5), 3],
          [Array.from({ length: 5000 }, (_, i) => i % 10 === 0 ? 9999 : i), 1]
        ]
      }
    }),

    // 28. Product of Array Except Self
    createProblem({
      num: 28,
      title: "Product of Array Except Self",
      slug: "product-of-array-except-self",
      level: 2,
      difficulty: "MEDIUM",
      topic: "Prefix / Suffix Products",
      patternSlug: "hashing-prefix-sum",
      estimatedTimeMin: 20,
      statement: "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.\n\nThe product of any prefix or suffix of `nums` is guaranteed to fit in a 32-bit integer.\n\nYou must write an algorithm that runs in `O(N)` time and without using the division operation.",
      functionName: "productExceptSelf",
      parameters: [{ name: "nums", type: "number[]", description: "Array of integers" }],
      returnType: "number[]",
      constraints: ["2 <= nums.length <= 10^5", "-30 <= nums[i] <= 30", "Product fits in 32-bit integer."],
      examples: [
        { input: "nums = [1,2,3,4]", output: "[24,12,8,6]", explanation: "Prefix and suffix products" },
        { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]", explanation: "Zero at index 2" }
      ],
      optimalSolution: `function productExceptSelf(nums) {\n  const n = nums.length;\n  const res = new Array(n).fill(1);\n  let prefix = 1;\n  for (let i = 0; i < n; i++) {\n    res[i] = prefix;\n    prefix *= nums[i];\n  }\n  let suffix = 1;\n  for (let i = n - 1; i >= 0; i--) {\n    res[i] *= suffix;\n    suffix *= nums[i];\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function productExceptSelf(nums) {\n  const n = nums.length;\n  const res = new Array(n);\n  for (let i = 0; i < n; i++) {\n    let p = 1;\n    for (let j = 0; j < n; j++) {\n      if (i !== j) p *= nums[j];\n    }\n    res[i] = p;\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Using division (prohibited by prompt)", "Failing on multiple zeros"],
      hints: [
        "Product except self at i is (prefix product before i) * (suffix product after i).",
        "Compute prefix products in a first pass from left to right.",
        "Accumulate suffix products on the fly in a second pass from right to left in O(1) extra space."
      ],
      oracleFn: (nums: number[]) => {
        const n = nums.length;
        const res = new Array(n).fill(1);
        let prefix = 1;
        for (let i = 0; i < n; i++) {
          res[i] = prefix;
          prefix *= nums[i];
        }
        let suffix = 1;
        for (let i = n - 1; i >= 0; i--) {
          res[i] *= suffix;
          suffix *= nums[i];
        }
        return res;
      },
      testCases: {
        functional: [
          [[1, 2, 3, 4]],
          [[-1, 1, 0, -3, 3]],
          [[2, 3]]
        ],
        boundary: [
          [[0, 0]],
          [[0, 1, 2]],
          [[-1, -1, -1, -1]],
          [[1, 1, 1, 1, 1]]
        ],
        adversarial: [
          [[5, 0, 2, 0, 4]],
          [[-2, -2, -2]],
          [[1, 2, 0, 4, 5]]
        ],
        stress: [
          [Array.from({ length: 1500 }, (_, i) => (i % 2 === 0 ? 1 : -1))],
          [Array.from({ length: 2000 }, () => 1)]
        ]
      }
    }),

    // 29. Longest Consecutive Sequence
    createProblem({
      num: 29,
      title: "Longest Consecutive Sequence",
      slug: "longest-consecutive-sequence",
      level: 2,
      difficulty: "MEDIUM",
      topic: "Hashing",
      patternSlug: "hashing-prefix-sum",
      estimatedTimeMin: 20,
      statement: "Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence.\n\nYou must write an algorithm that runs in `O(N)` time.",
      functionName: "longestConsecutive",
      parameters: [{ name: "nums", type: "number[]", description: "Array of integers" }],
      returnType: "number",
      constraints: ["0 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
      examples: [
        { input: "nums = [100,4,200,1,3,2]", output: "4", explanation: "Sequence [1, 2, 3, 4] has length 4." },
        { input: "nums = [0,3,7,2,5,8,4,6,0,1]", output: "9", explanation: "Sequence [0..8] has length 9." }
      ],
      optimalSolution: `function longestConsecutive(nums) {\n  if (nums.length === 0) return 0;\n  const set = new Set(nums);\n  let longest = 0;\n  for (const num of set) {\n    if (!set.has(num - 1)) {\n      let current = num;\n      let streak = 1;\n      while (set.has(current + 1)) {\n        current++;\n        streak++;\n      }\n      longest = Math.max(longest, streak);\n    }\n  }\n  return longest;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function longestConsecutive(nums) {\n  if (nums.length === 0) return 0;\n  nums.sort((a, b) => a - b);\n  let longest = 1;\n  let cur = 1;\n  for (let i = 1; i < nums.length; i++) {\n    if (nums[i] === nums[i - 1]) continue;\n    if (nums[i] === nums[i - 1] + 1) cur++;\n    else cur = 1;\n    longest = Math.max(longest, cur);\n  }\n  return longest;\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Checking every element instead of only sequence starts (where num - 1 is not in set)", "Not handling empty array"],
      hints: [
        "Insert all numbers into a Hash Set for O(1) lookups.",
        "Only begin counting a sequence if num - 1 does not exist in the set (i.e. num is the start of a sequence).",
        "This ensures each number is visited at most twice, maintaining O(N) linear time."
      ],
      oracleFn: (nums: number[]) => {
        if (nums.length === 0) return 0;
        const set = new Set(nums);
        let longest = 0;
        for (const num of set) {
          if (!set.has(num - 1)) {
            let current = num;
            let streak = 1;
            while (set.has(current + 1)) {
              current++;
              streak++;
            }
            longest = Math.max(longest, streak);
          }
        }
        return longest;
      },
      testCases: {
        functional: [
          [[100, 4, 200, 1, 3, 2]],
          [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]],
          [[1, 2, 0, 1]]
        ],
        boundary: [
          [[]],
          [[7]],
          [[10, 10, 10, 10]],
          [[-5, -4, -3, -2, -1]]
        ],
        adversarial: [
          [[1, 2, 3, 10, 11, 12, 13, 14, 20]],
          [[9, 1, 4, 7, 3, -1, 0, 5, 8, -1, 6]],
          [[1000000000, -1000000000, 0]]
        ],
        stress: [
          [Array.from({ length: 2000 }, (_, i) => 2000 - i)],
          [Array.from({ length: 3000 }, (_, i) => i * 2)]
        ]
      }
    }),

    // 30. Subarray Sum Equals K
    createProblem({
      num: 30,
      title: "Subarray Sum Equals K",
      slug: "subarray-sum-equals-k",
      level: 2,
      difficulty: "MEDIUM",
      topic: "Prefix Sum & Hash Map",
      patternSlug: "hashing-prefix-sum",
      estimatedTimeMin: 20,
      statement: "Given an array of integers `nums` and an integer `k`, return the total number of continuous subarrays whose sum equals to `k`.",
      functionName: "subarraySum",
      parameters: [
        { name: "nums", type: "number[]", description: "Array of integers" },
        { name: "k", type: "number", description: "Target sum" }
      ],
      returnType: "number",
      constraints: ["1 <= nums.length <= 2 * 10^4", "-1000 <= nums[i] <= 1000", "-10^7 <= k <= 10^7"],
      examples: [
        { input: "nums = [1,1,1], k = 2", output: "2", explanation: "Subarrays [0..1] and [1..2]" },
        { input: "nums = [1,2,3], k = 3", output: "2", explanation: "Subarrays [0..1] and [2]" }
      ],
      optimalSolution: `function subarraySum(nums, k) {\n  let count = 0, sum = 0;\n  const map = new Map();\n  map.set(0, 1);\n  for (const n of nums) {\n    sum += n;\n    if (map.has(sum - k)) count += map.get(sum - k);\n    map.set(sum, (map.get(sum) || 0) + 1);\n  }\n  return count;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function subarraySum(nums, k) {\n  let count = 0;\n  for (let i = 0; i < nums.length; i++) {\n    let s = 0;\n    for (let j = i; j < nums.length; j++) {\n      s += nums[j];\n      if (s === k) count++;\n    }\n  }\n  return count;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Trying sliding window (fails due to negative numbers)", "Forgetting map.set(0, 1) base case"],
      hints: [
        "If sum[j] - sum[i] = k, then subarray (i, j] sums to k.",
        "Maintain running prefix sum and a frequency map.",
        "At each index, add map.get(sum - k) to the count."
      ],
      oracleFn: (nums: number[], k: number) => {
        let count = 0, sum = 0;
        const map = new Map<number, number>();
        map.set(0, 1);
        for (const n of nums) {
          sum += n;
          if (map.has(sum - k)) count += map.get(sum - k)!;
          map.set(sum, (map.get(sum) || 0) + 1);
        }
        return count;
      },
      testCases: {
        functional: [
          [[1, 1, 1], 2],
          [[1, 2, 3], 3],
          [[1], 1]
        ],
        boundary: [
          [[1, -1, 0], 0],
          [[0, 0, 0, 0], 0],
          [[-1, -1, 1], 0],
          [[5], 10]
        ],
        adversarial: [
          [[3, 4, 7, 2, -3, 1, 4, 2], 7],
          [[1, -1, 1, -1, 1, -1], 0],
          [[100, -50, 50, -50, 50], 50]
        ],
        stress: [
          [Array.from({ length: 1500 }, () => 1), 500],
          [Array.from({ length: 2000 }, () => 0), 0]
        ]
      }
    }),

    // 31. Continuous Subarray Sum
    createProblem({
      num: 31,
      title: "Continuous Subarray Sum",
      slug: "continuous-subarray-sum",
      level: 2,
      difficulty: "MEDIUM",
      topic: "Prefix Sum & Modulo",
      patternSlug: "hashing-prefix-sum",
      estimatedTimeMin: 20,
      statement: "Given an integer array `nums` and an integer `k`, return `true` if `nums` has a good subarray or `false` otherwise.\n\nA good subarray is defined as:\n- length of at least 2\n- the sum of elements is a multiple of `k`.",
      functionName: "checkSubarraySum",
      parameters: [
        { name: "nums", type: "number[]", description: "Array of integers" },
        { name: "k", type: "number", description: "Target divisor" }
      ],
      returnType: "boolean",
      constraints: ["1 <= nums.length <= 10^5", "0 <= nums[i] <= 10^9", "1 <= k <= 2^31 - 1"],
      examples: [
        { input: "nums = [23,2,4,6,7], k = 6", output: "true", explanation: "[2, 4] sums to 6 which is a multiple of 6." },
        { input: "nums = [23,2,6,4,7], k = 6", output: "true", explanation: "[23, 2, 6, 4, 7] sums to 42." }
      ],
      optimalSolution: `function checkSubarraySum(nums, k) {\n  const map = new Map();\n  map.set(0, -1);\n  let rem = 0;\n  for (let i = 0; i < nums.length; i++) {\n    rem = (rem + nums[i]) % k;\n    if (map.has(rem)) {\n      if (i - map.get(rem) >= 2) return true;\n    } else {\n      map.set(rem, i);\n    }\n  }\n  return false;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(min(N, k))",
      suboptimalSolution: `function checkSubarraySum(nums, k) {\n  for (let i = 0; i < nums.length; i++) {\n    let s = nums[i];\n    for (let j = i + 1; j < nums.length; j++) {\n      s += nums[j];\n      if (s % k === 0) return true;\n    }\n  }\n  return false;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Overwriting first seen index in map when same remainder appears", "Not requiring length >= 2"],
      hints: [
        "If prefixSum[j] % k === prefixSum[i] % k, then the elements between i and j sum to a multiple of k.",
        "Store the EARLIEST index at which each remainder was seen in a Hash Map.",
        "Check that j - i >= 2."
      ],
      oracleFn: (nums: number[], k: number) => {
        const map = new Map<number, number>();
        map.set(0, -1);
        let rem = 0;
        for (let i = 0; i < nums.length; i++) {
          rem = (rem + nums[i]) % k;
          if (map.has(rem)) {
            if (i - map.get(rem)! >= 2) return true;
          } else {
            map.set(rem, i);
          }
        }
        return false;
      },
      testCases: {
        functional: [
          [[23, 2, 4, 6, 7], 6],
          [[23, 2, 6, 4, 7], 6],
          [[23, 2, 6, 4, 7], 13]
        ],
        boundary: [
          [[0], 1],
          [[0, 0], 1],
          [[5, 0, 0], 3],
          [[1, 0], 2]
        ],
        adversarial: [
          [[1, 2, 3], 5],
          [[23, 0, 0], 6],
          [[1, 2, 12], 6]
        ],
        stress: [
          [Array.from({ length: 2000 }, () => 1), 2001],
          [Array.from({ length: 3000 }, (_, i) => i * 6 + 1), 6]
        ]
      }
    }),

    // 32. Subarray Sums Divisible by K
    createProblem({
      num: 32,
      title: "Subarray Sums Divisible by K",
      slug: "subarray-sums-divisible-by-k",
      level: 2,
      difficulty: "MEDIUM",
      topic: "Prefix Sum & Modulo",
      patternSlug: "hashing-prefix-sum",
      estimatedTimeMin: 20,
      statement: "Given an integer array `nums` and an integer `k`, return the number of non-empty subarrays that have a sum divisible by `k`.",
      functionName: "subarraysDivByK",
      parameters: [
        { name: "nums", type: "number[]", description: "Array of integers" },
        { name: "k", type: "number", description: "Divisor" }
      ],
      returnType: "number",
      constraints: ["1 <= nums.length <= 3 * 10^4", "-10^4 <= nums[i] <= 10^4", "2 <= k <= 10^4"],
      examples: [
        { input: "nums = [4,5,0,-2,-3,1], k = 5", output: "7", explanation: "7 subarrays have sum divisible by 5." },
        { input: "nums = [5], k = 9", output: "0", explanation: "No subarray divisible by 9." }
      ],
      optimalSolution: `function subarraysDivByK(nums, k) {\n  const count = new Array(k).fill(0);\n  count[0] = 1;\n  let prefix = 0, res = 0;\n  for (const n of nums) {\n    prefix = ((prefix + n) % k + k) % k;\n    res += count[prefix];\n    count[prefix]++;\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(K)",
      suboptimalSolution: `function subarraysDivByK(nums, k) {\n  let res = 0;\n  for (let i = 0; i < nums.length; i++) {\n    let s = 0;\n    for (let j = i; j < nums.length; j++) {\n      s += nums[j];\n      if (s % k === 0) res++;\n    }\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Handling negative remainder in JS: ((rem % k) + k) % k is required", "Forgetting count[0] = 1"],
      hints: [
        "Use modulo arithmetic: if two prefix sums have identical remainder modulo k, their difference is divisible by k.",
        "Normalize negative remainders into [0, k-1].",
        "Add frequency of current remainder to total result."
      ],
      oracleFn: (nums: number[], k: number) => {
        const count = new Array(k).fill(0);
        count[0] = 1;
        let prefix = 0, res = 0;
        for (const n of nums) {
          prefix = ((prefix + n) % k + k) % k;
          res += count[prefix];
          count[prefix]++;
        }
        return res;
      },
      testCases: {
        functional: [
          [[4, 5, 0, -2, -3, 1], 5],
          [[5], 9],
          [[-1, 2, 9], 2]
        ],
        boundary: [
          [[0], 2],
          [[0, 0, 0], 3],
          [[-5], 5],
          [[1, -1], 1]
        ],
        adversarial: [
          [[-1, -9, -4, 0], 9],
          [[2, -2, 2, -4], 6],
          [[-5, -10, -15], 5]
        ],
        stress: [
          [Array.from({ length: 2000 }, () => 5), 5],
          [Array.from({ length: 2500 }, (_, i) => i - 1250), 7]
        ]
      }
    }),

    // 33. Range Sum Query - Immutable
    createProblem({
      num: 33,
      title: "Range Sum Query - Immutable",
      slug: "range-sum-query-immutable",
      level: 2,
      difficulty: "EASY",
      topic: "Prefix Sum",
      patternSlug: "hashing-prefix-sum",
      estimatedTimeMin: 15,
      statement: "Given an integer array `nums`, handle multiple queries of the following type: Calculate the sum of elements of `nums` between indices `left` and `right` inclusive where `left <= right`.",
      functionName: "sumRange",
      parameters: [
        { name: "nums", type: "number[]", description: "Source array" },
        { name: "left", type: "number", description: "Left boundary" },
        { name: "right", type: "number", description: "Right boundary" }
      ],
      returnType: "number",
      constraints: ["1 <= nums.length <= 10^4", "-10^5 <= nums[i] <= 10^5", "0 <= left <= right < nums.length"],
      examples: [
        { input: "nums = [-2, 0, 3, -5, 2, -1], left = 0, right = 2", output: "1", explanation: "-2 + 0 + 3 = 1" },
        { input: "nums = [-2, 0, 3, -5, 2, -1], left = 2, right = 5", output: "-1", explanation: "3 + -5 + 2 + -1 = -1" }
      ],
      optimalSolution: `function sumRange(nums, left, right) {\n  const prefix = [0];\n  for (let i = 0; i < nums.length; i++) prefix.push(prefix[i] + nums[i]);\n  return prefix[right + 1] - prefix[left];\n}`,
      optimalTimeComplexity: "O(1) query",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function sumRange(nums, left, right) {\n  let s = 0;\n  for (let i = left; i <= right; i++) s += nums[i];\n  return s;\n}`,
      suboptimalTimeComplexity: "O(N) per query",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Off-by-one in prefix sum array index"],
      hints: [
        "Precompute prefix sum array: P[i] = sum(nums[0..i-1]).",
        "Range sum from left to right is P[right + 1] - P[left]."
      ],
      oracleFn: (nums: number[], left: number, right: number) => {
        let s = 0;
        for (let i = left; i <= right; i++) s += nums[i];
        return s;
      },
      testCases: {
        functional: [
          [[-2, 0, 3, -5, 2, -1], 0, 2],
          [[-2, 0, 3, -5, 2, -1], 2, 5],
          [[-2, 0, 3, -5, 2, -1], 0, 5]
        ],
        boundary: [
          [[10], 0, 0],
          [[1, 2, 3], 1, 1],
          [[0, 0, 0], 0, 2],
          [[-10, 10], 0, 1]
        ],
        adversarial: [
          [[1, -2, 3, -4, 5, -6], 1, 4],
          [[100, 200, 300, 400], 0, 3]
        ],
        stress: [
          [Array.from({ length: 3000 }, (_, i) => i), 100, 2500],
          [Array.from({ length: 5000 }, () => 1), 0, 4999]
        ]
      }
    }),

    // 34. Number of Good Pairs
    createProblem({
      num: 34,
      title: "Number of Good Pairs",
      slug: "number-of-good-pairs",
      level: 2,
      difficulty: "EASY",
      topic: "Hashing",
      patternSlug: "hashing-prefix-sum",
      estimatedTimeMin: 15,
      statement: "Given an array of integers `nums`, return the number of good pairs.\n\nA pair `(i, j)` is called good if `nums[i] == nums[j]` and `i < j`.",
      functionName: "numIdenticalPairs",
      parameters: [{ name: "nums", type: "number[]", description: "Array of integers" }],
      returnType: "number",
      constraints: ["1 <= nums.length <= 100", "1 <= nums[i] <= 100"],
      examples: [
        { input: "nums = [1,2,3,1,1,3]", output: "4", explanation: "Pairs (0,3), (0,4), (3,4), (2,5)" },
        { input: "nums = [1,1,1,1]", output: "6", explanation: "4 * 3 / 2 = 6 pairs" }
      ],
      optimalSolution: `function numIdenticalPairs(nums) {\n  const count = new Map();\n  let ans = 0;\n  for (const n of nums) {\n    const c = count.get(n) || 0;\n    ans += c;\n    count.set(n, c + 1);\n  }\n  return ans;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function numIdenticalPairs(nums) {\n  let ans = 0;\n  for (let i = 0; i < nums.length; i++) {\n    for (let j = i + 1; j < nums.length; j++) {\n      if (nums[i] === nums[j]) ans++;\n    }\n  }\n  return ans;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Double counting pairs"],
      hints: [
        "If a number has appeared c times previously, the new occurrence forms c new pairs.",
        "Maintain counts in a hash map."
      ],
      oracleFn: (nums: number[]) => {
        const count = new Map<number, number>();
        let ans = 0;
        for (const n of nums) {
          const c = count.get(n) || 0;
          ans += c;
          count.set(n, c + 1);
        }
        return ans;
      },
      testCases: {
        functional: [
          [[1, 2, 3, 1, 1, 3]],
          [[1, 1, 1, 1]],
          [[1, 2, 3]]
        ],
        boundary: [
          [[1]],
          [[5, 5]],
          [[1, 2, 1, 2, 1, 2]],
          [[100]]
        ],
        adversarial: [
          [[1, 2, 3, 4, 5, 6, 7, 8]],
          [[2, 2, 2, 2, 2, 2, 2]]
        ],
        stress: [
          [Array.from({ length: 1000 }, () => 1)],
          [Array.from({ length: 2000 }, (_, i) => i % 5)]
        ]
      }
    }),

    // 35. Isomorphic Strings
    createProblem({
      num: 35,
      title: "Isomorphic Strings",
      slug: "isomorphic-strings",
      level: 2,
      difficulty: "EASY",
      topic: "Hashing",
      patternSlug: "hashing-prefix-sum",
      estimatedTimeMin: 15,
      statement: "Given two strings `s` and `t`, determine if they are isomorphic.\n\nTwo strings `s` and `t` are isomorphic if the characters in `s` can be replaced to get `t`.\n\nAll occurrences of a character must be replaced with another character while preserving the order of characters. No two characters may map to the same character, but a character may map to itself.",
      functionName: "isIsomorphic",
      parameters: [
        { name: "s", type: "string", description: "First string" },
        { name: "t", type: "string", description: "Second string" }
      ],
      returnType: "boolean",
      constraints: ["1 <= s.length <= 5 * 10^4", "t.length == s.length", "s and t consist of any valid ASCII character."],
      examples: [
        { input: 's = "egg", t = "add"', output: "true", explanation: "e->a, g->d" },
        { input: 's = "foo", t = "bar"', output: "false", explanation: "o cannot map to both a and r" },
        { input: 's = "paper", t = "title"', output: "true", explanation: "p->t, a->i, e->l, r->e" }
      ],
      optimalSolution: `function isIsomorphic(s, t) {\n  if (s.length !== t.length) return false;\n  const mapST = new Map(), mapTS = new Map();\n  for (let i = 0; i < s.length; i++) {\n    const c1 = s[i], c2 = t[i];\n    if ((mapST.has(c1) && mapST.get(c1) !== c2) || (mapTS.has(c2) && mapTS.get(c2) !== c1)) return false;\n    mapST.set(c1, c2);\n    mapTS.set(c2, c1);\n  }\n  return true;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function isIsomorphic(s, t) {\n  for (let i = 0; i < s.length; i++) {\n    if (s.indexOf(s[i]) !== t.indexOf(t[i])) return false;\n  }\n  return true;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Checking only one-way mapping instead of bijection"],
      hints: [
        "A character mapping must be bijective (one-to-one and onto).",
        "Use two maps (s->t and t->s) or record last seen positions."
      ],
      oracleFn: (s: string, t: string) => {
        if (s.length !== t.length) return false;
        const m1 = new Map<string, string>(), m2 = new Map<string, string>();
        for (let i = 0; i < s.length; i++) {
          const c1 = s[i], c2 = t[i];
          if ((m1.has(c1) && m1.get(c1) !== c2) || (m2.has(c2) && m2.get(c2) !== c1)) return false;
          m1.set(c1, c2);
          m2.set(c2, c1);
        }
        return true;
      },
      testCases: {
        functional: [
          ["egg", "add"],
          ["foo", "bar"],
          ["paper", "title"]
        ],
        boundary: [
          ["a", "a"],
          ["ab", "aa"],
          ["aa", "ab"],
          ["badc", "baba"]
        ],
        adversarial: [
          ["bbbaaaba", "aaabbbba"],
          ["abcdefghijklmnopqrstuvwxyz", "bcdefghijklmnopqrstuvwxyza"],
          ["13", "42"]
        ],
        stress: [
          ["a".repeat(2000), "b".repeat(2000)],
          ["ab".repeat(1500), "cd".repeat(1500)]
        ]
      }
    }),

    // 36. Word Pattern
    createProblem({
      num: 36,
      title: "Word Pattern",
      slug: "word-pattern",
      level: 2,
      difficulty: "EASY",
      topic: "Hashing",
      patternSlug: "hashing-prefix-sum",
      estimatedTimeMin: 15,
      statement: "Given a `pattern` and a string `s`, find if `s` follows the same pattern.\n\nHere follow means a full match, such that there is a bijection between a letter in `pattern` and a non-empty word in `s`.",
      functionName: "wordPattern",
      parameters: [
        { name: "pattern", type: "string", description: "Pattern string" },
        { name: "s", type: "string", description: "Space-separated words" }
      ],
      returnType: "boolean",
      constraints: ["1 <= pattern.length <= 300", "pattern contains only lowercase letters", "1 <= s.length <= 3000", "s contains only lowercase letters and spaces."],
      examples: [
        { input: 'pattern = "abba", s = "dog cat cat dog"', output: "true", explanation: "a->dog, b->cat" },
        { input: 'pattern = "abba", s = "dog cat cat fish"', output: "false", explanation: "a cannot map to fish" }
      ],
      optimalSolution: `function wordPattern(pattern, s) {\n  const words = s.split(' ');\n  if (pattern.length !== words.length) return false;\n  const charToWord = new Map(), wordToChar = new Map();\n  for (let i = 0; i < pattern.length; i++) {\n    const c = pattern[i], w = words[i];\n    if ((charToWord.has(c) && charToWord.get(c) !== w) || (wordToChar.has(w) && wordToChar.get(w) !== c)) return false;\n    charToWord.set(c, w);\n    wordToChar.set(w, c);\n  }\n  return true;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function wordPattern(pattern, s) {\n  const words = s.split(' ');\n  if (pattern.length !== words.length) return false;\n  for (let i = 0; i < pattern.length; i++) {\n    if (pattern.indexOf(pattern[i]) !== words.indexOf(words[i])) return false;\n  }\n  return true;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Forgetting to check pattern.length === words.length", "Only checking one direction"],
      hints: [
        "Split s into words by space.",
        "Ensure pattern length matches number of words.",
        "Verify 1-to-1 bijection in both directions."
      ],
      oracleFn: (pattern: string, s: string) => {
        const words = s.split(' ');
        if (pattern.length !== words.length) return false;
        const p2w = new Map<string, string>(), w2p = new Map<string, string>();
        for (let i = 0; i < pattern.length; i++) {
          const c = pattern[i], w = words[i];
          if ((p2w.has(c) && p2w.get(c) !== w) || (w2p.has(w) && w2p.get(w) !== c)) return false;
          p2w.set(c, w);
          w2p.set(w, c);
        }
        return true;
      },
      testCases: {
        functional: [
          ["abba", "dog cat cat dog"],
          ["abba", "dog cat cat fish"],
          ["aaaa", "dog cat cat dog"]
        ],
        boundary: [
          ["a", "dog"],
          ["a", "dog cat"],
          ["ab", "dog"],
          ["abba", "dog dog dog dog"]
        ],
        adversarial: [
          ["jquery", "jquery"],
          ["abc", "b c a"],
          ["aaa", "aa aa aa"]
        ],
        stress: [
          ["a".repeat(300), Array.from({ length: 300 }, () => "word").join(' ')],
          ["ab".repeat(150), Array.from({ length: 300 }, (_, i) => i % 2 === 0 ? "left" : "right").join(' ')]
        ]
      }
    }),

    // 37. Ransom Note
    createProblem({
      num: 37,
      title: "Ransom Note",
      slug: "ransom-note",
      level: 2,
      difficulty: "EASY",
      topic: "Hashing / Frequency Counting",
      patternSlug: "hashing-prefix-sum",
      estimatedTimeMin: 15,
      statement: "Given two strings `ransomNote` and `magazine`, return `true` if `ransomNote` can be constructed by using the letters from `magazine` and `false` otherwise.\n\nEach letter in `magazine` can only be used once in `ransomNote`.",
      functionName: "canConstruct",
      parameters: [
        { name: "ransomNote", type: "string", description: "Target note" },
        { name: "magazine", type: "string", description: "Source letters" }
      ],
      returnType: "boolean",
      constraints: ["1 <= ransomNote.length, magazine.length <= 10^5", "ransomNote and magazine consist of lowercase English letters."],
      examples: [
        { input: 'ransomNote = "a", magazine = "b"', output: "false", explanation: "b has no a" },
        { input: 'ransomNote = "aa", magazine = "ab"', output: "false", explanation: "Only one a available" },
        { input: 'ransomNote = "aa", magazine = "aab"', output: "true", explanation: "Two a's available" }
      ],
      optimalSolution: `function canConstruct(ransomNote, magazine) {\n  const count = new Array(26).fill(0);\n  for (let i = 0; i < magazine.length; i++) count[magazine.charCodeAt(i) - 97]++;\n  for (let i = 0; i < ransomNote.length; i++) {\n    const idx = ransomNote.charCodeAt(i) - 97;\n    if (--count[idx] < 0) return false;\n  }\n  return true;\n}`,
      optimalTimeComplexity: "O(M + N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function canConstruct(ransomNote, magazine) {\n  let mag = magazine;\n  for (const c of ransomNote) {\n    const idx = mag.indexOf(c);\n    if (idx === -1) return false;\n    mag = mag.slice(0, idx) + mag.slice(idx + 1);\n  }\n  return true;\n}`,
      suboptimalTimeComplexity: "O(M * N)",
      suboptimalSpaceComplexity: "O(M)",
      commonMistakes: ["Reusing the same magazine character multiple times"],
      hints: [
        "Count the frequency of each letter in magazine.",
        "Iterate through ransomNote, decrementing count for each char.",
        "If count becomes negative, magazine lacks sufficient characters."
      ],
      oracleFn: (ransomNote: string, magazine: string) => {
        const count = new Array(26).fill(0);
        for (let i = 0; i < magazine.length; i++) count[magazine.charCodeAt(i) - 97]++;
        for (let i = 0; i < ransomNote.length; i++) {
          const idx = ransomNote.charCodeAt(i) - 97;
          if (--count[idx] < 0) return false;
        }
        return true;
      },
      testCases: {
        functional: [
          ["a", "b"],
          ["aa", "ab"],
          ["aa", "aab"]
        ],
        boundary: [
          ["a", "a"],
          ["z", "z"],
          ["a", "z"],
          ["abc", "cba"]
        ],
        adversarial: [
          ["bg", "efjbdfbdgfjhhaiigfhbaejahgfbbgbjagbddfgdiaigdadhcffa"],
          ["fihfgabyi", "hkb"],
          ["fff", "ffff"]
        ],
        stress: [
          ["a".repeat(2000), "a".repeat(2000)],
          ["a".repeat(2001), "a".repeat(2000)]
        ]
      }
    }),

    // 38. Happy Number
    createProblem({
      num: 38,
      title: "Happy Number",
      slug: "happy-number",
      level: 2,
      difficulty: "EASY",
      topic: "Hashing / Cycle Detection",
      patternSlug: "hashing-prefix-sum",
      estimatedTimeMin: 15,
      statement: "Write an algorithm to determine if a number `n` is happy.\n\nA happy number is a number defined by the following process:\n- Starting with any positive integer, replace the number by the sum of the squares of its digits.\n- Repeat the process until the number equals 1, or it loops endlessly in a cycle which does not include 1.\n- Those numbers for which this process ends in 1 are happy.",
      functionName: "isHappy",
      parameters: [{ name: "n", type: "number", description: "Positive integer" }],
      returnType: "boolean",
      constraints: ["1 <= n <= 2^31 - 1"],
      examples: [
        { input: "n = 19", output: "true", explanation: "1^2 + 9^2 = 82 -> 68 -> 100 -> 1" },
        { input: "n = 2", output: "false", explanation: "Cycles endlessly in 4, 16, 37, 58, 89, 145, 42, 20, 4" }
      ],
      optimalSolution: `function isHappy(n) {\n  function getNext(num) {\n    let sum = 0;\n    while (num > 0) {\n      const d = num % 10;\n      sum += d * d;\n      num = Math.floor(num / 10);\n    }\n    return sum;\n  }\n  let slow = n, fast = getNext(n);\n  while (fast !== 1 && slow !== fast) {\n    slow = getNext(slow);\n    fast = getNext(getNext(fast));\n  }\n  return fast === 1;\n}`,
      optimalTimeComplexity: "O(log N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function isHappy(n) {\n  const seen = new Set();\n  while (n !== 1 && !seen.has(n)) {\n    seen.add(n);\n    let sum = 0;\n    while (n > 0) {\n      const d = n % 10;\n      sum += d * d;\n      n = Math.floor(n / 10);\n    }\n    n = sum;\n  }\n  return n === 1;\n}`,
      suboptimalTimeComplexity: "O(log N)",
      suboptimalSpaceComplexity: "O(log N)",
      commonMistakes: ["Infinite loop without cycle detection"],
      hints: [
        "Simulate the digit sum operation.",
        "Use a Hash Set or Floyd's Tortoise and Hare algorithm to detect repeating cycle states."
      ],
      oracleFn: (n: number) => {
        const seen = new Set<number>();
        while (n !== 1 && !seen.has(n)) {
          seen.add(n);
          let sum = 0;
          while (n > 0) {
            const d = n % 10;
            sum += d * d;
            n = Math.floor(n / 10);
          }
          n = sum;
        }
        return n === 1;
      },
      testCases: {
        functional: [
          [19],
          [2],
          [7]
        ],
        boundary: [
          [1],
          [3],
          [4],
          [10]
        ],
        adversarial: [
          [1111111],
          [9999999],
          [28]
        ],
        stress: [
          [2147483647],
          [1000000000]
        ]
      }
    }),

    // 39. Contains Duplicate II
    createProblem({
      num: 39,
      title: "Contains Duplicate II",
      slug: "contains-duplicate-ii",
      level: 2,
      difficulty: "EASY",
      topic: "Hashing / Sliding Window",
      patternSlug: "hashing-prefix-sum",
      estimatedTimeMin: 15,
      statement: "Given an integer array `nums` and an integer `k`, return `true` if there are two distinct indices `i` and `j` in the array such that `nums[i] == nums[j]` and `abs(i - j) <= k`.",
      functionName: "containsNearbyDuplicate",
      parameters: [
        { name: "nums", type: "number[]", description: "Array of integers" },
        { name: "k", type: "number", description: "Maximum allowed distance" }
      ],
      returnType: "boolean",
      constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9", "0 <= k <= 10^5"],
      examples: [
        { input: "nums = [1,2,3,1], k = 3", output: "true", explanation: "nums[0] == nums[3], 3 - 0 <= 3" },
        { input: "nums = [1,0,1,1], k = 1", output: "true", explanation: "nums[2] == nums[3], 3 - 2 <= 1" },
        { input: "nums = [1,2,3,1,2,3], k = 2", output: "false", explanation: "Duplicate distance is 3 > 2" }
      ],
      optimalSolution: `function containsNearbyDuplicate(nums, k) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    if (map.has(nums[i]) && i - map.get(nums[i]) <= k) return true;\n    map.set(nums[i], i);\n  }\n  return false;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(min(N, k))",
      suboptimalSolution: `function containsNearbyDuplicate(nums, k) {\n  for (let i = 0; i < nums.length; i++) {\n    for (let j = i + 1; j <= Math.min(i + k, nums.length - 1); j++) {\n      if (nums[i] === nums[j]) return true;\n    }\n  }\n  return false;\n}`,
      suboptimalTimeComplexity: "O(N * K)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Scanning k elements with nested loops causing TLE when k is large"],
      hints: [
        "Store the last seen index of each element in a Hash Map.",
        "If nums[i] was seen previously at index j and i - j <= k, return true.",
        "Update the map with current index i."
      ],
      oracleFn: (nums: number[], k: number) => {
        const map = new Map<number, number>();
        for (let i = 0; i < nums.length; i++) {
          if (map.has(nums[i]) && i - map.get(nums[i])! <= k) return true;
          map.set(nums[i], i);
        }
        return false;
      },
      testCases: {
        functional: [
          [[1, 2, 3, 1], 3],
          [[1, 0, 1, 1], 1],
          [[1, 2, 3, 1, 2, 3], 2]
        ],
        boundary: [
          [[1], 1],
          [[1, 1], 0],
          [[1, 1], 1],
          [[1, 2, 3], 0]
        ],
        adversarial: [
          [[99, 99], 2],
          [[1, 2, 1], 0],
          [[1, 2, 3, 4, 1], 3]
        ],
        stress: [
          [Array.from({ length: 3000 }, (_, i) => i), 100],
          [Array.from({ length: 3000 }, (_, i) => i % 500), 500]
        ]
      }
    }),

    // 40. 4Sum II
    createProblem({
      num: 40,
      title: "4Sum II",
      slug: "4sum-ii",
      level: 2,
      difficulty: "MEDIUM",
      topic: "Hashing",
      patternSlug: "hashing-prefix-sum",
      estimatedTimeMin: 20,
      statement: "Given four integer arrays `nums1`, `nums2`, `nums3`, and `nums4` all of length `n`, return the number of tuples `(i, j, k, l)` such that:\n- `0 <= i, j, k, l < n`\n- `nums1[i] + nums2[j] + nums3[k] + nums4[l] == 0`",
      functionName: "fourSumCount",
      parameters: [
        { name: "nums1", type: "number[]", description: "Array 1" },
        { name: "nums2", type: "number[]", description: "Array 2" },
        { name: "nums3", type: "number[]", description: "Array 3" },
        { name: "nums4", type: "number[]", description: "Array 4" }
      ],
      returnType: "number",
      constraints: ["n == nums1.length == nums2.length == nums3.length == nums4.length", "1 <= n <= 200", "-2^28 <= nums1[i], nums2[i], nums3[i], nums4[i] <= 2^28"],
      examples: [
        { input: "nums1 = [1,2], nums2 = [-2,-1], nums3 = [-1,2], nums4 = [0,2]", output: "2", explanation: "(0, 0, 0, 1) and (1, 1, 0, 0)" }
      ],
      optimalSolution: `function fourSumCount(nums1, nums2, nums3, nums4) {\n  const map = new Map();\n  for (const a of nums1) {\n    for (const b of nums2) {\n      const s = a + b;\n      map.set(s, (map.get(s) || 0) + 1);\n    }\n  }\n  let count = 0;\n  for (const c of nums3) {\n    for (const d of nums4) {\n      const target = -(c + d);\n      if (map.has(target)) count += map.get(target);\n    }\n  }\n  return count;\n}`,
      optimalTimeComplexity: "O(N^2)",
      optimalSpaceComplexity: "O(N^2)",
      suboptimalSolution: `function fourSumCount(nums1, nums2, nums3, nums4) {\n  let count = 0;\n  for (const a of nums1)\n    for (const b of nums2)\n      for (const c of nums3)\n        for (const d of nums4)\n          if (a + b + c + d === 0) count++;\n  return count;\n}`,
      suboptimalTimeComplexity: "O(N^4)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Using O(N^3) or O(N^4) loops instead of splitting into two groups of two"],
      hints: [
        "Divide the 4 arrays into two pairs: (nums1, nums2) and (nums3, nums4).",
        "Compute all pairwise sums of nums1 and nums2, storing frequencies in a Hash Map in O(N^2).",
        "For each pair in nums3 and nums4, lookup -(c + d) in the map."
      ],
      oracleFn: (nums1: number[], nums2: number[], nums3: number[], nums4: number[]) => {
        const map = new Map<number, number>();
        for (const a of nums1) {
          for (const b of nums2) {
            const s = a + b;
            map.set(s, (map.get(s) || 0) + 1);
          }
        }
        let count = 0;
        for (const c of nums3) {
          for (const d of nums4) {
            const target = -(c + d);
            if (map.has(target)) count += map.get(target)!;
          }
        }
        return count;
      },
      testCases: {
        functional: [
          [[1, 2], [-2, -1], [-1, 2], [0, 2]],
          [[0], [0], [0], [0]],
          [[-1, -1], [-1, 1], [-1, 1], [1, -1]]
        ],
        boundary: [
          [[1], [-1], [0], [0]],
          [[1], [1], [1], [1]],
          [[0, 0], [0, 0], [0, 0], [0, 0]]
        ],
        adversarial: [
          [[1, 2, 3], [-1, -2, -3], [0, 1, -1], [0, -1, 1]],
          [[-100, 100], [-50, 50], [25, -25], [125, -125]]
        ],
        stress: [
          [Array.from({ length: 50 }, () => 1), Array.from({ length: 50 }, () => -1), Array.from({ length: 50 }, () => 0), Array.from({ length: 50 }, () => 0)],
          [Array.from({ length: 70 }, (_, i) => i), Array.from({ length: 70 }, (_, i) => -i), Array.from({ length: 70 }, () => 0), Array.from({ length: 70 }, () => 0)]
        ]
      }
    }),

    // 41. Longest Palindrome
    createProblem({
      num: 41,
      title: "Longest Palindrome",
      slug: "longest-palindrome",
      level: 2,
      difficulty: "EASY",
      topic: "Hashing / Greedy",
      patternSlug: "hashing-prefix-sum",
      estimatedTimeMin: 15,
      statement: "Given a string `s` which consists of lowercase or uppercase letters, return the length of the longest palindrome that can be built with those letters.\n\nLetters are case sensitive, for example, \"Aa\" is not considered a palindrome.",
      functionName: "longestPalindrome",
      parameters: [{ name: "s", type: "string", description: "Input string" }],
      returnType: "number",
      constraints: ["1 <= s.length <= 2000", "s consists of lowercase and/or uppercase English letters only."],
      examples: [
        { input: 's = "abccccdd"', output: "7", explanation: "One longest palindrome that can be built is 'dccaccd', whose length is 7." },
        { input: 's = "a"', output: "1", explanation: "Length 1" }
      ],
      optimalSolution: `function longestPalindrome(s) {\n  const counts = new Map();\n  for (const c of s) counts.set(c, (counts.get(c) || 0) + 1);\n  let ans = 0, hasOdd = false;\n  for (const c of counts.values()) {\n    if (c % 2 === 0) ans += c;\n    else {\n      ans += c - 1;\n      hasOdd = true;\n    }\n  }\n  return hasOdd ? ans + 1 : ans;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function longestPalindrome(s) {\n  const set = new Set();\n  let len = 0;\n  for (const c of s) {\n    if (set.has(c)) {\n      len += 2;\n      set.delete(c);\n    } else set.add(c);\n  }\n  return set.size > 0 ? len + 1 : len;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Forgetting that only ONE odd character can sit at the center of the palindrome"],
      hints: [
        "Even counts of characters can always be placed symmetrically on both sides.",
        "Odd counts can have count - 1 letters placed symmetrically.",
        "At most one odd character can be placed in the center."
      ],
      oracleFn: (s: string) => {
        const counts = new Map<string, number>();
        for (const c of s) counts.set(c, (counts.get(c) || 0) + 1);
        let ans = 0, hasOdd = false;
        for (const c of counts.values()) {
          if (c % 2 === 0) ans += c;
          else {
            ans += c - 1;
            hasOdd = true;
          }
        }
        return hasOdd ? ans + 1 : ans;
      },
      testCases: {
        functional: [
          ["abccccdd"],
          ["a"],
          ["bb"]
        ],
        boundary: [
          ["ccc"],
          ["Aa"],
          ["AAAAAA"],
          ["ab"]
        ],
        adversarial: [
          ["bananas"],
          ["zeusnhoepojrehgermadahuababpteserohrmunohiewh"],
          ["speediskey"]
        ],
        stress: [
          ["a".repeat(1000) + "b".repeat(1000)],
          [Array.from({ length: 2000 }, (_, i) => String.fromCharCode(65 + (i % 52))).join('')]
        ]
      }
    }),

    // 42. Majority Element II
    createProblem({
      num: 42,
      title: "Majority Element II",
      slug: "majority-element-ii",
      level: 2,
      difficulty: "MEDIUM",
      topic: "Hashing / Boyer-Moore Voting",
      patternSlug: "hashing-prefix-sum",
      estimatedTimeMin: 20,
      statement: "Given an integer array of size `n`, find all elements that appear more than `floor(n / 3)` times.\n\nCould you solve the problem in linear time and in `O(1)` space?",
      functionName: "majorityElement",
      parameters: [{ name: "nums", type: "number[]", description: "Array of integers" }],
      returnType: "number[]",
      constraints: ["1 <= nums.length <= 5 * 10^4", "-10^9 <= nums[i] <= 10^9"],
      examples: [
        { input: "nums = [3,2,3]", output: "[3]", explanation: "3 appears 2 times > 3/3." },
        { input: "nums = [1]", output: "[1]", explanation: "1 appears 1 time > 1/3." },
        { input: "nums = [1,2]", output: "[1,2]", explanation: "Both appear 1 time > 2/3 = 0." }
      ],
      optimalSolution: `function majorityElement(nums) {\n  let cand1 = 0, cand2 = 1, count1 = 0, count2 = 0;\n  for (const n of nums) {\n    if (n === cand1) count1++;\n    else if (n === cand2) count2++;\n    else if (count1 === 0) { cand1 = n; count1 = 1; }\n    else if (count2 === 0) { cand2 = n; count2 = 1; }\n    else { count1--; count2--; }\n  }\n  count1 = 0; count2 = 0;\n  for (const n of nums) {\n    if (n === cand1) count1++;\n    else if (n === cand2) count2++;\n  }\n  const res = [];\n  const threshold = Math.floor(nums.length / 3);\n  if (count1 > threshold) res.push(cand1);\n  if (count2 > threshold) res.push(cand2);\n  return res.sort((a, b) => a - b);\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function majorityElement(nums) {\n  const map = new Map();\n  for (const n of nums) map.set(n, (map.get(n) || 0) + 1);\n  const res = [];\n  const threshold = Math.floor(nums.length / 3);\n  for (const [k, v] of map) if (v > threshold) res.push(k);\n  return res.sort((a, b) => a - b);\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Forgetting that at most 2 elements can appear more than n/3 times", "Not verifying candidates in second pass"],
      hints: [
        "How many elements can appear more than floor(n / 3) times? At most 2.",
        "Use Boyer-Moore Voting algorithm extended to 2 candidates and 2 counters.",
        "Perform a second verification pass to confirm frequencies."
      ],
      oracleFn: (nums: number[]) => {
        const map = new Map<number, number>();
        for (const n of nums) map.set(n, (map.get(n) || 0) + 1);
        const res: number[] = [];
        const threshold = Math.floor(nums.length / 3);
        for (const [k, v] of map) if (v > threshold) res.push(k);
        return res.sort((a, b) => a - b);
      },
      testCases: {
        functional: [
          [[3, 2, 3]],
          [[1]],
          [[1, 2]]
        ],
        boundary: [
          [[2, 2]],
          [[0, 0, 0]],
          [[1, 2, 3, 4]],
          [[-1, -1, -1]]
        ],
        adversarial: [
          [[1, 1, 1, 2, 2, 3, 3, 3]],
          [[2, 1, 1, 3, 1, 4, 5, 6]],
          [[1, 2, 2, 3, 2, 1, 1, 3]]
        ],
        stress: [
          [Array.from({ length: 3000 }, (_, i) => i % 3 === 0 ? 99 : i)],
          [Array.from({ length: 3000 }, (_, i) => i % 2 === 0 ? 10 : 20)]
        ]
      }
    }),

    // 43. Find the Difference
    createProblem({
      num: 43,
      title: "Find the Difference",
      slug: "find-the-difference",
      level: 2,
      difficulty: "EASY",
      topic: "Hashing / Bit Manipulation",
      patternSlug: "hashing-prefix-sum",
      estimatedTimeMin: 15,
      statement: "You are given two strings `s` and `t`.\n\nString `t` is generated by random shuffling string `s` and then add one more letter at a random position.\n\nReturn the letter that was added to `t`.",
      functionName: "findTheDifference",
      parameters: [
        { name: "s", type: "string", description: "Original string" },
        { name: "t", type: "string", description: "Shuffled string with extra character" }
      ],
      returnType: "string",
      constraints: ["0 <= s.length <= 1000", "t.length == s.length + 1", "s and t consist of lowercase English letters."],
      examples: [
        { input: 's = "abcd", t = "abcde"', output: '"e"', explanation: "'e' is the letter that was added." },
        { input: 's = "", t = "y"', output: '"y"', explanation: "'y' is added." }
      ],
      optimalSolution: `function findTheDifference(s, t) {\n  let xor = 0;\n  for (let i = 0; i < s.length; i++) xor ^= s.charCodeAt(i);\n  for (let i = 0; i < t.length; i++) xor ^= t.charCodeAt(i);\n  return String.fromCharCode(xor);\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function findTheDifference(s, t) {\n  const count = new Array(26).fill(0);\n  for (const c of t) count[c.charCodeAt(0) - 97]++;\n  for (const c of s) count[c.charCodeAt(0) - 97]--;\n  for (let i = 0; i < 26; i++) if (count[i] === 1) return String.fromCharCode(97 + i);\n  return '';\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Assuming the extra letter is at the end of t"],
      hints: [
        "All characters in s appear in t with the exact same count, except one character.",
        "XOR-ing all character codes in both s and t leaves only the extra character code.",
        "Or use a frequency table of length 26."
      ],
      oracleFn: (s: string, t: string) => {
        let xor = 0;
        for (let i = 0; i < s.length; i++) xor ^= s.charCodeAt(i);
        for (let i = 0; i < t.length; i++) xor ^= t.charCodeAt(i);
        return String.fromCharCode(xor);
      },
      testCases: {
        functional: [
          ["abcd", "abcde"],
          ["", "y"],
          ["a", "aa"]
        ],
        boundary: [
          ["ae", "aea"],
          ["z", "zz"],
          ["abc", "cbda"],
          ["xyz", "yxza"]
        ],
        adversarial: [
          ["aabbcc", "abcbaca"],
          ["qwerty", "ytrewqa"]
        ],
        stress: [
          ["a".repeat(1000), "a".repeat(1000) + "b"],
          [Array.from({ length: 999 }, (_, i) => String.fromCharCode(97 + (i % 26))).join(''), Array.from({ length: 999 }, (_, i) => String.fromCharCode(97 + (i % 26))).join('') + 'z']
        ]
      }
    }),

    // 44. Unique Number of Occurrences
    createProblem({
      num: 44,
      title: "Unique Number of Occurrences",
      slug: "unique-number-of-occurrences",
      level: 2,
      difficulty: "EASY",
      topic: "Hashing",
      patternSlug: "hashing-prefix-sum",
      estimatedTimeMin: 15,
      statement: "Given an array of integers `arr`, return `true` if the number of occurrences of each value in the array is unique or `false` otherwise.",
      functionName: "uniqueOccurrences",
      parameters: [{ name: "arr", type: "number[]", description: "Array of integers" }],
      returnType: "boolean",
      constraints: ["1 <= arr.length <= 1000", "-1000 <= arr[i] <= 1000"],
      examples: [
        { input: "arr = [1,2,2,1,1,3]", output: "true", explanation: "1 has 3, 2 has 2, 3 has 1." },
        { input: "arr = [1,2]", output: "false", explanation: "1 has 1, 2 has 1." }
      ],
      optimalSolution: `function uniqueOccurrences(arr) {\n  const count = new Map();\n  for (const n of arr) count.set(n, (count.get(n) || 0) + 1);\n  const set = new Set(count.values());\n  return set.size === count.size;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function uniqueOccurrences(arr) {\n  const count = {};\n  for (const n of arr) count[n] = (count[n] || 0) + 1;\n  const vals = Object.values(count);\n  vals.sort((a, b) => a - b);\n  for (let i = 1; i < vals.length; i++) if (vals[i] === vals[i - 1]) return false;\n  return true;\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Comparing elements directly rather than their frequencies"],
      hints: [
        "Count occurrences of each value with a Hash Map.",
        "Insert all frequency counts into a Hash Set.",
        "If set.size === map.size, all frequencies are unique."
      ],
      oracleFn: (arr: number[]) => {
        const count = new Map<number, number>();
        for (const n of arr) count.set(n, (count.get(n) || 0) + 1);
        const set = new Set(count.values());
        return set.size === count.size;
      },
      testCases: {
        functional: [
          [[1, 2, 2, 1, 1, 3]],
          [[1, 2]],
          [[-3, 0, 1, -3, 1, 1, 1, -3, 10, 0]]
        ],
        boundary: [
          [[1]],
          [[1, 1]],
          [[1, 2, 3]],
          [[-1, -1, -2, -2, -2]]
        ],
        adversarial: [
          [[5, 5, 5, 5, 5]],
          [[1, 2, 3, 4, 5, 6, 7]],
          [[0, 0, -1, -1, -1, 2, 2, 2, 2]]
        ],
        stress: [
          [Array.from({ length: 1000 }, (_, i) => i)],
          [Array.from({ length: 1000 }, () => 1)]
        ]
      }
    }),

    // 45. Check If N and Its Double Exist
    createProblem({
      num: 45,
      title: "Check If N and Its Double Exist",
      slug: "check-if-n-and-its-double-exist",
      level: 2,
      difficulty: "EASY",
      topic: "Hashing",
      patternSlug: "hashing-prefix-sum",
      estimatedTimeMin: 15,
      statement: "Given an array `arr` of integers, check if there exist two indices `i` and `j` such that:\n- `i != j`\n- `0 <= i, j < arr.length`\n- `arr[i] == 2 * arr[j]`",
      functionName: "checkIfExist",
      parameters: [{ name: "arr", type: "number[]", description: "Array of integers" }],
      returnType: "boolean",
      constraints: ["2 <= arr.length <= 500", "-10^3 <= arr[i] <= 10^3"],
      examples: [
        { input: "arr = [10,2,5,3]", output: "true", explanation: "10 is double of 5 (10 == 2 * 5)" },
        { input: "arr = [3,1,7,11]", output: "false", explanation: "No double exists" }
      ],
      optimalSolution: `function checkIfExist(arr) {\n  const seen = new Set();\n  for (const n of arr) {\n    if (seen.has(n * 2) || (n % 2 === 0 && seen.has(n / 2))) return true;\n    seen.add(n);\n  }\n  return false;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function checkIfExist(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = 0; j < arr.length; j++) {\n      if (i !== j && arr[i] === 2 * arr[j]) return true;\n    }\n  }\n  return false;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Failing on single zero (0 * 2 = 0 matching self)"],
      hints: [
        "As you iterate, check if n * 2 or (n / 2 when even) has already been seen.",
        "Add n to a Hash Set after checking to prevent matching an element with itself."
      ],
      oracleFn: (arr: number[]) => {
        const seen = new Set<number>();
        for (const n of arr) {
          if (seen.has(n * 2) || (n % 2 === 0 && seen.has(n / 2))) return true;
          seen.add(n);
        }
        return false;
      },
      testCases: {
        functional: [
          [[10, 2, 5, 3]],
          [[3, 1, 7, 11]],
          [[7, 1, 14, 11]]
        ],
        boundary: [
          [[0, 0]],
          [[0]],
          [[-2, 0, 10, -19, 4, 6, -8]],
          [[-10, 12, -20, -8, 0, 1]]
        ],
        adversarial: [
          [[4, -7, 11, 4, 18]],
          [[-2, -4]],
          [[1, 3, 5, 7, 9]]
        ],
        stress: [
          [Array.from({ length: 500 }, (_, i) => i * 2 + 1)],
          [Array.from({ length: 500 }, (_, i) => i === 499 ? 50 : i + 100)]
        ]
      }
    }),

    // 46. Maximum Number of Balloons
    createProblem({
      num: 46,
      title: "Maximum Number of Balloons",
      slug: "maximum-number-of-balloons",
      level: 2,
      difficulty: "EASY",
      topic: "Hashing / Frequency Counting",
      patternSlug: "hashing-prefix-sum",
      estimatedTimeMin: 15,
      statement: "Given a string `text`, you want to use the characters of `text` to form as many instances of the word \"balloon\" as possible.\n\nYou can use each character in `text` at most once. Return the maximum number of instances that can be formed.",
      functionName: "maxNumberOfBalloons",
      parameters: [{ name: "text", type: "string", description: "Input text" }],
      returnType: "number",
      constraints: ["1 <= text.length <= 10^4", "text consists of lower case English letters only."],
      examples: [
        { input: 'text = "nlaebolko"', output: "1", explanation: "One 'balloon' can be formed." },
        { input: 'text = "loonbalxballpoon"', output: "2", explanation: "Two 'balloon's can be formed." }
      ],
      optimalSolution: `function maxNumberOfBalloons(text) {\n  const count = { b: 0, a: 0, l: 0, o: 0, n: 0 };\n  for (const c of text) if (c in count) count[c]++;\n  return Math.min(count.b, count.a, Math.floor(count.l / 2), Math.floor(count.o / 2), count.n);\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function maxNumberOfBalloons(text) {\n  let b = 0, a = 0, l = 0, o = 0, n = 0;\n  for (let i = 0; i < text.length; i++) {\n    if (text[i] === 'b') b++;\n    else if (text[i] === 'a') a++;\n    else if (text[i] === 'l') l++;\n    else if (text[i] === 'o') o++;\n    else if (text[i] === 'n') n++;\n  }\n  return Math.min(b, a, Math.floor(l / 2), Math.floor(o / 2), n);\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Forgetting that 'balloon' requires 2 'l's and 2 'o's"],
      hints: [
        "In 'balloon': b:1, a:1, l:2, o:2, n:1.",
        "Count occurrences of each of these 5 letters.",
        "Take min(b, a, l/2, o/2, n)."
      ],
      oracleFn: (text: string) => {
        const count: Record<string, number> = { b: 0, a: 0, l: 0, o: 0, n: 0 };
        for (const c of text) if (c in count) count[c]++;
        return Math.min(count.b, count.a, Math.floor(count.l / 2), Math.floor(count.o / 2), count.n);
      },
      testCases: {
        functional: [
          ["nlaebolko"],
          ["loonbalxballpoon"],
          ["leetcode"]
        ],
        boundary: [
          ["balloon"],
          ["bbaalllloooonn"],
          ["b"],
          [""]
        ],
        adversarial: [
          ["ballon"],
          ["balon"],
          ["balloooonnnn"]
        ],
        stress: [
          ["balloon".repeat(1000)],
          [Array.from({ length: 5000 }, (_, i) => String.fromCharCode(97 + (i % 26))).join('')]
        ]
      }
    }),

    // 47. Find Lucky Integer in an Array
    createProblem({
      num: 47,
      title: "Find Lucky Integer in an Array",
      slug: "find-lucky-integer-in-an-array",
      level: 2,
      difficulty: "EASY",
      topic: "Hashing",
      patternSlug: "hashing-prefix-sum",
      estimatedTimeMin: 15,
      statement: "Given an array of integers `arr`, a lucky integer is an integer that has a frequency in the array equal to its value.\n\nReturn the largest lucky integer in the array. If there is no lucky integer return `-1`.",
      functionName: "findLucky",
      parameters: [{ name: "arr", type: "number[]", description: "Array of integers" }],
      returnType: "number",
      constraints: ["1 <= arr.length <= 500", "1 <= arr[i] <= 500"],
      examples: [
        { input: "arr = [2,2,3,4]", output: "2", explanation: "2 has frequency 2." },
        { input: "arr = [1,2,2,3,3,3]", output: "3", explanation: "1, 2, 3 are all lucky. 3 is largest." },
        { input: "arr = [2,2,2,3,3]", output: "-1", explanation: "No lucky integers." }
      ],
      optimalSolution: `function findLucky(arr) {\n  const freq = new Map();\n  for (const n of arr) freq.set(n, (freq.get(n) || 0) + 1);\n  let maxLucky = -1;\n  for (const [k, v] of freq) {\n    if (k === v && k > maxLucky) maxLucky = k;\n  }\n  return maxLucky;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function findLucky(arr) {\n  arr.sort((a, b) => b - a);\n  let cur = arr[0], count = 1;\n  for (let i = 1; i <= arr.length; i++) {\n    if (i < arr.length && arr[i] === cur) count++;\n    else {\n      if (cur === count) return cur;\n      if (i < arr.length) { cur = arr[i]; count = 1; }\n    }\n  }\n  return -1;\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Returning the first lucky integer found rather than the maximum one"],
      hints: [
        "Count frequencies of all numbers in a Hash Map.",
        "Iterate over map entries and find the largest k where key === value."
      ],
      oracleFn: (arr: number[]) => {
        const freq = new Map<number, number>();
        for (const n of arr) freq.set(n, (freq.get(n) || 0) + 1);
        let maxLucky = -1;
        for (const [k, v] of freq) {
          if (k === v && k > maxLucky) maxLucky = k;
        }
        return maxLucky;
      },
      testCases: {
        functional: [
          [[2, 2, 3, 4]],
          [[1, 2, 2, 3, 3, 3]],
          [[2, 2, 2, 3, 3]]
        ],
        boundary: [
          [[5]],
          [[1]],
          [[7, 7, 7, 7, 7, 7, 7]],
          [[500]]
        ],
        adversarial: [
          [[1, 2, 2, 3, 3, 3, 4, 4, 4, 4]],
          [[4, 3, 2, 2, 4, 1, 3, 4, 3]]
        ],
        stress: [
          [Array.from({ length: 500 }, (_, i) => i === 0 ? 1 : 2)],
          [Array.from({ length: 500 }, () => 500)]
        ]
      }
    }),

    // 48. Sort Characters By Frequency
    createProblem({
      num: 48,
      title: "Sort Characters By Frequency",
      slug: "sort-characters-by-frequency",
      level: 2,
      difficulty: "MEDIUM",
      topic: "Hashing / Bucket Sort",
      patternSlug: "hashing-prefix-sum",
      estimatedTimeMin: 20,
      statement: "Given a string `s`, sort it in decreasing order based on the frequency of the characters. The frequency of a character is the number of times it appears in the string.\n\nReturn the sorted string. If there are multiple answers, return any of them.",
      functionName: "frequencySort",
      parameters: [{ name: "s", type: "string", description: "Input string" }],
      returnType: "string",
      constraints: ["1 <= s.length <= 5 * 10^5", "s consists of uppercase and lowercase English letters and digits."],
      examples: [
        { input: 's = "tree"', output: '"eert"', explanation: "'e' appears twice, 'r' and 't' both appear once." },
        { input: 's = "cccaaa"', output: '"aaaccc"', explanation: "Both 'c' and 'a' appear three times." }
      ],
      optimalSolution: `function frequencySort(s) {\n  const freq = new Map();\n  for (const c of s) freq.set(c, (freq.get(c) || 0) + 1);\n  const sorted = Array.from(freq.entries()).sort((a, b) => b[1] - a[1] || a[0].charCodeAt(0) - b[0].charCodeAt(0));\n  return sorted.map(([char, count]) => char.repeat(count)).join('');\n}`,
      optimalTimeComplexity: "O(N log K)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function frequencySort(s) {\n  const freq = {};\n  for (const c of s) freq[c] = (freq[c] || 0) + 1;\n  return Object.keys(freq).sort((a, b) => freq[b] - freq[a] || a.charCodeAt(0) - b.charCodeAt(0)).map(c => c.repeat(freq[c])).join('');\n}`,
      suboptimalTimeComplexity: "O(N log K)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Case sensitivity: 'A' and 'a' are distinct characters"],
      hints: [
        "Count frequencies of each character.",
        "Group characters by frequency using bucket sort for O(N) runtime.",
        "Construct result string in descending order of frequency buckets."
      ],
      oracleFn: (s: string) => {
        const freq = new Map<string, number>();
        for (const c of s) freq.set(c, (freq.get(c) || 0) + 1);
        const sorted = Array.from(freq.entries()).sort((a, b) => b[1] - a[1] || a[0].charCodeAt(0) - b[0].charCodeAt(0));
        return sorted.map(([char, count]) => char.repeat(count)).join('');
      },
      testCases: {
        functional: [
          ["tree"],
          ["cccaaa"],
          ["Aabb"]
        ],
        boundary: [
          ["a"],
          ["z"],
          ["112233"],
          ["AbCdEfG"]
        ],
        adversarial: [
          ["loveleetcode"],
          ["raaeaedere"],
          ["2a554442f544asfasssffffasss"]
        ],
        stress: [
          ["a".repeat(2000) + "b".repeat(1000)],
          [Array.from({ length: 3000 }, (_, i) => String.fromCharCode(65 + (i % 26))).join('')]
        ]
      }
    }),

    // 49. First Letter to Appear Twice
    createProblem({
      num: 49,
      title: "First Letter to Appear Twice",
      slug: "first-letter-to-appear-twice",
      level: 2,
      difficulty: "EASY",
      topic: "Hashing",
      patternSlug: "hashing-prefix-sum",
      estimatedTimeMin: 15,
      statement: "Given a string `s` consisting of lowercase English letters, return the first letter to appear twice.\n\nNote: A letter `a` appears twice before another letter `b` if the second occurrence of `a` is before the second occurrence of `b`.",
      functionName: "repeatedCharacter",
      parameters: [{ name: "s", type: "string", description: "Input string" }],
      returnType: "string",
      constraints: ["2 <= s.length <= 100", "s consists of lowercase English letters.", "s has at least one repeated letter."],
      examples: [
        { input: 's = "abccbaacz"', output: '"c"', explanation: "'c' appears twice at index 3, which is before the second occurrence of any other letter." },
        { input: 's = "abcdd"', output: '"d"', explanation: "'d' appears at index 3 and 4." }
      ],
      optimalSolution: `function repeatedCharacter(s) {\n  const seen = new Set();\n  for (const c of s) {\n    if (seen.has(c)) return c;\n    seen.add(c);\n  }\n  return '';\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function repeatedCharacter(s) {\n  for (let i = 0; i < s.length; i++) {\n    for (let j = 0; j < i; j++) {\n      if (s[i] === s[j]) return s[i];\n    }\n  }\n  return '';\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Finding letter with highest total count instead of the letter whose second occurrence appears earliest"],
      hints: [
        "Traverse string from left to right.",
        "Add characters to a Hash Set or bitmask.",
        "The first character already present in the set is the answer."
      ],
      oracleFn: (s: string) => {
        const seen = new Set<string>();
        for (const c of s) {
          if (seen.has(c)) return c;
          seen.add(c);
        }
        return '';
      },
      testCases: {
        functional: [
          ["abccbaacz"],
          ["abcdd"],
          ["aa"]
        ],
        boundary: [
          ["aba"],
          ["abba"],
          ["abcdefa"],
          ["zyxwvutsrqponmlkjihgfedcbaz"]
        ],
        adversarial: [
          ["nwcn"],
          ["jkdflgkjh"],
          ["asdfghjklza"]
        ],
        stress: [
          [Array.from({ length: 100 }, (_, i) => i === 99 ? 'a' : String.fromCharCode(97 + (i % 25))).join('')],
          ["abcdefghijklmnopqrstuvwxyz".repeat(2)]
        ]
      }
    })
  ];

  return {
    level: 2,
    levelTitle: "Level 2 — Hashing, Prefix Sum & Frequency",
    topic: "Hash Maps & Invariant Running Sums",
    problems
  };
}
