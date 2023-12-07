import * as Select from '@radix-ui/react-select'

type SuggestionResult = {
  label: string
  value: string
}

type SuggestionListProps = {
  suggestions: SuggestionResult[]
  onValueChange: (value: SuggestionResult) => void
} & Omit<Select.SelectProps, 'onValueChange'>

export const SuggestionListSelect = ({
  suggestions,
  open,
  onValueChange,
  ...props
}: SuggestionListProps) => {
  const handleValueChange = (value: string) => {
    const suggestion = suggestions.find((suggestion) => {
      return suggestion.value === value
    })
    if (suggestion) {
      onValueChange(suggestion)
    }
  }
  return (
    <Select.Root
      defaultOpen
      onValueChange={handleValueChange}
      open={open}
      {...props}
    >
      <Select.Content>
        <Select.Viewport className="absolute divide-y divide-primary w-56 max-h-[286px] border rounded shadow-lg bg-primary overflow-y-auto">
          {suggestions.map((suggestion) => {
            return (
              <Select.Item
                key={suggestion.value}
                value={suggestion.value}
                className="px-4 py-2 text-sm text-left transition-colors cursor-pointer radix-highlighted:bg-blue-600 radix-highlighted:text-white outline-none"
              >
                {suggestion.label}
              </Select.Item>
            )
          })}
        </Select.Viewport>
      </Select.Content>
    </Select.Root>
  )
}
