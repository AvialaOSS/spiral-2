import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  flattenTokens,
  resolveTokenHex,
  resolveTokenNumber,
  tokenPathToCssVar,
  type RawTokenTree,
} from "./parse-ald";
import type { ThemeMode, ThemeVars } from "./generate-theme";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ALD_ROOT = join(__dirname, "../../source/ald");

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
  const tokens = flattenTokens(
    readJson("Components/control/default.tokens.json")
  );
  const vars: ThemeVars = {};

  for (const [path, token] of Object.entries(tokens)) {
    const hex = resolveTokenHex(token, palette);
    if (hex) vars[tokenPathToCssVar(path)] = hex;
  }

  return vars;
}

function loadBaseNumbers(): ThemeVars {
  const tokens = flattenTokens(
    readJson("Components/base-numbers/Mode 1.tokens.json")
  );
  const vars: ThemeVars = {};

  for (const [path, token] of Object.entries(tokens)) {
    const value = resolveTokenNumber(token);
    if (value !== undefined) {
      vars[tokenPathToCssVar(path)] =
        typeof value === "number" ? `${value}px` : String(value);
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

export function loadAldTheme(mode: ThemeMode = "light"): ThemeVars {
  const palette = loadPrimitivePalette(mode);
  return {
    ...loadSemanticColors(palette),
    ...loadControlColors(palette),
    ...loadBaseNumbers(),
    ...loadFontWeights(),
    "--aviala-mode": mode,
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
