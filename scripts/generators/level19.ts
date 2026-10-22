import { LevelPayload, GeneratedProblem } from './types';
import { createProblem } from './problemBuilder';

export function getLevel19Payload(): LevelPayload {
  const problems: GeneratedProblem[] = [
    // 394. Russian Doll Envelopes
    createProblem({
      num: 394,
      title: "Russian Doll Envelopes",
      slug: "russian-doll-envelopes",
      level: 19,
      difficulty: "HARD",
      topic: "Advanced Dynamic Programming",
      patternSlug: "advanced-dp",
      estimatedTimeMin: 30,
      statement: "You are given a 2D array of integers `envelopes` where `envelopes[i] = [wi, hi]` represents the width and the height of an envelope.\n\nOne envelope can fit into another if and only if both the width and height of one envelope are strictly greater than the other envelope's width and height.\n\nReturn the maximum number of envelopes you can Russian doll (i.e., put one inside the other).\n\nNote: You cannot rotate an envelope.",
      functionName: "maxEnvelopes",
      parameters: [{ name: "envelopes", type: "number[][]", description: "Array of [width, height] pairs" }],
      returnType: "number",
      constraints: ["1 <= envelopes.length <= 10^5", "envelopes[i].length == 2", "1 <= wi, hi <= 10^5"],
      examples: [
        { input: "envelopes = [[5,4],[6,4],[6,7],[2,3]]", output: "3", explanation: "The maximum number of envelopes you can Russian doll is 3: [2,3] => [5,4] => [6,7]." },
        { input: "envelopes = [[1,1],[1,1],[1,1]]", output: "1", explanation: "Dimensions must be strictly greater, so only 1 envelope fits." },
        { input: "envelopes = [[4,5],[4,6],[6,7],[2,3],[1,1]]", output: "4", explanation: "[1,1] => [2,3] => [4,5] => [6,7] has length 4." },
        { input: "envelopes = [[10,8],[1,12],[6,15],[2,18]]", output: "2", explanation: "Max nesting length is 2." }
      ],
      optimalSolution: `function maxEnvelopes(envelopes) {\n  envelopes.sort((a, b) => a[0] === b[0] ? b[1] - a[1] : a[0] - b[0]);\n  const tails = [];\n  for (const [w, h] of envelopes) {\n    let left = 0, right = tails.length;\n    while (left < right) {\n      const mid = Math.floor((left + right) / 2);\n      if (tails[mid] < h) left = mid + 1;\n      else right = mid;\n    }\n    if (left === tails.length) tails.push(h);\n    else tails[left] = h;\n  }\n  return tails.length;\n}`,
      optimalTimeComplexity: "O(N log N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function maxEnvelopes(envelopes) {\n  envelopes.sort((a, b) => a[0] - b[0]);\n  const n = envelopes.length;\n  const dp = new Array(n).fill(1);\n  let maxNest = 1;\n  for (let i = 1; i < n; i++) {\n    for (let j = 0; j < i; j++) {\n      if (envelopes[j][0] < envelopes[i][0] && envelopes[j][1] < envelopes[i][1]) {\n        dp[i] = Math.max(dp[i], dp[j] + 1);\n      }\n    }\n    maxNest = Math.max(maxNest, dp[i]);\n  }\n  return maxNest;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Sorting heights in ascending order for equal widths (this erroneously allows envelopes with the same width to nest inside each other)."],
      hints: [
        "Sort widths ASCENDING, and heights DESCENDING for identical widths.",
        "After this sort, finding LIS on the heights guarantees both strictly increasing width and height in O(N log N)."
      ],
      oracleFn: (envelopes: number[][]) => {
        envelopes.sort((a, b) => a[0] === b[0] ? b[1] - a[1] : a[0] - b[0]);
        const tails: number[] = [];
        for (const [w, h] of envelopes) {
          let left = 0, right = tails.length;
          while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (tails[mid] < h) left = mid + 1;
            else right = mid;
          }
          if (left === tails.length) tails.push(h);
          else tails[left] = h;
        }
        return tails.length;
      },
      testCases: {
        functional: [
          [[[5, 4], [6, 4], [6, 7], [2, 3]]],
          [[[1, 1], [1, 1], [1, 1]]],
          [[[4, 5], [4, 6], [6, 7], [2, 3], [1, 1]]],
          [[[10, 8], [1, 12], [6, 15], [2, 18]]]
        ],
        boundary: [
          [[[1, 1]]],
          [[[2, 3], [3, 4]]],
          [[[2, 2], [2, 3]]]
        ],
        adversarial: [
          [[[1, 3], [3, 5], [6, 7], [6, 8], [8, 4], [9, 5]]],
          [[[4, 5], [4, 6], [4, 7], [4, 8]]],
          [[[1, 1], [2, 2], [3, 3], [4, 4], [5, 5]]]
        ],
        stress: [
          [Array.from({ length: 100 }, (_, i) => [i + 1, (i * 17) % 50 + 1])],
          [Array.from({ length: 150 }, (_, i) => [i + 1, i + 1])]
        ]
      }
    }),

    // 395. Longest String Chain
    createProblem({
      num: 395,
      title: "Longest String Chain",
      slug: "longest-string-chain",
      level: 19,
      difficulty: "MEDIUM",
      topic: "Advanced Dynamic Programming",
      patternSlug: "advanced-dp",
      estimatedTimeMin: 25,
      statement: "You are given an array of `words` where each word consists of lowercase English letters.\n\n`wordA` is a predecessor of `wordB` if and only if we can insert exactly one letter anywhere in `wordA` without changing the order of the other characters to make it equal to `wordB`.\n- For example, \"abc\" is a predecessor of \"abac\", while \"cba\" is not a predecessor of \"bcad\".\n\nA word chain is a sequence of words `[word_1, word_2, ..., word_k]` with `k >= 1`, where `word_1` is a predecessor of `word_2`, `word_2` is a predecessor of `word_3`, and so on. A single word is trivially a word chain with `k = 1`.\n\nReturn the length of the longest possible word chain with words chosen from the given list of `words`.",
      functionName: "longestStrChain",
      parameters: [{ name: "words", type: "string[]", description: "Array of words" }],
      returnType: "number",
      constraints: ["1 <= words.length <= 1000", "1 <= words[i].length <= 16", "words[i] consists of only lowercase English letters."],
      examples: [
        { input: "words = [\"a\",\"b\",\"ba\",\"bca\",\"bda\",\"bdca\"]", output: "4", explanation: "One of the longest chains is [\"a\",\"ba\",\"bda\",\"bdca\"]." },
        { input: "words = [\"xbc\",\"pcxbcf\",\"xb\",\"cxbc\",\"pcxbc\"]", output: "5", explanation: "All words can be put in a chain [\"xb\", \"xbc\", \"cxbc\", \"pcxbc\", \"pcxbcf\"]." },
        { input: "words = [\"abcd\",\"dbqca\"]", output: "1", explanation: "Trivial chain of length 1." },
        { input: "words = [\"a\"]", output: "1", explanation: "Single character." }
      ],
      optimalSolution: `function longestStrChain(words) {\n  words.sort((a, b) => a.length - b.length);\n  const dp = new Map();\n  let maxChain = 1;\n  for (const w of words) {\n    let best = 1;\n    for (let i = 0; i < w.length; i++) {\n      const prev = w.slice(0, i) + w.slice(i + 1);\n      if (dp.has(prev)) {\n        best = Math.max(best, dp.get(prev) + 1);\n      }\n    }\n    dp.set(w, best);\n    maxChain = Math.max(maxChain, best);\n  }\n  return maxChain;\n}`,
      optimalTimeComplexity: "O(N log N + N * L^2) where L is max word length",
      optimalSpaceComplexity: "O(N * L)",
      suboptimalSolution: `function longestStrChain(words) {\n  const wordSet = new Set(words);\n  const memo = new Map();\n  function dfs(w) {\n    if (memo.has(w)) return memo.get(w);\n    let maxLen = 1;\n    for (let i = 0; i < w.length; i++) {\n      const pred = w.slice(0, i) + w.slice(i + 1);\n      if (wordSet.has(pred)) {\n        maxLen = Math.max(maxLen, 1 + dfs(pred));\n      }\n    }\n    memo.set(w, maxLen);\n    return maxLen;\n  }\n  let ans = 1;\n  for (const w of words) ans = Math.max(ans, dfs(w));\n  return ans;\n}`,
      suboptimalTimeComplexity: "O(N * L^2)",
      suboptimalSpaceComplexity: "O(N * L)",
      commonMistakes: ["Trying to generate all 26 insertions (forward branching) instead of deleting 1 of L letters (backward lookup)."],
      hints: [
        "Sort words by length ascending.",
        "For each word of length L, there are only L possible predecessors formed by removing one letter."
      ],
      oracleFn: (words: string[]) => {
        words.sort((a, b) => a.length - b.length);
        const dp = new Map<string, number>();
        let maxChain = 1;
        for (const w of words) {
          let best = 1;
          for (let i = 0; i < w.length; i++) {
            const prev = w.slice(0, i) + w.slice(i + 1);
            if (dp.has(prev)) {
              best = Math.max(best, dp.get(prev)! + 1);
            }
          }
          dp.set(w, best);
          maxChain = Math.max(maxChain, best);
        }
        return maxChain;
      },
      testCases: {
        functional: [
          [["a", "b", "ba", "bca", "bda", "bdca"]],
          [["xbc", "pcxbcf", "xb", "cxbc", "pcxbc"]],
          [["abcd", "dbqca"]],
          [["a"]]
        ],
        boundary: [
          [["a", "ab", "abc", "abcd"]],
          [["z", "za", "zaz"]],
          [["q", "w", "e", "r"]]
        ],
        adversarial: [
          [["ksqvsyq", "ks", "kss", "czvh", "zczvh", "zczpzvh", "ksqsyq", "ksqvsyq"]],
          [["sg", "sga", "sgab", "sgabc", "sgabcd"]],
          [["a", "ab", "ac", "bd", "abc", "abd", "abdc"]]
        ],
        stress: [
          [Array.from({ length: 40 }, (_, i) => "a".repeat(i + 1))],
          [["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]]
        ]
      }
    }),

    // 396. Scramble String
    createProblem({
      num: 396,
      title: "Scramble String",
      slug: "scramble-string",
      level: 19,
      difficulty: "HARD",
      topic: "Advanced Dynamic Programming",
      patternSlug: "advanced-dp",
      estimatedTimeMin: 30,
      statement: "We can scramble a string s to get a string t using the following algorithm:\n1. If the length of the string is 1, stop.\n2. If the length of the string is > 1, do the following:\n   - Split the string into two non-empty substrings at a random index, i.e., if the string is s, divide it to x and y where s = x + y.\n   - Randomly decide to swap the two substrings or to keep them in the same order. i.e., after this step, s may become s = x + y or s = y + x.\n   - Apply algorithm recursively on each of the two substrings x and y.\n\nGiven two strings `s1` and `s2` of the same length, return `true` if `s2` is a scrambled string of `s1`, otherwise, return `false`.",
      functionName: "isScramble",
      parameters: [
        { name: "s1", type: "string", description: "First string" },
        { name: "s2", type: "string", description: "Second string" }
      ],
      returnType: "boolean",
      constraints: ["s1.length == s2.length", "1 <= s1.length <= 30", "s1 and s2 consist of lowercase English letters."],
      examples: [
        { input: "s1 = \"great\", s2 = \"rgeat\"", output: "true", explanation: "\"great\" -> \"gr/eat\" -> swap \"gr\" to \"rg\" -> \"rgeat\"." },
        { input: "s1 = \"abcde\", s2 = \"caebd\"", output: "false", explanation: "Cannot be scrambled to form \"caebd\"." },
        { input: "s1 = \"a\", s2 = \"a\"", output: "true", explanation: "Identical single characters." },
        { input: "s1 = \"ab\", s2 = \"ba\"", output: "true", explanation: "Swapped pair." }
      ],
      optimalSolution: `function isScramble(s1, s2) {\n  const memo = new Map();\n  function dfs(a, b) {\n    if (a === b) return true;\n    if (a.length !== b.length) return false;\n    const key = a + '#' + b;\n    if (memo.has(key)) return memo.get(key);\n    const counts = new Array(26).fill(0);\n    for (let i = 0; i < a.length; i++) {\n      counts[a.charCodeAt(i) - 97]++;\n      counts[b.charCodeAt(i) - 97]--;\n    }\n    if (counts.some(c => c !== 0)) {\n      memo.set(key, false);\n      return false;\n    }\n    const n = a.length;\n    for (let k = 1; k < n; k++) {\n      const noSwap = dfs(a.slice(0, k), b.slice(0, k)) && dfs(a.slice(k), b.slice(k));\n      if (noSwap) { memo.set(key, true); return true; }\n      const swap = dfs(a.slice(0, k), b.slice(n - k)) && dfs(a.slice(k), b.slice(0, n - k));\n      if (swap) { memo.set(key, true); return true; }\n    }\n    memo.set(key, false);\n    return false;\n  }\n  return dfs(s1, s2);\n}`,
      optimalTimeComplexity: "O(N^4)",
      optimalSpaceComplexity: "O(N^3)",
      suboptimalSolution: `function isScramble(s1, s2) {\n  if (s1 === s2) return true;\n  if (s1.length !== s2.length) return false;\n  const sorted1 = s1.split('').sort().join('');\n  const sorted2 = s2.split('').sort().join('');\n  if (sorted1 !== sorted2) return false;\n  const n = s1.length;\n  for (let k = 1; k < n; k++) {\n    if (isScramble(s1.slice(0, k), s2.slice(0, k)) && isScramble(s1.slice(k), s2.slice(k))) return true;\n    if (isScramble(s1.slice(0, k), s2.slice(n - k)) && isScramble(s1.slice(k), s2.slice(0, n - k))) return true;\n  }\n  return false;\n}`,
      suboptimalTimeComplexity: "O(4^N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Failing to prune non-anagram partitions using character frequency counting before recursing."],
      hints: [
        "Prune immediately if character counts in s1 and s2 do not match.",
        "For each split length k, check: (1) no swap: s1[0..k] with s2[0..k] and s1[k..] with s2[k..]; (2) swap: s1[0..k] with s2[n-k..] and s1[k..] with s2[0..n-k]."
      ],
      oracleFn: (s1: string, s2: string) => {
        const memo = new Map<string, boolean>();
        const dfs = (a: string, b: string): boolean => {
          if (a === b) return true;
          if (a.length !== b.length) return false;
          const key = a + '#' + b;
          if (memo.has(key)) return memo.get(key)!;
          const counts = new Array(26).fill(0);
          for (let i = 0; i < a.length; i++) {
            counts[a.charCodeAt(i) - 97]++;
            counts[b.charCodeAt(i) - 97]--;
          }
          if (counts.some(c => c !== 0)) {
            memo.set(key, false);
            return false;
          }
          const n = a.length;
          for (let k = 1; k < n; k++) {
            const noSwap = dfs(a.slice(0, k), b.slice(0, k)) && dfs(a.slice(k), b.slice(k));
            if (noSwap) { memo.set(key, true); return true; }
            const swap = dfs(a.slice(0, k), b.slice(n - k)) && dfs(a.slice(k), b.slice(0, n - k));
            if (swap) { memo.set(key, true); return true; }
          }
          memo.set(key, false);
          return false;
        };
        return dfs(s1, s2);
      },
      testCases: {
        functional: [
          ["great", "rgeat"],
          ["abcde", "caebd"],
          ["a", "a"],
          ["ab", "ba"]
        ],
        boundary: [
          ["a", "b"],
          ["aa", "aa"],
          ["ab", "ab"]
        ],
        adversarial: [
          ["hobobyrql", "hbyorqobl"],
          ["eebaacbcbcadaaedceaaacadccd", "eadcaacabadd Vita-like fake"],
          ["abcdefghijklmnopq", "efghijklmnopqbaaa"]
        ],
        stress: [
          ["oatmcipnwahxad", "tanoicpmhawnxd"],
          ["abcdefg", "gfedcba"]
        ]
      }
    }),

    // 397. Minimum Insertion Steps to Make a String Palindrome
    createProblem({
      num: 397,
      title: "Minimum Insertion Steps to Make a String Palindrome",
      slug: "minimum-insertion-steps-to-make-a-string-palindrome",
      level: 19,
      difficulty: "HARD",
      topic: "Advanced Dynamic Programming",
      patternSlug: "advanced-dp",
      estimatedTimeMin: 20,
      statement: "Given a string `s`. In one step you can insert any character at any index of the string.\n\nReturn the minimum number of steps to make `s` palindrome.\n\nA Palindrome String is one that reads the same backward as forward.",
      functionName: "minInsertions",
      parameters: [{ name: "s", type: "string", description: "Input string" }],
      returnType: "number",
      constraints: ["1 <= s.length <= 500", "s consists of lowercase English letters."],
      examples: [
        { input: "s = \"zzazz\"", output: "0", explanation: "The string \"zzazz\" is already a palindrome." },
        { input: "s = \"mbadm\"", output: "2", explanation: "Insert 'b' and 'd' -> \"mbdadbm\" or \"mdbabdm\", 2 steps." },
        { input: "s = \"leetcode\"", output: "5", explanation: "\"leetcodocteel\", 5 insertions." },
        { input: "s = \"g\"", output: "0", explanation: "Single character is already a palindrome." }
      ],
      optimalSolution: `function minInsertions(s) {\n  const n = s.length;\n  let dp = new Array(n).fill(0);\n  for (let i = n - 2; i >= 0; i--) {\n    let prevDiagonal = 0;\n    for (let j = i + 1; j < n; j++) {\n      const temp = dp[j];\n      if (s[i] === s[j]) {\n        dp[j] = prevDiagonal;\n      } else {\n        dp[j] = 1 + Math.min(dp[j], dp[j - 1]);\n      }\n      prevDiagonal = temp;\n    }\n  }\n  return dp[n - 1];\n}`,
      optimalTimeComplexity: "O(N^2)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function minInsertions(s) {\n  const n = s.length;\n  const rev = s.split('').reverse().join('');\n  const dp = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));\n  for (let i = 1; i <= n; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (s[i - 1] === rev[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;\n      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n    }\n  }\n  return n - dp[n][n];\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N^2)",
      commonMistakes: ["Assuming greedy matching from ends without dynamic programming."],
      hints: [
        "The minimum insertions required equals s.length - LPS(s) (Longest Palindromic Subsequence length).",
        "Or use interval DP: if s[i] == s[j], dp[i][j] = dp[i+1][j-1]; else 1 + min(dp[i+1][j], dp[i][j-1])."
      ],
      oracleFn: (s: string) => {
        const n = s.length;
        let dp = new Array(n).fill(0);
        for (let i = n - 2; i >= 0; i--) {
          let prevDiagonal = 0;
          for (let j = i + 1; j < n; j++) {
            const temp = dp[j];
            if (s[i] === s[j]) {
              dp[j] = prevDiagonal;
            } else {
              dp[j] = 1 + Math.min(dp[j], dp[j - 1]);
            }
            prevDiagonal = temp;
          }
        }
        return dp[n - 1];
      },
      testCases: {
        functional: [
          ["zzazz"],
          ["mbadm"],
          ["leetcode"],
          ["g"]
        ],
        boundary: [
          ["a"],
          ["ab"],
          ["aa"]
        ],
        adversarial: [
          ["no"],
          ["abacdfgdcaba"],
          ["turboventilator"]
        ],
        stress: [
          ["abcdefg".repeat(10)],
          ["abccba".repeat(15)]
        ]
      }
    }),

    // 398. Palindrome Partitioning II
    createProblem({
      num: 398,
      title: "Palindrome Partitioning II",
      slug: "palindrome-partitioning-ii",
      level: 19,
      difficulty: "HARD",
      topic: "Advanced Dynamic Programming",
      patternSlug: "advanced-dp",
      estimatedTimeMin: 25,
      statement: "Given a string `s`, partition `s` such that every substring of the partition is a palindrome.\n\nReturn the minimum cuts needed for a palindrome partitioning of `s`.",
      functionName: "minCut",
      parameters: [{ name: "s", type: "string", description: "Input string" }],
      returnType: "number",
      constraints: ["1 <= s.length <= 2000", "s consists of lowercase English letters only."],
      examples: [
        { input: "s = \"aab\"", output: "1", explanation: "The palindrome partitioning [\"aa\",\"b\"] could be produced using 1 cut." },
        { input: "s = \"a\"", output: "0", explanation: "Already a palindrome, 0 cuts needed." },
        { input: "s = \"ab\"", output: "1", explanation: "[\"a\", \"b\"], 1 cut." },
        { input: "s = \"racecar\"", output: "0", explanation: "Entire string is a palindrome." }
      ],
      optimalSolution: `function minCut(s) {\n  const n = s.length;\n  const cuts = Array.from({ length: n }, (_, i) => i);\n  for (let mid = 0; mid < n; mid++) {\n    for (let l = mid, r = mid; l >= 0 && r < n && s[l] === s[r]; l--, r++) {\n      const newCut = l === 0 ? 0 : cuts[l - 1] + 1;\n      cuts[r] = Math.min(cuts[r], newCut);\n    }\n    for (let l = mid, r = mid + 1; l >= 0 && r < n && s[l] === s[r]; l--, r++) {\n      const newCut = l === 0 ? 0 : cuts[l - 1] + 1;\n      cuts[r] = Math.min(cuts[r], newCut);\n    }\n  }\n  return cuts[n - 1];\n}`,
      optimalTimeComplexity: "O(N^2)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function minCut(s) {\n  const n = s.length;\n  const isPal = Array.from({ length: n }, () => new Array(n).fill(false));\n  for (let i = n - 1; i >= 0; i--) {\n    for (let j = i; j < n; j++) {\n      if (s[i] === s[j] && (j - i <= 2 || isPal[i + 1][j - 1])) {\n        isPal[i][j] = true;\n      }\n    }\n  }\n  const dp = Array.from({ length: n }, (_, i) => i);\n  for (let i = 1; i < n; i++) {\n    if (isPal[0][i]) { dp[i] = 0; continue; }\n    for (let j = 0; j < i; j++) {\n      if (isPal[j + 1][i]) dp[i] = Math.min(dp[i], dp[j] + 1);\n    }\n  }\n  return dp[n - 1];\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N^2)",
      commonMistakes: ["Using O(N^3) by repeatedly checking isPalindrome on slices.", "Off-by-one errors on cut counts vs palindrome segment counts (cuts = segments - 1)."],
      hints: [
        "Let cuts[i] be the minimum cuts needed for s[0...i].",
        "Expand around each center mid: whenever s[l...r] is a palindrome, update cuts[r] = min(cuts[r], l === 0 ? 0 : cuts[l-1] + 1)."
      ],
      oracleFn: (s: string) => {
        const n = s.length;
        const cuts = Array.from({ length: n }, (_, i) => i);
        for (let mid = 0; mid < n; mid++) {
          for (let l = mid, r = mid; l >= 0 && r < n && s[l] === s[r]; l--, r++) {
            const newCut = l === 0 ? 0 : cuts[l - 1] + 1;
            cuts[r] = Math.min(cuts[r], newCut);
          }
          for (let l = mid, r = mid + 1; l >= 0 && r < n && s[l] === s[r]; l--, r++) {
            const newCut = l === 0 ? 0 : cuts[l - 1] + 1;
            cuts[r] = Math.min(cuts[r], newCut);
          }
        }
        return cuts[n - 1];
      },
      testCases: {
        functional: [
          ["aab"],
          ["a"],
          ["ab"],
          ["racecar"]
        ],
        boundary: [
          ["aa"],
          ["aaa"],
          ["abc"]
        ],
        adversarial: [
          ["fifgbeifaafachefa"],
          ["coder"],
          ["apbppprp"]
        ],
        stress: [
          ["a".repeat(80)],
          ["ab".repeat(30)]
        ]
      }
    }),

    // 399. Strange Printer
    createProblem({
      num: 399,
      title: "Strange Printer",
      slug: "strange-printer",
      level: 19,
      difficulty: "HARD",
      topic: "Advanced Dynamic Programming",
      patternSlug: "advanced-dp",
      estimatedTimeMin: 30,
      statement: "There is a strange printer with the following two special properties:\n1. The printer can only print a sequence of the same character each time.\n2. At each turn, the printer can print new characters starting and ending at any place and will cover the original existing characters.\n\nGiven a string `s`, return the minimum number of turns the printer needed to print it.",
      functionName: "strangePrinter",
      parameters: [{ name: "s", type: "string", description: "Target string" }],
      returnType: "number",
      constraints: ["1 <= s.length <= 100", "s consists of lowercase English letters."],
      examples: [
        { input: "s = \"aaabbb\"", output: "2", explanation: "Print \"aaaaaa\" first, then print \"bbb\" covering the last three characters." },
        { input: "s = \"aba\"", output: "2", explanation: "Print \"aaa\" first, then print \"b\" in the middle." },
        { input: "s = \"a\"", output: "1", explanation: "Single character printed in 1 turn." },
        { input: "s = \"abcde\"", output: "5", explanation: "5 distinct characters require 5 turns." }
      ],
      optimalSolution: `function strangePrinter(s) {\n  const filtered = [];\n  for (let i = 0; i < s.length; i++) {\n    if (i === 0 || s[i] !== s[i - 1]) filtered.push(s[i]);\n  }\n  const n = filtered.length;\n  const dp = Array.from({ length: n }, () => new Array(n).fill(0));\n  for (let i = 0; i < n; i++) dp[i][i] = 1;\n  for (let len = 2; len <= n; len++) {\n    for (let i = 0; i <= n - len; i++) {\n      const j = i + len - 1;\n      dp[i][j] = dp[i][j - 1] + 1;\n      for (let k = i; k < j; k++) {\n        if (filtered[k] === filtered[j]) {\n          dp[i][j] = Math.min(dp[i][j], dp[i][k] + (k + 1 <= j - 1 ? dp[k + 1][j - 1] : 0));\n        }\n      }\n    }\n  }\n  return dp[0][n - 1];\n}`,
      optimalTimeComplexity: "O(N^3)",
      optimalSpaceComplexity: "O(N^2)",
      suboptimalSolution: `function strangePrinter(s) {\n  const memo = new Map();\n  function dfs(i, j) {\n    if (i > j) return 0;\n    if (i === j) return 1;\n    const key = i + ',' + j;\n    if (memo.has(key)) return memo.get(key);\n    let res = dfs(i, j - 1) + 1;\n    for (let k = i; k < j; k++) {\n      if (s[k] === s[j]) {\n        res = Math.min(res, dfs(i, k) + dfs(k + 1, j - 1));\n      }\n    }\n    memo.set(key, res);\n    return res;\n  }\n  return dfs(0, s.length - 1);\n}`,
      suboptimalTimeComplexity: "O(N^3)",
      suboptimalSpaceComplexity: "O(N^2)",
      commonMistakes: ["Not deduplicating consecutive identical characters before running interval DP."],
      hints: [
        "First condense consecutive duplicate letters (e.g. \"aaabbb\" -> \"ab\").",
        "dp[i][j] is the min turns to print filtered[i...j]. If filtered[k] == filtered[j], the print turn for j can be combined with k!"
      ],
      oracleFn: (s: string) => {
        const filtered: string[] = [];
        for (let i = 0; i < s.length; i++) {
          if (i === 0 || s[i] !== s[i - 1]) filtered.push(s[i]);
        }
        const n = filtered.length;
        const dp = Array.from({ length: n }, () => new Array(n).fill(0));
        for (let i = 0; i < n; i++) dp[i][i] = 1;
        for (let len = 2; len <= n; len++) {
          for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            dp[i][j] = dp[i][j - 1] + 1;
            for (let k = i; k < j; k++) {
              if (filtered[k] === filtered[j]) {
                dp[i][j] = Math.min(dp[i][j], dp[i][k] + (k + 1 <= j - 1 ? dp[k + 1][j - 1] : 0));
              }
            }
          }
        }
        return dp[0][n - 1];
      },
      testCases: {
        functional: [
          ["aaabbb"],
          ["aba"],
          ["a"],
          ["abcde"]
        ],
        boundary: [
          ["aa"],
          ["ab"],
          ["aaa"]
        ],
        adversarial: [
          ["baacdddaaddaaaaccb"],
          ["leetcode"],
          ["tbgtgb"]
        ],
        stress: [
          ["a".repeat(40)],
          ["abcdefgfedcba".repeat(3)]
        ]
      }
    }),

    // 400. Minimum Cost to Cut a Stick
    createProblem({
      num: 400,
      title: "Minimum Cost to Cut a Stick",
      slug: "minimum-cost-to-cut-a-stick",
      level: 19,
      difficulty: "HARD",
      topic: "Advanced Dynamic Programming",
      patternSlug: "advanced-dp",
      estimatedTimeMin: 25,
      statement: "Given a wooden stick of length `n` units. The stick is labelled from `0` to `n`. For example, a stick of length 6 is labelled as: `[0, 1, 2, 3, 4, 5, 6]`.\n\nGiven an integer array `cuts` where `cuts[i]` denotes a position you should perform a cut at.\n\nYou should perform the cuts in order, you can change the order of the cuts as you wish.\n\nThe cost of one cut is the length of the stick to be cut, the total cost is the sum of costs of all cuts. When you cut a stick, it will be split into two smaller sticks (i.e. the sum of their lengths is the length of the stick before the cut).\n\nReturn the minimum total cost of the cuts.",
      functionName: "minCost",
      parameters: [
        { name: "n", type: "number", description: "Length of the stick" },
        { name: "cuts", type: "number[]", description: "Positions to cut" }
      ],
      returnType: "number",
      constraints: ["2 <= n <= 10^6", "1 <= cuts.length <= 100", "1 <= cuts[i] <= n - 1", "All the integers in cuts are distinct."],
      examples: [
        { input: "n = 7, cuts = [1,3,4,5]", output: "16", explanation: "Cuts at 3 (cost 7) -> cuts at 4 (cost 4) -> cuts at 5 (cost 3) -> cuts at 1 (cost 2) = 16." },
        { input: "n = 9, cuts = [5,6,1,4,2]", output: "22", explanation: "Cuts at 4 -> [1,2] -> [5,6] gives total cost 22." },
        { input: "n = 2, cuts = [1]", output: "2", explanation: "One cut at 1 on stick of length 2 costs 2." },
        { input: "n = 10, cuts = [2,4,7]", output: "20", explanation: "Optimal ordering yields cost 20." }
      ],
      optimalSolution: `function minCost(n, cuts) {\n  const allCuts = [0, ...cuts.sort((a, b) => a - b), n];\n  const m = allCuts.length;\n  const dp = Array.from({ length: m }, () => new Array(m).fill(0));\n  for (let len = 2; len < m; len++) {\n    for (let i = 0; i < m - len; i++) {\n      const j = i + len;\n      let minVal = Infinity;\n      for (let k = i + 1; k < j; k++) {\n        minVal = Math.min(minVal, dp[i][k] + dp[k][j]);\n      }\n      dp[i][j] = (allCuts[j] - allCuts[i]) + minVal;\n    }\n  }\n  return dp[0][m - 1];\n}`,
      optimalTimeComplexity: "O(M^3) where M is cuts.length",
      optimalSpaceComplexity: "O(M^2)",
      suboptimalSolution: `function minCost(n, cuts) {\n  const allCuts = [0, ...cuts.sort((a, b) => a - b), n];\n  const memo = new Map();\n  function dfs(i, j) {\n    if (i + 1 >= j) return 0;\n    const key = i + ',' + j;\n    if (memo.has(key)) return memo.get(key);\n    let min = Infinity;\n    for (let k = i + 1; k < j; k++) {\n      min = Math.min(min, dfs(i, k) + dfs(k, j));\n    }\n    const res = (allCuts[j] - allCuts[i]) + min;\n    memo.set(key, res);\n    return res;\n  }\n  return dfs(0, allCuts.length - 1);\n}`,
      suboptimalTimeComplexity: "O(M^3)",
      suboptimalSpaceComplexity: "O(M^2)",
      commonMistakes: ["Trying greedy cut choice based on stick midpoint instead of DP."],
      hints: [
        "Add 0 and n to cuts and sort them.",
        "dp[i][j] is the min cost to make all cuts between allCuts[i] and allCuts[j].",
        "Choose cut k between i and j: cost = (allCuts[j] - allCuts[i]) + dp[i][k] + dp[k][j]."
      ],
      oracleFn: (n: number, cuts: number[]) => {
        const allCuts = [0, ...cuts.slice().sort((a, b) => a - b), n];
        const m = allCuts.length;
        const dp = Array.from({ length: m }, () => new Array(m).fill(0));
        for (let len = 2; len < m; len++) {
          for (let i = 0; i < m - len; i++) {
            const j = i + len;
            let minVal = Infinity;
            for (let k = i + 1; k < j; k++) {
              minVal = Math.min(minVal, dp[i][k] + dp[k][j]);
            }
            dp[i][j] = (allCuts[j] - allCuts[i]) + minVal;
          }
        }
        return dp[0][m - 1];
      },
      testCases: {
        functional: [
          [7, [1, 3, 4, 5]],
          [9, [5, 6, 1, 4, 2]],
          [2, [1]],
          [10, [2, 4, 7]]
        ],
        boundary: [
          [3, [1, 2]],
          [4, [1]],
          [5, [2, 3]]
        ],
        adversarial: [
          [100, [25, 50, 75]],
          [20, [1, 2, 3, 4, 5]],
          [30, [13, 17, 19]]
        ],
        stress: [
          [1000, [100, 200, 300, 400, 500, 600, 700, 800, 900]],
          [500, Array.from({ length: 15 }, (_, i) => (i + 1) * 30)]
        ]
      }
    }),

    // 401. Predict the Winner
    createProblem({
      num: 401,
      title: "Predict the Winner",
      slug: "predict-the-winner",
      level: 19,
      difficulty: "MEDIUM",
      topic: "Advanced Dynamic Programming",
      patternSlug: "advanced-dp",
      estimatedTimeMin: 20,
      statement: "You are given an integer array `nums`. Two players are playing a game with this array: player 1 and player 2.\n\nPlayer 1 and player 2 take turns, with player 1 starting first. Both players start the game with a score of 0. At each turn, the player takes one of the numbers from either end of the array (i.e., `nums[0]` or `nums[nums.length - 1]`) which reduces the size of the array by 1. The player adds the chosen number to their score. The game ends when there are no more elements in the array.\n\nReturn `true` if Player 1 can win the game. If the scores of both players are equal, player 1 is still the winner, and you should also return `true`. You may assume that both players are playing optimally.",
      functionName: "predictTheWinner",
      parameters: [{ name: "nums", type: "number[]", description: "Array of integers" }],
      returnType: "boolean",
      constraints: ["1 <= nums.length <= 20", "0 <= nums[i] <= 10^7"],
      examples: [
        { input: "nums = [1,5,2]", output: "false", explanation: "Initially, player 1 can choose between 1 and 2. If he chooses 2, player 2 chooses 5 and wins with 5 > (2 + 1)." },
        { input: "nums = [1,5,233,7]", output: "true", explanation: "Player 1 can always secure >= player 2's score." },
        { input: "nums = [1]", output: "true", explanation: "Player 1 takes the only element." },
        { input: "nums = [2,4,5,10]", output: "true", explanation: "Player 1 wins." }
      ],
      optimalSolution: `function predictTheWinner(nums) {\n  const n = nums.length;\n  const dp = [...nums];\n  for (let i = n - 2; i >= 0; i--) {\n    for (let j = i + 1; j < n; j++) {\n      dp[j] = Math.max(nums[i] - dp[j], nums[j] - dp[j - 1]);\n    }\n  }\n  return dp[n - 1] >= 0;\n}`,
      optimalTimeComplexity: "O(N^2)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function predictTheWinner(nums) {\n  function maxDiff(l, r) {\n    if (l === r) return nums[l];\n    return Math.max(nums[l] - maxDiff(l + 1, r), nums[r] - maxDiff(l, r - 1));\n  }\n  return maxDiff(0, nums.length - 1) >= 0;\n}`,
      suboptimalTimeComplexity: "O(2^N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Assuming player 1 wins on every array of even length without checking tie conditions or rules."],
      hints: [
        "Let dp[i][j] be the maximum relative score difference (player - opponent) the current player can achieve from nums[i...j].",
        "dp[i][j] = max(nums[i] - dp[i+1][j], nums[j] - dp[i][j-1])."
      ],
      oracleFn: (nums: number[]) => {
        const n = nums.length;
        const dp = [...nums];
        for (let i = n - 2; i >= 0; i--) {
          for (let j = i + 1; j < n; j++) {
            dp[j] = Math.max(nums[i] - dp[j], nums[j] - dp[j - 1]);
          }
        }
        return dp[n - 1] >= 0;
      },
      testCases: {
        functional: [
          [[1, 5, 2]],
          [[1, 5, 233, 7]],
          [[1]],
          [[2, 4, 5, 10]]
        ],
        boundary: [
          [[1, 1]],
          [[1, 2]],
          [[2, 1]]
        ],
        adversarial: [
          [[1, 100, 2]],
          [[10, 15, 20, 5]],
          [[20, 30, 2, 2, 2, 10]]
        ],
        stress: [
          [Array.from({ length: 20 }, (_, i) => (i * 7) % 50)],
          [Array.from({ length: 18 }, () => 10)]
        ]
      }
    }),

    // 402. Stone Game
    createProblem({
      num: 402,
      title: "Stone Game",
      slug: "stone-game",
      level: 19,
      difficulty: "MEDIUM",
      topic: "Advanced Dynamic Programming",
      patternSlug: "advanced-dp",
      estimatedTimeMin: 15,
      statement: "Alice and Bob play a game with piles of stones. There are an even number of piles arranged in a row, and each pile has a positive integer number of stones `piles[i]`.\n\nThe objective of the game is to end with the most stones. The total number of stones across all the piles is odd, so there are no ties.\n\nAlice and Bob take turns, with Alice starting first. Each turn, a player takes the entire pile of stones either from the beginning or from the end of the row. This continues until there are no more piles left, at which point the person with the most stones wins.\n\nAssuming Alice and Bob play optimally, return `true` if Alice wins the game, or `false` if Bob wins.",
      functionName: "stoneGame",
      parameters: [{ name: "piles", type: "number[]", description: "Array of stones in each pile" }],
      returnType: "boolean",
      constraints: ["2 <= piles.length <= 500", "piles.length is even", "1 <= piles[i] <= 500", "sum(piles[i]) is odd"],
      examples: [
        { input: "piles = [5,3,4,5]", output: "true", explanation: "Alice starts first, can secure more stones than Bob." },
        { input: "piles = [3,7,2,3]", output: "true", explanation: "Alice wins." },
        { input: "piles = [1,2]", output: "true", explanation: "Alice picks 2 and wins." },
        { input: "piles = [2,10,1,5]", output: "true", explanation: "Alice picks optimal ends and wins." }
      ],
      optimalSolution: `function stoneGame(piles) {\n  // Mathematical proof: Alice can always choose all even or all odd positioned piles.\n  // Since total sum is odd, one parity has strictly more stones. Alice always wins.\n  return true;\n}`,
      optimalTimeComplexity: "O(1)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function stoneGame(piles) {\n  const n = piles.length;\n  const dp = [...piles];\n  for (let i = n - 2; i >= 0; i--) {\n    for (let j = i + 1; j < n; j++) {\n      dp[j] = Math.max(piles[i] - dp[j], piles[j] - dp[j - 1]);\n    }\n  }\n  return dp[n - 1] > 0;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Writing full recursive minimax without noticing Alice can always force a win."],
      hints: [
        "Because n is even and total sum is odd, Alice can partition the piles into even and odd indices.",
        "She can choose either all even-indexed or all odd-indexed piles, whichever sum is greater, so she always wins!"
      ],
      oracleFn: (piles: number[]) => {
        return true;
      },
      testCases: {
        functional: [
          [[5, 3, 4, 5]],
          [[3, 7, 2, 3]],
          [[1, 2]],
          [[2, 10, 1, 5]]
        ],
        boundary: [
          [[1, 4]],
          [[10, 1]],
          [[3, 2, 4, 1]]
        ],
        adversarial: [
          [[1, 100, 2, 3]],
          [[5, 5, 5, 6]],
          [[7, 8, 8, 10]]
        ],
        stress: [
          [Array.from({ length: 40 }, (_, i) => (i % 2 === 0 ? 10 : 3))],
          [Array.from({ length: 50 }, (_, i) => i * 2 + 1)]
        ]
      }
    }),

    // 403. Stone Game II
    createProblem({
      num: 403,
      title: "Stone Game II",
      slug: "stone-game-ii",
      level: 19,
      difficulty: "MEDIUM",
      topic: "Advanced Dynamic Programming",
      patternSlug: "advanced-dp",
      estimatedTimeMin: 25,
      statement: "Alice and Bob continue their games with piles of stones. There are a number of piles arranged in a row, and each pile has a positive integer number of stones `piles[i]`. The objective of the game is to end with the most stones.\n\nAlice and Bob take turns, with Alice starting first. Initially, `M = 1`.\n\nOn each player's turn, that player can take all the stones in the first `X` remaining piles, where `1 <= X <= 2M`. Then, we set `M = max(M, X)`.\n\nThe game continues until all the stones have been taken.\n\nAssuming Alice and Bob play optimally, return the maximum number of stones Alice can get.",
      functionName: "stoneGameII",
      parameters: [{ name: "piles", type: "number[]", description: "Array of stones in each pile" }],
      returnType: "number",
      constraints: ["1 <= piles.length <= 100", "1 <= piles[i] <= 10^4"],
      examples: [
        { input: "piles = [2,7,9,4,4]", output: "10", explanation: "Alice takes 1 pile (2), Bob takes 2 piles (7+9=16)... Alice can strategically maximize her total stones to 10." },
        { input: "piles = [1,2,3,4,5,100]", output: "104", explanation: "Alice takes optimal piles to achieve 104." },
        { input: "piles = [1]", output: "1", explanation: "Alice takes the only pile." },
        { input: "piles = [1,2]", output: "3", explanation: "Alice can take both piles since X <= 2*1 = 2." }
      ],
      optimalSolution: `function stoneGameII(piles) {\n  const n = piles.length;\n  const suffixSum = new Array(n + 1).fill(0);\n  for (let i = n - 1; i >= 0; i--) suffixSum[i] = suffixSum[i + 1] + piles[i];\n  const memo = Array.from({ length: n }, () => new Array(n + 1).fill(0));\n  function dfs(i, m) {\n    if (i >= n) return 0;\n    if (i + 2 * m >= n) return suffixSum[i];\n    if (memo[i][m] !== 0) return memo[i][m];\n    let minOpponent = Infinity;\n    for (let x = 1; x <= 2 * m; x++) {\n      minOpponent = Math.min(minOpponent, dfs(i + x, Math.max(m, x)));\n    }\n    return memo[i][m] = suffixSum[i] - minOpponent;\n  }\n  return dfs(0, 1);\n}`,
      optimalTimeComplexity: "O(N^3)",
      optimalSpaceComplexity: "O(N^2)",
      suboptimalSolution: `function stoneGameII(piles) {\n  const n = piles.length;\n  const suffix = new Array(n).fill(0);\n  suffix[n - 1] = piles[n - 1];\n  for (let i = n - 2; i >= 0; i--) suffix[i] = suffix[i + 1] + piles[i];\n  const dp = Array.from({ length: n }, () => new Array(n + 1).fill(0));\n  for (let i = n - 1; i >= 0; i--) {\n    for (let m = 1; m <= n; m++) {\n      if (i + 2 * m >= n) {\n        dp[i][m] = suffix[i];\n      } else {\n        for (let x = 1; x <= 2 * m; x++) {\n          dp[i][m] = Math.max(dp[i][m], suffix[i] - dp[i + x][Math.max(m, x)]);\n        }\n      }\n    }\n  }\n  return dp[0][1];\n}`,
      suboptimalTimeComplexity: "O(N^3)",
      suboptimalSpaceComplexity: "O(N^2)",
      commonMistakes: ["Setting M = X instead of M = max(M, X).", "Re-summing remaining piles naively instead of precomputing suffix sums."],
      hints: [
        "Precompute suffix sums: total stones remaining from index i is suffixSum[i].",
        "The current player takes X piles and leaves the opponent with optimal play from (i + X, max(M, X)).",
        "Current player gets suffixSum[i] - opponent_score."
      ],
      oracleFn: (piles: number[]) => {
        const n = piles.length;
        const suffixSum = new Array(n + 1).fill(0);
        for (let i = n - 1; i >= 0; i--) suffixSum[i] = suffixSum[i + 1] + piles[i];
        const memo = Array.from({ length: n }, () => new Array(n + 1).fill(0));
        const dfs = (i: number, m: number): number => {
          if (i >= n) return 0;
          if (i + 2 * m >= n) return suffixSum[i];
          if (memo[i][m] !== 0) return memo[i][m];
          let minOpponent = Infinity;
          for (let x = 1; x <= 2 * m; x++) {
            minOpponent = Math.min(minOpponent, dfs(i + x, Math.max(m, x)));
          }
          return memo[i][m] = suffixSum[i] - minOpponent;
        };
        return dfs(0, 1);
      },
      testCases: {
        functional: [
          [[2, 7, 9, 4, 4]],
          [[1, 2, 3, 4, 5, 100]],
          [[1]],
          [[1, 2]]
        ],
        boundary: [
          [[1, 2, 3]],
          [[5, 5]],
          [[10, 20, 30, 40]]
        ],
        adversarial: [
          [[8, 9, 5, 4, 5, 4, 1, 1, 9, 3, 1, 7, 9]],
          [[1, 1, 1, 1, 1, 1, 1, 1]],
          [[9, 2, 2, 8, 3, 7, 9, 9]]
        ],
        stress: [
          [Array.from({ length: 40 }, (_, i) => (i % 5) + 1)],
          [Array.from({ length: 50 }, (_, i) => i * 10)]
        ]
      }
    }),

    // 404. Stone Game III
    createProblem({
      num: 404,
      title: "Stone Game III",
      slug: "stone-game-iii",
      level: 19,
      difficulty: "HARD",
      topic: "Advanced Dynamic Programming",
      patternSlug: "advanced-dp",
      estimatedTimeMin: 25,
      statement: "Alice and Bob continue their games with piles of stones. There are several stones arranged in a row, and each stone has an associated value which is an integer given in the array `stoneValue`.\n\nAlice and Bob take turns, with Alice starting first. On each player's turn, that player can take `1`, `2`, or `3` stones from the first remaining stones in the row.\n\nThe score of each player is the sum of the values of the stones taken. The score of each player is 0 initially.\n\nThe objective of the game is to end with the highest score, and the winner is the player with the highest score and there could be a tie. The game continues until all the stones have been taken.\n\nAssuming Alice and Bob play optimally, return \"Alice\" if Alice will win, \"Bob\" if Bob will win, or \"Tie\" if they will end the game with the same score.",
      functionName: "stoneGameIII",
      parameters: [{ name: "stoneValue", type: "number[]", description: "Values of the stones in the row" }],
      returnType: "string",
      constraints: ["1 <= stoneValue.length <= 5 * 10^4", "-1000 <= stoneValue[i] <= 1000"],
      examples: [
        { input: "stoneValue = [1,2,3,7]", output: "\"Bob\"", explanation: "Alice will always lose. If she takes 1, 2, or 3 stones, Bob can always respond to get more points." },
        { input: "stoneValue = [1,2,3,-9]", output: "\"Alice\"", explanation: "Alice must choose 3 stones: 1 + 2 + 3 = 6. Bob is forced to take -9. Alice wins." },
        { input: "stoneValue = [1,2,3,6]", output: "\"Tie\"", explanation: "Both players achieve identical score 6." },
        { input: "stoneValue = [-1,-2,-3]", output: "\"Tie\"", explanation: "Both players can ensure equal score." }
      ],
      optimalSolution: `function stoneGameIII(stoneValue) {\n  const n = stoneValue.length;\n  let dp1 = 0, dp2 = 0, dp3 = 0;\n  for (let i = n - 1; i >= 0; i--) {\n    let take = 0;\n    let best = -Infinity;\n    for (let k = 0; k < 3 && i + k < n; k++) {\n      take += stoneValue[i + k];\n      const nextScore = k === 0 ? dp1 : k === 1 ? dp2 : dp3;\n      best = Math.max(best, take - nextScore);\n    }\n    dp3 = dp2;\n    dp2 = dp1;\n    dp1 = best;\n  }\n  if (dp1 > 0) return "Alice";\n  if (dp1 < 0) return "Bob";\n  return "Tie";\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function stoneGameIII(stoneValue) {\n  const n = stoneValue.length;\n  const dp = new Array(n + 1).fill(-Infinity);\n  dp[n] = 0;\n  for (let i = n - 1; i >= 0; i--) {\n    let sum = 0;\n    for (let k = 1; k <= 3 && i + k <= n; k++) {\n      sum += stoneValue[i + k - 1];\n      dp[i] = Math.max(dp[i], sum - dp[i + k]);\n    }\n  }\n  if (dp[0] > 0) return "Alice";\n  if (dp[0] < 0) return "Bob";\n  return "Tie";\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Negative stone values mean players might want to take fewer stones to force negative points onto the opponent."],
      hints: [
        "Let dp[i] be the maximum score difference (current player - opponent) from index i.",
        "dp[i] = max_{k=1..3} (sum(stoneValue[i...i+k-1]) - dp[i+k]).",
        "dp[0] > 0 => Alice, dp[0] < 0 => Bob, dp[0] == 0 => Tie."
      ],
      oracleFn: (stoneValue: number[]) => {
        const n = stoneValue.length;
        let dp1 = 0, dp2 = 0, dp3 = 0;
        for (let i = n - 1; i >= 0; i--) {
          let take = 0;
          let best = -Infinity;
          for (let k = 0; k < 3 && i + k < n; k++) {
            take += stoneValue[i + k];
            const nextScore = k === 0 ? dp1 : k === 1 ? dp2 : dp3;
            best = Math.max(best, take - nextScore);
          }
          dp3 = dp2;
          dp2 = dp1;
          dp1 = best;
        }
        if (dp1 > 0) return "Alice";
        if (dp1 < 0) return "Bob";
        return "Tie";
      },
      testCases: {
        functional: [
          [[1, 2, 3, 7]],
          [[1, 2, 3, -9]],
          [[1, 2, 3, 6]],
          [[-1, -2, -3]]
        ],
        boundary: [
          [[1]],
          [[-1]],
          [[0, 0, 0]]
        ],
        adversarial: [
          [[-1, 2, -3, 4, -5]],
          [[10, -10, 10, -10, 10]],
          [[5, 4, 3, 2, 1]]
        ],
        stress: [
          [Array.from({ length: 60 }, (_, i) => (i % 3 === 0 ? -5 : 5))],
          [Array.from({ length: 80 }, (_, i) => (i * 13) % 20 - 10)]
        ]
      }
    }),

    // 405. Stone Game IV
    createProblem({
      num: 405,
      title: "Stone Game IV",
      slug: "stone-game-iv",
      level: 19,
      difficulty: "HARD",
      topic: "Advanced Dynamic Programming",
      patternSlug: "advanced-dp",
      estimatedTimeMin: 20,
      statement: "Alice and Bob take turns playing a game, with Alice starting first.\n\nInitially, there are `n` stones in a pile. On each player's turn, that player makes a move consisting of removing any non-zero square number of stones in the pile.\n\nAlso, if a player cannot make a move, he/she loses the game.\n\nGiven the positive integer `n`, return `true` if and only if Alice wins the game otherwise return `false`, assuming both players play optimally.",
      functionName: "winnerSquareGame",
      parameters: [{ name: "n", type: "number", description: "Initial number of stones" }],
      returnType: "boolean",
      constraints: ["1 <= n <= 10^5"],
      examples: [
        { input: "n = 1", output: "true", explanation: "Alice can remove 1 stone (1 = 1^2) and Bob cannot make any move." },
        { input: "n = 2", output: "false", explanation: "Alice can only remove 1 stone. Bob then removes 1 stone and wins." },
        { input: "n = 4", output: "true", explanation: "Alice removes 4 stones (4 = 2^2) and wins immediately." },
        { input: "n = 7", output: "false", explanation: "Alice cannot force a win from 7." }
      ],
      optimalSolution: `function winnerSquareGame(n) {\n  const dp = new Array(n + 1).fill(false);\n  for (let i = 1; i <= n; i++) {\n    for (let k = 1; k * k <= i; k++) {\n      if (!dp[i - k * k]) {\n        dp[i] = true;\n        break;\n      }\n    }\n  }\n  return dp[n];\n}`,
      optimalTimeComplexity: "O(N * sqrt(N))",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function winnerSquareGame(n) {\n  const memo = new Map();\n  function dfs(rem) {\n    if (rem === 0) return false;\n    if (memo.has(rem)) return memo.get(rem);\n    for (let k = 1; k * k <= rem; k++) {\n      if (!dfs(rem - k * k)) {\n        memo.set(rem, true);\n        return true;\n      }\n    }\n    memo.set(rem, false);\n    return false;\n  }\n  return dfs(n);\n}`,
      suboptimalTimeComplexity: "O(N * sqrt(N))",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Failing to break early once a winning transition (!dp[i - k*k]) is found."],
      hints: [
        "A state i is a WINNING state (true) if there exists at least one k such that i - k*k is a LOSING state (false).",
        "If all reachable states from i are winning, then i is a losing state (false)."
      ],
      oracleFn: (n: number) => {
        const dp = new Array(n + 1).fill(false);
        for (let i = 1; i <= n; i++) {
          for (let k = 1; k * k <= i; k++) {
            if (!dp[i - k * k]) {
              dp[i] = true;
              break;
            }
          }
        }
        return dp[n];
      },
      testCases: {
        functional: [
          [1],
          [2],
          [4],
          [7]
        ],
        boundary: [
          [3],
          [5],
          [8]
        ],
        adversarial: [
          [17],
          [25],
          [43]
        ],
        stress: [
          [500],
          [1000],
          [2000]
        ]
      }
    }),

    // 406. Can I Win
    createProblem({
      num: 406,
      title: "Can I Win",
      slug: "can-i-win",
      level: 19,
      difficulty: "MEDIUM",
      topic: "Advanced Dynamic Programming",
      patternSlug: "advanced-dp",
      estimatedTimeMin: 25,
      statement: "In the \"100 game\" two players take turns adding, to a running total, any integer from 1 to 10. The player who first causes the running total to reach or exceed 100 wins.\n\nWhat if we change the game so that players cannot re-use integers?\n\nFor example, two players might take turns drawing from a common pool of numbers of 1 to 15 without replacement until they reach a total >= 100.\n\nGiven two integers `maxChoosableInteger` and `desiredTotal`, return `true` if the first player to move can force a win, otherwise, return `false`. Assume both players play optimally.",
      functionName: "canIWin",
      parameters: [
        { name: "maxChoosableInteger", type: "number", description: "Largest available integer (1 to maxChoosableInteger)" },
        { name: "desiredTotal", type: "number", description: "Target total to reach or exceed" }
      ],
      returnType: "boolean",
      constraints: ["1 <= maxChoosableInteger <= 20", "0 <= desiredTotal <= 300"],
      examples: [
        { input: "maxChoosableInteger = 10, desiredTotal = 11", output: "false", explanation: "No matter which number the first player picks, the second player can win on next move." },
        { input: "maxChoosableInteger = 10, desiredTotal = 0", output: "true", explanation: "Target already reached." },
        { input: "maxChoosableInteger = 10, desiredTotal = 1", output: "true", explanation: "First player picks 1 and wins immediately." },
        { input: "maxChoosableInteger = 4, desiredTotal = 6", output: "true", explanation: "First player picks 4, next player gets 1 or 2 or 3..." }
      ],
      optimalSolution: `function canIWin(maxChoosableInteger, desiredTotal) {\n  if (desiredTotal <= 0) return true;\n  const sum = (maxChoosableInteger * (maxChoosableInteger + 1)) / 2;\n  if (sum < desiredTotal) return false;\n  const memo = new Map();\n  function dfs(usedMask, currentTotal) {\n    if (memo.has(usedMask)) return memo.get(usedMask);\n    for (let i = 1; i <= maxChoosableInteger; i++) {\n      if ((usedMask & (1 << i)) === 0) {\n        if (currentTotal + i >= desiredTotal || !dfs(usedMask | (1 << i), currentTotal + i)) {\n          memo.set(usedMask, true);\n          return true;\n        }\n      }\n    }\n    memo.set(usedMask, false);\n    return false;\n  }\n  return dfs(0, 0);\n}`,
      optimalTimeComplexity: "O(2^M * M) where M is maxChoosableInteger",
      optimalSpaceComplexity: "O(2^M)",
      suboptimalSolution: `function canIWin(maxChoosableInteger, desiredTotal) {\n  if (desiredTotal <= 0) return true;\n  const sum = (maxChoosableInteger * (maxChoosableInteger + 1)) / 2;\n  if (sum < desiredTotal) return false;\n  const memo = new Array(1 << (maxChoosableInteger + 1)).fill(null);\n  function dfs(mask, total) {\n    if (memo[mask] !== null) return memo[mask];\n    for (let i = 1; i <= maxChoosableInteger; i++) {\n      if ((mask & (1 << i)) === 0) {\n        if (total + i >= desiredTotal || !dfs(mask | (1 << i), total + i)) {\n          return memo[mask] = true;\n        }\n      }\n    }\n    return memo[mask] = false;\n  }\n  return dfs(0, 0);\n}`,
      suboptimalTimeComplexity: "O(2^M * M)",
      suboptimalSpaceComplexity: "O(2^M)",
      commonMistakes: ["Not checking whether the sum of all numbers 1..maxChoosableInteger is less than desiredTotal (instant false).", "Forgetting desiredTotal <= 0 edge case."],
      hints: [
        "Use bitmask to represent which numbers 1..M have been used.",
        "If choosing number i reaches desiredTotal or forces opponent to lose from next state, return true."
      ],
      oracleFn: (maxChoosableInteger: number, desiredTotal: number) => {
        if (desiredTotal <= 0) return true;
        const sum = (maxChoosableInteger * (maxChoosableInteger + 1)) / 2;
        if (sum < desiredTotal) return false;
        const memo = new Map<number, boolean>();
        const dfs = (usedMask: number, currentTotal: number): boolean => {
          if (memo.has(usedMask)) return memo.get(usedMask)!;
          for (let i = 1; i <= maxChoosableInteger; i++) {
            if ((usedMask & (1 << i)) === 0) {
              if (currentTotal + i >= desiredTotal || !dfs(usedMask | (1 << i), currentTotal + i)) {
                memo.set(usedMask, true);
                return true;
              }
            }
          }
          memo.set(usedMask, false);
          return false;
        };
        return dfs(0, 0);
      },
      testCases: {
        functional: [
          [10, 11],
          [10, 0],
          [10, 1],
          [4, 6]
        ],
        boundary: [
          [5, 50],
          [1, 1],
          [2, 3]
        ],
        adversarial: [
          [18, 79],
          [15, 65],
          [12, 49]
        ],
        stress: [
          [10, 40],
          [16, 100]
        ]
      }
    }),

    // 407. Super Egg Drop
    createProblem({
      num: 407,
      title: "Super Egg Drop",
      slug: "super-egg-drop",
      level: 19,
      difficulty: "HARD",
      topic: "Advanced Dynamic Programming",
      patternSlug: "advanced-dp",
      estimatedTimeMin: 35,
      statement: "You are given `k` identical eggs and you have access to a building with `n` floors labeled from `1` to `n`.\n\nYou know that there exists a floor `f` where `0 <= f <= n` such that any egg dropped at a floor higher than `f` will break, and any egg dropped at or below floor `f` will not break.\n\nEach move, you may take an unbroken egg and drop it from any floor `x` (where `1 <= x <= n`). If the egg breaks, you can no longer use it. However, if the egg does not break, you may reuse it in future moves.\n\nReturn the minimum number of moves that you need to determine with certainty what the value of `f` is.",
      functionName: "superEggDrop",
      parameters: [
        { name: "k", type: "number", description: "Number of identical eggs" },
        { name: "n", type: "number", description: "Number of floors in building" }
      ],
      returnType: "number",
      constraints: ["1 <= k <= 100", "1 <= n <= 10^4"],
      examples: [
        { input: "k = 1, n = 2", output: "2", explanation: "Drop from floor 1. If it breaks, f = 0. If it doesn't break, drop from floor 2. If it breaks, f = 1. If not, f = 2. 2 moves." },
        { input: "k = 2, n = 6", output: "3", explanation: "Optimal strategy tests floor 3 first, max 3 moves." },
        { input: "k = 3, n = 14", output: "4", explanation: "4 moves suffice with 3 eggs." },
        { input: "k = 2, n = 100", output: "14", explanation: "Classic puzzle: 14 moves." }
      ],
      optimalSolution: `function superEggDrop(k, n) {\n  const dp = new Array(k + 1).fill(0);\n  let m = 0;\n  while (dp[k] < n) {\n    m++;\n    for (let egg = k; egg >= 1; egg--) {\n      dp[egg] = dp[egg] + dp[egg - 1] + 1;\n    }\n  }\n  return m;\n}`,
      optimalTimeComplexity: "O(K * moves) where moves <= N",
      optimalSpaceComplexity: "O(K)",
      suboptimalSolution: `function superEggDrop(k, n) {\n  const memo = new Map();\n  function dfs(eggs, floors) {\n    if (floors <= 1 || eggs === 1) return floors;\n    const key = eggs + ',' + floors;\n    if (memo.has(key)) return memo.get(key);\n    let low = 1, high = floors, ans = floors;\n    while (low <= high) {\n      const mid = Math.floor((low + high) / 2);\n      const broken = dfs(eggs - 1, mid - 1);\n      const notBroken = dfs(eggs, floors - mid);\n      ans = Math.min(ans, 1 + Math.max(broken, notBroken));\n      if (broken === notBroken) break;\n      if (broken < notBroken) low = mid + 1;\n      else high = mid - 1;\n    }\n    memo.set(key, ans);\n    return ans;\n  }\n  return dfs(k, n);\n}`,
      suboptimalTimeComplexity: "O(K * N log N)",
      suboptimalSpaceComplexity: "O(K * N)",
      commonMistakes: ["Trying O(K * N^2) basic DP which will time out for N = 10^4.", "Inverting problem to find max floors testable given m moves and k eggs yields lightning fast O(K * m)."],
      hints: [
        "Invert the formulation: let dp[m][k] be the maximum floors we can test with m moves and k eggs.",
        "dp[m][k] = dp[m-1][k-1] (if egg breaks) + dp[m-1][k] (if egg survives) + 1.",
        "Increment m until dp[m][k] >= n."
      ],
      oracleFn: (k: number, n: number) => {
        const dp = new Array(k + 1).fill(0);
        let m = 0;
        while (dp[k] < n) {
          m++;
          for (let egg = k; egg >= 1; egg--) {
            dp[egg] = dp[egg] + dp[egg - 1] + 1;
          }
        }
        return m;
      },
      testCases: {
        functional: [
          [1, 2],
          [2, 6],
          [3, 14],
          [2, 100]
        ],
        boundary: [
          [1, 1],
          [2, 1],
          [1, 10]
        ],
        adversarial: [
          [2, 4],
          [4, 50],
          [7, 1000]
        ],
        stress: [
          [5, 5000],
          [10, 10000]
        ]
      }
    })
  ];

  return {
    level: 19,
    levelTitle: "Level 19 — Advanced DP & State Machines",
    topic: "Game Theory Minimax, 2D LIS Envelopes, Word Chains, Scramble Strings, and Inverted State Transitions",
    problems
  };
}
