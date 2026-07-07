import { type AnchorHTMLAttributes, type ReactNode } from "react";
/** Figma Components → Basic Input → Link */
export type LinkLevel = "caption" | "text";
export type LinkMode = "noBackground" | "noBackgroundCustom";
export type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "disabled"> & {
    level?: LinkLevel;
    mode?: LinkMode;
    iconOnly?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    asChild?: boolean;
    disabled?: boolean;
};
export declare const Link: import("react").ForwardRefExoticComponent<Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "disabled"> & {
    level?: LinkLevel;
    mode?: LinkMode;
    iconOnly?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    asChild?: boolean;
    disabled?: boolean;
} & import("react").RefAttributes<HTMLAnchorElement>>;
//# sourceMappingURL=link.d.ts.map