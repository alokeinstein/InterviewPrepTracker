import { LevelPayload, GeneratedProblem } from './types';
import { createProblem } from './problemBuilder';

export function getLevel13Payload(): LevelPayload {
  const problems: GeneratedProblem[] = [
    // 282. Set Matrix Zeroes
    createProblem({
      num: 282,
      title: "Set Matrix Zeroes",
      slug: "set-matrix-zeroes",
      level: 13,
      difficulty: "MEDIUM",
      topic: "Matrix",
      patternSlug: "matrix-grid",
      estimatedTimeMin: 20,
      statement: "Given an `m x n` integer matrix `matrix`, if an element is `0`, set its entire row and column to `0`'s.\n\nYou must do it in place and return the modified matrix.",
      functionName: "setZeroes",
      parameters: [{ name: "matrix", type: "number[][]", description: "The 2D integer matrix" }],
      returnType: "number[][]",
      constraints: ["m == matrix.length", "n == matrix[0].length", "1 <= m, n <= 200", "-2^31 <= matrix[i][j] <= 2^31 - 1"],
      examples: [
        { input: "matrix = [[1,1,1],[1,0,1],[1,1,1]]", output: "[[1,0,1],[0,0,0],[1,0,1]]", explanation: "The 0 in the center clears row 1 and column 1." },
        { input: "matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]", output: "[[0,0,0,0],[0,4,5,0],[0,3,1,0]]", explanation: "Zeros at (0,0) and (0,3) clear row 0, col 0, and col 3." },
        { input: "matrix = [[1]]", output: "[[1]]", explanation: "No zeros present, matrix unchanged." },
        { input: "matrix = [[0]]", output: "[[0]]", explanation: "Single cell with zero remains zero." }
      ],
      optimalSolution: `function setZeroes(matrix) {\n  const m = matrix.length;\n  const n = matrix[0].length;\n  let firstRowHasZero = false;\n  let firstColHasZero = false;\n  for (let c = 0; c < n; c++) {\n    if (matrix[0][c] === 0) firstRowHasZero = true;\n  }\n  for (let r = 0; r < m; r++) {\n    if (matrix[r][0] === 0) firstColHasZero = true;\n  }\n  for (let r = 1; r < m; r++) {\n    for (let c = 1; c < n; c++) {\n      if (matrix[r][c] === 0) {\n        matrix[r][0] = 0;\n        matrix[0][c] = 0;\n      }\n    }\n  }\n  for (let r = 1; r < m; r++) {\n    for (let c = 1; c < n; c++) {\n      if (matrix[r][0] === 0 || matrix[0][c] === 0) {\n        matrix[r][c] = 0;\n      }\n    }\n  }\n  if (firstRowHasZero) {\n    for (let c = 0; c < n; c++) matrix[0][c] = 0;\n  }\n  if (firstColHasZero) {\n    for (let r = 0; r < m; r++) matrix[r][0] = 0;\n  }\n  return matrix;\n}`,
      optimalTimeComplexity: "O(m * n)",
      optimalSpaceComplexity: "O(1) in-place",
      suboptimalSolution: `function setZeroes(matrix) {\n  const m = matrix.length, n = matrix[0].length;\n  const rows = new Set(), cols = new Set();\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (matrix[r][c] === 0) {\n        rows.add(r);\n        cols.add(c);\n      }\n    }\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (rows.has(r) || cols.has(c)) matrix[r][c] = 0;\n    }\n  }\n  return matrix;\n}`,
      suboptimalTimeComplexity: "O(m * n)",
      suboptimalSpaceComplexity: "O(m + n)",
      commonMistakes: ["Setting rows and columns to zero immediately during the first traversal, which creates false zeros.", "Failing to handle the first row and column flags separately."],
      hints: [
        "Can you use the first row and first column as markers?",
        "Use two separate boolean flags for whether row 0 and col 0 themselves contain zero.",
        "Update the inner matrix first, then update row 0 and col 0 using the flags."
      ],
      oracleFn: (matrix: number[][]) => {
        const mat = matrix.map(row => [...row]);
        const m = mat.length;
        const n = mat[0].length;
        let firstRow = false, firstCol = false;
        for (let c = 0; c < n; c++) if (mat[0][c] === 0) firstRow = true;
        for (let r = 0; r < m; r++) if (mat[r][0] === 0) firstCol = true;
        for (let r = 1; r < m; r++) {
          for (let c = 1; c < n; c++) {
            if (mat[r][c] === 0) {
              mat[r][0] = 0;
              mat[0][c] = 0;
            }
          }
        }
        for (let r = 1; r < m; r++) {
          for (let c = 1; c < n; c++) {
            if (mat[r][0] === 0 || mat[0][c] === 0) mat[r][c] = 0;
          }
        }
        if (firstRow) for (let c = 0; c < n; c++) mat[0][c] = 0;
        if (firstCol) for (let r = 0; r < m; r++) mat[r][0] = 0;
        return mat;
      },
      testCases: {
        functional: [
          [[[1, 1, 1], [1, 0, 1], [1, 1, 1]]],
          [[[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]],
          [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]],
          [[[0, 0], [0, 0]]]
        ],
        boundary: [
          [[[1]]],
          [[[0]]],
          [[[1, 0, 1]]],
          [[[1], [0], [1]]]
        ],
        adversarial: [
          [[[1, 2, 0, 4], [5, 6, 7, 8], [0, 10, 11, 12]]],
          [[[0, 1], [1, 1]]]
        ],
        stress: [
          [Array.from({ length: 30 }, (_, r) => Array.from({ length: 30 }, (_, c) => (r === 15 && c === 15 ? 0 : r + c + 1)))],
          [Array.from({ length: 40 }, () => Array.from({ length: 40 }, () => 1))]
        ]
      }
    }),

    // 283. Spiral Matrix
    createProblem({
      num: 283,
      title: "Spiral Matrix",
      slug: "spiral-matrix",
      level: 13,
      difficulty: "MEDIUM",
      topic: "Matrix",
      patternSlug: "matrix-grid",
      estimatedTimeMin: 20,
      statement: "Given an `m x n` `matrix`, return all elements of the `matrix` in spiral order (clockwise starting from the top-left corner).",
      functionName: "spiralOrder",
      parameters: [{ name: "matrix", type: "number[][]", description: "2D integer matrix" }],
      returnType: "number[]",
      constraints: ["m == matrix.length", "n == matrix[i].length", "1 <= m, n <= 10", "-100 <= matrix[i][j] <= 100"],
      examples: [
        { input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", output: "[1,2,3,6,9,8,7,4,5]", explanation: "Follow top row right, right col down, bottom row left, left col up, then center." },
        { input: "matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]", output: "[1,2,3,4,8,12,11,10,9,5,6,7]", explanation: "3x4 matrix spiral traversal." },
        { input: "matrix = [[7]]", output: "[7]", explanation: "Single element matrix." },
        { input: "matrix = [[1,2],[3,4]]", output: "[1,2,4,3]", explanation: "2x2 matrix clockwise order." }
      ],
      optimalSolution: `function spiralOrder(matrix) {\n  if (!matrix || matrix.length === 0) return [];\n  const res = [];\n  let top = 0, bottom = matrix.length - 1;\n  let left = 0, right = matrix[0].length - 1;\n  while (top <= bottom && left <= right) {\n    for (let c = left; c <= right; c++) res.push(matrix[top][c]);\n    top++;\n    for (let r = top; r <= bottom; r++) res.push(matrix[r][right]);\n    right--;\n    if (top <= bottom) {\n      for (let c = right; c >= left; c--) res.push(matrix[bottom][c]);\n      bottom--;\n    }\n    if (left <= right) {\n      for (let r = bottom; r >= top; r--) res.push(matrix[r][left]);\n      left++;\n    }\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(m * n)",
      optimalSpaceComplexity: "O(1) extra space",
      suboptimalSolution: `function spiralOrder(matrix) {\n  if (!matrix || !matrix.length) return [];\n  const m = matrix.length, n = matrix[0].length;\n  const visited = Array.from({ length: m }, () => Array(n).fill(false));\n  const res = [];\n  const dr = [0, 1, 0, -1], dc = [1, 0, -1, 0];\n  let r = 0, c = 0, dir = 0;\n  for (let i = 0; i < m * n; i++) {\n    res.push(matrix[r][c]);\n    visited[r][c] = true;\n    const nr = r + dr[dir], nc = c + dc[dir];\n    if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc]) {\n      r = nr; c = nc;\n    } else {\n      dir = (dir + 1) % 4;\n      r += dr[dir]; c += dc[dir];\n    }\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(m * n)",
      suboptimalSpaceComplexity: "O(m * n) visited array",
      commonMistakes: ["Double counting elements on single row or single column subgrids when top <= bottom check is omitted.", "Index out of bounds on directional turn."],
      hints: [
        "Track 4 boundaries: top, bottom, left, right.",
        "Traverse left-to-right along top, increment top.",
        "Traverse top-to-bottom along right, decrement right.",
        "Before traversing right-to-left along bottom, verify top <= bottom.",
        "Before traversing bottom-to-top along left, verify left <= right."
      ],
      oracleFn: (matrix: number[][]) => {
        if (!matrix || matrix.length === 0) return [];
        const res: number[] = [];
        let top = 0, bottom = matrix.length - 1;
        let left = 0, right = matrix[0].length - 1;
        while (top <= bottom && left <= right) {
          for (let c = left; c <= right; c++) res.push(matrix[top][c]);
          top++;
          for (let r = top; r <= bottom; r++) res.push(matrix[r][right]);
          right--;
          if (top <= bottom) {
            for (let c = right; c >= left; c--) res.push(matrix[bottom][c]);
            bottom--;
          }
          if (left <= right) {
            for (let r = bottom; r >= top; r--) res.push(matrix[r][left]);
            left++;
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]],
          [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]],
          [[[1, 2], [3, 4]]],
          [[[1, 2, 3]]]
        ],
        boundary: [
          [[[42]]],
          [[[1], [2], [3], [4]]],
          [[[1, 2, 3, 4, 5]]],
          [[[1, 2], [3, 4], [5, 6]]]
        ],
        adversarial: [
          [[[1, 2, 3], [8, 9, 4], [7, 6, 5]]],
          [[[10, 20], [40, 30]]]
        ],
        stress: [
          [Array.from({ length: 10 }, (_, r) => Array.from({ length: 10 }, (_, c) => r * 10 + c + 1))],
          [Array.from({ length: 1 }, () => Array.from({ length: 10 }, (_, i) => i + 1))]
        ]
      }
    }),

    // 284. Spiral Matrix II
    createProblem({
      num: 284,
      title: "Spiral Matrix II",
      slug: "spiral-matrix-ii",
      level: 13,
      difficulty: "MEDIUM",
      topic: "Matrix",
      patternSlug: "matrix-grid",
      estimatedTimeMin: 20,
      statement: "Given a positive integer `n`, generate an `n x n` `matrix` filled with elements from `1` to `n^2` in spiral order.",
      functionName: "generateMatrix",
      parameters: [{ name: "n", type: "number", description: "Matrix dimension" }],
      returnType: "number[][]",
      constraints: ["1 <= n <= 20"],
      examples: [
        { input: "n = 3", output: "[[1,2,3],[8,9,4],[7,6,5]]", explanation: "3x3 grid filled 1 through 9 clockwise." },
        { input: "n = 1", output: "[[1]]", explanation: "1x1 grid." },
        { input: "n = 2", output: "[[1,2],[4,3]]", explanation: "2x2 grid." },
        { input: "n = 4", output: "[[1,2,3,4],[12,13,14,5],[11,16,15,6],[10,9,8,7]]", explanation: "4x4 grid." }
      ],
      optimalSolution: `function generateMatrix(n) {\n  const res = Array.from({ length: n }, () => Array(n).fill(0));\n  let top = 0, bottom = n - 1, left = 0, right = n - 1;\n  let val = 1;\n  while (val <= n * n) {\n    for (let c = left; c <= right; c++) res[top][c] = val++;\n    top++;\n    for (let r = top; r <= bottom; r++) res[r][right] = val++;\n    right--;\n    for (let c = right; c >= left; c--) res[bottom][c] = val++;\n    bottom--;\n    for (let r = bottom; r >= top; r--) res[r][left] = val++;\n    left++;\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(n^2)",
      optimalSpaceComplexity: "O(1) extra space beyond result",
      suboptimalSolution: `function generateMatrix(n) {\n  const res = Array.from({ length: n }, () => Array(n).fill(0));\n  let r = 0, c = 0, dir = 0;\n  const dr = [0, 1, 0, -1], dc = [1, 0, -1, 0];\n  for (let val = 1; val <= n * n; val++) {\n    res[r][c] = val;\n    const nr = r + dr[dir], nc = c + dc[dir];\n    if (nr < 0 || nr >= n || nc < 0 || nc >= n || res[nr][nc] !== 0) {\n      dir = (dir + 1) % 4;\n    }\n    r += dr[dir];\n    c += dc[dir];\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(n^2)",
      suboptimalSpaceComplexity: "O(1) extra space",
      commonMistakes: ["Using <= in the boundary checks after incrementing top/left without checking val <= n*n.", "Off-by-one errors in corner coordinate transitions."],
      hints: [
        "Initialize an n x n 2D array with 0.",
        "Set 4 boundary pointers: top = 0, bottom = n-1, left = 0, right = n-1.",
        "Increment counter from 1 to n*n as you fill along boundaries."
      ],
      oracleFn: (n: number) => {
        const res = Array.from({ length: n }, () => Array(n).fill(0));
        let top = 0, bottom = n - 1, left = 0, right = n - 1;
        let val = 1;
        while (val <= n * n) {
          for (let c = left; c <= right; c++) res[top][c] = val++;
          top++;
          for (let r = top; r <= bottom; r++) res[r][right] = val++;
          right--;
          for (let c = right; c >= left; c--) res[bottom][c] = val++;
          bottom--;
          for (let r = bottom; r >= top; r--) res[r][left] = val++;
          left++;
        }
        return res;
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
          [7],
          [8]
        ],
        adversarial: [
          [9],
          [10]
        ],
        stress: [
          [15],
          [20]
        ]
      }
    }),

    // 285. Rotate Image
    createProblem({
      num: 285,
      title: "Rotate Image",
      slug: "rotate-image",
      level: 13,
      difficulty: "MEDIUM",
      topic: "Matrix",
      patternSlug: "matrix-grid",
      estimatedTimeMin: 20,
      statement: "You are given an `n x n` 2D `matrix` representing an image, rotate the image by 90 degrees (clockwise).\n\nYou have to rotate the image in-place and return the rotated matrix.",
      functionName: "rotate",
      parameters: [{ name: "matrix", type: "number[][]", description: "n x n 2D image matrix" }],
      returnType: "number[][]",
      constraints: ["n == matrix.length == matrix[i].length", "1 <= n <= 20", "-1000 <= matrix[i][j] <= 1000"],
      examples: [
        { input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", output: "[[7,4,1],[8,5,2],[9,6,3]]", explanation: "Rotated 90 degrees clockwise." },
        { input: "matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]", output: "[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]", explanation: "4x4 matrix rotation." },
        { input: "matrix = [[1]]", output: "[[1]]", explanation: "Single cell remains unchanged." },
        { input: "matrix = [[1,2],[3,4]]", output: "[[3,1],[4,2]]", explanation: "2x2 rotation." }
      ],
      optimalSolution: `function rotate(matrix) {\n  const n = matrix.length;\n  for (let i = 0; i < n; i++) {\n    for (let j = i + 1; j < n; j++) {\n      const temp = matrix[i][j];\n      matrix[i][j] = matrix[j][i];\n      matrix[j][i] = temp;\n    }\n  }\n  for (let i = 0; i < n; i++) {\n    matrix[i].reverse();\n  }\n  return matrix;\n}`,
      optimalTimeComplexity: "O(n^2)",
      optimalSpaceComplexity: "O(1) in-place",
      suboptimalSolution: `function rotate(matrix) {\n  const n = matrix.length;\n  const copy = matrix.map(row => [...row]);\n  for (let i = 0; i < n; i++) {\n    for (let j = 0; j < n; j++) {\n      matrix[j][n - 1 - i] = copy[i][j];\n    }\n  }\n  return matrix;\n}`,
      suboptimalTimeComplexity: "O(n^2)",
      suboptimalSpaceComplexity: "O(n^2) copy",
      commonMistakes: ["Transposing twice or running inner loop for all j instead of j = i + 1, canceling out the transposition.", "Forgetting to reverse rows after transposition."],
      hints: [
        "A 90 degree clockwise rotation is equivalent to transpose + horizontal flip (reverse each row).",
        "Transpose: swap matrix[i][j] with matrix[j][i] for j > i.",
        "Reverse: for each row, reverse in-place."
      ],
      oracleFn: (matrix: number[][]) => {
        const mat = matrix.map(row => [...row]);
        const n = mat.length;
        for (let i = 0; i < n; i++) {
          for (let j = i + 1; j < n; j++) {
            const temp = mat[i][j];
            mat[i][j] = mat[j][i];
            mat[j][i] = temp;
          }
        }
        for (let i = 0; i < n; i++) mat[i].reverse();
        return mat;
      },
      testCases: {
        functional: [
          [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]],
          [[[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]]],
          [[[1, 2], [3, 4]]],
          [[[1]]]
        ],
        boundary: [
          [[[-1]]],
          [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]],
          [[[0, 0], [0, 0]]],
          [[[1, -1], [-1, 1]]]
        ],
        adversarial: [
          [[[10, 20, 30], [40, 50, 60], [70, 80, 90]]],
          [[[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14, 15], [16, 17, 18, 19, 20], [21, 22, 23, 24, 25]]]
        ],
        stress: [
          [Array.from({ length: 15 }, (_, r) => Array.from({ length: 15 }, (_, c) => r * 15 + c))],
          [Array.from({ length: 20 }, (_, r) => Array.from({ length: 20 }, (_, c) => (r === c ? 1 : 0)))]
        ]
      }
    }),

    // 286. Transpose Matrix
    createProblem({
      num: 286,
      title: "Transpose Matrix",
      slug: "transpose-matrix",
      level: 13,
      difficulty: "EASY",
      topic: "Matrix",
      patternSlug: "matrix-grid",
      estimatedTimeMin: 10,
      statement: "Given a 2D integer array `matrix`, return the transpose of `matrix`.\n\nThe transpose of a matrix is the matrix flipped over its main diagonal, switching the matrix's row and column indices.",
      functionName: "transpose",
      parameters: [{ name: "matrix", type: "number[][]", description: "2D input matrix" }],
      returnType: "number[][]",
      constraints: ["m == matrix.length", "n == matrix[i].length", "1 <= m, n <= 1000", "1 <= m * n <= 10^5", "-10^9 <= matrix[i][j] <= 10^9"],
      examples: [
        { input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", output: "[[1,4,7],[2,5,8],[3,6,9]]", explanation: "Flipped over main diagonal." },
        { input: "matrix = [[1,2,3],[4,5,6]]", output: "[[1,4],[2,5],[3,6]]", explanation: "2x3 matrix transposed to 3x2." },
        { input: "matrix = [[1]]", output: "[[1]]", explanation: "1x1 transpose is identical." },
        { input: "matrix = [[1,2],[3,4],[5,6]]", output: "[[1,3,5],[2,4,6]]", explanation: "3x2 transposed to 2x3." }
      ],
      optimalSolution: `function transpose(matrix) {\n  const m = matrix.length, n = matrix[0].length;\n  const res = Array.from({ length: n }, () => Array(m));\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      res[c][r] = matrix[r][c];\n    }\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(m * n)",
      optimalSpaceComplexity: "O(1) extra space beyond result",
      suboptimalSolution: `function transpose(matrix) {\n  return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));\n}`,
      suboptimalTimeComplexity: "O(m * n)",
      suboptimalSpaceComplexity: "O(m * n)",
      commonMistakes: ["Assuming the matrix is always square (n x n) and attempting in-place swaps on rectangular matrices."],
      hints: [
        "If matrix is m x n, transposed matrix is n x m.",
        "res[c][r] = matrix[r][c] for all r in [0, m-1] and c in [0, n-1]."
      ],
      oracleFn: (matrix: number[][]) => {
        const m = matrix.length, n = matrix[0].length;
        const res = Array.from({ length: n }, () => Array(m));
        for (let r = 0; r < m; r++) {
          for (let c = 0; c < n; c++) {
            res[c][r] = matrix[r][c];
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]],
          [[[1, 2, 3], [4, 5, 6]]],
          [[[1, 2], [3, 4], [5, 6]]],
          [[[1]]]
        ],
        boundary: [
          [[[1, 2, 3, 4]]],
          [[[1], [2], [3], [4]]],
          [[[0, 0], [0, 0]]],
          [[[-5, 10], [20, -30]]]
        ],
        adversarial: [
          [[[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]]],
          [[[1, 4], [2, 5], [3, 6]]]
        ],
        stress: [
          [Array.from({ length: 50 }, (_, r) => Array.from({ length: 20 }, (_, c) => r * 20 + c))],
          [Array.from({ length: 10 }, (_, r) => Array.from({ length: 100 }, (_, c) => r + c))]
        ]
      }
    }),

    // 287. Reshape the Matrix
    createProblem({
      num: 287,
      title: "Reshape the Matrix",
      slug: "reshape-the-matrix",
      level: 13,
      difficulty: "EASY",
      topic: "Matrix",
      patternSlug: "matrix-grid",
      estimatedTimeMin: 15,
      statement: "In MATLAB, there is a handy function called `reshape` which can reshape an `m x n` matrix into a new one with a different size `r x c` keeping its original data.\n\nYou are given an `m x n` matrix `mat` and two integers `r` and `c` representing the number of rows and columns of the wanted reshaped matrix.\n\nThe reshaped matrix should be filled with all the elements of the original matrix in the same row-traversing order as they were.\n\nIf the `reshape` operation with given parameters is possible and legal, output the new reshaped matrix; Otherwise, output the original matrix.",
      functionName: "matrixReshape",
      parameters: [
        { name: "mat", type: "number[][]", description: "Original 2D matrix" },
        { name: "r", type: "number", description: "Target row count" },
        { name: "c", type: "number", description: "Target column count" }
      ],
      returnType: "number[][]",
      constraints: ["m == mat.length", "n == mat[i].length", "1 <= m, n <= 100", "-1000 <= mat[i][j] <= 1000", "1 <= r, c <= 300"],
      examples: [
        { input: "mat = [[1,2],[3,4]], r = 1, c = 4", output: "[[1,2,3,4]]", explanation: "2x2 transformed to 1x4." },
        { input: "mat = [[1,2],[3,4]], r = 2, c = 4", output: "[[1,2],[3,4]]", explanation: "Total elements 4 != 8, reshape invalid, returns original matrix." },
        { input: "mat = [[1,2,3,4]], r = 2, c = 2", output: "[[1,2],[3,4]]", explanation: "1x4 reshaped into 2x2." },
        { input: "mat = [[5]], r = 1, c = 1", output: "[[5]]", explanation: "Same dimension." }
      ],
      optimalSolution: `function matrixReshape(mat, r, c) {\n  const m = mat.length, n = mat[0].length;\n  if (m * n !== r * c) return mat;\n  const res = Array.from({ length: r }, () => Array(c));\n  for (let i = 0; i < m * n; i++) {\n    const origRow = Math.floor(i / n);\n    const origCol = i % n;\n    const newRow = Math.floor(i / c);\n    const newCol = i % c;\n    res[newRow][newCol] = mat[origRow][origCol];\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(m * n)",
      optimalSpaceComplexity: "O(1) extra space beyond result",
      suboptimalSolution: `function matrixReshape(mat, r, c) {\n  const m = mat.length, n = mat[0].length;\n  if (m * n !== r * c) return mat;\n  const flat = mat.flat();\n  const res = [];\n  for (let i = 0; i < r; i++) {\n    res.push(flat.slice(i * c, (i + 1) * c));\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(m * n)",
      suboptimalSpaceComplexity: "O(m * n) flattened array",
      commonMistakes: ["Failing to return the original matrix unchanged when m * n !== r * c.", "Incorrect index division / modulo mapping."],
      hints: [
        "First check if m * n == r * c. If not, return mat.",
        "Map linear index i from 0 to m*n - 1 to (i / n, i % n) in original and (i / c, i % c) in reshaped."
      ],
      oracleFn: (mat: number[][], r: number, c: number) => {
        const m = mat.length, n = mat[0].length;
        if (m * n !== r * c) return mat;
        const res = Array.from({ length: r }, () => Array(c));
        for (let i = 0; i < m * n; i++) {
          res[Math.floor(i / c)][i % c] = mat[Math.floor(i / n)][i % n];
        }
        return res;
      },
      testCases: {
        functional: [
          [[[1, 2], [3, 4]], 1, 4],
          [[[1, 2], [3, 4]], 2, 4],
          [[[1, 2, 3, 4]], 2, 2],
          [[[1, 2, 3], [4, 5, 6]], 3, 2]
        ],
        boundary: [
          [[[42]], 1, 1],
          [[[42]], 1, 2],
          [[[1, 2], [3, 4]], 4, 1],
          [[[1], [2], [3], [4]], 1, 4]
        ],
        adversarial: [
          [[[1, 2, 3], [4, 5, 6]], 1, 6],
          [[[1, 2, 3], [4, 5, 6]], 6, 1]
        ],
        stress: [
          [Array.from({ length: 20 }, (_, r) => Array.from({ length: 25 }, (_, c) => r * 25 + c)), 50, 10],
          [Array.from({ length: 30 }, (_, r) => Array.from({ length: 30 }, (_, c) => r + c)), 100, 9]
        ]
      }
    }),

    // 288. Game of Life
    createProblem({
      num: 288,
      title: "Game of Life",
      slug: "game-of-life",
      level: 13,
      difficulty: "MEDIUM",
      topic: "Matrix",
      patternSlug: "matrix-grid",
      estimatedTimeMin: 25,
      statement: "According to Conway's Game of Life, the board is an `m x n` grid of cells where each cell is either 0 (dead) or 1 (live).\n\nEach cell interacts with its eight neighbors (horizontal, vertical, diagonal) using four rules:\n1. Any live cell with fewer than two live neighbors dies (under-population).\n2. Any live cell with two or three live neighbors lives on to the next generation.\n3. Any live cell with more than three live neighbors dies (over-population).\n4. Any dead cell with exactly three live neighbors becomes a live cell (reproduction).\n\nThe next state is created by applying the rules simultaneously to every cell. Return the board after one step.",
      functionName: "gameOfLife",
      parameters: [{ name: "board", type: "number[][]", description: "m x n binary board" }],
      returnType: "number[][]",
      constraints: ["m == board.length", "n == board[i].length", "1 <= m, n <= 25", "board[i][j] is either 0 or 1."],
      examples: [
        { input: "board = [[0,1,0],[0,0,1],[1,1,1],[0,0,0]]", output: "[[0,0,0],[1,0,1],[0,1,1],[0,1,0]]", explanation: "Simultaneous transition of Conway's glider." },
        { input: "board = [[1,1],[1,0]]", output: "[[1,1],[1,1]]", explanation: "Dead cell with 3 live neighbors becomes live." },
        { input: "board = [[1]]", output: "[[0]]", explanation: "Single cell has 0 neighbors and dies." },
        { input: "board = [[0]]", output: "[[0]]", explanation: "Dead cell remains dead." }
      ],
      optimalSolution: `function gameOfLife(board) {\n  const m = board.length, n = board[0].length;\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      let liveNeighbors = 0;\n      for (let dr = -1; dr <= 1; dr++) {\n        for (let dc = -1; dc <= 1; dc++) {\n          if (dr === 0 && dc === 0) continue;\n          const nr = r + dr, nc = c + dc;\n          if (nr >= 0 && nr < m && nc >= 0 && nc < n) {\n            if ((board[nr][nc] & 1) === 1) liveNeighbors++;\n          }\n        }\n      }\n      if ((board[r][c] & 1) === 1) {\n        if (liveNeighbors === 2 || liveNeighbors === 3) board[r][c] |= 2;\n      } else {\n        if (liveNeighbors === 3) board[r][c] |= 2;\n      }\n    }\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      board[r][c] >>= 1;\n    }\n  }\n  return board;\n}`,
      optimalTimeComplexity: "O(m * n)",
      optimalSpaceComplexity: "O(1) in-place bit manipulation",
      suboptimalSolution: `function gameOfLife(board) {\n  const m = board.length, n = board[0].length;\n  const copy = board.map(row => [...row]);\n  const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      let count = 0;\n      for (const [dr, dc] of dirs) {\n        const nr = r + dr, nc = c + dc;\n        if (nr >= 0 && nr < m && nc >= 0 && nc < n && copy[nr][nc] === 1) count++;\n      }\n      if (copy[r][c] === 1 && (count < 2 || count > 3)) board[r][c] = 0;\n      if (copy[r][c] === 0 && count === 3) board[r][c] = 1;\n    }\n  }\n  return board;\n}`,
      suboptimalTimeComplexity: "O(m * n)",
      suboptimalSpaceComplexity: "O(m * n) copy",
      commonMistakes: ["Updating board cells in-place with 0/1 directly, which corrupts neighbor counts for subsequent cells.", "Missing diagonal neighbor checks."],
      hints: [
        "Use bit 0 for current state and bit 1 for next state.",
        "When counting live neighbors, read `board[nr][nc] & 1`.",
        "After processing all cells, shift each cell right by 1 bit: `board[r][c] >>= 1`."
      ],
      oracleFn: (board: number[][]) => {
        const m = board.length, n = board[0].length;
        const copy = board.map(row => [...row]);
        const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
        for (let r = 0; r < m; r++) {
          for (let c = 0; c < n; c++) {
            let count = 0;
            for (const [dr, dc] of dirs) {
              const nr = r + dr, nc = c + dc;
              if (nr >= 0 && nr < m && nc >= 0 && nc < n && copy[nr][nc] === 1) count++;
            }
            if (copy[r][c] === 1) {
              board[r][c] = (count === 2 || count === 3) ? 1 : 0;
            } else {
              board[r][c] = (count === 3) ? 1 : 0;
            }
          }
        }
        return board;
      },
      testCases: {
        functional: [
          [[[0, 1, 0], [0, 0, 1], [1, 1, 1], [0, 0, 0]]],
          [[[1, 1], [1, 0]]],
          [[[1]]],
          [[[0]]]
        ],
        boundary: [
          [[[1, 1, 1], [1, 1, 1], [1, 1, 1]]],
          [[[0, 0, 0], [0, 0, 0], [0, 0, 0]]],
          [[[1, 0, 1], [0, 1, 0], [1, 0, 1]]],
          [[[0, 1, 0], [1, 1, 1], [0, 1, 0]]]
        ],
        adversarial: [
          [[[1, 1, 0], [1, 0, 1], [0, 1, 1]]],
          [[[1, 0, 0, 1], [0, 1, 1, 0], [0, 1, 1, 0], [1, 0, 0, 1]]]
        ],
        stress: [
          [Array.from({ length: 20 }, (_, r) => Array.from({ length: 20 }, (_, c) => ((r + c) % 3 === 0 ? 1 : 0)))],
          [Array.from({ length: 25 }, () => Array.from({ length: 25 }, () => 1))]
        ]
      }
    }),

    // 289. Number of Islands
    createProblem({
      num: 289,
      title: "Number of Islands",
      slug: "number-of-islands",
      level: 13,
      difficulty: "MEDIUM",
      topic: "Graph / Matrix",
      patternSlug: "matrix-grid",
      estimatedTimeMin: 20,
      statement: "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
      functionName: "numIslands",
      parameters: [{ name: "grid", type: "string[][]", description: "m x n 2D grid containing '1' and '0'" }],
      returnType: "number",
      constraints: ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 300", "grid[i][j] is '0' or '1'."],
      examples: [
        { input: "grid = [[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]", output: "1", explanation: "All 1s connect into a single large island." },
        { input: "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]", output: "3", explanation: "Three separate disconnected islands." },
        { input: "grid = [[\"0\"]]", output: "0", explanation: "Water only." },
        { input: "grid = [[\"1\"]]", output: "1", explanation: "Single cell island." }
      ],
      optimalSolution: `function numIslands(grid) {\n  if (!grid || grid.length === 0) return 0;\n  const m = grid.length, n = grid[0].length;\n  let count = 0;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || String(grid[r][c]) !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (String(grid[r][c]) === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}`,
      optimalTimeComplexity: "O(m * n)",
      optimalSpaceComplexity: "O(m * n) recursion stack",
      suboptimalSolution: `function numIslands(grid) {\n  if (!grid || grid.length === 0) return 0;\n  const m = grid.length, n = grid[0].length;\n  const visited = Array.from({ length: m }, () => Array(n).fill(false));\n  let count = 0;\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (String(grid[r][c]) === '1' && !visited[r][c]) {\n        count++;\n        const q = [[r, c]];\n        visited[r][c] = true;\n        while (q.length > 0) {\n          const [cr, cc] = q.shift();\n          const dirs = [[1,0],[-1,0],[0,1],[0,-1]];\n          for (const [dr, dc] of dirs) {\n            const nr = cr + dr, nc = cc + dc;\n            if (nr >= 0 && nr < m && nc >= 0 && nc < n && String(grid[nr][nc]) === '1' && !visited[nr][nc]) {\n              visited[nr][nc] = true;\n              q.push([nr, nc]);\n            }\n          }\n        }\n      }\n    }\n  }\n  return count;\n}`,
      suboptimalTimeComplexity: "O(m * n)",
      suboptimalSpaceComplexity: "O(m * n) visited array",
      commonMistakes: ["Checking diagonals (problem states connectivity is strictly horizontal and vertical).", "Stack overflow on very large grids without marking cells visited immediately."],
      hints: [
        "Iterate over every cell. When you encounter land ('1'), increment count and trigger DFS/BFS.",
        "Sink the island by converting connected '1's to '0's during traversal.",
        "Ensure string '1' vs number 1 type consistency."
      ],
      oracleFn: (grid: string[][]) => {
        if (!grid || grid.length === 0) return 0;
        const g = grid.map(row => [...row]);
        const m = g.length, n = g[0].length;
        let count = 0;
        function dfs(r: number, c: number) {
          if (r < 0 || r >= m || c < 0 || c >= n || String(g[r][c]) !== '1') return;
          g[r][c] = '0';
          dfs(r + 1, c);
          dfs(r - 1, c);
          dfs(r, c + 1);
          dfs(r, c - 1);
        }
        for (let r = 0; r < m; r++) {
          for (let c = 0; c < n; c++) {
            if (String(g[r][c]) === '1') {
              count++;
              dfs(r, c);
            }
          }
        }
        return count;
      },
      testCases: {
        functional: [
          [[["1", "1", "1", "1", "0"], ["1", "1", "0", "1", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "0", "0", "0"]]],
          [[["1", "1", "0", "0", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "1", "0", "0"], ["0", "0", "0", "1", "1"]]],
          [[["0"]]],
          [[["1"]]]
        ],
        boundary: [
          [[["1", "0", "1", "0", "1"]]],
          [[["1"], ["0"], ["1"], ["0"], ["1"]]],
          [[["0", "0", "0"], ["0", "0", "0"]]],
          [[["1", "1"], ["1", "1"]]]
        ],
        adversarial: [
          [[["1", "0", "1"], ["0", "1", "0"], ["1", "0", "1"]]],
          [[["1", "1", "1"], ["1", "0", "1"], ["1", "1", "1"]]]
        ],
        stress: [
          [Array.from({ length: 25 }, (_, r) => Array.from({ length: 25 }, (_, c) => ((r + c) % 2 === 0 ? "1" : "0")))],
          [Array.from({ length: 30 }, () => Array.from({ length: 30 }, () => "1"))]
        ]
      }
    }),

    // 290. Max Area of Island
    createProblem({
      num: 290,
      title: "Max Area of Island",
      slug: "max-area-of-island",
      level: 13,
      difficulty: "MEDIUM",
      topic: "Matrix / DFS",
      patternSlug: "matrix-grid",
      estimatedTimeMin: 20,
      statement: "You are given an `m x n` binary matrix `grid`. An island is a group of `1`'s (representing land) connected 4-directionally (horizontal or vertical).\n\nThe area of an island is the number of cells with a value `1` in the island.\n\nReturn the maximum area of an island in `grid`. If there is no island, return `0`.",
      functionName: "maxAreaOfIsland",
      parameters: [{ name: "grid", type: "number[][]", description: "m x n binary matrix" }],
      returnType: "number",
      constraints: ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 50", "grid[i][j] is either 0 or 1."],
      examples: [
        { input: "grid = [[0,0,1,0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,1,1,0,1,0,0,0,0,0,0,0,0],[0,1,0,0,1,1,0,0,1,0,1,0,0],[0,1,0,0,1,1,0,0,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,0,0,0,0,0,0,1,1,0,0,0,0]]", output: "6", explanation: "The maximum island area is 6 cells." },
        { input: "grid = [[0,0,0,0,0,0,0,0]]", output: "0", explanation: "No islands present." },
        { input: "grid = [[1,1],[1,1]]", output: "4", explanation: "All 4 cells form a single island." },
        { input: "grid = [[1]]", output: "1", explanation: "Single cell island." }
      ],
      optimalSolution: `function maxAreaOfIsland(grid) {\n  const m = grid.length, n = grid[0].length;\n  let maxArea = 0;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== 1) return 0;\n    grid[r][c] = 0;\n    return 1 + dfs(r + 1, c) + dfs(r - 1, c) + dfs(r, c + 1) + dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === 1) {\n        maxArea = Math.max(maxArea, dfs(r, c));\n      }\n    }\n  }\n  return maxArea;\n}`,
      optimalTimeComplexity: "O(m * n)",
      optimalSpaceComplexity: "O(m * n) recursion stack",
      suboptimalSolution: `function maxAreaOfIsland(grid) {\n  const m = grid.length, n = grid[0].length;\n  const visited = Array.from({ length: m }, () => Array(n).fill(false));\n  let maxArea = 0;\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === 1 && !visited[r][c]) {\n        let area = 0;\n        const q = [[r, c]];\n        visited[r][c] = true;\n        while (q.length > 0) {\n          const [cr, cc] = q.shift();\n          area++;\n          const dirs = [[1,0],[-1,0],[0,1],[0,-1]];\n          for (const [dr, dc] of dirs) {\n            const nr = cr + dr, nc = cc + dc;\n            if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === 1 && !visited[nr][nc]) {\n              visited[nr][nc] = true;\n              q.push([nr, nc]);\n            }\n          }\n        }\n        maxArea = Math.max(maxArea, area);\n      }\n    }\n  }\n  return maxArea;\n}`,
      suboptimalTimeComplexity: "O(m * n)",
      suboptimalSpaceComplexity: "O(m * n) visited array",
      commonMistakes: ["Failing to mark visited cells before recursing, causing infinite loops.", "Returning 1 instead of 0 for empty or all-zero grids."],
      hints: [
        "Use DFS or BFS to traverse each connected component.",
        "Return 1 + sum of DFS calls in all 4 orthogonal directions.",
        "Track the running maximum over all connected components."
      ],
      oracleFn: (grid: number[][]) => {
        const g = grid.map(row => [...row]);
        const m = g.length, n = g[0].length;
        let maxArea = 0;
        function dfs(r: number, c: number): number {
          if (r < 0 || r >= m || c < 0 || c >= n || g[r][c] !== 1) return 0;
          g[r][c] = 0;
          return 1 + dfs(r + 1, c) + dfs(r - 1, c) + dfs(r, c + 1) + dfs(r, c - 1);
        }
        for (let r = 0; r < m; r++) {
          for (let c = 0; c < n; c++) {
            if (g[r][c] === 1) maxArea = Math.max(maxArea, dfs(r, c));
          }
        }
        return maxArea;
      },
      testCases: {
        functional: [
          [[[0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0], [0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0]]],
          [[[0, 0, 0, 0, 0, 0, 0, 0]]],
          [[[1, 1], [1, 1]]],
          [[[1]]]
        ],
        boundary: [
          [[[0]]],
          [[[1, 0, 1, 0, 1]]],
          [[[1], [1], [1], [1]]],
          [[[0, 1], [1, 0]]]
        ],
        adversarial: [
          [[[1, 1, 1, 1, 1], [1, 0, 0, 0, 1], [1, 0, 1, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1]]],
          [[[1, 0, 1, 1], [0, 1, 1, 0], [1, 1, 0, 1]]]
        ],
        stress: [
          [Array.from({ length: 30 }, () => Array.from({ length: 30 }, () => 1))],
          [Array.from({ length: 35 }, (_, r) => Array.from({ length: 35 }, (_, c) => ((r + c) % 2 === 0 ? 1 : 0)))]
        ]
      }
    }),

    // 291. Flood Fill
    createProblem({
      num: 291,
      title: "Flood Fill",
      slug: "flood-fill",
      level: 13,
      difficulty: "EASY",
      topic: "Matrix / BFS / DFS",
      patternSlug: "matrix-grid",
      estimatedTimeMin: 15,
      statement: "An image is represented by an `m x n` integer grid `image` where `image[i][j]` represents the pixel value of the image.\n\nYou are also given three integers `sr`, `sc`, and `color`. You should perform a flood fill on the image starting from the pixel `image[sr][sc]`.\n\nTo perform a flood fill, consider the starting pixel, plus any pixels connected 4-directionally to the starting pixel of the same color as the starting pixel, plus any pixels connected 4-directionally to those pixels (also with the same color), and so on. Replace the color of all of the aforementioned pixels with `color`.\n\nReturn the modified image after performing the flood fill.",
      functionName: "floodFill",
      parameters: [
        { name: "image", type: "number[][]", description: "2D integer image" },
        { name: "sr", type: "number", description: "Starting row index" },
        { name: "sc", type: "number", description: "Starting column index" },
        { name: "color", type: "number", description: "New color value" }
      ],
      returnType: "number[][]",
      constraints: ["m == image.length", "n == image[i].length", "1 <= m, n <= 50", "0 <= image[i][j], color < 2^16", "0 <= sr < m", "0 <= sc < n"],
      examples: [
        { input: "image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2", output: "[[2,2,2],[2,2,0],[2,0,1]]", explanation: "All 1s connected to (1,1) are replaced with 2. Bottom right 1 is not connected 4-directionally." },
        { input: "image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0", output: "[[0,0,0],[0,0,0]]", explanation: "Starting color is already 0, image remains unchanged." },
        { input: "image = [[1]], sr = 0, sc = 0, color = 2", output: "[[2]]", explanation: "Single pixel updated." },
        { input: "image = [[0,0,0],[0,1,1]], sr = 1, sc = 1, color = 1", output: "[[0,0,0],[0,1,1]]", explanation: "Same color, no change." }
      ],
      optimalSolution: `function floodFill(image, sr, sc, color) {\n  const originalColor = image[sr][sc];\n  if (originalColor === color) return image;\n  const m = image.length, n = image[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || image[r][c] !== originalColor) return;\n    image[r][c] = color;\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  dfs(sr, sc);\n  return image;\n}`,
      optimalTimeComplexity: "O(m * n)",
      optimalSpaceComplexity: "O(m * n) recursion stack",
      suboptimalSolution: `function floodFill(image, sr, sc, color) {\n  const orig = image[sr][sc];\n  if (orig === color) return image;\n  const m = image.length, n = image[0].length;\n  const q = [[sr, sc]];\n  image[sr][sc] = color;\n  while (q.length > 0) {\n    const [r, c] = q.shift();\n    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];\n    for (const [dr, dc] of dirs) {\n      const nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nr < m && nc >= 0 && nc < n && image[nr][nc] === orig) {\n        image[nr][nc] = color;\n        q.push([nr, nc]);\n      }\n    }\n  }\n  return image;\n}`,
      suboptimalTimeComplexity: "O(m * n)",
      suboptimalSpaceComplexity: "O(m * n) queue",
      commonMistakes: ["Failing to check `originalColor === color` at the beginning, leading to infinite recursion or queue overflow."],
      hints: [
        "Store `originalColor = image[sr][sc]`.",
        "If `originalColor === color`, return image immediately.",
        "Otherwise, standard 4-directional DFS/BFS recoloring pixels equal to originalColor."
      ],
      oracleFn: (image: number[][], sr: number, sc: number, color: number) => {
        const img = image.map(row => [...row]);
        const originalColor = img[sr][sc];
        if (originalColor === color) return img;
        const m = img.length, n = img[0].length;
        function dfs(r: number, c: number) {
          if (r < 0 || r >= m || c < 0 || c >= n || img[r][c] !== originalColor) return;
          img[r][c] = color;
          dfs(r + 1, c);
          dfs(r - 1, c);
          dfs(r, c + 1);
          dfs(r, c - 1);
        }
        dfs(sr, sc);
        return img;
      },
      testCases: {
        functional: [
          [[[1, 1, 1], [1, 1, 0], [1, 0, 1]], 1, 1, 2],
          [[[0, 0, 0], [0, 0, 0]], 0, 0, 0],
          [[[1]], 0, 0, 2],
          [[[0, 0, 0], [0, 1, 1]], 1, 1, 1]
        ],
        boundary: [
          [[[1, 2], [3, 4]], 0, 0, 9],
          [[[5, 5], [5, 5]], 1, 1, 0],
          [[[0, 1, 0]], 0, 1, 7],
          [[[1], [1], [1]], 2, 0, 3]
        ],
        adversarial: [
          [[[2, 2, 2], [2, 2, 2]], 0, 1, 2],
          [[[1, 0, 1], [0, 1, 0], [1, 0, 1]], 1, 1, 5]
        ],
        stress: [
          [Array.from({ length: 30 }, () => Array.from({ length: 30 }, () => 1)), 0, 0, 9],
          [Array.from({ length: 40 }, (_, r) => Array.from({ length: 40 }, (_, c) => (r === 20 ? 0 : 1))), 0, 0, 2]
        ]
      }
    }),

    // 292. Surrounded Regions
    createProblem({
      num: 292,
      title: "Surrounded Regions",
      slug: "surrounded-regions",
      level: 13,
      difficulty: "MEDIUM",
      topic: "Matrix / BFS / DFS",
      patternSlug: "matrix-grid",
      estimatedTimeMin: 20,
      statement: "Given an `m x n` matrix `board` containing `'X'` and `'O'`, capture all regions that are 4-directionally surrounded by `'X'`.\n\nA region is captured by flipping all `'O'`s into `'X'`s in that surrounded region. Any `'O'` on the border or connected to a border `'O'` cannot be flipped.\n\nReturn the modified `board` in-place.",
      functionName: "solve",
      parameters: [{ name: "board", type: "string[][]", description: "2D character board containing 'X' and 'O'" }],
      returnType: "string[][]",
      constraints: ["m == board.length", "n == board[i].length", "1 <= m, n <= 200", "board[i][j] is 'X' or 'O'."],
      examples: [
        { input: "board = [[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"O\",\"O\",\"X\"],[\"X\",\"X\",\"O\",\"X\"],[\"X\",\"O\",\"X\",\"X\"]]", output: "[[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"O\",\"X\",\"X\"]]", explanation: "The 'O' at (3,1) is on the boundary and saved; interior 'O's are flipped to 'X'." },
        { input: "board = [[\"X\"]]", output: "[[\"X\"]]", explanation: "Single cell unchanged." },
        { input: "board = [[\"O\",\"O\"],[\"O\",\"O\"]]", output: "[[\"O\",\"O\"],[\"O\",\"O\"]]", explanation: "All cells on border remain 'O'." },
        { input: "board = [[\"X\",\"O\",\"X\"],[\"X\",\"O\",\"X\"],[\"X\",\"X\",\"X\"]]", output: "[[\"X\",\"O\",\"X\"],[\"X\",\"O\",\"X\"],[\"X\",\"X\",\"X\"]]", explanation: "Connected to top border, preserved." }
      ],
      optimalSolution: `function solve(board) {\n  if (!board || board.length === 0) return board;\n  const m = board.length, n = board[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== 'O') return;\n    board[r][c] = '#';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    dfs(r, 0);\n    dfs(r, n - 1);\n  }\n  for (let c = 0; c < n; c++) {\n    dfs(0, c);\n    dfs(m - 1, c);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (board[r][c] === 'O') board[r][c] = 'X';\n      else if (board[r][c] === '#') board[r][c] = 'O';\n    }\n  }\n  return board;\n}`,
      optimalTimeComplexity: "O(m * n)",
      optimalSpaceComplexity: "O(m * n) recursion stack",
      suboptimalSolution: `function solve(board) {\n  if (!board || board.length === 0) return board;\n  const m = board.length, n = board[0].length;\n  const q = [];\n  for (let r = 0; r < m; r++) {\n    if (board[r][0] === 'O') { board[r][0] = 'S'; q.push([r, 0]); }\n    if (board[r][n - 1] === 'O') { board[r][n - 1] = 'S'; q.push([r, n - 1]); }\n  }\n  for (let c = 0; c < n; c++) {\n    if (board[0][c] === 'O') { board[0][c] = 'S'; q.push([0, c]); }\n    if (board[m - 1][c] === 'O') { board[m - 1][c] = 'S'; q.push([m - 1, c]); }\n  }\n  while (q.length > 0) {\n    const [r, c] = q.shift();\n    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];\n    for (const [dr, dc] of dirs) {\n      const nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nr < m && nc >= 0 && nc < n && board[nr][nc] === 'O') {\n        board[nr][nc] = 'S';\n        q.push([nr, nc]);\n      }\n    }\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (board[r][c] === 'O') board[r][c] = 'X';\n      else if (board[r][c] === 'S') board[r][c] = 'O';\n    }\n  }\n  return board;\n}`,
      suboptimalTimeComplexity: "O(m * n)",
      suboptimalSpaceComplexity: "O(m * n) queue",
      commonMistakes: ["Trying to identify surrounded regions from the inside out instead of boundary-first traversal.", "Forgetting to restore escaped border cells back to 'O'."],
      hints: [
        "Invert the problem: which 'O's CANNOT be captured? Any 'O' connected to the border.",
        "Run DFS/BFS starting from all border cells with value 'O', marking them as safe (e.g. '#').",
        "Flip all remaining 'O's to 'X', and restore '#' back to 'O'."
      ],
      oracleFn: (board: string[][]) => {
        const b = board.map(row => [...row]);
        const m = b.length, n = b[0].length;
        function dfs(r: number, c: number) {
          if (r < 0 || r >= m || c < 0 || c >= n || b[r][c] !== 'O') return;
          b[r][c] = '#';
          dfs(r + 1, c);
          dfs(r - 1, c);
          dfs(r, c + 1);
          dfs(r, c - 1);
        }
        for (let r = 0; r < m; r++) {
          dfs(r, 0);
          dfs(r, n - 1);
        }
        for (let c = 0; c < n; c++) {
          dfs(0, c);
          dfs(m - 1, c);
        }
        for (let r = 0; r < m; r++) {
          for (let c = 0; c < n; c++) {
            if (b[r][c] === 'O') b[r][c] = 'X';
            else if (b[r][c] === '#') b[r][c] = 'O';
          }
        }
        return b;
      },
      testCases: {
        functional: [
          [[["X", "X", "X", "X"], ["X", "O", "O", "X"], ["X", "X", "O", "X"], ["X", "O", "X", "X"]]],
          [[["X"]]],
          [[["O", "O"], ["O", "O"]]],
          [[["X", "O", "X"], ["X", "O", "X"], ["X", "X", "X"]]]
        ],
        boundary: [
          [[["O"]]],
          [[["X", "X"], ["X", "X"]]],
          [[["O", "X", "O"], ["X", "O", "X"], ["O", "X", "O"]]],
          [[["X", "O", "X", "O"]]]
        ],
        adversarial: [
          [[["X", "X", "X", "X"], ["X", "O", "X", "X"], ["X", "O", "O", "X"], ["X", "X", "X", "X"]]],
          [[["O", "X", "X"], ["X", "O", "X"], ["X", "X", "O"]]]
        ],
        stress: [
          [Array.from({ length: 20 }, (_, r) => Array.from({ length: 20 }, (_, c) => (r === 0 || r === 19 || c === 0 || c === 19 ? "X" : (r + c) % 3 === 0 ? "O" : "X")))],
          [Array.from({ length: 25 }, () => Array.from({ length: 25 }, () => "O"))]
        ]
      }
    }),

    // 293. Pacific Atlantic Water Flow
    createProblem({
      num: 293,
      title: "Pacific Atlantic Water Flow",
      slug: "pacific-atlantic-water-flow",
      level: 13,
      difficulty: "MEDIUM",
      topic: "Matrix / BFS / DFS",
      patternSlug: "matrix-grid",
      estimatedTimeMin: 25,
      statement: "There is an `m x n` rectangular island that borders both the Pacific Ocean and Atlantic Ocean. The Pacific Ocean touches the island's left and top edges, and the Atlantic Ocean touches the island's right and bottom edges.\n\nThe island is partitioned into a grid of square cells. You are given an `m x n` integer matrix `heights` where `heights[r][c]` represents the height above sea level of the cell at coordinate `(r, c)`.\n\nRain water can flow to neighboring cells directly north, south, east, and west if the neighboring cell's height is less than or equal to the current cell's height. Water can flow from any cell adjacent to an ocean directly into that ocean.\n\nReturn a 2D list of grid coordinates `result` where `result[i] = [ri, ci]` denotes that rain water can flow from cell `(ri, ci)` to both the Pacific and Atlantic oceans (coordinates sorted in row-major order).",
      functionName: "pacificAtlantic",
      parameters: [{ name: "heights", type: "number[][]", description: "m x n height matrix" }],
      returnType: "number[][]",
      constraints: ["m == heights.length", "n == heights[r].length", "1 <= m, n <= 200", "0 <= heights[r][c] <= 10^5"],
      examples: [
        { input: "heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]", output: "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]", explanation: "These 7 cells can flow water to both Pacific (top/left) and Atlantic (bottom/right)." },
        { input: "heights = [[1]]", output: "[[0,0]]", explanation: "Single cell touches both oceans." },
        { input: "heights = [[2,1],[1,2]]", output: "[[0,0],[0,1],[1,0],[1,1]]", explanation: "All 4 cells reach both oceans." },
        { input: "heights = [[1,2,3],[8,9,4],[7,6,5]]", output: "[[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]]", explanation: "Peak cells flow to both oceans." }
      ],
      optimalSolution: `function pacificAtlantic(heights) {\n  if (!heights || heights.length === 0) return [];\n  const m = heights.length, n = heights[0].length;\n  const pacific = Array.from({ length: m }, () => Array(n).fill(false));\n  const atlantic = Array.from({ length: m }, () => Array(n).fill(false));\n  function dfs(r, c, visited) {\n    visited[r][c] = true;\n    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];\n    for (const [dr, dc] of dirs) {\n      const nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc] && heights[nr][nc] >= heights[r][c]) {\n        dfs(nr, nc, visited);\n      }\n    }\n  }\n  for (let r = 0; r < m; r++) {\n    dfs(r, 0, pacific);\n    dfs(r, n - 1, atlantic);\n  }\n  for (let c = 0; c < n; c++) {\n    dfs(0, c, pacific);\n    dfs(m - 1, c, atlantic);\n  }\n  const res = [];\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (pacific[r][c] && atlantic[r][c]) res.push([r, c]);\n    }\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(m * n)",
      optimalSpaceComplexity: "O(m * n)",
      suboptimalSolution: `function pacificAtlantic(heights) {\n  if (!heights || heights.length === 0) return [];\n  const m = heights.length, n = heights[0].length;\n  const res = [];\n  function canReach(r, c) {\n    let reachP = false, reachA = false;\n    const q = [[r, c]];\n    const seen = new Set([\`\${r},\${c}\`]);\n    while (q.length > 0) {\n      const [cr, cc] = q.shift();\n      if (cr === 0 || cc === 0) reachP = true;\n      if (cr === m - 1 || cc === n - 1) reachA = true;\n      if (reachP && reachA) return true;\n      const dirs = [[1,0],[-1,0],[0,1],[0,-1]];\n      for (const [dr, dc] of dirs) {\n        const nr = cr + dr, nc = cc + dc;\n        if (nr >= 0 && nr < m && nc >= 0 && nc < n && !seen.has(\`\${nr},\${nc}\`) && heights[nr][nc] <= heights[cr][cc]) {\n          seen.add(\`\${nr},\${nc}\`);\n          q.push([nr, nc]);\n        }\n      }\n    }\n    return reachP && reachA;\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (canReach(r, c)) res.push([r, c]);\n    }\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O((m * n)^2)",
      suboptimalSpaceComplexity: "O(m * n)",
      commonMistakes: ["Traversing downwards from each cell to ocean (O((mn)^2)), causing TLE.", "Flow condition reversed: when flowing inland from ocean, neighbor height must be >= current height."],
      hints: [
        "Reverse the flow: start DFS from ocean borders and flow uphill (heights[nr][nc] >= heights[r][c]).",
        "Pacific starts at row 0 and col 0; Atlantic starts at row m-1 and col n-1.",
        "Intersection of reachable cells in both boolean matrices gives the final answer."
      ],
      oracleFn: (heights: number[][]) => {
        if (!heights || heights.length === 0) return [];
        const m = heights.length, n = heights[0].length;
        const pacific = Array.from({ length: m }, () => Array(n).fill(false));
        const atlantic = Array.from({ length: m }, () => Array(n).fill(false));
        function dfs(r: number, c: number, visited: boolean[][]) {
          visited[r][c] = true;
          const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
          for (const [dr, dc] of dirs) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc] && heights[nr][nc] >= heights[r][c]) {
              dfs(nr, nc, visited);
            }
          }
        }
        for (let r = 0; r < m; r++) {
          dfs(r, 0, pacific);
          dfs(r, n - 1, atlantic);
        }
        for (let c = 0; c < n; c++) {
          dfs(0, c, pacific);
          dfs(m - 1, c, atlantic);
        }
        const res: number[][] = [];
        for (let r = 0; r < m; r++) {
          for (let c = 0; c < n; c++) {
            if (pacific[r][c] && atlantic[r][c]) res.push([r, c]);
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [[[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]]],
          [[[1]]],
          [[[2, 1], [1, 2]]],
          [[[1, 2, 3], [8, 9, 4], [7, 6, 5]]]
        ],
        boundary: [
          [[[1, 2, 3, 4, 5]]],
          [[[5], [4], [3], [2], [1]]],
          [[[10, 10], [10, 10]]],
          [[[1, 1, 1], [1, 1, 1], [1, 1, 1]]]
        ],
        adversarial: [
          [[[1, 2, 1], [2, 1, 2], [1, 2, 1]]],
          [[[3, 3, 3, 3], [3, 0, 0, 3], [3, 3, 3, 3]]]
        ],
        stress: [
          [Array.from({ length: 25 }, (_, r) => Array.from({ length: 25 }, (_, c) => r + c))],
          [Array.from({ length: 30 }, (_, r) => Array.from({ length: 30 }, (_, c) => Math.abs(r - 15) + Math.abs(c - 15)))]
        ]
      }
    }),

    // 294. Rotting Oranges
    createProblem({
      num: 294,
      title: "Rotting Oranges",
      slug: "rotting-oranges",
      level: 13,
      difficulty: "MEDIUM",
      topic: "Matrix / BFS",
      patternSlug: "matrix-grid",
      estimatedTimeMin: 20,
      statement: "You are given an `m x n` `grid` where each cell can have one of three values:\n- `0` representing an empty cell,\n- `1` representing a fresh orange, or\n- `2` representing a rotten orange.\n\nEvery minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten.\n\nReturn the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return `-1`.",
      functionName: "orangesRotting",
      parameters: [{ name: "grid", type: "number[][]", description: "m x n orange grid" }],
      returnType: "number",
      constraints: ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 10", "grid[i][j] is 0, 1, or 2."],
      examples: [
        { input: "grid = [[2,1,1],[1,1,0],[0,1,1]]", output: "4", explanation: "After 4 minutes, all fresh oranges are rotted." },
        { input: "grid = [[2,1,1],[0,1,1],[1,0,1]]", output: "-1", explanation: "The orange in bottom left corner is isolated and never rots." },
        { input: "grid = [[0,2]]", output: "0", explanation: "No fresh oranges initially, answer is 0." },
        { input: "grid = [[1]]", output: "-1", explanation: "Fresh orange with no rotten orange never rots." }
      ],
      optimalSolution: `function orangesRotting(grid) {\n  const m = grid.length, n = grid[0].length;\n  const queue = [];\n  let fresh = 0;\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === 2) queue.push([r, c]);\n      else if (grid[r][c] === 1) fresh++;\n    }\n  }\n  if (fresh === 0) return 0;\n  let minutes = 0;\n  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];\n  while (queue.length > 0 && fresh > 0) {\n    const size = queue.length;\n    for (let i = 0; i < size; i++) {\n      const [r, c] = queue.shift();\n      for (const [dr, dc] of dirs) {\n        const nr = r + dr, nc = c + dc;\n        if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === 1) {\n          grid[nr][nc] = 2;\n          fresh--;\n          queue.push([nr, nc]);\n        }\n      }\n    }\n    minutes++;\n  }\n  return fresh === 0 ? minutes : -1;\n}`,
      optimalTimeComplexity: "O(m * n)",
      optimalSpaceComplexity: "O(m * n) queue",
      suboptimalSolution: `function orangesRotting(grid) {\n  const m = grid.length, n = grid[0].length;\n  let minutes = 0;\n  let changed = true;\n  while (changed) {\n    changed = false;\n    const toRot = [];\n    for (let r = 0; r < m; r++) {\n      for (let c = 0; c < n; c++) {\n        if (grid[r][c] === 2) {\n          const dirs = [[1,0],[-1,0],[0,1],[0,-1]];\n          for (const [dr, dc] of dirs) {\n            const nr = r + dr, nc = c + dc;\n            if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === 1) {\n              toRot.push([nr, nc]);\n            }\n          }\n        }\n      }\n    }\n    if (toRot.length > 0) {\n      for (const [r, c] of toRot) grid[r][c] = 2;\n      minutes++;\n      changed = true;\n    }\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === 1) return -1;\n    }\n  }\n  return minutes;\n}`,
      suboptimalTimeComplexity: "O((m * n)^2)",
      suboptimalSpaceComplexity: "O(m * n)",
      commonMistakes: ["Returning minutes incremented even when no fresh oranges were converted.", "Forgetting the edge case where initial fresh count is 0."],
      hints: [
        "Multi-source BFS: add all initial rotten oranges to the queue at time 0.",
        "Count the total number of fresh oranges.",
        "Process queue level-by-level (each level = 1 minute). When fresh reaches 0, stop."
      ],
      oracleFn: (grid: number[][]) => {
        const g = grid.map(row => [...row]);
        const m = g.length, n = g[0].length;
        const queue: [number, number][] = [];
        let fresh = 0;
        for (let r = 0; r < m; r++) {
          for (let c = 0; c < n; c++) {
            if (g[r][c] === 2) queue.push([r, c]);
            else if (g[r][c] === 1) fresh++;
          }
        }
        if (fresh === 0) return 0;
        let minutes = 0;
        const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
        while (queue.length > 0 && fresh > 0) {
          const size = queue.length;
          for (let i = 0; i < size; i++) {
            const [r, c] = queue.shift()!;
            for (const [dr, dc] of dirs) {
              const nr = r + dr, nc = c + dc;
              if (nr >= 0 && nr < m && nc >= 0 && nc < n && g[nr][nc] === 1) {
                g[nr][nc] = 2;
                fresh--;
                queue.push([nr, nc]);
              }
            }
          }
          minutes++;
        }
        return fresh === 0 ? minutes : -1;
      },
      testCases: {
        functional: [
          [[[2, 1, 1], [1, 1, 0], [0, 1, 1]]],
          [[[2, 1, 1], [0, 1, 1], [1, 0, 1]]],
          [[[0, 2]]],
          [[[1]]]
        ],
        boundary: [
          [[[0]]],
          [[[2]]],
          [[[2, 1, 1, 1, 1, 1, 1, 1]]],
          [[[1, 2, 1]]]
        ],
        adversarial: [
          [[[2, 2], [1, 1], [0, 0], [2, 0]]],
          [[[2, 1, 0, 2], [1, 0, 1, 2]]]
        ],
        stress: [
          [Array.from({ length: 10 }, (_, r) => Array.from({ length: 10 }, (_, c) => (r === 0 && c === 0 ? 2 : 1)))],
          [Array.from({ length: 10 }, (_, r) => Array.from({ length: 10 }, (_, c) => (r === 0 ? 2 : c === 9 ? 0 : 1)))]
        ]
      }
    }),

    // 295. Walls and Gates
    createProblem({
      num: 295,
      title: "Walls and Gates",
      slug: "walls-and-gates",
      level: 13,
      difficulty: "MEDIUM",
      topic: "Matrix / BFS",
      patternSlug: "matrix-grid",
      estimatedTimeMin: 20,
      statement: "You are given an `m x n` grid `rooms` initialized with these three possible values:\n- `-1` A wall or an obstacle.\n- `0` A gate.\n- `INF` (2147483647) An empty room.\n\nFill each empty room with the distance to its nearest gate. If it is impossible to reach a gate, it should be filled with `INF`.\n\nReturn the modified `rooms` matrix.",
      functionName: "wallsAndGates",
      parameters: [{ name: "rooms", type: "number[][]", description: "m x n rooms matrix" }],
      returnType: "number[][]",
      constraints: ["m == rooms.length", "n == rooms[i].length", "1 <= m, n <= 250", "rooms[i][j] is -1, 0, or 2147483647."],
      examples: [
        { input: "rooms = [[2147483647,-1,0,2147483647],[2147483647,2147483647,2147483647,-1],[2147483647,-1,2147483647,-1],[0,-1,2147483647,2147483647]]", output: "[[3,-1,0,1],[2,2,1,-1],[1,-1,2,-1],[0,-1,3,4]]", explanation: "Multi-source BFS from gates fills the shortest distance to each room." },
        { input: "rooms = [[-1]]", output: "[[-1]]", explanation: "Single wall remains -1." },
        { input: "rooms = [[0]]", output: "[[0]]", explanation: "Single gate remains 0." },
        { input: "rooms = [[2147483647]]", output: "[[2147483647]]", explanation: "No gate, room unreachable, remains INF." }
      ],
      optimalSolution: `function wallsAndGates(rooms) {\n  if (!rooms || rooms.length === 0) return rooms;\n  const m = rooms.length, n = rooms[0].length;\n  const INF = 2147483647;\n  const queue = [];\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (rooms[r][c] === 0) queue.push([r, c]);\n    }\n  }\n  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];\n  while (queue.length > 0) {\n    const [r, c] = queue.shift();\n    for (const [dr, dc] of dirs) {\n      const nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nr < m && nc >= 0 && nc < n && rooms[nr][nc] === INF) {\n        rooms[nr][nc] = rooms[r][c] + 1;\n        queue.push([nr, nc]);\n      }\n    }\n  }\n  return rooms;\n}`,
      optimalTimeComplexity: "O(m * n)",
      optimalSpaceComplexity: "O(m * n) queue",
      suboptimalSolution: `function wallsAndGates(rooms) {\n  if (!rooms || rooms.length === 0) return rooms;\n  const m = rooms.length, n = rooms[0].length;\n  const INF = 2147483647;\n  function dfs(r, c, dist) {\n    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];\n    for (const [dr, dc] of dirs) {\n      const nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nr < m && nc >= 0 && nc < n && rooms[nr][nc] > dist + 1) {\n        rooms[nr][nc] = dist + 1;\n        dfs(nr, nc, dist + 1);\n      }\n    }\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (rooms[r][c] === 0) dfs(r, c, 0);\n    }\n  }\n  return rooms;\n}`,
      suboptimalTimeComplexity: "O((m * n)^2) repeated DFS",
      suboptimalSpaceComplexity: "O(m * n)",
      commonMistakes: ["Running BFS from each room towards gates instead of multi-source BFS from all gates outwards.", "Visiting already reached rooms with equal or smaller distance."],
      hints: [
        "Push all gates (cells with value 0) into a single BFS queue.",
        "When an INF neighbor is reached, its shortest distance is rooms[r][c] + 1.",
        "Push neighbor to queue. Multi-source BFS guarantees optimal distance upon first visit."
      ],
      oracleFn: (rooms: number[][]) => {
        const rMat = rooms.map(row => [...row]);
        const m = rMat.length, n = rMat[0].length;
        const INF = 2147483647;
        const queue: [number, number][] = [];
        for (let r = 0; r < m; r++) {
          for (let c = 0; c < n; c++) {
            if (rMat[r][c] === 0) queue.push([r, c]);
          }
        }
        const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
        while (queue.length > 0) {
          const [r, c] = queue.shift()!;
          for (const [dr, dc] of dirs) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < m && nc >= 0 && nc < n && rMat[nr][nc] === INF) {
              rMat[nr][nc] = rMat[r][c] + 1;
              queue.push([nr, nc]);
            }
          }
        }
        return rMat;
      },
      testCases: {
        functional: [
          [[[2147483647, -1, 0, 2147483647], [2147483647, 2147483647, 2147483647, -1], [2147483647, -1, 2147483647, -1], [0, -1, 2147483647, 2147483647]]],
          [[[-1]]],
          [[[0]]],
          [[[2147483647]]]
        ],
        boundary: [
          [[[0, 2147483647]]],
          [[[-1, 2147483647]]],
          [[[0, -1, 0]]],
          [[[2147483647, 0, 2147483647]]]
        ],
        adversarial: [
          [[[2147483647, -1, 2147483647], [-1, 0, -1], [2147483647, -1, 2147483647]]],
          [[[0, 2147483647, 2147483647], [2147483647, 2147483647, 2147483647], [2147483647, 2147483647, 0]]]
        ],
        stress: [
          [Array.from({ length: 20 }, (_, r) => Array.from({ length: 20 }, (_, c) => (r === 0 && c === 0 ? 0 : 2147483647)))],
          [Array.from({ length: 25 }, (_, r) => Array.from({ length: 25 }, (_, c) => (r === 12 && c === 12 ? 0 : (r === 10 ? -1 : 2147483647))))]
        ]
      }
    }),

    // 296. 01 Matrix
    createProblem({
      num: 296,
      title: "01 Matrix",
      slug: "01-matrix",
      level: 13,
      difficulty: "MEDIUM",
      topic: "Matrix / BFS / DP",
      patternSlug: "matrix-grid",
      estimatedTimeMin: 20,
      statement: "Given an `m x n` binary matrix `mat`, return the distance of the nearest `0` for each cell.\n\nThe distance between two adjacent cells is `1`.",
      functionName: "updateMatrix",
      parameters: [{ name: "mat", type: "number[][]", description: "m x n binary matrix" }],
      returnType: "number[][]",
      constraints: ["m == mat.length", "n == mat[i].length", "1 <= m, n <= 10^4", "1 <= m * n <= 10^4", "mat[i][j] is either 0 or 1.", "There is at least one 0 in mat."],
      examples: [
        { input: "mat = [[0,0,0],[0,1,0],[0,0,0]]", output: "[[0,0,0],[0,1,0],[0,0,0]]", explanation: "The distance of 1 in center to nearest 0 is 1." },
        { input: "mat = [[0,0,0],[0,1,0],[1,1,1]]", output: "[[0,0,0],[0,1,0],[1,2,1]]", explanation: "Bottom center cell has distance 2 to nearest zero." },
        { input: "mat = [[0]]", output: "[[0]]", explanation: "Single cell distance 0." },
        { input: "mat = [[1,0]]", output: "[[1,0]]", explanation: "Distance 1 to adjacent 0." }
      ],
      optimalSolution: `function updateMatrix(mat) {\n  const m = mat.length, n = mat[0].length;\n  const dist = Array.from({ length: m }, () => Array(n).fill(Infinity));\n  const q = [];\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (mat[r][c] === 0) {\n        dist[r][c] = 0;\n        q.push([r, c]);\n      }\n    }\n  }\n  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];\n  let head = 0;\n  while (head < q.length) {\n    const [r, c] = q[head++];\n    for (const [dr, dc] of dirs) {\n      const nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nr < m && nc >= 0 && nc < n) {\n        if (dist[nr][nc] > dist[r][c] + 1) {\n          dist[nr][nc] = dist[r][c] + 1;\n          q.push([nr, nc]);\n        }\n      }\n    }\n  }\n  return dist;\n}`,
      optimalTimeComplexity: "O(m * n)",
      optimalSpaceComplexity: "O(m * n)",
      suboptimalSolution: `function updateMatrix(mat) {\n  const m = mat.length, n = mat[0].length;\n  const dist = Array.from({ length: m }, () => Array(n).fill(Infinity));\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (mat[r][c] === 0) dist[r][c] = 0;\n      else {\n        if (r > 0) dist[r][c] = Math.min(dist[r][c], dist[r - 1][c] + 1);\n        if (c > 0) dist[r][c] = Math.min(dist[r][c], dist[r][c - 1] + 1);\n      }\n    }\n  }\n  for (let r = m - 1; r >= 0; r--) {\n    for (let c = n - 1; c >= 0; c--) {\n      if (r < m - 1) dist[r][c] = Math.min(dist[r][c], dist[r + 1][c] + 1);\n      if (c < n - 1) dist[r][c] = Math.min(dist[r][c], dist[r][c + 1] + 1);\n    }\n  }\n  return dist;\n}`,
      suboptimalTimeComplexity: "O(m * n)",
      suboptimalSpaceComplexity: "O(m * n)",
      commonMistakes: ["Running independent BFS from each 1 cell (O((mn)^2)), causing TLE.", "Using array.shift() in BFS on large grids leading to O(N^2) queue operations."],
      hints: [
        "Multi-source BFS: enqueue all 0 cells with distance 0.",
        "When expanding to adjacent cells, set dist[nr][nc] = dist[r][c] + 1.",
        "Alternatively, two-pass DP: top-left to bottom-right, then bottom-right to top-left."
      ],
      oracleFn: (mat: number[][]) => {
        const m = mat.length, n = mat[0].length;
        const dist = Array.from({ length: m }, () => Array(n).fill(Infinity));
        const q: [number, number][] = [];
        for (let r = 0; r < m; r++) {
          for (let c = 0; c < n; c++) {
            if (mat[r][c] === 0) {
              dist[r][c] = 0;
              q.push([r, c]);
            }
          }
        }
        const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
        let head = 0;
        while (head < q.length) {
          const [r, c] = q[head++];
          for (const [dr, dc] of dirs) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
              if (dist[nr][nc] > dist[r][c] + 1) {
                dist[nr][nc] = dist[r][c] + 1;
                q.push([nr, nc]);
              }
            }
          }
        }
        return dist;
      },
      testCases: {
        functional: [
          [[[0, 0, 0], [0, 1, 0], [0, 0, 0]]],
          [[[0, 0, 0], [0, 1, 0], [1, 1, 1]]],
          [[[0]]],
          [[[1, 0]]]
        ],
        boundary: [
          [[[0, 1, 1, 1, 1]]],
          [[[1], [1], [1], [0]]],
          [[[0, 0], [0, 0]]],
          [[[0, 1], [1, 0]]]
        ],
        adversarial: [
          [[[1, 1, 1], [1, 1, 1], [1, 1, 0]]],
          [[[0, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 0]]]
        ],
        stress: [
          [Array.from({ length: 30 }, (_, r) => Array.from({ length: 30 }, (_, c) => (r === 0 && c === 0 ? 0 : 1)))],
          [Array.from({ length: 40 }, (_, r) => Array.from({ length: 40 }, (_, c) => ((r === 0 || c === 0) ? 0 : 1)))]
        ]
      }
    }),

    // 297. Shortest Path in Binary Matrix
    createProblem({
      num: 297,
      title: "Shortest Path in Binary Matrix",
      slug: "shortest-path-in-binary-matrix",
      level: 13,
      difficulty: "MEDIUM",
      topic: "Matrix / BFS",
      patternSlug: "matrix-grid",
      estimatedTimeMin: 20,
      statement: "Given an `n x n` binary matrix `grid`, return the length of the shortest clear path in the matrix. If there is no clear path, return `-1`.\n\nA clear path in a binary matrix is a path from the top-left cell `(0, 0)` to the bottom-right cell `(n - 1, n - 1)` such that:\n- All the visited cells of the path are `0`.\n- All the adjacent cells of the path are 8-directionally connected (i.e., they are different and share an edge or a corner).\n\nThe length of a clear path is the number of visited cells of this path.",
      functionName: "shortestPathBinaryMatrix",
      parameters: [{ name: "grid", type: "number[][]", description: "n x n binary grid" }],
      returnType: "number",
      constraints: ["n == grid.length", "n == grid[i].length", "1 <= n <= 100", "grid[i][j] is 0 or 1."],
      examples: [
        { input: "grid = [[0,1],[1,0]]", output: "2", explanation: "(0,0) -> (1,1) diagonally, length 2." },
        { input: "grid = [[0,0,0],[1,1,0],[1,1,0]]", output: "4", explanation: "Shortest path length is 4." },
        { input: "grid = [[1,0,0],[1,1,0],[1,1,0]]", output: "-1", explanation: "Starting cell (0,0) is blocked (value 1)." },
        { input: "grid = [[0]]", output: "1", explanation: "Single clear cell length is 1." }
      ],
      optimalSolution: `function shortestPathBinaryMatrix(grid) {\n  const n = grid.length;\n  if (grid[0][0] !== 0 || grid[n - 1][n - 1] !== 0) return -1;\n  if (n === 1) return 1;\n  const queue = [[0, 0, 1]];\n  grid[0][0] = 1;\n  const dirs = [\n    [-1, -1], [-1, 0], [-1, 1],\n    [0, -1],           [0, 1],\n    [1, -1],  [1, 0],  [1, 1]\n  ];\n  let head = 0;\n  while (head < queue.length) {\n    const [r, c, d] = queue[head++];\n    for (const [dr, dc] of dirs) {\n      const nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] === 0) {\n        if (nr === n - 1 && nc === n - 1) return d + 1;\n        grid[nr][nc] = 1;\n        queue.push([nr, nc, d + 1]);\n      }\n    }\n  }\n  return -1;\n}`,
      optimalTimeComplexity: "O(n^2)",
      optimalSpaceComplexity: "O(n^2) queue",
      suboptimalSolution: `function shortestPathBinaryMatrix(grid) {\n  const n = grid.length;\n  if (grid[0][0] !== 0 || grid[n - 1][n - 1] !== 0) return -1;\n  const dist = Array.from({ length: n }, () => Array(n).fill(Infinity));\n  dist[0][0] = 1;\n  const q = [[0, 0]];\n  const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];\n  while (q.length > 0) {\n    const [r, c] = q.shift();\n    for (const [dr, dc] of dirs) {\n      const nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] === 0) {\n        if (dist[nr][nc] > dist[r][c] + 1) {\n          dist[nr][nc] = dist[r][c] + 1;\n          q.push([nr, nc]);\n        }\n      }\n    }\n  }\n  return dist[n - 1][n - 1] === Infinity ? -1 : dist[n - 1][n - 1];\n}`,
      suboptimalTimeComplexity: "O(n^2)",
      suboptimalSpaceComplexity: "O(n^2)",
      commonMistakes: ["Forgetting 8 directions (diagonal movement is allowed).", "Not checking if (0,0) or (n-1,n-1) are blocked upfront.", "Queue shift() timeout on large n."],
      hints: [
        "First check if grid[0][0] === 0 and grid[n-1][n-1] === 0.",
        "8-directional BFS: dr and dc each in {-1, 0, 1} except (0,0).",
        "Mark cells visited immediately upon enqueueing to avoid duplicate states."
      ],
      oracleFn: (grid: number[][]) => {
        const g = grid.map(row => [...row]);
        const n = g.length;
        if (g[0][0] !== 0 || g[n - 1][n - 1] !== 0) return -1;
        if (n === 1) return 1;
        const queue: [number, number, number][] = [[0, 0, 1]];
        g[0][0] = 1;
        const dirs = [
          [-1, -1], [-1, 0], [-1, 1],
          [0, -1],           [0, 1],
          [1, -1],  [1, 0],  [1, 1]
        ];
        let head = 0;
        while (head < queue.length) {
          const [r, c, d] = queue[head++];
          for (const [dr, dc] of dirs) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < n && nc >= 0 && nc < n && g[nr][nc] === 0) {
              if (nr === n - 1 && nc === n - 1) return d + 1;
              g[nr][nc] = 1;
              queue.push([nr, nc, d + 1]);
            }
          }
        }
        return -1;
      },
      testCases: {
        functional: [
          [[[0, 1], [1, 0]]],
          [[[0, 0, 0], [1, 1, 0], [1, 1, 0]]],
          [[[1, 0, 0], [1, 1, 0], [1, 1, 0]]],
          [[[0]]]
        ],
        boundary: [
          [[[1]]],
          [[[0, 0], [0, 0]]],
          [[[0, 1, 0], [1, 1, 0], [1, 1, 0]]],
          [[[0, 0, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 1, 1, 1], [0, 0, 0, 0]]]
        ],
        adversarial: [
          [[[0, 1, 1], [1, 0, 1], [1, 1, 0]]],
          [[[0, 1, 0], [0, 1, 0], [0, 1, 0]]]
        ],
        stress: [
          [Array.from({ length: 20 }, (_, r) => Array.from({ length: 20 }, (_, c) => (r === c ? 0 : 0)))],
          [Array.from({ length: 30 }, (_, r) => Array.from({ length: 30 }, (_, c) => (r === 15 && c < 28 ? 1 : 0)))]
        ]
      }
    }),

    // 298. Number of Enclaves
    createProblem({
      num: 298,
      title: "Number of Enclaves",
      slug: "number-of-enclaves",
      level: 13,
      difficulty: "MEDIUM",
      topic: "Matrix / BFS / DFS",
      patternSlug: "matrix-grid",
      estimatedTimeMin: 20,
      statement: "You are given an `m x n` binary matrix `grid`, where `0` represents a sea cell and `1` represents a land cell.\n\nA move consists of walking from one land cell to another adjacent (4-directionally) land cell or walking off the boundary of the grid.\n\nReturn the number of land cells in `grid` for which we cannot walk off the boundary of the grid in any number of moves.",
      functionName: "numEnclaves",
      parameters: [{ name: "grid", type: "number[][]", description: "m x n binary grid" }],
      returnType: "number",
      constraints: ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 500", "grid[i][j] is either 0 or 1."],
      examples: [
        { input: "grid = [[0,0,0,0],[1,0,1,0],[0,1,1,0],[0,0,0,0]]", output: "3", explanation: "Three 1s in the center cannot walk off the boundary." },
        { input: "grid = [[0,1,1,0],[0,0,1,0],[0,0,1,0],[0,0,0,0]]", output: "0", explanation: "All 1s connect to the top boundary." },
        { input: "grid = [[0]]", output: "0", explanation: "No land cells." },
        { input: "grid = [[1]]", output: "0", explanation: "Land cell on boundary can walk off immediately." }
      ],
      optimalSolution: `function numEnclaves(grid) {\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== 1) return;\n    grid[r][c] = 0;\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    dfs(r, 0);\n    dfs(r, n - 1);\n  }\n  for (let c = 0; c < n; c++) {\n    dfs(0, c);\n    dfs(m - 1, c);\n  }\n  let count = 0;\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === 1) count++;\n    }\n  }\n  return count;\n}`,
      optimalTimeComplexity: "O(m * n)",
      optimalSpaceComplexity: "O(m * n) recursion stack",
      suboptimalSolution: `function numEnclaves(grid) {\n  const m = grid.length, n = grid[0].length;\n  const q = [];\n  for (let r = 0; r < m; r++) {\n    if (grid[r][0] === 1) { grid[r][0] = 0; q.push([r, 0]); }\n    if (grid[r][n - 1] === 1) { grid[r][n - 1] = 0; q.push([r, n - 1]); }\n  }\n  for (let c = 0; c < n; c++) {\n    if (grid[0][c] === 1) { grid[0][c] = 0; q.push([0, c]); }\n    if (grid[m - 1][c] === 1) { grid[m - 1][c] = 0; q.push([m - 1, c]); }\n  }\n  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];\n  while (q.length > 0) {\n    const [r, c] = q.shift();\n    for (const [dr, dc] of dirs) {\n      const nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === 1) {\n        grid[nr][nc] = 0;\n        q.push([nr, nc]);\n      }\n    }\n  }\n  let count = 0;\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === 1) count++;\n    }\n  }\n  return count;\n}`,
      suboptimalTimeComplexity: "O(m * n)",
      suboptimalSpaceComplexity: "O(m * n) queue",
      commonMistakes: ["Failing to flood fill connected boundary 1s before counting.", "Checking 8 directions instead of 4."],
      hints: [
        "Any 1 that can reach the boundary can walk off.",
        "Flood fill (sink) all 1s connected to the 4 boundaries by turning them into 0s.",
        "After sinking, simply count the remaining 1s."
      ],
      oracleFn: (grid: number[][]) => {
        const g = grid.map(row => [...row]);
        const m = g.length, n = g[0].length;
        function dfs(r: number, c: number) {
          if (r < 0 || r >= m || c < 0 || c >= n || g[r][c] !== 1) return;
          g[r][c] = 0;
          dfs(r + 1, c);
          dfs(r - 1, c);
          dfs(r, c + 1);
          dfs(r, c - 1);
        }
        for (let r = 0; r < m; r++) {
          dfs(r, 0);
          dfs(r, n - 1);
        }
        for (let c = 0; c < n; c++) {
          dfs(0, c);
          dfs(m - 1, c);
        }
        let count = 0;
        for (let r = 0; r < m; r++) {
          for (let c = 0; c < n; c++) {
            if (g[r][c] === 1) count++;
          }
        }
        return count;
      },
      testCases: {
        functional: [
          [[[0, 0, 0, 0], [1, 0, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]]],
          [[[0, 1, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 0, 0]]],
          [[[0]]],
          [[[1]]]
        ],
        boundary: [
          [[[1, 1], [1, 1]]],
          [[[0, 0], [0, 0]]],
          [[[0, 0, 0], [0, 1, 0], [0, 0, 0]]],
          [[[1, 0, 1], [0, 1, 0], [1, 0, 1]]]
        ],
        adversarial: [
          [[[0, 0, 0, 0, 0], [0, 1, 1, 1, 0], [0, 1, 0, 1, 0], [0, 1, 1, 1, 0], [0, 0, 0, 0, 0]]],
          [[[1, 1, 1], [1, 0, 1], [1, 1, 1]]]
        ],
        stress: [
          [Array.from({ length: 30 }, (_, r) => Array.from({ length: 30 }, (_, c) => (r === 0 || r === 29 || c === 0 || c === 29 ? 0 : 1)))],
          [Array.from({ length: 35 }, (_, r) => Array.from({ length: 35 }, (_, c) => ((r + c) % 2 === 0 ? 1 : 0)))]
        ]
      }
    }),

    // 299. Count Sub Islands
    createProblem({
      num: 299,
      title: "Count Sub Islands",
      slug: "count-sub-islands",
      level: 13,
      difficulty: "MEDIUM",
      topic: "Matrix / BFS / DFS",
      patternSlug: "matrix-grid",
      estimatedTimeMin: 20,
      statement: "You are given two `m x n` binary matrices `grid1` and `grid2` containing only `0`'s (water) and `1`'s (land).\n\nAn island is a group of `1`'s connected 4-directionally.\n\nAn island in `grid2` is considered a sub-island if there is an island in `grid1` that contains all the cells that make up this island in `grid2`.\n\nReturn the number of islands in `grid2` that are considered sub-islands.",
      functionName: "countSubIslands",
      parameters: [
        { name: "grid1", type: "number[][]", description: "m x n base grid" },
        { name: "grid2", type: "number[][]", description: "m x n candidate sub-island grid" }
      ],
      returnType: "number",
      constraints: ["m == grid1.length == grid2.length", "n == grid1[i].length == grid2[i].length", "1 <= m, n <= 500", "grid1[i][j] and grid2[i][j] are either 0 or 1."],
      examples: [
        { input: "grid1 = [[1,1,1,0,0],[0,1,1,1,1],[0,0,0,0,0],[1,0,0,0,0],[1,1,0,1,1]], grid2 = [[1,1,1,0,0],[0,0,1,1,1],[0,1,0,0,0],[1,0,1,1,0],[0,1,0,1,0]]", output: "3", explanation: "Three islands in grid2 are completely covered by land in grid1." },
        { input: "grid1 = [[1,0,1,0,1],[1,1,1,1,1],[0,0,0,0,0],[1,1,1,1,1],[1,0,1,0,1]], grid2 = [[0,0,0,0,0],[1,1,1,1,1],[0,1,0,1,0],[0,1,0,1,0],[1,0,0,0,1]]", output: "2", explanation: "Two sub-islands." },
        { input: "grid1 = [[1]], grid2 = [[1]]", output: "1", explanation: "Single cell sub-island." },
        { input: "grid1 = [[0]], grid2 = [[1]]", output: "0", explanation: "No corresponding land in grid1." }
      ],
      optimalSolution: `function countSubIslands(grid1, grid2) {\n  const m = grid1.length, n = grid1[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid2[r][c] !== 1) return true;\n    grid2[r][c] = 0;\n    let isSub = grid1[r][c] === 1;\n    const d1 = dfs(r + 1, c);\n    const d2 = dfs(r - 1, c);\n    const d3 = dfs(r, c + 1);\n    const d4 = dfs(r, c - 1);\n    return isSub && d1 && d2 && d3 && d4;\n  }\n  let count = 0;\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid2[r][c] === 1) {\n        if (dfs(r, c)) count++;\n      }\n    }\n  }\n  return count;\n}`,
      optimalTimeComplexity: "O(m * n)",
      optimalSpaceComplexity: "O(m * n) recursion stack",
      suboptimalSolution: `function countSubIslands(grid1, grid2) {\n  const m = grid1.length, n = grid1[0].length;\n  // Eliminate all islands in grid2 that touch water in grid1\n  function sink(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid2[r][c] !== 1) return;\n    grid2[r][c] = 0;\n    sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid2[r][c] === 1 && grid1[r][c] === 0) {\n        sink(r, c);\n      }\n    }\n  }\n  let count = 0;\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid2[r][c] === 1) {\n        count++;\n        sink(r, c);\n      }\n    }\n  }\n  return count;\n}`,
      suboptimalTimeComplexity: "O(m * n)",
      suboptimalSpaceComplexity: "O(m * n)",
      commonMistakes: ["Short-circuiting the boolean evaluation (e.g. `isSub && dfs(...)`), which fails to visit and sink the rest of the island in grid2.", "Checking grid1 instead of grid2 in outer loop."],
      hints: [
        "Traverse each island in grid2 with DFS.",
        "Crucial: Do not short-circuit DFS! All cells of the island in grid2 must be traversed and sunk even if one cell is already invalid.",
        "Alternatively: first sink any island in grid2 that contains a cell where grid1 is 0. Then count remaining islands."
      ],
      oracleFn: (grid1: number[][], grid2: number[][]) => {
        const g1 = grid1.map(row => [...row]);
        const g2 = grid2.map(row => [...row]);
        const m = g1.length, n = g1[0].length;
        function dfs(r: number, c: number): boolean {
          if (r < 0 || r >= m || c < 0 || c >= n || g2[r][c] !== 1) return true;
          g2[r][c] = 0;
          let isSub = g1[r][c] === 1;
          const d1 = dfs(r + 1, c);
          const d2 = dfs(r - 1, c);
          const d3 = dfs(r, c + 1);
          const d4 = dfs(r, c - 1);
          return isSub && d1 && d2 && d3 && d4;
        }
        let count = 0;
        for (let r = 0; r < m; r++) {
          for (let c = 0; c < n; c++) {
            if (g2[r][c] === 1) {
              if (dfs(r, c)) count++;
            }
          }
        }
        return count;
      },
      testCases: {
        functional: [
          [[[1, 1, 1, 0, 0], [0, 1, 1, 1, 1], [0, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 1, 0, 1, 1]], [[1, 1, 1, 0, 0], [0, 0, 1, 1, 1], [0, 1, 0, 0, 0], [1, 0, 1, 1, 0], [0, 1, 0, 1, 0]]],
          [[[1, 0, 1, 0, 1], [1, 1, 1, 1, 1], [0, 0, 0, 0, 0], [1, 1, 1, 1, 1], [1, 0, 1, 0, 1]], [[0, 0, 0, 0, 0], [1, 1, 1, 1, 1], [0, 1, 0, 1, 0], [0, 1, 0, 1, 0], [1, 0, 0, 0, 1]]],
          [[[1]], [[1]]],
          [[[0]], [[1]]]
        ],
        boundary: [
          [[[1, 1], [1, 1]], [[1, 0], [0, 1]]],
          [[[0, 0], [0, 0]], [[0, 0], [0, 0]]],
          [[[1, 0, 1]], [[1, 0, 1]]],
          [[[0, 1, 0]], [[0, 1, 0]]]
        ],
        adversarial: [
          [[[1, 1, 0], [1, 0, 1], [0, 1, 1]], [[1, 1, 0], [1, 0, 1], [0, 1, 1]]],
          [[[1, 1, 1], [1, 0, 1], [1, 1, 1]], [[0, 1, 0], [1, 1, 1], [0, 1, 0]]]
        ],
        stress: [
          [Array.from({ length: 25 }, () => Array.from({ length: 25 }, () => 1)), Array.from({ length: 25 }, (_, r) => Array.from({ length: 25 }, (_, c) => ((r + c) % 2 === 0 ? 1 : 0)))],
          [Array.from({ length: 30 }, (_, r) => Array.from({ length: 30 }, (_, c) => (r < 15 ? 1 : 0))), Array.from({ length: 30 }, (_, r) => Array.from({ length: 30 }, (_, c) => (r < 10 ? 1 : 0)))]
        ]
      }
    }),

    // 300. Where Will the Ball Fall
    createProblem({
      num: 300,
      title: "Where Will the Ball Fall",
      slug: "where-will-the-ball-fall",
      level: 13,
      difficulty: "MEDIUM",
      topic: "Matrix / Simulation",
      patternSlug: "matrix-grid",
      estimatedTimeMin: 20,
      statement: "You have a 2-D `grid` of size `m x n` representing a box, and you have `n` balls. The box is open on the top and bottom sides.\n\nEach cell in the box has a diagonal board spanning two corners that can redirect a ball to the right or to the left:\n- A board that redirects the ball to the right spans the top-left corner to the bottom-right corner and is represented in the grid as `1`.\n- A board that redirects the ball to the left spans the top-right corner to the bottom-left corner and is represented in the grid as `-1`.\n\nYou drop one ball at the top of each column. Return an array `ans` of size `n` where `ans[i]` is the column that the ball falls out of at the bottom after dropping the ball from the `i-th` column, or `-1` if the ball gets stuck in the box.",
      functionName: "findBall",
      parameters: [{ name: "grid", type: "number[][]", description: "m x n board direction matrix" }],
      returnType: "number[]",
      constraints: ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 100", "grid[i][j] is 1 or -1."],
      examples: [
        { input: "grid = [[1,1,1,-1,-1],[1,1,1,-1,-1],[-1,-1,-1,1,1],[1,1,1,1,-1],[-1,-1,-1,-1,-1]]", output: "[1,-1,-1,-1,-1]", explanation: "Ball 0 exits at col 1. Balls 1, 2, 3, 4 get stuck in V-shapes." },
        { input: "grid = [[-1]]", output: "[-1]", explanation: "Redirected left into wall, gets stuck." },
        { input: "grid = [[1,1,1,1,1,1],[-1,-1,-1,-1,-1,-1],[1,1,1,1,1,1],[-1,-1,-1,-1,-1,-1]]", output: "[0,1,2,3,4,-1]", explanation: "Balls oscillate downwards." },
        { input: "grid = [[1]]", output: "[-1]", explanation: "Redirected right into wall." }
      ],
      optimalSolution: `function findBall(grid) {\n  const m = grid.length, n = grid[0].length;\n  const ans = new Array(n);\n  for (let ball = 0; ball < n; ball++) {\n    let col = ball;\n    for (let row = 0; row < m; row++) {\n      const dir = grid[row][col];\n      const nextCol = col + dir;\n      if (nextCol < 0 || nextCol >= n || grid[row][nextCol] !== dir) {\n        col = -1;\n        break;\n      }\n      col = nextCol;\n    }\n    ans[ball] = col;\n  }\n  return ans;\n}`,
      optimalTimeComplexity: "O(m * n)",
      optimalSpaceComplexity: "O(1) extra space beyond result",
      suboptimalSolution: `function findBall(grid) {\n  const m = grid.length, n = grid[0].length;\n  function drop(r, c) {\n    if (r === m) return c;\n    const nextC = c + grid[r][c];\n    if (nextC < 0 || nextC >= n || grid[r][nextC] !== grid[r][c]) return -1;\n    return drop(r + 1, nextC);\n  }\n  const ans = [];\n  for (let i = 0; i < n; i++) ans.push(drop(0, i));\n  return ans;\n}`,
      suboptimalTimeComplexity: "O(m * n)",
      suboptimalSpaceComplexity: "O(m) recursion stack",
      commonMistakes: ["Checking grid[row + 1][col] instead of checking the adjacent column in the same row `grid[row][nextCol]` for a V-shape."],
      hints: [
        "A ball at (r, c) moves to (r + 1, c + 1) if grid[r][c] == 1 and grid[r][c + 1] == 1.",
        "A ball moves to (r + 1, c - 1) if grid[r][c] == -1 and grid[r][c - 1] == -1.",
        "If it hits a boundary or grid[r][c] != grid[r][nextCol], it forms a V-shape and gets stuck."
      ],
      oracleFn: (grid: number[][]) => {
        const m = grid.length, n = grid[0].length;
        const ans = new Array(n);
        for (let ball = 0; ball < n; ball++) {
          let col = ball;
          for (let row = 0; row < m; row++) {
            const dir = grid[row][col];
            const nextCol = col + dir;
            if (nextCol < 0 || nextCol >= n || grid[row][nextCol] !== dir) {
              col = -1;
              break;
            }
            col = nextCol;
          }
          ans[ball] = col;
        }
        return ans;
      },
      testCases: {
        functional: [
          [[[1, 1, 1, -1, -1], [1, 1, 1, -1, -1], [-1, -1, -1, 1, 1], [1, 1, 1, 1, -1], [-1, -1, -1, -1, -1]]],
          [[[-1]]],
          [[[1, 1, 1, 1, 1, 1], [-1, -1, -1, -1, -1, -1], [1, 1, 1, 1, 1, 1], [-1, -1, -1, -1, -1, -1]]],
          [[[1]]]
        ],
        boundary: [
          [[[1, -1]]],
          [[[-1, 1]]],
          [[[1, 1], [-1, -1]]],
          [[[1, 1, 1], [1, 1, 1]]]
        ],
        adversarial: [
          [[[1, -1, 1, -1], [-1, 1, -1, 1]]],
          [[[1, 1, -1], [-1, 1, 1]]]
        ],
        stress: [
          [Array.from({ length: 40 }, () => Array.from({ length: 30 }, (_, c) => (c % 2 === 0 ? 1 : -1)))],
          [Array.from({ length: 50 }, () => Array.from({ length: 40 }, () => 1))]
        ]
      }
    }),

    // 301. Diagonal Traverse
    createProblem({
      num: 301,
      title: "Diagonal Traverse",
      slug: "diagonal-traverse",
      level: 13,
      difficulty: "MEDIUM",
      topic: "Matrix / Simulation",
      patternSlug: "matrix-grid",
      estimatedTimeMin: 20,
      statement: "Given an `m x n` matrix `mat`, return an array of all the elements of the array in a diagonal order (alternating between upwards-right and downwards-left).",
      functionName: "findDiagonalOrder",
      parameters: [{ name: "mat", type: "number[][]", description: "m x n matrix" }],
      returnType: "number[]",
      constraints: ["m == mat.length", "n == mat[i].length", "1 <= m, n <= 10^4", "1 <= m * n <= 10^4", "-10^5 <= mat[i][j] <= 10^5"],
      examples: [
        { input: "mat = [[1,2,3],[4,5,6],[7,8,9]]", output: "[1,2,4,7,5,3,6,8,9]", explanation: "1 -> 2,4 -> 7,5,3 -> 6,8 -> 9." },
        { input: "mat = [[1,2],[3,4]]", output: "[1,2,3,4]", explanation: "Diagonal traversal." },
        { input: "mat = [[1]]", output: "[1]", explanation: "Single element." },
        { input: "mat = [[1,2,3,4]]", output: "[1,2,3,4]", explanation: "Single row matrix." }
      ],
      optimalSolution: `function findDiagonalOrder(mat) {\n  if (!mat || mat.length === 0) return [];\n  const m = mat.length, n = mat[0].length;\n  const res = [];\n  let r = 0, c = 0;\n  for (let i = 0; i < m * n; i++) {\n    res.push(mat[r][c]);\n    if ((r + c) % 2 === 0) {\n      if (c === n - 1) r++;\n      else if (r === 0) c++;\n      else { r--; c++; }\n    } else {\n      if (r === m - 1) c++;\n      else if (c === 0) r++;\n      else { r++; c--; }\n    }\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(m * n)",
      optimalSpaceComplexity: "O(1) extra space beyond result",
      suboptimalSolution: `function findDiagonalOrder(mat) {\n  if (!mat || mat.length === 0) return [];\n  const m = mat.length, n = mat[0].length;\n  const map = new Map();\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      const diag = r + c;\n      if (!map.has(diag)) map.set(diag, []);\n      map.get(diag).push(mat[r][c]);\n    }\n  }\n  const res = [];\n  for (let d = 0; d < m + n - 1; d++) {\n    const list = map.get(d) || [];\n    if (d % 2 === 0) list.reverse();\n    res.push(...list);\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(m * n)",
      suboptimalSpaceComplexity: "O(m * n) map",
      commonMistakes: ["Boundary turning order: checking r === 0 before c === n - 1 when moving up-right causes index out of bounds."],
      hints: [
        "Elements on diagonal d have row + col == d.",
        "When moving up-right: if c == n - 1, step down (r++); else if r == 0, step right (c++); else r--, c++.",
        "When moving down-left: if r == m - 1, step right (c++); else if c == 0, step down (r++); else r++, c--."
      ],
      oracleFn: (mat: number[][]) => {
        if (!mat || mat.length === 0) return [];
        const m = mat.length, n = mat[0].length;
        const res: number[] = [];
        let r = 0, c = 0;
        for (let i = 0; i < m * n; i++) {
          res.push(mat[r][c]);
          if ((r + c) % 2 === 0) {
            if (c === n - 1) r++;
            else if (r === 0) c++;
            else { r--; c++; }
          } else {
            if (r === m - 1) c++;
            else if (c === 0) r++;
            else { r++; c--; }
          }
        }
        return res;
      },
      testCases: {
        functional: [
          [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]],
          [[[1, 2], [3, 4]]],
          [[[1]]],
          [[[1, 2, 3, 4]]]
        ],
        boundary: [
          [[[1], [2], [3], [4]]],
          [[[2, 5], [8, 4], [0, -1]]],
          [[[1, 2, 3], [4, 5, 6]]],
          [[[1, 2], [3, 4], [5, 6]]]
        ],
        adversarial: [
          [[[1, -1, 1], [-1, 1, -1]]],
          [[[10, 20, 30, 40], [50, 60, 70, 80]]]
        ],
        stress: [
          [Array.from({ length: 40 }, (_, r) => Array.from({ length: 30 }, (_, c) => r * 30 + c))],
          [Array.from({ length: 1 }, () => Array.from({ length: 100 }, (_, i) => i))]
        ]
      }
    }),

    // 302. Search a 2D Matrix II
    createProblem({
      num: 302,
      title: "Search a 2D Matrix II",
      slug: "search-a-2d-matrix-ii",
      level: 13,
      difficulty: "MEDIUM",
      topic: "Matrix / Binary Search",
      patternSlug: "matrix-grid",
      estimatedTimeMin: 15,
      statement: "Write an efficient algorithm that searches for an integer `target` in an `m x n` matrix `matrix`. This matrix has the following properties:\n- Integers in each row are sorted in ascending from left to right.\n- Integers in each column are sorted in ascending from top to bottom.",
      functionName: "searchMatrix",
      parameters: [
        { name: "matrix", type: "number[][]", description: "m x n sorted matrix" },
        { name: "target", type: "number", description: "Target integer to find" }
      ],
      returnType: "boolean",
      constraints: ["m == matrix.length", "n == matrix[i].length", "1 <= m, n <= 300", "-10^9 <= matrix[i][j] <= 10^9", "-10^9 <= target <= 10^9"],
      examples: [
        { input: "matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 5", output: "true", explanation: "5 is present at position (1,1)." },
        { input: "matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 20", output: "false", explanation: "20 is not found." },
        { input: "matrix = [[-5]], target = -5", output: "true", explanation: "Single element match." },
        { input: "matrix = [[-5]], target = -10", output: "false", explanation: "Not present." }
      ],
      optimalSolution: `function searchMatrix(matrix, target) {\n  if (!matrix || matrix.length === 0) return false;\n  const m = matrix.length, n = matrix[0].length;\n  let r = 0, c = n - 1;\n  while (r < m && c >= 0) {\n    if (matrix[r][c] === target) return true;\n    if (matrix[r][c] > target) c--;\n    else r++;\n  }\n  return false;\n}`,
      optimalTimeComplexity: "O(m + n)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function searchMatrix(matrix, target) {\n  for (let r = 0; r < matrix.length; r++) {\n    let left = 0, right = matrix[0].length - 1;\n    while (left <= right) {\n      const mid = Math.floor((left + right) / 2);\n      if (matrix[r][mid] === target) return true;\n      if (matrix[r][mid] < target) left = mid + 1;\n      else right = mid - 1;\n    }\n  }\n  return false;\n}`,
      suboptimalTimeComplexity: "O(m * log n)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Starting search at (0,0) or (m-1,n-1) where both adjacent moves either both increase or both decrease values.", "Treating matrix as flattened 1D array (Search a 2D Matrix I assumption)."],
      hints: [
        "Start at top-right corner `(0, n - 1)` or bottom-left corner `(m - 1, 0)`.",
        "From top-right: moving left decreases the value, moving down increases the value.",
        "This prunes an entire row or column at every step in O(1) time."
      ],
      oracleFn: (matrix: number[][], target: number) => {
        if (!matrix || matrix.length === 0) return false;
        const m = matrix.length, n = matrix[0].length;
        let r = 0, c = n - 1;
        while (r < m && c >= 0) {
          if (matrix[r][c] === target) return true;
          if (matrix[r][c] > target) c--;
          else r++;
        }
        return false;
      },
      testCases: {
        functional: [
          [[[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]], 5],
          [[[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]], 20],
          [[[-5]], -5],
          [[[-5]], -10]
        ],
        boundary: [
          [[[1, 2, 3, 4, 5]], 3],
          [[[1, 2, 3, 4, 5]], 6],
          [[[1], [2], [3], [4], [5]], 5],
          [[[1], [2], [3], [4], [5]], 0]
        ],
        adversarial: [
          [[[1, 3, 5], [2, 4, 6]], 4],
          [[[1, 3, 5], [2, 4, 6]], 7]
        ],
        stress: [
          [Array.from({ length: 40 }, (_, r) => Array.from({ length: 40 }, (_, c) => r * 50 + c * 2)), 104],
          [Array.from({ length: 40 }, (_, r) => Array.from({ length: 40 }, (_, c) => r * 50 + c * 2)), 105]
        ]
      }
    }),

    // 303. Lucky Numbers in a Matrix
    createProblem({
      num: 303,
      title: "Lucky Numbers in a Matrix",
      slug: "lucky-numbers-in-a-matrix",
      level: 13,
      difficulty: "EASY",
      topic: "Matrix",
      patternSlug: "matrix-grid",
      estimatedTimeMin: 15,
      statement: "Given an `m x n` matrix of distinct numbers, return all lucky numbers in the matrix in any order.\n\nA lucky number is an element of the matrix such that it is the minimum element in its row and maximum in its column.",
      functionName: "luckyNumbers",
      parameters: [{ name: "matrix", type: "number[][]", description: "m x n matrix of distinct integers" }],
      returnType: "number[]",
      constraints: ["m == matrix.length", "n == matrix[i].length", "1 <= m, n <= 50", "1 <= matrix[i][j] <= 10^5", "All elements in the matrix are distinct."],
      examples: [
        { input: "matrix = [[3,7,8],[9,11,13],[15,16,17]]", output: "[15]", explanation: "15 is the min in row 2 and max in col 0." },
        { input: "matrix = [[1,10,4,2],[9,3,8,7],[15,16,17,12]]", output: "[12]", explanation: "12 is the only lucky number." },
        { input: "matrix = [[7,8],[1,2]]", output: "[7]", explanation: "7 is min in row 0 and max in col 0." },
        { input: "matrix = [[1]]", output: "[1]", explanation: "Single element is lucky." }
      ],
      optimalSolution: `function luckyNumbers(matrix) {\n  const m = matrix.length, n = matrix[0].length;\n  const rowMins = new Set();\n  for (let r = 0; r < m; r++) {\n    let minVal = Infinity;\n    for (let c = 0; c < n; c++) {\n      if (matrix[r][c] < minVal) minVal = matrix[r][c];\n    }\n    rowMins.add(minVal);\n  }\n  const res = [];\n  for (let c = 0; c < n; c++) {\n    let maxVal = -Infinity;\n    for (let r = 0; r < m; r++) {\n      if (matrix[r][c] > maxVal) maxVal = matrix[r][c];\n    }\n    if (rowMins.has(maxVal)) res.push(maxVal);\n  }\n  return res;\n}`,
      optimalTimeComplexity: "O(m * n)",
      optimalSpaceComplexity: "O(m)",
      suboptimalSolution: `function luckyNumbers(matrix) {\n  const res = [];\n  for (let r = 0; r < matrix.length; r++) {\n    for (let c = 0; c < matrix[0].length; c++) {\n      const val = matrix[r][c];\n      const isRowMin = matrix[r].every(v => v >= val);\n      const isColMax = matrix.every(row => row[c] <= val);\n      if (isRowMin && isColMax) res.push(val);\n    }\n  }\n  return res;\n}`,
      suboptimalTimeComplexity: "O(m * n * (m + n))",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Re-scanning rows and columns inside nested loops resulting in O(mn(m+n)) runtime.", "Confusing min in row with max in row."],
      hints: [
        "Compute the minimum element in each row.",
        "Compute the maximum element in each column.",
        "Any number that belongs to both sets is a lucky number (at most 1 lucky number exists in any distinct matrix)."
      ],
      oracleFn: (matrix: number[][]) => {
        const m = matrix.length, n = matrix[0].length;
        const rowMins = new Set<number>();
        for (let r = 0; r < m; r++) {
          let minVal = Infinity;
          for (let c = 0; c < n; c++) {
            if (matrix[r][c] < minVal) minVal = matrix[r][c];
          }
          rowMins.add(minVal);
        }
        const res: number[] = [];
        for (let c = 0; c < n; c++) {
          let maxVal = -Infinity;
          for (let r = 0; r < m; r++) {
            if (matrix[r][c] > maxVal) maxVal = matrix[r][c];
          }
          if (rowMins.has(maxVal)) res.push(maxVal);
        }
        return res;
      },
      testCases: {
        functional: [
          [[[3, 7, 8], [9, 11, 13], [15, 16, 17]]],
          [[[1, 10, 4, 2], [9, 3, 8, 7], [15, 16, 17, 12]]],
          [[[7, 8], [1, 2]]],
          [[[1]]]
        ],
        boundary: [
          [[[1, 2, 3, 4]]],
          [[[4], [3], [2], [1]]],
          [[[1, 2], [3, 4]]],
          [[[4, 3], [2, 1]]]
        ],
        adversarial: [
          [[[3, 6], [7, 1], [5, 2], [4, 8]]],
          [[[10, 20, 30], [5, 15, 25], [1, 2, 3]]]
        ],
        stress: [
          [Array.from({ length: 20 }, (_, r) => Array.from({ length: 20 }, (_, c) => (r + 1) * 30 + (c + 1)))],
          [Array.from({ length: 30 }, (_, r) => Array.from({ length: 30 }, (_, c) => r * 100 + (30 - c)))]
        ]
      }
    }),

    // 304. Island Perimeter
    createProblem({
      num: 304,
      title: "Island Perimeter",
      slug: "island-perimeter",
      level: 13,
      difficulty: "EASY",
      topic: "Matrix",
      patternSlug: "matrix-grid",
      estimatedTimeMin: 15,
      statement: "You are given `row x col` `grid` representing a map where `grid[i][j] = 1` represents land and `grid[i][j] = 0` represents water.\n\nGrid cells are connected horizontally/vertically (not diagonally). The grid is completely surrounded by water, and there is exactly one island (i.e., one or more connected land cells).\n\nThe island doesn't have \"lakes\", meaning the water inside isn't connected to the water around the island. One cell is a square with side length 1. The grid is rectangular, width and height don't exceed 100. Determine the perimeter of the island.",
      functionName: "islandPerimeter",
      parameters: [{ name: "grid", type: "number[][]", description: "Binary grid map" }],
      returnType: "number",
      constraints: ["row == grid.length", "col == grid[i].length", "1 <= row, col <= 100", "grid[i][j] is 0 or 1.", "There is exactly one island in grid."],
      examples: [
        { input: "grid = [[0,1,0,0],[1,1,1,0],[0,1,0,0],[1,1,0,0]]", output: "16", explanation: "The 16 perimeter borders." },
        { input: "grid = [[1]]", output: "4", explanation: "Single cell perimeter is 4." },
        { input: "grid = [[1,0]]", output: "4", explanation: "Single cell with water adjacent." },
        { input: "grid = [[1,1],[1,1]]", output: "8", explanation: "2x2 block perimeter is 8." }
      ],
      optimalSolution: `function islandPerimeter(grid) {\n  const rows = grid.length, cols = grid[0].length;\n  let perimeter = 0;\n  for (let r = 0; r < rows; r++) {\n    for (let c = 0; c < cols; c++) {\n      if (grid[r][c] === 1) {\n        perimeter += 4;\n        if (r > 0 && grid[r - 1][c] === 1) perimeter -= 2;\n        if (c > 0 && grid[r][c - 1] === 1) perimeter -= 2;\n      }\n    }\n  }\n  return perimeter;\n}`,
      optimalTimeComplexity: "O(rows * cols)",
      optimalSpaceComplexity: "O(1)",
      suboptimalSolution: `function islandPerimeter(grid) {\n  const rows = grid.length, cols = grid[0].length;\n  let perimeter = 0;\n  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];\n  for (let r = 0; r < rows; r++) {\n    for (let c = 0; c < cols; c++) {\n      if (grid[r][c] === 1) {\n        for (const [dr, dc] of dirs) {\n          const nr = r + dr, nc = c + dc;\n          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || grid[nr][nc] === 0) {\n            perimeter++;\n          }\n        }\n      }\n    }\n  }\n  return perimeter;\n}`,
      suboptimalTimeComplexity: "O(rows * cols)",
      suboptimalSpaceComplexity: "O(1)",
      commonMistakes: ["Subtracting 1 instead of 2 for shared boundaries.", "Missing grid boundary edges when checking adjacent cells."],
      hints: [
        "Each land cell adds 4 to the perimeter.",
        "Each shared edge between two adjacent land cells removes 2 from the total perimeter (1 from each cell).",
        "Iterate through grid: if cell is 1, add 4; if top neighbor is 1, subtract 2; if left neighbor is 1, subtract 2."
      ],
      oracleFn: (grid: number[][]) => {
        const rows = grid.length, cols = grid[0].length;
        let perimeter = 0;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (grid[r][c] === 1) {
              perimeter += 4;
              if (r > 0 && grid[r - 1][c] === 1) perimeter -= 2;
              if (c > 0 && grid[r][c - 1] === 1) perimeter -= 2;
            }
          }
        }
        return perimeter;
      },
      testCases: {
        functional: [
          [[[0, 1, 0, 0], [1, 1, 1, 0], [0, 1, 0, 0], [1, 1, 0, 0]]],
          [[[1]]],
          [[[1, 0]]],
          [[[1, 1], [1, 1]]]
        ],
        boundary: [
          [[[1, 1, 1, 1]]],
          [[[1], [1], [1], [1]]],
          [[[0, 1, 1], [1, 1, 0]]],
          [[[1, 1, 1], [1, 0, 1], [1, 1, 1]]]
        ],
        adversarial: [
          [[[0, 1, 0], [1, 1, 1], [0, 1, 0]]],
          [[[1, 1, 1, 1], [1, 0, 0, 1], [1, 1, 1, 1]]]
        ],
        stress: [
          [Array.from({ length: 30 }, () => Array.from({ length: 30 }, () => 1))],
          [Array.from({ length: 40 }, (_, r) => Array.from({ length: 40 }, (_, c) => (r === 20 ? 1 : 0)))]
        ]
      }
    })
  ];

  return {
    level: 13,
    levelTitle: "Level 13 — Matrix & Grid Traversal",
    topic: "Matrix & Grid Traversal, 2D Flood Fill, Directional Search, and Island Connectivity",
    problems
  };
}
