'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase.ts';
import { Plus, Building2, Search, ExternalLink, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';
import { formatarCNPJ } from '../../../lib/formatters.ts';

interface Empresa {
  id: string;
  nome_fantasia: string;
  cnpj: string;
  email?: string;
  cidade?: string;
}

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    async function buscarEmpresas() {
      const { data, error } = await supabase
        .from('empresas')
        .select(`
          id,
          nome_fantasia,
          cnpj,
          email,
          cidade
          `)
        .order('nome_fantasia', { ascending: true });


      if (error) {
        console.error(error);
      } else if (data) {
        setEmpresas(data);
      }
      setLoading(false);

    }
    buscarEmpresas();
  }, []);

  const empresasFiltradas = empresas.filter(emp =>
    (emp.nome_fantasia ?? '').toLowerCase().includes(filtro.toLowerCase()) ||
    emp.cnpj.includes(filtro)
  );


  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black italic tracking-tight uppercase">Gestão de Clientes</h1>
          <p className="text-slate-500 text-sm font-medium">Visualize e gerencie todas as empresas da sua base.</p>
        </div>
        <Link href="/empresas/novo" className="bg-indigo-600 hover:bg-indigo-500 text-white p-4 px-8 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all uppercase text-[10px] tracking-widest">
          <Plus size={18} strokeWidth={3} /> Nova Empresa
        </Link>
      </div>

      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
        <input
          type="text"
          placeholder="Buscar por nome ou CNPJ..."
          className="w-full bg-[#0d1017] border border-white/5 p-5 pl-14 rounded-2xl text-sm focus:outline-none focus:border-indigo-500/50 transition-all text-white"
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-slate-500 animate-pulse italic">Carregando empresas...</p>
        ) : empresasFiltradas.map((emp) => (
          <div key={emp.id} className="bg-[#0d1017] border border-white/5 p-8 rounded-[2.5rem] hover:border-indigo-500/30 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 rounded-2xl bg-white/5 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                <Building2 size={24} />
              </div>
              <span className="text-[10px] font-black text-slate-600 bg-white/5 px-3 py-1 rounded-full tracking-tighter uppercase">
                ID: {emp.id.substring(0, 5)}
              </span>
            </div>

            <h3 className="text-xl font-bold truncate mb-1 text-white">{emp.nome_fantasia}</h3>
            {/* CNPJ FORMATADO AQUI */}
            <p className="text-slate-500 text-xs font-mono mb-6">CNPJ: {formatarCNPJ(emp.cnpj)}</p>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <Mail size={14} className="text-indigo-500" /> {emp.email || 'Email não cadastrado'}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <MapPin size={14} className="text-indigo-500" /> {emp.cidade || 'Local não informado'}
              </div>
            </div>

            <Link
              href={`/empresas/${emp.id}`}
              className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-transparent hover:border-indigo-500/50 text-white"
            >
              Ver Dossiê Completo <ExternalLink size={14} />
            </Link>
          </div>
        ))}
      </div>

      {!loading && empresasFiltradas.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
          <p className="text-slate-500 italic">Nenhuma empresa encontrada.</p>
        </div>
      )}
    </div>
  );
}