import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const totalProblems = await prisma.dsaProblem.count();
  const totalTestCases = await prisma.testCase.count();
  const hiddenCount = await prisma.testCase.count({ where: { isHidden: true } });
  const publicCount = await prisma.testCase.count({ where: { isHidden: false } });

  // Tiers breakdown
  const tiers = await prisma.testCase.groupBy({
    by: ['tier'],
    _count: { id: true },
  });

  // Topics breakdown
  const topics = await prisma.dsaProblem.groupBy({
    by: ['topic'],
    _count: { id: true },
  });

  // Representative problems across different topics & levels
  const representativeTopics = [
    'Array',
    'String',
    'Linked List',
    'Tree',
    'Graph',
    'Dynamic Programming',
    'Design',
    'Binary Search',
    'Heap',
  ];

  const representativeProblems: any[] = [];
  for (const topic of representativeTopics) {
    const prob = await prisma.dsaProblem.findFirst({
      where: { topic },
      select: {
        id: true,
        leetcodeId: true,
        title: true,
        topic: true,
        level: true,
        difficulty: true,
        executionModel: true,
        testCases: {
          select: { id: true, isHidden: true, tier: true },
        },
      },
    });
    if (prob) {
      const publicCases = prob.testCases.filter((tc: any) => !tc.isHidden).length;
      const hiddenCases = prob.testCases.filter((tc: any) => tc.isHidden).length;
      representativeProblems.push({
        title: prob.title,
        id: prob.leetcodeId || prob.id,
        level: prob.level,
        topic: prob.topic,
        difficulty: prob.difficulty,
        model: prob.executionModel,
        totalTests: prob.testCases.length,
        publicTests: publicCases,
        hiddenTests: hiddenCases,
      });
    }
  }

  console.log(
    JSON.stringify(
      {
        totalProblems,
        totalTestCases,
        publicCount,
        hiddenCount,
        avgPerProblem: Number((totalTestCases / totalProblems).toFixed(1)),
        tiers: tiers.map((t) => ({ tier: t.tier, count: t._count.id })),
        topicsCount: topics.length,
        representativeProblems,
      },
      null,
      2
    )
  );
}

main().finally(() => prisma.$disconnect());
