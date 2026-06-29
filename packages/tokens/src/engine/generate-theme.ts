import { palette } from "@aviala-design/color";
import {
  COLOR_FAMILIES,
  DEFAULT_PRIMARY,
  DEFAULT_SEMANTIC_COLORS,
  SEMANTIC_STEP_MAP,
  aliasToCssVar,
  type ColorFamily,
} from "./variable-map";

export type ThemeMode = "light" | "dark";

export type ThemeInput = {
  mode?: ThemeMode;
  primary?: string;
  presetId?: string;
};

export type ThemeVars = Record<string, string>;

function buildFamilyPalette(
  color: string,
  mode: ThemeMode
): Record<number, string> {
  const list = palette.generate(color, {
    list: true,
    dark: mode === "dark",
  } as Parameters<typeof palette.generate>[1]) as string[];

  const map: Record<number, string> = {};
  list.forEach((hex, i) => {
    map[i + 1] = hex;
  });
  // Extend to 12 steps: 11-12 mirror 9-10 for semantic aliases
  if (list.length >= 10) {
    map[11] = list[8]!;
    map[12] = list[9]!;
  }
  return map;
}

function familyKey(family: ColorFamily, step: number): string {
  return `${family}/${family}-${step}`;
}

export function generateTheme(input: ThemeInput = {}): ThemeVars {
  const mode: ThemeMode = input.mode ?? "light";
  const primary = input.primary ?? DEFAULT_PRIMARY;

  const vars: ThemeVars = {};
  vars["--aviala-mode"] = mode;

  const familyColors: Record<ColorFamily, string> = {
    ...DEFAULT_SEMANTIC_COLORS,
    primary,
  };

  const palettes: Record<string, Record<number, string>> = {};

  for (const family of COLOR_FAMILIES) {
    const color = familyColors[family];
    const stepMap = buildFamilyPalette(color, mode);
    palettes[family] = stepMap;

    for (let step = 1; step <= 12; step++) {
      const key = familyKey(family, step);
      vars[aliasToCssVar(key)] = stepMap[step]!;
    }
  }

  // Semantic assignments from designer step rules
  vars["--primary"] = palettes.primary[SEMANTIC_STEP_MAP.primaryBackground]!;
  vars["--primary-foreground"] = mode === "dark" ? "#ffffff" : "#ffffff";
  vars["--secondary"] =
    palettes.primary[SEMANTIC_STEP_MAP.secondaryBackground]!;
  vars["--secondary-foreground"] =
    palettes.primary[SEMANTIC_STEP_MAP.textSecondary]!;
  vars["--accent"] = palettes.primary[SEMANTIC_STEP_MAP.lightBackground]!;
  vars["--accent-foreground"] =
    palettes.primary[SEMANTIC_STEP_MAP.textPrimary]!;
  vars["--destructive"] = palettes.error[SEMANTIC_STEP_MAP.primaryBackground]!;
  vars["--destructive-foreground"] = "#ffffff";
  vars["--muted"] = palettes.primary[SEMANTIC_STEP_MAP.lightBackground]!;
  vars["--muted-foreground"] = palettes.primary[SEMANTIC_STEP_MAP.textLight]!;
  vars["--background"] = mode === "dark" ? "#1a1a1a" : "#FAF8F8";
  vars["--foreground"] = palettes.primary[SEMANTIC_STEP_MAP.textPrimary]!;
  vars["--border"] = palettes.primary[SEMANTIC_STEP_MAP.lightBackground]!;
  vars["--input"] = vars["--border"];
  vars["--ring"] = palettes.primary[SEMANTIC_STEP_MAP.primaryBackground]!;
  vars["--card"] = mode === "dark" ? "#242424" : "#ffffff";
  vars["--card-foreground"] = vars["--foreground"];
  vars["--popover"] = vars["--card"];
  vars["--popover-foreground"] = vars["--foreground"];

  // Control tokens
  vars["--control-theme-background"] =
    palettes.primary[SEMANTIC_STEP_MAP.controlBackground]!;
  vars["--control-theme-light-background"] =
    palettes.primary[SEMANTIC_STEP_MAP.secondaryBackground]!;
  vars["--control-success-background"] =
    palettes.success[SEMANTIC_STEP_MAP.controlBackground]!;
  vars["--control-fail-background"] =
    palettes.error[SEMANTIC_STEP_MAP.controlBackground]!;
  vars["--control-warning-background"] =
    palettes.warning[SEMANTIC_STEP_MAP.controlBackground]!;
  vars["--control-info-background"] =
    palettes.info[SEMANTIC_STEP_MAP.controlBackground]!;

  // Text semantic
  vars["--text-theme-primary"] =
    palettes.primary[SEMANTIC_STEP_MAP.textPrimary]!;
  vars["--text-theme-secondary"] =
    palettes.primary[SEMANTIC_STEP_MAP.textSecondary]!;
  vars["--text-theme-light"] = palettes.primary[SEMANTIC_STEP_MAP.textLight]!;

  if (input.presetId) {
    vars["--aviala-theme-id"] = input.presetId;
  }

  return vars;
}

export function themeVarsToCssText(vars: ThemeVars): string {
  return `:root {\n${Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n")}\n}`;
}
