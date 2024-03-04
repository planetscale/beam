'use client'

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItemButton,
  MenuItemLink,
  MenuItems,
  MenuItemsContent,
} from './menu'
import { useTheme } from 'next-themes'
import { capitalize } from 'string-ts'
import { signOut, useSession } from 'next-auth/react'
import { Avatar } from './avatar'
import { usePathname } from 'next/navigation'
import { classNames } from '~/utils/core'
import { api } from '~/trpc/react'

export const ProfileMenu = () => {
  const { theme, themes, setTheme } = useTheme()
  const pathname = usePathname()
  const { data: session } = useSession()
  const { data } = api.user.profile.useQuery(
    {
      id: session!.user.id,
    },
    {
      initialData: {
        id: session!.user.id,
        name: session!.user.name,
        title: '',
        image: session!.user.image ?? '',
      },
    },
  )

  const menuItemClasses = ({
    active,
    className,
  }: {
    active?: boolean
    className?: string
  } = {}) => {
    return classNames(
      { 'bg-secondary': active },
      className,
      'block w-full text-left px-4 py-2 text-sm text-primary transition-colors focus:ring-0',
    )
  }

  return (
    <Menu>
      <MenuButton className="relative inline-flex rounded-full group focus-ring">
        <Avatar name={data.name!} src={data.image} size="sm" />
      </MenuButton>

      <MenuItems className="w-48">
        <MenuItemsContent>
          <MenuItem
            className="focus:outline-none focus:bg-secondary transition-colors"
            asChild
          >
            <MenuItemLink
              href={`/profile/${session!.user.id}`}
              className={menuItemClasses({
                active: pathname === `/profile/${session!.user.id}`,
              })}
            >
              Profile
            </MenuItemLink>
          </MenuItem>
          <MenuItem
            className="focus:outline-none focus:bg-secondary transition-colors"
            asChild
          >
            <MenuItemButton onClick={() => signOut()}>Log out</MenuItemButton>
          </MenuItem>
        </MenuItemsContent>
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
      </MenuItems>
    </Menu>
  )
}
