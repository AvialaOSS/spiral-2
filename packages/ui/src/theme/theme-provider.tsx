import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyTheme,
  applyBaseNumbersDensity,
  DEFAULT_PALETTE_CONFIG,
  DEFAULT_PRIMARY,
  generateTheme,
  getPreset,
  presetList,
  removeTheme,
  type BaseNumbersDensity,
  type PaletteConfig,
  type ThemeMode,
  type ThemePreset,
} from "@aviala-design/tokens";
import { initKeyboardFocus } from "../lib/keyboard-focus";

/** Last-resort brand color when no prop, stored value, or preset supplies one. */
const DEFAULT_PRIMARY_COLOR: string = DEFAULT_PRIMARY;

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

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
  defaultMode = "light",
  defaultPrimary,
  defaultPresetId = "ald",
  defaultPaletteConfig,
  defaultDensity = "default",
  storageKey = "aviala-theme",
  onThemeChange,
}: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return defaultMode;
    const stored = localStorage.getItem(`${storageKey}:mode`);
    return (stored as ThemeMode) || defaultMode;
  });

  const [primaryColor, setPrimaryColorState] = useState(() => {
    if (typeof window === "undefined") {
      return (
        defaultPrimary ?? getPreset(defaultPresetId)?.primary ?? DEFAULT_PRIMARY_COLOR
      );
    }
    return (
      localStorage.getItem(`${storageKey}:primary`) ??
      defaultPrimary ??
      getPreset(defaultPresetId)?.primary ??
      DEFAULT_PRIMARY_COLOR
    );
  });

  const [presetId, setPresetId] = useState<string | undefined>(() => {
    if (typeof window === "undefined") return defaultPresetId;
    return localStorage.getItem(`${storageKey}:preset`) ?? defaultPresetId;
  });

  const [paletteConfig, setPaletteConfigState] = useState<PaletteConfig>(() => {
    const base: PaletteConfig = { ...DEFAULT_PALETTE_CONFIG, ...defaultPaletteConfig };
    if (typeof window === "undefined") return base;
    const stored = localStorage.getItem(`${storageKey}:palette`);
    if (!stored) return base;
    try {
      return { ...base, ...(JSON.parse(stored) as PaletteConfig) };
    } catch {
      return base;
    }
  });

  const [density, setDensityState] = useState<BaseNumbersDensity>(() => {
    if (typeof window === "undefined") return defaultDensity;
    const stored = localStorage.getItem(`${storageKey}:density`);
    return stored === "mobile-friendly" ? "mobile-friendly" : defaultDensity;
  });

  const isStaticTheme = presetId ? getPreset(presetId)?.static === true : false;

  const themeVars = useMemo(
    () =>
      isStaticTheme
        ? {}
        : generateTheme({
            mode,
            primary: primaryColor,
            presetId,
            palette: paletteConfig,
          }),
    [isStaticTheme, mode, primaryColor, presetId, paletteConfig]
  );

  useLayoutEffect(() => {
    initKeyboardFocus();
  }, []);

  useLayoutEffect(() => {
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

  const setMode = useCallback(
    (next: ThemeMode) => {
      setModeState(next);
      localStorage.setItem(`${storageKey}:mode`, next);
    },
    [storageKey]
  );

  const setPrimaryColor = useCallback(
    (color: string) => {
      setPrimaryColorState(color);
      setPresetId(undefined);
      localStorage.setItem(`${storageKey}:primary`, color);
      localStorage.removeItem(`${storageKey}:preset`);
    },
    [storageKey]
  );

  const applyPreset = useCallback(
    (id: string) => {
      const preset = getPreset(id);
      if (!preset) return;
      setPresetId(id);
      setPrimaryColorState(preset.primary);
      localStorage.setItem(`${storageKey}:primary`, preset.primary);
      localStorage.setItem(`${storageKey}:preset`, id);
    },
    [storageKey]
  );

  const setPaletteConfig = useCallback(
    (config: Partial<PaletteConfig>) => {
      setPaletteConfigState((prev) => {
        const next = { ...prev, ...config };
        localStorage.setItem(`${storageKey}:palette`, JSON.stringify(next));
        return next;
      });
    },
    [storageKey]
  );

  const resetPaletteConfig = useCallback(() => {
    const base: PaletteConfig = { ...DEFAULT_PALETTE_CONFIG, ...defaultPaletteConfig };
    setPaletteConfigState(base);
    localStorage.removeItem(`${storageKey}:palette`);
  }, [storageKey, defaultPaletteConfig]);

  const setDensity = useCallback(
    (next: BaseNumbersDensity) => {
      setDensityState(next);
      if (next === "mobile-friendly") {
        localStorage.setItem(`${storageKey}:density`, next);
      } else {
        localStorage.removeItem(`${storageKey}:density`);
      }
    },
    [storageKey]
  );

  const value = useMemo(
    () => ({
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
    }),
    [
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
    ]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}

/** Layout key for remeasuring size-sensitive UI when theme density/mode changes. */
export function useThemeLayoutKey(): string | null {
  const ctx = useContext(ThemeContext);
  if (!ctx) return null;
  return `${ctx.density}:${ctx.mode}`;
}

const DEFAULT_STORAGE_KEY = "aviala-theme";
const DEFAULT_SCRIPT_MODE: ThemeMode = "light";
const DEFAULT_SCRIPT_PRIMARY = DEFAULT_PRIMARY_COLOR;
const DEFAULT_SCRIPT_DENSITY: BaseNumbersDensity = "default";

/**
 * `ThemeScript` builds its body as a template literal handed to
 * `dangerouslySetInnerHTML`, so every interpolated prop must be whitelisted rather
 * than escaped — a stray quote or `</script>` would otherwise break out of the JS
 * string or the tag. Anything outside these whitelists falls back to the default.
 */
const STORAGE_KEY_PATTERN = /^[a-zA-Z0-9_-]+$/;
const HEX_COLOR_PATTERN = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const THEME_MODES: readonly ThemeMode[] = ["light", "dark"];
const THEME_DENSITIES: readonly BaseNumbersDensity[] = ["default", "mobile-friendly"];

function pickFromWhitelist<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
  fallback: T
): T {
  return value !== undefined && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

function pickMatching(
  value: string | undefined,
  pattern: RegExp,
  fallback: string
): string {
  return value !== undefined && pattern.test(value) ? value : fallback;
}

export function ThemeScript({
  storageKey,
  defaultMode,
  defaultPrimary,
  defaultDensity,
}: {
  storageKey?: string;
  defaultMode?: ThemeMode;
  defaultPrimary?: string;
  defaultDensity?: BaseNumbersDensity;
}) {
  const safeStorageKey = pickMatching(storageKey, STORAGE_KEY_PATTERN, DEFAULT_STORAGE_KEY);
  const safeMode = pickFromWhitelist(defaultMode, THEME_MODES, DEFAULT_SCRIPT_MODE);
  const safePrimary = pickMatching(defaultPrimary, HEX_COLOR_PATTERN, DEFAULT_SCRIPT_PRIMARY);
  const safeDensity = pickFromWhitelist(
    defaultDensity,
    THEME_DENSITIES,
    DEFAULT_SCRIPT_DENSITY
  );

  const script = `
(function(){
  try {
    var mode = localStorage.getItem('${safeStorageKey}:mode') || '${safeMode}';
    var primary = localStorage.getItem('${safeStorageKey}:primary') || '${safePrimary}';
    var density = localStorage.getItem('${safeStorageKey}:density') || '${safeDensity}';
    document.documentElement.setAttribute('data-mode', mode);
    if (density === 'mobile-friendly') {
      document.documentElement.setAttribute('data-density', 'mobile-friendly');
    }
  } catch(e) {}
})();
`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
