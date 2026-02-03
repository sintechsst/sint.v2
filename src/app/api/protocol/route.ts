import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const ip =
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      'unknown'

    const userAgent = req.headers.get('user-agent') || 'unknown'

    const { error } = await supabase
      .from('audit_validation_logs')
      .insert([{
        slug: body.slug,
        entidade_id: body.entidade_id,
        empresa_id: body.empresa_id || null,
        ip_address: ip,
        user_agent: userAgent,
        country: body.country || null,
        city: body.city || null,
        source: body.source || 'public_page'
      }])

    if (error) {
      return new Response(
        JSON.stringify({ ok: false }),
        { headers: { 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (_err) {
    return new Response(
      JSON.stringify({ ok: false }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}
