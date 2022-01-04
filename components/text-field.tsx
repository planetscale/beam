import { classNames } from '@/lib/classnames'
import * as React from 'react'

export type TextFieldOwnProps = {
  label?: string
}

type TextFieldProps = TextFieldOwnProps &
  React.ComponentPropsWithoutRef<'input'>

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, id, name, type = 'text', className, ...rest }, forwardedRef) => {
    return (
      <div>
        {label && (
          <label htmlFor={id || name} className="block mb-2 font-semibold">
            {label}
          </label>
        )}
        <input
          {...rest}
          ref={forwardedRef}
          id={id || name}
          name={name}
          type={type}
          className={classNames(
            'block w-full py-1 rounded shadow-sm bg-secondary border-secondary focus-ring',
            className
          )}
        />
      </div>
    )
  }
)

TextField.displayName = 'TextField'
