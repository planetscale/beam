import { serverEnv } from '@/env/server'
import type { Post } from '@prisma/client'
import { markdownToBlocks } from '@tryfabric/mack'
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
    const summaryToken = tokens.find((token) => {
      return (
        token.type === 'paragraph' ||
        token.type === 'html' ||
        token.type === 'image'
      )
    })
    const summaryBlocks = summaryToken
      ? await markdownToBlocks(summaryToken.raw)
      : []

    const web = new WebClient(serverEnv.SLACK_TOKEN)
    return await web.chat.postMessage({
      channel: '#mike-test',
      text: `*<${serverEnv.NEXT_APP_URL}/post/${post.id}|${post.title}>*`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*<${serverEnv.NEXT_APP_URL}/post/${post.id}|${post.title}>*`,
          },
        },
        summaryBlocks[0],
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
    // return fetch(serverEnv.SLACK_WEBHOOK_URL, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     blocks: [
    //       {
    //         type: 'section',
    //         text: {
    //           type: 'mrkdwn',
    //           text: `*<${serverEnv.NEXT_APP_URL}/post/${post.id}|${post.title}>*`,
    //         },
    //       },
    //       summaryBlocks[0],
    //       { type: 'divider' },
    //       {
    //         type: 'context',
    //         elements: [
    //           {
    //             type: 'plain_text',
    //             text: authorName,
    //             emoji: true,
    //           },
    //         ],
    //       },
    //     ],
    //   }),
    // })
  }
}
