import { Button } from '@/components/button'
import { Footer } from '@/components/footer'
import { Logo } from '@/components/icons'
import type { NextPage } from 'next'
import Head from 'next/head'
import Div100vh from 'react-div-100vh'

const Auth: NextPage = () => {
  return (
    <>
      <Head>
        <title>Flux Login</title>
      </Head>

      <Div100vh>
        <main className="relative flex items-center justify-center h-full bg-center bg-square-grid dark:bg-square-grid-dark">
          <div className="relative bottom-16">
            <Logo className="w-[318px] text-red-light h-[102px] mb-8 bg-primary" />
            <div className="flex justify-center w-full bg-primary">
              <Button className="!h-12 !px-5 !text-lg">Log in with Okta</Button>
            </div>
            <div className="-mt-4 md:mt-0 w-screen left-1/2 transform -translate-x-1/2 absolute sm:w-[434px] lg:w-[646px] xl:w-[862px] auth-footer">
              <Footer />
            </div>
          </div>
        </main>
      </Div100vh>
    </>
  )
}

export default Auth
