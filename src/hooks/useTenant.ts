import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Membership = {
  tenant_id: string
  role: string
}

export function useTenantRole() {
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [activeTenant, setActiveTenant] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('tenant_users')
        .select('tenant_id, role')
        .eq('user_id', user.id)

      if (!error && data) {
        setMemberships(data)

        // se só tiver 1 empresa → ativa automaticamente
        if (data.length === 1) {
          setActiveTenant(data[0].tenant_id)
        }
      }

      setLoading(false)
    }

    load()
  }, [])

  return {
    memberships,
    activeTenant,
    setActiveTenant,
    loading
  }
}
