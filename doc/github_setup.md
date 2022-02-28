# GitHub authentication setup

- **Create an OAuth app on GitHub** (_Note that a separate app must be created for production use_)
  - Go to [Developer Settings](https://github.com/settings/developers)
  - Click on **New OAuth App**
  - For **Callback URL**, enter `http://localhost:3000/api/auth/callback/github`
  - Once the app is created, click **Generate a new client secret**
- **Set environment variables in `.env`**
  - Set `AUTH_PROVIDER` to `github`
  - Set `GITHUB_ID` to the Client ID value
  - Set `GITHUB_SECRET` to the secret value generated above
  - Set `GITHUB_ALLOWED_ORG` to the GitHub organization name your Beam members must belong to
  - Set `NEXTAUTH_SECRET` to a random secret. [This](https://generate-secret.now.sh/32) is a good resource.

⚠️ If you're using a GitHub OAuth app for authentication, you'll need to Request (if you're an organization member) or Grant (if you're an organization owner) access to the organization specified in `GITHUB_ALLOWED_ORG` on the GitHub authorization screen. Failure to provide access to the organization will result in an "Access Denied" error screen with the message "You do not have permission to sign in."

<img src="/public/images/github-org-access.png" width="378" />
