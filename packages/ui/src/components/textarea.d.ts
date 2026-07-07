import { type ReactNode, type TextareaHTMLAttributes } from "react";
/** Figma Components → Information Collect → TextareaInput */
export type TextareaSize = "regular" | "big";
export type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> & {
    /** Figma `Size` */
    size?: TextareaSize;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    /** Figma `Controller` — character counter + resize affordance */
    showController?: boolean;
    error?: boolean;
};
export declare const Textarea: import("react").ForwardRefExoticComponent<Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> & {
    /** Figma `Size` */
    size?: TextareaSize;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    /** Figma `Controller` — character counter + resize affordance */
    showController?: boolean;
    error?: boolean;
} & import("react").RefAttributes<HTMLTextAreaElement>>;
//# sourceMappingURL=textarea.d.ts.map