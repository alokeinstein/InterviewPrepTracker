# Database Schema & Relational Modeling

## 1. Relational Principles
- **Normalized Tables**: Real entities for Parts, Chapters, Sections, Concepts, Problems, Patterns, Attempts, Submissions, Mistakes, and Reviews.
- **Mastery Representation**: Concrete numerical dimensions (0-100) instead of vague text strings.
- **Indexed Access Paths**:
  - `(userId, nextReviewDate, itemType)` on `RevisionItem` for instant daily queue generation.
  - `(problemId, userId, createdAt)` on `DSASubmission`.
  - `(conceptId, userId)` on `ConceptMastery`.
  - `(userId, patternId)` on `PatternWeakness`.

## 2. Core Entities & Enums

### Enums
- `Role`: `USER`, `ADMIN`
- `Difficulty`: `EASY`, `MEDIUM`, `HARD`
- `ItemType`: `DSA_PROBLEM`, `CONCEPT`, `MISTAKE_INVARIANT`
- `SubmissionStatus`: `ACCEPTED`, `WRONG_ANSWER`, `TIME_LIMIT_EXCEEDED`, `RUNTIME_ERROR`, `COMPILE_ERROR`
- `RelationType`: `PREREQUISITE`, `RELATED_TO`, `CONTRASTS_WITH`, `BUILDS_UPON`
- `InterviewType`: `DSA_CODING`, `SYSTEM_DESIGN`
- `SessionStatus`: `IN_PROGRESS`, `COMPLETED`, `ABANDONED`

### Relational Schema Summary
- **User**: Profile, streak count, total study minutes, interview readiness score.
- **BookPart, Chapter, Section, Concept**: Strict hierarchy mirroring Martin Kleppmann's DDIA.
- **ConceptMastery**: Per-user tracking of `recognition`, `understanding`, `recall`, `application`, and `explanation` scores.
- **ConceptRelation**: Graph edges between system design concepts.
- **DSAProblem & DSAPattern**: 498 curated problems with Level (1-23), difficulty, optimal time/space complexity, and pattern associations.
- **TestCase**: Sample and hidden validation tests.
- **DSASubmission**: Full code history, test outcome, runtime, memory, and hint dependency count.
- **MistakeEntry**: Invariant violation journal, root cause category, and corrective principle.
- **RevisionItem**: SuperMemo SM-2 parameters (`repetitionNumber`, `intervalDays`, `easeFactor`, `nextReviewDate`).
- **ArchitectureDesign & ArchitectureVersion**: Canvas nodes, connections, and AI review feedback.
- **MockInterviewSession & InterviewEvaluation**: Socratic dialogue, message history, and multi-factor rubrics.
- **DailyPlan & FocusSession**: Anti-procrastination queue, timer tracking, and session recovery logs.
