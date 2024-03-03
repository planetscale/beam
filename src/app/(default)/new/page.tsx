import { type Metadata } from 'next'
import { PostForm } from '~/components/post-form'

export const metadata: Metadata = {
  title: 'New Post',
}

export default function NewPost() {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
        New post
      </h1>

      <div className="mt-6">
        <PostForm
          isSubmitting={false}
          defaultValues={{
            title: '',
            content: '',
          }}
          backTo="/"
        />
      </div>
    </>
  )
}
