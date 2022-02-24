import { serverEnv } from '@/env/server'
import type { Post } from '@prisma/client'

export function postToTelegramIfEnabled({
  post,
  authorName,
}: {
  post: Post
  authorName: string
}) {
  if (
    serverEnv.ENABLE_TELEGRAM_POSTING &&
    serverEnv.TELEGRAM_BOT_TOKEN &&
    serverEnv.TELEGRAM_CHAT_ID
  ) {
    const url = `https://api.telegram.org/bot${serverEnv.TELEGRAM_BOT_TOKEN}/sendMessage`
    const message = `<a href="${serverEnv.NEXT_APP_URL}/post/${post.id}">👋 There's a new post from ${authorName}: <b>${post.title}</b></a>`
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parse_mode: 'HTML',
        text: message,
        // disable_web_page_preview: true,
        chat_id: serverEnv.TELEGRAM_CHAT_ID,
      }),
    })
  }
}
