import Link from 'next/link'
import Logo from '../_svg/logo'
import { getServerAuthSession } from '~/server/auth'

import { Actions } from './actions'

export const Header = async () => {
  const session = await getServerAuthSession()
  return (
    <header className="flex items-center justify-between gap-4 py-12 md:py-20">
      <Link href="/" aria-label="Go to homepage">
        <Logo className="w-auto text-red-light h-[34px]" />
      </Link>
      <Actions session={session} />
    </header>
  )
}
