'use client'

import { classNames } from '~/utils/core'
import * as Tooltip from '@radix-ui/react-tooltip'
import { type RouterOutputs } from '~/trpc/shared'
import { MAX_LIKED_BY_SHOWN } from './like-button'
import HeartFilledIcon from '../_svg/heart-filled-icon'
import HeartIcon from '../_svg/heart-icon'

type LikedByProps = {
  likedBy: RouterOutputs['post']['detail']['likedBy']
  isLikedByCurrentUser: RouterOutputs['post']['detail']['isLikedByCurrentUser']
}

export const LikedBy = ({ likedBy, isLikedByCurrentUser }: LikedByProps) => {
  const likeCount = likedBy.length

  return (
    <Tooltip.TooltipProvider>
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
          <div className="inline-flex items-center gap-1.5">
            {isLikedByCurrentUser ? (
              <HeartFilledIcon className="w-4 h-4 text-red" />
            ) : (
              <HeartIcon className="w-4 h-4 text-red" />
            )}
            <span className="text-sm font-semibold tabular-nums">
              {likeCount}
            </span>
          </div>
        </Tooltip.Trigger>
        <Tooltip.Content
          side="bottom"
          sideOffset={4}
          className={classNames(
            'max-w-[260px] px-3 py-1.5 rounded shadow-lg bg-secondary-inverse text-secondary-inverse sm:max-w-sm',
            likeCount === 0 && 'hidden',
          )}
        >
          <p className="text-sm">
            {likedBy
              .slice(0, MAX_LIKED_BY_SHOWN)
              .map((name) => name)
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
    </Tooltip.TooltipProvider>
  )
}
