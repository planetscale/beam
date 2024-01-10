'use client'

import { type Session } from 'next-auth'
import { Button } from './button'
import { ProfileMenu } from './profile-menu'
import { useSearchStore } from '~/app/_hooks/use-search-store'
import SearchIcon from '../_svg/search-icon'

export const Actions = ({ session }: { session: Session | null }) => {
  const { toggleOpen } = useSearchStore()
  return (
    <div className="flex items-center gap-2 md:gap-4">
      <Button
        className="px-0 w-8"
        variant="secondary"
        onClick={toggleOpen}
        aria-label="Search"
      >
        <SearchIcon className="h-4 w-4 text-primary" />
      </Button>
      <ProfileMenu session={session} />

      <Button href="/new">
        <span className="sm:hidden">Post</span>
        <span className="hidden sm:block shrink-0">New post</span>
      </Button>
    </div>
  )
}
