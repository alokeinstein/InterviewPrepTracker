-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "PracticeMode" AS ENUM ('CODE', 'HAND', 'MENTAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AlterTable
ALTER TABLE "DsaProblem" 
    ADD COLUMN IF NOT EXISTS "suboptimalSolution" TEXT,
    ADD COLUMN IF NOT EXISTS "suboptimalTimeComplexity" TEXT,
    ADD COLUMN IF NOT EXISTS "suboptimalSpaceComplexity" TEXT;

-- AlterTable
ALTER TABLE "RevisionItem" 
    ADD COLUMN IF NOT EXISTS "codePracticeCount" INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS "handPracticeCount" INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS "mentalPracticeCount" INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS "recommendedMode" "PracticeMode" NOT NULL DEFAULT 'CODE',
    ADD COLUMN IF NOT EXISTS "currentStage" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "RevisionAttempt" 
    ADD COLUMN IF NOT EXISTS "mode" "PracticeMode" NOT NULL DEFAULT 'CODE',
    ADD COLUMN IF NOT EXISTS "struggled" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS "notes" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "RevisionItem_userId_dsaProblemId_idx" ON "RevisionItem"("userId", "dsaProblemId");
