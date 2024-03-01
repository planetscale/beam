'use client'

import { api } from '~/trpc/react'
import { Banner } from './banner'
import { useSession } from 'next-auth/react'
import { PostAction } from '~/components/post-action'
import { AuthorWithDate } from './author-with-date'
import { HtmlView } from './html-view'
import { ReactionButton } from './reaction-button'
import { Button } from './button'
import MessageIcon from '~/components/svg/message-icon'
import { Suspense } from 'react'
import { AddCommentForm, Comment } from './comment'
import { Avatar } from './avatar'
import { PostSkeleton } from './post-skeleton'

type PostViewProps = {
  postId: string
}

export const PostView = ({ postId }: PostViewProps) => {
  const { data: session } = useSession()

  const { data, isLoading } = api.post.detail.useQuery({
    id: Number(postId),
  })

  if (isLoading || !data) return <PostSkeleton />

  const postBelongsToUser = data.author.id === session?.user?.id
  const isLikedByCurrentUser = !!data.likedBy.find(
    ({ user }) => user.id === session?.user.id,
  )
  const isUserAdmin = session?.user.role === 'ADMIN'

  return (
    <>
      <div className="pb-12">
        {data.hidden && (
          <Banner className="mb-6">
            This post has been hidden and is only visible to administrators.
          </Banner>
        )}

        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tighter md:text-4xl">
            {data.title}
          </h1>
          {(postBelongsToUser || isUserAdmin) && (
            <>
              <PostAction
                isHidden={data.hidden}
                isUserAdmin={isUserAdmin}
                postBelongsToUser={postBelongsToUser}
                postId={data.id}
              />
            </>
          )}
        </div>
        <div className="mt-6">
          <AuthorWithDate author={data.author} date={data.createdAt} />
        </div>
        <HtmlView html={data.contentHtml} className="mt-8" />
        <div className="flex gap-4 mt-6">
          <Suspense fallback={null}>
            <ReactionButton
              likedBy={data.likedBy}
              likeCount={data.likedBy.length}
              isLikedByCurrentUser={isLikedByCurrentUser}
              id={data.id}
            />
          </Suspense>
          <Button href={`/post/${postId}#comments`} variant="secondary">
            <MessageIcon className="w-4 h-4 text-secondary" />
            <span className="ml-1.5">{data.comments.length}</span>
          </Button>
        </div>
      </div>
      <div id="comments" className="pt-12 space-y-12">
        {data.comments.length > 0 && (
          <ul className="space-y-12">
            {data.comments.map((comment) => (
              <li key={comment.id}>
                <Comment postId={data.id} comment={comment} />
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
          <AddCommentForm postId={data.id} />
        </div>
      </div>
    </>
  )
}
