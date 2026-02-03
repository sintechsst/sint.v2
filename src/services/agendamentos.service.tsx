import { supabase } from '../lib/supabase.ts';

export function listarAgendamentos(tenantId: string) {
  return supabase
    .from('agendamentos')
    .select('*, empresas(nome_fantasia), profissionais(nome)')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });
}

export function listarEmpresas(tenantId: string) {
  return supabase
    .from('empresas')
    .select('id, nome_fantasia')
    .eq('tenant_id', tenantId)
    .order('nome_fantasia');
}

export function listarEscala(tenantId: string) {
  return supabase
    .from('escala_medica')
    .select('*, profissionais(nome, especialidade)')
    .eq('tenant_id', tenantId);
}

export function criarAgendamento(payload: {
  tenant_id: string;
  empresa_id: string;
  tipo_servico: string;
  data_sugerida: string;
  profissional_id: string;
  observacoes?: string;
}) {
  return supabase.from('agendamentos').insert([
    {
      ...payload,
      status: 'Pendente',
    },
  ]);
}

export function atualizarStatusAgendamento(
  id: string,
  tenantId: string,
  status: 'Pendente' | 'Confirmado'
) {
  return supabase
    .from('agendamentos')
    .update({ status })
    .eq('id', id)
    .eq('tenant_id', tenantId);
}
