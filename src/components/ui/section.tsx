import { cn } from "../../lib/utils"

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  badge?: string
}

export function Section({
  title,
  subtitle,
  badge,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn("py-24 px-6 max-w-7xl mx-auto", className)}
      {...props}
    >
      {(title || subtitle || badge) && (
        <div className="text-center mb-16">
          {badge && (
            <div className="mb-6 flex justify-center">
              <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                {badge}
              </span>
            </div>
          )}

          {title && (
            <h2 className="text-3xl md:text-5xl font-black italic tracking-tight text-white mb-4">
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="text-zinc-400 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {children}
    </section>
  )
}

