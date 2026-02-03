'use client'

import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

interface Props {
  empresa: string
  servico: string
  profissional?: string
  data: string
  onClose: () => void
  onGoToList: () => void
}

export function AgendamentoConfirmado({
  empresa,
  servico,
  profissional,
  data,
  onClose,
  onGoToList
}: Props) {
  const dataFormatada = data.split('-').reverse().join('/')

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="bg-[#0d1017] border border-white/10 rounded-3xl w-full max-w-md p-10 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <CheckCircle className="text-indigo-500" size={72} />
        </motion.div>

        <h2 className="text-2xl font-black uppercase text-white mb-2">
          Solicitação Enviada
        </h2>

        <p className="text-slate-400 text-sm mb-6">
          Seu agendamento foi registrado com sucesso
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Empresa</span>
            <span className="text-white font-bold">{empresa}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Serviço</span>
            <span className="text-white font-bold">{servico}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Especialista</span>
            <span className="text-white font-bold">
              {profissional || 'A definir'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Data</span>
            <span className="text-white font-bold">{dataFormatada}</span>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-white/5 border border-white/10 p-3 rounded-xl text-slate-300 hover:bg-white/10 transition"
          >
            Fechar
          </button>

          <button
            onClick={onGoToList}
            className="flex-1 bg-indigo-600 p-3 rounded-xl font-bold text-white hover:bg-indigo-500 transition"
          >
            Ver Agendamentos
          </button>
        </div>
      </motion.div>
    </div>
  )
}
