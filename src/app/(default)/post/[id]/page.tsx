import { PostView } from '~/components/post-view'

type PostPageParams = {
  params: {
    id: string
  }
}

export default async function PostPage({ params }: PostPageParams) {
  return (
    <>
      <article className="divide-y divide-primary">
        <PostView postId={params.id} />
      </article>
    </>
  )
}
