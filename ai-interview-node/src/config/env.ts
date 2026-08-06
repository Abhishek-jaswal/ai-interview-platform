import dotenv from 'dotenv'
dotenv.config()

function required(name: string): string {
  const val = process.env[name]
  if (!val) {
    throw new Error(`Environment variable ${name} missing hai. .env file check karein.`)
  }
  return val
}

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  jwtSecret: required('JWT_SECRET'),
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
  creditPriceInr: parseInt(process.env.CREDIT_PRICE_INR || '20', 10),
  creditAttemptsPerPurchase: parseInt(process.env.CREDIT_ATTEMPTS_PER_PURCHASE || '3', 10),
}
