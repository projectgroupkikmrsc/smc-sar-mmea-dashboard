import { createClient } from '@supabase/supabase-js'

// Ambil nilai URL dasar secara mentah
const rawUrl = import.meta.env?.VITE_SUPABASE_URL || process.env?.VITE_SUPABASE_URL || 'https://ilizrmtuurenvlsygllk.supabase.co'
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || process.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsaXpybXR1dXJlbnZsc3lnbGxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNDA0NzcsImV4cCI6MjA5NDkxNjQ3N30.kRmx40LqGxp9H2fUPzhbFqHc1LedT1RCXrTWZT-8yXg'

// Fungsi pembersihan total: Buang tanda slash '/' DAN buang '/rest/v1' jika ia terikut masuk
let cleanUrl = rawUrl ? rawUrl.trim().replace(/\/$/, '') : ''
if (cleanUrl.includes('/rest/v1')) {
  cleanUrl = cleanUrl.replace('/rest/v1', '')
}

export const supabase = createClient(cleanUrl, supabaseAnonKey)