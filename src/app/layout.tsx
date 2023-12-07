import '~/styles/globals.css'

import localFont from 'next/font/local'
import { cookies } from 'next/headers'

import { TRPCReactProvider } from '~/trpc/react'
import { classNames } from '~/utils/core'
import { ThemeProvider } from '~/app/_providers/theme'
import { Toaster } from '~/app/_providers/toaster'

import { SessionProvider } from '~/app/_providers/session'
import { getServerAuthSession } from '~/server/auth'
import { SearchDialog } from './_components/search-dialog'
import { AlertDialog } from './_components/alert-dialog'

const inter = localFont({
  variable: '--font-sans',
  display: 'swap',
  style: 'oblique 0deg 10deg',
  src: [
    {
      path: '../../public/fonts/inter-roman.var.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/inter-italic.var.woff2',
      weight: '400',
      style: 'italic',
    },
  ],
})
export const metadata = {
  title: 'Beam',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerAuthSession()

  return (
    <html lang="en">
      <body className={classNames('font-sans min-h-screen', inter.variable)}>
        <SessionProvider session={session}>
          <ThemeProvider>
            <TRPCReactProvider cookies={cookies().toString()}>
              <main>{children}</main>

              <Toaster />
              <SearchDialog />
              <AlertDialog />
            </TRPCReactProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}