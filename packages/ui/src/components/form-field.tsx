import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { Label } from "./label";

export type FormFieldProps = HTMLAttributes<HTMLDivElement> & {
  label?: string;
  htmlFor?: string;
  description?: ReactNode;
  error?: string;
  required?: boolean;
};

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, label, htmlFor, description, error, required, children, ...props }, ref) => (
    <div ref={ref} className={cn("grid gap-[var(--gap-inside,4px)]", className)} {...props}>
      {label ? (
        <Label htmlFor={htmlFor}>
          {label}
          {required ? <span className="text-destructive ml-0.5">*</span> : null}
        </Label>
      ) : null}
      {children}
      {description && !error ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : null}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
);
FormField.displayName = "FormField";
