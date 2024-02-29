import type { SVGProps } from 'react'
const SvgChevronLeftIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M9.5 4.5 6.354 7.646a.5.5 0 0 0 0 .708L9.5 11.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
export default SvgChevronLeftIcon
