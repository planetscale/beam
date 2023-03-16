import { authOptions } from '@/lib/auth'
import { type inferAsyncReturnType } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts

  const session = await getServerSession(authOptions)

  return {
    session,
    prisma,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
