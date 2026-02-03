'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase.ts';
import { toast } from 'sonner';
import { 
  User, 
  FileText, 
  Briefcase, 
  Building2, 
  Calendar as CalIcon, 
  ArrowLeft, 
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '../../../components/ThemeToogle.tsx';

export default function AgendarExameMelhorado() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [empresas, setEmpresas] = useState<{id: string, nome_fantasia: string}[]>([]);

  const [formData, setFormData] = useState({
    empresa_id: '',
    nome_funcionario: '',
    cpf: '',
    tipo_exame: 'Admissional',
    funcao: '',
    data_preferencial: ''
  });

  useEffect(() => {
    async function getEmpresas() {
      const { data } = await supabase.from('empresas').select('id, nome_fantasia');
      if (data) setEmpresas(data);
    }
    getEmpresas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.empresa_id) return toast.error("Selecione a unidade.");
    setLoading(true);
    try {
      const { error } = await supabase.from('solicitacoes_exames').insert([{
        ...formData,
        status: 'pendente',
        tenant_id: '5602d2b4-e831-4145-a5f0-c2f05241d185'
      }]);
      if (error) throw error;
      setStep(2);
    } catch (_err) {
      toast.error("Erro ao enviar solicitação.");
    } finally {
      setLoading(false);
    }
  };

  // Estilos Adaptáveis (Dual Theme)
  const inputClass = "w-full bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 p-4 rounded-xl text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-400";
  const labelClass = "text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-2";

  if (step === 2) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 bg-zinc-50 dark:bg-[#050505] transition-colors">
        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-4 shadow-xl">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-4xl font-black italic uppercase text-zinc-900 dark:text-white tracking-tighter">Enviado!</h2>
        <Link href="/dashboard" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-500 transition-all">
          Voltar ao Painel
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* BARRA DE TOPO */}
        <div className="flex items-center justify-between bg-white dark:bg-zinc-900/50 backdrop-blur-md p-4 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg transition-colors text-zinc-600 dark:text-zinc-400">
              <ArrowLeft size={20} />
            </Link>
            <ThemeToggle />
          </div>
          <div className="text-right px-4">
            <h1 className="text-xl font-black italic uppercase tracking-tighter text-zinc-900 dark:text-white">
              Sintech <span className="text-indigo-600">SST</span>
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUNA PRINCIPAL */}
          <div className="lg:col-span-2 bg-white dark:bg-[#0d1017] border border-zinc-200 dark:border-white/5 shadow-xl dark:shadow-none rounded-[2.5rem] p-8 space-y-8">
            <header>
              <h2 className="text-2xl font-black uppercase italic text-zinc-900 dark:text-white tracking-tight">
                Novo Agendamento
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">Preencha os dados técnicos do colaborador.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}><User size={14}/> Colaborador</label>
                <input required type="text" value={formData.nome_funcionario} onChange={e => setFormData({...formData, nome_funcionario: e.target.value})} className={inputClass} placeholder="Nome completo" />
              </div>
              <div>
                <label className={labelClass}><FileText size={14}/> CPF</label>
                <input required type="text" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} className={inputClass} placeholder="000.000.000-00" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}><Briefcase size={14}/> Cargo / Função</label>
                <input required type="text" value={formData.funcao} onChange={e => setFormData({...formData, funcao: e.target.value})} className={inputClass} placeholder="Ex: Engenheiro" />
              </div>
              <div>
                <label className={labelClass}><Building2 size={14}/> Unidade</label>
                <select required value={formData.empresa_id} onChange={e => setFormData({...formData, empresa_id: e.target.value})} className={inputClass}>
                  <option value="">Selecione a empresa...</option>
                  {empresas.map(emp => <option key={emp.id} value={emp.id}>{emp.nome_fantasia}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Tipo de Exame</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Admissional', 'Periódico', 'Demissional', 'Retorno ao Trabalho'].map((tipo) => (
                  <button
                    key={tipo}
                    type="button"
                    onClick={() => setFormData({...formData, tipo_exame: tipo})}
                    className={`py-3 px-2 rounded-xl border text-[10px] font-black uppercase tracking-tighter transition-all ${
                      formData.tipo_exame === tipo 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                      : 'bg-transparent border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-indigo-500'
                    }`}
                  >
                    {tipo}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* COLUNA LATERAL */}
          <div className="space-y-6">
            <div className="bg-indigo-600 dark:bg-indigo-600/10 border border-indigo-200 dark:border-indigo-500/20 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-600/20">
              <label className="text-[11px] font-black uppercase text-white dark:text-indigo-400 mb-4 block tracking-widest">
                Agendar para:
              </label>
              <div className="relative">
                <CalIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 dark:text-indigo-500" size={20} />
                <input 
                  required
                  type="date" 
                  value={formData.data_preferencial}
                  onChange={e => setFormData({...formData, data_preferencial: e.target.value})}
                  className="w-full bg-white/20 dark:bg-black/40 border border-white/20 dark:border-indigo-500/30 p-4 pl-12 rounded-xl text-white dark:text-white font-bold outline-none placeholder:text-white/50"
                />
              </div>
              
              <button disabled={loading} type="submit" className="w-full mt-6 bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-xl transition-all active:scale-95 hover:bg-zinc-50 dark:hover:bg-indigo-500">
                {loading ? 'Processando...' : 'Confirmar Pedido'}
              </button>
            </div>

            <div className="p-6 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-4 items-start">
              <AlertTriangle className="text-amber-600 dark:text-amber-500 shrink-0" size={20} />
              <p className="text-[10px] text-amber-700 dark:text-amber-500 font-bold uppercase leading-tight">
                Importante: Verifique se o colaborador possui os documentos de identificação originais para o atendimento.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}