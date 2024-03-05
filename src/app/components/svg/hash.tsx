import type { SVGProps } from 'react'
const SvgHash = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={17}
    height={17}
    fill="none"
    viewBox="0 0 17 17"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      d="m10.615 13.993 1.735-11.27M14.402 5.547 3 5.496M5.15 13.993l1.735-11.27M14.402 10.774 3 10.724"
    />
  </svg>
)
export default SvgHash
