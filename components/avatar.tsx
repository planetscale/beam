import { classNames } from '@/lib/classnames'
import { sha1 } from 'crypto-hash'
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

const initialFontSize: Record<AvatarSize, string> = {
  sm: 'text-2xl',
  md: 'text-4xl',
  lg: 'text-8xl',
}

type Gradient = {
  from: string
  to: string
}

const gradients: Gradient[] = [
  { from: '#40D763', to: '#624BBB' },
  { from: '#FED54A', to: '#FF455D' },
  { from: '#1E9DE6', to: '#8467F3' },
]

export function Avatar({ size = 'md', name, src }: AvatarProps) {
  const [gradientIndex, setGradientIndex] = React.useState<number | null>(null)

  React.useEffect(() => {
    async function generateGradientIndex() {
      // Inspired by https://medium.com/@jasonlong/generating-visual-designs-with-code-62e59c4881ca
      const hash = await sha1(name)
      const char = hash.charAt(19)
      const decimal = parseInt(char, 16)
      setGradientIndex(decimal % gradients.length)
    }

    if (!src) {
      generateGradientIndex()
    }
  }, [name, src])

  return (
    <div className="relative inline-flex flex-shrink-0">
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
        <div
          className="inline-flex items-center justify-center rounded-full"
          style={{
            width: dimension[size],
            height: dimension[size],
            backgroundImage:
              gradientIndex !== null
                ? `linear-gradient(135deg, ${gradients[gradientIndex].from} 13.54%, ${gradients[gradientIndex].to} 78.12%)`
                : '',
          }}
        >
          <span
            className={classNames(
              'text-white uppercase font-pixel',
              initialFontSize[size]
            )}
          >
            {name.charAt(0)}
          </span>
        </div>
      )}
    </div>
  )
}
