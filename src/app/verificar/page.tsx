// deno-lint-ignore-file
'use client'

import { motion } from 'framer-motion'
import { Search, BadgeCheck, XCircle } from 'lucide-react'
import { useState } from 'react'

export default function VerificarCredencialPage() {
  const [id, setId] = useState('')
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid'>('idle')

  function verificar() {
    // Simulação — depois conecta no Supabase
    if (id.length > 6) setStatus('valid')
    else setStatus('invalid')
  }

  return (
    <main className="min-h-screen bg-[#05060a] text-slate-100 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full p-10 rounded-2xl bg-white/[0.02] border border-white/10"
      >
        <h1 className="text-2xl font-black tracking-tight text-center">
          Verificação Institucional de Credencial SST
        </h1>

        <p className="mt-4 text-slate-400 text-center">
          Insira o identificador técnico para validar vínculo institucional,
          status operacional e conformidade regional.
        </p>

        <div className="mt-8 flex gap-2">
          <input
            value={id}
            onChange={e => setId(e.target.value)}
            placeholder="Ex: SST-REG-000241"
            className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:border-indigo-500/40"
          />
          <button
            onClick={verificar}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition font-bold"
          >
            <Search size={18} />
          </button>
        </div>

        {status !== 'idle' && (
          <div className="mt-8">
            {status === 'valid' ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <BadgeCheck />
                <div>
                  <p className="font-bold">Credencial Válida</p>
                  <p className="text-sm">
                    Registro reconhecido pela infraestrutura regional SST.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
                <XCircle />
                <div>
                  <p className="font-bold">Credencial Não Encontrada</p>
                  <p className="text-sm">
                    Identificador fora do padrão institucional regional.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </main>
  )
}
