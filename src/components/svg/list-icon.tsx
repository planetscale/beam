import type { SVGProps } from 'react'
const SvgListIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M5.333 4H14M5.333 8H14m-8.667 4H14M2 4h.007M2 8h.007M2 12h.007"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.333}
    />
  </svg>
)
export default SvgListIcon
