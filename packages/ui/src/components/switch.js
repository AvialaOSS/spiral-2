import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { forwardRef } from "react";
import { cn } from "../lib/utils";
export const Switch = forwardRef(({ className, size = "regular", ...props }, ref) => (_jsxs(SwitchPrimitive.Root, { className: cn("aviala-switch", size === "small" && "aviala-switch--small", className), ref: ref, ...props, children: [_jsx("span", { "aria-hidden": true, className: "aviala-switch__surface" }), _jsx(SwitchPrimitive.Thumb, { className: "aviala-switch__thumb" })] })));
Switch.displayName = SwitchPrimitive.Root.displayName;
