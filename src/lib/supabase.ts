import { createBrowserClient } from '@supabase/ssr'
import { getCookie, setCookie, deleteCookie } from 'cookies-next'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Verificação de segurança para o desenvolvedor
if (!supabaseUrl || supabaseUrl === 'undefined') {
  console.error("❌ ERRO: NEXT_PUBLIC_SUPABASE_URL não está definida no navegador.")
}

const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:'

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  cookies: {
    get(name: string) {
      const value = getCookie(name)
      return value ? String(value) : undefined
    },
    set(name: string, value: string, options: any) {
      setCookie(name, value, {
        path: '/',
        sameSite: 'lax',
        secure: isSecure,
        ...options,
      })
    },
    remove(name: string, options: any) {
      deleteCookie(name, { path: '/', ...options })
    },
  },
})
