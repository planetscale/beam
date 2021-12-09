import { Avatar } from '@/components/avatar'
import { EditProfileDialog } from '@/components/edit-profile-dialog'
import { IconButton } from '@/components/icon-button'
import { EditIcon } from '@/components/icons'
import { Layout } from '@/components/layout'
import type { PostSummaryProps } from '@/components/post-summary'
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import * as React from 'react'

const PostSummary = dynamic<PostSummaryProps>(
  () => import('@/components/post-summary').then((mod) => mod.PostSummary),
  { ssr: false }
)

const profile = {
  id: '1',
  name: 'Jason Long',
  title: 'Designerd',
  avatarUrl:
    'https://pbs.twimg.com/profile_images/1329913134602199040/_r-DZlub_400x400.jpg',
  posts: [
    {
      id: '1',
      title: 'We shipped a thing!',
      author: {
        id: '1',
        name: 'Jason Long',
        avatarUrl:
          'https://pbs.twimg.com/profile_images/1329913134602199040/_r-DZlub_400x400.jpg',
      },
      createdAt: new Date('2021/11/24'),
      content:
        '<p>This is the first few lines of the post right here. We could do something like the first four lines or so? And we could show the rendered Markdown version with <strong>bold</strong> and <em>italic</em> text and so on. If the post is longer than this preview snippet, we show a link below to continue to the full post.</p><p>Bacon ipsum dolor amet beef hamburger landjaeger corned beef t-bone prosciutto. Ham hock pastrami ham pork chop prosciutto capicola bacon alcatra turducken ribeye sausage landjaeger chicken. Cow porchetta pork tenderloin chislic bresaola. Turducken meatball ham hock hamburger sausage shank, capicola pork chop.</p>',
      likeCount: 17,
      commentCount: 5,
    },
    {
      id: '2',
      title: 'Here’s a post where I “liked” it',
      author: {
        id: '1',
        name: 'Jason Long',
        avatarUrl:
          'https://pbs.twimg.com/profile_images/1329913134602199040/_r-DZlub_400x400.jpg',
      },
      createdAt: new Date('2021/11/23'),
      content:
        '<p>Here is a shorter post and it shows the upvote/like state. These are just placeholder icons for now, but this is the general idea. The post is only this long, so no need for a continue reading link. The title above and comment button would take you to the post page.</p>',
      likeCount: 3,
      commentCount: 1,
    },
  ],
}

const ProfilePage: NextPage = () => {
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] =
    React.useState(false)

  return (
    <Layout>
      <Head>
        <title>{profile.name} - Flux</title>
      </Head>

      <div className="relative flex items-center gap-4 py-8 overflow-hidden">
        <div className="flex items-center gap-8">
          <Avatar name={profile.name} src={profile.avatarUrl} size="lg" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">
              {profile.name}
            </h1>
            <p className="text-lg tracking-tight text-secondary">
              {profile.title}
            </p>
          </div>
        </div>

        <div className="ml-auto mr-10">
          <IconButton
            variant="secondary"
            onClick={() => {
              setIsEditProfileDialogOpen(true)
            }}
          >
            <EditIcon className="w-4 h-4" />
          </IconButton>
        </div>

        <svg
          className="absolute inset-0 -z-1"
          width={720}
          height={240}
          fill="none"
          viewBox="0 0 720 240"
        >
          <defs>
            <pattern
              id="dots-pattern"
              x={0}
              y={0}
              width={31.5}
              height={31.5}
              patternUnits="userSpaceOnUse"
            >
              <rect
                x={0}
                y={0}
                width={3}
                height={3}
                className="text-gray-100 dark:text-gray-700"
                fill="currentColor"
              />
            </pattern>
          </defs>
          <rect width={720} height={240} fill="url(#dots-pattern)" />
        </svg>
      </div>

      <div className="flow-root mt-28">
        <ul className="-my-12 divide-y divide-primary">
          {profile.posts.map((post) => (
            <li key={post.id} className="py-12">
              <PostSummary post={post} hideAuthor />
            </li>
          ))}
        </ul>
      </div>

      <EditProfileDialog
        user={profile}
        isOpen={isEditProfileDialogOpen}
        onClose={() => {
          setIsEditProfileDialogOpen(false)
        }}
      />
    </Layout>
  )
}

export default ProfilePage
