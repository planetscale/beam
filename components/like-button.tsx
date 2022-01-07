import { Button } from '@/components/button'
import { HeartFilledIcon, HeartIcon } from '@/components/icons'
import * as Tooltip from '@radix-ui/react-tooltip'
import { useSession } from 'next-auth/react'
import * as React from 'react'

const MAX_LIKED_BY_SHOWN = 50

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
  const { data: session } = useSession()

  const isLikedByCurrentUser = Boolean(
    likedBy.find((item) => item.user.id === session!.user.id)
  )
  const likeCount = likedBy.length

  return (
    <ConditionalWrapper
      condition={likeCount > 0}
      wrapper={(children) => (
        <Tooltip.Root delayDuration={300}>
          <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
          <Tooltip.Content
            side="bottom"
            sideOffset={4}
            className="max-w-[260px] px-3 py-1.5 rounded shadow-lg bg-secondary-inverse text-secondary-inverse sm:max-w-sm"
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
      )}
    >
      <Button
        variant="secondary"
        responsive={responsive}
        className={
          isLikedByCurrentUser
            ? '!border-red-300 !bg-red-100 hover:!bg-red-200 dark:!bg-red-900 dark:!border-red-700 dark:hover:!bg-red-800'
            : ''
        }
        onClick={() => {
          isLikedByCurrentUser ? onUnlike() : onLike()
        }}
      >
        {isLikedByCurrentUser ? (
          <HeartFilledIcon className="w-4 h-4 text-red" />
        ) : (
          <HeartIcon className="w-4 h-4 text-red" />
        )}

        <span className="ml-1.5">{likeCount}</span>
      </Button>
    </ConditionalWrapper>
  )
}

function ConditionalWrapper({
  condition,
  wrapper,
  children,
}: {
  condition: boolean
  wrapper: (children: React.ReactNode) => JSX.Element
  children: React.ReactNode
}) {
  if (condition) {
    return wrapper(children)
  }

  return <>{children}</>
}
