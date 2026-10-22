import * as fs from 'fs';
import * as path from 'path';
import { CodeExecutionService } from '../../src/services/execution/codeExecutionService';
import { LevelPayload, GeneratedProblem } from '../generators/types';

export interface ProblemAuditResult {
  num: number;
  title: string;
  slug: string;
  level: number;
  difficulty: string;
  topic: string;
  functionName: string;
  executionModel: string;
  structureStatus: 'PASS' | 'FAIL';
  metadataStatus: 'PASS' | 'FAIL';
  statementStatus: 'PASS' | 'FAIL';
  optimalSolutionStatus: 'PASS' | 'FAIL';
  suboptimalSolutionStatus: 'PASS' | 'FAIL';
  complexityStatus: 'PASS' | 'FAIL';
  oracleStatus: 'PASS' | 'FAIL';
  testCoverageStatus: 'PASS' | 'FAIL';
  executionStatus: 'PASS' | 'FAIL';
  overallStatus: 'PASS' | 'FAIL';
  optimalTestsPassed: number;
  totalOptimalTests: number;
  suboptimalTestsPassed: number;
  totalSuboptimalTests: number;
  defects: {
    severity: 'P0' | 'P1' | 'P2' | 'P3';
    category: string;
    description: string;
    failingInput?: string;
    expected?: string;
    actual?: string;
  }[];
}

export interface LevelAuditSummary {
  level: number;
  levelTitle: string;
  problemsCount: number;
  passedCount: number;
  failedCount: number;
  totalTestCases: number;
}

