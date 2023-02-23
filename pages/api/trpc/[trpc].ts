import { appRouter } from '@/server/router/_app'
import { createContext } from '@/server/context'
import { createNextApiHandler } from '@trpc/server/adapters/next'

export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      // send to bug reporting
      console.error('Something went wrong', error)
    }
  },
  batching: {
    enabled: true,
  },
})
