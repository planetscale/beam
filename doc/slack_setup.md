# Slack setup

- Create a [Slack app](https://api.slack.com/apps/new) (if you don't have one already)
- Pick a name, choose a workspace to associate your app with, and then click Create App
- Select the Incoming Webhooks feature, and click the Activate Incoming Webhooks toggle to switch it on.
- Click Add New Webhook to Workspace
- Pick a channel that the app will post to, and then click to Authorize your app.
- You'll be sent back to your app settings, and you should now see a new entry under the Webhook URLs for Your Workspace section, with a Webhook URL

If you need more detailed instructions on how to create a Slack app you can find them on the [Slack API docs](https://api.slack.com/messaging/webhooks)

- **Set environment variables in `.env`**
  - Set `ENABLE_SLACK_POSTING` to **true**
  - Set `SLACK_WEBHOOK_URL` to the Webhook URL from your Slack app setting
