"use client";

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Plano = 'basic' | 'pro' | 'premium'

type Membership = {
  tenant_id: string
  role: string
  tenant: {
    id: string
    nome: string
    plano: Plano
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

    if (!user) {
      setLoading(false)
      return
    }

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

    if (data && data.length > 0) {

      const normalized: Membership[] = data.map((item: any) => ({
        tenant_id: item.tenant_id,
        role: item.role,
        tenant: item.tenants[0]
      }))

      setMemberships(normalized)

      const savedTenant = localStorage.getItem('activeTenant')

      if (savedTenant) {
        const found = normalized.find(t => t.tenant_id === savedTenant)
        if (found) setActiveTenant(found)
      }

      if (!savedTenant && normalized.length === 1) {
        setActiveTenant(normalized[0])
        localStorage.setItem('activeTenant', normalized[0].tenant_id)
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
