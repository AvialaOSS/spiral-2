/** Designer-defined semantic step → palette step mapping (from ALD token-colors + control) */
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

/** shadcn semantic → ALD semantic token paths */
export const SHADCN_TO_ALD: Record<string, string> = {
  background: "normal-background-theme",
  foreground: "text/text-theme-primary-black",
  primary: "control/control-theme-Background",
  "primary-foreground": "text/text-theme-primary-whiteOnly",
  secondary: "control/control-normal-lightBackground-deep",
  "secondary-foreground": "text/text-theme-secondary-black",
  muted: "box/box-theme-lightBackground",
  "muted-foreground": "text/text-theme-light-black",
  accent: "control/control-theme-lightBackground",
  "accent-foreground": "text/text-theme-primary-black",
  destructive: "control/control-fail-Background",
  "destructive-foreground": "text/text-fail-primary-whiteOnly",
  border: "border/border-theme-light",
  input: "border/border-theme-light",
  ring: "border/border-theme-primary",
  card: "box/box-theme-primaryBackground",
  "card-foreground": "text/text-theme-primary-black",
  popover: "box/box-normal-primaryBackground",
  "popover-foreground": "text/text-normal-primary-black",
};

export const DEFAULT_PRIMARY = "#FF5532";

export const DEFAULT_SEMANTIC_COLORS: Record<ColorFamily, string> = {
  primary: "#FF5532",
  success: "#70B450",
  warning: "#EC8B09",
  error: "#F41544",
  info: "#66B6FA",
};
