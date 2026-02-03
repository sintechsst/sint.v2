'use client'

import { Crown, ArrowLeft, Rocket } from "lucide-react"
import Link from "next/link"

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-[#05060a] flex items-center justify-center p-6 text-white">
      <div className="max-w-md w-full bg-[#0d1017] border border-white/5 p-10 rounded-[2.5rem] text-center space-y-6">
        <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto text-amber-500 shadow-lg shadow-amber-500/5">
          <Crown size={40} />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">Recurso <span className="text-amber-500">Premium</span></h1>
          <p className="text-zinc-500 text-sm">Sua assinatura atual (Basic) não possui acesso ao Corpo Técnico Avançado e BI.</p>
        </div>

        <div className="grid gap-3 pt-4">
          <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-2">
            <Rocket size={16} /> Fazer Upgrade Agora
          </button>
          
          <Link href="/admin" className="text-zinc-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
            <ArrowLeft size={12} /> Voltar para a Governança
          </Link>
        </div>
      </div>
    </div>
  )
}