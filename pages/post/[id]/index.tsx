import { AuthorWithDate } from '@/components/author-with-date'
import { Avatar } from '@/components/avatar'
import { Banner } from '@/components/banner'
import { Button } from '@/components/button'
import { ButtonLink } from '@/components/button-link'
import {
  Dialog,
  DialogActions,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/dialog'
import { HtmlView } from '@/components/html-view'
import { IconButton } from '@/components/icon-button'
import {
  DotsIcon,
  EditIcon,
  EyeClosedIcon,
  EyeIcon,
  MessageIcon,
  TrashIcon,
} from '@/components/icons'
import { Layout } from '@/components/layout'
import { LikeButton } from '@/components/like-button'
import { MarkdownEditor } from '@/components/markdown-editor'
import {
  Menu,
  MenuButton,
  MenuItemButton,
  MenuItems,
  MenuItemsContent,
} from '@/components/menu'
import { InferQueryOutput, InferQueryPathAndInput, trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

function getPostQueryPathAndInput(
  id: number
): InferQueryPathAndInput<'post.detail'> {
  return [
    'post.detail',
    {
      id,
    },
  ]
}

const PostPage: NextPageWithAuthAndLayout = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const utils = trpc.useContext()
  const postQueryPathAndInput = getPostQueryPathAndInput(
    Number(router.query.id)
  )
  const postQuery = trpc.useQuery(postQueryPathAndInput)
  const likeMutation = trpc.useMutation(['post.like'], {
    onMutate: async (likedPostId) => {
      await utils.cancelQuery(postQueryPathAndInput)

      const previousPost = utils.getQueryData(postQueryPathAndInput)

      if (previousPost) {
        utils.setQueryData(postQueryPathAndInput, {
          ...previousPost,
          likedBy: [{ id: session!.user.id }],
          _count: {
            ...previousPost._count,
            likedBy: previousPost._count.likedBy + 1,
          },
        })
      }

      return { previousPost }
    },
    onError: (err, id, context: any) => {
      if (context?.previousPost) {
        utils.setQueryData(postQueryPathAndInput, context.previousPost)
      }
    },
  })
  const unlikeMutation = trpc.useMutation(['post.unlike'], {
    onMutate: async (unlikedPostId) => {
      await utils.cancelQuery(postQueryPathAndInput)

      const previousPost = utils.getQueryData(postQueryPathAndInput)

      if (previousPost) {
        utils.setQueryData(postQueryPathAndInput, {
          ...previousPost,
          likedBy: [],
          _count: {
            ...previousPost._count,
            likedBy: previousPost._count.likedBy - 1,
          },
        })
      }

      return { previousPost }
    },
    onError: (err, id, context: any) => {
      if (context?.previousPost) {
        utils.setQueryData(postQueryPathAndInput, context.previousPost)
      }
    },
  })
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    React.useState(false)
  const [isConfirmHideDialogOpen, setIsConfirmHideDialogOpen] =
    React.useState(false)
  const [isConfirmUnhideDialogOpen, setIsConfirmUnhideDialogOpen] =
    React.useState(false)

  if (postQuery.data) {
    const isUserAdmin = session!.user.role === 'ADMIN'
    const postBelongsToUser = postQuery.data.author.id === session!.user.id
    const isPostLiked = postQuery.data.likedBy.length === 1

    return (
      <>
        <Head>
          <title>{postQuery.data.title} - Flux</title>
        </Head>

        <div className="divide-y divide-primary">
          <div className="pb-12">
            {postQuery.data.hidden && (
              <Banner className="mb-6">
                This post has been hidden and is only visible to administrators.
              </Banner>
            )}

            <div className="flex items-center justify-between gap-4">
              <h1 className="text-3xl font-semibold tracking-tighter md:text-4xl">
                {postQuery.data.title}
              </h1>
              {(postBelongsToUser || isUserAdmin) && (
                <div className="flex gap-4">
                  {isUserAdmin &&
                    (postQuery.data.hidden ? (
                      <IconButton
                        variant="secondary"
                        title="Unhide"
                        onClick={() => {
                          setIsConfirmUnhideDialogOpen(true)
                        }}
                      >
                        <EyeIcon className="w-4 h-4" />
                      </IconButton>
                    ) : (
                      <IconButton
                        variant="secondary"
                        title="Hide"
                        onClick={() => {
                          setIsConfirmHideDialogOpen(true)
                        }}
                      >
                        <EyeClosedIcon className="w-4 h-4" />
                      </IconButton>
                    ))}
                  {postBelongsToUser && (
                    <>
                      <IconButton
                        variant="secondary"
                        title="Edit"
                        onClick={() => {
                          router.push(`/post/${postQuery.data.id}/edit`)
                        }}
                      >
                        <EditIcon className="w-4 h-4" />
                      </IconButton>
                      <IconButton
                        variant="secondary"
                        title="Delete"
                        onClick={() => {
                          setIsConfirmDeleteDialogOpen(true)
                        }}
                      >
                        <TrashIcon className="w-4 h-4 text-red" />
                      </IconButton>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="mt-6 mb-8">
              <AuthorWithDate
                author={postQuery.data.author}
                date={postQuery.data.createdAt}
              />
            </div>
            <HtmlView html={postQuery.data.contentHtml} className="mt-6" />
            <div className="flex gap-4 mt-6">
              <LikeButton
                isLiked={isPostLiked}
                likeCount={postQuery.data._count.likedBy}
                onLike={() => {
                  likeMutation.mutate(postQuery.data.id)
                }}
                onUnlike={() => {
                  unlikeMutation.mutate(postQuery.data.id)
                }}
              />
              <ButtonLink
                href={`/post/${postQuery.data.id}#comments`}
                variant="secondary"
              >
                <MessageIcon className="w-4 h-4 text-secondary" />
                <span className="ml-1.5">{postQuery.data._count.comments}</span>
              </ButtonLink>
            </div>
          </div>

          <div id="comments" className="pt-12 space-y-12">
            {postQuery.data.comments.length > 0 && (
              <ul className="space-y-12">
                {postQuery.data.comments.map((comment) => (
                  <li key={comment.id}>
                    <Comment postId={postQuery.data.id} comment={comment} />
                  </li>
                ))}
              </ul>
            )}
            <div className="flex items-start gap-2 sm:gap-4">
              <span className="hidden sm:inline-block">
                <Avatar name={session!.user.name} src={session!.user.image} />
              </span>
              <span className="inline-block sm:hidden">
                <Avatar
                  name={session!.user.name}
                  src={session!.user.image}
                  size="sm"
                />
              </span>
              <AddCommentForm postId={postQuery.data.id} />
            </div>
          </div>
        </div>

        <ConfirmDeleteDialog
          postId={postQuery.data.id}
          isOpen={isConfirmDeleteDialogOpen}
          onClose={() => {
            setIsConfirmDeleteDialogOpen(false)
          }}
        />

        <ConfirmHideDialog
          postId={postQuery.data.id}
          isOpen={isConfirmHideDialogOpen}
          onClose={() => {
            setIsConfirmHideDialogOpen(false)
          }}
        />

        <ConfirmUnhideDialog
          postId={postQuery.data.id}
          isOpen={isConfirmUnhideDialogOpen}
          onClose={() => {
            setIsConfirmUnhideDialogOpen(false)
          }}
        />
      </>
    )
  }

  if (postQuery.isError) {
    return <div>Error: {postQuery.error.message}</div>
  }

  return (
    <div className="animate-pulse">
      <div className="w-3/4 bg-gray-200 rounded h-9 dark:bg-gray-700" />
      <div className="flex items-center gap-4 mt-6">
        <div className="w-12 h-12 bg-gray-200 rounded-full dark:bg-gray-700" />
        <div className="flex-1">
          <div className="w-24 h-4 bg-gray-200 rounded dark:bg-gray-700" />
          <div className="w-32 h-3 mt-2 bg-gray-200 rounded dark:bg-gray-700" />
        </div>
      </div>
      <div className="space-y-3 mt-7">
        {[...Array(3)].map((_, idx) => (
          <React.Fragment key={idx}>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-5 col-span-2 bg-gray-200 rounded dark:bg-gray-700" />
              <div className="h-5 col-span-1 bg-gray-200 rounded dark:bg-gray-700" />
            </div>
            <div className="w-1/2 h-5 bg-gray-200 rounded dark:bg-gray-700" />
            <div className="grid grid-cols-3 gap-4">
              <div className="h-5 col-span-1 bg-gray-200 rounded dark:bg-gray-700" />
              <div className="h-5 col-span-2 bg-gray-200 rounded dark:bg-gray-700" />
            </div>
            <div className="w-3/5 h-5 bg-gray-200 rounded dark:bg-gray-700" />
          </React.Fragment>
        ))}
      </div>
      <div className="flex gap-4 mt-6">
        <div className="w-16 border rounded-full h-button border-secondary" />
        <div className="w-16 border rounded-full h-button border-secondary" />
      </div>
    </div>
  )
}

PostPage.auth = true

PostPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

function Comment({
  postId,
  comment,
}: {
  postId: number
  comment: InferQueryOutput<'post.detail'>['comments'][number]
}) {
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = React.useState(false)
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    React.useState(false)

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
            <MenuButton as={IconButton} variant="secondary" title="More">
              <DotsIcon className="w-4 h-4" />
            </MenuButton>

            <MenuItems className="w-28">
              <MenuItemsContent>
                <MenuItemButton
                  onClick={() => {
                    setIsEditing(true)
                  }}
                >
                  Edit
                </MenuItemButton>
                <MenuItemButton
                  className="!text-red"
                  onClick={() => {
                    setIsConfirmDeleteDialogOpen(true)
                  }}
                >
                  Delete
                </MenuItemButton>
              </MenuItemsContent>
            </MenuItems>
          </Menu>
        )}
      </div>

      <div className="mt-4 pl-11 sm:pl-16">
        <HtmlView html={comment.contentHtml} />
      </div>

      <ConfirmDeleteCommentDialog
        postId={postId}
        commentId={comment.id}
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => {
          setIsConfirmDeleteDialogOpen(false)
        }}
      />
    </div>
  )
}

type CommentFormData = {
  content: string
}

function AddCommentForm({ postId }: { postId: number }) {
  const utils = trpc.useContext()
  const addCommentMutation = trpc.useMutation('comment.add', {
    onSuccess: () => {
      return utils.invalidateQueries(getPostQueryPathAndInput(postId))
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
          reset()
        },
      }
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

function EditCommentForm({
  postId,
  comment,
  onDone,
}: {
  postId: number
  comment: InferQueryOutput<'post.detail'>['comments'][number]
  onDone: () => void
}) {
  const utils = trpc.useContext()
  const editCommentMutation = trpc.useMutation('comment.edit', {
    onSuccess: () => {
      return utils.invalidateQueries(getPostQueryPathAndInput(postId))
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
      }
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

function ConfirmDeleteCommentDialog({
  postId,
  commentId,
  isOpen,
  onClose,
}: {
  postId: number
  commentId: number
  isOpen: boolean
  onClose: () => void
}) {
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  const utils = trpc.useContext()
  const deleteCommentMutation = trpc.useMutation('comment.delete', {
    onSuccess: () => {
      return utils.invalidateQueries(getPostQueryPathAndInput(postId))
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`)
    },
  })

  return (
    <Dialog isOpen={isOpen} onClose={onClose} initialFocus={cancelRef}>
      <DialogContent>
        <DialogTitle>Delete comment</DialogTitle>
        <DialogDescription className="mt-6">
          Are you sure you want to delete this comment?
        </DialogDescription>
        <DialogCloseButton onClick={onClose} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="secondary"
          className="!text-red"
          isLoading={deleteCommentMutation.isLoading}
          loadingChildren="Deleting comment"
          onClick={() => {
            deleteCommentMutation.mutate(commentId, {
              onSuccess: () => onClose(),
            })
          }}
        >
          Delete comment
        </Button>
        <Button variant="secondary" onClick={onClose} ref={cancelRef}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function ConfirmDeleteDialog({
  postId,
  isOpen,
  onClose,
}: {
  postId: number
  isOpen: boolean
  onClose: () => void
}) {
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  const router = useRouter()
  const deletePostMutation = trpc.useMutation('post.delete', {
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`)
    },
  })

  return (
    <Dialog isOpen={isOpen} onClose={onClose} initialFocus={cancelRef}>
      <DialogContent>
        <DialogTitle>Delete post</DialogTitle>
        <DialogDescription className="mt-6">
          Are you sure you want to delete this post?
        </DialogDescription>
        <DialogCloseButton onClick={onClose} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="secondary"
          className="!text-red"
          isLoading={deletePostMutation.isLoading}
          loadingChildren="Deleting post"
          onClick={() => {
            deletePostMutation.mutate(postId, {
              onSuccess: () => router.push('/'),
            })
          }}
        >
          Delete post
        </Button>
        <Button variant="secondary" onClick={onClose} ref={cancelRef}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function ConfirmHideDialog({
  postId,
  isOpen,
  onClose,
}: {
  postId: number
  isOpen: boolean
  onClose: () => void
}) {
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  const utils = trpc.useContext()
  const hidePostMutation = trpc.useMutation('post.hide', {
    onSuccess: () => {
      return utils.invalidateQueries(getPostQueryPathAndInput(postId))
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`)
    },
  })

  return (
    <Dialog isOpen={isOpen} onClose={onClose} initialFocus={cancelRef}>
      <DialogContent>
        <DialogTitle>Hide post</DialogTitle>
        <DialogDescription className="mt-6">
          Are you sure you want to hide this post?
        </DialogDescription>
        <DialogCloseButton onClick={onClose} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="secondary"
          isLoading={hidePostMutation.isLoading}
          loadingChildren="Hiding post"
          onClick={() => {
            hidePostMutation.mutate(postId, {
              onSuccess: () => {
                toast.success('Post hidden')
                onClose()
              },
            })
          }}
        >
          Hide post
        </Button>
        <Button variant="secondary" onClick={onClose} ref={cancelRef}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function ConfirmUnhideDialog({
  postId,
  isOpen,
  onClose,
}: {
  postId: number
  isOpen: boolean
  onClose: () => void
}) {
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  const utils = trpc.useContext()
  const unhidePostMutation = trpc.useMutation('post.unhide', {
    onSuccess: () => {
      return utils.invalidateQueries(getPostQueryPathAndInput(postId))
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`)
    },
  })

  return (
    <Dialog isOpen={isOpen} onClose={onClose} initialFocus={cancelRef}>
      <DialogContent>
        <DialogTitle>Unhide post</DialogTitle>
        <DialogDescription className="mt-6">
          Are you sure you want to unhide this post?
        </DialogDescription>
        <DialogCloseButton onClick={onClose} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="secondary"
          isLoading={unhidePostMutation.isLoading}
          loadingChildren="Unhiding post"
          onClick={() => {
            unhidePostMutation.mutate(postId, {
              onSuccess: () => {
                toast.success('Post unhidden')
                onClose()
              },
            })
          }}
        >
          Unhide post
        </Button>
        <Button variant="secondary" onClick={onClose} ref={cancelRef}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PostPage
