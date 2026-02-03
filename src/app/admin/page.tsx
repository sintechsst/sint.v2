'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { 
  Users, Target, Zap, TrendingUp, ArrowUpRight, 
  ShieldCheck, BarChart3, Fingerprint 
} from 'lucide-react'
import Link from 'next/link' // Importação correta do Link

interface LeadRow {
  created_at: string;
  volume_vidas: string | number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    leadsHoje: 0,
    leadsGrandes: 0 
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0)

      const { data: leads, error } = await supabase
        .from('leads')
        .select('created_at, volume_vidas')

      if (error) {
        console.error("Erro ao buscar leads:", error.message)
      }

      if (leads) {
        const total = leads.length
        const hoje = leads.filter((l: LeadRow) => new Date(l.created_at) >= hoy).length
        const grandes = leads.filter((l: LeadRow) => Number(l.volume_vidas) >= 50).length

        setStats({ totalLeads: total, leadsHoje: hoje, leadsGrandes: grandes })
      }
      setLoading(false)
    }
    loadStats()
  }, [])

  const cards = [
    { label: 'Total de Leads', value: stats.totalLeads, icon: Users, color: 'text-blue-500' },
    { label: 'Novos Hoje', value: stats.leadsHoje, icon: Zap, color: 'text-amber-500' },
    { label: 'Empresas G', value: stats.leadsGrandes, icon: Target, color: 'text-indigo-500' },
  ]

  return (
    <div className="space-y-10">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
          Central de <span className="text-indigo-500">Governança</span>
        </h1>
        <p className="text-zinc-500 font-medium">Bem-vindo ao comando da Sintech SST.</p>
      </motion.div>

      {/* CARDS DE STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#0d1017] border border-white/5 p-8 rounded-[2rem] hover:border-indigo-500/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-4 rounded-2xl bg-white/5 ${card.color}`}>
                <card.icon size={24} />
              </div>
              <TrendingUp size={16} className="text-zinc-700 group-hover:text-indigo-500 transition-colors" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{card.label}</p>
              <p className="text-5xl font-black text-white italic tracking-tighter">
                {loading ? '...' : card.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MONITOR DE FLUXO */}
      <div className="h-48 bg-[#0d1017] border border-dashed border-white/10 rounded-[2.5rem] flex items-center justify-center overflow-hidden relative group">
        <div className="absolute inset-0 bg-indigo-500/5 animate-pulse group-hover:bg-indigo-500/10 transition-colors" />
        <div className="flex flex-col items-center gap-2 z-10">
          <Fingerprint className="text-zinc-800" size={32} />
          <span className="text-zinc-700 font-bold uppercase tracking-[0.3em] text-[10px]">Monitor de Fluxo Ativo</span>
        </div>
      </div>

      {/* SEÇÃO PREMIUM: PROTOCOLO E BI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CARD AUDITORIA */}
        <Link href="/admin/premium/auditorias" className="group">
          <div className="bg-[#0d1017] border border-white/5 p-8 rounded-[2.5rem] hover:border-indigo-500/30 transition-all flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="bg-indigo-600/10 p-4 rounded-2xl text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-lg shadow-indigo-600/0 group-hover:shadow-indigo-600/20">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h4 className="text-white font-bold text-xl uppercase italic tracking-tighter">Sintech Protocol</h4>
                <p className="text-zinc-500 text-sm">Gerenciar hashes e auditorias.</p>
              </div>
            </div>
            <ArrowUpRight className="text-zinc-700 group-hover:text-indigo-500 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
        </Link>

        {/* CARD BI & ANALYTICS */}
        <Link href="/admin/premium/bi" className="group">
          <div className="bg-[#0d1017] border border-white/5 p-8 rounded-[2.5rem] hover:border-emerald-500/30 transition-all flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="bg-emerald-500/10 p-4 rounded-2xl text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-lg shadow-emerald-600/0 group-hover:shadow-emerald-600/20">
                <BarChart3 size={32} />
              </div>
              <div>
                <h4 className="text-white font-bold text-xl uppercase italic tracking-tighter">Premium BI</h4>
                <p className="text-zinc-500 text-sm">Scores de governança ao vivo.</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">ATIVO</span>
              <ArrowUpRight className="text-zinc-700 group-hover:text-emerald-500 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
          </div>
        </Link>

      </div>
    </div>
  )
}
