# Local Setup & Production Deployment

## 1. Prerequisites
- Node.js 18+ (tested on Node v24)
- PostgreSQL 14+ (tested on PostgreSQL 18 locally)
- npm 9+

## 2. Environment Variables (.env)
```env
DATABASE_URL="postgresql://postgres:root@localhost:5432/interview_os?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
GEMINI_API_KEY=""
OPENAI_API_KEY=""
AI_PROVIDER="mock" # "gemini" | "openai" | "mock"
```

## 3. Database Migration & Seeding
```bash
npx prisma migrate dev --name init
npm run db:seed
```

## 4. Run Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000`.
