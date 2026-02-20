"use client";

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Membership = {
  tenant_id: string
  role: string
  tenants: {
    nome: string
    plano: 'basic' | 'pro' | 'premium'
  }
}

type TenantContextType = {
  memberships: Membership[]
  activeTenant: Membership | null
  switchTenant: (tenantId: string) => void
  loading: boolean
}

const TenantContext = createContext<TenantContextType | null>(null)

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [activeTenant, setActiveTenant] = useState<Membership | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('tenant_users')
        .select(`
          tenant_id,
          role,
          tenants (
            id,
            nome,
            plano
          )
        `)
        .eq('user_id', user.id)

      if (data) {
        setMemberships(data)

        const savedTenant = localStorage.getItem('activeTenant')

        if (savedTenant) {
          const found = data.find(t => t.tenant_id === savedTenant)
          if (found) setActiveTenant(found)
        }

        if (!savedTenant && data.length === 1) {
          setActiveTenant(data[0])
          localStorage.setItem('activeTenant', data[0].tenant_id)
        }
      }

      setLoading(false)
    }

    load()
  }, [])

  function switchTenant(tenantId: string) {
    const found = memberships.find(t => t.tenant_id === tenantId)
    if (found) {
      setActiveTenant(found)
      localStorage.setItem('activeTenant', tenantId)
    }
  }

  return (
    <TenantContext.Provider value={{ memberships, activeTenant, switchTenant, loading }}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (!context) throw new Error('useTenant must be used inside TenantProvider')
  return context
}
