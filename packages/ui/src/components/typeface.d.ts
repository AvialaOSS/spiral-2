import { type HTMLAttributes, type ReactNode } from "react";
import { type TypographyContent, type TypographyTone } from "./typography";
/** Figma Components → System Composition → Typeface (527:56311) */
export type TypefaceContent = "allCustom" | "textCaption" | "textCaptionSubtitle" | "textTitle" | "textHeadline2" | "textHeadline1";
export type TypefaceProps = Omit<HTMLAttributes<HTMLDivElement>, "content"> & {
    /** Figma `Content` preset */
    content?: TypefaceContent;
    /** Primary line — overrides preset first line */
    primary?: ReactNode;
    /** Secondary line — overrides preset second line */
    secondary?: ReactNode;
    /** Tertiary line — used by `textCaptionSubtitle` */
    tertiary?: ReactNode;
    /** Per-line content mode for numeric text */
    primaryContent?: TypographyContent;
    secondaryContent?: TypographyContent;
    tertiaryContent?: TypographyContent;
    tone?: TypographyTone;
};
export declare const Typeface: import("react").ForwardRefExoticComponent<Omit<HTMLAttributes<HTMLDivElement>, "content"> & {
    /** Figma `Content` preset */
    content?: TypefaceContent;
    /** Primary line — overrides preset first line */
    primary?: ReactNode;
    /** Secondary line — overrides preset second line */
    secondary?: ReactNode;
    /** Tertiary line — used by `textCaptionSubtitle` */
    tertiary?: ReactNode;
    /** Per-line content mode for numeric text */
    primaryContent?: TypographyContent;
    secondaryContent?: TypographyContent;
    tertiaryContent?: TypographyContent;
    tone?: TypographyTone;
} & import("react").RefAttributes<HTMLDivElement>>;
/** Convenience helper for two-line label + caption pairs (Radio, Checkbox, etc.) */
export type TypefacePairProps = Omit<TypefaceProps, "content"> & {
    title: ReactNode;
    description?: ReactNode;
};
export declare const TypefacePair: import("react").ForwardRefExoticComponent<Omit<TypefaceProps, "content"> & {
    title: ReactNode;
    description?: ReactNode;
} & import("react").RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=typeface.d.ts.map