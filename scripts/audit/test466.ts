import { CodeExecutionService } from '../../src/services/execution/codeExecutionService';

async function test466Sorting() {
  const optCode = `function palindromePairs(words) {
    const isPal = (s, l, r) => {
      while (l < r) {
        if (s[l++] !== s[r--]) return false;
      }
      return true;
    };
    const wordMap = new Map();
    for (let i = 0; i < words.length; i++) wordMap.set(words[i], i);
    const res = [];
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
    return res.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  }`;

  const suboptCode = `function palindromePairs(words) {
    const res = [];
    const isPal = (s) => {
      let l = 0, r = s.length - 1;
      while (l < r) if (s[l++] !== s[r--]) return false;
      return true;
    };
    for (let i = 0; i < words.length; i++) {
      for (let j = 0; j < words.length; j++) {
        if (i !== j && isPal(words[i] + words[j])) res.push([i, j]);
      }
    }
    return res.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  }`;

  const testCases = [
    { input: JSON.stringify([["abcd","dcba","lls","s","sssll"]]), expectedOutput: JSON.stringify([[0,1],[1,0],[2,4],[3,2]]) },
    { input: JSON.stringify([["bat","tab","cat"]]), expectedOutput: JSON.stringify([[0,1],[1,0]]) },
    { input: JSON.stringify([["a",""]]), expectedOutput: JSON.stringify([[0,1],[1,0]]) }
  ];

  const optRes = await CodeExecutionService.executeCode(optCode, 'javascript', testCases, { functionName: 'palindromePairs' });
  const suboptRes = await CodeExecutionService.executeCode(suboptCode, 'javascript', testCases, { functionName: 'palindromePairs' });

  console.log(`Sorted 466 Optimal: ${optRes.status} (${optRes.testCasesPassed}/${optRes.totalTestCases})`);
  console.log(`Sorted 466 Subopt:  ${suboptRes.status} (${suboptRes.testCasesPassed}/${suboptRes.totalTestCases})`);
}

test466Sorting().catch(console.error);
