import Link from 'next/link'
import Logo from '~/components/svg/logo'

import { Actions } from '~/components/actions'

export const Header = async () => {
  return (
    <header className="flex items-center justify-between gap-4 py-12 md:py-20">
      <Link href="/" aria-label="Go to homepage">
        <Logo className="w-auto text-red-light h-[34px]" />
      </Link>
      <Actions />
    </header>
  )
}
