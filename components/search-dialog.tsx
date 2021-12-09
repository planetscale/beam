import { SearchIcon } from '@/components/icons'
import { classNames } from '@/lib/classnames'
import { Dialog, Transition } from '@headlessui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'
import { ItemOptions, useItemList } from 'use-item-list'

type SearchDialogProps = {
  isOpen: boolean
  onClose: () => void
}

const results = [
  'We shipped a thing',
  'Another result',
  'IPhone growth hacking',
  'Facebook gen-z ownership monetization strategy channels',
  'Early adopters strategy return',
  'Low hanging fruit iPad focus ',
  'MVP marketing early adopters seed',
]

function SearchResult({
  useItem,
  result,
}: {
  useItem: ({ ref, text, value, disabled }: ItemOptions) => {
    id: string
    index: number
    highlight: () => void
    select: () => void
    selected: any
    useHighlighted: () => Boolean
  }
  result: string
}) {
  const ref = React.useRef<HTMLLIElement>(null)
  const { id, index, highlight, select, useHighlighted } = useItem({
    ref,
    value: result,
  })
  const highlighted = useHighlighted()

  return (
    <li ref={ref} id={id} onMouseEnter={highlight} onClick={select}>
      <Link href={`/post/${result}`}>
        <a
          className={classNames(
            'block py-3.5 pl-10 pr-3 transition-colors leading-tight',
            highlighted && 'bg-blue-600 text-white'
          )}
        >
          {result}
        </a>
      </Link>
    </li>
  )
}

function SearchField({ onSelect }: { onSelect: () => void }) {
  const [value, setValue] = React.useState('')
  const router = useRouter()

  const { moveHighlightedItem, selectHighlightedItem, useItem } = useItemList({
    onSelect: (item) => {
      router.push(`/post/${item.value}`)
      onSelect()
    },
  })

  React.useEffect(() => {
    function handleKeydownEvent(event: KeyboardEvent) {
      const { code } = event

      if (code === 'ArrowUp' || code === 'ArrowDown' || code === 'Enter') {
        event.preventDefault()
      }

      if (code === 'ArrowUp') {
        moveHighlightedItem(-1)
      }

      if (code === 'ArrowDown') {
        moveHighlightedItem(1)
      }

      if (code === 'Enter') {
        selectHighlightedItem()
      }
    }

    document.addEventListener('keydown', handleKeydownEvent)
    return () => {
      document.removeEventListener('keydown', handleKeydownEvent)
    }
  }, [moveHighlightedItem, selectHighlightedItem, router])

  return (
    <div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <SearchIcon className="w-4 h-4" aria-hidden="true" />
        </div>
        <input
          type="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="Search"
          className="block w-full py-3 pl-10 bg-transparent border-0 focus:ring-0"
          role="combobox"
          aria-controls="search-results"
          aria-expanded={true}
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
          }}
        />
      </div>
      {value && (
        <ul
          id="search-results"
          role="listbox"
          className="max-h-[286px] border-t overflow-y-auto"
        >
          {results.map((result) => (
            <SearchResult key={result} useItem={useItem} result={result} />
          ))}
        </ul>
      )}
    </div>
  )
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
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
            <div className="inline-block w-full max-w-md mt-[10vh] mb-8 overflow-hidden text-left align-middle transition-all transform bg-primary rounded-lg shadow-xl dark:border">
              {isOpen && <SearchField onSelect={onClose} />}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
