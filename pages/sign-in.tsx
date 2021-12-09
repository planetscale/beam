import { withSession } from '@/lib/auth'
import type { InferGetServerSidePropsType } from 'next'
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

export const getServerSideProps = withSession(async ({ req }) => {
  const providers = await getProviders()

  if (req.session?.user) {
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
})

export default SignIn
