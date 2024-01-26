'use client'

import { classNames } from '~/utils/core'
import { Button } from './button'
import HeartFilledIcon from '../_svg/heart-filled-icon'
import HeartIcon from '../_svg/heart-icon'

import { api } from '~/trpc/react'
import { useState } from 'react'
import { LikedBy } from './liked-by'
import { type RouterOutputs } from '~/trpc/shared'
import { useSearchParams } from 'next/navigation'

export const MAX_LIKED_BY_SHOWN = 50

type ReactionButtonProps = {
  likeCount: number
  isLikedByCurrentUser: boolean
  likedBy: RouterOutputs['post']['detail']['likedBy']
  id: number
}

const POSTS_PER_PAGE = 20

export const ReactionButton = ({
  id,
  likeCount,
  likedBy,
  isLikedByCurrentUser,
}: ReactionButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const utils = api.useUtils()
  const params = useSearchParams()

  const currentPageNumber = params.get('page') ? Number(params.get('page')) : 1

  const queryParams = {
    take: 20,
    skip:
      currentPageNumber === 1
        ? undefined
        : POSTS_PER_PAGE * (currentPageNumber - 1),
  }

  const previousPosts = utils.post.feed.getData(queryParams)

  const handleAnimationEnd = () => {
    const timeout = setTimeout(() => {
      setIsAnimating(false)
    }, 1000)

    return () => clearTimeout(timeout)
  }

  const like = api.post.like.useMutation({
    onMutate: async (data) => {
      const newPosts = previousPosts!.posts.map((post) => {
        if (post.id === data.id) {
          return {
            ...post,
            isLikedByCurrentUser: true,
            likedBy: [...post.likedBy, 'You'],
          }
        }
        return post
      })

      utils.post.feed.setData(queryParams, {
        posts: newPosts,
        postCount: newPosts.length,
      })

      setIsAnimating(true)
      handleAnimationEnd()
    },
  })

  const unlike = api.post.unlike.useMutation({
    onMutate: async (data) => {
      const newPosts = previousPosts!.posts.map((post) => {
        if (post.id === data.id) {
          return {
            ...post,
            isLikedByCurrentUser: false,
            likedBy: post.likedBy.filter((user) => user !== 'You'),
          }
        }
        return post
      })

      utils.post.feed.setData(queryParams, {
        posts: newPosts,
        postCount: newPosts.length,
      })
    },
  })

  const handleReaction = () => {
    if (isLikedByCurrentUser) {
      unlike.mutate({ id })
    } else {
      like.mutate({ id })
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
          disabled={like.isLoading || unlike.isLoading || isAnimating}
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
