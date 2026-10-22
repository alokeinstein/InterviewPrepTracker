import * as path from 'path';
import { LevelPayload, GeneratedProblem } from '../generators/types';

interface QualityWarning {
  num: number;
  title: string;
  level: number;
  warningType: string;
  details: string;
}

export function runContentAudit() {
  console.log('=== AUDITING CONTENT QUALITY & LEARNING EXPERIENCE ===\n');
  const warnings: QualityWarning[] = [];
  const difficultyByLevel: Record<number, { EASY: number; MEDIUM: number; HARD: number }> = {};

  for (let lvl = 1; lvl <= 23; lvl++) {
    const file = path.resolve(`scripts/generators/level${lvl}.ts`);
    const mod = require(file);
    const payload: LevelPayload = mod[`getLevel${lvl}Payload`]();
    difficultyByLevel[lvl] = { EASY: 0, MEDIUM: 0, HARD: 0 };

    for (const prob of payload.problems) {
      difficultyByLevel[lvl][prob.difficulty as 'EASY' | 'MEDIUM' | 'HARD']++;

      // 1. Check for premature code reveal in hints 1..3
      if (prob.hints && prob.hints.length > 0) {
        for (let h = 0; h < Math.min(3, prob.hints.length); h++) {
          const hint = prob.hints[h];
          if (hint.includes('function ') || hint.includes('return ') && hint.includes('{') && hint.includes('}')) {
            warnings.push({
              num: prob.num,
              title: prob.title,
              level: lvl,
              warningType: 'PREMATURE_CODE_IN_HINT',
              details: `Hint ${h + 1} contains a complete function or code block`,
            });
          }
        }
      }

      // 2. Check for duplicate examples with same input
      if (prob.examples && prob.examples.length > 1) {
        const seenInputs = new Set<string>();
        for (const ex of prob.examples) {
          if (seenInputs.has(ex.input)) {
            warnings.push({
              num: prob.num,
              title: prob.title,
              level: lvl,
              warningType: 'DUPLICATE_EXAMPLE_INPUT',
              details: `Duplicate example input: ${ex.input}`,
            });
          }
          seenInputs.add(ex.input);
        }
      }

      // 3. Check common mistakes quality
      if (!prob.commonMistakes || prob.commonMistakes.length === 0) {
        warnings.push({
          num: prob.num,
          title: prob.title,
          level: lvl,
          warningType: 'EMPTY_COMMON_MISTAKES',
          details: 'Zero common mistakes recorded',
        });
      }
    }
  }

  console.log('Difficulty Distribution by Level:');
  console.log('Level | Easy | Medium | Hard | Total');
  for (let l = 1; l <= 23; l++) {
    const d = difficultyByLevel[l];
    const tot = d.EASY + d.MEDIUM + d.HARD;
    console.log(`  ${l.toString().padStart(2, ' ')}  |  ${d.EASY.toString().padStart(2, ' ')}  |   ${d.MEDIUM.toString().padStart(2, ' ')}   |  ${d.HARD.toString().padStart(2, ' ')}  |  ${tot}`);
  }

  console.log(`\nContent Warnings Found: ${warnings.length}`);
  warnings.forEach(w => console.log(`  [${w.warningType}] #${w.num} [L${w.level}] ${w.title}: ${w.details}`));

  return { difficultyByLevel, warnings };
}

if (require.main === module || process.argv[1]?.includes('contentAudit')) {
  runContentAudit();
}
