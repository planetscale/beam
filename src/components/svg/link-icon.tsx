import type { SVGProps } from 'react'
const SvgLinkIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      stroke="currentColor"
      d="M6.667 8.667a3.333 3.333 0 0 0 5.026.36l2-2A3.334 3.334 0 0 0 8.98 2.313l-1.147 1.14"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.333}
    />
    <path
      stroke="currentColor"
      d="M9.333 7.333a3.334 3.334 0 0 0-5.026-.36l-2 2a3.333 3.333 0 0 0 4.713 4.714l1.14-1.14"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.333}
    />
  </svg>
)
export default SvgLinkIcon
