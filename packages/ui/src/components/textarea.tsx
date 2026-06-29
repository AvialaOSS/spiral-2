import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../lib/utils";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-[var(--input-radius,var(--radius-sm))] border border-[var(--input-border,var(--border))] bg-[var(--input-bg,var(--background))] px-3 py-2 text-sm text-[var(--input-fg,var(--foreground))] shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-55",
        error && "border-destructive focus-visible:ring-destructive",
        className
      )}
      ref={ref}
      aria-invalid={error || undefined}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
