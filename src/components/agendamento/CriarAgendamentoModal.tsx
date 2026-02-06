'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  X,
  Calendar,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  User,
  ChevronRight,
  Building2,
  FileText,
  Briefcase,
  Sun,
  Moon,
} from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Empresa {
  id: string
  nome_fantasia: string
}

interface ProfissionalData {
  profissional_id: string
  profissionais: {
    nome: string
    especialidade: string
  }
}

export function CriarAgendamentoModal({
  tenantId,
  onClose,
  onSuccess,
}: {
  tenantId: string
  onClose: () => void
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [medicos, setMedicos] = useState<ProfissionalData[]>([])
  const [isDark, setIsDark] = useState(true)

  const [form, setForm] = useState({
    empresa_id: '',
    tipo_servico: 'Exame ClÃ­nico',
    data_sugerida: '',
    profissional_id: '',
    nome_funcionario: '',
    cpf: '',
    funcao: '',
    tipo_exame: 'Admissional',
  })

  const labelClass = cn(
    'text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2',
    isDark ? 'text-zinc-400' : 'text-zinc-500'
  )
  const inputClass = cn(
    'w-full border p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all',
    isDark
      ? 'bg-[#111] border-white/10 text-white'
      : 'bg-zinc-50 border-zinc-200 text-zinc-900'
  )

  useEffect(() => {
    async function fetchEmpresas() {
      if (!tenantId) return

      let { data, error } = await supabase
        .from('empresas')
        .select('id, nome_fantasia')
        .eq('tenant_id', tenantId)

      if (error || !data || data.length === 0) {
        const { data: fallbackData } = await supabase
          .from('empresas')
          .select('id, nome_fantasia')
        data = fallbackData
      }

      if (data) setEmpresas(data)
    }
    fetchEmpresas()
  }, [tenantId])

  useEffect(() => {
    if (form.data_sugerida && form.tipo_servico) {
      buscarProfissionaisDisponiveis()
    }
  }, [form.data_sugerida, form.tipo_servico])

  async function buscarProfissionaisDisponiveis() {
    if (!form.data_sugerida || !form.empresa_id) return

    const [y, m, d] = form.data_sugerida.split('-').map(Number)
    const diaSemana = new Date(y, m - 1, d).getDay()

    const { data: escala, error } = await supabase
      .from('escala_medica')
      .select(`
      profissional_id, 
      profissionais!inner(nome, especialidade)
    `)
      .eq('dia_semana', diaSemana)
      .eq('tenant_id', tenantId)

    if (error) {
      console.error('Erro ao buscar escala:', error)
      toast.error('Erro ao carregar especialistas.')
      return
    }

    if (escala) {
      setMedicos(escala as unknown as ProfissionalData[])
    }
  }

  async function handleSubmit() {
    console.log('insert payload', {
      tenant_id: tenantId,
      empresa_id: form.empresa_id,
      profissional_id: form.profissional_id,
      data_sugerida: form.data_sugerida,
      nome_funcionario: form.nome_funcionario,
      cpf: form.cpf,
      funcao: form.funcao,
      tipo_exame: form.tipo_exame,
      tipo_servico: form.tipo_servico,
      servico_id: null,
      status: 'PENDENTE',
    })

    if (
      !form.empresa_id ||
      !form.data_sugerida ||
      !form.nome_funcionario ||
      !form.profissional_id
    ) {
      toast.error('Preencha todos os campos, incluindo o Especialista')
      return
    }

    setLoading(true)
    const { error } = await supabase.from('agendamentos').insert({
      tenant_id: tenantId,
      empresa_id: form.empresa_id,
      profissional_id: form.profissional_id,
      data_sugerida: form.data_sugerida,
      nome_funcionario: form.nome_funcionario,
      cpf: form.cpf,
      funcao: form.funcao,
      tipo_exame: form.tipo_exame,
      tipo_servico: form.tipo_servico,
      servico_id: null,
      status: 'PENDENTE',
    })

    if (!error) {
      setStep(2)
      onSuccess()
      toast.success('Agendamento solicitado!')
    } else {
      toast.error('Erro: ' + error.message)
    }
    setLoading(false)
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center p-4 transition-colors',
        isDark ? 'bg-black/80' : 'bg-zinc-950/40 backdrop-blur-md'
      )}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'w-full max-w-5xl rounded-[2.5rem] shadow-2xl border overflow-hidden relative',
          isDark
            ? 'bg-[#09090b] border-white/5'
            : 'bg-white border-zinc-200'
        )}
      >
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="form"
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col lg:flex-row min-h-[550px]"
            >
              {/* TOGGLE DARK MODE */}
              <button
                type="button"
                onClick={() => setIsDark(!isDark)}
                className={cn(
                  'absolute top-6 right-20 p-2 rounded-full z-[110] transition-colors',
                  isDark ? 'hover:bg-white/10' : 'hover:bg-zinc-100'
                )}
              >
                {isDark ? (
                  <Sun size={20} className="text-yellow-500" />
                ) : (
                  <Moon size={20} className="text-zinc-500" />
                )}
              </button>

              {/* COLUNA PRINCIPAL */}
              <div
                className={cn(
                  'flex-1 p-8 md:p-12 space-y-8',
                  isDark ? 'bg-[#0d1017]' : 'bg-white'
                )}
              >
                <div className="flex justify-between items-center">
                  <header>
                    <h2
                      className={cn(
                        'text-2xl font-black uppercase italic tracking-tight',
                        isDark ? 'text-white' : 'text-zinc-900'
                      )}
                    >
                      Novo Agendamento
                    </h2>
                    <p
                      className={cn(
                        'text-sm',
                        isDark ? 'text-zinc-400' : 'text-zinc-500'
                      )}
                    >
                      Dados tÃ©cnicos para o atendimento.
                    </p>
                  </header>
                  <button
                    type="button"
                    onClick={onClose}
                    className={cn(
                      'p-2 rounded-full transition-colors',
                      isDark ? 'hover:bg-white/5' : 'hover:bg-zinc-100'
                    )}
                  >
                    <X size={20} className="text-zinc-400" />
                  </button>
                </div>

                {/* GRID DE INPUTS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className={labelClass}>
                      <User size={14} /> Colaborador
                    </label>
                    <input
                      required
                      type="text"
                      value={form.nome_funcionario}
                      onChange={(e) =>
                        setForm({ ...form, nome_funcionario: e.target.value })
                      }
                      className={inputClass}
                      placeholder="Nome completo"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={labelClass}>
                      <FileText size={14} /> CPF
                    </label>
                    <input
                      required
                      type="text"
                      value={form.cpf}
                      onChange={(e) => {
                        const masked = e.target.value
                          .replace(/\D/g, '')
                          .replace(/(\d{3})(\d)/, '$1.$2')
                          .replace(/(\d{3})(\d)/, '$1.$2')
                          .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                          .slice(0, 14)
                        setForm({ ...form, cpf: masked })
                      }}
                      className={inputClass}
                      placeholder="000.000.000-00"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={labelClass}>
                      <Briefcase size={14} /> Cargo / FunÃ§Ã£o
                    </label>
                    <input
                      required
                      type="text"
                      value={form.funcao}
                      onChange={(e) =>
                        setForm({ ...form, funcao: e.target.value })
                      }
                      className={inputClass}
                      placeholder="Ex: Engenheiro"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={labelClass}>
                      <Building2 size={14} /> Unidade
                    </label>
                    <select
                      required
                      value={form.empresa_id}
                      onChange={(e) =>
                        setForm({ ...form, empresa_id: e.target.value })
                      }
                      className={cn(
                        inputClass,
                        'cursor-pointer',
                        isDark ? 'bg-[#111] text-white' : 'bg-white text-zinc-900'
                      )}
                    >
                      <option
                        value=""
                        className={cn(
                          'text-zinc-500',
                          isDark ? 'bg-[#111]' : 'bg-white'
                        )}
                      >
                        Selecione a unidade...
                      </option>
                      {empresas.map((emp) => (
                        <option
                          key={emp.id}
                          value={emp.id}
                          className={cn(
                            isDark ? 'bg-[#111] text-white' : 'bg-white text-zinc-900'
                          )}
                        >
                          {emp.nome_fantasia}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* CAMPO ESPECIALISTA */}
                  <div className="space-y-2 md:col-span-2">
                    <label className={labelClass}>
                      <User size={14} /> Especialista disponÃ­vel para o dia
                    </label>
                    <select
                      required
                      value={form.profissional_id}
                      onChange={(e) =>
                        setForm({ ...form, profissional_id: e.target.value })
                      }
                      className={cn(
                        inputClass,
                        'cursor-pointer',
                        !form.data_sugerida && 'opacity-50'
                      )}
                      disabled={!form.data_sugerida}
                    >
                      <option value="">
                        {!form.data_sugerida
                          ? 'Selecione uma data primeiro...'
                          : medicos.length === 0
                            ? 'Nenhum especialista nesta data'
                            : 'Selecione o especialista...'}
                      </option>
                      {medicos.map((m) => (
                        <option key={m.profissional_id} value={m.profissional_id}>
                          {m.profissionais.nome} - {m.profissionais.especialidade}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* TIPO DE EXAME */}
                <div className="space-y-3">
                  <label className={labelClass}>Tipo de Exame</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Admissional', 'PeriÃ³dico', 'Demissional', 'Retorno ao Trabalho'].map(
                      (tipo) => (
                        <button
                          key={tipo}
                          type="button"
                          onClick={() => setForm({ ...form, tipo_exame: tipo })}
                          className={cn(
                            'py-3 px-2 rounded-xl border text-[10px] font-black uppercase tracking-tighter transition-all duration-300',
                            form.tipo_exame === tipo
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]'
                              : isDark
                                ? 'bg-transparent border-white/10 text-zinc-400'
                                : 'bg-transparent border-zinc-200 text-zinc-500'
                          )}
                        >
                          {tipo}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* COLUNA LATERAL DE REVISAO */}
              <div
                className={cn(
                  'w-full lg:w-[380px] border-l p-8 flex flex-col gap-6',
                  isDark
                    ? 'bg-white/[0.02] border-white/5'
                    : 'bg-zinc-50 border-zinc-200'
                )}
              >
                <div className="space-y-6 flex-1">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    RevisÃ£o do Pedido
                  </h3>
                  <div className="space-y-5">
                    {[
                      {
                        icon: Building2,
                        label: 'Unidade',
                        value: empresas.find((e) => e.id === form.empresa_id)
                          ?.nome_fantasia,
                      },
                      { icon: Calendar, label: 'Data', value: form.data_sugerida },
                      {
                        icon: User,
                        label: 'Especialista',
                        value: medicos.find((m) => m.profissional_id === form.profissional_id)
                          ?.profissionais.nome,
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div
                          className={cn(
                            'w-10 h-10 rounded-xl border flex items-center justify-center text-indigo-500 shadow-sm',
                            isDark ? 'bg-zinc-900 border-white/5' : 'bg-white border-zinc-200'
                          )}
                        >
                          <item.icon size={18} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">
                            {item.label}
                          </p>
                          <p
                            className={cn(
                              'text-sm font-bold truncate',
                              isDark ? 'text-white' : 'text-zinc-900'
                            )}
                          >
                            {item.value || '---'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 space-y-2">
                    <label className={labelClass}>Agendar para:</label>
                    <input
                      required
                      type="date"
                      value={form.data_sugerida}
                      onChange={(e) =>
                        setForm({ ...form, data_sugerida: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>

                <div
                  className={cn(
                    'p-4 border rounded-2xl flex gap-3 items-start',
                    isDark
                      ? 'bg-amber-500/10 border-amber-500/20'
                      : 'bg-amber-500/5 border-amber-500/20'
                  )}
                >
                  <AlertTriangle
                    className={cn(
                      'shrink-0',
                      isDark ? 'text-amber-500' : 'text-amber-600'
                    )}
                    size={18}
                  />
                  <p
                    className={cn(
                      'text-[9px] font-bold uppercase leading-tight',
                      isDark ? 'text-amber-500' : 'text-amber-700'
                    )}
                  >
                    Importante: Verifique documentos originais e encaminhamentos antes do atendimento.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full p-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      Confirmar Pedido <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 text-center space-y-6 flex flex-col items-center justify-center min-h-[500px]"
            >
              <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={40} />
              </div>
              <h2
                className={cn(
                  'text-3xl font-black uppercase tracking-tighter',
                  isDark ? 'text-white' : 'text-zinc-900'
                )}
              >
                SolicitaÃ§Ã£o Enviada!
              </h2>
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  'px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform',
                  isDark
                    ? 'bg-white text-zinc-900'
                    : 'bg-zinc-900 text-white'
                )}
              >
                Voltar para Lista
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
