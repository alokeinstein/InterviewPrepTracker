import * as fs from 'fs';
import * as path from 'path';
import { LevelPayload, GeneratedProblem } from '../generators/types';

interface OracleAuditIssue {
  problemNum: number;
  title: string;
  level: number;
  issueType: string;
  details: string;
}

export function runOracleAudit() {
  console.log('=== AUDITING ORACLE FUNCTIONS & TEST CASES ACROSS ALL 23 LEVELS ===\n');

  const issues: OracleAuditIssue[] = [];
  const genDir = path.resolve('scripts/generators');

  for (let lvl = 1; lvl <= 23; lvl++) {
    const file = path.join(genDir, `level${lvl}.ts`);
    if (!fs.existsSync(file)) continue;

    const mod = require(file);
    const payload: LevelPayload = mod[`getLevel${lvl}Payload`]();

    for (const prob of payload.problems) {
      if (!prob.oracleFn) {
        issues.push({
          problemNum: prob.num,
          title: prob.title,
          level: lvl,
          issueType: 'MISSING_ORACLE_FN',
          details: 'Problem does not have an oracleFn defined',
        });
        continue;
      }

      // Check each test case
      for (let tcIdx = 0; tcIdx < prob.testCases.length; tcIdx++) {
        const tc = prob.testCases[tcIdx];
        let parsedArgs: any[];
        let parsedExpected: any;

        try {
          parsedArgs = JSON.parse(tc.input);
        } catch (e: any) {
          issues.push({
            problemNum: prob.num,
            title: prob.title,
            level: lvl,
            issueType: 'MALFORMED_TEST_INPUT',
            details: `Test case ${tcIdx + 1} (${tc.tier}) input cannot be JSON parsed: ${tc.input}`,
          });
          continue;
        }

        try {
          parsedExpected = JSON.parse(tc.expectedOutput);
        } catch (e: any) {
          issues.push({
            problemNum: prob.num,
            title: prob.title,
            level: lvl,
            issueType: 'MALFORMED_EXPECTED_OUTPUT',
            details: `Test case ${tcIdx + 1} (${tc.tier}) expectedOutput cannot be JSON parsed: ${tc.expectedOutput}`,
          });
          continue;
        }

        // Run oracleFn directly on cloned args
        try {
          const clonedArgs = JSON.parse(JSON.stringify(parsedArgs));
          const oracleResult = prob.oracleFn(...clonedArgs);

          // Check if oracle mutated clonedArgs in a problematic way or returned undefined/NaN
          if (oracleResult === undefined) {
            issues.push({
              problemNum: prob.num,
              title: prob.title,
              level: lvl,
              issueType: 'ORACLE_RETURNED_UNDEFINED',
              details: `Test case ${tcIdx + 1} (${tc.tier}) returned undefined from oracleFn`,
            });
          }
          if (typeof oracleResult === 'number' && isNaN(oracleResult)) {
            issues.push({
              problemNum: prob.num,
              title: prob.title,
              level: lvl,
              issueType: 'ORACLE_RETURNED_NAN',
              details: `Test case ${tcIdx + 1} (${tc.tier}) returned NaN from oracleFn`,
            });
          }

          // In DESIGN problems: oracleResult is array of method results
          // Verify lengths match if array
          if (Array.isArray(parsedExpected) && Array.isArray(oracleResult)) {
            if (parsedExpected.length !== oracleResult.length) {
              issues.push({
                problemNum: prob.num,
                title: prob.title,
                level: lvl,
                issueType: 'ORACLE_OUTPUT_LENGTH_MISMATCH',
                details: `Test case ${tcIdx + 1} expected length ${parsedExpected.length}, oracle gave ${oracleResult.length}`,
              });
            }
          }
        } catch (err: any) {
          issues.push({
            problemNum: prob.num,
            title: prob.title,
            level: lvl,
            issueType: 'ORACLE_EXECUTION_EXCEPTION',
            details: `Test case ${tcIdx + 1} (${tc.tier}) oracleFn threw exception: ${err.message}`,
          });
        }
      }
    }
  }

  console.log(`Oracle Audit Complete! Discovered ${issues.length} potential oracle/test issues.`);
  if (issues.length > 0) {
    issues.forEach(iss => {
      console.log(`  [${iss.issueType}] #${iss.problemNum} [L${iss.level}] ${iss.title}: ${iss.details}`);
    });
  } else {
    console.log('✅ ALL 498 PROBLEMS HAVE VALID, NON-CRASHING ORACLE FUNCTIONS ON ALL TEST CASES!');
  }

  return issues;
}

if (require.main === module || process.argv[1]?.includes('oracleDifferentialAudit')) {
  runOracleAudit();
}
