import { Button } from '@/components/button'
import { Footer } from '@/components/footer'
import { Logo } from '@/components/icons'
import { authOptions } from '@/lib/auth'
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next'
import { getServerSession } from 'next-auth/next'
import { getProviders, signIn } from 'next-auth/react'
import Head from 'next/head'
import Div100vh from 'react-div-100vh'

const SignIn = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>Sign In - Beam</title>
      </Head>

      <Div100vh>
        <main className="relative flex items-center justify-center h-full bg-center bg-circle-grid dark:bg-circle-grid-dark">
          <div className="relative bottom-16">
            <Logo className="w-[326px] text-red-light h-[94px] mb-8 bg-primary" />
            <div className="w-full space-y-4 text-center bg-primary">
              {Object.values(providers!).map((provider) => (
                <div key={provider.name}>
                  <Button
                    className="!h-12 !px-5 !text-lg"
                    onClick={() => signIn(provider.id)}
                  >
                    Sign in with {provider.name}
                  </Button>
                </div>
              ))}
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

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context, authOptions)
  const providers = await getProviders()

  if (session?.user) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
      props: { providers },
    }
  }

  return {
    props: { providers },
  }
}

export default SignIn
