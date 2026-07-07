import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useRef } from "react";
import { cn } from "../../lib/utils";
import { clamp01, pureHueHex } from "./color-utils";
import { useOptionalColorPickerContext } from "./color-picker-context";
import { usePointerDrag } from "./use-pointer-drag";
import { useColorPickerState } from "./use-color-picker-state";
export function ColorPickerArea({ className, disabled, value: valueProp, defaultValue, onChange, }) {
    const ctx = useOptionalColorPickerContext();
    const local = useColorPickerState({
        value: ctx ? undefined : valueProp,
        defaultValue: ctx?.value ?? defaultValue,
        onChange: ctx ? undefined : onChange,
    });
    const { hsva, setHsva } = ctx ?? local;
    const isDisabled = disabled ?? ctx?.disabled;
    const ref = useRef(null);
    const handleMove = useCallback((x, y) => {
        if (isDisabled)
            return;
        setHsva({
            s: clamp01(x) * 100,
            v: (1 - clamp01(y)) * 100,
        }, { source: "area" });
    }, [isDisabled, setHsva]);
    const { handlePointerDown, handlePointerMove } = usePointerDrag(ref, handleMove, !isDisabled);
    const hueColor = pureHueHex(hsva.h);
    return (_jsx("div", { className: cn("aviala-color-picker-area", className), children: _jsxs("div", { ref: ref, className: "aviala-color-picker-area__surface", style: { backgroundColor: hueColor }, onPointerDown: handlePointerDown, onPointerMove: handlePointerMove, role: "slider", "aria-label": "Saturation and brightness", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": Math.round(hsva.s), tabIndex: isDisabled ? -1 : 0, children: [_jsx("div", { className: "aviala-color-picker-area__white", "aria-hidden": true }), _jsx("div", { className: "aviala-color-picker-area__black", "aria-hidden": true }), _jsx("div", { className: "aviala-color-picker-area__thumb", style: {
                        left: `${hsva.s}%`,
                        top: `${100 - hsva.v}%`,
                    }, "aria-hidden": true })] }) }));
}
