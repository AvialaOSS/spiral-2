import { type PaletteConfig } from "./variable-map";
export type ThemeMode = "light" | "dark";
export type ThemeInput = {
    mode?: ThemeMode;
    primary?: string;
    presetId?: string;
    /** Customizable color generation config (curve, hue protection, blending). */
    palette?: PaletteConfig;
};
export type ThemeVars = Record<string, string>;
export declare function generateTheme(input?: ThemeInput): ThemeVars;
export declare function themeVarsToCssText(vars: ThemeVars): string;
//# sourceMappingURL=generate-theme.d.ts.map