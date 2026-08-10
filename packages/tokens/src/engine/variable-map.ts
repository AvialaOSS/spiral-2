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
  secondary: "control/control-normal-lightBackground-2",
  "secondary-foreground": "text/text-normal-text-black",
  muted: "control/control-normal-lightBackground-1",
  "muted-foreground": "text/text-normal-text-caption-black",
  accent: "control/control-normal-lightBackground-1",
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
    2: "#FEFDFD",
    3: "#F9F8F8",
    4: "#F0EFEF",
    5: "#E5E4E3",
    6: "#D6D5D4",
    7: "#C4C2C2",
    8: "#AFADAD",
    9: "#979696",
    10: "#7D7C7C",
    11: "#616060",
    12: "#444343",
    13: "#262525",
    14: "#000000",
  },
  dark: {
    1: "#000000",
    2: "#020202",
    3: "#090909",
    4: "#121212",
    5: "#1A1A1A",
    6: "#252525",
    7: "#333333",
    8: "#444444",
    9: "#595959",
    10: "#717272",
    11: "#8E8E8E",
    12: "#AFAFAF",
    13: "#D5D5D5",
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
