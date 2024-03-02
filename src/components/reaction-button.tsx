'use client'

import { classNames } from '~/utils/core'
import { Button } from './button'
import HeartFilledIcon from '~/components/svg/heart-filled-icon'
import HeartIcon from '~/components/svg/heart-icon'

import { useState } from 'react'
import { LikedBy } from './liked-by'
import { type RouterOutputs } from '~/trpc/shared'
import { useSession } from 'next-auth/react'
import { api } from '~/trpc/react'
import { useSearchParams } from 'next/navigation'
import { getFeedPagination } from './post-summary'

export const MAX_LIKED_BY_SHOWN = 50

type ReactionButtonProps = {
  likedBy: RouterOutputs['post']['detail']['likedBy']
  id: number
}

export const ReactionButton = ({ likedBy, id }: ReactionButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const { data: session } = useSession()
  const utils = api.useUtils()
  const params = useSearchParams()

  const currentPageNumber = params.get('page') ? Number(params.get('page')) : 1

  const previousQuery = utils.post.feed.getData(
    getFeedPagination(currentPageNumber),
  )

  const likeMutation = api.post.like.useMutation({
    onMutate: async ({ id }) => {
      if (previousQuery) {
        utils.post.feed.setData(getFeedPagination(currentPageNumber), {
          ...previousQuery,
          posts: previousQuery.posts.map((post) =>
            post.id === id
              ? {
                  ...post,
                  likedBy: [
                    ...post.likedBy,
                    {
                      user: {
                        id: session!.user.id,
                        name: session!.user.name,
                      },
                    },
                  ],
                }
              : post,
          ),
        })
      }
    },
  })

  const unlikeMutation = api.post.unlike.useMutation({
    onMutate: async ({ id }) => {
      if (previousQuery) {
        utils.post.feed.setData(getFeedPagination(currentPageNumber), {
          ...previousQuery,
          posts: previousQuery.posts.map((post) =>
            post.id === id
              ? {
                  ...post,
                  likedBy: post.likedBy.filter(
                    (item) => item.user.id !== session!.user.id,
                  ),
                }
              : post,
          ),
        })
      }
    },
  })

  const handleReaction = () => {
    if (isAnimating) {
      return
    }
    if (isLikedByCurrentUser) {
      unlikeMutation.mutate({ id })
    } else {
      setIsAnimating(!isAnimating)
      likeMutation.mutate({ id })

      const timeout = setTimeout(() => {
        setIsAnimating(false)
      }, 1000)

      return () => clearTimeout(timeout)
    }
  }

  const isLikedByCurrentUser = Boolean(
    likedBy.find((item) => item.user.id === session!.user.id),
  )
  const likeCount = likedBy.length

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
                />
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
              'transition-colors duration-100 text-gray-50': isAnimating,
            })}
          >
            {likeCount}
          </span>
        </Button>
      }
    />
  )
}
