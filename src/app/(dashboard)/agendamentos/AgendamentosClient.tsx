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
  empresas: { nome_fantasia: string }[]
  profissionais: { nome: string }[]
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
    carregarAgendamentos()
  }, [])

  useEffect(() => {
  const channel = supabase
    .channel('agendamentos-realtime')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'agendamentos',
        filter: `tenant_id=eq.${tenantId}`
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
      setAgendamentos((data as Agendamento[]) || [])
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
      {/* TODO seu JSX exatamente igual ao que você já tem */}
    </Suspense>
  )
}
