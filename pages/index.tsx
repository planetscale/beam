import { Layout } from '@/components/layout'
import { getQueryPaginationInput, Pagination } from '@/components/pagination'
import type { PostSummaryProps } from '@/components/post-summary'
import { PostSummarySkeleton } from '@/components/post-summary-skeleton'
import { InferQueryPathAndInput, trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'

const PostSummary = dynamic<PostSummaryProps>(
  () => import('@/components/post-summary').then((mod) => mod.PostSummary),
  { ssr: false }
)

const POSTS_PER_PAGE = 20

const Home: NextPageWithAuthAndLayout = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const currentPageNumber = router.query.page ? Number(router.query.page) : 1
  const utils = trpc.useContext()
  const feedQueryPathAndInput: InferQueryPathAndInput<'post.feed'> = [
    'post.feed',
    getQueryPaginationInput(POSTS_PER_PAGE, currentPageNumber),
  ]
  const feedQuery = trpc.useQuery(feedQueryPathAndInput)
  const likeMutation = trpc.useMutation(['post.like'], {
    onMutate: async (likedPostId) => {
      await utils.cancelQuery(feedQueryPathAndInput)

      const previousQuery = utils.getQueryData(feedQueryPathAndInput)

      if (previousQuery) {
        utils.setQueryData(feedQueryPathAndInput, {
          ...previousQuery,
          posts: previousQuery.posts.map((post) =>
            post.id === likedPostId
              ? {
                  ...post,
                  likedBy: [
                    ...post.likedBy,
                    {
                      user: { id: session!.user.id, name: session!.user.name },
                    },
                  ],
                }
              : post
          ),
        })
      }

      return { previousQuery }
    },
    onError: (err, id, context: any) => {
      if (context?.previousQuery) {
        utils.setQueryData(feedQueryPathAndInput, context.previousQuery)
      }
    },
  })
  const unlikeMutation = trpc.useMutation(['post.unlike'], {
    onMutate: async (unlikedPostId) => {
      await utils.cancelQuery(feedQueryPathAndInput)

      const previousQuery = utils.getQueryData(feedQueryPathAndInput)

      if (previousQuery) {
        utils.setQueryData(feedQueryPathAndInput, {
          ...previousQuery,
          posts: previousQuery.posts.map((post) =>
            post.id === unlikedPostId
              ? {
                  ...post,
                  likedBy: post.likedBy.filter(
                    (item) => item.user.id !== session!.user.id
                  ),
                }
              : post
          ),
        })
      }

      return { previousQuery }
    },
    onError: (err, id, context: any) => {
      if (context?.previousQuery) {
        utils.setQueryData(feedQueryPathAndInput, context.previousQuery)
      }
    },
  })

  if (feedQuery.data) {
    return (
      <>
        <Head>
          <title>Beam</title>
        </Head>

        {feedQuery.data.postCount === 0 ? (
          <div className="text-center text-secondary border rounded py-20 px-10">
            There are no published posts to show yet.
          </div>
        ) : (
          <div className="flow-root">
            <ul className="-my-12 divide-y divide-primary">
              {feedQuery.data.posts.map((post) => (
                <li key={post.id} className="py-10">
                  <PostSummary
                    post={post}
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

        <Pagination
          itemCount={feedQuery.data.postCount}
          itemsPerPage={POSTS_PER_PAGE}
          currentPageNumber={currentPageNumber}
        />
      </>
    )
  }

  if (feedQuery.isError) {
    return <div>Error: {feedQuery.error.message}</div>
  }

  return (
    <div className="flow-root">
      <ul className="-my-12 divide-y divide-primary">
        {[...Array(3)].map((_, idx) => (
          <li key={idx} className="py-10">
            <PostSummarySkeleton />
          </li>
        ))}
      </ul>
    </div>
  )
}

Home.auth = true

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default Home
