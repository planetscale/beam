'use client'

import { useState } from 'react'
import { Command } from 'cmdk'
import { useHotkeys } from 'react-hotkeys-hook'
import { useRouter } from 'next/navigation'
import { useDebounce } from 'use-debounce'
import { api } from '~/trpc/react'
import SearchIcon from '../_svg/search-icon'
import SpinnerIcon from '../_svg/spinner'
import { useSearchStore } from '~/app/_hooks/use-search-store'

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
          {data?.length ? (
            <Command.List className="max-h-[286px] border-t overflow-y-auto w-full">
              {data?.map((result) => (
                <Command.Item
                  className="w-full block py-3.5 pl-10 pr-3 leading-tight data-[selected=true]:bg-blue-600 data-[selected=true]:text-white"
                  onSelect={() => {
                    toggleOpen()
                    router.push(`/post/${result.id}`)
                  }}
                  value={result.title}
                >
                  {result.title}
                </Command.Item>
              ))}
            </Command.List>
          ) : null}
        </div>
      </div>
    </Command.Dialog>
  )
}
