'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  Building2,
  FileText,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { formatarCNPJ } from '@/lib/formatters';

/* =========================
   TIPAGENS
========================= */

interface Empresa {
  id: string;
  tenant_id: string;
  nome_fantasia: string;
  cnpj: string;
  email?: string;
  cidade?: string;
}

type DocumentoStatus = 'pending' | 'approved' | 'expired' | 'rejected';

interface Laudo {
  id: string;
  empresa_id: string;
  tenant_id: string;
  tipo: string;
  status: DocumentoStatus;
  created_at: string;
  url_path: string;
  nome_arquivo: string | null;
}

/* =========================
   CONSTANTES
========================= */

const STATUS_LABEL: Record<DocumentoStatus, string> = {
  pending: 'Pendente',
  approved: 'Aprovado',
  expired: 'Expirado',
  rejected: 'Rejeitado'
};

/* =========================
   COMPONENTE
========================= */

export default function DossieEmpresaPage() {
  const params = useParams();
  const router = useRouter();
  const empresaId = params?.id as string;

  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [laudos, setLaudos] = useState<Laudo[]>([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     HELPERS
  ========================= */

  const visualizarPDF = (path: string) => {
    const { data } = supabase
      .storage
      .from('laudos')
      .getPublicUrl(path);

    if (data?.publicUrl) {
      window.open(data.publicUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const excluirDocumento = async (laudo: Laudo) => {
    const confirmacao = window.confirm(
      'Tem certeza que deseja excluir este documento? Essa ação não pode ser desfeita.'
    );

    if (!confirmacao) return;

    const toastId = toast.loading('Removendo documento...');

    try {
      // 1️⃣ Remove do storage
      const { error: storageError } = await supabase
        .storage
        .from('laudos')
        .remove([laudo.url_path]);

      if (storageError) throw storageError;

      // 2️⃣ Remove do banco
      const { error: dbError } = await supabase
        .from('documentos')
        .delete()
        .eq('id', laudo.id);

      if (dbError) throw dbError;

      // 3️⃣ Atualiza estado
      setLaudos(prev => prev.filter(d => d.id !== laudo.id));

      toast.success('Documento excluído com sucesso!', { id: toastId });

    } catch (error) {
      console.error(error);
      toast.error('Erro ao excluir documento.', { id: toastId });
    }
  };

  /* =========================
     LOAD INICIAL (MULTI-TENANT)
  ========================= */

  useEffect(() => {
    async function carregarDossie() {
      setLoading(true);

      // 🔐 Usuário autenticado
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();

      if (!user || authError) {
        router.push('/login');
        return;
      }

      // 🏢 Empresa (já filtrada por tenant via RLS futuramente)
      const { data: empresaData, error: empresaError } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', empresaId)
        .single();

      if (empresaError || !empresaData) {
        toast.error('Empresa não encontrada');
        router.push('/empresas');
        return;
      }

      // 📄 Documentos da empresa
      const { data: documentosData, error: documentosError } = await supabase
        .from('documentos')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('created_at', { ascending: false });

      if (documentosError) {
        toast.error('Erro ao carregar documentos');
      }

      setEmpresa(empresaData);
      setLaudos(documentosData || []);
      setLoading(false);
    }

    if (empresaId) {
      carregarDossie();
    }
  }, [empresaId, router]);

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="p-10 animate-pulse text-slate-500">
        Carregando dossiê da empresa...
      </div>
    );
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="space-y-10">

      <Link
        href="/empresas"
        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
      >
        <ArrowLeft size={16} />
        Voltar para empresas
      </Link>

      {/* HEADER */}
      <div className="bg-[#0d1017] border border-white/5 p-10 rounded-[3rem] flex flex-col md:flex-row justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="p-6 rounded-3xl bg-indigo-500/10 text-indigo-500">
            <Building2 size={40} />
          </div>
          <div>
            <h1 className="text-3xl font-black italic uppercase text-white">
              {empresa?.nome_fantasia}
            </h1>
            <p className="text-slate-500 font-medium">
              CNPJ: {formatarCNPJ(empresa?.cnpj ?? '')}
              {empresa?.cidade && ` • ${empresa.cidade}`}
            </p>
          </div>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
          <ShieldCheck size={16} className="text-green-500" />
          <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">
            Cliente ativo
          </span>
        </div>
      </div>

      {/* TABELA */}
      <div className="bg-[#0d1017] border border-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-bold italic uppercase">Documentos SST</h3>
          <span className="text-xs text-slate-500">
            {laudos.length} documentos
          </span>
        </div>

        <table className="w-full">
          <thead className="text-[10px] uppercase text-slate-500">
            <tr>
              <th className="px-8 py-4 text-left">Documento</th>
              <th className="px-8 py-4">Data</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4 text-right">Ações</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {laudos.map((laudo) => (
              <tr key={laudo.id} className="hover:bg-white/[0.02]">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-indigo-500" />
                    <div>
                      <p className="font-bold text-white">{laudo.tipo}</p>
                      <p className="text-xs text-slate-500">{laudo.nome_arquivo}</p>
                    </div>
                  </div>
                </td>

                <td className="px-8 py-6 text-xs text-slate-500">
                  {new Date(laudo.created_at).toLocaleDateString('pt-BR')}
                </td>

                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    {laudo.status === 'approved' ? (
                      <CheckCircle2 size={14} className="text-green-500" />
                    ) : (
                      <Clock size={14} className="text-amber-500" />
                    )}
                    <span className="text-[10px] font-black uppercase">
                      {STATUS_LABEL[laudo.status]}
                    </span>
                  </div>
                </td>

                <td className="px-8 py-6 text-right">
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => visualizarPDF(laudo.url_path)}
                      className="p-3 bg-white/5 rounded-xl hover:bg-indigo-500"
                      title="Visualizar"
                    >
                      <ExternalLink size={16} />
                    </button>

                    <button
                      onClick={() => excluirDocumento(laudo)}
                      className="p-3 bg-white/5 rounded-xl hover:bg-red-500"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {laudos.length === 0 && (
              <tr>
                <td colSpan={4} className="py-16 text-center text-slate-500 italic">
                  Nenhum documento encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
