import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { tenant_id, role } = await request.json() 
    const cookieStore = await cookies()

    if (!tenant_id) {
      return NextResponse.json({ error: 'tenant_id ausente' }, { status: 400 })
    }

    // Configuração do cookie do Tenant
    cookieStore.set('tenant_id', tenant_id, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 dias
    })

    // Configuração do cookie de Role
    cookieStore.set('role', role || 'user', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro na API de Session:', error)
    return NextResponse.json({ error: 'Falha ao criar sessão' }, { status: 500 })
  }
}
