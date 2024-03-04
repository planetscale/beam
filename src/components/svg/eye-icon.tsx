import type { SVGProps } from 'react'
const SvgEyeIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M14.627 7.449c.23.331.23.77 0 1.102C13.529 10.131 11.554 12.5 8 12.5s-5.53-2.368-6.627-3.949a.966.966 0 0 1 0-1.102C2.471 5.869 4.446 3.5 8 3.5s5.53 2.369 6.627 3.949z"
      strokeLinejoin="round"
    />
    <path fill="currentColor" d="M10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0" />
  </svg>
)
export default SvgEyeIcon
