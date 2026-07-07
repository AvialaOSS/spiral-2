import { type ReactNode } from "react";
import { type BaseNumbersDensity, type PaletteConfig, type ThemeMode, type ThemePreset } from "@aviala/tokens";
export type ThemeProviderProps = {
    children: ReactNode;
    defaultMode?: ThemeMode;
    defaultPrimary?: string;
    defaultPresetId?: string;
    defaultPaletteConfig?: PaletteConfig;
    defaultDensity?: BaseNumbersDensity;
    storageKey?: string;
    onThemeChange?: (vars: Record<string, string>) => void;
};
type ThemeContextValue = {
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
    primaryColor: string;
    setPrimaryColor: (color: string) => void;
    presetId: string | undefined;
    applyPreset: (id: string) => void;
    presets: ThemePreset[];
    /** True when the active preset is a frozen ALD theme (palette engine bypassed). */
    isStaticTheme: boolean;
    density: BaseNumbersDensity;
    setDensity: (density: BaseNumbersDensity) => void;
    paletteConfig: PaletteConfig;
    setPaletteConfig: (config: Partial<PaletteConfig>) => void;
    resetPaletteConfig: () => void;
    themeVars: Record<string, string>;
};
export declare function ThemeProvider({ children, defaultMode, defaultPrimary, defaultPresetId, defaultPaletteConfig, defaultDensity, storageKey, onThemeChange, }: ThemeProviderProps): import("react").JSX.Element;
export declare function useTheme(): ThemeContextValue;
export declare function useThemeLayoutKey(): string | null;
export declare function ThemeScript({ storageKey, defaultMode, defaultPrimary, defaultDensity, }: {
    storageKey?: string;
    defaultMode?: ThemeMode;
    defaultPrimary?: string;
    defaultDensity?: BaseNumbersDensity;
}): import("react").JSX.Element;
export {};
//# sourceMappingURL=theme-provider.d.ts.map