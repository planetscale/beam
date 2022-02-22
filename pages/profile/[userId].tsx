import { Avatar } from '@/components/avatar'
import { Button } from '@/components/button'
import {
  Dialog,
  DialogActions,
  DialogCloseButton,
  DialogContent,
  DialogTitle,
} from '@/components/dialog'
import { IconButton } from '@/components/icon-button'
import { EditIcon } from '@/components/icons'
import { Layout } from '@/components/layout'
import { getQueryPaginationInput, Pagination } from '@/components/pagination'
import type { PostSummaryProps } from '@/components/post-summary'
import { PostSummarySkeleton } from '@/components/post-summary-skeleton'
import { TextField } from '@/components/text-field'
import { browserEnv } from '@/env/browser'
import { uploadImage } from '@/lib/cloudinary'
import { InferQueryPathAndInput, trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'

const PostSummary = dynamic<PostSummaryProps>(
  () => import('@/components/post-summary').then((mod) => mod.PostSummary),
  { ssr: false }
)

const POSTS_PER_PAGE = 20

function getProfileQueryPathAndInput(
  id: string
): InferQueryPathAndInput<'user.profile'> {
  return [
    'user.profile',
    {
      id,
    },
  ]
}

const ProfilePage: NextPageWithAuthAndLayout = () => {
  return (
    <>
      <ProfileInfo />
      <ProfileFeed />
    </>
  )
}

ProfilePage.auth = true

ProfilePage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

function ProfileInfo() {
  const { data: session } = useSession()
  const router = useRouter()
  const profileQueryPathAndInput = getProfileQueryPathAndInput(
    String(router.query.userId)
  )
  const profileQuery = trpc.useQuery(profileQueryPathAndInput)

  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] =
    React.useState(false)
  const [isUpdateAvatarDialogOpen, setIsUpdateAvatarDialogOpen] =
    React.useState(false)

  if (profileQuery.data) {
    const profileBelongsToUser = profileQuery.data.id === session!.user.id

    return (
      <>
        <Head>
          <title>{profileQuery.data.name} - Beam</title>
        </Head>

        <div className="relative flex items-center gap-4 py-8 overflow-hidden">
          <div className="flex items-center gap-8">
            {browserEnv.NEXT_PUBLIC_ENABLE_IMAGE_UPLOAD &&
            profileBelongsToUser ? (
              <button
                type="button"
                className="relative inline-flex group"
                onClick={() => {
                  setIsUpdateAvatarDialogOpen(true)
                }}
              >
                <Avatar
                  name={profileQuery.data.name!}
                  src={profileQuery.data.image}
                  size="lg"
                />
                <div className="absolute inset-0 transition-opacity bg-gray-900 rounded-full opacity-0 group-hover:opacity-50" />
                <div className="absolute inline-flex items-center justify-center transition-opacity -translate-x-1/2 -translate-y-1/2 bg-gray-900 border border-white rounded-full opacity-0 top-1/2 left-1/2 h-9 w-9 group-hover:opacity-100">
                  <EditIcon className="w-4 h-4 text-white" />
                </div>
              </button>
            ) : (
              <Avatar
                name={profileQuery.data.name!}
                src={profileQuery.data.image}
                size="lg"
              />
            )}

            <div className="flex-1">
              <h1 className="bg-primary text-2xl font-semibold tracking-tight md:text-3xl">
                {profileQuery.data.name}
              </h1>
              {profileQuery.data.title && (
                <p className="text-lg tracking-tight text-secondary">
                  {profileQuery.data.title}
                </p>
              )}
            </div>
          </div>

          {profileBelongsToUser && (
            <div className="ml-auto mr-10">
              <IconButton
                variant="secondary"
                onClick={() => {
                  setIsEditProfileDialogOpen(true)
                }}
              >
                <EditIcon className="w-4 h-4" />
              </IconButton>
            </div>
          )}

          <DotPattern />
        </div>

        <EditProfileDialog
          user={{
            name: profileQuery.data.name!,
            title: profileQuery.data.title,
          }}
          isOpen={isEditProfileDialogOpen}
          onClose={() => {
            setIsEditProfileDialogOpen(false)
          }}
        />

        <UpdateAvatarDialog
          key={profileQuery.data.image}
          user={{
            name: profileQuery.data.name!,
            image: profileQuery.data.image,
          }}
          isOpen={isUpdateAvatarDialogOpen}
          onClose={() => {
            setIsUpdateAvatarDialogOpen(false)
          }}
        />
      </>
    )
  }

  if (profileQuery.isError) {
    return <div>Error: {profileQuery.error.message}</div>
  }

  return (
    <div className="relative flex items-center gap-8 py-8 overflow-hidden animate-pulse">
      <div className="w-32 h-32 bg-gray-200 rounded-full dark:bg-gray-700" />
      <div className="flex-1">
        <div className="h-8 bg-gray-200 rounded w-60 dark:bg-gray-700" />
        <div className="w-40 h-5 mt-2 bg-gray-200 rounded dark:bg-gray-700" />
      </div>
      <DotPattern />
    </div>
  )
}

