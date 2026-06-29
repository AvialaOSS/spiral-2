import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-[var(--input-height-md,36px)] w-full rounded-[var(--input-radius,var(--radius-sm))] border border-[var(--input-border,var(--border))] bg-[var(--input-bg,var(--background))] px-3 py-2 text-sm text-[var(--input-fg,var(--foreground))] shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-55",
        error && "border-destructive focus-visible:ring-destructive",
        className
      )}
      ref={ref}
      aria-invalid={error || undefined}
      {...props}
    />
  )
);
Input.displayName = "Input";
