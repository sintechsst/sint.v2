import { NextRequest, NextResponse } from 'next/server'
import { supabasePublic } from '@/lib/supabase-public'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const ip =
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      'unknown'

    const userAgent = req.headers.get('user-agent') || 'unknown'

    await supabasePublic
      .from('audit_validation_logs')
      .insert([{
        slug: body.slug,
        entidade_id: body.entidade_id,
        empresa_id: body.empresa_id,
        ip_address: ip,
        user_agent: userAgent,
        country: body.country || null,
        city: body.city || null,
        source: body.source || 'public_page'
      }])

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
