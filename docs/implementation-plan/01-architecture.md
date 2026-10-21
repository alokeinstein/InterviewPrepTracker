# System Architecture

## 1. Architectural Philosophy
The application is designed as a **modular monolith** with clean bounded domains. This ensures high velocity, simplicity of deployment, transactional consistency, and type safety across client and server, while allowing clean separation of concerns for future service extraction.

```
┌────────────────────────────────────────────────────────┐
│                   Next.js 15+ App Router               │
├────────────────────────────────────────────────────────┤
│ Presentation Tier: UI Design System, Tailwind, Lucide  │
│ Server Actions & API Route Handlers                    │
├──────────────┬──────────────┬──────────────┬───────────┤
│ System Design│   DSA Arena  │   Revision   │ Interviews│
│    Domain    │    Domain    │    Domain    │   Domain  │
├──────────────┴──────────────┴──────────────┴───────────┤
│            Core Services & Abstraction Layer           │
│  - AIService (Gemini / OpenAI / Fallback Provider)     │
│  - CodeExecutionService (Safe In-Process Sandbox)      │
│  - SpacedRepetitionService (SM-2 Adaptive Engine)      │
│  - SessionGeneratorService (Dynamic Daily Queue)       │
├────────────────────────────────────────────────────────┤
│ Prisma ORM Client & Migrations                         │
├────────────────────────────────────────────────────────┤
│ PostgreSQL 18 Relational Database                      │
└────────────────────────────────────────────────────────┘
```

## 2. Directory Layout
```text
src/
├── app/                  # Next.js App Router pages and API routes
│   ├── (auth)/           # Authentication layout and route handlers
│   ├── (dashboard)/      # Main application dashboard
│   ├── system-design/    # DDIA Academy, concept explorer, lessons
│   ├── dsa/              # DSA Problem Arena, editor, workspace
│   ├── revision/         # Spaced repetition, active recall queue
│   ├── whiteboard/       # Architecture whiteboard canvas
│   ├── interview/        # AI Interviewer & Mock interview sessions
│   ├── analytics/        # Mastery metrics, readiness score
│   └── api/              # API endpoints for AI, execution, imports
├── components/           # Reusable Design System components
│   ├── ui/               # Button, Modal, Card, Badge, Progress, Tabs
│   ├── layout/           # Sidebar, Navbar, FocusModeShell
│   └── shared/           # MarkdownRenderer, CodeBlock, Timer
├── features/             # Domain-driven feature modules
│   ├── system-design/    # Lesson runner, simulation widgets, graph
│   ├── dsa/              # Code editor, test runner, mistake logger
│   ├── revision/         # SM-2 cards, recall drills, invariant test
│   ├── whiteboard/       # React Flow / Canvas nodes, edge tools
│   ├── interview/        # Audio/Chat UI, rubric evaluator
│   └── daily/            # Next Best Action, daily plan generator
├── lib/                  # Shared utilities, Prisma singleton, constants
├── services/             # Core business logic services
│   ├── ai/               # AI Provider interface & implementations
│   ├── execution/        # Code execution & judge abstraction
│   ├── learning/         # Mastery computation & curriculum engine
│   └── revision/         # Spaced repetition scheduler
└── types/                # Core TypeScript definitions & schemas
```

## 3. Technology Choices & Rationale
- **Next.js & React**: Modern server components + client interactivity where state is critical (code editor, canvas, timer).
- **PostgreSQL & Prisma**: True relational modeling, strict foreign keys, composite indexes, and ACID compliance for mastery state.
- **Tailwind CSS & Radix UI**: Accessible, responsive, dark/light theme native styling.
- **Provider-Agnostic AI Architecture**: Abstract `AIProvider` supporting Google Gemini, OpenAI, and local mock fallbacks.
