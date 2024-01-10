'use client'

import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import * as React from 'react'
import XIcon from '../_svg/x-icon'
import { useDialogStore } from '../_hooks/use-dialog-store'
import { type ReactNode } from 'react'
import { classNames } from '~/utils/core'

export const AlertDialog = () => {
  const { isOpen, handleDialogClose, dialogContent } = useDialogStore()

  return (
    <AlertDialogPrimitive.Root open={isOpen} onOpenChange={handleDialogClose}>
      <AlertDialogPrimitive.Content
        className={classNames(
          'fixed inset-0 z-10 overflow-y-auto',
          'radix-state-open:animate-scale-in-content',
          'radix-state-closed:animate-scale-out-content',
        )}
      >
        <div className="min-h-screen px-4 text-center">
          <AlertDialogPrimitive.Overlay className="fixed inset-0 transition-opacity bg-gray-700 opacity-90 dark:bg-gray-900" />

          <div className="inline-block w-full max-w-md mt-[15vh] mb-8 overflow-hidden text-left align-middle transition-all transform bg-primary rounded-lg shadow-xl dark:border">
            {dialogContent}
          </div>
        </div>
      </AlertDialogPrimitive.Content>
    </AlertDialogPrimitive.Root>
  )
}

export const AlertDialogContent = ({ children }: { children: ReactNode }) => {
  return <div className="px-6 pt-6 pb-12">{children}</div>
}

export const AlertDialogActions = ({ children }: { children: ReactNode }) => {
  return <div className="flex gap-4 px-6 py-4 border-t">{children}</div>
}

export const AlertDialogAction = ({ children }: { children: ReactNode }) => {
  return (
    <AlertDialogPrimitive.Action asChild>
      {children}
    </AlertDialogPrimitive.Action>
  )
}

export const AlertDialogCancel = ({ children }: { children: ReactNode }) => {
  return (
    <AlertDialogPrimitive.Cancel asChild>
      {children}
    </AlertDialogPrimitive.Cancel>
  )
}

export const AlertDialogTitle = ({ children }: { children: ReactNode }) => {
  return (
    <AlertDialogPrimitive.Title asChild className="text-lg font-semibold">
      <h3>{children}</h3>
    </AlertDialogPrimitive.Title>
  )
}

export const AlertDialogDescription = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <AlertDialogPrimitive.Description className={className}>
      {children}
    </AlertDialogPrimitive.Description>
  )
}

export const AlertDialogCloseButton = ({
  onClick,
}: {
  onClick: () => void
}) => {
  return (
    <div className="absolute top-0 right-0 pt-6 pr-6">
      <button
        type="button"
        className="inline-flex items-center justify-center transition-colors rounded-sm text-secondary hover:text-primary hover:bg-secondary"
        onClick={onClick}
      >
        <span className="sr-only">Close</span>
        <XIcon className="w-6 h-6" aria-hidden="true" />
      </button>
    </div>
  )
}
