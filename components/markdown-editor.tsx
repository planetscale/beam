import { HtmlView } from '@/components/html-view'
import { BoldIcon, ItalicIcon, LinkIcon, ListIcon } from '@/components/icons'
import { classNames } from '@/lib/classnames'
import { handleUploadImages, markdownToHtml } from '@/lib/editor'
import { Switch } from '@headlessui/react'
import * as React from 'react'
import TextareaAutosize, {
  TextareaAutosizeProps,
} from 'react-textarea-autosize'
import TextareaMarkdown, { TextareaMarkdownRef } from 'textarea-markdown-editor'

type MarkdownEditorProps = {
  label?: string
  value: string
  onChange: (value: string) => void
} & Omit<TextareaAutosizeProps, 'value' | 'onChange'>

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
  const ref = React.useRef<TextareaMarkdownRef>(null)
  const [showPreview, setShowPreview] = React.useState(false)

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
                  ref.current?.trigger(toolbarItem.commandTrigger)
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
                  ref.current?.focus()
                }
                setShowPreview(value)
              }}
              className={classNames(
                showPreview ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700',
                'relative inline-flex flex-shrink-0 items-center h-[18px] w-8 rounded-full transition-colors ease-in-out duration-200 focus-ring focus:border'
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

        <div className={classNames('mt-2', showPreview && 'sr-only')}>
          <TextareaMarkdown.Wrapper ref={ref}>
            <TextareaAutosize
              {...rest}
              value={value}
              onChange={(event) => onChange(event.target.value)}
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
        </div>

        {showPreview && <MarkdownPreview markdown={value} />}
      </div>
    </div>
  )
}
