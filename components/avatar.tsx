import { isCharacterALetter } from '@/lib/text'
import Image from 'next/image'
import * as React from 'react'

type AvatarSize = 'sm' | 'md' | 'lg'

type AvatarProps = {
  size?: AvatarSize
  name: string
  src?: string | null
}

const dimension: Record<AvatarSize, number> = {
  sm: 34,
  md: 48,
  lg: 128,
}

const initialSize: Record<AvatarSize, string> = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-16 h-16',
}

export function Avatar({ size = 'md', name, src }: AvatarProps) {
  const initial = name.charAt(0).toLocaleLowerCase()

  return (
    <div className="relative inline-flex flex-shrink-0 rounded-full">
      {src ? (
        <>
          <Image
            src={src}
            alt={name}
            width={dimension[size]}
            height={dimension[size]}
            className="object-cover rounded-full"
          />
          <div className="absolute border border-[rgba(0,0,0,0.04)] rounded-full inset-0" />
        </>
      ) : (
        <div className="grid">
          <div className="flex col-start-1 col-end-1 row-start-1 row-end-1">
            <Image
              src={`/api/avatar?name=${encodeURIComponent(name)}`}
              alt={name}
              width={dimension[size]}
              height={dimension[size]}
            />
          </div>
          {isCharacterALetter(initial) && (
            <div className="relative flex items-center justify-center col-start-1 col-end-1 row-start-1 row-end-1">
              <Image
                src={`/images/letters/${initial}.svg`}
                className={initialSize[size]}
                alt=""
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
