import { classNames } from '@/lib/classnames'
import * as React from 'react'

export type TextareaOwnProps = {
  label?: string
}

type TextareaProps = TextareaOwnProps &
  React.ComponentPropsWithoutRef<'textarea'>

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, id, name, className, ...rest }, forwardedRef) => {
    return (
      <div>
        {label && (
          <label htmlFor={id || name} className="block mb-2 font-semibold">
            {label}
          </label>
        )}
        <textarea
          {...rest}
          ref={forwardedRef}
          id={id || name}
          name={name}
          className={classNames(
            'block w-full rounded shadow-sm bg-secondary border-secondary focus-ring',
            className
          )}
        />
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
