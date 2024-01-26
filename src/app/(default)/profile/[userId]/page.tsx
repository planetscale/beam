import DotPattern from '~/app/_svg/dot-pattern'

import { getServerAuthSession } from '~/server/auth'
import { api } from '~/trpc/server'
import { EditProfileAction } from './_components/edit-profile'
import { PostFeed } from '~/app/_components/post-feed'
import { cache } from 'react'

type ProfilePageParams = {
  params: {
    userId: string
  }
  searchParams: Record<string, string | undefined>
}

export const generateMetadata = async ({ params }: ProfilePageParams) => {
  const profileData = cache(async () => {
    return await api.user.profile.query({
      id: params.userId,
    })
  })

  const profile = await profileData()

  if (!profile) return

  return {
    title: `${profile.name} - Beam`,
  }
}

const POSTS_PER_PAGE = 20

export default async function ProfilePage({
  params,
  searchParams,
}: ProfilePageParams) {
  const currentPageNumber = searchParams.page ? Number(searchParams.page) : 1

  const profileData = cache(async () => {
    return await api.user.profile.query({
      id: params.userId,
    })
  })

  const profile = await profileData()

  const cachedData = cache(async () => {
    return await api.post.feed.query({
      take: POSTS_PER_PAGE,
      skip:
        currentPageNumber === 1
          ? undefined
          : POSTS_PER_PAGE * (currentPageNumber - 1),
      authorId: params.userId,
    })
  })

  const initialPostData = await cachedData()

  const session = await getServerAuthSession()

  if (!profile) return

  const profileBelongsToUser = profile.id === session!.user.id

  return (
    <>
      <div className="relative flex items-center gap-4 py-8 overflow-hidden">
        {profileBelongsToUser && (
          <EditProfileAction
            profileBelongsToUser={profileBelongsToUser}
            user={profile}
          />
        )}

        <DotPattern />
      </div>

      <div className="mt-28">
        {initialPostData.postCount === 0 ? (
          <div className="text-center text-secondary border rounded py-20 px-10">
            This user hasn&apos;t published any posts yet.
          </div>
        ) : (
          <PostFeed
            authorId={params.userId}
            initialPosts={initialPostData}
            postsPerPage={POSTS_PER_PAGE}
          />
        )}
      </div>
    </>
  )
}
