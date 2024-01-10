import { TRPCError } from '@trpc/server'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { z } from 'zod'
import { markdownToHtml } from '~/utils/text'
import { revalidatePath } from 'next/cache'

export const commentRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.db.comment.create({
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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input

      const comment = await ctx.db.comment.findUnique({
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

      const updatedComment = await ctx.db.comment.update({
        where: { id },
        data: {
          content: data.content,
          contentHtml: markdownToHtml(data.content),
        },
      })

      revalidatePath(`/posts/${updatedComment.postId}`, 'page')
    }),
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: id }) => {
      const comment = await ctx.db.comment.findUnique({
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

      await ctx.db.comment.delete({ where: { id } })
      revalidatePath(`/posts/${id}`, 'page')
    }),
})
