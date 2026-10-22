import { GeneratedProblem, GeneratedTestCase } from './types';
import { buildStandardTestSuite } from './oracleHelpers';

export interface ProblemDef {
  num: number;
  title: string;
  slug: string;
  level: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  topic: string;
  patternSlug: string;
  estimatedTimeMin: number;
  statement: string;
  functionName: string;
  parameters: { name: string; type: string; description: string }[];
  returnType: string;
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  optimalSolution: string;
  optimalTimeComplexity: string;
  optimalSpaceComplexity: string;
  suboptimalSolution: string;
  suboptimalTimeComplexity: string;
  suboptimalSpaceComplexity: string;
  executionModel?: 'FUNCTION' | 'DESIGN' | 'STDIN_STDOUT';
  starterTemplates?: { javascript: string; typescript: string; python: string };
  commonMistakes: string[];
  hints: string[];
  oracleFn: (...args: any[]) => any;
  testCases: {
    functional: any[][];
    boundary: any[][];
    adversarial: any[][];
    stress: any[][];
  };
}

export function createProblem(def: ProblemDef): GeneratedProblem {
  const testCases = buildStandardTestSuite(def.oracleFn, def.testCases);

  const paramNames = def.parameters.map((p) => p.name).join(', ');
  const tsParamSig = def.parameters.map((p) => `${p.name}: ${p.type}`).join(', ');
  const pyParamSig = def.parameters
    .map((p) => {
      let pyType = 'int';
      if (p.type.includes('number[]')) pyType = 'list[int]';
      else if (p.type.includes('string[]')) pyType = 'list[str]';
      else if (p.type.includes('string')) pyType = 'str';
      else if (p.type.includes('boolean')) pyType = 'bool';
      return `${p.name}: ${pyType}`;
    })
    .join(', ');

  const defaultStarterTemplates = {
    javascript: `/**\n * @param {${def.parameters.map((p) => p.type).join(', ')}}\n * @return {${def.returnType}}\n */\nfunction ${def.functionName}(${paramNames}) {\n  // Optimal ${def.optimalTimeComplexity} / ${def.optimalSpaceComplexity}\n};\n`,
    typescript: `function ${def.functionName}(${tsParamSig}): ${def.returnType} {\n  // Optimal ${def.optimalTimeComplexity} / ${def.optimalSpaceComplexity}\n  throw new Error("Not implemented");\n}\n`,
    python: `class Solution:\n    def ${def.functionName}(self, ${pyParamSig}) -> ${def.returnType}:\n        # Optimal ${def.optimalTimeComplexity}\n        pass\n`,
  };

  const starterTemplates = def.starterTemplates || defaultStarterTemplates;

  // Enforce Multi-Example Mandate (minimum 3 to 4 examples with explanations)
  const enrichedExamples: { input: string; output: string; explanation?: string }[] = [...def.examples];

  // Ensure all existing examples have human-readable explanations
  for (let i = 0; i < enrichedExamples.length; i++) {
    if (!enrichedExamples[i].explanation) {
      enrichedExamples[i].explanation = `Example ${i + 1} demonstrates execution of ${def.title} on standard input.`;
    }
  }

  // If fewer than 3 examples, synthesize high-quality boundary/adversarial examples from testCases
  const isDesign = (def.executionModel || 'FUNCTION') === 'DESIGN';
  const pool = [
    ...(def.testCases.boundary || []),
    ...(def.testCases.adversarial || []),
    ...(def.testCases.functional || []),
  ];

  for (const candidateArgs of pool) {
    if (enrichedExamples.length >= 3) break;

    try {
      let formattedInput = '';
      if (isDesign) {
        // Design format: candidateArgs is [commands, opArgs]
        formattedInput = `commands = ${JSON.stringify(candidateArgs[0])}\nargs = ${JSON.stringify(candidateArgs[1])}`;
      } else {
        formattedInput = def.parameters
          .map((p, idx) => `${p.name} = ${JSON.stringify(candidateArgs[idx])}`)
          .join(', ');
      }

      // Avoid duplicate inputs
      if (enrichedExamples.some((ex) => ex.input === formattedInput)) {
        continue;
      }

      // Compute exact expected output using the oracle function
      const rawOutput = def.oracleFn(...candidateArgs);
      const formattedOutput = JSON.stringify(rawOutput);

      const exIndex = enrichedExamples.length + 1;
      let explanation = '';
      if (exIndex === 2) {
        explanation = `Alternative case for ${def.title} covering distinct branch logic or variation.`;
      } else if (exIndex === 3) {
        explanation = `Edge/boundary case for ${def.title} testing minimal, empty, or single-element inputs.`;
      } else {
        explanation = `Adversarial / trick case for ${def.title} testing extreme values or alternating patterns.`;
      }

      enrichedExamples.push({
        input: formattedInput,
        output: formattedOutput,
        explanation,
      });
    } catch (e) {
      // Ignore any candidate that fails oracle
    }
  }

  return {
    num: def.num,
    title: def.title,
    slug: def.slug,
    level: def.level,
    difficulty: def.difficulty,
    topic: def.topic,
    patternSlug: def.patternSlug,
    estimatedTimeMin: def.estimatedTimeMin,
    statement: def.statement,
    executionModel: def.executionModel || 'FUNCTION',
    functionName: def.functionName,
    parameterDefinitions: def.parameters,
    returnType: def.returnType,
    constraints: def.constraints,
    examples: enrichedExamples,
    starterTemplates,
    optimalSolution: def.optimalSolution,
    optimalTimeComplexity: def.optimalTimeComplexity,
    optimalSpaceComplexity: def.optimalSpaceComplexity,
    suboptimalSolution: def.suboptimalSolution,
    suboptimalTimeComplexity: def.suboptimalTimeComplexity,
    suboptimalSpaceComplexity: def.suboptimalSpaceComplexity,
    commonMistakes: def.commonMistakes,
    hints: def.hints,
    testCases,
    oracleFn: def.oracleFn,
  };
}
