'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { BarChart3, ShieldCheck, AlertCircle, Award, Loader2, Radar } from 'lucide-react'

type EmpresaBI = {
  empresa_id: string
  nome_fantasia: string
  score_governança: number
  selo_status: string
  os_pendentes: number
  documentos_vencidos: number
  agendamentos_cancelados: number
  uf: string
}

export default function PremiumBIPage() {
  const [ranking, setRanking] = useState<EmpresaBI[]>([])
  const [loading, setLoading] = useState(true)
  const [alertas, setAlertas] = useState(0)

  async function fetchBI() {
    const { data } = await supabase
      .from('v_ranking_seguranca')
      .select('*')

    const lista = data || []
    setRanking(lista)
    setAlertas(lista.filter(r =>
      r.score_governança < 40 ||
      r.documentos_vencidos > 0 ||
      r.os_pendentes > 3
    ).length)

    setLoading(false)
  }

  useEffect(() => {
    fetchBI()

    const channel = supabase
      .channel('bi-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        () => fetchBI()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  function riscoColor(score: number) {
    if (score >= 70) return 'text-emerald-500'
    if (score >= 40) return 'text-amber-500'
    return 'text-rose-500'
  }

  function barraColor(score: number) {
    if (score >= 70) return 'bg-emerald-600'
    if (score >= 40) return 'bg-amber-500'
    return 'bg-rose-600'
  }

  if (loading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-indigo-500" />
      </div>
    )

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
            Sintech <span className="text-indigo-500">Risk Intelligence</span>
          </h1>
          <p className="text-zinc-500">Monitoramento legal e governança SST em tempo real.</p>
        </div>

        <div className="flex items-center gap-2 bg-[#0d1017] border border-white/5 px-5 py-3 rounded-2xl">
          <Radar className="text-rose-500" />
          <span className="text-xs uppercase font-bold tracking-widest text-zinc-400">
            Alertas ativos
          </span>
          <span className="text-lg font-black text-white">{alertas}</span>
        </div>
      </header>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card icon={<Award className="text-amber-500" />} label="Selo Ouro"
          value={ranking.filter(r => r.selo_status === 'OURO').length} />

        <Card icon={<ShieldCheck className="text-indigo-500" />} label="Score Médio"
          value={`${(ranking.reduce((acc, curr) => acc + curr.score_governança, 0) / ranking.length || 0).toFixed(0)}%`} />

        <Card icon={<AlertCircle className="text-rose-500" />} label="Risco Crítico"
          value={ranking.filter(r => r.score_governança < 40).length} />
      </div>

      {/* RANKING */}
      <div className="bg-[#0d1017] border border-white/5 p-8 rounded-[2.5rem]">
        <div className="flex items-center gap-3 mb-8">
          <BarChart3 className="text-indigo-500" />
          <h2 className="text-xl font-bold uppercase italic tracking-tighter">
            Ranking de Exposição Legal SST
          </h2>
        </div>

        <div className="space-y-6">
          {ranking
            .sort((a, b) => a.score_governança - b.score_governança)
            .map((empresa) => (
              <div key={empresa.empresa_id} className="space-y-2 group">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-zinc-400">{empresa.nome_fantasia}</span>

                  <span className={riscoColor(empresa.score_governança)}>
                    {empresa.score_governança}%
                  </span>
                </div>

                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${empresa.score_governança}%` }}
                    className={`h-full rounded-full ${barraColor(empresa.score_governança)}`}
                  />
                </div>

                {/* TOOLTIP DE RISCO */}
                <div className="opacity-0 group-hover:opacity-100 transition text-[10px] text-zinc-500 pt-1">
                  OS pendentes: {empresa.os_pendentes} •
                  Docs vencidos: {empresa.documentos_vencidos} •
                  Cancelamentos: {empresa.agendamentos_cancelados} •
                  Região: {empresa.uf}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

function Card({ icon, label, value }: any) {
  return (
    <div className="bg-[#0d1017] border border-white/5 p-6 rounded-[2rem]">
      {icon}
      <p className="text-[10px] font-black uppercase text-zinc-500 mt-4">{label}</p>
      <p className="text-4xl font-black text-white">{value}</p>
    </div>
  )
}
