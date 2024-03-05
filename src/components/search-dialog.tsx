'use client'

import { useState } from 'react'
import { Command } from 'cmdk'
import { useHotkeys } from 'react-hotkeys-hook'
import { useRouter } from 'next/navigation'
import { useDebounce } from 'use-debounce'
import { api } from '~/trpc/react'
import SearchIcon from '~/components/svg/search-icon'
import SpinnerIcon from '~/components/svg/spinner'
import { useSearchStore } from '~/hooks/use-search-store'
import SvgHash from '~/app/components/svg/hash'
import SvgPerson from '~/app/components/svg/person'

export const SearchDialog = () => {
  const { open, toggleOpen } = useSearchStore()
  const [inputValue, setInputValue] = useState('')
  const [debouncedValue] = useDebounce(inputValue, 1000)
  const router = useRouter()

  useHotkeys(
    'mod+k',
    (e) => {
      toggleOpen()
      e.preventDefault()
    },
    [],
  )

  useHotkeys(
    '/',
    (e) => {
      toggleOpen()
      e.preventDefault()
    },
    [],
  )

  const { data, isFetching } = api.post.search.useQuery(
    {
      query: debouncedValue,
    },
    {
      enabled: debouncedValue.length > 0,
    },
  )

  return (
    <Command.Dialog
      label="Search"
      open={open}
      onOpenChange={toggleOpen}
      className="fixed inset-0 animate-fade-in group"
      shouldFilter={false}
    >
      <div className="fixed inset-0 transition-opacity bg-gray-700 opacity-90 dark:bg-gray-900" />
      <div className="relative z-[100] w-[650px] mx-auto flex flex-col items-center max-w-md">
        <div className="inline-block w-full mt-[10vh] overflow-hidden animate-scale-in-content text-left align-middle transition-all transform bg-primary rounded-lg shadow-xl dark:border">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-opacity">
              {isFetching ? (
                <SpinnerIcon className="w-4 h-4 animate-spin" />
              ) : (
                <SearchIcon className="w-4 h-4" aria-hidden="true" />
              )}
            </div>
            <Command.Input
              placeholder="Search"
              className="block w-full py-3 pl-10 bg-transparent border-0 focus:ring-0 rounded-none"
              autoFocus
              value={inputValue}
              tabIndex={0}
              onValueChange={(value) => {
                setInputValue(value)
              }}
            />
          </div>
          <Command.Empty className="w-full block py-3.5 pl-10 pr-3 transition-colors leading-tight">
            No results found.
          </Command.Empty>

          <Command.List className="max-h-[286px] border-t overflow-y-auto w-full">
            {data?.authors.length ? (
              <div className="border-b">
                <span className="text-xs p-4 text-secondary">Authors</span>
                {data.authors.map((author) => (
                  <Command.Item
                    className="w-full block py-3.5 px-4 leading-tight data-[selected=true]:bg-blue-600 data-[selected=true]:text-white"
                    onSelect={() => {
                      toggleOpen()
                      router.push(`/profile/${author.id}`)
                    }}
                    value={author.id}
                  >
                    <div className="flex gap-3 items-center">
                      <SvgPerson className="h-4 w-4" />
                      <span className="line-clamp-1">{author.name}</span>
                    </div>
                  </Command.Item>
                ))}
              </div>
            ) : null}
            {data?.posts.length ? (
              <>
                <span className="text-xs p-4 text-secondary">Posts</span>
                {data.posts.map((result) => (
                  <Command.Item
                    className="w-full block py-3.5 px-4 leading-tight data-[selected=true]:bg-blue-600 data-[selected=true]:text-white"
                    onSelect={() => {
                      toggleOpen()
                      router.push(`/post/${result.id}`)
                    }}
                    value={result.title}
                  >
                    <div className="flex gap-3 items-center">
                      <SvgHash className="h-4 w-4" />
                      <span className="line-clamp-1">{result.title}</span>
                    </div>
                  </Command.Item>
                ))}
              </>
            ) : null}
          </Command.List>
        </div>
      </div>
    </Command.Dialog>
  )
}
