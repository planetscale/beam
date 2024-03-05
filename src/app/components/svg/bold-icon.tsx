import type { SVGProps } from 'react'
const SvgBoldIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M4 2.667h5.333a2.667 2.667 0 1 1 0 5.333H4z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.333}
    />
    <path
      stroke="currentColor"
      d="M4 8h6a2.667 2.667 0 0 1 0 5.333H4z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.333}
    />
  </svg>
)
export default SvgBoldIcon
