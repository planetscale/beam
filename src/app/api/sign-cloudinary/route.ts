import { v2 as cloudinary } from 'cloudinary'
import { env } from '~/env'
import { getServerAuthSession } from '~/server/auth'

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
})

const cloudName = cloudinary.config().cloud_name!
const apiSecret = cloudinary.config().api_secret!
const apiKey = cloudinary.config().api_key!
const folder = 'beam'

export const POST = async () => {
  const session = await getServerAuthSession()

  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  const timestamp = Math.round(new Date().getTime() / 1000)
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
      image_metadata: true,
    },
    apiSecret,
  )

  return Response.json({ timestamp, folder, signature, apiKey, cloudName })
}
