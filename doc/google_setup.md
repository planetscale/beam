# Google Auth setup

- Create an [Google Cloud Platform project](https://console.developers.google.com/projectcreate) if you don't have one
- Go to [APIs & Services / Credentials](https://console.developers.google.com/apis/credentials) section
- **CREATE CREDENTIALS**
  - Select **OAuth client ID**
  - For **Application Type**, select **Web Application**
  - Give a **Name** to your application, let's say - **_beam_**
  - Add a **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
  - Click **Create**

⚠️ Remember to add your production app redirect uri in `Authorized redirect URIs` when deploying your app to production.

- **Set environment variables in `.env`**
  - Set `AUTH_PROVIDER` to **google**
  - Set `GOOGLE_CLIENT_ID` to **Client ID**
  - Set `GOOGLE_CLIENT_SECRET` to **Client secret**
  - Set `GOOGLE_ALLOWED_DOMAIN` to your organization email domain if you want to restrict Beam users _(optional)_
  - Set `NEXTAUTH_SECRET` to a random secret. [This](https://generate-secret.now.sh/32) is a good resource.
