'use client'

import { classNames } from '~/utils/core'
import { Button } from './button'
import HeartFilledIcon from '../_svg/heart-filled-icon'
import HeartIcon from '../_svg/heart-icon'

import { api } from '~/trpc/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LikedBy } from './liked-by'
import { type RouterOutputs } from '~/trpc/shared'

export const MAX_LIKED_BY_SHOWN = 50

type LikeButtonProps = {
  likeCount: number
  isLikedByCurrentUser: boolean
  likedBy: RouterOutputs['post']['detail']['likedBy']
  id: number
}

export const ReactionButton = ({
  id,
  likeCount,
  likedBy,
  isLikedByCurrentUser,
}: LikeButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const router = useRouter()
  const like = api.post.like.useMutation({
    onSuccess: () => {
      router.refresh()
      const timeout = setTimeout(() => {
        setIsAnimating(false)
      }, 1000)

      return () => clearTimeout(timeout)
    },
  })
  const unlike = api.post.unlike.useMutation({
    onSuccess: () => {
      router.refresh()
    },
  })

  const handleReaction = async () => {
    if (isLikedByCurrentUser) {
      await unlike.mutateAsync({ id })
    } else {
      setIsAnimating(true)
      await like.mutateAsync({ id })
    }
  }

  return (
    <LikedBy
      likedBy={likedBy}
      trigger={
        <Button
          variant="secondary"
          className={classNames(
            'transition-colors overflow-hidden [transform:translateZ(0)] space-x-1.5',
            {
              'border-red-300 !bg-red-100 dark:!bg-red-900 dark:border-red-700':
                isLikedByCurrentUser,
              '!border-red-600 !bg-red-600 dark:!bg-red-600': isAnimating,
            },
          )}
          onClick={handleReaction}
          disabled={like.isLoading}
        >
          <span className="relative block w-4 h-4 shrink-0">
            {isLikedByCurrentUser && !isAnimating ? (
              <HeartFilledIcon className="absolute inset-0 text-red scale-1" />
            ) : (
              <>
                <HeartIcon
                  className={classNames(
                    'absolute inset-0 transition-all text-red fill-transparent transform-gpu',
                    { 'scale-[12] fill-red-600': isAnimating },
                  )}
                />
                <span
                  className={classNames(
                    'absolute w-4 h-4 top-0 left-[-.5px] rounded-full ring-inset ring-6 ring-gray-50 transition-all duration-300 transform-gpu z-10',
                    isAnimating ? 'scale-150 !ring-0' : 'scale-0',
                  )}
                ></span>
                <HeartFilledIcon
                  className={classNames(
                    'absolute inset-0 transition-transform delay-200 duration-300 text-gray-50 transform-gpu z-10 ease-spring',
                    isAnimating ? 'scale-1' : 'scale-0',
                  )}
                />
              </>
            )}
          </span>

          <span
            className={classNames('relative z-10 tabular-nums', {
              'transition-colors duration-100 text-gray-50': like.isLoading,
            })}
          >
            {likeCount}
          </span>
        </Button>
      }
    />
  )
}
