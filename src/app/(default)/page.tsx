'use client'

import { PostFeed } from '~/components/post-feed'

export default function Index({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>
}) {
  const currentPageNumber = searchParams.page ? Number(searchParams.page) : 1

  return <PostFeed currentPageNumber={currentPageNumber} />
}
