/**
 * Aviala Design colorful palette (彩色色盘) — matches Figma / ALD generator settings:
 * protect hues ×8, strength 2, seed from input color (e.g. #FF5532 → tone 59.88 / chroma 83.06).
 */
export declare const PALETTE_HUE_FAMILIES: readonly ["Red", "Orange", "Yellow", "Green", "Cyan", "Blue", "Purple", "Magenta"];
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
export declare const DEFAULT_PALETTE_CONFIG: Required<Pick<PaletteConfig, "curveGamma" | "protectHues" | "protectHueFamilies" | "protectHueStrength" | "mixRatio">>;
/** Tonal steps generated per family; semantic step map assumes 10. */
export declare const PALETTE_STEPS = 10;
/** @deprecated Use `DEFAULT_PALETTE_CONFIG`. Kept for back-compat. */
export declare const PALETTE_GENERATE_OPTIONS: {
    readonly protectHueFamilies: readonly ["Red", "Orange", "Yellow", "Green", "Cyan", "Blue", "Purple", "Magenta"];
    readonly protectHueStrength: 2;
};
/** Designer-defined semantic step → palette step mapping (from ALD token-colors + control) */
export declare const SEMANTIC_STEP_MAP: {
    readonly primaryBackground: 8;
    readonly primaryBorder: 8;
    readonly controlBackground: 8;
    readonly textPrimary: 10;
    readonly textSecondary: 7;
    readonly textLight: 5;
    readonly secondaryBackground: 4;
    readonly lightBackground: 2;
};
export declare const COLOR_FAMILIES: readonly ["primary", "success", "warning", "error", "info"];
export type ColorFamily = (typeof COLOR_FAMILIES)[number];
/** Map ALD alias target like "primary/primary-8" to CSS variable name */
export declare function aliasToCssVar(alias: string): string;
/** shadcn semantic → ALD semantic token paths */
export declare const SHADCN_TO_ALD: Record<string, string>;
export declare const DEFAULT_PRIMARY = "#FF5532";
export declare const DEFAULT_SEMANTIC_COLORS: Record<ColorFamily, string>;
//# sourceMappingURL=variable-map.d.ts.map