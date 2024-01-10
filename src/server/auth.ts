import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { type Role } from '@prisma/client'
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import OktaProvider from 'next-auth/providers/okta'

import { env } from '~/env.js'
import { db } from '~/server/db'

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      name: string
      email: string
      image?: string | null
      role: Role
    } & DefaultSession['user']
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  adapter: PrismaAdapter(db),
  providers:
    env.AUTH_PROVIDER === 'github'
      ? [
          GithubProvider({
            clientId: env.GITHUB_ID!,
            clientSecret: env.GITHUB_SECRET!,
            authorization:
              'https://github.com/login/oauth/authorize?scope=read:user+user:email+read:org',
            userinfo: {
              url: 'https://api.github.com/user',
              async request({ client, tokens }) {
                const profile = await client.userinfo(tokens.access_token!)

                const res = await fetch('https://api.github.com/user/orgs', {
                  headers: {
                    Authorization: `token ${tokens.access_token}`,
                  },
                })

                const userOrgs = (await res.json()) as { login: string }[]

                // Set flag to deny signIn if allowed org is not found in the user organizations
                if (
                  !userOrgs.find((org) => org.login === env.GITHUB_ALLOWED_ORG)
                ) {
                  profile.notAllowed = true
                }

                return profile
              },
            },
          }),
        ]
      : env.AUTH_PROVIDER === 'okta'
        ? [
            OktaProvider({
              clientId: env.OKTA_CLIENT_ID!,
              clientSecret: env.OKTA_CLIENT_SECRET!,
              issuer: env.OKTA_ISSUER,
            }),
          ]
        : [],
  pages: {
    signIn: '/sign-in',
    signOut: '/sign-in',
  },
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions)
