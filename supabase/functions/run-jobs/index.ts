import { createClient } from "@supabase/supabase-js"
import { PDFDocument, StandardFonts } from "pdf-lib"

const env = (globalThis as any).Deno?.env ?? process.env

type Empresa = {
  nome_fantasia: string
  telefone: string
}

type Profissional = {
  nome: string
}

export default async (req: Request) => {
  try {
    // 🔐 Auth do cron
    const auth = req.headers.get("authorization")
    const cronSecret =
      env.get?.("CRON_SECRET") || env.CRON_SECRET

    if (!cronSecret) {
      console.error("CRON_SECRET não definido")
      return new Response("Server misconfigured", { status: 500 })
    }

    if (auth !== `Bearer ${cronSecret}`) {
      return new Response("Unauthorized", { status: 401 })
    }

    // 🔧 Validação ENV Supabase
    const supabaseUrl =
      env.get?.("SUPABASE_URL") || env.SUPABASE_URL
    const serviceKey =
      env.get?.("SUPABASE_SERVICE_ROLE_KEY") ||
      env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceKey) {
      console.error("ENV Supabase ausente")
      return new Response("Server misconfigured", { status: 500 })
    }

    const supabase = createClient(supabaseUrl, serviceKey)

    // 📥 Buscar agendamentos pendentes
    const { data: agendamentos, error } = await supabase
      .from("agendamentos")
      .select(
        `
        id,
        tenant_id,
        data_sugerida,
        empresas ( nome_fantasia, telefone ),
        profissionais ( nome )
      `
      )
      .eq("status", "Pendente")

    if (error) {
      console.error("Erro ao buscar agendamentos:", error)
      throw error
    }

    if (!agendamentos?.length) {
      return new Response("Nenhum job pendente", { status: 200 })
    }

    // 🔄 Processar cada agendamento
    for (const ag of agendamentos) {
      try {
        const empresa = (ag.empresas as Empresa[])?.[0]
        const profissional = (ag.profissionais as Profissional[])?.[0]

        if (!empresa || !profissional) {
          console.warn(`Agendamento ${ag.id} sem vínculos`)
          continue
        }

        console.log(`📄 Gerando OS: ${ag.id}`)

        // 📄 Gerar PDF
        const pdf = await PDFDocument.create()
        const page = pdf.addPage([595, 842]) // A4
        const font = await pdf.embedFont(StandardFonts.Helvetica)

        page.drawText("ORDEM DE SERVIÇO", {
          x: 50,
          y: 800,
          size: 20,
          font
        })

        page.drawText(`Empresa: ${empresa.nome_fantasia}`, {
          x: 50,
          y: 760,
          size: 12,
          font
        })

        page.drawText(`Profissional: ${profissional.nome}`, {
          x: 50,
          y: 730,
          size: 12,
          font
        })

        page.drawText(`Data: ${ag.data_sugerida}`, {
          x: 50,
          y: 700,
          size: 12,
          font
        })

        const pdfBytes = await pdf.save()
        const fileName = `os/${ag.tenant_id}/${ag.id}.pdf`

        // ☁️ Upload PDF
        const { error: uploadError } = await supabase.storage
          .from("os-pdfs")
          .upload(fileName, pdfBytes, {
            contentType: "application/pdf",
            upsert: true
          })

        if (uploadError) {
          console.error("Erro upload PDF:", uploadError)
          continue
        }

        const { data: url } = supabase.storage
          .from("os-pdfs")
          .getPublicUrl(fileName)

        // 🧾 Registrar OS
        const { error: insertError } = await supabase
          .from("os_ordens")
          .insert({
            agendamento_id: ag.id,
            tenant_id: ag.tenant_id,
            pdf_url: url.publicUrl,
            status: "Gerada"
          })

        if (insertError) {
          console.error("Erro insert OS:", insertError)
          continue
        }

        // 📲 WhatsApp
        const whatsappUrl =
          env.get?.("WHATSAPP_API_URL") ||
          env.WHATSAPP_API_URL

        const whatsappToken =
          env.get?.("WHATSAPP_TOKEN") ||
          env.WHATSAPP_TOKEN

        if (whatsappUrl && whatsappToken) {
          await fetch(whatsappUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${whatsappToken}`
            },
            body: JSON.stringify({
              phone: empresa.telefone,
              message:
                `📄 Sua Ordem de Serviço está pronta!\n` +
                `Empresa: ${empresa.nome_fantasia}\n` +
                `Link: ${url.publicUrl}`
            })
          })
        } else {
          console.warn("WhatsApp ENV não configurado")
        }

        // ✅ Atualizar status
        await supabase
          .from("agendamentos")
          .update({ status: "OS_GERADA" })
          .eq("id", ag.id)
      } catch (jobErr) {
        console.error(`Erro no job ${ag.id}:`, jobErr)
      }
    }

    return new Response("Jobs executados com sucesso", { status: 200 })
  } catch (err) {
    console.error("Erro no cron:", err)
    return new Response("Erro ao executar jobs", { status: 500 })
  }
}
