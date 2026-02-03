'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { FileUp, Loader2, CheckCircle2, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export default function NovoLaudoPage() {
  const router = useRouter();

  const [empresas, setEmpresas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedEmpresa, setSelectedEmpresa] = useState('');
  const [tipoLaudo, setTipoLaudo] = useState<'ASO' | 'PCMSO' | 'PGR'| 'LTCAT'>('ASO');
  const [arquivo, setArquivo] = useState<File | null>(null);

  useEffect(() => {
    async function carregarEmpresas() {
      const { data, error } = await supabase
        .from('empresas')
        .select('id, nome_fantasia')
        .order('nome_fantasia');

      if (!error && data) setEmpresas(data);
    }

    carregarEmpresas();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEmpresa || !arquivo) {
      alert('Selecione a empresa e o arquivo!');
      return;
    }

    setLoading(true);

    try {
      // 🔐 Nome seguro e rastreável
      const fileExt = arquivo.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${selectedEmpresa}/${fileName}`;

      // 📤 Upload no Storage
      const { error: uploadError } = await supabase.storage
        .from('laudos')
        .upload(filePath, arquivo, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // 🧾 Registro no banco (ENUM CORRETO)
      const { error: dbError } = await supabase.from('documentos').insert({
        empresa_id: selectedEmpresa,
        tipo: tipoLaudo,
        url_path: filePath,
        nome_arquivo: arquivo.name,
        status: 'pending' // ENUM válido
      });

      if (dbError) throw dbError;

      alert('Laudo enviado com sucesso!');
      router.push(`/empresas/${selectedEmpresa}`);
    } catch (err: any) {
      console.error(err);
      alert(`Erro no upload: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-black italic uppercase">
        Upload de Laudo de Elite
      </h1>

      <form
        onSubmit={handleUpload}
        className="bg-[#0d1017] border border-white/5 p-10 rounded-[3rem] space-y-6"
      >
        {/* EMPRESA */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-500 ml-4">
            Empresa Destinatária
          </label>

          <select
            required
            value={selectedEmpresa}
            onChange={(e) => setSelectedEmpresa(e.target.value)}
            className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-indigo-500"
          >
            <option value="">Selecione a empresa...</option>
            {empresas.map((emp) => (
              <option key={emp.id} value={emp.id} className="bg-[#0d1017]">
                {emp.nome_fantasia}
              </option>
            ))}
          </select>
        </div>

        {/* TIPO */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
            Tipo de Documento
          </label>

          <div className="flex gap-4">
            {['ASO', 'PCMSO', 'PGR', 'LTCAT'].map((tipo) => (
              <button
                key={tipo}
                type="button"
                onClick={() => setTipoLaudo(tipo as any)}
                className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all border
                  ${
                    tipoLaudo === tipo
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'
                  }
                `}
              >
                {tipo}
              </button>
            ))}
          </div>
        </div>

        {/* UPLOAD */}
        <div
          className={`relative border-2 border-dashed rounded-[2.5rem] p-12 text-center transition-all
            ${
              arquivo
                ? 'border-green-500 bg-green-500/5'
                : 'border-white/10 bg-white/5 hover:border-indigo-500/50'
            }
          `}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setArquivo(e.target.files?.[0] || null)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="flex flex-col items-center gap-4">
            {arquivo ? (
              <>
                <CheckCircle2 size={32} className="text-green-500" />
                <p className="font-bold text-sm">{arquivo.name}</p>
              </>
            ) : (
              <>
                <Upload size={32} className="text-indigo-500" />
                <p className="text-xs text-slate-500 italic">
                  Clique ou arraste o PDF aqui
                </p>
              </>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 p-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <FileUp size={20} />}
          Concluir Upload
        </button>
      </form>
    </div>
  );
}
