import { Loading, loadingLevelForButtonSize } from "./loading";
import { typographyVariants } from "./typography";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import type { IconLevel } from "@aviala-design/icons";
import { resolveIconSizeToken } from "@aviala-design/icons";
import { cloneAvialaIconElement } from "../lib/clone-aviala-icon";
import { resolveIconSlotSizing } from "../lib/icon-slot-sizing";
import { cn } from "../lib/utils";
import { spiralDebugId } from "../lib/spiral-debug";

/** Figma Components → Basic Input → Button */
export type ButtonMode =
  | "primary"
  | "second"
  | "default"
  | "defaultCustom"
  | "outline"
  | "outlineCustom"
  | "noBackground"
  | "noBackgroundCustom"
  | "destructive";

export type ButtonSize = "tiny" | "small" | "regular" | "big";

const sizeLabelLevels = {
  tiny: "caption" as const,
  small: "text" as const,
  regular: "text" as const,
  big: "text" as const,
} as const;

const buttonVariants = cva(
  "aviala-button aviala-focus-ring relative inline-flex shrink-0 cursor-pointer items-center justify-center overflow-hidden border-0 bg-transparent font-sans whitespace-nowrap focus-visible:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-[var(--button-disabled-opacity,0.55)]",
  {
    variants: {
      mode: {
        primary: "aviala-button--mode-primary",
        second: "aviala-button--mode-second",
        default: "aviala-button--mode-default",
        defaultCustom: "aviala-button--mode-defaultCustom",
        noBackground: "aviala-button--mode-noBackground",
        noBackgroundCustom: "aviala-button--mode-noBackgroundCustom",
        outline: "aviala-button--mode-outline",
        outlineCustom: "aviala-button--mode-outlineCustom",
        destructive: "aviala-button--mode-destructive",
      },
      allRound: {
        true: "min-w-[var(--button-min-width-allround,48px)] !rounded-[var(--border-radius-allround,99px)]",
        false: "min-w-[var(--button-min-width,46px)]",
      },
      compact: {
        true: "min-w-0",
        false: "",
      },
    },
    defaultVariants: {
      mode: "primary",
      allRound: false,
    },
  }
);

function resolveMode(
  mode?: ButtonMode | null,
  variant?: LegacyVariant | null
): ButtonMode {
  if (mode) return mode;
  switch (variant) {
    case "secondary":
      return "second";
    case "outline":
      return "outline";
    case "ghost":
      return "noBackground";
    case "destructive":
      return "destructive";
    case "link":
      return "noBackground";
    default:
      return "primary";
  }
}

function resolveSize(
  size?: ButtonSize | LegacySize | null,
  iconOnly?: boolean,
  variant?: LegacyVariant | null
): ButtonSize {
  if (size === "tiny" || size === "small" || size === "regular" || size === "big") {
    return size;
  }
  switch (size) {
    case "sm":
      return "small";
    case "lg":
      return "big";
    case "icon":
      return "regular";
    default:
      break;
  }
  if (variant === "link" || iconOnly) return "regular";
  return "regular";
}

type LegacyVariant =
  | "default"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "link";

type LegacySize = "default" | "sm" | "lg" | "icon";

function hasSurface(mode: ButtonMode): boolean {
  return (
    mode !== "noBackground" &&
    mode !== "noBackgroundCustom" &&
    mode !== "outline" &&
    mode !== "outlineCustom"
  );
}

function renderIcon(
  node: ReactNode,
  iconLevel: IconLevel,
  dimmed?: boolean,
  debugId?: string
): ReactNode {
  if (!node) return null;

  const slotSizing = resolveIconSlotSizing(node, iconLevel, true);
  const content = cloneAvialaIconElement(node, {
    level: iconLevel,
    biggerSize: true,
  });

  return (
    <span
      className={cn(
        "aviala-button__icon",
        dimmed && "opacity-[var(--button-disabled-opacity,0.55)]"
      )}
      style={
        {
          "--button-icon-size": resolveIconSizeToken(
            slotSizing.level,
            slotSizing.biggerSize
          ),
        } as CSSProperties
      }
      {...(debugId ? spiralDebugId(debugId) : undefined)}
    >
      {content}
    </span>
  );
}

