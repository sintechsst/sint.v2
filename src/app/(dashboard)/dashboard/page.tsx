'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  Users,
  CalendarCheck,
  FileText,
  Activity,
  ArrowUpRight,
  Loader2,
  Bell,
  Building2
} from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToogle';

interface Unidade {
  id: string;
  nome: string;
}

interface Documento {
  id: string;
  nome: string;
  created_at: string;
}

const cn = (...inputs: (string | boolean | undefined | null)[]) => inputs.filter(Boolean).join(' ');

export default function DashboardCliente() {
  const [stats, setStats] = useState({
    totalFuncionarios: 0,
    examesMes: 0,
    totalDocumentos: 0,
  });

  const [loading, setLoading] = useState(true);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [unidadeAtiva, setUnidadeAtiva] = useState<Unidade | null>(null);

  // 1. Carregar Permissões
  useEffect(() => {
    async function carregarPermissoes() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          setLoading(false);
          toast.error("Sessão expirada. Faça login novamente.");
          return;
        }

        const userId = user.id;
        console.log("Usuário logado:", user.email, "ID:", userId);

        // Altere esta linha no seu useEffect:
        const { data: vinculos, error: vError } = await supabase
          .from('tenant_users')
          .select(`tenant_id, tenants ( id, nome )`) 
          .eq('user_id', userId);

        if (vError) throw vError;

        if (vinculos && vinculos.length > 0) {
          const empresas = vinculos.map((v: any) => ({
            id: v.tenants.id,
            nome: v.tenants.nome
          }));

          setUnidades(empresas);
          setUnidadeAtiva(empresas[0]);
        } else {
          setLoading(false);
          toast.info("Perfil sem empresas vinculadas.");
        }
      } catch (err) {
        console.error("Erro no carregamento:", err);
        setLoading(false);
      }
    }
    carregarPermissoes();
  }, []);

  useEffect(() => {
    if (!unidadeAtiva) return;

    async function carregarDashboard() {
      try {
        setLoading(true);
        const empresaId = unidadeAtiva!.id;

        const [prof, agend, doc, listaDocs] = await Promise.all([
          supabase.from('profissionais').select('*', { count: 'exact', head: true }).eq('tenant_id', empresaId),
          supabase.from('agendamentos').select('*', { count: 'exact', head: true }).eq('tenant_id', empresaId).neq('status', 'CONCLUÍDO'),
          supabase.from('documentos').select('*', { count: 'exact', head: true }).eq('tenant_id', empresaId),
          supabase.from('documentos')
            .select('*')
            .eq('tenant_id', empresaId)
            .order('created_at', { ascending: false })
            .limit(3)
        ]);

        setStats({
          totalFuncionarios: prof.count || 0,
          examesMes: agend.count || 0,
          totalDocumentos: doc.count || 0,
        });

        setDocumentos(listaDocs.data || []);
      } catch (_err) {
        toast.error("Erro ao carregar dados.");
      } finally {
        setLoading(false);
      }
    }
    carregarDashboard();
  }, [unidadeAtiva]);

  const cards = [
    { label: 'Efetivo Total', value: stats.totalFuncionarios, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-600/10' },
    { label: 'Exames Programados', value: stats.examesMes, icon: CalendarCheck, color: 'text-emerald-600', bg: 'bg-emerald-600/10' },
    { label: 'Docs. Disponíveis', value: stats.totalDocumentos, icon: FileText, color: 'text-sky-600', bg: 'bg-sky-600/10' },
  ];

  return (
    <div className="space-y-10 p-2">
      <div className="flex flex-wrap gap-2 pb-4 border-b border-zinc-100 dark:border-white/5">
        {unidades.map((u) => (
          <button
            key={u.id}
            type="button"
            onClick={() => setUnidadeAtiva(u)}
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border",
              unidadeAtiva?.id === u.id
                ? "bg-indigo-600 text-white border-indigo-600 shadow-lg"
                : "bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-white/5"
            )}
          >
            <Building2 size={14} />
            {u.nome}
          </button>
        ))}
      </div>

      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            Painel <span className="text-indigo-600">Estratégico</span>
          </h1>
          <p className="text-zinc-500 font-medium text-sm">
            Visualizando como: <span className="text-indigo-500 font-bold">{unidadeAtiva?.nome || 'Carregando...'}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button type="button" className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-2xl text-zinc-400">
            <Bell size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 flex justify-center py-10"><Loader2 className="animate-spin text-indigo-500" /></div>
        ) : (
          cards.map((card, idx) => (
            <div key={idx} className="bg-white dark:bg-[#0d1017] border border-zinc-200 dark:border-white/5 p-8 rounded-[2.5rem] relative shadow-xl">
              <div className={cn("p-4 rounded-2xl w-fit mb-6", card.bg, card.color)}>
                <card.icon size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{card.label}</h3>
                <p className="text-5xl font-black italic tracking-tighter text-zinc-900 dark:text-white">{card.value}</p>
              </div>
              <ArrowUpRight className="absolute top-8 right-8 text-zinc-300" size={20} />
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[2.5rem] text-white flex flex-col justify-between min-h-[250px] shadow-xl shadow-indigo-600/20">
          <div className="space-y-4">
            <div className="bg-white/20 w-fit p-3 rounded-xl backdrop-blur-md">
              <Activity size={24} />
            </div>
            <h2 className="text-2xl font-black uppercase italic leading-none">Solicitar Novo<br />Exame Clínico</h2>
          </div>
          <Link href="/agendamentos?novo=true" className="bg-white text-indigo-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] text-center hover:bg-indigo-50 transition-all">
            Abrir Solicitação
          </Link>
        </div>

        <div className="bg-white dark:bg-[#0d1017] border border-zinc-200 dark:border-white/5 p-8 rounded-[2.5rem] shadow-xl">
          <h3 className="text-zinc-900 dark:text-white font-black uppercase italic text-lg mb-6 flex items-center gap-3">
            <FileText className="text-indigo-600 dark:text-indigo-500" size={20} /> Documentos Recentes
          </h3>
          <div className="space-y-4">
            {documentos.length > 0 ? (
              documentos.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-white/[0.02] border border-zinc-100 dark:border-white/5 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <FileText className="text-indigo-500" size={20} />
                    <div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">{doc.nome}</p>
                      <p className="text-[10px] text-zinc-400 uppercase font-black">{new Date(doc.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <ArrowUpRight size={18} className="text-zinc-300" />
                </div>
              ))
            ) : (
              <p className="text-center py-10 text-zinc-400 text-[10px] uppercase font-black italic">Nenhum documento disponível</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
