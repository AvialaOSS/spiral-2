import { Slot } from "@radix-ui/react-slot";
import type { IconLevel } from "@aviala/icons";
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cloneAvialaIconElement } from "../lib/clone-aviala-icon";
import { cn } from "../lib/utils";
import { typographyVariants } from "./typography";

/** Figma Components → Basic Input → Link */
export type LinkLevel = "caption" | "text";
export type LinkMode = "noBackground" | "noBackgroundCustom";

const levelStyles = {
  caption: {
    className: typographyVariants({ level: "caption" }),
    iconBox: "h-5",
  },
  text: {
    className: typographyVariants({ level: "text" }),
    iconBox: "h-6",
  },
} as const;

function renderIcon(
  node: ReactNode,
  level: LinkLevel
): ReactNode {
  if (!node) return null;
  const { iconBox } = levelStyles[level];
  const iconLevel: IconLevel = level;
  const content = cloneAvialaIconElement(node, {
    level: iconLevel,
    biggerSize: true,
  });

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center",
        iconBox
      )}
    >
      {content}
    </span>
  );
}

export type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "disabled"> & {
  level?: LinkLevel;
  mode?: LinkMode;
  iconOnly?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  asChild?: boolean;
  disabled?: boolean;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className,
      level = "caption",
      mode = "noBackground",
      iconOnly: iconOnlyProp,
      leftIcon,
      rightIcon,
      children,
      asChild = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const iconOnly =
      iconOnlyProp ?? (!!(leftIcon ?? rightIcon) && !children);
    const resolvedLevel = level ?? "caption";
    const Comp = asChild ? Slot : "a";

    const sharedClassName = cn(
      "aviala-link",
      iconOnly ? "aviala-link--icon-only" : undefined,
      className
    );
    const disabledProps = disabled
      ? {
          tabIndex: -1 as const,
          onClick: (e: MouseEvent<HTMLAnchorElement>) => e.preventDefault(),
        }
      : {};

    if (asChild) {
      return (
        <Comp
          className={sharedClassName}
          data-mode={mode}
          data-disabled={disabled ? "true" : undefined}
          ref={ref}
          aria-disabled={disabled || undefined}
          {...disabledProps}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        className={sharedClassName}
        data-mode={mode}
        data-disabled={disabled ? "true" : undefined}
        ref={ref}
        aria-disabled={disabled || undefined}
        {...disabledProps}
        {...props}
      >
        {renderIcon(leftIcon ?? (iconOnly ? rightIcon : undefined), resolvedLevel)}
        {!iconOnly && children !== undefined && children !== null && (
          <span
            className={cn(
              "aviala-link__label relative shrink-0",
              levelStyles[resolvedLevel].className
            )}
          >
            {children}
          </span>
        )}
        {!iconOnly && renderIcon(rightIcon, resolvedLevel)}
      </Comp>
    );
  }
);
Link.displayName = "Link";
