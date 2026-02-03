'use client';

import React, { useState } from 'react';
import { supabase } from '../../../../lib/supabase';
import { useRouter } from 'next/navigation';
import { Building2, Search, CheckCircle, AlertTriangle, Loader2, Save } from 'lucide-react';

export default function NovoCadastroEmpresa() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingCnpj, setLoadingCnpj] = useState(false);
  
  // Estados dos campos
  const [cnpj, setCnpj] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cidade, setCidade] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  // 1. CONSULTA API DA RECEITA
  const consultarCNPJ = async () => {
    const limpo = cnpj.replace(/\D/g, '');
    if (limpo.length !== 14) return alert("CNPJ deve ter 14 dígitos.");

    setLoadingCnpj(true);
    try {
      const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${limpo}`);
      const data = await res.json();

      if (res.ok) {
        setNome(data.nome_fantasia || data.razao_social);
        setEmail(data.email || '');
        setCidade(`${data.municipio} - ${data.uf}`);
        setStatus(data.descricao_situacao_cadastral);
      } else {
        alert("CNPJ não encontrado na base da Receita.");
      }
    } catch (err) {
      alert("Falha na conexão com a base de dados. Digite manualmente.");
    } finally {
      setLoadingCnpj(false);
    }
  };

  // 2. SALVAMENTO COM VALIDAÇÃO DE STATUS
  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trava de Segurança
    if (status !== 'ATIVA') {
      return alert("❌ BLOQUEADO: O Sintech só permite o cadastro de empresas com situação ATIVA para garantir a validade dos laudos.");
    }

    setLoading(true);
    const { error } = await supabase.from('empresas').insert([{
      nome_fantasia: nome,
      cnpj: cnpj.replace(/\D/g, ''),
      email: email,
      cidade: cidade,
      status_receita: status // Guardamos isso no banco para histórico
    }]);

    if (!error) {
      alert("Empresa cadastrada com sucesso!");
      router.push('/empresas');
    } else {
      alert("Erro ao salvar: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">Novo Cliente</h1>
        <p className="text-slate-500 font-medium">Validação automática via Receita Federal.</p>
      </div>

      <form onSubmit={handleSalvar} className="bg-[#0d1017] border border-white/5 p-10 rounded-[3rem] space-y-8 shadow-2xl">
        
        {/* CNPJ E BUSCA */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-500 ml-4 tracking-[0.2em]">Identificação (CNPJ)</label>
          <div className="flex gap-3">
            <input 
              required
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              placeholder="00.000.000/0000-00"
              className="flex-1 bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-indigo-500 outline-none transition-all text-sm font-mono"
            />
            <button 
              type="button"
              onClick={consultarCNPJ}
              disabled={loadingCnpj}
              className="bg-indigo-600 hover:bg-indigo-500 px-8 rounded-2xl font-bold transition-all flex items-center gap-2 group"
            >
              {loadingCnpj ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} className="group-hover:scale-110 transition-transform" />}
              <span className="hidden sm:inline">VERIFICAR</span>
            </button>
          </div>
        </div>

        {/* STATUS DA RECEITA */}
        {status && (
          <div className={`p-5 rounded-2xl flex items-center justify-between border ${status === 'ATIVA' ? 'bg-green-500/5 border-green-500/20 text-green-500' : 'bg-red-500/5 border-red-500/20 text-red-500'}`}>
            <div className="flex items-center gap-3 font-black text-[10px] uppercase tracking-widest">
              {status === 'ATIVA' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
              Situação: {status}
            </div>
            {status === 'ATIVA' && <span className="text-[9px] bg-green-500 text-black px-2 py-0.5 rounded font-bold">APROVADO</span>}
          </div>
        )}

        {/* DEMAIS DADOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-4 tracking-[0.2em]">Razão Social / Nome Fantasia</label>
            <input 
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-indigo-500 outline-none" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-4 tracking-[0.2em]">E-mail Principal</label>
            <input 
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-indigo-500 outline-none" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-4 tracking-[0.2em]">Localidade</label>
            <input 
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-indigo-500 outline-none" 
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading || status !== 'ATIVA'}
          className={`w-full py-6 rounded-3xl font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 ${
            status === 'ATIVA' 
            ? 'bg-white text-black hover:bg-indigo-500 hover:text-white shadow-xl shadow-white/5' 
            : 'bg-white/5 text-slate-600 cursor-not-allowed'
          }`}
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          Salvar no Ecossistema
        </button>
      </form>
    </div>
  );
}
