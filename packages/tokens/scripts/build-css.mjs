import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const distDir = join(root, "dist");
const aldRoot = join(root, "source/ald/Components");
const aldColorsRoot = join(root, "source/ald/Aviala Design Colors");

mkdirSync(distDir, { recursive: true });

/** Normalize an ALD token leaf key to a CSS custom property name (single-prefix, kebab). */
function leafToVar(leaf) {
  return "--" + leaf.replace(/\s+/g, "-").toLowerCase();
}

const BASE_NUMBERS_FILES = {
  default: "base-numbers/Default.tokens.json",
  "mobile-friendly": "base-numbers/Mobile Friendly.tokens.json",
};

/** Convert a design px number to rem (16px = 1rem), trimming trailing zeros. */
function pxToRem(value) {
  const rem = value / 16;
  const formatted = Number.isInteger(rem)
    ? String(rem)
    : rem.toFixed(4).replace(/\.?0+$/, "");
  return `${formatted}rem`;
}

/**
 * Emit ALD numeric tokens (size / gap / radius / thickness / line-height / padding)
 * as real CSS variables so components stop relying on hardcoded fallbacks.
 *
 * Size + line-height use rem so type and related chrome scale with root font-size;
 * gap / padding / radius / thickness stay px.
 */
function buildNumberTokensBlock(selector, relativePath) {
  const json = JSON.parse(readFileSync(join(aldRoot, relativePath), "utf8"));

  const remGroups = new Set(["size", "line-height"]);
  const pxGroups = new Set([
    "gap",
    "border-radius",
    "border-thickness",
    "padding",
  ]);
  const opacityGroups = new Set(["transparency"]);

  const lines = [`${selector} {`];

  for (const [group, tokens] of Object.entries(json)) {
    if (group === "$extensions" || typeof tokens !== "object") continue;
    for (const [leaf, token] of Object.entries(tokens)) {
      if (!token || typeof token !== "object" || token.$type !== "number") continue;
      const value = token.$value;
      let cssValue;
      if (opacityGroups.has(group)) {
        cssValue = value / 100;
      } else if (remGroups.has(group)) {
        cssValue = pxToRem(value);
      } else if (pxGroups.has(group)) {
        cssValue = `${value}px`;
      } else {
        cssValue = value;
      }
      lines.push(`  ${leafToVar(leaf)}: ${cssValue};`);
    }
  }

  lines.push("}");
  return lines.join("\n") + "\n";
}

function buildNumberTokensCss() {
  return (
    buildNumberTokensBlock(":root", BASE_NUMBERS_FILES.default) +
    buildNumberTokensBlock(
      '[data-density="mobile-friendly"]',
      BASE_NUMBERS_FILES["mobile-friendly"]
    )
  );
}

const numberTokensCss = buildNumberTokensCss();

/* ------------------------------------------------------------------ *
 * Frozen ALD theme ([data-theme="ald"])
 *
 * Resolves the 11 Figma-exported ALD token files into literal hex values
 * for both light & dark modes. The result is an *unchanging* theme that
 * follows the design exports verbatim (no runtime palette generation).
 * ------------------------------------------------------------------ */

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

/** Flatten an ALD token tree to { "group/leaf": tokenNode }. */
function flattenColorTokens(tree, prefix = "") {
  const out = {};
  for (const [key, node] of Object.entries(tree)) {
    if (key.startsWith("$")) continue;
    if (!node || typeof node !== "object") continue;
    const path = prefix ? `${prefix}/${key}` : key;
    if (node.$type) out[path] = node;
    else Object.assign(out, flattenColorTokens(node, path));
  }
  return out;
}

