'use client'

import * as React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TextField } from '~/components/text-field'
import { Button } from '~/components/button'
import MarkdownIcon from '~/components/svg/markdown-icon'
import { MarkdownEditor } from '~/components/markdown-editor'
import { markdownToHtml } from '~/utils/text'
import { useRouter } from 'next/navigation'
import { api } from '~/trpc/react'

type FormData = {
  title: string
  content: string
}

type PostFormProps = {
  postId?: number
  defaultValues?: FormData
  isSubmitting?: boolean
  backTo: string
}

export function PostForm({
  postId,
  defaultValues,
  isSubmitting,
  backTo,
}: PostFormProps) {
  const { control, register, handleSubmit, reset, getValues } =
    useForm<FormData>({
      defaultValues,
    })

  const { newPost, editPost } = usePostMutations(postId, () =>
    reset(getValues()),
  )

  const onSubmit = (values: FormData) => {
    if (postId) {
      editPost.mutate({
        id: postId,
        data: values,
      })
    } else {
      newPost.mutate(values)
    }
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
            isLoading={isSubmitting}
            loadingChildren={`${defaultValues ? 'Saving' : 'Publishing'}`}
          >
            {defaultValues?.title ? 'Save' : 'Publish'}
          </Button>
          <Button href={backTo} variant="secondary">
            Cancel
          </Button>
        </div>
        {!isSubmitting && (
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

const usePostMutations = (id?: number, callback?: () => void) => {
  const router = useRouter()
  const utils = api.useUtils()

  const newPost = api.post.add.useMutation({
    onSuccess(data) {
      router.push(`/post/${data.id}`)
      callback?.()
    },
  })

  const editPost = api.post.edit.useMutation({
    onMutate: async (newPost) => {
      const post = utils.post.detail.getData({
        id: id!,
      })

      utils.post.detail.setData(
        {
          id: id!,
        },
        {
          ...post!,
          title: newPost.data.title,
          content: newPost.data.content,
          contentHtml: markdownToHtml(newPost.data.content),
        },
      )
      await utils.post.feed.invalidate()
    },
    onSuccess: () => {
      router.push(`/post/${id}`)
    },
  })

  return { newPost, editPost }
}
