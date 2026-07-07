import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { Label } from "./label";
import { Typography } from "./typography";

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
        <Typography level="caption" as="p">
          {description}
        </Typography>
      ) : null}
      {error ? (
        <Typography level="caption" as="p" className="text-destructive">
          {error}
        </Typography>
      ) : null}
    </div>
  )
);
FormField.displayName = "FormField";