function resolveIconOnlyIcon(
  leftIcon?: ReactNode,
  icon?: ReactNode,
  children?: ReactNode,
  iconOnly?: boolean
): ReactNode {
  const fromProp = leftIcon ?? icon;
  if (fromProp) return fromProp;
  if (!iconOnly || children == null || children === false) return undefined;
  if (isValidElement(children) && typeof children.type !== "string") return children;
  return undefined;
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  Omit<VariantProps<typeof buttonVariants>, "mode"> & {
    /** Figma `Mode` — preferred over legacy `variant`. */
    mode?: ButtonMode;
    /** Figma `Size` — preferred over legacy shadcn sizes. */
    size?: ButtonSize | LegacySize;
    /** Figma `All-Round` */
    allRound?: boolean;
    /** Figma `IconOnly` */
    iconOnly?: boolean;
    /** @deprecated Use `mode` instead. */
    variant?: LegacyVariant;
    loading?: boolean;
    /** @deprecated Use `leftIcon`. */
    icon?: ReactNode;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    asChild?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      mode: modeProp,
      variant,
      size: sizeProp,
      allRound = false,
      compact,
      iconOnly: iconOnlyProp,
      asChild = false,
      loading = false,
      disabled,
      icon,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const mode = resolveMode(modeProp, variant);
    const iconOnly =
      iconOnlyProp ??
      (sizeProp === "icon" ||
        ((!!(leftIcon ?? icon) ||
          (isValidElement(children) && typeof children.type !== "string")) &&
          !rightIcon &&
          (leftIcon ?? icon ? !children : true)));
    const size = resolveSize(sizeProp, iconOnly, variant);
    const isDisabled = disabled || loading;
    const showSurface = hasSurface(mode);

    const contentOpacity = loading
      ? "opacity-[var(--button-loading-opacity,0.6)]"
      : undefined;

    const resolvedLeft = iconOnly
      ? resolveIconOnlyIcon(leftIcon, icon, children, true)
      : leftIcon ?? icon;
    const label = iconOnly ? null : children;
    const iconLevel = sizeLabelLevels[size];

    const inner = (
      <>
        {showSurface && (
          <span
            aria-hidden
            className="aviala-button-surface pointer-events-none absolute inset-0 rounded-[inherit]"
            {...spiralDebugId("button.surface")}
          />
        )}
        {loading && (
          <Loading
            level={loadingLevelForButtonSize(size)}
            mode="inherit"
            lineHeightFix={false}
            className="relative z-[1] shrink-0 text-inherit"
            aria-hidden
          />
        )}
        {!iconOnly && renderIcon(resolvedLeft, iconLevel, undefined, "button.icon-left")}
        {iconOnly
          ? renderIcon(resolvedLeft, iconLevel, undefined, "button.icon-left")
          : label !== null && label !== undefined && (
              <span
                className={cn(
                  typographyVariants({ level: sizeLabelLevels[size] }),
                  "relative z-[1] shrink-0",
                  contentOpacity
                )}
                {...spiralDebugId("button.label")}
              >
                {label}
              </span>
            )}
        {!iconOnly && renderIcon(rightIcon, iconLevel, undefined, "button.icon-right")}
      </>
    );

    const classes = cn(
      buttonVariants({ mode, ...(iconOnly ? {} : { allRound }), compact }),
      iconOnly && "min-w-0",
      iconOnly && allRound && "!rounded-[var(--border-radius-allround,99px)]",
      className
    );

    if (asChild) {
      return (
        <Slot
          className={classes}
          ref={ref}
          aria-disabled={isDisabled || undefined}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        className={classes}
        ref={ref}
        data-size={size}
        data-icon-only={iconOnly || undefined}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        {...spiralDebugId("button")}
        {...props}
      >
        {inner}
      </button>
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
