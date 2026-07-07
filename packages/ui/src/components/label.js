import { jsx as _jsx } from "react/jsx-runtime";
import * as LabelPrimitive from "@radix-ui/react-label";
import { forwardRef } from "react";
import { cn } from "../lib/utils";
import { typographyVariants } from "./typography";
export const Label = forwardRef(({ className, ...props }, ref) => (_jsx(LabelPrimitive.Root, { ref: ref, className: cn(typographyVariants({ level: "text" }), "peer-disabled:cursor-not-allowed peer-disabled:opacity-55", className), ...props })));
Label.displayName = LabelPrimitive.Root.displayName;
