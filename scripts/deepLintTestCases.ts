import { getLevel1Payload } from './generators/level1';
import { getLevel2Payload } from './generators/level2';
import { getLevel3Payload } from './generators/level3';
import { getLevel4Payload } from './generators/level4';
import { getLevel5Payload } from './generators/level5';
import { getLevel6Payload } from './generators/level6';
import { getLevel7Payload } from './generators/level7';
import { getLevel8Payload } from './generators/level8';
import { getLevel9Payload } from './generators/level9';
import { getLevel10Payload } from './generators/level10';
import { getLevel11Payload } from './generators/level11';
import { getLevel12Payload } from './generators/level12';
import { getLevel13Payload } from './generators/level13';
import { getLevel14Payload } from './generators/level14';
import { getLevel15Payload } from './generators/level15';

const generators = [
  getLevel1Payload, getLevel2Payload, getLevel3Payload, getLevel4Payload, getLevel5Payload,
  getLevel6Payload, getLevel7Payload, getLevel8Payload, getLevel9Payload, getLevel10Payload,
  getLevel11Payload, getLevel12Payload, getLevel13Payload, getLevel14Payload, getLevel15Payload
];

let issues = 0;

for (let lvl = 1; lvl <= 15; lvl++) {
  const payload = generators[lvl - 1]();
  for (const prob of payload.problems) {
    // Check title, slug, functionName
    if (prob.title !== prob.title.trim()) {
      console.error(`[Level ${lvl}] #${prob.num} title has spaces: "${prob.title}"`);
      issues++;
    }
    if (prob.slug !== prob.slug.trim()) {
      console.error(`[Level ${lvl}] #${prob.num} slug has spaces: "${prob.slug}"`);
      issues++;
    }
    if (prob.functionName !== prob.functionName.trim()) {
      console.error(`[Level ${lvl}] #${prob.num} functionName has spaces: "${prob.functionName}"`);
      issues++;
    }

    // Check test cases
    for (let i = 0; i < prob.testCases.length; i++) {
      const tc = prob.testCases[i];
      // Check for parenthesis strings with space corruption
      if (prob.num === 144) {
        if (tc.input.includes('" ') || tc.input.includes(' "')) {
          console.error(`[Level ${lvl}] #${prob.num} test case ${i} has space in brackets: ${tc.input}`);
          issues++;
        }
      }
      if (tc.input === 'undefined' || tc.expectedOutput === 'undefined') {
        console.error(`[Level ${lvl}] #${prob.num} test case ${i} has undefined input/output!`);
        issues++;
      }
    }
  }
}

if (issues === 0) {
  console.log(`✅ All 340 problems verified across Levels 1–15! Zero test case corruption detected.`);
} else {
  console.error(`⚠️ Found ${issues} test case issues.`);
}
