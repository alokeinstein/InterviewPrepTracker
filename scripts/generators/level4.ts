import { LevelPayload, GeneratedProblem } from './types';
import { createProblem } from './problemBuilder';

export function getLevel4Payload(): LevelPayload {
  const problems: GeneratedProblem[] = [
    // 71. Maximum Average Subarray I
    createProblem({
      num: 71,
      title: "Maximum Average Subarray I",
      slug: "maximum-average-subarray-i",
      level: 4,
      difficulty: "EASY",
      topic: "Sliding Window",
      patternSlug: "sliding-window",
      estimatedTimeMin: 15,
      statement: "You are given an integer array `nums` consisting of `n` elements, and an integer `k`.\n\nFind a contiguous subarray whose length is equal to `k` that has the maximum average value and return this value. Any answer with a calculation error less than `10^-5` will be accepted.",
      functionName: "findMaxAverage",
      parameters: [
        { name: "nums", type: "number[]", description: "Array of integers" },
        { name: "k", type: "number", description: "Fixed window size" }
      ],
      returnType: "number",
      constraints: ["n == nums.length", "1 <= k <= n <= 10^5", "-10^4 <= nums[i] <= 10^4"],
      examples: [
        { input: "nums = [1,12,-5,-6,50,3], k = 4", output: "12.75000", explanation: "Subarray [12, -5, -6, 50] has sum 51, average 51 / 4 = 12.75." },
        { input: "nums = [5], k = 1", output: "5.00000", explanation: "5 / 1 = 5." }
      ],
      optimalSolution: `function findMaxAverage(nums, k) {\n  let sum = 0;\n  for (let i = 0; i < k; i++) sum += nums[i];\n  let maxSum = sum;\n  for (let i = k; i < nums.length; i++) {\n    sum += nums[i] - nums[i - k];\n    if (sum > maxSum) maxSum = sum;\n  }\n  return maxSum / k;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function findMaxAverage(nums, k) {\n  let maxAvg = -Infinity;\n  for (let i = 0; i <= nums.length - k; i++) {\n    let s = 0;\n    for (let j = i; j < i + k; j++) s += nums[j];\n    maxAvg = Math.max(maxAvg, s / k);\n  }\n  return maxAvg;\n}`,
      suboptimalTimeComplexity: "O(N * K)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Recalculating the entire sum of k elements at every index O(N * K)"],
      hints: [
        "Compute initial window sum of first k elements.",
        "Slide the window by adding nums[i] and subtracting nums[i - k].",
        "Track maximum sum and divide by k once at the end."
      ],
      oracleFn: (nums: number[], k: number) => {
        let sum = 0;
        for (let i = 0; i < k; i++) sum += nums[i];
        let maxSum = sum;
        for (let i = k; i < nums.length; i++) {
          sum += nums[i] - nums[i - k];
          if (sum > maxSum) maxSum = sum;
        }
        return maxSum / k;
      },
      testCases: {
        functional: [
          [[1, 12, -5, -6, 50, 3], 4],
          [[5], 1],
          [[0, 4, 0, 3, 2], 1]
        ],
        boundary: [
          [[1, 2, 3, 4], 4],
          [[-1], 1],
          [[-1, -2, -3, -4], 2],
          [[1000, 1000, 1000], 3]
        ],
        adversarial: [
          [[1, -5, 20, -10, 50, -2], 3],
          [[0, 0, 0, 0], 2]
        ],
        stress: [
          [Array.from({ length: 3000 }, (_, i) => (i % 2 === 0 ? 10 : -10)), 500],
          [Array.from({ length: 4000 }, () => 7), 1000]
        ]
      }
    }),

    // 72. Maximum Number of Vowels in a Substring of Given Length
    createProblem({
      num: 72,
      title: "Maximum Number of Vowels in a Substring of Given Length",
      slug: "maximum-number-of-vowels-in-a-substring-of-given-length",
      level: 4,
      difficulty: "MEDIUM",
      topic: "Sliding Window",
      patternSlug: "sliding-window",
      estimatedTimeMin: 15,
      statement: "Given a string `s` and an integer `k`, return the maximum number of vowel letters in any substring of `s` with length `k`.\n\nVowel letters in English are 'a', 'e', 'i', 'o', and 'u'.",
      functionName: "maxVowels",
      parameters: [
        { name: "s", type: "string", description: "Source string" },
        { name: "k", type: "number", description: "Substring length" }
      ],
      returnType: "number",
      constraints: ["1 <= s.length <= 10^5", "s consists of lowercase English letters.", "1 <= k <= s.length"],
      examples: [
        { input: 's = "abciiidef", k = 3', output: "3", explanation: "'iii' contains 3 vowels." },
        { input: 's = "aeiou", k = 2', output: "2", explanation: "Any substring of length 2 has 2 vowels." }
      ],
      optimalSolution: `function maxVowels(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let cur = 0;\n  for (let i = 0; i < k; i++) if (vowels.has(s[i])) cur++;\n  let maxV = cur;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) cur++;\n    if (vowels.has(s[i - k])) cur--;\n    if (cur > maxV) maxV = cur;\n    if (maxV === k) return k;\n  }\n  return maxV;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function maxVowels(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let maxV = 0;\n  for (let i = 0; i <= s.length - k; i++) {\n    let c = 0;\n    for (let j = i; j < i + k; j++) if (vowels.has(s[j])) c++;\n    maxV = Math.max(maxV, c);\n  }\n  return maxV;\n}`,
      suboptimalTimeComplexity: "O(N * K)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Checking characters in nested loops rather than rolling window count"],
      hints: [
        "Initialize vowel count for the first window of length k.",
        "When shifting the window by 1: add 1 if incoming char is vowel, subtract 1 if outgoing char was vowel.",
        "Early exit if maxVowels === k."
      ],
      oracleFn: (s: string, k: number) => {
        const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
        let cur = 0;
        for (let i = 0; i < k; i++) if (vowels.has(s[i])) cur++;
        let maxV = cur;
        for (let i = k; i < s.length; i++) {
          if (vowels.has(s[i])) cur++;
          if (vowels.has(s[i - k])) cur--;
          if (cur > maxV) maxV = cur;
          if (maxV === k) return k;
        }
        return maxV;
      },
      testCases: {
        functional: [
          ["abciiidef", 3],
          ["aeiou", 2],
          ["leetcode", 3]
        ],
        boundary: [
          ["a", 1],
          ["b", 1],
          ["rhythms", 4],
          ["aeiou", 5]
        ],
        adversarial: [
          ["weallloveyou", 7],
          ["ibpbhixepfakdsr", 3],
          ["tryhard", 4]
        ],
        stress: [
          ["aeiou".repeat(500), 250],
          ["bcdfgh".repeat(500), 300]
        ]
      }
    }),

    // 73. Longest Substring Without Repeating Characters
    createProblem({
      num: 73,
      title: "Longest Substring Without Repeating Characters",
      slug: "longest-substring-without-repeating-characters",
      level: 4,
      difficulty: "MEDIUM",
      topic: "Sliding Window",
      patternSlug: "sliding-window",
      estimatedTimeMin: 20,
      statement: "Given a string `s`, find the length of the longest substring without repeating characters.",
      functionName: "lengthOfLongestSubstring",
      parameters: [{ name: "s", type: "string", description: "Input string" }],
      returnType: "number",
      constraints: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."],
      examples: [
        { input: 's = "abcabcbb"', output: "3", explanation: "Longest substring is 'abc' with length 3." },
        { input: 's = "bbbbb"', output: "1", explanation: "Longest is 'b'." },
        { input: 's = "pwwkew"', output: "3", explanation: "Longest is 'wke'." }
      ],
      optimalSolution: `function lengthOfLongestSubstring(s) {\n  const map = new Map();\n  let left = 0, maxLen = 0;\n  for (let right = 0; right < s.length; right++) {\n    const char = s[right];\n    if (map.has(char) && map.get(char) >= left) {\n      left = map.get(char) + 1;\n    }\n    map.set(char, right);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(min(N, M)) where M is character set size",
      suboptimalSolution: `function lengthOfLongestSubstring(s) {\n  let maxLen = 0;\n  for (let i = 0; i < s.length; i++) {\n    const seen = new Set();\n    for (let j = i; j < s.length; j++) {\n      if (seen.has(s[j])) break;\n      seen.add(s[j]);\n      maxLen = Math.max(maxLen, j - i + 1);\n    }\n  }\n  return maxLen;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(min(N, M))",
      commonMistakes: ["Moving left pointer to previous position rather than map.get(char) + 1", "Forgetting empty string returns 0"],
      hints: [
        "Use a sliding window [left, right] and store last seen index of each character in a Hash Map.",
        "When duplicate character s[right] is encountered at index j >= left, jump left to j + 1.",
        "Track max window size right - left + 1."
      ],
      oracleFn: (s: string) => {
        const map = new Map<string, number>();
        let left = 0, maxLen = 0;
        for (let right = 0; right < s.length; right++) {
          const char = s[right];
          if (map.has(char) && map.get(char)! >= left) {
            left = map.get(char)! + 1;
          }
          map.set(char, right);
          maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
      },
      testCases: {
        functional: [
          ["abcabcbb"],
          ["bbbbb"],
          ["pwwkew"]
        ],
        boundary: [
          [""],
          [" "],
          ["au"],
          ["dvdf"]
        ],
        adversarial: [
          ["tmmzuxt"],
          ["abba"],
          ["abcdefghijklmnopqrstuvwxyz"]
        ],
        stress: [
          ["abcdefghijklmnopqrstuvwxyz".repeat(100)],
          ["a".repeat(3000)]
        ]
      }
    }),

    // 74. Longest Repeating Character Replacement
    createProblem({
      num: 74,
      title: "Longest Repeating Character Replacement",
      slug: "longest-repeating-character-replacement",
      level: 4,
      difficulty: "MEDIUM",
      topic: "Sliding Window",
      patternSlug: "sliding-window",
      estimatedTimeMin: 20,
      statement: "You are given a string `s` and an integer `k`. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most `k` times.\n\nReturn the length of the longest substring containing the same letter you can get after performing the above operations.",
      functionName: "characterReplacement",
      parameters: [
        { name: "s", type: "string", description: "Uppercase string" },
        { name: "k", type: "number", description: "Max replacements allowed" }
      ],
      returnType: "number",
      constraints: ["1 <= s.length <= 10^5", "s consists of only uppercase English letters.", "0 <= k <= s.length"],
      examples: [
        { input: 's = "ABAB", k = 2', output: "4", explanation: "Replace the two 'A's with 'B's or vice versa to get 'BBBB' or 'AAAA'." },
        { input: 's = "AABABBA", k = 1', output: "4", explanation: "Replace middle 'A' to get 'AABBBBA' -> 'BBBB' length 4." }
      ],
      optimalSolution: `function characterReplacement(s, k) {\n  const count = new Array(26).fill(0);\n  let left = 0, maxFreq = 0, maxLen = 0;\n  for (let right = 0; right < s.length; right++) {\n    const idx = s.charCodeAt(right) - 65;\n    count[idx]++;\n    maxFreq = Math.max(maxFreq, count[idx]);\n    while ((right - left + 1) - maxFreq > k) {\n      count[s.charCodeAt(left) - 65]--;\n      left++;\n    }\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function characterReplacement(s, k) {\n  let maxLen = 0;\n  for (let i = 0; i < s.length; i++) {\n    const count = new Array(26).fill(0);\n    let maxFreq = 0;\n    for (let j = i; j < s.length; j++) {\n      const idx = s.charCodeAt(j) - 65;\n      count[idx]++;\n      maxFreq = Math.max(maxFreq, count[idx]);\n      if ((j - i + 1) - maxFreq <= k) maxLen = Math.max(maxLen, j - i + 1);\n    }\n  }\n  return maxLen;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Recalculating maxFreq over all 26 letters when shrinking the window (maxFreq doesn't need to decrement because a smaller maxFreq cannot produce a larger window)"],
      hints: [
        "Window invariant: window length (right - left + 1) - maxFrequency <= k.",
        "If remaining characters to replace > k, contract window by incrementing left.",
        "Track max window size."
      ],
      oracleFn: (s: string, k: number) => {
        const count = new Array(26).fill(0);
        let left = 0, maxFreq = 0, maxLen = 0;
        for (let right = 0; right < s.length; right++) {
          const idx = s.charCodeAt(right) - 65;
          count[idx]++;
          maxFreq = Math.max(maxFreq, count[idx]);
          while ((right - left + 1) - maxFreq > k) {
            count[s.charCodeAt(left) - 65]--;
            left++;
          }
          maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
      },
      testCases: {
        functional: [
          ["ABAB", 2],
          ["AABABBA", 1],
          ["AAAA", 2]
        ],
        boundary: [
          ["A", 0],
          ["A", 1],
          ["AB", 0],
          ["AB", 1]
        ],
        adversarial: [
          ["ABCDE", 1],
          ["KRSCDCSONAJNHLBMAQEZTXCOVAZQ", 4],
          ["BAAA", 0]
        ],
        stress: [
          ["AB".repeat(1500), 500],
          ["A".repeat(3000), 10]
        ]
      }
    }),

    // 75. Permutation in String
    createProblem({
      num: 75,
      title: "Permutation in String",
      slug: "permutation-in-string",
      level: 4,
      difficulty: "MEDIUM",
      topic: "Sliding Window",
      patternSlug: "sliding-window",
      estimatedTimeMin: 20,
      statement: "Given two strings `s1` and `s2`, return `true` if `s2` contains a permutation of `s1`, or `false` otherwise.\n\nIn other words, return `true` if one of `s1`'s permutations is the substring of `s2`.",
      functionName: "checkInclusion",
      parameters: [
        { name: "s1", type: "string", description: "Pattern string" },
        { name: "s2", type: "string", description: "Search text" }
      ],
      returnType: "boolean",
      constraints: ["1 <= s1.length, s2.length <= 10^4", "s1 and s2 consist of lowercase English letters."],
      examples: [
        { input: 's1 = "ab", s2 = "eidbaooo"', output: "true", explanation: "'ba' is a permutation of 'ab' inside 'eidbaooo'." },
        { input: 's1 = "ab", s2 = "eidboaoo"', output: "false", explanation: "No permutation of 'ab' exists as substring." }
      ],
      optimalSolution: `function checkInclusion(s1, s2) {\n  if (s1.length > s2.length) return false;\n  const count1 = new Array(26).fill(0), count2 = new Array(26).fill(0);\n  for (let i = 0; i < s1.length; i++) {\n    count1[s1.charCodeAt(i) - 97]++;\n    count2[s2.charCodeAt(i) - 97]++;\n  }\n  let matches = 0;\n  for (let i = 0; i < 26; i++) if (count1[i] === count2[i]) matches++;\n  for (let i = 0; i < s2.length - s1.length; i++) {\n    if (matches === 26) return true;\n    const r = s2.charCodeAt(i + s1.length) - 97;\n    const l = s2.charCodeAt(i) - 97;\n    count2[r]++;\n    if (count2[r] === count1[r]) matches++;\n    else if (count2[r] === count1[r] + 1) matches--;\n    count2[l]--;\n    if (count2[l] === count1[l]) matches++;\n    else if (count2[l] === count1[l] - 1) matches--;\n  }\n  return matches === 26;\n}`,
      optimalTimeComplexity: "O(L1 + L2)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function checkInclusion(s1, s2) {\n  const k = s1.length;\n  const target = s1.split('').sort().join('');\n  for (let i = 0; i <= s2.length - k; i++) {\n    if (s2.slice(i, i + k).split('').sort().join('') === target) return true;\n  }\n  return false;\n}`,
      suboptimalTimeComplexity: "O(L2 * L1 log L1)",
      suboptimalSpaceComplexity: "O(L1)",
      commonMistakes: ["Comparing 26-element frequency array with full loop at every position instead of maintaining matches count in O(1)"],
      hints: [
        "A permutation of s1 in s2 is an exact anagram substring of length s1.length.",
        "Maintain fixed sliding window of size s1.length.",
        "Track character counts and match state."
      ],
      oracleFn: (s1: string, s2: string) => {
        if (s1.length > s2.length) return false;
        const c1 = new Array(26).fill(0), c2 = new Array(26).fill(0);
        for (let i = 0; i < s1.length; i++) {
          c1[s1.charCodeAt(i) - 97]++;
          c2[s2.charCodeAt(i) - 97]++;
        }
        let matches = 0;
        for (let i = 0; i < 26; i++) if (c1[i] === c2[i]) matches++;
        for (let i = 0; i < s2.length - s1.length; i++) {
          if (matches === 26) return true;
          const r = s2.charCodeAt(i + s1.length) - 97;
          const l = s2.charCodeAt(i) - 97;
          c2[r]++;
          if (c2[r] === c1[r]) matches++;
          else if (c2[r] === c1[r] + 1) matches--;
          c2[l]--;
          if (c2[l] === c1[l]) matches++;
          else if (c2[l] === c1[l] - 1) matches--;
        }
        return matches === 26;
      },
      testCases: {
        functional: [
          ["ab", "eidbaooo"],
          ["ab", "eidboaoo"],
          ["adc", "dcda"]
        ],
        boundary: [
          ["a", "a"],
          ["a", "b"],
          ["ab", "a"],
          ["hello", "ooolleoooleh"]
        ],
        adversarial: [
          ["prosperity", "properties"],
          ["dinitrophenylhydrazine", "dinitrophenylhydrazinetest"],
          ["trinitrophenylmethylnitramine", "dinitrophenylhydrazinetrinitrophenylmethylnitramine"]
        ],
        stress: [
          ["a".repeat(100), "b".repeat(1000) + "a".repeat(100) + "b".repeat(1000)],
          ["ab".repeat(50), "cd".repeat(1000)]
        ]
      }
    }),

    // 76. Find All Anagrams in a String
    createProblem({
      num: 76,
      title: "Find All Anagrams in a String",
      slug: "find-all-anagrams-in-a-string",
      level: 4,
      difficulty: "MEDIUM",
      topic: "Sliding Window",
      patternSlug: "sliding-window",
      estimatedTimeMin: 20,
      statement: "Given two strings `s` and `p`, return an array of all the start indices of `p`'s anagrams in `s`. You may return the answer in any order.",
      functionName: "findAnagrams",
      parameters: [
        { name: "s", type: "string", description: "Search string" },
        { name: "p", type: "string", description: "Pattern string" }
      ],
      returnType: "number[]",
      constraints: ["1 <= s.length, p.length <= 3 * 10^4", "s and p consist of lowercase English letters."],
      examples: [
        { input: 's = "cbaebabacd", p = "abc"', output: "[0,6]", explanation: "Substrings at 0 ('cba') and 6 ('bac') are anagrams of 'abc'." },
        { input: 's = "abab", p = "ab"', output: "[0,1,2]", explanation: "Substrings at 0, 1, 2 are anagrams." }
      ],
      optimalSolution: `function findAnagrams(s, p) {\n  if (s.length < p.length) return [];\n  const pCount = new Array(26).fill(0), sCount = new Array(26).fill(0);\n  for (let i = 0; i < p.length; i++) {\n    pCount[p.charCodeAt(i) - 97]++;\n    sCount[s.charCodeAt(i) - 97]++;\n  }\n  const res = [];\n  let matches = 0;\n  for (let i = 0; i < 26; i++) if (pCount[i] === sCount[i]) matches++;\n  for (let i = 0; i < s.length - p.length; i++) {\n    if (matches === 26) res.push(i);\n    const r = s.charCodeAt(i + p.length) - 97;\n    const l = s.charCodeAt(i) - 97;\n    sCount[r]++;\n    if (sCount[r] === pCount[r]) matches++;\n    else if (sCount[r] === pCount[r] + 1) matches--;\n    sCount[l]--;\n    if (sCount[l] === pCount[l]) matches++;\n    else if (sCount[l] === pCount[l] - 1) matches--;\n  }\n  if (matches === 26) res.push(s.length - p.length);\n  return res;\n}`,
      optimalTimeComplexity: "O(S)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function findAnagrams(s, p) {\n  const k = p.length, target = p.split('').sort().join(''), res = [];\n  for (let i = 0; i <= s.length - k; i++) {\n    if (s.slice(i, i + k).split('').sort().join('') === target) res.push(i);\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(S * P log P)",
      suboptimalSpaceComplexity: "O(P)",
      commonMistakes: ["Checking the last window after loop termination"],
      hints: [
        "Use a fixed-size sliding window of length p.length.",
        "Track frequency counts of s and p with two 26-slot arrays.",
        "Whenever frequencies match, record the start index."
      ],
      oracleFn: (s: string, p: string) => {
        if (s.length < p.length) return [];
        const pCount = new Array(26).fill(0), sCount = new Array(26).fill(0);
        for (let i = 0; i < p.length; i++) {
          pCount[p.charCodeAt(i) - 97]++;
          sCount[s.charCodeAt(i) - 97]++;
        }
        const res: number[] = [];
        let matches = 0;
        for (let i = 0; i < 26; i++) if (pCount[i] === sCount[i]) matches++;
        for (let i = 0; i < s.length - p.length; i++) {
          if (matches === 26) res.push(i);
          const r = s.charCodeAt(i + p.length) - 97;
          const l = s.charCodeAt(i) - 97;
          sCount[r]++;
          if (sCount[r] === pCount[r]) matches++;
          else if (sCount[r] === pCount[r] + 1) matches--;
          sCount[l]--;
          if (sCount[l] === pCount[l]) matches++;
          else if (sCount[l] === pCount[l] - 1) matches--;
        }
        if (matches === 26) res.push(s.length - p.length);
        return res;
      },
      testCases: {
        functional: [
          ["cbaebabacd", "abc"],
          ["abab", "ab"],
          ["baa", "aa"]
        ],
        boundary: [
          ["a", "a"],
          ["a", "b"],
          ["ab", "abc"],
          ["aaaaaaaaaa", "aaaa"]
        ],
        adversarial: [
          ["af", "be"],
          ["bbababacb", "abb"],
          ["dinitrophenylhydrazine", "phenyl"]
        ],
        stress: [
          ["a".repeat(3000), "a".repeat(10)],
          ["ab".repeat(1000), "ba"]
        ]
      }
    }),

    // 77. Minimum Size Subarray Sum
    createProblem({
      num: 77,
      title: "Minimum Size Subarray Sum",
      slug: "minimum-size-subarray-sum",
      level: 4,
      difficulty: "MEDIUM",
      topic: "Sliding Window",
      patternSlug: "sliding-window",
      estimatedTimeMin: 20,
      statement: "Given an array of positive integers `nums` and a positive integer `target`, return the minimal length of a subarray whose sum is greater than or equal to `target`. If there is no such subarray, return `0` instead.",
      functionName: "minSubArrayLen",
      parameters: [
        { name: "target", type: "number", description: "Target sum" },
        { name: "nums", type: "number[]", description: "Array of positive integers" }
      ],
      returnType: "number",
      constraints: ["1 <= target <= 10^9", "1 <= nums.length <= 10^5", "1 <= nums[i] <= 10^4"],
      examples: [
        { input: "target = 7, nums = [2,3,1,2,4,3]", output: "2", explanation: "Subarray [4, 3] has minimal length 2." },
        { input: "target = 4, nums = [1,4,4]", output: "1", explanation: "[4] has length 1." },
        { input: "target = 11, nums = [1,1,1,1,1,1,1,1]", output: "0", explanation: "Total sum is 8 < 11." }
      ],
      optimalSolution: `function minSubArrayLen(target, nums) {\n  let left = 0, sum = 0, minLen = Infinity;\n  for (let right = 0; right < nums.length; right++) {\n    sum += nums[right];\n    while (sum >= target) {\n      minLen = Math.min(minLen, right - left + 1);\n      sum -= nums[left++];\n    }\n  }\n  return minLen === Infinity ? 0 : minLen;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function minSubArrayLen(target, nums) {\n  let minLen = Infinity;\n  for (let i = 0; i < nums.length; i++) {\n    let s = 0;\n    for (let j = i; j < nums.length; j++) {\n      s += nums[j];\n      if (s >= target) { minLen = Math.min(minLen, j - i + 1); break; }\n    }\n  }\n  return minLen === Infinity ? 0 : minLen;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Returning Infinity or 0 when no subarray meets condition"],
      hints: [
        "Since all numbers are positive, adding elements strictly increases sum, and removing from left strictly decreases sum.",
        "Expand right pointer until sum >= target.",
        "Contract left pointer while sum >= target, updating minLen."
      ],
      oracleFn: (target: number, nums: number[]) => {
        let left = 0, sum = 0, minLen = Infinity;
        for (let right = 0; right < nums.length; right++) {
          sum += nums[right];
          while (sum >= target) {
            minLen = Math.min(minLen, right - left + 1);
            sum -= nums[left++];
          }
        }
        return minLen === Infinity ? 0 : minLen;
      },
      testCases: {
        functional: [
          [7, [2, 3, 1, 2, 4, 3]],
          [4, [1, 4, 4]],
          [11, [1, 1, 1, 1, 1, 1, 1, 1]]
        ],
        boundary: [
          [100, [100]],
          [100, [99]],
          [1, [5]],
          [10, [1, 2, 3, 4]]
        ],
        adversarial: [
          [15, [1, 2, 3, 4, 5]],
          [15, [5, 1, 3, 5, 10, 7, 4, 9, 2, 8]],
          [213, [12, 28, 83, 4, 25, 26, 25, 2, 25, 25, 25, 12]]
        ],
        stress: [
          [1000, Array.from({ length: 3000 }, () => 1)],
          [50000, Array.from({ length: 4000 }, (_, i) => i)]
        ]
      }
    }),

    // 78. Minimum Window Substring
    createProblem({
      num: 78,
      title: "Minimum Window Substring",
      slug: "minimum-window-substring",
      level: 4,
      difficulty: "HARD",
      topic: "Sliding Window",
      patternSlug: "sliding-window",
      estimatedTimeMin: 25,
      statement: "Given two strings `s` and `t` of lengths `m` and `n` respectively, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string `\"\"`.",
      functionName: "minWindow",
      parameters: [
        { name: "s", type: "string", description: "Source string" },
        { name: "t", type: "string", description: "Target string" }
      ],
      returnType: "string",
      constraints: ["m == s.length", "n == t.length", "1 <= m, n <= 10^5", "s and t consist of uppercase and lowercase English letters."],
      examples: [
        { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"', explanation: "'BANC' contains A, B, and C with minimum length 4." },
        { input: 's = "a", t = "a"', output: '"a"', explanation: "'a' matches." },
        { input: 's = "a", t = "aa"', output: '""', explanation: "Cannot match 2 'a's from single 'a'." }
      ],
      optimalSolution: `function minWindow(s, t) {\n  if (s.length < t.length) return '';\n  const tMap = new Map();\n  for (const c of t) tMap.set(c, (tMap.get(c) || 0) + 1);\n  const windowMap = new Map();\n  let have = 0, need = tMap.size;\n  let res = [-1, -1], minLen = Infinity;\n  let left = 0;\n  for (let right = 0; right < s.length; right++) {\n    const c = s[right];\n    windowMap.set(c, (windowMap.get(c) || 0) + 1);\n    if (tMap.has(c) && windowMap.get(c) === tMap.get(c)) have++;\n    while (have === need) {\n      if (right - left + 1 < minLen) {\n        minLen = right - left + 1;\n        res = [left, right];\n      }\n      const lChar = s[left];\n      windowMap.set(lChar, windowMap.get(lChar) - 1);\n      if (tMap.has(lChar) && windowMap.get(lChar) < tMap.get(lChar)) have--;\n      left++;\n    }\n  }\n  return res[0] === -1 ? '' : s.slice(res[0], res[1] + 1);\n}`,
      optimalTimeComplexity: "O(S + T)",
      optimalSpaceComplexity: "O(S + T)",
      suboptimalSolution: `function minWindow(s, t) {\n  let minStr = '';\n  for (let i = 0; i < s.length; i++) {\n    for (let j = i + t.length; j <= s.length; j++) {\n      const sub = s.slice(i, j);\n      let ok = true, temp = sub;\n      for (const c of t) {\n        const idx = temp.indexOf(c);\n        if (idx === -1) { ok = false; break; }\n        temp = temp.slice(0, idx) + temp.slice(idx + 1);\n      }\n      if (ok && (minStr === '' || sub.length < minStr.length)) minStr = sub;\n    }\n  }\n  return minStr;\n}`,
      suboptimalTimeComplexity: "O(S^2 * T)",
      suboptimalSpaceComplexity: "O(S)",
      commonMistakes: ["Checking characters case-insensitively ('A' and 'a' are distinct)", "Failing on duplicate required characters"],
      hints: [
        "Count frequency of each character in t.",
        "Track 'have' matching characters vs 'need' unique characters in t.",
        "Expand right pointer until have === need, then contract left pointer to minimize window length."
      ],
      oracleFn: (s: string, t: string) => {
        if (s.length < t.length) return '';
        const tMap = new Map<string, number>();
        for (const c of t) tMap.set(c, (tMap.get(c) || 0) + 1);
        const windowMap = new Map<string, number>();
        let have = 0, need = tMap.size;
        let res = [-1, -1], minLen = Infinity;
        let left = 0;
        for (let right = 0; right < s.length; right++) {
          const c = s[right];
          windowMap.set(c, (windowMap.get(c) || 0) + 1);
          if (tMap.has(c) && windowMap.get(c) === tMap.get(c)) have++;
          while (have === need) {
            if (right - left + 1 < minLen) {
              minLen = right - left + 1;
              res = [left, right];
            }
            const lChar = s[left];
            windowMap.set(lChar, windowMap.get(lChar)! - 1);
            if (tMap.has(lChar) && windowMap.get(lChar)! < tMap.get(lChar)!) have--;
            left++;
          }
        }
        return res[0] === -1 ? '' : s.slice(res[0], res[1] + 1);
      },
      testCases: {
        functional: [
          ["ADOBECODEBANC", "ABC"],
          ["a", "a"],
          ["a", "aa"]
        ],
        boundary: [
          ["ab", "b"],
          ["abc", "cba"],
          ["aa", "a"],
          ["bba", "ab"]
        ],
        adversarial: [
          ["cabwefgewcwaefgcf", "cae"],
          ["cgklrmxxsguhywzgidebxmkuymxgapithsofqybufrhehgkfluidrqmnmawmyqwbmtgnhsdqwtabbnplqsmysstbikkmjqydkgx", "uyr"],
          ["aaaaaaaaaaaabbbbbcdd", "abcdd"]
        ],
        stress: [
          ["a".repeat(2000) + "b" + "a".repeat(2000), "b"],
          ["abcdefghijklmnopqrstuvwxyz".repeat(100), "xyz"]
        ]
      }
    }),

    // 79. Substring with Concatenation of All Words
    createProblem({
      num: 79,
      title: "Substring with Concatenation of All Words",
      slug: "substring-with-concatenation-of-all-words",
      level: 4,
      difficulty: "HARD",
      topic: "Sliding Window",
      patternSlug: "sliding-window",
      estimatedTimeMin: 25,
      statement: "You are given a string `s` and an array of strings `words`. All the strings of `words` are of the same length.\n\nA concatenated substring in `s` is a substring that contains all the strings of any permutation of `words` concatenated.\n\nReturn the starting indices of all the concatenated substrings in `s`. You can return the answer in any order.",
      functionName: "findSubstring",
      parameters: [
        { name: "s", type: "string", description: "Search string" },
        { name: "words", type: "string[]", description: "Array of equal-length words" }
      ],
      returnType: "number[]",
      constraints: ["1 <= s.length <= 10^4", "1 <= words.length <= 5000", "1 <= words[i].length <= 30", "words[i] and s consist of lowercase English letters."],
      examples: [
        { input: 's = "barfoothefoobarman", words = ["foo","bar"]', output: "[0,9]", explanation: "Substrings starting at 0 ('barfoo') and 9 ('foobar')." },
        { input: 's = "wordgoodgoodgoodbestword", words = ["word","good","best","word"]', output: "[]", explanation: "No concatenation match." }
      ],
      optimalSolution: `function findSubstring(s, words) {\n  if (!s || !words || words.length === 0) return [];\n  const wordLen = words[0].length, numWords = words.length, totalLen = wordLen * numWords;\n  const wordCount = new Map();\n  for (const w of words) wordCount.set(w, (wordCount.get(w) || 0) + 1);\n  const res = [];\n  for (let i = 0; i < wordLen; i++) {\n    let left = i, count = 0;\n    const windowMap = new Map();\n    for (let j = i; j <= s.length - wordLen; j += wordLen) {\n      const word = s.slice(j, j + wordLen);\n      if (wordCount.has(word)) {\n        windowMap.set(word, (windowMap.get(word) || 0) + 1);\n        count++;\n        while (windowMap.get(word) > wordCount.get(word)) {\n          const leftWord = s.slice(left, left + wordLen);\n          windowMap.set(leftWord, windowMap.get(leftWord) - 1);\n          count--;\n          left += wordLen;\n        }\n        if (count === numWords) res.push(left);\n      } else {\n        windowMap.clear();\n        count = 0;\n        left = j + wordLen;\n      }\n    }\n  }\n  return res.sort((a, b) => a - b);\n}`,
      optimalTimeComplexity: "O(N * W)",
      optimalSpaceComplexity: "O(K * W)",
      suboptimalSolution: `function findSubstring(s, words) {\n  const wordLen = words[0].length, totalLen = wordLen * words.length, res = [];\n  const map = new Map();\n  for (const w of words) map.set(w, (map.get(w) || 0) + 1);\n  for (let i = 0; i <= s.length - totalLen; i++) {\n    const seen = new Map();\n    let j = 0;\n    for (; j < words.length; j++) {\n      const w = s.slice(i + j * wordLen, i + (j + 1) * wordLen);\n      if (!map.has(w)) break;\n      seen.set(w, (seen.get(w) || 0) + 1);\n      if (seen.get(w) > map.get(w)) break;\n    }\n    if (j === words.length) res.push(i);\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N * K * W)",
      suboptimalSpaceComplexity: "O(K * W)",
      commonMistakes: ["Failing to handle duplicate words in `words`", "Re-checking every character instead of shifting in increments of wordLen"],
      hints: [
        "All words have identical length L.",
        "Run sliding window with step size L starting from offset 0, 1, ..., L - 1.",
        "Track word counts inside the active window."
      ],
      oracleFn: (s: string, words: string[]) => {
        if (!s || !words || words.length === 0) return [];
        const wordLen = words[0].length, numWords = words.length;
        const wordCount = new Map<string, number>();
        for (const w of words) wordCount.set(w, (wordCount.get(w) || 0) + 1);
        const res: number[] = [];
        for (let i = 0; i < wordLen; i++) {
          let left = i, count = 0;
          const windowMap = new Map<string, number>();
          for (let j = i; j <= s.length - wordLen; j += wordLen) {
            const word = s.slice(j, j + wordLen);
            if (wordCount.has(word)) {
              windowMap.set(word, (windowMap.get(word) || 0) + 1);
              count++;
              while (windowMap.get(word)! > wordCount.get(word)!) {
                const leftWord = s.slice(left, left + wordLen);
                windowMap.set(leftWord, windowMap.get(leftWord)! - 1);
                count--;
                left += wordLen;
              }
              if (count === numWords) res.push(left);
            } else {
              windowMap.clear();
              count = 0;
              left = j + wordLen;
            }
          }
        }
        return res.sort((a, b) => a - b);
      },
      testCases: {
        functional: [
          ["barfoothefoobarman", ["foo", "bar"]],
          ["wordgoodgoodgoodbestword", ["word", "good", "best", "word"]],
          ["barfoofoobarthefoobarman", ["bar", "foo", "the"]]
        ],
        boundary: [
          ["a", ["a"]],
          ["a", ["b"]],
          ["word", ["word"]],
          ["lingmindraboofooowingdingbarrwingmonkeypoundcake", ["fooo", "barr", "wing", "ding", "wing"]]
        ],
        adversarial: [
          ["wordgoodgoodgoodbestword", ["word", "good", "best", "good"]],
          ["abaabkkkkkabaa", ["ab", "aa"]],
          ["aaaaaaaaaaaaaa", ["aa", "aa"]]
        ],
        stress: [
          ["a".repeat(1000), ["a", "a", "a"]],
          ["foobar".repeat(200), ["foo", "bar"]]
        ]
      }
    }),

    // 80. Max Consecutive Ones III
    createProblem({
      num: 80,
      title: "Max Consecutive Ones III",
      slug: "max-consecutive-ones-iii",
      level: 4,
      difficulty: "MEDIUM",
      topic: "Sliding Window",
      patternSlug: "sliding-window",
      estimatedTimeMin: 20,
      statement: "Given a binary array `nums` and an integer `k`, return the maximum number of consecutive `1`'s in the array if you can flip at most `k` `0`'s.",
      functionName: "longestOnes",
      parameters: [
        { name: "nums", type: "number[]", description: "Binary array" },
        { name: "k", type: "number", description: "Max zero flips allowed" }
      ],
      returnType: "number",
      constraints: ["1 <= nums.length <= 10^5", "nums[i] is either 0 or 1.", "0 <= k <= nums.length"],
      examples: [
        { input: "nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2", output: "6", explanation: "Flipping two 0s gives 6 consecutive 1s." },
        { input: "nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k = 3", output: "10", explanation: "10 consecutive 1s." }
      ],
      optimalSolution: `function longestOnes(nums, k) {\n  let left = 0, zeros = 0, maxLen = 0;\n  for (let right = 0; right < nums.length; right++) {\n    if (nums[right] === 0) zeros++;\n    while (zeros > k) {\n      if (nums[left] === 0) zeros--;\n      left++;\n    }\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function longestOnes(nums, k) {\n  let maxLen = 0;\n  for (let i = 0; i < nums.length; i++) {\n    let z = 0;\n    for (let j = i; j < nums.length; j++) {\n      if (nums[j] === 0) z++;\n      if (z <= k) maxLen = Math.max(maxLen, j - i + 1);\n      else break;\n    }\n  }\n  return maxLen;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Failing when k = 0 (only native 1s can be used)"],
      hints: [
        "Reframe problem: Find longest subarray containing at most k zeros.",
        "Expand right pointer and count zeros.",
        "When zeros > k, advance left pointer until zeros <= k."
      ],
      oracleFn: (nums: number[], k: number) => {
        let left = 0, zeros = 0, maxLen = 0;
        for (let right = 0; right < nums.length; right++) {
          if (nums[right] === 0) zeros++;
          while (zeros > k) {
            if (nums[left] === 0) zeros--;
            left++;
          }
          maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
      },
      testCases: {
        functional: [
          [[1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2],
          [[0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], 3],
          [[1, 1, 1], 0]
        ],
        boundary: [
          [[0], 0],
          [[0], 1],
          [[1], 0],
          [[0, 0, 0], 2]
        ],
        adversarial: [
          [[0, 1, 0, 1, 0, 1], 1],
          [[1, 0, 0, 0, 1, 1, 0, 0, 1], 2]
        ],
        stress: [
          [Array.from({ length: 3000 }, (_, i) => i % 3 === 0 ? 0 : 1), 50],
          [Array.from({ length: 4000 }, () => 1), 0]
        ]
      }
    }),

    // 81. Fruit Into Baskets
    createProblem({
      num: 81,
      title: "Fruit Into Baskets",
      slug: "fruit-into-baskets",
      level: 4,
      difficulty: "MEDIUM",
      topic: "Sliding Window",
      patternSlug: "sliding-window",
      estimatedTimeMin: 20,
      statement: "You are visiting a farm that has a single row of fruit trees arranged from left to right. The trees are represented by an integer array `fruits` where `fruits[i]` is the type of fruit the `i`th tree produces.\n\nYou have two baskets, and each basket can carry any quantity of fruit, but each basket can only carry a single type of fruit.\n\nStarting from any tree of your choice, you must pick exactly one fruit from every tree (including the start tree) while moving to the right. The moment you cannot pick a fruit that fits in your baskets, you must stop.\n\nReturn the maximum number of fruits you can pick.",
      functionName: "totalFruit",
      parameters: [{ name: "fruits", type: "number[]", description: "Array of fruit types" }],
      returnType: "number",
      constraints: ["1 <= fruits.length <= 10^5", "0 <= fruits[i] < fruits.length"],
      examples: [
        { input: "fruits = [1,2,1]", output: "3", explanation: "Pick all 3 fruits." },
        { input: "fruits = [0,1,2,2]", output: "3", explanation: "Pick [1,2,2]." },
        { input: "fruits = [1,2,3,2,2]", output: "4", explanation: "Pick [2,3,2,2]." }
      ],
      optimalSolution: `function totalFruit(fruits) {\n  const basket = new Map();\n  let left = 0, maxFruits = 0;\n  for (let right = 0; right < fruits.length; right++) {\n    basket.set(fruits[right], (basket.get(fruits[right]) || 0) + 1);\n    while (basket.size > 2) {\n      const lFruit = fruits[left];\n      basket.set(lFruit, basket.get(lFruit) - 1);\n      if (basket.get(lFruit) === 0) basket.delete(lFruit);\n      left++;\n    }\n    maxFruits = Math.max(maxFruits, right - left + 1);\n  }\n  return maxFruits;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function totalFruit(fruits) {\n  let maxF = 0;\n  for (let i = 0; i < fruits.length; i++) {\n    const set = new Set();\n    for (let j = i; j < fruits.length; j++) {\n      set.add(fruits[j]);\n      if (set.size <= 2) maxF = Math.max(maxF, j - i + 1);\n      else break;\n    }\n  }\n  return maxF;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Allowing more than 2 distinct fruit types"],
      hints: [
        "This is equivalent to finding the longest subarray with at most 2 distinct elements.",
        "Use a sliding window with a Hash Map storing frequencies of each fruit type.",
        "When map.size > 2, shrink window from left until map.size <= 2."
      ],
      oracleFn: (fruits: number[]) => {
        const basket = new Map<number, number>();
        let left = 0, maxFruits = 0;
        for (let right = 0; right < fruits.length; right++) {
          basket.set(fruits[right], (basket.get(fruits[right]) || 0) + 1);
          while (basket.size > 2) {
            const lFruit = fruits[left];
            basket.set(lFruit, basket.get(lFruit)! - 1);
            if (basket.get(lFruit) === 0) basket.delete(lFruit);
            left++;
          }
          maxFruits = Math.max(maxFruits, right - left + 1);
        }
        return maxFruits;
      },
      testCases: {
        functional: [
          [[1, 2, 1]],
          [[0, 1, 2, 2]],
          [[1, 2, 3, 2, 2]]
        ],
        boundary: [
          [[1]],
          [[1, 1, 1]],
          [[1, 2]],
          [[3, 3, 3, 1, 2, 1, 1, 2, 3, 3, 4]]
        ],
        adversarial: [
          [[1, 0, 1, 4, 1, 4, 1, 2, 3]],
          [[0, 1, 6, 6, 4, 4, 6]]
        ],
        stress: [
          [Array.from({ length: 3000 }, (_, i) => i % 2)],
          [Array.from({ length: 4000 }, (_, i) => i % 5)]
        ]
      }
    }),

    // 82. Longest Subarray of 1's After Deleting One Element
    createProblem({
      num: 82,
      title: "Longest Subarray of 1's After Deleting One Element",
      slug: "longest-subarray-of-1s-after-deleting-one-element",
      level: 4,
      difficulty: "MEDIUM",
      topic: "Sliding Window",
      patternSlug: "sliding-window",
      estimatedTimeMin: 15,
      statement: "Given a binary array `nums`, you should delete one element from it.\n\nReturn the size of the longest non-empty subarray containing only `1`'s in the resulting array. Return `0` if there is no such subarray.",
      functionName: "longestSubarray",
      parameters: [{ name: "nums", type: "number[]", description: "Binary array" }],
      returnType: "number",
      constraints: ["1 <= nums.length <= 10^5", "nums[i] is either 0 or 1."],
      examples: [
        { input: "nums = [1,1,0,1]", output: "3", explanation: "Delete 0 at index 2 to get [1, 1, 1] of length 3." },
        { input: "nums = [0,1,1,1,0,1,1,0,1]", output: "5", explanation: "Delete 0 at index 4 to get [1, 1, 1, 1, 1]." },
        { input: "nums = [1,1,1]", output: "2", explanation: "You must delete one element, returning 2." }
      ],
      optimalSolution: `function longestSubarray(nums) {\n  let left = 0, zeros = 0, maxLen = 0;\n  for (let right = 0; right < nums.length; right++) {\n    if (nums[right] === 0) zeros++;\n    while (zeros > 1) {\n      if (nums[left] === 0) zeros--;\n      left++;\n    }\n    maxLen = Math.max(maxLen, right - left);\n  }\n  return maxLen;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function longestSubarray(nums) {\n  let maxLen = 0;\n  for (let i = 0; i < nums.length; i++) {\n    let z = 0;\n    for (let j = i; j < nums.length; j++) {\n      if (nums[j] === 0) z++;\n      if (z <= 1) maxLen = Math.max(maxLen, (j - i + 1) - 1);\n      else break;\n    }\n  }\n  return maxLen;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Returning nums.length when all elements are 1 (you MUST delete one element, so answer is length - 1)"],
      hints: [
        "Find the longest window containing at most one zero.",
        "Since one element must always be deleted, window length is right - left (not right - left + 1)."
      ],
      oracleFn: (nums: number[]) => {
        let left = 0, zeros = 0, maxLen = 0;
        for (let right = 0; right < nums.length; right++) {
          if (nums[right] === 0) zeros++;
          while (zeros > 1) {
            if (nums[left] === 0) zeros--;
            left++;
          }
          maxLen = Math.max(maxLen, right - left);
        }
        return maxLen;
      },
      testCases: {
        functional: [
          [[1, 1, 0, 1]],
          [[0, 1, 1, 1, 0, 1, 1, 0, 1]],
          [[1, 1, 1]]
        ],
        boundary: [
          [[0]],
          [[1]],
          [[0, 0, 0]],
          [[1, 0]]
        ],
        adversarial: [
          [[1, 0, 0, 1, 1]],
          [[0, 1, 0, 1, 0]],
          [[1, 1, 0, 0, 1, 1, 1, 0, 1]]
        ],
        stress: [
          [Array.from({ length: 3000 }, () => 1)],
          [Array.from({ length: 4000 }, (_, i) => i % 5 === 0 ? 0 : 1)]
        ]
      }
    }),

    // 83. Binary Subarrays With Sum
    createProblem({
      num: 83,
      title: "Binary Subarrays With Sum",
      slug: "binary-subarrays-with-sum",
      level: 4,
      difficulty: "MEDIUM",
      topic: "Sliding Window / Prefix Sum",
      patternSlug: "sliding-window",
      estimatedTimeMin: 20,
      statement: "Given a binary array `nums` and an integer `goal`, return the number of non-empty subarrays with a sum `goal`.",
      functionName: "numSubarraysWithSum",
      parameters: [
        { name: "nums", type: "number[]", description: "Binary array" },
        { name: "goal", type: "number", description: "Target sum" }
      ],
      returnType: "number",
      constraints: ["1 <= nums.length <= 3 * 10^4", "nums[i] is either 0 or 1.", "0 <= goal <= nums.length"],
      examples: [
        { input: "nums = [1,0,1,0,1], goal = 2", output: "4", explanation: "4 subarrays sum to 2." },
        { input: "nums = [0,0,0,0,0], goal = 0", output: "15", explanation: "15 zero subarrays." }
      ],
      optimalSolution: `function numSubarraysWithSum(nums, goal) {\n  function atMost(k) {\n    if (k < 0) return 0;\n    let left = 0, sum = 0, count = 0;\n    for (let right = 0; right < nums.length; right++) {\n      sum += nums[right];\n      while (sum > k) sum -= nums[left++];\n      count += right - left + 1;\n    }\n    return count;\n  }\n  return atMost(goal) - atMost(goal - 1);\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function numSubarraysWithSum(nums, goal) {\n  let count = 0;\n  for (let i = 0; i < nums.length; i++) {\n    let s = 0;\n    for (let j = i; j < nums.length; j++) {\n      s += nums[j];\n      if (s === goal) count++;\n      else if (s > goal) break;\n    }\n  }\n  return count;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Failing on goal = 0 with multiple consecutive zeros"],
      hints: [
        "Subarrays summing to EXACTLY goal = (subarrays summing to AT MOST goal) - (subarrays summing to AT MOST goal - 1).",
        "Subarrays with sum <= k can be solved in O(N) using sliding window."
      ],
      oracleFn: (nums: number[], goal: number) => {
        function atMost(k: number) {
          if (k < 0) return 0;
          let left = 0, sum = 0, count = 0;
          for (let right = 0; right < nums.length; right++) {
            sum += nums[right];
            while (sum > k) sum -= nums[left++];
            count += right - left + 1;
          }
          return count;
        }
        return atMost(goal) - atMost(goal - 1);
      },
      testCases: {
        functional: [
          [[1, 0, 1, 0, 1], 2],
          [[0, 0, 0, 0, 0], 0],
          [[1, 1, 1], 1]
        ],
        boundary: [
          [[0], 0],
          [[1], 1],
          [[0], 1],
          [[1, 1, 1, 1], 4]
        ],
        adversarial: [
          [[0, 1, 0, 0, 1, 0, 0, 1], 2],
          [[0, 0, 0, 1, 0, 0], 1]
        ],
        stress: [
          [Array.from({ length: 2000 }, () => 0), 0],
          [Array.from({ length: 3000 }, (_, i) => i % 2), 500]
        ]
      }
    }),

    // 84. Subarrays with K Different Integers
    createProblem({
      num: 84,
      title: "Subarrays with K Different Integers",
      slug: "subarrays-with-k-different-integers",
      level: 4,
      difficulty: "HARD",
      topic: "Sliding Window",
      patternSlug: "sliding-window",
      estimatedTimeMin: 25,
      statement: "Given an integer array `nums` and an integer `k`, return the number of good subarrays of `nums`.\n\nA good array is an array where the number of different integers in that array is exactly `k`.",
      functionName: "subarraysWithKDistinct",
      parameters: [
        { name: "nums", type: "number[]", description: "Array of integers" },
        { name: "k", type: "number", description: "Exact number of distinct integers" }
      ],
      returnType: "number",
      constraints: ["1 <= nums.length <= 2 * 10^4", "1 <= nums[i], k <= nums.length"],
      examples: [
        { input: "nums = [1,2,1,2,3], k = 2", output: "7", explanation: "7 subarrays have exactly 2 distinct integers." },
        { input: "nums = [1,2,1,3,4], k = 3", output: "3", explanation: "3 subarrays." }
      ],
      optimalSolution: `function subarraysWithKDistinct(nums, k) {\n  function atMost(distinctK) {\n    const map = new Map();\n    let left = 0, count = 0;\n    for (let right = 0; right < nums.length; right++) {\n      map.set(nums[right], (map.get(nums[right]) || 0) + 1);\n      while (map.size > distinctK) {\n        const l = nums[left];\n        map.set(l, map.get(l) - 1);\n        if (map.get(l) === 0) map.delete(l);\n        left++;\n      }\n      count += right - left + 1;\n    }\n    return count;\n  }\n  return atMost(k) - atMost(k - 1);\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(K)",
      suboptimalSolution: `function subarraysWithKDistinct(nums, k) {\n  let count = 0;\n  for (let i = 0; i < nums.length; i++) {\n    const set = new Set();\n    for (let j = i; j < nums.length; j++) {\n      set.add(nums[j]);\n      if (set.size === k) count++;\n      else if (set.size > k) break;\n    }\n  }\n  return count;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(K)",
      commonMistakes: ["Trying to directly maintain exact k window with a single left pointer"],
      hints: [
        "Exactly K distinct = (At most K distinct) - (At most K - 1 distinct).",
        "Subarrays with at most K distinct integers is straightforward with sliding window in O(N)."
      ],
      oracleFn: (nums: number[], k: number) => {
        function atMost(distinctK: number) {
          const map = new Map<number, number>();
          let left = 0, count = 0;
          for (let right = 0; right < nums.length; right++) {
            map.set(nums[right], (map.get(nums[right]) || 0) + 1);
            while (map.size > distinctK) {
              const l = nums[left];
              map.set(l, map.get(l)! - 1);
              if (map.get(l) === 0) map.delete(l);
              left++;
            }
            count += right - left + 1;
          }
          return count;
        }
        return atMost(k) - atMost(k - 1);
      },
      testCases: {
        functional: [
          [[1, 2, 1, 2, 3], 2],
          [[1, 2, 1, 3, 4], 3],
          [[1, 1, 1], 1]
        ],
        boundary: [
          [[1], 1],
          [[1, 2], 1],
          [[1, 2], 2],
          [[2, 1, 1, 1, 2], 1]
        ],
        adversarial: [
          [[1, 2, 1, 2, 1, 2], 2],
          [[2, 1, 2, 1, 2], 2]
        ],
        stress: [
          [Array.from({ length: 2000 }, (_, i) => (i % 3) + 1), 2],
          [Array.from({ length: 2500 }, (_, i) => (i % 5) + 1), 3]
        ]
      }
    }),

    // 85. Count Number of Nice Subarrays
    createProblem({
      num: 85,
      title: "Count Number of Nice Subarrays",
      slug: "count-number-of-nice-subarrays",
      level: 4,
      difficulty: "MEDIUM",
      topic: "Sliding Window",
      patternSlug: "sliding-window",
      estimatedTimeMin: 20,
      statement: "Given an array of integers `nums` and an integer `k`. A continuous subarray is called nice if there are `k` odd numbers on it.\n\nReturn the number of nice sub-arrays.",
      functionName: "numberOfSubarrays",
      parameters: [
        { name: "nums", type: "number[]", description: "Array of integers" },
        { name: "k", type: "number", description: "Exact number of odd integers" }
      ],
      returnType: "number",
      constraints: ["1 <= nums.length <= 50000", "1 <= nums[i] <= 10^5", "1 <= k <= nums.length"],
      examples: [
        { input: "nums = [1,1,2,1,1], k = 3", output: "2", explanation: "[1,1,2,1] and [1,2,1,1] each contain 3 odd numbers." },
        { input: "nums = [2,4,6], k = 1", output: "0", explanation: "No odd numbers." },
        { input: "nums = [2,2,2,1,2,2,1,2,2,2], k = 2", output: "16", explanation: "16 nice subarrays." }
      ],
      optimalSolution: `function numberOfSubarrays(nums, k) {\n  function atMost(countK) {\n    let left = 0, odds = 0, res = 0;\n    for (let right = 0; right < nums.length; right++) {\n      if (nums[right] % 2 !== 0) odds++;\n      while (odds > countK) {\n        if (nums[left] % 2 !== 0) odds--;\n        left++;\n      }\n      res += right - left + 1;\n    }\n    return res;\n  }\n  return atMost(k) - atMost(k - 1);\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function numberOfSubarrays(nums, k) {\n  let count = 0;\n  for (let i = 0; i < nums.length; i++) {\n    let o = 0;\n    for (let j = i; j < nums.length; j++) {\n      if (nums[j] % 2 !== 0) o++;\n      if (o === k) count++;\n      else if (o > k) break;\n    }\n  }\n  return count;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Treating even numbers as boundaries instead of valid extensions"],
      hints: [
        "Transform array into binary: odd -> 1, even -> 0.",
        "Now the problem reduces to Binary Subarrays with Sum k.",
        "Use atMost(k) - atMost(k - 1)."
      ],
      oracleFn: (nums: number[], k: number) => {
        function atMost(countK: number) {
          let left = 0, odds = 0, res = 0;
          for (let right = 0; right < nums.length; right++) {
            if (nums[right] % 2 !== 0) odds++;
            while (odds > countK) {
              if (nums[left] % 2 !== 0) odds--;
              left++;
            }
            res += right - left + 1;
          }
          return res;
        }
        return atMost(k) - atMost(k - 1);
      },
      testCases: {
        functional: [
          [[1, 1, 2, 1, 1], 3],
          [[2, 4, 6], 1],
          [[2, 2, 2, 1, 2, 2, 1, 2, 2, 2], 2]
        ],
        boundary: [
          [[1], 1],
          [[2], 1],
          [[1, 3, 5], 3],
          [[1, 2, 3], 2]
        ],
        adversarial: [
          [[1, 1, 1, 1, 1], 2],
          [[2, 2, 1, 2, 2], 1]
        ],
        stress: [
          [Array.from({ length: 3000 }, (_, i) => i), 500],
          [Array.from({ length: 4000 }, () => 2), 5]
        ]
      }
    }),

    // 86. Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit
    createProblem({
      num: 86,
      title: "Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit",
      slug: "longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit",
      level: 4,
      difficulty: "MEDIUM",
      topic: "Sliding Window / Monotonic Deque",
      patternSlug: "sliding-window",
      estimatedTimeMin: 20,
      statement: "Given an array of integers `nums` and an integer `limit`, return the size of the longest non-empty subarray such that the absolute difference between any two elements of this subarray is less than or equal to `limit`.",
      functionName: "longestSubarray",
      parameters: [
        { name: "nums", type: "number[]", description: "Array of integers" },
        { name: "limit", type: "number", description: "Maximum difference limit" }
      ],
      returnType: "number",
      constraints: ["1 <= nums.length <= 10^5", "1 <= nums[i] <= 10^9", "0 <= limit <= 10^9"],
      examples: [
        { input: "nums = [8,2,4,7], limit = 4", output: "2", explanation: "[2, 4] or [4, 7] both have diff <= 4." },
        { input: "nums = [10,1,2,4,7,2], limit = 5", output: "4", explanation: "[2, 4, 7, 2] has max diff 7 - 2 = 5 <= 5." }
      ],
      optimalSolution: `function longestSubarray(nums, limit) {\n  const maxD = [], minD = [];\n  let left = 0, maxLen = 0;\n  for (let right = 0; right < nums.length; right++) {\n    while (maxD.length > 0 && maxD[maxD.length - 1] < nums[right]) maxD.pop();\n    maxD.push(nums[right]);\n    while (minD.length > 0 && minD[minD.length - 1] > nums[right]) minD.pop();\n    minD.push(nums[right]);\n    while (maxD[0] - minD[0] > limit) {\n      if (maxD[0] === nums[left]) maxD.shift();\n      if (minD[0] === nums[left]) minD.shift();\n      left++;\n    }\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function longestSubarray(nums, limit) {\n  let maxLen = 0;\n  for (let i = 0; i < nums.length; i++) {\n    let min = nums[i], max = nums[i];\n    for (let j = i; j < nums.length; j++) {\n      min = Math.min(min, nums[j]);\n      max = Math.max(max, nums[j]);\n      if (max - min <= limit) maxLen = Math.max(maxLen, j - i + 1);\n      else break;\n    }\n  }\n  return maxLen;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Recalculating window min and max in O(W) instead of monotonic deques in O(1) amortized"],
      hints: [
        "Subarray max diff <= limit is equivalent to (max(window) - min(window)) <= limit.",
        "Maintain maximum and minimum in current window using two monotonic deques.",
        "When maxD[0] - minD[0] > limit, pop from deques and increment left."
      ],
      oracleFn: (nums: number[], limit: number) => {
        const maxD: number[] = [], minD: number[] = [];
        let left = 0, maxLen = 0;
        for (let right = 0; right < nums.length; right++) {
          while (maxD.length > 0 && maxD[maxD.length - 1] < nums[right]) maxD.pop();
          maxD.push(nums[right]);
          while (minD.length > 0 && minD[minD.length - 1] > nums[right]) minD.pop();
          minD.push(nums[right]);
          while (maxD[0] - minD[0] > limit) {
            if (maxD[0] === nums[left]) maxD.shift();
            if (minD[0] === nums[left]) minD.shift();
            left++;
          }
          maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
      },
      testCases: {
        functional: [
          [[8, 2, 4, 7], 4],
          [[10, 1, 2, 4, 7, 2], 5],
          [[4, 2, 2, 2, 4, 4, 2, 2], 0]
        ],
        boundary: [
          [[1], 0],
          [[1, 5], 2],
          [[1, 5], 4],
          [[1, 1, 1, 1], 0]
        ],
        adversarial: [
          [[1, 5, 6, 7, 8, 10, 6, 5, 6], 4],
          [[2, 5, 2], 3]
        ],
        stress: [
          [Array.from({ length: 2000 }, (_, i) => i), 10],
          [Array.from({ length: 3000 }, () => 100), 0]
        ]
      }
    }),

    // 87. Sliding Window Maximum
    createProblem({
      num: 87,
      title: "Sliding Window Maximum",
      slug: "sliding-window-maximum",
      level: 4,
      difficulty: "HARD",
      topic: "Sliding Window / Monotonic Deque",
      patternSlug: "sliding-window",
      estimatedTimeMin: 25,
      statement: "You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position.\n\nReturn the max sliding window.",
      functionName: "maxSlidingWindow",
      parameters: [
        { name: "nums", type: "number[]", description: "Array of integers" },
        { name: "k", type: "number", description: "Window width" }
      ],
      returnType: "number[]",
      constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4", "1 <= k <= nums.length"],
      examples: [
        { input: "nums = [1,3,-1,-3,5,3,6,7], k = 3", output: "[3,3,5,5,6,7]", explanation: "Maximum in each sliding window." },
        { input: "nums = [1], k = 1", output: "[1]", explanation: "Single element." }
      ],
      optimalSolution: `function maxSlidingWindow(nums, k) {\n  const q = [];\n  const res = [];\n  for (let i = 0; i < nums.length; i++) {\n    if (q.length > 0 && q[0] <= i - k) q.shift();\n    while (q.length > 0 && nums[q[q.length - 1]] <= nums[i]) q.pop();\n    q.push(i);\n    if (i >= k - 1) res.push(nums[q[0]]);\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(K)",
      suboptimalSolution: `function maxSlidingWindow(nums, k) {\n  const res = [];\n  for (let i = 0; i <= nums.length - k; i++) {\n    let m = nums[i];\n    for (let j = i + 1; j < i + k; j++) if (nums[j] > m) m = nums[j];\n    res.push(m);\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N * K)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Storing values instead of indices in deque, making out-of-window expiration difficult"],
      hints: [
        "Use a monotonic decreasing double-ended queue (deque) storing array indices.",
        "Remove indices that fall outside the active window (q[0] <= i - k).",
        "Pop elements from the back that are smaller than nums[i] (they will never be the maximum)."
      ],
      oracleFn: (nums: number[], k: number) => {
        const q: number[] = [];
        const res: number[] = [];
        for (let i = 0; i < nums.length; i++) {
          if (q.length > 0 && q[0] <= i - k) q.shift();
          while (q.length > 0 && nums[q[q.length - 1]] <= nums[i]) q.pop();
          q.push(i);
          if (i >= k - 1) res.push(nums[q[0]]);
        }
        return res;
      },
      testCases: {
        functional: [
          [[1, 3, -1, -3, 5, 3, 6, 7], 3],
          [[1], 1],
          [[1, -1], 1]
        ],
        boundary: [
          [[9, 11], 2],
          [[4, -2], 2],
          [[1, 2, 3, 4, 5], 3],
          [[5, 4, 3, 2, 1], 3]
        ],
        adversarial: [
          [[1, 3, 1, 2, 0, 5], 3],
          [[-7, -8, 7, 5, 7, 1, 6, 0], 4]
        ],
        stress: [
          [Array.from({ length: 3000 }, (_, i) => i), 100],
          [Array.from({ length: 3000 }, (_, i) => 3000 - i), 100]
        ]
      }
    }),

    // 88. Grumpy Bookstore Owner
    createProblem({
      num: 88,
      title: "Grumpy Bookstore Owner",
      slug: "grumpy-bookstore-owner",
      level: 4,
      difficulty: "MEDIUM",
      topic: "Sliding Window",
      patternSlug: "sliding-window",
      estimatedTimeMin: 20,
      statement: "There is a bookstore owner that has a store open for `n` minutes. Every minute, some number of customers enter the store. You are given an integer array `customers` of length `n` where `customers[i]` is the number of the customer that enters the store at the start of the `i`th minute and all these customers leave after the end of that minute.\n\nOn some minutes, the bookstore owner is grumpy. If the bookstore owner is grumpy on the `i`th minute, `grumpy[i] = 1`, otherwise `grumpy[i] = 0`.\n\nWhen the bookstore owner is grumpy, the customers of that minute are not satisfied, otherwise, they are satisfied.\n\nThe bookstore owner knows a secret technique to keep themselves not grumpy for `minutes` consecutive minutes, but can only use it once.\n\nReturn the maximum number of customers that can be satisfied throughout the day.",
      functionName: "maxSatisfied",
      parameters: [
        { name: "customers", type: "number[]", description: "Customers per minute" },
        { name: "grumpy", type: "number[]", description: "Grumpy status per minute" },
        { name: "minutes", type: "number", description: "Technique window duration" }
      ],
      returnType: "number",
      constraints: ["n == customers.length == grumpy.length", "1 <= minutes <= n <= 2 * 10^4", "0 <= customers[i] <= 1000", "grumpy[i] is either 0 or 1."],
      examples: [
        { input: "customers = [1,0,1,2,1,1,7,5], grumpy = [0,1,0,1,0,1,0,1], minutes = 3", output: "16", explanation: "Use technique from minute 5 to 7 to satisfy 16 customers." }
      ],
      optimalSolution: `function maxSatisfied(customers, grumpy, minutes) {\n  let base = 0;\n  for (let i = 0; i < customers.length; i++) if (grumpy[i] === 0) base += customers[i];\n  let extra = 0;\n  for (let i = 0; i < minutes; i++) if (grumpy[i] === 1) extra += customers[i];\n  let maxExtra = extra;\n  for (let i = minutes; i < customers.length; i++) {\n    if (grumpy[i] === 1) extra += customers[i];\n    if (grumpy[i - minutes] === 1) extra -= customers[i - minutes];\n    if (extra > maxExtra) maxExtra = extra;\n  }\n  return base + maxExtra;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function maxSatisfied(customers, grumpy, minutes) {\n  let base = 0;\n  for (let i = 0; i < customers.length; i++) if (grumpy[i] === 0) base += customers[i];\n  let maxExtra = 0;\n  for (let i = 0; i <= customers.length - minutes; i++) {\n    let extra = 0;\n    for (let j = i; j < i + minutes; j++) if (grumpy[j] === 1) extra += customers[j];\n    maxExtra = Math.max(maxExtra, extra);\n  }\n  return base + maxExtra;\n}`,
      suboptimalTimeComplexity: "O(N * minutes)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Double-counting customers that are already satisfied without the technique"],
      hints: [
        "Separate base satisfied customers (where grumpy[i] === 0) from potential extra customers.",
        "Extra customers gained in a window of length minutes is sum of customers[j] where grumpy[j] === 1.",
        "Find the sliding window of size minutes that maximizes this extra gain."
      ],
      oracleFn: (customers: number[], grumpy: number[], minutes: number) => {
        let base = 0;
        for (let i = 0; i < customers.length; i++) if (grumpy[i] === 0) base += customers[i];
        let extra = 0;
        for (let i = 0; i < minutes; i++) if (grumpy[i] === 1) extra += customers[i];
        let maxExtra = extra;
        for (let i = minutes; i < customers.length; i++) {
          if (grumpy[i] === 1) extra += customers[i];
          if (grumpy[i - minutes] === 1) extra -= customers[i - minutes];
          if (extra > maxExtra) maxExtra = extra;
        }
        return base + maxExtra;
      },
      testCases: {
        functional: [
          [[1, 0, 1, 2, 1, 1, 7, 5], [0, 1, 0, 1, 0, 1, 0, 1], 3],
          [[1], [0], 1],
          [[4, 10, 10], [1, 1, 0], 2]
        ],
        boundary: [
          [[5], [1], 1],
          [[1, 2, 3], [0, 0, 0], 2],
          [[1, 2, 3], [1, 1, 1], 3]
        ],
        adversarial: [
          [[10, 1, 7], [0, 0, 0], 2],
          [[2, 6, 6, 9], [0, 0, 1, 1], 1]
        ],
        stress: [
          [Array.from({ length: 2000 }, () => 10), Array.from({ length: 2000 }, (_, i) => i % 2), 500],
          [Array.from({ length: 3000 }, (_, i) => i % 100), Array.from({ length: 3000 }, () => 1), 200]
        ]
      }
    }),

    // 89. Frequency of the Most Frequent Element
    createProblem({
      num: 89,
      title: "Frequency of the Most Frequent Element",
      slug: "frequency-of-the-most-frequent-element",
      level: 4,
      difficulty: "MEDIUM",
      topic: "Sliding Window",
      patternSlug: "sliding-window",
      estimatedTimeMin: 20,
      statement: "The frequency of an element is the number of times it occurs in an array.\n\nYou are given an integer array `nums` and an integer `k`. In one operation, you can choose an index of `nums` and increment the element at that index by 1.\n\nReturn the maximum possible frequency of an element after performing at most `k` operations.",
      functionName: "maxFrequency",
      parameters: [
        { name: "nums", type: "number[]", description: "Array of integers" },
        { name: "k", type: "number", description: "Max operations budget" }
      ],
      returnType: "number",
      constraints: ["1 <= nums.length <= 10^5", "1 <= nums[i] <= 10^5", "1 <= k <= 10^5"],
      examples: [
        { input: "nums = [1,2,4], k = 5", output: "3", explanation: "Increment 1 three times and 2 twice to get [4, 4, 4]." },
        { input: "nums = [1,4,8,13], k = 5", output: "2", explanation: "Increment 4 four times to get 8 -> [1, 8, 8, 13]." }
      ],
      optimalSolution: `function maxFrequency(nums, k) {\n  nums.sort((a, b) => a - b);\n  let left = 0, total = 0, maxF = 0;\n  for (let right = 0; right < nums.length; right++) {\n    total += nums[right];\n    while ((right - left + 1) * nums[right] - total > k) {\n      total -= nums[left++];\n    }\n    maxF = Math.max(maxF, right - left + 1);\n  }\n  return maxF;\n}`,
      optimalTimeComplexity: "O(N log N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function maxFrequency(nums, k) {\n  nums.sort((a, b) => a - b);\n  let maxF = 1;\n  for (let i = 0; i < nums.length; i++) {\n    let budget = k, freq = 1;\n    for (let j = i - 1; j >= 0; j--) {\n      const diff = nums[i] - nums[j];\n      if (budget >= diff) { budget -= diff; freq++; }\n      else break;\n    }\n    maxF = Math.max(maxF, freq);\n  }\n  return maxF;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Trying to pick any arbitrary target instead of elements already in nums"],
      hints: [
        "Sort nums first so that all increments bring smaller elements up to nums[right].",
        "Operations needed to make all elements in [left..right] equal to nums[right] is: (right - left + 1) * nums[right] - sum(nums[left..right]).",
        "If needed operations > k, shrink window from left."
      ],
      oracleFn: (nums: number[], k: number) => {
        nums.sort((a, b) => a - b);
        let left = 0, total = 0, maxF = 0;
        for (let right = 0; right < nums.length; right++) {
          total += nums[right];
          while ((right - left + 1) * nums[right] - total > k) {
            total -= nums[left++];
          }
          maxF = Math.max(maxF, right - left + 1);
        }
        return maxF;
      },
      testCases: {
        functional: [
          [[1, 2, 4], 5],
          [[1, 4, 8, 13], 5],
          [[3, 9, 6], 2]
        ],
        boundary: [
          [[1], 1],
          [[10], 0],
          [[1, 1, 1], 10],
          [[1, 2], 0]
        ],
        adversarial: [
          [[1, 100000], 99998],
          [[1, 100000], 99999],
          [[9940, 9995, 9944, 9934, 9920], 3056]
        ],
        stress: [
          [Array.from({ length: 2000 }, (_, i) => i * 2), 500],
          [Array.from({ length: 3000 }, () => 10), 50]
        ]
      }
    }),

    // 90. Maximum Erasure Value
    createProblem({
      num: 90,
      title: "Maximum Erasure Value",
      slug: "maximum-erasure-value",
      level: 4,
      difficulty: "MEDIUM",
      topic: "Sliding Window",
      patternSlug: "sliding-window",
      estimatedTimeMin: 20,
      statement: "You are given an array of positive integers `nums` and want to erase a subarray containing unique elements. The score you get by erasing the subarray is equal to the sum of its elements.\n\nReturn the maximum score you can get by erasing exactly one subarray.",
      functionName: "maximumUniqueSubarray",
      parameters: [{ name: "nums", type: "number[]", description: "Array of positive integers" }],
      returnType: "number",
      constraints: ["1 <= nums.length <= 10^5", "1 <= nums[i] <= 10^4"],
      examples: [
        { input: "nums = [4,2,4,5,6]", output: "17", explanation: "Subarray [2, 4, 5, 6] has unique elements with max score 17." },
        { input: "nums = [5,2,1,2,5,2,1,2,5]", output: "8", explanation: "Subarray [5, 2, 1] has max score 8." }
      ],
      optimalSolution: `function maximumUniqueSubarray(nums) {\n  const seen = new Set();\n  let left = 0, sum = 0, maxScore = 0;\n  for (let right = 0; right < nums.length; right++) {\n    while (seen.has(nums[right])) {\n      seen.delete(nums[left]);\n      sum -= nums[left];\n      left++;\n    }\n    seen.add(nums[right]);\n    sum += nums[right];\n    maxScore = Math.max(maxScore, sum);\n  }\n  return maxScore;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function maximumUniqueSubarray(nums) {\n  let maxS = 0;\n  for (let i = 0; i < nums.length; i++) {\n    const seen = new Set();\n    let s = 0;\n    for (let j = i; j < nums.length; j++) {\n      if (seen.has(nums[j])) break;\n      seen.add(nums[j]);\n      s += nums[j];\n      maxS = Math.max(maxS, s);\n    }\n  }\n  return maxS;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Shrinking window by resetting left to 0 instead of advancing past the first duplicate"],
      hints: [
        "Maintain a sliding window of unique elements with a Hash Set.",
        "Track current window sum.",
        "When duplicate nums[right] is encountered, advance left and subtract nums[left] until duplicate is evicted."
      ],
      oracleFn: (nums: number[]) => {
        const seen = new Set<number>();
        let left = 0, sum = 0, maxScore = 0;
        for (let right = 0; right < nums.length; right++) {
          while (seen.has(nums[right])) {
            seen.delete(nums[left]);
            sum -= nums[left];
            left++;
          }
          seen.add(nums[right]);
          sum += nums[right];
          maxScore = Math.max(maxScore, sum);
        }
        return maxScore;
      },
      testCases: {
        functional: [
          [[4, 2, 4, 5, 6]],
          [[5, 2, 1, 2, 5, 2, 1, 2, 5]],
          [[1, 2, 3, 4, 5]]
        ],
        boundary: [
          [[1]],
          [[1, 1, 1, 1]],
          [[1, 2]],
          [[10000, 10000]]
        ],
        adversarial: [
          [[10, 1, 2, 3, 4, 5, 6, 1]],
          [[100, 1, 2, 100, 1000, 2]]
        ],
        stress: [
          [Array.from({ length: 3000 }, (_, i) => (i % 50) + 1)],
          [Array.from({ length: 4000 }, (_, i) => i + 1)]
        ]
      }
    }),

    // 91. Minimum Operations to Reduce X to Zero
    createProblem({
      num: 91,
      title: "Minimum Operations to Reduce X to Zero",
      slug: "minimum-operations-to-reduce-x-to-zero",
      level: 4,
      difficulty: "MEDIUM",
      topic: "Sliding Window",
      patternSlug: "sliding-window",
      estimatedTimeMin: 20,
      statement: "You are given an integer array `nums` and an integer `x`. In one operation, you can either remove the leftmost or the rightmost element from the array `nums` and subtract its value from `x`.\n\nReturn the minimum number of operations to reduce `x` to exactly `0` if it is possible, otherwise, return `-1`.",
      functionName: "minOperations",
      parameters: [
        { name: "nums", type: "number[]", description: "Array of integers" },
        { name: "x", type: "number", description: "Target value to reduce" }
      ],
      returnType: "number",
      constraints: ["1 <= nums.length <= 10^5", "1 <= nums[i] <= 10^4", "1 <= x <= 10^9"],
      examples: [
        { input: "nums = [1,1,4,2,3], x = 5", output: "2", explanation: "Remove 2 elements from the right: 3 + 2 = 5." },
        { input: "nums = [5,6,7,8,9], x = 4", output: "-1", explanation: "Impossible." },
        { input: "nums = [3,2,20,1,1,3], x = 10", output: "5", explanation: "Remove [3, 2] from left and [1, 1, 3] from right (total 5 elements, sum 10)." }
      ],
      optimalSolution: `function minOperations(nums, x) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  const target = total - x;\n  if (target < 0) return -1;\n  if (target === 0) return nums.length;\n  let left = 0, sum = 0, maxSub = -1;\n  for (let right = 0; right < nums.length; right++) {\n    sum += nums[right];\n    while (sum > target) sum -= nums[left++];\n    if (sum === target) maxSub = Math.max(maxSub, right - left + 1);\n  }\n  return maxSub === -1 ? -1 : nums.length - maxSub;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function minOperations(nums, x) {\n  let minOps = Infinity;\n  const n = nums.length;\n  for (let l = 0; l <= n; l++) {\n    let s = 0;\n    for (let i = 0; i < l; i++) s += nums[i];\n    if (s === x) minOps = Math.min(minOps, l);\n    for (let r = 0; r < n - l; r++) {\n      s += nums[n - 1 - r];\n      if (s === x) minOps = Math.min(minOps, l + r + 1);\n    }\n  }\n  return minOps === Infinity ? -1 : minOps;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Using BFS/Recursion with memoization leading to Memory Limit Exceeded"],
      hints: [
        "Inverting the problem: minimizing elements from ends is equivalent to maximizing the length of an inner contiguous subarray summing to sum(nums) - x.",
        "Target = sum(nums) - x. Use sliding window to find longest subarray with sum === target.",
        "Result is nums.length - maxSubarrayLength."
      ],
      oracleFn: (nums: number[], x: number) => {
        const total = nums.reduce((a, b) => a + b, 0);
        const target = total - x;
        if (target < 0) return -1;
        if (target === 0) return nums.length;
        let left = 0, sum = 0, maxSub = -1;
        for (let right = 0; right < nums.length; right++) {
          sum += nums[right];
          while (sum > target) sum -= nums[left++];
          if (sum === target) maxSub = Math.max(maxSub, right - left + 1);
        }
        return maxSub === -1 ? -1 : nums.length - maxSub;
      },
      testCases: {
        functional: [
          [[1, 1, 4, 2, 3], 5],
          [[5, 6, 7, 8, 9], 4],
          [[3, 2, 20, 1, 1, 3], 10]
        ],
        boundary: [
          [[5], 5],
          [[5], 4],
          [[1, 1], 3],
          [[1, 1], 2]
        ],
        adversarial: [
          [[8828, 9581, 811, 9884, 9071, 4138, 6788, 8390, 3957, 9682, 823, 3663, 8045, 2487, 9607, 7896, 748, 2123, 9713, 94, 9890, 7984, 2115, 3487, 8629, 9014, 7080], 34365],
          [[1, 2, 3, 4, 5], 15]
        ],
        stress: [
          [Array.from({ length: 3000 }, () => 1), 1500],
          [Array.from({ length: 4000 }, (_, i) => i + 1), 5000]
        ]
      }
    }),

    // 92. Get Equal Substrings Within Budget
    createProblem({
      num: 92,
      title: "Get Equal Substrings Within Budget",
      slug: "get-equal-substrings-within-budget",
      level: 4,
      difficulty: "MEDIUM",
      topic: "Sliding Window",
      patternSlug: "sliding-window",
      estimatedTimeMin: 20,
      statement: "You are given two strings `s` and `t` of the same length and an integer `maxCost`.\n\nYou want to change `s` to `t`. Changing the `i`th character of `s` to `i`th character of `t` costs `|s[i] - t[i]|`.\n\nReturn the maximum length of a substring of `s` that can be changed to be the same as the corresponding substring of `t` with a cost less than or equal to `maxCost`.",
      functionName: "equalSubstring",
      parameters: [
        { name: "s", type: "string", description: "Source string" },
        { name: "t", type: "string", description: "Target string" },
        { name: "maxCost", type: "number", description: "Budget constraint" }
      ],
      returnType: "number",
      constraints: ["1 <= s.length <= 10^5", "t.length == s.length", "0 <= maxCost <= 10^6", "s and t consist only of lowercase English letters."],
      examples: [
        { input: 's = "abcd", t = "bcdf", maxCost = 3', output: "3", explanation: "'abc' of s can become 'bcd' of t with cost 3." },
        { input: 's = "abcd", t = "cdef", maxCost = 3', output: "1", explanation: "Each char change costs 2, max 1 char within budget 3." }
      ],
      optimalSolution: `function equalSubstring(s, t, maxCost) {\n  let left = 0, cost = 0, maxLen = 0;\n  for (let right = 0; right < s.length; right++) {\n    cost += Math.abs(s.charCodeAt(right) - t.charCodeAt(right));\n    while (cost > maxCost) {\n      cost -= Math.abs(s.charCodeAt(left) - t.charCodeAt(left));\n      left++;\n    }\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function equalSubstring(s, t, maxCost) {\n  let maxLen = 0;\n  for (let i = 0; i < s.length; i++) {\n    let c = 0;\n    for (let j = i; j < s.length; j++) {\n      c += Math.abs(s.charCodeAt(j) - t.charCodeAt(j));\n      if (c <= maxCost) maxLen = Math.max(maxLen, j - i + 1);\n      else break;\n    }\n  }\n  return maxLen;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Converting diff array explicitly rather than computing on the fly in O(1) space"],
      hints: [
        "Transform to an array where costs[i] = |s[i] - t[i]|.",
        "Find the longest contiguous subarray of costs with sum <= maxCost.",
        "Standard sliding window."
      ],
      oracleFn: (s: string, t: string, maxCost: number) => {
        let left = 0, cost = 0, maxLen = 0;
        for (let right = 0; right < s.length; right++) {
          cost += Math.abs(s.charCodeAt(right) - t.charCodeAt(right));
          while (cost > maxCost) {
            cost -= Math.abs(s.charCodeAt(left) - t.charCodeAt(left));
            left++;
          }
          maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
      },
      testCases: {
        functional: [
          ["abcd", "bcdf", 3],
          ["abcd", "cdef", 3],
          ["abcd", "acde", 0]
        ],
        boundary: [
          ["a", "a", 0],
          ["a", "z", 25],
          ["a", "z", 24],
          ["krrgw", "zjxss", 19]
        ],
        adversarial: [
          ["krpgjbjjzrmw", "nxargkbynxaw", 14],
          ["pxezla", "qoiadi", 25]
        ],
        stress: [
          ["a".repeat(2000), "b".repeat(2000), 500],
          ["abcdefg".repeat(300), "gfedcba".repeat(300), 1000]
        ]
      }
    }),

    // 93. Number of Sub-arrays With Odd Sum
    createProblem({
      num: 93,
      title: "Number of Sub-arrays With Odd Sum",
      slug: "number-of-sub-arrays-with-odd-sum",
      level: 4,
      difficulty: "MEDIUM",
      topic: "Prefix Sum / Hashing",
      patternSlug: "sliding-window",
      estimatedTimeMin: 20,
      statement: "Given an array of integers `arr`, return the number of subarrays with an odd sum.\n\nSince the answer can be very large, return it modulo `10^9 + 7`.",
      functionName: "numOfSubarrays",
      parameters: [{ name: "arr", type: "number[]", description: "Array of integers" }],
      returnType: "number",
      constraints: ["1 <= arr.length <= 10^5", "1 <= arr[i] <= 100"],
      examples: [
        { input: "arr = [1,3,5]", output: "4", explanation: "Odd subarrays: [1], [1,3,5], [3], [5]." },
        { input: "arr = [2,4,6]", output: "0", explanation: "All sums are even." },
        { input: "arr = [1,2,3,4,5,6,7]", output: "16", explanation: "16 odd subarrays." }
      ],
      optimalSolution: `function numOfSubarrays(arr) {\n  const MOD = 1e9 + 7;\n  let oddCount = 0, evenCount = 1, sum = 0, ans = 0;\n  for (const n of arr) {\n    sum += n;\n    if (sum % 2 !== 0) {\n      ans = (ans + evenCount) % MOD;\n      oddCount++;\n    } else {\n      ans = (ans + oddCount) % MOD;\n      evenCount++;\n    }\n  }\n  return ans;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function numOfSubarrays(arr) {\n  const MOD = 1e9 + 7;\n  let ans = 0;\n  for (let i = 0; i < arr.length; i++) {\n    let s = 0;\n    for (let j = i; j < arr.length; j++) {\n      s += arr[j];\n      if (s % 2 !== 0) ans = (ans + 1) % MOD;\n    }\n  }\n  return ans;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Forgetting evenCount = 1 base case (empty prefix sum is 0, which is even)"],
      hints: [
        "A subarray sum is odd if prefixSum[j] and prefixSum[i] have different parities (one even, one odd).",
        "Maintain count of even and odd prefix sums seen so far.",
        "Update total answer in a single pass."
      ],
      oracleFn: (arr: number[]) => {
        const MOD = 1e9 + 7;
        let oddCount = 0, evenCount = 1, sum = 0, ans = 0;
        for (const n of arr) {
          sum += n;
          if (sum % 2 !== 0) {
            ans = (ans + evenCount) % MOD;
            oddCount++;
          } else {
            ans = (ans + oddCount) % MOD;
            evenCount++;
          }
        }
        return ans;
      },
      testCases: {
        functional: [
          [[1, 3, 5]],
          [[2, 4, 6]],
          [[1, 2, 3, 4, 5, 6, 7]]
        ],
        boundary: [
          [[1]],
          [[2]],
          [[100, 100, 99, 99]],
          [[7]]
        ],
        adversarial: [
          [[100, 100, 100]],
          [[1, 1, 1, 1, 1, 1]]
        ],
        stress: [
          [Array.from({ length: 3000 }, (_, i) => i + 1)],
          [Array.from({ length: 4000 }, () => 1)]
        ]
      }
    }),

    // 94. Count Vowels Permutation
    createProblem({
      num: 94,
      title: "Count Vowels Permutation",
      slug: "count-vowels-permutation",
      level: 4,
      difficulty: "HARD",
      topic: "Dynamic Programming / State Machine",
      patternSlug: "sliding-window",
      estimatedTimeMin: 25,
      statement: "Given an integer `n`, your task is to count how many strings of length `n` can be formed under the following rules:\n- Each character is a lower case vowel ('a', 'e', 'i', 'o', 'u')\n- Each vowel 'a' may only be followed by an 'e'.\n- Each vowel 'e' may only be followed by an 'a' or an 'i'.\n- Each vowel 'i' may not be followed by another 'i'.\n- Each vowel 'o' may only be followed by an 'i' or a 'u'.\n- Each vowel 'u' may only be followed by an 'a'.\n\nSince the answer may be too large, return it modulo `10^9 + 7`.",
      functionName: "countVowelPermutation",
      parameters: [{ name: "n", type: "number", description: "Length of the vowel string" }],
      returnType: "number",
      constraints: ["1 <= n <= 2 * 10^4"],
      examples: [
        { input: "n = 1", output: "5", explanation: "All 5 vowels: 'a', 'e', 'i', 'o', 'u'." },
        { input: "n = 2", output: "10", explanation: "10 valid 2-letter vowel combinations." },
        { input: "n = 5", output: "68", explanation: "68 combinations." }
      ],
      optimalSolution: `function countVowelPermutation(n) {\n  const MOD = 1e9 + 7;\n  let a = 1, e = 1, i = 1, o = 1, u = 1;\n  for (let step = 1; step < n; step++) {\n    const nextA = (e + i + u) % MOD;\n    const nextE = (a + i) % MOD;\n    const nextI = (e + o) % MOD;\n    const nextO = i;\n    const nextU = (i + o) % MOD;\n    a = nextA; e = nextE; i = nextI; o = nextO; u = nextU;\n  }\n  return (a + e + i + o + u) % MOD;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function countVowelPermutation(n) {\n  const MOD = 1e9 + 7;\n  const dp = Array.from({ length: n }, () => new Array(5).fill(0));\n  for (let j = 0; j < 5; j++) dp[0][j] = 1;\n  for (let k = 1; k < n; k++) {\n    dp[k][0] = (dp[k - 1][1] + dp[k - 1][2] + dp[k - 1][4]) % MOD;\n    dp[k][1] = (dp[k - 1][0] + dp[k - 1][2]) % MOD;\n    dp[k][2] = (dp[k - 1][1] + dp[k - 1][3]) % MOD;\n    dp[k][3] = dp[k - 1][2];\n    dp[k][4] = (dp[k - 1][2] + dp[k - 1][3]) % MOD;\n  }\n  return dp[n - 1].reduce((acc, v) => (acc + v) % MOD, 0);\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Incorrect predecessors: notice the rule says what can FOLLOW, so invert transitions to find PREDECESSORS"],
      hints: [
        "Invert transition rules: which vowels can precede 'a'? ('e', 'i', 'u').",
        "Which vowels can precede 'e'? ('a', 'i').",
        "Track counts of each vowel at length k, updating in O(1) space."
      ],
      oracleFn: (n: number) => {
        const MOD = 1e9 + 7;
        let a = 1, e = 1, i = 1, o = 1, u = 1;
        for (let step = 1; step < n; step++) {
          const nextA = (e + i + u) % MOD;
          const nextE = (a + i) % MOD;
          const nextI = (e + o) % MOD;
          const nextO = i;
          const nextU = (i + o) % MOD;
          a = nextA; e = nextE; i = nextI; o = nextO; u = nextU;
        }
        return (a + e + i + o + u) % MOD;
      },
      testCases: {
        functional: [
          [1],
          [2],
          [5]
        ],
        boundary: [
          [3],
          [4],
          [6],
          [10]
        ],
        adversarial: [
          [20],
          [50],
          [100]
        ],
        stress: [
          [1000],
          [5000]
        ]
      }
    }),

    // 95. Take K of Each Character From Left and Right
    createProblem({
      num: 95,
      title: "Take K of Each Character From Left and Right",
      slug: "take-k-of-each-character-from-left-and-right",
      level: 4,
      difficulty: "MEDIUM",
      topic: "Sliding Window",
      patternSlug: "sliding-window",
      estimatedTimeMin: 20,
      statement: "You are given a string `s` consisting of the characters `'a'`, `'b'`, and `'c'` and a non-negative integer `k`. Each minute, you may take either the leftmost character of `s`, or the rightmost character of `s`.\n\nReturn the minimum number of minutes needed for you to take at least `k` of each character, or return `-1` if it is not possible to take `k` of each character.",
      functionName: "takeCharacters",
      parameters: [
        { name: "s", type: "string", description: "String with 'a', 'b', 'c'" },
        { name: "k", type: "number", description: "Target count of each character" }
      ],
      returnType: "number",
      constraints: ["1 <= s.length <= 10^5", "s consists of only the letters 'a', 'b', and 'c'.", "0 <= k <= s.length"],
      examples: [
        { input: 's = "aabaaaacaabc", k = 2', output: "8", explanation: "Take 3 chars from left and 5 from right (total 8 minutes)." },
        { input: 's = "a", k = 1', output: "-1", explanation: "Missing 'b' and 'c'." }
      ],
      optimalSolution: `function takeCharacters(s, k) {\n  if (k === 0) return 0;\n  const count = { a: 0, b: 0, c: 0 };\n  for (const ch of s) count[ch]++;\n  if (count.a < k || count.b < k || count.c < k) return -1;\n  const limits = { a: count.a - k, b: count.b - k, c: count.c - k };\n  let left = 0, maxWin = 0;\n  const cur = { a: 0, b: 0, c: 0 };\n  for (let right = 0; right < s.length; right++) {\n    cur[s[right]]++;\n    while (cur.a > limits.a || cur.b > limits.b || cur.c > limits.c) {\n      cur[s[left]]--;\n      left++;\n    }\n    maxWin = Math.max(maxWin, right - left + 1);\n  }\n  return s.length - maxWin;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function takeCharacters(s, k) {\n  if (k === 0) return 0;\n  const n = s.length;\n  let minMinutes = Infinity;\n  for (let l = 0; l <= n; l++) {\n    for (let r = 0; r <= n - l; r++) {\n      const c = { a: 0, b: 0, c: 0 };\n      for (let i = 0; i < l; i++) c[s[i]]++;\n      for (let j = 0; j < r; j++) c[s[n - 1 - j]]++;\n      if (c.a >= k && c.b >= k && c.c >= k) minMinutes = Math.min(minMinutes, l + r);\n    }\n  }\n  return minMinutes === Infinity ? -1 : minMinutes;\n}`,
      suboptimalTimeComplexity: "O(N^3)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Failing to handle k = 0 (returns 0 immediately)"],
      hints: [
        "Invert problem: taking characters from ends is equivalent to leaving behind a middle contiguous window.",
        "The middle window can contain at most (total_a - k) 'a's, (total_b - k) 'b's, and (total_c - k) 'c's.",
        "Find maximum size of such a middle window using standard sliding window."
      ],
      oracleFn: (s: string, k: number) => {
        if (k === 0) return 0;
        const count: Record<string, number> = { a: 0, b: 0, c: 0 };
        for (const ch of s) count[ch]++;
        if (count.a < k || count.b < k || count.c < k) return -1;
        const limits = { a: count.a - k, b: count.b - k, c: count.c - k };
        let left = 0, maxWin = 0;
        const cur: Record<string, number> = { a: 0, b: 0, c: 0 };
        for (let right = 0; right < s.length; right++) {
          cur[s[right]]++;
          while (cur.a > limits.a || cur.b > limits.b || cur.c > limits.c) {
            cur[s[left]]--;
            left++;
          }
          maxWin = Math.max(maxWin, right - left + 1);
        }
        return s.length - maxWin;
      },
      testCases: {
        functional: [
          ["aabaaaacaabc", 2],
          ["a", 1],
          ["a", 0]
        ],
        boundary: [
          ["abc", 1],
          ["cbbac", 1],
          ["abc", 2],
          ["aaabbbccc", 3]
        ],
        adversarial: [
          ["bcca", 1],
          ["aabcbbca", 2]
        ],
        stress: [
          ["abc".repeat(1000), 500],
          ["a".repeat(1000) + "b".repeat(1000) + "c".repeat(1000), 200]
        ]
      }
    })
  ];

  return {
    level: 4,
    levelTitle: "Level 4 — Sliding Window",
    topic: "Fixed & Dynamic Sliding Window Invariants",
    problems
  };
}
