import { getLevel1Payload } from './generators/level1';
import { getLevel2Payload } from './generators/level2';
import { getLevel3Payload } from './generators/level3';
import { getLevel4Payload } from './generators/level4';
import { getLevel5Payload } from './generators/level5';
import { getLevel6Payload } from './generators/level6';

const levels = [
  getLevel1Payload(),
  getLevel2Payload(),
  getLevel3Payload(),
  getLevel4Payload(),
  getLevel5Payload(),
  getLevel6Payload()
];

let totalProblems = 0;
let totalTestCases = 0;

levels.forEach((lvl) => {
  totalProblems += lvl.problems.length;
  let lvlTests = 0;
  lvl.problems.forEach((p) => {
    lvlTests += p.testCases.length;
    if (p.testCases.length < 10) {
      console.warn(`WARNING: Problem #${p.num} ${p.title} has fewer than 10 test cases: ${p.testCases.length}`);
    }
  });
  totalTestCases += lvlTests;
  console.log(`Level ${lvl.level} (${lvl.levelTitle}): ${lvl.problems.length} problems, ${lvlTests} total test cases (avg ${(lvlTests / lvl.problems.length).toFixed(1)}/problem).`);
});

console.log(`\n===========================================`);
console.log(`GRAND TOTAL BATCH 1 (Levels 1-6):`);
console.log(`Total Problems: ${totalProblems}`);
console.log(`Total Verified Test Cases: ${totalTestCases}`);
console.log(`Average Test Cases per Problem: ${(totalTestCases / totalProblems).toFixed(1)}`);
console.log(`===========================================`);
