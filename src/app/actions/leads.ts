'use server'

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function registrarLead(formData: FormData) {
  const nome = formData.get('nome') as string
  const whatsapp = formData.get('whatsapp') as string
  const vidas = formData.get('vidas') as string
  const gargalo = formData.get('gargalo') as string

  try {
    const { error } = await supabase
      .from('leads') 
      .insert([
        { 
          nome, 
          whatsapp, 
          volume_vidas: vidas, 
          gargalo_principal: gargalo,
          status: 'NOVO',
          origem: 'Landing Page Sintech'
        }
      ])

    if (error) throw error

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error("Erro Supabase:", error)
    return { success: false, error: "Falha ao salvar no banco." }
  }

}
