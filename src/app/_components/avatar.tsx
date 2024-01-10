import Image from 'next/image'
import { isCharacterALetter } from '~/utils/text'

type AvatarSize = 'sm' | 'md' | 'lg'

type AvatarProps = {
  size?: AvatarSize
  name: string
  src?: string | null
}

const dimension: Record<AvatarSize, number> = {
  sm: 32,
  md: 48,
  lg: 128,
}

const initialSize: Record<AvatarSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-16 h-16',
}

export const Avatar = ({ size = 'md', name, src }: AvatarProps) => {
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
          <div className="absolute border border-[rgba(69,55,55,0.04)] rounded-full inset-0" />
        </>
      ) : (
        <div className="grid">
          <div className="flex col-start-1 col-end-1 row-start-1 row-end-1 relative">
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
                width={64}
                height={64}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
