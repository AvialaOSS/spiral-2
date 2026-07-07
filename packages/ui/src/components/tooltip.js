import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { forwardRef } from "react";
import { typographyVariants } from "./typography";
import { cn } from "../lib/utils";
import { OverlayPointerSvg, TOOLTIP_POINTER } from "./overlay-pointer";
/** Default show delay — 300ms per ALD / Radix convention. */
export const TOOLTIP_DELAY_DURATION = 300;
export function TooltipProvider({ delayDuration = TOOLTIP_DELAY_DURATION, skipDelayDuration = 0, ...props }) {
    return (_jsx(TooltipPrimitive.Provider, { delayDuration: delayDuration, skipDelayDuration: skipDelayDuration, ...props }));
}
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;
export const TooltipContent = forwardRef(({ className, children, sideOffset = 4, collisionPadding = 8, showArrow = true, ...props }, ref) => (_jsx(TooltipPrimitive.Portal, { children: _jsxs(TooltipPrimitive.Content, { ref: ref, sideOffset: sideOffset, collisionPadding: collisionPadding, className: cn("aviala-tooltip-content", className), ...props, children: [_jsx("div", { className: cn("aviala-tooltip-content__surface", typographyVariants({ level: "caption" })), children: children }), showArrow ? (_jsx(TooltipPrimitive.Arrow, { asChild: true, width: TOOLTIP_POINTER.width, height: TOOLTIP_POINTER.height, children: _jsx(OverlayPointerSvg, { className: "aviala-tooltip-content__arrow", width: TOOLTIP_POINTER.width, height: TOOLTIP_POINTER.height, path: TOOLTIP_POINTER.path }) })) : null] }) })));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
