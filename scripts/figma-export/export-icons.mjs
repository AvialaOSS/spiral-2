/**
 * Export icon SVGs from Figma Icons file into packages/icons/raw/
 * Requires FIGMA_ACCESS_TOKEN and FIGMA_FILE_ICONS env vars.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const token = process.env.FIGMA_ACCESS_TOKEN;
const fileKey = process.env.FIGMA_FILE_ICONS || "kLrxJHsDob2VoX7PfkD5PW";
const outDir = join(__dirname, "../../packages/icons/raw");

if (!token) {
  console.error("Set FIGMA_ACCESS_TOKEN to export icons from Figma.");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

async function figmaFetch(path: string) {
  const res = await fetch(`https://api.figma.com/v1${path}`, {
    headers: { "X-Figma-Token": token! },
  });
  if (!res.ok) throw new Error(`Figma API ${res.status}: ${await res.text()}`);
  return res.json();
}

const file = await figmaFetch(`/files/${fileKey}?depth=1`);
const components = file.components || {};
const componentIds = Object.keys(components);

if (componentIds.length === 0) {
  console.log("No components found; using existing raw/ SVGs.");
  process.exit(0);
}

const images = await figmaFetch(
  `/images/${fileKey}?ids=${componentIds.slice(0, 50).join(",")}&format=svg`
);

let count = 0;
for (const [id, meta] of Object.entries(components) as [string, { name: string }][]) {
  const url = images.images?.[id];
  if (!url) continue;
  const svgRes = await fetch(url);
  const svg = await svgRes.text();
  const name = meta.name.replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase();
  writeFileSync(join(outDir, `${name}.svg`), svg);
  count++;
}

console.log(`Exported ${count} icons to ${outDir}`);
