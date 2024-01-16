import 'client-only'

export const summarize = (html: string) => {
  const parser = new DOMParser()
  const document = parser.parseFromString(html, 'text/html')

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
        hasMore: document.body.children.length > 2,
      }
    } else {
      return {
        summary: firstElement.outerHTML,
        hasMore: document.body.children.length > 1,
      }
    }
  } else {
    return { summary: "<p>Summary couldn't be generated</p>", hasMore: false }
  }
}
