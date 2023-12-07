'use client'
import { type getProviders, signIn } from 'next-auth/react'
import { Button } from '~/app/_components/button'

export const SignInButtons = ({
  providers,
}: {
  providers: Awaited<ReturnType<typeof getProviders>>
}) => {
  return (
    <>
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
    </>
  )
}
