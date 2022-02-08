import type { Post } from '@prisma/client'

export function postToSlackIfEnabled({
  post,
  authorName,
}: {
  post: Post
  authorName: string
}) {
  if (
    process.env.ENABLE_SLACK_POSTING === 'true' &&
    process.env.SLACK_WEBHOOK_URL
  ) {
    return fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*<${process.env.NEXT_PUBLIC_URL}/post/${post.id}|${post.title}>*`,
            },
          },
          {
            type: 'context',
            elements: [
              {
                type: 'plain_text',
                text: authorName,
                emoji: true,
              },
            ],
          },
        ],
      }),
    })
  }
}
