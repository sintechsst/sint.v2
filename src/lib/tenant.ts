import { supabaseServer } from './supabase-server'

export async function getTenantContext() {
  const supabase = await supabaseServer()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) throw new Error('Não autenticado')

  const { data, error } = await supabase
    .from('tenant_users')
    .select('tenant_id, role, tenants(plano, ativo)')
    .eq('user_id', user.id)
    .single()

  if (error || !data) throw new Error('Contexto do tenant não encontrado')

  const tenantData = data.tenants as unknown as { plano: string; ativo: boolean }

  if (!tenantData?.ativo) {
    throw new Error('Tenant inativo')
  }

  return {
    tenantId: data.tenant_id,
    role: data.role,
    plano: tenantData.plano
  }
}
