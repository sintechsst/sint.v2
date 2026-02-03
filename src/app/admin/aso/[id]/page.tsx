'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Printer, ChevronLeft, ShieldCheck } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

export default function ASOPage() {
  const { id } = useParams()
  const [dados, setDados] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // URL para validação (substitua pelo seu domínio real em produção)
  const validationUrl = `https://seusite.com.br/validar/${id}`

  useEffect(() => {
    async function fetchASOData() {
      const { data } = await supabase
        .from('agendamentos')
        .select(`
          *,
          empresas (nome_fantasia, cnpj, endereco),
          profissionais (nome, crm, especialidade),
          exames_complementares (*)
        `)
        .eq('id', id)
        .single()

      if (data) setDados(data)
      setLoading(false)
    }
    fetchASOData()
  }, [id])

  if (loading) return <div className="p-20 text-center font-black uppercase italic animate-pulse">Gerando Documento...</div>
  if (!dados) return <div className="p-20 text-center uppercase font-black">Agendamento não encontrado.</div>

  return (
    <div className="min-h-screen bg-zinc-100 p-4 sm:p-8 print:p-0 print:bg-white selection:bg-indigo-100">
      
      {/* Menu de Ações (Oculto na impressão) */}
      <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center print:hidden">
        <button type="button" onClick={() => window.history.back()} className="flex items-center gap-2 text-zinc-500 font-bold uppercase text-[10px] hover:text-black transition-colors">
          <ChevronLeft size={16} /> Voltar ao Painel
        </button>
        <button
        type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] shadow-xl hover:bg-zinc-800 transition-all active:scale-95"
        >
          <Printer size={16} /> Imprimir ASO
        </button>
      </div>

      {/* Papel A4 */}
      <div className="max-w-[210mm] mx-auto bg-white shadow-2xl p-[15mm] text-black font-sans print:shadow-none print:max-w-full relative overflow-hidden">
        
        {/* Marca d'água sutil para segurança */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <h1 className="text-[150px] font-black -rotate-45 uppercase">Sintech</h1>
        </div>

        {/* Cabeçalho Profissional */}
        <div className="border-b-4 border-black pb-6 mb-8 flex justify-between items-end relative z-10">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <ShieldCheck size={24} />
              <span className="font-black uppercase tracking-tighter text-xl">Sintech Medicina</span>
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight">Atestado de Saúde Ocupacional</h1>
            <p className="text-[11px] font-bold text-zinc-500 uppercase italic">Natureza do Exame: {dados.tipo_servico}</p>
          </div>
          <div className="text-right text-[10px] font-bold uppercase leading-tight">
            <p>ID: {dados.id.slice(0, 8)}</p>
            <p>Emissão: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        {/* 1. Empresa */}
        <section className="mb-8 relative z-10">
          <h2 className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase mb-3 inline-block">01. Identificação da Empresa</h2>
          <div className="grid grid-cols-3 gap-6 text-[11px] border border-zinc-100 p-4 rounded-lg">
            <div className="col-span-2">
              <p className="text-zinc-500 uppercase text-[9px] font-black">Razão Social</p>
              <p className="font-bold text-sm uppercase">{dados.empresas?.nome_fantasia}</p>
            </div>
            <div>
              <p className="text-zinc-500 uppercase text-[9px] font-black">CNPJ</p>
              <p className="font-bold text-sm">{dados.empresas?.cnpj}</p>
            </div>
          </div>
        </section>

        {/* 2. Trabalhador */}
        <section className="mb-8 relative z-10">
          <h2 className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase mb-3 inline-block">02. Dados do Trabalhador</h2>
          <div className="grid grid-cols-2 gap-y-4 gap-x-10 text-[11px] border border-zinc-100 p-4 rounded-lg">
            <div>
              <p className="text-zinc-500 uppercase text-[9px] font-black">Nome Completo</p>
              <p className="font-bold text-sm uppercase">{dados.nome_funcionario}</p>
            </div>
            <div>
              <p className="text-zinc-500 uppercase text-[9px] font-black">Função / Cargo</p>
              <p className="font-bold text-sm uppercase">{dados.funcao || 'Operacional'}</p>
            </div>
            <div>
              <p className="text-zinc-500 uppercase text-[9px] font-black">CPF / Documento</p>
              <p className="font-bold text-sm">{dados.documento || '---'}</p>
            </div>
            <div>
              <p className="text-zinc-500 uppercase text-[9px] font-black">Setor</p>
              <p className="font-bold text-sm uppercase">{dados.setor || 'Geral'}</p>
            </div>
          </div>
        </section>

        {/* 3. Exames e Riscos */}
        <div className="grid grid-cols-2 gap-8 mb-10 relative z-10">
          <section>
            <h2 className="bg-zinc-800 text-white px-3 py-1 text-[10px] font-black uppercase mb-3 inline-block">03. Riscos</h2>
            <div className="text-[10px] text-zinc-600 space-y-1 italic border-l-2 border-zinc-200 pl-3">
              <p>• Ausência de riscos físicos</p>
              <p>• Ausência de riscos químicos</p>
              <p>• Riscos ergonômicos controlados</p>
            </div>
          </section>
          <section>
            <h2 className="bg-zinc-800 text-white px-3 py-1 text-[10px] font-black uppercase mb-3 inline-block">04. Exames Realizados</h2>
            <div className="text-[10px] space-y-2">
              <div className="flex justify-between border-b border-zinc-100 pb-1">
                <span className="font-bold uppercase">Avaliação Clínica</span>
                <span>{new Date(dados.data_sugerida).toLocaleDateString('pt-BR')}</span>
              </div>
              {dados.exames_complementares?.map((ex: any) => (
                <div key={ex.id} className="flex justify-between border-b border-zinc-100 pb-1">
                  <span className="font-bold uppercase">{ex.nome_exame}</span>
                  <span>{new Date(ex.updated_at).toLocaleDateString('pt-BR')}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Parecer Final (O Coração do ASO) */}
        <section className="mb-12 relative z-10">
          <div className="border-[3px] border-black p-6 text-center rounded-2xl">
            <h3 className="text-[11px] font-black uppercase mb-2 tracking-widest text-zinc-500">Conclusão Médica Ocupacional</h3>
            <p className="text-4xl font-black uppercase italic leading-none">Apto para a Função</p>
            <p className="text-[9px] mt-2 font-bold text-zinc-400 uppercase">Considerado apto para exercer as atividades propostas.</p>
          </div>
        </section>

        {/* Assinaturas e QR Code */}
        <div className="mt-20 flex justify-between items-end relative z-10">
          <div className="w-1/3 text-center text-[10px] font-bold uppercase">
            <div className="border-t-2 border-black pt-2 mb-1">{dados.nome_funcionario}</div>
            <p className="font-normal text-[8px] text-zinc-500 italic">Assinatura do Trabalhador</p>
          </div>

          {/* QR Code de Validação */}
          <div className="flex flex-col items-center gap-2">
            <div className="p-2 border border-zinc-200 rounded-xl bg-white shadow-sm">
              <QRCodeSVG value={validationUrl} size={64} level="H" />
            </div>
            <p className="text-[7px] font-black uppercase text-zinc-400 tracking-tighter">Validar Documento</p>
          </div>

          <div className="w-1/3 text-center text-[10px] font-bold uppercase">
            <div className="border-t-2 border-black pt-2 mb-1">{dados.profissionais?.nome}</div>
            <p className="text-indigo-600 italic">{dados.profissionais?.crm}</p>
            <p className="font-normal text-[8px] text-zinc-500 italic">Médico Examinador / Coordenador</p>
          </div>
        </div>

        {/* Rodapé de Segurança */}
        <div className="mt-16 pt-6 border-t border-zinc-100 text-[8px] text-zinc-400 text-center uppercase font-bold tracking-widest">
          Este documento foi gerado eletronicamente e sua autenticidade pode ser verificada via QR Code.
        </div>

      </div>
    </div>
  )
}