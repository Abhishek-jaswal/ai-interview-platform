import { Router } from 'express'
import { requireAuth } from '../middleware/auth.middleware'
import { createPaymentOrder, verifyPayment } from '../controllers/payment.controller'

const router = Router()

router.post('/create-order', requireAuth, createPaymentOrder)
router.post('/verify', requireAuth, verifyPayment)

export default router
