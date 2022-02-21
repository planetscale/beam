import { AuthorWithDate } from '@/components/author-with-date'
import { Banner } from '@/components/banner'
import { HtmlView } from '@/components/html-view'
import {
  ChevronRightIcon,
  HeartFilledIcon,
  HeartIcon,
  MessageIcon,
} from '@/components/icons'
import { MAX_LIKED_BY_SHOWN } from '@/components/like-button'
import { classNames } from '@/lib/classnames'
import { InferQueryOutput } from '@/lib/trpc'
import * as Tooltip from '@radix-ui/react-tooltip'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import * as React from 'react'

export type PostSummaryProps = {
  post: InferQueryOutput<'post.feed'>['posts'][number]
  hideAuthor?: boolean
  onLike: () => void
  onUnlike: () => void
}

export function PostSummary({
  post,
  hideAuthor = false,
  onLike,
  onUnlike,
}: PostSummaryProps) {
  const contentDocument = React.useMemo(
    () => new DOMParser().parseFromString(post.contentHtml, 'text/html'),
    [post.contentHtml]
  )
  //   TODO: decide on the order of the allowed tags
  //   and research on how to truncate html to a max amount of characters
  const summary = React.useMemo(() => {
    const allowedTags = ['p', 'ul', 'ol', 'h3', 'pre', 'img']

    for (const tag of allowedTags) {
      const element = contentDocument.body.querySelector(tag)
      if (element) {
        return element.outerHTML
      }
    }

    return "<p>Summary couldn't be generated</p>"
  }, [contentDocument])
  const hasMoreContent = React.useMemo(
    () => contentDocument.body.children.length > 1,
    [contentDocument]
  )

  const { data: session } = useSession()

  const isLikedByCurrentUser = Boolean(
    post.likedBy.find((item) => item.user.id === session!.user.id)
  )
  const likeCount = post.likedBy.length

  return (
    <div>
      {post.hidden && (
        <Banner className="mb-6">
          This post has been hidden and is only visible to administrators.
        </Banner>
      )}
      <div className={classNames(post.hidden ? 'opacity-50' : '')}>
        <Link href={`/post/${post.id}`}>
          <a>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              {post.title}
            </h2>
          </a>
        </Link>

        <div className={classNames(hideAuthor ? 'mt-2' : 'mt-6')}>
          {hideAuthor ? (
            <p className="tracking-tight text-secondary">
              <time dateTime={post.createdAt.toISOString()}>
                {formatDistanceToNow(post.createdAt)}
              </time>{' '}
              ago
            </p>
          ) : (
            <AuthorWithDate author={post.author} date={post.createdAt} />
          )}
        </div>

        <HtmlView html={summary} className={hideAuthor ? 'mt-4' : 'mt-6'} />

        <div className="flex items-center gap-4 mt-4">
          {hasMoreContent && (
            <Link href={`/post/${post.id}`}>
              <a className="inline-flex items-center font-medium transition-colors text-blue">
                Continue reading <ChevronRightIcon className="w-4 h-4 ml-1" />
              </a>
            </Link>
          )}
          <div className="ml-auto flex gap-6">
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
                  likeCount === 0 && 'hidden'
                )}
              >
                <p className="text-sm">
                  {post.likedBy
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

            <div className="inline-flex items-center gap-1.5">
              <MessageIcon className="w-4 h-4 text-secondary" />
              <span className="text-sm font-semibold tabular-nums">
                {post._count.comments}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
