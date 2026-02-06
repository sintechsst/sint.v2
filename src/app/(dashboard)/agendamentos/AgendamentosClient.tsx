'use client'

import { useEffect, useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { CriarAgendamentoModal } from '@/components/agendamento/CriarAgendamentoModal'
import { AgendamentoTimeline } from '@/components/agendamento/AgendamentoTimeline'
import { cn } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'

interface Props {
  tenantId: string
  role: 'admin' | 'empresa'
}

interface Agendamento {
  id: string
  tipo_servico: string
  data_sugerida: string
  status: string
  prioridade: string
  empresas: { nome_fantasia: string } | null
  profissionais: { nome: string } | null
}

interface AgendamentoRow {
  id: string
  tipo_servico: string
  data_sugerida: string
  status: string
  prioridade: string
  empresas: { nome_fantasia: string }[] | null
  profissionais: { nome: string }[] | null
}

export default function AgendamentosClient({ tenantId, role }: Props) {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const deveAbrir = searchParams.get('novo')
    if (deveAbrir === 'true') {
      setIsModalOpen(true)
      window.history.replaceState(null, '', '/agendamentos')
    }
  }, [searchParams])

  useEffect(() => {
    if (!tenantId) return
    carregarAgendamentos()
  }, [tenantId])

  useEffect(() => {
    if (!tenantId) return

    const channel = supabase
      .channel('agendamentos-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agendamentos',
          filter: `tenant_id=eq.${tenantId}`,
        },
        () => {
          carregarAgendamentos()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [tenantId])

  
  async function carregarAgendamentos() {
    setLoading(true)

    const { data, error } = await supabase
      .from('agendamentos')
      .select(`
        id,
        tipo_servico,
        data_sugerida,
        status,
        prioridade,
        empresas ( nome_fantasia ),
        profissionais ( nome )
      `)
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Erro ao carregar agendamentos')
    } else {
      const rows = (data as AgendamentoRow[]) || []
      const normalized = rows.map((ag) => ({
        ...ag,
        empresas: ag.empresas?.[0] ?? null,
        profissionais: ag.profissionais?.[0] ?? null,
      }))
      setAgendamentos(normalized)
    }

    setLoading(false)
  }

  async function atualizarStatus(id: string, status: string) {
    const novoStatus = status === 'Pendente' ? 'Confirmado' : 'Cancelado'

    const { error } = await supabase
      .from('agendamentos')
      .update({ status: novoStatus })
      .eq('id', id)

    if (error) {
      toast.error('Erro ao atualizar status')
    } else {
      toast.success(`Status alterado para ${novoStatus}`)
      carregarAgendamentos()
    }
  }

  return (
    <Suspense fallback={<Loader2 className="animate-spin" />}>
      <div className="space-y-8">
        {/* HEADER ADAPTAVEL */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">
              Agendamentos
            </h1>
            <p className="text-zinc-500 dark:text-slate-500 font-medium">
              {role === 'admin'
                ? 'Gerencie todas as solicitacoes operacionais'
                : 'Solicite novos atendimentos de SST'}
            </p>
          </div>

          {role === 'empresa' && (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
            >
              <Plus size={18} /> Nova Solicitacao
            </button>
          )}
        </div>

        {/* LISTAGEM ADAPTAVEL */}
        {loading ? (
          <div className="flex justify-center p-20">
            <Loader2 className="animate-spin text-indigo-500" />
          </div>
        ) : (
          <div className="bg-white dark:bg-[#0d1017] border border-zinc-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-xl shadow-zinc-200/50 dark:shadow-none">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-slate-500 border-b border-zinc-100 dark:border-white/5">
                  <tr>
                    <th className="px-8 py-5">Empresa / Timeline</th>
                    <th className="px-8 py-5">Servico</th>
                    <th className="px-8 py-5">Especialista</th>
                    <th className="px-8 py-5">Data</th>
                    <th className="px-8 py-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-white/5 text-sm font-medium">
                  {agendamentos.map((ag) => (
                    <tr
                      key={ag.id}
                      className="group hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-all"
                    >
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-black italic uppercase text-zinc-900 dark:text-white tracking-tight text-base">
                            {ag.empresas?.nome_fantasia || 'N/A'}
                          </span>
                          <AgendamentoTimeline status={ag.status} />
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                            Servico
                          </span>
                          <span className="text-zinc-700 dark:text-zinc-300 font-bold">
                            {ag.tipo_servico}
                          </span>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                            Especialista
                          </span>
                          <span className="inline-flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            {ag.profissionais?.nome || 'A definir'}
                          </span>
                        </div>
                      </td>

                      <td className="px-8 py-6 text-zinc-500 dark:text-zinc-400 font-black font-mono text-xs">
                        {ag.data_sugerida.split('-').reverse().join('/')}
                      </td>

                      <td className="px-8 py-6 text-right">
                        {role === 'admin' ? (
                          <button
                            type="button"
                            onClick={() => atualizarStatus(ag.id, ag.status)}
                            className={cn(
                              'px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95 border',
                              ag.status?.toUpperCase() === 'PENDENTE'
                                ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                                : 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                            )}
                          >
                            {ag.status}
                          </button>
                        ) : (
                          <span
                            className={cn(
                              'px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border',
                              ag.status?.toUpperCase() === 'PENDENTE'
                                ? 'bg-amber-50 dark:bg-amber-500/5 text-amber-500 border-amber-100 dark:border-amber-500/10'
                                : 'bg-emerald-50 dark:bg-emerald-500/5 text-emerald-500 border-emerald-100 dark:border-emerald-500/10'
                            )}
                          >
                            {ag.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL DE CRIACAO */}
        {isModalOpen && (
          <CriarAgendamentoModal
            tenantId={tenantId}
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
              setIsModalOpen(false)
              carregarAgendamentos()
            }}
          />
        )}
      </div>
    </Suspense>
  )
}
