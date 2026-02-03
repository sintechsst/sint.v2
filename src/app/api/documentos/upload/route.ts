import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { v4 as uuid } from "uuid"

// Supabase Admin (Service Role)
function getAdminClient() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase ENV não configurado")
  }

  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function POST(req: Request) {
  const cookieStore = await cookies()

  // Supabase Auth (usuário logado)
  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: { user } } = await supabaseAuth.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  // Tenant + Role vêm do cookie httpOnly
  const tenantId = cookieStore.get("tenant_id")?.value
  const role = cookieStore.get("role")?.value

  if (!tenantId || !role) {
    return NextResponse.json({ error: "Sessão da empresa inválida" }, { status: 403 })
  }

  // RBAC
  if (!["owner", "admin"].includes(role)) {
    return NextResponse.json({ error: "Permissão negada" }, { status: 403 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File
  const tipo = formData.get("tipo") as string

  if (!file || file.type !== "application/pdf") {
    return NextResponse.json({ error: "Arquivo inválido" }, { status: 400 })
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Arquivo maior que 10MB" }, { status: 400 })
  }

  const fileExt = file.name.split(".").pop()
  const fileName = `${uuid()}.${fileExt}`
  const filePath = `${tenantId}/${fileName}`

  const buffer = Buffer.from(await file.arrayBuffer())

  const supabaseAdmin = getAdminClient()

  // Upload no Storage
  const { error: uploadError } = await supabaseAdmin.storage
    .from("laudos")
    .upload(filePath, buffer, {
      contentType: "application/pdf",
      upsert: false,
    })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  // Registro no banco
  const { error: dbError } = await supabaseAdmin.from("documentos").insert({
    tenant_id: tenantId,
    tipo,
    nome_arquivo: file.name,
    url_path: filePath,
    status: "pending",
    uploaded_by: user.id,
  })

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
