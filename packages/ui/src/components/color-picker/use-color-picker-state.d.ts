import { type ColorFormat, type HSVA } from "./color-utils";
export type ColorPickerChangeMeta = {
    source?: string;
};
export type UseColorPickerStateOptions = {
    value?: string;
    defaultValue?: string;
    onChange?: (value: string, meta?: ColorPickerChangeMeta) => void;
    format?: ColorFormat;
    defaultFormat?: ColorFormat;
    onFormatChange?: (format: ColorFormat) => void;
};
export declare function useColorPickerState({ value: controlledValue, defaultValue, onChange, format: controlledFormat, defaultFormat, onFormatChange, }: UseColorPickerStateOptions): {
    value: string;
    format: ColorFormat;
    setValue: (next: string, meta?: ColorPickerChangeMeta) => void;
    hsva: HSVA;
    setHsva: (partial: Partial<HSVA>, meta?: ColorPickerChangeMeta) => void;
    setFormat: (next: ColorFormat) => void;
};
//# sourceMappingURL=use-color-picker-state.d.ts.map