import { type FieldValues, type FormState } from 'react-hook-form'
import { useEffect } from 'react'

type UseLeaveConfirmProps<T extends FieldValues> = {
  formState: FormState<T>
  message?: string
}

const defaultMessage = 'Are you sure to leave without saving?'

export const useLeaveConfirm = <T extends FieldValues>({
  formState,
  message = defaultMessage,
}: UseLeaveConfirmProps<T>) => {
  const { isDirty } = formState

  useEffect(() => {
    function beforeUnload(e: BeforeUnloadEvent) {
      if (!isDirty) return
      window.confirm(message)
      e.preventDefault()
    }

    window.addEventListener('beforeunload', beforeUnload)

    return () => {
      window.removeEventListener('beforeunload', beforeUnload)
    }
  }, [isDirty])
}
