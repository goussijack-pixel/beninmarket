import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-xl border bg-white/5 border-white/8 px-4 py-2 text-sm text-white placeholder-white/20 shadow-none transition-all outline-none",
        "file:text-white/50 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "selection:bg-amber-400/30 selection:text-amber-200",
        "focus-visible:border-amber-400/40 focus-visible:bg-white/8 focus-visible:ring-2 focus-visible:ring-amber-400/20",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
        "aria-invalid:border-red-500/40 aria-invalid:ring-2 aria-invalid:ring-red-500/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }