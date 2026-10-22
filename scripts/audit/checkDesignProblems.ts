import * as path from 'path';

const designProbs: any[] = [];
for (let l = 1; l <= 23; l++) {
  const mod = require(path.resolve(`scripts/generators/level${l}.ts`));
  const payload = mod[`getLevel${l}Payload`]();
  for (const p of payload.problems) {
    if (p.executionModel === 'DESIGN') {
      designProbs.push({ num: p.num, title: p.title, functionName: p.functionName, level: l });
    }
  }
}
console.log('Total DESIGN problems found:', designProbs.length);
designProbs.forEach(p => console.log(`  #${p.num} [L${p.level}] ${p.title} -> ${p.functionName}`));
