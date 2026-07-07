import { type VariantProps } from "class-variance-authority";
import { type InputHTMLAttributes, type ReactNode } from "react";
/** Figma Components → Information Collect → BaseInput */
export type InputSize = "regular" | "big";
export type InputState = "empty" | "fill" | "typing";
declare const inputRootVariants: (props?: ({
    size?: "big" | "regular" | null | undefined;
    allRound?: boolean | null | undefined;
    fullWidth?: boolean | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & VariantProps<typeof inputRootVariants> & {
    /** Figma `Size` */
    size?: InputSize;
    /** Figma `All-Round` */
    allRound?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    /** Figma badge area — left slot inside BaseInput */
    leftBadge?: ReactNode;
    /** Figma badge area — right slot inside BaseInput */
    rightBadge?: ReactNode;
    /** When false, input sizes to content (e.g. ColorPicker panel row) */
    fullWidth?: boolean;
    error?: boolean;
};
export declare const Input: import("react").ForwardRefExoticComponent<Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & VariantProps<(props?: ({
    size?: "big" | "regular" | null | undefined;
    allRound?: boolean | null | undefined;
    fullWidth?: boolean | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string> & {
    /** Figma `Size` */
    size?: InputSize;
    /** Figma `All-Round` */
    allRound?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    /** Figma badge area — left slot inside BaseInput */
    leftBadge?: ReactNode;
    /** Figma badge area — right slot inside BaseInput */
    rightBadge?: ReactNode;
    /** When false, input sizes to content (e.g. ColorPicker panel row) */
    fullWidth?: boolean;
    error?: boolean;
} & import("react").RefAttributes<HTMLInputElement>>;
export { inputRootVariants };
//# sourceMappingURL=input.d.ts.map