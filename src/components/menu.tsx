'use client'

import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu'
import Link, { type LinkProps } from 'next/link'
import * as React from 'react'
import { forwardRef, type ComponentPropsWithRef, type Ref } from 'react'

import { classNames } from '~/utils/core'

export const Menu = ({ children }: { children: React.ReactNode }) => {
  return <DropdownPrimitive.Root>{children}</DropdownPrimitive.Root>
}

export const MenuButton = DropdownPrimitive.Trigger
export const MenuItem = ({
  asChild = true,
  ...props
}: DropdownPrimitive.DropdownMenuItemProps) => {
  return <DropdownPrimitive.Item asChild={asChild} {...props} />
}

type MenuItemButtonProps = React.ComponentPropsWithRef<'button'>

export const MenuItemButton = forwardRef(
  (
    { className, ...props }: MenuItemButtonProps,
    ref: Ref<HTMLButtonElement>,
  ) => {
    return (
      <button
        className={classNames(
          'block w-full text-left px-4 py-2 text-sm transition-colors',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)

MenuItemButton.displayName = 'MenuItemButton'

type MenuItemLink = Omit<ComponentPropsWithRef<'a'>, 'href'> & LinkProps

export const MenuItemLink = forwardRef(
  ({ className, ...props }: MenuItemLink, ref: Ref<HTMLAnchorElement>) => {
    return (
      <Link
        className={classNames(
          'block w-full text-left px-4 py-2 text-sm transition-colors',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)

MenuItemLink.displayName = 'MenuItemLink'

export const MenuItems = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <DropdownPrimitive.Content
      className={classNames(
        'absolute right-0 z-10 mt-2 origin-top-right border divide-y rounded shadow-lg bg-primary divide-primary top-full focus:outline-none',
        'radix-state-open:animate-scale-in-content',
        'radix-state-closed:animate-scale-out-content',
        className,
      )}
    >
      {children}
    </DropdownPrimitive.Content>
  )
}

export const MenuItemsContent = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return <div className="py-2">{children}</div>
}
