import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const tokensCss = readFileSync(
  join(__dirname, "../../tokens/dist/styles.css"),
  "utf8"
);
const dist = join(__dirname, "../dist");

mkdirSync(dist, { recursive: true });

const css = `${tokensCss}

@layer base {
  * {
    border-color: var(--border);
  }
  body {
    background-color: var(--background);
    color: var(--foreground);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }
}
`;

writeFileSync(join(dist, "styles.css"), css);
console.log("Built dist/styles.css");

function patchKeyboardFocusDts(filePath) {
  let content = readFileSync(filePath, "utf8");
  if (content.includes("initKeyboardFocus")) return;

  content = content.replace(
    /declare function cn\(/,
    '/** Toggle `html[data-aviala-keyboard-focus]` for keyboard-only focus ring CSS. */\ndeclare function initKeyboardFocus(): void;\ndeclare function cn('
  );
  content = content.replace(
    /ThemeScript, Tooltip,/,
    "ThemeScript, initKeyboardFocus, Tooltip,"
  );
  writeFileSync(filePath, content);
}

for (const file of ["index.d.ts", "index.d.cts"]) {
  patchKeyboardFocusDts(join(dist, file));
}
