import type { SVGProps } from "react";

export type IconThickness = "Light" | "Regular" | "Medium" | "Bold" | "Black";
export type IconMode = "default" | "fill";

/** Typography level for Icons component sizing — Figma Components → Icons */
export type IconLevel =
  | "display"
  | "headline1"
  | "headline2"
  | "title"
  | "subtitle"
  | "text"
  | "caption";

export const ICON_THICKNESSES = [
  "Light",
  "Regular",
  "Medium",
  "Bold",
  "Black",
] as const satisfies readonly IconThickness[];
export const ICON_MODES = ["default", "fill"] as const satisfies readonly IconMode[];
export const ICON_LEVELS = [
  "display",
  "headline1",
  "headline2",
  "title",
  "subtitle",
  "text",
  "caption",
] as const satisfies readonly IconLevel[];

export const DEFAULT_ICON_THICKNESS: IconThickness = "Medium";
export const DEFAULT_ICON_MODE: IconMode = "default";

/** Props for generated Aviala icons — switch thickness/mode on one component. */
export type AvialaIconProps = Omit<SVGProps<SVGSVGElement>, "mode"> & {
  thickness?: IconThickness;
  mode?: IconMode;
  /** Bump icon size one step on the ALD scale for the given `level`. Figma: BiggerSize=YES */
  biggerSize?: boolean;
  /** Typography level for token-based sizing when width/height/size are omitted. */
  level?: IconLevel;
};
