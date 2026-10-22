import * as fs from 'fs';
import * as path from 'path';
import { prisma } from '../src/lib/prisma';
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
import { getLevel16Payload } from './generators/level16';
import { getLevel17Payload } from './generators/level17';
import { getLevel18Payload } from './generators/level18';
import { getLevel19Payload } from './generators/level19';
import { getLevel20Payload } from './generators/level20';
import { getLevel21Payload } from './generators/level21';
import { getLevel22Payload } from './generators/level22';
import { getLevel23Payload } from './generators/level23';
import { LevelPayload } from './generators/types';

const levelGenerators: Record<number, () => LevelPayload> = {
  1: getLevel1Payload,
  2: getLevel2Payload,
  3: getLevel3Payload,
  4: getLevel4Payload,
  5: getLevel5Payload,
  6: getLevel6Payload,
  7: getLevel7Payload,
  8: getLevel8Payload,
  9: getLevel9Payload,
  10: getLevel10Payload,
  11: getLevel11Payload,
  12: getLevel12Payload,
  13: getLevel13Payload,
  14: getLevel14Payload,
  15: getLevel15Payload,
  16: getLevel16Payload,
  17: getLevel17Payload,
  18: getLevel18Payload,
  19: getLevel19Payload,
  20: getLevel20Payload,
  21: getLevel21Payload,
  22: getLevel22Payload,
  23: getLevel23Payload,
};

async function main() {
  const startLevel = parseInt(process.argv[2] || '1', 10);
  const endLevel = parseInt(process.argv[3] || '10', 10);

  console.log(`🚀 Starting Curriculum Population (Levels ${startLevel} to ${endLevel})...`);

  const sourceLevelsDir = path.resolve(process.cwd(), 'Source/levels');
  if (!fs.existsSync(sourceLevelsDir)) {
    fs.mkdirSync(sourceLevelsDir, { recursive: true });
  }

  let totalProblemsUpserted = 0;
  let totalTestCasesInserted = 0;

  for (let lvlNum = startLevel; lvlNum <= endLevel; lvlNum++) {
    const generator = levelGenerators[lvlNum];
    if (!generator) {
      console.log(`⚠️ No generator found for Level ${lvlNum}, skipping.`);
      continue;
    }

    const lvl = generator();
    console.log(`\n📦 Processing Level ${lvl.level}: ${lvl.levelTitle} (${lvl.problems.length} problems)`);

    // 1. Write to Source/levels/levelX.json
    const jsonPath = path.join(sourceLevelsDir, `level${lvl.level}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(lvl, null, 2), 'utf-8');
    console.log(`  💾 Wrote JSON payload to ${jsonPath}`);

    // 2. Persist to PostgreSQL database
    for (const prob of lvl.problems) {
      // Find canonical pattern
      const pattern = prob.patternSlug
        ? await prisma.dsaPattern.findFirst({
            where: { slug: prob.patternSlug }
          })
        : null;

      // Upsert problem record
      const dbProb = await prisma.dsaProblem.upsert({
        where: { slug: prob.slug },
        update: {
          leetcodeId: prob.num,
          title: prob.title,
          level: prob.level,
          difficulty: prob.difficulty,
          topic: prob.topic,
          subtopic: prob.subtopic || null,
          estimatedTimeMin: prob.estimatedTimeMin,
          statement: prob.statement,
          executionModel: prob.executionModel,
          functionName: prob.functionName,
          parameterDefinitions: prob.parameterDefinitions as any,
          returnType: prob.returnType,
          constraints: prob.constraints,
          examples: prob.examples as any,
          starterTemplates: prob.starterTemplates as any,
          optimalSolution: prob.optimalSolution,
          optimalTimeComplexity: prob.optimalTimeComplexity,
          optimalSpaceComplexity: prob.optimalSpaceComplexity,
          suboptimalSolution: prob.suboptimalSolution,
          suboptimalTimeComplexity: prob.suboptimalTimeComplexity,
          suboptimalSpaceComplexity: prob.suboptimalSpaceComplexity,
          commonMistakes: prob.commonMistakes,
          hints: prob.hints,
          ...(pattern ? { patternId: pattern.id } : {})
        },
        create: {
          leetcodeId: prob.num,
          title: prob.title,
          slug: prob.slug,
          level: prob.level,
          difficulty: prob.difficulty,
          topic: prob.topic,
          subtopic: prob.subtopic || null,
          estimatedTimeMin: prob.estimatedTimeMin,
          statement: prob.statement,
          executionModel: prob.executionModel,
          functionName: prob.functionName,
          parameterDefinitions: prob.parameterDefinitions as any,
          returnType: prob.returnType,
          constraints: prob.constraints,
          examples: prob.examples as any,
          starterTemplates: prob.starterTemplates as any,
          optimalSolution: prob.optimalSolution,
          optimalTimeComplexity: prob.optimalTimeComplexity,
          optimalSpaceComplexity: prob.optimalSpaceComplexity,
          suboptimalSolution: prob.suboptimalSolution,
          suboptimalTimeComplexity: prob.suboptimalTimeComplexity,
          suboptimalSpaceComplexity: prob.suboptimalSpaceComplexity,
          commonMistakes: prob.commonMistakes,
          hints: prob.hints,
          ...(pattern ? { patternId: pattern.id } : {})
        }
      });

      totalProblemsUpserted++;

      // Delete existing test cases for this problem and re-populate
      await prisma.testCase.deleteMany({
        where: { problemId: dbProb.id }
      });

      // Insert full verified test suite
      const testCasesData = prob.testCases.map((tc) => ({
        problemId: dbProb.id,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        isHidden: tc.isHidden,
        tier: tc.tier,
        explanation: tc.explanation || null,
        scaleN: tc.scaleN || null
      }));

      await prisma.testCase.createMany({
        data: testCasesData
      });

      totalTestCasesInserted += testCasesData.length;
    }
    console.log(`  ✅ Finished Level ${lvl.level}: ${lvl.problems.length} problems saved to DB with full test cases.`);
  }

  console.log(`\n🎉 Curriculum Population Complete!`);
  console.log(`Total Problems Processed: ${totalProblemsUpserted}`);
  console.log(`Total Test Cases Inserted: ${totalTestCasesInserted}`);

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error('❌ Batch population failed:', e);
  await prisma.$disconnect();
  process.exit(1);
});
