import { supabaseServer } from './supabaseServer'

export async function getTenantContext() {
  const supabase = supabaseServer()

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error('Não autenticado')

  const { data } = await supabase
    .from('tenant_users')
    .select('tenant_id, role, tenants(plano, ativo)')
    .eq('user_id', user.user.id)
    .single()

  if (!data?.tenants.ativo) {
    throw new Error('Tenant inativo')
  }

  return {
    tenantId: data.tenant_id,
    role: data.role,
    plano: data.tenants.plano
  }
}
