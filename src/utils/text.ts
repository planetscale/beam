import { type Cursor } from 'textarea-markdown-editor'
import DOMPurify from 'isomorphic-dompurify'
import { marked } from 'marked'

export const replacePlaceholder = (
  cursor: Cursor,
  placeholder: string,
  replaceWith: string,
) => {
  cursor.setValue(cursor.value.replace(placeholder, replaceWith))
}

export const isCharacterALetter = (char: string) => {
  return /[a-zA-Z]/.test(char)
}

export const markdownToHtml = (markdown: string) => {
  const parsedMarkdown = marked.parse(markdown, { async: false })
  return DOMPurify.sanitize(parsedMarkdown as string)
}
