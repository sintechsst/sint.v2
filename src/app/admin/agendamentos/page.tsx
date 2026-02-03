'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  CheckCircle2, MoreHorizontal, XCircle, Search, Microscope, FileText, Plus, Stethoscope,
  Clock,
  Zap
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { cn } from "@/lib/utils" 

// --- INTERFACES ---
interface Agendamento {
  id: string
  status: string
  nome_funcionario: string
  tipo_servico: string
  empresas?: { nome_fantasia: string }
  profissionais?: { nome: string; especialidade: string }
}

interface Exame {
  id: string
  nome_exame: string
  status: 'PENDENTE' | 'RECEBIDO'
  agendamento_id: string
}

// --- COMPONENTE TIMELINE ---
export function AgendamentoTimeline({ status }: { status: string }) {
  const steps = ['Pendente', 'Confirmado', 'Em Atendimento', 'Concluído']
  const getActiveIndex = (status: string) => {
    const s = status?.toUpperCase()
    if (s === 'CANCELADO' || s === 'CONCLUIDO') return 3
    if (s === 'EM_ATENDIMENTO' || s === 'AGUARDANDO_EXAMES') return 2
    if (s === 'APROVADO' || s === 'CONFIRMADO') return 1
    return 0
  }
  const currentIdx = getActiveIndex(status)

  return (
    <div className="flex items-center gap-1 mt-3">
      {steps.map((step, i) => {
        const isCompleted = currentIdx >= i
        return (
          <div key={step} className="flex items-center">
            <div className={cn(
              "w-2 h-2 rounded-full transition-all duration-500",
              isCompleted ? 'bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.5)]' : 'bg-zinc-800'
            )} />
            <span className={cn(
              "text-[8px] font-black uppercase ml-2 whitespace-nowrap",
              currentIdx === i ? 'text-indigo-400' : isCompleted ? 'text-zinc-500' : 'text-zinc-700'
            )}>
              {step}
            </span>
            {i < steps.length - 1 && (
              <div className={cn("w-3 h-[1px] mx-2", currentIdx > i ? 'bg-indigo-600/50' : 'bg-zinc-800')} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// --- COMPONENTE PRINCIPAL ---
export default function AgendamentosPage() {
  const [agendas, setAgendas] = useState<Agendamento[]>([])
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [selectedAgendamento, setSelectedAgendamento] = useState<string | null>(null)
  const [solicitandoPara, setSolicitandoPara] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase
        .from('agendamentos')
        .select(`*, empresas (nome_fantasia), profissionais (nome, especialidade)`)
        .order('data_sugerida', { ascending: true })
      if (data) setAgendas(data as Agendamento[])
    }
    loadData()
  }, [])

  async function updateStatus(id: string, newStatus: string) {
    const { error } = await supabase.from('agendamentos').update({ status: newStatus }).eq('id', id)
    if (!error) {
      toast.success(`Status: ${newStatus}`)
      // Recarga manual simplificada para evitar dependência de função externa
      const { data } = await supabase
        .from('agendamentos')
        .select(`*, empresas (nome_fantasia), profissionais (nome, especialidade)`)
        .order('data_sugerida', { ascending: true })
      if (data) setAgendas(data as Agendamento[])
      setActiveMenu(null)
    }
  }

  const filteredAgendas = agendas.filter(item =>
    item.nome_funcionario?.toLowerCase().includes(search.toLowerCase()) ||
    item.empresas?.nome_fantasia?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8 p-6 min-h-screen bg-[#050505] text-white">
      <div className="relative">
        <input
          type="text"
          placeholder="PESQUISAR..."
          className="w-full bg-[#0d1017] border border-white/5 p-5 rounded-2xl text-[10px] font-black uppercase outline-none pl-14 focus:border-indigo-500/50 transition-all"
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
      </div>

      <div className="bg-[#0d1017] border border-white/5 rounded-[2.5rem] overflow-hidden">
        <Table>
          <TableHeader className="bg-white/[0.02]">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="py-6 px-8 text-[10px] font-black uppercase text-zinc-500">Empresa / Timeline</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-zinc-500">Serviço</TableHead>
              <TableHead className="text-right px-8 text-[10px] font-black uppercase text-zinc-500">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAgendas.map((item) => (
              <TableRow key={item.id} className="border-white/5 hover:bg-white/[0.01]">
                <TableCell className="py-8 px-8">
                  <div className="flex flex-col">
                    <span className="font-black italic text-indigo-400 uppercase text-sm">{item.empresas?.nome_fantasia}</span>
                    <span className="text-[11px] font-bold text-zinc-400 uppercase mt-1">{item.nome_funcionario}</span>
                    <AgendamentoTimeline status={item.status} />
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-[9px] font-black bg-zinc-900 px-4 py-2 rounded-xl border border-white/5 uppercase">
                    {item.tipo_servico}
                  </span>
                </TableCell>
                <TableCell className="text-right px-8">
                  <div className="flex items-center justify-end gap-3 relative">
                    <button
                      type="button"
                      onClick={() => setSolicitandoPara(item.id)}
                      className="p-3 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      <Stethoscope size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedAgendamento(item.id)}
                      className="p-3 rounded-xl bg-zinc-900 border border-white/5 text-zinc-500 hover:text-indigo-400 transition-all"
                    >
                      <Microscope size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)}
                      className={cn("p-3 rounded-xl border transition-all", activeMenu === item.id ? "bg-white text-black" : "border-white/5 text-zinc-600")}
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    <AnimatePresence>
                      {activeMenu === item.id && (
                        <>
                          <div className="fixed inset-0 z-[110]" onClick={() => setActiveMenu(null)} />
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute right-0 top-16 w-56 bg-[#0d1017] border border-white/10 rounded-2xl p-2 shadow-2xl z-[120]">
                            {item.status === 'CONCLUIDO' && (
                              <button type="button" onClick={() => globalThis.open(`/admin/aso/${item.id}`, '_blank')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase text-indigo-400 hover:bg-indigo-500/10 transition-all mb-1">
                                <FileText size={16} /> Emitir ASO
                              </button>
                            )}
                            <button type="button" onClick={() => updateStatus(item.id, 'CONCLUIDO')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase text-emerald-500 hover:bg-emerald-500/10 transition-all">
                              <CheckCircle2 size={16} /> Finalizar
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AnimatePresence>
        {solicitandoPara && (
          <ModalSolicitarExames 
            agendamentoId={solicitandoPara} 
            onClose={() => setSolicitandoPara(null)} 
          />
        )}
        {selectedAgendamento && (
          <ModalExames
            agendamentoId={selectedAgendamento}
            onClose={() => setSelectedAgendamento(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// --- MODAIS ---

function ModalSolicitarExames({ agendamentoId, onClose }: { agendamentoId: string, onClose: () => void }) {
  const [exameNome, setExameNome] = useState("")
  const [lista, setLista] = useState<string[]>([])

  async function handleSalvar() {
    if (lista.length === 0) return toast.error("Adicione ao menos um exame.")
    const payload = lista.map(nome => ({ agendamento_id: agendamentoId, nome_exame: nome, status: 'PENDENTE' }))
    await supabase.from('exames_complementares').insert(payload)
    await supabase.from('agendamentos').update({ status: 'AGUARDANDO_EXAMES' }).eq('id', agendamentoId)
    toast.success("Exames solicitados!"); onClose();
  }

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="bg-[#0d1017] border border-white/10 w-full max-w-lg rounded-[2.5rem] p-12 text-white shadow-2xl"
      >
        <h3 className="text-2xl font-black uppercase italic mb-8 tracking-tighter italic">
          NOVO <span className="text-indigo-500">PEDIDO</span>
        </h3>

        <div className="flex gap-3 mb-8">
          <input 
            value={exameNome} 
            onChange={e => setExameNome(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), (exameNome && (setLista([...lista, exameNome.toUpperCase()]), setExameNome(""))))}
            className="flex-1 bg-zinc-900 border border-white/5 p-5 rounded-2xl text-xs font-bold uppercase outline-none focus:border-indigo-500/50 transition-all" 
            placeholder="NOME DO EXAME..." 
          />
          <button 
            type="button" 
            onClick={() => { if(exameNome) { setLista([...lista, exameNome.toUpperCase()]); setExameNome(""); } }} 
            className="p-5 bg-indigo-600 rounded-2xl hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20"
          >
            <Plus size={24} strokeWidth={3} />
          </button>
        </div>

        {/* LISTA DE EXAMES ADICIONADOS - CORRIGIDO */}
        <div className="space-y-3 mb-10 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {lista.map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              key={i} 
              className="flex justify-between items-center bg-white/[0.03] p-4 rounded-2xl border border-white/5 group"
            >
              <span className="text-[11px] font-black uppercase tracking-widest">{item}</span>
              <button 
                type="button" 
                onClick={() => setLista(lista.filter((_, idx) => idx !== i))} 
                className="text-zinc-600 hover:text-red-500 transition-colors"
              >
                <XCircle size={18} />
              </button>
            </motion.div>
          ))}
          {lista.length === 0 && (
            <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-3xl">
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Nenhum exame na lista</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button type="button" onClick={onClose} className="py-5 rounded-3xl border border-white/10 text-[10px] font-black uppercase hover:bg-white/5 transition-all">Sair</button>
          <button type="button" onClick={handleSalvar} className="py-5 bg-indigo-600 rounded-3xl text-[10px] font-black uppercase hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">Confirmar</button>
        </div>
      </motion.div>
    </div>
  )
}

function ModalExames({ agendamentoId, onClose }: { agendamentoId: string, onClose: () => void }) {
  const [exames, setExames] = useState<Exame[]>([])

  useEffect(() => {
    async function f() {
      const { data } = await supabase.from('exames_complementares').select('*').eq('agendamento_id', agendamentoId)
      if (data) setExames(data as Exame[])
    }
    f()
  }, [agendamentoId])

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 text-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="bg-[#0d1017] border border-white/10 w-full max-w-lg rounded-[2.5rem] p-12 shadow-2xl"
      >
        <h3 className="text-2xl font-black uppercase italic mb-10 tracking-tighter flex items-center gap-3">
          CENTRAL DE <span className="text-indigo-500">LAUDOS</span>
        </h3>

        <div className="space-y-4 mb-10">
          {exames.map(ex => (
            <div key={ex.id} className="p-6 rounded-[2rem] border border-white/5 bg-zinc-900/50 flex justify-between items-center group hover:border-indigo-500/30 transition-all">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-black uppercase tracking-widest">{ex.nome_exame}</span>
                <div className="flex items-center gap-2">
                  <Clock size={12} className={ex.status === 'RECEBIDO' ? "text-emerald-500" : "text-amber-500"} />
                  <span className={`text-[9px] font-black uppercase ${ex.status === 'RECEBIDO' ? "text-emerald-500" : "text-amber-500"}`}>
                    {ex.status}
                  </span>
                </div>
              </div>
              {ex.status === 'RECEBIDO' ? (
                 <CheckCircle2 size={24} className="text-emerald-500" />
              ) : (
                 <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center bg-zinc-900 group-hover:bg-indigo-600/20 transition-all">
                    <Zap size={16} className="text-zinc-700" />
                 </div>
              )}
            </div>
          ))}
          
          {exames.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-relaxed">
                NENHUM EXAME COMPLEMENTAR <br/>VINCULADO A ESTE AGENDAMENTO.
              </p>
            </div>
          )}
        </div>

        <button 
          type="button" 
          onClick={onClose} 
          className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.8rem] text-xs font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-indigo-600/20"
        >
          VOLTAR AO PAINEL
        </button>
      </motion.div>
    </div>
  )
}