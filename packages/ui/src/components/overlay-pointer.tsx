import type { ComponentPropsWithoutRef } from "react";

/** Figma System Composition → Tooltip pointer (14×5). */
export const TOOLTIP_POINTER = {
  width: 14,
  height: 5,
  path: "M14 0L0 0C4.97025 1 3.98967 5 7 5C10.0103 5 9.02975 1 14 0Z",
} as const;

/** Figma System Composition → Popover pointer (16×5). */
export const POPOVER_POINTER = {
  width: 16,
  height: 5,
  path: "M16 0H0C4.12448 0 4.76977 5 8 5C11.2302 5 11.8755 0 16 0Z",
} as const;

export type OverlayPointerSvgProps = ComponentPropsWithoutRef<"svg"> & {
  width: number;
  height: number;
  path: string;
  /** Popover caret — stroked outline so the pointer reads on light page backgrounds. */
  variant?: "default" | "popover";
};

/** Curved caret SVG — fill via parent `color` / CSS token on the svg class. */
export function OverlayPointerSvg({
  width,
  height,
  path,
  variant = "default",
  className,
  style,
  ...props
}: OverlayPointerSvgProps) {
  const isPopover = variant === "popover";

  return (
    <svg
      {...props}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
      style={{ ...style, width, height }}
    >
      {isPopover ? (
        <>
          <path d={path} className="aviala-popover-content__arrow-outline" />
          <path d={path} className="aviala-popover-content__arrow-fill" />
        </>
      ) : (
        <path d={path} />
      )}
    </svg>
  );
}
