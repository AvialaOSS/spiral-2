import { cva, type VariantProps } from "class-variance-authority";
import {
  cloneElement,
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { resolveIconSizeToken } from "@aviala-design/icons";
import { cn } from "../lib/utils";
import { Typography, type TypographyLevel } from "./typography";

/** Figma Components → Information Display → Badge (166:137) */
export type BadgeStyle = "theme" | "info" | "fail" | "warning" | "success" | "normal";
export type BadgeLevel = "caption" | "text";
export type BadgeLineHeightFix = "text" | "subtitle" | "off";

const badgeVariants = cva("aviala-badge", {
  variants: {
    style: {
      theme: "aviala-badge--style-theme",
      info: "aviala-badge--style-info",
      fail: "aviala-badge--style-fail",
      warning: "aviala-badge--style-warning",
      success: "aviala-badge--style-success",
      normal: "aviala-badge--style-normal",
    },
    level: {
      caption: "aviala-badge--level-caption",
      text: "aviala-badge--level-text",
    },
    primary: {
      true: "aviala-badge--primary",
      false: "aviala-badge--secondary",
    },
    lineHeightFix: {
      text: "aviala-badge--lhf-text",
      subtitle: "aviala-badge--lhf-subtitle",
      off: "aviala-badge--lhf-off",
    },
  },
  defaultVariants: {
    style: "theme",
    level: "caption",
    primary: false,
    lineHeightFix: "text",
  },
});

function resolveLineHeightFix(
  level: BadgeLevel,
  lineHeightFix: boolean | BadgeLineHeightFix | undefined
): BadgeLineHeightFix {
  if (lineHeightFix === false || lineHeightFix === "off") return "off";
  if (lineHeightFix === "subtitle") return "subtitle";
  return level === "text" ? "subtitle" : "text";
}

function iconSizeForLevel(level: BadgeLevel): string {
  return resolveIconSizeToken(level);
}

function renderBadgeIcon(node: ReactNode, level: BadgeLevel): ReactNode {
  if (!node) return null;
  const size = iconSizeForLevel(level);
  const content =
    isValidElement(node) && typeof node.type !== "string"
      ? cloneElement(
          node as ReactElement<{
            width?: number | string;
            height?: number | string;
            className?: string;
          }>,
          {
            width: size,
            height: size,
            className: cn(
              (node as ReactElement<{ className?: string }>).props.className,
              "shrink-0"
            ),
          }
        )
      : node;

  return (
    <span className="aviala-badge__icon" aria-hidden>
      {content}
    </span>
  );
}

export type BadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, "style"> &
  Omit<VariantProps<typeof badgeVariants>, "lineHeightFix" | "primary"> & {
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    children: ReactNode;
    /** Figma `Primary` — filled primary surface vs secondary surface */
    primary?: boolean;
    /**
     * Figma `LineHeightFix`.
     * - `true` / omitted: Caption → AlignToTextLevel, Text → AlignToSubtitleLevel
     * - `false` / `"off"`: OFF
     */
    lineHeightFix?: boolean | BadgeLineHeightFix;
  };

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      children,
      leftIcon,
      rightIcon,
      style = "theme",
      level = "caption",
      primary = false,
      lineHeightFix,
      ...props
    },
    ref
  ) => {
    const resolvedLevel = level ?? "caption";
    const resolvedStyle = style ?? "theme";
    const resolvedLhf = resolveLineHeightFix(resolvedLevel, lineHeightFix);
    const typographyLevel: TypographyLevel = resolvedLevel;
    const tone = primary ? ("white" as const) : ("default" as const);

    return (
      <span
        ref={ref}
        className={cn(
          badgeVariants({
            style: resolvedStyle,
            level: resolvedLevel,
            primary,
            lineHeightFix: resolvedLhf,
          }),
          className
        )}
        data-style={resolvedStyle}
        data-level={resolvedLevel}
        data-primary={primary ? "true" : "false"}
        data-line-height-fix={resolvedLhf}
        {...props}
      >
        {renderBadgeIcon(leftIcon, resolvedLevel)}
        <Typography
          level={typographyLevel}
          tone={tone}
          as="span"
          className="aviala-badge__text whitespace-nowrap"
        >
          {children}
        </Typography>
        {renderBadgeIcon(rightIcon, resolvedLevel)}
      </span>
    );
  }
);
Badge.displayName = "Badge";
