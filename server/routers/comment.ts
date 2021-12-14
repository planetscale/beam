import { z } from 'zod'
import { createProtectedRouter } from '../create-protected-router'

export const commentRouter = createProtectedRouter().mutation('add', {
  input: z.object({
    postId: z.string(),
    content: z.string().min(1),
  }),
  async resolve({ ctx, input }) {
    const comment = await ctx.prisma.comment.create({
      data: {
        content: input.content,
        author: {
          connect: {
            id: ctx.session.user.id,
          },
        },
        post: {
          connect: {
            id: input.postId,
          },
        },
      },
    })

    return comment
  },
})
