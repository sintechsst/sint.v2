'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase.ts'
import { User, Building2, ShieldCheck } from 'lucide-react'

export default function PerfilPage() {
  const [perfil, setPerfil] = useState<any>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('tenant_users')
        .select(`role, tenants(nome, plano)`)
        .eq('user_id', user.id)
        .single()
      
      setPerfil({ ...data, email: user.email })
    }
    load()
  }, [])

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">
        Estação de <span className="text-indigo-500">Trabalho</span>
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-white/5 p-6 rounded-3xl">
          <div className="flex items-center gap-4 mb-4 text-indigo-400">
            <User size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">Identidade</span>
          </div>
          <p className="text-white font-bold">{perfil?.email}</p>
          <p className="text-zinc-500 text-xs uppercase mt-1">Cargo: {perfil?.role}</p>
        </div>

        <div className="bg-zinc-900 border border-white/5 p-6 rounded-3xl">
          <div className="flex items-center gap-4 mb-4 text-emerald-400">
            <Building2 size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">Organização</span>
          </div>
          <p className="text-white font-bold">{perfil?.tenants?.nome}</p>
          <p className="text-emerald-500 text-xs uppercase mt-1">Plano: {perfil?.tenants?.plano}</p>
        </div>
      </div>
    </div>
  )
}