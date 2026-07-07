import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, } from "react";
import { applyTheme, applyBaseNumbersDensity, DEFAULT_PALETTE_CONFIG, generateTheme, getPreset, presetList, removeTheme, } from "@aviala-design/tokens";
const ThemeContext = createContext(null);
export function ThemeProvider({ children, defaultMode = "light", defaultPrimary, defaultPresetId = "default", defaultPaletteConfig, defaultDensity = "default", storageKey = "aviala-theme", onThemeChange, }) {
    const [mode, setModeState] = useState(() => {
        if (typeof window === "undefined")
            return defaultMode;
        const stored = localStorage.getItem(`${storageKey}:mode`);
        return stored || defaultMode;
    });
    const [primaryColor, setPrimaryColorState] = useState(() => {
        if (typeof window === "undefined") {
            return defaultPrimary ?? getPreset(defaultPresetId)?.primary ?? "#FF5532";
        }
        return (localStorage.getItem(`${storageKey}:primary`) ??
            defaultPrimary ??
            getPreset(defaultPresetId)?.primary ??
            "#FF5532");
    });
    const [presetId, setPresetId] = useState(() => {
        if (typeof window === "undefined")
            return defaultPresetId;
        return localStorage.getItem(`${storageKey}:preset`) ?? defaultPresetId;
    });
    const [paletteConfig, setPaletteConfigState] = useState(() => {
        const base = { ...DEFAULT_PALETTE_CONFIG, ...defaultPaletteConfig };
        if (typeof window === "undefined")
            return base;
        const stored = localStorage.getItem(`${storageKey}:palette`);
        if (!stored)
            return base;
        try {
            return { ...base, ...JSON.parse(stored) };
        }
        catch {
            return base;
        }
    });
    const [density, setDensityState] = useState(() => {
        if (typeof window === "undefined")
            return defaultDensity;
        const stored = localStorage.getItem(`${storageKey}:density`);
        return stored === "mobile-friendly" ? "mobile-friendly" : defaultDensity;
    });
    const isStaticTheme = presetId ? getPreset(presetId)?.static === true : false;
    const themeVars = useMemo(() => isStaticTheme
        ? {}
        : generateTheme({
            mode,
            primary: primaryColor,
            presetId,
            palette: paletteConfig,
        }), [isStaticTheme, mode, primaryColor, presetId, paletteConfig]);
    useEffect(() => {
        applyBaseNumbersDensity(document.documentElement, density);
        if (isStaticTheme) {
            // Clear any inline palette vars so the frozen [data-theme="ald"] CSS wins.
            removeTheme();
            document.documentElement.setAttribute("data-theme", presetId ?? "ald");
            document.documentElement.setAttribute("data-mode", mode);
            onThemeChange?.(themeVars);
            return;
        }
        applyTheme(themeVars, { mode, themeId: presetId, density });
        onThemeChange?.(themeVars);
    }, [isStaticTheme, themeVars, mode, presetId, density, onThemeChange]);
    const setMode = useCallback((next) => {
        setModeState(next);
        localStorage.setItem(`${storageKey}:mode`, next);
    }, [storageKey]);
    const setPrimaryColor = useCallback((color) => {
        setPrimaryColorState(color);
        setPresetId(undefined);
        localStorage.setItem(`${storageKey}:primary`, color);
        localStorage.removeItem(`${storageKey}:preset`);
    }, [storageKey]);
    const applyPreset = useCallback((id) => {
        const preset = getPreset(id);
        if (!preset)
            return;
        setPresetId(id);
        setPrimaryColorState(preset.primary);
        localStorage.setItem(`${storageKey}:primary`, preset.primary);
        localStorage.setItem(`${storageKey}:preset`, id);
    }, [storageKey]);
    const setPaletteConfig = useCallback((config) => {
        setPaletteConfigState((prev) => {
            const next = { ...prev, ...config };
            localStorage.setItem(`${storageKey}:palette`, JSON.stringify(next));
            return next;
        });
    }, [storageKey]);
    const resetPaletteConfig = useCallback(() => {
        const base = { ...DEFAULT_PALETTE_CONFIG, ...defaultPaletteConfig };
        setPaletteConfigState(base);
        localStorage.removeItem(`${storageKey}:palette`);
    }, [storageKey, defaultPaletteConfig]);
    const setDensity = useCallback((next) => {
        setDensityState(next);
        if (next === "mobile-friendly") {
            localStorage.setItem(`${storageKey}:density`, next);
        }
        else {
            localStorage.removeItem(`${storageKey}:density`);
        }
    }, [storageKey]);
    const value = useMemo(() => ({
        mode,
        setMode,
        primaryColor,
        setPrimaryColor,
        presetId,
        applyPreset,
        presets: presetList,
        isStaticTheme,
        density,
        setDensity,
        paletteConfig,
        setPaletteConfig,
        resetPaletteConfig,
        themeVars,
    }), [
        mode,
        setMode,
        primaryColor,
        setPrimaryColor,
        presetId,
        applyPreset,
        isStaticTheme,
        density,
        setDensity,
        paletteConfig,
        setPaletteConfig,
        resetPaletteConfig,
        themeVars,
    ]);
    return _jsx(ThemeContext.Provider, { value: value, children: children });
}
export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return ctx;
}
export function ThemeScript({ storageKey = "aviala-theme", defaultMode = "light", defaultPrimary = "#FF5532", defaultDensity = "default", }) {
    const script = `
(function(){
  try {
    var mode = localStorage.getItem('${storageKey}:mode') || '${defaultMode}';
    var primary = localStorage.getItem('${storageKey}:primary') || '${defaultPrimary}';
    var density = localStorage.getItem('${storageKey}:density') || '${defaultDensity}';
    document.documentElement.setAttribute('data-mode', mode);
    if (density === 'mobile-friendly') {
      document.documentElement.setAttribute('data-density', 'mobile-friendly');
    }
  } catch(e) {}
})();
`;
    return _jsx("script", { dangerouslySetInnerHTML: { __html: script } });
}
