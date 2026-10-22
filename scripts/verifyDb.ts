import { prisma } from '../src/lib/prisma';

async function check() {
  for (let lvl = 1; lvl <= 6; lvl++) {
    const probs = await prisma.dsaProblem.findMany({
      where: { level: lvl },
      include: { testCases: true }
    });
    const totalTC = probs.reduce((acc, p) => acc + p.testCases.length, 0);
    const minTC = Math.min(...probs.map(p => p.testCases.length));
    const maxTC = Math.max(...probs.map(p => p.testCases.length));
    const withSuboptimal = probs.filter(p => !!p.suboptimalSolution).length;
    console.log(`Level ${lvl}: ${probs.length} problems, ${totalTC} test cases (min: ${minTC}, max: ${maxTC}), ${withSuboptimal}/${probs.length} with suboptimal benchmark.`);
  }
  await prisma.$disconnect();
}

check();
