# Database Migrations & Schema Evolution Log

This file tracks all database schema changes, Prisma migrations, and lock-down protocols for PostgreSQL (`interview_os`).

---

## Migration Lockdown Rules
1. **Never bypass Prisma Migrate:** All schema changes must be applied via `npx prisma migrate dev --name <migration_name>` or recorded baseline migrations.
2. **Never run destructive push:** Do not run `prisma db push --accept-data-loss` in production or development without preserving existing table contents.
3. **Keep SQL files version-controlled:** All files in `prisma/migrations/` must be checked into Git.
4. **Log every schema update here:** Whenever a field or relation is added, record it below with date, migration name, and rationale.

---

## Migration History

### Migration 0: `0_init` (Baseline Migration)
- **Date:** 2026-10-21
- **Status:** Baseline applied to existing PostgreSQL database
- **Tables:** `User`, `BookPart`, `Chapter`, `Section`, `SectionProgress`, `Concept`, `ConceptRelation`, `ConceptMastery`, `DsaPattern`, `DsaProblem`, `TestCase`, `DsaSubmission`, `MistakeEntry`, `RevisionItem`, `RevisionAttempt`, `ArchitectureDesign`, `ArchitectureVersion`, `MockInterview`, `InterviewMessage`, `InterviewEvaluation`, `DailyPlan`, `FocusSession`, `PatternWeakness`.

### Migration 1: `20261021183000_add_multimodal_revision_and_suboptimal_benchmarks`
- **Date:** 2026-10-21
- **Status:** Applied & Generated (@prisma/client v5.22.0)
- **Rationale:** Enable Multi-Modal practice telemetry (`CODE`, `HAND`, `MENTAL`), breakdown counters, progressive revision staging, and dual reference solutions (sub-optimal 50% benchmark).
- **Changes:**
  - Added enum `PracticeMode { CODE, HAND, MENTAL }`
  - Added fields to `RevisionItem`:
    - `codePracticeCount Int @default(0)`
    - `handPracticeCount Int @default(0)`
    - `mentalPracticeCount Int @default(0)`
    - `recommendedMode PracticeMode @default(CODE)`
    - `currentStage Int @default(0)`
  - Added fields to `RevisionAttempt`:
    - `mode PracticeMode @default(CODE)`
    - `struggled Boolean @default(false)`
    - `notes String? @db.Text`
  - Added fields to `DsaProblem`:
    - `suboptimalSolution String? @db.Text`
    - `suboptimalTimeComplexity String?`
    - `suboptimalSpaceComplexity String?`
  - Added index `RevisionItem_userId_dsaProblemId_idx`.

### Migration 2: `20261021204000_add_execution_model_design`
- **Date:** 2026-10-21
- **Status:** Applied & Generated (@prisma/client v5.22.0)
- **Rationale:** Enable first-class object-oriented class execution for 28 design and stateful data structure problems (e.g., `MyHashSet`, `LRUCache`, `MinStack`, `MedianFinder`, `Twitter`).
- **Changes:**
  - Added enum value `DESIGN` to `ExecutionModel` in PostgreSQL.

