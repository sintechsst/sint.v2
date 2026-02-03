import { createClient } from '@supabase/supabase-js'
import process from "node:process";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL!
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN!

export async function enviarWhatsApp(
  telefone: string,
  mensagem: string
) {
  await fetch(WHATSAPP_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${WHATSAPP_TOKEN}`
    },
    body: JSON.stringify({
      phone: telefone,
      message: mensagem
    })
  })
}

interface AgendamentoRow {
  id: string
  status: string
  empresas: {
    nome_fantasia: string
    telefone: string
  }[]
}

export async function notificarAgendamentos() {
  const { data, error } = await supabase
    .from('agendamentos')
    .select(`
      id,
      status,
      empresas (nome_fantasia, telefone)
    `)
    .eq('status', 'Pendente')

  if (error) {
    console.error('Erro ao buscar agendamentos:', error)
    return
  }

  for (const ag of (data as AgendamentoRow[]) || []) {
    const empresa = ag.empresas?.[0]

    if (!empresa?.telefone) continue

    const msg = `📅 Novo agendamento criado
🏢 Empresa: ${empresa.nome_fantasia}
📌 Status: ${ag.status}`

    await enviarWhatsApp(empresa.telefone, msg)
  }
}
