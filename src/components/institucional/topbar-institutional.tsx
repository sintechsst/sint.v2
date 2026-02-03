'use client'

import { ShieldCheck, BadgeCheck } from 'lucide-react'
import Link from 'next/link'

export default function TopbarInstitucional() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#05060a]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
            <ShieldCheck size={20} />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-black tracking-wide">
              Sintech SST
            </p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">
              Núcleo Institucional
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/padrao-operacional"
            className="text-slate-400 hover:text-white transition"
          >
            Padrão Operacional
          </Link>
          <Link
            href="/verificar"
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 transition font-semibold"
          >
            <BadgeCheck size={14} />
            Verificar Credencial
          </Link>
        </nav>
      </div>
    </header>
  )
}
