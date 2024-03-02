import { EditPostForm } from '~/components/edit-post-form'
import { type Metadata } from 'next'

type ProfilePageParams = {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: 'Edit Post',
}

export default async function EditPostPage({ params }: ProfilePageParams) {
  return (
    <EditPostForm postId={Number(params.id)} backTo={`/post/${params.id}`} />
  )
}
