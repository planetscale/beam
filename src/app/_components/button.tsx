import { type ComponentPropsWithRef, type ReactNode } from 'react'

import { cva, type VariantProps } from 'class-variance-authority'
import Link, { type LinkProps } from 'next/link'

import { classNames } from '~/utils/core'
import Spinner from '../_svg/spinner'

const button = cva(
  'inline-flex items-center justify-center font-semibold transition-colors rounded-full focus-ring px-4 text-sm h-8',
  {
    variants: {
      variant: {
        primary:
          'text-secondary-inverse bg-secondary-inverse hover:text-primary-inverse hover:bg-primary-inverse',
        secondary:
          'border text-primary border-secondary bg-primary hover:bg-secondary',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
)

type BaseProps =
  | ({
      href?: never
      disabled?: boolean
      isLoading?: boolean
      loadingChildren?: ReactNode
    } & ComponentPropsWithRef<'button'>)
  | ({
      href: LinkProps['href']
      disabled?: boolean
      isLoading?: boolean
      loadingChildren?: ReactNode
    } & Omit<ComponentPropsWithRef<'a'>, 'href'> &
      LinkProps)

export type ButtonVariant = VariantProps<typeof button>
type ButtonProps = BaseProps & ButtonVariant

export const Button = ({
  children,
  variant,
  className,
  disabled,
  isLoading,
  loadingChildren,
  ...props
}: ButtonProps) => {
  if (props.href === undefined) {
    return (
      <button
        className={classNames(button({ variant, className }), {
          'opacity-50 cursor-default': disabled ?? isLoading,
        })}
        disabled={disabled}
        {...props}
      >
        {isLoading && <Spinner className="w-4 h-4 mr-2 -ml-1 animate-spin" />}
        {isLoading && loadingChildren ? loadingChildren : children}
      </button>
    )
  }

  return (
    <Link
      className={classNames(button({ variant, className }), {
        'opacity-50 cursor-default': disabled ?? isLoading,
      })}
      {...props}
    >
      {isLoading && <Spinner className="w-4 h-4 mr-2 -ml-1 animate-spin" />}
      {isLoading && loadingChildren ? loadingChildren : children}
    </Link>
  )
}
