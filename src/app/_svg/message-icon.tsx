import type { SVGProps } from 'react'
const SvgMessageIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M13.5 2.513a1 1 0 0 1 1 1V11.5a1 1 0 0 1-1 1H5.37a1 1 0 0 0-.65.24l-1.57 1.345a1 1 0 0 1-1.65-.76V3.514a1 1 0 0 1 1-1h11z"
    />
  </svg>
)
export default SvgMessageIcon
