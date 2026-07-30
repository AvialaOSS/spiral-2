import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildAldThemeCss,
  buildCombinedStylesCss,
  listStandaloneCssFiles,
} from "./css-lib.mjs";

/**
 * CLI: generate all publishable CSS artifacts into dist/.
 * The generation logic lives in css-lib.mjs so the dev-time Vite plugin
 * (../vite-plugin.mjs) can produce the exact same CSS without a build.
 */
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const distDir = join(root, "dist");

mkdirSync(distDir, { recursive: true });

writeFileSync(join(distDir, "styles.css"), buildCombinedStylesCss(root));
writeFileSync(join(distDir, "ald-theme.css"), buildAldThemeCss(root));

for (const { name, path } of listStandaloneCssFiles(root)) {
  writeFileSync(join(distDir, name), readFileSync(path, "utf8"));
}

console.log(
  "Built dist/styles.css + dist/ald-theme.css + component effects (including badge/progress/layout/information-*/structure-navigation-extras)"
);
