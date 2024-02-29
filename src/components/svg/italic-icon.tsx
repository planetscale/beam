import type { SVGProps } from 'react'
const SvgItalicIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M12.667 2.667h-6m2.666 10.666h-6M10 2.667 6 13.333"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.333}
    />
  </svg>
)
export default SvgItalicIcon
