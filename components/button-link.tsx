import { buttonClasses, ButtonVariant } from '@/components/button'
import Link, { LinkProps } from 'next/link'
import * as React from 'react'

type ButtonLinkProps = {
  variant?: ButtonVariant
} & Omit<React.ComponentPropsWithoutRef<'a'>, 'href'> &
  LinkProps

export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      href,
      as,
      replace,
      scroll,
      shallow,
      passHref,
      prefetch,
      locale,
      className,
      variant = 'primary',
      ...rest
    },
    forwardedRef
  ) => {
    return (
      <Link
        href={href}
        as={as}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        passHref={passHref}
        prefetch={prefetch}
        locale={locale}
      >
        <a
          {...rest}
          ref={forwardedRef}
          className={buttonClasses({ className, variant })}
        />
      </Link>
    )
  }
)

ButtonLink.displayName = 'ButtonLink'
