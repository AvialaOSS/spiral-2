import { type HTMLAttributes, type ReactNode } from "react";
/** Figma Components → Information Display → Badge (also used in BaseInput badge area) */
export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    children: ReactNode;
};
export declare const Badge: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLSpanElement> & {
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    children: ReactNode;
} & import("react").RefAttributes<HTMLSpanElement>>;
//# sourceMappingURL=badge.d.ts.map