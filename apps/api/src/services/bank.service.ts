import { z } from 'zod'
import { db } from '../lib/db'
import { ai } from '../lib/claude'
import { AppError } from '../lib/errors'

const QuestionSchema = z.object({
  id: z.string(),
  topic: z.string(),
  difficulty: z.enum(['core', 'deep', 'trap']),
  question: z.string(),
  idealAnswer: z.string(),
  whyItMatters: z.string(),
  tags: z.array(z.string())
})

const BankSchema = z.object({
  topics: z.array(z.string()),
  questions: z.array(QuestionSchema)
})

export const BankService = {
  async generate(userId: string, jd: string, resume: string) {
    const systemPrompt = `You are an expert technical interviewer. Given a job description and/or resume, generate a personalised Q&A bank for interview preparation.

Rules:
- Generate exactly 20 questions
- Mix difficulty: 8 core, 8 deep, 4 trap questions
- Questions must be specific to the JD and candidate background
- Each ideal answer should be 150-300 words
- Return ONLY valid JSON — no markdown, no explanation, no code blocks`

    const userPrompt = `Job Description:
${jd}

Resume:
${resume || 'Not provided'}

Generate a Q&A bank as JSON with this exact shape:
{
  "topics": ["topic1", "topic2"],
  "questions": [
    {
      "id": "q1",
      "topic": "topic name",
      "difficulty": "core",
      "question": "...",
      "idealAnswer": "...",
      "whyItMatters": "one sentence on why this is asked for this role",
      "tags": ["tag1", "tag2"]
    }
  ]
}`

    const raw = await ai.complete(systemPrompt, userPrompt, 4096)

    let parsed
    try {
      const cleaned = raw.replace(/```json|```/g, '').trim()
      parsed = BankSchema.parse(JSON.parse(cleaned))
    } catch (err) {
      throw new AppError('Failed to parse AI output', 422)
    }

    const bank = await db.questionBank.create({
      data: {
        userId,
        jdText: jd,
        resumeText: resume || '',
        questions: parsed.questions as any,
        topics: parsed.topics
      }
    })

    return bank
  },

  async getAll(userId: string) {
    return db.questionBank.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
  },

  async getOne(userId: string, bankId: string) {
    const bank = await db.questionBank.findFirst({
      where: { id: bankId, userId }
    })
    if (!bank) throw new AppError('Bank not found', 404)
    return bank
  }
}
