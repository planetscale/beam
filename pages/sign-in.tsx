import { authOptions } from '@/lib/auth'
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next'
import { getServerSession } from 'next-auth/next'
import { getProviders, signIn } from 'next-auth/react'
import Head from 'next/head'

const SignIn = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>Sign In - Flux</title>
      </Head>

      <div>
        {Object.values(providers!).map((provider) => (
          <div key={provider.name}>
            <button onClick={() => signIn(provider.id)}>
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      </div>
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
