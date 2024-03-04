'use client'

import { type ReactNode } from 'react'
import { ThemeProvider as ThemeProviderPrimitive } from 'next-themes'

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProviderPrimitive attribute="class" disableTransitionOnChange>
      {children}
    </ThemeProviderPrimitive>
  )
}
