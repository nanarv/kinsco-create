import type { SupabaseClient } from '@supabase/supabase-js'

export function createFakeClient(options: { rows?: unknown[] } = {}) {
  const calls: { table: string; payload: unknown }[] = []
  const client = {
    from(table: string) {
      return {
        insert: async (payload: unknown) => {
          calls.push({ table, payload })
          return { error: null }
        },
        select: async () => ({ data: options.rows ?? [], error: null }),
      }
    },
  }
  return { client: client as unknown as SupabaseClient, calls }
}
