<img src="public/images/logo.svg" />

Beam is a simple tool that allows members to write posts to share across your organization. Think of it like a lightweight internal blog. Features include a simple **Markdown-based** editor with preview, comments and likes, **search**, a clean responsive layout with **dark mode support**, and an admin role for hiding posts.

[TODO: SCREENSHOT HERE]

## Setup

### 0. Install dependencies

```bash
npm install
```

### 1. PlanetScale database

* [Create a PlanetScale database](https://docs.planetscale.com/tutorials/planetscale-quick-start-guide#create-a-database).
* Create a [connection string](https://docs.planetscale.com/concepts/connection-strings#creating-a-password) to connect to your database. Choose **Prisma** for the format.
* Set up the environment variables:
```bash
cp .env.example .env
```
* Open `.env` and set the `DATABASE_URL` variable with the connection string from PlanetScale.
* Create the database schema:
```bash
npx prisma db push
```

### 2. Authentication provider

By default Beam uses GitHub for authentication, but you can use Okta if you prefer. View the [Okta setup instructions](docs/okta_setup.md).

[TODO: GitHub auth instructions]

### 3. Cloudinary

Beam uses Cloudinary for storing uploaded images. You can [sign up for a free account](https://cloudinary.com/users/register/free).

* On your Cloudinary dashboard, look for these values under your account settings: **Cloud Name**, **API Key**, **API Secret**.
* Update `.env` with the following variables:
  - `CLOUDINARY_CLOUD_NAME`: **Cloud Name**
  - `CLOUDINARY_API_KEY`: **API Key**
  - `CLOUDINARY_API_SECRET`: **API Secret**

## Running the app locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploying to Vercel

One-click deploy:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fplanetscale%2Fbeam&env=DATABASE_URL,OKTA_CLIENT_ID,OKTA_CLIENT_SECRET,OKTA_ISSUER,NEXTAUTH_URL,NEXTAUTH_SECRET,CLOUDINARY_CLOUD_NAME,CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET)

After deploying, update the callback URLs for your preferred auth provider.

## Built on open source

- [Next.js](https://nextjs.org/) as the React framework
- [Tailwind](https://tailwindcss.com/) for CSS styling
- [Prisma](https://prisma.io/) as the ORM for database access
- [PlanetScale](https://planetscale.com/) as the database (MySQL)
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Vercel](http://vercel.com/) for deployment
