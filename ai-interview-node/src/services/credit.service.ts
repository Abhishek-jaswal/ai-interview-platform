import { PrismaClient } from '@prisma/client'
import { config } from '../config/env'

const prisma = new PrismaClient()

/** Naye user ke liye row banata hai (1 free attempt ke saath) agar exist nahi karti. */
async function ensureRow(userId: number) {
  return prisma.userCredit.upsert({
    where: { userId },
    update: {},
    create: { userId, attemptsRemaining: 1 },
  })
}

export async function getCredits(userId: number) {
  const row = await ensureRow(userId)
  return { attemptsRemaining: row.attemptsRemaining, totalPurchased: row.totalPurchased }
}

/**
 * Ek attempt consume karta hai (exam start hone par). Agar attempts 0 hain
 * to false return karta hai — caller ko payment ka prompt dikhana chahiye.
 */
export async function consumeAttempt(userId: number): Promise<boolean> {
  await ensureRow(userId)

  const result = await prisma.userCredit.updateMany({
    where: { userId, attemptsRemaining: { gt: 0 } },
    data: { attemptsRemaining: { decrement: 1 } },
  })

  return result.count > 0
}

/** Payment verify hone ke baad attempts add karta hai. */
export async function addAttempts(userId: number, count: number) {
  await ensureRow(userId)
  return prisma.userCredit.update({
    where: { userId },
    data: {
      attemptsRemaining: { increment: count },
      totalPurchased: { increment: count },
    },
  })
}

export const CREDIT_CONFIG = {
  priceInr: config.creditPriceInr,
  attemptsPerPurchase: config.creditAttemptsPerPurchase,
}
