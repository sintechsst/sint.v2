import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useAuthRole() {
  const [role, setRole] = useState<"admin" | "empresa" | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkRole() {
      const { data: { user: sbUser } } = await supabase.auth.getUser();
      
      if (sbUser) {
        setUser(sbUser);
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        
        if (sbUser.email === adminEmail) {
          setRole("admin");
        } else {
          setRole("empresa");
        }
      }
      setLoadingRole(false);
    }

    checkRole();
  }, []);

  return { role, user, loadingRole, isAdmin: role === "admin" };
}