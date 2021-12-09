import { classNames } from '@/lib/classnames'
import * as React from 'react'

export type ButtonOwnProps = {
  variant?: 'primary' | 'secondary'
}

type ButtonProps = ButtonOwnProps & React.ComponentPropsWithoutRef<'button'>

export function buttonClasses({
  className,
  variant = 'primary',
  disabled,
}: ButtonProps) {
  return classNames(
    'inline-flex items-center justify-center px-4 text-sm font-semibold transition-colors rounded-full h-button',
    variant === 'primary' &&
      'text-secondary-inverse bg-secondary-inverse hover:text-primary-inverse hover:bg-primary-inverse',
    variant === 'secondary' &&
      'border text-primary border-secondary bg-primary hover:bg-secondary',
    disabled && 'opacity-50 cursor-default',
    className
  )
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', type = 'button', disabled, ...rest },
    forwardedRef
  ) => {
    return (
      <button
        {...rest}
        ref={forwardedRef}
        type={type}
        disabled={disabled}
        className={buttonClasses({ className, disabled, variant })}
      />
    )
  }
)

Button.displayName = 'Button'
