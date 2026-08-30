import { cva, type VariantProps } from "class-variance-authority";
import {
  cloneElement,
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";
import { Typography, type TypographyLevel } from "./typography";

/** Figma Components → Information Display → Avata (305:7013) */
export type AvatarLevel =
  | "display"
  | "headline1"
  | "headline2"
  | "title"
  | "subtitle"
  | "text";

export type AvatarContent = "text" | "picture" | "icon";

const avatarVariants = cva("aviala-avatar", {
  variants: {
    level: {
      display: "aviala-avatar--level-display",
      headline1: "aviala-avatar--level-headline1",
      headline2: "aviala-avatar--level-headline2",
      title: "aviala-avatar--level-title",
      subtitle: "aviala-avatar--level-subtitle",
      text: "aviala-avatar--level-text",
    },
    content: {
      text: "",
      picture: "",
      icon: "",
    },
    lineHeightFix: {
      true: "aviala-avatar--line-height-fix",
      false: "",
    },
  },
  defaultVariants: {
    level: "text",
    content: "text",
    lineHeightFix: true,
  },
});

const AVATAR_TEXT_LEVEL: Record<AvatarLevel, TypographyLevel> = {
  display: "subtitle",
  headline1: "text",
  headline2: "caption",
  title: "caption",
  subtitle: "caption",
  text: "caption",
};

/** Inner icon sizes aligned to --size-* (rem) so they track root font-size. */
const AVATAR_ICON_SIZE: Record<AvatarLevel, string> = {
  display: "var(--size-middle, 1rem)",
  headline1: "var(--size-regular, 0.875rem)",
  headline2: "var(--size-small, 0.75rem)",
  title: "var(--size-small, 0.75rem)",
  subtitle: "var(--size-tiny, 0.625rem)",
  text: "0.5rem",
};

function renderAvatarIcon(node: ReactNode, level: AvatarLevel): ReactNode {
  if (!node) return null;
  const size = AVATAR_ICON_SIZE[level];
  if (isValidElement(node) && typeof node.type !== "string") {
    return cloneElement(
      node as ReactElement<{ width?: number | string; height?: number | string; className?: string }>,
      {
        width: size,
        height: size,
        className: cn((node as ReactElement<{ className?: string }>).props.className, "shrink-0"),
      }
    );
  }
  return node;
}

export type AvatarProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof avatarVariants> & {
    /** Initials / text content when `content="text"` */
    children?: ReactNode;
    /** Image URL when `content="picture"` */
    src?: string;
    alt?: string;
    /** Icon node when `content="icon"` */
    icon?: ReactNode;
    imgProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">;
  };

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  (
    {
      className,
      level = "text",
      content = "text",
      lineHeightFix = true,
      children,
      src,
      alt = "",
      icon,
      imgProps,
      ...props
    },
    ref
  ) => {
    const resolvedLevel = level ?? "text";
    const resolvedContent = content ?? "text";

    return (
      <span
        ref={ref}
        className={cn(
          avatarVariants({
            level: resolvedLevel,
            content: resolvedContent,
            lineHeightFix: lineHeightFix ?? true,
          }),
          className
        )}
        data-level={resolvedLevel}
        data-content={resolvedContent}
        data-line-height-fix={lineHeightFix ? "true" : "false"}
        {...props}
      >
        <span className="aviala-avatar__surface">
          {resolvedContent === "picture" && src ? (
            <img
              className="aviala-avatar__image"
              src={src}
              alt={alt}
              {...imgProps}
            />
          ) : null}
          {resolvedContent === "icon" ? (
            <span className="aviala-avatar__icon" aria-hidden>
              {renderAvatarIcon(icon, resolvedLevel)}
            </span>
          ) : null}
          {resolvedContent === "text" ? (
            <Typography
              level={AVATAR_TEXT_LEVEL[resolvedLevel]}
              as="span"
              className="aviala-avatar__text"
            >
              {children}
            </Typography>
          ) : null}
        </span>
      </span>
    );
  }
);
Avatar.displayName = "Avatar";
