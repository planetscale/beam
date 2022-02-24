import { serverEnv } from '@/env/server'
import type { Post } from '@prisma/client'
import { markdownToBlocks } from '@instantish/mack'

export async function postToSlackIfEnabled({
  post,
  authorName,
}: {
  post: Post
  authorName: string
}) {
  if (serverEnv.ENABLE_SLACK_POSTING && serverEnv.SLACK_WEBHOOK_URL) {
    const bodyBlocks = await markdownToBlocks(post.content, {
      lists: {
        checkboxPrefix: (checked) => (checked ? '☑︎' : '☐'),
      },
    })
    return fetch(serverEnv.SLACK_WEBHOOK_URL, {
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
              text: `*<${serverEnv.NEXT_APP_URL}/post/${post.id}|${post.title}>*`,
            },
          },
          ...bodyBlocks,
          { type: 'divider' },
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
