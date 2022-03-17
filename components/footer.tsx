import { GithubLogo, HeartFilledIcon } from '@/components/icons'
import * as React from 'react'
import packageJson from '../package.json'

export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between gap-2 text-sm md:gap-4 md:flex-row text-secondary">
      <a
        href="https://github.com/meroxa/beam"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 text-sm transition-colors text-secondary hover:text-primary"
      >
        <GithubLogo className="w-4 h-4" />
        <span>Version {packageJson.version}</span>
      </a>
    </footer>
  )
}
