'use client';

import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-6 text-center">
      <div className="space-y-6">
        {/* Ícone de Alerta Animado */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-indigo-600 blur-3xl opacity-20 animate-pulse" />
          <div className="relative bg-[#0d1017] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
            <ShieldAlert size={80} className="text-indigo-500 mx-auto" strokeWidth={1.5} />
          </div>
        </div>

        {/* Texto de Erro */}
        <div className="space-y-2">
          <h1 className="text-6xl font-black italic text-white tracking-tighter">404</h1>
          <h2 className="text-xl font-bold text-slate-300 uppercase tracking-widest">Área Não Encontrada</h2>
          <p className="text-slate-500 max-w-xs mx-auto">
            O documento ou setor que você está tentando acessar não existe ou foi movido.
          </p>
        </div>

        {/* Botão de Retorno */}
        <div className="pt-4">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-lg shadow-indigo-600/20"
          >
            <ArrowLeft size={18} />
            Voltar ao Painel
          </Link>
        </div>
      </div>
    </div>
  );
}