import type { CSSProperties } from 'react'
import type { Pattern } from '../types'
import { findIcon, type ComponentCategory, type IconCatalogEntry } from '../iconCatalog'

interface TintedIconProps {
  category: ComponentCategory
  iconId: string | null
  color: string
  pattern?: Pattern
}

const FLECK_COUNT = 5

function IconCopy({
  entry,
  color,
  style,
}: {
  entry: IconCatalogEntry
  color: string
  style?: CSSProperties
}) {
  return (
    <div style={{ position: 'relative', display: 'inline-block', ...style }}>
      <img src={entry.assetPath} alt={entry.label} />
      <div
        data-testid="tint-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: color,
          mixBlendMode: 'multiply',
        }}
      />
    </div>
  )
}

export function TintedIcon({ category, iconId, color, pattern }: TintedIconProps) {
  const entry = findIcon(category, iconId)

  if (pattern === 'flecks') {
    return (
      <div data-testid="icon-wrapper" data-pattern="flecks">
        {Array.from({ length: FLECK_COUNT }, (_, index) => (
          <IconCopy key={index} entry={entry} color={color} />
        ))}
      </div>
    )
  }

  if (pattern === 'swirl') {
    return (
      <div data-testid="icon-wrapper" data-pattern="swirl">
        <IconCopy entry={entry} color={color} style={{ transform: 'rotate(25deg) scaleX(1.6)' }} />
      </div>
    )
  }

  return <IconCopy entry={entry} color={color} />
}
