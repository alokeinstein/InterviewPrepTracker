import { LevelPayload, GeneratedProblem } from './types';
import { createProblem } from './problemBuilder';

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

function buildTree(arr: (number | null)[]): TreeNode | null {
  if (!arr || arr.length === 0 || arr[0] === null) return null;
  const root: TreeNode = { val: arr[0], left: null, right: null };
  const queue: TreeNode[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const curr = queue.shift()!;
    if (i < arr.length && arr[i] !== null) {
      curr.left = { val: arr[i]!, left: null, right: null };
      queue.push(curr.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
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

export function getLevel10Payload(): LevelPayload {
  const problems: GeneratedProblem[] = [
    // 209. Binary Tree Inorder Traversal
    createProblem({
      num: 209,
      title: "Binary Tree Inorder Traversal",
      slug: "binary-tree-inorder-traversal",
      level: 10,
      difficulty: "EASY",
      topic: "Trees / DFS",
      patternSlug: "trees-foundations",
      estimatedTimeMin: 15,
      statement: "Given the `root` of a binary tree, return the inorder traversal of its nodes' values.\n\nInput and output are represented in array format (inorder values for return).",
      functionName: "inorderTraversal",
      parameters: [{ name: "root", type: "(number | null)[]", description: "Binary tree represented in level-order array" }],
      returnType: "number[]",
      constraints: ["The number of nodes in the tree is in the range [0, 100].", "-100 <= Node.val <= 100"],
      examples: [
        { input: "root = [1,null,2,3]", output: "[1,3,2]", explanation: "Inorder visit: left subtree (empty), root (1), right subtree (3 then 2)." },
        { input: "root = []", output: "[]", explanation: "Empty tree produces empty traversal." },
        { input: "root = [1]", output: "[1]", explanation: "Single node tree." },
        { input: "root = [1,2,3,4,5]", output: "[4,2,5,1,3]", explanation: "Standard left-root-right inorder traversal." }
      ],
      optimalSolution: `function inorderTraversal(root) {\n  const tree = buildTree(root);\n  const res = [];\n  function traverse(node) {\n    if (!node) return;\n    traverse(node.left);\n    res.push(node.val);\n    traverse(node.right);\n  }\n  traverse(tree);\n  return res;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(H) where H is tree height",
      suboptimalSolution: `function inorderTraversal(root) {\n  // Inefficient array copies\n  const tree = buildTree(root);\n  if (!tree) return [];\n  return [...inorderTraversal(treeToArray(tree.left)), tree.val, ...inorderTraversal(treeToArray(tree.right))];\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N^2)",
      commonMistakes: [
        "Confusing Inorder (Left, Root, Right) with Preorder (Root, Left, Right)",
        "Not handling null root correctly"
      ],
      hints: [
        "Inorder traversal visits left subtree, then the root node, then the right subtree.",
        "Can be implemented easily with recursion or an explicit stack."
      ],
      oracleFn: (root: (number | null)[]) => {
        const tree = buildTree(root);
        const res: number[] = [];
        const dfs = (node: TreeNode | null) => {
          if (!node) return;
          dfs(node.left);
          res.push(node.val);
          dfs(node.right);
        };
        dfs(tree);
        return res;
      },
      testCases: {
        functional: [
          [[1, null, 2, 3]],
          [[]],
          [[1]],
          [[1, 2, 3, 4, 5]]
        ],
        boundary: [
          [[1, 2]],
          [[1, null, 2]],
          [[1, 2, null, 3]]
        ],
        adversarial: [
          [[1, 2, 3, 4, null, null, 5]],
          [[3, 1, 4, null, 2]],
          [[1, 2, 3, 4, 5, 6, 7]]
        ],
        stress: [
          [Array.from({ length: 100 }, (_, i) => i + 1)],
          [Array.from({ length: 63 }, (_, i) => (i % 2 === 0 ? i : null))]
        ]
      }
    }),

    // 210. Binary Tree Preorder Traversal
    createProblem({
      num: 210,
      title: "Binary Tree Preorder Traversal",
      slug: "binary-tree-preorder-traversal",
      level: 10,
      difficulty: "EASY",
      topic: "Trees / DFS",
      patternSlug: "trees-foundations",
      estimatedTimeMin: 15,
      statement: "Given the `root` of a binary tree, return the preorder traversal of its nodes' values.",
      functionName: "preorderTraversal",
      parameters: [{ name: "root", type: "(number | null)[]", description: "Binary tree in level-order array format" }],
      returnType: "number[]",
      constraints: ["The number of nodes in the tree is in the range [0, 100].", "-100 <= Node.val <= 100"],
      examples: [
        { input: "root = [1,null,2,3]", output: "[1,2,3]", explanation: "Preorder visit: root (1), right (2), then (3)." },
        { input: "root = []", output: "[]", explanation: "Empty tree produces empty list." },
        { input: "root = [1]", output: "[1]", explanation: "Single node tree." },
        { input: "root = [1,2,3,4,5]", output: "[1,2,4,5,3]", explanation: "Preorder visits root before subtrees." }
      ],
      optimalSolution: `function preorderTraversal(root) {\n  const tree = buildTree(root);\n  const res = [];\n  function dfs(node) {\n    if (!node) return;\n    res.push(node.val);\n    dfs(node.left);\n    dfs(node.right);\n  }\n  dfs(tree);\n  return res;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(H)",
      suboptimalSolution: `function preorderTraversal(root) {\n  const tree = buildTree(root);\n  if (!tree) return [];\n  return [tree.val].concat(preorderTraversal(treeToArray(tree.left))).concat(preorderTraversal(treeToArray(tree.right)));\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N^2)",
      commonMistakes: ["Pushing node value after visiting left child", "Reversing left and right child traversal order in stack simulation"],
      hints: ["Preorder visits Root, then Left subtree, then Right subtree."],
      oracleFn: (root: (number | null)[]) => {
        const tree = buildTree(root);
        const res: number[] = [];
        const dfs = (node: TreeNode | null) => {
          if (!node) return;
          res.push(node.val);
          dfs(node.left);
          dfs(node.right);
        };
        dfs(tree);
        return res;
      },
      testCases: {
        functional: [
          [[1, null, 2, 3]],
          [[]],
          [[1]],
          [[1, 2, 3, 4, 5]]
        ],
        boundary: [
          [[1, 2]],
          [[1, null, 2]],
          [[1, null, 2, null, 3]]
        ],
        adversarial: [
          [[1, 4, 3, 2]],
          [[1, 2, 3, null, 4, null, 5]],
          [[5, 4, 8, 11, null, 13, 4]]
        ],
        stress: [
          [Array.from({ length: 100 }, (_, i) => i + 1)],
          [Array.from({ length: 60 }, (_, i) => i)]
        ]
      }
    }),

    // 211. Binary Tree Postorder Traversal
    createProblem({
      num: 211,
      title: "Binary Tree Postorder Traversal",
      slug: "binary-tree-postorder-traversal",
      level: 10,
      difficulty: "EASY",
      topic: "Trees / DFS",
      patternSlug: "trees-foundations",
      estimatedTimeMin: 15,
      statement: "Given the `root` of a binary tree, return the postorder traversal of its nodes' values.",
      functionName: "postorderTraversal",
      parameters: [{ name: "root", type: "(number | null)[]", description: "Binary tree in level-order format" }],
      returnType: "number[]",
      constraints: ["The number of the nodes in the tree is in the range [0, 100].", "-100 <= Node.val <= 100"],
      examples: [
        { input: "root = [1,null,2,3]", output: "[3,2,1]", explanation: "Postorder visits left, right, then root." },
        { input: "root = []", output: "[]", explanation: "Empty tree." },
        { input: "root = [1]", output: "[1]", explanation: "Single node." },
        { input: "root = [1,2,3,4,5]", output: "[4,5,2,3,1]", explanation: "Leaves 4 and 5 visited before 2, subtrees before root 1." }
      ],
      optimalSolution: `function postorderTraversal(root) {\n  const tree = buildTree(root);\n  const res = [];\n  function dfs(node) {\n    if (!node) return;\n    dfs(node.left);\n    dfs(node.right);\n    res.push(node.val);\n  }\n  dfs(tree);\n  return res;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(H)",
      suboptimalSolution: `function postorderTraversal(root) {\n  const tree = buildTree(root);\n  if (!tree) return [];\n  return postorderTraversal(treeToArray(tree.left)).concat(postorderTraversal(treeToArray(tree.right))).concat([tree.val]);\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N^2)",
      commonMistakes: ["Visiting root before children", "Not handling empty array input"],
      hints: ["Postorder traversal visits Left subtree, Right subtree, and then Root."],
      oracleFn: (root: (number | null)[]) => {
        const tree = buildTree(root);
        const res: number[] = [];
        const dfs = (node: TreeNode | null) => {
          if (!node) return;
          dfs(node.left);
          dfs(node.right);
          res.push(node.val);
        };
        dfs(tree);
        return res;
      },
      testCases: {
        functional: [
          [[1, null, 2, 3]],
          [[]],
          [[1]],
          [[1, 2, 3, 4, 5]]
        ],
        boundary: [
          [[1, 2]],
          [[1, null, 2]],
          [[1, 2, null, 3]]
        ],
        adversarial: [
          [[1, 2, 3, null, null, 4, 5]],
          [[1, null, 2, null, 3, null, 4]],
          [[4, 2, 6, 1, 3, 5, 7]]
        ],
        stress: [
          [Array.from({ length: 100 }, (_, i) => i + 1)],
          [Array.from({ length: 63 }, (_, i) => 100 - i)]
        ]
      }
    }),

    // 212. Binary Tree Level Order Traversal
    createProblem({
      num: 212,
      title: "Binary Tree Level Order Traversal",
      slug: "binary-tree-level-order-traversal",
      level: 10,
      difficulty: "MEDIUM",
      topic: "Trees / BFS",
      patternSlug: "trees-foundations",
      estimatedTimeMin: 20,
      statement: "Given the `root` of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
      functionName: "levelOrder",
      parameters: [{ name: "root", type: "(number | null)[]", description: "Binary tree level-order array" }],
      returnType: "number[][]",
      constraints: ["The number of nodes in the tree is in the range [0, 2000].", "-1000 <= Node.val <= 1000"],
      examples: [
        {
          input: "root = [3,9,20,null,null,15,7]",
          output: "[[3],[9,20],[15,7]]",
          explanation: "Level 0: [3]. Level 1: [9, 20]. Level 2: [15, 7]."
        },
        { input: "root = [1]", output: "[[1]]", explanation: "Single node level." },
        { input: "root = []", output: "[]", explanation: "Empty tree." },
        { input: "root = [1,2,3,4,5,6,7]", output: "[[1],[2,3],[4,5,6,7]]", explanation: "Complete binary tree with 3 levels." }
      ],
      optimalSolution: `function levelOrder(root) {\n  const tree = buildTree(root);\n  if (!tree) return [];\n  const res = [];\n  const queue = [tree];\n  while (queue.length > 0) {\n    const levelSize = queue.length;\n    const currentLevel = [];\n    for (let i = 0; i < levelSize; i++) {\n      const node = queue.shift();\n      currentLevel.push(node.val);\n      if (node.left) queue.push(node.left);\n      if (node.right) queue.push(node.right);\n    }\n    res.push(currentLevel);\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function levelOrder(root) {\n  const tree = buildTree(root);\n  if (!tree) return [];\n  const res = [];\n  function dfs(node, depth) {\n    if (!node) return;\n    if (res.length <= depth) res.push([]);\n    res[depth].push(node.val);\n    dfs(node.left, depth + 1);\n    dfs(node.right, depth + 1);\n  }\n  dfs(tree, 0);\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(H)",
      commonMistakes: [
        "Not snapshotting queue.length before the inner loop, causing dynamic loop boundaries",
        "Returning empty array inside array `[[]]` instead of `[]` for empty tree"
      ],
      hints: [
        "Use a FIFO queue for Breadth-First Search (BFS).",
        "At the start of each level, record `const size = queue.length` to process exactly one level per iteration."
      ],
      oracleFn: (root: (number | null)[]) => {
        const tree = buildTree(root);
        if (!tree) return [];
        const res: number[][] = [];
        const queue: TreeNode[] = [tree];
        while (queue.length > 0) {
          const levelSize = queue.length;
          const currentLevel: number[] = [];
          for (let i = 0; i < levelSize; i++) {
            const node = queue.shift()!;
            currentLevel.push(node.val);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
          }
          res.push(currentLevel);
        }
        return res;
      },
      testCases: {
        functional: [
          [[3, 9, 20, null, null, 15, 7]],
          [[1]],
          [[]],
          [[1, 2, 3, 4, 5, 6, 7]]
        ],
        boundary: [
          [[1, 2]],
          [[1, null, 2]],
          [[1, 2, null, 3, null, 4]]
        ],
        adversarial: [
          [[1, null, 2, null, 3, null, 4, null, 5]],
          [[1, 2, 3, 4, null, null, 5, 6]],
          [[1, 2, 3, null, 4, null, null, 5]]
        ],
        stress: [
          [Array.from({ length: 255 }, (_, i) => i + 1)],
          [Array.from({ length: 127 }, (_, i) => (i % 3 === 0 ? null : i))]
        ]
      }
    }),

    // 213. Binary Tree Right Side View
    createProblem({
      num: 213,
      title: "Binary Tree Right Side View",
      slug: "binary-tree-right-side-view",
      level: 10,
      difficulty: "MEDIUM",
      topic: "Trees / BFS / DFS",
      patternSlug: "trees-foundations",
      estimatedTimeMin: 20,
      statement: "Given the `root` of a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.",
      functionName: "rightSideView",
      parameters: [{ name: "root", type: "(number | null)[]", description: "Binary tree level-order array" }],
      returnType: "number[]",
      constraints: ["The number of nodes in the tree is in the range [0, 100].", "-100 <= Node.val <= 100"],
      examples: [
        { input: "root = [1,2,3,null,5,null,4]", output: "[1,3,4]", explanation: "Looking from right side: 1 on top, 3 in middle, 4 at bottom." },
        { input: "root = [1,null,3]", output: "[1,3]", explanation: "Only right spine visible." },
        { input: "root = []", output: "[]", explanation: "Empty tree." },
        { input: "root = [1,2,3,4]", output: "[1,3,4]", explanation: "Node 4 on the left subtree is visible because right subtree does not extend to depth 3." }
      ],
      optimalSolution: `function rightSideView(root) {\n  const tree = buildTree(root);\n  if (!tree) return [];\n  const res = [];\n  const queue = [tree];\n  while (queue.length > 0) {\n    const size = queue.length;\n    for (let i = 0; i < size; i++) {\n      const node = queue.shift();\n      if (i === size - 1) res.push(node.val);\n      if (node.left) queue.push(node.left);\n      if (node.right) queue.push(node.right);\n    }\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(D) where D is tree diameter",
      suboptimalSolution: `function rightSideView(root) {\n  // DFS reverse preorder\n  const tree = buildTree(root);\n  const res = [];\n  function dfs(node, depth) {\n    if (!node) return;\n    if (depth === res.length) res.push(node.val);\n    dfs(node.right, depth + 1);\n    dfs(node.left, depth + 1);\n  }\n  dfs(tree, 0);\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(H)",
      commonMistakes: [
        "Only traversing right children: if left subtree is deeper than right subtree, left nodes will be visible from the right",
        "Returning the rightmost element in the array representation instead of the tree level"
      ],
      hints: [
        "Traverse level by level using BFS; the last node processed in each level is visible from the right side.",
        "Alternatively, DFS visiting right child before left child; add to result when `depth === res.length`."
      ],
      oracleFn: (root: (number | null)[]) => {
        const tree = buildTree(root);
        if (!tree) return [];
        const res: number[] = [];
        const queue: TreeNode[] = [tree];
        while (queue.length > 0) {
          const size = queue.length;
          for (let i = 0; i < size; i++) {
            const node = queue.shift()!;
            if (i === size - 1) res.push(node.val);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [[1, 2, 3, null, 5, null, 4]],
          [[1, null, 3]],
          [[]],
          [[1, 2, 3, 4]]
        ],
        boundary: [
          [[1]],
          [[1, 2]],
          [[1, null, 2]]
        ],
        adversarial: [
          [[1, 2, 3, 4, null, null, null, 5]],
          [[1, 2, null, 3, null, 4]],
          [[1, 2, 3, null, 4, null, null, 5]]
        ],
        stress: [
          [Array.from({ length: 63 }, (_, i) => i + 1)],
          [Array.from({ length: 50 }, (_, i) => i % 2 === 0 ? i : null)]
        ]
      }
    }),

    // 214. Maximum Depth of Binary Tree
    createProblem({
      num: 214,
      title: "Maximum Depth of Binary Tree",
      slug: "maximum-depth-of-binary-tree",
      level: 10,
      difficulty: "EASY",
      topic: "Trees / DFS",
      patternSlug: "trees-foundations",
      estimatedTimeMin: 15,
      statement: "Given the `root` of a binary tree, return its maximum depth.\n\nA binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
      functionName: "maxDepth",
      parameters: [{ name: "root", type: "(number | null)[]", description: "Binary tree level-order array" }],
      returnType: "number",
      constraints: ["The number of nodes in the tree is in the range [0, 10^4].", "-100 <= Node.val <= 100"],
      examples: [
        { input: "root = [3,9,20,null,null,15,7]", output: "3", explanation: "Longest path is 3 -> 20 -> 15 (depth 3)." },
        { input: "root = [1,null,2]", output: "2", explanation: "Depth is 2." },
        { input: "root = []", output: "0", explanation: "Empty tree depth is 0." },
        { input: "root = [0]", output: "1", explanation: "Single root has depth 1." }
      ],
      optimalSolution: `function maxDepth(root) {\n  const tree = buildTree(root);\n  function dfs(node) {\n    if (!node) return 0;\n    return 1 + Math.max(dfs(node.left), dfs(node.right));\n  }\n  return dfs(tree);\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(H)",
      suboptimalSolution: `function maxDepth(root) {\n  const tree = buildTree(root);\n  if (!tree) return 0;\n  const q = [tree];\n  let depth = 0;\n  while (q.length > 0) {\n    depth++;\n    const len = q.length;\n    for (let i = 0; i < len; i++) {\n      const n = q.shift();\n      if (n.left) q.push(n.left);\n      if (n.right) q.push(n.right);\n    }\n  }\n  return depth;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(W) where W is max width",
      commonMistakes: ["Returning 1 instead of 0 for empty tree", "Counting edges instead of nodes"],
      hints: ["The maximum depth of a node is 1 + max(depth(left), depth(right)).", "Base case: depth of null is 0."],
      oracleFn: (root: (number | null)[]) => {
        const tree = buildTree(root);
        const dfs = (node: TreeNode | null): number => {
          if (!node) return 0;
          return 1 + Math.max(dfs(node.left), dfs(node.right));
        };
        return dfs(tree);
      },
      testCases: {
        functional: [
          [[3, 9, 20, null, null, 15, 7]],
          [[1, null, 2]],
          [[]],
          [[0]]
        ],
        boundary: [
          [[1]],
          [[1, 2]],
          [[1, 2, 3, 4, 5]]
        ],
        adversarial: [
          [[1, null, 2, null, 3, null, 4, null, 5]],
          [[1, 2, null, 3, null, 4, null, 5]],
          [[1, 2, 3, null, null, null, 4]]
        ],
        stress: [
          [Array.from({ length: 127 }, (_, i) => i + 1)],
          [Array.from({ length: 255 }, () => 1)]
        ]
      }
    }),

    // 215. Minimum Depth of Binary Tree
    createProblem({
      num: 215,
      title: "Minimum Depth of Binary Tree",
      slug: "minimum-depth-of-binary-tree",
      level: 10,
      difficulty: "EASY",
      topic: "Trees / BFS / DFS",
      patternSlug: "trees-foundations",
      estimatedTimeMin: 15,
      statement: "Given a binary tree, find its minimum depth.\n\nThe minimum depth is the number of nodes along the shortest path from the root node down to the nearest leaf node.\n\nNote: A leaf is a node with no children.",
      functionName: "minDepth",
      parameters: [{ name: "root", type: "(number | null)[]", description: "Binary tree level-order array" }],
      returnType: "number",
      constraints: ["The number of nodes in the tree is in the range [0, 10^5].", "-1000 <= Node.val <= 1000"],
      examples: [
        { input: "root = [3,9,20,null,null,15,7]", output: "2", explanation: "Shortest path to leaf 9 has length 2." },
        { input: "root = [2,null,3,null,4,null,5,null,6]", output: "5", explanation: "Only one branch, leaf is 6 at depth 5." },
        { input: "root = []", output: "0", explanation: "Empty tree." },
        { input: "root = [1,2]", output: "2", explanation: "Node 1 has right null, but 1 is not a leaf; leaf is 2 at depth 2." }
      ],
      optimalSolution: `function minDepth(root) {\n  const tree = buildTree(root);\n  if (!tree) return 0;\n  // BFS finds the nearest leaf earliest\n  const q = [{ node: tree, depth: 1 }];\n  while (q.length > 0) {\n    const { node, depth } = q.shift();\n    if (!node.left && !node.right) return depth;\n    if (node.left) q.push({ node: node.left, depth: depth + 1 });\n    if (node.right) q.push({ node: node.right, depth: depth + 1 });\n  }\n  return 0;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function minDepth(root) {\n  const tree = buildTree(root);\n  function dfs(node) {\n    if (!node) return 0;\n    if (!node.left) return 1 + dfs(node.right);\n    if (!node.right) return 1 + dfs(node.left);\n    return 1 + Math.min(dfs(node.left), dfs(node.right));\n  }\n  return dfs(tree);\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(H)",
      commonMistakes: [
        "Doing `1 + min(dfs(left), dfs(right))` directly: if one child is null, it returns 1, but a node with one child is NOT a leaf!",
        "Confusing BFS level termination condition"
      ],
      hints: [
        "A leaf node must have both `left == null` and `right == null`.",
        "BFS guarantees you find the shortest path to a leaf on the very first leaf encountered."
      ],
      oracleFn: (root: (number | null)[]) => {
        const tree = buildTree(root);
        if (!tree) return 0;
        const q: { node: TreeNode; depth: number }[] = [{ node: tree, depth: 1 }];
        while (q.length > 0) {
          const { node, depth } = q.shift()!;
          if (!node.left && !node.right) return depth;
          if (node.left) q.push({ node: node.left, depth: depth + 1 });
          if (node.right) q.push({ node: node.right, depth: depth + 1 });
        }
        return 0;
      },
      testCases: {
        functional: [
          [[3, 9, 20, null, null, 15, 7]],
          [[2, null, 3, null, 4, null, 5, null, 6]],
          [[]],
          [[1, 2]]
        ],
        boundary: [
          [[1]],
          [[1, null, 2]],
          [[1, 2, 3]]
        ],
        adversarial: [
          [[1, 2, 3, 4, null, null, 5]],
          [[1, null, 2, null, 3, null, 4]],
          [[1, 2, null, 3, null, 4, null]]
        ],
        stress: [
          [Array.from({ length: 127 }, (_, i) => i + 1)],
          [Array.from({ length: 60 }, (_, i) => (i % 2 === 0 ? i : null))]
        ]
      }
    }),

    // 216. Invert Binary Tree
    createProblem({
      num: 216,
      title: "Invert Binary Tree",
      slug: "invert-binary-tree",
      level: 10,
      difficulty: "EASY",
      topic: "Trees / DFS",
      patternSlug: "trees-foundations",
      estimatedTimeMin: 15,
      statement: "Given the `root` of a binary tree, invert the tree, and return its root.\n\nInput and output are given as level-order arrays.",
      functionName: "invertTree",
      parameters: [{ name: "root", type: "(number | null)[]", description: "Binary tree level-order array" }],
      returnType: "(number | null)[]",
      constraints: ["The number of nodes in the tree is in the range [0, 100].", "-100 <= Node.val <= 100"],
      examples: [
        {
          input: "root = [4,2,7,1,3,6,9]",
          output: "[4,7,2,9,6,3,1]",
          explanation: "Every left and right subtree swapped at each level."
        },
        { input: "root = [2,1,3]", output: "[2,3,1]", explanation: "1 and 3 swapped." },
        { input: "root = []", output: "[]", explanation: "Empty tree remains empty." },
        { input: "root = [1]", output: "[1]", explanation: "Single node unchanged." }
      ],
      optimalSolution: `function invertTree(root) {\n  const tree = buildTree(root);\n  function dfs(node) {\n    if (!node) return null;\n    const temp = node.left;\n    node.left = dfs(node.right);\n    node.right = dfs(temp);\n    return node;\n  }\n  return treeToArray(dfs(tree));\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(H)",
      suboptimalSolution: `function invertTree(root) {\n  // BFS queue node swap\n  const tree = buildTree(root);\n  if (!tree) return [];\n  const q = [tree];\n  while (q.length > 0) {\n    const cur = q.shift();\n    const tmp = cur.left;\n    cur.left = cur.right;\n    cur.right = tmp;\n    if (cur.left) q.push(cur.left);\n    if (cur.right) q.push(cur.right);\n  }\n  return treeToArray(tree);\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(W)",
      commonMistakes: ["Overwriting `node.left` before passing its original value to `invert(node.right)`", "Returning null instead of [] for empty input"],
      hints: ["For every node, recursively invert its left child and right child, then swap them."],
      oracleFn: (root: (number | null)[]) => {
        const tree = buildTree(root);
        const dfs = (node: TreeNode | null): TreeNode | null => {
          if (!node) return null;
          const temp = node.left;
          node.left = dfs(node.right);
          node.right = dfs(temp);
          return node;
        };
        return treeToArray(dfs(tree));
      },
      testCases: {
        functional: [
          [[4, 2, 7, 1, 3, 6, 9]],
          [[2, 1, 3]],
          [[]],
          [[1]]
        ],
        boundary: [
          [[1, 2]],
          [[1, null, 2]],
          [[1, 2, null, 3]]
        ],
        adversarial: [
          [[1, null, 2, null, 3]],
          [[5, 3, 8, 1, 4, 7, 9]],
          [[1, 2, 3, 4, 5]]
        ],
        stress: [
          [Array.from({ length: 63 }, (_, i) => i + 1)],
          [Array.from({ length: 63 }, (_, i) => 63 - i)]
        ]
      }
    }),

    // 217. Same Tree
    createProblem({
      num: 217,
      title: "Same Tree",
      slug: "same-tree",
      level: 10,
      difficulty: "EASY",
      topic: "Trees / DFS",
      patternSlug: "trees-foundations",
      estimatedTimeMin: 15,
      statement: "Given the roots of two binary trees `p` and `q`, write a function to check if they are the same or not.\n\nTwo binary trees are considered the same if they are structurally identical, and the nodes have the same value.",
      functionName: "isSameTree",
      parameters: [
        { name: "p", type: "(number | null)[]", description: "First tree level-order array" },
        { name: "q", type: "(number | null)[]", description: "Second tree level-order array" }
      ],
      returnType: "boolean",
      constraints: ["The number of nodes in both trees is in the range [0, 100].", "-10^4 <= Node.val <= 10^4"],
      examples: [
        { input: "p = [1,2,3], q = [1,2,3]", output: "true", explanation: "Structurally identical with identical node values." },
        { input: "p = [1,2], q = [1,null,2]", output: "false", explanation: "Different structure: left child vs right child." },
        { input: "p = [1,2,1], q = [1,1,2]", output: "false", explanation: "Values differ." },
        { input: "p = [], q = []", output: "true", explanation: "Two empty trees are identical." }
      ],
      optimalSolution: `function isSameTree(p, q) {\n  const t1 = buildTree(p), t2 = buildTree(q);\n  function dfs(n1, n2) {\n    if (!n1 && !n2) return true;\n    if (!n1 || !n2 || n1.val !== n2.val) return false;\n    return dfs(n1.left, n2.left) && dfs(n1.right, n2.right);\n  }\n  return dfs(t1, t2);\n}`,
      optimalTimeComplexity: "O(min(N, M))",
      optimalSpaceComplexity: "O(min(H1, H2))",
      suboptimalSolution: `function isSameTree(p, q) {\n  return JSON.stringify(p) === JSON.stringify(q);\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Comparing array serialization which might differ in trailing null representations", "Not checking both null condition first"],
      hints: ["If both nodes are null, return true.", "If only one is null or values differ, return false.", "Recursively check left and right subtrees."],
      oracleFn: (p: (number | null)[], q: (number | null)[]) => {
        const t1 = buildTree(p);
        const t2 = buildTree(q);
        const dfs = (n1: TreeNode | null, n2: TreeNode | null): boolean => {
          if (!n1 && !n2) return true;
          if (!n1 || !n2 || n1.val !== n2.val) return false;
          return dfs(n1.left, n2.left) && dfs(n1.right, n2.right);
        };
        return dfs(t1, t2);
      },
      testCases: {
        functional: [
          [[1, 2, 3], [1, 2, 3]],
          [[1, 2], [1, null, 2]],
          [[1, 2, 1], [1, 1, 2]],
          [[], []]
        ],
        boundary: [
          [[1], []],
          [[1], [1]],
          [[1], [2]]
        ],
        adversarial: [
          [[1, 2, null, 3], [1, 2, null, 3]],
          [[1, 2, 3, 4], [1, 2, 3, null, 4]],
          [[10, 5, 15], [10, 5, null, null, 15]]
        ],
        stress: [
          [Array.from({ length: 63 }, (_, i) => i), Array.from({ length: 63 }, (_, i) => i)],
          [Array.from({ length: 63 }, (_, i) => i), Array.from({ length: 63 }, (_, i) => i + 1)]
        ]
      }
    }),

    // 218. Symmetric Tree
    createProblem({
      num: 218,
      title: "Symmetric Tree",
      slug: "symmetric-tree",
      level: 10,
      difficulty: "EASY",
      topic: "Trees / DFS",
      patternSlug: "trees-foundations",
      estimatedTimeMin: 15,
      statement: "Given the `root` of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).",
      functionName: "isSymmetric",
      parameters: [{ name: "root", type: "(number | null)[]", description: "Binary tree level-order array" }],
      returnType: "boolean",
      constraints: ["The number of nodes in the tree is in the range [1, 1000].", "-100 <= Node.val <= 100"],
      examples: [
        { input: "root = [1,2,2,3,4,4,3]", output: "true", explanation: "Mirror symmetric around root 1." },
        { input: "root = [1,2,2,null,3,null,3]", output: "false", explanation: "3 appears on outer left and outer right instead of mirrored." },
        { input: "root = [1]", output: "true", explanation: "Single node tree is symmetric." },
        { input: "root = [1,2,2,2,null,2]", output: "false", explanation: "Structure is asymmetric." }
      ],
      optimalSolution: `function isSymmetric(root) {\n  const tree = buildTree(root);\n  if (!tree) return true;\n  function isMirror(t1, t2) {\n    if (!t1 && !t2) return true;\n    if (!t1 || !t2 || t1.val !== t2.val) return false;\n    return isMirror(t1.left, t2.right) && isMirror(t1.right, t2.left);\n  }\n  return isMirror(tree.left, tree.right);\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(H)",
      suboptimalSolution: `function isSymmetric(root) {\n  // BFS level-by-level palindrome checking\n  const tree = buildTree(root);\n  if (!tree) return true;\n  const q = [tree.left, tree.right];\n  while (q.length > 0) {\n    const t1 = q.shift();\n    const t2 = q.shift();\n    if (!t1 && !t2) continue;\n    if (!t1 || !t2 || t1.val !== t2.val) return false;\n    q.push(t1.left, t2.right);\n    q.push(t1.right, t2.left);\n  }\n  return true;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Comparing `t1.left` with `t2.left` instead of `t2.right` (symmetry requires mirror reflection)", "Not comparing values when both nodes are non-null"],
      hints: ["Two trees are mirrors if their roots have the same value, and right subtree of each is mirror of left subtree of the other."],
      oracleFn: (root: (number | null)[]) => {
        const tree = buildTree(root);
        if (!tree) return true;
        const isMirror = (t1: TreeNode | null, t2: TreeNode | null): boolean => {
          if (!t1 && !t2) return true;
          if (!t1 || !t2 || t1.val !== t2.val) return false;
          return isMirror(t1.left, t2.right) && isMirror(t1.right, t2.left);
        };
        return isMirror(tree.left, tree.right);
      },
      testCases: {
        functional: [
          [[1, 2, 2, 3, 4, 4, 3]],
          [[1, 2, 2, null, 3, null, 3]],
          [[1]],
          [[1, 2, 2, 2, null, 2]]
        ],
        boundary: [
          [[1, 2, 2]],
          [[1, 2, 3]],
          [[1, 2, 2, null, null, null, null]]
        ],
        adversarial: [
          [[2, 3, 3, 4, 5, 5, 4, null, null, 8, 9, 9, 8]],
          [[1, 2, 2, null, 3, 3, null]],
          [[1, 2, 3, 3, null, 2, null]]
        ],
        stress: [
          [[1, ...Array.from({ length: 62 }, () => 2)]],
          [[1, ...Array.from({ length: 62 }, (_, i) => i)]]
        ]
      }
    }),

    // 219. Path Sum
    createProblem({
      num: 219,
      title: "Path Sum",
      slug: "path-sum",
      level: 10,
      difficulty: "EASY",
      topic: "Trees / DFS",
      patternSlug: "trees-foundations",
      estimatedTimeMin: 15,
      statement: "Given the `root` of a binary tree and an integer `targetSum`, return `true` if the tree has a root-to-leaf path such that adding up all the values along the path equals `targetSum`.\n\nA leaf is a node with no children.",
      functionName: "hasPathSum",
      parameters: [
        { name: "root", type: "(number | null)[]", description: "Binary tree level-order array" },
        { name: "targetSum", type: "number", description: "Target root-to-leaf sum" }
      ],
      returnType: "boolean",
      constraints: ["The number of nodes in the tree is in the range [0, 5000].", "-1000 <= Node.val <= 1000", "-1000 <= targetSum <= 1000"],
      examples: [
        {
          input: "root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22",
          output: "true",
          explanation: "5 -> 4 -> 11 -> 2 equals 22."
        },
        { input: "root = [1,2,3], targetSum = 5", output: "false", explanation: "Paths are 1->2 (sum 3) and 1->3 (sum 4)." },
        { input: "root = [], targetSum = 0", output: "false", explanation: "Empty tree has no paths." },
        { input: "root = [1,2], targetSum = 1", output: "false", explanation: "1 is not a leaf, so path must continue to 2." }
      ],
      optimalSolution: `function hasPathSum(root, targetSum) {\n  const tree = buildTree(root);\n  function dfs(node, sum) {\n    if (!node) return false;\n    if (!node.left && !node.right) return sum === node.val;\n    return dfs(node.left, sum - node.val) || dfs(node.right, sum - node.val);\n  }\n  return dfs(tree, targetSum);\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(H)",
      suboptimalSolution: `function hasPathSum(root, targetSum) {\n  // BFS with path sum tracking\n  const tree = buildTree(root);\n  if (!tree) return false;\n  const q = [{ node: tree, cur: tree.val }];\n  while (q.length > 0) {\n    const { node, cur } = q.shift();\n    if (!node.left && !node.right && cur === targetSum) return true;\n    if (node.left) q.push({ node: node.left, cur: cur + node.left.val });\n    if (node.right) q.push({ node: node.right, cur: cur + node.right.val });\n  }\n  return false;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Returning true when sum reaches target at a non-leaf node",
        "Returning true for empty tree when targetSum === 0"
      ],
      hints: [
        "A valid path must terminate at a leaf (`node.left == null && node.right == null`).",
        "Subtract `node.val` from `targetSum` as you descend the tree."
      ],
      oracleFn: (root: (number | null)[], targetSum: number) => {
        const tree = buildTree(root);
        const dfs = (node: TreeNode | null, sum: number): boolean => {
          if (!node) return false;
          if (!node.left && !node.right) return sum === node.val;
          return dfs(node.left, sum - node.val) || dfs(node.right, sum - node.val);
        };
        return dfs(tree, targetSum);
      },
      testCases: {
        functional: [
          [[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1], 22],
          [[1, 2, 3], 5],
          [[], 0],
          [[1, 2], 1]
        ],
        boundary: [
          [[1], 1],
          [[1], 0],
          [[-2, null, -3], -5]
        ],
        adversarial: [
          [[1, 2, null, 3, null, 4, null, 5], 15],
          [[1, -2, -3, 1, 3, -2, null, -1], -1],
          [[1, 2], 3]
        ],
        stress: [
          [Array.from({ length: 63 }, () => 1), 6],
          [Array.from({ length: 63 }, (_, i) => i + 1), 100]
        ]
      }
    }),

    // 220. Path Sum II
    createProblem({
      num: 220,
      title: "Path Sum II",
      slug: "path-sum-ii",
      level: 10,
      difficulty: "MEDIUM",
      topic: "Trees / DFS / Backtracking",
      patternSlug: "trees-foundations",
      estimatedTimeMin: 25,
      statement: "Given the `root` of a binary tree and an integer `targetSum`, return all root-to-leaf paths where the sum of the node values in the path equals `targetSum`.\n\nEach path should be returned as a list of the node values, not node references.",
      functionName: "pathSum",
      parameters: [
        { name: "root", type: "(number | null)[]", description: "Binary tree level-order array" },
        { name: "targetSum", type: "number", description: "Target root-to-leaf sum" }
      ],
      returnType: "number[][]",
      constraints: ["The number of nodes in the tree is in the range [0, 5000].", "-1000 <= Node.val <= 1000", "-1000 <= targetSum <= 1000"],
      examples: [
        {
          input: "root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22",
          output: "[[5,4,11,2],[5,8,4,5]]",
          explanation: "Two paths sum to 22: [5,4,11,2] and [5,8,4,5]."
        },
        { input: "root = [1,2,3], targetSum = 5", output: "[]", explanation: "No path sums to 5." },
        { input: "root = [1,2], targetSum = 0", output: "[]", explanation: "No path sums to 0." },
        { input: "root = [1], targetSum = 1", output: "[[1]]", explanation: "Root is a leaf and matches target." }
      ],
      optimalSolution: `function pathSum(root, targetSum) {\n  const tree = buildTree(root);\n  const res = [];\n  const currentPath = [];\n  function dfs(node, remaining) {\n    if (!node) return;\n    currentPath.push(node.val);\n    if (!node.left && !node.right && remaining === node.val) {\n      res.push([...currentPath]);\n    } else {\n      dfs(node.left, remaining - node.val);\n      dfs(node.right, remaining - node.val);\n    }\n    currentPath.pop();\n  }\n  dfs(tree, targetSum);\n  return res;\n}`,
      optimalTimeComplexity: "O(N^2) worst case",
      optimalSpaceComplexity: "O(H)",
      suboptimalSolution: `function pathSum(root, targetSum) {\n  // Copying path array at every step\n  const tree = buildTree(root);\n  const res = [];\n  function dfs(node, path, sum) {\n    if (!node) return;\n    const newPath = [...path, node.val];\n    if (!node.left && !node.right && sum + node.val === targetSum) {\n      res.push(newPath);\n      return;\n    }\n    dfs(node.left, newPath, sum + node.val);\n    dfs(node.right, newPath, sum + node.val);\n  }\n  dfs(tree, [], 0);\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N^2)",
      commonMistakes: [
        "Forgetting to backtrack `currentPath.pop()`",
        "Pushing reference `res.push(currentPath)` instead of shallow copy `res.push([...currentPath])`"
      ],
      hints: [
        "Backtracking: push current node to `path`, recurse into left/right, and pop node upon returning.",
        "Clone the path array only when a leaf satisfying `targetSum` is reached."
      ],
      oracleFn: (root: (number | null)[], targetSum: number) => {
        const tree = buildTree(root);
        const res: number[][] = [];
        const currentPath: number[] = [];
        const dfs = (node: TreeNode | null, remaining: number) => {
          if (!node) return;
          currentPath.push(node.val);
          if (!node.left && !node.right && remaining === node.val) {
            res.push([...currentPath]);
          } else {
            dfs(node.left, remaining - node.val);
            dfs(node.right, remaining - node.val);
          }
          currentPath.pop();
        };
        dfs(tree, targetSum);
        return res;
      },
      testCases: {
        functional: [
          [[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1], 22],
          [[1, 2, 3], 5],
          [[1, 2], 0],
          [[1], 1]
        ],
        boundary: [
          [[], 0],
          [[1, 2], 3],
          [[-2, null, -3], -5]
        ],
        adversarial: [
          [[0, 1, 1], 1],
          [[1, 0, 1, 1, 2, 0, -1, 0, 1, -1, 0, -1, 0, 1, 0], 2],
          [[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1], 18]
        ],
        stress: [
          [Array.from({ length: 31 }, () => 1), 5],
          [Array.from({ length: 31 }, (_, i) => i + 1), 50]
        ]
      }
    }),

    // 221. Binary Tree Paths
    createProblem({
      num: 221,
      title: "Binary Tree Paths",
      slug: "binary-tree-paths",
      level: 10,
      difficulty: "EASY",
      topic: "Trees / DFS",
      patternSlug: "trees-foundations",
      estimatedTimeMin: 15,
      statement: "Given the `root` of a binary tree, return all root-to-leaf paths in any order.\n\nA leaf is a node with no children.",
      functionName: "binaryTreePaths",
      parameters: [{ name: "root", type: "(number | null)[]", description: "Binary tree level-order array" }],
      returnType: "string[]",
      constraints: ["The number of nodes in the tree is in the range [1, 100].", "-100 <= Node.val <= 100"],
      examples: [
        { input: "root = [1,2,3,null,5]", output: '["1->2->5","1->3"]', explanation: "Two root-to-leaf paths exist." },
        { input: "root = [1]", output: '["1"]', explanation: "Single node tree." },
        { input: "root = [1,2,3,4,5]", output: '["1->2->4","1->2->5","1->3"]', explanation: "Three paths." },
        { input: "root = [1,null,2]", output: '["1->2"]', explanation: "Single linear branch." }
      ],
      optimalSolution: `function binaryTreePaths(root) {\n  const tree = buildTree(root);\n  if (!tree) return [];\n  const paths = [];\n  function dfs(node, current) {\n    if (!node.left && !node.right) {\n      paths.push(current + node.val);\n      return;\n    }\n    if (node.left) dfs(node.left, current + node.val + "->");\n    if (node.right) dfs(node.right, current + node.val + "->");\n  }\n  dfs(tree, "");\n  return paths;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(H)",
      suboptimalSolution: `function binaryTreePaths(root) {\n  // Array collection and join\n  const tree = buildTree(root);\n  if (!tree) return [];\n  const paths = [];\n  function dfs(node, path) {\n    path.push(node.val);\n    if (!node.left && !node.right) {\n      paths.push(path.join("->"));\n    } else {\n      if (node.left) dfs(node.left, [...path]);\n      if (node.right) dfs(node.right, [...path]);\n    }\n  }\n  dfs(tree, []);\n  return paths;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N^2)",
      commonMistakes: ["Appending arrow `->` after leaf nodes", "Failing to check if a child is null before recursing"],
      hints: ["Pass the accumulated string `current + node.val + '->'` to child calls.", "When at a leaf, append `node.val` and push to result."],
      oracleFn: (root: (number | null)[]) => {
        const tree = buildTree(root);
        if (!tree) return [];
        const paths: string[] = [];
        const dfs = (node: TreeNode, current: string) => {
          if (!node.left && !node.right) {
            paths.push(current + node.val);
            return;
          }
          if (node.left) dfs(node.left, current + node.val + "->");
          if (node.right) dfs(node.right, current + node.val + "->");
        };
        dfs(tree, "");
        return paths;
      },
      testCases: {
        functional: [
          [[1, 2, 3, null, 5]],
          [[1]],
          [[1, 2, 3, 4, 5]],
          [[1, null, 2]]
        ],
        boundary: [
          [[1, 2]],
          [[1, 2, 3]],
          [[0]]
        ],
        adversarial: [
          [[1, null, 2, null, 3, null, 4]],
          [[1, 2, null, 3, null, 4]],
          [[1, -2, -3]]
        ],
        stress: [
          [Array.from({ length: 31 }, (_, i) => i + 1)],
          [Array.from({ length: 31 }, () => 1)]
        ]
      }
    }),

    // 222. Sum of Left Leaves
    createProblem({
      num: 222,
      title: "Sum of Left Leaves",
      slug: "sum-of-left-leaves",
      level: 10,
      difficulty: "EASY",
      topic: "Trees / DFS",
      patternSlug: "trees-foundations",
      estimatedTimeMin: 15,
      statement: "Given the `root` of a binary tree, return the sum of all left leaves.\n\nA leaf is a node with no children. A left leaf is a leaf that is the left child of another node.",
      functionName: "sumOfLeftLeaves",
      parameters: [{ name: "root", type: "(number | null)[]", description: "Binary tree level-order array" }],
      returnType: "number",
      constraints: ["The number of nodes in the tree is in the range [1, 1000].", "-1000 <= Node.val <= 1000"],
      examples: [
        { input: "root = [3,9,20,null,null,15,7]", output: "24", explanation: "There are two left leaves in the binary tree, with values 9 and 15 respectively: 9 + 15 = 24." },
        { input: "root = [1]", output: "0", explanation: "Root is a leaf, but it is not a left leaf." },
        { input: "root = [1,2,3,4,5]", output: "4", explanation: "Node 4 is the only left leaf (5 is a right leaf, 2 is an internal node)." },
        { input: "root = [1,2,null,3]", output: "0", explanation: "3 is the right child of 2, so there are no left leaves." }
      ],
      optimalSolution: `function sumOfLeftLeaves(root) {\n  const tree = buildTree(root);\n  function dfs(node, isLeft) {\n    if (!node) return 0;\n    if (!node.left && !node.right) return isLeft ? node.val : 0;\n    return dfs(node.left, true) + dfs(node.right, false);\n  }\n  return dfs(tree, false);\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(H)",
      suboptimalSolution: `function sumOfLeftLeaves(root) {\n  const tree = buildTree(root);\n  if (!tree) return 0;\n  let sum = 0;\n  const q = [tree];\n  while (q.length > 0) {\n    const node = q.shift();\n    if (node.left) {\n      if (!node.left.left && !node.left.right) sum += node.left.val;\n      else q.push(node.left);\n    }\n    if (node.right) q.push(node.right);\n  }\n  return sum;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(W)",
      commonMistakes: ["Treating root as a left leaf", "Counting internal left nodes that have children"],
      hints: ["Pass a boolean flag `isLeft` to indicate if the current node was reached via a left edge.", "If `!node.left && !node.right && isLeft`, add `node.val`."],
      oracleFn: (root: (number | null)[]) => {
        const tree = buildTree(root);
        const dfs = (node: TreeNode | null, isLeft: boolean): number => {
          if (!node) return 0;
          if (!node.left && !node.right) return isLeft ? node.val : 0;
          return dfs(node.left, true) + dfs(node.right, false);
        };
        return dfs(tree, false);
      },
      testCases: {
        functional: [
          [[3, 9, 20, null, null, 15, 7]],
          [[1]],
          [[1, 2, 3, 4, 5]],
          [[1, 2, null, 3]]
        ],
        boundary: [
          [[1, 2]],
          [[1, null, 2]],
          [[1, 2, 3]]
        ],
        adversarial: [
          [[1, 2, 3, 4, null, 5, 6]],
          [[0, 2, 4, 1, null, 3, -1, 5, 1, null, 6, null, 8]],
          [[1, -2, -3, 4, 5, null, null]]
        ],
        stress: [
          [Array.from({ length: 63 }, (_, i) => i + 1)],
          [Array.from({ length: 63 }, () => 5)]
        ]
      }
    }),

    // 223. Count Good Nodes in Binary Tree
    createProblem({
      num: 223,
      title: "Count Good Nodes in Binary Tree",
      slug: "count-good-nodes-in-binary-tree",
      level: 10,
      difficulty: "MEDIUM",
      topic: "Trees / DFS",
      patternSlug: "trees-foundations",
      estimatedTimeMin: 20,
      statement: "Given a binary tree `root`, a node `X` in the tree is named good if in the path from the root to `X` there are no nodes with a value greater than `X`.\n\nReturn the number of good nodes in the binary tree.",
      functionName: "goodNodes",
      parameters: [{ name: "root", type: "(number | null)[]", description: "Binary tree level-order array" }],
      returnType: "number",
      constraints: ["The number of nodes in the binary tree is in the range [1, 10^5].", "Each node's value is between [-10^4, 10^4]."],
      examples: [
        {
          input: "root = [3,1,4,3,null,1,5]",
          output: "4",
          explanation: "Root Node (3) is always good. Node 4 -> (3,4) is good. Node 5 -> (3,4,5) is good. Node 3 -> (3,1,3) is good. Total 4."
        },
        { input: "root = [3,3,null,4,2]", output: "3", explanation: "Nodes 3, 3, and 4 are good." },
        { input: "root = [1]", output: "1", explanation: "Root is always a good node." },
        { input: "root = [9,null,3,6]", output: "1", explanation: "Only root 9 is good; other nodes are < 9." }
      ],
      optimalSolution: `function goodNodes(root) {\n  const tree = buildTree(root);\n  function dfs(node, maxSoFar) {\n    if (!node) return 0;\n    let count = node.val >= maxSoFar ? 1 : 0;\n    const newMax = Math.max(maxSoFar, node.val);\n    return count + dfs(node.left, newMax) + dfs(node.right, newMax);\n  }\n  return dfs(tree, -Infinity);\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(H)",
      suboptimalSolution: `function goodNodes(root) {\n  // BFS with maxSoFar tracking\n  const tree = buildTree(root);\n  if (!tree) return 0;\n  let count = 0;\n  const q = [{ node: tree, max: tree.val }];\n  while (q.length > 0) {\n    const { node, max } = q.shift();\n    if (node.val >= max) count++;\n    const nextMax = Math.max(max, node.val);\n    if (node.left) q.push({ node: node.left, max: nextMax });\n    if (node.right) q.push({ node: node.right, max: nextMax });\n  }\n  return count;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Initializing `maxSoFar` to 0 instead of `-Infinity` (failing on trees with all negative values)", "Comparing with only the immediate parent instead of the maximum along the entire path from root"],
      hints: ["Pass `maxVal` down the recursion representing the maximum value on the path from root.", "If `node.val >= maxVal`, increment count and update `maxVal = max(maxVal, node.val)`."],
      oracleFn: (root: (number | null)[]) => {
        const tree = buildTree(root);
        const dfs = (node: TreeNode | null, maxSoFar: number): number => {
          if (!node) return 0;
          let count = node.val >= maxSoFar ? 1 : 0;
          const newMax = Math.max(maxSoFar, node.val);
          return count + dfs(node.left, newMax) + dfs(node.right, newMax);
        };
        return dfs(tree, -Infinity);
      },
      testCases: {
        functional: [
          [[3, 1, 4, 3, null, 1, 5]],
          [[3, 3, null, 4, 2]],
          [[1]],
          [[9, null, 3, 6]]
        ],
        boundary: [
          [[-5, -4, -3]],
          [[-1, -2, -3]],
          [[10, 10, 10]]
        ],
        adversarial: [
          [[2, null, 4, 10, 8, null, null, 4]],
          [[1, 2, 3, 4, 5]],
          [[5, 4, 3, 2, 1]]
        ],
        stress: [
          [Array.from({ length: 63 }, (_, i) => i + 1)],
          [Array.from({ length: 63 }, (_, i) => 63 - i)]
        ]
      }
    }),

    // 224. Diameter of Binary Tree
    createProblem({
      num: 224,
      title: "Diameter of Binary Tree",
      slug: "diameter-of-binary-tree",
      level: 10,
      difficulty: "EASY",
      topic: "Trees / DFS",
      patternSlug: "trees-foundations",
      estimatedTimeMin: 20,
      statement: "Given the `root` of a binary tree, return the length of the diameter of the tree.\n\nThe diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the root.\n\nThe length of a path between two nodes is represented by the number of edges between them.",
      functionName: "diameterOfBinaryTree",
      parameters: [{ name: "root", type: "(number | null)[]", description: "Binary tree level-order array" }],
      returnType: "number",
      constraints: ["The number of nodes in the tree is in the range [1, 10^4].", "-100 <= Node.val <= 100"],
      examples: [
        { input: "root = [1,2,3,4,5]", output: "3", explanation: "3 is the length of the path [4,2,1,3] or [5,2,1,3]." },
        { input: "root = [1,2]", output: "1", explanation: "Path [2,1] has length 1." },
        { input: "root = [1]", output: "0", explanation: "Single node has diameter 0." },
        { input: "root = [1,2,3,null,null,4,5]", output: "3", explanation: "Path through right subtree." }
      ],
      optimalSolution: `function diameterOfBinaryTree(root) {\n  const tree = buildTree(root);\n  let maxDiameter = 0;\n  function maxDepth(node) {\n    if (!node) return 0;\n    const left = maxDepth(node.left);\n    const right = maxDepth(node.right);\n    maxDiameter = Math.max(maxDiameter, left + right);\n    return 1 + Math.max(left, right);\n  }\n  maxDepth(tree);\n  return maxDiameter;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(H)",
      suboptimalSolution: `function diameterOfBinaryTree(root) {\n  // Computing depth repeatedly O(N^2)\n  const tree = buildTree(root);\n  function depth(node) {\n    if (!node) return 0;\n    return 1 + Math.max(depth(node.left), depth(node.right));\n  }\n  function dfs(node) {\n    if (!node) return 0;\n    const cur = depth(node.left) + depth(node.right);\n    return Math.max(cur, dfs(node.left), dfs(node.right));\n  }\n  return dfs(tree);\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(H)",
      commonMistakes: ["Assuming the diameter path must pass through the root", "Counting nodes instead of edges (edges = nodes - 1)"],
      hints: ["At each node, the longest path passing through it is `depth(left) + depth(right)`.", "Update the global max diameter while returning `1 + max(depth(left), depth(right))`."],
      oracleFn: (root: (number | null)[]) => {
        const tree = buildTree(root);
        let maxDiameter = 0;
        const maxDepth = (node: TreeNode | null): number => {
          if (!node) return 0;
          const left = maxDepth(node.left);
          const right = maxDepth(node.right);
          maxDiameter = Math.max(maxDiameter, left + right);
          return 1 + Math.max(left, right);
        };
        maxDepth(tree);
        return maxDiameter;
      },
      testCases: {
        functional: [
          [[1, 2, 3, 4, 5]],
          [[1, 2]],
          [[1]],
          [[1, 2, 3, null, null, 4, 5]]
        ],
        boundary: [
          [[1, null, 2]],
          [[1, 2, null, 3]],
          [[1, 2, 3]]
        ],
        adversarial: [
          [[4, -7, -3, null, null, -9, -3, 9, -7, -4, null, 6, null, -6, -6, null, null, 0, 6, 5, null, 9, null, null, -1, -4, null, null, null, -2]],
          [[1, 2, null, 3, 4, 5, null, null, 6]],
          [[1, 2, 3, 4, 5, 6, 7]]
        ],
        stress: [
          [Array.from({ length: 63 }, (_, i) => i + 1)],
          [Array.from({ length: 50 }, (_, i) => i % 2 === 0 ? i : null)]
        ]
      }
    }),

    // 225. Balanced Binary Tree
    createProblem({
      num: 225,
      title: "Balanced Binary Tree",
      slug: "balanced-binary-tree",
      level: 10,
      difficulty: "EASY",
      topic: "Trees / DFS",
      patternSlug: "trees-foundations",
      estimatedTimeMin: 15,
      statement: "Given a binary tree, determine if it is height-balanced.\n\nA height-balanced binary tree is a binary tree in which the depth of the two subtrees of every node never differs by more than one.",
      functionName: "isBalanced",
      parameters: [{ name: "root", type: "(number | null)[]", description: "Binary tree level-order array" }],
      returnType: "boolean",
      constraints: ["The number of nodes in the tree is in the range [0, 5000].", "-10^4 <= Node.val <= 10^4"],
      examples: [
        { input: "root = [3,9,20,null,null,15,7]", output: "true", explanation: "Subtree heights differ by at most 1 at every node." },
        { input: "root = [1,2,2,3,3,null,null,4,4]", output: "false", explanation: "Subtrees of node 2 have heights 3 and 1, differing by 2." },
        { input: "root = []", output: "true", explanation: "Empty tree is balanced." },
        { input: "root = [1]", output: "true", explanation: "Single node is balanced." }
      ],
      optimalSolution: `function isBalanced(root) {\n  const tree = buildTree(root);\n  function check(node) {\n    if (!node) return 0;\n    const left = check(node.left);\n    if (left === -1) return -1;\n    const right = check(node.right);\n    if (right === -1) return -1;\n    if (Math.abs(left - right) > 1) return -1;\n    return 1 + Math.max(left, right);\n  }\n  return check(tree) !== -1;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(H)",
      suboptimalSolution: `function isBalanced(root) {\n  const tree = buildTree(root);\n  function depth(node) {\n    if (!node) return 0;\n    return 1 + Math.max(depth(node.left), depth(node.right));\n  }\n  function dfs(node) {\n    if (!node) return true;\n    if (Math.abs(depth(node.left) - depth(node.right)) > 1) return false;\n    return dfs(node.left) && dfs(node.right);\n  }\n  return dfs(tree);\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(H)",
      commonMistakes: ["Recalculating depth repeatedly resulting in O(N^2) top-down check", "Only checking balance at root while subtrees are unbalanced"],
      hints: ["Compute depth bottom-up; return -1 immediately if any subtree is unbalanced."],
      oracleFn: (root: (number | null)[]) => {
        const tree = buildTree(root);
        const check = (node: TreeNode | null): number => {
          if (!node) return 0;
          const left = check(node.left);
          if (left === -1) return -1;
          const right = check(node.right);
          if (right === -1) return -1;
          if (Math.abs(left - right) > 1) return -1;
          return 1 + Math.max(left, right);
        };
        return check(tree) !== -1;
      },
      testCases: {
        functional: [
          [[3, 9, 20, null, null, 15, 7]],
          [[1, 2, 2, 3, 3, null, null, 4, 4]],
          [[]],
          [[1]]
        ],
        boundary: [
          [[1, 2]],
          [[1, null, 2]],
          [[1, 2, 3]]
        ],
        adversarial: [
          [[1, 2, 2, 3, null, null, 3, 4, null, null, 4]],
          [[1, null, 2, null, 3]],
          [[1, 2, 3, 4, 5, 6, null, 8]]
        ],
        stress: [
          [Array.from({ length: 63 }, (_, i) => i + 1)],
          [Array.from({ length: 40 }, (_, i) => i % 2 === 0 ? i : null)]
        ]
      }
    }),

    // 226. Subtree of Another Tree
    createProblem({
      num: 226,
      title: "Subtree of Another Tree",
      slug: "subtree-of-another-tree",
      level: 10,
      difficulty: "EASY",
      topic: "Trees / DFS",
      patternSlug: "trees-foundations",
      estimatedTimeMin: 20,
      statement: "Given the roots of two binary trees `root` and `subRoot`, return `true` if there is a subtree of `root` with the same structure and node values of `subRoot` and `false` otherwise.\n\nA subtree of a binary tree `tree` is a tree that consists of a node in `tree` and all of this node's descendants. The tree `tree` could also be considered as a subtree of itself.",
      functionName: "isSubtree",
      parameters: [
        { name: "root", type: "(number | null)[]", description: "Main tree level-order array" },
        { name: "subRoot", type: "(number | null)[]", description: "Subtree level-order array" }
      ],
      returnType: "boolean",
      constraints: ["The number of nodes in the root tree is in the range [1, 2000].", "The number of nodes in the subRoot tree is in the range [1, 1000].", "-10^4 <= root.val <= 10^4", "-10^4 <= subRoot.val <= 10^4"],
      examples: [
        {
          input: "root = [3,4,5,1,2], subRoot = [4,1,2]",
          output: "true",
          explanation: "subRoot matches left subtree of root exactly."
        },
        {
          input: "root = [3,4,5,1,2,null,null,null,null,0], subRoot = [4,1,2]",
          output: "false",
          explanation: "Node 2 has a child 0 in root, but not in subRoot, so they are not identical."
        },
        { input: "root = [1,1], subRoot = [1]", output: "true", explanation: "Single node subRoot matches leaf node 1." },
        { input: "root = [1], subRoot = [1]", output: "true", explanation: "Identical single node trees." }
      ],
      optimalSolution: `function isSubtree(root, subRoot) {\n  const t1 = buildTree(root), t2 = buildTree(subRoot);\n  function isSame(n1, n2) {\n    if (!n1 && !n2) return true;\n    if (!n1 || !n2 || n1.val !== n2.val) return false;\n    return isSame(n1.left, n2.left) && isSame(n1.right, n2.right);\n  }\n  function dfs(node) {\n    if (!node) return false;\n    if (isSame(node, t2)) return true;\n    return dfs(node.left) || dfs(node.right);\n  }\n  return dfs(t1);\n}`,
      optimalTimeComplexity: "O(N * M)",
      optimalSpaceComplexity: "O(H)",
      suboptimalSolution: `function isSubtree(root, subRoot) {\n  // String serialization with delimiters\n  function serialize(node) {\n    if (!node) return "#";\n    return "^" + node.val + serialize(node.left) + serialize(node.right);\n  }\n  const s1 = serialize(buildTree(root));\n  const s2 = serialize(buildTree(subRoot));\n  return s1.includes(s2);\n}`,
      suboptimalTimeComplexity: "O(N + M)",
      suboptimalSpaceComplexity: "O(N + M)",
      commonMistakes: [
        "Matching subRoot values inside an internal branch without ensuring subRoot covers all descendants to the leaves",
        "String matching without unique node delimiters"
      ],
      hints: ["For each node in `root`, check if `isSameTree(node, subRoot)` is true.", "Recursively test `dfs(node.left) || dfs(node.right)`."],
      oracleFn: (root: (number | null)[], subRoot: (number | null)[]) => {
        const t1 = buildTree(root);
        const t2 = buildTree(subRoot);
        const isSame = (n1: TreeNode | null, n2: TreeNode | null): boolean => {
          if (!n1 && !n2) return true;
          if (!n1 || !n2 || n1.val !== n2.val) return false;
          return isSame(n1.left, n2.left) && isSame(n1.right, n2.right);
        };
        const dfs = (node: TreeNode | null): boolean => {
          if (!node) return false;
          if (isSame(node, t2)) return true;
          return dfs(node.left) || dfs(node.right);
        };
        return dfs(t1);
      },
      testCases: {
        functional: [
          [[3, 4, 5, 1, 2], [4, 1, 2]],
          [[3, 4, 5, 1, 2, null, null, null, null, 0], [4, 1, 2]],
          [[1, 1], [1]],
          [[1], [1]]
        ],
        boundary: [
          [[1, 2, 3], [2]],
          [[1, 2, 3], [3]],
          [[1, 2, 3], [4]]
        ],
        adversarial: [
          [[3, 4, 5, 1, null, 2], [3, 1, 2]],
          [[1, 2, 3], [1, 2]],
          [[1, null, 1, null, 1, 2], [1, 2]]
        ],
        stress: [
          [Array.from({ length: 63 }, (_, i) => i + 1), [3, 6, 7]],
          [Array.from({ length: 63 }, () => 1), [1, 1, 1]]
        ]
      }
    }),

    // 227. Lowest Common Ancestor of a Binary Search Tree
    createProblem({
      num: 227,
      title: "Lowest Common Ancestor of a Binary Search Tree",
      slug: "lowest-common-ancestor-of-a-binary-search-tree",
      level: 10,
      difficulty: "MEDIUM",
      topic: "Trees / BST",
      patternSlug: "trees-foundations",
      estimatedTimeMin: 20,
      statement: "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.\n\nAccording to the definition of LCA on Wikipedia: “The lowest common ancestor is defined between two nodes `p` and `q` as the lowest node in `T` that has both `p` and `q` as descendants (where we allow a node to be a descendant of itself).”",
      functionName: "lowestCommonAncestor",
      parameters: [
        { name: "root", type: "(number | null)[]", description: "BST level-order array" },
        { name: "p", type: "number", description: "Value of first target node" },
        { name: "q", type: "number", description: "Value of second target node" }
      ],
      returnType: "number",
      constraints: ["The number of nodes in the tree is in the range [2, 10^5].", "-10^9 <= Node.val <= 10^9", "All Node.val are unique.", "p != q", "p and q will exist in the BST."],
      examples: [
        {
          input: "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8",
          output: "6",
          explanation: "The LCA of nodes 2 and 8 is 6."
        },
        {
          input: "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4",
          output: "2",
          explanation: "The LCA of nodes 2 and 4 is 2, since a node can be a descendant of itself."
        },
        { input: "root = [2,1], p = 2, q = 1", output: "2", explanation: "LCA is root 2." },
        { input: "root = [5,3,6,2,4,null,null,1], p = 1, q = 4", output: "3", explanation: "LCA is node 3." }
      ],
      optimalSolution: `function lowestCommonAncestor(root, p, q) {\n  const tree = buildTree(root);\n  let curr = tree;\n  while (curr) {\n    if (p < curr.val && q < curr.val) curr = curr.left;\n    else if (p > curr.val && q > curr.val) curr = curr.right;\n    else return curr.val;\n  }\n  return -1;\n}`,
      optimalTimeComplexity: "O(H)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function lowestCommonAncestor(root, p, q) {\n  const tree = buildTree(root);\n  function dfs(node) {\n    if (!node || node.val === p || node.val === q) return node;\n    const left = dfs(node.left);\n    const right = dfs(node.right);\n    if (left && right) return node;\n    return left || right;\n  }\n  return dfs(tree).val;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(H)",
      commonMistakes: ["Traversing all branches O(N) instead of exploiting the BST order property O(H)", "Returning the full node object instead of its value"],
      hints: [
        "In a BST, if both `p` and `q` are smaller than `curr.val`, LCA must be in the left subtree.",
        "If both are greater, LCA must be in the right subtree.",
        "Otherwise, the current node is the split point and hence the LCA."
      ],
      oracleFn: (root: (number | null)[], p: number, q: number) => {
        const tree = buildTree(root);
        let curr = tree;
        while (curr) {
          if (p < curr.val && q < curr.val) curr = curr.left;
          else if (p > curr.val && q > curr.val) curr = curr.right;
          else return curr.val;
        }
        return -1;
      },
      testCases: {
        functional: [
          [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 8],
          [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 4],
          [[2, 1], 2, 1],
          [[5, 3, 6, 2, 4, null, null, 1], 1, 4]
        ],
        boundary: [
          [[2, 1, 3], 1, 3],
          [[3, 1, 4, null, 2], 2, 4],
          [[10, 5, 15], 5, 15]
        ],
        adversarial: [
          [[5, 3, 6, 1, 4, null, null, null, 2], 2, 4],
          [[20, 10, 30, 5, 15, 25, 35], 5, 15],
          [[20, 10, 30, 5, 15, 25, 35], 25, 35]
        ],
        stress: [
          [[50, 25, 75, 12, 37, 62, 87, 6, 18, 31, 43], 6, 43],
          [[100, 50, 150, 25, 75, 125, 175], 25, 175]
        ]
      }
    }),

    // 228. Lowest Common Ancestor of a Binary Tree
    createProblem({
      num: 228,
      title: "Lowest Common Ancestor of a Binary Tree",
      slug: "lowest-common-ancestor-of-a-binary-tree",
      level: 10,
      difficulty: "MEDIUM",
      topic: "Trees / DFS",
      patternSlug: "trees-foundations",
      estimatedTimeMin: 25,
      statement: "Given a binary tree, find the lowest common ancestor (LCA) of two given nodes `p` and `q` in the tree.\n\nAccording to the definition of LCA on Wikipedia: “The lowest common ancestor is defined between two nodes `p` and `q` as the lowest node in `T` that has both `p` and `q` as descendants (where we allow a node to be a descendant of itself).”",
      functionName: "lowestCommonAncestor",
      parameters: [
        { name: "root", type: "(number | null)[]", description: "Binary tree level-order array" },
        { name: "p", type: "number", description: "Value of first node" },
        { name: "q", type: "number", description: "Value of second node" }
      ],
      returnType: "number",
      constraints: ["The number of nodes in the tree is in the range [2, 10^5].", "-10^9 <= Node.val <= 10^9", "All Node.val are unique.", "p != q", "p and q will exist in the tree."],
      examples: [
        {
          input: "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1",
          output: "3",
          explanation: "The LCA of nodes 5 and 1 is 3."
        },
        {
          input: "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4",
          output: "5",
          explanation: "The LCA of nodes 5 and 4 is 5, since a node can be a descendant of itself."
        },
        { input: "root = [1,2], p = 1, q = 2", output: "1", explanation: "LCA is root 1." },
        { input: "root = [1,2,3], p = 2, q = 3", output: "1", explanation: "LCA is root 1." }
      ],
      optimalSolution: `function lowestCommonAncestor(root, p, q) {\n  const tree = buildTree(root);\n  function dfs(node) {\n    if (!node || node.val === p || node.val === q) return node;\n    const left = dfs(node.left);\n    const right = dfs(node.right);\n    if (left && right) return node;\n    return left || right;\n  }\n  const ans = dfs(tree);\n  return ans ? ans.val : -1;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(H)",
      suboptimalSolution: `function lowestCommonAncestor(root, p, q) {\n  // Finding root-to-node paths and finding last common node\n  const tree = buildTree(root);\n  function findPath(node, target, path) {\n    if (!node) return false;\n    path.push(node.val);\n    if (node.val === target) return true;\n    if (findPath(node.left, target, path) || findPath(node.right, target, path)) return true;\n    path.pop();\n    return false;\n  }\n  const p1 = [], p2 = [];\n  findPath(tree, p, p1);\n  findPath(tree, q, p2);\n  let lca = -1;\n  for (let i = 0; i < Math.min(p1.length, p2.length); i++) {\n    if (p1[i] === p2[i]) lca = p1[i];\n    else break;\n  }\n  return lca;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Assuming the tree is a BST and using value comparisons", "Not returning the found node when `node.val === p || node.val === q`"],
      hints: [
        "Recursively search for `p` and `q` in left and right subtrees.",
        "If both subtrees return non-null, current node is the LCA.",
        "Otherwise, propagate whichever non-null subtree result was found."
      ],
      oracleFn: (root: (number | null)[], p: number, q: number) => {
        const tree = buildTree(root);
        const dfs = (node: TreeNode | null): TreeNode | null => {
          if (!node || node.val === p || node.val === q) return node;
          const left = dfs(node.left);
          const right = dfs(node.right);
          if (left && right) return node;
          return left || right;
        };
        const ans = dfs(tree);
        return ans ? ans.val : -1;
      },
      testCases: {
        functional: [
          [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 1],
          [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 4],
          [[1, 2], 1, 2],
          [[1, 2, 3], 2, 3]
        ],
        boundary: [
          [[1, 2, 3, 4], 4, 3],
          [[1, null, 2, null, 3], 2, 3],
          [[1, 2, null, 3], 2, 3]
        ],
        adversarial: [
          [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 7, 8],
          [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 6, 4],
          [[1, 2, 3, 4, 5, 6, 7], 4, 5]
        ],
        stress: [
          [Array.from({ length: 63 }, (_, i) => i + 1), 32, 63],
          [Array.from({ length: 63 }, (_, i) => i + 1), 16, 17]
        ]
      }
    }),

    // 229. Validate Binary Search Tree
    createProblem({
      num: 229,
      title: "Validate Binary Search Tree",
      slug: "validate-binary-search-tree",
      level: 10,
      difficulty: "MEDIUM",
      topic: "Trees / BST",
      patternSlug: "trees-foundations",
      estimatedTimeMin: 20,
      statement: "Given the `root` of a binary tree, determine if it is a valid binary search tree (BST).\n\nA valid BST is defined as follows:\n- The left subtree of a node contains only nodes with keys strictly less than the node's key.\n- The right subtree of a node contains only nodes with keys strictly greater than the node's key.\n- Both the left and right subtrees must also be binary search trees.",
      functionName: "isValidBST",
      parameters: [{ name: "root", type: "(number | null)[]", description: "Binary tree level-order array" }],
      returnType: "boolean",
      constraints: ["The number of nodes in the tree is in the range [1, 10^4].", "-2^31 <= Node.val <= 2^31 - 1"],
      examples: [
        { input: "root = [2,1,3]", output: "true", explanation: "Valid BST: left 1 < 2 < right 3." },
        { input: "root = [5,1,4,null,null,3,6]", output: "false", explanation: "Root node's value is 5 but its right child's left value is 3." },
        { input: "root = [1,1]", output: "false", explanation: "Duplicate values are not allowed in strict BST." },
        { input: "root = [2147483647]", output: "true", explanation: "Single node is always valid." }
      ],
      optimalSolution: `function isValidBST(root) {\n  const tree = buildTree(root);\n  function validate(node, min, max) {\n    if (!node) return true;\n    if (node.val <= min || node.val >= max) return false;\n    return validate(node.left, min, node.val) && validate(node.right, node.val, max);\n  }\n  return validate(tree, -Infinity, Infinity);\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(H)",
      suboptimalSolution: `function isValidBST(root) {\n  const tree = buildTree(root);\n  const values = [];\n  function inorder(node) {\n    if (!node) return;\n    inorder(node.left);\n    values.push(node.val);\n    inorder(node.right);\n  }\n  inorder(tree);\n  for (let i = 1; i < values.length; i++) {\n    if (values[i] <= values[i - 1]) return false;\n  }\n  return true;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: [
        "Only comparing a node with its immediate left and right child (failing when a node in right subtree is smaller than root)",
        "Allowing duplicate equal values (problem requires strictly less/greater)",
        "Using 32-bit INT_MIN/INT_MAX as initial bounds instead of `-Infinity` / `Infinity`"
      ],
      hints: [
        "Pass valid bounds `(min, max)` down during recursion.",
        "For left child: update `max = node.val`.",
        "For right child: update `min = node.val`."
      ],
      oracleFn: (root: (number | null)[]) => {
        const tree = buildTree(root);
        const validate = (node: TreeNode | null, min: number, max: number): boolean => {
          if (!node) return true;
          if (node.val <= min || node.val >= max) return false;
          return validate(node.left, min, node.val) && validate(node.right, node.val, max);
        };
        return validate(tree, -Infinity, Infinity);
      },
      testCases: {
        functional: [
          [[2, 1, 3]],
          [[5, 1, 4, null, null, 3, 6]],
          [[1, 1]],
          [[2147483647]]
        ],
        boundary: [
          [[-2147483648]],
          [[2, 2, 2]],
          [[10, 5, 15, null, null, 6, 20]]
        ],
        adversarial: [
          [[5, 4, 6, null, null, 3, 7]],
          [[3, 1, 5, 0, 2, 4, 6]],
          [[32, 26, 47, 19, null, null, 56, null, 27]]
        ],
        stress: [
          [Array.from({ length: 63 }, (_, i) => i + 1)],
          [Array.from({ length: 63 }, () => 10)]
        ]
      }
    }),

    // 230. Kth Smallest Element in a BST
    createProblem({
      num: 230,
      title: "Kth Smallest Element in a BST",
      slug: "kth-smallest-element-in-a-bst",
      level: 10,
      difficulty: "MEDIUM",
      topic: "Trees / BST",
      patternSlug: "trees-foundations",
      estimatedTimeMin: 20,
      statement: "Given the `root` of a binary search tree, and an integer `k`, return the `k-th` smallest value (1-indexed) of all the values of the nodes in the tree.",
      functionName: "kthSmallest",
      parameters: [
        { name: "root", type: "(number | null)[]", description: "BST level-order array" },
        { name: "k", type: "number", description: "1-indexed target rank from smallest" }
      ],
      returnType: "number",
      constraints: ["The number of nodes in the tree is n.", "1 <= k <= n <= 10^4", "0 <= Node.val <= 10^4"],
      examples: [
        { input: "root = [3,1,4,null,2], k = 1", output: "1", explanation: "Smallest node is 1." },
        { input: "root = [5,3,6,2,4,null,null,1], k = 3", output: "3", explanation: "Nodes in sorted order: [1,2,3,4,5,6]. 3rd smallest is 3." },
        { input: "root = [2,1,3], k = 2", output: "2", explanation: "2nd smallest is 2." },
        { input: "root = [1], k = 1", output: "1", explanation: "Single node." }
      ],
      optimalSolution: `function kthSmallest(root, k) {\n  const tree = buildTree(root);\n  let count = 0, result = -1;\n  function inorder(node) {\n    if (!node || result !== -1) return;\n    inorder(node.left);\n    count++;\n    if (count === k) {\n      result = node.val;\n      return;\n    }\n    inorder(node.right);\n  }\n  inorder(tree);\n  return result;\n}`,
      optimalTimeComplexity: "O(H + K)",
      optimalSpaceComplexity: "O(H)",
      suboptimalSolution: `function kthSmallest(root, k) {\n  const tree = buildTree(root);\n  const vals = [];\n  function dfs(node) {\n    if (!node) return;\n    dfs(node.left);\n    vals.push(node.val);\n    dfs(node.right);\n  }\n  dfs(tree);\n  return vals[k - 1];\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Traversing the entire tree when early exit upon `count === k` is possible", "Using 0-indexing instead of 1-indexing"],
      hints: ["Inorder traversal of a BST yields values in strictly ascending order.", "Stop early as soon as the `k-th` node is visited."],
      oracleFn: (root: (number | null)[], k: number) => {
        const tree = buildTree(root);
        let count = 0;
        let result = -1;
        const inorder = (node: TreeNode | null) => {
          if (!node || result !== -1) return;
          inorder(node.left);
          count++;
          if (count === k) {
            result = node.val;
            return;
          }
          inorder(node.right);
        };
        inorder(tree);
        return result;
      },
      testCases: {
        functional: [
          [[3, 1, 4, null, 2], 1],
          [[5, 3, 6, 2, 4, null, null, 1], 3],
          [[2, 1, 3], 2],
          [[1], 1]
        ],
        boundary: [
          [[2, 1, 3], 1],
          [[2, 1, 3], 3],
          [[10, 5, 15], 2]
        ],
        adversarial: [
          [[4, 2, 5, 1, 3], 4],
          [[5, 3, 6, 2, 4, null, null, 1], 6],
          [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 5]
        ],
        stress: [
          [Array.from({ length: 63 }, (_, i) => i + 1), 25],
          [Array.from({ length: 63 }, (_, i) => i + 1), 60]
        ]
      }
    }),

    // 231. Convert Sorted Array to Binary Search Tree
    createProblem({
      num: 231,
      title: "Convert Sorted Array to Binary Search Tree",
      slug: "convert-sorted-array-to-binary-search-tree",
      level: 10,
      difficulty: "EASY",
      topic: "Trees / BST / Divide and Conquer",
      patternSlug: "trees-foundations",
      estimatedTimeMin: 15,
      statement: "Given an integer array `nums` where the elements are sorted in ascending order, convert it to a height-balanced binary search tree.\n\nA height-balanced binary tree is a binary tree in which the depth of the two subtrees of every node never differs by more than one.",
      functionName: "sortedArrayToBST",
      parameters: [{ name: "nums", type: "number[]", description: "Sorted array of integers" }],
      returnType: "(number | null)[]",
      constraints: ["1 <= nums.length <= 10^4", "-10^4 <= nums[i] <= 10^4", "nums is sorted in a strictly increasing order."],
      examples: [
        {
          input: "nums = [-10,-3,0,5,9]",
          output: "[0,-3,9,-10,null,5]",
          explanation: "Pick middle element 0 as root, [-10, -3] as left subtree, [5, 9] as right subtree."
        },
        { input: "nums = [1,3]", output: "[3,1]", explanation: "Pick 3 as root, 1 as left child (or 1 as root, 3 as right child)." },
        { input: "nums = [1]", output: "[1]", explanation: "Single node tree." },
        { input: "nums = [1,2,3]", output: "[2,1,3]", explanation: "Middle 2 is root, 1 left, 3 right." }
      ],
      optimalSolution: `function sortedArrayToBST(nums) {\n  function build(left, right) {\n    if (left > right) return null;\n    const mid = Math.floor((left + right) / 2);\n    const node = { val: nums[mid], left: null, right: null };\n    node.left = build(left, mid - 1);\n    node.right = build(mid + 1, right);\n    return node;\n  }\n  return treeToArray(build(0, nums.length - 1));\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(log N)",
      suboptimalSolution: `function sortedArrayToBST(nums) {\n  function build(left, right) {\n    if (left > right) return null;\n    const mid = Math.floor((left + right) / 2);\n    const node = new TreeNode(nums[mid]);\n    node.left = build(left, mid - 1);\n    node.right = build(mid + 1, right);\n    return node;\n  }\n  return treeToArray(build(0, nums.length - 1));\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Slicing arrays repeatedly creating O(N log N) memory overhead", "Picking off-center elements causing unbalanced tree"],
      hints: ["The middle element of the sorted subarray must be the root of that subtree.", "Recursively construct the left subtree from `nums[left..mid-1]` and right subtree from `nums[mid+1..right]`."],
      oracleFn: (nums: number[]) => {
        const build = (left: number, right: number): TreeNode | null => {
          if (left > right) return null;
          const mid = Math.floor((left + right) / 2);
          const node: TreeNode = { val: nums[mid], left: null, right: null };
          node.left = build(left, mid - 1);
          node.right = build(mid + 1, right);
          return node;
        };
        return treeToArray(build(0, nums.length - 1));
      },
      testCases: {
        functional: [
          [[-10, -3, 0, 5, 9]],
          [[1, 3]],
          [[1]],
          [[1, 2, 3]]
        ],
        boundary: [
          [[1, 2]],
          [[-1, 0, 1]],
          [[1, 2, 3, 4]]
        ],
        adversarial: [
          [[1, 2, 3, 4, 5, 6, 7]],
          [[1, 2, 3, 4, 5, 6, 7, 8]],
          [[-100, -50, 0, 50, 100]]
        ],
        stress: [
          [Array.from({ length: 63 }, (_, i) => i + 1)],
          [Array.from({ length: 127 }, (_, i) => (i - 63) * 2)]
        ]
      }
    }),

    // 232. Serialize and Deserialize Binary Tree (DESIGN)
    createProblem({
      num: 232,
      title: "Serialize and Deserialize Binary Tree",
      slug: "serialize-and-deserialize-binary-tree",
      level: 10,
      difficulty: "HARD",
      topic: "Trees / Design",
      patternSlug: "trees-foundations",
      estimatedTimeMin: 35,
      statement: "Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.\n\nDesign an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.\n\nImplement the `Codec` class:\n- `Codec()` initializes the codec object.\n- `string serialize((number | null)[] root)` serializes a tree to a single string.\n- `(number | null)[] deserialize(string data)` deserializes your string back to the tree representation.",
      executionModel: "DESIGN",
      functionName: "Codec",
      parameters: [
        { name: "commands", type: "string[]", description: "Array of operations: ['Codec', 'serialize', 'deserialize']" },
        { name: "args", type: "any[]", description: "Arguments for each operation" }
      ],
      returnType: "any[]",
      starterTemplates: {
        javascript: `class Codec {\n  constructor() {}\n  /**\n   * Encodes a tree to a single string.\n   * @param {(number|null)[]} root\n   * @return {string}\n   */\n  serialize(root) {}\n  /**\n   * Decodes your encoded data to tree.\n   * @param {string} data\n   * @return {(number|null)[]}\n   */\n  deserialize(data) {}\n}\n`,
        typescript: `class Codec {\n  constructor() {}\n  serialize(root: (number | null)[]): string { throw new Error("Not implemented"); }\n  deserialize(data: string): (number | null)[] { throw new Error("Not implemented"); }\n}\n`,
        python: `class Codec:\n    def __init__(self):\n        pass\n    def serialize(self, root: list) -> str:\n        pass\n    def deserialize(self, data: str) -> list:\n        pass\n`
      },
      constraints: ["The number of nodes in the tree is in the range [0, 10^4].", "-1000 <= Node.val <= 1000"],
      examples: [
        {
          input: 'commands = ["Codec","serialize","deserialize"]\nargs = [[],[[1,2,3,null,null,4,5]],["1,2,3,null,null,4,5"]]',
          output: '[null,"1,2,3,null,null,4,5",[1,2,3,null,null,4,5]]',
          explanation: "Tree [1,2,3,null,null,4,5] serializes to string and deserializes back to original structure."
        },
        {
          input: 'commands = ["Codec","serialize","deserialize"]\nargs = [[],[[]],[""]]',
          output: '[null,"",[]]',
          explanation: "Empty tree serializes to empty string."
        },
        {
          input: 'commands = ["Codec","serialize","deserialize"]\nargs = [[],[[1]],["1"]]',
          output: '[null,"1",[1]]',
          explanation: "Single node tree."
        },
        {
          input: 'commands = ["Codec","serialize","deserialize"]\nargs = [[],[[1,2]],["1,2"]]',
          output: '[null,"1,2",[1,2]]',
          explanation: "Two nodes tree."
        }
      ],
      optimalSolution: `class Codec {\n  constructor() {}\n  serialize(root) {\n    if (!root || root.length === 0) return "";\n    return root.map(x => x === null ? "null" : String(x)).join(",");\n  }\n  deserialize(data) {\n    if (!data || data.length === 0) return [];\n    return data.split(",").map(x => x === "null" ? null : Number(x));\n  }\n}`,
      optimalTimeComplexity: "O(N) serialize and deserialize",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `class Codec {\n  serialize(root) {\n    if (!root) return "";\n    const arr = Array.isArray(root) ? root : treeToArray(root);\n    return arr.map(x => x === null ? "null" : String(x)).join(",");\n  }\n  deserialize(data) {\n    if (!data) return [];\n    return data.split(",").map(x => x === "null" ? null : Number(x));\n  }\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Failing to parse 'null' strings back to literal null", "Extra trailing commas corrupting deserialization"],
      hints: ["Join array with commas for serialization.", "Split by commas and convert numeric items back for deserialization."],
      oracleFn: (commands: string[], args: any[]) => {
        class RefCodec {
          serialize(root: (number | null)[]): string {
            if (!root || root.length === 0) return "";
            return root.map(x => x === null ? "null" : String(x)).join(",");
          }
          deserialize(data: string): (number | null)[] {
            if (!data || data.length === 0) return [];
            return data.split(",").map(x => x === "null" ? null : Number(x));
          }
        }
        let codec: RefCodec | null = null;
        const res: any[] = [];
        for (let i = 0; i < commands.length; i++) {
          const cmd = commands[i];
          if (cmd === 'Codec') {
            codec = new RefCodec();
            res.push(null);
          } else if (cmd === 'serialize') {
            res.push(codec!.serialize(args[i][0]));
          } else if (cmd === 'deserialize') {
            res.push(codec!.deserialize(args[i][0]));
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [["Codec", "serialize", "deserialize"], [[], [[1, 2, 3, null, null, 4, 5]], ["1,2,3,null,null,4,5"]]],
          [["Codec", "serialize", "deserialize"], [[], [[]], [""]]],
          [["Codec", "serialize", "deserialize"], [[], [[1]], ["1"]]],
          [["Codec", "serialize", "deserialize"], [[], [[1, 2]], ["1,2"]]]
        ],
        boundary: [
          [["Codec", "serialize"], [[], [[-1000, 1000]]]],
          [["Codec", "deserialize"], [[], ["-1000,1000"]]],
          [["Codec", "serialize", "deserialize"], [[], [[1, null, 2]], ["1,null,2"]]]
        ],
        adversarial: [
          [["Codec", "serialize", "deserialize"], [[], [[1, 2, 3, 4, 5, 6, 7]], ["1,2,3,4,5,6,7"]]],
          [["Codec", "serialize", "deserialize"], [[], [[0, 0, 0]], ["0,0,0"]]],
          [["Codec", "deserialize"], [[], ["1,null,2,null,3"]]]
        ],
        stress: [
          [["Codec", "serialize"], [[], [Array.from({ length: 100 }, (_, i) => i)]]],
          [["Codec", "deserialize"], [[], [Array.from({ length: 100 }, (_, i) => i).join(",")]]]
        ]
      }
    }),

    // 233. Construct Binary Tree from Preorder and Inorder Traversal
    createProblem({
      num: 233,
      title: "Construct Binary Tree from Preorder and Inorder Traversal",
      slug: "construct-binary-tree-from-preorder-and-inorder-traversal",
      level: 10,
      difficulty: "MEDIUM",
      topic: "Trees / DFS / Divide and Conquer",
      patternSlug: "trees-foundations",
      estimatedTimeMin: 25,
      statement: "Given two integer arrays `preorder` and `inorder` where `preorder` is the preorder traversal of a binary tree and `inorder` is the inorder traversal of the same tree, construct and return the binary tree in level-order array format.",
      functionName: "buildTree",
      parameters: [
        { name: "preorder", type: "number[]", description: "Preorder traversal values" },
        { name: "inorder", type: "number[]", description: "Inorder traversal values" }
      ],
      returnType: "(number | null)[]",
      constraints: ["1 <= preorder.length <= 3000", "inorder.length == preorder.length", "-3000 <= preorder[i], inorder[i] <= 3000", "preorder and inorder consist of unique values.", "Each value of inorder also appears in preorder.", "preorder is guaranteed to be the preorder traversal of the tree.", "inorder is guaranteed to be the inorder traversal of the tree."],
      examples: [
        {
          input: "preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]",
          output: "[3,9,20,null,null,15,7]",
          explanation: "Root is 3. In inorder, left of 3 is [9], right of 3 is [15,20,7]."
        },
        { input: "preorder = [-1], inorder = [-1]", output: "[-1]", explanation: "Single node tree." },
        { input: "preorder = [1,2,3], inorder = [2,1,3]", output: "[1,2,3]", explanation: "Root 1, left 2, right 3." },
        { input: "preorder = [1,2], inorder = [1,2]", output: "[1,null,2]", explanation: "Right skewed 2-node tree." }
      ],
      optimalSolution: `function buildTree(preorder, inorder) {\n  const inMap = new Map();\n  for (let i = 0; i < inorder.length; i++) inMap.set(inorder[i], i);\n  let preIdx = 0;\n  function helper(left, right) {\n    if (left > right) return null;\n    const rootVal = preorder[preIdx++];\n    const root = { val: rootVal, left: null, right: null };\n    const mid = inMap.get(rootVal);\n    root.left = helper(left, mid - 1);\n    root.right = helper(mid + 1, right);\n    return root;\n  }\n  return treeToArray(helper(0, inorder.length - 1));\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function buildTree(preorder, inorder) {\n  if (!preorder.length || !inorder.length) return [];\n  function helper(pre, ino) {\n    if (!pre.length || !ino.length) return null;\n    const rootVal = pre[0];\n    const mid = ino.indexOf(rootVal);\n    const root = new TreeNode(rootVal);\n    root.left = helper(pre.slice(1, mid + 1), ino.slice(0, mid));\n    root.right = helper(pre.slice(mid + 1), ino.slice(mid + 1));\n    return root;\n  }\n  return treeToArray(helper(preorder, inorder));\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N^2)",
      commonMistakes: ["Using `inorder.indexOf` inside recursive calls causing O(N^2) time", "Partitioning preorder boundaries incorrectly for left vs right subtree"],
      hints: [
        "The first element of `preorder` is always the root.",
        "Find the root index `mid` in `inorder` using a hash map.",
        "Elements left of `mid` in `inorder` form the left subtree; elements to the right form the right subtree."
      ],
      oracleFn: (preorder: number[], inorder: number[]) => {
        const inMap = new Map<number, number>();
        for (let i = 0; i < inorder.length; i++) inMap.set(inorder[i], i);
        let preIdx = 0;
        const helper = (left: number, right: number): TreeNode | null => {
          if (left > right) return null;
          const rootVal = preorder[preIdx++];
          const root: TreeNode = { val: rootVal, left: null, right: null };
          const mid = inMap.get(rootVal)!;
          root.left = helper(left, mid - 1);
          root.right = helper(mid + 1, right);
          return root;
        };
        return treeToArray(helper(0, inorder.length - 1));
      },
      testCases: {
        functional: [
          [[3, 9, 20, 15, 7], [9, 3, 15, 20, 7]],
          [[-1], [-1]],
          [[1, 2, 3], [2, 1, 3]],
          [[1, 2], [1, 2]]
        ],
        boundary: [
          [[1, 2], [2, 1]],
          [[1, 2, 3], [1, 2, 3]],
          [[1, 2, 3], [3, 2, 1]]
        ],
        adversarial: [
          [[1, 2, 4, 5, 3, 6, 7], [4, 2, 5, 1, 6, 3, 7]],
          [[1, 2, 3, 4], [4, 3, 2, 1]],
          [[10, 5, 2, 7, 15, 12, 20], [2, 5, 7, 10, 12, 15, 20]]
        ],
        stress: [
          [Array.from({ length: 63 }, (_, i) => i + 1), Array.from({ length: 63 }, (_, i) => i + 1)],
          [Array.from({ length: 63 }, (_, i) => i + 1), Array.from({ length: 63 }, (_, i) => 63 - i)]
        ]
      }
    })
  ];

  return {
    level: 10,
    levelTitle: "Level 10 — Trees: DFS/BFS Foundations",
    topic: "Tree Traversals, Properties, BST Operations, and Tree Construction",
    problems
  };
}
