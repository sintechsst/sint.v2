"use client"

import { useTenant } from "@/contexts/TenantContext"

export default function SelectTenantPage() {
  const { memberships, switchTenant } = useTenant()

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-10">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-8">
          Selecione a Empresa
        </h1>

        <div className="grid gap-4">
          {memberships.map((m) => (
            <div
              key={m.tenant_id}
              onClick={() => {
                switchTenant(m.tenant_id)
                window.location.href = "/dashboard"
              }}
              className="p-6 bg-zinc-900 rounded-xl cursor-pointer hover:bg-zinc-800 transition"
            >
              <h2 className="text-xl font-semibold">
                {m.tenant.nome}
              </h2>

              <p className="text-sm text-zinc-400">
                Plano: {m.tenant.plano}
              </p>

              <p className="text-xs text-zinc-500 mt-1">
                Perfil: {m.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
