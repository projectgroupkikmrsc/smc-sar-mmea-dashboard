import { createClient } from '@supabase/supabase-js'

// Ambil nilai URL dasar secara mentah
const rawUrl = import.meta.env?.VITE_SUPABASE_URL || process.env?.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || process.env?.VITE_SUPABASE_ANON_KEY

// Fungsi pembersihan total: Buang tanda slash '/' DAN buang '/rest/v1' jika ia terikut masuk
let cleanUrl = rawUrl ? rawUrl.trim().replace(/\/$/, '') : ''
if (cleanUrl.includes('/rest/v1')) {
  cleanUrl = cleanUrl.replace('/rest/v1', '')
}

export const supabase = createClient(cleanUrl, supabaseAnonKey)