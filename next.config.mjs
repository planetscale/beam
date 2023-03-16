//!process.env.SKIP_ENV_VALIDATION && (await import('./env/server.mjs'))

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com', 'avatars.githubusercontent.com'],
  },
}

export default config