export async function auditSingleProblem(prob: GeneratedProblem): Promise<ProblemAuditResult> {
  const defects: ProblemAuditResult['defects'] = [];

  // A. Structure & Metadata
  let structureStatus: 'PASS' | 'FAIL' = 'PASS';
  let metadataStatus: 'PASS' | 'FAIL' = 'PASS';

  if (!prob.num || prob.num < 1 || prob.num > 500) {
    structureStatus = 'FAIL';
    defects.push({ severity: 'P1', category: 'Structure', description: `Invalid problem num: ${prob.num}` });
  }
  if (!prob.slug || prob.slug.trim() !== prob.slug || prob.slug.includes(' ')) {
    structureStatus = 'FAIL';
    defects.push({ severity: 'P2', category: 'Metadata', description: `Invalid or un-trimmed slug: "${prob.slug}"` });
  }
  if (!prob.title || prob.title.trim() !== prob.title) {
    structureStatus = 'FAIL';
    defects.push({ severity: 'P2', category: 'Metadata', description: `Invalid or un-trimmed title: "${prob.title}"` });
  }
  if (!['EASY', 'MEDIUM', 'HARD'].includes(prob.difficulty)) {
    metadataStatus = 'FAIL';
    defects.push({ severity: 'P2', category: 'Metadata', description: `Invalid difficulty: ${prob.difficulty}` });
  }
  if (!prob.topic || prob.topic.trim().length === 0) {
    metadataStatus = 'FAIL';
    defects.push({ severity: 'P3', category: 'Metadata', description: 'Missing topic' });
  }
  if (!prob.patternSlug || prob.patternSlug.trim().length === 0) {
    metadataStatus = 'FAIL';
    defects.push({ severity: 'P3', category: 'Metadata', description: 'Missing patternSlug' });
  }
  if (!prob.parameterDefinitions || !Array.isArray(prob.parameterDefinitions)) {
    metadataStatus = 'FAIL';
    defects.push({ severity: 'P2', category: 'Metadata', description: 'parameterDefinitions is not an array' });
  }
  if (!prob.returnType || prob.returnType.trim().length === 0) {
    metadataStatus = 'FAIL';
    defects.push({ severity: 'P3', category: 'Metadata', description: 'Missing returnType' });
  }

  // B. Statement & Examples
  let statementStatus: 'PASS' | 'FAIL' = 'PASS';
  if (!prob.statement || prob.statement.trim().length < 20) {
    statementStatus = 'FAIL';
    defects.push({ severity: 'P1', category: 'Statement', description: 'Problem statement is missing or too short' });
  }
  if (prob.statement.includes('You are given the input parameters for') ||
      prob.statement.includes('Design and implement an optimal algorithm that satisfies interview-grade runtime')) {
    statementStatus = 'FAIL';
    defects.push({ severity: 'P1', category: 'Statement', description: 'Generic / placeholder text in statement' });
  }
  if (!prob.constraints || prob.constraints.length === 0) {
    statementStatus = 'FAIL';
    defects.push({ severity: 'P2', category: 'Statement', description: 'Missing constraints' });
  }
  if (!prob.examples || prob.examples.length < 3) {
    statementStatus = 'FAIL';
    defects.push({ severity: 'P2', category: 'Statement', description: `Fewer than 3 examples (${prob.examples?.length || 0})` });
  } else {
    for (let i = 0; i < prob.examples.length; i++) {
      const ex = prob.examples[i];
      if (!ex.input || ex.output === undefined || ex.output === null) {
        statementStatus = 'FAIL';
        defects.push({ severity: 'P1', category: 'Statement', description: `Example ${i + 1} has undefined input/output` });
      }
      if (!ex.explanation || ex.explanation.trim().length === 0) {
        defects.push({ severity: 'P3', category: 'Statement', description: `Example ${i + 1} missing explanation` });
      }
    }
  }

  // Starter templates
  if (!prob.starterTemplates?.javascript || !prob.starterTemplates?.typescript || !prob.starterTemplates?.python) {
    defects.push({ severity: 'P2', category: 'StarterTemplates', description: 'Missing one or more language starter templates' });
  }

  // C. Complexity Claims
  let complexityStatus: 'PASS' | 'FAIL' = 'PASS';
  if (!prob.optimalTimeComplexity || !prob.optimalTimeComplexity.startsWith('O(')) {
    complexityStatus = 'FAIL';
    defects.push({ severity: 'P3', category: 'Complexity', description: `Suspicious optimalTimeComplexity: ${prob.optimalTimeComplexity}` });
  }
  if (!prob.optimalSpaceComplexity || !prob.optimalSpaceComplexity.startsWith('O(')) {
    complexityStatus = 'FAIL';
    defects.push({ severity: 'P3', category: 'Complexity', description: `Suspicious optimalSpaceComplexity: ${prob.optimalSpaceComplexity}` });
  }
  if (!prob.suboptimalTimeComplexity || !prob.suboptimalTimeComplexity.startsWith('O(')) {
    complexityStatus = 'FAIL';
    defects.push({ severity: 'P3', category: 'Complexity', description: `Suspicious suboptimalTimeComplexity: ${prob.suboptimalTimeComplexity}` });
  }

  // D. Test Cases Integrity & Coverage
  let testCoverageStatus: 'PASS' | 'FAIL' = 'PASS';
  let oracleStatus: 'PASS' | 'FAIL' = 'PASS';

  if (!prob.testCases || prob.testCases.length < 10) {
    testCoverageStatus = 'FAIL';
    defects.push({ severity: 'P1', category: 'TestCoverage', description: `Fewer than 10 test cases (${prob.testCases?.length || 0})` });
  }

  const tiers = new Set(prob.testCases.map(tc => tc.tier));
  if (!tiers.has('FUNCTIONAL') || !tiers.has('BOUNDARY') || !tiers.has('ADVERSARIAL') || !tiers.has('STRESS')) {
    testCoverageStatus = 'FAIL';
    defects.push({ severity: 'P2', category: 'TestCoverage', description: `Missing one or more test tiers. Found: ${Array.from(tiers).join(', ')}` });
  }

  for (let i = 0; i < prob.testCases.length; i++) {
    const tc = prob.testCases[i];
    if (tc.input === 'undefined' || tc.expectedOutput === 'undefined') {
      oracleStatus = 'FAIL';
      defects.push({ severity: 'P0', category: 'Oracle', description: `Test case ${i + 1} has 'undefined' input or expectedOutput` });
    }
  }

  // E. Optimal Solution Execution
  let optimalSolutionStatus: 'PASS' | 'FAIL' = 'PASS';
  let executionStatus: 'PASS' | 'FAIL' = 'PASS';
  let optimalTestsPassed = 0;
  const totalOptimalTests = prob.testCases.length;

  if (!prob.optimalSolution) {
    optimalSolutionStatus = 'FAIL';
    executionStatus = 'FAIL';
    defects.push({ severity: 'P0', category: 'OptimalSolution', description: 'Missing optimalSolution' });
  } else {
    try {
      const optResult = await CodeExecutionService.executeCode(
        prob.optimalSolution,
        'javascript',
        prob.testCases.map(tc => ({ input: tc.input, expectedOutput: tc.expectedOutput })),
        {
          functionName: prob.functionName,
          executionModel: prob.executionModel as any,
          timeoutMs: 4000,
        }
      );

      optimalTestsPassed = optResult.testCasesPassed;
      if (optResult.status !== 'ACCEPTED') {
        optimalSolutionStatus = 'FAIL';
        executionStatus = 'FAIL';
        defects.push({
          severity: 'P1',
          category: 'OptimalSolutionExecution',
          description: `Optimal solution failed execution with status ${optResult.status} (${optResult.testCasesPassed}/${optResult.totalTestCases} passed)`,
          failingInput: optResult.failedTestCase?.input,
          expected: optResult.failedTestCase?.expected,
          actual: optResult.failedTestCase?.actual,
        });
      }
    } catch (err: any) {
      optimalSolutionStatus = 'FAIL';
      executionStatus = 'FAIL';
      defects.push({
        severity: 'P0',
        category: 'OptimalSolutionExecution',
        description: `Optimal solution threw exception: ${err.message}`,
      });
    }
  }

  // F. Suboptimal Solution Execution (against functional and boundary test cases)
  let suboptimalSolutionStatus: 'PASS' | 'FAIL' = 'PASS';
  let suboptimalTestsPassed = 0;
  const suboptCases = prob.testCases.filter(tc => tc.tier === 'FUNCTIONAL' || tc.tier === 'BOUNDARY');
  const totalSuboptimalTests = suboptCases.length;

  if (!prob.suboptimalSolution) {
    suboptimalSolutionStatus = 'FAIL';
    defects.push({ severity: 'P1', category: 'SuboptimalSolution', description: 'Missing suboptimalSolution' });
  } else {
    try {
      const suboptResult = await CodeExecutionService.executeCode(
        prob.suboptimalSolution,
        'javascript',
        suboptCases.map(tc => ({ input: tc.input, expectedOutput: tc.expectedOutput })),
        {
          functionName: prob.functionName,
          executionModel: prob.executionModel as any,
          timeoutMs: 4000,
        }
      );

      suboptimalTestsPassed = suboptResult.testCasesPassed;
      if (suboptResult.status !== 'ACCEPTED') {
        suboptimalSolutionStatus = 'FAIL';
        defects.push({
          severity: 'P1',
          category: 'SuboptimalSolutionExecution',
          description: `Suboptimal solution failed functional/boundary tests with status ${suboptResult.status} (${suboptResult.testCasesPassed}/${suboptResult.totalTestCases} passed)`,
          failingInput: suboptResult.failedTestCase?.input,
          expected: suboptResult.failedTestCase?.expected,
          actual: suboptResult.failedTestCase?.actual,
        });
      }
    } catch (err: any) {
      suboptimalSolutionStatus = 'FAIL';
      defects.push({
        severity: 'P0',
        category: 'SuboptimalSolutionExecution',
        description: `Suboptimal solution threw exception: ${err.message}`,
      });
    }
  }

  const hasP0orP1 = defects.some(d => d.severity === 'P0' || d.severity === 'P1');
  const overallStatus = hasP0orP1 ? 'FAIL' : 'PASS';

  return {
    num: prob.num,
    title: prob.title,
    slug: prob.slug,
    level: prob.level,
    difficulty: prob.difficulty,
    topic: prob.topic,
    functionName: prob.functionName,
    executionModel: prob.executionModel,
    structureStatus,
    metadataStatus,
    statementStatus,
    optimalSolutionStatus,
    suboptimalSolutionStatus,
    complexityStatus,
    oracleStatus,
    testCoverageStatus,
    executionStatus,
    overallStatus,
    optimalTestsPassed,
    totalOptimalTests,
    suboptimalTestsPassed,
    totalSuboptimalTests,
    defects,
  };
}

