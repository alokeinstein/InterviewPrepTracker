import { LevelPayload, GeneratedProblem } from './types';
import { createProblem } from './problemBuilder';

export function getLevel7Payload(): LevelPayload {
  const problems: GeneratedProblem[] = [
    // 144. Valid Parentheses
    createProblem({
      num: 144,
      title: "Valid Parentheses",
      slug: "valid-parentheses",
      level: 7,
      difficulty: "EASY",
      topic: "Stack",
      patternSlug: "stack-queue",
      estimatedTimeMin: 15,
      statement: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
      functionName: "isValid",
      parameters: [{ name: "s", type: "string", description: "String of brackets" }],
      returnType: "boolean",
      constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'."],
      examples: [
        { input: 's = "()"', output: "true", explanation: "Open bracket '(' is closed by matching ')'." },
        { input: 's = "()[]{}"', output: "true", explanation: "All bracket pairs open and close in correct order." },
        { input: 's = "(]"', output: "false", explanation: "Open bracket '(' is closed by mismatched bracket ']'." },
        { input: 's = "([)]"', output: "false", explanation: "Brackets close in interleaved incorrect order." }
      ],
      optimalSolution: `function isValid(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n  for (const ch of s) {\n    if (ch === '(' || ch === '{' || ch === '[') {\n      stack.push(ch);\n    } else {\n      if (stack.pop() !== map[ch]) return false;\n    }\n  }\n  return stack.length === 0;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function isValid(s) {\n  while (s.includes('()') || s.includes('{}') || s.includes('[]')) {\n    s = s.replace('()', '').replace('{}', '').replace('[]', '');\n  }\n  return s.length === 0;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Returning true when open brackets remain on stack", "Accessing stack.pop() on empty stack without checking"],
      hints: [
        "Use a LIFO stack to store unmatched open brackets.",
        "When an opening bracket appears, push it.",
        "When a closing bracket appears, check if it matches stack.top and pop."
      ],
      oracleFn: (s: string) => {
        const stack: string[] = [];
        const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
        for (const ch of s) {
          if (ch === '(' || ch === '{' || ch === '[') stack.push(ch);
          else if (stack.pop() !== map[ch]) return false;
        }
        return stack.length === 0;
      },
      testCases: {
        functional: [
          ["()"],
          ["()[]{}"],
          ["(]"],
          ["{[]}"]
        ],
        boundary: [
          ["("],
          [")"],
          ["((("],
          [")))"]
        ],
        adversarial: [
          ["([)]"],
          ["(([]){})"],
          ["{()[]}()"]
        ],
        stress: [
          ["(".repeat(2000) + ")".repeat(2000)],
          ["()".repeat(2500)]
        ]
      }
    }),

    // 145. Min Stack
    createProblem({
      num: 145,
      title: "Min Stack",
      slug: "min-stack",
      level: 7,
      difficulty: "MEDIUM",
      topic: "Stack / Design",
      patternSlug: "stack-queue",
      estimatedTimeMin: 20,
      statement: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.\n\nImplement the `MinStack` class:\n- `MinStack()` initializes the stack object.\n- `void push(int val)` pushes the element `val` onto the stack.\n- `void pop()` removes the element on the top of the stack.\n- `int top()` gets the top element of the stack.\n- `int getMin()` retrieves the minimum element in the stack.\n\nYou must implement a solution with `O(1)` time complexity for each function.",
      executionModel: "DESIGN",
      functionName: "MinStack",
      parameters: [
        { name: "commands", type: "string[]", description: "Array of operations: ['MinStack', 'push', 'pop', 'top', 'getMin']" },
        { name: "args", type: "any[]", description: "Arguments for each operation" }
      ],
      returnType: "any[]",
      starterTemplates: {
        javascript: `class MinStack {\n  constructor() {\n    // Initialize data structures\n  }\n  /**\n   * @param {number} val\n   * @return {void}\n   */\n  push(val) {}\n  /**\n   * @return {void}\n   */\n  pop() {}\n  /**\n   * @return {number}\n   */\n  top() {}\n  /**\n   * @return {number}\n   */\n  getMin() {}\n}\n`,
        typescript: `class MinStack {\n  constructor() {}\n  push(val: number): void {}\n  pop(): void {}\n  top(): number { throw new Error("Not implemented"); }\n  getMin(): number { throw new Error("Not implemented"); }\n}\n`,
        python: `class MinStack:\n    def __init__(self):\n        pass\n    def push(self, val: int) -> None:\n        pass\n    def pop(self) -> None:\n        pass\n    def top(self) -> int:\n        pass\n    def getMin(self) -> int:\n        pass\n`
      },
      constraints: ["-2^31 <= val <= 2^31 - 1", "Methods pop, top and getMin will always be called on non-empty stacks.", "At most 3 * 10^4 calls will be made to push, pop, top, and getMin."],
      examples: [
        {
          input: 'commands = ["MinStack","push","push","push","getMin","pop","top","getMin"]\nargs = [[],[-2],[0],[-3],[],[],[],[]]',
          output: "[null,null,null,null,-3,null,0,-2]",
          explanation: "MinStack minStack = new MinStack();\nminStack.push(-2);\nminStack.push(0);\nminStack.push(-3);\nminStack.getMin(); // return -3\nminStack.pop();\nminStack.top();    // return 0\nminStack.getMin(); // return -2"
        },
        {
          input: 'commands = ["MinStack","push","top","getMin"]\nargs = [[],[5],[],[]]',
          output: "[null,null,5,5]",
          explanation: "Single element pushed: top and minimum are both 5."
        },
        {
          input: 'commands = ["MinStack","push","push","getMin","pop","getMin"]\nargs = [[],[1],[1],[],[],[]]',
          output: "[null,null,null,1,null,1]",
          explanation: "Duplicate minimums: popping one duplicate retains the correct minimum 1."
        },
        {
          input: 'commands = ["MinStack","push","push","push","getMin"]\nargs = [[],[10],[5],[0],[]]',
          output: "[null,null,null,null,0]",
          explanation: "Strictly decreasing sequence correctly tracks newest minimum 0."
        }
      ],
      optimalSolution: `class MinStack {\n  constructor() {\n    this.stack = [];\n    this.minStack = [];\n  }\n  push(val) {\n    this.stack.push(val);\n    const currentMin = this.minStack.length === 0 ? val : Math.min(val, this.minStack[this.minStack.length - 1]);\n    this.minStack.push(currentMin);\n  }\n  pop() {\n    this.stack.pop();\n    this.minStack.pop();\n  }\n  top() {\n    return this.stack[this.stack.length - 1];\n  }\n  getMin() {\n    return this.minStack[this.minStack.length - 1];\n  }\n}`,
      optimalTimeComplexity: "O(1) for all operations",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `class MinStack {\n  constructor() {\n    this.stack = [];\n  }\n  push(val) {\n    this.stack.push(val);\n  }\n  pop() {\n    this.stack.pop();\n  }\n  top() {\n    return this.stack[this.stack.length - 1];\n  }\n  getMin() {\n    return Math.min(...this.stack);\n  }\n}`,
      suboptimalTimeComplexity: "O(N) for getMin",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Iterating through stack to find minimum upon getMin() violating O(1)", "Not handling duplicate minimums correctly when popping"],
      hints: [
        "Maintain a secondary stack that tracks the running minimum up to the current height.",
        "When pushing a value, also push min(val, currentMin) to the secondary stack.",
        "Pop simultaneously from both stacks."
      ],
      oracleFn: (operations: string[], args: any[]) => {
        class MinStack {
          stack: number[] = [];
          minStack: number[] = [];
          push(val: number) {
            this.stack.push(val);
            const m = this.minStack.length === 0 ? val : Math.min(val, this.minStack[this.minStack.length - 1]);
            this.minStack.push(m);
          }
          pop() {
            this.stack.pop();
            this.minStack.pop();
          }
          top() { return this.stack[this.stack.length - 1]; }
          getMin() { return this.minStack[this.minStack.length - 1]; }
        }
        let stack: any = null;
        const res: any[] = [];
        for (let i = 0; i < operations.length; i++) {
          const op = operations[i];
          if (op === 'MinStack') { stack = new MinStack(); res.push(null); }
          else if (op === 'push') { stack.push(args[i][0]); res.push(null); }
          else if (op === 'pop') { stack.pop(); res.push(null); }
          else if (op === 'top') { res.push(stack.top()); }
          else if (op === 'getMin') { res.push(stack.getMin()); }
        }
        return res;
      },
      testCases: {
        functional: [
          [["MinStack", "push", "push", "push", "getMin", "pop", "top", "getMin"], [[], [-2], [0], [-3], [], [], [], []]],
          [["MinStack", "push", "top", "getMin"], [[], [5], [], []]],
          [["MinStack", "push", "push", "getMin", "pop", "getMin"], [[], [1], [1], [], [], []]]
        ],
        boundary: [
          [["MinStack", "push", "getMin"], [[], [0], []]],
          [["MinStack", "push", "push", "getMin"], [[], [-2147483648], [2147483647], []]],
          [["MinStack", "push", "push", "pop", "top"], [[], [1], [2], [], []]]
        ],
        adversarial: [
          [["MinStack", "push", "push", "push", "pop", "getMin", "pop", "getMin"], [[], [2], [0], [3], [], [], [], []]],
          [["MinStack", "push", "push", "push", "push", "getMin", "pop", "getMin", "pop", "getMin"], [[], [5], [5], [5], [5], [], [], [], [], []]]
        ],
        stress: [
          [["MinStack", ...Array.from({ length: 500 }, () => "push"), ...Array.from({ length: 500 }, () => "getMin")], [[], ...Array.from({ length: 500 }, (_, i) => [500 - i]), ...Array.from({ length: 500 }, () => [])]],
          [["MinStack", ...Array.from({ length: 500 }, () => "push"), ...Array.from({ length: 500 }, () => "pop")], [[], ...Array.from({ length: 500 }, (_, i) => [i]), ...Array.from({ length: 500 }, () => [])]]
        ]
      }
    }),

    // 146. Implement Queue using Stacks
    createProblem({
      num: 146,
      title: "Implement Queue using Stacks",
      slug: "implement-queue-using-stacks",
      level: 7,
      difficulty: "EASY",
      topic: "Stack / Queue / Design",
      patternSlug: "stack-queue",
      estimatedTimeMin: 15,
      statement: "Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (`push`, `peek`, `pop`, and `empty`).\n\nImplement the `MyQueue` class:\n- `void push(int x)` Pushes element x to the back of the queue.\n- `int pop()` Removes the element from the front of the queue and returns it.\n- `int peek()` Returns the element at the front of the queue.\n- `boolean empty()` Returns `true` if the queue is empty, `false` otherwise.",
      executionModel: "DESIGN",
      functionName: "MyQueue",
      parameters: [
        { name: "commands", type: "string[]", description: "Array of operations" },
        { name: "args", type: "any[]", description: "Arguments for each operation" }
      ],
      returnType: "any[]",
      starterTemplates: {
        javascript: `class MyQueue {\n  constructor() {\n    // Initialize with two stacks\n  }\n  /**\n   * @param {number} x\n   * @return {void}\n   */\n  push(x) {}\n  /**\n   * @return {number}\n   */\n  pop() {}\n  /**\n   * @return {number}\n   */\n  peek() {}\n  /**\n   * @return {boolean}\n   */\n  empty() {}\n}\n`,
        typescript: `class MyQueue {\n  constructor() {}\n  push(x: number): void {}\n  pop(): number { throw new Error("Not implemented"); }\n  peek(): number { throw new Error("Not implemented"); }\n  empty(): boolean { throw new Error("Not implemented"); }\n}\n`,
        python: `class MyQueue:\n    def __init__(self):\n        pass\n    def push(self, x: int) -> None:\n        pass\n    def pop(self) -> int:\n        pass\n    def peek(self) -> int:\n        pass\n    def empty(self) -> bool:\n        pass\n`
      },
      constraints: ["1 <= x <= 9", "At most 100 calls will be made to push, pop, peek, and empty.", "All the calls to pop and peek are valid."],
      examples: [
        {
          input: 'commands = ["MyQueue","push","push","peek","pop","empty"]\nargs = [[],[1],[2],[],[],[]]',
          output: "[null,null,null,1,1,false]",
          explanation: "MyQueue myQueue = new MyQueue();\nmyQueue.push(1); // queue is: [1]\nmyQueue.push(2); // queue is: [1, 2]\nmyQueue.peek();  // return 1\nmyQueue.pop();   // return 1, queue is [2]\nmyQueue.empty(); // return false"
        },
        {
          input: 'commands = ["MyQueue","push","pop","empty"]\nargs = [[],[5],[],[]]',
          output: "[null,null,5,true]",
          explanation: "Pushing 5 then popping leaves queue empty."
        },
        {
          input: 'commands = ["MyQueue","empty"]\nargs = [[],[]]',
          output: "[null,true]",
          explanation: "Initial state is empty."
        },
        {
          input: 'commands = ["MyQueue","push","push","push","pop","peek"]\nargs = [[],[10],[20],[30],[],[]]',
          output: "[null,null,null,null,10,20]",
          explanation: "FIFO order preserved: 10 is popped first, leaving 20 as the front element."
        }
      ],
      optimalSolution: `class MyQueue {\n  constructor() {\n    this.inStack = [];\n    this.outStack = [];\n  }\n  push(x) {\n    this.inStack.push(x);\n  }\n  pop() {\n    this.peek();\n    return this.outStack.pop();\n  }\n  peek() {\n    if (this.outStack.length === 0) {\n      while (this.inStack.length > 0) {\n        this.outStack.push(this.inStack.pop());\n      }\n    }\n    return this.outStack[this.outStack.length - 1];\n  }\n  empty() {\n    return this.inStack.length === 0 && this.outStack.length === 0;\n  }\n}`,
      optimalTimeComplexity: "O(1) amortized per operation",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `class MyQueue {\n  constructor() {\n    this.arr = [];\n  }\n  push(x) { this.arr.push(x); }\n  pop() { return this.arr.shift(); }\n  peek() { return this.arr[0]; }\n  empty() { return this.arr.length === 0; }\n}`,
      suboptimalTimeComplexity: "O(N) unamortized array shift",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Transferring elements from inStack to outStack on every push rather than lazily on pop/peek"],
      hints: [
        "Use two stacks: inStack for pushes, outStack for pops.",
        "Only transfer elements from inStack to outStack when outStack is empty.",
        "This achieves O(1) amortized time."
      ],
      oracleFn: (operations: string[], args: any[]) => {
        const q: number[] = [];
        const res: any[] = [];
        for (let i = 0; i < operations.length; i++) {
          const op = operations[i];
          if (op === 'MyQueue') res.push(null);
          else if (op === 'push') { q.push(args[i][0]); res.push(null); }
          else if (op === 'pop') { res.push(q.shift()); }
          else if (op === 'peek') { res.push(q[0]); }
          else if (op === 'empty') { res.push(q.length === 0); }
        }
        return res;
      },
      testCases: {
        functional: [
          [["MyQueue", "push", "push", "peek", "pop", "empty"], [[], [1], [2], [], [], []]],
          [["MyQueue", "push", "pop", "empty"], [[], [5], [], []]],
          [["MyQueue", "empty"], [[], []]]
        ],
        boundary: [
          [["MyQueue", "push", "push", "peek"], [[], [1], [2], []]],
          [["MyQueue", "push", "peek", "pop", "empty"], [[], [9], [], [], []]],
          [["MyQueue", "push", "push", "pop", "pop", "empty"], [[], [1], [2], [], [], []]]
        ],
        adversarial: [
          [["MyQueue", "push", "pop", "push", "peek", "pop"], [[], [1], [], [2], [], []]],
          [["MyQueue", "push", "push", "pop", "push", "peek"], [[], [1], [2], [], [3], []]]
        ],
        stress: [
          [["MyQueue", ...Array.from({ length: 200 }, () => "push"), ...Array.from({ length: 200 }, () => "pop")], [[], ...Array.from({ length: 200 }, (_, i) => [i + 1]), ...Array.from({ length: 200 }, () => [])]],
          [["MyQueue", ...Array.from({ length: 300 }, (_, i) => i % 2 === 0 ? "push" : "peek")], [[], ...Array.from({ length: 300 }, (_, i) => i % 2 === 0 ? [i] : [])]]
        ]
      }
    }),

    // 147. Implement Stack using Queues
    createProblem({
      num: 147,
      title: "Implement Stack using Queues",
      slug: "implement-stack-using-queues",
      level: 7,
      difficulty: "EASY",
      topic: "Queue / Stack / Design",
      patternSlug: "stack-queue",
      estimatedTimeMin: 15,
      statement: "Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support all the functions of a normal stack (`push`, `top`, `pop`, and `empty`).\n\nImplement the `MyStack` class:\n- `void push(int x)` Pushes element x to the top of the stack.\n- `int pop()` Removes the element on the top of the stack and returns it.\n- `int top()` Returns the element on the top of the stack.\n- `boolean empty()` Returns `true` if the stack is empty, `false` otherwise.",
      executionModel: "DESIGN",
      functionName: "MyStack",
      parameters: [
        { name: "commands", type: "string[]", description: "Array of operations" },
        { name: "args", type: "any[]", description: "Arguments for each operation" }
      ],
      returnType: "any[]",
      starterTemplates: {
        javascript: `class MyStack {\n  constructor() {\n    // Initialize with queues\n  }\n  /**\n   * @param {number} x\n   * @return {void}\n   */\n  push(x) {}\n  /**\n   * @return {number}\n   */\n  pop() {}\n  /**\n   * @return {number}\n   */\n  top() {}\n  /**\n   * @return {boolean}\n   */\n  empty() {}\n}\n`,
        typescript: `class MyStack {\n  constructor() {}\n  push(x: number): void {}\n  pop(): number { throw new Error("Not implemented"); }\n  top(): number { throw new Error("Not implemented"); }\n  empty(): boolean { throw new Error("Not implemented"); }\n}\n`,
        python: `class MyStack:\n    def __init__(self):\n        pass\n    def push(self, x: int) -> None:\n        pass\n    def pop(self) -> int:\n        pass\n    def top(self) -> int:\n        pass\n    def empty(self) -> bool:\n        pass\n`
      },
      constraints: ["1 <= x <= 9", "At most 100 calls will be made to push, pop, top, and empty.", "All the calls to pop and top are valid."],
      examples: [
        {
          input: 'commands = ["MyStack","push","push","top","pop","empty"]\nargs = [[],[1],[2],[],[],[]]',
          output: "[null,null,null,2,2,false]",
          explanation: "MyStack myStack = new MyStack();\nmyStack.push(1);\nmyStack.push(2);\nmyStack.top();   // return 2\nmyStack.pop();   // return 2\nmyStack.empty(); // return False"
        },
        {
          input: 'commands = ["MyStack","push","pop","empty"]\nargs = [[],[7],[],[]]',
          output: "[null,null,7,true]",
          explanation: "Pushing 7 and popping returns 7 and leaves stack empty."
        },
        {
          input: 'commands = ["MyStack","empty"]\nargs = [[],[]]',
          output: "[null,true]",
          explanation: "Newly instantiated stack is empty."
        },
        {
          input: 'commands = ["MyStack","push","push","push","top"]\nargs = [[],[10],[20],[30],[]]',
          output: "[null,null,null,null,30]",
          explanation: "LIFO order: top element is the most recently added item (30)."
        }
      ],
      optimalSolution: `class MyStack {\n  constructor() {\n    this.queue = [];\n  }\n  push(x) {\n    this.queue.push(x);\n    let size = this.queue.length;\n    while (size > 1) {\n      this.queue.push(this.queue.shift());\n      size--;\n    }\n  }\n  pop() {\n    return this.queue.shift();\n  }\n  top() {\n    return this.queue[0];\n  }\n  empty() {\n    return this.queue.length === 0;\n  }\n}`,
      optimalTimeComplexity: "O(N) push, O(1) pop/top",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `class MyStack {\n  constructor() { this.arr = []; }\n  push(x) { this.arr.push(x); }\n  pop() { return this.arr.pop(); }\n  top() { return this.arr[this.arr.length - 1]; }\n  empty() { return this.arr.length === 0; }\n}`,
      suboptimalTimeComplexity: "O(1) raw array",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Using standard array methods directly without modeling queue operations (shift/push)"],
      hints: [
        "Can you do it with a single queue? After pushing x, rotate the previous elements behind x by dequeuing and reenqueuing.",
        "Now the newest element is always at the front of the queue."
      ],
      oracleFn: (operations: string[], args: any[]) => {
        const stack: number[] = [];
        const res: any[] = [];
        for (let i = 0; i < operations.length; i++) {
          const op = operations[i];
          if (op === 'MyStack') res.push(null);
          else if (op === 'push') { stack.push(args[i][0]); res.push(null); }
          else if (op === 'pop') { res.push(stack.pop()); }
          else if (op === 'top') { res.push(stack[stack.length - 1]); }
          else if (op === 'empty') { res.push(stack.length === 0); }
        }
        return res;
      },
      testCases: {
        functional: [
          [["MyStack", "push", "push", "top", "pop", "empty"], [[], [1], [2], [], [], []]],
          [["MyStack", "push", "pop", "empty"], [[], [7], [], []]],
          [["MyStack", "empty"], [[], []]]
        ],
        boundary: [
          [["MyStack", "push", "top"], [[], [1], []]],
          [["MyStack", "push", "push", "top"], [[], [1], [9], []]],
          [["MyStack", "push", "push", "pop", "top"], [[], [3], [4], [], []]]
        ],
        adversarial: [
          [["MyStack", "push", "pop", "push", "pop", "empty"], [[], [1], [], [2], [], []]],
          [["MyStack", "push", "push", "push", "pop", "pop", "pop"], [[], [1], [2], [3], [], [], []]]
        ],
        stress: [
          [["MyStack", ...Array.from({ length: 150 }, () => "push"), ...Array.from({ length: 150 }, () => "pop")], [[], ...Array.from({ length: 150 }, (_, i) => [i + 1]), ...Array.from({ length: 150 }, () => [])]],
          [["MyStack", ...Array.from({ length: 200 }, (_, i) => i % 2 === 0 ? "push" : "top")], [[], ...Array.from({ length: 200 }, (_, i) => i % 2 === 0 ? [i] : [])]]
        ]
      }
    }),

    // 148. Evaluate Reverse Polish Notation
    createProblem({
      num: 148,
      title: "Evaluate Reverse Polish Notation",
      slug: "evaluate-reverse-polish-notation",
      level: 7,
      difficulty: "MEDIUM",
      topic: "Stack",
      patternSlug: "stack-queue",
      estimatedTimeMin: 20,
      statement: "You are given an array of strings `tokens` that represents an arithmetic expression in a Reverse Polish Notation.\n\nEvaluate the expression. Return an integer that represents the value of the expression.\n\nNote that:\n- The valid operators are '+', '-', '*', and '/'.\n- Each operand may be an integer or another expression.\n- The division between two integers always truncates toward zero.\n- There will not be any division by zero.",
      functionName: "evalRPN",
      parameters: [{ name: "tokens", type: "string[]", description: "RPN tokens" }],
      returnType: "number",
      constraints: ["1 <= tokens.length <= 10^4", "tokens[i] is either an operator: '+', '-', '*', or '/', or an integer in the range [-200, 200]."],
      examples: [
        { input: 'tokens = ["2","1","+","3","*"]', output: "9", explanation: "((2 + 1) * 3) = 9" },
        { input: 'tokens = ["4","13","5","/","+"]', output: "6", explanation: "(4 + (13 / 5)) = 4 + 2 = 6" },
        { input: 'tokens = ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]', output: "22", explanation: "Evaluates to 22." },
        { input: 'tokens = ["18"]', output: "18", explanation: "Single token returns its integer value." }
      ],
      optimalSolution: `function evalRPN(tokens) {\n  const stack = [];\n  for (const t of tokens) {\n    if (t === '+' || t === '-' || t === '*' || t === '/') {\n      const b = stack.pop();\n      const a = stack.pop();\n      if (t === '+') stack.push(a + b);\n      else if (t === '-') stack.push(a - b);\n      else if (t === '*') stack.push(a * b);\n      else stack.push(Math.trunc(a / b));\n    } else {\n      stack.push(Number(t));\n    }\n  }\n  return stack[0];\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function evalRPN(tokens) {\n  // Recursion simulation\n  const t = [...tokens];\n  const stack = [];\n  for (const token of t) {\n    if (!isNaN(token)) stack.push(Number(token));\n    else {\n      const b = stack.pop(), a = stack.pop();\n      if (token === '+') stack.push(a + b);\n      if (token === '-') stack.push(a - b);\n      if (token === '*') stack.push(a * b);\n      if (token === '/') stack.push(Math.trunc(a / b));\n    }\n  }\n  return stack[0];\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Truncating toward negative infinity (Math.floor) instead of toward zero (Math.trunc) for negative numbers"],
      hints: [
        "Use a stack. Push numbers as you see them.",
        "When an operator is encountered, pop the last two numbers: second popped is left operand, first popped is right operand.",
        "Compute the result, push it back onto stack."
      ],
      oracleFn: (tokens: string[]) => {
        const stack: number[] = [];
        for (const t of tokens) {
          if (t === '+' || t === '-' || t === '*' || t === '/') {
            const b = stack.pop()!;
            const a = stack.pop()!;
            if (t === '+') stack.push(a + b);
            else if (t === '-') stack.push(a - b);
            else if (t === '*') stack.push(a * b);
            else stack.push(Math.trunc(a / b));
          } else {
            stack.push(Number(t));
          }
        }
        return stack[0];
      },
      testCases: {
        functional: [
          [["2", "1", "+", "3", "*"]],
          [["4", "13", "5", "/", "+"]],
          [["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]],
          [["18"]]
        ],
        boundary: [
          [["0", "3", "/"]],
          [["7", "-3", "/"]],
          [["-7", "3", "/"]],
          [["-7", "-3", "/"]]
        ],
        adversarial: [
          [["3", "4", "+", "5", "*", "6", "-"]],
          [["5", "1", "2", "+", "4", "*", "+", "3", "-"]]
        ],
        stress: [
          [[...Array.from({ length: 500 }, () => "1"), ...Array.from({ length: 499 }, () => "+")]],
          [[...Array.from({ length: 500 }, (_, i) => String(i % 5 + 1)), ...Array.from({ length: 499 }, () => "+")]]
        ]
      }
    }),

    // 149. Daily Temperatures
    createProblem({
      num: 149,
      title: "Daily Temperatures",
      slug: "daily-temperatures",
      level: 7,
      difficulty: "MEDIUM",
      topic: "Monotonic Stack",
      patternSlug: "stack-queue",
      estimatedTimeMin: 20,
      statement: "Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i`th day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0` instead.",
      functionName: "dailyTemperatures",
      parameters: [{ name: "temperatures", type: "number[]", description: "Array of temperatures" }],
      returnType: "number[]",
      constraints: ["1 <= temperatures.length <= 10^5", "30 <= temperatures[i] <= 100"],
      examples: [
        { input: "temperatures = [73,74,75,71,69,72,76,73]", output: "[1,1,4,2,1,1,0,0]", explanation: "Day 0: 73 -> Day 1: 74 (wait 1 day). Day 2: 75 -> Day 6: 76 (wait 4 days)." },
        { input: "temperatures = [30,40,50,60]", output: "[1,1,1,0]", explanation: "Each day is warmer than the previous." },
        { input: "temperatures = [30,60,90]", output: "[1,1,0]", explanation: "Each day warmer until max 90." },
        { input: "temperatures = [90,80,70]", output: "[0,0,0]", explanation: "Decreasing temperatures have no warmer future days." }
      ],
      optimalSolution: `function dailyTemperatures(temperatures) {\n  const n = temperatures.length;\n  const res = new Array(n).fill(0);\n  const stack = []; // store indices of monotonically decreasing temperatures\n  for (let i = 0; i < n; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prevIdx = stack.pop();\n      res[prevIdx] = i - prevIdx;\n    }\n    stack.push(i);\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function dailyTemperatures(temperatures) {\n  const n = temperatures.length;\n  const res = new Array(n).fill(0);\n  for (let i = 0; i < n; i++) {\n    for (let j = i + 1; j < n; j++) {\n      if (temperatures[j] > temperatures[i]) {\n        res[i] = j - i;\n        break;\n      }\n    }\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Storing values on the stack instead of indices, losing position distance"],
      hints: [
        "Use a monotonic decreasing stack storing indices.",
        "When the current temperature is warmer than temperatures[stack.top], pop and resolve the wait time.",
        "Push current index."
      ],
      oracleFn: (temperatures: number[]) => {
        const n = temperatures.length;
        const res = new Array(n).fill(0);
        const stack: number[] = [];
        for (let i = 0; i < n; i++) {
          while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
            const prev = stack.pop()!;
            res[prev] = i - prev;
          }
          stack.push(i);
        }
        return res;
      },
      testCases: {
        functional: [
          [[73, 74, 75, 71, 69, 72, 76, 73]],
          [[30, 40, 50, 60]],
          [[30, 60, 90]],
          [[90, 80, 70]]
        ],
        boundary: [
          [[50]],
          [[50, 50, 50]],
          [[30, 100]],
          [[100, 30]]
        ],
        adversarial: [
          [[89, 62, 70, 58, 47, 47, 46, 76, 100, 70]],
          [[70, 70, 71]]
        ],
        stress: [
          [Array.from({ length: 2000 }, (_, i) => 30 + (i % 70))],
          [Array.from({ length: 2500 }, (_, i) => 100 - (i % 50))]
        ]
      }
    }),

    // 150. Next Greater Element I
    createProblem({
      num: 150,
      title: "Next Greater Element I",
      slug: "next-greater-element-i",
      level: 7,
      difficulty: "EASY",
      topic: "Monotonic Stack",
      patternSlug: "stack-queue",
      estimatedTimeMin: 15,
      statement: "The next greater element of some element `x` in an array is the first greater element that is to the right of `x` in the same array.\n\nYou are given two distinct 0-indexed integer arrays `nums1` and `nums2`, where `nums1` is a subset of `nums2`.\n\nFor each `0 <= i < nums1.length`, find the index `j` such that `nums1[i] == nums2[j]` and determine the next greater element of `nums2[j]` in `nums2`. If there is no next greater element, then the answer for this query is `-1`.\n\nReturn an array `ans` of length `nums1.length`.",
      functionName: "nextGreaterElement",
      parameters: [
        { name: "nums1", type: "number[]", description: "Query subset array" },
        { name: "nums2", type: "number[]", description: "Reference array" }
      ],
      returnType: "number[]",
      constraints: ["1 <= nums1.length <= nums2.length <= 1000", "0 <= nums1[i], nums2[i] <= 10^4", "All integers in nums1 and nums2 are unique."],
      examples: [
        { input: "nums1 = [4,1,2], nums2 = [1,3,4,2]", output: "[-1,3,-1]", explanation: "4 -> no greater to right: -1. 1 -> 3. 2 -> no greater: -1." },
        { input: "nums1 = [2,4], nums2 = [1,2,3,4]", output: "[3,-1]", explanation: "2 -> 3. 4 -> -1." },
        { input: "nums1 = [1], nums2 = [1]", output: "[-1]", explanation: "Single element has no elements to its right." },
        { input: "nums1 = [1,3], nums2 = [1,2,3,4]", output: "[2,4]", explanation: "Next greater elements in ascending sequence." }
      ],
      optimalSolution: `function nextGreaterElement(nums1, nums2) {\n  const map = new Map();\n  const stack = [];\n  for (const num of nums2) {\n    while (stack.length > 0 && num > stack[stack.length - 1]) {\n      map.set(stack.pop(), num);\n    }\n    stack.push(num);\n  }\n  return nums1.map(x => map.get(x) ?? -1);\n}`,
      optimalTimeComplexity: "O(N + M)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function nextGreaterElement(nums1, nums2) {\n  return nums1.map(val => {\n    const idx = nums2.indexOf(val);\n    for (let j = idx + 1; j < nums2.length; j++) {\n      if (nums2[j] > val) return nums2[j];\n    }\n    return -1;\n  });\n}`,
      suboptimalTimeComplexity: "O(N * M)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Scanning nums2 repeatedly for each element of nums1 instead of precomputing next greater with monotonic stack"],
      hints: [
        "Traverse nums2 with a monotonic decreasing stack.",
        "Pop elements when a larger element is found and save the mapping in a hash map.",
        "Map nums1 using precomputed hash map values."
      ],
      oracleFn: (nums1: number[], nums2: number[]) => {
        const map = new Map<number, number>();
        const stack: number[] = [];
        for (const num of nums2) {
          while (stack.length > 0 && num > stack[stack.length - 1]) {
            map.set(stack.pop()!, num);
          }
          stack.push(num);
        }
        return nums1.map(x => map.get(x) ?? -1);
      },
      testCases: {
        functional: [
          [[4, 1, 2], [1, 3, 4, 2]],
          [[2, 4], [1, 2, 3, 4]],
          [[1], [1]],
          [[1, 3], [1, 2, 3, 4]]
        ],
        boundary: [
          [[1], [2, 1]],
          [[2], [2, 1]],
          [[0], [0, 5]]
        ],
        adversarial: [
          [[5, 4, 3], [5, 4, 3, 2, 1]],
          [[1, 2, 3], [3, 2, 1, 4]]
        ],
        stress: [
          [Array.from({ length: 500 }, (_, i) => i), Array.from({ length: 1000 }, (_, i) => i)],
          [Array.from({ length: 300 }, (_, i) => i * 2), Array.from({ length: 800 }, (_, i) => 800 - i)]
        ]
      }
    }),

    // 151. Next Greater Element II
    createProblem({
      num: 151,
      title: "Next Greater Element II",
      slug: "next-greater-element-ii",
      level: 7,
      difficulty: "MEDIUM",
      topic: "Monotonic Stack / Circular Array",
      patternSlug: "stack-queue",
      estimatedTimeMin: 20,
      statement: "Given a circular integer array `nums` (i.e., the next element of `nums[nums.length - 1]` is `nums[0]`), return the next greater number for every element in `nums`.\n\nThe next greater number of a number `x` is the first greater number to its traversing-order next in the array, which means you could search circularly to find its next greater number. If it doesn't exist, return `-1` for this number.",
      functionName: "nextGreaterElements",
      parameters: [{ name: "nums", type: "number[]", description: "Circular array" }],
      returnType: "number[]",
      constraints: ["1 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"],
      examples: [
        { input: "nums = [1,2,1]", output: "[2,-1,2]", explanation: "First 1 -> 2. 2 -> no greater (-1). Second 1 circularly finds 2." },
        { input: "nums = [1,2,3,4,3]", output: "[2,3,4,-1,4]", explanation: "Circular search finds 4 for last element 3." },
        { input: "nums = [5]", output: "[-1]", explanation: "Single element cannot be strictly greater than itself." },
        { input: "nums = [1,1,1]", output: "[-1,-1,-1]", explanation: "Identical elements have no strictly greater elements." }
      ],
      optimalSolution: `function nextGreaterElements(nums) {\n  const n = nums.length;\n  const res = new Array(n).fill(-1);\n  const stack = [];\n  for (let i = 0; i < 2 * n; i++) {\n    const num = nums[i % n];\n    while (stack.length > 0 && num > nums[stack[stack.length - 1]]) {\n      res[stack.pop()] = num;\n    }\n    if (i < n) stack.push(i);\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function nextGreaterElements(nums) {\n  const n = nums.length;\n  const res = new Array(n).fill(-1);\n  for (let i = 0; i < n; i++) {\n    for (let j = 1; j < n; j++) {\n      if (nums[(i + j) % n] > nums[i]) {\n        res[i] = nums[(i + j) % n];\n        break;\n      }\n    }\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Failing to wrap search with modulo (2 * n traversal)", "Overwriting previously resolved next greater elements during the second pass"],
      hints: [
        "Simulate circular array by iterating from 0 to 2 * n - 1 with index modulo n.",
        "Only push indices to stack on the first pass (i < n).",
        "Pop elements on both passes."
      ],
      oracleFn: (nums: number[]) => {
        const n = nums.length;
        const res = new Array(n).fill(-1);
        const stack: number[] = [];
        for (let i = 0; i < 2 * n; i++) {
          const num = nums[i % n];
          while (stack.length > 0 && num > nums[stack[stack.length - 1]]) {
            res[stack.pop()!] = num;
          }
          if (i < n) stack.push(i);
        }
        return res;
      },
      testCases: {
        functional: [
          [[1, 2, 1]],
          [[1, 2, 3, 4, 3]],
          [[5]],
          [[1, 1, 1]]
        ],
        boundary: [
          [[-1]],
          [[0, 0]],
          [[5, 4, 3, 2, 1]]
        ],
        adversarial: [
          [[100, 1, 11, 1, 120, 111, 123, 1, -1, -100]],
          [[3, 8, 4, 1, 2]]
        ],
        stress: [
          [Array.from({ length: 1500 }, (_, i) => i % 50)],
          [Array.from({ length: 2000 }, (_, i) => 2000 - i)]
        ]
      }
    }),

    // 152. Next Greater Element III
    createProblem({
      num: 152,
      title: "Next Greater Element III",
      slug: "next-greater-element-iii",
      level: 7,
      difficulty: "MEDIUM",
      topic: "Two Pointers / Math",
      patternSlug: "stack-queue",
      estimatedTimeMin: 20,
      statement: "Given a positive 32-bit integer `n`, find the smallest 32-bit integer which has exactly the same digits existing in the integer `n` and is greater in value than `n`. If no such positive 32-bit integer exists, return `-1`.\n\nNote that the returned integer should fit in 32-bit integer, if there is a valid answer but it does not fit in 32-bit integer, return `-1`.",
      functionName: "nextGreaterElement",
      parameters: [{ name: "n", type: "number", description: "Positive integer" }],
      returnType: "number",
      constraints: ["1 <= n <= 2^31 - 1"],
      examples: [
        { input: "n = 12", output: "21", explanation: "Permutations of digits {1, 2}: 21 is next greater." },
        { input: "n = 21", output: "-1", explanation: "Digits are descending, no greater permutation exists." },
        { input: "n = 101", output: "110", explanation: "Smallest greater permutation is 110." },
        { input: "n = 2147483486", output: "-1", explanation: "Value overflows 32-bit signed integer limit." }
      ],
      optimalSolution: `function nextGreaterElement(n) {\n  const s = String(n).split('');\n  let i = s.length - 2;\n  while (i >= 0 && s[i] >= s[i + 1]) i--;\n  if (i < 0) return -1;\n  let j = s.length - 1;\n  while (s[j] <= s[i]) j--;\n  [s[i], s[j]] = [s[j], s[i]];\n  const right = s.splice(i + 1).reverse();\n  const res = Number(s.concat(right).join(''));\n  return res <= 214748347 ? res : (res <= 2147483647 ? res : -1);\n}`,
      optimalTimeComplexity: "O(D) where D is number of digits",
      optimalSpaceComplexity: "O(D)",
      suboptimalSolution: `function nextGreaterElement(n) {\n  const s = String(n).split('');\n  let i = s.length - 2;\n  while (i >= 0 && s[i] >= s[i + 1]) i--;\n  if (i < 0) return -1;\n  let j = s.length - 1;\n  while (s[j] <= s[i]) j--;\n  [s[i], s[j]] = [s[j], s[i]];\n  let left = s.slice(0, i + 1);\n  let right = s.slice(i + 1).sort();\n  const res = Number(left.concat(right).join(''));\n  return res > 2147483647 ? -1 : res;\n}`,
      suboptimalTimeComplexity: "O(D log D)",
      suboptimalSpaceComplexity: "O(D)",
      commonMistakes: ["Forgetting 32-bit signed integer overflow bound (2147483647) check"],
      hints: [
        "This is identical to finding the next permutation of the digits array.",
        "Find the first dip from right to left.",
        "Swap with the next smallest larger digit to its right, then reverse the remaining suffix."
      ],
      oracleFn: (n: number) => {
        const s = String(n).split('');
        let i = s.length - 2;
        while (i >= 0 && s[i] >= s[i + 1]) i--;
        if (i < 0) return -1;
        let j = s.length - 1;
        while (s[j] <= s[i]) j--;
        [s[i], s[j]] = [s[j], s[i]];
        const right = s.splice(i + 1).reverse();
        const res = Number(s.concat(right).join(''));
        return res > 2147483647 ? -1 : res;
      },
      testCases: {
        functional: [
          [12],
          [21],
          [101],
          [230241]
        ],
        boundary: [
          [1],
          [9],
          [2147483647]
        ],
        adversarial: [
          [1999999999],
          [1234]
        ],
        stress: [
          [124651],
          [13542]
        ]
      }
    }),

    // 153. Online Stock Span
    createProblem({
      num: 153,
      title: "Online Stock Span",
      slug: "online-stock-span",
      level: 7,
      difficulty: "MEDIUM",
      topic: "Monotonic Stack / Design",
      patternSlug: "stack-queue",
      estimatedTimeMin: 20,
      statement: "Design an algorithm that collects daily price quotes for some stock and returns the span of that stock's price for the current day.\n\nThe span of the stock's price in one day is the maximum number of consecutive days (starting from that day and going backward) for which the stock price was less than or equal to the price of that day.\n\nImplement the `StockSpanner` class:\n- `StockSpanner()` Initializes the object of the class.\n- `int next(int price)` Returns the span of the stock's price given that today's price is `price`.",
      executionModel: "DESIGN",
      functionName: "StockSpanner",
      parameters: [
        { name: "commands", type: "string[]", description: "Array of operations" },
        { name: "args", type: "any[]", description: "Arguments for each operation" }
      ],
      returnType: "any[]",
      starterTemplates: {
        javascript: `class StockSpanner {\n  constructor() {\n    // Initialize monotonic stack\n  }\n  /**\n   * @param {number} price\n   * @return {number}\n   */\n  next(price) {}\n}\n`,
        typescript: `class StockSpanner {\n  constructor() {}\n  next(price: number): number { throw new Error("Not implemented"); }\n}\n`,
        python: `class StockSpanner:\n    def __init__(self):\n        pass\n    def next(self, price: int) -> int:\n        pass\n`
      },
      constraints: ["1 <= price <= 10^5", "At most 10^4 calls will be made to next."],
      examples: [
        {
          input: 'commands = ["StockSpanner","next","next","next","next","next","next","next"]\nargs = [[],[100],[80],[60],[70],[60],[75],[85]]',
          output: "[null,1,1,1,2,1,4,6]",
          explanation: "StockSpanner stockSpanner = new StockSpanner();\nstockSpanner.next(100); // return 1\nstockSpanner.next(80);  // return 1\nstockSpanner.next(60);  // return 1\nstockSpanner.next(70);  // return 2\nstockSpanner.next(60);  // return 1\nstockSpanner.next(75);  // return 4\nstockSpanner.next(85);  // return 6"
        },
        {
          input: 'commands = ["StockSpanner","next","next","next"]\nargs = [[],[10],[20],[30]]',
          output: "[null,1,2,3]",
          explanation: "Strictly increasing prices expand the span by 1 each day."
        },
        {
          input: 'commands = ["StockSpanner","next","next","next"]\nargs = [[],[50],[40],[30]]',
          output: "[null,1,1,1]",
          explanation: "Strictly decreasing prices yield span 1 for every day."
        },
        {
          input: 'commands = ["StockSpanner","next","next","next"]\nargs = [[],[31],[41],[41]]',
          output: "[null,1,2,3]",
          explanation: "Equal prices are counted in consecutive days (less than or equal)."
        }
      ],
      optimalSolution: `class StockSpanner {\n  constructor() {\n    this.stack = []; // [price, span]\n  }\n  next(price) {\n    let span = 1;\n    while (this.stack.length > 0 && this.stack[this.stack.length - 1][0] <= price) {\n      span += this.stack.pop()[1];\n    }\n    this.stack.push([price, span]);\n    return span;\n  }\n}`,
      optimalTimeComplexity: "O(1) amortized per call",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `class StockSpanner {\n  constructor() {\n    this.prices = [];\n  }\n  next(price) {\n    this.prices.push(price);\n    let span = 0;\n    for (let i = this.prices.length - 1; i >= 0; i--) {\n      if (this.prices[i] <= price) span++;\n      else break;\n    }\n    return span;\n  }\n}`,
      suboptimalTimeComplexity: "O(N) per call",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Scanning full array history backward on each next() call taking O(N^2) total"],
      hints: [
        "Store pairs of [price, span] in a monotonic decreasing stack.",
        "When a new price arrives, collapse all stack elements with price <= current price and accumulate their spans."
      ],
      oracleFn: (operations: string[], args: any[]) => {
        const stack: [number, number][] = [];
        const res: any[] = [];
        for (let i = 0; i < operations.length; i++) {
          const op = operations[i];
          if (op === 'StockSpanner') res.push(null);
          else if (op === 'next') {
            const price = args[i][0];
            let span = 1;
            while (stack.length > 0 && stack[stack.length - 1][0] <= price) {
              span += stack.pop()![1];
            }
            stack.push([price, span]);
            res.push(span);
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [["StockSpanner", "next", "next", "next", "next", "next", "next", "next"], [[], [100], [80], [60], [70], [60], [75], [85]]],
          [["StockSpanner", "next", "next", "next"], [[], [10], [20], [30]]],
          [["StockSpanner", "next", "next", "next"], [[], [50], [40], [30]]]
        ],
        boundary: [
          [["StockSpanner", "next"], [[], [1]]],
          [["StockSpanner", "next", "next"], [[], [100000], [100000]]],
          [["StockSpanner", "next", "next", "next"], [[], [1], [2], [1]]]
        ],
        adversarial: [
          [["StockSpanner", "next", "next", "next", "next"], [[], [30], [20], [25], [35]]],
          [["StockSpanner", "next", "next", "next", "next", "next"], [[], [10], [10], [10], [10], [10]]]
        ],
        stress: [
          [["StockSpanner", ...Array.from({ length: 500 }, () => "next")], [[], ...Array.from({ length: 500 }, (_, i) => [i + 1])]],
          [["StockSpanner", ...Array.from({ length: 500 }, () => "next")], [[], ...Array.from({ length: 500 }, (_, i) => [500 - i])]]
        ]
      }
    }),

    // 154. Asteroid Collision
    createProblem({
      num: 154,
      title: "Asteroid Collision",
      slug: "asteroid-collision",
      level: 7,
      difficulty: "MEDIUM",
      topic: "Stack",
      patternSlug: "stack-queue",
      estimatedTimeMin: 20,
      statement: "We are given an array `asteroids` of integers representing asteroids in a row.\n\nFor each asteroid, the absolute value represents its size, and the sign represents its direction (positive meaning right, negative meaning left). Each asteroid moves at the same speed.\n\nFind out the state of the asteroids after all collisions. If two asteroids meet, the smaller one will explode. If both are the same size, both will explode. Two asteroids moving in the same direction will never meet.",
      functionName: "asteroidCollision",
      parameters: [{ name: "asteroids", type: "number[]", description: "Array of signed asteroid sizes" }],
      returnType: "number[]",
      constraints: ["2 <= asteroids.length <= 10^4", "-1000 <= asteroids[i] <= 1000", "asteroids[i] != 0"],
      examples: [
        { input: "asteroids = [5,10,-5]", output: "[5,10]", explanation: "10 and -5 collide resulting in 10. 5 and 10 never collide." },
        { input: "asteroids = [8,-8]", output: "[]", explanation: "8 and -8 collide and both explode." },
        { input: "asteroids = [10,2,-5]", output: "[10]", explanation: "2 and -5 collide -> -5 remains. 10 and -5 collide -> 10 remains." },
        { input: "asteroids = [-2,-1,1,2]", output: "[-2,-1,1,2]", explanation: "Left-moving asteroids are already to the left of right-moving asteroids." }
      ],
      optimalSolution: `function asteroidCollision(asteroids) {\n  const stack = [];\n  for (const ast of asteroids) {\n    let alive = true;\n    while (alive && ast < 0 && stack.length > 0 && stack[stack.length - 1] > 0) {\n      const top = stack[stack.length - 1];\n      if (top < -ast) {\n        stack.pop();\n      } else if (top === -ast) {\n        stack.pop();\n        alive = false;\n      } else {\n        alive = false;\n      }\n    }\n    if (alive) stack.push(ast);\n  }\n  return stack;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function asteroidCollision(asteroids) {\n  let changed = true;\n  let res = [...asteroids];\n  while (changed) {\n    changed = false;\n    for (let i = 0; i < res.length - 1; i++) {\n      if (res[i] > 0 && res[i + 1] < 0) {\n        if (res[i] === -res[i + 1]) res.splice(i, 2);\n        else if (res[i] > -res[i + 1]) res.splice(i + 1, 1);\n        else res.splice(i, 1);\n        changed = true;\n        break;\n      }\n    }\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Colliding negative with positive when negative is already to the left (e.g. [-5, 5])"],
      hints: [
        "A collision only occurs when stack.top > 0 and incoming < 0.",
        "Simulate collisions using a while loop until the incoming asteroid explodes, destroys stack elements, or joins the stack."
      ],
      oracleFn: (asteroids: number[]) => {
        const stack: number[] = [];
        for (const ast of asteroids) {
          let alive = true;
          while (alive && ast < 0 && stack.length > 0 && stack[stack.length - 1] > 0) {
            const top = stack[stack.length - 1];
            if (top < -ast) stack.pop();
            else if (top === -ast) { stack.pop(); alive = false; }
            else alive = false;
          }
          if (alive) stack.push(ast);
        }
        return stack;
      },
      testCases: {
        functional: [
          [[5, 10, -5]],
          [[8, -8]],
          [[10, 2, -5]],
          [[-2, -1, 1, 2]]
        ],
        boundary: [
          [[1, -2]],
          [[-2, 1]],
          [[1, 1]],
          [[-1, -1]]
        ],
        adversarial: [
          [[1, -1, -2, -3]],
          [[10, -10, 5, -5]]
        ],
        stress: [
          [[...Array.from({ length: 500 }, () => 10), ...Array.from({ length: 500 }, () => -10)]],
          [[...Array.from({ length: 500 }, () => 20), ...Array.from({ length: 250 }, () => -10)]]
        ]
      }
    }),

    // 155. Car Fleet
    createProblem({
      num: 155,
      title: "Car Fleet",
      slug: "car-fleet",
      level: 7,
      difficulty: "MEDIUM",
      topic: "Monotonic Stack / Sorting",
      patternSlug: "stack-queue",
      estimatedTimeMin: 20,
      statement: "There are `n` cars at given miles away from the starting mile 0, traveling to reach the destination mile `target`.\n\nYou are given two integer array `position` and `speed`, both of length `n`, where `position[i]` is the starting position of the `i`th car and `speed[i]` is the speed of the `i`th car (in miles per hour).\n\nA car cannot pass another car ahead of it, but it can catch up to it and drive bumper to bumper at the same speed. The faster car will slow down to match the slower car's speed. The distance between these two cars is ignored.\n\nA car fleet is some non-empty set of cars driving at the same position and same speed. Note that a single car is also a car fleet.\n\nReturn the number of car fleets that will arrive at the destination.",
      functionName: "carFleet",
      parameters: [
        { name: "target", type: "number", description: "Target destination mile" },
        { name: "position", type: "number[]", description: "Car starting positions" },
        { name: "speed", type: "number[]", description: "Car speeds" }
      ],
      returnType: "number",
      constraints: ["n == position.length == speed.length", "1 <= n <= 10^5", "0 < target <= 10^6", "0 <= position[i] < target", "All values of position are unique.", "0 < speed[i] <= 10^6"],
      examples: [
        { input: "target = 12, position = [10,8,0,5,3], speed = [2,4,1,1,3]", output: "3", explanation: "Cars at 10 and 8 form a fleet arriving at 12. Cars at 5 and 3 form fleet arriving at 12. Car at 0 arrives alone. Total 3 fleets." },
        { input: "target = 10, position = [3], speed = [3]", output: "1", explanation: "Only one car, one fleet." },
        { input: "target = 100, position = [0,2,4], speed = [4,2,1]", output: "1", explanation: "All cars catch up and form a single fleet." },
        { input: "target = 10, position = [6,8], speed = [3,2]", output: "2", explanation: "Car at 8 arrives at time 1. Car at 6 arrives at time 1.33 (cannot catch up). 2 fleets." }
      ],
      optimalSolution: `function carFleet(target, position, speed) {\n  const cars = position.map((p, i) => [p, (target - p) / speed[i]]);\n  cars.sort((a, b) => b[0] - a[0]); // sort descending by position\n  let fleets = 0;\n  let maxTime = 0;\n  for (const [, time] of cars) {\n    if (time > maxTime) {\n      fleets++;\n      maxTime = time;\n    }\n  }\n  return fleets;\n}`,
      optimalTimeComplexity: "O(N log N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function carFleet(target, position, speed) {\n  const cars = [];\n  for (let i = 0; i < position.length; i++) cars.push({ p: position[i], t: (target - position[i]) / speed[i] });\n  cars.sort((a, b) => b.p - a.p);\n  const stack = [];\n  for (const c of cars) {\n    stack.push(c.t);\n    if (stack.length >= 2 && stack[stack.length - 1] <= stack[stack.length - 2]) {\n      stack.pop();\n    }\n  }\n  return stack.length;\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Sorting in ascending order instead of descending from closest to destination"],
      hints: [
        "Calculate the time each car needs to reach the target: (target - position) / speed.",
        "Sort cars by starting position descending (closest to target first).",
        "If a car behind takes <= time than the fleet in front, it joins that fleet."
      ],
      oracleFn: (target: number, position: number[], speed: number[]) => {
        const cars = position.map((p, i) => [p, (target - p) / speed[i]]);
        cars.sort((a, b) => b[0] - a[0]);
        let fleets = 0;
        let maxTime = 0;
        for (const [, time] of cars) {
          if (time > maxTime) {
            fleets++;
            maxTime = time;
          }
        }
        return fleets;
      },
      testCases: {
        functional: [
          [12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]],
          [10, [3], [3]],
          [100, [0, 2, 4], [4, 2, 1]],
          [10, [6, 8], [3, 2]]
        ],
        boundary: [
          [5, [4], [1]],
          [10, [0, 5], [1, 1]],
          [10, [0, 9], [10, 1]]
        ],
        adversarial: [
          [20, [6, 2, 17], [3, 9, 2]],
          [10, [1, 2, 3, 4], [4, 3, 2, 1]]
        ],
        stress: [
          [10000, Array.from({ length: 500 }, (_, i) => i * 10), Array.from({ length: 500 }, () => 5)],
          [50000, Array.from({ length: 800 }, (_, i) => i * 50), Array.from({ length: 800 }, (_, i) => (i % 20) + 1)]
        ]
      }
    }),

    // 156. Decode String
    createProblem({
      num: 156,
      title: "Decode String",
      slug: "decode-string",
      level: 7,
      difficulty: "MEDIUM",
      topic: "Stack",
      patternSlug: "stack-queue",
      estimatedTimeMin: 20,
      statement: "Given an encoded string, return its decoded string.\n\nThe encoding rule is: `k[encoded_string]`, where the `encoded_string` inside the square brackets is being repeated exactly `k` times. Note that `k` is guaranteed to be a positive integer.\n\nYou may assume that the input string is always valid; there are no extra white spaces, square brackets are well-formed, etc. Furthermore, you may assume that the original data does not contain any digits and that digits are only for those repeat numbers, `k`. For example, there will not be input like `3a` or `2[4]`.",
      functionName: "decodeString",
      parameters: [{ name: "s", type: "string", description: "Encoded string" }],
      returnType: "string",
      constraints: ["1 <= s.length <= 30", "s consists of lowercase English letters, digits, and square brackets '[]'.", "s is guaranteed to be a valid input.", "All the integers in s are in the range [1, 300]."],
      examples: [
        { input: 's = "3[a]2[bc]"', output: '"aaabcbc"', explanation: "3 'a's followed by 2 'bc's." },
        { input: 's = "3[a2[c]]"', output: '"accaccacc"', explanation: "Nested decoding: 2[c] -> 'cc', 3[a + 'cc'] -> 'accaccacc'." },
        { input: 's = "2[abc]3[cd]ef"', output: '"abcabccdcdcdef"', explanation: "Sequentially repeats segments and appends unrepeated suffix." },
        { input: 's = "abc"', output: '"abc"', explanation: "String without brackets remains unchanged." }
      ],
      optimalSolution: `function decodeString(s) {\n  const numStack = [];\n  const strStack = [];\n  let currNum = 0;\n  let currStr = '';\n  for (const ch of s) {\n    if (ch >= '0' && ch <= '9') {\n      currNum = currNum * 10 + Number(ch);\n    } else if (ch === '[') {\n      numStack.push(currNum);\n      strStack.push(currStr);\n      currNum = 0;\n      currStr = '';\n    } else if (ch === ']') {\n      const count = numStack.pop();\n      const prevStr = strStack.pop();\n      currStr = prevStr + currStr.repeat(count);\n    } else {\n      currStr += ch;\n    }\n  }\n  return currStr;\n}`,
      optimalTimeComplexity: "O(Length of output string)",
      optimalSpaceComplexity: "O(Length of output string)",
      suboptimalSolution: `function decodeString(s) {\n  while (s.includes('[')) {\n    s = s.replace(/(\\d+)\\[([a-z]+)\\]/g, (_, count, str) => str.repeat(Number(count)));\n  }\n  return s;\n}`,
      suboptimalTimeComplexity: "O(K * N^2) due to regex string allocations",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Failing to handle multi-digit multipliers like 100[a] correctly"],
      hints: [
        "Use two stacks: one for repeat counts (k) and one for preceding accumulated strings.",
        "When '[' is seen, save current state onto stacks and reset.",
        "When ']' is seen, pop k and previous string, and concatenate."
      ],
      oracleFn: (s: string) => {
        const numStack: number[] = [];
        const strStack: string[] = [];
        let currNum = 0;
        let currStr = '';
        for (const ch of s) {
          if (ch >= '0' && ch <= '9') {
            currNum = currNum * 10 + Number(ch);
          } else if (ch === '[') {
            numStack.push(currNum);
            strStack.push(currStr);
            currNum = 0;
            currStr = '';
          } else if (ch === ']') {
            const count = numStack.pop()!;
            const prev = strStack.pop()!;
            currStr = prev + currStr.repeat(count);
          } else {
            currStr += ch;
          }
        }
        return currStr;
      },
      testCases: {
        functional: [
          ["3[a]2[bc]"],
          ["3[a2[c]]"],
          ["2[abc]3[cd]ef"],
          ["abc"]
        ],
        boundary: [
          ["1[a]"],
          ["10[a]"],
          ["2[2[b]]"],
          ["z"]
        ],
        adversarial: [
          ["2[a2[b2[c]]]"],
          ["1[a]2[b]3[c]"]
        ],
        stress: [
          ["3[2[2[a]]]"],
          ["2[a]2[b]2[c]2[d]2[e]"]
        ]
      }
    }),

    // 157. Simplify Path
    createProblem({
      num: 157,
      title: "Simplify Path",
      slug: "simplify-path",
      level: 7,
      difficulty: "MEDIUM",
      topic: "Stack / String",
      patternSlug: "stack-queue",
      estimatedTimeMin: 15,
      statement: "Given an absolute path for a Unix-style file system, which begins with a slash `'/'`, transform this path into its simplified canonical path.\n\nIn Unix-style file system:\n- A single period `'.'` refers to the current directory.\n- A double period `'..'` refers to the directory up a level.\n- Multiple consecutive slashes such as `'//'` are treated as a single slash `'/'`.\n\nThe canonical path should have the following format:\n- The path must start with a single slash `'/'`.\n- Any two directories must be separated by a single slash `'/'`.\n- The path must not end with a trailing `'/'` unless it is the root directory.\n- The path must only contain directories on the path from the root directory to the target file or directory.",
      functionName: "simplifyPath",
      parameters: [{ name: "path", type: "string", description: "Unix file path" }],
      returnType: "string",
      constraints: ["1 <= path.length <= 3000", "path consists of English letters, digits, period '.', slash '/' or '_'.", "path is a valid absolute Unix path."],
      examples: [
        { input: 'path = "/home/"', output: '"/home"', explanation: "Trailing slash removed." },
        { input: 'path = "/../"', output: '"/"', explanation: "Going up one level from root stays at root." },
        { input: 'path = "/home//foo/"', output: '"/home/foo"', explanation: "Consecutive slashes condensed." },
        { input: 'path = "/a/./b/../../c/"', output: '"/c"', explanation: "'..' pops directories from path stack." }
      ],
      optimalSolution: `function simplifyPath(path) {\n  const parts = path.split('/');\n  const stack = [];\n  for (const part of parts) {\n    if (part === '' || part === '.') continue;\n    if (part === '..') {\n      if (stack.length > 0) stack.pop();\n    } else {\n      stack.push(part);\n    }\n  }\n  return '/' + stack.join('/');\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function simplifyPath(path) {\n  const p = path.split('/').filter(x => x && x !== '.');\n  const res = [];\n  for (const part of p) {\n    if (part === '..') res.pop();\n    else res.push(part);\n  }\n  return '/' + res.join('/');\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Not ignoring empty tokens caused by split on '//'", "Treating filenames like '...' or '..hidden' as parent directory commands"],
      hints: [
        "Split path by '/'.",
        "Iterate over directory tokens: ignore '' and '.', pop for '..', push everything else.",
        "Join stack elements with '/' and prepend '/'."
      ],
      oracleFn: (path: string) => {
        const parts = path.split('/');
        const stack: string[] = [];
        for (const p of parts) {
          if (p === '' || p === '.') continue;
          if (p === '..') {
            if (stack.length > 0) stack.pop();
          } else {
            stack.push(p);
          }
        }
        return '/' + stack.join('/');
      },
      testCases: {
        functional: [
          ["/home/"],
          ["/../"],
          ["/home//foo/"],
          ["/a/./b/../../c/"]
        ],
        boundary: [
          ["/"],
          ["/a"],
          ["/.."],
          ["/."]
        ],
        adversarial: [
          ["/a/../../b/../c//.//"],
          ["/.../a/../b/c/../d/.//"]
        ],
        stress: [
          ["/a/b/c/d/e/f/g/h".repeat(50)],
          ["/../".repeat(300)]
        ]
      }
    }),

    // 158. Remove K Digits
    createProblem({
      num: 158,
      title: "Remove K Digits",
      slug: "remove-k-digits",
      level: 7,
      difficulty: "MEDIUM",
      topic: "Monotonic Stack / Greedy",
      patternSlug: "stack-queue",
      estimatedTimeMin: 20,
      statement: "Given string `num` representing a non-negative integer, and an integer `k`, return the smallest possible integer after removing `k` digits from `num`.\n\nThe result must not contain leading zeroes, except for the number '0' itself.",
      functionName: "removeKdigits",
      parameters: [
        { name: "num", type: "string", description: "Digit string" },
        { name: "k", type: "number", description: "Number of digits to remove" }
      ],
      returnType: "string",
      constraints: ["1 <= k <= num.length <= 10^5", "num consists of only digits.", "num does not have any leading zeros except for the zero itself."],
      examples: [
        { input: 'num = "1432219", k = 3', output: '"1219"', explanation: "Remove digits 4, 3, and 2 to form smallest number 1219." },
        { input: 'num = "10200", k = 1', output: '"200"', explanation: "Remove leading 1; leading zeros stripped leaving 200." },
        { input: 'num = "10", k = 2', output: '"0"', explanation: "Removing all digits leaves 0." },
        { input: 'num = "9", k = 1', output: '"0"', explanation: "Single digit removed leaves 0." }
      ],
      optimalSolution: `function removeKdigits(num, k) {\n  const stack = [];\n  for (const digit of num) {\n    while (k > 0 && stack.length > 0 && stack[stack.length - 1] > digit) {\n      stack.pop();\n      k--;\n    }\n    stack.push(digit);\n  }\n  while (k > 0) {\n    stack.pop();\n    k--;\n  }\n  let res = stack.join('').replace(/^0+/, '');\n  return res === '' ? '0' : res;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function removeKdigits(num, k) {\n  let s = num;\n  for (let step = 0; step < k; step++) {\n    let removed = false;\n    for (let i = 0; i < s.length - 1; i++) {\n      if (s[i] > s[i + 1]) {\n        s = s.slice(0, i) + s.slice(i + 1);\n        removed = true;\n        break;\n      }\n    }\n    if (!removed) s = s.slice(0, -1);\n  }\n  s = s.replace(/^0+/, '');\n  return s === '' ? '0' : s;\n}`,
      suboptimalTimeComplexity: "O(K * N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Leaving remaining k removal quota unfulfilled when input is already ascending (e.g. 12345)", "Not trimming leading zeroes"],
      hints: [
        "A smaller leading digit makes the entire number smaller.",
        "Maintain a monotonic increasing stack. If current digit < stack.top, pop stack and decrement k.",
        "Strip leading zeroes before returning."
      ],
      oracleFn: (num: string, k: number) => {
        const stack: string[] = [];
        for (const digit of num) {
          while (k > 0 && stack.length > 0 && stack[stack.length - 1] > digit) {
            stack.pop();
            k--;
          }
          stack.push(digit);
        }
        while (k > 0) {
          stack.pop();
          k--;
        }
        const res = stack.join('').replace(/^0+/, '');
        return res === '' ? '0' : res;
      },
      testCases: {
        functional: [
          ["1432219", 3],
          ["10200", 1],
          ["10", 2],
          ["9", 1]
        ],
        boundary: [
          ["100", 1],
          ["1111", 2],
          ["12345", 2],
          ["54321", 2]
        ],
        adversarial: [
          ["112", 1],
          ["10001", 4]
        ],
        stress: [
          ["9".repeat(2000), 500],
          ["1234567890".repeat(200), 100]
        ]
      }
    }),

    // 159. Basic Calculator II
    createProblem({
      num: 159,
      title: "Basic Calculator II",
      slug: "basic-calculator-ii",
      level: 7,
      difficulty: "MEDIUM",
      topic: "Stack / Math",
      patternSlug: "stack-queue",
      estimatedTimeMin: 25,
      statement: "Given a string `s` which represents an expression, evaluate this expression and return its value.\n\nThe integer division should truncate toward zero.\n\nYou may assume that the given expression is always valid. All intermediate results will be in the range of `[-2^31, 2^31 - 1]`.\n\nNote: You are not allowed to use any built-in function which evaluates strings as mathematical expressions, such as `eval()`.",
      functionName: "calculate",
      parameters: [{ name: "s", type: "string", description: "Expression string containing +, -, *, /" }],
      returnType: "number",
      constraints: ["1 <= s.length <= 3 * 10^5", "s consists of integers and operators ('+', '-', '*', '/') separated by some number of spaces.", "s represents a valid expression.", "All the integers in the expression are non-negative integers in the range [0, 2^31 - 1]."],
      examples: [
        { input: 's = "3+2*2"', output: "7", explanation: "Multiplication precedes addition: 3 + 4 = 7." },
        { input: 's = " 3/2 "', output: "1", explanation: "Division truncates toward zero: 3/2 = 1." },
        { input: 's = " 3+5 / 2 "', output: "5", explanation: "5 / 2 = 2, then 3 + 2 = 5." },
        { input: 's = "42"', output: "42", explanation: "Single integer returns value." }
      ],
      optimalSolution: `function calculate(s) {\n  let curr = 0;\n  let op = '+';\n  const stack = [];\n  for (let i = 0; i < s.length; i++) {\n    const ch = s[i];\n    if (ch >= '0' && ch <= '9') {\n      curr = curr * 10 + Number(ch);\n    }\n    if ((!(ch >= '0' && ch <= '9') && ch !== ' ') || i === s.length - 1) {\n      if (op === '+') stack.push(curr);\n      else if (op === '-') stack.push(-curr);\n      else if (op === '*') stack.push(stack.pop() * curr);\n      else if (op === '/') stack.push(Math.trunc(stack.pop() / curr));\n      op = ch;\n      curr = 0;\n    }\n  }\n  return stack.reduce((a, b) => a + b, 0);\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function calculate(s) {\n  // Tokenize and multiple passes\n  const cleaned = s.replace(/\\s+/g, '');\n  return evalRPN_convert(cleaned);\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Failing to process the last number when loop finishes", "Not using Math.trunc for negative quotient division"],
      hints: [
        "Track the preceding operator (initialized to '+').",
        "When an operator or end of string is reached, apply preceding operator to current number and push to stack (* and / compute immediately with stack.pop()).",
        "Sum all numbers in the stack at the end."
      ],
      oracleFn: (s: string) => {
        let curr = 0;
        let op = '+';
        const stack: number[] = [];
        for (let i = 0; i < s.length; i++) {
          const ch = s[i];
          if (ch >= '0' && ch <= '9') curr = curr * 10 + Number(ch);
          if ((!(ch >= '0' && ch <= '9') && ch !== ' ') || i === s.length - 1) {
            if (op === '+') stack.push(curr);
            else if (op === '-') stack.push(-curr);
            else if (op === '*') stack.push(stack.pop()! * curr);
            else if (op === '/') stack.push(Math.trunc(stack.pop()! / curr));
            op = ch;
            curr = 0;
          }
        }
        return stack.reduce((a, b) => a + b, 0);
      },
      testCases: {
        functional: [
          ["3+2*2"],
          [" 3/2 "],
          [" 3+5 / 2 "],
          ["42"]
        ],
        boundary: [
          ["0"],
          ["1-1+1"],
          ["14-3/2"],
          ["100000000/1/2/3"]
        ],
        adversarial: [
          ["1-1-1"],
          ["2*3*4"],
          ["14/3*2"]
        ],
        stress: [
          ["1+1+1+".repeat(500) + "1"],
          ["2*1*1*".repeat(500) + "2"]
        ]
      }
    }),

    // 160. Basic Calculator
    createProblem({
      num: 160,
      title: "Basic Calculator",
      slug: "basic-calculator",
      level: 7,
      difficulty: "HARD",
      topic: "Stack / Recursion",
      patternSlug: "stack-queue",
      estimatedTimeMin: 30,
      statement: "Given a string `s` representing a valid expression, implement a basic calculator to evaluate it, and return the result of the evaluation.\n\nNote: You are not allowed to use any built-in function which evaluates strings as mathematical expressions, such as `eval()`.\n\nThe expression may contain parentheses '(', ')', plus '+', minus '-', non-negative integers, and spaces ' '.",
      functionName: "calculate",
      parameters: [{ name: "s", type: "string", description: "Expression with +, -, and parentheses" }],
      returnType: "number",
      constraints: ["1 <= s.length <= 3 * 10^5", "s consists of digits, '+', '-', '(', ')', and ' '.", "s represents a valid expression.", "'+' is not used as a unary operation.", "'-' could be used as a unary operation."],
      examples: [
        { input: 's = "1 + 1"', output: "2", explanation: "1 + 1 = 2" },
        { input: 's = " 2-1 + 2 "', output: "3", explanation: "2 - 1 + 2 = 3" },
        { input: 's = "(1+(4+5+2)-3)+(6+8)"', output: "23", explanation: "Parenthesized subexpressions evaluated in order: 23." },
        { input: 's = "- (3 + (4 + 5))"', output: "-12", explanation: "Unary minus distributed to parenthesized expression: -12." }
      ],
      optimalSolution: `function calculate(s) {\n  let result = 0;\n  let sign = 1;\n  let num = 0;\n  const stack = [];\n  for (let i = 0; i < s.length; i++) {\n    const ch = s[i];\n    if (ch >= '0' && ch <= '9') {\n      num = num * 10 + Number(ch);\n    } else if (ch === '+') {\n      result += sign * num;\n      num = 0;\n      sign = 1;\n    } else if (ch === '-') {\n      result += sign * num;\n      num = 0;\n      sign = -1;\n    } else if (ch === '(') {\n      stack.push(result);\n      stack.push(sign);\n      result = 0;\n      sign = 1;\n    } else if (ch === ')') {\n      result += sign * num;\n      num = 0;\n      result *= stack.pop(); // pop sign\n      result += stack.pop(); // pop previous result\n    }\n  }\n  return result + sign * num;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function calculate(s) {\n  // Recursive descent parser\n  let idx = 0;\n  function parse() {\n    let res = 0, sign = 1, num = 0;\n    while (idx < s.length) {\n      const ch = s[idx++];\n      if (ch >= '0' && ch <= '9') num = num * 10 + Number(ch);\n      else if (ch === '+') { res += sign * num; num = 0; sign = 1; }\n      else if (ch === '-') { res += sign * num; num = 0; sign = -1; }\n      else if (ch === '(') { num = parse(); }\n      else if (ch === ')') { res += sign * num; return res; }\n    }\n    return res + sign * num;\n  }\n  return parse();\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Failing to distribute signs when parentheses close", "Unary minus at beginning of string or sub-bracket"],
      hints: [
        "Since only '+' and '-' exist, you only need to track the current sign (+1 or -1).",
        "When '(' is encountered, push current accumulated result and current sign onto the stack, then reset.",
        "When ')' is encountered, finalize the inner result, multiply by popped sign, and add popped outer result."
      ],
      oracleFn: (s: string) => {
        let result = 0;
        let sign = 1;
        let num = 0;
        const stack: number[] = [];
        for (let i = 0; i < s.length; i++) {
          const ch = s[i];
          if (ch >= '0' && ch <= '9') {
            num = num * 10 + Number(ch);
          } else if (ch === '+') {
            result += sign * num;
            num = 0;
            sign = 1;
          } else if (ch === '-') {
            result += sign * num;
            num = 0;
            sign = -1;
          } else if (ch === '(') {
            stack.push(result);
            stack.push(sign);
            result = 0;
            sign = 1;
          } else if (ch === ')') {
            result += sign * num;
            num = 0;
            result *= stack.pop()!;
            result += stack.pop()!;
          }
        }
        return result + sign * num;
      },
      testCases: {
        functional: [
          ["1 + 1"],
          [" 2-1 + 2 "],
          ["(1+(4+5+2)-3)+(6+8)"],
          ["- (3 + (4 + 5))"]
        ],
        boundary: [
          ["0"],
          ["2147483647"],
          ["-(1)"],
          ["1-(     -2)"]
        ],
        adversarial: [
          ["(7)-(0)+(4)"],
          ["1-(5)"],
          ["(1-(4+5)-3)"]
        ],
        stress: [
          ["(".repeat(200) + "1" + "+1)".repeat(200)],
          ["1+" + "1+".repeat(500) + "1"]
        ]
      }
    }),

    // 161. Largest Rectangle in Histogram
    createProblem({
      num: 161,
      title: "Largest Rectangle in Histogram",
      slug: "largest-rectangle-in-histogram",
      level: 7,
      difficulty: "HARD",
      topic: "Monotonic Stack",
      patternSlug: "stack-queue",
      estimatedTimeMin: 25,
      statement: "Given an array of integers `heights` representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
      functionName: "largestRectangleArea",
      parameters: [{ name: "heights", type: "number[]", description: "Array of bar heights" }],
      returnType: "number",
      constraints: ["1 <= heights.length <= 10^5", "0 <= heights[i] <= 10^4"],
      examples: [
        { input: "heights = [2,1,5,6,2,3]", output: "10", explanation: "Bars at indices 2 and 3 with heights 5 and 6 have max rectangle area 2 * 5 = 10." },
        { input: "heights = [2,4]", output: "4", explanation: "Rectangle area 4 (either height 4 width 1 or height 2 width 2)." },
        { input: "heights = [1]", output: "1", explanation: "Single bar of height 1 has area 1." },
        { input: "heights = [0,0,0]", output: "0", explanation: "All zero heights produce area 0." }
      ],
      optimalSolution: `function largestRectangleArea(heights) {\n  const stack = [];\n  let maxArea = 0;\n  const h = [...heights, 0];\n  for (let i = 0; i < h.length; i++) {\n    while (stack.length > 0 && h[i] < h[stack[stack.length - 1]]) {\n      const height = h[stack.pop()];\n      const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;\n      maxArea = Math.max(maxArea, height * width);\n    }\n    stack.push(i);\n  }\n  return maxArea;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function largestRectangleArea(heights) {\n  let maxArea = 0;\n  for (let i = 0; i < heights.length; i++) {\n    let minH = heights[i];\n    for (let j = i; j < heights.length; j++) {\n      minH = Math.min(minH, heights[j]);\n      maxArea = Math.max(maxArea, minH * (j - i + 1));\n    }\n  }\n  return maxArea;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Failing to pop all remaining bars when array iteration ends (appending a 0-height sentinel solves this)"],
      hints: [
        "A bar can extend left and right as long as adjacent bars are at least as tall as it.",
        "Use a monotonic increasing stack of indices.",
        "When a shorter bar appears, pop from stack: the popped bar's height times the width between current index and new stack top is a candidate area."
      ],
      oracleFn: (heights: number[]) => {
        const stack: number[] = [];
        let maxArea = 0;
        const h = [...heights, 0];
        for (let i = 0; i < h.length; i++) {
          while (stack.length > 0 && h[i] < h[stack[stack.length - 1]]) {
            const height = h[stack.pop()!];
            const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
            maxArea = Math.max(maxArea, height * width);
          }
          stack.push(i);
        }
        return maxArea;
      },
      testCases: {
        functional: [
          [[2, 1, 5, 6, 2, 3]],
          [[2, 4]],
          [[1]],
          [[0, 0, 0]]
        ],
        boundary: [
          [[0]],
          [[10000]],
          [[1, 2, 3, 4, 5]],
          [[5, 4, 3, 2, 1]]
        ],
        adversarial: [
          [[2, 1, 2]],
          [[3, 6, 5, 7, 4, 8, 1, 0]],
          [[5, 5, 5, 5, 5]]
        ],
        stress: [
          [Array.from({ length: 2000 }, () => 1000)],
          [Array.from({ length: 2500 }, (_, i) => i % 100)]
        ]
      }
    }),

    // 162. Maximal Rectangle
    createProblem({
      num: 162,
      title: "Maximal Rectangle",
      slug: "maximal-rectangle",
      level: 7,
      difficulty: "HARD",
      topic: "Monotonic Stack / Dynamic Programming",
      patternSlug: "stack-queue",
      estimatedTimeMin: 25,
      statement: "Given a `rows x cols` binary `matrix` filled with `0`'s and `1`'s, find the largest rectangle containing only `1`'s and return its area.",
      functionName: "maximalRectangle",
      parameters: [{ name: "matrix", type: "string[][]", description: "2D binary character matrix" }],
      returnType: "number",
      constraints: ["rows == matrix.length", "cols == matrix[i].length", "1 <= row, cols <= 200", "matrix[i][j] is '0' or '1'."],
      examples: [
        { input: 'matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]', output: "6", explanation: "Largest rectangle of 1s has area 6 (height 3 width 2 or height 2 width 3)." },
        { input: 'matrix = [["0"]]', output: "0", explanation: "Single zero has area 0." },
        { input: 'matrix = [["1"]]', output: "1", explanation: "Single one has area 1." },
        { input: 'matrix = [["0","0"],["0","0"]]', output: "0", explanation: "Matrix of zeroes produces area 0." }
      ],
      optimalSolution: `function maximalRectangle(matrix) {\n  if (!matrix || matrix.length === 0) return 0;\n  const cols = matrix[0].length;\n  const heights = new Array(cols).fill(0);\n  let maxArea = 0;\n  for (const row of matrix) {\n    for (let c = 0; c < cols; c++) {\n      heights[c] = row[c] === '1' ? heights[c] + 1 : 0;\n    }\n    const stack = [];\n    const h = [...heights, 0];\n    for (let i = 0; i < h.length; i++) {\n      while (stack.length > 0 && h[i] < h[stack[stack.length - 1]]) {\n        const height = h[stack.pop()];\n        const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;\n        maxArea = Math.max(maxArea, height * width);\n      }\n      stack.push(i);\n    }\n  }\n  return maxArea;\n}`,
      optimalTimeComplexity: "O(R * C)",
      optimalSpaceComplexity: "O(C)",
      suboptimalSolution: `function maximalRectangle(matrix) {\n  // Brute force check all pairs of top-left and bottom-right coords\n  let maxArea = 0;\n  const R = matrix.length, C = matrix[0].length;\n  for (let r1 = 0; r1 < R; r1++) {\n    for (let c1 = 0; c1 < C; c1++) {\n      for (let r2 = r1; r2 < R; r2++) {\n        for (let c2 = c1; c2 < C; c2++) {\n          let allOnes = true;\n          for (let r = r1; r <= r2; r++) {\n            for (let c = c1; c <= c2; c++) {\n              if (matrix[r][c] !== '1') { allOnes = false; break; }\n            }\n            if (!allOnes) break;\n          }\n          if (allOnes) maxArea = Math.max(maxArea, (r2 - r1 + 1) * (c2 - c1 + 1));\n        }\n      }\n    }\n  }\n  return maxArea;\n}`,
      suboptimalTimeComplexity: "O(R^3 * C^3)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Not resetting height column to 0 when row contains '0'"],
      hints: [
        "Treat each row as the base of a histogram.",
        "Accumulate consecutive '1's into height array.",
        "Run the 'Largest Rectangle in Histogram' algorithm on each row's height array."
      ],
      oracleFn: (matrix: string[][]) => {
        if (!matrix || matrix.length === 0) return 0;
        const cols = matrix[0].length;
        const heights = new Array(cols).fill(0);
        let maxArea = 0;
        for (const row of matrix) {
          for (let c = 0; c < cols; c++) {
            heights[c] = row[c] === '1' ? heights[c] + 1 : 0;
          }
          const stack: number[] = [];
          const h = [...heights, 0];
          for (let i = 0; i < h.length; i++) {
            while (stack.length > 0 && h[i] < h[stack[stack.length - 1]]) {
              const height = h[stack.pop()!];
              const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
              maxArea = Math.max(maxArea, height * width);
            }
            stack.push(i);
          }
        }
        return maxArea;
      },
      testCases: {
        functional: [
          [[["1", "0", "1", "0", "0"], ["1", "0", "1", "1", "1"], ["1", "1", "1", "1", "1"], ["1", "0", "0", "1", "0"]]],
          [[["0"]]],
          [[["1"]]],
          [[["0", "0"], ["0", "0"]]]
        ],
        boundary: [
          [[["1", "1"], ["1", "1"]]],
          [[["1", "0"], ["1", "0"]]],
          [[["0", "1"], ["1", "0"]]]
        ],
        adversarial: [
          [[["1", "1", "1"], ["1", "0", "1"], ["1", "1", "1"]]],
          [[["0", "1", "1", "1"], ["1", "1", "1", "1"], ["1", "1", "0", "1"]]]
        ],
        stress: [
          [Array.from({ length: 50 }, () => Array.from({ length: 50 }, () => "1"))],
          [Array.from({ length: 60 }, (_, r) => Array.from({ length: 60 }, (_, c) => (r + c) % 2 === 0 ? "1" : "0"))]
        ]
      }
    }),

    // 163. 132 Pattern
    createProblem({
      num: 163,
      title: "132 Pattern",
      slug: "132-pattern",
      level: 7,
      difficulty: "MEDIUM",
      topic: "Monotonic Stack",
      patternSlug: "stack-queue",
      estimatedTimeMin: 20,
      statement: "Given an array of `n` integers `nums`, a 132 pattern is a subsequence of three integers `nums[i]`, `nums[j]` and `nums[k]` such that `i < j < k` and `nums[i] < nums[k] < nums[j]`.\n\nReturn `true` if there is a 132 pattern in `nums`, otherwise, return `false`.",
      functionName: "find132pattern",
      parameters: [{ name: "nums", type: "number[]", description: "Array of integers" }],
      returnType: "boolean",
      constraints: ["n == nums.length", "1 <= n <= 2 * 10^5", "-10^9 <= nums[i] <= 10^9"],
      examples: [
        { input: "nums = [1,2,3,4]", output: "false", explanation: "No 132 pattern in strictly ascending array." },
        { input: "nums = [3,1,4,2]", output: "true", explanation: "Subsequence [1, 4, 2] satisfies 1 < 2 < 4." },
        { input: "nums = [-1,3,2,0]", output: "true", explanation: "Subsequence [-1, 3, 2] or [-1, 3, 0] forms 132 pattern." },
        { input: "nums = [1,0,1,-4,-3]", output: "false", explanation: "No valid 132 pattern." }
      ],
      optimalSolution: `function find132pattern(nums) {\n  let third = -Infinity;\n  const stack = [];\n  for (let i = nums.length - 1; i >= 0; i--) {\n    if (nums[i] < third) return true;\n    while (stack.length > 0 && nums[i] > stack[stack.length - 1]) {\n      third = stack.pop();\n    }\n    stack.push(nums[i]);\n  }\n  return false;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function find132pattern(nums) {\n  const n = nums.length;\n  for (let i = 0; i < n; i++) {\n    for (let j = i + 1; j < n; j++) {\n      for (let k = j + 1; k < n; k++) {\n        if (nums[i] < nums[k] && nums[k] < nums[j]) return true;\n      }\n    }\n  }\n  return false;\n}`,
      suboptimalTimeComplexity: "O(N^3)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Traversing left to right instead of right to left, making tracking of 'third' element complicated"],
      hints: [
        "Traverse right to left.",
        "Maintain a monotonic decreasing stack from the right, representing candidate '2' values.",
        "The element popped from stack by a larger nums[i] becomes the candidate '3'. If any nums[k] < third appears, return true."
      ],
      oracleFn: (nums: number[]) => {
        let third = -Infinity;
        const stack: number[] = [];
        for (let i = nums.length - 1; i >= 0; i--) {
          if (nums[i] < third) return true;
          while (stack.length > 0 && nums[i] > stack[stack.length - 1]) {
            third = stack.pop()!;
          }
          stack.push(nums[i]);
        }
        return false;
      },
      testCases: {
        functional: [
          [[1, 2, 3, 4]],
          [[3, 1, 4, 2]],
          [[-1, 3, 2, 0]],
          [[1, 0, 1, -4, -3]]
        ],
        boundary: [
          [[1]],
          [[1, 2]],
          [[2, 1]],
          [[1, 3, 2]]
        ],
        adversarial: [
          [[3, 5, 0, 3, 4]],
          [[1, 2, 3, 4, 2]]
        ],
        stress: [
          [Array.from({ length: 2000 }, (_, i) => i)],
          [Array.from({ length: 2500 }, (_, i) => 2500 - i)]
        ]
      }
    }),

    // 164. Sum of Subarray Minimums
    createProblem({
      num: 164,
      title: "Sum of Subarray Minimums",
      slug: "sum-of-subarray-minimums",
      level: 7,
      difficulty: "MEDIUM",
      topic: "Monotonic Stack / Math",
      patternSlug: "stack-queue",
      estimatedTimeMin: 20,
      statement: "Given an array of integers `arr`, find the sum of `min(b)`, where `b` ranges over every (contiguous) subarray of `arr`. Since the answer may be large, return the answer modulo `10^9 + 7`.",
      functionName: "sumSubarrayMins",
      parameters: [{ name: "arr", type: "number[]", description: "Array of integers" }],
      returnType: "number",
      constraints: ["1 <= arr.length <= 3 * 10^4", "1 <= arr[i] <= 3 * 10^4"],
      examples: [
        { input: "arr = [3,1,2,4]", output: "17", explanation: "Subarrays: [3]->3, [1]->1, [2]->2, [4]->4, [3,1]->1, [1,2]->1, [2,4]->2, [3,1,2]->1, [1,2,4]->1, [3,1,2,4]->1. Sum = 17." },
        { input: "arr = [11,81,94,43,3]", output: "444", explanation: "Sum of all subarray minimums modulo 10^9+7 is 444." },
        { input: "arr = [71,55,82,55]", output: "593", explanation: "Handles duplicate values correctly with strict vs non-strict inequalities." },
        { input: "arr = [1]", output: "1", explanation: "Single element array has sum 1." }
      ],
      optimalSolution: `function sumSubarrayMins(arr) {\n  const MOD = 1000000007;\n  const n = arr.length;\n  const left = new Array(n).fill(0);\n  const right = new Array(n).fill(0);\n  let stack = [];\n  for (let i = 0; i < n; i++) {\n    while (stack.length > 0 && arr[stack[stack.length - 1]] > arr[i]) stack.pop();\n    left[i] = stack.length === 0 ? i + 1 : i - stack[stack.length - 1];\n    stack.push(i);\n  }\n  stack = [];\n  for (let i = n - 1; i >= 0; i--) {\n    while (stack.length > 0 && arr[stack[stack.length - 1]] >= arr[i]) stack.pop();\n    right[i] = stack.length === 0 ? n - i : stack[stack.length - 1] - i;\n    stack.push(i);\n  }\n  let sum = 0;\n  for (let i = 0; i < n; i++) {\n    sum = (sum + arr[i] * left[i] * right[i]) % MOD;\n  }\n  return sum;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function sumSubarrayMins(arr) {\n  const MOD = 1000000007;\n  let total = 0;\n  for (let i = 0; i < arr.length; i++) {\n    let minVal = arr[i];\n    for (let j = i; j < arr.length; j++) {\n      minVal = Math.min(minVal, arr[j]);\n      total = (total + minVal) % MOD;\n    }\n  }\n  return total;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Double counting duplicate elements: one pass must use strict '>' and the other '>='"],
      hints: [
        "For each element arr[i], count how many subarrays have arr[i] as their minimum.",
        "Count = (left[i] elements greater to the left) * (right[i] elements greater to the right).",
        "Use monotonic stacks to compute previous less element and next less element."
      ],
      oracleFn: (arr: number[]) => {
        const MOD = 1000000007;
        const n = arr.length;
        const left = new Array(n).fill(0);
        const right = new Array(n).fill(0);
        let stack: number[] = [];
        for (let i = 0; i < n; i++) {
          while (stack.length > 0 && arr[stack[stack.length - 1]] > arr[i]) stack.pop();
          left[i] = stack.length === 0 ? i + 1 : i - stack[stack.length - 1];
          stack.push(i);
        }
        stack = [];
        for (let i = n - 1; i >= 0; i--) {
          while (stack.length > 0 && arr[stack[stack.length - 1]] >= arr[i]) stack.pop();
          right[i] = stack.length === 0 ? n - i : stack[stack.length - 1] - i;
          stack.push(i);
        }
        let sum = 0;
        for (let i = 0; i < n; i++) {
          sum = (sum + arr[i] * left[i] * right[i]) % MOD;
        }
        return sum;
      },
      testCases: {
        functional: [
          [[3, 1, 2, 4]],
          [[11, 81, 94, 43, 3]],
          [[71, 55, 82, 55]],
          [[1]]
        ],
        boundary: [
          [[100]],
          [[1, 2, 3]],
          [[3, 2, 1]],
          [[5, 5, 5]]
        ],
        adversarial: [
          [[1, 3, 1, 2]],
          [[10, 1, 10, 1, 10]]
        ],
        stress: [
          [Array.from({ length: 1500 }, (_, i) => (i % 50) + 1)],
          [Array.from({ length: 2000 }, () => 100)]
        ]
      }
    }),

    // 165. Remove Duplicate Letters
    createProblem({
      num: 165,
      title: "Remove Duplicate Letters",
      slug: "remove-duplicate-letters",
      level: 7,
      difficulty: "MEDIUM",
      topic: "Monotonic Stack / Greedy",
      patternSlug: "stack-queue",
      estimatedTimeMin: 20,
      statement: "Given a string `s`, remove duplicate letters so that every letter appears once and only once. You must make sure your result is the smallest in lexicographical order among all possible results.",
      functionName: "removeDuplicateLetters",
      parameters: [{ name: "s", type: "string", description: "Input string" }],
      returnType: "string",
      constraints: ["1 <= s.length <= 10^4", "s consists of lowercase English letters."],
      examples: [
        { input: 's = "bcabc"', output: '"abc"', explanation: "Smallest lexicographical result containing unique characters {a, b, c}." },
        { input: 's = "cbacdcbc"', output: '"acdb"', explanation: "Lexicographically smallest unique subsequence." },
        { input: 's = "a"', output: '"a"', explanation: "Single character." },
        { input: 's = "bbcaac"', output: '"bac"', explanation: "Unique characters in smallest alphabetical order." }
      ],
      optimalSolution: `function removeDuplicateLetters(s) {\n  const lastIdx = new Map();\n  for (let i = 0; i < s.length; i++) lastIdx.set(s[i], i);\n  const stack = [];\n  const seen = new Set();\n  for (let i = 0; i < s.length; i++) {\n    const ch = s[i];\n    if (seen.has(ch)) continue;\n    while (stack.length > 0 && stack[stack.length - 1] > ch && lastIdx.get(stack[stack.length - 1]) > i) {\n      seen.delete(stack.pop());\n    }\n    stack.push(ch);\n    seen.add(ch);\n  }\n  return stack.join('');\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1) auxiliary space (at most 26 lowercase English letters)",
      suboptimalSolution: `function removeDuplicateLetters(s) {\n  // Recursive smallest char search\n  if (!s) return '';\n  const count = new Array(26).fill(0);\n  for (const c of s) count[c.charCodeAt(0) - 97]++;\n  let pos = 0;\n  for (let i = 0; i < s.length; i++) {\n    if (s[i] < s[pos]) pos = i;\n    if (--count[s[i].charCodeAt(0) - 97] === 0) break;\n  }\n  return s[pos] + removeDuplicateLetters(s.slice(pos + 1).replace(new RegExp(s[pos], 'g'), ''));\n}`,
      suboptimalTimeComplexity: "O(26 * N)",
      suboptimalSpaceComplexity: "O(26 * N)",
      commonMistakes: ["Popping a character from the stack even when it never appears again later in the string"],
      hints: [
        "Record the last occurrence index of each character.",
        "Use a monotonic increasing stack while tracking which characters are currently in the stack with a Set.",
        "Only pop stack.top if stack.top > current char AND stack.top appears again later in the string."
      ],
      oracleFn: (s: string) => {
        const lastIdx = new Map<string, number>();
        for (let i = 0; i < s.length; i++) lastIdx.set(s[i], i);
        const stack: string[] = [];
        const seen = new Set<string>();
        for (let i = 0; i < s.length; i++) {
          const ch = s[i];
          if (seen.has(ch)) continue;
          while (stack.length > 0 && stack[stack.length - 1] > ch && lastIdx.get(stack[stack.length - 1])! > i) {
            seen.delete(stack.pop()!);
          }
          stack.push(ch);
          seen.add(ch);
        }
        return stack.join('');
      },
      testCases: {
        functional: [
          ["bcabc"],
          ["cbacdcbc"],
          ["a"],
          ["bbcaac"]
        ],
        boundary: [
          ["ab"],
          ["ba"],
          ["aaaa"],
          ["abcdef"]
        ],
        adversarial: [
          ["mitnlrziptpqqnljxbqqm"],
          ["rusrnfdajbbbvkiildtaz"]
        ],
        stress: [
          ["abcdefghijklmnopqrstuvwxyz".repeat(100)],
          ["zyxwvutsrqponmlkjihgfedcba".repeat(100)]
        ]
      }
    }),

    // 166. Remove All Adjacent Duplicates In String II
    createProblem({
      num: 166,
      title: "Remove All Adjacent Duplicates In String II",
      slug: "remove-all-adjacent-duplicates-in-string-ii",
      level: 7,
      difficulty: "MEDIUM",
      topic: "Stack",
      patternSlug: "stack-queue",
      estimatedTimeMin: 20,
      statement: "You are given a string `s` and an integer `k`, a `k` duplicate removal consists of choosing `k` adjacent and equal letters from `s` and removing them, causing the left and the right of the deleted substring to concatenate together.\n\nWe repeatedly make `k` duplicate removals on `s` until we no longer can.\n\nReturn the final string after all such duplicate removals have been made. It is guaranteed that the answer is unique.",
      functionName: "removeDuplicates",
      parameters: [
        { name: "s", type: "string", description: "Input string" },
        { name: "k", type: "number", description: "Duplicate run length to remove" }
      ],
      returnType: "string",
      constraints: ["1 <= s.length <= 10^5", "2 <= k <= 10^4", "s only contains lowercase English letters."],
      examples: [
        { input: 's = "abcd", k = 2', output: '"abcd"', explanation: "No 2 adjacent identical letters." },
        { input: 's = "deeedbbcccbdaa", k = 3', output: '"aa"', explanation: "'eee' and 'ccc' removed -> 'ddbbbdaa' -> 'bbb' removed -> 'dddaa' -> 'ddd' removed -> 'aa'." },
        { input: 's = "pbbcggttciiippooaais", k = 2', output: '"ps"', explanation: "Repeated adjacent pair removals leave 'ps'." },
        { input: 's = "aaabbb", k = 3', output: '""', explanation: "Both triples removed leaving empty string." }
      ],
      optimalSolution: `function removeDuplicates(s, k) {\n  const stack = []; // [char, count]\n  for (const ch of s) {\n    if (stack.length > 0 && stack[stack.length - 1][0] === ch) {\n      stack[stack.length - 1][1]++;\n      if (stack[stack.length - 1][1] === k) stack.pop();\n    } else {\n      stack.push([ch, 1]);\n    }\n  }\n  return stack.map(([ch, cnt]) => ch.repeat(cnt)).join('');\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function removeDuplicates(s, k) {\n  let changed = true;\n  while (changed) {\n    changed = false;\n    for (let i = 0; i <= s.length - k; i++) {\n      const sub = s.slice(i, i + k);\n      if (sub === sub[0].repeat(k)) {\n        s = s.slice(0, i) + s.slice(i + k);\n        changed = true;\n        break;\n      }\n    }\n  }\n  return s;\n}`,
      suboptimalTimeComplexity: "O(N^2 / K)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Recounting letters with multiple passes rather than tracking frequency on stack top in a single pass"],
      hints: [
        "Store pairs of [char, count] on the stack.",
        "When incoming character matches stack.top[0], increment its count.",
        "If count reaches k, pop from stack."
      ],
      oracleFn: (s: string, k: number) => {
        const stack: [string, number][] = [];
        for (const ch of s) {
          if (stack.length > 0 && stack[stack.length - 1][0] === ch) {
            stack[stack.length - 1][1]++;
            if (stack[stack.length - 1][1] === k) stack.pop();
          } else {
            stack.push([ch, 1]);
          }
        }
        return stack.map(([ch, cnt]) => ch.repeat(cnt)).join('');
      },
      testCases: {
        functional: [
          ["abcd", 2],
          ["deeedbbcccbdaa", 3],
          ["pbbcggttciiippooaais", 2],
          ["aaabbb", 3]
        ],
        boundary: [
          ["a", 2],
          ["aa", 2],
          ["aaa", 3],
          ["a", 10]
        ],
        adversarial: [
          ["yfttsrrrmysiiismhhwwquuqqxxbbqueejiiccvvrrjjjhhmyymmhkakkjjhhhbvvvhhwwttwbwwwwhhyyhhx", 3],
          ["baabbbba", 2]
        ],
        stress: [
          ["a".repeat(2000), 2],
          ["ab".repeat(1000), 3]
        ]
      }
    }),

    // 167. Design Circular Queue
    createProblem({
      num: 167,
      title: "Design Circular Queue",
      slug: "design-circular-queue",
      level: 7,
      difficulty: "MEDIUM",
      topic: "Queue / Design",
      patternSlug: "stack-queue",
      estimatedTimeMin: 20,
      statement: "Design your implementation of the circular queue. The circular queue is a linear data structure in which the operations are performed based on FIFO (First In First Out) principle, and the last position is connected back to the first position to make a circle. It is also called 'Ring Buffer'.\n\nImplement the `MyCircularQueue` class:\n- `MyCircularQueue(k)` Initializes the object with the size of the queue to be `k`.\n- `int Front()` Gets the front item from the queue. If the queue is empty, return `-1`.\n- `int Rear()` Gets the last item from the queue. If the queue is empty, return `-1`.\n- `boolean enQueue(int value)` Inserts an element into the circular queue. Return true if successful.\n- `boolean deQueue()` Deletes an element from the circular queue. Return true if successful.\n- `boolean isEmpty()` Checks whether the circular queue is empty or not.\n- `boolean isFull()` Checks whether the circular queue is full or not.",
      executionModel: "DESIGN",
      functionName: "MyCircularQueue",
      parameters: [
        { name: "commands", type: "string[]", description: "Array of operations" },
        { name: "args", type: "any[]", description: "Arguments for each operation" }
      ],
      returnType: "any[]",
      starterTemplates: {
        javascript: `class MyCircularQueue {\n  /**\n   * @param {number} k\n   */\n  constructor(k) {\n    // Initialize ring buffer with capacity k\n  }\n  /**\n   * @param {number} value\n   * @return {boolean}\n   */\n  enQueue(value) {}\n  /**\n   * @return {boolean}\n   */\n  deQueue() {}\n  /**\n   * @return {number}\n   */\n  Front() {}\n  /**\n   * @return {number}\n   */\n  Rear() {}\n  /**\n   * @return {boolean}\n   */\n  isEmpty() {}\n  /**\n   * @return {boolean}\n   */\n  isFull() {}\n}\n`,
        typescript: `class MyCircularQueue {\n  constructor(k: number) {}\n  enQueue(value: number): boolean { throw new Error("Not implemented"); }\n  deQueue(): boolean { throw new Error("Not implemented"); }\n  Front(): number { throw new Error("Not implemented"); }\n  Rear(): number { throw new Error("Not implemented"); }\n  isEmpty(): boolean { throw new Error("Not implemented"); }\n  isFull(): boolean { throw new Error("Not implemented"); }\n}\n`,
        python: `class MyCircularQueue:\n    def __init__(self, k: int):\n        pass\n    def enQueue(self, value: int) -> bool:\n        pass\n    def deQueue(self) -> bool:\n        pass\n    def Front(self) -> int:\n        pass\n    def Rear(self) -> int:\n        pass\n    def isEmpty(self) -> bool:\n        pass\n    def isFull(self) -> bool:\n        pass\n`
      },
      constraints: ["1 <= k <= 1000", "0 <= value <= 1000", "At most 3000 calls will be made to enQueue, deQueue, Front, Rear, isEmpty, and isFull."],
      examples: [
        {
          input: 'commands = ["MyCircularQueue","enQueue","enQueue","enQueue","enQueue","Rear","isFull","deQueue","enQueue","Rear"]\nargs = [[3],[1],[2],[3],[4],[],[],[],[4],[]]',
          output: "[null,true,true,true,false,3,true,true,true,4]",
          explanation: "MyCircularQueue myCircularQueue = new MyCircularQueue(3);\nmyCircularQueue.enQueue(1); // return True\nmyCircularQueue.enQueue(2); // return True\nmyCircularQueue.enQueue(3); // return True\nmyCircularQueue.enQueue(4); // return False (queue full)\nmyCircularQueue.Rear();     // return 3\nmyCircularQueue.isFull();   // return True\nmyCircularQueue.deQueue();  // return True\nmyCircularQueue.enQueue(4); // return True\nmyCircularQueue.Rear();     // return 4"
        },
        {
          input: 'commands = ["MyCircularQueue","Front","Rear","isEmpty"]\nargs = [[2],[],[],[]]',
          output: "[null,-1,-1,true]",
          explanation: "Newly instantiated queue is empty; Front and Rear return -1."
        },
        {
          input: 'commands = ["MyCircularQueue","enQueue","Front","Rear"]\nargs = [[1],[5],[],[]]',
          output: "[null,true,5,5]",
          explanation: "Single element is both Front and Rear."
        },
        {
          input: 'commands = ["MyCircularQueue","enQueue","deQueue","deQueue"]\nargs = [[1],[10],[],[]]',
          output: "[null,true,true,false]",
          explanation: "DeQueue on empty queue returns false."
        }
      ],
      optimalSolution: `class MyCircularQueue {\n  constructor(k) {\n    this.k = k;\n    this.queue = new Array(k);\n    this.head = 0;\n    this.tail = -1;\n    this.size = 0;\n  }\n  enQueue(value) {\n    if (this.isFull()) return false;\n    this.tail = (this.tail + 1) % this.k;\n    this.queue[this.tail] = value;\n    this.size++;\n    return true;\n  }\n  deQueue() {\n    if (this.isEmpty()) return false;\n    this.head = (this.head + 1) % this.k;\n    this.size--;\n    return true;\n  }\n  Front() {\n    return this.isEmpty() ? -1 : this.queue[this.head];\n  }\n  Rear() {\n    return this.isEmpty() ? -1 : this.queue[this.tail];\n  }\n  isEmpty() {\n    return this.size === 0;\n  }\n  isFull() {\n    return this.size === this.k;\n  }\n}`,
      optimalTimeComplexity: "O(1) for all operations",
      optimalSpaceComplexity: "O(K)",
      suboptimalSolution: `class MyCircularQueue {\n  constructor(k) {\n    this.k = k;\n    this.arr = [];\n  }\n  enQueue(val) {\n    if (this.arr.length >= this.k) return false;\n    this.arr.push(val);\n    return true;\n  }\n  deQueue() {\n    if (this.arr.length === 0) return false;\n    this.arr.shift();\n    return true;\n  }\n  Front() { return this.arr.length === 0 ? -1 : this.arr[0]; }\n  Rear() { return this.arr.length === 0 ? -1 : this.arr[this.arr.length - 1]; }\n  isEmpty() { return this.arr.length === 0; }\n  isFull() { return this.arr.length === this.k; }\n}`,
      suboptimalTimeComplexity: "O(N) deQueue due to array shift",
      suboptimalSpaceComplexity: "O(K)",
      commonMistakes: ["Index modulo wrapping bugs when calculating tail index with negative values"],
      hints: [
        "Use a fixed-size array of size k.",
        "Track head and tail pointers along with current size.",
        "Advance head = (head + 1) % k on deQueue and tail = (tail + 1) % k on enQueue."
      ],
      oracleFn: (operations: string[], args: any[]) => {
        class MyCircularQueue {
          k: number;
          arr: number[];
          head = 0;
          tail = -1;
          size = 0;
          constructor(k: number) { this.k = k; this.arr = new Array(k); }
          enQueue(val: number) {
            if (this.isFull()) return false;
            this.tail = (this.tail + 1) % this.k;
            this.arr[this.tail] = val;
            this.size++;
            return true;
          }
          deQueue() {
            if (this.isEmpty()) return false;
            this.head = (this.head + 1) % this.k;
            this.size--;
            return true;
          }
          Front() { return this.isEmpty() ? -1 : this.arr[this.head]; }
          Rear() { return this.isEmpty() ? -1 : this.arr[this.tail]; }
          isEmpty() { return this.size === 0; }
          isFull() { return this.size === this.k; }
        }
        let q: any = null;
        const res: any[] = [];
        for (let i = 0; i < operations.length; i++) {
          const op = operations[i];
          if (op === 'MyCircularQueue') { q = new MyCircularQueue(args[i][0]); res.push(null); }
          else if (op === 'enQueue') res.push(q.enQueue(args[i][0]));
          else if (op === 'deQueue') res.push(q.deQueue());
          else if (op === 'Front') res.push(q.Front());
          else if (op === 'Rear') res.push(q.Rear());
          else if (op === 'isEmpty') res.push(q.isEmpty());
          else if (op === 'isFull') res.push(q.isFull());
        }
        return res;
      },
      testCases: {
        functional: [
          [["MyCircularQueue", "enQueue", "enQueue", "enQueue", "enQueue", "Rear", "isFull", "deQueue", "enQueue", "Rear"], [[3], [1], [2], [3], [4], [], [], [], [4], []]],
          [["MyCircularQueue", "Front", "Rear", "isEmpty"], [[2], [], [], []]],
          [["MyCircularQueue", "enQueue", "Front", "Rear"], [[1], [5], [], []]],
          [["MyCircularQueue", "enQueue", "deQueue", "deQueue"], [[1], [10], [], []]]
        ],
        boundary: [
          [["MyCircularQueue", "isFull", "isEmpty"], [[1], [], []]],
          [["MyCircularQueue", "enQueue", "isFull"], [[1], [1], []]],
          [["MyCircularQueue", "enQueue", "deQueue", "isEmpty"], [[1], [1], [], []]]
        ],
        adversarial: [
          [["MyCircularQueue", "enQueue", "enQueue", "deQueue", "enQueue", "Rear"], [[2], [1], [2], [], [3], []]],
          [["MyCircularQueue", "enQueue", "deQueue", "enQueue", "deQueue"], [[1], [1], [], [2], []]]
        ],
        stress: [
          [["MyCircularQueue", ...Array.from({ length: 300 }, () => "enQueue"), ...Array.from({ length: 300 }, () => "deQueue")], [[100], ...Array.from({ length: 300 }, (_, i) => [i]), ...Array.from({ length: 300 }, () => [])]],
          [["MyCircularQueue", ...Array.from({ length: 400 }, (_, i) => i % 2 === 0 ? "enQueue" : "Rear")], [[50], ...Array.from({ length: 400 }, (_, i) => i % 2 === 0 ? [i] : [])]]
        ]
      }
    })
  ];

  return {
    level: 7,
    levelTitle: "Level 7 — Stack, Queue & Monotonic Stack",
    topic: "LIFO Structures, Monotonic Stacks & Queues",
    problems
  };
}
