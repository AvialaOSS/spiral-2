import type { CSSProperties, SVGProps } from "react";
import type { AvialaIconProps, IconLevel } from "./types";

/** Semantic CSS vars from @aviala-design/tokens components.css � level � BiggerSize */
const ICON_LEVEL_SIZE: Record<IconLevel, { default: string; bigger: string }> = {
  display: {
    default: "var(--icon-size-display, var(--size-max, 2.375rem))",
    bigger: "var(--icon-size-display-bigger, var(--size-max, 2.375rem))",
  },
  headline1: {
    default: "var(--icon-size-headline1, var(--size-huge, 1.875rem))",
    bigger: "var(--icon-size-headline1-bigger, var(--size-huger, 2.125rem))",
  },
  headline2: {
    default: "var(--icon-size-headline2, var(--size-large, 1.625rem))",
    bigger: "var(--icon-size-headline2-bigger, var(--size-huge, 1.875rem))",
  },
  title: {
    default: "var(--icon-size-title, var(--size-semilarge, 1.375rem))",
    bigger: "var(--icon-size-title-bigger, var(--size-semilarger, 1.5rem))",
  },
  subtitle: {
    default: "var(--icon-size-subtitle, var(--size-middle, 1rem))",
    bigger: "var(--icon-size-subtitle-bigger, var(--size-big, 1.25rem))",
  },
  text: {
    default: "var(--icon-size-text, var(--size-regular, 0.875rem))",
    bigger: "var(--icon-size-text-bigger, var(--size-middle, 1rem))",
  },
  caption: {
    default: "var(--icon-size-caption, var(--size-small, 0.75rem))",
    bigger: "var(--icon-size-caption-bigger, var(--size-regular, 0.875rem))",
  },
};

export function resolveIconSizeToken(level: IconLevel, biggerSize = false): string {
  return biggerSize ? ICON_LEVEL_SIZE[level].bigger : ICON_LEVEL_SIZE[level].default;
}

type IconSizingProps = AvialaIconProps & {
  /** Maps to width/height when both omitted */
  size?: number | string;
};

function isCssLength(value: number | string | undefined): value is string {
  return typeof value === "string" && /var\(|rem|em|%|calc\(/i.test(value);
}

/**
 * Resolve icon dimensions for SVG leaves.
 * CSS lengths (var()/rem/�) must go through `style` � SVG presentation
 * attributes do not reliably accept CSS custom properties.
 */
export function applyAvialaIconProps({
  biggerSize,
  level,
  size,
  width,
  height,
  thickness: _thickness,
  mode: _mode,
  style,
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

  const useCssSize = isCssLength(resolvedWidth) || isCssLength(resolvedHeight);
  const nextStyle: CSSProperties = { ...(style as CSSProperties | undefined) };

  if (useCssSize) {
    if (resolvedWidth !== undefined) nextStyle.width = resolvedWidth;
    if (resolvedHeight !== undefined) nextStyle.height = resolvedHeight;
    return {
      ...rest,
      style: nextStyle,
    };
  }

  return {
    ...rest,
    ...(style !== undefined ? { style } : {}),
    ...(resolvedWidth !== undefined ? { width: resolvedWidth } : {}),
    ...(resolvedHeight !== undefined ? { height: resolvedHeight } : {}),
  };
}
