import { Layout } from '@/components/layout'
import { PostForm } from '@/components/post-form'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

const EditPostPage: NextPageWithAuthAndLayout = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const postQuery = trpc.useQuery([
    'post.detail',
    { id: Number(router.query.id) },
  ])
  const editPostMutation = trpc.useMutation('post.edit', {
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`)
    },
  })

  if (postQuery.data) {
    const postBelongsToUser = postQuery.data.author.id === session!.user.id

    return (
      <>
        <Head>
          <title>Edit {postQuery.data.title} - Beam</title>
        </Head>

        {postBelongsToUser ? (
          <>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Edit &quot;{postQuery.data.title}&quot;
            </h1>

            <div className="mt-6">
              <PostForm
                isSubmitting={editPostMutation.isLoading}
                defaultValues={{
                  title: postQuery.data.title,
                  content: postQuery.data.content,
                }}
                backTo={`/post/${postQuery.data.id}`}
                onSubmit={(values) => {
                  editPostMutation.mutate(
                    {
                      id: postQuery.data.id,
                      data: { title: values.title, content: values.content },
                    },
                    {
                      onSuccess: () =>
                        router.push(`/post/${postQuery.data.id}`),
                    }
                  )
                }}
              />
            </div>
          </>
        ) : (
          <div>You don&apos;t have permissions to edit this post.</div>
        )}
      </>
    )
  }

  if (postQuery.isError) {
    return <div>Error: {postQuery.error.message}</div>
  }

  return (
    <div className="animate-pulse">
      <div className="w-3/4 bg-gray-200 rounded h-9 dark:bg-gray-700" />
      <div className="mt-7">
        <div>
          <div className="w-10 h-5 bg-gray-200 rounded dark:bg-gray-700" />
          <div className="border rounded h-[42px] border-secondary mt-2" />
        </div>
        <div className="mt-6">
          <div className="w-10 h-5 bg-gray-200 rounded dark:bg-gray-700" />
          <div className="mt-2 border rounded h-9 border-secondary" />
          <div className="mt-2 border rounded h-[378px] border-secondary" />
        </div>
      </div>
      <div className="flex gap-4 mt-9">
        <div className="w-[92px] bg-gray-200 rounded-full h-button dark:bg-gray-700" />
        <div className="w-20 border rounded-full h-button border-secondary" />
      </div>
    </div>
  )
}

EditPostPage.auth = true

EditPostPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default EditPostPage
