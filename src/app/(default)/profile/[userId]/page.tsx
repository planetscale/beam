import DotPattern from '~/components/svg/dot-pattern'

import { EditProfileAction } from '~/components/edit-profile'
import { PostFeed } from '~/components/post-feed'
import { type Metadata } from 'next'

type ProfilePageParams = {
  params: {
    userId: string
  }
  searchParams: Record<string, string | undefined>
}

export const metadata: Metadata = {
  title: 'Profile',
}

export default async function ProfilePage({
  params,
  searchParams,
}: ProfilePageParams) {
  const currentPageNumber = searchParams.page ? Number(searchParams.page) : 1

  return (
    <>
      <div className="relative flex items-center gap-4 py-8 overflow-hidden">
        <EditProfileAction
          currentPageNumber={currentPageNumber}
          id={params.userId}
        />

        <DotPattern />
      </div>

      <div className="mt-28">
        <PostFeed
          fallbackMessage="This user hasn't published any posts yet."
          authorId={params.userId}
          currentPageNumber={currentPageNumber}
        />
      </div>
    </>
  )
}
