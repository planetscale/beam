import { SpinnerIcon } from '@/components/icons'
import { classNames } from '@/lib/classnames'
import * as React from 'react'

export type ButtonVariant = 'primary' | 'secondary'

type ButtonProps = {
  variant?: ButtonVariant
  isLoading?: boolean
  loadingChildren?: React.ReactNode
} & React.ComponentPropsWithoutRef<'button'>

export function buttonClasses({
  className,
  variant = 'primary',
  isLoading,
  disabled,
}: ButtonProps) {
  return classNames(
    'inline-flex items-center justify-center px-4 text-sm font-semibold transition-colors rounded-full h-button focus-ring',
    variant === 'primary' &&
      'text-secondary-inverse bg-secondary-inverse hover:text-primary-inverse hover:bg-primary-inverse',
    variant === 'secondary' &&
      'border text-primary border-secondary bg-primary hover:bg-secondary',
    (disabled || isLoading) && 'opacity-50 cursor-default',
    className
  )
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      type = 'button',
      isLoading = false,
      loadingChildren,
      disabled,
      children,
      ...rest
    },
    forwardedRef
  ) => {
    return (
      <button
        {...rest}
        ref={forwardedRef}
        type={type}
        disabled={disabled || isLoading}
        className={buttonClasses({ className, disabled, variant, isLoading })}
      >
        {isLoading && (
          <SpinnerIcon className="w-4 h-4 mr-2 -ml-1 animate-spin" />
        )}
        {isLoading && loadingChildren ? loadingChildren : children}
      </button>
    )
  }
)

Button.displayName = 'Button'
