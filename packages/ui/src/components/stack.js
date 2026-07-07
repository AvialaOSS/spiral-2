import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
import { cn } from "../lib/utils";
import { typographyVariants } from "./typography";
const gapMap = {
    inside: "var(--gap-inside, 4px)",
    component: "var(--gap-component, 8px)",
    content: "var(--gap-content, 10px)",
    block: "var(--gap-block, 14px)",
    page: "var(--gap-page-space, 24px)",
};
export const Stack = forwardRef(({ className, gap = "component", direction = "column", style, ...props }, ref) => (_jsx("div", { ref: ref, className: cn("flex", direction === "row" ? "flex-row" : "flex-col", className), style: { gap: gapMap[gap], ...style }, ...props })));
Stack.displayName = "Stack";
export const Fieldset = forwardRef(({ className, legend, children, ...props }, ref) => (_jsxs("fieldset", { ref: ref, className: cn("rounded-[var(--radius-md)] border border-border p-[var(--padding-md,10px)]", className), ...props, children: [legend ? (_jsx("legend", { className: cn("px-1", typographyVariants({ level: "text" })), children: legend })) : null, children] })));
Fieldset.displayName = "Fieldset";
