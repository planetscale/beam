'use client'

import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu'
import * as React from 'react'

import { classNames } from '~/utils/core'

export const Menu = ({ children }: { children: React.ReactNode }) => {
  return <DropdownPrimitive.Root>{children}</DropdownPrimitive.Root>
}

export const MenuButton = DropdownPrimitive.Trigger
export const MenuItem = DropdownPrimitive.Item

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
