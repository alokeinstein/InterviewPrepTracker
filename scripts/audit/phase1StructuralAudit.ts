import * as fs from 'fs';
import * as path from 'path';

interface ProblemPayload {
  num: number;
  title: string;
  slug: string;
  level: number;
  difficulty: string;
  topic: string;
  subtopic?: string;
  patternSlug: string;
  estimatedTimeMin: number;
  statement: string;
  executionModel: string;
  functionName: string;
  parameterDefinitions: { name: string; type: string; description: string }[];
  returnType: string;
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  starterTemplates: { javascript: string; typescript: string; python: string };
  optimalSolution: string;
  optimalTimeComplexity: string;
  optimalSpaceComplexity: string;
  suboptimalSolution: string;
  suboptimalTimeComplexity: string;
  suboptimalSpaceComplexity: string;
  commonMistakes: string[];
  hints: string[];
  testCases: any[];
}

interface LevelPayload {
  level: number;
  levelTitle: string;
  topic: string;
  problems: ProblemPayload[];
}

export function runPhase1Audit() {
  console.log('=== PHASE 1: REPOSITORY DISCOVERY & STRUCTURAL AUDIT ===\n');

  // 1. Read Roadmap
  const roadmapPath = path.resolve('Source/LeetCode_500_Google_Microsoft_Roadmap.md');
  const roadmapContent = fs.readFileSync(roadmapPath, 'utf8');
  const roadmapLines = roadmapContent.split('\n');
  const roadmapMap = new Map<number, { title: string; line: number; levelSection: string }>();
  let currentSection = '';
  const regex = /^([0-9]{3})\.\s+(.*)$/;

  for (let i = 0; i < roadmapLines.length; i++) {
    const line = roadmapLines[i].trim();
    if (line.startsWith('Level ')) currentSection = line;
    const m = line.match(regex);
    if (m) {
      roadmapMap.set(parseInt(m[1], 10), {
        title: m[2].trim(),
        line: i + 1,
        levelSection: currentSection,
      });
    }
  }

  console.log(`Discovered ${roadmapMap.size} canonical problems listed in ${roadmapPath}`);

  // 2. Discover Generator Files
  const genDir = path.resolve('scripts/generators');
  const genFiles = fs.readdirSync(genDir)
    .filter(f => f.startsWith('level') && f.endsWith('.ts'))
    .sort((a, b) => {
      const na = parseInt(a.replace('level', '').replace('.ts', ''), 10);
      const nb = parseInt(b.replace('level', '').replace('.ts', ''), 10);
      return na - nb;
    });

  console.log(`Discovered ${genFiles.length} level generator files in ${genDir}`);

  const discoveredProblems: ProblemPayload[] = [];
  const levelProblemCounts: Record<number, number> = {};
  const defects: { code: string; message: string; problemId?: number; file?: string }[] = [];

  const seenNums = new Map<number, { file: string; title: string }>();
  const seenSlugs = new Map<string, { file: string; num: number }>();
  const seenTitles = new Map<string, { file: string; num: number }>();

  for (const file of genFiles) {
    const lvlNum = parseInt(file.replace('level', '').replace('.ts', ''), 10);
    const fullPath = path.join(genDir, file);
    try {
      const mod = require(fullPath);
      const fnName = `getLevel${lvlNum}Payload`;
      if (typeof mod[fnName] !== 'function') {
        defects.push({
          code: 'MISSING_GENERATOR_FN',
          message: `File ${file} does not export function ${fnName}`,
          file,
        });
        continue;
      }

      const payload: LevelPayload = mod[fnName]();
      levelProblemCounts[lvlNum] = payload.problems.length;

      if (payload.level !== lvlNum) {
        defects.push({
          code: 'LEVEL_NUMBER_MISMATCH',
          message: `File ${file} returned level ${payload.level}, expected ${lvlNum}`,
          file,
        });
      }

      for (const p of payload.problems) {
        discoveredProblems.push(p);

        // Check ID uniqueness
        if (seenNums.has(p.num)) {
          const prev = seenNums.get(p.num)!;
          defects.push({
            code: 'DUPLICATE_PROBLEM_NUM',
            message: `Duplicate problem num #${p.num} ("${p.title}" in ${file}) already seen in ${prev.file} ("${prev.title}")`,
            problemId: p.num,
            file,
          });
        } else {
          seenNums.set(p.num, { file, title: p.title });
        }

        // Check Slug uniqueness
        if (seenSlugs.has(p.slug)) {
          const prev = seenSlugs.get(p.slug)!;
          defects.push({
            code: 'DUPLICATE_SLUG',
            message: `Duplicate slug "${p.slug}" for #${p.num} in ${file} already used by #${prev.num} in ${prev.file}`,
            problemId: p.num,
            file,
          });
        } else {
          seenSlugs.set(p.slug, { file, num: p.num });
        }

        // Check Title match against roadmap
        const roadmapItem = roadmapMap.get(p.num);
        if (!roadmapItem) {
          defects.push({
            code: 'EXTRA_PROBLEM_NOT_IN_ROADMAP',
            message: `Problem #${p.num} ("${p.title}") is not in the authoritative roadmap`,
            problemId: p.num,
            file,
          });
        } else if (roadmapItem.title.toLowerCase() !== p.title.toLowerCase()) {
          // Check for slight differences
          defects.push({
            code: 'TITLE_MISMATCH_ROADMAP',
            message: `Problem #${p.num} title "${p.title}" does not match roadmap title "${roadmapItem.title}"`,
            problemId: p.num,
            file,
          });
        }

        // Check required fields
        if (!p.statement || p.statement.trim().length === 0) {
          defects.push({ code: 'EMPTY_STATEMENT', message: `Problem #${p.num} has empty statement`, problemId: p.num, file });
        }
        if (!p.functionName || p.functionName.trim().length === 0) {
          defects.push({ code: 'EMPTY_FUNCTION_NAME', message: `Problem #${p.num} has empty functionName`, problemId: p.num, file });
        }
        if (!p.optimalSolution || p.optimalSolution.trim().length === 0) {
          defects.push({ code: 'MISSING_OPTIMAL_SOLUTION', message: `Problem #${p.num} missing optimalSolution`, problemId: p.num, file });
        }
        if (!p.suboptimalSolution || p.suboptimalSolution.trim().length === 0) {
          defects.push({ code: 'MISSING_SUBOPTIMAL_SOLUTION', message: `Problem #${p.num} missing suboptimalSolution`, problemId: p.num, file });
        }
        if (!p.examples || p.examples.length < 3) {
          defects.push({ code: 'INSUFFICIENT_EXAMPLES', message: `Problem #${p.num} has ${p.examples?.length || 0} examples (< 3)`, problemId: p.num, file });
        }
        if (!p.testCases || p.testCases.length < 10) {
          defects.push({ code: 'INSUFFICIENT_TEST_CASES', message: `Problem #${p.num} has ${p.testCases?.length || 0} test cases (< 10)`, problemId: p.num, file });
        }
        if (!p.hints || p.hints.length === 0) {
          defects.push({ code: 'MISSING_HINTS', message: `Problem #${p.num} has 0 hints`, problemId: p.num, file });
        }
        if (!p.constraints || p.constraints.length === 0) {
          defects.push({ code: 'MISSING_CONSTRAINTS', message: `Problem #${p.num} has 0 constraints`, problemId: p.num, file });
        }
      }
    } catch (e: any) {
      defects.push({
        code: 'GENERATOR_IMPORT_ERROR',
        message: `Failed to load ${file}: ${e.message}`,
        file,
      });
    }
  }

  // Check missing from 1..500
  const missingFromRoadmap: number[] = [];
  for (let i = 1; i <= 500; i++) {
    if (!seenNums.has(i)) {
      missingFromRoadmap.push(i);
    }
  }

  console.log(`Total Problems Discovered across all level generators: ${discoveredProblems.length}`);
  console.log(`Total Unique Problem IDs: ${seenNums.size}`);
  console.log(`Total Unique Slugs: ${seenSlugs.size}`);
  console.log(`Missing Problem IDs from 1..500: [${missingFromRoadmap.join(', ')}]`);
  console.log(`Structural Defects Found: ${defects.length}`);

  if (defects.length > 0) {
    console.log('\nTop Structural Defects:');
    defects.slice(0, 20).forEach(d => console.log(`  [${d.code}] ${d.message}`));
    if (defects.length > 20) {
      console.log(`  ... and ${defects.length - 20} more defects.`);
    }
  }

  return {
    discoveredProblemsCount: discoveredProblems.length,
    uniqueProblemIds: seenNums.size,
    uniqueSlugs: seenSlugs.size,
    missingFromRoadmap,
    defects,
    levelProblemCounts,
  };
}

if (require.main === module || process.argv[1]?.includes('phase1StructuralAudit')) {
  runPhase1Audit();
}
