import { describe, expect, it } from 'vitest'
import type { Cookie } from './types'
import { sortCookiesByMostRecent } from './sortCookiesByMostRecent'

function cookie(id: string, createdAt: string): Cookie {
  return {
    id,
    name: id,
    shape: 'round',
    base: { iconId: 'vanilla-dough', customName: null, color: '#f5e1a4' },
    mixIns: [],
    topping: { iconId: 'drizzle', customName: null, color: '#ffffff' },
    createdAt,
  }
}

describe('sortCookiesByMostRecent', () => {
  it('orders Cookies by createdAt descending', () => {
    const oldest = cookie('oldest', '2026-01-01T00:00:00Z')
    const middle = cookie('middle', '2026-01-02T00:00:00Z')
    const newest = cookie('newest', '2026-01-03T00:00:00Z')

    const sorted = sortCookiesByMostRecent([middle, oldest, newest])

    expect(sorted.map((c) => c.id)).toEqual(['newest', 'middle', 'oldest'])
  })

  it('does not mutate the input array', () => {
    const oldest = cookie('oldest', '2026-01-01T00:00:00Z')
    const newest = cookie('newest', '2026-01-02T00:00:00Z')
    const input = [oldest, newest]

    sortCookiesByMostRecent(input)

    expect(input).toEqual([oldest, newest])
  })
})
