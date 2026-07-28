import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(dirname, "..");

const source = path.resolve(repoRoot, "apps/spiral-docs/dist");

const hugoWebsite = process.env.HUGO_WEBSITE_PATH
  ? path.resolve(process.env.HUGO_WEBSITE_PATH)
  : path.resolve(repoRoot, "../avialaWebsite");

const targetDir = path.join(hugoWebsite, "static/docs/spiral");
const dataFile = path.join(hugoWebsite, "data/spiraldocs.json");

if (!fs.existsSync(source)) {
  console.error("Missing build output. Run: pnpm --filter @spiral/spiral-docs build");
  process.exit(1);
}

fs.rmSync(targetDir, { recursive: true, force: true });
fs.mkdirSync(targetDir, { recursive: true });
copyDir(source, targetDir);

// Hugo owns /docs/spiral/ (ColorCat pattern) — remove Vite shell HTML
const viteIndex = path.join(targetDir, "index.html");
if (fs.existsSync(viteIndex)) {
  fs.unlinkSync(viteIndex);
  console.log("Removed Vite index.html so Hugo can own /docs/spiral/");
}

const assetVersion = String(Date.now());
fs.mkdirSync(path.dirname(dataFile), { recursive: true });
fs.writeFileSync(
  dataFile,
  `${JSON.stringify({ assetVersion }, null, 2)}\n`,
  "utf8"
);

console.log(`Copied spiral-docs build to ${targetDir}`);
console.log(`Wrote Hugo data assetVersion=${assetVersion} → ${dataFile}`);
console.log(
  "Note: deep links under /docs/spiral/* need the Hugo site root 404.html SPA redirect."
);

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(src, dest);
    else fs.copyFileSync(src, dest);
  }
}
