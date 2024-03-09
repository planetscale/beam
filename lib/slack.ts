import { serverEnv } from '@/env/server'
import type { Post } from '@prisma/client'
import { marked } from 'marked'
import { WebClient } from '@slack/web-api'

export async function postToSlackIfEnabled({
  post,
  authorName,
}: {
  post: Post
  authorName: string
}) {
  if (serverEnv.ENABLE_SLACK_POSTING && serverEnv.SLACK_TOKEN) {
    const tokens = marked.lexer(post.content)
    const summary = summarize(tokens)

    const web = new WebClient(serverEnv.SLACK_TOKEN)
    return await web.chat.postMessage({
      channel: serverEnv.SLACK_CHANNEL,
      text: `*<${serverEnv.NEXT_APP_URL}/post/${post.id}|${post.title}>*`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*<${serverEnv.NEXT_APP_URL}/post/${post.id}|${post.title}>*`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: summary,
          },
        },
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
    })
  }
}

const MAX_CHARS = 250

function summarize(tokens: marked.Token[]) {
  let summary = ''
  let charCount = 0

  for (const token of tokens) {
    if (token.type === 'paragraph') {
      const text = token.text || ''
      const remainingChars = MAX_CHARS - charCount
      summary += ' ' + text.substring(0, remainingChars)
      charCount += text.length

      if (charCount >= MAX_CHARS) {
        break
      }
    }
  }

  return summary
}
