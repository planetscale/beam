import { api } from '~/trpc/server'
import { PostView } from '~/components/post-view'

type PostPageParams = {
  params: {
    id: string
  }
}

// export const generateMetadata = async ({ params }: PostPageParams) => {
//   const post = await api.post.detail.query({
//     id: Number(params.id),
//   })

//   if (!post) return

//   return {
//     title: `${post.title} - Beam`,
//   }
// }

export default async function PostPage({ params }: PostPageParams) {
  return (
    <article className="divide-y divide-primary">
      <PostView postId={params.id} />
    </article>
  )
}
