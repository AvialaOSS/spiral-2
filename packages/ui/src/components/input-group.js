import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { cn } from "../lib/utils";
import { typographyVariants } from "./typography";
export const InputGroup = forwardRef(({ className, orientation = "horizontal", ...props }, ref) => (_jsx("div", { ref: ref, className: cn("flex", orientation === "horizontal"
        ? "flex-row items-center gap-[var(--gap-component,8px)]"
        : "flex-col gap-[var(--gap-inside,4px)]", className), ...props })));
InputGroup.displayName = "InputGroup";
export const InputGroupAddon = forwardRef(({ className, ...props }, ref) => (_jsx("div", { ref: ref, className: cn("flex items-center shrink-0", typographyVariants({ level: "caption" }), className), ...props })));
InputGroupAddon.displayName = "InputGroupAddon";
