import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 w-full rounded-lg border border-border/60 bg-card px-3 py-1 text-sm shadow-sm transition-all duration-200",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "placeholder:text-muted-foreground/60",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:border-primary/40",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "hover:border-border",
        className
      )}
      {...props}
    />
  )
}

export { Input }
