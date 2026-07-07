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
];
/** Default config = Aviala design-spec colorful palette (8 hues protected, strength 2). */
export const DEFAULT_PALETTE_CONFIG = {
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
};
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
};
export const COLOR_FAMILIES = [
    "primary",
    "success",
    "warning",
    "error",
    "info",
];
/** Map ALD alias target like "primary/primary-8" to CSS variable name */
export function aliasToCssVar(alias) {
    const normalized = alias.replace(/\//g, "-").toLowerCase();
    return `--aviala-${normalized}`;
}
/** shadcn semantic → ALD semantic token paths */
export const SHADCN_TO_ALD = {
    background: "normal-background-theme",
    foreground: "text/text-normal-text-black",
    primary: "control/control-theme-Background",
    "primary-foreground": "text/text-theme-primary-whiteOnly",
    secondary: "control/control-normal-lightBackground-deep",
    "secondary-foreground": "text/text-normal-text-black",
    muted: "control/control-normal-lightBackground-light",
    "muted-foreground": "text/text-normal-text-caption-black",
    accent: "control/control-normal-lightBackground-light",
    "accent-foreground": "text/text-normal-text-black",
    destructive: "control/control-fail-Background",
    "destructive-foreground": "text/text-fail-primary-whiteOnly",
    border: "border/border-normal-light",
    input: "border/border-normal-light",
    ring: "border/border-theme-primary",
    card: "box/box-theme-primaryBackground",
    "card-foreground": "text/text-normal-text-black",
    popover: "box/box-normal-primaryBackground",
    "popover-foreground": "text/text-normal-text-black",
};
export const DEFAULT_PRIMARY = "#FF5532";
export const DEFAULT_SEMANTIC_COLORS = {
    primary: "#FF5532",
    success: "#70B450",
    warning: "#EC8B09",
    error: "#F41544",
    info: "#66B6FA",
};
