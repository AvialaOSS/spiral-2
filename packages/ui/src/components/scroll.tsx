import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/utils";

/** Figma Components → System Composition → Scroll (301:6312) */
export type ScrollSize = "default" | "small";
export type ScrollOrientation = "vertical" | "horizontal";

const scrollVariants = cva("aviala-scroll", {
  variants: {
    size: {
      default: "",
      small: "aviala-scroll--size-small",
    },
    orientation: {
      vertical: "aviala-scroll--orientation-vertical",
      horizontal: "aviala-scroll--orientation-horizontal",
    },
  },
  defaultVariants: {
    size: "default",
    orientation: "vertical",
  },
});

export type ScrollProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof scrollVariants> & {
    children?: ReactNode;
  };

/**
 * Scrollable region with Aviala-styled scrollbar (track + thumb).
 * Figma documents the thumb/track chrome; this wraps content with that chrome.
 */
export const Scroll = forwardRef<HTMLDivElement, ScrollProps>(
  (
    {
      className,
      size = "default",
      orientation = "vertical",
      children,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        scrollVariants({
          size: size ?? "default",
          orientation: orientation ?? "vertical",
        }),
        className
      )}
      data-size={size ?? "default"}
      data-orientation={orientation ?? "vertical"}
      {...props}
    >
      {children}
    </div>
  )
);
Scroll.displayName = "Scroll";
