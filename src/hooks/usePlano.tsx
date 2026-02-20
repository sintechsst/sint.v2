import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function usePlano(activeTenant: string | null) {
  const [plano, setPlano] = useState<'basic' | 'pro' | 'premium'>('basic')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!activeTenant) return

    async function load() {
      const { data, error } = await supabase
        .from('tenants')
        .select('plano')
        .eq('id', activeTenant)
        .single()

      if (!error && data) {
        setPlano(data.plano)
      }

      setLoading(false)
    }

    load()
  }, [activeTenant])

  return { plano, loading }
}
