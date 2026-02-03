import { createClient } from '@supabase/supabase-js'
import { gerarPDF } from '@/lib/pdf'
import { sendWhatsApp } from '@/lib/whatsapp'


export async function POST(req: Request) {
const supabase = createClient(
process.env.SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE!
)


const { agendamento_id, tenant_id } = await req.json()


const { data: tenant } = await supabase
.from('tenants')
.select('plano')
.eq('id', tenant_id)
.single()


if (tenant?.plano !== 'premium') {
  return Response.json({ error: 'Plano não autorizado' }, { status: 403 })
}

const { data } = await supabase
.from('agendamentos')
.select(`
*,
empresas(*),
profissionais(*)
`)
.eq('id', agendamento_id)
.single()


const pdfBuffer = await gerarPDF(data)


const path = `os/${tenant_id}/${agendamento_id}.pdf`


await supabase.storage
.from('documentos')
.upload(path, pdfBuffer)


await supabase
.from('os_ordens')
.insert({
tenant_id,
agendamento_id,
numero_os: `OS-${Date.now()}`,
pdf_url: path
})


await sendWhatsApp(data.empresas.responsavel_email, path)


return Response.json({ success: true })
}