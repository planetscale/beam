# Beam

Changelog for organizations.

## Features

- User profiles
- Responsive
- Dark Mode Support
- Search
- Admin role for hiding posts

## Built on open source

- [Next.js](https://nextjs.org/) as the React framework
- [Tailwind](https://tailwindcss.com/) for CSS styling
- [Prisma](https://prisma.io/) as the ORM for database access
- [PlanetScale](https://planetscale.com/) as the database (MySQL)
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Vercel](http://vercel.com/) for deployment

## Setup

### 0. Install dependencies

```bash
npm install
```

### 1. PlanetScale database

If you don't already have a PlanetScale account, you can [sign up for a free one here](https://auth.planetscale.com/sign-up).

After creating an account, [create a database](https://docs.planetscale.com/tutorials/planetscale-quick-start-guide#create-a-database).

Create a [connection string](https://docs.planetscale.com/concepts/connection-strings#creating-a-password) to connect to your PlanetScale database, make sure you select the **Format** to be **Prisma**.

Once you have the connection string is time to begin setting up the environment variables. Copy the .env.example file in this directory to .env (which will be ignored by Git):

```bash
cp .env.example .env
```

Open `.env` and set the `DATABASE_URL` variable with the connection string from PlanetScale.

Create the database schema by running:

```bash
npx prisma db push
```

### 2. Authentication provider

Beam comes by default with an Okta integration, but you can easily change it because of the next-auth [provider](https://next-auth.js.org/configuration/providers/oauth) ecosystem.

Create an [Okta account](https://login.okta.com/signin/register/) if you don't have one and go to the **Applications** page in your account.

Click `Create App Integration`, for the `Sign-in method` pick **OIDC - OpenID Connect** and for the `Application type` pick **Web Application**, then click `Next`.

Change `Sign-in redirect URIs` to be **http://localhost:3000/api/auth/callback/okta** and `Sign-out redirect URIs` to be **http://localhost:3000**.

For `Controlled access` you can pick **Allow everyone in your organization to access** if you don't have other preference.

Click `Save` and you should see a screen a the Okta app details.

Open `.env` and set the following variables:

- `OKTA_CLIENT_ID` should be **Client ID**
- `OKTA_CLIENT_SECRET` should be **Client secret**
- `OKTA_ISSUER` should be **Okta domain** prefixed with `https://` (for example https://dev-1234.okta.com)
- `NEXTAUTH_URL` should be **http://localhost:3000**
- `NEXTAUTH_SECRET` should be a random secret, you can grab one from [https://generate-secret.now.sh/32](https://generate-secret.now.sh/32)

### 3. Cloudinary

If you don't already have a Cloudinary account, you can [sign up for a free one here](https://cloudinary.com/users/register/free).

Go to your Cloudinary dashboard, below account details you should see **Cloud Name**, **API Key**, **API Secret**.

Open `.env` and set the following variables:

- `CLOUDINARY_CLOUD_NAME` should be **Cloud Name**
- `CLOUDINARY_API_KEY` should be **API Key**
- `CLOUDINARY_API_SECRET` should be **API Secret**

## Run the app locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

Deploy this application quickly to Vercel using the following Deploy button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fplanetscale%2Fbeam&env=DATABASE_URL,OKTA_CLIENT_ID,OKTA_CLIENT_SECRET,OKTA_ISSUER,NEXTAUTH_URL,NEXTAUTH_SECRET,CLOUDINARY_CLOUD_NAME,CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET)

After you deploy the app you need to update the callback URLs for the auth provider that you picked.

For Okta you need to add the domain of the deployed app to `Sign-in redirect URIs` and `Sign-out redirect URIs`.

## Changelog

February 8, 2022 - Added logging via Logflare
                 - Added Slack notifications via custom application
