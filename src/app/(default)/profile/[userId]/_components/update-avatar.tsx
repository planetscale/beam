'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  AlertDialogAction,
  AlertDialogActions,
  AlertDialogCancel,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogTitle,
} from '~/app/_components/alert-dialog'
import { Avatar } from '~/app/_components/avatar'
import { Button } from '~/app/_components/button'
import { useDialogStore } from '~/app/_hooks/use-dialog-store'
import EditIcon from '~/app/_svg/edit-icon'
import { uploadImage } from '~/server/cloudinary'
import { api } from '~/trpc/react'

const UpdateAvatar = ({
  user,
}: {
  user: {
    name: string
    image: string | null
  }
}) => {
  const router = useRouter()
  const { handleDialogClose } = useDialogStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedImage, setUploadedImage] = useState(user.image)
  const updateUserAvatarMutation = api.user.updateAvatar.useMutation({
    onSuccess: () => {
      router.refresh()
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`)
    },
  })
  const uploadImageMutation = useMutation(
    (file: File) => {
      return uploadImage(file)
    },
    {
      onError: () => {
        toast.error(`Error uploading image`)
      },
    },
  )

  function handleClose() {
    handleDialogClose()
    setUploadedImage(user.image)
  }

  return (
    <>
      <AlertDialogContent>
        <AlertDialogTitle>Update avatar</AlertDialogTitle>
        <AlertDialogCloseButton onClick={handleClose} />
        <div className="flex justify-center mt-8">
          <Avatar name={user.name} src={uploadedImage} size="lg" />
        </div>
        <div className="grid grid-flow-col gap-6 mt-6">
          <div className="text-center">
            <Button
              variant="secondary"
              onClick={() => {
                fileInputRef.current?.click()
              }}
            >
              Choose file…
            </Button>
            <input
              ref={fileInputRef}
              name="user-image"
              type="file"
              accept=".jpg, .jpeg, .png, .gif"
              className="hidden"
              onChange={(event) => {
                const files = event.target.files

                if (files && files.length > 0) {
                  const file = files[0]!
                  if (file.size > 5242880) {
                    toast.error('Image is bigger than 5MB')
                    return
                  }
                  setUploadedImage(URL.createObjectURL(files[0]!))
                }
              }}
            />
            <p className="mt-2 text-xs text-secondary">
              JPEG, PNG, GIF / 5MB max
            </p>
          </div>
          {uploadedImage && (
            <div className="text-center">
              <Button
                variant="secondary"
                className="!text-red"
                onClick={() => {
                  fileInputRef.current!.value = ''
                  URL.revokeObjectURL(uploadedImage)
                  setUploadedImage(null)
                }}
              >
                Remove photo
              </Button>
              <p className="mt-2 text-xs text-secondary">
                And use default avatar
              </p>
            </div>
          )}
        </div>
      </AlertDialogContent>
      <AlertDialogActions>
        <AlertDialogAction>
          <Button
            isLoading={
              updateUserAvatarMutation.isLoading ||
              uploadImageMutation.isLoading
            }
            loadingChildren="Saving changes"
            onClick={async () => {
              if (user.image === uploadedImage) {
                handleClose()
              } else {
                const files = fileInputRef.current?.files

                if (files && files.length > 0) {
                  uploadImageMutation.mutate(files[0]!, {
                    onSuccess: (uploadedImage) => {
                      updateUserAvatarMutation.mutate({
                        image: uploadedImage.url,
                      })
                    },
                  })
                } else {
                  updateUserAvatarMutation.mutate({
                    image: null,
                  })
                }
              }
            }}
          >
            Save changes
          </Button>
        </AlertDialogAction>
        <AlertDialogCancel>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </AlertDialogCancel>
      </AlertDialogActions>
    </>
  )
}

export const UpdateAvatarAction = ({
  name,
  image,
}: {
  name: string
  image: string | null
}) => {
  const { handleDialog } = useDialogStore()
  return (
    <button
      type="button"
      className="relative inline-flex group"
      onClick={() =>
        handleDialog({ content: <UpdateAvatar user={{ name, image }} /> })
      }
    >
      <Avatar name={name} src={image} size="lg" />
      <div className="absolute inset-0 transition-opacity bg-gray-900 rounded-full opacity-0 group-hover:opacity-50" />
      <div className="absolute inline-flex items-center justify-center transition-opacity -translate-x-1/2 -translate-y-1/2 bg-gray-900 border border-white rounded-full opacity-0 top-1/2 left-1/2 h-9 w-9 group-hover:opacity-100">
        <EditIcon className="w-4 h-4 text-white" />
      </div>
    </button>
  )
}
