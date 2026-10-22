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

function TreeNode(val, left, right) {
  this.val = (val === undefined ? 0 : val);
  this.left = (left === undefined ? null : left);
  this.right = (right === undefined ? null : right);
}

function buildTree(arr) {
  if (!arr) return null;
  if (typeof arr === 'object' && !Array.isArray(arr)) return arr;
  if (!Array.isArray(arr) || arr.length === 0 || arr[0] === null || arr[0] === undefined) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const curr = queue.shift();
    if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
      curr.left = new TreeNode(arr[i]);
      queue.push(curr.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
      curr.right = new TreeNode(arr[i]);
      queue.push(curr.right);
    }
    i++;
  }
  return root;
}

function treeToArray(root) {
  if (!root) return [];
  if (Array.isArray(root)) return root;
  const res = [];
  const q = [root];
  while (q.length > 0) {
    const node = q.shift();
    if (node) {
      res.push(node.val);
      q.push(node.left);
      q.push(node.right);
    } else {
      res.push(null);
    }
  }
  while (res.length > 0 && res[res.length - 1] === null) res.pop();
  return res;
}

function ListNode(val, next) {
  this.val = (val === undefined ? 0 : val);
  this.next = (next === undefined ? null : next);
}

function buildList(arr) {
  if (!arr) return null;
  if (typeof arr === 'object' && !Array.isArray(arr)) return arr;
  if (!Array.isArray(arr) || arr.length === 0) return null;
  const dummy = new ListNode(0);
  let cur = dummy;
  for (const v of arr) {
    cur.next = new ListNode(v);
    cur = cur.next;
  }
  return dummy.next;
}

function listToArray(head) {
  if (!head) return [];
  if (Array.isArray(head)) return head;
  const res = [];
  let cur = head;
  while (cur) {
    res.push(cur.val);
    cur = cur.next;
  }
  return res;
}

