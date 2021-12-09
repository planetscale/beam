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

export type User = {
  id: string
  name: string
  avatarUrl?: string
  title?: string
}
