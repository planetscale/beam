import type { SVGProps } from 'react'
const SvgMarkdownIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={26}
    height={16}
    fill="none"
    viewBox="0 0 26 16"
    {...props}
  >
    <g clipPath="url(#clip0_33_726)">
      <path
        stroke="currentColor"
        d="M24.125.625H1.875c-.69 0-1.25.56-1.25 1.25v12.25c0 .69.56 1.25 1.25 1.25h22.25c.69 0 1.25-.56 1.25-1.25V1.875c0-.69-.56-1.25-1.25-1.25z"
        strokeWidth={1.298}
      />
      <path
        fill="currentColor"
        d="M3.75 12.25v-8.5h2.5l2.5 3.125 2.5-3.125h2.5v8.5h-2.5V7.375L8.75 10.5l-2.5-3.125v4.875zm15.625 0-3.75-4.125h2.5V3.75h2.5v4.375h2.5z"
      />
    </g>
    <defs>
      <clipPath id="clip0_33_726">
        <path fill="#fff" d="M0 0h26v16H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgMarkdownIcon
