import { AuthorWithDate } from '@/components/author-with-date'
import { Avatar } from '@/components/avatar'
import { Banner } from '@/components/banner'
import { Button } from '@/components/button'
import { ButtonLink } from '@/components/button-link'
import { IconButton } from '@/components/icon-button'
import { EditIcon, HeartIcon, MessageIcon, TrashIcon } from '@/components/icons'
import { Layout } from '@/components/layout'
import { Textarea } from '@/components/textarea'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

const post = {
  id: '1',
  title: 'We shipped a thing!',
  author: {
    id: '1',
    name: 'Bogdan Soare',
    avatarUrl:
      'https://pbs.twimg.com/profile_images/1028943463209943040/EtBuwo-A_400x400.jpg',
  },
  createdAt: new Date('2021/11/24'),
  content:
    '<p>This is the first few lines of the post right here. We could do something like the first four lines or so? And we could show the rendered Markdown version with <strong>bold</strong> and <em>italic</em> text and so on. If the post is longer than this preview snippet, we show a link below to continue to the full post.</p><h3>Some section heading</h3><p>Bacon ipsum dolor amet beef hamburger landjaeger corned beef t-bone prosciutto. Ham hock pastrami ham pork chop prosciutto capicola bacon alcatra turducken ribeye sausage landjaeger chicken. Cow porchetta pork tenderloin chislic bresaola. Turducken meatball ham hock hamburger sausage shank, capicola pork chop.</p><img src="https://images.unsplash.com/photo-1613203713329-b2e39e14c266?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2370&q=80" /><p>Bacon ipsum dolor amet beef hamburger landjaeger corned beef t-bone prosciutto. Ham hock pastrami ham pork chop prosciutto capicola bacon alcatra turducken ribeye sausage landjaeger chicken. Cow porchetta pork tenderloin chislic bresaola. Turducken meatball ham hock hamburger sausage shank, capicola pork chop.</p>',
  likeCount: 17,
  commentCount: 5,
  comments: [
    {
      id: '1',
      content:
        'Bacon ipsum dolor amet beef hamburger landjaeger corned beef t-bone prosciutto. Ham hock pastrami ham pork chop prosciutto capicola bacon alcatra turducken ribeye sausage landjaeger chicken. Cow porchetta pork tenderloin chislic bresaola. Turducken meatball ham hock hamburger sausage shank, capicola pork chop.',
      createdAt: new Date('2021/11/24'),
      author: {
        id: '2',
        name: 'Jason Long',
        avatarUrl:
          'https://pbs.twimg.com/profile_images/1329913134602199040/_r-DZlub_400x400.jpg',
      },
    },
    {
      id: '2',
      content:
        'Bacon ipsum dolor amet beef hamburger landjaeger corned beef t-bone prosciutto. Ham hock pastrami ham pork chop prosciutto capicola bacon.',
      createdAt: new Date('2021/11/25'),
      author: {
        id: '1',
        name: 'Bogdan Soare',
        avatarUrl:
          'https://pbs.twimg.com/profile_images/1028943463209943040/EtBuwo-A_400x400.jpg',
      },
    },
  ],
}

const PostPage: NextPage = () => {
  const router = useRouter()

  return (
    <Layout>
      <Head>
        <title>{post.title} - Flux</title>
      </Head>

      <div className="divide-y divide-primary">
        <div className="pb-12">
          <Banner className="mb-6">
            This post has been hidden and is only visible to administrators.
          </Banner>

          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
            <div className="flex gap-4">
              <IconButton
                variant="secondary"
                onClick={() => {
                  router.push(`/post/${post.id}/edit`)
                }}
              >
                <EditIcon className="w-4 h-4" />
              </IconButton>
              <IconButton variant="secondary">
                <TrashIcon className="w-4 h-4 text-red" />
              </IconButton>
            </div>
          </div>
          <div className="mt-6 ">
            <AuthorWithDate author={post.author} date={post.createdAt} />
          </div>
          <div
            className="mt-6 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className="flex gap-4 mt-6">
            <Button variant="secondary">
              <HeartIcon className="w-4 h-4 text-red" />
              <span className="ml-1.5">{post.likeCount}</span>
            </Button>
            <ButtonLink href={`/post/${post.id}#comments`} variant="secondary">
              <MessageIcon className="w-4 h-4 text-secondary" />
              <span className="ml-1.5">{post.commentCount}</span>
            </ButtonLink>
          </div>
        </div>

        <div id="comments" className="pt-12 space-y-12">
          {post.comments.length > 0 && (
            <ul className="space-y-12">
              {post.comments.map((comment) => (
                <li key={comment.id}>
                  <AuthorWithDate
                    author={comment.author}
                    date={comment.createdAt}
                  />
                  <div className="pl-16 mt-4">
                    <p>{comment.content}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="flex items-start gap-4">
            <Avatar
              name="Jason"
              src="https://pbs.twimg.com/profile_images/1329913134602199040/_r-DZlub_400x400.jpg"
            />
            <form className="flex-1">
              <Textarea placeholder="Comment" rows={4} required />
              <div className="mt-4">
                <Button type="submit">Add comment</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default PostPage
