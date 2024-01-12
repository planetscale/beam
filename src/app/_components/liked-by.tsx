'use client'

import { classNames } from '~/utils/core'
import * as Tooltip from '@radix-ui/react-tooltip'
import { type RouterOutputs } from '~/trpc/shared'
import { MAX_LIKED_BY_SHOWN } from './like-button'
import { type ReactNode } from 'react'

type LikedByProps = {
  trigger: ReactNode
  likedBy: RouterOutputs['post']['detail']['likedBy']
}

export const LikedBy = ({ trigger, likedBy }: LikedByProps) => {
  const likeCount = likedBy.length

  return (
    <Tooltip.TooltipProvider>
      <Tooltip.Root delayDuration={300}>
        <Tooltip.Trigger
          onClick={(event) => {
            event.preventDefault()
          }}
          onMouseDown={(event) => {
            event.preventDefault()
          }}
        >
          {trigger}
        </Tooltip.Trigger>
        <Tooltip.Content
          side="bottom"
          sideOffset={4}
          className={classNames(
            'max-w-[260px] px-3 py-1.5 rounded shadow-lg bg-secondary-inverse text-secondary-inverse sm:max-w-sm z-50',
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
