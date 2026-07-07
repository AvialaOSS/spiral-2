import type { ColorFormat, HSVA } from "./color-utils";
import type { ColorPickerChangeMeta } from "./use-color-picker-state";
export type ColorPickerContextValue = {
    value: string;
    setValue: (value: string, meta?: ColorPickerChangeMeta) => void;
    format: ColorFormat;
    setFormat: (format: ColorFormat) => void;
    hsva: HSVA;
    setHsva: (partial: Partial<HSVA>, meta?: ColorPickerChangeMeta) => void;
    open: boolean;
    disabled?: boolean;
    presets?: string[];
    onPresetsChange?: (presets: string[]) => void;
    maxPresets: number;
};
export declare const ColorPickerContext: import("react").Context<ColorPickerContextValue | null>;
export declare function useColorPickerContext(): ColorPickerContextValue;
export declare function useOptionalColorPickerContext(): ColorPickerContextValue | null;
//# sourceMappingURL=color-picker-context.d.ts.map