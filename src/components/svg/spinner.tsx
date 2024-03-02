import type { SVGProps } from 'react'
const SvgSpinner = (props: SVGProps<SVGSVGElement>) => (
  <svg
    id="spinner"
    width="16px"
    height="16px"
    viewBox="0 0 16 16"
    fill="none"
    strokeLinecap="round"
    stroke="currentColor"
    strokeWidth="1px"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <style>
      {
        '\n    :root {\n      --spinner-animation-speed: 4s;\n    }\n\n    #spinner {\n      animation: spinner-rotate calc(var(--spinner-animation-speed) / 3) linear infinite;\n    }\n\n    @keyframes spinner-rotate {\n      100% { transform: rotate(360deg); }\n    }\n\n    .spinner-line {\n      animation: dash var(--spinner-animation-speed) ease-in-out infinite;\n    }\n\n    @keyframes dash {\n      75%, 100% {\n        stroke-dasharray: .5, 1;\n        stroke-dashoffset: -.8;\n      }\n    }\n  '
      }
    </style>
    <circle
      className="spinner-line"
      cx={8}
      cy={8}
      r={7}
      strokeDasharray="1 0.8"
      strokeDashoffset={1}
      pathLength={1}
    />
    <circle
      cx={8}
      cy={8}
      r={7}
      strokeOpacity={0.1}
      strokeDasharray="0.8 1"
      pathLength={1}
    />
    <circle
      cx={8}
      cy={8}
      r={7}
      strokeOpacity={0.3}
      strokeDasharray="0.2 1"
      pathLength={1}
      transform="rotate(-72 8 8)"
    />
  </svg>
)
export default SvgSpinner
