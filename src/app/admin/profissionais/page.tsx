'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { AnimatePresence, motion } from 'framer-motion'
import { Award, MapPin, CheckCircle2, Shield, Loader2, Plus, X, ChevronDown, Search } from 'lucide-react'
import { toast } from 'sonner'

interface Profissional {
  id: string
  nome: string
  especialidade: string
  registro_numero: string 
  cidade: string
  ativo: boolean
  tenant_id?: string
}

export default function ProfissionaisPage() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('Todos')
  const [busca, setBusca] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [novoProf, setNovoProf] = useState({
    nome: '',
    especialidade: 'Técnico',
    registro_numero: '',
    cidade: '',
    ativo: true
  })

  useEffect(() => {
    fetchProfissionais()
  }, [])

  async function fetchProfissionais() {
    setLoading(true)
    const { data, error } = await supabase.from('profissionais').select('*').order('nome')
    if (!error && data) setProfissionais(data as Profissional[])
    setLoading(false)
  }

  // LÓGICA DE FILTRO E BUSCA (USANDO setBusca AGORA)
  const filtrados = profissionais.filter(p => {
    const matchesFiltro = filtro === 'Todos' || p.especialidade === filtro
    const matchesBusca = p.nome?.toLowerCase().includes(busca.toLowerCase())
    return matchesFiltro && matchesBusca
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('profissionais')
        .insert([{
          nome: novoProf.nome,
          especialidade: novoProf.especialidade,
          registro_numero: novoProf.registro_numero,
          cidade: novoProf.cidade,
          ativo: novoProf.ativo,
          tenant_id: '00000000-0000-0000-0000-000000000000'
        }])

      if (error) throw error

      toast.success("Cadastrado com sucesso!")
      setIsModalOpen(false)
      setNovoProf({ nome: '', especialidade: 'Técnico', registro_numero: '', cidade: '', ativo: true })
      fetchProfissionais()
    } catch (err: unknown) {
      const error = err as Error
      toast.error("Erro: " + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remover especialista?")) return;
    try {
      const { error } = await supabase.from('profissionais').delete().eq('id', id);
      if (error) throw error;
      setProfissionais(prev => prev.filter(p => p.id !== id));
      toast.success("Removido!");
    } catch (err: unknown) {
      const error = err as Error
      toast.error(error.message);
    }
  }

  return (
    <div className="space-y-8 p-6 lg:p-10 text-white">
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">
            Corpo <span className="text-indigo-500">Técnico</span>
          </h2>
          
          <div className="flex bg-zinc-900/50 border border-white/5 p-1.5 rounded-2xl mt-4 w-fit">
            {['Todos', 'Médico', 'Engenheiro', 'Técnico'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFiltro(cat)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                  filtro === cat ? 'bg-indigo-600 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* BARRA DE BUSCA ATIVADA */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
            <input 
              type="text"
              placeholder="Buscar especialista..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="bg-zinc-900/50 border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 text-xs text-white focus:outline-none focus:border-indigo-500/50 w-full md:w-64 transition-all"
            />
          </div>

          <button 
            type="button"
            onClick={() => setIsModalOpen(true)} 
            className="bg-indigo-600 px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase flex items-center gap-2 hover:bg-indigo-500 transition-all active:scale-95"
          >
            <Plus size={16} /> Adicionar
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? <Loader2 className="animate-spin text-indigo-500 mx-auto col-span-full" /> : 
          filtrados.map((pro) => (
            <div key={pro.id} className="bg-[#0d1017] border border-white/5 p-6 rounded-[2rem] relative group hover:border-indigo-500/30 transition-all">
              <div className="flex justify-between mb-4">
                <div className="p-3 bg-zinc-900 rounded-xl text-indigo-500">
                  {pro.especialidade === 'Médico' ? <Shield size={24} /> : <Award size={24} />}
                </div>
                
                <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                  pro.ativo ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' : 'border-red-500/20 text-red-500 bg-red-500/5'
                }`}>
                  {pro.ativo && <CheckCircle2 size={10} />} {/* USANDO CHECKCIRCLE2 */}
                  {pro.ativo ? 'Ativo' : 'Indisponível'}
                </span>
              </div>
              
              <h3 className="font-bold uppercase italic text-lg leading-tight">{pro.nome}</h3>
              <p className="text-indigo-400 text-[10px] font-black mb-4 uppercase tracking-widest">{pro.especialidade} • {pro.registro_numero}</p>
              
              <div className="text-zinc-500 text-xs flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex items-center gap-2 italic"><MapPin size={14} /> {pro.cidade}</div>
                <button type="button" onClick={() => handleDelete(pro.id)} className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-500 transition-all">
                  <X size={18} />
                </button>
              </div>
            </div>
          ))
        }
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0d1017] border border-white/10 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black italic uppercase">Novo <span className="text-indigo-500">Especialista</span></h3>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-4 mb-2 block tracking-widest">Nome Completo</label>
                  <input required className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-indigo-500/50 transition-all" value={novoProf.nome} onChange={e => setNovoProf({...novoProf, nome: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-zinc-500 ml-4 mb-2 block tracking-widest">Especialidade</label>
                    <div className="relative">
                      <select className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none appearance-none cursor-pointer" value={novoProf.especialidade} onChange={e => setNovoProf({...novoProf, especialidade: e.target.value})}>
                        <option value="Médico" className="bg-[#0d1017]">Médico</option>
                        <option value="Engenheiro" className="bg-[#0d1017]">Engenheiro</option>
                        <option value="Técnico" className="bg-[#0d1017]">Técnico</option>
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={18} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-zinc-500 ml-4 mb-2 block tracking-widest">Registro</label>
                    <input required className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-indigo-500/50" value={novoProf.registro_numero} onChange={e => setNovoProf({...novoProf, registro_numero: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-4 mb-2 block tracking-widest">Status</label>
                  <div className="relative">
                    <select 
                      className={`w-full bg-zinc-900/50 border rounded-2xl py-4 px-6 text-white outline-none appearance-none cursor-pointer transition-all ${
                        novoProf.ativo ? 'border-emerald-500/30' : 'border-red-500/30'
                      }`}
                      value={novoProf.ativo ? 'true' : 'false'}
                      onChange={(e) => setNovoProf({...novoProf, ativo: e.target.value === 'true'})}
                    >
                      <option value="true" className="bg-[#0d1017] text-emerald-500">✅ Ativo / Disponível</option>
                      <option value="false" className="bg-[#0d1017] text-red-500">❌ Indisponível</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={18} />
                  </div>
                </div>

                <button disabled={isSubmitting} type="submit" className="w-full bg-indigo-600 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-indigo-500 transition-all active:scale-95 flex justify-center items-center">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : 'Confirmar Cadastro'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )

}
