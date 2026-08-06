import { Router } from 'express'
import { requireAuth } from '../middleware/auth.middleware'
import { getCategories, getMyCredits, startExam, submitExam } from '../controllers/exam.controller'

const router = Router()

router.get('/categories', getCategories) // public — login ke bina bhi dekh sakte hain
router.get('/credits', requireAuth, getMyCredits)
router.post('/start', requireAuth, startExam)
router.post('/submit', requireAuth, submitExam)

export default router
