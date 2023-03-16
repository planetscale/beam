import { useRouter } from 'next/router'
import * as React from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { FormState } from 'react-hook-form'

type Props<T> = {
  formState: FormState<T>
  message?: string
}

const defaultMessage = 'Are you sure to leave without saving?'

export function useLeaveConfirm<T>({
  formState,
  message = defaultMessage,
}: Props<T>) {
  const Router = useRouter()

  const { isDirty } = formState

  const onRouteChangeStart = React.useCallback(() => {
    if (isDirty) {
      if (window.confirm(message)) {
        return true
      }
      throw "Abort route change by user's confirmation."
    }
  }, [isDirty, message])

  React.useEffect(() => {
    Router.events.on('routeChangeStart', onRouteChangeStart)

    return () => {
      Router.events.off('routeChangeStart', onRouteChangeStart)
    }
  }, [Router.events, onRouteChangeStart])

  useBeforeunload((event) => {
    if (isDirty) {
      event.preventDefault()
    }
  })

  return
}
