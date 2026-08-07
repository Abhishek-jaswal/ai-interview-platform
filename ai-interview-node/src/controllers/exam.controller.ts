import { Request, Response } from 'express'
import { z } from 'zod'
import { CATEGORIES, findExam } from '../config/categories'
import { generateQuestions, generateFeedback } from '../services/gemini.service'
import { createSession, getSession, discardSession } from '../services/session.service'
import { consumeAttempt, getCredits } from '../services/credit.service'

export function getCategories(_req: Request, res: Response) {
  res.json(CATEGORIES)
}

export async function getMyCredits(req: Request, res: Response) {
  const credits = await getCredits(req.userId!)
  res.json(credits)
}

const startSchema = z.object({
  categoryId: z.string(),
  examId: z.string(),
})

/**
 * Exam start karta hai: 1 attempt consume karta hai, Gemini se questions
 * generate karwata hai, session memory me banata hai, aur client ko questions
 * bhejta hai (correctAnswer field HATA KAR — taaki client cheat na kar sake).
 */
export async function startExam(req: Request, res: Response) {
  const parsed = startSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'categoryId aur examId zaroori hain.' })
  }

  const found = findExam(parsed.data.categoryId, parsed.data.examId)
  if (!found) {
    return res.status(404).json({ error: 'Ye exam nahi mila.' })
  }

  const userId = req.userId!
  const hasAttempt = await consumeAttempt(userId)
  if (!hasAttempt) {
    return res.status(402).json({
      error: 'Aapke attempts khatam ho gaye hain. Kripya credits kharidein.',
      code: 'NO_ATTEMPTS_LEFT',
    })
  }

  let questions
  try {
    questions = await generateQuestions(found.exam.name, found.exam.totalQuestions)
  } catch (err) {
    return res.status(502).json({ error: `Questions generate karne me error: ${(err as Error).message}` })
  }

  const session = createSession({
    userId,
    examName: found.exam.name,
    questions,
    durationMinutes: found.exam.durationMinutes,
    negativeMarking: found.exam.negativeMarking,
  })

  // Client ko correctAnswer nahi bhejte — warna exam me cheat ho sakta hai
  const clientQuestions = session.questions.map(({ id, subject, question, options }) => ({
    id,
    subject,
    question,
    options,
  }))

  res.json({
    sessionId: session.sessionId,
    examName: session.examName,
    durationMinutes: session.durationMinutes,
    negativeMarking: session.negativeMarking,
    totalQuestions: clientQuestions.length,
    startedAt: session.startedAt,
    questions: clientQuestions,
  })
}

const submitSchema = z.object({
  sessionId: z.string(),
  answers: z.array(
    z.object({
      questionId: z.string(),
      selected: z.enum(['A', 'B', 'C', 'D']).nullable(),
    })
  ),
})

/**
 * Exam submit karta hai: server-side session se score calculate karta hai
 * (client se bheja hua score kabhi trust nahi karte), Gemini se feedback
 * generate karwata hai, result client ko return karta hai — aur phir session
 * discard kar deta hai. Result kahin bhi disk/DB par save NAHI hota.
 */
export async function submitExam(req: Request, res: Response) {
  const parsed = submitSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'sessionId aur answers zaroori hain.' })
  }

  const session = getSession(parsed.data.sessionId)
  if (!session) {
    return res.status(404).json({ error: 'Exam session nahi mila ya expire ho gaya hai.' })
  }
  if (session.userId !== req.userId) {
    return res.status(403).json({ error: 'Ye session aapka nahi hai.' })
  }

  // Server-side time check — client timer manipulate nahi kar sakta
  const elapsedMinutes = (Date.now() - session.startedAt) / 60000
  const graceMinutes = 1 // network lag ke liye thoda buffer
  if (elapsedMinutes > session.durationMinutes + graceMinutes) {
    discardSession(session.sessionId)
    return res.status(400).json({ error: 'Exam ka time khatam ho chuka hai.' })
  }

  const answerMap = new Map(parsed.data.answers.map((a) => [a.questionId, a.selected]))

  let correct = 0
  let wrong = 0
  let unattempted = 0
  const subjectBreakdown: Record<string, { correct: number; total: number }> = {}

  for (const q of session.questions) {
    subjectBreakdown[q.subject] ??= { correct: 0, total: 0 }
    subjectBreakdown[q.subject].total += 1

    const selected = answerMap.get(q.id)
    if (!selected) {
      unattempted += 1
      continue
    }
    if (selected === q.correctAnswer) {
      correct += 1
      subjectBreakdown[q.subject].correct += 1
    } else {
      wrong += 1
    }
  }

  const rawScore = correct - wrong * session.negativeMarking
  const maxScore = session.questions.length
  const overallScore = Math.max(0, Math.round((rawScore / maxScore) * 100))

  let aiFeedback
  try {
    aiFeedback = await generateFeedback({
      examName: session.examName,
      overallScore,
      subjectBreakdown,
    })
  } catch (err) {
    // Feedback fail ho to bhi result dikhana chahiye, bas feedback empty rahega
    aiFeedback = null
  }

  discardSession(session.sessionId) // sab kuch memory se hata do — kuch save nahi hota

  res.json({
    examName: session.examName,
    overallScore,
    correct,
    wrong,
    unattempted,
    totalQuestions: maxScore,
    subjectBreakdown,
    aiFeedback,
  })
}
