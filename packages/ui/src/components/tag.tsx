import { resolveIconSizeToken, SymbolWrong } from "@aviala-design/icons";
import { cva, type VariantProps } from "class-variance-authority";
import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";
import { useLocaleMessages } from "../locale";
import { Avatar } from "./avatar";
import { Typography, type TypographyLevel } from "./typography";

/** Figma Components → Information Display → Tag (617:55892) */
export type TagLevel = "caption" | "text";
export type TagContent = "text" | "people";
export type TagLineHeightFix = "text" | "subtitle" | "off";

const tagVariants = cva("aviala-tag", {
  variants: {
    level: {
      caption: "aviala-tag--level-caption",
      text: "aviala-tag--level-text",
    },
    content: {
      text: "aviala-tag--content-text",
      people: "aviala-tag--content-people",
    },
    lineHeightFix: {
      text: "aviala-tag--lhf-text",
      subtitle: "aviala-tag--lhf-subtitle",
      off: "aviala-tag--lhf-off",
    },
  },
  defaultVariants: {
    level: "caption",
    content: "text",
    lineHeightFix: "text",
  },
});

function resolveLineHeightFix(
  level: TagLevel,
  lineHeightFix: boolean | TagLineHeightFix | undefined
): TagLineHeightFix {
  if (lineHeightFix === false || lineHeightFix === "off") return "off";
  if (lineHeightFix === "subtitle") return "subtitle";
  if (lineHeightFix === "text" || lineHeightFix === true) {
    return level === "text" ? "subtitle" : "text";
  }
  return level === "text" ? "subtitle" : "text";
}

function iconSizeForLevel(level: TagLevel): string {
  /* Caption tags use text-level glyphs; text tags use the bigger text slot. */
  return level === "caption"
    ? resolveIconSizeToken("text")
    : resolveIconSizeToken("text", true);
}

function renderTagIcon(node: ReactNode, level: TagLevel): ReactNode {
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
    <span className="aviala-tag__icon" aria-hidden>
      {content}
    </span>
  );
}

export type TagProps = HTMLAttributes<HTMLSpanElement> &
  Omit<VariantProps<typeof tagVariants>, "lineHeightFix"> & {
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    children: ReactNode;
    disabled?: boolean;
    /** People content — avatar image or initials */
    avatar?: ReactNode;
    avatarSrc?: string;
    avatarText?: ReactNode;
    closable?: boolean;
    onClose?: (event: MouseEvent<HTMLButtonElement>) => void;
    closeLabel?: string;
    lineHeightFix?: boolean | TagLineHeightFix;
  };

export type TagCloseProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const TagClose = forwardRef<HTMLButtonElement, TagCloseProps>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn("aviala-tag__close aviala-focus-ring", className)}
      {...props}
    >
      {children ?? <SymbolWrong aria-hidden width={14} height={14} />}
    </button>
  )
);
TagClose.displayName = "TagClose";

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      className,
      children,
      leftIcon,
      rightIcon,
      level = "caption",
      content = "text",
      disabled = false,
      avatar,
      avatarSrc,
      avatarText,
      closable = false,
      onClose,
      closeLabel,
      lineHeightFix,
      ...props
    },
    ref
  ) => {
    const locale = useLocaleMessages("Tag");
    const resolvedCloseLabel = closeLabel ?? locale.remove;
    const resolvedLevel = level ?? "caption";
    const resolvedContent = content ?? "text";
    const resolvedLhf = resolveLineHeightFix(resolvedLevel, lineHeightFix);
    const typographyLevel: TypographyLevel = resolvedLevel;

    const peopleAvatar =
      avatar ??
      (avatarSrc ? (
        <Avatar
          level="text"
          content="picture"
          src={avatarSrc}
          lineHeightFix={false}
        />
      ) : (
        <Avatar level="text" content="text" lineHeightFix={false}>
          {avatarText ??
            (typeof children === "string" ? children.charAt(0) : "?")}
        </Avatar>
      ));

    return (
      <span
        ref={ref}
        className={cn(
          tagVariants({
            level: resolvedLevel,
            content: resolvedContent,
            lineHeightFix: resolvedLhf,
          }),
          className
        )}
        data-level={resolvedLevel}
        data-content={resolvedContent}
        data-disabled={disabled ? "true" : undefined}
        data-line-height-fix={resolvedLhf}
        aria-disabled={disabled || undefined}
        {...props}
      >
        {resolvedContent === "people" ? (
          <span className="aviala-tag__avatar">{peopleAvatar}</span>
        ) : (
          renderTagIcon(leftIcon, resolvedLevel)
        )}
        <Typography
          level={typographyLevel}
          as="span"
          className="aviala-tag__text whitespace-nowrap"
        >
          {children}
        </Typography>
        {resolvedContent === "text"
          ? renderTagIcon(rightIcon, resolvedLevel)
          : null}
        {closable ? (
          <TagClose
            aria-label={resolvedCloseLabel}
            disabled={disabled}
            onClick={(event) => {
              if (disabled) return;
              onClose?.(event);
            }}
          />
        ) : null}
      </span>
    );
  }
);
Tag.displayName = "Tag";
