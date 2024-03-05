import type { SVGProps } from 'react'
const SvgPerson = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeWidth={1.5}
      d="M17.25 7.25a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M12 12.5c-3.768 0-6.895 2.488-7.8 5.956a1.49 1.49 0 0 0 .67 1.653C6.077 20.85 8.516 22 12 22s5.922-1.15 7.13-1.89c.568-.348.838-1.01.67-1.654-.905-3.468-4.032-5.956-7.8-5.956Z"
    />
  </svg>
)
export default SvgPerson
