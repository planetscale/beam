import { z } from 'zod'
import { createProtectedRouter } from '../create-protected-router'

export const postRouter = createProtectedRouter()
  .mutation('add', {
    input: z.object({
      title: z.string().min(1).max(100),
      content: z.string().min(5),
    }),
    async resolve({ ctx, input }) {
      const post = await ctx.prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          contentHtml: input.content,
          author: {
            connect: {
              email: ctx.session.user.email,
            },
          },
        },
      })
      return post
    },
  })
  .query('feed', {
    input: z
      .object({
        take: z.number().min(1).max(100).optional(),
        skip: z.number().min(1).optional(),
      })
      .optional(),
    async resolve({ input, ctx }) {
      const take = input?.take ?? 100
      const skip = input?.skip
      const where = {
        hidden: ctx.isUserAdmin ? undefined : false,
      }

      const posts = await ctx.prisma.post.findMany({
        take,
        skip,
        orderBy: {
          createdAt: 'desc',
        },
        where,
        select: {
          id: true,
          title: true,
          contentHtml: true,
          createdAt: true,
          _count: {
            select: {
              comments: true,
              likedBy: true,
            },
          },
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
        },
      })

      const postCount = await ctx.prisma.post.count({
        where,
      })

      return {
        posts,
        postCount,
      }
    },
  })
  // .query('byId', {
  //   input: z.object({
  //     id: z.string(),
  //   }),
  //   async resolve({ ctx, input }) {
  //     const { id } = input
  //     const post = await ctx.prisma.post.findUnique({
  //       where: { id },
  //       select: {
  //         id: true,
  //         title: true,
  //         text: true,
  //         createdAt: true,
  //         updatedAt: true,
  //       },
  //     })
  //     if (!post) {
  //       throw new TRPCError({
  //         code: 'NOT_FOUND',
  //         message: `No post with id '${id}'`,
  //       })
  //     }
  //     return post
  //   },
  // })
  // // update
  // .mutation('edit', {
  //   input: z.object({
  //     id: z.string().uuid(),
  //     data: z.object({
  //       title: z.string().min(1).max(32).optional(),
  //       text: z.string().min(1).optional(),
  //     }),
  //   }),
  //   async resolve({ ctx, input }) {
  //     const { id, data } = input
  //     const post = await ctx.prisma.post.update({
  //       where: { id },
  //       data,
  //     })
  //     return post
  //   },
  // })

  .mutation('like', {
    input: z.string().uuid(),
    async resolve({ input: id, ctx }) {
      const post = await ctx.prisma.post.update({
        where: { id },
        data: {
          likedBy: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      })
      return post
    },
  })
  .mutation('unlike', {
    input: z.string().uuid(),
    async resolve({ input: id, ctx }) {
      const post = await ctx.prisma.post.update({
        where: { id },
        data: {
          likedBy: {
            disconnect: {
              id: ctx.session.user.id,
            },
          },
        },
      })
      return post
    },
  })
