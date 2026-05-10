import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { db } from '../lib/db'
import { AppError } from '../lib/errors'

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!

export const AuthService = {
  async register(email: string, password: string, name: string) {
    const existing = await db.user.findUnique({ where: { email } })
    if (existing) throw new AppError('Email already exists', 409)

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await db.user.create({
      data: { email, passwordHash, name },
      select: { id: true, email: true, name: true, role: true }
    })
    return user
  },

  async login(email: string, password: string) {
    const user = await db.user.findUnique({ where: { email } })
    if (!user) throw new AppError('Invalid credentials', 401)
    if (user.suspendedAt) throw new AppError('Account suspended', 403)

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) throw new AppError('Invalid credentials', 401)

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      ACCESS_SECRET,
      { expiresIn: '15m' }
    )

    const refreshToken = crypto.randomUUID()
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')

    await db.session.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })

    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      accessToken,
      refreshToken
    }
  },

  async refresh(refreshToken: string) {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')

    const session = await db.session.findUnique({ where: { tokenHash } })

    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      if (session && !session.revokedAt) {
        await db.session.updateMany({
          where: { userId: session.userId },
          data: { revokedAt: new Date() }
        })
      }
      throw new AppError('Invalid refresh token', 401)
    }

    await db.session.update({
      where: { id: session.id },
      data: { revokedAt: new Date() }
    })

    const user = await db.user.findUnique({ where: { id: session.userId } })
    if (!user) throw new AppError('User not found', 401)

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      ACCESS_SECRET,
      { expiresIn: '15m' }
    )

    const newRefreshToken = crypto.randomUUID()
    const newTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex')

    await db.session.create({
      data: {
        userId: user.id,
        tokenHash: newTokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })

    return { accessToken, refreshToken: newRefreshToken }
  },

  async logout(refreshToken: string) {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')
    await db.session.updateMany({
      where: { tokenHash },
      data: { revokedAt: new Date() }
    })
  }
}
