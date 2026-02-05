"use client"

import { useEffect, useState } from "react"

export default function AdminWhatsAppPage() {
  const [apiUrl, setApiUrl] = useState<string | null>(null)
  const [tokenSet, setTokenSet] = useState<boolean | null>(null)

  useEffect(() => {
    setApiUrl(process.env.NEXT_PUBLIC_WHATSAPP_API_URL || null)
    setTokenSet(!!process.env.NEXT_PUBLIC_WHATSAPP_TOKEN)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">WhatsApp API</h1>
        <p className="text-sm text-zinc-400">
          Painel de integração para envio de mensagens e status de conexão.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
          Status de Configuração
        </div>

        <div className="grid gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">API URL</span>
            <span className={apiUrl ? "text-emerald-400" : "text-red-400"}>
              {apiUrl ? "Configurado" : "Ausente"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Token</span>
            <span className={tokenSet ? "text-emerald-400" : "text-red-400"}>
              {tokenSet ? "Configurado" : "Ausente"}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <p className="text-sm text-zinc-400">
          Dica: se este painel estiver vazio em produção, configure as envs no
          Vercel e faça redeploy. Para maior segurança, mantenha o token apenas
          em envs server-side e use rotas de API.
        </p>
      </div>
    </div>
  )
}
