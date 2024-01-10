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
import { signOut } from 'next-auth/react'
import { type Session } from 'next-auth'
import { Avatar } from './avatar'
import { usePathname } from 'next/navigation'
import { classNames } from '~/utils/core'

export const ProfileMenu = ({ session }: { session: Session | null }) => {
  const { theme, themes, setTheme } = useTheme()
  const pathname = usePathname()

  const menuItemClasses = ({
    active,
    className,
  }: {
    active: boolean
    className?: string
  }) => {
    return classNames(
      { 'bg-secondary': active },
      className,
      'block w-full text-left px-4 py-2 text-sm text-primary transition-colors',
    )
  }

  return (
    <Menu>
      <MenuButton className="relative inline-flex rounded-full group focus-ring">
        <Avatar name={session!.user.name} src={session!.user.image} size="sm" />
      </MenuButton>

      <MenuItems className="w-48">
        <MenuItemsContent>
          <MenuItem>
            <MenuItemLink
              href={`/profile/${session!.user.id}`}
              className={menuItemClasses({
                active: pathname === `/profile/${session!.user.id}`,
              })}
            >
              Profile
            </MenuItemLink>
          </MenuItem>
          <MenuItem>
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
