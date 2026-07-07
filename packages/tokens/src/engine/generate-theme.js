import { palette } from "@aviala-design/color";
import { tokenPathToCssVar } from "./parse-ald";
import { COLOR_FAMILIES, DEFAULT_PALETTE_CONFIG, DEFAULT_PRIMARY, DEFAULT_SEMANTIC_COLORS, PALETTE_STEPS, SEMANTIC_STEP_MAP, aliasToCssVar, } from "./variable-map";
/** Merge a partial PaletteConfig with the Aviala design-spec defaults. */
function resolvePaletteConfig(config) {
    return {
        curveGamma: config?.curveGamma ?? DEFAULT_PALETTE_CONFIG.curveGamma,
        protectHues: config?.protectHues ?? DEFAULT_PALETTE_CONFIG.protectHues,
        protectHueFamilies: config?.protectHueFamilies ?? DEFAULT_PALETTE_CONFIG.protectHueFamilies,
        protectHueStrength: config?.protectHueStrength ?? DEFAULT_PALETTE_CONFIG.protectHueStrength,
        mixColor: config?.mixColor,
        mixRatio: config?.mixRatio ?? DEFAULT_PALETTE_CONFIG.mixRatio,
    };
}
function buildFamilyPalette(color, mode, config) {
    const hasMix = !!config.mixColor && config.mixRatio > 0;
    const options = {
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
    const list = palette.generate(color, options);
    const map = {};
    list.forEach((hex, i) => {
        map[i + 1] = hex;
    });
    // Extend to 12 steps: 11-12 mirror 9-10 for semantic aliases
    if (list.length >= 10) {
        map[11] = list[8];
        map[12] = list[9];
    }
    return map;
}
function familyKey(family, step) {
    return `${family}/${family}-${step}`;
}
function setAldVar(vars, path, value) {
    vars[tokenPathToCssVar(path)] = value;
}
/** Mode-specific ALD tokens that are not derived from the primary palette steps. */
function syncAldModeTokens(vars, mode) {
    setAldVar(vars, "control/control-normal-lightBackground-light", mode === "dark" ? "#3d3d3d" : "#f5f3f3");
    setAldVar(vars, "control/control-normal-lightBackground-deep", mode === "dark" ? "#2a2a2a" : "#fdfbfb");
    setAldVar(vars, "control/control-normal-lightBackground-whiteOnly", mode === "dark" ? "#242424" : "#ffffff");
    setAldVar(vars, "box/box-theme-primaryBackground", mode === "dark" ? "#242424" : "#ffffff");
    setAldVar(vars, "text/text-normal-text-white", "#fefcfc");
    setAldVar(vars, "text/text-normal-text-black", mode === "dark" ? "#e8e8e8" : "#343333");
    setAldVar(vars, "text/text-normal-text-caption-black", mode === "dark" ? "#a8a8a8" : "#858484");
    setAldVar(vars, "text/text-normal-text-caption-white", "#a8a8a8");
    setAldVar(vars, "normal-background-theme", mode === "dark" ? "#1a1a1a" : "#FAF8F8");
}
/** Primary-tinted ALD semantic tokens — follow palette steps (Figma token-colors). */
function syncPrimarySemanticTokens(vars) {
    const step = (n) => vars[aliasToCssVar(`primary/primary-${n}`)];
    setAldVar(vars, "text/text-theme-primary-black", step(SEMANTIC_STEP_MAP.textPrimary));
    setAldVar(vars, "text/text-theme-secondary-black", step(SEMANTIC_STEP_MAP.textSecondary));
    setAldVar(vars, "text/text-theme-light-black", step(SEMANTIC_STEP_MAP.textLight));
    setAldVar(vars, "box/box-theme-secondarybackground", step(SEMANTIC_STEP_MAP.secondaryBackground));
    setAldVar(vars, "box/box-theme-lightbackground", step(SEMANTIC_STEP_MAP.lightBackground));
    setAldVar(vars, "control/control-theme-background", step(SEMANTIC_STEP_MAP.controlBackground));
    setAldVar(vars, "border/border-theme-primary", step(SEMANTIC_STEP_MAP.primaryBorder));
}
export function generateTheme(input = {}) {
    const mode = input.mode ?? "light";
    const primary = input.primary ?? DEFAULT_PRIMARY;
    const paletteConfig = resolvePaletteConfig(input.palette);
    const vars = {};
    vars["--aviala-mode"] = mode;
    const familyColors = {
        ...DEFAULT_SEMANTIC_COLORS,
        primary,
    };
    for (const family of COLOR_FAMILIES) {
        const color = familyColors[family];
        // Only the primary family blends toward the theme mix color.
        const familyConfig = family === "primary"
            ? paletteConfig
            : { ...paletteConfig, mixColor: undefined, mixRatio: 0 };
        const stepMap = buildFamilyPalette(color, mode, familyConfig);
        for (let step = 1; step <= 12; step++) {
            const key = familyKey(family, step);
            vars[aliasToCssVar(key)] = stepMap[step];
        }
    }
    syncPrimarySemanticTokens(vars);
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
export function themeVarsToCssText(vars) {
    return `:root {\n${Object.entries(vars)
        .map(([k, v]) => `  ${k}: ${v};`)
        .join("\n")}\n}`;
}
