'use client'

import * as React from 'react'

import { api } from '~/trpc/react'
import { useSession } from 'next-auth/react'
import { PostSkeleton } from './post-skeleton'
import { PostForm } from './post-form'

type PostFormProps = {
  postId: number
  isSubmitting?: boolean
  backTo: string
}

export const EditPostForm = ({ postId, backTo }: PostFormProps) => {
  const { data, isLoading } = api.post.detail.useQuery({
    id: postId,
  })

  const { data: session } = useSession()

  if (isLoading || !data) return <PostSkeleton />

  const postBelongsToUser = data.author.id === session!.user.id

  if (!postBelongsToUser)
    return <div>You don&apos;t have permissions to edit this post.</div>

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
        Edit &quot;{data?.title}&quot;
      </h1>
      <div className="mt-6">
        <PostForm
          defaultValues={{
            title: data.title,
            content: data.content,
          }}
          postId={data.id}
          backTo={backTo}
        />
      </div>
    </>
  )
}
