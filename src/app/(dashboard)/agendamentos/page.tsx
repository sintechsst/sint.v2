import { supabaseServer } from '@/lib/supabase-server'
import AgendamentosClient from './AgendamentosClient'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AgendamentosPage() {
  try {
    const supabase = await supabaseServer()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('AgendamentosPage: usuário não autenticado', userError)
      redirect('/login')
    }

    // Busca tenant e role com segurança no server
    const { data: tenantData, error } = await supabase
      .from('tenant_users')
      .select('tenant_id, role')
      .eq('user_id', user.id)
      .single()

    if (error || !tenantData) {
      console.error('AgendamentosPage: erro ao buscar tenant', error)
      redirect('/login?error=no-tenant')
    }

    return (
      <AgendamentosClient
        tenantId={tenantData.tenant_id}
        role={tenantData.role}
      />
    )
  } catch (err) {
    console.error('AgendamentosPage: erro inesperado', err)
    redirect('/login?error=agendamentos')
  }
}
