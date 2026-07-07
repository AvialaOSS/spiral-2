import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
/** Figma Components → Information Collect → Checkbox */
export type CheckboxGroupDirection = "vertical" | "horizontal";
export type CheckboxProps = ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    /** Figma Checkbox `Round` */
    round?: boolean;
};
export declare const Checkbox: import("react").ForwardRefExoticComponent<Omit<CheckboxPrimitive.CheckboxProps & import("react").RefAttributes<HTMLButtonElement>, "ref"> & {
    /** Figma Checkbox `Round` */
    round?: boolean;
} & import("react").RefAttributes<HTMLButtonElement>>;
export type CheckboxGroupProps = ComponentPropsWithoutRef<"div"> & {
    /** Figma Checkbox Input Group `Direction` */
    direction?: CheckboxGroupDirection;
};
export declare const CheckboxGroup: import("react").ForwardRefExoticComponent<Omit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & {
    /** Figma Checkbox Input Group `Direction` */
    direction?: CheckboxGroupDirection;
} & import("react").RefAttributes<HTMLDivElement>>;
export type CheckboxInputProps = Omit<CheckboxProps, "children"> & {
    /** Figma Typeface primary line */
    title: ReactNode;
    /** Figma Typeface caption line */
    description?: ReactNode;
    icon?: ReactNode;
};
export declare const CheckboxInput: import("react").ForwardRefExoticComponent<Omit<CheckboxProps, "children"> & {
    /** Figma Typeface primary line */
    title: ReactNode;
    /** Figma Typeface caption line */
    description?: ReactNode;
    icon?: ReactNode;
} & import("react").RefAttributes<HTMLButtonElement>>;
//# sourceMappingURL=checkbox.d.ts.map