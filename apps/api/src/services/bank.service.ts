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

function deduplicateQuestions(questions: z.infer<typeof QuestionSchema>[]) {
  const seen = new Set<string>()
  return questions.filter(q => {
    // normalize: lowercase, remove punctuation, trim
    const normalized = q.question.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim()
    // check first 60 chars for near-duplicate detection
    const key = normalized.substring(0, 60)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export const BankService = {
  async generate(userId: string, jd: string, resume: string) {
    const systemPrompt = `You are an expert technical interviewer. Given a job description and/or resume, generate a personalised Q&A bank for interview preparation.

STRICT RULES:
- Generate exactly 20 questions
- Every question MUST be completely unique — no duplicates, no rephrasing of the same question
- Mix difficulty: 8 core, 8 deep, 4 trap questions
- Each question must test a DIFFERENT concept or skill
- Questions must be specific to the JD and candidate background
- Each ideal answer should be 150-300 words
- Do NOT repeat topics unless asking about a genuinely different aspect
- Return ONLY valid JSON — no markdown, no explanation, no code blocks`

    const userPrompt = `Job Description:
${jd}

Resume:
${resume || 'Not provided'}

Generate 20 UNIQUE questions — each testing a different concept. No duplicates.

Return JSON:
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

    // deduplicate just in case AI still returns similar questions
    const unique = deduplicateQuestions(parsed.questions)

    // assign clean sequential IDs
    const questions = unique.map((q, i) => ({ ...q, id: `q${i + 1}` }))

    const bank = await db.questionBank.create({
      data: {
        userId,
        jdText: jd,
        resumeText: resume || '',
        questions: questions as any,
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
