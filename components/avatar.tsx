import { classNames } from '@/lib/classnames'
import Image from 'next/image'
import * as React from 'react'
import * as pixelLetters from './pixel-letters'

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
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-14 h-14',
}

function UnknownLetter() {
  return null
}

export function Avatar({ size = 'md', name, src }: AvatarProps) {
  const Initial =
    pixelLetters[name.charAt(0).toUpperCase() as keyof typeof pixelLetters] ||
    UnknownLetter

  return (
    <div className="relative inline-flex flex-shrink-0 rounded-full">
      {src ? (
        <>
          <Image
            src={src}
            alt={name}
            layout="fixed"
            width={dimension[size]}
            height={dimension[size]}
            className="object-cover rounded-full"
          />
          <div className="absolute border border-[rgba(0,0,0,0.04)] rounded-full inset-0" />
        </>
      ) : (
        <div className="grid">
          <div className="flex col-start-1 col-end-1 row-start-1 row-end-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/avatar?name=${encodeURIComponent(name)}`}
              alt={name}
              width={dimension[size]}
              height={dimension[size]}
            />
          </div>
          <div className="relative flex items-center justify-center col-start-1 col-end-1 row-start-1 row-end-1">
            <Initial className={classNames('text-white', initialSize[size])} />
          </div>
        </div>
      )}
    </div>
  )
}
