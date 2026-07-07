import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { EditColorPicker } from "@aviala-design/icons";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "../badge";
import { Button } from "../button";
import { Select, SelectContent, SelectItem, SelectItemGroup, SelectTrigger, SelectValue, } from "../select";
import { cn } from "../../lib/utils";
import { typographyVariants } from "../typography";
import { alphaPercent, fromHexInput, fromHslComponents, fromRgbComponents, parseColor, setAlphaPercent, toHexInput, toHslComponents, toRgbComponents, } from "./color-utils";
import { useOptionalColorPickerContext } from "./color-picker-context";
import { useColorPickerState } from "./use-color-picker-state";
export function ColorPickerInputs({ className, disabled, showEyedropper = true, value: valueProp, defaultValue, onChange, format: formatProp, onFormatChange, }) {
    const ctx = useOptionalColorPickerContext();
    const local = useColorPickerState({
        value: ctx ? undefined : valueProp,
        defaultValue: ctx?.value ?? defaultValue,
        onChange: ctx ? undefined : onChange,
        format: ctx ? undefined : formatProp,
        onFormatChange: ctx ? undefined : onFormatChange,
    });
    const { value, setValue, format, setFormat, hsva } = ctx ?? local;
    const isDisabled = disabled ?? ctx?.disabled;
    const eyeDropperSupported = typeof window !== "undefined" && "EyeDropper" in window;
    const [hexDraft, setHexDraft] = useState(() => toHexInput(value));
    const [alphaDraft, setAlphaDraft] = useState(() => String(alphaPercent(value)));
    const [componentDraft, setComponentDraft] = useState(() => buildComponentDraft(value, format));
    useEffect(() => {
        setHexDraft(toHexInput(value));
        setAlphaDraft(String(alphaPercent(value)));
        setComponentDraft(buildComponentDraft(value, format));
    }, [value, format]);
    const commitHex = useCallback(() => {
        setValue(fromHexInput(hexDraft, hsva.a), { source: "hex-input" });
    }, [hexDraft, hsva.a, setValue]);
    const commitAlpha = useCallback(() => {
        const parsed = Number.parseInt(alphaDraft, 10);
        if (Number.isNaN(parsed))
            return;
        setValue(setAlphaPercent(value, parsed), { source: "alpha-input" });
    }, [alphaDraft, setValue, value]);
    const commitComponents = useCallback(() => {
        const parts = componentDraft.split(/[\s,]+/).filter(Boolean).map(Number);
        if (parts.some((n) => Number.isNaN(n)))
            return;
        if (format === "rgb") {
            setValue(fromRgbComponents(parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0, hsva.a), {
                source: "rgb-input",
            });
        }
        else if (format === "hsl") {
            setValue(fromHslComponents(parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0, hsva.a), {
                source: "hsl-input",
            });
        }
    }, [componentDraft, format, hsva.a, setValue]);
    const handleEyedropper = useCallback(async () => {
        if (!eyeDropperSupported || isDisabled)
            return;
        try {
            const dropper = new window.EyeDropper();
            const result = await dropper.open();
            setValue(parseColor(result.sRGBHex).toHex(), { source: "eyedropper" });
        }
        catch {
            /* user cancelled */
        }
    }, [eyeDropperSupported, isDisabled, setValue]);
    return (_jsxs("div", { className: cn("aviala-color-picker-inputs", className), children: [showEyedropper ? (_jsx(Button, { type: "button", mode: "defaultCustom", size: "regular", iconOnly: true, disabled: isDisabled, "aria-label": "Pick color from screen", title: eyeDropperSupported
                    ? "Pick color from screen"
                    : "EyeDropper not supported in this browser", onClick: handleEyedropper, children: _jsx(EditColorPicker, { "aria-hidden": true }) })) : null, format === "hex" ? (_jsxs("div", { className: "aviala-color-picker-field", children: [_jsx("span", { className: "aviala-color-picker-field__badge-area", children: _jsx(Badge, { children: "#" }) }), _jsx("input", { className: cn("aviala-color-picker-field__input", typographyVariants({ level: "text" })), value: hexDraft, disabled: isDisabled, "aria-label": "Hex color", onChange: (e) => setHexDraft(e.target.value.toUpperCase()), onBlur: commitHex, onKeyDown: (e) => e.key === "Enter" && commitHex() })] })) : (_jsx("div", { className: "aviala-color-picker-field", children: _jsx("input", { className: cn("aviala-color-picker-field__input", typographyVariants({ level: "text" })), value: componentDraft, disabled: isDisabled, "aria-label": format === "rgb" ? "RGB color" : "HSL color", onChange: (e) => setComponentDraft(e.target.value), onBlur: commitComponents, onKeyDown: (e) => e.key === "Enter" && commitComponents() }) })), _jsxs("div", { className: "aviala-color-picker-field aviala-color-picker-field--alpha", children: [_jsx("input", { className: cn("aviala-color-picker-field__input", typographyVariants({ level: "text" })), value: alphaDraft, disabled: isDisabled, "aria-label": "Opacity percent", inputMode: "numeric", onChange: (e) => setAlphaDraft(e.target.value), onBlur: commitAlpha, onKeyDown: (e) => e.key === "Enter" && commitAlpha() }), _jsx("span", { className: "aviala-color-picker-field__badge-area", children: _jsx(Badge, { children: "%" }) })] }), _jsxs(Select, { value: format, onValueChange: (next) => setFormat(next), disabled: isDisabled, children: [_jsx(SelectTrigger, { className: "aviala-color-picker-format-select w-[76px] shrink-0", size: "regular", children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { onCloseAutoFocus: (event) => event.preventDefault(), children: _jsxs(SelectItemGroup, { children: [_jsx(SelectItem, { value: "hex", itemFunction: "radio", children: "HEX" }), _jsx(SelectItem, { value: "rgb", itemFunction: "radio", children: "RGB" }), _jsx(SelectItem, { value: "hsl", itemFunction: "radio", children: "HSL" })] }) })] })] }));
}
function buildComponentDraft(value, format) {
    if (format === "rgb") {
        const { r, g, b } = toRgbComponents(value);
        return `${r}, ${g}, ${b}`;
    }
    if (format === "hsl") {
        const { h, s, l } = toHslComponents(value);
        return `${h}, ${s}, ${l}`;
    }
    return toHexInput(value);
}
