'use client'

import { type Session } from 'next-auth'
import { useState } from 'react'
import { type RouterOutputs } from '~/trpc/shared'
import { Avatar } from './avatar'
import { AuthorWithDate } from './author-with-date'
import {
  Menu,
  MenuButton,
  MenuItemButton,
  MenuItems,
  MenuItem,
  MenuItemsContent,
} from './menu'
import DotsIcon from '../_svg/dots-icon'
import { Button } from './button'
import { HtmlView } from './html-view'
import { api } from '~/trpc/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Controller, type SubmitHandler, useForm } from 'react-hook-form'
import { MarkdownEditor } from './markdown-editor'

import { useDialogStore } from '../_hooks/use-dialog-store'
import {
  AlertDialogAction,
  AlertDialogActions,
  AlertDialogCancel,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from './alert-dialog'

type Comment = RouterOutputs['post']['detail']['comments'][number]

type CommentProps = {
  session: Session | null
  postId: number
  comment: Comment
}

export const Comment = ({ session, postId, comment }: CommentProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const { handleDialog } = useDialogStore()

  const commentBelongsToUser = comment.author.id === session!.user.id

  if (isEditing) {
    return (
      <div className="flex items-start gap-4">
        <Avatar name={comment.author.name!} src={comment.author.image} />
        <EditCommentForm
          postId={postId}
          comment={comment}
          onDone={() => {
            setIsEditing(false)
          }}
        />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <AuthorWithDate author={comment.author} date={comment.createdAt} />
        {commentBelongsToUser && (
          <Menu>
            <MenuButton
              title="More"
              className="inline-flex items-center justify-center flex-shrink-0 transition-colors rounded-full h-8 w-8 focus-ring border text-primary border-secondary bg-primary hover:bg-secondary"
            >
              <DotsIcon className="w-4 h-4" />
            </MenuButton>

            <MenuItems className="w-28">
              <MenuItemsContent>
                <MenuItem>
                  <MenuItemButton onClick={() => setIsEditing(true)}>
                    Edit
                  </MenuItemButton>
                </MenuItem>

                <MenuItem>
                  <MenuItemButton
                    onClick={() => {
                      handleDialog({
                        content: (
                          <ConfirmDeleteCommentDialog commentId={comment.id} />
                        ),
                      })
                    }}
                  >
                    Delete
                  </MenuItemButton>
                </MenuItem>
              </MenuItemsContent>
            </MenuItems>
          </Menu>
        )}
      </div>

      <div className="mt-4 pl-11 sm:pl-16">
        <HtmlView html={comment.contentHtml} />
      </div>
    </div>
  )
}

type EditCommentFormProps = {
  postId: number
  comment: Comment
  onDone: () => void
}

type CommentFormData = {
  content: string
}

const EditCommentForm = ({ comment, onDone }: EditCommentFormProps) => {
  const router = useRouter()
  const editCommentMutation = api.comment.edit.useMutation({
    onSuccess: () => {
      router.refresh()
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`)
    },
  })
  const { control, handleSubmit } = useForm<CommentFormData>({
    defaultValues: {
      content: comment.content,
    },
  })

  const onSubmit: SubmitHandler<CommentFormData> = (data) => {
    editCommentMutation.mutate(
      {
        id: comment.id,
        data: {
          content: data.content,
        },
      },
      {
        onSuccess: () => onDone(),
      },
    )
  }

  return (
    <form className="flex-1" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="content"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <MarkdownEditor
            value={field.value}
            onChange={field.onChange}
            onTriggerSubmit={handleSubmit(onSubmit)}
            required
            placeholder="Comment"
            minRows={4}
            autoFocus
          />
        )}
      />
      <div className="flex gap-4 mt-4">
        <Button
          type="submit"
          isLoading={editCommentMutation.isLoading}
          loadingChildren="Updating comment"
        >
          Update comment
        </Button>
        <Button variant="secondary" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

export const AddCommentForm = ({ postId }: { postId: number }) => {
  const router = useRouter()
  const [markdownEditorKey, setMarkdownEditorKey] = useState(0)

  const addCommentMutation = api.comment.add.useMutation({
    onSuccess: () => {
      router.refresh()
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`)
    },
  })
  const { control, handleSubmit, reset } = useForm<CommentFormData>()

  const onSubmit: SubmitHandler<CommentFormData> = (data) => {
    addCommentMutation.mutate(
      {
        postId,
        content: data.content,
      },
      {
        onSuccess: () => {
          reset({ content: '' })
          setMarkdownEditorKey((markdownEditorKey) => markdownEditorKey + 1)
        },
      },
    )
  }

  return (
    <form className="flex-1" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="content"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <MarkdownEditor
            key={markdownEditorKey}
            value={field.value}
            onChange={field.onChange}
            onTriggerSubmit={handleSubmit(onSubmit)}
            required
            placeholder="Comment"
            minRows={4}
          />
        )}
      />
      <div className="mt-4">
        <Button
          type="submit"
          isLoading={addCommentMutation.isLoading}
          loadingChildren="Adding comment"
        >
          Add comment
        </Button>
      </div>
    </form>
  )
}

type ConfirmDeleteCommentDialogProps = {
  commentId: number
}

const ConfirmDeleteCommentDialog = ({
  commentId,
}: ConfirmDeleteCommentDialogProps) => {
  const router = useRouter()
  const { handleDialogClose } = useDialogStore()

  const deleteCommentMutation = api.comment.delete.useMutation({
    onSuccess: () => {
      router.refresh()
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`)
    },
  })

  return (
    <>
      <AlertDialogContent>
        <AlertDialogTitle>Delete comment</AlertDialogTitle>
        <AlertDialogDescription className="mt-6">
          Are you sure you want to delete this comment?
        </AlertDialogDescription>
        <AlertDialogCloseButton onClick={handleDialogClose} />
      </AlertDialogContent>
      <AlertDialogActions>
        <AlertDialogAction>
          <Button
            variant="secondary"
            className="!text-red"
            isLoading={deleteCommentMutation.isLoading}
            loadingChildren="Deleting comment"
            onClick={() => {
              deleteCommentMutation.mutate(commentId, {
                onSuccess: () => handleDialogClose(),
              })
            }}
          >
            Delete comment
          </Button>
        </AlertDialogAction>
        <AlertDialogCancel>
          <Button variant="secondary" onClick={handleDialogClose}>
            Cancel
          </Button>
        </AlertDialogCancel>
      </AlertDialogActions>
    </>
  )
}