function ProfileFeed() {
  const { data: session } = useSession()
  const router = useRouter()
  const currentPageNumber = router.query.page ? Number(router.query.page) : 1
  const utils = trpc.useContext()
  const profileFeedQueryPathAndInput: InferQueryPathAndInput<'post.feed'> = [
    'post.feed',
    {
      ...getQueryPaginationInput(POSTS_PER_PAGE, currentPageNumber),
      authorId: String(router.query.userId),
    },
  ]
  const profileFeedQuery = trpc.useQuery(profileFeedQueryPathAndInput)
  const likeMutation = trpc.useMutation(['post.like'], {
    onMutate: async (likedPostId) => {
      await utils.cancelQuery(profileFeedQueryPathAndInput)

      const previousQuery = utils.getQueryData(profileFeedQueryPathAndInput)

      if (previousQuery) {
        utils.setQueryData(profileFeedQueryPathAndInput, {
          ...previousQuery,
          posts: previousQuery.posts.map((post) =>
            post.id === likedPostId
              ? {
                  ...post,
                  likedBy: [
                    ...post.likedBy,
                    {
                      user: { id: session!.user.id, name: session!.user.name },
                    },
                  ],
                }
              : post
          ),
        })
      }

      return { previousQuery }
    },
    onError: (err, id, context: any) => {
      if (context?.previousQuery) {
        utils.setQueryData(profileFeedQueryPathAndInput, context.previousQuery)
      }
    },
  })
  const unlikeMutation = trpc.useMutation(['post.unlike'], {
    onMutate: async (unlikedPostId) => {
      await utils.cancelQuery(profileFeedQueryPathAndInput)

      const previousQuery = utils.getQueryData(profileFeedQueryPathAndInput)

      if (previousQuery) {
        utils.setQueryData(profileFeedQueryPathAndInput, {
          ...previousQuery,
          posts: previousQuery.posts.map((post) =>
            post.id === unlikedPostId
              ? {
                  ...post,
                  likedBy: post.likedBy.filter(
                    (item) => item.user.id !== session!.user.id
                  ),
                }
              : post
          ),
        })
      }

      return { previousQuery }
    },
    onError: (err, id, context: any) => {
      if (context?.previousQuery) {
        utils.setQueryData(profileFeedQueryPathAndInput, context.previousQuery)
      }
    },
  })

  if (profileFeedQuery.data) {
    return (
      <>
        <div className="flow-root mt-28">
          {profileFeedQuery.data.postCount === 0 ? (
            <div className="text-center text-secondary border rounded py-20 px-10">
              This user hasn&apos;t published any posts yet.
            </div>
          ) : (
            <ul className="-my-12 divide-y divide-primary">
              {profileFeedQuery.data.posts.map((post) => (
                <li key={post.id} className="py-10">
                  <PostSummary
                    hideAuthor
                    post={post}
                    onLike={() => {
                      likeMutation.mutate(post.id)
                    }}
                    onUnlike={() => {
                      unlikeMutation.mutate(post.id)
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <Pagination
          itemCount={profileFeedQuery.data.postCount}
          itemsPerPage={POSTS_PER_PAGE}
          currentPageNumber={currentPageNumber}
        />
      </>
    )
  }

  if (profileFeedQuery.isError) {
    return <div className="mt-28">Error: {profileFeedQuery.error.message}</div>
  }

  return (
    <div className="flow-root mt-28">
      <ul className="-my-12 divide-y divide-primary">
        {[...Array(3)].map((_, idx) => (
          <li key={idx} className="py-10">
            <PostSummarySkeleton hideAuthor />
          </li>
        ))}
      </ul>
    </div>
  )
}

function DotPattern() {
  return (
    <svg
      className="absolute inset-0 -z-1"
      width={720}
      height={240}
      fill="none"
      viewBox="0 0 720 240"
    >
      <defs>
        <pattern
          id="dot-pattern"
          x={0}
          y={0}
          width={31.5}
          height={31.5}
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx={1.5}
            cy={1.5}
            r={1.5}
            className="text-gray-100 dark:text-gray-700"
            fill="currentColor"
          />
        </pattern>
      </defs>
      <rect width={720} height={240} fill="url(#dot-pattern)" />
    </svg>
  )
}

type EditFormData = {
  name: string
  title: string | null
}

function EditProfileDialog({
  user,
  isOpen,
  onClose,
}: {
  user: {
    name: string
    title: string | null
  }
  isOpen: boolean
  onClose: () => void
}) {
  const { register, handleSubmit, reset } = useForm<EditFormData>({
    defaultValues: {
      name: user.name,
      title: user.title,
    },
  })
  const router = useRouter()
  const utils = trpc.useContext()
  const editUserMutation = trpc.useMutation('user.edit', {
    onSuccess: () => {
      window.location.reload()
      return utils.invalidateQueries(
        getProfileQueryPathAndInput(String(router.query.userId))
      )
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`)
    },
  })

  function handleClose() {
    onClose()
    reset()
  }

  const onSubmit: SubmitHandler<EditFormData> = (data) => {
    editUserMutation.mutate(
      {
        name: data.name,
        title: data.title,
      },
      {
        onSuccess: () => onClose(),
      }
    )
  }

  return (
    <Dialog isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogTitle>Edit profile</DialogTitle>
          <div className="mt-6 space-y-6">
            <TextField
              {...register('name', { required: true })}
              label="Name"
              required
            />

            <TextField {...register('title')} label="Title" />
          </div>
          <DialogCloseButton onClick={handleClose} />
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            isLoading={editUserMutation.isLoading}
            loadingChildren="Saving"
          >
            Save
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

function UpdateAvatarDialog({
  user,
  isOpen,
  onClose,
}: {
  user: {
    name: string
    image: string | null
  }
  isOpen: boolean
  onClose: () => void
}) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [uploadedImage, setUploadedImage] = React.useState(user.image)
  const updateUserAvatarMutation = trpc.useMutation('user.update-avatar', {
    onSuccess: () => {
      window.location.reload()
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
      onError: (error: any) => {
        toast.error(`Error uploading image: ${error.message}`)
      },
    }
  )

  function handleClose() {
    onClose()
    setUploadedImage(user.image)
  }

  return (
    <Dialog isOpen={isOpen} onClose={handleClose}>
      <DialogContent>
        <DialogTitle>Update avatar</DialogTitle>
        <DialogCloseButton onClick={handleClose} />
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
                  const file = files[0]
                  if (file.size > 5242880) {
                    toast.error('Image is bigger than 5MB')
                    return
                  }
                  setUploadedImage(URL.createObjectURL(files[0]))
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
      </DialogContent>
      <DialogActions>
        <Button
          isLoading={
            updateUserAvatarMutation.isLoading || uploadImageMutation.isLoading
          }
          loadingChildren="Saving changes"
          onClick={async () => {
            if (user.image === uploadedImage) {
              handleClose()
            } else {
              const files = fileInputRef.current?.files

              if (files && files.length > 0) {
                uploadImageMutation.mutate(files[0], {
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
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProfilePage
