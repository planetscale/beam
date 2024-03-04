import { type ReactNode } from 'react'
import { Header } from '~/components/header'
import { Footer } from '~/components/footer'

export default async function DefaultLayout({
  children,
}: {
  children: ReactNode
}) {
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
