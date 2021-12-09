import { Footer } from '@/components/footer'
import { Logo } from '@/components/icons'
import type { NextPage } from 'next'
import Head from 'next/head'

const Auth: NextPage = () => {
  return (
    <>
      <Head>
        <title>Flux</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="h-screen">
        <main className="relative flex items-center justify-center h-full bg-center bg-square-grid">
          <div className="relative bottom-16">
            <Logo className="w-[318px] text-red-light h-[102px] mb-8 bg-primary" />
            <div className="flex justify-center w-full bg-primary">
              <button className="whitespace-nowrap text-white bg-gray-800 h-12 rounded-full font-semibold text-[18px] px-5 ">
                Log in with Okta
              </button>
            </div>
          </div>
          <div className="absolute w-1/2 max-w-xl bottom-7 md:bottom-12">
            <Footer />
          </div>
        </main>
      </div>
    </>
  )
}

export default Auth
