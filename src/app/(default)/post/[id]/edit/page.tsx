import { getServerAuthSession } from '~/server/auth'
import { api } from '~/trpc/server'

import { EditPostForm } from '../_components/edit-post-form'
import { cache } from 'react'

type ProfilePageParams = {
  params: {
    id: string
  }
}

export const generateMetadata = async ({ params }: ProfilePageParams) => {
  const cachedPostData = cache(async () => {
    return await api.post.detail.query({
      id: Number(params.id),
    })
  })

  const post = await cachedPostData()

  if (!post) return

  return {
    title: `Edit - ${post.title} - Beam`,
  }
}

export default async function EditPostPage({ params }: ProfilePageParams) {
  const cachedPostData = cache(async () => {
    return await api.post.detail.query({
      id: Number(params.id),
    })
  })

  const post = await cachedPostData()

  const session = await getServerAuthSession()
  const postBelongsToUser = post.author.id === session!.user.id

  return (
    <>
      {postBelongsToUser ? (
        <>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Edit &quot;{post.title}&quot;
          </h1>
          <div className="mt-6">
            <EditPostForm initialData={post} postId={post.id} backTo="/" />
          </div>
        </>
      ) : (
        <div>You don&apos;t have permissions to edit this post.</div>
      )}
    </>
  )
}
