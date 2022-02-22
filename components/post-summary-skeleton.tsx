import { classNames } from '@/lib/classnames'

type PostSummarySkeletonProps = {
  hideAuthor?: boolean
}

export function PostSummarySkeleton({ hideAuthor }: PostSummarySkeletonProps) {
  return (
    <div className="animate-pulse">
      <div className="w-3/4 h-8 bg-gray-200 rounded dark:bg-gray-700" />
      <div
        className={classNames(
          'flex items-center justify-between gap-4',
          hideAuthor ? 'mt-2' : 'mt-6'
        )}
      >
        <div className="flex items-center gap-4">
          {!hideAuthor && (
            <div className="w-12 h-12 bg-gray-200 rounded-full dark:bg-gray-700" />
          )}
          <div className="flex-1">
            <div className="w-24 h-4 bg-gray-200 rounded dark:bg-gray-700" />
            {!hideAuthor && (
              <div className="w-32 h-3 mt-2 bg-gray-200 rounded dark:bg-gray-700" />
            )}
          </div>
        </div>
      </div>
      <div className="space-y-3 mt-7">
        <div className="grid grid-cols-3 gap-4">
          <div className="h-5 col-span-2 bg-gray-200 rounded dark:bg-gray-700" />
          <div className="h-5 col-span-1 bg-gray-200 rounded dark:bg-gray-700" />
        </div>
        <div className="w-1/2 h-5 bg-gray-200 rounded dark:bg-gray-700" />
      </div>
    </div>
  )
}
