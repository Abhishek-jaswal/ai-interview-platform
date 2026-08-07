import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config/env'

// Express Request ko extend kar rahe hain taaki userId attach kar sakein
declare global {
  namespace Express {
    interface Request {
      userId?: number
    }
  }
}

/**
 * Python (python-jose, HS256) jo token issue karta hai, usi ko yahan verify
 * karte hain. Payload me { sub: "<user_id>", exp: <timestamp> } hota hai —
 * python-jose 'sub' claim ko hamesha string me daalta hai, isliye yahan
 * Number() se convert karna zaroori hai.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Login session invalid hai. Dobara login karein.' })
  }

  const token = authHeader.slice('Bearer '.length)

  try {
    const payload = jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] }) as {
      sub?: string
    }

    if (!payload.sub) {
      return res.status(401).json({ error: 'Token me user id nahi mila.' })
    }

    const userId = Number(payload.sub)
    if (Number.isNaN(userId)) {
      return res.status(401).json({ error: 'Token ka user id format galat hai.' })
    }

    req.userId = userId
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Login session invalid ya expire ho gayi hai. Dobara login karein.' })
  }
}
