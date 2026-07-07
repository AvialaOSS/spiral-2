import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
/** Figma Components → Information Collect → Radio */
export type RadioGroupDirection = "vertical" | "horizontal";
export type RadioInputVariant = "normal" | "card";
export type RadioGroupProps = ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> & {
    /** Figma Radio Input Group `Direction` */
    direction?: RadioGroupDirection;
};
export declare const RadioGroup: import("react").ForwardRefExoticComponent<Omit<RadioGroupPrimitive.RadioGroupProps & import("react").RefAttributes<HTMLDivElement>, "ref"> & {
    /** Figma Radio Input Group `Direction` */
    direction?: RadioGroupDirection;
} & import("react").RefAttributes<HTMLDivElement>>;
export type RadioGroupItemProps = ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>;
export declare const RadioGroupItem: import("react").ForwardRefExoticComponent<Omit<RadioGroupPrimitive.RadioGroupItemProps & import("react").RefAttributes<HTMLButtonElement>, "ref"> & import("react").RefAttributes<HTMLButtonElement>>;
export type RadioInputProps = Omit<RadioGroupItemProps, "children"> & {
    /** Figma Typeface primary line */
    title: ReactNode;
    /** Figma Typeface caption line */
    description?: ReactNode;
    icon?: ReactNode;
    /** Figma Radio Input `Style` */
    variant?: RadioInputVariant;
};
export declare const RadioInput: import("react").ForwardRefExoticComponent<Omit<Omit<RadioGroupPrimitive.RadioGroupItemProps & import("react").RefAttributes<HTMLButtonElement>, "ref">, "children"> & {
    /** Figma Typeface primary line */
    title: ReactNode;
    /** Figma Typeface caption line */
    description?: ReactNode;
    icon?: ReactNode;
    /** Figma Radio Input `Style` */
    variant?: RadioInputVariant;
} & import("react").RefAttributes<HTMLButtonElement>>;
//# sourceMappingURL=radio-group.d.ts.map