'use client'

import * as React from 'react'

import { api } from '~/trpc/react'
import { useRouter } from 'next/navigation'
import { markdownToHtml } from '~/utils/text'
import { useSession } from 'next-auth/react'
import { PostSkeleton } from './post-skeleton'
import { PostForm } from './post-form'

type PostFormProps = {
  postId: number
  isSubmitting?: boolean
  backTo: string
}

export const EditPostForm = ({ postId, backTo }: PostFormProps) => {
  const { data, isLoading } = usePostData(postId)
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
          backTo={backTo}
        />
      </div>
    </>
  )
}

const usePostData = (id: number) => {
  const router = useRouter()
  const utils = api.useUtils()

  const { data } = api.post.detail.useQuery({
    id,
  })

  const { mutate, isLoading } = api.post.edit.useMutation({
    onMutate: async (newPost) => {
      const post = utils.post.detail.getData({
        id,
      })

      utils.post.detail.setData(
        {
          id,
        },
        {
          ...post!,
          title: newPost.data.title,
          content: newPost.data.content,
          contentHtml: markdownToHtml(newPost.data.content),
        },
      )
    },
    onSuccess: () => {
      router.push(`/post/${id}`)
    },
  })

  return { data, mutate, isLoading }
}
