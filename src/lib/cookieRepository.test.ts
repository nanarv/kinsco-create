import type { SupabaseClient } from '@supabase/supabase-js'
import { describe, expect, it } from 'vitest'
import type { Cookie } from '../types'
import { createFakeClient } from './testHelpers/fakeSupabaseClient'
import { fetchCookies, submitCookie } from './cookieRepository'

const cookie: Cookie = {
  id: 'c1',
  name: 'Sprinkle Dream',
  shape: 'round',
  base: { iconId: 'vanilla-dough', customName: null, color: '#f5e1a4' },
  mixIns: [
    { iconId: 'chocolate-chips', customName: null, color: '#5b3a29', pattern: 'flecks' },
  ],
  topping: { iconId: 'drizzle', customName: null, color: '#ffffff' },
  createdAt: '2026-01-01T00:00:00Z',
}

describe('submitCookie', () => {
  it('inserts a row into the cookies table with the structured Component data', async () => {
    const { client, calls } = createFakeClient()

    await submitCookie(cookie, client)

    expect(calls).toEqual([
      {
        table: 'cookies',
        payload: {
          name: 'Sprinkle Dream',
          shape: 'round',
          base: cookie.base,
          mix_ins: cookie.mixIns,
          topping: cookie.topping,
        },
      },
    ])
  })
})

describe('fetchCookies', () => {
  it('maps stored rows back into the typed Cookie shape', async () => {
    const { client } = createFakeClient({
      rows: [
        {
          id: 'c1',
          name: 'Sprinkle Dream',
          shape: 'round',
          base: cookie.base,
          mix_ins: cookie.mixIns,
          topping: cookie.topping,
          created_at: '2026-01-01T00:00:00Z',
        },
      ],
    })

    const cookies = await fetchCookies(client)

    expect(cookies).toEqual([cookie])
  })
})

function createInMemoryClient() {
  const rows: Record<string, unknown>[] = []
  const client = {
    from() {
      return {
        insert: async (payload: Record<string, unknown>) => {
          rows.push({ id: `row-${rows.length}`, created_at: '2026-01-01T00:00:00Z', ...payload })
          return { error: null }
        },
        select: async () => ({ data: rows, error: null }),
      }
    },
  }
  return client as unknown as SupabaseClient
}

describe('Cookie persistence round trip', () => {
  it('returns the same structured data that was submitted, with no snapshot involved', async () => {
    const client = createInMemoryClient()

    await submitCookie(cookie, client)
    const cookies = await fetchCookies(client)

    expect(cookies).toEqual([{ ...cookie, id: 'row-0', createdAt: '2026-01-01T00:00:00Z' }])
  })
})