function tokenHex(token) {
  const v = token?.$value;
  if (v && typeof v === "object" && typeof v.hex === "string") {
    const alpha = typeof v.alpha === "number" ? v.alpha : 1;
    if (alpha >= 1) return v.hex.toUpperCase();
    const hex = v.hex.replace("#", "");
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return undefined;
}

function tokenAlias(token) {
  return token?.$extensions?.["com.figma.aliasData"]?.targetVariableName;
}

function pathToVar(path) {
  return "--" + path.replace(/\//g, "-").toLowerCase();
}

/** Build the resolved primitive ramp ("primary/primary-8" -> "#FF856B") for a mode. */
function loadPrimitives(modeFile) {
  const flat = flattenColorTokens(readJson(join(aldColorsRoot, modeFile)));
  const map = {};
  for (const [path, token] of Object.entries(flat)) {
    const hex = tokenHex(token);
    if (hex) map[path] = hex;
  }
  return map;
}

function resolveToken(token, primitives) {
  // Semantic/control tokens bake the *light* hex into $value alongside an alias
  // to the primitive ramp. Follow the alias first so dark mode resolves against
  // the dark primitives; only fall back to the literal hex when there is no alias.
  const alias = tokenAlias(token);
  if (alias && primitives[alias]) return primitives[alias];
  return tokenHex(token);
}

function buildAldModeVars(modeFile) {
  const primitives = loadPrimitives(modeFile);
  const vars = {};

  for (const [path, hex] of Object.entries(primitives)) {
    vars["--aviala-" + path.replace(/\//g, "-").toLowerCase()] = hex;
  }

  const semantic = flattenColorTokens(
    readJson(join(aldRoot, "token-colors/Default.tokens.json"))
  );
  for (const [path, token] of Object.entries(semantic)) {
    const hex = resolveToken(token, primitives);
    if (hex) vars[pathToVar(path)] = hex;
  }

  // The control file is flat (keys already start with "control-"); force the
  // "control/" group so names match the semantic layer (--control-control-*).
  const control = flattenColorTokens(
    readJson(join(aldRoot, "control/default.tokens.json"))
  );
  for (const [path, token] of Object.entries(control)) {
    const hex = resolveToken(token, primitives);
    if (hex) vars["--control-" + path.replace(/\//g, "-").toLowerCase()] = hex;
  }

  // shadcn aliases — emitted as literal hex so the frozen theme is fully
  // self-contained and overrides the generic [data-mode="dark"] fallbacks.
  const g = (name) => vars[name];
  const set = (key, value) => {
    if (value) vars[key] = value;
  };
  // ALD has no `border-theme-light`; the real neutral border is `border-normal-light`.
  set("--border-border-theme-light", g("--border-border-normal-light"));

  set("--background", g("--normal-background-theme"));
  set("--foreground", g("--text-text-normal-text-black"));
  set("--primary", g("--control-control-theme-background"));
  vars["--primary-foreground"] = "#FFFFFF";
  set("--secondary", g("--control-control-normal-lightbackground-deep"));
  set("--secondary-foreground", g("--text-text-normal-text-black"));
  set("--muted", g("--control-control-normal-lightbackground-light"));
  set("--muted-foreground", g("--text-text-normal-text-caption-black"));
  set("--accent", g("--control-control-normal-lightbackground-light"));
  set("--accent-foreground", g("--text-text-normal-text-black"));
  set("--destructive", g("--control-control-fail-background"));
  vars["--destructive-foreground"] = "#FFFFFF";
  set("--border", g("--border-border-normal-light"));
  set("--input", g("--border-border-normal-light"));
  set("--ring", g("--border-border-theme-primary"));
  // --card / --popover stay neutral surfaces (inherited from the base layer);
  // ALD has no dedicated neutral card token and box-theme-*Background is the
  // primary-tinted container, not a surface.

  return vars;
}

function varsToCssBlock(selector, vars) {
  const lines = [`${selector} {`];
  for (const [key, value] of Object.entries(vars)) {
    lines.push(`  ${key}: ${value};`);
  }
  lines.push("}");
  return lines.join("\n");
}

function buildAldThemeCss() {
  const light = buildAldModeVars("Light.tokens.json");
  const dark = buildAldModeVars("Dark.tokens.json");
  return (
    "/* Frozen ALD theme — generated from Figma token exports, do not edit by hand */\n" +
    // Prefer :root[data-theme] so ALD beats a later :root colors block
    // (equal specificity with bare [data-theme] loses to source order).
    varsToCssBlock(':root[data-theme="ald"]', light) +
    "\n" +
    varsToCssBlock(':root[data-theme="ald"][data-mode="dark"]', dark) +
    "\n"
  );
}

const aldThemeCss = buildAldThemeCss();

const cssFiles = [
  "src/semantic/colors.css",
  "src/semantic/components.css",
  "src/semantic/theme.css",
  "src/non-color/radius.css",
  "src/non-color/typography.css",
];

const buttonEffectsCss = readFileSync(
  join(root, "src/semantic/button-effects.css"),
  "utf8"
);

const inputEffectsCss = readFileSync(
  join(root, "src/semantic/input-effects.css"),
  "utf8"
);

const basicInputEffectsCss = readFileSync(
  join(root, "src/semantic/basic-input-effects.css"),
  "utf8"
);

const colorPickerEffectsCss = readFileSync(
  join(root, "src/semantic/color-picker-effects.css"),
  "utf8"
);

const loadingEffectsCss = readFileSync(
  join(root, "src/semantic/loading-effects.css"),
  "utf8"
);

const iconEffectsCss = readFileSync(
  join(root, "src/semantic/icon-effects.css"),
  "utf8"
);

const typefaceEffectsCss = readFileSync(
  join(root, "src/semantic/typeface-effects.css"),
  "utf8"
);

const cascaderEffectsCss = readFileSync(
  join(root, "src/semantic/cascader-effects.css"),
  "utf8"
);

const popoverEffectsCss = readFileSync(
  join(root, "src/semantic/popover-effects.css"),
  "utf8"
);

const modalEffectsCss = readFileSync(
  join(root, "src/semantic/modal-effects.css"),
  "utf8"
);

const tooltipEffectsCss = readFileSync(
  join(root, "src/semantic/tooltip-effects.css"),
  "utf8"
);

const listEffectsCss = readFileSync(
  join(root, "src/semantic/list-effects.css"),
  "utf8"
);

const datepickerEffectsCss = readFileSync(
  join(root, "src/semantic/datepicker-effects.css"),
  "utf8"
);

const feedbackEffectsCss = readFileSync(
  join(root, "src/semantic/feedback-effects.css"),
  "utf8"
);

const alertEffectsCss = readFileSync(
  join(root, "src/semantic/alert-effects.css"),
  "utf8"
);

const navigationEffectsCss = readFileSync(
  join(root, "src/semantic/navigation-effects.css"),
  "utf8"
);

const focusEffectsCss = readFileSync(
  join(root, "src/semantic/focus-effects.css"),
  "utf8"
);

const badgeEffectsCss = readFileSync(
  join(root, "src/semantic/badge-effects.css"),
  "utf8"
);

const progressEffectsCss = readFileSync(
  join(root, "src/semantic/progress-effects.css"),
  "utf8"
);

const layoutEffectsCss = readFileSync(
  join(root, "src/semantic/layout-effects.css"),
  "utf8"
);

const informationDisplayExtrasCss = readFileSync(
  join(root, "src/semantic/information-display-extras.css"),
  "utf8"
);

const informationCollectExtrasCss = readFileSync(
  join(root, "src/semantic/information-collect-extras.css"),
  "utf8"
);

const structureNavigationExtrasCss = readFileSync(
  join(root, "src/semantic/structure-navigation-extras.css"),
  "utf8"
);

const combined =
  "/* Generated from ALD base-numbers — do not edit by hand */\n" +
  numberTokensCss +
  "\n" +
  cssFiles.map((f) => readFileSync(join(root, f), "utf8")).join("\n") +
  "\n" +
  focusEffectsCss +
  "\n";

writeFileSync(join(distDir, "styles.css"), combined);
writeFileSync(join(distDir, "ald-theme.css"), aldThemeCss);
writeFileSync(join(distDir, "button-effects.css"), buttonEffectsCss);
writeFileSync(join(distDir, "input-effects.css"), inputEffectsCss);
writeFileSync(join(distDir, "basic-input-effects.css"), basicInputEffectsCss);
writeFileSync(join(distDir, "color-picker-effects.css"), colorPickerEffectsCss);
writeFileSync(join(distDir, "loading-effects.css"), loadingEffectsCss);
writeFileSync(join(distDir, "icon-effects.css"), iconEffectsCss);
writeFileSync(join(distDir, "typeface-effects.css"), typefaceEffectsCss);
writeFileSync(join(distDir, "cascader-effects.css"), cascaderEffectsCss);
writeFileSync(join(distDir, "popover-effects.css"), popoverEffectsCss);
writeFileSync(join(distDir, "modal-effects.css"), modalEffectsCss);
writeFileSync(join(distDir, "tooltip-effects.css"), tooltipEffectsCss);
writeFileSync(join(distDir, "list-effects.css"), listEffectsCss);
writeFileSync(join(distDir, "datepicker-effects.css"), datepickerEffectsCss);
writeFileSync(join(distDir, "feedback-effects.css"), feedbackEffectsCss);
writeFileSync(join(distDir, "alert-effects.css"), alertEffectsCss);
writeFileSync(join(distDir, "navigation-effects.css"), navigationEffectsCss);
writeFileSync(join(distDir, "focus-effects.css"), focusEffectsCss);
writeFileSync(join(distDir, "badge-effects.css"), badgeEffectsCss);
writeFileSync(join(distDir, "progress-effects.css"), progressEffectsCss);
writeFileSync(join(distDir, "layout-effects.css"), layoutEffectsCss);
writeFileSync(join(distDir, "information-display-extras.css"), informationDisplayExtrasCss);
writeFileSync(join(distDir, "information-collect-extras.css"), informationCollectExtrasCss);
writeFileSync(join(distDir, "structure-navigation-extras.css"), structureNavigationExtrasCss);
console.log(
  "Built dist/styles.css + dist/ald-theme.css + component effects (including badge/progress/layout/information-*/structure-navigation-extras)"
);
