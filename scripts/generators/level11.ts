import { LevelPayload, GeneratedProblem } from './types';
import { createProblem } from './problemBuilder';

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  next?: TreeNode | null;
}

function buildTree(arr: (number | null)[]): TreeNode | null {
  if (!arr || arr.length === 0 || arr[0] === null) return null;
  const root: TreeNode = { val: arr[0], left: null, right: null };
  const queue: TreeNode[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const curr = queue.shift()!;
    if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
      curr.left = { val: arr[i]!, left: null, right: null };
      queue.push(curr.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
      curr.right = { val: arr[i]!, left: null, right: null };
      queue.push(curr.right);
    }
    i++;
  }
  return root;
}

function treeToArray(root: TreeNode | null): (number | null)[] {
  if (!root) return [];
  const res: (number | null)[] = [];
  const q: (TreeNode | null)[] = [root];
  while (q.length > 0) {
    const node = q.shift()!;
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

export function getLevel11Payload(): LevelPayload {
  const problems: GeneratedProblem[] = [
    // 234. Binary Tree Zigzag Level Order Traversal
    createProblem({
      num: 234,
      title: "Binary Tree Zigzag Level Order Traversal",
      slug: "binary-tree-zigzag-level-order-traversal",
      level: 11,
      difficulty: "MEDIUM",
      topic: "Binary Tree / BFS",
      patternSlug: "trees-advanced",
      estimatedTimeMin: 20,
      statement: "Given the `root` of a binary tree, return the zigzag level order traversal of its nodes' values (i.e., from left to right, then right to left for the next level and alternate between).\n\nInput is given as a level-order array representation of a binary tree.",
      functionName: "zigzagLevelOrder",
      parameters: [{ name: "root", type: "(number | null)[]", description: "Binary tree level-order array" }],
      returnType: "number[][]",
      constraints: ["The number of nodes in the tree is in the range [0, 2000].", "-100 <= Node.val <= 100"],
      examples: [
        { input: "root = [3,9,20,null,null,15,7]", output: "[[3],[20,9],[15,7]]", explanation: "Level 0: [3] (left to right). Level 1: [20, 9] (right to left). Level 2: [15, 7] (left to right)." },
        { input: "root = [1]", output: "[[1]]", explanation: "Single node tree." },
        { input: "root = []", output: "[]", explanation: "Empty tree produces empty list." },
        { input: "root = [1,2,3,4,null,null,5]", output: "[[1],[3,2],[4,5]]", explanation: "Alternates direction at every depth." }
      ],
      optimalSolution: `function zigzagLevelOrder(root) {\n  const tree = buildTree(root);\n  if (!tree) return [];\n  const res = [];\n  const queue = [tree];\n  let leftToRight = true;\n  while (queue.length > 0) {\n    const size = queue.length;\n    const level = [];\n    for (let i = 0; i < size; i++) {\n      const node = queue.shift();\n      if (leftToRight) level.push(node.val);\n      else level.unshift(node.val);\n      if (node.left) queue.push(node.left);\n      if (node.right) queue.push(node.right);\n    }\n    res.push(level);\n    leftToRight = !leftToRight;\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function zigzagLevelOrder(root) {\n  const tree = buildTree(root);\n  if (!tree) return [];\n  const res = [];\n  function dfs(node, depth) {\n    if (!node) return;\n    if (!res[depth]) res[depth] = [];\n    res[depth].push(node.val);\n    dfs(node.left, depth + 1);\n    dfs(node.right, depth + 1);\n  }\n  dfs(tree, 0);\n  return res.map((lvl, idx) => idx % 2 === 1 ? lvl.reverse() : lvl);\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Flipping direction before processing the first root level", "Reversing arrays in-place incorrectly causing shared reference mutation"],
      hints: [
        "Use standard BFS queue with level-by-level processing.",
        "Maintain a boolean flag `leftToRight` inverted after each level.",
        "Either unshift values or reverse odd-indexed levels before adding to the result."
      ],
      oracleFn: (root: (number | null)[]) => {
        const tree = buildTree(root);
        if (!tree) return [];
        const res: number[][] = [];
        const queue: TreeNode[] = [tree];
        let ltr = true;
        while (queue.length > 0) {
          const len = queue.length;
          const cur: number[] = [];
          for (let i = 0; i < len; i++) {
            const n = queue.shift()!;
            if (ltr) cur.push(n.val);
            else cur.unshift(n.val);
            if (n.left) queue.push(n.left);
            if (n.right) queue.push(n.right);
          }
          res.push(cur);
          ltr = !ltr;
        }
        return res;
      },
      testCases: {
        functional: [
          [[3, 9, 20, null, null, 15, 7]],
          [[1]],
          [[]],
          [[1, 2, 3, 4, null, null, 5]]
        ],
        boundary: [
          [[1, 2]],
          [[1, null, 2]],
          [[1, 2, 3]],
          [[1, 2, null, 3]]
        ],
        adversarial: [
          [[1, 2, 3, 4, 5, 6, 7]],
          [[1, null, 2, null, 3, null, 4]],
          [[10, 5, 15, null, null, 6, 20]]
        ],
        stress: [
          [Array.from({ length: 63 }, (_, i) => i + 1)],
          [Array.from({ length: 127 }, (_, i) => (i % 2 === 0 ? i : null))]
        ]
      }
    }),

    // 235. Populating Next Right Pointers in Each Node
    createProblem({
      num: 235,
      title: "Populating Next Right Pointers in Each Node",
      slug: "populating-next-right-pointers-in-each-node",
      level: 11,
      difficulty: "MEDIUM",
      topic: "Binary Tree / BFS",
      patternSlug: "trees-advanced",
      estimatedTimeMin: 20,
      statement: "You are given a perfect binary tree where all leaves are on the same level, and every parent has two children. Populate each next pointer to point to its next right node. If there is no next right node, the next pointer should be set to `NULL`.\n\nInitially, all next pointers are set to `NULL`. Return the serialized level-order traversal separated by `#` markers as an array.",
      functionName: "connect",
      parameters: [{ name: "root", type: "(number | null)[]", description: "Perfect binary tree level-order array" }],
      returnType: "(number | string)[]",
      constraints: ["The number of nodes in the tree is in the range [0, 2^12 - 1].", "-1000 <= Node.val <= 1000"],
      examples: [
        { input: "root = [1,2,3,4,5,6,7]", output: "[1,'#',2,3,'#',4,5,6,7,'#']", explanation: "Each level's next pointers link left to right, ending with '#' marker." },
        { input: "root = []", output: "[]", explanation: "Empty tree." },
        { input: "root = [1]", output: "[1,'#']", explanation: "Single node level." },
        { input: "root = [1,2,3]", output: "[1,'#',2,3,'#']", explanation: "Root links to null, 2 links to 3, 3 links to null." }
      ],
      optimalSolution: `function connect(root) {\n  const tree = buildTree(root);\n  if (!tree) return [];\n  let leftmost = tree;\n  while (leftmost.left) {\n    let head = leftmost;\n    while (head) {\n      head.left.next = head.right;\n      if (head.next) head.right.next = head.next.left;\n      head = head.next;\n    }\n    leftmost = leftmost.left;\n  }\n  // Serialize with '#' level separators\n  const res = [];\n  let curLevel = tree;\n  while (curLevel) {\n    let cur = curLevel;\n    while (cur) {\n      res.push(cur.val);\n      cur = cur.next;\n    }\n    res.push('#');\n    curLevel = curLevel.left;\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1) extra space",
      suboptimalSolution: `function connect(root) {\n  const tree = buildTree(root);\n  if (!tree) return [];\n  const q = [tree];\n  const res = [];\n  while (q.length > 0) {\n    const len = q.length;\n    for (let i = 0; i < len; i++) {\n      const node = q.shift();\n      res.push(node.val);\n      if (node.left) q.push(node.left);\n      if (node.right) q.push(node.right);\n    }\n    res.push('#');\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N) queue space",
      commonMistakes: ["Failing to bridge cross-parent siblings (node.right.next = node.next.left)", "Assuming O(1) space when using standard queue BFS"],
      hints: [
        "Use already established next pointers at level N to wire up level N+1.",
        "For adjacent children of the same parent: curr.left.next = curr.right.",
        "Across parents: curr.right.next = curr.next ? curr.next.left : null."
      ],
      oracleFn: (root: (number | null)[]) => {
        const tree = buildTree(root);
        if (!tree) return [];
        const q: TreeNode[] = [tree];
        const res: (number | string)[] = [];
        while (q.length > 0) {
          const len = q.length;
          for (let i = 0; i < len; i++) {
            const n = q.shift()!;
            res.push(n.val);
            if (n.left) q.push(n.left);
            if (n.right) q.push(n.right);
          }
          res.push('#');
        }
        return res;
      },
      testCases: {
        functional: [
          [[1, 2, 3, 4, 5, 6, 7]],
          [[]],
          [[1]],
          [[1, 2, 3]]
        ],
        boundary: [
          [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]],
          [[10, 20, 30]],
          [[0, 0, 0]]
        ],
        adversarial: [
          [[-1, -2, -3, -4, -5, -6, -7]],
          [[100, 50, 150]]
        ],
        stress: [
          [Array.from({ length: 31 }, (_, i) => i + 1)],
          [Array.from({ length: 63 }, (_, i) => i + 1)]
        ]
      }
    }),

    // 236. Populating Next Right Pointers in Each Node II
    createProblem({
      num: 236,
      title: "Populating Next Right Pointers in Each Node II",
      slug: "populating-next-right-pointers-in-each-node-ii",
      level: 11,
      difficulty: "MEDIUM",
      topic: "Binary Tree / BFS",
      patternSlug: "trees-advanced",
      estimatedTimeMin: 25,
      statement: "Given a binary tree (which may not be a perfect tree), populate each next pointer to point to its next right node. If there is no next right node, the next pointer should be set to `NULL`.\n\nInitially, all next pointers are set to `NULL`. Return the serialized level-order traversal separated by `#` markers.",
      functionName: "connectII",
      parameters: [{ name: "root", type: "(number | null)[]", description: "Binary tree level-order array" }],
      returnType: "(number | string)[]",
      constraints: ["The number of nodes in the tree is in the range [0, 6000].", "-100 <= Node.val <= 100"],
      examples: [
        { input: "root = [1,2,3,4,5,null,7]", output: "[1,'#',2,3,'#',4,5,7,'#']", explanation: "Missing right child of 3 is skipped; 5 links to 7 directly." },
        { input: "root = []", output: "[]", explanation: "Empty tree." },
        { input: "root = [1,2,null,3]", output: "[1,'#',2,'#',3,'#']", explanation: "Skewed tree level outputs." },
        { input: "root = [1,null,2,null,3]", output: "[1,'#',2,'#',3,'#']", explanation: "Right-skewed tree." }
      ],
      optimalSolution: `function connectII(root) {\n  const tree = buildTree(root);\n  if (!tree) return [];\n  let curr = tree;\n  while (curr) {\n    const dummy = { val: 0, next: null };\n    let tail = dummy;\n    while (curr) {\n      if (curr.left) { tail.next = curr.left; tail = tail.next; }\n      if (curr.right) { tail.next = curr.right; tail = tail.next; }\n      curr = curr.next;\n    }\n    curr = dummy.next;\n  }\n  const res = [];\n  const q = [tree];\n  while (q.length > 0) {\n    const len = q.length;\n    for (let i = 0; i < len; i++) {\n      const n = q.shift();\n      res.push(n.val);\n      if (n.left) q.push(n.left);\n      if (n.right) q.push(n.right);\n    }\n    res.push('#');\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1) extra space using dummy pointer",
      suboptimalSolution: `function connectII(root) {\n  const tree = buildTree(root);\n  if (!tree) return [];\n  const res = [];\n  const q = [tree];\n  while (q.length > 0) {\n    const len = q.length;\n    for (let i = 0; i < len; i++) {\n      const n = q.shift();\n      res.push(n.val);\n      if (n.left) q.push(n.left);\n      if (n.right) q.push(n.right);\n    }\n    res.push('#');\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N) queue space",
      commonMistakes: ["Assuming complete binary tree layout", "Losing reference to the start of the next level when some nodes lack children"],
      hints: [
        "Use a dummy head for the next level to link child nodes together.",
        "Traverse current level using its next pointers while building next level's linked list.",
        "Advance current level to dummy.next once the current level finishes."
      ],
      oracleFn: (root: (number | null)[]) => {
        const tree = buildTree(root);
        if (!tree) return [];
        const res: (number | string)[] = [];
        const q: TreeNode[] = [tree];
        while (q.length > 0) {
          const len = q.length;
          for (let i = 0; i < len; i++) {
            const n = q.shift()!;
            res.push(n.val);
            if (n.left) q.push(n.left);
            if (n.right) q.push(n.right);
          }
          res.push('#');
        }
        return res;
      },
      testCases: {
        functional: [
          [[1, 2, 3, 4, 5, null, 7]],
          [[]],
          [[1, 2, null, 3]],
          [[1, null, 2, null, 3]]
        ],
        boundary: [
          [[1]],
          [[1, 2]],
          [[1, null, 2]],
          [[2, 1, 3, 0, 7, 9, 1, 2, null, 1, 0, null, null, 8, 8, null, null, null, null, 7]]
        ],
        adversarial: [
          [[1, 2, 3, 4, null, null, 5]],
          [[1, 2, 3, null, 4, 5, null]],
          [[10, 20, 30, null, 40, null, 50]]
        ],
        stress: [
          [Array.from({ length: 60 }, (_, i) => (i % 3 === 0 ? null : i + 1))],
          [Array.from({ length: 80 }, (_, i) => (i % 4 === 0 ? null : i))]
        ]
      }
    }),

    // 237. Flatten Binary Tree to Linked List
    createProblem({
      num: 237,
      title: "Flatten Binary Tree to Linked List",
      slug: "flatten-binary-tree-to-linked-list",
      level: 11,
      difficulty: "MEDIUM",
      topic: "Binary Tree / DFS",
      patternSlug: "trees-advanced",
      estimatedTimeMin: 20,
      statement: "Given the `root` of a binary tree, flatten the tree into a \"linked list\" in-place:\n- The \"linked list\" should use the same `TreeNode` class where the `right` child pointer points to the next node in the list and the `left` child pointer is always `null`.\n- The \"linked list\" should be in the same order as a pre-order traversal of the binary tree.\n\nReturn the flattened tree in level-order array format.",
      functionName: "flatten",
      parameters: [{ name: "root", type: "(number | null)[]", description: "Binary tree level-order array" }],
      returnType: "(number | null)[]",
      constraints: ["The number of nodes in the tree is in the range [0, 2000].", "-100 <= Node.val <= 100"],
      examples: [
        { input: "root = [1,2,5,3,4,null,6]", output: "[1,null,2,null,3,null,4,null,5,null,6]", explanation: "Preorder traversal [1, 2, 3, 4, 5, 6] linked via right pointers." },
        { input: "root = []", output: "[]", explanation: "Empty tree." },
        { input: "root = [0]", output: "[0]", explanation: "Single node tree." },
        { input: "root = [1,2,null,3]", output: "[1,null,2,null,3]", explanation: "Left-skewed tree flattened to right." }
      ],
      optimalSolution: `function flatten(root) {\n  const tree = buildTree(root);\n  if (!tree) return [];\n  let curr = tree;\n  while (curr) {\n    if (curr.left) {\n      let runner = curr.left;\n      while (runner.right) runner = runner.right;\n      runner.right = curr.right;\n      curr.right = curr.left;\n      curr.left = null;\n    }\n    curr = curr.right;\n  }\n  return treeToArray(tree);\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1) Morris-style pointer rewiring",
      suboptimalSolution: `function flatten(root) {\n  const tree = buildTree(root);\n  if (!tree) return [];\n  const nodes = [];\n  function preorder(node) {\n    if (!node) return;\n    nodes.push(node);\n    preorder(node.left);\n    preorder(node.right);\n  }\n  preorder(tree);\n  for (let i = 0; i < nodes.length - 1; i++) {\n    nodes[i].left = null;\n    nodes[i].right = nodes[i + 1];\n  }\n  if (nodes.length > 0) {\n    nodes[nodes.length - 1].left = null;\n    nodes[nodes.length - 1].right = null;\n  }\n  return treeToArray(nodes[0]);\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N) node list",
      commonMistakes: ["Losing curr.right when attaching curr.left directly without finding rightmost leaf", "Not setting left pointers to null"],
      hints: [
        "If curr has a left child, find the rightmost node of curr.left.",
        "Wire runner.right = curr.right, then move curr.left to curr.right and clear curr.left.",
        "Advance curr to curr.right."
      ],
      oracleFn: (root: (number | null)[]) => {
        const tree = buildTree(root);
        if (!tree) return [];
        let curr: TreeNode | null = tree;
        while (curr) {
          if (curr.left) {
            let runner: TreeNode = curr.left;
            while (runner.right) runner = runner.right;
            runner.right = curr.right;
            curr.right = curr.left;
            curr.left = null;
          }
          curr = curr.right;
        }
        return treeToArray(tree);
      },
      testCases: {
        functional: [
          [[1, 2, 5, 3, 4, null, 6]],
          [[]],
          [[0]],
          [[1, 2, null, 3]]
        ],
        boundary: [
          [[1, null, 2, null, 3]],
          [[1, 2]],
          [[1, null, 2]],
          [[1, 2, 3]]
        ],
        adversarial: [
          [[1, 2, 3, 4, 5, 6, 7]],
          [[5, 4, null, 3, null, 2, null, 1]],
          [[10, 5, 15, 2, 7, 12, 18]]
        ],
        stress: [
          [Array.from({ length: 63 }, (_, i) => i + 1)],
          [Array.from({ length: 100 }, (_, i) => (i % 2 === 0 ? i : null))]
        ]
      }
    }),

    // 238. Construct Binary Tree from Inorder and Postorder Traversal
    createProblem({
      num: 238,
      title: "Construct Binary Tree from Inorder and Postorder Traversal",
      slug: "construct-binary-tree-from-inorder-and-postorder-traversal",
      level: 11,
      difficulty: "MEDIUM",
      topic: "Binary Tree / Divide & Conquer",
      patternSlug: "trees-advanced",
      estimatedTimeMin: 25,
      statement: "Given two integer arrays `inorder` and `postorder` where `inorder` is the inorder traversal of a binary tree and `postorder` is the postorder traversal of the same tree, construct and return the binary tree in level-order array format.",
      functionName: "buildTreeIP",
      parameters: [
        { name: "inorder", type: "number[]", description: "Inorder traversal array" },
        { name: "postorder", type: "number[]", description: "Postorder traversal array" }
      ],
      returnType: "(number | null)[]",
      constraints: ["1 <= inorder.length <= 3000", "postorder.length == inorder.length", "-3000 <= inorder[i], postorder[i] <= 3000", "inorder and postorder consist of unique values.", "Each value of postorder also appears in inorder."],
      examples: [
        { input: "inorder = [9,3,15,20,7], postorder = [9,15,7,20,3]", output: "[3,9,20,null,null,15,7]", explanation: "The last element in postorder (3) is root. In inorder, left of 3 is [9], right of 3 is [15,20,7]." },
        { input: "inorder = [-1], postorder = [-1]", output: "[-1]", explanation: "Single node tree." },
        { input: "inorder = [2,1,3], postorder = [2,3,1]", output: "[1,2,3]", explanation: "Root 1 with left child 2 and right child 3." },
        { input: "inorder = [1,2], postorder = [2,1]", output: "[1,null,2]", explanation: "Right skewed tree." }
      ],
      optimalSolution: `function buildTreeIP(inorder, postorder) {\n  const inMap = new Map();\n  for (let i = 0; i < inorder.length; i++) inMap.set(inorder[i], i);\n  let postIdx = postorder.length - 1;\n  function helper(left, right) {\n    if (left > right) return null;\n    const rootVal = postorder[postIdx--];\n    const root = { val: rootVal, left: null, right: null };\n    const mid = inMap.get(rootVal);\n    root.right = helper(mid + 1, right);\n    root.left = helper(left, mid - 1);\n    return root;\n  }\n  return treeToArray(helper(0, inorder.length - 1));\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function buildTreeIP(inorder, postorder) {\n  if (!inorder.length || !postorder.length) return [];\n  const rootVal = postorder[postorder.length - 1];\n  const root = { val: rootVal, left: null, right: null };\n  const mid = inorder.indexOf(rootVal);\n  const leftIn = inorder.slice(0, mid);\n  const rightIn = inorder.slice(mid + 1);\n  const leftPost = postorder.slice(0, mid);\n  const rightPost = postorder.slice(mid, postorder.length - 1);\n  function construct(inArr, postArr) {\n    if (!inArr.length) return null;\n    const val = postArr[postArr.length - 1];\n    const node = { val, left: null, right: null };\n    const idx = inArr.indexOf(val);\n    node.left = construct(inArr.slice(0, idx), postArr.slice(0, idx));\n    node.right = construct(inArr.slice(idx + 1), postArr.slice(idx, postArr.length - 1));\n    return node;\n  }\n  return treeToArray(construct(inorder, postorder));\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N^2)",
      commonMistakes: ["Recursing left before right when decrementing postIdx from end", "O(N^2) linear searching in inorder without Hash Map"],
      hints: [
        "The last element of postorder is always the root.",
        "Build right subtree first because postorder processes Root -> Right -> Left in reverse.",
        "Store inorder indices in a Hash Map for O(1) partition lookups."
      ],
      oracleFn: (inorder: number[], postorder: number[]) => {
        const inMap = new Map<number, number>();
        for (let i = 0; i < inorder.length; i++) inMap.set(inorder[i], i);
        let postIdx = postorder.length - 1;
        function helper(left: number, right: number): TreeNode | null {
          if (left > right) return null;
          const rootVal = postorder[postIdx--];
          const root: TreeNode = { val: rootVal, left: null, right: null };
          const mid = inMap.get(rootVal)!;
          root.right = helper(mid + 1, right);
          root.left = helper(left, mid - 1);
          return root;
        }
        return treeToArray(helper(0, inorder.length - 1));
      },
      testCases: {
        functional: [
          [[9, 3, 15, 20, 7], [9, 15, 7, 20, 3]],
          [[-1], [-1]],
          [[2, 1, 3], [2, 3, 1]],
          [[1, 2], [2, 1]]
        ],
        boundary: [
          [[2, 1], [2, 1]],
          [[1, 2, 3], [1, 2, 3]],
          [[1, 2, 3], [3, 2, 1]]
        ],
        adversarial: [
          [[4, 2, 5, 1, 6, 3, 7], [4, 5, 2, 6, 7, 3, 1]],
          [[1, 2, 3, 4], [4, 3, 2, 1]],
          [[2, 5, 7, 10, 12, 15, 20], [2, 7, 5, 12, 20, 15, 10]]
        ],
        stress: [
          [Array.from({ length: 63 }, (_, i) => i + 1), Array.from({ length: 63 }, (_, i) => i + 1)],
          [Array.from({ length: 63 }, (_, i) => i + 1), Array.from({ length: 63 }, (_, i) => 63 - i)]
        ]
      }
    }),

    // 239. Binary Tree Maximum Path Sum
    createProblem({
      num: 239,
      title: "Binary Tree Maximum Path Sum",
      slug: "binary-tree-maximum-path-sum",
      level: 11,
      difficulty: "HARD",
      topic: "Binary Tree / DFS / Dynamic Programming",
      patternSlug: "trees-advanced",
      estimatedTimeMin: 30,
      statement: "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.\n\nThe path sum of a path is the sum of the node's values in the path. Given the `root` of a binary tree, return the maximum path sum of any non-empty path.",
      functionName: "maxPathSum",
      parameters: [{ name: "root", type: "(number | null)[]", description: "Binary tree level-order array" }],
      returnType: "number",
      constraints: ["The number of nodes in the tree is in the range [1, 3 * 10^4].", "-1000 <= Node.val <= 1000"],
      examples: [
        { input: "root = [1,2,3]", output: "6", explanation: "Optimal path is 2 -> 1 -> 3 with path sum 2 + 1 + 3 = 6." },
        { input: "root = [-10,9,20,null,null,15,7]", output: "42", explanation: "Optimal path is 15 -> 20 -> 7 with path sum 15 + 20 + 7 = 42." },
        { input: "root = [-3]", output: "-3", explanation: "Single negative node path sum is -3." },
        { input: "root = [2,-1]", output: "2", explanation: "Choosing single node 2 is better than 2 + (-1) = 1." }
      ],
      optimalSolution: `function maxPathSum(root) {\n  const tree = buildTree(root);\n  if (!tree) return 0;\n  let maxSum = -Infinity;\n  function maxGain(node) {\n    if (!node) return 0;\n    const leftGain = Math.max(maxGain(node.left), 0);\n    const rightGain = Math.max(maxGain(node.right), 0);\n    const currentPath = node.val + leftGain + rightGain;\n    maxSum = Math.max(maxSum, currentPath);\n    return node.val + Math.max(leftGain, rightGain);\n  }\n  maxGain(tree);\n  return maxSum;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(H) recursion stack",
      suboptimalSolution: `function maxPathSum(root) {\n  const tree = buildTree(root);\n  if (!tree) return 0;\n  let max = -Infinity;\n  function dfs(node) {\n    if (!node) return;\n    function singlePath(n) {\n      if (!n) return 0;\n      return n.val + Math.max(0, Math.max(singlePath(n.left), singlePath(n.right)));\n    }\n    const cur = node.val + Math.max(0, singlePath(node.left)) + Math.max(0, singlePath(node.right));\n    if (cur > max) max = cur;\n    dfs(node.left);\n    dfs(node.right);\n  }\n  dfs(tree);\n  return max;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(H)",
      commonMistakes: ["Returning leftGain + rightGain + node.val to parent (paths cannot branch both ways at parent)", "Not clamping negative branch contributions with Math.max(..., 0)"],
      hints: [
        "At each node, compute max gain from left and right subtrees.",
        "Clamp negative gains to 0 because an empty branch contributes 0.",
        "Update global max with node.val + leftGain + rightGain.",
        "Return node.val + max(leftGain, rightGain) to the caller."
      ],
      oracleFn: (root: (number | null)[]) => {
        const tree = buildTree(root);
        if (!tree) return 0;
        let max = -Infinity;
        function gain(n: TreeNode | null): number {
          if (!n) return 0;
          const l = Math.max(gain(n.left), 0);
          const r = Math.max(gain(n.right), 0);
          max = Math.max(max, n.val + l + r);
          return n.val + Math.max(l, r);
        }
        gain(tree);
        return max;
      },
      testCases: {
        functional: [
          [[1, 2, 3]],
          [[-10, 9, 20, null, null, 15, 7]],
          [[-3]],
          [[2, -1]]
        ],
        boundary: [
          [[1]],
          [[-1, -2, -3]],
          [[1000, 1000, 1000]],
          [[-1000]]
        ],
        adversarial: [
          [[1, -2, 3]],
          [[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]],
          [[-2, 1]]
        ],
        stress: [
          [Array.from({ length: 63 }, (_, i) => (i % 2 === 0 ? 10 : -5))],
          [Array.from({ length: 127 }, (_, i) => i - 60)]
        ]
      }
    }),

    // 240. Path Sum III
    createProblem({
      num: 240,
      title: "Path Sum III",
      slug: "path-sum-iii",
      level: 11,
      difficulty: "MEDIUM",
      topic: "Binary Tree / Prefix Sum / DFS",
      patternSlug: "trees-advanced",
      estimatedTimeMin: 25,
      statement: "Given the `root` of a binary tree and an integer `targetSum`, return the number of paths where the sum of the values along the path equals `targetSum`.\n\nThe path does not need to start or end at the root or a leaf, but it must go downwards (i.e., traveling only from parent nodes to child nodes).",
      functionName: "pathSumIII",
      parameters: [
        { name: "root", type: "(number | null)[]", description: "Binary tree level-order array" },
        { name: "targetSum", type: "number", description: "Target path sum" }
      ],
      returnType: "number",
      constraints: ["The number of nodes in the tree is in the range [0, 1000].", "-10^9 <= Node.val <= 10^9", "-1000 <= targetSum <= 1000"],
      examples: [
        { input: "root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8", output: "3", explanation: "Three paths sum to 8: 5 -> 3, 5 -> 2 -> 1, -3 -> 11." },
        { input: "root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22", output: "3", explanation: "Three valid downwards paths reach sum 22." },
        { input: "root = [], targetSum = 0", output: "0", explanation: "Empty tree." },
        { input: "root = [1], targetSum = 1", output: "1", explanation: "Root node equals target." }
      ],
      optimalSolution: `function pathSumIII(root, targetSum) {\n  const tree = buildTree(root);\n  if (!tree) return 0;\n  const prefixMap = new Map();\n  prefixMap.set(0, 1);\n  let count = 0;\n  function dfs(node, currentSum) {\n    if (!node) return;\n    currentSum += node.val;\n    count += prefixMap.get(currentSum - targetSum) || 0;\n    prefixMap.set(currentSum, (prefixMap.get(currentSum) || 0) + 1);\n    dfs(node.left, currentSum);\n    dfs(node.right, currentSum);\n    prefixMap.set(currentSum, prefixMap.get(currentSum) - 1);\n  }\n  dfs(tree, 0);\n  return count;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(H) prefix sum map",
      suboptimalSolution: `function pathSumIII(root, targetSum) {\n  const tree = buildTree(root);\n  if (!tree) return 0;\n  let count = 0;\n  function countFrom(node, sum) {\n    if (!node) return;\n    if (node.val === sum) count++;\n    countFrom(node.left, sum - node.val);\n    countFrom(node.right, sum - node.val);\n  }\n  function traverse(node) {\n    if (!node) return;\n    countFrom(node, targetSum);\n    traverse(node.left);\n    traverse(node.right);\n  }\n  traverse(tree);\n  return count;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(H)",
      commonMistakes: ["Forgetting to backtrack (decrement count in prefix map) upon returning from recursive branch", "Stopping traversal after reaching target sum (subsequent nodes could sum to 0)"],
      hints: [
        "Combine tree DFS with the Subarray Sum Equals K prefix sum pattern.",
        "Store prefix sum frequencies in a Hash Map.",
        "When leaving a node, remove its prefix sum from the map to avoid polluting other subtrees."
      ],
      oracleFn: (root: (number | null)[], targetSum: number) => {
        const tree = buildTree(root);
        if (!tree) return 0;
        const map = new Map<number, number>();
        map.set(0, 1);
        let count = 0;
        function dfs(n: TreeNode | null, s: number) {
          if (!n) return;
          s += n.val;
          count += map.get(s - targetSum) || 0;
          map.set(s, (map.get(s) || 0) + 1);
          dfs(n.left, s);
          dfs(n.right, s);
          map.set(s, map.get(s)! - 1);
        }
        dfs(tree, 0);
        return count;
      },
      testCases: {
        functional: [
          [[10, 5, -3, 3, 2, null, 11, 3, -2, null, 1], 8],
          [[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1], 22],
          [[], 0],
          [[1], 1]
        ],
        boundary: [
          [[1, 2], 3],
          [[1, -2], -1],
          [[0, 0, 0], 0]
        ],
        adversarial: [
          [[1, -2, -3, 1, 3, -2, null, -1], -1],
          [[1000000000, 1000000000, null, 294967296], 0]
        ],
        stress: [
          [Array.from({ length: 63 }, () => 1), 5],
          [Array.from({ length: 127 }, (_, i) => (i % 2 === 0 ? 2 : -2)), 0]
        ]
      }
    }),

    // 241. House Robber III
    createProblem({
      num: 241,
      title: "House Robber III",
      slug: "house-robber-iii",
      level: 11,
      difficulty: "MEDIUM",
      topic: "Binary Tree / Dynamic Programming / DFS",
      patternSlug: "trees-advanced",
      estimatedTimeMin: 25,
      statement: "The thief has found himself a new place for his thievery again. There is only one entrance to this area, called `root`.\n\nBesides the `root`, each house has one and only one parent house. After a tour, the smart thief realized that all houses in this place form a binary tree. It will automatically contact the police if two directly-linked houses were broken into on the same night.\n\nGiven the `root` of the binary tree, return the maximum amount of money the thief can rob without alerting the police.",
      functionName: "robTree",
      parameters: [{ name: "root", type: "(number | null)[]", description: "Binary tree level-order array" }],
      returnType: "number",
      constraints: ["The number of nodes in the tree is in the range [1, 10^4].", "0 <= Node.val <= 10^4"],
      examples: [
        { input: "root = [3,2,3,null,3,null,1]", output: "7", explanation: "Rob houses 3 + 3 + 1 = 7." },
        { input: "root = [3,4,5,1,3,null,1]", output: "9", explanation: "Rob houses 4 + 5 = 9." },
        { input: "root = [1]", output: "1", explanation: "Single house robbed." },
        { input: "root = [4,1,null,2,null,3]", output: "7", explanation: "Rob 4 + 3 = 7." }
      ],
      optimalSolution: `function robTree(root) {\n  const tree = buildTree(root);\n  if (!tree) return 0;\n  // Returns [robThisNode, notRobThisNode]\n  function dfs(node) {\n    if (!node) return [0, 0];\n    const left = dfs(node.left);\n    const right = dfs(node.right);\n    const rob = node.val + left[1] + right[1];\n    const notRob = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);\n    return [rob, notRob];\n  }\n  const [rob, notRob] = dfs(tree);\n  return Math.max(rob, notRob);\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(H) tree recursion stack",
      suboptimalSolution: `function robTree(root) {\n  const tree = buildTree(root);\n  if (!tree) return 0;\n  const memo = new Map();\n  function robHelper(node) {\n    if (!node) return 0;\n    if (memo.has(node)) return memo.get(node);\n    let val = node.val;\n    if (node.left) val += robHelper(node.left.left) + robHelper(node.left.right);\n    if (node.right) val += robHelper(node.right.left) + robHelper(node.right.right);\n    const notRob = robHelper(node.left) + robHelper(node.right);\n    const ans = Math.max(val, notRob);\n    memo.set(node, ans);\n    return ans;\n  }\n  return robHelper(tree);\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N) memo map",
      commonMistakes: ["Skipping four grandchild checks without memoization O(2^N)", "Assuming level-by-level greedy alternating robbery"],
      hints: [
        "Post-order traversal: compute for each subtree [money if robbed, money if not robbed].",
        "If current node is robbed, neither child can be robbed.",
        "If current node is not robbed, each child can independently be robbed or skipped."
      ],
      oracleFn: (root: (number | null)[]) => {
        const tree = buildTree(root);
        if (!tree) return 0;
        function dfs(n: TreeNode | null): [number, number] {
          if (!n) return [0, 0];
          const l = dfs(n.left);
          const r = dfs(n.right);
          const rob = n.val + l[1] + r[1];
          const notRob = Math.max(l[0], l[1]) + Math.max(r[0], r[1]);
          return [rob, notRob];
        }
        const [a, b] = dfs(tree);
        return Math.max(a, b);
      },
      testCases: {
        functional: [
          [[3, 2, 3, null, 3, null, 1]],
          [[3, 4, 5, 1, 3, null, 1]],
          [[1]],
          [[4, 1, null, 2, null, 3]]
        ],
        boundary: [
          [[1, 2]],
          [[2, 1, 3]],
          [[10, 1, 1, 10, 10, 10, 10]]
        ],
        adversarial: [
          [[2, 1, 3, null, 4]],
          [[79, 99, 77, null, null, null, 69]]
        ],
        stress: [
          [Array.from({ length: 63 }, (_, i) => i + 1)],
          [Array.from({ length: 127 }, (_, i) => (i % 2 === 0 ? 100 : 1))]
        ]
      }
    }),

    // 242. Delete Node in a BST
    createProblem({
      num: 242,
      title: "Delete Node in a BST",
      slug: "delete-node-in-a-bst",
      level: 11,
      difficulty: "MEDIUM",
      topic: "Binary Search Tree / DFS",
      patternSlug: "trees-advanced",
      estimatedTimeMin: 25,
      statement: "Given a root node reference of a BST and a key, delete the node with the given key in the BST. Return the root node reference (possibly updated) of the BST.\n\nBasically, the deletion can be divided into two stages:\n1. Search for a node to remove.\n2. If the node is found, delete the node.",
      functionName: "deleteNode",
      parameters: [
        { name: "root", type: "(number | null)[]", description: "BST level-order array" },
        { name: "key", type: "number", description: "Key to delete" }
      ],
      returnType: "(number | null)[]",
      constraints: ["The number of nodes in the tree is in the range [0, 10^4].", "-10^5 <= Node.val <= 10^5", "Each node has a unique value.", "root is a valid binary search tree.", "-10^5 <= key <= 10^5"],
      examples: [
        { input: "root = [5,3,6,2,4,null,7], key = 3", output: "[5,4,6,2,null,null,7]", explanation: "Key 3 deleted and replaced with in-order successor 4." },
        { input: "root = [5,3,6,2,4,null,7], key = 0", output: "[5,3,6,2,4,null,7]", explanation: "Key 0 does not exist in tree, tree remains unchanged." },
        { input: "root = [], key = 0", output: "[]", explanation: "Empty tree." },
        { input: "root = [5], key = 5", output: "[]", explanation: "Deleting single root node leaves empty tree." }
      ],
      optimalSolution: `function deleteNode(root, key) {\n  const tree = buildTree(root);\n  function remove(node, k) {\n    if (!node) return null;\n    if (k < node.val) {\n      node.left = remove(node.left, k);\n    } else if (k > node.val) {\n      node.right = remove(node.right, k);\n    } else {\n      if (!node.left) return node.right;\n      if (!node.right) return node.left;\n      let successor = node.right;\n      while (successor.left) successor = successor.left;\n      node.val = successor.val;\n      node.right = remove(node.right, successor.val);\n    }\n    return node;\n  }\n  return treeToArray(remove(tree, key));\n}`,
      optimalTimeComplexity: "O(H)",
      optimalSpaceComplexity: "O(H) recursion stack",
      suboptimalSolution: `function deleteNode(root, key) {\n  const tree = buildTree(root);\n  function inOrder(n) {\n    if (!n) return [];\n    return [...inOrder(n.left), n.val, ...inOrder(n.right)];\n  }\n  const vals = inOrder(tree).filter(v => v !== key);\n  function toBST(arr, l, r) {\n    if (l > r) return null;\n    const m = Math.floor((l + r) / 2);\n    const node = { val: arr[m], left: null, right: null };\n    node.left = toBST(arr, l, m - 1);\n    node.right = toBST(arr, m + 1, r);\n    return node;\n  }\n  return treeToArray(toBST(vals, 0, vals.length - 1));\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Overwriting node val without deleting the duplicate successor node from right subtree", "Not handling node with only one child"],
      hints: [
        "If key < node.val, search left. If key > node.val, search right.",
        "When node is found: if 0 or 1 child, return the non-null child directly.",
        "If 2 children: find min node in right subtree (in-order successor), copy its val, and delete successor recursively."
      ],
      oracleFn: (root: (number | null)[], key: number) => {
        const tree = buildTree(root);
        function remove(n: TreeNode | null, k: number): TreeNode | null {
          if (!n) return null;
          if (k < n.val) n.left = remove(n.left, k);
          else if (k > n.val) n.right = remove(n.right, k);
          else {
            if (!n.left) return n.right;
            if (!n.right) return n.left;
            let succ = n.right;
            while (succ.left) succ = succ.left;
            n.val = succ.val;
            n.right = remove(n.right, succ.val);
          }
          return n;
        }
        return treeToArray(remove(tree, key));
      },
      testCases: {
        functional: [
          [[5, 3, 6, 2, 4, null, 7], 3],
          [[5, 3, 6, 2, 4, null, 7], 0],
          [[], 0],
          [[5], 5]
        ],
        boundary: [
          [[2, 1], 2],
          [[2, 1], 1],
          [[1, null, 2], 1]
        ],
        adversarial: [
          [[50, 30, 70, null, 40, 60, 80], 50],
          [[10, 5, 15, 3, 7, 12, 18], 15]
        ],
        stress: [
          [Array.from({ length: 63 }, (_, i) => i + 1), 32],
          [Array.from({ length: 127 }, (_, i) => (i + 1) * 2), 64]
        ]
      }
    }),

    // 243. Trim a Binary Search Tree
    createProblem({
      num: 243,
      title: "Trim a Binary Search Tree",
      slug: "trim-a-binary-search-tree",
      level: 11,
      difficulty: "MEDIUM",
      topic: "Binary Search Tree / DFS",
      patternSlug: "trees-advanced",
      estimatedTimeMin: 20,
      statement: "Given the `root` of a binary search tree and the lowest and highest boundaries as `low` and `high`, trim the tree so that all its elements lie in `[low, high]`.\n\nTrimming the tree should not change the relative structure of the elements that will remain in the tree (i.e., any node's descendant should remain a descendant). Return the root of the trimmed binary search tree in level-order array format.",
      functionName: "trimBST",
      parameters: [
        { name: "root", type: "(number | null)[]", description: "BST level-order array" },
        { name: "low", type: "number", description: "Low bound" },
        { name: "high", type: "number", description: "High bound" }
      ],
      returnType: "(number | null)[]",
      constraints: ["The number of nodes in the tree is in the range [1, 10^4].", "0 <= Node.val <= 10^4", "The value of each node in the tree is unique.", "root is guaranteed to be a valid binary search tree.", "0 <= low <= high <= 10^4"],
      examples: [
        { input: "root = [1,0,2], low = 1, high = 2", output: "[1,null,2]", explanation: "Node 0 is trimmed because 0 < 1." },
        { input: "root = [3,0,4,null,2,null,null,1], low = 1, high = 3", output: "[3,2,null,1]", explanation: "Node 0 is trimmed, bringing child 2 into left subtree." },
        { input: "root = [1], low = 1, high = 2", output: "[1]", explanation: "Node 1 is in range." },
        { input: "root = [1,null,2], low = 2, high = 4", output: "[2]", explanation: "Node 1 is trimmed, 2 becomes new root." }
      ],
      optimalSolution: `function trimBST(root, low, high) {\n  const tree = buildTree(root);\n  function trim(node) {\n    if (!node) return null;\n    if (node.val < low) return trim(node.right);\n    if (node.val > high) return trim(node.left);\n    node.left = trim(node.left);\n    node.right = trim(node.right);\n    return node;\n  }\n  return treeToArray(trim(tree));\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(H) recursion stack",
      suboptimalSolution: `function trimBST(root, low, high) {\n  const tree = buildTree(root);\n  function inOrder(n) {\n    if (!n) return [];\n    return [...inOrder(n.left), n.val, ...inOrder(n.right)];\n  }\n  const filtered = inOrder(tree).filter(v => v >= low && v <= high);\n  function build(arr, l, r) {\n    if (l > r) return null;\n    const m = Math.floor((l + r) / 2);\n    const node = { val: arr[m], left: null, right: null };\n    node.left = build(arr, l, m - 1);\n    node.right = build(arr, m + 1, r);\n    return node;\n  }\n  return treeToArray(build(filtered, 0, filtered.length - 1));\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Trimming left subtree when node.val < low (the right subtree could still be >= low)", "Creating brand new tree structure instead of preserving original ancestor-descendant relationships"],
      hints: [
        "If node.val < low, all nodes in its left subtree are also < low. Return trim(node.right).",
        "If node.val > high, all nodes in its right subtree are also > high. Return trim(node.left).",
        "Otherwise, trim both subtrees recursively and return node."
      ],
      oracleFn: (root: (number | null)[], low: number, high: number) => {
        const tree = buildTree(root);
        function trim(n: TreeNode | null): TreeNode | null {
          if (!n) return null;
          if (n.val < low) return trim(n.right);
          if (n.val > high) return trim(n.left);
          n.left = trim(n.left);
          n.right = trim(n.right);
          return n;
        }
        return treeToArray(trim(tree));
      },
      testCases: {
        functional: [
          [[1, 0, 2], 1, 2],
          [[3, 0, 4, null, 2, null, null, 1], 1, 3],
          [[1], 1, 2],
          [[1, null, 2], 2, 4]
        ],
        boundary: [
          [[3, 1, 4, null, 2], 3, 4],
          [[5, 3, 7, 2, 4, 6, 8], 4, 6],
          [[10], 1, 5]
        ],
        adversarial: [
          [[4, 2, 6, 1, 3, 5, 7], 2, 5],
          [[8, 3, 10, 1, 6, null, 14, null, null, 4, 7, 13], 5, 13]
        ],
        stress: [
          [Array.from({ length: 63 }, (_, i) => i + 1), 10, 50],
          [Array.from({ length: 127 }, (_, i) => i + 1), 20, 100]
        ]
      }
    }),

    // 244. Convert BST to Greater Tree
    createProblem({
      num: 244,
      title: "Convert BST to Greater Tree",
      slug: "convert-bst-to-greater-tree",
      level: 11,
      difficulty: "MEDIUM",
      topic: "Binary Search Tree / DFS",
      patternSlug: "trees-advanced",
      estimatedTimeMin: 20,
      statement: "Given the `root` of a Binary Search Tree (BST), convert it to a Greater Tree such that every key of the original BST is changed to the original key plus the sum of all keys greater than the original key in BST.\n\nReturn the root of the modified tree in level-order array format.",
      functionName: "convertBST",
      parameters: [{ name: "root", type: "(number | null)[]", description: "BST level-order array" }],
      returnType: "(number | null)[]",
      constraints: ["The number of nodes in the tree is in the range [0, 10^4].", "-10^4 <= Node.val <= 10^4", "All the values in the tree are unique.", "root is guaranteed to be a valid binary search tree."],
      examples: [
        { input: "root = [4,1,6,0,2,5,7,null,null,null,3,null,null,null,8]", output: "[30,36,21,36,35,26,15,null,null,null,33,null,null,null,8]", explanation: "Every node's value is augmented by all nodes with greater values." },
        { input: "root = [0,null,1]", output: "[1,null,1]", explanation: "Node 0 becomes 0 + 1 = 1." },
        { input: "root = []", output: "[]", explanation: "Empty tree." },
        { input: "root = [1,0,2]", output: "[3,3,2]", explanation: "2 unchanged, 1 becomes 3, 0 becomes 3." }
      ],
      optimalSolution: `function convertBST(root) {\n  const tree = buildTree(root);\n  if (!tree) return [];\n  let sum = 0;\n  function reverseInorder(node) {\n    if (!node) return;\n    reverseInorder(node.right);\n    sum += node.val;\n    node.val = sum;\n    reverseInorder(node.left);\n  }\n  reverseInorder(tree);\n  return treeToArray(tree);\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(H) recursion stack",
      suboptimalSolution: `function convertBST(root) {\n  const tree = buildTree(root);\n  if (!tree) return [];\n  const nodes = [];\n  function getNodes(n) {\n    if (!n) return;\n    nodes.push(n);\n    getNodes(n.left);\n    getNodes(n.right);\n  }\n  getNodes(tree);\n  for (const n of nodes) {\n    let s = 0;\n    for (const other of nodes) {\n      if (other.val >= n.val) s += other.val;\n    }\n    n.newVal = s;\n  }\n  for (const n of nodes) n.val = n.newVal;\n  return treeToArray(tree);\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Traversing left before right (standard in-order instead of reverse in-order)", "Using O(N^2) quadratic double iteration"],
      hints: [
        "In a BST, reverse in-order traversal (Right -> Root -> Left) visits nodes in descending order.",
        "Maintain a running sum accumulator as you visit each node.",
        "Update node.val = runningSum."
      ],
      oracleFn: (root: (number | null)[]) => {
        const tree = buildTree(root);
        if (!tree) return [];
        let sum = 0;
        function rev(n: TreeNode | null) {
          if (!n) return;
          rev(n.right);
          sum += n.val;
          n.val = sum;
          rev(n.left);
        }
        rev(tree);
        return treeToArray(tree);
      },
      testCases: {
        functional: [
          [[4, 1, 6, 0, 2, 5, 7, null, null, null, 3, null, null, null, 8]],
          [[0, null, 1]],
          [[]],
          [[1, 0, 2]]
        ],
        boundary: [
          [[1]],
          [[2, 1]],
          [[1, null, 2]]
        ],
        adversarial: [
          [[5, 2, 13]],
          [[3, 2, 4, 1]]
        ],
        stress: [
          [Array.from({ length: 63 }, (_, i) => i + 1)],
          [Array.from({ length: 127 }, (_, i) => (i + 1) * 3)]
        ]
      }
    }),

    // 245. Recover Binary Search Tree
    createProblem({
      num: 245,
      title: "Recover Binary Search Tree",
      slug: "recover-binary-search-tree",
      level: 11,
      difficulty: "MEDIUM",
      topic: "Binary Search Tree / DFS / Inorder",
      patternSlug: "trees-advanced",
      estimatedTimeMin: 25,
      statement: "You are given the `root` of a binary search tree (BST), where the values of exactly two nodes of the tree were swapped by mistake. Recover the tree without changing its structure.\n\nReturn the recovered tree in level-order array format.",
      functionName: "recoverTree",
      parameters: [{ name: "root", type: "(number | null)[]", description: "BST level-order array" }],
      returnType: "(number | null)[]",
      constraints: ["The number of nodes in the tree is in the range [2, 1000].", "-2^31 <= Node.val <= 2^31 - 1"],
      examples: [
        { input: "root = [1,3,null,null,2]", output: "[3,1,null,null,2]", explanation: "Nodes 1 and 3 were swapped; recovering restores valid BST." },
        { input: "root = [3,1,4,null,null,2]", output: "[2,1,4,null,null,3]", explanation: "Nodes 2 and 3 were swapped." },
        { input: "root = [2,3,1]", output: "[2,1,3]", explanation: "1 and 3 swapped." },
        { input: "root = [3,2,1]", output: "[1,2,3]", explanation: "1 and 3 swapped at root and right child." }
      ],
      optimalSolution: `function recoverTree(root) {\n  const tree = buildTree(root);\n  if (!tree) return [];\n  let first = null, second = null, prev = null;\n  function inorder(node) {\n    if (!node) return;\n    inorder(node.left);\n    if (prev && prev.val > node.val) {\n      if (!first) first = prev;\n      second = node;\n    }\n    prev = node;\n    inorder(node.right);\n  }\n  inorder(tree);\n  if (first && second) {\n    const temp = first.val;\n    first.val = second.val;\n    second.val = temp;\n  }\n  return treeToArray(tree);\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(H) recursion stack",
      suboptimalSolution: `function recoverTree(root) {\n  const tree = buildTree(root);\n  if (!tree) return [];\n  const nodes = [];\n  function inorder(n) {\n    if (!n) return;\n    inorder(n.left);\n    nodes.push(n);\n    inorder(n.right);\n  }\n  inorder(tree);\n  const vals = nodes.map(n => n.val).sort((a, b) => a - b);\n  for (let i = 0; i < nodes.length; i++) nodes[i].val = vals[i];\n  return treeToArray(tree);\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(N) node array",
      commonMistakes: ["Failing to handle adjacent swapped nodes where both discrepancies occur in a single inversion", "Re-allocating the tree nodes rather than swapping node values in-place"],
      hints: [
        "Inorder traversal of a valid BST is strictly ascending.",
        "Track `prev` node. If `prev.val > curr.val`, record `first = prev` (first occurrence) and `second = curr`.",
        "Swap values of `first` and `second` after traversal."
      ],
      oracleFn: (root: (number | null)[]) => {
        const tree = buildTree(root);
        if (!tree) return [];
        let first: TreeNode | null = null, second: TreeNode | null = null, prev: TreeNode | null = null;
        function inorder(n: TreeNode | null) {
          if (!n) return;
          inorder(n.left);
          if (prev && prev.val > n.val) {
            if (!first) first = prev;
            second = n;
          }
          prev = n;
          inorder(n.right);
        }
        inorder(tree);
        if (first && second) {
          const t = (first as any).val;
          (first as any).val = (second as any).val;
          (second as any).val = t;
        }
        return treeToArray(tree);
      },
      testCases: {
        functional: [
          [[1, 3, null, null, 2]],
          [[3, 1, 4, null, null, 2]],
          [[2, 3, 1]],
          [[3, 2, 1]]
        ],
        boundary: [
          [[2, 1]],
          [[1, null, 2]],
          [[4, 2, 6, 1, 5, 3, 7]]
        ],
        adversarial: [
          [[146, 71, -13, 55, null, 231, 399, 321, null, null, null, null, null, -33]],
          [[10, 5, 15, null, null, 6, 20]]
        ],
        stress: [
          [Array.from({ length: 63 }, (_, i) => i + 1)],
          [Array.from({ length: 127 }, (_, i) => (i === 10 ? 90 : i === 90 ? 10 : i + 1))]
        ]
      }
    }),

    // 246. Unique Binary Search Trees
    createProblem({
      num: 246,
      title: "Unique Binary Search Trees",
      slug: "unique-binary-search-trees",
      level: 11,
      difficulty: "MEDIUM",
      topic: "Binary Search Tree / Dynamic Programming / Math",
      patternSlug: "trees-advanced",
      estimatedTimeMin: 15,
      statement: "Given an integer `n`, return the number of structurally unique BST's (binary search trees) which has exactly `n` nodes of unique values from `1` to `n`.",
      functionName: "numTrees",
      parameters: [{ name: "n", type: "number", description: "Number of unique nodes" }],
      returnType: "number",
      constraints: ["1 <= n <= 19"],
      examples: [
        { input: "n = 3", output: "5", explanation: "There are 5 unique BSTs that can be constructed from 3 nodes (Catalan number C_3)." },
        { input: "n = 1", output: "1", explanation: "Single node has 1 unique BST." },
        { input: "n = 2", output: "2", explanation: "Two unique BSTs: 1->2 and 2->1." },
        { input: "n = 4", output: "14", explanation: "C_4 = 14 unique BSTs." }
      ],
      optimalSolution: `function numTrees(n) {\n  const dp = new Array(n + 1).fill(0);\n  dp[0] = 1;\n  dp[1] = 1;\n  for (let i = 2; i <= n; i++) {\n    for (let j = 1; j <= i; j++) {\n      dp[i] += dp[j - 1] * dp[i - j];\n    }\n  }\n  return dp[n];\n}`,
      optimalTimeComplexity: "O(N^2)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function numTrees(n) {\n  function count(num) {\n    if (num <= 1) return 1;\n    let sum = 0;\n    for (let i = 1; i <= num; i++) {\n      sum += count(i - 1) * count(num - i);\n    }\n    return sum;\n  }\n  return count(n);\n}`,
      suboptimalTimeComplexity: "O(3^N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Setting base case dp[0] = 0 instead of 1 (an empty subtree has 1 unique configuration)"],
      hints: [
        "Pick each number `j` from 1 to `i` as the root.",
        "Left subtree will have `j - 1` nodes, right subtree will have `i - j` nodes.",
        "Multiply dp[j - 1] * dp[i - j] and sum over all j."
      ],
      oracleFn: (n: number) => {
        const dp = new Array(n + 1).fill(0);
        dp[0] = 1;
        dp[1] = 1;
        for (let i = 2; i <= n; i++) {
          for (let j = 1; j <= i; j++) {
            dp[i] += dp[j - 1] * dp[i - j];
          }
        }
        return dp[n];
      },
      testCases: {
        functional: [
          [3],
          [1],
          [2],
          [4]
        ],
        boundary: [
          [5],
          [6],
          [7]
        ],
        adversarial: [
          [8],
          [9],
          [10]
        ],
        stress: [
          [15],
          [19]
        ]
      }
    }),

    // 247. Unique Binary Search Trees II
    createProblem({
      num: 247,
      title: "Unique Binary Search Trees II",
      slug: "unique-binary-search-trees-ii",
      level: 11,
      difficulty: "MEDIUM",
      topic: "Binary Search Tree / Dynamic Programming / Backtracking",
      patternSlug: "trees-advanced",
      estimatedTimeMin: 25,
      statement: "Given an integer `n`, return all the structurally unique BST's (binary search trees), which has exactly `n` nodes of unique values from `1` to `n`. Return the answer in any order as an array of level-order arrays.",
      functionName: "generateTrees",
      parameters: [{ name: "n", type: "number", description: "Number of unique nodes" }],
      returnType: "(number | null)[][]",
      constraints: ["1 <= n <= 8"],
      examples: [
        { input: "n = 3", output: "[[1,null,2,null,3],[1,null,3,2],[2,1,3],[3,1,null,null,2],[3,2,null,1]]", explanation: "All 5 unique BSTs for n = 3." },
        { input: "n = 1", output: "[[1]]", explanation: "Single node tree." },
        { input: "n = 2", output: "[[1,null,2],[2,1]]", explanation: "Two trees for n = 2." },
        { input: "n = 0", output: "[]", explanation: "Empty list for n = 0." }
      ],
      optimalSolution: `function generateTrees(n) {\n  if (n === 0) return [];\n  function build(start, end) {\n    const res = [];\n    if (start > end) return [null];\n    for (let i = start; i <= end; i++) {\n      const leftSubtrees = build(start, i - 1);\n      const rightSubtrees = build(i + 1, end);\n      for (const left of leftSubtrees) {\n        for (const right of rightSubtrees) {\n          res.push({ val: i, left, right });\n        }\n      }\n    }\n    return res;\n  }\n  return build(1, n).map(tree => treeToArray(tree));\n}`,
      optimalTimeComplexity: "O(4^N / N^(1/2)) Catalan number",
      optimalSpaceComplexity: "O(4^N / N^(1/2))",
      suboptimalSolution: `function generateTrees(n) {\n  if (n === 0) return [];\n  function build(start, end) {\n    const res = [];\n    if (start > end) return [null];\n    for (let i = start; i <= end; i++) {\n      for (const l of build(start, i - 1)) {\n        for (const r of build(i + 1, end)) {\n          res.push({ val: i, left: l, right: r });\n        }\n      }\n    }\n    return res;\n  }\n  return build(1, n).map(t => treeToArray(t));\n}`,
      suboptimalTimeComplexity: "O(4^N / N^(1/2))",
      suboptimalSpaceComplexity: "O(4^N / N^(1/2))",
      commonMistakes: ["Returning [] instead of [null] when start > end (an empty child must be represented by a null root)", "Re-using mutable node objects causing cyclic tree references"],
      hints: [
        "Use divide and conquer: generate all left subtrees for 1..i-1 and right subtrees for i+1..n.",
        "Combine every left subtree with every right subtree under root i.",
        "When start > end, return [null] so nested loops run exactly once."
      ],
      oracleFn: (n: number) => {
        if (n === 0) return [];
        function build(s: number, e: number): (TreeNode | null)[] {
          if (s > e) return [null];
          const res: (TreeNode | null)[] = [];
          for (let i = s; i <= e; i++) {
            const lefts = build(s, i - 1);
            const rights = build(i + 1, e);
            for (const l of lefts) {
              for (const r of rights) {
                res.push({ val: i, left: l, right: r });
              }
            }
          }
          return res;
        }
        return build(1, n).map(t => treeToArray(t));
      },
      testCases: {
        functional: [
          [3],
          [1],
          [2],
          [0]
        ],
        boundary: [
          [4],
          [5]
        ],
        adversarial: [
          [6],
          [7]
        ],
        stress: [
          [8],
          [3]
        ]
      }
    }),

    // 248. All Nodes Distance K in Binary Tree
    createProblem({
      num: 248,
      title: "All Nodes Distance K in Binary Tree",
      slug: "all-nodes-distance-k-in-binary-tree",
      level: 11,
      difficulty: "MEDIUM",
      topic: "Binary Tree / Graph / BFS",
      patternSlug: "trees-advanced",
      estimatedTimeMin: 25,
      statement: "Given the `root` of a binary tree, the value of a target node `target`, and an integer `k`, return an array of the values of all nodes that have a distance `k` from the target node.\n\nYou can return the answer in any order (sorted in ascending order for deterministic output).",
      functionName: "distanceK",
      parameters: [
        { name: "root", type: "(number | null)[]", description: "Binary tree level-order array" },
        { name: "target", type: "number", description: "Target node value" },
        { name: "k", type: "number", description: "Distance k" }
      ],
      returnType: "number[]",
      constraints: ["The number of nodes in the tree is in the range [1, 500].", "0 <= Node.val <= 500", "All values Node.val are unique.", "target is the value of one of the nodes in the tree.", "0 <= k <= 1000"],
      examples: [
        { input: "root = [3,5,1,6,2,0,8,null,null,7,4], target = 5, k = 2", output: "[1,4,7]", explanation: "Nodes at distance 2 from node 5 are 7, 4, and 1." },
        { input: "root = [1], target = 1, k = 3", output: "[]", explanation: "No node at distance 3 in 1-node tree." },
        { input: "root = [1], target = 1, k = 0", output: "[1]", explanation: "Distance 0 is the target node itself." },
        { input: "root = [1,2,3], target = 2, k = 1", output: "[1]", explanation: "Parent node 1 is at distance 1." }
      ],
      optimalSolution: `function distanceK(root, target, k) {\n  const tree = buildTree(root);\n  if (!tree) return [];\n  const parentMap = new Map();\n  let targetNode = null;\n  function mapParents(node, par) {\n    if (!node) return;\n    if (node.val === target) targetNode = node;\n    parentMap.set(node, par);\n    mapParents(node.left, node);\n    mapParents(node.right, node);\n  }\n  mapParents(tree, null);\n  if (!targetNode) return [];\n  const visited = new Set();\n  const queue = [targetNode];\n  visited.add(targetNode);\n  let dist = 0;\n  while (queue.length > 0) {\n    if (dist === k) return queue.map(n => n.val).sort((a, b) => a - b);\n    const len = queue.length;\n    for (let i = 0; i < len; i++) {\n      const curr = queue.shift();\n      const parent = parentMap.get(curr);\n      if (parent && !visited.has(parent)) { visited.add(parent); queue.push(parent); }\n      if (curr.left && !visited.has(curr.left)) { visited.add(curr.left); queue.push(curr.left); }\n      if (curr.right && !visited.has(curr.right)) { visited.add(curr.right); queue.push(curr.right); }\n    }\n    dist++;\n  }\n  return [];\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function distanceK(root, target, k) {\n  const tree = buildTree(root);\n  if (!tree) return [];\n  const adj = new Map();\n  function buildGraph(node) {\n    if (!node) return;\n    if (!adj.has(node.val)) adj.set(node.val, []);\n    if (node.left) {\n      if (!adj.has(node.left.val)) adj.set(node.left.val, []);\n      adj.get(node.val).push(node.left.val);\n      adj.get(node.left.val).push(node.val);\n      buildGraph(node.left);\n    }\n    if (node.right) {\n      if (!adj.has(node.right.val)) adj.set(node.right.val, []);\n      adj.get(node.val).push(node.right.val);\n      adj.get(node.right.val).push(node.val);\n      buildGraph(node.right);\n    }\n  }\n  buildGraph(tree);\n  const q = [[target, 0]];\n  const vis = new Set([target]);\n  const res = [];\n  while (q.length > 0) {\n    const [nodeVal, d] = q.shift();\n    if (d === k) res.push(nodeVal);\n    else if (d < k) {\n      for (const neighbor of (adj.get(nodeVal) || [])) {\n        if (!vis.has(neighbor)) {\n          vis.add(neighbor);\n          q.push([neighbor, d + 1]);\n        }\n      }\n    }\n  }\n  return res.sort((a, b) => a - b);\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Only searching downwards in subtrees (ignoring upwards parent connections)", "Infinite loops without visited tracking when traversing undirected parent edges"],
      hints: [
        "First pass: do a DFS to map each child node to its parent.",
        "Second pass: do a BFS starting from the target node, exploring left child, right child, and parent.",
        "Track visited nodes to prevent cycles."
      ],
      oracleFn: (root: (number | null)[], target: number, k: number) => {
        const tree = buildTree(root);
        if (!tree) return [];
        const par = new Map<TreeNode, TreeNode | null>();
        let targetNode: TreeNode | null = null;
        function dfs(n: TreeNode | null, p: TreeNode | null) {
          if (!n) return;
          if (n.val === target) targetNode = n;
          par.set(n, p);
          dfs(n.left, n);
          dfs(n.right, n);
        }
        dfs(tree, null);
        if (!targetNode) return [];
        const vis = new Set<TreeNode>();
        const q: TreeNode[] = [targetNode];
        vis.add(targetNode);
        let d = 0;
        while (q.length > 0) {
          if (d === k) return q.map(n => n.val).sort((a, b) => a - b);
          const len = q.length;
          for (let i = 0; i < len; i++) {
            const cur = q.shift()!;
            const p = par.get(cur);
            if (p && !vis.has(p)) { vis.add(p); q.push(p); }
            if (cur.left && !vis.has(cur.left)) { vis.add(cur.left); q.push(cur.left); }
            if (cur.right && !vis.has(cur.right)) { vis.add(cur.right); q.push(cur.right); }
          }
          d++;
        }
        return [];
      },
      testCases: {
        functional: [
          [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 2],
          [[1], 1, 3],
          [[1], 1, 0],
          [[1, 2, 3], 2, 1]
        ],
        boundary: [
          [[1, 2], 2, 1],
          [[1, 2], 1, 1],
          [[1, 2, 3, 4, 5], 4, 3]
        ],
        adversarial: [
          [[0, 1, null, 3, 2], 2, 1],
          [[0, 2, 1, null, null, 3], 3, 3]
        ],
        stress: [
          [Array.from({ length: 63 }, (_, i) => i + 1), 32, 3],
          [Array.from({ length: 127 }, (_, i) => i + 1), 1, 5]
        ]
      }
    }),

    // 249. Find Duplicate Subtrees
    createProblem({
      num: 249,
      title: "Find Duplicate Subtrees",
      slug: "find-duplicate-subtrees",
      level: 11,
      difficulty: "MEDIUM",
      topic: "Binary Tree / Hashing / DFS",
      patternSlug: "trees-advanced",
      estimatedTimeMin: 25,
      statement: "Given the `root` of a binary tree, return all duplicate subtrees.\n\nFor each kind of duplicate subtrees, you only need to return the root node of any one of them in level-order array format.",
      functionName: "findDuplicateSubtrees",
      parameters: [{ name: "root", type: "(number | null)[]", description: "Binary tree level-order array" }],
      returnType: "(number | null)[][]",
      constraints: ["The number of the nodes in the tree will be in the range [1, 5000].", "-200 <= Node.val <= 200"],
      examples: [
        { input: "root = [1,2,3,4,null,2,4,null,null,4]", output: "[[4],[2,4]]", explanation: "Subtree [4] occurs three times, subtree [2, 4] occurs twice." },
        { input: "root = [2,1,1]", output: "[[1]]", explanation: "Subtree [1] occurs twice." },
        { input: "root = [2,2,2,3,null,3,null]", output: "[[2,3],[3]]", explanation: "Subtree [3] and [2, 3] are duplicated." },
        { input: "root = [1]", output: "[]", explanation: "No duplicate subtrees in a single node tree." }
      ],
      optimalSolution: `function findDuplicateSubtrees(root) {\n  const tree = buildTree(root);\n  if (!tree) return [];\n  const count = new Map();\n  const duplicates = [];\n  function serialize(node) {\n    if (!node) return '#';\n    const serial = node.val + ',' + serialize(node.left) + ',' + serialize(node.right);\n    count.set(serial, (count.get(serial) || 0) + 1);\n    if (count.get(serial) === 2) {\n      duplicates.push(treeToArray(node));\n    }\n    return serial;\n  }\n  serialize(tree);\n  return duplicates.sort((a, b) => a.length - b.length || (a[0] || 0) - (b[0] || 0));\n}`,
      optimalTimeComplexity: "O(N^2) or O(N) with tree hashing IDs",
      optimalSpaceComplexity: "O(N^2)",
      suboptimalSolution: `function findDuplicateSubtrees(root) {\n  const tree = buildTree(root);\n  if (!tree) return [];\n  const map = new Map();\n  const res = [];\n  function dfs(node) {\n    if (!node) return '#';\n    const str = node.val + '(' + dfs(node.left) + ')(' + dfs(node.right) + ')';\n    map.set(str, (map.get(str) || 0) + 1);\n    if (map.get(str) === 2) res.push(treeToArray(node));\n    return str;\n  }\n  dfs(tree);\n  return res.sort((a, b) => a.length - b.length || (a[0] || 0) - (b[0] || 0));\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N^2)",
      commonMistakes: ["Adding the duplicate to output on every recurrence (> 2) instead of exactly when count === 2", "Inadequate null serialization causing false subtree equality"],
      hints: [
        "Serialize each subtree into a unique string representation (e.g. node.val + ',' + left + ',' + right).",
        "Maintain a frequency map of serialized strings.",
        "When a serialized string is encountered for the second time (count === 2), add it to the output."
      ],
      oracleFn: (root: (number | null)[]) => {
        const tree = buildTree(root);
        if (!tree) return [];
        const count = new Map<string, number>();
        const dupes: (number | null)[][] = [];
        function ser(n: TreeNode | null): string {
          if (!n) return '#';
          const s = n.val + ',' + ser(n.left) + ',' + ser(n.right);
          count.set(s, (count.get(s) || 0) + 1);
          if (count.get(s) === 2) dupes.push(treeToArray(n));
          return s;
        }
        ser(tree);
        return dupes.sort((a, b) => a.length - b.length || (a[0] || 0) - (b[0] || 0));
      },
      testCases: {
        functional: [
          [[1, 2, 3, 4, null, 2, 4, null, null, 4]],
          [[2, 1, 1]],
          [[2, 2, 2, 3, null, 3, null]],
          [[1]]
        ],
        boundary: [
          [[0, 0, 0, 0, null, null, 0]],
          [[1, 2, 3]],
          [[1, 1, 1]]
        ],
        adversarial: [
          [[10, 20, 20, 30, null, 30, null]],
          [[1, 2, 3, 4, 5, 2, 4, null, null, null, null, 4]]
        ],
        stress: [
          [Array.from({ length: 63 }, (_, i) => (i % 2 === 0 ? 1 : 2))],
          [Array.from({ length: 80 }, (_, i) => i % 5)]
        ]
      }
    }),

    // 250. Vertical Order Traversal of a Binary Tree
    createProblem({
      num: 250,
      title: "Vertical Order Traversal of a Binary Tree",
      slug: "vertical-order-traversal-of-a-binary-tree",
      level: 11,
      difficulty: "HARD",
      topic: "Binary Tree / BFS / Sorting",
      patternSlug: "trees-advanced",
      estimatedTimeMin: 30,
      statement: "Given the `root` of a binary tree, calculate the vertical order traversal of the binary tree.\n\nFor each node at position `(row, col)`, its left and right children will be at `(row + 1, col - 1)` and `(row + 1, col + 1)` respectively. The root of the tree is at `(0, 0)`.\n\nThe vertical order traversal of a binary tree is a list of top-to-bottom orderings for each column index starting from the leftmost column and ending on the rightmost column. If two nodes have the same row and column, they should be ordered from smallest to largest value.",
      functionName: "verticalTraversal",
      parameters: [{ name: "root", type: "(number | null)[]", description: "Binary tree level-order array" }],
      returnType: "number[][]",
      constraints: ["The number of nodes in the tree is in the range [1, 1000].", "0 <= Node.val <= 1000"],
      examples: [
        { input: "root = [3,9,20,null,null,15,7]", output: "[[9],[3,15],[20],[7]]", explanation: "Column -1: [9]. Column 0: [3, 15]. Column 1: [20]. Column 2: [7]." },
        { input: "root = [1,2,3,4,5,6,7]", output: "[[4],[2],[1,5,6],[3],[7]]", explanation: "Nodes 5 and 6 both have row 2, col 0. 5 < 6, so [1, 5, 6]." },
        { input: "root = [1,2,3,4,6,5,7]", output: "[[4],[2],[1,5,6],[3],[7]]", explanation: "Same vertical coordinate sorts smaller value 5 before 6." },
        { input: "root = [1]", output: "[[1]]", explanation: "Single node at (0, 0)." }
      ],
      optimalSolution: `function verticalTraversal(root) {\n  const tree = buildTree(root);\n  if (!tree) return [];\n  const nodes = [];\n  function dfs(node, row, col) {\n    if (!node) return;\n    nodes.push({ row, col, val: node.val });\n    dfs(node.left, row + 1, col - 1);\n    dfs(node.right, row + 1, col + 1);\n  }\n  dfs(tree, 0, 0);\n  nodes.sort((a, b) => a.col - b.col || a.row - b.row || a.val - b.val);\n  const res = [];\n  let currCol = null;\n  let colList = [];\n  for (const n of nodes) {\n    if (currCol !== n.col) {\n      if (colList.length > 0) res.push(colList);\n      colList = [];\n      currCol = n.col;\n    }\n    colList.push(n.val);\n  }\n  if (colList.length > 0) res.push(colList);\n  return res;\n}`,
      optimalTimeComplexity: "O(N log N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function verticalTraversal(root) {\n  const tree = buildTree(root);\n  if (!tree) return [];\n  const map = new Map();\n  function dfs(n, r, c) {\n    if (!n) return;\n    if (!map.has(c)) map.set(c, []);\n    map.get(c).push({ r, val: n.val });\n    dfs(n.left, r + 1, c - 1);\n    dfs(n.right, r + 1, c + 1);\n  }\n  dfs(tree, 0, 0);\n  const cols = Array.from(map.keys()).sort((a, b) => a - b);\n  const res = [];\n  for (const c of cols) {\n    const list = map.get(c).sort((a, b) => a.r - b.r || a.val - b.val);\n    res.push(list.map(item => item.val));\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Failing to sort nodes with identical (row, col) by node value", "Only tracking column coordinates and ignoring row depth ordering"],
      hints: [
        "Traverse tree keeping track of (row, col) coordinates for every node.",
        "Sort all nodes primarily by `col`, secondarily by `row`, and thirdly by `val`.",
        "Group adjacent nodes with matching `col` into individual result arrays."
      ],
      oracleFn: (root: (number | null)[]) => {
        const tree = buildTree(root);
        if (!tree) return [];
        const nodes: { row: number; col: number; val: number }[] = [];
        function dfs(n: TreeNode | null, r: number, c: number) {
          if (!n) return;
          nodes.push({ row: r, col: c, val: n.val });
          dfs(n.left, r + 1, c - 1);
          dfs(n.right, r + 1, c + 1);
        }
        dfs(tree, 0, 0);
        nodes.sort((a, b) => a.col - b.col || a.row - b.row || a.val - b.val);
        const res: number[][] = [];
        let currCol: number | null = null;
        let curList: number[] = [];
        for (const n of nodes) {
          if (currCol !== n.col) {
            if (curList.length > 0) res.push(curList);
            curList = [];
            currCol = n.col;
          }
          curList.push(n.val);
        }
        if (curList.length > 0) res.push(curList);
        return res;
      },
      testCases: {
        functional: [
          [[3, 9, 20, null, null, 15, 7]],
          [[1, 2, 3, 4, 5, 6, 7]],
          [[1, 2, 3, 4, 6, 5, 7]],
          [[1]]
        ],
        boundary: [
          [[1, 2, null, 3, null, 4]],
          [[1, null, 2, null, 3, null, 4]],
          [[0, 0, 0]]
        ],
        adversarial: [
          [[3, 1, 4, 0, 2, 2]],
          [[1, 2, 3, 4, 5, 5, 4]]
        ],
        stress: [
          [Array.from({ length: 63 }, (_, i) => i + 1)],
          [Array.from({ length: 127 }, (_, i) => (i % 2 === 0 ? i : null))]
        ]
      }
    }),

    // 251. Boundary of Binary Tree
    createProblem({
      num: 251,
      title: "Boundary of Binary Tree",
      slug: "boundary-of-binary-tree",
      level: 11,
      difficulty: "MEDIUM",
      topic: "Binary Tree / DFS",
      patternSlug: "trees-advanced",
      estimatedTimeMin: 25,
      statement: "The boundary of a binary tree is the concatenation of the root, the left boundary, the leaves in left-to-right order, and the reverse order of the right boundary.\n\nThe left boundary is the path from root to the left-most node (excluding leaves). If a node has a left child, next node is left child; else right child.\nThe right boundary is the path from root to the right-most node (excluding leaves), defined symmetrically. Return the values of boundary nodes in anti-clockwise order.",
      functionName: "boundaryOfBinaryTree",
      parameters: [{ name: "root", type: "(number | null)[]", description: "Binary tree level-order array" }],
      returnType: "number[]",
      constraints: ["The number of nodes in the tree is in the range [1, 10^4].", "-1000 <= Node.val <= 1000"],
      examples: [
        { input: "root = [1,null,2,3,4]", output: "[1,3,4,2]", explanation: "Root is 1. Left boundary is empty. Leaves are [3, 4]. Right boundary is [2] in reverse." },
        { input: "root = [1,2,3,4,5,6,null,null,null,7,8,9,10]", output: "[1,2,4,7,8,9,10,6,3]", explanation: "Full anti-clockwise traversal." },
        { input: "root = [1]", output: "[1]", explanation: "Single node tree." },
        { input: "root = [1,2,null,3]", output: "[1,2,3]", explanation: "Left boundary [2], leaf [3]." }
      ],
      optimalSolution: `function boundaryOfBinaryTree(root) {\n  const tree = buildTree(root);\n  if (!tree) return [];\n  const res = [];\n  function isLeaf(n) { return n && !n.left && !n.right; }\n  if (!isLeaf(tree)) res.push(tree.val);\n  // 1. Left boundary\n  let cur = tree.left;\n  while (cur) {\n    if (!isLeaf(cur)) res.push(cur.val);\n    cur = cur.left ? cur.left : cur.right;\n  }\n  // 2. Leaves\n  function addLeaves(n) {\n    if (!n) return;\n    if (isLeaf(n)) res.push(n.val);\n    addLeaves(n.left);\n    addLeaves(n.right);\n  }\n  addLeaves(tree);\n  // 3. Right boundary (reversed)\n  const rightBoundary = [];\n  cur = tree.right;\n  while (cur) {\n    if (!isLeaf(cur)) rightBoundary.push(cur.val);\n    cur = cur.right ? cur.right : cur.left;\n  }\n  while (rightBoundary.length > 0) res.push(rightBoundary.pop());\n  return res;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(H)",
      suboptimalSolution: `function boundaryOfBinaryTree(root) {\n  const tree = buildTree(root);\n  if (!tree) return [];\n  const isL = n => n && !n.left && !n.right;\n  const res = [];\n  if (!isL(tree)) res.push(tree.val);\n  let c = tree.left;\n  while (c) {\n    if (!isL(c)) res.push(c.val);\n    c = c.left ? c.left : c.right;\n  }\n  function lvs(n) {\n    if (!n) return;\n    if (isL(n)) res.push(n.val);\n    lvs(n.left);\n    lvs(n.right);\n  }\n  lvs(tree);\n  const r = [];\n  c = tree.right;\n  while (c) {\n    if (!isL(c)) r.unshift(c.val);\n    c = c.right ? c.right : c.left;\n  }\n  return res.concat(r);\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Double counting leaves in left/right boundaries and in the leaves pass", "Forgetting to reverse right boundary nodes"],
      hints: [
        "Divide problem into: Root, Left Boundary, Leaves (left-to-right), Right Boundary (reverse).",
        "A leaf is never included in left or right boundary passes.",
        "When finding left boundary, if curr.left is null, step into curr.right."
      ],
      oracleFn: (root: (number | null)[]) => {
        const tree = buildTree(root);
        if (!tree) return [];
        const res: number[] = [];
        const isLeaf = (n: TreeNode | null) => !!(n && !n.left && !n.right);
        if (!isLeaf(tree)) res.push(tree.val);
        let cur = tree.left;
        while (cur) {
          if (!isLeaf(cur)) res.push(cur.val);
          cur = cur.left ? cur.left : cur.right;
        }
        function addL(n: TreeNode | null) {
          if (!n) return;
          if (isLeaf(n)) res.push(n.val);
          addL(n.left);
          addL(n.right);
        }
        addL(tree);
        const rb: number[] = [];
        cur = tree.right;
        while (cur) {
          if (!isLeaf(cur)) rb.push(cur.val);
          cur = cur.right ? cur.right : cur.left;
        }
        while (rb.length > 0) res.push(rb.pop()!);
        return res;
      },
      testCases: {
        functional: [
          [[1, null, 2, 3, 4]],
          [[1, 2, 3, 4, 5, 6, null, null, null, 7, 8, 9, 10]],
          [[1]],
          [[1, 2, null, 3]]
        ],
        boundary: [
          [[1, 2]],
          [[1, null, 2]],
          [[1, 2, 3]]
        ],
        adversarial: [
          [[1, 2, 3, 4, null, 5, 6, null, 7, null, null, 8, 9]],
          [[10, 5, 20, 3, 7, null, 25]]
        ],
        stress: [
          [Array.from({ length: 63 }, (_, i) => i + 1)],
          [Array.from({ length: 127 }, (_, i) => (i % 2 === 0 ? i : null))]
        ]
      }
    }),

    // 252. Binary Tree Cameras
    createProblem({
      num: 252,
      title: "Binary Tree Cameras",
      slug: "binary-tree-cameras",
      level: 11,
      difficulty: "HARD",
      topic: "Binary Tree / Greedy / Dynamic Programming",
      patternSlug: "trees-advanced",
      estimatedTimeMin: 30,
      statement: "You are given the `root` of a binary tree. We install cameras on the tree nodes where each camera at a node can monitor its parent, itself, and its immediate children.\n\nReturn the minimum number of cameras needed to monitor all nodes of the tree.",
      functionName: "minCameraCover",
      parameters: [{ name: "root", type: "(number | null)[]", description: "Binary tree level-order array" }],
      returnType: "number",
      constraints: ["The number of nodes in the tree is in the range [1, 1000].", "Node.val == 0"],
      examples: [
        { input: "root = [0,0,null,0,0]", output: "1", explanation: "One camera placed at node index 1 monitors all nodes." },
        { input: "root = [0,0,null,0,null,0,null,null,0]", output: "2", explanation: "Two cameras are sufficient to cover all 5 nodes." },
        { input: "root = [0]", output: "1", explanation: "Single node requires 1 camera." },
        { input: "root = [0,0,0]", output: "1", explanation: "Placing camera at root monitors root and both children." }
      ],
      optimalSolution: `function minCameraCover(root) {\n  const tree = buildTree(root);\n  if (!tree) return 0;\n  let cameras = 0;\n  // States: 0 = unmonitored, 1 = has camera, 2 = monitored without camera\n  function dfs(node) {\n    if (!node) return 2;\n    const left = dfs(node.left);\n    const right = dfs(node.right);\n    if (left === 0 || right === 0) {\n      cameras++;\n      return 1;\n    }\n    if (left === 1 || right === 1) {\n      return 2;\n    }\n    return 0;\n  }\n  if (dfs(tree) === 0) cameras++;\n  return cameras;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(H) recursion stack",
      suboptimalSolution: `function minCameraCover(root) {\n  const tree = buildTree(root);\n  if (!tree) return 0;\n  let cams = 0;\n  function post(n) {\n    if (!n) return 2;\n    const l = post(n.left), r = post(n.right);\n    if (l === 0 || r === 0) { cams++; return 1; }\n    return (l === 1 || r === 1) ? 2 : 0;\n  }\n  if (post(tree) === 0) cams++;\n  return cams;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(H)",
      commonMistakes: ["Placing camera on leaves instead of their parents (greedy optimal is placing on parent of unmonitored leaves)", "Forgetting to place camera on root if root remains in unmonitored state (0)"],
      hints: [
        "Work bottom-up from leaves to root using post-order DFS.",
        "State 0: Node needs a camera (unmonitored).",
        "State 1: Node has a camera.",
        "State 2: Node is covered by a child or parent camera."
      ],
      oracleFn: (root: (number | null)[]) => {
        const tree = buildTree(root);
        if (!tree) return 0;
        let c = 0;
        function dfs(n: TreeNode | null): number {
          if (!n) return 2;
          const l = dfs(n.left), r = dfs(n.right);
          if (l === 0 || r === 0) { c++; return 1; }
          if (l === 1 || r === 1) return 2;
          return 0;
        }
        if (dfs(tree) === 0) c++;
        return c;
      },
      testCases: {
        functional: [
          [[0, 0, null, 0, 0]],
          [[0, 0, null, 0, null, 0, null, null, 0]],
          [[0]],
          [[0, 0, 0]]
        ],
        boundary: [
          [[0, 0]],
          [[0, null, 0]],
          [[0, 0, null, 0]]
        ],
        adversarial: [
          [[0, 0, 0, 0, 0, 0, 0]],
          [[0, 0, null, null, 0, 0]]
        ],
        stress: [
          [Array.from({ length: 63 }, () => 0)],
          [Array.from({ length: 127 }, (_, i) => (i % 2 === 0 ? 0 : null))]
        ]
      }
    }),

    // 253. Distribute Coins in Binary Tree
    createProblem({
      num: 253,
      title: "Distribute Coins in Binary Tree",
      slug: "distribute-coins-in-binary-tree",
      level: 11,
      difficulty: "MEDIUM",
      topic: "Binary Tree / DFS / Greedy",
      patternSlug: "trees-advanced",
      estimatedTimeMin: 25,
      statement: "You are given the `root` of a binary tree with `n` nodes where each node in the tree has `node.val` coins. There are `n` coins in total throughout the whole tree.\n\nIn one move, we may choose two adjacent nodes and move one coin from one node to another. A move may be from parent to child, or from child to parent.\n\nReturn the minimum number of moves required to make every node have exactly one coin.",
      functionName: "distributeCoins",
      parameters: [{ name: "root", type: "(number | null)[]", description: "Binary tree level-order array" }],
      returnType: "number",
      constraints: ["The number of nodes in the tree is in the range [2, 100].", "0 <= Node.val <= n", "The sum of all Node.val is n."],
      examples: [
        { input: "root = [3,0,0]", output: "2", explanation: "From root 3, move 1 coin to left child and 1 coin to right child. 2 moves total." },
        { input: "root = [0,3,0]", output: "3", explanation: "Left child moves 2 coins to root, then root moves 1 coin to right child (2 + 1 = 3 moves)." },
        { input: "root = [1,0,2]", output: "2", explanation: "Right child moves 1 coin to root, root moves 1 coin to left child." },
        { input: "root = [1,0,0,null,3]", output: "4", explanation: "4 moves required to balance coins." }
      ],
      optimalSolution: `function distributeCoins(root) {\n  const tree = buildTree(root);\n  if (!tree) return 0;\n  let moves = 0;\n  function dfs(node) {\n    if (!node) return 0;\n    const left = dfs(node.left);\n    const right = dfs(node.right);\n    moves += Math.abs(left) + Math.abs(right);\n    return node.val + left + right - 1;\n  }\n  dfs(tree);\n  return moves;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(H) recursion stack",
      suboptimalSolution: `function distributeCoins(root) {\n  const tree = buildTree(root);\n  if (!tree) return 0;\n  let total = 0;\n  function balance(n) {\n    if (!n) return 0;\n    const l = balance(n.left), r = balance(n.right);\n    total += Math.abs(l) + Math.abs(r);\n    return n.val + l + r - 1;\n  }\n  balance(tree);\n  return total;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(H)",
      commonMistakes: ["Not taking absolute value Math.abs(balance) when adding to moves", "Failing to subtract 1 (each node retains 1 coin for itself)"],
      hints: [
        "A subtree with N nodes and C coins has an excess of C - N coins (can be positive or negative).",
        "Number of coins that MUST pass through the edge connecting this subtree to its parent is |excess|.",
        "Sum |excess| over every node in post-order DFS."
      ],
      oracleFn: (root: (number | null)[]) => {
        const tree = buildTree(root);
        if (!tree) return 0;
        let moves = 0;
        function dfs(n: TreeNode | null): number {
          if (!n) return 0;
          const l = dfs(n.left);
          const r = dfs(n.right);
          moves += Math.abs(l) + Math.abs(r);
          return n.val + l + r - 1;
        }
        dfs(tree);
        return moves;
      },
      testCases: {
        functional: [
          [[3, 0, 0]],
          [[0, 3, 0]],
          [[1, 0, 2]],
          [[1, 0, 0, null, 3]]
        ],
        boundary: [
          [[2, 0]],
          [[0, 2]],
          [[1, 1, 1]]
        ],
        adversarial: [
          [[4, 0, null, 0, null, 0]],
          [[0, 0, 0, 4]]
        ],
        stress: [
          [Array.from({ length: 31 }, (_, i) => (i === 0 ? 31 : 0))],
          [Array.from({ length: 31 }, () => 1)]
        ]
      }
    }),

    // 254. Count Complete Tree Nodes
    createProblem({
      num: 254,
      title: "Count Complete Tree Nodes",
      slug: "count-complete-tree-nodes",
      level: 11,
      difficulty: "MEDIUM",
      topic: "Binary Tree / Binary Search",
      patternSlug: "trees-advanced",
      estimatedTimeMin: 20,
      statement: "Given the `root` of a complete binary tree, return the number of the nodes in the tree.\n\nAccording to Wikipedia, every level, except possibly the last, is completely filled in a complete binary tree, and all nodes in the last level are as far left as possible.\n\nDesign an algorithm that runs in less than `O(n)` time complexity.",
      functionName: "countNodes",
      parameters: [{ name: "root", type: "(number | null)[]", description: "Complete binary tree level-order array" }],
      returnType: "number",
      constraints: ["The number of nodes in the tree is in the range [0, 5 * 10^4].", "0 <= Node.val <= 5 * 10^4", "root is guaranteed to be a complete binary tree."],
      examples: [
        { input: "root = [1,2,3,4,5,6]", output: "6", explanation: "Tree has 6 nodes." },
        { input: "root = []", output: "0", explanation: "Empty tree has 0 nodes." },
        { input: "root = [1]", output: "1", explanation: "Single node tree has 1 node." },
        { input: "root = [1,2,3,4,5,6,7]", output: "7", explanation: "Perfect binary tree of depth 3 has 2^3 - 1 = 7 nodes." }
      ],
      optimalSolution: `function countNodes(root) {\n  const tree = buildTree(root);\n  if (!tree) return 0;\n  function getLeftHeight(node) {\n    let h = 0;\n    while (node) { h++; node = node.left; }\n    return h;\n  }\n  function getRightHeight(node) {\n    let h = 0;\n    while (node) { h++; node = node.right; }\n    return h;\n  }\n  const lh = getLeftHeight(tree);\n  const rh = getRightHeight(tree);\n  if (lh === rh) return (1 << lh) - 1;\n  return 1 + countNodes(treeToArray(tree.left)) + countNodes(treeToArray(tree.right));\n}`,
      optimalTimeComplexity: "O(log^2 N)",
      optimalSpaceComplexity: "O(log N)",
      suboptimalSolution: `function countNodes(root) {\n  const tree = buildTree(root);\n  if (!tree) return 0;\n  let c = 0;\n  function dfs(n) {\n    if (!n) return;\n    c++;\n    dfs(n.left);\n    dfs(n.right);\n  }\n  dfs(tree);\n  return c;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(H)",
      commonMistakes: ["Traversing all N nodes linearly with standard DFS/BFS O(N) instead of exploiting complete tree geometry in O(log^2 N)"],
      hints: [
        "Compute left-most height and right-most height.",
        "If left height == right height, the subtree is a full binary tree with 2^height - 1 nodes.",
        "Otherwise, recursively count nodes in left and right subtrees (one of them is guaranteed to be full)."
      ],
      oracleFn: (root: (number | null)[]) => {
        const tree = buildTree(root);
        if (!tree) return 0;
        let c = 0;
        const q = [tree];
        while (q.length > 0) {
          const n = q.shift()!;
          c++;
          if (n.left) q.push(n.left);
          if (n.right) q.push(n.right);
        }
        return c;
      },
      testCases: {
        functional: [
          [[1, 2, 3, 4, 5, 6]],
          [[]],
          [[1]],
          [[1, 2, 3, 4, 5, 6, 7]]
        ],
        boundary: [
          [[1, 2]],
          [[1, 2, 3]],
          [[1, 2, 3, 4]]
        ],
        adversarial: [
          [[1, 2, 3, 4, 5]],
          [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]]
        ],
        stress: [
          [Array.from({ length: 63 }, (_, i) => i + 1)],
          [Array.from({ length: 127 }, (_, i) => i + 1)]
        ]
      }
    }),

    // 255. Serialize and Deserialize BST
    createProblem({
      num: 255,
      title: "Serialize and Deserialize BST",
      slug: "serialize-and-deserialize-bst",
      level: 11,
      difficulty: "MEDIUM",
      topic: "Binary Search Tree / Design",
      patternSlug: "trees-advanced",
      estimatedTimeMin: 25,
      statement: "Serialization is converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.\n\nDesign an algorithm to serialize and deserialize a **binary search tree**. There is no restriction on how your serialization/deserialization algorithm should work. You need to ensure that a binary search tree can be serialized to a string, and this string can be deserialized to the original tree structure.\n\nImplement the `Codec` class.",
      executionModel: "DESIGN",
      functionName: "Codec",
      parameters: [
        { name: "commands", type: "string[]", description: "Array of operations: ['Codec', 'serialize', 'deserialize']" },
        { name: "args", type: "any[]", description: "Arguments for each operation" }
      ],
      returnType: "any[]",
      starterTemplates: {
        javascript: `/**\n * Definition for a binary tree node.\n * function TreeNode(val) {\n *     this.val = val;\n *     this.left = this.right = null;\n * }\n */\n\nclass Codec {\n  constructor() {}\n  /**\n   * @param {number[]} root\n   * @return {string}\n   */\n  serialize(root) {\n    // Encodes a tree to a single string.\n  }\n  /**\n   * @param {string} data\n   * @return {number[]}\n   */\n  deserialize(data) {\n    // Decodes your encoded data to tree.\n  }\n}\n`,
        typescript: `class Codec {\n  serialize(root: (number | null)[]): string {\n    throw new Error("Not implemented");\n  }\n  deserialize(data: string): (number | null)[] {\n    throw new Error("Not implemented");\n  }\n}\n`,
        python: `class Codec:\n    def serialize(self, root: list) -> str:\n        pass\n    def deserialize(self, data: str) -> list:\n        pass\n`
      },
      constraints: ["The number of nodes in the tree is in the range [0, 10^4].", "0 <= Node.val <= 10^4", "The input tree is guaranteed to be a BST."],
      examples: [
        {
          input: 'commands = ["Codec","serialize","deserialize"]\nargs = [[],[[2,1,3]],["2,1,3"]]',
          output: "[null,'2,1,3',[2,1,3]]",
          explanation: "BST serialized to preorder string '2,1,3' and deserialized back to original level-order array."
        },
        {
          input: 'commands = ["Codec","serialize","deserialize"]\nargs = [[],[[]],[""]]',
          output: "[null,'',[]]",
          explanation: "Empty tree serializes to empty string."
        },
        {
          input: 'commands = ["Codec","serialize","deserialize"]\nargs = [[],[[1]],["1"]]',
          output: "[null,'1',[1]]",
          explanation: "Single node tree."
        },
        {
          input: 'commands = ["Codec","serialize","deserialize"]\nargs = [[],[[5,3,6]],["5,3,6"]]',
          output: "[null,'5,3,6',[5,3,6]]",
          explanation: "Standard BST serialization."
        }
      ],
      optimalSolution: `class Codec {\n  serialize(root) {\n    if (!root || root.length === 0) return "";\n    const tree = buildTree(root);\n    const vals = [];\n    function preorder(node) {\n      if (!node) return;\n      vals.push(node.val);\n      preorder(node.left);\n      preorder(node.right);\n    }\n    preorder(tree);\n    return vals.join(",");\n  }\n  deserialize(data) {\n    if (!data || data.length === 0) return [];\n    const vals = data.split(",").map(Number);\n    let idx = 0;\n    function build(lower, upper) {\n      if (idx >= vals.length) return null;\n      const val = vals[idx];\n      if (val < lower || val > upper) return null;\n      idx++;\n      const node = { val, left: null, right: null };\n      node.left = build(lower, val);\n      node.right = build(val, upper);\n      return node;\n    }\n    return treeToArray(build(-Infinity, Infinity));\n  }\n}`,
      optimalTimeComplexity: "O(N) for both serialize and deserialize",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `class Codec {\n  serialize(root) {\n    if (!root || !root.length) return "";\n    return root.join(",");\n  }\n  deserialize(data) {\n    if (!data) return [];\n    return data.split(",").map(x => x === "null" ? null : Number(x));\n  }\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Storing null markers in BST serialization (unnecessary because BST property uniquely determines reconstruction from preorder)"],
      hints: [
        "In a BST, a pre-order traversal alone uniquely identifies the tree structure without null markers.",
        "Serialize by collecting pre-order values into a comma-separated string.",
        "Deserialize using lower and upper bounds in O(N) time."
      ],
      oracleFn: (operations: string[], args: any[]) => {
        class Codec {
          serialize(root: (number | null)[]) {
            if (!root || root.length === 0) return "";
            const tree = buildTree(root);
            const vals: number[] = [];
            function preorder(n: TreeNode | null) {
              if (!n) return;
              vals.push(n.val);
              preorder(n.left);
              preorder(n.right);
            }
            preorder(tree);
            return vals.join(",");
          }
          deserialize(data: string) {
            if (!data || data.length === 0) return [];
            const vals = data.split(",").map(Number);
            let idx = 0;
            function build(lower: number, upper: number): TreeNode | null {
              if (idx >= vals.length) return null;
              const val = vals[idx];
              if (val < lower || val > upper) return null;
              idx++;
              const node: TreeNode = { val, left: null, right: null };
              node.left = build(lower, val);
              node.right = build(val, upper);
              return node;
            }
            return treeToArray(build(-Infinity, Infinity));
          }
        }
        let codec: any = null;
        const res: any[] = [];
        for (let i = 0; i < operations.length; i++) {
          const cmd = operations[i];
          if (cmd === 'Codec') { codec = new Codec(); res.push(null); }
          else if (cmd === 'serialize') { res.push(codec!.serialize(args[i][0])); }
          else if (cmd === 'deserialize') { res.push(codec!.deserialize(args[i][0])); }
        }
        return res;
      },
      testCases: {
        functional: [
          [["Codec", "serialize", "deserialize"], [[], [[2, 1, 3]], ["2,1,3"]]],
          [["Codec", "serialize", "deserialize"], [[], [[]], [""]]],
          [["Codec", "serialize", "deserialize"], [[], [[1]], ["1"]]],
          [["Codec", "serialize", "deserialize"], [[], [[5, 3, 6]], ["5,3,6"]]]
        ],
        boundary: [
          [["Codec", "serialize"], [[], [[10, 5, 15, 2, 7, 12, 18]]]],
          [["Codec", "deserialize"], [[], ["10,5,2,7,15,12,18"]]],
          [["Codec", "serialize", "deserialize"], [[], [[2, null, 3]], ["2,3"]]]
        ],
        adversarial: [
          [["Codec", "serialize", "deserialize"], [[], [[4, 2, 6, 1, 3, 5, 7]], ["4,2,1,3,6,5,7"]]],
          [["Codec", "deserialize"], [[], ["50,30,20,40,70,60,80"]]]
        ],
        stress: [
          [["Codec", "serialize"], [[], [Array.from({ length: 63 }, (_, i) => i + 1)]]],
          [["Codec", "deserialize"], [[], [Array.from({ length: 63 }, (_, i) => i + 1).join(",")]]]
        ]
      }
    }),

    // 256. Maximum Width of Binary Tree
    createProblem({
      num: 256,
      title: "Maximum Width of Binary Tree",
      slug: "maximum-width-of-binary-tree",
      level: 11,
      difficulty: "MEDIUM",
      topic: "Binary Tree / BFS / Math",
      patternSlug: "trees-advanced",
      estimatedTimeMin: 25,
      statement: "Given the `root` of a binary tree, return the maximum width of the given tree.\n\nThe maximum width of a tree is the maximum width among all levels.\n\nThe width of one level is defined as the length between the end-nodes (the leftmost and rightmost non-null nodes), where the null nodes between the end-nodes that would be present in a complete binary tree extending down to that level are also counted into the length calculation.\n\nIt is guaranteed that the answer will in the range of a 32-bit signed integer.",
      functionName: "widthOfBinaryTree",
      parameters: [{ name: "root", type: "(number | null)[]", description: "Binary tree level-order array" }],
      returnType: "number",
      constraints: ["The number of nodes in the tree is in the range [1, 3000].", "-100 <= Node.val <= 100"],
      examples: [
        { input: "root = [1,3,2,5,3,null,9]", output: "4", explanation: "The maximum width is at level 3 with length 4 (indices 5, 3, null, 9)." },
        { input: "root = [1,3,2,5,null,null,9,6,null,7]", output: "7", explanation: "Level 4 has width 7 between nodes 6 and 7." },
        { input: "root = [1,3,2,5]", output: "2", explanation: "Level 2 has width 2." },
        { input: "root = [1]", output: "1", explanation: "Single node tree has width 1." }
      ],
      optimalSolution: `function widthOfBinaryTree(root) {\n  const tree = buildTree(root);\n  if (!tree) return 0;\n  let maxWidth = 0;\n  // Queue stores [node, index]\n  const queue = [[tree, 0n]];\n  while (queue.length > 0) {\n    const size = queue.length;\n    const minIndex = queue[0][1];\n    let first = 0n, last = 0n;\n    for (let i = 0; i < size; i++) {\n      const [node, idx] = queue.shift();\n      const normalized = idx - minIndex;\n      if (i === 0) first = normalized;\n      if (i === size - 1) last = normalized;\n      if (node.left) queue.push([node.left, 2n * normalized]);\n      if (node.right) queue.push([node.right, 2n * normalized + 1n]);\n    }\n    const width = Number(last - first + 1n);\n    if (width > maxWidth) maxWidth = width;\n  }\n  return maxWidth;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function widthOfBinaryTree(root) {\n  const tree = buildTree(root);\n  if (!tree) return 0;\n  let max = 0;\n  const q = [[tree, 0]];\n  while (q.length > 0) {\n    const len = q.length;\n    const base = q[0][1];\n    let start = 0, end = 0;\n    for (let i = 0; i < len; i++) {\n      const [n, idx] = q.shift();\n      const norm = idx - base;\n      if (i === 0) start = norm;\n      if (i === len - 1) end = norm;\n      if (n.left) q.push([n.left, 2 * norm]);\n      if (n.right) q.push([n.right, 2 * norm + 1]);\n    }\n    max = Math.max(max, end - start + 1);\n  }\n  return max;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Integer overflow on large tree depths without BigInt or index normalization (idx - minIndex)"],
      hints: [
        "Assign 0-based indices to nodes: left child is 2*i, right child is 2*i + 1.",
        "Normalize indices at each level by subtracting the leftmost node's index to avoid integer overflow.",
        "Use BigInt or normalization so calculations remain within safe numeric bounds."
      ],
      oracleFn: (root: (number | null)[]) => {
        const tree = buildTree(root);
        if (!tree) return 0;
        let maxWidth = 0;
        const queue: [TreeNode, bigint][] = [[tree, 0n]];
        while (queue.length > 0) {
          const size = queue.length;
          const minIdx = queue[0][1];
          let first = 0n, last = 0n;
          for (let i = 0; i < size; i++) {
            const [node, idx] = queue.shift()!;
            const norm = idx - minIdx;
            if (i === 0) first = norm;
            if (i === size - 1) last = norm;
            if (node.left) queue.push([node.left, 2n * norm]);
            if (node.right) queue.push([node.right, 2n * norm + 1n]);
          }
          const w = Number(last - first + 1n);
          if (w > maxWidth) maxWidth = w;
        }
        return maxWidth;
      },
      testCases: {
        functional: [
          [[1, 3, 2, 5, 3, null, 9]],
          [[1, 3, 2, 5, null, null, 9, 6, null, 7]],
          [[1, 3, 2, 5]],
          [[1]]
        ],
        boundary: [
          [[1, 3, 2]],
          [[1, 2, null, 3, null, 4]],
          [[1, null, 2, null, 3, null, 4]]
        ],
        adversarial: [
          [[1, 1, 1, 1, 1, 1, 1, null, null, null, 1, null, null, null, 1]],
          [[1, 2, 3, 4, null, null, 5]]
        ],
        stress: [
          [Array.from({ length: 63 }, (_, i) => i + 1)],
          [Array.from({ length: 127 }, (_, i) => (i % 2 === 0 ? i : null))]
        ]
      }
    }),

    // 257. Find Leaves of Binary Tree
    createProblem({
      num: 257,
      title: "Find Leaves of Binary Tree",
      slug: "find-leaves-of-binary-tree",
      level: 11,
      difficulty: "MEDIUM",
      topic: "Binary Tree / DFS",
      patternSlug: "trees-advanced",
      estimatedTimeMin: 20,
      statement: "Given the `root` of a binary tree, collect a tree's nodes as if you were doing this: collect and remove all leaves, repeat until the tree is empty.\n\nReturn an array of arrays representing the values of leaves collected at each step.",
      functionName: "findLeaves",
      parameters: [{ name: "root", type: "(number | null)[]", description: "Binary tree level-order array" }],
      returnType: "number[][]",
      constraints: ["The number of nodes in the tree is in the range [1, 100].", "-100 <= Node.val <= 100"],
      examples: [
        { input: "root = [1,2,3,4,5]", output: "[[4,5,3],[2],[1]]", explanation: "Leaves are [4, 5, 3], then [2], then [1]." },
        { input: "root = [1]", output: "[[1]]", explanation: "Single node tree leaf is [1]." },
        { input: "root = [1,2,3]", output: "[[2,3],[1]]", explanation: "First leaves are [2, 3], then root [1]." },
        { input: "root = [1,2,null,3]", output: "[[3],[2],[1]]", explanation: "Skewed tree collected sequentially." }
      ],
      optimalSolution: `function findLeaves(root) {\n  const tree = buildTree(root);\n  if (!tree) return [];\n  const res = [];\n  function getHeight(node) {\n    if (!node) return -1;\n    const leftH = getHeight(node.left);\n    const rightH = getHeight(node.right);\n    const h = Math.max(leftH, rightH) + 1;\n    if (!res[h]) res[h] = [];\n    res[h].push(node.val);\n    return h;\n  }\n  getHeight(tree);\n  return res;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function findLeaves(root) {\n  const tree = buildTree(root);\n  if (!tree) return [];\n  const res = [];\n  function isLeaf(n) { return n && !n.left && !n.right; }\n  function removeLeaves(n, leaves) {\n    if (!n) return null;\n    if (isLeaf(n)) {\n      leaves.push(n.val);\n      return null;\n    }\n    n.left = removeLeaves(n.left, leaves);\n    n.right = removeLeaves(n.right, leaves);\n    return n;\n  }\n  let cur = tree;\n  while (cur) {\n    const leaves = [];\n    cur = removeLeaves(cur, leaves);\n    res.push(leaves);\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N * H)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Physically mutating and repeatedly traversing the tree O(N * H) instead of grouping by bottom-up height in O(N)"],
      hints: [
        "A leaf node has height 0 (distance to bottom).",
        "The height of any node is max(height(left), height(right)) + 1.",
        "Group nodes into `res[height]` using post-order DFS."
      ],
      oracleFn: (root: (number | null)[]) => {
        const tree = buildTree(root);
        if (!tree) return [];
        const res: number[][] = [];
        function getH(n: TreeNode | null): number {
          if (!n) return -1;
          const h = Math.max(getH(n.left), getH(n.right)) + 1;
          if (!res[h]) res[h] = [];
          res[h].push(n.val);
          return h;
        }
        getH(tree);
        return res;
      },
      testCases: {
        functional: [
          [[1, 2, 3, 4, 5]],
          [[1]],
          [[1, 2, 3]],
          [[1, 2, null, 3]]
        ],
        boundary: [
          [[1, 2]],
          [[1, null, 2]],
          [[1, 2, null, 3, null, 4]]
        ],
        adversarial: [
          [[1, 2, 3, 4, 5, 6, 7]],
          [[5, 3, 8, 2, 4, 7, 9]]
        ],
        stress: [
          [Array.from({ length: 31 }, (_, i) => i + 1)],
          [Array.from({ length: 63 }, (_, i) => i + 1)]
        ]
      }
    })
  ];

  return {
    level: 11,
    levelTitle: "Level 11 — Trees: Advanced",
    topic: "Zigzag Traversal, Next Pointers, Serialization, Path Sums, and BST Transformations",
    problems
  };
}
