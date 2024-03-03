'use client'

import { type SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Button } from '~/components/button'
import {
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogActions,
  AlertDialogCloseButton,
  AlertDialogAction,
  AlertDialogCancel,
} from '~/components/alert-dialog'
import { TextField } from '~/components/text-field'
import { useDialogStore } from '~/hooks/use-dialog-store'
import EditIcon from '~/components/svg/edit-icon'
import { api } from '~/trpc/react'
import { type RouterOutputs } from '~/trpc/shared'
import { env } from '~/env'
import { UpdateAvatarAction } from './update-avatar'
import { Avatar } from '~/components/avatar'

type EditFormData = {
  name: string
  title: string | null
}

const EditProfileDialog = ({
  user,
}: {
  user: RouterOutputs['user']['profile']
}) => {
  const { handleDialogClose } = useDialogStore()

  const utils = api.useUtils()

  const { register, handleSubmit, reset } = useForm<EditFormData>({
    defaultValues: {
      name: user.name ?? '',
      title: user.title ?? '',
    },
  })
  const editUserMutation = api.user.edit.useMutation({
    onMutate: (data) => {
      utils.user.profile.setData(
        { id: user.id },
        {
          name: data.name,
          id: user.id,
          title: data.title ?? '',
          image: user.image,
        },
      )
    },
    onSuccess: async () => {
      await utils.post.feed.invalidate({ authorId: user.id })
      await utils.user.profile.invalidate({ id: user.id })
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`)
    },
  })

  const handleClose = () => {
    handleDialogClose()
    reset()
  }

  const onSubmit: SubmitHandler<EditFormData> = (data) => {
    editUserMutation.mutate(
      {
        ...data,
      },
      {
        onSuccess: () => handleDialogClose(),
      },
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AlertDialogContent>
        <AlertDialogTitle>Edit profile</AlertDialogTitle>
        <div className="mt-6 space-y-6">
          <TextField
            {...register('name', { required: true })}
            label="Name"
            required
          />

          <TextField {...register('title')} label="Title" />
        </div>
        <AlertDialogCloseButton onClick={handleClose} />
      </AlertDialogContent>
      <AlertDialogActions>
        <AlertDialogAction>
          <Button
            type="submit"
            isLoading={editUserMutation.isLoading}
            loadingChildren="Saving"
          >
            Save
          </Button>
        </AlertDialogAction>
        <AlertDialogCancel>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </AlertDialogCancel>
      </AlertDialogActions>
    </form>
  )
}

export const EditProfileAction = ({
  id,
  profileBelongsToUser,
}: {
  id: string
  profileBelongsToUser: boolean
}) => {
  const { handleDialog } = useDialogStore()
  const { data } = api.user.profile.useQuery({ id })

  if (!data) {
    return null
  }

  return (
    <>
      <div className="flex items-center gap-8">
        {env.NEXT_PUBLIC_ENABLE_IMAGE_UPLOAD && profileBelongsToUser ? (
          <UpdateAvatarAction name={data.name!} image={data.image} />
        ) : (
          <Avatar name={data.name!} src={data.image} size="lg" />
        )}

        <div className="flex-1">
          <h1 className="bg-primary text-2xl font-semibold tracking-tight md:text-3xl">
            {data.name}
          </h1>
          {data.title && (
            <p className="text-lg tracking-tight text-secondary">
              {data.title}
            </p>
          )}
        </div>
      </div>
      <div className="ml-auto mr-10">
        <Button
          variant="secondary"
          onClick={() => {
            handleDialog({
              content: <EditProfileDialog user={data} />,
            })
          }}
        >
          <EditIcon className="w-4 h-4" />
        </Button>
      </div>
    </>
  )
}
