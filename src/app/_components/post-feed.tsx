'use client'

import { useSearchParams } from 'next/navigation'
import { api } from '~/trpc/react'
import { PostSummary } from './post-summary'
import { type RouterOutputs } from '~/trpc/shared'
import { Pagination } from './pagination'

type PostFeedProps = {
  postsPerPage: number
  initialPosts: RouterOutputs['post']['feed']
  authorId?: string
}

export const PostFeed = ({
  postsPerPage,
  initialPosts,
  authorId,
}: PostFeedProps) => {
  const searchParams = useSearchParams()
  const currentPageNumber = searchParams.get('page')
    ? Number(searchParams.get('page'))
    : 1

  const { data } = api.post.feed.useQuery(
    {
      take: postsPerPage,
      skip:
        currentPageNumber === 1
          ? undefined
          : postsPerPage * (currentPageNumber - 1),
      authorId,
    },
    {
      initialData: initialPosts,
    },
  )

  return (
    <>
      <ul className="-my-12 divide-y divide-primary">
        {data.posts.map((post) => {
          return (
            <li key={post.id} className="py-10">
              <PostSummary post={post} />
            </li>
          )
        })}
      </ul>

      <Pagination
        itemCount={data.postCount}
        itemsPerPage={postsPerPage}
        currentPageNumber={currentPageNumber}
      />
    </>
  )
}
