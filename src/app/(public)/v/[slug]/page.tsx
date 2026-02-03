import { supabasePublic } from '@/lib/supabase-public'
import { notFound } from 'next/navigation'
import { ShieldCheck, Calendar, Building2, Fingerprint, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default async function PublicValidationPage({
  params
}: {
  params: { slug: string }
}) {
  const { data, error } = await supabase
    .from('premium_auditorias')
    .select(`
      hash_original, 
      criado_em, 
      laudos!inner ( 
        id,
        titulo, 
        tipo_laudo, 
        empresas!inner ( 
          id,
          nome_fantasia 
        ) 
      )
    `)
    .eq('slug_validacao', params.slug)
    .single()

  if (error || !data) return notFound()

  const laudo = Array.isArray(data.laudos) ? data.laudos[0] : data.laudos
  const empresa = Array.isArray(laudo?.empresas)
    ? laudo.empresas[0]
    : laudo?.empresas

  // Log silencioso (não quebra a página se falhar)
  if (laudo?.id && empresa?.id) {
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/audit-log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: params.slug,
        entidade_id: laudo.id,
        empresa_id: empresa.id,
        source: 'qr_or_public'
      })
    }).catch(() => {})
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full -z-10" />

      <div className="w-full max-w-xl">
        <div className="text-center mb-8 space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-emerald-500 text-xs font-black uppercase tracking-widest animate-pulse">
            <CheckCircle2 size={14} /> Documento Autêntico
          </div>

          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            Sintech <span className="text-indigo-500">Protocol</span>
          </h1>

          <p className="text-zinc-500 text-sm font-medium">
            Verificação Pública • Registro Imutável
          </p>
        </div>

        <div className="bg-[#0d1017] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <ShieldCheck size={120} />
          </div>

          <div className="space-y-8 relative z-10">
            <div className="flex gap-4">
              <div className="bg-white/5 p-4 rounded-2xl text-indigo-500">
                <Building2 size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                  Emissor / Empresa
                </p>
                <h2 className="text-xl font-bold">
                  {empresa?.nome_fantasia || 'N/A'}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">
                  Tipo de Documento
                </p>
                <div className="flex items-center gap-2 font-bold text-sm">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                  {laudo?.tipo_laudo || 'N/A'}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">
                  Emitido em
                </p>
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Calendar size={14} className="text-zinc-600" />
                  {new Date(data.criado_em).toLocaleString('pt-BR')}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Fingerprint size={14} className="text-indigo-500" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                  Impressão Digital Criptográfica (SHA-256)
                </p>
              </div>

              <div className="bg-black/50 border border-white/5 p-4 rounded-2xl break-all">
                <code className="text-[11px] text-indigo-400/80 leading-relaxed">
                  {data.hash_original}
                </code>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] text-zinc-600 uppercase tracking-[0.3em] font-bold">
          Registro Público Verificável • Sintech SST • Ledger Digital
        </p>
      </div>
    </div>
  )
}
