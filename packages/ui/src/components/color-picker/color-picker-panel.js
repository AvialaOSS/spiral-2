import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../lib/utils";
import { ColorPickerArea } from "./color-picker-area";
import { ColorPickerInputs } from "./color-picker-inputs";
import { ColorPickerPresets } from "./color-picker-presets";
import { ColorPickerSlider } from "./color-picker-slider";
import { ColorPickerContext } from "./color-picker-context";
import { useColorPickerState } from "./use-color-picker-state";
export function ColorPickerPanel({ className, disabled, presets, onPresetsChange, maxPresets = 8, showEyedropper = true, showPresets = true, value, defaultValue, onChange, format, defaultFormat, onFormatChange, }) {
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
        open: true,
        disabled,
        presets,
        onPresetsChange,
        maxPresets,
    };
    return (_jsx(ColorPickerContext.Provider, { value: contextValue, children: _jsxs("div", { className: cn("aviala-color-picker-panel", className), children: [_jsx(ColorPickerArea, { disabled: disabled }), _jsx(ColorPickerSlider, { kind: "hue", disabled: disabled }), _jsx(ColorPickerSlider, { kind: "alpha", disabled: disabled }), _jsx(ColorPickerInputs, { disabled: disabled, showEyedropper: showEyedropper }), showPresets ? (_jsx(ColorPickerPresets, { disabled: disabled, presets: presets, onPresetsChange: onPresetsChange, maxPresets: maxPresets })) : null] }) }));
}
