// deno-lint-ignore-file
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { ShieldCheck, Loader2 } from 'lucide-react'

// Removido o import do process, Next.js já injeta as vars globalmente
export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. Autenticação no Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        toast.error(authError.message)
        setLoading(false)
        return
      }

      // 2. Verificação de Perfil Master (Bypass)
      if (email === 'adm@sintech.com') {
        toast.success('Acesso Master Autorizado')
        window.location.href = '/admin'
        return
      }

      console.log("Tentando buscar perfil para UID:", authData.user?.id);

      const { data: profile, error: profileError } = await supabase
        .from('tenant_users')
        .select('role')
        .eq('user_id', authData.user?.id)
        .maybeSingle()

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError)
      }

      if (profile?.role === 'admin') {
        toast.success('Acesso Administrativo')
        window.location.href = '/admin'
      } else if (profile?.role === 'empresa' || profile?.role === 'user') {
        toast.success('Acesso Dashboard')
        window.location.href = '/dashboard'
      } else {
        console.warn("Perfil não encontrado no banco para este UID.");
        toast.error('Perfil não identificado no sistema.')
        setLoading(false)
      }

    } catch (err: any) {
      console.error('Erro de conexão:', err)
      toast.error(err.message === 'Failed to fetch' ? 'Erro de rede ou Supabase offline.' : 'Erro inesperado.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#05060a] flex items-center justify-center p-6 text-white font-sans">
      <div className="w-full max-w-md space-y-8 bg-[#0d1017] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div className="text-center">
          <div className="bg-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-600/30">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
            Sintech<span className="text-indigo-500">SST</span>
          </h2>
          <p className="text-zinc-500 mt-2 text-sm font-medium tracking-wide">
            CENTRAL DE GOVERNANÇA E INTELIGÊNCIA
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-[10px] font-black uppercase text-zinc-500 ml-1 mb-2 block tracking-widest">
              Protocolo (E-mail)
            </label>
            <input
              type="email"
              required
              placeholder="seu@email.com"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-700"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-zinc-500 ml-1 mb-2 block tracking-widest">
              Chave de Acesso (Senha)
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-700"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black py-5 rounded-2xl transition-all uppercase text-sm tracking-[0.2em] flex justify-center items-center gap-2 mt-4 shadow-lg shadow-indigo-600/10"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Autenticar Sistema'}
          </button>
        </form>

        <p className="text-center text-[10px] text-zinc-600 uppercase tracking-widest pt-4">
          Conexão Segura Sintech Protocol 2.0
        </p>
      </div>
    </div>
  )

}
