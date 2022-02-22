import { serverEnv } from '@/env/server'
import { prisma } from '@/lib/prisma'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { Role } from '@prisma/client'
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
              async request({ client, tokens }) {
                // Get base profile
                // @ts-ignore
                const profile = await client.userinfo(tokens)

                // If user has email hidden, get their primary email from the GitHub API
                if (!profile.email) {
                  const emails = await (
                    await fetch('https://api.github.com/user/emails', {
                      headers: {
                        Authorization: `token ${tokens.access_token}`,
                      },
                    })
                  ).json()

                  if (emails?.length > 0) {
                    // Get primary email
                    profile.email = emails.find(
                      (email: any) => email.primary
                    )?.email
                    // And if for some reason it doesn't exist, just use the first
                    if (!profile.email) profile.email = emails[0].email
                  }
                }

                const userOrgs = await (
                  await fetch('https://api.github.com/user/orgs', {
                    headers: { Authorization: `token ${tokens.access_token}` },
                  })
                ).json()

                // Set flag to deny signIn if allowed org is not found in the user organizations
                if (
                  !userOrgs.find(
                    (org: any) => org.login === serverEnv.GITHUB_ALLOWED_ORG
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
            clientId: serverEnv.OKTA_CLIENT_ID!,
            clientSecret: serverEnv.OKTA_CLIENT_SECRET!,
            issuer: serverEnv.OKTA_ISSUER!,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (profile.notAllowed) {
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

  interface User {
    role: Role
  }
}
