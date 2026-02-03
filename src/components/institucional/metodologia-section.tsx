'use client'
import { motion } from 'framer-motion';

const steps = [
    { day: "Dia 1", title: "Diagnóstico Operacional", desc: "Mapeamos sua estrutura atual, fluxo documental, assinaturas e gargalos operacionais." },
    { day: "Dia 3", title: "Estruturação da Base", desc: "Criamos padrões de laudos, clientes, responsáveis técnicos e trilhas de acesso." },
    { day: "Dia 5", title: "Treinamento da Equipe", desc: "Capacitação prática para técnicos e recepção operarem com autonomia total." },
    { day: "Dia 7", title: "Go-Live Institucional", desc: "Sistema rodando com clientes reais, assinaturas válidas e rastreabilidade ativa." }
];

export function MetodologiaSection({ isDark }: { isDark: boolean }) {
    const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

    return (
        <>
            {/* Seção Implantação baseada no seu código */}
            <section className="py-32 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase mb-8 border bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                        Metodologia Sintech SST
                    </div>
                    <h2 className={`text-4xl md:text-6xl font-black italic mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Implantação em <span className="text-indigo-500">7 Dias</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-4 gap-8">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            variants={fadeIn}
                            initial="hidden"
                            whileInView="visible"
                            className={`p-10 rounded-[2.5rem] border ${isDark ? 'bg-[#11141b] border-white/10' : 'bg-white border-slate-200 shadow-lg'}`}
                        >
                            <div className="text-indigo-500 font-black uppercase text-sm mb-4">{step.day}</div>
                            <h3 className="text-2xl font-black mb-4">{step.title}</h3>
                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{step.desc}</p>
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
        </>
    );
}

