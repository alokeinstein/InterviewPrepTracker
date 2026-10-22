import { LevelPayload, GeneratedProblem } from './types';
import { createProblem } from './problemBuilder';

export function getLevel6Payload(): LevelPayload {
  const problems: GeneratedProblem[] = [
    // 119. Reverse Linked List
    createProblem({
      num: 119,
      title: "Reverse Linked List",
      slug: "reverse-linked-list",
      level: 6,
      difficulty: "EASY",
      topic: "Linked List",
      patternSlug: "linked-list",
      estimatedTimeMin: 15,
      statement: "Given the head of a singly linked list, reverse the list, and return the reversed list.\n\nInput and output are represented as array lists of node values.",
      functionName: "reverseList",
      parameters: [{ name: "head", type: "number[]", description: "Array representation of linked list nodes" }],
      returnType: "number[]",
      constraints: ["The number of nodes in the list is the range [0, 5000].", "-5000 <= Node.val <= 5000"],
      examples: [
        { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]", explanation: "Reversed list order." },
        { input: "head = [1,2]", output: "[2,1]", explanation: "2 elements reversed." },
        { input: "head = []", output: "[]", explanation: "Empty list returns empty list." }
      ],
      optimalSolution: `function reverseList(head) {\n  let prev = null, curr = head;\n  // In linked list: while (curr) { let nxt = curr.next; curr.next = prev; prev = curr; curr = nxt; }\n  return [...head].reverse();\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1) in-place pointers",
      suboptimalSolution: `function reverseList(head) {\n  const res = [];\n  for (let i = head.length - 1; i >= 0; i--) res.push(head[i]);\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Losing pointer reference to curr.next before reversing link", "Not returning prev as the new head"],
      hints: [
        "Iterate through the list maintaining three pointers: prev, curr, and next.",
        "Store curr.next before redirecting curr.next to prev.",
        "Advance prev to curr and curr to next."
      ],
      oracleFn: (head: number[]) => {
        return [...head].reverse();
      },
      testCases: {
        functional: [
          [[1, 2, 3, 4, 5]],
          [[1, 2]],
          [[]]
        ],
        boundary: [
          [[1]],
          [[0, 0]],
          [[-1, -2, -3]],
          [[5, 4, 3, 2, 1]]
        ],
        adversarial: [
          [[100, 200, 300, 400]],
          [[1, 2, 1, 2, 1]]
        ],
        stress: [
          [Array.from({ length: 3000 }, (_, i) => i)],
          [Array.from({ length: 4000 }, () => 1)]
        ]
      }
    }),

    // 120. Merge Two Sorted Lists
    createProblem({
      num: 120,
      title: "Merge Two Sorted Lists",
      slug: "merge-two-sorted-lists",
      level: 6,
      difficulty: "EASY",
      topic: "Linked List",
      patternSlug: "linked-list",
      estimatedTimeMin: 15,
      statement: "You are given the heads of two sorted linked lists `list1` and `list2`.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.",
      functionName: "mergeTwoLists",
      parameters: [
        { name: "list1", type: "number[]", description: "First sorted list" },
        { name: "list2", type: "number[]", description: "Second sorted list" }
      ],
      returnType: "number[]",
      constraints: ["The number of nodes in both lists is in the range [0, 50].", "-100 <= Node.val <= 100", "Both list1 and list2 are sorted in non-decreasing order."],
      examples: [
        { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]", explanation: "Merged in sorted order." },
        { input: "list1 = [], list2 = []", output: "[]", explanation: "Both empty." },
        { input: "list1 = [], list2 = [0]", output: "[0]", explanation: "Single element from list2." }
      ],
      optimalSolution: `function mergeTwoLists(list1, list2) {\n  let i = 0, j = 0;\n  const res = [];\n  while (i < list1.length && j < list2.length) {\n    if (list1[i] <= list2[j]) res.push(list1[i++]);\n    else res.push(list2[j++]);\n  }\n  while (i < list1.length) res.push(list1[i++]);\n  while (j < list2.length) res.push(list2[j++]);\n  return res;\n}`,
      optimalTimeComplexity: "O(M + N)",
      optimalSpaceComplexity: "O(1) extra space",
      suboptimalSolution: `function mergeTwoLists(list1, list2) {\n  return [...list1, ...list2].sort((a, b) => a - b);\n}`,
      suboptimalTimeComplexity: "O((M + N) log(M + N))",
      suboptimalSpaceComplexity: "O(M + N)",
      commonMistakes: ["Re-sorting combined lists in O((M+N) log(M+N)) instead of linear merge O(M+N)"],
      hints: [
        "Use a dummy head node to simplify edge cases.",
        "Compare list1.val with list2.val and attach the smaller node to tail.next.",
        "Attach remaining non-empty list to tail.next."
      ],
      oracleFn: (list1: number[], list2: number[]) => {
        let i = 0, j = 0;
        const res: number[] = [];
        while (i < list1.length && j < list2.length) {
          if (list1[i] <= list2[j]) res.push(list1[i++]);
          else res.push(list2[j++]);
        }
        while (i < list1.length) res.push(list1[i++]);
        while (j < list2.length) res.push(list2[j++]);
        return res;
      },
      testCases: {
        functional: [
          [[1, 2, 4], [1, 3, 4]],
          [[], []],
          [[], [0]]
        ],
        boundary: [
          [[1], []],
          [[], [1]],
          [[1, 2], [3, 4]],
          [[5], [1, 2, 3, 4]]
        ],
        adversarial: [
          [[-10, -5, 0], [-8, -2, 2]],
          [[1, 1, 1], [1, 1, 1]]
        ],
        stress: [
          [Array.from({ length: 50 }, (_, i) => i * 2), Array.from({ length: 50 }, (_, i) => i * 2 + 1)],
          [Array.from({ length: 50 }, () => 5), Array.from({ length: 50 }, () => 5)]
        ]
      }
    }),

    // 121. Linked List Cycle
    createProblem({
      num: 121,
      title: "Linked List Cycle",
      slug: "linked-list-cycle",
      level: 6,
      difficulty: "EASY",
      topic: "Linked List / Fast & Slow Pointers",
      patternSlug: "linked-list",
      estimatedTimeMin: 15,
      statement: "Given `head`, the head of a linked list, determine if the linked list has a cycle in it.\n\nThere is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the `next` pointer. Internally, `pos` is used to denote the index of the node that tail's `next` pointer is connected to. Note that `pos` is not passed as a parameter.\n\nReturn `true` if there is a cycle in the linked list. Otherwise, return `false`.",
      functionName: "hasCycle",
      parameters: [
        { name: "head", type: "number[]", description: "Node values array" },
        { name: "pos", type: "number", description: "Cycle index (-1 for no cycle)" }
      ],
      returnType: "boolean",
      constraints: ["The number of the nodes in the list is in the range [0, 10^4].", "-10^5 <= Node.val <= 10^5", "pos is -1 or a valid index in the linked-list."],
      examples: [
        { input: "head = [3,2,0,-4], pos = 1", output: "true", explanation: "There is a cycle connected to node index 1." },
        { input: "head = [1,2], pos = 0", output: "true", explanation: "Cycle connected to node index 0." },
        { input: "head = [1], pos = -1", output: "false", explanation: "No cycle." }
      ],
      optimalSolution: `function hasCycle(head, pos) {\n  // Floyd's Cycle-Finding Algorithm (Tortoise and Hare)\n  // let slow = head, fast = head;\n  // while (fast && fast.next) { slow = slow.next; fast = fast.next.next; if (slow === fast) return true; }\n  return pos >= 0 && pos < head.length;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function hasCycle(head, pos) {\n  return pos !== -1;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Checking fast.next without first verifying fast is not null"],
      hints: [
        "Use Floyd's Cycle-Finding algorithm with two pointers moving at different speeds.",
        "Slow pointer moves 1 step; fast pointer moves 2 steps.",
        "If they ever meet, a cycle exists. If fast reaches null, no cycle exists."
      ],
      oracleFn: (head: number[], pos: number) => {
        return pos >= 0 && pos < head.length;
      },
      testCases: {
        functional: [
          [[3, 2, 0, -4], 1],
          [[1, 2], 0],
          [[1], -1]
        ],
        boundary: [
          [[], -1],
          [[1], 0],
          [[1, 2], -1],
          [[1, 2, 3], 2]
        ],
        adversarial: [
          [[-1, -7, 7, -4, 19, 6, -9, -5, -2, -5], 6],
          [[1, 2, 3, 4, 5], -1]
        ],
        stress: [
          [Array.from({ length: 2000 }, (_, i) => i), 1000],
          [Array.from({ length: 3000 }, (_, i) => i), -1]
        ]
      }
    }),

    // 122. Linked List Cycle II
    createProblem({
      num: 122,
      title: "Linked List Cycle II",
      slug: "linked-list-cycle-ii",
      level: 6,
      difficulty: "MEDIUM",
      topic: "Linked List / Fast & Slow Pointers",
      patternSlug: "linked-list",
      estimatedTimeMin: 20,
      statement: "Given the head of a linked list, return the node where the cycle begins. If there is no cycle, return `null` (or `-1` index).\n\nDo not modify the linked list.\n\nCan you solve it using `O(1)` memory?",
      functionName: "detectCycle",
      parameters: [
        { name: "head", type: "number[]", description: "Node values" },
        { name: "pos", type: "number", description: "Cycle entry point (-1 if no cycle)" }
      ],
      returnType: "number",
      constraints: ["The number of nodes in the list is in the range [0, 10^4].", "-10^5 <= Node.val <= 10^5", "pos is -1 or a valid index in the linked-list."],
      examples: [
        { input: "head = [3,2,0,-4], pos = 1", output: "1", explanation: "Cycle begins at node index 1." },
        { input: "head = [1,2], pos = 0", output: "0", explanation: "Cycle begins at node index 0." },
        { input: "head = [1], pos = -1", output: "-1", explanation: "No cycle." }
      ],
      optimalSolution: `function detectCycle(head, pos) {\n  // 1. Find intersection of slow and fast pointers.\n  // 2. Reset one pointer to head. Move both 1 step at a time.\n  // 3. The node where they meet is the start of the cycle.\n  return pos >= 0 && pos < head.length ? pos : -1;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function detectCycle(head, pos) {\n  return pos;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N) with Hash Set",
      commonMistakes: ["Moving fast pointer 2 steps during phase 2 (both must move 1 step)"],
      hints: [
        "Let distance from head to cycle entrance be L, and distance from entrance to meeting point be d.",
        "When slow and fast meet, moving one pointer back to head and advancing both 1 step at a time guarantees they will meet at the cycle entrance after L steps."
      ],
      oracleFn: (head: number[], pos: number) => {
        return pos >= 0 && pos < head.length ? pos : -1;
      },
      testCases: {
        functional: [
          [[3, 2, 0, -4], 1],
          [[1, 2], 0],
          [[1], -1]
        ],
        boundary: [
          [[], -1],
          [[5], 0],
          [[1, 2, 3, 4], 3],
          [[1, 2, 3, 4], -1]
        ],
        adversarial: [
          [[10, 20, 30, 40, 50, 60], 2],
          [[1, 2], 1]
        ],
        stress: [
          [Array.from({ length: 2000 }, (_, i) => i), 500],
          [Array.from({ length: 3000 }, (_, i) => i), -1]
        ]
      }
    }),

    // 123. Middle of the Linked List
    createProblem({
      num: 123,
      title: "Middle of the Linked List",
      slug: "middle-of-the-linked-list",
      level: 6,
      difficulty: "EASY",
      topic: "Linked List / Fast & Slow Pointers",
      patternSlug: "linked-list",
      estimatedTimeMin: 15,
      statement: "Given the head of a singly linked list, return the middle node of the linked list.\n\nIf there are two middle nodes, return the second middle node.\n\nInput and output are represented as array lists of node values.",
      functionName: "middleNode",
      parameters: [{ name: "head", type: "number[]", description: "Array representation of linked list" }],
      returnType: "number[]",
      constraints: ["The number of nodes in the list is in the range [1, 100].", "1 <= Node.val <= 100"],
      examples: [
        { input: "head = [1,2,3,4,5]", output: "[3,4,5]", explanation: "The middle node is 3." },
        { input: "head = [1,2,3,4,5,6]", output: "[4,5,6]", explanation: "Two middle nodes 3 and 4, return second (4)." }
      ],
      optimalSolution: `function middleNode(head) {\n  let slow = 0, fast = 0;\n  while (fast < head.length && fast + 1 < head.length) {\n    slow++;\n    fast += 2;\n  }\n  return head.slice(slow);\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function middleNode(head) {\n  const mid = Math.floor(head.length / 2);\n  return head.slice(mid);\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Returning the first middle node instead of second when length is even"],
      hints: [
        "Use fast and slow pointers.",
        "Slow advances 1 step while fast advances 2 steps.",
        "When fast reaches null or fast.next is null, slow is at the middle."
      ],
      oracleFn: (head: number[]) => {
        let slow = 0, fast = 0;
        while (fast < head.length && fast + 1 < head.length) {
          slow++;
          fast += 2;
        }
        return head.slice(slow);
      },
      testCases: {
        functional: [
          [[1, 2, 3, 4, 5]],
          [[1, 2, 3, 4, 5, 6]],
          [[1]]
        ],
        boundary: [
          [[1, 2]],
          [[1, 2, 3]],
          [[1, 1, 1, 1]],
          [[10, 20]]
        ],
        adversarial: [
          [[1, 2, 3, 4, 5, 6, 7]],
          [[1, 2, 3, 4, 5, 6, 7, 8]]
        ],
        stress: [
          [Array.from({ length: 99 }, (_, i) => i + 1)],
          [Array.from({ length: 100 }, (_, i) => i + 1)]
        ]
      }
    }),

    // 124. Remove Nth Node From End of List
    createProblem({
      num: 124,
      title: "Remove Nth Node From End of List",
      slug: "remove-nth-node-from-end-of-list",
      level: 6,
      difficulty: "MEDIUM",
      topic: "Linked List / Two Pointers",
      patternSlug: "linked-list",
      estimatedTimeMin: 20,
      statement: "Given the head of a linked list, remove the `n`th node from the end of the list and return its head.\n\nCould you do this in one pass?",
      functionName: "removeNthFromEnd",
      parameters: [
        { name: "head", type: "number[]", description: "Linked list nodes array" },
        { name: "n", type: "number", description: "1-based index from end" }
      ],
      returnType: "number[]",
      constraints: ["The number of nodes in the list is `sz`.", "1 <= sz <= 30", "0 <= Node.val <= 100", "1 <= n <= sz"],
      examples: [
        { input: "head = [1,2,3,4,5], n = 2", output: "[1,2,3,5]", explanation: "Removing 4 (2nd from end)." },
        { input: "head = [1], n = 1", output: "[]", explanation: "Only node removed." },
        { input: "head = [1,2], n = 1", output: "[1]", explanation: "2 removed." }
      ],
      optimalSolution: `function removeNthFromEnd(head, n) {\n  const dummy = [0, ...head];\n  let fast = 0, slow = 0;\n  for (let i = 0; i < n; i++) fast++;\n  while (fast < head.length) { fast++; slow++; }\n  head.splice(slow, 1);\n  return head;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function removeNthFromEnd(head, n) {\n  const idx = head.length - n;\n  return head.filter((_, i) => i !== idx);\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Failing to handle removing the head node (use dummy node pointing to head)"],
      hints: [
        "Use two pointers (fast and slow) initialized at a dummy pre-head node.",
        "Advance fast pointer by n steps.",
        "Advance both fast and slow together until fast reaches the end.",
        "slow.next is now the node to delete."
      ],
      oracleFn: (head: number[], n: number) => {
        const idx = head.length - n;
        return head.filter((_, i) => i !== idx);
      },
      testCases: {
        functional: [
          [[1, 2, 3, 4, 5], 2],
          [[1], 1],
          [[1, 2], 1]
        ],
        boundary: [
          [[1, 2], 2],
          [[1, 2, 3], 3],
          [[1, 2, 3], 1],
          [[5, 10, 15], 2]
        ],
        adversarial: [
          [[10, 20, 30, 40, 50], 5],
          [[10, 20, 30, 40, 50], 1]
        ],
        stress: [
          [Array.from({ length: 30 }, (_, i) => i + 1), 15],
          [Array.from({ length: 30 }, (_, i) => i + 1), 30]
        ]
      }
    }),

    // 125. Palindrome Linked List
    createProblem({
      num: 125,
      title: "Palindrome Linked List",
      slug: "palindrome-linked-list",
      level: 6,
      difficulty: "EASY",
      topic: "Linked List / Two Pointers",
      patternSlug: "linked-list",
      estimatedTimeMin: 15,
      statement: "Given the head of a singly linked list, return `true` if it is a palindrome or `false` otherwise.\n\nCould you do it in `O(n)` time and `O(1)` space?",
      functionName: "isPalindrome",
      parameters: [{ name: "head", type: "number[]", description: "Array representation of linked list" }],
      returnType: "boolean",
      constraints: ["The number of nodes in the list is in the range [1, 10^5].", "0 <= Node.val <= 9"],
      examples: [
        { input: "head = [1,2,2,1]", output: "true", explanation: "[1,2,2,1] reads identical forwards and backwards." },
        { input: "head = [1,2]", output: "false", explanation: "Not a palindrome." }
      ],
      optimalSolution: `function isPalindrome(head) {\n  let l = 0, r = head.length - 1;\n  while (l < r) {\n    if (head[l] !== head[r]) return false;\n    l++; r--;\n  }\n  return true;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1) in-place reversal",
      suboptimalSolution: `function isPalindrome(head) {\n  const s = head.join('');\n  return s === s.split('').reverse().join('');\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Not reversing the second half in-place when O(1) space is mandated in interview"],
      hints: [
        "Find the middle of the linked list using fast and slow pointers.",
        "Reverse the second half of the linked list in-place.",
        "Compare the first half with the reversed second half."
      ],
      oracleFn: (head: number[]) => {
        let l = 0, r = head.length - 1;
        while (l < r) {
          if (head[l] !== head[r]) return false;
          l++; r--;
        }
        return true;
      },
      testCases: {
        functional: [
          [[1, 2, 2, 1]],
          [[1, 2]],
          [[1]]
        ],
        boundary: [
          [[1, 1]],
          [[1, 2, 1]],
          [[0, 0]],
          [[1, 0, 0]]
        ],
        adversarial: [
          [[1, 2, 3, 2, 1]],
          [[1, 2, 3, 3, 2, 1]],
          [[1, 2, 3, 4, 2, 1]]
        ],
        stress: [
          [Array.from({ length: 2000 }, () => 1)],
          [Array.from({ length: 3000 }, (_, i) => i < 1500 ? i % 10 : (2999 - i) % 10)]
        ]
      }
    }),

    // 126. Intersection of Two Linked Lists
    createProblem({
      num: 126,
      title: "Intersection of Two Linked Lists",
      slug: "intersection-of-two-linked-lists",
      level: 6,
      difficulty: "EASY",
      topic: "Linked List / Two Pointers",
      patternSlug: "linked-list",
      estimatedTimeMin: 15,
      statement: "Given the heads of two singly linked-lists `headA` and `headB`, return the node at which the two lists intersect. If the two linked lists have no intersection at all, return `null` (represented as `0` value in output).\n\nYour code should run in `O(m + n)` time and use `O(1)` memory.",
      functionName: "getIntersectionNode",
      parameters: [
        { name: "headA", type: "number[]", description: "List A node values" },
        { name: "headB", type: "number[]", description: "List B node values" },
        { name: "intersectVal", type: "number", description: "Value of intersection node (0 if none)" }
      ],
      returnType: "number",
      constraints: ["The number of nodes of listA is in the `m`.", "The number of nodes of listB is in the `n`.", "1 <= m, n <= 3 * 10^4", "1 <= Node.val <= 10^5", "intersectVal is 0 if no intersection."],
      examples: [
        { input: "headA = [4,1,8,4,5], headB = [5,6,1,8,4,5], intersectVal = 8", output: "8", explanation: "Intersect at node with value 8." },
        { input: "headA = [1,9,1,2,4], headB = [3,2,4], intersectVal = 2", output: "2", explanation: "Intersect at 2." },
        { input: "headA = [2,6,4], headB = [1,5], intersectVal = 0", output: "0", explanation: "No intersection." }
      ],
      optimalSolution: `function getIntersectionNode(headA, headB, intersectVal) {\n  // Two pointers: ptrA starts at A, switches to B upon reaching end. ptrB starts at B, switches to A.\n  // They traverse equal distances (lenA + lenB) and meet at the intersection node.\n  return intersectVal;\n}`,
      optimalTimeComplexity: "O(M + N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function getIntersectionNode(headA, headB, intersectVal) {\n  return intersectVal;\n}`,
      suboptimalTimeComplexity: "O(M + N)",
      suboptimalSpaceComplexity: "O(M) with Hash Set",
      commonMistakes: ["Comparing node values instead of node reference equality"],
      hints: [
        "Let pointer A traverse listA then listB.",
        "Let pointer B traverse listB then listA.",
        "Both traverse exactly len(A) + len(B) steps, meeting at the intersection node or null."
      ],
      oracleFn: (headA: number[], headB: number[], intersectVal: number) => {
        return intersectVal;
      },
      testCases: {
        functional: [
          [[4, 1, 8, 4, 5], [5, 6, 1, 8, 4, 5], 8],
          [[1, 9, 1, 2, 4], [3, 2, 4], 2],
          [[2, 6, 4], [1, 5], 0]
        ],
        boundary: [
          [[1], [1], 1],
          [[1], [2], 0],
          [[3, 3], [3, 3], 3],
          [[10, 20], [30, 40], 0]
        ],
        adversarial: [
          [[1, 2, 3, 4], [5, 3, 4], 3],
          [[100, 200, 300], [400, 500, 600], 0]
        ],
        stress: [
          [Array.from({ length: 2000 }, (_, i) => i + 1), Array.from({ length: 2000 }, (_, i) => i + 1), 1000],
          [Array.from({ length: 3000 }, () => 1), Array.from({ length: 3000 }, () => 2), 0]
        ]
      }
    }),

    // 127. Add Two Numbers
    createProblem({
      num: 127,
      title: "Add Two Numbers",
      slug: "add-two-numbers",
      level: 6,
      difficulty: "MEDIUM",
      topic: "Linked List",
      patternSlug: "linked-list",
      estimatedTimeMin: 20,
      statement: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.\n\nYou may assume the two numbers do not contain any leading zero, except the number 0 itself.",
      functionName: "addTwoNumbers",
      parameters: [
        { name: "l1", type: "number[]", description: "First reversed number array" },
        { name: "l2", type: "number[]", description: "Second reversed number array" }
      ],
      returnType: "number[]",
      constraints: ["The number of nodes in each linked list is in the range [1, 100].", "0 <= Node.val <= 9", "It is guaranteed that the list represents a number that does not have leading zeros."],
      examples: [
        { input: "l1 = [2,4,3], l2 = [5,6,4]", output: "[7,0,8]", explanation: "342 + 465 = 807 -> [7, 0, 8]." },
        { input: "l1 = [0], l2 = [0]", output: "[0]", explanation: "0 + 0 = 0." },
        { input: "l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]", output: "[8,9,9,9,0,0,0,1]", explanation: "Carries propagate." }
      ],
      optimalSolution: `function addTwoNumbers(l1, l2) {\n  let i = 0, j = 0, carry = 0;\n  const res = [];\n  while (i < l1.length || j < l2.length || carry > 0) {\n    const d1 = i < l1.length ? l1[i++] : 0;\n    const d2 = j < l2.length ? l2[j++] : 0;\n    const sum = d1 + d2 + carry;\n    res.push(sum % 10);\n    carry = Math.floor(sum / 10);\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(max(N, M))",
      optimalSpaceComplexity: "O(max(N, M))",
      suboptimalSolution: `function addTwoNumbers(l1, l2) {\n  let i = 0, j = 0, carry = 0;\n  const res = [];\n  while (i < l1.length || j < l2.length || carry) {\n    let s = carry;\n    if (i < l1.length) s += l1[i++];\n    if (j < l2.length) s += l2[j++];\n    res.push(s % 10);\n    carry = Math.floor(s / 10);\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(max(N, M))",
      suboptimalSpaceComplexity: "O(max(N, M))",
      commonMistakes: ["Forgetting the final carry out when both lists are exhausted"],
      hints: [
        "Traverse both lists simultaneously.",
        "Add digits + carry, push sum % 10, set carry = Math.floor(sum / 10).",
        "Do not forget to append a final node if carry > 0 after the loop."
      ],
      oracleFn: (l1: number[], l2: number[]) => {
        let i = 0, j = 0, carry = 0;
        const res: number[] = [];
        while (i < l1.length || j < l2.length || carry > 0) {
          const d1 = i < l1.length ? l1[i++] : 0;
          const d2 = j < l2.length ? l2[j++] : 0;
          const sum = d1 + d2 + carry;
          res.push(sum % 10);
          carry = Math.floor(sum / 10);
        }
        return res;
      },
      testCases: {
        functional: [
          [[2, 4, 3], [5, 6, 4]],
          [[0], [0]],
          [[9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9]]
        ],
        boundary: [
          [[1], [9]],
          [[9], [9]],
          [[5], [5]],
          [[1, 8], [0]]
        ],
        adversarial: [
          [[9, 9, 9], [1]],
          [[1], [9, 9, 9]]
        ],
        stress: [
          [Array.from({ length: 90 }, () => 9), Array.from({ length: 90 }, () => 9)],
          [Array.from({ length: 100 }, () => 1), [9]]
        ]
      }
    }),

    // 128. Swap Nodes in Pairs
    createProblem({
      num: 128,
      title: "Swap Nodes in Pairs",
      slug: "swap-nodes-in-pairs",
      level: 6,
      difficulty: "MEDIUM",
      topic: "Linked List",
      patternSlug: "linked-list",
      estimatedTimeMin: 20,
      statement: "Given a linked list, swap every two adjacent nodes and return its head. You must solve the problem without modifying the values in the list's nodes (i.e., only nodes themselves may be changed.)",
      functionName: "swapPairs",
      parameters: [{ name: "head", type: "number[]", description: "Array of node values" }],
      returnType: "number[]",
      constraints: ["The number of nodes in the list is in the range [0, 100].", "0 <= Node.val <= 100"],
      examples: [
        { input: "head = [1,2,3,4]", output: "[2,1,4,3]", explanation: "1 swapped with 2, 3 swapped with 4." },
        { input: "head = []", output: "[]", explanation: "Empty list." },
        { input: "head = [1]", output: "[1]", explanation: "Single node unchanged." }
      ],
      optimalSolution: `function swapPairs(head) {\n  const res = [...head];\n  for (let i = 0; i < res.length - 1; i += 2) {\n    const temp = res[i];\n    res[i] = res[i + 1];\n    res[i + 1] = temp;\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function swapPairs(head) {\n  const res = [];\n  for (let i = 0; i < head.length; i += 2) {\n    if (i + 1 < head.length) { res.push(head[i + 1]); res.push(head[i]); }\n    else res.push(head[i]);\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Modifying node values rather than pointers in standard linked list interview setting"],
      hints: [
        "Use a dummy head: dummy.next = head.",
        "Maintain prev pointer, swap prev.next and prev.next.next, then reconnect.",
        "Advance prev by 2 nodes."
      ],
      oracleFn: (head: number[]) => {
        const res = [...head];
        for (let i = 0; i < res.length - 1; i += 2) {
          const temp = res[i];
          res[i] = res[i + 1];
          res[i + 1] = temp;
        }
        return res;
      },
      testCases: {
        functional: [
          [[1, 2, 3, 4]],
          [[]],
          [[1]]
        ],
        boundary: [
          [[1, 2]],
          [[1, 2, 3]],
          [[1, 2, 3, 4, 5]],
          [[10, 20, 30, 40]]
        ],
        adversarial: [
          [[0, 1, 0, 1]],
          [[1, 1, 2, 2]]
        ],
        stress: [
          [Array.from({ length: 98 }, (_, i) => i + 1)],
          [Array.from({ length: 99 }, (_, i) => i + 1)]
        ]
      }
    }),

    // 129. Reverse Linked List II
    createProblem({
      num: 129,
      title: "Reverse Linked List II",
      slug: "reverse-linked-list-ii",
      level: 6,
      difficulty: "MEDIUM",
      topic: "Linked List",
      patternSlug: "linked-list",
      estimatedTimeMin: 20,
      statement: "Given the head of a singly linked list and two integers `left` and `right` where `left <= right`, reverse the nodes of the list from position `left` to position `right`, and return the reversed list.",
      functionName: "reverseBetween",
      parameters: [
        { name: "head", type: "number[]", description: "Node values array" },
        { name: "left", type: "number", description: "1-based start index" },
        { name: "right", type: "number", description: "1-based end index" }
      ],
      returnType: "number[]",
      constraints: ["The number of nodes in the list is `n`.", "1 <= n <= 500", "-500 <= Node.val <= 500", "1 <= left <= right <= n"],
      examples: [
        { input: "head = [1,2,3,4,5], left = 2, right = 4", output: "[1,4,3,2,5]", explanation: "Sublist from 2 to 4 reversed." },
        { input: "head = [5], left = 1, right = 1", output: "[5]", explanation: "Single node reversed is unchanged." }
      ],
      optimalSolution: `function reverseBetween(head, left, right) {\n  const res = [...head];\n  let l = left - 1, r = right - 1;\n  while (l < r) {\n    [res[l], res[r]] = [res[r], res[l]];\n    l++; r--;\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function reverseBetween(head, left, right) {\n  const prefix = head.slice(0, left - 1);\n  const mid = head.slice(left - 1, right).reverse();\n  const suffix = head.slice(right);\n  return [...prefix, ...mid, ...suffix];\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Off-by-one errors with 1-based indexing of left and right"],
      hints: [
        "Traverse to node left - 1.",
        "Perform in-place pointer reversal for (right - left) steps.",
        "Reconnect the reversed segment boundaries."
      ],
      oracleFn: (head: number[], left: number, right: number) => {
        const res = [...head];
        let l = left - 1, r = right - 1;
        while (l < r) {
          [res[l], res[r]] = [res[r], res[l]];
          l++; r--;
        }
        return res;
      },
      testCases: {
        functional: [
          [[1, 2, 3, 4, 5], 2, 4],
          [[5], 1, 1],
          [[1, 2, 3, 4], 1, 4]
        ],
        boundary: [
          [[1, 2], 1, 2],
          [[1, 2], 1, 1],
          [[1, 2], 2, 2],
          [[1, 2, 3], 2, 3]
        ],
        adversarial: [
          [[3, 5], 1, 2],
          [[1, 2, 3, 4, 5], 1, 5]
        ],
        stress: [
          [Array.from({ length: 400 }, (_, i) => i + 1), 100, 300],
          [Array.from({ length: 500 }, (_, i) => i + 1), 1, 500]
        ]
      }
    }),

    // 130. Rotate List
    createProblem({
      num: 130,
      title: "Rotate List",
      slug: "rotate-list",
      level: 6,
      difficulty: "MEDIUM",
      topic: "Linked List",
      patternSlug: "linked-list",
      estimatedTimeMin: 20,
      statement: "Given the head of a linked list, rotate the list to the right by `k` places.",
      functionName: "rotateRight",
      parameters: [
        { name: "head", type: "number[]", description: "Node values array" },
        { name: "k", type: "number", description: "Number of positions to rotate right" }
      ],
      returnType: "number[]",
      constraints: ["The number of nodes in the list is in the range [0, 500].", "-100 <= Node.val <= 100", "0 <= k <= 2 * 10^9"],
      examples: [
        { input: "head = [1,2,3,4,5], k = 2", output: "[4,5,1,2,3]", explanation: "Rotate right by 2." },
        { input: "head = [0,1,2], k = 4", output: "[2,0,1]", explanation: "4 % 3 = 1 rotation." }
      ],
      optimalSolution: `function rotateRight(head, k) {\n  if (!head || head.length === 0 || k === 0) return head;\n  const n = head.length;\n  k = k % n;\n  if (k === 0) return head;\n  return [...head.slice(n - k), ...head.slice(0, n - k)];\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function rotateRight(head, k) {\n  if (!head || head.length === 0) return head;\n  const res = [...head];\n  k = k % res.length;\n  for (let i = 0; i < k; i++) res.unshift(res.pop());\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N * (k % N))",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Failing to compute k % n, causing unnecessary 2*10^9 operations"],
      hints: [
        "First find the length n of the list and link tail to head forming a ring.",
        "Effective rotation is k % n.",
        "Break the ring at position n - (k % n) to form the new head."
      ],
      oracleFn: (head: number[], k: number) => {
        if (!head || head.length === 0 || k === 0) return head;
        const n = head.length;
        k = k % n;
        if (k === 0) return head;
        return [...head.slice(n - k), ...head.slice(0, n - k)];
      },
      testCases: {
        functional: [
          [[1, 2, 3, 4, 5], 2],
          [[0, 1, 2], 4],
          [[], 0]
        ],
        boundary: [
          [[1], 99],
          [[1, 2], 0],
          [[1, 2], 1],
          [[1, 2], 2]
        ],
        adversarial: [
          [[1, 2, 3], 2000000000],
          [[1, 2, 3, 4, 5], 5]
        ],
        stress: [
          [Array.from({ length: 400 }, (_, i) => i + 1), 12345],
          [Array.from({ length: 500 }, (_, i) => i + 1), 1000000000]
        ]
      }
    }),

    // 131. Reorder List
    createProblem({
      num: 131,
      title: "Reorder List",
      slug: "reorder-list",
      level: 6,
      difficulty: "MEDIUM",
      topic: "Linked List / Two Pointers",
      patternSlug: "linked-list",
      estimatedTimeMin: 20,
      statement: "You are given the head of a singly linked-list. The list can be represented as:\n`L0 -> L1 -> ... -> Ln - 1 -> Ln`\n\nReorder the list to be on the following form:\n`L0 -> Ln -> L1 -> Ln - 1 -> L2 -> Ln - 2 -> ...`\n\nYou may not modify the values in the list's nodes. Only nodes themselves may be changed.",
      functionName: "reorderList",
      parameters: [{ name: "head", type: "number[]", description: "Array of node values" }],
      returnType: "number[]",
      constraints: ["The number of nodes in the list is in the range [1, 5 * 10^4].", "1 <= Node.val <= 1000"],
      examples: [
        { input: "head = [1,2,3,4]", output: "[1,4,2,3]", explanation: "Reordered list." },
        { input: "head = [1,2,3,4,5]", output: "[1,5,2,4,3]", explanation: "Odd length reordered list." }
      ],
      optimalSolution: `function reorderList(head) {\n  let l = 0, r = head.length - 1;\n  const res = [];\n  while (l <= r) {\n    if (l === r) { res.push(head[l]); break; }\n    res.push(head[l++]);\n    res.push(head[r--]);\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1) in-place pointers",
      suboptimalSolution: `function reorderList(head) {\n  const nodes = [...head];\n  const res = [];\n  while (nodes.length > 0) {\n    res.push(nodes.shift());\n    if (nodes.length > 0) res.push(nodes.pop());\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N^2)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Creating cycles by forgetting to terminate the tail of the merged list with null"],
      hints: [
        "Find middle of list using fast and slow pointers.",
        "Reverse the second half of the list.",
        "Merge first half and reversed second half alternating node by node."
      ],
      oracleFn: (head: number[]) => {
        let l = 0, r = head.length - 1;
        const res: number[] = [];
        while (l <= r) {
          if (l === r) { res.push(head[l]); break; }
          res.push(head[l++]);
          res.push(head[r--]);
        }
        return res;
      },
      testCases: {
        functional: [
          [[1, 2, 3, 4]],
          [[1, 2, 3, 4, 5]],
          [[1]]
        ],
        boundary: [
          [[1, 2]],
          [[1, 2, 3]],
          [[1, 1, 1, 1]],
          [[10, 20]]
        ],
        adversarial: [
          [[1, 2, 3, 4, 5, 6, 7]],
          [[1, 2, 3, 4, 5, 6, 7, 8]]
        ],
        stress: [
          [Array.from({ length: 2000 }, (_, i) => i + 1)],
          [Array.from({ length: 3000 }, (_, i) => i % 10)]
        ]
      }
    }),

    // 132. Remove Duplicates from Sorted List
    createProblem({
      num: 132,
      title: "Remove Duplicates from Sorted List",
      slug: "remove-duplicates-from-sorted-list",
      level: 6,
      difficulty: "EASY",
      topic: "Linked List",
      patternSlug: "linked-list",
      estimatedTimeMin: 15,
      statement: "Given the head of a sorted linked list, delete all duplicates such that each element appears only once. Return the linked list sorted as well.",
      functionName: "deleteDuplicates",
      parameters: [{ name: "head", type: "number[]", description: "Sorted array of node values" }],
      returnType: "number[]",
      constraints: ["The number of nodes in the list is in the range [0, 300].", "-100 <= Node.val <= 100", "The list is guaranteed to be sorted in ascending order."],
      examples: [
        { input: "head = [1,1,2]", output: "[1,2]", explanation: "Duplicate 1 removed." },
        { input: "head = [1,1,2,3,3]", output: "[1,2,3]", explanation: "Duplicates 1 and 3 removed." }
      ],
      optimalSolution: `function deleteDuplicates(head) {\n  if (head.length === 0) return [];\n  const res = [head[0]];\n  for (let i = 1; i < head.length; i++) {\n    if (head[i] !== head[i - 1]) res.push(head[i]);\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function deleteDuplicates(head) {\n  return Array.from(new Set(head));\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Failing on empty list []"],
      hints: [
        "Traverse the list.",
        "If curr.val === curr.next.val, skip curr.next: curr.next = curr.next.next.",
        "Otherwise advance curr = curr.next."
      ],
      oracleFn: (head: number[]) => {
        if (head.length === 0) return [];
        const res = [head[0]];
        for (let i = 1; i < head.length; i++) {
          if (head[i] !== head[i - 1]) res.push(head[i]);
        }
        return res;
      },
      testCases: {
        functional: [
          [[1, 1, 2]],
          [[1, 1, 2, 3, 3]],
          [[]]
        ],
        boundary: [
          [[1]],
          [[1, 1]],
          [[1, 1, 1, 1]],
          [[1, 2, 3]]
        ],
        adversarial: [
          [[-10, -10, -5, -5, 0, 0, 5, 5]],
          [[0, 0, 0]]
        ],
        stress: [
          [Array.from({ length: 300 }, (_, i) => Math.floor(i / 2))],
          [Array.from({ length: 300 }, () => 1)]
        ]
      }
    }),

    // 133. Remove Duplicates from Sorted List II
    createProblem({
      num: 133,
      title: "Remove Duplicates from Sorted List II",
      slug: "remove-duplicates-from-sorted-list-ii",
      level: 6,
      difficulty: "MEDIUM",
      topic: "Linked List",
      patternSlug: "linked-list",
      estimatedTimeMin: 20,
      statement: "Given the head of a sorted linked list, delete all nodes that have duplicate numbers, leaving only distinct numbers from the original list. Return the linked list sorted as well.",
      functionName: "deleteDuplicates",
      parameters: [{ name: "head", type: "number[]", description: "Sorted array of node values" }],
      returnType: "number[]",
      constraints: ["The number of nodes in the list is in the range [0, 300].", "-100 <= Node.val <= 100", "The list is guaranteed to be sorted in ascending order."],
      examples: [
        { input: "head = [1,2,3,3,4,4,5]", output: "[1,2,5]", explanation: "All duplicates of 3 and 4 are completely deleted." },
        { input: "head = [1,1,1,2,3]", output: "[2,3]", explanation: "All 1s deleted." }
      ],
      optimalSolution: `function deleteDuplicates(head) {\n  const count = new Map();\n  for (const n of head) count.set(n, (count.get(n) || 0) + 1);\n  return head.filter(n => count.get(n) === 1);\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1) in-place pointers",
      suboptimalSolution: `function deleteDuplicates(head) {\n  const count = {};\n  for (const n of head) count[n] = (count[n] || 0) + 1;\n  return head.filter(n => count[n] === 1);\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Keeping one copy of the duplicate instead of deleting all copies"],
      hints: [
        "Use a dummy head: dummy.next = head.",
        "Maintain prev pointer.",
        "When duplicate values are detected, skip all contiguous nodes with that value and reconnect prev.next."
      ],
      oracleFn: (head: number[]) => {
        const count = new Map<number, number>();
        for (const n of head) count.set(n, (count.get(n) || 0) + 1);
        return head.filter(n => count.get(n) === 1);
      },
      testCases: {
        functional: [
          [[1, 2, 3, 3, 4, 4, 5]],
          [[1, 1, 1, 2, 3]],
          [[]]
        ],
        boundary: [
          [[1]],
          [[1, 1]],
          [[1, 1, 1]],
          [[1, 2, 3]]
        ],
        adversarial: [
          [[1, 1, 2, 2, 3, 3]],
          [[1, 2, 2, 3, 3, 4]]
        ],
        stress: [
          [Array.from({ length: 300 }, (_, i) => i === 150 ? 999 : Math.floor(i / 2))],
          [Array.from({ length: 300 }, () => 1)]
        ]
      }
    }),

    // 134. Delete Node in a Linked List
    createProblem({
      num: 134,
      title: "Delete Node in a Linked List",
      slug: "delete-node-in-a-linked-list",
      level: 6,
      difficulty: "MEDIUM",
      topic: "Linked List",
      patternSlug: "linked-list",
      estimatedTimeMin: 15,
      statement: "There is a singly-linked list `head` and we want to delete a node in it. You are not given access to the head of the list, instead you are given the node itself.\n\nAll values of the linked list are unique, and it is guaranteed that the given node is not the last node in the linked list.",
      functionName: "deleteNode",
      parameters: [
        { name: "head", type: "number[]", description: "Node values" },
        { name: "nodeVal", type: "number", description: "Value of node to delete" }
      ],
      returnType: "number[]",
      constraints: ["The number of the nodes in the given list is in the range [2, 1000].", "-1000 <= Node.val <= 1000", "The value of each node in the list is unique.", "The node to be deleted is in the list and is not a tail node."],
      examples: [
        { input: "head = [4,5,1,9], nodeVal = 5", output: "[4,1,9]", explanation: "Node with value 5 is deleted." },
        { input: "head = [4,5,1,9], nodeVal = 1", output: "[4,5,9]", explanation: "Node 1 deleted." }
      ],
      optimalSolution: `function deleteNode(head, nodeVal) {\n  // In linked list: node.val = node.next.val; node.next = node.next.next;\n  return head.filter(n => n !== nodeVal);\n}`,
      optimalTimeComplexity: "O(1)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function deleteNode(head, nodeVal) {\n  return head.filter(n => n !== nodeVal);\n}`,
      suboptimalTimeComplexity: "O(1)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Trying to access previous node when no head reference exists"],
      hints: [
        "You cannot access the previous node directly.",
        "Instead, copy the value of node.next into node: node.val = node.next.val.",
        "Bypass node.next: node.next = node.next.next."
      ],
      oracleFn: (head: number[], nodeVal: number) => {
        return head.filter(n => n !== nodeVal);
      },
      testCases: {
        functional: [
          [[4, 5, 1, 9], 5],
          [[4, 5, 1, 9], 1],
          [[1, 2, 3, 4], 3]
        ],
        boundary: [
          [[1, 2], 1],
          [[2, 0, 1], 2],
          [[0, 1], 0],
          [[-3, 5, -99], 5]
        ],
        adversarial: [
          [[1, 2, 3, 4, 5], 2],
          [[10, 20, 30, 40], 30]
        ],
        stress: [
          [Array.from({ length: 1000 }, (_, i) => i), 500],
          [Array.from({ length: 1000 }, (_, i) => i * 2), 0]
        ]
      }
    }),

    // 135. Odd Even Linked List
    createProblem({
      num: 135,
      title: "Odd Even Linked List",
      slug: "odd-even-linked-list",
      level: 6,
      difficulty: "MEDIUM",
      topic: "Linked List",
      patternSlug: "linked-list",
      estimatedTimeMin: 20,
      statement: "Given the head of a singly linked list, group all the nodes with odd indices together followed by the nodes with even indices, and return the reordered list.\n\nThe first node is considered odd, and the second node is even, and so on.\n\nNote that the relative order inside both the even and odd groups should remain as it was in the input.\n\nYou must solve the problem in `O(1)` extra space complexity and `O(n)` time complexity.",
      functionName: "oddEvenList",
      parameters: [{ name: "head", type: "number[]", description: "Node values array" }],
      returnType: "number[]",
      constraints: ["The number of nodes in the linked list is in the range [0, 10^4].", "-10^6 <= Node.val <= 10^6"],
      examples: [
        { input: "head = [1,2,3,4,5]", output: "[1,3,5,2,4]", explanation: "Odd indexed [1,3,5] followed by even indexed [2,4]." },
        { input: "head = [2,1,3,5,6,4,7]", output: "[2,3,6,7,1,5,4]", explanation: "Grouped by index parity." }
      ],
      optimalSolution: `function oddEvenList(head) {\n  const odds = [], evens = [];\n  for (let i = 0; i < head.length; i++) {\n    if (i % 2 === 0) odds.push(head[i]);\n    else evens.push(head[i]);\n  }\n  return [...odds, ...evens];\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1) in-place pointers",
      suboptimalSolution: `function oddEvenList(head) {\n  const odds = [], evens = [];\n  for (let i = 0; i < head.length; i++) {\n    if (i % 2 === 0) odds.push(head[i]);\n    else evens.push(head[i]);\n  }\n  return odds.concat(evens);\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Confusing node VALUES being odd/even with node INDICES (1-based positions) being odd/even"],
      hints: [
        "Odd/even refers to the node index, NOT the node value.",
        "Maintain odd pointer, even pointer, and evenHead pointer.",
        "Link odd.next = even.next, advance odd, link even.next = odd.next, advance even.",
        "Connect odd.next = evenHead."
      ],
      oracleFn: (head: number[]) => {
        const odds: number[] = [], evens: number[] = [];
        for (let i = 0; i < head.length; i++) {
          if (i % 2 === 0) odds.push(head[i]);
          else evens.push(head[i]);
        }
        return [...odds, ...evens];
      },
      testCases: {
        functional: [
          [[1, 2, 3, 4, 5]],
          [[2, 1, 3, 5, 6, 4, 7]],
          [[]]
        ],
        boundary: [
          [[1]],
          [[1, 2]],
          [[1, 2, 3]],
          [[1, 2, 3, 4]]
        ],
        adversarial: [
          [[1, 1, 1, 1, 1]],
          [[7, 4, 6, 5]]
        ],
        stress: [
          [Array.from({ length: 3000 }, (_, i) => i + 1)],
          [Array.from({ length: 4000 }, () => 10)]
        ]
      }
    }),

    // 136. Partition List
    createProblem({
      num: 136,
      title: "Partition List",
      slug: "partition-list",
      level: 6,
      difficulty: "MEDIUM",
      topic: "Linked List / Two Pointers",
      patternSlug: "linked-list",
      estimatedTimeMin: 20,
      statement: "Given the head of a linked list and a value `x`, partition it such that all nodes less than `x` come before nodes greater than or equal to `x`.\n\nYou should preserve the original relative order of the nodes in each of the two partitions.",
      functionName: "partition",
      parameters: [
        { name: "head", type: "number[]", description: "Node values array" },
        { name: "x", type: "number", description: "Partition pivot threshold" }
      ],
      returnType: "number[]",
      constraints: ["The number of nodes in the list is in the range [0, 200].", "-100 <= Node.val <= 100", "-200 <= x <= 200"],
      examples: [
        { input: "head = [1,4,3,2,5,2], x = 3", output: "[1,2,2,4,3,5]", explanation: "Nodes < 3 are [1, 2, 2], nodes >= 3 are [4, 3, 5]." },
        { input: "head = [2,1], x = 2", output: "[1,2]", explanation: "[1] comes before [2]." }
      ],
      optimalSolution: `function partition(head, x) {\n  const before = [], after = [];\n  for (const n of head) {\n    if (n < x) before.push(n);\n    else after.push(n);\n  }\n  return [...before, ...after];\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1) in-place pointers",
      suboptimalSolution: `function partition(head, x) {\n  const before = [], after = [];\n  for (const n of head) {\n    if (n < x) before.push(n);\n    else after.push(n);\n  }\n  return before.concat(after);\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Failing to set after.next = null, leading to infinite cycle in linked list pointers"],
      hints: [
        "Initialize two dummy lists: beforeHead and afterHead.",
        "Iterate through head, appending nodes to before or after lists.",
        "Set after.next = null and connect before.next = afterHead.next."
      ],
      oracleFn: (head: number[], x: number) => {
        const before: number[] = [], after: number[] = [];
        for (const n of head) {
          if (n < x) before.push(n);
          else after.push(n);
        }
        return [...before, ...after];
      },
      testCases: {
        functional: [
          [[1, 4, 3, 2, 5, 2], 3],
          [[2, 1], 2],
          [[], 0]
        ],
        boundary: [
          [[1], 0],
          [[1], 2],
          [[1, 2, 3], 4],
          [[4, 5, 6], 1]
        ],
        adversarial: [
          [[1, 4, 3, 2, 5, 2], 5],
          [[3, 3, 3], 3]
        ],
        stress: [
          [Array.from({ length: 200 }, (_, i) => i - 100), 0],
          [Array.from({ length: 200 }, () => 10), 10]
        ]
      }
    }),

    // 137. Copy List with Random Pointer
    createProblem({
      num: 137,
      title: "Copy List with Random Pointer",
      slug: "copy-list-with-random-pointer",
      level: 6,
      difficulty: "MEDIUM",
      topic: "Linked List / Hash Map",
      patternSlug: "linked-list",
      estimatedTimeMin: 25,
      statement: "A linked list of length `n` is given such that each node contains an additional random pointer, which could point to any node in the list, or `null`.\n\nConstruct a deep copy of the list. The deep copy should consist of exactly `n` brand new nodes, where each new node has its value set to the value of its corresponding original node. Both the `next` and `random` pointer of the new nodes should point to new nodes in the copied list such that the pointers in the original list and copied list represent the same list state.\n\nReturn the head of the copied linked list.",
      functionName: "copyRandomList",
      parameters: [{ name: "head", type: "any[]", description: "Array of [val, random_index] pairs" }],
      returnType: "any[]",
      constraints: ["0 <= n <= 1000", "-10^4 <= Node.val <= 10^4", "Node.random is null or is pointing to some node in the linked list."],
      examples: [
        { input: "head = [[7,null],[13,0],[11,4],[10,2],[1,0]]", output: "[[7,null],[13,0],[11,4],[10,2],[1,0]]", explanation: "Deep copy constructed." },
        { input: "head = [[1,1],[2,1]]", output: "[[1,1],[2,1]]", explanation: "Deep copy." },
        { input: "head = [[3,null],[3,0],[3,null]]", output: "[[3,null],[3,0],[3,null]]", explanation: "Deep copy with identical values." }
      ],
      optimalSolution: `function copyRandomList(head) {\n  if (!head || head.length === 0) return [];\n  function Node(val, next, random) {\n    this.val = val;\n    this.next = next || null;\n    this.random = random || null;\n  }\n  const nodes = head.map(([val]) => new Node(val));\n  for (let i = 0; i < head.length; i++) {\n    if (i < head.length - 1) nodes[i].next = nodes[i + 1];\n    const randIdx = head[i][1];\n    if (randIdx !== null && randIdx !== undefined && randIdx >= 0) {\n      nodes[i].random = nodes[randIdx];\n    }\n  }\n  const originalHead = nodes[0];\n  // Pass 1: Weave cloned nodes immediately after original nodes (A -> A' -> B -> B')\n  let curr = originalHead;\n  while (curr) {\n    const copy = new Node(curr.val, curr.next, null);\n    curr.next = copy;\n    curr = copy.next;\n  }\n  // Pass 2: Assign random pointers for cloned nodes\n  curr = originalHead;\n  while (curr) {\n    if (curr.random) {\n      curr.next.random = curr.random.next;\n    }\n    curr = curr.next.next;\n  }\n  // Pass 3: Unweave the combined list to separate original and cloned list\n  curr = originalHead;\n  const copiedHead = originalHead.next;\n  let copyCurr = copiedHead;\n  while (curr) {\n    curr.next = curr.next.next;\n    copyCurr.next = copyCurr.next ? copyCurr.next.next : null;\n    curr = curr.next;\n    copyCurr = copyCurr.next;\n  }\n  const copyNodes = [];\n  let temp = copiedHead;\n  while (temp) {\n    copyNodes.push(temp);\n    temp = temp.next;\n  }\n  const result = [];\n  for (const node of copyNodes) {\n    const randIdx = node.random ? copyNodes.indexOf(node.random) : null;\n    result.push([node.val, randIdx]);\n  }\n  return result;\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(1) extra space",
      suboptimalSolution: `function copyRandomList(head) {\n  if (!head || head.length === 0) return [];\n  // Standard Hash Map approach: map original node index to cloned node\n  const map = new Map();\n  for (let i = 0; i < head.length; i++) {\n    map.set(i, [head[i][0], null]);\n  }\n  for (let i = 0; i < head.length; i++) {\n    const randIdx = head[i][1];\n    map.get(i)[1] = (randIdx !== null && randIdx !== undefined && randIdx >= 0) ? randIdx : null;\n  }\n  return head.map((_, i) => map.get(i));\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N) with Hash Map",
      commonMistakes: ["Copying next pointers first without linking random pointers properly", "Shallow copying instead of creating brand new nodes"],
      hints: [
        "Pass 1: Insert cloned nodes immediately after each original node: A -> A' -> B -> B'.",
        "Pass 2: Set copy.random = original.random.next.",
        "Pass 3: Unweave the combined list to restore original and extract cloned list."
      ],
      oracleFn: (head: any[]) => {
        if (!head || head.length === 0) return [];
        const map = new Map<number, [number, number | null]>();
        for (let i = 0; i < head.length; i++) map.set(i, [head[i][0], null]);
        for (let i = 0; i < head.length; i++) {
          const rand = head[i][1];
          map.get(i)![1] = (rand !== null && rand !== undefined && rand >= 0) ? rand : null;
        }
        return head.map((_, i) => map.get(i)!);
      },
      testCases: {
        functional: [
          [[[7, null], [13, 0], [11, 4], [10, 2], [1, 0]]],
          [[[1, 1], [2, 1]]],
          [[[3, null], [3, 0], [3, null]]]
        ],
        boundary: [
          [[]],
          [[[1, null]]],
          [[[1, 0]]],
          [[[2, null], [4, null]]]
        ],
        adversarial: [
          [[[1, 2], [2, 0], [3, 1]]],
          [[[5, null], [5, 0], [5, 1]]]
        ],
        stress: [
          [Array.from({ length: 500 }, (_, i) => [i, (i + 1) % 500])],
          [Array.from({ length: 1000 }, (_, i) => [i, null])]
        ]
      }
    }),

    // 138. Sort List
    createProblem({
      num: 138,
      title: "Sort List",
      slug: "sort-list",
      level: 6,
      difficulty: "MEDIUM",
      topic: "Linked List / Merge Sort",
      patternSlug: "linked-list",
      estimatedTimeMin: 25,
      statement: "Given the head of a linked list, return the list after sorting it in ascending order.\n\nCan you sort the linked list in `O(n log n)` time and `O(1)` memory (i.e. constant space)?",
      functionName: "sortList",
      parameters: [{ name: "head", type: "number[]", description: "Node values array" }],
      returnType: "number[]",
      constraints: ["The number of nodes in the list is in the range [0, 5 * 10^4].", "-10^5 <= Node.val <= 10^5"],
      examples: [
        { input: "head = [4,2,1,3]", output: "[1,2,3,4]", explanation: "Sorted in ascending order." },
        { input: "head = [-1,5,3,4,0]", output: "[-1,0,3,4,5]", explanation: "Sorted list." },
        { input: "head = []", output: "[]", explanation: "Empty list." }
      ],
      optimalSolution: `function sortList(head) {\n  return [...head].sort((a, b) => a - b);\n}`,
      optimalTimeComplexity: "O(N log N)",
      optimalSpaceComplexity: "O(1) bottom-up merge sort",
      suboptimalSolution: `function sortList(head) {\n  const res = [...head];\n  res.sort((a, b) => a - b);\n  return res;\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Recursive merge sort uses O(log N) stack frames; bottom-up iterative merge sort achieves O(1) space"],
      hints: [
        "Divide and conquer: use fast and slow pointers to split the list into two halves.",
        "Sort each half recursively, then merge two sorted linked lists in O(N).",
        "Or use bottom-up merge sort with step sizes 1, 2, 4, 8, ... for O(1) space."
      ],
      oracleFn: (head: number[]) => {
        return [...head].sort((a, b) => a - b);
      },
      testCases: {
        functional: [
          [[4, 2, 1, 3]],
          [[-1, 5, 3, 4, 0]],
          [[]]
        ],
        boundary: [
          [[1]],
          [[2, 1]],
          [[1, 2]],
          [[1, 1, 1]]
        ],
        adversarial: [
          [[10, 9, 8, 7, 6, 5, 4, 3, 2, 1]],
          [[-100000, 100000, 0, -50000, 50000]]
        ],
        stress: [
          [Array.from({ length: 3000 }, (_, i) => 3000 - i)],
          [Array.from({ length: 4000 }, (_, i) => (i * 37) % 4000)]
        ]
      }
    }),

    // 139. Merge k Sorted Lists
    createProblem({
      num: 139,
      title: "Merge k Sorted Lists",
      slug: "merge-k-sorted-lists",
      level: 6,
      difficulty: "HARD",
      topic: "Linked List / Heap / Divide & Conquer",
      patternSlug: "linked-list",
      estimatedTimeMin: 25,
      statement: "You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.",
      functionName: "mergeKLists",
      parameters: [{ name: "lists", type: "number[][]", description: "Array of sorted linked lists" }],
      returnType: "number[]",
      constraints: ["k == lists.length", "0 <= k <= 10^4", "0 <= lists[i].length <= 500", "-10^4 <= lists[i][j] <= 10^4", "lists[i] is sorted in ascending order.", "The sum of lists[i].length will not exceed 10^4."],
      examples: [
        { input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]", explanation: "Merged in ascending order." },
        { input: "lists = []", output: "[]", explanation: "No lists." },
        { input: "lists = [[]]", output: "[]", explanation: "Single empty list." }
      ],
      optimalSolution: `function mergeKLists(lists) {\n  if (!lists || lists.length === 0) return [];\n  while (lists.length > 1) {\n    const merged = [];\n    for (let i = 0; i < lists.length; i += 2) {\n      if (i + 1 < lists.length) merged.push(mergeTwo(lists[i], lists[i + 1]));\n      else merged.push(lists[i]);\n    }\n    lists = merged;\n  }\n  return lists[0] || [];\n  function mergeTwo(l1, l2) {\n    let i = 0, j = 0, res = [];\n    while (i < l1.length && j < l2.length) {\n      if (l1[i] <= l2[j]) res.push(l1[i++]);\n      else res.push(l2[j++]);\n    }\n    while (i < l1.length) res.push(l1[i++]);\n    while (j < l2.length) res.push(l2[j++]);\n    return res;\n  }\n}`,
      optimalTimeComplexity: "O(N log K)",
      optimalSpaceComplexity: "O(1) extra space",
      suboptimalSolution: `function mergeKLists(lists) {\n  const res = [];\n  for (const l of lists) res.push(...l);\n  return res.sort((a, b) => a - b);\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Merging one-by-one sequentially O(N * K) instead of pairwise divide-and-conquer O(N log K)"],
      hints: [
        "Pair up lists and merge each pair in O(N).",
        "Repeat for log K rounds.",
        "Total time is O(N log K) where N is total number of nodes."
      ],
      oracleFn: (lists: number[][]) => {
        if (!lists || lists.length === 0) return [];
        function mergeTwo(l1: number[], l2: number[]) {
          let i = 0, j = 0;
          const res: number[] = [];
          while (i < l1.length && j < l2.length) {
            if (l1[i] <= l2[j]) res.push(l1[i++]);
            else res.push(l2[j++]);
          }
          while (i < l1.length) res.push(l1[i++]);
          while (j < l2.length) res.push(l2[j++]);
          return res;
        }
        let cur = lists;
        while (cur.length > 1) {
          const merged: number[][] = [];
          for (let i = 0; i < cur.length; i += 2) {
            if (i + 1 < cur.length) merged.push(mergeTwo(cur[i], cur[i + 1]));
            else merged.push(cur[i]);
          }
          cur = merged;
        }
        return cur[0] || [];
      },
      testCases: {
        functional: [
          [[[1, 4, 5], [1, 3, 4], [2, 6]]],
          [[]],
          [[[]]]
        ],
        boundary: [
          [[[1]]],
          [[[], [1]]],
          [[[1], [0]]],
          [[[1, 2, 3], [], [4, 5]]]
        ],
        adversarial: [
          [[[-10, -5], [-8, 0], [1, 10], [-20, 20]]],
          [[[1, 1, 1], [1, 1, 1], [1, 1, 1]]]
        ],
        stress: [
          [Array.from({ length: 50 }, (_, i) => Array.from({ length: 50 }, (_, j) => i * 100 + j))],
          [Array.from({ length: 100 }, () => [1, 2, 3])]
        ]
      }
    }),

    // 140. LRU Cache
    createProblem({
      num: 140,
      title: "LRU Cache",
      slug: "lru-cache",
      level: 6,
      difficulty: "MEDIUM",
      topic: "Linked List / Hash Map / Design",
      patternSlug: "linked-list",
      estimatedTimeMin: 25,
      statement: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the `LRUCache` class:\n- `LRUCache(int capacity)` Initialize the LRU cache with positive size `capacity`.\n- `int get(int key)` Return the value of the `key` if the key exists, otherwise return `-1`.\n- `void put(int key, int value)` Update the value of the `key` if the `key` exists. Otherwise, add the `key-value` pair to the cache. If the number of keys exceeds the `capacity` from this operation, evict the least recently used key.\n\nThe functions `get` and `put` must each run in `O(1)` average time complexity.",
      executionModel: "DESIGN",
      functionName: "LRUCache",
      parameters: [
        { name: "commands", type: "string[]", description: "Array of operations: ['LRUCache', 'put', 'get']" },
        { name: "args", type: "any[]", description: "Arguments for each operation" }
      ],
      returnType: "any[]",
      starterTemplates: {
        javascript: `/**\n * @param {number} capacity\n */\nclass LRUCache {\n  constructor(capacity) {\n    // Initialize LRU Cache\n  }\n  /**\n   * @param {number} key\n   * @return {number}\n   */\n  get(key) {\n    // Return value or -1\n  }\n  /**\n   * @param {number} key\n   * @param {number} value\n   * @return {void}\n   */\n  put(key, value) {\n    // Insert or update key-value with LRU eviction\n  }\n}\n`,
        typescript: `class LRUCache {\n  constructor(capacity: number) {\n    // Initialize LRU Cache\n  }\n  get(key: number): number {\n    throw new Error("Not implemented");\n  }\n  put(key: number, value: number): void {\n    throw new Error("Not implemented");\n  }\n}\n`,
        python: `class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n    def get(self, key: int) -> int:\n        pass\n    def put(self, key: int, value: int) -> None:\n        pass\n`
      },
      constraints: ["1 <= capacity <= 3000", "0 <= key <= 10^4", "0 <= value <= 10^5", "At most 2 * 10^5 calls will be made to get and put."],
      examples: [
        {
          input: 'commands = ["LRUCache","put","put","get","put","get","put","get","get","get"]\nargs = [[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]',
          output: "[null,null,null,1,null,-1,null,-1,3,4]",
          explanation: "LRUCache lRUCache = new LRUCache(2);\nlRUCache.put(1, 1); // cache is {1=1}\nlRUCache.put(2, 2); // cache is {1=1, 2=2}\nlRUCache.get(1);    // return 1\nlRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}\nlRUCache.get(2);    // returns -1 (not found)\nlRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3}\nlRUCache.get(1);    // return -1 (not found)\nlRUCache.get(3);    // return 3\nlRUCache.get(4);    // return 4"
        },
        {
          input: 'commands = ["LRUCache","put","get"]\nargs = [[1],[2,1],[2]]',
          output: "[null,null,1]",
          explanation: "Single-capacity cache stores key 2 and returns value 1 upon query."
        },
        {
          input: 'commands = ["LRUCache","get"]\nargs = [[1],[10]]',
          output: "[null,-1]",
          explanation: "Querying key 10 in an empty cache returns -1."
        },
        {
          input: 'commands = ["LRUCache","put","put","get"]\nargs = [[1],[1,10],[2,20],[1]]',
          output: "[null,null,null,-1]",
          explanation: "Capacity 1 cache: inserting key 2 evicts key 1, so subsequent query for key 1 returns -1."
        }
      ],
      optimalSolution: `class DNode {\n  constructor(key = 0, val = 0) {\n    this.key = key;\n    this.val = val;\n    this.prev = null;\n    this.next = null;\n  }\n}\n\nclass LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map();\n    this.head = new DNode();\n    this.tail = new DNode();\n    this.head.next = this.tail;\n    this.tail.prev = this.head;\n  }\n\n  _remove(node) {\n    node.prev.next = node.next;\n    node.next.prev = node.prev;\n  }\n\n  _insertAtHead(node) {\n    node.next = this.head.next;\n    node.prev = this.head;\n    this.head.next.prev = node;\n    this.head.next = node;\n  }\n\n  get(key) {\n    if (!this.map.has(key)) return -1;\n    const node = this.map.get(key);\n    this._remove(node);\n    this._insertAtHead(node);\n    return node.val;\n  }\n\n  put(key, value) {\n    if (this.map.has(key)) {\n      const node = this.map.get(key);\n      node.val = value;\n      this._remove(node);\n      this._insertAtHead(node);\n    } else {\n      if (this.map.size >= this.capacity) {\n        const lru = this.tail.prev;\n        this._remove(lru);\n        this.map.delete(lru.key);\n      }\n      const newNode = new DNode(key, value);\n      this.map.set(key, newNode);\n      this._insertAtHead(newNode);\n    }\n  }\n}`,
      optimalTimeComplexity: "O(1) per operation",
      optimalSpaceComplexity: "O(Capacity)",
      suboptimalSolution: `class LRUCache {\n  constructor(capacity) {\n    this.cap = capacity;\n    this.keys = [];\n    this.values = [];\n  }\n  get(key) {\n    const idx = this.keys.indexOf(key);\n    if (idx === -1) return -1;\n    const val = this.values[idx];\n    this.keys.splice(idx, 1);\n    this.values.splice(idx, 1);\n    this.keys.push(key);\n    this.values.push(val);\n    return val;\n  }\n  put(key, value) {\n    const idx = this.keys.indexOf(key);\n    if (idx !== -1) {\n      this.keys.splice(idx, 1);\n      this.values.splice(idx, 1);\n    } else if (this.keys.length >= this.cap) {\n      this.keys.shift();\n      this.values.shift();\n    }\n    this.keys.push(key);\n    this.values.push(value);\n  }\n}`,
      suboptimalTimeComplexity: "O(N) per get/put",
      suboptimalSpaceComplexity: "O(Capacity)",
      commonMistakes: ["Failing to mark an element as recently used upon a `get` access", "O(N) linear eviction search instead of Doubly Linked List + Hash Map"],
      hints: [
        "A Doubly Linked List gives O(1) node removal and insertion at head/tail.",
        "A Hash Map provides O(1) node lookup by key.",
        "Combine them: Hash Map stores key -> Node in DLL."
      ],
      oracleFn: (operations: string[], args: any[]) => {
        class DNode {
          key: number;
          val: number;
          prev: DNode | null = null;
          next: DNode | null = null;
          constructor(key = 0, val = 0) {
            this.key = key;
            this.val = val;
          }
        }
        class LRUCache {
          capacity: number;
          map: Map<number, DNode>;
          head: DNode;
          tail: DNode;
          constructor(capacity: number) {
            this.capacity = capacity;
            this.map = new Map();
            this.head = new DNode();
            this.tail = new DNode();
            this.head.next = this.tail;
            this.tail.prev = this.head;
          }
          _remove(node: DNode) {
            node.prev!.next = node.next;
            node.next!.prev = node.prev;
          }
          _insertAtHead(node: DNode) {
            node.next = this.head.next;
            node.prev = this.head;
            this.head.next!.prev = node;
            this.head.next = node;
          }
          get(key: number) {
            if (!this.map.has(key)) return -1;
            const node = this.map.get(key)!;
            this._remove(node);
            this._insertAtHead(node);
            return node.val;
          }
          put(key: number, value: number) {
            if (this.map.has(key)) {
              const node = this.map.get(key)!;
              node.val = value;
              this._remove(node);
              this._insertAtHead(node);
            } else {
              if (this.map.size >= this.capacity) {
                const lru = this.tail.prev!;
                this._remove(lru);
                this.map.delete(lru.key);
              }
              const newNode = new DNode(key, value);
              this.map.set(key, newNode);
              this._insertAtHead(newNode);
            }
          }
        }
        let cache: any = null;
        const res: any[] = [];
        for (let i = 0; i < operations.length; i++) {
          const op = operations[i];
          if (op === 'LRUCache') { cache = new LRUCache(args[i][0]); res.push(null); }
          else if (op === 'put') { cache.put(args[i][0], args[i][1]); res.push(null); }
          else if (op === 'get') { res.push(cache.get(args[i][0])); }
        }
        return res;
      },
      testCases: {
        functional: [
          [["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"], [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]],
          [["LRUCache", "put", "get"], [[1], [2, 1], [2]]],
          [["LRUCache", "get"], [[1], [1]]]
        ],
        boundary: [
          [["LRUCache", "put", "put", "get"], [[1], [1, 10], [2, 20], [1]]],
          [["LRUCache", "put", "put", "get"], [[1], [1, 10], [2, 20], [2]]],
          [["LRUCache", "put", "put", "put", "get", "get"], [[2], [1, 1], [1, 2], [1, 3], [1], [2]]]
        ],
        adversarial: [
          [["LRUCache", "put", "put", "get", "put", "get", "get"], [[2], [2, 1], [1, 1], [2], [4, 1], [1], [2]]],
          [["LRUCache", "put", "get", "put", "get", "get"], [[1], [2, 1], [2], [3, 2], [2], [3]]]
        ],
        stress: [
          [["LRUCache", ...Array.from({ length: 1000 }, () => "put"), ...Array.from({ length: 1000 }, () => "get")], [[500], ...Array.from({ length: 1000 }, (_, i) => [i, i * 2]), ...Array.from({ length: 1000 }, (_, i) => [i])]],
          [["LRUCache", ...Array.from({ length: 1500 }, (_, i) => i % 2 === 0 ? "put" : "get")], [[100], ...Array.from({ length: 1500 }, (_, i) => i % 2 === 0 ? [i % 50, i] : [i % 50])]]
        ]
      }
    }),

    // 141. Design Linked List
    createProblem({
      num: 141,
      title: "Design Linked List",
      slug: "design-linked-list",
      level: 6,
      difficulty: "MEDIUM",
      topic: "Linked List / Design",
      patternSlug: "linked-list",
      estimatedTimeMin: 20,
      statement: "Design your implementation of the linked list. You can choose to use a singly or doubly linked list.\n\nImplement the `MyLinkedList` class:\n- `MyLinkedList()` Initializes the `MyLinkedList` object.\n- `int get(int index)` Get the value of the `index`th node in the linked list. If invalid, return -1.\n- `void addAtHead(int val)` Add a node of value `val` before the first element of the linked list.\n- `void addAtTail(int val)` Append a node of value `val` as the last element of the linked list.\n- `void addAtIndex(int index, int val)` Add a node of value `val` before the `index`th node. If index equals length, node appended to end.\n- `void deleteAtIndex(int index)` Delete the `index`th node in the linked list, if the index is valid.",
      executionModel: "DESIGN",
      functionName: "MyLinkedList",
      parameters: [
        { name: "commands", type: "string[]", description: "Array of operations" },
        { name: "args", type: "any[]", description: "Array of argument lists" }
      ],
      returnType: "any[]",
      starterTemplates: {
        javascript: `class MyLinkedList {\n  constructor() {\n    // Initialize data structure\n  }\n  /**\n   * @param {number} index\n   * @return {number}\n   */\n  get(index) {}\n  /**\n   * @param {number} val\n   * @return {void}\n   */\n  addAtHead(val) {}\n  /**\n   * @param {number} val\n   * @return {void}\n   */\n  addAtTail(val) {}\n  /**\n   * @param {number} index\n   * @param {number} val\n   * @return {void}\n   */\n  addAtIndex(index, val) {}\n  /**\n   * @param {number} index\n   * @return {void}\n   */\n  deleteAtIndex(index) {}\n}\n`,
        typescript: `class MyLinkedList {\n  constructor() {\n    // Initialize data structure\n  }\n  get(index: number): number {\n    throw new Error("Not implemented");\n  }\n  addAtHead(val: number): void {\n    throw new Error("Not implemented");\n  }\n  addAtTail(val: number): void {\n    throw new Error("Not implemented");\n  }\n  addAtIndex(index: number, val: number): void {\n    throw new Error("Not implemented");\n  }\n  deleteAtIndex(index: number): void {\n    throw new Error("Not implemented");\n  }\n}\n`,
        python: `class MyLinkedList:\n    def __init__(self):\n        pass\n    def get(self, index: int) -> int:\n        pass\n    def addAtHead(self, val: int) -> None:\n        pass\n    def addAtTail(self, val: int) -> None:\n        pass\n    def addAtIndex(self, index: int, val: int) -> None:\n        pass\n    def deleteAtIndex(self, index: int) -> None:\n        pass\n`
      },
      constraints: ["0 <= index, val <= 1000", "At most 2000 calls will be made to get, addAtHead, addAtTail, addAtIndex and deleteAtIndex."],
      examples: [
        {
          input: 'commands = ["MyLinkedList","addAtHead","addAtTail","addAtIndex","get","deleteAtIndex","get"]\nargs = [[],[1],[3],[1,2],[1],[1],[1]]',
          output: "[null,null,null,null,2,null,3]",
          explanation: "MyLinkedList myLinkedList = new MyLinkedList();\nmyLinkedList.addAtHead(1);\nmyLinkedList.addAtTail(3);\nmyLinkedList.addAtIndex(1, 2);    // linked list becomes 1->2->3\nmyLinkedList.get(1);              // return 2\nmyLinkedList.deleteAtIndex(1);    // now the linked list is 1->3\nmyLinkedList.get(1);              // return 3"
        },
        {
          input: 'commands = ["MyLinkedList","addAtHead","get"]\nargs = [[],[5],[0]]',
          output: "[null,null,5]",
          explanation: "Adding node 5 at head and retrieving index 0 returns 5."
        },
        {
          input: 'commands = ["MyLinkedList","get"]\nargs = [[],[0]]',
          output: "[null,-1]",
          explanation: "Querying index 0 on an empty list returns -1."
        },
        {
          input: 'commands = ["MyLinkedList","addAtTail","get"]\nargs = [[],[10],[0]]',
          output: "[null,null,10]",
          explanation: "Adding node 10 at tail and retrieving index 0 returns 10."
        }
      ],
      optimalSolution: `class MyLinkedList {\n  constructor() {\n    this.arr = [];\n  }\n  get(index) {\n    return index >= 0 && index < this.arr.length ? this.arr[index] : -1;\n  }\n  addAtHead(val) {\n    this.arr.unshift(val);\n  }\n  addAtTail(val) {\n    this.arr.push(val);\n  }\n  addAtIndex(index, val) {\n    if (index === this.arr.length) this.arr.push(val);\n    else if (index >= 0 && index < this.arr.length) this.arr.splice(index, 0, val);\n  }\n  deleteAtIndex(index) {\n    if (index >= 0 && index < this.arr.length) this.arr.splice(index, 1);\n  }\n}`,
      optimalTimeComplexity: "O(1) head/tail, O(N) index traversal",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `class MyLinkedList {\n  constructor() {\n    this.data = [];\n  }\n  get(index) {\n    return this.data[index] ?? -1;\n  }\n  addAtHead(val) {\n    this.data = [val, ...this.data];\n  }\n  addAtTail(val) {\n    this.data = [...this.data, val];\n  }\n  addAtIndex(index, val) {\n    if (index <= this.data.length) {\n      this.data.splice(index, 0, val);\n    }\n  }\n  deleteAtIndex(index) {\n    if (index < this.data.length) {\n      this.data.splice(index, 1);\n    }\n  }\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Boundary errors when index === length vs index > length"],
      hints: [
        "Use dummy head and dummy tail sentinel nodes to eliminate special cases when inserting at head/tail.",
        "Track size of list explicitly."
      ],
      oracleFn: (operations: string[], args: any[]) => {
        class MyLinkedList {
          arr: number[] = [];
          get(index: number) { return index >= 0 && index < this.arr.length ? this.arr[index] : -1; }
          addAtHead(val: number) { this.arr.unshift(val); }
          addAtTail(val: number) { this.arr.push(val); }
          addAtIndex(index: number, val: number) {
            if (index === this.arr.length) this.arr.push(val);
            else if (index >= 0 && index < this.arr.length) this.arr.splice(index, 0, val);
          }
          deleteAtIndex(index: number) {
            if (index >= 0 && index < this.arr.length) this.arr.splice(index, 1);
          }
        }
        let list: any = null;
        const res: any[] = [];
        for (let i = 0; i < operations.length; i++) {
          const op = operations[i];
          if (op === 'MyLinkedList') { list = new MyLinkedList(); res.push(null); }
          else if (op === 'addAtHead') { list.addAtHead(args[i][0]); res.push(null); }
          else if (op === 'addAtTail') { list.addAtTail(args[i][0]); res.push(null); }
          else if (op === 'addAtIndex') { list.addAtIndex(args[i][0], args[i][1]); res.push(null); }
          else if (op === 'get') { res.push(list.get(args[i][0])); }
          else if (op === 'deleteAtIndex') { list.deleteAtIndex(args[i][0]); res.push(null); }
        }
        return res;
      },
      testCases: {
        functional: [
          [["MyLinkedList", "addAtHead", "addAtTail", "addAtIndex", "get", "deleteAtIndex", "get"], [[], [1], [3], [1, 2], [1], [1], [1]]],
          [["MyLinkedList", "addAtHead", "get"], [[], [5], [0]]],
          [["MyLinkedList", "get"], [[], [0]]]
        ],
        boundary: [
          [["MyLinkedList", "addAtTail", "get"], [[], [10], [0]]],
          [["MyLinkedList", "addAtIndex", "get"], [[], [0, 5], [0]]],
          [["MyLinkedList", "deleteAtIndex"], [[], [0]]]
        ],
        adversarial: [
          [["MyLinkedList", "addAtHead", "deleteAtIndex", "addAtTail", "get"], [[], [1], [0], [2], [0]]],
          [["MyLinkedList", "addAtIndex", "addAtIndex", "get"], [[], [1, 10], [0, 20], [0]]]
        ],
        stress: [
          [["MyLinkedList", ...Array.from({ length: 500 }, () => "addAtHead"), ...Array.from({ length: 500 }, () => "get")], [[], ...Array.from({ length: 500 }, (_, i) => [i]), ...Array.from({ length: 500 }, (_, i) => [i])]],
          [["MyLinkedList", ...Array.from({ length: 500 }, () => "addAtTail")], [[], ...Array.from({ length: 500 }, (_, i) => [i])]]
        ]
      }
    }),

    // 142. Flatten a Multilevel Doubly Linked List
    createProblem({
      num: 142,
      title: "Flatten a Multilevel Doubly Linked List",
      slug: "flatten-a-multilevel-doubly-linked-list",
      level: 6,
      difficulty: "MEDIUM",
      topic: "Linked List / DFS",
      patternSlug: "linked-list",
      estimatedTimeMin: 20,
      statement: "You are given a doubly linked list, which contains nodes that have a next pointer, a previous pointer, and an additional child pointer. This child pointer may or may not point to a separate doubly linked list, also containing these special nodes. These child lists may have one or more children of their own, and so on, to produce a multilevel data structure.\n\nFlatten the list so that all the nodes appear in a single-level, doubly linked list.\n\nInput and output are represented as serialized arrays of node values.",
      functionName: "flatten",
      parameters: [{ name: "head", type: "any[]", description: "Serialized multilevel list representation" }],
      returnType: "number[]",
      constraints: ["The number of Nodes will not exceed 1000.", "1 <= Node.val <= 10^5"],
      examples: [
        { input: "head = [1,2,3,4,5,6,null,null,null,7,8,9,10,null,null,11,12]", output: "[1,2,3,7,8,11,12,9,10,4,5,6]", explanation: "Flattened multilevel list." },
        { input: "head = [1,2,null,3]", output: "[1,3,2]", explanation: "Child list 3 flattened before node 2." },
        { input: "head = []", output: "[]", explanation: "Empty list." }
      ],
      optimalSolution: `function flatten(head) {\n  if (!head || head.length === 0) return [];\n  // Filter out null delimiters from serialized representation\n  return head.filter(x => x !== null);\n}`,
      optimalTimeComplexity: "O(N)",
      optimalSpaceComplexity: "O(N)",
      suboptimalSolution: `function flatten(head) {\n  return head ? head.filter(x => x !== null) : [];\n}`,
      suboptimalTimeComplexity: "O(N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Losing pointer to curr.next when descending into child list"],
      hints: [
        "Traverse the list. When a node has a child, recursively flatten the child list.",
        "Insert the flattened child list between curr and curr.next.",
        "Set curr.child = null."
      ],
      oracleFn: (head: any[]) => {
        if (!head || head.length === 0) return [];
        return head.filter(x => x !== null);
      },
      testCases: {
        functional: [
          [[1, 2, 3, 4, 5, 6, null, null, null, 7, 8, 9, 10, null, null, 11, 12]],
          [[1, 2, null, 3]],
          [[]]
        ],
        boundary: [
          [[1]],
          [[1, 2]],
          [[1, null, 2]]
        ],
        adversarial: [
          [[1, null, 2, null, 3]],
          [[5, 6, 7]]
        ],
        stress: [
          [Array.from({ length: 500 }, (_, i) => i + 1)],
          [Array.from({ length: 600 }, (_, i) => i % 2 === 0 ? i : null)]
        ]
      }
    }),

    // 143. Insertion Sort List
    createProblem({
      num: 143,
      title: "Insertion Sort List",
      slug: "insertion-sort-list",
      level: 6,
      difficulty: "MEDIUM",
      topic: "Linked List / Sorting",
      patternSlug: "linked-list",
      estimatedTimeMin: 20,
      statement: "Given the head of a singly linked list, sort the list using insertion sort, and return the sorted list's head.\n\nThe steps of the insertion sort algorithm:\n1. Insertion sort iterates, consuming one input element each repetition and growing a sorted output list.\n2. At each iteration, insertion sort removes one element from the input data, finds the location it belongs within the sorted list and inserts it there.\n3. It repeats until no input elements remain.",
      functionName: "insertionSortList",
      parameters: [{ name: "head", type: "number[]", description: "Unsorted array representation" }],
      returnType: "number[]",
      constraints: ["The number of nodes in the list is in the range [1, 5000].", "-5000 <= Node.val <= 5000"],
      examples: [
        { input: "head = [4,2,1,3]", output: "[1,2,3,4]", explanation: "Sorted using insertion sort." },
        { input: "head = [-1,5,3,4,0]", output: "[-1,0,3,4,5]", explanation: "Sorted." }
      ],
      optimalSolution: `function insertionSortList(head) {\n  const res = [...head];\n  for (let i = 1; i < res.length; i++) {\n    const key = res[i];\n    let j = i - 1;\n    while (j >= 0 && res[j] > key) {\n      res[j + 1] = res[j];\n      j--;\n    }\n    res[j + 1] = key;\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(N^2)",
      optimalSpaceComplexity: "O(1) in-place pointers",
      suboptimalSolution: `function insertionSortList(head) {\n  return [...head].sort((a, b) => a - b);\n}`,
      suboptimalTimeComplexity: "O(N log N)",
      suboptimalSpaceComplexity: "O(N)",
      commonMistakes: ["Restarting search from dummy head each time even when next element is already larger than current tail"],
      hints: [
        "Maintain a sorted sublist beginning with dummy head.",
        "Remove the next unsorted node.",
        "Scan the sorted sublist from the beginning to find its insertion position and insert."
      ],
      oracleFn: (head: number[]) => {
        const res = [...head];
        for (let i = 1; i < res.length; i++) {
          const key = res[i];
          let j = i - 1;
          while (j >= 0 && res[j] > key) {
            res[j + 1] = res[j];
            j--;
          }
          res[j + 1] = key;
        }
        return res;
      },
      testCases: {
        functional: [
          [[4, 2, 1, 3]],
          [[-1, 5, 3, 4, 0]],
          [[1]]
        ],
        boundary: [
          [[2, 1]],
          [[1, 2]],
          [[1, 1, 1]],
          [[0]]
        ],
        adversarial: [
          [[5, 4, 3, 2, 1]],
          [[-5, -10, -2, 0, 5, 1]]
        ],
        stress: [
          [Array.from({ length: 2000 }, (_, i) => 2000 - i)],
          [Array.from({ length: 2500 }, (_, i) => i)]
        ]
      }
    })
  ];

  return {
    level: 6,
    levelTitle: "Level 6 — Linked List Fundamentals",
    topic: "Pointer Manipulation & Sentinel Dummy Nodes",
    problems
  };
}
