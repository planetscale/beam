'use client'

import * as React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TextField } from '~/components/text-field'
import { Button } from '~/components/button'
import MarkdownIcon from '~/components/svg/markdown-icon'
import { MarkdownEditor } from '~/components/markdown-editor'

import { api } from '~/trpc/react'
import { useRouter } from 'next/navigation'
import { markdownToHtml } from '~/utils/text'
import { useSession } from 'next-auth/react'
import { PostSkeleton } from './post-skeleton'

type FormData = {
  title: string
  content: string
}

type PostFormProps = {
  postId: number
  isSubmitting?: boolean
  backTo: string
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

export const EditPostForm = ({ postId, backTo }: PostFormProps) => {
  const { data, mutate, isLoading } = usePostData(postId)
  const { data: session } = useSession()

  const { control, register, handleSubmit } = useForm<FormData>({
    defaultValues: data,
  })

  const onSubmit = (values: FormData) => {
    mutate({
      id: postId,
      data: values,
    })
  }

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
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register('title', { required: true })}
            label="Title"
            autoFocus
            required
            className="text-lg font-semibold !py-1.5"
          />

          <div className="mt-6">
            <Controller
              name="content"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <MarkdownEditor
                  label="Post"
                  value={field.value}
                  onChange={field.onChange}
                  onTriggerSubmit={handleSubmit(onSubmit)}
                  required
                />
              )}
            />
          </div>

          <div className="flex items-center justify-between gap-4 mt-8">
            <div className="flex gap-4">
              <Button
                type="submit"
                isLoading={isLoading}
                loadingChildren={`${isLoading ? 'Saving' : 'Save'}`}
              >
                Save
              </Button>
              <Button href={backTo} variant="secondary">
                Cancel
              </Button>
            </div>
            {!isLoading && (
              <a
                href="https://docs.github.com/en/github/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 transition-colors text-secondary hover:text-blue"
              >
                <MarkdownIcon />
                <span className="text-xs">Markdown supported</span>
              </a>
            )}
          </div>
        </form>
      </div>
    </>
  )
}
