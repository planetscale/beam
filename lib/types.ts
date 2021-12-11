import { User } from '@prisma/client'
import type { NextPage } from 'next'
import * as React from 'react'

export type NextPageWithAuthAndLayout = NextPage & {
  auth?: boolean
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

export type Post = {
  id: string
  title: string
  author: User
  createdAt: Date
  content: string
  likeCount: number
  commentCount: number
  comments?: {
    id: string
    content: string
    createdAt: Date
    author: User
  }
}

export type Author = Pick<User, 'id' | 'name' | 'image'>
