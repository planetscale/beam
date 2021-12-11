import { Avatar } from '@/components/avatar'
import type { Author } from '@/lib/types'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import Link from 'next/link'

type AuthorWithDateProps = {
  author: Author
  date: Date
}

export function AuthorWithDate({ author, date }: AuthorWithDateProps) {
  return (
    <div className="flex items-center gap-4">
      <Link href={`/profile/${author.id}`}>
        <a className="relative inline-flex group">
          <Avatar name={author.name!} src={author.image} />
          <div className="absolute inset-0 transition-opacity bg-gray-800 rounded-full opacity-0 group-hover:opacity-10" />
        </a>
      </Link>
      <div className="flex-1">
        <div>
          <Link href={`/profile/${author.id}`}>
            <a className="font-medium tracking-tight transition-colors hover:text-blue-dark">
              {author.name}
            </a>
          </Link>
        </div>

        <p className="tracking-tight text-secondary">
          <time dateTime={date.toISOString()}>{formatDistanceToNow(date)}</time>{' '}
          ago
        </p>
      </div>
    </div>
  )
}
