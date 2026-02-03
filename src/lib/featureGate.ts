import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function checkFeature(feature: string) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        // 2. Map the methods manually
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 3. Use the awaited cookieStore for your logic
  const tenantId = cookieStore.get('tenant_id')?.value
  
  if (!tenantId) throw new Error('Tenant não identificado')

  const { data: tenant } = await supabase
    .from('tenants')
    .select('plano')
    .eq('id', tenantId)
    .single()

  const { data: featureRow } = await supabase
    .from('planos_features')
    .select('enabled')
    .eq('plano', tenant?.plano)
    .eq('feature', feature)
    .single()

  if (!featureRow?.enabled) {
    throw new Error('Recurso não disponível no seu plano')
  }
}
