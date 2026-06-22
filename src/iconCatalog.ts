export type ComponentCategory = 'base' | 'mixIn' | 'topping'

export interface IconCatalogEntry {
  id: string
  category: ComponentCategory
  label: string
  defaultColor: string
  assetPath: string
}

export const iconCatalog: IconCatalogEntry[] = [
  {
    id: 'vanilla-dough',
    category: 'base',
    label: 'Vanilla Dough',
    defaultColor: '#f5e1a4',
    assetPath: '/icons/base/vanilla-dough.svg',
  },
  {
    id: 'chocolate-chips',
    category: 'mixIn',
    label: 'Chocolate Chips',
    defaultColor: '#5b3a29',
    assetPath: '/icons/mix-in/chocolate-chips.svg',
  },
  {
    id: 'drizzle',
    category: 'topping',
    label: 'Drizzle',
    defaultColor: '#ffffff',
    assetPath: '/icons/topping/drizzle.svg',
  },
]

const fallbackIconsByCategory: Record<ComponentCategory, IconCatalogEntry> = {
  base: {
    id: 'fallback-base',
    category: 'base',
    label: 'Custom Base',
    defaultColor: '#f5e1a4',
    assetPath: '/icons/base/fallback.svg',
  },
  mixIn: {
    id: 'fallback-mix-in',
    category: 'mixIn',
    label: 'Custom Mix-in',
    defaultColor: '#c9885f',
    assetPath: '/icons/mix-in/fallback.svg',
  },
  topping: {
    id: 'fallback-topping',
    category: 'topping',
    label: 'Custom Topping',
    defaultColor: '#f3f3f3',
    assetPath: '/icons/topping/fallback.svg',
  },
}

export function findIcon(category: ComponentCategory, iconId: string | null): IconCatalogEntry {
  const match = iconCatalog.find(
    (candidate) => candidate.category === category && candidate.id === iconId,
  )

  return match ?? fallbackIconsByCategory[category]
}
