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
import type { PostSummaryProps } from '@/components/post-summary'
import { PostSummarySkeleton } from '@/components/post-summary-skeleton'
import { TextField } from '@/components/text-field'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

const PostSummary = dynamic<PostSummaryProps>(
  () => import('@/components/post-summary').then((mod) => mod.PostSummary),
  { ssr: false }
)

const ProfilePage: NextPageWithAuthAndLayout = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const utils = trpc.useContext()
  const profileQueryInput = { id: String(router.query.userId) }
  const profileQuery = trpc.useQuery(['user.profile', profileQueryInput])
  const likeMutation = trpc.useMutation(['post.like'], {
    onMutate: async (likedPostId) => {
      await utils.cancelQuery(['user.profile', profileQueryInput])

      const previousQuery = utils.getQueryData([
        'user.profile',
        profileQueryInput,
      ])

      if (previousQuery) {
        utils.setQueryData(['user.profile', profileQueryInput], {
          ...previousQuery,
          posts: previousQuery.posts.map((post) =>
            post.id === likedPostId
              ? {
                  ...post,
                  likedBy: [{ id: session!.user.id }],
                  _count: {
                    ...post._count,
                    likedBy: post._count.likedBy + 1,
                  },
                }
              : post
          ),
        })
      }

      return { previousQuery }
    },
    onError: (err, id, context: any) => {
      if (context?.previousQuery) {
        utils.setQueryData(
          ['user.profile', profileQueryInput],
          context.previousQuery
        )
      }
    },
  })
  const unlikeMutation = trpc.useMutation(['post.unlike'], {
    onMutate: async (unlikedPostId) => {
      await utils.cancelQuery(['user.profile', profileQueryInput])

      const previousQuery = utils.getQueryData([
        'user.profile',
        profileQueryInput,
      ])

      if (previousQuery) {
        utils.setQueryData(['user.profile', profileQueryInput], {
          ...previousQuery,
          posts: previousQuery.posts.map((post) =>
            post.id === unlikedPostId
              ? {
                  ...post,
                  likedBy: [],
                  _count: {
                    ...post._count,
                    likedBy: post._count.likedBy - 1,
                  },
                }
              : post
          ),
        })
      }

      return { previousQuery }
    },
    onError: (err, id, context: any) => {
      if (context?.previousQuery) {
        utils.setQueryData(
          ['user.profile', profileQueryInput],
          context.previousQuery
        )
      }
    },
  })
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] =
    React.useState(false)

  if (profileQuery.data) {
    const profileBelongsToUser = profileQuery.data.id === session!.user.id

    return (
      <>
        <Head>
          <title>{profileQuery.data.name} - Flux</title>
        </Head>

        <div className="relative flex items-center gap-4 py-8 overflow-hidden">
          <div className="flex items-center gap-8">
            <Avatar
              name={profileQuery.data.name!}
              src={profileQuery.data.image}
              size="lg"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight">
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

        <div className="flow-root mt-28">
          {profileQuery.data.posts.length === 0 ? (
            <div className="text-lg text-center">No posts</div>
          ) : (
            <ul className="-my-12 divide-y divide-primary">
              {profileQuery.data.posts.map((post) => (
                <li key={post.id} className="py-12">
                  <PostSummary
                    post={post}
                    hideAuthor
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

        <EditProfileDialog
          user={{
            name: profileQuery.data.name!,
            title: profileQuery.data.title,
            image: profileQuery.data.image,
          }}
          isOpen={isEditProfileDialogOpen}
          onClose={() => {
            setIsEditProfileDialogOpen(false)
          }}
        />
      </>
    )
  }

  if (profileQuery.isError) {
    return <div>Error: {profileQuery.error.message}</div>
  }

  return (
    <>
      <div className="relative flex items-center gap-8 py-8 overflow-hidden animate-pulse">
        <div className="w-32 h-32 bg-gray-200 rounded-full dark:bg-gray-700" />
        <div className="flex-1">
          <div className="h-8 bg-gray-200 rounded w-60 dark:bg-gray-700" />
          <div className="w-40 h-5 mt-2 bg-gray-200 rounded dark:bg-gray-700" />
        </div>
        <DotPattern />
      </div>

      <div className="flow-root mt-28">
        <ul className="-my-12 divide-y divide-primary">
          {[...Array(2)].map((_, idx) => (
            <li key={idx} className="py-12">
              <PostSummarySkeleton />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

ProfilePage.auth = true

ProfilePage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
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
          <rect
            x={0}
            y={0}
            width={3}
            height={3}
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
    image: string | null
  }
  isOpen: boolean
  onClose: () => void
}) {
  const { register, handleSubmit } = useForm<EditFormData>({
    defaultValues: {
      name: user.name,
      title: user.title,
    },
  })
  const router = useRouter()
  const utils = trpc.useContext()
  const editUserMutation = trpc.useMutation('user.edit', {
    onSuccess: () => {
      return utils.invalidateQueries([
        'user.profile',
        { id: String(router.query.userId) },
      ])
    },
  })

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
    <Dialog isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogTitle>Edit profile</DialogTitle>
          <div className="mt-6 space-y-6">
            <div>
              <label className="block mb-2 font-semibold">Avatar</label>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <label htmlFor="user-photo" className="block cursor-pointer">
                    <span className="block font-medium transition-colors text-blue hover:text-blue-dark">
                      Choose file to upload
                    </span>
                    <span className="block text-xs text-secondary">
                      JPEG, PNG, GIF. Max size: 5MB
                    </span>
                  </label>
                  <input
                    id="user-photo"
                    name="user-photo"
                    type="file"
                    className="hidden"
                  />
                </div>
                <Avatar name={user.name} src={user.image} />
              </div>
            </div>

            <TextField
              {...register('name', { required: true })}
              label="Name"
              required
            />

            <TextField {...register('title')} label="Title" />
          </div>
          <DialogCloseButton onClick={onClose} />
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            isLoading={editUserMutation.isLoading}
            loadingChildren="Saving"
          >
            Save
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ProfilePage
