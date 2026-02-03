'use client'
import { useState } from 'react'
import { registrarLead } from '../../app/actions/leads.ts'
import { CheckCircle2 } from 'lucide-react'

export function FormDiagnostico({ isDark }: { isDark: boolean }) {
  const [enviado, setEnviado] = useState(false)
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(formData: FormData) {
    setCarregando(true)
    const result = await registrarLead(formData)
    setCarregando(false)

    if (result.success) {
      setEnviado(true)

      // Pega os dados para a mensagem
      const nome = formData.get('nome')
      const msg = encodeURIComponent(`Olá! Acabei de solicitar o Diagnóstico na Sintech SST. Meu nome é ${nome}.`)
      const fone = "55329XXXXXXXX" // Seu número com DDD 32

      // Redireciona após 2 segundos
      setTimeout(() => {
        window.open(`https://wa.me/${fone}?text=${msg}`, '_blank')
      }, 2000)
    }
  }

  if (enviado) {
    return (
      <div className="py-24 text-center">
        <CheckCircle2 className="mx-auto text-green-500 mb-4" size={64} />
        <h2 className="text-3xl font-black">Solicitação Recebida!</h2>
        <p className="mt-4 text-slate-400">Em breve um consultor da Sintech SST entrará em contato.</p>
        <button onClick={() => setEnviado(false)} className="mt-8 text-indigo-400 underline text-sm">Enviar nova solicitação</button>
      </div>
    )
  }

  return (
    <section id="leads" className="py-24 px-6 max-w-4xl mx-auto">
      <div className={`p-8 md:p-12 rounded-[2.5rem] border ${isDark ? 'bg-[#11141b] border-white/10' : 'bg-white border-slate-200 shadow-2xl'}`}>
        <h2 className="text-3xl font-black mb-8 text-center italic">Diagnóstico <span className="text-indigo-500">Gratuito</span></h2>

        <form action={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="nome" required placeholder="Seu Nome" className="p-4 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none" />
          <input name="whatsapp" required placeholder="WhatsApp (DDD)" className="p-4 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none" />

          <select name="vidas" className="p-4 rounded-xl bg-[#0a0c10] border border-white/10 text-slate-400">
            <option value="">Volume de Vidas</option>
            <option value="0-500">Até 500 vidas</option>
            <option value="500-2000">500 a 2.000 vidas</option>
            <option value="2000+">Acima de 2.000 vidas</option>
          </select>

          <select name="gargalo" className="p-4 rounded-xl bg-[#0a0c10] border border-white/10 text-slate-400">
            <option value="">Maior Gargalo Hoje</option>
            <option value="Processos">Processos Manuais</option>
            <option value="Juridico">Insegurança Jurídica</option>
            <option value="Escala">Dificuldade de Crescer</option>
          </select>

          <button
            type="submit"
            disabled={carregando}
            className="md:col-span-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black py-5 rounded-2xl transition-all"
          >
            {carregando ? 'PROCESSANDO...' : 'SOLICITAR AVALIAÇÃO TÉCNICA'}
          </button>
        </form>
      </div>
    </section>
  )
}