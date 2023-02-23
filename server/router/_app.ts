import { commentRouter } from './comment'
import { postRouter } from './post'
import { userRouter } from './user'
import { router } from '../trpc'

export const appRouter = router({
  comment: commentRouter,
  post: postRouter,
  user: userRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
