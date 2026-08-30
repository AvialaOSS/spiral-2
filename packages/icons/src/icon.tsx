import type { ComponentType } from "react";
import { applyAvialaIconProps } from "./icon-size";
import {
  DEFAULT_ICON_MODE,
  DEFAULT_ICON_THICKNESS,
  type AvialaIconProps,
} from "./types";

export type IconProps = AvialaIconProps & {
  icon: ComponentType<AvialaIconProps>;
  /** Explicit pixel/CSS size; ignored when `level` is set unless both width and height are provided */
  size?: number | string;
  title?: string;
};

export function Icon({
  icon: IconComponent,
  size,
  title,
  thickness = DEFAULT_ICON_THICKNESS,
  mode = DEFAULT_ICON_MODE,
  biggerSize,
  level,
  className,
  width,
  height,
  ...props
}: IconProps) {
  const ariaProps = title
    ? { role: "img" as const, "aria-label": title }
    : { "aria-hidden": true as const };

  const svgProps = applyAvialaIconProps({
    biggerSize,
    level,
    size: level
      ? size
      : (size ?? "var(--icon-size-text, var(--size-regular, 0.875rem))"),
    width,
    height,
    className,
    ...props,
  });

  return (
    <IconComponent
      {...ariaProps}
      {...svgProps}
      thickness={thickness}
      mode={mode}
    />
  );
}

export type {
  AvialaIconProps,
  IconLevel,
  IconMode,
  IconThickness,
} from "./types";
