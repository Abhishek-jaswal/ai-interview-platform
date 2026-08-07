export interface ExamOption {
  id: string
  name: string
  totalQuestions: number
  durationMinutes: number
  negativeMarking: number
}

export interface Category {
  id: string
  name: string
  icon: string
  exams: ExamOption[]
}

// Ye list frontend ke category/exam selection screens ke liye source of truth hai.
// Naya category/exam add karna ho to bas yahan entry add kar do.
export const CATEGORIES: Category[] = [
  {
    id: 'ssc',
    name: 'SSC',
    icon: '📘',
    exams: [
      { id: 'ssc-cgl', name: 'SSC CGL', totalQuestions: 25, durationMinutes: 30, negativeMarking: 0.25 },
      { id: 'ssc-chsl', name: 'SSC CHSL', totalQuestions: 25, durationMinutes: 30, negativeMarking: 0.25 },
      { id: 'ssc-mts', name: 'SSC MTS', totalQuestions: 20, durationMinutes: 25, negativeMarking: 0.25 },
      { id: 'ssc-gd', name: 'SSC GD', totalQuestions: 20, durationMinutes: 25, negativeMarking: 0.25 },
      { id: 'ssc-cpo', name: 'SSC CPO', totalQuestions: 25, durationMinutes: 30, negativeMarking: 0.25 },
    ],
  },
  {
    id: 'army',
    name: 'Army',
    icon: '🪖',
    exams: [
      { id: 'army-gd', name: 'Army GD', totalQuestions: 20, durationMinutes: 25, negativeMarking: 0 },
      { id: 'army-technical', name: 'Army Technical', totalQuestions: 25, durationMinutes: 30, negativeMarking: 0 },
      { id: 'army-clerk', name: 'Army Clerk', totalQuestions: 20, durationMinutes: 25, negativeMarking: 0 },
      { id: 'army-tradesman', name: 'Army Tradesman', totalQuestions: 15, durationMinutes: 20, negativeMarking: 0 },
    ],
  },
  {
    id: 'police',
    name: 'Police',
    icon: '👮',
    exams: [
      { id: 'police-constable', name: 'Constable', totalQuestions: 20, durationMinutes: 25, negativeMarking: 0 },
      { id: 'police-si', name: 'Sub Inspector', totalQuestions: 25, durationMinutes: 30, negativeMarking: 0 },
      { id: 'police-head-constable', name: 'Head Constable', totalQuestions: 20, durationMinutes: 25, negativeMarking: 0 },
    ],
  },
  {
    id: 'railway',
    name: 'Railway',
    icon: '🚆',
    exams: [
      { id: 'railway-ntpc', name: 'RRB NTPC', totalQuestions: 25, durationMinutes: 30, negativeMarking: 0.33 },
      { id: 'railway-group-d', name: 'RRB Group D', totalQuestions: 20, durationMinutes: 25, negativeMarking: 0.33 },
    ],
  },
  {
    id: 'bank',
    name: 'Bank',
    icon: '🏦',
    exams: [
      { id: 'bank-po', name: 'Bank PO', totalQuestions: 25, durationMinutes: 30, negativeMarking: 0.25 },
      { id: 'bank-clerk', name: 'Bank Clerk', totalQuestions: 20, durationMinutes: 25, negativeMarking: 0.25 },
    ],
  },
]

export function findExam(categoryId: string, examId: string) {
  const category = CATEGORIES.find((c) => c.id === categoryId)
  if (!category) return null
  const exam = category.exams.find((e) => e.id === examId)
  if (!exam) return null
  return { category, exam }
}
