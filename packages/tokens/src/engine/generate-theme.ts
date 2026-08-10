import { palette } from "@aviala-design/color";
import { tokenPathToCssVar } from "./parse-ald";
import {
  ALD_NEUTRAL_RAMP,
  COLOR_FAMILIES,
  DEFAULT_PALETTE_CONFIG,
  DEFAULT_PRIMARY,
  DEFAULT_SEMANTIC_COLORS,
  PALETTE_STEPS,
  SEMANTIC_STEP_MAP,
  aliasToCssVar,
  type ColorFamily,
  type PaletteConfig,
} from "./variable-map";

export type ThemeMode = "light" | "dark";

export type ThemeInput = {
  mode?: ThemeMode;
  primary?: string;
  presetId?: string;
  /** Customizable color generation config (curve, hue protection, blending). */
  palette?: PaletteConfig;
};

export type ThemeVars = Record<string, string>;

/** Merge a partial PaletteConfig with the Aviala design-spec defaults. */
function resolvePaletteConfig(config?: PaletteConfig): Required<
  Pick<PaletteConfig, "curveGamma" | "protectHues" | "protectHueFamilies" | "protectHueStrength" | "mixRatio">
> & Pick<PaletteConfig, "mixColor"> {
  return {
    curveGamma: config?.curveGamma ?? DEFAULT_PALETTE_CONFIG.curveGamma,
    protectHues: config?.protectHues ?? DEFAULT_PALETTE_CONFIG.protectHues,
    protectHueFamilies:
      config?.protectHueFamilies ?? DEFAULT_PALETTE_CONFIG.protectHueFamilies,
    protectHueStrength:
      config?.protectHueStrength ?? DEFAULT_PALETTE_CONFIG.protectHueStrength,
    mixColor: config?.mixColor,
    mixRatio: config?.mixRatio ?? DEFAULT_PALETTE_CONFIG.mixRatio,
  };
}

