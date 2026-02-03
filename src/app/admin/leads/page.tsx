'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase.ts'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, ArrowUpRight, Building2, X, ShieldAlert, CheckCircle2, AlertTriangle, Zap } from 'lucide-react'
import { toast } from 'sonner'

interface Lead {
  id: string
  nome: string
  whatsapp: string
  volume_vidas: number
  gargalo_principal: string
  status: string
  created_at: string
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  // Estado para o Score de Risco
  const [diagnostico, setDiagnostico] = useState({
    pgr: false,
    pcmso: false,
    treinamentos: false,
    laudos: false
  })

  // Cálculo de Score (Exemplo: cada item falta aumenta 25% do risco)
  const itensFaltantes = Object.values(diagnostico).filter(v => v === false).length
  const riskScore = itensFaltantes * 25

  const getRiskColor = (score: number) => {
    if (score <= 25) return 'text-emerald-500'
    if (score <= 50) return 'text-yellow-500'
    return 'text-red-500'
  }

  useEffect(() => {
    async function fetchLeads() {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) setLeads(data)
      setLoading(false)
    }
    fetchLeads()
  }, [])

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-end">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter">
            Leads & <span className="text-indigo-500">Diagnósticos</span>
          </h2>
          <p className="text-zinc-500 text-sm font-medium">Referência técnica em análise de conformidade.</p>
        </motion.div>

        <div className="flex gap-3">
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2 text-zinc-400">
            <Search size={16} />
            <input type="text" placeholder="Filtrar empresa..." className="bg-transparent outline-none text-xs" />
          </div>
          <button type="button" className="bg-white/5 border border-white/10 p-2 rounded-xl text-zinc-400 hover:text-white transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <p className="text-zinc-600 animate-pulse uppercase tracking-widest text-[10px] font-black">Sincronizando base de dados...</p>
        ) : (
          leads.map((lead, i) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedLead(lead)}
              className="bg-[#0d1017] border border-white/5 p-6 rounded-[1.5rem] hover:border-indigo-500/40 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold italic uppercase tracking-tight group-hover:text-indigo-400">
                    {lead.nome}
                  </h3>
                  <div className="flex gap-3 mt-1 text-[9px] font-black uppercase tracking-tighter">
                    <span className="bg-white/5 text-zinc-400 px-2 py-0.5 rounded border border-white/5">
                      {lead.volume_vidas} vidas
                    </span>
                    <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/10">
                      {lead.gargalo_principal}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="hidden md:block text-right">
                  <p className="text-[9px] text-zinc-600 uppercase font-black tracking-[0.2em]">Sintech Status</p>
                  <p className="text-xs text-zinc-300 font-bold uppercase italic">{lead.status}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-full text-zinc-600 group-hover:text-white group-hover:bg-indigo-600 transition-all active:scale-90">
                  <ArrowUpRight size={20} />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* MODAL DE DIAGNÓSTICO DE REFERÊNCIA */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0d1017] border border-white/10 w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="flex h-[600px]">
                {/* Lado Esquerdo: Info e Score */}
                <div className={`w-1/3 p-10 flex flex-col justify-between transition-colors duration-500 ${riskScore > 50 ? 'bg-red-500/5' : 'bg-indigo-500/5'}`}>
                  <div>
                    <button type="button" onClick={() => setSelectedLead(null)} className="text-zinc-500 hover:text-white mb-6">
                      <X size={24} />
                    </button>
                    <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-2 text-zinc-400">Lead Selecionado</h4>
                    <h3 className="text-2xl font-black italic uppercase leading-none text-white">{selectedLead.nome}</h3>
                  </div>

                  <div className="text-center">
                    <div className={`text-6xl font-black italic mb-2 transition-colors ${getRiskColor(riskScore)}`}>
                      {riskScore}%
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Score de Risco Técnico</p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                      <p className="text-[9px] font-black text-zinc-500 uppercase mb-1">Impacto Estimado</p>
                      <p className="text-xs text-white font-bold italic">Possível Interdição NR-28</p>
                    </div>
                  </div>
                </div>

                {/* Lado Direito: Checklist de Referência */}
                <div className="w-2/3 p-10 bg-[#0d1017] overflow-y-auto">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black italic uppercase text-white">Diagnóstico de Referência</h3>
                    <ShieldAlert size={20} className="text-indigo-500" />
                  </div>

                  <div className="space-y-4">
                    {[
                      { id: 'pgr', label: 'PGR / Gerenciamento de Riscos', nr: 'NR-01' },
                      { id: 'pcmso', label: 'PCMSO Atualizado', nr: 'NR-07' },
                      { id: 'treinamentos', label: 'Treinamentos Obrigatórios', nr: 'Várias' },
                      { id: 'laudos', label: 'Laudos de Insalubridade/Periculosidade', nr: 'NR-15/16' }
                    ].map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl cursor-pointer hover:border-indigo-500/50 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={diagnostico[item.id as keyof typeof diagnostico]}
                            onChange={() => setDiagnostico(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof diagnostico] }))}
                          />
                          <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${diagnostico[item.id as keyof typeof diagnostico] ? 'bg-indigo-500 border-indigo-500' : 'border-white/20'}`}>
                            {diagnostico[item.id as keyof typeof diagnostico] && <CheckCircle2 size={14} className="text-white" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold uppercase italic text-white group-hover:text-indigo-400 transition-colors">{item.label}</p>
                            <p className="text-[10px] text-zinc-500 font-black uppercase">{item.nr}</p>
                          </div>
                        </div>
                        {diagnostico[item.id as keyof typeof diagnostico] ?
                          <CheckCircle2 size={20} className="text-emerald-500" /> :
                          <AlertTriangle size={20} className="text-red-500 animate-pulse" />
                        }
                      </label>
                    ))}
                  </div>

                  <div className="flex gap-4 mt-10">
                    <button
                      type="button"
                      onClick={() => {
                        toast.success("Diagnóstico Salvo no Banco de Dados!")
                        setSelectedLead(null)
                      }}
                      className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-black uppercase py-5 rounded-2xl tracking-[0.2em] text-[10px] transition-all"
                    >
                      Apenas Salvar
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        toast.promise(
                          new Promise((resolve) => setTimeout(resolve, 2000)),
                          {
                            loading: 'Gerando Relatório de Conformidade...',
                            success: 'PDF Gerado com Sucesso! Enviando para o WhatsApp...',
                            error: 'Erro ao gerar documento.',
                          }
                        )
                      }}
                      className="flex-[2] bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase py-5 rounded-2xl tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/20"
                    >
                      <Zap size={16} fill="white" /> Gerar Relatório de Impacto (PDF)
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )
        }
      </AnimatePresence >
    </div >
  )
}