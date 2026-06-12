import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Ensure DATABASE_URL is set for Prisma Client at runtime
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_YxhpWEMq0l1v@ep-winter-math-atikw2wu-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require'

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = DATABASE_URL
}

const prismaClientOptions = {
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
}

export const db = globalForPrisma.prisma ?? new PrismaClient(prismaClientOptions)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
