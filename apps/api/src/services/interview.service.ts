import { db } from '../lib/db'
import { ai } from '../lib/claude'
import { AppError } from '../lib/errors'

export const InterviewService = {
  async create(userId: string, bankId: string, persona: string) {
    const bank = await db.questionBank.findFirst({ where: { id: bankId, userId } })
    if (!bank) throw new AppError('Bank not found', 404)
    const interview = await db.mockInterview.create({
      data: { userId, bankId, persona, status: 'in_progress' }
    })
    return interview
  },

  async saveAnswer(interviewId: string, userId: string, data: {
    questionId: string
    question: string
    idealAnswer: string
    transcript: string
  }) {
    const interview = await db.mockInterview.findFirst({ where: { id: interviewId, userId } })
    if (!interview) throw new AppError('Interview not found', 404)
    return db.interviewAnswer.create({
      data: {
        interviewId,
        questionId: data.questionId,
        question: data.question,
        idealAnswer: data.idealAnswer,
        transcript: data.transcript
      }
    })
  },

  async complete(interviewId: string, userId: string) {
    const interview = await db.mockInterview.findFirst({ where: { id: interviewId, userId } })
    if (!interview) throw new AppError('Interview not found', 404)
    await db.mockInterview.update({
      where: { id: interviewId },
      data: { status: 'scoring', endedAt: new Date() }
    })
    // fire and forget — parallel scoring
    scoreInterview(interviewId)
    return { interviewId, status: 'scoring' }
  },

  async getStatus(interviewId: string, userId: string) {
    const interview = await db.mockInterview.findFirst({
      where: { id: interviewId, userId },
      include: { answers: true }
    })
    if (!interview) throw new AppError('Interview not found', 404)
    return interview
  },

  async getDebrief(interviewId: string, userId: string) {
    const interview = await db.mockInterview.findFirst({
      where: { id: interviewId, userId },
      include: { answers: true }
    })
    if (!interview) throw new AppError('Interview not found', 404)
    if (interview.status !== 'complete') throw new AppError('Scoring not complete yet', 422)

    const answers = interview.answers
    const scored = answers.filter(a => a.score !== null)
    const overallScore = scored.length
      ? Math.round(scored.reduce((sum, a) => sum + (a.score || 0), 0) / scored.length)
      : 0

    return { interview, answers, overallScore }
  }
}

async function scoreAnswer(answer: any): Promise<void> {
  if (!answer.transcript || answer.transcript.trim().length < 5) {
    await db.interviewAnswer.update({
      where: { id: answer.id },
      data: { score: 0, feedback: { skipped: true, feedback: 'Question was skipped.' } }
    })
    return
  }

  const systemPrompt = `You are a strict but fair technical interview evaluator.
Score the candidate's answer honestly. Return ONLY valid JSON, no markdown, no code blocks.`

  const userPrompt = `Question: ${answer.question}

Ideal Answer: ${answer.idealAnswer}

Candidate's Answer: ${answer.transcript}

Score out of 25 for each dimension:
- accuracy: technically correct?
- completeness: covered key points?
- clarity: clearly explained?
- examples: used concrete examples?

Return this exact JSON:
{
  "scores": { "accuracy": 0-25, "completeness": 0-25, "clarity": 0-25, "examples": 0-25 },
  "total": 0-100,
  "feedback": "2-3 sentences on what was good and what was missing",
  "improvement": "rewrite as ideal answer in 150-200 words"
}`

  try {
    const raw = await ai.complete(systemPrompt, userPrompt, 1024)
    const cleaned = raw.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)
    await db.interviewAnswer.update({
      where: { id: answer.id },
      data: { score: parsed.total, feedback: parsed }
    })
  } catch {
    await db.interviewAnswer.update({
      where: { id: answer.id },
      data: { score: 0, feedback: { error: 'Scoring failed' } }
    })
  }
}

async function scoreInterview(interviewId: string) {
  try {
    const answers = await db.interviewAnswer.findMany({ where: { interviewId } })

    // score all answers IN PARALLEL
    await Promise.all(answers.map(a => scoreAnswer(a)))

    await db.mockInterview.update({
      where: { id: interviewId },
      data: { status: 'complete' }
    })
  } catch {
    await db.mockInterview.update({
      where: { id: interviewId },
      data: { status: 'failed' }
    })
  }
}
