'use client'

import { motion } from 'framer-motion'
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react'
import Link from 'next/link'

export default function NoPermissionPage() {
  return (
    <div className="min-h-screen bg-[#05060a] flex items-center justify-center p-6 text-white font-sans">
      <div className="max-w-md w-full text-center space-y-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative inline-block"
        >
          <div className="bg-red-500/10 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto border border-red-500/20 shadow-2xl shadow-red-500/10">
            <ShieldAlert className="text-red-500" size={48} />
          </div>
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-2 -right-2 bg-zinc-900 border border-white/10 p-2 rounded-full shadow-lg"
          >
            <Lock size={16} className="text-indigo-400" />
          </motion.div>
        </motion.div>

        <div className="space-y-3">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            Acesso Restrito
          </h1>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Seu nível de credencial atual não possui autorização para acessar este módulo de governança.
          </p>
        </div>

        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em]">
          Erro: 403_ACCESS_DENIED_SINTECH_PROTOCOL
        </div>

        <div className="flex flex-col gap-3">
          <Link 
            href="/dashboard"
            className="w-full bg-white/5 hover:bg-white/10 text-white font-black py-4 rounded-2xl transition-all uppercase text-xs tracking-widest flex justify-center items-center gap-2 border border-white/10"
          >
            <ArrowLeft size={16} /> Voltar ao Meu Painel
          </Link>
          
          <Link 
            href="/contato-suporte"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
          >
            Solicitar Elevação de Cargo
          </Link>
        </div>
      </div>
    </div>
  )
}