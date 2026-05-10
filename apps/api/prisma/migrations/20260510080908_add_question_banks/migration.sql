-- CreateTable
CREATE TABLE "question_banks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jdText" TEXT NOT NULL,
    "resumeText" TEXT NOT NULL DEFAULT '',
    "questions" JSONB NOT NULL,
    "topics" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_banks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "question_banks_userId_idx" ON "question_banks"("userId");

-- AddForeignKey
ALTER TABLE "question_banks" ADD CONSTRAINT "question_banks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
