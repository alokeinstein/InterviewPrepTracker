/**
 * Isolated Worker Process for Code Execution.
 * Runs in a separate process outside the Next.js server.
 * Reads JSON request from stdin, executes tests with isolation, and writes JSON result to stdout.
 */

const { performance } = require('perf_hooks');

// Deep equality and normalized comparison
function normalizeValue(val) {
  if (val === undefined) return 'undefined';
  if (val === null) return null;
  if (typeof val === 'number') {
    if (isNaN(val)) return 'NaN';
    return val;
  }
  return val;
}

function deepEqual(actual, expected) {
  if (actual === expected) return true;

  if (typeof actual === 'number' && typeof expected === 'number') {
    if (isNaN(actual) && isNaN(expected)) return true;
    return Math.abs(actual - expected) < 1e-6;
  }

  if (actual == null || expected == null) {
    return actual === expected;
  }

  if (typeof actual !== typeof expected) return false;

  if (Array.isArray(actual) && Array.isArray(expected)) {
    if (actual.length !== expected.length) return false;
    for (let i = 0; i < actual.length; i++) {
      if (!deepEqual(actual[i], expected[i])) return false;
    }
    return true;
  }

  if (typeof actual === 'object' && typeof expected === 'object') {
    const keysA = Object.keys(actual);
    const keysB = Object.keys(expected);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(expected, key)) return false;
      if (!deepEqual(actual[key], expected[key])) return false;
    }
    return true;
  }

  return false;
}

function parseTestInput(inputStr) {
  if (typeof inputStr !== 'string') return [inputStr];
  const trimmed = inputStr.trim();
  
  // Try JSON.parse
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [parsed];
  } catch (e) {
    // If input is formatted like "nums = [2, 7, 11, 15], target = 9"
    // Extract key-value or array values
    try {
      // Try wrapping in array if comma-separated
      const wrapped = '[' + trimmed.replace(/([a-zA-Z0-9_]+)\s*=\s*/g, '') + ']';
      return JSON.parse(wrapped);
    } catch (e2) {
      return [inputStr];
    }
  }
}

function parseExpectedOutput(outputStr) {
  if (typeof outputStr !== 'string') return outputStr;
  const trimmed = outputStr.trim();
  try {
    return JSON.parse(trimmed);
  } catch (e) {
    if (trimmed.toLowerCase() === 'true') return true;
    if (trimmed.toLowerCase() === 'false') return false;
    if (!isNaN(Number(trimmed))) return Number(trimmed);
    return trimmed;
  }
}

