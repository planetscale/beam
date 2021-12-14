import { Button } from '@/components/button'
import { ButtonLink } from '@/components/button-link'
import { MarkdownIcon } from '@/components/icons'
import { MarkdownEditor } from '@/components/markdown-editor'
import { TextField } from '@/components/text-field'
import * as React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

type FormData = {
  title: string
  content: string
}

type PostFormProps = {
  defaultValues?: FormData
  isSubmitting?: boolean
  onSubmit: SubmitHandler<FormData>
}

export function PostForm({
  defaultValues,
  isSubmitting,
  onSubmit,
}: PostFormProps) {
  const { control, register, handleSubmit } = useForm<FormData>({
    defaultValues,
  })

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
            loadingChildren={`${defaultValues ? 'Editing' : 'Publishing'} post`}
          >
            {defaultValues ? 'Edit' : 'Publish'} post
          </Button>
          <ButtonLink href="/" variant="secondary">
            Cancel
          </ButtonLink>
        </div>
        <a
          href="https://docs.github.com/en/github/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 transition-colors text-secondary hover:text-blue-dark"
        >
          <MarkdownIcon />
          <span className="text-xs">Markdown supported</span>
        </a>
      </div>
    </form>
  )
}
