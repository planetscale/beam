'use client'

import { usePathname } from 'next/navigation'
import { Button } from './button'
import ChevronLeftIcon from '../_svg/chevron-left-icon'
import ChevronRightIcon from '../_svg/chevron-right-icon'

type PaginationProps = {
  itemCount: number
  itemsPerPage: number
  currentPageNumber: number
}

export const Pagination = ({
  itemCount,
  itemsPerPage,
  currentPageNumber,
}: PaginationProps) => {
  const pathname = usePathname()

  const totalPages = Math.ceil(itemCount / itemsPerPage)

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