async function run() {
  let rawData = '';
  process.stdin.setEncoding('utf8');

  for await (const chunk of process.stdin) {
    rawData += chunk;
  }

  if (!rawData.trim()) {
    process.stdout.write(JSON.stringify({
      status: 'RUNTIME_ERROR',
      runtimeMs: 0,
      memoryKb: 0,
      testCasesPassed: 0,
      totalTestCases: 0,
      logs: ['Empty execution request received'],
    }));
    process.exit(0);
  }

  let request;
  try {
    request = JSON.parse(rawData);
  } catch (err) {
    process.stdout.write(JSON.stringify({
      status: 'RUNTIME_ERROR',
      runtimeMs: 0,
      memoryKb: 0,
      testCasesPassed: 0,
      totalTestCases: 0,
      logs: ['Invalid JSON payload: ' + err.message],
    }));
    process.exit(0);
  }

  const {
    code = '',
    language = 'javascript',
    functionName = 'solve',
    executionModel = 'FUNCTION',
    testCases = [],
  } = request;

  const logs = [];
  const customConsole = {
    log: (...args) => {
      logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    },
    error: (...args) => {
      logs.push('[ERR] ' + args.map(a => String(a)).join(' '));
    },
    warn: (...args) => {
      logs.push('[WARN] ' + args.map(a => String(a)).join(' '));
    },
  };

  // Compile user code in a function scope with restricted environment
  let userModule = {};
  try {
    const wrappedCode = `
      "use strict";
      const console = __customConsole;
      ${code}
      
      return {
        targetFn: typeof ${functionName} !== 'undefined' ? ${functionName} : undefined,
        allFns: {
          ${functionName}: typeof ${functionName} !== 'undefined' ? ${functionName} : undefined,
          solve: typeof solve !== 'undefined' ? solve : undefined,
          twoSum: typeof twoSum !== 'undefined' ? twoSum : undefined,
        }
      };
    `;

    const factory = new Function('__customConsole', wrappedCode);
    userModule = factory(customConsole);
  } catch (compileErr) {
    process.stdout.write(JSON.stringify({
      status: 'COMPILE_ERROR',
      runtimeMs: 0,
      memoryKb: Math.round(process.memoryUsage().heapUsed / 1024),
      testCasesPassed: 0,
      totalTestCases: testCases.length,
      failedTestCase: {
        input: testCases[0]?.input || '',
        expected: testCases[0]?.expectedOutput || '',
        actual: 'Compilation / Syntax Error: ' + compileErr.message,
      },
      logs,
    }));
    process.exit(0);
  }

  // Identify target function
  let targetFn = userModule.targetFn;
  if (!targetFn) {
    // Try to find any defined function
    const candidates = Object.values(userModule.allFns).filter(fn => typeof fn === 'function');
    if (candidates.length > 0) {
      targetFn = candidates[0];
    }
  }

  if (typeof targetFn !== 'function') {
    process.stdout.write(JSON.stringify({
      status: 'RUNTIME_ERROR',
      runtimeMs: 0,
      memoryKb: Math.round(process.memoryUsage().heapUsed / 1024),
      testCasesPassed: 0,
      totalTestCases: testCases.length,
      failedTestCase: {
        input: testCases[0]?.input || '',
        expected: testCases[0]?.expectedOutput || '',
        actual: `Function "${functionName}" is not defined in submitted code. Please ensure the function signature matches "${functionName}".`,
      },
      logs,
    }));
    process.exit(0);
  }

  let passedCount = 0;
  let failedCase = null;
  const startTime = performance.now();

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const args = parseTestInput(tc.input);
    const expected = parseExpectedOutput(tc.expectedOutput);

    let actual;
    try {
      // Clone args so user mutations do not corrupt test cases
      const clonedArgs = JSON.parse(JSON.stringify(args));
      actual = targetFn(...clonedArgs);
    } catch (runtimeErr) {
      process.stdout.write(JSON.stringify({
        status: 'RUNTIME_ERROR',
        runtimeMs: Math.round(performance.now() - startTime),
        memoryKb: Math.round(process.memoryUsage().heapUsed / 1024),
        testCasesPassed: passedCount,
        totalTestCases: testCases.length,
        failedTestCase: {
          input: tc.input,
          expected: tc.expectedOutput,
          actual: `Runtime Exception on test #${i + 1}: ${runtimeErr.message}`,
        },
        logs,
      }));
      process.exit(0);
    }

    const matches = deepEqual(actual, expected);

    if (matches) {
      passedCount++;
    } else {
      failedCase = {
        input: tc.input,
        expected: typeof expected === 'object' ? JSON.stringify(expected) : String(expected),
        actual: typeof actual === 'object' ? JSON.stringify(actual) : String(actual),
      };
      break;
    }
  }

  const totalRuntime = Math.round(performance.now() - startTime);
  const memoryKb = Math.round(process.memoryUsage().heapUsed / 1024);

  process.stdout.write(JSON.stringify({
    status: passedCount === testCases.length ? 'ACCEPTED' : 'WRONG_ANSWER',
    runtimeMs: Math.max(1, totalRuntime),
    memoryKb,
    testCasesPassed: passedCount,
    totalTestCases: testCases.length,
    failedTestCase: failedCase,
    logs,
  }));
  process.exit(0);
}

run().catch(err => {
  process.stdout.write(JSON.stringify({
    status: 'RUNTIME_ERROR',
    runtimeMs: 0,
    memoryKb: 0,
    testCasesPassed: 0,
    totalTestCases: 0,
    logs: ['Fatal worker error: ' + err.message],
  }));
  process.exit(1);
});
