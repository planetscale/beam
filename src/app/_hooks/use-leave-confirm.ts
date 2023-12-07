import { type FieldValues, type FormState } from 'react-hook-form'
import { useEffect } from 'react'
import { useBeforeunload } from 'react-beforeunload'

type Props<T extends FieldValues> = {
  formState: FormState<T>
  message?: string
}

const defaultMessage = 'Are you sure to leave without saving?'

export const useLeaveConfirm = <T extends FieldValues>({
  formState,
  message = defaultMessage,
}: Props<T>) => {
  const { isDirty } = formState
}
