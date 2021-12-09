import { AuthorWithDate } from '@/components/author-with-date'
import { Button } from '@/components/button'
import { ButtonLink } from '@/components/button-link'
import { ChevronRightIcon, HeartIcon, MessageIcon } from '@/components/icons'
import { classNames } from '@/lib/classnames'
import type { Post } from '@/lib/types'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import Link from 'next/link'
import * as React from 'react'

export type PostSummaryProps = {
  post: Post
  hideAuthor?: boolean
}

export function PostSummary({ post, hideAuthor = false }: PostSummaryProps) {
  const contentDocument = React.useMemo(
    () => new DOMParser().parseFromString(post.content, 'text/html'),
    [post.content]
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

  return (
    <div>
      <Link href={`/post/${post.id}`}>
        <a>
          <h2 className="text-2xl font-bold tracking-tight">{post.title}</h2>
        </a>
      </Link>

      <div
        className={classNames(
          'flex items-center justify-between gap-4',
          hideAuthor ? 'mt-2' : 'mt-6'
        )}
      >
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

        <div className="flex gap-4">
          <Button variant="secondary">
            <HeartIcon className="w-4 h-4 text-red" />
            <span className="ml-1.5">{post.likeCount}</span>
          </Button>
          <ButtonLink href={`/post/${post.id}#comments`} variant="secondary">
            <MessageIcon className="w-4 h-4 text-secondary" />
            <span className="ml-1.5">{post.commentCount}</span>
          </ButtonLink>
        </div>
      </div>

      <div
        className={classNames('prose max-w-none', hideAuthor ? 'mt-4' : 'mt-6')}
        dangerouslySetInnerHTML={{ __html: summary }}
      />

      {hasMoreContent && (
        <div className="mt-4">
          <Link href={`/post/${post.id}`}>
            <a className="inline-flex items-center font-medium transition-colors text-blue hover:text-blue-dark">
              Continue reading <ChevronRightIcon className="w-4 h-4 ml-1" />
            </a>
          </Link>
        </div>
      )}
    </div>
  )
}
