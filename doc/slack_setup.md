# Slack setup

- [Create a Slack app](https://api.slack.com/apps/new) if you don't have one already
- Pick a name, choose a workspace to associate your app with, and then click **Create App**
- Go to "OAuth and Permissions"
- Add the `chat:write` permission to the app
- Create an OAuth token for the app, this will be used as `SLACK_TOKEN`
- By default it will post to #general. In Slack, you must invite your new bot to the channel so that it can post.

- **Set environment variables in `.env`**
  - Set `ENABLE_SLACK_POSTING` to **true**
  - Set `SLACK_TOKEN` to the OAuth token for the app.
  - Optionally, set `SLACK_CHANNEL`
