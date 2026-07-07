import * as PopoverPrimitive from "@radix-ui/react-popover";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { type UseColorPickerStateOptions } from "./use-color-picker-state";
import type { ColorFormat } from "./color-utils";
export type ColorPickerProps = UseColorPickerStateOptions & {
    children: ReactNode;
    className?: string;
    disabled?: boolean;
    presets?: string[];
    onPresetsChange?: (presets: string[]) => void;
    maxPresets?: number;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
};
export declare function ColorPicker({ children, className, disabled, presets, onPresetsChange, maxPresets, value, defaultValue, onChange, format, defaultFormat, onFormatChange, open: controlledOpen, defaultOpen, onOpenChange, }: ColorPickerProps): import("react").JSX.Element;
export type ColorPickerTriggerProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger> & {
    size?: "regular" | "big";
    allRound?: boolean;
    placeholder?: string;
    className?: string;
};
export declare const ColorPickerTrigger: import("react").ForwardRefExoticComponent<Omit<PopoverPrimitive.PopoverTriggerProps & import("react").RefAttributes<HTMLButtonElement>, "ref"> & {
    size?: "regular" | "big";
    allRound?: boolean;
    placeholder?: string;
    className?: string;
} & import("react").RefAttributes<HTMLButtonElement>>;
export type ColorPickerContentProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    showEyedropper?: boolean;
    showPresets?: boolean;
};
export declare const ColorPickerContent: import("react").ForwardRefExoticComponent<Omit<PopoverPrimitive.PopoverContentProps & import("react").RefAttributes<HTMLDivElement>, "ref"> & {
    showEyedropper?: boolean;
    showPresets?: boolean;
} & import("react").RefAttributes<HTMLDivElement>>;
export type { ColorFormat };
//# sourceMappingURL=color-picker.d.ts.map