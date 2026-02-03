import { createClient } from '@supabase/supabase-js'
import { PDFDocument, StandardFonts } from 'pdf-lib'
import { enviarWhatsApp } from './whatsappSender'
import process from "node:process";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface AgendamentoRow {
  id: string
  tenant_id: string
  data_sugerida: string
  empresas: {
    nome_fantasia: string
    telefone: string
  }[]
  profissionais: {
    nome: string
  }[]
}

export async function gerarOS(agendamentoId: string) {
  const { data, error } = await supabase
    .from('agendamentos')
    .select(`
      id,
      tenant_id,
      data_sugerida,
      empresas (nome_fantasia, telefone),
      profissionais (nome)
    `)
    .eq('id', agendamentoId)
    .single()

  if (error || !data) {
    console.error('Erro ao buscar agendamento:', error)
    return
  }

  const ag = data as AgendamentoRow
  const empresa = ag.empresas?.[0]
  const profissional = ag.profissionais?.[0]

  if (!empresa || !profissional) {
    console.warn('Agendamento sem empresa ou profissional vinculado')
    return
  }

  const pdf = await PDFDocument.create()
  const page = pdf.addPage()
  const font = await pdf.embedFont(StandardFonts.Helvetica)

  page.drawText(`ORDEM DE SERVIÇO`, { x: 50, y: 750, size: 20, font })
  page.drawText(`Empresa: ${empresa.nome_fantasia}`, { x: 50, y: 700, size: 12, font })
  page.drawText(`Profissional: ${profissional.nome}`, { x: 50, y: 670, size: 12, font })
  page.drawText(`Data: ${ag.data_sugerida}`, { x: 50, y: 640, size: 12, font })

  const pdfBytes = await pdf.save()

  const fileName = `os/${ag.tenant_id}/os-${ag.id}.pdf`

  const { error: uploadError } = await supabase.storage
    .from('os-pdfs')
    .upload(fileName, pdfBytes, {
      contentType: 'application/pdf',
      upsert: true
    })

  if (uploadError) {
    console.error('Erro ao subir PDF:', uploadError)
    return
  }

  const { data: url } = supabase.storage
    .from('os-pdfs')
    .getPublicUrl(fileName)

  await supabase.from('os_ordens').insert({
    tenant_id: ag.tenant_id,
    agendamento_id: ag.id,
    numero_os: `OS-${Date.now()}`,
    pdf_url: url.publicUrl,
    status: 'Gerada'
  })


  const msg = `📄 Ordem de Serviço gerada!
🏢 Empresa: ${empresa.nome_fantasia}
👷 Profissional: ${profissional.nome}
📅 Data: ${ag.data_sugerida}
🔗 PDF: ${url.publicUrl}`

  await enviarWhatsApp(empresa.telefone, msg)
}

