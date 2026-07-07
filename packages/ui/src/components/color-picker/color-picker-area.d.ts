import { type UseColorPickerStateOptions } from "./use-color-picker-state";
export type ColorPickerAreaProps = {
    className?: string;
    disabled?: boolean;
} & Pick<UseColorPickerStateOptions, "value" | "defaultValue" | "onChange">;
export declare function ColorPickerArea({ className, disabled, value: valueProp, defaultValue, onChange, }: ColorPickerAreaProps): import("react").JSX.Element;
//# sourceMappingURL=color-picker-area.d.ts.map