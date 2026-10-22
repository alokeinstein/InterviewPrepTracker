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
