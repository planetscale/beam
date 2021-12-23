import { classNames } from '@/lib/classnames'
import { sha1 } from 'crypto-hash'
import Image from 'next/image'
import * as React from 'react'
import * as pixelLetters from './pixel-letters'

const COLOR_NAMES = [
  'gray',
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
]
const COLOR_SHADES = [
  '050',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
]

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
  const [generated, setGenerated] = React.useState<{
    hash: string
    gradientColors: [string, string, string]
    initialColor: 'light' | 'black'
    rotationDeg: number
  } | null>(null)

  React.useEffect(() => {
    async function generateGradientColors() {
      // Inspired by https://medium.com/@jasonlong/generating-visual-designs-with-code-62e59c4881ca
      const hash = await sha1(name)

      // generate colors based on the hash characters from 0 to 5
      const colors = [...Array(3)].reduce<{
        initialColorThreshold: number
        gradientColors: string[]
      }>(
        (acc, _, idx) => {
          const colorHash = hash.slice(idx * 2, idx * 2 + 2)

          const nameDecimal = parseInt(colorHash[0], 16)
          const colorName = COLOR_NAMES[nameDecimal % COLOR_NAMES.length]

          const shadeDecimal = parseInt(colorHash[1], 16)
          const colorShade = COLOR_SHADES[shadeDecimal % COLOR_SHADES.length]

          return {
            initialColorThreshold:
              acc.initialColorThreshold + parseInt(colorShade),
            gradientColors: [
              ...acc.gradientColors,
              `var(--color-${colorName}-${colorShade})`,
            ],
          }
        },
        { initialColorThreshold: 0, gradientColors: [] }
      )

      // generate rotation based on the hash characters from 6 to 8
      const rotationHash = hash.slice(6, 9)
      const rotationDecimal = parseInt(rotationHash, 16)
      const rotationDeg = rotationDecimal % 360

      setGenerated({
        hash,
        gradientColors: colors.gradientColors as [string, string, string],
        initialColor: colors.initialColorThreshold >= 1000 ? 'light' : 'black',
        rotationDeg,
      })
    }

    if (!src) {
      generateGradientColors()
    }
  }, [name, src])

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
        <div
          className="relative inline-flex items-center justify-center rounded-full"
          style={{
            width: dimension[size],
            height: dimension[size],
          }}
        >
          {generated && (
            <>
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute w-full h-full"
                style={{
                  transform: `rotate(${generated.rotationDeg}deg)`,
                }}
              >
                <circle
                  cx={12}
                  cy={12}
                  r={12}
                  fill={`url(#gradient-${generated.hash})`}
                />
                <defs>
                  <radialGradient
                    id={`gradient-${generated.hash}`}
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="matrix(-16.99992 22.00009 -17.04497 -13.171 20.5 2)"
                  >
                    <stop stopColor={generated.gradientColors[0]} />
                    <stop
                      offset={0.751919}
                      stopColor={generated.gradientColors[1]}
                    />
                    <stop
                      offset={0.976459}
                      stopColor={generated.gradientColors[2]}
                    />
                  </radialGradient>
                </defs>
              </svg>
              <Initial
                className={classNames(
                  'relative',
                  initialSize[size],
                  generated.initialColor === 'black'
                    ? 'text-gray-900'
                    : 'text-white'
                )}
              />
            </>
          )}
        </div>
      )}
    </div>
  )
}
