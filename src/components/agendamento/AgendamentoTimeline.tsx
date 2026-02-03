export function AgendamentoTimeline({ status }: { status: string }) {
  const steps = ['Pendente', 'Confirmado', 'Em Atendimento', 'Concluído']

  const getActiveIndex = (status: string) => {
    const s = status?.toUpperCase();

    if (s === 'CANCELADO') return 3;

    if (s === 'PENDENTE') return 0;
    if (s === 'APROVADO' || s === 'CONFIRMADO') return 1;
    if (s === 'EM_ATENDIMENTO' || s === 'AGUARDANDO_EXAMES') return 2;
    if (s === 'CONCLUIDO' || s === 'CONCLUÍDO') return 3;

    return 0;
  };

  const currentIdx = getActiveIndex(status)

  return (
    <div className="flex items-center gap-1 mt-3">
      {steps.map((step, i) => {
        const isPast = currentIdx > i
        const isCurrent = currentIdx === i
        const isCompleted = isPast || isCurrent

        const isCancelled = status?.toUpperCase() === 'CANCELADO';
        const activeBg = isCancelled ? 'bg-red-500' : 'bg-indigo-600 dark:bg-indigo-500';
        const activeShadow = isCancelled ? 'rgba(239, 68, 68, 0.5)' : 'rgba(79, 70, 229, 0.5)';

        return (
          <div key={step} className="flex items-center">
            {/* Círculo com efeito de brilho se estiver ativo */}
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500
            ${isCompleted ? `${activeBg} shadow-[0_0_8px_${activeShadow}] scale-110` : 'bg-zinc-200 dark:bg-white/10'}`}
            />

            {/* Texto do Step */}
            <span
              className={`text-[9px] font-black uppercase tracking-tighter ml-2 whitespace-nowrap transition-colors
                ${isCurrent
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : isCompleted
                    ? 'text-zinc-500 dark:text-zinc-400'
                    : 'text-zinc-300 dark:text-zinc-600'}`}
            >
              {step}
            </span>

            {/* Linha Conectora - Só fica colorida se o PRÓXIMO passo já estiver completo ou sendo o atual */}
            {i < steps.length - 1 && (
              <div className={`w-4 h-[1px] mx-2 transition-colors
                ${currentIdx > i ? 'bg-indigo-600/50 dark:bg-indigo-500/50' : 'bg-zinc-200 dark:bg-white/5'}`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}