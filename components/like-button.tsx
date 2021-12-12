import { Button } from '@/components/button'
import { HeartFilledIcon, HeartIcon } from '@/components/icons'

type LikeButtonProps = {
  isLiked: boolean
  likeCount: number
  onLike: () => void
  onUnlike: () => void
}

export function LikeButton({
  isLiked,
  likeCount,
  onLike,
  onUnlike,
}: LikeButtonProps) {
  return (
    <Button
      variant="secondary"
      className={
        isLiked
          ? '!border-red-300 !bg-red-100 hover:!bg-red-200 dark:!bg-red-900 dark:!border-red-700 dark:hover:!bg-red-800'
          : ''
      }
      onClick={() => {
        isLiked ? onUnlike() : onLike()
      }}
    >
      {isLiked ? (
        <HeartFilledIcon className="w-4 h-4 text-red" />
      ) : (
        <HeartIcon className="w-4 h-4 text-red" />
      )}

      <span className="ml-1.5">{likeCount}</span>
    </Button>
  )
}
