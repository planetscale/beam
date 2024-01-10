import { api } from '~/trpc/server'
import { PostSummary } from '../_components/post-summary'
import { getServerAuthSession } from '~/server/auth'
import { Pagination } from '../_components/pagination'

const POSTS_PER_PAGE = 20

export default async function Index({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>
}) {
  const currentPageNumber = searchParams.page ? Number(searchParams.page) : 1

  const { posts, postCount } = await api.post.feed.query({
    take: POSTS_PER_PAGE,
    skip:
      currentPageNumber === 1
        ? undefined
        : POSTS_PER_PAGE * (currentPageNumber - 1),
  })
  const session = await getServerAuthSession()

  return (
    <>
      {!postCount ? (
        <div className="text-center text-secondary border rounded py-20 px-10">
          There are no published posts to show yet.
        </div>
      ) : (
        <div className="flow-root">
          <ul className="-my-12 divide-y divide-primary">
            {posts.map((post) => (
              <li key={post.id} className="py-10">
                <PostSummary session={session} post={post} />
              </li>
            ))}
          </ul>
        </div>
      )}
      <Pagination
        itemCount={postCount}
        itemsPerPage={POSTS_PER_PAGE}
        currentPageNumber={currentPageNumber}
      />
    </>
  )
}
