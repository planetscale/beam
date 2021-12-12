import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createProtectedRouter } from '../create-protected-router'

export const userRouter = createProtectedRouter().query('profile', {
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
        posts: {
          orderBy: {
            createdAt: 'desc',
          },
          where: {
            hidden:
              ctx.isUserAdmin || ctx.session.user.id === id ? undefined : false,
          },
          select: {
            id: true,
            title: true,
            contentHtml: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            likedBy: {
              where: {
                id: ctx.session.user.id,
              },
              select: {
                id: true,
              },
            },
            _count: {
              select: {
                comments: true,
                likedBy: true,
              },
            },
          },
        },
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
