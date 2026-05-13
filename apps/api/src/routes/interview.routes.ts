import { Router, Response, NextFunction } from 'express'
import { z } from 'zod'
import { authenticate, AuthRequest } from '../middleware/authenticate'
import { InterviewService } from '../services/interview.service'

const router = Router()

router.post('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { bankId, persona } = z.object({
      bankId: z.string(),
      persona: z.string().default('balanced')
    }).parse(req.body)
    const interview = await InterviewService.create(req.user!.id, bankId, persona)
    res.status(201).json({ data: { interview }, error: null })
  } catch (err) { next(err) }
})

router.post('/:id/answer', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const body = z.object({
      questionId: z.string(),
      question: z.string(),
      idealAnswer: z.string(),
      transcript: z.string()
    }).parse(req.body)
    const answer = await InterviewService.saveAnswer(req.params.id, req.user!.id, body)
    res.status(201).json({ data: { answer }, error: null })
  } catch (err) { next(err) }
})

router.post('/:id/complete', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await InterviewService.complete(req.params.id, req.user!.id)
    res.json({ data: result, error: null })
  } catch (err) { next(err) }
})

router.get('/:id/status', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const interview = await InterviewService.getStatus(req.params.id, req.user!.id)
    res.json({ data: { interview }, error: null })
  } catch (err) { next(err) }
})

router.get('/:id/debrief', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const debrief = await InterviewService.getDebrief(req.params.id, req.user!.id)
    res.json({ data: debrief, error: null })
  } catch (err) { next(err) }
})

export default router
