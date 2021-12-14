import DOMPurify from 'isomorphic-dompurify'
import { marked } from 'marked'
import toast from 'react-hot-toast'
import { Cursor } from 'textarea-markdown-editor'

export function markdownToHtml(markdown: string) {
  return DOMPurify.sanitize(marked.parse(markdown, { breaks: true }))
}

async function uploadImageToCloudinary(file: File) {
  const signResponse = await fetch('/api/sign-cloudinary', { method: 'POST' })
  const signData = await signResponse.json()

  const formData = new FormData()

  formData.append('file', file)
  formData.append('api_key', signData.apiKey)
  formData.append('timestamp', signData.timestamp)
  formData.append('signature', signData.signature)
  formData.append('folder', signData.folder)
  formData.append('image_metadata', 'true')

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )
  const data = await response.json()

  if (data.error) {
    throw Error(data.error.message)
  }

  return {
    url: data.secure_url,
    originalFilename: data.original_filename,
    width: data.width,
    dpi: Number(data.image_metadata.DPI),
  }
}

function replacePlaceholder(
  cursor: Cursor,
  placeholder: string,
  replaceWith: string
) {
  cursor.setText(cursor.getText().replace(placeholder, replaceWith))
}

export function handleUploadImages(
  textareaEl: HTMLTextAreaElement,
  files: File[]
) {
  const cursor = new Cursor(textareaEl)
  const currentLineNumber = cursor.getCurrentPosition().lineNumber

  files.forEach(async (file, idx) => {
    const placeholder = `![Uploading ${file.name}...]()`

    cursor.spliceContent(Cursor.raw`${placeholder}${Cursor.$}`, {
      startLineNumber: currentLineNumber + idx,
    })

    try {
      const uploadedImage = await uploadImageToCloudinary(file)

      replacePlaceholder(
        cursor,
        placeholder,
        `<img width="${
          uploadedImage.dpi >= 144
            ? Math.round(uploadedImage.width / 2)
            : uploadedImage.width
        }" alt="${uploadedImage.originalFilename}" src="${uploadedImage.url}">`
      )
    } catch (error: any) {
      console.log(error)
      replacePlaceholder(cursor, placeholder, '')
      toast.error(`Error uploading image: ${error.message}`)
    }
  })
}
