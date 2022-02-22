# Okta setup

Create an [Okta account](https://login.okta.com/signin/register/) if you don't have one and go to the **Applications** page in your account.

Click `Create App Integration`, for the `Sign-in method` pick **OIDC - OpenID Connect** and for the `Application type` pick **Web Application**, then click `Next`.

Change `Sign-in redirect URIs` to be **http://localhost:3000/api/auth/callback/okta** and `Sign-out redirect URIs` to be **http://localhost:3000**.

Remember to update `Sign-in redirect URIs` and `Sign-out redirect URIs` when deploying your app to production.

For `Controlled access` you can pick **Allow everyone in your organization to access** if you don't have other preference.

Click `Save` and you should see a screen a the Okta app details.

Open `.env` and set the following variables:

- `AUTH_PROVIDER` should be **okta**
- `OKTA_CLIENT_ID` should be **Client ID**
- `OKTA_CLIENT_SECRET` should be **Client secret**
- `OKTA_ISSUER` should be **Okta domain** prefixed with `https://` (for example https://dev-1234.okta.com)
- `NEXTAUTH_SECRET` should be a random secret, you can grab one from [https://generate-secret.now.sh/32](https://generate-secret.now.sh/32)
