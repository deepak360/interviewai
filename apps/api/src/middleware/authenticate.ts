import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from '../lib/errors'

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string }
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) throw new AppError('Unauthorized', 401)

  const token = header.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any
    req.user = { id: payload.id, email: payload.email, role: payload.role }
    next()
  } catch {
    throw new AppError('Unauthorized', 401)
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || !['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
    throw new AppError('Forbidden', 403)
  }
  next()
}
