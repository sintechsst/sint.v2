'use client';

import React, { useState } from 'react';
import { motion, Variants, useScroll, useSpring } from 'framer-motion';
import {
  ShieldCheck, Zap, ArrowRight, Star, Sun, Moon,
  Smartphone, Loader2, CheckCircle2, Plus, Minus, Target,
  BarChart3, Users2, Clock, FileText, HelpCircle,
  Instagram, Linkedin, Lock as LockIcon
} from 'lucide-react';

// --- ANIMAÇÕES ---
const fadeIn: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

// --- COMPONENTE DE FAQ INDIVIDUAL ---
const FAQItem = ({ question, answer, isDark }: { question: string, answer: string, isDark: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`border-b ${isDark ? 'border-white/5' : 'border-slate-200'} overflow-hidden`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left hover:text-indigo-500 transition-colors group"
      >
        <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{question}</span>
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </div>
      </button>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className={`pb-6 text-sm md:text-base leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
        >
          {answer}
        </motion.div>
      )}
    </div>
  );
};

export default function LandingPageSafeComp() {
  const [isDark, setIsDark] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'mensal' | 'anual'>('mensal');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    tipo: ''
  });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const toggleTheme = () => setIsDark(!isDark);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      value = value.replace(/^(\d{0,2})(\d{0,5})(\d{0,4}).*/, (match, p1, p2, p3) => {
        let res = "";
        if (p1) res += `(${p1}`;
        if (p2) res += `) ${p2}`;
        if (p3) res += `-${p3}`;
        return res;
      });
      setFormData({ ...formData, whatsapp: value });
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const WEBHOOK_URL = "https://hook.us2.make.com/6pizh6q25j7bo5k62g2az4px6twggnxv";
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      setSent(true);
    } catch (error) {
      alert("Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${isDark ? 'bg-[#0a0c10] text-white' : 'bg-slate-50 text-slate-900'} min-h-screen transition-colors duration-500 font-sans selection:bg-indigo-500/30 overflow-x-hidden`}>
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-indigo-600 z-[100] origin-left" style={{ scaleX }} />

      {/* --- TOGGLE TEMA --- */}
      <div className="fixed top-6 right-6 z-[100]">
        <button onClick={toggleTheme} className={`p-3 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-yellow-400' : 'bg-white border-slate-200 text-indigo-600 shadow-xl'}`}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* --- HERO --- */}
      <section className="relative pt-24 pb-32 px-6 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase mb-8 border ${isDark ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-indigo-100 text-indigo-600 border-indigo-200'}`}>
            <Star size={12} fill="currentColor" /> Gestão SST de Elite
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-8 italic tracking-tighter leading-[0.95]">
            A Plataforma que  <br />
            <span className={`text-transparent bg-clip-text bg-gradient-to-b ${isDark ? 'from-white to-slate-500' : 'from-indigo-600 to-indigo-900'} italic`}>
              Organiza seu SST do Agendamento à Auditoria.
            </span>
          </h1>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto mb-12 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Clínicas, consultorias e técnicos usam o sistema para centralizar profissionais, documentos legais, ordens de serviço e rastreabilidade jurídica em um só lugar.
          </p>
          <a href="#leads"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl transition-all transform hover:-translate-y-1 inline-block"
          >
            Ver a Plataforma em Ação
          </a>
          <p className="mt-4 text-sm opacity-70">
            Avaliação gratuita da sua operação SST em 15 minutos
          </p>

          {/* --- SELO DE AUTORIDADE REGIONAL ANIMADO --- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mt-12 flex flex-col items-center gap-6"
          >

            {/* Badge principal */}
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0px rgba(99,102,241,0.0)",
                  "0 0 25px rgba(99,102,241,0.25)",
                  "0 0 0px rgba(99,102,241,0.0)"
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`flex items-center gap-4 px-8 py-4 rounded-full border backdrop-blur-md
      ${isDark
                  ? "bg-white/5 border-white/10 text-slate-200"
                  : "bg-white border-slate-200 text-slate-700 shadow-lg"
                }`}
            >
              <ShieldCheck size={20} className="text-indigo-500" />
              <span className="text-xs md:text-sm uppercase tracking-[0.25em] font-black text-center">
                Padrão Operacional SST — Região Campo das Vertentes
              </span>
            </motion.div>

            {/* Selos regulatórios */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-4 text-[10px] uppercase tracking-widest opacity-70"
            >
              {[
                "Lei 14.063/2020",
                "MP 2.200-2/2001",
                "LGPD Ready",
                "Registros Auditáveis"
              ].map((item, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full border border-indigo-500/30 text-indigo-400"
                >
                  {item}
                </span>
              ))}
            </motion.div>

            {/* Texto institucional */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 0.6, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-sm text-center max-w-2xl italic"
            >
              Plataforma desenvolvida em São João del-Rei – MG, operando como infraestrutura
              digital para clínicas e consultorias que buscam padrão institucional, segurança
              jurídica e escala regional e nacional.
            </motion.p>
          </motion.div>
        </motion.div>
      </section>

      {/* --- SEGMENTAÇÃO --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-5xl font-black italic mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Escolha seu modelo de operação
          </h2>
          <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Estruturação digital para quem quer crescer com padrão, não improviso.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* CLÍNICA */}
          <div className={`p-10 rounded-[2.5rem] border transition-all hover:scale-[1.02] ${isDark ? 'bg-[#11141b] border-white/10' : 'bg-white border-slate-200 shadow-lg'}`}>
            <div className="mb-6 text-indigo-500 font-black tracking-widest uppercase text-sm">Clínicas & Consultorias</div>
            <h3 className="text-2xl font-black mb-4">Estruturação Institucional de SST</h3>
            <p className="mb-6 text-sm opacity-80">
              Implantamos padrão corporativo para clínicas que precisam organizar equipe, documentos e operação para escalar sem gargalos.
            </p>
            <ul className="space-y-3 mb-8 text-sm">
              <li>✔ Múltiplos técnicos e empresas</li>
              <li>✔ Padronização documental</li>
              <li>✔ Treinamento operacional</li>
              <li>✔ Suporte consultivo</li>
            </ul>
            <a href="#leads" className="bg-indigo-600 text-white py-4 px-6 rounded-2xl font-black inline-block">
              Solicitar Diagnóstico Operacional
            </a>
          </div>

          {/* TÉCNICO */}
          <div className={`p-10 rounded-[2.5rem] border transition-all hover:scale-[1.02] ${isDark ? 'bg-[#11141b] border-white/10' : 'bg-white border-slate-200 shadow-lg'}`}>
            <div className="mb-6 text-green-500 font-black tracking-widest uppercase text-sm">Técnicos & Consultores</div>
            <h3 className="text-2xl font-black mb-4">Estrutura Profissional Individual</h3>
            <p className="mb-6 text-sm opacity-80">
              Organize seus clientes, laudos e assinaturas em um sistema profissional para atender mais empresas sem perder controle.
            </p>
            <ul className="space-y-3 mb-8 text-sm">
              <li>✔ Gestão de clientes</li>
              <li>✔ Histórico técnico</li>
              <li>✔ Assinaturas digitais</li>
              <li>✔ Operação mobile</li>
            </ul>
            <a href="#leads" className="bg-green-600 text-white py-4 px-6 rounded-2xl font-black inline-block">
              Começar Estrutura Profissional
            </a>
          </div>
        </div>
      </section>


      {/* --- DORES --- */}
      <section className={`py-24 px-6 border-y ${isDark ? 'border-white/5 bg-white/[0.01]' : 'border-slate-200 bg-slate-100/50'}`}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className={`text-3xl md:text-5xl font-black mb-16 italic ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Por que consultorias comuns <br /> <span className="text-red-600">param de crescer?</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            {[
              { icon: Clock, title: "Atraso em Laudos", desc: "PGR, PCMSO e LTCAT travados por falta de assinatura." },
              { icon: FileText, title: "Retrabalho Constante", desc: "Caos de versões em PDFs e e-mails perdidos." },
              { icon: ShieldCheck, title: "Insegurança Jurídica", desc: "Falta de rastreabilidade e validade nas entregas." },
              { icon: BarChart3, title: "Dificuldade de Escala", desc: "Sua equipe perde tempo organizando papéis." }
            ].map((card, i) => (
              <div key={i} className={`flex gap-6 p-8 rounded-[2rem] border transition-all ${isDark ? 'bg-white/[0.03] border-white/10 hover:border-red-500/40' : 'bg-white border-slate-200 shadow-sm hover:border-red-400'}`}>
                <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center ${isDark ? 'bg-red-600/20 text-red-500' : 'bg-red-100 text-red-600'}`}><card.icon size={28} /></div>
                <div>
                  <h4 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{card.title}</h4>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BENEFÍCIOS --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className={`text-2xl md:text-4xl font-bold italic mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Eficiência Máxima em cada etapa</h3>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: Target, title: "Precisão", desc: "Padronização total dos seus laudos técnicos." },
            { icon: Users2, title: "Portal", desc: "Seu cliente acessa tudo via link exclusivo." },
            { icon: Smartphone, title: "Mobile", desc: "Assinaturas feitas direto na tela do celular." },
            { icon: Zap, title: "Agilidade", desc: "Redução de 70% no tempo de entrega dos laudos." }
          ].map((item, i) => (
            <div key={i} className={`p-8 rounded-3xl border text-center transition-all ${isDark ? 'bg-[#11141b] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 ${isDark ? 'bg-indigo-500/10 text-indigo-500' : 'bg-indigo-100 text-indigo-600'}`}><item.icon size={28} /></div>
              <h4 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h4>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- IMPLANTAÇÃO --- */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase mb-8 border bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
            Metodologia Institucional
          </div>
          <h2 className={`text-4xl md:text-6xl font-black italic mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Implantação em <span className="text-indigo-500">7 Dias</span>
          </h2>
          <p className={`max-w-2xl mx-auto text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Estruturamos sua operação de SST com padrão corporativo, sem travar seu atendimento e sem curva de aprendizado para sua equipe.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              day: "Dia 1",
              title: "Diagnóstico Operacional",
              desc: "Mapeamos sua estrutura atual, fluxo documental, assinaturas e gargalos jurídicos e operacionais."
            },
            {
              day: "Dia 3",
              title: "Estruturação da Base",
              desc: "Criamos padrões de laudos, clientes, responsáveis técnicos e trilhas de acesso por perfil."
            },
            {
              day: "Dia 5",
              title: "Treinamento da Equipe",
              desc: "Capacitação prática para técnicos, recepção e gestão operarem o sistema com autonomia total."
            },
            {
              day: "Dia 7",
              title: "Go-Live Institucional",
              desc: "Sistema rodando em produção com clientes reais, assinaturas válidas e rastreabilidade ativa."
            }
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
              className={`p-10 rounded-[2.5rem] border transition-all hover:scale-[1.02] ${isDark
                ? 'bg-[#11141b] border-white/10'
                : 'bg-white border-slate-200 shadow-lg'
                }`}
            >
              <div className="text-indigo-500 font-black tracking-widest uppercase text-sm mb-4">
                {step.day}
              </div>
              <h3 className="text-2xl font-black mb-4">
                {step.title}
              </h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- COMPLIANCE & SEGURANÇA JURÍDICA --- */}
      <section className={`py-32 px-6 border-y ${isDark ? 'border-white/5 bg-white/[0.01]' : 'border-slate-200 bg-slate-100/50'}`}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase mb-8 border bg-green-500/10 text-green-500 border-green-500/20">
              Infraestrutura Institucional
            </div>
            <h2 className={`text-4xl md:text-6xl font-black italic mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Compliance & <span className="text-green-500">Segurança Jurídica</span>
            </h2>
            <p className={`max-w-3xl mx-auto text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              A Sintech SST não é apenas um sistema. É uma camada de proteção jurídica, operacional e institucional para clínicas, consultorias e técnicos que atuam sob fiscalização e risco legal constante.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Rastreabilidade Total",
                desc: "Cada ação gera log com data, hora, IP, responsável técnico, versão do documento e histórico de alterações. Transparência completa em auditorias e fiscalizações."
              },
              {
                title: "Base Legal Brasileira",
                desc: "Estrutura alinhada à MP nº 2.200-2/2001 (ICP-Brasil), Lei nº 14.063/2020 e princípios da LGPD para proteção de dados sensíveis ocupacionais."
              },
              {
                title: "Gestão por Perfil",
                desc: "Controle de acesso para técnicos, médicos, engenheiros, recepção e gestores. Cada usuário enxerga apenas o que é legalmente permitido."
              },
              {
                title: "Validade de Assinaturas",
                desc: "Registro de evidências eletrônicas ou digitais, com trilha de auditoria completa para laudos, PCMSO, ASO, relatórios e documentos técnicos."
              },
              {
                title: "Segurança de Dados",
                desc: "Criptografia em trânsito e em repouso, backups automatizados e política de retenção conforme boas práticas de compliance."
              },
              {
                title: "Pronto para Fiscalização",
                desc: "Em caso de MTE, auditoria interna ou processo trabalhista, sua clínica tem histórico técnico e documental pronto para apresentação imediata."
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`p-10 rounded-[2.5rem] border transition-all hover:scale-[1.02] ${isDark
                  ? 'bg-[#11141b] border-white/10 hover:border-green-500/40'
                  : 'bg-white border-slate-200 shadow-lg hover:border-green-400'
                  }`}
              >
                <h3 className="text-xl font-black mb-4">
                  {item.title}
                </h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className={`mt-20 p-12 md:p-16 rounded-[3rem] border text-center ${isDark
            ? 'bg-gradient-to-br from-green-600/10 to-green-900/10 border-green-500/20'
            : 'bg-green-50 border-green-200 shadow-xl'
            }`}>
            <h3 className="text-3xl md:text-4xl font-black italic mb-6">
              Pensado para quem opera sob <span className="text-green-500">responsabilidade técnica</span>
            </h3>
            <p className={`max-w-3xl mx-auto mb-10 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Ideal para clínicas de medicina ocupacional, consultorias SST, engenheiros e técnicos que precisam provar conformidade, autoria técnica e integridade documental em qualquer cenário legal.
            </p>
            <a
              href="#leads"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-12 py-6 rounded-2xl font-black transition-all transform hover:-translate-y-1 shadow-2xl"
            >
              Solicitar Avaliação de Compliance
            </a>
          </div>
        </motion.div>
      </section>

      {/* --- AUTORIDADE LOCAL / DOMINÂNCIA REGIONAL --- */}
      <section className={`py-32 px-6 border-y ${isDark ? 'border-white/5 bg-white/[0.01]' : 'border-slate-200 bg-slate-100/50'}`}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase mb-8 border bg-indigo-500/10 text-indigo-500 border-indigo-500/20">
              Estrutura Regional
            </div>

            <h2 className={`text-4xl md:text-6xl font-black italic mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              O Sistema de SST que está <br />
              <span className="text-indigo-500">estruturando São João del-Rei</span>
            </h2>

            <p className={`max-w-3xl mx-auto text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              A Sintech SST está sendo implantada como padrão operacional para clínicas, técnicos e consultorias que desejam sair do improviso manual e adotar uma infraestrutura digital de nível institucional.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Padrão Operacional Local",
                desc: "Estrutura unificada para clínicas e técnicos da cidade trabalharem com o mesmo modelo de documentos, assinaturas e fluxo técnico."
              },
              {
                title: "Rede de Indicação",
                desc: "Técnicos autônomos e consultores utilizam a Sintech SST e indicam clínicas que operam dentro do mesmo padrão digital."
              },
              {
                title: "Crescimento Regional",
                desc: "Empresas que exigem agilidade e rastreabilidade passam a priorizar clínicas que operam dentro do ecossistema Sintech."
              },
              {
                title: "Reconhecimento Institucional",
                desc: "Posicionamento como plataforma profissional para operação SST no município e região."
              },
              {
                title: "Expansão Natural",
                desc: "Modelo preparado para replicar o padrão de São João del-Rei em cidades vizinhas e polos regionais."
              },
              {
                title: "Base para Escala Nacional",
                desc: "Estrutura e marca construídas localmente com linguagem e padrão prontos para crescimento em nível Brasil."
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`p-10 rounded-[2.5rem] border transition-all hover:scale-[1.02] ${isDark
                  ? 'bg-[#11141b] border-white/10 hover:border-indigo-500/40'
                  : 'bg-white border-slate-200 shadow-lg hover:border-indigo-400'
                  }`}
              >
                <h3 className="text-xl font-black mb-4">
                  {item.title}
                </h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className={`mt-20 p-12 md:p-16 rounded-[3rem] border text-center ${isDark
            ? 'bg-gradient-to-br from-indigo-600/10 to-indigo-900/10 border-indigo-500/20'
            : 'bg-indigo-50 border-indigo-200 shadow-xl'
            }`}>
            <h3 className="text-3xl md:text-4xl font-black italic mb-6">
              Comece a operar dentro do <span className="text-indigo-500">padrão da cidade</span>
            </h3>
            <p className={`max-w-3xl mx-auto mb-10 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Clínicas e técnicos que entram agora ajudam a definir o modelo regional de SST e ganham prioridade na expansão para novos módulos, parcerias e visibilidade institucional.
            </p>
            <a
              href="#leads"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-6 rounded-2xl font-black transition-all transform hover:-translate-y-1 shadow-2xl"
            >
              Entrar no Ecossistema Sintech
            </a>
          </div>
        </motion.div>
      </section>

      {/* --- PLANOS --- */}
      <section id="planos" className={`py-32 px-6 transition-colors duration-500 ${isDark ? 'bg-[#0a0c10]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto text-center">
          <h2 className={`text-4xl md:text-6xl font-black mb-6 italic tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>Escolha seu nível de <span className="text-indigo-500">escala.</span></h2>
          <div className="flex items-center justify-center gap-4 mb-16">
            <span className={`text-sm font-bold ${billingCycle === 'mensal' ? 'text-indigo-500' : 'text-slate-500'}`}>Mensal</span>
            <button onClick={() => setBillingCycle(billingCycle === 'mensal' ? 'anual' : 'mensal')} className={`w-14 h-8 rounded-full p-1 transition-colors ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
              <div className={`w-6 h-6 rounded-full bg-indigo-600 transition-transform ${billingCycle === 'anual' ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <span className={`text-sm font-bold ${billingCycle === 'anual' ? 'text-indigo-500' : 'text-slate-500'}`}>Anual <span className="ml-1 text-[10px] bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full">ECONOMIZE 20%</span></span>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { nome: "Essencial", preco: 197, desc: "Digitalização básica para consultores individuais.", features: ["Até 50 funcionários", "Assinaturas Ilimitadas", "Portal Básico"] },
              { nome: "Elite", preco: 397, destaque: true, desc: "Ideal para consultorias em crescimento acelerado.", features: ["Funcionários Ilimitados", "Assinatura Avançada", "Portal Customizado", "Suporte VIP"] },
              { nome: "Institucional", preco: null, desc: "Solução para redes de medicina ocupacional, clínicas regionais e operações com múltiplas cidades.", features: ["Múltiplos CNPJs", "Treinamento In Company", "Gerente Exclusivo"] }
            ].map((plano, i) => {
              const valor = plano.preco ? (billingCycle === 'anual' ? Math.floor(plano.preco * 0.8) : plano.preco) : "Sob Consulta";
              return (
                <div key={i} className={`relative p-10 rounded-[2.5rem] border transition-all ${plano.destaque ? 'border-indigo-500 bg-indigo-500/5 shadow-2xl scale-105 z-10' : `border-slate-200 ${isDark ? 'bg-[#11141b] border-white/5' : 'bg-white shadow-lg'}`}`}>
                  {plano.destaque && <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest">MAIS ESCOLHIDO</div>}
                  <h4 className="text-2xl font-bold mb-2">{plano.nome}</h4>
                  <div className="mb-6"><span className="text-4xl font-black">{typeof valor === 'number' ? `R$ ${valor}` : valor}</span>{typeof valor === 'number' && <span className="text-sm">/mês</span>}</div>
                  <ul className="space-y-4 mb-10 text-left">{plano.features.map((f, idx) => (<li key={idx} className="flex items-center gap-3 text-sm font-medium"><CheckCircle2 size={18} className="text-indigo-500" /> {f}</li>))}</ul>
                  <a href="#leads" className={`w-full py-5 rounded-2xl font-black flex items-center justify-center gap-2 ${plano.destaque ? 'bg-indigo-600 text-white' : 'border border-slate-200 text-slate-900 dark:text-white'}`}>AGENDAR IMPLANTAÇÃO</a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section className="py-32 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16"><h2 className={`text-4xl md:text-5xl font-black italic mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Dúvidas <span className="text-indigo-500">Respondidas</span></h2></div>
        <div className={`rounded-[2.5rem] p-8 md:p-12 border transition-all ${isDark ? 'bg-[#11141b] border-white/5' : 'bg-slate-50 border-slate-200 shadow-xl shadow-slate-200/50'}`}>
          {[
            { q: "Esse sistema protege a clínica em fiscalização do MTE ou processo trabalhista?", a: "Sim. Todas as ações geram registros com data, hora, IP, responsável técnico e histórico de versões. Isso cria rastreabilidade jurídica dos documentos e assinaturas, fortalecendo a defesa da clínica em fiscalizações e ações trabalhistas." },
            { q: "Qual a validade jurídica das assinaturas?", a: "Nossas assinaturas seguem a Lei nº 14.063/2020 e a MP nº 2.200-2/2001, garantindo plena validade para laudos de SST." },
            { q: "Qual a diferença entre assinatura Digital e Eletrônica?", a: "A digital usa certificado ICP-Brasil, a eletrônica usa evidências como IP e GPS. Ambas são aceitas legalmente." },
            { q: "Como funciona o teste de 7 dias?", a: "Você acessa todas as funções de elite e decide se quer assinar após o período." }
          ].map((faq, i) => (<FAQItem key={i} question={faq.q} answer={faq.a} isDark={isDark} />))}
        </div>
      </section>

      {/* --- FORMULÁRIO E OBRIGADO --- */}
      <section id="leads" className="py-32 px-6 max-w-5xl mx-auto">
        <div className={`grid md:grid-cols-2 rounded-[3rem] border overflow-hidden ${isDark ? 'bg-[#11141b] border-white/10 shadow-3xl' : 'bg-white border-slate-200 shadow-2xl'}`}>
          <div className="p-12 md:p-20 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex flex-col justify-center">
            <h2 className="text-4xl font-bold mb-6 italic">{sent ? "Sua solicitação enviada!" : "A escala começa aqui."}</h2>
            <p className="opacity-80 mb-8">{sent ? "Dados processados. Clique no botão ao lado para falar no WhatsApp." : "Preencha e garanta 7 dias grátis."}</p>
          </div>
          <div className="p-12 md:p-20">
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <select
                  required
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  className={`w-full p-5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50'}`}
                >
                  <option value="">Tipo de operação</option>
                  <option value="clinica">Clínica / Consultoria</option>
                  <option value="tecnico">Técnico Autônomo</option>
                </select>

                <input required value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} className={`w-full p-5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50'}`} placeholder="Seu Nome" />
                <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={`w-full p-5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50'}`} placeholder="E-mail" />
                <input required value={formData.whatsapp} onChange={handlePhoneChange} className={`w-full p-5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50'}`} placeholder="WhatsApp" />
                <button disabled={loading} className="w-full py-5 rounded-2xl font-black bg-indigo-600 text-white flex items-center justify-center gap-2">{loading ? <Loader2 className="animate-spin" /> : <>LIBERAR ACESSO <ArrowRight size={20} /></>}</button>
              </form>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={40} /></div>
                <h3 className="text-2xl font-bold mb-8">Dados Enviados!</h3>
                <a href={`https://wa.me/5532998418800?text=Olá! Me cadastrei na SintechSST!`} target="_blank" className="bg-green-600 text-white px-8 py-5 rounded-2xl font-black inline-flex items-center gap-2">FALAR NO WHATSAPP <ArrowRight size={20} /></a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className={`py-20 px-6 border-t ${isDark ? 'bg-[#0a0c10] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="flex flex-col md:flex-row justify-between items-center w-full mb-12 gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><ShieldCheck size={24} /></div>
              <span className={`text-2xl font-black italic ${isDark ? 'text-white' : 'text-slate-900'}`}>SINTECH<span className="text-indigo-500">SST</span></span>
            </div>
            <div className="flex gap-4">
              <a href="#" className="p-3 bg-white/5 rounded-full"><Instagram size={20} /></a>
              <a href="#" className="p-3 bg-white/5 rounded-full"><Linkedin size={20} /></a>
            </div>
          </div>
          <div className="text-center mb-10 text-[10px] font-bold tracking-widest uppercase opacity-50 flex items-center gap-2">
            <LockIcon size={12} /> TECNOLOGIA PADRÃO ICP-BRASIL
          </div>
          <div className="text-[10px] uppercase opacity-40 max-w-xl text-center">
            Sintech SST é uma plataforma de gestão e tecnologia. Não substitui a responsabilidade técnica legal de médicos e engenheiros do trabalho conforme legislação vigente.
          </div>
          <div className="text-[10px] uppercase font-black opacity-30">© 2026 Sintech SST</div>
        </div>
      </footer>
    </div>
  );
}