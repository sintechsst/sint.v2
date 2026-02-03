import { supabaseServer } from './supabase-server'

export async function hasFeature(plano: string, feature: string) {
  const supabase = await supabaseServer()

  const { data } = await supabase
    .from('planos_features')
    .select('enabled')
    .eq('plano', plano)
    .eq('feature', feature)
    .single()

  return data?.enabled === true
}
