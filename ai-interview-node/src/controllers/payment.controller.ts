import { Request, Response } from 'express'
import { z } from 'zod'
import { createOrder, verifySignature } from '../services/razorpay.service'
import { addAttempts, CREDIT_CONFIG } from '../services/credit.service'

export async function createPaymentOrder(req: Request, res: Response) {
  try {
    const order = await createOrder(CREDIT_CONFIG.priceInr, req.userId!)
    res.json({
      order,
      keyId: process.env.RAZORPAY_KEY_ID,
      attemptsOnSuccess: CREDIT_CONFIG.attemptsPerPurchase,
    })
  } catch (err) {
    res.status(502).json({ error: `Payment order banane me error: ${(err as Error).message}` })
  }
}

const verifySchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
})

export async function verifyPayment(req: Request, res: Response) {
  const parsed = verifySchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Payment verification data incomplete hai.' })
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data

  const isValid = verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)
  if (!isValid) {
    return res.status(400).json({ error: 'Payment signature verify nahi hui. Ye payment invalid hai.' })
  }

  const updated = await addAttempts(req.userId!, CREDIT_CONFIG.attemptsPerPurchase)
  res.json({
    message: 'Payment successful! Attempts add ho gaye.',
    attemptsRemaining: updated.attemptsRemaining,
  })
}
