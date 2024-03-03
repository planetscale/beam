import { type ReactNode } from 'react'
import { Header } from '~/components/header'
import { Footer } from '~/components/footer'
import { getServerAuthSession } from '~/server/auth'
import { redirect } from 'next/navigation'

export default async function DefaultLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await getServerAuthSession()

  // Redirect to sign-in if there is no session
  if (!session) {
    redirect('/sign-in')
  }

  return (
    <>
      <div className="max-w-3xl px-6 mx-auto">
        <Header />
        {children}
        <div className="py-20">
          <Footer />
        </div>
      </div>
    </>
  )
}
