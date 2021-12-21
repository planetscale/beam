import { classNames } from '@/lib/classnames'

type HtmlViewProps = {
  html: string
  className?: string
}

export function HtmlView({ html, className }: HtmlViewProps) {
  return (
    <div
      className={classNames('prose max-w-none', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
