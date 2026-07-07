import { type UseColorPickerStateOptions } from "./use-color-picker-state";
export type ColorPickerSliderKind = "hue" | "alpha";
export type ColorPickerSliderProps = {
    kind: ColorPickerSliderKind;
    className?: string;
    disabled?: boolean;
} & Pick<UseColorPickerStateOptions, "value" | "defaultValue" | "onChange">;
export declare function ColorPickerSlider({ kind, className, disabled, value: valueProp, defaultValue, onChange, }: ColorPickerSliderProps): import("react").JSX.Element;
//# sourceMappingURL=color-picker-slider.d.ts.map