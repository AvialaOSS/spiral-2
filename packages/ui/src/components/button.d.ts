import { type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes, type ReactNode } from "react";
/** Figma Components → Basic Input → Button */
export type ButtonMode = "primary" | "second" | "default" | "defaultCustom" | "noBackground" | "noBackgroundCustom" | "destructive";
export type ButtonSize = "tiny" | "small" | "regular" | "big";
declare const buttonVariants: (props?: ({
    mode?: "primary" | "destructive" | "default" | "second" | "defaultCustom" | "noBackground" | "noBackgroundCustom" | null | undefined;
    size?: "big" | "small" | "tiny" | "regular" | null | undefined;
    allRound?: boolean | null | undefined;
    iconOnly?: boolean | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
type LegacyVariant = "default" | "secondary" | "outline" | "ghost" | "destructive" | "link";
type LegacySize = "default" | "sm" | "lg" | "icon";
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & Omit<VariantProps<typeof buttonVariants>, "mode" | "size"> & {
    /** Figma `Mode` — preferred over legacy `variant`. */
    mode?: ButtonMode;
    /** Figma `Size` — preferred over legacy shadcn sizes. */
    size?: ButtonSize | LegacySize;
    /** Figma `All-Round` */
    allRound?: boolean;
    /** Figma `IconOnly` */
    iconOnly?: boolean;
    /** @deprecated Use `mode` instead. */
    variant?: LegacyVariant;
    loading?: boolean;
    /** @deprecated Use `leftIcon`. */
    icon?: ReactNode;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    asChild?: boolean;
};
export declare const Button: import("react").ForwardRefExoticComponent<ButtonHTMLAttributes<HTMLButtonElement> & Omit<VariantProps<(props?: ({
    mode?: "primary" | "destructive" | "default" | "second" | "defaultCustom" | "noBackground" | "noBackgroundCustom" | null | undefined;
    size?: "big" | "small" | "tiny" | "regular" | null | undefined;
    allRound?: boolean | null | undefined;
    iconOnly?: boolean | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string>, "mode" | "size"> & {
    /** Figma `Mode` — preferred over legacy `variant`. */
    mode?: ButtonMode;
    /** Figma `Size` — preferred over legacy shadcn sizes. */
    size?: ButtonSize | LegacySize;
    /** Figma `All-Round` */
    allRound?: boolean;
    /** Figma `IconOnly` */
    iconOnly?: boolean;
    /** @deprecated Use `mode` instead. */
    variant?: LegacyVariant;
    loading?: boolean;
    /** @deprecated Use `leftIcon`. */
    icon?: ReactNode;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    asChild?: boolean;
} & import("react").RefAttributes<HTMLButtonElement>>;
export { buttonVariants };
//# sourceMappingURL=button.d.ts.map