import { Avatar } from '@/components/avatar'
import { ButtonLink } from '@/components/button-link'
import { Footer } from '@/components/footer'
import { IconButton } from '@/components/icon-button'
import { Logo, SearchIcon } from '@/components/icons'
import { SearchDialog } from '@/components/search-dialog'
import { classNames } from '@/lib/classnames'
import { capitalize } from '@/lib/text'
import { Menu, Transition } from '@headlessui/react'
import { signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import Link, { LinkProps } from 'next/link'
import * as React from 'react'

type LayoutProps = {
  children: React.ReactNode
}

function MenuLink({
  href,
  children,
  ...rest
}: Omit<React.ComponentPropsWithoutRef<'a'>, 'href'> & LinkProps) {
  return (
    <Link href={href}>
      <a {...rest}>{children}</a>
    </Link>
  )
}

export function Layout({ children }: LayoutProps) {
  const { theme, themes, setTheme } = useTheme()
  const [isSearchDialogOpen, setIsSearchDialogOpen] = React.useState(false)

  return (
    <div className="max-w-3xl px-6 mx-auto">
      <header className="flex items-center justify-between gap-4 py-20">
        <Link href="/">
          <a>
            <Logo className="w-auto text-red-light h-[34px]" />
          </a>
        </Link>
        <div className="flex items-center gap-4">
          <IconButton
            variant="secondary"
            onClick={() => {
              setIsSearchDialogOpen(true)
            }}
          >
            <SearchIcon className="w-4 h-4" />
          </IconButton>

          <Menu as="div" className="relative inline-flex">
            <Menu.Button className="relative inline-flex group">
              <Avatar
                name="Jason Long"
                src="https://pbs.twimg.com/profile_images/1329913134602199040/_r-DZlub_400x400.jpg"
                size="sm"
              />
              <div className="absolute inset-0 transition-opacity bg-gray-800 rounded-full opacity-0 group-hover:opacity-10" />
            </Menu.Button>

            <Transition
              as={React.Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right border divide-y rounded shadow-lg bg-primary divide-primary w-52 top-full focus:outline-none">
                <div className="py-2">
                  <Menu.Item>
                    {({ active }) => (
                      <MenuLink
                        href={`/profile/1`}
                        className={classNames(
                          active && 'bg-secondary',
                          'block px-4 py-2 text-sm text-primary transition-colors'
                        )}
                      >
                        Profile
                      </MenuLink>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        className={classNames(
                          active && 'bg-secondary',
                          'block w-full text-left px-4 py-2 text-sm text-primary transition-colors'
                        )}
                        onClick={() => signOut()}
                      >
                        Log out
                      </button>
                    )}
                  </Menu.Item>
                </div>
                <div className="flex items-center gap-4 px-4 py-3 rounded-b bg-secondary">
                  <label htmlFor="theme" className="text-sm">
                    Theme
                  </label>
                  <select
                    id="theme"
                    name="theme"
                    value={theme}
                    onChange={(event) => {
                      setTheme(event.target.value)
                    }}
                    className="block w-full py-1.5 text-xs border rounded shadow-sm bg-primary border-secondary"
                  >
                    {themes.map((theme) => (
                      <option key={theme} value={theme}>
                        {capitalize(theme)}
                      </option>
                    ))}
                  </select>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

          <ButtonLink href="/new-post">New Post</ButtonLink>
        </div>
      </header>

      <main>{children}</main>

      <Footer />

      <SearchDialog
        isOpen={isSearchDialogOpen}
        onClose={() => {
          setIsSearchDialogOpen(false)
        }}
      />
    </div>
  )
}
