import type { ComponentType, SVGProps } from "react";
import type { IconMode, IconThickness } from "./types";

type VariantMap = Partial<
  Record<IconThickness, Partial<Record<IconMode, ComponentType<SVGProps<SVGSVGElement>>>>>
>;

const THICKNESS_ORDER: IconThickness[] = ["Medium", "Regular", "Bold", "Light"];
const MODE_ORDER: IconMode[] = ["default", "fill"];

/** Pick the best matching variant; falls back to Medium/default, then any available. */
export function resolveIconVariant(
  variants: VariantMap,
  thickness: IconThickness,
  mode: IconMode
): ComponentType<SVGProps<SVGSVGElement>> {
  const direct = variants[thickness]?.[mode];
  if (direct) return direct;

  const mediumDefault = variants.Medium?.default;
  if (mediumDefault) return mediumDefault;

  for (const t of THICKNESS_ORDER) {
    for (const m of MODE_ORDER) {
      const candidate = variants[t]?.[m];
      if (candidate) return candidate;
    }
  }

  throw new Error("Icon has no available variants");
}
