'use client'

import { usePathname } from 'next/navigation'
import { Button } from './button'
import ChevronLeftIcon from '~/components/svg/chevron-left-icon'
import ChevronRightIcon from '~/components/svg/chevron-right-icon'
import { POSTS_PER_PAGE } from '~/utils/core'

type PaginationProps = {
  itemCount: number
  currentPageNumber: number
}

export const Pagination = ({
  itemCount,
  currentPageNumber,
}: PaginationProps) => {
  const pathname = usePathname()

  const totalPages = Math.ceil(itemCount / POSTS_PER_PAGE)

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex justify-center gap-4 mt-12">
      <Button
        href={{
          pathname,
          query: {
            page: currentPageNumber - 1,
          },
        }}
        variant="secondary"
        className={
          currentPageNumber === 1 ? 'pointer-events-none opacity-50' : ''
        }
      >
        <span className="mr-1">
          <ChevronLeftIcon />
        </span>
        Newer posts
      </Button>
      <Button
        href={{
          pathname,
          query: { page: currentPageNumber + 1 },
        }}
        variant="secondary"
        className={
          currentPageNumber === totalPages
            ? 'pointer-events-none opacity-50'
            : ''
        }
      >
        Older posts{' '}
        <span className="ml-1">
          <ChevronRightIcon />
        </span>
      </Button>
    </div>
  )
}
