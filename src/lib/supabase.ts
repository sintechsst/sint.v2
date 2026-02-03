import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Verificação de segurança para o desenvolvedor
if (!supabaseUrl || supabaseUrl === 'undefined') {
  console.error("❌ ERRO: NEXT_PUBLIC_SUPABASE_URL não está definida no navegador.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)