import * as path from 'path';
import { CodeExecutionService } from '../../src/services/execution/codeExecutionService';

const failingProblemNums = [108, 159, 231, 232, 233, 255, 258, 270, 310, 315, 322, 389, 448, 466, 467, 483, 491];

async function inspectDefects() {
  console.log(`Inspecting ${failingProblemNums.length} failing problems in detail...\n`);

  for (const num of failingProblemNums) {
    // Find which level contains this problem
    let foundProb: any = null;
    let foundLvl = 0;
    for (let l = 1; l <= 23; l++) {
      try {
        const mod = require(path.resolve(`scripts/generators/level${l}.ts`));
        const payload = mod[`getLevel${l}Payload`]();
        const p = payload.problems.find((x: any) => x.num === num);
        if (p) {
          foundProb = p;
          foundLvl = l;
          break;
        }
      } catch (e) {}
    }

    if (!foundProb) {
      console.log(`Could not find problem #${num}`);
      continue;
    }

    console.log(`================================================================================`);
    console.log(`DEFECT ANALYSIS: #${foundProb.num} [Level ${foundLvl}] ${foundProb.title}`);
    console.log(`Function Name: ${foundProb.functionName}, Model: ${foundProb.executionModel}`);
    console.log(`--------------------------------------------------------------------------------`);
    console.log(`SUBOPTIMAL CODE:\n${foundProb.suboptimalSolution}\n`);

    // Run suboptimal solution
    const suboptCases = foundProb.testCases.filter((tc: any) => tc.tier === 'FUNCTIONAL' || tc.tier === 'BOUNDARY');
    const result = await CodeExecutionService.executeCode(
      foundProb.suboptimalSolution,
      'javascript',
      suboptCases.map((tc: any) => ({ input: tc.input, expectedOutput: tc.expectedOutput })),
      {
        functionName: foundProb.functionName,
        executionModel: foundProb.executionModel as any,
        timeoutMs: 4000
      }
    );

    console.log(`Status: ${result.status} (${result.testCasesPassed}/${result.totalTestCases} passed)`);
    if (result.failedTestCase) {
      console.log(`Failed TC Input:    ${result.failedTestCase.input}`);
      console.log(`Expected Output:    ${result.failedTestCase.expected}`);
      console.log(`Actual Output:      ${result.failedTestCase.actual}`);
    }
    console.log(`\n`);
  }
}

inspectDefects().catch(console.error);
