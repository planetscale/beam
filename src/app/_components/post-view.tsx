'use client'

import { api } from '~/trpc/react'
import { type RouterOutputs } from '~/trpc/shared'
import { Banner } from './banner'
import { useSession } from 'next-auth/react'
import { PostAction } from '../(default)/post/[id]/_components/post-action'
import { AuthorWithDate } from './author-with-date'
import { HtmlView } from './html-view'
import { ReactionButton } from './like-button'
import { Button } from './button'
import MessageIcon from '../_svg/message-icon'

type PostViewProps = {
  postId: string
  initialPostData: RouterOutputs['post']['detail']
}

export const PostView = ({ postId, initialPostData }: PostViewProps) => {
  const { data } = api.post.detail.useQuery(
    {
      id: Number(postId),
    },
    { initialData: initialPostData },
  )

  const session = useSession()
  if (!data) return null

  const postBelongsToUser = data.author.id === session.data?.user?.id
  const isUserAdmin = session.data?.user.role === 'ADMIN'

  return (
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
        <ReactionButton
          likedBy={data.likedBy}
          likeCount={data.likedBy.length}
          isLikedByCurrentUser={data.isLikedByCurrentUser}
          id={data.id}
        />
        <Button href={`/post/${postId}#comments`} variant="secondary">
          <MessageIcon className="w-4 h-4 text-secondary" />
          <span className="ml-1.5">{data.comments.length}</span>
        </Button>
      </div>
    </div>
  )
}
