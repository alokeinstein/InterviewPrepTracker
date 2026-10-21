import { spawn } from 'child_process';
import path from 'path';

export interface ExecutionResult {
  status: 'ACCEPTED' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 'RUNTIME_ERROR' | 'COMPILE_ERROR';
  runtimeMs: number;
  memoryKb: number;
  testCasesPassed: number;
  totalTestCases: number;
  optimalityScore: number;
  optimalRuntimeMs: number;
  maxAllowedRuntimeMs: number;
  efficiencyFeedback?: string;
  failedTestCase?: {
    input: string;
    expected: string;
    actual: string;
  };
  logs: string[];
}

export interface ExecutionTestCase {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface ExecutionOptions {
  functionName?: string;
  executionModel?: 'FUNCTION' | 'STDIN_STDOUT';
  timeoutMs?: number;
  optimalRuntimeMs?: number;
  maxAllowedRuntimeMs?: number;
  optimalTimeComplexity?: string;
}

export class CodeExecutionService {
  /**
   * Executes user code in an isolated child process outside the Next.js web process.
   * Isolates memory, handles infinite loops with hard process kill, and normalizes
   * problem-specific function signatures and test case arguments.
   */
  static async executeCode(
    code: string,
    language: string = 'javascript',
    testCases: ExecutionTestCase[] = [],
    options: ExecutionOptions = {}
  ): Promise<ExecutionResult> {
    const timeoutMs = options.timeoutMs || 4000;
    const functionName = options.functionName || 'solve';
    const executionModel = options.executionModel || 'FUNCTION';

    if (!testCases || testCases.length === 0) {
      testCases = [{ input: '[]', expectedOutput: '[]' }];
    }

    const workerPath = path.resolve(process.cwd(), 'src/services/execution/runnerWorker.js');

    const optimalRuntimeMs = options.optimalRuntimeMs || 45.0;
    const maxAllowedRuntimeMs = options.maxAllowedRuntimeMs || 1000.0;
    const optimalTimeComplexity = options.optimalTimeComplexity || 'O(N)';

    const buildFinalResult = (raw: any): ExecutionResult => {
      let optimalityScore = 0.0;
      let efficiencyFeedback = '';

      if (raw.status === 'ACCEPTED') {
        const actualTime = raw.runtimeMs ?? 50.0;
        if (actualTime <= optimalRuntimeMs) {
          optimalityScore = 100.0;
        } else if (actualTime >= maxAllowedRuntimeMs) {
          optimalityScore = 0.0;
        } else {
          // Optimality % = min(100, max(0, ((T_max_allowed - T_actual) / (T_max_allowed - T_optimal)) * 100))
          const score = ((maxAllowedRuntimeMs - actualTime) / (maxAllowedRuntimeMs - optimalRuntimeMs)) * 100.0;
          optimalityScore = Math.round(Math.min(100.0, Math.max(0.0, score)) * 10) / 10;
        }

        if (optimalityScore >= 90) {
          efficiencyFeedback = `Optimal Solution (${optimalityScore}% efficiency target). Reaches theoretical lower bound of ${optimalTimeComplexity}.`;
        } else if (optimalityScore >= 60) {
          efficiencyFeedback = `Passed functional tests, but solution is sub-optimal (${optimalityScore}% optimal). Look for redundant inner operations or memory re-allocations.`;
        } else {
          efficiencyFeedback = `Passed Functional Tests, but Solution is sub-optimal (${optimalityScore}% optimal). Try reducing time complexity from O(N^2) to ${optimalTimeComplexity}.`;
        }
      } else if (raw.status === 'TIME_LIMIT_EXCEEDED') {
        efficiencyFeedback = `Time Limit Exceeded (> ${maxAllowedRuntimeMs}ms). Asymptotic complexity exceeds acceptable bounds; optimize toward ${optimalTimeComplexity}.`;
      } else if (raw.status === 'WRONG_ANSWER') {
        efficiencyFeedback = `Functional test failure. Ensure edge cases and boundary conditions are covered before optimizing complexity.`;
      }

      return {
        ...raw,
        optimalityScore,
        optimalRuntimeMs,
        maxAllowedRuntimeMs,
        efficiencyFeedback,
      };
    };

    return new Promise<ExecutionResult>((resolve) => {
      let isSettled = false;

      const child = spawn('node', ['--max-old-space-size=64', workerPath], {
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      let stdout = '';
      let stderr = '';

      const timer = setTimeout(() => {
        if (!isSettled) {
          isSettled = true;
          try {
            child.kill('SIGKILL');
          } catch (e) {
            // Ignore kill errors
          }
          resolve(buildFinalResult({
            status: 'TIME_LIMIT_EXCEEDED',
            runtimeMs: timeoutMs,
            memoryKb: 0,
            testCasesPassed: 0,
            totalTestCases: testCases.length,
            failedTestCase: {
              input: testCases[0]?.input || '',
              expected: testCases[0]?.expectedOutput || '',
              actual: `Execution timed out after ${timeoutMs}ms (infinite loop or time limit exceeded)`,
            },
            logs: ['Execution timed out'],
          }));
        }
      }, timeoutMs);

      child.stdout.on('data', (chunk) => {
        stdout += chunk.toString();
      });

      child.stderr.on('data', (chunk) => {
        stderr += chunk.toString();
      });

      child.on('error', (err) => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timer);
          resolve(buildFinalResult({
            status: 'RUNTIME_ERROR',
            runtimeMs: 0,
            memoryKb: 0,
            testCasesPassed: 0,
            totalTestCases: testCases.length,
            failedTestCase: {
              input: testCases[0]?.input || '',
              expected: testCases[0]?.expectedOutput || '',
              actual: `Failed to spawn runner worker: ${err.message}`,
            },
            logs: [err.message],
          }));
        }
      });

      child.on('close', (exitCode) => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timer);

          if (!stdout.trim()) {
            resolve(buildFinalResult({
              status: 'RUNTIME_ERROR',
              runtimeMs: 0,
              memoryKb: 0,
              testCasesPassed: 0,
              totalTestCases: testCases.length,
              failedTestCase: {
                input: testCases[0]?.input || '',
                expected: testCases[0]?.expectedOutput || '',
                actual: stderr || `Worker exited with code ${exitCode}`,
              },
              logs: stderr ? [stderr] : [],
            }));
            return;
          }

          try {
            const parsed = JSON.parse(stdout);
            resolve(buildFinalResult(parsed));
          } catch (jsonErr) {
            resolve(buildFinalResult({
              status: 'RUNTIME_ERROR',
              runtimeMs: 0,
              memoryKb: 0,
              testCasesPassed: 0,
              totalTestCases: testCases.length,
              failedTestCase: {
                input: testCases[0]?.input || '',
                expected: testCases[0]?.expectedOutput || '',
                actual: `Could not parse worker output: ${stdout}`,
              },
              logs: [stdout, stderr].filter(Boolean),
            }));
          }
        }
      });

      // Write execution payload
      const payload = JSON.stringify({
        code,
        language,
        functionName,
        executionModel,
        testCases: testCases.map((tc) => ({
          input: tc.input,
          expectedOutput: tc.expectedOutput,
        })),
      });

      try {
        child.stdin.write(payload);
        child.stdin.end();
      } catch (writeErr: any) {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timer);
          resolve(buildFinalResult({
            status: 'RUNTIME_ERROR',
            runtimeMs: 0,
            memoryKb: 0,
            testCasesPassed: 0,
            totalTestCases: testCases.length,
            failedTestCase: {
              input: testCases[0]?.input || '',
              expected: testCases[0]?.expectedOutput || '',
              actual: `Error writing payload: ${writeErr.message}`,
            },
            logs: [writeErr.message],
          }));
        }
      }
    });
  }
}
