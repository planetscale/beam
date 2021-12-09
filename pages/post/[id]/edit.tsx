import { Layout } from '@/components/layout'
import { PostForm } from '@/components/post-form'
import type { NextPage } from 'next'
import Head from 'next/head'

const post = {
  id: '1',
  title: 'We shipped a thing!',
  author: {
    id: '1',
    name: 'Bogdan Soare',
    avatarUrl:
      'https://pbs.twimg.com/profile_images/1028943463209943040/EtBuwo-A_400x400.jpg',
  },
  createdAt: new Date('2021/11/24'),
  content: 'Hey test \n **lorem**',
}

const EditPostPage: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>Edit {post.title} - Flux</title>
      </Head>

      <h1 className="text-3xl font-bold tracking-tight">
        Edit &quot;{post.title}&quot;
      </h1>

      <div className="mt-6">
        <PostForm
          defaultValues={{
            title: post.title,
            content: post.content,
          }}
          onSubmit={(values) => {
            console.log(values)
          }}
        />
      </div>
    </Layout>
  )
}

export default EditPostPage
