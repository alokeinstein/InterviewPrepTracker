# Agent Memory & Governance System — Master Entrypoint

> **CRITICAL AGENT DIRECTIVE:** Every Antigravity agent instance MUST follow this document at the start of any new session or task.

---

## 1. Session Startup Protocol (Mandatory Read Order)
At the start of every new chat window or task, the agent **MUST** read files in this exact sequence:
1. [`.agent-memory/agents.md`](file:///c:/Users/alokz/Downloads/Projects/Alok/InterviewPrepTracker/.agent-memory/agents.md) — Current state, active roadmap, and operational rules.
2. [`.agent-memory/changes.log`](file:///c:/Users/alokz/Downloads/Projects/Alok/InterviewPrepTracker/.agent-memory/changes.log) — The last 20–30 entries to understand recent additions, migrations, and bugfixes.
3. [`.agent-memory/architecture_standards.md`](file:///c:/Users/alokz/Downloads/Projects/Alok/InterviewPrepTracker/.agent-memory/architecture_standards.md) — Architecture patterns, Next.js conventions, and database standards.

---

## 2. LAZY-LOAD RULE FOR `decisions.md` (CRITICAL)
- **DO NOT** read [`.agent-memory/decisions.md`](file:///c:/Users/alokz/Downloads/Projects/Alok/InterviewPrepTracker/.agent-memory/decisions.md) during normal startup or routine feature execution (to save context tokens and avoid unnecessary overhead).
- **ONLY read `decisions.md` when:**
  1. Something is breaking and standard fixes are failing (repeated errors, regressions, circular dependency issues).
  2. You are about to refactor, revert, or overwrite an existing core pattern, schema design, or library choice and need to know *why* the previous agent built it that way.

---

## 3. Post-Feature Completion Protocol (Mandatory Write Rules)
No feature, bugfix, or schema change is considered **"Done"** until the agent updates:
1. [`.agent-memory/changes.log`](file:///c:/Users/alokz/Downloads/Projects/Alok/InterviewPrepTracker/.agent-memory/changes.log) — Append entry with exact timestamp, date, files touched, DB impact, and summary.
2. [`.agent-memory/agents.md`](file:///c:/Users/alokz/Downloads/Projects/Alok/InterviewPrepTracker/.agent-memory/agents.md) — Update the "Current Project Snapshot" and "Next Pending Tasks" sections.
3. [`.agent-memory/decisions.md`](file:///c:/Users/alokz/Downloads/Projects/Alok/InterviewPrepTracker/.agent-memory/decisions.md) — Record an ADR **ONLY** if a non-obvious architectural trade-off or tricky workaround was implemented.
4. [`.agent-memory/database_migrations.md`](file:///c:/Users/alokz/Downloads/Projects/Alok/InterviewPrepTracker/.agent-memory/database_migrations.md) — Update if any migration or schema change occurred.

---

## 4. Prisma & Database Migration Lockdown Rule
- Whenever `npx prisma generate` or `npx prisma migrate dev` / `npx prisma migrate deploy` is executed, the SQL migration files inside `prisma/migrations/` **MUST** be preserved, tracked in Git, and logged in [`.agent-memory/database_migrations.md`](file:///c:/Users/alokz/Downloads/Projects/Alok/InterviewPrepTracker/.agent-memory/database_migrations.md).
- **NEVER** run `prisma db push` in a way that bypasses migration history or deletes existing migration folders without explicit user approval.
- Ensure all model extensions are backward compatible with existing records in PostgreSQL (`interview_os`).

---

## 5. Current Project Snapshot

- **Project Name:** Personal Interview Training OS / DSA Arena
- **Stack:** Next.js 15 (App Router), React 19, TypeScript 5, Tailwind CSS 3, Prisma 5, PostgreSQL (`interview_os`).
- **Core Modules:**
  - **DSA Arena (`/dsa` & `/levels/[levelId]`):** 23 Level progression grid, dedicated level pages, problem cards with telemetry, code execution sandbox, optimality benchmark.
  - **Revision Engine (`/revision`):** Spaced repetition SM-2 engine, multi-modal practice tracking (`IDE`, `By Hand`, `In Mind`), daily queue of Due Today & Overdue problems, practice history logs.
  - **System Design Academy (`/system-design`):** DDIA 11 chapters, concepts, interactive diagrams.
  - **Whiteboard & Mock Interview (`/whiteboard`, `/interview`):** Freehand canvas, simulated mock interviews.
- **Problem Bank:** 498 canonical problems cataloged from `LeetCode_500_Google_Microsoft_Roadmap.md`.

---

## 6. Active Roadmap & Pending Tasks

- [x] **Milestone 0:** Agent Memory & Governance System initialized (`.agent-memory/`).
- [x] **Milestone 1:** Dedicated Level Page Routing (`/levels/[levelId]`) & Removal of inline question rendering on main `/dsa` dashboard.
- [x] **Milestone 2:** Rich Problem Card UI with practice telemetry & quick-log buttons.
- [x] **Milestone 3:** Multi-Modal Practice Tracking (`IDE`, `By Hand`, `Mental`) & Spaced Repetition Progression Cadence.
- [x] **Milestone 4:** Dedicated Revision Engine Dashboard View (`/revision`) with daily queue, history log, and multi-filter controls.
- [x] **Phase 0 (Foundation Engine):** Added `ExecutionModel.DESIGN` to Prisma schema/PostgreSQL migration, upgraded `runnerWorker.js` to execute class methods sequentially, verified with `MyHashSet` and `LRUCache` test suite.
- [x] **Phase 1 (Batch 1 — Levels 1–6):** 143 problems with 1,628 test cases, 3–4 rich examples with step-by-step explanations, dual optimal/suboptimal solutions, class-based design models for #140 and #141. 100% verified via automated execution runner.
- [x] **Phase 2 (Batch 2 — Levels 7–10):** Stack & Monotonic Queue, Intervals & Greedy, Heap & Priority Queue, Trees Foundations (90 problems with 1,070 test cases, 3–4 examples, class templates for MinStack, Queues, MedianFinder, Twitter, Codec). 100% verified via automated execution runner.
- [x] **Phase 3 (Batch 3 — Levels 11–15):** Trees Advanced, Backtracking, Matrix & Grid, Graph BFS/DFS, Topological Sort & Union Find (107 problems with 1,246 test cases, 3–4 examples, class template for #255 Codec). 100% verified via automated execution runner.
- [x] **Phase 4 (Batch 4 — Levels 16–20):** Advanced Greedy, DP 1D, DP 2D, Advanced DP, Shortest Paths (85 problems with 1,028 test cases, 3–4 examples, optimal/suboptimal benchmarks). 100% verified via automated execution runner.
- [x] **Levels 1–20 Deep Execution Verification Audit:** All 425 problems and 4,972 test cases verified end-to-end against the sandbox execution worker. 100% passing (425/425 ACCEPTED).
- [x] **Phase 5 (Batch 5 — Levels 21–23):** Advanced Arrays, Trie/String, Design Systems (#498 Design HashSet, #497 HashMap, #496 Deque, #495 BrowserHistory, #494 UndergroundSystem, #491 RangeModule, #490-488 MyCalendar I-III, #458 SnapshotArray, #455 TimeMap) (73 problems: #426–#498, with 865 test cases).
- [x] **100% Curriculum Completion (Milestone Achieved!):** All 498 DSA problems across all 23 levels fully generated, seeded to PostgreSQL, and 100% empirically verified in the sandbox execution runner (498/498 ACCEPTED across 5,837 test cases, 0 generic statements, 0 <3 examples, 0 <10 TC, 100% dual benchmark solutions, 0 TypeScript errors, 21/21 regression tests passing).


