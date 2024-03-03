import DotPattern from '~/components/svg/dot-pattern'

import { EditProfileAction } from '~/components/edit-profile'
import { PostFeed } from '~/components/post-feed'

type ProfilePageParams = {
  params: {
    userId: string
  }
  searchParams: Record<string, string | undefined>
}

export default async function ProfilePage({
  params,
  searchParams,
}: ProfilePageParams) {
  const currentPageNumber = searchParams.page ? Number(searchParams.page) : 1

  return (
    <>
      <div className="relative flex items-center gap-4 py-8 overflow-hidden">
        <EditProfileAction id={params.userId} profileBelongsToUser={true} />

        <DotPattern />
      </div>

      <div className="mt-28">
        <PostFeed
          authorId={params.userId}
          currentPageNumber={currentPageNumber}
        />
      </div>
    </>
  )
}
