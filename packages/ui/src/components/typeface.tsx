import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/utils";
import {
  Typography,
  type TypographyContent,
  type TypographyLevel,
  type TypographyTone,
} from "./typography";

/** Figma Components → System Composition → Typeface (527:56311) */
export type TypefaceContent =
  | "allCustom"
  | "textCaption"
  | "textCaptionSubtitle"
  | "textTitle"
  | "textHeadline2"
  | "textHeadline1";

type TypefaceLine = {
  level: TypographyLevel;
  content?: TypographyContent;
  tone?: TypographyTone;
  children: ReactNode;
};

const typefaceLayouts: Record<TypefaceContent, TypefaceLine[]> = {
  allCustom: [
    { level: "text", children: null },
    { level: "caption", children: null },
  ],
  textCaption: [
    { level: "text", children: null },
    { level: "caption", children: null },
  ],
  textCaptionSubtitle: [
    { level: "subtitle", children: null },
    { level: "text", children: null },
    { level: "caption", children: null },
  ],
  textTitle: [
    { level: "title", children: null },
    { level: "text", children: null },
  ],
  textHeadline2: [
    { level: "headline2", children: null },
    { level: "text", children: null },
  ],
  textHeadline1: [
    { level: "headline1", children: null },
    { level: "text", children: null },
  ],
};

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

export const Typeface = forwardRef<HTMLDivElement, TypefaceProps>(
  (
    {
      className,
      content = "allCustom",
      primary,
      secondary,
      tertiary,
      primaryContent = "text",
      secondaryContent = "text",
      tertiaryContent = "text",
      tone = "default",
      children,
      ...props
    },
    ref
  ) => {
    const layout = typefaceLayouts[content];
    const values = resolveTypefaceValues(
      primary,
      secondary,
      tertiary,
      children
    );

    return (
      <div
        ref={ref}
        className={cn("aviala-typeface", className)}
        data-content={content}
        {...props}
      >
        {layout.map((line, index) => {
          const value = values[index];
          if (value === undefined || value === null || value === false)
            return null;

          const lineContent =
            index === 0
              ? primaryContent
              : index === 1
                ? secondaryContent
                : tertiaryContent;

          return (
            <span
              key={`${line.level}-${index}`}
              className="aviala-typeface__line"
            >
              <Typography level={line.level} content={lineContent} tone={tone}>
                {value}
              </Typography>
            </span>
          );
        })}
      </div>
    );
  }
);
Typeface.displayName = "Typeface";

function resolveTypefaceValues(
  primary?: ReactNode,
  secondary?: ReactNode,
  tertiary?: ReactNode,
  children?: ReactNode
): ReactNode[] {
  if (
    primary !== undefined ||
    secondary !== undefined ||
    tertiary !== undefined
  ) {
    return [primary, secondary, tertiary];
  }

  if (children == null || children === false) {
    return [];
  }

  if (Array.isArray(children)) {
    return children;
  }

  return [children];
}

/** Convenience helper for two-line label + caption pairs (Radio, Checkbox, etc.) */
export type TypefacePairProps = Omit<TypefaceProps, "content"> & {
  title: ReactNode;
  description?: ReactNode;
};

export const TypefacePair = forwardRef<HTMLDivElement, TypefacePairProps>(
  ({ title, description, ...props }, ref) => (
    <Typeface
      ref={ref}
      content="textCaption"
      primary={title}
      secondary={description}
      {...props}
    />
  )
);
TypefacePair.displayName = "TypefacePair";
