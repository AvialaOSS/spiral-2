import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const distDir = join(root, "dist");

mkdirSync(distDir, { recursive: true });

const cssFiles = [
  "src/semantic/colors.css",
  "src/semantic/components.css",
  "src/semantic/theme.css",
  "src/non-color/radius.css",
  "src/non-color/typography.css",
];

const combined = cssFiles
  .map((f) => readFileSync(join(root, f), "utf8"))
  .join("\n");

writeFileSync(join(distDir, "styles.css"), combined);
console.log("Built dist/styles.css");
