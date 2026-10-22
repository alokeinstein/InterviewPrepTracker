# Personal Interview Training OS

> A serious, production-grade interview preparation operating system designed for software engineers targeting Senior/Staff engineering roles (Google, Microsoft, Meta, Amazon) while eliminating passive learning and procrastination.

---

## 🧠 Agent Memory & Governance System
All Antigravity agents follow strict session startup, architecture standards, and audit logs defined in [`.agent-memory/`](file:///c:/Users/alokz/Downloads/Projects/Alok/InterviewPrepTracker/.agent-memory/):
- [Master Operational Entrypoint (`agents.md`)](file:///c:/Users/alokz/Downloads/Projects/Alok/InterviewPrepTracker/.agent-memory/agents.md)
- [Append-Only Audit Log (`changes.log`)](file:///c:/Users/alokz/Downloads/Projects/Alok/InterviewPrepTracker/.agent-memory/changes.log)
- [Architecture & Standards (`architecture_standards.md`)](file:///c:/Users/alokz/Downloads/Projects/Alok/InterviewPrepTracker/.agent-memory/architecture_standards.md)
- [Database Migrations (`database_migrations.md`)](file:///c:/Users/alokz/Downloads/Projects/Alok/InterviewPrepTracker/.agent-memory/database_migrations.md)
- [Architecture Decision Records (`decisions.md` - Lazy Loaded)](file:///c:/Users/alokz/Downloads/Projects/Alok/InterviewPrepTracker/.agent-memory/decisions.md)

---

## 🎯 Central Philosophy
**"Passive reading is not learning."**

This operating system continuously transforms technical consumption into active retrieval:
$$\text{READ} \longrightarrow \text{UNDERSTAND} \longrightarrow \text{THINK} \longrightarrow \text{PREDICT} \longrightarrow \text{CHECK} \longrightarrow \text{APPLY} \longrightarrow \text{RECALL} \longrightarrow \text{REVISE}$$

---

## 🏗️ Technical Stack & Architecture
- **Framework**: Next.js 15+ (App Router, Server Actions)
- **Database**: PostgreSQL 18
- **ORM**: Prisma Client with strict relational models & foreign keys
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS & Radix UI (Developer-focused dark mode)
- **Execution Sandbox**: In-process VM sandbox with 2000ms timeout protection & memory bounds
- **Spaced Repetition**: SuperMemo SM-2 algorithm integrated with Personal Mistake Journal
- **AI Mentoring**: Socratic AI Provider abstraction (Google Gemini / OpenAI / Offline Mock)

---

## 🚀 Key Modules Built

### 1. Command Center / Today Dashboard (`/`)
- Direct answer to **"What should I do right now?"**
- Prominent **START TRAINING** trigger for the Next Best Action.
- Time-budgeted session filters: `[10 min]` `[20 min]` `[30 min]` `[45 min]` `[60 min]`.
- **Procrastination Recovery Mode**: Detects 3+ days of inactivity and presents a low-friction 7-minute recovery session without guilt or broken-streak shaming.

### 2. System Design Academy (`/system-design`)
- Faithful grounding in Martin Kleppmann's *Designing Data-Intensive Applications* across all 11 chapters:
  - **Part I: Foundations of Data Systems** (Chapters 1–4)
  - **Part II: Distributed Data** (Chapters 5–9)
  - **Part III: Derived Data** (Chapters 10–11)
- **9-Step Active Learning Loop**:
  1. Rigorous Architectural Definition
  2. Why does this exist? (First principles)
  3. Interactive Simulator (Replication lag, Quorum $w+r>n$)
  4. Stop & Think Predictive Question
  5. Socratic AI Feedback
  6. Deepen & Contrast Alternative Patterns
  7. Production Scale Scenario Drill
  8. 60-Second Interview Explanation Pitch
  9. Adaptive Mastery Recalculation & Spaced Retrieval

### 3. DSA Arena (`/dsa`)
- **498 Curated LeetCode Problems** systematically organized into **23 Skill Dependency Levels**:
  - Levels 1–4: Fundamentals, Hashing, Two Pointers, Sliding Window
  - Levels 5–9: Binary Search, Linked Lists, Monotonic Stack, Intervals, Heaps
  - Levels 10–13: Trees, Advanced Trees, Backtracking, Matrix
  - Levels 14–16: Graph BFS/DFS, Topo Sort, Union Find, Advanced Greedy
  - Levels 17–20: 1D Dynamic Programming, 2D DP, State Machines, Shortest Paths
  - Levels 21–23: Advanced Extensions, Trie/String, System Data Structure Design
- **15-Step Mental Workflow** checklist integrated into every problem workspace.
- **Multi-Level Hint System**: Levels 1 to 5 (Subtle nudge $\to$ Pattern $\to$ Data structure $\to$ Algorithm $\to$ Pseudocode).
- **Mistake Journal**: Directly records violated invariants, root causes, and schedules next-day spaced retrieval.

### 4. Revision Engine (`/revision`)
- Adaptive SM-2 spaced repetition queue.
- Conceals reference answers to force active retrieval before showing solutions.
- Quality score rating ($0–5$) updates ease factor and scheduling.

### 5. System Design Whiteboard Canvas (`/whiteboard`)
- Architecture palette: Client, CDN, Load Balancer, API Server, Redis Cache, Postgres Primary, Read Replica, Kafka Queue, Object Storage.
- Directional edges with protocol labels and sync/async badges.
- Automated AI Architecture Review: Identifies Single Points of Failure (SPOFs), bottlenecks, and scalability score.

### 6. AI Mock Interview Center (`/interview`)
- Timed 45-min DSA Coding and 60-min System Design Mock interviews.
- Conversational Socratic AI interviewer that guides approach before code.
- 5-factor rubric scoring: Problem Solving, Communication, Complexity, Edge Cases, Implementation.

### 7. Analytics & Explainable Readiness (`/analytics`)
- Readiness score breakdown based on verifiable evidence.
- Pattern weakness radar with targeted remediation drills.

---

## ⚡ Quickstart Guide

### 1. Database & Environment Setup
Ensure PostgreSQL is running locally on port 5432:
```bash
# Verify .env
DATABASE_URL="postgresql://postgres:root@localhost:5432/interview_os?schema=public"
```

### 2. Run Database Migrations & Ingestion
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 3. Run Automated Tests
```bash
npm test
# Or: npx tsx --test tests/interview-os.test.ts
```

### 4. Start the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
