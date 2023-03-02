import { serverEnv } from '@/env/server'
import { prisma } from '@/lib/prisma'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { type Role } from '@prisma/client'
import type { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import OktaProvider from 'next-auth/providers/okta'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    ...(serverEnv.AUTH_PROVIDER === 'github'
      ? [
          GithubProvider({
            clientId: serverEnv.GITHUB_ID,
            clientSecret: serverEnv.GITHUB_SECRET,
            authorization:
              'https://github.com/login/oauth/authorize?scope=read:user+user:email+read:org',
            userinfo: {
              url: 'https://api.github.com/user',
              request: async ({ client, tokens }) => {
                // Get base profile
                const profile = await client.userinfo(
                  tokens.access_token as string
                )

                const userOrgs = await (
                  await fetch('https://api.github.com/user/orgs', {
                    headers: { Authorization: `token ${tokens.access_token}` },
                  })
                ).json()

                // Set flag to deny signIn if allowed org is not found in the user organizations
                if (
                  !userOrgs.find(
                    (org: { login: string }) =>
                      org.login === serverEnv.GITHUB_ALLOWED_ORG
                  )
                ) {
                  profile.notAllowed = true
                }

                return profile
              },
            },
          }),
        ]
      : []),
    ...(serverEnv.AUTH_PROVIDER === 'okta'
      ? [
          OktaProvider({
            clientId: serverEnv.OKTA_CLIENT_ID,
            clientSecret: serverEnv.OKTA_CLIENT_SECRET,
            issuer: serverEnv.OKTA_ISSUER,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ profile }) {
      if (profile?.notAllowed) {
        return false
      }

      return true
    },
    async session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: user.role,
        },
      }
    },
  },
  pages: {
    signIn: '/sign-in',
  },
  secret: serverEnv.NEXTAUTH_SECRET,
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image?: string | null
      role: Role
    }
  }

  interface Profile {
    notAllowed?: boolean
  }

  interface User {
    role: Role
  }
}
