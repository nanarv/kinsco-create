import type { Cookie } from './types'

export function sortCookiesByMostRecent(cookies: Cookie[]): Cookie[] {
  return [...cookies].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
}
