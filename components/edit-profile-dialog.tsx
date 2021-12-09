import { Avatar } from '@/components/avatar'
import { Button } from '@/components/button'
import { XIcon } from '@/components/icons'
import { TextField } from '@/components/text-field'
import type { User } from '@/lib/types'
import { Dialog, Transition } from '@headlessui/react'
import * as React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

type EditProfileDialogProps = {
  isOpen: boolean
  onClose: () => void
  user: User
}

type FormData = {
  name: string
  title: string
}

export function EditProfileDialog({
  isOpen,
  onClose,
  user,
}: EditProfileDialogProps) {
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: user.name,
      title: user.title,
    },
  })

  const onSubmit: SubmitHandler<FormData> = (data) => console.log(data)

  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-50"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-700 opacity-90 dark:bg-gray-900" />
          </Transition.Child>

          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-50"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md mt-[15vh] mb-8 overflow-hidden text-left align-middle transition-all transform bg-primary rounded-lg shadow-xl dark:border">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="px-6 pt-6 pb-12">
                  <div className="flex items-center justify-between gap-4">
                    <Dialog.Title as="h3" className="text-lg font-semibold">
                      Edit profile
                    </Dialog.Title>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center transition-colors rounded-sm text-secondary hover:text-primary hover:bg-secondary"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close</span>
                      <XIcon className="w-6 h-6" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-6 space-y-6">
                    <div>
                      <label className="block mb-2 font-semibold">Avatar</label>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <label
                            htmlFor="user-photo"
                            className="block cursor-pointer"
                          >
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
                        <Avatar name={user.name} src={user.avatarUrl} />
                      </div>
                    </div>

                    <TextField
                      {...register('name', { required: true })}
                      label="Name"
                      required
                    />

                    <TextField
                      {...register('title', { required: true })}
                      label="Title"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 px-6 py-4 border-t">
                  <Button type="submit">Save</Button>
                  <Button variant="secondary" onClick={onClose}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
