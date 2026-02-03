'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Shield, Clock, User, FileText, Building2 } from 'lucide-react'

interface AuditLog {
  id: number
  created_at: string
  action: string
  metadata: any
  documentos?: {
    nome_arquivo: string
  }
  empresas?: {
    nome_fantasia: string
  }
  users?: {
    email: string
  }
}

export default function AuditLedgerPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)

  async function loadLogs() {
    setLoading(true)

    const { data, error } = await supabase
      .from('audit_logs')
      .select(`
        id,
        created_at,
        action,
        metadata,
        documentos (nome_arquivo),
        empresas (nome_fantasia),
        users:auth.users (email)
      `)
      .order('created_at', { ascending: false })
      .limit(200)

    if (!error && data) setLogs(data)
    setLoading(false)
  }

  useEffect(() => {
    loadLogs()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-red-400 flex items-center gap-3">
          <Shield /> Ledger Global
        </h1>
        <p className="text-slate-500 font-medium italic">
          Registro imutável de ações do sistema
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <Clock className="animate-spin text-red-500" size={32} />
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map(log => (
            <div
              key={log.id}
              className="bg-[#0d1017] border border-red-500/20 p-5 rounded-3xl flex justify-between items-center"
            >
              <div className="space-y-1">
                <p className="text-[10px] text-red-400 font-black uppercase tracking-widest">
                  {log.action}
                </p>
                <p className="text-white font-bold text-sm flex items-center gap-2">
                  <FileText size={14} />
                  {log.documentos?.nome_arquivo || '—'}
                </p>
                <p className="text-[10px] text-slate-500 flex items-center gap-2">
                  <Building2 size={12} />
                  {log.empresas?.nome_fantasia || 'Sistema'}
                </p>
              </div>

              <div className="text-right space-y-1">
                <p className="text-[10px] text-slate-400 flex items-center gap-2 justify-end">
                  <User size={12} />
                  {log.users?.email || 'system'}
                </p>
                <p className="text-[9px] text-slate-600">
                  {new Date(log.created_at).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
