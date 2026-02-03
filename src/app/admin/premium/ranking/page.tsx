'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Trophy, Medal, ShieldCheck } from 'lucide-react' // ExternalLink removido
import { motion } from 'framer-motion'

// Definindo a estrutura exata do nosso Ranking
interface EmpresaRanking {
  empresa_id: string;
  nome_fantasia: string;
  score_governança: number;
  selo_status: 'OURO' | 'PRATA' | 'BRONZE';
  tenant_id: string;
}

export default function PublicRankingPage() {
  // Agora o estado sabe exatamente o que esperar
  const [ranking, setRanking] = useState<EmpresaRanking[]>([])

  useEffect(() => {
    async function getRanking() {
      const { data } = await supabase
        .from('v_ranking_seguranca')
        .select('*')
        .order('score_governança', { ascending: false })
      
      if (data) setRanking(data as EmpresaRanking[])
    }
    getRanking()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-20">
      <div className="max-w-4xl mx-auto space-y-12">
        
        <header className="text-center space-y-4">
          <div className="inline-block p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-500 mb-4">
            <Trophy size={40} />
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">
            Sintech <span className="text-indigo-500">Elite</span> Ranking
          </h1>
          <p className="text-zinc-500 max-w-lg mx-auto font-medium">
            Empresas auditadas que atingiram o mais alto nível de excelência em segurança e governança jurídica.
          </p>
        </header>

        <div className="grid gap-4">
          {ranking.map((empresa, index) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              key={empresa.empresa_id}
              className="bg-[#0d1017] border border-white/5 p-6 rounded-[2rem] flex items-center gap-6 group hover:border-indigo-500/50 transition-all shadow-2xl shadow-black"
            >
              {/* Posição */}
              <div className="text-4xl font-black italic text-zinc-800 group-hover:text-indigo-500/20 transition-colors w-16">
                #{index + 1}
              </div>

              {/* Info Empresa */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                   <h3 className="text-xl font-bold tracking-tight text-zinc-100">{empresa.nome_fantasia}</h3>
                   {empresa.selo_status === 'OURO' && <Medal className="text-amber-500 animate-pulse" size={18} />}
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="h-2 w-32 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${empresa.score_governança}%` }}
                      className="h-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]" 
                    />
                  </div>
                  <span className="text-[10px] font-black text-zinc-500 tracking-widest">{empresa.score_governança}% SCORE</span>
                </div>
              </div>

              {/* Selo Visual */}
              <div className="hidden md:block">
                 <div className={`px-4 py-2 rounded-xl border font-black text-[10px] tracking-[0.2em] ${
                   empresa.selo_status === 'OURO' ? 'border-amber-500/50 text-amber-500 bg-amber-500/5' : 
                   'border-zinc-800 text-zinc-600 bg-zinc-900/50'
                 }`}>
                   PROTOCOLO {empresa.selo_status}
                 </div>
              </div>

              <ShieldCheck className="text-indigo-500 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all" />
            </motion.div>
          ))}
        </div>

        <footer className="text-center pt-10 border-t border-white/5">
          <p className="text-[10px] font-bold text-zinc-700 tracking-[0.4em] uppercase">
            Data-Driven Compliance • Sintech Protocol 2026
          </p>
        </footer>
      </div>
    </div>
  )

}
