import 'client-only'
import { parse } from 'node-html-parser'

export const summarize = (html: string) => {
  const document = parse(html)

  const allowedTags = ['p', 'ul', 'ol', 'h3', 'pre', 'img']

  let firstElement

  for (const tag of allowedTags) {
    firstElement = document.querySelector(tag)
    if (firstElement) {
      break
    }
  }

  if (firstElement) {
    if (
      firstElement.textContent &&
      firstElement.textContent.length < 20 &&
      firstElement.nextElementSibling
    ) {
      return {
        summary:
          firstElement.outerHTML + firstElement.nextElementSibling.outerHTML,
        hasMore: document.childNodes.length > 2,
      }
    } else {
      return {
        summary: firstElement.outerHTML,
        hasMore: document.childNodes.length > 1,
      }
    }
  } else {
    return { summary: "<p>Summary couldn't be generated</p>", hasMore: false }
  }
}
