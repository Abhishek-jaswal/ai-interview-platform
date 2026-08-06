import crypto from 'crypto'
import { GeneratedQuestion } from './gemini.service'

export interface ExamSession {
  sessionId: string
  userId: number
  examName: string
  questions: GeneratedQuestion[] // correct answers included — server-side only
  startedAt: number
  durationMinutes: number
  negativeMarking: number
}

// Sirf server ki memory me rehta hai. Server restart hote hi (ya session
// expire hote hi) sab clear ho jaata hai — koi disk/DB persistence nahi.
// Note: single-instance deployment ke liye theek hai. Agar future me multiple
// server instances chalane hon (horizontal scaling), to isko Redis me move
// karna hoga taaki sab instances same session dekh sakein.
const sessions = new Map<string, ExamSession>()

const SESSION_TTL_MS = 2 * 60 * 60 * 1000 // 2 ghante ke baad abandoned session auto-clear ho jaata hai

export function createSession(data: Omit<ExamSession, 'sessionId' | 'startedAt'>): ExamSession {
  const sessionId = crypto.randomUUID()
  const session: ExamSession = { ...data, sessionId, startedAt: Date.now() }
  sessions.set(sessionId, session)

  setTimeout(() => sessions.delete(sessionId), SESSION_TTL_MS).unref()

  return session
}

export function getSession(sessionId: string): ExamSession | undefined {
  return sessions.get(sessionId)
}

/** Submit ke baad session turant memory se discard kar dete hain — kuch persist nahi hota. */
export function discardSession(sessionId: string): void {
  sessions.delete(sessionId)
}
