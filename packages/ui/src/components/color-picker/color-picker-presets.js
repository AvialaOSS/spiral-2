import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SymbolAdd } from "@aviala-design/icons";
import { Button } from "../button";
import { cn } from "../../lib/utils";
import { parseColor } from "./color-utils";
import { ColorPickButton } from "./color-pick-button";
import { useOptionalColorPickerContext } from "./color-picker-context";
export function ColorPickerPresets({ className, presets: presetsProp, onPresetsChange: onPresetsChangeProp, maxPresets: maxPresetsProp, disabled, }) {
    const ctx = useOptionalColorPickerContext();
    const presets = presetsProp ?? ctx?.presets ?? [];
    const onPresetsChange = onPresetsChangeProp ?? ctx?.onPresetsChange;
    const maxPresets = maxPresetsProp ?? ctx?.maxPresets ?? 8;
    const isDisabled = disabled ?? ctx?.disabled;
    const value = ctx?.value;
    const setValue = ctx?.setValue;
    const handleAdd = () => {
        if (!onPresetsChange || !value || isDisabled)
            return;
        const normalized = parseColor(value).toHex();
        if (presets.includes(normalized))
            return;
        const next = [...presets, normalized].slice(-maxPresets);
        onPresetsChange(next);
    };
    return (_jsxs("div", { className: cn("aviala-color-picker-presets", className), children: [_jsx(Button, { type: "button", mode: "defaultCustom", size: "regular", iconOnly: true, disabled: isDisabled || !onPresetsChange || presets.length >= maxPresets, "aria-label": "Add current color to presets", onClick: handleAdd, children: _jsx(SymbolAdd, { "aria-hidden": true }) }), presets.map((color) => (_jsx(ColorPickButton, { color: color, selected: value === color, disabled: isDisabled, onClick: () => setValue?.(color, { source: "preset" }) }, color)))] }));
}
