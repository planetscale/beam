import { prisma } from '@/lib/prisma'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { Role } from '@prisma/client'
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { NextAuthOptions, Session } from 'next-auth'
import { getServerSession } from 'next-auth/next'
import OktaProvider from 'next-auth/providers/okta'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    OktaProvider({
      idToken: true,
      clientId: process.env.OKTA_CLIENT_ID!,
      clientSecret: process.env.OKTA_CLIENT_SECRET!,
      issuer: process.env.OKTA_ISSUER!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          role: user.role,
        },
      }
    },
  },
  pages: {
    signIn: '/sign-in',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export function withSession<
  P extends { [key: string]: unknown } = { [key: string]: unknown }
>(
  handler: (
    context: GetServerSidePropsContext
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
  return async function nextGetServerSidePropsHandlerWrappedWithSession(
    context: GetServerSidePropsContext
  ) {
    const session = await getServerSession(context, authOptions)

    Object.defineProperty(
      context.req,
      'session',
      getPropertyDescriptorForReqSession(session)
    )

    return handler(context)
  }
}

function getPropertyDescriptorForReqSession(
  session: Session | null
): PropertyDescriptor {
  return {
    enumerable: true,
    get() {
      return session
    },
    set(value) {
      if (session) {
        const keys = Object.keys(value)
        const currentKeys = Object.keys(session)

        currentKeys.forEach((key) => {
          if (!keys.includes(key)) {
            delete session[key]
          }
        })

        keys.forEach((key) => {
          session[key] = value[key]
        })
      }
    },
  }
}

declare module 'http' {
  interface IncomingMessage {
    session?: Session
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      name: string
      email: string
      image?: string | null
      role: Role
    }
  }

  interface User {
    role: Role
  }
}
