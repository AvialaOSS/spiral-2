import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  BASE_NUMBERS_FILES,
  type BaseNumbersDensity,
} from "./base-numbers";
import {
  flattenTokens,
  resolveTokenHex,
  resolveTokenNumber,
  tokenPathToCssVar,
  type RawTokenTree,
} from "./parse-ald";
import type { ThemeMode, ThemeVars } from "./generate-theme";

export type { BaseNumbersDensity } from "./base-numbers";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Resolve ALD root for both src/engine (dev) and dist (published) layouts. */
function resolveAldRoot(): string {
  const candidates = [
    join(__dirname, "../../source/ald"), // packages/tokens/src/engine
    join(__dirname, "../source/ald"), // packages/tokens/dist
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  return candidates[0]!;
}

const ALD_ROOT = resolveAldRoot();

function readJson(relativePath: string): RawTokenTree {
  const full = join(ALD_ROOT, relativePath);
  return JSON.parse(readFileSync(full, "utf8")) as RawTokenTree;
}

function loadPrimitivePalette(mode: ThemeMode): Record<string, string> {
  const file =
    mode === "dark"
      ? "Aviala Design Colors/Dark.tokens.json"
      : "Aviala Design Colors/Light.tokens.json";
  const tokens = flattenTokens(readJson(file));
  const palette: Record<string, string> = {};

  for (const [path, token] of Object.entries(tokens)) {
    const hex = resolveTokenHex(token, palette);
    if (hex) palette[path] = hex;
  }

  return palette;
}

function loadSemanticColors(palette: Record<string, string>): ThemeVars {
  const tokens = flattenTokens(
    readJson("Components/token-colors/Default.tokens.json")
  );
  const vars: ThemeVars = {};

  for (const [path, token] of Object.entries(tokens)) {
    const hex = resolveTokenHex(token, palette);
    if (hex) vars[tokenPathToCssVar(path)] = hex;
  }

  return vars;
}

function loadControlColors(palette: Record<string, string>): ThemeVars {
  // The control export is flat (keys already start with "control-"); force the
  // "control/" group so names match the semantic layer (--control-control-*).
  const tokens = flattenTokens(
    readJson("Components/control/default.tokens.json"),
    "control"
  );
  const vars: ThemeVars = {};

  for (const [path, token] of Object.entries(tokens)) {
    const hex = resolveTokenHex(token, palette);
    if (hex) vars[tokenPathToCssVar(path)] = hex;
  }

  return vars;
}

/**
 * Match build-css.mjs `leafToVar`: emit the leaf key only (e.g. size/size-regular
 * → --size-regular), not the duplicated group prefix (--size-size-regular).
 */
function baseNumberToCssVar(path: string): string {
  const slash = path.indexOf("/");
  if (slash === -1) return tokenPathToCssVar(path);
  const leaf = path.slice(slash + 1);
  return "--" + leaf.replace(/\s+/g, "-").toLowerCase();
}

function loadBaseNumbers(density: BaseNumbersDensity = "default"): ThemeVars {
  const tokens = flattenTokens(readJson(BASE_NUMBERS_FILES[density]));
  const vars: ThemeVars = {};

  for (const [path, token] of Object.entries(tokens)) {
    const value = resolveTokenNumber(token);
    if (value !== undefined) {
      if (path.startsWith("transparency/") && typeof value === "number") {
        vars[baseNumberToCssVar(path)] = String(value / 100);
      } else {
        vars[baseNumberToCssVar(path)] =
          typeof value === "number" ? `${value}px` : String(value);
      }
    }
  }

  return vars;
}

function loadFontWeights(): ThemeVars {
  const tokens = flattenTokens(
    readJson("Components/font-weight/Mode 1.tokens.json")
  );
  const vars: ThemeVars = {};

  for (const [path, token] of Object.entries(tokens)) {
    const value = resolveTokenNumber(token);
    if (value !== undefined) vars[tokenPathToCssVar(path)] = String(value);
  }

  return vars;
}

export function loadAldTheme(
  mode: ThemeMode = "light",
  density: BaseNumbersDensity = "default"
): ThemeVars {
  const palette = loadPrimitivePalette(mode);
  return {
    ...loadSemanticColors(palette),
    ...loadControlColors(palette),
    ...loadBaseNumbers(density),
    ...loadFontWeights(),
    "--aviala-mode": mode,
    "--aviala-density": density,
  };
}

export function findAldTokenFiles(): string[] {
  const results: string[] = [];

  function walk(dir: string) {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (entry.endsWith(".tokens.json")) results.push(full);
    }
  }

  walk(ALD_ROOT);
  return results;
}
