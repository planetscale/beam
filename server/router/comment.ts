import { markdownToHtml } from '@/lib/editor'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

export const commentRouter = router({
  add: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.prisma.comment.create({
        data: {
          content: input.content,
          contentHtml: markdownToHtml(input.content),
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
    }),
  edit: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          content: z.string().min(1),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input

      const comment = await ctx.prisma.comment.findUnique({
        where: { id },
        select: {
          author: {
            select: {
              id: true,
            },
          },
        },
      })

      const commentBelongsToUser = comment?.author.id === ctx.session.user.id

      if (!commentBelongsToUser) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }

      const updatedComment = await ctx.prisma.comment.update({
        where: { id },
        data: {
          content: data.content,
          contentHtml: markdownToHtml(data.content),
        },
      })

      return updatedComment
    }),
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: id }) => {
      const comment = await ctx.prisma.comment.findUnique({
        where: { id },
        select: {
          author: {
            select: {
              id: true,
            },
          },
        },
      })

      const commentBelongsToUser = comment?.author.id === ctx.session.user.id

      if (!commentBelongsToUser) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }

      await ctx.prisma.comment.delete({ where: { id } })
      return id
    }),
})
