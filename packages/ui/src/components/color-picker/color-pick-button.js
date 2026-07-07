import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { cn } from "../../lib/utils";
import { parseColor } from "./color-utils";
export const ColorPickButton = forwardRef(({ className, color, selected = false, style, ...props }, ref) => {
    const swatch = parseColor(color).toHex();
    return (_jsx("button", { ref: ref, type: "button", className: cn("aviala-color-pick-button", className), "data-selected": selected ? "true" : undefined, style: style, ...props, children: _jsx("span", { className: "aviala-color-pick-button__swatch", style: { backgroundColor: swatch }, "aria-hidden": true }) }));
});
ColorPickButton.displayName = "ColorPickButton";
