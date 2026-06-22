import type { SupabaseClient } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'

export async function submitEmailSignup(email: string, client: SupabaseClient = supabase): Promise<void> {
  const { error } = await client.from('email_signups').insert({ email })

  if (error) {
    throw error
  }
}
