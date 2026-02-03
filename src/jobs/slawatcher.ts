import { createClient } from '@supabase/supabase-js'
import process from "node:process";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function checkSLA() {
  const { data } = await supabase
    .from('agendamentos')
    .select('*')
    .eq('status', 'Pendente')

  for (const ag of data || []) {
    const diff = Date.now() - new Date(ag.created_at).getTime()

    if (diff > 1000 * 60 * 60 * 24) {
      await supabase
        .from('agendamentos')
        .update({ prioridade: 'Alta' })
        .eq('id', ag.id)
    }
  }
}
