import { Router, Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { AuthService } from '../services/auth.service'
import { authenticate, AuthRequest } from '../middleware/authenticate'
import { AppError } from '../lib/errors'

const router = Router()

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000
}

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1)
})

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = RegisterSchema.parse(req.body)
    const user = await AuthService.register(body.email, body.password, body.name)
    res.status(201).json({ data: { user }, error: null })
  } catch (err) {
    next(err)
  }
})

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = LoginSchema.parse(req.body)
    const { user, accessToken, refreshToken } = await AuthService.login(body.email, body.password)
    res.cookie('refreshToken', refreshToken, COOKIE_OPTS)
    res.json({ data: { user, accessToken }, error: null })
  } catch (err) {
    next(err)
  }
})

router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.refreshToken
    if (!token) throw new AppError('No refresh token', 401)
    const { accessToken, refreshToken } = await AuthService.refresh(token)
    res.cookie('refreshToken', refreshToken, COOKIE_OPTS)
    res.json({ data: { accessToken }, error: null })
  } catch (err) {
    next(err)
  }
})

router.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.refreshToken
    if (token) await AuthService.logout(token)
    res.clearCookie('refreshToken')
    res.json({ data: { message: 'Logged out' }, error: null })
  } catch (err) {
    next(err)
  }
})

router.get('/me', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.json({ data: { user: req.user }, error: null })
  } catch (err) {
    next(err)
  }
})

export default router
