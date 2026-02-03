"use client"

import { motion } from "framer-motion"
import { motionLevels } from "@/components/institucional/motion"
import InstitutionalContainer from "./institutional-container";

export default function RodapeInstitucional() {
  const hashModelo = "SINTECH-SST-AUTH-2026-SJDR" // Mudei o Hash para incluir sua marca e região

  return (
    // No seu componente de Rodapé
<motion.footer className="border-t border-white/5 bg-[#05060a] w-full mt-auto">
  <InstitutionalContainer>
    <div className="py-12 flex flex-col md:flex-row justify-between items-start gap-12">
      
      {/* ESQUERDA: IDENTIDADE */}
      <div className="space-y-4 max-w-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-xs font-black text-white shadow-lg shadow-indigo-600/20">S</div>
          <h2 className="text-xl font-black italic tracking-tighter uppercase text-white">Sintech <span className="text-indigo-500 text-xs italic">SST</span></h2>
        </div>
        <p className="text-zinc-400 text-sm leading-relaxed">
          <span className="text-white font-bold italic">Estruturação Digital e Consultoria em Gestão de SST.</span><br />
          Referência em padronização operacional para clínicas e empresas em São João del-Rei e Região.
        </p>
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium">
          © 2026 SINTECH SST • TECNOLOGIA PARA SEGURANÇA DO TRABALHO
        </p>
      </div>

      {/* DIREITA: PROTOCOLO (ESTILO CARD DARK) */}
      <div className="w-full md:w-auto">
        <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-2xl backdrop-blur-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-3 justify-between md:justify-end">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Protocolo:</span>
              <span className="text-zinc-200 font-mono text-xs font-bold">v1.0.26</span>
            </div>
            <div className="flex flex-col gap-2 md:items-end">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Integridade:</span>
              <span className="px-3 py-1.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-[10px]">
                SINTECH-SST-AUTH-2026-SJDR
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </InstitutionalContainer>
</motion.footer>
  )

}
