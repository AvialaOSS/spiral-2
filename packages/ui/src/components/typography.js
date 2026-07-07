import { jsx as _jsx } from "react/jsx-runtime";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "../lib/utils";
export const typographyVariants = cva("aviala-typography", {
    variants: {
        level: {
            display: "aviala-typography--display",
            headline1: "aviala-typography--headline1",
            headline2: "aviala-typography--headline2",
            title: "aviala-typography--title",
            subtitle: "aviala-typography--subtitle",
            text: "aviala-typography--text",
            caption: "aviala-typography--caption",
        },
    },
    defaultVariants: {
        level: "text",
    },
});
export const Typography = forwardRef(({ className, level = "text", content = "text", tone = "default", as: Tag = "span", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : Tag;
    return (_jsx(Comp, { ref: ref, className: cn(typographyVariants({ level }), className), "data-content": content, "data-tone": tone === "white" ? "white" : undefined, ...props }));
});
Typography.displayName = "Typography";
