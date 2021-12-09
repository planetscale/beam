import { Layout } from '@/components/layout'
import { PostForm } from '@/components/post-form'
import type { NextPage } from 'next'
import Head from 'next/head'

const NewPostPage: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>New Post - Flux</title>
      </Head>

      <h1 className="text-3xl font-bold tracking-tight">New post</h1>

      <div className="mt-6">
        <PostForm
          onSubmit={(values) => {
            console.log(values)
          }}
        />
      </div>
    </Layout>
  )
}

export default NewPostPage
