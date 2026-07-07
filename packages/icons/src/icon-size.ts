import type { SVGProps } from "react";
import type { AvialaIconProps, IconLevel } from "./types";

/** Semantic CSS vars from @aviala/tokens components.css — level × BiggerSize */
const ICON_LEVEL_SIZE: Record<IconLevel, { default: string; bigger: string }> = {
  display: {
    default: "var(--icon-size-display, var(--size-max, 38px))",
    bigger: "var(--icon-size-display-bigger, var(--size-max, 38px))",
  },
  headline1: {
    default: "var(--icon-size-headline1, var(--size-huge, 30px))",
    bigger: "var(--icon-size-headline1-bigger, var(--size-huger, 34px))",
  },
  headline2: {
    default: "var(--icon-size-headline2, var(--size-large, 26px))",
    bigger: "var(--icon-size-headline2-bigger, var(--size-huge, 30px))",
  },
  title: {
    default: "var(--icon-size-title, var(--size-semilarge, 22px))",
    bigger: "var(--icon-size-title-bigger, var(--size-semilarger, 24px))",
  },
  subtitle: {
    default: "var(--icon-size-subtitle, var(--size-middle, 16px))",
    bigger: "var(--icon-size-subtitle-bigger, var(--size-big, 20px))",
  },
  text: {
    default: "var(--icon-size-text, var(--size-regular, 14px))",
    bigger: "var(--icon-size-text-bigger, var(--size-middle, 16px))",
  },
  caption: {
    default: "var(--icon-size-caption, var(--size-small, 12px))",
    bigger: "var(--icon-size-caption-bigger, var(--size-regular, 14px))",
  },
};

export function resolveIconSizeToken(level: IconLevel, biggerSize = false): string {
  return biggerSize ? ICON_LEVEL_SIZE[level].bigger : ICON_LEVEL_SIZE[level].default;
}

type IconSizingProps = AvialaIconProps & {
  /** Icon wrapper convenience prop — maps to width/height when both omitted */
  size?: number | string;
};

export function applyAvialaIconProps({
  biggerSize,
  level,
  size,
  width,
  height,
  thickness: _thickness,
  mode: _mode,
  ...rest
}: IconSizingProps): SVGProps<SVGSVGElement> {
  let resolvedWidth = width;
  let resolvedHeight = height;

  if (resolvedWidth === undefined && resolvedHeight === undefined) {
    if (size !== undefined) {
      resolvedWidth = size;
      resolvedHeight = size;
    } else if (level) {
      const token = resolveIconSizeToken(level, biggerSize ?? false);
      resolvedWidth = token;
      resolvedHeight = token;
    }
  }

  return {
    ...rest,
    ...(resolvedWidth !== undefined ? { width: resolvedWidth } : {}),
    ...(resolvedHeight !== undefined ? { height: resolvedHeight } : {}),
  };
}
