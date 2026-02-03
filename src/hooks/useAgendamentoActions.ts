import { listarAgendamentos } from "@/services/agendamentos.service";
import { Agendamento } from "@/types/agendamento";
import { useEffect, useState } from "react";

let cache: Record<string, any[]> = {};

export function useAgendamentos(tenantId: string | null) {
  const [data, setData] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(false);

  const carregar = async () => {
    if (!tenantId) return;

    setLoading(true);

    if (cache[tenantId]) {
      setData(cache[tenantId]);
      setLoading(false);
      return;
    }

    const res = await listarAgendamentos(tenantId);
    cache[tenantId] = res.data ?? [];
    setData(cache[tenantId]);
    setLoading(false);
  };

  useEffect(() => {
    carregar();
  }, [tenantId]);

  return {
    data,
    loading,
    refresh: carregar,
  };
}
