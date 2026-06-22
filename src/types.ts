export type Pattern = 'flecks' | 'swirl'

export interface ComponentChoice {
  /** Preset id, or null when the player typed a custom name instead */
  iconId: string | null
  customName: string | null
  color: string
}

export interface MixInChoice extends ComponentChoice {
  pattern: Pattern
}

export interface Cookie {
  id: string
  name: string
  shape: string
  base: ComponentChoice
  mixIns: MixInChoice[]
  topping: ComponentChoice
  createdAt: string
}
