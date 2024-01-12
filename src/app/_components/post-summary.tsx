import Link from 'next/link'
import { summarize } from '~/server/summary'
import { type RouterOutputs } from '~/trpc/shared'
import { Banner } from '~/app/_components/banner'
import { classNames } from '~/utils/core'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { AuthorWithDate } from '~/app/_components/author-with-date'
import { HtmlView } from '~/app/_components/html-view'
import ChevronRightIcon from '~/app/_svg/chevron-right-icon'
import MessageIcon from '~/app/_svg/message-icon'

import { type Session } from 'next-auth'
import { LikedBy } from './liked-by'
import HeartFilledIcon from '../_svg/heart-filled-icon'
import HeartIcon from '../_svg/heart-icon'

export type PostSummaryProps = {
  post: RouterOutputs['post']['feed']['posts'][number]
  session: Session | null
  hideAuthor?: boolean
}

export const PostSummary = ({ post, hideAuthor }: PostSummaryProps) => {
  const { summary, hasMore } = summarize(post.contentHtml)

  return (
    <div>
      {post.hidden && (
        <Banner className="mb-6">
          This post has been hidden and is only visible to administrators.
        </Banner>
      )}
      <div
        className={classNames({
          'opacity-50': post.hidden,
        })}
      >
        <Link href={`/post/${post.id}`}>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {post.title}
          </h2>
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

        <div className="flex items-center gap-4 mt-4 clear-both">
          {hasMore && (
            <Link
              href={`/post/${post.id}`}
              className="inline-flex items-center font-medium transition-colors text-blue"
            >
              Continue reading <ChevronRightIcon className="w-4 h-4 ml-1" />
            </Link>
          )}
          <div className="ml-auto flex gap-6">
            <LikedBy
              trigger={
                <div className="inline-flex items-center gap-1.5">
                  {post.isLikedByCurrentUser ? (
                    <HeartFilledIcon className="w-4 h-4 text-red" />
                  ) : (
                    <HeartIcon className="w-4 h-4 text-red" />
                  )}
                  <span className="text-sm font-semibold tabular-nums">
                    {post.likedBy.length}
                  </span>
                </div>
              }
              likedBy={post.likedBy}
            />

            <Link
              href={`/post/${post.id}#comments`}
              className="inline-flex items-center gap-1.5"
            >
              <MessageIcon className="w-4 h-4 text-secondary" />
              <span className="ml-1.5">{post._count.comments}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
