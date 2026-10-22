export interface GeneratedTestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  tier: 'FUNCTIONAL' | 'BOUNDARY' | 'ADVERSARIAL' | 'STRESS';
  explanation?: string;
  scaleN?: number;
}

export interface GeneratedProblem {
  num: number;
  title: string;
  slug: string;
  level: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  topic: string;
  subtopic?: string;
  patternSlug: string;
  estimatedTimeMin: number;
  statement: string;
  executionModel: 'FUNCTION' | 'DESIGN' | 'STDIN_STDOUT';
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
  testCases: GeneratedTestCase[];
  oracleFn?: (...args: any[]) => any;
}

export interface LevelPayload {
  level: number;
  levelTitle: string;
  topic: string;
  problems: GeneratedProblem[];
}
