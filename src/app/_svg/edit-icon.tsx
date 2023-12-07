import type { SVGProps } from 'react'
const SvgEditIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M11.333 2A1.886 1.886 0 0 1 14 4.667l-9 9-3.667 1 1-3.667z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.333}
    />
  </svg>
)
export default SvgEditIcon
