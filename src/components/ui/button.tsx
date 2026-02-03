import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils.ts"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-2xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-indigo-600 text-white hover:bg-indigo-500",
        outline:
          "border border-white/10 bg-transparent hover:bg-white/5 text-white",
        ghost: "hover:bg-white/5 text-white",
        success: "bg-green-600 hover:bg-green-500 text-white",
        danger: "bg-red-600 hover:bg-red-500 text-white"
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6",
        lg: "h-14 px-10 text-base"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
