import { PrismaClient } from '@prisma/client'

import { env } from '~/env.js'
import { type Config, Client } from '@planetscale/database'
import { PrismaPlanetScale } from '@prisma/adapter-planetscale'

const config = {
  url: env.DATABASE_URL,
} satisfies Config

const client = new Client(config)

const adapter = new PrismaPlanetScale(client)
const prisma = new PrismaClient({
  adapter,
  log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = prisma

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = db
