import type { SVGProps } from 'react'
const SvgHeartIcon = (props: SVGProps<SVGSVGElement>) => (
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
      strokeLinejoin="round"
      d="M2.47 4.442c-.887 1.362-.44 3.183.69 4.322l4.105 4.441a1 1 0 0 0 1.469 0l4.105-4.441c1.128-1.139 1.58-2.96.691-4.326C12.197 2.39 9.152 2.39 8 5.352 6.847 2.39 3.805 2.39 2.47 4.442Z"
    />
  </svg>
)
export default SvgHeartIcon
