import { Button } from '@/components/button'
import { Layout } from '@/components/layout'
import type { PostSummaryProps } from '@/components/post-summary'
import { withSession } from '@/lib/auth'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import Head from 'next/head'

const PostSummary = dynamic<PostSummaryProps>(
  () => import('@/components/post-summary').then((mod) => mod.PostSummary),
  { ssr: false }
)

const POSTS = [
  {
    id: '1',
    title: 'We shipped a thing!',
    author: {
      id: '1',
      name: 'Steve Ruiz',
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
      name: 'Bogdan Soare',
      avatarUrl:
        'https://pbs.twimg.com/profile_images/1028943463209943040/EtBuwo-A_400x400.jpg',
    },
    createdAt: new Date('2021/11/23'),
    content:
      '<p>Here is a shorter post and it shows the upvote/like state. These are just placeholder icons for now, but this is the general idea. The post is only this long, so no need for a continue reading link. The title above and comment button would take you to the post page.</p>',
    likeCount: 3,
    commentCount: 1,
  },
  {
    id: '3',
    title:
      'Crowdfunding MVP iteration mass market partnership with very long title',
    author: {
      id: '2',
      name: 'Jason Long',
      avatarUrl:
        'https://pbs.twimg.com/profile_images/1329913134602199040/_r-DZlub_400x400.jpg',
    },
    createdAt: new Date('2021/11/12'),
    content:
      '<p>Equity user experience partner network iPhone customer vesting period interaction design lean startup branding virality technology. Market stealth investor termsheet creative holy grail.</p>',
    likeCount: 99,
    commentCount: 1,
  },
]

const Home: NextPage = () => {
  const { status } = useSession()

  return (
    <Layout>
      <Head>
        <title>Flux</title>
      </Head>

      <div className="flow-root">
        <ul className="-my-12 divide-y divide-primary">
          {POSTS.map((post) => (
            <li key={post.id} className="py-12">
              <PostSummary post={post} />
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-center gap-4 mt-12">
        <Button variant="secondary" disabled>
          Previous
        </Button>
        <Button variant="secondary">Next</Button>
      </div>
    </Layout>
  )
}

export const getServerSideProps = withSession(async ({ req }) => {
  // if (!req.session?.user) {
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: '/sign-in',
  //     },
  //   }
  // }

  return {
    props: {
      session: req.session,
    },
  }
})

export default Home
