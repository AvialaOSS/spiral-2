import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyTheme,
  generateTheme,
  getPreset,
  presetList,
  type ThemeMode,
  type ThemePreset,
} from "@aviala/tokens";

export type ThemeProviderProps = {
  children: ReactNode;
  defaultMode?: ThemeMode;
  defaultPrimary?: string;
  defaultPresetId?: string;
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
  themeVars: Record<string, string>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
  defaultMode = "light",
  defaultPrimary,
  defaultPresetId = "default",
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
      return defaultPrimary ?? getPreset(defaultPresetId)?.primary ?? "#FF5532";
    }
    return (
      localStorage.getItem(`${storageKey}:primary`) ??
      defaultPrimary ??
      getPreset(defaultPresetId)?.primary ??
      "#FF5532"
    );
  });

  const [presetId, setPresetId] = useState<string | undefined>(defaultPresetId);

  const themeVars = useMemo(
    () =>
      generateTheme({
        mode,
        primary: primaryColor,
        presetId,
      }),
    [mode, primaryColor, presetId]
  );

  useEffect(() => {
    applyTheme(themeVars, { mode, themeId: presetId });
    onThemeChange?.(themeVars);
  }, [themeVars, mode, presetId, onThemeChange]);

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
      themeVars,
    }),
    [mode, setMode, primaryColor, setPrimaryColor, presetId, applyPreset, themeVars]
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

export function ThemeScript({
  storageKey = "aviala-theme",
  defaultMode = "light",
  defaultPrimary = "#FF5532",
}: {
  storageKey?: string;
  defaultMode?: ThemeMode;
  defaultPrimary?: string;
}) {
  const script = `
(function(){
  try {
    var mode = localStorage.getItem('${storageKey}:mode') || '${defaultMode}';
    var primary = localStorage.getItem('${storageKey}:primary') || '${defaultPrimary}';
    document.documentElement.setAttribute('data-mode', mode);
  } catch(e) {}
})();
`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
