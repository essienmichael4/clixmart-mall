import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    suffix?: React.ReactNode
  }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({suffix, className, type, ...props }, ref) => {
    return (
      <div className="flex gap-2 items-center">
        <input
          type={type}
          className={cn(
            "flex h-8 w-full rounded-md border border-input bg-transparent px-3 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ",
            className
          )}
          ref={ref}
          {...props}
        />
        {suffix}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
