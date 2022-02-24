# Slack setup

- [Create a Slack app](https://api.slack.com/apps/new) if you don't have one already
- Pick a name, choose a workspace to associate your app with, and then click **Create App**
- Select the **Incoming Webhooks** feature and click the **Activate Incoming Webhooks** toggle to switch it on
- Click **Add New Webhook to Workspace**
- Pick the channel the app will post to and then click to **Authorize** your app
- You should see a new entry under the Webhook URLs for Your Workspace section

See the [Slack API docs](https://api.slack.com/messaging/webhooks) for more detailed instructions on creating Slack apps.

- **Set environment variables in `.env`**
  - Set `ENABLE_SLACK_POSTING` to **true**
  - Set `SLACK_WEBHOOK_URL` to the Webhook URL from your Slack app setting
