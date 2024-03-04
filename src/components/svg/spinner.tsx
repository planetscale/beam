import type { SVGProps } from 'react'
const SvgSpinner = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <circle
      cx={12}
      cy={12}
      r={12}
      stroke="currentColor"
      className="opacity-25"
      strokeWidth={4}
    />
    <path
      fill="currentColor"
      d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938z"
      className="opacity-75"
    />
  </svg>
)
export default SvgSpinner
