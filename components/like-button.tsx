import { Button } from '@/components/button'
import { HeartFilledIcon, HeartIcon } from '@/components/icons'
import { classNames } from '@/lib/classnames'
import { useState } from 'react'

type LikeButtonProps = {
  isLiked: boolean
  likeCount: number
  responsive?: boolean
  onLike: () => void
  onUnlike: () => void
}

export function LikeButton({
  isLiked,
  likeCount,
  responsive,
  onLike,
  onUnlike,
}: LikeButtonProps) {
  const [isLikingAnimation, setIsLikingAnimation] = useState(false)

  function handleLike() {
    setIsLikingAnimation(true)
    isLiked ? onUnlike() : onLike()
  }

  return (
    <Button
      variant="secondary"
      responsive={responsive}
      className={classNames(
        'transition-all overflow-hidden [transform:translateZ(0)] group',
        isLiked &&
          '!border-red-300 !bg-red-100 hover:!bg-red-200 dark:!bg-red-900 dark:!border-red-700 dark:hover:!bg-red-800',
        isLikingAnimation &&
          'bg-red-600 delay border-red-600 pointer-events-none'
      )}
      onClick={handleLike}
    >
      <span className="relative block w-4 h-4">
        {isLiked ? (
          <HeartFilledIcon className="absolute inset-0 text-red" />
        ) : (
          <>
            <HeartIcon
              className={classNames(
                'absolute inset-0 transition-all text-red fill-transparent group-hover:fill-red-600 transform-gpu group-hover:scale-110',
                isLikingAnimation &&
                  'scale-[10] group-hover:scale-[10] !fill-red-600'
              )}
            />
            <span
              className={classNames(
                'absolute w-4 h-4 top-0 left-[-.5px] rounded-full ring-inset ring-6 ring-gray-50 transition-all duration-300 transform-gpu z-10',
                isLikingAnimation ? 'scale-150 !ring-0' : 'scale-0'
              )}
            ></span>
            <HeartFilledIcon
              className={classNames(
                'absolute inset-0 transition-transform delay-200 duration-300 text-gray-50 transform-gpu z-10 ease-spring',
                isLikingAnimation ? 'scale-1' : 'scale-0'
              )}
            />
          </>
        )}
      </span>

      <span
        className={classNames(
          'relative ml-1.5 z-10',
          isLikingAnimation && 'transition-colors duration-100 text-gray-50'
        )}
      >
        {likeCount}
      </span>
    </Button>
  )
}
