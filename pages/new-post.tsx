import { Layout } from '@/components/layout'
import { PostForm } from '@/components/post-form'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'
import Head from 'next/head'
import { useRouter } from 'next/router'

const NewPostPage: NextPageWithAuthAndLayout = () => {
  const router = useRouter()
  const addPostMutation = trpc.useMutation('post.add')

  return (
    <>
      <Head>
        <title>New Post - Flux</title>
      </Head>

      <h1 className="text-3xl font-bold tracking-tight">New post</h1>

      <div className="mt-6">
        <PostForm
          isSubmitting={addPostMutation.isLoading}
          onSubmit={(values) => {
            addPostMutation.mutate(
              { title: values.title, content: values.content },
              {
                onSuccess: (data) => router.push(`/post/${data.id}`),
              }
            )
          }}
        />
      </div>
    </>
  )
}

NewPostPage.auth = true

NewPostPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default NewPostPage
