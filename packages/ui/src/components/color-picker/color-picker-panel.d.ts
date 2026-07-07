import { type UseColorPickerStateOptions } from "./use-color-picker-state";
export type ColorPickerPanelProps = UseColorPickerStateOptions & {
    className?: string;
    disabled?: boolean;
    presets?: string[];
    onPresetsChange?: (presets: string[]) => void;
    maxPresets?: number;
    showEyedropper?: boolean;
    showPresets?: boolean;
};
export declare function ColorPickerPanel({ className, disabled, presets, onPresetsChange, maxPresets, showEyedropper, showPresets, value, defaultValue, onChange, format, defaultFormat, onFormatChange, }: ColorPickerPanelProps): import("react").JSX.Element;
//# sourceMappingURL=color-picker-panel.d.ts.map