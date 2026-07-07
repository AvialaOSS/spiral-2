import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { forwardRef, useState, } from "react";
import { cn } from "../../lib/utils";
import { ColorPickerArea } from "./color-picker-area";
import { ColorPickerContext, useColorPickerContext } from "./color-picker-context";
import { ColorPickerInputs } from "./color-picker-inputs";
import { ColorPickerPresets } from "./color-picker-presets";
import { ColorPickerSlider } from "./color-picker-slider";
import { useColorPickerState } from "./use-color-picker-state";
export function ColorPicker({ children, className, disabled, presets, onPresetsChange, maxPresets = 8, value, defaultValue, onChange, format, defaultFormat, onFormatChange, open: controlledOpen, defaultOpen = false, onOpenChange, }) {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const open = controlledOpen ?? uncontrolledOpen;
    const handleOpenChange = (next) => {
        if (disabled && next)
            return;
        if (controlledOpen === undefined) {
            setUncontrolledOpen(next);
        }
        onOpenChange?.(next);
    };
    const state = useColorPickerState({
        value,
        defaultValue,
        onChange,
        format,
        defaultFormat,
        onFormatChange,
    });
    const contextValue = {
        ...state,
        open,
        disabled,
        presets,
        onPresetsChange,
        maxPresets,
    };
    return (_jsx(ColorPickerContextProvider, { value: contextValue, children: _jsx(PopoverPrimitive.Root, { open: open, onOpenChange: handleOpenChange, modal: false, children: _jsx("div", { className: cn("inline-flex", className), children: children }) }) }));
}
function ColorPickerContextProvider({ value, children, }) {
    return _jsx(ColorPickerContext.Provider, { value: value, children: children });
}
export const ColorPickerTrigger = forwardRef(({ className, size = "regular", allRound = false, placeholder = "Select color", ...props }, ref) => {
    const { value, open, disabled } = useColorPickerContext();
    return (_jsx(PopoverPrimitive.Trigger, { asChild: true, children: _jsxs("button", { ref: ref, type: "button", className: cn("aviala-color-picker-trigger", className), "data-size": size, "data-all-round": allRound ? "true" : "false", "data-open": open ? "true" : "false", "data-disabled": disabled ? "true" : undefined, disabled: disabled, ...props, children: [_jsx("span", { className: "aviala-color-picker-trigger__swatch", children: _jsx("span", { className: "aviala-color-picker-trigger__swatch-inner", style: { backgroundColor: value }, "aria-hidden": true }) }), _jsx("span", { className: "aviala-color-picker-trigger__value", children: value ? (value.replace(/^#/, "").slice(0, 6).toUpperCase()) : (_jsx("span", { className: "aviala-color-picker-trigger__placeholder", children: placeholder })) })] }) }));
});
ColorPickerTrigger.displayName = "ColorPickerTrigger";
function isWithinSelectLayer(target) {
    return (target instanceof Element &&
        (target.closest(".aviala-select-content") !== null ||
            target.closest("[data-radix-select-viewport]") !== null));
}
export const ColorPickerContent = forwardRef(({ className, align = "start", sideOffset = 8, showEyedropper = true, showPresets = true, ...props }, ref) => {
    const { presets, onPresetsChange, maxPresets, disabled } = useColorPickerContext();
    return (_jsx(PopoverPrimitive.Portal, { children: _jsx(PopoverPrimitive.Content, { ref: ref, align: align, sideOffset: sideOffset, className: cn("aviala-color-picker-content", className), onPointerDownOutside: (event) => {
                if (isWithinSelectLayer(event.target))
                    event.preventDefault();
            }, onInteractOutside: (event) => {
                if (isWithinSelectLayer(event.target))
                    event.preventDefault();
            }, onFocusOutside: (event) => event.preventDefault(), ...props, children: _jsxs("div", { className: "aviala-color-picker-panel", children: [_jsx(ColorPickerArea, { disabled: disabled }), _jsx(ColorPickerSlider, { kind: "hue", disabled: disabled }), _jsx(ColorPickerSlider, { kind: "alpha", disabled: disabled }), _jsx(ColorPickerInputs, { disabled: disabled, showEyedropper: showEyedropper }), showPresets ? (_jsx(ColorPickerPresets, { disabled: disabled, presets: presets, onPresetsChange: onPresetsChange, maxPresets: maxPresets })) : null] }) }) }));
});
ColorPickerContent.displayName = "ColorPickerContent";
