"use client"

import { motion } from "framer-motion"
import { fadeUp, staggerContainer } from "./motion"

export default function SectionInstitutional() {
  const pillars = [
    {
      title: "Padronização Operacional",
      desc: "Sua clínica operando com processos de empresa grande, eliminando documentos manuais e falhas humanas."
    },
    {
      title: "Rastreabilidade Técnica",
      desc: "Histórico completo de cada laudo e assinatura, garantindo segurança total em caso de auditorias."
    },
    {
      title: "Escala Regional",
      desc: "Estrutura pronta para suportar o crescimento da sua carteira de clientes sem aumentar o custo fixo."
    }
  ];

  const steps = [
    { day: "Dia 1", title: "Diagnóstico", desc: "Mapeamento completo dos seus gargalos operacionais e fluxos de SST." },
    { day: "Dia 3", title: "Estruturação", desc: "Configuração dos padrões Sintech para seus laudos, PGR e PCMSO." },
    { day: "Dia 5", title: "Treinamento", desc: "Capacitação prática da sua equipe para operar no novo padrão institucional." },
    { day: "Dia 7", title: "Go-Live", desc: "Sua operação rodando com selo de qualidade e eficiência Sintech SST." }
  ];

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="max-w-7xl mx-auto py-32 px-6"
    >
      {/* --- BLOCO 1: PILARES --- */}
      <div className="text-center mb-24">
        <motion.span variants={fadeUp} className="text-indigo-500 font-bold tracking-widest uppercase text-xs">
          O Padrão Sintech SST
        </motion.span>
        <motion.h2 variants={fadeUp} className="mt-4 text-4xl md:text-5xl font-black italic text-white">
          Pilares de Governança Operacional
        </motion.h2>
        
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {pillars.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              className="bg-[#11141b] border border-white/5 rounded-[2rem] p-8 text-left hover:border-indigo-500/30 transition-colors"
            >
              <h3 className="text-white text-xl font-bold">{item.title}</h3>
              <p className="mt-4 text-slate-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- BLOCO 2: IMPLANTAÇÃO --- */}
      <div className="mt-32 p-12 md:p-20 rounded-[3.5rem] bg-gradient-to-b from-indigo-600/10 to-transparent border border-indigo-500/20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white italic">
            Sua operação transformada em <span className="text-indigo-500">7 dias</span>
          </h2>
          <p className="mt-6 text-slate-400 max-w-2xl mx-auto">
            Não entregamos apenas acesso a um sistema. Entregamos uma consultoria de implantação que organiza sua casa em tempo recorde.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="relative p-6 rounded-2xl bg-white/5 border border-white/5"
            >
              <div className="text-indigo-500 font-mono text-xs font-bold mb-2">{step.day}</div>
              <h4 className="text-white font-bold mb-2">{step.title}</h4>
              <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )

}
