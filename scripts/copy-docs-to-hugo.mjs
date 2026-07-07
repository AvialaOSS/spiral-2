import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(dirname, "..");

const source = path.resolve(repoRoot, "apps/spiral-docs/dist");
const target = path.resolve(repoRoot, "../avialaWebsite/static/docs/spiral");

const hugoWebsite = process.env.HUGO_WEBSITE_PATH
  ? path.resolve(process.env.HUGO_WEBSITE_PATH)
  : path.resolve(repoRoot, "../avialaWebsite");

const targetDir = path.join(hugoWebsite, "static/docs/spiral");

if (!fs.existsSync(source)) {
  console.error("Missing build output. Run: pnpm --filter @spiral/spiral-docs build");
  process.exit(1);
}

fs.rmSync(targetDir, { recursive: true, force: true });
fs.mkdirSync(targetDir, { recursive: true });
copyDir(source, targetDir);

console.log(`Copied spiral-docs build to ${targetDir}`);

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(src, dest);
    else fs.copyFileSync(src, dest);
  }
}
