import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })
  const pathname = request.nextUrl.pathname

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: "", ...options })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 🔐 BLOQUEIO GLOBAL (não logado)
  if (!user && (pathname.startsWith("/dashboard") || pathname.startsWith("/admin"))) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (user) {
    const masterEmail = process.env.NEXT_PUBLIC_MASTER_EMAIL || ""
    const isMaster = user.email === masterEmail

    // 🧠 Role padrão
    let role: "admin" | "user" | null = isMaster ? "admin" : null
    let plano: "basic" | "pro" | "premium" | null = isMaster ? "premium" : null

    if (!isMaster) {
      const { data: membership } = await supabase
        .from("tenant_users")
        .select("role, tenants ( plano )")
        .eq("user_id", user.id)
        .maybeSingle()

      role = membership?.role || null

      const tenant = membership?.tenants as any
      plano = Array.isArray(tenant) ? tenant[0]?.plano : tenant?.plano
    }

    // 🔁 Logado tentando acessar login
    if (pathname === "/login") {
      const target = role === "admin" ? "/admin" : "/dashboard"
      return NextResponse.redirect(new URL(target, request.url))
    }

    // 🚫 Sem empresa vinculada
    if (!role && !isMaster && pathname !== "/sem-empresa") {
      return NextResponse.redirect(new URL("/sem-empresa", request.url))
    }

    // 🛡️ Usuário comum no admin
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // 🧾 Audit Ledger = PREMIUM ONLY
    if (pathname.startsWith("/admin/audit-ledger") && plano !== "premium") {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
