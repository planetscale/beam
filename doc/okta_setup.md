# Okta setup

- Create an [Okta account](https://login.okta.com/signin/register/) if you don't have one and go to the **Applications** page
- **Create an integration**
  - Click **Create App Integration**
  - For the **Sign-in method**, select **OIDC - OpenID Connect**
  - For the **Application type**, pick **Web Application**
  - Click **Next**
  - Set **Sign-in redirect URIs** to `http://localhost:3000/api/auth/callback/okta`
  - Set **Sign-out redirect URIs** to `http://localhost:3000`
  - Click **Save**

⚠️ Remember to update `Sign-in redirect URIs` and `Sign-out redirect URIs` when deploying your app to production.

- **Set environment variables in `.env`**
  - Set `AUTH_PROVIDER` to **okta**
  - Set `OKTA_CLIENT_ID` to **Client ID**
  - Set `OKTA_CLIENT_SECRET` to **Client secret**
  - Set `OKTA_ISSUER` to **Okta domain** (including `https://` prefix)
  - Set `NEXTAUTH_SECRET` to a random secret. [This](https://generate-secret.now.sh/32) is a good resource.
