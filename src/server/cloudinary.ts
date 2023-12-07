import toast from 'react-hot-toast'
import { Cursor } from 'textarea-markdown-editor'

export const uploadImage = async (file: File) => {
  const signResponse = await fetch('/api/sign-cloudinary', { method: 'POST' })
  const signData = (await signResponse.json()) as {
    apiKey: string
    timestamp: string
    signature: string
    folder: string
    cloudName: string
  }

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
    },
  )
  const data = (await response.json()) as {
    error: {
      message: string
    }
    secure_url: string
    original_filename: string
    width: number
    image_metadata: {
      DPI: string
    }
  }

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

const replacePlaceholder = (
  cursor: Cursor,
  placeholder: string,
  replaceWith: string,
) => {
  cursor.setValue(cursor.value.replace(placeholder, replaceWith))
}

export const uploadImageCommandHandler = async (
  textareaEl: HTMLTextAreaElement,
  files: File[],
) => {
  const cursor = new Cursor(textareaEl)
  const currentLineNumber = cursor.position.line

  const processFiles = async () => {
    for (const file of files) {
      const placeholder = `![Uploading ${file.name}...]()`
      cursor.replaceLine(currentLineNumber.lineNumber, placeholder)

      try {
        const uploadedImage = await uploadImage(file)
        const width =
          uploadedImage.dpi >= 144
            ? Math.round(uploadedImage.width / 2)
            : uploadedImage.width
        const imgTag = `<img width="${width}" alt="${uploadedImage.originalFilename}" src="${uploadedImage.url}">`

        replacePlaceholder(cursor, placeholder, imgTag)
      } catch (error) {
        console.log(error)
        replacePlaceholder(cursor, placeholder, '')
        toast.error(`Error uploading image`)
      }
    }
  }

  await processFiles()
}
