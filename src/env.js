import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    AUTH_PROVIDER: z.enum(['github', 'okta']),
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes('YOUR_MYSQL_URL_HERE'),
        'You forgot to change the default URL',
      ),
    GITHUB_ID:
      process.env.AUTH_PROVIDER === 'github' ? z.string() : z.undefined(),
    GITHUB_SECRET:
      process.env.AUTH_PROVIDER === 'github' ? z.string() : z.undefined(),
    GITHUB_ALLOWED_ORG:
      process.env.AUTH_PROVIDER === 'github' ? z.string() : z.undefined(),
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    NEXT_APP_URL: z.string().url(),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === 'production'
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().url(),
    ),
    OKTA_CLIENT_ID:
      process.env.AUTH_PROVIDER === 'okta' ? z.string() : z.undefined(),
    OKTA_CLIENT_SECRET:
      process.env.AUTH_PROVIDER === 'okta' ? z.string() : z.undefined(),
    OKTA_ISSUER:
      process.env.AUTH_PROVIDER === 'okta' ? z.string() : z.undefined(),
    CLOUDINARY_CLOUD_NAME: z.string(),
    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),
    ENABLE_SLACK_POSTING: z.coerce.boolean().default(false).optional(),
    SLACK_WEBHOOK_URL: Boolean(process.env.ENABLE_SLACK_POSTING === 'true')
      ? z.string()
      : z.string().optional(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_ENABLE_IMAGE_UPLOAD: z.coerce
      .boolean()
      .default(false)
      .optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    AUTH_PROVIDER: process.env.AUTH_PROVIDER,
    DATABASE_URL: process.env.DATABASE_URL,
    GITHUB_ID: process.env.GITHUB_ID,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
    GITHUB_ALLOWED_ORG: process.env.GITHUB_ALLOWED_ORG,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_APP_URL: process.env.NEXT_APP_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_ENABLE_IMAGE_UPLOAD:
      process.env.NEXT_PUBLIC_ENABLE_IMAGE_UPLOAD,
    OKTA_CLIENT_ID: process.env.OKTA_CLIENT_ID,
    OKTA_CLIENT_SECRET: process.env.OKTA_CLIENT_SECRET,
    OKTA_ISSUER: process.env.OKTA_ISSUER,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    ENABLE_SLACK_POSTING: process.env.ENABLE_SLACK_POSTING,
    SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
})
