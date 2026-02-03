import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Role = 'admin' | 'empresa';

export function useTenantRole() {
  const [role, setRole] = useState<Role | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('tenant_users')
        .select('role, tenant_id')
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        setRole(data.role);
        setTenantId(data.tenant_id);
      }

      setLoading(false);
    }

    load();
  }, []);

  return { role, tenantId, loading };
}
