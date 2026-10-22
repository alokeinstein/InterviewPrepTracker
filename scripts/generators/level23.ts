import { LevelPayload, GeneratedProblem } from './types';
import { createProblem } from './problemBuilder';

export function getLevel23Payload(): LevelPayload {
  const problems: GeneratedProblem[] = [
    // 475. Add Strings
    createProblem({
      num: 475,
      title: "Add Strings",
      slug: "add-strings",
      level: 23,
      difficulty: "EASY",
      topic: "Math / Strings",
      patternSlug: "advanced-design-intervals",
      estimatedTimeMin: 15,
      statement: "Given two non-negative integers, `num1` and `num2` represented as string, return the sum of `num1` and `num2` as a string.\n\nYou must solve the problem without using any built-in library for handling large integers (such as BigInteger). You must also not convert the inputs to integers directly.",
      functionName: "addStrings",
      parameters: [
        { name: "num1", type: "string", description: "First non-negative integer string" },
        { name: "num2", type: "string", description: "Second non-negative integer string" }
      ],
      returnType: "string",
      constraints: ["1 <= num1.length, num2.length <= 10^4", "num1 and num2 consist of only digits.", "num1 and num2 don't have any leading zeros except for the zero itself."],
      examples: [
        { input: "num1 = \"11\", num2 = \"123\"", output: "\"134\"", explanation: "11 + 123 = 134." },
        { input: "num1 = \"456\", num2 = \"77\"", output: "\"533\"", explanation: "456 + 77 = 533." },
        { input: "num1 = \"0\", num2 = \"0\"", output: "\"0\"", explanation: "0 + 0 = 0." }
      ],
      optimalSolution: `function addStrings(num1, num2) {\n  let i = num1.length - 1, j = num2.length - 1;\n  let carry = 0;\n  const res = [];\n  while (i >= 0 || j >= 0 || carry > 0) {\n    const d1 = i >= 0 ? num1.charCodeAt(i) - 48 : 0;\n    const d2 = j >= 0 ? num2.charCodeAt(j) - 48 : 0;\n    const sum = d1 + d2 + carry;\n    res.push(sum % 10);\n    carry = Math.floor(sum / 10);\n    i--;\n    j--;\n  }\n  return res.reverse().join('');\n}`,
      optimalTimeComplexity: "O(max(N1, N2))",
      optimalSpaceComplexity: "O(max(N1, N2))",
      suboptimalSolution: `function addStrings(num1, num2) {\n  return (BigInt(num1) + BigInt(num2)).toString();\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Forgetting remaining carry after the loop terminates.",
        "Using parseInt which loses precision beyond 53 bits."
      ],
      hints: [
        "Iterate from right to left using two pointers.",
        "Sum corresponding digits plus carry.",
        "Append remainder modulo 10 and propagate division by 10 as carry."
      ],
      oracleFn: (num1: string, num2: string) => {
        let i = num1.length - 1, j = num2.length - 1;
        let carry = 0;
        const res: number[] = [];
        while (i >= 0 || j >= 0 || carry > 0) {
          const d1 = i >= 0 ? num1.charCodeAt(i) - 48 : 0;
          const d2 = j >= 0 ? num2.charCodeAt(j) - 48 : 0;
          const sum = d1 + d2 + carry;
          res.push(sum % 10);
          carry = Math.floor(sum / 10);
          i--;
          j--;
        }
        return res.reverse().join('');
      },
      testCases: {
        functional: [
          ["11", "123"],
          ["456", "77"],
          ["0", "0"],
          ["999", "1"]
        ],
        boundary: [
          ["1", "1"],
          ["0", "9999"],
          ["9999999", "1"]
        ],
        adversarial: [
          ["12345678901234567890", "98765432109876543210"],
          ["9".repeat(30), "9".repeat(30)]
        ],
        stress: [
          ["1".repeat(80), "2".repeat(80)],
          ["9".repeat(60), "1"]
        ]
      }
    }),

    // 476. Compare Version Numbers
    createProblem({
      num: 476,
      title: "Compare Version Numbers",
      slug: "compare-version-numbers",
      level: 23,
      difficulty: "MEDIUM",
      topic: "Two Pointers / String Parsing",
      patternSlug: "advanced-design-intervals",
      estimatedTimeMin: 20,
      statement: "Given two version strings, `version1` and `version2`, compare them. A version number consists of revisions separated by dots `'.'`. The value of the revision is its integer conversion ignoring leading zeros.\n\nTo compare version numbers, compare their revisions from left to right. If one version string has fewer revisions than the other, treat the missing revisions as `0`.\n\nReturn:\n- `-1` if `version1 < version2`\n- `1` if `version1 > version2`\n- `0` if `version1 == version2`.",
      functionName: "compareVersion",
      parameters: [
        { name: "version1", type: "string", description: "First version string" },
        { name: "version2", type: "string", description: "Second version string" }
      ],
      returnType: "number",
      constraints: ["1 <= version1.length, version2.length <= 500", "version1 and version2 only contain digits and '.'", "version1 and version2 are valid version numbers."],
      examples: [
        { input: "version1 = \"1.2\", version2 = \"1.10\"", output: "-1", explanation: "1 == 1, but 2 < 10, so version1 < version2." },
        { input: "version1 = \"1.01\", version2 = \"1.001\"", output: "0", explanation: "Ignoring leading zeros, both '01' and '001' represent integer 1." },
        { input: "version1 = \"1.0\", version2 = \"1.0.0.0\"", output: "0", explanation: "Missing revisions in version1 are treated as 0." }
      ],
      optimalSolution: `function compareVersion(version1, version2) {\n  const v1 = version1.split('.');\n  const v2 = version2.split('.');\n  const maxLen = Math.max(v1.length, v2.length);\n  for (let i = 0; i < maxLen; i++) {\n    const num1 = i < v1.length ? parseInt(v1[i], 10) : 0;\n    const num2 = i < v2.length ? parseInt(v2[i], 10) : 0;\n    if (num1 < num2) return -1;\n    if (num1 > num2) return 1;\n  }\n  return 0;\n}`,
      optimalTimeComplexity: "O(max(N1, N2))",
      optimalSpaceComplexity: "O(N1 + N2)",
      suboptimalSolution: `function compareVersion(version1, version2) {\n  let i = 0, j = 0;\n  while (i < version1.length || j < version2.length) {\n    let num1 = 0;\n    while (i < version1.length && version1[i] !== '.') {\n      num1 = num1 * 10 + (version1.charCodeAt(i) - 48);\n      i++;\n    }\n    i++;\n    let num2 = 0;\n    while (j < version2.length && version2[j] !== '.') {\n      num2 = num2 * 10 + (version2.charCodeAt(j) - 48);\n      j++;\n    }\n    j++;\n    if (num1 < num2) return -1;\n    if (num1 > num2) return 1;\n  }\n  return 0;\n}`,
      suboptimalTimeComplexity: "O(N1 + N2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: [
        "Comparing strings lexicographically (e.g., '2' > '10' lexicographically, which is wrong numerically).",
        "Not treating missing trailing dot revisions as zero (e.g. '1.0' vs '1.0.0.0')."
      ],
      hints: [
        "Split each version string by '.' into revision chunks.",
        "Iterate up to the maximum number of chunks across both versions.",
        "Parse each chunk into integer, defaulting missing chunks to 0."
      ],
      oracleFn: (version1: string, version2: string) => {
        const v1 = version1.split('.');
        const v2 = version2.split('.');
        const maxLen = Math.max(v1.length, v2.length);
        for (let i = 0; i < maxLen; i++) {
          const num1 = i < v1.length ? parseInt(v1[i], 10) : 0;
          const num2 = i < v2.length ? parseInt(v2[i], 10) : 0;
          if (num1 < num2) return -1;
          if (num1 > num2) return 1;
        }
        return 0;
      },
      testCases: {
        functional: [
          ["1.2", "1.10"],
          ["1.01", "1.001"],
          ["1.0", "1.0.0.0"],
          ["0.1", "1.1"]
        ],
        boundary: [
          ["1", "1"],
          ["1.0", "1"],
          ["2.0.0", "1.9.9"]
        ],
        adversarial: [
          ["7.5.2.4", "7.5.3"],
          ["1.0.1", "1"],
          ["0001.002", "1.2"]
        ],
        stress: [
          [Array.from({ length: 40 }, () => "1").join('.'), Array.from({ length: 40 }, () => "1").join('.')],
          [Array.from({ length: 50 }, () => "0").join('.'), "0"]
        ]
      }
    }),

    // 477. Zigzag Conversion
    createProblem({
      num: 477,
      title: "Zigzag Conversion",
      slug: "zigzag-conversion",
      level: 23,
      difficulty: "MEDIUM",
      topic: "Strings / Simulation",
      patternSlug: "advanced-design-intervals",
      estimatedTimeMin: 20,
      statement: "The string `\"PAYPALISHIRING\"` is written in a zigzag pattern on a given number of rows like this:\n```\nP   A   H   N\nA P L S I I G\nY   I   R\n```\nAnd then read line by line: `\"PAHNAPLSIIGYIR\"`.\n\nWrite the code that will take a string and make this conversion given a number of rows.",
      functionName: "convert",
      parameters: [
        { name: "s", type: "string", description: "Input string" },
        { name: "numRows", type: "number", description: "Number of rows in the zigzag" }
      ],
      returnType: "string",
      constraints: ["1 <= s.length <= 1000", "s consists of English letters, ',' and '.'.", "1 <= numRows <= 1000"],
      examples: [
        { input: "s = \"PAYPALISHIRING\", numRows = 3", output: "\"PAHNAPLSIIGYIR\"", explanation: "Read row by row." },
        { input: "s = \"PAYPALISHIRING\", numRows = 4", output: "\"PINALSIGYAHRPI\"", explanation: "4 rows zigzag." },
        { input: "s = \"A\", numRows = 1", output: "\"A\"", explanation: "Single row returns original string." }
      ],
      optimalSolution: `function convert(s, numRows) {\n  if (numRows === 1 || s.length <= numRows) return s;\n  const rows = Array.from({ length: numRows }, () => []);\n  let curRow = 0;\n  let goingDown = false;\n  for (const ch of s) {\n    rows[curRow].push(ch);\n    if (curRow === 0 || curRow === numRows - 1) goingDown = !goingDown;\n    curRow += goingDown ? 1 : -1;\n  }\n  return rows.map(r => r.join('')).join('');\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function convert(s, numRows) {\n  if (numRows === 1) return s;\n  let ret = '';\n  const cycleLen = 2 * numRows - 2;\n  for (let i = 0; i < numRows; i++) {\n    for (let j = 0; j + i < s.length; j += cycleLen) {\n      ret += s[j + i];\n      if (i !== 0 && i !== numRows - 1 && j + cycleLen - i < s.length) {\n        ret += s[j + cycleLen - i];\n      }\n    }\n  }\n  return ret;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Infinite bounce or crash when numRows === 1.",
        "String concatenation inside loop instead of array join."
      ],
      hints: [
        "Simulate moving a pointer down from row 0 to numRows - 1, then bounce up to row 0.",
        "Collect characters in an array of rows.",
        "Handle numRows === 1 edge case immediately."
      ],
      oracleFn: (s: string, numRows: number) => {
        if (numRows === 1 || s.length <= numRows) return s;
        const rows: string[][] = Array.from({ length: numRows }, () => []);
        let curRow = 0;
        let goingDown = false;
        for (const ch of s) {
          rows[curRow].push(ch);
          if (curRow === 0 || curRow === numRows - 1) goingDown = !goingDown;
          curRow += goingDown ? 1 : -1;
        }
        return rows.map(r => r.join('')).join('');
      },
      testCases: {
        functional: [
          ["PAYPALISHIRING", 3],
          ["PAYPALISHIRING", 4],
          ["A", 1],
          ["AB", 1]
        ],
        boundary: [
          ["HELLO", 5],
          ["WORLD", 10],
          ["", 3]
        ],
        adversarial: [
          ["ABCDEFGHIJKLMN", 2],
          ["ZIGZAGPATTERN", 5]
        ],
        stress: [
          ["A".repeat(80), 7],
          [Array.from({ length: 100 }, (_, i) => String.fromCharCode(65 + (i % 26))).join(''), 8]
        ]
      }
    }),

    // 478. Integer to Roman
    createProblem({
      num: 478,
      title: "Integer to Roman",
      slug: "integer-to-roman",
      level: 23,
      difficulty: "MEDIUM",
      topic: "Math / Hash Table / Strings",
      patternSlug: "advanced-design-intervals",
      estimatedTimeMin: 15,
      statement: "Roman numerals are represented by seven different symbols: `I` (1), `V` (5), `X` (10), `L` (50), `C` (100), `D` (500) and `M` (1000).\n\nSubtractive forms are used for:\n- `I` before `V` (4) and `X` (9)\n- `X` before `L` (40) and `C` (90)\n- `C` before `D` (400) and `M` (900)\n\nGiven an integer `num`, convert it to a roman numeral.",
      functionName: "intToRoman",
      parameters: [
        { name: "num", type: "number", description: "Positive integer to convert" }
      ],
      returnType: "string",
      constraints: ["1 <= num <= 3999"],
      examples: [
        { input: "num = 3749", output: "\"MMMDCCXLIX\"", explanation: "3000 = MMM, 700 = DCC, 40 = XL, 9 = IX." },
        { input: "num = 58", output: "\"LVIII\"", explanation: "50 = L, 8 = VIII." },
        { input: "num = 1994", output: "\"MCMXCIV\"", explanation: "1000 = M, 900 = CM, 90 = XC, 4 = IV." }
      ],
      optimalSolution: `function intToRoman(num) {\n  const val = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];\n  const sym = [\"M\", \"CM\", \"D\", \"CD\", \"C\", \"XC\", \"L\", \"XL\", \"X\", \"IX\", \"V\", \"IV\", \"I\"];\n  let res = '';\n  for (let i = 0; i < val.length; i++) {\n    while (num >= val[i]) {\n      num -= val[i];\n      res += sym[i];\n    }\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(1) since num <= 3999",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function intToRoman(num) {\n  const thousands = [\"\", \"M\", \"MM\", \"MMM\"];\n  const hundreds = [\"\", \"C\", \"CC\", \"CCC\", \"CD\", \"D\", \"DC\", \"DCC\", \"DCCC\", \"CM\"];\n  const tens = [\"\", \"X\", \"XX\", \"XXX\", \"XL\", \"L\", \"LX\", \"LXX\", \"LXXX\", \"XC\"];\n  const ones = [\"\", \"I\", \"II\", \"III\", \"IV\", \"V\", \"VI\", \"VII\", \"VIII\", \"IX\"];\n  return thousands[Math.floor(num / 1000)] + hundreds[Math.floor((num % 1000) / 100)] + tens[Math.floor((num % 100) / 10)] + ones[num % 10];\n}`,
      suboptimalTimeComplexity: "O(1)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: [
        "Missing subtractive symbols (4, 9, 40, 90, 400, 900).",
        "Assuming values can repeat 4 times (e.g., IIII instead of IV)."
      ],
      hints: [
        "Include the 6 subtractive forms alongside the standard 7 symbols in descending value order.",
        "Greedily subtract the largest symbol value that fits into num."
      ],
      oracleFn: (num: number) => {
        const val = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
        const sym = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
        let res = '';
        for (let i = 0; i < val.length; i++) {
          while (num >= val[i]) {
            num -= val[i];
            res += sym[i];
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [3749],
          [58],
          [1994],
          [3]
        ],
        boundary: [
          [1],
          [3999],
          [1000]
        ],
        adversarial: [
          [4],
          [9],
          [40],
          [90],
          [400],
          [900]
        ],
        stress: [
          [2421],
          [3888]
        ]
      }
    }),

    // 479. Roman to Integer
    createProblem({
      num: 479,
      title: "Roman to Integer",
      slug: "roman-to-integer",
      level: 23,
      difficulty: "EASY",
      topic: "Hash Table / Math / Strings",
      patternSlug: "advanced-design-intervals",
      estimatedTimeMin: 15,
      statement: "Given a roman numeral string `s`, convert it to an integer.",
      functionName: "romanToInt",
      parameters: [
        { name: "s", type: "string", description: "Roman numeral string" }
      ],
      returnType: "number",
      constraints: ["1 <= s.length <= 15", "s contains only the characters ('I', 'V', 'X', 'L', 'C', 'D', 'M')", "It is guaranteed that s is a valid roman numeral in the range [1, 3999]."],
      examples: [
        { input: "s = \"III\"", output: "3", explanation: "III = 3." },
        { input: "s = \"LVIII\"", output: "58", explanation: "L = 50, V= 5, III = 3." },
        { input: "s = \"MCMXCIV\"", output: "1994", explanation: "M = 1000, CM = 900, XC = 90 and IV = 4." }
      ],
      optimalSolution: `function romanToInt(s) {\n  const map = { 'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000 };\n  let sum = 0;\n  for (let i = 0; i < s.length; i++) {\n    const cur = map[s[i]];\n    const next = map[s[i + 1]] || 0;\n    if (cur < next) {\n      sum -= cur;\n    } else {\n      sum += cur;\n    }\n  }\n  return sum;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function romanToInt(s) {\n  const s2 = s.replace(/IV/g, 'IIII').replace(/IX/g, 'VIIII').replace(/XL/g, 'XXXX').replace(/XC/g, 'LXXXX').replace(/CD/g, 'CCCC').replace(/CM/g, 'DCCCC');\n  const map = { 'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000 };\n  let sum = 0;\n  for (const ch of s2) sum += map[ch];\n  return sum;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Adding the current character value without checking if the next character has a larger value.",
        "Index out of bounds on s[i + 1]."
      ],
      hints: [
        "If a smaller value appears before a larger value (like I before V), subtract it.",
        "Otherwise, add it."
      ],
      oracleFn: (s: string) => {
        const map: Record<string, number> = { 'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000 };
        let sum = 0;
        for (let i = 0; i < s.length; i++) {
          const cur = map[s[i]];
          const next = map[s[i + 1]] || 0;
          if (cur < next) {
            sum -= cur;
          } else {
            sum += cur;
          }
        }
        return sum;
      },
      testCases: {
        functional: [
          ["III"],
          ["LVIII"],
          ["MCMXCIV"],
          ["MMMDCCXLIX"]
        ],
        boundary: [
          ["I"],
          ["MMMCMXCIX"],
          ["M"]
        ],
        adversarial: [
          ["IV"],
          ["IX"],
          ["XL"],
          ["XC"],
          ["CD"],
          ["CM"]
        ],
        stress: [
          ["MMMDCCCLXXXVIII"]
        ]
      }
    }),

    // 480. Count and Say
    createProblem({
      num: 480,
      title: "Count and Say",
      slug: "count-and-say",
      level: 23,
      difficulty: "MEDIUM",
      topic: "Strings / Simulation",
      patternSlug: "advanced-design-intervals",
      estimatedTimeMin: 20,
      statement: "The count-and-say sequence is a sequence of digit strings defined by the recursive formula:\n- `countAndSay(1) = \"1\"`\n- `countAndSay(n)` is the run-length encoding of `countAndSay(n - 1)`.\n\nGiven a positive integer `n`, return the `n-th` element of the count-and-say sequence.",
      functionName: "countAndSay",
      parameters: [
        { name: "n", type: "number", description: "Term in the sequence" }
      ],
      returnType: "string",
      constraints: ["1 <= n <= 30"],
      examples: [
        { input: "n = 1", output: "\"1\"", explanation: "Base case." },
        { input: "n = 4", output: "\"1211\"", explanation: "countAndSay(1) = '1', countAndSay(2) = '11', countAndSay(3) = '21', countAndSay(4) = '1211'." }
      ],
      optimalSolution: `function countAndSay(n) {\n  let cur = '1';\n  for (let i = 2; i <= n; i++) {\n    let next = '';\n    let count = 1;\n    for (let j = 0; j < cur.length; j++) {\n      if (j + 1 < cur.length && cur[j] === cur[j + 1]) {\n        count++;\n      } else {\n        next += count.toString() + cur[j];\n        count = 1;\n      }\n    }\n    cur = next;\n  }\n  return cur;\n}`,
      optimalTimeComplexity: "O(2^N)",
      optimalSpaceComplexity: "O(2^N)",
      suboptimalSolution: `function countAndSay(n) {\n  if (n === 1) return '1';\n  const prev = countAndSay(n - 1);\n  return prev.replace(/(.)\\1*/g, match => match.length + match[0]);\n}`,
      suboptimalTimeComplexity: "O(2^N)",
      suboptimalSpaceComplexity: "O(2^N)",
      commonMistakes: [
        "Failing to record the final run at the end of the string.",
        "Incorrect 1-based indexing for sequence term n."
      ],
      hints: [
        "Iterate from 1 to n.",
        "Perform run-length encoding on the current string to generate the next string."
      ],
      oracleFn: (n: number) => {
        let cur = '1';
        for (let i = 2; i <= n; i++) {
          let next = '';
          let count = 1;
          for (let j = 0; j < cur.length; j++) {
            if (j + 1 < cur.length && cur[j] === cur[j + 1]) {
              count++;
            } else {
              next += count.toString() + cur[j];
              count = 1;
            }
          }
          cur = next;
        }
        return cur;
      },
      testCases: {
        functional: [
          [1],
          [2],
          [3],
          [4],
          [5]
        ],
        boundary: [
          [1],
          [6],
          [7]
        ],
        adversarial: [
          [8],
          [9],
          [10]
        ],
        stress: [
          [15],
          [20]
        ]
      }
    }),

    // 481. Text Justification
    createProblem({
      num: 481,
      title: "Text Justification",
      slug: "text-justification",
      level: 23,
      difficulty: "HARD",
      topic: "Strings / Simulation",
      patternSlug: "advanced-design-intervals",
      estimatedTimeMin: 35,
      statement: "Given an array of strings `words` and a width `maxWidth`, format the text such that each line has exactly `maxWidth` characters and is fully (left and right) justified.\n\nYou should pack your words in a greedy approach; that is, pack as many words as you can in each line. Pad extra spaces `' '` when necessary so that each line has exactly `maxWidth` characters.\n\nExtra spaces between words should be distributed as evenly as possible. If the number of spaces on a line does not divide evenly between words, the empty slots on the left will be assigned more spaces than the slots on the right.\n\nFor the last line of text, it should be left-justified, and no extra space is inserted between words.",
      functionName: "fullJustify",
      parameters: [
        { name: "words", type: "string[]", description: "Array of words" },
        { name: "maxWidth", type: "number", description: "Target line width" }
      ],
      returnType: "string[]",
      constraints: ["1 <= words.length <= 300", "1 <= words[i].length <= 20", "words[i] consists of only English letters and symbols.", "1 <= maxWidth <= 100", "words[i].length <= maxWidth"],
      examples: [
        { input: "words = [\"This\", \"is\", \"an\", \"example\", \"of\", \"text\", \"justification.\"], maxWidth = 16", output: "[\"This    is    an\",\"example  of text\",\"justification.  \"]", explanation: "Line 1: 16 chars, line 2: 16 chars, line 3 left-justified with trailing spaces." },
        { input: "words = [\"What\",\"must\",\"be\",\"acknowledgment\",\"shall\",\"be\"], maxWidth = 16", output: "[\"What   must   be\",\"acknowledgment  \",\"shall be        \"]", explanation: "Formatted with 16 characters per row." },
        { input: "words = [\"Science\",\"is\",\"what\",\"we\",\"understand\",\"well\",\"enough\",\"to\",\"explain\",\"to\",\"a\",\"computer.\"], maxWidth = 20", output: "[\"Science  is  what we\",\"understand      well\",\"enough to explain to\",\"a computer.         \"]", explanation: "Note that the last line has trailing spaces." }
      ],
      optimalSolution: `function fullJustify(words, maxWidth) {\n  const res = [];\n  let i = 0;\n  while (i < words.length) {\n    let j = i;\n    let len = 0;\n    while (j < words.length && len + words[j].length + (j - i) <= maxWidth) {\n      len += words[j].length;\n      j++;\n    }\n    const numWords = j - i;\n    const totalSpaces = maxWidth - len;\n    let line = '';\n    if (numWords === 1 || j === words.length) {\n      line = words.slice(i, j).join(' ');\n      line += ' '.repeat(maxWidth - line.length);\n    } else {\n      const baseSpaces = Math.floor(totalSpaces / (numWords - 1));\n      const extraSpaces = totalSpaces % (numWords - 1);\n      for (let k = i; k < j; k++) {\n        line += words[k];\n        if (k < j - 1) {\n          const spacesToApply = baseSpaces + (k - i < extraSpaces ? 1 : 0);\n          line += ' '.repeat(spacesToApply);\n        }\n      }\n    }\n    res.push(line);\n    i = j;\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(Total characters)",
      optimalSpaceComplexity: "O(Total characters)",
      suboptimalSolution: `function fullJustify(words, maxWidth) {\n  const lines = [];\n  let cur = [];\n  let curLen = 0;\n  for (const w of words) {\n    if (curLen + w.length + cur.length > maxWidth) {\n      lines.push([...cur]);\n      cur = [w];\n      curLen = w.length;\n    } else {\n      cur.push(w);\n      curLen += w.length;\n    }\n  }\n  if (cur.length) lines.push(cur);\n  return lines.map((line, idx) => {\n    if (idx === lines.length - 1 || line.length === 1) {\n      const s = line.join(' ');\n      return s + ' '.repeat(maxWidth - s.length);\n    }\n    const spacesNeeded = maxWidth - line.reduce((a, b) => a + b.length, 0);\n    const gaps = line.length - 1;\n    const base = Math.floor(spacesNeeded / gaps);\n    const rem = spacesNeeded % gaps;\n    let res = '';\n    for (let i = 0; i < line.length; i++) {\n      res += line[i];\n      if (i < gaps) res += ' '.repeat(base + (i < rem ? 1 : 0));\n    }\n    return res;\n  });\n}`,
      suboptimalTimeComplexity: "O(Total characters)",
      suboptimalSpaceComplexity: "O(Total characters)",
      commonMistakes: [
        "Failing to left-justify lines with only 1 word.",
        "Failing to left-justify the very last line.",
        "Incorrectly distributing modulo extra spaces."
      ],
      hints: [
        "Greedily determine how many words fit on the current line.",
        "Calculate total spaces = maxWidth - sum(word.length).",
        "If line has 1 word or is the last line: left-justify and pad trailing spaces.",
        "Otherwise, distribute spaces evenly, giving 1 extra space to leftmost gaps."
      ],
      oracleFn: (words: string[], maxWidth: number) => {
        const res: string[] = [];
        let i = 0;
        while (i < words.length) {
          let j = i;
          let len = 0;
          while (j < words.length && len + words[j].length + (j - i) <= maxWidth) {
            len += words[j].length;
            j++;
          }
          const numWords = j - i;
          const totalSpaces = maxWidth - len;
          let line = '';
          if (numWords === 1 || j === words.length) {
            line = words.slice(i, j).join(' ');
            line += ' '.repeat(maxWidth - line.length);
          } else {
            const baseSpaces = Math.floor(totalSpaces / (numWords - 1));
            const extraSpaces = totalSpaces % (numWords - 1);
            for (let k = i; k < j; k++) {
              line += words[k];
              if (k < j - 1) {
                const spacesToApply = baseSpaces + (k - i < extraSpaces ? 1 : 0);
                line += ' '.repeat(spacesToApply);
              }
            }
          }
          res.push(line);
          i = j;
        }
        return res;
      },
      testCases: {
        functional: [
          [["This", "is", "an", "example", "of", "text", "justification."], 16],
          [["What", "must", "be", "acknowledgment", "shall", "be"], 16],
          [["Science", "is", "what", "we", "understand", "well", "enough", "to", "explain", "to", "a", "computer."], 20],
          [["Listen", "to", "many,", "speak", "to", "a", "few."], 6]
        ],
        boundary: [
          [["a"], 1],
          [["a", "b", "c"], 1],
          [["hello"], 10],
          [["singleword"], 10]
        ],
        adversarial: [
          [["The", "important", "thing", "is", "not", "to", "stop", "questioning."], 15],
          [["give", "me", "my", "spaces", "back"], 12],
          [["even", "distribution", "check"], 14]
        ],
        stress: [
          [Array.from({ length: 40 }, (_, i) => `w${i}`), 30],
          [Array.from({ length: 50 }, (_, i) => (i % 2 === 0 ? "word" : "a")), 25]
        ]
      }
    }),

    // 482. Basic Calculator III
    createProblem({
      num: 482,
      title: "Basic Calculator III",
      slug: "basic-calculator-iii",
      level: 23,
      difficulty: "HARD",
      topic: "Stack / Parsing / Recursion",
      patternSlug: "advanced-design-intervals",
      estimatedTimeMin: 35,
      statement: "Implement a basic calculator to evaluate a simple expression string.\n\nThe expression string may contain open `(` and closing parentheses `)`, the plus `+` or minus sign `-`, non-negative integers and empty spaces ` `.\n\nThe expression string contains only non-negative integers, `'+'`, `'-'`, `'*'`, `'/'` operators, and open `'('` and closing `')'` parentheses. All intermediate operations will be in the range of `[-2^31, 2^31 - 1]`.\n\nNote: You are not allowed to use any built-in `eval()` function.",
      functionName: "calculate",
      parameters: [
        { name: "s", type: "string", description: "Mathematical expression string" }
      ],
      returnType: "number",
      constraints: ["1 <= s.length <= 10^4", "s consists of digits, '+', '-', '*', '/', '(', ')', and ' '."],
      examples: [
        { input: "s = \"1+1\"", output: "2", explanation: "1 + 1 = 2." },
        { input: "s = \"6-4/2\"", output: "4", explanation: "4 / 2 = 2, 6 - 2 = 4." },
        { input: "s = \"2*(5+5*2)/3+(6/2+8)\"", output: "21", explanation: "Follows standard operator precedence." }
      ],
      optimalSolution: `function calculate(s) {\n  let i = 0;\n  const helper = () => {\n    const stack = [];\n    let num = 0;\n    let op = '+';\n    while (i < s.length) {\n      const ch = s[i++];\n      if (ch >= '0' && ch <= '9') {\n        num = num * 10 + (ch.charCodeAt(0) - 48);\n      }\n      if (ch === '(') {\n        num = helper();\n      }\n      if ((ch < '0' || ch > '9') && ch !== ' ' || i === s.length) {\n        if (op === '+') stack.push(num);\n        else if (op === '-') stack.push(-num);\n        else if (op === '*') stack.push(stack.pop() * num);\n        else if (op === '/') stack.push(Math.trunc(stack.pop() / num));\n        op = ch;\n        num = 0;\n      }\n      if (ch === ')') break;\n    }\n    return stack.reduce((a, b) => a + b, 0);\n  };\n  return helper();\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function calculate(s) {\n  return Function('\"use strict\"; return (' + s + ')')();\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Using Math.floor instead of Math.trunc for division with negative numbers (e.g. -3 / 2 truncates to -1, whereas floor is -2).",
        "Not resetting num to 0 after pushing to stack."
      ],
      hints: [
        "Use recursion whenever encountering '(' to evaluate the sub-expression within parentheses.",
        "Maintain a stack of terms to sum at the end.",
        "For '*' and '/' immediately pop the stack top, apply the operator with the current number, and push back."
      ],
      oracleFn: (s: string) => {
        let i = 0;
        const helper = (): number => {
          const stack: number[] = [];
          let num = 0;
          let op = '+';
          while (i < s.length) {
            const ch = s[i++];
            if (ch >= '0' && ch <= '9') {
              num = num * 10 + (ch.charCodeAt(0) - 48);
            }
            if (ch === '(') {
              num = helper();
            }
            if ((ch < '0' || ch > '9') && ch !== ' ' || i === s.length) {
              if (op === '+') stack.push(num);
              else if (op === '-') stack.push(-num);
              else if (op === '*') stack.push(stack.pop()! * num);
              else if (op === '/') stack.push(Math.trunc(stack.pop()! / num));
              op = ch;
              num = 0;
            }
            if (ch === ')') break;
          }
          return stack.reduce((a, b) => a + b, 0);
        };
        return helper();
      },
      testCases: {
        functional: [
          ["1+1"],
          ["6-4/2"],
          ["2*(5+5*2)/3+(6/2+8)"],
          ["(2+6*3+5-(3*14/7+2)*5)+3"]
        ],
        boundary: [
          ["0"],
          ["42"],
          ["(1)"]
        ],
        adversarial: [
          ["14/3*2"],
          ["100 - ( 20 + 30 ) * 2"],
          ["((1+2)*(3+4))"]
        ],
        stress: [
          ["1+" + Array.from({ length: 40 }, () => "1").join('+')],
          ["(" + "(".repeat(20) + "5" + ")".repeat(20) + ")"]
        ]
      }
    }),

    // 483. Decode Ways II
    createProblem({
      num: 483,
      title: "Decode Ways II",
      slug: "decode-ways-ii",
      level: 23,
      difficulty: "HARD",
      topic: "Dynamic Programming",
      patternSlug: "advanced-design-intervals",
      estimatedTimeMin: 35,
      statement: "A message containing letters from `A-Z` can be encoded into numbers using the mapping `A` -> 1, ..., `Z` -> 26.\n\nTo decode an encoded message, all the digits must be grouped then mapped back into letters. In addition to the digits `1-9`, the encoded message may also contain the character `'*'`, which can represent any digit from `1` to `9` (`'0'` is not allowed).\n\nGiven a string `s` consisting of digits and `'*'`, return the number of ways to decode it modulo `10^9 + 7`.",
      functionName: "numDecodings",
      parameters: [
        { name: "s", type: "string", description: "Encoded string with digits and '*'" }
      ],
      returnType: "number",
      constraints: ["1 <= s.length <= 10^5", "s[i] is a digit or '*'."],
      examples: [
        { input: "s = \"*\"", output: "9", explanation: "'*' can be any of 1..9, mapping to A..I." },
        { input: "s = \"1*\"", output: "18", explanation: "'1*' can be 11..19 (9 ways) or '1' followed by '*' (9 ways) -> 18 total." },
        { input: "s = \"2*\"", output: "15", explanation: "20..26 is 6 ways (since 27..29 are invalid) plus 2 and * (9 ways) -> 15." }
      ],
      optimalSolution: `function numDecodings(s) {\n  const MOD = 1000000007n;\n  let e0 = 1n, e1 = 0n, e2 = 0n;\n  for (const c of s) {\n    let f0 = 0n, f1 = 0n, f2 = 0n;\n    if (c === '*') {\n      f0 = 9n * e0 + 9n * e1 + 6n * e2;\n      f1 = e0;\n      f2 = e0;\n    } else {\n      const d = BigInt(c);\n      f0 = (d > 0n ? e0 : 0n) + e1 + (d <= 6n ? e2 : 0n);\n      f1 = d === 1n ? e0 : 0n;\n      f2 = d === 2n ? e0 : 0n;\n    }\n    e0 = f0 % MOD;\n    e1 = f1 % MOD;\n    e2 = f2 % MOD;\n  }\n  return Number(e0);\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function numDecodings(s) {\n  const MOD = 1000000007;\n  const dp = new Array(s.length + 1).fill(0);\n  dp[0] = 1;\n  // Standard DP array\n  for (let i = 1; i <= s.length; i++) {\n    // compute dp[i]\n  }\n  return dp[s.length];\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Integer overflow if not taking modulo at each step.",
        "Missing that '*' cannot represent '0'."
      ],
      hints: [
        "Track the number of valid decodings ending with: any character (e0), ending with '1' (e1), and ending with '2' (e2).",
        "Transition based on whether the current character is '*' or a digit 0-9."
      ],
      oracleFn: (s: string) => {
        const MOD = 1000000007n;
        let e0 = 1n, e1 = 0n, e2 = 0n;
        for (const c of s) {
          let f0 = 0n, f1 = 0n, f2 = 0n;
          if (c === '*') {
            f0 = 9n * e0 + 9n * e1 + 6n * e2;
            f1 = e0;
            f2 = e0;
          } else {
            const d = BigInt(c);
            f0 = (d > 0n ? e0 : 0n) + e1 + (d <= 6n ? e2 : 0n);
            f1 = d === 1n ? e0 : 0n;
            f2 = d === 2n ? e0 : 0n;
          }
          e0 = f0 % MOD;
          e1 = f1 % MOD;
          e2 = f2 % MOD;
        }
        return Number(e0);
      },
      testCases: {
        functional: [
          ["*"],
          ["1*"],
          ["2*"],
          ["**"]
        ],
        boundary: [
          ["0"],
          ["1"],
          ["7*"]
        ],
        adversarial: [
          ["*1*1*0"],
          ["104"],
          ["283"]
        ],
        stress: [
          ["*".repeat(40)],
          ["12".repeat(25)]
        ]
      }
    }),

    // 484. Minimum Number of Refueling Stops
    createProblem({
      num: 484,
      title: "Minimum Number of Refueling Stops",
      slug: "minimum-number-of-refueling-stops",
      level: 23,
      difficulty: "HARD",
      topic: "Greedy / Heap / Dynamic Programming",
      patternSlug: "advanced-design-intervals",
      estimatedTimeMin: 30,
      statement: "A car travels from a starting position to a destination which is `target` miles east of the starting position.\n\nAlong the way, there are gas stations. Each `station[i] = [positioni, fueli]` represents a gas station that is `positioni` miles east of the starting position, and has `fueli` liters of gas.\n\nThe car starts with an infinite tank for gas, which initially has `startFuel` liters of fuel in it. It uses one liter of gas per one mile that it drives. When the car reaches a gas station, it may stop and refuel, transferring all the gas from the station into the car.\n\nReturn the minimum number of refueling stops the car must make in order to reach its destination. If it cannot reach the destination, return `-1`.",
      functionName: "minRefuelStops",
      parameters: [
        { name: "target", type: "number", description: "Destination miles" },
        { name: "startFuel", type: "number", description: "Initial fuel" },
        { name: "stations", type: "number[][]", description: "Gas stations [position, fuel]" }
      ],
      returnType: "number",
      constraints: ["1 <= target, startFuel <= 10^9", "0 <= stations.length <= 500", "1 <= positioni < positioni+1 < target", "1 <= fueli <= 10^9"],
      examples: [
        { input: "target = 1, startFuel = 1, stations = []", output: "0", explanation: "Can reach target without any stops." },
        { input: "target = 100, startFuel = 1, stations = [[10,100]]", output: "-1", explanation: "Cannot even reach first station at mile 10." },
        { input: "target = 100, startFuel = 10, stations = [[10,60],[20,30],[30,30],[60,40]]", output: "2", explanation: "Stop at station 1 and station 4 to reach target with 2 stops." }
      ],
      optimalSolution: `function minRefuelStops(target, startFuel, stations) {\n  const maxHeap = [];\n  let curFuel = startFuel;\n  let stops = 0;\n  let i = 0;\n  while (curFuel < target) {\n    while (i < stations.length && stations[i][0] <= curFuel) {\n      maxHeap.push(stations[i][1]);\n      maxHeap.sort((a, b) => a - b);\n      i++;\n    }\n    if (maxHeap.length === 0) return -1;\n    curFuel += maxHeap.pop();\n    stops++;\n  }\n  return stops;\n}`,
      optimalTimeComplexity: "O(N log N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function minRefuelStops(target, startFuel, stations) {\n  const n = stations.length;\n  const dp = new Array(n + 1).fill(0);\n  dp[0] = startFuel;\n  for (let i = 0; i < n; i++) {\n    for (let t = i; t >= 0; t--) {\n      if (dp[t] >= stations[i][0]) {\n        dp[t + 1] = Math.max(dp[t + 1], dp[t] + stations[i][1]);\n      }\n    }\n  }\n  for (let t = 0; t <= n; t++) {\n    if (dp[t] >= target) return t;\n  }\n  return -1;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Greedily stopping at every station instead of choosing the largest fuel among all reachable stations.",
        "Not checking if current fuel is already sufficient to reach the target without refueling."
      ],
      hints: [
        "Drive as far as you can with current fuel.",
        "Store all passed gas stations in a Max Heap.",
        "Whenever out of fuel, pop the station with the largest fuel capacity."
      ],
      oracleFn: (target: number, startFuel: number, stations: number[][]) => {
        const maxHeap: number[] = [];
        let curFuel = startFuel;
        let stops = 0;
        let i = 0;
        while (curFuel < target) {
          while (i < stations.length && stations[i][0] <= curFuel) {
            maxHeap.push(stations[i][1]);
            maxHeap.sort((a, b) => a - b);
            i++;
          }
          if (maxHeap.length === 0) return -1;
          curFuel += maxHeap.pop()!;
          stops++;
        }
        return stops;
      },
      testCases: {
        functional: [
          [1, 1, []],
          [100, 1, [[10, 100]]],
          [100, 10, [[10, 60], [20, 30], [30, 30], [60, 40]]],
          [100, 50, [[25, 25], [50, 50]]]
        ],
        boundary: [
          [100, 100, []],
          [100, 50, [[50, 50]]],
          [50, 20, [[20, 20], [40, 20]]]
        ],
        adversarial: [
          [100, 25, [[25, 25], [50, 25], [75, 25]]],
          [1000, 10, [[10, 100], [110, 100], [210, 100], [310, 100]]],
          [100, 10, [[10, 10], [20, 10], [30, 10], [40, 10], [50, 10]]]
        ],
        stress: [
          [500, 10, Array.from({ length: 25 }, (_, i) => [(i + 1) * 15, 20])],
          [1000, 50, Array.from({ length: 30 }, (_, i) => [(i + 1) * 30, 40])]
        ]
      }
    }),

    // 485. Eliminate Maximum Number of Monsters
    createProblem({
      num: 485,
      title: "Eliminate Maximum Number of Monsters",
      slug: "eliminate-maximum-number-of-monsters",
      level: 23,
      difficulty: "MEDIUM",
      topic: "Greedy / Sorting",
      patternSlug: "advanced-design-intervals",
      estimatedTimeMin: 20,
      statement: "You are playing a video game where you are defending your city from a group of `n` monsters. You are given a 0-indexed integer array `dist` of size `n`, where `dist[i]` is the initial distance in kilometers of the `i-th` monster from the city.\n\nThe monsters walk toward the city at constant speed. The speed of each monster is given to you in an integer array `speed` of size `n`, where `speed[i]` is the speed of the `i-th` monster in kilometers per minute.\n\nYou have a weapon that, once fully charged, can eliminate a single monster. However, the weapon takes one minute to recharge. The weapon is fully charged at the very start (minute 0).\n\nYou lose when any monster reaches your city (distance <= 0) at the start of any minute. If a monster reaches the city at the exact moment the weapon is charged, it counts as a loss.\n\nReturn the maximum number of monsters that you can eliminate before you lose, or `n` if you can eliminate all monsters before they reach the city.",
      functionName: "eliminateMaximum",
      parameters: [
        { name: "dist", type: "number[]", description: "Initial distances of monsters" },
        { name: "speed", type: "number[]", description: "Speed of each monster" }
      ],
      returnType: "number",
      constraints: ["n == dist.length == speed.length", "1 <= n <= 10^5", "1 <= dist[i], speed[i] <= 10^5"],
      examples: [
        { input: "dist = [1,3,4], speed = [1,1,1]", output: "3", explanation: "Minute 0: eliminate monster 0. Minute 1: eliminate monster 1. Minute 2: eliminate monster 2." },
        { input: "dist = [1,1,2,3], speed = [1,1,1,1]", output: "1", explanation: "Monster 0 and 1 arrive at minute 1. At min 0 kill one, min 1 other reaches city and game over." },
        { input: "dist = [3,2,4], speed = [5,3,2]", output: "1", explanation: "Arrival times: 3/5 = 0.6, 2/3 = 0.67, 4/2 = 2.0. Lose at minute 1." }
      ],
      optimalSolution: `function eliminateMaximum(dist, speed) {\n  const arrival = [];\n  for (let i = 0; i < dist.length; i++) {\n    arrival.push(dist[i] / speed[i]);\n  }\n  arrival.sort((a, b) => a - b);\n  for (let i = 0; i < arrival.length; i++) {\n    if (arrival[i] <= i) return i;\n  }\n  return arrival.length;\n}`,
      optimalTimeComplexity: "O(N log N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function eliminateMaximum(dist, speed) {\n  const arrival = dist.map((d, i) => Math.ceil(d / speed[i])).sort((a, b) => a - b);\n  for (let i = 0; i < arrival.length; i++) {\n    if (arrival[i] <= i) return i;\n  }\n  return arrival.length;\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Ceiling vs float division: if arrival time is exactly 0.5 minute, it arrives before minute 1.",
        "Off-by-one check: monster arriving at time <= i causes immediate loss."
      ],
      hints: [
        "Calculate the arrival time of each monster: dist[i] / speed[i].",
        "Sort arrival times in ascending order.",
        "You eliminate monster i at minute i. If arrival[i] <= i, you lose."
      ],
      oracleFn: (dist: number[], speed: number[]) => {
        const arrival: number[] = [];
        for (let i = 0; i < dist.length; i++) {
          arrival.push(dist[i] / speed[i]);
        }
        arrival.sort((a, b) => a - b);
        for (let i = 0; i < arrival.length; i++) {
          if (arrival[i] <= i) return i;
        }
        return arrival.length;
      },
      testCases: {
        functional: [
          [[1, 3, 4], [1, 1, 1]],
          [[1, 1, 2, 3], [1, 1, 1, 1]],
          [[3, 2, 4], [5, 3, 2]],
          [[4, 2, 3], [2, 1, 1]]
        ],
        boundary: [
          [[1], [1]],
          [[5], [10]],
          [[10, 10], [1, 1]]
        ],
        adversarial: [
          [[3, 5, 7, 4, 5], [2, 3, 6, 3, 2]],
          [[1, 2, 3], [3, 2, 1]]
        ],
        stress: [
          [Array.from({ length: 60 }, (_, i) => i + 1), Array.from({ length: 60 }, () => 1)],
          [Array.from({ length: 80 }, () => 100), Array.from({ length: 80 }, () => 2)]
        ]
      }
    }),

    // 486. Car Pooling
    createProblem({
      num: 486,
      title: "Car Pooling",
      slug: "car-pooling",
      level: 23,
      difficulty: "MEDIUM",
      topic: "Difference Array / Intervals",
      patternSlug: "advanced-design-intervals",
      estimatedTimeMin: 20,
      statement: "There is a car with `capacity` empty seats. The vehicle only drives east (i.e. it cannot turn around and drive west).\n\nYou are given the integer `capacity` and an array `trips` where `trips[i] = [numPassengersi, fromi, toi]` indicates that the `i-th` trip has `numPassengersi` passengers and the locations to pick them up and drop them off are `fromi` and `toi` respectively. The locations are given as the number of kilometers due east from the car's initial location.\n\nReturn `true` if it is possible to pick up and drop off all passengers for all the given trips, or `false` otherwise.",
      functionName: "carPooling",
      parameters: [
        { name: "trips", type: "number[][]", description: "Array of trips [passengers, from, to]" },
        { name: "capacity", type: "number", description: "Vehicle maximum capacity" }
      ],
      returnType: "boolean",
      constraints: ["1 <= trips.length <= 1000", "trips[i].length == 3", "1 <= numPassengersi <= 100", "0 <= fromi < toi <= 1000", "1 <= capacity <= 10^5"],
      examples: [
        { input: "trips = [[2,1,5],[3,3,7]], capacity = 4", output: "false", explanation: "At distance 3-5, 2 + 3 = 5 passengers > capacity 4." },
        { input: "trips = [[2,1,5],[3,3,7]], capacity = 5", output: "true", explanation: "Maximum passenger load is 5 <= capacity 5." },
        { input: "trips = [[2,1,5],[3,5,7]], capacity = 3", output: "true", explanation: "First passengers drop off at 5 before next passengers board." }
      ],
      optimalSolution: `function carPooling(trips, capacity) {\n  const delta = new Array(1001).fill(0);\n  for (const [num, from, to] of trips) {\n    delta[from] += num;\n    delta[to] -= num;\n  }\n  let current = 0;\n  for (let i = 0; i <= 1000; i++) {\n    current += delta[i];\n    if (current > capacity) return false;\n  }\n  return true;\n}`,
      optimalTimeComplexity: "O(N + 1001)",
      optimalSpaceComplexity: "O(1001)",
      suboptimalSolution: `function carPooling(trips, capacity) {\n  const events = [];\n  for (const [num, from, to] of trips) {\n    events.push([from, num]);\n    events.push([to, -num]);\n  }\n  events.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);\n  let cur = 0;\n  for (const [pos, delta] of events) {\n    cur += delta;\n    if (cur > capacity) return false;\n  }\n  return true;\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Subtracting drop-off at `to + 1` instead of `to` (passengers get off before or at `to`).",
        "Sorting events where pick-up happens before drop-off at the same location."
      ],
      hints: [
        "Since location indices are within [0, 1000], a difference array of length 1001 is optimal.",
        "Add passengers at `from`, subtract at `to`.",
        "Compute prefix sum; if any prefix exceeds capacity, return false."
      ],
      oracleFn: (trips: number[][], capacity: number) => {
        const delta = new Array(1001).fill(0);
        for (const [num, from, to] of trips) {
          delta[from] += num;
          delta[to] -= num;
        }
        let current = 0;
        for (let i = 0; i <= 1000; i++) {
          current += delta[i];
          if (current > capacity) return false;
        }
        return true;
      },
      testCases: {
        functional: [
          [[[2, 1, 5], [3, 3, 7]], 4],
          [[[2, 1, 5], [3, 3, 7]], 5],
          [[[2, 1, 5], [3, 5, 7]], 3],
          [[[3, 2, 7], [3, 7, 9], [8, 3, 9]], 11]
        ],
        boundary: [
          [[[1, 0, 1]], 1],
          [[[5, 0, 10]], 4],
          [[[5, 0, 10]], 5]
        ],
        adversarial: [
          [[[7, 1, 3], [3, 2, 5], [2, 3, 6]], 10],
          [[[9, 0, 1], [1, 1, 2]], 9]
        ],
        stress: [
          [Array.from({ length: 40 }, (_, i) => [2, i, i + 5]), 15]
        ]
      }
    }),

    // 487. Corporate Flight Bookings
    createProblem({
      num: 487,
      title: "Corporate Flight Bookings",
      slug: "corporate-flight-bookings",
      level: 23,
      difficulty: "MEDIUM",
      topic: "Difference Array / Prefix Sum",
      patternSlug: "advanced-design-intervals",
      estimatedTimeMin: 20,
      statement: "There are `n` flights that are labeled from `1` to `n`.\n\nYou are given an array of flight bookings `bookings`, where `bookings[i] = [firsti, lasti, seatsi]` represents a booking for flights `firsti` through `lasti` (inclusive) with `seatsi` seats reserved for each flight in the range.\n\nReturn an array `answer` of length `n`, where `answer[i]` is the total number of seats reserved for flight `i`.",
      functionName: "corpFlightBookings",
      parameters: [
        { name: "bookings", type: "number[][]", description: "List of [first, last, seats] ranges" },
        { name: "n", type: "number", description: "Number of flights" }
      ],
      returnType: "number[]",
      constraints: ["1 <= n <= 2 * 10^4", "1 <= bookings.length <= 2 * 10^4", "bookings[i].length == 3", "1 <= firsti <= lasti <= n", "1 <= seatsi <= 10^4"],
      examples: [
        { input: "bookings = [[1,2,10],[2,3,20],[2,5,25]], n = 5", output: "[10,55,45,25,25]", explanation: "Flight 1: 10, Flight 2: 10+20+25=55, Flight 3: 20+25=45, Flight 4: 25, Flight 5: 25." },
        { input: "bookings = [[1,2,10],[2,2,15]], n = 2", output: "[10,25]", explanation: "Flight 1 has 10, Flight 2 has 25." },
        { input: "bookings = [[1,3,5],[2,4,10],[3,5,15]], n = 5", output: "[5,15,30,25,15]", explanation: "Flight 1: 5, Flight 2: 5+10=15, Flight 3: 5+10+15=30, Flight 4: 10+15=25, Flight 5: 15." }
      ],
      optimalSolution: `function corpFlightBookings(bookings, n) {\n  const diff = new Array(n + 1).fill(0);\n  for (const [first, last, seats] of bookings) {\n    diff[first - 1] += seats;\n    diff[last] -= seats;\n  }\n  const res = new Array(n);\n  let cur = 0;\n  for (let i = 0; i < n; i++) {\n    cur += diff[i];\n    res[i] = cur;\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(B + N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function corpFlightBookings(bookings, n) {\n  const res = new Array(n).fill(0);\n  for (const [first, last, seats] of bookings) {\n    for (let i = first - 1; i < last; i++) {\n      res[i] += seats;\n    }\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(B * N)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: [
        "1-indexed to 0-indexed conversion off-by-one errors.",
        "Subtracting at `last - 1` instead of `last`."
      ],
      hints: [
        "Use a difference array of length n + 1.",
        "Add seats at index first - 1 and subtract seats at index last.",
        "Compute the running prefix sum across the difference array."
      ],
      oracleFn: (bookings: number[][], n: number) => {
        const diff = new Array(n + 1).fill(0);
        for (const [first, last, seats] of bookings) {
          diff[first - 1] += seats;
          diff[last] -= seats;
        }
        const res = new Array(n);
        let cur = 0;
        for (let i = 0; i < n; i++) {
          cur += diff[i];
          res[i] = cur;
        }
        return res;
      },
      testCases: {
        functional: [
          [[[1, 2, 10], [2, 3, 20], [2, 5, 25]], 5],
          [[[1, 2, 10], [2, 2, 15]], 2],
          [[[1, 4, 10]], 4],
          [[[1, 3, 5], [2, 4, 10], [3, 5, 15]], 5]
        ],
        boundary: [
          [[[1, 1, 5]], 1],
          [[[1, 3, 100]], 3],
          [[[1, 1, 10], [1, 1, 20]], 1],
          [[[1, 5, 1]], 5]
        ],
        adversarial: [
          [[[1, 5, 10], [2, 4, 20], [3, 3, 30]], 5],
          [[[1, 2, 10], [2, 3, 20]], 3],
          [[[1, 10, 5], [2, 9, 5], [3, 8, 5], [4, 7, 5]], 10]
        ],
        stress: [
          [Array.from({ length: 40 }, (_, i) => [i + 1, Math.min(50, i + 5), 10]), 50],
          [Array.from({ length: 50 }, (_, i) => [i + 1, 60, (i + 1) * 2]), 60]
        ]
      }
    }),

    // 488. My Calendar I (DESIGN)
    createProblem({
      num: 488,
      title: "My Calendar I",
      slug: "my-calendar-i",
      level: 23,
      difficulty: "MEDIUM",
      topic: "Design / Binary Search / Intervals",
      patternSlug: "advanced-design-intervals",
      estimatedTimeMin: 20,
      statement: "You are implementing a program to use as your calendar. We can add a new event if adding the event will not cause a double booking.\n\nA double booking happens when two events have some non-empty intersection (i.e., some moment is common to both events).\n\nThe event can be represented as a pair of integers `start` and `end` that represents a booking on the half-open interval `[start, end)`, the range of real numbers `x` such that `start <= x < end`.\n\nImplement the `MyCalendar` class:\n- `MyCalendar()` Initializes the calendar object.\n- `boolean book(int start, int end)` Returns `true` if the event can be added to the calendar successfully without causing a double booking. Otherwise, return `false` and do not add the event to the calendar.",
      executionModel: "DESIGN",
      functionName: "MyCalendar",
      parameters: [
        { name: "commands", type: "string[]", description: "Array of operations: ['MyCalendar', 'book']" },
        { name: "args", type: "any[]", description: "Arguments for each operation" }
      ],
      returnType: "any[]",
      starterTemplates: {
        javascript: `class MyCalendar {\n  constructor() {\n    // Initialize data structures\n  }\n  /**\n   * @param {number} start\n   * @param {number} end\n   * @return {boolean}\n   */\n  book(start, end) {}\n}\n`,
        typescript: `class MyCalendar {\n  constructor() {}\n  book(start: number, end: number): boolean { throw new Error("Not implemented"); }\n}\n`,
        python: `class MyCalendar:\n    def __init__(self):\n        pass\n    def book(self, start: int, end: int) -> bool:\n        pass\n`
      },
      constraints: ["0 <= start < end <= 10^9", "At most 1000 calls will be made to book."],
      examples: [
        {
          input: 'commands = ["MyCalendar","book","book","book"]\nargs = [[],[10,20],[15,25],[20,30]]',
          output: '[null,true,false,true]',
          explanation: "MyCalendar myCalendar = new MyCalendar();\nmyCalendar.book(10, 20); // return True\nmyCalendar.book(15, 25); // return False (overlaps with 10-20)\nmyCalendar.book(20, 30); // return True (adjacent intervals do not overlap)"
        },
        {
          input: 'commands = ["MyCalendar","book","book","book"]\nargs = [[],[47,50],[33,41],[39,45]]',
          output: '[null,true,true,false]',
          explanation: "Interval [39, 45) overlaps with already booked [33, 41) between 39 and 41, so it cannot be booked."
        },
        {
          input: 'commands = ["MyCalendar","book","book","book"]\nargs = [[],[10,20],[20,30],[30,40]]',
          output: '[null,true,true,true]',
          explanation: "Adjacent intervals sharing boundaries [10,20), [20,30), [30,40) do not cause double booking."
        }
      ],
      optimalSolution: `class MyCalendar {\n  constructor() {\n    this.intervals = [];\n  }\n  book(start, end) {\n    for (const [s, e] of this.intervals) {\n      if (Math.max(s, start) < Math.min(e, end)) return false;\n    }\n    this.intervals.push([start, end]);\n    return true;\n  }\n}`,
      optimalTimeComplexity: "O(N) per book call or O(log N) with balanced BST",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `class MyCalendar {\n  constructor() {\n    this.booked = [];\n  }\n  book(start, end) {\n    for (const [s, e] of this.booked) {\n      if (!(end <= s || start >= e)) return false;\n    }\n    this.booked.push([start, end]);\n    return true;\n  }\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Treating boundary equality as overlap (intervals are half-open [start, end), so [10, 20) and [20, 30) do not overlap).",
        "Inserting interval into calendar even when booking returns false."
      ],
      hints: [
        "Two half-open intervals [s1, e1) and [s2, e2) overlap if and only if max(s1, s2) < min(e1, e2).",
        "Maintain a list of existing bookings.",
        "Check each against [start, end) before inserting."
      ],
      oracleFn: (commands: string[], args: any[]) => {
        class RefMyCalendar {
          intervals: [number, number][] = [];
          book(start: number, end: number): boolean {
            for (const [s, e] of this.intervals) {
              if (Math.max(s, start) < Math.min(e, end)) return false;
            }
            this.intervals.push([start, end]);
            return true;
          }
        }
        let cal: RefMyCalendar | null = null;
        const res: any[] = [];
        for (let i = 0; i < commands.length; i++) {
          const cmd = commands[i];
          if (cmd === 'MyCalendar') {
            cal = new RefMyCalendar();
            res.push(null);
          } else if (cmd === 'book') {
            res.push(cal!.book(args[i][0], args[i][1]));
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [
            ["MyCalendar", "book", "book", "book"],
            [[], [10, 20], [15, 25], [20, 30]]
          ],
          [
            ["MyCalendar", "book", "book"],
            [[], [47, 50], [33, 41]]
          ],
          [
            ["MyCalendar", "book", "book", "book"],
            [[], [10, 20], [20, 30], [30, 40]]
          ],
          [
            ["MyCalendar", "book", "book", "book"],
            [[], [10, 20], [0, 10], [5, 15]]
          ]
        ],
        boundary: [
          [
            ["MyCalendar", "book"],
            [[], [0, 1000]]
          ],
          [
            ["MyCalendar", "book", "book"],
            [[], [10, 20], [20, 30]]
          ],
          [
            ["MyCalendar", "book", "book"],
            [[], [0, 1], [1, 2]]
          ]
        ],
        adversarial: [
          [
            ["MyCalendar", "book", "book", "book", "book"],
            [[], [10, 20], [5, 15], [15, 25], [20, 25]]
          ],
          [
            ["MyCalendar", "book", "book", "book", "book", "book"],
            [[], [20, 30], [10, 25], [25, 35], [5, 10], [30, 40]]
          ],
          [
            ["MyCalendar", "book", "book", "book"],
            [[], [10, 30], [15, 25], [5, 35]]
          ]
        ],
        stress: [
          [
            ["MyCalendar", ...Array.from({ length: 30 }, () => "book")],
            [[], ...Array.from({ length: 30 }, (_, i) => [i * 10, i * 10 + 5])]
          ],
          [
            ["MyCalendar", ...Array.from({ length: 40 }, () => "book")],
            [[], ...Array.from({ length: 40 }, (_, i) => [i * 5, i * 5 + 6])]
          ]
        ]
      }
    }),

    // 489. My Calendar II (DESIGN)
    createProblem({
      num: 489,
      title: "My Calendar II",
      slug: "my-calendar-ii",
      level: 23,
      difficulty: "MEDIUM",
      topic: "Design / Intervals",
      patternSlug: "advanced-design-intervals",
      estimatedTimeMin: 25,
      statement: "You are implementing a program to use as your calendar. We can add a new event if adding the event will not cause a triple booking.\n\nA triple booking happens when three events have some non-empty intersection (i.e., some moment is common to all the three events).\n\nImplement the `MyCalendarTwo` class:\n- `MyCalendarTwo()` Initializes the calendar object.\n- `boolean book(int start, int end)` Returns `true` if the event can be added to the calendar successfully without causing a triple booking. Otherwise, return `false` and do not add the event to the calendar.",
      executionModel: "DESIGN",
      functionName: "MyCalendarTwo",
      parameters: [
        { name: "commands", type: "string[]", description: "Array of operations: ['MyCalendarTwo', 'book']" },
        { name: "args", type: "any[]", description: "Arguments for each operation" }
      ],
      returnType: "any[]",
      starterTemplates: {
        javascript: `class MyCalendarTwo {\n  constructor() {\n    // Initialize data structures\n  }\n  /**\n   * @param {number} start\n   * @param {number} end\n   * @return {boolean}\n   */\n  book(start, end) {}\n}\n`,
        typescript: `class MyCalendarTwo {\n  constructor() {}\n  book(start: number, end: number): boolean { throw new Error("Not implemented"); }\n}\n`,
        python: `class MyCalendarTwo:\n    def __init__(self):\n        pass\n    def book(self, start: int, end: int) -> bool:\n        pass\n`
      },
      constraints: ["0 <= start < end <= 10^9", "At most 1000 calls will be made to book."],
      examples: [
        {
          input: 'commands = ["MyCalendarTwo","book","book","book","book","book","book"]\nargs = [[],[10,20],[50,60],[10,40],[5,15],[5,10],[25,55]]',
          output: '[null,true,true,true,false,true,true]',
          explanation: "Double bookings are permitted, but triple booking [5, 15) fails because [10, 15) is already double booked."
        },
        {
          input: 'commands = ["MyCalendarTwo","book","book","book"]\nargs = [[],[10,20],[20,30],[10,30]]',
          output: '[null,true,true,true]',
          explanation: "Adjacent intervals [10,20) and [20,30) do not overlap each other, so booking [10,30) creates two double bookings but no triple booking."
        },
        {
          input: 'commands = ["MyCalendarTwo","book","book","book","book"]\nargs = [[],[24,40],[43,50],[27,43],[5,21]]',
          output: '[null,true,true,true,true]',
          explanation: "All bookings succeed without any three intervals having a point in common."
        }
      ],
      optimalSolution: `class MyCalendarTwo {\n  constructor() {\n    this.bookings = [];\n    this.overlaps = [];\n  }\n  book(start, end) {\n    for (const [s, e] of this.overlaps) {\n      if (Math.max(s, start) < Math.min(e, end)) return false;\n    }\n    for (const [s, e] of this.bookings) {\n      if (Math.max(s, start) < Math.min(e, end)) {\n        this.overlaps.push([Math.max(s, start), Math.min(e, end)]);\n      }\n    }\n    this.bookings.push([start, end]);\n    return true;\n  }\n}`,
      optimalTimeComplexity: "O(N) per book call",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `class MyCalendarTwo {\n  constructor() {\n    this.delta = new Map();\n  }\n  book(start, end) {\n    this.delta.set(start, (this.delta.get(start) || 0) + 1);\n    this.delta.set(end, (this.delta.get(end) || 0) - 1);\n    const keys = Array.from(this.delta.keys()).sort((a, b) => a - b);\n    let active = 0;\n    for (const k of keys) {\n      active += this.delta.get(k);\n      if (active >= 3) {\n        this.delta.set(start, this.delta.get(start) - 1);\n        this.delta.set(end, this.delta.get(end) + 1);\n        return false;\n      }\n    }\n    return true;\n  }\n}`,
      suboptimalTimeComplexity: "O(N log N) per book call",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Inserting into `overlaps` before confirming that no triple booking will occur.",
        "Incorrectly calculating the intersection interval: should be [max(s, start), min(e, end))."
      ],
      hints: [
        "Maintain two lists: `bookings` (all single bookings) and `overlaps` (double-booked intervals).",
        "If the new booking overlaps with anything in `overlaps`, it would create a triple booking; return false.",
        "Otherwise, record the intersection with existing bookings into `overlaps` and add the new booking."
      ],
      oracleFn: (commands: string[], args: any[]) => {
        class RefMyCalendarTwo {
          bookings: [number, number][] = [];
          overlaps: [number, number][] = [];
          book(start: number, end: number): boolean {
            for (const [s, e] of this.overlaps) {
              if (Math.max(s, start) < Math.min(e, end)) return false;
            }
            for (const [s, e] of this.bookings) {
              if (Math.max(s, start) < Math.min(e, end)) {
                this.overlaps.push([Math.max(s, start), Math.min(e, end)]);
              }
            }
            this.bookings.push([start, end]);
            return true;
          }
        }
        let cal: RefMyCalendarTwo | null = null;
        const res: any[] = [];
        for (let i = 0; i < commands.length; i++) {
          const cmd = commands[i];
          if (cmd === 'MyCalendarTwo') {
            cal = new RefMyCalendarTwo();
            res.push(null);
          } else if (cmd === 'book') {
            res.push(cal!.book(args[i][0], args[i][1]));
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [
            ["MyCalendarTwo", "book", "book", "book", "book", "book", "book"],
            [[], [10, 20], [50, 60], [10, 40], [5, 15], [5, 10], [25, 55]]
          ],
          [
            ["MyCalendarTwo", "book", "book", "book"],
            [[], [10, 20], [20, 30], [10, 30]]
          ],
          [
            ["MyCalendarTwo", "book", "book", "book", "book"],
            [[], [24, 40], [43, 50], [27, 43], [5, 21]]
          ],
          [
            ["MyCalendarTwo", "book", "book", "book"],
            [[], [15, 25], [20, 30], [18, 22]]
          ]
        ],
        boundary: [
          [
            ["MyCalendarTwo", "book", "book"],
            [[], [1, 10], [1, 10]]
          ],
          [
            ["MyCalendarTwo", "book", "book", "book"],
            [[], [0, 5], [5, 10], [10, 15]]
          ],
          [
            ["MyCalendarTwo", "book"],
            [[], [0, 1000]]
          ]
        ],
        adversarial: [
          [
            ["MyCalendarTwo", "book", "book", "book"],
            [[], [20, 30], [20, 30], [20, 30]]
          ],
          [
            ["MyCalendarTwo", "book", "book", "book", "book"],
            [[], [10, 30], [10, 20], [15, 25], [20, 30]]
          ],
          [
            ["MyCalendarTwo", "book", "book", "book", "book"],
            [[], [30, 60], [10, 40], [20, 50], [0, 100]]
          ]
        ],
        stress: [
          [
            ["MyCalendarTwo", ...Array.from({ length: 25 }, () => "book")],
            [[], ...Array.from({ length: 25 }, (_, i) => [i * 5, i * 5 + 12])]
          ],
          [
            ["MyCalendarTwo", ...Array.from({ length: 30 }, () => "book")],
            [[], ...Array.from({ length: 30 }, (_, i) => [i * 2, i * 2 + 10])]
          ]
        ]
      }
    }),

    // 490. My Calendar III (DESIGN)
    createProblem({
      num: 490,
      title: "My Calendar III",
      slug: "my-calendar-iii",
      level: 23,
      difficulty: "HARD",
      topic: "Design / Line Sweep / Intervals",
      patternSlug: "advanced-design-intervals",
      estimatedTimeMin: 30,
      statement: "A `k-booking` happens when `k` events have some non-empty intersection (i.e., there is some time that is common to all `k` events).\n\nYou are given some events `[startTime, endTime)`, after each given event, return an integer `k` representing the maximum `k-booking` between all the previous events.\n\nImplement the `MyCalendarThree` class:\n- `MyCalendarThree()` Initializes the object.\n- `int book(int startTime, int endTime)` Returns an integer `k` representing the largest integer such that there exists a `k-booking` in the calendar.",
      executionModel: "DESIGN",
      functionName: "MyCalendarThree",
      parameters: [
        { name: "commands", type: "string[]", description: "Array of operations: ['MyCalendarThree', 'book']" },
        { name: "args", type: "any[]", description: "Arguments for each operation" }
      ],
      returnType: "any[]",
      starterTemplates: {
        javascript: `class MyCalendarThree {\n  constructor() {\n    // Initialize data structures\n  }\n  /**\n   * @param {number} startTime\n   * @param {number} endTime\n   * @return {number}\n   */\n  book(startTime, endTime) {}\n}\n`,
        typescript: `class MyCalendarThree {\n  constructor() {}\n  book(startTime: number, endTime: number): number { throw new Error("Not implemented"); }\n}\n`,
        python: `class MyCalendarThree:\n    def __init__(self):\n        pass\n    def book(self, startTime: int, endTime: int) -> int:\n        pass\n`
      },
      constraints: ["0 <= startTime < endTime <= 10^9", "At most 400 calls will be made to book."],
      examples: [
        {
          input: 'commands = ["MyCalendarThree","book","book","book","book","book","book"]\nargs = [[],[10,20],[50,60],[10,40],[5,15],[5,10],[25,55]]',
          output: '[null,1,1,2,3,3,3]',
          explanation: "Returns the maximum number of concurrent bookings at any moment."
        },
        {
          input: 'commands = ["MyCalendarThree","book","book","book"]\nargs = [[],[10,20],[20,30],[30,40]]',
          output: '[null,1,1,1]',
          explanation: "Adjacent non-overlapping intervals result in a maximum k-booking of 1."
        },
        {
          input: 'commands = ["MyCalendarThree","book","book","book","book"]\nargs = [[],[1,10],[2,9],[3,8],[4,7]]',
          output: '[null,1,2,3,4]',
          explanation: "Each nested interval increases the concurrent overlap count, reaching 4."
        }
      ],
      optimalSolution: `class MyCalendarThree {\n  constructor() {\n    this.delta = new Map();\n  }\n  book(startTime, endTime) {\n    this.delta.set(startTime, (this.delta.get(startTime) || 0) + 1);\n    this.delta.set(endTime, (this.delta.get(endTime) || 0) - 1);\n    let maxK = 0;\n    let cur = 0;\n    const keys = Array.from(this.delta.keys()).sort((a, b) => a - b);\n    for (const k of keys) {\n      cur += this.delta.get(k);\n      if (cur > maxK) maxK = cur;\n    }\n    return maxK;\n  }\n}`,
      optimalTimeComplexity: "O(N log N) per book call with line sweep or O(N) with Segment Tree",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `class MyCalendarThree {\n  constructor() {\n    this.events = [];\n  }\n  book(startTime, endTime) {\n    this.events.push([startTime, endTime]);\n    const times = [];\n    for (const [s, e] of this.events) { times.push(s); times.push(e); }\n    let maxK = 0;\n    for (const t of times) {\n      let count = 0;\n      for (const [s, e] of this.events) {\n        if (s <= t && t < e) count++;\n      }\n      if (count > maxK) maxK = count;\n    }\n    return maxK;\n  }\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Forgetting to sort the time keys in ascending order before taking prefix sum.",
        "Decrementing at endTime - 1 instead of endTime (intervals are half-open [s, e))."
      ],
      hints: [
        "This is the maximum overlap point problem.",
        "Use a boundary difference map: increment at startTime, decrement at endTime.",
        "Iterate over sorted keys and track maximum prefix sum."
      ],
      oracleFn: (commands: string[], args: any[]) => {
        class RefMyCalendarThree {
          delta = new Map<number, number>();
          book(startTime: number, endTime: number): number {
            this.delta.set(startTime, (this.delta.get(startTime) || 0) + 1);
            this.delta.set(endTime, (this.delta.get(endTime) || 0) - 1);
            let maxK = 0;
            let cur = 0;
            const keys = Array.from(this.delta.keys()).sort((a, b) => a - b);
            for (const k of keys) {
              cur += this.delta.get(k)!;
              if (cur > maxK) maxK = cur;
            }
            return maxK;
          }
        }
        let cal: RefMyCalendarThree | null = null;
        const res: any[] = [];
        for (let i = 0; i < commands.length; i++) {
          const cmd = commands[i];
          if (cmd === 'MyCalendarThree') {
            cal = new RefMyCalendarThree();
            res.push(null);
          } else if (cmd === 'book') {
            res.push(cal!.book(args[i][0], args[i][1]));
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [
            ["MyCalendarThree", "book", "book", "book", "book", "book", "book"],
            [[], [10, 20], [50, 60], [10, 40], [5, 15], [5, 10], [25, 55]]
          ],
          [
            ["MyCalendarThree", "book", "book", "book"],
            [[], [10, 20], [20, 30], [30, 40]]
          ],
          [
            ["MyCalendarThree", "book", "book", "book", "book"],
            [[], [1, 10], [2, 9], [3, 8], [4, 7]]
          ],
          [
            ["MyCalendarThree", "book", "book", "book"],
            [[], [10, 25], [15, 30], [5, 20]]
          ]
        ],
        boundary: [
          [
            ["MyCalendarThree", "book"],
            [[], [1, 2]]
          ],
          [
            ["MyCalendarThree", "book", "book"],
            [[], [1, 10], [10, 20]]
          ],
          [
            ["MyCalendarThree", "book", "book"],
            [[], [0, 100], [0, 100]]
          ]
        ],
        adversarial: [
          [
            ["MyCalendarThree", "book", "book", "book", "book"],
            [[], [1, 5], [2, 6], [3, 7], [4, 8]]
          ],
          [
            ["MyCalendarThree", "book", "book", "book", "book", "book"],
            [[], [2, 8], [3, 7], [4, 6], [1, 9], [5, 50]]
          ],
          [
            ["MyCalendarThree", "book", "book", "book", "book"],
            [[], [10, 20], [10, 20], [10, 20], [10, 20]]
          ]
        ],
        stress: [
          [
            ["MyCalendarThree", ...Array.from({ length: 20 }, () => "book")],
            [[], ...Array.from({ length: 20 }, (_, i) => [i, i + 10])]
          ],
          [
            ["MyCalendarThree", ...Array.from({ length: 25 }, () => "book")],
            [[], ...Array.from({ length: 25 }, (_, i) => [i * 3, i * 3 + 15])]
          ]
        ]
      }
    }),

    // 491. Range Module (DESIGN)
    createProblem({
      num: 491,
      title: "Range Module",
      slug: "range-module",
      level: 23,
      difficulty: "HARD",
      topic: "Design / Intervals / Binary Search",
      patternSlug: "advanced-design-intervals",
      estimatedTimeMin: 35,
      statement: "A Range Module is a module that tracks ranges of numbers. Design a data structure to track the ranges represented as half-open intervals and query about them.\n\nA half-open interval `[left, right)` denotes all the real numbers `x` where `left <= x < right`.\n\nImplement the `RangeModule` class:\n- `RangeModule()` Initializes the object of the data structure.\n- `void addRange(int left, int right)` Adds the half-open interval `[left, right)`, tracking every real number in that interval. Adding an interval that partially overlaps with currently tracked numbers should add any numbers in the interval `[left, right)` that are not already tracked.\n- `boolean queryRange(int left, int right)` Returns `true` if every real number in the interval `[left, right)` is currently being tracked, and `false` otherwise.\n- `void removeRange(int left, int right)` Stops tracking every real number currently being tracked in the half-open interval `[left, right)`.",
      executionModel: "DESIGN",
      functionName: "RangeModule",
      parameters: [
        { name: "commands", type: "string[]", description: "Array of operations: ['RangeModule', 'addRange', 'queryRange', 'removeRange']" },
        { name: "args", type: "any[]", description: "Arguments for each operation" }
      ],
      returnType: "any[]",
      starterTemplates: {
        javascript: `class RangeModule {\n  constructor() {\n    // Initialize data structures\n  }\n  /**\n   * @param {number} left\n   * @param {number} right\n   * @return {void}\n   */\n  addRange(left, right) {}\n  /**\n   * @param {number} left\n   * @param {number} right\n   * @return {boolean}\n   */\n  queryRange(left, right) {}\n  /**\n   * @param {number} left\n   * @param {number} right\n   * @return {void}\n   */\n  removeRange(left, right) {}\n}\n`,
        typescript: `class RangeModule {\n  constructor() {}\n  addRange(left: number, right: number): void {}\n  queryRange(left: number, right: number): boolean { throw new Error("Not implemented"); }\n  removeRange(left: number, right: number): void {}\n}\n`,
        python: `class RangeModule:\n    def __init__(self):\n        pass\n    def addRange(self, left: int, right: int) -> None:\n        pass\n    def queryRange(self, left: int, right: int) -> bool:\n        pass\n    def removeRange(self, left: int, right: int) -> None:\n        pass\n`
      },
      constraints: ["1 <= left < right <= 10^9", "At most 10^4 calls will be made to addRange, queryRange, and removeRange."],
      examples: [
        {
          input: 'commands = ["RangeModule","addRange","removeRange","queryRange","queryRange","queryRange"]\nargs = [[],[10,20],[14,16],[10,14],[13,15],[16,17]]',
          output: '[null,null,null,true,false,true]',
          explanation: "addRange(10, 20): [10, 20) is tracked.\nremoveRange(14, 16): [10, 14) and [16, 20) tracked.\nqueryRange(10, 14): returns true.\nqueryRange(13, 15): returns false (14-15 not tracked).\nqueryRange(16, 17): returns true."
        },
        {
          input: 'commands = ["RangeModule","addRange","queryRange","queryRange"]\nargs = [[],[10,20],[10,20],[10,21]]',
          output: '[null,null,true,false]',
          explanation: "queryRange([10,20)) returns true as it is fully contained. queryRange([10,21)) returns false as 20 is not tracked."
        },
        {
          input: 'commands = ["RangeModule","addRange","addRange","removeRange","queryRange"]\nargs = [[],[1,5],[10,15],[2,12],[1,2]]',
          output: '[null,null,null,null,true]',
          explanation: "Removing [2,12) leaves [1,2) and [12,15) intact."
        }
      ],
      optimalSolution: `class RangeModule {\n  constructor() {\n    this.intervals = [];\n  }\n  addRange(left, right) {\n    const next = [];\n    let inserted = false;\n    for (const [l, r] of this.intervals) {\n      if (r < left) {\n        next.push([l, r]);\n      } else if (right < l) {\n        if (!inserted) { next.push([left, right]); inserted = true; }\n        next.push([l, r]);\n      } else {\n        left = Math.min(left, l);\n        right = Math.max(right, r);\n      }\n    }\n    if (!inserted) next.push([left, right]);\n    this.intervals = next;\n  }\n  queryRange(left, right) {\n    let l = 0, r = this.intervals.length - 1;\n    while (l <= r) {\n      const mid = (l + r) >> 1;\n      if (this.intervals[mid][0] <= left && right <= this.intervals[mid][1]) return true;\n      if (this.intervals[mid][0] > left) r = mid - 1;\n      else l = mid + 1;\n    }\n    return false;\n  }\n  removeRange(left, right) {\n    const next = [];\n    for (const [l, r] of this.intervals) {\n      if (r <= left || l >= right) {\n        next.push([l, r]);\n      } else {\n        if (l < left) next.push([l, left]);\n        if (r > right) next.push([right, r]);\n      }\n    }\n    this.intervals = next;\n  }\n}`,
      optimalTimeComplexity: "O(N) for add and remove, O(log N) for query",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `class RangeModule {\n  constructor() {\n    this.intervals = [];\n  }\n  addRange(left, right) {\n    this.intervals.push([left, right]);\n    this.intervals.sort((a, b) => a[0] - b[0]);\n    // merge intervals\n  }\n  queryRange(left, right) {\n    return this.intervals.some(([l, r]) => l <= left && right <= r);\n  }\n  removeRange(left, right) {\n    // linear scan\n  }\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Not merging adjacent or overlapping intervals cleanly.",
        "Splitting intervals incorrectly on removeRange."
      ],
      hints: [
        "Maintain non-overlapping intervals in sorted order.",
        "In addRange, merge all intersecting intervals with [left, right).",
        "In removeRange, split any intersecting interval into up to two pieces.",
        "In queryRange, binary search for an interval containing [left, right)."
      ],
      oracleFn: (commands: string[], args: any[]) => {
        class RefRangeModule {
          intervals: [number, number][] = [];
          addRange(left: number, right: number) {
            const next: [number, number][] = [];
            let inserted = false;
            for (const [l, r] of this.intervals) {
              if (r < left) {
                next.push([l, r]);
              } else if (right < l) {
                if (!inserted) { next.push([left, right]); inserted = true; }
                next.push([l, r]);
              } else {
                left = Math.min(left, l);
                right = Math.max(right, r);
              }
            }
            if (!inserted) next.push([left, right]);
            this.intervals = next;
          }
          queryRange(left: number, right: number): boolean {
            let l = 0, r = this.intervals.length - 1;
            while (l <= r) {
              const mid = (l + r) >> 1;
              if (this.intervals[mid][0] <= left && right <= this.intervals[mid][1]) return true;
              if (this.intervals[mid][0] > left) r = mid - 1;
              else l = mid + 1;
            }
            return false;
          }
          removeRange(left: number, right: number) {
            const next: [number, number][] = [];
            for (const [l, r] of this.intervals) {
              if (r <= left || l >= right) {
                next.push([l, r]);
              } else {
                if (l < left) next.push([l, left]);
                if (r > right) next.push([right, r]);
              }
            }
            this.intervals = next;
          }
        }
        let rm: RefRangeModule | null = null;
        const res: any[] = [];
        for (let i = 0; i < commands.length; i++) {
          const cmd = commands[i];
          if (cmd === 'RangeModule') {
            rm = new RefRangeModule();
            res.push(null);
          } else if (cmd === 'addRange') {
            rm!.addRange(args[i][0], args[i][1]);
            res.push(null);
          } else if (cmd === 'queryRange') {
            res.push(rm!.queryRange(args[i][0], args[i][1]));
          } else if (cmd === 'removeRange') {
            rm!.removeRange(args[i][0], args[i][1]);
            res.push(null);
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [
            ["RangeModule", "addRange", "removeRange", "queryRange", "queryRange", "queryRange"],
            [[], [10, 20], [14, 16], [10, 14], [13, 15], [16, 17]]
          ],
          [
            ["RangeModule", "addRange", "queryRange"],
            [[], [1, 5], [2, 4]]
          ],
          [
            ["RangeModule", "addRange", "queryRange", "queryRange"],
            [[], [10, 20], [10, 20], [10, 21]]
          ],
          [
            ["RangeModule", "addRange", "addRange", "removeRange", "queryRange"],
            [[], [1, 5], [10, 15], [2, 12], [1, 2]]
          ]
        ],
        boundary: [
          [
            ["RangeModule", "queryRange"],
            [[], [1, 10]]
          ],
          [
            ["RangeModule", "addRange", "removeRange", "queryRange"],
            [[], [1, 10], [1, 10], [1, 10]]
          ],
          [
            ["RangeModule", "addRange", "removeRange", "queryRange"],
            [[], [5, 15], [0, 20], [5, 15]]
          ]
        ],
        adversarial: [
          [
            ["RangeModule", "addRange", "addRange", "addRange", "queryRange"],
            [[], [1, 3], [5, 7], [2, 6], [1, 7]]
          ],
          [
            ["RangeModule", "addRange", "removeRange", "queryRange", "queryRange"],
            [[], [10, 100], [20, 30], [10, 20], [20, 30]]
          ],
          [
            ["RangeModule", "addRange", "removeRange", "removeRange", "queryRange"],
            [[], [1, 50], [5, 10], [15, 20], [1, 5]]
          ]
        ],
        stress: [
          [
            ["RangeModule", ...Array.from({ length: 20 }, (_, i) => i % 2 === 0 ? "addRange" : "queryRange")],
            [[], ...Array.from({ length: 20 }, (_, i) => [i * 10, i * 10 + 8])]
          ],
          [
            ["RangeModule", ...Array.from({ length: 30 }, (_, i) => i % 3 === 0 ? "addRange" : (i % 3 === 1 ? "queryRange" : "removeRange"))],
            [[], ...Array.from({ length: 30 }, (_, i) => [i * 5, i * 5 + 10])]
          ]
        ]
      }
    }),

    // 492. The Skyline Problem
    createProblem({
      num: 492,
      title: "The Skyline Problem",
      slug: "the-skyline-problem",
      level: 23,
      difficulty: "HARD",
      topic: "Line Sweep / Heap / Divide and Conquer",
      patternSlug: "advanced-design-intervals",
      estimatedTimeMin: 35,
      statement: "A city's skyline is the outer contour of the silhouette formed by all the buildings in that city when viewed from a distance. Given the locations and heights of all the buildings, return the skyline formed by these buildings collectively.\n\nThe geometric information of each building is given in the array `buildings` where `buildings[i] = [lefti, righti, heighti]`.\n\nThe output is a list of 'key points' sorted by their x-coordinate in the form `[[x1, y1], [x2, y2], ...]`. There must be no consecutive horizontal lines of equal height.",
      functionName: "getSkyline",
      parameters: [
        { name: "buildings", type: "number[][]", description: "Array of [left, right, height] for each building" }
      ],
      returnType: "number[][]",
      constraints: ["1 <= buildings.length <= 10^4", "0 <= lefti < righti <= 2^31 - 1", "1 <= heighti <= 2^31 - 1", "buildings is sorted by lefti in non-decreasing order."],
      examples: [
        { input: "buildings = [[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]", output: "[[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]", explanation: "Contour key points formed by all 5 buildings." },
        { input: "buildings = [[0,2,3],[2,5,3]]", output: "[[0,3],[5,0]]", explanation: "Two buildings of same height adjacent merge into single horizontal contour." },
        { input: "buildings = [[1,5,3],[1,5,3]]", output: "[[1,3],[5,0]]", explanation: "Identical overlapping buildings result in the same contour." }
      ],
      optimalSolution: `function getSkyline(buildings) {\n  const events = [];\n  for (const [l, r, h] of buildings) {\n    events.push([l, -h]);\n    events.push([r, h]);\n  }\n  events.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);\n  const res = [];\n  const heights = [0];\n  let prevMax = 0;\n  for (const [x, h] of events) {\n    if (h < 0) {\n      heights.push(-h);\n    } else {\n      const idx = heights.indexOf(h);\n      if (idx !== -1) heights.splice(idx, 1);\n    }\n    const curMax = Math.max(...heights);\n    if (curMax !== prevMax) {\n      res.push([x, curMax]);\n      prevMax = curMax;\n    }\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(N log N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function getSkyline(buildings) {\n  const events = [];\n  for (const [l, r, h] of buildings) {\n    events.push([l, -h]);\n    events.push([r, h]);\n  }\n  events.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);\n  const res = [];\n  const map = new Map();\n  map.set(0, 1);\n  let prev = 0;\n  for (const [x, h] of events) {\n    if (h < 0) {\n      map.set(-h, (map.get(-h) || 0) + 1);\n    } else {\n      const c = map.get(h) - 1;\n      if (c === 0) map.delete(h);\n      else map.set(h, c);\n    }\n    const cur = Math.max(...map.keys());\n    if (cur !== prev) {\n      res.push([x, cur]);\n      prev = cur;\n    }\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Sorting tie-breaker for events at same x: left edge higher building first (-h smaller), right edge lower building first (+h smaller).",
        "Adding duplicate consecutive horizontal points with the same y coordinate."
      ],
      hints: [
        "Represent building boundaries as events: left edge with -height, right edge with +height.",
        "Sort events by x. Tie-breaker ensures entering taller buildings before exiting shorter ones.",
        "Maintain a collection of active heights and emit a point whenever maximum height changes."
      ],
      oracleFn: (buildings: number[][]) => {
        const events: [number, number][] = [];
        for (const [l, r, h] of buildings) {
          events.push([l, -h]);
          events.push([r, h]);
        }
        events.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);
        const res: number[][] = [];
        const heights = [0];
        let prevMax = 0;
        for (const [x, h] of events) {
          if (h < 0) {
            heights.push(-h);
          } else {
            const idx = heights.indexOf(h);
            if (idx !== -1) heights.splice(idx, 1);
          }
          const curMax = Math.max(...heights);
          if (curMax !== prevMax) {
            res.push([x, curMax]);
            prevMax = curMax;
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [[[2, 9, 10], [3, 7, 15], [5, 12, 12], [15, 20, 10], [19, 24, 8]]],
          [[[0, 2, 3], [2, 5, 3]]],
          [[[1, 5, 11], [2, 7, 6], [3, 9, 13], [12, 16, 7], [14, 25, 3], [19, 22, 18], [23, 29, 13], [24, 28, 4]]],
          [[[1, 3, 4], [2, 6, 2], [5, 8, 5]]]
        ],
        boundary: [
          [[[1, 2, 1]]],
          [[[1, 10, 5], [2, 9, 5]]],
          [[[0, 5, 2], [5, 10, 2]]]
        ],
        adversarial: [
          [[[1, 2, 1], [1, 2, 2], [1, 2, 3]]],
          [[[2, 4, 7], [2, 4, 5], [2, 4, 6]]],
          [[[1, 10, 5], [2, 8, 3], [3, 6, 1]]]
        ],
        stress: [
          [Array.from({ length: 30 }, (_, i) => [i * 3, i * 3 + 4, (i % 5) + 1])],
          [Array.from({ length: 40 }, (_, i) => [i * 2, i * 2 + 5, 10 + (i % 7)])]
        ]
      }
    }),

    // 493. Meeting Scheduler
    createProblem({
      num: 493,
      title: "Meeting Scheduler",
      slug: "meeting-scheduler",
      level: 23,
      difficulty: "MEDIUM",
      topic: "Two Pointers / Sorting / Intervals",
      patternSlug: "advanced-design-intervals",
      estimatedTimeMin: 20,
      statement: "Given the availability time slots arrays `slots1` and `slots2` of two people and a meeting duration `duration`, return the earliest time slot that works for both of them and is of duration `duration`.\n\nIf there is no common time slot that satisfies the requirements, return an empty array `[]`.\n\nThe format of a time slot is an array of two elements `[start, end]` representing an inclusive time range from `start` to `end`.",
      functionName: "minAvailableDuration",
      parameters: [
        { name: "slots1", type: "number[][]", description: "First person's available slots" },
        { name: "slots2", type: "number[][]", description: "Second person's available slots" },
        { name: "duration", type: "number", description: "Required meeting duration" }
      ],
      returnType: "number[]",
      constraints: ["1 <= slots1.length, slots2.length <= 10^4", "slots1[i].length, slots2[i].length == 2", "slots1[i][0] < slots1[i][1]", "0 <= start, end <= 10^9", "1 <= duration <= 10^6"],
      examples: [
        { input: "slots1 = [[10,50],[60,120],[140,210]], slots2 = [[0,15],[60,70]], duration = 8", output: "[60,68]", explanation: "Slot [60,70] overlaps with [60,120] with length 10 >= 8. Earliest is [60, 68]." },
        { input: "slots1 = [[10,50],[60,120],[140,210]], slots2 = [[0,15],[60,70]], duration = 12", output: "[]", explanation: "No common overlap of length at least 12." },
        { input: "slots1 = [[0,2]], slots2 = [[1,3]], duration = 1", output: "[1,2]", explanation: "Overlap is [1,2] which has length 1 >= 1." }
      ],
      optimalSolution: `function minAvailableDuration(slots1, slots2, duration) {\n  slots1.sort((a, b) => a[0] - b[0]);\n  slots2.sort((a, b) => a[0] - b[0]);\n  let i = 0, j = 0;\n  while (i < slots1.length && j < slots2.length) {\n    const start = Math.max(slots1[i][0], slots2[j][0]);\n    const end = Math.min(slots1[i][1], slots2[j][1]);\n    if (end - start >= duration) {\n      return [start, start + duration];\n    }\n    if (slots1[i][1] < slots2[j][1]) i++;\n    else j++;\n  }\n  return [];\n}`,
      optimalTimeComplexity: "O(S1 log S1 + S2 log S2)",
      optimalSpaceComplexity: "O(1) extra space",
      suboptimalSolution: `function minAvailableDuration(slots1, slots2, duration) {\n  const common = [];\n  for (const s1 of slots1) {\n    for (const s2 of slots2) {\n      const start = Math.max(s1[0], s2[0]);\n      const end = Math.min(s1[1], s2[1]);\n      if (end - start >= duration) common.push([start, start + duration]);\n    }\n  }\n  if (!common.length) return [];\n  common.sort((a, b) => a[0] - b[0]);\n  return common[0];\n}`,
      suboptimalTimeComplexity: "O(S1 * S2)",
      suboptimalSpaceComplexity: "O(S1 * S2)",
      commonMistakes: [
        "Returning the whole overlapping interval instead of [start, start + duration].",
        "Advancing pointer based on start time instead of end time."
      ],
      hints: [
        "Sort both slots arrays by starting time.",
        "Use two pointers i and j.",
        "Find the overlap: [max(start1, start2), min(end1, end2)]. If length >= duration, return [start, start + duration].",
        "Advance the pointer corresponding to the slot that ends earlier."
      ],
      oracleFn: (slots1: number[][], slots2: number[][], duration: number) => {
        const s1 = [...slots1].sort((a, b) => a[0] - b[0]);
        const s2 = [...slots2].sort((a, b) => a[0] - b[0]);
        let i = 0, j = 0;
        while (i < s1.length && j < s2.length) {
          const start = Math.max(s1[i][0], s2[j][0]);
          const end = Math.min(s1[i][1], s2[j][1]);
          if (end - start >= duration) {
            return [start, start + duration];
          }
          if (s1[i][1] < s2[j][1]) i++;
          else j++;
        }
        return [];
      },
      testCases: {
        functional: [
          [[[10, 50], [60, 120], [140, 210]], [[0, 15], [60, 70]], 8],
          [[[10, 50], [60, 120], [140, 210]], [[0, 15], [60, 70]], 12],
          [[[0, 100]], [[0, 50]], 50],
          [[[10, 60], [70, 100]], [[20, 50], [60, 120]], 15]
        ],
        boundary: [
          [[[10, 20]], [[10, 20]], 10],
          [[[10, 20]], [[10, 20]], 11],
          [[[1, 2]], [[3, 4]], 1],
          [[[0, 10]], [[5, 15]], 5]
        ],
        adversarial: [
          [[[10, 15], [20, 25]], [[12, 17], [22, 27]], 3],
          [[[0, 10], [20, 30]], [[5, 15], [25, 35]], 5],
          [[[0, 5], [10, 15]], [[4, 6], [14, 16]], 2]
        ],
        stress: [
          [Array.from({ length: 40 }, (_, i) => [i * 10, i * 10 + 8]), Array.from({ length: 40 }, (_, i) => [i * 10 + 2, i * 10 + 10]), 4],
          [Array.from({ length: 50 }, (_, i) => [i * 20, i * 20 + 15]), Array.from({ length: 50 }, (_, i) => [i * 20 + 5, i * 20 + 20]), 10]
        ]
      }
    }),

    // 494. Design Underground System (DESIGN)
    createProblem({
      num: 494,
      title: "Design Underground System",
      slug: "design-underground-system",
      level: 23,
      difficulty: "MEDIUM",
      topic: "Design / Hash Table",
      patternSlug: "advanced-design-intervals",
      estimatedTimeMin: 25,
      statement: "An underground railway system is keeping track of customer travel times between different stations. They are using this data to calculate the average time it takes to travel from one station to another.\n\nImplement the `UndergroundSystem` class:\n- `void checkIn(int id, string stationName, int t)`: A customer with a card ID equal to `id`, checks in at the station `stationName` at time `t`.\n- `void checkOut(int id, string stationName, int t)`: A customer with a card ID equal to `id`, checks out from the station `stationName` at time `t`.\n- `double getAverageTime(string startStation, string endStation)`: Returns the average time it takes to travel from `startStation` to `endStation`. Answers within `10^-5` of the actual value will be accepted.",
      executionModel: "DESIGN",
      functionName: "UndergroundSystem",
      parameters: [
        { name: "commands", type: "string[]", description: "Array of operations: ['UndergroundSystem', 'checkIn', 'checkOut', 'getAverageTime']" },
        { name: "args", type: "any[]", description: "Arguments for each operation" }
      ],
      returnType: "any[]",
      starterTemplates: {
        javascript: `class UndergroundSystem {\n  constructor() {\n    // Initialize data structures\n  }\n  /**\n   * @param {number} id\n   * @param {string} stationName\n   * @param {number} t\n   * @return {void}\n   */\n  checkIn(id, stationName, t) {}\n  /**\n   * @param {number} id\n   * @param {string} stationName\n   * @param {number} t\n   * @return {void}\n   */\n  checkOut(id, stationName, t) {}\n  /**\n   * @param {string} startStation\n   * @param {string} endStation\n   * @return {number}\n   */\n  getAverageTime(startStation, endStation) {}\n}\n`,
        typescript: `class UndergroundSystem {\n  constructor() {}\n  checkIn(id: number, stationName: string, t: number): void {}\n  checkOut(id: number, stationName: string, t: number): void {}\n  getAverageTime(startStation: string, endStation: string): number { throw new Error("Not implemented"); }\n}\n`,
        python: `class UndergroundSystem:\n    def __init__(self):\n        pass\n    def checkIn(self, id: int, stationName: str, t: int) -> None:\n        pass\n    def checkOut(self, id: int, stationName: str, t: int) -> None:\n        pass\n    def getAverageTime(self, startStation: str, endStation: str) -> float:\n        pass\n`
      },
      constraints: ["1 <= id, t <= 10^6", "1 <= stationName.length <= 10", "All station names consist of uppercase and lowercase English letters and digits.", "At most 20000 calls will be made in total to checkIn, checkOut, and getAverageTime."],
      examples: [
        {
          input: 'commands = ["UndergroundSystem","checkIn","checkIn","checkIn","checkOut","checkOut","checkOut","getAverageTime","getAverageTime","checkIn","getAverageTime","checkOut","getAverageTime"]\nargs = [[],[45,"Leyton",3],[32,"Paradise",8],[27,"Leyton",10],[45,"Waterloo",15],[27,"Waterloo",20],[32,"Cambridge",22],["Paradise","Cambridge"],["Leyton","Waterloo"],[10,"Leyton",24],["Leyton","Waterloo"],[10,"Waterloo",38],["Leyton","Waterloo"]]',
          output: '[null,null,null,null,null,null,null,14,11,null,11,null,12]',
          explanation: "Average for Leyton -> Waterloo: (12 + 10) / 2 = 11, then (12 + 10 + 14) / 3 = 12."
        },
        {
          input: 'commands = ["UndergroundSystem","checkIn","checkOut","getAverageTime"]\nargs = [[],[10,"StationA",5],[10,"StationB",15],["StationA","StationB"]]',
          output: '[null,null,null,10.0]',
          explanation: "Single trip from StationA to StationB taking 15 - 5 = 10 units."
        },
        {
          input: 'commands = ["UndergroundSystem","checkIn","checkOut","checkIn","checkOut","getAverageTime"]\nargs = [[],[1,"A",10],[1,"B",30],[2,"A",20],[2,"B",60],["A","B"]]',
          output: '[null,null,null,null,null,30.0]',
          explanation: "Two trips from A to B: 20 and 40 units. Average = (20 + 40) / 2 = 30."
        }
      ],
      optimalSolution: `class UndergroundSystem {\n  constructor() {\n    this.checkIns = new Map();\n    this.routeTimes = new Map();\n  }\n  checkIn(id, stationName, t) {\n    this.checkIns.set(id, [stationName, t]);\n  }\n  checkOut(id, stationName, t) {\n    const [startStation, startTime] = this.checkIns.get(id);\n    this.checkIns.delete(id);\n    const key = startStation + '_' + stationName;\n    if (!this.routeTimes.has(key)) {\n      this.routeTimes.set(key, [0, 0]);\n    }\n    const stats = this.routeTimes.get(key);\n    stats[0] += (t - startTime);\n    stats[1] += 1;\n  }\n  getAverageTime(startStation, endStation) {\n    const key = startStation + '_' + endStation;\n    const [total, count] = this.routeTimes.get(key);\n    return total / count;\n  }\n}`,
      optimalTimeComplexity: "O(1) for checkIn, checkOut, and getAverageTime",
      optimalSpaceComplexity: "O(Total customers + Routes)",
      suboptimalSolution: `class UndergroundSystem {\n  constructor() {\n    this.records = [];\n    this.active = new Map();\n  }\n  checkIn(id, stationName, t) {\n    this.active.set(id, [stationName, t]);\n  }\n  checkOut(id, stationName, t) {\n    const [start, startTime] = this.active.get(id);\n    this.records.push({ start, end: stationName, time: t - startTime });\n  }\n  getAverageTime(startStation, endStation) {\n    const matching = this.records.filter(r => r.start === startStation && r.end === endStation);\n    return matching.reduce((acc, r) => acc + r.time, 0) / matching.length;\n  }\n}`,
      suboptimalTimeComplexity: "O(R) per getAverageTime where R is completed trips",
      suboptimalSpaceComplexity: "O(R)",
      commonMistakes: [
        "Not deleting the checkIn entry after checkout, wasting memory.",
        "Re-calculating the sum of all trips on every getAverageTime call instead of storing running sum and count."
      ],
      hints: [
        "Map 1: id -> {stationName, startTime} for active passengers.",
        "Map 2: 'startStation_endStation' -> [totalDuration, tripCount].",
        "getAverageTime is simply totalDuration / tripCount in O(1)."
      ],
      oracleFn: (commands: string[], args: any[]) => {
        class RefUndergroundSystem {
          checkIns = new Map<number, [string, number]>();
          routeTimes = new Map<string, [number, number]>();
          checkIn(id: number, stationName: string, t: number) {
            this.checkIns.set(id, [stationName, t]);
          }
          checkOut(id: number, stationName: string, t: number) {
            const [startStation, startTime] = this.checkIns.get(id)!;
            this.checkIns.delete(id);
            const key = startStation + '_' + stationName;
            if (!this.routeTimes.has(key)) {
              this.routeTimes.set(key, [0, 0]);
            }
            const stats = this.routeTimes.get(key)!;
            stats[0] += (t - startTime);
            stats[1] += 1;
          }
          getAverageTime(startStation: string, endStation: string): number {
            const key = startStation + '_' + endStation;
            const [total, count] = this.routeTimes.get(key)!;
            return total / count;
          }
        }
        let us: RefUndergroundSystem | null = null;
        const res: any[] = [];
        for (let i = 0; i < commands.length; i++) {
          const cmd = commands[i];
          if (cmd === 'UndergroundSystem') {
            us = new RefUndergroundSystem();
            res.push(null);
          } else if (cmd === 'checkIn') {
            us!.checkIn(args[i][0], args[i][1], args[i][2]);
            res.push(null);
          } else if (cmd === 'checkOut') {
            us!.checkOut(args[i][0], args[i][1], args[i][2]);
            res.push(null);
          } else if (cmd === 'getAverageTime') {
            res.push(us!.getAverageTime(args[i][0], args[i][1]));
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [
            ["UndergroundSystem", "checkIn", "checkIn", "checkIn", "checkOut", "checkOut", "checkOut", "getAverageTime", "getAverageTime", "checkIn", "getAverageTime", "checkOut", "getAverageTime"],
            [[], [45, "Leyton", 3], [32, "Paradise", 8], [27, "Leyton", 10], [45, "Waterloo", 15], [27, "Waterloo", 20], [32, "Cambridge", 22], ["Paradise", "Cambridge"], ["Leyton", "Waterloo"], [10, "Leyton", 24], ["Leyton", "Waterloo"], [10, "Waterloo", 38], ["Leyton", "Waterloo"]]
          ],
          [
            ["UndergroundSystem", "checkIn", "checkOut", "getAverageTime"],
            [[], [10, "StationA", 5], [10, "StationB", 15], ["StationA", "StationB"]]
          ],
          [
            ["UndergroundSystem", "checkIn", "checkOut", "checkIn", "checkOut", "getAverageTime"],
            [[], [1, "A", 10], [1, "B", 30], [2, "A", 20], [2, "B", 60], ["A", "B"]]
          ],
          [
            ["UndergroundSystem", "checkIn", "checkIn", "checkOut", "checkOut", "getAverageTime", "getAverageTime"],
            [[], [1, "A", 5], [2, "C", 6], [1, "B", 15], [2, "D", 20], ["A", "B"], ["C", "D"]]
          ]
        ],
        boundary: [
          [
            ["UndergroundSystem", "checkIn", "checkOut", "getAverageTime"],
            [[], [1, "A", 10], [1, "B", 20], ["A", "B"]]
          ],
          [
            ["UndergroundSystem", "checkIn", "checkOut", "getAverageTime"],
            [[], [999999, "Alpha", 1], [999999, "Beta", 2], ["Alpha", "Beta"]]
          ],
          [
            ["UndergroundSystem", "checkIn", "checkOut", "getAverageTime"],
            [[], [5, "Start", 100], [5, "End", 1000], ["Start", "End"]]
          ]
        ],
        adversarial: [
          [
            ["UndergroundSystem", "checkIn", "checkOut", "checkIn", "checkOut", "getAverageTime"],
            [[], [10, "A", 1], [10, "B", 5], [10, "A", 10], [10, "B", 20], ["A", "B"]]
          ],
          [
            ["UndergroundSystem", "checkIn", "checkIn", "checkOut", "checkOut", "getAverageTime"],
            [[], [1, "A", 10], [2, "A", 12], [2, "B", 22], [1, "B", 30], ["A", "B"]]
          ],
          [
            ["UndergroundSystem", "checkIn", "checkOut", "checkIn", "checkOut", "checkIn", "checkOut", "getAverageTime"],
            [[], [1, "X", 10], [1, "Y", 20], [2, "X", 10], [2, "Y", 30], [3, "X", 10], [3, "Y", 40], ["X", "Y"]]
          ]
        ],
        stress: [
          [
            ["UndergroundSystem", ...Array.from({ length: 15 }, (_, i) => "checkIn"), ...Array.from({ length: 15 }, (_, i) => "checkOut"), "getAverageTime"],
            [[], ...Array.from({ length: 15 }, (_, i) => [i + 1, "StartStn", i * 10]), ...Array.from({ length: 15 }, (_, i) => [i + 1, "EndStn", i * 10 + 5]), ["StartStn", "EndStn"]]
          ],
          [
            ["UndergroundSystem", ...Array.from({ length: 25 }, (_, i) => "checkIn"), ...Array.from({ length: 25 }, (_, i) => "checkOut"), "getAverageTime"],
            [[], ...Array.from({ length: 25 }, (_, i) => [i + 100, "Dep", i * 5]), ...Array.from({ length: 25 }, (_, i) => [i + 100, "Arr", i * 5 + (i % 5 + 1) * 10]), ["Dep", "Arr"]]
          ]
        ]
      }
    }),

    // 495. Design Browser History (DESIGN)
    createProblem({
      num: 495,
      title: "Design Browser History",
      slug: "design-browser-history",
      level: 23,
      difficulty: "MEDIUM",
      topic: "Design / Doubly-Linked List / Stack",
      patternSlug: "advanced-design-intervals",
      estimatedTimeMin: 20,
      statement: "You have a browser of one tab where you start on the `homepage` and you can visit another `url`, get back in the history number of `steps` or move forward in the history number of `steps`.\n\nImplement the `BrowserHistory` class:\n- `BrowserHistory(string homepage)` Initializes the object with the `homepage` of the browser.\n- `void visit(string url)` Visits `url` from the current page. It clears up all the forward history.\n- `string back(int steps)` Move `steps` back in history. If you can only return `x` steps in the history and `steps > x`, you will return only `x` steps. Return the current `url` after moving back in history at most `steps`.\n- `string forward(int steps)` Move `steps` forward in history. If you can only forward `x` steps in the history and `steps > x`, you will forward only `x` steps. Return the current `url` after forwarding in history at most `steps`.",
      executionModel: "DESIGN",
      functionName: "BrowserHistory",
      parameters: [
        { name: "commands", type: "string[]", description: "Array of operations: ['BrowserHistory', 'visit', 'back', 'forward']" },
        { name: "args", type: "any[]", description: "Arguments for each operation" }
      ],
      returnType: "any[]",
      starterTemplates: {
        javascript: `class BrowserHistory {\n  /**\n   * @param {string} homepage\n   */\n  constructor(homepage) {\n    // Initialize data structures\n  }\n  /**\n   * @param {string} url\n   * @return {void}\n   */\n  visit(url) {}\n  /**\n   * @param {number} steps\n   * @return {string}\n   */\n  back(steps) {}\n  /**\n   * @param {number} steps\n   * @return {string}\n   */\n  forward(steps) {}\n}\n`,
        typescript: `class BrowserHistory {\n  constructor(homepage: string) {}\n  visit(url: string): void {}\n  back(steps: number): string { throw new Error("Not implemented"); }\n  forward(steps: number): string { throw new Error("Not implemented"); }\n}\n`,
        python: `class BrowserHistory:\n    def __init__(self, homepage: str):\n        pass\n    def visit(self, url: str) -> None:\n        pass\n    def back(self, steps: int) -> str:\n        pass\n    def forward(self, steps: int) -> str:\n        pass\n`
      },
      constraints: ["1 <= homepage.length <= 20", "1 <= url.length <= 20", "1 <= steps <= 100", "homepage and url consist of '.' and lowercase English letters.", "At most 5000 calls will be made to visit, back, and forward."],
      examples: [
        {
          input: 'commands = ["BrowserHistory","visit","visit","visit","back","back","forward","visit","forward","back","back"]\nargs = [["leetcode.com"],["google.com"],["facebook.com"],["youtube.com"],[1],[1],[1],["linkedin.com"],[2],[2],[7]]',
          output: '[null,null,null,null,"facebook.com","google.com","facebook.com",null,"linkedin.com","google.com","leetcode.com"]',
          explanation: "Standard browser tab navigation behavior."
        },
        {
          input: 'commands = ["BrowserHistory","visit","back","forward"]\nargs = [["google.com"],["youtube.com"],[1],[1]]',
          output: '[null,null,"google.com","youtube.com"]',
          explanation: "Move back to google.com, then forward to youtube.com."
        },
        {
          input: 'commands = ["BrowserHistory","visit","visit","back","visit","forward"]\nargs = [["a.com"],["b.com"],["c.com"],[1],["d.com"],[1]]',
          output: '[null,null,null,"b.com",null,"d.com"]',
          explanation: "Visiting d.com from b.com clears forward history containing c.com, so forward(1) cannot go beyond d.com."
        }
      ],
      optimalSolution: `class BrowserHistory {\n  constructor(homepage) {\n    this.history = [homepage];\n    this.cur = 0;\n  }\n  visit(url) {\n    this.history = this.history.slice(0, this.cur + 1);\n    this.history.push(url);\n    this.cur++;\n  }\n  back(steps) {\n    this.cur = Math.max(0, this.cur - steps);\n    return this.history[this.cur];\n  }\n  forward(steps) {\n    this.cur = Math.min(this.history.length - 1, this.cur + steps);\n    return this.history[this.cur];\n  }\n}`,
      optimalTimeComplexity: "O(1) for back and forward; amortized O(1) for visit",
      optimalSpaceComplexity: "O(Total URLs visited)",
      suboptimalSolution: `class BrowserHistory {\n  constructor(homepage) {\n    this.backStack = [];\n    this.fwdStack = [];\n    this.cur = homepage;\n  }\n  visit(url) {\n    this.backStack.push(this.cur);\n    this.cur = url;\n    this.fwdStack = [];\n  }\n  back(steps) {\n    while (steps > 0 && this.backStack.length > 0) {\n      this.fwdStack.push(this.cur);\n      this.cur = this.backStack.pop();\n      steps--;\n    }\n    return this.cur;\n  }\n  forward(steps) {\n    while (steps > 0 && this.fwdStack.length > 0) {\n      this.backStack.push(this.cur);\n      this.cur = this.fwdStack.pop();\n      steps--;\n    }\n    return this.cur;\n  }\n}`,
      suboptimalTimeComplexity: "O(steps) per back/forward call",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Not clearing forward history when visit() is called.",
        "Index underflow below 0 or overflow beyond history length."
      ],
      hints: [
        "A single dynamic array with an index pointer `cur` can perform all operations.",
        "On visit, truncate any elements beyond `cur` and append the new url.",
        "On back, clamp `cur = Math.max(0, cur - steps)`.",
        "On forward, clamp `cur = Math.min(history.length - 1, cur + steps)`."
      ],
      oracleFn: (commands: string[], args: any[]) => {
        class RefBrowserHistory {
          history: string[];
          cur = 0;
          constructor(homepage: string) {
            this.history = [homepage];
          }
          visit(url: string) {
            this.history = this.history.slice(0, this.cur + 1);
            this.history.push(url);
            this.cur++;
          }
          back(steps: number): string {
            this.cur = Math.max(0, this.cur - steps);
            return this.history[this.cur];
          }
          forward(steps: number): string {
            this.cur = Math.min(this.history.length - 1, this.cur + steps);
            return this.history[this.cur];
          }
        }
        let bh: RefBrowserHistory | null = null;
        const res: any[] = [];
        for (let i = 0; i < commands.length; i++) {
          const cmd = commands[i];
          if (cmd === 'BrowserHistory') {
            bh = new RefBrowserHistory(args[i][0]);
            res.push(null);
          } else if (cmd === 'visit') {
            bh!.visit(args[i][0]);
            res.push(null);
          } else if (cmd === 'back') {
            res.push(bh!.back(args[i][0]));
          } else if (cmd === 'forward') {
            res.push(bh!.forward(args[i][0]));
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [
            ["BrowserHistory", "visit", "visit", "visit", "back", "back", "forward", "visit", "forward", "back", "back"],
            [["leetcode.com"], ["google.com"], ["facebook.com"], ["youtube.com"], [1], [1], [1], ["linkedin.com"], [2], [2], [7]]
          ],
          [
            ["BrowserHistory", "visit", "back", "forward"],
            [["google.com"], ["youtube.com"], [1], [1]]
          ],
          [
            ["BrowserHistory", "visit", "visit", "back", "visit", "forward"],
            [["a.com"], ["b.com"], ["c.com"], [1], ["d.com"], [1]]
          ],
          [
            ["BrowserHistory", "visit", "visit", "back", "back", "forward"],
            [["home.org"], ["p1.org"], ["p2.org"], [1], [1], [2]]
          ]
        ],
        boundary: [
          [
            ["BrowserHistory", "back", "forward"],
            [["home.com"], [5], [5]]
          ],
          [
            ["BrowserHistory", "visit", "back", "back"],
            [["a.com"], ["b.com"], [1], [10]]
          ],
          [
            ["BrowserHistory", "forward"],
            [["start.com"], [10]]
          ]
        ],
        adversarial: [
          [
            ["BrowserHistory", "visit", "back", "visit", "forward"],
            [["a.com"], ["b.com"], [1], ["c.com"], [1]]
          ],
          [
            ["BrowserHistory", "visit", "visit", "visit", "back", "visit", "back", "forward"],
            [["a.com"], ["b.com"], ["c.com"], ["d.com"], [2], ["e.com"], [1], [2]]
          ],
          [
            ["BrowserHistory", "visit", "back", "visit", "back", "visit"],
            [["1.com"], ["2.com"], [1], ["3.com"], [1], ["4.com"]]
          ]
        ],
        stress: [
          [
            ["BrowserHistory", ...Array.from({ length: 20 }, (_, i) => "visit"), ...Array.from({ length: 20 }, () => "back")],
            [["start.com"], ...Array.from({ length: 20 }, (_, i) => [`page${i}.com`]), ...Array.from({ length: 20 }, () => [1])]
          ],
          [
            ["BrowserHistory", ...Array.from({ length: 30 }, (_, i) => i % 2 === 0 ? "visit" : "back")],
            [["start.com"], ...Array.from({ length: 30 }, (_, i) => i % 2 === 0 ? [`site${i}.org`] : [1])]
          ]
        ]
      }
    }),

    // 496. Design Circular Deque (DESIGN)
    createProblem({
      num: 496,
      title: "Design Circular Deque",
      slug: "design-circular-deque",
      level: 23,
      difficulty: "MEDIUM",
      topic: "Design / Queue / Array",
      patternSlug: "advanced-design-intervals",
      estimatedTimeMin: 25,
      statement: "Design your implementation of the circular double-ended queue (deque).\n\nImplement the `MyCircularDeque` class:\n- `MyCircularDeque(int k)` Initializes the deque with a maximum size of `k`.\n- `boolean insertFront(int value)` Adds an item at the front of Deque. Indicates `true` if successful, or `false` otherwise.\n- `boolean insertLast(int value)` Adds an item at the rear of Deque. Indicates `true` if successful, or `false` otherwise.\n- `boolean deleteFront()` Deletes an item from the front of Deque. Indicates `true` if successful, or `false` otherwise.\n- `boolean deleteLast()` Deletes an item from the rear of Deque. Indicates `true` if successful, or `false` otherwise.\n- `int getFront()` Returns the front item from the Deque. If the deque is empty, return `-1`.\n- `int getRear()` Returns the last item from Deque. If the deque is empty, return `-1`.\n- `boolean isEmpty()` Returns `true` if the deque is empty, or `false` otherwise.\n- `boolean isFull()` Returns `true` if the deque is full, or `false` otherwise.",
      executionModel: "DESIGN",
      functionName: "MyCircularDeque",
      parameters: [
        { name: "commands", type: "string[]", description: "Array of operations" },
        { name: "args", type: "any[]", description: "Arguments for each operation" }
      ],
      returnType: "any[]",
      starterTemplates: {
        javascript: `class MyCircularDeque {\n  /**\n   * @param {number} k\n   */\n  constructor(k) {\n    // Initialize data structures\n  }\n  /**\n   * @param {number} value\n   * @return {boolean}\n   */\n  insertFront(value) {}\n  /**\n   * @param {number} value\n   * @return {boolean}\n   */\n  insertLast(value) {}\n  /**\n   * @return {boolean}\n   */\n  deleteFront() {}\n  /**\n   * @return {boolean}\n   */\n  deleteLast() {}\n  /**\n   * @return {number}\n   */\n  getFront() {}\n  /**\n   * @return {number}\n   */\n  getRear() {}\n  /**\n   * @return {boolean}\n   */\n  isEmpty() {}\n  /**\n   * @return {boolean}\n   */\n  isFull() {}\n}\n`,
        typescript: `class MyCircularDeque {\n  constructor(k: number) {}\n  insertFront(value: number): boolean { throw new Error("Not implemented"); }\n  insertLast(value: number): boolean { throw new Error("Not implemented"); }\n  deleteFront(): boolean { throw new Error("Not implemented"); }\n  deleteLast(): boolean { throw new Error("Not implemented"); }\n  getFront(): number { throw new Error("Not implemented"); }\n  getRear(): number { throw new Error("Not implemented"); }\n  isEmpty(): boolean { throw new Error("Not implemented"); }\n  isFull(): boolean { throw new Error("Not implemented"); }\n}\n`,
        python: `class MyCircularDeque:\n    def __init__(self, k: int):\n        pass\n    def insertFront(self, value: int) -> bool:\n        pass\n    def insertLast(self, value: int) -> bool:\n        pass\n    def deleteFront(self) -> bool:\n        pass\n    def deleteLast(self) -> bool:\n        pass\n    def getFront(self) -> int:\n        pass\n    def getRear(self) -> int:\n        pass\n    def isEmpty(self) -> bool:\n        pass\n    def isFull(self) -> bool:\n        pass\n`
      },
      constraints: ["1 <= k <= 1000", "0 <= value <= 1000", "At most 2000 calls will be made to insertFront, insertLast, deleteFront, deleteLast, getFront, getRear, isEmpty, isFull."],
      examples: [
        {
          input: 'commands = ["MyCircularDeque","insertLast","insertLast","insertFront","insertFront","getRear","isFull","deleteLast","insertFront","getFront"]\nargs = [[3],[1],[2],[3],[4],[],[],[],[4],[]]',
          output: '[null,true,true,true,false,2,true,true,true,4]',
          explanation: "Circular deque operations maintaining capacity 3."
        },
        {
          input: 'commands = ["MyCircularDeque","insertFront","getFront","getRear","deleteFront","isEmpty"]\nargs = [[2],[5],[],[],[],[]]',
          output: '[null,true,5,5,true,true]',
          explanation: "Deque with a single item has identical front and rear."
        },
        {
          input: 'commands = ["MyCircularDeque","insertLast","insertLast","isFull","insertLast"]\nargs = [[2],[1],[2],[],[3]]',
          output: '[null,true,true,true,false]',
          explanation: "Capacity 2 deque rejects third insertion when full."
        }
      ],
      optimalSolution: `class MyCircularDeque {\n  constructor(k) {\n    this.capacity = k;\n    this.buffer = new Array(k);\n    this.front = 0;\n    this.rear = 0;\n    this.size = 0;\n  }\n  insertFront(value) {\n    if (this.isFull()) return false;\n    this.front = (this.front - 1 + this.capacity) % this.capacity;\n    this.buffer[this.front] = value;\n    this.size++;\n    return true;\n  }\n  insertLast(value) {\n    if (this.isFull()) return false;\n    this.buffer[this.rear] = value;\n    this.rear = (this.rear + 1) % this.capacity;\n    this.size++;\n    return true;\n  }\n  deleteFront() {\n    if (this.isEmpty()) return false;\n    this.front = (this.front + 1) % this.capacity;\n    this.size--;\n    return true;\n  }\n  deleteLast() {\n    if (this.isEmpty()) return false;\n    this.rear = (this.rear - 1 + this.capacity) % this.capacity;\n    this.size--;\n    return true;\n  }\n  getFront() {\n    if (this.isEmpty()) return -1;\n    return this.buffer[this.front];\n  }\n  getRear() {\n    if (this.isEmpty()) return -1;\n    return this.buffer[(this.rear - 1 + this.capacity) % this.capacity];\n  }\n  isEmpty() {\n    return this.size === 0;\n  }\n  isFull() {\n    return this.size === this.capacity;\n  }\n}`,
      optimalTimeComplexity: "O(1) for all operations",
      optimalSpaceComplexity: "O(K)",
      suboptimalSolution: `class MyCircularDeque {\n  constructor(k) {\n    this.k = k;\n    this.q = [];\n  }\n  insertFront(v) { if (this.isFull()) return false; this.q.unshift(v); return true; }\n  insertLast(v) { if (this.isFull()) return false; this.q.push(v); return true; }\n  deleteFront() { if (this.isEmpty()) return false; this.q.shift(); return true; }\n  deleteLast() { if (this.isEmpty()) return false; this.q.pop(); return true; }\n  getFront() { return this.isEmpty() ? -1 : this.q[0]; }\n  getRear() { return this.isEmpty() ? -1 : this.q[this.q.length - 1]; }\n  isEmpty() { return this.q.length === 0; }\n  isFull() { return this.q.length === this.k; }\n}`,
      suboptimalTimeComplexity: "O(K) for unshift and shift",
      suboptimalSpaceComplexity: "O(K)",
      commonMistakes: [
        "Negative modulo when decrementing pointers: use (p - 1 + capacity) % capacity.",
        "Off-by-one on getRear: rear points to next insertion slot, so the last element is at (rear - 1 + capacity) % capacity."
      ],
      hints: [
        "Use a fixed-size array of capacity k.",
        "Keep front and rear pointers and a size variable.",
        "Perform modulo arithmetic for wrapping around boundaries."
      ],
      oracleFn: (commands: string[], args: any[]) => {
        class RefMyCircularDeque {
          capacity: number;
          buffer: number[];
          front = 0;
          rear = 0;
          size = 0;
          constructor(k: number) {
            this.capacity = k;
            this.buffer = new Array(k);
          }
          insertFront(value: number): boolean {
            if (this.isFull()) return false;
            this.front = (this.front - 1 + this.capacity) % this.capacity;
            this.buffer[this.front] = value;
            this.size++;
            return true;
          }
          insertLast(value: number): boolean {
            if (this.isFull()) return false;
            this.buffer[this.rear] = value;
            this.rear = (this.rear + 1) % this.capacity;
            this.size++;
            return true;
          }
          deleteFront(): boolean {
            if (this.isEmpty()) return false;
            this.front = (this.front + 1) % this.capacity;
            this.size--;
            return true;
          }
          deleteLast(): boolean {
            if (this.isEmpty()) return false;
            this.rear = (this.rear - 1 + this.capacity) % this.capacity;
            this.size--;
            return true;
          }
          getFront(): number {
            if (this.isEmpty()) return -1;
            return this.buffer[this.front];
          }
          getRear(): number {
            if (this.isEmpty()) return -1;
            return this.buffer[(this.rear - 1 + this.capacity) % this.capacity];
          }
          isEmpty(): boolean {
            return this.size === 0;
          }
          isFull(): boolean {
            return this.size === this.capacity;
          }
        }
        let cd: RefMyCircularDeque | null = null;
        const res: any[] = [];
        for (let i = 0; i < commands.length; i++) {
          const cmd = commands[i];
          if (cmd === 'MyCircularDeque') {
            cd = new RefMyCircularDeque(args[i][0]);
            res.push(null);
          } else if (cmd === 'insertFront') {
            res.push(cd!.insertFront(args[i][0]));
          } else if (cmd === 'insertLast') {
            res.push(cd!.insertLast(args[i][0]));
          } else if (cmd === 'deleteFront') {
            res.push(cd!.deleteFront());
          } else if (cmd === 'deleteLast') {
            res.push(cd!.deleteLast());
          } else if (cmd === 'getFront') {
            res.push(cd!.getFront());
          } else if (cmd === 'getRear') {
            res.push(cd!.getRear());
          } else if (cmd === 'isEmpty') {
            res.push(cd!.isEmpty());
          } else if (cmd === 'isFull') {
            res.push(cd!.isFull());
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [
            ["MyCircularDeque", "insertLast", "insertLast", "insertFront", "insertFront", "getRear", "isFull", "deleteLast", "insertFront", "getFront"],
            [[3], [1], [2], [3], [4], [], [], [], [4], []]
          ],
          [
            ["MyCircularDeque", "insertFront", "getFront", "getRear", "deleteFront", "isEmpty"],
            [[2], [5], [], [], [], []]
          ],
          [
            ["MyCircularDeque", "insertLast", "insertLast", "isFull", "insertLast"],
            [[2], [1], [2], [], [3]]
          ],
          [
            ["MyCircularDeque", "insertFront", "insertLast", "getFront", "getRear"],
            [[4], [10], [20], [], []]
          ]
        ],
        boundary: [
          [
            ["MyCircularDeque", "getFront", "getRear", "deleteFront", "deleteLast"],
            [[2], [], [], [], []]
          ],
          [
            ["MyCircularDeque", "insertFront", "isFull"],
            [[1], [10], []]
          ],
          [
            ["MyCircularDeque", "insertLast", "deleteLast", "isEmpty"],
            [[1], [99], [], []]
          ]
        ],
        adversarial: [
          [
            ["MyCircularDeque", "insertFront", "deleteLast", "insertLast", "deleteFront"],
            [[1], [5], [], [10], []]
          ],
          [
            ["MyCircularDeque", "insertFront", "insertFront", "deleteLast", "insertLast", "getFront", "getRear"],
            [[2], [1], [2], [], [3], [], []]
          ],
          [
            ["MyCircularDeque", "insertFront", "deleteFront", "deleteFront", "getFront"],
            [[2], [7], [], [], []]
          ]
        ],
        stress: [
          [
            ["MyCircularDeque", ...Array.from({ length: 20 }, (_, i) => i % 2 === 0 ? "insertLast" : "deleteFront")],
            [[5], ...Array.from({ length: 20 }, (_, i) => i % 2 === 0 ? [i] : [])]
          ],
          [
            ["MyCircularDeque", ...Array.from({ length: 30 }, (_, i) => i % 4 === 0 ? "insertFront" : (i % 4 === 1 ? "insertLast" : (i % 4 === 2 ? "deleteFront" : "deleteLast")))],
            [[8], ...Array.from({ length: 30 }, (_, i) => (i % 4 === 0 || i % 4 === 1) ? [i] : [])]
          ]
        ]
      }
    }),

    // 497. Design HashMap (DESIGN)
    createProblem({
      num: 497,
      title: "Design HashMap",
      slug: "design-hashmap",
      level: 23,
      difficulty: "EASY",
      topic: "Design / Hash Table",
      patternSlug: "advanced-design-intervals",
      estimatedTimeMin: 20,
      statement: "Design a HashMap without using any built-in hash table libraries.\n\nImplement the `MyHashMap` class:\n- `MyHashMap()` initializes the object with an empty map.\n- `void put(int key, int value)` inserts a `(key, value)` pair into the HashMap. If the `key` already exists in the map, update the corresponding `value`.\n- `int get(int key)` returns the `value` to which the specified `key` is mapped, or `-1` if this map contains no mapping for the `key`.\n- `void remove(key)` removes the `key` and its corresponding `value` if the map contains the mapping for the `key`.",
      executionModel: "DESIGN",
      functionName: "MyHashMap",
      parameters: [
        { name: "commands", type: "string[]", description: "Array of operations: ['MyHashMap', 'put', 'get', 'remove']" },
        { name: "args", type: "any[]", description: "Arguments for each operation" }
      ],
      returnType: "any[]",
      starterTemplates: {
        javascript: `class MyHashMap {\n  constructor() {\n    // Initialize data structures\n  }\n  /**\n   * @param {number} key\n   * @param {number} value\n   * @return {void}\n   */\n  put(key, value) {}\n  /**\n   * @param {number} key\n   * @return {number}\n   */\n  get(key) {}\n  /**\n   * @param {number} key\n   * @return {void}\n   */\n  remove(key) {}\n}\n`,
        typescript: `class MyHashMap {\n  constructor() {}\n  put(key: number, value: number): void {}\n  get(key: number): number { throw new Error("Not implemented"); }\n  remove(key: number): void {}\n}\n`,
        python: `class MyHashMap:\n    def __init__(self):\n        pass\n    def put(self, key: int, value: int) -> None:\n        pass\n    def get(self, key: int) -> int:\n        pass\n    def remove(self, key: int) -> None:\n        pass\n`
      },
      constraints: ["0 <= key, value <= 10^6", "At most 10^4 calls will be made to put, get, and remove."],
      examples: [
        {
          input: 'commands = ["MyHashMap","put","put","get","get","put","get","remove","get"]\nargs = [[],[1,1],[2,2],[1],[3],[2,1],[2],[2],[2]]',
          output: '[null,null,null,1,-1,null,1,null,-1]',
          explanation: "Standard HashMap put, update, get, remove operations."
        },
        {
          input: 'commands = ["MyHashMap","put","get","put","get"]\nargs = [[],[1,1],[1],[1,2],[1]]',
          output: '[null,null,1,null,2]',
          explanation: "Putting an existing key updates its value from 1 to 2."
        },
        {
          input: 'commands = ["MyHashMap","get","remove","get"]\nargs = [[],[10],[10],[10]]',
          output: '[null,-1,null,-1]',
          explanation: "Getting a non-existent key returns -1. Removing a non-existent key does nothing without error."
        }
      ],
      optimalSolution: `class MyHashMap {\n  constructor() {\n    this.size = 1000;\n    this.buckets = Array.from({ length: this.size }, () => []);\n  }\n  _hash(key) {\n    return key % this.size;\n  }\n  put(key, value) {\n    const bucket = this.buckets[this._hash(key)];\n    for (let i = 0; i < bucket.length; i++) {\n      if (bucket[i][0] === key) {\n        bucket[i][1] = value;\n        return;\n      }\n    }\n    bucket.push([key, value]);\n  }\n  get(key) {\n    const bucket = this.buckets[this._hash(key)];\n    for (let i = 0; i < bucket.length; i++) {\n      if (bucket[i][0] === key) return bucket[i][1];\n    }\n    return -1;\n  }\n  remove(key) {\n    const bucket = this.buckets[this._hash(key)];\n    for (let i = 0; i < bucket.length; i++) {\n      if (bucket[i][0] === key) {\n        bucket.splice(i, 1);\n        return;\n      }\n    }\n  }\n}`,
      optimalTimeComplexity: "O(1) average for put, get, remove",
      optimalSpaceComplexity: "O(K) where K is number of unique keys",
      suboptimalSolution: `class MyHashMap {\n  constructor() {\n    this.arr = new Array(1000001).fill(-1);\n  }\n  put(k, v) { this.arr[k] = v; }\n  get(k) { return this.arr[k]; }\n  remove(k) { this.arr[k] = -1; }\n}`,
      suboptimalTimeComplexity: "O(1)",
      suboptimalSpaceComplexity: "O(10^6)",
      commonMistakes: [
        "Returning 0 instead of -1 when key is not found in get.",
        "Overwriting whole bucket instead of updating existing key value."
      ],
      hints: [
        "Use separate chaining with an array of buckets.",
        "Compute bucket index using key % bucketCount.",
        "Store [key, value] pairs in bucket and scan for match."
      ],
      oracleFn: (commands: string[], args: any[]) => {
        class RefMyHashMap {
          size = 1000;
          buckets: [number, number][][] = Array.from({ length: this.size }, () => []);
          _hash(key: number) {
            return key % this.size;
          }
          put(key: number, value: number) {
            const bucket = this.buckets[this._hash(key)];
            for (let i = 0; i < bucket.length; i++) {
              if (bucket[i][0] === key) {
                bucket[i][1] = value;
                return;
              }
            }
            bucket.push([key, value]);
          }
          get(key: number): number {
            const bucket = this.buckets[this._hash(key)];
            for (let i = 0; i < bucket.length; i++) {
              if (bucket[i][0] === key) return bucket[i][1];
            }
            return -1;
          }
          remove(key: number) {
            const bucket = this.buckets[this._hash(key)];
            for (let i = 0; i < bucket.length; i++) {
              if (bucket[i][0] === key) {
                bucket.splice(i, 1);
                return;
              }
            }
          }
        }
        let hm: RefMyHashMap | null = null;
        const res: any[] = [];
        for (let i = 0; i < commands.length; i++) {
          const cmd = commands[i];
          if (cmd === 'MyHashMap') {
            hm = new RefMyHashMap();
            res.push(null);
          } else if (cmd === 'put') {
            hm!.put(args[i][0], args[i][1]);
            res.push(null);
          } else if (cmd === 'get') {
            res.push(hm!.get(args[i][0]));
          } else if (cmd === 'remove') {
            hm!.remove(args[i][0]);
            res.push(null);
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [
            ["MyHashMap", "put", "put", "get", "get", "put", "get", "remove", "get"],
            [[], [1, 1], [2, 2], [1], [3], [2, 1], [2], [2], [2]]
          ],
          [
            ["MyHashMap", "put", "get", "put", "get"],
            [[], [1, 1], [1], [1, 2], [1]]
          ],
          [
            ["MyHashMap", "get", "remove", "get"],
            [[], [10], [10], [10]]
          ],
          [
            ["MyHashMap", "put", "put", "put", "get", "get", "get"],
            [[], [10, 100], [20, 200], [30, 300], [10], [20], [30]]
          ]
        ],
        boundary: [
          [
            ["MyHashMap", "get", "remove"],
            [[], [5], [5]]
          ],
          [
            ["MyHashMap", "put", "get"],
            [[], [0, 100], [0]]
          ],
          [
            ["MyHashMap", "put", "get"],
            [[], [1000000, 42], [1000000]]
          ]
        ],
        adversarial: [
          [
            ["MyHashMap", "put", "put", "put", "get", "remove", "get"],
            [[], [1000, 10], [2000, 20], [3000, 30], [2000], [2000], [2000]]
          ],
          [
            ["MyHashMap", "put", "put", "put", "get", "get", "get"],
            [[], [1, 10], [1001, 20], [2001, 30], [1], [1001], [2001]]
          ],
          [
            ["MyHashMap", "put", "remove", "put", "remove", "get"],
            [[], [7, 77], [7], [7, 88], [7], [7]]
          ]
        ],
        stress: [
          [
            ["MyHashMap", ...Array.from({ length: 25 }, () => "put"), ...Array.from({ length: 25 }, () => "get")],
            [[], ...Array.from({ length: 25 }, (_, i) => [i, i * 2]), ...Array.from({ length: 25 }, (_, i) => [i])]
          ],
          [
            ["MyHashMap", ...Array.from({ length: 30 }, (_, i) => i % 2 === 0 ? "put" : "get")],
            [[], ...Array.from({ length: 30 }, (_, i) => i % 2 === 0 ? [i * 1000, i] : [i * 1000])]
          ]
        ]
      }
    }),

    // 498. Design HashSet (DESIGN)
    createProblem({
      num: 498,
      title: "Design HashSet",
      slug: "design-hashset",
      level: 23,
      difficulty: "EASY",
      topic: "Design / Hash Table",
      patternSlug: "advanced-design-intervals",
      estimatedTimeMin: 20,
      statement: "Design a HashSet without using any built-in hash table libraries.\n\nImplement `MyHashSet` class:\n- `void add(key)` Inserts the value `key` into the HashSet.\n- `bool contains(key)` Returns whether the value `key` exists in the HashSet or not.\n- `void remove(key)` Removes the value `key` in the HashSet. If `key` does not exist in the HashSet, do nothing.",
      executionModel: "DESIGN",
      functionName: "MyHashSet",
      parameters: [
        { name: "commands", type: "string[]", description: "Array of operations: ['MyHashSet', 'add', 'remove', 'contains']" },
        { name: "args", type: "any[]", description: "Arguments for each operation" }
      ],
      returnType: "any[]",
      starterTemplates: {
        javascript: `class MyHashSet {\n  constructor() {\n    // Initialize data structures\n  }\n  /**\n   * @param {number} key\n   * @return {void}\n   */\n  add(key) {}\n  /**\n   * @param {number} key\n   * @return {void}\n   */\n  remove(key) {}\n  /**\n   * @param {number} key\n   * @return {boolean}\n   */\n  contains(key) {}\n}\n`,
        typescript: `class MyHashSet {\n  constructor() {}\n  add(key: number): void {}\n  remove(key: number): void {}\n  contains(key: number): boolean { throw new Error("Not implemented"); }\n}\n`,
        python: `class MyHashSet:\n    def __init__(self):\n        pass\n    def add(self, key: int) -> None:\n        pass\n    def remove(self, key: int) -> None:\n        pass\n    def contains(self, key: int) -> bool:\n        pass\n`
      },
      constraints: ["0 <= key <= 10^6", "At most 10^4 calls will be made to add, remove, and contains."],
      examples: [
        {
          input: 'commands = ["MyHashSet","add","add","contains","contains","add","contains","remove","contains"]\nargs = [[],[1],[2],[1],[3],[2],[2],[2],[2]]',
          output: '[null,null,null,true,false,null,true,null,false]',
          explanation: "MyHashSet myHashSet = new MyHashSet();\nmyHashSet.add(1);\nmyHashSet.add(2);\nmyHashSet.contains(1); // return True\nmyHashSet.contains(3); // return False\nmyHashSet.add(2);      // 2 is already present\nmyHashSet.contains(2); // return True\nmyHashSet.remove(2);\nmyHashSet.contains(2); // return False"
        },
        {
          input: 'commands = ["MyHashSet","add","add","contains"]\nargs = [[],[1],[1],[1]]',
          output: '[null,null,null,true]',
          explanation: "Adding duplicate elements does not create multiple copies."
        },
        {
          input: 'commands = ["MyHashSet","contains","remove","contains"]\nargs = [[],[5],[5],[5]]',
          output: '[null,false,null,false]',
          explanation: "Removing an element that was never added does nothing."
        }
      ],
      optimalSolution: `class MyHashSet {\n  constructor() {\n    this.size = 1000;\n    this.buckets = Array.from({ length: this.size }, () => []);\n  }\n  _hash(key) {\n    return key % this.size;\n  }\n  add(key) {\n    const bucket = this.buckets[this._hash(key)];\n    if (!bucket.includes(key)) bucket.push(key);\n  }\n  remove(key) {\n    const bucket = this.buckets[this._hash(key)];\n    const idx = bucket.indexOf(key);\n    if (idx !== -1) bucket.splice(idx, 1);\n  }\n  contains(key) {\n    const bucket = this.buckets[this._hash(key)];\n    return bucket.includes(key);\n  }\n}`,
      optimalTimeComplexity: "O(1) average for add, remove, contains",
      optimalSpaceComplexity: "O(K) where K is number of unique keys",
      suboptimalSolution: `class MyHashSet {\n  constructor() {\n    this.arr = new Array(1000001).fill(false);\n  }\n  add(key) { this.arr[key] = true; }\n  remove(key) { this.arr[key] = false; }\n  contains(key) { return this.arr[key]; }\n}`,
      suboptimalTimeComplexity: "O(1)",
      suboptimalSpaceComplexity: "O(10^6)",
      commonMistakes: [
        "Adding duplicate entries into bucket when add is called multiple times.",
        "Error when removing non-existent key."
      ],
      hints: [
        "Implement separate chaining using an array of 1000 buckets.",
        "Hash key via key % 1000.",
        "In add, check if element is already present before pushing."
      ],
      oracleFn: (commands: string[], args: any[]) => {
        class RefMyHashSet {
          size = 1000;
          buckets: number[][] = Array.from({ length: this.size }, () => []);
          _hash(key: number) {
            return key % this.size;
          }
          add(key: number) {
            const bucket = this.buckets[this._hash(key)];
            if (!bucket.includes(key)) bucket.push(key);
          }
          remove(key: number) {
            const bucket = this.buckets[this._hash(key)];
            const idx = bucket.indexOf(key);
            if (idx !== -1) bucket.splice(idx, 1);
          }
          contains(key: number): boolean {
            const bucket = this.buckets[this._hash(key)];
            return bucket.includes(key);
          }
        }
        let hs: RefMyHashSet | null = null;
        const res: any[] = [];
        for (let i = 0; i < commands.length; i++) {
          const cmd = commands[i];
          if (cmd === 'MyHashSet') {
            hs = new RefMyHashSet();
            res.push(null);
          } else if (cmd === 'add') {
            hs!.add(args[i][0]);
            res.push(null);
          } else if (cmd === 'remove') {
            hs!.remove(args[i][0]);
            res.push(null);
          } else if (cmd === 'contains') {
            res.push(hs!.contains(args[i][0]));
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [
            ["MyHashSet", "add", "add", "contains", "contains", "add", "contains", "remove", "contains"],
            [[], [1], [2], [1], [3], [2], [2], [2], [2]]
          ],
          [
            ["MyHashSet", "add", "add", "contains"],
            [[], [1], [1], [1]]
          ],
          [
            ["MyHashSet", "contains", "remove", "contains"],
            [[], [5], [5], [5]]
          ],
          [
            ["MyHashSet", "add", "add", "add", "contains", "contains", "contains"],
            [[], [10], [20], [30], [10], [20], [30]]
          ]
        ],
        boundary: [
          [
            ["MyHashSet", "contains", "remove"],
            [[], [10], [10]]
          ],
          [
            ["MyHashSet", "add", "contains"],
            [[], [0], [0]]
          ],
          [
            ["MyHashSet", "add", "contains"],
            [[], [1000000], [1000000]]
          ]
        ],
        adversarial: [
          [
            ["MyHashSet", "add", "add", "add", "remove", "contains"],
            [[], [1000], [2000], [3000], [2000], [2000]]
          ],
          [
            ["MyHashSet", "add", "add", "add", "contains", "contains", "contains"],
            [[], [1], [1001], [2001], [1], [1001], [2001]]
          ],
          [
            ["MyHashSet", "add", "remove", "add", "remove", "contains"],
            [[], [7], [7], [7], [7], [7]]
          ]
        ],
        stress: [
          [
            ["MyHashSet", ...Array.from({ length: 25 }, () => "add"), ...Array.from({ length: 25 }, () => "contains")],
            [[], ...Array.from({ length: 25 }, (_, i) => [i * 3]), ...Array.from({ length: 25 }, (_, i) => [i * 3])]
          ],
          [
            ["MyHashSet", ...Array.from({ length: 30 }, (_, i) => i % 2 === 0 ? "add" : "contains")],
            [[], ...Array.from({ length: 30 }, (_, i) => i % 2 === 0 ? [i * 1000] : [i * 1000])]
          ]
        ]
      }
    }),
  ];

  return {
    level: 23,
    levelTitle: "Level 23 — Advanced System Design, Intervals & Parsing",
    topic: "Custom Class Architecture, Interval Sweep & Difference Arrays, Recursive Arithmetic Parsing, and Data Structure Design",
    problems
  };
}
