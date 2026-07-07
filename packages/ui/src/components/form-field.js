import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
import { cn } from "../lib/utils";
import { Label } from "./label";
import { Typography } from "./typography";
export const FormField = forwardRef(({ className, label, htmlFor, description, error, required, children, ...props }, ref) => (_jsxs("div", { ref: ref, className: cn("grid gap-[var(--gap-inside,4px)]", className), ...props, children: [label ? (_jsxs(Label, { htmlFor: htmlFor, children: [label, required ? _jsx("span", { className: "text-destructive ml-0.5", children: "*" }) : null] })) : null, children, description && !error ? (_jsx(Typography, { level: "caption", as: "p", children: description })) : null, error ? (_jsx(Typography, { level: "caption", as: "p", className: "text-destructive", children: error })) : null] })));
FormField.displayName = "FormField";
