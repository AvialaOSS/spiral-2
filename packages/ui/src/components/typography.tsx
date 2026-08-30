import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { createElement, forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/utils";

/** Figma Components → System Composition → Typography (128:85) */
export type TypographyLevel =
  | "display"
  | "headline1"
  | "headline2"
  | "title"
  | "subtitle"
  | "text"
  | "caption";

export type TypographyContent = "text" | "number";
export type TypographyTone = "default" | "white";

export const typographyVariants = cva("aviala-typography", {
  variants: {
    level: {
      display: "aviala-typography--display",
      headline1: "aviala-typography--headline1",
      headline2: "aviala-typography--headline2",
      title: "aviala-typography--title",
      subtitle: "aviala-typography--subtitle",
      text: "aviala-typography--text",
      caption: "aviala-typography--caption",
    },
  },
  defaultVariants: {
    level: "text",
  },
});

export type TypographyProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof typographyVariants> & {
    /** Figma `Content` — text vs numeric styling */
    content?: TypographyContent;
    /** Figma `White` — light text on dark surfaces */
    tone?: TypographyTone;
    asChild?: boolean;
    as?:
      "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "label";
  };

export const Typography = forwardRef<HTMLSpanElement, TypographyProps>(
  (
    {
      className,
      level = "text",
      content = "text",
      tone = "default",
      as: Tag = "span",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const hostProps = {
      ...props,
      ref,
      className: cn(typographyVariants({ level }), className),
      "data-content": content,
      "data-tone": tone === "white" ? "white" : undefined,
    };

    if (asChild) return <Slot {...hostProps} />;

    // JSX resolves a union `as` tag to the intersection of every member's props,
    // which no single element ref can satisfy. createElement keeps the ref typed
    // as HTMLElement.
    return createElement(Tag, hostProps);
  }
);
Typography.displayName = "Typography";