export async function runFullAudit(startLvl: number = 1, endLvl: number = 23) {
  console.log(`\n================================================================================`);
  console.log(`🚀 COMPREHENSIVE 500-QUESTION DEEP AUDIT: LEVELS ${startLvl} TO ${endLvl}`);
  console.log(`================================================================================\n`);

  const genDir = path.resolve('scripts/generators');
  const allResults: ProblemAuditResult[] = [];
  const levelSummaries: LevelAuditSummary[] = [];

  for (let lvl = startLvl; lvl <= endLvl; lvl++) {
    const file = `level${lvl}.ts`;
    const fullPath = path.join(genDir, file);
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️ Warning: ${file} does not exist, skipping.`);
      continue;
    }

    const mod = require(fullPath);
    const fnName = `getLevel${lvl}Payload`;
    const payload: LevelPayload = mod[fnName]();

    console.log(`\n--------------------------------------------------------------------------------`);
    console.log(`📂 Auditing Level ${lvl}: ${payload.levelTitle} (${payload.problems.length} problems)`);
    console.log(`--------------------------------------------------------------------------------`);

    let passedInLevel = 0;
    let failedInLevel = 0;
    let totalTcInLevel = 0;

    for (const prob of payload.problems) {
      process.stdout.write(`  Auditing #${prob.num} ${prob.title}... `);
      const res = await auditSingleProblem(prob);
      allResults.push(res);
      totalTcInLevel += prob.testCases.length;

      if (res.overallStatus === 'PASS') {
        passedInLevel++;
        console.log(`✅ PASS (${res.optimalTestsPassed}/${res.totalOptimalTests} opt, ${res.suboptimalTestsPassed}/${res.totalSuboptimalTests} subopt)`);
      } else {
        failedInLevel++;
        const p01Defects = res.defects.filter(d => d.severity === 'P0' || d.severity === 'P1');
        console.log(`❌ FAIL (${p01Defects.map(d => d.description).join('; ')})`);
      }
    }

    levelSummaries.push({
      level: lvl,
      levelTitle: payload.levelTitle,
      problemsCount: payload.problems.length,
      passedCount: passedInLevel,
      failedCount: failedInLevel,
      totalTestCases: totalTcInLevel,
    });
  }

  // Write intermediate results JSON
  const outPath = path.resolve('scripts/audit/audit-results-intermediate.json');
  fs.writeFileSync(outPath, JSON.stringify({ levelSummaries, allResults }, null, 2), 'utf8');
  console.log(`\n💾 Saved intermediate audit results to ${outPath}`);

  return { levelSummaries, allResults };
}

if (require.main === module || process.argv[1]?.includes('deepAuditRunner')) {
  const start = parseInt(process.argv[2] || '1', 10);
  const end = parseInt(process.argv[3] || '23', 10);
  runFullAudit(start, end).catch(err => {
    console.error('Audit failed with error:', err);
    process.exit(1);
  });
}
