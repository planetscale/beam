import { TRPCError } from '@trpc/server'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { z } from 'zod'
import { markdownToHtml } from '~/utils/text'
import { revalidatePath } from 'next/cache'
import { postToSlackIfEnabled } from '~/server/slack'

export const postRouter = createTRPCRouter({
  feed: protectedProcedure
    .input(
      z
        .object({
          take: z.number().min(1).max(50).optional(),
          skip: z.number().min(1).optional(),
          authorId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const take = input?.take ?? 50
      const skip = input?.skip
      const where = {
        hidden: !ctx.isUserAdmin ? undefined : false,
        authorId: input?.authorId,
      }

      const posts = await ctx.db.post.findMany({
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
          hidden: true,
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          likedBy: {
            orderBy: {
              createdAt: 'asc',
            },
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      })

      const postCount = await ctx.db.post.count({
        where,
      })

      return {
        posts: posts.map((post) => ({
          ...post,
          isLikedByCurrentUser: Boolean(
            post.likedBy.find((item) => item.user.id === ctx.session!.user.id),
          ),
          likedBy: post.likedBy.map((like) =>
            like.user.id === ctx.session.user.id ? 'You' : like.user.name,
          ),
        })),
        postCount,
      }
    }),
  detail: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id } = input
      const post = await ctx.db.post.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          content: true,
          contentHtml: true,
          createdAt: true,
          hidden: true,
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          likedBy: {
            orderBy: {
              createdAt: 'asc',
            },
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          comments: {
            orderBy: {
              createdAt: 'asc',
            },
            select: {
              id: true,
              content: true,
              contentHtml: true,
              createdAt: true,
              author: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      })

      const postBelongsToUser = post?.author.id === ctx.session.user.id

      if (!post || (post.hidden && !postBelongsToUser && !ctx.isUserAdmin)) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No post with id '${id}'`,
        })
      }

      return {
        ...post,
        isLikedByCurrentUser: Boolean(
          post.likedBy.find((item) => item.user.id === ctx.session!.user.id),
        ),
        likedBy: post.likedBy.map((like) =>
          like.user.id === ctx.session.user.id ? 'You' : like.user.name,
        ),
      }
    }),
  search: protectedProcedure
    .input(
      z.object({
        query: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const posts = await ctx.db.post.findMany({
        take: 10,
        where: {
          hidden: false,
          title: { search: input.query },
          content: { search: input.query },
        },
        select: {
          id: true,
          title: true,
        },
      })

      return posts
    }),
  add: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.create({
        data: {
          title: input.title,
          content: input.content,
          contentHtml: markdownToHtml(input.content),
          author: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      })

      await postToSlackIfEnabled({ post, authorName: ctx.session.user.name })

      return post
    }),
  emojiList: protectedProcedure.query(async () => {
    const emoji = (await import('gemoji')).gemoji

    return emoji
  }),
  edit: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          title: z.string().min(1),
          content: z.string().min(1),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input

      const post = await ctx.db.post.findUnique({
        where: { id },
        select: {
          author: {
            select: {
              id: true,
            },
          },
        },
      })

      const postBelongsToUser = post?.author.id === ctx.session.user.id

      if (!postBelongsToUser) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }

      await ctx.db.post.update({
        where: { id },
        data: {
          title: data.title,
          content: data.content,
          contentHtml: markdownToHtml(data.content),
        },
      })
    }),
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: id }) => {
      const post = await ctx.db.post.findUnique({
        where: { id },
        select: {
          author: {
            select: {
              id: true,
            },
          },
        },
      })

      const postBelongsToUser = post?.author.id === ctx.session.user.id

      if (!postBelongsToUser) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }

      await ctx.db.post.delete({ where: { id } })

      revalidatePath('/')

      return id
    }),
  like: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input
      await ctx.db.likedPosts.create({
        data: {
          post: {
            connect: {
              id,
            },
          },
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      })

      revalidatePath(`/post/${id}`, 'page')
    }),
  unlike: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input
      await ctx.db.likedPosts.delete({
        where: {
          postId_userId: {
            postId: id,
            userId: ctx.session.user.id,
          },
        },
      })

      revalidatePath(`/post/${id}`, 'page')
    }),
  hide: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: id }) => {
      if (!ctx.isUserAdmin) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }
      const post = await ctx.db.post.update({
        where: { id },
        data: {
          hidden: true,
        },
        select: {
          id: true,
        },
      })
      return post
    }),
  unhide: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: id }) => {
      if (!ctx.isUserAdmin) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }

      const post = await ctx.db.post.update({
        where: { id },
        data: {
          hidden: false,
        },
        select: {
          id: true,
        },
      })
      return post
    }),
})
