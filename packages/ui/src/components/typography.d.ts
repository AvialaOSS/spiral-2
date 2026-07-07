import { type VariantProps } from "class-variance-authority";
import { type HTMLAttributes } from "react";
/** Figma Components → System Composition → Typography (128:85) */
export type TypographyLevel = "display" | "headline1" | "headline2" | "title" | "subtitle" | "text" | "caption";
export type TypographyContent = "text" | "number";
export type TypographyTone = "default" | "white";
export declare const typographyVariants: (props?: ({
    level?: "display" | "headline1" | "headline2" | "title" | "subtitle" | "text" | "caption" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type TypographyProps = HTMLAttributes<HTMLElement> & VariantProps<typeof typographyVariants> & {
    /** Figma `Content` — text vs numeric styling */
    content?: TypographyContent;
    /** Figma `White` — light text on dark surfaces */
    tone?: TypographyTone;
    asChild?: boolean;
    as?: "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "label";
};
export declare const Typography: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLElement> & VariantProps<(props?: ({
    level?: "display" | "headline1" | "headline2" | "title" | "subtitle" | "text" | "caption" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string> & {
    /** Figma `Content` — text vs numeric styling */
    content?: TypographyContent;
    /** Figma `White` — light text on dark surfaces */
    tone?: TypographyTone;
    asChild?: boolean;
    as?: "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "label";
} & import("react").RefAttributes<HTMLSpanElement>>;
//# sourceMappingURL=typography.d.ts.map