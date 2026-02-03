import { supabase } from '@/lib/supabase';

export function useAgendamentoActions() {
  const atualizarStatus = async (
    id: string,
    status: 'Pendente' | 'Confirmado' | 'Cancelado'
  ) => {
    const { error } = await supabase
      .from('agendamentos')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  };

  return {
    confirmar: (id: string) => atualizarStatus(id, 'Confirmado'),
    cancelar: (id: string) => atualizarStatus(id, 'Cancelado'),
  };
}
