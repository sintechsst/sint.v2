import cron from 'node-cron'
import { notificarAgendamentos } from './whatsappSender.ts'
import { gerarOS } from './osGenerator.ts'
import { createClient } from '@supabase/supabase-js'
import process from "node:process";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

cron.schedule('*/5 * * * *', async () => {
  console.log('Pipeline rodando...')

  await notificarAgendamentos()

  const { data } = await supabase
    .from('agendamentos')
    .select('id')
    .eq('status', 'Confirmado')

  for (const ag of data || []) {
    await gerarOS(ag.id)
  }
})
