import type { AppRouter } from '@/server/routers/_app'
import { createReactQueryHooks } from '@trpc/react'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import superjson from 'superjson'

export const trpc = createReactQueryHooks<AppRouter>()

export const transformer = superjson

export type TQuery = keyof AppRouter['_def']['queries']

export type InferQueryOutput<TRouteKey extends TQuery> = inferProcedureOutput<
  AppRouter['_def']['queries'][TRouteKey]
>

export type InferQueryInput<TRouteKey extends TQuery> = inferProcedureInput<
  AppRouter['_def']['queries'][TRouteKey]
>

export type InferQueryPathAndInput<TRouteKey extends TQuery> = [
  TRouteKey,
  Exclude<InferQueryInput<TRouteKey>, void>
]
