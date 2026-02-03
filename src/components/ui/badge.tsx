import { cn } from "../../lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info"
}

const variants = {
  default: "bg-white/5 text-zinc-300 border-white/10",
  success: "bg-green-500/10 text-green-400 border-green-500/30",
  warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  danger: "bg-red-500/10 text-red-400 border-red-500/30",
  info: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-4 py-1 text-[10px] font-black uppercase tracking-widest",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