const __globalHelpers = {
  TreeNode,
  buildTree,
  treeToArray,
  ListNode,
  buildList,
  listToArray
};

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
      ${functionName !== 'TreeNode' ? 'const TreeNode = __helpers.TreeNode;' : ''}
      ${functionName !== 'buildTree' ? 'const buildTree = __helpers.buildTree;' : ''}
      ${functionName !== 'treeToArray' ? 'const treeToArray = __helpers.treeToArray;' : ''}
      ${functionName !== 'ListNode' ? 'const ListNode = __helpers.ListNode;' : ''}
      ${functionName !== 'buildList' ? 'const buildList = __helpers.buildList;' : ''}
      ${functionName !== 'listToArray' ? 'const listToArray = __helpers.listToArray;' : ''}

      ${code}
      
      const __exported = {};
      try { if (typeof ${functionName} !== 'undefined') __exported['${functionName}'] = ${functionName}; } catch (e) {}
      try { if (typeof solve !== 'undefined') __exported['solve'] = solve; } catch (e) {}
      try { if (typeof twoSum !== 'undefined') __exported['twoSum'] = twoSum; } catch (e) {}
      try { if (typeof MyHashSet !== 'undefined') __exported['MyHashSet'] = MyHashSet; } catch (e) {}
      try { if (typeof LRUCache !== 'undefined') __exported['LRUCache'] = LRUCache; } catch (e) {}
      try { if (typeof MinStack !== 'undefined') __exported['MinStack'] = MinStack; } catch (e) {}
      try { if (typeof MyLinkedList !== 'undefined') __exported['MyLinkedList'] = MyLinkedList; } catch (e) {}
      try { if (typeof MedianFinder !== 'undefined') __exported['MedianFinder'] = MedianFinder; } catch (e) {}
      try { if (typeof TimeMap !== 'undefined') __exported['TimeMap'] = TimeMap; } catch (e) {}
      try { if (typeof Trie !== 'undefined') __exported['Trie'] = Trie; } catch (e) {}
      try { if (typeof WordDictionary !== 'undefined') __exported['WordDictionary'] = WordDictionary; } catch (e) {}
      try { if (typeof UndergroundSystem !== 'undefined') __exported['UndergroundSystem'] = UndergroundSystem; } catch (e) {}
      try { if (typeof BrowserHistory !== 'undefined') __exported['BrowserHistory'] = BrowserHistory; } catch (e) {}
      try { if (typeof MyQueue !== 'undefined') __exported['MyQueue'] = MyQueue; } catch (e) {}
      try { if (typeof MyStack !== 'undefined') __exported['MyStack'] = MyStack; } catch (e) {}
      try { if (typeof MyCircularQueue !== 'undefined') __exported['MyCircularQueue'] = MyCircularQueue; } catch (e) {}
      try { if (typeof StockSpanner !== 'undefined') __exported['StockSpanner'] = StockSpanner; } catch (e) {}
      try { if (typeof SeatManager !== 'undefined') __exported['SeatManager'] = SeatManager; } catch (e) {}
      try { if (typeof Twitter !== 'undefined') __exported['Twitter'] = Twitter; } catch (e) {}
      try { if (typeof KthLargest !== 'undefined') __exported['KthLargest'] = KthLargest; } catch (e) {}
      try { if (typeof Codec !== 'undefined') __exported['Codec'] = Codec; } catch (e) {}
      try { if (typeof MyCircularDeque !== 'undefined') __exported['MyCircularDeque'] = MyCircularDeque; } catch (e) {}
      try { if (typeof MyHashMap !== 'undefined') __exported['MyHashMap'] = MyHashMap; } catch (e) {}
      try { if (typeof SnapshotArray !== 'undefined') __exported['SnapshotArray'] = SnapshotArray; } catch (e) {}
      try { if (typeof MyCalendar !== 'undefined') __exported['MyCalendar'] = MyCalendar; } catch (e) {}
      try { if (typeof MyCalendarTwo !== 'undefined') __exported['MyCalendarTwo'] = MyCalendarTwo; } catch (e) {}
      try { if (typeof MyCalendarThree !== 'undefined') __exported['MyCalendarThree'] = MyCalendarThree; } catch (e) {}
      try { if (typeof RangeModule !== 'undefined') __exported['RangeModule'] = RangeModule; } catch (e) {}

      return {
        targetFn: __exported['${functionName}'] || Object.values(__exported)[0],
        allFns: __exported
      };
    `;

    const factory = new Function('__customConsole', '__helpers', wrappedCode);
    userModule = factory(customConsole, __globalHelpers);
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

  // Identify target function or class
  let targetFn = userModule.targetFn;
  if (!targetFn) {
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
        actual: executionModel === 'DESIGN'
          ? `Class or constructor "${functionName}" is not defined in submitted code. Please ensure you declare "class ${functionName} { ... }".`
          : `Function "${functionName}" is not defined in submitted code. Please ensure the function signature matches "${functionName}".`,
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

      if (executionModel === 'DESIGN') {
        // For DESIGN models: clonedArgs is [commands, opArgs]
        const commands = clonedArgs[0];
        const opArgs = clonedArgs[1];

        if (!Array.isArray(commands) || !Array.isArray(opArgs)) {
          throw new Error('DESIGN execution requires test case input in format [commands, args]');
        }

        const TargetClass = targetFn;
        // Constructor invocation with arguments for command 0
        const instance = new TargetClass(...(opArgs[0] || []));
        const results = [null]; // Instantiation returns null

        for (let cmdIdx = 1; cmdIdx < commands.length; cmdIdx++) {
          const cmd = commands[cmdIdx];
          const methodArgs = opArgs[cmdIdx] || [];

          if (typeof instance[cmd] !== 'function') {
            throw new Error(`Method "${cmd}" is not implemented on ${functionName}`);
          }

          const res = instance[cmd](...methodArgs);
          results.push(res !== undefined ? res : null);
        }
        actual = results;
      } else {
        actual = targetFn(...clonedArgs);
      }

      if (actual && typeof actual === 'object') {
        if (typeof actual.val !== 'undefined' && ('left' in actual || 'right' in actual)) {
          actual = treeToArray(actual);
        } else if (typeof actual.val !== 'undefined' && 'next' in actual) {
          actual = listToArray(actual);
        }
      }
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
