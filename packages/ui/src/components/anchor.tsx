import { Slot } from "@radix-ui/react-slot";
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";
import { Typography } from "./typography";

/** Figma Components → System Composition → Anchor */
export type AnchorIndentLevel = 0 | 1 | 2 | 3;

export type AnchorProps = HTMLAttributes<HTMLElement> & {
  as?: "nav" | "div";
};

export const Anchor = forwardRef<HTMLElement, AnchorProps>(
  ({ className, as: Tag = "nav", ...props }, ref) => (
    <Tag
      ref={ref as never}
      className={cn("aviala-anchor", className)}
      {...props}
    />
  )
);
Anchor.displayName = "Anchor";

export type AnchorItemProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "children"
> & {
  activated?: boolean;
  indentLevel?: AnchorIndentLevel;
  asChild?: boolean;
  children: ReactNode;
};

export const AnchorItem = forwardRef<HTMLAnchorElement, AnchorItemProps>(
  (
    {
      className,
      activated = false,
      indentLevel = 0,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "a";

    return (
      <Comp
        ref={ref}
        className={cn("aviala-anchor-item aviala-focus-ring", className)}
        data-activated={activated ? "true" : "false"}
        data-indent={String(indentLevel)}
        {...props}
      >
        <span className="aviala-anchor-item__rail" aria-hidden />
        <span className="aviala-anchor-item__content">
          <Typography
            level="text"
            as="span"
            className="aviala-anchor-item__label"
          >
            {children}
          </Typography>
        </span>
      </Comp>
    );
  }
);
AnchorItem.displayName = "AnchorItem";
