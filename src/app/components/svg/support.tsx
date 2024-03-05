import type { SVGProps } from 'react'
const SvgSupport = (props: SVGProps<SVGSVGElement>) => (
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
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M13.069 13.125a7.05 7.05 0 0 1 3.18-.75c3.084 0 5.658 1.95 6.507 4.558.21.645-.09 1.322-.693 1.631-1.01.518-2.818 1.218-5.313 1.303"
    />
    <path
      stroke="currentColor"
      strokeWidth={1.5}
      d="M13.74 4.115A4.5 4.5 0 1 1 13 11"
    />
    <path fill="currentColor" d="m11.5 12 1.5-.5 1 1-1 .5z" />
    <path
      stroke="currentColor"
      strokeWidth={1.5}
      d="M14.25 7.25a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M9 12.5c-3.768 0-6.895 2.488-7.8 5.956a1.49 1.49 0 0 0 .67 1.653C3.077 20.85 5.516 22 9 22s5.922-1.15 7.13-1.89c.568-.348.838-1.01.67-1.654-.905-3.468-4.032-5.956-7.8-5.956Z"
    />
  </svg>
)
export default SvgSupport
