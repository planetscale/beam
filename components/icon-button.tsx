import { ButtonVariant } from '@/components/button'
import { classNames } from '@/lib/classnames'
import * as React from 'react'

export type IconButtonOwnProps = {
  variant?: ButtonVariant
}

type IconButtonProps = IconButtonOwnProps &
  React.ComponentPropsWithoutRef<'button'>

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { className, variant = 'primary', type = 'button', ...rest },
    forwardedRef
  ) => {
    return (
      <button
        {...rest}
        ref={forwardedRef}
        type={type}
        className={classNames(
          'inline-flex items-center justify-center flex-shrink-0 transition-colors rounded-full h-button w-icon-button focus-ring',
          variant === 'primary' &&
            'text-secondary-inverse bg-secondary-inverse hover:text-primary-inverse hover:bg-primary-inverse',
          variant === 'secondary' &&
            'border text-primary border-secondary bg-primary hover:bg-secondary',
          className
        )}
      />
    )
  }
)

IconButton.displayName = 'IconButton'
