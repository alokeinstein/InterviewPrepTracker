# DSA Problem Arena & Code Execution

## 1. 15-Step Mental Workflow
Every problem trains the candidate through the disciplined 15-step interview thought process:
1. Understand problem statement & I/O
2. Generate small handcrafted examples
3. Identify variable states & invariants
4. Formulate brute force approach
5. Analyze brute force time/space complexity
6. Pinpoint the computational bottleneck
7. Match optimal pattern (e.g., Sliding Window, Monotonic Stack)
8. Select optimal data structure
9. Design optimal algorithm
10. Dry run with edge cases (empty, duplicates, overflow)
11. State loop invariants
12. Implement clean modular code
13. Run tests & debug
14. Explain logic to interviewer
15. Post-solution reflection & mistake logging

## 2. Code Execution Architecture
- Abstract `CodeExecutionService` decoupling UI from runtime.
- In-process isolated JavaScript/TypeScript runner with timeout (2000ms), memory checks, and structured test evaluation.
- Extensible interface allowing future Docker / isolated container judge backends (Judge0 / Firecracker).
- Tiered hint system (Levels 1–5: subtle nudge $\to$ pattern $\to$ data structure $\to$ algorithm $\to$ pseudocode).
- Mistake journal logging category, violated invariant, and spaced repetition scheduling.
