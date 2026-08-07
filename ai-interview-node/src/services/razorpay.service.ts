import Razorpay from 'razorpay'
import crypto from 'crypto'
import { config } from '../config/env'

let client: Razorpay | null = null
function getClient() {
  if (!config.razorpayKeyId || !config.razorpayKeySecret) {
    throw new Error('Razorpay keys .env me set nahi hain.')
  }
  if (!client) {
    client = new Razorpay({ key_id: config.razorpayKeyId, key_secret: config.razorpayKeySecret })
  }
  return client
}

export async function createOrder(amountInr: number, userId: number) {
  const razorpay = getClient()
  return razorpay.orders.create({
    amount: amountInr * 100, // paise me
    currency: 'INR',
    receipt: `credit_${userId}_${Date.now()}`,
  })
}

/** Razorpay ka signature verify karta hai taaki koi fake "payment success" call na bhej sake. */
export function verifySignature(orderId: string, paymentId: string, signature: string): boolean {
  const expected = crypto
    .createHmac('sha256', config.razorpayKeySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')
  return expected === signature
}
