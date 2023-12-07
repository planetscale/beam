'use client'

import { type Session } from 'next-auth'
import { signIn } from 'next-auth/react'
import { type ReactNode, useEffect } from 'react'

export const AuthProvider = ({
  session,
  children,
}: {
  session: Session | null
  children: ReactNode
}) => {
  const isUser = !!session?.user
  useEffect(() => {
    if (!isUser) void signIn()
  }, [isUser])

  if (isUser) {
    return <>{children}</>
  }

  return null
}