function buildFamilyPalette(
  color: string,
  mode: ThemeMode,
  config: ReturnType<typeof resolvePaletteConfig>
): Record<number, string> {
  const hasMix = !!config.mixColor && config.mixRatio > 0;
  const options: Record<string, unknown> = {
    list: true,
    dark: mode === "dark",
    steps: PALETTE_STEPS,
    curveGamma: config.curveGamma,
  };
  if (config.protectHues) {
    options.protectHueFamilies = [...config.protectHueFamilies];
    options.protectHueStrength = config.protectHueStrength;
  }
  if (hasMix) {
    options.mixColor = config.mixColor;
    options.mixRatio = config.mixRatio;
  }

  const list = palette.generate(
    color,
    options as unknown as Parameters<typeof palette.generate>[1]
  ) as string[];

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

function setAldVar(vars: ThemeVars, path: string, value: string): void {
  vars[tokenPathToCssVar(path)] = value;
}

/** Emit ALD neutral ramp as --aviala-neutral-neutral-N for component CSS. */
function syncNeutralPalette(vars: ThemeVars, mode: ThemeMode): void {
  const ramp = ALD_NEUTRAL_RAMP[mode];
  for (const [step, hex] of Object.entries(ramp)) {
    vars[aliasToCssVar(`neutral/neutral-${step}`)] = hex;
  }
}

/** Mode-specific ALD tokens that are not derived from the primary palette steps. */
function syncAldModeTokens(vars: ThemeVars, mode: ThemeMode): void {
  const neutral = (step: number) =>
    vars[aliasToCssVar(`neutral/neutral-${step}`)] ?? ALD_NEUTRAL_RAMP[mode][step]!;

  // ALD token-colors aliases (light/dark resolve via neutral ramp).
  setAldVar(vars, "control/control-normal-lightBackground-light", neutral(3));
  setAldVar(vars, "control/control-normal-lightBackground-deep", neutral(4));
  setAldVar(vars, "control/control-normal-Background-whiteOnly", neutral(1));
  setAldVar(vars, "control/control-normal-Background-deep", neutral(6));
  setAldVar(vars, "border/border-normal-1", neutral(3));
  setAldVar(vars, "border/border-normal-2", neutral(4));
  setAldVar(vars, "border/border-normal-3", neutral(6));
  setAldVar(vars, "box/box-theme-primaryBackground", neutral(1));
  setAldVar(vars, "text/text-normal-text-white", neutral(2));
  setAldVar(vars, "text/text-normal-text-black", neutral(13));
  setAldVar(vars, "text/text-normal-text-caption-black", neutral(11));
  setAldVar(vars, "text/text-normal-text-caption-white", neutral(2));
  setAldVar(vars, "normal-background-theme", neutral(3));
}

/** Primary-tinted ALD semantic tokens — follow palette steps (Figma token-colors). */
function syncPrimarySemanticTokens(vars: ThemeVars): void {
  const step = (n: number) => vars[aliasToCssVar(`primary/primary-${n}`)]!;
  setAldVar(vars, "text/text-theme-primary-black", step(SEMANTIC_STEP_MAP.textPrimary));
  setAldVar(vars, "text/text-theme-secondary-black", step(SEMANTIC_STEP_MAP.textSecondary));
  setAldVar(vars, "text/text-theme-light-black", step(SEMANTIC_STEP_MAP.textLight));
  setAldVar(vars, "box/box-theme-secondarybackground", step(SEMANTIC_STEP_MAP.secondaryBackground));
  setAldVar(vars, "box/box-theme-lightbackground", step(SEMANTIC_STEP_MAP.lightBackground));
  setAldVar(vars, "control/control-theme-background", step(SEMANTIC_STEP_MAP.controlBackground));
  setAldVar(vars, "border/border-theme-primary", step(SEMANTIC_STEP_MAP.primaryBorder));
}

/** Semantic status icon/text — palette step 10 per family (ALD text/*-primary-black). */
function syncSemanticStatusTextTokens(vars: ThemeVars): void {
  const families: Array<{ family: ColorFamily; textPath: string }> = [
    { family: "info", textPath: "text/text-infomation-primary-black" },
    { family: "success", textPath: "text/text-success-primary-black" },
    { family: "warning", textPath: "text/text-warning-primary-black" },
    { family: "error", textPath: "text/text-fail-primary-black" },
  ];

  for (const { family, textPath } of families) {
    setAldVar(vars, textPath, vars[aliasToCssVar(`${family}/${family}-10`)]!);
  }
}

export function generateTheme(input: ThemeInput = {}): ThemeVars {
  const mode: ThemeMode = input.mode ?? "light";
  const primary = input.primary ?? DEFAULT_PRIMARY;
  const paletteConfig = resolvePaletteConfig(input.palette);

  const vars: ThemeVars = {};
  vars["--aviala-mode"] = mode;

  const familyColors: Record<ColorFamily, string> = {
    ...DEFAULT_SEMANTIC_COLORS,
    primary,
  };

  for (const family of COLOR_FAMILIES) {
    const color = familyColors[family];
    // Only the primary family blends toward the theme mix color.
    const familyConfig =
      family === "primary"
        ? paletteConfig
        : { ...paletteConfig, mixColor: undefined, mixRatio: 0 };
    const stepMap = buildFamilyPalette(color, mode, familyConfig);

    for (let step = 1; step <= 12; step++) {
      const key = familyKey(family, step);
      vars[aliasToCssVar(key)] = stepMap[step]!;
    }
  }

  syncNeutralPalette(vars, mode);
  syncPrimarySemanticTokens(vars);
  syncSemanticStatusTextTokens(vars);
  syncAldModeTokens(vars, mode);

  // Line shadows for button depth (neutral, mode-independent).
  setAldVar(vars, "special-effort/se-lineShadow-bottom", "rgba(0, 0, 0, 0.04)");
  setAldVar(vars, "special-effort/se-lineShadow-bottomDeep", "rgba(0, 0, 0, 0.08)");
  setAldVar(vars, "special-effort/se-lineShadow-all", "rgba(0, 0, 0, 0.12)");

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
