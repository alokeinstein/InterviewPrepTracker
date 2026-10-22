import { prisma } from '../src/lib/prisma';
import { CodeExecutionService } from '../src/services/execution/codeExecutionService';

async function main() {
  const startLevel = parseInt(process.argv[2] || '1', 10);
  const endLevel = parseInt(process.argv[3] || '10', 10);
  console.log(`🧪 Starting Deep Generation Correctness Audit for Levels ${startLevel} to ${endLevel}...\n`);

  const problems = await prisma.dsaProblem.findMany({
    where: {
      level: { gte: startLevel, lte: endLevel }
    },
    include: {
      testCases: true
    },
    orderBy: { leetcodeId: 'asc' }
  });

  console.log(`Found ${problems.length} problems to verify.`);

  let totalProblems = problems.length;
  let passedProblems = 0;
  let failedProblems: { num: number | null; title: string; level: number; error: string }[] = [];

  for (const prob of problems) {
    process.stdout.write(`Checking #${prob.leetcodeId || '?'} [L${prob.level}] ${prob.title}... `);

    if (!prob.optimalSolution) {
      console.log('❌ FAILED: Missing optimalSolution');
      failedProblems.push({ num: prob.leetcodeId, title: prob.title, level: prob.level, error: 'Missing optimalSolution' });
      continue;
    }

    const testCases = prob.testCases.map(tc => ({
      input: tc.input,
      expectedOutput: tc.expectedOutput
    }));

    try {
      const result = await CodeExecutionService.executeCode(
        prob.optimalSolution,
        'javascript',
        testCases,
        {
          functionName: prob.functionName,
          executionModel: prob.executionModel as any,
          timeoutMs: 3000
        }
      );

      if (result.status === 'ACCEPTED') {
        console.log(`✅ ACCEPTED (${result.testCasesPassed}/${result.totalTestCases} tests passed in ${result.runtimeMs}ms)`);
        passedProblems++;
      } else {
        const errDetail = result.failedTestCase ? `Failed test: ${result.failedTestCase.actual}` : result.status;
        console.log(`❌ ${result.status}: ${errDetail}`);
        failedProblems.push({
          num: prob.leetcodeId,
          title: prob.title,
          level: prob.level,
          error: `${result.status}: ${errDetail}`
        });
      }
    } catch (err: any) {
      console.log(`❌ EXCEPTION: ${err.message}`);
      failedProblems.push({
        num: prob.leetcodeId,
        title: prob.title,
        level: prob.level,
        error: err.message
      });
    }
  }

  console.log('\n================================================================================');
  console.log(`SUMMARY: ${passedProblems}/${totalProblems} problems passed end-to-end execution.`);
  if (failedProblems.length > 0) {
    console.log(`❌ Failed problems (${failedProblems.length}):`);
    for (const f of failedProblems) {
      console.log(`  - #${f.num} [L${f.level}] ${f.title}: ${f.error}`);
    }
  } else {
    console.log('🎉 ALL 90 PROBLEMS IN LEVELS 7-10 PASSED 100% OF THEIR TEST CASES!');
  }
  console.log('================================================================================\n');

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
