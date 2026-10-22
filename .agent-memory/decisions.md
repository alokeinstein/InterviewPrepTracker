<!-- LAZY LOAD NOTICE: DO NOT READ ON STARTUP. ONLY CONSULT ON REGRESSIONS OR ARCHITECTURAL REFACTORING -->

# Architecture Decision Records (ADRs)

> **LAZY-LOAD DIRECTIVE:** Do NOT load or read this file during normal session startup. Only consult this file if a recurring regression occurs or before refactoring core architecture patterns.

---

## ADR 001: Dedicated Multi-Page Level Routing vs Inline Expansion
- **Status:** Accepted (2026-10-21)
- **Context:** Previously, clicking a level card on `/dsa` rendered problems directly below the 23 level cards via URL query params (`/dsa?level=1`). This cluttered the view, caused massive vertical scrolling, and made sharing specific level URLs cumbersome.
- **Decision:** Separate the level navigation into dedicated routes `/levels/[levelId]`. The main `/dsa` view serves solely as a high-level roadmap and progress overview. Clicking any level navigates directly to `/levels/[levelId]`.
- **Consequences:** Cleaner separation of concerns, faster initial page render on `/dsa`, clean direct URLs for levels, and full layout space on `/levels/[levelId]` for rich problem cards with telemetry.

---

## ADR 002: Multi-Modal Spaced Repetition Practice Schema
- **Status:** Accepted (2026-10-21)
- **Context:** LeetCode preparation involves different cognitive phases: first-time implementation requires coding in the IDE, secondary review reinforces mental tracing by hand, and tertiary review relies on fast pattern recognition in mind.
- **Decision:** Extend the `RevisionItem` and `RevisionAttempt` models with a `PracticeMode` enum (`CODE`, `HAND`, `MENTAL`), mode-specific counts, and a progressive interval scheduling algorithm that automatically updates the `recommendedMode` based on repetition stage and struggle status.
- **Consequences:** Provides exact telemetry on whether problems were coded, dry-run on paper, or recalled mentally, allowing the candidate to review 50+ problems in an hour mentally without typing fatigue.

---

## ADR 003: Batched Deep Problem Generation with High-Density Test Suites
- **Status:** Accepted (2026-10-21)
- **Context:** The 498-problem curriculum requires 10 to 20+ test cases per problem (standard, boundary, adversarial, stress), dual reference solutions (100% optimal and 50% sub-optimal), and 5 progressive hints. Generating all 498 in a single context pass risks token truncation.
- **Decision:** Execute problem generation in high-density batches. Batch 1 covers Levels 1 through 6 with 100% complete test cases, dual solutions, and 5-stage hints. Subsequent levels are systematically generated in subsequent passes.
- **Consequences:** Guarantees production-grade test coverage (no placeholders or truncated tests) and reliable evaluation against runtime benchmarks.

---

## ADR 004: Dual-Axis Independent Workspace Splitters with Pointer Capture & Monaco ResizeObserver
- **Status:** Accepted (2026-10-22)
- **Context:** LeetCode-style layouts require responsive vertical division between description and code, and horizontal division between code and console. Previous layouts had fixed dimensions, and dragging over Monaco editor iframes caused mouse pointer dropouts.
- **Decision:** Implement dual independent splitter handles with `setPointerCapture` / `releasePointerCapture`, ARIA accessibility roles (`role="separator"` with keyboard arrow handlers), and an active `ResizeObserver` listener on the editor container that directly invokes Monaco's `layout()` method. Persist dimensions in `localStorage`.
- **Consequences:** Flawless 60fps drag resize without mouse drops, accessible keyboard controls, and persistent candidate workspace dimensions across problem switches.

---

## ADR 005: Client-Side IndexedDB Checkpoints & Autosave with LocalStorage Fallback
- **Status:** Accepted (2026-10-22)
- **Context:** Candidates working through complex algorithms need continuous autosave, the ability to test alternative approaches without losing working code, and recovery if browser crashes, without spamming the backend API with unaccepted drafts.
- **Decision:** Implement a client-side storage layer using IndexedDB (`InterviewPrepOS_Storage`) with an automated fallback to `localStorage`. Provide named checkpoints with timestamps and immutable accepted solution snapshots.
- **Consequences:** Instantaneous offline autosave, 0 database load for unsubmitted typing, safe code experimentation via checkpoints modal, and zero data loss.

---

## ADR 006: Dedicated Level View Mode Switcher (Simplistic vs Detailed Telemetry) & Main Dashboard Decluttering
- **Status:** Accepted (2026-10-22)
- **Context:** Presenting both a 500-question catalog and 23 level cards on `/dsa` caused severe visual clutter and performance overhead. Furthermore, on `/levels/[levelId]`, candidates felt the full telemetry problem cards (with 3 mode buttons, struggle check, SRS stages) were too overwhelming when quickly browsing questions.
- **Decision:**
  1. Eliminate the 500-question table from `/dsa`, turning the page into an uncluttered curriculum progression hub with enlarged 3-column level cards, search, and status filters.
  2. On `/levels/[levelId]`, introduce an interactive Card Layout toggle supporting **Simplistic** (clean cards with ID, level, difficulty, title, pattern, solved/time, and practice button) and **Detailed Telemetry** modes, defaulting to Simplistic and persisting preference in `localStorage` (`dsa_level_card_view_mode`).
- **Consequences:** Fast, intuitive navigation. Clean visual hierarchy for candidates focusing solely on solving problems, while retaining full Spaced Repetition telemetry at the flip of a switch.
