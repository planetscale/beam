import { api } from '~/trpc/server'
import { PostFeed } from '../_components/post-feed'
import { cache } from 'react'

const POSTS_PER_PAGE = 20

export default async function Index({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>
}) {
  const currentPageNumber = searchParams.page ? Number(searchParams.page) : 1

  const cachedData = cache(async () => {
    return await api.post.feed.query({
      take: POSTS_PER_PAGE,
      skip:
        currentPageNumber === 1
          ? undefined
          : POSTS_PER_PAGE * (currentPageNumber - 1),
    })
  })

  const initialPostData = await cachedData()

  return (
    <>
      {!initialPostData.postCount ? (
        <div className="text-center text-secondary border rounded py-20 px-10">
          There are no published posts to show yet.
        </div>
      ) : (
        <PostFeed
          initialPosts={initialPostData}
          postsPerPage={POSTS_PER_PAGE}
        />
      )}
    </>
  )
}
