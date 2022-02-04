import { HtmlView } from '@/components/html-view'
import { BoldIcon, ItalicIcon, LinkIcon, ListIcon } from '@/components/icons'
import { classNames } from '@/lib/classnames'
import {
  getMentionData,
  handleUploadImages,
  markdownToHtml,
} from '@/lib/editor'
import { InferQueryOutput, trpc } from '@/lib/trpc'
import { Switch } from '@headlessui/react'
import * as React from 'react'
import { useDetectClickOutside } from 'react-detect-click-outside'
import TextareaAutosize, {
  TextareaAutosizeProps,
} from 'react-textarea-autosize'
import getCaretCoordinates from 'textarea-caret'
import TextareaMarkdown, { TextareaMarkdownRef } from 'textarea-markdown-editor'
import { ItemOptions, useItemList } from 'use-item-list'

type MarkdownEditorProps = {
  label?: string
  value: string
  onChange: (value: string) => void
} & Omit<TextareaAutosizeProps, 'value' | 'onChange'>

type MentionPosition = {
  top: number
  left: number
}

type MentionUser = {
  id: string
  name: string
}

type MentionState = {
  isOpen: boolean
  position: MentionPosition | null
  triggerIdx: number | null
  query: string
}

type MentionActionType =
  | {
      type: 'open'
      payload: {
        position: MentionPosition
        triggerIdx: number
        query: string
      }
    }
  | { type: 'close' }
  | { type: 'updateQuery'; payload: string }

function mentionReducer(state: MentionState, action: MentionActionType) {
  switch (action.type) {
    case 'open':
      return {
        isOpen: true,
        position: action.payload.position,
        triggerIdx: action.payload.triggerIdx,
        query: action.payload.query,
      }
    case 'close':
      return { isOpen: false, position: null, triggerIdx: null, query: '' }
    case 'updateQuery':
      return { ...state, query: action.payload }
    default:
      throw new Error()
  }
}

const TOOLBAR_ITEMS = [
  {
    commandTrigger: 'bold',
    icon: <BoldIcon className="w-4 h-4" />,
    name: 'Bold',
  },
  {
    commandTrigger: 'italic',
    icon: <ItalicIcon className="w-4 h-4" />,
    name: 'Italic',
  },
  {
    commandTrigger: 'unordered-list',
    icon: <ListIcon className="w-4 h-4" />,
    name: 'Unordered List',
  },
  {
    commandTrigger: 'link',
    icon: <LinkIcon className="w-4 h-4" />,
    name: 'Link',
  },
]

function MarkdownPreview({ markdown }: { markdown: string }) {
  return (
    <div className="pb-6 mt-8 border-b">
      {markdown ? (
        <HtmlView html={markdownToHtml(markdown)} />
      ) : (
        <p>Nothing to preview</p>
      )}
    </div>
  )
}

export function MarkdownEditor({
  label,
  value,
  minRows = 15,
  onChange,
  ...rest
}: MarkdownEditorProps) {
  const textareaMarkdownRef = React.useRef<TextareaMarkdownRef>(null)
  const [showPreview, setShowPreview] = React.useState(false)
  const [mentionState, mentionDispatch] = React.useReducer(mentionReducer, {
    isOpen: false,
    position: null,
    triggerIdx: null,
    query: '',
  })

  function closeMention() {
    mentionDispatch({ type: 'close' })
  }

  return (
    <div>
      {label && <label className="block mb-2 font-semibold">{label}</label>}
      <div>
        <div className="flex items-center justify-between gap-4 px-4 py-px border rounded bg-primary">
          <div className="flex gap-2 -ml-2">
            {TOOLBAR_ITEMS.map((toolbarItem) => (
              <button
                key={toolbarItem.commandTrigger}
                type="button"
                onClick={() => {
                  textareaMarkdownRef.current?.trigger(
                    toolbarItem.commandTrigger
                  )
                }}
                className={classNames(
                  'rounded inline-flex items-center justify-center h-8 w-8 disabled:opacity-50 disabled:cursor-default focus:border focus-ring',
                  !showPreview && 'transition-colors hover:text-blue'
                )}
                disabled={showPreview}
                title={toolbarItem.name}
              >
                {toolbarItem.icon}
              </button>
            ))}
          </div>

          <Switch.Group as="div" className="flex items-center">
            <Switch
              checked={showPreview}
              onChange={(value) => {
                if (value === false) {
                  textareaMarkdownRef.current?.focus()
                }
                setShowPreview(value)
              }}
              className={classNames(
                showPreview ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700',
                'relative inline-flex flex-shrink-0 items-center h-[18px] w-8 rounded-full transition-colors ease-in-out duration-200 focus-ring'
              )}
            >
              <span
                className={classNames(
                  showPreview ? 'translate-x-4' : 'translate-x-0.5',
                  'inline-block w-3.5 h-3.5 transform bg-white dark:bg-gray-100 rounded-full transition-transform ease-in-out duration-200'
                )}
              />
            </Switch>
            <Switch.Label
              as="span"
              className="ml-2 text-xs cursor-pointer select-none"
            >
              Preview
            </Switch.Label>
          </Switch.Group>
        </div>

        <div className={classNames('mt-2 relative', showPreview && 'sr-only')}>
          <TextareaMarkdown.Wrapper
            ref={textareaMarkdownRef}
            commands={[
              {
                name: 'indent',
                enable: false,
              },
            ]}
          >
            <TextareaAutosize
              {...rest}
              value={value}
              onChange={(event) => onChange(event.target.value)}
              onInput={(event) => {
                const { keystrokeTriggered, triggerIdx, query } =
                  getMentionData(event.currentTarget)

                if (!keystrokeTriggered) {
                  if (mentionState.isOpen) {
                    closeMention()
                  }
                  return
                }

                if (mentionState.isOpen) {
                  mentionDispatch({ type: 'updateQuery', payload: query })
                } else {
                  const coords = getCaretCoordinates(
                    event.currentTarget,
                    triggerIdx + 1
                  )
                  mentionDispatch({
                    type: 'open',
                    payload: {
                      position: {
                        top: coords.top + coords.height,
                        left: coords.left,
                      },
                      triggerIdx,
                      query,
                    },
                  })
                }
              }}
              onPaste={(event) => {
                const filesArray = Array.from(event.clipboardData.files)

                if (filesArray.length === 0) {
                  return
                }

                const imageFiles = filesArray.filter((file) =>
                  /image/i.test(file.type)
                )

                if (imageFiles.length === 0) {
                  return
                }

                event.preventDefault()

                handleUploadImages(event.currentTarget, imageFiles)
              }}
              onDrop={(event) => {
                const filesArray = Array.from(event.dataTransfer.files)

                if (filesArray.length === 0) {
                  return
                }

                const imageFiles = filesArray.filter((file) =>
                  /image/i.test(file.type)
                )

                if (imageFiles.length === 0) {
                  return
                }

                event.preventDefault()

                handleUploadImages(event.currentTarget, imageFiles)
              }}
              className="block w-full rounded shadow-sm bg-secondary border-secondary focus-ring"
              minRows={minRows}
            />
          </TextareaMarkdown.Wrapper>

          <Mention
            state={mentionState}
            onSelect={(user: MentionUser) => {
              const preMention = value.slice(0, mentionState.triggerIdx!)
              const postMention = value.slice(
                textareaMarkdownRef.current?.selectionStart
              )
              const newValue = `${preMention}[${user.name}](/profile/${user.id}) ${postMention}`

              onChange(newValue)
              closeMention()

              setTimeout(() => {
                const caretPosition = newValue.length - postMention.length

                textareaMarkdownRef.current?.focus()
                textareaMarkdownRef.current?.setSelectionRange(
                  caretPosition,
                  caretPosition
                )
              }, 0)
            }}
            onClose={closeMention}
          />
        </div>

        {showPreview && <MarkdownPreview markdown={value} />}
      </div>
    </div>
  )
}

