'use client'

//import { useLeaveConfirm } from '~/hooks/use-leave-confirm'
import * as React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TextField } from '~/app/_components/text-field'
import { Button } from '~/app/_components/button'
import MarkdownIcon from '~/app/_svg/markdown-icon'
import { MarkdownEditor } from '~/app/_components/markdown-editor'
import { useRouter } from 'next/navigation'
import { api } from '~/trpc/react'
import { useLeaveConfirm } from '~/app/_hooks/use-leave-confirm'

type FormData = {
  title: string
  content: string
}

type PostFormProps = {
  defaultValues?: FormData
  isSubmitting?: boolean
  backTo: string
}

export function PostForm({
  defaultValues,
  isSubmitting,
  backTo,
}: PostFormProps) {
  const { control, register, getValues, formState, reset, handleSubmit } =
    useForm<FormData>({
      defaultValues,
    })

  useLeaveConfirm({ formState })

  const router = useRouter()
  const addPostMutation = api.post.add.useMutation({
    onSuccess(data) {
      router.push(`/post/${data.id}`)
      reset(getValues())
    },
  })

  const onSubmit = (values: FormData) => {
    addPostMutation.mutate(values)
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
