import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "px-[13px] py-[20px]   outline-none bg-input border-border border file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground    dark:ring-ring/20 dark:outline-ring/40 aria-invalid:outline-destructive/60 dark:aria-invalid:outline-destructive dark:aria-invalid:ring-destructive/40 aria-invalid:ring-destructive/20 aria-invalid:border-destructive/60 dark:aria-invalid:border-destructive flex h-9 w-full min-w-0  text-base  file:inline-flex file:h-7  file:bg-transparent file:text-sm file:font-medium focus-visible:outline-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:focus-visible:ring-[1px] aria-invalid:focus-visible:outline-none md:text-sm dark:aria-invalid:focus-visible:ring-0",
        className
      )}
     
      {...props}
    />
  );
}

export { Input };