function Mention({
  state,
  onSelect,
  onClose,
}: {
  state: MentionState
  onSelect: (user: MentionUser) => void
  onClose: () => void
}) {
  const mentionListQuery = trpc.useQuery(['user.mentionList'])

  const mentionList = mentionListQuery.data
    ? state.query === ''
      ? mentionListQuery.data
      : mentionListQuery.data.filter((user) =>
          user.name!.toLowerCase().includes(state.query.toLowerCase())
        )
    : []

  if (!state.isOpen || !state.position || mentionList.length === 0) {
    return null
  }

  return (
    <MentionList
      mentionList={mentionList}
      position={state.position}
      onSelect={onSelect}
      onClose={onClose}
    />
  )
}

function MentionList({
  mentionList,
  position,
  onSelect,
  onClose,
}: {
  mentionList: InferQueryOutput<'user.mentionList'>
  position: MentionPosition
  onSelect: (user: MentionUser) => void
  onClose: () => void
}) {
  const ref = useDetectClickOutside({ onTriggered: onClose })

  const { moveHighlightedItem, selectHighlightedItem, useItem } = useItemList({
    onSelect: (item) => {
      onSelect(item.value)
    },
  })

  React.useEffect(() => {
    function handleKeydownEvent(event: KeyboardEvent) {
      const { code } = event

      const preventDefaultCodes = ['ArrowUp', 'ArrowDown', 'Enter', 'Tab']

      if (preventDefaultCodes.includes(code)) {
        event.preventDefault()
      }

      if (code === 'ArrowUp') {
        moveHighlightedItem(-1)
      }

      if (code === 'ArrowDown') {
        moveHighlightedItem(1)
      }

      if (code === 'Enter' || code === 'Tab') {
        selectHighlightedItem()
      }
    }

    document.addEventListener('keydown', handleKeydownEvent)
    return () => {
      document.removeEventListener('keydown', handleKeydownEvent)
    }
  }, [moveHighlightedItem, selectHighlightedItem])

  return (
    <div
      ref={ref}
      className="absolute w-48 max-h-[286px] border rounded shadow-lg bg-primary overflow-y-auto"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <ul role="listbox" className="divide-y divide-primary">
        {mentionList.map((user) => (
          <MentionItem
            key={user.name}
            useItem={useItem}
            user={{ id: user.id, name: user.name! }}
          />
        ))}
      </ul>
    </div>
  )
}
function MentionItem({
  useItem,
  user,
}: {
  useItem: ({ ref, text, value, disabled }: ItemOptions) => {
    id: string
    index: number
    highlight: () => void
    select: () => void
    selected: any
    useHighlighted: () => Boolean
  }
  user: MentionUser
}) {
  const ref = React.useRef<HTMLLIElement>(null)
  const { id, index, highlight, select, useHighlighted } = useItem({
    ref,
    value: user,
  })
  const highlighted = useHighlighted()

  return (
    <li
      ref={ref}
      id={id}
      onMouseEnter={highlight}
      onClick={select}
      role="option"
      aria-selected={highlighted ? 'true' : 'false'}
      className={classNames(
        'px-4 py-2 text-sm text-left transition-colors cursor-pointer ',
        highlighted ? 'bg-blue-600 text-white' : 'text-primary'
      )}
    >
      {user.name}
    </li>
  )
}
