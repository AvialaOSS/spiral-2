import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Pure CSS-generation functions for @aviala-design/tokens.
 *
 * Every function takes the tokens package root as its first argument so the
 * logic can be shared between:
 *   - scripts/build-css.mjs  (CLI — writes dist/*.css for publish/CI)
 *   - vite-plugin.mjs        (dev — generates the same CSS on the fly)
 */

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
function buildNumberTokensBlock(root, selector, relativePath) {
  const json = JSON.parse(
    readFileSync(join(root, "source/ald/Components", relativePath), "utf8")
  );

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

export function buildNumberTokensCss(root) {
  return (
    buildNumberTokensBlock(root, ":root", BASE_NUMBERS_FILES.default) +
    buildNumberTokensBlock(
      root,
      '[data-density="mobile-friendly"]',
      BASE_NUMBERS_FILES["mobile-friendly"]
    )
  );
}

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
function loadPrimitives(root, modeFile) {
  const flat = flattenColorTokens(
    readJson(join(root, "source/ald/Aviala Design Colors", modeFile))
  );
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

function buildAldModeVars(root, modeFile) {
  const aldRoot = join(root, "source/ald/Components");
  const primitives = loadPrimitives(root, modeFile);
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

export function buildAldThemeCss(root) {
  const light = buildAldModeVars(root, "Light.tokens.json");
  const dark = buildAldModeVars(root, "Dark.tokens.json");
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

/* ------------------------------------------------------------------ *
 * Combined styles.css (design tokens + base layer pieces)
 * ------------------------------------------------------------------ */

const STYLES_MERGE_FILES = [
  "src/semantic/colors.css",
  "src/semantic/components.css",
  "src/semantic/theme.css",
  "src/non-color/radius.css",
  "src/non-color/typography.css",
];

export function buildCombinedStylesCss(root) {
  const merged = STYLES_MERGE_FILES.map((f) =>
    readFileSync(join(root, f), "utf8")
  ).join("\n");
  const focusEffectsCss = readFileSync(
    join(root, "src/semantic/focus-effects.css"),
    "utf8"
  );
  return (
    "/* Generated from ALD base-numbers — do not edit by hand */\n" +
    buildNumberTokensCss(root) +
    "\n" +
    merged +
    "\n" +
    focusEffectsCss +
    "\n"
  );
}

/* ------------------------------------------------------------------ *
 * Individual component-effects stylesheets (served 1:1 from src/semantic)
 * ------------------------------------------------------------------ */

const STANDALONE_CSS_RE = /-(effects|extras)\.css$/;

/**
 * List the standalone semantic stylesheets ("button-effects.css",
 * "information-display-extras.css", …) with their absolute paths.
 */
export function listStandaloneCssFiles(root) {
  const dir = join(root, "src/semantic");
  return readdirSync(dir)
    .filter((name) => STANDALONE_CSS_RE.test(name))
    .map((name) => ({ name, path: join(dir, name) }));
}

/**
 * Resolve a `@aviala-design/tokens/<name>.css` subpath to its source file in
 * src/semantic, or null when it is not a standalone stylesheet (e.g.
 * styles.css / ald-theme.css are generated instead).
 */
export function resolveStandaloneCssSource(root, name) {
  if (!STANDALONE_CSS_RE.test(name)) return null;
  const path = join(root, "src/semantic", name);
  try {
    readFileSync(path, "utf8");
    return path;
  } catch {
    return null;
  }
}
