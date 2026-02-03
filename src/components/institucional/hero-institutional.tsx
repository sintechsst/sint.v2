"use client"

import { motion } from "framer-motion"
import { fadeUp, staggerContainer } from "./motion.ts"

export default function HeroInstitutional() {
  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="relative py-32 px-6 text-center"
    >
      {/* Badge de Destaque Regional */}
      <motion.div
        variants={fadeUp}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-8"
      >
        Líder em Estruturação SST — SJDR e Região
      </motion.div>

      {/* Título Principal - H1 para SEO */}
      <motion.h1
        variants={fadeUp}
        className="text-5xl md:text-7xl font-black tracking-tight text-white leading-tight"
      >
        Sintech <span className="text-indigo-500 italic">SST</span>
        <br />
        <span className="text-3xl md:text-5xl font-light text-slate-300">Estruturação e Gestão Digital</span>
      </motion.h1>

      <motion.p
        variants={fadeUp}
        className="mt-8 max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed"
      >
        Transformamos clínicas e consultorias de <span className="text-white">SJDR</span> em operações de alto padrão, escaláveis e com total conformidade jurídica.
      </motion.p>

      {/* Ação Principal */}
      <motion.div
        variants={fadeUp}
        className="mt-12 flex flex-col md:flex-row gap-4 justify-center items-center"
      >
        <a
          href="#leads"
          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black transition-all transform hover:scale-105 shadow-xl shadow-indigo-500/20"
        >
          Solicitar Diagnóstico Gratuito
        </a>
        <a
          href="#metodologia"
          className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold transition-all"
        >
          Conhecer Metodologia
        </a>
      </motion.div>
    </motion.section>
  )
}