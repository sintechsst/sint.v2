// deno-lint-ignore-file
"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { supabase } from "../../lib/supabase"
import { LayoutDashboard, Users, FileText, Settings, LogOut, Menu, ShieldCheck, Calendar } from "lucide-react"

import { cn } from "../../lib/utils"
import { Badge } from "../../components/ui/badge"

const menuItems = [
  { label: "Painel", href: "/dashboard", icon: LayoutDashboard },
  { label: "Agendamentos", href: "/agendamentos", icon: Calendar, badge: "BETA" },
  { label: "Empresas", href: "/empresas", icon: Users },
  { label: "Laudos", href: "/not-found", icon: FileText },
  { label: "Configurações", href: "/settings", icon: Settings }
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push("/login")
        return
      }

      const { data: profile } = await supabase
        .from('tenant_users')
        .select('role')
        .eq('user_id', session.user.id)
        .maybeSingle()

      if (profile?.role === 'admin') {
        window.location.href = "/admin"
      }
    }
    checkUser()
  }, [router])

  async function handleLogout() {
    try {
      await supabase.auth.signOut()
      document.cookie = "tenant_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      window.location.href = "/login"
    } catch (error) {
      console.error("Erro ao deslogar:", error)
    }
  }

  return (
    // AJUSTE: Fundo da página agora é adaptável
    <div className="min-h-screen flex bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      
      {/* Overlay Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR ADAPTÁVEL */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-white/5 p-6 flex flex-col transition-all md:relative md:translate-x-0",
          !isSidebarOpen && "-translate-x-full"
        )}
      >
        {/* LOGO */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white">
            <ShieldCheck size={22} strokeWidth={2.5} />
          </div>

          <div className="leading-tight">
            <div className="text-xl font-black italic tracking-tight text-zinc-900 dark:text-white">SINTECH</div>
            <div className="text-[10px] uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-bold">Infraestrutura SST</div>
          </div>
        </div>

        {/* MENU */}
        <nav className="flex-1 space-y-1">
          {menuItems.map(item => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                  isActive
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20"
                    : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-indigo-600 dark:hover:text-white"
                )}
              >
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span className="flex-1">{item.label}</span>

                {item.badge && (
                   <span className="text-[9px] bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-black">
                     {item.badge}
                   </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* RODAPÉ */}
        <div className="pt-6 border-t border-zinc-100 dark:border-white/5">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            Encerrar Sessão
          </button>
        </div>
      </aside>

      {/* CONTEÚDO */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER MOBILE ADAPTÁVEL */}
        <header className="h-16 border-b border-zinc-200 dark:border-white/5 flex items-center justify-between px-4 md:hidden bg-white dark:bg-zinc-950">
          <span className="font-black italic text-zinc-900 dark:text-white uppercase tracking-tighter">SINTECH SST</span>
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg bg-zinc-100 dark:bg-white/5 text-indigo-600 dark:text-indigo-400"
          >
            <Menu size={22} />
          </button>
        </header>

        {/* MAIN */}
        <main className="flex-1 overflow-y-auto p-6 md:p-12">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
