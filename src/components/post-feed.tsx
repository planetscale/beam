'use client'

import { api } from '~/trpc/react'
import { PostSummary } from './post-summary'
import { Pagination } from './pagination'
import { PostSkeleton } from './post-skeleton'
import { POSTS_PER_PAGE } from '~/utils/core'

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

  if (isLoading) return <PostSkeleton count={3} />

  return (
    <>
      <ul className="-my-12 divide-y divide-primary">
        {data?.posts.map((post) => {
          return (
            <li key={post.id} className="py-10">
              <PostSummary post={post} />
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
