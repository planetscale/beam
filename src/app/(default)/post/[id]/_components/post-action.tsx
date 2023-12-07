'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Button } from '~/app/_components/button'
import {
  AlertDialogAction,
  AlertDialogActions,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogCancel,
} from '~/app/_components/alert-dialog'
import {
  Menu,
  MenuButton,
  MenuItemButton,
  MenuItems,
  MenuItem,
  MenuItemsContent,
  MenuItemLink,
} from '~/app/_components/menu'
import { useDialogStore } from '~/app/_hooks/use-dialog-store'
import DotsIcon from '~/app/_svg/dots-icon'
import EditIcon from '~/app/_svg/edit-icon'
import EyeIcon from '~/app/_svg/eye-icon'
import TrashIcon from '~/app/_svg/trash-icon'
import { api } from '~/trpc/react'

type PostActionProps = {
  isUserAdmin: boolean
  isHidden: boolean
  postBelongsToUser: boolean
  postId: number
}

export const PostAction = ({
  isUserAdmin,
  isHidden,
  postBelongsToUser,
  postId,
}: PostActionProps) => {
  const { handleDialog } = useDialogStore()

  return (
    <>
      <div className="flex md:hidden">
        <Menu>
          <MenuButton title="More">
            <DotsIcon className="w-4 h-4" />
          </MenuButton>

          <MenuItems className="w-28">
            <MenuItemsContent>
              {isUserAdmin &&
                (isHidden ? (
                  <MenuItem>
                    <MenuItemButton
                      onClick={() =>
                        handleDialog({
                          content: <ConfirmUnhidePostDialog postId={postId} />,
                        })
                      }
                    >
                      Unhide
                    </MenuItemButton>
                  </MenuItem>
                ) : (
                  <MenuItem>
                    <MenuItemButton
                      onClick={() =>
                        handleDialog({
                          content: <ConfirmHidePostDialog postId={postId} />,
                        })
                      }
                    >
                      Hide
                    </MenuItemButton>
                  </MenuItem>
                ))}
              {postBelongsToUser && (
                <>
                  <MenuItem>
                    <MenuItemLink href={`/post/${postId}/edit`}>
                      Edit
                    </MenuItemLink>
                  </MenuItem>
                  <MenuItem>
                    <MenuItemButton
                      onClick={() =>
                        handleDialog({
                          content: <ConfirmDeleteDialog postId={postId} />,
                        })
                      }
                      className="text-red"
                    >
                      Delete
                    </MenuItemButton>
                  </MenuItem>
                </>
              )}
            </MenuItemsContent>
          </MenuItems>
        </Menu>
      </div>
      <div className="hidden md:flex md:gap-4">
        {isUserAdmin &&
          (isHidden ? (
            <Button
              variant="secondary"
              title="Unhide"
              onClick={() =>
                handleDialog({
                  content: <ConfirmUnhidePostDialog postId={postId} />,
                })
              }
            >
              <EyeIcon className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="secondary"
              title="Hide"
              onClick={() =>
                handleDialog({
                  content: <ConfirmHidePostDialog postId={postId} />,
                })
              }
            >
              <EyeIcon className="w-4 h-4" />
            </Button>
          ))}
        {postBelongsToUser && (
          <>
            <Button title="Edit" href={`/post/${postId}/edit`}>
              <EditIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              title="Delete"
              onClick={() =>
                handleDialog({
                  content: <ConfirmDeleteDialog postId={postId} />,
                })
              }
            >
              <TrashIcon className="w-4 h-4 text-red" />
            </Button>
          </>
        )}
      </div>
    </>
  )
}

const ConfirmDeleteDialog = ({ postId }: { postId: number }) => {
  const { handleDialogClose } = useDialogStore()
  const router = useRouter()
  const deletePostMutation = api.post.delete.useMutation({
    onSuccess: () => router.push('/'),
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`)
    },
  })

  return (
    <>
      <AlertDialogContent>
        <AlertDialogTitle>Delete post</AlertDialogTitle>
        <AlertDialogDescription className="mt-6">
          Are you sure you want to delete this post?
        </AlertDialogDescription>
        <AlertDialogCloseButton onClick={handleDialogClose} />
      </AlertDialogContent>
      <AlertDialogActions>
        <AlertDialogAction>
          <Button
            variant="secondary"
            className="!text-red"
            isLoading={deletePostMutation.isLoading}
            loadingChildren="Deleting post"
            onClick={() => {
              deletePostMutation.mutate(postId, {
                onSuccess: () => router.push('/'),
              })
            }}
          >
            Delete post
          </Button>
        </AlertDialogAction>
        <AlertDialogCancel>
          <Button variant="secondary" onClick={handleDialogClose}>
            Cancel
          </Button>
        </AlertDialogCancel>
      </AlertDialogActions>
    </>
  )
}

const ConfirmHidePostDialog = ({ postId }: { postId: number }) => {
  const { handleDialogClose } = useDialogStore()

  const hidePostMutation = api.post.hide.useMutation({
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`)
    },
  })

  return (
    <>
      <AlertDialogContent>
        <AlertDialogTitle>Hide post</AlertDialogTitle>
        <AlertDialogDescription className="mt-6">
          Are you sure you want to hide this post?
        </AlertDialogDescription>
        <AlertDialogCloseButton onClick={handleDialogClose} />
      </AlertDialogContent>
      <AlertDialogActions>
        <Button
          variant="secondary"
          isLoading={hidePostMutation.isLoading}
          loadingChildren="Hiding post"
          onClick={() =>
            hidePostMutation.mutate(postId, {
              onSuccess: () => {
                toast.success('Post hidden')
                handleDialogClose()
              },
            })
          }
        >
          Hide post
        </Button>
        <Button variant="secondary" onClick={handleDialogClose}>
          Cancel
        </Button>
      </AlertDialogActions>
    </>
  )
}

const ConfirmUnhidePostDialog = ({ postId }: { postId: number }) => {
  const { handleDialogClose } = useDialogStore()

  const unhidePostMutation = api.post.unhide.useMutation({
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`)
    },
  })

  return (
    <>
      <AlertDialogContent>
        <AlertDialogTitle>Hide post</AlertDialogTitle>
        <AlertDialogDescription className="mt-6">
          Are you sure you want to unhide this post?
        </AlertDialogDescription>
        <AlertDialogCloseButton onClick={handleDialogClose} />
      </AlertDialogContent>
      <AlertDialogActions>
        <Button
          variant="secondary"
          isLoading={unhidePostMutation.isLoading}
          loadingChildren="Unhiding post"
          onClick={() =>
            unhidePostMutation.mutate(postId, {
              onSuccess: () => {
                toast.success('Post unhidden')
                handleDialogClose()
              },
            })
          }
        >
          Hide post
        </Button>
        <Button variant="secondary" onClick={handleDialogClose}>
          Cancel
        </Button>
      </AlertDialogActions>
    </>
  )
}
