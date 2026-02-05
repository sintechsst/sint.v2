import { supabaseServer } from '@/lib/supabase-server'
import AgendamentosClient from './AgendamentosClient'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AgendamentosPage() {
  const supabase = await supabaseServer()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Busca tenant e role com segurança no server
  const { data: tenantData, error } = await supabase
    .from('tenant_users')
    .select('tenant_id, role')
    .eq('user_id', user.id)
    .single()

  if (error || !tenantData) {
    redirect('/login')
  }
   console.log('tenantId', tenantData.tenant_id)

  return (
    <AgendamentosClient
      tenantId={tenantData.tenant_id}
      role={tenantData.role}
    />
  )
}
