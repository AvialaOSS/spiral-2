/**
 * Aviala Design colorful palette (彩色色盘) — matches Figma / ALD generator settings:
 * protect hues ×8, strength 2, seed from input color (e.g. #FF5532 → tone 59.88 / chroma 83.06).
 */
export const PALETTE_HUE_FAMILIES = [
  "Red",
  "Orange",
  "Yellow",
  "Green",
  "Cyan",
  "Blue",
  "Purple",
  "Magenta",
] as const;

export type HueFamily = (typeof PALETTE_HUE_FAMILIES)[number];

/**
 * Customizable theme color generation config (mirrors `@aviala-design/color`
 * `palette.generate` options — see ColorCat). Drives the tonal curve, hue
 * protection and optional theme blending used by `generateTheme`.
 */
export type PaletteConfig = {
  /** Tone distribution curve gamma (0.1–5). 1 = default ALD curve. */
  curveGamma?: number;
  /** Toggle hue-family protection. */
  protectHues?: boolean;
  /** Hue families to protect from drifting. */
  protectHueFamilies?: HueFamily[];
  /** Hue protection strength (0–2). */
  protectHueStrength?: number;
  /** Optional color to blend the palette toward (theme mixing). */
  mixColor?: string;
  /** Blend ratio toward `mixColor` (0–1). */
  mixRatio?: number;
};

/** Default config = Aviala design-spec colorful palette (8 hues protected, strength 2). */
export const DEFAULT_PALETTE_CONFIG: Required<
  Pick<PaletteConfig, "curveGamma" | "protectHues" | "protectHueFamilies" | "protectHueStrength" | "mixRatio">
> = {
  curveGamma: 1,
  protectHues: true,
  protectHueFamilies: [...PALETTE_HUE_FAMILIES],
  protectHueStrength: 2,
  mixRatio: 0,
};

/** Tonal steps generated per family; semantic step map assumes 10. */
export const PALETTE_STEPS = 10;

/** @deprecated Use `DEFAULT_PALETTE_CONFIG`. Kept for back-compat. */
export const PALETTE_GENERATE_OPTIONS = {
  protectHueFamilies: [...PALETTE_HUE_FAMILIES],
  protectHueStrength: 2,
} as const;

/** Designer-defined semantic step → palette step mapping (from ALD token-colors) */
export const SEMANTIC_STEP_MAP = {
  primaryBackground: 8,
  primaryBorder: 8,
  controlBackground: 8,
  textPrimary: 10,
  textSecondary: 7,
  textLight: 5,
  secondaryBackground: 4,
  lightBackground: 2,
} as const;

export const COLOR_FAMILIES = [
  "primary",
  "success",
  "warning",
  "error",
  "info",
] as const;

export type ColorFamily = (typeof COLOR_FAMILIES)[number];

/** Map ALD alias target like "primary/primary-8" to CSS variable name */
export function aliasToCssVar(alias: string): string {
  const normalized = alias.replace(/\//g, "-").toLowerCase();
  return `--aviala-${normalized}`;
}

/**
 * shadcn semantic → ALD semantic token paths.
 * Foreground-on-primary tokens do not exist in ALD; use `#ffffff` at the CSS layer
 * (see colors.css / build-css.mjs). Paths here must exist in source/ald/.
 */
export const SHADCN_TO_ALD: Record<string, string> = {
  background: "normal-background-theme",
  foreground: "text/text-normal-text-black",
  primary: "control/control-theme-background",
  secondary: "control/control-normal-lightBackground-deep",
  "secondary-foreground": "text/text-normal-text-black",
  muted: "control/control-normal-lightBackground-light",
  "muted-foreground": "text/text-normal-text-caption-black",
  accent: "control/control-normal-lightBackground-light",
  "accent-foreground": "text/text-normal-text-black",
  destructive: "control/control-fail-background",
  border: "border/border-normal-1",
  input: "border/border-normal-1",
  ring: "border/border-theme-primary",
  card: "box/box-theme-primaryBackground",
  "card-foreground": "text/text-normal-text-black",
  popover: "box/box-normal-Background-whiteOnly",
  "popover-foreground": "text/text-normal-text-black",
};

/** Literal values for shadcn keys with no ALD equivalent. */
export const SHADCN_LITERAL: Record<string, string> = {
  "primary-foreground": "#ffffff",
  "destructive-foreground": "#ffffff",
};

/** ALD neutral ramp (Aviala Design Colors) — used by generateTheme for --aviala-neutral-*. */
export const ALD_NEUTRAL_RAMP: Record<"light" | "dark", Record<number, string>> = {
  light: {
    1: "#FFFFFF",
    2: "#FCFCFC",
    3: "#F6F5F5",
    4: "#EBEAEA",
    5: "#DEDDDC",
    6: "#CDCCCC",
    7: "#BAB9B8",
    8: "#A5A3A3",
    9: "#8D8C8C",
    10: "#747372",
    11: "#595858",
    12: "#3E3D3D",
    13: "#232222",
    14: "#000000",
  },
  dark: {
    1: "#000000",
    2: "#040404",
    3: "#0D0C0C",
    4: "#161616",
    5: "#1F1F1F",
    6: "#2C2C2C",
    7: "#3B3B3B",
    8: "#4D4D4D",
    9: "#626263",
    10: "#7B7B7B",
    11: "#979797",
    12: "#B6B6B6",
    13: "#D9D9D9",
    14: "#FFFFFF",
  },
};

export const DEFAULT_PRIMARY = "#FF5532";

export const DEFAULT_SEMANTIC_COLORS: Record<ColorFamily, string> = {
  primary: "#FF5532",
  success: "#33BF24",
  warning: "#FFC130",
  error: "#FF1D4E",
  info: "#37B2FF",
};
