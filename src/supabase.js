import { createClient } from '@supabase/supabase-js'

// Taktik hibrid: Guna gaya Vite, kalau tak jumpa guna gaya Cloudflare
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || process.env?.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || process.env?.VITE_SUPABASE_ANON_KEY

// Buat pembersihan automatik kalau ada tanda slash '/' sesat kat hujung URL
const cleanUrl = supabaseUrl ? supabaseUrl.replace(/\/$/, '') : ''

export const supabase = createClient(cleanUrl, supabaseAnonKey)