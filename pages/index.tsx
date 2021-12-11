import { ButtonLink } from '@/components/button-link'
import { Layout } from '@/components/layout'
import type { PostSummaryProps } from '@/components/post-summary'
import { PostSummarySkeleton } from '@/components/post-summary-skeleton'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'

const POSTS_PER_PAGE = 20

const PostSummary = dynamic<PostSummaryProps>(
  () => import('@/components/post-summary').then((mod) => mod.PostSummary),
  { ssr: false }
)

const Home: NextPageWithAuthAndLayout = () => {
  const router = useRouter()
  const page = router.query.page ? Number(router.query.page) : 1
  const skip = page === 1 ? undefined : POSTS_PER_PAGE * (page - 1)
  const utils = trpc.useContext()
  const feedQuery = trpc.useQuery([
    'post.feed',
    {
      take: POSTS_PER_PAGE,
      skip,
    },
  ])
  const likeMutation = trpc.useMutation(['post.like'], {
    onMutate: async (id) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await utils.cancelQuery([
        'post.feed',
        {
          take: POSTS_PER_PAGE,
          skip,
        },
      ])

      // Snapshot the previous value
      const previousPosts = utils.getQueryData([
        'post.feed',
        {
          take: POSTS_PER_PAGE,
          skip,
        },
      ])

      // Optimistically update to the new value
      utils.setQueryData(
        [
          'post.feed',
          {
            take: POSTS_PER_PAGE,
            skip,
          },
        ],
        previousPosts?.items.map((t) =>
          t.id === id
            ? {
                ...t,
                likedBy: [{ id: 'aa' }],
              }
            : t
        )
      )

      // Return a context with the previous and new todo
      return { previousTodo, newTodo }
    },
  })
  const unlikeMutation = trpc.useMutation(['post.unlike'])

  if (feedQuery.isLoading) {
    return (
      <div className="flow-root">
        <ul className="-my-12 divide-y divide-primary">
          {[...Array(3)].map((_, idx) => (
            <li key={idx} className="py-12">
              <PostSummarySkeleton />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (feedQuery.isError) {
    return <div>Error: {feedQuery.error.message}</div>
  }

  const totalPages = Math.ceil(feedQuery.data!.count / POSTS_PER_PAGE)

  return (
    <>
      <Head>
        <title>Flux</title>
      </Head>

      {feedQuery.data?.items.length === 0 ? (
        <div className="text-lg text-center">No posts</div>
      ) : (
        <div className="flow-root">
          <ul className="-my-12 divide-y divide-primary">
            {feedQuery.data?.items.map((post) => (
              <li key={post.id} className="py-12">
                <PostSummary
                  post={post}
                  isLiked={post.likedBy.length === 1}
                  onLike={() => {
                    likeMutation.mutate(post.id)
                  }}
                  onUnlike={() => {
                    unlikeMutation.mutate(post.id)
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-12">
          <ButtonLink
            href={{ pathname: '/', query: { page: page - 1 } }}
            variant="secondary"
            className={page === 1 ? 'pointer-events-none opacity-50' : ''}
          >
            Previous
          </ButtonLink>
          <ButtonLink
            href={{ pathname: '/', query: { page: page + 1 } }}
            variant="secondary"
            className={
              page === totalPages ? 'pointer-events-none opacity-50' : ''
            }
          >
            Next
          </ButtonLink>
        </div>
      )}
    </>
  )
}

Home.auth = true

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default Home
