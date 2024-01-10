import { type ReactNode } from 'react'
import { Header } from '../_components/header'
import { Footer } from '../_components/footer'
import { AuthProvider } from '../_providers/auth'
import { getServerAuthSession } from '~/server/auth'

export default async function DefaultLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await getServerAuthSession()

  return (
    <AuthProvider session={session}>
      <div className="max-w-3xl px-6 mx-auto">
        <Header />
        {children}
        <div className="py-20">
          <Footer />
        </div>
      </div>
    </AuthProvider>
  )
}
