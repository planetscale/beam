import type { SVGProps } from 'react'
const SvgDotPattern = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={720}
    height={240}
    fill="none"
    className="absolute inset-0 -z-1"
    viewBox="0 0 720 240"
    {...props}
  >
    <defs>
      <pattern
        id="dot-pattern"
        width={31.5}
        height={31.5}
        x={0}
        y={0}
        patternUnits="userSpaceOnUse"
      >
        <circle
          cx={1.5}
          cy={1.5}
          r={1.5}
          fill="currentColor"
          className="text-gray-100 dark:text-gray-700"
        />
      </pattern>
    </defs>
    <path fill="url(#dot-pattern)" d="M0 0h720v240H0z" />
  </svg>
)
export default SvgDotPattern
