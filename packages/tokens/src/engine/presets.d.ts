export type ThemePreset = {
    id: string;
    name: string;
    primary: string;
    description?: string;
    /**
     * When true the preset is a frozen theme whose CSS variables come verbatim
     * from the ALD Figma token exports (see `[data-theme="ald"]` in styles.css).
     * The runtime palette engine is bypassed for these presets.
     */
    static?: boolean;
};
export declare const presets: Record<string, ThemePreset>;
export declare const presetList: ThemePreset[];
export declare function getPreset(id: string): ThemePreset | undefined;
//# sourceMappingURL=presets.d.ts.map