import { useState } from 'react'
import type { Cookie } from '../types'
import { BuildFlow } from './BuildFlow'
import { GalleryPage } from './GalleryPage'

type Screen = 'build' | 'gallery'

export function AppShell({ fetchCookies }: { fetchCookies?: () => Promise<Cookie[]> }) {
  const [screen, setScreen] = useState<Screen>('build')

  if (screen === 'gallery') {
    return (
      <div>
        <a
          href="#"
          onClick={(event) => {
            event.preventDefault()
            setScreen('build')
          }}
        >
          Back to building
        </a>
        <GalleryPage fetchCookies={fetchCookies} />
      </div>
    )
  }

  return (
    <div>
      <a
        href="#"
        onClick={(event) => {
          event.preventDefault()
          setScreen('gallery')
        }}
      >
        View Gallery
      </a>
      <BuildFlow onSubmitted={() => setScreen('gallery')} />
    </div>
  )
}
