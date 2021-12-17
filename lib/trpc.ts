import type { AppRouter } from '@/server/routers/_app'
import { createReactQueryHooks } from '@trpc/react'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import superjson from 'superjson'

/**
 * A set of strongly-typed React hooks from your `AppRouter` type signature with `createReactQueryHooks`.
 * @link https://trpc.io/docs/react#3-create-trpc-hooks
 */
export const trpc = createReactQueryHooks<AppRouter>()

export const transformer = superjson

export type TQuery = keyof AppRouter['_def']['queries']

/**
 * This is a helper method to infer the output of a query resolver
 * @example type HelloOutput = inferQueryOutput<'hello'>
 */
export type inferQueryOutput<TRouteKey extends TQuery> = inferProcedureOutput<
  AppRouter['_def']['queries'][TRouteKey]
>

export type InferQueryInput<TRouteKey extends TQuery> = inferProcedureInput<
  AppRouter['_def']['queries'][TRouteKey]
>

export type InferQueryPathAndInput<TRouteKey extends TQuery> = [
  TRouteKey,
  Exclude<InferQueryInput<TRouteKey>, void>
]
