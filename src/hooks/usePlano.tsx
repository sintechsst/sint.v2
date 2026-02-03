import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function usePlano() {
  const [plano, setPlano] = useState<'basic' | 'pro' | 'premium'>('basic')

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('tenant_users')
        .select(`
          tenants (
            plano
          )
        `)
        .limit(1)
        .maybeSingle()

      if (error) {
        console.error('Erro ao buscar plano:', error)
        return
      }

      const planoTenant = data?.tenants?.[0]?.plano

      if (planoTenant) {
        setPlano(planoTenant)
      }
    }

    load()
  }, [])

  return plano
}
