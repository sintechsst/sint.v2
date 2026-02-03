'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, Calendar as CalendarIcon,
  User, Search, LayoutGrid, List, X, CheckCircle, Briefcase, Settings, Trash2
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

// 1. INTERFACES DEFINIDAS (Sem 'any')
interface Profissional {
  id: string
  nome: string
  cargo?: string
  especialidade?: string
}

interface Empresa { id: string; nome_fantasia: string }
interface Servico { id: string; nome: string }

interface AgendamentoDetalhado {
  id: string
  status: string
  profissional_id: string
  profissionais: { nome: string; especialidade: string } | null
  empresas: { nome_fantasia: string } | null
  servicos: { nome: string } | null
}

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export default function AgendaCalendario() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate())
  const [isAllocating, setIsAllocating] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [servicos, setServicos] = useState<Servico[]>([])
  const [profissionais, setProfissionais] = useState<Profissional[]>([])
  const [selectedEmpresa, setSelectedEmpresa] = useState('')
  const [selectedServico, setSelectedServico] = useState('')

  const [agendamentosExistentes, setAgendamentosExistentes] = useState<string[]>([])
  const [detalhesAgendamento, setDetalhesAgendamento] = useState<AgendamentoDetalhado[]>([])

  const fetchAgendamentos = useCallback(async () => {
    const primeiroDia = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
    const ultimoDia = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString();

    const { data } = await supabase
      .from('agendamentos')
      .select('data_sugerida')
      .gte('data_sugerida', primeiroDia)
      .lte('data_sugerida', ultimoDia);

    if (data) {
      const dias = data.map(a => new Date(a.data_sugerida).getUTCDate().toString());
      setAgendamentosExistentes(dias);
    }
  }, [currentDate]);

  const fetchDetalhesDia = useCallback(async (dia: number) => {
    const dataFormatada = new Date(currentDate.getFullYear(), currentDate.getMonth(), dia).toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('agendamentos')
      .select(`
        id,
        status,
        profissional_id,
        profissionais (nome, especialidade),
        empresas (nome_fantasia),
        servicos (nome)
      `)
      .eq('data_sugerida', dataFormatada);

    if (error) console.error(error);
    setDetalhesAgendamento((data as unknown as AgendamentoDetalhado[]) || []);
  }, [currentDate]);

  useEffect(() => {
    fetchAgendamentos();
    if (selectedDay) fetchDetalhesDia(selectedDay);
  }, [currentDate, fetchAgendamentos, selectedDay, fetchDetalhesDia]);

  const fetchData = useCallback(async () => {
    const { data: ent } = await supabase.from('empresas').select('id, nome_fantasia');
    const { data: serv } = await supabase.from('servicos').select('id, nome');
    const { data: pros } = await supabase.from('profissionais').select('id, nome, especialidade');

    if (ent) setEmpresas(ent);
    if (serv) setServicos(serv);
    if (pros) setProfissionais(pros as unknown as Profissional[]);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAlocar = async (profissional: Profissional) => {
    if (!selectedDay || !selectedEmpresa || !selectedServico) {
      alert("Selecione Empresa e Serviço primeiro.");
      return;
    }
    setIsAllocating(profissional.id);
    const dataAgendamento = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay);
    try {
      const { error } = await supabase.from('agendamentos').insert([{
        data_sugerida: dataAgendamento.toISOString().split('T')[0],
        status: 'pendente',
        prioridade: 'media',
        empresa_id: selectedEmpresa,
        servico_id: selectedServico,
        tenant_id: '5602d2b4-e831-4145-a5f0-c2f05241d185',
        profissional_id: profissional.id
      }]);
      if (error) throw error;
      alert(`Escala confirmada!`);
      await fetchAgendamentos();
      if (selectedDay) fetchDetalhesDia(selectedDay);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido';
      alert(`Erro ao salvar: ${msg}`);
    } finally {
      setIsAllocating(null);
    }
  };

  const handleExcluir = async (id: string) => {
    const confirmar = confirm("VISÃO MASTER: Confirmar exclusão definitiva?");
    if (!confirmar) return;

    try {
      const { error } = await supabase
        .from('agendamentos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert("Alocação removida!");

      setDetalhesAgendamento(prev => prev.filter(item => item.id !== id));
      
      await fetchAgendamentos();

      if (detalhesAgendamento.length <= 1) {
        setDetalhesAgendamento([]);
      }

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao excluir';
      console.error("Erro detalhado:", err);
      alert(`Não foi possível excluir. Verifique as permissões (RLS). Erro: ${msg}`);
    }
  };

  return (
    <div className="relative flex min-h-screen bg-black/20 rounded-[2rem] overflow-hidden">
      <div className={`flex-1 p-6 transition-all duration-500 ${selectedDay ? 'mr-[380px]' : ''}`}>
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600/10 p-3 rounded-2xl text-indigo-500">
              <CalendarIcon size={24} />
            </div>
            <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter">
              {currentDate.toLocaleString('pt-BR', { month: 'long' })} <span className="text-indigo-500">{currentDate.getFullYear()}</span>
            </h2>
          </div>

          <div className="flex items-center gap-4 bg-zinc-900/50 p-2 rounded-2xl border border-white/5">
            <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-2">
              <Link href="/admin/agendamentos" className="p-2 text-zinc-600 hover:text-white"><List size={18} /></Link>
              <button type="button" className="p-2 rounded-lg bg-white/10 text-indigo-400"><LayoutGrid size={18} /></button>
            </div>
            <button type="button" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} className="p-2 text-white hover:bg-white/5 rounded-lg"><ChevronLeft size={20}/></button>
            <button type="button" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} className="p-2 text-white hover:bg-white/5 rounded-lg"><ChevronRight size={20}/></button>
          </div>
        </div>

        {/* CALENDÁRIO */}
        <div className="grid grid-cols-7 bg-[#0d1017] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
          {DIAS_SEMANA.map(d => <div key={d} className="py-4 text-center text-[10px] font-black uppercase text-zinc-500 border-b border-white/5">{d}</div>)}
          {Array.from({ length: 35 }).map((_, i) => {
            const day = i - 3;
            const isSelected = selectedDay === day;
            const hoje = new Date();
            const isToday = day === hoje.getDate() && currentDate.getMonth() === hoje.getMonth() && currentDate.getFullYear() === hoje.getFullYear();
            const temAgendamento = agendamentosExistentes.includes(day.toString());

            return (
              <div 
                key={i} 
                onClick={() => day > 0 && day <= 31 && setSelectedDay(day)}
                className={`min-h-[120px] p-4 border-r border-b border-white/5 cursor-pointer relative group transition-all ${isSelected ? 'bg-indigo-600/5' : 'hover:bg-white/[0.01]'} ${isToday ? 'ring-1 ring-inset ring-indigo-500/50' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-xs font-bold ${day > 0 && day <= 31 ? (isSelected ? 'text-indigo-500' : 'text-zinc-500') : 'text-transparent'}`}>
                    {day > 0 && day <= 31 ? day.toString().padStart(2, '0') : ''}
                  </span>
                  {temAgendamento && day > 0 && (
                    <div className="flex flex-col items-center gap-1">
                      <Briefcase size={12} className="text-emerald-500 animate-pulse" />
                      <span className="text-[8px] text-emerald-500 font-black uppercase tracking-tighter">Alocado</span>
                    </div>
                  )}
                </div>
                {temAgendamento && day > 0 && (
                  <div className="absolute bottom-2 left-4 right-4 h-1 bg-emerald-500/20 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-full" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedDay && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 h-full w-[380px] bg-[#0d1017] border-l border-white/10 p-8 z-50 overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-black text-white uppercase italic">Dia {selectedDay}</h3>
              <button type="button" onClick={() => setSelectedDay(null)} className="p-3 bg-zinc-900 rounded-2xl text-zinc-500 hover:text-white"><X size={20}/></button>
            </div>

            <div className="space-y-6">
              {detalhesAgendamento.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle size={14}/> Técnicos alocados no dia
                  </h4>
                  <div className="space-y-3">
                    {detalhesAgendamento.map((item) => (
                      <div key={item.id} className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-white uppercase italic">{item.profissionais?.nome}</p>
                            <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest">{item.profissionais?.especialidade}</p>
                            <p className="text-[9px] text-zinc-400 font-bold uppercase">{item.empresas?.nome_fantasia}</p>
                            <div className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-black rounded-md uppercase border border-emerald-500/20 mt-1">
                              {item.servicos?.nome}
                            </div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleExcluir(item.id)}
                            className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="h-px bg-white/5 my-6" />
                </div>
              )}

              <div className="space-y-4">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Nova Alocação</p>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase flex items-center gap-2"><Briefcase size={12}/> Empresa Cliente</label>
                  <select value={selectedEmpresa} onChange={e => setSelectedEmpresa(e.target.value)} className="w-full bg-zinc-900/50 border border-white/5 p-3 rounded-xl text-white text-xs outline-none focus:border-indigo-500/50">
                    <option value="">Selecione...</option>
                    {empresas.map(e => <option key={e.id} value={e.id}>{e.nome_fantasia}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase flex items-center gap-2"><Settings size={12}/> Serviço</label>
                  <select value={selectedServico} onChange={e => setSelectedServico(e.target.value)} className="w-full bg-zinc-900/50 border border-white/5 p-3 rounded-xl text-white text-xs outline-none focus:border-indigo-500/50">
                    <option value="">Selecione...</option>
                    {servicos.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                  </select>
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Filtrar especialistas..." className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs text-white outline-none focus:border-indigo-500/30" />
              </div>

              <div className="space-y-4 pb-10">
                {profissionais.length === 0 ? (
                  <p className="text-[10px] text-zinc-600 italic">Buscando profissionais...</p>
                ) : (
                  profissionais
                    .filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((pro) => (
                      <div key={pro.id} className="p-5 bg-white/[0.02] border border-white/5 rounded-[1.5rem] group hover:border-indigo-500/30 transition-all">
                        <div className="flex items-center justify-between mb-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-indigo-400"><User size={18}/></div>
                              <div>
                                <p className="text-xs font-bold text-white uppercase italic">{pro.nome}</p>
                                <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">{pro.especialidade || pro.cargo || 'Especialista'}</p>
                              </div>
                           </div>
                           <CheckCircle size={18} className="text-emerald-500/40" />
                        </div>
                        <button type="button" onClick={() => handleAlocar(pro)} disabled={isAllocating === pro.id} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase rounded-xl transition-all disabled:opacity-50">
                          {isAllocating === pro.id ? "Alocando..." : "Confirmar Escala"}
                        </button>
                      </div>
                    ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

}
