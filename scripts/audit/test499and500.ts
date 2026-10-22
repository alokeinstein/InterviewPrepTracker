import { CodeExecutionService } from '../../src/services/execution/codeExecutionService';

async function test499and500() {
  console.log('Testing Problem #499 and #500 implementations...');

  // Problem 499: Minimum Cost to Connect Two Groups of Points
  const p499Opt = `function connectTwoGroups(cost) {
    const size1 = cost.length, size2 = cost[0].length;
    const minCost2 = new Array(size2).fill(Infinity);
    for (let j = 0; j < size2; j++) {
      for (let i = 0; i < size1; i++) {
        minCost2[j] = Math.min(minCost2[j], cost[i][j]);
      }
    }
    const memo = new Map();
    function dp(i, mask) {
      if (i === size1) {
        let total = 0;
        for (let j = 0; j < size2; j++) {
          if ((mask & (1 << j)) === 0) total += minCost2[j];
        }
        return total;
      }
      const key = (i << 12) | mask;
      if (memo.has(key)) return memo.get(key);
      let res = Infinity;
      for (let j = 0; j < size2; j++) {
        res = Math.min(res, cost[i][j] + dp(i + 1, mask | (1 << j)));
      }
      memo.set(key, res);
      return res;
    }
    return dp(0, 0);
  }`;

  const p499Subopt = `function connectTwoGroups(cost) {
    const size1 = cost.length, size2 = cost[0].length;
    const minCost2 = new Array(size2).fill(Infinity);
    for (let j = 0; j < size2; j++) {
      for (let i = 0; i < size1; i++) minCost2[j] = Math.min(minCost2[j], cost[i][j]);
    }
    const memo = {};
    function solve(i, mask) {
      if (i === size1) {
        let extra = 0;
        for (let j = 0; j < size2; j++) {
          if (!(mask & (1 << j))) extra += minCost2[j];
        }
        return extra;
      }
      const k = i + ',' + mask;
      if (memo[k] !== undefined) return memo[k];
      let ans = Infinity;
      for (let j = 0; j < size2; j++) {
        ans = Math.min(ans, cost[i][j] + solve(i + 1, mask | (1 << j)));
      }
      return (memo[k] = ans);
    }
    return solve(0, 0);
  }`;

  const tc499 = [
    { input: JSON.stringify([[[15, 96], [36, 2]]]), expectedOutput: "17" },
    { input: JSON.stringify([[[1, 3, 5], [4, 1, 1], [1, 5, 3]]]), expectedOutput: "4" },
    { input: JSON.stringify([[[2, 5, 1], [3, 4, 7], [8, 1, 2], [6, 2, 4], [3, 8, 8]]]), expectedOutput: "10" }
  ];

  const res499Opt = await CodeExecutionService.executeCode(p499Opt, 'javascript', tc499, { functionName: 'connectTwoGroups' });
  const res499Subopt = await CodeExecutionService.executeCode(p499Subopt, 'javascript', tc499, { functionName: 'connectTwoGroups' });
  console.log(`499 Opt: ${res499Opt.status} (${res499Opt.testCasesPassed}/${res499Opt.totalTestCases})`);
  console.log(`499 Subopt: ${res499Subopt.status} (${res499Subopt.testCasesPassed}/${res499Subopt.totalTestCases})`);

  // Problem 500: Minimum Number of Vertices to Reach All Nodes
  const p500Opt = `function findSmallestSetOfVertices(n, edges) {
    const hasIncoming = new Uint8Array(n);
    for (let i = 0; i < edges.length; i++) {
      hasIncoming[edges[i][1]] = 1;
    }
    const res = [];
    for (let i = 0; i < n; i++) {
      if (!hasIncoming[i]) res.push(i);
    }
    return res;
  }`;

  const p500Subopt = `function findSmallestSetOfVertices(n, edges) {
    const inDegree = new Array(n).fill(0);
    for (const [u, v] of edges) inDegree[v]++;
    const res = [];
    for (let i = 0; i < n; i++) {
      if (inDegree[i] === 0) res.push(i);
    }
    return res;
  }`;

  const tc500 = [
    { input: JSON.stringify([6, [[0, 1], [0, 2], [2, 5], [3, 4], [4, 2]]]), expectedOutput: JSON.stringify([0, 3]) },
    { input: JSON.stringify([5, [[0, 1], [2, 1], [3, 1], [1, 4], [2, 4]]]), expectedOutput: JSON.stringify([0, 2, 3]) }
  ];

  const res500Opt = await CodeExecutionService.executeCode(p500Opt, 'javascript', tc500, { functionName: 'findSmallestSetOfVertices' });
  const res500Subopt = await CodeExecutionService.executeCode(p500Subopt, 'javascript', tc500, { functionName: 'findSmallestSetOfVertices' });
  console.log(`500 Opt: ${res500Opt.status} (${res500Opt.testCasesPassed}/${res500Opt.totalTestCases})`);
  console.log(`500 Subopt: ${res500Subopt.status} (${res500Subopt.testCasesPassed}/${res500Subopt.totalTestCases})`);
}

test499and500().catch(console.error);
