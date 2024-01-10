import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import Link from 'next/link'
import { Avatar } from './avatar'
import { type User } from '@prisma/client'

type AuthorWithDateProps = {
  author: Pick<User, 'id' | 'name' | 'image'>
  date: Date
}

export const AuthorWithDate = ({ author, date }: AuthorWithDateProps) => {
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <Link href={`/profile/${author.id}`} className="relative inline-flex">
        <span className="hidden sm:flex">
          <Avatar name={author.name!} src={author.image} />
        </span>
        <span className="flex sm:hidden">
          <Avatar name={author.name!} src={author.image} size="sm" />
        </span>
      </Link>
      <div className="flex-1 text-sm sm:text-base">
        <div>
          <Link
            href={`/profile/${author.id}`}
            className="font-medium tracking-tight transition-colors hover:text-blue"
          >
            {author.name}
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
