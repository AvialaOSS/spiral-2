import { type VariantProps } from "class-variance-authority";
import { type HTMLAttributes } from "react";
/** Figma Components → Loading Icon */
export type LoadingLevel = "display" | "headline1" | "headline2" | "title" | "subtitle" | "text" | "caption";
export type LoadingMode = "theme" | "themeText" | "black" | "white" | "inherit";
declare const loadingVariants: (props?: ({
    level?: "display" | "headline1" | "headline2" | "title" | "subtitle" | "text" | "caption" | null | undefined;
    mode?: "theme" | "themeText" | "black" | "white" | "inherit" | null | undefined;
    lineHeightFix?: boolean | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare const BUTTON_SIZE_TO_LOADING_LEVEL: {
    readonly tiny: "caption";
    readonly small: "text";
    readonly regular: "text";
    readonly big: "text";
};
export type LoadingButtonSize = keyof typeof BUTTON_SIZE_TO_LOADING_LEVEL;
export declare function loadingLevelForButtonSize(size: LoadingButtonSize): LoadingLevel;
export type LoadingProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof loadingVariants> & {
    /** Accessible name; omit when decorative (`aria-hidden`). */
    label?: string;
};
export declare const Loading: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLSpanElement> & VariantProps<(props?: ({
    level?: "display" | "headline1" | "headline2" | "title" | "subtitle" | "text" | "caption" | null | undefined;
    mode?: "theme" | "themeText" | "black" | "white" | "inherit" | null | undefined;
    lineHeightFix?: boolean | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string> & {
    /** Accessible name; omit when decorative (`aria-hidden`). */
    label?: string;
} & import("react").RefAttributes<HTMLSpanElement>>;
export {};
//# sourceMappingURL=loading.d.ts.map