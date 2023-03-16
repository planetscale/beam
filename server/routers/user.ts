import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createProtectedRouter } from '../create-protected-router'

export const userRouter = createProtectedRouter()
  .query('profile', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input
      const user = await ctx.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          image: true,
          title: true,
        },
      })

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No profile with id '${id}'`,
        })
      }

      return user
    },
  })
  .mutation('edit', {
    input: z.object({
      name: z.string().min(1),
      title: z.string().nullish(),
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          name: input.name,
          title: input.title,
        },
      })

      return user
    },
  })
  .mutation('update-avatar', {
    input: z.object({
      image: z.string().nullish(),
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          image: input.image,
        },
      })

      return user
    },
  })
  .query('mentionList', {
    async resolve({ ctx }) {
      const users = await ctx.prisma.user.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: 'asc',
        },
      })

      return users
    },
  })
