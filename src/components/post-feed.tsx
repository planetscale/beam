'use client'

import { api } from '~/trpc/react'
import { PostSummary, getFeedPagination } from './post-summary'
import { Pagination } from './pagination'
import { PostSkeleton } from './post-skeleton'
import { POSTS_PER_PAGE } from '~/utils/core'
import { useSession } from 'next-auth/react'

type PostFeedProps = {
  currentPageNumber?: number
  authorId?: string
}

export const PostFeed = ({ currentPageNumber, authorId }: PostFeedProps) => {
  const { data, isLoading } = api.post.feed.useQuery({
    take: POSTS_PER_PAGE,
    skip:
      currentPageNumber === 1
        ? undefined
        : POSTS_PER_PAGE * (currentPageNumber ?? 1 - 1),
    authorId,
  })

  const { data: session } = useSession()

  const utils = api.useUtils()
  const previousQuery = utils.post.feed.getData(
    getFeedPagination(currentPageNumber ?? 1),
  )

  const likeMutation = api.post.like.useMutation({
    onMutate: async ({ id }) => {
      if (previousQuery) {
        utils.post.feed.setData(getFeedPagination(currentPageNumber ?? 1), {
          ...previousQuery,
          posts: previousQuery.posts.map((post) =>
            post.id === id
              ? {
                  ...post,
                  likedBy: [
                    ...post.likedBy,
                    {
                      user: {
                        id: session!.user.id,
                        name: session!.user.name,
                      },
                    },
                  ],
                }
              : post,
          ),
        })
      }
    },
  })

  const unlikeMutation = api.post.unlike.useMutation({
    onMutate: async ({ id }) => {
      if (previousQuery) {
        utils.post.feed.setData(getFeedPagination(currentPageNumber ?? 1), {
          ...previousQuery,
          posts: previousQuery.posts.map((post) =>
            post.id === id
              ? {
                  ...post,
                  likedBy: post.likedBy.filter(
                    (item) => item.user.id !== session!.user.id,
                  ),
                }
              : post,
          ),
        })
      }
    },
  })

  if (isLoading) return <PostSkeleton count={3} />

  return (
    <>
      <ul className="-my-12 divide-y divide-primary">
        {data?.posts.map((post) => {
          return (
            <li key={post.id} className="py-10">
              <PostSummary
                onLike={() => likeMutation.mutate({ id: post.id })}
                onUnlike={() => unlikeMutation.mutate({ id: post.id })}
                post={post}
              />
            </li>
          )
        })}
      </ul>

      <Pagination
        itemCount={data?.postCount ?? 0}
        currentPageNumber={currentPageNumber ?? 1}
      />
    </>
  )
}
