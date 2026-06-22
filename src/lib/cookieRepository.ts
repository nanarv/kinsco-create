import type { SupabaseClient } from '@supabase/supabase-js'
import type { Cookie } from '../types'
import { supabase } from './supabaseClient'

export async function submitCookie(cookie: Cookie, client: SupabaseClient = supabase): Promise<void> {
  const { error } = await client.from('cookies').insert({
    name: cookie.name,
    shape: cookie.shape,
    base: cookie.base,
    mix_ins: cookie.mixIns,
    topping: cookie.topping,
  })

  if (error) {
    throw error
  }
}

interface CookieRow {
  id: string
  name: string
  shape: string
  base: Cookie['base']
  mix_ins: Cookie['mixIns']
  topping: Cookie['topping']
  created_at: string
}

export async function fetchCookies(client: SupabaseClient = supabase): Promise<Cookie[]> {
  const { data, error } = await client.from('cookies').select('*')

  if (error) {
    throw error
  }

  return (data as CookieRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    shape: row.shape,
    base: row.base,
    mixIns: row.mix_ins,
    topping: row.topping,
    createdAt: row.created_at,
  }))
}
