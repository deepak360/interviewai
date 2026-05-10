import { Router, Response, NextFunction } from 'express'
import { z } from 'zod'
import { authenticate, AuthRequest } from '../middleware/authenticate'
import { BankService } from '../services/bank.service'

const router = Router()

const GenerateSchema = z.object({
  jd: z.string().min(50, 'JD too short'),
  resume: z.string().optional().default('')
})

router.post('/generate', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const body = GenerateSchema.parse(req.body)
    const bank = await BankService.generate(req.user!.id, body.jd, body.resume)
    res.status(201).json({ data: { bank }, error: null })
  } catch (err) {
    next(err)
  }
})

router.get('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const banks = await BankService.getAll(req.user!.id)
    res.json({ data: { banks }, error: null })
  } catch (err) {
    next(err)
  }
})

router.get('/:id', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const bank = await BankService.getOne(req.user!.id, req.params.id)
    res.json({ data: { bank }, error: null })
  } catch (err) {
    next(err)
  }
})

export default router
