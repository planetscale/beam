import { Button } from '@/components/button'
import { HeartFilledIcon, HeartIcon } from '@/components/icons'
import { classNames } from '@/lib/classnames'
import * as Tooltip from '@radix-ui/react-tooltip'
import { useSession } from 'next-auth/react'
import * as React from 'react'
import { useState } from 'react'

export const MAX_LIKED_BY_SHOWN = 50

type LikeButtonProps = {
  likedBy: {
    user: {
      id: string
      name: string | null
    }
  }[]
  responsive?: boolean
  onLike: () => void
  onUnlike: () => void
}

export function LikeButton({
  likedBy,
  responsive,
  onLike,
  onUnlike,
}: LikeButtonProps) {
  const [isLikingAnimation, setIsLikingAnimation] = useState(false)

  function handleClick() {
    if (isLikingAnimation) {
      return
    }

    if (isLikedByCurrentUser) {
      onUnlike()
    } else {
      setIsLikingAnimation(!isLikingAnimation)
      onLike()
      setTimeout(() => {
        setIsLikingAnimation(false)
      }, 1000)
    }
  }

  const { data: session } = useSession()

  const isLikedByCurrentUser = Boolean(
    likedBy.find((item) => item.user.id === session!.user.id)
  )
  const likeCount = likedBy.length

  return (
    <Tooltip.Root delayDuration={300}>
      <Tooltip.Trigger
        asChild
        onClick={(event) => {
          event.preventDefault()
        }}
        onMouseDown={(event) => {
          event.preventDefault()
        }}
      >
        <Button
          variant="secondary"
          responsive={responsive}
          className={classNames(
            'transition-colors overflow-hidden [transform:translateZ(0)] space-x-1.5',
            isLikedByCurrentUser &&
              'border-red-300 !bg-red-100 dark:!bg-red-900 dark:border-red-700',
            isLikingAnimation && '!border-red-600 !bg-red-600 dark:!bg-red-600'
          )}
          onClick={handleClick}
        >
          <span className="relative block w-4 h-4 shrink-0">
            {isLikedByCurrentUser && !isLikingAnimation ? (
              <HeartFilledIcon className="absolute inset-0 text-red scale-1" />
            ) : (
              <>
                <HeartIcon
                  className={classNames(
                    'absolute inset-0 transition-all text-red fill-transparent transform-gpu',
                    isLikingAnimation && '!scale-[12] !fill-red-600'
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
              'relative z-10 tabular-nums',
              isLikingAnimation && 'transition-colors duration-100 text-gray-50'
            )}
          >
            {likeCount}
          </span>
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content
        side="bottom"
        sideOffset={4}
        className={classNames(
          'max-w-[260px] px-3 py-1.5 rounded shadow-lg bg-secondary-inverse text-secondary-inverse sm:max-w-sm',
          likeCount === 0 && 'hidden'
        )}
      >
        <p className="text-sm">
          {likedBy
            .slice(0, MAX_LIKED_BY_SHOWN)
            .map((item) =>
              item.user.id === session!.user.id ? 'You' : item.user.name
            )
            .join(', ')}
          {likeCount > MAX_LIKED_BY_SHOWN &&
            ` and ${likeCount - MAX_LIKED_BY_SHOWN} more`}
        </p>
        <Tooltip.Arrow
          offset={22}
          className="fill-gray-800 dark:fill-gray-50"
        />
      </Tooltip.Content>
    </Tooltip.Root>
  )
}
