import { Avatar } from '~/app/_components/avatar'

import { Comment, AddCommentForm } from '~/app/_components/comment'

import { getServerAuthSession } from '~/server/auth'
import { api } from '~/trpc/server'
import { PostView } from '~/app/_components/post-view'

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

  return (
    <article className="divide-y divide-primary">
      <PostView postId={params.id} initialPostData={post} />

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
