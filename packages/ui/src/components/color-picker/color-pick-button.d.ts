import { type ButtonHTMLAttributes } from "react";
export type ColorPickButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> & {
    color: string;
    selected?: boolean;
};
export declare const ColorPickButton: import("react").ForwardRefExoticComponent<Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> & {
    color: string;
    selected?: boolean;
} & import("react").RefAttributes<HTMLButtonElement>>;
//# sourceMappingURL=color-pick-button.d.ts.map