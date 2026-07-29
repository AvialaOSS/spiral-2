/**
 * Export icon SVGs from Figma component sets into packages/icons/raw/{category}/
 *
 * Figma model:
 *   Component set name:  direction/arrowLeft
 *   Variant (unordered): thickness=Regular, mode=default, name=direction_arrowLeft
 *   Output path:         raw/direction/direction_arrowLeft-regular-default.svg
 *
 * Env (auto-loaded from .env.local):
 *   FIGMA_ACCESS_TOKEN  — required
 *   FIGMA_FILE_ICONS    — optional
 *   ICONS_THICKNESS     — optional filter, comma-separated (e.g. Regular)
 *   ICONS_MODE          — optional filter, comma-separated (e.g. default)
 *   ICONS_CATEGORY      — optional filter, comma-separated (e.g. direction,ai)
 *   ICONS_NAME          — optional filter, comma-separated icon names (e.g. direction_arrowLeft)
 *
 * Usage:
 *   pnpm icons:export
 *   pnpm icons:export:dry
 *   node scripts/figma-export/export-icons.mjs --thickness=Regular --mode=default
 *   node scripts/figma-export/export-icons.mjs --category=direction,ai
 *   node scripts/figma-export/export-icons.mjs --name=direction_arrowLeft
 *   node scripts/figma-export/export-icons.mjs --only=direction_arrowLeft  # alias for --name
 *   node scripts/figma-export/export-icons.mjs --no-clean   # keep stale raw SVGs (not recommended)
 */
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "./lib/load-env.mjs";
import { createFigmaClient } from "./lib/figma-api.mjs";
import {
  componentSetToCategory,
  componentSetToIconName,
  dedupeRelativePath,
  parseVariantName,
  variantToRelativePath,
} from "../../packages/icons/scripts/icon-utils.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "../..");
const outDir = join(rootDir, "packages/icons/raw");
const dryRun = process.argv.includes("--dry-run");
const cleanRaw = !process.argv.includes("--no-clean");

function cleanRawDirectory(dir) {
  if (!existsSync(dir)) return 0;

  let removed = 0;
  for (const entry of readdirSync(dir)) {
    rmSync(join(dir, entry), { recursive: true, force: true });
    removed += 1;
  }
  return removed;
}

function readArg(name) {
  const prefix = `--${name}=`;
  const hit = process.argv.find((arg) => arg.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : undefined;
}

function readFilter(name) {
  const fromArg = readArg(name);
  const fromEnv = process.env[`ICONS_${name.toUpperCase()}`];
  const raw = fromArg ?? fromEnv;
  if (!raw) return null;
  return new Set(
    raw
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)
  );
}

/** Case-insensitive set membership for category / icon name filters. */
function filterHas(filter, value) {
  if (!filter || !value) return false;
  const needle = value.toLowerCase();
  for (const entry of filter) {
    if (entry.toLowerCase() === needle) return true;
  }
  return false;
}

loadEnv(rootDir);

const token = process.env.FIGMA_ACCESS_TOKEN;
const fileKey = process.env.FIGMA_FILE_ICONS || "kLrxJHsDob2VoX7PfkD5PW";
const thicknessFilter = readFilter("thickness");
const modeFilter = readFilter("mode");
const categoryFilter = readFilter("category");
const nameFilter = readFilter("name") ?? readFilter("only");

if (!token) {
  console.error("FIGMA_ACCESS_TOKEN is missing.");
  console.error("Copy .env.example → .env.local and set your token.");
  process.exit(1);
}

const client = createFigmaClient(token);

console.log(`Figma icons file: ${fileKey}`);
if (thicknessFilter) console.log(`Filter thickness: ${[...thicknessFilter].join(", ")}`);
if (modeFilter) console.log(`Filter mode: ${[...modeFilter].join(", ")}`);
if (categoryFilter) console.log(`Filter category: ${[...categoryFilter].join(", ")}`);
if (nameFilter) console.log(`Filter name: ${[...nameFilter].join(", ")}`);
console.log(dryRun ? "Dry run — no files will be written." : `Output: ${outDir}`);

const [componentSets, components] = await Promise.all([
  client.listComponentSets(fileKey),
  client.listComponents(fileKey),
]);

const exportableSets = componentSets.filter((set) => {
  const name = set.name?.trim() ?? "";
  return name.length > 0 && !name.startsWith("_") && !name.startsWith(".");
});

console.log(`Found ${exportableSets.length} component set(s), ${components.length} component(s).`);

/** node_id → { setName, category } from component-set children */
const nodeToSet = new Map();

