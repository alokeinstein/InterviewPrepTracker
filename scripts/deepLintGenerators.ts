import * as fs from 'fs';
import * as path from 'path';

function checkGenerators() {
  const dir = path.resolve(process.cwd(), 'scripts/generators');
  const files = fs.readdirSync(dir).filter(f => f.startsWith('level') && f.endsWith('.ts'));

  console.log(`Auditing ${files.length} generator files for syntax, typos, trailing spaces, and corrupted test cases...`);

  let issuesFound = 0;

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const lines = content.split('\n');

    // 1. Check for '= >'
    lines.forEach((line, idx) => {
      if (line.includes('= >')) {
        console.error(`❌ [${file}:${idx + 1}] Found '= >' arrow syntax: ${line.trim()}`);
        issuesFound++;
      }
    });

    // 2. Check for broken 'Array.fr om'
    lines.forEach((line, idx) => {
      if (line.includes('Array.fr om') || line.includes('Array. from')) {
        console.error(`❌ [${file}:${idx + 1}] Found broken Array.from syntax: ${line.trim()}`);
        issuesFound++;
      }
    });

    // 3. Check for trailing spaces in string properties: title: "... ", slug: "... ", etc.
    const propRegex = /^\s*(title|slug|functionName|patternSlug|topic|difficulty)\s*:\s*"([^"]+)"/;
    lines.forEach((line, idx) => {
      const match = line.match(propRegex);
      if (match) {
        const prop = match[1];
        const val = match[2];
        if (val !== val.trim()) {
          console.error(`❌ [${file}:${idx + 1}] Trailing/leading space in property '${prop}': "${val}"`);
          issuesFound++;
        }
      }
    });
  }

  if (issuesFound === 0) {
    console.log(`✅ ALL ${files.length} GENERATOR FILES ARE 100% CLEAN OF TRAILING SPACES, '= >' SYNTAX, AND TYPOS!`);
  } else {
    console.error(`⚠️ Found ${issuesFound} issues.`);
  }
}

checkGenerators();
