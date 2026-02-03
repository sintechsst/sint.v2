'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase.ts'
import { motion } from 'framer-motion'
import {
    ShieldCheck, Fingerprint, QrCode, ExternalLink,
    Loader2, Search, Zap
} from 'lucide-react'
import { toast } from 'sonner'

interface LaudoAuditoria {
    id: string;
    titulo: string;
    tipo_laudo: string;
    created_at: string;
    empresas: { nome_fantasia: string };
    premium_auditorias: Array<{
        hash_original: string;
        slug_validacao: string;
    }>;
}

export default function AuditoriasPage() {
    const [laudos, setLaudos] = useState<LaudoAuditoria[]>([])
    const [loading, setLoading] = useState(true)

    async function carregarDados() {
        setLoading(true)
        try {
            const { data: laudosData, error: laudosError } = await supabase
                .from('laudos')
                .select(`id, titulo, tipo_laudo, created_at, empresas ( nome_fantasia )`)
                .order('created_at', { ascending: false });

            if (laudosError) throw laudosError;

            const { data: auditoriasData, error: audError } = await supabase
                .from('premium_auditorias')
                .select('entidade_id, hash_original, slug_validacao');

            if (audError) throw audError;

            const formatados = laudosData.map(laudo => ({
                ...laudo,
                premium_auditorias: auditoriasData.filter(a => a.entidade_id === laudo.id)
            }));

            setLaudos(formatados as unknown as LaudoAuditoria[]);
        } catch (error: any) {
            console.error(error);
            toast.error("Erro ao carregar trilha temporal.");
        } finally {
            setLoading(false);
        }
    }

    async function gerarAuditoria(laudo: LaudoAuditoria) {
        try {
            const confirmacao = confirm(`Deseja selar o laudo "${laudo.titulo}"?`)
            if (!confirmacao) return

            const res = await fetch('/api/protocol', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    laudo_id: laudo.id,
                    titulo: laudo.titulo,
                    user_id: 'session-user'
                })
            })

            if (!res.ok) throw new Error()

            toast.success("Documento selado com sucesso!")
            carregarDados()
        } catch {
            toast.error("Erro ao gerar selo.")
        }
    }

    useEffect(() => {
        carregarDados()
    }, [])

    return (
        <div className="space-y-8 p-4">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Protocolo Ativo</span>
                    </div>
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
                        Trilha de <span className="text-indigo-500">Auditoria</span>
                    </h1>
                </motion.div>

                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por Empresa..."
                        className="bg-[#0d1017] border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-sm text-white w-full md:w-80 focus:outline-none focus:border-indigo-500/50 transition-all"
                    />
                </div>
            </header>

            {loading ? (
                <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-500" /></div>
            ) : (
                <div className="grid gap-4">
                    {laudos.map((laudo) => {
                        const audit = laudo.premium_auditorias?.[0]
                        const hasHash = !!audit?.hash_original

                        return (
                            <motion.div
                                layout
                                key={laudo.id}
                                className="bg-[#0d1017] border border-white/5 p-6 rounded-[2rem] flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`p-4 rounded-2xl transition-colors ${hasHash ? 'bg-indigo-500/10 text-indigo-500' : 'bg-zinc-800 text-zinc-600'}`}>
                                        {hasHash ? <ShieldCheck size={24} /> : <Fingerprint size={24} />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white uppercase italic">{laudo.titulo}</h3>
                                        <div className="flex items-center gap-2">
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                                                {laudo.empresas?.nome_fantasia || 'Sem Empresa'} • {laudo.tipo_laudo}
                                            </p>
                                            <span className="text-zinc-800 text-[10px]">•</span>
                                            <p className="text-[10px] text-indigo-500/70 font-mono">
                                                {laudo.created_at ? new Date(laudo.created_at).toLocaleDateString('pt-BR') : '--/--/--'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {hasHash ? (
                                        <div className="flex items-center gap-2">
                                            <button type="button" className="p-3 bg-white/5 hover:bg-white/10 text-zinc-400 rounded-xl transition-all">
                                                <QrCode size={18} />
                                            </button>
                                            <a
                                                href={`/v/${audit.slug_validacao}`}
                                                target="_blank"
                                                className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/20"
                                            >
                                                <ExternalLink size={18} />
                                            </a>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => gerarAuditoria(laudo)}
                                            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-indigo-600 text-zinc-400 hover:text-white text-[10px] font-black uppercase rounded-xl transition-all border border-white/5 hover:border-indigo-500"
                                        >
                                            <Zap size={14} className="animate-pulse" />
                                            Selar Protocolo
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}