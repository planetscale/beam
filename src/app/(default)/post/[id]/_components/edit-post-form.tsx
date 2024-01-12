'use client'

//import { useLeaveConfirm } from '~/hooks/use-leave-confirm'
import * as React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TextField } from '~/app/_components/text-field'
import { Button } from '~/app/_components/button'
import MarkdownIcon from '~/app/_svg/markdown-icon'
import { MarkdownEditor } from '~/app/_components/markdown-editor'

import { api } from '~/trpc/react'
import { useRouter } from 'next/navigation'
import { type RouterOutputs } from '~/trpc/shared'

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

export const EditPostForm = ({
  postId,
  backTo,
  initialData,
}: PostFormProps) => {
  const { data } = api.post.detail.useQuery(
    {
      id: postId,
    },
    { initialData },
  )

  const { control, register, handleSubmit } = useForm<FormData>({
    defaultValues: data,
  })

  // useLeaveConfirm({ formState })
  const router = useRouter()

  const editPostMutation = api.post.edit.useMutation({
    onSuccess: async () => {
      router.push(`/post/${postId}`)
    },
  })

  const onSubmit = (values: FormData) => {
    editPostMutation.mutate({
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
            isLoading={editPostMutation.isLoading}
            loadingChildren={`${
              editPostMutation.isLoading ? 'Saving' : 'Save'
            }`}
          >
            Save
          </Button>
          <Button href={backTo} variant="secondary">
            Cancel
          </Button>
        </div>
        {!editPostMutation.isLoading && (
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
