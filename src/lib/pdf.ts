import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export async function gerarPDF(agendamento: any) {
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([595, 842]) // A4

  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const { height } = page.getSize()

  let y = height - 50

  function line(text: string) {
    page.drawText(text, {
      x: 50,
      y,
      size: 12,
      font,
      color: rgb(1, 1, 1)
    })
    y -= 20
  }

  line('ORDEM DE SERVIÇO')
  line('----------------------------------')
  line(`Empresa: ${agendamento.empresas?.nome_fantasia || '-'}`)
  line(`Serviço: ${agendamento.tipo_servico}`)
  line(`Data: ${agendamento.data_sugerida}`)
  line(`Profissional: ${agendamento.profissionais?.nome || '-'}`)
  line(`Observações: ${agendamento.observacoes || '-'}`)
  line('')
  line(`Gerado em: ${new Date().toLocaleString('pt-BR')}`)

  const pdfBytes = await pdf.save()

  return Buffer.from(pdfBytes)
}
