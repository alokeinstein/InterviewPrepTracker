# Architecture & Engineering Standards

This document establishes the technical invariants, design system guidelines, and architectural boundaries for the Personal Interview Training OS / DSA Arena.

---

## 1. Directory Structure & App Routing Conventions
- The application uses **Next.js 15 App Router** under `src/app/`.
- **Top-Level Routes:**
  - `/` — Unified Developer Command Center & Readiness Analytics.
  - `/dsa` — DSA Arena Level progression view (Level Cards grid only; clean overview).
  - `/levels/[levelId]` — **Dedicated Level Page** rendering problem cards for the specified curriculum level.
  - `/dsa/[slug]` — Interactive Problem Solving Workspace (Monaco/CodeMirror, execution engine, hints, telemetry).
  - `/revision` — Dedicated Spaced-Repetition & Multi-Modal Practice Dashboard.
  - `/system-design` — DDIA Knowledge Graph & System Design Academy.
  - `/whiteboard` — Visual Whiteboard & Dry-run Canvas.
  - `/interview` — AI Mock Interview Sandbox.
  - `/analytics` — Study time, streak, and weakness diagnostics.
- **Components & Features Structure:**
  - `src/components/ui/` — Atomic design primitives (Button, Card, Badge, Modal, Tabs, Progress).
  - `src/components/dsa/` — Shared DSA UI elements (LevelCardGrid, ProblemCard, etc.).
  - `src/features/` — Domain feature components (`dsa`, `revision`, `interview`, `system-design`).
  - `src/services/` — Pure backend business logic, algorithms, and orchestration (`execution`, `revision`, `ai`).
  - `src/lib/` — Shared singletons (e.g. `prisma.ts`, `utils.ts`).

---

## 2. Navigation & Level Page Separation Rule (CRITICAL)
- **Zero Inline Problem Lists on Main Dashboard:** Clicking a Level Card on `/dsa` must **never** expand or render problems below the level cards on `/dsa`. It **must** navigate to `/levels/[levelId]`.
- **Dedicated Route `/levels/[levelId]`:**
  - Must accept dynamic route parameter `levelId` (1 to 23).
  - Shows level metadata (Level number, title, pattern, completion status).
  - Renders interactive Problem Cards with complete telemetry.
  - Provides breadcrumbs back to `/dsa`.

---

## 3. Practice Modes & Telemetry Data Model
Problems support 3 distinct, first-class practice modes:
1. `CODE` (Solved in IDE): Full code implementation passing unit tests and benchmark runtime.
2. `HAND` (Solved by Hand / Dry Run / Paper / Whiteboard): Algorithmic tracing, variable state tables, and manual dry runs.
3. `MENTAL` (Looked & Solved in Mind / Pattern Recognition): Rapid pattern recall, invariant recitation, and time/space complexity derivation without typing.

### Telemetry Attributes per Problem:
- Total Practice Count (`sum of CODE + HAND + MENTAL`).
- Mode Breakdown: `codePracticeCount`, `handPracticeCount`, `mentalPracticeCount`.
- Last Practiced Timestamp: ISO DateTime + relative display.
- Next Scheduled Revision Date: Derived from SM-2 + mode cadence.
- Due Status: `DUE_TODAY`, `OVERDUE`, `UPCOMING`.
- Recommended Mode:
  - Stage 0: `Code in IDE`
  - Stage 1: `Solve by Hand`
  - Stage 2: `Solve by Hand` (Medium/Hard) or `Mental Solve` (Easy)
  - Stage 3+: `Mental Solve`

---

## 4. Spaced Repetition Cadence & Interval Algorithm
- **Stage 0 (Unseen):** Initial solve in IDE.
- **Stage 1 (1st Solve):** Next review scheduled in +1 to +3 days (based on difficulty and optimality score). Recommended: `Solve by Hand`.
- **Stage 2 (2nd Solve):** Next review scheduled in +7 days (1 week). Recommended: `Solve by Hand` or `Mental Solve`.
- **Stage 3+ (3rd+ Solve):** Expanding intervals (+14 days, +30 days). Recommended: `Mental Solve`.
- **Struggle / Hint 5 Override:** If user flags problem as struggled or consumed Hint 5, reset interval to +1 day and revert recommended mode to `Code in IDE` or `Solve by Hand`.

---

## 5. Problem Quality & Test Suite Specification
Every curriculum problem in the database must adhere to strict quality rules:
1. **Mathematical Constraints & Complete Statement:** Real LeetCode problem statements with exact bounds.
2. **10 to 20+ Test Cases per Problem:**
   - 3–4 Standard Functional Cases
   - 4–5 Boundary & Edge Cases (empty, single element, negative, duplicates, extremes)
   - 3–5 Adversarial / Trick Cases (anti-greedy, counterexamples)
   - 3–6 Large-Scale Stress Cases ($N \ge 10^4$ or $10^5$ to differentiate $O(N)$ vs $O(N^2)$)
3. **Dual Reference Solutions:**
   - Optimal Reference Solution (100% Benchmark) with asymptotic complexity.
   - Sub-Optimal Reference Solution (50% Benchmark) with complexity metadata.
4. **5-Stage Progressive Hint Engine:**
   - Hints 1–4: Progressive hints (mental model, invariant, edge case alert).
   - Hint 5: Locked reveal containing step-by-step pseudocode, explanation, and optimal code.

---

## 6. UI & Styling Standards
- Use modern dark-mode aesthetic with rich typography, glassmorphic cards, smooth transitions, and distinct badge palettes.
- Easy = Emerald / Green
- Medium = Amber / Orange
- Hard = Rose / Red
- Optimal = Indigo / Cyan
- Avoid generic browser components; use custom Tailwind + Lucide icons.
