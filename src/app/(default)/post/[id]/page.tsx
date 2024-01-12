import { AuthorWithDate } from '~/app/_components/author-with-date'
import { Avatar } from '~/app/_components/avatar'
import { Banner } from '~/app/_components/banner'
import { Button } from '~/app/_components/button'
import { Comment, AddCommentForm } from '~/app/_components/comment'

import { HtmlView } from '~/app/_components/html-view'
import { ReactionButton } from '~/app/_components/like-button'

import MessageIcon from '~/app/_svg/message-icon'

import { getServerAuthSession } from '~/server/auth'
import { api } from '~/trpc/server'
import { PostAction } from './_components/post-action'

type PostPageParams = {
  params: {
    id: string
  }
}

export const generateMetadata = async ({ params }: PostPageParams) => {
  const post = await api.post.detail.query({
    id: Number(params.id),
  })

  if (!post) return

  return {
    title: `${post.title} - Beam`,
  }
}

export default async function PostPage({ params }: PostPageParams) {
  const post = await api.post.detail.query({
    id: Number(params.id),
  })

  const session = await getServerAuthSession()
  const isUserAdmin = session!.user.role === 'ADMIN'
  const postBelongsToUser = post.author.id === session!.user.id

  return (
    <article className="divide-y divide-primary">
      <div className="pb-12">
        {post.hidden && (
          <Banner className="mb-6">
            This post has been hidden and is only visible to administrators.
          </Banner>
        )}

        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tighter md:text-4xl">
            {post.title}
          </h1>
          {(postBelongsToUser || isUserAdmin) && (
            <>
              <PostAction
                isHidden={post.hidden}
                isUserAdmin={isUserAdmin}
                postBelongsToUser={postBelongsToUser}
                postId={post.id}
              />
            </>
          )}
        </div>
        <div className="mt-6">
          <AuthorWithDate author={post.author} date={post.createdAt} />
        </div>
        <HtmlView html={post.contentHtml} className="mt-8" />
        <div className="flex gap-4 mt-6">
          <ReactionButton
            likedBy={post.likedBy}
            likeCount={post.likedBy.length}
            isLikedByCurrentUser={post.isLikedByCurrentUser}
            id={post.id}
          />
          <Button href={`/post/${post.id}#comments`} variant="secondary">
            <MessageIcon className="w-4 h-4 text-secondary" />
            <span className="ml-1.5">{post.comments.length}</span>
          </Button>
        </div>
      </div>

      <div id="comments" className="pt-12 space-y-12">
        {post.comments.length > 0 && (
          <ul className="space-y-12">
            {post.comments.map((comment) => (
              <li key={comment.id}>
                <Comment session={session} postId={post.id} comment={comment} />
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
          <AddCommentForm postId={post.id} />
        </div>
      </div>
    </article>
  )
}
