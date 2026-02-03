import { serve } from "std/http/server.ts"
import { createClient } from "@supabase/supabase-js"
import { PDFDocument, StandardFonts } from "pdf-lib"



type Empresa = {
  nome_fantasia: string
  telefone: string
}

type Profissional = {
  nome: string
}

serve(async (req: Request) => {
  try {
    const auth = req.headers.get("authorization")
    if (auth !== `Bearer ${Deno.env.get("CRON_SECRET")}`) {
      return new Response("Unauthorized", { status: 401 })
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

    const { data: agendamentos, error } = await supabase
      .from("agendamentos")
      .select(`
        id,
        tenant_id,
        data_sugerida,
        empresas ( nome_fantasia, telefone ),
        profissionais ( nome )
      `)
      .eq("status", "Pendente")

    if (error) throw error

    for (const ag of agendamentos || []) {
      const empresa = (ag.empresas as Empresa[])[0]
      const profissional = (ag.profissionais as Profissional[])[0]

      if (!empresa || !profissional) continue

      console.log(`📄 Gerando OS: ${ag.id}`)

      const pdf = await PDFDocument.create()
      const page = pdf.addPage()
      const font = await pdf.embedFont(StandardFonts.Helvetica)

      page.drawText("ORDEM DE SERVIÇO", { x: 50, y: 750, size: 20, font })
      page.drawText(`Empresa: ${empresa.nome_fantasia}`, { x: 50, y: 700, size: 12, font })
      page.drawText(`Profissional: ${profissional.nome}`, { x: 50, y: 670, size: 12, font })
      page.drawText(`Data: ${ag.data_sugerida}`, { x: 50, y: 640, size: 12, font })

      const pdfBytes = await pdf.save()
      const fileName = `os/${ag.tenant_id}/${ag.id}.pdf`

      await supabase.storage
        .from("os-pdfs")
        .upload(fileName, pdfBytes, {
          contentType: "application/pdf",
          upsert: true
        })

      const { data: url } = supabase.storage
        .from("os-pdfs")
        .getPublicUrl(fileName)

      await supabase.from("os_ordens").insert({
        agendamento_id: ag.id,
        tenant_id: ag.tenant_id,
        pdf_url: url.publicUrl,
        status: "Gerada"
      })

      await fetch(Deno.env.get("WHATSAPP_API_URL")!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Deno.env.get("WHATSAPP_TOKEN")}`
        },
        body: JSON.stringify({
          phone: empresa.telefone,
          message:
            `📄 Sua Ordem de Serviço está pronta!\n` +
            `Empresa: ${empresa.nome_fantasia}\n` +
            `Link: ${url.publicUrl}`
        })
      })

      await supabase
        .from("agendamentos")
        .update({ status: "OS_GERADA" })
        .eq("id", ag.id)
    }

    return new Response("Jobs executados com sucesso", { status: 200 })
  } catch (err) {
    console.error("Erro no cron:", err)
    return new Response("Erro ao executar jobs", { status: 500 })
  }
})
