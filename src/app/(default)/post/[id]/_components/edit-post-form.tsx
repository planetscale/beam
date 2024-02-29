'use client'

import * as React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TextField } from '~/app/_components/text-field'
import { Button } from '~/app/_components/button'
import MarkdownIcon from '~/app/_svg/markdown-icon'
import { MarkdownEditor } from '~/app/_components/markdown-editor'

import { api } from '~/trpc/react'
import { useRouter } from 'next/navigation'
import { type RouterOutputs } from '~/trpc/shared'
import { markdownToHtml } from '~/utils/text'

type FormData = {
  title: string
  content: string
}

type PostFormProps = {
  postId: number
  isSubmitting?: boolean
  backTo: string
  initialData: RouterOutputs['post']['detail']
}

const usePostData = (
  id: number,
  initialData: RouterOutputs['post']['detail'],
) => {
  const router = useRouter()
  const utils = api.useUtils()

  const { data } = api.post.detail.useQuery(
    {
      id,
    },
    { initialData },
  )

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

export const EditPostForm = ({
  postId,
  backTo,
  initialData,
}: PostFormProps) => {
  const { data, mutate, isLoading } = usePostData(postId, initialData)

  const { control, register, handleSubmit } = useForm<FormData>({
    defaultValues: data,
  })

  const onSubmit = (values: FormData) => {
    mutate({
      id: postId,
      data: values,
    })
  }

  return (
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
  )
}
