import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { forwardRef, useCallback, useEffect, useRef, useState, } from "react";
import { typographyVariants } from "./typography";
import { cn } from "../lib/utils";
import { OverlayPointerSvg, POPOVER_POINTER } from "./overlay-pointer";
/**
 * Radix Popover closes on `window` blur (e.g. focusing DevTools). Suppress only
 * blur-initiated closes; pointer-down (outside click, trigger toggle) and Escape
 * must still dismiss on the first interaction.
 */
export function Popover({ open: openProp, defaultOpen = false, onOpenChange, modal = false, ...props }) {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isControlled = openProp !== undefined;
    const open = isControlled ? openProp : internalOpen;
    const windowBlurCloseRef = useRef(false);
    const pointerDownCloseRef = useRef(false);
    useEffect(() => {
        const markWindowBlur = () => {
            windowBlurCloseRef.current = true;
        };
        window.addEventListener("blur", markWindowBlur, true);
        return () => window.removeEventListener("blur", markWindowBlur, true);
    }, []);
    useEffect(() => {
        if (!open) {
            pointerDownCloseRef.current = false;
            return;
        }
        const markPointerDown = () => {
            pointerDownCloseRef.current = true;
        };
        document.addEventListener("pointerdown", markPointerDown, true);
        return () => document.removeEventListener("pointerdown", markPointerDown, true);
    }, [open]);
    const handleOpenChange = useCallback((nextOpen) => {
        if (!nextOpen && windowBlurCloseRef.current && !pointerDownCloseRef.current) {
            windowBlurCloseRef.current = false;
            return;
        }
        windowBlurCloseRef.current = false;
        pointerDownCloseRef.current = false;
        if (!isControlled) {
            setInternalOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
    }, [isControlled, onOpenChange]);
    return (_jsx(PopoverPrimitive.Root, { open: open, onOpenChange: handleOpenChange, modal: modal, ...props }));
}
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverContent = forwardRef(({ className, children, align = "center", sideOffset = 8, collisionPadding = 8, portalled = true, showArrow = false, ...props }, ref) => {
    const content = (_jsxs(PopoverPrimitive.Content, { ref: ref, align: align, sideOffset: sideOffset, collisionPadding: collisionPadding, className: cn("aviala-popover-content", className), ...props, children: [_jsx("div", { className: cn("aviala-popover-content__surface", typographyVariants({ level: "text" })), children: children }), showArrow ? (_jsx(PopoverPrimitive.Arrow, { asChild: true, width: POPOVER_POINTER.width, height: POPOVER_POINTER.height, children: _jsx(OverlayPointerSvg, { variant: "popover", className: "aviala-popover-content__arrow", width: POPOVER_POINTER.width, height: POPOVER_POINTER.height, path: POPOVER_POINTER.path }) })) : null] }));
    if (!portalled)
        return content;
    return _jsx(PopoverPrimitive.Portal, { children: content });
});
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
