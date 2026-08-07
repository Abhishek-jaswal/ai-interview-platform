import { GoogleGenAI } from '@google/genai'
import { config } from '../config/env'

export interface GeneratedQuestion {
  id: string
  subject: string
  question: string
  options: { A: string; B: string; C: string; D: string }
  correctAnswer: 'A' | 'B' | 'C' | 'D'
}

let client: GoogleGenAI | null = null
function getClient() {
  if (!config.geminiApiKey) {
    throw new Error('GEMINI_API_KEY set nahi hai. .env file check karein.')
  }
  if (!client) client = new GoogleGenAI({ apiKey: config.geminiApiKey })
  return client
}

function cleanJson(raw: string): string {
  return raw.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim()
}

/**
 * Diye gaye exam ke liye MCQ questions generate karta hai. Ye questions
 * kahin persist nahi hote — sirf exam session (in-memory) me rakhe jaate hain
 * jab tak user exam de raha hai, fir discard ho jaate hain.
 */
export async function generateQuestions(
  examName: string,
  totalQuestions: number
): Promise<GeneratedQuestion[]> {
  const ai = getClient()

  const subjects = ['Reasoning', 'Math', 'General Knowledge', 'English']
  const prompt = `Tum ek government exam question setter ho. "${examName}" exam ke liye ${totalQuestions} multiple-choice questions banao.
Subjects equally distribute karo in se: ${subjects.join(', ')}.
Difficulty real exam jaisi ho, factually correct ho.

SIRF valid JSON array return karo, koi markdown fencing ya extra text nahi. Har item is shape me ho:
{
  "subject": "Reasoning" | "Math" | "General Knowledge" | "English",
  "question": "<question text>",
  "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
  "correctAnswer": "A" | "B" | "C" | "D"
}`

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
  })

  const parsed = JSON.parse(cleanJson(response.text || '[]')) as Omit<GeneratedQuestion, 'id'>[]

  return parsed.map((q, i) => ({ ...q, id: `q${i + 1}` }))
}

export interface FeedbackInput {
  examName: string
  overallScore: number
  subjectBreakdown: Record<string, { correct: number; total: number }>
}

export interface AiFeedback {
  weakAreas: string[]
  studyPlan: string[]
  suggestedBooks: string[]
  dailySchedule: string[]
  expectedImprovement: string
}

/** Exam submit hone ke baad, score ke base par personalized feedback deta hai. */
export async function generateFeedback(input: FeedbackInput): Promise<AiFeedback> {
  const ai = getClient()

  const breakdownText = Object.entries(input.subjectBreakdown)
    .map(([subject, s]) => `${subject}: ${s.correct}/${s.total}`)
    .join('\n')

  const prompt = `Ek student ne "${input.examName}" practice exam diya. Overall score: ${input.overallScore}%.
Subject-wise performance:
${breakdownText}

Is student ke liye Hinglish me personalized feedback do. SIRF valid JSON return karo, is shape me:
{
  "weakAreas": ["<subject/topic jahan sudhaar chahiye>"],
  "studyPlan": ["<actionable study plan points>"],
  "suggestedBooks": ["<relevant book/resource names>"],
  "dailySchedule": ["<daily practice schedule suggestions>"],
  "expectedImprovement": "<1-2 line motivating estimate>"
}`

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
  })

  return JSON.parse(cleanJson(response.text || '{}')) as AiFeedback
}
