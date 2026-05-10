import { Request, Response, NextFunction } from 'express'
import { AppError } from '../lib/errors'
import { ZodError } from 'zod'

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      data: null,
      error: err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
    })
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ data: null, error: err.message })
  }

  console.error(err)
  res.status(500).json({ data: null, error: 'Internal server error' })
}
