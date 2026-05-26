import { createClient } from '@supabase/supabase-js'

// Membersihkan URL daripada sebarang tanda '/' di hujung untuk mengelakkan ralat API routing
const rawUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseUrl = rawUrl.replace(/\/$/, '')
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)