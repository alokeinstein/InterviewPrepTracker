import { prisma } from '../src/lib/prisma';

export interface AuditOptions {
  minLevel?: number;
  maxLevel?: number;
  failOnError?: boolean;
}

export async function runCurriculumAudit(options: AuditOptions = {}) {
  const minLevel = options.minLevel ?? 1;
  const maxLevel = options.maxLevel ?? 23;

  const problems = await prisma.dsaProblem.findMany({
    where: {
      level: {
        gte: minLevel,
        lte: maxLevel,
      },
    },
    select: {
      id: true,
      leetcodeId: true,
      title: true,
      slug: true,
      level: true,
      statement: true,
      examples: true,
      executionModel: true,
      functionName: true,
      optimalSolution: true,
      suboptimalSolution: true,
      _count: {
        select: { testCases: true },
      },
    },
    orderBy: { leetcodeId: 'asc' },
  });

  let genericCount = 0;
  let under3ExamplesCount = 0;
  let under10TestCasesCount = 0;
  let missingSuboptimalCount = 0;
  let totalTestCases = 0;

  const levelStats: Record<
    number,
    {
      total: number;
      generic: number;
      under3Ex: number;
      under10Tc: number;
      missingSubopt: number;
      totalTc: number;
      minTc: number;
      maxTc: number;
    }
  > = {};

  for (const p of problems) {
    if (!levelStats[p.level]) {
      levelStats[p.level] = {
        total: 0,
        generic: 0,
        under3Ex: 0,
        under10Tc: 0,
        missingSubopt: 0,
        totalTc: 0,
        minTc: 999999,
        maxTc: 0,
      };
    }

    const s = levelStats[p.level];
    s.total++;

    const isGeneric =
      p.statement.includes('You are given the input parameters for') ||
      p.statement.includes('Design and implement an optimal algorithm that satisfies interview-grade runtime');

    if (isGeneric) {
      genericCount++;
      s.generic++;
    }

    const exList = Array.isArray(p.examples) ? (p.examples as any[]) : [];
    if (exList.length < 3) {
      under3ExamplesCount++;
      s.under3Ex++;
    }

    const tcCount = p._count.testCases;
    totalTestCases += tcCount;
    s.totalTc += tcCount;
    s.minTc = Math.min(s.minTc, tcCount);
    s.maxTc = Math.max(s.maxTc, tcCount);

    if (tcCount < 10) {
      under10TestCasesCount++;
      s.under10Tc++;
    }

    if (!p.suboptimalSolution) {
      missingSuboptimalCount++;
      s.missingSubopt++;
    }
  }

  console.log('================================================================================');
  console.log(`🔍 CURRICULUM AUDIT REPORT (Levels ${minLevel} to ${maxLevel})`);
  console.log('================================================================================');
  console.log(`Total Problems Audited:               ${problems.length}`);
  console.log(`Total Test Cases in Scope:            ${totalTestCases}`);
  console.log(`Generic / Corrupted Statements:       ${genericCount} ${genericCount === 0 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Problems with < 3 Rich Examples:      ${under3ExamplesCount} ${under3ExamplesCount === 0 ? '✅ PASS' : '⚠️ DEFICIENT'}`);
  console.log(`Problems with < 10 Test Cases:        ${under10TestCasesCount} ${under10TestCasesCount === 0 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Problems Missing Suboptimal Benchmark: ${missingSuboptimalCount} ${missingSuboptimalCount === 0 ? '✅ PASS' : '❌ FAIL'}`);
  console.log('--------------------------------------------------------------------------------');
  console.log('Level | Count | Generic | <3 Examples | <10 TC | Test Cases Range | Suboptimal Benchmark');
  console.log('--------------------------------------------------------------------------------');

  for (let lvl = minLevel; lvl <= maxLevel; lvl++) {
    const s = levelStats[lvl];
    if (!s) continue;
    const minTcStr = s.minTc === 999999 ? '0' : s.minTc.toString();
    console.log(
      `  ${lvl.toString().padStart(2, ' ')}  |  ${s.total.toString().padStart(2, ' ')}   |   ${s.generic
        .toString()
        .padStart(2, ' ')}    |     ${s.under3Ex.toString().padStart(2, ' ')}      |   ${s.under10Tc
        .toString()
        .padStart(2, ' ')}   |  ${minTcStr.padStart(2, ' ')} - ${s.maxTc.toString().padEnd(2, ' ')} (tot: ${s.totalTc
        .toString()
        .padStart(4, ' ')}) | ${s.total - s.missingSubopt}/${s.total}`
    );
  }
  console.log('================================================================================\n');

  return {
    totalProblems: problems.length,
    genericCount,
    under3ExamplesCount,
    under10TestCasesCount,
    missingSuboptimalCount,
    totalTestCases,
  };
}

if (require.main === module || process.argv[1]?.includes('auditCurriculum')) {
  const minLvl = process.argv[2] ? parseInt(process.argv[2], 10) : 1;
  const maxLvl = process.argv[3] ? parseInt(process.argv[3], 10) : 23;

  runCurriculumAudit({ minLevel: minLvl, maxLevel: maxLvl })
    .catch((err) => {
      console.error('Audit failed with error:', err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
