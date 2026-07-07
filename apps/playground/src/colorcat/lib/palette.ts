import { palette } from "@aviala-design/color";
import {
  DEFAULT_PALETTE_CONFIG,
  PALETTE_STEPS,
  type PaletteConfig,
} from "@aviala/tokens";
import { colord } from "colord";
import type { ColorFormat, PaletteStep } from "./types";

type PaletteMetaResult = {
  steps: Array<{ index: number; color: string; tone: number; chroma: number }>;
};

type PaletteSingleMetaResult = {
  step: { tone: number; chroma: number };
};

function resolvePaletteConfig(config?: PaletteConfig) {
  return {
    curveGamma: config?.curveGamma ?? DEFAULT_PALETTE_CONFIG.curveGamma,
    protectHues: config?.protectHues ?? DEFAULT_PALETTE_CONFIG.protectHues,
    protectHueFamilies:
      config?.protectHueFamilies ?? DEFAULT_PALETTE_CONFIG.protectHueFamilies,
    protectHueStrength:
      config?.protectHueStrength ?? DEFAULT_PALETTE_CONFIG.protectHueStrength,
    mixColor: config?.mixColor,
    mixRatio: config?.mixRatio ?? DEFAULT_PALETTE_CONFIG.mixRatio,
  };
}

function linearize(channel: number): number {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function formatOklch(hex: string): string {
  const { r, g, b } = colord(hex).toRgb();
  const lr = linearize(r);
  const lg = linearize(g);
  const lb = linearize(b);

  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  const lRoot = Math.cbrt(l);
  const mRoot = Math.cbrt(m);
  const sRoot = Math.cbrt(s);

  const L = 0.2104542553 * lRoot + 0.793617785 * mRoot - 0.0040720468 * sRoot;
  const A = 1.9779984951 * lRoot - 2.428592205 * mRoot + 0.4505937099 * sRoot;
  const B = 0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.808675766 * sRoot;

  const C = Math.sqrt(A * A + B * B);
  let H = (Math.atan2(B, A) * 180) / Math.PI;
  if (H < 0) H += 360;

  return `oklch(${(L * 100).toFixed(1)}% ${C.toFixed(3)} ${H.toFixed(1)})`;
}

/** Generate 12-step light or dark palette with HCT tone/chroma metadata. */
export function generatePaletteSteps(
  baseColor: string,
  mode: "light" | "dark",
  paletteConfig?: PaletteConfig
): PaletteStep[] {
  const config = resolvePaletteConfig(paletteConfig);
  const hasMix = !!config.mixColor && config.mixRatio > 0;
  const options: Record<string, unknown> = {
    list: true,
    meta: true,
    dark: mode === "dark",
    steps: PALETTE_STEPS,
    curveGamma: config.curveGamma,
  };
  if (config.protectHues) {
    options.protectHueFamilies = [...config.protectHueFamilies];
    options.protectHueStrength = config.protectHueStrength;
  }
  if (hasMix) {
    options.mixColor = config.mixColor;
    options.mixRatio = config.mixRatio;
  }

  const result = palette.generate(
    baseColor,
    options as Parameters<typeof palette.generate>[1]
  ) as PaletteMetaResult;

  const steps: PaletteStep[] = result.steps.map((entry) => ({
    step: entry.index,
    color: entry.color,
    tone: entry.tone,
    chroma: entry.chroma,
  }));

  if (steps.length >= 10) {
    const step9 = steps[8]!;
    const step10 = steps[9]!;
    steps.push(
      { ...step9, step: 11 },
      { ...step10, step: 12 }
    );
  }

  return steps;
}

export function formatColor(hex: string, format: ColorFormat): string {
  const color = colord(hex);
  if (!color.isValid()) return hex;

  switch (format) {
    case "hex":
      return color.toHex().toUpperCase();
    case "rgb": {
      const { r, g, b } = color.toRgb();
      return `rgb(${r}, ${g}, ${b})`;
    }
    case "oklch":
      return formatOklch(hex);
  }
}

export function getToneChroma(hex: string): { tone: number; chroma: number } {
  const result = palette.generate(hex, {
    meta: true,
  } as Parameters<typeof palette.generate>[1]) as PaletteSingleMetaResult;
  return {
    tone: result.step.tone,
    chroma: result.step.chroma,
  };
}
