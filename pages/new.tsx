import { Layout } from '@/components/layout'
import { PostForm } from '@/components/post-form'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'
import Head from 'next/head'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

const NewPostPage: NextPageWithAuthAndLayout = () => {
  const router = useRouter()
  const addPostMutation = trpc.useMutation('post.add', {
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`)
    },
  })

  return (
    <>
      <Head>
        <title>New Post - Beam</title>
      </Head>

      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
        New post
      </h1>

      <div className="mt-6">
        <PostForm
          isSubmitting={addPostMutation.isLoading}
          defaultValues={{
            title: '',
            content: '',
          }}
          backTo="/"
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
