import { type UseColorPickerStateOptions } from "./use-color-picker-state";
declare global {
    interface Window {
        EyeDropper?: new () => {
            open: () => Promise<{
                sRGBHex: string;
            }>;
        };
    }
}
export type ColorPickerInputsProps = {
    className?: string;
    disabled?: boolean;
    showEyedropper?: boolean;
} & Pick<UseColorPickerStateOptions, "value" | "defaultValue" | "onChange" | "format" | "onFormatChange">;
export declare function ColorPickerInputs({ className, disabled, showEyedropper, value: valueProp, defaultValue, onChange, format: formatProp, onFormatChange, }: ColorPickerInputsProps): import("react").JSX.Element;
//# sourceMappingURL=color-picker-inputs.d.ts.map