if (exportableSets.length > 0) {
  const setNodes = await client.fetchNodes(
    fileKey,
    exportableSets.map((set) => set.node_id),
    2
  );

  for (const set of exportableSets) {
    const category = componentSetToCategory(set.name);
    const document = setNodes[set.node_id]?.document;
    const children = document?.children ?? [];

    for (const child of children) {
      if (child.type === "COMPONENT") {
        nodeToSet.set(child.id, { setName: set.name, category });
      }
    }
  }
}

const usedPaths = new Set();
const plan = [];

for (const component of components) {
  const variant = parseVariantName(component.name ?? "");
  if (!variant.name || !variant.thickness || !variant.mode) continue;

  if (thicknessFilter && !thicknessFilter.has(variant.thickness)) continue;
  if (modeFilter && !modeFilter.has(variant.mode)) continue;

  const setInfo = nodeToSet.get(component.node_id);
  const category = setInfo?.category ?? (variant.name.split("_")[0] || "uncategorized");
  const iconName = setInfo?.setName
    ? componentSetToIconName(setInfo.setName) ?? variant.name
    : variant.name;

  if (categoryFilter && !filterHas(categoryFilter, category)) continue;
  if (nameFilter && !filterHas(nameFilter, iconName) && !filterHas(nameFilter, variant.name)) {
    continue;
  }

  const relativePath = dedupeRelativePath(
    variantToRelativePath(category, { ...variant, name: iconName }) ??
      `${category}/${iconName}-${variant.thickness}-${variant.mode}`.toLowerCase(),
    usedPaths
  );

  plan.push({
    nodeId: component.node_id,
    setName: setInfo?.setName ?? null,
    category,
    iconName,
    variant,
    relativePath,
  });
}

plan.sort((a, b) => a.relativePath.localeCompare(b.relativePath));

if (plan.length === 0) {
  console.log("No matching icon variants found.");
  process.exit(0);
}

console.log(`Prepared ${plan.length} variant(s) for export.`);

if (!dryRun && cleanRaw) {
  const removed = cleanRawDirectory(outDir);
  if (removed > 0) console.log(`Cleaned ${removed} existing item(s) from ${outDir}`);
}

if (dryRun) {
  for (const item of plan.slice(0, 20)) {
    console.log(
      `  ${item.setName ?? "(no set)"} → ${item.relativePath}.svg  [${item.variant.thickness}, ${item.variant.mode}]`
    );
  }
  if (plan.length > 20) console.log(`  … and ${plan.length - 20} more`);
  process.exit(0);
}

const svgUrls = await client.fetchSvgUrls(
  fileKey,
  plan.map((item) => item.nodeId)
);

async function downloadSvg(url, attempt = 0) {
  const res = await fetch(url);
  if (res.status === 429 && attempt < 6) {
    const wait = Math.min(30_000, 2_000 * 2 ** (attempt + 1));
    await new Promise((resolve) => setTimeout(resolve, wait));
    return downloadSvg(url, attempt + 1);
  }
  return res;
}

let exported = 0;
let skipped = 0;
const manifest = {
  exportedAt: new Date().toISOString(),
  fileKey,
  filters: {
    thickness: thicknessFilter ? [...thicknessFilter] : null,
    mode: modeFilter ? [...modeFilter] : null,
    category: categoryFilter ? [...categoryFilter] : null,
    name: nameFilter ? [...nameFilter] : null,
  },
  count: 0,
  icons: [],
};

for (const item of plan) {
  const url = svgUrls.get(item.nodeId);
  if (!url) {
    skipped += 1;
    console.warn(`  skip (no SVG URL): ${item.relativePath}`);
    continue;
  }

  const svgRes = await downloadSvg(url);
  if (!svgRes.ok) {
    skipped += 1;
    console.warn(`  skip (download ${svgRes.status}): ${item.relativePath}`);
    continue;
  }

  const svg = await svgRes.text();
  const target = join(outDir, `${item.relativePath}.svg`);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, svg);

  manifest.icons.push({
    file: `${item.relativePath}.svg`,
    componentSet: item.setName,
    category: item.category,
    name: item.iconName,
    variantName: item.variant.name,
    thickness: item.variant.thickness,
    mode: item.variant.mode,
    nodeId: item.nodeId,
  });
  exported += 1;
}

manifest.count = exported;
writeFileSync(join(outDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`Exported ${exported} icon variant(s) to ${outDir}`);
if (skipped > 0) console.log(`Skipped ${skipped} variant(s).`);
console.log("Next: pnpm icons:build");
