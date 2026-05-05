import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_KEY

if (!url || !key) {
  console.warn('Supabase credentials missing — set VITE_SUPABASE_URL and VITE_SUPABASE_KEY')
}

export const supabase = createClient(url, key)
