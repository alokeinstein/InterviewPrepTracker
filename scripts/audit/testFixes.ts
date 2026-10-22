import * as path from 'path';
import { getLevel5Payload } from '../generators/level5';
import { getLevel7Payload } from '../generators/level7';
import { getLevel10Payload } from '../generators/level10';
import { getLevel11Payload } from '../generators/level11';
import { getLevel12Payload } from '../generators/level12';
import { getLevel14Payload } from '../generators/level14';
import { getLevel15Payload } from '../generators/level15';
import { getLevel18Payload } from '../generators/level18';
import { getLevel21Payload } from '../generators/level21';
import { getLevel22Payload } from '../generators/level22';
import { getLevel23Payload } from '../generators/level23';
import { CodeExecutionService } from '../../src/services/execution/codeExecutionService';

async function testFixes() {
  console.log('Testing Candidate Fixes...\n');

  // Fix 1: Problem #108
  const p108 = getLevel5Payload().problems.find(p => p.num === 108)!;
  const p108SuboptFix = `function findPeakElement(nums) {\n  function search(l, r) {\n    if (l === r) return l;\n    const mid = Math.floor(l + (r - l) / 2);\n    if (nums[mid] > nums[mid + 1]) return search(l, mid);\n    return search(mid + 1, r);\n  }\n  return search(0, nums.length - 1);\n}`;
  const res108 = await CodeExecutionService.executeCode(
    p108SuboptFix,
    'javascript',
    p108.testCases.map(tc => ({ input: tc.input, expectedOutput: tc.expectedOutput })),
    { functionName: p108.functionName }
  );
  console.log(`#108 Fix Result: ${res108.status} (${res108.testCasesPassed}/${res108.totalTestCases} passed)`);
  if (res108.failedTestCase) {
    console.log('  #108 failed case:', res108.failedTestCase);
  }

  // Fix 2: Problem #159 Basic Calculator II
  const p159 = getLevel7Payload().problems.find(p => p.num === 159)!;
  const p159SuboptFix = `function calculate(s) {\n  s = s.replace(/\\s+/g, '');\n  const stack = [];\n  let num = 0;\n  let sign = '+';\n  for (let i = 0; i < s.length; i++) {\n    const c = s[i];\n    if (c >= '0' && c <= '9') {\n      num = num * 10 + (c.charCodeAt(0) - 48);\n    }\n    if ((c < '0' || c > '9') || i === s.length - 1) {\n      if (sign === '+') stack.push(num);\n      else if (sign === '-') stack.push(-num);\n      else if (sign === '*') stack.push(stack.pop() * num);\n      else if (sign === '/') stack.push(Math.trunc(stack.pop() / num));\n      sign = c;\n      num = 0;\n    }\n  }\n  return stack.reduce((a, b) => a + b, 0);\n}`;
  const res159 = await CodeExecutionService.executeCode(
    p159SuboptFix,
    'javascript',
    p159.testCases.map(tc => ({ input: tc.input, expectedOutput: tc.expectedOutput })),
    { functionName: p159.functionName }
  );
  console.log(`#159 Fix Result: ${res159.status} (${res159.testCasesPassed}/${res159.totalTestCases} passed)`);

  // Fix 3: Problem #231 Convert Sorted Array to Binary Search Tree
  const p231 = getLevel10Payload().problems.find(p => p.num === 231)!;
  const p231SuboptFix = `function sortedArrayToBST(nums) {\n  function helper(left, right) {\n    if (left > right) return null;\n    const mid = Math.floor(left + (right - left) / 2);\n    const root = new TreeNode(nums[mid]);\n    root.left = helper(left, mid - 1);\n    root.right = helper(mid + 1, right);\n    return root;\n  }\n  return treeToArray(helper(0, nums.length - 1));\n}`;
  const res231 = await CodeExecutionService.executeCode(
    p231SuboptFix,
    'javascript',
    p231.testCases.map(tc => ({ input: tc.input, expectedOutput: tc.expectedOutput })),
    { functionName: p231.functionName }
  );
  console.log(`#231 Fix Result: ${res231.status} (${res231.testCasesPassed}/${res231.totalTestCases} passed)`);

  // Fix 4: Problem #232 Serialize and Deserialize Binary Tree
  const p232 = getLevel10Payload().problems.find(p => p.num === 232)!;
  const p232SuboptFix = `class Codec {\n  serialize(root) {\n    if (!root) return "";\n    const arr = Array.isArray(root) ? root : treeToArray(root);\n    return arr.map(x => x === null ? "null" : String(x)).join(",");\n  }\n  deserialize(data) {\n    if (!data) return [];\n    return data.split(",").map(x => x === "null" ? null : Number(x));\n  }\n}`;
  const res232 = await CodeExecutionService.executeCode(
    p232SuboptFix,
    'javascript',
    p232.testCases.map(tc => ({ input: tc.input, expectedOutput: tc.expectedOutput })),
    { functionName: p232.functionName, executionModel: 'DESIGN' }
  );
  console.log(`#232 Fix Result: ${res232.status} (${res232.testCasesPassed}/${res232.totalTestCases} passed)`);

  // Fix 5: Problem #233 Construct Binary Tree from Preorder and Inorder Traversal
  const p233 = getLevel10Payload().problems.find(p => p.num === 233)!;
  const p233SuboptFix = `function buildTree(preorder, inorder) {\n  if (!preorder.length || !inorder.length) return [];\n  function helper(pre, ino) {\n    if (!pre.length || !ino.length) return null;\n    const rootVal = pre[0];\n    const mid = ino.indexOf(rootVal);\n    const root = new TreeNode(rootVal);\n    root.left = helper(pre.slice(1, mid + 1), ino.slice(0, mid));\n    root.right = helper(pre.slice(mid + 1), ino.slice(mid + 1));\n    return root;\n  }\n  return treeToArray(helper(preorder, inorder));\n}`;
  const res233 = await CodeExecutionService.executeCode(
    p233SuboptFix,
    'javascript',
    p233.testCases.map(tc => ({ input: tc.input, expectedOutput: tc.expectedOutput })),
    { functionName: p233.functionName }
  );
  console.log(`#233 Fix Result: ${res233.status} (${res233.testCasesPassed}/${res233.totalTestCases} passed)`);

  // Fix 6: Problem #255 Serialize and Deserialize BST
  const p255 = getLevel11Payload().problems.find(p => p.num === 255)!;
  const p255SuboptFix = `class Codec {\n  serialize(root) {\n    if (!root) return "";\n    const tree = buildTree(root);\n    const res = [];\n    function preorder(node) {\n      if (!node) return;\n      res.push(node.val);\n      preorder(node.left);\n      preorder(node.right);\n    }\n    preorder(tree);\n    return res.join(",");\n  }\n  deserialize(data) {\n    if (!data) return [];\n    const vals = data.split(",").map(Number);\n    function build(minVal, maxVal) {\n      if (!vals.length || vals[0] < minVal || vals[0] > maxVal) return null;\n      const val = vals.shift();\n      const node = new TreeNode(val);\n      node.left = build(minVal, val);\n      node.right = build(val, maxVal);\n      return node;\n    }\n    return treeToArray(build(-Infinity, Infinity));\n  }\n}`;
  const res255 = await CodeExecutionService.executeCode(
    p255SuboptFix,
    'javascript',
    p255.testCases.map(tc => ({ input: tc.input, expectedOutput: tc.expectedOutput })),
    { functionName: p255.functionName, executionModel: 'DESIGN' }
  );
  console.log(`#255 Fix Result: ${res255.status} (${res255.testCasesPassed}/${res255.totalTestCases} passed)`);
}

testFixes().catch(console.error);
