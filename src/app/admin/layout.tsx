"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabase"
import {
  LayoutDashboard, Users, Calendar, FileText,
  ShieldCheck, BarChart3, Clock, LogOut,
  MessageSquare, TrendingUp, LucideIcon,
  Shield
} from "lucide-react"

// --- TIPAGENS ---
export type Role = "admin" | "user" | "empresa"
export type Plano = "basic" | "pro" | "premium"

interface TenantResponse {
  plano: Plano;
}

const planoRank = (p: Plano) => {
  if (p === "premium") return 3;
  if (p === "pro") return 2;
  return 1;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("user")
  const [plano, setPlano] = useState<Plano>("basic")
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    try {
      await supabase.auth.signOut()
      router.push("/login")
    } catch (err) {
      console.error("Erro ao deslogar:", err)
    }
  }

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      if (user.email === 'adm@sintech.com') {
        if (mounted) {
          setRole("admin");
          setPlano("premium");
          setLoading(false);
        }
        return;
      }

      const { data: profile, error } = await supabase
        .from("tenant_users")
        .select(`role, tenants ( plano )`)
        .eq("user_id", user.id)
        .maybeSingle();

      if (!profile || error) {
        console.error("ERRO DE PERFIL:", error || "Não encontrado no banco");
        router.push("/login?error=no-profile");
        return;
      }

      if (mounted) {
        setRole(profile.role as Role);
        const tenantData = profile.tenants as any;
        const planoDb = Array.isArray(tenantData) ? tenantData[0]?.plano : tenantData?.plano;
        setPlano(planoDb || "basic");
        setLoading(false);
      }
    }

    checkAuth();
    return () => { mounted = false };
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#05060a] text-zinc-500 font-mono text-[10px] tracking-[0.3em]">
        AUTENTICANDO PROTOCOLO...
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#05060a] text-white">
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-72 h-screen sticky top-0 bg-zinc-950 border-r border-white/5 flex flex-col justify-between"
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* CABEÇALHO */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-xs font-black italic shadow-lg shadow-indigo-600/20 text-white">S</div>
              <h2 className="text-xl font-black italic tracking-tighter uppercase leading-none text-white">Sintech <span className="text-indigo-500 text-xs">SST</span></h2>
            </div>

            {/* BADGE DE NÍVEL */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 shadow-inner mb-2">
              <div className={`w-1.5 h-1.5 rounded-full ${plano === 'premium' ? 'bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'bg-zinc-600'}`} />
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-1">
                Nível: <span className={plano === 'premium' ? 'text-indigo-400' : ''}>{plano.toUpperCase()}</span>
                {plano === 'premium' && <TrendingUp size={10} className="text-indigo-400" />}
              </span>
            </div>
          </div>

          {/* MENU COM ESPAÇAMENTO */}
          <nav className="flex-1 px-4 space-y-4 overflow-y-auto mt-4">

            {/* BLOCO PRINCIPAL */}
            <div className="space-y-2">
              <NavLink href="/admin" active={pathname === "/admin"} Icon={LayoutDashboard} label="Governança" />
              <NavLink href="/admin/agendamentos" active={pathname === "/admin/agendamentos"} Icon={Calendar} label="Fluxos/Agendas" />
              <NavLink href="/admin/laudos" active={pathname === "/admin/laudos"} Icon={FileText} label="Laudos Técnicos" />
              <NavLink href="/admin/profissionais" active={pathname === "/admin/profissionais"} Icon={Users} label="Corpo Técnico" />
              <NavLink href="/admin/leads" active={pathname === "/admin/leads"} Icon={FileText} label="Leads & Diagnósticos" />
            </div>

            {/* BLOCO PERFORMANCE */}
            {(planoRank(plano) >= 2) && (
              <div className="pt-6 mt-6 border-t border-white/5 space-y-2">
                <h3 className="text-[9px] font-black text-indigo-400/50 uppercase tracking-[0.3em] mb-4 px-4">
                  Performance
                </h3>

                <NavLink
                  href="/admin/pro/whatsapp"
                  active={pathname === "/admin/pro/whatsapp"}
                  Icon={MessageSquare}
                  label="WhatsApp API"
                />

                {planoRank(plano) >= 3 && (
                  <NavLink
                    href="/admin/premium/bi"
                    active={pathname === "/admin/premium/bi"}
                    Icon={BarChart3}
                    label="BI & Analytics"
                  />
                )}
              </div>
            )}

            {/* BLOCO SEGURANÇA & COMPLIANCE */}
            {planoRank(plano) >= 3 && (
              <div className="pt-6 mt-6 border-t border-red-500/20 space-y-2">
                <h3 className="text-[9px] font-black text-red-400/60 uppercase tracking-[0.3em] mb-4 px-4">
                  Segurança & Compliance
                </h3>

                <NavLink
                  href="/admin/audit-ledger"
                  active={pathname === "/admin/audit-ledger"}
                  Icon={Shield}
                  label="Ledger Global"
                  className="text-red-400 hover:text-red-300" />
              </div>
            )}

          </nav>

        </div>

        {/* RODAPÉ */}
        <div className="p-4 border-t border-white/5 bg-zinc-950/50">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all font-bold uppercase tracking-widest text-[10px]"
          >
            <LogOut size={16} />
            Encerrar Protocolo
          </button>
        </div>
      </motion.aside>

      <main className="flex-1 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

function NavLink({ href, active, Icon, label, className = "" }: {
  href: string
  active: boolean
  Icon: LucideIcon
  label: string
  className?: string
}) {

  return (
    <Link href={href}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}>
        <Icon size={18} />
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
    </Link>
  )
}