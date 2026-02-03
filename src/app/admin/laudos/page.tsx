'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Plus, FileText, Loader2, User, Search, Filter, ChevronDown, Check, CheckCircle, Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthRole } from '@/hooks/useAuthRole';

interface Documento {
  id: string;
  created_at: string;
  nome_arquivo: string;
  tipo: string;
  status: string;
  url_path: string;
  empresas?: {
    nome_fantasia: string;
  };
}

export default function LaudosPage() {
  const [laudosFiltrados, setLaudosFiltrados] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [isOpen, setIsOpen] = useState(false);
  const { role, isAdmin, loadingRole } = useAuthRole();
  const [laudos, setLaudos] = useState<Documento[]>([]);

  const tipos = ['Todos', 'PGR', 'PCMSO', 'LTCAT', 'ASO'];

  const carregarHistorico = useCallback(async () => {
    if (loadingRole) return;

    setLoading(true);
    try {
      let query = supabase
        .from('documentos')
        .select(`*, empresas (nome_fantasia)`)
        .order('created_at', { ascending: false });

      if (!isAdmin) {
        const { data: profile } = await supabase
          .from('tenant_users')
          .select('tenant_id')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
          .single();

        if (profile?.tenant_id) {
          query = query.eq('empresa_id', profile.tenant_id);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      setLaudos(data || []);
    } catch (error) {
      toast.error("Erro ao carregar arquivos");
    } finally {
      setLoading(false);
    }
  }, [isAdmin, loadingRole]);

  useEffect(() => {
    carregarHistorico();
  }, [carregarHistorico]);

  useEffect(() => {
    let resultado = laudos;
    if (busca) {
      resultado = resultado.filter(l =>
        l.empresas?.nome_fantasia?.toLowerCase().includes(busca.toLowerCase()) ||
        l.nome_arquivo?.toLowerCase().includes(busca.toLowerCase())
      );
    }
    if (filtroTipo !== 'Todos') {
      resultado = resultado.filter(l => l.tipo === filtroTipo);
    }
    setLaudosFiltrados(resultado);
  }, [busca, filtroTipo, laudos]);

  async function finalizarLaudo(id: string) {
    const { error } = await supabase
      .from('documentos')
      .update({ status: 'Concluído' })
      .eq('id', id);

    if (error) {
      toast.error("Erro ao atualizar status");
    } else {
      toast.success("Laudo finalizado!");
      carregarHistorico();
    }
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Arquivo de Laudos</h1>
          <p className="text-slate-500 font-medium italic">Gestão centralizada de documentos técnicos</p>
        </div>

          <Link
            href="/admin/laudos/novo"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20"
          >
            <Plus size={18} /> Novo Upload
          </Link>
      </div>

      {/* FERRAMENTAS */}
      <div className="flex flex-col md:flex-row gap-4 relative z-50">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Buscar por empresa ou arquivo..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full bg-[#0d1017] border border-white/5 p-4 pl-12 rounded-2xl text-white outline-none focus:border-indigo-500/50 transition-all"
          />
        </div>

        <div className="relative min-w-[200px]">
          <button
            type='button'
            onClick={() => setIsOpen(!isOpen)}
            className="w-full bg-[#0d1017] border border-white/5 p-4 rounded-2xl text-white flex items-center justify-between hover:border-white/10 transition-all"
          >
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-indigo-500" />
              <span className="text-xs font-bold uppercase tracking-widest">{filtroTipo}</span>
            </div>
            <ChevronDown size={16} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute top-[110%] left-0 w-full bg-[#0d1017] border border-white/10 rounded-2xl p-2 shadow-2xl">
              {tipos.map((tipo) => (
                <button
                  key={tipo}
                  type='button'
                  onClick={() => { setFiltroTipo(tipo); setIsOpen(false); }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-[10px] font-black uppercase transition-all ${filtroTipo === tipo ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}
                >
                  {tipo} {filtroTipo === tipo && <Check size={12} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-indigo-500" size={32} /></div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {laudosFiltrados.map((laudo) => (
            <div key={laudo.id} className="bg-[#0d1017] border border-white/5 p-5 rounded-3xl flex items-center justify-between group hover:border-indigo-500/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500/10 group-hover:text-indigo-500 transition-all">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm uppercase italic tracking-tight">{laudo.nome_arquivo}</h3>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2 mt-1">
                    <User size={10} /> {laudo.empresas?.nome_fantasia} • <span className="text-indigo-400">{laudo.tipo}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right hidden md:block border-r border-white/5 pr-6">
                  <p className="text-white text-[10px] font-black">{new Date(laudo.created_at).toLocaleDateString('pt-BR')}</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">{new Date(laudo.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border ${laudo.status === 'Pendente' ? 'bg-amber-500/5 text-amber-500 border-amber-500/10' : 'bg-emerald-500/5 text-emerald-500 border-emerald-500/10'}`}>
                    {laudo.status}
                  </span>

                  <button
                    type='button'
                    onClick={() => window.open(laudo.url_path, '_blank')}
                    className="p-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-all"
                    title="Baixar PDF"
                  >
                    <Download size={18} />
                  </button>

                  {/* 🔐 AÇÕES EXCLUSIVAS DO ADMIN */}
                  {role === 'admin' && (
                    <div className="flex items-center gap-2 border-l border-white/5 pl-3">
                      {laudo.status === 'Pendente' && (
                        <button
                          type='button'
                          onClick={() => finalizarLaudo(laudo.id)}
                          className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"
                          title="Finalizar Laudo"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button type='button' className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}