import { NextResponse } from 'next/server'
import { checkFeature } from '@/lib/featureGate'

export async function POST(req: Request) {
  try {
    await checkFeature('GERAR_OS')

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 403 }
    )
  }
}
