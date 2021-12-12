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
import { IconButton } from '@/components/icon-button'
import { EditIcon, MessageIcon, TrashIcon } from '@/components/icons'
import { Layout } from '@/components/layout'
import { LikeButton } from '@/components/like-button'
import { Textarea } from '@/components/textarea'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

const PostPage: NextPageWithAuthAndLayout = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const utils = trpc.useContext()
  const postQueryInput = { id: String(router.query.id) }
  const postQuery = trpc.useQuery(['post.detail', postQueryInput])
  const likeMutation = trpc.useMutation(['post.like'], {
    onMutate: async (likedPostId) => {
      await utils.cancelQuery(['post.detail', postQueryInput])

      const previousPost = utils.getQueryData(['post.detail', postQueryInput])

      if (previousPost) {
        utils.setQueryData(['post.detail', postQueryInput], {
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
        utils.setQueryData(
          ['post.detail', postQueryInput],
          context.previousPost
        )
      }
    },
    onSettled: () => {
      utils.invalidateQueries(['post.detail', postQueryInput])
    },
  })
  const unlikeMutation = trpc.useMutation(['post.unlike'], {
    onMutate: async (unlikedPostId) => {
      await utils.cancelQuery(['post.detail', postQueryInput])

      const previousPost = utils.getQueryData(['post.detail', postQueryInput])

      if (previousPost) {
        utils.setQueryData(['post.detail', postQueryInput], {
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
        utils.setQueryData(
          ['post.detail', postQueryInput],
          context.previousPost
        )
      }
    },
    onSettled: () => {
      utils.invalidateQueries(['post.detail', postQueryInput])
    },
  })
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    React.useState(false)

  if (postQuery.data) {
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
              <h1 className="text-3xl font-bold tracking-tight">
                {postQuery.data.title}
              </h1>
              {postBelongsToUser && (
                <div className="flex gap-4">
                  <IconButton
                    variant="secondary"
                    onClick={() => {
                      router.push(`/post/${postQuery.data.id}/edit`)
                    }}
                  >
                    <EditIcon className="w-4 h-4" />
                  </IconButton>
                  <IconButton
                    variant="secondary"
                    onClick={() => {
                      setIsConfirmDeleteDialogOpen(true)
                    }}
                  >
                    <TrashIcon className="w-4 h-4 text-red" />
                  </IconButton>
                </div>
              )}
            </div>
            <div className="mt-6 ">
              <AuthorWithDate
                author={postQuery.data.author}
                date={postQuery.data.createdAt}
              />
            </div>
            <div
              className="mt-6 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: postQuery.data.contentHtml }}
            />
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
                    <AuthorWithDate
                      author={comment.author}
                      date={comment.createdAt}
                    />
                    <div className="pl-16 mt-4">
                      <p className="whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex items-start gap-4">
              <Avatar name={session!.user.name} src={session!.user.image} />
              <CommentForm postId={postQuery.data.id} />
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

type CommentFormData = {
  content: string
}

function CommentForm({ postId }: { postId: string }) {
  const utils = trpc.useContext()
  const addCommentMutation = trpc.useMutation('comment.add', {
    onSuccess: () => {
      return utils.invalidateQueries(['post.detail', { id: postId }])
    },
  })
  const { register, handleSubmit, reset } = useForm<CommentFormData>()

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
      <Textarea
        placeholder="Comment"
        rows={4}
        required
        {...register('content', { required: true })}
      />
      <div className="mt-4">
        <Button type="submit" isLoading={addCommentMutation.isLoading}>
          Add comment
        </Button>
      </div>
    </form>
  )
}

function ConfirmDeleteDialog({
  postId,
  isOpen,
  onClose,
}: {
  postId: string
  isOpen: boolean
  onClose: () => void
}) {
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  const router = useRouter()
  const deletePostMutation = trpc.useMutation('post.delete')

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

export default PostPage
